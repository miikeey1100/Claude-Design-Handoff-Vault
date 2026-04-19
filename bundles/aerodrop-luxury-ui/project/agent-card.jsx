// AI Agent Status Card — animated pulse, telemetry, actions
function AgentStatusCard({ priority, stealth, eta, distance }) {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setPhase((p) => (p + 1) % 4), 2200);
    return () => clearInterval(id);
  }, []);

  const statusPhases = [
    { label: 'PATHFINDING', detail: 'Recomputing optimal trajectory' },
    { label: 'SCANNING', detail: 'Wind vector: NE 12km/h · clear' },
    { label: 'COORDINATING', detail: 'Airspace cleared with ATC' },
    { label: 'TRANSMITTING', detail: 'Link stable · 48ms latency' },
  ];
  const cur = statusPhases[phase];

  return (
    <div className="ad-glass" style={{
      margin: '0 16px', borderRadius: 'var(--r-xl)',
      padding: '16px 18px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated scan line */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        overflow: 'hidden', borderRadius: 'inherit',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 80,
          background: 'linear-gradient(180deg, transparent, oklch(0.72 0.28 305 / 0.08) 50%, transparent)',
          animation: 'ad-scan 4s ease-in-out infinite',
        }} />
      </div>

      {/* Violet corner glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(0.72 0.28 305 / 0.3), transparent 70%)',
        animation: 'ad-glow-breath 4s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Top row — agent identity + status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
        {/* Pulse avatar */}
        <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
          <div style={{
            position: 'absolute', inset: -8, borderRadius: '50%',
            background: 'oklch(0.72 0.28 305 / 0.25)',
            animation: 'ad-pulse-ring 2s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            background: 'oklch(0.72 0.28 305 / 0.35)',
            animation: 'ad-pulse-ring 2s ease-out infinite 0.6s',
          }} />
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, oklch(0.98 0.05 305), oklch(0.72 0.28 305) 55%, oklch(0.4 0.22 305))',
            border: '0.5px solid oklch(0.98 0.05 305 / 0.4)',
            boxShadow: '0 0 16px oklch(0.72 0.28 305 / 0.6), inset 0 1px 2px oklch(1 0 0 / 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Orbital ring */}
            <div style={{
              position: 'absolute', inset: 6, borderRadius: '50%',
              border: '0.5px dashed oklch(1 0 0 / 0.4)',
              animation: 'ad-orbit 8s linear infinite',
            }} />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z"
                fill="oklch(1 0 0 / 0.95)" />
            </svg>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: 17, fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.02em',
            }}>Agent ADR‑07</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '2px 7px', borderRadius: 4,
              background: 'oklch(0.72 0.2 150 / 0.15)',
              border: '0.5px solid oklch(0.72 0.2 150 / 0.3)',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: 'oklch(0.78 0.22 150)',
                boxShadow: '0 0 6px oklch(0.78 0.22 150)',
                animation: 'ad-pulse 1.6s ease-in-out infinite',
              }} />
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 700,
                color: 'oklch(0.85 0.18 150)', letterSpacing: '0.1em',
              }}>LIVE</div>
            </div>
          </div>
          <div style={{
            marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--text-secondary)', letterSpacing: '0.04em',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ color: 'oklch(0.72 0.28 305)' }}>●</span>
            {cur.label}
            <span style={{ color: 'var(--text-tertiary)' }}>·</span>
            <span style={{ color: 'var(--text-tertiary)' }}>{cur.detail}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 0.5, background: 'oklch(1 0 0 / 0.08)',
        margin: '14px -2px 12px',
      }} />

      {/* Telemetry grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <TelemetryCell label="ETA" value={eta} unit="min" />
        <TelemetryCell label="DIST" value={distance} unit="km" />
        <TelemetryCell label="ALT" value="124" unit="m" />
      </div>
    </div>
  );
}

function TelemetryCell({ label, value, unit }) {
  return (
    <div style={{
      padding: '8px 10px', borderRadius: 12,
      background: 'oklch(1 0 0 / 0.03)',
      border: '0.5px solid oklch(1 0 0 / 0.06)',
    }}>
      <div className="ad-label" style={{ fontSize: 9, marginBottom: 3 }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontWeight: 600,
        color: 'var(--text-primary)', letterSpacing: '-0.01em',
        display: 'flex', alignItems: 'baseline', gap: 3,
      }}>
        <span style={{ fontSize: 18 }}>{value}</span>
        <span style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>{unit}</span>
      </div>
    </div>
  );
}

Object.assign(window, { AgentStatusCard });
