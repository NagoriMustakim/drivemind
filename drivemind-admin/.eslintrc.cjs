/**
 * ESLint config for drivemind-admin.
 * Enforces Constitution Principle I: no cross-app imports. This app may not
 * import from nextgear-site/ or drivemind-chatbot/ (or the root contract/).
 * The contract arrives via the mirrored lib/contract.ts; the shared KB schema
 * via the mirrored supabase/kb-schema.sql. Inter-app talk is HTTP only.
 */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "**/nextgear-site/**",
              "**/drivemind-chatbot/**",
              "**/../contract/**",
              "../../*",
            ],
            message:
              "Cross-app import forbidden (Constitution Principle I). Use the mirrored lib/contract.ts and HTTP APIs only.",
          },
        ],
      },
    ],
  },
};
