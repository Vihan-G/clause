export type Severity = "critical" | "high" | "medium" | "low";

export interface RiskItem {
  severity: Severity;
  title: string;
  quote: string;
  plain_english: string;
  why_it_matters: string;
  negotiable: boolean;
}

export interface AnalyzeRequest {
  contractText: string;
}

export type SeveritySummary = Record<Severity, number>;

export function emptySummary(): SeveritySummary {
  return { critical: 0, high: 0, medium: 0, low: 0 };
}

export function isRiskItem(value: unknown): value is RiskItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (v.severity === "critical" ||
      v.severity === "high" ||
      v.severity === "medium" ||
      v.severity === "low") &&
    typeof v.title === "string" &&
    typeof v.quote === "string" &&
    typeof v.plain_english === "string" &&
    typeof v.why_it_matters === "string" &&
    typeof v.negotiable === "boolean"
  );
}
