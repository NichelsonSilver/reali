"""
Genera datos mock realistas para desarrollo del dashboard.

Uso:
    python scripts/generate_mock.py
"""

import csv
import random
from datetime import datetime, timedelta

CADENAS = ["Cruz Verde", "Ahumada", "Salcobrand", "Dr. Simi", "Knop", "Redfarma", "Independiente"]
CADENA_WEIGHTS = [0.25, 0.22, 0.20, 0.10, 0.05, 0.05, 0.13]

COMUNAS_RM = [
    ("Las Condes", -33.41, -70.58),
    ("Providencia", -33.43, -70.61),
    ("Santiago", -33.45, -70.66),
    ("Ñuñoa", -33.46, -70.60),
    ("Vitacura", -33.39, -70.58),
    ("Lo Barnechea", -33.35, -70.52),
    ("La Reina", -33.45, -70.55),
    ("Maipú", -33.51, -70.76),
    ("Puente Alto", -33.61, -70.58),
    ("La Florida", -33.52, -70.60),
    ("Peñalolén", -33.49, -70.55),
    ("Macul", -33.49, -70.60),
    ("San Miguel", -33.50, -70.65),
    ("Recoleta", -33.40, -70.64),
    ("Independencia", -33.42, -70.67),
]

NSE_PROFILES = {
    "Las Condes": (0.45, 0.25, 0.15, 0.10, 0.05),
    "Providencia": (0.40, 0.28, 0.18, 0.10, 0.04),
    "Santiago": (0.10, 0.20, 0.30, 0.25, 0.15),
    "Maipú": (0.05, 0.15, 0.30, 0.30, 0.20),
    "Puente Alto": (0.03, 0.10, 0.25, 0.35, 0.27),
}


def generate_farmacias(n=500):
    rows = []
    for i in range(n):
        comuna, base_lat, base_lon = random.choice(COMUNAS_RM)
        cadena = random.choices(CADENAS, weights=CADENA_WEIGHTS, k=1)[0]
        lat = base_lat + random.uniform(-0.03, 0.03)
        lon = base_lon + random.uniform(-0.03, 0.03)
        rows.append({
            "id": f"F{i+1:05d}",
            "nombre": f"Farmacia {cadena} {comuna} {i+1}",
            "cadena": cadena,
            "direccion": f"Av. Ejemplo {random.randint(100, 9999)}, {comuna}",
            "comuna": comuna,
            "region": "Metropolitana",
            "lat": round(lat, 6),
            "lon": round(lon, 6),
            "tipo": random.choice(["Farmacia", "Farmacia con recetario"]),
            "telefono": f"+569{random.randint(10000000, 99999999)}",
            "horario": random.choice(["08:00-22:00", "09:00-21:00", "24 horas", "08:30-20:30"]),
        })

    with open("public/data/farmacias.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"✓ {n} farmacias mock → public/data/farmacias.csv")
    return rows


def generate_demografia():
    rows = []
    for i, (comuna, lat, lon) in enumerate(COMUNAS_RM):
        profile = NSE_PROFILES.get(comuna, (0.10, 0.20, 0.30, 0.25, 0.15))
        for manzana in range(1, random.randint(20, 60)):
            pob = random.randint(50, 800)
            rows.append({
                "zona_censal": f"ZC{i+1:03d}",
                "manzana": f"MZ{i+1:03d}-{manzana:03d}",
                "poblacion": pob,
                "hogares": pob // random.randint(2, 4),
                "nse_abc1": round(pob * profile[0] * random.uniform(0.7, 1.3)),
                "nse_c2": round(pob * profile[1] * random.uniform(0.7, 1.3)),
                "nse_c3": round(pob * profile[2] * random.uniform(0.7, 1.3)),
                "nse_d": round(pob * profile[3] * random.uniform(0.7, 1.3)),
                "nse_e": round(pob * profile[4] * random.uniform(0.7, 1.3)),
                "ingreso_promedio": random.randint(300000, 3500000),
            })

    with open("public/data/demografia.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        writer.writerows(rows)
    print(f"✓ {len(rows)} manzanas mock → public/data/demografia.csv")


def generate_movimientos(farmacias):
    movs = []
    # 15 aperturas, 8 cierres
    for farm in random.sample(farmacias, min(15, len(farmacias))):
        movs.append({**farm, "tipo_movimiento": "apertura", "fecha_deteccion": "2026-04-01"})
    for farm in random.sample(farmacias, min(8, len(farmacias))):
        movs.append({
            "id": farm["id"], "nombre": farm["nombre"], "cadena": farm["cadena"],
            "comuna": farm["comuna"], "region": farm["region"],
            "lat": farm["lat"], "lon": farm["lon"],
            "tipo_movimiento": "cierre", "fecha_deteccion": "2026-04-01"
        })

    cols = ["id", "nombre", "cadena", "comuna", "region", "lat", "lon", "tipo_movimiento", "fecha_deteccion"]
    with open("public/data/movimientos.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=cols)
        writer.writeheader()
        for m in movs:
            writer.writerow({k: m.get(k, "") for k in cols})
    print(f"✓ {len(movs)} movimientos mock → public/data/movimientos.csv")


if __name__ == "__main__":
    farmacias = generate_farmacias(500)
    generate_demografia()
    generate_movimientos(farmacias)
    print("\n✓ Datos mock generados. Listo para npm run dev.")
