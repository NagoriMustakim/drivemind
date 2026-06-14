/**
 * ESLint config for drivemind-chatbot.
 * Enforces Constitution Principle I: no cross-app imports. This app may not
 * import from nextgear-site/ or drivemind-admin/ (or the root contract/).
 * The contract arrives via the mirrored lib/contract.ts; the shared KB schema
 * via the mirrored supabase/kb-schema.sql (read-only). HTTP only between apps.
 */
module.exports = {
  root: true,
  extends: ["next/core-web-vitals"],
  ignorePatterns: ["widget/dist/**"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: [
              "**/nextgear-site/**",
              "**/drivemind-admin/**",
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
