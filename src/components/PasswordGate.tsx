import { useState, FormEvent } from "react";

interface Props {
  onSuccess: () => void;
}

export default function PasswordGate({ onSuccess }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (value === import.meta.env.VITE_DEMO_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setValue("");
    }
  }

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <form
        onSubmit={handleSubmit}
        style={{ width: 320, padding: 28, background: "#111827", border: "1px solid #1e293b", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}
      >
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em", marginBottom: 2 }}>REALI</div>
        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 22 }}>Demo · Inteligencia Territorial Farmacéutica</div>

        <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.02em" }}>
          Clave de acceso
        </label>
        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); if (error) setError(false); }}
          autoFocus
          style={{
            width: "100%", padding: "9px 11px", fontSize: 13,
            background: "#030712", color: "#f3f4f6",
            border: `1px solid ${error ? "#dc2626" : "#1e293b"}`,
            borderRadius: 6, outline: "none", boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
        />
        {error && (
          <div style={{ fontSize: 11, color: "#ef4444", marginTop: 6 }}>Clave incorrecta</div>
        )}

        <button
          type="submit"
          style={{
            width: "100%", marginTop: 16, padding: "9px 12px",
            background: "#14b8a6", color: "#042f2e",
            border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Entrar
        </button>

        <div style={{ fontSize: 10, color: "#334155", marginTop: 18, textAlign: "center" }}>
          Acceso restringido · FEMSA Salud
        </div>
      </form>
    </div>
  );
}
