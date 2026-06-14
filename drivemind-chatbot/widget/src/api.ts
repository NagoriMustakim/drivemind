/**
 * Widget network layer: session bootstrap + SSE streaming query.
 * No secrets here — only the public dealerId and a short-lived session token.
 */
export interface RecommendedCard {
  id: string;
  why: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  bodyType: string;
  imageUrl: string;
  detailUrl: string;
}

export interface QueryResult {
  response: string;
  cars: RecommendedCard[];
  suggestedAnswers: string[];
}

export async function createSession(apiBase: string, dealerId: string): Promise<string> {
  const res = await fetch(`${apiBase}/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dealerId }),
  });
  if (!res.ok) throw new Error(`session failed (${res.status})`);
  const data = (await res.json()) as { token: string };
  return data.token;
}

import { readSSE } from "./sse";

/** Pipeline stages the server narrates while it works. */
export type Stage = "searching" | "matching" | "composing";

export interface StreamHandlers {
  onDelta: (text: string) => void;
  onResult: (result: QueryResult) => void;
  onError: (message: string) => void;
  /** Live progress stage (with candidate count at "matching"). */
  onStatus?: (stage: Stage, count?: number) => void;
}

/** POST /query and consume the SSE stream (fetch + ReadableStream reader). */
export async function streamQuery(
  apiBase: string,
  token: string,
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  handlers: StreamHandlers,
): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${apiBase}/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message, history }),
    });
  } catch {
    handlers.onError("Sorry, I couldn't reach the service. Please try again.");
    return;
  }

  if (!res.ok || !res.body) {
    handlers.onError(
      res.status === 503
        ? "The assistant is waking up. Please try again in a moment."
        : "Something went wrong. Please try again.",
    );
    return;
  }

  await readSSE(res.body, (event, data) => {
    if (event === "delta") handlers.onDelta((data as { text: string }).text);
    else if (event === "result") handlers.onResult(data as QueryResult);
    else if (event === "status")
      handlers.onStatus?.((data as { stage: Stage }).stage, (data as { count?: number }).count);
    else if (event === "error") handlers.onError((data as { message: string }).message);
  });
}
