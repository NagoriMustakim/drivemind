/**
 * Seed the dealer DB (nextgear-site) with ~50 realistic used cars.
 *
 * Run with the dealer Supabase credentials in the environment, e.g.:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
 * or load a .env file:  node --env-file=.env.local --import tsx scripts/seed.ts
 *
 * This is a standalone Node script (NOT Next runtime), so it builds its own
 * Supabase client from process.env rather than importing lib/ (which is
 * "server-only"). It deletes existing rows then inserts a fresh set, so it is
 * safe to re-run.
 *
 * Images: one accurate photo PER CAR, defined in scripts/car-images.ts (keyed
 * by Make|Model|Year). Fill that file in and re-seed; unfilled cars are listed
 * as a warning so you can complete them step by step.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { CAR_IMAGES, imageKey } from "./car-images";

/**
 * Minimal .env loader (zero-dependency). Loads .env.local then .env from the
 * current working directory so `npm run seed` works without exporting vars.
 * Does not override variables already present in the environment.
 */
function loadEnvFiles(): void {
  for (const file of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const raw of readFileSync(path, "utf8").split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let value = line.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

type BodyType =
  | "SUV"
  | "Sedan"
  | "Coupe"
  | "Truck"
  | "Convertible"
  | "Hatchback"
  | "Van"
  | "Wagon";

interface SeedCar {
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  body_type: BodyType;
  specs: Record<string, string | number | boolean | string[]>;
}

// Per-car images live in car-images.ts (one accurate photo per car, no shared
// pool). Fill that file in, then re-seed — see its header for instructions.

const CARS: SeedCar[] = [
  // ---- SUV ----
  { make: "Toyota", model: "RAV4", year: 2021, mileage: 28400, price: 27990, body_type: "SUV",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.5L I4", seats: 5, doors: 5, exteriorColor: "Magnetic Gray", interiorColor: "Black", features: ["Backup Camera", "Apple CarPlay", "Lane Assist", "Heated Seats"] } },
  { make: "Honda", model: "CR-V", year: 2020, mileage: 35100, price: 25490, body_type: "SUV",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "1.5L Turbo I4", seats: 5, doors: 5, exteriorColor: "Modern Steel", interiorColor: "Gray", features: ["Adaptive Cruise", "Blind Spot Monitor", "Apple CarPlay"] } },
  { make: "Mazda", model: "CX-5", year: 2022, mileage: 18900, price: 28700, body_type: "SUV",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.5L I4", seats: 5, doors: 5, exteriorColor: "Soul Red", interiorColor: "Black", features: ["Bose Audio", "Leather", "Heated Seats", "Backup Camera"] } },
  { make: "Subaru", model: "Forester", year: 2019, mileage: 46200, price: 22300, body_type: "SUV",
    specs: { transmission: "CVT", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.5L H4", seats: 5, doors: 5, exteriorColor: "Crystal White", interiorColor: "Gray", features: ["EyeSight Safety", "Roof Rails", "Backup Camera"] } },
  { make: "Jeep", model: "Grand Cherokee", year: 2018, mileage: 58700, price: 23950, body_type: "SUV",
    specs: { transmission: "Automatic", drivetrain: "4WD", fuelType: "Gasoline", engine: "3.6L V6", seats: 5, doors: 5, exteriorColor: "Granite Crystal", interiorColor: "Black", features: ["Leather", "Navigation", "Tow Package"] } },
  { make: "Ford", model: "Explorer", year: 2020, mileage: 41500, price: 29900, body_type: "SUV",
    specs: { transmission: "Automatic", drivetrain: "4WD", fuelType: "Gasoline", engine: "2.3L Turbo I4", seats: 7, doors: 5, exteriorColor: "Agate Black", interiorColor: "Ebony", features: ["Third Row", "Apple CarPlay", "Backup Camera"] } },
  { make: "Hyundai", model: "Tucson", year: 2021, mileage: 24300, price: 24600, body_type: "SUV",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.5L I4", seats: 5, doors: 5, exteriorColor: "Amazon Gray", interiorColor: "Black", features: ["Apple CarPlay", "Blind Spot Monitor", "Heated Seats"] } },
  { make: "Kia", model: "Sportage", year: 2022, mileage: 15600, price: 26800, body_type: "SUV",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.5L I4", seats: 5, doors: 5, exteriorColor: "Steel Gray", interiorColor: "Black", features: ["Panoramic Roof", "Navigation", "Heated Seats"] } },
  { make: "Toyota", model: "Highlander", year: 2019, mileage: 52100, price: 31200, body_type: "SUV",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "3.5L V6", seats: 8, doors: 5, exteriorColor: "Celestial Silver", interiorColor: "Gray", features: ["Third Row", "Leather", "Sunroof"] } },
  { make: "Chevrolet", model: "Tahoe", year: 2017, mileage: 71800, price: 28500, body_type: "SUV",
    specs: { transmission: "Automatic", drivetrain: "4WD", fuelType: "Gasoline", engine: "5.3L V8", seats: 8, doors: 5, exteriorColor: "Black", interiorColor: "Cocoa", features: ["Third Row", "Leather", "Tow Package", "Navigation"] } },
  { make: "Ford", model: "Mustang Mach-E", year: 2022, mileage: 17200, price: 38900, body_type: "SUV",
    specs: { transmission: "Single-Speed", drivetrain: "AWD", fuelType: "Electric", engine: "Dual Motor", seats: 5, doors: 5, exteriorColor: "Rapid Red", interiorColor: "Black", rangeMiles: 270, features: ["Fast Charging", "Panoramic Roof", "Driver Assist"] } },

  // ---- Sedan ----
  { make: "Toyota", model: "Camry", year: 2021, mileage: 26700, price: 24900, body_type: "Sedan",
    specs: { transmission: "Automatic", drivetrain: "FWD", fuelType: "Gasoline", engine: "2.5L I4", seats: 5, doors: 4, exteriorColor: "Predawn Gray", interiorColor: "Black", features: ["Apple CarPlay", "Adaptive Cruise", "Backup Camera"] } },
  { make: "Honda", model: "Accord", year: 2020, mileage: 33400, price: 23800, body_type: "Sedan",
    specs: { transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", engine: "1.5L Turbo I4", seats: 5, doors: 4, exteriorColor: "Modern Steel", interiorColor: "Ivory", features: ["Lane Assist", "Apple CarPlay", "Heated Seats"] } },
  { make: "Honda", model: "Civic", year: 2022, mileage: 14900, price: 23500, body_type: "Sedan",
    specs: { transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", engine: "2.0L I4", seats: 5, doors: 4, exteriorColor: "Sonic Gray", interiorColor: "Black", features: ["Apple CarPlay", "Backup Camera", "Honda Sensing"] } },
  { make: "Toyota", model: "Corolla", year: 2021, mileage: 29800, price: 19900, body_type: "Sedan",
    specs: { transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", engine: "1.8L I4", seats: 5, doors: 4, exteriorColor: "Classic Silver", interiorColor: "Black", features: ["Apple CarPlay", "Lane Assist", "Backup Camera"] } },
  { make: "Nissan", model: "Altima", year: 2019, mileage: 47600, price: 17800, body_type: "Sedan",
    specs: { transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", engine: "2.5L I4", seats: 5, doors: 4, exteriorColor: "Storm Blue", interiorColor: "Charcoal", features: ["Apple CarPlay", "Backup Camera", "Blind Spot Monitor"] } },
  { make: "Mazda", model: "Mazda3", year: 2021, mileage: 22100, price: 21900, body_type: "Sedan",
    specs: { transmission: "Automatic", drivetrain: "FWD", fuelType: "Gasoline", engine: "2.5L I4", seats: 5, doors: 4, exteriorColor: "Snowflake White", interiorColor: "Black", features: ["Leather", "Bose Audio", "Heated Seats"] } },
  { make: "Hyundai", model: "Elantra", year: 2022, mileage: 16400, price: 20400, body_type: "Sedan",
    specs: { transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", engine: "2.0L I4", seats: 5, doors: 4, exteriorColor: "Phantom Black", interiorColor: "Gray", features: ["Apple CarPlay", "Wireless Charging", "Backup Camera"] } },
  { make: "Volkswagen", model: "Passat", year: 2018, mileage: 55300, price: 16500, body_type: "Sedan",
    specs: { transmission: "Automatic", drivetrain: "FWD", fuelType: "Gasoline", engine: "2.0L Turbo I4", seats: 5, doors: 4, exteriorColor: "Platinum Gray", interiorColor: "Black", features: ["Leather", "Heated Seats", "Backup Camera"] } },
  { make: "BMW", model: "3 Series", year: 2019, mileage: 38900, price: 28900, body_type: "Sedan",
    specs: { transmission: "Automatic", drivetrain: "RWD", fuelType: "Gasoline", engine: "2.0L Turbo I4", seats: 5, doors: 4, exteriorColor: "Alpine White", interiorColor: "Black", features: ["Leather", "Navigation", "Sunroof", "Sport Package"] } },
  { make: "Mercedes-Benz", model: "C-Class", year: 2018, mileage: 49200, price: 26500, body_type: "Sedan",
    specs: { transmission: "Automatic", drivetrain: "RWD", fuelType: "Gasoline", engine: "2.0L Turbo I4", seats: 5, doors: 4, exteriorColor: "Obsidian Black", interiorColor: "Saddle Brown", features: ["Leather", "Navigation", "Premium Audio"] } },
  { make: "Tesla", model: "Model 3", year: 2021, mileage: 31200, price: 33900, body_type: "Sedan",
    specs: { transmission: "Single-Speed", drivetrain: "RWD", fuelType: "Electric", engine: "Single Motor", seats: 5, doors: 4, exteriorColor: "Pearl White", interiorColor: "Black", rangeMiles: 263, features: ["Autopilot", "Glass Roof", "Fast Charging"] } },

  // ---- Coupe ----
  { make: "Ford", model: "Mustang", year: 2019, mileage: 34500, price: 27900, body_type: "Coupe",
    specs: { transmission: "Manual", drivetrain: "RWD", fuelType: "Gasoline", engine: "5.0L V8", seats: 4, doors: 2, exteriorColor: "Race Red", interiorColor: "Ebony", features: ["Leather", "Premium Audio", "Performance Package"] } },
  { make: "Chevrolet", model: "Camaro", year: 2018, mileage: 41200, price: 25400, body_type: "Coupe",
    specs: { transmission: "Automatic", drivetrain: "RWD", fuelType: "Gasoline", engine: "3.6L V6", seats: 4, doors: 2, exteriorColor: "Summit White", interiorColor: "Black", features: ["Backup Camera", "Apple CarPlay", "Sport Suspension"] } },
  { make: "BMW", model: "4 Series", year: 2020, mileage: 28800, price: 36900, body_type: "Coupe",
    specs: { transmission: "Automatic", drivetrain: "RWD", fuelType: "Gasoline", engine: "2.0L Turbo I4", seats: 4, doors: 2, exteriorColor: "Mineral Gray", interiorColor: "Cognac", features: ["Leather", "Navigation", "Sunroof"] } },
  { make: "Audi", model: "A5", year: 2019, mileage: 36700, price: 32400, body_type: "Coupe",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.0L Turbo I4", seats: 4, doors: 2, exteriorColor: "Daytona Gray", interiorColor: "Black", features: ["Quattro AWD", "Leather", "Virtual Cockpit"] } },
  { make: "Dodge", model: "Challenger", year: 2021, mileage: 19800, price: 31900, body_type: "Coupe",
    specs: { transmission: "Automatic", drivetrain: "RWD", fuelType: "Gasoline", engine: "3.6L V6", seats: 5, doors: 2, exteriorColor: "Pitch Black", interiorColor: "Black", features: ["Apple CarPlay", "Performance Pages", "Backup Camera"] } },

  // ---- Truck ----
  { make: "Ford", model: "F-150", year: 2020, mileage: 43800, price: 34900, body_type: "Truck",
    specs: { transmission: "Automatic", drivetrain: "4WD", fuelType: "Gasoline", engine: "3.5L EcoBoost V6", seats: 5, doors: 4, exteriorColor: "Oxford White", interiorColor: "Medium Earth Gray", features: ["Tow Package", "Apple CarPlay", "Backup Camera", "Bed Liner"] } },
  { make: "Chevrolet", model: "Silverado 1500", year: 2019, mileage: 51400, price: 31200, body_type: "Truck",
    specs: { transmission: "Automatic", drivetrain: "4WD", fuelType: "Gasoline", engine: "5.3L V8", seats: 6, doors: 4, exteriorColor: "Silver Ice", interiorColor: "Jet Black", features: ["Tow Package", "Backup Camera", "Bench Seat"] } },
  { make: "Ram", model: "1500", year: 2021, mileage: 27600, price: 38400, body_type: "Truck",
    specs: { transmission: "Automatic", drivetrain: "4WD", fuelType: "Gasoline", engine: "5.7L HEMI V8", seats: 5, doors: 4, exteriorColor: "Diamond Black", interiorColor: "Black", features: ["Leather", "12-inch Touchscreen", "Tow Package"] } },
  { make: "Toyota", model: "Tacoma", year: 2020, mileage: 39900, price: 33500, body_type: "Truck",
    specs: { transmission: "Automatic", drivetrain: "4WD", fuelType: "Gasoline", engine: "3.5L V6", seats: 5, doors: 4, exteriorColor: "Cement Gray", interiorColor: "Black", features: ["TRD Off-Road", "Apple CarPlay", "Backup Camera"] } },
  { make: "GMC", model: "Sierra 1500", year: 2018, mileage: 62300, price: 29800, body_type: "Truck",
    specs: { transmission: "Automatic", drivetrain: "4WD", fuelType: "Gasoline", engine: "5.3L V8", seats: 6, doors: 4, exteriorColor: "Onyx Black", interiorColor: "Jet Black", features: ["Tow Package", "Heated Seats", "Backup Camera"] } },
  { make: "Ford", model: "Ranger", year: 2022, mileage: 18700, price: 32100, body_type: "Truck",
    specs: { transmission: "Automatic", drivetrain: "4WD", fuelType: "Gasoline", engine: "2.3L EcoBoost I4", seats: 5, doors: 4, exteriorColor: "Velocity Blue", interiorColor: "Ebony", features: ["FX4 Package", "Apple CarPlay", "Tow Package"] } },

  // ---- Convertible ----
  { make: "Mazda", model: "MX-5 Miata", year: 2019, mileage: 23400, price: 25900, body_type: "Convertible",
    specs: { transmission: "Manual", drivetrain: "RWD", fuelType: "Gasoline", engine: "2.0L I4", seats: 2, doors: 2, exteriorColor: "Soul Red", interiorColor: "Black", features: ["Soft Top", "Bose Audio", "Apple CarPlay"] } },
  { make: "Ford", model: "Mustang Convertible", year: 2018, mileage: 37200, price: 26400, body_type: "Convertible",
    specs: { transmission: "Automatic", drivetrain: "RWD", fuelType: "Gasoline", engine: "2.3L EcoBoost I4", seats: 4, doors: 2, exteriorColor: "Ingot Silver", interiorColor: "Ebony", features: ["Power Top", "Leather", "Backup Camera"] } },
  { make: "BMW", model: "Z4", year: 2020, mileage: 21800, price: 41900, body_type: "Convertible",
    specs: { transmission: "Automatic", drivetrain: "RWD", fuelType: "Gasoline", engine: "2.0L Turbo I4", seats: 2, doors: 2, exteriorColor: "Misano Blue", interiorColor: "Black", features: ["Power Soft Top", "Leather", "Navigation"] } },
  { make: "Chevrolet", model: "Corvette", year: 2017, mileage: 28900, price: 44500, body_type: "Convertible",
    specs: { transmission: "Automatic", drivetrain: "RWD", fuelType: "Gasoline", engine: "6.2L V8", seats: 2, doors: 2, exteriorColor: "Torch Red", interiorColor: "Black", features: ["Power Top", "Leather", "Performance Exhaust"] } },

  // ---- Hatchback ----
  { make: "Volkswagen", model: "Golf", year: 2019, mileage: 35600, price: 18900, body_type: "Hatchback",
    specs: { transmission: "Automatic", drivetrain: "FWD", fuelType: "Gasoline", engine: "1.4L Turbo I4", seats: 5, doors: 4, exteriorColor: "Deep Black", interiorColor: "Titan Black", features: ["Apple CarPlay", "Heated Seats", "Backup Camera"] } },
  { make: "Honda", model: "Civic Hatchback", year: 2021, mileage: 20300, price: 23900, body_type: "Hatchback",
    specs: { transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", engine: "1.5L Turbo I4", seats: 5, doors: 4, exteriorColor: "Aegean Blue", interiorColor: "Black", features: ["Apple CarPlay", "Honda Sensing", "Backup Camera"] } },
  { make: "Mazda", model: "Mazda3 Hatchback", year: 2020, mileage: 27800, price: 22400, body_type: "Hatchback",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.5L I4", seats: 5, doors: 4, exteriorColor: "Polymetal Gray", interiorColor: "Black", features: ["Leather", "Bose Audio", "Heated Seats"] } },
  { make: "Toyota", model: "Corolla Hatchback", year: 2021, mileage: 19200, price: 21500, body_type: "Hatchback",
    specs: { transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", engine: "2.0L I4", seats: 5, doors: 4, exteriorColor: "Blue Flame", interiorColor: "Black", features: ["Apple CarPlay", "Lane Assist", "Backup Camera"] } },
  { make: "Toyota", model: "Prius", year: 2020, mileage: 33100, price: 23200, body_type: "Hatchback",
    specs: { transmission: "CVT", drivetrain: "FWD", fuelType: "Hybrid", engine: "1.8L I4 Hybrid", seats: 5, doors: 4, exteriorColor: "Sea Glass Pearl", interiorColor: "Gray", mpg: 56, features: ["Apple CarPlay", "Backup Camera", "Adaptive Cruise"] } },
  { make: "Chevrolet", model: "Bolt EV", year: 2021, mileage: 24700, price: 21900, body_type: "Hatchback",
    specs: { transmission: "Single-Speed", drivetrain: "FWD", fuelType: "Electric", engine: "Single Motor", seats: 5, doors: 4, exteriorColor: "Summit White", interiorColor: "Dark Gray", rangeMiles: 259, features: ["Fast Charging", "Apple CarPlay", "Backup Camera"] } },

  // ---- Van ----
  { make: "Honda", model: "Odyssey", year: 2019, mileage: 48600, price: 27400, body_type: "Van",
    specs: { transmission: "Automatic", drivetrain: "FWD", fuelType: "Gasoline", engine: "3.5L V6", seats: 8, doors: 5, exteriorColor: "Modern Steel", interiorColor: "Gray", features: ["Rear Entertainment", "Power Doors", "Backup Camera"] } },
  { make: "Toyota", model: "Sienna", year: 2021, mileage: 26900, price: 36900, body_type: "Van",
    specs: { transmission: "CVT", drivetrain: "AWD", fuelType: "Hybrid", engine: "2.5L I4 Hybrid", seats: 8, doors: 5, exteriorColor: "Celestial Silver", interiorColor: "Black", mpg: 36, features: ["Power Doors", "Apple CarPlay", "Backup Camera"] } },
  { make: "Chrysler", model: "Pacifica", year: 2020, mileage: 41300, price: 28900, body_type: "Van",
    specs: { transmission: "Automatic", drivetrain: "FWD", fuelType: "Gasoline", engine: "3.6L V6", seats: 7, doors: 5, exteriorColor: "Brilliant Black", interiorColor: "Alloy", features: ["Stow 'n Go", "Rear Entertainment", "Power Doors"] } },
  { make: "Kia", model: "Carnival", year: 2022, mileage: 17800, price: 33500, body_type: "Van",
    specs: { transmission: "Automatic", drivetrain: "FWD", fuelType: "Gasoline", engine: "3.5L V6", seats: 8, doors: 5, exteriorColor: "Astra Blue", interiorColor: "Gray", features: ["Power Doors", "Apple CarPlay", "Blind Spot Monitor"] } },

  // ---- Wagon ----
  { make: "Subaru", model: "Outback", year: 2020, mileage: 32700, price: 27900, body_type: "Wagon",
    specs: { transmission: "CVT", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.5L H4", seats: 5, doors: 5, exteriorColor: "Autumn Green", interiorColor: "Slate Black", features: ["EyeSight Safety", "Roof Rails", "Apple CarPlay"] } },
  { make: "Volvo", model: "V60", year: 2019, mileage: 38400, price: 29900, body_type: "Wagon",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.0L Turbo I4", seats: 5, doors: 5, exteriorColor: "Crystal White", interiorColor: "Charcoal", features: ["Leather", "Navigation", "Pilot Assist"] } },
  { make: "Audi", model: "A4 Allroad", year: 2018, mileage: 52900, price: 26900, body_type: "Wagon",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "2.0L Turbo I4", seats: 5, doors: 5, exteriorColor: "Monsoon Gray", interiorColor: "Black", features: ["Quattro AWD", "Leather", "Virtual Cockpit"] } },
  { make: "Volkswagen", model: "Golf SportWagen", year: 2018, mileage: 47100, price: 18400, body_type: "Wagon",
    specs: { transmission: "Automatic", drivetrain: "AWD", fuelType: "Gasoline", engine: "1.8L Turbo I4", seats: 5, doors: 5, exteriorColor: "Tornado Red", interiorColor: "Titan Black", features: ["Apple CarPlay", "Heated Seats", "Roof Rails"] } },
];

async function main(): Promise<void> {
  loadEnvFiles();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (in the nextgear-site folder) or the environment.",
    );
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  // Each car gets its own image from car-images.ts (one accurate photo per car,
  // no shared pool — so no duplicates and no mismatches).
  const missing: string[] = [];
  const rows = CARS.map((car) => {
    const key = imageKey(car.make, car.model, car.year);
    const image_url = CAR_IMAGES[key] ?? "";
    if (!image_url) missing.push(key);
    return {
      make: car.make,
      model: car.model,
      year: car.year,
      mileage: car.mileage,
      price: car.price,
      body_type: car.body_type,
      specs: car.specs,
      image_url,
      status: "available" as const,
    };
  });

  if (missing.length > 0) {
    console.warn(
      `\n⚠  ${missing.length}/${rows.length} cars still have no image. Add their URLs in ` +
        `scripts/car-images.ts and re-seed. Missing:\n   - ${missing.join("\n   - ")}\n`,
    );
  }

  console.log(`Seeding ${rows.length} cars into the dealer DB...`);
  const { error: delError } = await supabase.from("cars").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (delError) throw delError;

  const { error: insError, count } = await supabase
    .from("cars")
    .insert(rows, { count: "exact" });
  if (insError) throw insError;

  console.log(`Done. Inserted ${count ?? rows.length} cars across 8 body types.`);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
