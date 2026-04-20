import { loadManifest, readBody, callAnthropic, extractHtml, get, TOKENS, CDN } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { prompt, slug, withBundle } = await readBody(req);
    const manifest = await loadManifest();
    const b = manifest.bundles.find(x => x.slug === slug);
    if (!b) return res.status(400).json({ error: 'unknown slug' });

    let system, user;
    if (withBundle) {
      const refHtml = await get(`${CDN}/${b.dir}/${b.primary}`).catch(() => '');
      system = `You implement UI from a Handoff-CDN design contract. Return ONE complete self-contained HTML document (<!DOCTYPE html>...</html>). No preamble, no explanation, just the HTML. Inline CSS, real content, no placeholders. Match every token from the contract. Family: ${b.family}. Never convert oklch() to hex.`;
      user = `## Token contract (${b.family}):\n${TOKENS[b.family]}\n\n## Reference implementation (style to match):\n\`\`\`\n${refHtml.slice(0, 10000)}\n\`\`\`\n\n## Build this:\n${prompt}\n\nOutput the complete HTML document now.`;
    } else {
      system = `You build UIs from plain-English prompts. Return ONE complete self-contained HTML document (<!DOCTYPE html>...</html>). No preamble, just the HTML. Inline CSS, real content.`;
      user = `Build this: ${prompt}`;
    }
    const out = await callAnthropic({ system, user, maxTokens: 12000 });
    res.status(200).json({ html: extractHtml(out) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
