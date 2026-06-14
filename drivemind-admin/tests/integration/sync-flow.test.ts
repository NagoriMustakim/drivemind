/**
 * T038: a full sync over >20 cars processes in resumable batches and completes
 * with searchableCount == source count.
 */
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Car } from "@/lib/contract";

const holder = vi.hoisted(() => ({ fake: null as ReturnType<typeof import("../fixtures/fake-supabase").makeFakeSupabase> | null }));

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => holder.fake!.client,
  withWake: <T>(fn: () => Promise<T>) => fn(),
}));
vi.mock("@/lib/gemini", () => ({
  extractUseCase: vi.fn(async (car: Car) => `desc ${car.id}`),
  embedDocument: vi.fn(async () => new Array(768).fill(0.1)),
}));

import { makeFakeSupabase } from "../fixtures/fake-supabase";
import { advanceSync } from "@/lib/sync";

function makeCars(n: number): Car[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i}`,
    make: "Make",
    model: `M${i}`,
    year: 2020,
    mileage: 10000,
    price: 20000,
    bodyType: "Sedan",
    specs: {},
    imageUrl: "https://example.com/x.jpg",
    detailUrl: `https://dealer.example.com/cars/c${i}`,
  }));
}

beforeEach(() => {
  holder.fake = makeFakeSupabase();
  globalThis.fetch = vi.fn(async () =>
    new Response(JSON.stringify({ dealerId: "d1", cars: makeCars(25) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  ) as unknown as typeof fetch;
});

describe("advanceSync (batched, resumable)", () => {
  it("processes 25 cars in two batches and completes with the right count", async () => {
    const params = { dealerId: "d1", apiUrl: "http://x/api/cars", token: "secret" };

    let job = await advanceSync(params);
    expect(job.status).toBe("running");
    expect(job.total).toBe(25);
    expect(job.processed).toBe(20); // BATCH_SIZE

    job = await advanceSync({ ...params, jobId: job.id });
    expect(job.status).toBe("completed");
    expect(job.processed).toBe(25);
    expect(job.searchableCount).toBe(25);
  });
});
