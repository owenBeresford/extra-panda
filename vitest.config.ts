/// <reference types="vitest" />
//  // / <reference types="vite/client" />

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
	name: 'fast',

    globals: true,
    include: ["src/tests/*.vitest.mjs", "src/tests/*.vitest.ts"],
    environment: "node",
    bail: 0,

  browser: { 
	enabled: false, 
	name: "chromium", 
			},
/*
 coverage: {
      provider: 'v8'
    },
*/
  },
});

// vim: syn=typescript nospell

