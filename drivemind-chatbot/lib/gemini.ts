/**
 * Embeds ONLY the short user query at request time (Constitution VI).
 * Uses Gemini gemini-embedding-001 with taskType RETRIEVAL_QUERY and 768 dims
 * to match how documents were embedded at ingestion (RETRIEVAL_DOCUMENT).
 */
import "server-only";
import { GoogleGenAI } from "@google/genai";
import { env } from "./env";
import { withRetry } from "./retry";
import { EMBEDDING_DIMS } from "./contract";

let ai: GoogleGenAI | null = null;

function client(): GoogleGenAI {
  if (!ai) ai = new GoogleGenAI({ apiKey: env.geminiApiKey });
  return ai;
}

export async function embedQuery(text: string): Promise<number[]> {
  const response = await withRetry(() =>
    client().models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: { taskType: "RETRIEVAL_QUERY", outputDimensionality: EMBEDDING_DIMS },
    }),
  );

  const values = response.embeddings?.[0]?.values;
  if (!values || values.length !== EMBEDDING_DIMS) {
    throw new Error(`Embedding failed or wrong dimensionality (expected ${EMBEDDING_DIMS}).`);
  }
  return values;
}
