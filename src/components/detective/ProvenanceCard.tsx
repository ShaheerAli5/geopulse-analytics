"use client";

import React from "react";
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
