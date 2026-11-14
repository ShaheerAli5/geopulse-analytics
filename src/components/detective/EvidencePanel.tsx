"use client";

import React from "react";
import { InvestigationResponse, ConfidenceBadge } from "@/types/investigation";
import { exportInvestigationMarkdown, printInvestigationReport } from "./ReportExporter";
import { ProvenanceCard } from "./ProvenanceCard";

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
  const badgeA = BADGE_STYLES[data.region_a.stats.badge] || BADGE_STYLES.NO_MONOTONIC_TREND;
  const badgeB = data.region_b ? (BADGE_STYLES[data.region_b.stats.badge] || BADGE_STYLES.NO_MONOTONIC_TREND) : null;

  return (
    <aside className="w-full h-full bg-slate-900/95 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto text-xs shadow-xl">
      {/* Header & Export Actions */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="min-w-0">
          <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-semibold block">
            Statistical Proof & Detective Verdict
          </span>
          <h2 className="text-sm font-bold text-slate-100 mt-0.5 truncate" title={data.ai_interpretation.headline}>
            {data.ai_interpretation.headline}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => exportInvestigationMarkdown(data)}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition cursor-pointer shadow-sm text-[11px]"
            title="Download reproducible Markdown report (.md)"
          >
            Export .MD
          </button>
          <button
            type="button"
            onClick={printInvestigationReport}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold transition cursor-pointer text-[11px]"
            title="Print or save as PDF"
          >
            Print PDF
          </button>
        </div>
      </div>

      {/* Regional Divergence Alert Banner */}
      {data.divergence_detected && data.region_b && (
        <div className="bg-orange-950/50 border border-orange-500/50 rounded-lg p-3 text-orange-200 animate-fadeIn">
          <div className="flex items-center gap-2 font-mono font-bold text-[11px] uppercase tracking-wider text-orange-400">
            <span>⚡ Regional Divergence Detected</span>
          </div>
          <p className="mt-1 text-xs text-orange-200/90 leading-snug">
            {data.region_a.region.name} and {data.region_b.region.name} exhibit contrasting trajectories.
            National or global averages would conceal these localized environmental shifts.
          </p>
        </div>
      )}

      {/* Confidence Badges with Science Guidance Tooltip */}
      <div className="grid grid-cols-1 gap-2">
        <div className={`p-2.5 rounded-lg border font-mono ${badgeA.classes}`}>
          <div className="text-[10px] uppercase opacity-75">
            Region A: {data.region_a.region.name}
          </div>
          <div className="font-bold mt-0.5">
            {badgeA.icon} {badgeA.label}
          </div>
          {data.region_a.stats.mk_p_value >= 0.05 && (
            <div className="text-[10px] opacity-80 mt-1 font-sans italic border-t border-slate-700/50 pt-1">
              Note: Interannual variability currently exceeds the long-term trend (p ≥ 0.05).
            </div>
          )}
        </div>
        {data.region_b && badgeB && (
          <div className={`p-2.5 rounded-lg border font-mono ${badgeB.classes}`}>
            <div className="text-[10px] uppercase opacity-75">
              Region B: {data.region_b.region.name}
            </div>
            <div className="font-bold mt-0.5">
              {badgeB.icon} {badgeB.label}
            </div>
            {data.region_b.stats.mk_p_value >= 0.05 && (
              <div className="text-[10px] opacity-80 mt-1 font-sans italic border-t border-slate-700/50 pt-1">
                Note: Interannual variability currently exceeds the long-term trend (p ≥ 0.05).
              </div>
            )}
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
            <tr>
              <td className="p-2 text-slate-400">OLS R²</td>
              <td className="p-2">{data.region_a.stats.ols_r_squared}</td>
              {data.region_b && <td className="p-2">{data.region_b.stats.ols_r_squared}</td>}
            </tr>
            <tr>
              <td className="p-2 text-slate-400">Lag-1 Autocorr</td>
              <td className="p-2">{data.region_a.stats.lag1_autocorrelation}</td>
              {data.region_b && <td className="p-2">{data.region_b.stats.lag1_autocorrelation}</td>}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Evidence-First Detective Explanation */}
      <div className="space-y-2.5 bg-slate-800/40 p-3 rounded-lg border border-slate-800 leading-relaxed text-slate-300">
        <div>
          <strong className="text-slate-100 block font-semibold mb-0.5">1. What is changing & how much:</strong>
          {data.ai_interpretation.what_is_changing}
        </div>
        <div>
          <strong className="text-slate-100 block font-semibold mb-0.5">2. Regional comparison & divergence:</strong>
          {data.ai_interpretation.where_it_diverges}
        </div>
        <div>
          <strong className="text-slate-100 block font-semibold mb-0.5">3. Statistical significance & caveats:</strong>
          {data.ai_interpretation.statistical_verdict} {data.ai_interpretation.limitations_and_caveats}
        </div>
      </div>

      {/* NASA Provenance & Cross-Verification Links Card */}
      <ProvenanceCard provenance={data.provenance} />
    </aside>
  );
};

