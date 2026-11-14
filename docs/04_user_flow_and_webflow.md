# 04 — User Flow & Webflow Architecture: GeoPulse Analytics

**Application Structure:** Single-Screen Interactive "Detective Workbench" SPA (Zero Page Reloads)  
**Team:** GeoPulse Analytics  
**Challenge:** [Be An Earth System Trend Detective! (2026 NASA Space Apps Challenge)](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)

---

## 1. Why We Replaced 7 Pages with a Single Unified Webflow

Your initial proposal suggested 7 separate pages (*Home, Explore Earth, Investigate, AI Research Assistant, Trend Discoveries, Research Reports, Learn*). In a hackathon evaluation, judges spend **90 to 180 seconds** testing a live link. If they have to navigate across 7 routes to piece together the 4 mandatory NASA objectives (Identify Variable → Acquire Regional Data → Visualize Time Series → Test Significance), key features get missed.

Instead, GeoPulse uses a **Single-Page Scientific Workbench** with a collapsible **Top Hero / Case File Launcher** and a **4-Zone Interactive Canvas** where every action updates the map, charts, statistical scorecard, and AI detective report in place.

---

## 2. End-to-End User & Judge Journey Diagram

```
[Judge / User Opens Public Vercel URL]
                  |
                  v
+-------------------------------------------------------------------------+
| ENTRY MODE SELECTION (Top Guided Bar — Takes 3 Seconds)                 |
|                                                                         |
|  Option A: 1-Click "Golden Detective Case Files" (Default Pre-Loaded)   |
|    -> Case 1: Pakistan Hydro-Divergence (Upper Indus vs. Balochistan)   |
|    -> Case 2: Jacobabad vs. Karachi Extreme Heat & Humidity             |
|    -> Case 3: Aral Sea Desiccation vs. Tien Shan Headwaters             |
|    -> Case 4: Southern Amazon Deforestation Arc vs. Central Core        |
|                                                                         |
|  Option B: "Ask the Trend Detective" Guided 2-Step Question Wizard      |
|    -> Step 1: Pick Theme (Drought & Water / Extreme Heat / Monsoon /    |
|               Solar Dimming & Aerosols)                                 |
|    -> Step 2: Recommend NASA Variable + Plain-English Definition Card   |
+-------------------------------------------------------------------------+
                  |
                  v
+-------------------------------------------------------------------------+
| STEP 2: REGIONAL SELECTION & DIVERGENCE SETUP (Center MapLibre Canvas)  |
|  - Toggle Pin Mode: [Set Region A (Cyan)] vs. [Set Region B (Coral)]    |
|  - Click any coordinate on Earth OR pick from preset regional boundaries|
|  - Toggle Live NASA GIBS Satellite Overlay (MODIS / GPM / MERRA-2)      |
|  - Choose Temporal Window (1981–2025) & Season (Annual / Monsoon / Win) |
+-------------------------------------------------------------------------+
                  |
                  v  (Clicks "Run Trend Investigation" — <1.5s Response)
+-------------------------------------------------------------------------+
| STEP 3: VISUALIZE TIME SERIES & STATISTICAL PROOF (Bottom & Right Zone) |
|  - Dual-Region Time-Series Chart renders observations + OLS + Sen Slope |
|  - Regional Divergence Alert Banner highlights if Region A & B diverge  |
|  - Statistical Scorecard shows OLS Slope/decade, Mann-Kendall p-value,  |
|    Sen's Slope, 95% CI, and Confidence Badge                            |
+-------------------------------------------------------------------------+
                  |
                  v
+-------------------------------------------------------------------------+
| STEP 4: EVIDENCE-FIRST AI SUMMARY & REPRODUCIBLE EXPORT (Right Drawer)  |
|  - Plain-language breakdown: What is changing, Where, How Much, Why     |
|  - Provenance Card with NASA Dataset ID & Giovanni/CUAHSI check links   |
|  - 1-Click "Export Reproducible Case Report (.md / Print PDF)"          |
+-------------------------------------------------------------------------+
```

---

## 3. State Machine & Interactive Webflow Transitions

| User Action | Frontend State Change | Backend / Data Action | Visual Feedback |
| :--- | :--- | :--- | :--- |
| **1. Initial Page Load** | Loads `case=pk-divergence` by default so the workbench is never blank. | Reads pre-verified `/data/golden_demos/pk_divergence.json` in `<50 ms`. | Map flies to Pakistan Showing Pin A (`35.3°N, 75.6°E`) and Pin B (`27.5°N, 64.0°E`); dual chart and stats populate immediately. |
| **2. Click "Guided Question Wizard"** | Opens compact modal/drawer with 4 environmental questions (*"Is my region getting drier?"*, *"Where is extreme heat accelerating?"*, *"Are monsoon rains shifting?"*, *"Are aerosols dimming sunlight?"*). | Filters the 6 NASA variables and highlights the recommended primary + secondary variable with student-friendly definitions. | Variable badge pulses cyan; plain-English tooltip explains units and satellite sensor role. |
| **3. Click Map in "Region A" or "Region B" Mode** | Updates `regionA` or `regionB` coordinates (`lat`, `lon`) and reverse-geocodes/labels the coordinate. | Triggers `POST /api/analyze` (or `GET /api/analyze?latA=...`) fetching `<15 KB` JSON from [NASA POWER API](https://power.larc.nasa.gov/). | Skeleton shimmer on chart for `<1.2s`, followed by smooth line transition and updated Mann–Kendall badge. |
| **4. Switch Aggregation (`Annual` / `Monsoon JJAS` / `Winter DJF`)** | Updates `aggregation_mode` state. | Re-runs Python statistical aggregation on the cached monthly series in `<100 ms`. | Chart and $p$-values update instantly, demonstrating how a trend hidden in annual averages can become significant in summer monsoon months. |
| **5. Toggle NASA GIBS Layer** | Switches raster tile source on MapLibre GL JS. | Browser fetches XYZ/WMTS tiles directly from [NASA GIBS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api). | Map overlays live satellite thermal/precipitation/vegetation layer with opacity slider (`0%–100%`). |
| **6. Click "Export Detective Report"** | Formats current `InvestigationResponse` into a structured Markdown/HTML report. | Client-side Blob download (`GeoPulse_Case_Report.md`) or `window.print()` print-stylesheet PDF. | Downloads complete reproducible audit trail with NASA provenance and statistical tables. |

---

## 4. URL State Synchronization (Shareable Investigations)

Every investigation state is encoded into the browser URL query string:

```text
https://geopulse-analytics.vercel.app/?var=GWETROOT&agg=annual&latA=35.30&lonA=75.60&nameA=Upper_Indus&latB=27.50&lonB=64.00&nameB=Balochistan&start=1981&end=2025
```

- **Why this matters for judges:** You can paste direct deep links to specific scientific discoveries right inside your 7-slide presentation deck and project submission text ([Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/)).
