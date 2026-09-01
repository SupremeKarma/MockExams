import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "node",
    // Rules tests share one emulator instance, so they must not run in
    // parallel against each other.
    fileParallelism: false,
    include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
    exclude: [
      "node_modules/**",
      // Needs live Supabase and Redis.
      "tests/integration.test.ts",
    ],
    testTimeout: 20000,
    hookTimeout: 30000,
  },
});
