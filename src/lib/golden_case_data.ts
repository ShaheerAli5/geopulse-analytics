/**
 * GeoPulse Analytics - Pre-Cached Golden Case Files
 * Pre-cached in-memory golden demo cases ensuring sub-50ms instant switching
 * without network latency or external dependencies.
 */

import type { InvestigationResponse, GoldenCaseMeta } from "./types";

export const GOLDEN_CASE_METAS: GoldenCaseMeta[] = [
  {
    id: 'pk-divergence',
    title: 'Indus vs. Balochistan',
    subtitle: 'Hydrological Divergence (1981-2025)',
    variableId: 'GWETROOT',
    variableName: 'Root-Zone Soil Moisture Wetness',
    units: 'fraction (0-1)',
    regionAName: 'Upper Indus (Gilgit-Baltistan)',
    regionBName: 'Southwestern Balochistan',
    badgeA: 'INCREASING_SIGNIFICANT',
    badgeB: 'INCREASING_NOT_SIGNIFICANT',
    divergenceDetected: true,
    summary: 'Glacial wetting in Karakoram/Indus basin contrasting with arid stalling in Balochistan.'
  },
  {
    id: 'pk-heatwave',
    title: 'Jacobabad vs. Karachi',
    subtitle: 'South Asian Heat Envelope (1981-2025)',
    variableId: 'T2M',
    variableName: 'Surface Air Temperature (2 Meters)',
    units: '°C',
    regionAName: 'Jacobabad (Inland Thermal Pole)',
    regionBName: 'Karachi (Arabian Sea Coast)',
    badgeA: 'INCREASING_NOT_SIGNIFICANT',
    badgeB: 'INCREASING_SIGNIFICANT',
    divergenceDetected: true,
    summary: 'Inland extreme thermal baseline vs. maritime accelerating warming along the Arabian Sea.'
  },
  {
    id: 'aral-sea',
    title: 'Aral Sea vs. Tien Shan',
    subtitle: 'Central Asian Water Loss (1981-2025)',
    variableId: 'GWETROOT',
    variableName: 'Root-Zone Soil Moisture Wetness',
    units: 'fraction (0-1)',
    regionAName: 'Aral Sea Basin (Desiccated Bed)',
    regionBName: 'Tien Shan Mountains (Glacial Headwaters)',
    badgeA: 'INCREASING_NOT_SIGNIFICANT',
    badgeB: 'INCREASING_NOT_SIGNIFICANT',
    divergenceDetected: false,
    summary: 'Severely depleted root-zone soil moisture across desiccated lakebed with glacial buffer.'
  },
  {
    id: 'amazon-drying',
    title: 'Amazon Arc vs. Core',
    subtitle: 'Basin-Wide Precipitation Decline (1981-2025)',
    variableId: 'PRECTOTCORR',
    variableName: 'Bias-Corrected Total Precipitation',
    units: 'mm/day',
    regionAName: 'Mato Grosso (Arc of Deforestation)',
    regionBName: 'Central Amazon Rainforest (Core)',
    badgeA: 'DECREASING_SIGNIFICANT',
    badgeB: 'DECREASING_SIGNIFICANT',
    divergenceDetected: false,
    summary: 'Statistically significant precipitation declines across both frontier and central forest.'
  }
];

export const GOLDEN_CASES: Record<string, InvestigationResponse> = {
  'pk-divergence': {
  "investigation_id": "pk-divergence",
  "variable_id": "GWETROOT",
  "variable_name": "Root-Zone Soil Moisture Wetness",
  "units": "fraction (0-1)",
  "plain_definition": "Fraction of water filling soil pores in the top 100 cm root zone (0 = completely dry soil, 1 = fully saturated soil).",
  "aggregation_mode": "annual",
  "start_year": 1981,
  "end_year": 2025,
  "provenance": {
    "source_name": "NASA POWER / MERRA-2",
    "mission_model": "NASA GLDAS / MERRA-2 Land Surface Model",
    "api_endpoint": "https://power.larc.nasa.gov/api/temporal/monthly/point",
    "spatial_resolution": "0.5\u00b0 x 0.625\u00b0 (MERRA-2 Grid)",
    "missing_months_filtered": 0,
    "retrieved_at_utc": "2026-11-14T17:09:41.884645+00:00",
    "verification_links": [
      {
        "label": "NASA Giovanni",
        "url": "https://giovanni.gsfc.nasa.gov/giovanni/"
      },
      {
        "label": "NASA Earthdata",
        "url": "https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1"
      },
      {
        "label": "CUAHSI HydroClient",
        "url": "https://data.cuahsi.org/"
      },
      {
        "label": "NASA Worldview",
        "url": "https://worldview.earthdata.nasa.gov/"
      }
    ]
  },
  "region_a": {
    "region": {
      "id": "A",
      "name": "Upper Indus (Gilgit-Baltistan)",
      "lat": 35.3,
      "lon": 75.6
    },
    "series": [
      {
        "year": 1981,
        "value": 0.4492,
        "ols_fitted": 0.3899,
        "sen_fitted": 0.3874,
        "anomaly": 0.0304
      },
      {
        "year": 1982,
        "value": 0.445,
        "ols_fitted": 0.3912,
        "sen_fitted": 0.3887,
        "anomaly": 0.0262
      },
      {
        "year": 1983,
        "value": 0.4433,
        "ols_fitted": 0.3925,
        "sen_fitted": 0.39,
        "anomaly": 0.0245
      },
      {
        "year": 1984,
        "value": 0.3908,
        "ols_fitted": 0.3938,
        "sen_fitted": 0.3913,
        "anomaly": -0.028
      },
      {
        "year": 1985,
        "value": 0.3692,
        "ols_fitted": 0.3952,
        "sen_fitted": 0.3926,
        "anomaly": -0.0496
      },
      {
        "year": 1986,
        "value": 0.4183,
        "ols_fitted": 0.3965,
        "sen_fitted": 0.3939,
        "anomaly": -0.0005
      },
      {
        "year": 1987,
        "value": 0.4375,
        "ols_fitted": 0.3978,
        "sen_fitted": 0.3952,
        "anomaly": 0.0187
      },
      {
        "year": 1988,
        "value": 0.4292,
        "ols_fitted": 0.3991,
        "sen_fitted": 0.3965,
        "anomaly": 0.0104
      },
      {
        "year": 1989,
        "value": 0.4042,
        "ols_fitted": 0.4004,
        "sen_fitted": 0.3977,
        "anomaly": -0.0146
      },
      {
        "year": 1990,
        "value": 0.4025,
        "ols_fitted": 0.4017,
        "sen_fitted": 0.399,
        "anomaly": -0.0163
      },
      {
        "year": 1991,
        "value": 0.3483,
        "ols_fitted": 0.4031,
        "sen_fitted": 0.4003,
        "anomaly": -0.0705
      },
      {
        "year": 1992,
        "value": 0.4075,
        "ols_fitted": 0.4044,
        "sen_fitted": 0.4016,
        "anomaly": -0.0113
      },
      {
        "year": 1993,
        "value": 0.3908,
        "ols_fitted": 0.4057,
        "sen_fitted": 0.4029,
        "anomaly": -0.028
      },
      {
        "year": 1994,
        "value": 0.3883,
        "ols_fitted": 0.407,
        "sen_fitted": 0.4042,
        "anomaly": -0.0305
      },
      {
        "year": 1995,
        "value": 0.4342,
        "ols_fitted": 0.4083,
        "sen_fitted": 0.4055,
        "anomaly": 0.0154
      },
      {
        "year": 1996,
        "value": 0.4642,
        "ols_fitted": 0.4096,
        "sen_fitted": 0.4068,
        "anomaly": 0.0454
      },
      {
        "year": 1997,
        "value": 0.405,
        "ols_fitted": 0.4109,
        "sen_fitted": 0.4081,
        "anomaly": -0.0138
      },
      {
        "year": 1998,
        "value": 0.3583,
        "ols_fitted": 0.4123,
        "sen_fitted": 0.4093,
        "anomaly": -0.0605
      },
      {
        "year": 1999,
        "value": 0.3567,
        "ols_fitted": 0.4136,
        "sen_fitted": 0.4106,
        "anomaly": -0.0621
      },
      {
        "year": 2000,
        "value": 0.3558,
        "ols_fitted": 0.4149,
        "sen_fitted": 0.4119,
        "anomaly": -0.063
      },
      {
        "year": 2001,
        "value": 0.3633,
        "ols_fitted": 0.4162,
        "sen_fitted": 0.4132,
        "anomaly": -0.0555
      },
      {
        "year": 2002,
        "value": 0.3733,
        "ols_fitted": 0.4175,
        "sen_fitted": 0.4145,
        "anomaly": -0.0455
      },
      {
        "year": 2003,
        "value": 0.395,
        "ols_fitted": 0.4188,
        "sen_fitted": 0.4158,
        "anomaly": -0.0238
      },
      {
        "year": 2004,
        "value": 0.3833,
        "ols_fitted": 0.4201,
        "sen_fitted": 0.4171,
        "anomaly": -0.0355
      },
      {
        "year": 2005,
        "value": 0.395,
        "ols_fitted": 0.4215,
        "sen_fitted": 0.4184,
        "anomaly": -0.0238
      },
      {
        "year": 2006,
        "value": 0.4042,
        "ols_fitted": 0.4228,
        "sen_fitted": 0.4197,
        "anomaly": -0.0146
      },
      {
        "year": 2007,
        "value": 0.4117,
        "ols_fitted": 0.4241,
        "sen_fitted": 0.421,
        "anomaly": -0.0071
      },
      {
        "year": 2008,
        "value": 0.3942,
        "ols_fitted": 0.4254,
        "sen_fitted": 0.4223,
        "anomaly": -0.0246
      },
      {
        "year": 2009,
        "value": 0.4192,
        "ols_fitted": 0.4267,
        "sen_fitted": 0.4235,
        "anomaly": 0.0004
      },
      {
        "year": 2010,
        "value": 0.435,
        "ols_fitted": 0.428,
        "sen_fitted": 0.4248,
        "anomaly": 0.0162
      },
      {
        "year": 2011,
        "value": 0.4217,
        "ols_fitted": 0.4294,
        "sen_fitted": 0.4261,
        "anomaly": 0.0029
      },
      {
        "year": 2012,
        "value": 0.4075,
        "ols_fitted": 0.4307,
        "sen_fitted": 0.4274,
        "anomaly": -0.0113
      },
      {
        "year": 2013,
        "value": 0.4158,
        "ols_fitted": 0.432,
        "sen_fitted": 0.4287,
        "anomaly": -0.003
      },
      {
        "year": 2014,
        "value": 0.4242,
        "ols_fitted": 0.4333,
        "sen_fitted": 0.43,
        "anomaly": 0.0054
      },
      {
        "year": 2015,
        "value": 0.49,
        "ols_fitted": 0.4346,
        "sen_fitted": 0.4313,
        "anomaly": 0.0712
      },
      {
        "year": 2016,
        "value": 0.4625,
        "ols_fitted": 0.4359,
        "sen_fitted": 0.4326,
        "anomaly": 0.0437
      },
      {
        "year": 2017,
        "value": 0.4258,
        "ols_fitted": 0.4372,
        "sen_fitted": 0.4339,
        "anomaly": 0.007
      },
      {
        "year": 2018,
        "value": 0.4033,
        "ols_fitted": 0.4386,
        "sen_fitted": 0.4352,
        "anomaly": -0.0155
      },
      {
        "year": 2019,
        "value": 0.4767,
        "ols_fitted": 0.4399,
        "sen_fitted": 0.4364,
        "anomaly": 0.0579
      },
      {
        "year": 2020,
        "value": 0.5208,
        "ols_fitted": 0.4412,
        "sen_fitted": 0.4377,
        "anomaly": 0.102
      },
      {
        "year": 2021,
        "value": 0.4958,
        "ols_fitted": 0.4425,
        "sen_fitted": 0.439,
        "anomaly": 0.077
      },
      {
        "year": 2022,
        "value": 0.4625,
        "ols_fitted": 0.4438,
        "sen_fitted": 0.4403,
        "anomaly": 0.0437
      },
      {
        "year": 2023,
        "value": 0.4917,
        "ols_fitted": 0.4451,
        "sen_fitted": 0.4416,
        "anomaly": 0.0729
      },
      {
        "year": 2024,
        "value": 0.4558,
        "ols_fitted": 0.4464,
        "sen_fitted": 0.4429,
        "anomaly": 0.037
      },
      {
        "year": 2025,
        "value": 0.4208,
        "ols_fitted": 0.4478,
        "sen_fitted": 0.4442,
        "anomaly": 0.002
      }
    ],
    "stats": {
      "n_years": 45,
      "mean_value": 0.4188,
      "std_dev": 0.0403,
      "ols_slope_per_year": 0.00131,
      "ols_slope_per_decade": 0.0131,
      "ols_r_squared": 0.1833,
      "ols_p_value": 0.00334,
      "ols_ci_lower_decade": 0.0046,
      "ols_ci_upper_decade": 0.0217,
      "mk_tau": 0.2704,
      "mk_z_score": 2.602,
      "mk_p_value": 0.00899,
      "sen_slope_per_decade": 0.0129,
      "sen_ci_lower_decade": 0.004,
      "sen_ci_upper_decade": 0.0242,
      "lag1_autocorrelation": 0.607,
      "badge": "INCREASING_SIGNIFICANT",
      "caveats": [
        "Moderate lag-1 serial autocorrelation detected (r1 = 0.61); effective degrees of freedom may be lower than sample count."
      ]
    }
  },
  "region_b": {
    "region": {
      "id": "B",
      "name": "Southwestern Balochistan",
      "lat": 27.5,
      "lon": 64.0
    },
    "series": [
      {
        "year": 1981,
        "value": 0.4425,
        "ols_fitted": 0.446,
        "sen_fitted": 0.444,
        "anomaly": -0.0058
      },
      {
        "year": 1982,
        "value": 0.475,
        "ols_fitted": 0.4461,
        "sen_fitted": 0.444,
        "anomaly": 0.0267
      },
      {
        "year": 1983,
        "value": 0.4492,
        "ols_fitted": 0.4462,
        "sen_fitted": 0.4441,
        "anomaly": 0.0009
      },
      {
        "year": 1984,
        "value": 0.4575,
        "ols_fitted": 0.4463,
        "sen_fitted": 0.4441,
        "anomaly": 0.0092
      },
      {
        "year": 1985,
        "value": 0.4425,
        "ols_fitted": 0.4464,
        "sen_fitted": 0.4441,
        "anomaly": -0.0058
      },
      {
        "year": 1986,
        "value": 0.4442,
        "ols_fitted": 0.4465,
        "sen_fitted": 0.4442,
        "anomaly": -0.0041
      },
      {
        "year": 1987,
        "value": 0.445,
        "ols_fitted": 0.4466,
        "sen_fitted": 0.4442,
        "anomaly": -0.0033
      },
      {
        "year": 1988,
        "value": 0.4442,
        "ols_fitted": 0.4467,
        "sen_fitted": 0.4443,
        "anomaly": -0.0041
      },
      {
        "year": 1989,
        "value": 0.4433,
        "ols_fitted": 0.4468,
        "sen_fitted": 0.4443,
        "anomaly": -0.005
      },
      {
        "year": 1990,
        "value": 0.445,
        "ols_fitted": 0.4469,
        "sen_fitted": 0.4444,
        "anomaly": -0.0033
      },
      {
        "year": 1991,
        "value": 0.4433,
        "ols_fitted": 0.447,
        "sen_fitted": 0.4444,
        "anomaly": -0.005
      },
      {
        "year": 1992,
        "value": 0.4458,
        "ols_fitted": 0.4472,
        "sen_fitted": 0.4445,
        "anomaly": -0.0025
      },
      {
        "year": 1993,
        "value": 0.4442,
        "ols_fitted": 0.4473,
        "sen_fitted": 0.4445,
        "anomaly": -0.0041
      },
      {
        "year": 1994,
        "value": 0.445,
        "ols_fitted": 0.4474,
        "sen_fitted": 0.4446,
        "anomaly": -0.0033
      },
      {
        "year": 1995,
        "value": 0.4458,
        "ols_fitted": 0.4475,
        "sen_fitted": 0.4446,
        "anomaly": -0.0025
      },
      {
        "year": 1996,
        "value": 0.4517,
        "ols_fitted": 0.4476,
        "sen_fitted": 0.4447,
        "anomaly": 0.0034
      },
      {
        "year": 1997,
        "value": 0.4475,
        "ols_fitted": 0.4477,
        "sen_fitted": 0.4447,
        "anomaly": -0.0008
      },
      {
        "year": 1998,
        "value": 0.4442,
        "ols_fitted": 0.4478,
        "sen_fitted": 0.4448,
        "anomaly": -0.0041
      },
      {
        "year": 1999,
        "value": 0.4425,
        "ols_fitted": 0.4479,
        "sen_fitted": 0.4448,
        "anomaly": -0.0058
      },
      {
        "year": 2000,
        "value": 0.4425,
        "ols_fitted": 0.448,
        "sen_fitted": 0.4449,
        "anomaly": -0.0058
      },
      {
        "year": 2001,
        "value": 0.445,
        "ols_fitted": 0.4481,
        "sen_fitted": 0.4449,
        "anomaly": -0.0033
      },
      {
        "year": 2002,
        "value": 0.4442,
        "ols_fitted": 0.4482,
        "sen_fitted": 0.445,
        "anomaly": -0.0041
      },
      {
        "year": 2003,
        "value": 0.445,
        "ols_fitted": 0.4483,
        "sen_fitted": 0.445,
        "anomaly": -0.0033
      },
      {
        "year": 2004,
        "value": 0.4417,
        "ols_fitted": 0.4484,
        "sen_fitted": 0.445,
        "anomaly": -0.0066
      },
      {
        "year": 2005,
        "value": 0.4583,
        "ols_fitted": 0.4485,
        "sen_fitted": 0.4451,
        "anomaly": 0.01
      },
      {
        "year": 2006,
        "value": 0.4475,
        "ols_fitted": 0.4486,
        "sen_fitted": 0.4451,
        "anomaly": -0.0008
      },
      {
        "year": 2007,
        "value": 0.4542,
        "ols_fitted": 0.4487,
        "sen_fitted": 0.4452,
        "anomaly": 0.0059
      },
      {
        "year": 2008,
        "value": 0.4492,
        "ols_fitted": 0.4489,
        "sen_fitted": 0.4452,
        "anomaly": 0.0009
      },
      {
        "year": 2009,
        "value": 0.4492,
        "ols_fitted": 0.449,
        "sen_fitted": 0.4453,
        "anomaly": 0.0009
      },
      {
        "year": 2010,
        "value": 0.445,
        "ols_fitted": 0.4491,
        "sen_fitted": 0.4453,
        "anomaly": -0.0033
      },
      {
        "year": 2011,
        "value": 0.4475,
        "ols_fitted": 0.4492,
        "sen_fitted": 0.4454,
        "anomaly": -0.0008
      },
      {
        "year": 2012,
        "value": 0.4442,
        "ols_fitted": 0.4493,
        "sen_fitted": 0.4454,
        "anomaly": -0.0041
      },
      {
        "year": 2013,
        "value": 0.4475,
        "ols_fitted": 0.4494,
        "sen_fitted": 0.4455,
        "anomaly": -0.0008
      },
      {
        "year": 2014,
        "value": 0.4433,
        "ols_fitted": 0.4495,
        "sen_fitted": 0.4455,
        "anomaly": -0.005
      },
      {
        "year": 2015,
        "value": 0.4442,
        "ols_fitted": 0.4496,
        "sen_fitted": 0.4456,
        "anomaly": -0.0041
      },
      {
        "year": 2016,
        "value": 0.4425,
        "ols_fitted": 0.4497,
        "sen_fitted": 0.4456,
        "anomaly": -0.0058
      },
      {
        "year": 2017,
        "value": 0.4442,
        "ols_fitted": 0.4498,
        "sen_fitted": 0.4457,
        "anomaly": -0.0041
      },
      {
        "year": 2018,
        "value": 0.4408,
        "ols_fitted": 0.4499,
        "sen_fitted": 0.4457,
        "anomaly": -0.0075
      },
      {
        "year": 2019,
        "value": 0.4508,
        "ols_fitted": 0.45,
        "sen_fitted": 0.4458,
        "anomaly": 0.0025
      },
      {
        "year": 2020,
        "value": 0.4592,
        "ols_fitted": 0.4501,
        "sen_fitted": 0.4458,
        "anomaly": 0.0109
      },
      {
        "year": 2021,
        "value": 0.4467,
        "ols_fitted": 0.4502,
        "sen_fitted": 0.4458,
        "anomaly": -0.0016
      },
      {
        "year": 2022,
        "value": 0.4692,
        "ols_fitted": 0.4503,
        "sen_fitted": 0.4459,
        "anomaly": 0.0209
      },
      {
        "year": 2023,
        "value": 0.4725,
        "ols_fitted": 0.4504,
        "sen_fitted": 0.4459,
        "anomaly": 0.0242
      },
      {
        "year": 2024,
        "value": 0.4592,
        "ols_fitted": 0.4506,
        "sen_fitted": 0.446,
        "anomaly": 0.0109
      },
      {
        "year": 2025,
        "value": 0.4425,
        "ols_fitted": 0.4507,
        "sen_fitted": 0.446,
        "anomaly": -0.0058
      }
    ],
    "stats": {
      "n_years": 45,
      "mean_value": 0.4483,
      "std_dev": 0.008,
      "ols_slope_per_year": 0.00011,
      "ols_slope_per_decade": 0.0011,
      "ols_r_squared": 0.0305,
      "ols_p_value": 0.25131,
      "ols_ci_lower_decade": -0.0008,
      "ols_ci_upper_decade": 0.0029,
      "mk_tau": 0.1154,
      "mk_z_score": 1.066,
      "mk_p_value": 0.27866,
      "sen_slope_per_decade": 0.0005,
      "sen_ci_lower_decade": -0.0003,
      "sen_ci_upper_decade": 0.0018,
      "lag1_autocorrelation": 0.261,
      "badge": "INCREASING_NOT_SIGNIFICANT",
      "caveats": [
        "Observed direction is upward, but p = 0.279 does not cross the \u03b1 = 0.05 significance threshold due to interannual variability."
      ]
    }
  },
  "divergence_detected": true,
  "ai_interpretation": {
    "headline": "Regional Divergence Confirmed: Upper Indus (Gilgit-Baltistan) and Southwestern Balochistan exhibit contrasting Root-Zone Soil Moisture Wetness trajectories (1981\u20132025).",
    "what_is_changing": "Upper Indus (Gilgit-Baltistan) (35.3\u00b0N, 75.6\u00b0E) shows an increasing linear rate of +0.0131 fraction (0-1)/decade (Sen's robust slope: +0.0129 fraction (0-1)/decade; 95% CI [0.0046, 0.0217]), which is statistically significant (Mann\u2013Kendall p = 0.0090, \u03c4 = 0.27).",
    "where_it_diverges": "Southwestern Balochistan (27.5\u00b0N, 64.0\u00b0E) shows an increasing linear rate of +0.0011 fraction (0-1)/decade (Sen's robust slope: +0.0005 fraction (0-1)/decade; 95% CI [-0.0008, 0.0029]), which is not statistically significant at \u03b1 = 0.05 (Mann\u2013Kendall p = 0.279, \u03c4 = 0.12). Comparing both regions side by side demonstrates why global or national averages can mask localized environmental shifts.",
    "statistical_verdict": "Both parametric (Ordinary Least Squares) and non-parametric (Mann\u2013Kendall / Theil\u2013Sen) tests confirm a statistically detectable signal (p < 0.05) over the 45-year NASA record.",
    "limitations_and_caveats": "Moderate lag-1 serial autocorrelation detected (r1 = 0.61); effective degrees of freedom may be lower than sample count. Observed direction is upward, but p = 0.279 does not cross the \u03b1 = 0.05 significance threshold due to interannual variability.",
    "generated_by": "deterministic_scientific_engine"
  }
},
  'pk-heatwave': {
  "investigation_id": "pk-heatwave",
  "variable_id": "T2M",
  "variable_name": "Surface Air Temperature (2 Meters)",
  "units": "\u00b0C",
  "plain_definition": "Air temperature at 2 meters above the ground\u2014the standard meteorological height for human and crop heat exposure.",
  "aggregation_mode": "annual",
  "start_year": 1981,
  "end_year": 2025,
  "provenance": {
    "source_name": "NASA POWER / MERRA-2",
    "mission_model": "NASA MERRA-2 / Aqua AIRS",
    "api_endpoint": "https://power.larc.nasa.gov/api/temporal/monthly/point",
    "spatial_resolution": "0.5\u00b0 x 0.625\u00b0 (MERRA-2 Grid)",
    "missing_months_filtered": 0,
    "retrieved_at_utc": "2026-11-14T17:09:43.450529+00:00",
    "verification_links": [
      {
        "label": "NASA Giovanni",
        "url": "https://giovanni.gsfc.nasa.gov/giovanni/"
      },
      {
        "label": "NASA Earthdata",
        "url": "https://www.earthdata.nasa.gov/data/instruments/airs"
      },
      {
        "label": "CUAHSI HydroClient",
        "url": "https://data.cuahsi.org/"
      },
      {
        "label": "NASA Worldview",
        "url": "https://worldview.earthdata.nasa.gov/"
      }
    ]
  },
  "region_a": {
    "region": {
      "id": "A",
      "name": "Jacobabad (Inland Thermal Pole)",
      "lat": 28.28,
      "lon": 68.44
    },
    "series": [
      {
        "year": 1981,
        "value": 28.7217,
        "ols_fitted": 28.779,
        "sen_fitted": 28.6986,
        "anomaly": -0.1269
      },
      {
        "year": 1982,
        "value": 27.7483,
        "ols_fitted": 28.7821,
        "sen_fitted": 28.7047,
        "anomaly": -1.1003
      },
      {
        "year": 1983,
        "value": 28.1508,
        "ols_fitted": 28.7853,
        "sen_fitted": 28.7107,
        "anomaly": -0.6978
      },
      {
        "year": 1984,
        "value": 28.3092,
        "ols_fitted": 28.7885,
        "sen_fitted": 28.7168,
        "anomaly": -0.5394
      },
      {
        "year": 1985,
        "value": 28.6908,
        "ols_fitted": 28.7916,
        "sen_fitted": 28.7228,
        "anomaly": -0.1578
      },
      {
        "year": 1986,
        "value": 28.3633,
        "ols_fitted": 28.7948,
        "sen_fitted": 28.7289,
        "anomaly": -0.4853
      },
      {
        "year": 1987,
        "value": 29.2208,
        "ols_fitted": 28.798,
        "sen_fitted": 28.7349,
        "anomaly": 0.3722
      },
      {
        "year": 1988,
        "value": 29.8217,
        "ols_fitted": 28.8011,
        "sen_fitted": 28.741,
        "anomaly": 0.9731
      },
      {
        "year": 1989,
        "value": 28.3233,
        "ols_fitted": 28.8043,
        "sen_fitted": 28.747,
        "anomaly": -0.5253
      },
      {
        "year": 1990,
        "value": 29.2317,
        "ols_fitted": 28.8074,
        "sen_fitted": 28.7531,
        "anomaly": 0.3831
      },
      {
        "year": 1991,
        "value": 28.8925,
        "ols_fitted": 28.8106,
        "sen_fitted": 28.7591,
        "anomaly": 0.0439
      },
      {
        "year": 1992,
        "value": 28.3233,
        "ols_fitted": 28.8138,
        "sen_fitted": 28.7652,
        "anomaly": -0.5253
      },
      {
        "year": 1993,
        "value": 29.3592,
        "ols_fitted": 28.8169,
        "sen_fitted": 28.7712,
        "anomaly": 0.5106
      },
      {
        "year": 1994,
        "value": 28.4992,
        "ols_fitted": 28.8201,
        "sen_fitted": 28.7773,
        "anomaly": -0.3494
      },
      {
        "year": 1995,
        "value": 28.5892,
        "ols_fitted": 28.8233,
        "sen_fitted": 28.7833,
        "anomaly": -0.2594
      },
      {
        "year": 1996,
        "value": 28.84,
        "ols_fitted": 28.8264,
        "sen_fitted": 28.7894,
        "anomaly": -0.0086
      },
      {
        "year": 1997,
        "value": 27.7858,
        "ols_fitted": 28.8296,
        "sen_fitted": 28.7954,
        "anomaly": -1.0628
      },
      {
        "year": 1998,
        "value": 29.6792,
        "ols_fitted": 28.8327,
        "sen_fitted": 28.8015,
        "anomaly": 0.8306
      },
      {
        "year": 1999,
        "value": 29.5075,
        "ols_fitted": 28.8359,
        "sen_fitted": 28.8075,
        "anomaly": 0.6589
      },
      {
        "year": 2000,
        "value": 29.345,
        "ols_fitted": 28.8391,
        "sen_fitted": 28.8136,
        "anomaly": 0.4964
      },
      {
        "year": 2001,
        "value": 29.4783,
        "ols_fitted": 28.8422,
        "sen_fitted": 28.8196,
        "anomaly": 0.6297
      },
      {
        "year": 2002,
        "value": 29.525,
        "ols_fitted": 28.8454,
        "sen_fitted": 28.8257,
        "anomaly": 0.6764
      },
      {
        "year": 2003,
        "value": 28.7217,
        "ols_fitted": 28.8486,
        "sen_fitted": 28.8317,
        "anomaly": -0.1269
      },
      {
        "year": 2004,
        "value": 29.6592,
        "ols_fitted": 28.8517,
        "sen_fitted": 28.8377,
        "anomaly": 0.8106
      },
      {
        "year": 2005,
        "value": 28.6417,
        "ols_fitted": 28.8549,
        "sen_fitted": 28.8438,
        "anomaly": -0.2069
      },
      {
        "year": 2006,
        "value": 29.4875,
        "ols_fitted": 28.858,
        "sen_fitted": 28.8498,
        "anomaly": 0.6389
      },
      {
        "year": 2007,
        "value": 29.0383,
        "ols_fitted": 28.8612,
        "sen_fitted": 28.8559,
        "anomaly": 0.1897
      },
      {
        "year": 2008,
        "value": 28.8317,
        "ols_fitted": 28.8644,
        "sen_fitted": 28.8619,
        "anomaly": -0.0169
      },
      {
        "year": 2009,
        "value": 29.0725,
        "ols_fitted": 28.8675,
        "sen_fitted": 28.868,
        "anomaly": 0.2239
      },
      {
        "year": 2010,
        "value": 29.4617,
        "ols_fitted": 28.8707,
        "sen_fitted": 28.874,
        "anomaly": 0.6131
      },
      {
        "year": 2011,
        "value": 28.8625,
        "ols_fitted": 28.8739,
        "sen_fitted": 28.8801,
        "anomaly": 0.0139
      },
      {
        "year": 2012,
        "value": 27.9233,
        "ols_fitted": 28.877,
        "sen_fitted": 28.8861,
        "anomaly": -0.9253
      },
      {
        "year": 2013,
        "value": 28.6342,
        "ols_fitted": 28.8802,
        "sen_fitted": 28.8922,
        "anomaly": -0.2144
      },
      {
        "year": 2014,
        "value": 28.7508,
        "ols_fitted": 28.8833,
        "sen_fitted": 28.8982,
        "anomaly": -0.0978
      },
      {
        "year": 2015,
        "value": 28.7225,
        "ols_fitted": 28.8865,
        "sen_fitted": 28.9043,
        "anomaly": -0.1261
      },
      {
        "year": 2016,
        "value": 29.9767,
        "ols_fitted": 28.8897,
        "sen_fitted": 28.9103,
        "anomaly": 1.1281
      },
      {
        "year": 2017,
        "value": 29.28,
        "ols_fitted": 28.8928,
        "sen_fitted": 28.9164,
        "anomaly": 0.4314
      },
      {
        "year": 2018,
        "value": 29.5533,
        "ols_fitted": 28.896,
        "sen_fitted": 28.9224,
        "anomaly": 0.7047
      },
      {
        "year": 2019,
        "value": 28.375,
        "ols_fitted": 28.8992,
        "sen_fitted": 28.9285,
        "anomaly": -0.4736
      },
      {
        "year": 2020,
        "value": 27.245,
        "ols_fitted": 28.9023,
        "sen_fitted": 28.9345,
        "anomaly": -1.6036
      },
      {
        "year": 2021,
        "value": 29.3558,
        "ols_fitted": 28.9055,
        "sen_fitted": 28.9406,
        "anomaly": 0.5072
      },
      {
        "year": 2022,
        "value": 27.605,
        "ols_fitted": 28.9086,
        "sen_fitted": 28.9466,
        "anomaly": -1.2436
      },
      {
        "year": 2023,
        "value": 28.5458,
        "ols_fitted": 28.9118,
        "sen_fitted": 28.9527,
        "anomaly": -0.3028
      },
      {
        "year": 2024,
        "value": 28.4358,
        "ols_fitted": 28.915,
        "sen_fitted": 28.9587,
        "anomaly": -0.4128
      },
      {
        "year": 2025,
        "value": 29.5992,
        "ols_fitted": 28.9181,
        "sen_fitted": 28.9648,
        "anomaly": 0.7506
      }
    ],
    "stats": {
      "n_years": 45,
      "mean_value": 28.8486,
      "std_dev": 0.6351,
      "ols_slope_per_year": 0.00316,
      "ols_slope_per_decade": 0.0316,
      "ols_r_squared": 0.0043,
      "ols_p_value": 0.66952,
      "ols_ci_lower_decade": -0.1168,
      "ols_ci_upper_decade": 0.18,
      "mk_tau": 0.091,
      "mk_z_score": 0.871,
      "mk_p_value": 0.37859,
      "sen_slope_per_decade": 0.0605,
      "sen_ci_lower_decade": -0.0929,
      "sen_ci_upper_decade": 0.2177,
      "lag1_autocorrelation": 0.062,
      "badge": "INCREASING_NOT_SIGNIFICANT",
      "caveats": [
        "Observed direction is upward, but p = 0.379 does not cross the \u03b1 = 0.05 significance threshold due to interannual variability."
      ]
    }
  },
  "region_b": {
    "region": {
      "id": "B",
      "name": "Karachi (Arabian Sea Coast)",
      "lat": 24.86,
      "lon": 67.01
    },
    "series": [
      {
        "year": 1981,
        "value": 25.9058,
        "ols_fitted": 25.8075,
        "sen_fitted": 25.7744,
        "anomaly": -0.1554
      },
      {
        "year": 1982,
        "value": 25.8992,
        "ols_fitted": 25.819,
        "sen_fitted": 25.7873,
        "anomaly": -0.162
      },
      {
        "year": 1983,
        "value": 25.4942,
        "ols_fitted": 25.8306,
        "sen_fitted": 25.8001,
        "anomaly": -0.567
      },
      {
        "year": 1984,
        "value": 25.5183,
        "ols_fitted": 25.8421,
        "sen_fitted": 25.8129,
        "anomaly": -0.5429
      },
      {
        "year": 1985,
        "value": 25.5317,
        "ols_fitted": 25.8536,
        "sen_fitted": 25.8257,
        "anomaly": -0.5295
      },
      {
        "year": 1986,
        "value": 25.3808,
        "ols_fitted": 25.8652,
        "sen_fitted": 25.8386,
        "anomaly": -0.6804
      },
      {
        "year": 1987,
        "value": 25.8992,
        "ols_fitted": 25.8767,
        "sen_fitted": 25.8514,
        "anomaly": -0.162
      },
      {
        "year": 1988,
        "value": 26.6008,
        "ols_fitted": 25.8882,
        "sen_fitted": 25.8642,
        "anomaly": 0.5396
      },
      {
        "year": 1989,
        "value": 25.88,
        "ols_fitted": 25.8998,
        "sen_fitted": 25.8771,
        "anomaly": -0.1812
      },
      {
        "year": 1990,
        "value": 26.0567,
        "ols_fitted": 25.9113,
        "sen_fitted": 25.8899,
        "anomaly": -0.0045
      },
      {
        "year": 1991,
        "value": 25.7267,
        "ols_fitted": 25.9228,
        "sen_fitted": 25.9027,
        "anomaly": -0.3345
      },
      {
        "year": 1992,
        "value": 25.8858,
        "ols_fitted": 25.9343,
        "sen_fitted": 25.9156,
        "anomaly": -0.1754
      },
      {
        "year": 1993,
        "value": 26.425,
        "ols_fitted": 25.9459,
        "sen_fitted": 25.9284,
        "anomaly": 0.3638
      },
      {
        "year": 1994,
        "value": 26.0992,
        "ols_fitted": 25.9574,
        "sen_fitted": 25.9412,
        "anomaly": 0.038
      },
      {
        "year": 1995,
        "value": 26.01,
        "ols_fitted": 25.9689,
        "sen_fitted": 25.9541,
        "anomaly": -0.0512
      },
      {
        "year": 1996,
        "value": 25.73,
        "ols_fitted": 25.9805,
        "sen_fitted": 25.9669,
        "anomaly": -0.3312
      },
      {
        "year": 1997,
        "value": 25.67,
        "ols_fitted": 25.992,
        "sen_fitted": 25.9797,
        "anomaly": -0.3912
      },
      {
        "year": 1998,
        "value": 26.6708,
        "ols_fitted": 26.0035,
        "sen_fitted": 25.9925,
        "anomaly": 0.6096
      },
      {
        "year": 1999,
        "value": 26.4417,
        "ols_fitted": 26.0151,
        "sen_fitted": 26.0054,
        "anomaly": 0.3805
      },
      {
        "year": 2000,
        "value": 26.0842,
        "ols_fitted": 26.0266,
        "sen_fitted": 26.0182,
        "anomaly": 0.023
      },
      {
        "year": 2001,
        "value": 26.2383,
        "ols_fitted": 26.0381,
        "sen_fitted": 26.031,
        "anomaly": 0.1771
      },
      {
        "year": 2002,
        "value": 25.9517,
        "ols_fitted": 26.0497,
        "sen_fitted": 26.0439,
        "anomaly": -0.1095
      },
      {
        "year": 2003,
        "value": 26.1292,
        "ols_fitted": 26.0612,
        "sen_fitted": 26.0567,
        "anomaly": 0.068
      },
      {
        "year": 2004,
        "value": 26.2417,
        "ols_fitted": 26.0727,
        "sen_fitted": 26.0695,
        "anomaly": 0.1805
      },
      {
        "year": 2005,
        "value": 25.9442,
        "ols_fitted": 26.0843,
        "sen_fitted": 26.0824,
        "anomaly": -0.117
      },
      {
        "year": 2006,
        "value": 25.8258,
        "ols_fitted": 26.0958,
        "sen_fitted": 26.0952,
        "anomaly": -0.2354
      },
      {
        "year": 2007,
        "value": 26.245,
        "ols_fitted": 26.1073,
        "sen_fitted": 26.108,
        "anomaly": 0.1838
      },
      {
        "year": 2008,
        "value": 25.6333,
        "ols_fitted": 26.1189,
        "sen_fitted": 26.1209,
        "anomaly": -0.4279
      },
      {
        "year": 2009,
        "value": 26.3917,
        "ols_fitted": 26.1304,
        "sen_fitted": 26.1337,
        "anomaly": 0.3305
      },
      {
        "year": 2010,
        "value": 26.3033,
        "ols_fitted": 26.1419,
        "sen_fitted": 26.1465,
        "anomaly": 0.2421
      },
      {
        "year": 2011,
        "value": 26.0,
        "ols_fitted": 26.1535,
        "sen_fitted": 26.1593,
        "anomaly": -0.0612
      },
      {
        "year": 2012,
        "value": 25.6708,
        "ols_fitted": 26.165,
        "sen_fitted": 26.1722,
        "anomaly": -0.3904
      },
      {
        "year": 2013,
        "value": 26.1117,
        "ols_fitted": 26.1765,
        "sen_fitted": 26.185,
        "anomaly": 0.0505
      },
      {
        "year": 2014,
        "value": 26.0892,
        "ols_fitted": 26.1881,
        "sen_fitted": 26.1978,
        "anomaly": 0.028
      },
      {
        "year": 2015,
        "value": 26.4842,
        "ols_fitted": 26.1996,
        "sen_fitted": 26.2107,
        "anomaly": 0.423
      },
      {
        "year": 2016,
        "value": 26.51,
        "ols_fitted": 26.2111,
        "sen_fitted": 26.2235,
        "anomaly": 0.4488
      },
      {
        "year": 2017,
        "value": 26.11,
        "ols_fitted": 26.2227,
        "sen_fitted": 26.2363,
        "anomaly": 0.0488
      },
      {
        "year": 2018,
        "value": 26.54,
        "ols_fitted": 26.2342,
        "sen_fitted": 26.2492,
        "anomaly": 0.4788
      },
      {
        "year": 2019,
        "value": 25.8992,
        "ols_fitted": 26.2457,
        "sen_fitted": 26.262,
        "anomaly": -0.162
      },
      {
        "year": 2020,
        "value": 25.8675,
        "ols_fitted": 26.2573,
        "sen_fitted": 26.2748,
        "anomaly": -0.1937
      },
      {
        "year": 2021,
        "value": 26.4025,
        "ols_fitted": 26.2688,
        "sen_fitted": 26.2877,
        "anomaly": 0.3413
      },
      {
        "year": 2022,
        "value": 25.9608,
        "ols_fitted": 26.2803,
        "sen_fitted": 26.3005,
        "anomaly": -0.1004
      },
      {
        "year": 2023,
        "value": 26.3817,
        "ols_fitted": 26.2919,
        "sen_fitted": 26.3133,
        "anomaly": 0.3205
      },
      {
        "year": 2024,
        "value": 26.5925,
        "ols_fitted": 26.3034,
        "sen_fitted": 26.3261,
        "anomaly": 0.5313
      },
      {
        "year": 2025,
        "value": 26.32,
        "ols_fitted": 26.3149,
        "sen_fitted": 26.339,
        "anomaly": 0.2588
      }
    ],
    "stats": {
      "n_years": 45,
      "mean_value": 26.0612,
      "std_dev": 0.3292,
      "ols_slope_per_year": 0.01153,
      "ols_slope_per_decade": 0.1153,
      "ols_r_squared": 0.2118,
      "ols_p_value": 0.00147,
      "ols_ci_lower_decade": 0.0469,
      "ols_ci_upper_decade": 0.1838,
      "mk_tau": 0.3166,
      "mk_z_score": 3.052,
      "mk_p_value": 0.0022,
      "sen_slope_per_decade": 0.1283,
      "sen_ci_lower_decade": 0.0517,
      "sen_ci_upper_decade": 0.1879,
      "lag1_autocorrelation": 0.098,
      "badge": "INCREASING_SIGNIFICANT",
      "caveats": []
    }
  },
  "divergence_detected": true,
  "ai_interpretation": {
    "headline": "Regional Divergence Confirmed: Jacobabad (Inland Thermal Pole) and Karachi (Arabian Sea Coast) exhibit contrasting Surface Air Temperature (2 Meters) trajectories (1981\u20132025).",
    "what_is_changing": "Jacobabad (Inland Thermal Pole) (28.28\u00b0N, 68.44\u00b0E) shows an increasing linear rate of +0.0316 \u00b0C/decade (Sen's robust slope: +0.0605 \u00b0C/decade; 95% CI [-0.1168, 0.1800]), which is not statistically significant at \u03b1 = 0.05 (Mann\u2013Kendall p = 0.379, \u03c4 = 0.09).",
    "where_it_diverges": "Karachi (Arabian Sea Coast) (24.86\u00b0N, 67.01\u00b0E) shows an increasing linear rate of +0.1153 \u00b0C/decade (Sen's robust slope: +0.1283 \u00b0C/decade; 95% CI [0.0469, 0.1838]), which is statistically significant (Mann\u2013Kendall p = 0.0022, \u03c4 = 0.32). Comparing both regions side by side demonstrates why global or national averages can mask localized environmental shifts.",
    "statistical_verdict": "Both parametric (Ordinary Least Squares) and non-parametric (Mann\u2013Kendall / Theil\u2013Sen) tests confirm a statistically detectable signal (p < 0.05) over the 45-year NASA record.",
    "limitations_and_caveats": "Observed direction is upward, but p = 0.379 does not cross the \u03b1 = 0.05 significance threshold due to interannual variability.",
    "generated_by": "deterministic_scientific_engine"
  }
},
  'aral-sea': {
  "investigation_id": "aral-sea",
  "variable_id": "GWETROOT",
  "variable_name": "Root-Zone Soil Moisture Wetness",
  "units": "fraction (0-1)",
  "plain_definition": "Fraction of water filling soil pores in the top 100 cm root zone (0 = completely dry soil, 1 = fully saturated soil).",
  "aggregation_mode": "annual",
  "start_year": 1981,
  "end_year": 2025,
  "provenance": {
    "source_name": "NASA POWER / MERRA-2",
    "mission_model": "NASA GLDAS / MERRA-2 Land Surface Model",
    "api_endpoint": "https://power.larc.nasa.gov/api/temporal/monthly/point",
    "spatial_resolution": "0.5\u00b0 x 0.625\u00b0 (MERRA-2 Grid)",
    "missing_months_filtered": 0,
    "retrieved_at_utc": "2026-11-14T17:09:45.178119+00:00",
    "verification_links": [
      {
        "label": "NASA Giovanni",
        "url": "https://giovanni.gsfc.nasa.gov/giovanni/"
      },
      {
        "label": "NASA Earthdata",
        "url": "https://www.earthdata.nasa.gov/data/catalog/ges-disc-gldas-noah10-m-2.1"
      },
      {
        "label": "CUAHSI HydroClient",
        "url": "https://data.cuahsi.org/"
      },
      {
        "label": "NASA Worldview",
        "url": "https://worldview.earthdata.nasa.gov/"
      }
    ]
  },
  "region_a": {
    "region": {
      "id": "A",
      "name": "Aral Sea Basin (Desiccated Bed)",
      "lat": 45.0,
      "lon": 59.5
    },
    "series": [
      {
        "year": 1981,
        "value": 0.58,
        "ols_fitted": 0.4825,
        "sen_fitted": 0.4726,
        "anomaly": 0.0959
      },
      {
        "year": 1982,
        "value": 0.5017,
        "ols_fitted": 0.4826,
        "sen_fitted": 0.4728,
        "anomaly": 0.0176
      },
      {
        "year": 1983,
        "value": 0.4675,
        "ols_fitted": 0.4827,
        "sen_fitted": 0.4731,
        "anomaly": -0.0166
      },
      {
        "year": 1984,
        "value": 0.4708,
        "ols_fitted": 0.4827,
        "sen_fitted": 0.4733,
        "anomaly": -0.0133
      },
      {
        "year": 1985,
        "value": 0.4833,
        "ols_fitted": 0.4828,
        "sen_fitted": 0.4735,
        "anomaly": -0.0008
      },
      {
        "year": 1986,
        "value": 0.475,
        "ols_fitted": 0.4829,
        "sen_fitted": 0.4737,
        "anomaly": -0.0091
      },
      {
        "year": 1987,
        "value": 0.51,
        "ols_fitted": 0.4829,
        "sen_fitted": 0.474,
        "anomaly": 0.0259
      },
      {
        "year": 1988,
        "value": 0.4717,
        "ols_fitted": 0.483,
        "sen_fitted": 0.4742,
        "anomaly": -0.0124
      },
      {
        "year": 1989,
        "value": 0.4833,
        "ols_fitted": 0.4831,
        "sen_fitted": 0.4744,
        "anomaly": -0.0008
      },
      {
        "year": 1990,
        "value": 0.4717,
        "ols_fitted": 0.4832,
        "sen_fitted": 0.4746,
        "anomaly": -0.0124
      },
      {
        "year": 1991,
        "value": 0.48,
        "ols_fitted": 0.4832,
        "sen_fitted": 0.4748,
        "anomaly": -0.0041
      },
      {
        "year": 1992,
        "value": 0.4775,
        "ols_fitted": 0.4833,
        "sen_fitted": 0.4751,
        "anomaly": -0.0066
      },
      {
        "year": 1993,
        "value": 0.4775,
        "ols_fitted": 0.4834,
        "sen_fitted": 0.4753,
        "anomaly": -0.0066
      },
      {
        "year": 1994,
        "value": 0.4725,
        "ols_fitted": 0.4835,
        "sen_fitted": 0.4755,
        "anomaly": -0.0116
      },
      {
        "year": 1995,
        "value": 0.4758,
        "ols_fitted": 0.4835,
        "sen_fitted": 0.4757,
        "anomaly": -0.0083
      },
      {
        "year": 1996,
        "value": 0.4683,
        "ols_fitted": 0.4836,
        "sen_fitted": 0.4759,
        "anomaly": -0.0158
      },
      {
        "year": 1997,
        "value": 0.47,
        "ols_fitted": 0.4837,
        "sen_fitted": 0.4762,
        "anomaly": -0.0141
      },
      {
        "year": 1998,
        "value": 0.4675,
        "ols_fitted": 0.4837,
        "sen_fitted": 0.4764,
        "anomaly": -0.0166
      },
      {
        "year": 1999,
        "value": 0.4683,
        "ols_fitted": 0.4838,
        "sen_fitted": 0.4766,
        "anomaly": -0.0158
      },
      {
        "year": 2000,
        "value": 0.465,
        "ols_fitted": 0.4839,
        "sen_fitted": 0.4768,
        "anomaly": -0.0191
      },
      {
        "year": 2001,
        "value": 0.4692,
        "ols_fitted": 0.484,
        "sen_fitted": 0.4771,
        "anomaly": -0.0149
      },
      {
        "year": 2002,
        "value": 0.4783,
        "ols_fitted": 0.484,
        "sen_fitted": 0.4773,
        "anomaly": -0.0058
      },
      {
        "year": 2003,
        "value": 0.4767,
        "ols_fitted": 0.4841,
        "sen_fitted": 0.4775,
        "anomaly": -0.0074
      },
      {
        "year": 2004,
        "value": 0.48,
        "ols_fitted": 0.4842,
        "sen_fitted": 0.4777,
        "anomaly": -0.0041
      },
      {
        "year": 2005,
        "value": 0.4767,
        "ols_fitted": 0.4842,
        "sen_fitted": 0.4779,
        "anomaly": -0.0074
      },
      {
        "year": 2006,
        "value": 0.485,
        "ols_fitted": 0.4843,
        "sen_fitted": 0.4782,
        "anomaly": 0.0009
      },
      {
        "year": 2007,
        "value": 0.4933,
        "ols_fitted": 0.4844,
        "sen_fitted": 0.4784,
        "anomaly": 0.0092
      },
      {
        "year": 2008,
        "value": 0.47,
        "ols_fitted": 0.4845,
        "sen_fitted": 0.4786,
        "anomaly": -0.0141
      },
      {
        "year": 2009,
        "value": 0.4758,
        "ols_fitted": 0.4845,
        "sen_fitted": 0.4788,
        "anomaly": -0.0083
      },
      {
        "year": 2010,
        "value": 0.4967,
        "ols_fitted": 0.4846,
        "sen_fitted": 0.4791,
        "anomaly": 0.0126
      },
      {
        "year": 2011,
        "value": 0.4708,
        "ols_fitted": 0.4847,
        "sen_fitted": 0.4793,
        "anomaly": -0.0133
      },
      {
        "year": 2012,
        "value": 0.4783,
        "ols_fitted": 0.4848,
        "sen_fitted": 0.4795,
        "anomaly": -0.0058
      },
      {
        "year": 2013,
        "value": 0.4775,
        "ols_fitted": 0.4848,
        "sen_fitted": 0.4797,
        "anomaly": -0.0066
      },
      {
        "year": 2014,
        "value": 0.4758,
        "ols_fitted": 0.4849,
        "sen_fitted": 0.4799,
        "anomaly": -0.0083
      },
      {
        "year": 2015,
        "value": 0.5042,
        "ols_fitted": 0.485,
        "sen_fitted": 0.4802,
        "anomaly": 0.0201
      },
      {
        "year": 2016,
        "value": 0.5225,
        "ols_fitted": 0.485,
        "sen_fitted": 0.4804,
        "anomaly": 0.0384
      },
      {
        "year": 2017,
        "value": 0.5,
        "ols_fitted": 0.4851,
        "sen_fitted": 0.4806,
        "anomaly": 0.0159
      },
      {
        "year": 2018,
        "value": 0.495,
        "ols_fitted": 0.4852,
        "sen_fitted": 0.4808,
        "anomaly": 0.0109
      },
      {
        "year": 2019,
        "value": 0.4858,
        "ols_fitted": 0.4853,
        "sen_fitted": 0.481,
        "anomaly": 0.0017
      },
      {
        "year": 2020,
        "value": 0.4783,
        "ols_fitted": 0.4853,
        "sen_fitted": 0.4813,
        "anomaly": -0.0058
      },
      {
        "year": 2021,
        "value": 0.4683,
        "ols_fitted": 0.4854,
        "sen_fitted": 0.4815,
        "anomaly": -0.0158
      },
      {
        "year": 2022,
        "value": 0.4833,
        "ols_fitted": 0.4855,
        "sen_fitted": 0.4817,
        "anomaly": -0.0008
      },
      {
        "year": 2023,
        "value": 0.4933,
        "ols_fitted": 0.4856,
        "sen_fitted": 0.4819,
        "anomaly": 0.0092
      },
      {
        "year": 2024,
        "value": 0.5308,
        "ols_fitted": 0.4856,
        "sen_fitted": 0.4822,
        "anomaly": 0.0467
      },
      {
        "year": 2025,
        "value": 0.4817,
        "ols_fitted": 0.4857,
        "sen_fitted": 0.4824,
        "anomaly": -0.0024
      }
    ],
    "stats": {
      "n_years": 45,
      "mean_value": 0.4841,
      "std_dev": 0.0206,
      "ols_slope_per_year": 7e-05,
      "ols_slope_per_decade": 0.0007,
      "ols_r_squared": 0.0021,
      "ols_p_value": 0.76272,
      "ols_ci_lower_decade": -0.0041,
      "ols_ci_upper_decade": 0.0055,
      "mk_tau": 0.1818,
      "mk_z_score": 1.731,
      "mk_p_value": 0.08127,
      "sen_slope_per_decade": 0.0022,
      "sen_ci_lower_decade": -0.0003,
      "sen_ci_upper_decade": 0.0051,
      "lag1_autocorrelation": 0.35,
      "badge": "INCREASING_NOT_SIGNIFICANT",
      "caveats": [
        "Moderate lag-1 serial autocorrelation detected (r1 = 0.35); effective degrees of freedom may be lower than sample count.",
        "Observed direction is upward, but p = 0.081 does not cross the \u03b1 = 0.05 significance threshold due to interannual variability."
      ]
    }
  },
  "region_b": {
    "region": {
      "id": "B",
      "name": "Tien Shan Mountains (Glacial Headwaters)",
      "lat": 42.0,
      "lon": 75.0
    },
    "series": [
      {
        "year": 1981,
        "value": 0.5533,
        "ols_fitted": 0.5137,
        "sen_fitted": 0.5082,
        "anomaly": 0.0282
      },
      {
        "year": 1982,
        "value": 0.5158,
        "ols_fitted": 0.5142,
        "sen_fitted": 0.5087,
        "anomaly": -0.0093
      },
      {
        "year": 1983,
        "value": 0.5183,
        "ols_fitted": 0.5147,
        "sen_fitted": 0.5093,
        "anomaly": -0.0068
      },
      {
        "year": 1984,
        "value": 0.5025,
        "ols_fitted": 0.5153,
        "sen_fitted": 0.5098,
        "anomaly": -0.0226
      },
      {
        "year": 1985,
        "value": 0.52,
        "ols_fitted": 0.5158,
        "sen_fitted": 0.5103,
        "anomaly": -0.0051
      },
      {
        "year": 1986,
        "value": 0.5042,
        "ols_fitted": 0.5163,
        "sen_fitted": 0.5109,
        "anomaly": -0.0209
      },
      {
        "year": 1987,
        "value": 0.5383,
        "ols_fitted": 0.5168,
        "sen_fitted": 0.5114,
        "anomaly": 0.0132
      },
      {
        "year": 1988,
        "value": 0.52,
        "ols_fitted": 0.5173,
        "sen_fitted": 0.5119,
        "anomaly": -0.0051
      },
      {
        "year": 1989,
        "value": 0.4867,
        "ols_fitted": 0.5179,
        "sen_fitted": 0.5125,
        "anomaly": -0.0384
      },
      {
        "year": 1990,
        "value": 0.5083,
        "ols_fitted": 0.5184,
        "sen_fitted": 0.513,
        "anomaly": -0.0168
      },
      {
        "year": 1991,
        "value": 0.5008,
        "ols_fitted": 0.5189,
        "sen_fitted": 0.5136,
        "anomaly": -0.0243
      },
      {
        "year": 1992,
        "value": 0.4942,
        "ols_fitted": 0.5194,
        "sen_fitted": 0.5141,
        "anomaly": -0.0309
      },
      {
        "year": 1993,
        "value": 0.5108,
        "ols_fitted": 0.5199,
        "sen_fitted": 0.5146,
        "anomaly": -0.0143
      },
      {
        "year": 1994,
        "value": 0.5192,
        "ols_fitted": 0.5204,
        "sen_fitted": 0.5152,
        "anomaly": -0.0059
      },
      {
        "year": 1995,
        "value": 0.5042,
        "ols_fitted": 0.521,
        "sen_fitted": 0.5157,
        "anomaly": -0.0209
      },
      {
        "year": 1996,
        "value": 0.4992,
        "ols_fitted": 0.5215,
        "sen_fitted": 0.5162,
        "anomaly": -0.0259
      },
      {
        "year": 1997,
        "value": 0.485,
        "ols_fitted": 0.522,
        "sen_fitted": 0.5168,
        "anomaly": -0.0401
      },
      {
        "year": 1998,
        "value": 0.505,
        "ols_fitted": 0.5225,
        "sen_fitted": 0.5173,
        "anomaly": -0.0201
      },
      {
        "year": 1999,
        "value": 0.5083,
        "ols_fitted": 0.523,
        "sen_fitted": 0.5179,
        "anomaly": -0.0168
      },
      {
        "year": 2000,
        "value": 0.5317,
        "ols_fitted": 0.5236,
        "sen_fitted": 0.5184,
        "anomaly": 0.0066
      },
      {
        "year": 2001,
        "value": 0.5475,
        "ols_fitted": 0.5241,
        "sen_fitted": 0.5189,
        "anomaly": 0.0224
      },
      {
        "year": 2002,
        "value": 0.5592,
        "ols_fitted": 0.5246,
        "sen_fitted": 0.5195,
        "anomaly": 0.0341
      },
      {
        "year": 2003,
        "value": 0.5517,
        "ols_fitted": 0.5251,
        "sen_fitted": 0.52,
        "anomaly": 0.0266
      },
      {
        "year": 2004,
        "value": 0.5558,
        "ols_fitted": 0.5256,
        "sen_fitted": 0.5205,
        "anomaly": 0.0307
      },
      {
        "year": 2005,
        "value": 0.55,
        "ols_fitted": 0.5262,
        "sen_fitted": 0.5211,
        "anomaly": 0.0249
      },
      {
        "year": 2006,
        "value": 0.5267,
        "ols_fitted": 0.5267,
        "sen_fitted": 0.5216,
        "anomaly": 0.0016
      },
      {
        "year": 2007,
        "value": 0.5142,
        "ols_fitted": 0.5272,
        "sen_fitted": 0.5221,
        "anomaly": -0.0109
      },
      {
        "year": 2008,
        "value": 0.5067,
        "ols_fitted": 0.5277,
        "sen_fitted": 0.5227,
        "anomaly": -0.0184
      },
      {
        "year": 2009,
        "value": 0.5667,
        "ols_fitted": 0.5282,
        "sen_fitted": 0.5232,
        "anomaly": 0.0416
      },
      {
        "year": 2010,
        "value": 0.5692,
        "ols_fitted": 0.5287,
        "sen_fitted": 0.5238,
        "anomaly": 0.0441
      },
      {
        "year": 2011,
        "value": 0.5475,
        "ols_fitted": 0.5293,
        "sen_fitted": 0.5243,
        "anomaly": 0.0224
      },
      {
        "year": 2012,
        "value": 0.52,
        "ols_fitted": 0.5298,
        "sen_fitted": 0.5248,
        "anomaly": -0.0051
      },
      {
        "year": 2013,
        "value": 0.5242,
        "ols_fitted": 0.5303,
        "sen_fitted": 0.5254,
        "anomaly": -0.0009
      },
      {
        "year": 2014,
        "value": 0.4842,
        "ols_fitted": 0.5308,
        "sen_fitted": 0.5259,
        "anomaly": -0.0409
      },
      {
        "year": 2015,
        "value": 0.5533,
        "ols_fitted": 0.5313,
        "sen_fitted": 0.5264,
        "anomaly": 0.0282
      },
      {
        "year": 2016,
        "value": 0.5842,
        "ols_fitted": 0.5319,
        "sen_fitted": 0.527,
        "anomaly": 0.0591
      },
      {
        "year": 2017,
        "value": 0.5583,
        "ols_fitted": 0.5324,
        "sen_fitted": 0.5275,
        "anomaly": 0.0332
      },
      {
        "year": 2018,
        "value": 0.5208,
        "ols_fitted": 0.5329,
        "sen_fitted": 0.5281,
        "anomaly": -0.0043
      },
      {
        "year": 2019,
        "value": 0.55,
        "ols_fitted": 0.5334,
        "sen_fitted": 0.5286,
        "anomaly": 0.0249
      },
      {
        "year": 2020,
        "value": 0.5242,
        "ols_fitted": 0.5339,
        "sen_fitted": 0.5291,
        "anomaly": -0.0009
      },
      {
        "year": 2021,
        "value": 0.5108,
        "ols_fitted": 0.5344,
        "sen_fitted": 0.5297,
        "anomaly": -0.0143
      },
      {
        "year": 2022,
        "value": 0.5633,
        "ols_fitted": 0.535,
        "sen_fitted": 0.5302,
        "anomaly": 0.0382
      },
      {
        "year": 2023,
        "value": 0.5275,
        "ols_fitted": 0.5355,
        "sen_fitted": 0.5307,
        "anomaly": 0.0024
      },
      {
        "year": 2024,
        "value": 0.5108,
        "ols_fitted": 0.536,
        "sen_fitted": 0.5313,
        "anomaly": -0.0143
      },
      {
        "year": 2025,
        "value": 0.4775,
        "ols_fitted": 0.5365,
        "sen_fitted": 0.5318,
        "anomaly": -0.0476
      }
    ],
    "stats": {
      "n_years": 45,
      "mean_value": 0.5251,
      "std_dev": 0.0259,
      "ols_slope_per_year": 0.00052,
      "ols_slope_per_decade": 0.0052,
      "ols_r_squared": 0.0691,
      "ols_p_value": 0.08102,
      "ols_ci_lower_decade": -0.0007,
      "ols_ci_upper_decade": 0.011,
      "mk_tau": 0.1992,
      "mk_z_score": 1.908,
      "mk_p_value": 0.05504,
      "sen_slope_per_decade": 0.0054,
      "sen_ci_lower_decade": -0.0,
      "sen_ci_upper_decade": 0.0114,
      "lag1_autocorrelation": 0.405,
      "badge": "INCREASING_NOT_SIGNIFICANT",
      "caveats": [
        "Moderate lag-1 serial autocorrelation detected (r1 = 0.41); effective degrees of freedom may be lower than sample count.",
        "Observed direction is upward, but p = 0.055 does not cross the \u03b1 = 0.05 significance threshold due to interannual variability."
      ]
    }
  },
  "divergence_detected": false,
  "ai_interpretation": {
    "headline": "Root-Zone Soil Moisture Wetness Trend Assessment for Aral Sea Basin (Desiccated Bed) (1981\u20132025): INCREASING NOT SIGNIFICANT.",
    "what_is_changing": "Aral Sea Basin (Desiccated Bed) (45.0\u00b0N, 59.5\u00b0E) shows an increasing linear rate of +0.0007 fraction (0-1)/decade (Sen's robust slope: +0.0022 fraction (0-1)/decade; 95% CI [-0.0041, 0.0055]), which is not statistically significant at \u03b1 = 0.05 (Mann\u2013Kendall p = 0.081, \u03c4 = 0.18).",
    "where_it_diverges": "Tien Shan Mountains (Glacial Headwaters) (42.0\u00b0N, 75.0\u00b0E) shows an increasing linear rate of +0.0052 fraction (0-1)/decade (Sen's robust slope: +0.0054 fraction (0-1)/decade; 95% CI [-0.0007, 0.0110]), which is not statistically significant at \u03b1 = 0.05 (Mann\u2013Kendall p = 0.055, \u03c4 = 0.20). Comparing both regions side by side demonstrates why global or national averages can mask localized environmental shifts.",
    "statistical_verdict": "While the fitted slope shows a directional drift, year-to-year climate variability currently exceeds the long-term signal (p \u2265 0.05). Per NASA Earth science guidelines, a non-significant trend may require seasonal isolation (e.g., Monsoon JJAS) or a longer observation window.",
    "limitations_and_caveats": "Moderate lag-1 serial autocorrelation detected (r1 = 0.35); effective degrees of freedom may be lower than sample count. Observed direction is upward, but p = 0.081 does not cross the \u03b1 = 0.05 significance threshold due to interannual variability. Moderate lag-1 serial autocorrelation detected (r1 = 0.41); effective degrees of freedom may be lower than sample count. Observed direction is upward, but p = 0.055 does not cross the \u03b1 = 0.05 significance threshold due to interannual variability.",
    "generated_by": "deterministic_scientific_engine"
  }
},
  'amazon-drying': {
  "investigation_id": "amazon-drying",
  "variable_id": "PRECTOTCORR",
  "variable_name": "Bias-Corrected Total Precipitation",
  "units": "mm/day",
  "plain_definition": "Average daily rain and melted snow reaching the surface, bias-corrected with satellite and gauge observations.",
  "aggregation_mode": "annual",
  "start_year": 1981,
  "end_year": 2025,
  "provenance": {
    "source_name": "NASA POWER / MERRA-2",
    "mission_model": "NASA MERRA-2 / GPM IMERG Assimilation",
    "api_endpoint": "https://power.larc.nasa.gov/api/temporal/monthly/point",
    "spatial_resolution": "0.5\u00b0 x 0.625\u00b0 (MERRA-2 Grid)",
    "missing_months_filtered": 0,
    "retrieved_at_utc": "2026-11-14T17:09:46.849616+00:00",
    "verification_links": [
      {
        "label": "NASA Giovanni",
        "url": "https://giovanni.gsfc.nasa.gov/giovanni/"
      },
      {
        "label": "NASA Earthdata",
        "url": "https://www.earthdata.nasa.gov/data/platforms/space-based-platforms/gpm"
      },
      {
        "label": "CUAHSI HydroClient",
        "url": "https://data.cuahsi.org/"
      },
      {
        "label": "NASA Worldview",
        "url": "https://worldview.earthdata.nasa.gov/"
      }
    ]
  },
  "region_a": {
    "region": {
      "id": "A",
      "name": "Mato Grosso (Arc of Deforestation)",
      "lat": -12.5,
      "lon": -55.5
    },
    "series": [
      {
        "year": 1981,
        "value": 4.9592,
        "ols_fitted": 5.3747,
        "sen_fitted": 5.2229,
        "anomaly": 0.4536
      },
      {
        "year": 1982,
        "value": 5.9567,
        "ols_fitted": 5.3352,
        "sen_fitted": 5.1893,
        "anomaly": 1.4511
      },
      {
        "year": 1983,
        "value": 4.445,
        "ols_fitted": 5.2957,
        "sen_fitted": 5.1556,
        "anomaly": -0.0606
      },
      {
        "year": 1984,
        "value": 3.8833,
        "ols_fitted": 5.2562,
        "sen_fitted": 5.122,
        "anomaly": -0.6223
      },
      {
        "year": 1985,
        "value": 4.8217,
        "ols_fitted": 5.2167,
        "sen_fitted": 5.0883,
        "anomaly": 0.3161
      },
      {
        "year": 1986,
        "value": 4.5217,
        "ols_fitted": 5.1772,
        "sen_fitted": 5.0547,
        "anomaly": 0.0161
      },
      {
        "year": 1987,
        "value": 4.4825,
        "ols_fitted": 5.1377,
        "sen_fitted": 5.021,
        "anomaly": -0.0231
      },
      {
        "year": 1988,
        "value": 5.08,
        "ols_fitted": 5.0982,
        "sen_fitted": 4.9873,
        "anomaly": 0.5744
      },
      {
        "year": 1989,
        "value": 5.0558,
        "ols_fitted": 5.0587,
        "sen_fitted": 4.9537,
        "anomaly": 0.5502
      },
      {
        "year": 1990,
        "value": 5.2667,
        "ols_fitted": 5.0192,
        "sen_fitted": 4.92,
        "anomaly": 0.7611
      },
      {
        "year": 1991,
        "value": 5.7183,
        "ols_fitted": 4.9797,
        "sen_fitted": 4.8864,
        "anomaly": 1.2127
      },
      {
        "year": 1992,
        "value": 6.6125,
        "ols_fitted": 4.9402,
        "sen_fitted": 4.8527,
        "anomaly": 2.1069
      },
      {
        "year": 1993,
        "value": 4.7367,
        "ols_fitted": 4.9007,
        "sen_fitted": 4.8191,
        "anomaly": 0.2311
      },
      {
        "year": 1994,
        "value": 6.08,
        "ols_fitted": 4.8612,
        "sen_fitted": 4.7854,
        "anomaly": 1.5744
      },
      {
        "year": 1995,
        "value": 5.6233,
        "ols_fitted": 4.8217,
        "sen_fitted": 4.7518,
        "anomaly": 1.1177
      },
      {
        "year": 1996,
        "value": 4.3192,
        "ols_fitted": 4.7821,
        "sen_fitted": 4.7181,
        "anomaly": -0.1864
      },
      {
        "year": 1997,
        "value": 4.4358,
        "ols_fitted": 4.7426,
        "sen_fitted": 4.6844,
        "anomaly": -0.0698
      },
      {
        "year": 1998,
        "value": 4.315,
        "ols_fitted": 4.7031,
        "sen_fitted": 4.6508,
        "anomaly": -0.1906
      },
      {
        "year": 1999,
        "value": 4.3025,
        "ols_fitted": 4.6636,
        "sen_fitted": 4.6171,
        "anomaly": -0.2031
      },
      {
        "year": 2000,
        "value": 4.6683,
        "ols_fitted": 4.6241,
        "sen_fitted": 4.5835,
        "anomaly": 0.1627
      },
      {
        "year": 2001,
        "value": 4.2075,
        "ols_fitted": 4.5846,
        "sen_fitted": 4.5498,
        "anomaly": -0.2981
      },
      {
        "year": 2002,
        "value": 4.3208,
        "ols_fitted": 4.5451,
        "sen_fitted": 4.5162,
        "anomaly": -0.1848
      },
      {
        "year": 2003,
        "value": 5.1342,
        "ols_fitted": 4.5056,
        "sen_fitted": 4.4825,
        "anomaly": 0.6286
      },
      {
        "year": 2004,
        "value": 4.7058,
        "ols_fitted": 4.4661,
        "sen_fitted": 4.4488,
        "anomaly": 0.2002
      },
      {
        "year": 2005,
        "value": 5.2267,
        "ols_fitted": 4.4266,
        "sen_fitted": 4.4152,
        "anomaly": 0.7211
      },
      {
        "year": 2006,
        "value": 5.8208,
        "ols_fitted": 4.3871,
        "sen_fitted": 4.3815,
        "anomaly": 1.3152
      },
      {
        "year": 2007,
        "value": 4.7775,
        "ols_fitted": 4.3476,
        "sen_fitted": 4.3479,
        "anomaly": 0.2719
      },
      {
        "year": 2008,
        "value": 5.1042,
        "ols_fitted": 4.3081,
        "sen_fitted": 4.3142,
        "anomaly": 0.5986
      },
      {
        "year": 2009,
        "value": 4.38,
        "ols_fitted": 4.2686,
        "sen_fitted": 4.2806,
        "anomaly": -0.1256
      },
      {
        "year": 2010,
        "value": 4.4517,
        "ols_fitted": 4.2291,
        "sen_fitted": 4.2469,
        "anomaly": -0.0539
      },
      {
        "year": 2011,
        "value": 4.3183,
        "ols_fitted": 4.1896,
        "sen_fitted": 4.2132,
        "anomaly": -0.1873
      },
      {
        "year": 2012,
        "value": 4.03,
        "ols_fitted": 4.1501,
        "sen_fitted": 4.1796,
        "anomaly": -0.4756
      },
      {
        "year": 2013,
        "value": 4.6342,
        "ols_fitted": 4.1106,
        "sen_fitted": 4.1459,
        "anomaly": 0.1286
      },
      {
        "year": 2014,
        "value": 2.9933,
        "ols_fitted": 4.0711,
        "sen_fitted": 4.1123,
        "anomaly": -1.5123
      },
      {
        "year": 2015,
        "value": 1.7783,
        "ols_fitted": 4.0316,
        "sen_fitted": 4.0786,
        "anomaly": -2.7273
      },
      {
        "year": 2016,
        "value": 3.1242,
        "ols_fitted": 3.992,
        "sen_fitted": 4.045,
        "anomaly": -1.3814
      },
      {
        "year": 2017,
        "value": 4.3108,
        "ols_fitted": 3.9525,
        "sen_fitted": 4.0113,
        "anomaly": -0.1948
      },
      {
        "year": 2018,
        "value": 5.2525,
        "ols_fitted": 3.913,
        "sen_fitted": 3.9777,
        "anomaly": 0.7469
      },
      {
        "year": 2019,
        "value": 3.335,
        "ols_fitted": 3.8735,
        "sen_fitted": 3.944,
        "anomaly": -1.1706
      },
      {
        "year": 2020,
        "value": 2.6808,
        "ols_fitted": 3.834,
        "sen_fitted": 3.9103,
        "anomaly": -1.8248
      },
      {
        "year": 2021,
        "value": 4.5192,
        "ols_fitted": 3.7945,
        "sen_fitted": 3.8767,
        "anomaly": 0.0136
      },
      {
        "year": 2022,
        "value": 4.1817,
        "ols_fitted": 3.755,
        "sen_fitted": 3.843,
        "anomaly": -0.3239
      },
      {
        "year": 2023,
        "value": 3.44,
        "ols_fitted": 3.7155,
        "sen_fitted": 3.8094,
        "anomaly": -1.0656
      },
      {
        "year": 2024,
        "value": 4.0367,
        "ols_fitted": 3.676,
        "sen_fitted": 3.7757,
        "anomaly": -0.4689
      },
      {
        "year": 2025,
        "value": 2.7042,
        "ols_fitted": 3.6365,
        "sen_fitted": 3.7421,
        "anomaly": -1.8014
      }
    ],
    "stats": {
      "n_years": 45,
      "mean_value": 4.5056,
      "std_dev": 0.9417,
      "ols_slope_per_year": -0.0395,
      "ols_slope_per_decade": -0.395,
      "ols_r_squared": 0.3036,
      "ols_p_value": 9e-05,
      "ols_ci_lower_decade": -0.5791,
      "ols_ci_upper_decade": -0.211,
      "mk_tau": -0.3778,
      "mk_z_score": -3.649,
      "mk_p_value": 0.00025,
      "sen_slope_per_decade": -0.3366,
      "sen_ci_lower_decade": -0.5432,
      "sen_ci_upper_decade": -0.1546,
      "lag1_autocorrelation": 0.33,
      "badge": "DECREASING_SIGNIFICANT",
      "caveats": [
        "Moderate lag-1 serial autocorrelation detected (r1 = 0.33); effective degrees of freedom may be lower than sample count."
      ]
    }
  },
  "region_b": {
    "region": {
      "id": "B",
      "name": "Central Amazon Rainforest (Core)",
      "lat": -3.1,
      "lon": -60.0
    },
    "series": [
      {
        "year": 1981,
        "value": 5.2325,
        "ols_fitted": 6.605,
        "sen_fitted": 6.7508,
        "anomaly": -0.6067
      },
      {
        "year": 1982,
        "value": 5.7342,
        "ols_fitted": 6.5702,
        "sen_fitted": 6.7159,
        "anomaly": -0.105
      },
      {
        "year": 1983,
        "value": 5.4142,
        "ols_fitted": 6.5354,
        "sen_fitted": 6.681,
        "anomaly": -0.425
      },
      {
        "year": 1984,
        "value": 6.5,
        "ols_fitted": 6.5006,
        "sen_fitted": 6.6461,
        "anomaly": 0.6608
      },
      {
        "year": 1985,
        "value": 6.9058,
        "ols_fitted": 6.4658,
        "sen_fitted": 6.6113,
        "anomaly": 1.0666
      },
      {
        "year": 1986,
        "value": 6.9233,
        "ols_fitted": 6.431,
        "sen_fitted": 6.5764,
        "anomaly": 1.0841
      },
      {
        "year": 1987,
        "value": 5.9833,
        "ols_fitted": 6.3961,
        "sen_fitted": 6.5415,
        "anomaly": 0.1441
      },
      {
        "year": 1988,
        "value": 7.7067,
        "ols_fitted": 6.3613,
        "sen_fitted": 6.5066,
        "anomaly": 1.8675
      },
      {
        "year": 1989,
        "value": 7.4475,
        "ols_fitted": 6.3265,
        "sen_fitted": 6.4717,
        "anomaly": 1.6083
      },
      {
        "year": 1990,
        "value": 6.18,
        "ols_fitted": 6.2917,
        "sen_fitted": 6.4368,
        "anomaly": 0.3408
      },
      {
        "year": 1991,
        "value": 5.8883,
        "ols_fitted": 6.2569,
        "sen_fitted": 6.4019,
        "anomaly": 0.0491
      },
      {
        "year": 1992,
        "value": 4.9233,
        "ols_fitted": 6.2221,
        "sen_fitted": 6.3671,
        "anomaly": -0.9159
      },
      {
        "year": 1993,
        "value": 6.0725,
        "ols_fitted": 6.1873,
        "sen_fitted": 6.3322,
        "anomaly": 0.2333
      },
      {
        "year": 1994,
        "value": 7.0783,
        "ols_fitted": 6.1525,
        "sen_fitted": 6.2973,
        "anomaly": 1.2391
      },
      {
        "year": 1995,
        "value": 6.495,
        "ols_fitted": 6.1177,
        "sen_fitted": 6.2624,
        "anomaly": 0.6558
      },
      {
        "year": 1996,
        "value": 8.2092,
        "ols_fitted": 6.0829,
        "sen_fitted": 6.2275,
        "anomaly": 2.37
      },
      {
        "year": 1997,
        "value": 6.0725,
        "ols_fitted": 6.048,
        "sen_fitted": 6.1926,
        "anomaly": 0.2333
      },
      {
        "year": 1998,
        "value": 5.99,
        "ols_fitted": 6.0132,
        "sen_fitted": 6.1577,
        "anomaly": 0.1508
      },
      {
        "year": 1999,
        "value": 7.3242,
        "ols_fitted": 5.9784,
        "sen_fitted": 6.1228,
        "anomaly": 1.485
      },
      {
        "year": 2000,
        "value": 6.7758,
        "ols_fitted": 5.9436,
        "sen_fitted": 6.088,
        "anomaly": 0.9366
      },
      {
        "year": 2001,
        "value": 6.06,
        "ols_fitted": 5.9088,
        "sen_fitted": 6.0531,
        "anomaly": 0.2208
      },
      {
        "year": 2002,
        "value": 6.0658,
        "ols_fitted": 5.874,
        "sen_fitted": 6.0182,
        "anomaly": 0.2266
      },
      {
        "year": 2003,
        "value": 4.9783,
        "ols_fitted": 5.8392,
        "sen_fitted": 5.9833,
        "anomaly": -0.8609
      },
      {
        "year": 2004,
        "value": 4.8933,
        "ols_fitted": 5.8044,
        "sen_fitted": 5.9484,
        "anomaly": -0.9459
      },
      {
        "year": 2005,
        "value": 4.9133,
        "ols_fitted": 5.7696,
        "sen_fitted": 5.9135,
        "anomaly": -0.9259
      },
      {
        "year": 2006,
        "value": 5.7558,
        "ols_fitted": 5.7347,
        "sen_fitted": 5.8786,
        "anomaly": -0.0834
      },
      {
        "year": 2007,
        "value": 5.1283,
        "ols_fitted": 5.6999,
        "sen_fitted": 5.8438,
        "anomaly": -0.7109
      },
      {
        "year": 2008,
        "value": 7.0017,
        "ols_fitted": 5.6651,
        "sen_fitted": 5.8089,
        "anomaly": 1.1625
      },
      {
        "year": 2009,
        "value": 5.265,
        "ols_fitted": 5.6303,
        "sen_fitted": 5.774,
        "anomaly": -0.5742
      },
      {
        "year": 2010,
        "value": 5.4858,
        "ols_fitted": 5.5955,
        "sen_fitted": 5.7391,
        "anomaly": -0.3534
      },
      {
        "year": 2011,
        "value": 6.465,
        "ols_fitted": 5.5607,
        "sen_fitted": 5.7042,
        "anomaly": 0.6258
      },
      {
        "year": 2012,
        "value": 4.6925,
        "ols_fitted": 5.5259,
        "sen_fitted": 5.6693,
        "anomaly": -1.1467
      },
      {
        "year": 2013,
        "value": 4.8842,
        "ols_fitted": 5.4911,
        "sen_fitted": 5.6344,
        "anomaly": -0.955
      },
      {
        "year": 2014,
        "value": 5.0975,
        "ols_fitted": 5.4563,
        "sen_fitted": 5.5996,
        "anomaly": -0.7417
      },
      {
        "year": 2015,
        "value": 3.2083,
        "ols_fitted": 5.4215,
        "sen_fitted": 5.5647,
        "anomaly": -2.6309
      },
      {
        "year": 2016,
        "value": 4.6108,
        "ols_fitted": 5.3866,
        "sen_fitted": 5.5298,
        "anomaly": -1.2284
      },
      {
        "year": 2017,
        "value": 5.3833,
        "ols_fitted": 5.3518,
        "sen_fitted": 5.4949,
        "anomaly": -0.4559
      },
      {
        "year": 2018,
        "value": 5.0225,
        "ols_fitted": 5.317,
        "sen_fitted": 5.46,
        "anomaly": -0.8167
      },
      {
        "year": 2019,
        "value": 6.6217,
        "ols_fitted": 5.2822,
        "sen_fitted": 5.4251,
        "anomaly": 0.7825
      },
      {
        "year": 2020,
        "value": 6.075,
        "ols_fitted": 5.2474,
        "sen_fitted": 5.3902,
        "anomaly": 0.2358
      },
      {
        "year": 2021,
        "value": 7.0692,
        "ols_fitted": 5.2126,
        "sen_fitted": 5.3553,
        "anomaly": 1.23
      },
      {
        "year": 2022,
        "value": 6.05,
        "ols_fitted": 5.1778,
        "sen_fitted": 5.3205,
        "anomaly": 0.2108
      },
      {
        "year": 2023,
        "value": 4.3767,
        "ols_fitted": 5.143,
        "sen_fitted": 5.2856,
        "anomaly": -1.4625
      },
      {
        "year": 2024,
        "value": 4.205,
        "ols_fitted": 5.1082,
        "sen_fitted": 5.2507,
        "anomaly": -1.6342
      },
      {
        "year": 2025,
        "value": 4.5975,
        "ols_fitted": 5.0734,
        "sen_fitted": 5.2158,
        "anomaly": -1.2417
      }
    ],
    "stats": {
      "n_years": 45,
      "mean_value": 5.8392,
      "std_dev": 1.0349,
      "ols_slope_per_year": -0.03481,
      "ols_slope_per_decade": -0.3481,
      "ols_r_squared": 0.1952,
      "ols_p_value": 0.00238,
      "ols_ci_lower_decade": -0.5655,
      "ols_ci_upper_decade": -0.1307,
      "mk_tau": -0.3062,
      "mk_z_score": -2.954,
      "mk_p_value": 0.00303,
      "sen_slope_per_decade": -0.3489,
      "sen_ci_lower_decade": -0.5922,
      "sen_ci_upper_decade": -0.1191,
      "lag1_autocorrelation": 0.346,
      "badge": "DECREASING_SIGNIFICANT",
      "caveats": [
        "Moderate lag-1 serial autocorrelation detected (r1 = 0.35); effective degrees of freedom may be lower than sample count."
      ]
    }
  },
  "divergence_detected": false,
  "ai_interpretation": {
    "headline": "Bias-Corrected Total Precipitation Trend Assessment for Mato Grosso (Arc of Deforestation) (1981\u20132025): DECREASING SIGNIFICANT.",
    "what_is_changing": "Mato Grosso (Arc of Deforestation) (-12.5\u00b0N, -55.5\u00b0E) shows a decreasing linear rate of -0.3950 mm/day/decade (Sen's robust slope: -0.3366 mm/day/decade; 95% CI [-0.5791, -0.2110]), which is statistically significant (Mann\u2013Kendall p = 0.0003, \u03c4 = -0.38).",
    "where_it_diverges": "Central Amazon Rainforest (Core) (-3.1\u00b0N, -60.0\u00b0E) shows a decreasing linear rate of -0.3481 mm/day/decade (Sen's robust slope: -0.3489 mm/day/decade; 95% CI [-0.5655, -0.1307]), which is statistically significant (Mann\u2013Kendall p = 0.0030, \u03c4 = -0.31). Comparing both regions side by side demonstrates why global or national averages can mask localized environmental shifts.",
    "statistical_verdict": "Both parametric (Ordinary Least Squares) and non-parametric (Mann\u2013Kendall / Theil\u2013Sen) tests confirm a statistically detectable signal (p < 0.05) over the 45-year NASA record.",
    "limitations_and_caveats": "Moderate lag-1 serial autocorrelation detected (r1 = 0.33); effective degrees of freedom may be lower than sample count. Moderate lag-1 serial autocorrelation detected (r1 = 0.35); effective degrees of freedom may be lower than sample count.",
    "generated_by": "deterministic_scientific_engine"
  }
}
};

// Aliases for underscore-format IDs used across URLs and components
GOLDEN_CASES['pk_divergence'] = GOLDEN_CASES['pk-divergence'];
GOLDEN_CASES['pk_heatwave'] = GOLDEN_CASES['pk-heatwave'];
GOLDEN_CASES['aral_sea'] = GOLDEN_CASES['aral-sea'];
GOLDEN_CASES['amazon_drying'] = GOLDEN_CASES['amazon-drying'];

export function getGoldenCase(id: string): InvestigationResponse | undefined {
  if (!id) return undefined;
  const normHyphen = id.replace(/_/g, "-");
  const normUnderscore = id.replace(/-/g, "_");
  return GOLDEN_CASES[id] || GOLDEN_CASES[normHyphen] || GOLDEN_CASES[normUnderscore];
}

export async function loadGoldenCase(id: string): Promise<InvestigationResponse> {
  const cached = getGoldenCase(id);
  if (cached) return cached;
  throw new Error('Unknown golden case: ' + id);
}
