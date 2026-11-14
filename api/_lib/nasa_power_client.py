"""
NASA POWER API Client
Fetches <15 KB monthly MERRA-2/satellite time series from NASA POWER REST API
and aggregates into annual or seasonal observations without downloading NetCDF files.
"""

import datetime
from typing import Dict, List, Tuple
import requests

POWER_MONTHLY_URL = "https://power.larc.nasa.gov/api/temporal/monthly/point"

SEASON_MONTHS = {
    "annual": ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    "monsoon_jjas": ["06", "07", "08", "09"],
    "seasonal_jjas": ["06", "07", "08", "09"],
    "winter_djf": ["12", "01", "02"],
    "seasonal_djf": ["12", "01", "02"],
}


def fetch_nasa_power_series(
    lat: float,
    lon: float,
    variable_id: str,
    start_year: int = 1981,
    end_year: int = 2025,
    aggregation_mode: str = "annual",
    timeout: int = 10,
) -> Tuple[List[Dict[str, float]], int, str]:
    """
    Fetches monthly MERRA-2/satellite time series from NASA POWER REST API (<15 KB JSON)
    and aggregates into annual or seasonal observations without downloading NetCDF files.

    Returns:
        (yearly_records, missing_months_count, retrieved_at_iso)
    """
    params = {
        "parameters": variable_id,
        "community": "AG",
        "longitude": round(float(lon), 4),
        "latitude": round(float(lat), 4),
        "start": int(start_year),
        "end": int(end_year),
        "format": "JSON",
    }
    resp = requests.get(POWER_MONTHLY_URL, params=params, timeout=timeout)
    resp.raise_for_status()
    payload = resp.json()

    raw_param = payload["properties"]["parameter"][variable_id]
    target_months = SEASON_MONTHS.get(aggregation_mode.lower(), SEASON_MONTHS["annual"])

    missing_months = 0
    yearly_records: List[Dict[str, float]] = []

    for yr in range(int(start_year), int(end_year) + 1):
        vals = []
        for m in target_months:
            key = f"{yr}{m}"
            if key in raw_param:
                v = float(raw_param[key])
                if v <= -990.0:
                    missing_months += 1
                else:
                    vals.append(v)
        # Accept year if at least half of the target months are present
        if len(vals) >= max(1, len(target_months) // 2):
            yearly_records.append({
                "year": yr,
                "value": round(sum(vals) / len(vals), 4),
            })

    retrieved_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
    return yearly_records, missing_months, retrieved_at
