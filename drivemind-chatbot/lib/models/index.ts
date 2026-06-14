/**
 * Single config flag for the answer model (Constitution IV). Claude is the
 * default; Gemini/OpenAI are swappable behind this one interface via the
 * ANSWER_MODEL env var. Only the selected provider is invoked per request.
 */
import "server-only";
import { env } from "../env";
import { answerWithClaude, type AnswerInput } from "../answer";
import type { AssistantResult } from "../contract";

export type { AnswerInput };

export async function generateAnswer(input: AnswerInput): Promise<AssistantResult> {
  switch (env.answerModel) {
    case "claude":
      return answerWithClaude(input);
    case "gemini":
    case "openai":
      // Intentionally not implemented for the demo. The interface is here so a
      // swap is a one-line change; Claude is the constitution's required answer model.
      throw new Error(
        `ANSWER_MODEL="${env.answerModel}" is not implemented in this demo (Claude is the default).`,
      );
    default:
      return answerWithClaude(input);
  }
}
