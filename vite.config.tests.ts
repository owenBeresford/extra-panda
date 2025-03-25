/** @type {import('vite').UserConfig} */

import { defineConfig } from "vite";
import path, { dirname } from "path";
import ts from "vite-plugin-ts";
import { fileURLToPath } from "url";
// https://terser.org/docs/api-reference/#minify-options
// import { terser } from "rollup-plugin-terser";
 import terser from "@rollup/plugin-terser";

// https://stackoverflow.com/questions/69523560/using-vite-for-backend
const { builtinModules } = await import('node:module');
const NODE_BUILT_IN_MODULES = Array.from( builtinModules).filter( m => !m.startsWith('_') );
NODE_BUILT_IN_MODULES.push(...NODE_BUILT_IN_MODULES.map(m => `node:${m}`));

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [ ts() ],
  root: ".",
  server: {
    hmr: false,
  },
    optimizeDeps: {
        exclude: NODE_BUILT_IN_MODULES,
    },
  build: {
//	minify: "esbuild",
    minify: "terser",
    target: "esnext",
	modulePreload: false,
	outDir: "../dist-test/",
    lib: {
      entry: [path.resolve(__dirname, "tools/tests-browser.ts")],
    },
    rollupOptions: {
      plugins: [terser({})],
//		plugins:[],
      external: NODE_BUILT_IN_MODULES,
      output: [
        {
          format: "es",
          entryFileNames: "tests-browser.mjs",
        },
      ],
    },
  },
});

// vim: syn=javascript nospell
