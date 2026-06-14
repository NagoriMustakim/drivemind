import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    globals: true,
  },
  // Widget components use Preact JSX; compile test JSX with the preact runtime.
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
  resolve: {
    alias: {
      "server-only": resolve(__dirname, "tests/stubs/server-only.ts"),
      "@": resolve(__dirname, "."),
    },
  },
});
