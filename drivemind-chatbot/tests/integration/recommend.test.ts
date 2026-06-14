/**
 * T023: end-to-end pipeline (retrieve → answer → guard) with retrieval + model
 * mocked, so precise and fuzzy queries are covered without live services.
 * Asserts <=5 real cars, trusted display data, and fabricated ids dropped.
 */
import { vi, describe, it, expect, beforeEach } from "vitest";

const { mockRetrieve, mockGenerate } = vi.hoisted(() => ({
  mockRetrieve: vi.fn(),
  mockGenerate: vi.fn(),
}));

vi.mock("@/lib/retrieval", () => ({
  retrieveCars: mockRetrieve,
  toContractCar: (row: Record<string, unknown>) => ({
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    price: row.price,
    bodyType: row.body_type,
    specs: row.specs ?? {},
    imageUrl: row.image_url ?? "",
    detailUrl: row.detail_url,
  }),
}));
vi.mock("@/lib/models", () => ({ generateAnswer: mockGenerate }));

import { runQuery } from "@/lib/pipeline";

function row(id: string, make: string, model: string, price: number, body: string) {
  return {
    id,
    source_car_id: id,
    make,
    model,
    year: 2021,
    mileage: 30000,
    price,
    body_type: body,
    specs: {},
    image_url: "https://example.com/x.jpg",
    detail_url: `https://test.example.com/cars/${id}`,
  };
}

beforeEach(() => {
  mockRetrieve.mockReset();
  mockGenerate.mockReset();
});

describe("runQuery", () => {
  it("precise query returns only real, dealer cars (drops fabricated ids, caps 5)", async () => {
    mockRetrieve.mockResolvedValue([
      row("c1", "Toyota", "RAV4", 24000, "SUV"),
      row("c2", "Kia", "Sportage", 22000, "SUV"),
    ]);
    mockGenerate.mockResolvedValue({
      response: "Here are two SUVs under $25k.",
      cars: [
        { id: "c1", why: "Reliable and roomy" },
        { id: "GHOST", why: "fabricated" },
        { id: "c2", why: "Great value" },
      ],
      suggestedAnswers: ["Show cheaper options"],
    });

    const { result, cars } = await runQuery("test-dealer", "an SUV under $25,000");
    expect(result.cars.map((c) => c.id)).toEqual(["c1", "c2"]); // GHOST dropped
    expect(cars).toHaveLength(2);
    expect(cars.length).toBeLessThanOrEqual(5);
    expect(cars[0]).toMatchObject({ id: "c1", make: "Toyota", detailUrl: expect.stringContaining("/cars/c1") });
  });

  it("fuzzy query returns relevant in-stock cars with reasons", async () => {
    mockRetrieve.mockResolvedValue([row("c3", "Mazda", "MX-5", 26000, "Convertible")]);
    mockGenerate.mockResolvedValue({
      response: "This one is a blast on weekends.",
      cars: [{ id: "c3", why: "Sporty convertible, fun to drive" }],
      suggestedAnswers: ["Something cheaper?", "More power?"],
    });

    const { result, cars } = await runQuery("test-dealer", "a fun weekend car");
    expect(cars).toHaveLength(1);
    expect(result.cars[0]).toMatchObject({ id: "c3", why: expect.stringContaining("fun") });
  });
});
