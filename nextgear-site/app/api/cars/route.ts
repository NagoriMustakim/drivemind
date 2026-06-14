/**
 * GET /api/cars — protected inventory feed (T039). Returns ONLY available cars
 * in the shared contract shape, behind a Bearer token. The DriveMind platform
 * (drivemind-admin) calls this during Sync. Customer-facing fields only.
 */
import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { getAvailableCars, toContractCar } from "@/lib/cars";
import { env } from "@/lib/env";
import type { CarsResponse } from "@/lib/contract";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!isAuthorized(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const rows = await getAvailableCars();
    const body: CarsResponse = {
      dealerId: env.dealerId,
      cars: rows.map(toContractCar),
    };
    return NextResponse.json(body);
  } catch {
    // e.g. Supabase idle-pause cold start that exhausted retries.
    return NextResponse.json({ error: "inventory_unavailable" }, { status: 503 });
  }
}
