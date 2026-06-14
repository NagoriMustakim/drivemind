/**
 * POST /api/sync — start or continue a batched, resumable sync (T042/T044a).
 * Body: { dealerId, apiUrl, token, jobId? }. Processes ONE batch per call and
 * returns the job state; the client keeps calling with jobId until completed.
 */
import { NextRequest, NextResponse } from "next/server";
import { advanceSync } from "@/lib/sync";

export const runtime = "nodejs";
export const maxDuration = 60; // batch sizing keeps us within this

interface SyncBody {
  dealerId?: unknown;
  apiUrl?: unknown;
  token?: unknown;
  jobId?: unknown;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: SyncBody;
  try {
    body = (await req.json()) as SyncBody;
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  // Validate credentials BEFORE any KB mutation (FR-024).
  if (typeof body.dealerId !== "string" || !body.dealerId) {
    return NextResponse.json({ error: "dealerId required" }, { status: 400 });
  }
  if (typeof body.apiUrl !== "string" || !body.apiUrl) {
    return NextResponse.json({ error: "apiUrl required" }, { status: 400 });
  }
  if (typeof body.token !== "string" || !body.token) {
    return NextResponse.json({ error: "token required" }, { status: 400 });
  }
  const jobId = typeof body.jobId === "string" ? body.jobId : undefined;

  const job = await advanceSync({
    dealerId: body.dealerId,
    apiUrl: body.apiUrl,
    token: body.token,
    jobId,
  });

  // The job DTO carries status/error; failures surface as status:"failed".
  return NextResponse.json(job);
}
