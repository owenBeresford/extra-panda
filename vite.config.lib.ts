/** @type {import('vite').UserConfig} */

import { defineConfig } from "vite";
import path, { dirname } from "path";
import ts from "vite-plugin-ts";
import { fileURLToPath } from "url";
import terser from "@rollup/plugin-terser";
import { viteSingleFile } from "vite-plugin-singlefile";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [ts(), viteSingleFile()],
  root: ".",
  server: {
    hmr: false,
  },
  // resolve.alias
  build: {
    minify: "terser",
    target: "es2022",
    lib: {
      entry: [path.resolve(__dirname, "src/index.mjs")],
    },
    rollupOptions: {
      plugins: [terser({})],
      external: [],
      output: [
        {
          format: "es",
          entryFileNames: "ob1.mjs",
        },
      ],
    },
  },
});

// vim: syn=javascript nospell
