# 06 — Conflict-Free Implementation Plan for 3 Developers (Single Git Repo)

**Team:** GeoPulse Analytics (3 Developers Working Simultaneously)  
**Repository Strategy:** Monorepo with **Strict Directory Ownership** + **Hour-1 Frozen Contract**  
**Deployment Target:** 1-Click [Vercel](https://vercel.com/docs/functions/runtimes/python) Deployment (Next.js Frontend + Python Serverless Backend)

---

## 1. How 3 Developers Work Simultaneously with ZERO Git Merge Conflicts

Merge conflicts happen when two developers edit the same file (especially `page.tsx`, `package.json`, or shared CSS/types). To guarantee **zero merge conflicts** across a 48-hour sprint, we enforce **three golden rules**:

1. **Hour-1 Bootstrap & Contract Lock:** Before branching, all 3 developers spend the first 45 minutes together initializing the repo, locking `package.json`, `requirements.txt`, `src/types/investigation.ts`, and a mock JSON payload (`public/data/golden_demos/pk_divergence.json`), and pushing `main` to Vercel.
2. **Strict Directory Isolation:** After Hour 1, **each developer owns a completely separate set of directories**. No developer is allowed to edit files outside their owned folder without a 2-minute sync.
3. **Slot-Based Root Composition:** `src/app/page.tsx` is written in Hour 1 as a thin 40-line layout grid that imports `<HeaderWizardSlot />` (Dev 3), `<LeftControlAndMapSlot />` (Dev 1), `<BottomChartSlot />` (Dev 1), and `<RightEvidencePanelSlot />` (Dev 3), while calling `/api/analyze` (Dev 2). After Hour 1, **nobody touches `src/app/page.tsx`!**

---

## 2. Repository Directory Tree & Strict Ownership Matrix

```text
geopulse-analytics/
├── package.json                        # LOCKED in Hour 1
├── requirements.txt                    # LOCKED in Hour 1 (numpy, scipy, requests)
├── vercel.json                         # LOCKED in Hour 1
├── src/
│   ├── types/
│   │   └── investigation.ts            # LOCKED in Hour 1 (Shared TypeScript Contract)
│   ├── app/
│   │   ├── layout.tsx                  # LOCKED in Hour 1
│   │   └── page.tsx                    # LOCKED in Hour 1 (Thin 4-Slot Shell)
│   │
│   ├── components/
│   │   ├── workbench/                  # ---> OWNED EXCLUSIVELY BY DEV 1
│   │   │   ├── MapCanvas.tsx           # MapLibre GL JS + NASA GIBS WMTS tiles + Dual Pins
│   │   │   ├── ControlSidebar.tsx      # Variable dropdown, Region A/B coords, time toggles
│   │   │   ├── TrendChart.tsx          # Recharts dual time series + OLS/Sen slope lines
│   │   │   └──GibsLayerConfig.ts       # NASA GIBS WMTS layer definitions
│   │   │
│   │   └── detective/                  # ---> OWNED EXCLUSIVELY BY DEV 3
│   │       ├── CaseFileBar.tsx         # 1-Click Golden Case File selector bar
│   │       ├── QuestionWizardModal.tsx # Guided "Earth Trend Detective" question wizard
│   │       ├── EvidencePanel.tsx       # Scorecard table, Confidence Badge, AI explanation
│   │       ├── ProvenanceCard.tsx      # NASA MERRA-2/GLDAS metadata + Giovanni/CUAHSI links
│   │       └── ReportExporter.ts       # 1-Click Reproducible Markdown / Print PDF exporter
│   │
│   └── lib/
│       └── ai_interpreter.ts           # ---> OWNED EXCLUSIVELY BY DEV 3 (LLM + Fallback)
│
├── api/                                # ---> OWNED EXCLUSIVELY BY DEV 2 (Python Serverless)
│   ├── analyze.py                      # Vercel Python Serverless entrypoint (POST/GET)
│   └── _lib/
│       ├── nasa_power_client.py        # Zero-download NASA POWER & GES DISC JSON fetcher
│       ├── stats_engine.py             # SciPy OLS, Mann-Kendall, Sen's Slope, Autocorrelation
│       └── variable_catalog.py         # Plain-language definitions & unit metadata
│
├── scripts/                            # ---> OWNED EXCLUSIVELY BY DEV 2
│   └── build_golden_demos.py           # Pre-fetches & saves the 4 Golden Case Files
│
└── public/
    └── data/
        └── golden_demos/               # ---> OWNED EXCLUSIVELY BY DEV 2
            ├── pk_divergence.json      # Case 1: Upper Indus vs. Balochistan (1981-2025)
            ├── pk_heatwave.json        # Case 2: Jacobabad vs. Karachi Heat
            ├── aral_sea.json           # Case 3: Aral Sea vs. Tien Shan
            └── amazon_drying.json      # Case 4: Mato Grosso vs. Central Amazon
```

| Developer Role | Git Branch Name | Owned Directories (100% Exclusive Write Access) | Never Touches After Hour 1 |
| :--- | :--- | :--- | :--- |
| **Dev 1: Geospatial & Visual Workbench Lead** | `feat/dev1-map-charts` | `src/components/workbench/**` | `api/**`, `src/components/detective/**`, `src/lib/**` |
| **Dev 2: NASA Data & Statistical Engine Lead** | `feat/dev2-nasa-stats` | `api/**`, `scripts/**`, `public/data/golden_demos/**` | `src/components/**`, `src/lib/**` |
| **Dev 3: Guided Detective UX, Grounded AI & Pitch Lead** | `feat/dev3-detective-ai` | `src/components/detective/**`, `src/lib/**`, `docs/pitch/**` | `api/**`, `src/components/workbench/**` |

---

## 3. Hour-by-Hour Hackathon Execution Schedule

### Phase 0: Shared Bootstrap & Contract Lock (Hours 0–1 — All 3 Devs Together)
1. **Create Repo & Scaffold Next.js:** Run `npx create-next-app@latest geopulse-analytics --typescript --tailwind --eslint --app --src-dir`.
2. **Install All Frontend Packages Upfront** (so nobody modifies `package.json` later):
   ```bash
   npm install maplibre-gl react-map-gl recharts lucide-react clsx tailwind-merge
   ```
3. **Create `requirements.txt` in Root** (for [Vercel Python Runtime](https://vercel.com/docs/functions/runtimes/python)):
   ```text
   numpy==1.26.4
   scipy==1.13.1
   requests==2.32.3
   ```
4. **Commit `src/types/investigation.ts`** (from `03_Technical_Architecture_Doc.md`) and a sample `public/data/golden_demos/pk_divergence.json`.
5. **Connect GitHub Repo to Vercel:** Verify that both Next.js (`/`) and Python (`/api/analyze`) deploy cleanly and generate preview URLs on every branch push.

### Phase 1: Parallel Core Build against Mock/Golden Contract (Hours 1–10)
- **Dev 1 (`feat/dev1-map-charts`):**
  - Builds `<MapCanvas />` using MapLibre GL JS with dark CARTO basemap + [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api) raster overlay toggle + interactive Region A (Cyan) and Region B (Coral) coordinate pins.
  - Builds `<TrendChart />` in Recharts rendering Region A & Region B time series, OLS trend lines, Sen's slope lines, and anomaly tooltips using the frozen `InvestigationResponse` type.
- **Dev 2 (`feat/dev2-nasa-stats`):**
  - Writes `api/_lib/nasa_power_client.py` to query [NASA POWER API](https://power.larc.nasa.gov/) (`PRECTOTCORR`, `GWETROOT`, `T2M`, `TS`, `QV2M`, `ALLSKY_SFC_SW_DWN`), filter `-999` fill values, and aggregate by `annual`, `monsoon_jjas`, or `winter_djf`.
  - Writes `api/_lib/stats_engine.py` implementing OLS (`scipy.stats.linregress`), Mann–Kendall (`scipy.stats.kendalltau` + explicit $S$ & $Z_{MK}$), Sen's Slope (`scipy.stats.theilslopes`), lag-1 autocorrelation, and the 6-tier `ConfidenceBadge`.
  - Runs `scripts/build_golden_demos.py` to generate the 4 real NASA JSON files in `public/data/golden_demos/`.
- **Dev 3 (`feat/dev3-detective-ai`):**
  - Builds `<CaseFileBar />` (1-click switching across the 4 Golden Case Files) and `<QuestionWizardModal />` (guided 2-step question-to-variable recommender with plain-language student definitions).
  - Builds `<EvidencePanel />` (Regional Divergence banner, Statistical Scorecard table, `<SignificanceBadge />`, and `<ProvenanceCard />` with links to [NASA Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/) and [CUAHSI](https://www.cuahsi.org/)).
  - Writes `src/lib/ai_interpreter.ts` (grounded LLM prompt + deterministic scientific fallback) and `<ReportExporter />` (`.md` / Print PDF export).

### Phase 2: First Integration Merge & Live API Wiring (Hours 10–14)
- Each developer opens a Pull Request from their branch (`feat/dev1-*`, `feat/dev2-*`, `feat/dev3-*`) into `main`.
- Because zero files overlap across the 3 branches, **Git merges all 3 PRs automatically with zero conflicts**.
- Test live map clicks calling `/api/analyze` and falling back gracefully to Golden Case Files if offline.

### Phase 3: Polish, Edge-Case Hardening & 7-Slide / 30s Demo Prep (Hours 14–22)
- **Dev 1:** Polishes map fly-to animations, GIBS opacity slider, and responsive layout.
- **Dev 2:** Verifies all units, confidence intervals, and caveats against [NASA Earthdata](https://www.earthdata.nasa.gov/) documentation.
- **Dev 3:** Produces the 7-slide presentation deck and/or 30-second video demo required by the [Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/), embedding the live Vercel URL.

---

## 4. Git Workflow Cheat Sheet for All 3 Developers

```bash
# 1. Start on your dedicated branch after Hour-1 bootstrap
git checkout -b feat/dev1-map-charts   # (or feat/dev2-nasa-stats / feat/dev3-detective-ai)

# 2. Verify you only modified files in your owned directory before committing
git status

# 3. Push to GitHub — Vercel automatically builds a live Preview URL for your branch!
git add <your-owned-folder>/
git commit -m "feat: implement module against frozen InvestigationResponse contract"
git push origin HEAD
```
