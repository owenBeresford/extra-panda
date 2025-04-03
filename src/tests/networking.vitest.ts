import { assert, describe, it, assertType } from "vitest";

import type { Cookieable, Fetchable } from "../all-types";
import { TEST_ONLY } from "../networking";

const { getFetch, accessCookie, delay } = TEST_ONLY;

describe("TEST networking", () => {
  it("go 1: getFetch", () => {
    assert.equal(typeof getFetch, "function", "assert #1");
    assertType<Fetchable>(getFetch(), "assert #2");
  });

  it("go 2: accessCookie ", () => {
    // see new test in webtest unittest
    assertType<Cookieable>(accessCookie(), "assert #4");
    // would be better with more tests, but I think full stack only.
    // I don't want to add too much manual-fake code, to test deliverable-code, or I have circular problem about testing
    // the cookie stuff is quite low cyclometric complexity
  });

  it("go 3: runFetch", (context) => {
    context.skip();
  });

  it("go 5: delay", async () => {
    const d1 = new Date();
    await delay(1000);
    const d2 = new Date();

    assert.isBelow(d1.getTime() + 1000 - d2.getTime(), 10, "assert #3");
  });
});
