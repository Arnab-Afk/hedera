const OPENROUTER_CHAT_URL = 'https://openrouter.ai/api/v1/chat/completions';

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

  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'].includes(mimeType)) {
    throw new Error('Only JPEG, PNG, WEBP, and HEIC bill images are supported');
  }

  return { mimeType, payload };
}

function safeJsonParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      return JSON.parse(fenced[1]);
    }

    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    if (start !== -1 && end > start) {
      return JSON.parse(raw.slice(start, end + 1));
    }

    throw new Error('Model did not return valid JSON');
  }
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function computeBillScore(unitsConsumed) {
  // Lower units => higher score. Tuned for quick MVP and can be refined later.
  if (unitsConsumed <= 120) return 100;
  if (unitsConsumed <= 180) return 85;
  if (unitsConsumed <= 240) return 70;
  if (unitsConsumed <= 320) return 55;
  if (unitsConsumed <= 450) return 40;
  return 20;
}

async function verifyElectricityBillWithAI({ imageDataUrl }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'google/gemma-3-4b-it:free';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured on backend');
  }

  const { payload, mimeType } = extractBase64Payload(imageDataUrl);

  const prompt = [
    'You are an electricity bill parser.',
    'Extract the monthly consumed units from this electricity bill image.',
    'Return ONLY JSON with this exact shape:',
    '{',
    '  "isElectricityBill": boolean,',
    '  "unitsConsumed": number,',
    '  "billingMonth": string,',
    '  "billingYear": number,',
    '  "confidence": number,',
    '  "reasoning": string',
    '}',
    'Rules:',
    '- unitsConsumed must be numeric and >= 0.',
    '- confidence must be in [0,1].',
    '- if image is not an electricity bill, set isElectricityBill=false and unitsConsumed=0.',
    '- no markdown or prose outside JSON.',
  ].join('\n');

  const response = await fetch(OPENROUTER_CHAT_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3001',
      'X-OpenRouter-Title': process.env.SITE_NAME || 'Wisp Backend',
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
    throw new Error('OpenRouter returned empty response content');
  }

  const parsed = safeJsonParse(content);
  const unitsConsumed = Math.max(0, Number(parsed?.unitsConsumed || 0));
  const confidence = clamp01(Number(parsed?.confidence || 0));
  const score = computeBillScore(unitsConsumed);

  return {
    isElectricityBill: Boolean(parsed?.isElectricityBill),
    unitsConsumed,
    billingMonth: typeof parsed?.billingMonth === 'string' ? parsed.billingMonth.trim() : '',
    billingYear: Number.isFinite(Number(parsed?.billingYear)) ? Number(parsed.billingYear) : 0,
    confidence,
    reasoning: typeof parsed?.reasoning === 'string' ? parsed.reasoning : 'No reasoning provided',
    score,
  };
}

module.exports = { verifyElectricityBillWithAI };
