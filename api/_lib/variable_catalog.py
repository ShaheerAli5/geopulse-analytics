"""
NASA Earth Science Variable Catalog
Defines the 6 core Earth science variables, student definitions, units,
and official NASA verification links for GeoPulse Analytics.
"""

VARIABLE_CATALOG = {
    "PRECTOTCORR": {
        "name": "Bias-Corrected Total Precipitation",
        "units": "mm/day",
        "mission_model": "NASA MERRA-2 / GPM IMERG Assimilation",
        "plain_definition": (
            "Average daily rain and melted snow reaching the surface, "
            "bias-corrected with satellite and gauge observations."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm",
    },
    "GWETROOT": {
        "name": "Root-Zone Soil Moisture Wetness",
        "units": "fraction (0-1)",
        "mission_model": "NASA GLDAS / MERRA-2 Land Surface Model",
        "plain_definition": (
            "Fraction of water filling soil pores in the top 100 cm root zone "
            "(0 = completely dry soil, 1 = fully saturated soil)."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1",
    },
    "T2M": {
        "name": "Surface Air Temperature (2 Meters)",
        "units": "°C",
        "mission_model": "NASA MERRA-2 / Aqua AIRS",
        "plain_definition": (
            "Air temperature at 2 meters above the ground—the standard meteorological "
            "height for human and crop heat exposure."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/instruments/airs",
    },
    "TS": {
        "name": "Earth Surface Skin Temperature",
        "units": "°C",
        "mission_model": "NASA MODIS / MERRA-2",
        "plain_definition": (
            "Radiometric temperature of the land or water surface skin, which responds "
            "rapidly to vegetation loss, drought, and urbanization."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/instruments/modis/data-access-tools",
    },
    "QV2M": {
        "name": "Specific Humidity (2 Meters)",
        "units": "g/kg",
        "mission_model": "NASA AIRS / MERRA-2",
        "plain_definition": (
            "Grams of water vapor per kilogram of air near the ground—a key driver of "
            "humid heatwave intensity and monsoon moisture transport."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/instruments/airs",
    },
    "ALLSKY_SFC_SW_DWN": {
        "name": "All-Sky Surface Shortwave Downward Irradiance",
        "units": "kW-hr/m²/day",
        "mission_model": "NASA CERES / MODIS / OMI Aerosol Proxy",
        "plain_definition": (
            "Total solar energy reaching the ground after passing through clouds, dust, "
            "and smoke aerosols (tracks solar dimming or brightening)."
        ),
        "giovanni_url": "https://giovanni.gsfc.nasa.gov/giovanni/",
        "earthdata_url": "https://www.earthdata.nasa.gov/data/instruments/omi/resources",
    },
}
