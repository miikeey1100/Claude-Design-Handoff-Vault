// 3D pathfinding map — iso grid with drone, path, obstacles
function PathfindingMap({ stealth = 0, priority = 1 }) {
  const pathDashSpeed = priority < 0.33 ? '4s' : priority < 0.66 ? '2.2s' : '1.1s';
  const droneGlowOpacity = Math.max(0.15, 1 - stealth * 0.85);
  const pathOpacity = Math.max(0.35, 1 - stealth * 0.55);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: 'radial-gradient(ellipse 80% 60% at 50% 35%, oklch(0.20 0.06 295) 0%, oklch(0.11 0.02 285) 55%, oklch(0.07 0.015 285) 100%)',
    }}>
      {/* Ambient violet glow */}
      <div style={{
        position: 'absolute', top: '25%', left: '55%',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(0.55 0.28 305 / 0.35) 0%, transparent 65%)',
        animation: 'ad-glow-breath 6s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '60%', left: '15%',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(0.50 0.20 260 / 0.25) 0%, transparent 65%)',
        animation: 'ad-glow-breath 8s ease-in-out infinite 1s',
        pointerEvents: 'none',
      }} />

      {/* Iso grid (SVG) */}
      <svg viewBox="0 0 402 500" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.95 0.05 305)" stopOpacity="0.05" />
            <stop offset="40%" stopColor="oklch(0.95 0.05 305)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(0.95 0.05 305)" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.72 0.28 305)" />
            <stop offset="100%" stopColor="oklch(0.85 0.18 220)" />
          </linearGradient>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id="droneGrad">
            <stop offset="0%" stopColor="oklch(0.95 0.15 305)" />
            <stop offset="60%" stopColor="oklch(0.72 0.28 305)" />
            <stop offset="100%" stopColor="oklch(0.5 0.25 305)" />
          </radialGradient>
        </defs>

        {/* Isometric grid lines */}
        {Array.from({ length: 14 }).map((_, i) => {
          const y = 80 + i * 30;
          const skew = (y - 80) * 0.15;
          return (
            <line key={`h${i}`}
              x1={-60 + skew * 0.3} y1={y}
              x2={462 - skew * 0.3} y2={y}
              stroke="url(#gridFade)" strokeWidth="0.5" />
          );
        })}
        {Array.from({ length: 16 }).map((_, i) => {
          const x = -40 + i * 32;
          return (
            <line key={`v${i}`}
              x1={x} y1={60}
              x2={x + 50} y2={500}
              stroke="url(#gridFade)" strokeWidth="0.5" />
          );
        })}

        {/* Building blocks (iso prisms) */}
        <BuildingBlock x={70} y={180} w={42} h={28} depth={55} />
        <BuildingBlock x={130} y={220} w={36} h={24} depth={32} />
        <BuildingBlock x={260} y={160} w={48} h={32} depth={72} />
        <BuildingBlock x={310} y={270} w={38} h={26} depth={40} />
        <BuildingBlock x={60} y={310} w={44} h={30} depth={48} />
        <BuildingBlock x={200} y={350} w={40} h={26} depth={36} />

        {/* Origin node */}
        <g transform="translate(90, 410)">
          <circle r="14" fill="oklch(0.85 0.14 220 / 0.12)" />
          <circle r="8" fill="oklch(0.85 0.14 220 / 0.25)" />
          <circle r="4" fill="oklch(0.9 0.16 220)" />
          <text y="28" textAnchor="middle"
            fill="oklch(0.85 0.14 220)" fontSize="9"
            fontFamily="SF Mono, JetBrains Mono, monospace"
            letterSpacing="0.1em">ORIGIN</text>
        </g>

        {/* Flight path */}
        <g filter="url(#pathGlow)" opacity={pathOpacity}>
          <path d="M 90 410 Q 140 340, 180 300 T 260 210 Q 290 170, 320 130"
            fill="none" stroke="url(#pathGrad)" strokeWidth="2.5"
            strokeLinecap="round" strokeDasharray="6 4"
            style={{ animation: `ad-dash ${pathDashSpeed} linear infinite` }} />
          <path d="M 90 410 Q 140 340, 180 300 T 260 210 Q 290 170, 320 130"
            fill="none" stroke="oklch(0.95 0.15 305 / 0.3)" strokeWidth="6"
            strokeLinecap="round" />
        </g>

        {/* Waypoints */}
        <g opacity={pathOpacity}>
          {[[180, 300], [260, 210]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x}, ${y})`}>
              <circle r="5" fill="oklch(0.14 0.02 285)" stroke="oklch(0.72 0.28 305)" strokeWidth="1.5" />
              <circle r="2" fill="oklch(0.72 0.28 305)" />
            </g>
          ))}
        </g>

        {/* Destination */}
        <g transform="translate(320, 130)">
          <circle r="18" fill="oklch(0.72 0.28 305 / 0.08)"
            style={{ animation: 'ad-pulse-ring 2.4s ease-out infinite' }} />
          <circle r="12" fill="oklch(0.72 0.28 305 / 0.15)" />
          <circle r="7" fill="oklch(0.72 0.28 305)" />
          <circle r="3" fill="oklch(0.98 0.05 305)" />
          <text y="-22" textAnchor="middle"
            fill="oklch(0.95 0.05 305)" fontSize="9"
            fontFamily="SF Mono, JetBrains Mono, monospace"
            letterSpacing="0.1em">DROP ZONE</text>
        </g>
      </svg>

      {/* Drone marker (HTML for better pulse) */}
      <div style={{
        position: 'absolute', left: '44.8%', top: '60%',
        transform: 'translate(-50%, -50%)',
        animation: 'ad-drone-hover 2.8s ease-in-out infinite',
      }}>
        {/* Pulse rings */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 40, height: 40, borderRadius: '50%',
          background: `oklch(0.72 0.28 305 / ${0.4 * droneGlowOpacity})`,
          transform: 'translate(-50%, -50%)',
          animation: 'ad-pulse-ring 2s ease-out infinite',
        }} />
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          width: 40, height: 40, borderRadius: '50%',
          background: `oklch(0.72 0.28 305 / ${0.3 * droneGlowOpacity})`,
          transform: 'translate(-50%, -50%)',
          animation: 'ad-pulse-ring 2s ease-out infinite 0.7s',
        }} />
        {/* Drone body */}
        <div style={{
          position: 'relative',
          width: 22, height: 22, borderRadius: '50%',
          background: 'radial-gradient(circle at 30% 30%, oklch(0.98 0.05 305), oklch(0.72 0.28 305) 60%, oklch(0.45 0.22 305))',
          boxShadow: `0 0 ${12 * droneGlowOpacity}px oklch(0.72 0.28 305 / ${droneGlowOpacity}), 0 0 ${24 * droneGlowOpacity}px oklch(0.72 0.28 305 / ${0.6 * droneGlowOpacity})`,
          border: '1px solid oklch(0.95 0.05 305 / 0.6)',
        }} />
      </div>

      {/* Compass */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        width: 44, height: 44, borderRadius: '50%',
        background: 'oklch(0.14 0.02 285 / 0.55)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid oklch(1 0 0 / 0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'SF Mono, monospace', fontSize: 11, fontWeight: 700,
        color: 'oklch(0.72 0.28 305)',
        letterSpacing: '0.1em',
      }}>
        <div style={{
          position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderBottom: '6px solid oklch(0.72 0.28 305)',
        }} />
        N
      </div>

      {/* Scale indicator */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        padding: '6px 10px', borderRadius: 8,
        background: 'oklch(0.14 0.02 285 / 0.55)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid oklch(1 0 0 / 0.08)',
        fontFamily: 'SF Mono, monospace', fontSize: 10,
        color: 'oklch(0.72 0.015 285)',
        letterSpacing: '0.08em',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{ width: 24, height: 2, background: 'oklch(0.72 0.015 285)' }} />
        200m
      </div>
    </div>
  );
}

function BuildingBlock({ x, y, w, h, depth }) {
  const topLeft = [x, y];
  const topRight = [x + w, y - h * 0.35];
  const topCtr = [x + w + 12, y];
  const botLeft = [x, y + depth];
  const botCtr = [x + w + 12, y + depth];
  const topFarLeft = [x + 12, y - h * 0.7];
  const topFarRight = [x + w + 12, y - h * 0.35];

  return (
    <g opacity="0.85">
      {/* Top face */}
      <polygon
        points={`${topLeft.join(',')} ${topFarLeft.join(',')} ${topFarRight.join(',')} ${topRight.join(',')}`}
        fill="oklch(0.22 0.04 290)"
        stroke="oklch(0.72 0.28 305 / 0.35)" strokeWidth="0.75" />
      {/* Front face */}
      <polygon
        points={`${topLeft.join(',')} ${topRight.join(',')} ${[x + w, y + depth - h * 0.35].join(',')} ${botLeft.join(',')}`}
        fill="oklch(0.14 0.025 290)"
        stroke="oklch(0.72 0.28 305 / 0.25)" strokeWidth="0.75" />
      {/* Right face */}
      <polygon
        points={`${topRight.join(',')} ${topFarRight.join(',')} ${botCtr.join(',')} ${[x + w, y + depth - h * 0.35].join(',')}`}
        fill="oklch(0.10 0.02 290)"
        stroke="oklch(0.72 0.28 305 / 0.2)" strokeWidth="0.75" />
      {/* Window glints */}
      <circle cx={x + w * 0.3} cy={y + depth * 0.4} r="0.8" fill="oklch(0.72 0.28 305)" opacity="0.8" />
      <circle cx={x + w * 0.7} cy={y + depth * 0.6} r="0.8" fill="oklch(0.85 0.14 220)" opacity="0.6" />
    </g>
  );
}

Object.assign(window, { PathfindingMap });
