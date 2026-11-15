"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Map, { Source, Layer, Marker, NavigationControl, MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { RegionInput } from "@/types/investigation";
import { GIBS_LAYERS, GibsLayerOption, getGibsLayerByVariable } from "./GibsLayerConfig";

export interface MapCanvasProps {
  regionA: RegionInput;
  regionB?: RegionInput;
  onSelectRegionA: (coords: { lat: number; lon: number }) => void;
  onSelectRegionB: (coords: { lat: number; lon: number }) => void;
  activeVariableId?: string;
}

/**
 * Normalizes latitude to Web Mercator bounds [-85.05, 85.05]
 * and wraps longitude into standard [-180, 180] range.
 */
export function normalizeMapCoords(rawLat: number, rawLng: number): { lat: number; lon: number } {
  const clampedLat = Math.max(-85.05, Math.min(85.05, rawLat));
  const normalizedLon = ((((rawLng + 180) % 360) + 360) % 360) - 180;
  return {
    lat: Number(clampedLat.toFixed(2)),
    lon: Number(normalizedLon.toFixed(2)),
  };
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  regionA,
  regionB,
  onSelectRegionA,
  onSelectRegionB,
  activeVariableId,
}) => {
  const mapRef = useRef<MapRef | null>(null);
  const [activePinMode, setActivePinMode] = useState<"A" | "B">("A");
  const [selectedGibsId, setSelectedGibsId] = useState<string>(GIBS_LAYERS[0].id);
  const [gibsOpacity, setGibsOpacity] = useState<number>(0.55);

  // Auto-sync GIBS layer if a matching NASA variable is selected
  useEffect(() => {
    if (activeVariableId) {
      const matched = getGibsLayerByVariable(activeVariableId);
      if (matched) {
        setSelectedGibsId(matched.id);
      }
    }
  }, [activeVariableId]);

  const activeLayer: GibsLayerOption = useMemo(() => {
    return GIBS_LAYERS.find((l) => l.id === selectedGibsId) || GIBS_LAYERS[0];
  }, [selectedGibsId]);

  // Center between Region A and Region B if both exist, offset slightly north so northern pins aren't under header
  const initialCenter = useMemo(() => {
    const targetLat = (regionA.lat + (regionB?.lat ?? regionA.lat)) / 2;
    const targetLon = (regionA.lon + (regionB?.lon ?? regionA.lon)) / 2;
    return {
      latitude: Number.isFinite(targetLat) ? targetLat + 1.2 : 30.0,
      longitude: Number.isFinite(targetLon) ? targetLon : 70.0,
      zoom: 3.2,
    };
  }, [regionA.lat, regionA.lon, regionB?.lat, regionB?.lon]);

  // Smoothly ease/fly camera to new region when Region A or Region B coordinates change
  useEffect(() => {
    if (mapRef.current) {
      const targetLat = (regionA.lat + (regionB?.lat ?? regionA.lat)) / 2;
      const targetLon = (regionA.lon + (regionB?.lon ?? regionA.lon)) / 2;
      if (Number.isFinite(targetLat) && Number.isFinite(targetLon)) {
        mapRef.current.easeTo({
          center: [targetLon, targetLat + 1.2],
          duration: 900,
        });
      }
    }
  }, [regionA.lat, regionA.lon, regionB?.lat, regionB?.lon]);

  const handleMapClick = useCallback(
    (e: { lngLat: { lat: number; lng: number } }) => {
      if (!e || !e.lngLat) return;
      const coords = normalizeMapCoords(e.lngLat.lat, e.lngLat.lng);
      if (activePinMode === "A") {
        onSelectRegionA(coords);
      } else {
        onSelectRegionB(coords);
      }
    },
    [activePinMode, onSelectRegionA, onSelectRegionB]
  );

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col">
      {/* Top Floating Controls */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/70 text-xs shadow-xl">
        <span className="text-slate-400 font-mono uppercase tracking-wider font-semibold text-[11px]">
          Click Map to Set:
        </span>
        <button
          type="button"
          aria-pressed={activePinMode === "A"}
          onClick={() => setActivePinMode("A")}
          className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
            activePinMode === "A"
              ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30"
              : "bg-slate-800 text-cyan-400 hover:bg-slate-750 border border-slate-700"
          }`}
          title="Click or drag marker on map to set Region A coordinates"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
          Pin A ({regionA.name || "Region A"})
        </button>
        <button
          type="button"
          aria-pressed={activePinMode === "B"}
          onClick={() => setActivePinMode("B")}
          className={`px-2.5 py-1 rounded font-medium transition flex items-center gap-1.5 ${
            activePinMode === "B"
              ? "bg-orange-500 text-slate-950 font-bold shadow-md shadow-orange-500/30"
              : "bg-slate-800 text-orange-400 hover:bg-slate-750 border border-slate-700"
          }`}
          title="Click or drag marker on map to set Region B coordinates"
        >
          <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
          Pin B ({regionB ? regionB.name : "Add Comparison"})
        </button>

        <div className="h-4 w-[1px] bg-slate-700 mx-1 hidden sm:block" />

        <div className="flex items-center gap-1.5">
          <label htmlFor="gibs-layer-select" className="text-slate-400 font-mono text-[11px]">
            GIBS:
          </label>
          <select
            id="gibs-layer-select"
            value={selectedGibsId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGibsId(e.target.value)}
            className="bg-slate-800 text-slate-100 rounded px-2 py-1 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            style={{ colorScheme: "dark" }}
          >
            {GIBS_LAYERS.map((layer) => (
              <option key={layer.id} value={layer.id}>
                {layer.label} ({layer.mission})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 pl-1">
          <label htmlFor="gibs-opacity-slider" className="text-slate-400 font-mono text-[11px]">
            Opacity:
          </label>
          <input
            id="gibs-opacity-slider"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={gibsOpacity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGibsOpacity(parseFloat(e.target.value))}
            title={`NASA GIBS Overlay Opacity: ${Math.round(gibsOpacity * 100)}%`}
            aria-label="NASA GIBS satellite overlay opacity"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(gibsOpacity * 100)}
            aria-valuetext={`${Math.round(gibsOpacity * 100)} percent`}
            className="w-16 sm:w-20 accent-cyan-400 cursor-pointer"
            style={{ colorScheme: "dark" }}
          />
          <span className="text-[10px] font-mono text-slate-400 w-7">
            {Math.round(gibsOpacity * 100)}%
          </span>
        </div>
      </div>

      {/* Main MapLibre GL JS Map Container */}
      <div className="w-full h-full flex-1">
        <Map
          ref={mapRef}
          initialViewState={initialCenter}
          mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
          onClick={handleMapClick}
          onError={(e) => console.warn("MapLibre GL notice:", e.error?.message || e)}
          cursor="crosshair"
          attributionControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl position="bottom-right" />

          {/* NASA GIBS WMTS Raster Tile Layer */}
          <Source
            key={activeLayer.id}
            id="nasa-gibs"
            type="raster"
            tiles={[activeLayer.wmtsTemplate]}
            tileSize={256}
          >
            <Layer
              id="nasa-gibs-layer"
              type="raster"
              paint={{
                "raster-opacity": gibsOpacity,
                "raster-fade-duration": 200,
              }}
            />
          </Source>

          {/* Region A Marker (Cyan) - Draggable */}
          <Marker
            latitude={regionA.lat}
            longitude={regionA.lon}
            anchor="bottom"
            pitchAlignment="map"
            draggable
            onDragEnd={(e: { lngLat: { lat: number; lng: number } }) => {
              if (!e || !e.lngLat) return;
              const coords = normalizeMapCoords(e.lngLat.lat, e.lngLat.lng);
              onSelectRegionA(coords);
            }}
          >
            <div
              className="group relative flex flex-col items-center cursor-grab active:cursor-grabbing"
              title={`Drag Pin A to move (${regionA.lat.toFixed(2)}°, ${regionA.lon.toFixed(2)}°)`}
            >
              <div className="px-2 py-1 rounded bg-cyan-500 text-slate-950 font-mono text-xs font-bold shadow-lg border border-white whitespace-nowrap transition-transform transform group-hover:scale-105 pointer-events-none select-none">
                A: {regionA.name} ({regionA.lat.toFixed(2)}°, {regionA.lon.toFixed(2)}°)
              </div>
              <div className="w-3 h-3 bg-cyan-500 rotate-45 -mt-1.5 border-r border-b border-white shadow-md pointer-events-auto" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute -bottom-1 pointer-events-none" />
            </div>
          </Marker>

          {/* Region B Marker (Coral) - Draggable */}
          {regionB && (
            <Marker
              latitude={regionB.lat}
              longitude={regionB.lon}
              anchor="bottom"
              pitchAlignment="map"
              draggable
              onDragEnd={(e: { lngLat: { lat: number; lng: number } }) => {
                if (!e || !e.lngLat) return;
                const coords = normalizeMapCoords(e.lngLat.lat, e.lngLat.lng);
                onSelectRegionB(coords);
              }}
            >
              <div
                className="group relative flex flex-col items-center cursor-grab active:cursor-grabbing"
                title={`Drag Pin B to move (${regionB.lat.toFixed(2)}°, ${regionB.lon.toFixed(2)}°)`}
              >
                <div className="px-2 py-1 rounded bg-orange-500 text-slate-950 font-mono text-xs font-bold shadow-lg border border-white whitespace-nowrap transition-transform transform group-hover:scale-105 pointer-events-none select-none">
                  B: {regionB.name} ({regionB.lat.toFixed(2)}°, {regionB.lon.toFixed(2)}°)
                </div>
                <div className="w-3 h-3 bg-orange-500 rotate-45 -mt-1.5 border-r border-b border-white shadow-md pointer-events-auto" />
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-ping absolute -bottom-1 pointer-events-none" />
              </div>
            </Marker>
          )}
        </Map>
      </div>

      {/* Bottom Info Bar / GIBS Attribution */}
      <div className="bg-slate-900/90 border-t border-slate-800 px-3 py-1.5 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Active Layer: <strong className="text-slate-200">{activeLayer.label}</strong> (
            {activeLayer.mission})
          </span>
          {activeLayer.resolution && (
            <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700">
              Res: {activeLayer.resolution}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href={activeLayer.attributionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline flex items-center gap-0.5"
          >
            NASA GIBS Docs ↗
          </a>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">Carto Dark Matter Basemap</span>
        </div>
      </div>
    </div>
  );
};
