/**
 * Server-only environment access for nextgear-site.
 * NEVER import this from client components. All values are secrets or
 * server config (Constitution Principle II — no keys in client bundles).
 */
import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  /** Dealer Supabase project URL. */
  get supabaseUrl(): string {
    return required("SUPABASE_URL");
  },
  /** Dealer Supabase service-role key (server-side only). */
  get supabaseServiceKey(): string {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  /** Bearer token that protects GET /api/cars (the DriveMind platform uses it to sync). */
  get dealerApiToken(): string {
    return required("DEALER_API_TOKEN");
  },
  /** Public base URL of this dealer site, used to build absolute car detail URLs. */
  get siteUrl(): string {
    return process.env.SITE_URL ?? "http://localhost:3000";
  },
  /** This dealer's public id (returned in CarsResponse; tags cars downstream). */
  get dealerId(): string {
    return process.env.DEALER_ID ?? "nextgear";
  },
} as const;
