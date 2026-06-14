// Fails CI if the built Otto widget bundle exceeds the gzipped budget.
// Constitution Principle VI: the embeddable widget targets <15KB gzipped.
import { gzipSync } from "node:zlib";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUDGET_BYTES = 15 * 1024; // 15KB gzipped
const bundlePath = join(__dirname, "dist", "otto.js");

if (!existsSync(bundlePath)) {
  console.error(`[widget:size] bundle not found at ${bundlePath} — run "npm run widget:build" first.`);
  process.exit(1);
}

const raw = readFileSync(bundlePath);
const gzipped = gzipSync(raw).length;
const kb = (gzipped / 1024).toFixed(2);

if (gzipped > BUDGET_BYTES) {
  console.error(`[widget:size] FAIL: otto.js is ${kb}KB gzipped (budget 15.00KB).`);
  process.exit(1);
}
console.log(`[widget:size] OK: otto.js is ${kb}KB gzipped (budget 15.00KB).`);
