/**
 * T048: idempotent re-sync (FR-021, SC-006). After edits/additions/removals,
 * the KB has no duplicates, updates are applied, removed cars are gone, the
 * count is correct, and unchanged cars are NOT re-embedded (Gemini not called).
 */
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Car } from "@/lib/contract";

const holder = vi.hoisted(() => ({
  fake: null as ReturnType<typeof import("../fixtures/fake-supabase").makeFakeSupabase> | null,
  cars: [] as Car[],
}));

const extractSpy = vi.fn(async (car: Car) => `desc ${car.id} @ ${car.price}`);

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => holder.fake!.client,
  withWake: <T>(fn: () => Promise<T>) => fn(),
}));
vi.mock("@/lib/gemini", () => ({
  extractUseCase: (car: Car) => extractSpy(car),
  embedDocument: vi.fn(async () => new Array(768).fill(0.1)),
}));

import { makeFakeSupabase } from "../fixtures/fake-supabase";
import { advanceSync } from "@/lib/sync";
import { countSearchable } from "@/lib/ingest";

function car(id: string, price: number): Car {
  return {
    id,
    make: "Make",
    model: id,
    year: 2021,
    mileage: 10000,
    price,
    bodyType: "Sedan",
    specs: {},
    imageUrl: "https://example.com/x.jpg",
    detailUrl: `https://dealer.example.com/cars/${id}`,
  };
}

async function fullSync(): Promise<void> {
  const params = { dealerId: "d1", apiUrl: "http://x/api/cars", token: "secret" };
  let job = await advanceSync(params);
  let guard = 0;
  while (job.status === "running" && guard++ < 50) job = await advanceSync({ ...params, jobId: job.id });
}

beforeEach(() => {
  holder.fake = makeFakeSupabase();
  extractSpy.mockClear();
  globalThis.fetch = vi.fn(async () =>
    new Response(JSON.stringify({ dealerId: "d1", cars: holder.cars }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  ) as unknown as typeof fetch;
});

describe("re-sync", () => {
  it("updates changed cars, adds new, removes deleted — no duplicates", async () => {
    // First sync: a, b, c
    holder.cars = [car("a", 20000), car("b", 21000), car("c", 22000)];
    await fullSync();
    expect(await countSearchable("d1")).toBe(3);

    // Source changes: b's price changed, c removed, d added.
    holder.cars = [car("a", 20000), car("b", 25000), car("d", 23000)];
    extractSpy.mockClear();
    await fullSync();

    expect(await countSearchable("d1")).toBe(3); // a, b, d — c removed, no dupes
    const ids = [...holder.fake!.store.cars.keys()].sort();
    expect(ids).toEqual(["d1|a", "d1|b", "d1|d"]);
    expect(holder.fake!.store.cars.get("d1|b")!.price).toBe(25000); // updated in place

    // Only changed/new cars were re-embedded: b (price changed) + d (new). NOT a.
    const reEmbedded = extractSpy.mock.calls.map((c) => c[0].id).sort();
    expect(reEmbedded).toEqual(["b", "d"]);
  });
});
