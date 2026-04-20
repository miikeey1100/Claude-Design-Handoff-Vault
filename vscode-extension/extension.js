// Handoff-CDN VS Code extension
// Zero-dep. Fetches manifest from GitHub Raw, exposes 14 bundles in the activity bar.
// Commands:
//   - handoffCdn.preview        open bundle HTML in webview
//   - handoffCdn.insertIntoChat pipe structured prompt into active editor (works with
//     Copilot Chat input, Cline, Continue — anything that takes pasted text)
//   - handoffCdn.copyPrompt     copy prompt to clipboard
//   - handoffCdn.browse         quickpick all bundles
//   - handoffCdn.refresh        re-fetch manifest

const vscode = require('vscode');
const https = require('https');

const CDN = 'https://raw.githubusercontent.com/miikeey1100/handoff-cdn/main';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) return get(res.headers.location).then(resolve, reject);
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}: ${url}`));
      const buf = [];
      res.on('data', c => buf.push(c));
      res.on('end', () => resolve(Buffer.concat(buf).toString('utf8')));
    }).on('error', reject);
  });
}

class BundleProvider {
  constructor() {
    this._onDidChange = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChange.event;
    this.bundles = [];
  }
  refresh() { this.load(); this._onDidChange.fire(); }
  async load() {
    try {
      const raw = await get(`${CDN}/manifest.json`);
      this.bundles = JSON.parse(raw).bundles;
    } catch (e) {
      vscode.window.showErrorMessage(`Handoff-CDN: manifest fetch failed — ${e.message}`);
      this.bundles = [];
    }
    this._onDidChange.fire();
  }
  getTreeItem(b) {
    const item = new vscode.TreeItem(`${b.title}`, vscode.TreeItemCollapsibleState.None);
    item.description = `${b.family} · ${b.fidelity}%`;
    item.tooltip = b.description;
    item.contextValue = 'bundle';
    item.id = b.slug;
    item.iconPath = new vscode.ThemeIcon(b.family === 'Liquid Glass' ? 'symbol-color' : 'symbol-structure');
    item.command = { command: 'handoffCdn.preview', title: 'Preview', arguments: [b] };
    return item;
  }
  getChildren() { return this.bundles; }
}

async function buildPrompt(b) {
  const html = await get(`${CDN}/${b.dir}/${b.primary}`);
  const chat = await get(`${CDN}/${b.dir}/${b.chat}`).catch(() => '');
  const tokens = b.family === 'Liquid Glass'
    ? `oklch() only, backdrop-filter: blur(16px) saturate(140%), radius 10-32px`
    : `hex only, 4px baseline, radius ≤6px, #00b872 single accent (live state only)`;
  return `# Handoff-CDN · ${b.slug} · ${b.fidelity}% fidelity
# Family: ${b.family}  |  Contract: ${tokens}

## Original intent
${chat.slice(0, 4000)}

## Primary design file (${b.primary})
\`\`\`html
${html}
\`\`\`

## Implementation directive
Pixel-perfect fidelity. Never convert oklch()→hex. Preserve every radius, blur, spacing, font token. Do not simplify or "improve" the design. Family: ${b.family}.
Full contract: https://github.com/miikeey1100/handoff-cdn/blob/main/CLAUDE.md
`;
}

async function preview(b) {
  if (!b) return;
  const html = await get(`${CDN}/${b.dir}/${b.primary}`).catch(e => `<pre>${e.message}</pre>`);
  const panel = vscode.window.createWebviewPanel('handoffCdnPreview', `${b.title}`, vscode.ViewColumn.Beside, { enableScripts: true });
  panel.webview.html = html;
}

async function insertIntoChat(b) {
  if (!b) return;
  const prompt = await buildPrompt(b);
  const ed = vscode.window.activeTextEditor;
  if (ed) {
    await ed.edit(e => e.insert(ed.selection.active, prompt));
    vscode.window.showInformationMessage(`Handoff-CDN: ${b.slug} inserted.`);
  } else {
    await vscode.env.clipboard.writeText(prompt);
    vscode.window.showInformationMessage(`Handoff-CDN: no active editor — ${b.slug} copied to clipboard instead.`);
  }
}

async function copyPrompt(b) {
  if (!b) return;
  const prompt = await buildPrompt(b);
  await vscode.env.clipboard.writeText(prompt);
  vscode.window.showInformationMessage(`Handoff-CDN: ${b.slug} prompt copied to clipboard.`);
}

async function browseBundles(provider) {
  if (!provider.bundles.length) await provider.load();
  const pick = await vscode.window.showQuickPick(
    provider.bundles.map(b => ({ label: b.title, description: `${b.family} · ${b.fidelity}%`, detail: b.description, b })),
    { placeHolder: 'Select a Handoff-CDN bundle' }
  );
  if (pick) return insertIntoChat(pick.b);
}

function activate(context) {
  const provider = new BundleProvider();
  provider.load();
  context.subscriptions.push(vscode.window.registerTreeDataProvider('handoffCdnBundles', provider));
  context.subscriptions.push(vscode.commands.registerCommand('handoffCdn.refresh',        () => provider.refresh()));
  context.subscriptions.push(vscode.commands.registerCommand('handoffCdn.preview',        (b) => preview(b)));
  context.subscriptions.push(vscode.commands.registerCommand('handoffCdn.insertIntoChat', (b) => insertIntoChat(b)));
  context.subscriptions.push(vscode.commands.registerCommand('handoffCdn.copyPrompt',     (b) => copyPrompt(b)));
  context.subscriptions.push(vscode.commands.registerCommand('handoffCdn.browse',         () => browseBundles(provider)));
}

function deactivate() {}

module.exports = { activate, deactivate };
