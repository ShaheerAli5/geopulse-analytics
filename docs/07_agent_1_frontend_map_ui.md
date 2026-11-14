# 07 — Agent 1 Task File: Geospatial Map, NASA GIBS Tiles & Time-Series Charts (Dev 1)

**Assigned Role:** Dev 1 — Geospatial & Visual Workbench Lead  
**Git Branch:** `feat/dev1-map-charts`  
**Exclusive Write Directory:** `src/components/workbench/**`  
**Forbidden Directories (Do Not Edit):** `api/**`, `src/components/detective/**`, `src/lib/**`, `src/types/**`

---

## 1. Mission & Scope for Agent 1 / Dev 1

You are responsible for building the **interactive geospatial and temporal visualization layer** of the GeoPulse Earth System Trend Detective Workbench. Your components must allow users and judges to:
1. View an interactive dark-mode **MapLibre GL JS** globe/map overlaid with zero-download satellite imagery tiles streamed directly from [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api) ([MODIS](https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools), [GPM IMERG](https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm), [MERRA-2](https://www.earthdata.nasa.gov/data/projects/merra-2), [AIRS](https://www.earthdata.nasa.gov/data/instruments/airs), [OMI](https://www.earthdata.nasa.gov/data/instruments/omi/resources)).
2. Place or move **Pin A (Region A — Cyan `#06B6D4`)** and **Pin B (Region B — Coral `#F97316`)** anywhere on Earth to compare regional trends side by side.
3. Configure the NASA variable, time range (`1981–2025`), and seasonal aggregation (`annual`, `monsoon_jjas`, `winter_djf`) in `<ControlSidebar />`.
4. Inspect the resulting multi-decade time series, **OLS Linear Trend Line**, and **Sen's Robust Slope Line** for both regions in `<TrendChart />`.

---

## 2. Files You Must Create in `src/components/workbench/`

### File 1: `src/components/workbench/GibsLayerConfig.ts`
Defines the browser-direct [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api) raster tile URLs (zero backend file downloads required):

```typescript
export interface GibsLayerOption {
  id: string;
  label: string;
  mission: string;
  variableId: string;
  wmtsTemplate: string;
  attributionUrl: string;
}

export const GIBS_LAYERS: GibsLayerOption[] = [
  {
    id: "MODIS_Terra_Land_Surface_Temp_Day",
    label: "Land Surface Temperature (Day)",
    mission: "NASA MODIS Terra",
    variableId: "TS",
    wmtsTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Land_Surface_Temp_Day/default/2024-07-15/GoogleMapsCompatible_Level7/{z}/{y}/{x}.png",
    attributionUrl: "https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools",
  },
  {
    id: "IMERG_Precipitation_Rate",
    label: "Precipitation Rate (IMERG)",
    mission: "NASA GPM",
    variableId: "PRECTOTCORR",
    wmtsTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/2024-07-15/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
    attributionUrl: "https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm",
  },
  {
    id: "AIRS_L3_Surface_Air_Temperature_Daily_Day",
    label: "Surface Air Temperature",
    mission: "NASA Aqua AIRS",
    variableId: "T2M",
    wmtsTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/AIRS_L3_Surface_Air_Temperature_Daily_Day/default/2024-07-15/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
    attributionUrl: "https://www.earthdata.nasa.gov/data/instruments/airs",
  },
  {
    id: "OMI_Aerosol_Index",
    label: "UV Aerosol Index (Smoke/Dust)",
    mission: "NASA Aura OMI",
    variableId: "ALLSKY_SFC_SW_DWN",
    wmtsTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/OMI_Aerosol_Index/default/2024-07-15/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
    attributionUrl: "https://www.earthdata.nasa.gov/data/instruments/omi/resources",
  },
];
```

### File 2: `src/components/workbench/MapCanvas.tsx`
Renders the MapLibre GL JS map, overlays the selected NASA GIBS WMTS raster tile source, and handles clicking to place Region A or Region B pins:

```tsx
"use client";

import React, { useState } from "react";
import Map, { Source, Layer, Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { RegionInput } from "@/types/investigation";
import { GIBS_LAYERS } from "./GibsLayerConfig";

interface MapCanvasProps {
  regionA: RegionInput;
  regionB?: RegionInput;
  onSelectRegionA: (coords: { lat: number; lon: number }) => void;
  onSelectRegionB: (coords: { lat: number; lon: number }) => void;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  regionA,
  regionB,
  onSelectRegionA,
  onSelectRegionB,
}) => {
  const [activePinMode, setActivePinMode] = useState<"A" | "B">("A");
  const [selectedGibsId, setSelectedGibsId] = useState<string>(GIBS_LAYERS[0].id);
  const [gibsOpacity, setGibsOpacity] = useState<number>(0.55);

  const activeLayer = GIBS_LAYERS.find((l) => l.id === selectedGibsId) || GIBS_LAYERS[0];

  return (
    <div className="relative w-full h-full min-h-[360px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/70 text-xs">
        <span className="text-slate-400 font-mono uppercase">Click Map to Set:</span>
        <button
          onClick={() => setActivePinMode("A")}
          className={`px-2.5 py-1 rounded font-medium transition ${
            activePinMode === "A"
              ? "bg-cyan-500 text-slate-950 font-semibold"
              : "bg-slate-800 text-cyan-400 hover:bg-slate-700"
          }`}
        >
          Pin A ({regionA.name})
        </button>
        <button
          onClick={() => setActivePinMode("B")}
          className={`px-2.5 py-1 rounded font-medium transition ${
            activePinMode === "B"
              ? "bg-orange-500 text-slate-950 font-semibold"
              : "bg-slate-800 text-orange-400 hover:bg-slate-700"
          }`}
        >
          Pin B ({regionB ? regionB.name : "Add Comparison"})
        </button>

        <div className="h-4 w-[1px] bg-slate-700 mx-1" />

        <label className="text-slate-400 font-mono">NASA GIBS Layer:</label>
        <select
          value={selectedGibsId}
          onChange={(e) => setSelectedGibsId(e.target.value)}
          className="bg-slate-800 text-slate-100 rounded px-2 py-1 border border-slate-700"
        >
          {GIBS_LAYERS.map((layer) => (
            <option key={layer.id} value={layer.id}>
              {layer.label} ({layer.mission})
            </option>
          ))}
        </select>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={gibsOpacity}
          onChange={(e) => setGibsOpacity(parseFloat(e.target.value))}
          title="Satellite Layer Opacity"
          className="w-20 accent-cyan-400"
        />
      </div>

      <Map
        initialViewState={{
          latitude: (regionA.lat + (regionB?.lat ?? regionA.lat)) / 2,
          longitude: (regionA.lon + (regionB?.lon ?? regionA.lon)) / 2,
          zoom: 4.2,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
        onClick={(e) => {
          const lat = Number(e.lngLat.lat.toFixed(2));
          const lon = Number(e.lngLat.lng.toFixed(2));
          if (activePinMode === "A") onSelectRegionA({ lat, lon });
          else onSelectRegionB({ lat, lon });
        }}
      >
        <NavigationControl position="bottom-right" />

        {/* NASA GIBS WMTS Raster Tile Layer */}
        <Source
          id="nasa-gibs"
          type="raster"
          tiles={[activeLayer.wmtsTemplate]}
          tileSize={256}
        >
          <Layer
            id="nasa-gibs-layer"
            type="raster"
            paint={{ "raster-opacity": gibsOpacity }}
          />
        </Source>

        {/* Region A Marker (Cyan) */}
        <Marker latitude={regionA.lat} longitude={regionA.lon} anchor="bottom">
          <div className="px-2 py-1 rounded bg-cyan-500 text-slate-950 font-mono text-xs font-bold shadow-lg border border-white">
            A: {regionA.name} ({regionA.lat}°, {regionA.lon}°)
          </div>
        </Marker>

        {/* Region B Marker (Coral) */}
        {regionB && (
          <Marker latitude={regionB.lat} longitude={regionB.lon} anchor="bottom">
            <div className="px-2 py-1 rounded bg-orange-500 text-slate-950 font-mono text-xs font-bold shadow-lg border border-white">
              B: {regionB.name} ({regionB.lat}°, {regionB.lon}°)
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
};
```

### File 3: `src/components/workbench/TrendChart.tsx`
Renders the dual-region historical time series (`1981–2025`) with overlaid **OLS Linear Trend** and **Sen's Robust Slope** lines using `recharts`:

```tsx
"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { InvestigationResponse } from "@/types/investigation";

interface TrendChartProps {
  data: InvestigationResponse;
}

export const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const [fitMode, setFitMode] = useState<"ols" | "sen">("ols");

  // Merge Region A and Region B series by year for simultaneous dual plotting
  const mergedSeries = data.region_a.series.map((ptA, idx) => {
    const ptB = data.region_b?.series[idx];
    return {
      year: ptA.year,
      valA: ptA.value,
      fitA: fitMode === "ols" ? ptA.ols_fitted : ptA.sen_fitted,
      valB: ptB?.value ?? null,
      fitB: ptB ? (fitMode === "ols" ? ptB.ols_fitted : ptB.sen_fitted) : null,
    };
  });

  return (
    <div className="w-full h-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100">
            {data.variable_name} ({data.units}) — {data.start_year} to {data.end_year}
          </h3>
          <p className="text-xs text-slate-400">
            Solid lines show NASA observations; dashed lines show {fitMode === "ols" ? "Ordinary Least Squares (OLS)" : "Theil–Sen Robust"} trend fit.
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setFitMode("ols")}
            className={`px-2.5 py-1 rounded ${
              fitMode === "ols" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-300"
            }`}
          >
            OLS Linear Fit
          </button>
          <button
            onClick={() => setFitMode("sen")}
            className={`px-2.5 py-1 rounded ${
              fitMode === "sen" ? "bg-cyan-500 text-slate-950 font-bold" : "text-slate-300"
            }`}
          >
            Sen&apos;s Robust Slope
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mergedSeries}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="year" stroke="#94a3b8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                fontSize: "12px",
                fontFamily: "monospace",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="valA"
              name={`Region A: ${data.region_a.region.name} (${data.units})`}
              stroke="#06B6D4"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
            <Line
              type="linear"
              dataKey="fitA"
              name={`Region A Trend (${data.region_a.stats.ols_slope_per_decade >= 0 ? "+" : ""}${data.region_a.stats.ols_slope_per_decade.toFixed(3)}/dec)`}
              stroke="#22D3EE"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
            />
            {data.region_b && (
              <>
                <Line
                  type="monotone"
                  dataKey="valB"
                  name={`Region B: ${data.region_b.region.name} (${data.units})`}
                  stroke="#F97316"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="linear"
                  dataKey="fitB"
                  name={`Region B Trend (${data.region_b.stats.ols_slope_per_decade >= 0 ? "+" : ""}${data.region_b.stats.ols_slope_per_decade.toFixed(3)}/dec)`}
                  stroke="#FB923C"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  dot={false}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
```

### File 4: `src/components/workbench/ControlSidebar.tsx`
Provides the left-hand controls for variable selection, plain-English student definition display, Region A/B coordinate inputs, seasonal window selector (`annual`, `monsoon_jjas`, `winter_djf`), and the "Run Investigation" trigger button.

---

## 3. Acceptance Checklist for Dev 1

- [ ] MapLibre GL JS renders smoothly without WebGL errors and streams [NASA GIBS WMTS](https://www.earthdata.nasa.gov/news/blog/use-python-access-gibs-api) tiles when switching layers.
- [ ] Clicking the map in "Pin A" or "Pin B" mode updates coordinates and triggers a new analysis call.
- [ ] `<TrendChart />` renders both Region A (Cyan) and Region B (Coral) along with dashed OLS / Sen's slope lines.
- [ ] Zero files outside `src/components/workbench/**` are modified.
