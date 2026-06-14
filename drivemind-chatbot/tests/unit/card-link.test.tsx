/**
 * T045: each recommendation card links (by id) to the car's detail page on the
 * dealer site and shows enough summary info to decide to click through.
 */
import { describe, it, expect } from "vitest";
import { renderToString } from "preact-render-to-string";
import { Card, CardList } from "../../widget/src/cards";
import type { RecommendedCard } from "../../widget/src/api";

const car: RecommendedCard = {
  id: "c1",
  why: "Reliable and roomy for families",
  make: "Toyota",
  model: "RAV4",
  year: 2021,
  price: 24000,
  mileage: 20000,
  bodyType: "SUV",
  imageUrl: "https://example.com/rav4.jpg",
  detailUrl: "https://dealer.example.com/cars/c1",
};

describe("Card", () => {
  it("links to the car's detail page", () => {
    const html = renderToString(<Card car={car} />);
    expect(html).toContain('href="https://dealer.example.com/cars/c1"');
  });

  it("shows summary info (title, price, reason)", () => {
    const html = renderToString(<Card car={car} />);
    expect(html).toContain("2021 Toyota RAV4");
    expect(html).toContain("$24,000");
    expect(html).toContain("Reliable and roomy");
  });
});

describe("CardList", () => {
  it("renders one link per recommended car", () => {
    const html = renderToString(<CardList cars={[car, { ...car, id: "c2", detailUrl: "https://dealer.example.com/cars/c2" }]} />);
    expect(html).toContain("/cars/c1");
    expect(html).toContain("/cars/c2");
  });

  it("renders nothing for an empty list", () => {
    expect(renderToString(<CardList cars={[]} />)).toBe("");
  });
});
