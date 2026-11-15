"use client";

import React, { useState } from "react";

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
  isLoading?: boolean;
}

export const CaseFileBar: React.FC<CaseFileBarProps> = ({
  activeCaseId,
  onSelectCase,
  onOpenWizard,
  isLoading = false,
}) => {
  const [lastSwitchMs, setLastSwitchMs] = useState<number | null>(null);

  const handleCaseClick = (caseOption: CaseFileOption) => {
    const t0 = performance.now();
    onSelectCase(caseOption);
    const elapsed = performance.now() - t0;
    setLastSwitchMs(elapsed);
  };

  return (
    <header
      className="w-full bg-slate-950/95 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs"
      data-testid="case-file-bar"
    >
      {/* Brand & Mission Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center font-bold text-cyan-400 font-mono text-sm shadow-sm shadow-cyan-500/20">
            GP
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">
              GeoPulse Analytics
            </span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase font-semibold">
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
        <span className="text-[10px] font-mono uppercase text-slate-400 hidden sm:inline mr-1 font-semibold">
          Golden Cases:
        </span>
        {GOLDEN_CASE_FILES.map((c) => {
          const isActive = activeCaseId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              disabled={isLoading}
              onClick={() => handleCaseClick(c)}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-xs transition border flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                isActive
                  ? "bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20"
                  : "bg-slate-900 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600 hover:text-white"
              }`}
              title={`Load verified NASA data for ${c.regA} vs ${c.regB} (${c.variable})`}
              data-testid={`case-button-${c.id}`}
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

      {/* Guided Question Wizard Trigger & Benchmark */}
      <div className="flex items-center gap-2">
        {lastSwitchMs !== null && (
          <span
            className="font-mono text-[10px] text-emerald-400 hidden md:inline-flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded"
            title="Instant golden demo switching benchmark"
          >
            <span>⚡ Ready:</span>
            <span className="font-bold">{lastSwitchMs < 1 ? "<1" : lastSwitchMs.toFixed(1)}ms</span>
            <span className="text-[9px] text-emerald-500/80">(&lt;50ms)</span>
          </span>
        )}

        <button
          type="button"
          onClick={onOpenWizard}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold font-mono text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
          title="Open guided 2-step NASA question mapping wizard"
          data-testid="ask-detective-button"
        >
          <span>✨</span>
          <span>Ask Detective Wizard</span>
        </button>
      </div>
    </header>
  );
};
