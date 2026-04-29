"use client";

import { useId } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onLoadExample: () => void;
  isAnalyzing: boolean;
  error: string | null;
}

const MIN_CHARS = 50;

export function ContractInput({
  value,
  onChange,
  onSubmit,
  onLoadExample,
  isAnalyzing,
  error,
}: Props) {
  const textareaId = useId();
  const charCount = value.length;
  const canSubmit = charCount >= MIN_CHARS && !isAnalyzing;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-stone-700"
        >
          Paste your contract
        </label>
        <button
          type="button"
          onClick={onLoadExample}
          disabled={isAnalyzing}
          className="text-xs text-stone-500 underline-offset-2 hover:text-stone-900 hover:underline disabled:opacity-40"
        >
          Load example lease
        </button>
      </div>

      <textarea
        id={textareaId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isAnalyzing}
        placeholder="Paste any contract here — lease, NDA, offer letter, terms of service. We'll surface the 10 clauses worth a second look."
        className="min-h-[260px] w-full resize-y rounded-lg border border-stone-300 bg-white px-4 py-3 text-sm leading-6 text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 disabled:bg-stone-100"
        spellCheck={false}
      />

      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          {charCount.toLocaleString()} characters
          {charCount > 0 && charCount < MIN_CHARS
            ? ` · need ${MIN_CHARS - charCount} more`
            : ""}
        </span>
        {error ? <span className="text-red-700">{error}</span> : null}
      </div>

      <button
        type="submit"
        disabled={!canSubmit}
        className="self-end rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {isAnalyzing ? "Analyzing…" : "Analyze contract"}
      </button>
    </form>
  );
}
