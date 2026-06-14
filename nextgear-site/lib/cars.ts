/**
 * Dealer-DB car access (server-only). Used by the listing/detail pages and,
 * later, by GET /api/cars (T039). Maps raw rows to the shared contract `Car`
 * shape, exposing ONLY customer-facing fields (Constitution Principle IV).
 */
import "server-only";
import { getSupabase, withWake } from "./supabase";
import type { Car, BodyType } from "./contract";
import { env } from "./env";

export interface DbCar {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  body_type: BodyType;
  specs: Record<string, string | number | boolean | string[]>;
  image_url: string | null;
  status: "available" | "sold" | "pending";
  created_at: string;
}

const SELECT_COLUMNS = "id, make, model, year, mileage, price, body_type, specs, image_url, status, created_at";

/** Build the absolute detail-page URL for a car (used in the contract Car shape). */
export function detailUrlFor(id: string): string {
  return `${env.siteUrl.replace(/\/$/, "")}/cars/${id}`;
}

/** Map a raw dealer row to the customer-facing contract Car (no internal fields). */
export function toContractCar(row: DbCar): Car {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    price: row.price,
    bodyType: row.body_type,
    specs: row.specs as Car["specs"],
    imageUrl: row.image_url ?? "",
    detailUrl: detailUrlFor(row.id),
  };
}

/** All available cars (the only status exposed to shoppers / the platform). */
export async function getAvailableCars(): Promise<DbCar[]> {
  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () =>
      await supabase
        .from("cars")
        .select(SELECT_COLUMNS)
        .eq("status", "available")
        .order("created_at", { ascending: false }),
  );
  if (error) throw error;
  return (data ?? []) as DbCar[];
}

/** A single car by id (any status — detail page may show a sold car as unavailable). */
export async function getCarById(id: string): Promise<DbCar | null> {
  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () => await supabase.from("cars").select(SELECT_COLUMNS).eq("id", id).maybeSingle(),
  );
  if (error) throw error;
  return (data as DbCar | null) ?? null;
}
