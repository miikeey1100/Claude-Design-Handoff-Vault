// Product catalog grid
function ProductGrid({ products, onSelectProduct, onAddToCart }) {
  return (
    <section style={{ borderBottom: '1px solid #000' }}>
      {/* Section header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 24,
        padding: '32px',
        borderBottom: '1px solid #000',
        alignItems: 'end',
      }}>
        <div style={{ gridColumn: 'span 4' }}>
          <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>
            § 02 — Catalog
          </div>
          <h2 className="display" style={{ fontSize: 72 }}>The Series.</h2>
        </div>
        <div style={{ gridColumn: 'span 5' }}>
          <p style={{ fontSize: 15, lineHeight: 1.5, maxWidth: 480 }}>
            Each piece is built from first principles. No model-year refresh cycle. We ship when tolerances are met — and not a week sooner.
          </p>
        </div>
        <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <FilterChip label="All" active />
          <FilterChip label="Input" />
          <FilterChip label="Audio" />
          <FilterChip label="Display" />
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        {products.map((p, i) => (
          <ProductCard
            key={p.id}
            product={p}
            index={i}
            total={products.length}
            onSelect={() => onSelectProduct(p)}
            onAdd={() => onAddToCart(p)}
          />
        ))}
      </div>
    </section>
  );
}

function FilterChip({ label, active }) {
  return (
    <button style={{
      padding: '6px 12px',
      border: '1px solid #000',
      background: active ? '#000' : '#fff',
      color: active ? '#fff' : '#000',
      fontFamily: 'var(--mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    }}>
      {label}
    </button>
  );
}

function ProductCard({ product, index, total, onSelect, onAdd }) {
  const [hover, setHover] = React.useState(false);
  const col = index % 3;
  const row = Math.floor(index / 3);
  const totalRows = Math.ceil(total / 3);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onSelect}
      style={{
        borderRight: col < 2 ? '1px solid #000' : 'none',
        borderBottom: row < totalRows - 1 ? '1px solid #000' : 'none',
        background: hover ? '#fafafa' : '#fff',
        cursor: 'pointer',
        transition: 'background 0.15s',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image */}
      <div style={{ aspectRatio: '4/3', borderBottom: '1px solid #000' }}>
        <ProductPreviewPlaceholder product={product} rotation={hover ? 6 : 0} />
      </div>

      {/* Meta */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div className="mono caps" style={{ fontSize: 10, color: '#666' }}>
            /{String(index + 1).padStart(2, '0')} · {product.category}
          </div>
          <div className="mono" style={{ fontSize: 10, color: '#666' }}>{product.sku}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{product.name}</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#666', marginTop: 4 }}>
              {product.tagline}
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
            ${product.price.toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            className="btn"
            style={{ flex: 1, padding: '12px 16px', fontSize: 11 }}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
          >
            Preview in 3D
          </button>
          <button
            className="btn primary"
            style={{ padding: '12px 16px', fontSize: 11 }}
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProductGrid });
