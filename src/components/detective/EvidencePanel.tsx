"use client";

import React from "react";
import type { InvestigationResponse, ConfidenceBadge } from "../../lib/types";
import { exportInvestigationMarkdown } from "./ReportExporter";
import { ProvenanceCard } from "./ProvenanceCard";

export const BADGE_STYLES: Record<
  ConfidenceBadge,
  { label: string; classes: string; icon: string }
> = {
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
    classes: "bg-slate-800/90 text-slate-300 border-slate-600",
    icon: "~",
  },
  DECREASING_NOT_SIGNIFICANT: {
    label: "DOWNWARD DRIFT • NOT SIGNIFICANT (p ≥ 0.05)",
    classes: "bg-slate-800/90 text-slate-300 border-slate-600",
    icon: "~",
  },
  NO_MONOTONIC_TREND: {
    label: "NO MONOTONIC TREND DETECTED",
    classes: "bg-slate-800/80 text-slate-400 border-slate-700",
    icon: "—",
  },
  INSUFFICIENT_DATA: {
    label: "INSUFFICIENT DATA (<10 YEARS)",
    classes: "bg-amber-950/70 text-amber-300 border-amber-500/50",
    icon: "!",
  },
};

export interface EvidencePanelProps {
  data: InvestigationResponse;
  onExportMarkdown?: () => void;
  className?: string;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  data,
  onExportMarkdown,
  className = "",
}) => {
  const badgeA =
    BADGE_STYLES[data.region_a.stats.badge] || BADGE_STYLES.NO_MONOTONIC_TREND;
  const badgeB = data.region_b
    ? BADGE_STYLES[data.region_b.stats.badge] || BADGE_STYLES.NO_MONOTONIC_TREND
    : null;

  const handleExport = () => {
    if (onExportMarkdown) {
      onExportMarkdown();
    } else {
      exportInvestigationMarkdown(data);
    }
  };

  const regAStats = data.region_a.stats;
  const regBStats = data.region_b?.stats;

  const signOlsA = regAStats.ols_slope_per_decade >= 0 ? "+" : "";
  const signSenA = regAStats.sen_slope_per_decade >= 0 ? "+" : "";

  const signOlsB = regBStats && regBStats.ols_slope_per_decade >= 0 ? "+" : "";
  const signSenB = regBStats && regBStats.sen_slope_per_decade >= 0 ? "+" : "";

  return (
    <aside
      className={`w-full h-full bg-slate-900/95 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto text-xs ${className}`}
      data-testid="evidence-panel"
    >
      {/* Header & Export */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-semibold block">
            Statistical Proof & Detective Verdict
          </span>
          <h2 className="text-sm font-bold text-slate-100 mt-1 leading-snug">
            {data.ai_interpretation.headline}
          </h2>
        </div>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition shrink-0 shadow-sm flex items-center gap-1.5 cursor-pointer"
          title="Download reproducible scientific Markdown case report"
        >
          <span>Export .MD</span>
          <span className="text-[10px]">↓</span>
        </button>
      </div>

      {/* Regional Divergence Alert Banner */}
      {data.divergence_detected && data.region_b && (
        <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-500/60 text-amber-200 flex items-start gap-2.5 shadow-sm">
          <span className="text-amber-400 text-base leading-none">⚠️</span>
          <div>
            <div className="font-bold text-[11px] uppercase tracking-wide text-amber-300">
              Regional Divergence Confirmed
            </div>
            <div className="text-[11px] text-amber-200/90 mt-0.5 leading-tight">
              Statistical trajectory contrasts significantly between{" "}
              <span className="text-cyan-300 font-semibold">
                {data.region_a.region.name}
              </span>{" "}
              and{" "}
              <span className="text-orange-300 font-semibold">
                {data.region_b.region.name}
              </span>
              . Aggregated broad-scale averages hide these local climatic shifts.
            </div>
          </div>
        </div>
      )}

      {/* 6-Tier Confidence Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div
          className={`p-2.5 rounded-lg border font-mono shadow-sm transition-all ${badgeA.classes}`}
          data-testid="badge-region-a"
        >
          <div className="text-[10px] uppercase opacity-80 flex items-center gap-1 text-cyan-300">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Reg A: {data.region_a.region.name}</span>
          </div>
          <div className="font-bold mt-1 text-[11px]">
            {badgeA.icon} {badgeA.label}
          </div>
        </div>

        {data.region_b && badgeB ? (
          <div
            className={`p-2.5 rounded-lg border font-mono shadow-sm transition-all ${badgeB.classes}`}
            data-testid="badge-region-b"
          >
            <div className="text-[10px] uppercase opacity-80 flex items-center gap-1 text-orange-300">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              <span>Reg B: {data.region_b.region.name}</span>
            </div>
            <div className="font-bold mt-1 text-[11px]">
              {badgeB.icon} {badgeB.label}
            </div>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg border border-dashed border-slate-800 bg-slate-950/40 text-slate-500 font-mono flex items-center justify-center text-[10px]">
            Drop Region B on map for comparison
          </div>
        )}
      </div>

      {/* Comparative Statistical Scorecard Table */}
      <div className="bg-slate-800/60 rounded-lg border border-slate-700/70 overflow-hidden shadow-sm">
        <table className="w-full text-left font-mono text-[11px]">
          <thead className="bg-slate-800/90 text-slate-300 border-b border-slate-700">
            <tr>
              <th className="p-2 font-semibold">Statistical Metric</th>
              <th className="p-2 text-cyan-400 font-semibold">
                Reg A ({data.region_a.region.name.split(" ")[0]})
              </th>
              {data.region_b && (
                <th className="p-2 text-orange-400 font-semibold">
                  Reg B ({data.region_b.region.name.split(" ")[0]})
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            <tr>
              <td className="p-2 text-slate-400">OLS Slope / dec</td>
              <td className="p-2 font-bold text-cyan-200">
                {signOlsA}
                {regAStats.ols_slope_per_decade.toFixed(4)} {data.units}
              </td>
              {regBStats && (
                <td className="p-2 font-bold text-orange-200">
                  {signOlsB}
                  {regBStats.ols_slope_per_decade.toFixed(4)} {data.units}
                </td>
              )}
            </tr>
            <tr>
              <td className="p-2 text-slate-400">Sen&apos;s Slope / dec</td>
              <td className="p-2">
                {signSenA}
                {regAStats.sen_slope_per_decade.toFixed(4)} {data.units}
              </td>
              {regBStats && (
                <td className="p-2">
                  {signSenB}
                  {regBStats.sen_slope_per_decade.toFixed(4)} {data.units}
                </td>
              )}
            </tr>
            <tr>
              <td className="p-2 text-slate-400">Mann–Kendall p</td>
              <td
                className={`p-2 font-bold ${
                  regAStats.mk_p_value < 0.05
                    ? "text-emerald-400"
                    : "text-slate-400"
                }`}
              >
                {regAStats.mk_p_value.toFixed(4)}
              </td>
              {regBStats && (
                <td
                  className={`p-2 font-bold ${
                    regBStats.mk_p_value < 0.05
                      ? "text-emerald-400"
                      : "text-slate-400"
                  }`}
                >
                  {regBStats.mk_p_value.toFixed(4)}
                </td>
              )}
            </tr>
            <tr>
              <td className="p-2 text-slate-400">Kendall&apos;s τ (Z)</td>
              <td className="p-2">
                {regAStats.mk_tau.toFixed(2)} ({regAStats.mk_z_score.toFixed(2)})
              </td>
              {regBStats && (
                <td className="p-2">
                  {regBStats.mk_tau.toFixed(2)} ({regBStats.mk_z_score.toFixed(2)})
                </td>
              )}
            </tr>
            <tr>
              <td className="p-2 text-slate-400">95% CI (/dec)</td>
              <td className="p-2 text-[10px]">
                [{regAStats.ols_ci_lower_decade.toFixed(4)},{" "}
                {regAStats.ols_ci_upper_decade.toFixed(4)}]
              </td>
              {regBStats && (
                <td className="p-2 text-[10px]">
                  [{regBStats.ols_ci_lower_decade.toFixed(4)},{" "}
                  {regBStats.ols_ci_upper_decade.toFixed(4)}]
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Evidence-First Grounded Explanation */}
      <div className="space-y-2.5 bg-slate-800/40 p-3.5 rounded-lg border border-slate-800 leading-relaxed text-slate-300">
        <div>
          <strong className="text-slate-100 font-semibold block text-[11px] mb-0.5">
            1. What is changing & how much:
          </strong>
          <p className="text-slate-300 text-[11px]">
            {data.ai_interpretation.what_is_changing}
          </p>
        </div>
        <div>
          <strong className="text-slate-100 font-semibold block text-[11px] mb-0.5">
            2. Regional comparison & divergence:
          </strong>
          <p className="text-slate-300 text-[11px]">
            {data.ai_interpretation.where_it_diverges}
          </p>
        </div>
        <div>
          <strong className="text-slate-100 font-semibold block text-[11px] mb-0.5">
            3. Statistical significance & caveats:
          </strong>
          <p className="text-slate-300 text-[11px]">
            {data.ai_interpretation.statistical_verdict}{" "}
            <span className="text-slate-400">
              {data.ai_interpretation.limitations_and_caveats}
            </span>
          </p>
        </div>
      </div>

      {/* Embedded Provenance Card */}
      <div className="mt-auto">
        <ProvenanceCard provenance={data.provenance} />
      </div>
    </aside>
  );
};
