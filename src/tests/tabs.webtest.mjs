import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { delay } from "../networking";
// import { log, domLog } from "../log-services";
import { getCSSAttr } from "./vitest-addons";
// import { TEST_ONLY } from "../tabs";

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

        const EVT1 = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: win,
        });
        // this handler is supposed to be sync
        expect(dom.querySelector("#projects").dispatchEvent(EVT1)).toBe(true);
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

  it("go 2: initTabs", async () => {
    const TEST_NAME = "BROWSER TEST func[1] setInitState ";
    return await wrap(
      TEST_NAME,
      "/home.html?debug=1#projects",
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

        const EVT1 = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: win,
        });
        // this handler is supposed to be sync
        expect(
          dom
            .querySelector(".tab2Container label:has( #articles) ")
            .dispatchEvent(EVT1),
        ).toBe(true);
        await delay(1000);
        // the artiifical mouse events do no seem to work.
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

        expect(getCSSAttr("#panelProjects", "display", dom, win)).toBe(
          "inline-block",
        );
        expect(getCSSAttr("#panelArticles", "display", dom, win)).toBe("none");

        await delay(100);
      },
    );
  });
});

execTest(run);
