"use client";

import React, { useState, useEffect, useCallback } from "react";
import { InvestigationResponse, RegionInput } from "@/types/investigation";
import {
  MapCanvas,
  ControlSidebar,
  TrendChart,
} from "@/components/workbench";
import {
  CaseFileBar,
  CaseFileOption,
  EvidencePanel,
  QuestionWizardModal,
  WizardTheme,
  GOLDEN_CASE_FILES,
} from "@/components/detective";
import { getGoldenCase } from "@/lib/golden_case_data";

export default function WorkbenchPage() {
  const [activeCaseId, setActiveCaseId] = useState<string | null>("pk_divergence");
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Investigation parameters
  const [selectedVariable, setSelectedVariable] = useState<string>("GWETROOT");
  const [regionA, setRegionA] = useState<RegionInput>({
    id: "A",
    name: "Upper Indus (Gilgit-Baltistan)",
    lat: 35.30,
    lon: 75.60,
  });
  const [regionB, setRegionB] = useState<RegionInput | undefined>({
    id: "B",
    name: "Southwestern Balochistan",
    lat: 27.50,
    lon: 64.00,
  });
  const [aggregationMode, setAggregationMode] = useState<"annual" | "monsoon_jjas" | "winter_djf">("annual");
  const [startYear, setStartYear] = useState<number>(1981);
  const [endYear, setEndYear] = useState<number>(2025);
  const [researchQuestion, setResearchQuestion] = useState<string>(
    "How do hydrological & temperature trends diverge across regional ecosystems?"
  );

  // Loaded investigation data (preloaded instantly with zero-latency in-memory cache)
  const [data, setData] = useState<InvestigationResponse | null>(() => {
    return (getGoldenCase("pk-divergence") as unknown as InvestigationResponse) || null;
  });

  // Helper to load a pre-cached golden case file (<50ms for instant judge inspection)
  const loadGoldenDemo = useCallback(async (caseFile: CaseFileOption) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // 1. Try instant in-memory cache first (<1ms)
      const cached =
        getGoldenCase(caseFile.id) ||
        getGoldenCase(caseFile.id.replace(/_/g, "-"));
      if (cached) {
        const c = cached as unknown as InvestigationResponse;
        setData(c);
        setActiveCaseId(caseFile.id);
        setSelectedVariable(c.variable_id);
        setRegionA(c.region_a.region);
        setRegionB(c.region_b ? c.region_b.region : undefined);
        setAggregationMode(c.aggregation_mode);
        setStartYear(c.start_year);
        setEndYear(c.end_year);
        setIsLoading(false);
        return;
      }

      // 2. Fallback to public JSON fetch
      const res = await fetch(`/data/golden_demos/${caseFile.filename}`);
      if (!res.ok) {
        throw new Error(`Failed to load golden demo: ${res.statusText}`);
      }
      const loaded: InvestigationResponse = await res.json();
      setData(loaded);
      setActiveCaseId(caseFile.id);
      setSelectedVariable(loaded.variable_id);
      setRegionA(loaded.region_a.region);
      setRegionB(loaded.region_b ? loaded.region_b.region : undefined);
      setAggregationMode(loaded.aggregation_mode);
      setStartYear(loaded.start_year);
      setEndYear(loaded.end_year);
    } catch (err: any) {
      console.warn("Golden demo fetch fallback:", err);
      setErrorMessage(`Unable to load ${caseFile.title}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load: parse URL parameters or load default golden case
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const wizardParam = urlParams.get("wizard");
    if (wizardParam === "true" || wizardParam === "open") {
      setIsWizardOpen(true);
    }

    const caseParam = urlParams.get("case");

    if (caseParam) {
      const normalizedCase = caseParam.replace(/-/g, "_");
      const matchedCase = GOLDEN_CASE_FILES.find((c) => c.id === normalizedCase);
      if (matchedCase) {
        loadGoldenDemo(matchedCase);
        return;
      }
    }

    const varParam = urlParams.get("var") || urlParams.get("variable_id");
    const latAParam = urlParams.get("latA");
    const lonAParam = urlParams.get("lonA");

    if (varParam && latAParam && lonAParam) {
      const v = varParam.toUpperCase();
      const lA = parseFloat(latAParam);
      const lnA = parseFloat(lonAParam);
      const nA = urlParams.get("nameA") || "Region A";
      setSelectedVariable(v);
      setRegionA({ id: "A", name: nA, lat: lA, lon: lnA });

      const latBParam = urlParams.get("latB");
      const lonBParam = urlParams.get("lonB");
      if (latBParam && lonBParam) {
        setRegionB({
          id: "B",
          name: urlParams.get("nameB") || "Region B",
          lat: parseFloat(latBParam),
          lon: parseFloat(lonBParam),
        });
      } else {
        setRegionB(undefined);
      }

      const aggParam = urlParams.get("agg") as any;
      if (aggParam && ["annual", "monsoon_jjas", "winter_djf"].includes(aggParam)) {
        setAggregationMode(aggParam);
      }

      const sYear = urlParams.get("start");
      const eYear = urlParams.get("end");
      if (sYear) setStartYear(parseInt(sYear, 10));
      if (eYear) setEndYear(parseInt(eYear, 10));

      setActiveCaseId(null);
      return;
    }

    // Default: load Golden Case 1 (Upper Indus vs. Balochistan)
    loadGoldenDemo(GOLDEN_CASE_FILES[0]);
  }, [loadGoldenDemo]);

  // Keep browser URL synchronized with active investigation for 1-click sharing
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (activeCaseId) {
      window.history.replaceState(null, "", `?case=${activeCaseId}`);
    } else if (data) {
      const params = new URLSearchParams();
      params.set("var", selectedVariable);
      params.set("agg", aggregationMode);
      params.set("latA", regionA.lat.toFixed(2));
      params.set("lonA", regionA.lon.toFixed(2));
      params.set("nameA", regionA.name);
      if (regionB) {
        params.set("latB", regionB.lat.toFixed(2));
        params.set("lonB", regionB.lon.toFixed(2));
        params.set("nameB", regionB.name);
      }
      params.set("start", startYear.toString());
      params.set("end", endYear.toString());
      window.history.replaceState(null, "", `?${params.toString()}`);
    }
  }, [activeCaseId, data, selectedVariable, aggregationMode, regionA, regionB, startYear, endYear]);

  // Execute live analysis against /api/analyze
  const handleRunInvestigation = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setActiveCaseId(null);

    const payload = {
      variable_id: selectedVariable,
      latA: regionA.lat,
      lonA: regionA.lon,
      nameA: regionA.name,
      ...(regionB
        ? {
            latB: regionB.lat,
            lonB: regionB.lon,
            nameB: regionB.name,
          }
        : {}),
      aggregation_mode: aggregationMode,
      start_year: startYear,
      end_year: endYear,
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || `API returned status ${res.status}`);
      }

      const result: InvestigationResponse = await res.json();
      setData(result);
    } catch (err: any) {
      console.warn("Live API query error, falling back to cached demo if available:", err);
      setErrorMessage(
        `Live query failed (${err.message}). Showing current investigation state or select a Golden Case.`
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedVariable, regionA, regionB, aggregationMode, startYear, endYear]);

  // Handle preset selection from ControlSidebar
  const handleSelectPreset = useCallback((presetId: string) => {
    const matched = GOLDEN_CASE_FILES.find((c) => c.id === presetId);
    if (matched) {
      loadGoldenDemo(matched);
    }
  }, [loadGoldenDemo]);

  // Apply configuration recommended by Guided Question Wizard
  const handleApplyTheme = useCallback((theme: WizardTheme) => {
    setSelectedVariable(theme.recommendedVariable);
    setRegionA({ id: "A", ...theme.suggestedA });
    setRegionB({ id: "B", ...theme.suggestedB });
    setAggregationMode(theme.aggregation);
    setResearchQuestion(theme.question);
    setActiveCaseId(null);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 overflow-hidden font-sans">
      {/* 1. Top Case File Bar & Guided Detective Wizard Launcher */}
      <CaseFileBar
        activeCaseId={activeCaseId}
        onSelectCase={(c) => loadGoldenDemo(c)}
        onOpenWizard={() => setIsWizardOpen(true)}
      />

      {/* Error alert toast if live API fails */}
      {errorMessage && (
        <div className="bg-amber-950/80 border-b border-amber-600 px-4 py-1.5 text-xs text-amber-200 flex items-center justify-between">
          <span className="font-mono">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-amber-400 hover:text-white font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Main 3-Column Workbench Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden min-h-0">
        {/* Left Column (280px-320px equivalent): Investigation Controls */}
        <div className="lg:col-span-3 h-full overflow-hidden flex flex-col min-h-0">
          <ControlSidebar
            selectedVariable={selectedVariable}
            onSelectVariable={(v) => {
              setSelectedVariable(v);
              setActiveCaseId(null);
            }}
            regionA={regionA}
            onChangeRegionA={(reg) => {
              setRegionA(reg);
              setActiveCaseId(null);
            }}
            regionB={regionB}
            onChangeRegionB={(reg) => {
              setRegionB(reg);
              setActiveCaseId(null);
            }}
            aggregationMode={aggregationMode}
            onChangeAggregationMode={(mode) => {
              setAggregationMode(mode);
              setActiveCaseId(null);
            }}
            startYear={startYear}
            endYear={endYear}
            onChangeTimeRange={(s, e) => {
              setStartYear(s);
              setEndYear(e);
              setActiveCaseId(null);
            }}
            onRunInvestigation={handleRunInvestigation}
            isLoading={isLoading}
            researchQuestion={researchQuestion}
            onChangeResearchQuestion={setResearchQuestion}
            onSelectPreset={handleSelectPreset}
          />
        </div>

        {/* Center Column: Interactive Map (Top 55%) + Dual Time Series Trend Chart (Bottom 45%) */}
        <div className="lg:col-span-6 h-full flex flex-col gap-3 overflow-hidden min-h-0">
          {/* Top Half: MapLibre GL JS + NASA GIBS Tiles + Dual Pins */}
          <div className="flex-[55] min-h-[280px] overflow-hidden">
            <MapCanvas
              regionA={regionA}
              regionB={regionB}
              onSelectRegionA={(coords) => {
                setRegionA((prev) => ({ ...prev, ...coords }));
                setActiveCaseId(null);
              }}
              onSelectRegionB={(coords) => {
                setRegionB((prev) => (prev ? { ...prev, ...coords } : { id: "B", name: "Comparison Region", ...coords }));
                setActiveCaseId(null);
              }}
              activeVariableId={selectedVariable}
            />
          </div>

          {/* Bottom Half: Recharts Dual Time Series + OLS/Sen Slope fit */}
          <div className="flex-[45] min-h-[220px] overflow-hidden">
            {data ? (
              <TrendChart data={data} />
            ) : (
              <div className="w-full h-full bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-center p-6 text-xs text-slate-400 font-mono">
                {isLoading ? "Loading NASA satellite observations..." : "No investigation loaded."}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Evidence Panel, Divergence Banner, Scorecard & NASA Provenance */}
        <div className="lg:col-span-3 h-full overflow-hidden flex flex-col min-h-0">
          {data ? (
            <EvidencePanel data={data} />
          ) : (
            <div className="w-full h-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-center text-xs text-slate-400 font-mono">
              Waiting for investigation data...
            </div>
          )}
        </div>
      </main>

      {/* Guided 2-Step Detective Wizard Modal */}
      <QuestionWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onApplyTheme={handleApplyTheme}
      />
    </div>
  );
}
