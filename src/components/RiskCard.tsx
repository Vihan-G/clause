import type { RiskItem, Severity } from "@/lib/types";
import { SeverityBadge } from "./SeverityBadge";

const CARD_STYLES: Record<Severity, string> = {
  critical: "border-l-red-600 bg-red-50",
  high: "border-l-orange-600 bg-orange-50",
  medium: "border-l-yellow-600 bg-yellow-50",
  low: "border-l-green-600 bg-green-50",
};

const TITLE_STYLES: Record<Severity, string> = {
  critical: "text-red-900",
  high: "text-orange-900",
  medium: "text-yellow-900",
  low: "text-green-900",
};

interface Props {
  risk: RiskItem;
  index: number;
}

export function RiskCard({ risk, index }: Props) {
  return (
    <article
      style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
      className={`fade-up rounded-lg border border-stone-200 border-l-4 p-5 shadow-sm ${CARD_STYLES[risk.severity]}`}
    >
      <header className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={risk.severity} />
        <h3 className={`text-base font-semibold ${TITLE_STYLES[risk.severity]}`}>
          {risk.title}
        </h3>
        <span
          className={`ml-auto inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
            risk.negotiable
              ? "bg-emerald-100 text-emerald-800"
              : "bg-stone-200 text-stone-700"
          }`}
        >
          {risk.negotiable ? "Negotiable" : "Standard"}
        </span>
      </header>

      <blockquote className="mt-3 rounded-md border border-stone-200 bg-white/60 px-3 py-2 font-mono text-[13px] leading-5 text-stone-700">
        “{risk.quote}”
      </blockquote>

      <p className="mt-3 text-sm leading-6 text-stone-800">
        {risk.plain_english}
      </p>

      <p className="mt-2 text-sm leading-6 text-stone-700">
        <span className="font-medium text-stone-900">Why it matters: </span>
        {risk.why_it_matters}
      </p>
    </article>
  );
}
