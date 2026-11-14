"use client";

import React, { useState, useEffect } from "react";

export interface WizardTheme {
  id: string;
  question: string;
  description: string;
  recommendedVariable: string;
  variableName: string;
  suggestedA: { name: string; lat: number; lon: number };
  suggestedB: { name: string; lat: number; lon: number };
  aggregation: "annual" | "monsoon_jjas" | "winter_djf";
  category: "Hydrology" | "Temperature" | "Atmosphere" | "Solar Radiation";
  satelliteMission: string;
}

export const WIZARD_THEMES: WizardTheme[] = [
  {
    id: "drought",
    question: "Is my region drying up or experiencing chronic root-zone soil moisture decline?",
    description:
      "Evaluates multi-decade root-zone soil wetness (GLDAS/MERRA-2) to distinguish temporary meteorological drought from chronic agricultural soil moisture depletion.",
    recommendedVariable: "GWETROOT",
    variableName: "Root-Zone Soil Moisture Wetness (0-1 fraction)",
    suggestedA: { name: "Upper Indus Basin", lat: 35.30, lon: 75.60 },
    suggestedB: { name: "Southwestern Balochistan", lat: 27.50, lon: 64.00 },
    aggregation: "annual",
    category: "Hydrology",
    satelliteMission: "NASA GLDAS / MERRA-2 Land Surface Model",
  },
  {
    id: "heatwave",
    question: "Are extreme heatwaves intensifying faster in inland basins than on coastlines?",
    description:
      "Measures 2-meter surface air temperature warming trajectories to contrast extreme continental heating bowls against maritime coastal climates.",
    recommendedVariable: "T2M",
    variableName: "Surface Air Temperature at 2m (°C)",
    suggestedA: { name: "Jacobabad Thermal Bowl", lat: 28.28, lon: 68.44 },
    suggestedB: { name: "Karachi Arabian Coast", lat: 24.86, lon: 67.01 },
    aggregation: "annual",
    category: "Temperature",
    satelliteMission: "NASA Aqua AIRS / MERRA-2 Reanalysis",
  },
  {
    id: "rainfall_monsoon",
    question: "Is monsoon rainfall shifting or declining along deforestation frontiers?",
    description:
      "Analyzes bias-corrected precipitation across the Amazon deforestation arc versus protected core rainforest canopy across 4+ decades.",
    recommendedVariable: "PRECTOTCORR",
    variableName: "Bias-Corrected Precipitation Rate (mm/day)",
    suggestedA: { name: "Mato Grosso Arc of Deforestation", lat: -12.50, lon: -55.50 },
    suggestedB: { name: "Central Amazon Core Canopy", lat: -3.10, lon: -60.00 },
    aggregation: "annual",
    category: "Hydrology",
    satelliteMission: "NASA GPM IMERG / MERRA-2 Assimilation",
  },
  {
    id: "lake_desiccation",
    question: "How does terminal inland lake desiccation contrast with alpine glacial headwaters?",
    description:
      "Investigates the Aral Sea desiccation basin compared to the Tien Shan alpine glacier feeding zone to uncover upstream vs downstream water divorce.",
    recommendedVariable: "GWETROOT",
    variableName: "Root-Zone Soil Wetness (0-1 fraction)",
    suggestedA: { name: "Aral Sea Basin (Desiccated)", lat: 45.00, lon: 59.50 },
    suggestedB: { name: "Tien Shan Glacial Range", lat: 42.00, lon: 75.00 },
    aggregation: "annual",
    category: "Hydrology",
    satelliteMission: "NASA GLDAS / MERRA-2 Land Surface Model",
  },
  {
    id: "humidity_danger",
    question: "Is atmospheric water vapor rising to amplify humid heat stress during Monsoon?",
    description:
      "Tracks specific humidity (grams of water vapor per kg air) during peak summer monsoon months (JJAS) to detect dangerous wet-bulb heat environments.",
    recommendedVariable: "QV2M",
    variableName: "Specific Humidity at 2m (g/kg)",
    suggestedA: { name: "Lower Indus Plain (Sindh)", lat: 25.40, lon: 68.36 },
    suggestedB: { name: "Punjab Agricultural Basin", lat: 31.52, lon: 74.35 },
    aggregation: "monsoon_jjas",
    category: "Atmosphere",
    satelliteMission: "NASA Aqua AIRS / MERRA-2 Meteorology",
  },
  {
    id: "solar_dimming",
    question: "Are aerosol pollution and smoke dimming incoming surface solar radiation?",
    description:
      "Examines All-Sky Surface Shortwave Downward Irradiance to quantify whether high aerosol optical depths have driven regional solar dimming.",
    recommendedVariable: "ALLSKY_SFC_SW_DWN",
    variableName: "All-Sky Shortwave Solar Irradiance (kW-hr/m²/day)",
    suggestedA: { name: "Indo-Gangetic Smog Belt", lat: 28.61, lon: 77.21 },
    suggestedB: { name: "Himalayan Foothills", lat: 32.22, lon: 76.32 },
    aggregation: "annual",
    category: "Solar Radiation",
    satelliteMission: "NASA CERES / MODIS / Aura OMI Proxy",
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
  const [step, setStep] = useState<1 | 2>(1);

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeTheme =
    WIZARD_THEMES.find((t) => t.id === selectedThemeId) || WIZARD_THEMES[0];

  const handleApply = () => {
    onApplyTheme(activeTheme);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      data-testid="question-wizard-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-modal-title"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/95">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-lg font-mono">
              🔍
            </span>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-semibold">
                NASA Challenge Guided Workflow
              </div>
              <h2 id="wizard-modal-title" className="text-base font-bold text-slate-100">
                Ask the Earth System Trend Detective
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer text-sm"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Wizard Steps Progress Header */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-5 py-2.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 transition ${
              step === 1 ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">
              1
            </span>
            <span>Choose Question</span>
          </button>

          <span className="text-slate-600 mx-3">→</span>

          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 transition ${
              step === 2 ? "text-cyan-400 font-bold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px]">
              2
            </span>
            <span>NASA Variable & Target Basins</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {step === 1 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Select an environmental question to investigate across multi-decade NASA Earth observation records:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {WIZARD_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? "bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                          : "bg-slate-800/40 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-slate-100 flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? "bg-cyan-400" : "bg-slate-500"
                            }`}
                          />
                          {theme.question}
                        </span>
                        <span className="text-[10px] font-mono uppercase bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-cyan-300 shrink-0">
                          {theme.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 pl-4 leading-relaxed">
                        {theme.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Step 2: Confirmation & Target Coordinate Details */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-mono text-sm">📡</span>
                  <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                    Detective Configuration Breakdown
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-2">
                  <div>
                    <span className="text-slate-400 font-mono text-[11px]">Primary Question:</span>
                    <p className="font-semibold text-white mt-0.5">{activeTheme.question}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400">NASA Variable:</span>
                      <p className="text-cyan-300 font-semibold">{activeTheme.variableName}</p>
                      <p className="text-slate-500 text-[10px]">Code: {activeTheme.recommendedVariable}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Mission / Model:</span>
                      <p className="text-slate-200">{activeTheme.satelliteMission}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-700/60 font-mono text-[11px]">
                    <div className="p-2 rounded bg-slate-900 border border-cyan-500/30">
                      <span className="text-cyan-400 font-bold">Pin A (Baseline Region):</span>
                      <p className="text-white mt-0.5 font-semibold">{activeTheme.suggestedA.name}</p>
                      <p className="text-slate-400 text-[10px]">
                        {activeTheme.suggestedA.lat}°N, {activeTheme.suggestedA.lon}°E
                      </p>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-orange-500/30">
                      <span className="text-orange-400 font-bold">Pin B (Comparison Region):</span>
                      <p className="text-white mt-0.5 font-semibold">{activeTheme.suggestedB.name}</p>
                      <p className="text-slate-400 text-[10px]">
                        {activeTheme.suggestedB.lat}°N, {activeTheme.suggestedB.lon}°E
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700/60 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Aggregation Mode:</span>
                    <span className="text-slate-200 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {activeTheme.aggregation}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between p-4 border-t border-slate-800 bg-slate-900/90 text-xs">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>Review Configuration</span>
                <span>→</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
              >
                ← Back to Questions
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold font-mono transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <span>⚡ Apply to Workbench & Investigate</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
