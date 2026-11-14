# 01 — Problem & Final Solution Overview: GeoPulse Analytics

**Team:** GeoPulse Analytics  
**Challenge:** [Be An Earth System Trend Detective! (2026 NASA Space Apps Challenge)](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)  
**Submission Deadline:** Sunday, November 15, 2026, at 11:59 p.m. local time ([Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/))

---

## 1. Critique & Gap Analysis of Your Initial Proposal

Your 16-page `GeoPulse_Analytics_Solution_Proposal.pdf` nails the **scientific narrative** and **judging criteria alignment**—specifically the "Earth Trend Detective" guided flow, the distinction between trend direction and statistical significance, and the rule that AI must explain rather than invent numerical outputs. However, executing that exact proposal within a 48-hour hackathon with **3 developers**, **no large file downloads**, and **instant judge testing** exposes six critical engineering gaps:

| Gap Identified in Proposal | Why It Fails in a 48-Hour Hackathon | Final Streamlined Solution |
| :--- | :--- | :--- |
| **1. Raw NetCDF/HDF5 Granule Downloads (`CMR` + `Harmony` + `xarray`)** | Querying NASA CMR for 20–40 years of [GPM IMERG](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm) or [GLDAS](https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1) granules requires downloading hundreds of megabytes or gigabytes of NetCDF4 files and decoding them in `xarray`, violating your **zero-large-file-download constraint** and timing out web requests. | **Zero-Download JSON/ASCII Time-Series APIs:** Use the [NASA POWER API](https://power.larc.nasa.gov/) (which serves [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) and satellite-derived meteorology/soil wetness from 1981–present as `<15 KB` JSON in `<800 ms` with zero auth) + [NASA GES DISC Data Rods for Hydrology](https://www.earthdata.nasa.gov/news/feature-articles/data-tool-focus-data-rods-hydrology) for GLDAS/GPM point time series. |
| **2. Heavy 5-Service Infrastructure (`Next.js` + `FastAPI` + `PostGIS` + `Redis` + `Celery` + `S3`)** | Managing Docker containers, managed PostGIS, Redis queues, Celery workers, and separate Render/Vercel deployments across 3 developers consumes 12+ hours of DevOps debugging and breaks easily during live judging. | **Single-Repo, 1-Click Vercel Deployment:** Deploy a unified Next.js App Router + [Vercel Python Serverless Functions](https://vercel.com/docs/functions/runtimes/python) monorepo. Because time-series payloads are `<15 KB`, Python computes OLS, Mann-Kendall, and Sen's Slope synchronously in `<50 ms`—eliminating Redis, Celery, PostGIS, and S3 entirely. |
| **3. Heavy Map Raster Backend Processing** | Decoding spatial grids in Python to render map overlays adds massive memory overhead (exceeding serverless limits) and slow load times. | **Browser-Direct NASA GIBS WMTS Tiles:** Stream pre-rendered satellite imagery layers ([MODIS](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools), [GPM](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm), [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2), [AIRS](https://www.earthdata.nasa.gov/data/instruments/airs), [OMI](https://www.earthdata.nasa.gov/data/instruments/omi/resources)) directly into MapLibre GL JS via [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api) with zero backend load. |
| **4. 7 Separate Website Pages** | Building 7 pages (*Home, Explore Earth, Investigate, AI Assistant, Trend Discoveries, Research Reports, Learn*) splits UI effort and forces judges to click around to find the core tool. | **Single-Screen "Detective Workbench" SPA:** Consolidate everything into **one unified interactive workspace** with a top Guided Detective Wizard bar, a central dual-comparison map, a bottom statistical time-series drawer, and a right-hand Evidence & AI Interpreter panel. |
| **5. Live API Rate-Limit / Upstream Outage Risk During Judging** | As seen with `spaceappschallenge.org` returning upstream errors, live external APIs can lag or rate-limit when judges test your URL. | **Hybrid Live API + Pre-Cached "Golden Case Files":** Ship 4 pre-cached, real NASA JSON datasets in `/public/data/golden_demos/` (e.g., Northern vs. Southern Pakistan Drought & Glacial Melt, Aral Sea Shrinkage, Amazon Deforestation, Jacobabad Heatwave) that load in `<50 ms` offline, while allowing live NASA POWER API queries for any custom map click anywhere on Earth. |
| **6. 6-Role Team Plan vs. 3-Developer Reality** | Your proposal listed 6 roles (*Frontend, Backend, NASA Data Engineer, Scientific Analyst, AI Engineer, Integration*), which causes overlapping file edits and Git merge conflicts for a 3-person team. | **Strict Directory-Isolated 3-Dev Split:** Partition the codebase into 3 isolated directories (`src/components/map/`, `api/_lib/`, `src/components/detective/`) governed by a single frozen TypeScript/JSON contract (`src/types/investigation.ts`) locked in Hour 1. |

---

## 2. The Problem We Are Solving (Challenge Alignment)

Per the official [Be An Earth System Trend Detective!](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/) brief, changes moving in a consistent direction over time (**trends**) reveal both the physical processes driving environmental change and the ecosystems responding to them. Students, educators, and citizen scientists face two barriers:

1. **Variable Overload:** NASA missions ([MODIS](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools), [OMI](https://www.earthdata.nasa.gov/data/instruments/omi/resources), [AIRS](https://www.earthdata.nasa.gov/data/instruments/airs), [GPM](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm)) and global models ([MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2), [GLDAS](https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1)) expose hundreds of specialized variables without plain-language guidance on which variable answers a specific environmental question.
2. **Regional Divergence:** A single Earth science variable can trend upward in one region and downward in a neighboring region even when driven by the same climate process (e.g., upper Indus basin glacial/monsoon wetting vs. southern Balochistan/Sindh aridification in Pakistan). Global averages hide these opposing regional trends.

---

## 3. The Final Solution: GeoPulse "Earth Trend Detective" Workbench

**GeoPulse Analytics** is a zero-download, browser-accessible **Earth System Trend Detective Workbench** that turns a plain-English environmental question into a Dual-Region Statistical Trend Comparison backed by real NASA satellite and reanalysis time series in under 3 seconds.

### How the Final Solution Works in 4 Steps (Zero Large Downloads)

1. **Ask or Pick a "Case File" (Guided Variable Discovery):**
   - Users either click one of **4 Pre-Loaded Detective Case Files** (e.g., *"Case #1: Regional Divergence in Pakistan — Why is Upper Indus wetting while Balochistan dries?"*) or type a question / answer a 2-step wizard (*What phenomenon? Where on Earth?*).
   - The system maps the question to plain-language Earth science variables (Precipitation, Root-Zone Soil Moisture, Surface Temperature, Evaporative Stress, Specific Humidity, Solar Irradiance) with beginner-friendly definitions and direct links to [NASA Earthdata](https://www.earthdata.nasa.gov/).
2. **Dual-Region Pin/Polygon Selection + Live NASA GIBS Overlay:**
   - The interactive MapLibre GL JS canvas streams live satellite visual layers from [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api) and lets users select **Region A** and **Region B** (to directly prove **Regional Divergence**) or click any coordinate on Earth.
3. **Sub-Second NASA Time-Series Retrieval & Statistical Engine:**
   - Instead of downloading gigabytes of NetCDF files, our backend queries the [NASA POWER API](https://power.larc.nasa.gov/) (serving [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) monthly/daily data from 1981–present) or loads the verified Golden Cache (`<15 KB` JSON).
   - Our Python statistical engine (`scipy.stats` + `numpy`) computes:
     - **Ordinary Least Squares (OLS) Linear Trend:** Slope (rate of change per year/decade), $R^2$, standard error, and 95% confidence interval.
     - **Mann–Kendall Non-Parametric Trend Test:** Kendall's $\tau$, $S$-statistic, $Z$-score, and two-sided $p$-value.
     - **Sen's Slope Estimator:** Outlier-resistant median rate of change.
     - **Confidence-Aware Badge:** Classifies results into one of 6 transparent scientific states (e.g., *Increasing & Statistically Significant ($p < 0.05$)* vs. *Upward Direction, Not Statistically Significant ($p \ge 0.05$)*).
4. **Evidence-First AI Detective Report & Reproducible Export:**
   - The computed JSON payload (never raw unvalidated prompts) is passed to an LLM interpreter (with a deterministic template fallback if no API key is set) that explains **what** is changing, **where** Region A and Region B diverge, **how much** it is changing, and **whether it is statistically significant**, complete with a 1-click **Reproducible Case Report (`.md` / `.json` / Print-to-PDF)** and a link to [CUAHSI HydroClient](https://data.cuahsi.org/) and [NASA Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/) for cross-verification.

---

## 4. Why Judges Will Score This 5/5

- **Impact:** Directly empowers students, educators, and local planners (including a flagship Pakistan regional divergence case study) to separate statistically significant climate signals from short-term weather noise ([Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/)).
- **Creativity:** Pioneers **Side-by-Side Regional Divergence Mode** (Region A vs. Region B on the same chart and statistical scorecard), directly visualizing the exact phenomenon highlighted in the NASA challenge prompt.
- **Validity:** Combines parametric (OLS + 95% CI) and non-parametric (Mann-Kendall + Sen's Slope) tests, flags serial autocorrelation and sample-size caveats, and strictly prevents AI hallucination.
- **Relevance:** Integrates [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2) via [NASA POWER](https://power.larc.nasa.gov/), [GLDAS](https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1) & [GPM](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm) via [GES DISC Data Rods](https://www.earthdata.nasa.gov/news/feature-articles/data-tool-focus-data-rods-hydrology), and [MODIS](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools)/[AIRS](https://www.earthdata.nasa.gov/data/instruments/airs)/[OMI](https://www.earthdata.nasa.gov/data/instruments/omi/resources) via [NASA GIBS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api).
- **Presentation & Judge Usability:** Zero login wall, zero large downloads, instant `<1s` load on a public Vercel URL, and pre-built Case Files so judges can experience a full scientific investigation in 15 seconds.
