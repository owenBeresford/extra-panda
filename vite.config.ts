import { defineConfig } from "vite";
import path, { dirname } from "path";
import ts from "vite-plugin-ts";
import { fileURLToPath } from "url";
import { terser } from "rollup-plugin-terser";

const __dirname = dirname(fileURLToPath(import.meta.url));

let mode = "development";
if (process.env && process.env.NODE_ENV) {
  mode = process.env.NODE_ENV;
}

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [ts()],
  root: ".",
  server: {
    hmr: false,
  },
  esbuild: {
    minifyIdentifiers: false,
  },
  build: {
    //	minify:"terser",
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
