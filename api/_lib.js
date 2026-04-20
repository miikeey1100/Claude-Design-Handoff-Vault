// Shared helpers for the Vercel serverless handlers.
// Kept in CommonJS-safe ESM so each api/*.js file stays tiny.
import https from 'node:https';

export const CDN = 'https://raw.githubusercontent.com/miikeey1100/handoff-cdn/main';

export const TOKENS = {
  'Liquid Glass': `  --glass-bg:       oklch(0.09 0.04 260)
  --glass-panel:    oklch(1 0 0 / 0.04)  +  backdrop-filter: blur(16px) saturate(140%)
  --glass-stroke:   oklch(1 0 0 / 0.10)
  --ink-100:        oklch(0.97 0.005 80)
  --radius:         10px / 16px / 24px / 32px
  Rule: never convert oklch() to hex. Blur is non-negotiable.`,
  'Monochrome': `  --bg: #0a0b0c   --panel: #111315   --line: #23282d
  --ink-0: #e9ecee   --live: #00b872  ← one accent, live/status only
  --baseline: 4px   radius ≤ 6px   no gradients`,
};

export function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302)
        return get(res.headers.location).then(resolve, reject);
      if (res.statusCode !== 200)
        return reject(new Error(`HTTP ${res.statusCode}`));
      const buf = [];
      res.on('data', c => buf.push(c));
      res.on('end', () => resolve(Buffer.concat(buf).toString('utf8')));
    }).on('error', reject);
  });
}

export async function loadManifest() {
  const raw = await get(`${CDN}/manifest.json`);
  return JSON.parse(raw);
}

export async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch (e) { reject(e); }
    });
    req.on('error', reject);
  });
}

export function callAnthropic({ system, user, model = 'claude-opus-4-7-20250101', maxTokens = 8192 }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Promise.reject(new Error('ANTHROPIC_API_KEY not set on server'));
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: [{ type: 'text', text: user }] }],
    });
    const req = https.request('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-length': Buffer.byteLength(body),
      },
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try {
          const j = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if (j.error) return reject(new Error(j.error.message || JSON.stringify(j.error)));
          resolve(j.content?.[0]?.text || '');
        } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export function extractHtml(text) {
  const fence = text.match(/```(?:html)?\s*\n([\s\S]*?)\n```/);
  if (fence) return fence[1];
  const doc = text.match(/<!DOCTYPE[\s\S]*<\/html>/i);
  return doc ? doc[0] : text;
}

export function stripFences(s) {
  const m = s.trim().match(/^```(?:json)?\s*\n([\s\S]*?)\n```\s*$/);
  return m ? m[1] : s.trim();
}
