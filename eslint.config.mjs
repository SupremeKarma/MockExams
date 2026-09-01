// ESLint 9 flat config.
//
// The repo had no config at all, so `npm run lint` had been failing outright
// since the ESLint 9 upgrade — nothing had been linted for a long time.
// eslint-config-next 16 ships flat config natively, so no FlatCompat shim is
// needed here.

import next from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

export default [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      // Firebase deploy artefacts: minified bundles, not source.
      ".firebase/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "public/sw.js",
      // Standalone scripts, not part of the app build.
      "scripts/**",
      "supabase/**",
      "examai-ingest/**",
      "bulk-imports/**",
      "tmp/**",
      "scratch/**",
    ],
  },

  ...next,
  ...typescript,

  {
    rules: {
      // Firestore documents come back as `any` from the Admin SDK, and the
      // repo leans on that throughout. Warn so new cases are visible without
      // turning the existing surface into hundreds of errors.
      "@typescript-eslint/no-explicit-any": "warn",
      // Unused args prefixed with _ are intentional (route handler params).
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrors: "none" },
      ],
    },
  },

  {
    // Test and tooling files legitimately use loose types and console output.
    files: ["tests/**/*.ts", "**/*.test.ts", "*.config.{ts,mjs,js}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
