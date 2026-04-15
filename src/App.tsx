import { useMemo, useState, Suspense, lazy } from "react";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
} from "@clerk/clerk-react";
import { useFarmacias } from "./hooks/useFarmacias";
import { useDemografia } from "./hooks/useDemografia";
import PanelIzquierdo from "./components/PanelIzquierdo";
import { FiltrosActivos } from "./types";

// Carga diferida del mapa (Leaflet no soporta SSR y es pesado)
const MapaFarmacias = lazy(() => import("./components/MapaFarmacias"));

const FILTROS_VACIOS: FiltrosActivos = {
  cadenas: [],
  regiones: [],
  comunas: [],
  zonas: [],
};

export default function App() {
  const { farmacias, loading, error } = useFarmacias();
  const { datos: demografiaTodas, loading: loadingDemo } = useDemografia();
  const [filtros, setFiltros] = useState<FiltrosActivos>(FILTROS_VACIOS);

  // Opciones únicas para el panel de filtros
  const comunasDisponibles = useMemo(
    () => [...new Set(farmacias.map((f) => f.comuna))].sort(),
    [farmacias]
  );
  const regionesDisponibles = useMemo(
    () => [...new Set(farmacias.map((f) => f.region))].sort(),
    [farmacias]
  );

  // Aplicar filtros
  const farmaciasFiltradas = useMemo(() => {
    return farmacias.filter((f) => {
      if (filtros.cadenas.length > 0 && !filtros.cadenas.includes(f.cadena))
        return false;
      if (filtros.regiones.length > 0 && !filtros.regiones.includes(f.region))
        return false;
      if (filtros.comunas.length > 0 && !filtros.comunas.includes(f.comuna))
        return false;
      return true;
    });
  }, [farmacias, filtros]);

  // Filtrar demografía según comunas/regiones visibles
  const demografiaFiltrada = useMemo(() => {
    if (demografiaTodas.length === 0) return [];
    // Si hay filtro de comuna, mostrar solo esas comunas
    if (filtros.comunas.length > 0) {
      return demografiaTodas.filter((d) =>
        filtros.comunas.includes(d.nombre_comuna)
      );
    }
    // Si hay filtro de región, mostrar comunas de esas regiones
    if (filtros.regiones.length > 0) {
      return demografiaTodas.filter((d) =>
        filtros.regiones.includes(d.region)
      );
    }
    // Sin filtro: mostrar comunas que tienen farmacias
    const comunasConFarmacias = new Set(farmacias.map((f) => f.comuna));
    return demografiaTodas.filter((d) =>
      comunasConFarmacias.has(d.nombre_comuna)
    );
  }, [demografiaTodas, filtros, farmacias]);

  const totalFarmacias = farmacias.length;
  const totalFiltradas = farmaciasFiltradas.length;

  return (
    <>
      {/* Pantalla de login para usuarios no autenticados */}
      <SignedOut>
        <div className="h-screen flex items-center justify-center bg-gray-950">
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                REALI
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Inteligencia Territorial Farmacéutica
              </p>
            </div>
            <SignIn
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "bg-gray-900 border border-gray-800",
                },
              }}
            />
          </div>
        </div>
      </SignedOut>

      {/* Dashboard completo para usuarios autenticados */}
      <SignedIn>
    <div className="h-screen flex flex-col bg-gray-950 text-gray-100 overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight leading-none">
            REALI
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Inteligencia Territorial Farmacéutica
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Contadores rápidos */}
          {!loading && !error && (
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>
                <span className="text-white font-semibold tabular-nums">
                  {totalFiltradas.toLocaleString("es-CL")}
                </span>
                {totalFiltradas !== totalFarmacias && (
                  <span className="text-gray-600">
                    {" "}/ {totalFarmacias.toLocaleString("es-CL")}
                  </span>
                )}
                {" "}farmacias
              </span>
              <span className="text-gray-700">·</span>
              <span>
                {new Set(farmaciasFiltradas.map((f) => f.comuna)).size} comunas
              </span>
            </div>
          )}
          <span className="text-xs text-gray-600">FEMSA Salud · Chile</span>
          {(loading || loadingDemo) && (
            <span className="text-xs text-teal-400 animate-pulse">
              Cargando datos…
            </span>
          )}
          {error && (
            <span className="text-xs text-red-400">Error: {error}</span>
          )}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-7 h-7",
              },
            }}
          />
        </div>
      </header>

      {/* Cuerpo: panel izquierdo + mapa */}
      <div className="flex-1 flex overflow-hidden">
        {!loading && !error && (
          <PanelIzquierdo
            farmacias={farmaciasFiltradas}
            demografia={demografiaFiltrada}
            comunasDisponibles={comunasDisponibles}
            regionesDisponibles={regionesDisponibles}
            filtros={filtros}
            onChange={setFiltros}
          />
        )}

        <main className="flex-1 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-400">Cargando farmacias…</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
              <div className="text-center space-y-2 max-w-sm">
                <p className="text-red-400 font-medium">Error al cargar datos</p>
                <p className="text-sm text-gray-500">{error}</p>
                <p className="text-xs text-gray-600 mt-4">
                  Asegúrate de que{" "}
                  <code className="text-teal-400">src/data/farmacias.csv</code>{" "}
                  existe.
                  <br />
                  Corre{" "}
                  <code className="text-teal-400">
                    python scripts/generate_mock.py
                  </code>{" "}
                  para generarlo.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <Suspense
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
                  <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            >
              <MapaFarmacias farmacias={farmaciasFiltradas} />
            </Suspense>
          )}
        </main>
      </div>
    </div>
      </SignedIn>
    </>
  );
}
