import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from 'eslint-plugin-jsdoc';
import vitest from "eslint-plugin-vitest";
import jest from "eslint-plugin-jest"; 
import * as parser from '@typescript-eslint/parser';
// eslint-plugin-jsx-a11y, eslint-plugin-vuejs-accessibility, eslint-plugin-react-native-a11y, eslint-plugin-styled-components-a11y 
// import prettierPlugin from 'eslint-plugin-prettier';  IOIO when stable add this

// this doesn't seem to work in this edition, so disabled.
//const NoFloatingPromises = await import( "eslint-plugin-no-floating-promise"); 
//NoFloatingPromises.default.config={}; 

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
// I may want to add a new config for the tests, AND MOST-DEF THE tools/test-browser script
  {
//    files: [ 'src/highlight/*.ts', 'src/tests/*.ts', 'src/*.ts',],
//    files: [ 'src/tests/*.vitest.ts', ],
    settings: {
    jsdoc: {
      mode: "typescript",
    },
	vitest: {
        typecheck: true,
    }
	},
//    plugins: { jsdoc, "no-floating-promise":NoFakePromises, vitest, jest },
    plugins: { tseslint, jsdoc, vitest, jest, },
	"rules": { 
	"complexity": ["error", 10],	
	"linebreak-style": ['error', 'unix'],
    semi: ['warn', 'always'],
	"no-alert"  : "error",
// lint/prettier should be doing this step already
//	"no-tabs": 0,
//	"no-floating-promise/no-floating-promise": 2,
	"@typescript-eslint/no-duplicate-type-constituents": [ "error", { ignoreIntersections: false, ignoreUnions: false } ],
// Rate of wrong reports on the following is too high
//	"@typescript-eslint/no-redundant-type-constituents": "error",
	"@typescript-eslint/explicit-module-boundary-types": "error",
 	"@typescript-eslint/await-thenable": "warn",
	"@typescript-eslint/consistent-generic-constructors": "warn",
	"@typescript-eslint/consistent-generic-constructors": "warn",
	"@typescript-eslint/consistent-type-imports": "error",
	"@typescript-eslint/explicit-function-return-type": "error",
 	"@typescript-eslint/explicit-member-accessibility": "error",
	"@typescript-eslint/method-signature-style": [ "error", 'method' ],

    "jsdoc/check-tag-names": 1,
    "jsdoc/require-jsdoc": 1,
    "jsdoc/newline-after-description": 0,
    "jsdoc/require-description": 1,
    "jsdoc/require-param": 1,
    "jsdoc/require-param-description": 0,
    "jsdoc/require-param-name": 1,
    "jsdoc/require-param-type": 1,
    "jsdoc/require-returns": 1,
    "jsdoc/require-returns-description": 0,
    "jsdoc/require-yields": 1,

		},
	languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
		       process: "readonly",
		       console: "readonly",
		       fetch: "readonly",
           },
		  parser: tseslint.parser,
		"parserOptions": { programs:[ parser.createProgram('./tsconfig.json') ],  }
        },
	ignores: ["dist/*", "src/fixtures/*.min.*", "src/fixtures/*mjs", "node_modules/*", "package-lock.json", "vite.config*.ts" ],

  },

];
