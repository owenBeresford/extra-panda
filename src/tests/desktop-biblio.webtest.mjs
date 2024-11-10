import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { appendIsland, setIsland, isFullstack } from "../dom-base";
import { delay, domLog } from "../networking";
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

describe("TEST BROWSER desktop-biblio", async () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }

  it("test 6: applyDOMpositions", async () => {
    const TEST_NAME = "BROWSER TEST func[1] applyDOMPositions";
    // IOIO add extra test, where the base HTML is adjusted to the test results mean more
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        let str = `<span id="uniq1">GDG</span>
<span id="uniq2">WER</span>
<span id="uniq3">IOP</span>
<span id="uniq4">ASD</span>
`;
        appendIsland(".home.icerow", str, dom);

        // this test doesn't mean very much now the width is computed at runtime rather than compile time
        applyDOMpositions(dom.querySelector("#uniq1"), win);
        applyDOMpositions(dom.querySelector("#uniq2"), win);
        applyDOMpositions(dom.querySelector("#uniq3"), win);
        applyDOMpositions(dom.querySelector("#uniq4"), win);
        expect(dom.querySelector("#uniq1").getAttribute("class")).toBe(
          "leanLeft leanUp",
        ); //  "assert #19",
        expect(dom.querySelector("#uniq2").getAttribute("class")).toBe(
          "leanLeft leanUp",
        ); //  "assert #20",
        expect(dom.querySelector("#uniq3").getAttribute("class")).toBe(
          "leanLeft leanUp",
        ); // "assert #21",
        expect(dom.querySelector("#uniq4").getAttribute("class")).toBe(
          "leanLeft leanUp",
        ); // "assert #22",
        await delay(100);
      },
    );
  });

  it("test 6.1: applyDOMpositions", async () => {
    const TEST_NAME = "BROWSER TEST func[2] applyDOMPositions";
    // IOIO add extra test, where the base HTML is adjusted to the test results mean more
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/domposition.html",
      async (dom, loc, win) => {
        // currently too high and left
        applyDOMpositions(
          dom.querySelector(".addReferences sup:nth-child(3)>a"),
          win,
        );
        // currently too left by alot
        applyDOMpositions(
          dom.querySelector(
            '.addReferences sup>a[href="https://www.highcharts.com/demo/heatmap-canvas"]',
          ),
          win,
        );
        // currently too left
        applyDOMpositions(
          dom.querySelector(
            '.addReferences sup>a[href="https://www.cybrosys.com/blog/create-dashboard-using-highchart-js"]',
          ),
          win,
        );
        // currently OK
        applyDOMpositions(
          dom.querySelector(
            '.addReferences sup>a[href="https://api.highcharts.com/highcharts/chart.events.render"]',
          ),

          win,
        );

        expect(
          dom
            .querySelector(".addReferences sup:nth-child(3)>a")
            .getAttribute("class"),
        ).toBe("leanCentre");
        expect(
          dom // labelled 9
            .querySelector(
              '.addReferences sup>a[href="https://www.highcharts.com/demo/heatmap-canvas"]',
            )
            .getAttribute("class"),
        ).toBe("leanLeft");
        expect(
          dom
            .querySelector(
              '.addReferences sup>a[href="https://www.cybrosys.com/blog/create-dashboard-using-highchart-js"]',
            )
            .getAttribute("class"),
        ).toBe("leanCentre");

        expect(
          dom
            .querySelector(
              '.addReferences sup>a[href="https://api.highcharts.com/highcharts/chart.events.render"]',
            )
            .getAttribute("class"),
        ).toBe("leanRight");

        // need a further test for centre

        await delay(100);
      },
    );
  });
});

execTest(run);
