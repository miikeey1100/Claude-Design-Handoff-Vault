// Multi-track timeline with magnetic snapping

function Ruler({ duration, zoom, offset }) {
  const ticks = [];
  const major = 4; // every 4s
  for (let t = 0; t <= duration; t++) {
    const isMajor = t % major === 0;
    ticks.push(
      <div key={t} style={{
        position: 'absolute', left: `${(t / duration) * 100}%`, top: 0, bottom: 0,
        width: 1, background: isMajor ? 'var(--line)' : 'var(--line-soft)',
        opacity: isMajor ? 1 : 0.4,
      }}>
        {isMajor && (
          <span style={{
            position: 'absolute', top: 3, left: 4, whiteSpace: 'nowrap',
            fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)',
            letterSpacing: '0.05em',
          }}>
            {`00:${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`}
          </span>
        )}
      </div>
    );
  }
  return (
    <div style={{
      position: 'relative', height: 26,
      borderBottom: '1px solid var(--line-soft)',
      background: 'var(--bg-1)',
    }}>
      {ticks}
    </div>
  );
}

function ClipContent({ clip, color, track, w }) {
  // Per-color styling
  const colorMap = {
    'magenta': { bg: 'oklch(0.35 0.12 340)', accent: 'oklch(0.70 0.18 340)' },
    'accent':  { bg: 'oklch(0.38 0.10 75)',  accent: 'var(--accent)' },
    'teal':    { bg: 'oklch(0.32 0.08 200)', accent: 'var(--teal)' },
    'dim':     { bg: 'var(--bg-2)',          accent: 'var(--text-3)' },
    'accent-ghost': { bg: 'transparent', accent: 'var(--accent)' },
    'wave':    { bg: 'oklch(0.28 0.04 200)', accent: 'var(--teal)' },
  };
  const c = colorMap[color] || colorMap.dim;

  if (track.kind === 'audio') {
    // waveform
    const bars = Math.floor(w / 3);
    return (
      <div style={{
        position: 'absolute', inset: 2, borderRadius: 4,
        background: c.bg, overflow: 'hidden',
        display: 'flex', alignItems: 'center',
        padding: '0 6px',
        border: `1px solid ${c.accent}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 1, height: '60%', width: '100%' }}>
          {Array.from({ length: bars }).map((_, i) => {
            const h = 20 + Math.abs(Math.sin(i * 0.4) * Math.cos(i * 0.13) * 80);
            return <div key={i} style={{
              flex: 1, height: `${h}%`, background: c.accent,
              opacity: 0.7, borderRadius: 1,
            }}/>;
          })}
        </div>
      </div>
    );
  }

  if (color === 'accent-ghost') {
    return (
      <div style={{
        position: 'absolute', inset: 2, borderRadius: 4,
        background: 'repeating-linear-gradient(45deg, oklch(0.82 0.14 75 / 0.08) 0 6px, transparent 6px 12px)',
        border: '1px dashed var(--accent-line)',
        padding: '6px 8px',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <Icon.Bolt size={11} stroke="var(--accent)"/>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)',
          letterSpacing: '0.05em', textTransform: 'uppercase',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{clip.name}</span>
      </div>
    );
  }

  // video clip - filmstrip
  const frames = Math.max(1, Math.floor(w / 60));
  return (
    <div style={{
      position: 'absolute', inset: 2, borderRadius: 4,
      background: c.bg, overflow: 'hidden',
      border: `1px solid ${c.accent}`,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* header */}
      <div style={{
        height: 18, padding: '0 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${c.accent}`, background: `${c.bg}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
          <Dot color={c.accent} size={5}/>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--text-1)',
            letterSpacing: '0.03em',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{clip.name}</span>
        </div>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--text-3)',
          flexShrink: 0, marginLeft: 6,
        }}>{clip.dur}s</span>
      </div>
      {/* filmstrip */}
      <div style={{
        flex: 1, display: 'flex', gap: 1, padding: 3,
        background: 'rgba(0,0,0,0.3)',
      }}>
        {Array.from({ length: frames }).map((_, i) => {
          // each frame is a mini gradient tile
          const gradient = color === 'magenta'
            ? `linear-gradient(${135 + i*6}deg, #1a0a2e, #ff2d82 60%, #0ea5ff)`
            : color === 'accent'
            ? `linear-gradient(${135 + i*6}deg, #2a1405, #e89456 60%, #f5d28a)`
            : color === 'teal'
            ? `linear-gradient(${135 + i*6}deg, #061a2e, #1a8fb8 60%, #4ee0b0)`
            : `linear-gradient(${135 + i*6}deg, var(--bg-3), var(--bg-2))`;
          return <div key={i} style={{
            flex: 1, background: gradient, borderRadius: 1,
            opacity: 0.85,
          }}/>;
        })}
      </div>
    </div>
  );
}

function Clip({ clip, track, duration, onMove, selected, onSelect, snapMarkers, playhead }) {
  const [dragging, setDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState(null);
  const [snapFlash, setSnapFlash] = React.useState(null);

  const pxPerSec = 1; // not used; we use %

  const onDown = (e) => {
    e.stopPropagation();
    onSelect(clip.id);
    const el = e.currentTarget.parentElement; // track row
    const rect = el.getBoundingClientRect();
    setDragStart({
      x: e.clientX,
      origStart: clip.start,
      trackWidth: rect.width,
    });
    setDragging(true);
  };

  React.useEffect(() => {
    if (!dragging || !dragStart) return;
    const move = (e) => {
      const deltaSec = ((e.clientX - dragStart.x) / dragStart.trackWidth) * duration;
      let newStart = dragStart.origStart + deltaSec;
      // clamp
      newStart = Math.max(0, Math.min(duration - clip.dur, newStart));
      // magnetic snap
      const candidates = [...snapMarkers, playhead, ...snapMarkers.map(m => m - clip.dur)];
      const snapThreshold = 0.8; // seconds
      let snapped = null;
      for (const cand of candidates) {
        if (Math.abs(newStart - cand) < snapThreshold) {
          newStart = cand; snapped = cand; break;
        }
        if (Math.abs((newStart + clip.dur) - cand) < snapThreshold) {
          newStart = cand - clip.dur; snapped = cand; break;
        }
      }
      if (snapped !== null) setSnapFlash(snapped);
      else setSnapFlash(null);
      onMove(clip.id, newStart);
    };
    const up = () => { setDragging(false); setDragStart(null); setTimeout(() => setSnapFlash(null), 400); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, [dragging, dragStart, clip, duration, snapMarkers, playhead]);

  const leftPct = (clip.start / duration) * 100;
  const widthPct = (clip.dur / duration) * 100;

  return (
    <>
      <div
        onPointerDown={onDown}
        className="no-select"
        style={{
          position: 'absolute',
          left: `${leftPct}%`,
          width: `${widthPct}%`,
          top: 4, bottom: 4,
          cursor: dragging ? 'grabbing' : 'grab',
          zIndex: dragging ? 10 : 1,
          transform: dragging ? 'scale(1.01)' : 'scale(1)',
          filter: dragging ? 'brightness(1.15)' : 'none',
          transition: dragging ? 'none' : 'transform .12s, filter .12s',
          outline: selected ? '1.5px solid var(--accent)' : 'none',
          outlineOffset: 1, borderRadius: 5,
          boxShadow: selected ? '0 0 0 3px oklch(0.82 0.14 75 / 0.15)' : 'none',
        }}
      >
        <ClipContent clip={clip} color={clip.color} track={track} w={widthPct * 12}/>
      </div>
      {snapFlash !== null && dragging && (
        <div style={{
          position: 'absolute',
          left: `${(snapFlash / duration) * 100}%`,
          top: -8, bottom: -8,
          width: 1.5, background: 'var(--accent)',
          boxShadow: '0 0 8px var(--accent), 0 0 20px var(--accent)',
          zIndex: 20, pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', top: -14, left: '50%',
            transform: 'translateX(-50%)',
            padding: '2px 6px', borderRadius: 3,
            background: 'var(--accent)', color: 'var(--bg-0)',
            fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600,
            letterSpacing: '0.05em', whiteSpace: 'nowrap',
          }}>SNAP · {snapFlash.toFixed(1)}s</div>
        </div>
      )}
    </>
  );
}

function TrackHeader({ track, onToggleLock, locked, onToggleMute, muted }) {
  const iconMap = {
    'video': <Icon.Camera size={12}/>,
    'fx':    <Icon.Bolt size={12}/>,
    'audio': <Icon.Waveform size={12}/>,
  };
  return (
    <div style={{
      width: 152, flexShrink: 0,
      padding: '0 12px',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3,
      borderRight: '1px solid var(--line-soft)',
      background: 'var(--bg-1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--text-2)' }}>{iconMap[track.kind]}</span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-1)',
          letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500,
        }}>{track.name}</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={onToggleMute} style={{
          width: 18, height: 16, borderRadius: 3,
          background: muted ? 'var(--red)' : 'var(--bg-2)',
          color: muted ? '#fff' : 'var(--text-3)',
          border: 'none', cursor: 'pointer',
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
        }}>M</button>
        <button style={{
          width: 18, height: 16, borderRadius: 3,
          background: 'var(--bg-2)', color: 'var(--text-3)',
          border: 'none', cursor: 'pointer',
          fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700,
        }}>S</button>
        <button onClick={onToggleLock} style={{
          width: 18, height: 16, borderRadius: 3,
          background: locked ? 'var(--accent-soft)' : 'var(--bg-2)',
          color: locked ? 'var(--accent)' : 'var(--text-3)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}><Icon.Lock size={9}/></button>
      </div>
    </div>
  );
}

function Timeline({ tracks, setTracks, playhead, setPlayhead }) {
  const [selected, setSelected] = React.useState('c1');
  const [magnetOn, setMagnetOn] = React.useState(true);
  const [locks, setLocks] = React.useState({});
  const [mutes, setMutes] = React.useState({ t2: true });
  const lanesRef = React.useRef(null);

  const moveClip = (clipId, newStart) => {
    setTracks(tracks.map(t => ({
      ...t,
      clips: t.clips.map(c => c.id === clipId ? { ...c, start: newStart } : c),
    })));
  };

  const snapMarkers = magnetOn ? window.SNAP_MARKERS : [];

  // Scrub playhead by clicking lanes
  const onLanesDown = (e) => {
    if (e.target.closest('[data-clip]')) return;
    const r = lanesRef.current.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    setPlayhead(t * window.TIMELINE_DURATION);
  };

  return (
    <Panel
      style={{ height: '100%' }}
      bleed
      headerLeft={<>
        <Eyebrow>Timeline</Eyebrow>
        <span style={{ color: 'var(--text-3)' }}>·</span>
        <Eyebrow style={{ color: 'var(--text-2)' }}>4 tracks · 48s</Eyebrow>
      </>}
      headerRight={<>
        <Btn size="sm" tone="ghost" icon={<Icon.Split size={12}/>}>Split</Btn>
        <Btn size="sm" tone={magnetOn ? 'default' : 'ghost'} active={magnetOn} onClick={() => setMagnetOn(!magnetOn)} icon={<Icon.Magnet size={12}/>}>
          Magnetic
        </Btn>
        <Btn size="sm" tone="ghost" icon={<Icon.Plus size={12}/>}>Track</Btn>
      </>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 45px)' }}>
        {/* Ruler row */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line-soft)' }}>
          <div style={{
            width: 152, flexShrink: 0,
            padding: '0 12px',
            display: 'flex', alignItems: 'center',
            borderRight: '1px solid var(--line-soft)',
            background: 'var(--bg-1)',
          }}>
            <Eyebrow>Master</Eyebrow>
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <Ruler duration={window.TIMELINE_DURATION}/>
          </div>
        </div>

        {/* Scroll area for tracks */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            {/* Playhead line across all tracks */}
            <div style={{
              position: 'absolute', left: 152, right: 0, top: 0, bottom: 0,
              pointerEvents: 'none', zIndex: 15,
            }}>
              <div style={{
                position: 'absolute',
                left: `${(playhead / window.TIMELINE_DURATION) * 100}%`,
                top: 0, bottom: 0, width: 1.5,
                background: 'var(--accent)',
                boxShadow: '0 0 6px var(--accent)',
              }}>
                <div style={{
                  position: 'absolute', top: -2, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0, height: 0,
                  borderLeft: '5px solid transparent',
                  borderRight: '5px solid transparent',
                  borderTop: '7px solid var(--accent)',
                }}/>
              </div>
            </div>

            {tracks.map((track, i) => (
              <div key={track.id} style={{
                display: 'flex',
                height: track.kind === 'fx' ? 42 : 56,
                borderBottom: '1px solid var(--line-soft)',
              }}>
                <TrackHeader
                  track={track}
                  locked={locks[track.id]}
                  muted={mutes[track.id]}
                  onToggleLock={() => setLocks({ ...locks, [track.id]: !locks[track.id] })}
                  onToggleMute={() => setMutes({ ...mutes, [track.id]: !mutes[track.id] })}
                />
                <div
                  ref={i === 0 ? lanesRef : null}
                  onPointerDown={i === 0 ? onLanesDown : undefined}
                  style={{
                    flex: 1, position: 'relative',
                    background: mutes[track.id]
                      ? 'repeating-linear-gradient(90deg, var(--bg-1) 0 12px, var(--bg-0) 12px 14px)'
                      : `repeating-linear-gradient(90deg, var(--bg-1) 0 ${100/12}%, transparent ${100/12}% calc(${100/12}% + 1px))`,
                    opacity: mutes[track.id] ? 0.5 : 1,
                    cursor: i === 0 ? 'text' : 'default',
                  }}
                >
                  {/* grid lines */}
                  {Array.from({ length: 13 }).map((_, k) => (
                    <div key={k} style={{
                      position: 'absolute', left: `${(k*4 / window.TIMELINE_DURATION) * 100}%`,
                      top: 0, bottom: 0, width: 1,
                      background: 'var(--line-soft)', opacity: 0.4,
                    }}/>
                  ))}
                  {track.clips.map(clip => (
                    <div key={clip.id} data-clip>
                      <Clip
                        clip={clip}
                        track={track}
                        duration={window.TIMELINE_DURATION}
                        onMove={moveClip}
                        selected={selected === clip.id}
                        onSelect={setSelected}
                        snapMarkers={snapMarkers}
                        playhead={playhead}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

window.Timeline = Timeline;
