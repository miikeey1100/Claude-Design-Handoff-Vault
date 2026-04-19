// Hero — massive Swiss headline with gridlines and metadata
function Hero({ onExplore }) {
  return (
    <section style={{
      borderBottom: '1px solid #000',
      padding: '64px 32px 56px',
      position: 'relative',
    }}>
      {/* Meta row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 24,
        fontFamily: 'var(--mono)',
        fontSize: 11,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 40,
      }}>
        <div style={{ gridColumn: 'span 3' }}>Vol. 04 / Spring 2026</div>
        <div style={{ gridColumn: 'span 3' }}>Issue — NX Series</div>
        <div style={{ gridColumn: 'span 3' }}>Edition 001 / Open</div>
        <div style={{ gridColumn: 'span 3', textAlign: 'right' }}>
          <span className="live-dot pulse" /> <span style={{ marginLeft: 12 }}>Live</span>
        </div>
      </div>

      {/* Giant headline */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 24,
        alignItems: 'end',
      }}>
        <h1 className="display" style={{
          gridColumn: 'span 9',
          fontSize: 'clamp(80px, 13vw, 220px)',
          marginBottom: -12,
        }}>
          Engineered<br />
          <span style={{ display: 'inline-block', position: 'relative' }}>
            for signal.
            <span style={{
              position: 'absolute',
              top: '0.2em',
              right: '-0.6em',
              fontSize: 12,
              fontFamily: 'var(--mono)',
              fontWeight: 400,
              color: 'var(--live)',
              letterSpacing: 0,
              fontStretch: 'normal',
            }}>
              /01
            </span>
          </span>
        </h1>

        <div style={{ gridColumn: 'span 3', paddingBottom: 24 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#666', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            — Thesis
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.5, marginBottom: 20 }}>
            Six instruments. No noise. Every millimeter is held to a tolerance you can measure.
          </p>
          <button className="btn" onClick={onExplore} style={{ width: '100%' }}>
            Explore the series →
          </button>
        </div>
      </div>

      {/* Measurement bar */}
      <div style={{
        marginTop: 56,
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 0,
        borderTop: '1px solid #000',
        borderBottom: '1px solid #000',
      }}>
        {[
          ['01', 'Neural Monitor', '$2,490'],
          ['02', 'Edge Mouse', '$189'],
          ['03', 'Keyboard 75', '$329'],
          ['04', 'Audio Pods', '$399'],
          ['05', 'Dock Station', '$499'],
          ['06', 'Camera Pro', '$279'],
        ].map(([num, name, price], i, arr) => (
          <div key={num} style={{
            gridColumn: 'span 2',
            padding: '20px 16px',
            borderRight: i < arr.length - 1 ? '1px solid #000' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#666' }}>/{num}</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#000' }}>{price}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Hero });
