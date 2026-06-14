/**
 * Short-lived session JWTs (Constitution IV). Issued by POST /session after
 * Origin/Referer validation; required by POST /query. Signed server-side with
 * jose; the secret never leaves the server.
 */
import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { env } from "./env";

const ISSUER = "drivemind-chatbot";
const TTL_SECONDS = 15 * 60; // 15 minutes

function secretKey(): Uint8Array {
  return new TextEncoder().encode(env.jwtSecret);
}

export interface SessionClaims {
  dealerId: string;
}

export async function issueSessionToken(dealerId: string): Promise<{ token: string; expiresIn: number }> {
  const token = await new SignJWT({ dealerId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${TTL_SECONDS}s`)
    .sign(secretKey());
  return { token, expiresIn: TTL_SECONDS };
}

export async function verifySessionToken(token: string): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(), { issuer: ISSUER });
    if (typeof payload.dealerId !== "string") return null;
    return { dealerId: payload.dealerId };
  } catch {
    return null;
  }
}
