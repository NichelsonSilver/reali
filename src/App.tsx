import { useMemo, useState, Suspense, lazy } from "react";
import { useFarmacias } from "./hooks/useFarmacias";
import { useDemografia, DemografiaCenso } from "./hooks/useDemografia";
import { Farmacia } from "./types";
import PanelIzquierdo from "./components/PanelIzquierdo";
import UploadModal from "./components/UploadModal";
import PageMovimientos from "./components/PageMovimientos";
import PageCadenas from "./components/PageCadenas";
import PasswordGate from "./components/PasswordGate";

const MapaFarmacias = lazy(() => import("./components/MapaFarmacias"));

type Page = "mapa" | "movimientos" | "cadenas";

interface Filtros { cadena: string; region: string; comuna: string; }

const FILTROS_VACIOS: Filtros = { cadena: "", region: "", comuna: "" };

const C = {
  bg: "#f8fafc", bgCard: "#fff", border: "#e2e8f0",
  text: "#0f172a", text2: "#475569", text3: "#94a3b8",
  accent: "#2563eb", nav: "#0f172a", navBorder: "#1e293b",
};

// ── Icons ────────────────────────────────────────────────────────────────────

function IMap() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
      <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  );
}
function IBar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  );
}
function IGrid() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  );
}
function IUp() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}
function IChevL() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>;
}
function IChevR() {
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
}

// ── Nav Sidebar ──────────────────────────────────────────────────────────────

function NavSidebar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const items: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: "mapa",        label: "Mapa Farmacéutico",   icon: <IMap /> },
    { id: "movimientos", label: "Aperturas / Cierres", icon: <IBar /> },
    { id: "cadenas",     label: "Cadenas Principales", icon: <IGrid /> },
  ];
  return (
    <nav style={{ width: 204, flexShrink: 0, background: C.nav, display: "flex", flexDirection: "column", padding: "0 10px 14px" }}>
      <div style={{ padding: "20px 8px 20px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1 }}>REALI</div>
        <div style={{ fontSize: 9, color: "#475569", marginTop: 3, letterSpacing: "0.05em", textTransform: "uppercase" }}>Intel. Territorial Farm.</div>
      </div>

      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "#334155", padding: "0 10px", marginBottom: 5 }}>Plataforma</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px", borderRadius: 6,
              cursor: "pointer", fontSize: 12, fontWeight: 500,
              color: page === item.id ? "#fff" : "#94a3b8",
              background: page === item.id ? "rgba(255,255,255,0.12)" : "transparent",
              transition: "all 0.12s", whiteSpace: "nowrap", userSelect: "none",
            }}
            onMouseEnter={(e) => { if (page !== item.id) { e.currentTarget.style.color = "#e2e8f0"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; } }}
            onMouseLeave={(e) => { if (page !== item.id) { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; } }}
          >
            <span style={{ opacity: 0.75 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "auto", padding: "14px 8px 0", borderTop: `1px solid ${C.navBorder}` }}>
        <div style={{ fontSize: 10, color: "#334155" }}>FEMSA Salud · Chile</div>
        <div style={{ fontSize: 9, color: "#1e293b", marginTop: 1 }}>v0.9 · beta</div>
      </div>
    </nav>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

function Header({ page, count, total, onUpload }: { page: Page; count: number; total: number; onUpload: () => void }) {
  const titles: Record<Page, string> = {
    mapa: "Mapa Farmacéutico",
    movimientos: "Registro de Aperturas y Cierres",
    cadenas: "Cadenas Principales — Aperturas 2026",
  };
  return (
    <header style={{ height: 52, borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: C.bgCard, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{titles[page]}</span>
        {page === "mapa" && (
          <span style={{ fontSize: 11, color: C.text3 }}>
            <span style={{ color: C.accent, fontWeight: 600 }}>{count.toLocaleString("es-CL")}</span>
            {count !== total && <span style={{ color: C.text3 }}> / {total.toLocaleString("es-CL")}</span>}
            {" "}locales
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {page === "mapa" && (
          <button
            onClick={onUpload}
            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 13px", borderRadius: 6, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: C.bgCard, color: C.text2, border: `1px solid ${C.border}`, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
          >
            <IUp /> Subir archivo
          </button>
        )}
      </div>
    </header>
  );
}

// ── Page: Mapa ────────────────────────────────────────────────────────────────

function PageMapa({
  uploadModal, setUploadModal, farmacias, demografia, loading, error, onCountChange,
}: {
  uploadModal: boolean; setUploadModal: (v: boolean) => void;
  farmacias: Farmacia[];
  demografia: DemografiaCenso[];
  loading: boolean; error: string | null;
  onCountChange: (n: number) => void;
}) {
  const [panelOpen, setPanelOpen] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_VACIOS);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string }[]>([]);

  const filtradas = useMemo(() => {
    const result = farmacias.filter((f) => {
      if (filtros.cadena && f.cadena !== filtros.cadena) return false;
      if (filtros.region && f.region !== filtros.region) return false;
      if (filtros.comuna && f.comuna !== filtros.comuna) return false;
      return true;
    });
    onCountChange(result.length);
    return result;
  }, [farmacias, filtros]);

  const comunas = useMemo(() => [...new Set(farmacias.map((f) => f.comuna))].sort(), [farmacias]);
  const regiones = useMemo(() => [...new Set(farmacias.map((f) => f.region))].sort(), [farmacias]);

  const PANEL_W = 262;

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
      {/* Panel izquierdo */}
      <div
        className="panel-slide"
        style={{ width: panelOpen ? PANEL_W : 0, minWidth: panelOpen ? PANEL_W : 0, borderRight: `1px solid ${C.border}`, flexShrink: 0 }}
      >
        {panelOpen && !loading && !error && (
          <PanelIzquierdo
            farmacias={filtradas}
            demografia={demografia}
            comunasDisponibles={comunas}
            regionesDisponibles={regiones}
            filtros={filtros}
            onChange={setFiltros}
            uploadedFiles={uploadedFiles}
            onRemoveFile={(i) => setUploadedFiles((fs) => fs.filter((_, j) => j !== i))}
          />
        )}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setPanelOpen((o) => !o)}
        style={{
          position: "absolute", left: panelOpen ? PANEL_W - 1 : 0, top: "50%", transform: "translateY(-50%)",
          zIndex: 500, background: C.bgCard, border: `1px solid ${C.border}`,
          borderLeft: panelOpen ? "none" : `1px solid ${C.border}`,
          borderRadius: "0 6px 6px 0", color: C.text3, cursor: "pointer",
          padding: "10px 4px", display: "flex", alignItems: "center",
          transition: "left 0.22s cubic-bezier(.4,0,.2,1)",
          boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
        }}
      >
        {panelOpen ? <IChevL /> : <IChevR />}
      </button>

      {/* Mapa */}
      <div style={{ flex: 1, position: "relative" }}>
        {loading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 32, height: 32, border: "2px solid #2563eb", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 8px" }} />
              <p style={{ fontSize: 13, color: C.text3 }}>Cargando farmacias…</p>
            </div>
          </div>
        )}
        {error && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
            <p style={{ color: "#dc2626", fontSize: 13 }}>Error: {error}</p>
          </div>
        )}
        {!loading && !error && (
          <Suspense fallback={
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
              <div style={{ width: 32, height: 32, border: "2px solid #2563eb", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          }>
            <MapaFarmacias farmacias={filtradas} />
          </Suspense>
        )}
      </div>

      {uploadModal && (
        <UploadModal
          onClose={() => setUploadModal(false)}
          onUpload={(files) => { setUploadedFiles((f) => [...f, ...files]); setUploadModal(false); }}
        />
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [ok, setOk] = useState(() => localStorage.getItem("demo") === "1");
  const { farmacias, loading, error } = useFarmacias();
  const { datos: demografia } = useDemografia();
  const [page, setPage] = useState<Page>("mapa");
  const [uploadModal, setUploadModal] = useState(false);
  const [count, setCount] = useState(0);

  if (!ok) {
    return (
      <PasswordGate
        onSuccess={() => {
          localStorage.setItem("demo", "1");
          setOk(true);
        }}
      />
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg }}>
      <NavSidebar page={page} setPage={setPage} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Header
          page={page}
          count={loading ? 0 : count}
          total={farmacias.length}
          onUpload={() => setUploadModal(true)}
        />
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {page === "mapa" && (
            <PageMapa
              uploadModal={uploadModal}
              setUploadModal={setUploadModal}
              farmacias={farmacias}
              demografia={demografia}
              loading={loading}
              error={error}
              onCountChange={setCount}
            />
          )}
          {page === "movimientos" && <PageMovimientos />}
          {page === "cadenas" && <PageCadenas />}
        </div>
      </div>
    </div>
  );
}
