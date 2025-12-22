import { vi, assert, describe, it, assertType } from "vitest";
import { networkInterfaces } from "node:os";

import type { Cookieable, Fetchable } from "../all-types";
import { TEST_ONLY } from "../networking";
import { TEST_MACHINE } from "../immutables";
import { mapInterfaces } from "../references/networking";

const { getFetch, accessCookie, delay, runFetch } = TEST_ONLY;
vi.setConfig({ testTimeout: 0 });

describe("TEST networking", () => {
  const LAN_IP =
    "http://" + mapInterfaces(networkInterfaces())["first"][0] + "/";
  const BAD_IP = TEST_MACHINE;

  it.sequential("go 1: getFetch", () => {
    assert.equal(typeof getFetch, "function", "assert #1");
    assertType<Fetchable>(getFetch(), "assert #2");
    // didnt crash, this takes no param, so is *very* thin margin on a unit-test
  });

  it.sequential("go 2: accessCookie ", () => {
    // see new test in webtest unittest
    assertType<Cookieable>(accessCookie(), "assert #4");
    // I don't want to add too much manual-fake code, to test deliverable-code, or I have circular problem about testing
    // the cookie stuff is quite low cyclometric complexity
  });

  it.sequential("go 3: runFetch", async () => {
    let URL = LAN_IP + "resource/contact-me";
    let ret = await runFetch(URL, false, true);
    assert.equal(ret.ok, true, "assert #5");
    assert.equal(typeof ret.body, "string", "assert #6");
    assert.isAbove(ret.body.length, 100, "assert #7");
  });

  it.sequential("go 3.1: runFetch", async () => {
    let URL = LAN_IP + "resource/contact-me";
    let ret = await runFetch(URL, true, true);
    assert.equal(ret.ok, true, "assert #8");
    assert.equal(typeof ret.body, "string", "assert #9");
    assert.isAbove(ret.body.length, 100, "assert #10");
  });

  it.sequential("go 3.2: runFetch", async () => {
    let URL = BAD_IP + "resource/contact-me";
    let ret = await runFetch(URL, true, true);
    assert.equal(ret.ok, false, "assert #11");
    assert.equal(typeof ret.body, "string", "assert #12");
    assert.isBelow(ret.body.length, 100, "assert #13");
  });

  it.sequential("go 4: delay", async () => {
    console.warn("go4, DELAY: This step takes ~12s ");

    let d1 = new Date();
    await delay(1_000);
    let d2 = new Date();
    assert.isBelow(d1.getTime() + 1000 - d2.getTime(), 10, "assert #14");

    d1 = new Date();
    await delay(100);
    d2 = new Date();
    assert.isBelow(d1.getTime() + 100 - d2.getTime(), 10, "assert #14");

    d1 = new Date();
    await delay(10_000);
    d2 = new Date();
    assert.isBelow(d1.getTime() + 10_000 - d2.getTime(), 10, "assert #15");
  });
});
