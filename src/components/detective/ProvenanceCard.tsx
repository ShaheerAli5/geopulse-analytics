"use client";

import React from "react";
import type { ProvenanceInfo } from "../../lib/types";

export interface ProvenanceCardProps {
  provenance: ProvenanceInfo;
  className?: string;
}

export const ProvenanceCard: React.FC<ProvenanceCardProps> = ({
  provenance,
  className = "",
}) => {
  const links = provenance.verification_links || [];

  return (
    <div
      className={`bg-slate-950/90 p-3.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-2 ${className}`}
      data-testid="provenance-card"
    >
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>NASA Dataset Provenance</span>
        </div>
        {provenance.retrieved_at_utc && (
          <span className="text-[10px] text-slate-500">
            UTC: {provenance.retrieved_at_utc.replace("T", " ").replace("Z", "")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
        <div>
          <span className="text-slate-500">Mission/Model: </span>
          <span className="font-semibold text-slate-200">{provenance.mission_model}</span>
        </div>
        <div>
          <span className="text-slate-500">Source: </span>
          <span>{provenance.source_name || "NASA POWER Analysis Ready"}</span>
        </div>
        <div>
          <span className="text-slate-500">Spatial Grid: </span>
          <span>{provenance.spatial_resolution}</span>
        </div>
        <div>
          <span className="text-slate-500">Filtered Gaps: </span>
          <span className="text-emerald-400">
            {provenance.missing_months_filtered} missing months
          </span>
        </div>
      </div>

      {links.length > 0 && (
        <div className="pt-1.5 border-t border-slate-800/70">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">
            Independent Cross-Verification Links
          </div>
          <div className="flex flex-wrap gap-2.5">
            {links.map((link) => (
              <a
                key={link.url + link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
                title={`Cross-verify dataset at ${link.label}`}
              >
                <span>{link.label}</span>
                <span className="text-[10px] text-cyan-500">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}
import { InvestigationResponse } from "@/types/investigation";

export interface ProvenanceCardProps {
  provenance: InvestigationResponse["provenance"];
}

export const ProvenanceCard: React.FC<ProvenanceCardProps> = ({ provenance }) => {
  return (
    <div className="mt-auto bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1 shadow-inner">
      <div className="text-slate-200 font-semibold flex items-center justify-between">
        <span>NASA Provenance: {provenance.mission_model}</span>
        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40 font-mono">
          Verified
        </span>
      </div>
      <div>
        Grid: {provenance.spatial_resolution} • Missing Filtered: {provenance.missing_months_filtered}
      </div>
      <div className="text-[10px] text-slate-500 truncate" title={provenance.api_endpoint}>
        Endpoint: {provenance.api_endpoint}
      </div>
      <div className="flex flex-wrap gap-2.5 pt-1">
        {provenance.verification_links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            Verify on {link.label} ↗
          </a>
        ))}
      </div>
    </div>
  );
};
