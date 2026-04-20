# SentryGrid — Security Operations Console

**Family:** Monochrome
**Fidelity:** 96%

A security operations center (SOC) dashboard. Strict monochrome palette with a single `#00b872` accent reserved for live state only. Live threat feed with severity tagging (CRIT/HIGH/MED/LOW), 24-bar SVG blocked-traffic chart, 4-tile defense agent grid, country-ranked attack origin bars, and a chronological incident timeline with MTTR = 3m 42s.

## Tokens
- Base: `#0a0b0c`
- Panel: `#111315`
- Lines: `#23282d` / hover `#2e343a`
- Live accent: `#00b872` (only on live-state indicators)
- Typography: Chakra Petch display + JetBrains Mono for codes/metrics
- Baseline: 4px grid
- Radius: 0 (sharp corners throughout)

## Structure
- 220px sidebar · flex main
- 5-column KPI ribbon
- 1.6fr / 1fr two-column grid for feed + chart
- Full-width timeline card at the bottom
- Zero gradients, zero shadows, zero curves

## Use
```
npx handoff-cdn use sentrygrid | claude
```
