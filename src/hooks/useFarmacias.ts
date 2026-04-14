import { useState, useEffect } from "react";
import Papa from "papaparse";
import { Farmacia, CadenaFarmaceutica } from "../types";

interface UseFarmaciasResult {
  farmacias: Farmacia[];
  loading: boolean;
  error: string | null;
}

export function useFarmacias(): UseFarmaciasResult {
  const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/data/farmacias.csv")
      .then((res) => {
        if (!res.ok) throw new Error(`No se pudo cargar farmacias.csv (${res.status})`);
        return res.text();
      })
      .then((csv) => {
        const result = Papa.parse<Record<string, string>>(csv, {
          header: true,
          skipEmptyLines: true,
        });

        const parsed: Farmacia[] = result.data
          .filter((row) => row.lat && row.lon)
          .map((row) => ({
            id: row.id?.trim() ?? "",
            nombre: row.nombre?.trim() ?? "",
            cadena: (row.cadena?.trim() as CadenaFarmaceutica) ?? "Otra",
            direccion: row.direccion?.trim() ?? "",
            comuna: row.comuna?.trim() ?? "",
            region: row.region?.trim() ?? "",
            lat: parseFloat(row.lat),
            lon: parseFloat(row.lon),
            tipo: row.tipo?.trim() ?? "",
            telefono: row.telefono?.trim() || undefined,
            horario: row.horario?.trim() || undefined,
            fecha_registro: row.fecha_registro?.trim() || undefined,
          }));

        setFarmacias(parsed);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { farmacias, loading, error };
}
