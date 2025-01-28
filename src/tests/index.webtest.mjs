import { describe, expect, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { createKeyEvent } from "./vitest-addons";
import { TEST_ONLY } from "../networking";

const { getLogCounter } = TEST_ONLY;

describe("BROWSER TEST index ", async () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }

  it("func[1] index", async () => {
    const TEST_NAME = "BROWSER TEST func[1] index";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (document, location, window) => {
        // this is just a test to report compile failures induced by file renaming,
        // and issues like that.
        const ALL = await import("../index");
        console.log(
          "Have I loaded a module correctly [seeing message means it didnt crash]?",
          ALL,
        );
        //    If it get this far, it works
        expect(typeof ALL).toBe("object");
      },
    );
  });

  // The point of this test simulates the user action, so looking at event creation rather than code logic
  it("func[2] select word count feature", async () => {
    const TEST_NAME = "BROWSER TEST func[1] word count";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html?select=1",
      async (dom, loc, win) => {
        let range1 = new Range();
        range1.setStart(dom.querySelector("article p:first-child"), 0);
        range1.setEnd(dom.querySelector("article p:nth-child(4)"), 0);
        let step1 = getLogCounter();
        // this should emit 241
        dom.body.addEventListener("keydown", (e) => {
          win.console.log("[TEST SCRIPT] Have keyb ", e);
        });
        let tmp = createKeyEvent(
          {
            code: "KeyW",
            key: "w",
            altKey: true,
            ctrlKey: false,
            shiftKey: false,
          },
          dom.body,
          win,
        );
        expect(win.fireKeybEvent(tmp)).toBe(true);
        /// will return false if cancellable, and has been,  otherwise true
        //		expect( dom.body.dispatchEvent(tmp) ).toBe(true);
        //		win.dispatchEvent(tmp);
        let step2 = getLogCounter();
        win.console.log(
          "TEST MESSAGE (test script to child PID code-under-test)",
        );

        expect(step2 - step1).toBe(1);
      },
    );
  });
});

execTest(run);
