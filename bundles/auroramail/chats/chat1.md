# AuroraMail — Original Intent

**User:** I want to design an AI-native email client that feels like Superhuman mixed with Arc Browser. Three panes, dark liquid-glass aesthetic, with an inline AI summary panel that gives me a 2-sentence TL;DR of any email plus suggestion chips ("draft reply", "propose call", etc.). The AI should feel like a first-class citizen, not a bolted-on sidebar.

Key requirements:
- Liquid Glass family — oklch surfaces, 16px backdrop blur, 140% saturate
- Aurora → violet gradient for brand accents (compose button, AI badge)
- Priority sorting in inbox driven by AI — not chronological
- Color-coded labels (customers, engineering, design) with small dots
- Reply composer with a shortcut to insert the AI draft
- Typography: Space Grotesk display, JetBrains Mono for timestamps/metadata

The Atlas AI panel is the hero element — it should sit above the email body and summarize the message in plain English, call out what the sender actually wants, and offer 4 one-click actions. Keep it to a single viewport, no scrolling required for the primary workflow.

**Handoff:** Return a single self-contained HTML file. No build step.
