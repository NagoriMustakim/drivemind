-- DriveMind chatbot knowledge-base schema — SHARED PLATFORM DATASTORE.
--
-- SINGLE SOURCE OF TRUTH for the chatbot KB. This datastore is written by
-- drivemind-admin and read by drivemind-chatbot (Constitution Principle I,
-- explicit shared-platform-datastore exception). This file is MIRRORED VERBATIM
-- into both repos (drivemind-admin/supabase/kb-schema.sql and
-- drivemind-chatbot/supabase/kb-schema.sql). Any change MUST be applied to both
-- in the SAME change set; CI diffs the copies and fails on drift, exactly as for
-- contract.ts. drivemind-admin is the migration OWNER (it applies these via its
-- supabase/migrations); drivemind-chatbot depends on this schema by CONTRACT,
-- never by code import.
--
-- Embedding dimensionality is 768 (Gemini gemini-embedding-001) and MUST match
-- EMBEDDING_DIMS in contract.ts.

create extension if not exists vector;

-- Dealer registry (tenant scope + origin/CORS validation source).
create table if not exists dealers (
  dealer_id          text primary key,            -- PUBLIC id used by the widget + tenant scope
  name               text not null,
  registered_domain  text not null,               -- validated against Origin/Referer; CORS lock
  inventory_api_url  text,                         -- the dealer's GET /api/cars URL
  created_at         timestamptz not null default now()
);

-- Enriched, embedded cars (the searchable knowledge base).
create table if not exists cars (
  id            uuid primary key default gen_random_uuid(),
  dealer_id     text not null references dealers (dealer_id) on delete cascade,
  source_car_id text not null,                     -- the dealer DB car id (contract Car.id)
  make          text not null,
  model         text not null,
  year          int  not null,
  mileage       int  not null,
  price         int  not null,                     -- whole USD
  body_type     text not null,                     -- shared BodyType taxonomy
  specs         jsonb not null default '{}'::jsonb,-- customer-facing specs only
  image_url     text,
  detail_url    text not null,                     -- resolves to the dealer-site detail page
  use_case      text not null,                     -- Gemini "best for" description (embedded text)
  embedding     vector(768) not null,              -- Gemini RETRIEVAL_DOCUMENT embedding of use_case
  updated_at    timestamptz not null default now(),
  -- Idempotent upsert key: re-sync updates in place, never duplicates.
  constraint cars_dealer_source_unique unique (dealer_id, source_car_id)
);

-- Hard-constraint filter support (filter before vector rank).
create index if not exists cars_dealer_price_idx     on cars (dealer_id, price);
create index if not exists cars_dealer_bodytype_idx   on cars (dealer_id, body_type);
-- Cosine vector index (optional at demo scale; present for production fidelity).
create index if not exists cars_embedding_cosine_idx
  on cars using ivfflat (embedding vector_cosine_ops) with (lists = 100);

-- Resumable sync progress.
create table if not exists sync_jobs (
  id               uuid primary key default gen_random_uuid(),
  dealer_id        text not null references dealers (dealer_id) on delete cascade,
  status           text not null default 'running'  -- running | completed | failed
                     check (status in ('running', 'completed', 'failed')),
  total            int,                              -- total cars pulled from source
  processed        int  not null default 0,          -- resumable cursor
  searchable_count int  not null default 0,          -- cars currently searchable for this dealer
  error            text,                             -- last error message if failed
  started_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ONE combined filter + cosine-rank retrieval (no N+1). Read by drivemind-chatbot.
-- p_body_type / p_max_price are optional hard constraints (NULL = unconstrained).
-- Returns at most p_limit rows (caller passes <= MAX_RECOMMENDED_CARS = 5).
create or replace function match_cars(
  p_dealer_id text,
  p_query_vec vector(768),
  p_max_price int  default null,
  p_body_type text default null,
  p_limit     int  default 5
)
returns setof cars
language sql
stable
as $$
  select *
  from cars
  where dealer_id = p_dealer_id
    and (p_max_price is null or price <= p_max_price)
    and (p_body_type is null or body_type = p_body_type)
  order by embedding <=> p_query_vec
  limit least(p_limit, 5);
$$;
