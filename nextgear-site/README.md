# nextgear-site — Dealer Website (DriveMind APP 1)

A realistic used-car dealership site. Server-rendered inventory listing + detail pages, its own
Supabase DB (source of truth), a token-protected `GET /api/cars` feed, and the embedded Otto widget.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in values
# Apply the migration in your dealer Supabase project's SQL Editor:
#   supabase/migrations/0001_cars.sql
npm run seed                 # inserts ~50 realistic cars (reads .env.local)
npm run dev                  # http://localhost:3000
```

## Environment (server-only)

| Var | Purpose |
|-----|---------|
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Dealer Supabase project |
| `DEALER_API_TOKEN` | Bearer token protecting `GET /api/cars` (paste the same value into admin Sync) |
| `SITE_URL` | Public base URL (used to build absolute car detail URLs) |
| `DEALER_ID` | This dealer's public id (default `nextgear`) |
| `NEXT_PUBLIC_OTTO_SRC` / `NEXT_PUBLIC_OTTO_API` / `NEXT_PUBLIC_DEALER_ID` | Otto widget `<script>` config (public) |

## Key paths

- `app/(site)/page.tsx` — inventory listing · `app/(site)/cars/[id]/page.tsx` — detail page
- `app/api/cars/route.ts` — protected contract feed (available cars only, customer-facing fields only)
- `lib/cars.ts` — DB access + contract mapping · `lib/auth.ts` — Bearer check
- `scripts/seed.ts` — 50-car seed (Unsplash images pooled by body type)

## Commands

`npm run dev | build | start | lint | typecheck | test | seed`

## Deploy

Deploy as its own Vercel project. Set all env vars in the Vercel dashboard. Point
`NEXT_PUBLIC_OTTO_SRC`/`NEXT_PUBLIC_OTTO_API` at your deployed `drivemind-chatbot`.
