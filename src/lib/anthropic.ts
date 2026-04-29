import Anthropic from "@anthropic-ai/sdk";
import { ANALYZE_PROMPT } from "./prompts";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

export const ANALYZE_MODEL = "claude-sonnet-4-5";
export const ANALYZE_MAX_TOKENS = 4000;

export async function* streamAnalysis(contractText: string): AsyncGenerator<string> {
  const stream = await getClient().messages.create({
    model: ANALYZE_MODEL,
    max_tokens: ANALYZE_MAX_TOKENS,
    stream: true,
    system: ANALYZE_PROMPT,
    messages: [{ role: "user", content: contractText }],
  });

  for await (const chunk of stream) {
    if (
      chunk.type === "content_block_delta" &&
      chunk.delta.type === "text_delta"
    ) {
      yield chunk.delta.text;
    }
  }
}
