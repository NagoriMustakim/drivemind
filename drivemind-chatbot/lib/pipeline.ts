/**
 * The query pipeline: retrieve (<=5) → answer (Claude, structured) → guard
 * (verify ids exist) → attach TRUSTED display data from the KB (never from the
 * model). Display car data comes from the retrieved rows, so cards can never
 * show fabricated data even if the model misbehaves.
 */
import "server-only";
import { retrieveCars, toContractCar } from "./retrieval";
import { generateAnswer } from "./models";
import { sanitizeResult } from "./guard";
import type { AssistantResult, Car } from "./contract";

export interface QueryOutcome {
  /** Model reply + recommended ids/why + suggestion chips (sanitized). */
  result: AssistantResult;
  /** Trusted, customer-facing car data for the recommended ids, in result order. */
  cars: Car[];
}

/** Pipeline stage, surfaced to the client so the wait feels alive (not a dead spinner). */
export type Stage = "searching" | "matching" | "composing";

/** Optional progress sink. `count` is the number of candidate cars at "matching". */
export type ProgressFn = (stage: Stage, count?: number) => void;

export async function runQuery(
  dealerId: string,
  message: string,
  history?: { role: "user" | "assistant"; content: string }[],
  onProgress?: ProgressFn,
): Promise<QueryOutcome> {
  onProgress?.("searching");
  const retrieved = await retrieveCars(dealerId, message);
  const contractCars = retrieved.map(toContractCar);
  const byId = new Map(contractCars.map((c) => [c.id, c]));
  onProgress?.("matching", contractCars.length);

  onProgress?.("composing");
  const raw = await generateAnswer({ message, history, cars: contractCars });
  const result = sanitizeResult(raw, new Set(byId.keys()));

  // Display data is taken from the trusted KB rows (by id), not from the model.
  const cars = result.cars
    .map((c) => byId.get(c.id))
    .filter((c): c is Car => c !== undefined);

  return { result, cars };
}
