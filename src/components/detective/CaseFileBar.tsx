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
  );
};
