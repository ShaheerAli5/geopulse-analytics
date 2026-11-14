# 08 — Agent 2 Task File: Zero-Download NASA API & Statistical Engine (Dev 2)

**Assigned Role:** Dev 2 — NASA Data Pipeline & Statistical Engine Lead  
**Git Branch:** `feat/dev2-nasa-stats`  
**Exclusive Write Directories:** `api/**`, `scripts/**`, `public/data/golden_demos/**`  
**Forbidden Directories (Do Not Edit):** `src/components/**`, `src/lib/**`, `src/app/**`

---

## 1. Mission & Scope for Agent 2 / Dev 2

You own the scientific heart of GeoPulse Analytics. Your code must satisfy two strict hackathon rules:
1. **Zero Large File Downloads:** Never download multi-megabyte NetCDF or HDF5 granules. Fetch `<15 KB` JSON point/regional time series from the [NASA POWER API](https://power.larc.nasa.gov/) (serving official [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) and satellite meteorology/soil-moisture observations from 1981–present) and pre-cache the 4 Golden Case Files in `public/data/golden_demos/`.
2. **Rigorous Statistical Significance Testing:** Compute Ordinary Least Squares (OLS) regression, the non-parametric **Mann–Kendall trend test**, **Theil–Sen robust slope estimator**, 95% confidence intervals, and lag-1 serial autocorrelation diagnostics using `numpy` and `scipy.stats`, returning the exact `InvestigationResponse` JSON schema defined in `src/types/investigation.ts`.

---

## 2. Files You Must Create in `api/` and `scripts/`

### File 1: `api/_lib/variable_catalog.py`
Defines the 6 core Earth science variables, plain-language student definitions, units, and official NASA verification links:

```python
VARIABLE_CATALOG = {
    "PRECTOTCORR": {
        "name": "Bias-Corrected Total Precipitation",
        "units": "mm/day",
        "mission_model": "NASA MERRA-2 / GPM IMERG Assimilation",
        "plain_definition": (
            "Average daily rain and melted snow reaching the surface, "
            "bias-corrected with satellite and gauge observations."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm",
    },
    "GWETROOT": {
        "name": "Root-Zone Soil Moisture Wetness",
        "units": "fraction (0-1)",
        "mission_model": "NASA GLDAS / MERRA-2 Land Surface Model",
        "plain_definition": (
            "Fraction of water filling soil pores in the top 100 cm root zone "
            "(0 = completely dry soil, 1 = fully saturated soil)."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1",
    },
    "T2M": {
        "name": "Surface Air Temperature (2 Meters)",
        "units": "°C",
        "mission_model": "NASA MERRA-2 / Aqua AIRS",
        "plain_definition": (
            "Air temperature at 2 meters above the ground—the standard meteorological "
            "height for human and crop heat exposure."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/instruments/airs",
    },
    "TS": {
        "name": "Earth Surface Skin Temperature",
        "units": "°C",
        "mission_model": "NASA MODIS / MERRA-2",
        "plain_definition": (
            "Radiometric temperature of the land or water surface skin, which responds "
            "rapidly to vegetation loss, drought, and urbanization."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools",
    },
    "QV2M": {
        "name": "Specific Humidity (2 Meters)",
        "units": "g/kg",
        "mission_model": "NASA AIRS / MERRA-2",
        "plain_definition": (
            "Grams of water vapor per kilogram of air near the ground—a key driver of "
            "humid heatwave intensity and monsoon moisture transport."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/instruments/airs",
    },
    "ALLSKY_SFC_SW_DWN": {
        "name": "All-Sky Surface Shortwave Downward Irradiance",
        "units": "kW-hr/m²/day",
        "mission_model": "NASA CERES / MODIS / OMI Aerosol Proxy",
        "plain_definition": (
            "Total solar energy reaching the ground after passing through clouds, dust, "
            "and smoke aerosols (tracks solar dimming or brightening)."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/instruments/omi/resources",
    },
}
```

### File 2: `api/_lib/nasa_power_client.py`
Fetches `<15 KB` monthly time series from [NASA POWER API](https://power.larc.nasa.gov/), removes `-999` fill values, and aggregates into annual or seasonal series:

```python
import datetime
import requests
from typing import Dict, List, Tuple

POWER_MONTHLY_URL = "https://power.larc.nasa.gov/api/temporal/monthly/point"

SEASON_MONTHS = {
    "annual": ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
    "monsoon_jjas": ["06", "07", "08", "09"],
    "winter_djf": ["12", "01", "02"],
}


def fetch_nasa_power_series(
    lat: float,
    lon: float,
    variable_id: str,
    start_year: int = 1981,
    end_year: int = 2025,
    aggregation_mode: str = "annual",
) -> Tuple[List[Dict[str, float]], int, str]:
    """
    Fetches monthly MERRA-2/satellite time series from NASA POWER REST API (<15 KB JSON)
    and aggregates into annual or seasonal observations without downloading NetCDF files.
    """
    params = {
        "parameters": variable_id,
        "community": "AG",
        "longitude": round(lon, 4),
        "latitude": round(lat, 4),
        "start": start_year,
        "end": end_year,
        "format": "JSON",
    }
    resp = requests.get(POWER_MONTHLY_URL, params=params, timeout=8)
    resp.raise_for_status()
    payload = resp.json()

    raw_param = payload["properties"]["parameter"][variable_id]
    target_months = SEASON_MONTHS.get(aggregation_mode, SEASON_MONTHS["annual"])

    missing_months = 0
    yearly_records = []

    for yr in range(start_year, end_year + 1):
        vals = []
        for m in target_months:
            key = f"{yr}{m}"
            if key in raw_param:
                v = float(raw_param[key])
                if v <= -990.0:
                    missing_months += 1
                else:
                    vals.append(v)
        if len(vals) >= max(1, len(target_months) // 2):
            yearly_records.append({
                "year": yr,
                "value": round(sum(vals) / len(vals), 4),
            })

    retrieved_at = datetime.datetime.now(datetime.timezone.utc).isoformat()
    return yearly_records, missing_months, retrieved_at
```

### File 3: `api/_lib/stats_engine.py`
Computes OLS, Mann–Kendall, Sen's Slope, lag-1 autocorrelation, and the 6-tier `ConfidenceBadge`:

```python
import numpy as np
from scipy import stats
from typing import Any, Dict, List


def analyze_time_series(records: List[Dict[str, float]], units: str) -> Dict[str, Any]:
    years = np.array([r["year"] for r in records], dtype=float)
    values = np.array([r["value"] for r in records], dtype=float)
    n = len(years)

    if n < 10:
        return {
            "series": records,
            "stats": {
                "n_years": n,
                "badge": "INSUFFICIENT_DATA",
                "caveats": ["Fewer than 10 valid annual/seasonal observations available."],
            },
        }

    # 1. Baseline (1981-2010 or series mean) & basic stats
    mean_val = float(np.mean(values))
    std_val = float(np.std(values, ddof=1))

    # 2. Ordinary Least Squares (OLS) Linear Regression
    ols = stats.linregress(years, values)
    slope_yr = float(ols.slope)
    slope_dec = slope_yr * 10.0
    r_squared = float(ols.rvalue ** 2)
    ols_p = float(ols.pvalue)
    t_crit = float(stats.t.ppf(0.975, df=n - 2))
    ci_half_dec = t_crit * float(ols.stderr) * 10.0

    # 3. Mann-Kendall Non-Parametric Trend Test
    tau, mk_p = stats.kendalltau(years, values)
    # Compute explicit S and Z_MK
    s_stat = 0
    for i in range(n - 1):
        s_stat += int(np.sum(np.sign(values[i + 1 :] - values[i])))
    var_s = (n * (n - 1) * (2 * n + 5)) / 18.0
    if s_stat > 0:
        z_mk = (s_stat - 1) / np.sqrt(var_s)
    elif s_stat < 0:
        z_mk = (s_stat + 1) / np.sqrt(var_s)
    else:
        z_mk = 0.0

    # 4. Theil-Sen Robust Slope Estimator
    sen_slope, sen_intercept, sen_low, sen_high = stats.theilslopes(values, years, 0.95)

    # 5. Lag-1 Autocorrelation on OLS Residuals
    ols_fitted = ols.intercept + slope_yr * years
    sen_fitted = sen_intercept + sen_slope * years
    residuals = values - ols_fitted
    if n > 3 and np.std(residuals) > 1e-9:
        lag1_corr = float(np.corrcoef(residuals[:-1], residuals[1:])[0, 1])
    else:
        lag1_corr = 0.0

    # 6. Classify Confidence Badge & Caveats
    caveats = []
    if abs(lag1_corr) > 0.30:
        caveats.append(
            f"Moderate lag-1 serial autocorrelation detected (r1 = {lag1_corr:.2f}); "
            "effective degrees of freedom may be lower than sample count."
        )
    if n < 20:
        caveats.append(f"Short record length ({n} years); climate normals typically span 30+ years.")

    if mk_p < 0.05:
        badge = "INCREASING_SIGNIFICANT" if slope_yr > 0 else "DECREASING_SIGNIFICANT"
    elif abs(tau) < 0.03 and mk_p >= 0.50:
        badge = "NO_MONOTONIC_TREND"
        caveats.append("No consistent monotonic direction detected over the selected timeframe.")
    else:
        badge = "INCREASING_NOT_SIGNIFICANT" if slope_yr > 0 else "DECREASING_NOT_SIGNIFICANT"
        caveats.append(
            f"Observed direction is {'upward' if slope_yr > 0 else 'downward'}, but p = {mk_p:.3f} "
            "does not cross the α = 0.05 significance threshold due to interannual variability."
        )

    enriched_series = []
    for i in range(n):
        enriched_series.append({
            "year": int(years[i]),
            "value": round(float(values[i]), 4),
            "ols_fitted": round(float(ols_fitted[i]), 4),
            "sen_fitted": round(float(sen_fitted[i]), 4),
            "anomaly": round(float(values[i] - mean_val), 4),
        })

    return {
        "series": enriched_series,
        "stats": {
            "n_years": n,
            "mean_value": round(mean_val, 4),
            "std_dev": round(std_val, 4),
            "ols_slope_per_year": round(slope_yr, 5),
            "ols_slope_per_decade": round(slope_dec, 4),
            "ols_r_squared": round(r_squared, 4),
            "ols_p_value": round(ols_p, 5),
            "ols_ci_lower_decade": round(slope_dec - ci_half_dec, 4),
            "ols_ci_upper_decade": round(slope_dec + ci_half_dec, 4),
            "mk_tau": round(float(tau), 4),
            "mk_z_score": round(float(z_mk), 3),
            "mk_p_value": round(float(mk_p), 5),
            "sen_slope_per_decade": round(float(sen_slope * 10.0), 4),
            "sen_ci_lower_decade": round(float(sen_low * 10.0), 4),
            "sen_ci_upper_decade": round(float(sen_high * 10.0), 4),
            "lag1_autocorrelation": round(lag1_corr, 3),
            "badge": badge,
            "caveats": caveats,
        },
    }
```

### File 4: `api/analyze.py`
Standard [Vercel Python Serverless Function](https://vercel.com/docs/functions/runtimes/python) (`BaseHTTPRequestHandler`) that accepts `latA`, `lonA`, `nameA`, optional `latB`, `lonB`, `nameB`, `variable_id`, `aggregation_mode`, `start_year`, `end_year`, calls `fetch_nasa_power_series` + `analyze_time_series`, computes `divergence_detected` (true when Region A and Region B have opposite slope signs or one is significant and the other is not), and returns the complete JSON response in `<1.2s`.

---

## 3. Acceptance Checklist for Dev 2

- [ ] `/api/analyze` returns valid JSON matching `InvestigationResponse` in `<1.5 seconds` with zero NetCDF downloads.
- [ ] `scripts/build_golden_demos.py` pre-generates all 4 Golden Case Files in `public/data/golden_demos/`.
- [ ] Missing values (`-999.0`) from NASA POWER are cleanly filtered and counted.
- [ ] Zero files outside `api/**`, `scripts/**`, and `public/data/golden_demos/**` are modified.
