// Floating AI Shopping Assistant — draggable, resizable, Swiss-styled
const { useState: useStateA, useRef: useRefA, useEffect: useEffectA } = React;

function Assistant({ open, onClose, onRecommend, products, cart }) {
  const [messages, setMessages] = useStateA([
    { role: 'ai', type: 'greet', text: "I'm Atlas — your NeuralStore specialist. I can match products to your workflow, compare specs, or spec out a full setup.\n\nWhere would you like to start?" },
  ]);
  const [input, setInput] = useStateA('');
  const [typing, setTyping] = useStateA(false);
  const [pos, setPos] = useStateA({ x: 32, y: 120 });
  const [dragging, setDragging] = useStateA(false);
  const dragStart = useRefA(null);
  const scrollRef = useRefA(null);

  useEffectA(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const suggestions = [
    "Build me a video editing setup under $3,500",
    "Compare Edge Mouse vs Keyboard 75",
    "What's the quietest option for an open office?",
    "Show me everything in Chalk finish",
  ];

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      const reply = generateReply(text, products);
      setMessages(m => [...m, reply]);
      setTyping(false);
    }, 900);
  };

  // Drag
  const handleMouseDown = (e) => {
    dragStart.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    setDragging(true);
  };
  useEffectA(() => {
    if (!dragging) return;
    const move = (e) => {
      if (!dragStart.current) return;
      const nx = dragStart.current.px + (e.clientX - dragStart.current.x);
      const ny = dragStart.current.py + (e.clientY - dragStart.current.y);
      setPos({
        x: Math.max(16, Math.min(window.innerWidth - 400, nx)),
        y: Math.max(16, Math.min(window.innerHeight - 200, ny)),
      });
    };
    const up = () => { setDragging(false); dragStart.current = null; };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging]);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      left: pos.x,
      bottom: window.innerHeight - pos.y - 640 > 16 ? 'auto' : 16,
      top: window.innerHeight - pos.y - 640 > 16 ? pos.y : 'auto',
      width: 420,
      height: 640,
      background: '#fff',
      border: '1px solid #000',
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '6px 6px 0 #000',
    }} className="anim-slide-up">
      {/* Header - draggable */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid #000',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: dragging ? 'grabbing' : 'grab',
          background: '#000',
          color: '#fff',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="live-dot pulse" style={{ background: 'var(--live)' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>ATLAS</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Shopping specialist · online
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={onClose} style={{
            color: '#fff',
            fontSize: 14,
            padding: '4px 10px',
            border: '1px solid rgba(255,255,255,0.3)',
            fontFamily: 'var(--mono)',
          }}>✕</button>
        </div>
      </div>

      {/* Context strip */}
      <div style={{
        padding: '10px 18px',
        borderBottom: '1px solid #e0e0e0',
        fontFamily: 'var(--mono)',
        fontSize: 10,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>Session #AT-{Math.floor(Math.random()*9000+1000)}</span>
        <span>Cart — {cart.length} item{cart.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1,
        overflowY: 'auto',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} onRecommend={onRecommend} />
        ))}
        {typing && (
          <div className="chat-bubble ai" style={{ display: 'flex', gap: 4, padding: '14px 16px' }}>
            <Dot delay={0} /><Dot delay={0.2} /><Dot delay={0.4} />
          </div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div style={{
          padding: '0 18px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          <div className="mono caps" style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>
            Suggested prompts
          </div>
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                border: '1px solid #000',
                background: '#fff',
                fontSize: 12,
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              → {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        borderTop: '1px solid #000',
        padding: '12px 14px',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder="Ask Atlas anything..."
          style={{
            flex: 1,
            border: '1px solid #000',
            padding: '10px 12px',
            fontSize: 13,
          }}
        />
        <button
          onClick={() => send(input)}
          className="btn primary"
          style={{ padding: '10px 14px' }}
        >
          Send →
        </button>
      </div>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <div style={{
      width: 6, height: 6, background: '#000', borderRadius: '50%',
      animation: `pulse-dot 1s ease-in-out ${delay}s infinite`,
    }} />
  );
}

function MessageBubble({ msg, onRecommend }) {
  if (msg.role === 'user') {
    return <div className="chat-bubble user">{msg.text}</div>;
  }

  // AI with possible product recommendations
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: '92%' }}>
      <div className="chat-bubble ai" style={{ whiteSpace: 'pre-wrap' }}>
        {msg.text}
      </div>
      {msg.recommendations && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {msg.recommendations.map(rec => (
            <div key={rec.id} style={{
              border: '1px solid #000',
              padding: '10px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              background: '#fff',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: '#666', textTransform: 'uppercase' }}>
                  {rec.sku}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{rec.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#000' }}>
                  ${rec.price.toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => onRecommend(rec)}
                style={{
                  padding: '6px 10px',
                  border: '1px solid #000',
                  fontSize: 10,
                  fontFamily: 'var(--mono)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  background: '#fff',
                }}
              >
                View →
              </button>
            </div>
          ))}
          {msg.bundleTotal && (
            <div style={{
              padding: '10px 12px',
              background: '#000',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--mono)',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              <span>Bundle total</span>
              <span>${msg.bundleTotal.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Simple canned replies — feels responsive without LLM dep
function generateReply(text, products) {
  const t = text.toLowerCase();
  if (t.includes('video') || t.includes('editing') || t.includes('setup')) {
    const recs = [products.find(p => p.id === 'nx-01'), products.find(p => p.id === 'nx-02'), products.find(p => p.id === 'nx-06')].filter(Boolean);
    const total = recs.reduce((s, p) => s + p.price, 0);
    return {
      role: 'ai',
      text: "For a color-accurate editing rig I'd pair the Neural Monitor (6K, P3 98%) with the Edge Mouse for fine-grain scrubs, and the Camera Pro for review calls.\n\nAll three live in the same gamut and ship as a matched set.",
      recommendations: recs,
      bundleTotal: total,
    };
  }
  if (t.includes('compare') || t.includes('vs')) {
    return {
      role: 'ai',
      text: "Quick comparison:\n\n— Edge Mouse: 26K DPI sensor, 58g, built for precision cursor work.\n— Keyboard 75: Hall-effect analog switches, 8KHz polling, built for sustained typing.\n\nDifferent jobs. Most customers take both.",
      recommendations: [products.find(p => p.id === 'nx-02'), products.find(p => p.id === 'nx-03')].filter(Boolean),
    };
  }
  if (t.includes('quiet') || t.includes('office') || t.includes('noise')) {
    const rec = products.find(p => p.id === 'nx-04');
    return {
      role: 'ai',
      text: "The Audio Pods run adaptive ANC at 42 dB — enough to flatten open-office chatter completely. Switches have a silent tactile profile on the Keyboard 75 if you also want quiet input.",
      recommendations: [rec],
    };
  }
  if (t.includes('chalk') || t.includes('white') || t.includes('color')) {
    const chalk = products.filter(p => p.colorways.includes('Chalk'));
    return {
      role: 'ai',
      text: `Five pieces are available in Chalk — a warm off-white powder-coat finish matched across the series:`,
      recommendations: chalk.slice(0, 4),
    };
  }
  if (t.includes('price') || t.includes('cheap') || t.includes('budget')) {
    return {
      role: 'ai',
      text: "Our entry point is the Edge Mouse at $189. For a complete desk under $1,000 I'd take the Mouse, Keyboard 75, and Audio Pods.",
      recommendations: [products.find(p => p.id === 'nx-02'), products.find(p => p.id === 'nx-03')].filter(Boolean),
    };
  }
  return {
    role: 'ai',
    text: "Got it. Based on what you've said, here are a couple I'd point you toward — happy to narrow further if you tell me more about your workflow.",
    recommendations: products.slice(0, 2),
  };
}

Object.assign(window, { Assistant });
