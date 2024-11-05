import { assert, describe, it, assertType } from "vitest";

import { execTest, wrap } from "./page-seed-playwright";
import { Cookieable, Fetchable } from "../all-types";
import { TEST_ONLY } from "../networking";
import { delay, domLog } from "../networking";
const { runFetch } = TEST_ONLY;

describe("TEST networking", async () => {
  /*
  I showed that the networking code works with a packet sniffer.
	It is a just a thin wrapper around the JS API and doesn't contain logic. 
*/
  it("go 3: runFetch", async () => {
    const TEST_NAME = "BROWSER TEST func[1] runfetch";
    await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        runFetch(); // IOIO KLAXOON KLAXOON add test here

        await delay(100);
      },
    );
  });
});
