// Main app assembling bento grid

function App() {
  const [tweaks, setTweaks] = React.useState(window.TWEAKS);
  const [sceneIdx, setSceneIdx] = React.useState(tweaks.sceneIndex ?? 2);
  const [playing, setPlaying] = React.useState(false);
  const [playhead, setPlayhead] = React.useState(16.5);
  const [tracks, setTracks] = React.useState(window.TRACKS);
  const [activePreset, setActivePreset] = React.useState('p1');
  const [frameInterp, setFrameInterp] = React.useState(2.4);
  const [styleIntensity, setStyleIntensity] = React.useState(72);
  const [motion, setMotion] = React.useState(60);
  const [exposure, setExposure] = React.useState(-0.3);

  React.useEffect(() => {
    if (tweaks.sceneIndex !== undefined) setSceneIdx(tweaks.sceneIndex);
  }, [tweaks.sceneIndex]);

  // apply accent hue live
  React.useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--accent', `oklch(0.82 0.14 ${tweaks.accentHue})`);
    r.style.setProperty('--accent-soft', `oklch(0.82 0.14 ${tweaks.accentHue} / 0.15)`);
    r.style.setProperty('--accent-line', `oklch(0.82 0.14 ${tweaks.accentHue} / 0.5)`);
  }, [tweaks.accentHue]);

  // auto-advance playhead when playing
  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setPlayhead(p => {
        const next = p + 0.1;
        return next > window.TIMELINE_DURATION ? 0 : next;
      });
    }, 100);
    return () => clearInterval(id);
  }, [playing]);

  const scene = window.SCENES[sceneIdx];
  const progress = (playhead / window.TIMELINE_DURATION) * 100;

  const gap = tweaks.density === 'compact' ? 8 : tweaks.density === 'spacious' ? 16 : 12;
  const pad = tweaks.density === 'compact' ? 12 : tweaks.density === 'spacious' ? 20 : 16;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-0)' }}>
      <TopBar scene={scene}/>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar activeScene={sceneIdx} setActiveScene={(i) => { setSceneIdx(i); setTweaks({ ...tweaks, sceneIndex: i }); }}/>

        {/* Main bento grid area */}
        <div style={{
          flex: 1, padding: pad, gap: gap,
          display: 'grid',
          gridTemplateColumns: tweaks.showPresets
            ? 'minmax(0, 1.55fr) minmax(0, 1fr) minmax(0, 0.85fr)'
            : 'minmax(0, 1.7fr) minmax(0, 1fr)',
          gridTemplateRows: 'minmax(0, 1.4fr) minmax(0, 1fr)',
          gridTemplateAreas: tweaks.showPresets
            ? `"preview preview prompt"
               "timeline controls presets"`
            : `"preview prompt"
               "timeline controls"`,
          overflow: 'hidden',
        }}>
          <div style={{ gridArea: 'preview', position: 'relative', ...bentoStyles.panel }}>
            <CinematicPreview
              scene={scene}
              playing={playing}
              onTogglePlay={() => setPlaying(!playing)}
              onPrev={() => setSceneIdx((sceneIdx - 1 + window.SCENES.length) % window.SCENES.length)}
              onNext={() => setSceneIdx((sceneIdx + 1) % window.SCENES.length)}
              progress={progress}
              glowIntensity={tweaks.glowIntensity}
            />
          </div>

          <div style={{ gridArea: 'prompt', minWidth: 0 }}>
            <PromptPanel scene={scene} setScene={setSceneIdx}/>
          </div>

          <div style={{ gridArea: 'timeline', minWidth: 0 }}>
            <Timeline tracks={tracks} setTracks={setTracks} playhead={playhead} setPlayhead={setPlayhead}/>
          </div>

          <div style={{ gridArea: 'controls', minWidth: 0, display: 'flex', flexDirection: 'column', gap: gap }}>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ControlsPanel
                frameInterp={frameInterp} setFrameInterp={setFrameInterp}
                styleIntensity={styleIntensity} setStyleIntensity={setStyleIntensity}
                motion={motion} setMotion={setMotion}
                exposure={exposure} setExposure={setExposure}
              />
            </div>
          </div>

          {tweaks.showPresets && (
            <div style={{ gridArea: 'presets', minWidth: 0, display: 'flex', flexDirection: 'column', gap: gap, overflow: 'hidden' }}>
              <div style={{ flex: '0 0 auto' }}>
                <PresetCards active={activePreset} setActive={setActivePreset}/>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <GenerationsPanel scene={scene}/>
              </div>
            </div>
          )}
        </div>
      </div>
      <StatusBar playing={playing} playhead={playhead} scene={scene}/>
      <Tweaks tweaks={tweaks} setTweaks={setTweaks}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
