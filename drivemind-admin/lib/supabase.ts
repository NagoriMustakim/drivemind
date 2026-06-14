/**
 * Chatbot-KB Supabase client for drivemind-admin (WRITE side). Server-only,
 * service-role key (Constitution Principle II). Wraps calls with withRetry to
 * absorb Supabase idle-pause cold starts (Principle VII).
 */
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";
import { withRetry } from "./retry";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

/** Run a Supabase call with backoff/retry (handles paused-DB cold starts). */
export function withWake<T>(fn: () => Promise<T>): Promise<T> {
  return withRetry(fn, { retries: 3, baseDelayMs: 600 });
}
