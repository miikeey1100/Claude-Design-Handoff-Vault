# AuroraMail — AI-Native Email Client

**Family:** Liquid Glass
**Fidelity:** 96%

A three-pane AI-native email client UI. Liquid glass aesthetic with aurora→violet gradient accents. Inline Atlas AI summary panel with suggestion chips, priority-sorted inbox, compose button with gradient fill, smart labels sidebar with colored dots, ⌘K search, and reply composer with Atlas draft shortcut.

## Tokens
- Background: `oklch(0.09 0.04 260)` warm radial wash
- Aurora: `oklch(0.78 0.18 170)`
- Violet: `oklch(0.68 0.20 300)`
- Radius: 16px / 24px
- Blur: 16px with saturate(140%)
- Typography: Space Grotesk + JetBrains Mono

## Structure
- Three-column grid: 240px sidebar · 360px thread list · flex reader
- Atlas AI panel: inline above reader body, purple-aurora gradient border
- Thread list: AI priority sorting with PRIORITY / AI-DRAFT READY tags
- Color-coded labels via `.label-dot` class

## Use
```
npx handoff-cdn use auroramail | claude
```
