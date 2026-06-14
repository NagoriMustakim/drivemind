/**
 * T023a: no-match honesty (FR-006, US1 scenario 3, SC-003). When nothing
 * matches, the reply is honest and contains ZERO cars / zero fabricated ids.
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

beforeEach(() => {
  mockRetrieve.mockReset();
  mockGenerate.mockReset();
});

describe("no-match handling", () => {
  it("returns zero cars when retrieval finds nothing", async () => {
    mockRetrieve.mockResolvedValue([]);
    mockGenerate.mockResolvedValue({
      response: "I couldn't find a match for that. Want to adjust your budget or body type?",
      cars: [],
      suggestedAnswers: ["Raise budget", "Any body type"],
    });

    const { result, cars } = await runQuery("test-dealer", "an electric pickup under $5,000");
    expect(cars).toHaveLength(0);
    expect(result.cars).toHaveLength(0);
    expect(result.response.toLowerCase()).toContain("couldn't find");
  });

  it("drops cars if the model fabricates ids when none were retrieved", async () => {
    mockRetrieve.mockResolvedValue([]);
    mockGenerate.mockResolvedValue({
      response: "Here's something!",
      cars: [{ id: "ghost", why: "made up" }],
      suggestedAnswers: [],
    });

    const { cars, result } = await runQuery("test-dealer", "anything");
    expect(cars).toHaveLength(0);
    expect(result.cars).toHaveLength(0);
  });
});
