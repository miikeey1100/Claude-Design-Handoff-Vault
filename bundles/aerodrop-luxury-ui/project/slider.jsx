// Custom glass slider with haptic-feel ticks
function GlassSlider({ value, onChange, label, levels, icon, accentHue = 305 }) {
  const sliderRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const handleMove = React.useCallback((clientX) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onChange(pct);
  }, [onChange]);

  React.useEffect(() => {
    if (!dragging) return;
    const mm = (e) => handleMove(e.clientX ?? e.touches?.[0]?.clientX);
    const mu = () => setDragging(false);
    window.addEventListener('pointermove', mm);
    window.addEventListener('pointerup', mu);
    return () => {
      window.removeEventListener('pointermove', mm);
      window.removeEventListener('pointerup', mu);
    };
  }, [dragging, handleMove]);

  const currentLevel = Math.min(levels.length - 1, Math.floor(value * levels.length));
  const currentLabel = levels[currentLevel];

  return (
    <div style={{ padding: '14px 16px 16px' }}>
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: `oklch(0.72 0.28 ${accentHue} / 0.18)`,
            border: `0.5px solid oklch(0.72 0.28 ${accentHue} / 0.4)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: `oklch(0.85 0.2 ${accentHue})`,
          }}>{icon}</div>
          <div>
            <div className="ad-label" style={{ fontSize: 9.5, color: 'var(--text-tertiary)' }}>
              {label}
            </div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15,
              color: 'var(--text-primary)', lineHeight: 1.1, marginTop: 2,
              letterSpacing: '-0.01em',
            }}>{currentLabel}</div>
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600,
          color: `oklch(0.85 0.2 ${accentHue})`,
          padding: '3px 8px', borderRadius: 6,
          background: `oklch(0.72 0.28 ${accentHue} / 0.1)`,
          border: `0.5px solid oklch(0.72 0.28 ${accentHue} / 0.2)`,
          letterSpacing: '0.04em',
        }}>
          {Math.round(value * 100)}%
        </div>
      </div>

      {/* Track */}
      <div
        ref={sliderRef}
        className="ad-no-select"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId);
          setDragging(true);
          handleMove(e.clientX);
        }}
        style={{
          position: 'relative', height: 28, cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}
      >
        {/* Track background */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 8, borderRadius: 4,
          background: 'oklch(1 0 0 / 0.06)',
          border: '0.5px solid oklch(1 0 0 / 0.08)',
          boxShadow: 'inset 0 1px 2px oklch(0 0 0 / 0.4)',
        }} />
        {/* Fill */}
        <div style={{
          position: 'absolute', left: 0, height: 8, borderRadius: 4,
          width: `${value * 100}%`,
          background: `linear-gradient(90deg, oklch(0.55 0.28 ${accentHue}), oklch(0.78 0.24 ${accentHue}))`,
          boxShadow: `0 0 12px oklch(0.72 0.28 ${accentHue} / 0.7), inset 0 0.5px 0 oklch(1 0 0 / 0.3)`,
        }} />
        {/* Tick marks */}
        {levels.map((_, i) => {
          const tickPct = i / (levels.length - 1);
          return (
            <div key={i} style={{
              position: 'absolute', left: `${tickPct * 100}%`,
              transform: 'translateX(-50%)',
              width: 1, height: 4,
              background: value * 100 >= tickPct * 100 - 2
                ? 'oklch(1 0 0 / 0.6)' : 'oklch(1 0 0 / 0.2)',
              marginTop: 14,
            }} />
          );
        })}
        {/* Thumb */}
        <div style={{
          position: 'absolute', left: `${value * 100}%`,
          transform: 'translateX(-50%)',
          width: 22, height: 22, borderRadius: '50%',
          background: 'linear-gradient(135deg, oklch(0.98 0.02 285), oklch(0.82 0.03 285))',
          border: '0.5px solid oklch(1 0 0 / 0.8)',
          boxShadow: `
            0 0 0 4px oklch(0.72 0.28 ${accentHue} / 0.15),
            0 2px 6px oklch(0 0 0 / 0.5),
            0 0 16px oklch(0.72 0.28 ${accentHue} / ${dragging ? 0.8 : 0.4}),
            inset 0 1px 2px oklch(1 0 0 / 0.9),
            inset 0 -1px 2px oklch(0 0 0 / 0.2)
          `,
          transition: dragging ? 'none' : 'box-shadow 0.2s',
        }}>
          {/* Inner dot */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 6, height: 6, borderRadius: '50%',
            background: `oklch(0.72 0.28 ${accentHue})`,
            boxShadow: `0 0 4px oklch(0.72 0.28 ${accentHue})`,
          }} />
        </div>
      </div>

      {/* Level legend */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        marginTop: 6, padding: '0 2px',
      }}>
        {levels.map((l, i) => (
          <div key={i} style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            color: i === currentLevel ? `oklch(0.85 0.2 ${accentHue})` : 'var(--text-tertiary)',
            fontWeight: i === currentLevel ? 700 : 500,
            letterSpacing: '0.08em',
            transition: 'color 0.2s',
          }}>
            {l.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { GlassSlider });
