export function RiskSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading risk"
      className="animate-pulse rounded-lg border-l-4 border-stone-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <div className="h-5 w-16 rounded-full bg-stone-200" />
        <div className="h-4 w-40 rounded bg-stone-200" />
      </div>
      <div className="mt-4 h-3 w-full rounded bg-stone-100" />
      <div className="mt-2 h-3 w-5/6 rounded bg-stone-100" />
      <div className="mt-2 h-3 w-2/3 rounded bg-stone-100" />
    </div>
  );
}
