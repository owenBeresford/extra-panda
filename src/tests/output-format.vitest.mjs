import { assert, describe, it, expect } from "vitest";

import { page } from "./page-seed-vite";
import { TEST_ONLY } from "../extractor/output-formats";

const { hash2CSSblock, hash2CSS, hash2json, output } = TEST_ONLY;

describe("TEST generate CSS ", () => {
  it("go 1: hash2CSS", () => {
    // im not validating the data in, as its come from a live webpage
    let SRC = { font: '"jibber, jabber"', "font-size": "0.8em" };
    //  ".test1 { font: "jibber, jabber"; font-size: 0.8em; }"

    let DST = `.test1 { font:"jibber, jabber"; font-size:0.8em; }`;
    assert.equal(hash2CSS(".test1", SRC), DST, "bullet #1");

    SRC = {
      font: '"jibber, jabber2"',
      "font-size": "0.8em",
      font: '"jibber, jabber2"',
    };
    DST = `.test1 { font:"jibber, jabber2"; font-size:0.8em; }`;
    assert.equal(hash2CSS(".test1", SRC), DST, "bullet #2");

    SRC = { font: '"jibber, jabber"', "font-size": "0.8em" };
    DST = `p { font:"jibber, jabber"; font-size:0.8em; }`;
    assert.equal(hash2CSS("p", SRC), DST, "bullet #3");

    SRC = {
      font: '"jibber, jabber"',
      "font-size": "0.8em",
      "margin-left": 10e5,
      "margin-right": 10e99,
    };
    DST = `p { font:"jibber, jabber"; font-size:0.8em; margin-left:1000000; margin-right:1e+100; }`;
    assert.equal(hash2CSS("p", SRC), DST, "bullet #4");
  });

  it("go 2: hash2json", () => {
    let SRC = { font: '"jibber, jabber"', "font-size": "0.8em" };
    let DST = `{"font":"\\"jibber, jabber\\"","font-size":"0.8em"}`;
    assert.equal(hash2json(SRC), DST, "bullet #5");

    SRC = {
      font: '"jibber, jabber2"',
      "font-size": "0.8em",
      font: '"jibber, jabber"',
    };
    DST = `{"font":"\\"jibber, jabber\\"","font-size":"0.8em"}`;
    assert.equal(hash2json(SRC), DST, "bullet #6");

    SRC = {
      font: '"jibber, jabber"',
      "font-size": "0.8em",
      "margin-left": 10e5,
      "margin-right": 10e99,
    };
    DST = `{"font":"\\"jibber, jabber\\"","font-size":"0.8em","margin-left":1000000,"margin-right":1e+100}`;
    assert.equal(hash2json(SRC), DST, "bullet #7");
  });

  it("go 3: hash2CSSblock ", () => {
    const SRC = {
      ".first": { font: '"jibber, jabber"', "font-size": "0.8em" },
      ".second": {
        color: "green",
        font: '"jibber, jabber"',
        background: "red",
      },
    };
    const DST = `@media screen and (min-resolution:100dpi) {.first { font:"jibber, jabber"; font-size:0.8em; }.second { color:green; font:"jibber, jabber"; background:red; }}`;
    assert.equal(
      hash2CSSblock(SRC, "(min-resolution:100dpi)"),
      DST,
      "bullet #8",
    );

    // IOIO add more here
  });

  it("go 4: output ", (cnxt) => {
    cnxt.skip();
  });
});
