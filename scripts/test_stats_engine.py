"""
Unit and Integration Tests for Agent 2 NASA Data & Stats Engine
Validates:
- Statistical engine (OLS, Mann-Kendall, Sen's slope, lag-1 autocorrelation)
- ConfidenceBadge classification logic
- NASA POWER API client & missing value filtering
- Complete InvestigationResponse schema compliance
"""

import json
import os
import sys
import unittest

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from api._lib.variable_catalog import VARIABLE_CATALOG
from api._lib.stats_engine import analyze_time_series
from api.analyze import execute_investigation, format_region_verdict


class TestVariableCatalog(unittest.TestCase):
    def test_catalog_has_all_six_variables(self):
        expected_vars = [
            "PRECTOTCORR",
            "GWETROOT",
            "T2M",
            "TS",
            "QV2M",
            "ALLSKY_SFC_SW_DWN",
        ]
        for v in expected_vars:
            self.assertIn(v, VARIABLE_CATALOG)
            entry = VARIABLE_CATALOG[v]
            self.assertIn("name", entry)
            self.assertIn("units", entry)
            self.assertIn("mission_model", entry)
            self.assertIn("plain_definition", entry)
            self.assertIn("giovanni_url", entry)
            self.assertIn("earthdata_url", entry)


class TestStatsEngine(unittest.TestCase):
    def test_insufficient_data(self):
        short_series = [{"year": 2020 + i, "value": 10.0 + i} for i in range(5)]
        res = analyze_time_series(short_series, units="°C")
        self.assertEqual(res["stats"]["badge"], "INSUFFICIENT_DATA")
        self.assertEqual(res["stats"]["n_years"], 5)

    def test_increasing_significant_trend(self):
        # 30 years of strongly increasing values: y = 2.0 * yr + noise
        records = [
            {"year": 1990 + i, "value": 10.0 + 0.5 * i + ((-1) ** i * 0.05)}
            for i in range(35)
        ]
        res = analyze_time_series(records, units="°C")
        stats = res["stats"]

        self.assertEqual(stats["n_years"], 35)
        self.assertGreater(stats["ols_slope_per_decade"], 0)
        self.assertGreater(stats["sen_slope_per_decade"], 0)
        self.assertLess(stats["mk_p_value"], 0.05)
        self.assertEqual(stats["badge"], "INCREASING_SIGNIFICANT")
        self.assertEqual(len(res["series"]), 35)

        # Check required fields
        for pt in res["series"]:
            self.assertIn("year", pt)
            self.assertIn("value", pt)
            self.assertIn("ols_fitted", pt)
            self.assertIn("sen_fitted", pt)
            self.assertIn("anomaly", pt)

    def test_decreasing_trend(self):
        # 30 years of strongly decreasing values
        records = [
            {"year": 1990 + i, "value": 100.0 - 0.8 * i}
            for i in range(30)
        ]
        res = analyze_time_series(records, units="mm/day")
        stats = res["stats"]

        self.assertLess(stats["ols_slope_per_decade"], 0)
        self.assertLess(stats["mk_p_value"], 0.05)
        self.assertEqual(stats["badge"], "DECREASING_SIGNIFICANT")

    def test_no_monotonic_trend(self):
        # Flat constant series
        records = [{"year": 1990 + i, "value": 50.0} for i in range(30)]
        res = analyze_time_series(records, units="fraction")
        stats = res["stats"]

        self.assertEqual(stats["ols_slope_per_decade"], 0.0)
        self.assertEqual(stats["badge"], "NO_MONOTONIC_TREND")
        self.assertEqual(stats["mk_tau"], 0.0)
        self.assertEqual(stats["mk_p_value"], 1.0)
        self.assertEqual(stats["ols_r_squared"], 0.0)

        # Must be 100% strict JSON compliant (RFC 8259, absolutely no NaN or Inf)
        json_str = json.dumps(res, allow_nan=False)
        self.assertNotIn("NaN", json_str)
        self.assertNotIn("Infinity", json_str)


class TestGoldenDemos(unittest.TestCase):
    def test_all_four_golden_demos_exist_and_validate(self):
        golden_dir = os.path.join(PROJECT_ROOT, "public", "data", "golden_demos")
        expected_files = [
            "pk_divergence.json",
            "pk_heatwave.json",
            "aral_sea.json",
            "amazon_drying.json",
        ]
        for fname in expected_files:
            fpath = os.path.join(golden_dir, fname)
            self.assertTrue(os.path.exists(fpath), f"Missing golden demo file: {fname}")
            with open(fpath, "r", encoding="utf-8") as f:
                data = json.load(f)

            # Validate top-level keys
            required_keys = [
                "investigation_id",
                "variable_id",
                "variable_name",
                "units",
                "plain_definition",
                "aggregation_mode",
                "start_year",
                "end_year",
                "provenance",
                "region_a",
                "region_b",
                "divergence_detected",
                "ai_interpretation",
            ]
            for rk in required_keys:
                self.assertIn(rk, data, f"Key '{rk}' missing in {fname}")

            # Validate provenance
            prov = data["provenance"]
            self.assertIn("source_name", prov)
            self.assertIn("mission_model", prov)
            self.assertIn("api_endpoint", prov)
            self.assertIn("spatial_resolution", prov)
            self.assertIn("missing_months_filtered", prov)
            self.assertIn("retrieved_at_utc", prov)
            self.assertIn("verification_links", prov)
            self.assertGreaterEqual(len(prov["verification_links"]), 3)

            # Validate Region A
            reg_a = data["region_a"]
            self.assertEqual(reg_a["region"]["id"], "A")
            self.assertGreaterEqual(len(reg_a["series"]), 30)
            self.assertIn("badge", reg_a["stats"])
            self.assertIn("ols_slope_per_decade", reg_a["stats"])
            self.assertIn("mk_p_value", reg_a["stats"])
            self.assertIn("sen_slope_per_decade", reg_a["stats"])

            # Validate Region B
            reg_b = data["region_b"]
            self.assertEqual(reg_b["region"]["id"], "B")
            self.assertGreaterEqual(len(reg_b["series"]), 30)
            self.assertIn("badge", reg_b["stats"])

            # Validate AI Interpretation
            ai = data["ai_interpretation"]
            self.assertIn("headline", ai)
            self.assertIn("what_is_changing", ai)
            self.assertIn("where_it_diverges", ai)
            self.assertIn("statistical_verdict", ai)
            self.assertIn("limitations_and_caveats", ai)
            self.assertEqual(ai["generated_by"], "deterministic_scientific_engine")


class TestAnalyzeEndpoint(unittest.TestCase):
    def test_single_region_investigation(self):
        res = execute_investigation({
            "variable_id": "T2M",
            "latA": 35.30,
            "lonA": 75.60,
            "nameA": "Upper Indus",
            "start_year": 2010,
            "end_year": 2024,
            "aggregation_mode": "annual",
        })
        self.assertEqual(res["variable_id"], "T2M")
        self.assertIn("region_a", res)
        self.assertNotIn("region_b", res)
        self.assertFalse(res["divergence_detected"])
        self.assertIn("Upper Indus", res["ai_interpretation"]["headline"])

    def test_invalid_variable_raises(self):
        with self.assertRaises(ValueError):
            execute_investigation({
                "variable_id": "INVALID_VAR",
                "latA": 0,
                "lonA": 0,
            })

    def test_dual_region_investigation(self):
        res = execute_investigation({
            "variable_id": "T2M",
            "latA": 28.28,
            "lonA": 68.44,
            "nameA": "Jacobabad",
            "latB": 24.86,
            "lonB": 67.01,
            "nameB": "Karachi",
            "start_year": 2015,
            "end_year": 2024,
            "aggregation_mode": "annual",
        })
        self.assertEqual(res["variable_id"], "T2M")
        self.assertIn("region_a", res)
        self.assertIn("region_b", res)
        self.assertIsInstance(res["divergence_detected"], bool)
        self.assertEqual(res["aggregation_mode"], "annual")

    def test_seasonal_aggregation_modes(self):
        for mode in ["monsoon_jjas", "winter_djf"]:
            res = execute_investigation({
                "variable_id": "PRECTOTCORR",
                "latA": 35.30,
                "lonA": 75.60,
                "nameA": "Upper Indus",
                "start_year": 2018,
                "end_year": 2023,
                "aggregation_mode": mode,
            })
            self.assertEqual(res["aggregation_mode"], mode)
            self.assertGreaterEqual(len(res["region_a"]["series"]), 5)

    def test_lowercase_variable_id(self):
        res = execute_investigation({
            "variable_id": "t2m",
            "latA": 35.30,
            "lonA": 75.60,
            "start_year": 2020,
            "end_year": 2022,
        })
        self.assertEqual(res["variable_id"], "T2M")

    def test_inverted_year_range_auto_orders(self):
        res = execute_investigation({
            "variable_id": "T2M",
            "latA": 35.30,
            "lonA": 75.60,
            "start_year": 2023,
            "end_year": 2020,
        })
        self.assertEqual(res["start_year"], 2020)
        self.assertEqual(res["end_year"], 2023)

    def test_empty_region_b_treated_as_single_region(self):
        res = execute_investigation({
            "variable_id": "T2M",
            "latA": 35.30,
            "lonA": 75.60,
            "latB": "",
            "lonB": "   ",
            "start_year": 2020,
            "end_year": 2022,
        })
        self.assertIn("region_a", res)
        self.assertNotIn("region_b", res)
        self.assertFalse(res["divergence_detected"])

    def test_out_of_bounds_coordinates_clamped(self):
        res = execute_investigation({
            "variable_id": "T2M",
            "latA": 95.0,
            "lonA": 200.0,
            "start_year": 2020,
            "end_year": 2022,
        })
        self.assertLessEqual(res["region_a"]["region"]["lat"], 85.05)
        self.assertGreaterEqual(res["region_a"]["region"]["lat"], -85.05)
        self.assertLessEqual(res["region_a"]["region"]["lon"], 180.0)
        self.assertGreaterEqual(res["region_a"]["region"]["lon"], -180.0)

    def test_insufficient_data_verdict_phrasing(self):
        mock_region = {
            "region": {"name": "Test Region", "lat": 30.0, "lon": 70.0},
            "stats": {"badge": "INSUFFICIENT_DATA", "n_years": 4, "ols_slope_per_decade": 0.0, "sen_slope_per_decade": 0.0, "mk_p_value": 1.0, "mk_tau": 0.0, "ols_ci_lower_decade": 0.0, "ols_ci_upper_decade": 0.0}
        }
        verdict = format_region_verdict(mock_region, "mm/day")
        self.assertIn("insufficient observations", verdict.lower())
        self.assertNotIn("increasing linear rate", verdict.lower())
        self.assertNotIn("decreasing linear rate", verdict.lower())

    def test_flat_series_verdict_phrasing(self):
        mock_region = {
            "region": {"name": "Flat Region", "lat": 25.0, "lon": 65.0},
            "stats": {"badge": "NO_MONOTONIC_TREND", "n_years": 30, "ols_slope_per_decade": 0.0, "sen_slope_per_decade": 0.0, "mk_p_value": 1.0, "mk_tau": 0.0, "ols_ci_lower_decade": 0.0, "ols_ci_upper_decade": 0.0}
        }
        verdict = format_region_verdict(mock_region, "°C")
        self.assertIn("stable", verdict.lower())
        self.assertNotIn("increasing linear rate", verdict.lower())



if __name__ == "__main__":
    unittest.main()
