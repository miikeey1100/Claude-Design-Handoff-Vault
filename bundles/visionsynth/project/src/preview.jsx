// Cinematic preview window with ambient glow backlighting

function GlowBacklight({ colors, intensity = 0.9 }) {
  // Ambient-light style: blurred radial blobs behind the preview sampled from current scene
  return (
    <div style={{
      position: 'absolute', inset: -80, pointerEvents: 'none', zIndex: 0,
      filter: `blur(80px) saturate(1.2)`,
      opacity: intensity,
    }}>
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden',
      }}>
        {colors.map((c, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: '60%', height: '60%',
            left: `${[5, 55, 20, 60][i]}%`,
            top: `${[10, 15, 55, 50][i]}%`,
            background: c,
            borderRadius: '50%',
            opacity: 0.6,
            animation: `glowShift ${14 + i * 3}s ease-in-out ${i * 2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// SVG "video frame" placeholder — per-scene stylized mock
function PreviewFrame({ scene }) {
  const { colors, label } = scene;

  const frames = {
    s1: ( // Neon Arcade — city alley
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a0a2e"/><stop offset="1" stopColor="#3a0a4e"/>
          </linearGradient>
          <radialGradient id="neon1" cx="0.3" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ff2d82" stopOpacity="0.6"/>
            <stop offset="1" stopColor="#ff2d82" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="neon2" cx="0.75" cy="0.3" r="0.4">
            <stop offset="0" stopColor="#0ea5ff" stopOpacity="0.5"/>
            <stop offset="1" stopColor="#0ea5ff" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#sky1)"/>
        <rect width="1600" height="900" fill="url(#neon1)"/>
        <rect width="1600" height="900" fill="url(#neon2)"/>
        {/* buildings */}
        <rect x="0" y="200" width="380" height="700" fill="#0a0418"/>
        <rect x="400" y="120" width="320" height="780" fill="#120828"/>
        <rect x="880" y="160" width="360" height="740" fill="#0a0418"/>
        <rect x="1260" y="240" width="340" height="660" fill="#140830"/>
        {/* windows */}
        {Array.from({length: 40}).map((_, i) => (
          <rect key={i} x={20 + (i%8)*48} y={280 + Math.floor(i/8)*90}
            width="24" height="40" fill={Math.random() > 0.3 ? '#ffa63c' : '#1a1030'} opacity="0.7"/>
        ))}
        {/* neon signs */}
        <rect x="440" y="300" width="240" height="60" fill="none" stroke="#ff2d82" strokeWidth="4" opacity="0.9"/>
        <rect x="460" y="440" width="160" height="30" fill="#ff2d82" opacity="0.3"/>
        <rect x="920" y="380" width="80" height="180" fill="none" stroke="#00e5ff" strokeWidth="3" opacity="0.8"/>
        <rect x="1020" y="380" width="80" height="180" fill="none" stroke="#00e5ff" strokeWidth="3" opacity="0.8"/>
        {/* ground wet reflection */}
        <rect x="0" y="760" width="1600" height="140" fill="#1a0a2e" opacity="0.9"/>
        <ellipse cx="800" cy="780" rx="400" ry="20" fill="#ff2d82" opacity="0.15"/>
        {/* figure */}
        <ellipse cx="760" cy="750" rx="18" ry="6" fill="#000"/>
        <rect x="748" y="640" width="24" height="110" rx="4" fill="#0a0418"/>
        <circle cx="760" cy="630" r="12" fill="#1a0c20"/>
        {/* rain streaks */}
        {Array.from({length: 60}).map((_, i) => (
          <line key={i}
            x1={Math.random()*1600} y1={Math.random()*900}
            x2={Math.random()*1600 + 10} y2={Math.random()*900 + 40}
            stroke="#a0d0ff" strokeWidth="1" opacity={0.15 + Math.random()*0.15}/>
        ))}
      </svg>
    ),
    s2: ( // Dune Ochre
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f5d28a"/><stop offset="0.6" stopColor="#e89456"/><stop offset="1" stopColor="#8a3810"/>
          </linearGradient>
          <linearGradient id="ground2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#c2541d"/><stop offset="1" stopColor="#2a1405"/>
          </linearGradient>
        </defs>
        <rect width="1600" height="500" fill="url(#sky2)"/>
        <rect y="480" width="1600" height="420" fill="url(#ground2)"/>
        <circle cx="1100" cy="380" r="80" fill="#fff2c0" opacity="0.9"/>
        <circle cx="1100" cy="380" r="140" fill="#ffecb0" opacity="0.3"/>
        {/* dune ridges */}
        <path d="M 0 600 Q 400 540 800 610 T 1600 600 L 1600 900 L 0 900 Z" fill="#8a3810" opacity="0.6"/>
        <path d="M 0 720 Q 500 660 900 720 T 1600 710 L 1600 900 L 0 900 Z" fill="#3a1808"/>
        {/* cracks */}
        {Array.from({length: 20}).map((_, i) => (
          <path key={i}
            d={`M ${100+i*80} 800 L ${120+i*80+Math.random()*30} ${850+Math.random()*30}`}
            stroke="#1a0a03" strokeWidth="2" opacity="0.6"/>
        ))}
        {/* haze */}
        <rect y="550" width="1600" height="80" fill="#f5d28a" opacity="0.2"/>
      </svg>
    ),
    s3: ( // Aurora Rift
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#061a2e"/><stop offset="1" stopColor="#0a3048"/>
          </linearGradient>
          <linearGradient id="ice3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a6e3ff"/><stop offset="1" stopColor="#1a4870"/>
          </linearGradient>
          <radialGradient id="aur" cx="0.5" cy="0.3" r="0.6">
            <stop offset="0" stopColor="#4ee0b0" stopOpacity="0.8"/>
            <stop offset="0.5" stopColor="#1a8fb8" stopOpacity="0.4"/>
            <stop offset="1" stopColor="#1a8fb8" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#sky3)"/>
        {/* cave walls */}
        <path d="M 0 0 L 0 900 L 400 900 L 500 400 L 600 200 L 700 100 L 900 100 L 1000 200 L 1100 400 L 1200 900 L 1600 900 L 1600 0 Z" fill="url(#ice3)" opacity="0.9"/>
        {/* aurora */}
        <ellipse cx="800" cy="350" rx="320" ry="180" fill="url(#aur)"/>
        <path d="M 500 300 Q 700 200 900 300 T 1100 320" stroke="#4ee0b0" strokeWidth="3" fill="none" opacity="0.6"/>
        <path d="M 550 400 Q 750 320 950 400 T 1050 420" stroke="#a6e3ff" strokeWidth="2" fill="none" opacity="0.5"/>
        {/* ice crystals */}
        {Array.from({length: 30}).map((_, i) => (
          <circle key={i}
            cx={Math.random()*1600} cy={Math.random()*900}
            r={1 + Math.random()*2} fill="#a6e3ff" opacity={0.5 + Math.random()*0.4}/>
        ))}
        {/* bioluminescent moss */}
        <ellipse cx="200" cy="800" rx="120" ry="20" fill="#4ee0b0" opacity="0.3"/>
        <ellipse cx="1400" cy="820" rx="100" ry="18" fill="#4ee0b0" opacity="0.3"/>
      </svg>
    ),
    s4: ( // Analog Noir
      <svg viewBox="0 0 1600 900" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid slice">
        <rect width="1600" height="900" fill="#0d0604"/>
        {/* lamp glow */}
        <defs>
          <radialGradient id="lamp" cx="0.7" cy="0.4" r="0.5">
            <stop offset="0" stopColor="#ffb84a" stopOpacity="0.9"/>
            <stop offset="0.4" stopColor="#d4a64a" stopOpacity="0.4"/>
            <stop offset="1" stopColor="#d4a64a" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#lamp)"/>
        {/* blinds */}
        {Array.from({length: 24}).map((_, i) => (
          <rect key={i} x="0" y={i*38} width="1600" height="8" fill="#000" opacity="0.7"/>
        ))}
        {/* desk */}
        <rect x="0" y="700" width="1600" height="200" fill="#1a0f06"/>
        <rect x="200" y="680" width="400" height="30" fill="#2a1808"/>
        {/* lamp */}
        <circle cx="1120" cy="360" r="55" fill="#ffb84a" opacity="0.8"/>
        <rect x="1105" y="400" width="30" height="280" fill="#2a1808"/>
        {/* smoke */}
        <ellipse cx="600" cy="500" rx="180" ry="30" fill="#d4a64a" opacity="0.15"/>
        <ellipse cx="700" cy="450" rx="150" ry="25" fill="#d4a64a" opacity="0.12"/>
      </svg>
    ),
  };

  return frames[scene.id] || frames.s1;
}

function CinematicPreview({ scene, playing, onTogglePlay, onPrev, onNext, progress, glowIntensity }) {
  return (
    <div style={{
      position: 'relative', height: '100%',
      padding: 14, paddingBottom: 0,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {/* Ambient glow backlight */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 14 }}>
        <GlowBacklight colors={scene.colors} intensity={glowIntensity}/>
      </div>

      {/* Header */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Eyebrow>Preview</Eyebrow>
          <span style={{ color: 'var(--text-3)' }}>·</span>
          <Eyebrow style={{ color: 'var(--text-2)' }}>2.39 : 1 · 24 fps · HDR</Eyebrow>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Chip tone="teal"><Dot color="var(--teal)" size={5}/> Live</Chip>
          <Btn size="sm" tone="ghost" icon={<Icon.Expand size={14}/>}/>
        </div>
      </div>

      {/* Video frame */}
      <div style={{
        position: 'relative', zIndex: 1, flex: 1,
        borderRadius: 10, overflow: 'hidden',
        background: '#000',
        border: '1px solid var(--line)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.02)',
      }}>
        <PreviewFrame scene={scene}/>

        {/* Cinematic letterbox for 2.39 */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8%', background: '#000', zIndex: 3 }}/>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8%', background: '#000', zIndex: 3 }}/>

        {/* Safe area guides */}
        <svg style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }} preserveAspectRatio="none" viewBox="0 0 100 100">
          <rect x="5" y="8" width="90" height="84" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.15" strokeDasharray="1 1"/>
          <line x1="50" y1="45" x2="50" y2="55" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2"/>
          <line x1="45" y1="50" x2="55" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2"/>
        </svg>

        {/* HUD overlay */}
        <div style={{
          position: 'absolute', top: 'calc(8% + 14px)', left: 16, zIndex: 5,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 10, color: '#ff3030',
            display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '0.1em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff3030', animation: 'pulse 1.2s ease-in-out infinite' }}/>
            REC · GEN 04
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
            {scene.timecode}
          </div>
        </div>

        <div style={{
          position: 'absolute', top: 'calc(8% + 14px)', right: 16, zIndex: 5,
          fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(255,255,255,0.6)',
          textAlign: 'right', lineHeight: 1.5,
        }}>
          <div>ISO 800 · f/2.0</div>
          <div>1/48 · ARRI LogC</div>
        </div>

        {/* Film grain scan line */}
        <div style={{
          position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 4,
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'repeating-linear-gradient(0deg, transparent 0, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 3px)',
          }}/>
        </div>

        {/* Transport bar */}
        <div style={{
          position: 'absolute', bottom: 'calc(8% + 14px)', left: 16, right: 16, zIndex: 5,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={onPrev} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', cursor: 'pointer', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.Back size={14}/></button>

          <button onClick={onTogglePlay} style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--accent)', border: 'none',
            color: '#1a0f00', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px oklch(0.82 0.14 75 / 0.5)',
          }}>
            {playing ? <Icon.Pause size={16}/> : <Icon.Play size={16} style={{ marginLeft: 2 }}/>}
          </button>

          <button onClick={onNext} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', cursor: 'pointer', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icon.Fwd size={14}/></button>

          {/* Scrubber */}
          <div style={{
            flex: 1, height: 4, borderRadius: 2,
            background: 'rgba(255,255,255,0.15)', position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${progress}%`, background: 'var(--accent)',
              boxShadow: '0 0 8px var(--accent)',
            }}/>
            <div style={{
              position: 'absolute', left: `${progress}%`, top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 10, height: 10, borderRadius: '50%',
              background: 'var(--accent)',
              boxShadow: '0 0 0 2px var(--bg-0), 0 0 12px var(--accent)',
            }}/>
          </div>

          <span style={{
            fontFamily: 'var(--mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)',
            minWidth: 72, textAlign: 'right',
          }}>{scene.timecode} / 00:00:48:00</span>
        </div>
      </div>
    </div>
  );
}

window.CinematicPreview = CinematicPreview;
