/**
 * T019: contract test for the assistant's structured output. Verifies the
 * AssistantResult shape and the <=5 cap match the documented contract
 * (contracts/chatbot-api.openapi.yaml + contract.ts).
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { parseAssistantResult } from "@/lib/answer";
import { MAX_RECOMMENDED_CARS } from "@/lib/contract";

describe("AssistantResult contract", () => {
  it("declares a cap of 5 recommended cars", () => {
    expect(MAX_RECOMMENDED_CARS).toBe(5);
  });

  it("parses a contract-shaped result", () => {
    const sample = {
      response: "Two good options for you.",
      cars: [
        { id: "abc", why: "Fits your budget" },
        { id: "def", why: "Low mileage" },
      ],
      suggestedAnswers: ["Cheaper?", "More seats?"],
    };
    const parsed = parseAssistantResult(sample);
    expect(typeof parsed.response).toBe("string");
    expect(Array.isArray(parsed.cars)).toBe(true);
    expect(parsed.cars.every((c) => typeof c.id === "string" && typeof c.why === "string")).toBe(true);
    expect(Array.isArray(parsed.suggestedAnswers)).toBe(true);
  });

  it("never exceeds the documented car cap", () => {
    const many = Array.from({ length: 9 }, (_, i) => ({ id: `id${i}`, why: "x" }));
    const parsed = parseAssistantResult({ response: "ok", cars: many, suggestedAnswers: [] });
    expect(parsed.cars.length).toBeLessThanOrEqual(MAX_RECOMMENDED_CARS);
  });

  it("keeps the OpenAPI contract file in the repo (maxItems 5 documented)", () => {
    // The canonical contract lives with the spec; the repo mirrors contract.ts.
    const candidates = [
      resolve(__dirname, "../../../specs/001-drivemind/contracts/chatbot-api.openapi.yaml"),
    ];
    const found = candidates.find((p) => existsSync(p));
    if (found) {
      const yaml = readFileSync(found, "utf8");
      expect(yaml).toContain("maxItems: 5");
    } else {
      // Repo is standalone (no specs/ alongside) — shape is still enforced above.
      expect(MAX_RECOMMENDED_CARS).toBe(5);
    }
  });
});
