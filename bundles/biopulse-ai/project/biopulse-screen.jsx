// BioPulse main screen composition

function BioPulseScreen({ backdropMode, goalIntensity, setGoalIntensity, activityLevel, setActivityLevel, accentHue = 18 }) {
  const [bpm, setBpm] = React.useState(72);

  // fake live bpm wobble influenced by intensity
  React.useEffect(() => {
    const id = setInterval(() => {
      const base = 62 + (goalIntensity / 100) * 38 + (activityLevel / 100) * 20;
      setBpm(Math.round(base + (Math.random() - 0.5) * 4));
    }, 900);
    return () => clearInterval(id);
  }, [goalIntensity, activityLevel]);

  const accent = `oklch(0.68 0.22 ${accentHue})`;
  const coolAccent = 'oklch(0.78 0.12 220)';

  // Dynamic AI insight based on sliders
  const insight = React.useMemo(() => {
    if (goalIntensity > 75 && activityLevel < 40) {
      return {
        title: 'Push harder today',
        body: 'Your goal intensity is high but activity is trailing. Try a 20-min brisk walk before 4pm to stay on track.',
        confidence: 94,
        tag: 'Coaching',
      };
    }
    if (activityLevel > 70) {
      return {
        title: 'Recovery window open',
        body: 'HRV trending +12% over baseline. You\'re primed for a Zone 2 session — estimated optimal duration 42 min.',
        confidence: 89,
        tag: 'Readiness',
      };
    }
    if (goalIntensity < 30) {
      return {
        title: 'Restorative day',
        body: 'Cortisol rhythm suggests low-load focus. Prioritize hydration and light mobility over cardio.',
        confidence: 82,
        tag: 'Recovery',
      };
    }
    return {
      title: 'Balanced day ahead',
      body: 'Your metrics align with moderate training. A mid-afternoon breathwork block will sharpen focus.',
      confidence: 91,
      tag: 'Insight',
    };
  }, [goalIntensity, activityLevel]);

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <CinematicBackdrop mode={backdropMode} />

      {/* Scrollable content */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%', overflowY: 'auto', overflowX: 'hidden',
        padding: '62px 16px 110px',
        WebkitOverflowScrolling: 'touch',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, marginTop: 8 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 1.5, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontWeight: 500 }}>
              Sunday · Apr 19
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: -0.8, marginTop: 2, lineHeight: 1.1 }}>
              Good evening,<br/>
              <span style={{ background: `linear-gradient(90deg, #fff 0%, ${accent} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ava
              </span>
            </div>
          </div>
          <Glass intensity="medium" style={{ width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: 'linear-gradient(135deg, oklch(0.7 0.2 330), oklch(0.65 0.2 18))', fontSize: 12, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
          </Glass>
        </div>

        {/* BioPulse hero — live pulse */}
        <Glass intensity="heavy" style={{ padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 1.4, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                {Icon.heart(accent)} Live Heart Rate
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: 54, fontWeight: 700, color: '#fff', letterSpacing: -2, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{bpm}</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>BPM</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 9px', borderRadius: 99,
                background: `${accent.replace(')', ' / 0.15)')}`,
                border: `0.5px solid ${accent.replace(')', ' / 0.4)')}`,
                color: accent, fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, boxShadow: `0 0 6px ${accent}` }} />
                LIVE
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>
                Zone 2 · Fat burn
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                Avg 7d: 68 bpm
              </div>
            </div>
          </div>
          <div style={{ margin: '6px -4px -4px' }}>
            <HeartRateChart bpm={bpm} intensity={goalIntensity} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.3)', fontVariantNumeric: 'tabular-nums', letterSpacing: 0.5, padding: '0 4px' }}>
            <span>−60s</span><span>−45s</span><span>−30s</span><span>−15s</span><span>NOW</span>
          </div>
        </Glass>

        {/* Sleep + Vitals row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 10, marginBottom: 14 }}>
          <Glass intensity="medium" style={{ padding: 18 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.4, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              {Icon.moon(coolAccent)} Sleep
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
              <div style={{ position: 'relative' }}>
                <SleepRing score={87} size={78} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -0.8, lineHeight: 1 }}>87</span>
                  <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5, marginTop: 2 }}>GREAT</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#fff', letterSpacing: -0.4, fontVariantNumeric: 'tabular-nums' }}>7h 42m</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>11:18p → 7:00a</div>
                <div style={{ marginTop: 10 }}>
                  <Hypnogram />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 12, fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: 1.5, background: 'oklch(0.55 0.18 260)' }}/>Deep 1h48</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: 1.5, background: 'oklch(0.75 0.18 330)' }}/>REM 1h32</span>
            </div>
          </Glass>

          <Glass intensity="medium" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <VitalRow icon={Icon.o2('oklch(0.78 0.15 200)')} label="Blood O₂" value="98" unit="%" trend="+0.4" />
            <div style={{ height: 0.5, background: 'rgba(255,255,255,0.08)' }} />
            <VitalRow icon={Icon.breath('oklch(0.8 0.12 160)')} label="HRV" value="64" unit="ms" trend="+12" trendUp />
            <div style={{ height: 0.5, background: 'rgba(255,255,255,0.08)' }} />
            <VitalRow icon={Icon.flame('oklch(0.75 0.18 50)')} label="Calories" value="1,842" unit="kcal" trend="−3%" />
          </Glass>
        </div>

        {/* Goal Intensity + Activity Level sliders */}
        <Glass intensity="heavy" style={{ padding: 20, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 11, letterSpacing: 1.4, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
              {Icon.spark(accent)} Tune Your Day
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.5, textTransform: 'uppercase' }}>
              Adaptive AI
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 18, lineHeight: 1.4 }}>
            BioPulse recalibrates coaching, calorie targets, and recovery windows in real time.
          </div>

          <div style={{ marginBottom: 22 }}>
            <GlassSlider
              label="Goal Intensity"
              value={goalIntensity}
              onChange={setGoalIntensity}
              accent={accent}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 6, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              <span>Restore</span><span>Maintain</span><span>Push</span><span>Peak</span>
            </div>
          </div>

          <div>
            <GlassSlider
              label="Activity Level"
              value={activityLevel}
              onChange={setActivityLevel}
              accent={coolAccent}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 6, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              <span>Rest</span><span>Light</span><span>Moderate</span><span>Intense</span>
            </div>
          </div>

          {/* Live readout */}
          <div style={{
            marginTop: 18, padding: '10px 12px', borderRadius: 14,
            background: 'rgba(0,0,0,0.25)',
            border: '0.5px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 11, color: 'rgba(255,255,255,0.7)',
          }}>
            <span style={{ letterSpacing: 0.3 }}>Target HR</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: accent }}>
              {Math.round(110 + goalIntensity * 0.6)}–{Math.round(130 + goalIntensity * 0.7)} bpm
            </span>
            <span style={{ color: 'rgba(255,255,255,0.25)' }}>·</span>
            <span style={{ letterSpacing: 0.3 }}>Burn</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: coolAccent }}>
              {Math.round(1400 + goalIntensity * 6 + activityLevel * 8)} kcal
            </span>
          </div>
        </Glass>

        {/* AI Insight hero card */}
        <Glass intensity="heavy" style={{ padding: 20, marginBottom: 14, position: 'relative' }}>
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%',
            background: `radial-gradient(circle, ${accent.replace(')', ' / 0.3)')} 0%, transparent 65%)`, pointerEvents: 'none',
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: `linear-gradient(135deg, ${accent}, oklch(0.6 0.2 300))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 14px ${accent.replace(')', ' / 0.5)')}`,
            }}>
              {Icon.ai('#fff')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 500 }}>
                BioPulse AI · {insight.tag}
              </div>
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>
              {insight.confidence}% conf.
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#fff', letterSpacing: -0.6, lineHeight: 1.15, marginBottom: 8, textWrap: 'balance' }}>
            {insight.title}
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, textWrap: 'pretty' }}>
            {insight.body}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button style={{
              flex: 1, padding: '11px 14px', borderRadius: 14, border: 'none',
              background: `linear-gradient(180deg, ${accent} 0%, ${accent.replace('0.68', '0.58')} 100%)`,
              color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: 0.2,
              boxShadow: `0 4px 14px ${accent.replace(')', ' / 0.5)')}, inset 0 1px 0 rgba(255,255,255,0.25)`,
              cursor: 'pointer',
            }}>
              Plan this
            </button>
            <button style={{
              padding: '11px 14px', borderRadius: 14,
              border: '0.5px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 500,
              cursor: 'pointer',
            }}>
              Why?
            </button>
          </div>
        </Glass>

        {/* Secondary AI cards — horizontal scroll */}
        <div style={{
          display: 'flex', gap: 10, margin: '0 -16px 14px', padding: '0 16px',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
        }}>
          <MiniInsightCard
            icon={Icon.breath('oklch(0.8 0.12 160)')}
            tag="Stress"
            title="Cortisol dip at 3pm"
            body="Schedule a 4-min breathwork. Last time it cut stress 38%."
            accent="oklch(0.8 0.12 160)"
          />
          <MiniInsightCard
            icon={Icon.moon(coolAccent)}
            tag="Sleep"
            title="Wind down 10:45p"
            body="Dim lights and drop temp to 66°F for +14min deep sleep."
            accent={coolAccent}
          />
          <MiniInsightCard
            icon={Icon.flame('oklch(0.75 0.18 50)')}
            tag="Fuel"
            title="Protein gap: 32g"
            body="Add a post-workout shake before 6pm to hit repair target."
            accent="oklch(0.75 0.18 50)"
          />
        </div>

        {/* Today's rings */}
        <Glass intensity="medium" style={{ padding: 18, marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.4, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', fontWeight: 500, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
            {Icon.activity('#fff')} Today
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <RingStat label="Steps" value="8,204" goal="10,000" pct={82} color={accent} />
            <RingStat label="Move" value="412" goal="600 kcal" pct={69} color="oklch(0.75 0.18 50)" />
            <RingStat label="Stand" value="9" goal="12 hrs" pct={75} color={coolAccent} />
          </div>
        </Glass>
      </div>

      {/* Floating tab bar */}
      <div style={{
        position: 'absolute', bottom: 28, left: 16, right: 16, zIndex: 10,
      }}>
        <Glass intensity="heavy" style={{ padding: 6, borderRadius: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            {[
              { icon: Icon.heart, label: 'Pulse', active: true },
              { icon: Icon.moon, label: 'Sleep' },
              { icon: Icon.activity, label: 'Train' },
              { icon: Icon.ai, label: 'AI' },
            ].map((t, i) => (
              <div key={i} style={{
                flex: 1, padding: '10px 8px', borderRadius: 26,
                background: t.active ? `${accent.replace(')', ' / 0.18)')}` : 'transparent',
                border: t.active ? `0.5px solid ${accent.replace(')', ' / 0.3)')}` : '0.5px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                cursor: 'pointer',
              }}>
                {t.icon(t.active ? accent : 'rgba(255,255,255,0.6)')}
                {t.active && (
                  <span style={{ fontSize: 12, fontWeight: 600, color: accent, letterSpacing: 0.2 }}>
                    {t.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Glass>
      </div>
    </div>
  );
}

function VitalRow({ icon, label, value, unit, trend, trendUp }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        {icon}
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 500 }}>
          {label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: -0.6, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {value}
          </span>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{unit}</span>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 600, letterSpacing: 0.3,
          color: trendUp ? 'oklch(0.8 0.14 160)' : 'rgba(255,255,255,0.45)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function MiniInsightCard({ icon, tag, title, body, accent }) {
  return (
    <div style={{
      minWidth: 210, flexShrink: 0, scrollSnapAlign: 'start',
      borderRadius: 22, padding: 16,
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      border: '0.5px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 18px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <div style={{
          width: 22, height: 22, borderRadius: 6,
          background: `${accent.replace(')', ' / 0.2)')}`,
          border: `0.5px solid ${accent.replace(')', ' / 0.35)')}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{icon}</div>
        <span style={{ fontSize: 10, color: accent, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
          {tag}
        </span>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: -0.3, marginBottom: 4, textWrap: 'balance' }}>
        {title}
      </div>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.45, textWrap: 'pretty' }}>
        {body}
      </div>
    </div>
  );
}

function RingStat({ label, value, goal, pct, color }) {
  const size = 52, r = 22, c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
            strokeLinecap="round" strokeDasharray={`${dash} ${c}`}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
          {pct}%
        </div>
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginTop: 8, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.3, textTransform: 'uppercase', marginTop: 1 }}>{label}</div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontVariantNumeric: 'tabular-nums', marginTop: 1 }}>/ {goal}</div>
    </div>
  );
}

Object.assign(window, { BioPulseScreen });
