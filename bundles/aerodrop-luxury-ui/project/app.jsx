// Main AeroDrop app
const { useState, useEffect, useRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentHue": 305,
  "showGridOverlay": true,
  "agentName": "Agent ADR-07",
  "mapIntensity": 1
}/*EDITMODE-END*/;

function AeroDropApp() {
  const [priority, setPriority] = useState(0.66);
  const [stealth, setStealth] = useState(0.35);
  const [dispatched, setDispatched] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS);
  const [editModeAvailable, setEditModeAvailable] = useState(false);

  // Derived values
  const priorityLevel = priority < 0.33 ? 0 : priority < 0.66 ? 1 : priority < 0.9 ? 2 : 3;
  const etaBase = 14;
  const eta = Math.max(3, Math.round(etaBase - priority * 8 + stealth * 4));
  const distance = (4.2 + stealth * 0.8).toFixed(1);

  // Edit-mode wire-up
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    setEditModeAvailable(true);
    return () => window.removeEventListener('message', handler);
  }, []);

  const updateTweak = (key, val) => {
    setTweaks((t) => {
      const next = { ...t, [key]: val };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: val } }, '*');
      return next;
    });
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      background: 'radial-gradient(ellipse at 50% 10%, oklch(0.16 0.04 290) 0%, oklch(0.07 0.015 285) 55%, #000 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, boxSizing: 'border-box',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-primary)',
      overflow: 'hidden', position: 'relative',
    }}
    data-screen-label="AeroDrop Delivery Control">
      {/* Ambient glow behind phone */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%',
        transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, oklch(0.5 0.28 ${tweaks.accentHue} / 0.25), transparent 60%)`,
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '20%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(0.45 0.2 260 / 0.2), transparent 65%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      <IOSDevice width={402} height={874} dark={true}>
        <AeroDropScreen
          priority={priority} setPriority={setPriority}
          stealth={stealth} setStealth={setStealth}
          dispatched={dispatched} setDispatched={setDispatched}
          eta={eta} distance={distance}
          tweaks={tweaks}
        />
      </IOSDevice>

      {/* Tweaks panel */}
      {tweaksOpen && (
        <TweaksPanel
          tweaks={tweaks}
          update={updateTweak}
          onClose={() => setTweaksOpen(false)}
        />
      )}
    </div>
  );
}

function AeroDropScreen({
  priority, setPriority, stealth, setStealth,
  dispatched, setDispatched, eta, distance, tweaks,
}) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#000',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Map fills most of screen */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <PathfindingMap stealth={stealth} priority={priority} />
      </div>

      {/* Top overlay: status bar + header */}
      <div style={{ position: 'relative', zIndex: 10, flex: '0 0 auto' }}>
        <IOSStatusBar dark={true} />

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 16px 0',
        }}>
          <HeaderPill>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M4 6h16M4 12h16M4 18h10" stroke="oklch(0.98 0.005 285)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </HeaderPill>

          <div style={{ textAlign: 'center' }}>
            <div className="ad-label" style={{ fontSize: 9, color: 'oklch(0.72 0.28 305)' }}>
              AERODROP · LIVE
            </div>
            <div style={{
              fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600,
              color: 'var(--text-primary)', letterSpacing: '-0.01em', marginTop: 1,
            }}>Mission #DR‑48291</div>
          </div>

          <HeaderPill>
            <div style={{ position: 'relative', width: 14, height: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="oklch(0.98 0.005 285)" strokeWidth="2"/>
                <path d="M12 7v5l3 3" stroke="oklch(0.98 0.005 285)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div style={{
                position: 'absolute', top: -2, right: -2,
                width: 6, height: 6, borderRadius: '50%',
                background: 'oklch(0.72 0.28 305)',
                boxShadow: '0 0 6px oklch(0.72 0.28 305)',
              }} />
            </div>
          </HeaderPill>
        </div>
      </div>

      {/* Bottom stack */}
      <div style={{
        flex: '1 1 auto', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', position: 'relative', zIndex: 10,
      }}>
        {/* Gradient veil so bottom panels read over map */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(180deg, transparent 0%, oklch(0.07 0.015 285 / 0.5) 35%, oklch(0.06 0.015 285 / 0.85) 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'relative', padding: '0 0 36px',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <AgentStatusCard
            priority={priority} stealth={stealth}
            eta={eta} distance={distance}
          />

          {/* Controls glass sheet */}
          <div className="ad-glass" style={{
            margin: '0 16px', borderRadius: 'var(--r-xl)',
            overflow: 'hidden',
          }}>
            <GlassSlider
              value={priority}
              onChange={setPriority}
              label="PRIORITY"
              levels={['eco', 'standard', 'rush', 'urgent']}
              accentHue={305}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor"/>
                </svg>
              }
            />
            <div style={{ height: 0.5, background: 'oklch(1 0 0 / 0.08)', margin: '0 16px' }} />
            <GlassSlider
              value={stealth}
              onChange={setStealth}
              label="STEALTH MODE"
              levels={['off', 'low', 'covert', 'ghost']}
              accentHue={280}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4C7 4 3 8 2 12c1 4 5 8 10 8s9-4 10-8c-1-4-5-8-10-8z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
              }
            />
          </div>

          {/* Action row */}
          <div style={{ padding: '0 16px', display: 'flex', gap: 10 }}>
            <button style={{
              flex: '0 0 auto', width: 52, height: 52, borderRadius: 18,
              border: '0.5px solid oklch(1 0 0 / 0.12)',
              background: 'oklch(1 0 0 / 0.06)',
              backdropFilter: 'blur(30px) saturate(180%)',
              color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8 10h8M8 14h5M12 3l9 5v8l-9 5-9-5V8l9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => setDispatched(d => !d)}
              style={{
                flex: 1, height: 52, borderRadius: 18,
                border: '0.5px solid oklch(0.72 0.28 305 / 0.5)',
                background: dispatched
                  ? 'linear-gradient(180deg, oklch(0.38 0.22 305), oklch(0.28 0.18 305))'
                  : 'linear-gradient(180deg, oklch(0.72 0.28 305), oklch(0.55 0.26 305))',
                boxShadow: dispatched
                  ? 'inset 0 1px 0 oklch(1 0 0 / 0.2), 0 4px 12px oklch(0 0 0 / 0.4)'
                  : '0 0 24px oklch(0.72 0.28 305 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.35), 0 6px 20px oklch(0.55 0.28 305 / 0.5)',
                color: '#fff', cursor: 'pointer',
                fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
                letterSpacing: '-0.01em',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, transition: 'all 0.2s',
              }}>
              {dispatched ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="6" y="6" width="12" height="12" rx="2" fill="#fff"/>
                  </svg>
                  Abort Mission
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3l14 9-14 9V3z" fill="#fff"/>
                  </svg>
                  Dispatch Drone
                </>
              )}
            </button>
            <button style={{
              flex: '0 0 auto', width: 52, height: 52, borderRadius: 18,
              border: '0.5px solid oklch(1 0 0 / 0.12)',
              background: 'oklch(1 0 0 / 0.06)',
              backdropFilter: 'blur(30px) saturate(180%)',
              color: 'var(--text-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderPill({ children }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: '50%',
      background: 'oklch(0.14 0.02 285 / 0.6)',
      backdropFilter: 'blur(20px) saturate(180%)',
      border: '0.5px solid oklch(1 0 0 / 0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: 'inset 0 0.5px 0 oklch(1 0 0 / 0.15)',
    }}>
      {children}
    </div>
  );
}

function TweaksPanel({ tweaks, update, onClose }) {
  return (
    <div style={{
      position: 'fixed', right: 24, bottom: 24, zIndex: 1000,
      width: 280, borderRadius: 20,
      background: 'oklch(0.12 0.02 285 / 0.85)',
      backdropFilter: 'blur(40px) saturate(180%)',
      border: '0.5px solid oklch(1 0 0 / 0.15)',
      boxShadow: '0 20px 60px oklch(0 0 0 / 0.6)',
      padding: 16, color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Tweaks</div>
        <button onClick={onClose} style={{
          background: 'oklch(1 0 0 / 0.1)', border: 'none', color: '#fff',
          width: 24, height: 24, borderRadius: 12, cursor: 'pointer',
          fontSize: 14, lineHeight: 1,
        }}>×</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div className="ad-label" style={{ fontSize: 9, marginBottom: 6 }}>ACCENT HUE</div>
          <input type="range" min="0" max="360" value={tweaks.accentHue}
            onChange={(e) => update('accentHue', +e.target.value)}
            style={{ width: '100%', accentColor: `oklch(0.72 0.28 ${tweaks.accentHue})` }} />
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: `oklch(0.85 0.2 ${tweaks.accentHue})`, marginTop: 2,
          }}>{tweaks.accentHue}°</div>
        </div>
        <div>
          <div className="ad-label" style={{ fontSize: 9, marginBottom: 6 }}>AGENT NAME</div>
          <input type="text" value={tweaks.agentName}
            onChange={(e) => update('agentName', e.target.value)}
            style={{
              width: '100%', padding: '6px 10px',
              background: 'oklch(1 0 0 / 0.06)',
              border: '0.5px solid oklch(1 0 0 / 0.12)',
              borderRadius: 8, color: '#fff', fontSize: 12,
              fontFamily: 'var(--font-mono)', boxSizing: 'border-box',
            }} />
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
          <input type="checkbox" checked={tweaks.showGridOverlay}
            onChange={(e) => update('showGridOverlay', e.target.checked)} />
          Show grid overlay
        </label>
      </div>
    </div>
  );
}

Object.assign(window, { AeroDropApp });

ReactDOM.createRoot(document.getElementById('root')).render(<AeroDropApp />);
