# 03 — Technical Architecture Document: GeoPulse Analytics

**System Architecture:** Zero-Download, Serverless Unified Monorepo (Next.js + Python Serverless Functions on Vercel)  
**Team:** GeoPulse Analytics  
**Challenge:** [Be An Earth System Trend Detective! (2026 NASA Space Apps Challenge)](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)

---

## 1. High-Level Architecture Overview

To satisfy your two primary engineering constraints—**no large file downloads** and **1-click deployment for judges**—we replace the traditional multi-container geospatial stack with a **Stateless Serverless Hybrid Architecture** deployed as a single project on [Vercel](https://vercel.com/docs/functions/runtimes/python):

```
+-----------------------------------------------------------------------------------+
|                        CLIENT BROWSER (Next.js 14 + React)                        |
|                                                                                   |
|  +-------------------------+  +-----------------------+  +---------------------+  |
|  | Guided Detective Wizard |  | MapLibre GL JS Canvas |  | Recharts / Plotly   |  |
|  | & Golden Case Selector  |  | + Dual Region Pins    |  | Dual Time-Series &  |  |
|  | (Dev 3)                 |  | (Dev 1)               |  | AI Evidence Panel   |  |
|  +------------+------------+  +-----------+-----------+  +----------+----------+  |
+---------------|---------------------------|-------------------------|-------------+
                |                           | WMTS Raster Tiles       | JSON
                |                           v (Zero Backend Load)     | (<25 KB)
                |               +-----------------------+             |
                |               | NASA GIBS WMTS API    |             |
                |               | (MODIS/GPM/MERRA-2)   |             |
                |               +-----------------------+             |
                v                                                     v
+-----------------------------------------------------------------------------------+
|                   VERCEL SERVERLESS RUNTIME (Single GitHub Repo)                  |
|                                                                                   |
|  +---------------------------------------+   +---------------------------------+  |
|  | /public/data/golden_demos/*.json      |   | Python Serverless API (/api/*.py)| |
|  | Pre-verified real NASA time series    |   | - NASA POWER JSON Client        |  |
|  | for instant <50ms offline/judge loads |   | - SciPy/NumPy Stats Engine      |  |
|  +---------------------------------------+   |   (OLS, Mann-Kendall, Sen Slope)|  |
|                                              | - Grounded AI Summary Generator |  |
|                                              +----------------+----------------+  |
+---------------------------------------------------------------|-------------------+
                                                                | HTTPS GET (JSON)
                                                                | (<15 KB payload,
                                                                v  No Auth Needed)
                                               +---------------------------------+
                                               | NASA POWER REST API             |
                                               | (MERRA-2 & Satellite 1981-2025) |
                                               | https://power.larc.nasa.gov/    |
                                               +---------------------------------+
```

---

## 2. Final Technology Stack (Lightweight & Conflict-Free)

| Layer | Technology | Why This Beats the Original Proposal |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 14 (Pages or App Router) + TypeScript + Tailwind CSS** | Zero-config deployment on Vercel; strict TypeScript interfaces prevent integration bugs across the 3 developers. |
| **Interactive Map & Satellite Layers** | **MapLibre GL JS (`react-map-gl`) + [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api)** | Renders official NASA satellite layers (MODIS Terra/Aqua, GPM IMERG, MERRA-2, AIRS, OMI) directly in the browser via standard XYZ/WMTS tile URLs without downloading raw granules. |
| **Time-Series Visualization** | **Recharts** (or lightweight `react-plotly.js`) | Fast, responsive React charts supporting dual-region lines, OLS trend lines, confidence bands, and custom dark-mode scientific tooltips. |
| **Backend & Statistical Engine** | **[Vercel Python Serverless Functions](https://vercel.com/docs/functions/runtimes/python) (`Python 3.11`, `numpy`, `scipy`, `requests`)** | Lives in `/api/analyze.py` inside the same Git repo. Keeps unzipped bundle well below Vercel's [500 MB limit](https://vercel.com/docs/functions/runtimes/python) by avoiding `xarray`/`netCDF4`/`GDAL`. |
| **Primary Live NASA Data Source** | **[NASA POWER API v2](https://power.larc.nasa.gov/)** (`api/temporal/monthly/point`) | Serves official [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) and satellite-derived parameters (1981–present) as `<15 KB` JSON in `<800 ms` with **no API key or Earthdata login required**. |
| **Secondary Hydrological Source** | **[NASA GES DISC Data Rods](https://www.earthdata.nasa.gov/news/feature-articles/data-tool-focus-data-rods-hydrology) & Golden Snapshots** | Provides [GLDAS](https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1) and [GPM IMERG](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm) hydrological time-series rods, pre-cached in `/public/data/golden_demos/` for instant judge reliability. |
| **AI Scientific Interpreter** | **Gemini 2.5 Flash / OpenAI SDK + Deterministic Rule Fallback** | Explains the computed JSON stats in plain English; if no API key is configured or rate-limited, a deterministic scientific template generator produces an equally rigorous report with 0% downtime. |

---

## 3. Zero-Download NASA Data Pipeline Specification

### 3.1 Live Point/Regional Time-Series Endpoint ([NASA POWER API](https://power.larc.nasa.gov/))

Instead of downloading multi-gigabyte NetCDF files, `/api/analyze.py` queries the NASA Langley Research Center POWER REST endpoint:

```http
GET https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=PRECTOTCORR,GWETROOT,T2M,TS,QV2M,ALLSKY_SFC_SW_DWN&community=AG&longitude=75.60&latitude=35.30&start=1981&end=2025&format=JSON
```

- **Payload Size:** `~8 KB` to `14 KB` JSON per 44-year time series.
- **Missing Value Handling:** NASA POWER marks missing values as `-999.0` ([GeoDataViewer NASA POWER Guide](https://geodataviewer.com/datasets/climate-weather/nasapower/)). Our Python parser explicitly filters out `val <= -990` before aggregation and records the exact `missing_months_count` in the provenance metadata.
- **Temporal Aggregation Modes:**
  - `annual`: Computes the annual mean (or annual sum for precipitation) across all 12 months for each year from `start_year` to `end_year` (removes intra-annual seasonal cycle automatically, directly addressing the [challenge brief's](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/) note on seasonal cycles!).
  - `seasonal_jjason` (Monsoon / Summer: Jun–Sep) or `seasonal_djf` (Winter: Dec–Feb): Aggregates only the selected months per year so users can detect seasonal trends (e.g., Summer Monsoon rainfall vs. Winter snow/temperature).

### 3.2 Browser-Direct Satellite Imagery ([NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api))

MapLibre GL JS loads raster tile sources directly from NASA's Global Imagery Browse Services:

```javascript
const GIBS_TILE_URL =
  "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Land_Surface_Temp_Day/default/2024-07-01/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png";
```

---

## 4. Statistical Analysis Engine Specification (`api/_lib/stats_engine.py`)

Given an aggregated time series $(t_1, y_1), (t_2, y_2), \dots, (t_n, y_n)$ where $t_i$ is the year:

1. **Ordinary Least Squares (OLS) Linear Regression (`scipy.stats.linregress`):**
   - Computes linear slope $\beta_1$ (units/year) and decadal rate $10 \times \beta_1$ (units/decade).
   - Computes intercept $\beta_0$, coefficient of determination $R^2 = r^2$, two-sided $p$-value $p_{\text{OLS}}$, and 95% confidence interval for the slope: $\beta_1 \pm t_{0.975, n-2} \cdot SE(\beta_1)$.
2. **Non-Parametric Mann–Kendall Trend Test (`scipy.stats.kendalltau` + explicit $S$ & $Z_{MK}$ calculation):**
   - Evaluates monotonic trend without assuming normal residuals:
     $$S = \sum_{i=1}^{n-1} \sum_{j=i+1}^{n} \text{sgn}(y_j - y_i)$$
   - Computes variance $\text{Var}(S)$ with tie corrections, standardized test statistic $Z_{MK}$, Kendall's $\tau \in [-1, 1]$, and two-sided $p$-value $p_{MK}$.
3. **Theil–Sen Robust Slope Estimator (`scipy.stats.theilslopes`):**
   - Computes median slope across all pairs $(y_j - y_i)/(t_j - t_i)$ (`sen_slope_per_year`, `sen_slope_per_decade`) plus 95% confidence bounds, providing high resistance to extreme outlier years (e.g., the 2022 Pakistan super-flood anomaly).
4. **Lag-1 Autocorrelation Check:**
   - Computes lag-1 serial correlation $r_1$ on residuals; if $|r_1| > 0.30$, attaches a transparent diagnostic caveat warning that positive serial dependence can inflate significance.
5. **6-Tier Confidence Classification Badge:**
   - `INCREASING_SIGNIFICANT`: $\text{slope} > 0$ and $p_{MK} < 0.05$
   - `DECREASING_SIGNIFICANT`: $\text{slope} < 0$ and $p_{MK} < 0.05$
   - `INCREASING_NOT_SIGNIFICANT`: $\text{slope} > 0$ and $p_{MK} \ge 0.05$
   - `DECREASING_NOT_SIGNIFICANT`: $\text{slope} < 0$ and $p_{MK} \ge 0.05$
   - `NO_MONOTONIC_TREND`: $|\tau| < 0.03$ and $p_{MK} \ge 0.50$
   - `INSUFFICIENT_DATA`: $n < 10$ valid years

---

## 5. Frozen Shared Data Contract (`src/types/investigation.ts`)

This contract is locked in Hour 1 so all 3 developers can work simultaneously without blocking each other:

```typescript
export type ConfidenceBadge =
  | "INCREASING_SIGNIFICANT"
  | "DECREASING_SIGNIFICANT"
  | "INCREASING_NOT_SIGNIFICANT"
  | "DECREASING_NOT_SIGNIFICANT"
  | "NO_MONOTONIC_TREND"
  | "INSUFFICIENT_DATA";

export interface RegionInput {
  id: "A" | "B";
  name: string;
  lat: number;
  lon: number;
}

export interface TimeSeriesPoint {
  year: number;
  value: number;
  ols_fitted: number;
  sen_fitted: number;
  anomaly: number;
}

export interface StatisticalResult {
  n_years: number;
  mean_value: number;
  std_dev: number;
  ols_slope_per_year: number;
  ols_slope_per_decade: number;
  ols_r_squared: number;
  ols_p_value: number;
  ols_ci_lower_decade: number;
  ols_ci_upper_decade: number;
  mk_tau: number;
  mk_z_score: number;
  mk_p_value: number;
  sen_slope_per_decade: number;
  sen_ci_lower_decade: number;
  sen_ci_upper_decade: number;
  lag1_autocorrelation: number;
  badge: ConfidenceBadge;
  caveats: string[];
}

export interface RegionAnalysis {
  region: RegionInput;
  series: TimeSeriesPoint[];
  stats: StatisticalResult;
}

export interface InvestigationResponse {
  investigation_id: string;
  variable_id: string;
  variable_name: string;
  units: string;
  plain_definition: string;
  aggregation_mode: "annual" | "monsoon_jjas" | "winter_djf";
  start_year: number;
  end_year: number;
  provenance: {
    source_name: string;
    mission_model: string;
    api_endpoint: string;
    spatial_resolution: string;
    missing_months_filtered: number;
    retrieved_at_utc: string;
    verification_links: { label: string; url: string }[];
  };
  region_a: RegionAnalysis;
  region_b?: RegionAnalysis;
  divergence_detected: boolean;
  ai_interpretation: {
    headline: string;
    what_is_changing: string;
    where_it_diverges: string;
    statistical_verdict: string;
    limitations_and_caveats: string;
    generated_by: "ai_grounded" | "deterministic_scientific_engine";
  };
}
```
