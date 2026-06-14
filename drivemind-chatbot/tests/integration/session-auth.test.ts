/**
 * Critical path (a): token/origin validation (Constitution III/IV, tasks T020).
 * Pure-logic coverage of origin matching, JWT issue/verify, and rate limiting.
 * (The full HTTP route is exercised by these building blocks.)
 */
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  process.env.JWT_SECRET = process.env.JWT_SECRET ?? "test-secret-please-change";
});

describe("originAllowed", () => {
  it("accepts a matching Origin host", async () => {
    const { originAllowed } = await import("@/lib/dealers");
    expect(originAllowed("https://nextgear.example.com", null, "https://nextgear.example.com")).toBe(true);
  });

  it("falls back to Referer when Origin is absent", async () => {
    const { originAllowed } = await import("@/lib/dealers");
    expect(originAllowed(null, "https://nextgear.example.com/cars/1", "https://nextgear.example.com")).toBe(true);
  });

  it("rejects a mismatched domain", async () => {
    const { originAllowed } = await import("@/lib/dealers");
    expect(originAllowed("https://evil.example.com", null, "https://nextgear.example.com")).toBe(false);
  });

  it("rejects when neither Origin nor Referer is present", async () => {
    const { originAllowed } = await import("@/lib/dealers");
    expect(originAllowed(null, null, "https://nextgear.example.com")).toBe(false);
  });
});

describe("session JWT", () => {
  it("round-trips a valid token", async () => {
    const { issueSessionToken, verifySessionToken } = await import("@/lib/jwt");
    const { token } = await issueSessionToken("nextgear");
    const claims = await verifySessionToken(token);
    expect(claims?.dealerId).toBe("nextgear");
  });

  it("rejects a tampered/garbage token", async () => {
    const { verifySessionToken } = await import("@/lib/jwt");
    expect(await verifySessionToken("not.a.jwt")).toBeNull();
  });
});

describe("rate limiting", () => {
  it("allows up to the limit then blocks", async () => {
    const { checkRateLimit, __resetRateLimit } = await import("@/lib/ratelimit");
    __resetRateLimit();
    const key = "test-key";
    for (let i = 0; i < 3; i++) expect(checkRateLimit(key, 3).allowed).toBe(true);
    expect(checkRateLimit(key, 3).allowed).toBe(false);
  });
});
