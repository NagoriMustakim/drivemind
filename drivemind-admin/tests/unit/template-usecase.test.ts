/**
 * The zero-LLM templated use_case fallback (free-tier path). Produces sensible,
 * embeddable descriptions from car fields without calling Gemini generate_content.
 */
import { describe, it, expect } from "vitest";
import { templateUseCase } from "@/lib/gemini";
import type { Car } from "@/lib/contract";

function car(overrides: Partial<Car> = {}): Car {
  return {
    id: "c1",
    make: "Toyota",
    model: "Sienna",
    year: 2021,
    mileage: 26900,
    price: 36900,
    bodyType: "Van",
    specs: { seats: 8, fuelType: "Hybrid", drivetrain: "AWD" },
    imageUrl: "https://example.com/x.jpg",
    detailUrl: "https://dealer.example.com/cars/c1",
    ...overrides,
  };
}

describe("templateUseCase", () => {
  it("includes make/model/year and a body-type use hint", () => {
    const text = templateUseCase(car());
    expect(text).toContain("2021 Toyota Sienna");
    expect(text.toLowerCase()).toContain("families");
  });

  it("adds fuel + seating + drivetrain hints when present", () => {
    const text = templateUseCase(car());
    expect(text.toLowerCase()).toContain("fuel economy"); // hybrid hint
    expect(text).toContain("Seats 8");
    expect(text).toMatch(/AWD/);
  });

  it("flags budget-friendly cars", () => {
    const text = templateUseCase(car({ price: 15000, bodyType: "Hatchback", specs: {} }));
    expect(text.toLowerCase()).toContain("budget-friendly");
  });
});
