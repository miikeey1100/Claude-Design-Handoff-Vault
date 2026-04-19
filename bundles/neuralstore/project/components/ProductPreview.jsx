// Product preview — striped placeholder with typographic mark of the product
// This is NOT a hand-drawn illustration; it's a monospace placeholder card
// per the design system: imagery goes here in production.

function ProductPreviewPlaceholder({ product, size = 'default', dark = false, rotation = 0 }) {
  const sku = product?.sku || '—';
  const name = product?.name || '—';
  const cat = product?.category || '—';

  const bg = dark ? '#0a0a0a' : '#fff';
  const fg = dark ? '#fff' : '#000';
  const muted = dark ? 'rgba(255,255,255,0.5)' : '#666';
  const stripe = dark ? 'placeholder-stripe-dark' : 'placeholder-stripe';

  return (
    <div
      className={stripe}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: bg,
        color: fg,
        overflow: 'hidden',
      }}
    >
      {/* Crosshair center */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${rotation * 0.1}deg)`,
        transition: 'transform 0.15s linear',
      }}>
        <div style={{
          width: '60%',
          aspectRatio: product?.category === 'Display' ? '16/10' :
                       product?.category === 'Audio' ? '1/1' :
                       product?.category === 'Input' && product?.id === 'nx-03' ? '16/6' :
                       '4/3',
          border: `1px solid ${fg}`,
          background: dark ? '#111' : '#fafafa',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--mono)',
            fontSize: size === 'large' ? 11 : 9,
            color: muted,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            [ product render ]
          </div>
          {/* corner crosshairs */}
          {['tl','tr','bl','br'].map(pos => (
            <span key={pos} style={{
              position: 'absolute',
              width: 8, height: 8,
              borderTop: pos.startsWith('t') ? `1px solid ${fg}` : 'none',
              borderBottom: pos.startsWith('b') ? `1px solid ${fg}` : 'none',
              borderLeft: pos.endsWith('l') ? `1px solid ${fg}` : 'none',
              borderRight: pos.endsWith('r') ? `1px solid ${fg}` : 'none',
              top: pos.startsWith('t') ? -4 : 'auto',
              bottom: pos.startsWith('b') ? -4 : 'auto',
              left: pos.endsWith('l') ? -4 : 'auto',
              right: pos.endsWith('r') ? -4 : 'auto',
            }}/>
          ))}
        </div>
      </div>

      {/* SKU mark top-left */}
      <div style={{
        position: 'absolute',
        top: 12, left: 12,
        fontFamily: 'var(--mono)',
        fontSize: 10,
        color: muted,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {sku}
      </div>

      {/* Category bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: 12, right: 12,
        fontFamily: 'var(--mono)',
        fontSize: 10,
        color: muted,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>
        {cat}
      </div>
    </div>
  );
}

Object.assign(window, { ProductPreviewPlaceholder });
