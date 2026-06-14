/**
 * Presentation-layer content for the marketing site: a demo-inventory fallback
 * (so pages always look full even before the dealer DB is seeded) plus static
 * editorial content (brands, testimonials, news, stats).
 *
 * NOTE: the protected GET /api/cars feed and Otto recommendations ALWAYS use the
 * real database (lib/cars.ts). This fallback is for *display only* and is never
 * exposed across an app boundary.
 */
import "server-only";
import { getAvailableCars, getCarById, type DbCar } from "./cars";

export type DisplayCar = DbCar;

const IMG = "?auto=format&fit=crop&w=1200&q=70";
const u = (id: string) => `https://images.unsplash.com/${id}${IMG}`;

/** Hand-picked demo inventory used when the live DB is empty/unreachable. */
export const DEMO_CARS: DisplayCar[] = [
  {
    id: "demo-r8",
    make: "Audi",
    model: "R8 V10 Performance",
    year: 2022,
    mileage: 8200,
    price: 124950,
    body_type: "Coupe",
    image_url: u("photo-1503376780353-7e6692767b70"),
    status: "available",
    created_at: "2026-06-01T00:00:00Z",
    specs: {
      transmission: "S tronic",
      drivetrain: "quattro AWD",
      fuelType: "Petrol",
      engine: "5.2L V10",
      seats: 2,
      doors: 2,
      exteriorColor: "Daytona Grey",
      interiorColor: "Black Nappa",
      mpg: 21,
      features: ["Carbon Ceramic Brakes", "B&O Sound", "Sport Exhaust", "Magnetic Ride"],
    },
  },
  {
    id: "demo-gtr",
    make: "Nissan",
    model: "GT-R Nismo",
    year: 2021,
    mileage: 12400,
    price: 96995,
    body_type: "Coupe",
    image_url: u("photo-1552519507-da3b142c6e3d"),
    status: "available",
    created_at: "2026-05-28T00:00:00Z",
    specs: {
      transmission: "Dual-Clutch",
      drivetrain: "AWD",
      fuelType: "Petrol",
      engine: "3.8L Twin-Turbo V6",
      seats: 4,
      doors: 2,
      exteriorColor: "Pearl White",
      interiorColor: "Red/Black",
      mpg: 20,
      features: ["Launch Control", "Recaro Seats", "Titanium Exhaust", "Carbon Roof"],
    },
  },
  {
    id: "demo-rangerover",
    make: "Land Rover",
    model: "Range Rover Autobiography",
    year: 2023,
    mileage: 15600,
    price: 109900,
    body_type: "SUV",
    image_url: u("photo-1606016159991-dfe04f2f2e8b"),
    status: "available",
    created_at: "2026-05-20T00:00:00Z",
    specs: {
      transmission: "Automatic",
      drivetrain: "4WD",
      fuelType: "Diesel",
      engine: "3.0L I6 MHEV",
      seats: 5,
      doors: 5,
      exteriorColor: "Santorini Black",
      interiorColor: "Ivory",
      mpg: 35,
      features: ["Meridian Sound", "Panoramic Roof", "Massage Seats", "Air Suspension"],
    },
  },
  {
    id: "demo-911",
    make: "Porsche",
    model: "911 Carrera S",
    year: 2022,
    mileage: 9800,
    price: 112500,
    body_type: "Coupe",
    image_url: u("photo-1614200187524-dc4b892acf16"),
    status: "available",
    created_at: "2026-05-18T00:00:00Z",
    specs: {
      transmission: "PDK",
      drivetrain: "RWD",
      fuelType: "Petrol",
      engine: "3.0L Twin-Turbo Flat-6",
      seats: 4,
      doors: 2,
      exteriorColor: "GT Silver",
      interiorColor: "Bordeaux Red",
      mpg: 28,
      features: ["Sport Chrono", "PASM", "Bose Surround", "Sports Exhaust"],
    },
  },
  {
    id: "demo-amg",
    make: "Mercedes-Benz",
    model: "C 63 S AMG",
    year: 2021,
    mileage: 18900,
    price: 64995,
    body_type: "Sedan",
    image_url: u("photo-1618843479313-40f8afb4b4d8"),
    status: "available",
    created_at: "2026-05-15T00:00:00Z",
    specs: {
      transmission: "AMG Speedshift",
      drivetrain: "RWD",
      fuelType: "Petrol",
      engine: "4.0L Biturbo V8",
      seats: 5,
      doors: 4,
      exteriorColor: "Obsidian Black",
      interiorColor: "Black Nappa",
      mpg: 25,
      features: ["AMG Track Pace", "Burmester Sound", "Heated Seats", "Head-Up Display"],
    },
  },
  {
    id: "demo-m4",
    make: "BMW",
    model: "M4 Competition",
    year: 2023,
    mileage: 6400,
    price: 78950,
    body_type: "Coupe",
    image_url: u("photo-1555215695-3004980ad54e"),
    status: "available",
    created_at: "2026-05-10T00:00:00Z",
    specs: {
      transmission: "M Steptronic",
      drivetrain: "RWD",
      fuelType: "Petrol",
      engine: "3.0L Twin-Turbo I6",
      seats: 4,
      doors: 2,
      exteriorColor: "São Paulo Yellow",
      interiorColor: "Black/Yellow",
      mpg: 28,
      features: ["M Carbon Bucket Seats", "Harman Kardon", "Laser Lights", "M Drive Pro"],
    },
  },
  {
    id: "demo-defender",
    make: "Land Rover",
    model: "Defender 110 X",
    year: 2022,
    mileage: 21300,
    price: 82500,
    body_type: "SUV",
    image_url: u("photo-1612544448445-b8232cff3b6c"),
    status: "available",
    created_at: "2026-05-05T00:00:00Z",
    specs: {
      transmission: "Automatic",
      drivetrain: "4WD",
      fuelType: "Diesel",
      engine: "3.0L I6 MHEV",
      seats: 5,
      doors: 5,
      exteriorColor: "Gondwana Stone",
      interiorColor: "Ebony",
      mpg: 32,
      features: ["Terrain Response 2", "Meridian Sound", "Air Suspension", "Tow Pack"],
    },
  },
  {
    id: "demo-continental",
    make: "Bentley",
    model: "Continental GT W12",
    year: 2021,
    mileage: 14200,
    price: 159995,
    body_type: "Coupe",
    image_url: u("photo-1592198084033-aade902d1aae"),
    status: "available",
    created_at: "2026-04-30T00:00:00Z",
    specs: {
      transmission: "Dual-Clutch",
      drivetrain: "AWD",
      fuelType: "Petrol",
      engine: "6.0L Twin-Turbo W12",
      seats: 4,
      doors: 2,
      exteriorColor: "Glacier White",
      interiorColor: "Cumbrian Green",
      mpg: 20,
      features: ["Rotating Display", "Naim Audio", "Diamond Quilting", "Mulliner Spec"],
    },
  },
  {
    id: "demo-taycan",
    make: "Porsche",
    model: "Taycan 4S",
    year: 2023,
    mileage: 7700,
    price: 94900,
    body_type: "Sedan",
    image_url: u("photo-1619767886558-efdc259cde1a"),
    status: "available",
    created_at: "2026-04-25T00:00:00Z",
    specs: {
      transmission: "2-Speed Auto",
      drivetrain: "AWD",
      fuelType: "Electric",
      engine: "Dual Motor",
      seats: 4,
      doors: 4,
      exteriorColor: "Frozen Blue",
      interiorColor: "Slate Grey",
      rangeMiles: 287,
      features: ["Performance Battery+", "Adaptive Air Suspension", "BOSE", "Sport Chrono"],
    },
  },
];

export interface Brand {
  name: string;
  count: number;
}

export const BRANDS: string[] = [
  "Audi",
  "BMW",
  "Mercedes-Benz",
  "Porsche",
  "Land Rover",
  "Bentley",
  "Lamborghini",
  "Ferrari",
  "Aston Martin",
  "McLaren",
  "Maserati",
  "Jaguar",
];

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export const STATS: Stat[] = [
  { value: 2400, suffix: "+", label: "Cars delivered" },
  { value: 18, suffix: " yrs", label: "In the business" },
  { value: 4, suffix: ".9★", label: "Average rating" },
  { value: 98, suffix: "%", label: "Would recommend" },
];

export interface Testimonial {
  quote: string;
  name: string;
  car: string;
  initials: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "From first enquiry to handover the whole thing felt effortless. Otto shortlisted three cars overnight and the one I bought was exactly right.",
    name: "James Whitlock",
    car: "Porsche 911 Carrera S",
    initials: "JW",
  },
  {
    quote:
      "The car was even better in person than the photos — and that never happens. Genuinely the most relaxed car purchase I've ever made.",
    name: "Priya Anand",
    car: "Range Rover Autobiography",
    initials: "PA",
  },
  {
    quote:
      "Part-exchanged my old estate and drove away in a GT-R the same week. Fair valuation, zero pressure, proper enthusiasts.",
    name: "Marcus Reid",
    car: "Nissan GT-R Nismo",
    initials: "MR",
  },
];

export interface NewsPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readMins: number;
  excerpt: string;
  image: string;
}

export const NEWS: NewsPost[] = [
  {
    slug: "ev-buyers-guide-2026",
    title: "The 2026 Electric Buyer's Guide: Range, Reality & Resale",
    category: "Buying Guide",
    date: "2026-06-02",
    readMins: 7,
    excerpt:
      "Used EV prices have settled and the bargains are real — here's how to separate the keepers from the depreciation traps.",
    image: u("photo-1619767886558-efdc259cde1a"),
  },
  {
    slug: "inside-the-workshop",
    title: "Inside the Workshop: Our 142-Point Inspection",
    category: "Behind the Scenes",
    date: "2026-05-21",
    readMins: 5,
    excerpt:
      "Every car earns its place on the floor. We open the doors on the process that gets it there.",
    image: u("photo-1486262715619-67b85e0b08d3"),
  },
  {
    slug: "modern-classics-appreciating",
    title: "Five Modern Classics Quietly Appreciating Right Now",
    category: "Market Watch",
    date: "2026-05-09",
    readMins: 6,
    excerpt:
      "The cars to buy and hold — the analogue heroes the market hasn't fully woken up to yet.",
    image: u("photo-1469285994282-454ceb49e63c"),
  },
];

export interface Feature {
  title: string;
  body: string;
  icon: "shield" | "spark" | "tag" | "exchange";
}

export const FEATURES: Feature[] = [
  {
    title: "142-Point Inspection",
    body: "Every car is mechanically and cosmetically vetted by our own technicians before it reaches the floor.",
    icon: "shield",
  },
  {
    title: "Otto AI Concierge",
    body: "Describe what you need in plain English and our assistant shortlists the right cars in seconds.",
    icon: "spark",
  },
  {
    title: "Transparent Pricing",
    body: "Market-checked daily. No admin fees, no surprises — the price you see is the price you pay.",
    icon: "tag",
  },
  {
    title: "Fair Part-Exchange",
    body: "Instant, honest valuations on your current car with collection arranged at your door.",
    icon: "exchange",
  },
];

/**
 * Cars for *display*. Tries the live DB first; if it's empty or unreachable
 * (e.g. cold Supabase, not seeded yet), falls back to the curated demo set so
 * the showroom never looks empty.
 */
export async function getDisplayCars(): Promise<{ cars: DisplayCar[]; isDemo: boolean }> {
  try {
    const cars = await getAvailableCars();
    if (cars.length > 0) return { cars, isDemo: false };
  } catch {
    // fall through to demo data
  }
  return { cars: DEMO_CARS, isDemo: true };
}

/** A single car for display — checks the live DB first, then the demo set. */
export async function getDisplayCarById(id: string): Promise<DisplayCar | null> {
  try {
    const car = await getCarById(id);
    if (car) return car;
  } catch {
    // fall through to demo data
  }
  return DEMO_CARS.find((c) => c.id === id) ?? null;
}

/** Other available cars to show as "you may also like", excluding `id`. */
export async function getRelatedCars(id: string, bodyType?: string, limit = 3): Promise<DisplayCar[]> {
  const { cars } = await getDisplayCars();
  const pool = cars.filter((c) => c.id !== id);
  const sameType = pool.filter((c) => c.body_type === bodyType);
  const rest = pool.filter((c) => c.body_type !== bodyType);
  return [...sameType, ...rest].slice(0, limit);
}
