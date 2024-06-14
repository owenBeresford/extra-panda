/// <reference types="vitest" />
//  // / <reference types="vite/client" />

import { configDefaults, defineConfig, UserConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: [
//      "src/client/test/*.vitest.ts",
//      "src/client/test/*.vitest.tsx",
//      "src/client/test/*.vitest.js",
      "src/tests/*.vitest.mjs",
    ],
    environment: "jsdom",
    bail: 0,
  },
  browser: { enabled: true, name: "chromium" },
});

// vim: syn=typescript nospell
