import { useState, useEffect, useRef } from "react";
import axios from 'axios';


// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { icon: "🦷", title: "Blanqueamiento Dental", desc: "Recupera la blancura natural de tu sonrisa con tecnología LED avanzada.", price: "$120" },
  { icon: "🔬", title: "Ortodoncia Invisible", desc: "Alineadores transparentes personalizados para una corrección discreta.", price: "$1,800" },
  { icon: "💎", title: "Carillas Porcelana", desc: "Transformación estética con carillas ultra-delgadas de alta durabilidad.", price: "$450" },
  { icon: "🛡️", title: "Implantes Dentales", desc: "Solución permanente con titanio de grado médico e integración ósea.", price: "$980" },
  { icon: "🌿", title: "Limpieza Profunda", desc: "Profilaxis y eliminación de sarro con ultrasonido de última generación.", price: "$80" },
  { icon: "⚡", title: "Endodoncia", desc: "Tratamiento de conductos con mínimo dolor y recuperación express.", price: "$250" },
];

const INITIAL_PRODUCTS = [
  { id: 1, name: "Kit Blanqueamiento Premium", category: "Blanqueamiento", price: 89.99, stock: 50, img: "🪥" },
  { id: 2, name: "Hilo Dental Seda Natural", category: "Higiene", price: 12.50, stock: 200, img: "🧵" },
  { id: 3, name: "Enjuague Bucal Menta", category: "Higiene", price: 18.00, stock: 150, img: "💧" },
  { id: 4, name: "Cepillo Eléctrico Pro", category: "Equipo", price: 129.99, stock: 30, img: "⚡" },
  { id: 5, name: "Pasta Flúor Activo", category: "Higiene", price: 9.50, stock: 300, img: "🌿" },
  { id: 6, name: "Protector Nocturno", category: "Protección", price: 45.00, stock: 80, img: "🛡️" },
  { id: 7, name: "Irrigador Dental", category: "Equipo", price: 75.00, stock: 40, img: "💦" },
  { id: 8, name: "Gel Sensibilidad", category: "Tratamiento", price: 22.00, stock: 120, img: "❄️" },
  { id: 9, name: "Tabletas Reveladoras", category: "Diagnóstico", price: 14.00, stock: 180, img: "🔴" },
  { id: 10, name: "Barniz de Flúor", category: "Tratamiento", price: 35.00, stock: 90, img: "✨" },
  { id: 11, name: "Espejo Dental LED", category: "Equipo", price: 28.00, stock: 60, img: "🔦" },
  { id: 12, name: "Kit Ortodoncia", category: "Ortodoncia", price: 55.00, stock: 45, img: "📦" },
  { id: 13, name: "Cera para Brackets", category: "Ortodoncia", price: 8.00, stock: 250, img: "🕯️" },
  { id: 14, name: "Blanqueador Tiras", category: "Blanqueamiento", price: 39.99, stock: 100, img: "🦷" },
  { id: 15, name: "Limpiador Prótesis", category: "Prótesis", price: 16.00, stock: 110, img: "💊" },
  { id: 16, name: "Sellador de Fisuras", category: "Prevención", price: 48.00, stock: 35, img: "🔒" },
  { id: 17, name: "Agua Oxigenada Dental", category: "Tratamiento", price: 11.00, stock: 140, img: "🫧" },
  { id: 18, name: "Raspador Lingual", category: "Higiene", price: 7.50, stock: 220, img: "👅" },
];

const CHAT_FLOW = [
  { id: "start", bot: "¡Hola! Soy DentAI 🦷 Tu asistente dental. ¿Qué servicio deseas agendar?", options: SERVICES.map(s => s.title) },
  { id: "name", bot: "Perfecto. ¿Cuál es tu nombre completo?", type: "input" },
  { id: "date", bot: "¿Qué fecha prefieres para tu cita? (DD/MM/AAAA)", type: "input" },
  { id: "time", bot: "¿A qué hora? Disponibles:", options: ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"] },
  { id: "confirm", bot: null, type: "confirm" },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --turquoise: #00BCD4;
    --turquoise-dark: #0097A7;
    --turquoise-light: #B2EBF2;
    --turquoise-ultra: #E0F7FA;
    --white: #FFFFFF;
    --off-white: #F8FDFE;
    --text: #1A3340;
    --text-light: #5A8A99;
    --gold: #C9A84C;
    --shadow: 0 8px 32px rgba(0,188,212,0.15);
    --shadow-lg: 0 20px 60px rgba(0,188,212,0.2);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--off-white); color: var(--text); overflow-x: hidden; }

  /* NAV */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,188,212,0.15);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 72px;
    box-shadow: 0 2px 20px rgba(0,188,212,0.1);
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .nav-logo-icon { width: 42px; height: 42px; background: linear-gradient(135deg, var(--turquoise), var(--turquoise-dark)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 4px 12px rgba(0,188,212,0.35); }
  .nav-logo-text { font-family: 'Playfair Display', serif; font-size: 55px; font-weight: 700; color: var(--text); }
  .nav-logo-text span { color: var(--turquoise); }
  .nav-links { display: flex; gap: 6px; }
  .nav-btn {
    padding: 8px 20px; border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.25s ease; letter-spacing: 0.3px;
  }
  .nav-btn-ghost { background: transparent; color: var(--text-light); }
  .nav-btn-ghost:hover { background: var(--turquoise-ultra); color: var(--turquoise-dark); }
  .nav-btn-active { background: var(--turquoise); color: white; box-shadow: 0 4px 14px rgba(0,188,212,0.4); }
  .cart-btn {
    position: relative; padding: 8px 20px; border-radius: 50px;
    background: white; border: 1.5px solid var(--turquoise); color: var(--turquoise);
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.25s ease;
  }
  .cart-btn:hover { background: var(--turquoise); color: white; box-shadow: 0 4px 14px rgba(0,188,212,0.35); }
  .cart-badge {
    position: absolute; top: -6px; right: -6px; width: 20px; height: 20px;
    background: var(--gold); color: white; border-radius: 50%;
    font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center;
  }

  /* PAGE */
  .page { min-height: 100vh; padding-top: 72px; }

  /* HERO */
  .hero {
    min-height: calc(100vh - 72px);
    background: linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 40%, #ffffff 70%);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; padding: 60px 40px;
  }
  .hero-bg-circle1 {
    position: absolute; top: -100px; right: -100px; width: 500px; height: 500px;
    border-radius: 50%; background: radial-gradient(circle, rgba(0,188,212,0.12), transparent);
    animation: float1 8s ease-in-out infinite;
  }
  .hero-bg-circle2 {
    position: absolute; bottom: -80px; left: -80px; width: 400px; height: 400px;
    border-radius: 50%; background: radial-gradient(circle, rgba(0,151,167,0.1), transparent);
    animation: float2 10s ease-in-out infinite;
  }
  @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-20px,20px) scale(1.05)} }
  @keyframes float2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-20px) scale(1.08)} }

  .hero-content { max-width: 580px; z-index: 2; }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(0,188,212,0.12); border: 1px solid rgba(0,188,212,0.3);
    border-radius: 50px; padding: 6px 18px; font-size: 13px; color: var(--turquoise-dark);
    font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 24px;
  }
  .hero-title {
    font-family: 'Playfair Display', serif; font-size: clamp(38px, 5vw, 58px);
    font-weight: 700; line-height: 1.15; color: var(--text); margin-bottom: 20px;
  }
  .hero-title span { color: var(--turquoise); }
  .hero-desc { font-size: 17px; color: var(--text-light); line-height: 1.7; margin-bottom: 36px; font-weight: 400; }
  .hero-cta {
    display: flex; gap: 14px; flex-wrap: wrap;
  }
  .btn-primary {
    padding: 14px 32px; background: linear-gradient(135deg, var(--turquoise), var(--turquoise-dark));
    color: white; border: none; border-radius: 50px; font-family: 'DM Sans', sans-serif;
    font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 6px 20px rgba(0,188,212,0.4);
    transition: all 0.3s ease; letter-spacing: 0.3px;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,188,212,0.5); }
  .btn-secondary {
    padding: 14px 32px; background: white; color: var(--turquoise-dark); border: 1.5px solid var(--turquoise);
    border-radius: 50px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: all 0.3s ease;
  }
  .btn-secondary:hover { background: var(--turquoise-ultra); transform: translateY(-2px); }

  /* FLOATERS */
  .floaters { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
  .floater {
    position: absolute; font-size: 36px; opacity: 0.65;
    animation: floatEl 6s ease-in-out infinite;
  }
  .floater:nth-child(1) { top: 15%; right: 12%; animation-delay: 0s; font-size: 48px; }
  .floater:nth-child(2) { top: 65%; right: 20%; animation-delay: 1.5s; font-size: 32px; }
  .floater:nth-child(3) { top: 30%; right: 32%; animation-delay: 3s; font-size: 28px; }
  .floater:nth-child(4) { top: 75%; right: 5%; animation-delay: 0.8s; font-size: 40px; }
  .floater:nth-child(5) { top: 10%; right: 45%; animation-delay: 2s; font-size: 24px; }
  @keyframes floatEl {
    0%,100%{transform:translateY(0px) rotate(0deg)}
    33%{transform:translateY(-18px) rotate(5deg)}
    66%{transform:translateY(8px) rotate(-3deg)}
  }

  /* STATS */
  .stats-bar {
    background: linear-gradient(135deg, var(--turquoise-dark), var(--turquoise));
    padding: 32px 60px; display: flex; justify-content: center; gap: 80px; flex-wrap: wrap;
  }
  .stat { text-align: center; color: white; }
  .stat-num { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; }
  .stat-label { font-size: 13px; opacity: 0.85; font-weight: 400; letter-spacing: 0.5px; margin-top: 4px; }

  /* SERVICES GRID */
  .section { padding: 80px 60px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
  .section-sub { color: var(--text-light); font-size: 16px; margin-bottom: 48px; }
  .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
  .service-card {
    background: white; border-radius: 20px; padding: 32px 28px;
    border: 1px solid rgba(0,188,212,0.12); transition: all 0.35s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.04);
    position: relative; overflow: hidden;
  }
  .service-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--turquoise), var(--turquoise-dark));
    transform: scaleX(0); transform-origin: left; transition: transform 0.35s ease;
  }
  .service-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: rgba(0,188,212,0.3); }
  .service-card:hover::before { transform: scaleX(1); }
  .service-icon { font-size: 42px; margin-bottom: 16px; display: block; }
  .service-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; margin-bottom: 10px; color: var(--text); }
  .service-desc { font-size: 14px; color: var(--text-light); line-height: 1.65; margin-bottom: 18px; }
  .service-price { font-size: 22px; font-weight: 700; color: var(--turquoise-dark); }

  /* CHATBOT */
  .chatbot-section {
    background: linear-gradient(135deg, #E0F7FA, #F8FDFE);
    padding: 60px; border-top: 1px solid rgba(0,188,212,0.1);
  }
  .chat-container {
    max-width: 680px; margin: 0 auto;
    background: white; border-radius: 28px; overflow: hidden;
    box-shadow: var(--shadow-lg); border: 1px solid rgba(0,188,212,0.15);
  }
  .chat-header {
    background: linear-gradient(135deg, var(--turquoise-dark), var(--turquoise));
    padding: 22px 28px; display: flex; align-items: center; gap: 14px;
  }
  .chat-avatar { width: 46px; height: 46px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .chat-header-info h3 { color: white; font-size: 17px; font-weight: 600; }
  .chat-header-info p { color: rgba(255,255,255,0.75); font-size: 13px; }
  .chat-online { width: 10px; height: 10px; background: #4CAF50; border-radius: 50%; border: 2px solid white; margin-left: auto; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  .chat-messages { height: 340px; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 14px; }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: var(--turquoise-light); border-radius: 4px; }
  .msg { display: flex; gap: 10px; align-items: flex-end; }
  .msg-bot { justify-content: flex-start; }
  .msg-user { justify-content: flex-end; flex-direction: row-reverse; }
  .msg-bubble {
    max-width: 75%; padding: 12px 18px; border-radius: 18px; font-size: 14px; line-height: 1.5;
  }
  .msg-bot .msg-bubble { background: var(--turquoise-ultra); color: var(--text); border-bottom-left-radius: 4px; }
  .msg-user .msg-bubble { background: linear-gradient(135deg, var(--turquoise), var(--turquoise-dark)); color: white; border-bottom-right-radius: 4px; }
  .msg-icon { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .msg-bot .msg-icon { background: var(--turquoise-light); }
  .msg-user .msg-icon { background: rgba(0,188,212,0.2); }
  .chat-options { display: flex; flex-wrap: wrap; gap: 8px; padding: 16px 24px; border-top: 1px solid var(--turquoise-ultra); }
  .chat-option {
    padding: 8px 16px; border-radius: 50px;
    background: var(--turquoise-ultra); border: 1px solid rgba(0,188,212,0.3);
    color: var(--turquoise-dark); font-size: 13px; font-weight: 500; cursor: pointer;
    transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .chat-option:hover { background: var(--turquoise); color: white; border-color: var(--turquoise); }
  .chat-input-row { display: flex; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--turquoise-ultra); }
  .chat-input {
    flex: 1; padding: 12px 18px; border-radius: 50px;
    border: 1.5px solid rgba(0,188,212,0.3); font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s; color: var(--text); background: var(--off-white);
  }
  .chat-input:focus { border-color: var(--turquoise); }
  .chat-send {
    width: 46px; height: 46px; border-radius: 50%; background: linear-gradient(135deg, var(--turquoise), var(--turquoise-dark));
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,188,212,0.35);
  }
  .chat-send:hover { transform: scale(1.08); box-shadow: 0 6px 16px rgba(0,188,212,0.45); }

  /* CALENDAR PAGE */
  .calendar-wrapper { padding: 40px 60px; }
  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
  .cal-header-cell {
    padding: 12px; text-align: center; font-size: 13px; font-weight: 600;
    color: var(--turquoise-dark); background: var(--turquoise-ultra); border-radius: 8px;
  }
  .cal-cell {
    min-height: 90px; background: white; border-radius: 10px; padding: 10px;
    border: 1px solid rgba(0,188,212,0.1); transition: all 0.2s; cursor: default;
  }
  .cal-cell.has-appt { border-color: var(--turquoise); background: linear-gradient(135deg, #F0FBFD, white); }
  .cal-cell.other-month { opacity: 0.35; }
  .cal-day-num { font-size: 13px; font-weight: 600; color: var(--text-light); margin-bottom: 6px; }
  .cal-day-num.today {
    width: 26px; height: 26px; background: var(--turquoise); color: white;
    border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;
  }
  .cal-appt {
    background: linear-gradient(90deg, var(--turquoise), var(--turquoise-dark));
    color: white; border-radius: 6px; padding: 3px 7px; font-size: 10px; font-weight: 500;
    margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .appts-list { display: flex; flex-direction: column; gap: 14px; }
  .appt-card {
    background: white; border-radius: 16px; padding: 20px 24px;
    border: 1px solid rgba(0,188,212,0.15); display: flex; align-items: center; gap: 20px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04); transition: all 0.25s;
  }
  .appt-card:hover { transform: translateX(4px); border-color: var(--turquoise); }
  .appt-avatar { width: 50px; height: 50px; border-radius: 14px; background: var(--turquoise-ultra); display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .appt-info h4 { font-size: 16px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .appt-info p { font-size: 13px; color: var(--text-light); }
  .appt-badge { margin-left: auto; padding: 6px 14px; background: var(--turquoise-ultra); color: var(--turquoise-dark); border-radius: 50px; font-size: 12px; font-weight: 600; }
  .cal-nav { display: flex; align-items: center; gap: 20px; margin-bottom: 28px; }
  .cal-nav-btn { width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid rgba(0,188,212,0.3); background: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; color: var(--turquoise); }
  .cal-nav-btn:hover { background: var(--turquoise); color: white; border-color: var(--turquoise); }
  .cal-month { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: var(--text); }

  /* PRODUCTS PAGE */
  .products-wrapper { padding: 40px 60px; }
  .products-toolbar { display: flex; gap: 14px; margin-bottom: 32px; flex-wrap: wrap; align-items: center; }
  .toolbar-input {
    padding: 11px 18px; border-radius: 50px; border: 1.5px solid rgba(0,188,212,0.3);
    font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; min-width: 220px;
    transition: border-color 0.2s; color: var(--text); background: white;
  }
  .toolbar-input:focus { border-color: var(--turquoise); }
  .products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .product-card {
    background: white; border-radius: 18px; padding: 24px 20px;
    border: 1px solid rgba(0,188,212,0.12); transition: all 0.3s;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04); display: flex; flex-direction: column;
  }
  .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); border-color: rgba(0,188,212,0.3); }
  .product-icon { font-size: 44px; text-align: center; margin-bottom: 14px; }
  .product-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; text-align: center; line-height: 1.4; }
  .product-cat { font-size: 11px; color: var(--turquoise-dark); background: var(--turquoise-ultra); border-radius: 50px; padding: 3px 10px; text-align: center; width: fit-content; margin: 0 auto 12px; font-weight: 500; }
  .product-price { font-size: 20px; font-weight: 700; color: var(--turquoise-dark); text-align: center; margin-bottom: 4px; }
  .product-stock { font-size: 11px; color: var(--text-light); text-align: center; margin-bottom: 14px; }
  .product-actions { display: flex; gap: 8px; margin-top: auto; }
  .btn-add-cart { flex: 1; padding: 9px; background: linear-gradient(135deg, var(--turquoise), var(--turquoise-dark)); color: white; border: none; border-radius: 50px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .btn-add-cart:hover { box-shadow: 0 4px 12px rgba(0,188,212,0.4); transform: scale(1.02); }
  .btn-edit { padding: 9px 14px; background: var(--turquoise-ultra); color: var(--turquoise-dark); border: none; border-radius: 50px; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .btn-edit:hover { background: var(--turquoise-light); }
  .pagination { display: flex; gap: 8px; justify-content: center; margin-top: 32px; }
  .pg-btn {
    width: 40px; height: 40px; border-radius: 50%; border: 1.5px solid rgba(0,188,212,0.3);
    background: white; cursor: pointer; font-size: 14px; font-weight: 600; color: var(--text-light);
    display: flex; align-items: center; justify-content: center; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .pg-btn.active { background: var(--turquoise); color: white; border-color: var(--turquoise); box-shadow: 0 4px 12px rgba(0,188,212,0.35); }
  .pg-btn:hover:not(.active) { border-color: var(--turquoise); color: var(--turquoise); }

  /* CART DRAWER */
  .cart-overlay { position: fixed; inset: 0; background: rgba(26,51,64,0.5); z-index: 2000; backdrop-filter: blur(4px); }
  .cart-drawer {
    position: fixed; right: 0; top: 0; bottom: 0; width: 400px;
    background: white; z-index: 2001; box-shadow: -8px 0 40px rgba(0,0,0,0.12);
    display: flex; flex-direction: column; animation: slideIn 0.3s ease;
  }
  @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
  .cart-drawer-header { padding: 28px 28px 20px; border-bottom: 1px solid var(--turquoise-ultra); display: flex; align-items: center; justify-content: space-between; }
  .cart-drawer-header h2 { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text); }
  .cart-close { width: 36px; height: 36px; border-radius: 50%; border: none; background: var(--turquoise-ultra); cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; color: var(--turquoise-dark); }
  .cart-items { flex: 1; overflow-y: auto; padding: 20px 28px; display: flex; flex-direction: column; gap: 14px; }
  .cart-item { display: flex; gap: 14px; align-items: center; padding: 14px; background: var(--off-white); border-radius: 14px; }
  .cart-item-icon { font-size: 30px; width: 48px; text-align: center; }
  .cart-item-info { flex: 1; }
  .cart-item-info h4 { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .cart-item-price { font-size: 15px; font-weight: 700; color: var(--turquoise-dark); }
  .qty-ctrl { display: flex; align-items: center; gap: 8px; }
  .qty-btn { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid rgba(0,188,212,0.4); background: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; color: var(--turquoise-dark); transition: all 0.2s; }
  .qty-btn:hover { background: var(--turquoise); color: white; }
  .qty-num { font-size: 14px; font-weight: 700; min-width: 20px; text-align: center; }
  .cart-footer { padding: 20px 28px; border-top: 1px solid var(--turquoise-ultra); }
  .cart-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
  .cart-total span:first-child { font-size: 15px; color: var(--text-light); }
  .cart-total span:last-child { font-size: 24px; font-weight: 700; color: var(--text); font-family: 'Playfair Display', serif; }
  .btn-checkout { width: 100%; padding: 16px; background: linear-gradient(135deg, var(--turquoise), var(--turquoise-dark)); color: white; border: none; border-radius: 50px; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 6px 20px rgba(0,188,212,0.4); transition: all 0.3s; }
  .btn-checkout:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,188,212,0.5); }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(26,51,64,0.6); z-index: 3000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
  .modal { background: white; border-radius: 24px; padding: 36px; width: 440px; max-width: 90vw; box-shadow: 0 24px 60px rgba(0,0,0,0.15); animation: fadeUp 0.3s ease; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .modal h2 { font-family: 'Playfair Display', serif; font-size: 24px; margin-bottom: 24px; color: var(--text); }
  .form-group { margin-bottom: 18px; }
  .form-label { font-size: 13px; font-weight: 600; color: var(--text-light); margin-bottom: 6px; display: block; letter-spacing: 0.3px; }
  .form-control {
    width: 100%; padding: 12px 16px; border-radius: 12px;
    border: 1.5px solid rgba(0,188,212,0.25); font-family: 'DM Sans', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s; color: var(--text);
  }
  .form-control:focus { border-color: var(--turquoise); }
  .modal-actions { display: flex; gap: 12px; margin-top: 24px; }
  .btn-cancel { flex: 1; padding: 12px; background: var(--turquoise-ultra); color: var(--turquoise-dark); border: none; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; }
  .btn-save { flex: 2; padding: 12px; background: linear-gradient(135deg, var(--turquoise), var(--turquoise-dark)); color: white; border: none; border-radius: 50px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; box-shadow: 0 4px 14px rgba(0,188,212,0.4); }

  /* TOAST */
  .toast {
    position: fixed; bottom: 28px; right: 28px; z-index: 9999;
    background: linear-gradient(135deg, var(--turquoise-dark), var(--turquoise));
    color: white; padding: 14px 22px; border-radius: 14px;
    font-size: 14px; font-weight: 500; box-shadow: 0 8px 24px rgba(0,188,212,0.45);
    animation: toastIn 0.3s ease;
  }
  @keyframes toastIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* PAGE HEADER */
  .page-hero {
    background: linear-gradient(135deg, var(--turquoise-ultra), #F8FDFE);
    padding: 52px 60px 40px;
    border-bottom: 1px solid rgba(0,188,212,0.12);
  }
  .page-hero h1 { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
  .page-hero p { color: var(--text-light); font-size: 15px; }

  @media (max-width: 900px) {
    .products-grid { grid-template-columns: repeat(2,1fr); }
    .nav { padding: 0 20px; }
    .section, .calendar-wrapper, .products-wrapper { padding: 40px 20px; }
    .stats-bar { gap: 40px; padding: 28px 20px; }
    .chatbot-section { padding: 40px 20px; }
    .hero { padding: 40px 20px; }
    .cart-drawer { width: 100%; }
  }
  .styled-image {
  height: 55px;
  }
`;

// ─── Axios implement─────────────────────────────────────────────────────────────────

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Petición al endpoint de Node.js
    axios.get('http://localhost:5000/api/paises')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Hubo un error al obtener los usuarios:", error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getDaysInMonth(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const days = [];
  for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevMonthDays - i, current: false });
  for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, current: true });
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) days.push({ day: i, current: false });
  return days;
}

const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS_ES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

// ─── CHATBOT ─────────────────────────────────────────────────────────────────

function Chatbot({ onAppointmentCreated }) {
  const [messages, setMessages] = useState([{ role: "bot", text: CHAT_FLOW[0].bot }]);
  const [step, setStep] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [data, setData] = useState({});
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const pushBot = (text) => setMessages(m => [...m, { role: "bot", text }]);
  const pushUser = (text) => setMessages(m => [...m, { role: "user", text }]);

  const handleOption = (opt) => {
    pushUser(opt);
    if (step === 0) {
      setData(d => ({ ...d, service: opt }));
      setStep(1);
      setTimeout(() => pushBot(CHAT_FLOW[1].bot), 400);
    } else if (step === 3) {
      const newData = { ...data, time: opt };
      setData(newData);
      setStep(4);
      setTimeout(() => pushBot(`✅ Resumen de tu cita:\n\n🦷 Servicio: ${newData.service}\n👤 Nombre: ${newData.name}\n📅 Fecha: ${newData.date}\n⏰ Hora: ${opt}\n\n¿Confirmamos tu cita?`), 400);
    }
  };

  const handleInput = () => {
    if (!inputVal.trim()) return;
    const val = inputVal.trim();
    pushUser(val);
    setInputVal("");
    if (step === 1) {
      setData(d => ({ ...d, name: val }));
      setStep(2);
      setTimeout(() => pushBot(CHAT_FLOW[2].bot), 400);
    } else if (step === 2) {
      setData(d => ({ ...d, date: val }));
      setStep(3);
      setTimeout(() => pushBot(CHAT_FLOW[3].bot), 400);
    }
  };

  const handleConfirm = (yes) => {
    if (yes) {
      onAppointmentCreated({ ...data, id: Date.now() });
      pushUser("Sí, confirmar");
      setTimeout(() => {
        pushBot("🎉 ¡Cita agendada con éxito! Te esperamos. Puedes ver tu cita en la sección de Calendario.");
        setStep(5);
      }, 400);
    } else {
      pushUser("No, cancelar");
      setTimeout(() => {
        pushBot("Entendido. Puedes comenzar de nuevo cuando quieras. 😊");
        setStep(5);
      }, 400);
    }
  };

  const curFlow = CHAT_FLOW[step] || {};

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-avatar">🦷</div>
        <div className="chat-header-info">
          <h3>DentAI Asistente</h3>
          <p>Tu agente de citas inteligente</p>
        </div>
        <div className="chat-online" />
      </div>
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            <div className="msg-icon">{m.role === "bot" ? "🤖" : "👤"}</div>
            <div className="msg-bubble" style={{ whiteSpace: "pre-line" }}>{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      {step < 5 && (
        <>
          {curFlow.options && (
            <div className="chat-options">
              {curFlow.options.map(o => <button key={o} className="chat-option" onClick={() => handleOption(o)}>{o}</button>)}
            </div>
          )}
          {curFlow.type === "input" && (
            <div className="chat-input-row">
              <input className="chat-input" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === "Enter" && handleInput()} placeholder="Escribe aquí..." />
              <button className="chat-send" onClick={handleInput}>➤</button>
            </div>
          )}
          {curFlow.type === "confirm" && (
            <div className="chat-options">
              <button className="chat-option" style={{ background: "var(--turquoise)", color: "white" }} onClick={() => handleConfirm(true)}>✅ Sí, confirmar</button>
              <button className="chat-option" onClick={() => handleConfirm(false)}>❌ Cancelar</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

function HomePage({ appointments, onNewAppointment }) {
  return (
    <div className="page">
      <div className="hero">
        <div className="hero-bg-circle1" />
        <div className="hero-bg-circle2" />
        <div className="floaters">
          <span className="floater">🦷</span>
          <span className="floater">✨</span>
          <span className="floater">💎</span>
          <span className="floater">🔬</span>
          <span className="floater">🌿</span>
        </div>
        <div className="hero-content">
          <div className="hero-tag">⭐ Clínica Premium #1 en la ciudad</div>
          <h1 className="hero-title">Tu sonrisa perfecta comienza <span>aquí</span></h1>
          <p className="hero-desc">Ofrecemos tratamientos dentales de vanguardia con tecnología de última generación, en un ambiente cálido y profesional diseñado para ti.</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => document.getElementById("chatbot-section").scrollIntoView({ behavior: "smooth" })}>Agendar Cita</button>
            <button className="btn-secondary">Ver Servicios</button>
          </div>
        </div>
      </div>

      <div className="stats-bar">
        {[["12+", "Años de Experiencia"], ["8,500+", "Pacientes Satisfechos"], ["98%", "Tasa de Éxito"], ["15", "Especialistas"]].map(([n, l]) => (
          <div className="stat" key={l}><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>

      <div className="section">
        <h2 className="section-title">Nuestros Servicios</h2>
        <p className="section-sub">Tratamientos especializados para cada necesidad dental</p>
        <div className="services-grid">
          {SERVICES.map(s => (
            <div className="service-card" key={s.title}>
              <span className="service-icon">{s.icon}</span>
              <div className="service-title">{s.title}</div>
              <div className="service-desc">{s.desc}</div>
              <div className="service-price">{s.price}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="chatbot-section" id="chatbot-section">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 className="section-title">Agenda tu Cita</h2>
          <p className="section-sub">Nuestro asistente inteligente te guiará en el proceso</p>
        </div>
        <Chatbot onAppointmentCreated={onNewAppointment} />
      </div>
    </div>
  );
}

// ─── CALENDAR PAGE ────────────────────────────────────────────────────────────

function CalendarPage({ appointments }) {
  const now = new Date();
  const [calDate, setCalDate] = useState({ year: now.getFullYear(), month: now.getMonth() });

  const days = getDaysInMonth(calDate.year, calDate.month);

  const getAppts = (day, current) => {
    if (!current) return [];
    const d = String(day).padStart(2, "0");
    const m = String(calDate.month + 1).padStart(2, "0");
    return appointments.filter(a => {
      const parts = (a.date || "").split("/");
      return parts[0] === d && parts[1] === m;
    });
  };

  return (
    <div className="page">
      <div className="page-hero">
        <h1>📅 Calendario de Citas</h1>
        <p>Gestiona y visualiza todas las citas agendadas</p>
      </div>
      <div className="calendar-wrapper">
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={() => setCalDate(d => { const dt = new Date(d.year, d.month - 1); return { year: dt.getFullYear(), month: dt.getMonth() }; })}>‹</button>
          <div className="cal-month">{MONTHS_ES[calDate.month]} {calDate.year}</div>
          <button className="cal-nav-btn" onClick={() => setCalDate(d => { const dt = new Date(d.year, d.month + 1); return { year: dt.getFullYear(), month: dt.getMonth() }; })}>›</button>
        </div>
        <div className="calendar-grid" style={{ marginBottom: 32 }}>
          {DAYS_ES.map(d => <div key={d} className="cal-header-cell">{d}</div>)}
          {days.map((d, i) => {
            const appts = getAppts(d.day, d.current);
            const isToday = d.current && d.day === now.getDate() && calDate.month === now.getMonth() && calDate.year === now.getFullYear();
            return (
              <div key={i} className={`cal-cell ${appts.length ? "has-appt" : ""} ${!d.current ? "other-month" : ""}`}>
                <div className={`cal-day-num ${isToday ? "today" : ""}`}>{d.day}</div>
                {appts.map(a => <div key={a.id} className="cal-appt">⏰ {a.time} - {a.name?.split(" ")[0]}</div>)}
              </div>
            );
          })}
        </div>

        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 20, color: "var(--text)" }}>Próximas Citas ({appointments.length})</h3>
        {appointments.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-light)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📋</div>
            <p style={{ fontSize: 16 }}>No hay citas agendadas aún.</p>
          </div>
        ) : (
          <div className="appts-list">
            {appointments.map(a => (
              <div key={a.id} className="appt-card">
                <div className="appt-avatar">🦷</div>
                <div className="appt-info">
                  <h4>{a.name}</h4>
                  <p>📅 {a.date} &nbsp;⏰ {a.time}</p>
                  <p style={{ marginTop: 4, fontSize: 12, color: "var(--turquoise-dark)" }}>🔬 {a.service}</p>
                </div>
                <div className="appt-badge">Confirmada</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 16;

function ProductsPage({ cart, setCart }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | { mode: "add"|"edit", product? }
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", img: "🦷" });
  const [toast, setToast] = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const addToCart = (product) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      if (ex) return c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...c, { ...product, qty: 1 }];
    });
    showToast(`✅ ${product.name} añadido al carrito`);
  };

  const openAdd = () => { setForm({ name: "", category: "", price: "", stock: "", img: "🦷" }); setModal({ mode: "add" }); };
  const openEdit = (p) => { setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, img: p.img }); setModal({ mode: "edit", product: p }); };
  const saveProduct = () => {
    if (!form.name.trim()) return;
    if (modal.mode === "add") {
      setProducts(p => [...p, { id: Date.now(), name: form.name, category: form.category, price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0, img: form.img || "🦷" }]);
      showToast("✅ Producto agregado");
    } else {
      setProducts(p => p.map(x => x.id === modal.product.id ? { ...x, ...form, price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0 } : x));
      showToast("✅ Producto actualizado");
    }
    setModal(null);
  };

  const EMOJIS = ["🦷","🪥","💊","🔬","💧","🌿","⚡","❄️","✨","🛡️","💦","📦","🕯️","🔦","💎","🫧","👅","🔒","🔴","🧵"];

  return (
    <div className="page">
      <div className="page-hero">
        <h1>🛒 Catálogo Odontológico</h1>
        <p>Productos y equipos dentales de alta calidad</p>
      </div>
      <div className="products-wrapper">
        <div className="products-toolbar">
          <input className="toolbar-input" placeholder="🔍 Buscar producto o categoría..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <button className="btn-primary" onClick={openAdd}>+ Agregar Producto</button>
        </div>

        <div className="products-grid">
          {paginated.map(p => (
            <div className="product-card" key={p.id}>
              <div className="product-icon">{p.img}</div>
              <div className="product-name">{p.name}</div>
              <div className="product-cat">{p.category}</div>
              <div className="product-price">${p.price.toFixed(2)}</div>
              <div className="product-stock">Stock: {p.stock} unidades</div>
              <div className="product-actions">
                <button className="btn-add-cart" onClick={() => addToCart(p)}>🛒 Agregar</button>
                <button className="btn-edit" onClick={() => openEdit(p)}>✏️</button>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`pg-btn ${page === i + 1 ? "active" : ""}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <h2>{modal.mode === "add" ? "Agregar Producto" : "Editar Producto"}</h2>
            <div className="form-group">
              <label className="form-label">Ícono</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {EMOJIS.map(e => (
                  <span key={e} onClick={() => setForm(f => ({ ...f, img: e }))} style={{ fontSize: 24, cursor: "pointer", padding: 4, borderRadius: 8, background: form.img === e ? "var(--turquoise-ultra)" : "transparent", border: form.img === e ? "2px solid var(--turquoise)" : "2px solid transparent", transition: "all 0.2s" }}>{e}</span>
                ))}
              </div>
            </div>
            {[["Nombre del Producto", "name", "text"], ["Categoría", "category", "text"], ["Precio ($)", "price", "number"], ["Stock", "stock", "number"]].map(([label, key, type]) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label}</label>
                <input className="form-control" type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setModal(null)}>Cancelar</button>
              <button className="btn-save" onClick={saveProduct}>Guardar</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────

function CartDrawer({ cart, setCart, onClose }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const updateQty = (id, delta) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));

  return (
    <>
      <div className="cart-overlay" onClick={onClose} />
      <div className="cart-drawer">
        <div className="cart-drawer-header">
          <h2>🛒 Tu Carrito</h2>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-light)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
              <p>Tu carrito está vacío</p>
            </div>
          ) : cart.map(item => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-icon">{item.img}</div>
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
              </div>
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                <span className="qty-num">{item.qty}</span>
                <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total a pagar</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="btn-checkout" onClick={() => alert("¡Compra realizada! Gracias por tu pedido 🎉")}>Finalizar Compra →</button>
        </div>
      </div>
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [appointments, setAppointments] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [paises, setPaises] = useState([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleNewAppointment = (appt) => {
    setAppointments(a => [...a, appt]);
  };

  const NAV_ITEMS = [
    { id: "home", label: "🏠 Inicio" },
    { id: "calendar", label: "📅 Calendario" },
    { id: "products", label: "🛒 Productos" },
  ];

  
  useEffect(() => { 
    axios.get('http://localhost:5000/api/paises').then(response => {setPaises(response.data)}).catch(error => {console.error("Error al obtener datos", error);});},[]);

  return (
    <>
      <style>{css}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("home")}>
          <div ><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJ-14Kq8pbsa-hiNP4j1lwIBIN9lyl9WasMQ&s" class="styled-image"></img></div>
          <div className="nav-logo-text">Muril<span>Dental</span></div>
        </div>
        <div className="nav-links">
          {NAV_ITEMS.map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? "nav-btn-active" : "nav-btn-ghost"}`} onClick={() => setPage(n.id)}>{n.label}</button>
          ))}
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 Carrito
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
        

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Elemento</th>
              {/* Añade más encabezados según la estructura de tus datos */}
            </tr>
          </thead>
          <tbody>
            {paises.map(pais => (
              <tr key={pais.Code}>
                <td>{pais.Name}</td>
                <td>{pais.Continent}</td>
                {/* Añade más celdas según la estructura de tus datos */}
              </tr>
            ))}
            
          </tbody>
        </table>
        <div>
          <h1>Lista de Paises</h1>
          <ul>
            {paises.map(pais => (
              <li key={pais.Code}>{pais.Name} ({pais.Continent})</li>
            ))}
          </ul>
        </div>

        
      </nav>

      {page === "home" && <HomePage appointments={appointments} onNewAppointment={handleNewAppointment} />}
      {page === "calendar" && <CalendarPage appointments={appointments} />}
      {page === "products" && <ProductsPage cart={cart} setCart={setCart} />}

      {cartOpen && <CartDrawer cart={cart} setCart={setCart} onClose={() => setCartOpen(false)} />}
    </>
  );
}
