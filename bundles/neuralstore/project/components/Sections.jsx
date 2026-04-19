// Supporting sections — editorial band, manifesto strip, and footer
function Editorial() {
  return (
    <section style={{ borderBottom: '1px solid #000', padding: '80px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24 }}>
        <div style={{ gridColumn: 'span 3' }}>
          <div className="mono caps" style={{ fontSize: 11, color: '#666' }}>§ 03 — Manifesto</div>
        </div>
        <div style={{ gridColumn: 'span 9' }}>
          <h2 className="display" style={{ fontSize: 88, marginBottom: 32, letterSpacing: '-0.05em' }}>
            Tolerance is the new luxury.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, marginTop: 40 }}>
            {[
              ['±0.02 mm', 'Machined to instrument-grade tolerances. Every part is individually measured — not sampled.'],
              ['5-yr warranty', 'Every product covered end-to-end. Repair or replacement. No extended-plan upsell.'],
              ['100% serviceable', 'Each piece opens with standard hex keys. Parts listed publicly. No glued assemblies.'],
            ].map(([t, body]) => (
              <div key={t} style={{ paddingTop: 16, borderTop: '1px solid #000' }}>
                <div className="display" style={{ fontSize: 36, marginBottom: 12 }}>{t}</div>
                <p style={{ fontSize: 14, lineHeight: 1.5, color: '#333' }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: '#000', color: '#fff', padding: '56px 32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 24, marginBottom: 56 }}>
        <div style={{ gridColumn: 'span 5' }}>
          <div className="display" style={{ fontSize: 64, letterSpacing: '-0.04em', marginBottom: 16 }}>
            NEURALSTORE
          </div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em', maxWidth: 320 }}>
            Instruments for considered work.<br />
            San Francisco · Kyoto · Zürich
          </div>
        </div>
        {[
          ['Shop', ['Displays', 'Input', 'Audio', 'Accessories', 'Gift cards']],
          ['Support', ['Contact', 'Returns', 'Warranty', 'Repairs', 'Manuals']],
          ['Company', ['About', 'Press', 'Careers', 'Journal', 'Retailers']],
        ].map(([title, links]) => (
          <div key={title} style={{ gridColumn: 'span 2' }}>
            <div className="mono caps" style={{ fontSize: 11, opacity: 0.5, marginBottom: 16 }}>§ {title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {links.map(l => (
                <a key={l} href="#" style={{ fontSize: 13, opacity: 0.85 }}>{l}</a>
              ))}
            </div>
          </div>
        ))}
        <div style={{ gridColumn: 'span 1' }} />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 10, opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        <span>© 2026 NeuralStore Industries</span>
        <span>Vol. 04 · Spring · Edition 001</span>
        <span>ISO 9001 · Carbon-neutral shipping</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Editorial, Footer });
