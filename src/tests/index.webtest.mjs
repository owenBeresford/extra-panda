import { describe, expect, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { createKeyEvent } from "./vitest-addons";
import { TEST_ONLY } from '../networking';

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
        console.log(ALL);
        //    If it get this far, it works
        expect(typeof ALL).toBe("object");
        //    assert.equal(typeof ALL, "object", "assert #1");
      },
    );
  });

  // The point of this test simulates the user action, so looking at event creation rather than code logic
  it("func[2] select word count feature", async () => {
    const TEST_NAME = "BROWSER TEST func[1] word count";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html?select=1",
      async (document, location, window) => {
        let range1 = new Range();
        range1.setStart(document.querySelector("article p:first-child"), 5);
        range1.setEnd(document.querySelector("article p:nth-child(4)"), 5);
        let step1 = getLogCounter();
        createKeyEvent({ code: "w", altKey: true, ctrl: false, aftKey: false });
        let step2 = getLogCounter();

        expect(step2 - step1).toBe(1);
      },
    );
  });
});

execTest(run);
