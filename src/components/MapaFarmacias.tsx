import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Farmacia } from "../types";
import { COLORES_CADENA } from "../constants";

interface Props {
  farmacias: Farmacia[];
}

const TILES = {
  claro:    { url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",    attr: "© CARTO · OSM" },
  oscuro:   { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",     attr: "© CARTO · OSM" },
  satelite: { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attr: "© Esri" },
  osm:      { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",                attr: "© OpenStreetMap" },
};

type TileKey = keyof typeof TILES;

const LEGEND_CADENAS = ["Cruz Verde","Salcobrand","Ahumada","Dr. Simi","Maicao","Knop"] as const;

const C = {
  bg: "#f8fafc", bgCard: "#fff", border: "#e2e8f0",
  text2: "#475569", text3: "#94a3b8", accent: "#2563eb",
};

export default function MapaFarmacias({ farmacias }: Props) {
  const [tile, setTile] = useState<TileKey>("claro");

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <MapContainer
        center={[-33.4489, -70.6693]}
        zoom={11}
        style={{ width: "100%", height: "100%" }}
        preferCanvas
        zoomControl={false}
      >
        <TileLayer key={tile} url={TILES[tile].url} attribution={TILES[tile].attr} maxZoom={19} />

        {farmacias.map((f) => {
          const col = COLORES_CADENA[f.cadena] ?? "#64748b";
          const svUrl = `https://maps.google.com/maps?q=&layer=c&cbll=${f.lat},${f.lon}`;
          return (
            <CircleMarker
              key={f.id}
              center={[f.lat, f.lon]}
              radius={7}
              pathOptions={{ color: "rgba(255,255,255,0.8)", weight: 1.5, fillColor: col, fillOpacity: 0.9 }}
            >
              <Popup maxWidth={270} minWidth={220}>
                <div className="fpopup">
                  <h4>{f.nombre}</h4>
                  <div className="addr">{f.direccion}</div>
                  <div className="grid2">
                    <span className="lbl">Cadena</span>
                    <span className="val" style={{ color: col }}>{f.cadena}</span>
                    <span className="lbl">Comuna</span>
                    <span className="val">{f.comuna}</span>
                    <span className="lbl">Región</span>
                    <span className="val">{f.region}</span>
                    <span className="lbl">Tipo</span>
                    <span className="val">{f.tipo}</span>
                    {f.horario && (<><span className="lbl">Horario</span><span className="val">{f.horario}</span></>)}
                    {f.telefono && (<><span className="lbl">Teléfono</span><span className="val">{f.telefono}</span></>)}
                  </div>
                  <a href={svUrl} target="_blank" rel="noreferrer" className="sv">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="5" r="2"/><path d="M12 7v6"/><path d="M8 11l4 2 4-2"/><path d="M6 20c1.5-1.5 6-2 6-2s4.5.5 6 2"/>
                    </svg>
                    Ver en Street View
                  </a>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Tile picker */}
      <div style={{
        position: "absolute", top: 10, left: 12, zIndex: 400,
        background: "rgba(255,255,255,0.95)", border: `1px solid ${C.border}`,
        borderRadius: 8, padding: "5px 7px", display: "flex", alignItems: "center", gap: 4,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)", backdropFilter: "blur(4px)",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
          <polyline points="2 17 12 22 22 17"/>
          <polyline points="2 12 12 17 22 12"/>
        </svg>
        {(["claro","oscuro","satelite","osm"] as TileKey[]).map((t) => (
          <button
            key={t}
            onClick={() => setTile(t)}
            style={{
              padding: "3px 10px", borderRadius: 4, fontSize: "10.5px", fontWeight: 500,
              cursor: "pointer", border: "none", transition: "all 0.12s",
              background: tile === t ? C.accent : "transparent",
              color: tile === t ? "#fff" : C.text3,
            }}
          >
            {{ claro: "Claro", oscuro: "Oscuro", satelite: "Satélite", osm: "OSM" }[t]}
          </button>
        ))}
      </div>

      {/* Count badge */}
      <div style={{
        position: "absolute", bottom: 14, left: 14, zIndex: 400,
        background: "rgba(255,255,255,0.95)", border: `1px solid ${C.border}`,
        borderRadius: 6, padding: "5px 12px", fontSize: 11, color: C.text2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}>
        <span style={{ color: C.accent, fontWeight: 700 }}>{farmacias.length}</span> locales visibles
      </div>

      {/* Leyenda */}
      <div style={{
        position: "absolute", bottom: 14, right: 14, zIndex: 400,
        background: "rgba(255,255,255,0.95)", border: `1px solid ${C.border}`,
        borderRadius: 8, padding: "10px 12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.text3, marginBottom: 6 }}>Cadenas</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {LEGEND_CADENAS.map((c) => (
            <div key={c} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: COLORES_CADENA[c], flexShrink: 0, display: "inline-block" }} />
              <span style={{ fontSize: 10, color: C.text2 }}>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
