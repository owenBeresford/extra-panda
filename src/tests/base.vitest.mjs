import { assert, describe, it, assertType } from "vitest";
import { JSDOM } from 'jsdom';

import { Fetchable, Cookieable } from '../all-types';
import { TEST_ONLY } from '../base';
const { getFetch, articleName, runFetch, isMobile, addLineBreaks, pad, currentSize, _getCookie, mapAttribute, importDate, dateMunge, appendIsland, setIsland, isFullstack  } = TEST_ONLY;

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

  it("go 4: pad", () => {
    assert.equal(pad(1), "01", "assert #4");
    assert.equal(pad(10), "10", "assert #5");
    assert.equal(pad(1000), "1000", "assert #6");
    assert.throws(() => { pad(-1) }, "Value passed must be a counting number above 0", "assert #7");
    assert.throws(() => { pad(0) }, "Value passed must be a counting number above 0", "assert #8");

  });

  it("go 6: currentSize", (context) => {
	if(process && process.env) {
		context.skip();
	}
    assertType<Array<number>>(currentSize(), "assert #9");
// i could set window size then look at it, 
// but this needs a env test and compat test, not a logic test
	assert.isTrue(Array.isArray( currentSize()), "got an array back, assert #9" );
  });

  it("go 6: mapAttribute", (context) => {
	if(process && process.env) {
		context.skip();
	}

	const [dom, loc]=page("http://192.168.0.35/resource/home");
	let str=`<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>`;
	appendIsland('#point2', str, dom);
	
	assert.equal(mapAttribute(dom.querySelector('#item1'), 'right', false), "100", "asset #10" );
	assert.equal(mapAttribute(dom.querySelector('#item1'), 'right', true), 100, "asset #11" );
	
  });

  it("go 7: importDate", () => {
	assert.equal( importDate("ymdhis", "2024-06-01 09:00:00").toString(), (new Date("2024-06-01 09:00:00")).toString(), "assert #12");
	assert.equal( importDate("ymdhis", "2024-06-01T09:00:00").toString(), (new Date("2024-06-01 09:00:00")).toString(), "assert #T3");
	assert.equal( importDate("ymdhis", "2024/06/01 09:00:00").toString(), (new Date("2024-06-01 09:00:00")).toString(), "assert #14");
	assert.equal( importDate("ymdhis", "2024/06/01T09:00:00").toString(), (new Date("2024-06-01 09:00:00")).toString(), "assert #15");
	assert.equal( importDate("ymdhis", "2024-06-01", "09:00:00").toString(), (new Date("2024-06-01 09:00:00")).toString(), "assert #16");
	assert.equal( importDate("ydmhis", "2024-06-01 09:00:00").toString(), (new Date("2024-01-06 09:00:00")).toString(), "assert #19");
	assert.equal( importDate("dmyhis", "06-01-2024 09:00:00").toString(), (new Date("2024-01-06 09:00:00")).toString(), "assert #20");

	assert.equal( importDate("ymd", "2024-06-01", "").toString(), "Invalid Date", "assert #17");
	assert.equal( importDate("ymd", "2024-06-01").toString(), "Invalid Date", "assert #18");
  });

  it("go 8: dateMunge", () => {
 	assert.equal( dateMunge((new Date('1980-02-19 00:00:00')).getTime()/1000, new Date('1983-02-12 00:00:00'), true), " 19-Feb-1980 ", "assert #22");
	assert.equal( dateMunge((new Date('1980-02-19 00:00:00')).getTime(), new Date('1983-02-12 00:00:00'), true), " 19-Feb-1980 ", "assert #21");
 	assert.equal( dateMunge((new Date('1980-02-19 00:00:00')).getTime(), new Date('1983-02-12 00:00:00'), false), " 19-02-1980 00:00", "assert #23");

 	assert.equal( dateMunge((new Date('2001-02-19 00:00:00')).getTime(), new Date('1983-02-12 00:00:00'), false), " 19-02-2001 00:00", "assert #24");
 	assert.equal( dateMunge((new Date('1980-02-19 00:00:00')).getTime(), '1983-02-12', true), " 19-Feb-1980 ", "assert #25");
  });

  it("go 10: addLineBreak", () => {
// export function addLineBreaks(str:string, len:number=80, token:string="↩"):string 
	let str1="fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ag aga gdgadfg";
	let str2=str1;
    assert.equal( addLineBreaks(str1), str2, "assert #26");
	str1="fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg";
	str2=`fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gd↩
gadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag ↩
aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga gga↩
dg ag aga gdgadfg`;
    assert.equal( addLineBreaks(str1), str2, "assert #27");

	str1="fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg";
	str2=`fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga f↩
gaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg↩
 adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdf↩
ggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga gga↩
dg ag aga gdgadfg`;
    assert.equal( addLineBreaks(str1, 60), str2, "assert #28");

	str1="fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg";
	str2=`fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fPING
gaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadgPING
 adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfPING
ggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggaPING
dg ag aga gdgadfg`;
    assert.equal( addLineBreaks(str1, 60, "PING"), str2, "assert #29");	

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

  it("go 14: getCookie ", () => {
   const [dom, loc]=page("http://192.168.0.35/resource/home");
// export function _getCookie():Cookieable 

    assertType<Cookieable>(_getCookie( ), "assert #32");

	});

//  it("go 5: pad", () => {
//	  const [dom, loc]=page("http://192.168.0.35/resource/home");
//
//  });

});
