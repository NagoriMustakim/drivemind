/**
 * Critical path (a): token validation on the dealer inventory API (tasks T036).
 * GET /api/cars requires the correct Bearer token and exposes only
 * customer-facing contract fields. DB access is mocked.
 */
import { vi, describe, it, expect, beforeEach } from "vitest";

const TOKEN = "test-dealer-token";

vi.mock("@/lib/cars", () => ({
  getAvailableCars: vi.fn(async () => [
    {
      id: "row-1",
      make: "Toyota",
      model: "RAV4",
      year: 2021,
      mileage: 20000,
      price: 24000,
      body_type: "SUV",
      specs: { fuelType: "Gasoline" },
      image_url: "https://example.com/x.jpg",
      status: "available",
      created_at: "2026-01-01",
    },
  ]),
  // identity-ish mapping to the contract shape
  toContractCar: (r: Record<string, unknown>) => ({
    id: r.id,
    make: r.make,
    model: r.model,
    year: r.year,
    mileage: r.mileage,
    price: r.price,
    bodyType: r.body_type,
    specs: r.specs,
    imageUrl: r.image_url,
    detailUrl: `https://dealer.example.com/cars/${r.id}`,
  }),
}));

import { GET } from "@/app/api/cars/route";

function req(authorization?: string) {
  const headers = new Headers();
  if (authorization) headers.set("authorization", authorization);
  return { headers } as unknown as Parameters<typeof GET>[0];
}

beforeEach(() => {
  process.env.DEALER_API_TOKEN = TOKEN;
  process.env.DEALER_ID = "nextgear";
});

describe("GET /api/cars auth", () => {
  it("401 without a token", async () => {
    const res = await GET(req());
    expect(res.status).toBe(401);
  });

  it("401 with a wrong token", async () => {
    const res = await GET(req("Bearer wrong"));
    expect(res.status).toBe(401);
  });

  it("200 with the correct token, returning contract-shaped cars", async () => {
    const res = await GET(req(`Bearer ${TOKEN}`));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { dealerId: string; cars: Record<string, unknown>[] };
    expect(body.dealerId).toBe("nextgear");
    expect(body.cars).toHaveLength(1);
    // Only customer-facing fields — never the internal status column.
    expect(body.cars[0]).not.toHaveProperty("status");
    expect(body.cars[0]).toMatchObject({ id: "row-1", bodyType: "SUV" });
  });
});
