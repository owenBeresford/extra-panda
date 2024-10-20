import { assert, describe, it, assertType } from "vitest";

import { Cookieable } from "../all-types";
import { TEST_ONLY } from "../cookies";
const { QOOKIE } = TEST_ONLY;

describe("TEST cookies", () => {
  it("go 1: getCookie ", () => {
    assertType < Cookieable > (new QOOKIE(), "assert #32");
    // would be better with more tests, but I think full stack only.
    // I don't want to add too much manual-fake code, to test deliverable-code, or I have circular problem about testing
    // the cookie stuff is quite low cyclometric complexity
  });
});
