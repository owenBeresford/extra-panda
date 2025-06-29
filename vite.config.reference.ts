/** @type {import('vite').UserConfig} */

import { defineConfig } from "vite";
import path, { dirname } from "path";
import ts from "vite-plugin-ts";
import { fileURLToPath } from "url";
// import { terser } from "rollup-plugin-terser";
import terser from "@rollup/plugin-terser";

// https://stackoverflow.com/questions/69523560/using-vite-for-backend
const { builtinModules } = await import('node:module');
const NODE_BUILT_IN_MODULES = Array.from( builtinModules).filter( m => !m.startsWith('_') );
NODE_BUILT_IN_MODULES.push(...NODE_BUILT_IN_MODULES.map(m => `node:${m}`));
NODE_BUILT_IN_MODULES.push( 'node-libcurl' ); 

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [ts()],
  root: ".",
  server: {
    hmr: false,
  },
    optimizeDeps: {
        exclude: NODE_BUILT_IN_MODULES,
    },
  build: {
    minify: "terser",
    target: "es2022",
    lib: {
      entry: [path.resolve(__dirname, "tools/generate-references2.ts")],
    },
    rollupOptions: {
      plugins: [terser({})],
      external: [],
      output: [
        {
          format: "es",
          entryFileNames: "gen-ref2.mjs",
        },
      ],
    },
  },
});

// vim: syn=javascript nospell
