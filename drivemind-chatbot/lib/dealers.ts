/**
 * Dealer registry lookups + Origin/Referer validation for session issuance
 * (Constitution IV). A widget may only get a session for a dealer whose
 * registered_domain matches the request's Origin/Referer.
 */
import "server-only";
import { getSupabase, withWake } from "./supabase";

export interface DealerRecord {
  dealer_id: string;
  registered_domain: string;
}

export async function getDealer(dealerId: string): Promise<DealerRecord | null> {
  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () =>
      await supabase
        .from("dealers")
        .select("dealer_id, registered_domain")
        .eq("dealer_id", dealerId)
        .maybeSingle(),
  );
  if (error) throw error;
  return (data as DealerRecord | null) ?? null;
}

function hostOf(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).host.toLowerCase();
  } catch {
    return null;
  }
}

/**
 * True if the request's Origin (or Referer) host matches the dealer's
 * registered domain host. Localhost is matched leniently for local dev.
 */
export function originAllowed(
  origin: string | null,
  referer: string | null,
  registeredDomain: string,
): boolean {
  const allowed = hostOf(registeredDomain);
  if (!allowed) return false;
  const requestHost = hostOf(origin) ?? hostOf(referer);
  if (!requestHost) return false;
  return requestHost === allowed;
}
