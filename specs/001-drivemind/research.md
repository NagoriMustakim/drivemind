# Phase 0 Research: DriveMind

**Feature**: 001-drivemind | **Date**: 2026-06-11

The user input specified the stack concretely, so most "unknowns" are confirmations of approach plus
the few genuinely open decisions. Each item below records Decision / Rationale / Alternatives.

## 1. Repository & contract-sync strategy

- **Decision**: Three independent repos/deployables. The shared contract is authored once in
  `contract/contract.ts` (+ `SCHEMA.md`) and **mirrored verbatim** into each repo's `lib/contract.ts`.
  CI runs (a) a diff that fails if the three copies differ, and (b) an ESLint `no-restricted-imports`
  rule forbidding any path that reaches another app's directory.
- **Rationale**: Constitution Principle I is non-negotiable; repo drift is the top risk. A copied file
  + CI diff keeps zero runtime coupling (no shared package install) while guaranteeing identical types.
- **Alternatives considered**: A published npm workspace package — rejected: introduces a build/runtime
  dependency between repos, weakening isolation and adding tooling the demo doesn't need. A git
  submodule — rejected: fragile, poor DX, still a shared dependency.

## 2. Embedding model & dimensions

- **Decision**: Gemini `gemini-embedding-001`, 768 output dims; `taskType=RETRIEVAL_DOCUMENT` at
  ingestion (the `use_case` text), `taskType=RETRIEVAL_QUERY` for the short user query at request time.
  pgvector column `vector(768)`.
- **Rationale**: Stated requirement; task-type asymmetry is the documented best practice for retrieval
  quality; 768 dims keeps the index small and well within free-tier/pgvector defaults.
- **Alternatives considered**: 1536/3072 dims — rejected: larger index, no benefit at demo scale.
  Embedding raw spec rows instead of the enriched `use_case` text — rejected: fuzzy intent matching
  ("fun weekend car") needs the natural-language description, per spec FR-001/FR-019.

## 3. Vector index & the single retrieval query

- **Decision**: One SQL statement (exposed as a Postgres RPC `match_cars`) that filters
  `WHERE dealer_id = $1 AND <hard constraints>` then `ORDER BY embedding <=> $query_vec LIMIT 5`. Use
  an `ivfflat`/`hnsw` cosine index when present, but correctness does not depend on it at ~50 rows.
- **Rationale**: Constitution VI (one combined filter+vector query, no N+1) and the spec's ≤5 cap.
  Filtering before ranking enforces hard constraints (price/body type) and dealer isolation in the DB.
- **Alternatives considered**: Fetch-then-filter in app code — rejected: N+1 / over-fetch and weaker
  isolation. Separate keyword + vector passes — rejected: unnecessary complexity for the demo.

## 4. Answer model behind a single config flag

- **Decision**: Claude (Anthropic API) is the default answer model, invoked with a tool/structured-
  output schema returning `{response, cars:[{id, why}], suggestedAnswers}`. A single env/config flag
  (`ANSWER_MODEL`) selects Claude | Gemini | OpenAI behind one `models/index.ts` interface.
- **Rationale**: Constitution IV requires Claude as the final answer model with model choice behind one
  flag; structured output guarantees parseable, card-renderable JSON and keeps cars referenced by id.
- **Alternatives considered**: Free-text parsing of the model reply — rejected: brittle, violates the
  "never echo full car data / cars by id" rule and the JSON-validation critical path.

## 5. Anti-hallucination guarantee

- **Decision**: After the model returns, the server intersects every returned `cars[].id` with ids
  known to exist in the chatbot DB for that `dealer_id`; unknown ids are dropped before the SSE reply.
  Covered by a dedicated test.
- **Rationale**: Constitution III + IV and spec FR-004/SC-003 — zero fabricated cars may reach a user.
- **Alternatives considered**: Trusting the model because it was only given real cars — rejected: the
  constitution mandates an explicit verification step regardless of input.

## 6. Session auth, CORS, and rate limiting (chatbot)

- **Decision**: `POST /session` takes the **public** `dealer_id`, validates `Origin`/`Referer` against
  the dealer's registered domain (from the `dealers` table), and issues a short-lived JWT (signed with
  `jose`, server-side secret). Subsequent `/query` calls require that JWT. CORS is locked to the
  dealer's domain. Rate limit per token/IP using a small in-DB/in-memory counter.
- **Rationale**: Constitution IV (token/origin validation is a named critical path) and the spec's
  protected-interface requirement, with no end-user auth in scope (anonymous shoppers).
- **Alternatives considered**: Long-lived API key in the widget — rejected: it would ship a secret to a
  third-party page. A managed rate-limit service (e.g., Upstash) — rejected: avoid extra paid/SaaS
  dependency; a Postgres-backed fixed-window counter is sufficient for the demo and stays $0.

## 7. Ingestion batching, timeouts, and rate limits

- **Decision**: The sync route processes ~20 cars per invocation, persists a `sync_jobs` cursor, and is
  re-invoked (self-continue / client-poll-triggered) until done. Gemini calls use exponential backoff +
  retry; Supabase calls retry to absorb idle-pause cold starts. Idempotent upsert via unique
  `(dealer_id, source_car_id)`.
- **Rationale**: Constitution VII — Vercel function timeouts, Gemini rate limits, and Supabase
  idle-pause must all be handled explicitly; re-sync must not duplicate (FR-021/SC-006).
- **Alternatives considered**: One long-running sync — rejected: exceeds hobby function timeouts. A
  queue service — rejected: extra dependency/cost; the `sync_jobs` cursor table is enough.

## 8. Widget isolation & bundle budget

- **Decision**: Preact app built with Vite **lib mode** as a single self-contained IIFE, loaded by one
  `<script>` tag. The launcher bubble mounts into a **shadow DOM** root (style isolation); the
  conversation panel may use an **iframe** option for stronger isolation. Target **<15KB gzipped**,
  enforced by a bundle-size check in CI.
- **Rationale**: Constitution V (isolated container, never clashes with host CSS/JS) and VI (bundle
  budget). Preact + no UI/state libraries keeps the bundle tiny.
- **Alternatives considered**: React — rejected: too large for a third-party script budget. A pure
  iframe-only widget — rejected: heavier launcher UX; shadow DOM bubble is lighter and sufficient.

## 9. Streaming transport

- **Decision**: Server-Sent Events (SSE) from `/query`; the widget shows optimistic UI (user message +
  typing indicator instantly) and renders tokens progressively, then builds car cards from the final
  structured JSON and shows suggestion chips.
- **Rationale**: Constitution V + spec FR-025/FR-026/SC-008; SSE is the simplest one-way streaming fit
  for serverless and needs no extra client library.
- **Alternatives considered**: WebSockets — rejected: bidirectional overhead unnecessary; harder on
  hobby serverless. Polling — rejected: fails the first-token <1s feel.

## 10. Test runner

- **Decision**: **Vitest** for unit/integration across all three apps; integration tests for ingestion
  and retrieval run against a disposable/local pgvector Postgres (or a dedicated test schema) so the
  four critical paths are exercised end-to-end where feasible, with Gemini/Claude calls stubbed.
- **Rationale**: Vite is already present for the widget; Vitest is light, TS-native, and avoids extra
  config. Critical-path coverage is mandated; UI is lightly tested.
- **Alternatives considered**: Jest — rejected: heavier config, slower TS path. Node's built-in test
  runner — acceptable fallback, but Vitest's mocking ergonomics fit the LLM-stub needs better.

## 11. Caching

- **Decision**: Cache the static system prompt (constant in code/edge cache) and memoize identical
  recent query→response pairs per dealer (short-TTL in-memory/Postgres). Embeddings are computed once at
  ingestion and never recomputed at query time except for the short query string itself.
- **Rationale**: Constitution VI (cache static prompt + repeated responses; embed only the short
  query). Keeps p95 within budget on free tier.
- **Alternatives considered**: External cache (Redis) — rejected: extra dependency/cost; not needed at
  demo scale.

## Open items

None. All Technical Context items are resolved; no `NEEDS CLARIFICATION` remain.
