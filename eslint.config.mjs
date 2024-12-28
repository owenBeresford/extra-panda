import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from 'eslint-plugin-jsdoc';
import vitest from "eslint-plugin-vitest";
import jest from "eslint-plugin-jest"; 
import * as NoFakePromises  from "eslint-plugin-no-floating-promise"; 
// eslint-plugin-jsx-a11y, eslint-plugin-vuejs-accessibility, eslint-plugin-react-native-a11y, eslint-plugin-styled-components-a11y 
// eslint-plugin-jest, eslint-plugin-vitest: WTB a rule for count-of-skips vs count-of-real-tests


export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
// "src/tests/", 
// I may want to add a new config for the tests, AND MOST-DEF THE tools/test-browser script
  { ignores: [ "dist", "node_modules", "src/fixtures/" ] },
  {	 
    settings: {
    jsdoc: {
      mode: "typescript",
    },
	vitest: {
        typecheck: true
    }
	},
    plugins: { jsdoc, "no-floating-promise":NoFakePromises, vitest, jest },
	"rules": { 
	"complexity": ["error", 10],	
	"no-floating-promise/no-floating-promise": 2,
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

	"jest/consistent-test-it": 0,

	"jest/expect-expect":1, 
	"jest/max-expects":0,
	"jest/no-conditional-expect":1,
	"jest/no-conditional-in-test":0,
	"jest/no-confusing-set-timeout":1,
	"jest/no-deprecated-functions":1,
	"jest/no-disabled-tests":1,
	"jest/no-duplicate-hooks":1, 
	"jest/no-export":1,
	"jest/no-focused-tests":1,
	"jest/no-identical-title":1,
	"jest/no-large-snapshots":1,
	"jest/no-untyped-mock-factory":1,
	"jest/prefer-comparison-matcher":1,
	"jest/require-to-throw-message":1,
	"jest/require-top-level-describe":1,
	"jest/valid-describe-callback":1,
	"jest/valid-expect":1,
	"jest/valid-expect-in-promise":1,	

		},
	languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
				...vitest.environments.env.globals, 
           }
        },
	ignores: ["dist/*", "src/fixtures/*.min.*" ],

  },
];
