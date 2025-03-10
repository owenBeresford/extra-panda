import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { delay } from "../networking";
import { appendIsland } from "../dom-base";
import { log, domLog } from "../log-services";
import { createEvent, getCSSAttr } from "./vitest-addons";
import { TEST_ONLY } from "../tabs";

const { tabChange, initTabs, newInitState } = TEST_ONLY;

describe("TEST BROWSER CSS based tabs", async () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }

  it("go 1: default first state", async () => {
    const TEST_NAME = "BROWSER TEST func[1] default first state ";
    return await wrap(
      TEST_NAME,
      "/home2.html?debug=1",
      async (dom, loc, win) => {
        expect(
          getCSSAttr("fieldset:has( #articles ) ul", "display", dom, win),
        ).toBe("inline-block");
        expect(
          getCSSAttr("fieldset:has( #projects ) ul", "display", dom, win),
        ).toBe("none");
        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            "fieldset:has( #articles ) label",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(215, 242, 250)");
        expect(
          getCSSAttr(
            "fieldset:has( #projects ) label",
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
          getCSSAttr("fieldset:has( #projects ) ul", "display", dom, win),
        ).toBe("inline-block");
        expect(
          getCSSAttr("fieldset:has( #articles ) ul", "display", dom, win),
        ).toBe("none");
        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            "fieldset:has( #projects ) label",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(215, 242, 250)");
        expect(
          getCSSAttr(
            "fieldset:has( #articles ) label",
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
      "/home2.html?debug=1#projects",
      async (dom, loc, win) => {
        // in this file pay attention to HTML ids
        const [BTN2, BTN1] = dom.querySelectorAll("#btn2, #btn1");

        expect(
          getCSSAttr("fieldset:has( #projects ) ul", "display", dom, win),
        ).toBe("inline-block");
        expect(
          getCSSAttr("fieldset:has( #articles ) ul", "display", dom, win),
        ).toBe("none");
        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            "fieldset:has( #projects ) label",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(215, 242, 250)");
        expect(
          getCSSAttr(
            "fieldset:has( #articles ) label",
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
          getCSSAttr("fieldset:has( #articles ) ul", "display", dom, win),
        ).toBe("inline-block");
        expect(
          getCSSAttr("fieldset:has( #projects ) ul", "display", dom, win),
        ).toBe("none");
        expect(
          getCSSAttr(
            "fieldset:has( #articles ) label",
            "background-color",
            dom,
            win,
          ),
        ).toBe("rgb(215, 242, 250)");
        expect(
          getCSSAttr(
            "fieldset:has( #projects ) label",
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
