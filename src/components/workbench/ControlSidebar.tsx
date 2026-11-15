"use client";

import React, { useMemo, useState, useEffect } from "react";
import { RegionInput } from "@/types/investigation";

export interface VariableMeta {
  id: string;
  name: string;
  units: string;
  mission: string;
  plainDefinition: string;
  giovanniUrl: string;
  earthdataUrl: string;
}

export const VARIABLE_OPTIONS: VariableMeta[] = [
  {
    id: "GWETROOT",
    name: "Root-Zone Soil Moisture Wetness",
    units: "fraction (0-1)",
    mission: "NASA GLDAS / MERRA-2 Land Surface Model",
    plainDefinition:
      "Fraction of water filling soil pores in the top 100 cm root zone (0 = completely dry soil, 1 = fully saturated soil).",
    giovanniUrl: "https://giovanni.gsfc.nasa.gov/giovanni/",
    earthdataUrl: "https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1",
  },
  {
    id: "PRECTOTCORR",
    name: "Bias-Corrected Total Precipitation",
    units: "mm/day",
    mission: "NASA MERRA-2 / GPM IMERG Assimilation",
    plainDefinition:
      "Average daily rain and melted snow reaching the surface, bias-corrected with satellite and gauge observations.",
    giovanniUrl: "https://giovanni.gsfc.nasa.gov/giovanni/",
    earthdataUrl: "https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm",
  },
  {
    id: "T2M",
    name: "Surface Air Temperature (2 Meters)",
    units: "°C",
    mission: "NASA MERRA-2 / Aqua AIRS",
    plainDefinition:
      "Air temperature at 2 meters above the ground—the standard meteorological height for human and crop heat exposure.",
    giovanniUrl: "https://giovanni.gsfc.nasa.gov/giovanni/",
    earthdataUrl: "https://www.earthdata.nasa.gov/data/instruments/airs",
  },
  {
    id: "TS",
    name: "Earth Surface Skin Temperature",
    units: "°C",
    mission: "NASA MODIS / MERRA-2",
    plainDefinition:
      "Radiometric temperature of the land or water surface skin, which responds rapidly to vegetation loss, drought, and urbanization.",
    giovanniUrl: "https://giovanni.gsfc.nasa.gov/giovanni/",
    earthdataUrl: "https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools",
  },
  {
    id: "QV2M",
    name: "Specific Humidity (2 Meters)",
    units: "g/kg",
    mission: "NASA AIRS / MERRA-2",
    plainDefinition:
      "Grams of water vapor per kilogram of air near the ground—a key driver of humid heatwave intensity and monsoon moisture transport.",
    giovanniUrl: "https://giovanni.gsfc.nasa.gov/giovanni/",
    earthdataUrl: "https://www.earthdata.nasa.gov/data/instruments/airs",
  },
  {
    id: "ALLSKY_SFC_SW_DWN",
    name: "All-Sky Surface Shortwave Irradiance",
    units: "kW-hr/m²/day",
    mission: "NASA CERES / MODIS / OMI Proxy",
    plainDefinition:
      "Total solar energy reaching the ground after passing through clouds, dust, and smoke aerosols (tracks solar dimming or brightening).",
    giovanniUrl: "https://giovanni.gsfc.nasa.gov/giovanni/",
    earthdataUrl: "https://www.earthdata.nasa.gov/data/instruments/omi/resources",
  },
];

export interface PresetOption {
  id: string;
  name: string;
  varId: string;
  a: { name: string; lat: number; lon: number };
  b: { name: string; lat: number; lon: number };
  question: string;
}

export const QUICK_PRESETS: PresetOption[] = [
  {
    id: "pk_divergence",
    name: "1: Indus vs. Balochistan",
    varId: "GWETROOT",
    a: { name: "Upper Indus", lat: 35.3, lon: 75.6 },
    b: { name: "Balochistan", lat: 27.5, lon: 64.0 },
    question: "How do hydrological trends diverge between northern and southern Pakistan?",
  },
  {
    id: "pk_heatwave",
    name: "2: Jacobabad vs Karachi",
    varId: "T2M",
    a: { name: "Jacobabad", lat: 28.28, lon: 68.44 },
    b: { name: "Karachi", lat: 24.86, lon: 67.01 },
    question: "How do inland and coastal heatwave envelopes compare across South Asia?",
  },
  {
    id: "aral_sea",
    name: "3: Aral vs. Tien Shan",
    varId: "GWETROOT",
    a: { name: "Aral Sea Basin", lat: 45.0, lon: 59.5 },
    b: { name: "Tien Shan Range", lat: 42.0, lon: 75.0 },
    question: "How does Central Asian lowland desiccation contrast with glacial headwaters?",
  },
  {
    id: "amazon_drying",
    name: "4: Amazon Arc vs Core",
    varId: "PRECTOTCORR",
    a: { name: "Mato Grosso", lat: -12.5, lon: -55.5 },
    b: { name: "Central Amazon", lat: -3.1, lon: -60.0 },
    question: "Is rainfall declining faster along the deforestation arc than in core rainforest?",
  },
];

export interface ControlSidebarProps {
  selectedVariable: string;
  onSelectVariable: (variableId: string) => void;
  regionA: RegionInput;
  onChangeRegionA: (region: RegionInput) => void;
  regionB?: RegionInput;
  onChangeRegionB: (region?: RegionInput) => void;
  aggregationMode: "annual" | "monsoon_jjas" | "winter_djf";
  onChangeAggregationMode: (mode: "annual" | "monsoon_jjas" | "winter_djf") => void;
  startYear?: number;
  endYear?: number;
  onChangeTimeRange?: (start: number, end: number) => void;
  onRunInvestigation: () => void;
  isLoading?: boolean;
  researchQuestion?: string;
  onChangeResearchQuestion?: (question: string) => void;
  onSelectPreset?: (presetId: string) => void;
}

export const ControlSidebar: React.FC<ControlSidebarProps> = ({
  selectedVariable,
  onSelectVariable,
  regionA,
  onChangeRegionA,
  regionB,
  onChangeRegionB,
  aggregationMode,
  onChangeAggregationMode,
  startYear = 1981,
  endYear = 2025,
  onChangeTimeRange,
  onRunInvestigation,
  isLoading = false,
  researchQuestion = "How do hydrological & temperature trends diverge across regional ecosystems?",
  onChangeResearchQuestion,
  onSelectPreset,
}) => {
  // Local string buffers for coordinate inputs so users can type negative numbers (-), decimals (.), and zeros
  // without the input reverting or snapping prematurely.
  const [latAStr, setLatAStr] = useState<string>(regionA.lat.toString());
  const [lonAStr, setLonAStr] = useState<string>(regionA.lon.toString());
  const [latBStr, setLatBStr] = useState<string>(regionB?.lat?.toString() ?? "27.50");
  const [lonBStr, setLonBStr] = useState<string>(regionB?.lon?.toString() ?? "64.00");

  // Keep string buffers in sync when props update externally (e.g., map clicks or preset selection)
  useEffect(() => {
    setLatAStr(regionA.lat.toString());
    setLonAStr(regionA.lon.toString());
  }, [regionA.lat, regionA.lon]);

  useEffect(() => {
    if (regionB) {
      setLatBStr(regionB.lat.toString());
      setLonBStr(regionB.lon.toString());
    }
  }, [regionB]);

  const currentVarMeta = useMemo(() => {
    return (
      VARIABLE_OPTIONS.find((v) => v.id === selectedVariable) ||
      VARIABLE_OPTIONS[0]
    );
  }, [selectedVariable]);

  const hasComparison = Boolean(regionB);

  // Identify which preset is currently active
  const activePresetId = useMemo(() => {
    return (
      QUICK_PRESETS.find(
        (p) =>
          p.varId === selectedVariable &&
          Math.abs(p.a.lat - regionA.lat) < 0.1 &&
          Math.abs(p.a.lon - regionA.lon) < 0.1 &&
          (hasComparison && regionB
            ? Math.abs(p.b.lat - regionB.lat) < 0.1 && Math.abs(p.b.lon - regionB.lon) < 0.1
            : false)
      )?.id ?? null
    );
  }, [selectedVariable, regionA.lat, regionA.lon, hasComparison, regionB]);

  const handleToggleComparison = () => {
    if (hasComparison) {
      onChangeRegionB(undefined);
    } else {
      onChangeRegionB({
        id: "B",
        name: "Region B (Comparison)",
        lat: 27.5,
        lon: 64.0,
      });
    }
  };

  const handlePresetSelect = (preset: PresetOption) => {
    onSelectVariable(preset.varId);
    onChangeRegionA({ id: "A", ...preset.a });
    onChangeRegionB({ id: "B", ...preset.b });
    if (onChangeResearchQuestion) {
      onChangeResearchQuestion(preset.question);
    }
    if (onSelectPreset) {
      onSelectPreset(preset.id);
    }
  };

  const handleLatAChange = (valStr: string) => {
    setLatAStr(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && Number.isFinite(parsed) && parsed >= -90 && parsed <= 90) {
      onChangeRegionA({ ...regionA, lat: parsed });
    }
  };

  const handleLatABlur = () => {
    let parsed = parseFloat(latAStr);
    if (isNaN(parsed) || !Number.isFinite(parsed)) {
      parsed = regionA.lat;
    } else {
      parsed = Math.max(-85.05, Math.min(85.05, parsed));
    }
    const clean = Number(parsed.toFixed(2));
    setLatAStr(clean.toString());
    onChangeRegionA({ ...regionA, lat: clean });
  };

  const handleLonAChange = (valStr: string) => {
    setLonAStr(valStr);
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && Number.isFinite(parsed) && parsed >= -180 && parsed <= 180) {
      onChangeRegionA({ ...regionA, lon: parsed });
    }
  };

  const handleLonABlur = () => {
    let parsed = parseFloat(lonAStr);
    if (isNaN(parsed) || !Number.isFinite(parsed)) {
      parsed = regionA.lon;
    } else {
      parsed = ((((parsed + 180) % 360) + 360) % 360) - 180;
    }
    const clean = Number(parsed.toFixed(2));
    setLonAStr(clean.toString());
    onChangeRegionA({ ...regionA, lon: clean });
  };

  const handleLatBChange = (valStr: string) => {
    setLatBStr(valStr);
    if (!regionB) return;
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && Number.isFinite(parsed) && parsed >= -90 && parsed <= 90) {
      onChangeRegionB({ ...regionB, lat: parsed });
    }
  };

  const handleLatBBlur = () => {
    if (!regionB) return;
    let parsed = parseFloat(latBStr);
    if (isNaN(parsed) || !Number.isFinite(parsed)) {
      parsed = regionB.lat;
    } else {
      parsed = Math.max(-85.05, Math.min(85.05, parsed));
    }
    const clean = Number(parsed.toFixed(2));
    setLatBStr(clean.toString());
    onChangeRegionB({ ...regionB, lat: clean });
  };

  const handleLonBChange = (valStr: string) => {
    setLonBStr(valStr);
    if (!regionB) return;
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed) && Number.isFinite(parsed) && parsed >= -180 && parsed <= 180) {
      onChangeRegionB({ ...regionB, lon: parsed });
    }
  };

  const handleLonBBlur = () => {
    if (!regionB) return;
    let parsed = parseFloat(lonBStr);
    if (isNaN(parsed) || !Number.isFinite(parsed)) {
      parsed = regionB.lon;
    } else {
      parsed = ((((parsed + 180) % 360) + 360) % 360) - 180;
    }
    const clean = Number(parsed.toFixed(2));
    setLonBStr(clean.toString());
    onChangeRegionB({ ...regionB, lon: clean });
  };

  const handleStartYearChange = (newStart: number) => {
    if (onChangeTimeRange) {
      const validStart = Math.min(newStart, endYear - 1);
      onChangeTimeRange(validStart, endYear);
    }
  };

  const handleEndYearChange = (newEnd: number) => {
    if (onChangeTimeRange) {
      const validEnd = Math.max(newEnd, startYear + 1);
      onChangeTimeRange(startYear, validEnd);
    }
  };

  // Generate year options from 1981 to 2025
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    for (let y = 1981; y <= 2025; y++) {
      years.push(y);
    }
    return years;
  }, []);

  return (
    <aside className="w-full h-full bg-slate-900/95 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto text-xs text-slate-300 shadow-xl">
      {/* Header & Title */}
      <div className="border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
            Investigation Controls
          </h2>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          Configure NASA satellite parameters, regional coordinates, and temporal aggregation.
        </p>
      </div>

      {/* 1. Research Question */}
      <div className="space-y-1.5">
        <label
          htmlFor="research-question-input"
          className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block"
        >
          1. Research Question
        </label>
        {onChangeResearchQuestion ? (
          <textarea
            id="research-question-input"
            rows={2}
            value={researchQuestion}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChangeResearchQuestion(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none"
            placeholder="What climate or ecological question are you investigating?"
            style={{ colorScheme: "dark" }}
          />
        ) : (
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-medium italic">
            &ldquo;{researchQuestion}&rdquo;
          </div>
        )}
      </div>

      {/* 2. NASA Variable Selection & Student Plain Definition */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="variable-dropdown"
            className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold"
          >
            2. NASA Variable
          </label>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
            {currentVarMeta.units}
          </span>
        </div>

        <select
          id="variable-dropdown"
          value={selectedVariable}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSelectVariable(e.target.value)}
          className="w-full bg-slate-950 text-slate-100 rounded-lg px-2.5 py-2 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer font-medium"
          style={{ colorScheme: "dark" }}
        >
          {VARIABLE_OPTIONS.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.id})
            </option>
          ))}
        </select>

        {/* Student Plain-English Definition Card */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3 space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="text-cyan-300 font-semibold">Student Science Guide:</span>
            <span>{currentVarMeta.mission.split("/")[0]}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentVarMeta.plainDefinition}
          </p>
          <div className="flex items-center gap-2 pt-1 text-[10px] font-mono">
            <a
              href={currentVarMeta.earthdataUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              NASA Earthdata ↗
            </a>
            <span className="text-slate-600">•</span>
            <a
              href={currentVarMeta.giovanniUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Verify Giovanni ↗
            </a>
          </div>
        </div>
      </div>

      {/* 3. Regions: Pin A (Cyan) and Pin B (Coral) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            3. Coordinate Pins
          </label>
          <button
            type="button"
            onClick={handleToggleComparison}
            className={`text-[10px] font-mono px-2 py-0.5 rounded transition ${
              hasComparison
                ? "bg-orange-950/70 text-orange-300 border border-orange-500/50 hover:bg-orange-900/60"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
          >
            {hasComparison ? "Remove Region B" : "+ Add Region B"}
          </button>
        </div>

        {/* Region A Input (Cyan) */}
        <div className="bg-slate-950/70 border border-cyan-500/40 rounded-lg p-2.5 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Region A (Primary)</span>
            </div>
            <span className="text-slate-400 text-[10px]">
              {regionA.lat.toFixed(2)}°, {regionA.lon.toFixed(2)}°
            </span>
          </div>
          <input
            type="text"
            value={regionA.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeRegionA({ ...regionA, name: e.target.value })}
            placeholder="Region name (e.g. Upper Indus)"
            aria-label="Region A name"
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            style={{ colorScheme: "dark" }}
          />
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div>
              <label htmlFor="regA-lat" className="text-[10px] text-slate-400 block mb-0.5">
                Lat (°N [-85.05, 85.05])
              </label>
              <input
                id="regA-lat"
                type="text"
                value={latAStr}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLatAChange(e.target.value)}
                onBlur={handleLatABlur}
                placeholder="35.30"
                className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                style={{ colorScheme: "dark" }}
              />
            </div>
            <div>
              <label htmlFor="regA-lon" className="text-[10px] text-slate-400 block mb-0.5">
                Lon (°E [-180, 180])
              </label>
              <input
                id="regA-lon"
                type="text"
                value={lonAStr}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLonAChange(e.target.value)}
                onBlur={handleLonABlur}
                placeholder="75.60"
                className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>
        </div>

        {/* Region B Input (Coral) */}
        {hasComparison && regionB && (
          <div className="bg-slate-950/70 border border-orange-500/40 rounded-lg p-2.5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span>Region B (Comparison)</span>
              </div>
              <span className="text-slate-400 text-[10px]">
                {regionB.lat.toFixed(2)}°, {regionB.lon.toFixed(2)}°
              </span>
            </div>
            <input
              type="text"
              value={regionB.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeRegionB({ ...regionB, name: e.target.value })}
              placeholder="Region name (e.g. Balochistan)"
              aria-label="Region B name"
              className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              style={{ colorScheme: "dark" }}
            />
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>
                <label htmlFor="regB-lat" className="text-[10px] text-slate-400 block mb-0.5">
                  Lat (°N [-85.05, 85.05])
                </label>
                <input
                  id="regB-lat"
                  type="text"
                  value={latBStr}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLatBChange(e.target.value)}
                  onBlur={handleLatBBlur}
                  placeholder="27.50"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div>
                <label htmlFor="regB-lon" className="text-[10px] text-slate-400 block mb-0.5">
                  Lon (°E [-180, 180])
                </label>
                <input
                  id="regB-lon"
                  type="text"
                  value={lonBStr}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLonBChange(e.target.value)}
                  onBlur={handleLonBBlur}
                  placeholder="64.00"
                  className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-slate-200 focus:outline-none focus:border-orange-500 font-mono"
                  style={{ colorScheme: "dark" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Presets */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Quick Comparison Presets:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
            {QUICK_PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`p-1.5 rounded text-left border truncate transition ${
                    isActive
                      ? "bg-cyan-950/80 border-cyan-500 text-cyan-300 font-semibold shadow-sm"
                      : "bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700"
                  }`}
                  title={`${preset.name} (${preset.varId})`}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Time Window & Seasonal Aggregation */}
      <div className="space-y-3">
        {/* Time Range Selector (Start Year & End Year) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              4. Time Window ({startYear}–{endYear})
            </label>
            <span className="text-[10px] font-mono text-slate-400">
              {endYear - startYear + 1} Years
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div>
              <label htmlFor="start-year-select" className="text-[10px] text-slate-400 block mb-0.5">
                Start Year
              </label>
              <select
                id="start-year-select"
                value={startYear}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleStartYearChange(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                style={{ colorScheme: "dark" }}
              >
                {yearOptions
                  .filter((y) => y < endYear)
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="end-year-select" className="text-[10px] text-slate-400 block mb-0.5">
                End Year
              </label>
              <select
                id="end-year-select"
                value={endYear}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEndYearChange(parseInt(e.target.value, 10))}
                className="w-full bg-slate-950 text-slate-200 border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
                style={{ colorScheme: "dark" }}
              >
                {yearOptions
                  .filter((y) => y > startYear)
                  .map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seasonal Aggregation Buttons */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
            Seasonal Aggregation
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              type="button"
              aria-pressed={aggregationMode === "annual"}
              onClick={() => onChangeAggregationMode("annual")}
              className={`py-1.5 px-1 rounded text-center transition ${
                aggregationMode === "annual"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="12-Month Mean (Removes annual seasonal cycle)"
            >
              Annual
            </button>
            <button
              type="button"
              aria-pressed={aggregationMode === "monsoon_jjas"}
              onClick={() => onChangeAggregationMode("monsoon_jjas")}
              className={`py-1.5 px-1 rounded text-center transition ${
                aggregationMode === "monsoon_jjas"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Summer Monsoon (Jun-Sep)"
            >
              Monsoon
            </button>
            <button
              type="button"
              aria-pressed={aggregationMode === "winter_djf"}
              onClick={() => onChangeAggregationMode("winter_djf")}
              className={`py-1.5 px-1 rounded text-center transition ${
                aggregationMode === "winter_djf"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
              title="Winter Season (Dec-Feb)"
            >
              Winter
            </button>
          </div>
          <p className="text-[10px] text-slate-500 italic leading-snug">
            Tip: Annual aggregation eliminates the seasonal cycle to isolate multi-decade signals from weather noise.
          </p>
        </div>
      </div>

      {/* 5. Trigger Action Button */}
      <div className="pt-2 mt-auto">
        <button
          type="button"
          onClick={onRunInvestigation}
          disabled={isLoading}
          className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 ${
            isLoading
              ? "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700"
              : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 active:scale-[0.98] cursor-pointer"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-slate-300" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Querying NASA POWER...</span>
            </>
          ) : (
            <>
              <span>Run Investigation</span>
              <span>⚡</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
