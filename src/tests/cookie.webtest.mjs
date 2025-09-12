import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { delay } from "../networking";
import { TEST_ONLY } from "../cookies";

const { QOOKIE, storeAppearance, applyAppearance } = TEST_ONLY;

describe("TEST cookies", async () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }
  const APPEARANCE_COOKIE = "appearance";
  //  it("go 1: getCookie ", () => // There is no point in checking "is a class a class"

  it("test: applyAppearance ", async () => {
    const TEST_NAME = "BROWSER TEST func[1] applyAppearance";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        const tmp = JSON.stringify({
          ft: "serif",
          fs: "14pt",
          dn: "ltr",
          cr: "blue",
        });
        dom.cookie = APPEARANCE_COOKIE + "=" + tmp + ";";
        expect(dom.cookie).toBe("appearance=" + tmp);
        applyAppearance(dom);

        let tmp2 = dom.getElementById("client-set-css");
        expect(tmp2).not.toBe(null);
        expect(tmp2).not.toBe(undefined);
        await delay(100);
      },
    );
  });

  it("test: storeAppearance ", async () => {
    const TEST_NAME = "BROWSER TEST func[1] storeAppearance";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        new QOOKIE().wipe(APPEARANCE_COOKIE);
        storeAppearance("ubuntu", "12pt", "ltr", "green");
        expect(dom.cookie).not.toBe("");

        const tmp = JSON.stringify({
          ft: "ubuntu",
          fs: "12pt",
          dn: "ltr",
          cr: "green",
        });
        expect(dom.cookie).toBe(APPEARANCE_COOKIE + "=" + tmp);
        dom.cookie = "";
        await delay(100);
      },
    );
  });
});

execTest(run);
