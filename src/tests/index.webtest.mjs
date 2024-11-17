import { describe, expect, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";

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
});

execTest(run);
