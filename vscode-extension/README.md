# Handoff-CDN for VS Code

Browse 14 pixel-perfect design bundles in the activity bar. One click pipes a full design contract (HTML + tokens + original intent + implementation directive) into Copilot Chat, Cline, Continue — any chat that accepts pasted text.

## Install (local / pre-marketplace)

```bash
cd vscode-extension
npm i -g @vscode/vsce
vsce package
code --install-extension handoff-cdn-vscode-0.1.0.vsix
```

## Commands

| Command | What it does |
|---|---|
| `Handoff-CDN: Browse Bundles` | Quickpick all 14 bundles |
| `Handoff-CDN: Preview Bundle` | Render in a side webview |
| `Handoff-CDN: Insert Bundle into Chat` | Paste structured prompt at cursor |
| `Handoff-CDN: Copy Bundle Prompt` | Clipboard the full prompt |

## How it works

Zero dependencies. Fetches `manifest.json` from GitHub Raw, builds a prompt matching the `npx handoff-cdn use <slug>` output, and hands it to your active editor. No API keys required for browse/insert — those are just file reads over HTTPS.

Full protocol: https://github.com/miikeey1100/handoff-cdn
