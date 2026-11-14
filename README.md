# GeoPulse Analytics — Earth System Trend Detective Workbench

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026-blue.svg?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)
[![Challenge Track](https://img.shields.io/badge/Track-Earth%20System%20Trend%20Detective-06B6D4.svg?style=for-the-badge)](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Framework](https://img.shields.io/badge/Next.js-14-black.svg?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=for-the-badge&logo=python)](https://python.org)
[![Runtime](https://img.shields.io/badge/Deployment-Vercel%20Serverless-000000.svg?style=for-the-badge&logo=vercel)](https://vercel.com)

> **Be An Earth System Trend Detective!**  
> A zero-download, browser-accessible scientific investigation workbench turning plain-language environmental questions into dual-region statistical trend comparisons backed by 44+ years of real NASA satellite and reanalysis data in under 3 seconds.

---

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. The Challenge & Scientific Problem](#2-the-challenge--scientific-problem)
- [3. The GeoPulse Solution](#3-the-geopulse-solution)
- [4. Key Innovations & Features](#4-key-innovations--features)
- [5. NASA Earth Science Data Integration](#5-nasa-earth-science-data-integration)
- [6. Statistical & Detection Engine](#6-statistical--detection-engine)
- [7. System Architecture](#7-system-architecture)
- [8. Repository Structure & Conflict-Free 3-Dev Split](#8-repository-structure--conflict-free-3-dev-split)
- [9. Golden Case Files (Instant Judge Demos)](#9-golden-case-files-instant-judge-demos)
- [10. Installed Agent Skills](#10-installed-agent-skills)
- [11. Quick Start & Local Setup](#11-quick-start--local-setup)
- [12. Alignment with NASA Judging Criteria](#12-alignment-with-nasa-judging-criteria)
- [13. Documentation Index](#13-documentation-index)
- [14. License & Acknowledgments](#14-license--acknowledgments)

---

## 1. Executive Summary

Global averages mask local climate realities. Even when driven by the exact same physical climate mechanism, a single Earth observation variable often trends in opposite directions across neighboring regions—such as Northern Pakistan experiencing intensifying monsoon precipitation and glacial melt while Southern Pakistan faces accelerating aridification and root-zone water loss.

**GeoPulse Analytics** is built for students, educators, and citizen scientists to uncover and understand these regional climate signals. Designed strictly for instant testability during the **2026 NASA Space Apps Challenge**, GeoPulse solves the data bottleneck through a **zero-large-file-download architecture**:

- Instead of downloading gigabytes of raw NetCDF/HDF5 granules, it queries lightweight JSON REST endpoints ([NASA POWER API](https://power.larc.nasa.gov/) for MERRA-2 and satellite time series) in `<15 KB` payloads.
- It streams browser-direct satellite imagery tiles from [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api) without any backend raster processing overhead.
- It executes synchronous parametric (OLS Regression, 95% CI) and non-parametric (Mann–Kendall, Sen's Slope) statistical tests in `<50 ms`.
- It generates evidence-grounded, hallucination-free AI explanations alongside transparent data provenance and links to [NASA Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/) and [CUAHSI HydroClient](https://data.cuahsi.org/).

---

## 2. The Challenge & Scientific Problem

Per the official NASA challenge brief [Be An Earth System Trend Detective!](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/):

1. **Variable Overload:** NASA missions ([MODIS](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools), [AIRS](https://www.earthdata.nasa.gov/data/instruments/airs), [GPM](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm), [OMI](https://www.earthdata.nasa.gov/data/instruments/omi/resources)) and reanalysis models ([MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2), [GLDAS](https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1)) produce hundreds of specialized variables. Non-specialists struggle to determine which variable answers a real-world question (e.g., distinguishing soil wetness from rainfall or surface skin temperature from 2m air temperature).
2. **Regional Divergence:** Earth system trends are rarely uniform. Climate shifts cause regional divergence: one valley gets wetter while an adjacent plateau dries out. Global trends obscure these critical local vulnerabilities.
3. **Signal vs. Noise:** Short-term weather noise frequently mimics long-term climate trends. Users need statistically sound tools to verify whether an observed rate of change is **statistically significant** ($p < 0.05$) or merely random multi-year variation.

---

## 3. The GeoPulse Solution

GeoPulse translates complex Earth observation data into a **Single-Screen "Detective Workbench"** operating in four synchronized steps:

```
+---------------------------------------------------------------------------------------------------+
| 1. ASK / SELECT CASE FILE     -->  2. PIN DUAL REGIONS      -->  3. COMPUTE STATS  -->  4. VERIFY |
|    4 Pre-Cached Golden Demos       Region A (Cyan Pin)           Parametric (OLS)       AI Report |
|    OR 2-Step Guided Wizard         Region B (Coral Pin)          Non-Parametric (MK)    Provenance|
|    Plain-Language Definitions      NASA GIBS Satellite Layer     Sen's Robust Slope     Export PDF|
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Key Innovations & Features

- **Side-by-Side Regional Divergence Mode:** Simultaneously pin **Region A (Cyan)** and **Region B (Coral)** anywhere on Earth to compare slopes, confidence intervals, and trend significance on a shared time-series canvas.
- **Zero-Download NASA Data Pipeline:** Replaces gigabyte-scale NetCDF downloads with sub-second, sub-15 KB JSON queries via the NASA POWER API and GES DISC Data Rods.
- **Direct NASA GIBS Satellite Streaming:** Visualizes live satellite overlays (MODIS Land Surface Temp, GPM Precipitation Rate, AIRS, OMI) rendered directly in MapLibre GL JS without server-side raster decoding.
- **Dual Parametric & Non-Parametric Engine:** Automatically evaluates OLS regression ($R^2$, slope/decade, 95% CI) and non-parametric Mann–Kendall test ($\tau$, $Z_{MK}$, $p$-value) alongside Theil–Sen robust slope estimation.
- **Seasonal Cycle Aggregation:** Isolates long-term trends from seasonal fluctuations with 1-click filters for **Annual**, **Monsoon (JJAS)**, and **Winter (DJF)** aggregation modes.
- **Evidence-Grounded AI Interpreter:** Feeds verified statistical outputs into an LLM interpreter strictly bound to calculated values, backed by a **100% deterministic rule-based fallback** that guarantees uptime.
- **1-Click Reproducible Export:** Generates downloadable Markdown reports and Print-to-PDF case summaries with complete NASA dataset IDs, geographic coordinates, and verification links.
- **Shareable URL State:** Encodes active variables, coordinates, and aggregation settings directly into the URL for instant review and citation.

---

## 5. NASA Earth Science Data Integration

GeoPulse curates 6 core Earth observation variables spanning atmosphere, land, and hydrology:

| Variable ID | Plain-Language Name | Mission / Model Source | Query Parameter | Native Units | Scientific Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `PRECTOTCORR` | **Total Precipitation** | [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) / [GPM IMERG](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm) | `PRECTOTCORR` | `mm/day` | Bias-corrected precipitation reaching the surface. |
| `GWETROOT` | **Root-Zone Soil Moisture** | [GLDAS](https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1) / [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) Land | `GWETROOT` | `0–1 (fraction)` | Water saturation in the top 100 cm root zone. |
| `T2M` | **Surface Air Temperature** | [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) / [AIRS](https://www.earthdata.nasa.gov/data/instruments/airs) | `T2M` | `°C` | Air temperature at 2 meters above ground. |
| `TS` | **Earth Skin Temperature** | [MODIS Terra/Aqua](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools) / MERRA-2 | `TS` | `°C` | Radiometric surface temperature of land/water. |
| `QV2M` | **Specific Humidity** | [AIRS](https://www.earthdata.nasa.gov/data/instruments/airs) / [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) | `QV2M` | `g/kg` | Near-surface water vapor concentration. |
| `ALLSKY_SFC_SW_DWN` | **Surface Solar Irradiance** | [OMI](https://www.earthdata.nasa.gov/data/instruments/omi/resources) / [MODIS](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools) / CERES | `ALLSKY_SFC_SW_DWN` | `kW-hr/m²/day` | Sunlight reaching ground (solar dimming/brightening). |

### External Verification Portals
Every investigation includes direct deep-links to official verification tools:
- [NASA Giovanni (GES DISC)](https://giovanni.gsfc.nasa.gov/giovanni/): Interactively inspect and cross-verify gridded MERRA-2, GLDAS, and GPM data.
- [NASA Worldview](https://www.earthdata.nasa.gov/data/tools/worldview): Browse global full-resolution daily satellite imagery.
- [CUAHSI HydroClient](https://data.cuahsi.org/): Compare against hydrological in-situ observation networks.

---

## 6. Statistical & Detection Engine

Located in `api/_lib/stats_engine.py`, the analysis engine runs synchronously on 1981–2025 time-series data:

1. **Ordinary Least Squares (OLS) Linear Regression:**
   - Linear rate of change per decade ($10 \times \beta_1$)
   - Intercept $\beta_0$, $R^2$, standard error, and two-sided $p_{\text{OLS}}$
   - 95% Confidence Interval: $\beta_1 \pm t_{0.975, n-2} \cdot \text{SE}(\beta_1)$
2. **Mann–Kendall Non-Parametric Monotonic Trend Test:**
   - Evaluates rank-order concordance without assuming normal residuals:
     $$S = \sum_{i=1}^{n-1} \sum_{j=i+1}^{n} \text{sgn}(y_j - y_i)$$
   - Standardized test statistic $Z_{MK}$, Kendall's rank correlation coefficient $\tau \in [-1, 1]$, and two-sided significance $p_{MK}$.
3. **Theil–Sen Robust Slope Estimator:**
   - Computes the median slope among all point pairs: provides robust estimation resistant to extreme weather anomalies (e.g., 2022 Pakistan floods).
4. **Lag-1 Autocorrelation Diagnostic:**
   - Flags serial correlation ($|r_1| > 0.30$) to alert users when red noise might artificially inflate trend significance.
5. **6-Tier Confidence Classification:**
   - `INCREASING_SIGNIFICANT` ($p < 0.05, \text{slope} > 0$)
   - `DECREASING_SIGNIFICANT` ($p < 0.05, \text{slope} < 0$)
   - `INCREASING_NOT_SIGNIFICANT` ($p \ge 0.05, \text{slope} > 0$)
   - `DECREASING_NOT_SIGNIFICANT` ($p \ge 0.05, \text{slope} < 0$)
   - `NO_MONOTONIC_TREND` ($|\tau| < 0.03, p \ge 0.50$)
   - `INSUFFICIENT_DATA` ($n < 10$ valid years)

---

## 7. System Architecture

GeoPulse runs as a unified serverless monorepo on Vercel, pairing a Next.js App Router frontend with lightweight Python serverless functions.

```
+-----------------------------------------------------------------------------------+
|                        CLIENT BROWSER (Next.js 14 + React)                        |
|                                                                                   |
|  +-------------------------+  +-----------------------+  +---------------------+  |
|  | Guided Detective Wizard |  | MapLibre GL JS Canvas |  | Recharts            |  |
|  | & Golden Case Selector  |  | + Dual Region Pins    |  | Dual Time-Series &  |  |
|  | (Dev 3)                 |  | (Dev 1)               |  | AI Evidence Panel   |  |
|  +------------+------------+  +-----------+-----------+  +----------+----------+  |
+---------------|---------------------------|-------------------------|-------------+
                |                           | WMTS Raster Tiles       | JSON (<25 KB)
                |                           v (Direct to Browser)     |
                |               +-----------------------+             |
                |               | NASA GIBS WMTS API    |             |
                |               | (MODIS / GPM / AIRS)  |             |
                |               +-----------------------+             |
                v                                                     v
+-----------------------------------------------------------------------------------+
|                   VERCEL SERVERLESS RUNTIME (Single Git Repo)                     |
|                                                                                   |
|  +---------------------------------------+   +---------------------------------+  |
|  | /public/data/golden_demos/*.json      |   | Python Serverless API (/api/*.py)| |
|  | Pre-cached real NASA time series      |   | - NASA POWER JSON Client        |  |
|  | for instant <50ms offline loads      |   | - SciPy/NumPy Stats Engine      |  |
|  +---------------------------------------+   |   (OLS, Mann-Kendall, Sen Slope)|  |
|                                              | - Grounded AI Summary Generator |  |
|                                              +----------------+----------------+  |
+---------------------------------------------------------------|-------------------+
                                                                | HTTPS GET (<15 KB JSON)
                                                                v (No Auth Needed)
                                               +---------------------------------+
                                               | NASA POWER REST API             |
                                               | (MERRA-2 & Satellite 1981-2025) |
                                               | https://power.larc.nasa.gov/    |
                                               +---------------------------------+
```

---

## 8. Repository Structure & Conflict-Free 3-Dev Split

To enable three developers to build simultaneously without Git merge conflicts, the codebase enforces **strict directory boundaries** governed by a shared TypeScript contract (`src/types/investigation.ts`):

```text
geopulse-analytics/
├── package.json                        # Locked dependencies (Next.js, MapLibre, Recharts)
├── requirements.txt                    # Locked Python dependencies (numpy, scipy, requests)
├── vercel.json                         # Serverless runtime configuration
├── README.md                           # Main project documentation
│
├── src/
│   ├── types/
│   │   └── investigation.ts            # FROZEN SHARED DATA CONTRACT
│   ├── app/
│   │   ├── layout.tsx                  # Root HTML shell
│   │   └── page.tsx                    # Thin 4-slot layout container
│   │
│   ├── components/
│   │   ├── workbench/                  # ---> DEV 1: MAP & TIME-SERIES VISUALS
│   │   │   ├── MapCanvas.tsx           # MapLibre GL JS + Dual Pins
│   │   │   ├── GibsLayerConfig.ts      # NASA GIBS WMTS tile definitions
│   │   │   ├── ControlSidebar.tsx      # Variable dropdown & coordinate inputs
│   │   │   └── TrendChart.tsx          # Recharts dual-series with OLS & Sen lines
│   │   │
│   │   └── detective/                  # ---> DEV 3: GUIDED UX & EVIDENCE PANEL
│   │       ├── CaseFileBar.tsx         # 1-Click Golden Case File switcher
│   │       ├── QuestionWizardModal.tsx # Guided "Earth Trend Detective" wizard
│   │       ├── EvidencePanel.tsx       # Divergence banner, scorecard & AI summary
│   │       ├── ProvenanceCard.tsx      # NASA data provenance & external links
│   │       └── ReportExporter.ts       # Markdown & Print-to-PDF generator
│   │
│   └── lib/
│       └── ai_interpreter.ts           # Grounded AI interpreter + deterministic fallback
│
├── api/                                # ---> DEV 2: NASA DATA & STATISTICAL ENGINE
│   ├── analyze.py                      # Vercel Python entrypoint (/api/analyze)
│   └── _lib/
│       ├── nasa_power_client.py        # Zero-download NASA POWER REST client
│       ├── stats_engine.py             # SciPy OLS, Mann-Kendall, Sen's Slope
│       └── variable_catalog.py         # Plain-language definitions & metadata
│
├── scripts/                            # ---> DEV 2: DEMO BUILD SCRIPTS
│   └── build_golden_demos.py           # Pre-fetches the 4 Golden Case Files
│
├── public/
│   └── data/
│       └── golden_demos/               # Pre-cached NASA JSON for instant demos
│           ├── pk_divergence.json      # Case 1: Upper Indus vs. Balochistan
│           ├── pk_heatwave.json        # Case 2: Jacobabad vs. Karachi Heat
│           ├── aral_sea.json           # Case 3: Aral Sea Desiccation
│           └── amazon_drying.json      # Case 4: Amazon Deforestation Arc
│
├── docs/                               # Complete project engineering documentation
│   ├── 01 Problem Solution Overview.md
│   ├── 02 Product Requirements Document Prd.md
│   ├── 03 Technical Architecture Doc.md
│   ├── 04 User Flow And Webflow.md
│   ├── 05 Web Design System.md
│   ├── 06 Implementation Plan 3 Devs.md
│   ├── 07 Agent 1 Frontend Map Ui.md
│   ├── 08 Agent 2 Nasa Data And Stats Engine.md
│   ├── 09 Agent 3 Guided Detective Ai And Demo.md
│   ├── Geopulse Analytics Nasa Space Apps 2026 Guide.md
│   └── INSTALL_SKILLS.md
│
└── .agent/skills/                      # AI Agent workspace skills (see Section 10)
    ├── kpi-dashboard-design/
    ├── plotly/
    ├── data-scientist/
    ├── python-pro/
    └── data-storytelling/
```

---

## 9. Golden Case Files (Instant Judge Demos)

To prevent upstream latency or network issues during judging evaluation, GeoPulse includes 4 verified Golden Case Files:

1. **Case #1 (Flagship): Pakistan Hydrological Divergence (1981–2025)**
   - **Region A:** Upper Indus / Gilgit-Baltistan (`35.30°N, 75.60°E`) — Increasing summer precipitation and accelerated glacial melt.
   - **Region B:** Southwestern Balochistan (`27.50°N, 64.00°E`) — Decreasing root-zone soil wetness (`GWETROOT`) and aridification.
   - *Key takeaway:* Proves regional divergence under the same climate system.
2. **Case #2: South Asian Heat Envelope — Jacobabad vs. Karachi (1981–2025)**
   - Compares inland extreme skin/air temperatures (`T2M`, `TS`) in Jacobabad (`28.28°N, 68.44°E`) against maritime moderation in Karachi (`24.86°N, 67.01°E`).
3. **Case #3: Central Asian Water Loss — Aral Sea vs. Tien Shan (1981–2025)**
   - Tracks root-zone drying in the Aral Sea basin (`45.00°N, 59.50°E`) compared to headwater runoff in the Tien Shan mountains.
4. **Case #4: Amazon Basin Drying — Deforestation Arc vs. Core Rainforest (1981–2025)**
   - Evaluates precipitation and soil wetness decline across Mato Grosso (`-12.50°S, -55.50°W`) compared to the central Amazon basin (`-3.10°S, -60.00°W`).

---

## 10. Installed Agent Skills

This project includes 5 specialized workspace skills in `.agent/skills/` to assist in development, data science, and hackathon presentation:

| Skill | Category | Role in GeoPulse Analytics |
| :--- | :--- | :--- |
| **`kpi-dashboard-design`** | UI/UX | Layout patterns, scientific scorecards, and metric cards. |
| **`plotly`** | Visualization | Interactive time-series charts, dual axes, and confidence bands. |
| **`data-scientist`** | Statistics | Mann–Kendall testing, Sen's slope, $p$-values, and autocorrelation diagnostics. |
| **`python-pro`** | Backend | High-performance Python 3.12+, SciPy, NumPy, and API design. |
| **`data-storytelling`** | Pitch / Narrative | 7-slide pitch deck structure, judge presentation, and scientific storytelling. |

---

## 11. Quick Start & Local Setup

### Prerequisites
- **Node.js:** v18.17+ or v20+
- **Python:** v3.11+
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/geopulse-analytics.git
   cd geopulse-analytics
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Install Python backend dependencies:**
   ```bash
   # Create and activate virtual environment (Windows):
   python -m venv venv
   .\venv\Scripts\activate

   # Install requirements:
   pip install -r requirements.txt
   ```

4. **Run the local development server:**
   ```bash
   # Terminal 1: Run Python Serverless API on PORT 8000
   .\venv\Scripts\python.exe api/analyze.py

   # Terminal 2: Run Next.js Frontend Workbench on PORT 3000
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Run the Test Suite:**
   ```bash
   # Run stats engine and API integration tests:
   .\venv\Scripts\pytest.exe scripts/test_stats_engine.py -v

   # Verify the 4 Golden Case Files schema and continuous records:
   .\venv\Scripts\python.exe scripts/build_golden_demos.py --verify

   # Run TypeScript type check:
   npm run type-check

   # Run Next.js production build:
   npm run build
   ```

6. *(Optional)* Run using the Vercel CLI for live serverless function testing:
   ```bash
   vercel dev
   ```

---

## 12. Alignment with NASA Judging Criteria

| Criterion | How GeoPulse Scores 5/5 |
| :--- | :--- |
| **Impact** | Directly addresses climate education and decision-making by making complex multi-decade satellite records accessible to students, educators, and planners. Highlights vulnerable regional divergences like Pakistan's water crisis. |
| **Creativity** | Introduces **Side-by-Side Regional Divergence Mode**, turning a passive data viewer into an active comparative workbench answering *why* one region dries while its neighbor wets. |
| **Validity** | Grounded in rigorous statistics: combines parametric (OLS + 95% CI) and non-parametric (Mann–Kendall + Sen's Slope) tests, flags serial autocorrelation, and eliminates AI hallucination via deterministic fallbacks. |
| **Relevance** | Deeply integrates NASA Earth observations: MERRA-2, GLDAS, GPM IMERG, MODIS, AIRS, and OMI via NASA POWER and NASA GIBS, with direct verification links to NASA Giovanni. |
| **Presentation** | Zero-download, zero-login design with instant load times (<1.5s), responsive dark scientific UI, 4 pre-loaded Golden Case Files, and 1-click reproducible report export. |

---

## 13. Documentation Index

For detailed engineering specifications, refer to the documentation in `docs/`:

- [01 Problem Solution Overview.md](docs/01%20Problem%20Solution%20Overview.md) — Problem statement, critique, and streamlined solution.
- [02 Product Requirements Document Prd.md](docs/02%20Product%20Requirements%20Document%20Prd.md) — Product vision, user stories, and acceptance criteria.
- [03 Technical Architecture Doc.md](docs/03%20Technical%20Architecture%20Doc.md) — Serverless architecture, API schemas, and data contract.
- [04 User Flow And Webflow.md](docs/04%20User%20Flow%20And%20Webflow.md) — End-to-end user journeys and state machine transitions.
- [05 Web Design System.md](docs/05%20Web%20Design%20System.md) — Color tokens, typography, component specifications, and wireframes.
- [06 Implementation Plan 3 Devs.md](docs/06%20Implementation%20Plan%203%20Devs.md) — 48-hour schedule, Git branching rules, and conflict-free workflow.
- [07 Agent 1 Frontend Map Ui.md](docs/07%20Agent%201%20Frontend%20Map%20Ui.md) — Dev 1 implementation guide for MapLibre and GIBS layers.
- [08 Agent 2 Nasa Data And Stats Engine.md](docs/08%20Agent%202%20Nasa%20Data%20And%20Stats%20Engine.md) — Dev 2 guide for NASA POWER client and SciPy stats engine.
- [09 Agent 3 Guided Detective Ai And Demo.md](docs/09%20Agent%203%20Guided%20Detective%20Ai%20And%20Demo.md) — Dev 3 guide for guided wizard, AI interpreter, and export.
- [Geopulse Analytics Nasa Space Apps 2026 Guide.md](docs/Geopulse%20Analytics%20Nasa%20Space%20Apps%202026%20Guide.md) — NASA Space Apps challenge brief, resources, and judging rules.
- [INSTALL_SKILLS.md](docs/INSTALL_SKILLS.md) — Guide for installing the 5 project-level AI agent skills.

---

## 14. License & Acknowledgments

- **Challenge:** [NASA International Space Apps Challenge 2026](https://www.spaceappschallenge.org/2026/)
- **Data Providers:** [NASA Earthdata](https://www.earthdata.nasa.gov/), [NASA Langley Research Center POWER Project](https://power.larc.nasa.gov/), [NASA GES DISC](https://disc.gsfc.nasa.gov/), and [NASA GIBS](https://gibs.earthdata.nasa.gov/).
- **License:** Open-source under the [MIT License](LICENSE).
