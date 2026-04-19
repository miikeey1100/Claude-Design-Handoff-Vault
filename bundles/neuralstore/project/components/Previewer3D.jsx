// 3D Product Previewer — drag-to-rotate stage with spec overlays
// The product itself is represented by a stylized CSS 3D render using primitives;
// this is a precise technical preview — not a hand-drawn illustration.
const { useState, useRef, useEffect } = React;

function Previewer3D({ product, onClose, onAddToCart }) {
  const [rotX, setRotX] = useState(-8);
  const [rotY, setRotY] = useState(28);
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeColorway, setActiveColorway] = useState(0);
  const [viewMode, setViewMode] = useState('render'); // render | wireframe | exploded
  const stageRef = useRef(null);
  const dragRef = useRef(null);

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate) return;
    let raf;
    const tick = () => {
      setRotY(r => r + 0.2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoRotate]);

  const handleMouseDown = (e) => {
    setAutoRotate(false);
    dragRef.current = { x: e.clientX, y: e.clientY, rx: rotX, ry: rotY };
  };
  const handleMouseMove = (e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setRotY(dragRef.current.ry + dx * 0.5);
    setRotX(Math.max(-80, Math.min(80, dragRef.current.rx - dy * 0.5)));
  };
  const handleMouseUp = () => { dragRef.current = null; };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!product) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(255,255,255,0.98)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
    }} className="anim-fade">
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        padding: '16px 32px',
        borderBottom: '1px solid #000',
        gap: 24,
        background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span className="mono caps" style={{ fontSize: 11, color: '#666' }}>
            3D Previewer — {product.sku}
          </span>
          <span className="live-dot pulse" />
        </div>
        <div className="mono caps" style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>
          Drag to rotate · Scroll to zoom · {Math.round(rotY)}° × {Math.round(rotX)}°
        </div>
        <button
          className="btn"
          onClick={onClose}
          style={{ padding: '8px 14px' }}
        >
          Close ✕
        </button>
      </div>

      {/* Body: 3D stage + side panel */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        overflow: 'hidden',
      }}>
        {/* Stage */}
        <div
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onWheel={(e) => {
            e.preventDefault();
            setZoom(z => Math.max(0.5, Math.min(2, z - e.deltaY * 0.001)));
          }}
          style={{
            position: 'relative',
            borderRight: '1px solid #000',
            background: '#fafafa',
            cursor: dragRef.current ? 'grabbing' : 'grab',
            overflow: 'hidden',
            userSelect: 'none',
          }}
        >
          {/* Grid lines */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />

          {/* Axis indicators */}
          <div style={{
            position: 'absolute',
            bottom: 24, left: 24,
            fontFamily: 'var(--mono)',
            fontSize: 10,
            color: '#666',
            lineHeight: 1.6,
          }}>
            <div>X — {rotX.toFixed(1)}°</div>
            <div>Y — {rotY.toFixed(1)}°</div>
            <div>Z — 0.0°</div>
            <div style={{ marginTop: 8 }}>ZOOM {zoom.toFixed(2)}×</div>
          </div>

          {/* Measurement annotations */}
          <MeasurementAnnotation product={product} />

          {/* Stage center - 3D rotating object */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1400px',
          }}>
            <div style={{
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${zoom})`,
              transformStyle: 'preserve-3d',
              transition: dragRef.current ? 'none' : 'transform 0.1s linear',
            }}>
              <Product3DModel product={product} viewMode={viewMode} colorway={activeColorway} />
            </div>
          </div>

          {/* Bottom toolbar */}
          <div style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            border: '1px solid #000',
            background: '#fff',
          }}>
            {[
              ['render', 'Render'],
              ['wireframe', 'Wireframe'],
              ['exploded', 'Exploded'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                style={{
                  padding: '10px 18px',
                  fontSize: 11,
                  fontFamily: 'var(--mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: viewMode === key ? '#000' : '#fff',
                  color: viewMode === key ? '#fff' : '#000',
                  borderRight: key !== 'exploded' ? '1px solid #000' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div style={{
            position: 'absolute',
            top: 24, right: 24,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #000',
            background: '#fff',
          }}>
            <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} style={miniBtnStyle}>+</button>
            <button onClick={() => { setRotX(-8); setRotY(28); setZoom(1); }} style={{...miniBtnStyle, borderTop: '1px solid #000', borderBottom: '1px solid #000', fontSize: 9}}>⊙</button>
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} style={miniBtnStyle}>−</button>
          </div>

          {/* Auto-rotate toggle */}
          <button
            onClick={() => setAutoRotate(a => !a)}
            style={{
              position: 'absolute',
              top: 24, left: 24,
              border: '1px solid #000',
              background: autoRotate ? '#000' : '#fff',
              color: autoRotate ? '#fff' : '#000',
              padding: '8px 12px',
              fontSize: 11,
              fontFamily: 'var(--mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {autoRotate ? '■ stop rotation' : '▶ auto rotate'}
          </button>
        </div>

        {/* Side panel */}
        <div style={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '32px', borderBottom: '1px solid #000' }}>
            <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>
              {product.category} / {product.sku}
            </div>
            <h2 className="display" style={{ fontSize: 56, marginBottom: 8 }}>
              {product.name}.
            </h2>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#666' }}>
              {product.tagline}
            </div>
          </div>

          {/* Spec table */}
          <div style={{ padding: '0 32px' }}>
            <div className="mono caps" style={{ fontSize: 11, color: '#666', padding: '24px 0 12px', borderBottom: '1px solid #000' }}>
              Specifications
            </div>
            {Object.entries(product.specs).map(([k, v], i, arr) => (
              <div key={k} style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr',
                padding: '14px 0',
                borderBottom: i === arr.length - 1 ? 'none' : '1px solid #e0e0e0',
                fontSize: 13,
                gap: 16,
              }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {k}
                </div>
                <div>{v}</div>
              </div>
            ))}
          </div>

          {/* Colorways */}
          <div style={{ padding: '32px', borderTop: '1px solid #000' }}>
            <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 16 }}>
              Finish / {String(activeColorway + 1).padStart(2, '0')} of {String(product.colorways.length).padStart(2, '0')}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {product.colorways.map((c, i) => (
                <button
                  key={c}
                  onClick={() => setActiveColorway(i)}
                  style={{
                    flex: 1,
                    border: activeColorway === i ? '2px solid #000' : '1px solid #000',
                    padding: activeColorway === i ? '10px 8px' : '11px 9px',
                    background: '#fff',
                    fontSize: 12,
                    fontWeight: activeColorway === i ? 600 : 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{
                    width: 24, height: 24,
                    background: c === 'Graphite' ? '#2a2a2a' : c === 'Chalk' ? '#f0ede4' : 'var(--live)',
                    border: '1px solid #000',
                  }} />
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Price + cart */}
          <div style={{ padding: '32px', borderTop: '1px solid #000', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
              <span className="mono caps" style={{ fontSize: 11, color: '#666' }}>Total</span>
              <span className="display" style={{ fontSize: 48 }}>
                ${product.price.toLocaleString()}
              </span>
            </div>
            <button
              className="btn primary"
              onClick={() => { onAddToCart(product); onClose(); }}
              style={{ width: '100%', padding: '20px' }}
            >
              Add to cart — proceed to smart checkout →
            </button>
            <div className="mono caps" style={{ fontSize: 10, color: '#666', marginTop: 12, textAlign: 'center' }}>
              Ships in 2–4 days · 30-day return · 5-year warranty
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const miniBtnStyle = {
  padding: '10px',
  width: 40,
  background: '#fff',
  color: '#000',
  fontSize: 14,
  fontFamily: 'var(--mono)',
};

// Stylized 3D model using CSS 3D primitives — categorical, not hand-drawn.
function Product3DModel({ product, viewMode, colorway }) {
  const base = colorway === 0 ? '#1a1a1a' : colorway === 1 ? '#eeeae0' : '#e8432a';
  const side = colorway === 0 ? '#333' : colorway === 1 ? '#d8d3c5' : '#c93a23';
  const top = colorway === 0 ? '#2a2a2a' : colorway === 1 ? '#f5f1e8' : '#f55a3a';
  const wire = viewMode === 'wireframe';
  const exploded = viewMode === 'exploded';
  const stroke = wire ? '#000' : 'transparent';
  const fill = wire ? 'transparent' : base;
  const fillSide = wire ? 'transparent' : side;
  const fillTop = wire ? 'transparent' : top;
  const outline = '1px solid #000';

  // Dimensions per product
  const dims = {
    'nx-01': { w: 480, h: 280, d: 18 }, // monitor
    'nx-02': { w: 100, h: 50, d: 160 }, // mouse
    'nx-03': { w: 360, h: 30, d: 120 }, // keyboard
    'nx-04': { w: 180, h: 100, d: 40 }, // audio case
    'nx-05': { w: 240, h: 60, d: 100 }, // dock
    'nx-06': { w: 160, h: 90, d: 80 },  // camera
  }[product.id] || { w: 200, h: 100, d: 50 };

  const { w, h, d } = dims;
  const xp = exploded ? d/2 + 30 : d/2;
  const xn = exploded ? -(d/2 + 30) : -d/2;
  const yp = exploded ? h/2 + 20 : h/2;
  const yn = exploded ? -(h/2 + 20) : -h/2;

  return (
    <div style={{ position: 'relative', transformStyle: 'preserve-3d' }}>
      {/* Base body — 6 faces */}
      {/* Front */}
      <div style={{
        position: 'absolute',
        width: w, height: h,
        transform: `translate(-50%, -50%) translateZ(${xp}px)`,
        background: fill, border: outline,
        left: 0, top: 0,
      }}>
        {!wire && <ProductFace product={product} face="front" />}
      </div>
      {/* Back */}
      <div style={{
        position: 'absolute',
        width: w, height: h,
        transform: `translate(-50%, -50%) translateZ(${xn}px) rotateY(180deg)`,
        background: fillSide, border: outline,
        left: 0, top: 0,
      }} />
      {/* Top */}
      <div style={{
        position: 'absolute',
        width: w, height: d,
        transform: `translate(-50%, -50%) translateY(${yn}px) rotateX(90deg)`,
        background: fillTop, border: outline,
        left: 0, top: 0,
      }} />
      {/* Bottom */}
      <div style={{
        position: 'absolute',
        width: w, height: d,
        transform: `translate(-50%, -50%) translateY(${yp}px) rotateX(-90deg)`,
        background: fillSide, border: outline,
        left: 0, top: 0,
      }} />
      {/* Left */}
      <div style={{
        position: 'absolute',
        width: d, height: h,
        transform: `translate(-50%, -50%) translateX(${-w/2}px) rotateY(-90deg)`,
        background: fillSide, border: outline,
        left: 0, top: 0,
      }} />
      {/* Right */}
      <div style={{
        position: 'absolute',
        width: d, height: h,
        transform: `translate(-50%, -50%) translateX(${w/2}px) rotateY(90deg)`,
        background: fillSide, border: outline,
        left: 0, top: 0,
      }} />

      {/* Monitor stand */}
      {product.id === 'nx-01' && (
        <>
          <div style={{
            position: 'absolute', width: 80, height: 120,
            transform: `translate(-50%, ${h/2 - 8}px) translateZ(-5px)`,
            background: wire ? 'transparent' : side,
            border: outline,
            left: 0, top: 0,
          }} />
          <div style={{
            position: 'absolute', width: 160, height: 16,
            transform: `translate(-50%, ${h/2 + 112}px) rotateX(90deg)`,
            background: wire ? 'transparent' : side,
            border: outline,
            left: 0, top: 0,
          }} />
        </>
      )}
    </div>
  );
}

function ProductFace({ product, face }) {
  if (product.id === 'nx-01') {
    // monitor screen
    return (
      <div style={{
        position: 'absolute',
        inset: 8,
        border: '1px solid rgba(255,255,255,0.15)',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: 'var(--mono)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.2em',
        }}>
          6144 × 3456
        </div>
      </div>
    );
  }
  if (product.id === 'nx-03') {
    // keyboard keys
    return (
      <div style={{
        position: 'absolute',
        inset: 6,
        display: 'grid',
        gridTemplateColumns: 'repeat(15, 1fr)',
        gridTemplateRows: 'repeat(5, 1fr)',
        gap: 2,
      }}>
        {Array.from({ length: 75 }).map((_, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.1)',
          }} />
        ))}
      </div>
    );
  }
  return null;
}

function MeasurementAnnotation({ product }) {
  return (
    <div style={{
      position: 'absolute',
      top: '50%',
      right: 24,
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      pointerEvents: 'none',
    }}>
      {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
        <div key={k} style={{
          borderLeft: '1px solid #000',
          paddingLeft: 10,
          fontFamily: 'var(--mono)',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          <div style={{ color: '#666' }}>{k}</div>
          <div style={{ color: '#000', fontWeight: 600 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Previewer3D });
