import { describe, expect, it, run } from "jest-lite";

// https://tom-sherman.com/blog/running-jest-tests-in-a-browser
// https://jestjs.io/docs/next/api#describename-fn
// https://github.com/kvendrik/jest-lite
// https://blog.codepen.io/2019/07/17/jest-on-codepen/
// want this to improve output::
// https://stackoverflow.com/questions/45348083/how-to-add-custom-message-to-jest-expect
//
// it would be possible to put each expect in its own try/catch,

import { execTest, wrap } from "./page-seed-playwright";
import { enableGetEventListeners } from "./vitest-addons";
import { appendIsland } from "../dom-base";
import { delay, } from "../networking";
import { domLog } from "../log-services";
import { TEST_ONLY } from "../modal";

const { modalInit } = TEST_ONLY;

describe("BROWSER TEST modal ", async () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }

  it("func[1] HTMLDetailsClick", async () => {
    const TEST_NAME = "BROWSER TEST func[1] HTMLDetailsClick";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        enableGetEventListeners(dom);
        let str = `
<div class="blocker popOverWidget">
<details class="singlePopup">
<summary> <picture> <img title="CCCCccEMO" src="/asdfsdfsdf" width="500" height="375" /> </picture> </summary>
<p>This bit does feel like a childs homework, but here is a larger image. sdfsdfsfsdf
 <img title="sdfs fsdf sdf sdfsdf sdfs dfsdf sdf ." src="/asdfsdfs dfsd f" width="2048" height="1536" loading="lazy" /> 
</p>
</details>
<span id="outside">CLOSE EVERYTHING</span>
</div>
`;
        appendIsland(".home.icerow", str, dom);
        modalInit(dom);

        let buf = dom.querySelector("details");
        if (buf === null) {
          domLog(
            win.TEST_TAB_NAME + " " + TEST_NAME + " Can't access DETAILS ",
            false,
            false,
          );
          //          console.log(win.TEST_TAB_NAME + " Can't access DETAILS, test borked");
          throw new Error("Test DOM broken");
        }

        expect(buf.getEventListeners().length).toBe(1); //  "Assert #1"
        expect(dom.body.getEventListeners().length).toBe(2); // "Assert #2"
        expect(buf.open).toBe(false); //  , "Assert #3"

        let toggle = dom.querySelector("summary");
        toggle.click();

        // I click on a SUMMARY with no CODE, the DETAILS opens   TICK
        expect(buf.open).toBe(true); //  , "Assert #3"
        toggle.click();
        // I click on a SUMMARY with no CODE and is OPEN, the DETAILS closes TICK
        expect(buf.open).toBe(false); //, "Assert #4"

        let buf2 = dom.querySelector("#outside");
        toggle.click();
        expect(buf.open).toBe(true); //  "Assert #5"
        buf2.click();
        // I click outside the DETAILS, and its open, it closes TICK
        expect(buf.open).toBe(false); //  , "Assert #6"

        toggle.click();
        let key = new KeyboardEvent("keydown", {
          key: "Escape",
          code: "Escape",
        });
        dom.body.dispatchEvent(key);
        await delay(500);
        // I fire a ESC key sequence with an DETAILS in open state, it closes
        expect(buf.open).toBe(false); //  , "Assert #7"
      },
    );
  });

  it("func[1.2] HTMLDetailsClick", async () => {
    const TEST_NAME = "BROWSER TEST func[1.2] HTMLDetailsClick";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        enableGetEventListeners(dom);
        let str = `
<div class="blocker popOverWidget">
<details class="singlePopup" open>
<summary> <picture> <img title="CCCCccEMO" src="/asdfsdfsdf" width="500" height="375" /> </picture> </summary>
<p>This bit does feel like a childs homework, but here is a larger image. sdfsdfsfsdf
 <img title="sdfs fsdf sdf sdfsdf sdfs dfsdf sdf ." src="/asdfsdfs dfsd f" width="2048" height="1536" loading="lazy" /> 
</p>
</details>
<span id="outside">CLOSE EVERYTHING</span>
</div>
`;
        appendIsland(".home.icerow", str, dom);
        modalInit(dom);

        let buf = dom.querySelector("details");
        if (buf === null) {
          domLog(
            win.TEST_TAB_NAME + " " + TEST_NAME + " Can't access DETAILS ",
            false,
            false,
          );
          //          console.log(win.TEST_TAB_NAME + " Can't access DETAILS, test borked");
          throw new Error("Test DOM broken");
        }
        expect(buf.getEventListeners().length).toBe(1); //  "Assert #1");
        expect(dom.body.getEventListeners().length).toBe(2); // "Assert #2");
        expect(buf.open).toBe(true);

        let toggle = dom.querySelector("summary");
        toggle.click();
        // I click on a SUMMARY with no CODE, the DETAILS opens   TICK
        expect(buf.open).toBe(false); //  , "Assert #3");

        toggle.click();
        // I click on a SUMMARY with no CODE and is OPEN, the DETAILS closes TICK
        expect(buf.open).toBe(true); //, "Assert #4");

        let buf2 = dom.querySelector("#outside");
        buf2.click();
        // I click outside the DETAILS, and its open, it closes TICK
        expect(buf.open).toBe(false); //  , "Assert #6");

        toggle.click();
        let key = new KeyboardEvent("keydown", {
          key: "Escape",
          code: "Escape",
        });
        dom.body.dispatchEvent(key);
        await delay(500);
        // I fire a ESC key sequence with an DETAILS in open state, it closes
        expect(buf.open).toBe(false); //  , "Assert #7");
      },
    );
  });

  it("func[1.1]: HTMLDetailsClick", async () => {
    const TEST_NAME = "BROWSER TEST func[1.1]: HTMLDetailsClick";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        enableGetEventListeners(dom);
        let str = `
<div class="blocker popOverWidget">
<details class="singlePopup">
<summary> TEST THIS!!!!!1 </summary>
<code lang="typescript" class="highlight">
window.alert("SDFSDFSDF SDFSDFSDF");
</code>
</details>
<span id="outside">CLOSE EVERYTHING</span>
</div>
`;
        appendIsland(".home.icerow", str, dom);
        modalInit(dom);

        let buf = dom.querySelector("details");
        expect(buf.getEventListeners().length).toBe(1); // "Assert #8");
        expect(dom.body.getEventListeners().length).toBe(2); // "Assert #9");

        let toggle = dom.querySelector("summary");
        toggle.click();
        // I click on a SUMMARY with CODE, the DETAILS opens   TICK
        expect(buf.open).toBe(true); // "Assert #10");
        toggle.click();
        // I click on a SUMMARY with CODE and is OPEN, it doesn't close so people can interact with the CODE sample
        expect(buf.open).toBe(false); // "Assert #11");
        toggle.click();

        let buf2 = dom.querySelector("#outside");
        buf2.click();
        // I click outside the DETAILS, and its open, it closes TICK
        expect(buf.open).toBe(false); // "Assert #13");
        toggle.click();
        expect(buf.open).toBe(true);

        let key = new KeyboardEvent("keydown", {
          key: "Escape",
          code: "Escape",
        });
        dom.body.dispatchEvent(key);
        await delay(500);
        // I fire a ESC key sequence with an DETAILS in open state, it closes
        expect(buf.open).toBe(false); // "Assert #14");
      },
    );
  });
});

execTest(run);
