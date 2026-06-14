/**
 * GET /api/ingested?dealerId=... — list cars currently searchable for a dealer
 * (powers the admin "what has been ingested" view, T044).
 */
import { NextRequest, NextResponse } from "next/server";
import { listIngested } from "@/lib/ingest";

export const runtime = "nodejs";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const dealerId = req.nextUrl.searchParams.get("dealerId");
  if (!dealerId) {
    return NextResponse.json({ error: "dealerId required" }, { status: 400 });
  }
  try {
    const cars = await listIngested(dealerId);
    return NextResponse.json({ dealerId, cars });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
