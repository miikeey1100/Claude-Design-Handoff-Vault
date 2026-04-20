# SentryGrid — Original Intent

**User:** Need a security operations center console. Think Palantir × Bloomberg Terminal — dense, precise, zero decoration. Target: a senior analyst who already has 4 other tools open and needs this one to communicate signal density, not personality.

Requirements:
- Monochrome family — strict. Only ONE green accent (`#00b872`) reserved for "live" state indicators (LIVE, ACTIVE status, nothing else)
- 4px baseline grid everywhere
- Sharp corners — radius 0
- No shadows, no gradients (except a 1px hairline)
- Typography: Chakra Petch for display, JetBrains Mono for every number/timestamp/ID
- Letter-spacing hierarchy over font-size hierarchy

Layout:
- Sidebar with Operations / Intelligence / Config groups
- 5 KPI tiles (threats blocked, open incidents, critical severity, MTTD, agent coverage)
- Live threat feed — 7 rows with severity pills (CRIT/HIGH/MED/LOW), timestamp, description + metadata subline, source, action link
- SVG bar chart — 24 half-hour buckets, blocked traffic
- Defense agents grid — 4 tiles (SENTINEL-01, SENTINEL-02, HUNTER-07, FORENSICS-03)
- Country attack origin ranking with progress bars
- Incident timeline card — MTTR at the top, 6 rows of chronological events

**Handoff:** Single self-contained HTML file. No build step.
