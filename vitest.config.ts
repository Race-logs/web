import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.{ts,tsx}",
        "**/*.d.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
      ],
    },
  },
});
