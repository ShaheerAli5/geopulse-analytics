"use client";

import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { InvestigationResponse } from "@/types/investigation";

export interface TrendChartProps {
  data: InvestigationResponse;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [fitMode, setFitMode] = useState<"ols" | "sen">("ols");

  // Safeguard against missing or malformed data payload
  const hasValidData = Boolean(
    data &&
    data.region_a &&
    Array.isArray(data.region_a.series) &&
    data.region_a.series.length > 0
  );

  // Merge Region A and Region B series by chronological year (NOT by raw array index)
  // to prevent misalignment if either region has missing observations.
  const mergedSeries = useMemo(() => {
    if (!hasValidData) return [];

    const seriesA = data.region_a.series || [];
    const seriesB = data.region_b?.series || [];

    const mapA = new Map(seriesA.map((pt) => [pt.year, pt]));
    const mapB = new Map(seriesB.map((pt) => [pt.year, pt]));

    const allYears = Array.from(new Set([...mapA.keys(), ...mapB.keys()])).sort(
      (a, b) => a - b
    );

    return allYears.map((year) => {
      const ptA = mapA.get(year);
      const ptB = mapB.get(year);

      return {
        year,
        valA: ptA ? ptA.value : null,
        fitA: ptA ? (fitMode === "ols" ? ptA.ols_fitted : ptA.sen_fitted) : null,
        anomalyA: ptA ? ptA.anomaly : null,
        valB: ptB ? ptB.value : null,
        fitB: ptB ? (fitMode === "ols" ? ptB.ols_fitted : ptB.sen_fitted) : null,
        anomalyB: ptB ? ptB.anomaly : null,
      };
    });
  }, [hasValidData, data?.region_a?.series, data?.region_b?.series, fitMode]);

  if (!hasValidData) {
    return (
      <div className="w-full h-full min-h-[300px] bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-lg">
        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-3">
          <span className="text-cyan-400 font-mono text-lg">⚡</span>
        </div>
        <p className="text-sm font-semibold text-slate-200">No time-series data available.</p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Select a research question or click <strong className="text-cyan-400 font-semibold">Run Investigation</strong> in the sidebar to compute trends.
        </p>
      </div>
    );
  }

  const statsA = data.region_a.stats;
  const statsB = data.region_b?.stats;

  const getSlopeLabel = (stats: typeof statsA | undefined, mode: "ols" | "sen"): string => {
    if (!stats || stats.badge === "INSUFFICIENT_DATA") return "N/A";
    const val = mode === "ols" ? stats.ols_slope_per_decade : stats.sen_slope_per_decade;
    if (typeof val !== "number" || !Number.isFinite(val)) return "N/A";
    return `${val >= 0 ? "+" : ""}${val.toFixed(3)}/dec`;
  };

  const slopeLabelA = getSlopeLabel(statsA, fitMode);
  const slopeLabelB = getSlopeLabel(statsB, fitMode);

  return (
    <div className="w-full h-full min-h-[300px] bg-slate-900/95 border border-slate-800 rounded-xl p-4 flex flex-col shadow-lg">
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">
              {data.variable_name} ({data.units}) — {data.start_year} to {data.end_year}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Solid lines depict NASA observations; dashed lines show{" "}
            <span className="text-slate-200 font-medium">
              {fitMode === "ols" ? "Ordinary Least Squares (OLS)" : "Theil–Sen Robust Slope"}
            </span>{" "}
            trend fit.
          </p>
        </div>

        {/* Fit Mode Toggle Controls */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs font-mono">
          <button
            type="button"
            aria-pressed={fitMode === "ols"}
            onClick={() => setFitMode("ols")}
            className={`px-3 py-1 rounded transition font-medium ${
              fitMode === "ols"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
            title="Ordinary Least Squares linear regression"
          >
            OLS Linear Fit
          </button>
          <button
            type="button"
            aria-pressed={fitMode === "sen"}
            onClick={() => setFitMode("sen")}
            className={`px-3 py-1 rounded transition font-medium ${
              fitMode === "sen"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
            title="Theil-Sen non-parametric robust median slope (outlier resistant)"
          >
            Sen&apos;s Robust Slope
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full min-h-[220px] relative">
        <ResponsiveContainer width="100%" height="100%" minHeight={220}>
          <ComposedChart data={mergedSeries} margin={{ top: 10, right: 15, left: -5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="year"
              stroke="#94a3b8"
              tick={{ fontSize: 11, fontFamily: "monospace", fill: "#94a3b8" }}
              tickLine={{ stroke: "#334155" }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fontSize: 11, fontFamily: "monospace", fill: "#94a3b8" }}
              tickLine={{ stroke: "#334155" }}
              domain={["auto", "auto"]}
              width={48}
            />
            <Tooltip
              content={({
                active,
                payload,
                label,
              }: {
                active?: boolean;
                payload?: Array<{ payload?: any }>;
                label?: string | number;
              }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0]?.payload;
                return (
                  <div className="bg-slate-950/95 border border-slate-700/80 rounded-lg p-3 shadow-2xl font-mono text-xs text-slate-200 min-w-[220px]">
                    <div className="font-bold border-b border-slate-800 pb-1.5 mb-2 text-slate-100 flex items-center justify-between">
                      <span>Year: {label}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">{data.aggregation_mode}</span>
                    </div>

                    {/* Region A values */}
                    <div className="space-y-1 mb-2">
                      <div className="text-cyan-400 font-semibold flex items-center justify-between">
                        <span>A: {data.region_a.region.name}</span>
                        <span>
                          {typeof point?.valA === "number" ? `${point.valA.toFixed(4)} ${data.units}` : "N/A"}
                        </span>
                      </div>
                      <div className="text-cyan-300/80 text-[11px] flex items-center justify-between pl-2">
                        <span>{fitMode.toUpperCase()} Fit:</span>
                        <span>
                          {typeof point?.fitA === "number" ? `${point.fitA.toFixed(4)} ${data.units}` : "N/A"}
                        </span>
                      </div>
                      <div className="text-slate-400 text-[10px] flex items-center justify-between pl-2">
                        <span>Anomaly:</span>
                        <span>
                          {typeof point?.anomalyA === "number"
                            ? `${point.anomalyA >= 0 ? "+" : ""}${point.anomalyA.toFixed(4)}`
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Region B values */}
                    {data.region_b && point?.valB !== null && point?.valB !== undefined && (
                      <div className="space-y-1 pt-2 border-t border-slate-800">
                        <div className="text-orange-400 font-semibold flex items-center justify-between">
                          <span>B: {data.region_b.region.name}</span>
                          <span>
                            {typeof point?.valB === "number" ? `${point.valB.toFixed(4)} ${data.units}` : "N/A"}
                          </span>
                        </div>
                        <div className="text-orange-300/80 text-[11px] flex items-center justify-between pl-2">
                          <span>{fitMode.toUpperCase()} Fit:</span>
                          <span>
                            {typeof point?.fitB === "number" ? `${point.fitB.toFixed(4)} ${data.units}` : "N/A"}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[10px] flex items-center justify-between pl-2">
                          <span>Anomaly:</span>
                          <span>
                            {typeof point?.anomalyB === "number"
                              ? `${point.anomalyB >= 0 ? "+" : ""}${point.anomalyB.toFixed(4)}`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "11px",
                fontFamily: "monospace",
                paddingTop: "8px",
              }}
            />

            {/* Region A Lines */}
            <Line
              type="monotone"
              dataKey="valA"
              name={`Reg A: ${data.region_a.region.name} (${data.units})`}
              stroke="#06B6D4"
              strokeWidth={2}
              dot={{ r: 2.5, fill: "#06B6D4" }}
              activeDot={{ r: 5, stroke: "#fff", strokeWidth: 1 }}
              connectNulls
              isAnimationActive={false}
            />
            <Line
              type="linear"
              dataKey="fitA"
              name={`Reg A ${fitMode.toUpperCase()} (${slopeLabelA})`}
              stroke="#22D3EE"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              connectNulls
              isAnimationActive={false}
            />

            {/* Region B Lines */}
            {data.region_b && (
              <>
                <Line
                  type="monotone"
                  dataKey="valB"
                  name={`Reg B: ${data.region_b.region.name} (${data.units})`}
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: "#F97316" }}
                  activeDot={{ r: 5, stroke: "#fff", strokeWidth: 1 }}
                  connectNulls
                  isAnimationActive={false}
                />
                <Line
                  type="linear"
                  dataKey="fitB"
                  name={`Reg B ${fitMode.toUpperCase()} (${slopeLabelB})`}
                  stroke="#FB923C"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
