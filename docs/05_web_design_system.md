# 05 — Web Design System & UI Specification: GeoPulse Analytics

**Design Aesthetic:** "NASA Earth Information Center Meets Bloomberg Terminal for Climate Science"  
**Team:** GeoPulse Analytics  
**Challenge:** [Be An Earth System Trend Detective! (2026 NASA Space Apps Challenge)](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)

---

## 1. Visual Identity & Color Tokens (Tailwind CSS Configuration)

We preserve and refine the dark scientific dashboard direction from Section 9 of your proposal (`GeoPulse_Analytics_Solution_Proposal.pdf`), adding semantic color tokens for **Regional Divergence (Region A vs. Region B)** and **Statistical Significance Badges** so color-blind users and students can read results at a glance.

### Color Palette (`tailwind.config.ts`)

| Token Role | Hex Code | Tailwind Class Equivalent | Usage in Workbench |
| :--- | :--- | :--- | :--- |
| **Canvas Background (Deep Space Navy)** | `#070B14` | `bg-slate-950` | Main application shell background. |
| **Panel Surface (Observatory Slate)** | `#0F172A` | `bg-slate-900/90 backdrop-blur-md` | Left control sidebar, bottom chart drawer, right evidence panel. |
| **Card Surface (Elevated Glass)** | `#1E293B` | `bg-slate-800/70 border-slate-700/60` | Variable cards, statistical metric boxes, provenance block. |
| **Primary Brand Accent (Orbital Cyan)** | `#06B6D4` | `text-cyan-400` / `bg-cyan-500` | Primary buttons, active wizard steps, **Region A** map pin & time-series line. |
| **Secondary Comparison Accent (Divergence Amber/Coral)** | `#F97316` | `text-orange-400` / `bg-orange-500` | **Region B** map pin, comparison time-series line, divergence callouts. |
| **Significant Positive Trend (Emerald)** | `#10B981` | `text-emerald-400 bg-emerald-950/60 border-emerald-500/40` | Badge for `INCREASING_SIGNIFICANT` ($p < 0.05$) with upward arrow `↗`. |
| **Significant Negative Trend (Rose/Coral)** | `#F43F5E` | `text-rose-400 bg-rose-950/60 border-rose-500/40` | Badge for `DECREASING_SIGNIFICANT` ($p < 0.05$) with downward arrow `↘`. |
| **Non-Significant / Noise (Muted Slate)** | `#94A3B8` | `text-slate-300 bg-slate-800 border-slate-600` | Badge for `NOT_SIGNIFICANT` ($p \ge 0.05$) with tilde symbol `~` so users never mistake random fluctuation for a significant trend. |
| **Warning / Caveat (Amber)** | `#F59E0B` | `text-amber-300 bg-amber-950/50 border-amber-500/40` | Serial autocorrelation warnings, missing-data notices. |

---

## 2. Typography Hierarchy

- **Primary UI & Narrative Font (`Inter` or `Plus Jakarta Sans`):** Clean geometric readability for plain-language variable definitions and AI interpretations.
- **Data, Coordinates & Statistical Metrics Font (`JetBrains Mono` or `Geist Mono`):** Strictly tabular monospace numerals (`tabular-nums`) for all lat/lon coordinates, slopes (`+0.042 mm/day/decade`), $p$-values (`p = 0.0034`), Kendall's $\tau$, and confidence intervals.

| Element | Font Family | Size / Weight | Line Height |
| :--- | :--- | :--- | :--- |
| **Workbench Header / Case Title** | Sans (`Inter`) | `18px` (`text-lg font-bold tracking-tight`) | `1.3` |
| **Section Header (e.g., "STATISTICAL PROOF")** | Mono (`JetBrains Mono`) | `11px` (`text-xs font-semibold uppercase tracking-wider text-cyan-400`) | `1.2` |
| **KPI Metric Value (Slope / $p$-value)** | Mono (`JetBrains Mono`) | `22px` (`text-2xl font-bold tabular-nums`) | `1.1` |
| **Plain-Language Variable Definition** | Sans (`Inter`) | `13px` (`text-xs text-slate-300 leading-relaxed`) | `1.5` |

---

## 3. Single-Screen 4-Zone Workbench Wireframe (1440×900 Desktop & Responsive Stack)

```
+--------------------------------------------------------------------------------------------------+
| [Logo] GeoPulse Analytics | Case Files: [1: PK Divergence*] [2: Heat] [3: Aral Sea] [4: Amazon]  |
|                           | [? Guided Detective Wizard]          [Export Report .MD / PDF]       |
+---------------------------+--------------------------------------+-------------------------------+
| LEFT PANEL (280px)        | CENTER MAP CANVAS (Flex-1, Top 55%)  | RIGHT PANEL (360px)           |
|                           |                                      |                               |
| 1. RESEARCH QUESTION      |  +--------------------------------+  | 1. REGIONAL DIVERGENCE BANNER |
| "How do rainfall & soil   |  | [Pin Mode: (o) Reg A ( ) Reg B]|  | "OPPOSING TRENDS DETECTED"    |
|  moisture trends differ   |  | [GIBS Layer: MODIS Skin Temp v]|  | Reg A: ↗ +0.031 (p = 0.008)   |
|  across Pakistan?"        |  +--------------------------------+  | Reg B: ↘ -0.024 (p = 0.012)   |
|                           |                                      |                               |
| 2. NASA VARIABLE          |       [MapLibre GL JS Globe]         | 2. STATISTICAL SCORECARD      |
| [Root-Zone Soil Wetness v]|         * Pin A (Upper Indus)        | +------------+--------------+ |
| Plain Definition Box:     |         * Pin B (Balochistan)        | | Metric     | Reg A | Reg B| |
| "Water in top 100cm soil  |                                      | | OLS/decade | +0.03 | -0.02| |
|  available to plant roots"|                                      | | Sen Slope  | +0.03 | -0.02| |
|  Source: NASA POWER/GLDAS |                                      | | MK p-value | 0.008 | 0.012| |
|                           +--------------------------------------+ | 95% CI     |[.01,.05]|... | |
| 3. REGIONS (A vs. B)      | BOTTOM CHART DRAWER (Flex-1, 45%)    | +------------+--------------+ |
| [A] 35.3°N, 75.6°E (Cyan) |                                      |                               |
| [B] 27.5°N, 64.0°E (Coral)|  Time Series (1981-2025) + Trend Line| 3. EVIDENCE-GROUNDED AI       |
|                           |   ^                                  | - What is changing            |
| 4. TIME & SEASON          |   |  --- Reg A Obs  === Reg A OLS    | - Why regions diverge         |
| [1981] to [2025]          |   |  --- Reg B Obs  === Reg B OLS    | - Statistical caveats         |
| [Annual] [Monsoon] [Win]  |   +--------------------------------> |                               |
|                           |   1981                          2025 | 4. NASA DATA PROVENANCE       |
| [RUN INVESTIGATION]       |                                      | Mission: MERRA-2 / GLDAS      |
|                           |                                      | Verify: [Giovanni] [CUAHSI]   |
+---------------------------+--------------------------------------+-------------------------------+
```

---

## 4. Component-Level Design Specifications

### 4.1 Confidence-Aware Statistical Badge (`<SignificanceBadge />`)
Never rely on color alone:
- **Statistically Significant Increase (`p < 0.05`):** Emerald pill `[ ↗ INCREASING • SIGNIFICANT (p = 0.008) ]`
- **Statistically Significant Decrease (`p < 0.05`):** Rose pill `[ ↘ DECREASING • SIGNIFICANT (p = 0.012) ]`
- **Non-Significant Direction (`p >= 0.05`):** Slate pill `[ ~ SLIGHT UPWARD DRIFT • NOT SIGNIFICANT (p = 0.24) ]` accompanied by a student-friendly tooltip: *"Why isn't this significant? Year-to-year variability is currently larger than the long-term slope. Try examining a specific season or a longer time window."* (Directly fulfills the [challenge brief's](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/) guidance!)

### 4.2 Interactive Time-Series Chart (`<TrendChart />`)
- **Dual Series Support:** Plots Region A in solid/dashed Cyan (`#06B6D4`) and Region B in solid/dashed Coral (`#F97316`).
- **Trend Overlay Toggle:** Users can toggle between **OLS Linear Trend Line**, **Sen's Robust Median Trend Line**, and **95% Confidence Shading**.
- **Interactive Hover Crosshair:** Displays exact year, Region A value, Region B value, and anomaly from the 1981–2010 baseline.

### 4.3 Provenance & Verification Footer (`<ProvenanceCard />`)
Every analysis displays an uneditable audit block:
- **Dataset & Model:** [NASA MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) / [GLDAS](https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1) via [NASA POWER API](https://power.larc.nasa.gov/)
- **Spatial Grid:** `0.5° × 0.625°` (`~50 km`)
- **Missing Months Filtered:** `0` (`-999` fill values excluded)
- **External Scientific Cross-Check Links:** Deep-links to [NASA Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/), [NASA Worldview](https://www.earthdata.nasa.gov/data/tools/worldview), and [CUAHSI HydroClient](https://data.cuahsi.org/).
