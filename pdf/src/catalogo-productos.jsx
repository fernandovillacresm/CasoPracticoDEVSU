import { useState, useRef } from "react";

const TECH_SVG_BG = `
<svg xmlns='http://www.w3.org/2000/svg' width='900' height='900' viewBox='0 0 900 900'>
  <defs>
    <filter id='blur' x='-20%' y='-20%' width='140%' height='140%'>
      <feGaussianBlur stdDeviation='12'/>
    </filter>
  </defs>
  <rect width='900' height='900' fill='%230a0f1e'/>
  <!-- Circuit lines -->
  <g stroke='%2300e5ff' stroke-width='1.5' opacity='0.18' fill='none' filter='url(%23blur)'>
    <line x1='50' y1='100' x2='300' y2='100'/><line x1='300' y1='100' x2='300' y2='250'/>
    <line x1='300' y1='250' x2='500' y2='250'/><line x1='500' y1='250' x2='500' y2='80'/>
    <line x1='500' y1='80' x2='750' y2='80'/><line x1='750' y1='80' x2='750' y2='300'/>
    <line x1='100' y1='400' x2='400' y2='400'/><line x1='400' y1='400' x2='400' y2='600'/>
    <line x1='400' y1='600' x2='700' y2='600'/><line x1='700' y1='600' x2='700' y2='450'/>
    <line x1='200' y1='750' x2='600' y2='750'/><line x1='600' y1='750' x2='600' y2='850'/>
    <line x1='50' y1='550' x2='200' y2='550'/><line x1='820' y1='200' x2='820' y2='500'/>
    <line x1='820' y1='500' x2='680' y2='500'/>
  </g>
  <!-- Nodes / chips -->
  <g fill='%2300e5ff' opacity='0.22' filter='url(%23blur)'>
    <rect x='280' y='80' width='40' height='40' rx='4'/>
    <rect x='480' y='60' width='40' height='40' rx='4'/>
    <rect x='730' y='260' width='40' height='40' rx='4'/>
    <rect x='380' y='380' width='40' height='40' rx='4'/>
    <rect x='680' y='430' width='40' height='40' rx='4'/>
    <rect x='580' y='730' width='40' height='40' rx='4'/>
    <rect x='800' y='180' width='40' height='40' rx='4'/>
  </g>
  <!-- CPU icon rough -->
  <g fill='none' stroke='%2300e5ff' stroke-width='2' opacity='0.14' filter='url(%23blur)'>
    <rect x='360' y='360' width='120' height='120' rx='8'/>
    <line x1='380' y1='360' x2='380' y2='340'/><line x1='400' y1='360' x2='400' y2='340'/>
    <line x1='420' y1='360' x2='420' y2='340'/><line x1='440' y1='360' x2='440' y2='340'/>
    <line x1='460' y1='360' x2='460' y2='340'/>
    <line x1='380' y1='480' x2='380' y2='500'/><line x1='400' y1='480' x2='400' y2='500'/>
    <line x1='420' y1='480' x2='420' y2='500'/><line x1='440' y1='480' x2='440' y2='500'/>
    <line x1='460' y1='480' x2='460' y2='500'/>
    <line x1='360' y1='380' x2='340' y2='380'/><line x1='360' y1='400' x2='340' y2='400'/>
    <line x1='360' y1='420' x2='340' y2='420'/><line x1='360' y1='440' x2='340' y2='440'/>
    <line x1='480' y1='380' x2='500' y2='380'/><line x1='480' y1='400' x2='500' y2='400'/>
    <line x1='480' y1='420' x2='500' y2='420'/><line x1='480' y1='440' x2='500' y2='440'/>
    <rect x='395' y='395' width='50' height='50' rx='4'/>
  </g>
  <!-- Glow dots -->
  <g opacity='0.3' filter='url(%23blur)'>
    <circle cx='300' cy='100' r='6' fill='%2300e5ff'/>
    <circle cx='500' cy='250' r='6' fill='%2300e5ff'/>
    <circle cx='750' cy='300' r='6' fill='%2300e5ff'/>
    <circle cx='400' cy='600' r='6' fill='%2300e5ff'/>
    <circle cx='700' cy='450' r='6' fill='%2300e5ff'/>
    <circle cx='600' cy='750' r='6' fill='%2300e5ff'/>
    <circle cx='820' cy='500' r='6' fill='%2300e5ff'/>
    <circle cx='50' cy='550' r='5' fill='%2300e5ff'/>
  </g>
  <!-- Scanlines subtle -->
  <rect width='900' height='900' fill='url(%23scan)' opacity='0.04'/>
  <defs>
    <pattern id='scan' width='900' height='4' patternUnits='userSpaceOnUse'>
      <rect width='900' height='2' fill='%23000'/>
    </pattern>
  </defs>
</svg>`;

const BG_URL = `data:image/svg+xml,${TECH_SVG_BG}`;

const SAMPLE_PRODUCTS = [
  { id: 1, name: "MacBook Pro M3", price: 2499.99, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" },
  { id: 2, name: "RTX 4090 GPU", price: 1799.00, image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80" },
  { id: 3, name: "Monitor 4K UltraWide", price: 649.99, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80" },
  { id: 4, name: "Teclado Mecánico RGB", price: 189.00, image: "https://images.unsplash.com/photo-1561112078-7d24e04c3407?w=400&q=80" },
  { id: 5, name: "Auriculares Gaming Pro", price: 299.99, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80" },
];

let nextId = 6;

const ITEMS_PER_PAGE = 4;

const emptyForm = { name: "", price: "", image: "" };

export default function App() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | 'create' | 'edit'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const fileRef = useRef();

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginated = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Nombre requerido";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Precio válido requerido";
    return e;
  };

  const openCreate = () => {
    setForm(emptyForm);
    setImagePreview("");
    setErrors({});
    setModal("create");
  };

  const openEdit = (p) => {
    setForm({ name: p.name, price: p.price, image: p.image });
    setImagePreview(p.image);
    setEditId(p.id);
    setErrors({});
    setModal("edit");
  };

  const closeModal = () => { setModal(null); setEditId(null); setErrors({}); };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (modal === "create") {
      setProducts(prev => [...prev, { id: nextId++, name: form.name.trim(), price: parseFloat(form.price), image: form.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" }]);
      const newTotal = products.length + 1;
      setPage(Math.ceil(newTotal / ITEMS_PER_PAGE));
    } else {
      setProducts(prev => prev.map(p => p.id === editId ? { ...p, name: form.name.trim(), price: parseFloat(form.price), image: form.image || p.image } : p));
    }
    closeModal();
  };

  const handleDelete = (id) => {
    const newProds = products.filter(p => p.id !== id);
    setProducts(newProds);
    const newTotal = newProds.length;
    const maxPage = Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE));
    if (page > maxPage) setPage(maxPage);
    setDeleteConfirm(null);
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImagePreview(ev.target.result); setForm(f => ({ ...f, image: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `url("${BG_URL}") center/cover fixed`,
      fontFamily: "'Rajdhani', 'Orbitron', monospace",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(5,8,20,0.72)", zIndex: 0 }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Rajdhani:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #00e5ff44; border-radius: 3px; }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 0 40px #00e5ff33, 0 16px 40px rgba(0,0,0,0.6) !important; }
        .btn-primary { background: linear-gradient(135deg, #00e5ff, #0077cc); color: #000; border: none; border-radius: 6px; padding: 10px 22px; font-family: 'Orbitron', monospace; font-weight: 600; font-size: 13px; cursor: pointer; letter-spacing: 1px; transition: opacity 0.2s, transform 0.15s; }
        .btn-primary:hover { opacity: 0.88; transform: scale(1.04); }
        .btn-danger { background: linear-gradient(135deg, #ff2d55, #cc0022); color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-family: 'Orbitron', monospace; font-weight: 600; font-size: 12px; cursor: pointer; transition: opacity 0.2s; }
        .btn-danger:hover { opacity: 0.82; }
        .btn-ghost { background: rgba(0,229,255,0.08); color: #00e5ff; border: 1px solid #00e5ff44; border-radius: 6px; padding: 8px 16px; font-family: 'Rajdhani', monospace; font-weight: 600; font-size: 13px; cursor: pointer; transition: background 0.2s; }
        .btn-ghost:hover { background: rgba(0,229,255,0.18); }
        .input-field { background: rgba(255,255,255,0.05); border: 1px solid #00e5ff33; border-radius: 8px; padding: 10px 14px; color: #e0f7ff; font-family: 'Rajdhani', monospace; font-size: 15px; width: 100%; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: #00e5ff88; background: rgba(0,229,255,0.06); }
        .input-field::placeholder { color: #4a7a8a; }
        .page-btn { width: 36px; height: 36px; border-radius: 6px; border: 1px solid #00e5ff33; background: rgba(0,229,255,0.07); color: #00e5ff; font-family: 'Orbitron', monospace; font-size: 13px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .page-btn:hover { background: rgba(0,229,255,0.2); }
        .page-btn.active { background: linear-gradient(135deg, #00e5ff, #0077cc); color: #000; border-color: transparent; font-weight: 700; }
        .badge { display: inline-block; background: rgba(0,229,255,0.12); color: #00e5ff; border: 1px solid #00e5ff33; border-radius: 4px; padding: 2px 8px; font-size: 11px; letter-spacing: 1px; font-family: 'Orbitron', monospace; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes pulse-border { 0%,100% { border-color: #00e5ff33; } 50% { border-color: #00e5ffaa; } }
        .card-anim { animation: fadeIn 0.3s ease forwards; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,5,0.85); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
        .modal-box { background: linear-gradient(145deg, #0d1528, #111c35); border: 1px solid #00e5ff33; border-radius: 16px; padding: 32px; width: 100%; max-width: 480px; animation: fadeIn 0.2s ease; box-shadow: 0 0 60px rgba(0,229,255,0.1), 0 24px 48px rgba(0,0,0,0.7); }
        .corner-tl { position: absolute; top: 0; left: 0; width: 20px; height: 20px; border-top: 2px solid #00e5ff; border-left: 2px solid #00e5ff; border-radius: 4px 0 0 0; }
        .corner-br { position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; border-bottom: 2px solid #00e5ff; border-right: 2px solid #00e5ff; border-radius: 0 0 4px 0; }
        .scan-line { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #00e5ff44, transparent); animation: scanMove 3s linear infinite; pointer-events: none; }
        @keyframes scanMove { from { top: 0; } to { top: 100%; } }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ display: "inline-block", marginBottom: 8 }}>
            <span className="badge">SISTEMA DE INVENTARIO</span>
          </div>
          <h1 style={{ fontFamily: "'Orbitron', monospace", fontSize: "clamp(26px,5vw,42px)", fontWeight: 800, color: "#fff", letterSpacing: "3px", textShadow: "0 0 30px rgba(0,229,255,0.5)", lineHeight: 1.1 }}>
            CATÁLOGO<br />
            <span style={{ background: "linear-gradient(90deg, #00e5ff, #0077cc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TECNOLÓGICO</span>
          </h1>
          <p style={{ color: "#4a7a8a", fontFamily: "'Rajdhani', monospace", fontSize: 16, marginTop: 10, letterSpacing: 2 }}>
            {products.length} PRODUCTO{products.length !== 1 ? "S" : ""} REGISTRADO{products.length !== 1 ? "S" : ""}
          </p>
          <div style={{ marginTop: 6, height: 1, background: "linear-gradient(90deg, transparent, #00e5ff44, transparent)" }} />
        </div>

        {/* Add button */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
          <button className="btn-primary" onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> NUEVO PRODUCTO
          </button>
        </div>

        {/* Grid 2x2 */}
        {paginated.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "#2a4a5a" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <p style={{ fontFamily: "'Orbitron', monospace", letterSpacing: 2, fontSize: 14 }}>NO HAY PRODUCTOS</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {paginated.map((p, i) => (
              <div key={p.id} className="card-hover card-anim" style={{
                animationDelay: `${i * 0.07}s`,
                background: "linear-gradient(145deg, rgba(13,21,40,0.95), rgba(10,15,30,0.98))",
                border: "1px solid #00e5ff22",
                borderRadius: 14,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              }}>
                <div className="scan-line" style={{ opacity: 0.4 }} />
                <div className="corner-tl" /><div className="corner-br" />

                {/* Image */}
                <div style={{ position: "relative", height: 180, overflow: "hidden", background: "#040810" }}>
                  <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, filter: "brightness(0.9) saturate(1.1)" }} onError={e => { e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(8,12,28,0.95))" }} />
                  <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", border: "1px solid #00e5ff44", borderRadius: 20, padding: "3px 10px", color: "#00e5ff", fontFamily: "'Orbitron', monospace", fontSize: 12 }}>
                    #{String(p.id).padStart(3, "0")}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: "16px 18px 18px" }}>
                  <h3 style={{ fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 600, color: "#e0f7ff", letterSpacing: 1, marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</h3>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, fontWeight: 800, background: "linear-gradient(90deg, #00e5ff, #0077cc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 14 }}>
                    ${p.price.toFixed(2)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: "7px 10px", letterSpacing: 1 }} onClick={() => openEdit(p)}>✏ EDITAR</button>
                    <button className="btn-danger" style={{ fontSize: 12, padding: "7px 12px", letterSpacing: 1 }} onClick={() => setDeleteConfirm(p)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
            {/* Fill empty slot if odd */}
            {paginated.length % 2 !== 0 && (
              <div style={{ border: "1px dashed #00e5ff11", borderRadius: 14, minHeight: 320, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "border-color 0.2s" }} onClick={openCreate}>
                <span style={{ color: "#1a3a4a", fontFamily: "'Orbitron', monospace", fontSize: 13, letterSpacing: 2 }}>+ AGREGAR</span>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 40 }}>
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ opacity: page === 1 ? 0.4 : 1, fontSize: 16 }}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`page-btn ${page === n ? "active" : ""}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ opacity: page === totalPages ? 0.4 : 1, fontSize: 16 }}>›</button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <span className="badge" style={{ marginBottom: 8, display: "block" }}>{modal === "create" ? "NUEVO" : "EDITAR"}</span>
                <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 18, color: "#fff", fontWeight: 700, letterSpacing: 2 }}>
                  {modal === "create" ? "AGREGAR PRODUCTO" : "MODIFICAR PRODUCTO"}
                </h2>
              </div>
              <button onClick={closeModal} style={{ background: "none", border: "none", color: "#4a7a8a", cursor: "pointer", fontSize: 22, lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ color: "#4a8a9a", fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: 1, display: "block", marginBottom: 6 }}>NOMBRE DEL PRODUCTO</label>
                <input className="input-field" placeholder="Ej: RTX 4090 GPU" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                {errors.name && <span style={{ color: "#ff4466", fontSize: 12, marginTop: 4, display: "block" }}>{errors.name}</span>}
              </div>

              <div>
                <label style={{ color: "#4a8a9a", fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: 1, display: "block", marginBottom: 6 }}>PRECIO (USD)</label>
                <input className="input-field" type="number" placeholder="0.00" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                {errors.price && <span style={{ color: "#ff4466", fontSize: 12, marginTop: 4, display: "block" }}>{errors.price}</span>}
              </div>

              <div>
                <label style={{ color: "#4a8a9a", fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: 1, display: "block", marginBottom: 6 }}>IMAGEN DEL PRODUCTO</label>
                <input className="input-field" placeholder="URL de imagen (https://...)" value={form.image} onChange={e => { setForm(f => ({ ...f, image: e.target.value })); setImagePreview(e.target.value); }} style={{ marginBottom: 8 }} />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button className="btn-ghost" style={{ fontSize: 11, padding: "6px 12px", letterSpacing: 1 }} onClick={() => fileRef.current.click()}>📁 SUBIR ARCHIVO</button>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageFile} />
                  {imagePreview && (
                    <div style={{ width: 48, height: 48, borderRadius: 6, overflow: "hidden", border: "1px solid #00e5ff33", background: "#040810" }}>
                      <img src={imagePreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="preview" onError={e => { e.target.style.display = "none" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 28, justifyContent: "flex-end" }}>
              <button className="btn-ghost" onClick={closeModal}>CANCELAR</button>
              <button className="btn-primary" onClick={handleSave}>
                {modal === "create" ? "✓ CREAR" : "✓ GUARDAR"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setDeleteConfirm(null)}>
          <div className="modal-box" style={{ maxWidth: 380, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠</div>
            <h2 style={{ fontFamily: "'Orbitron', monospace", fontSize: 16, color: "#ff4466", letterSpacing: 2, marginBottom: 10 }}>ELIMINAR PRODUCTO</h2>
            <p style={{ color: "#8aabb8", fontFamily: "'Rajdhani', monospace", fontSize: 15, marginBottom: 6 }}>¿Confirmar eliminación de:</p>
            <p style={{ color: "#e0f7ff", fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 600, marginBottom: 24 }}>"{deleteConfirm.name}"</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)}>CANCELAR</button>
              <button className="btn-danger" onClick={() => handleDelete(deleteConfirm.id)}>✕ ELIMINAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
