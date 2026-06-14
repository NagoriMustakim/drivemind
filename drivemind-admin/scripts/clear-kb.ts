/**
 * Wipe the chatbot knowledge base so it can be rebuilt from a fresh dealer seed.
 * Deletes ALL rows from the KB `cars` table (and sync_jobs history). Scope it to
 * one dealer with DEALER_ID=... ; omit it to clear every dealer.
 *
 * Run with the CHATBOT DB credentials, e.g.:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run clear-kb
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... DEALER_ID=nextgear npm run clear-kb
 *
 * After this, re-seed the dealer site (nextgear-site: npm run seed) and run a
 * Sync from the admin UI to repopulate the KB with fresh, embedded cars.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/** Minimal zero-dependency .env loader (.env.local then .env from cwd). */
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

async function main(): Promise<void> {
  loadEnvFiles();
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (chatbot DB) in .env.local or the environment.");
  }
  const dealerId = process.env.DEALER_ID;
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const scope = dealerId ? `dealer "${dealerId}"` : "ALL dealers";
  console.log(`Clearing chatbot KB cars for ${scope}...`);

  let carsQuery = supabase.from("cars").delete({ count: "exact" });
  let jobsQuery = supabase.from("sync_jobs").delete({ count: "exact" });
  if (dealerId) {
    carsQuery = carsQuery.eq("dealer_id", dealerId);
    jobsQuery = jobsQuery.eq("dealer_id", dealerId);
  } else {
    // Delete-all guard required by Supabase (no unqualified delete).
    carsQuery = carsQuery.neq("id", "00000000-0000-0000-0000-000000000000");
    jobsQuery = jobsQuery.neq("id", "00000000-0000-0000-0000-000000000000");
  }

  const { error: carsErr, count: carsCount } = await carsQuery;
  if (carsErr) throw carsErr;
  const { error: jobsErr, count: jobsCount } = await jobsQuery;
  if (jobsErr) throw jobsErr;

  console.log(`Done. Removed ${carsCount ?? 0} car(s) and ${jobsCount ?? 0} sync job(s).`);
  console.log("Next: re-seed the dealer site, then run a Sync from the admin UI.");
}

main().catch((err) => {
  console.error("clear-kb failed:", err);
  process.exit(1);
});
