// Panels: prompt/generate, floating preset cards, controls (sliders), sidebar, top bar, info

function TopBar({ scene }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 18px', height: 52,
      borderBottom: '1px solid var(--line-soft)',
      background: 'var(--bg-0)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: 'linear-gradient(135deg, var(--accent), oklch(0.65 0.16 50))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px oklch(0.82 0.14 75 / 0.35)',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="5" stroke="#1a0f00" strokeWidth="1.5"/>
              <circle cx="7" cy="7" r="1.5" fill="#1a0f00"/>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
              fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 400,
              letterSpacing: '-0.02em',
            }}>VisionSynth</span>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)',
              letterSpacing: '0.15em', marginTop: 2,
            }}>v2.4 · STUDIO</span>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '6px 12px', borderRadius: 7,
          background: 'var(--bg-1)', border: '1px solid var(--line-soft)',
        }}>
          <Icon.Folder size={12} stroke="var(--text-3)"/>
          <span style={{ fontSize: 11, color: 'var(--text-2)' }}>Campaigns</span>
          <Icon.Chevron size={10} stroke="var(--text-3)" style={{ transform: 'rotate(-90deg)' }}/>
          <span style={{ fontSize: 11, color: 'var(--text-2)' }}>Aurelian Pictures</span>
          <Icon.Chevron size={10} stroke="var(--text-3)" style={{ transform: 'rotate(-90deg)' }}/>
          <span style={{ fontSize: 11, color: 'var(--text-0)', fontWeight: 500 }}>Teaser · Cut 03</span>
          <span style={{
            marginLeft: 4, padding: '1px 6px', borderRadius: 3,
            background: 'var(--accent-soft)', color: 'var(--accent)',
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.08em',
          }}>UNSAVED</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 9px', borderRadius: 7,
          background: 'var(--bg-1)', border: '1px solid var(--line-soft)',
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-2)',
        }}>
          <Dot color="var(--teal)" size={5}/>
          <span>GPU · 8× H100</span>
          <span style={{ color: 'var(--text-3)' }}>|</span>
          <span>412 credits</span>
        </div>

        {/* Avatar cluster */}
        <div style={{ display: 'flex' }}>
          {['#e89456', '#4ee0b0', '#ff2d82'].map((c, i) => (
            <div key={i} style={{
              width: 26, height: 26, borderRadius: '50%',
              background: c, border: '2px solid var(--bg-0)',
              marginLeft: i === 0 ? 0 : -8,
              fontFamily: 'var(--serif)', fontSize: 12, color: 'rgba(0,0,0,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 500,
            }}>{['M','K','R'][i]}</div>
          ))}
        </div>

        <Btn size="sm" tone="ghost" icon={<Icon.Settings size={14}/>}/>
        <Btn size="sm" tone="primary">Export</Btn>
      </div>
    </div>
  );
}

function Sidebar({ activeScene, setActiveScene }) {
  const navItems = [
    { id: 'gen', icon: <Icon.Sparkle size={14}/>, label: 'Generate', active: true },
    { id: 'lib', icon: <Icon.Layers size={14}/>, label: 'Library' },
    { id: 'pre', icon: <Icon.Grid size={14}/>, label: 'Presets' },
    { id: 'aud', icon: <Icon.Volume size={14}/>, label: 'Audio' },
    { id: 'ren', icon: <Icon.Aperture size={14}/>, label: 'Render' },
  ];

  return (
    <div style={{
      width: 66, flexShrink: 0,
      borderRight: '1px solid var(--line-soft)',
      background: 'var(--bg-0)',
      display: 'flex', flexDirection: 'column',
      padding: '14px 0 14px',
      alignItems: 'center', gap: 4,
    }}>
      {navItems.map(n => (
        <button key={n.id} style={{
          width: 44, height: 44, borderRadius: 10, border: 'none',
          background: n.active ? 'var(--bg-2)' : 'transparent',
          color: n.active ? 'var(--accent)' : 'var(--text-2)',
          cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 3, position: 'relative',
        }}>
          {n.active && <div style={{
            position: 'absolute', left: -1, top: 12, bottom: 12, width: 2,
            background: 'var(--accent)', borderRadius: '0 2px 2px 0',
          }}/>}
          {n.icon}
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 8.5,
            letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>{n.label}</span>
        </button>
      ))}

      <div style={{ flex: 1 }}/>

      <Eyebrow style={{ margin: '6px 0 4px', fontSize: 9 }}>Scenes</Eyebrow>
      {window.SCENES.map((s, i) => (
        <button key={s.id} onClick={() => setActiveScene(i)} style={{
          width: 44, height: 32, borderRadius: 7, border: 'none',
          padding: 0, cursor: 'pointer', position: 'relative',
          background: 'transparent',
          outline: activeScene === i ? '1.5px solid var(--accent)' : 'none',
          outlineOffset: 1,
        }}>
          <div style={{
            width: '100%', height: '100%', borderRadius: 6,
            background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]}, ${s.colors[2]})`,
          }}/>
          <span style={{
            position: 'absolute', top: 2, left: 3,
            fontFamily: 'var(--mono)', fontSize: 8, fontWeight: 600,
            color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em',
          }}>0{i+1}</span>
        </button>
      ))}
    </div>
  );
}

function PromptPanel({ scene, setScene }) {
  const [prompt, setPrompt] = React.useState(scene.prompt);
  React.useEffect(() => setPrompt(scene.prompt), [scene.id]);

  return (
    <Panel
      style={{ height: '100%' }}
      headerLeft={<>
        <Eyebrow>Prompt</Eyebrow>
        <Chip tone="ghost">T2V · v4.2</Chip>
      </>}
      headerRight={<Btn size="sm" tone="ghost" icon={<Icon.Mic size={12}/>}/>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
        <div style={{
          position: 'relative',
          background: 'var(--bg-0)',
          border: '1px solid var(--line)',
          borderRadius: 10,
          padding: 14, minHeight: 120, flex: 1,
        }}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{
              width: '100%', height: '100%', minHeight: 96,
              background: 'transparent', border: 'none', outline: 'none', resize: 'none',
              fontFamily: 'var(--serif)', fontSize: 20, lineHeight: 1.35,
              color: 'var(--text-0)', letterSpacing: '-0.01em',
              fontFeatureSettings: '"ss01"',
            }}
          />
          {/* tag chips */}
          <div style={{ position: 'absolute', bottom: 10, left: 14, display: 'flex', gap: 5 }}>
            <Chip tone="accent"><Icon.Wand size={10}/> enhance</Chip>
            <Chip><Icon.Stars size={10}/> restyle</Chip>
            <Chip>refine</Chip>
          </div>
        </div>

        {/* Reference row */}
        <div>
          <Eyebrow style={{ marginBottom: 8, display: 'block' }}>References · 3</Eyebrow>
          <div style={{ display: 'flex', gap: 8 }}>
            {scene.colors.slice(0, 3).map((c, i) => (
              <div key={i} style={{
                width: 44, height: 44, borderRadius: 8,
                background: `linear-gradient(135deg, ${c}, ${scene.colors[(i+1) % scene.colors.length]})`,
                border: '1px solid var(--line)',
                position: 'relative',
              }}>
                <span style={{
                  position: 'absolute', top: 2, right: 3,
                  fontFamily: 'var(--mono)', fontSize: 8, color: 'rgba(255,255,255,0.8)',
                }}>{i+1}</span>
              </div>
            ))}
            <button style={{
              width: 44, height: 44, borderRadius: 8,
              background: 'transparent', border: '1px dashed var(--line)',
              color: 'var(--text-3)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon.Plus size={14}/></button>
          </div>
        </div>

        {/* Generate CTA */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn tone="primary" size="lg" icon={<Icon.Sparkle size={14}/>} style={{ flex: 1 }}>
            Generate · 12 credits
          </Btn>
          <Btn size="lg" tone="outline" icon={<Icon.Chevron size={12}/>}/>
        </div>

        {/* Meta */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
          paddingTop: 10, borderTop: '1px solid var(--line-soft)',
        }}>
          {[
            { label: 'Duration', value: '08s' },
            { label: 'Resolution', value: '1080p' },
            { label: 'Motion', value: 'High' },
          ].map(m => (
            <div key={m.label} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Eyebrow>{m.label}</Eyebrow>
              <span style={{ ...bentoStyles.editorial, fontSize: 17 }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function PresetCards({ active, setActive }) {
  return (
    <Panel
      style={{ height: '100%' }}
      headerLeft={<>
        <Eyebrow>Style Presets</Eyebrow>
        <Chip tone="ghost">6</Chip>
      </>}
      headerRight={<Btn size="sm" tone="ghost" icon={<Icon.Search size={12}/>}/>}
    >
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10,
      }}>
        {window.PRESETS.map((p, i) => {
          const isActive = active === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActive(p.id)}
              style={{
                position: 'relative',
                background: isActive
                  ? `linear-gradient(150deg, oklch(0.28 0.10 ${p.hue} / 0.6), oklch(0.20 0.06 ${p.hue} / 0.3))`
                  : 'var(--bg-2)',
                border: isActive ? '1px solid var(--accent-line)' : '1px solid var(--line)',
                borderRadius: 10,
                padding: 10,
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', flexDirection: 'column', gap: 6,
                overflow: 'hidden',
                transform: isActive ? 'translateY(-2px)' : 'none',
                boxShadow: isActive
                  ? `0 8px 24px oklch(0.50 0.12 ${p.hue} / 0.25), 0 0 0 3px var(--accent-soft)`
                  : '0 2px 6px rgba(0,0,0,0.3)',
                transition: 'transform .15s, box-shadow .15s',
              }}
            >
              {/* swatch */}
              <div style={{
                height: 48, borderRadius: 6,
                background: `conic-gradient(from ${p.hue}deg, oklch(0.70 0.15 ${p.hue}), oklch(0.40 0.10 ${(p.hue + 60) % 360}), oklch(0.85 0.12 ${(p.hue + 120) % 360}), oklch(0.70 0.15 ${p.hue}))`,
                position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.3)',
              }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,0.15) 2px 3px)',
                }}/>
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 14, height: 14, borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon.Check size={10} stroke="var(--bg-0)"/></div>
                )}
              </div>

              <div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>{p.kind}</div>
                <div style={{
                  ...bentoStyles.editorial, fontSize: 15, color: 'var(--text-0)',
                  marginTop: 2, lineHeight: 1.1,
                }}>{p.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function ControlsPanel({ frameInterp, setFrameInterp, styleIntensity, setStyleIntensity, motion, setMotion, exposure, setExposure }) {
  return (
    <Panel
      style={{ height: '100%' }}
      headerLeft={<>
        <Eyebrow>Controls</Eyebrow>
        <Chip tone="ghost">Live</Chip>
      </>}
      headerRight={<Btn size="sm" tone="ghost">Reset</Btn>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Slider
          label="Frame Interpolation"
          detail="RIFE · 60 fps target"
          value={frameInterp}
          onChange={setFrameInterp}
          min={0} max={4} step={0.01}
          unit="×"
          ticks={5}
        />
        <div style={{ height: 1, background: 'var(--line-soft)' }}/>
        <Slider
          label="Style Intensity"
          detail="Kodak Portra 400"
          value={styleIntensity}
          onChange={setStyleIntensity}
          min={0} max={100} step={1}
          unit="%"
          ticks={11}
          tone="teal"
        />

        <div style={{ height: 1, background: 'var(--line-soft)' }}/>

        <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: 2 }}>
          <Knob value={motion} onChange={setMotion} min={0} max={100} label="Motion"/>
          <Knob value={exposure} onChange={setExposure} min={-2} max={2} label="EV"/>
          <Knob value={50} onChange={() => {}} min={0} max={100} label="Grain"/>
        </div>
      </div>
    </Panel>
  );
}

function GenerationsPanel({ scene }) {
  const versions = [
    { id: 'v04', name: 'v04', current: true, score: 92, time: '2m 14s' },
    { id: 'v03', name: 'v03', score: 78, time: '1m 58s' },
    { id: 'v02', name: 'v02', score: 71, time: '2m 03s' },
    { id: 'v01', name: 'v01', score: 64, time: '2m 11s' },
  ];
  return (
    <Panel
      style={{ height: '100%' }}
      headerLeft={<><Eyebrow>Generations</Eyebrow><Chip tone="ghost">4</Chip></>}
      headerRight={<Btn size="sm" tone="ghost" icon={<Icon.Chevron size={12}/>}/>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {versions.map((v, i) => (
          <div key={v.id} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: 6, borderRadius: 8,
            background: v.current ? 'var(--bg-2)' : 'transparent',
            border: v.current ? '1px solid var(--accent-line)' : '1px solid transparent',
          }}>
            <div style={{
              width: 48, height: 32, borderRadius: 5, flexShrink: 0,
              background: `linear-gradient(${120 + i*30}deg, ${scene.colors[0]}, ${scene.colors[i % scene.colors.length]})`,
              position: 'relative', overflow: 'hidden',
              border: '1px solid var(--line)',
            }}>
              {v.current && <div style={{
                position: 'absolute', inset: 0,
                border: '1.5px solid var(--accent)', borderRadius: 4,
              }}/>}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-0)', fontWeight: 500 }}>{v.name}</span>
                {v.current && <Chip tone="accent" style={{ padding: '1px 5px', fontSize: 8 }}>Current</Chip>}
              </div>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)' }}>{v.time}</span>
            </div>
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 18, color: v.current ? 'var(--accent)' : 'var(--text-2)',
              fontFeatureSettings: '"tnum"',
            }}>{v.score}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function StatusBar({ playing, playhead, scene }) {
  const items = [
    { k: 'PROJECT', v: 'Aurelian · Teaser 03' },
    { k: 'CODEC', v: 'ProRes 422 HQ' },
    { k: 'COLOR', v: 'Rec.2020 HDR' },
    { k: 'MEM', v: '14.2 / 80 GB' },
  ];
  return (
    <div style={{
      height: 28, borderTop: '1px solid var(--line-soft)',
      display: 'flex', alignItems: 'center',
      padding: '0 18px', gap: 18,
      fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-3)',
      letterSpacing: '0.05em', background: 'var(--bg-0)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Dot color={playing ? 'var(--accent)' : 'var(--text-3)'} size={6}
          style={{ animation: playing ? 'pulse 1.5s ease-in-out infinite' : 'none' }}/>
        <span style={{ color: playing ? 'var(--accent)' : 'var(--text-2)' }}>
          {playing ? 'PLAYING' : 'READY'}
        </span>
      </div>
      {items.map(it => (
        <div key={it.k} style={{ display: 'flex', gap: 6 }}>
          <span style={{ color: 'var(--text-3)' }}>{it.k}</span>
          <span style={{ color: 'var(--text-1)' }}>{it.v}</span>
        </div>
      ))}
      <div style={{ flex: 1 }}/>
      <span>PLAYHEAD {playhead.toFixed(2)}s</span>
      <span style={{ color: 'var(--accent)' }}>● LIVE COLLAB</span>
    </div>
  );
}

window.TopBar = TopBar;
window.Sidebar = Sidebar;
window.PromptPanel = PromptPanel;
window.PresetCards = PresetCards;
window.ControlsPanel = ControlsPanel;
window.GenerationsPanel = GenerationsPanel;
window.StatusBar = StatusBar;
