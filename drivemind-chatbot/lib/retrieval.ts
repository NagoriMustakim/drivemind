/**
 * Retrieval (Constitution VI): embed the short query, then run ONE pgvector
 * statement (the match_cars RPC) that filters by dealer_id + hard constraints
 * and orders by cosine distance, LIMIT <=5. No N+1, no bulk cars to the model.
 */
import "server-only";
import { getSupabase, withWake } from "./supabase";
import { embedQuery } from "./gemini";
import { MAX_RECOMMENDED_CARS, type BodyType, type Car } from "./contract";

/** A retrieved KB car row (customer-facing fields + the ids we need). */
export interface RetrievedCar {
  id: string;
  source_car_id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  body_type: BodyType;
  specs: Record<string, string | number | boolean | string[]>;
  image_url: string | null;
  detail_url: string;
}

const BODY_TYPES: BodyType[] = [
  "SUV",
  "Sedan",
  "Coupe",
  "Truck",
  "Convertible",
  "Hatchback",
  "Van",
  "Wagon",
];

const BODY_SYNONYMS: Record<string, BodyType> = {
  suv: "SUV",
  crossover: "SUV",
  sedan: "Sedan",
  saloon: "Sedan",
  coupe: "Coupe",
  truck: "Truck",
  pickup: "Truck",
  convertible: "Convertible",
  cabriolet: "Convertible",
  hatchback: "Hatchback",
  hatch: "Hatchback",
  van: "Van",
  minivan: "Van",
  wagon: "Wagon",
  estate: "Wagon",
};

export interface ParsedConstraints {
  maxPrice: number | null;
  bodyType: BodyType | null;
}

/** Extract hard constraints (budget, body type) from free-text. Best-effort. */
export function parseConstraints(query: string): ParsedConstraints {
  const q = query.toLowerCase();

  // Budget: "under $25,000", "below 25k", "less than $30000", "$20k".
  let maxPrice: number | null = null;
  const priceMatch = q.match(/(?:under|below|less than|max|up to|<|≤)?\s*\$?\s*(\d{1,3}(?:,\d{3})+|\d+)\s*(k\b)?/);
  // Prefer an explicit "under/below ... k|number" phrase.
  const explicit = q.match(/(?:under|below|less than|max|up to|<)\s*\$?\s*(\d{1,3}(?:,\d{3})+|\d+)\s*(k)?/);
  const chosen = explicit ?? priceMatch;
  const amountText = chosen?.[1];
  if (amountText) {
    const isK = Boolean(chosen?.[2]);
    const digits = Number(amountText.replace(/,/g, ""));
    if (!Number.isNaN(digits)) {
      maxPrice = isK ? digits * 1000 : digits < 1000 ? digits * 1000 : digits;
    }
  }

  // Body type: match a known type or synonym.
  let bodyType: BodyType | null = null;
  for (const [word, type] of Object.entries(BODY_SYNONYMS)) {
    if (new RegExp(`\\b${word}\\b`).test(q)) {
      bodyType = type;
      break;
    }
  }
  if (!bodyType) {
    bodyType = BODY_TYPES.find((t) => q.includes(t.toLowerCase())) ?? null;
  }

  return { maxPrice, bodyType };
}

/** Map a retrieved KB row to the customer-facing contract Car (by id). */
export function toContractCar(row: RetrievedCar): Car {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year,
    mileage: row.mileage,
    price: row.price,
    bodyType: row.body_type,
    specs: row.specs as Car["specs"],
    imageUrl: row.image_url ?? "",
    detailUrl: row.detail_url,
  };
}

/**
 * Retrieve up to MAX_RECOMMENDED_CARS candidate cars for a dealer + query.
 * This is the ONLY place cars are read for a query.
 */
export async function retrieveCars(dealerId: string, query: string): Promise<RetrievedCar[]> {
  const { maxPrice, bodyType } = parseConstraints(query);
  const queryVec = await embedQuery(query);

  const supabase = getSupabase();
  const { data, error } = await withWake(
    async () =>
      await supabase.rpc("match_cars", {
        p_dealer_id: dealerId,
        p_query_vec: queryVec,
        p_max_price: maxPrice,
        p_body_type: bodyType,
        p_limit: MAX_RECOMMENDED_CARS,
      }),
  );
  if (error) throw error;
  return (data ?? []) as RetrievedCar[];
}
