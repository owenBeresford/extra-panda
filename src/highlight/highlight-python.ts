import hljs from "highlight.js/lib/core";
import { Language, HLJSApi } from "highlight.js";
import * as javascript from "highlight.js/lib/languages/python";

// custom written loader as code is packed in a legacy fashion
hljs.registerLanguage("python", (hl: HLJSApi): Language => {
  return javascript.default(hl);
});

/**
 * execHighlight
 * Apply the highlighting for the current language
 
 * @param {Document = document} dom
 * @public
 * @returns {void}
 */
export function execHighlight(dom: Document = document): void {
  dom
    .querySelectorAll('code[lang="python"], code[lang="py3"]')
    .forEach((el: HTMLElement): void => {
      hljs.highlightElement(el);
    });
}

if (typeof window.process === "undefined") {
  execHighlight(document);
}
