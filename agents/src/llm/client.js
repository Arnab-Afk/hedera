import { GREEN_ACTION_RULES } from '../rules/greenActionRules.js';

/**
 * GreenActionLLM
 *
 * Wraps a locally-running LLM (via Ollama's OpenAI-compatible API endpoint)
 * to classify whether sanitized MCP data constitutes a valid green action.
 *
 * Falls back to the deterministic rule engine if the LLM is unavailable,
 * ensuring the agent degrades gracefully on devices without Ollama.
 */
export class GreenActionLLM {
  baseUrl = process.env.LLM_BASE_URL || 'http://localhost:11434';
  model   = process.env.LLM_MODEL    || 'mistral';

  /**
   * @param {string} category   The MCP category (e.g. "public_transit")
   * @param {object} data       Sanitized data from the MCP server
   * @returns {{ isGreenAction: boolean, reasoning: string }}
   */
  async classify(category, data) {
    // Fast path: deterministic rules for simple boolean checks
    const ruleResult = GREEN_ACTION_RULES[category]?.(data);
    if (ruleResult !== undefined) {
      return {
        isGreenAction: ruleResult,
        reasoning: `Rule engine: ${category} → ${ruleResult ? 'PASS' : 'FAIL'}`,
      };
    }

    // LLM path: for more nuanced classification (e.g. receipt contents)
    try {
      return await this._callLLM(category, data);
    } catch (err) {
      console.warn(`   ⚠️  LLM unavailable (${err.message}) — falling back to strict deny`);
      return { isGreenAction: false, reasoning: 'LLM unavailable and no rule matched' };
    }
  }

  async _callLLM(category, data) {
    const prompt = this._buildPrompt(category, data);

    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are a green action classifier for the Wisp eco-companion app.
Your job is to determine whether the provided data represents a verified, genuine eco-friendly action.
Respond ONLY in JSON: { "isGreenAction": true/false, "reasoning": "<one sentence>" }
Do NOT include any other text outside the JSON.`,
          },
          { role: 'user', content: prompt },
        ],
        stream: false,
      }),
    });

    if (!response.ok) throw new Error(`LLM API error: ${response.status}`);
    const result = await response.json();
    const content = result?.message?.content ?? result?.response ?? '';

    try {
      return JSON.parse(content.trim());
    } catch {
      throw new Error(`LLM returned invalid JSON: ${content.slice(0, 100)}`);
    }
  }

  _buildPrompt(category, data) {
    return `Category: ${category}\nSanitized data: ${JSON.stringify(data, null, 2)}\n\nIs this a genuine green action?`;
  }
}
