// Smart Checkout — multi-step flow with AI-powered address/payment detection
const { useState: useStateC, useEffect: useEffectC } = React;

function SmartCheckout({ cart, onClose, onRemove, onUpdateQty }) {
  const [step, setStep] = useStateC(0);
  const [email, setEmail] = useStateC('');
  const [emailScanned, setEmailScanned] = useStateC(false);
  const [addressMode, setAddressMode] = useStateC('auto');
  const [shipMethod, setShipMethod] = useStateC('standard');
  const [payMethod, setPayMethod] = useStateC('card');
  const [cardNum, setCardNum] = useStateC('');
  const [promo, setPromo] = useStateC('');
  const [promoApplied, setPromoApplied] = useStateC(false);

  const subtotal = cart.reduce((s, item) => s + item.price * item.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 500 ? 0 : shipMethod === 'express' ? 35 : 12;
  const tax = Math.round((subtotal - discount) * 0.08);
  const total = subtotal - discount + shipping + tax;

  useEffectC(() => {
    if (email.includes('@') && email.length > 6 && !emailScanned) {
      const t = setTimeout(() => setEmailScanned(true), 700);
      return () => clearTimeout(t);
    }
  }, [email, emailScanned]);

  const steps = ['Cart', 'Identity', 'Shipping', 'Payment', 'Confirm'];

  if (cart.length === 0 && step === 0) {
    return (
      <CheckoutShell onClose={onClose} step={0} steps={steps}>
        <div style={{ padding: '80px 48px', textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
          <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 24 }}>Empty</div>
          <h2 className="display" style={{ fontSize: 64, marginBottom: 20 }}>No items yet.</h2>
          <p style={{ fontSize: 15, color: '#666', marginBottom: 32 }}>
            Explore the series or ask Atlas to spec a setup for you.
          </p>
          <button className="btn primary" onClick={onClose} style={{ padding: '16px 24px' }}>
            ← Back to catalog
          </button>
        </div>
      </CheckoutShell>
    );
  }

  const goNext = () => setStep(s => Math.min(4, s + 1));
  const goBack = () => setStep(s => Math.max(0, s - 1));

  return (
    <CheckoutShell onClose={onClose} step={step} steps={steps}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 420px',
        flex: 1,
        overflow: 'hidden',
      }}>
        <div style={{ overflowY: 'auto', padding: '48px 64px', borderRight: '1px solid #000' }}>
          {step === 0 && <CartReview cart={cart} onRemove={onRemove} onUpdateQty={onUpdateQty} />}
          {step === 1 && <IdentityStep email={email} setEmail={setEmail} emailScanned={emailScanned} />}
          {step === 2 && <ShippingStep mode={addressMode} setMode={setAddressMode} shipMethod={shipMethod} setShipMethod={setShipMethod} emailScanned={emailScanned} />}
          {step === 3 && <PaymentStep payMethod={payMethod} setPayMethod={setPayMethod} cardNum={cardNum} setCardNum={setCardNum} />}
          {step === 4 && <ConfirmStep total={total} email={email} />}
        </div>

        <OrderSummary
          cart={cart}
          subtotal={subtotal}
          discount={discount}
          shipping={shipping}
          tax={tax}
          total={total}
          step={step}
          goNext={goNext}
          goBack={goBack}
          promo={promo}
          setPromo={setPromo}
          promoApplied={promoApplied}
          applyPromo={() => setPromoApplied(promo.toUpperCase() === 'NEURAL10')}
          onConfirm={() => { alert('Order placed — confirmation sent.'); onClose(); }}
        />
      </div>
    </CheckoutShell>
  );
}

function CheckoutShell({ onClose, step, steps, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#fff', zIndex: 180,
      display: 'flex', flexDirection: 'column',
    }} className="anim-fade">
      <div style={{
        padding: '16px 32px',
        borderBottom: '1px solid #000',
        display: 'grid',
        gridTemplateColumns: '220px 1fr auto',
        alignItems: 'center', gap: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <div style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.04em', fontStretch: 'condensed' }}>
            NEURALSTORE
          </div>
          <div className="mono caps" style={{ fontSize: 10, color: '#666' }}>— Smart Checkout</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: i === step ? 1 : i < step ? 0.7 : 0.3,
              }}>
                <div style={{
                  width: 22, height: 22,
                  border: '1px solid #000',
                  background: i <= step ? '#000' : '#fff',
                  color: i <= step ? '#fff' : '#000',
                  fontFamily: 'var(--mono)', fontSize: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600,
                }}>
                  {i < step ? '✓' : String(i + 1).padStart(2, '0')}
                </div>
                <div className="mono caps" style={{ fontSize: 11, fontWeight: i === step ? 700 : 400 }}>{s}</div>
              </div>
              {i < steps.length - 1 && <div style={{ width: 32, height: 1, background: '#000', margin: '0 12px', opacity: 0.3 }} />}
            </React.Fragment>
          ))}
        </div>

        <button className="btn" onClick={onClose} style={{ padding: '8px 14px' }}>✕ Close</button>
      </div>

      {children}
    </div>
  );
}

function CartReview({ cart, onRemove, onUpdateQty }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>§ 01 / Review</div>
      <h2 className="display" style={{ fontSize: 72, marginBottom: 48 }}>Your cart.</h2>
      <div style={{ borderTop: '1px solid #000' }}>
        {cart.map((item) => (
          <div key={item.id} style={{
            display: 'grid',
            gridTemplateColumns: '100px 1fr auto auto',
            gap: 24, padding: '24px 0',
            borderBottom: '1px solid #e0e0e0', alignItems: 'center',
          }}>
            <div style={{ aspectRatio: '1/1', border: '1px solid #000' }}>
              <ProductPreviewPlaceholder product={item} />
            </div>
            <div>
              <div className="mono caps" style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>{item.sku}</div>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>{item.name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#666', marginTop: 4 }}>{item.tagline}</div>
              <button onClick={() => onRemove(item.id)} style={{
                fontFamily: 'var(--mono)', fontSize: 10, color: '#666',
                textTransform: 'uppercase', letterSpacing: '0.08em',
                marginTop: 10, padding: 0, textDecoration: 'underline',
              }}>Remove</button>
            </div>
            <div style={{ display: 'flex', border: '1px solid #000' }}>
              <button onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))} style={{ padding: '6px 12px', fontFamily: 'var(--mono)' }}>−</button>
              <div style={{ padding: '6px 14px', borderLeft: '1px solid #000', borderRight: '1px solid #000', fontFamily: 'var(--mono)', fontSize: 13 }}>
                {String(item.qty).padStart(2, '0')}
              </div>
              <button onClick={() => onUpdateQty(item.id, item.qty + 1)} style={{ padding: '6px 12px', fontFamily: 'var(--mono)' }}>+</button>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, minWidth: 100, textAlign: 'right' }}>
              ${(item.price * item.qty).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IdentityStep({ email, setEmail, emailScanned }) {
  return (
    <div style={{ maxWidth: 560 }}>
      <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>§ 02 / Identity</div>
      <h2 className="display" style={{ fontSize: 72, marginBottom: 20 }}>Who to ship to.</h2>
      <p style={{ fontSize: 15, color: '#666', marginBottom: 40, maxWidth: 480 }}>
        Enter your email. We'll pull your saved addresses and payment methods if you've shopped before.
      </p>

      <div style={{ marginBottom: 24 }}>
        <label className="mono caps" style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 8 }}>
          Email
        </label>
        <input
          className="field-box"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@domain.com"
          autoFocus
          style={{ fontSize: 16 }}
        />
      </div>

      {emailScanned && (
        <div className="anim-slide-up" style={{
          border: '1px solid #000', background: '#fafafa',
          padding: '20px 24px', marginTop: 24,
          display: 'flex', gap: 20, alignItems: 'flex-start',
        }}>
          <div style={{
            width: 28, height: 28, background: '#000', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 2,
          }}>
            <span className="live-dot" style={{ background: 'var(--live)' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="mono caps" style={{ fontSize: 10, color: '#666', marginBottom: 6 }}>Atlas — Identity match</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Welcome back.</div>
            <div style={{ fontSize: 13, color: '#444', marginBottom: 12 }}>
              I found 1 saved shipping address and a payment method on file. Continue with those, or override at any step.
            </div>
            <div style={{ display: 'flex', gap: 12, fontFamily: 'var(--mono)', fontSize: 11, color: '#000' }}>
              <span style={{ borderLeft: '2px solid var(--live)', paddingLeft: 8 }}>41 Zürich CH</span>
              <span style={{ borderLeft: '2px solid var(--live)', paddingLeft: 8 }}>•••• 4219</span>
              <span style={{ borderLeft: '2px solid var(--live)', paddingLeft: 8 }}>Verified</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 40, display: 'flex', gap: 14, alignItems: 'center', paddingTop: 24, borderTop: '1px solid #e0e0e0' }}>
        <div className="swiss-check checked" />
        <span style={{ fontSize: 13 }}>Remember me — express checkout on next visit</span>
      </div>
    </div>
  );
}

function ShippingStep({ mode, setMode, shipMethod, setShipMethod, emailScanned }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>§ 03 / Shipping</div>
      <h2 className="display" style={{ fontSize: 72, marginBottom: 40 }}>Where & how.</h2>

      {emailScanned && mode === 'auto' && (
        <div style={{ border: '1px solid #000', marginBottom: 32 }}>
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid #000',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: '#000', color: '#fff',
          }}>
            <div className="mono caps" style={{ fontSize: 10, letterSpacing: '0.08em' }}>
              <span className="live-dot" style={{ background: 'var(--live)' }}/> Saved address — verified
            </div>
            <button onClick={() => setMode('manual')} className="mono caps" style={{ fontSize: 10, color: '#fff', letterSpacing: '0.08em', textDecoration: 'underline' }}>
              Change
            </button>
          </div>
          <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <div className="mono caps" style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>Recipient</div>
              <div style={{ fontWeight: 600 }}>A. Müller</div>
            </div>
            <div>
              <div className="mono caps" style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>Address</div>
              <div>Bahnhofstrasse 41</div>
              <div>8001 Zürich, CH</div>
            </div>
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Field label="First name" />
            <Field label="Last name" />
          </div>
          <Field label="Street address" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
            <Field label="City" />
            <Field label="Postal code" />
            <Field label="Country" />
          </div>
        </div>
      )}

      <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 16 }}>Method</div>
      <div style={{ border: '1px solid #000' }}>
        {[
          ['standard', 'Standard', '2–4 business days', 12, 'DHL Ground'],
          ['express', 'Express', 'Next business day', 35, 'DHL Overnight'],
          ['pickup', 'Atelier Pickup', 'Ready tomorrow · Zürich', 0, 'Bahnhofstrasse 41'],
        ].map(([id, name, eta, price, carrier], i, arr) => (
          <label key={id} style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: 20,
            padding: '20px 24px',
            borderBottom: i < arr.length - 1 ? '1px solid #000' : 'none',
            cursor: 'pointer',
            background: shipMethod === id ? '#fafafa' : '#fff',
          }}>
            <div style={{
              width: 18, height: 18, border: '1px solid #000', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
            }}>
              {shipMethod === id && <div style={{ width: 10, height: 10, background: '#000', borderRadius: '50%' }} />}
            </div>
            <input type="radio" checked={shipMethod === id} onChange={() => setShipMethod(id)} style={{ display: 'none' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{name}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#666', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {eta} · {carrier}
              </div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {price === 0 ? 'Free' : `$${price}`}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function Field({ label, placeholder }) {
  return (
    <div>
      <label className="mono caps" style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 8 }}>
        {label}
      </label>
      <input className="field-box" placeholder={placeholder || ''} />
    </div>
  );
}

function PaymentStep({ payMethod, setPayMethod, cardNum, setCardNum }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>§ 04 / Payment</div>
      <h2 className="display" style={{ fontSize: 72, marginBottom: 40 }}>How to pay.</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid #000', marginBottom: 32 }}>
        {[
          ['card', 'Card'],
          ['apple', 'Apple Pay'],
          ['google', 'Google Pay'],
          ['invoice', 'Invoice'],
        ].map(([id, name], i, arr) => (
          <button
            key={id}
            onClick={() => setPayMethod(id)}
            style={{
              padding: '16px 12px',
              borderRight: i < arr.length - 1 ? '1px solid #000' : 'none',
              background: payMethod === id ? '#000' : '#fff',
              color: payMethod === id ? '#fff' : '#000',
              fontFamily: 'var(--mono)', fontSize: 12,
              textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
            }}
          >
            {name}
          </button>
        ))}
      </div>

      {payMethod === 'card' && (
        <div>
          <Field label="Cardholder name" placeholder="A. Müller" />
          <div style={{ marginTop: 16 }}>
            <label className="mono caps" style={{ fontSize: 11, color: '#666', display: 'block', marginBottom: 8 }}>
              Card number
            </label>
            <input
              className="field-box"
              value={cardNum}
              onChange={(e) => setCardNum(e.target.value)}
              placeholder="0000 0000 0000 0000"
              style={{ fontFamily: 'var(--mono)', letterSpacing: '0.1em' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
            <Field label="Expires" placeholder="MM/YY" />
            <Field label="CVC" placeholder="•••" />
            <Field label="ZIP" />
          </div>

          <div style={{
            marginTop: 32, padding: '16px 20px',
            border: '1px solid #000', background: '#fafafa',
            display: 'flex', gap: 16, alignItems: 'center',
          }}>
            <span className="live-dot pulse" />
            <div style={{ flex: 1 }}>
              <div className="mono caps" style={{ fontSize: 10, color: '#666' }}>Atlas — Fraud check</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>Transaction scored <b>low risk</b>. No 3DS challenge required.</div>
            </div>
          </div>
        </div>
      )}

      {payMethod === 'apple' && (
        <div style={{ padding: '40px', border: '1px solid #000', textAlign: 'center', background: '#fafafa' }}>
          <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 16 }}>Express</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Pay with Apple Pay</div>
          <button className="btn primary" style={{ padding: '16px 32px' }}>Confirm via Touch ID →</button>
        </div>
      )}
      {payMethod === 'google' && (
        <div style={{ padding: '40px', border: '1px solid #000', textAlign: 'center', background: '#fafafa' }}>
          <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 16 }}>Express</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Pay with Google Pay</div>
          <button className="btn primary" style={{ padding: '16px 32px' }}>Confirm →</button>
        </div>
      )}
      {payMethod === 'invoice' && (
        <div style={{ padding: '32px', border: '1px solid #000', background: '#fafafa' }}>
          <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>Business · Net 30</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Invoice payment</div>
          <p style={{ fontSize: 13, color: '#444' }}>We'll email your VAT invoice on dispatch. Payment due within 30 days.</p>
        </div>
      )}
    </div>
  );
}

function ConfirmStep({ total, email }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>§ 05 / Confirm</div>
      <h2 className="display" style={{ fontSize: 72, marginBottom: 24 }}>Ready to ship.</h2>
      <p style={{ fontSize: 15, color: '#444', marginBottom: 40, maxWidth: 480 }}>
        Everything checks out. Review the summary and place your order — confirmation goes to <b>{email || 'you@domain.com'}</b>.
      </p>

      <div style={{ border: '1px solid #000' }}>
        {[
          ['Identity', email || 'a.mueller@studio.ch'],
          ['Ship to', 'Bahnhofstrasse 41, 8001 Zürich, CH'],
          ['Method', 'Standard · 2–4 days · DHL Ground'],
          ['Payment', '•••• 4219 · Verified'],
        ].map(([k, v], i, arr) => (
          <div key={k} style={{
            display: 'grid', gridTemplateColumns: '160px 1fr',
            padding: '16px 20px',
            borderBottom: i < arr.length - 1 ? '1px solid #e0e0e0' : 'none',
            fontSize: 14, gap: 20,
          }}>
            <div className="mono caps" style={{ fontSize: 11, color: '#666' }}>{k}</div>
            <div>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrderSummary({ cart, subtotal, discount, shipping, tax, total, step, goNext, goBack, promo, setPromo, promoApplied, applyPromo, onConfirm }) {
  return (
    <aside style={{
      background: '#fafafa',
      padding: '32px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    }}>
      <div className="mono caps" style={{ fontSize: 11, color: '#666', marginBottom: 16 }}>Order summary</div>

      <div style={{ flex: 1 }}>
        {cart.map(item => (
          <div key={item.id} style={{
            display: 'grid', gridTemplateColumns: '40px 1fr auto',
            gap: 12, padding: '10px 0',
            borderBottom: '1px solid #e0e0e0',
            fontSize: 13,
          }}>
            <div style={{ aspectRatio: '1/1', border: '1px solid #000' }}>
              <ProductPreviewPlaceholder product={item} />
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div className="mono" style={{ fontSize: 10, color: '#666' }}>× {item.qty}</div>
            </div>
            <div style={{ fontWeight: 600 }}>${(item.price * item.qty).toLocaleString()}</div>
          </div>
        ))}

        <div style={{ margin: '20px 0', display: 'flex', gap: 0, border: '1px solid #000' }}>
          <input
            value={promo}
            onChange={e => setPromo(e.target.value)}
            placeholder="Promo code"
            style={{ flex: 1, padding: '10px 12px', fontSize: 12 }}
          />
          <button onClick={applyPromo} className="mono caps" style={{
            padding: '10px 14px', borderLeft: '1px solid #000',
            background: '#fff', fontSize: 10, letterSpacing: '0.08em',
          }}>Apply</button>
        </div>
        {promoApplied && (
          <div className="mono caps" style={{ fontSize: 10, color: 'var(--live)', marginBottom: 12 }}>
            ✓ NEURAL10 applied — 10% off
          </div>
        )}

        <div style={{ paddingTop: 16, borderTop: '1px solid #000' }}>
          <SumLine label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
          {discount > 0 && <SumLine label="Discount" value={`−$${discount.toLocaleString()}`} live />}
          <SumLine label="Shipping" value={shipping === 0 ? 'Free' : `$${shipping}`} />
          <SumLine label="Tax (8%)" value={`$${tax.toLocaleString()}`} />
        </div>

        <div style={{
          marginTop: 16, paddingTop: 16, borderTop: '1px solid #000',
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        }}>
          <span className="mono caps" style={{ fontSize: 12, fontWeight: 700 }}>Total</span>
          <span className="display" style={{ fontSize: 36 }}>${total.toLocaleString()}</span>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {step < 4 ? (
          <button className="btn primary" onClick={goNext} style={{ width: '100%', padding: '18px' }}>
            Continue → <span className="mono" style={{ fontWeight: 400, marginLeft: 8 }}>
              {['Identity', 'Shipping', 'Payment', 'Confirm'][step]}
            </span>
          </button>
        ) : (
          <button className="btn primary" onClick={onConfirm} style={{ width: '100%', padding: '20px', background: 'var(--live)', borderColor: 'var(--live)' }}>
            ✓ Place order — ${total.toLocaleString()}
          </button>
        )}
        {step > 0 && (
          <button className="btn" onClick={goBack} style={{ width: '100%', padding: '12px' }}>
            ← Back
          </button>
        )}
      </div>

      <div style={{
        marginTop: 24, paddingTop: 16, borderTop: '1px solid #e0e0e0',
        fontFamily: 'var(--mono)', fontSize: 10, color: '#666',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <div>⎯ Secure · SSL 256-bit</div>
        <div>⎯ 30-day returns · no questions</div>
        <div>⎯ 5-year warranty included</div>
      </div>
    </aside>
  );
}

function SumLine({ label, value, live }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
      <span style={{ color: '#666' }}>{label}</span>
      <span style={{ color: live ? 'var(--live)' : '#000', fontWeight: 600 }}>{value}</span>
    </div>
  );
}

Object.assign(window, { SmartCheckout });
