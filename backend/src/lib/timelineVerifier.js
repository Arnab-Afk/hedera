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

function toLocalDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function normalizeDateKey(input) {
  if (typeof input !== 'string') return '';
  const value = input.trim();
  const m = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (!m) return '';
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (year < 2020 || month < 1 || month > 12 || day < 1 || day > 31) return '';
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function computeCommuteMetrics({ walkingKm, transitKm, drivingKm, totalSteps }) {
  const walk = Math.max(0, Number(walkingKm || 0));
  const transit = Math.max(0, Number(transitKm || 0));
  const drive = Math.max(0, Number(drivingKm || 0));
  const steps = Math.max(0, Math.round(Number(totalSteps || 0)));

  const actualEmissionKg = drive * 0.192 + transit * 0.041;
  const totalKm = walk + transit + drive;
  const lowCarbonRatio = totalKm > 0 ? (walk + transit) / totalKm : 0;
  const stepsScore = Math.min(1, steps / 12000);
  const score = Math.round((0.65 * lowCarbonRatio + 0.35 * stepsScore) * 100);

  return {
    walkingKm: Math.round(walk * 100) / 100,
    transitKm: Math.round(transit * 100) / 100,
    drivingKm: Math.round(drive * 100) / 100,
    totalSteps: steps,
    actualEmissionKg: Math.round(actualEmissionKg * 1000) / 1000,
    score,
  };
}

async function verifyTimelineScreenshotWithAI({ imageDataUrl }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'google/gemma-3-4b-it:free';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured on backend');
  }

  const { payload, mimeType } = extractBase64Payload(imageDataUrl);

  const now = new Date();
  const today = toLocalDateKey(now);
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(now.getDate() - 1);
  const yesterday = toLocalDateKey(yesterdayDate);

  const prompt = [
    'You are a Google Maps Timeline screenshot parser.',
    'Detect whether the screenshot is from Google Maps Timeline day view showing travel summary.',
    `Current server date: ${today}. Yesterday: ${yesterday}.`,
    'Extract steps and commute distances by mode from what is visible.',
    'Return ONLY JSON in this exact shape:',
    '{',
    '  "isGoogleTimeline": boolean,',
    '  "screenshotDate": string,',
    '  "totalSteps": number,',
    '  "walkingKm": number,',
    '  "transitKm": number,',
    '  "drivingKm": number,',
    '  "confidence": number,',
    '  "reasoning": string',
    '}',
    'Rules:',
    '- screenshotDate must be YYYY-MM-DD.',
    `- If the screenshot says "Yesterday", map it to ${yesterday}.`,
    `- If the screenshot says "Today", map it to ${today}.`,
    '- totalSteps integer >= 0.',
    '- distances are numeric in kilometers >= 0.',
    '- confidence in [0,1].',
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
  const metrics = computeCommuteMetrics({
    walkingKm: parsed?.walkingKm,
    transitKm: parsed?.transitKm,
    drivingKm: parsed?.drivingKm,
    totalSteps: parsed?.totalSteps,
  });

  return {
    isGoogleTimeline: Boolean(parsed?.isGoogleTimeline),
    screenshotDate: normalizeDateKey(parsed?.screenshotDate),
    confidence: clamp01(Number(parsed?.confidence || 0)),
    reasoning: typeof parsed?.reasoning === 'string' ? parsed.reasoning : 'No reasoning provided',
    ...metrics,
    today,
    yesterday,
  };
}

module.exports = { verifyTimelineScreenshotWithAI, toLocalDateKey };
