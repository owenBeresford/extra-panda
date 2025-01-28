import { assert, describe, it } from "vitest";

import { page } from "./page-seed-vite";
import { TEST_ONLY } from "../mastodon";
import { appendIsland, isFullstack } from "../dom-base";
import { enableGetEventListeners, createEvent } from "./vitest-addons";

const {
  shareMastodon,
  _map4,
  closeMastodon,
  openMastodon,
  initMastodon,
  accessVisibility,
  openShare,
} = TEST_ONLY;

describe("TEST mastodon", () => {
  it("go 1: openShare", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/home?mobile=1",
      3,
    );
    let str = `<div id="shareMenu" class="shareMenu"></div>`;
    appendIsland("#point2", str, dom);

    let vnt = createEvent(dom.querySelector("#shareMenu"), dom, win);
    assert.equal(
      dom.querySelector("#shareMenu").getAttribute("class"),
      "shareMenu",
      "assert #1",
    );
    assert.equal(openShare(vnt, dom, loc), false, "assert #2");
    assert.equal(
      dom.querySelector("#shareMenu").getAttribute("class"),
      "shareMenuOpen",
      "assert #3",
    );
    assert.equal(openShare(vnt, dom, loc), false, "assert #4");
    assert.equal(
      dom.querySelector("#shareMenu").getAttribute("class"),
      "shareMenu",
      "assert #5",
    );
  });

  it("go 1.1: openShare", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.66/resource/home?mobile=1",
      3,
    );
    let str = `<div id="shareMenu" class="shareMenu">
</div> `;
    appendIsland("#point2", str, dom);
    let vnt = createEvent(dom.querySelector("#shareMenu"), dom, win);

    assert.equal(
      dom.querySelector("#shareMenu").getAttribute("class"),
      "shareMenu",
      "assert #6",
    );
    assert.equal(openShare(vnt, dom, loc), false, "assert #2");
    assert.equal(
      dom.querySelector("#shareMenu").getAttribute("class"),
      "shareMenuOpen",
      "assert #7",
    );
  });

  it("go 2: shareMastodon", () => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
    let str = `<div id="shareMenu" class="shareMenu"> </div> 
	<dialog id="popup">
	<input id="id1" type="submit" value="Post now" />
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog>`;
    appendIsland("#point2", str, dom);
    let vnt = createEvent(dom.querySelector("#id1"), dom, win);
    assert.throws(
      () => {
        shareMastodon(vnt, dom, loc, win);
      },
      /Test passed,/,
      "assrt #8",
    );
  });

  it("go 2.1: shareMastodon", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/home?mobile=1",
      3,
    );
    let str = `<div id="shareMenu" class="shareMenu"> </div> 
	<dialog id="popup">
	<input id="id1" type="submit" value="Post now" />
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?mobile=1" /> 
	</dialog>`;
    appendIsland("#point2", str, dom);

    let vnt = createEvent(dom.querySelector("#id1"), dom, win);
    assert.throws(
      () => {
        shareMastodon(vnt, dom, loc, win);
      },
      /Test passed,/,
      "assrt #9",
    );
  });

  it("go 3: openMastodon", () => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
    let str = `<div id="shareMenu" class="shareMenu"> </div> 
	<dialog id="popup">
	<input id="id1" type="submit" value="Post now" />
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog>`;
    appendIsland("#point2", str, dom);

    let vnt = createEvent(dom.querySelector("#id1"), dom, win);
    assert.equal(openMastodon(vnt, dom, win), false, "assert #10");
    if (isFullstack(win)) {
      assert.istrue(
        typeof dom.querySelector("#popup").getAttribute("open") !== "undefined",
        "assert #11",
      );
    }
  });

  it("go 4: closeMastodon", () => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
    let str = `<div id="shareMenu" class="shareMenu"> </div> 
	<dialog id="popup" open>
	<input id="id1" type="submit" value="Post now" />
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog>`;
    appendIsland("#point2", str, dom);

    let vnt = createEvent(dom.querySelector("#id1"), dom, win);
    assert.equal(closeMastodon(vnt, dom, win), false, "assert #12");
    if (isFullstack(win)) {
      assert.istrue(
        typeof dom.querySelector("#popup").getAttribute("open") === "undefined",
        "assert #13",
      );
    }
  });

  it("go 6:  accessVisibility", (context) => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
    if (!isFullstack(win)) {
      context.skip();
    }
    let str = `<div id="shareMenu" class="shareMenu"> </div> 
	<dialog id="popup" open>
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog>`;
    appendIsland("#point2", str, dom);
    let buf = dom.querySelector("#popup");
    assert.equal(accessVisibility(buf, "display", win), "block", "assert #16");
  });

  it("go 6.1: accessVisibility", (context) => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
    if (!isFullstack(win)) {
      context.skip();
    }

    let str = `<div id="shareMenu" class="shareMenu"> </div> 
	<dialog id="popup" >
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog>`;
    appendIsland("#point2", str, dom);
    let buf = dom.querySelector("#popup");
    assert.equal(accessVisibility(buf, "display", win), "block", "assert #17");
  });

  it("go 7: _map4", () => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
    let str = `<div id="shareMenu" class="shareMenu"> </div> 
	<dialog id="popup" >
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog>`;
    appendIsland("#point2", str, dom);

    enableGetEventListeners(dom);
    let buf = dom.querySelector("#popup");
    // using lamda func to ensure each one is separate
    assert.equal(
      _map4(
        buf,
        (e, f) => {
          console.log("THING HAPPENED to " + e.target.id, f);
        },
        dom,
        loc,
        win,
      ),
      undefined,
      "assert #18",
    );

    assert.isTrue(
      typeof buf.getEventListeners === "function",
      "Can I snoop event handlers?   Assert #19",
    );
    assert.equal(buf.getEventListeners().length, 3, "Assert #20");

    assert.equal(buf.getEventListeners("click").length, 1, "Assert #21");
    assert.equal(buf.getEventListeners("touch").length, 1, "Assert #22");
  });

  it("go 8: initMastodon", () => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home?mobile=0", 3);
	let str = `<nav id="navBar">
	<div id="shareGroup"> 
	<div id="shareMenu" class="shareMenu allButtons">
		<span class="shareMenutrigger">BTN[1]</span>  
 		<span id="mastoTrigger">BTN[2]</span>  
	</div> 
	<div id="shareMenuTrigger"> 
		<span id="shareClose">BTN[4]</span>  
		<span id="copyURL">BTN[3]</span>  
	</div>
	<dialog id="popup">
	<span id="sendMasto">TICK</span> <span id="hideMasto">CROSS</span>
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog> 
	</div></nav>`;

    appendIsland("#point2", str, dom);
    enableGetEventListeners(dom);
    initMastodon(dom, loc, win);

    let buf = dom.querySelector("#sendMasto");
    assert.equal(buf.getEventListeners().length, 3, "Assert #23");
    buf = dom.querySelector("#hideMasto");
    assert.equal(buf.getEventListeners().length, 3, "Assert #24");
  });
});
