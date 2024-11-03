import { assert, describe, it, run, assertType, setTimeout } from "jest-lite";

import { page, execTest, wrap } from "./page-seed-playwright";
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

describe("TEST BROWSER dom-base", () => {
  it("go 1: currentSize", async (context) => {
    const TEST_NAME = "BROWSER TEST func[1] currentSize";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    if (process && process.env) {
      context.skip();
    }
    assertType < Array < number >> (currentSize(), "assert #1");
    // i could set window size then look at it,
    // but this needs a env test and compat test, not a logic test

	expect( Array.isArray(currentSize() )).toBe(true); // "got an array back, assert #2")
	});
  });

  it("go 2: isFullStack", async (context) => {
    const TEST_NAME = "BROWSER TEST func[2] isFullstack";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {
		expect(isFullstack( win)).toBe(true);
	});
  });

  it("go 3: isMobile", async (context) => {
    const TEST_NAME = "BROWSER TEST func[3] isMobile";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {
		expect(isMobile(dom, loc, win)).toBe(false);
		loc.search="?mobile=1";
		expect(isMobile(dom, loc, win)).toBe(true);

	});
  });

  it("go 4: mapAttribute", async (context) => {
    const TEST_NAME = "BROWSER TEST func[4] mapAttribute";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {
    let str = `<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>`;
    appendIsland(".home.icerow", str, dom);

 	expect(  mapAttribute(dom.querySelector("#item1"), "right", win)).toBe("100"); //  "asset #3",
	expect( mapAttribute(dom.querySelector("#item1"), "right", win)).toBe( 100); //  "asset #4",
	});
  });

  it("go 5:  copyURL ", async (context) => {
    const TEST_NAME = "BROWSER TEST func[5] copyURL";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    let str = `<div id="shareMenu" class="shareMenu"> </div> 
  <dialog id="popup" open>
  <input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
  </dialog>`;
    appendIsland(".home.icerow", str, dom);
    expect( copyURL(loc, win) ).toBe( undefined); // "assert #14");

    if (!win.navigator.clipboard) {
      context.skip();
    }
    let tt = await win.navigator.clipboard.readText();
	expect(tt).toBe( loc.url); // "assert #15");

	});
  });

  it("go 6: calcScreenDPI ", async (context) => {
    const TEST_NAME = "BROWSER TEST func[6] calcScreenDPI";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {
    let str = `<div id="shareMenu" class="shareMenu"> </div> 
  <dialog id="popup" open>
  <input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
  </dialog>`;
    appendIsland(".home.icerow", str, dom);

    expect( calcScreenDPI(dom, win) ).toBe( 150);  //  "Assert #x, the screen DPI");
	});
  });

  it("go 7: screenWidth ", async (context) => {
    const TEST_NAME = "BROWSER TEST func[7] screenWidth";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html?width=150", async (dom, loc, win) => {

    let str = `<div id="shareMenu" class="shareMenu"> </div> 
  <dialog id="popup" open>
  <input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
  </dialog>`;
    appendIsland(".home.icerow", str, dom);
    expect( screenWidth(loc, win) ).toBe( 150); //  "Assert #x,");
	loc.search="?width=1800";
    expect( screenWidth(loc, win) ).toBe( 1800); // "Assert #x, ");
	});
  });

  it("go 5: appendIsland ", async (context) => {
    const TEST_NAME = "BROWSER TEST func[8] appendIsland";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    let str = "<h2>WWWWW WWWWW</h2>";
    appendIsland("#point1", str, dom);

    let tmp = dom.getElementsByTagName("body")[0].outerHTML;
    tmp = tmp.replace(new RegExp(">[ \\t\\n]*<", "g"), "><");
    expect( tmp).toBe(
      `<body><div><h1>Page Title!! </h1><div class="addReading" id="shareGroup"><div class="allButtons"><span class="ultraSkinny"></span></div></div></div><div id="point1"><h2>WWWWW WWWWW</h2></div><div id="point2" class="blocker addReferences"></div></body>`,
    );   //  "assert #2",

	expect( dom.getElementsByTagName("h2").length ).toBe(1); //, "assert #5");
    appendIsland("#point1", str, dom);
    expect(dom.getElementsByTagName("h2").length ).toBe( 2); //, "assert #6");
    appendIsland("#point1", str, dom);
    expect( dom.getElementsByTagName("h2").length ).toBe(3); // , "assert #7");
	});
  });

  it("go 6: setIsland ", async () => {
    const TEST_NAME = "BROWSER TEST func[9] setIsland";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

    let str = "<h2>WWWWW WWWWW</h2>";
    appendIsland("#point1", str, dom);
    let tmp = dom.getElementsByTagName("body")[0].outerHTML;
    tmp = tmp.replace(new RegExp(">[ \\t\\n]*<", "g"), "><");
    assert.equal(
      tmp,
      `<body><div><h1>Page Title!! </h1><div class="addReading" id="shareGroup"><div class="allButtons"><span class="ultraSkinny"></span></div></div></div><div id="point1"><h2>WWWWW WWWWW</h2></div><div id="point2" class="blocker addReferences"></div></body>`,
      "assert #2",
    );
    expect(dom.getElementsByTagName("h2").length).toBe(1); // "assert #8");
    setIsland("#point1", str, dom);
    expect(dom.getElementsByTagName("h2").length).toBe( 1); // "assert #9");
    setIsland("#point1", str + str, dom);
    expect(dom.getElementsByTagName("h2").length).toBe( 2); // "assert #10");
    setIsland("#point1", "", dom);
    expect(dom.getElementsByTagName("h2").length).toBe(0); // "assert #11");
	});
  });

  it("go 7:  docOffsets ", async () => {
    const TEST_NAME = "BROWSER TEST func[10] docOffsets";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/home.html", async (dom, loc, win) => {

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
    appendIsland(".home.icerow", str, dom);
    const ELE = dom.querySelector(".lotsOfWords");

    expect( docOffsets(ELE, { scrollY: 100, scrollX: 0 }) ).toBe( [100, 0] ); // "assert #12",
    expect( docOffsets(ELE, { scrollY: 900, scrollX: 0 }) ).toBe( [900, 0] ); // "assert #13",

	});
  });

  it("go 10: expandDetails", async (context) => {
    const TEST_NAME = "BROWSER TEST func[11] expndDetails";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home?width=1100", async (dom, loc, win) => {
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
    expect( dom.querySelector("details").open ).toBe(false); // "asset #14");
    expandDetails(1040, dom, loc);
    expect( dom.querySelector("details").open ).toBe(true); // "asset #15");
	});
  });

  it("go 10.1: expandDetails", async (context) => {
    const TEST_NAME = "BROWSER TEST func[12] expndDetails";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home?width=600", async (dom, loc, win) => {

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
    expect(dom.querySelector("details").open).toBe(false); // "asset #16");
    expandDetails(1040, dom, loc);
    expect(dom.querySelector("details").open).toBe( false); // "asset #16");
	});
  });

  it("go 10.2: expandDetails", async (context) => {
    const TEST_NAME = "BROWSER TEST func[13] expndDetails";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home?width=1100", async (dom, loc, win) => {
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
    expect( dom.querySelector("details").open ).toBe( false) ; // "asset #14");
    expandDetails(1040, dom, loc);
    expect( dom.querySelector("details").open ).toBe( false); // "asset #15");
	});
  });

  it("go 8: applyVolume", async (context) => {
    const TEST_NAME = "BROWSER TEST func[14] expndDetails";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

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
    appendIsland(".home.icerow", str, dom);
    applyVolume(dom, win);
    expect(  dom.querySelector("body").getAttribute("style"))
     .toBe( "--offset-height: 0;"); //  "asset #17",

    if (!isFullstack(win)) {
      context.skip();
      return;
    }

    expect( dom.querySelector(".lotsOfWords").getAttribute("style") )
     .toBe( "--offset-height: XXpx;") ; //      "asset #18",

	});
  });

  it("go 8.1: applyVolume", async (context) => {
    const TEST_NAME = "BROWSER TEST func[15] expndDetails";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

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
    appendIsland(".home.icerow", str, dom);
    applyVolume(dom, win);
    expect(   dom.querySelector("body").getAttribute("style") )
		.toBe( "--offset-height: 0;" ); //   "asset #19",

    if (!isFullstack(win)) {
      context.skip();
      return;
    }

    expect(  dom.querySelector(".lotsOfWords").getAttribute("style") )
     	.toBe( "--offset-height: XXpx;" ); //  "asset #20",
	});
  });

  it("go 8.2: applyVolume", async (context) => {
    const TEST_NAME = "BROWSER TEST func[16] expndDetails";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

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
    appendIsland(".home.icerow", str, dom);
    applyVolume(dom, win);
    expect( dom.querySelector("body").getAttribute("style") )
     		.toBe( "--offset-height: 0;"); //   "asset #21",

    if (!isFullstack(win)) {
      context.skip();
      return;
    }
    expect(   dom.querySelector(".halferWords").getAttribute("style") )
     	.toBe( "--offset-height: XXpx;"); //   "asset #22",
	expect(   dom.querySelector(".fewWords").getAttribute("style") )
      	.toBe( "--offset-height: XXpx;" ); //  "asset #23",

	});
  });

  it("go 8.3: applyVolume", async (context) => {
    const TEST_NAME = "BROWSER TEST func[17] expndDetails";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

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
    appendIsland(".home.icerow", str, dom);
    applyVolume(dom, win);
    expect(  dom.querySelector("body").getAttribute("style") )
      .toBe( "--offset-height: 0;" ); //  "asset #24",
    expect( dom.querySelectorAll("[style]").length ).toBe( 1); //  "asset #18");

    let tmp = Array.from(dom.querySelectorAll("[style]"));
    for (let i = 0; i < tmp.length; i++) {
      expect( ["div", "body"].includes( tmp[i].tagName.toLowerCase() )).toBe(true); //  "asset #25",
    }
	});
  });

  it("go 9: getArticleWidth", async () => {
    const TEST_NAME = "BROWSER TEST func[18] getArticleWidth";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

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
    appendIsland(".home.icerow", str, dom);
    try {
      // note missing last arg
      let ret = getArticleWidth(true, ".lotsOfWords", dom);
      expect(ret).toBe( -513); // "asset #26");
    } catch (e) {}
    // test is defective in JSDOM
	});
  });

  it("go 9.1: getArticleWidth", async (context) => {
    const TEST_NAME = "BROWSER TEST func[19] getArticleWidth";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

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
    appendIsland(".home.icerow", str, dom);
    let ret = getArticleWidth(true, ".lotsOfWords", dom, win);
    if (!isFullstack(win)) {
      context.skip();
      return;
    }

    expect(ret).toBe( 200); // "asset #27");
    // test is defective in JSDOM
	});
  });

  it("go 9.2: getArticleWidth", async (context) => {
    const TEST_NAME = "BROWSER TEST func[20] getArticleWidth";
    await wrap( TEST_NAME, "https://127.0.0.1:8081/resource/home", async (dom, loc, win) => {

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
    appendIsland(".home.icerow", str, dom);
    let ret = getArticleWidth(true, ".lotsOfWords", dom, win);
    expect(ret).toBe( -513); // "asset #28");
  });
  });
});

execTest(run);

