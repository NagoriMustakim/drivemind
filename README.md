# DriveMind

A demo-grade but production-shaped AI car-recommendation assistant ("Otto") that dealers embed on
their websites. Shoppers describe what they want in plain language and get a short list of real,
in-stock cars with reasons why each fits.

Built as **three independent apps** (separate repos/deployables) that communicate only over HTTP plus
one mirrored data contract (Constitution Principle I):

| App | Role | Data |
|-----|------|------|
| [`nextgear-site`](./nextgear-site) | Dealer website (NextGear Motors) + embeds Otto; exposes `GET /api/cars` | Dealer Supabase DB (raw inventory) |
| [`drivemind-admin`](./drivemind-admin) | Control plane: connect inventory + **Sync** (enrich + embed + upsert) | Chatbot Supabase DB (pgvector) — writes |
| [`drivemind-chatbot`](./drivemind-chatbot) | Assistant runtime (`/session`, `/query` SSE) + embeddable Preact widget | Chatbot Supabase DB — reads |

The shared contract lives in [`contract/`](./contract) (`contract.ts`, `SCHEMA.md`, `kb-schema.sql`)
and is mirrored into each repo by [`scripts/sync-contract.sh`](./scripts/sync-contract.sh); CI
([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) fails on drift, cross-app imports, secrets
in client code, and an oversized widget bundle.

## Architecture at a glance

```
shopper ─▶ nextgear-site (Otto widget, shadow DOM)
                │  POST /session (origin→JWT)   POST /query (SSE)
                ▼
        drivemind-chatbot ──reads──▶ Chatbot DB (pgvector)
                ▲                         ▲ writes
   GET /api/cars│ (Bearer)                │
        nextgear-site ◀── Sync ── drivemind-admin (Gemini enrich+embed, batched upsert)
```

- **Retrieval**: embed only the short query, ONE pgvector filter+cosine query (`match_cars`, `LIMIT 5`).
- **Answer**: Claude returns schema-constrained JSON `{response, cars:[{id,why}], suggestedAnswers}`;
  every car id is verified to exist in the KB before reaching the user (anti-hallucination).
- **$0 stack**: Vercel hobby ×3 + Supabase free ×2 (pgvector) + Gemini free tier + Claude key.

## Run it locally (demo order)

1. **Provision**: 2 Supabase projects (dealer DB + chatbot DB with `pgvector`); get Gemini + Anthropic keys.
2. **Contract**: `bash scripts/sync-contract.sh` (mirrors contract into all repos).
3. **nextgear-site**: run `supabase/migrations/0001_cars.sql`, set `.env.local`, `npm run seed`, `npm run dev`.
4. **chatbot DB**: run `drivemind-admin/supabase/migrations/0001_init.sql` + `0002_match_cars.sql`.
5. **drivemind-admin**: set `.env.local`, `npm run register-dealer`, `npm run dev` → enter the dealer
   API URL + token → **Sync**.
6. **drivemind-chatbot**: set `.env.local`, `npm run widget:build`, `npm run dev` → open the dealer
   site and chat with Otto.

See [`specs/001-drivemind/quickstart.md`](./specs/001-drivemind/quickstart.md) for the full validation
scenarios, and each app's own README for env vars and deploy notes.

## Tests

Each app: `npm test` (Vitest). Coverage targets the four critical paths — token/origin validation,
ingestion (extract→embed→idempotent upsert), retrieval (filter+cosine), and structured-JSON parse +
car-id existence — plus re-sync reconciliation and widget rendering.
