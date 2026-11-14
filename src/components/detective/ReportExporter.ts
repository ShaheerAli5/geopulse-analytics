/**
 * Report Exporter
 * GeoPulse Analytics - Exclusively Owned by Dev 3
 * Generates reproducible Markdown report & supports Print-to-PDF
 */

import { InvestigationResponse } from "@/types/investigation";

function formatCoordStr(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir}`;
}

export function exportInvestigationMarkdown(data: InvestigationResponse): void {
  const regA = data.region_a;
  const regB = data.region_b;

  const coordStrA = formatCoordStr(regA.region.lat, regA.region.lon);
  const coordStrB = regB ? formatCoordStr(regB.region.lat, regB.region.lon) : "N/A";

  const md = `# GeoPulse Analytics — Earth System Trend Detective Report
**Investigation ID:** \`${data.investigation_id}\`  
**Generated Date:** ${new Date().toISOString()}  
**NASA Variable:** ${data.variable_name} (\`${data.variable_id}\`)  
**Units:** ${data.units}  
**Aggregation Mode:** ${data.aggregation_mode}  
**Temporal Window:** ${data.start_year} – ${data.end_year}  

---

## 1. Executive Summary & Verdict
**${data.ai_interpretation.headline}**

- **Observed Change:** ${data.ai_interpretation.what_is_changing}
- **Regional Divergence:** ${data.ai_interpretation.where_it_diverges}
- **Statistical Verdict:** ${data.ai_interpretation.statistical_verdict}
- **Limitations & Caveats:** ${data.ai_interpretation.limitations_and_caveats}

---

## 2. Statistical Comparison Scorecard

| Metric | Region A: ${regA.region.name} | ${regB ? `Region B: ${regB.region.name}` : "Region B"} |
| :--- | :--- | :--- |
| **Coordinates** | ${coordStrA} | ${coordStrB} |
| **Observation Years** | ${regA.stats.n_years} | ${regB ? regB.stats.n_years : "N/A"} |
| **Mean Value** | ${regA.stats.mean_value} ${data.units} | ${regB ? `${regB.stats.mean_value} ${data.units}` : "N/A"} |
| **Standard Deviation** | ${regA.stats.std_dev} | ${regB ? regB.stats.std_dev : "N/A"} |
| **OLS Slope (/decade)** | ${regA.stats.ols_slope_per_decade >= 0 ? "+" : ""}${regA.stats.ols_slope_per_decade} | ${regB ? `${regB.stats.ols_slope_per_decade >= 0 ? "+" : ""}${regB.stats.ols_slope_per_decade}` : "N/A"} |
| **Sen's Slope (/decade)** | ${regA.stats.sen_slope_per_decade >= 0 ? "+" : ""}${regA.stats.sen_slope_per_decade} | ${regB ? `${regB.stats.sen_slope_per_decade >= 0 ? "+" : ""}${regB.stats.sen_slope_per_decade}` : "N/A"} |
| **95% Confidence Interval** | [${regA.stats.ols_ci_lower_decade}, ${regA.stats.ols_ci_upper_decade}] | ${regB ? `[${regB.stats.ols_ci_lower_decade}, ${regB.stats.ols_ci_upper_decade}]` : "N/A"} |
| **Mann–Kendall p-value** | ${regA.stats.mk_p_value} | ${regB ? regB.stats.mk_p_value : "N/A"} |
| **Kendall's τ (Z-score)** | ${regA.stats.mk_tau} (${regA.stats.mk_z_score}) | ${regB ? `${regB.stats.mk_tau} (${regB.stats.mk_z_score})` : "N/A"} |
| **OLS R²** | ${regA.stats.ols_r_squared} | ${regB ? regB.stats.ols_r_squared : "N/A"} |
| **Lag-1 Autocorrelation** | ${regA.stats.lag1_autocorrelation} | ${regB ? regB.stats.lag1_autocorrelation : "N/A"} |
| **Confidence Badge** | \`${regA.stats.badge}\` | ${regB ? `\`${regB.stats.badge}\`` : "N/A"} |

---

## 3. NASA Provenance & Verification
- **Primary Source:** ${data.provenance.source_name}
- **Mission / Model:** ${data.provenance.mission_model}
- **API Endpoint:** \`${data.provenance.api_endpoint}\`
- **Spatial Resolution:** ${data.provenance.spatial_resolution}
- **Missing Months Excluded:** ${data.provenance.missing_months_filtered}
- **Retrieved At (UTC):** ${data.provenance.retrieved_at_utc}

### Verification Links
${data.provenance.verification_links.map((link) => `- [${link.label}](${link.url})`).join("\n")}

---
*Report generated automatically by GeoPulse Analytics — 2026 NASA Space Apps Challenge.*
`;

  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `GeoPulse_Case_${data.investigation_id}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printInvestigationReport(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}
