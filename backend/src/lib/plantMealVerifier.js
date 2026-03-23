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
    throw new Error('Only JPEG, PNG, and WEBP images are supported');
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

async function verifyPlantMealWithAI({ imageDataUrl }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'google/gemma-3-4b-it:free';

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured on backend');
  }

  const { payload, mimeType } = extractBase64Payload(imageDataUrl);

  const prompt = [
    'You are a food-image verifier for eco rewards.',
    'Determine if the image likely shows a plant-based meal (vegan or clearly vegetarian without visible meat/fish).',
    'Return ONLY JSON in this exact shape:',
    '{',
    '  "isPlantBasedMeal": boolean,',
    '  "dishName": string,',
    '  "estimatedCo2SavedKg": number,',
    '  "confidence": number,',
    '  "reasoning": string',
    '}',
    'Rules:',
    '- confidence must be in [0,1].',
    '- estimatedCo2SavedKg must be >= 0 and usually <= 2.0.',
    '- if uncertain, set isPlantBasedMeal=false.',
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
  return {
    isPlantBasedMeal: Boolean(parsed?.isPlantBasedMeal),
    dishName: typeof parsed?.dishName === 'string' ? parsed.dishName.trim() : 'Plant meal',
    estimatedCo2SavedKg: Math.max(0, Number(parsed?.estimatedCo2SavedKg || 0)),
    confidence: clamp01(Number(parsed?.confidence || 0)),
    reasoning: typeof parsed?.reasoning === 'string' ? parsed.reasoning : 'No reasoning provided',
  };
}

module.exports = { verifyPlantMealWithAI };
