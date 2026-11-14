"use client";

import React, { useState } from "react";
import type { InvestigationResponse } from "../../lib/types";
import { GOLDEN_CASE_METAS, getGoldenCase } from "../../lib/golden_case_data";

export interface CaseFileBarProps {
  selectedCaseId: string | null;
  onSelectCase: (caseId: string, caseData: InvestigationResponse) => void;
  onOpenWizard?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const CaseFileBar: React.FC<CaseFileBarProps> = ({
  selectedCaseId,
  onSelectCase,
  onOpenWizard,
  isLoading = false,
  className = "",
}) => {
  const [lastSwitchTimeMs, setLastSwitchTimeMs] = useState<number | null>(null);

  const handleCaseClick = (caseId: string) => {
    const t0 = performance.now();
    const caseData = getGoldenCase(caseId);
    if (caseData) {
      onSelectCase(caseId, caseData);
      const elapsed = performance.now() - t0;
      setLastSwitchTimeMs(elapsed);
    }
  };

  return (
    <div
      className={`w-full bg-slate-900/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 ${className}`}
      data-testid="case-file-bar"
    >
      {/* Brand & Golden Case Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mr-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold bg-cyan-950/70 border border-cyan-500/40 px-2 py-0.5 rounded">
            Golden Cases
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            NASA Satellite Records:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {GOLDEN_CASE_METAS.map((meta, idx) => {
            const isSelected = selectedCaseId === meta.id;
            return (
              <button
                key={meta.id}
                onClick={() => handleCaseClick(meta.id)}
                disabled={isLoading}
                className={`group px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                  isSelected
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400"
                    : "bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700/60"
                }`}
                title={`${meta.title} — ${meta.subtitle}: ${meta.summary}`}
                data-testid={`case-button-${meta.id}`}
              >
                <span
                  className={`font-mono text-[10px] px-1 py-0.2 rounded ${
                    isSelected
                      ? "bg-slate-950/30 text-slate-950 font-bold"
                      : "bg-slate-900/80 text-cyan-400"
                  }`}
                >
                  {idx + 1}
                </span>
                <span>{meta.title}</span>
                {meta.divergenceDetected && (
                  <span
                    className={`text-[9px] font-mono uppercase px-1 rounded ${
                      isSelected
                        ? "bg-slate-950/20 text-slate-950"
                        : "bg-amber-950/70 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    Divergence
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Latency Proof & Question Wizard Trigger */}
      <div className="flex items-center gap-3">
        {lastSwitchTimeMs !== null && (
          <span
            className="font-mono text-[10px] text-emerald-400 hidden md:inline-flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded"
            title="Instant in-memory golden demo switching benchmark"
          >
            <span>⚡ Switch:</span>
            <span className="font-bold">{lastSwitchTimeMs < 1 ? "<1" : lastSwitchTimeMs.toFixed(1)} ms</span>
            <span className="text-[9px] text-emerald-500/80">(&lt;50ms target)</span>
          </span>
        )}

        {onOpenWizard && (
          <button
            onClick={onOpenWizard}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            title="Open 2-step NASA question mapping wizard"
            data-testid="ask-detective-button"
          >
            <span>✨ Ask the Detective</span>
            <span className="text-[10px]">?</span>
          </button>
        )}
      </div>
    </div>
import React from "react";

export interface CaseFileOption {
  id: string;
  filename: string;
  title: string;
  badge: string;
  variable: string;
  regA: string;
  regB: string;
}

export const GOLDEN_CASE_FILES: CaseFileOption[] = [
  {
    id: "pk_divergence",
    filename: "pk_divergence.json",
    title: "1. Indus vs Balochistan",
    badge: "Hydro-Divergence",
    variable: "GWETROOT",
    regA: "Upper Indus",
    regB: "Balochistan",
  },
  {
    id: "pk_heatwave",
    filename: "pk_heatwave.json",
    title: "2. Jacobabad vs Karachi",
    badge: "Extreme Heat",
    variable: "T2M",
    regA: "Jacobabad",
    regB: "Karachi",
  },
  {
    id: "aral_sea",
    filename: "aral_sea.json",
    title: "3. Aral Sea vs Tien Shan",
    badge: "Desiccation",
    variable: "GWETROOT",
    regA: "Aral Sea",
    regB: "Tien Shan",
  },
  {
    id: "amazon_drying",
    filename: "amazon_drying.json",
    title: "4. Amazon Arc vs Core",
    badge: "Deforestation",
    variable: "PRECTOTCORR",
    regA: "Mato Grosso",
    regB: "Central Amazon",
  },
];

export interface CaseFileBarProps {
  activeCaseId: string | null;
  onSelectCase: (caseOption: CaseFileOption) => void;
  onOpenWizard: () => void;
}

export const CaseFileBar: React.FC<CaseFileBarProps> = ({
  activeCaseId,
  onSelectCase,
  onOpenWizard,
}) => {
  return (
    <header className="w-full bg-slate-950/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Brand & Mission Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-bold text-cyan-400 font-mono text-sm shadow-sm shadow-cyan-500/20">
            GP
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">
              GeoPulse Analytics
            </span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
              Earth System Trend Detective
            </span>
          </div>
        </div>

        <span className="text-slate-700 hidden md:inline">|</span>

        <span className="text-[11px] text-slate-400 hidden lg:inline font-mono">
          NASA Space Apps 2026
        </span>
      </div>

      {/* 4 1-Click Golden Case Files */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-mono uppercase text-slate-500 hidden sm:inline mr-1 font-semibold">
          Golden Cases:
        </span>
        {GOLDEN_CASE_FILES.map((c) => {
          const isActive = activeCaseId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCase(c)}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-xs transition border flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-300 border-slate-700/80 hover:bg-slate-850 hover:border-slate-600"
              }`}
              title={`Load verified NASA data for ${c.regA} vs ${c.regB} (${c.variable})`}
            >
              <span>{c.title}</span>
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-sans uppercase ${
                  isActive
                    ? "bg-slate-950/30 text-slate-950 font-semibold"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {c.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Guided Question Wizard Trigger */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenWizard}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-medium transition flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <span>?</span>
          <span>Ask Detective Wizard</span>
        </button>
      </div>
    </header>
  );
};
