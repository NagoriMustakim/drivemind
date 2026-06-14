/**
 * Critical path (c): retrieval (tasks T021).
 * - parseConstraints: pure unit coverage (runs anywhere).
 * - match_cars SQL: DB-gated — runs only when TEST_SUPABASE_* is set; verifies
 *   dealer scoping + the LIMIT 5 cap directly against pgvector.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { parseConstraints } from "@/lib/retrieval";
import { EMBEDDING_DIMS } from "@/lib/contract";
import { testClient, seedKb, TEST_DEALER, OTHER_DEALER } from "../fixtures/seed-kb";

describe("parseConstraints", () => {
  it("extracts price + body type from a precise query", () => {
    expect(parseConstraints("an SUV under $25,000")).toEqual({ maxPrice: 25000, bodyType: "SUV" });
  });

  it("returns no constraints for a fuzzy query", () => {
    expect(parseConstraints("a fun weekend car")).toEqual({ maxPrice: null, bodyType: null });
  });

  it("understands 'k' shorthand and synonyms", () => {
    expect(parseConstraints("cheap pickup under 15k")).toEqual({ maxPrice: 15000, bodyType: "Truck" });
  });

  it("matches convertible + dollar amount", () => {
    expect(parseConstraints("convertible below $40000")).toEqual({ maxPrice: 40000, bodyType: "Convertible" });
  });
});

const supabase = testClient();
const dbDescribe = supabase ? describe : describe.skip;

dbDescribe("match_cars RPC (DB-gated)", () => {
  beforeAll(async () => {
    if (supabase) await seedKb(supabase);
  });

  it("returns only the requested dealer's cars, capped at 5", async () => {
    const queryVec = Array.from({ length: EMBEDDING_DIMS }, () => 0.5);
    const { data, error } = await supabase!.rpc("match_cars", {
      p_dealer_id: TEST_DEALER,
      p_query_vec: queryVec,
      p_max_price: null,
      p_body_type: null,
      p_limit: 5,
    });
    expect(error).toBeNull();
    expect(data!.length).toBeLessThanOrEqual(5);
    expect(data!.every((c: { dealer_id: string }) => c.dealer_id === TEST_DEALER)).toBe(true);
    expect(data!.some((c: { dealer_id: string }) => c.dealer_id === OTHER_DEALER)).toBe(false);
  });

  it("applies the price hard constraint", async () => {
    const queryVec = Array.from({ length: EMBEDDING_DIMS }, () => 0.5);
    const { data } = await supabase!.rpc("match_cars", {
      p_dealer_id: TEST_DEALER,
      p_query_vec: queryVec,
      p_max_price: 20000,
      p_body_type: null,
      p_limit: 5,
    });
    expect(data!.every((c: { price: number }) => c.price <= 20000)).toBe(true);
  });
});
