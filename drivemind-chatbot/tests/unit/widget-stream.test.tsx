/**
 * T051 (light UI): the conversation bubble renders the typing indicator while
 * busy, car cards from the structured result, and suggestion chips.
 */
import { describe, it, expect } from "vitest";
import { renderToString } from "preact-render-to-string";
import { Bubble, type Message } from "../../widget/src/panel";

const noop = () => {};

describe("Bubble", () => {
  it("shows a typing indicator for the in-flight assistant message", () => {
    const msg: Message = { role: "assistant", content: "" };
    const html = renderToString(<Bubble message={msg} busy={true} isLast={true} onChip={noop} />);
    expect(html).toContain("Otto is typing");
  });

  it("renders streamed assistant text", () => {
    const msg: Message = { role: "assistant", content: "Here are two options" };
    const html = renderToString(<Bubble message={msg} busy={false} isLast={true} onChip={noop} />);
    expect(html).toContain("Here are two options");
  });

  it("renders car cards from the result", () => {
    const msg: Message = {
      role: "assistant",
      content: "Try these",
      cars: [
        {
          id: "c1",
          why: "Great value",
          make: "Kia",
          model: "Sportage",
          year: 2022,
          price: 22000,
          mileage: 15000,
          bodyType: "SUV",
          imageUrl: "https://example.com/k.jpg",
          detailUrl: "https://dealer.example.com/cars/c1",
        },
      ],
    };
    const html = renderToString(<Bubble message={msg} busy={false} isLast={true} onChip={noop} />);
    expect(html).toContain("2022 Kia Sportage");
    expect(html).toContain("/cars/c1");
  });

  it("renders suggestion chips when not busy", () => {
    const msg: Message = { role: "assistant", content: "ok", suggestedAnswers: ["Cheaper?", "More seats?"] };
    const html = renderToString(<Bubble message={msg} busy={false} isLast={true} onChip={noop} />);
    expect(html).toContain("Cheaper?");
    expect(html).toContain("More seats?");
  });

  it("hides chips while a response is streaming (busy)", () => {
    const msg: Message = { role: "assistant", content: "thinking", suggestedAnswers: ["X"] };
    const html = renderToString(<Bubble message={msg} busy={true} isLast={true} onChip={noop} />);
    expect(html).not.toContain("otto-chip");
  });
});
