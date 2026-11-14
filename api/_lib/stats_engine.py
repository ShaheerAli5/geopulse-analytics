"""
Statistical Analysis Engine
Computes Ordinary Least Squares (OLS) regression, Mann-Kendall trend test,
Theil-Sen robust slope, 95% confidence intervals, lag-1 autocorrelation diagnostics,
and the 6-tier ConfidenceBadge.
"""

import math
from typing import Any, Dict, List
import numpy as np
from scipy import stats


def _clean_float(val: Any, default: float = 0.0, ndigits: int | None = None) -> float:
    """Safely converts and sanitizes a float, preventing NaN, Inf, and -0.0 in JSON."""
    if val is None:
        return default
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return default
        if abs(f) < 1e-12:
            f = 0.0
        if ndigits is not None:
            return round(f, ndigits)
        return f
    except (ValueError, TypeError):
        return default


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
        mean_fallback = _clean_float(np.mean(values)) if n > 0 else 0.0
        for r in records:
            v = _clean_float(r["value"], ndigits=4)
            enriched_series.append({
                "year": int(r["year"]),
                "value": v,
                "ols_fitted": v,
                "sen_fitted": v,
                "anomaly": _clean_float(v - mean_fallback, ndigits=4),
            })
        return {
            "series": enriched_series,
            "stats": {
                "n_years": n,
                "mean_value": _clean_float(mean_fallback, ndigits=4),
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

    mean_val = _clean_float(np.mean(values))
    std_val = _clean_float(np.std(values, ddof=1)) if n > 1 else 0.0

    # Handle perfectly constant or zero-variance series
    if std_val < 1e-9 or len(set(values)) <= 1:
        enriched_series = []
        for r in records:
            enriched_series.append({
                "year": int(r["year"]),
                "value": _clean_float(r["value"], ndigits=4),
                "ols_fitted": _clean_float(mean_val, ndigits=4),
                "sen_fitted": _clean_float(mean_val, ndigits=4),
                "anomaly": 0.0,
            })
        return {
            "series": enriched_series,
            "stats": {
                "n_years": n,
                "mean_value": _clean_float(mean_val, ndigits=4),
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
                "badge": "NO_MONOTONIC_TREND",
                "caveats": ["No monotonic trend detected; observations are constant across the timeframe."],
            },
        }

    # 1. Ordinary Least Squares (OLS) Linear Regression
    ols = stats.linregress(years, values)
    slope_yr = _clean_float(ols.slope)
    slope_dec = _clean_float(slope_yr * 10.0)
    r_squared = _clean_float(ols.rvalue ** 2)
    ols_p = _clean_float(ols.pvalue, default=1.0)
    stderr = _clean_float(ols.stderr)
    t_crit = _clean_float(stats.t.ppf(0.975, df=n - 2)) if n > 2 else 0.0
    ci_half_dec = _clean_float(t_crit * stderr * 10.0)

    # 2. Mann-Kendall Non-Parametric Trend Test
    tau_raw, mk_p_raw = stats.kendalltau(years, values)
    tau = _clean_float(tau_raw, default=0.0)
    mk_p = _clean_float(mk_p_raw, default=1.0)

    # Compute explicit S and tie-corrected variance
    s_stat = 0
    for i in range(n - 1):
        s_stat += int(np.sum(np.sign(values[i + 1:] - values[i])))

    _, tie_counts = np.unique(values, return_counts=True)
    tie_term = sum(int(t * (t - 1) * (2 * t + 5)) for t in tie_counts if t > 1)
    var_s = (n * (n - 1) * (2 * n + 5) - tie_term) / 18.0

    if var_s > 0:
        if s_stat > 0:
            z_mk = (s_stat - 1) / np.sqrt(var_s)
        elif s_stat < 0:
            z_mk = (s_stat + 1) / np.sqrt(var_s)
        else:
            z_mk = 0.0
    else:
        z_mk = 0.0
    z_mk = _clean_float(z_mk)

    # 3. Theil-Sen Robust Slope Estimator
    try:
        sen_slope, sen_intercept, sen_low, sen_high = stats.theilslopes(values, years, 0.95)
    except Exception:
        sen_slope, sen_intercept, sen_low, sen_high = slope_yr, _clean_float(ols.intercept), slope_yr, slope_yr

    sen_slope = _clean_float(sen_slope)
    sen_intercept = _clean_float(sen_intercept, default=mean_val)
    sen_low = _clean_float(sen_low)
    sen_high = _clean_float(sen_high)

    # 4. Lag-1 Autocorrelation on OLS Residuals
    ols_intercept = _clean_float(ols.intercept, default=mean_val)
    ols_fitted = ols_intercept + slope_yr * years
    sen_fitted = sen_intercept + sen_slope * years
    residuals = values - ols_fitted
    if n > 3 and np.std(residuals) > 1e-9:
        corr_mat = np.corrcoef(residuals[:-1], residuals[1:])
        lag1_corr = _clean_float(corr_mat[0, 1], default=0.0)
    else:
        lag1_corr = 0.0

    # 5. Classify Confidence Badge & Caveats
    caveats = []
    if abs(lag1_corr) > 0.30:
        caveats.append(
            f"Moderate lag-1 serial autocorrelation detected (r1 = {lag1_corr:.2f}); "
            "effective degrees of freedom may be lower than sample count."
        )
    if n < 20:
        caveats.append(f"Short record length ({n} years); climate normals typically span 30+ years.")

    if abs(slope_yr) < 1e-9 or (abs(tau) < 0.03 and mk_p >= 0.50):
        badge = "NO_MONOTONIC_TREND"
        caveats.append("No consistent monotonic direction detected over the selected timeframe.")
    elif mk_p < 0.05:
        badge = "INCREASING_SIGNIFICANT" if slope_yr > 0 else "DECREASING_SIGNIFICANT"
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
            "value": _clean_float(values[i], ndigits=4),
            "ols_fitted": _clean_float(ols_fitted[i], ndigits=4),
            "sen_fitted": _clean_float(sen_fitted[i], ndigits=4),
            "anomaly": _clean_float(values[i] - mean_val, ndigits=4),
        })

    return {
        "series": enriched_series,
        "stats": {
            "n_years": n,
            "mean_value": _clean_float(mean_val, ndigits=4),
            "std_dev": _clean_float(std_val, ndigits=4),
            "ols_slope_per_year": _clean_float(slope_yr, ndigits=5),
            "ols_slope_per_decade": _clean_float(slope_dec, ndigits=4),
            "ols_r_squared": _clean_float(r_squared, ndigits=4),
            "ols_p_value": _clean_float(ols_p, ndigits=5),
            "ols_ci_lower_decade": _clean_float(slope_dec - ci_half_dec, ndigits=4),
            "ols_ci_upper_decade": _clean_float(slope_dec + ci_half_dec, ndigits=4),
            "mk_tau": _clean_float(tau, ndigits=4),
            "mk_z_score": _clean_float(z_mk, ndigits=3),
            "mk_p_value": _clean_float(mk_p, ndigits=5),
            "sen_slope_per_decade": _clean_float(sen_slope * 10.0, ndigits=4),
            "sen_ci_lower_decade": _clean_float(sen_low * 10.0, ndigits=4),
            "sen_ci_upper_decade": _clean_float(sen_high * 10.0, ndigits=4),
            "lag1_autocorrelation": _clean_float(lag1_corr, ndigits=3),
            "badge": badge,
            "caveats": caveats,
        },
    }

