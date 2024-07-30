import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  { languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: [ "dist", "node_modules", "src/tests/" ] },
  {	 
    settings: {
    jsdoc: {
      mode: "typescript",
    },
    plugins: { "jsdoc"
    },
	},
    plugins: { jsdoc },
	"rules": { 
	"complexity": ["error", 10],	
    "jsdoc/check-tag-names": 1,
    "jsdoc/require-jsdoc": 1,
    "jsdoc/newline-after-description": 0,
    "jsdoc/require-description": 1,
//    "jsdoc/require-param": [1, { checkDestructured: false }],
    "jsdoc/require-param": 1,
    "jsdoc/require-param-description": 0,
    "jsdoc/require-param-name": 1,
    "jsdoc/require-param-type": 1,
    "jsdoc/require-returns": 1,
    "jsdoc/require-returns-description": 0,
    "jsdoc/require-yields": 1,
		},
  }
];
