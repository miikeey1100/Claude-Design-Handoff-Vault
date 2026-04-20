import { loadManifest } from './_lib.js';

export default async function handler(req, res) {
  try {
    const manifest = await loadManifest();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ bundles: manifest.bundles });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
