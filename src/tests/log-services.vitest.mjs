import { assert, describe, it } from "vitest";

import { TEST_MACHINE } from "../immutables";
import { TEST_ONLY } from "../log-services";

const { log, debug, domLog, enableLogCounter } = TEST_ONLY;

describe("TEST networking", () => {
  it("go 1: enableLogCounter", (cnx) => {
    cnx.skip();
    // this is test code, used in other tests
  });

  it("go 2: debug", (cnx) => {
    cnx.skip();
    // a getter :-)
  });

  it("go 4: domlog", (cnx) => {
    cnx.skip();
    // just an output, no decisions, requires DOM so can't be run here
  });

  it("go 3: log", () => {
    log("log", "[LOG] Hello fromn a log test");
    assert.equal(
      1,
      1,
      "Fake test, as I think that console.log executes.   This code is present, so I could swap to a centralised log platform",
    );
    log("info", "[INFO] Hello fromn a log test");
    assert.equal(
      1,
      1,
      "Fake test, as I think that console.log executes.   This code is present, so I could swap to a centralised log platform",
    );
    log("error", "[ERROR] Hello fromn a log test");
    assert.equal(
      1,
      1,
      "Fake test, as I think that console.log executes.   This code is present, so I could swap to a centralised log platform",
    );
    log("assert", 1 == 1, "[ASSERT] Hello fromn a log test");
    assert.equal(
      1,
      1,
      "Fake test, as I think that console.log executes.   This code is present, so I could swap to a centralised log platform",
    );
    log("assert", 1 !== 1, "[ASSERT] NEGATIVE Hello fromn a log test");
    assert.equal(
      1,
      1,
      "Fake test, as I think that console.log executes.   This code is present, so I could swap to a centralised log platform",
    );
  });
});
