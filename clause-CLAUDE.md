# clause — CLAUDE.md

Inherit all rules from /Users/vihangoenka/Claude Projects/CLAUDE.md.

---

## What we're building

**clause** — Paste any contract. Get the 10 clauses that could actually hurt you,
explained in plain English.

No login. No document type restriction. Lease, NDA, employment offer, freelance
agreement, terms of service, subscription contract — anything. You paste text,
you get a prioritized list of risks with the exact clause quoted and a plain-English
explanation of why it matters.

Target users: anyone who signs things. Students signing leases. Freelancers reviewing
client contracts. Employees reading offer letters. That's hundreds of millions of people
who currently either skim contracts or pay a lawyer $300/hr to read them.

Why it's different: everything existing (LegalZoom, DoNotPay, etc.) only handles
specific document types with structured templates. Clause handles anything, instantly,
for free.

The product is trust. It doesn't replace a lawyer — it tells you which 10 things
to pay attention to so you know when you actually need one.

---

## Tech stack

- Next.js 14, App Router, TypeScript, Tailwind, src/ layout
- `@anthropic-ai/sdk` with streaming — analysis streams in section by section
- `react-markdown` — renders the explanation text cleanly
- No database. No auth. No external APIs.

```bash
npm install @anthropic-ai/sdk react-markdown zod
```

---

## How it works

1. User pastes raw contract text into a large textarea (or eventually drag-drops a .txt/.pdf)

2. `/api/analyze/route.ts` — streaming route. Claude receives the full contract text
   and streams back a structured analysis.

3. Claude returns exactly 10 risk items, ordered by severity (critical → high → medium → low).
   Each item has:
   - severity: "critical" | "high" | "medium" | "low"
   - title: short label (e.g., "Automatic renewal clause")
   - quote: the exact sentence(s) from the contract that are the problem
   - plain_english: what this means in normal language (2-3 sentences)
   - why_it_matters: what could actually happen to you because of this (1-2 sentences)
   - negotiable: boolean — is this typically negotiable or standard boilerplate?

4. Frontend streams results in — cards appear one by one as Claude finishes each.
   Don't wait for the full response. Stream it.

---

## File structure

```
src/
  app/
    page.tsx                   ← input + streaming results
    api/
      analyze/route.ts         ← streaming analysis endpoint
    layout.tsx
    globals.css
  components/
    ContractInput.tsx           ← large textarea, char count, example contract button
    RiskCard.tsx                ← one clause risk (severity badge, quote, explanation)
    RiskSkeleton.tsx            ← pulse placeholder while a card is loading in
    SeverityBadge.tsx           ← critical/high/medium/low pill
    StreamingResults.tsx        ← manages the list of cards as they stream in
    SummaryHeader.tsx           ← "X critical, Y high, Z medium" summary bar
    Disclaimer.tsx              ← "not legal advice"
  lib/
    anthropic.ts                ← Anthropic client + streaming helper
    prompts.ts                  ← system prompt lives here
    types.ts                    ← RiskItem, Analysis interfaces
    parse-stream.ts             ← parses NDJSON chunks from the stream
```

---

## Streaming implementation

Use Server-Sent Events pattern with Next.js streaming response:

```typescript
// api/analyze/route.ts
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: Request) {
  const { contractText } = await req.json()

  const client = new Anthropic()
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        stream: true,
        system: ANALYZE_PROMPT,
        messages: [{ role: 'user', content: contractText }]
      })

      for await (const chunk of response) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    }
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
```

On the frontend, use `fetch` with `response.body.getReader()` to read chunks and
accumulate them. Parse completed JSON objects as they arrive (Claude will emit one
risk item at a time as a JSON object per line — NDJSON format).

Tell Claude in the prompt to emit each risk item as a separate JSON line so the
frontend can parse incrementally.

---

## Prompt (lib/prompts.ts)

```
You are a contract risk analyst. Your job is to identify the 10 most important
clauses in a contract that the signer should understand before signing.

You will receive raw contract text. Analyze it and return exactly 10 risk items.

Output format: emit each risk item as a single line of valid JSON (NDJSON).
One JSON object per line. No array wrapper. No markdown. No preamble. No summary.
Just 10 lines of JSON, one per risk item, in order from most to least severe.

Each line must be a valid JSON object with exactly these fields:
{
  "severity": "critical" | "high" | "medium" | "low",
  "title": "short name for this clause type",
  "quote": "the exact sentence or phrase from the contract",
  "plain_english": "what this actually means in plain language, 2-3 sentences",
  "why_it_matters": "what could concretely happen to you because of this, 1-2 sentences",
  "negotiable": true | false
}

Rules:
- Quote the actual contract language, word for word. Never paraphrase the quote field.
- plain_english must be genuinely plain — no legal jargon.
- why_it_matters must be concrete — "you could lose your deposit" not "this could affect you."
- severity = critical only for clauses that could result in financial loss, legal liability,
  or severe restriction of rights. Use it sparingly.
- If the contract is clearly benign (e.g., a simple one-page NDA with standard terms),
  say so in the first item with severity "low" and continue with the remaining 9.
- If fewer than 10 meaningful clauses exist, fill remaining items with "info" observations
  about what standard protections are MISSING from this contract.
- negotiable = true for non-standard terms that a lawyer could push back on.
  negotiable = false for regulatory requirements or truly standard boilerplate.
```

---

## UI design direction

- Background: `#fafaf9` — warm off-white
- Severity colors:
  - critical: `#fef2f2` bg, `#991b1b` text, `#dc2626` left border (4px)
  - high: `#fff7ed` bg, `#9a3412` text, `#ea580c` left border
  - medium: `#fefce8` bg, `#854d0e` text, `#ca8a04` left border
  - low: `#f0fdf4` bg, `#166534` text, `#16a34a` left border
- Each RiskCard has a thick left border in the severity color — scannable at a glance
- Quote field: monospace font, slightly inset, like a blockquote
- Negotiable badge: small green pill "Negotiable" or gray pill "Standard"
- Cards stream in with a subtle fade-up animation (opacity 0 → 1, translateY 8px → 0)
- Input side: clean, minimal. Big textarea, one CTA button "Analyze contract"
- Max width: 780px centered
- No navbar. No footer. Tool only.
- Loading state: show RiskSkeleton cards (pulsing) while first real card hasn't arrived yet.
  Replace skeletons with real cards as they stream in.

---

## Environment variables

```
ANTHROPIC_API_KEY=your_key_here
```

---

## Example contract (hardcode this for the "Load example" button)

Use a simplified apartment lease excerpt with 3-4 intentionally problematic clauses
(automatic renewal, landlord entry without notice, non-refundable "cleaning fee"
that covers normal wear and tear, unilateral rent increase clause). Write this
yourself — don't pull from any real source.

---

## Setup commands

```bash
cd "/Users/vihangoenka/Claude Projects"

npx create-next-app@latest clause --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint

cd clause

npm install @anthropic-ai/sdk react-markdown zod

git init
git add .
git commit -m "chore: initial scaffold"
gh repo create clause --public --source=. --remote=origin --push
vercel --yes
touch .env.local
echo "ANTHROPIC_API_KEY=" >> .env.local
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "chore: env setup and gitignore"
git push origin main
```

---

## Milestone commits (one session, ship it all)

1. `chore: types, prompts, anthropic streaming client`
2. `feat: streaming analyze API route`
3. `feat: contract input and loading skeletons`
4. `feat: risk cards with severity colors and streaming render`
5. `feat: summary header and disclaimer`
6. `feat: complete end-to-end streaming flow`
7. `docs: README, vercel prod deploy, v1.0.0 release`

After commit 7:
```bash
vercel --prod
gh release create v1.0.0 --title "clause v1.0.0" --notes "Paste any contract. Get the 10 clauses that could hurt you, explained in plain English. No login required."
gh repo edit --add-topic contracts --add-topic legal --add-topic nextjs --add-topic typescript --add-topic ai --add-topic claude
```

---

## What done looks like

- Paste any contract text → 10 risk cards stream in one by one
- Each card shows severity, the exact quote, plain English explanation, and negotiability
- Summary bar shows "2 critical · 4 high · 3 medium · 1 low"
- Works on mobile
- "Load example" button loads a sample lease so people can try without a real contract
- Disclaimer visible: "This is not legal advice. Always consult a qualified attorney."
- ANTHROPIC_API_KEY set in Vercel env vars
- Live URL works end-to-end
