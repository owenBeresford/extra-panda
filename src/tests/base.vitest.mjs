import { assert, describe, it, assertType } from "vitest";
import { JSDOM } from 'jsdom';

import { Fetchable } from '../all-types';
import { TEST_ONLY } from '../base';
const { getFetch, articleName, runFetch, isMobile, addLineBreaks, pad, currentSize, _getCookie, mapAttribute, importDate, dateMunge, appendIsland } = TEST_ONLY;


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

describe("TEST base", () => {
  it("go 1: getFetch", () => {
    assert.equal(typeof getFetch, "function", "assert #1");
    assertType<Fetchable>(getFetch(), "assert #2");
  });

  it("go 2: getFetch", (context) => {
	context.skip();
  });

  it("go 3: artcleName", () => {
	  const [dom, loc]=page("http://192.168.0.35/resource/home");
    assert.equal(articleName(), "<name>", "assert #3");
    assert.equal(articleName(loc), "home", "assert #4");
  });



//  const dom=page();

});
