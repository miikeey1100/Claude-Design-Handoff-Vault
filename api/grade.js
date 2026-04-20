import { loadManifest, readBody, callAnthropic, stripFences, get, TOKENS, CDN } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { html, slug } = await readBody(req);
    const manifest = await loadManifest();
    const b = manifest.bundles.find(x => x.slug === slug);
    if (!b) return res.status(400).json({ error: 'unknown slug' });
    const refHtml = await get(`${CDN}/${b.dir}/${b.primary}`).catch(() => '');
    const system = `You grade UI fidelity against a Handoff-CDN contract. Return STRICTLY VALID JSON (no preamble): {"score": <0-100>, "summary": "one sentence"}. Scoring rubric: -8 per oklch→hex conversion; -10 if Liquid Glass missing backdrop-filter; -6 per over-radius; -3 per non-4px spacing on Monochrome; -4 wrong font; -8 extra accents on Monochrome. Start at 100.`;
    const user = `## Family: ${b.family}\n## Contract:\n${TOKENS[b.family]}\n\n## Reference:\n\`\`\`\n${refHtml.slice(0, 8000)}\n\`\`\`\n\n## Candidate to grade:\n\`\`\`\n${html.slice(0, 20000)}\n\`\`\`\n\nReturn JSON.`;
    const out = await callAnthropic({ system, user, maxTokens: 600 });
    let parsed;
    try { parsed = JSON.parse(stripFences(out)); }
    catch { parsed = { score: 50, summary: 'grader parse fallback' }; }
    res.status(200).json(parsed);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
