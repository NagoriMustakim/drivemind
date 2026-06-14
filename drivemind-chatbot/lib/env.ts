/**
 * Server-only environment access for drivemind-chatbot.
 * NEVER import from the widget or any client code (Constitution Principle II).
 */
import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export type AnswerModel = "claude" | "gemini" | "openai";

export const env = {
  /** Chatbot KB Supabase project URL (chatbot READS here). */
  get supabaseUrl(): string {
    return required("SUPABASE_URL");
  },
  /** Chatbot KB Supabase service-role key (server-side only). */
  get supabaseServiceKey(): string {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  /** Gemini API key — used only to embed the short user query (RETRIEVAL_QUERY). */
  get geminiApiKey(): string {
    return required("GEMINI_API_KEY");
  },
  /** Anthropic API key — the default answer model (Claude). */
  get anthropicApiKey(): string {
    return required("ANTHROPIC_API_KEY");
  },
  /** Secret used to sign short-lived session JWTs. */
  get jwtSecret(): string {
    return required("JWT_SECRET");
  },
  /** Single config flag selecting the answer model (Constitution IV). Defaults to Claude. */
  get answerModel(): AnswerModel {
    const value = (process.env.ANSWER_MODEL ?? "claude").toLowerCase();
    if (value === "claude" || value === "gemini" || value === "openai") {
      return value;
    }
    throw new Error(`Invalid ANSWER_MODEL: ${value} (expected claude|gemini|openai)`);
  },
  /**
   * Specific Claude model id. Defaults to Haiku 4.5 — for this short, schema-
   * constrained recommendation task it is materially faster than Sonnet at
   * comparable quality, which is the single biggest real-latency lever. Override
   * with ANSWER_MODEL_ID (e.g. "claude-sonnet-4-6") if you want maximum quality.
   */
  get answerModelId(): string {
    return process.env.ANSWER_MODEL_ID || "claude-haiku-4-5-20251001";
  },
} as const;
