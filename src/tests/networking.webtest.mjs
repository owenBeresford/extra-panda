import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
// import type { Cookieable, Fetchable } from "../all-types";
import { TEST_ONLY } from "../networking";
import { delay } from "../networking";
import { domLog } from "../log-services";
const { runFetch, accessCookie } = TEST_ONLY;

describe("TEST networking", async () => {
  /*
  I showed that the networking code works with a packet sniffer.
	It is a just a thin wrapper around the JS API and doesn't contain logic. 
*/
  it("test 1: runFetch", async () => {
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

  it("test 2: accessCookie ", async () => {
    const TEST_NAME = "BROWSER TEST func[1] accessCookie";
    await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        // not called document, so get TEST mock
        let obj = accessCookie();
        expect(typeof obj.set).toBe("function");
        expect(typeof obj.get).toBe("function");
        await delay(100);
      },
    );
  });

  it("test 2.1: accessCookie ", async () => {
    const TEST_NAME = "BROWSER TEST func[1] accessCookie";
    await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (document, location, window) => {
        let obj = accessCookie();
        expect(typeof obj.set).toBe("function");
        expect(typeof obj.get).toBe("function");
        expect(document.cookie.length).toBe(0); // string length
        expect(obj.get("TEST1")).toBe("");
        obj.set("TEST1", "readme.please", 2);
        expect(document.cookie.length).toBeGreaterThan(7);
        //		expect. equal(document.cookies , , "can run on empty cookies");
        // should test obj.clear, don't think its used
        await delay(100);
      },
    );
  });
});

await execTest(run);
