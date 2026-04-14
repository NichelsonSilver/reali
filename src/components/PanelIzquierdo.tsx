import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { Farmacia, CadenaFarmaceutica, FiltrosActivos } from "../types";
import { DemografiaCenso } from "../hooks/useDemografia";
import { CADENAS, COLORES_CADENA } from "../constants";

interface Props {
  farmacias: Farmacia[];
  demografia: DemografiaCenso[];
  comunasDisponibles: string[];
  regionesDisponibles: string[];
  filtros: FiltrosActivos;
  onChange: (filtros: FiltrosActivos) => void;
}

// Estilo compartido para los selects
const selectClass =
  "w-full bg-gray-800 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-200 focus:outline-none focus:ring-1 focus:ring-teal-500 appearance-none cursor-pointer";

export default function PanelIzquierdo({
  farmacias,
  demografia,
  comunasDisponibles,
  regionesDisponibles,
  filtros,
  onChange,
}: Props) {
  const setCadena = (value: string) => {
    if (value === "") {
      onChange({ ...filtros, cadenas: [] });
    } else {
      onChange({ ...filtros, cadenas: [value as CadenaFarmaceutica] });
    }
  };

  const setRegion = (value: string) => {
    if (value === "") {
      onChange({ ...filtros, regiones: [] });
    } else {
      onChange({ ...filtros, regiones: [value] });
    }
  };

  const setComuna = (value: string) => {
    if (value === "") {
      onChange({ ...filtros, comunas: [] });
    } else {
      onChange({ ...filtros, comunas: [value] });
    }
  };

  const limpiar = () =>
    onChange({ cadenas: [], regiones: [], comunas: [], zonas: [] });

  const hayFiltros =
    filtros.cadenas.length > 0 ||
    filtros.regiones.length > 0 ||
    filtros.comunas.length > 0;

  // Datos para gráfico de barras por cadena
  const datosCadena = useMemo(() => {
    const conteo: Record<string, number> = {};
    for (const c of CADENAS) conteo[c] = 0;
    for (const f of farmacias) {
      if (conteo[f.cadena] !== undefined) conteo[f.cadena]++;
      else conteo["Otra"]++;
    }
    return CADENAS
      .map((c) => ({
        nombre: c,
        cantidad: conteo[c],
        color: COLORES_CADENA[c],
      }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }, [farmacias]);

  // Datos demográficos del censo agregados
  const resumenDemo = useMemo(() => {
    if (demografia.length === 0) return null;
    const totales = {
      poblacion: 0,
      hombres: 0,
      mujeres: 0,
      edad_0_14: 0,
      edad_15_29: 0,
      edad_30_44: 0,
      edad_45_59: 0,
      edad_60_mas: 0,
      escolaridad_sum: 0,
      escolaridad_count: 0,
    };
    for (const d of demografia) {
      totales.poblacion += d.poblacion;
      totales.hombres += d.hombres;
      totales.mujeres += d.mujeres;
      totales.edad_0_14 += d.edad_0_14;
      totales.edad_15_29 += d.edad_15_29;
      totales.edad_30_44 += d.edad_30_44;
      totales.edad_45_59 += d.edad_45_59;
      totales.edad_60_mas += d.edad_60_mas;
      totales.escolaridad_sum += d.escolaridad_promedio * d.poblacion;
      totales.escolaridad_count += d.poblacion;
    }
    return totales;
  }, [demografia]);

  // Distribución etaria para gráfico
  const datosEdad = useMemo(() => {
    if (!resumenDemo) return [];
    const grupos = [
      { nombre: "0-14", valor: resumenDemo.edad_0_14, color: "#34d399" },
      { nombre: "15-29", valor: resumenDemo.edad_15_29, color: "#60a5fa" },
      { nombre: "30-44", valor: resumenDemo.edad_30_44, color: "#a78bfa" },
      { nombre: "45-59", valor: resumenDemo.edad_45_59, color: "#fbbf24" },
      { nombre: "60+", valor: resumenDemo.edad_60_mas, color: "#f87171" },
    ];
    return grupos;
  }, [resumenDemo]);

  return (
    <aside className="w-80 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {/* ── Filtros (dropdowns) ── */}
        <section className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Filtros
            </h3>
            {hayFiltros && (
              <button
                onClick={limpiar}
                className="text-[10px] text-teal-400 hover:text-teal-300"
              >
                Limpiar
              </button>
            )}
          </div>

          <div className="space-y-2">
            {/* Cadena */}
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1 block">
                Cadena
              </label>
              <select
                className={selectClass}
                value={filtros.cadenas[0] ?? ""}
                onChange={(e) => setCadena(e.target.value)}
              >
                <option value="">Todas las cadenas</option>
                {CADENAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Región */}
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1 block">
                Región
              </label>
              <select
                className={selectClass}
                value={filtros.regiones[0] ?? ""}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">Todas las regiones</option>
                {regionesDisponibles.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Comuna */}
            <div>
              <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1 block">
                Comuna
              </label>
              <select
                className={selectClass}
                value={filtros.comunas[0] ?? ""}
                onChange={(e) => setComuna(e.target.value)}
              >
                <option value="">Todas las comunas</option>
                {comunasDisponibles.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="border-t border-gray-800 mx-4" />

        {/* ── Gráfico de cadenas ── */}
        <section className="px-4 pt-3 pb-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Farmacias por Cadena
          </h3>
          <div style={{ width: "100%", height: datosCadena.length * 30 + 10 }}>
            <ResponsiveContainer>
              <BarChart
                data={datosCadena}
                layout="vertical"
                margin={{ top: 0, right: 35, bottom: 0, left: 0 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  width={95}
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Bar dataKey="cantidad" radius={[0, 4, 4, 0]} barSize={18}>
                  {datosCadena.map((d) => (
                    <Cell key={d.nombre} fill={d.color} />
                  ))}
                  <LabelList
                    dataKey="cantidad"
                    position="right"
                    style={{ fill: "#d1d5db", fontSize: 11, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="border-t border-gray-800 mx-4" />

        {/* ── Demografía (Censo 2024) ── */}
        <section className="px-4 pt-3 pb-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Demografía — Censo 2024
          </h3>

          {resumenDemo ? (
            <>
              {/* KPIs demográficos */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-gray-800/50 rounded px-2 py-1.5">
                  <p className="text-sm font-bold text-white tabular-nums">
                    {resumenDemo.poblacion.toLocaleString("es-CL")}
                  </p>
                  <p className="text-[10px] text-gray-500">Población</p>
                </div>
                <div className="bg-gray-800/50 rounded px-2 py-1.5">
                  <p className="text-sm font-bold text-white tabular-nums">
                    {resumenDemo.hombres.toLocaleString("es-CL")}
                  </p>
                  <p className="text-[10px] text-gray-500">Hombres</p>
                </div>
                <div className="bg-gray-800/50 rounded px-2 py-1.5">
                  <p className="text-sm font-bold text-white tabular-nums">
                    {resumenDemo.mujeres.toLocaleString("es-CL")}
                  </p>
                  <p className="text-[10px] text-gray-500">Mujeres</p>
                </div>
              </div>

              {/* Escolaridad promedio */}
              <div className="bg-gray-800/50 rounded px-2 py-1.5 mb-3">
                <p className="text-sm font-bold text-white tabular-nums">
                  {resumenDemo.escolaridad_count > 0
                    ? (resumenDemo.escolaridad_sum / resumenDemo.escolaridad_count).toFixed(1)
                    : "—"}{" "}
                  <span className="text-[10px] text-gray-500 font-normal">años de escolaridad prom.</span>
                </p>
              </div>

              {/* Distribución etaria */}
              <h4 className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Distribución Etaria
              </h4>
              <div style={{ width: "100%", height: datosEdad.length * 28 + 10 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={datosEdad}
                    layout="vertical"
                    margin={{ top: 0, right: 50, bottom: 0, left: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="nombre"
                      width={40}
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Bar dataKey="valor" radius={[0, 4, 4, 0]} barSize={16}>
                      {datosEdad.map((d) => (
                        <Cell key={d.nombre} fill={d.color} />
                      ))}
                      <LabelList
                        dataKey="valor"
                        position="right"
                        formatter={(v: number) => v.toLocaleString("es-CL")}
                        style={{ fill: "#9ca3af", fontSize: 10 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <p className="text-xs text-gray-600 italic">Sin datos demográficos</p>
          )}
        </section>
      </div>
    </aside>
  );
}
