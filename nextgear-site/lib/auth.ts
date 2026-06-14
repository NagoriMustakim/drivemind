/**
 * Bearer-token check for the protected dealer inventory API (Constitution IV,
 * critical path a). Compares the Authorization header against the server-side
 * DEALER_API_TOKEN. Server-only.
 */
import "server-only";
import { env } from "./env";

/** True if the request carries the correct "Authorization: Bearer <token>". */
export function isAuthorized(authorizationHeader: string | null): boolean {
  if (!authorizationHeader?.startsWith("Bearer ")) return false;
  const provided = authorizationHeader.slice("Bearer ".length).trim();
  const expected = env.dealerApiToken;
  // Length check first; constant-ish comparison to avoid trivial early-exit leaks.
  if (!provided || provided.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
