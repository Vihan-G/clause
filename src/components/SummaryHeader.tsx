import type { RiskItem, Severity, SeveritySummary } from "@/lib/types";
import { emptySummary } from "@/lib/types";

const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low"];

const DOT_STYLES: Record<Severity, string> = {
  critical: "bg-red-600",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-green-600",
};

const LABELS: Record<Severity, string> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

function summarize(risks: RiskItem[]): SeveritySummary {
  const summary = emptySummary();
  for (const r of risks) summary[r.severity] += 1;
  return summary;
}

export function SummaryHeader({ risks }: { risks: RiskItem[] }) {
  if (risks.length === 0) return null;
  const summary = summarize(risks);
  const parts = SEVERITY_ORDER.filter((s) => summary[s] > 0);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm shadow-sm">
      <span className="font-medium text-stone-900">
        {risks.length} {risks.length === 1 ? "clause" : "clauses"} flagged
      </span>
      <span className="text-stone-300">·</span>
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-stone-700">
        {parts.map((s) => (
          <li key={s} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className={`inline-block h-2 w-2 rounded-full ${DOT_STYLES[s]}`}
            />
            <span>
              <span className="font-semibold text-stone-900">{summary[s]}</span>{" "}
              {LABELS[s]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
