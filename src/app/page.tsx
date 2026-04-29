"use client";

import { useCallback, useRef, useState } from "react";
import { ContractInput } from "@/components/ContractInput";
import { Disclaimer } from "@/components/Disclaimer";
import { StreamingResults } from "@/components/StreamingResults";
import { SummaryHeader } from "@/components/SummaryHeader";
import { NDJSONParser } from "@/lib/parse-stream";
import { EXAMPLE_CONTRACT } from "@/lib/prompts";
import type { RiskItem } from "@/lib/types";

export default function Home() {
  const [contractText, setContractText] = useState("");
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsAnalyzing(true);
    setRisks([]);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractText }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const message =
          (await res.json().catch(() => null))?.error ?? "Analysis failed.";
        throw new Error(message);
      }
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      const parser = new NDJSONParser();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        const items = parser.push(text);
        if (items.length) setRisks((prev) => prev.concat(items));
      }

      const tail = decoder.decode();
      const finalItems = [
        ...(tail ? parser.push(tail) : []),
        ...parser.flush(),
      ];
      if (finalItems.length) setRisks((prev) => prev.concat(finalItems));
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [contractText]);

  const loadExample = useCallback(() => {
    setContractText(EXAMPLE_CONTRACT);
    setError(null);
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-[780px] flex-col gap-8 px-5 py-12 sm:py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          clause
        </h1>
        <p className="text-sm leading-6 text-stone-600 sm:text-base">
          Paste any contract. Get the 10 clauses that could actually hurt you,
          explained in plain English.
        </p>
      </header>

      <ContractInput
        value={contractText}
        onChange={setContractText}
        onSubmit={analyze}
        onLoadExample={loadExample}
        isAnalyzing={isAnalyzing}
        error={error}
      />

      {(isAnalyzing || risks.length > 0) && (
        <section className="flex flex-col gap-3">
          <SummaryHeader risks={risks} />
          <StreamingResults risks={risks} isStreaming={isAnalyzing} />
        </section>
      )}

      <Disclaimer />
    </main>
  );
}
