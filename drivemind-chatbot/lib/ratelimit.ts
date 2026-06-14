/**
 * In-memory fixed-window rate limiter (Constitution IV: per token/IP limiting).
 * Keeps the demo at $0 (no external store). Note: in-memory state is per
 * serverless instance — adequate for a demo; production would use a shared store.
 */
const WINDOW_MS = 60_000; // 1 minute

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * @param key   stable identifier (e.g. session token or client IP)
 * @param limit max requests allowed within the window
 */
export function checkRateLimit(key: string, limit: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  existing.count += 1;
  const allowed = existing.count <= limit;
  return { allowed, remaining: Math.max(0, limit - existing.count), resetAt: existing.resetAt };
}

/** Test helper: clear all buckets. */
export function __resetRateLimit(): void {
  buckets.clear();
}
