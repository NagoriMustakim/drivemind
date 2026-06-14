-- T025: the match_cars retrieval RPC. Canonical source is contract/kb-schema.sql
-- (mirrored at supabase/kb-schema.sql); this migration applies it to the KB DB.
-- ONE combined filter + cosine-rank query (no N+1), scoped to a dealer, LIMIT <=5.

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
