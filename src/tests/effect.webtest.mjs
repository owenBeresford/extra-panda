import { describe, expect, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { enableGetEventListeners } from "./vitest-addons";
import { appendIsland } from "../dom-base";
import { delay } from "../networking";
import { domLog } from "../log-services";
import { TEST_ONLY } from "../effect";

const { addBashSamples } = TEST_ONLY;

function swap(strin) {
  let re = />[ \t\r\n]*</gm;
  return strin.replaceAll(re, "><").trim();
}

describe("BROWSER TEST effects ", async () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }

  it("func[1] addBashSamples", async () => {
    const TEST_NAME = "BROWSER TEST func[1] addBashSamples";
    return await wrap(
      TEST_NAME,
      "https://127.0.0.1:8081/home.html",
      async (dom, loc, win) => {
        let ADDON = "`cat /etc/SECRETS.HERE | rot13 `";
        let str1 = swap(`<div class="addBashSamples" id="testInsert">
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 / /sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">docs</a>
<p>sfs //sdfsfs sdfsdf// fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">DOCS</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
      <a id="thing2" href="sdfs df" title="sdfsdfsdf">git</a>
	<code>
		# ibble uibbile obboloe
		set val=${ADDON}
	</code>
</div>`);
        let str2 =
          '<p class="addBashSamples"> sdfsfds `gdfgdgd1dfgdfgdfgd` sdfs fsf s sfsdfsdfsdfs fsdfsdfsd `sdfsdfsdf`';
        let str3 = swap(`<div class="addBashSamples" id="testInsert">
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 / /sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
</p><p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">docs</a>
</p><p>sfs //sdfsfs sdfsdf// fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">DOCS</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
      <a id="thing2" href="sdfs df" title="sdfsdfsdf">git</a>
	<code>
		# ibble uibbile obboloe
		set val=${ADDON}
	</code>
</p><p class="addBashSamples"> sdfsfds <code class="bashSample" title="Quote from a bash; will add copy button">gdfgdgd1dfgdfgdfgd</code> sdfs fsf s sfsdfsdfsdfs fsdfsdfsd <code class="bashSample" title="Quote from a bash; will add copy button">sdfsdfsdf</code></p>
</div>`);

        appendIsland(".home.icerow", str1, dom);
        appendIsland(".home.icerow #testInsert", str2, dom);
        addBashSamples(dom);

        expect(dom.querySelector("#testInsert").outerHTML).toEqual(str3);
        await delay(500);
      },
    );
  });
});

execTest(run);
