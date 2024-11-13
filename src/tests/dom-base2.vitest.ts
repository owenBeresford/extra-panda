import { assert, describe, it, assertType } from "vitest";

import { TEST_ONLY } from "../dom-base";
const {
  currentSize,
} = TEST_ONLY;

describe("TEST dom-base", () => {
  it("go 1: currentSize", (context) => {
    if (process && process.env) {
      context.skip();
    }
    assertType<Array<number>>(currentSize(), "assert #1");
    // i could set window size then look at it,
    // but this needs a env test and compat test, not a logic test
    assert.isTrue(Array.isArray(currentSize()), "got an array back, assert #2");
  });

});


