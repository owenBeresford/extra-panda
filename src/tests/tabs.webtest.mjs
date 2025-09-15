import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { delay } from "../networking";
// import { log, domLog } from "../log-services";
import { getCSSAttr } from "./vitest-addons";

describe("TEST BROWSER CSS based tabs", () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }
  const DEEP_BLUE = "rgb(0, 73, 135)";
  const PALE_BLUE = "rgb(185, 222, 250)";

  it("go 1: default first state", async () => {
    const TEST_NAME = "BROWSER TEST func[1] default first state ";
    return await wrap(
      TEST_NAME,
      "/home.html?debug=1",
      async (dom, loc, win) => {
        expect(
          getCSSAttr(
            '.tab2Container:has( input[value="1"]:checked ) .tabContent[data-id="1"]',
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            '.tab2Container .tabContent[data-id="2"]',
            "display",
            dom,
            win,
          ),
        ).toBe("none");

        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="1"]:checked )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(PALE_BLUE);
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="2"] )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(DEEP_BLUE);

        // const scrollTop =   dom.documentElement.scrollTop || dom.body.scrollTop || 0;
        // const TARGET = dom.querySelector("#projects");
        const EVT1 = new MouseEvent("click", {
          view: win,
          bubbles: true,
          cancelable: true,
          //			clientX: TARGET.getClientRects().left + 16,
          //			clientY: TARGET.getClientRects().top + scrollTop + 16,
        });

        // this handler is supposed to be sync
        expect(TARGET.dispatchEvent(EVT1)).toBe(true);

        expect(
          getCSSAttr(
            '.tab2Container:has( input[value="2"] ) .tabContent[data-id="2"]',
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            '.tab2Container .tabContent[data-id="1"] ',
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="2"]:checked )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(PALE_BLUE);
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="1"] )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(DEEP_BLUE);

        await delay(100);
      },
    );
  });

  it("go 2: initTabs + mouse events", async () => {
    const TEST_NAME = "BROWSER TEST func[1] setInitState ";
    return await wrap(
      TEST_NAME,
      "/home.html#projects",
      async (dom, loc, win) => {
        expect(
          getCSSAttr(
            '.tab2Container:has( input[value="2"]:checked ) .tabContent[data-id="2"] ',
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            '.tab2Container .tabContent[data-id="1"] ',
            "display",
            dom,
            win,
          ),
        ).toBe("none");

        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="2"]:checked )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(PALE_BLUE);
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="1"] )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(DEEP_BLUE);

        //		const scrollTop = dom.documentElement.scrollTop || dom.body.scrollTop || 0;
        //		const TARGET=dom.querySelector(".tab2Container label:has( #articles )");
        const EVT1 = new MouseEvent("click", {
          view: win,
          bubbles: true,
          cancelable: true,
          //			clientX: TARGET.getClientRects().left + 16,
          //			clientY: TARGET.getClientRects().top + scrollTop + 16,
        });

        // this handler is supposed to be sync
        expect(TARGET.dispatchEvent(EVT1)).toBe(true);
        await delay(1000);

        expect(
          getCSSAttr(
            '.tab2Container:has( input[value="1"]:checked ) .tabContent[data-id="1"]',
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            '.tab2Container .tabContent[data-id="2"]',
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="1"]:checked )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(PALE_BLUE);
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="2"] )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(DEEP_BLUE);

        expect(getCSSAttr("#panelProjects", "display", dom, win)).toBe("none");
        expect(getCSSAttr("#panelArticles", "display", dom, win)).toBe(
          "inline-block",
        );

        await delay(100);
      },
    );
  });

  it("go 3: keys", async (ctx) => {
    const TEST_NAME = "BROWSER TEST func[1] checking keyboard input ";
    return await wrap(
      TEST_NAME,
      "/home.html#projects",
      async (dom, loc, win) => {
        expect(
          getCSSAttr(
            '.tab2Container:has( input[value="2"]:checked ) .tabContent[data-id="2"] ',
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            '.tab2Container .tabContent[data-id="1"] ',
            "display",
            dom,
            win,
          ),
        ).toBe("none");

        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="2"]:checked )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(PALE_BLUE);
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="1"] )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(DEEP_BLUE);

      	ctx.skip("Test not impl yet");
        await delay(100);
      },
    );
  });


});

execTest(run);
