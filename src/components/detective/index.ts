/**
 * GeoPulse Analytics - Detective Presentation Layer Barrel Exports
 */

export * from "./CaseFileBar";
export * from "./QuestionWizardModal";
export * from "./EvidencePanel";
export * from "./ProvenanceCard";
export * from "./ReportExporter";

// Re-export shared types for consumers of the detective layer
export type {
  ConfidenceBadge,
  RegionInput,
  TimeSeriesPoint,
  StatisticalResult,
  RegionAnalysis,
  VerificationLink,
  ProvenanceInfo,
  AiInterpretation,
  InvestigationResponse,
  GoldenCaseMeta,
  WizardTheme,
} from "../../lib/types";
 * Detective Components Index Export
 * Exclusively owned by Dev 3 (Guided Detective UX & Storytelling Lead)
 */

export * from "./CaseFileBar";
export * from "./EvidencePanel";
export * from "./ProvenanceCard";
export * from "./QuestionWizardModal";
export * from "./ReportExporter";
