import { assert, describe, it } from "vitest";

import { page } from "./page-seed";
import { TEST_ONLY } from "../modal";
import { enableGetEventListeners } from "./vitest-addons";
import { appendIsland, isFullstack } from "../dom-base";

const { modalInit, HTMLDetailsClick, HTMLDetailsTrap } = TEST_ONLY;

describe("TEST modal ", () => {
  it("go 1: HTMLDetailsClick", (context) => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
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
    appendIsland("#point2", str, dom);
    modalInit(dom);

    let buf = dom.querySelector("details");
    assert.equal(buf.getEventListeners().length, 1, "Assert #1");
    assert.equal(dom.body.getEventListeners().length, 2, "Assert #2");

    if (!isFullstack(win)) {
      context.skip();
    }

    let toggle = dom.querySelector("summary");
    toggle.click();
    // I click on a SUMMARY with no CODE, the DETAILS opens   TICK
    assert.equal("true", buf.getAttribute("open"), "Assert #3");
    toggle.click();
    // I click on a SUMMARY with no CODE and is OPEN, the DETAILS closes TICK
    assert.equal("", buf.getAttribute("open"), "Assert #4");

    let buf2 = dom.querySelector("#outside");
    toggle.click();
    assert.equal("true", buf.getAttribute("open"), "Assert #5");
    buf2.click();
    // I click outside the DETAILS, and its open, it closes TICK
    assert.equal("", buf.getAttribute("open"), "Assert #6");

    toggle.click();
    let key = new KeyboardEvent("keypress", { key: "Escape" });
    dom.dispatchEvent(key);
    // I fire a ESC key sequence with an DETAILS in open state, it closes
    assert.equal("", buf.getAttribute("open"), "Assert #7");
  });

  it("go 1.1: HTMLDetailsClick", (context) => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
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
    appendIsland("#point2", str, dom);
    modalInit(dom);

    let buf = dom.querySelector("details");
    assert.equal(buf.getEventListeners().length, 1, "Assert #8");
    assert.equal(dom.body.getEventListeners().length, 2, "Assert #9");

    if (!isFullstack(win)) {
      context.skip();
    }

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
