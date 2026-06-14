/**
 * POST /query — the assistant runtime (Constitution IV/V/VI, T032).
 * JWT-gated, rate-limited per token. Embeds only the short query, runs ONE
 * retrieval, sends <=5 cars to Claude, verifies ids, and STREAMS the reply via
 * SSE: friendly text first (progressive), then a final structured result event
 * carrying trusted car display data for the cards.
 */
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/jwt";
import { checkRateLimit } from "@/lib/ratelimit";
import { getDealer, originAllowed } from "@/lib/dealers";
import { corsHeaders } from "@/lib/cors";
import { runQuery } from "@/lib/pipeline";
import { cacheGet, cacheSet, queryCacheKey } from "@/lib/cache";
import type { QueryOutcome } from "@/lib/pipeline";

export const runtime = "nodejs";

const QUERY_RATE_LIMIT = 30; // per token per minute

interface QueryBody {
  message?: unknown;
  history?: unknown;
}

function bearer(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice("Bearer ".length).trim() || null;
}

export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest): Promise<Response> {
  const origin = req.headers.get("origin");

  const token = bearer(req);
  if (!token) return NextResponse.json({ error: "missing token" }, { status: 401 });

  const claims = await verifySessionToken(token);
  if (!claims) return NextResponse.json({ error: "invalid token" }, { status: 401 });

  const rate = checkRateLimit(`query:${token}`, QUERY_RATE_LIMIT);
  if (!rate.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  // Defense in depth: confirm the caller's origin still matches the dealer domain.
  const dealer = await getDealer(claims.dealerId);
  if (!dealer) return NextResponse.json({ error: "unknown dealer" }, { status: 404 });
  if (origin && !originAllowed(origin, req.headers.get("referer"), dealer.registered_domain)) {
    return NextResponse.json({ error: "origin not allowed" }, { status: 403 });
  }

  let message: string;
  let history: { role: "user" | "assistant"; content: string }[] | undefined;
  try {
    const body = (await req.json()) as QueryBody;
    if (typeof body.message !== "string" || !body.message.trim()) {
      return NextResponse.json({ error: "message required" }, { status: 400 });
    }
    message = body.message;
    if (Array.isArray(body.history)) {
      history = body.history
        .filter(
          (h): h is { role: "user" | "assistant"; content: string } =>
            typeof h === "object" &&
            h !== null &&
            (h as { role?: unknown }).role !== undefined &&
            typeof (h as { content?: unknown }).content === "string",
        )
        .slice(-6);
    }
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  // Open the SSE stream IMMEDIATELY and run the pipeline INSIDE it, emitting
  // `status` events as each stage starts. This turns the unavoidable ~few-second
  // retrieval+model wait into a narrated, lively experience instead of a dead
  // "typing…" pause, and lets the first byte reach the client in milliseconds.
  const cacheKey = queryCacheKey(claims.dealerId, message);
  const cached = !history ? cacheGet<QueryOutcome>(cacheKey) : undefined;

  const stream = toSSE(async (emit) => {
    let outcome: QueryOutcome;
    if (cached) {
      // Cache hit: skip straight to composing for snappy feedback.
      emit("status", { stage: "composing", cached: true });
      outcome = cached;
    } else {
      outcome = await runQuery(claims.dealerId, message, history, (stage, count) =>
        emit("status", { stage, count }),
      );
      if (!history) cacheSet(cacheKey, outcome);
    }
    return outcome;
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      ...corsHeaders(origin),
    },
  });
}

type Emit = (event: string, data: unknown) => void;

/**
 * Stream the reply: live `status` stages while the pipeline runs, then
 * progressive text deltas, the structured `result`, and `done`. Failures are
 * surfaced as an `error` event (the 200 stream is already open by then).
 */
function toSSE(compute: (emit: Emit) => Promise<QueryOutcome>): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const send: Emit = (event, data) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      let outcome: QueryOutcome;
      try {
        outcome = await compute(send);
      } catch (err) {
        const detail = err instanceof Error ? err.message : "query failed";
        send("error", {
          // Friendly, user-facing copy; transient KB/provider issues land here.
          message: "Otto's having a quick hiccup reaching the showroom. Please try again in a moment.",
          detail,
        });
        send("done", {});
        controller.close();
        return;
      }

      // Typewriter the final text in small chunks so it appears alive but fast.
      const words = outcome.result.response.split(/(\s+)/).filter((t) => t.length > 0);
      for (let i = 0; i < words.length; i += 2) {
        send("delta", { text: words.slice(i, i + 2).join("") });
        await new Promise((r) => setTimeout(r, 8));
      }

      send("result", {
        response: outcome.result.response,
        cars: outcome.cars.map((car) => ({
          ...car,
          why: outcome.result.cars.find((c) => c.id === car.id)?.why ?? "",
        })),
        suggestedAnswers: outcome.result.suggestedAnswers,
      });
      send("done", {});
      controller.close();
    },
  });
}
