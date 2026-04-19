// Tweaks panel

function Tweaks({ tweaks, setTweaks }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setVisible(true);
      else if (e.data?.type === '__deactivate_edit_mode') setVisible(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const update = (patch) => {
    setTweaks({ ...tweaks, ...patch });
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 40, right: 20, zIndex: 100,
      width: 280,
      background: 'var(--bg-1)', border: '1px solid var(--line)',
      borderRadius: 12, padding: 14,
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      fontFamily: 'var(--sans)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ ...bentoStyles.editorial, fontSize: 18 }}>Tweaks</span>
        <Eyebrow>Design only</Eyebrow>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <Eyebrow style={{ display: 'block', marginBottom: 6 }}>Accent Hue · {tweaks.accentHue}°</Eyebrow>
          <input type="range" min="0" max="360" value={tweaks.accentHue}
            onChange={(e) => update({ accentHue: +e.target.value })}
            style={{ width: '100%' }}/>
        </div>

        <div>
          <Eyebrow style={{ display: 'block', marginBottom: 6 }}>Glow Intensity · {tweaks.glowIntensity.toFixed(2)}</Eyebrow>
          <input type="range" min="0" max="1.5" step="0.05" value={tweaks.glowIntensity}
            onChange={(e) => update({ glowIntensity: +e.target.value })}
            style={{ width: '100%' }}/>
        </div>

        <div>
          <Eyebrow style={{ display: 'block', marginBottom: 6 }}>Density</Eyebrow>
          <div style={{ display: 'flex', gap: 6 }}>
            {['compact', 'comfortable', 'spacious'].map(d => (
              <Btn key={d} size="sm" tone={tweaks.density === d ? 'default' : 'ghost'}
                active={tweaks.density === d}
                onClick={() => update({ density: d })}>
                {d}
              </Btn>
            ))}
          </div>
        </div>

        <div>
          <Eyebrow style={{ display: 'block', marginBottom: 6 }}>Active Scene</Eyebrow>
          <div style={{ display: 'flex', gap: 4 }}>
            {window.SCENES.map((s, i) => (
              <button key={s.id} onClick={() => update({ sceneIndex: i })}
                style={{
                  width: 46, height: 28, padding: 0, borderRadius: 6,
                  background: `linear-gradient(135deg, ${s.colors[0]}, ${s.colors[1]})`,
                  border: tweaks.sceneIndex === i ? '1.5px solid var(--accent)' : '1px solid var(--line)',
                  cursor: 'pointer',
                }}/>
            ))}
          </div>
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input type="checkbox" checked={tweaks.showPresets}
            onChange={(e) => update({ showPresets: e.target.checked })}/>
          <span style={{ fontSize: 12, color: 'var(--text-1)' }}>Show Style Presets panel</span>
        </label>
      </div>
    </div>
  );
}

window.Tweaks = Tweaks;
