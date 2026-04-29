import type { RiskItem } from "@/lib/types";
import { RiskCard } from "./RiskCard";
import { RiskSkeleton } from "./RiskSkeleton";

interface Props {
  risks: RiskItem[];
  isStreaming: boolean;
  expectedCount?: number;
}

export function StreamingResults({
  risks,
  isStreaming,
  expectedCount = 10,
}: Props) {
  const skeletonCount = isStreaming
    ? Math.max(0, expectedCount - risks.length)
    : 0;

  return (
    <div className="flex flex-col gap-3">
      {risks.map((risk, i) => (
        <RiskCard key={i} risk={risk} index={i} />
      ))}
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <RiskSkeleton key={`skeleton-${i}`} />
      ))}
    </div>
  );
}
