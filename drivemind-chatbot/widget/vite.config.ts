import { defineConfig } from "vite";
import { resolve } from "node:path";

/**
 * Builds the Otto widget as a SINGLE self-contained IIFE bundle loaded by one
 * <script> tag on a third-party page. Preact (not React) keeps it tiny
 * (Constitution VI: target <15KB gzipped — enforced by widget/check-size.mjs).
 */
export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "DriveMindOtto",
      formats: ["iife"],
      fileName: () => "otto.js",
    },
    rollupOptions: {
      output: {
        // Everything inlined into one file; no external/global deps on the host page.
        inlineDynamicImports: true,
      },
    },
    target: "es2020",
    minify: "esbuild",
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "preact",
  },
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
});
