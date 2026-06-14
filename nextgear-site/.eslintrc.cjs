/**
 * ESLint config for nextgear-site.
 * Enforces Constitution Principle I: no cross-app imports. This app may not
 * import from drivemind-admin/ or drivemind-chatbot/ (or the root contract/);
 * the contract arrives only via the mirrored lib/contract.ts.
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
              "**/drivemind-admin/**",
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
