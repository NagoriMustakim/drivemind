/**
 * Server-only environment access for drivemind-admin.
 * NEVER import from client components (Constitution Principle II).
 */
import "server-only";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  /** Chatbot KB Supabase project URL (admin writes here). */
  get supabaseUrl(): string {
    return required("SUPABASE_URL");
  },
  /** Chatbot KB Supabase service-role key (server-side only). */
  get supabaseServiceKey(): string {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  /** Gemini API key (free tier) for use_case extraction + document embeddings. */
  get geminiApiKey(): string {
    return required("GEMINI_API_KEY");
  },
  /** Model for the plain-language use_case extraction (override per your key's quota). */
  get geminiExtractModel(): string {
    return process.env.GEMINI_EXTRACT_MODEL ?? "gemini-2.0-flash";
  },
  /** Embedding model (768-dim documents). */
  get geminiEmbedModel(): string {
    return process.env.GEMINI_EMBED_MODEL ?? "gemini-embedding-001";
  },
  /**
   * use_case strategy: "llm" (default — Gemini, auto-falls back to a template on
   * quota errors) or "template" (force the zero-LLM templated description, the
   * fastest fully-free path that avoids generate_content entirely).
   */
  get geminiExtraction(): "llm" | "template" {
    return process.env.GEMINI_EXTRACTION === "template" ? "template" : "llm";
  },
} as const;
