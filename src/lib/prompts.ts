export const ANALYZE_PROMPT = `You are a contract risk analyst. Your job is to identify the 10 most important clauses in a contract that the signer should understand before signing.

You will receive raw contract text. Analyze it and return exactly 10 risk items.

Output format: emit each risk item as a single line of valid JSON (NDJSON). One JSON object per line. No array wrapper. No markdown. No preamble. No summary. Just 10 lines of JSON, one per risk item, in order from most to least severe.

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
- severity = critical only for clauses that could result in financial loss, legal liability, or severe restriction of rights. Use it sparingly.
- If the contract is clearly benign (e.g., a simple one-page NDA with standard terms), say so in the first item with severity "low" and continue with the remaining 9.
- If fewer than 10 meaningful clauses exist, fill remaining items with observations about what standard protections are MISSING from this contract (still valid JSON with all fields).
- negotiable = true for non-standard terms that a lawyer could push back on. negotiable = false for regulatory requirements or truly standard boilerplate.
- Emit ONLY the 10 JSON lines. Nothing before, nothing after, nothing between except a single newline character.`;

export const EXAMPLE_CONTRACT = `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement ("Lease") is entered into between Maple Ridge Properties LLC ("Landlord") and the undersigned tenant ("Tenant") for the premises located at 412 Oakwood Avenue, Apt 3B.

1. TERM. The initial term of this Lease shall be twelve (12) months, commencing on the date of signing. This Lease shall automatically renew for successive twelve-month terms unless Tenant provides written notice of non-renewal at least ninety (90) days prior to the end of the then-current term. Failure to provide such notice within the required window shall be deemed an irrevocable election to renew.

2. RENT. Monthly rent shall be $2,400, due on the first day of each month. Landlord reserves the right to increase rent at any time during the Lease term upon thirty (30) days written notice, in such amount as Landlord deems reasonable in its sole discretion.

3. SECURITY DEPOSIT. Tenant shall deposit $4,800 (two months' rent) as a security deposit. In addition, Tenant shall pay a non-refundable cleaning fee of $1,200, which Landlord may apply toward any cleaning, painting, carpet replacement, or general wear and tear at the end of the tenancy.

4. ENTRY BY LANDLORD. Landlord and its agents may enter the premises at any time, with or without notice, for any reason Landlord deems necessary, including but not limited to inspections, repairs, showings to prospective tenants or buyers, and routine maintenance.

5. LATE FEES. If rent is not received by the third day of the month, Tenant shall pay a late fee of $250, plus an additional $50 per day until the rent and accumulated late fees are paid in full.

6. UTILITIES. Tenant shall be responsible for all utilities, including water and trash, which are billed by the Landlord at a flat rate of $180 per month regardless of actual usage.

7. ALTERATIONS. Tenant shall make no alterations to the premises, including the hanging of pictures or installation of curtain rods, without prior written consent of Landlord, which may be withheld for any reason.

8. SUBLETTING. Tenant shall not sublet or assign the premises. Any unauthorized occupant present for more than two consecutive nights constitutes a material breach of this Lease and grounds for immediate termination.

9. ATTORNEYS' FEES. In the event of any dispute arising under this Lease, Tenant shall pay all of Landlord's attorneys' fees and costs, regardless of the outcome of the dispute.

10. WAIVER OF JURY TRIAL. The parties hereby waive any right to a trial by jury in any action or proceeding arising out of or related to this Lease.

11. GOVERNING LAW AND VENUE. This Lease shall be governed by the laws of the state in which the premises are located. Any action shall be brought exclusively in the county where Landlord maintains its principal office.

12. ENTIRE AGREEMENT. This document constitutes the entire agreement between the parties. Tenant acknowledges that no oral representations have been made or relied upon.

By signing below, Tenant acknowledges having read and understood all terms.`;
