import { assert, describe, it } from "vitest";

import { page } from "./page-seed";
import { TEST_ONLY } from "../modal";
import { enableGetEventListeners } from "./vitest-addons";
import { appendIsland } from "../dom-base";

const { modalInit, HTMLDetailsClick, HTMLDetailsTrap } = TEST_ONLY;

describe("TEST modal ", () => {
  // I need to do more usability on this feature
  it("go 1: HTMLDetailsClick", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/home", 2);
    enableGetEventListeners(dom);
    let str = `
<div class="blocker popOverWidget">
<details class="singlePopup">
<summary> <picture> <img title="CCCCccEMO" src="/asdfsdfsdf" width="500" height="375" /> </picture> </summary>
<p>This bit does feel like a childs homework, but here is a larger image. sdfsdfsfsdf
 <img title="sdfs fsdf sdf sdfsdf sdfs dfsdf sdf ." src="/asdfsdfs dfsd f" width="2048" height="1536" loading="lazy" /> 
</p>
</details>
</div>
`;
    appendIsland("#point2", str, dom);
    modalInit(dom);

    let buf = dom.querySelector("details");
    assert.equal(buf.getEventListeners().length, 1, "Assert #20");
    assert.equal(dom.body.getEventListeners().length, 1, "Assert #20");
  });
});
