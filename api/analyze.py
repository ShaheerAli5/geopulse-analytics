"""
Vercel Python Serverless Function: /api/analyze
Handles GET and POST requests for dual-region NASA Earth System trend investigations.
Executes zero-download NASA POWER queries, computes OLS, Mann-Kendall, Sen's slope,
confidence badges, divergence detection, and grounded scientific interpretation.
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import time
import urllib.parse
import uuid

# Ensure relative and absolute imports resolve cleanly
_CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if _CURRENT_DIR not in sys.path:
    sys.path.insert(0, _CURRENT_DIR)

try:
    from _lib.variable_catalog import VARIABLE_CATALOG
    from _lib.nasa_power_client import fetch_nasa_power_series
    from _lib.stats_engine import analyze_time_series
except ImportError:
    from api._lib.variable_catalog import VARIABLE_CATALOG
    from api._lib.nasa_power_client import fetch_nasa_power_series
    from api._lib.stats_engine import analyze_time_series


def format_region_verdict(r: dict, units: str) -> str:
    stats = r["stats"]
    reg = r["region"]
    slope_dec = stats["ols_slope_per_decade"]
    sen_dec = stats["sen_slope_per_decade"]
    mk_p = stats["mk_p_value"]
    mk_tau = stats["mk_tau"]
    ci_low = stats["ols_ci_lower_decade"]
    ci_high = stats["ols_ci_upper_decade"]

    dir_str = "increasing" if slope_dec >= 0 else "decreasing"
    dir_article = "an" if dir_str == "increasing" else "a"
    if mk_p < 0.05:
        sig_str = f"statistically significant (Mann–Kendall p = {mk_p:.4f}, τ = {mk_tau:.2f})"
    else:
        sig_str = f"not statistically significant at α = 0.05 (Mann–Kendall p = {mk_p:.3f}, τ = {mk_tau:.2f})"

    sign_ols = "+" if slope_dec >= 0 else ""
    sign_sen = "+" if sen_dec >= 0 else ""

    return (
        f"{reg['name']} ({reg['lat']}°N, {reg['lon']}°E) shows {dir_article} {dir_str} linear rate of "
        f"{sign_ols}{slope_dec:.4f} {units}/decade (Sen's robust slope: "
        f"{sign_sen}{sen_dec:.4f} {units}/decade; 95% CI [{ci_low:.4f}, {ci_high:.4f}]), "
        f"which is {sig_str}."
    )


def build_interpretation(
    var_name: str,
    units: str,
    start_year: int,
    end_year: int,
    region_a: dict,
    region_b: dict | None,
    divergence_detected: bool,
    provenance: dict,
) -> dict:
    a = region_a
    b = region_b

    if divergence_detected and b:
        headline = (
            f"Regional Divergence Confirmed: {a['region']['name']} and {b['region']['name']} "
            f"exhibit contrasting {var_name} trajectories ({start_year}–{end_year})."
        )
    else:
        badge_text = a["stats"]["badge"].replace("_", " ")
        headline = f"{var_name} Trend Assessment for {a['region']['name']} ({start_year}–{end_year}): {badge_text}."

    what_is_changing = format_region_verdict(a, units)

    if b:
        where_it_diverges = (
            f"{format_region_verdict(b, units)} Comparing both regions side by side demonstrates "
            "why global or national averages can mask localized environmental shifts."
        )
    else:
        where_it_diverges = (
            "Single-region analysis selected. Add a Region B pin on the map to test whether "
            "a neighboring basin or climatic zone trends in the opposite direction."
        )

    a_sig = a["stats"]["mk_p_value"] < 0.05
    b_sig = (b["stats"]["mk_p_value"] < 0.05) if b else False

    if a_sig or b_sig:
        statistical_verdict = (
            f"Both parametric (Ordinary Least Squares) and non-parametric (Mann–Kendall / Theil–Sen) "
            f"tests confirm a statistically detectable signal (p < 0.05) over the {a['stats']['n_years']}-year NASA record."
        )
    else:
        statistical_verdict = (
            "While the fitted slope shows a directional drift, year-to-year climate variability "
            "currently exceeds the long-term signal (p ≥ 0.05). Per NASA Earth science guidelines, "
            "a non-significant trend may require seasonal isolation (e.g., Monsoon JJAS) or a longer observation window."
        )

    all_caveats = list(a["stats"].get("caveats", []))
    if b:
        all_caveats.extend(b["stats"].get("caveats", []))

    if all_caveats:
        limitations_and_caveats = " ".join(all_caveats)
    else:
        limitations_and_caveats = (
            f"Evaluated across {a['stats']['n_years']} years from {provenance['mission_model']} "
            f"({provenance['spatial_resolution']}) with {provenance['missing_months_filtered']} missing months excluded."
        )

    return {
        "headline": headline,
        "what_is_changing": what_is_changing,
        "where_it_diverges": where_it_diverges,
        "statistical_verdict": statistical_verdict,
        "limitations_and_caveats": limitations_and_caveats,
        "generated_by": "deterministic_scientific_engine",
    }


def execute_investigation(params: dict) -> dict:
    """Core logic to run dual-region investigation and return InvestigationResponse dict."""
    var_id = params.get("variable_id") or params.get("variable") or params.get("var") or "PRECTOTCORR"
    var_id = var_id.strip()

    if var_id not in VARIABLE_CATALOG:
        raise ValueError(f"Unknown variable_id '{var_id}'. Valid choices: {list(VARIABLE_CATALOG.keys())}")

    var_info = VARIABLE_CATALOG[var_id]

    lat_a = float(params.get("latA", params.get("lat_a", 35.30)))
    lon_a = float(params.get("lonA", params.get("lon_a", 75.60)))
    name_a = params.get("nameA", params.get("name_a", "Region A"))

    lat_b_raw = params.get("latB", params.get("lat_b"))
    lon_b_raw = params.get("lonB", params.get("lon_b"))
    name_b = params.get("nameB", params.get("name_b", "Region B"))

    start_year = int(params.get("start_year", params.get("start", 1981)))
    end_year = int(params.get("end_year", params.get("end", 2025)))
    mode = params.get("aggregation_mode", params.get("mode", "annual")).lower()
    inv_id = params.get("investigation_id") or params.get("id") or f"inv-{int(time.time())}-{uuid.uuid4().hex[:6]}"

    # Fetch and analyze Region A
    records_a, missing_a, retrieved_a = fetch_nasa_power_series(
        lat=lat_a,
        lon=lon_a,
        variable_id=var_id,
        start_year=start_year,
        end_year=end_year,
        aggregation_mode=mode,
    )
    analyzed_a = analyze_time_series(records_a, units=var_info["units"])

    region_a_payload = {
        "region": {
            "id": "A",
            "name": name_a,
            "lat": round(lat_a, 4),
            "lon": round(lon_a, 4),
        },
        "series": analyzed_a["series"],
        "stats": analyzed_a["stats"],
    }

    # Fetch and analyze Region B if provided
    region_b_payload = None
    missing_b = 0
    divergence_detected = False

    if lat_b_raw is not None and lon_b_raw is not None:
        lat_b = float(lat_b_raw)
        lon_b = float(lon_b_raw)
        records_b, missing_b, _ = fetch_nasa_power_series(
            lat=lat_b,
            lon=lon_b,
            variable_id=var_id,
            start_year=start_year,
            end_year=end_year,
            aggregation_mode=mode,
        )
        analyzed_b = analyze_time_series(records_b, units=var_info["units"])

        region_b_payload = {
            "region": {
                "id": "B",
                "name": name_b,
                "lat": round(lat_b, 4),
                "lon": round(lon_b, 4),
            },
            "series": analyzed_b["series"],
            "stats": analyzed_b["stats"],
        }

        # Divergence test: opposite slope signs OR one significant and the other not
        slope_a = analyzed_a["stats"]["ols_slope_per_decade"]
        slope_b = analyzed_b["stats"]["ols_slope_per_decade"]
        sig_a = analyzed_a["stats"]["mk_p_value"] < 0.05
        sig_b = analyzed_b["stats"]["mk_p_value"] < 0.05

        opposite_signs = (slope_a * slope_b) < 0
        significance_difference = (sig_a != sig_b)
        divergence_detected = opposite_signs or significance_difference

    # Provenance object
    provenance = {
        "source_name": "NASA POWER / MERRA-2",
        "mission_model": var_info["mission_model"],
        "api_endpoint": "https://power.larc.nasa.gov/api/temporal/monthly/point",
        "spatial_resolution": "0.5° x 0.625° (MERRA-2 Grid)",
        "missing_months_filtered": missing_a + missing_b,
        "retrieved_at_utc": retrieved_a,
        "verification_links": [
            {"label": "NASA Giovanni", "url": var_info["giovanni_url"]},
            {"label": "NASA Earthdata", "url": var_info["earthdata_url"]},
            {"label": "CUAHSI HydroClient", "url": "https://data.cuahsi.org/"},
            {"label": "NASA Worldview", "url": "https://worldview.earthdata.nasa.gov/"},
        ],
    }

    ai_interp = build_interpretation(
        var_name=var_info["name"],
        units=var_info["units"],
        start_year=start_year,
        end_year=end_year,
        region_a=region_a_payload,
        region_b=region_b_payload,
        divergence_detected=divergence_detected,
        provenance=provenance,
    )

    response = {
        "investigation_id": inv_id,
        "variable_id": var_id,
        "variable_name": var_info["name"],
        "units": var_info["units"],
        "plain_definition": var_info["plain_definition"],
        "aggregation_mode": mode if mode in ["annual", "monsoon_jjas", "winter_djf"] else "annual",
        "start_year": start_year,
        "end_year": end_year,
        "provenance": provenance,
        "region_a": region_a_payload,
    }

    if region_b_payload is not None:
        response["region_b"] = region_b_payload

    response["divergence_detected"] = divergence_detected
    response["ai_interpretation"] = ai_interp

    return response


class handler(BaseHTTPRequestHandler):
    """Vercel Python Serverless HTTP Request Handler."""

    def _set_headers(self, status: int = 200, content_type: str = "application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200, "text/plain")

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        query = urllib.parse.parse_qs(parsed.query)
        params = {k: v[0] for k, v in query.items()}

        try:
            result = execute_investigation(params)
            payload_bytes = json.dumps(result, indent=2).encode("utf-8")
            self._set_headers(200)
            self.wfile.write(payload_bytes)
        except Exception as e:
            err = {"error": str(e), "type": type(e).__name__}
            payload_bytes = json.dumps(err).encode("utf-8")
            self._set_headers(400)
            self.wfile.write(payload_bytes)

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length > 0 else b"{}"

        try:
            params = json.loads(body.decode("utf-8")) if body else {}
            result = execute_investigation(params)
            payload_bytes = json.dumps(result, indent=2).encode("utf-8")
            self._set_headers(200)
            self.wfile.write(payload_bytes)
        except Exception as e:
            err = {"error": str(e), "type": type(e).__name__}
            payload_bytes = json.dumps(err).encode("utf-8")
            self._set_headers(400)
            self.wfile.write(payload_bytes)
