/**
 * Dealer-DB Supabase client (server-only). Uses the service-role key, so this
 * module must never reach a client bundle (Constitution Principle II).
 *
 * Includes a small wake/retry wrapper: Supabase free projects pause when idle,
 * so the first query after a cold start may transiently fail (Principle VII).
 */
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Run a Supabase call, retrying a few times to absorb idle-pause cold starts.
 * (nextgear-site keeps its own copy — repos share no code; Principle I.)
 */
export async function withWake<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) break;
      await sleep(Math.min(4000, 500 * 2 ** attempt));
    }
  }
  throw lastError;
}
