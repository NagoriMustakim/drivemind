/**
 * Register a dealer in the chatbot KB (the `dealers` table). The public
 * dealer_id is what the widget embeds; registered_domain gates Origin/Referer
 * + CORS in the chatbot service.
 *
 * Run with the CHATBOT DB credentials, e.g.:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *   DEALER_ID=nextgear DEALER_NAME="NextGear Motors" \
 *   DEALER_DOMAIN=https://nextgear-site.example.vercel.app \
 *   DEALER_API_URL=https://nextgear-site.example.vercel.app/api/cars \
 *   npm run register-dealer
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

  const dealer = {
    dealer_id: process.env.DEALER_ID ?? "nextgear",
    name: process.env.DEALER_NAME ?? "NextGear Motors",
    registered_domain: process.env.DEALER_DOMAIN ?? "http://localhost:3000",
    inventory_api_url: process.env.DEALER_API_URL ?? "http://localhost:3000/api/cars",
  };

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await supabase.from("dealers").upsert(dealer, { onConflict: "dealer_id" });
  if (error) throw error;

  console.log(`Registered dealer "${dealer.dealer_id}" (${dealer.name})`);
  console.log(`  domain: ${dealer.registered_domain}`);
  console.log(`  inventory API: ${dealer.inventory_api_url}`);
}

main().catch((err) => {
  console.error("register-dealer failed:", err);
  process.exit(1);
});
