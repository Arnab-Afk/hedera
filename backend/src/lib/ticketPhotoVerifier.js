const crypto = require('crypto');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function extractBase64Payload(dataUrl) {
  if (typeof dataUrl !== 'string') {
    throw new Error('imageDataUrl must be a string');
  }

  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) {
    throw new Error('Invalid imageDataUrl format; expected data URL');
  }

  const mimeType = match[1].toLowerCase();
  const payload = match[2];

  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mimeType)) {
    throw new Error('Only JPEG, PNG, and WEBP images are supported');
  }

  return { mimeType, payload };
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (!fenced) throw new Error('Model did not return valid JSON');
    return JSON.parse(fenced[1]);
  }
}

function normalizeModelOutput(parsed) {
  const ticketId = typeof parsed.ticketId === 'string' ? parsed.ticketId.trim() : '';
  const issueDate = typeof parsed.issueDate === 'string' ? parsed.issueDate.trim() : '';
  const operator = typeof parsed.operator === 'string' ? parsed.operator.trim() : '';
  const transportType = typeof parsed.transportType === 'string' ? parsed.transportType.trim().toLowerCase() : 'unknown';
  const oneWayDistanceKm = Number.isFinite(Number(parsed.oneWayDistanceKm)) ? Number(parsed.oneWayDistanceKm) : 0;
  const confidence = Number.isFinite(Number(parsed.confidence)) ? Math.max(0, Math.min(1, Number(parsed.confidence))) : 0;

  return {
    isValidTransitTicket: Boolean(parsed.isValidTransitTicket),
    confidence,
    transportType,
    oneWayDistanceKm: Math.max(0, oneWayDistanceKm),
    ticketId,
    issueDate,
    operator,
    reasoning: typeof parsed.reasoning === 'string' ? parsed.reasoning.trim() : 'No reasoning provided',
  };
}

function buildTicketFingerprint(fields) {
  const raw = [
    fields.ticketId || 'none',
    fields.issueDate || 'none',
    fields.operator || 'none',
    fields.transportType || 'unknown',
    String(fields.oneWayDistanceKm || 0),
  ].join('|');

  return crypto.createHash('sha256').update(raw).digest('hex');
}

function estimateCo2SavedKg(transportType, oneWayDistanceKm) {
  // Rough comparison against average single-passenger petrol car emissions.
  const carKgPerKm = 0.192;
  const transitKgPerKm = {
    bus: 0.105,
    metro: 0.041,
    train: 0.035,
    tram: 0.03,
    ferry: 0.115,
    unknown: 0.09,
  };

  const baseline = transitKgPerKm[transportType] ?? transitKgPerKm.unknown;
  const delta = Math.max(0, carKgPerKm - baseline);
  const estimated = delta * Math.max(0, oneWayDistanceKm);
  return Math.round(estimated * 1000) / 1000;
}

async function verifyTicketWithOpenRouter({ imageDataUrl }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured on backend');
  }

  const { payload, mimeType } = extractBase64Payload(imageDataUrl);

  const prompt = [
    'You are a strict transit ticket verifier.',
    'Analyze the provided image and decide if it is a genuine public transit ticket/passes/boarding proof.',
    'Return only JSON with this exact shape:',
    '{',
    '  "isValidTransitTicket": boolean,',
    '  "confidence": number,',
    '  "transportType": "bus"|"metro"|"train"|"tram"|"ferry"|"unknown",',
    '  "oneWayDistanceKm": number,',
    '  "ticketId": string,',
    '  "issueDate": string,',
    '  "operator": string,',
    '  "reasoning": string',
    '}',
    'Rules:',
    '- If uncertain, set isValidTransitTicket=false.',
    '- Keep confidence in range [0,1].',
    '- Estimate oneWayDistanceKm conservatively; use 0 if unknown.',
    '- Do not include markdown or prose outside JSON.',
  ].join('\n');

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3001',
      'X-Title': process.env.SITE_NAME || 'Wisp Backend',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${payload}` } },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenRouter request failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenRouter returned empty content');
  }

  const normalized = normalizeModelOutput(safeJsonParse(content));
  const imageHash = crypto.createHash('sha256').update(payload).digest('hex');
  const ticketFingerprint = buildTicketFingerprint(normalized);
  const estimatedCo2SavedKg = estimateCo2SavedKg(normalized.transportType, normalized.oneWayDistanceKm);

  return {
    ...normalized,
    imageHash,
    ticketFingerprint,
    estimatedCo2SavedKg,
  };
}

module.exports = { verifyTicketWithOpenRouter };
