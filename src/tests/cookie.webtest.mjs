import { assert, describe, it, run } from "jest-lite";

import { page, execTest, wrap } from "./page-seed-playwright";
import { isFullstack } from "../dom-base";
import { delay, domLog } from "../networking";
import { TEST_ONLY } from "../cookies";

const { QOOKIE, storeAppearance, applyAppearance } = TEST_ONLY;

describe("TEST cookies", async () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }
  //  it("go 1: getCookie ", () => // There is no point in checking "is a class a class"

  it("go 2: storeAppearance ", async () => {
    const TEST_NAME = "BROWSER TEST func[1] storeAppearance";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        dom.cookies = "";
        storeAppearances("serif", "14", "ltr", "blue");
        expect(dom.cookies).isNot("");
        console.log("IOIO Extend this cookie test ", dom.cookie);
        await delay(100);
      },
    );
  });

  it("go 3: applyAppearance ", async () => {
    const TEST_NAME = "BROWSER TEST func[1] applyAppearance";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        const tmp = JSON.stringify({
          ft: "serif",
          fs: "14",
          dn: "ltr",
          cr: "blue",
        });
        dom.cookies = tmp;
        expect(dom.cookies).toEqual(tmp);
        applyAppearance(dom);

        let tmp2 = dom.getElementById("client-set-css");
        expect(tmp2).isNot(null).isNot(undefined);
        await delay(100);
      },
    );
  });
});

execTest(run);
