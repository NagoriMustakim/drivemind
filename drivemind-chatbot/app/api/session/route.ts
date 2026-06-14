/**
 * POST /session — issue a short-lived session JWT (Constitution IV, T031).
 * Validates Origin/Referer against the dealer's registered_domain, locks CORS
 * to that domain, and rate-limits per client IP. Critical path (a): token/origin.
 */
import { NextRequest, NextResponse } from "next/server";
import { getDealer, originAllowed } from "@/lib/dealers";
import { issueSessionToken } from "@/lib/jwt";
import { checkRateLimit } from "@/lib/ratelimit";
import { corsHeaders } from "@/lib/cors";

export const runtime = "nodejs";

const SESSION_RATE_LIMIT = 20; // per IP per minute

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  // Preflight — echo the request Origin only if it is a registered dealer domain
  // is validated on the actual POST; here we allow the handshake to proceed.
  const origin = req.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");

  const rate = checkRateLimit(`session:${clientIp(req)}`, SESSION_RATE_LIMIT);
  if (!rate.allowed) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let dealerId: string;
  try {
    const body = (await req.json()) as { dealerId?: unknown };
    if (typeof body.dealerId !== "string" || !body.dealerId) {
      return NextResponse.json({ error: "dealerId required" }, { status: 400 });
    }
    dealerId = body.dealerId;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const dealer = await getDealer(dealerId);
  if (!dealer) {
    return NextResponse.json({ error: "unknown dealer" }, { status: 404 });
  }

  if (!originAllowed(origin, referer, dealer.registered_domain)) {
    return NextResponse.json({ error: "origin not allowed" }, { status: 403 });
  }

  const { token, expiresIn } = await issueSessionToken(dealerId);
  return NextResponse.json(
    { token, expiresIn },
    { headers: corsHeaders(origin) },
  );
}
