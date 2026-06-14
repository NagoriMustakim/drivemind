/**
 * GET /api/sync/[jobId] — sync progress + searchable count (T043).
 */
import { NextRequest, NextResponse } from "next/server";
import { getJob, toDto } from "@/lib/sync";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
): Promise<NextResponse> {
  const { jobId } = await params;
  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "unknown job" }, { status: 404 });
  }
  return NextResponse.json(toDto(job));
}
