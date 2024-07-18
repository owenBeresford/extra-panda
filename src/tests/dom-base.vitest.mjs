import { assert, describe, it, assertType } from "vitest";

import { page } from "./page-seed";
import { TEST_ONLY } from "../dom-base";
const { appendIsland, setIsland, currentSize, mapAttribute, 
  getArticleWidth,
  applyVolume,
  isFullstack,
} = TEST_ONLY;

describe("TEST dom-base", () => {
  it("go 1: currentSize", (context) => {
    if (process && process.env) {
      context.skip();
    }
    assertType < Array < number >> (currentSize(), "assert #1");
    // i could set window size then look at it,
    // but this needs a env test and compat test, not a logic test
    assert.isTrue(Array.isArray(currentSize()), "got an array back, assert #2");
  });

  it("go 2: isFullStack", (context) => {
    if (process && process.env) {
      context.skip();
    }
    throw new Error("Dev: add unit test here");
  });

  it("go 3: isMobile", (context) => {
    if (process && process.env) {
      context.skip();
    }
    throw new Error("Dev: add unit test here");
  });

  it("go 4: mapAttribute", (context) => {
    if (!isFullstack()) {
      context.skip();
    }

    const [dom, loc] = page("http://192.168.0.35/resource/home", 2);
    let str = `<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>`;
    appendIsland("#point2", str, dom);

    assert.equal(
      mapAttribute(dom.querySelector("#item1"), "right"),
      "100",
      "asset #3",
    );
    assert.equal(
      mapAttribute(dom.querySelector("#item1"), "right"),
      100,
      "asset #4",
    );
  });

  it("go 5: appendIsland ", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/home", 2);

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
  });

  it("go 6: setIsland ", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/home", 2);

    let str = "<h2>WWWWW WWWWW</h2>";
    appendIsland("#point1", str, dom);
    let tmp = dom.getElementsByTagName("body")[0].outerHTML;
    tmp = tmp.replace(new RegExp(">[ \\t\\n]*<", "g"), "><");
    assert.equal(
      tmp,
      `<body><div><h1>Page Title!! </h1><div class="addReading" id="shareGroup"><div class="allButtons"><span class="ultraSkinny"></span></div></div></div><div id="point1"><h2>WWWWW WWWWW</h2></div><div id="point2" class="blocker addReferences"></div></body>`,
      "assert #2",
    );
    assert.equal(dom.getElementsByTagName("h2").length, 1, "assert #7");
    setIsland("#point1", str, dom);
    assert.equal(dom.getElementsByTagName("h2").length, 1, "assert #9");
  });

  it("go 7: applyVolume", (context ) => {
   const [dom ] = page("http://192.168.0.35/resource/home", 1);
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
	 applyVolume( dom);
    assert.equal(
      dom.querySelector("body").getAttribute('style'),
	 "--offset-height: 0;",
      "asset #10"
    );
	if(!isFullstack()) {
		context.skip();
		return;
	}

    assert.equal(
      dom.querySelector(".lotsOfWords").getAttribute('style'),
      "--offset-height: XXpx;",
      "asset #11",
    );
	});

  it("go 7.1: applyVolume", (context ) => {
   const [dom ] = page("http://192.168.0.35/resource/home", 1);
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
	 applyVolume( dom);
    assert.equal(
      dom.querySelector("body").getAttribute('style'),
	 "--offset-height: 0;",
      "asset #12"
    );
	if(!isFullstack()) {
		context.skip();
		return;
	}

    assert.equal(
      dom.querySelector(".lotsOfWords").getAttribute('style'),
      "--offset-height: XXpx;",
      "asset #13",
    );
	});

  it("go 7.2: applyVolume", (context ) => {
   const [dom ] = page("http://192.168.0.35/resource/home", 1);
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
	 applyVolume( dom);
    assert.equal(
      dom.querySelector("body").getAttribute('style'),
	 "--offset-height: 0;",
      "asset #14"
    );

	if(!isFullstack()) {
		context.skip();
		return;
	}
    assert.equal(
      dom.querySelector(".halferWords").getAttribute('style'),
      "--offset-height: XXpx;",
      "asset #15",
    );
    assert.equal(
      dom.querySelector(".fewWords").getAttribute('style'),
      "--offset-height: XXpx;",
      "asset #16",
    );
	});

  it("go 7.3: applyVolume", (context ) => {
   const [dom ] = page("http://192.168.0.35/resource/home", 1);
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
	 applyVolume( dom);
    assert.equal(
      dom.querySelector("body").getAttribute('style'),
	 "--offset-height: 0;",
      "asset #17"
    );
    assert.equal(
      dom.querySelectorAll("[style]").length,
      1,
      "asset #18",
    );

      let tmp=Array.from(dom.querySelectorAll("[style]"));
		for(let i=0; i<tmp.length; i++) {
console.log("WERWRWER ", tmp[i].tagName);
		    assert.isTrue(
				["div", "body" ].includes( tmp[i].tagName.toLowerCase() ),
      			"asset #19"
   				 );	
		}
	});

  it("go 7: getArticleWidth", ( ) => {
   const [dom ] = page("http://192.168.0.35/resource/home", 1);
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
	 let ret=getArticleWidth(true, dom);
	  
	 assert.equal( ret, -513, "asset #20",);
// test is defective in JSDOM
  });

  it("go 7.1: getArticleWidth", (context ) => {
   const [dom ] = page("http://192.168.0.35/resource/home", 1);
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
	 let ret=getArticleWidth(true, dom);
	if(!isFullstack()) {
		context.skip();
		return;
	}	  

	 assert.equal( ret, 200, "asset #20",);
// test is defective in JSDOM
  });
});
