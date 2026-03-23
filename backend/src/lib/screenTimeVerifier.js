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

  if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(mimeType)) {
    throw new Error('Only JPEG, PNG, and WEBP screenshots are supported');
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

function estimateEnergyWh(totalMinutes) {
  // Approximate smartphone active power draw around 4W for quick MVP scoring.
  const hours = Math.max(0, totalMinutes) / 60;
  return Math.round(hours * 4 * 100) / 100;
}

function computeScreenScore(totalMinutes) {
  if (totalMinutes <= 120) return 100;
  if (totalMinutes <= 180) return 90;
  if (totalMinutes <= 240) return 80;
  if (totalMinutes <= 300) return 65;
  if (totalMinutes <= 360) return 50;
  if (totalMinutes <= 480) return 35;
  return 20;
}

async function verifyScreenTimeScreenshotWithAI({ imageDataUrl }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'google/gemma-3-4b-it:free';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured on backend');
  }

  const { payload, mimeType } = extractBase64Payload(imageDataUrl);

  const prompt = [
    'You are a mobile screen-time screenshot parser.',
    'Detect whether the image is an iOS/Android daily screen-time summary screenshot.',
    'Extract total daily usage in minutes.',
    'Return ONLY JSON in this exact shape:',
    '{',
    '  "isScreenTimeScreenshot": boolean,',
    '  "totalMinutes": number,',
    '  "screenshotDate": string,',
    '  "confidence": number,',
    '  "reasoning": string',
    '}',
    'Rules:',
    '- totalMinutes must be integer >= 0.',
    '- confidence must be in [0,1].',
    '- if not a screen-time summary screenshot set isScreenTimeScreenshot=false and totalMinutes=0.',
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
  const totalMinutes = Math.max(0, Math.round(Number(parsed?.totalMinutes || 0)));
  const confidence = clamp01(Number(parsed?.confidence || 0));
  const estimatedEnergyWh = estimateEnergyWh(totalMinutes);
  const score = computeScreenScore(totalMinutes);

  return {
    isScreenTimeScreenshot: Boolean(parsed?.isScreenTimeScreenshot),
    totalMinutes,
    screenshotDate: typeof parsed?.screenshotDate === 'string' ? parsed.screenshotDate.trim() : '',
    confidence,
    reasoning: typeof parsed?.reasoning === 'string' ? parsed.reasoning : 'No reasoning provided',
    estimatedEnergyWh,
    score,
  };
}

module.exports = { verifyScreenTimeScreenshotWithAI };
