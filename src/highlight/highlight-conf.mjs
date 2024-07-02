import hljs from "highlight.js/lib/core";
import * as javascript from "highlight.js/lib/languages/apache";
hljs.registerLanguage("apache", (hl) => {
  return javascript.default(hl);
});

export function execHighlight(dom = document) {
  dom.querySelectorAll('code[lang="conf"]').forEach((el) => {
    hljs.highlightElement(el);
  });
}

if (typeof window.process === "undefined") {
  execHighlight(document);
}
