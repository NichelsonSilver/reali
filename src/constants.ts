import { CadenaFarmaceutica } from "./types";

export const CADENAS: CadenaFarmaceutica[] = [
  "Cruz Verde",
  "Salcobrand",
  "Ahumada",
  "Dr. Simi",
  "Maicao",
  "Knop",
  "Redfarma",
  "Independiente",
  "Otra",
];

export const COLORES_CADENA: Record<CadenaFarmaceutica, string> = {
  "Cruz Verde": "#00A651",
  "Salcobrand": "#0055A5",
  "Ahumada": "#E31937",
  "Dr. Simi": "#FFD700",
  "Maicao": "#AF28D1",
  "Knop": "#1C7521",
  "Redfarma": "#7605E5",
  "Independiente": "#AB890F",
  "Otra": "#A6A4A4",
};

export const REGIONES_CHILE = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes",
];

export const NSE_LABELS: Record<string, string> = {
  abc1: "ABC1",
  c2: "C2",
  c3: "C3",
  d: "D",
  e: "E",
};

export const NSE_COLORES: Record<string, string> = {
  abc1: "#2563eb",
  c2: "#7c3aed",
  c3: "#f59e0b",
  d: "#ef4444",
  e: "#6b7280",
};

export const MAP_CENTER: [number, number] = [-33.4489, -70.6693]; // Santiago
export const MAP_ZOOM = 11;
