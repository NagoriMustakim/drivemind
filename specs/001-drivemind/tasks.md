---

description: "Task list for DriveMind — Conversational Car-Recommendation Assistant"
---

# Tasks: DriveMind — Conversational Car-Recommendation Assistant

**Input**: Design documents from `/specs/001-drivemind/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Test tasks ARE included — the Constitution (Principle III) and the spec mandate
unit/integration tests for the four critical paths: (a) token/origin validation on the chatbot API,
(b) the ingestion pipeline (extract→embed→idempotent upsert), (c) the retrieval query (filter+cosine
rank), and (d) structured-JSON parse + car-id existence (anti-hallucination). UI is lightly tested.

**Organization**: Tasks are grouped by user story (P1–P5). The system is **three independent repos** —
`nextgear-site/`, `drivemind-admin/`, `drivemind-chatbot/` — plus a canonical `contract/` mirrored into
each. No app imports another's internals (Constitution Principle I, non-negotiable).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks)
- **[Story]**: US1–US5 maps to the spec's prioritized user stories
- Exact file paths are included in every task

## Path Conventions

Three sibling repos at the workspace root: `nextgear-site/`, `drivemind-admin/`, `drivemind-chatbot/`,
and the canonical shared contract in `contract/`. Each app uses Next.js App Router: routes/UI in
`app/`, server logic in `lib/`, tests in `tests/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the three apps, the shared contract, tooling, and CI guards.

- [X] T001 [P] Initialize the three Next.js (App Router, TypeScript strict) apps in `nextgear-site/`, `drivemind-admin/`, and `drivemind-chatbot/` (each its own `package.json`, `next.config`, `app/`), with the minimum dependencies only (Next.js, `@supabase/supabase-js`; plus per-app SDKs added in their phases)
- [X] T002 Author the canonical shared contract at `contract/contract.ts`, `contract/SCHEMA.md`, and `contract/kb-schema.sql` (the chatbot KB schema + `match_cars` RPC; copy all three from `specs/001-drivemind/contracts/`), and add a `scripts/sync-contract.sh` that mirrors `contract.ts`/`SCHEMA.md` verbatim into `nextgear-site/lib/`, `drivemind-admin/lib/`, and `drivemind-chatbot/lib/`, AND mirrors `kb-schema.sql` into `drivemind-admin/supabase/` and `drivemind-chatbot/supabase/`
- [X] T003 [P] Configure ESLint + Prettier + `tsconfig` (`"strict": true`) in each app, including an ESLint `no-restricted-imports` rule forbidding any cross-app path (e.g. `../../nextgear-site/**`) in `nextgear-site/.eslintrc.cjs`, `drivemind-admin/.eslintrc.cjs`, `drivemind-chatbot/.eslintrc.cjs`
- [X] T004 [P] Configure Tailwind CSS in `nextgear-site/` and `drivemind-admin/` (`tailwind.config.ts`, base styles)
- [X] T005 [P] Configure Vitest in each app (`nextgear-site/vitest.config.ts`, `drivemind-admin/vitest.config.ts`, `drivemind-chatbot/vitest.config.ts`) with an integration setup that can point at a disposable/local pgvector Postgres
- [X] T006 [P] Set up the Preact widget build in `drivemind-chatbot/widget/vite.config.ts` (Vite lib mode, single self-contained IIFE) with a gzipped bundle-size check enforcing the <15KB budget
- [X] T007 Add CI guards in `.github/workflows/ci.yml`: contract-drift diff (the 3 mirrored `lib/contract.ts` must equal `contract/contract.ts`), KB-schema-drift diff (the mirrored `supabase/kb-schema.sql` in drivemind-admin and drivemind-chatbot must equal `contract/kb-schema.sql`), cross-app-import lint, secret/bundle scan, and per-app lint+typecheck+test

**Checkpoint**: Three apps scaffold, build, lint, and test; contract mirroring + CI guards in place.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Databases, shared clients, dealer inventory source, and the realistic dealer site shell —
everything the user stories build on.

**⚠️ CRITICAL**: No user story work begins until this phase is complete.

- [X] T008 [P] Dealer DB migration in `nextgear-site/supabase/migrations/0001_cars.sql`: `cars` table (id, make, model, year, mileage, price, body_type, specs jsonb, image_url, status, created_at) per data-model.md
- [X] T009 [P] Chatbot DB migration in `drivemind-admin/supabase/migrations/0001_init.sql`: `create extension vector`; `dealers` (dealer_id PK, name, registered_domain, inventory_api_url); `cars` (dealer_id, source_car_id, contract fields, detail_url, use_case, embedding vector(768), updated_at) with `unique (dealer_id, source_car_id)`, cosine vector index, and btree on `(dealer_id, price)` / `(dealer_id, body_type)`; `sync_jobs` (id, dealer_id, status, total, processed, searchable_count, error, started_at, updated_at) — sourced from `contract/kb-schema.sql` so drivemind-admin remains the migration owner of the shared KB schema
- [X] T010 [P] Server-side Supabase client + idle-pause wake/retry helper in `nextgear-site/lib/supabase.ts` (dealer DB, service key, server-only)
- [X] T011 [P] Server-side Supabase client + idle-pause wake/retry helper in `drivemind-admin/lib/supabase.ts` (chatbot DB write, service key, server-only)
- [X] T012 [P] Server-side Supabase client + idle-pause wake/retry helper in `drivemind-chatbot/lib/supabase.ts` (chatbot DB read, service key, server-only)
- [X] T013 [P] Shared backoff/retry utility in `drivemind-admin/lib/retry.ts` and `drivemind-chatbot/lib/retry.ts` (exponential backoff for Gemini rate limits + Supabase cold starts)
- [X] T014 [P] Environment/config management (server-only keys, no client exposure) in `nextgear-site/lib/env.ts`, `drivemind-admin/lib/env.ts`, `drivemind-chatbot/lib/env.ts`
- [X] T015 [P] Seed script `nextgear-site/scripts/seed.ts` populating ~50 realistic used cars across varied body types and price bands (status=available)
- [X] T016 [P] Server-rendered inventory listing page `nextgear-site/app/(site)/page.tsx` and car detail page `nextgear-site/app/(site)/cars/[id]/page.tsx` (price, year, mileage, specs, images) with Tailwind
- [X] T017 Insert the demo `dealers` registry row (public `dealer_id`, `registered_domain`, `inventory_api_url`) via `drivemind-admin/scripts/register-dealer.ts`

**Checkpoint**: Both DBs exist, clients + retry/wake ready, dealer site renders with seeded inventory.

---

## Phase 3: User Story 1 - Shopper finds cars by describing needs (Priority: P1) 🎯 MVP

**Goal**: A shopper opens Otto and gets ≤5 real, in-stock cars (precise + fuzzy intent) with one-line
reasons, scoped to the dealer, with zero fabricated cars.

**Independent Test**: With a small enriched chatbot-DB fixture (or a completed sync), open Otto, submit
"an SUV under $25,000" and "a fun weekend car", and confirm each returns a friendly reply + ≤5 in-stock
cars with reasons, all existing in the dealer's KB.

### Tests for User Story 1 ⚠️ (write first, ensure they FAIL before implementation)

- [X] T018 [P] [US1] Chatbot DB test fixture in `drivemind-chatbot/tests/fixtures/seed-kb.ts` that inserts a handful of enriched cars (use_case + 768-dim embedding) for a test dealer, enabling independent retrieval/query testing
- [X] T019 [P] [US1] Contract test for `/query` (and the `AssistantResult` shape) in `drivemind-chatbot/tests/contract/query.contract.test.ts` against `contracts/chatbot-api.openapi.yaml`
- [X] T020 [P] [US1] **Critical path (a)** token/origin validation test in `drivemind-chatbot/tests/integration/session-auth.test.ts`: bad Origin/Referer → 403, valid → JWT; `/query` without JWT → 401; over-limit → 429
- [X] T021 [P] [US1] **Critical path (c)** retrieval SQL test in `drivemind-chatbot/tests/integration/retrieval.test.ts`: one filter+cosine query honors `dealer_id` + hard constraints (price/body type), orders by cosine distance, `LIMIT 5`, and never returns another dealer's cars
- [X] T022 [P] [US1] **Critical path (d)** structured-JSON parse + anti-hallucination test in `drivemind-chatbot/tests/integration/answer-guard.test.ts`: invalid model JSON is rejected/handled; a fabricated car id is dropped and never reaches the response (assert 100% of surfaced ids exist)
- [X] T023 [P] [US1] Integration test in `drivemind-chatbot/tests/integration/recommend.test.ts`: precise ("SUV under $25,000") and fuzzy ("a fun weekend car") queries each return ≤5 in-stock cars with reasons (Gemini/Claude stubbed)
- [X] T023a [P] [US1] No-match integration test in `drivemind-chatbot/tests/integration/no-match.test.ts`: an over-constrained/empty-result query returns a friendly, honest "nothing matches, try adjusting" reply with **zero** cars and **zero** fabricated ids (FR-006, US1 scenario 3, SC-003)

### Implementation for User Story 1

- [X] T024 [P] [US1] Gemini query embedding (RETRIEVAL_QUERY, 768 dims) in `drivemind-chatbot/lib/gemini.ts` (server-only key)
- [X] T025 [US1] Postgres RPC `match_cars` (filter `dealer_id` + optional price/body-type constraints, `ORDER BY embedding <=> $query_vec LIMIT 5`) — defined in `contract/kb-schema.sql` and applied via `drivemind-admin/supabase/migrations/0002_match_cars.sql`; the chatbot repo depends on this RPC by schema contract, not by code import
- [X] T026 [US1] Retrieval module `drivemind-chatbot/lib/retrieval.ts` calling `match_cars` as ONE statement (no N+1), parsing hard constraints (budget, body type, mileage) from the query
- [X] T027 [P] [US1] Model abstraction with single config flag in `drivemind-chatbot/lib/models/index.ts` (`ANSWER_MODEL`: Claude default | Gemini | OpenAI swappable)
- [X] T028 [US1] Claude answer module `drivemind-chatbot/lib/answer.ts`: cached static system prompt, hostile-input separation (data vs instructions), structured-output schema returning `AssistantResult` `{response, cars:[{id,why}], suggestedAnswers}`, sending only the ≤5 retrieved cars
- [X] T029 [US1] Anti-hallucination + off-topic guard `drivemind-chatbot/lib/guard.ts`: verify every returned car id exists in the dealer's KB before responding; politely decline off-topic; handle the no-match path (honest "nothing found" reply with zero cars when retrieval returns none); never expose internal fields
- [X] T030 [P] [US1] JWT issue/verify in `drivemind-chatbot/lib/jwt.ts` (`jose`, short-lived, server secret) and per-token/IP rate limiter in `drivemind-chatbot/lib/ratelimit.ts`
- [X] T031 [US1] `POST /session` route in `drivemind-chatbot/app/api/session/route.ts`: Origin/Referer validation vs `dealers.registered_domain`, CORS locked to dealer domain, issue JWT
- [X] T032 [US1] `POST /query` route in `drivemind-chatbot/app/api/query/route.ts`: JWT-gated; embed query → `retrieval.ts` → `answer.ts` → `guard.ts` → **SSE** stream; repeated-query response cache
- [X] T033 [US1] Widget bootstrap in `drivemind-chatbot/widget/src/index.tsx` + `bubble.tsx`: single `<script>` entry, shadow DOM mount, calls `POST /session`, send message, basic reply + car-card rendering from `AssistantResult` (cards by id)
- [X] T034 [US1] Embed the widget on the dealer site via one `<script>` tag in `nextgear-site/app/(site)/layout.tsx` pointing at the chatbot widget bundle

**Checkpoint**: Otto returns real, dealer-scoped, ≤5-car recommendations for precise and fuzzy queries —
MVP is independently demoable.

---

## Phase 4: User Story 2 - Dealer connects and syncs inventory in one action (Priority: P2)

**Goal**: A dealer enters `{ apiUrl, token }`, clicks Sync, and their full inventory is pulled,
enriched, embedded, and stored (tagged to dealer) with progress + searchable count shown.

**Independent Test**: In the admin UI, enter valid `{ apiUrl, token }`, click Sync; confirm progress
advances, `searchableCount` matches the source, and each KB car has `use_case` + 768-dim embedding.

### Tests for User Story 2 ⚠️ (write first)

- [X] T035 [P] [US2] Contract test for `/api/sync` + `/api/sync/{jobId}` in `drivemind-admin/tests/contract/sync.contract.test.ts` against `contracts/admin-sync.openapi.yaml`
- [X] T036 [P] [US2] Dealer-API token test in `nextgear-site/tests/integration/cars-auth.test.ts`: `GET /api/cars` returns contract-shaped available cars with a valid Bearer token; 401 without/with a bad token; only customer-facing fields exposed
- [X] T037 [P] [US2] **Critical path (b)** ingestion pipeline test in `drivemind-admin/tests/integration/ingest.test.ts`: extract use_case → embed → idempotent upsert by `(dealer_id, source_car_id)` (Gemini stubbed); a re-run of the same batch does not duplicate
- [X] T038 [P] [US2] Integration test in `drivemind-admin/tests/integration/sync-flow.test.ts`: a full sync over >20 cars processes in batches, resumes from the cursor, and ends with `searchableCount` == source count
- [X] T038a [P] [US2] Failed/interrupted-sync test in `drivemind-admin/tests/integration/sync-failure.test.ts`: invalid/unreachable `{apiUrl, token}` → job `status=failed` with a clear `error`, and a mid-batch interruption leaves NO duplicate or partial `(dealer_id, source_car_id)` rows and a consistent `searchable_count` (FR-024, US2 scenario 2)

### Implementation for User Story 2

- [X] T039 [US2] Token-protected `GET /api/cars` in `nextgear-site/app/api/cars/route.ts`: Bearer check (`lib/auth.ts`), return only `available` cars mapped to the shared `CarsResponse` shape
- [X] T040 [P] [US2] Gemini enrichment + document embedding in `drivemind-admin/lib/gemini.ts`: produce plain-language `use_case`/"best for" text, then embed it (`gemini-embedding-001`, RETRIEVAL_DOCUMENT, 768 dims), with backoff/retry
- [X] T041 [US2] Ingestion pipeline in `drivemind-admin/lib/ingest.ts`: per car extract→embed→idempotent upsert into chatbot DB `cars`, in batches of ~20, advancing the `sync_jobs` cursor
- [X] T042 [US2] `POST /api/sync` route in `drivemind-admin/app/api/sync/route.ts`: fetch dealer cars from `apiUrl`, start/continue a batched job (resumable within Vercel timeout), update `sync_jobs`
- [X] T043 [US2] `GET /api/sync/[jobId]` progress route in `drivemind-admin/app/api/sync/[jobId]/route.ts` returning status/processed/total/searchableCount
- [X] T044 [US2] Admin UI in `drivemind-admin/app/page.tsx`: form for `{ apiUrl, token }`, Sync button, live progress (poll/stream), searchable-car count, and a list of ingested cars
- [X] T044a [US2] Failure handling in `drivemind-admin/lib/ingest.ts` + `app/api/sync/route.ts`: validate creds before mutating, wrap each batch so a failure sets `sync_jobs.status=failed` + `error` without partial commits, and surface the failure clearly in the admin UI (`app/page.tsx`) (FR-024)

**Checkpoint**: A dealer goes from connecting inventory to a working, queryable KB in one Sync; US1
now runs on really-synced data.

---

## Phase 5: User Story 3 - Shopper clicks a recommendation through to its detail page (Priority: P3)

**Goal**: Recommendation cards are clickable and navigate to the exact car's detail page on the dealer
site.

**Independent Test**: From Otto's recommendations, click any car card and confirm it opens the correct
car's detail page with full info on the dealer site.

### Tests for User Story 3 ⚠️ (write first)

- [X] T045 [P] [US3] Integration test in `drivemind-chatbot/tests/integration/card-link.test.ts`: each rendered card links to the car's `detailUrl` and resolves to the intended `source_car_id`

### Implementation for User Story 3

- [X] T046 [US3] Car-card component in `drivemind-chatbot/widget/src/cards.tsx`: built from `AssistantResult` (data/links by id), showing make/model, price, key attributes, the one-line reason, and a click target to `detailUrl`
- [X] T047 [US3] Ensure `detail_url` is populated during ingestion (`drivemind-admin/lib/ingest.ts`) and surfaced by retrieval so cards link to `nextgear-site/app/(site)/cars/[id]/page.tsx`

**Checkpoint**: Clicking a recommendation opens the correct detail page (100% resolve).

---

## Phase 6: User Story 4 - Dealer re-syncs without duplicates (Priority: P4)

**Goal**: Re-syncing updates existing cars in place, adds new ones, reflects removals — zero duplicates.

**Independent Test**: Sync, then change the source (edit price, add a car, mark one sold), re-sync;
confirm in-place updates, the new car added, no duplicate `(dealer_id, source_car_id)`, and an updated
count.

### Tests for User Story 4 ⚠️ (write first)

- [X] T048 [P] [US4] Re-sync idempotency test in `drivemind-admin/tests/integration/resync.test.ts`: after edits/additions/removals, KB has no duplicates, updates applied, removed cars no longer searchable, `searchableCount` reflects the source

### Implementation for User Story 4

- [X] T049 [US4] Update `drivemind-admin/lib/ingest.ts` to upsert-on-conflict (update in place) and to reconcile removals (mark/delete cars absent from the latest source pull) and recompute `searchable_count`
- [X] T050 [US4] Update only-changed-cars optimization (skip re-embedding when `use_case`-relevant fields are unchanged) in `drivemind-admin/lib/ingest.ts` to respect Gemini rate limits on re-sync

**Checkpoint**: Re-sync keeps the KB current with no duplicates or stale cars.

---

## Phase 7: User Story 5 - Fast, streaming, guided responses (Priority: P5)

**Goal**: Instant optimistic UI, progressive (streaming) replies, and tappable suggestion chips.

**Independent Test**: Send a message; the user message + typing indicator appear within ~1s, the reply
streams progressively, and suggestion chips are offered and tappable.

### Tests for User Story 5 ⚠️ (light UI test)

- [X] T051 [P] [US5] Widget UX test in `drivemind-chatbot/tests/unit/widget-stream.test.ts`: optimistic message + typing indicator appear immediately, SSE deltas render progressively, and chips are rendered from `suggestedAnswers`

### Implementation for User Story 5

- [X] T052 [US5] SSE client in `drivemind-chatbot/widget/src/sse.ts` for progressive token rendering
- [X] T053 [US5] Conversation panel in `drivemind-chatbot/widget/src/panel.tsx`: optimistic UI (instant user message + typing indicator), progressive reply rendering, a11y (roles/labels, keyboard, focus)
- [X] T054 [P] [US5] Suggestion chips in `drivemind-chatbot/widget/src/chips.tsx` rendered from `suggestedAnswers`, tappable to send a follow-up
- [X] T055 [US5] Optional iframe panel isolation mode in `drivemind-chatbot/widget/src/panel.tsx` for stronger host-page isolation

**Checkpoint**: The conversation feels instant, streams, and guides the user with chips.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Budgets, resilience, validation, and docs across all stories.

- [X] T056 [P] Verify widget bundle is <15KB gzipped (CI size check) and trim deps in `drivemind-chatbot/widget/`
- [X] T057 [P] Performance pass: confirm chatbot p95 <~3s and streaming first-token <~1s; confirm retrieval is one query (no N+1) and the static system prompt + repeated-query cache are active
- [X] T058 [P] Free-tier resilience pass: graceful Supabase idle-pause handling and Gemini 429 backoff/retry exercised in `drivemind-admin/` and `drivemind-chatbot/`
- [X] T059 [P] Secret-hygiene audit: no LLM/DB keys in any client bundle (widget + admin/site client code); CI secret/bundle scan green
- [X] T060 [P] Per-app `README.md` (setup, env vars, deploy to its own Vercel project) in each repo
- [ ] T061 Run the full `quickstart.md` validation (scenarios S1–S11) end-to-end at $0

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately.
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories.
- **User Stories (Phases 3–7)**: All depend on Foundational.
  - **US1 (P1)**: independently testable via the chatbot-DB fixture (T018); does not strictly require US2.
  - **US2 (P2)**: independent; produces real data US1 then runs on.
  - **US3 (P3)**: needs US1's card rendering surface; card→detail link is its own slice.
  - **US4 (P4)**: extends US2's ingestion.
  - **US5 (P5)**: enhances US1's widget; the `/query` SSE stream (T032) already exists.
- **Polish (Phase 8)**: After the desired stories are complete.

### Within Each User Story

- Tests (where included) are written first and must FAIL before implementation.
- Models/migrations → libs/services → routes → UI.
- Story complete and independently testable before the next priority.

### Parallel Opportunities

- Setup: T003–T006 in parallel; T001 first (scaffold), then T002 (contract).
- Foundational: T008–T016 are mostly `[P]` (different files/repos); T017 after T009.
- US1 tests T018–T023 in parallel; then impl (T024/T027/T030 are `[P]`; T025→T026; T028→T029; routes after libs).
- US2 tests T035–T038 in parallel; T039 + T040 in parallel; T041→T042→T043→T044.
- Cross-story: with capacity, US1 (chatbot repo) and US2 (admin/site repos) proceed in parallel after Foundational.

---

## Parallel Example: User Story 1

```bash
# Launch all US1 tests together (write first, expect FAIL):
Task: "Contract test for /query in drivemind-chatbot/tests/contract/query.contract.test.ts"
Task: "Token/origin validation test in drivemind-chatbot/tests/integration/session-auth.test.ts"
Task: "Retrieval SQL test in drivemind-chatbot/tests/integration/retrieval.test.ts"
Task: "Answer parse + anti-hallucination test in drivemind-chatbot/tests/integration/answer-guard.test.ts"

# Then launch independent US1 implementation modules in parallel:
Task: "Gemini query embedding in drivemind-chatbot/lib/gemini.ts"
Task: "Model config flag in drivemind-chatbot/lib/models/index.ts"
Task: "JWT + rate limiter in drivemind-chatbot/lib/jwt.ts and lib/ratelimit.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 (Setup) and Phase 2 (Foundational).
2. Complete Phase 3 (US1) using the chatbot-DB fixture (T018) for independent testing.
3. **STOP and VALIDATE**: precise + fuzzy queries return ≤5 real, dealer-scoped cars; no fabricated ids.
4. Demo the MVP.

### Incremental Delivery

1. Setup + Foundational → foundation ready.
2. US1 → MVP recommendations (demo).
3. US2 → real one-click sync (US1 now runs on synced data).
4. US3 → click-through to detail pages.
5. US4 → idempotent re-sync.
6. US5 → streaming + optimistic UI + chips.
7. Polish → budgets, resilience, quickstart validation.

### Parallel Team Strategy

After Foundational: Dev A on US1 (`drivemind-chatbot/`), Dev B on US2 (`drivemind-admin/` + the
`nextgear-site` API), with US3/US5 layered onto the chatbot widget and US4 onto admin ingestion.

---

## Notes

- `[P]` = different files, no dependency on an incomplete task.
- `[Story]` labels (US1–US5) map tasks to spec user stories for traceability.
- Constitution-required tests (critical paths a–d) are T020, T021, T022 (US1) and T037 (US2), plus the
  dealer-API token test T036; the anti-hallucination guarantee is T022/T029.
- Any contract change must update `contract/contract.ts` AND all three mirrored `lib/contract.ts` in
  the same change set (Principle I); CI drift-diff (T007) enforces this.
- The chatbot KB DB is **shared platform infrastructure** (Constitution Principle I's explicit
  exception, v1.1.0), not "another app's DB": written by drivemind-admin, read by drivemind-chatbot.
  Its schema is governed by `contract/kb-schema.sql`, mirrored into both repos' `supabase/`, with a CI
  schema-drift guard (T007) — the same discipline as `contract.ts`. The dealer DB stays HTTP-only.
- Commit after each task or logical group; stop at any checkpoint to validate a story independently.
