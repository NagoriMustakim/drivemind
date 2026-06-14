# drivemind-admin — Control Plane (DriveMind APP 2)

Where a dealer connects their inventory and syncs it into the assistant's knowledge base. Owns the
chatbot KB Supabase schema (writes); `drivemind-chatbot` reads it.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values (CHATBOT DB project)
# In the chatbot Supabase project's SQL Editor, run (enables pgvector + tables + RPC):
#   supabase/migrations/0001_init.sql
#   supabase/migrations/0002_match_cars.sql
npm run register-dealer      # inserts the demo dealer (reads .env.local; DEALER_* overrides)
npm run dev                  # http://localhost:3001  (use: next dev -p 3001)
```

## Environment (server-only)

| Var | Purpose |
|-----|---------|
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Chatbot KB Supabase project |
| `GEMINI_API_KEY` | use_case extraction + document embeddings (free tier) |

`register-dealer` also reads `DEALER_ID`, `DEALER_NAME`, `DEALER_DOMAIN`, `DEALER_API_URL`.

## How Sync works

`POST /api/sync { dealerId, apiUrl, token, jobId? }` processes **one ~20-car batch** per call and is
resumable; the UI loops until `completed`. Per car: Gemini writes a use_case → embeds it (768d,
RETRIEVAL_DOCUMENT) → idempotent upsert on `(dealer_id, source_car_id)`. On completion, cars missing
from the source are removed (reconciliation); unchanged cars are **not** re-embedded. Failures mark the
job `failed` with a clear error and never leave partial/duplicate rows.

- `lib/sync.ts` — fetch + job lifecycle + `advanceSync`
- `lib/ingest.ts` — enrich, idempotent upsert, reconcile removals, skip-unchanged
- `lib/gemini.ts` — extraction + embeddings · `app/page.tsx` — Sync dashboard

## Commands

`npm run dev | build | start | lint | typecheck | test | register-dealer`

## Deploy

Own Vercel project. Set env vars in the dashboard. `next dev -p 3001` locally to avoid clashing with
nextgear-site on 3000.
