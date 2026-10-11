
// ============================================================
// X-RAY MEDICAL CENTER — React E-Commerce App
// Architecture: Component-based | Declarative | Modern Hooks
// ============================================================

import { useState, useEffect, useReducer, useCallback, useRef, createContext, useContext } from "react";

// ─────────────────────────────────────────────────────────────
// DESIGN TOKENS & GLOBAL STYLES
// ─────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=DM+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #060b14;
      --bg-card: #0c1524;
      --bg-glass: rgba(12, 21, 36, 0.85);
      --border: rgba(56, 189, 248, 0.15);
      --border-glow: rgba(56, 189, 248, 0.4);
      --cyan: #38bdf8;
      --cyan-dark: #0ea5e9;
      --cyan-dim: rgba(56, 189, 248, 0.08);
      --teal: #2dd4bf;
      --white: #f0f9ff;
      --muted: #64748b;
      --text: #cbd5e1;
      --text-bright: #e2e8f0;
      --danger: #f87171;
      --success: #34d399;
      --font-display: 'Syne', sans-serif;
      --font-body: 'DM Sans', sans-serif;
      --font-mono: 'DM Mono', monospace;
      --radius: 12px;
      --radius-lg: 20px;
      --shadow-glow: 0 0 40px rgba(56, 189, 248, 0.12);
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 16px;
      line-height: 1.6;
      overflow-x: hidden;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border-glow); border-radius: 3px; }

    button { cursor: pointer; font-family: var(--font-body); }
    input, textarea, select { font-family: var(--font-body); }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0); }
      50%       { box-shadow: 0 0 20px 4px rgba(56,189,248,0.25); }
    }
    @keyframes scan {
      0%   { transform: translateY(-100%); opacity: 0.6; }
      100% { transform: translateY(200px); opacity: 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-8px); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(20px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }

    .page-enter { animation: fadeIn 0.4s ease; }
    .card-hover {
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
    }
    .card-hover:hover {
      transform: translateY(-4px);
      border-color: var(--border-glow) !important;
      box-shadow: var(--shadow-glow);
    }
  `}</style>
);

// ─────────────────────────────────────────────────────────────
// CONTEXT: APPOINTMENTS STATE
// ─────────────────────────────────────────────────────────────
const AppointmentsContext = createContext(null);

const appointmentsReducer = (state, action) => {
  switch (action.type) {
    case "ADD":
      return { ...state, list: [...state.list, { ...action.payload, id: Date.now() }] };
    case "REMOVE":
      return { ...state, list: state.list.filter(a => a.id !== action.payload) };
    default:
      return state;
  }
};

const AppointmentsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentsReducer, { list: [] });
  const addAppointment = useCallback((appt) => dispatch({ type: "ADD", payload: appt }), []);
  const removeAppointment = useCallback((id) => dispatch({ type: "REMOVE", payload: id }), []);
  return (
    <AppointmentsContext.Provider value={{ appointments: state.list, addAppointment, removeAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

const useAppointments = () => useContext(AppointmentsContext);

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const XRAY_USES = [
  {
    id: 1,
    icon: "🦴",
    title: "Diagnóstico Óseo",
    tag: "TRAUMATOLOGÍA",
    description: "Detección de fracturas, luxaciones, tumores óseos y enfermedades degenerativas como la osteoporosis con alta resolución espacial.",
    color: "#38bdf8",
  },
  {
    id: 2,
    icon: "🫁",
    title: "Radiología Pulmonar",
    tag: "NEUMOLOGÍA",
    description: "Evaluación de neumonía, tuberculosis, edema pulmonar, neumotórax y nódulos pulmonares. Herramienta esencial en urgencias respiratorias.",
    color: "#2dd4bf",
  },
  {
    id: 3,
    icon: "🦷",
    title: "Odontología Digital",
    tag: "ODONTOLOGÍA",
    description: "Ortopantomografías y periapicales para detectar caries, evaluar raíces, implantes y estructuras maxilofaciales con dosis mínima.",
    color: "#818cf8",
  },
  {
    id: 4,
    icon: "❤️",
    title: "Cardiología Vascular",
    tag: "CARDIOLOGÍA",
    description: "Angriografía coronaria, evaluación de silueta cardíaca y cateterismo intervencionista guiado por fluoroscopía en tiempo real.",
    color: "#fb7185",
  },
  {
    id: 5,
    icon: "🧠",
    title: "Neuroimagen",
    tag: "NEUROLOGÍA",
    description: "Detección de calcificaciones intracraneales, evaluación de columna vertebral y mielografía para patologías del sistema nervioso.",
    color: "#a78bfa",
  },
  {
    id: 6,
    icon: "🔬",
    title: "Oncología Diagnóstica",
    tag: "ONCOLOGÍA",
    description: "Estadificación tumoral, guía para biopsias percutáneas y seguimiento de respuesta terapéutica en protocolos oncológicos.",
    color: "#34d399",
  },
];

const PROCEDURES = [
  "Radiografía de Tórax",
  "Radiografía de Columna Lumbar",
  "Radiografía de Columna Cervical",
  "Radiografía de Rodilla",
  "Radiografía de Cadera",
  "Radiografía de Manos",
  "Radiografía de Pie/Tobillo",
  "Radiografía Panorámica Dental",
  "Mamografía",
  "Densitometría Ósea",
  "Fluoroscopía",
  "Angriografía",
];

const BOT_KNOWLEDGE = {
  keywords: {
    "qué es": "Un rayo X es una forma de radiación electromagnética de alta energía capaz de atravesar tejidos blandos y ser absorbida por estructuras densas como huesos y metales, creando imágenes diagnósticas.",
    "rayos x": "Los rayos X son radiaciones ionizantes descubiertas por Wilhelm Röntgen en 1895. En medicina se usan para obtener imágenes del interior del cuerpo sin cirugía. ¿Deseas saber sobre algún procedimiento en particular?",
    "dolor": "Los procedimientos radiológicos estándar no son dolorosos. Solo se requiere mantenerse quieto durante unos segundos. Algunos procedimientos como la mamografía pueden causar leve incomodidad por la compresión.",
    "peligro": "Las dosis utilizadas en radiología diagnóstica son muy bajas y consideradas seguras. Un estudio de tórax equivale a la radiación natural que recibes en 10 días. Los beneficios diagnósticos superan ampliamente el riesgo mínimo.",
    "embarazo": "⚠️ Si estás embarazada o sospechas estarlo, debes informarlo antes del procedimiento. Aunque las dosis son bajas, se toman precauciones especiales o se considera una alternativa como ultrasonido.",
    "preparación": "La mayoría de radiografías no requieren preparación especial. Para algunos estudios abdominales puede pedirse ayuno de 4-6 horas. Se recomienda retirar joyas y objetos metálicos de la zona a estudiar.",
    "resultado": "Los resultados preliminares los entrega el técnico al finalizar, pero el informe oficial lo realiza el radiólogo en 24-48 horas hábiles. En urgencias el tiempo puede ser menor.",
    "precio": "Los precios varían según el estudio. Contamos con cobertura para la mayoría de aseguradoras. Puedes consultar tarifas o agendar una cita directamente desde este chat.",
    "cita": "¡Con mucho gusto! Puedo ayudarte a agendar tu cita. ¿Para qué procedimiento la necesitas? Puedes decirme el tipo de estudio y una fecha preferida.",
    "agendar": "¡Claro! Para agendar tu cita necesito: 1) Tipo de procedimiento 2) Fecha preferida 3) Tu nombre. ¿Con cuál empezamos?",
    "horario": "Atendemos de lunes a viernes de 7:00 AM a 7:00 PM, y sábados de 8:00 AM a 2:00 PM. El último turno se agenda 30 minutos antes del cierre.",
    "tórax": "La radiografía de tórax es el estudio más común. Evalúa pulmones, corazón, costillas y grandes vasos. Tarda menos de 1 minuto y no requiere preparación. ¿Deseas agendar una?",
    "columna": "Las radiografías de columna (cervical, dorsal o lumbar) evalúan vértebras, discos y curvatura. Se toman en diferentes proyecciones. Duran 5-10 minutos aproximadamente.",
    "mamografía": "La mamografía es el estudio estándar para detección temprana de cáncer de mama. Se recomienda anualmente a partir de los 40 años. Requiere compresión moderada de la mama.",
    "densitometría": "La densitometría ósea mide la densidad mineral ósea para detectar osteoporosis. Es indolora, rápida (15-20 min) y con muy baja radiación. Recomendada en mujeres post-menopáusicas.",
  },
  default: [
    "Entiendo tu consulta. Para darte información más precisa, ¿podrías detallar un poco más qué necesitas saber sobre el procedimiento radiológico?",
    "Puedo ayudarte con información sobre procedimientos radiológicos o agendar una cita. ¿Qué tipo de estudio te han indicado?",
    "Estoy aquí para resolver tus dudas sobre radiología diagnóstica. También puedo ayudarte a programar tu próxima cita.",
  ],
};

const getBotResponse = (message) => {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(BOT_KNOWLEDGE.keywords)) {
    if (lower.includes(key)) return response;
  }
  return BOT_KNOWLEDGE.default[Math.floor(Math.random() * BOT_KNOWLEDGE.default.length)];
};

// ─────────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────────
const Badge = ({ children, color = "var(--cyan)" }) => (
  <span style={{
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "20px",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "1.5px",
    fontFamily: "var(--font-mono)",
    color,
    border: `1px solid ${color}40`,
    background: `${color}12`,
  }}>
    {children}
  </span>
);

const GlassCard = ({ children, style = {}, className = "", onClick }) => (
  <div
    className={`card-hover ${className}`}
    onClick={onClick}
    style={{
      background: "var(--bg-glass)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      backdropFilter: "blur(12px)",
      ...style,
    }}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", style = {}, disabled = false }) => {
  const variants = {
    primary: {
      background: "linear-gradient(135deg, var(--cyan-dark), var(--teal))",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 20px rgba(56,189,248,0.3)",
    },
    ghost: {
      background: "transparent",
      color: "var(--cyan)",
      border: "1px solid var(--border-glow)",
    },
    danger: {
      background: "rgba(248,113,113,0.12)",
      color: "var(--danger)",
      border: "1px solid rgba(248,113,113,0.3)",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 22px",
        borderRadius: "var(--radius)",
        fontWeight: 600,
        fontSize: "14px",
        transition: "all 0.2s ease",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// LAYOUT: NAVBAR
// ─────────────────────────────────────────────────────────────
const Navbar = ({ currentPage, onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const { appointments } = useAppointments();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 32px",
      height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(6,11,20,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      {/* Logo */}
      <div
        onClick={() => onNavigate("home")}
        style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
      >
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, var(--cyan-dark), var(--teal))",
          borderRadius: "8px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px", boxShadow: "0 0 16px rgba(56,189,248,0.4)",
        }}>☢</div>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "15px", color: "var(--white)", letterSpacing: "-0.3px" }}>
            RadiCare
          </div>
          <div style={{ fontSize: "9px", color: "var(--cyan)", letterSpacing: "2px", fontFamily: "var(--font-mono)", marginTop: "-2px" }}>
            DIAGNÓSTICO DIGITAL
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {[
          { id: "home", label: "Inicio", icon: "⬡" },
          { id: "calendar", label: "Mis Citas", icon: "📅" },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 16px", borderRadius: "8px",
              background: currentPage === id ? "var(--cyan-dim)" : "transparent",
              border: `1px solid ${currentPage === id ? "var(--border-glow)" : "transparent"}`,
              color: currentPage === id ? "var(--cyan)" : "var(--muted)",
              fontWeight: 500, fontSize: "13px",
              transition: "all 0.2s ease",
            }}
          >
            <span>{icon}</span> {label}
            {id === "calendar" && appointments.length > 0 && (
              <span style={{
                background: "var(--cyan)", color: "#000",
                borderRadius: "10px", padding: "1px 7px",
                fontSize: "11px", fontWeight: 700,
              }}>{appointments.length}</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

// ─────────────────────────────────────────────────────────────
// HOME: HERO SECTION
// ─────────────────────────────────────────────────────────────
const HeroSection = ({ onOpenChat }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const taglines = ["Precisión diagnóstica", "Tecnología de vanguardia", "Atención especializada"];

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      padding: "80px 32px 60px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background effects */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(14,165,233,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", right: "5%", top: "15%",
        width: 420, height: 420,
        background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
        animation: "float 6s ease-in-out infinite",
      }} />
      {/* Scan line effect */}
      <div style={{
        position: "absolute", right: "8%", top: "12%",
        width: 340, height: 360,
        border: "1px solid rgba(56,189,248,0.15)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden", pointerEvents: "none",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(6,11,20,0.6)",
      }}>
        <div style={{
          fontSize: "160px", opacity: 0.08,
          filter: "blur(1px)",
          fontFamily: "var(--font-mono)",
          color: "var(--cyan)",
        }}>☢</div>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "3px",
          background: "linear-gradient(90deg, transparent, var(--cyan), transparent)",
          animation: "scan 3s linear infinite",
        }} />
        <div style={{
          position: "absolute", bottom: 12, left: 12, right: 12,
          display: "flex", justifyContent: "space-between",
          fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--cyan)", opacity: 0.6,
        }}>
          <span>SCAN: ACTIVE</span>
          <span style={{ animation: "blink 1s step-end infinite" }}>■ REC</span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 620, animation: "fadeUp 0.8s ease" }}>
        <div style={{ marginBottom: "16px" }}>
          <Badge color="var(--cyan)">RADIOLOGÍA DIAGNÓSTICA DIGITAL</Badge>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(40px, 6vw, 68px)",
          lineHeight: 1.05, letterSpacing: "-2px",
          color: "var(--white)", marginBottom: "8px",
        }}>
          Ver el interior,
          <br />
          <span style={{
            background: "linear-gradient(135deg, var(--cyan), var(--teal))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            sanar el todo.
          </span>
        </h1>

        <div style={{
          height: "28px", marginBottom: "24px",
          overflow: "hidden",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "13px",
            color: "var(--cyan)", letterSpacing: "2px",
            transition: "all 0.5s ease",
          }}>
            — {taglines[tick % taglines.length]}
          </p>
        </div>

        <p style={{
          fontSize: "17px", color: "var(--text)", lineHeight: 1.7,
          marginBottom: "36px", maxWidth: 500,
          fontWeight: 300,
        }}>
          Centro especializado en diagnóstico radiológico de alta precisión. Tecnología de última generación,
          informes digitales inmediatos y atención centrada en el paciente.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button onClick={onOpenChat} style={{ padding: "14px 28px", fontSize: "15px" }}>
            💬 Consultar con IA
          </Button>
          <Button variant="ghost" onClick={onOpenChat} style={{ padding: "14px 28px", fontSize: "15px" }}>
            📅 Agendar Cita
          </Button>
        </div>

        <div style={{
          display: "flex", gap: "32px", marginTop: "48px",
          paddingTop: "32px", borderTop: "1px solid var(--border)",
        }}>
          {[
            { num: "15+", label: "Años de experiencia" },
            { num: "50k+", label: "Estudios al año" },
            { num: "24h", label: "Resultados digitales" },
          ].map(({ num, label }) => (
            <div key={num}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 800, color: "var(--cyan)" }}>{num}</div>
              <div style={{ fontSize: "12px", color: "var(--muted)", letterSpacing: "0.5px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─────────────────────────────────────────────────────────────
// HOME: USES GRID
// ─────────────────────────────────────────────────────────────
const UsesGrid = ({ onOpenChat }) => (
  <section style={{ padding: "80px 32px", maxWidth: 1200, margin: "0 auto" }}>
    <div style={{ textAlign: "center", marginBottom: "56px", animation: "fadeUp 0.6s ease" }}>
      <Badge color="var(--teal)">APLICACIONES CLÍNICAS</Badge>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 800,
        fontSize: "clamp(28px, 4vw, 44px)", color: "var(--white)",
        marginTop: "16px", letterSpacing: "-1px",
      }}>
        Usos de los Rayos X
      </h2>
      <p style={{ color: "var(--muted)", maxWidth: "480px", margin: "12px auto 0", fontSize: "15px" }}>
        La radiología diagnóstica abarca múltiples especialidades médicas con aplicaciones críticas.
      </p>
    </div>

    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
      gap: "20px",
    }}>
      {XRAY_USES.map((use, i) => (
        <GlassCard
          key={use.id}
          style={{
            padding: "28px",
            animation: `fadeUp 0.5s ease ${i * 0.07}s both`,
            cursor: "pointer",
          }}
          onClick={onOpenChat}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
            <div style={{
              width: 52, height: 52,
              background: `${use.color}18`,
              border: `1px solid ${use.color}30`,
              borderRadius: "12px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "24px",
            }}>
              {use.icon}
            </div>
            <Badge color={use.color}>{use.tag}</Badge>
          </div>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "18px", color: "var(--white)", marginBottom: "10px",
          }}>
            {use.title}
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.65 }}>
            {use.description}
          </p>
          <div style={{
            marginTop: "16px", paddingTop: "16px",
            borderTop: `1px solid ${use.color}20`,
            display: "flex", justifyContent: "space-between",
            fontSize: "12px", color: "var(--muted)",
          }}>
            <span>→ Consultar procedimiento</span>
            <span style={{ color: use.color }}>Agendar cita</span>
          </div>
        </GlassCard>
      ))}
    </div>
  </section>
);

// ─────────────────────────────────────────────────────────────
// CHATBOT
// ─────────────────────────────────────────────────────────────
const useChat = (addAppointment) => {
  const [messages, setMessages] = useState([
    {
      id: 1, role: "bot",
      text: "¡Hola! 👋 Soy el asistente virtual de RadiCare. Puedo resolver tus dudas sobre procedimientos radiológicos y ayudarte a agendar una cita. ¿En qué te puedo ayudar hoy?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [step, setStep] = useState("idle"); // idle | proc | date | time | name | confirm
  const [pendingAppt, setPendingAppt] = useState({});
  const [isTyping, setIsTyping] = useState(false);

  const pushBot = useCallback((text) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(m => [...m, {
        id: Date.now(), role: "bot", text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }, 800 + Math.random() * 500);
  }, []);

  const sendMessage = useCallback((text) => {
    const userMsg = {
      id: Date.now(), role: "user", text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(m => [...m, userMsg]);

    if (step === "idle") {
      const lower = text.toLowerCase();
      if (lower.includes("cita") || lower.includes("agendar") || lower.includes("reservar")) {
        setStep("proc");
        pushBot("¡Perfecto! Voy a ayudarte a agendar tu cita. 📋\n¿Para qué procedimiento necesitas la cita?\n\nAlgunos ejemplos: Radiografía de Tórax, Columna, Rodilla, Mamografía, Densitometría...");
      } else {
        pushBot(getBotResponse(text));
      }
      return;
    }
    if (step === "proc") {
      setPendingAppt(p => ({ ...p, procedure: text }));
      setStep("date");
      pushBot(`Perfecto, registré: *${text}*.\n\n📅 ¿Qué fecha prefieres para tu cita? (Ej: 15/06/2025, mañana, próximo lunes...)`);
      return;
    }
    if (step === "date") {
      setPendingAppt(p => ({ ...p, date: text }));
      setStep("time");
      pushBot(`Fecha anotada: *${text}*.\n\n⏰ ¿A qué hora prefieres? Atendemos de Lunes a Viernes 7am–7pm, Sábados 8am–2pm.`);
      return;
    }
    if (step === "time") {
      setPendingAppt(p => ({ ...p, time: text }));
      setStep("name");
      pushBot(`Hora registrada: *${text}*.\n\n👤 Por último, ¿cuál es tu nombre completo?`);
      return;
    }
    if (step === "name") {
      const finalAppt = { ...pendingAppt, name: text };
      setPendingAppt(finalAppt);
      setStep("confirm");
      pushBot(`¡Excelente! Voy a confirmar tu cita:\n\n📋 Procedimiento: ${finalAppt.procedure}\n📅 Fecha: ${finalAppt.date}\n⏰ Hora: ${finalAppt.time}\n👤 Paciente: ${text}\n\n¿Confirmas esta cita? Responde *Sí* para agendar o *No* para cancelar.`);
      return;
    }
    if (step === "confirm") {
      if (text.toLowerCase().includes("sí") || text.toLowerCase() === "si" || text.toLowerCase().includes("confirmo")) {
        addAppointment(pendingAppt);
        setStep("idle");
        setPendingAppt({});
        pushBot("✅ ¡Cita agendada exitosamente! Puedes verla en el calendario desde el menú superior. Recibirás una confirmación. ¿Hay algo más en que pueda ayudarte?");
      } else {
        setStep("idle");
        setPendingAppt({});
        pushBot("Cita cancelada. No hay problema, cuando quieras puedes volver a agendar. ¿Tienes alguna otra consulta?");
      }
    }
  }, [step, pendingAppt, pushBot, addAppointment]);

  return { messages, sendMessage, isTyping, step };
};

const ChatBot = ({ isOpen, onClose }) => {
  const { addAppointment } = useAppointments();
  const { messages, sendMessage, isTyping, step } = useChat(addAppointment);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const quickReplies = step === "idle"
    ? ["¿Qué es una radiografía?", "¿Necesito preparación?", "Agendar una cita", "Horarios de atención"]
    : step === "proc"
    ? PROCEDURES.slice(0, 4)
    : step === "confirm"
    ? ["Sí, confirmo", "No, cancelar"]
    : [];

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", right: 24, bottom: 24, zIndex: 200,
      width: 380, maxHeight: "82vh",
      display: "flex", flexDirection: "column",
      background: "var(--bg-card)",
      border: "1px solid var(--border-glow)",
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(56,189,248,0.1)",
      animation: "slideIn 0.3s ease",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(45,212,191,0.1))",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 38, height: 38,
            background: "linear-gradient(135deg, var(--cyan-dark), var(--teal))",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}>🤖</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--white)" }}>
              AsistenteRad IA
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <span style={{ width: 6, height: 6, background: "#34d399", borderRadius: "50%", display: "inline-block" }} />
              <span style={{ fontSize: "11px", color: "var(--muted)" }}>En línea — Responde al instante</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)",
            color: "var(--muted)", borderRadius: "8px", width: 30, height: 30,
            fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeUp 0.3s ease",
          }}>
            <div style={{
              maxWidth: "82%",
              padding: "10px 14px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user"
                ? "linear-gradient(135deg, var(--cyan-dark), var(--teal))"
                : "rgba(255,255,255,0.04)",
              border: msg.role === "bot" ? "1px solid var(--border)" : "none",
              color: "var(--white)",
              fontSize: "13.5px", lineHeight: 1.55,
              whiteSpace: "pre-line",
            }}>
              {msg.text}
              <div style={{ fontSize: "10px", color: msg.role === "user" ? "rgba(255,255,255,0.6)" : "var(--muted)", marginTop: "4px", textAlign: "right" }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", gap: "5px", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", borderRadius: "16px 16px 16px 4px", width: "fit-content" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "var(--cyan)", opacity: 0.8,
                animation: `blink 1.2s ease ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      {quickReplies.length > 0 && (
        <div style={{ padding: "8px 16px", display: "flex", gap: "6px", flexWrap: "wrap", borderTop: "1px solid var(--border)" }}>
          {quickReplies.map(qr => (
            <button
              key={qr}
              onClick={() => { sendMessage(qr); setInput(""); }}
              style={{
                padding: "5px 12px", borderRadius: "20px", fontSize: "12px",
                background: "var(--cyan-dim)", border: "1px solid var(--border-glow)",
                color: "var(--cyan)", cursor: "pointer", fontWeight: 500,
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
              }}
            >
              {qr}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid var(--border)",
        display: "flex", gap: "8px", alignItems: "center",
      }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Escribe tu mensaje..."
          style={{
            flex: 1, padding: "10px 14px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)",
            borderRadius: "10px", color: "var(--white)",
            fontSize: "13px", outline: "none",
            transition: "border-color 0.2s ease",
          }}
          onFocus={e => e.target.style.borderColor = "var(--border-glow)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: 38, height: 38,
            background: "linear-gradient(135deg, var(--cyan-dark), var(--teal))",
            border: "none", borderRadius: "10px",
            color: "#fff", fontSize: "16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: input.trim() ? 1 : 0.4,
            transition: "opacity 0.2s ease",
          }}
        >➤</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// CALENDAR PAGE
// ─────────────────────────────────────────────────────────────
const useCalendar = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = new Date(year, month).toLocaleString("es-ES", { month: "long", year: "numeric" });

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  return { year, month, daysInMonth, firstDay, monthName, prev, next, today };
};

const CalendarPage = ({ onNavigate }) => {
  const { appointments, removeAppointment } = useAppointments();
  const { year, month, daysInMonth, firstDay, monthName, prev, next, today } = useCalendar();
  const [selected, setSelected] = useState(null);

  const apptsByDay = {};
  appointments.forEach(a => {
    const match = a.date.match(/(\d{1,2})[\/\-](\d{1,2})/);
    if (match) {
      const key = `${parseInt(match[2])}-${parseInt(match[1])}`; // month-day
      if (!apptsByDay[key]) apptsByDay[key] = [];
      apptsByDay[key].push(a);
    }
  });

  const getAppts = (day) => apptsByDay[`${month + 1}-${day}`] || [];

  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div style={{ minHeight: "100vh", padding: "90px 32px 60px", maxWidth: 1100, margin: "0 auto", animation: "fadeIn 0.4s ease" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <Badge color="var(--teal)">GESTIÓN DE CITAS</Badge>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "36px", color: "var(--white)",
          marginTop: "12px", letterSpacing: "-1px",
        }}>
          Calendario de Citas
        </h1>
        <p style={{ color: "var(--muted)", marginTop: "6px" }}>
          {appointments.length === 0
            ? "No tienes citas agendadas. Ve al chatbot para agendar una."
            : `Tienes ${appointments.length} cita${appointments.length > 1 ? "s" : ""} agendada${appointments.length > 1 ? "s" : ""}.`}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
        {/* Calendar Grid */}
        <GlassCard style={{ padding: "28px" }}>
          {/* Month Nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <button onClick={prev} style={{
              background: "var(--cyan-dim)", border: "1px solid var(--border)",
              color: "var(--cyan)", borderRadius: "8px", width: 36, height: 36,
              fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>‹</button>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px",
              color: "var(--white)", textTransform: "capitalize",
            }}>{monthName}</h2>
            <button onClick={next} style={{
              background: "var(--cyan-dim)", border: "1px solid var(--border)",
              color: "var(--cyan)", borderRadius: "8px", width: 36, height: 36,
              fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
            }}>›</button>
          </div>

          {/* Day Headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px", marginBottom: "8px" }}>
            {days.map(d => (
              <div key={d} style={{
                textAlign: "center", fontSize: "11px", fontWeight: 600,
                color: "var(--muted)", padding: "6px 0", letterSpacing: "0.5px",
                fontFamily: "var(--font-mono)",
              }}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayAppts = getAppts(day);
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const isSelected = selected === day;

              return (
                <button
                  key={day}
                  onClick={() => setSelected(isSelected ? null : day)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "10px",
                    background: isSelected
                      ? "linear-gradient(135deg, var(--cyan-dark), var(--teal))"
                      : isToday
                      ? "var(--cyan-dim)"
                      : dayAppts.length > 0
                      ? "rgba(45,212,191,0.08)"
                      : "transparent",
                    border: isToday && !isSelected
                      ? "1px solid var(--border-glow)"
                      : dayAppts.length > 0 && !isSelected
                      ? "1px solid rgba(45,212,191,0.3)"
                      : "1px solid transparent",
                    color: isSelected ? "#fff" : isToday ? "var(--cyan)" : "var(--text-bright)",
                    fontSize: "13px", fontWeight: isToday || dayAppts.length > 0 ? 700 : 400,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                >
                  {day}
                  {dayAppts.length > 0 && (
                    <div style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: isSelected ? "#fff" : "var(--teal)",
                      position: "absolute", bottom: 4,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* Sidebar: Appointments List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <GlassCard style={{ padding: "20px", flex: 1 }}>
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "15px", color: "var(--white)", marginBottom: "16px",
            }}>
              {selected ? `Citas del día ${selected}` : "Todas las citas"}
            </h3>

            {appointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.3 }}>📅</div>
                <p style={{ color: "var(--muted)", fontSize: "13px" }}>Sin citas agendadas</p>
                <button
                  onClick={() => onNavigate("home")}
                  style={{
                    marginTop: "16px", padding: "8px 16px",
                    background: "var(--cyan-dim)", border: "1px solid var(--border-glow)",
                    borderRadius: "8px", color: "var(--cyan)", fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Ir al chatbot →
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", maxHeight: "460px" }}>
                {appointments
                  .filter(a => {
                    if (!selected) return true;
                    const match = a.date.match(/(\d{1,2})/);
                    return match && parseInt(match[1]) === selected;
                  })
                  .map(appt => (
                    <div
                      key={appt.id}
                      style={{
                        padding: "14px 16px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        animation: "fadeUp 0.3s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--white)", marginBottom: "4px" }}>
                            {appt.procedure}
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>👤 {appt.name}</div>
                          <div style={{ fontSize: "11px", color: "var(--cyan)", marginTop: "3px" }}>
                            📅 {appt.date} · ⏰ {appt.time}
                          </div>
                        </div>
                        <button
                          onClick={() => removeAppointment(appt.id)}
                          style={{
                            background: "transparent", border: "none",
                            color: "var(--muted)", fontSize: "14px", cursor: "pointer",
                            padding: "2px 6px", borderRadius: "4px",
                          }}
                          title="Eliminar cita"
                        >✕</button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </GlassCard>

          {/* Legend */}
          <GlassCard style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { color: "var(--cyan)", label: "Hoy" },
                { color: "var(--teal)", label: "Cita agendada" },
                { color: "var(--muted)", label: "Día sin citas" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
                  <span style={{ fontSize: "12px", color: "var(--text)" }}>{label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// HOME PAGE
// ─────────────────────────────────────────────────────────────
const HomePage = ({ onOpenChat }) => (
  <>
    <HeroSection onOpenChat={onOpenChat} />
    <UsesGrid onOpenChat={onOpenChat} />
    {/* CTA Section */}
    <section style={{
      padding: "60px 32px",
      textAlign: "center",
      background: "linear-gradient(180deg, transparent, rgba(14,165,233,0.04) 50%, transparent)",
      maxWidth: 700, margin: "0 auto",
    }}>
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 800,
        fontSize: "32px", color: "var(--white)",
        letterSpacing: "-1px", marginBottom: "16px",
      }}>
        ¿Listo para tu estudio?
      </h2>
      <p style={{ color: "var(--muted)", marginBottom: "28px", fontSize: "15px" }}>
        Agenda tu cita en minutos con nuestro asistente inteligente. Sin filas, sin esperas innecesarias.
      </p>
      <Button onClick={onOpenChat} style={{ padding: "14px 32px", fontSize: "16px" }}>
        💬 Hablar con AsistenteRad
      </Button>
    </section>
    {/* Footer */}
    <footer style={{
      padding: "32px",
      borderTop: "1px solid var(--border)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: "12px",
    }}>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--muted)", fontSize: "13px" }}>
        ☢ RadiCare — Diagnóstico Digital
      </div>
      <div style={{ fontSize: "12px", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
        © 2025 · Todos los derechos reservados
      </div>
    </footer>
  </>
);

// ─────────────────────────────────────────────────────────────
// CHAT FAB BUTTON
// ─────────────────────────────────────────────────────────────
const ChatFAB = ({ onClick, hasUnread }) => (
  <button
    onClick={onClick}
    style={{
      position: "fixed", right: 24, bottom: 24, zIndex: 190,
      width: 56, height: 56, borderRadius: "50%",
      background: "linear-gradient(135deg, var(--cyan-dark), var(--teal))",
      border: "none", color: "#fff", fontSize: "24px",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 8px 30px rgba(56,189,248,0.4)",
      animation: "pulse-glow 2s ease-in-out infinite",
      transition: "transform 0.2s ease",
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    title="Abrir asistente virtual"
  >
    💬
    {hasUnread && (
      <span style={{
        position: "absolute", top: 4, right: 4,
        width: 10, height: 10, borderRadius: "50%",
        background: "var(--danger)", border: "2px solid var(--bg)",
      }} />
    )}
  </button>
);

// ─────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────
const App = () => {
  const [page, setPage] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AppointmentsProvider>
      <GlobalStyles />
      <Navbar currentPage={page} onNavigate={setPage} />

      <main>
        {page === "home" && (
          <HomePage onOpenChat={() => setChatOpen(true)} />
        )}
        {page === "calendar" && (
          <CalendarPage onNavigate={setPage} />
        )}
      </main>

      {chatOpen ? (
        <ChatBot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      ) : (
        <ChatFAB onClick={() => setChatOpen(true)} />
      )}
    </AppointmentsProvider>
  );
};

export default App;
