# 09 — Agent 3 Task File: Guided Detective UX, Grounded AI Interpreter & Pitch (Dev 3)

**Assigned Role:** Dev 3 — Guided Detective UX, Evidence-First AI & Submission Lead  
**Git Branch:** `feat/dev3-detective-ai`  
**Exclusive Write Directories:** `src/components/detective/**`, `src/lib/**`, `docs/pitch/**`  
**Forbidden Directories (Do Not Edit):** `api/**`, `src/components/workbench/**`, `src/types/**`

---

## 1. Mission & Scope for Agent 3 / Dev 3

You own the **user-facing storytelling, scientific transparency, and AI interpretation layer** that turns raw statistical numbers into an unforgettable judge experience. Specifically, you will build:
1. `<CaseFileBar />`: A 1-click top selector bar for the **4 Pre-Cached Golden Detective Case Files** so judges see an instant `<50 ms` scientific investigation on page load.
2. `<QuestionWizardModal />`: The interactive **"Ask the Trend Detective"** wizard recommended by the [NASA challenge brief](https://www.spaceappschallenge.org/2026/challenges/earth-system-trend-detective/)—asking users *what* and *where* they want to investigate and mapping their answers to the right NASA variable with plain-language definitions.
3. `<EvidencePanel />` & `<ProvenanceCard />`: The right-hand panel displaying the **Regional Divergence Banner**, the side-by-side **Statistical Scorecard Table**, the **6-Tier Confidence Badge**, the **Evidence-First AI Summary**, and clickable verification links to [NASA Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/), [NASA Worldview](https://www.earthdata.nasa.gov/data/tools/worldview), and [CUAHSI HydroClient](https://data.cuahsi.org/).
4. `src/lib/ai_interpreter.ts`: The **Evidence-Grounded AI Interpreter** with a **100% reliable deterministic scientific fallback** so the app never fails even if an LLM API key is missing or rate-limited.
5. `src/components/detective/ReportExporter.ts`: 1-click export of a reproducible `.md` / Print-PDF Case Report.

---

## 2. Files You Must Create in `src/lib/` and `src/components/detective/`

### File 1: `src/lib/ai_interpreter.ts`
Guarantees **zero hallucinated numbers** by feeding only the verified `InvestigationResponse` statistics into the interpreter and providing a built-in deterministic synthesis engine:

```typescript
import { InvestigationResponse, RegionAnalysis } from "@/types/investigation";

function formatRegionVerdict(r: RegionAnalysis, units: string): string {
  const dir = r.stats.ols_slope_per_decade >= 0 ? "increasing" : "decreasing";
  const sig =
    r.stats.mk_p_value < 0.05
      ? `statistically significant (Mann–Kendall p = ${r.stats.mk_p_value.toFixed(4)}, τ = ${r.stats.mk_tau.toFixed(2)})`
      : `not statistically significant at α = 0.05 (Mann–Kendall p = ${r.stats.mk_p_value.toFixed(3)}, τ = ${r.stats.mk_tau.toFixed(2)})`;

  return `${r.region.name} (${r.region.lat}°N, ${r.region.lon}°E) shows a ${dir} linear rate of ${
    r.stats.ols_slope_per_decade >= 0 ? "+" : ""
  }${r.stats.ols_slope_per_decade.toFixed(4)} ${units}/decade (Sen's robust slope: ${
    r.stats.sen_slope_per_decade >= 0 ? "+" : ""
  }${r.stats.sen_slope_per_decade.toFixed(4)} ${units}/decade; 95% CI [${r.stats.ols_ci_lower_decade.toFixed(
    4
  )}, ${r.stats.ols_ci_upper_decade.toFixed(4)}]), which is ${sig}.`;
}

export function buildDeterministicInterpretation(
  data: Omit<InvestigationResponse, "ai_interpretation">
): InvestigationResponse["ai_interpretation"] {
  const a = data.region_a;
  const b = data.region_b;

  const headline = data.divergence_detected && b
    ? `Regional Divergence Confirmed: ${a.region.name} and ${b.region.name} exhibit contrasting ${data.variable_name} trajectories (${data.start_year}–${data.end_year}).`
    : `${data.variable_name} Trend Assessment for ${a.region.name} (${data.start_year}–${data.end_year}): ${a.stats.badge.replace(/_/g, " ")}.`;

  const what_is_changing = formatRegionVerdict(a, data.units);

  const where_it_diverges = b
    ? `${formatRegionVerdict(b, data.units)} Comparing both regions side by side demonstrates why global or national averages can mask localized environmental shifts.`
    : `Single-region analysis selected. Add a Region B pin on the map to test whether a neighboring basin or climatic zone trends in the opposite direction.`;

  const statistical_verdict =
    a.stats.mk_p_value < 0.05 || (b && b.stats.mk_p_value < 0.05)
      ? `Both parametric (Ordinary Least Squares) and non-parametric (Mann–Kendall / Theil–Sen) tests confirm a statistically detectable signal (p < 0.05) over the ${a.stats.n_years}-year NASA record.`
      : `While the fitted slope shows a directional drift, year-to-year climate variability currently exceeds the long-term signal (p ≥ 0.05). Per NASA Earth science guidelines, a non-significant trend may require seasonal isolation (e.g., Monsoon JJAS) or a longer observation window.`;

  const allCaveats = [
    ...a.stats.caveats,
    ...(b ? b.stats.caveats : []),
  ];

  return {
    headline,
    what_is_changing,
    where_it_diverges,
    statistical_verdict,
    limitations_and_caveats:
      allCaveats.length > 0
        ? allCaveats.join(" ")
        : `Evaluated across ${a.stats.n_years} years from ${data.provenance.mission_model} (${data.provenance.spatial_resolution} grid) with ${data.provenance.missing_months_filtered} missing months excluded.`,
    generated_by: "deterministic_scientific_engine",
  };
}
```

### File 2: `src/components/detective/EvidencePanel.tsx`
Renders the right-hand scientific scorecard, the `<SignificanceBadge />`, the grounded AI detective narrative, and the `<ProvenanceCard />`:

```tsx
"use client";

import React from "react";
import { InvestigationResponse, ConfidenceBadge } from "@/types/investigation";
import { exportInvestigationMarkdown } from "./ReportExporter";

const BADGE_STYLES: Record<ConfidenceBadge, { label: string; classes: string; icon: string }> = {
  INCREASING_SIGNIFICANT: {
    label: "INCREASING • SIGNIFICANT (p < 0.05)",
    classes: "bg-emerald-950/70 text-emerald-300 border-emerald-500/50",
    icon: "↗",
  },
  DECREASING_SIGNIFICANT: {
    label: "DECREASING • SIGNIFICANT (p < 0.05)",
    classes: "bg-rose-950/70 text-rose-300 border-rose-500/50",
    icon: "↘",
  },
  INCREASING_NOT_SIGNIFICANT: {
    label: "UPWARD DRIFT • NOT SIGNIFICANT (p ≥ 0.05)",
    classes: "bg-slate-800 text-slate-300 border-slate-600",
    icon: "~",
  },
  DECREASING_NOT_SIGNIFICANT: {
    label: "DOWNWARD DRIFT • NOT SIGNIFICANT (p ≥ 0.05)",
    classes: "bg-slate-800 text-slate-300 border-slate-600",
    icon: "~",
  },
  NO_MONOTONIC_TREND: {
    label: "NO MONOTONIC TREND DETECTED",
    classes: "bg-slate-800 text-slate-400 border-slate-700",
    icon: "—",
  },
  INSUFFICIENT_DATA: {
    label: "INSUFFICIENT DATA (<10 YEARS)",
    classes: "bg-amber-950/70 text-amber-300 border-amber-500/50",
    icon: "!",
  },
};

export const EvidencePanel: React.FC<{ data: InvestigationResponse }> = ({ data }) => {
  const badgeA = BADGE_STYLES[data.region_a.stats.badge];
  const badgeB = data.region_b ? BADGE_STYLES[data.region_b.stats.badge] : null;

  return (
    <aside className="w-full h-full bg-slate-900/95 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto text-xs">
      {/* Header & Export */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-semibold">
            Statistical Proof & Detective Verdict
          </span>
          <h2 className="text-sm font-bold text-slate-100 mt-0.5">
            {data.ai_interpretation.headline}
          </h2>
        </div>
        <button
          onClick={() => exportInvestigationMarkdown(data)}
          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition shrink-0"
        >
          Export .MD Report
        </button>
      </div>

      {/* Confidence Badges */}
      <div className="grid grid-cols-1 gap-2">
        <div className={`p-2.5 rounded-lg border font-mono ${badgeA.classes}`}>
          <div className="text-[10px] uppercase opacity-75">
            Region A: {data.region_a.region.name}
          </div>
          <div className="font-bold mt-0.5">
            {badgeA.icon} {badgeA.label}
          </div>
        </div>
        {data.region_b && badgeB && (
          <div className={`p-2.5 rounded-lg border font-mono ${badgeB.classes}`}>
            <div className="text-[10px] uppercase opacity-75">
              Region B: {data.region_b.region.name}
            </div>
            <div className="font-bold mt-0.5">
              {badgeB.icon} {badgeB.label}
            </div>
          </div>
        )}
      </div>

      {/* Comparative Statistical Scorecard Table */}
      <div className="bg-slate-800/60 rounded-lg border border-slate-700/70 overflow-hidden">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="bg-slate-800 text-slate-300 border-b border-slate-700">
            <tr>
              <th className="p-2">Statistical Metric</th>
              <th className="p-2 text-cyan-400">Reg A</th>
              {data.region_b && <th className="p-2 text-orange-400">Reg B</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            <tr>
              <td className="p-2 text-slate-400">OLS Slope / dec</td>
              <td className="p-2 font-bold">{data.region_a.stats.ols_slope_per_decade}</td>
              {data.region_b && (
                <td className="p-2 font-bold">{data.region_b.stats.ols_slope_per_decade}</td>
              )}
            </tr>
            <tr>
              <td className="p-2 text-slate-400">Sen&apos;s Slope / dec</td>
              <td className="p-2">{data.region_a.stats.sen_slope_per_decade}</td>
              {data.region_b && <td className="p-2">{data.region_b.stats.sen_slope_per_decade}</td>}
            </tr>
            <tr>
              <td className="p-2 text-slate-400">Mann–Kendall p</td>
              <td className="p-2 font-bold">{data.region_a.stats.mk_p_value}</td>
              {data.region_b && <td className="p-2 font-bold">{data.region_b.stats.mk_p_value}</td>}
            </tr>
            <tr>
              <td className="p-2 text-slate-400">Kendall&apos;s τ (Z)</td>
              <td className="p-2">
                {data.region_a.stats.mk_tau} ({data.region_a.stats.mk_z_score})
              </td>
              {data.region_b && (
                <td className="p-2">
                  {data.region_b.stats.mk_tau} ({data.region_b.stats.mk_z_score})
                </td>
              )}
            </tr>
            <tr>
              <td className="p-2 text-slate-400">95% CI (/dec)</td>
              <td className="p-2">
                [{data.region_a.stats.ols_ci_lower_decade}, {data.region_a.stats.ols_ci_upper_decade}]
              </td>
              {data.region_b && (
                <td className="p-2">
                  [{data.region_b.stats.ols_ci_lower_decade}, {data.region_b.stats.ols_ci_upper_decade}]
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Evidence-First Detective Explanation */}
      <div className="space-y-2.5 bg-slate-800/40 p-3 rounded-lg border border-slate-800 leading-relaxed text-slate-300">
        <div>
          <strong className="text-slate-100 block">1. What is changing & how much:</strong>
          {data.ai_interpretation.what_is_changing}
        </div>
        <div>
          <strong className="text-slate-100 block">2. Regional comparison & divergence:</strong>
          {data.ai_interpretation.where_it_diverges}
        </div>
        <div>
          <strong className="text-slate-100 block">3. Statistical significance & caveats:</strong>
          {data.ai_interpretation.statistical_verdict} {data.ai_interpretation.limitations_and_caveats}
        </div>
      </div>

      {/* NASA Provenance & Cross-Verification Links */}
      <div className="mt-auto bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
        <div className="text-slate-200 font-semibold">
          NASA Provenance: {data.provenance.mission_model}
        </div>
        <div>
          Grid: {data.provenance.spatial_resolution} • Missing Filtered:{" "}
          {data.provenance.missing_months_filtered}
        </div>
        <div className="flex flex-wrap gap-3 pt-1">
          {data.provenance.verification_links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Verify on {link.label} ↗
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};
```

### File 3: `src/components/detective/ReportExporter.ts`
Generates a complete, reproducible Markdown report (`GeoPulse_Case_${data.investigation_id}.md`) containing the research question, coordinates, NASA dataset provenance, statistical table, and interpretation.

---

## 3. 7-Slide / 30-Second Judge Pitch Blueprint (Owned by Dev 3)

Per the [Judging & Awards Guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/), your submission demo must be **either a 7-slide deck OR a 30-second video** in English:

| Slide / 4-Sec Beat | Title | Visual & Key Proof Point |
| :--- | :--- | :--- |
| **Slide 1 (0–4s)** | **GeoPulse: Be An Earth System Trend Detective** | Live URL + Headline: Turning NASA satellite records into statistically tested regional discoveries in `<2 seconds`. |
| **Slide 2 (4–8s)** | **The Twin Problem: Variable Overload & Regional Divergence** | Show how Pakistan's national rainfall average hides wetting in the Upper Indus (`+p < 0.05`) vs. drying in Balochistan (`-p < 0.05`). |
| **Slide 3 (8–12s)** | **Guided Detective Workflow** | Screenshot of the 2-step Question Wizard & plain-English variable cards for students and educators. |
| **Slide 4 (12–17s)** | **Zero-Download Serverless NASA Architecture** | Diagram of [NASA POWER API](https://power.larc.nasa.gov/) (`MERRA-2`/`GLDAS` `<15 KB` JSON) + [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api) tiles + SciPy Serverless Engine. |
| **Slide 5 (17–22s)** | **Live Statistical Proof: OLS + Mann–Kendall + Sen's Slope** | Dual-region chart + Scorecard distinguishing significant trends (`p < 0.05`) from climate noise (`p ≥ 0.05`). |
| **Slide 6 (22–26s)** | **Evidence-First AI (Zero Hallucination) & Provenance** | Show how the AI explains only verified SciPy outputs and links directly to [NASA Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/) & [CUAHSI](https://www.cuahsi.org/). |
| **Slide 7 (26–30s)** | **Try GeoPulse Live Right Now** | QR Code + Public Vercel Link + 4 Pre-Loaded Golden Case Files ready for 1-click judge testing. |

---

## 4. Acceptance Checklist for Dev 3

- [ ] `<CaseFileBar />` switches between the 4 pre-cached Golden Case Files in `<50 ms`.
- [ ] `<QuestionWizardModal />` recommends the right NASA variable and displays plain-English definitions.
- [ ] `<EvidencePanel />` renders the 6-tier Confidence Badge, side-by-side statistical scorecard, grounded explanation, and clickable [NASA Giovanni](https://giovanni.gsfc.nasa.gov/giovanni/) / [CUAHSI](https://www.cuahsi.org/) verification links.
- [ ] Zero files outside `src/components/detective/**`, `src/lib/**`, and `docs/pitch/**` are modified.
