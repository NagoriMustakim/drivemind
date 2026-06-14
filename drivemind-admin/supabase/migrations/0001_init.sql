-- Chatbot KB DB (shared platform datastore) — applied by drivemind-admin, read
-- by drivemind-chatbot. This migration applies the TABLE schema from the
-- canonical contract/kb-schema.sql (mirrored at supabase/kb-schema.sql). The
-- match_cars RPC is applied separately in 0002_match_cars.sql (task T025).
-- CI fails if supabase/kb-schema.sql drifts from the canonical (Principle I).

create extension if not exists vector;

create table if not exists dealers (
  dealer_id          text primary key,
  name               text not null,
  registered_domain  text not null,
  inventory_api_url  text,
  created_at         timestamptz not null default now()
);

create table if not exists cars (
  id            uuid primary key default gen_random_uuid(),
  dealer_id     text not null references dealers (dealer_id) on delete cascade,
  source_car_id text not null,
  make          text not null,
  model         text not null,
  year          int  not null,
  mileage       int  not null,
  price         int  not null,
  body_type     text not null,
  specs         jsonb not null default '{}'::jsonb,
  image_url     text,
  detail_url    text not null,
  use_case      text not null,
  embedding     vector(768) not null,
  updated_at    timestamptz not null default now(),
  constraint cars_dealer_source_unique unique (dealer_id, source_car_id)
);

create index if not exists cars_dealer_price_idx    on cars (dealer_id, price);
create index if not exists cars_dealer_bodytype_idx on cars (dealer_id, body_type);
create index if not exists cars_embedding_cosine_idx
  on cars using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create table if not exists sync_jobs (
  id               uuid primary key default gen_random_uuid(),
  dealer_id        text not null references dealers (dealer_id) on delete cascade,
  status           text not null default 'running'
                     check (status in ('running','completed','failed')),
  total            int,
  processed        int  not null default 0,
  searchable_count int  not null default 0,
  error            text,
  started_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
