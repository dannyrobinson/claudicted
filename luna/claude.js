// claude.js
// Thin wrapper around the Anthropic Messages API.
// Called directly from the browser (no proxy) — key is in config.js and gitignored.

import { ANTHROPIC_API_KEY } from './config.js';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-5-20250929'; // Sonnet 4.5 — latest stable. Swap to 4.6 string once available in your account.
const DEFAULT_TIMEOUT_MS = 6000;

/**
 * Call Claude with a system prompt and user message, return parsed JSON.
 * Strips ```json fences if model wraps despite instructions.
 * Times out after timeoutMs — caller should fall back on null return.
 */
export async function askClaude({ system, user, maxTokens = 1500, timeoutMs = DEFAULT_TIMEOUT_MS }) {
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY.startsWith('REPLACE_')) {
    console.warn('[luna] No API key set — scripted paths only');
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: user }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.warn('[luna] Claude API error', response.status, errText);
      return null;
    }

    const data = await response.json();
    const textBlock = data.content?.find(b => b.type === 'text');
    if (!textBlock) return null;

    const parsed = parseJSONFromResponse(textBlock.text);
    return parsed;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      console.warn('[luna] Claude call timed out after', timeoutMs, 'ms');
    } else {
      console.warn('[luna] Claude call failed:', err);
    }
    return null;
  }
}

// Claude sometimes wraps JSON in ```json fences even when told not to. Handle both.
function parseJSONFromResponse(text) {
  if (!text) return null;
  let cleaned = text.trim();
  // Strip code fences
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  // If there's prose before the JSON, try to find the first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace > -1 && lastBrace > firstBrace) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn('[luna] JSON parse failed. Raw:', text);
    return null;
  }
}
