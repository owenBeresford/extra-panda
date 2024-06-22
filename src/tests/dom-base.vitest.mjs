import { assert, describe, it, assertType } from "vitest";
import { JSDOM } from 'jsdom';

import { Fetchable, Cookieable } from '../all-types';

import { TEST_ONLY } from '../dom-base';
const { isMobile, appendIsland, setIsland, isFullstack, currentSize  } = TEST_ONLY;

// this function needs to be local to each test file, as the HTML will be different
function page(url ) {
	const dom = new JSDOM(`<html>
	<head><title>test1</title></head>
	<body>
		<div class="reading" id="shareGroup"></div>
		<div id="point1"></div>
		<div id="point2" class="blocker"></div>
	</body>
</html>`, { url:url, referrer:url });
	return [dom.window.document, dom.window.location];
}

describe("TEST dom-base", () => {
  it("go 6: currentSize", (context) => {
	if(process && process.env) {
		context.skip();
	}
    assertType<Array<number>>(currentSize(), "assert #9");
// i could set window size then look at it, 
// but this needs a env test and compat test, not a logic test
	assert.isTrue(Array.isArray( currentSize()), "got an array back, assert #9" );
  });

  it("go 9: isFullStack", (context) => {
	if(process && process.env) {
		context.skip();
	}
	throw new Error("Dev: add unit test here");
	});

  it("go 11: isMobile", (context) => {
	if(process && process.env) {
		context.skip();
	}
	throw new Error("Dev: add unit test here");
	});

  it("go 12: appendIsland ", () => {
   const [dom, loc]=page("http://192.168.0.35/resource/home");

	let str='<h2>WWWWW WWWWW</h2>';
	appendIsland('#point1', str, dom);
    assert.equal( dom.getElementsByTagName('body')[0].outerHTML, `<body>
		<div class="reading" id="shareGroup"></div>
		<div id="point1"><h2>WWWWW WWWWW</h2></div>
		<div id="point2" class="blocker"></div>
	
</body>`, "assert #2" );
    assert.equal( dom.getElementsByTagName('h2').length, 1, "assert #30");
	appendIsland('#point1', str, dom);
    assert.equal( dom.getElementsByTagName('h2').length, 2, "assert #31");

  });

  it("go 13: setIsland ", () => {
   const [dom, loc]=page("http://192.168.0.35/resource/home");

	let str='<h2>WWWWW WWWWW</h2>';
	appendIsland('#point1', str, dom);
    assert.equal( dom.getElementsByTagName('body')[0].outerHTML, `<body>
		<div class="reading" id="shareGroup"></div>
		<div id="point1"><h2>WWWWW WWWWW</h2></div>
		<div id="point2" class="blocker"></div>
	
</body>`, "assert #2" );
    assert.equal( dom.getElementsByTagName('h2').length, 1, "assert #30");
	setIsland('#point1', str, dom);
    assert.equal( dom.getElementsByTagName('h2').length, 1, "assert #31");

  });



}); 
