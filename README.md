# REALI — Real Estate & Location Intelligence (https://reali.cl/)

Dashboard interactivo de inteligencia geoespacial para la industria farmacéutica chilena.

## Qué es

Plataforma de análisis territorial que permite a cadenas farmacéuticas tomar decisiones de expansión basadas en datos: ubicación de competidores, demografía por manzana, aperturas/cierres, y zonas de oportunidad.

## Cliente objetivo

**FEMSA Salud** — Expansión y real estate de farmacias en Chile.

## Stack técnico

- **Frontend:** React + Vite + TypeScript
- **Mapas:** Leaflet + react-leaflet
- **Charts:** Recharts
- **Datos:** Archivos locales (Excel/CSV/GeoJSON) — sin backend
- **Estilos:** Tailwind CSS

## Estructura del proyecto

```
reali/
├── src/
│   ├── components/       # Componentes reutilizables (Map, Filters, KPICard, etc.)
│   ├── pages/            # Vistas principales (Dashboard, Upload)
│   ├── utils/            # Parsers, transformaciones, cálculos
│   ├── hooks/            # Custom hooks (useFilteredData, useMapBounds, etc.)
│   └── data/             # Datos estáticos de ejemplo (mock/seed)
├── public/               # Assets estáticos
├── scripts/              # Scripts de preprocesamiento (Python)
├── docs/                 # Documentación, brochure
└── CLAUDE.md             # Instrucciones para Claude Code
```

## Fuentes de datos

| Fuente | Formato | Origen | Notas |
|---|---|---|---|
| Farmacias MINSAL | CSV/Excel | Scraper WB_MINSAL (ya construido) | Incluye coords, nombre, cadena, dirección, comuna |
| Demografía por manzana | Excel | Cliente (INE/Censo) | Población, NSE, hogares |
| Ventas por cadena | Excel | Cliente (dato propio) | Upload local en el dashboard |
| Zonas geográficas | GeoJSON/Shapefile | Cliente | Upload local, shapes de zonas comerciales |
| Aperturas/cierres | CSV | Derivado de MINSAL (diff mensual) | Script de comparación entre snapshots |

## Módulos del dashboard

1. **Mapa interactivo** — Puntos de farmacias con clustering, popup con detalle, capas de shapes
2. **Panel de filtros** — Industria, cadena, región, comuna, zona
3. **KPIs** — Aperturas/cierres mensual, población por NSE, locales por cadena
4. **Tabla de aperturas/cierres** — Listado del último mes con detalle
5. **Análisis de ventas** — Charts por cadena (dato subido por cliente)
6. **Upload de datos** — Interfaz para subir Excel/GeoJSON sin tocar código

## Cómo correr

```bash
npm install
npm run dev
```

## Preprocesamiento de datos

```bash
# Generar CSV limpio desde el scraper MINSAL
python scripts/process_minsal.py --input data/MINSAL_raw.xlsx --output src/data/farmacias.csv

# Generar diff de aperturas/cierres
python scripts/diff_aperturas.py --prev data/minsal_marzo.csv --curr data/minsal_abril.csv
```
