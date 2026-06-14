import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "server-only": resolve(__dirname, "tests/stubs/server-only.ts"),
      "@": resolve(__dirname, "."),
    },
  },
});
