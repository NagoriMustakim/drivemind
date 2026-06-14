/**
 * Sync orchestration helpers (T042/T043): fetch the dealer's inventory over
 * HTTP, manage the sync_jobs lifecycle, and map rows to the API DTO. The dealer
 * DB is reached ONLY via its HTTP API (Constitution Principle I).
 */
import "server-only";
import { getSupabase, withWake } from "./supabase";
import { ingestBatch, countSearchable, reconcileRemovals, BATCH_SIZE } from "./ingest";
import type { Car, CarsResponse } from "./contract";

export interface SyncJobRow {
  id: string;
  dealer_id: string;
  status: "running" | "completed" | "failed";
  total: number | null;
  processed: number;
  searchable_count: number;
  error: string | null;
}

export interface SyncJobDto {
  id: string;
  dealerId: string;
  status: "running" | "completed" | "failed";
  total: number | null;
  processed: number;
  searchableCount: number;
  error: string | null;
}

const JOB_COLUMNS = "id, dealer_id, status, total, processed, searchable_count, error";

export function toDto(row: SyncJobRow): SyncJobDto {
  return {
    id: row.id,
    dealerId: row.dealer_id,
    status: row.status,
    total: row.total,
    processed: row.processed,
    searchableCount: row.searchable_count,
    error: row.error,
  };
}

/** Fetch the dealer's available cars from their protected GET /api/cars. */
export async function fetchDealerCars(apiUrl: string, token: string): Promise<Car[]> {
  const res = await fetch(apiUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Dealer API returned ${res.status}`);
  }
  const body = (await res.json()) as CarsResponse;
  if (!body || !Array.isArray(body.cars)) {
    throw new Error("Dealer API response missing cars[]");
  }
  return body.cars;
}

export async function createJob(dealerId: string, total: number): Promise<SyncJobRow> {
  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () =>
      await supabase
        .from("sync_jobs")
        .insert({ dealer_id: dealerId, status: "running", total, processed: 0, searchable_count: 0 })
        .select(JOB_COLUMNS)
        .single(),
  );
  if (error) throw error;
  return data as SyncJobRow;
}

export async function getJob(jobId: string): Promise<SyncJobRow | null> {
  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () => await supabase.from("sync_jobs").select(JOB_COLUMNS).eq("id", jobId).maybeSingle(),
  );
  if (error) throw error;
  return (data as SyncJobRow | null) ?? null;
}

export async function updateJob(jobId: string, patch: Partial<SyncJobRow>): Promise<SyncJobRow> {
  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () =>
      await supabase
        .from("sync_jobs")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", jobId)
        .select(JOB_COLUMNS)
        .single(),
  );
  if (error) throw error;
  return data as SyncJobRow;
}

export interface AdvanceParams {
  dealerId: string;
  apiUrl: string;
  token: string;
  jobId?: string;
}

/**
 * Advance a sync by ONE batch (start a new job if no jobId). Resumable: re-fetch
 * the dealer cars, process the slice [processed, processed+BATCH], upsert
 * idempotently, recompute the searchable count, and mark completed when done.
 * On any failure the job is marked `failed` with a clear error — and because
 * ingestBatch upserts atomically per batch, a failure never leaves partial or
 * duplicate KB rows (FR-024).
 */
export async function advanceSync(params: AdvanceParams): Promise<SyncJobDto> {
  // Create a job record up front so failures are always recorded (no silent loss).
  let job = params.jobId ? await getJob(params.jobId) : await createJob(params.dealerId, 0);
  if (!job) throw new Error("unknown job");

  try {
    const cars = await fetchDealerCars(params.apiUrl, params.token);
    const total = cars.length;
    const slice = cars.slice(job.processed, job.processed + BATCH_SIZE);
    await ingestBatch(params.dealerId, slice, new Date().toISOString());

    const processed = job.processed + slice.length;
    const status: SyncJobRow["status"] = processed >= total ? "completed" : "running";

    // On completion, drop cars that no longer exist in the source (FR-021/SC-006),
    // then recompute the searchable count.
    if (status === "completed") {
      await reconcileRemovals(
        params.dealerId,
        cars.map((c) => c.id),
      );
    }
    const searchable = await countSearchable(params.dealerId);

    job = await updateJob(job.id, {
      total,
      processed,
      searchable_count: searchable,
      status,
      error: null,
    });
    return toDto(job);
  } catch (err) {
    const message = err instanceof Error ? err.message : "sync failed";
    const failed = await updateJob(job.id, { status: "failed", error: message });
    return toDto(failed);
  }
}
