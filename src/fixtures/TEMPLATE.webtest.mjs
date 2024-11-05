import { assert, describe, it, run } from "jest-lite";

import { page, execTest, wrap } from "./page-seed-playwright";
import { isFullstack } from "../dom-base";
import { delay, domLog } from "../networking";
import { TEST_ONLY } from "../***MODULE_UNDER_TEST***";

// import functions from TEST_ONLY

describe("TEST ***XXXXX**", async () => {
        if (typeof process !=="undefined" ) {
			throw new Error("This is a browser only test");
        }

  it("test: XXXXX ", async () => {
    const TEST_NAME = "BROWSER TEST func[1] XXXXX";
    return await wrap(
      TEST_NAME,
// this file is included this this project
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        console.log("IOIO Implement test ");
// it is advisable to add this small wait so ytou dont need to think if other functions being tested 
// are blocking or not
      	await delay(100);
      } );
  });

  it("go 3: applyAppearance ", async () => {
// ...
  });
});

execTest(run);
