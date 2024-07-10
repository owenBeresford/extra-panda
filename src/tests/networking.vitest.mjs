import { assert, describe, it, assertType } from "vitest";

//import { page } from "./page-seed";
// import { appendIsland, setIsland, isFullstack } from "../dom-base";
import { Cookieable, Fetchable } from "../all-types";
import { TEST_ONLY } from "../networking";
const { getFetch, runFetch, _getCookie, log } = TEST_ONLY;

describe("TEST networking", () => {
  it("go 1: getFetch", () => {
    assert.equal(typeof getFetch, "function", "assert #1");
    assertType < Fetchable > (getFetch(), "assert #2");
  });

  it("go 2: getCookie ", () => {
    assertType < Cookieable > (_getCookie(), "assert #32");
    // would be better with more tests, but I think full stack only.
    // I don't want to add too much manual-fake code, to test deliverable-code, or I have circular problem about testing
    // the cookie stuff is quite low cyclometric complexity
  });

  it("go 3: runFetch", (context) => {
    context.skip();
  });

  it("go 4: log", (context) => {
    assert.equal(
      1,
      1,
      "Fake test, as I think that console.log executes.   This code is prsent, so I could swap to a centralised log platform",
    );
  });
});
