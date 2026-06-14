-- Dealer DB (nextgear-site) — raw inventory, the source of truth.
-- See specs/001-drivemind/data-model.md (Database A). Only customer-facing
-- fields live here; status gates what GET /api/cars exports (available only).

create table if not exists cars (
  id         uuid primary key default gen_random_uuid(),
  make       text not null,
  model      text not null,
  year       int  not null check (year between 1980 and 2026),
  mileage    int  not null check (mileage >= 0),
  price      int  not null check (price >= 0),              -- whole USD
  body_type  text not null check (body_type in
               ('SUV','Sedan','Coupe','Truck','Convertible','Hatchback','Van','Wagon')),
  specs      jsonb not null default '{}'::jsonb,            -- customer-facing specs only
  image_url  text,
  status     text not null default 'available'
               check (status in ('available','sold','pending')),
  created_at timestamptz not null default now()
);

-- Listing/browse and the exported feed both filter on availability.
create index if not exists cars_status_idx on cars (status);
create index if not exists cars_body_type_idx on cars (body_type);
create index if not exists cars_price_idx on cars (price);
