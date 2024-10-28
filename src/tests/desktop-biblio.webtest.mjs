import { assert, describe, it, run } from "jest-lite";

import { page, execTest, wrap } from "./page-seed-playwright";
import { appendIsland, setIsland, isFullstack } from "../dom-base";
import { TEST_ONLY } from "../desktop-biblio";

const {
  injectOpts,
  markAllLinksUnknown,
  generateEmpty,
  normaliseData,
  applyDOMpositions,
  mapPositions,
  addMetaAge,
  createBiblio,
} = TEST_ONLY;

describe("TEST BROWSER desktop-biblio", () => {
  it("go 6: applyDOMpositions", (context) => {
    wrap(TEST_NAME, "https://127.0.0.1:8081/home.html", (dom, loc, win) => {
    let str = `<span id="uniq1">GDG</span>
<span id="uniq2">WER</span>
<span id="uniq3">IOP</span>
<span id="uniq4">ASD</span>
`;
    appendIsland("#point2", str, dom);
    if (!isFullstack(win)) {
      context.skip();
      return;
    }

    applyDOMpositions(dom.querySelector("#uniq1"), 200);
    applyDOMpositions(dom.querySelector("#uniq2"), 400);
    applyDOMpositions(dom.querySelector("#uniq3"), 600);
    applyDOMpositions(dom.querySelector("#uniq4"), 800);
    assert.equal(
      dom.querySelector("#uniq1").getAttribute("class"),
      "",
      "assert #19",
    );
    assert.equal(
      "",

      dom.querySelector("#uniq2").getAttribute("class"),
      "assert #20",
    );
    assert.equal(
      dom.querySelector("#uniq3").getAttribute("class"),
      "",
      "assert #21",
    );
    assert.equal(
      dom.querySelector("#uniq4").getAttribute("class"),
      "",
      "assert #22",
    );
  });
  });
});

execTest(run);
