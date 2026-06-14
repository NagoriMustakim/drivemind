// DriveMind shared data contract — SINGLE SOURCE OF TRUTH.
//
// This file is authored once here and MIRRORED VERBATIM into each repo's
// `lib/contract.ts` (nextgear-site, drivemind-admin, drivemind-chatbot).
// Any change MUST be applied to all three repos in the SAME change set
// (Constitution Principle I — non-negotiable). CI diffs the copies and fails
// on drift. No app may import another app's internals; only these types cross
// the HTTP boundary.

/** Public dealer identifier (tenant scope). Safe to expose to the widget. */
export type DealerId = string;

/** Allowed body types. Keep in sync across all three apps. */
export type BodyType =
  | "SUV"
  | "Sedan"
  | "Coupe"
  | "Truck"
  | "Convertible"
  | "Hatchback"
  | "Van"
  | "Wagon";

/**
 * Customer-facing car. ONLY these fields ever cross an app boundary.
 * Internal/non-customer fields (cost, lead data, etc.) MUST NOT be added here.
 */
export interface Car {
  /** Stable per-car id from the dealer site (used as source_car_id downstream). */
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  /** Price in whole USD. */
  price: number;
  bodyType: BodyType;
  /** Customer-facing specs only (transmission, drivetrain, fuel, seats, color, ...). */
  specs: Record<string, string | number | boolean>;
  imageUrl: string;
  /** Absolute URL to this car's detail page on the dealer website. */
  detailUrl: string;
}

/** Response shape of the dealer site's protected GET /api/cars. */
export interface CarsResponse {
  dealerId: DealerId;
  cars: Car[];
}

/** One recommended car as returned by the assistant — references a car by id, never by echoing data. */
export interface RecommendedCar {
  /** Must equal an existing Car.id in the dealer's knowledge base. */
  id: string;
  /** One-line reason this car fits the request. */
  why: string;
}

/**
 * Schema-constrained structured output the answer model MUST return.
 * Rendered into car cards + chips; never shown as raw text.
 */
export interface AssistantResult {
  /** Short, friendly natural-language reply. */
  response: string;
  /** Up to 5 recommended cars, by id. */
  cars: RecommendedCar[];
  /** Tappable follow-up suggestion chips. */
  suggestedAnswers: string[];
}

/** Hard upper bound on recommended cars per reply (Constitution IV / spec). */
export const MAX_RECOMMENDED_CARS = 5;

/** Embedding dimensionality (Gemini gemini-embedding-001, 768 dims). */
export const EMBEDDING_DIMS = 768;
