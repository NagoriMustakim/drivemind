# Phase 1 Data Model: DriveMind

**Feature**: 001-drivemind | **Date**: 2026-06-11

Two physically separate databases (Constitution Principle I). The **shared contract** (the
customer-facing `Car` shape + `dealer_id`) is what crosses app boundaries over HTTP; everything else is
internal to one database and never leaves its app.

---

## Database A — Dealer DB (Supabase Postgres, owned by `nextgear-site`)

### Entity: `cars` (raw inventory — source of truth)

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid PK | the dealer site's own car id (becomes `source_car_id` downstream) |
| `make` | text, required | e.g. "Toyota" |
| `model` | text, required | e.g. "RAV4" |
| `year` | int, required | 1980–current+1 |
| `mileage` | int, required | ≥ 0 |
| `price` | int, required | USD, ≥ 0 |
| `body_type` | text, required | SUV, Sedan, Coupe, Truck, Convertible, Hatchback, Van, Wagon |
| `specs` | jsonb | transmission, drivetrain, fuel, seats, color, etc. (customer-facing only) |
| `image_url` | text | listing/detail image |
| `status` | text | `available` \| `sold` \| `pending`; only `available` is exported |
| `created_at` | timestamptz | default now() |

**Rules**: `GET /api/cars` returns **only** `status = 'available'`, mapped into the shared contract
`Car` shape. Internal/non-customer fields (cost, lead notes, etc.) — if ever added — MUST NOT be
exported. Seed script inserts ~50 realistic rows across varied body types and price bands.

---

## Database B — Chatbot DB (Supabase Postgres + pgvector; written by `drivemind-admin`, read by `drivemind-chatbot`)

### Extension

- `create extension if not exists vector;` (pgvector)

### Entity: `dealers` (registry)

| Field | Type | Notes |
|-------|------|-------|
| `dealer_id` | text PK | **public** id used by the widget and as the tenant scope |
| `name` | text | display name |
| `registered_domain` | text, required | used for Origin/Referer + CORS validation |
| `inventory_api_url` | text | the dealer's `GET /api/cars` URL (set in admin) |
| `created_at` | timestamptz | default now() |

> The dealer's inventory **token** is provided at sync time and used server-side only; it is not
> persisted in plaintext beyond what the demo requires (store securely / server-side env if persisted).

### Entity: `cars` (enriched knowledge base)

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid PK | chatbot-DB row id |
| `dealer_id` | text, FK → dealers, required | tenant scope; every query filters on this |
| `source_car_id` | text/uuid, required | the dealer DB car id |
| `make`,`model`,`year`,`mileage`,`price`,`body_type`,`specs`,`image_url` | — | mirrored from contract `Car` |
| `detail_url` | text | resolves to the car's detail page on the dealer site |
| `use_case` | text, required | Gemini-generated plain-language "best for" description |
| `embedding` | `vector(768)`, required | Gemini embedding of `use_case` (RETRIEVAL_DOCUMENT) |
| `updated_at` | timestamptz | set on every upsert |

**Constraints / indexes**:
- **`unique (dealer_id, source_car_id)`** → idempotent upsert key (re-sync updates in place; no dupes).
- Vector index for cosine distance (`embedding vector_cosine_ops`) — optional at demo scale, present
  for production fidelity.
- Btree on `(dealer_id, price)` and `(dealer_id, body_type)` to support hard-constraint filtering.

### Entity: `sync_jobs` (progress + resumable cursor)

| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid PK | job id |
| `dealer_id` | text, FK → dealers | which dealer is syncing |
| `status` | text | `running` \| `completed` \| `failed` |
| `total` | int | total cars pulled from source (known after first fetch) |
| `processed` | int | cars upserted so far (the resumable cursor) |
| `searchable_count` | int | cars currently searchable for this dealer (shown in UI) |
| `error` | text | last error message, if failed |
| `started_at` / `updated_at` | timestamptz | progress timestamps |

**State transitions**: `running → completed` (processed = total) | `running → failed` (unrecoverable
after retries) | `running → running` (each ~20-car batch advances `processed`, then re-invoked).

---

## Shared Contract (crosses app boundaries — mirrored `contract.ts`)

This is the only data shape shared between repos. Authored in `contracts/contract.ts`, copied verbatim
into each repo's `lib/contract.ts`.

- **`Car`** (customer-facing): `id`, `make`, `model`, `year`, `mileage`, `price`, `bodyType`, `specs`,
  `imageUrl`, `detailUrl`. (No internal fields.)
- **`DealerId`**: the public dealer identifier string shape.
- **`CarsResponse`**: `{ dealerId: DealerId, cars: Car[] }` returned by `GET /api/cars`.
- **`AssistantResult`** (chatbot structured output): `{ response: string, cars: { id: string, why:
  string }[], suggestedAnswers: string[] }`.

See [`contracts/contract.ts`](./contracts/contract.ts) and [`contracts/SCHEMA.md`](./contracts/SCHEMA.md)
for the authoritative types.

---

## Relationships

```text
Dealer DB.cars (source of truth, status=available)
        │  exported via GET /api/cars  →  shared contract Car[]
        ▼
drivemind-admin Sync  ──(Gemini: use_case + embedding)──►  Chatbot DB.cars
        │                                                   (dealer_id, source_car_id) UNIQUE
        │  progress tracked in                              embedding vector(768)
        ▼
   Chatbot DB.sync_jobs

drivemind-chatbot /query  ──reads──►  Chatbot DB.cars
   filter dealer_id + hard constraints, order by embedding <=> query_vec LIMIT 5
   → Claude (≤5 cars) → structured AssistantResult → verify ids exist → SSE
   /session validates Origin/Referer vs dealers.registered_domain → JWT
```

## Validation rules summary

- `GET /api/cars` exports only `available` cars and only customer-facing fields (FR-004, FR-014, SC-010).
- Every chatbot query filters by `dealer_id` → cross-dealer isolation (FR-005, SC-004).
- Re-sync upserts on `(dealer_id, source_car_id)` → no duplicates (FR-021, SC-006).
- Each enriched car has a non-null `use_case` + `embedding` before it is counted searchable (FR-019).
- Returned `cars[].id` must exist in `Chatbot DB.cars` for that dealer before reaching the user
  (FR-004, SC-003).
