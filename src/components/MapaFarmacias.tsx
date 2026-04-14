import { MapContainer, TileLayer, CircleMarker, Popup, LayersControl } from "react-leaflet";
import { Farmacia } from "../types";
import { COLORES_CADENA, MAP_CENTER, MAP_ZOOM } from "../constants";

interface Props {
  farmacias: Farmacia[];
}

// Capas base disponibles
const TILE_LAYERS = [
  {
    nombre: "Oscuro",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    checked: true,
  },
  {
    nombre: "Claro",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  },
  {
    nombre: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
  },
  {
    nombre: "Satélite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
  },
  {
    nombre: "Topográfico",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
];

export default function MapaFarmacias({ farmacias }: Props) {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      className="w-full h-full"
      preferCanvas
    >
      <LayersControl position="topright">
        {TILE_LAYERS.map((layer) => (
          <LayersControl.BaseLayer
            key={layer.nombre}
            name={layer.nombre}
            checked={layer.checked ?? false}
          >
            <TileLayer
              url={layer.url}
              attribution={layer.attribution}
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        ))}
      </LayersControl>

      {farmacias.map((f) => (
        <CircleMarker
          key={f.id}
          center={[f.lat, f.lon]}
          radius={5}
          pathOptions={{
            color: COLORES_CADENA[f.cadena] ?? "#888",
            fillColor: COLORES_CADENA[f.cadena] ?? "#888",
            fillOpacity: 0.85,
            weight: 1,
          }}
        >
          <Popup>
            <div className="text-sm min-w-[180px]">
              <p className="font-semibold mb-1">{f.nombre}</p>
              <p className="text-gray-400 text-xs mb-2">{f.direccion}</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <span className="text-gray-500">Cadena</span>
                <span
                  className="font-medium"
                  style={{ color: COLORES_CADENA[f.cadena] ?? "#888" }}
                >
                  {f.cadena}
                </span>
                <span className="text-gray-500">Comuna</span>
                <span>{f.comuna}</span>
                <span className="text-gray-500">Tipo</span>
                <span>{f.tipo}</span>
                {f.horario && (
                  <>
                    <span className="text-gray-500">Horario</span>
                    <span>{f.horario}</span>
                  </>
                )}
                {f.telefono && (
                  <>
                    <span className="text-gray-500">Teléfono</span>
                    <span>{f.telefono}</span>
                  </>
                )}
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
