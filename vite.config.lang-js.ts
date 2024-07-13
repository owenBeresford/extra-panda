/** @type {import('vite').UserConfig} */

import { defineConfig } from "vite";
import path, { dirname } from "path";
import ts from "vite-plugin-ts";
import { fileURLToPath } from "url";
// import { terser } from "rollup-plugin-terser";
import terser from "@rollup/plugin-terser";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [ts()],
  root: ".",
  server: {
    hmr: false,
  },
  build: {
	emptyOutDir:false,
    minify: "terser",
    target: "es2020",
    lib: {
      entry: [path.resolve(__dirname, "src/highlight/highlight-js.ts")],
    },
    rollupOptions: {
      plugins: [terser({})],
      external: [],
      output: [
        {
          format: "es",
          entryFileNames: "highlight-js.mjs",
        },
      ],
    },
  },
});

// vim: syn=javascript nospell
