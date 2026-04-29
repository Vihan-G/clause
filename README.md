# clause

Paste any contract. Get the 10 clauses that could actually hurt you, explained in plain English.

No login. No document type restriction. Lease, NDA, employment offer, freelance agreement, terms of service, subscription contract — anything. You paste text, you get a prioritized list of risks with the exact clause quoted and a plain-English explanation of why it matters.

## What it does

- Streams a structured analysis from Claude as soon as the first risk is ready — no spinner-on-blank-screen
- Returns 10 risks ordered by severity (critical → low), each with the exact quote, plain-English explanation, why-it-matters, and whether the clause is typically negotiable
- Works on mobile from 375px up
- Includes a "Load example lease" button so you can try it without pasting anything

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- `@anthropic-ai/sdk` with streaming
- Zod for request validation
- Deployed on Vercel

## Run locally

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```

Open http://localhost:3000.

## Project layout

```
src/
  app/
    page.tsx                  ← input + streaming results
    layout.tsx
    globals.css               ← warm off-white background, fade-up animation
    api/
      analyze/route.ts        ← streaming NDJSON endpoint
  components/
    ContractInput.tsx
    RiskCard.tsx              ← severity color, quote, plain-English explanation
    RiskSkeleton.tsx          ← pulse placeholder while a card is loading
    SeverityBadge.tsx
    StreamingResults.tsx      ← swaps skeletons → cards as they stream in
    SummaryHeader.tsx         ← "X critical · Y high · Z medium · W low"
    Disclaimer.tsx
  lib/
    anthropic.ts              ← Anthropic client + streaming generator
    prompts.ts                ← system prompt + example contract
    parse-stream.ts           ← incremental NDJSON parser
    types.ts                  ← RiskItem schema + isRiskItem guard
```

## Disclaimer

This is not legal advice. Always consult a qualified attorney before signing.

## License

MIT
