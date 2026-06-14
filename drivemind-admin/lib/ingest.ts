/**
 * Ingestion pipeline (T041): for each car, extract a use_case, embed it, and
 * idempotently UPSERT into the KB on (dealer_id, source_car_id) — so re-syncs
 * update in place and never duplicate (FR-021). Runs in batches (~20/call) to
 * respect Vercel function timeouts (Constitution VII).
 */
import "server-only";
import { getSupabase, withWake } from "./supabase";
import { extractUseCase, embedDocument } from "./gemini";
import type { Car } from "./contract";

export const BATCH_SIZE = 20;

interface KbCarRow {
  dealer_id: string;
  source_car_id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  body_type: string;
  specs: Car["specs"];
  image_url: string;
  detail_url: string;
  use_case: string;
  embedding: number[];
  updated_at: string;
}

/** Enrich a single car into a KB row (use_case + embedding). */
export async function enrichCar(dealerId: string, car: Car, now: string): Promise<KbCarRow> {
  const useCase = await extractUseCase(car);
  const embedding = await embedDocument(useCase);
  return {
    dealer_id: dealerId,
    source_car_id: car.id,
    make: car.make,
    model: car.model,
    year: car.year,
    mileage: car.mileage,
    price: car.price,
    body_type: car.bodyType,
    specs: car.specs,
    image_url: car.imageUrl,
    detail_url: car.detailUrl,
    use_case: useCase,
    embedding,
    updated_at: now,
  };
}

/** Fields whose change should trigger re-enrichment (they shape the use_case). */
function contentSignature(c: {
  make: unknown;
  model: unknown;
  year: unknown;
  mileage: unknown;
  price: unknown;
  body_type: unknown;
  specs: unknown;
}): string {
  return JSON.stringify([c.make, c.model, c.year, c.mileage, c.price, c.body_type, c.specs]);
}

/** Existing KB rows for these source ids, keyed by source_car_id (T050). */
async function fetchExisting(
  dealerId: string,
  sourceIds: string[],
): Promise<Map<string, Record<string, unknown>>> {
  if (sourceIds.length === 0) return new Map();
  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () =>
      await supabase
        .from("cars")
        .select("source_car_id, make, model, year, mileage, price, body_type, specs")
        .eq("dealer_id", dealerId)
        .in("source_car_id", sourceIds),
  );
  if (error) throw error;
  const map = new Map<string, Record<string, unknown>>();
  for (const row of (data ?? []) as Record<string, unknown>[]) {
    map.set(row.source_car_id as string, row);
  }
  return map;
}

/**
 * Enrich + idempotently upsert a batch of cars. The unique (dealer_id,
 * source_car_id) constraint makes this safe to re-run (no duplicates). Cars
 * whose content is unchanged since the last sync are SKIPPED — no Gemini calls —
 * to respect free-tier rate limits on re-sync (T050).
 */
export async function ingestBatch(dealerId: string, cars: Car[], now: string): Promise<number> {
  if (cars.length === 0) return 0;

  const existing = await fetchExisting(
    dealerId,
    cars.map((c) => c.id),
  );

  const rows: KbCarRow[] = [];
  for (const car of cars) {
    const prior = existing.get(car.id);
    const incomingSig = contentSignature({
      make: car.make,
      model: car.model,
      year: car.year,
      mileage: car.mileage,
      price: car.price,
      body_type: car.bodyType,
      specs: car.specs,
    });
    if (prior && contentSignature(prior as Parameters<typeof contentSignature>[0]) === incomingSig) {
      continue; // unchanged — keep the existing enriched row, skip re-embedding
    }
    rows.push(await enrichCar(dealerId, car, now));
  }

  if (rows.length === 0) return 0;
  const supabase = getSupabase();
  const { error } = await withWake(
    async () => await supabase.from("cars").upsert(rows, { onConflict: "dealer_id,source_car_id" }),
  );
  if (error) throw error;
  return rows.length;
}

/**
 * Remove KB cars that no longer exist in the dealer's source inventory (T049).
 * Called once a sync has covered the full source set, so re-syncs reflect
 * removals (FR-021/SC-006). Returns the number deleted.
 */
export async function reconcileRemovals(dealerId: string, validSourceIds: string[]): Promise<number> {
  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () => await supabase.from("cars").select("source_car_id").eq("dealer_id", dealerId),
  );
  if (error) throw error;
  const valid = new Set(validSourceIds);
  const toDelete = ((data ?? []) as { source_car_id: string }[])
    .map((r) => r.source_car_id)
    .filter((id) => !valid.has(id));

  if (toDelete.length === 0) return 0;
  const { error: delError } = await withWake(
    async () =>
      await supabase.from("cars").delete().eq("dealer_id", dealerId).in("source_car_id", toDelete),
  );
  if (delError) throw delError;
  return toDelete.length;
}

export interface IngestedCar {
  source_car_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  body_type: string;
}

/** List ingested cars for a dealer (for the admin "what's searchable" view). */
export async function listIngested(dealerId: string): Promise<IngestedCar[]> {
  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () =>
      await supabase
        .from("cars")
        .select("source_car_id, make, model, year, price, body_type")
        .eq("dealer_id", dealerId)
        .order("make", { ascending: true }),
  );
  if (error) throw error;
  return (data ?? []) as IngestedCar[];
}

/** Count cars currently searchable for a dealer. */
export async function countSearchable(dealerId: string): Promise<number> {
  const supabase = getSupabase();
  const { count, error } = await withWake(
    async () =>
      await supabase
        .from("cars")
        .select("id", { count: "exact", head: true })
        .eq("dealer_id", dealerId),
  );
  if (error) throw error;
  return count ?? 0;
}
