import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { delay } from "../networking";
// import { log, domLog } from "../log-services";
import { getCSSAttr } from "./vitest-addons";
import { TEST_ONLY } from "../tabs";

describe("TEST BROWSER CSS based tabs", async () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }

  it("go 1: default first state", async () => {
    const TEST_NAME = "BROWSER TEST func[1] default first state ";
    return await wrap(
      TEST_NAME,
      "/home.html?debug=1",
      async (dom, loc, win) => {
        expect(
          getCSSAttr(
            ".tabContainer:has( #articles ) .tabContent#panelArticles> ul",
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            ".tabContainer:has( #projects ) .tabContent#panelProjects> ul",
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            ".tabContainer:has( #articles ) .tabHeader label#tabArticles",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(215, 242, 250)");
        expect(
          getCSSAttr(
            ".tabContainer:has( #projects ) .tabHeader label#tabProjects",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(0, 73, 135)");

        const EVT1 = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: win,
        });
        // this handler is supposed to be sync
        expect(dom.querySelector("#projects").dispatchEvent(EVT1)).toBe(true);
        expect(
          getCSSAttr(
            ".tabContainer:has( #projects ) .tabContent#panelProjects>ul",
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            ".tabContainer:has( #articles ) .tabContent#panelArticles>ul",
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            ".tabContainer:has( #projects ) .tabHeader label#tabProjects",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(215, 242, 250)");
        expect(
          getCSSAttr(
            ".tabContainer:has( #articles ) .tabHeader label#tabArticles",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(0, 73, 135)");

        await delay(100);
      },
    );
  });

  it("go 2: setInitState", async () => {
    const TEST_NAME = "BROWSER TEST func[1] setInitState ";
    return await wrap(
      TEST_NAME,
      "/home.html?debug=1#projects",
      async (dom, loc, win) => {
        expect(
          getCSSAttr(
            ".tabContainer:has( #projects:checked ) .tabContent#panelProjects>ul",
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        // thorough people would add a :not selector for checked, but this is a radio group so i'll skip.
        expect(
          getCSSAttr(
            ".tabContainer:has( #articles ) .tabContent#panelArticles>ul",
            "display",
            dom,
            win,
          ),
        ).toBe("none");

        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            ".tabContainer:has( #projects:checked ) label#tabProjects",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(215, 242, 250)");
        expect(
          getCSSAttr(
            ".tabContainer:has( #articles ) label#tabArticles",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(0, 73, 135)");

        const EVT1 = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: win,
        });
        // this handler is supposed to be sync
        expect(dom.querySelector("#articles").dispatchEvent(EVT1)).toBe(true);

        expect(
          getCSSAttr(
            ".tabContainer:has( #articles ) .tabContent#panelArticles>ul",
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            ".tabContainer:has( #projects ) .tabContent#panelProjects>ul",
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        expect(
          getCSSAttr(
            ".tabContainer:has( #articles ) .tabHeader label#tabArticles ",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(215, 242, 250)");
        expect(
          getCSSAttr(
            ".tabContainer:has( #projects ) .tabHeader label#tabProjects ",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(0, 73, 135)");

        await delay(100);
      },
    );
  });
});

execTest(run);
