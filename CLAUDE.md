# CLAUDE.md — Instrucciones para Claude Code

## Contexto del proyecto

REALI es un dashboard de inteligencia geoespacial para farmacias en Chile. El primer cliente es FEMSA Salud (expansión farmacéutica). El producto se entrega como app local (no SaaS por ahora) — el cliente corre `npm run dev` o un build estático.

## Stack

- React 18+ con Vite y TypeScript
- Leaflet (react-leaflet) para mapas
- Recharts para gráficos
- Tailwind CSS para estilos
- Papa Parse para leer CSV/Excel en el browser
- SheetJS (xlsx) para parsear archivos Excel que suba el cliente

## Arquitectura de datos

**No hay backend.** Todos los datos se cargan desde archivos locales:

1. `src/data/farmacias.csv` — Datos base de MINSAL (preprocesados)
2. `src/data/demografia.csv` — Datos demográficos por manzana/zona censal
3. Archivos que el usuario sube en runtime (ventas, shapes) se procesan en el browser

### Esquema de farmacias (CSV)

```
id, nombre, cadena, direccion, comuna, region, lat, lon, tipo, telefono, horario, fecha_registro
```

### Esquema de demografía

```
zona_censal, manzana, poblacion, hogares, nse_abc1, nse_c2, nse_c3, nse_d, nse_e, ingreso_promedio
```

## Convenciones

- Componentes en PascalCase, archivos en PascalCase.tsx
- Hooks en camelCase, archivos en camelCase.ts
- Utils en camelCase
- Tipos en `src/types.ts`
- Constantes (cadenas farmacéuticas, colores, etc.) en `src/constants.ts`
- Idioma de la UI: Español
- Comentarios en código: Español

## Cadenas farmacéuticas principales en Chile

Para filtros y categorización:

- Cruz Verde (FEMSA)
- Ahumada
- Salcobrand
- Dr. Simi
- Farmacia Independiente
- Knop
- Redfarma
- Otras

## Reglas de negocio

- Un "cierre" se detecta cuando un ID de farmacia presente en el snapshot anterior no aparece en el actual
- Una "apertura" es un ID nuevo que no existía en el snapshot anterior
- El NSE (nivel socioeconómico) se clasifica en ABC1, C2, C3, D, E según metodología AIM Chile
- Las zonas geográficas del cliente son polígonos GeoJSON que se superponen al mapa

## Prioridades de implementación

1. Mapa con puntos de farmacias + popup con info
2. Panel de filtros funcional (cadena, comuna, región)
3. KPIs básicos (conteo, aperturas/cierres)
4. Tabla de aperturas/cierres
5. Capa demográfica en el mapa
6. Upload de archivos (ventas, shapes)
7. Charts de ventas por cadena

## Testing

- Usar datos mock en `src/data/` para desarrollo
- El script `scripts/generate_mock.py` genera datos de ejemplo realistas
