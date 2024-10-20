import { describe, expect, it, run } from "jest-lite";

// https://tom-sherman.com/blog/running-jest-tests-in-a-browser
// https://jestjs.io/docs/next/api#describename-fn
// https://github.com/kvendrik/jest-lite
// https://blog.codepen.io/2019/07/17/jest-on-codepen/
// https://stackoverflow.com/questions/45348083/how-to-add-custom-message-to-jest-expect
//
// it would be possible to put each expect in its own try/catch,

import { page } from "./page-seed-playwright";
import { enableGetEventListeners } from "./vitest-addons";
import { TEST_ONLY } from "../modal";
import { appendIsland, isFullstack } from "../dom-base";
import { delay } from "../networking";

const { modalInit, HTMLDetailsClick, HTMLDetailsTrap } = TEST_ONLY;
let SHOULD_CLOSE = 1;

describe("BROWSER TEST modal ", () => {
  it("func[1] HTMLDetailsClick", async () => {
    const TEST_NAME = "BROWSER TEST func[1] HTMLDetailsClick";
    const [dom, loc, win] = await page("https://127.0.0.1:8081/home.html", 3);
    try {
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
      if (!isFullstack(win)) {
        console.error("This test is only for a browser");
        throw new Error("This is a browser only test");
      }
      modalInit(dom);

      let buf = dom.querySelector("details");
      if (buf === null) {
        console.log(win.TEST_TAB_NAME + " Can't access DETAILS, test borked");
        throw new Error("Test DOM broken");
      }

      expect(buf.getEventListeners().length).toBe(1); //  "Assert #1");
      expect(dom.body.getEventListeners().length).toBe(2); // "Assert #2");

      let toggle = dom.querySelector("summary");
      toggle.click();

      // I click on a SUMMARY with no CODE, the DETAILS opens   TICK
      expect(buf.open).toBe(true); //  , "Assert #3");
      toggle.click();
      // I click on a SUMMARY with no CODE and is OPEN, the DETAILS closes TICK
      expect(buf.open).toBe(false); //, "Assert #4");

      let buf2 = dom.querySelector("#outside");
      toggle.click();
      expect(buf.open).toBe(true); //  "Assert #5");
      buf2.click();
      // I click outside the DETAILS, and its open, it closes TICK
      expect(buf.open).toBe(false); //  , "Assert #6");

      toggle.click();
      let key = new KeyboardEvent("keydown", { key: "Escape", code: "Escape" });
      dom.body.dispatchEvent(key);
      // key = new KeyboardEvent("keydown", { key: "Edfgdfgdfe", code:"Edfgdfgdfge", keyIdentifier:"Edfgdfgdfge" });
      await delay(500);
      // I fire a ESC key sequence with an DETAILS in open state, it closes
      expect(buf.open).toBe(false); //  , "Assert #7");
      if (SHOULD_CLOSE) {
        win.close();
      }
      writeLog(win.TEST_TAB_NAME + " " + TEST_NAME + " [PASS]", false, false);
    } catch (e) {
      writeLog(
        win.TEST_TAB_NAME + " see console for error details",
        false,
        false,
      );
      console.log(
        win.TEST_TAB_NAME + " ERROR TRAPT ",
        e.message,
        "\n",
        e.stack,
      );
      if (SHOULD_CLOSE) {
        win.close();
      }
    }
  });

  it("func[1.2] HTMLDetailsClick", async () => {
    const TEST_NAME = "BROWSER TEST func[1.2] HTMLDetailsClick";
    const [dom, loc, win] = await page("https://127.0.0.1:8081/home.html", 3);
    try {
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
      if (!isFullstack(win)) {
        console.error(win.TEST_TAB_NAME + " This test is only for a browser");
        throw new Error("This is a browser only test");
      }
      modalInit(dom);

      let buf = dom.querySelector("details");
      if (buf === null) {
        console.log(win.TEST_TAB_NAME + " Can't access DETAILS, test borked");
        throw new Error("Test DOM broken");
      }
      console.log("THING 1::", buf.getEventListeners().length);
      expect(buf.getEventListeners().length).toBe(1); //  "Assert #1");
      console.log("THING 2::", dom.body.getEventListeners().length);
      expect(dom.body.getEventListeners().length).toBe(2); // "Assert #2");
      expect(buf.open).toBe(true);

      let toggle = dom.querySelector("summary");
      toggle.click();

      // I click on a SUMMARY with no CODE, the DETAILS opens   TICK
      expect(buf.open).toBe(); //  , "Assert #3");
      toggle.click();
      // I click on a SUMMARY with no CODE and is OPEN, the DETAILS closes TICK
      expect(buf.open).toBe(false); //, "Assert #4");

      let buf2 = dom.querySelector("#outside");
      toggle.click();
      expect(buf.open).toBe(true); //  "Assert #5");
      buf2.click();
      // I click outside the DETAILS, and its open, it closes TICK
      expect(buf.open).toBe(false); //  , "Assert #6");

      toggle.click();
      let key = new KeyboardEvent("keydown", { key: "Escape", code: "Escape" });
      dom.body.dispatchEvent(key);
      await delay(500);
      // I fire a ESC key sequence with an DETAILS in open state, it closes
      expect(buf.open).toBe(false); //  , "Assert #7");
      if (SHOULD_CLOSE) {
        win.close();
      }
      writeLog(win.TEST_TAB_NAME + " " + TEST_NAME + " [PASS]", false, false);
    } catch (e) {
      writeLog(
        win.TEST_TAB_NAME + " see console for error details",
        false,
        false,
      );
      console.log(
        win.TEST_TAB_NAME + " ERROR TRAPT ",
        e.message,
        "\n",
        e.stack,
      );
      if (SHOULD_CLOSE) {
        win.close();
      }
    }
  });

  it("func[1.1]: HTMLDetailsClick", async () => {
    const TEST_NAME = "BROWSER TEST func[1.1]: HTMLDetailsClick";
    const [dom, loc, win] = await page("https://127.0.0.1:8081/home.html", 3);
    try {
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
      if (!isFullstack(win)) {
        console.error(win.TEST_TAB_NAME + "This test is only for a browser");
        throw new Error("browser only test");
      }
      modalInit(dom);

      let buf = dom.querySelector("details");
      expect(buf.getEventListeners().length).toBe(1); // "Assert #8");
      expect(dom.body.getEventListeners().length).toBe(2); // "Assert #9");

      let toggle = dom.querySelector("summary");
      toggle.click();
      // I click on a SUMMARY with CODE, the DETAILS opens   TICK
      expect(buf.open).toBe(true); // "Assert #10");
      toggle.click();
      // I click on a SUMMARY with CODE and is OPEN, it doesnt close so people can interact with the CODE sample
      expect(buf.open).toBe(true); // "Assert #11");

      let buf2 = dom.querySelector("#outside");
      buf2.click();
      // I click outside the DETAILS, and its open, it closes TICK
      expect(buf.open).toBe(false); // "Assert #13");
      toggle.click();

      let key = new KeyboardEvent("keydown", { key: "Escape", code: "Escape" });
      dom.body.dispatchEvent(key);
      // I fire a ESC key sequence with an DETAILS in open state, it closes
      expect(buf.open).toBe(false); // "Assert #14");
      if (SHOULD_CLOSE) {
        win.close();
      }
      writeLog(win.TEST_TAB_NAME + " " + TEST_NAME + " [PASS]", false, false);
    } catch (e) {
      writeLog(
        win.TEST_TAB_NAME + " see console for error details",
        false,
        false,
      );
      console.log(
        win.TEST_TAB_NAME + " ERROR TRAPT ",
        e.message,
        "\n",
        e.stack,
      );
      if (SHOULD_CLOSE) {
        win.close();
      }
    }
  });
});

{
  const tt = new URLSearchParams(location.search);
  if (tt.has("close") && tt.get("close") === "0") {
    writeLog("browser tabs will NOT auto-close", false, false);
    SHOULD_CLOSE = 0;
  } else {
    writeLog("browser tabs should auto-close", false, false);
  }
}
const ret = await run();
ret.push([{ name: "BROWSER TEST modal", last: true }]);
appendIsland("#binLog", JSON.stringify(ret), document);
