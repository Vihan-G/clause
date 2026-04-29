import { z } from "zod";
import { streamAnalysis } from "@/lib/anthropic";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  contractText: z
    .string()
    .min(50, "Contract is too short — paste at least a paragraph.")
    .max(120_000, "Contract is too long. Paste under ~120,000 characters."),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const text of streamAnalysis(parsed.data.contractText)) {
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Analysis failed unexpectedly.";
        controller.enqueue(
          encoder.encode(
            `\n${JSON.stringify({ __error: message })}\n`,
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
