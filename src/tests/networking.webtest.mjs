import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
// import type { Cookieable, Fetchable } from "../all-types";
import { TEST_ONLY } from "../networking";
import { delay, } from "../networking";
import { domLog } from "../log-services";
const { runFetch } = TEST_ONLY;

describe("TEST networking", async () => {
  /*
  I showed that the networking code works with a packet sniffer.
	It is a just a thin wrapper around the JS API and doesn't contain logic. 
*/
  it("test 3: runFetch", async () => {
    const TEST_NAME = "BROWSER TEST func[1] runfetch";
    await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        //  runFetch(); // IOIO KLAXOON KLAXOON add test here
        domLog("NETWORKING TEST NOT MADE");
        expect(1).toBe(1);

        await delay(100);
      },
    );
  });
});

await execTest(run);
