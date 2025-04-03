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
  clearScreen:false,
  root: ".",
  server: {
    hmr: false,
  },
  build: {
    minify: "terser",
    target: "es2022",
    emptyOutDir: false,
    outDir: 'dist',
    lib: {
      entry: [path.resolve(__dirname, "src/tests/tabs.webtest.mjs")],
    },
    rollupOptions: {
      plugins: [terser({})],
      external: [],
      output: [
        {
          format: "es",
          entryFileNames: "tests/tabs.webtest.mjs",
        },
      ],
    },
  },
});

// vim: syn=javascript nospell
