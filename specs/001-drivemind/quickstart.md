# Quickstart & Validation Guide: DriveMind

**Feature**: 001-drivemind | **Date**: 2026-06-11

This guide validates the feature end-to-end across the three apps at **$0** cost. It is a run/verify
guide — implementation lives in `tasks.md` and the code. See [`plan.md`](./plan.md),
[`data-model.md`](./data-model.md), and [`contracts/`](./contracts/) for details.

## Prerequisites

- Node.js (LTS) + a package manager.
- Two Supabase **free** projects: **dealer DB** and **chatbot DB** (enable `pgvector` on the chatbot
  DB). Three Vercel **hobby** projects (one per app) for deployment.
- API keys (server-side only, never in client bundles or the widget):
  - `GEMINI_API_KEY` (free tier) — used by drivemind-admin (extraction + doc embeddings) and
    drivemind-chatbot (query embedding).
  - `ANTHROPIC_API_KEY` (provided Claude key) — used by drivemind-chatbot as the default answer model.
  - `SUPABASE_SERVICE_ROLE_KEY` for each DB (per app).
  - `DEALER_API_TOKEN` (nextgear-site `GET /api/cars` Bearer), `JWT_SECRET` (chatbot sessions).

## One-time setup

1. **Shared contract**: copy `contracts/contract.ts` + `contracts/SCHEMA.md` into each repo's
   `lib/contract.ts` (+ SCHEMA.md). Confirm the CI drift-diff passes (3 identical copies).
2. **Dealer DB**: run nextgear-site migrations, then `scripts/seed.ts` to insert ~50 `available` cars.
3. **Chatbot DB**: run drivemind-admin migrations (enable `vector`; create `dealers`, `cars` with
   `unique (dealer_id, source_car_id)` + `vector(768)`, and `sync_jobs`). Insert one `dealers` row with
   the demo `dealer_id` and the dealer site's `registered_domain`.
4. Set env vars in each app (server-side only).

## Validation scenarios

### S1 — Dealer API exposes inventory (FR-014, contract)
- `GET /api/cars` with `Authorization: Bearer <DEALER_API_TOKEN>` → **200** + `CarsResponse` of only
  `available` cars in contract shape. Without/with a bad token → **401**. (Critical path: token auth.)

### S2 — Sync ingests + enriches in one action (P2 / FR-016–022, SC-005)
- In the admin UI, enter `{ apiUrl, token }` for the demo dealer and click **Sync**.
- Expect: progress advances in ~20-car batches; on completion `searchableCount` equals the source
  count; each chatbot-DB `cars` row has a non-null `use_case` and a 768-dim `embedding`, tagged with
  `dealer_id`. (Critical path: ingestion extract→embed→idempotent upsert.)

### S3 — Idempotent re-sync (P4 / FR-021, SC-006)
- Change the dealer DB (edit a price, add a car, mark one `sold`), re-run Sync.
- Expect: existing rows updated in place, the new car added, **zero duplicates** for any
  `(dealer_id, source_car_id)`; `searchableCount` reflects the new source state.

### S4 — Recommendations: precise + fuzzy (P1 / FR-001–006, SC-001/002/003)
- Open the dealer site, launch Otto, ask **"an SUV under $25,000"** → ≤5 in-stock SUVs under $25k,
  each with a one-line reason. Ask **"a fun weekend car"** → ≤5 relevant in-stock cars with reasons.
- Verify the retrieval ran as **one** filter+cosine SQL (LIMIT 5) and only ≤5 cars were sent to the
  model. (Critical paths: retrieval SQL; structured-JSON parse.)

### S5 — Anti-hallucination (FR-004, SC-003)
- In a test, force the model to return a fabricated car id → the server drops it; it never reaches the
  widget. Assert 100% of surfaced ids exist in the chatbot DB for that dealer. (Critical path: car-id
  existence check.)

### S6 — Cross-dealer isolation (FR-005, SC-004)
- With a second `dealers` row + its cars synced, a query on dealer A returns **only** dealer A's cars.

### S7 — Off-topic + no-match handling (FR-006/007, SC-007)
- Ask "what's the weather?" → Otto politely declines and redirects. Ask for something not in stock →
  Otto says so honestly and suggests adjusting; **zero** fabricated cars.

### S8 — Session/origin security (FR-010, SC-010)
- `POST /session` from a disallowed Origin/Referer → **403**; from the dealer's domain → JWT issued.
  `/query` without a valid JWT → **401**. Exceed the per-token/IP limit → **429**. A prompt-injection
  message cannot change Otto's behavior or surface internal fields. (Critical path: token/origin.)

### S9 — Streaming + UX (P5 / FR-025/026, SC-008)
- Send a message: the user message + typing indicator appear within ~1s; the reply streams
  progressively; recommendations render as **car cards** (from JSON, not raw text) with suggestion
  chips. Click a card (P3 / FR-009/015, SC-009) → the correct car detail page opens on the dealer site.

### S10 — Widget isolation + budget (FR-013, Constitution V/VI)
- Embed the widget via the single `<script>` tag on the dealer site; confirm host CSS/JS is unaffected
  (shadow DOM / iframe) and the built widget bundle is **< 15KB gzipped** (CI size check).

### S11 — Free-tier resilience (Constitution VII)
- Let the chatbot DB idle-pause, then query → the app wakes/retries and returns a graceful result
  rather than crashing. Simulate a Gemini 429 during sync → backoff/retry succeeds; the batch resumes.

## Test suites (must pass)

- **Token/origin validation** (S1, S8) · **Ingestion pipeline** extract→embed→idempotent upsert (S2,
  S3) · **Retrieval SQL** filter + cosine rank (S4, S6) · **Structured-JSON parse + car-id existence**
  (S4, S5). UI is lightly tested.

## Deploy (demo)

- Deploy each app to its own Vercel hobby project with its own env vars. Point the widget `<script>`
  on nextgear-site at the drivemind-chatbot CDN bundle. Confirm all three run with **no paid tier**.
