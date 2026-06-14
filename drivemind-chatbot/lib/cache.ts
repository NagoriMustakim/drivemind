/**
 * Tiny in-memory TTL cache for repeated-query responses (Constitution VI).
 * Keyed per dealer + normalized message. Demo-scale only (per-instance memory).
 */
interface Entry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, Entry<unknown>>();
const TTL_MS = 5 * 60_000; // 5 minutes

export function cacheGet<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function cacheSet<T>(key: string, value: T): void {
  store.set(key, { value, expiresAt: Date.now() + TTL_MS });
}

export function queryCacheKey(dealerId: string, message: string): string {
  return `${dealerId}:${message.trim().toLowerCase().replace(/\s+/g, " ")}`;
}
