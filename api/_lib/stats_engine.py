"""
Statistical Analysis Engine
Computes Ordinary Least Squares (OLS) regression, Mann-Kendall trend test,
Theil-Sen robust slope, 95% confidence intervals, lag-1 autocorrelation diagnostics,
and the 6-tier ConfidenceBadge.
"""

from typing import Any, Dict, List
import numpy as np
from scipy import stats


def analyze_time_series(records: List[Dict[str, float]], units: str = "") -> Dict[str, Any]:
    """
    Computes rigorous trend statistics on a time series of annual/seasonal values.

    Args:
        records: List of dicts with 'year' and 'value'.
        units: Unit string for the variable (e.g., 'mm/day', '°C').

    Returns:
        Dict with 'series' (enriched with fitted values and anomalies) and 'stats'.
    """
    years = np.array([r["year"] for r in records], dtype=float)
    values = np.array([r["value"] for r in records], dtype=float)
    n = len(years)

    if n < 10:
        enriched_series = []
        mean_fallback = float(np.mean(values)) if n > 0 else 0.0
        for r in records:
            enriched_series.append({
                "year": int(r["year"]),
                "value": round(float(r["value"]), 4),
                "ols_fitted": round(float(r["value"]), 4),
                "sen_fitted": round(float(r["value"]), 4),
                "anomaly": round(float(r["value"]) - mean_fallback, 4),
            })
        return {
            "series": enriched_series,
            "stats": {
                "n_years": n,
                "mean_value": round(mean_fallback, 4),
                "std_dev": 0.0,
                "ols_slope_per_year": 0.0,
                "ols_slope_per_decade": 0.0,
                "ols_r_squared": 0.0,
                "ols_p_value": 1.0,
                "ols_ci_lower_decade": 0.0,
                "ols_ci_upper_decade": 0.0,
                "mk_tau": 0.0,
                "mk_z_score": 0.0,
                "mk_p_value": 1.0,
                "sen_slope_per_decade": 0.0,
                "sen_ci_lower_decade": 0.0,
                "sen_ci_upper_decade": 0.0,
                "lag1_autocorrelation": 0.0,
                "badge": "INSUFFICIENT_DATA",
                "caveats": ["Fewer than 10 valid annual/seasonal observations available."],
            },
        }

    # 1. Baseline & basic summary stats
    mean_val = float(np.mean(values))
    std_val = float(np.std(values, ddof=1)) if n > 1 else 0.0

    # 2. Ordinary Least Squares (OLS) Linear Regression
    ols = stats.linregress(years, values)
    slope_yr = float(ols.slope)
    slope_dec = slope_yr * 10.0
    r_squared = float(ols.rvalue ** 2)
    ols_p = float(ols.pvalue)
    t_crit = float(stats.t.ppf(0.975, df=n - 2))
    ci_half_dec = t_crit * float(ols.stderr) * 10.0

    # 3. Mann-Kendall Non-Parametric Trend Test
    tau, mk_p = stats.kendalltau(years, values)
    # Compute explicit S and Z_MK
    s_stat = 0
    for i in range(n - 1):
        s_stat += int(np.sum(np.sign(values[i + 1 :] - values[i])))
    var_s = (n * (n - 1) * (2 * n + 5)) / 18.0
    if s_stat > 0:
        z_mk = (s_stat - 1) / np.sqrt(var_s)
    elif s_stat < 0:
        z_mk = (s_stat + 1) / np.sqrt(var_s)
    else:
        z_mk = 0.0

    # 4. Theil-Sen Robust Slope Estimator
    sen_slope, sen_intercept, sen_low, sen_high = stats.theilslopes(values, years, 0.95)

    # 5. Lag-1 Autocorrelation on OLS Residuals
    ols_fitted = ols.intercept + slope_yr * years
    sen_fitted = sen_intercept + sen_slope * years
    residuals = values - ols_fitted
    if n > 3 and np.std(residuals) > 1e-9:
        lag1_corr = float(np.corrcoef(residuals[:-1], residuals[1:])[0, 1])
        if np.isnan(lag1_corr):
            lag1_corr = 0.0
    else:
        lag1_corr = 0.0

    # 6. Classify Confidence Badge & Caveats
    caveats = []
    if abs(lag1_corr) > 0.30:
        caveats.append(
            f"Moderate lag-1 serial autocorrelation detected (r1 = {lag1_corr:.2f}); "
            "effective degrees of freedom may be lower than sample count."
        )
    if n < 20:
        caveats.append(f"Short record length ({n} years); climate normals typically span 30+ years.")

    if mk_p < 0.05:
        badge = "INCREASING_SIGNIFICANT" if slope_yr > 0 else "DECREASING_SIGNIFICANT"
    elif abs(tau) < 0.03 and mk_p >= 0.50:
        badge = "NO_MONOTONIC_TREND"
        caveats.append("No consistent monotonic direction detected over the selected timeframe.")
    else:
        badge = "INCREASING_NOT_SIGNIFICANT" if slope_yr > 0 else "DECREASING_NOT_SIGNIFICANT"
        caveats.append(
            f"Observed direction is {'upward' if slope_yr > 0 else 'downward'}, but p = {mk_p:.3f} "
            "does not cross the α = 0.05 significance threshold due to interannual variability."
        )

    enriched_series = []
    for i in range(n):
        enriched_series.append({
            "year": int(years[i]),
            "value": round(float(values[i]), 4),
            "ols_fitted": round(float(ols_fitted[i]), 4),
            "sen_fitted": round(float(sen_fitted[i]), 4),
            "anomaly": round(float(values[i] - mean_val), 4),
        })

    return {
        "series": enriched_series,
        "stats": {
            "n_years": n,
            "mean_value": round(mean_val, 4),
            "std_dev": round(std_val, 4),
            "ols_slope_per_year": round(slope_yr, 5),
            "ols_slope_per_decade": round(slope_dec, 4),
            "ols_r_squared": round(r_squared, 4),
            "ols_p_value": round(ols_p, 5),
            "ols_ci_lower_decade": round(slope_dec - ci_half_dec, 4),
            "ols_ci_upper_decade": round(slope_dec + ci_half_dec, 4),
            "mk_tau": round(float(tau), 4),
            "mk_z_score": round(float(z_mk), 3),
            "mk_p_value": round(float(mk_p), 5),
            "sen_slope_per_decade": round(float(sen_slope * 10.0), 4),
            "sen_ci_lower_decade": round(float(sen_low * 10.0), 4),
            "sen_ci_upper_decade": round(float(sen_high * 10.0), 4),
            "lag1_autocorrelation": round(lag1_corr, 3),
            "badge": badge,
            "caveats": caveats,
        },
    }
