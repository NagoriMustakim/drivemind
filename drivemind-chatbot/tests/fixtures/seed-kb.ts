/**
 * T018: KB test fixture. Inserts a dealer + a few enriched cars (use_case +
 * deterministic 768-dim embeddings) so retrieval/query can be tested
 * independently of a real sync. Used by DB-gated integration tests.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { EMBEDDING_DIMS } from "../../lib/contract";

export const TEST_DEALER = "test-dealer";
export const OTHER_DEALER = "other-dealer";

/** Deterministic unit-ish vector seeded by a number (avoids Math.random). */
function vec(seed: number): number[] {
  return Array.from({ length: EMBEDDING_DIMS }, (_, i) => ((seed * 7 + i) % 100) / 100);
}

export function testClient(): SupabaseClient | null {
  const url = process.env.TEST_SUPABASE_URL;
  const key = process.env.TEST_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function seedKb(supabase: SupabaseClient): Promise<void> {
  await supabase.from("dealers").upsert([
    { dealer_id: TEST_DEALER, name: "Test Dealer", registered_domain: "https://test.example.com" },
    { dealer_id: OTHER_DEALER, name: "Other Dealer", registered_domain: "https://other.example.com" },
  ]);

  const rows = [
    { dealer: TEST_DEALER, src: "t1", make: "Toyota", model: "RAV4", price: 24000, body: "SUV", seed: 1 },
    { dealer: TEST_DEALER, src: "t2", make: "Honda", model: "Civic", price: 19000, body: "Sedan", seed: 2 },
    { dealer: TEST_DEALER, src: "t3", make: "Mazda", model: "MX-5", price: 26000, body: "Convertible", seed: 3 },
    { dealer: TEST_DEALER, src: "t4", make: "Ford", model: "F-150", price: 34000, body: "Truck", seed: 4 },
    { dealer: TEST_DEALER, src: "t5", make: "Kia", model: "Sportage", price: 22000, body: "SUV", seed: 5 },
    { dealer: TEST_DEALER, src: "t6", make: "BMW", model: "3 Series", price: 29000, body: "Sedan", seed: 6 },
    // Belongs to a DIFFERENT dealer — must never surface for TEST_DEALER.
    { dealer: OTHER_DEALER, src: "o1", make: "Audi", model: "A5", price: 20000, body: "Coupe", seed: 9 },
  ];

  await supabase.from("cars").upsert(
    rows.map((r) => ({
      dealer_id: r.dealer,
      source_car_id: r.src,
      make: r.make,
      model: r.model,
      year: 2021,
      mileage: 30000,
      price: r.price,
      body_type: r.body,
      specs: {},
      image_url: "https://example.com/car.jpg",
      detail_url: `https://test.example.com/cars/${r.src}`,
      use_case: `${r.make} ${r.model} — good for ${r.body} shoppers`,
      embedding: vec(r.seed),
    })),
    { onConflict: "dealer_id,source_car_id" },
  );
}
