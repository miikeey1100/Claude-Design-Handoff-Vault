// BioPulse — Frosted glass widgets + sliders + charts

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────
// Cinematic background — layered gradients to evoke a deep-blurred photograph
// (abstract aurora / bioluminescence, no branded imagery)
// ─────────────────────────────────────────────────────────────
function CinematicBackdrop({ mode = 'aurora' }) {
  const backdrops = {
    aurora: (
      <>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(120% 80% at 20% 15%, oklch(0.42 0.18 18 / 0.85) 0%, transparent 55%), radial-gradient(100% 70% at 85% 40%, oklch(0.38 0.2 320 / 0.7) 0%, transparent 55%), radial-gradient(120% 90% at 50% 110%, oklch(0.45 0.15 240 / 0.9) 0%, transparent 60%), #070812',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(60% 40% at 30% 30%, oklch(0.6 0.22 18 / 0.4), transparent 70%), radial-gradient(50% 35% at 75% 70%, oklch(0.55 0.18 280 / 0.35), transparent 70%)',
          filter: 'blur(40px)',
        }} />
        {/* film grain */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.35, mixBlendMode: 'overlay',
          background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }} />
        {/* vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }} />
      </>
    ),
    ember: (
      <>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(110% 70% at 50% 0%, oklch(0.5 0.22 30 / 0.9), transparent 60%), radial-gradient(90% 60% at 30% 100%, oklch(0.35 0.18 50 / 0.8), transparent 60%), #0a0604',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.3, mixBlendMode: 'overlay',
          background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 50%, transparent 35%, rgba(0,0,0,0.75) 100%)' }} />
      </>
    ),
    nocturne: (
      <>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(100% 70% at 70% 20%, oklch(0.42 0.14 240 / 0.85), transparent 60%), radial-gradient(90% 60% at 20% 80%, oklch(0.35 0.12 200 / 0.8), transparent 60%), #04070f',
        }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.3, mixBlendMode: 'overlay',
          background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 90% at 50% 50%, transparent 35%, rgba(0,0,0,0.75) 100%)' }} />
      </>
    ),
  };
  return <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>{backdrops[mode] || backdrops.aurora}</div>;
}

// ─────────────────────────────────────────────────────────────
// Frosted glass container
// ─────────────────────────────────────────────────────────────
function Glass({ children, style = {}, intensity = 'medium', onClick }) {
  const blurAmt = { light: 18, medium: 28, heavy: 40 }[intensity] || 28;
  const bgOpacity = { light: 0.06, medium: 0.10, heavy: 0.14 }[intensity] || 0.10;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', borderRadius: 28, overflow: 'hidden',
        background: `rgba(255,255,255,${bgOpacity})`,
        backdropFilter: `blur(${blurAmt}px) saturate(180%)`,
        WebkitBackdropFilter: `blur(${blurAmt}px) saturate(180%)`,
        border: '0.5px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* inner highlight */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 40%, transparent 100%)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Live heart rate chart
// ─────────────────────────────────────────────────────────────
function HeartRateChart({ bpm, intensity = 50 }) {
  const [samples, setSamples] = useState(() => Array.from({ length: 60 }, () => 0));
  const phase = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      phase.current += 0.28;
      setSamples(prev => {
        // ECG-like waveform: mostly flat with a PQRST spike every ~12 samples
        const t = phase.current;
        const cyclePos = t % 6;
        let v = (Math.random() - 0.5) * 0.04;
        if (cyclePos < 0.2) v += -0.1; // Q
        else if (cyclePos < 0.4) v += 0.95 + (intensity - 50) / 200; // R
        else if (cyclePos < 0.6) v += -0.35; // S
        else if (cyclePos < 1.0) v += 0.15 * Math.sin((cyclePos - 0.6) * Math.PI * 2.5); // T
        return [...prev.slice(1), v];
      });
    }, 80);
    return () => clearInterval(id);
  }, [intensity]);

  const width = 320, height = 90;
  const path = useMemo(() => {
    return samples.map((v, i) => {
      const x = (i / (samples.length - 1)) * width;
      const y = height / 2 - v * (height / 2 - 8);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }, [samples]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="hrFade" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.22 18)" stopOpacity="0" />
          <stop offset="30%" stopColor="oklch(0.68 0.22 18)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="oklch(0.78 0.24 18)" stopOpacity="1" />
        </linearGradient>
        <linearGradient id="hrFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.22 18)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="oklch(0.68 0.22 18)" stopOpacity="0" />
        </linearGradient>
        <filter id="hrGlow">
          <feGaussianBlur stdDeviation="2" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map(p => (
        <line key={p} x1="0" x2={width} y1={height * p} y2={height * p}
          stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="2,3" />
      ))}
      <path d={`${path} L${width},${height} L0,${height} Z`} fill="url(#hrFill)" opacity="0.6" />
      <path d={path} fill="none" stroke="url(#hrFade)" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" filter="url(#hrGlow)" />
      {/* leading dot */}
      <circle cx={width - 2} cy={height / 2 - samples[samples.length - 1] * (height / 2 - 8)} r="3"
        fill="oklch(0.85 0.22 18)" style={{ filter: 'drop-shadow(0 0 6px oklch(0.7 0.25 18))' }}>
        <animate attributeName="r" values="3;4.5;3" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Sleep quality ring
// ─────────────────────────────────────────────────────────────
function SleepRing({ score = 87, size = 96 }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <defs>
        <linearGradient id="sleepGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.12 220)" />
          <stop offset="100%" stopColor="oklch(0.7 0.18 280)" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#sleepGrad)" strokeWidth="6"
        strokeLinecap="round" strokeDasharray={`${dash} ${c}`}
        style={{ filter: 'drop-shadow(0 0 8px oklch(0.7 0.2 240 / 0.6))', transition: 'stroke-dasharray 0.6s ease' }} />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Hypnogram (tiny sleep stages bar)
// ─────────────────────────────────────────────────────────────
function Hypnogram() {
  // 0=awake, 1=REM, 2=light, 3=deep — series of 40 bars
  const stages = useMemo(() => [
    1,2,2,3,3,3,2,2,1,1,2,3,3,2,2,1,2,2,3,3,
    2,2,1,1,2,3,2,2,1,2,2,2,1,1,2,2,1,0,1,2,
  ], []);
  const colors = ['rgba(255,255,255,0.35)', 'oklch(0.75 0.18 330)', 'oklch(0.7 0.14 240)', 'oklch(0.55 0.18 260)'];
  return (
    <div style={{ display: 'flex', gap: 2, height: 34, alignItems: 'flex-end' }}>
      {stages.map((s, i) => (
        <div key={i} style={{
          flex: 1, height: `${(s + 1) * 22}%`, minHeight: 4,
          background: colors[s], borderRadius: 1.5,
          boxShadow: `0 0 4px ${colors[s]}`,
        }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Custom slider — glass track with gradient fill
// ─────────────────────────────────────────────────────────────
function GlassSlider({ value, onChange, min = 0, max = 100, accent = 'oklch(0.68 0.22 18)', label, suffix = '%', ticks = 5 }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const pct = ((value - min) / (max - min)) * 100;

  const update = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const v = Math.round(min + (x / rect.width) * (max - min));
    onChange(v);
  };

  useEffect(() => {
    if (!dragging) return;
    const move = e => update(e.touches ? e.touches[0].clientX : e.clientX);
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, [dragging]);

  return (
    <div style={{ userSelect: 'none' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', letterSpacing: 0.4, textTransform: 'uppercase', fontWeight: 500 }}>
            {label}
          </span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: 22, fontWeight: 600, color: '#fff', letterSpacing: -0.5 }}>
            {value}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginLeft: 2 }}>{suffix}</span>
          </span>
        </div>
      )}
      <div
        ref={trackRef}
        onMouseDown={e => { setDragging(true); update(e.clientX); }}
        onTouchStart={e => { setDragging(true); update(e.touches[0].clientX); }}
        style={{
          position: 'relative', height: 38, display: 'flex', alignItems: 'center',
          cursor: 'pointer', touchAction: 'none',
        }}
      >
        {/* track */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 10, borderRadius: 5,
          background: 'rgba(255,255,255,0.08)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}>
          {/* ticks */}
          {Array.from({ length: ticks }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: `${(i / (ticks - 1)) * 100}%`,
              top: '50%', width: 1, height: 4, marginTop: -2,
              background: 'rgba(255,255,255,0.15)', transform: 'translateX(-0.5px)',
            }} />
          ))}
          {/* fill */}
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`,
            background: `linear-gradient(90deg, ${accent} 0%, ${accent.replace('0.22', '0.26').replace('0.12', '0.18')} 100%)`,
            boxShadow: `0 0 12px ${accent}, inset 0 1px 0 rgba(255,255,255,0.25)`,
            transition: dragging ? 'none' : 'width 0.15s ease',
          }} />
        </div>
        {/* thumb */}
        <div style={{
          position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
          width: 28, height: 28, borderRadius: '50%',
          background: 'linear-gradient(180deg, #fff 0%, #e4e4e7 100%)',
          boxShadow: `0 0 0 0.5px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.4), 0 0 18px ${accent}`,
          transition: dragging ? 'none' : 'left 0.15s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 4px ${accent}` }} />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Small inline icon set (original, simple geometric)
// ─────────────────────────────────────────────────────────────
const Icon = {
  spark: (c = '#fff') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L8.2 5.8L13 7L8.2 8.2L7 13L5.8 8.2L1 7L5.8 5.8L7 1Z" fill={c}/>
    </svg>
  ),
  heart: (c = '#fff') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 12S1.5 8.5 1.5 4.8C1.5 3 2.9 1.5 4.7 1.5C5.9 1.5 6.6 2.2 7 3C7.4 2.2 8.1 1.5 9.3 1.5C11.1 1.5 12.5 3 12.5 4.8C12.5 8.5 7 12 7 12Z" fill={c}/>
    </svg>
  ),
  moon: (c = '#fff') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M11.5 8.5C10.9 8.8 10.2 9 9.5 9C6.7 9 4.5 6.8 4.5 4C4.5 3.3 4.7 2.6 5 2C3.2 2.7 2 4.4 2 6.5C2 9 4 11 6.5 11C8.6 11 10.3 9.8 11.5 8.5Z" fill={c}/>
    </svg>
  ),
  activity: (c = '#fff') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7H3.5L5 3L9 11L10.5 7H13" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  flame: (c = '#fff') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1C7 3.5 4 4 4 7.5C4 9.9 5.3 12 7 12C8.7 12 10 9.9 10 7.5C10 6.5 9.5 5.7 9 5C8.7 6 8 6.5 7.5 6C7.5 4 7 2.5 7 1Z" fill={c}/>
    </svg>
  ),
  breath: (c = '#fff') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="3" stroke={c} strokeWidth="1.3" />
      <circle cx="7" cy="7" r="5.5" stroke={c} strokeWidth="1" strokeOpacity="0.5" strokeDasharray="2 2" />
    </svg>
  ),
  o2: (c = '#fff') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1C7 1 2.5 5.5 2.5 8.5C2.5 11 4.5 13 7 13C9.5 13 11.5 11 11.5 8.5C11.5 5.5 7 1 7 1Z" fill={c}/>
    </svg>
  ),
  ai: (c = '#fff') => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 1L8 4L11 5L8 6L7 9L6 6L3 5L6 4L7 1Z" fill={c}/>
      <circle cx="11" cy="11" r="1.5" fill={c}/>
      <circle cx="3" cy="11" r="1" fill={c} opacity="0.7"/>
    </svg>
  ),
};

Object.assign(window, {
  CinematicBackdrop, Glass, HeartRateChart, SleepRing, Hypnogram, GlassSlider, Icon,
});
