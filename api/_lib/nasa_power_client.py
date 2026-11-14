"""
NASA POWER API Client
Fetches <15 KB monthly MERRA-2/satellite time series from NASA POWER REST API
and aggregates into annual or seasonal observations without downloading NetCDF files.
"""

import datetime
import time
from typing import Dict, List, Tuple
import requests

POWER_MONTHLY_URL = "https://power.larc.nasa.gov/api/temporal/monthly/point"

SEASON_MONTHS = {
    "annual": ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    "monsoon_jjas": ["06", "07", "08", "09"],
    "monsoon": ["06", "07", "08", "09"],
    "seasonal_jjas": ["06", "07", "08", "09"],
    "seasonal_jjason": ["06", "07", "08", "09"],
    "winter_djf": ["12", "01", "02"],
    "winter": ["12", "01", "02"],
    "seasonal_djf": ["12", "01", "02"],
}


def normalize_coords(lat: float, lon: float) -> Tuple[float, float]:
    """Clamps latitude to Web Mercator limits and wraps longitude into [-180, 180]."""
    clamped_lat = max(-85.05, min(85.05, float(lat)))
    normalized_lon = ((((float(lon) + 180.0) % 360.0) + 360.0) % 360.0) - 180.0
    return round(clamped_lat, 4), round(normalized_lon, 4)


def fetch_nasa_power_series(
    lat: float,
    lon: float,
    variable_id: str,
    start_year: int = 1981,
    end_year: int = 2025,
    aggregation_mode: str = "annual",
    timeout: int = 12,
    max_retries: int = 2,
) -> Tuple[List[Dict[str, float]], int, str]:
    """
    Fetches monthly MERRA-2/satellite time series from NASA POWER REST API (<15 KB JSON)
    and aggregates into annual or seasonal observations without downloading NetCDF files.

    Returns:
        (yearly_records, missing_months_count, retrieved_at_iso)
    """
    clean_lat, clean_lon = normalize_coords(lat, lon)
    v_id = str(variable_id).strip().upper()

    # Ensure start_year <= end_year and bounded within NASA data coverage
    sy = min(int(start_year), int(end_year))
    ey = max(int(start_year), int(end_year))
    sy = max(1981, min(2025, sy))
    ey = max(1981, min(2025, ey))

    params = {
        "parameters": v_id,
        "community": "AG",
        "longitude": clean_lon,
        "latitude": clean_lat,
        "start": sy,
        "end": ey,
        "format": "JSON",
    }

    last_err = None
    payload = None
    for attempt in range(1, max_retries + 1):
        try:
            resp = requests.get(POWER_MONTHLY_URL, params=params, timeout=timeout)
            resp.raise_for_status()
            payload = resp.json()
            break
        except (requests.RequestException, ValueError) as err:
            last_err = err
            if attempt < max_retries:
                time.sleep(1.0)

    if payload is None:
        raise RuntimeError(
            f"Failed to query NASA POWER API ({clean_lat}, {clean_lon}, {v_id}) after {max_retries} attempts: {last_err}"
        )

    raw_param = payload.get("properties", {}).get("parameter", {}).get(v_id)
    if not raw_param:
        raise ValueError(f"NASA POWER API returned no data for parameter '{v_id}'")

    mode_key = str(aggregation_mode).lower().strip()
    target_months = SEASON_MONTHS.get(mode_key, SEASON_MONTHS["annual"])

    missing_months = 0
    yearly_records: List[Dict[str, float]] = []

    for yr in range(sy, ey + 1):
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

