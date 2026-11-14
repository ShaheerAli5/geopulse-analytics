# 02 — Product Requirements Document (PRD): GeoPulse Analytics

**Product Name:** GeoPulse — Earth System Trend Detective Workbench  
**Team:** GeoPulse Analytics  
**Challenge:** [Be An Earth System Trend Detective! (2026 NASA Space Apps Challenge)](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)  
**Target Release:** 48-Hour Hackathon MVP (Public Vercel URL for Judges)

---

## 1. Product Vision & Goals

Build a web-based scientific investigation workbench that enables high school/college students, educators, and citizen scientists to act as **Earth System Trend Detectives**—selecting Earth observation variables, comparing two regions simultaneously to uncover regional divergence, visualizing multi-decade time series (1981–present), testing statistical significance, and generating evidence-backed plain-language reports with **zero large file downloads**.

### Core Non-Functional Constraints (Mandatory)

1. **Zero Large File Downloads:** Neither the client browser nor the backend server may download raw multi-megabyte/gigabyte NetCDF or HDF5 granules. All time-series payloads must be `< 50 KB` JSON/CSV retrieved via lightweight NASA subsetting APIs ([NASA POWER API](https://power.larc.nasa.gov/) and [GES DISC Data Rods](https://www.earthdata.nasa.gov/news/feature-articles/data-tool-focus-data-rods-hydrology)).
2. **Instant Judge Testability:** The web app must be publicly accessible via a single URL (Vercel), require **zero user login or NASA Earthdata account setup** by judges, and render a complete statistical investigation within **1.5 seconds** of clicking a preset Case File or within **3 seconds** of clicking any custom map location.
3. **Zero Merge Conflicts for 3 Developers:** All features must map cleanly into 3 isolated module boundaries (`Map/UI`, `Data/Stats API`, `Guided Detective/AI/Demo`).

---

## 2. Target Audience & User Personas

Per the [challenge brief](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/), our primary users are:

1. **The Student Investigator (High School / College STEM Student):** Needs plain-English definitions of variables (e.g., what "Root-Zone Soil Wetness" means), guided question prompts, and clear visual explanations of what a $p$-value or Mann–Kendall test means.
2. **The Educator / Citizen Scientist:** Wants to compare two regions (e.g., Northern vs. Southern Pakistan, or Urban vs. Rural) to see why a climate process causes opposite trends in different areas, and export a clean report.
3. **The Space Apps Judge:** Has 2–3 minutes to evaluate the submission against **Impact, Creativity, Validity, Relevance, and Presentation** ([Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/)). Needs 1-click "Golden Case Files" that immediately showcase the complete end-to-end workflow without waiting on slow jobs.

---

## 3. Core User Stories & Acceptance Criteria

| ID | User Story | Acceptance Criteria | Priority |
| :--- | :--- | :--- | :--- |
| **US-01** | As a user, I want to pick a guided investigation question or preset "Detective Case File" so I know which NASA variables to analyze without being overwhelmed. | Clicking a Case File or answering the 2-step wizard (*Topic* + *Region*) automatically selects the variable, loads plain-language definitions, and centers the map. | **P0 (Must-Have)** |
| **US-02** | As a user, I want to select **Region A** (and optionally **Region B**) on an interactive map with NASA satellite layers so I can investigate regional divergence. | MapLibre GL JS renders [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api) satellite layers and allows selecting preset regional pins or clicking any coordinate on Earth for Region A and Region B. | **P0 (Must-Have)** |
| **US-03** | As a user, I want to fetch multi-decade monthly or annual NASA Earth science data (1981–present) without downloading massive files. | Backend retrieves `<15 KB` JSON from [NASA POWER API](https://power.larc.nasa.gov/) ([MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2)) or pre-cached Golden JSON (`GLDAS`/`GPM`/`MERRA-2`) in `<2s`. | **P0 (Must-Have)** |
| **US-04** | As a user, I want to view an interactive time-series chart with an overlaid linear trend line and 95% confidence band. | Chart displays raw monthly/annual observations, OLS regression line, Sen's slope line, unit labels, and hover tooltips for both Region A and Region B. | **P0 (Must-Have)** |
| **US-05** | As a user, I want rigorous statistical significance testing so I know whether an observed change is a real trend or random noise. | Backend returns OLS slope, $R^2$, Mann–Kendall $\tau$, $Z$-score, $p$-value, Sen's slope, 95% confidence interval, and a 6-tier Confidence Badge. | **P0 (Must-Have)** |
| **US-06** | As a user, I want a plain-language AI Detective Summary that explains the statistical findings and caveats without inventing numbers. | Interpreter consumes only the verified statistical JSON output, quotes exact slopes and $p$-values, explains physical processes, and includes a deterministic fallback if LLM API is offline. | **P1 (Should-Have)** |
| **US-07** | As a user, I want full data provenance and a downloadable Reproducible Investigation Report. | UI displays exact NASA dataset ID, spatial resolution, temporal coverage, missing-data count, direct verification links to [NASA Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/) and [CUAHSI](https://www.cuahsi.org/), and a 1-click Markdown/Print export. | **P1 (Should-Have)** |

---

## 4. Curated NASA Variable Catalog (MVP Scope)

To prevent variable overload while covering land, atmosphere, and hydrology, GeoPulse exposes **6 core variables** with plain-language cards:

| Variable ID | Plain-Language Name | NASA Source Mission / Model | Zero-Download API Parameter | Units | Plain-Language Student Definition |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PRECTOTCORR` | **Total Precipitation (Rainfall & Snow)** | [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) / [GPM IMERG](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm) | NASA POWER `PRECTOTCORR` & GES DISC GPM Rod | `mm/day` | Average daily rain and melted snow reaching the ground, bias-corrected using satellite gauge observations. |
| `GWETROOT` | **Root-Zone Soil Moisture** | [GLDAS](https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1) / [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) Land | NASA POWER `GWETROOT` & GLDAS Rod | `dimensionless (0–1)` | Fraction of water filling the soil pores in the top 100 cm where plant roots absorb water (0 = bone dry, 1 = completely saturated). |
| `T2M` | **Surface Air Temperature (2m)** | [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) / [AIRS](https://www.earthdata.nasa.gov/data/instruments/airs) | NASA POWER `T2M` | `°C` | Air temperature at 2 meters above the surface—the standard height for measuring human and agricultural heat exposure. |
| `TS` | **Earth Skin Temperature** | [MODIS](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools) / [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) | NASA POWER `TS` | `°C` | Radiometric temperature of the actual land or water surface ("skin"), which heats and cools faster than the air above it. |
| `QV2M` | **Atmospheric Specific Humidity** | [AIRS](https://www.earthdata.nasa.gov/data/instruments/airs) / [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) | NASA POWER `QV2M` | `g/kg` | Grams of water vapor per kilogram of air near the surface—a key indicator of atmospheric moisture and heat-index intensification. |
| `ALLSKY_SFC_SW_DWN` | **Surface Solar Irradiance (Cloud/Aerosol Proxy)** | [OMI](https://www.earthdata.nasa.gov/data/instruments/omi/resources) / [MODIS](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools) / CERES | NASA POWER `ALLSKY_SFC_SW_DWN` | `kW-hr/m²/day` | Total sunlight reaching the ground after passing through clouds, smoke, dust, and urban aerosols (solar dimming/brightening). |

---

## 5. Pre-Loaded "Golden Detective Case Files" (Instant Judge Demos)

To guarantee a flawless demo and directly illustrate **Regional Divergence**, the app ships with 4 pre-verified, instant-load Case Files stored as real NASA JSON snapshots in `/public/data/golden_demos/`:

1. **Case #1 (Flagship Demo): Pakistan's Hydrological Divergence (1981–2025)**
   - **Region A:** Upper Indus / Gilgit-Baltistan & KP (`35.30°N, 75.60°E`) — Shows increasing summer precipitation and glacial-melt temperature trends.
   - **Region B:** Southwestern Balochistan (`27.50°N, 64.00°E`) — Shows declining root-zone soil moisture (`GWETROOT`) and intensifying aridification over the exact same period.
   - **Scientific Takeaway:** Demonstrates how a single monsoon/westerly shift creates opposite hydro-climatic trends across two regions of the same country.
2. **Case #2: South Asian Heat Envelope — Jacobabad vs. Karachi Coastal Moderation (1981–2025)**
   - Compares inland extreme skin/air temperature trends (`T2M`, `TS`) and specific humidity (`QV2M`) between Jacobabad (`28.28°N, 68.44°E`) and coastal Karachi (`24.86°N, 67.01°E`).
3. **Case #3: Central Asian Water Loss — Aral Sea Basin vs. Upstream Tien Shan (1981–2025)**
   - Compares root-zone soil wetness (`GWETROOT`) and surface skin temperature amplification in the desiccated Aral Sea basin (`45.00°N, 59.50°E`) against upstream mountain precipitation.
4. **Case #4: Amazon Basin Drying — Southern Deforestation Arc vs. Central Amazon Core (1981–2025)**
   - Compares precipitation (`PRECTOTCORR`) and soil wetness trends between Mato Grosso (`-12.50°S, -55.50°W`) and the intact central rainforest (`-3.10°S, -60.00°W`).

---

## 6. Out of Scope (Strict Hackathon Guardrails)

- **No Raw NetCDF/HDF5 Downloads or `xarray` Grid Subsetting:** Strictly forbidden to keep serverless bundle size under 50 MB and response times under 2 seconds.
- **No User Accounts, Login Walls, or Database Setup:** Saved investigations are stored in browser `localStorage` and shareable via URL query parameters (`?case=pk-divergence` or `?latA=35.3&lonA=75.6&var=GWETROOT`).
- **No Complex Non-Linear / ARIMA Forecasting:** Per the [challenge brief](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/), non-linear trend modeling is beyond the core scope; we focus on rock-solid linear/monotonic trend detection (OLS, Mann–Kendall, Sen's Slope) with seasonal aggregation options (Annual Mean vs. Specific Season/Month).
