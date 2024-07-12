import hljs from "highlight.js/lib/core";
import * as javascript from "highlight.js/lib/languages/bash";
// custom written loader as code is packed in a legacy fashion
hljs.registerLanguage("sql", (hl) => {
  return javascript.default(hl);
});

/**
 * execHighlight
 * Apply the highlighting for the current language
 
 * @param {Document = document} dom
 * @public
 * @return {void}
 */
export function execHighlight(dom = document) {
  dom.querySelectorAll('code[lang="bash"]').forEach((el) => {
    hljs.highlightElement(el);
  });
}

if (typeof window.process === "undefined") {
  execHighlight(document);
}
