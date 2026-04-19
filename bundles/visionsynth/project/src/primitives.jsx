// Shared primitives: Bento panel, section labels, sliders, buttons

const bentoStyles = {
  panel: {
    position: 'relative',
    background: 'var(--bg-1)',
    border: '1px solid var(--line-soft)',
    borderRadius: 14,
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px',
    borderBottom: '1px solid var(--line-soft)',
  },
  eyebrow: {
    fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 500,
  },
  label: {
    fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
    color: 'var(--text-1)', letterSpacing: '0.01em',
  },
  editorial: {
    fontFamily: 'var(--serif)', fontWeight: 400, letterSpacing: '-0.01em',
    fontFeatureSettings: '"ss01"',
  },
};

function Panel({ style, headerLeft, headerRight, children, bleed = false, className = '' }) {
  return (
    <div style={{ ...bentoStyles.panel, ...style }} className={className}>
      {(headerLeft || headerRight) && (
        <div style={bentoStyles.panelHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{headerLeft}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{headerRight}</div>
        </div>
      )}
      {bleed
        ? children
        : <div style={{ padding: 14 }}>{children}</div>}
    </div>
  );
}

function Eyebrow({ children, style }) {
  return <span style={{ ...bentoStyles.eyebrow, ...style }}>{children}</span>;
}

function Dot({ color = 'var(--accent)', size = 6, style }) {
  return <span style={{
    display: 'inline-block', width: size, height: size, borderRadius: '50%',
    background: color, ...style,
  }} />;
}

function Chip({ children, tone = 'default', style, onClick }) {
  const tones = {
    default: { bg: 'transparent', bd: 'var(--line)', fg: 'var(--text-1)' },
    accent:  { bg: 'var(--accent-soft)', bd: 'var(--accent-line)', fg: 'var(--accent)' },
    teal:    { bg: 'var(--teal-soft)', bd: 'oklch(0.78 0.12 200 / 0.4)', fg: 'var(--teal)' },
    ghost:   { bg: 'var(--bg-2)', bd: 'transparent', fg: 'var(--text-1)' },
  };
  const t = tones[tone] || tones.default;
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 9px', borderRadius: 999,
      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      cursor: onClick ? 'pointer' : 'default', ...style,
    }}>{children}</button>
  );
}

function Btn({ children, tone = 'default', size = 'md', icon, onClick, style, active }) {
  const tones = {
    default: { bg: 'var(--bg-2)', fg: 'var(--text-0)', bd: 'var(--line)' },
    primary: { bg: 'var(--accent)', fg: 'oklch(0.20 0.04 75)', bd: 'var(--accent)' },
    ghost:   { bg: 'transparent', fg: 'var(--text-1)', bd: 'transparent' },
    outline: { bg: 'transparent', fg: 'var(--text-0)', bd: 'var(--line)' },
  };
  const sizes = {
    sm: { h: 26, px: 10, fs: 11 },
    md: { h: 32, px: 14, fs: 12 },
    lg: { h: 38, px: 18, fs: 13 },
    icon: { h: 32, w: 32, px: 0, fs: 12 },
  };
  const t = tones[tone];
  const s = sizes[size];
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
      height: s.h, width: s.w, padding: s.px ? `0 ${s.px}px` : 0,
      background: active ? 'var(--accent-soft)' : t.bg,
      color: active ? 'var(--accent)' : t.fg,
      border: `1px solid ${active ? 'var(--accent-line)' : t.bd}`,
      borderRadius: 8, cursor: 'pointer',
      fontFamily: 'var(--sans)', fontSize: s.fs, fontWeight: 500,
      letterSpacing: '0.01em',
      transition: 'background .15s, border-color .15s, color .15s',
      ...style,
    }}>
      {icon}{children}
    </button>
  );
}

// Precision Slider - with value readout + ticks
function Slider({ value, onChange, min = 0, max = 100, step = 1, label, unit = '%', ticks = 5, tone = 'accent', detail }) {
  const ref = React.useRef(null);
  const [drag, setDrag] = React.useState(false);

  const toPct = (v) => ((v - min) / (max - min)) * 100;
  const fromClient = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    let v = min + t * (max - min);
    v = Math.round(v / step) * step;
    return Math.max(min, Math.min(max, v));
  };

  React.useEffect(() => {
    if (!drag) return;
    const move = (e) => onChange(fromClient(e.clientX));
    const up = () => setDrag(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [drag]);

  const pct = toPct(value);
  const accentColor = tone === 'teal' ? 'var(--teal)' : 'var(--accent)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ ...bentoStyles.eyebrow }}>{label}</span>
          {detail && <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-2)' }}>{detail}</span>}
        </div>
        <span style={{
          fontFamily: 'var(--serif)', fontSize: 32, lineHeight: 1, color: 'var(--text-0)',
          fontFeatureSettings: '"tnum"',
        }}>
          {value.toFixed(step < 1 ? 2 : 0)}
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-3)', marginLeft: 4 }}>{unit}</span>
        </span>
      </div>

      <div
        ref={ref}
        onPointerDown={(e) => { e.preventDefault(); setDrag(true); onChange(fromClient(e.clientX)); }}
        className="no-select"
        style={{
          position: 'relative', height: 28, cursor: 'pointer',
          display: 'flex', alignItems: 'center',
        }}
      >
        {/* track */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: 'var(--bg-3)', borderRadius: 2,
        }} />
        {/* fill */}
        <div style={{
          position: 'absolute', left: 0, width: `${pct}%`, height: 2,
          background: accentColor, borderRadius: 2,
          boxShadow: `0 0 8px ${accentColor}`,
        }} />
        {/* ticks */}
        {Array.from({ length: ticks }).map((_, i) => {
          const tp = (i / (ticks - 1)) * 100;
          return (
            <div key={i} style={{
              position: 'absolute', left: `${tp}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 1, height: tp <= pct ? 10 : 6,
              background: tp <= pct ? accentColor : 'var(--line)',
              opacity: tp <= pct ? 0.6 : 1,
            }} />
          );
        })}
        {/* handle */}
        <div style={{
          position: 'absolute', left: `${pct}%`, top: '50%',
          transform: 'translate(-50%, -50%)',
          width: drag ? 20 : 16, height: drag ? 20 : 16,
          borderRadius: '50%',
          background: 'var(--bg-0)',
          border: `1.5px solid ${accentColor}`,
          boxShadow: `0 0 0 3px ${accentColor.replace('var(--accent)', 'oklch(0.82 0.14 75 / 0.15)').replace('var(--teal)', 'oklch(0.78 0.12 200 / 0.15)')}, 0 2px 8px rgba(0,0,0,0.4)`,
          transition: 'width .1s, height .1s',
        }}>
          <div style={{
            position: 'absolute', inset: 4, borderRadius: '50%',
            background: accentColor,
          }} />
        </div>
        {/* value bubble when dragging */}
        {drag && (
          <div style={{
            position: 'absolute', left: `${pct}%`, bottom: '100%',
            transform: 'translate(-50%, -4px)',
            padding: '3px 7px', borderRadius: 4,
            background: 'var(--bg-0)', border: '1px solid var(--line)',
            fontFamily: 'var(--mono)', fontSize: 10, color: accentColor,
            whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>
            {value.toFixed(step < 1 ? 2 : 0)}{unit}
          </div>
        )}
      </div>
    </div>
  );
}

// Knob - rotary control
function Knob({ value, onChange, min = 0, max = 100, label, size = 56 }) {
  const ref = React.useRef(null);
  const [drag, setDrag] = React.useState(false);

  React.useEffect(() => {
    if (!drag) return;
    const move = (e) => {
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const ang = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 90;
      let norm = ((ang + 360) % 360 - 30) / 300; // -30 to 270
      norm = Math.max(0, Math.min(1, norm));
      onChange(min + norm * (max - min));
    };
    const up = () => setDrag(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [drag]);

  const norm = (value - min) / (max - min);
  const angle = -150 + norm * 300; // degrees

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div
        ref={ref}
        onPointerDown={() => setDrag(true)}
        className="no-select"
        style={{
          width: size, height: size, borderRadius: '50%',
          position: 'relative', cursor: 'grab',
          background: 'radial-gradient(circle at 35% 30%, var(--bg-3), var(--bg-0))',
          border: '1px solid var(--line)',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.3)',
        }}
      >
        {/* arc */}
        <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: 21 }).map((_, i) => {
            const t = i / 20;
            const a = (-150 + t * 300) * Math.PI / 180;
            const r1 = size / 2 - 3, r2 = size / 2 - 7;
            const cx = size / 2, cy = size / 2;
            const active = t <= norm;
            return (
              <line key={i}
                x1={cx + Math.cos(a) * r2} y1={cy + Math.sin(a) * r2}
                x2={cx + Math.cos(a) * r1} y2={cy + Math.sin(a) * r1}
                stroke={active ? 'var(--accent)' : 'var(--line)'}
                strokeWidth="1"
                opacity={active ? 0.9 : 1}
              />
            );
          })}
        </svg>
        {/* indicator */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          width: 2, height: size * 0.35,
          transformOrigin: 'center top',
          marginTop: -size * 0.15,
        }}>
          <div style={{
            position: 'absolute', top: 4, left: '50%',
            transform: 'translateX(-50%)',
            width: 3, height: 8, borderRadius: 2,
            background: 'var(--accent)',
            boxShadow: '0 0 6px var(--accent)',
          }} />
        </div>
      </div>
      <span style={bentoStyles.eyebrow}>{label}</span>
    </div>
  );
}

window.Panel = Panel;
window.Eyebrow = Eyebrow;
window.Dot = Dot;
window.Chip = Chip;
window.Btn = Btn;
window.Slider = Slider;
window.Knob = Knob;
window.bentoStyles = bentoStyles;
