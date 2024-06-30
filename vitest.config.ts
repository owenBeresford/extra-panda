/// <reference types="vitest" />
//  // / <reference types="vite/client" />

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["src/tests/*.vitest.mjs"],
    environment: "jsdom",
    bail: 0,
  },
  browser: { enabled: true, name: "chromium" },
});

// vim: syn=typescript nospell
