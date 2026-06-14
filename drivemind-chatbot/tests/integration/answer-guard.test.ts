/**
 * Critical path (d): structured-JSON parse + anti-hallucination (tasks T022).
 * Invalid model JSON is rejected; fabricated car ids are dropped before the
 * response; the <=5 cap and de-dup hold.
 */
import { describe, it, expect } from "vitest";
import { parseAssistantResult } from "@/lib/answer";
import { sanitizeResult, hadHallucination } from "@/lib/guard";
import type { AssistantResult } from "@/lib/contract";

describe("parseAssistantResult", () => {
  it("accepts a well-formed structured result", () => {
    const parsed = parseAssistantResult({
      response: "Here are two great options.",
      cars: [{ id: "a", why: "Reliable and roomy" }],
      suggestedAnswers: ["Show me cheaper options"],
    });
    expect(parsed.response).toContain("great options");
    expect(parsed.cars).toHaveLength(1);
  });

  it("throws on non-object output", () => {
    expect(() => parseAssistantResult("nope")).toThrow();
  });

  it("throws when response is missing", () => {
    expect(() => parseAssistantResult({ cars: [], suggestedAnswers: [] })).toThrow();
  });

  it("drops malformed car entries", () => {
    const parsed = parseAssistantResult({
      response: "ok",
      cars: [{ id: "a", why: "good" }, { id: 123 }, { why: "no id" }],
      suggestedAnswers: [],
    });
    expect(parsed.cars).toEqual([{ id: "a", why: "good" }]);
  });
});

describe("sanitizeResult (anti-hallucination)", () => {
  const validIds = new Set(["real-1", "real-2", "real-3"]);

  it("drops car ids that do not exist in the retrieved set", () => {
    const result: AssistantResult = {
      response: "Try these.",
      cars: [
        { id: "real-1", why: "fits budget" },
        { id: "FABRICATED", why: "made up" },
        { id: "real-2", why: "great mpg" },
      ],
      suggestedAnswers: [],
    };
    const safe = sanitizeResult(result, validIds);
    expect(safe.cars.map((c) => c.id)).toEqual(["real-1", "real-2"]);
    expect(hadHallucination(result, validIds)).toBe(true);
  });

  it("caps recommendations at 5 and de-dupes", () => {
    const cars = ["real-1", "real-1", "real-2", "real-3", "real-1", "real-2", "real-3"].map((id) => ({
      id,
      why: "x",
    }));
    const safe = sanitizeResult({ response: "r", cars, suggestedAnswers: [] }, validIds);
    expect(safe.cars.length).toBeLessThanOrEqual(5);
    expect(new Set(safe.cars.map((c) => c.id)).size).toBe(safe.cars.length); // unique
  });

  it("returns zero cars when the model recommends only fabricated ids", () => {
    const result: AssistantResult = {
      response: "Nothing in stock matches.",
      cars: [{ id: "ghost", why: "not real" }],
      suggestedAnswers: ["Increase budget?"],
    };
    expect(sanitizeResult(result, validIds).cars).toHaveLength(0);
  });
});
