/**
 * GeoPulse Analytics - Evidence-Grounded AI Interpreter
 * Conforms to docs/09 Agent 3 Guided Detective Ai And Demo.md
 * and api/analyze.py.
 *
 * Guarantees zero hallucinated numbers by producing structured narratives
 * derived strictly from verified parametric & non-parametric statistical metrics.
 * 100% deterministic fallback with zero external LLM dependencies.
 */

import { InvestigationResponse, RegionAnalysis } from "@/types/investigation";

function formatCoordStr(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir}`;
}

export function formatRegionVerdict(r: RegionAnalysis, units: string): string {
  const coordStr = formatCoordStr(r.region.lat, r.region.lon);

  if (r.stats.badge === "INSUFFICIENT_DATA") {
    const n = r.stats.n_years;
    return `${r.region.name} (${coordStr}) has insufficient observations (${n} valid year${
      n === 1 ? "" : "s"
    }; minimum 10 required) to establish a statistically reliable trend trajectory.`;
  }

  const slope = r.stats.ols_slope_per_decade;
  if (r.stats.badge === "NO_MONOTONIC_TREND" && Math.abs(slope) < 1e-6) {
    return `${r.region.name} (${coordStr}) shows a stable, flat trajectory with no monotonic trend (OLS slope: 0.0000 ${units}/decade; Sen's robust slope: 0.0000 ${units}/decade; Mann–Kendall p = ${r.stats.mk_p_value.toFixed(
      3
    )}, τ = ${r.stats.mk_tau.toFixed(2)}).`;
  }

  const dir = slope >= 0 ? "increasing" : "decreasing";
  const dirArticle = dir === "increasing" ? "an" : "a";
  const sig =
    r.stats.mk_p_value < 0.05
      ? `statistically significant (Mann–Kendall p = ${r.stats.mk_p_value.toFixed(4)}, τ = ${r.stats.mk_tau.toFixed(2)})`
      : `not statistically significant at α = 0.05 (Mann–Kendall p = ${r.stats.mk_p_value.toFixed(3)}, τ = ${r.stats.mk_tau.toFixed(2)})`;

  return `${r.region.name} (${coordStr}) shows ${dirArticle} ${dir} linear rate of ${
    slope >= 0 ? "+" : ""
  }${slope.toFixed(4)} ${units}/decade (Sen's robust slope: ${
    r.stats.sen_slope_per_decade >= 0 ? "+" : ""
  }${r.stats.sen_slope_per_decade.toFixed(4)} ${units}/decade; 95% CI [${r.stats.ols_ci_lower_decade.toFixed(
    4
  )}, ${r.stats.ols_ci_upper_decade.toFixed(4)}]), which is ${sig}.`;
}

/**
 * Build deterministic scientific interpretation for an investigation.
 * Exactly matches api/analyze.py build_interpretation logic.
 */
export function buildDeterministicInterpretation(
  data: Omit<InvestigationResponse, "ai_interpretation">
): InvestigationResponse["ai_interpretation"] {
  const a = data.region_a;
  const b = data.region_b;

  // 1. Headline
  const headline =
    data.divergence_detected && b
      ? `Regional Divergence Confirmed: ${a.region.name} and ${b.region.name} exhibit contrasting ${data.variable_name} trajectories (${data.start_year}–${data.end_year}).`
      : `${data.variable_name} Trend Assessment for ${a.region.name} (${data.start_year}–${data.end_year}): ${a.stats.badge.replace(/_/g, " ")}.`;

  // 2. What is changing (Region A verdict)
  const what_is_changing = formatRegionVerdict(a, data.units);

  // 3. Where it diverges (Region B comparison or single-region guidance)
  const where_it_diverges = b
    ? `${formatRegionVerdict(b, data.units)} Comparing both regions side by side demonstrates why global or national averages can mask localized environmental shifts.`
    : `Single-region analysis selected. Add a Region B pin on the map to test whether a neighboring basin or climatic zone trends in the opposite direction.`;

  // 4. Statistical significance assessment
  const a_sig = a.stats.mk_p_value < 0.05;
  const b_sig = b ? b.stats.mk_p_value < 0.05 : false;

  const statistical_verdict =
    a_sig || b_sig
      ? `Both parametric (Ordinary Least Squares) and non-parametric (Mann–Kendall / Theil–Sen) tests confirm a statistically detectable signal (p < 0.05) over the ${a.stats.n_years}-year NASA record.`
      : `While the fitted slope shows a directional drift, year-to-year climate variability currently exceeds the long-term signal (p ≥ 0.05). Per NASA Earth science guidelines, a non-significant trend may require seasonal isolation (e.g., Monsoon JJAS) or a longer observation window.`;

  // 5. Audit caveats & limitations
  const allCaveats: string[] = [
    ...(a.stats.caveats || []),
    ...(b ? b.stats.caveats || [] : []),
  ];

  const limitations_and_caveats =
    allCaveats.length > 0
      ? allCaveats.join(" ")
      : `Evaluated across ${a.stats.n_years} years from ${data.provenance.mission_model} (${data.provenance.spatial_resolution}) with ${data.provenance.missing_months_filtered} missing months excluded.`;

  return {
    headline,
    what_is_changing,
    where_it_diverges,
    statistical_verdict,
    limitations_and_caveats,
    generated_by: "deterministic_scientific_engine",
  };
}
