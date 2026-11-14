"use client";

import React, { useState, useEffect } from "react";
import type { RegionInput } from "../../lib/types";

export interface WizardInvestigationConfig {
  variable_id: string;
  variable_name: string;
  units: string;
  plain_definition: string;
  aggregation_mode: "annual" | "monsoon_jjas" | "winter_djf";
  region_a: RegionInput;
  region_b?: RegionInput;
  theme_id: string;
  sample_question: string;
}

export interface QuestionWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInvestigation?: (config: WizardInvestigationConfig) => void;
}

interface WizardThemeOption {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  sampleQuestion: string;
  variableId: string;
  variableName: string;
  units: string;
  aggregationMode: "annual" | "monsoon_jjas" | "winter_djf";
  plainDefinition: string;
  sensorSource: string;
  regionA: RegionInput;
  regionB?: RegionInput;
}

const WIZARD_THEMES: WizardThemeOption[] = [
  {
    id: "drought-water",
    title: "Drought & Root-Zone Water Depletion",
    icon: "💧",
    shortDesc:
      "Investigate multi-decade soil water deficits, groundwater depletion, and agricultural irrigation pressure.",
    sampleQuestion:
      "Is root-zone soil moisture drying out across major breadbaskets or arid basins over the last 40+ years?",
    variableId: "GWETROOT",
    variableName: "Root-Zone Soil Moisture Wetness",
    units: "fraction (0-1)",
    aggregationMode: "annual",
    plainDefinition:
      "Fraction of water filling soil pores in the top 100 cm root zone (0 = completely desiccated, 1 = fully saturated soil).",
    sensorSource: "NASA MERRA-2 Land / Catchment Hydrology Model",
    regionA: {
      id: "A",
      name: "Upper Indus Basin",
      lat: 35.3,
      lon: 75.6,
    },
    regionB: {
      id: "B",
      name: "Southwestern Balochistan",
      lat: 27.5,
      lon: 64.0,
    },
  },
  {
    id: "heatwaves-urban",
    title: "Extreme Heatwaves & Thermal Exposure",
    icon: "🔥",
    shortDesc:
      "Examine surface air warming rates, urban thermal divergence, and dangerous summer heat stress trends.",
    sampleQuestion:
      "Are inland heat poles experiencing faster warming trends than maritime coastal metropolises?",
    variableId: "T2M",
    variableName: "Surface Air Temperature (2 Meters)",
    units: "°C",
    aggregationMode: "annual",
    plainDefinition:
      "Air temperature measured 2 meters above ground—the global meteorological benchmark for human, crop, and ecosystem heat exposure.",
    sensorSource: "NASA MERRA-2 Atmospheric Reanalysis",
    regionA: {
      id: "A",
      name: "Jacobabad (Inland Thermal Pole)",
      lat: 28.28,
      lon: 68.44,
    },
    regionB: {
      id: "B",
      name: "Karachi (Arabian Sea Coast)",
      lat: 24.86,
      lon: 67.01,
    },
  },
  {
    id: "rainfall-monsoon",
    title: "Monsoon Shifts & Rainfall Extremes",
    icon: "🌧️",
    shortDesc:
      "Detect shifts in seasonal precipitation intensity, rainforest desiccation, and flooding anomalies.",
    sampleQuestion:
      "Are deforestation frontiers experiencing statistically significant precipitation drops compared to intact core rainforest?",
    variableId: "PRECTOTCORR",
    variableName: "Bias-Corrected Total Precipitation",
    units: "mm/day",
    aggregationMode: "monsoon_jjas",
    plainDefinition:
      "Average daily precipitation (rain and melted snow) reaching Earth's surface, bias-corrected using satellite radar and ground gauges.",
    sensorSource: "NASA POWER Analysis Ready Data / MERRA-2",
    regionA: {
      id: "A",
      name: "Mato Grosso (Arc of Deforestation)",
      lat: -12.5,
      lon: -55.5,
    },
    regionB: {
      id: "B",
      name: "Central Amazon Rainforest (Core)",
      lat: -3.1,
      lon: -60.0,
    },
  },
  {
    id: "solar-humidity",
    title: "Solar Irradiance & Atmospheric Moisture",
    icon: "☀️",
    shortDesc:
      "Analyze atmospheric moisture holding capacity alongside all-sky solar radiation reaching the surface.",
    sampleQuestion:
      "How is surface solar radiation trending alongside specific humidity in high-latitude or mountain regions?",
    variableId: "ALLSKY_SFC_SW_DWN",
    variableName: "All Sky Surface Downward Solar Irradiance",
    units: "kW-hr/m²/day",
    aggregationMode: "annual",
    plainDefinition:
      "Total solar energy incident per square meter per day across all sky conditions, driving evaporation and renewable potential.",
    sensorSource: "NASA CERES / GEWEX Surface Radiation Budget",
    regionA: {
      id: "A",
      name: "Aral Sea Basin",
      lat: 45.0,
      lon: 59.5,
    },
    regionB: {
      id: "B",
      name: "Tien Shan Mountains",
      lat: 42.0,
      lon: 75.0,
    },
  },
];

export const QuestionWizardModal: React.FC<QuestionWizardModalProps> = ({
  isOpen,
  onClose,
  onSelectInvestigation,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(
    WIZARD_THEMES[0].id
  );

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
    }
  }, [isOpen]);

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

  const currentTheme =
    WIZARD_THEMES.find((t) => t.id === selectedThemeId) || WIZARD_THEMES[0];

  const handleApply = () => {
    if (onSelectInvestigation) {
      onSelectInvestigation({
        variable_id: currentTheme.variableId,
        variable_name: currentTheme.variableName,
        units: currentTheme.units,
        plain_definition: currentTheme.plainDefinition,
        aggregation_mode: currentTheme.aggregationMode,
        region_a: currentTheme.regionA,
        region_b: currentTheme.regionB,
        theme_id: currentTheme.id,
        sample_question: currentTheme.sampleQuestion,
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      data-testid="question-wizard-modal"
    >
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-lg">
              🔍
            </span>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-cyan-400 font-semibold">
                NASA Challenge Guided Workflow
              </div>
              <h2 className="text-base font-bold text-slate-100">
                Ask the Trend Detective
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center transition cursor-pointer"
            aria-label="Close wizard"
          >
            ✕
          </button>
        </div>

        {/* Wizard Steps Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 py-2.5 text-xs font-mono">
          <div
            className={`flex items-center gap-2 cursor-pointer transition ${
              step === 1 ? "text-cyan-400 font-bold" : "text-slate-400"
            }`}
            onClick={() => setStep(1)}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 1 ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
              }`}
            >
              1
            </span>
            <span>Choose Research Question</span>
          </div>
          <span className="mx-3 text-slate-600">→</span>
          <div
            className={`flex items-center gap-2 cursor-pointer transition ${
              step === 2 ? "text-cyan-400 font-bold" : "text-slate-400"
            }`}
            onClick={() => setStep(2)}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 2 ? "bg-cyan-500 text-slate-950 font-bold" : "bg-slate-800 text-slate-400"
              }`}
            >
              2
            </span>
            <span>Recommended NASA Variable & Regions</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {step === 1 ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Select an environmental research theme. The Trend Detective will automatically map
                your question to the authoritative NASA Earth science variable and pre-configure
                optimal coordinates:
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {WIZARD_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => setSelectedThemeId(theme.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-cyan-950/40 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/50"
                          : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70 hover:border-slate-600"
                      }`}
                    >
                      <span className="text-2xl shrink-0 p-1 bg-slate-900/80 rounded-lg border border-slate-700">
                        {theme.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-slate-100 text-xs">
                            {theme.title}
                          </h3>
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 shrink-0">
                            {theme.variableId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          {theme.shortDesc}
                        </p>
                        <div className="text-[11px] text-cyan-400/90 italic mt-1.5 flex items-start gap-1">
                          <span className="shrink-0 font-bold">Q:</span>
                          <span>&ldquo;{theme.sampleQuestion}&rdquo;</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-semibold block">
                      Recommended NASA Observation Target
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                      {currentTheme.variableName} ({currentTheme.variableId})
                    </h3>
                  </div>
                  <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-500/60 text-cyan-300 font-semibold shrink-0">
                    {currentTheme.units}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-slate-200">
                    Plain-English Scientific Definition:
                  </div>
                  <p className="leading-relaxed">{currentTheme.plainDefinition}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Satellite / Model Source
                    </span>
                    <span className="text-slate-200 font-medium">
                      {currentTheme.sensorSource}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      Recommended Aggregation
                    </span>
                    <span className="text-cyan-300 font-mono font-medium">
                      {currentTheme.aggregationMode === "annual"
                        ? "Annual Calendar Average (Jan–Dec)"
                        : currentTheme.aggregationMode === "monsoon_jjas"
                        ? "Monsoon Season Only (Jun–Sep JJAS)"
                        : "Winter Season (Dec–Feb DJF)"}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                  <div className="font-mono text-[10px] uppercase text-slate-400 font-semibold">
                    Configured Investigation Coordinates
                  </div>
                  <div className="flex flex-wrap gap-4 text-[11px] font-mono">
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>
                        Region A: {currentTheme.regionA.name} ({currentTheme.regionA.lat}°N,{" "}
                        {currentTheme.regionA.lon}°E)
                      </span>
                    </div>
                    {currentTheme.regionB && (
                      <div className="flex items-center gap-1.5 text-orange-400">
                        <span className="w-2 h-2 rounded-full bg-orange-400" />
                        <span>
                          Region B: {currentTheme.regionB.name} ({currentTheme.regionB.lat}°N,{" "}
                          {currentTheme.regionB.lon}°E)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>Review Recommended Variable</span>
                <span>→</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition cursor-pointer"
              >
                ← Back to Themes
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Launch Trend Investigation</span>
                <span>🚀</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
