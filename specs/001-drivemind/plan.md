# Implementation Plan: DriveMind — Conversational Car-Recommendation Assistant

**Branch**: `001-drivemind` | **Date**: 2026-06-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-drivemind/spec.md`

## Summary

DriveMind is delivered as **three independent Next.js (App Router) + TypeScript applications**, each
its own repository and its own Vercel deployment, communicating **only over HTTP plus one shared,
mirrored data contract**:

1. **nextgear-site** — a used-car dealer website (server-rendered listing + detail pages) backed by
   its own Supabase Postgres "dealer DB". It exposes a Bearer-token-protected `GET /api/cars` that
   returns inventory in the shared contract shape, and embeds the Otto widget via one `<script>` tag.
2. **drivemind-admin** — the control plane backed by a second Supabase Postgres "chatbot DB" with the
   **pgvector** extension. A dealer enters `{ apiUrl, token }` and clicks **Sync**; the sync route
   fetches the dealer's cars, and per car (a) uses Gemini to write a plain-language `use_case`/"best
   for" description, (b) embeds that text with Gemini `gemini-embedding-001`
   (`taskType=RETRIEVAL_DOCUMENT`, 768 dims), and (c) idempotently upserts into the chatbot DB. Runs
   in ~20-car batches with backoff/retry; UI shows progress + searchable-car count.
3. **drivemind-chatbot** — the assistant runtime: a backend that issues short-lived JWTs after
   Origin/Referer validation, runs **one** pgvector SQL (filter by `dealer_id` + hard constraints,
   order by cosine distance, `LIMIT 5`), sends only those ≤5 cars to **Claude** under a
   structured-output schema, verifies every returned car id exists, and **streams** the reply over
   SSE — plus a tiny **Preact** widget (target <15KB gzipped, Vite IIFE) that mounts in an isolated
   container (shadow DOM bubble / iframe panel) and renders car cards + suggestion chips.

The technical approach mirrors a real production system while running at **$0** (Vercel hobby ×3,
Supabase free ×2, Gemini free tier, provided Claude key). Dependency footprint is deliberately
minimal: Next.js built-ins, Supabase client, Anthropic + Google GenAI SDKs, Preact, Tailwind — no
extra state-management or UI-component libraries.

## Technical Context

**Language/Version**: TypeScript (strict mode) on Node.js (Vercel runtime); all three apps.

**Primary Dependencies**:
- All apps: Next.js (App Router), `@supabase/supabase-js`, ESLint + Prettier.
- nextgear-site: Tailwind CSS.
- drivemind-admin: `@google/genai` (Gemini extraction + embeddings), Tailwind CSS.
- drivemind-chatbot: `@anthropic-ai/sdk` (default answer model), `@google/genai` (query embedding),
  `jose` (JWT sign/verify), Preact + Vite (widget IIFE bundle), Tailwind (admin/dev surfaces only —
  the widget ships its own scoped styles).
- Shared: a hand-written `contract.ts` (+ `SCHEMA.md`) mirrored verbatim across all three repos.

**Storage**:
- Dealer DB (Supabase Postgres, nextgear-site): raw `cars` inventory.
- Chatbot DB (Supabase Postgres + pgvector, drivemind-admin writes / drivemind-chatbot reads):
  enriched `cars` with 768-dim `embedding`, `dealer_id`, unique `(dealer_id, source_car_id)`; a
  `dealers` registry (public `dealer_id`, registered domain) and a `sync_jobs` progress table.

**Testing**: Node test runner / Vitest-class unit + integration tests for the four critical paths
(token/origin validation, ingestion extract→embed→idempotent upsert, retrieval filter+cosine SQL,
structured-JSON parse + car-id existence). Vitest is the working assumption (lightest fit with Vite
already present for the widget); see research.md.

**Target Platform**: Vercel serverless/edge (3 hobby projects); widget runs in third-party browsers
mounted via `<script>`; databases on Supabase free tier.

**Project Type**: Multi-repo web platform — three independent frontend+backend Next.js apps plus an
embeddable widget bundle, joined only by HTTP + a mirrored contract.

**Performance Goals**: Chatbot **p95 end-to-end < ~3s**, **streaming first-token < ~1s**; widget
bundle **< 15KB gzipped**; retrieval is **one** combined SQL filter+vector query (no N+1).

**Constraints**: **$0 total cost** — no paid tier may be required to demo. Handle Supabase idle-pause
gracefully (wake/retry). Respect Vercel function timeouts (ingestion batched ~20 cars/invocation,
resumable) and Gemini free-tier rate limits (backoff + retry). All LLM/DB service keys server-side
only; cars embedded exactly once at ingestion; ≤5 cars ever sent to the model; CORS locked to the
dealer domain; per-token/IP rate limiting on the chatbot API.

**Scale/Scope**: Demo scale — ~50 seeded cars for one primary dealer, architected for multiple
dealers (cross-dealer isolation is a hard requirement). Five prioritized user stories (P1–P5),
26 functional requirements.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Evaluated against DriveMind Constitution v1.1.0. **Result: PASS** (initial and post-design).

| Principle | Status | How the plan complies |
|-----------|--------|------------------------|
| **I. App Isolation & Shared Contract (NON-NEGOTIABLE)** | ✅ PASS | Three independent repos/deployables; communication only via HTTP except the one permitted shared datastore. The dealer DB is private (reached only via `GET /api/cars`). The chatbot KB DB is **shared platform infrastructure** (Principle I's explicit v1.1.0 exception) — written by drivemind-admin, read by drivemind-chatbot — governed by `contract/kb-schema.sql` mirrored into both repos with a CI schema-drift guard, the same discipline as `contract.ts`. Plus the mirrored `contract.ts` + cross-app-import lint rule (see research.md). |
| **II. Code Quality & Secret Hygiene** | ✅ PASS | TS strict everywhere; ESLint + Prettier in CI; small modules. All Gemini/Claude keys + Supabase service keys server-side only; the widget bundle and any client code carry no secrets. Bundle/secret scan in CI. |
| **III. Pragmatic Testing Standards** | ✅ PASS | Tests target the four critical paths exactly as named in the constitution; anti-hallucination test asserts unknown car ids never reach the user. UI lightly tested. |
| **IV. Retrieval & LLM Discipline (NON-NEGOTIABLE security)** | ✅ PASS | Embed once at ingestion; ≤5 cars to the model; Claude = answer model behind one config flag, Gemini = embeddings/extraction; schema-constrained JSON `{response, cars:[{id,why}], suggestedAnswers}` referencing cars by id; hostile-input handling (data/instructions separated, no internal fields exposed); server-side car-id existence check. |
| **V. User Experience Consistency** | ✅ PASS | SSE streaming; optimistic UI + typing indicator; car cards from structured JSON (never raw text); suggestion chips; widget isolated via shadow DOM/iframe; a11y + shared design. |
| **VI. Performance Budgets** | ✅ PASS | Only the short query embedded at request time; one combined filter+vector SQL (no N+1); static system prompt + repeated-query response caching; p95 <3s / first-token <1s targets; widget <15KB gzipped. |
| **VII. Free-Tier First** | ✅ PASS | $0 on Vercel hobby ×3 + Supabase free ×2 (pgvector) + Gemini free + provided Claude key. Supabase idle-pause handled; ingestion batched/resumable; Gemini backoff+retry. No paid tier to demo. |

**Demo Scope & Production Fidelity**: The plan keeps the production-shaped structure (3 apps, contract,
embed-once, server-side keys) and only reduces scale/polish (≈50 cars, light UI tests) — compliant.

No violations → **Complexity Tracking table intentionally omitted/empty.**

## Project Structure

### Documentation (this feature)

```text
specs/001-drivemind/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── contract.ts          # Shared car + dealer_id contract (mirrored to all 3 repos)
│   ├── SCHEMA.md            # Human description of the shared contract
│   ├── dealer-cars.openapi.yaml   # nextgear-site GET /api/cars
│   ├── admin-sync.openapi.yaml    # drivemind-admin sync + progress endpoints
│   └── chatbot-api.openapi.yaml   # drivemind-chatbot /session, /query (SSE)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (three independent repositories)

Each app is its own repo/deployable. They are colocated here as sibling directories for the demo, but
share **no** build, no imports, and no runtime — only the mirrored `contract.ts`.

```text
nextgear-site/                      # APP 1 — dealer website (Vercel project #1, dealer Supabase DB)
├── app/
│   ├── (site)/page.tsx                 # inventory listing (server-rendered)
│   ├── (site)/cars/[id]/page.tsx       # car detail page (price, year, mileage, specs, images)
│   └── api/cars/route.ts               # GET /api/cars — Bearer-token protected, contract shape
├── lib/
│   ├── contract.ts                     # MIRRORED shared contract
│   ├── supabase.ts                     # server-side client (service key, server-only)
│   └── auth.ts                         # Bearer token check
├── scripts/seed.ts                     # ~50 realistic used cars
├── tests/                              # token-auth test for /api/cars
└── tailwind/ next.config / eslintrc / prettierrc / tsconfig(strict)

drivemind-admin/                    # APP 2 — control plane (Vercel project #2, chatbot Supabase DB)
├── app/
│   ├── page.tsx                        # admin UI: enter {apiUrl, token}, Sync button, progress, count
│   └── api/
│       ├── sync/route.ts               # start/continue a batched sync job
│       └── sync/[jobId]/route.ts       # progress (poll/stream) + searchable count
├── lib/
│   ├── contract.ts                     # MIRRORED shared contract
│   ├── supabase.ts                     # chatbot DB client (service key, server-only)
│   ├── gemini.ts                       # use_case extraction + RETRIEVAL_DOCUMENT embedding
│   ├── ingest.ts                       # extract → embed → idempotent upsert (batch of ~20)
│   └── retry.ts                        # backoff/retry for Gemini + Supabase wake
├── supabase/migrations/                # pgvector enable, cars/dealers/sync_jobs tables, RPC
├── tests/                              # ingestion pipeline test (extract→embed→upsert idempotency)
└── tailwind / next.config / eslintrc / prettierrc / tsconfig(strict)

drivemind-chatbot/                  # APP 3 — assistant runtime + widget (Vercel project #3)
├── app/api/
│   ├── session/route.ts                # POST /session: Origin/Referer check → short-lived JWT, CORS
│   └── query/route.ts                  # POST /query: embed query → 1 SQL → Claude → verify ids → SSE
├── lib/
│   ├── contract.ts                     # MIRRORED shared contract
│   ├── supabase.ts                     # chatbot DB client (READ), server-only
│   ├── retrieval.ts                    # ONE filter+cosine SQL (LIMIT 5)
│   ├── models/index.ts                 # single config flag: Claude (default) | Gemini | OpenAI
│   ├── answer.ts                       # structured-output schema {response,cars,suggestedAnswers}
│   ├── guard.ts                        # car-id existence verification + prompt-injection separation
│   ├── jwt.ts  ratelimit.ts            # JWT issue/verify; per-token/IP limiting
├── widget/                             # Preact IIFE bundle (Vite lib mode), shadow DOM / iframe
│   ├── src/index.tsx  bubble.tsx  panel.tsx  cards.tsx  chips.tsx  sse.ts
│   └── vite.config.ts                  # lib mode, single-file IIFE, <15KB gzip budget check
├── tests/                              # token/origin validation; structured-JSON parse + id existence
└── next.config / eslintrc / prettierrc / tsconfig(strict)

contract/                           # canonical source of the shared contract (copied into each repo)
├── contract.ts
└── SCHEMA.md
```

**Structure Decision**: **Three independent repositories** (Constitution Principle I, non-negotiable),
each a standard Next.js App Router app with `app/` (routes + UI) and `lib/` (server logic), plus a
dedicated `widget/` Vite sub-build inside drivemind-chatbot for the Preact embeddable. The shared
contract lives canonically in `contract/` and is mirrored verbatim into each repo's `lib/contract.ts`;
a CI check diffs the copies and fails on drift, and a lint rule forbids any cross-app import.

## Complexity Tracking

> No constitution violations. Section intentionally empty.
