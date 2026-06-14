/**
 * Anti-hallucination guard (Constitution III + IV, spec FR-004/SC-003).
 * Every recommended car id MUST exist in the candidate set retrieved from the
 * dealer's KB before it reaches the user. Unknown/fabricated ids are dropped.
 * Also enforces the <=5 cap and the no-match honesty path.
 */
import { MAX_RECOMMENDED_CARS, type AssistantResult } from "./contract";

/**
 * Filter the model's recommended cars to those that actually exist (by id) in
 * the retrieved candidate set, preserving the model's ordering, capped at 5.
 */
export function sanitizeResult(
  result: AssistantResult,
  validIds: Set<string>,
): AssistantResult {
  const seen = new Set<string>();
  const cars = result.cars
    .filter((c) => validIds.has(c.id) && !seen.has(c.id) && seen.add(c.id))
    .slice(0, MAX_RECOMMENDED_CARS);

  return {
    response: result.response,
    cars,
    suggestedAnswers: result.suggestedAnswers.slice(0, 4),
  };
}

/** True if a fabricated id was proposed (useful for tests/telemetry). */
export function hadHallucination(result: AssistantResult, validIds: Set<string>): boolean {
  return result.cars.some((c) => !validIds.has(c.id));
}
