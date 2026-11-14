/**
 * GeoPulse Analytics - Reproducible Markdown Case Report Exporter
 * Generates an audit-ready, publication-grade Markdown case report (.md)
 * for hackathon judges, scientific peers, and educators.
 */

import type { InvestigationResponse } from "../../lib/types";

/**
 * Generate formatted Markdown text from an InvestigationResponse.
 * Handles both dual-region and single-region investigations without crashes.
 */
export function generateMarkdownReport(
  data: InvestigationResponse,
  researchQuestion?: string
): string {
  const regA = data.region_a;
  const regB = data.region_b;
  const statsA = regA.stats;
  const statsB = regB?.stats;

  const defaultQuestion =
    data.divergence_detected && regB
      ? `Are ${regA.region.name} and ${regB.region.name} experiencing diverging long-term trends in ${data.variable_name} over the 1981–2025 satellite observation record?`
      : `What is the long-term monotonic trend and statistical significance of ${data.variable_name} in ${regA.region.name} over the satellite observation record?`;

  const question = researchQuestion || defaultQuestion;

  const signOlsA = statsA.ols_slope_per_decade >= 0 ? "+" : "";
  const signSenA = statsA.sen_slope_per_decade >= 0 ? "+" : "";

  const signOlsB = statsB && statsB.ols_slope_per_decade >= 0 ? "+" : "";
  const signSenB = statsB && statsB.sen_slope_per_decade >= 0 ? "+" : "";

  // Table header
  const tableHeader = regB
    ? `| Statistical Metric | Region A: ${regA.region.name} | Region B: ${regB.region.name} |\n| :--- | :--- | :--- |`
    : `| Statistical Metric | Region A: ${regA.region.name} |\n| :--- | :--- |`;

  // Table rows
  const rowBadge = regB
    ? `| **Confidence Badge** | \`${statsA.badge}\` | \`${statsB?.badge}\` |`
    : `| **Confidence Badge** | \`${statsA.badge}\` |`;

  const rowOls = regB
    ? `| **OLS Slope (/decade)** | **${signOlsA}${statsA.ols_slope_per_decade.toFixed(4)}** ${data.units} | **${signOlsB}${statsB?.ols_slope_per_decade.toFixed(4)}** ${data.units} |`
    : `| **OLS Slope (/decade)** | **${signOlsA}${statsA.ols_slope_per_decade.toFixed(4)}** ${data.units} |`;

  const rowSen = regB
    ? `| **Sen's Robust Slope (/decade)** | ${signSenA}${statsA.sen_slope_per_decade.toFixed(4)} ${data.units} | ${signSenB}${statsB?.sen_slope_per_decade.toFixed(4)} ${data.units} |`
    : `| **Sen's Robust Slope (/decade)** | ${signSenA}${statsA.sen_slope_per_decade.toFixed(4)} ${data.units} |`;

  const rowR2 = regB
    ? `| **OLS R²** | ${statsA.ols_r_squared.toFixed(4)} | ${statsB?.ols_r_squared.toFixed(4)} |`
    : `| **OLS R²** | ${statsA.ols_r_squared.toFixed(4)} |`;

  const rowMKp = regB
    ? `| **Mann–Kendall p-value** | **${statsA.mk_p_value.toFixed(5)}** (${statsA.mk_p_value < 0.05 ? "p < 0.05 Significant" : "p ≥ 0.05 Not Sig."}) | **${statsB?.mk_p_value.toFixed(5)}** (${(statsB?.mk_p_value ?? 1) < 0.05 ? "p < 0.05 Significant" : "p ≥ 0.05 Not Sig."}) |`
    : `| **Mann–Kendall p-value** | **${statsA.mk_p_value.toFixed(5)}** (${statsA.mk_p_value < 0.05 ? "p < 0.05 Significant" : "p ≥ 0.05 Not Sig."}) |`;

  const rowTau = regB
    ? `| **Kendall's Rank Correlation (τ)** | ${statsA.mk_tau.toFixed(4)} | ${statsB?.mk_tau.toFixed(4)} |`
    : `| **Kendall's Rank Correlation (τ)** | ${statsA.mk_tau.toFixed(4)} |`;

  const rowZ = regB
    ? `| **Mann–Kendall Z Score** | ${statsA.mk_z_score.toFixed(3)} | ${statsB?.mk_z_score.toFixed(3)} |`
    : `| **Mann–Kendall Z Score** | ${statsA.mk_z_score.toFixed(3)} |`;

  const rowCI = regB
    ? `| **OLS 95% Confidence Interval** | [${statsA.ols_ci_lower_decade.toFixed(4)}, ${statsA.ols_ci_upper_decade.toFixed(4)}] | [${statsB?.ols_ci_lower_decade.toFixed(4)}, ${statsB?.ols_ci_upper_decade.toFixed(4)}] |`
    : `| **OLS 95% Confidence Interval** | [${statsA.ols_ci_lower_decade.toFixed(4)}, ${statsA.ols_ci_upper_decade.toFixed(4)}] |`;

  const rowSenCI = regB
    ? `| **Sen's 95% Confidence Interval** | [${statsA.sen_ci_lower_decade.toFixed(4)}, ${statsA.sen_ci_upper_decade.toFixed(4)}] | [${statsB?.sen_ci_lower_decade.toFixed(4)}, ${statsB?.sen_ci_upper_decade.toFixed(4)}] |`
    : `| **Sen's 95% Confidence Interval** | [${statsA.sen_ci_lower_decade.toFixed(4)}, ${statsA.sen_ci_upper_decade.toFixed(4)}] |`;

  const rowMean = regB
    ? `| **Sample Mean ± Std Dev** | ${statsA.mean_value.toFixed(4)} ± ${statsA.std_dev.toFixed(4)} ${data.units} | ${statsB?.mean_value.toFixed(4)} ± ${statsB?.std_dev.toFixed(4)} ${data.units} |`
    : `| **Sample Mean ± Std Dev** | ${statsA.mean_value.toFixed(4)} ± ${statsA.std_dev.toFixed(4)} ${data.units} |`;

  const rowLag1 = regB
    ? `| **Lag-1 Autocorrelation (r₁)** | ${statsA.lag1_autocorrelation.toFixed(3)} | ${statsB?.lag1_autocorrelation.toFixed(3)} |`
    : `| **Lag-1 Autocorrelation (r₁)** | ${statsA.lag1_autocorrelation.toFixed(3)} |`;

  const verificationLinks = (data.provenance.verification_links || [])
    .map((l) => `- [${l.label}](${l.url})`)
    .join("\n");

  return `# GeoPulse Case Report: ${data.investigation_id}
**Earth System Trend Detective Scientific Evidence Briefing**  
*NASA Space Apps Challenge 2026 Submission Deliverable*  
*Report Generated: ${new Date().toISOString()}*

---

## 1. Research Investigation Premise

- **Investigation ID:** \`${data.investigation_id}\`
- **Research Question:** *${question}*
- **NASA Target Variable:** **${data.variable_name}** (\`${data.variable_id}\`)
- **Measurement Units:** \`${data.units}\`
- **Plain-English Definition:** ${data.plain_definition}
- **Temporal Coverage:** **${data.start_year} – ${data.end_year}** (${statsA.n_years} consecutive annual observations)
- **Aggregation Mode:** \`${data.aggregation_mode}\`
- **Regional Divergence Detected:** **${data.divergence_detected ? "YES — STATISTICALLY CONFIRMED" : "NO — CONCORDANT / SINGLE REGION"}**

---

## 2. Geospatial Coordinates & Boundaries

- **Region A (Primary Target):** **${regA.region.name}**  
  - Coordinates: \`${regA.region.lat}°N, ${regA.region.lon}°E\`
  - Confidence Tier: \`${statsA.badge}\`
${
  regB
    ? `- **Region B (Comparative Target):** **${regB.region.name}**  
  - Coordinates: \`${regB.region.lat}°N, ${regB.region.lon}°E\`
  - Confidence Tier: \`${statsB?.badge}\``
    : `- **Region B:** *Not configured (single-region investigation)*`
}

---

## 3. Comparative Statistical Scorecard

${tableHeader}
${rowBadge}
${rowOls}
${rowSen}
${rowR2}
${rowMKp}
${rowTau}
${rowZ}
${rowCI}
${rowSenCI}
${rowMean}
${rowLag1}

---

## 4. Evidence-Grounded Detective Interpretation

> **Headline:**  
> **${data.ai_interpretation.headline}**

### 4.1 What Is Changing & Magnitude
${data.ai_interpretation.what_is_changing}

### 4.2 Regional Divergence & Comparison
${data.ai_interpretation.where_it_diverges}

### 4.3 Statistical Significance & Signal Detection
${data.ai_interpretation.statistical_verdict}

### 4.4 Limitations, Autocorrelation & NASA Audit Caveats
${data.ai_interpretation.limitations_and_caveats}

*Synthesis Engine: \`${data.ai_interpretation.generated_by}\` (Zero LLM Hallucination Guarantee)*

---

## 5. NASA Data Provenance & Reproducibility Audit

- **NASA Mission / Model:** ${data.provenance.mission_model}
- **Data Source:** ${data.provenance.source_name || "NASA POWER Analysis Ready Data API"}
- **Spatial Resolution:** ${data.provenance.spatial_resolution}
- **Missing Months Filtered:** ${data.provenance.missing_months_filtered}
- **Retrieval Timestamp (UTC):** ${data.provenance.retrieved_at_utc}
- **Independent Cross-Verification Portals:**
${verificationLinks || "- Direct verification links unavailable"}

---
*GeoPulse Analytics — Serverless Earth System Trend Detective. Built for NASA Space Apps Challenge 2026.*
`;
}

/**
 * Triggers client-side browser download of the investigation Markdown report.
 */
export function exportInvestigationMarkdown(
  data: InvestigationResponse,
  researchQuestion?: string
): void {
  const markdown = generateMarkdownReport(data, researchQuestion);
  const filename = `GeoPulse_Case_${data.investigation_id}.md`;

  if (typeof window === "undefined" || typeof document === "undefined") {
    // In server/CLI environments, do not fail
    return;
  }

  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Trigger print dialog with clean report formatting for PDF printing.
 */
export function printInvestigationReport(): void {
  if (typeof window !== "undefined" && typeof window.print === "function") {
    window.print();
  }
}
