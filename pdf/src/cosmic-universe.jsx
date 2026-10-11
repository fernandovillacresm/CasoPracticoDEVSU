import { useState, useEffect, useRef, useCallback } from "react";

// ─── Starfield Canvas ──────────────────────────────────────────────────────────
function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrame;
    let width, height;

    const stars = [];
    const meteors = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function initStars(count = 280) {
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.6 + 0.2,
          alpha: Math.random(),
          dAlpha: (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
          color: ["#fff", "#c8d8ff", "#ffd6a0", "#ffe0e0"][Math.floor(Math.random() * 4)],
        });
      }
    }

    function spawnMeteor() {
      if (meteors.length < 4 && Math.random() < 0.012) {
        const startX = Math.random() * width * 1.5 - width * 0.25;
        meteors.push({
          x: startX,
          y: -10,
          vx: 3.5 + Math.random() * 3,
          vy: 2.5 + Math.random() * 2.5,
          len: 120 + Math.random() * 180,
          alpha: 1,
          fade: 0.015 + Math.random() * 0.01,
          width: 1.5 + Math.random() * 1.5,
        });
      }
    }

    function drawStars() {
      for (const s of stars) {
        s.alpha += s.dAlpha;
        if (s.alpha <= 0 || s.alpha >= 1) s.dAlpha *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.fill();
      }
    }

    function drawMeteors() {
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        ctx.save();
        ctx.globalAlpha = m.alpha;
        const grad = ctx.createLinearGradient(
          m.x - m.vx * (m.len / 5), m.y - m.vy * (m.len / 5),
          m.x, m.y
        );
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(0.6, "rgba(180,210,255,0.7)");
        grad.addColorStop(1, "rgba(255,255,255,0.95)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x - m.vx * (m.len / 5), m.y - m.vy * (m.len / 5));
        ctx.lineTo(m.x, m.y);
        ctx.stroke();
        // glow
        ctx.globalAlpha = m.alpha * 0.3;
        ctx.lineWidth = m.width * 3;
        ctx.stroke();
        ctx.restore();

        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= m.fade;
        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      spawnMeteor();
      drawStars();
      drawMeteors();
      animFrame = requestAnimationFrame(loop);
    }

    resize();
    initStars();
    loop();
    window.addEventListener("resize", () => { resize(); initStars(); });
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ─── Nebula SVG Background ─────────────────────────────────────────────────────
function NebulaBg() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      background: "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(30,0,80,0.55) 0%, transparent 70%), radial-gradient(ellipse 60% 70% at 80% 70%, rgba(0,20,90,0.5) 0%, transparent 60%), radial-gradient(ellipse 100% 80% at 50% 50%, #000010 60%, #0a001a 100%)",
    }} />
  );
}

// ─── Section: Universe Origin ──────────────────────────────────────────────────
const sections = [
  {
    title: "El Big Bang",
    icon: "💥",
    text: "Hace aproximadamente 13,800 millones de años, el universo surgió de una singularidad infinitamente densa y caliente. En una fracción de segundo, el espacio-tiempo comenzó a expandirse exponencialmente, dando origen a toda la materia, energía, espacio y tiempo que conocemos.",
    accent: "#ff6b35",
  },
  {
    title: "Inflación Cósmica",
    icon: "🌌",
    text: "Durante los primeros 10⁻³⁶ segundos, el universo se expandió más rápido que la luz, aumentando su tamaño por un factor de 10²⁶. Este período de inflación explicó la homogeneidad y planitud del cosmos observable.",
    accent: "#7b2fff",
  },
  {
    title: "Las Primeras Estrellas",
    icon: "⭐",
    text: "Unos 380,000 años después del Big Bang, el universo se enfrió lo suficiente para que los electrones se unieran a los núcleos, creando los primeros átomos. Las primeras estrellas —llamadas Población III— se formaron unos 100 millones de años después, forjando elementos pesados en sus núcleos.",
    accent: "#00d4ff",
  },
  {
    title: "Materia y Energía Oscura",
    icon: "🌑",
    text: "Hoy el universo está compuesto en un 68% de energía oscura —que acelera su expansión—, 27% de materia oscura invisible y solo un 5% de materia ordinaria. Estas fuerzas invisibles gobiernan la estructura a gran escala del cosmos.",
    accent: "#ff3cac",
  },
];

// ─── Chat bubble ──────────────────────────────────────────────────────────────
function ChatBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 12,
      animation: "fadeUp 0.35s ease",
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%", marginRight: 8, flexShrink: 0,
          background: "linear-gradient(135deg, #7b2fff, #00d4ff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, boxShadow: "0 0 12px rgba(123,47,255,0.6)",
        }}>🔭</div>
      )}
      <div style={{
        maxWidth: "75%",
        padding: "10px 15px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
        background: isUser
          ? "linear-gradient(135deg, rgba(123,47,255,0.7), rgba(0,100,200,0.7))"
          : "rgba(255,255,255,0.07)",
        border: isUser ? "1px solid rgba(123,47,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
        color: "#e8eeff",
        fontSize: 13.5,
        lineHeight: 1.6,
        fontFamily: "'Georgia', serif",
        boxShadow: isUser
          ? "0 4px 20px rgba(123,47,255,0.25)"
          : "0 4px 20px rgba(0,0,0,0.3)",
        whiteSpace: "pre-wrap",
      }}>
        {msg.content}
      </div>
    </div>
  );
}

// ─── Chatbot Panel ─────────────────────────────────────────────────────────────
function CosmicChatbot({ onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "🌠 Bienvenido al Observatorio Cósmico. Soy tu guía estelar. Puedes preguntarme sobre los planetas, el Sol, lunas, asteroides, cometas o cualquier misterio del sistema solar. ¿Qué quieres explorar hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Eres un astrónomo y astrofísico experto llamado COSMOS. Tu especialidad es el sistema solar. Responde siempre en español, con un tono fascinante y apasionado por el universo. Cuando sea apropiado, usa emojis relacionados al espacio (🌍🪐⭐🌙☀️🚀🌌💫🔭). Mantén respuestas concisas pero informativas (máximo 4 párrafos). Si te preguntan algo fuera del sistema solar o astronomía, redirige amablemente hacia esos temas.`,
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Lo siento, no pude obtener una respuesta.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "⚠️ Error al conectar con el observatorio. Por favor intenta de nuevo." }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 1000,
      width: 380, height: 560,
      display: "flex", flexDirection: "column",
      background: "rgba(2,4,20,0.88)",
      backdropFilter: "blur(24px)",
      border: "1px solid rgba(123,47,255,0.35)",
      borderRadius: 20,
      boxShadow: "0 0 60px rgba(123,47,255,0.25), 0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.07)",
      overflow: "hidden",
      animation: "slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 18px",
        background: "linear-gradient(90deg, rgba(123,47,255,0.3), rgba(0,80,180,0.3))",
        borderBottom: "1px solid rgba(123,47,255,0.2)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "linear-gradient(135deg, #7b2fff, #00d4ff)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 0 20px rgba(123,47,255,0.7)",
          }}>🔭</div>
          <div>
            <div style={{ fontFamily: "'Palatino Linotype', Palatino, serif", color: "#e0d0ff", fontSize: 15, fontWeight: 600, letterSpacing: 1 }}>COSMOS AI</div>
            <div style={{ fontSize: 11, color: "#7b9fff", letterSpacing: 0.5 }}>Guía del Sistema Solar</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 8px #00ff88", animation: "pulse 2s infinite" }} />
          <button onClick={onClose} style={{
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8, color: "#aaa", cursor: "pointer", padding: "4px 10px", fontSize: 16,
            transition: "all 0.2s",
          }}>✕</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "16px 14px",
        scrollbarWidth: "thin", scrollbarColor: "rgba(123,47,255,0.4) transparent",
      }}>
        {messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", color: "#7b9fff", fontSize: 13 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "linear-gradient(135deg, #7b2fff, #00d4ff)",
                  animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
            Consultando el cosmos...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "12px 14px",
        borderTop: "1px solid rgba(123,47,255,0.2)",
        background: "rgba(0,0,10,0.4)",
        display: "flex", gap: 8,
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Pregunta sobre el sistema solar..."
          rows={1}
          style={{
            flex: 1, background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(123,47,255,0.3)",
            borderRadius: 12, padding: "10px 14px",
            color: "#e0d8ff", fontSize: 13.5,
            fontFamily: "'Georgia', serif",
            resize: "none", outline: "none",
            lineHeight: 1.5,
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(123,47,255,0.7)"}
          onBlur={e => e.target.style.borderColor = "rgba(123,47,255,0.3)"}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            width: 42, height: 42,
            borderRadius: 12, border: "none", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            background: loading || !input.trim()
              ? "rgba(123,47,255,0.2)"
              : "linear-gradient(135deg, #7b2fff, #00a8ff)",
            color: "#fff", fontSize: 18,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.25s",
            boxShadow: !loading && input.trim() ? "0 0 20px rgba(123,47,255,0.5)" : "none",
            flexShrink: 0, alignSelf: "flex-end",
          }}
        >🚀</button>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function CosmicApp() {
  const [chatOpen, setChatOpen] = useState(false);
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    sections.forEach((_, i) => {
      setTimeout(() => setVisible(prev => [...prev, i]), 300 + i * 200);
    });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      color: "#e0e8ff",
      fontFamily: "'Palatino Linotype', Palatino, 'Book Antiqua', serif",
      position: "relative",
      overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lato:ital,wght@0,300;0,400;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(123,47,255,0.4); border-radius: 3px; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(123,47,255,0.6), 0 0 60px rgba(0,180,255,0.3); }
          50% { text-shadow: 0 0 50px rgba(123,47,255,0.9), 0 0 100px rgba(0,180,255,0.5), 0 0 140px rgba(255,100,255,0.2); }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes chatBtnPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(123,47,255,0.5), 0 8px 30px rgba(0,0,0,0.6); }
          50% { box-shadow: 0 0 0 12px rgba(123,47,255,0), 0 8px 30px rgba(0,0,0,0.6); }
        }
        .card:hover .card-icon { animation: floatOrb 2s ease-in-out infinite; }
        .card:hover { transform: translateY(-6px) !important; }
      `}</style>

      <NebulaBg />
      <StarfieldCanvas />

      {/* ── HERO ── */}
      <section style={{
        position: "relative", zIndex: 10,
        textAlign: "center",
        padding: "100px 24px 80px",
        maxWidth: 900,
        margin: "0 auto",
      }}>
        {/* Rotating ring */}
        <div style={{
          position: "absolute", top: 60, left: "50%", transform: "translateX(-50%)",
          width: 320, height: 320, borderRadius: "50%",
          border: "1px solid rgba(123,47,255,0.2)",
          animation: "rotateSlow 40s linear infinite",
          pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)",
            width: 8, height: 8, borderRadius: "50%",
            background: "radial-gradient(circle, #fff, #7b2fff)",
            boxShadow: "0 0 12px #7b2fff",
          }} />
        </div>
        <div style={{
          position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)",
          width: 260, height: 260, borderRadius: "50%",
          border: "1px dashed rgba(0,212,255,0.15)",
          animation: "rotateSlow 25s linear infinite reverse",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", marginBottom: 24 }}>
          <div style={{ fontSize: 80, marginBottom: 8, animation: "floatOrb 4s ease-in-out infinite", filter: "drop-shadow(0 0 30px rgba(255,200,50,0.6))" }}>🌌</div>
        </div>

        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          lineHeight: 1.1,
          marginBottom: 20,
          background: "linear-gradient(135deg, #ffffff 0%, #c8b8ff 35%, #00d4ff 70%, #ffffff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "titleGlow 4s ease-in-out infinite",
        }}>
          El Origen del Universo
        </h1>

        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.2rem)",
          color: "rgba(200,210,255,0.75)",
          lineHeight: 1.8,
          maxWidth: 650,
          margin: "0 auto 16px",
          fontWeight: 300,
          letterSpacing: "0.03em",
          fontFamily: "'Lato', sans-serif",
          fontStyle: "italic",
        }}>
          Desde la singularidad primordial hasta las galaxias que pueblan el cosmos — un viaje de 13,800 millones de años a través del espacio y el tiempo.
        </p>

        <div style={{
          display: "inline-block",
          padding: "6px 22px",
          borderRadius: 40,
          background: "rgba(123,47,255,0.15)",
          border: "1px solid rgba(123,47,255,0.35)",
          color: "#b0a0ff",
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          fontFamily: "'Lato', sans-serif",
          marginBottom: 0,
        }}>
          ✦ Cosmología y Astrofísica ✦
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div style={{ display: "flex", alignItems: "center", maxWidth: 800, margin: "0 auto 60px", padding: "0 24px", zIndex: 10, position: "relative" }}>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(123,47,255,0.4))" }} />
        <div style={{ margin: "0 16px", fontSize: 20 }}>✦</div>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(123,47,255,0.4), transparent)" }} />
      </div>

      {/* ── CARDS ── */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 1100, margin: "0 auto 100px",
        padding: "0 24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
      }}>
        {sections.map((sec, i) => (
          <div
            key={i}
            className="card"
            style={{
              background: "rgba(10,6,30,0.6)",
              backdropFilter: "blur(20px)",
              border: `1px solid ${sec.accent}30`,
              borderRadius: 20,
              padding: "32px 28px",
              transition: "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.35s ease",
              boxShadow: `0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
              opacity: visible.includes(i) ? 1 : 0,
              transform: visible.includes(i) ? "translateY(0)" : "translateY(30px)",
              transitionProperty: "opacity, transform, box-shadow",
              transitionDuration: "0.6s",
              cursor: "default",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = `0 12px 50px ${sec.accent}30, 0 4px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)`;
              e.currentTarget.style.borderColor = `${sec.accent}60`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 4px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = `${sec.accent}30`;
            }}
          >
            {/* Gradient corner */}
            <div style={{
              position: "absolute", top: 0, right: 0, width: 120, height: 120,
              background: `radial-gradient(circle at top right, ${sec.accent}18, transparent 70%)`,
              pointerEvents: "none",
            }} />
            <div className="card-icon" style={{ fontSize: 44, marginBottom: 16, display: "block" }}>{sec.icon}</div>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.2rem",
              fontWeight: 600,
              color: sec.accent,
              marginBottom: 14,
              letterSpacing: "0.06em",
              textShadow: `0 0 20px ${sec.accent}60`,
            }}>{sec.title}</h2>
            <p style={{
              fontSize: 14.5,
              lineHeight: 1.75,
              color: "rgba(210,220,255,0.78)",
              fontFamily: "'Lato', sans-serif",
              fontWeight: 300,
            }}>{sec.text}</p>
          </div>
        ))}
      </section>

      {/* ── TIMELINE STRIP ── */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 900, margin: "0 auto 100px",
        padding: "0 24px",
      }}>
        <h2 style={{
          fontFamily: "'Cinzel', serif", textAlign: "center",
          fontSize: "1.6rem", color: "#b0c0ff", letterSpacing: "0.1em",
          marginBottom: 48, textShadow: "0 0 30px rgba(100,100,255,0.4)",
        }}>Cronología del Cosmos</h2>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, transparent, rgba(123,47,255,0.5) 20%, rgba(0,212,255,0.5) 80%, transparent)", transform: "translateX(-50%)" }} />
          {[
            { t: "10⁻⁴³ s", label: "Tiempo de Planck", side: "left", color: "#ff6b35" },
            { t: "10⁻³⁶ s", label: "Inicio de la Inflación", side: "right", color: "#ff3cac" },
            { t: "3 min", label: "Nucleosíntesis primordial", side: "left", color: "#7b2fff" },
            { t: "380,000 años", label: "Recombinación — primera luz", side: "right", color: "#00d4ff" },
            { t: "200 M años", label: "Primeras estrellas", side: "left", color: "#ffd700" },
            { t: "9,200 M años", label: "Nace el Sistema Solar", side: "right", color: "#00ff88" },
            { t: "Hoy", label: "13,800 millones de años", side: "left", color: "#c8b8ff" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: item.side === "left" ? "flex-start" : "flex-end",
              marginBottom: 32,
              position: "relative",
            }}>
              <div style={{
                width: "44%",
                background: "rgba(10,6,30,0.65)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${item.color}40`,
                borderRadius: 12,
                padding: "12px 18px",
                boxShadow: `0 0 20px ${item.color}15`,
              }}>
                <div style={{ fontSize: 11, color: item.color, letterSpacing: "0.15em", fontFamily: "'Lato', sans-serif", marginBottom: 4, textTransform: "uppercase" }}>{item.t}</div>
                <div style={{ fontSize: 14, color: "rgba(210,220,255,0.85)", fontFamily: "'Lato', sans-serif" }}>{item.label}</div>
              </div>
              {/* Dot */}
              <div style={{
                position: "absolute", left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
                width: 12, height: 12, borderRadius: "50%",
                background: item.color,
                boxShadow: `0 0 16px ${item.color}`,
                border: "2px solid rgba(0,0,0,0.5)",
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 10,
        textAlign: "center", padding: "40px 24px",
        borderTop: "1px solid rgba(123,47,255,0.15)",
        color: "rgba(150,160,200,0.5)",
        fontSize: 13,
        fontFamily: "'Lato', sans-serif",
        letterSpacing: "0.08em",
      }}>
        ✦ El universo no solo es más extraño de lo que supponemos, sino más extraño de lo que podemos suponer. ✦
        <br /><span style={{ fontSize: 11, opacity: 0.6, marginTop: 6, display: "block" }}>— J.B.S. Haldane</span>
      </footer>

      {/* ── CHATBOT BUTTON ── */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          style={{
            position: "fixed", bottom: 28, right: 28, zIndex: 999,
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #7b2fff, #00a8ff)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28,
            animation: "chatBtnPulse 2.5s ease-in-out infinite",
            transition: "transform 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          title="Hablar con COSMOS AI"
        >🔭</button>
      )}

      {/* ── CHATBOT PANEL ── */}
      {chatOpen && <CosmicChatbot onClose={() => setChatOpen(false)} />}
    </div>
  );
}
