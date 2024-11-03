import { assert, describe, it, run } from "jest-lite";
import jest from "jest-lite";

import { page, execTest, wrap } from "./page-seed-playwright";
// import { Cookieable } from "../all-types";
import { isFullstack } from "../dom-base";
import { TEST_ONLY } from "../cookies";

const { QOOKIE, storeAppearance, applyAppearance } = TEST_ONLY;

describe("TEST cookies", () => {
  //  it("go 1: getCookie ", () => // There is no point in checking "is a class a class"

  it("go 2: storeAppearance ", async (context) => {
    const TEST_NAME = "BROWSER TEST func[1] storeAppearance";

    await wrap(TEST_NAME, "https://127.0.0.1:8081/home.html", (dom, loc, win) => {
      dom.cookies = "";
      storeAppearances("serif", "14", "ltr", "blue");
      expect(dom.cookies).isNot("");
      console.log("Extend this cookie test ", dom.cookie);
    });
  });

  it("go 3: applyAppearance ", async (context) => {
    const TEST_NAME = "BROWSER TEST func[1] applyAppearance";
    await wrap(TEST_NAME, "https://127.0.0.1:8081/home.html", (dom, loc, win) => {
      let tmp = JSON.stringify({
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
    });
  });
});

execTest(run);
