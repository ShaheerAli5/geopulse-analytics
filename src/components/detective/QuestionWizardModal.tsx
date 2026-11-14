"use client";

import React, { useState } from "react";

export interface WizardTheme {
  id: string;
  question: string;
  description: string;
  recommendedVariable: string;
  variableName: string;
  suggestedA: { name: string; lat: number; lon: number };
  suggestedB: { name: string; lat: number; lon: number };
  aggregation: "annual" | "monsoon_jjas" | "winter_djf";
}

export const WIZARD_THEMES: WizardTheme[] = [
  {
    id: "drought",
    question: "Is my region drying up or experiencing chronic soil moisture decline?",
    description: "Evaluates multi-decade root-zone soil wetness (GLDAS/MERRA-2) to distinguish meteorological drought from agricultural soil depletion.",
    recommendedVariable: "GWETROOT",
    variableName: "Root-Zone Soil Moisture Wetness (0-1)",
    suggestedA: { name: "Upper Indus", lat: 35.30, lon: 75.60 },
    suggestedB: { name: "Southwestern Balochistan", lat: 27.50, lon: 64.00 },
    aggregation: "annual",
  },
  {
    id: "heatwave",
    question: "Where is extreme atmospheric heat accelerating faster: inland or coastal?",
    description: "Analyzes 2-meter air temperature (MERRA-2/Aqua AIRS) across continental interiors versus maritime coasts.",
    recommendedVariable: "T2M",
    variableName: "Surface Air Temperature (2 Meters, °C)",
    suggestedA: { name: "Jacobabad (Inland Thermal Pole)", lat: 28.28, lon: 68.44 },
    suggestedB: { name: "Karachi (Arabian Sea Coast)", lat: 24.86, lon: 67.01 },
    aggregation: "annual",
  },
  {
    id: "monsoon",
    question: "Are monsoon rain patterns shifting or becoming more erratic?",
    description: "Isolates June-September summer precipitation (MERRA-2/GPM IMERG) to test if seasonal monsoon delivery has statistically changed.",
    recommendedVariable: "PRECTOTCORR",
    variableName: "Bias-Corrected Total Precipitation (mm/day)",
    suggestedA: { name: "Upper Indus Basin", lat: 35.30, lon: 75.60 },
    suggestedB: { name: "Lower Sindh Plains", lat: 25.40, lon: 68.35 },
    aggregation: "monsoon_jjas",
  },
  {
    id: "aerosols",
    question: "Are atmospheric aerosols, smoke, or dust dimming solar radiation reaching the surface?",
    description: "Measures all-sky downward solar shortwave radiation (CERES/MODIS/OMI) to investigate solar dimming or brightening.",
    recommendedVariable: "ALLSKY_SFC_SW_DWN",
    variableName: "All-Sky Surface Downward Solar Irradiance (kW-hr/m²/day)",
    suggestedA: { name: "Indo-Gangetic Smog Basin", lat: 31.52, lon: 74.35 },
    suggestedB: { name: "Himalayan Foothills", lat: 34.08, lon: 74.79 },
    aggregation: "winter_djf",
  },
];

export interface QuestionWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (theme: WizardTheme) => void;
}

export const QuestionWizardModal: React.FC<QuestionWizardModalProps> = ({
  isOpen,
  onClose,
  onApplyTheme,
}) => {
  const [selectedThemeId, setSelectedThemeId] = useState<string>(WIZARD_THEMES[0].id);

  if (!isOpen) return null;

  const activeTheme = WIZARD_THEMES.find((t) => t.id === selectedThemeId) || WIZARD_THEMES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              ?
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Ask the Earth System Trend Detective
              </h2>
              <p className="text-xs text-slate-400">
                Pick your environmental research question to configure the right NASA parameters.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto text-xs">
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block mb-2">
              Step 1: What ecological or climate phenomenon do you want to test?
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {WIZARD_THEMES.map((theme) => {
                const isSelected = theme.id === selectedThemeId;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? "bg-cyan-950/60 border-cyan-500 text-white shadow-md shadow-cyan-500/10"
                        : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-100">
                        {theme.question}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 shrink-0 ml-2">
                        {theme.recommendedVariable}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {theme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended Parameters Preview */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
              Step 2: Recommended NASA Investigation Configuration
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Recommended Variable:
                </span>
                <span className="text-slate-200 font-medium">{activeTheme.variableName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Temporal Aggregation:
                </span>
                <span className="text-slate-200 font-medium uppercase font-mono">
                  {activeTheme.aggregation.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Pin A (Primary):
                </span>
                <span className="text-cyan-400 font-medium">
                  {activeTheme.suggestedA.name} ({activeTheme.suggestedA.lat}°, {activeTheme.suggestedA.lon}°)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-mono">
                  Pin B (Comparison):
                </span>
                <span className="text-orange-400 font-medium">
                  {activeTheme.suggestedB.name} ({activeTheme.suggestedB.lat}°, {activeTheme.suggestedB.lon}°)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApplyTheme(activeTheme);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/25"
          >
            <span>Load Investigation</span>
            <span>⚡</span>
          </button>
        </div>
      </div>
    </div>
  );
};
