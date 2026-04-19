// Top navigation — Swiss grid with precise hairlines
const { useState } = React;

function TopNav({ cartCount, onCartClick, onAssistantClick, assistantOpen }) {
  return (
    <header style={{ borderBottom: '1px solid #000', background: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
      {/* Utility strip */}
      <div style={{
        borderBottom: '1px solid #e0e0e0',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        padding: '8px 32px',
        fontSize: 11,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontFamily: 'var(--mono)',
        color: '#666',
      }}>
        <div>EN / USD</div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span className="live-dot pulse" /> 
          <span style={{ marginLeft: -10 }}>Shipping live — next cut-off 16:42 UTC</span>
        </div>
        <div style={{ textAlign: 'right' }}>Support · Account · Orders</div>
      </div>

      {/* Primary nav */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '220px 1fr auto',
        alignItems: 'center',
        padding: '18px 32px',
        gap: 32,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{
            fontWeight: 900,
            fontSize: 22,
            letterSpacing: '-0.04em',
            fontStretch: 'condensed',
          }}>
            NEURALSTORE
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#666' }}>®</div>
        </div>

        <nav style={{ display: 'flex', gap: 32, fontSize: 13, fontWeight: 500 }}>
          {['Shop', 'Displays', 'Input', 'Audio', 'Accessories', 'Journal'].map((item, i) => (
            <a key={item} href="#" style={{
              paddingBottom: 4,
              borderBottom: i === 0 ? '1px solid #000' : '1px solid transparent',
            }}>
              {item}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn ghost" style={{ padding: '8px 14px', border: '1px solid #000' }}>
            Search
          </button>
          <button
            className="btn"
            onClick={onAssistantClick}
            style={{
              padding: '8px 14px',
              background: assistantOpen ? '#000' : '#fff',
              color: assistantOpen ? '#fff' : '#000',
              gap: 8,
            }}
          >
            <span className="live-dot" style={{ background: assistantOpen ? 'var(--live)' : '#000' }} />
            Assistant
          </button>
          <button
            className="btn primary"
            onClick={onCartClick}
            style={{ padding: '8px 14px', gap: 8 }}
          >
            Cart <span style={{ fontFamily: 'var(--mono)', fontWeight: 400 }}>[{cartCount.toString().padStart(2, '0')}]</span>
          </button>
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { TopNav });
