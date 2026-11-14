/**
 * NASA GIBS (Global Imagery Browse Services) WMTS Layer Configurations
 * Browser-direct raster tile URLs - Zero server downloads required.
 * Reference: https://gibs.earthdata.nasa.gov/
 */

export interface GibsLayerOption {
  id: string;
  label: string;
  mission: string;
  variableId: string;
  wmtsTemplate: string;
  attributionUrl: string;
  description?: string;
  resolution?: string;
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
    description: "Daily radiometric surface skin temperature observed by Terra MODIS.",
    resolution: "1 km",
  },
  {
    id: "IMERG_Precipitation_Rate",
    label: "Precipitation Rate (IMERG)",
    mission: "NASA GPM",
    variableId: "PRECTOTCORR",
    wmtsTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/IMERG_Precipitation_Rate/default/2024-07-15/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
    attributionUrl: "https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm",
    description: "Multi-satellite combined precipitation estimates from the GPM constellation.",
    resolution: "0.1° (~10 km)",
  },
  {
    id: "AIRS_L3_Surface_Air_Temperature_Daily_Day",
    label: "Surface Air Temperature",
    mission: "NASA Aqua AIRS",
    variableId: "T2M",
    wmtsTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/AIRS_L3_Surface_Air_Temperature_Daily_Day/default/2024-07-15/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
    attributionUrl: "https://www.earthdata.nasa.gov/data/instruments/airs",
    description: "Atmospheric Infrared Sounder daily 2-meter air temperature retrieval.",
    resolution: "1° (~100 km)",
  },
  {
    id: "OMI_Aerosol_Index",
    label: "UV Aerosol Index (Smoke/Dust)",
    mission: "NASA Aura OMI",
    variableId: "ALLSKY_SFC_SW_DWN",
    wmtsTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/OMI_Aerosol_Index/default/2024-07-15/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
    attributionUrl: "https://www.earthdata.nasa.gov/data/instruments/omi/resources",
    description: "Ozone Monitoring Instrument UV aerosol index tracking smoke, dust, and solar dimming.",
    resolution: "1° (~100 km)",
  },
  {
    id: "SMAP_L4_Analyzed_Surface_Soil_Moisture",
    label: "Root-Zone Soil Wetness Proxy",
    mission: "NASA SMAP",
    variableId: "GWETROOT",
    wmtsTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/SMAP_L4_Analyzed_Surface_Soil_Moisture/default/2024-07-15/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
    attributionUrl: "https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1",
    description: "Satellite-derived soil wetness proxy mapping drought and moisture saturation.",
    resolution: "9 km",
  },
  {
    id: "AIRS_L3_Surface_Relative_Humidity_Daily_Day",
    label: "Surface Relative Humidity",
    mission: "NASA Aqua AIRS",
    variableId: "QV2M",
    wmtsTemplate:
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/AIRS_L3_Surface_Relative_Humidity_Daily_Day/default/2024-07-15/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
    attributionUrl: "https://www.earthdata.nasa.gov/data/instruments/airs",
    description: "Atmospheric moisture retrieval driving humid heat and monsoon moisture dynamics.",
    resolution: "1° (~100 km)",
  },
];

/**
 * Helper to build a NASA GIBS tile URL template with a specific date snapshot.
 */
export function buildGibsTileUrl(layer: GibsLayerOption, dateSnapshot: string = "2024-07-15"): string {
  return layer.wmtsTemplate.replace(/\/\d{4}-\d{2}-\d{2}\//, `/${dateSnapshot}/`);
}

/**
 * Helper to look up a GIBS layer by variable ID (e.g. 'TS', 'PRECTOTCORR', 'T2M', 'GWETROOT', 'QV2M', etc.)
 */
export function getGibsLayerByVariable(variableId: string): GibsLayerOption | undefined {
  return GIBS_LAYERS.find((layer) => layer.variableId === variableId);
}

/**
 * Helper to look up a GIBS layer by layer ID, falling back safely to the primary layer.
 */
export function getGibsLayerById(id: string): GibsLayerOption {
  return GIBS_LAYERS.find((layer) => layer.id === id) || GIBS_LAYERS[0];
}
