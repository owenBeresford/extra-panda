import { describe, it, assertType } from "vitest";

import { page } from "./page-seed-vite";
import type { Cookieable } from "../all-types";
import { isFullstack } from "../dom-base";
import { TEST_ONLY } from "../cookies";
import { TEST_MACHINE } from "../immutables";

const { QOOKIE } = TEST_ONLY;

describe("TEST cookies", () => {
  it("go 1: getCookie ", () => {
    assertType<Cookieable>(new QOOKIE(), "assert #32");
    // would be better with more tests, but I think full stack only.
    // I don't want to add too much manual-fake code, to test deliverable-code, or I have circular problem about testing
    // the cookie stuff is quite low cyclometric complexity
  });

  it("go 2: storeAppearance ", (context) => {
    const [dom, loc, win] = page(TEST_MACHINE+ "resource/home", 3);
    if (!isFullstack(win)) {
      context.skip();
    }
    // if browser look at cookies before and after
    // look at values in   dom.cookies
  });

  it("go 3: applyAppearance ", (context) => {
    const [dom, loc, win] = page(TEST_MACHINE+"resource/home", 3);
    if (!isFullstack(win)) {
      context.skip();
    }
    // if browser look at cookies before and after
    // look at values in   dom.cookies
  });
});

