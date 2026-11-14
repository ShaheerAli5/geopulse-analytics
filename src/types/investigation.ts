/**
 * Shared TypeScript Contract: Investigation Data Model
 * GeoPulse Analytics - Earth System Trend Detective
 * Locked Shared Contract across Frontend & Backend Serverless
 */

export type ConfidenceBadge =
  | "INCREASING_SIGNIFICANT"
  | "DECREASING_SIGNIFICANT"
  | "INCREASING_NOT_SIGNIFICANT"
  | "DECREASING_NOT_SIGNIFICANT"
  | "NO_MONOTONIC_TREND"
  | "INSUFFICIENT_DATA";

export interface RegionInput {
  id: "A" | "B";
  name: string;
  lat: number;
  lon: number;
}

export interface TimeSeriesPoint {
  year: number;
  value: number;
  ols_fitted: number;
  sen_fitted: number;
  anomaly: number;
}

export interface StatisticalResult {
  n_years: number;
  mean_value: number;
  std_dev: number;
  ols_slope_per_year: number;
  ols_slope_per_decade: number;
  ols_r_squared: number;
  ols_p_value: number;
  ols_ci_lower_decade: number;
  ols_ci_upper_decade: number;
  mk_tau: number;
  mk_z_score: number;
  mk_p_value: number;
  sen_slope_per_decade: number;
  sen_ci_lower_decade: number;
  sen_ci_upper_decade: number;
  lag1_autocorrelation: number;
  badge: ConfidenceBadge;
  caveats: string[];
}

export interface RegionAnalysis {
  region: RegionInput;
  series: TimeSeriesPoint[];
  stats: StatisticalResult;
}

export interface InvestigationResponse {
  investigation_id: string;
  variable_id: string;
  variable_name: string;
  units: string;
  plain_definition: string;
  aggregation_mode: "annual" | "monsoon_jjas" | "winter_djf";
  start_year: number;
  end_year: number;
  provenance: {
    source_name: string;
    mission_model: string;
    api_endpoint: string;
    spatial_resolution: string;
    missing_months_filtered: number;
    retrieved_at_utc: string;
    verification_links: { label: string; url: string }[];
  };
  region_a: RegionAnalysis;
  region_b?: RegionAnalysis;
  divergence_detected: boolean;
  ai_interpretation: {
    headline: string;
    what_is_changing: string;
    where_it_diverges: string;
    statistical_verdict: string;
    limitations_and_caveats: string;
    generated_by: "ai_grounded" | "deterministic_scientific_engine";
  };
}
