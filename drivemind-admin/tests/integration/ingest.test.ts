/**
 * Critical path (b): ingestion pipeline — extract → embed → IDEMPOTENT upsert
 * by (dealer_id, source_car_id) (tasks T037). Verifies re-ingesting the same
 * car updates in place (no duplicates) and that rows carry use_case + 768d embed.
 */
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Car } from "@/lib/contract";

const holder = vi.hoisted(() => ({ fake: null as ReturnType<typeof import("../fixtures/fake-supabase").makeFakeSupabase> | null }));

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => holder.fake!.client,
  withWake: <T>(fn: () => Promise<T>) => fn(),
}));
vi.mock("@/lib/gemini", () => ({
  extractUseCase: vi.fn(async (car: Car) => `Best for ${car.bodyType} shoppers: ${car.make} ${car.model}`),
  embedDocument: vi.fn(async () => new Array(768).fill(0.1)),
}));

import { makeFakeSupabase } from "../fixtures/fake-supabase";
import { ingestBatch, countSearchable } from "@/lib/ingest";

function car(id: string): Car {
  return {
    id,
    make: "Toyota",
    model: "RAV4",
    year: 2021,
    mileage: 20000,
    price: 24000,
    bodyType: "SUV",
    specs: { fuelType: "Gasoline" },
    imageUrl: "https://example.com/x.jpg",
    detailUrl: `https://dealer.example.com/cars/${id}`,
  };
}

beforeEach(() => {
  holder.fake = makeFakeSupabase();
});

describe("ingestBatch", () => {
  it("enriches each car with use_case + 768-dim embedding and upserts it", async () => {
    const upserted = await ingestBatch("d1", [car("c1"), car("c2")], "2026-01-01T00:00:00Z");
    expect(upserted).toBe(2);
    expect(await countSearchable("d1")).toBe(2);

    const row = holder.fake!.store.cars.get("d1|c1") as Record<string, unknown>;
    expect(row.source_car_id).toBe("c1");
    expect(typeof row.use_case).toBe("string");
    expect((row.embedding as number[]).length).toBe(768);
    expect(row.body_type).toBe("SUV"); // mapped from contract bodyType
  });

  it("is idempotent: re-ingesting the same car does not create a duplicate", async () => {
    await ingestBatch("d1", [car("c1"), car("c2")], "t1");
    await ingestBatch("d1", [car("c1")], "t2"); // re-sync c1 with a newer timestamp
    expect(await countSearchable("d1")).toBe(2); // still 2, not 3
  });

  it("scopes counts per dealer", async () => {
    await ingestBatch("d1", [car("c1")], "t1");
    await ingestBatch("d2", [car("c1")], "t1"); // same source id, different dealer
    expect(await countSearchable("d1")).toBe(1);
    expect(await countSearchable("d2")).toBe(1);
  });
});
