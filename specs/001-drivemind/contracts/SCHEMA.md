# DriveMind Shared Contract — SCHEMA.md

**This is the human-readable companion to [`contract.ts`](./contract.ts).** Both are the single source
of truth for the data shapes that cross app boundaries, and both are **mirrored verbatim into all three
repos**. Per Constitution Principle I (non-negotiable), any change to the contract is applied to
`nextgear-site`, `drivemind-admin`, and `drivemind-chatbot` in the **same change set**; CI diffs the
copies and fails on drift, and an ESLint rule forbids cross-app imports.

## What crosses the boundary (and what does not)

- **Crosses HTTP boundaries**: `Car`, `DealerId`, `CarsResponse`, `AssistantResult`/`RecommendedCar`.
- **Never crosses**: raw dealer-DB columns (status, internal notes, cost), chatbot-DB internals
  (`embedding`, `use_case`, `sync_jobs`), JWTs/tokens, or any non-customer field.

## Types

### `DealerId` (string)
Public tenant identifier. Safe to embed in the widget `<script>` and send to `POST /session`.

### `BodyType` (enum)
`SUV | Sedan | Coupe | Truck | Convertible | Hatchback | Van | Wagon`. Shared taxonomy used for the
hard-constraint filter in retrieval and for seeding inventory.

### `Car`
Customer-facing vehicle. Fields: `id`, `make`, `model`, `year`, `mileage`, `price` (whole USD),
`bodyType`, `specs` (customer-facing key/values only), `imageUrl`, `detailUrl`. **No internal fields
may be added.** `id` is the dealer site's stable car id and becomes `source_car_id` in the chatbot DB.

### `CarsResponse`
`{ dealerId, cars: Car[] }` — the body returned by the dealer site's protected `GET /api/cars`. Only
`available` cars are included.

### `RecommendedCar`
`{ id, why }` — the assistant references each recommendation **by id** plus a one-line reason. It must
never echo full car data; the widget fetches/links display data by id.

### `AssistantResult`
`{ response: string, cars: RecommendedCar[], suggestedAnswers: string[] }` — the schema the answer
model is constrained to return. `cars` length ≤ `MAX_RECOMMENDED_CARS` (5). Rendered as a friendly
message + car cards + suggestion chips; never displayed as raw text.

### Constants
- `MAX_RECOMMENDED_CARS = 5` — hard cap on cars per reply and on cars sent to the model.
- `EMBEDDING_DIMS = 768` — Gemini `gemini-embedding-001` output dimensionality (pgvector `vector(768)`).

## Invariants enforced around the contract

1. `GET /api/cars` returns only customer-facing `Car` fields and only `available` cars.
2. Every chatbot retrieval filters by `dealer_id` (cross-dealer isolation).
3. Re-sync upserts on `(dealer_id, source_car_id)` — no duplicates.
4. Every `RecommendedCar.id` is verified to exist in the dealer's knowledge base before reaching a user.
5. At most `MAX_RECOMMENDED_CARS` cars are ever sent to the answer model.

## Chatbot knowledge-base schema (shared platform datastore)

[`kb-schema.sql`](./kb-schema.sql) is the single source of truth for the chatbot KB tables
(`dealers`; `cars` with `vector(768)` + `unique(dealer_id, source_car_id)`; `sync_jobs`) and the
`match_cars` retrieval RPC. Per Constitution Principle I's **shared platform datastore exception**
(v1.1.0), this database is shared infrastructure — written by `drivemind-admin` (the migration owner)
and read by `drivemind-chatbot` — NOT "another app's private database." It is therefore governed
exactly like `contract.ts`: `kb-schema.sql` is **mirrored into both repos** (`supabase/kb-schema.sql`),
any change is applied to both in the **same change set**, and CI fails on drift. `drivemind-chatbot`
depends on this schema by contract, never by code import. The dealer's own inventory DB
(`nextgear-site`) stays private and is reached only via `GET /api/cars`.

## Change procedure

1. Edit `contract/contract.ts` + this `SCHEMA.md` (and `contract/kb-schema.sql` for KB changes).
2. Copy `contract.ts`/`SCHEMA.md` into each repo's `lib/`, and `kb-schema.sql` into the admin and
   chatbot repos' `supabase/`, in the **same** change set.
3. Update dependent code in all affected repos and the contract/schema tests.
4. CI: contract-drift diff passes (3 `contract.ts` copies identical), KB-schema-drift diff passes
   (admin + chatbot `kb-schema.sql` identical), and cross-app-import lint passes.
