import { isRiskItem, type RiskItem } from "./types";

export class NDJSONParser {
  private buffer = "";

  push(chunk: string): RiskItem[] {
    this.buffer += chunk;
    const out: RiskItem[] = [];
    let newlineIndex: number;
    while ((newlineIndex = this.buffer.indexOf("\n")) !== -1) {
      const line = this.buffer.slice(0, newlineIndex).trim();
      this.buffer = this.buffer.slice(newlineIndex + 1);
      const item = parseLine(line);
      if (item) out.push(item);
    }
    return out;
  }

  flush(): RiskItem[] {
    const tail = this.buffer.trim();
    this.buffer = "";
    if (!tail) return [];
    const item = parseLine(tail);
    return item ? [item] : [];
  }
}

function parseLine(line: string): RiskItem | null {
  if (!line) return null;
  const start = line.indexOf("{");
  const end = line.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const candidate = line.slice(start, end + 1);
  try {
    const parsed = JSON.parse(candidate);
    return isRiskItem(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
