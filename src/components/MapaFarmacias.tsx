import { useState, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON } from "react-leaflet";
import type { Feature } from "geojson";
import { Farmacia } from "../types";
import { COLORES_CADENA } from "../constants";
import { useManzanasRM, useComunasRM, type ManzanaProps, type ComunaProps } from "../hooks/useGeoCapas";
import {
  colorParaValor, CORTES, PALETA, ETIQUETA_VARIABLE, type VariableCoropleta,
} from "../utils/coropleta";

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
  const [manzanasOn, setManzanasOn] = useState(false);
  const [comunasOn, setComunasOn] = useState(false);
  const [variable, setVariable] = useState<VariableCoropleta>("pob");

  const { data: manzanas, loading: loadingManz } = useManzanasRM(manzanasOn);
  const { data: comunas, loading: loadingCom } = useComunasRM(comunasOn);

  // Recalcular style sólo cuando cambia la variable (evita redibujar Leaflet si no hace falta).
  const estiloManzana = useMemo(
    () => (feat?: Feature) => {
      const props = (feat?.properties ?? {}) as ManzanaProps;
      return {
        fillColor: colorParaValor(props[variable] ?? 0, variable),
        fillOpacity: 0.6,
        color: "#ffffff",
        weight: 0.2,
      };
    },
    [variable],
  );

  const estiloComuna = () => ({
    fillColor: "transparent",
    fillOpacity: 0,
    color: "#0f172a",
    weight: 1.3,
    opacity: 0.8,
  });

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

        {/* Coropleta manzanas (se descarga lazy al activar el toggle) */}
        {manzanasOn && manzanas && (
          <GeoJSON
            key={`manz-${variable}`}
            data={manzanas}
            style={estiloManzana}
            onEachFeature={(feat, layer) => {
              const p = feat.properties as ManzanaProps;
              layer.bindTooltip(
                `<b>${p.comuna}</b><br/>Pob: ${p.pob.toLocaleString("es-CL")} · Viv: ${p.viv.toLocaleString("es-CL")} · Hog: ${p.hog.toLocaleString("es-CL")}`,
                { sticky: true, direction: "top" },
              );
            }}
          />
        )}

        {/* Borde de comunas */}
        {comunasOn && comunas && (
          <GeoJSON
            key="com"
            data={comunas}
            style={estiloComuna}
            onEachFeature={(feat, layer) => {
              const p = feat.properties as ComunaProps;
              layer.bindTooltip(
                `<b>${p.comuna}</b><br/>${p.n_manzanas.toLocaleString("es-CL")} manzanas · ${p.pob.toLocaleString("es-CL")} hab.`,
                { sticky: true, direction: "top" },
              );
            }}
          />
        )}

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

      {/* Panel de capas */}
      <div style={{
        position: "absolute", top: 54, left: 12, zIndex: 400,
        background: "rgba(255,255,255,0.95)", border: `1px solid ${C.border}`,
        borderRadius: 8, padding: "8px 10px", minWidth: 190,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)", backdropFilter: "blur(4px)",
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: C.text3, marginBottom: 6 }}>
          Capas Censo 2024
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text2, cursor: "pointer", marginBottom: 4 }}>
          <input type="checkbox" checked={manzanasOn} onChange={(e) => setManzanasOn(e.target.checked)} />
          Manzanas {loadingManz && <span style={{ color: C.text3 }}>· cargando…</span>}
        </label>

        {manzanasOn && (
          <div style={{ marginLeft: 18, marginBottom: 6 }}>
            <select
              value={variable}
              onChange={(e) => setVariable(e.target.value as VariableCoropleta)}
              style={{ fontSize: 11, padding: "2px 4px", border: `1px solid ${C.border}`, borderRadius: 4, background: "#fff", color: C.text2, width: "100%" }}
            >
              {(Object.keys(ETIQUETA_VARIABLE) as VariableCoropleta[]).map((k) => (
                <option key={k} value={k}>{ETIQUETA_VARIABLE[k]}</option>
              ))}
            </select>

            {/* Leyenda */}
            <div style={{ marginTop: 6 }}>
              <div style={{ display: "flex", height: 8, borderRadius: 3, overflow: "hidden" }}>
                {PALETA.map((c) => <div key={c} style={{ flex: 1, background: c }} />)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.text3, marginTop: 2 }}>
                <span>0</span>
                {CORTES[variable].map((v, i) => <span key={i}>{v}</span>)}
                <span>+</span>
              </div>
            </div>
          </div>
        )}

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.text2, cursor: "pointer" }}>
          <input type="checkbox" checked={comunasOn} onChange={(e) => setComunasOn(e.target.checked)} />
          Bordes comunas {loadingCom && <span style={{ color: C.text3 }}>· cargando…</span>}
        </label>
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
