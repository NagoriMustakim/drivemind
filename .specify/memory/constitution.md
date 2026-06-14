<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.1.0
Bump rationale (1.1.0): MINOR — expanded Principle I with an explicit, narrowly-scoped
  exception permitting the chatbot knowledge-base database as a CONTRACT-GOVERNED shared
  platform datastore (written by drivemind-admin, read by drivemind-chatbot). No principle
  removed or redefined; guidance materially expanded. Resolves analysis finding C1 and
  authorizes the KB schema contract (finding C2). The dealer's private DB remains
  HTTP-only.

----- prior baseline -----
Version change: (uninitialized template) → 1.0.0
Bump rationale: Initial ratification of the DriveMind constitution. No prior
  versioned content existed (the file was an unfilled template), so this is the
  first MAJOR baseline.

Principles defined (7):
  I.   App Isolation & Shared Contract (NON-NEGOTIABLE)
  II.  Code Quality & Secret Hygiene
  III. Pragmatic Testing Standards
  IV.  Retrieval & LLM Discipline (NON-NEGOTIABLE security clauses)
  V.   User Experience Consistency
  VI.  Performance Budgets
  VII. Free-Tier First

Added sections:
  - Core Principles (I–VII)
  - Demo Scope & Production Fidelity
  - Development Workflow & Quality Gates
  - Governance

Removed sections: none (template placeholders replaced).

Templates / artifacts reviewed for alignment:
  ✅ .specify/templates/plan-template.md — "Constitution Check" gate references the
     constitution dynamically ([Gates determined based on constitution file]); no
     hardcoded edits required.
  ✅ .specify/templates/spec-template.md — no constitution references; no change needed.
  ✅ .specify/templates/tasks-template.md — no constitution references; no change needed.
  ✅ .specify/extensions/.../commands/speckit.agent-context.update.md — no outdated
     principle references; no change needed.

Follow-up TODOs: none. RATIFICATION_DATE set to today (initial adoption).
-->

# DriveMind Constitution

DriveMind is a free, demo-grade but **production-shaped** AI car-recommendation platform built as
THREE independent Next.js + TypeScript applications:

- **nextgear-site** — a real-looking used-car dealer website with its own Supabase database.
- **drivemind-admin** — the control plane where a dealer pastes their site's API URL + token and
  clicks **Sync** to ingest cars.
- **drivemind-chatbot** — the embeddable widget plus the query service that answers buyers.

This document is the supreme reference for how the three apps are designed, built, and reviewed.
Where a principle is marked **NON-NEGOTIABLE**, it is a hard gate: a change that violates it MUST be
rejected in review regardless of convenience or deadline.

## Core Principles

### I. App Isolation & Shared Contract (NON-NEGOTIABLE)

The three apps are independent repositories and independent deployables. They MUST NOT import each
other's internals — no shared source modules, no cross-app relative imports, no reaching into
another app's *private* database directly. All inter-app communication MUST go over HTTP APIs, with
the single explicit exception of the shared, contract-governed chatbot knowledge-base datastore
described below.

The things shared between apps are a **single data contract** and the **contract-governed chatbot
knowledge-base schema** (see exception below): the car schema and the `dealer_id` shape, maintained as
`contract.ts` (types) plus `SCHEMA.md` (human description) and **mirrored byte-for-byte across all
three repos**. Any change to the contract MUST be applied to all three repos in the same change set; a
contract edit that lands in fewer than three repos is an incomplete change and MUST NOT be merged.

**Shared platform datastore (explicit exception):** The chatbot knowledge-base database is **shared
platform infrastructure**, not "another app's database." It is written by drivemind-admin and read by
drivemind-chatbot by design. This is the ONLY permitted shared datastore, and it is allowed ONLY
because its schema is treated as a governed contract (same rules as `contract.ts`): the KB schema
lives in a single source-of-truth artifact (`kb-schema.sql`) mirrored into and depended on by both
repos, and CI fails on schema drift exactly as it does for `contract.ts`. The dealer's own inventory
database (nextgear-site) remains private and MUST be reached only over its HTTP API. No other direct
cross-app database access is permitted.

**Testable rules:**
- A static check (lint rule / CI grep) MUST fail any import that crosses an app boundary.
- The mirrored `contract.ts` files MUST be identical; CI MUST diff them and fail on drift.
- The mirrored `kb-schema.sql` MUST be identical in the admin and chatbot repos; CI MUST diff it and
  fail on drift, the same as for `contract.ts`.
- The nextgear-site (dealer) database MUST NOT be accessed by any other app except via its HTTP API.
- Contract changes (and KB-schema changes) are reviewed as one atomic unit touching all affected repos.

**Rationale:** Isolation is the whole point of the architecture. With separate repos, silent drift
between copies of the contract is the single highest-probability failure mode, so the contract is
governed more strictly than any other code.

### II. Code Quality & Secret Hygiene

- TypeScript runs in **strict mode** in every app (`strict: true`, no implicit `any`).
- Modules are small and single-responsibility; **no dead code** (unused exports, files, or flags are
  removed, not commented out).
- **ESLint + Prettier are enforced** in CI; a failing lint/format check blocks merge.
- Naming is self-explanatory; prose comments are reserved for non-obvious *why*, not restating *what*.
- **No secrets, API keys, or tokens may appear in any client/frontend bundle.** All LLM keys (Claude,
  Gemini) and all database service keys live **server-side only** (server routes, edge/serverless
  functions, environment variables never prefixed for client exposure).

**Testable rules:**
- CI fails on any TypeScript, ESLint, or Prettier error.
- A bundle/secret scan MUST fail the build if a known key pattern or a non-public env var reaches
  client-shipped code.

### III. Pragmatic Testing Standards

This is a demo, so testing is targeted rather than exhaustive — but the **four critical paths are
REQUIRED to have unit/integration tests**:

1. **Token/origin validation** on the chatbot API.
2. **The ingestion pipeline**: extract `use_case` → embed → **idempotent upsert by car id**.
3. **The retrieval query**: pgvector **filter-by-dealer + price, then cosine rank**.
4. **Parsing/validating the LLM's structured JSON.**

UI/presentational code MAY be lightly tested. In addition, an **anti-hallucination test is
mandatory**: every car id the LLM returns MUST be verified to exist in the chatbot DB before it
reaches the user; unknown ids are dropped and the path is covered by a test.

**Testable rules:**
- Each of the four critical paths has at least one passing automated test in its app's suite.
- The recommendation flow has a test proving a fabricated/unknown car id never reaches the response.

### IV. Retrieval & LLM Discipline (NON-NEGOTIABLE security clauses)

- Cars are enriched and embedded **exactly once, at ingestion** — never sent to the LLM in bulk.
- At query time, **only the top N (N ≤ 5) retrieved cars** are sent to the model.
- The **final-answer model is Claude**; **embeddings and per-car `use_case` extraction use the Gemini
  free tier**. Model choice lives behind a **single config flag** (one switch, one source of truth).
- The LLM MUST return **schema-constrained JSON**:
  `{ response, cars: [{ id, why }], suggestedAnswers }`. Responses reference cars **by id** and MUST
  NOT echo full car data.
- **Treat all user input as hostile (NON-NEGOTIABLE):** defend against prompt injection, keep data
  and instructions strictly separated in the prompt, and **never expose internal / non-customer
  fields** to the model output or the user.

**Testable rules:**
- A test asserts no more than N cars are passed to the model per query.
- LLM output failing the JSON schema is rejected and handled, proven by test.
- A prompt-injection test confirms user text cannot override system instructions or surface internal
  fields.

**Rationale:** Embedding once controls cost and latency; constraining context and output protects
correctness; hostile-input handling protects the dealer's data and the buyer's trust.

### V. User Experience Consistency

- Chatbot replies **stream token-by-token over SSE**.
- The UI is **optimistic**: the user's message and a typing indicator appear instantly.
- Recommendations render as **car cards built from the structured JSON**, never as raw text.
- **Suggestion chips** guide users toward useful queries.
- Design is **consistent and accessible (a11y)** across all three apps.
- The embeddable widget **mounts in an isolated container (shadow DOM or iframe)** so it never
  clashes with the host site's CSS or JavaScript.

**Testable rules:**
- The chatbot endpoint emits SSE chunks (not a single blocking response).
- Card rendering consumes the parsed JSON, with a test that raw model text is never injected as HTML.
- The widget's styles do not leak into, and are not overridden by, a host page (isolation verified).

### VI. Performance Budgets

- Only the **short query** is embedded at request time.
- Retrieval uses **one combined SQL filter + vector query — no N+1**.
- The **static system prompt is cached**, and repeated-query responses are cached.
- Targets: chatbot **p95 end-to-end < ~3s**, **streaming first-token < ~1s**.
- The embeddable widget bundle stays **small (Preact-class, target < 15KB gzipped)** because it loads
  on a third-party page.

**Testable rules:**
- Retrieval is a single round-trip query (no per-car follow-up queries), enforced by review/test.
- A bundle-size check fails if the widget exceeds the gzipped budget.

### VII. Free-Tier First

The entire system MUST run at **$0** on Vercel (3 hobby projects) + Supabase (2 free projects: dealer
DB and chatbot DB with pgvector). The known free-tier constraints MUST be handled explicitly:

- **Supabase pauses when idle** — the apps handle a cold/paused database gracefully (retry/wake, clear
  user-facing state, no crash).
- **Vercel functions time out** — ingestion is **batched (≈20 cars per call) and resumable**; a single
  invocation never assumes it can finish the whole sync.
- **Gemini free tier is rate-limited** — calls use **backoff + retry**.

**No design may require a paid tier to demo.**

**Testable rules:**
- Ingestion processes in bounded batches and can resume from where it stopped (test on a >20-car set).
- Gemini calls have retry-with-backoff covered by a test (e.g. simulated 429).
- A paused-DB path returns a graceful state rather than an unhandled error.

## Demo Scope & Production Fidelity

DriveMind is explicitly a **demo** that must cost nothing to run, **but its architecture must mirror a
real production system.** Shortcuts that change the *shape* of the system (collapsing the three apps,
bypassing the contract, sending cars to the LLM in bulk, putting keys client-side) are forbidden even
when they would be simpler for a demo. Shortcuts that only reduce *scale or polish* (smaller catalogs,
lighter UI test coverage, modest performance margins) are acceptable as long as they do not violate a
principle above.

## Development Workflow & Quality Gates

- Every change passes the CI gates implied by Principles II, III, and VI: strict TypeScript, ESLint +
  Prettier, the required critical-path tests, the secret/bundle scan, and the contract-drift diff.
- Contract changes (Principle I) are reviewed as one atomic, three-repo change set.
- Reviewers MUST explicitly confirm that NON-NEGOTIABLE principles (I and the security clauses of IV)
  are upheld; a PR that cannot demonstrate this is not approvable.
- Performance and free-tier assumptions (VI, VII) are re-checked whenever the ingestion, retrieval, or
  widget bundle paths change.

## Governance

This constitution supersedes other practices and conventions where they conflict.

- **Amendments** require a documented rationale, review approval, and—if the change affects multiple
  apps—a migration/propagation note describing how all three repos stay consistent.
- **Versioning policy (semantic):**
  - **MAJOR** — backward-incompatible governance changes, or removal/redefinition of a principle.
  - **MINOR** — a new principle/section is added or existing guidance is materially expanded.
  - **PATCH** — clarifications, wording, or non-semantic refinements.
- **Compliance review:** every PR and review verifies compliance with the applicable principles.
  Complexity or any deviation MUST be justified in writing; unjustifiable violations of a
  NON-NEGOTIABLE principle block the merge.
- Runtime, agent-facing development guidance lives in the repo's agent context files and must stay
  consistent with this constitution.

**Version**: 1.1.0 | **Ratified**: 2026-06-11 | **Last Amended**: 2026-06-11
