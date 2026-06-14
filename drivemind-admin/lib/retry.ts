/**
 * Exponential backoff + retry. Used to absorb Gemini free-tier rate limits
 * (HTTP 429) and Supabase cold starts after idle-pause (Constitution VII).
 *
 * Retries on transient errors only; re-throws immediately on clearly fatal ones.
 */
export interface RetryOptions {
  retries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  /** Decide whether a given error is worth retrying. */
  shouldRetry?: (error: unknown) => boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function defaultShouldRetry(error: unknown): boolean {
  const status = extractStatus(error);
  // Rate limited, or transient server / connectivity errors (e.g. paused DB waking).
  if (status === 429) return true;
  if (status !== undefined && status >= 500) return true;
  const code = (error as { code?: string } | null)?.code;
  if (code && ["ETIMEDOUT", "ECONNRESET", "ECONNREFUSED", "EAI_AGAIN"].includes(code)) {
    return true;
  }
  return false;
}

function extractStatus(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null) return undefined;
  const e = error as Record<string, unknown>;
  if (typeof e.status === "number") return e.status;
  if (typeof e.statusCode === "number") return e.statusCode;
  const response = e.response as { status?: number } | undefined;
  if (response && typeof response.status === "number") return response.status;
  return undefined;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const retries = options.retries ?? 4;
  const baseDelayMs = options.baseDelayMs ?? 500;
  const maxDelayMs = options.maxDelayMs ?? 8000;
  const shouldRetry = options.shouldRetry ?? defaultShouldRetry;

  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries || !shouldRetry(error)) break;
      // Exponential backoff with jitter.
      const delay = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
      const jitter = delay * 0.25 * Math.random();
      await sleep(delay + jitter);
    }
  }
  throw lastError;
}
