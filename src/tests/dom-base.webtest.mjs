import { assert, describe, it, run, assertType } from "jest-lite";

import { page } from "./page-seed-playwright";
import { TEST_ONLY } from "../dom-base";
const {
  appendIsland,
  setIsland,
  docOffsets,
  expandDetails,
  currentSize,
  mapAttribute,
  getArticleWidth,
  applyVolume,
  calcScreenDPI,
  screenWidth,
  isFullstack,
  copyURL,
} = TEST_ONLY;

describe("TEST dom-base", () => {
  it("go 1: currentSize", (context) => {
    const TEST_NAME = "BROWSER TEST func[1] currentSize";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    if (process && process.env) {
      context.skip();
    }
    assertType < Array < number >> (currentSize(), "assert #1");
    // i could set window size then look at it,
    // but this needs a env test and compat test, not a logic test
    assert.isTrue(Array.isArray(currentSize()), "got an array back, assert #2");
	});
  });

  it("go 2: isFullStack", (context) => {
    const TEST_NAME = "BROWSER TEST func[2] isFullstack";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

// IOIO add test here
	});
  });

  it("go 3: isMobile", (context) => {
    const TEST_NAME = "BROWSER TEST func[3] isMobile";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {
// IOIO add test here
	});
  });

  it("go 4: mapAttribute", (context) => {
    const TEST_NAME = "BROWSER TEST func[4] mapAttribute";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {
    let str = `<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>`;
    appendIsland("#point2", str, dom);

    assert.equal(
      mapAttribute(dom.querySelector("#item1"), "right", win),
      "100",
      "asset #3",
    );
    assert.equal(
      mapAttribute(dom.querySelector("#item1"), "right", win),
      100,
      "asset #4",
    );

	});
  });

  it("go 5:  copyURL ", async (context) => {
    const TEST_NAME = "BROWSER TEST func[5] copyURL";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    let str = `<div id="shareMenu" class="shareMenu"> </div> 
  <dialog id="popup" open>
  <input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
  </dialog>`;
    appendIsland("#point2", str, dom);

    assert.equal(copyURL(loc, win), undefined, "assert #14");
    if (!win.navigator.clipboard) {
      context.skip();
    }
    let tt = await win.navigator.clipboard.readText();
    assert.equal(tt, loc.url, "assert #15");

	});
  });

  it("go 6: calcScreenDPI ", async (context) => {
    const TEST_NAME = "BROWSER TEST func[6] calcScreenDPI";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {
    let str = `<div id="shareMenu" class="shareMenu"> </div> 
  <dialog id="popup" open>
  <input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
  </dialog>`;
    appendIsland("#point2", str, dom);

    // I think browser only.
    assert.equal(calcScreenDPI(dom, win), 150, "Assert #x, the screen DPI");
	});
  });

  it("go 7: screenWidth ", async (context) => {
    const TEST_NAME = "BROWSER TEST func[7] screenWidth";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    let str = `<div id="shareMenu" class="shareMenu"> </div> 
  <dialog id="popup" open>
  <input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
  </dialog>`;
    appendIsland("#point2", str, dom);
    assert.equal(screenWidth(loc, win), 150, "Assert #x,");

    // I think browser only.
    assert.equal(screenWidth(loc, win), 1800, "Assert #x, ");
	});
  });

  it("go 5: appendIsland ", () => {
    const TEST_NAME = "BROWSER TEST func[8] appendIsland";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    let str = "<h2>WWWWW WWWWW</h2>";
    appendIsland("#point1", str, dom);

    let tmp = dom.getElementsByTagName("body")[0].outerHTML;
    tmp = tmp.replace(new RegExp(">[ \\t\\n]*<", "g"), "><");
    assert.equal(
      tmp,
      `<body><div><h1>Page Title!! </h1><div class="addReading" id="shareGroup"><div class="allButtons"><span class="ultraSkinny"></span></div></div></div><div id="point1"><h2>WWWWW WWWWW</h2></div><div id="point2" class="blocker addReferences"></div></body>`,
      "assert #2",
    );
    assert.equal(dom.getElementsByTagName("h2").length, 1, "assert #5");
    appendIsland("#point1", str, dom);
    assert.equal(dom.getElementsByTagName("h2").length, 2, "assert #6");
    appendIsland("#point1", str, dom);
    assert.equal(dom.getElementsByTagName("h2").length, 3, "assert #7");
	});
  });

  it("go 6: setIsland ", () => {
    const TEST_NAME = "BROWSER TEST func[9] setIsland";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    let str = "<h2>WWWWW WWWWW</h2>";
    appendIsland("#point1", str, dom);
    let tmp = dom.getElementsByTagName("body")[0].outerHTML;
    tmp = tmp.replace(new RegExp(">[ \\t\\n]*<", "g"), "><");
    assert.equal(
      tmp,
      `<body><div><h1>Page Title!! </h1><div class="addReading" id="shareGroup"><div class="allButtons"><span class="ultraSkinny"></span></div></div></div><div id="point1"><h2>WWWWW WWWWW</h2></div><div id="point2" class="blocker addReferences"></div></body>`,
      "assert #2",
    );
    assert.equal(dom.getElementsByTagName("h2").length, 1, "assert #8");
    setIsland("#point1", str, dom);
    assert.equal(dom.getElementsByTagName("h2").length, 1, "assert #9");
    setIsland("#point1", str + str, dom);
    assert.equal(dom.getElementsByTagName("h2").length, 2, "assert #10");
    setIsland("#point1", "", dom);
    assert.equal(dom.getElementsByTagName("h2").length, 0, "assert #11");
	});
  });

  it("go 7:  docOffsets ", () => {
    const TEST_NAME = "BROWSER TEST func[10] docOffsets";
    wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    let str = `<div class="lotsOfWords">
<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
</div> `;
    appendIsland("#point2", str, dom);
    const ELE = dom.querySelector(".lotsOfWords");

    assert.deepEqual(
      [100, 0],
      docOffsets(ELE, { scrollY: 100, scrollX: 0 }),
      "assert #12",
    );
    assert.deepEqual(
      [900, 0],
      docOffsets(ELE, { scrollY: 900, scrollX: 0 }),
      "assert #13",
    );

	});
  });

  it("go 10: expandDetails", (context) => {
    const TEST_NAME = "BROWSER TEST func[11] expndDetails";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home?width=1100", async (dom, loc, win) => {
    let str = `<div class="maquetteContainer">
<details >
<summary>A title</summary>
dg dfg
d 
fgdf gds
fg ad
fg dafg
adfg
df g
dfgdfg
df gdaf
gadf
gad
 fgad
fg d
fg
dafg
da
fg
dafg
da
ga
d
</details>
</div>`;
    appendIsland("#point1", str, dom);
    assert.equal(dom.querySelector("details").open, false, "asset #14");
    expandDetails(1040, dom, loc);
    assert.equal(dom.querySelector("details").open, true, "asset #15");
	});
  });

  it("go 10.1: expandDetails", (context) => {
    const TEST_NAME = "BROWSER TEST func[12] expndDetails";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home?width=600", async (dom, loc, win) => {

    let str = `<div class="maquetteContainer">
<details >
<summary>A title</summary>
dg dfg
d 
fgdf gds
fg ad
fg dafg
adfg
df g
dfgdfg
df gdaf
gadf
gad
 fgad
fg d
fg
dafg
da
fg
dafg
da
ga
d
</details>
</div>`;
    appendIsland("#point1", str, dom);
    assert.equal(dom.querySelector("details").open, false, "asset #16");
    expandDetails(1040, dom, loc);
    assert.equal(dom.querySelector("details").open, false, "asset #16");
	});
  });

  it("go 10.2: expandDetails", (context) => {
    const TEST_NAME = "BROWSER TEST func[13] expndDetails";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home?width=1100", async (dom, loc, win) => {
    let str = `<div class="maquetteContainer">
<details class="singlePopup">
<summary>A title</summary>
dg dfg
d 
fgdf gds
fg ad
fg dafg
adfg
df g
dfgdfg
df gdaf
gadf
gad
 fgad
fg d
fg
dafg
da
fg
dafg
da
ga
d
</details>
</div>`;
    appendIsland("#point1", str, dom);
    assert.equal(dom.querySelector("details").open, false, "asset #14");
    expandDetails(1040, dom, loc);
    assert.equal(dom.querySelector("details").open, false, "asset #15");
	});
  });

  it("go 8: applyVolume", (context) => {
    const TEST_NAME = "BROWSER TEST func[14] expndDetails";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

    let str = `<div class="lotsOfWords">
<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
</div> `;
    appendIsland("#point2", str, dom);
    applyVolume(dom, win);
    assert.equal(
      dom.querySelector("body").getAttribute("style"),
      "--offset-height: 0;",
      "asset #17",
    );
    if (!isFullstack(win)) {
      context.skip();
      return;
    }

    assert.equal(
      dom.querySelector(".lotsOfWords").getAttribute("style"),
      "--offset-height: XXpx;",
      "asset #18",
    );
	});
  });

  it("go 8.1: applyVolume", (context) => {
    const TEST_NAME = "BROWSER TEST func[15] expndDetails";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

    let str = `<div class="halferWords">
<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
</div> `;
    appendIsland("#point2", str, dom);
    applyVolume(dom, win);
    assert.equal(
      dom.querySelector("body").getAttribute("style"),
      "--offset-height: 0;",
      "asset #19",
    );
    if (!isFullstack(win)) {
      context.skip();
      return;
    }

    assert.equal(
      dom.querySelector(".lotsOfWords").getAttribute("style"),
      "--offset-height: XXpx;",
      "asset #20",
    );
	});
  });

  it("go 8.2: applyVolume", (context) => {
    const TEST_NAME = "BROWSER TEST func[16] expndDetails";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

    let str = `<div class="halferWords">
<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
</div> <div class="fewWords">
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>

</div>
`;
    appendIsland("#point2", str, dom);
    applyVolume(dom, win);
    assert.equal(
      dom.querySelector("body").getAttribute("style"),
      "--offset-height: 0;",
      "asset #21",
    );

    if (!isFullstack(win)) {
      context.skip();
      return;
    }
    assert.equal(
      dom.querySelector(".halferWords").getAttribute("style"),
      "--offset-height: XXpx;",
      "asset #22",
    );
    assert.equal(
      dom.querySelector(".fewWords").getAttribute("style"),
      "--offset-height: XXpx;",
      "asset #23",
    );
	});
  });

  it("go 8.3: applyVolume", (context) => {
    const TEST_NAME = "BROWSER TEST func[17] expndDetails";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

    let str = `<div class="some words">
<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
</div> `;
    appendIsland("#point2", str, dom);
    applyVolume(dom, win);
    assert.equal(
      dom.querySelector("body").getAttribute("style"),
      "--offset-height: 0;",
      "asset #24",
    );
    assert.equal(dom.querySelectorAll("[style]").length, 1, "asset #18");

    let tmp = Array.from(dom.querySelectorAll("[style]"));
    for (let i = 0; i < tmp.length; i++) {
      assert.isTrue(
        ["div", "body"].includes(tmp[i].tagName.toLowerCase()),
        "asset #25",
      );
    }
	});
  });

  it("go 9: getArticleWidth", () => {
    const TEST_NAME = "BROWSER TEST func[18] getArticleWidth";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

    let str = `<div class="lotsOfWords">
<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
</div> `;
    appendIsland("#point2", str, dom);
    try {
      // note missing last arg
      let ret = getArticleWidth(true, ".lotsOfWords", dom);
      assert.equal(ret, -513, "asset #26");
    } catch (e) {}
    // test is defective in JSDOM
	});
  });

  it("go 9.1: getArticleWidth", (context) => {
    const TEST_NAME = "BROWSER TEST func[19] getArticleWidth";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

    let str = `<div class="lotsOfWords">
<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
</div> `;
    appendIsland("#point2", str, dom);
    let ret = getArticleWidth(true, ".lotsOfWords", dom, win);
    if (!isFullstack(win)) {
      context.skip();
      return;
    }

    assert.equal(ret, 200, "asset #27");
    // test is defective in JSDOM
	});
  });

  it("go 9.2: getArticleWidth", (context) => {
    const TEST_NAME = "BROWSER TEST func[20] getArticleWidth";
    wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

    const URL = "http://192.168.0.35/resource/home";
    // NOTE no addReferences block
    let str = `<div class="lotsOfWords">
<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>
</div> `;
    appendIsland("#point2", str, dom);
    let ret = getArticleWidth(true, ".lotsOfWords", dom, win);
    assert.equal(ret, -513, "asset #28");
  });
  });
});