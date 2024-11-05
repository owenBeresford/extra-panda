import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from 'eslint-plugin-jsdoc';
// eslint-plugin-jsx-a11y, eslint-plugin-vuejs-accessibility, eslint-plugin-react-native-a11y, eslint-plugin-styled-components-a11y 
// eslint-plugin-jest, eslint-plugin-vitest: WTB a rule for count-of-skips vs count-of-real-tests


export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: [ "dist", "node_modules", "src/tests/", "src/fixtures/" ] },
  {	 
    settings: {
    jsdoc: {
      mode: "typescript",
    },
	},
    plugins: { jsdoc },
	"rules": { 
	"complexity": ["error", 10],	
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

  }
];
