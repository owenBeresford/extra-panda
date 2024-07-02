import hljs from "highlight.js/lib/core";
import * as javascript from "highlight.js/lib/languages/go";
hljs.registerLanguage("go", (hl) => {
  return javascript.default(hl);
});

export function execHighlight(dom = document) {
  dom.querySelectorAll('code[lang="go"]').forEach((el) => {
    hljs.highlightElement(el);
  });
}

if (typeof window.process === "undefined") {
  execHighlight(document);
}