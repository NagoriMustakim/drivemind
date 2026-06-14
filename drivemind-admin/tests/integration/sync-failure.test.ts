/**
 * T038a: failed/interrupted sync (FR-024). Invalid/unreachable creds → job
 * status "failed" with a clear error; a mid-batch enrichment failure leaves NO
 * partial/duplicate KB rows (the batch upsert is atomic).
 */
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Car } from "@/lib/contract";

const holder = vi.hoisted(() => ({
  fake: null as ReturnType<typeof import("../fixtures/fake-supabase").makeFakeSupabase> | null,
  failOnId: null as string | null,
}));

vi.mock("@/lib/supabase", () => ({
  getSupabase: () => holder.fake!.client,
  withWake: <T>(fn: () => Promise<T>) => fn(),
}));
vi.mock("@/lib/gemini", () => ({
  extractUseCase: vi.fn(async (car: Car) => {
    if (holder.failOnId && car.id === holder.failOnId) throw new Error("Gemini 500");
    return `desc ${car.id}`;
  }),
  embedDocument: vi.fn(async () => new Array(768).fill(0.1)),
}));

import { makeFakeSupabase } from "../fixtures/fake-supabase";
import { advanceSync } from "@/lib/sync";
import { countSearchable } from "@/lib/ingest";

function car(id: string): Car {
  return {
    id,
    make: "Make",
    model: id,
    year: 2020,
    mileage: 10000,
    price: 20000,
    bodyType: "Sedan",
    specs: {},
    imageUrl: "https://example.com/x.jpg",
    detailUrl: `https://dealer.example.com/cars/${id}`,
  };
}

beforeEach(() => {
  holder.fake = makeFakeSupabase();
  holder.failOnId = null;
});

describe("sync failure handling", () => {
  it("marks the job failed with a clear error when the dealer API is unreachable", async () => {
    globalThis.fetch = vi.fn(async () => new Response("nope", { status: 401 })) as unknown as typeof fetch;
    const job = await advanceSync({ dealerId: "d1", apiUrl: "http://x/api/cars", token: "bad" });
    expect(job.status).toBe("failed");
    expect(job.error).toBeTruthy();
    expect(await countSearchable("d1")).toBe(0); // no KB rows written
  });

  it("leaves no partial rows when enrichment fails mid-batch", async () => {
    globalThis.fetch = vi.fn(async () =>
      new Response(JSON.stringify({ dealerId: "d1", cars: [car("c1"), car("c2"), car("c3")] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    ) as unknown as typeof fetch;
    holder.failOnId = "c2"; // enrichment of the 2nd car throws

    const job = await advanceSync({ dealerId: "d1", apiUrl: "http://x/api/cars", token: "secret" });
    expect(job.status).toBe("failed");
    expect(await countSearchable("d1")).toBe(0); // batch upsert never ran → no partials
  });
});
