import hljs from "highlight.js/lib/core";
import * as javascript from "highlight.js/lib/languages/xml";
hljs.registerLanguage("html", (hl) => {
  return javascript.default(hl);
});
// maybe add second leg for xml

export function execHighlight(dom = document) {
  dom.querySelectorAll('code[lang="html"]').forEach((el) => {
    hljs.highlightElement(el);
  });
}

if (typeof window.process === "undefined") {
  execHighlight(document);
}
