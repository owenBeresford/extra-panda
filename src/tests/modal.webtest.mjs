import { describe, expect, it, run } from "jest-lite";

// https://tom-sherman.com/blog/running-jest-tests-in-a-browser
// https://jestjs.io/docs/next/api#describename-fn
// https://github.com/kvendrik/jest-lite
// https://blog.codepen.io/2019/07/17/jest-on-codepen/

import { page } from "./page-seed-playwright";
import { enableGetEventListeners } from "./vitest-addons";
import { TEST_ONLY } from "../modal";
import { appendIsland, isFullstack } from "../dom-base";
import { delay } from '../networking';

const { modalInit, HTMLDetailsClick, HTMLDetailsTrap } = TEST_ONLY;

describe("TEST modal ", () => {
  it("go 1: HTMLDetailsClick", async ( ) => {
    try {
      const [dom, loc, win] = await page("https://127.0.0.1:8081/home.html", 3);
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
		if(buf === null ) {
			console.log("Can't access DETAILS, test borked");
			throw new Error("Test DOM broken");
		}

      expect(buf.getEventListeners().length).toBe( 1); //  "Assert #1");
      expect(dom.body.getEventListeners().length).toBe( 2); // "Assert #2");

      let toggle = dom.querySelector("summary");
      toggle.click();

      // I click on a SUMMARY with no CODE, the DETAILS opens   TICK
      expect( buf.open ).toBe(true ); //  , "Assert #3");
      toggle.click();
      // I click on a SUMMARY with no CODE and is OPEN, the DETAILS closes TICK
      expect( buf.open ).toBe(false);  //, "Assert #4");

      let buf2 = dom.querySelector("#outside");
      toggle.click();
		expect( buf.open ).toBe(true); //  "Assert #5");
      buf2.click();
      // I click outside the DETAILS, and its open, it closes TICK
      expect( buf.open ).toBe(false); //  , "Assert #6");

      toggle.click();
      let key = new KeyboardEvent("keydown", { key: "Escape", code:"Escape", keyIdentifier:"Escape" });
      dom.body.dispatchEvent(key);
// key = new KeyboardEvent("keydown", { key: "Edfgdfgdfe", code:"Edfgdfgdfge", keyIdentifier:"Edfgdfgdfge" });
		await delay(500);
      // I fire a ESC key sequence with an DETAILS in open state, it closes
      expect( buf.open ).toBe(false); //  , "Assert #7");
		win.close();

    } catch (e) {
      console.log("ERROR TRAPT ", e.message, e.stack);
		win.close();
    }
  });

  it("go 1.1: HTMLDetailsClick", ( ) => {
    const [dom, loc, win] = page("https://127.0.0.1:8081/home.html", 3);
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
      console.error("This test is only for a browser");
      throw new Error("browser only test");
    }
    modalInit(dom);

    let buf = dom.querySelector("details");
    assert.equal(buf.getEventListeners().length, 1, "Assert #8");
    assert.equal(dom.body.getEventListeners().length, 2, "Assert #9");

    let toggle = dom.querySelector("summary");
    toggle.click();
    // I click on a SUMMARY with CODE, the DETAILS opens   TICK
    assert.equal("true", buf.getAttribute("open"), "Assert #10");
    toggle.click();
    // I click on a SUMMARY with CODE and is OPEN, it doesnt close so people can interact with the CODE sample
    assert.equal("true", buf.getAttribute("open"), "Assert #11");

    let buf2 = dom.querySelector("#outside");
    buf2.click();
    // I click outside the DETAILS, and its open, it closes TICK
    assert.equal("", buf.getAttribute("open"), "Assert #13");

    toggle.click();
    let key = new KeyboardEvent("keypress", { key: "Escape" });
    dom.dispatchEvent(key);
    // I fire a ESC key sequence with an DETAILS in open state, it closes
    assert.equal("", buf.getAttribute("open"), "Assert #14");
  });

});

const result = await run();
console.log(result);
for(let i in result) {
	writeLog("TEST "+result[i].testPath[2]+" ["+result[i].status+"]", false, false);
}

