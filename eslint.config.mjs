import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from 'eslint-plugin-jsdoc';
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
	},
    plugins: { jsdoc, "no-floating-promise":NoFakePromises },
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
    "jsdoc/require-yields": 1
		},
	languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.browser,
                ...globals.node,
            }
        },
	ignores: ["dist/*", "src/fixtures/*.min.*" ],

  },
];
