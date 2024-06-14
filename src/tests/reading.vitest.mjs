import { assert, describe, it } from "vitest";
import { JSDOM } from 'jsdom';

import { TEST_ONLY } from  '../reading';
import { appendIsland } from '../base';
const { readingDuration } = TEST_ONLY;

function page() {
	const dom = new JSDOM(`<html>
	<head><title>test1</title></head>
	<body>
		<div class="reading" id="shareGroup"></div>
		<div id="point1"></div>
		<div id="point2" class="blocker"></div>
	</body>
</html>`);
	return dom.window.document;
}

describe("TEST readingDuration", () => {
  let ram1=process.memoryUsage(); 
  it("go 1: readingDuration function is available correctly", () => {
    assert.equal(typeof readingDuration, "function", "assert #1");
  });
  const dom=page();
  it("go 2: *** TESTING JSDOM LIBRARY, BORING ***", () => {
	let str='<h2>WWWWW WWWWW</h2>';
	appendIsland('#point1', str, dom);
    assert.equal( dom.getElementsByTagName('body')[0].outerHTML, `<body>
		<div class="reading" id="shareGroup"></div>
		<div id="point1"><h2>WWWWW WWWWW</h2></div>
		<div id="point2" class="blocker"></div>
	
</body>`, "assert #2" );
    assert.equal( dom.getElementsByTagName('h2').length, 1, "assert #3");
  });
  it("go 3: testing content manipulation", () => {
	let txt=`
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
`;
	appendIsland('.blocker', txt, dom);
    assert.notEqual( dom.getElementById('point2'), null, "assert #4");
    assert.equal( dom.getElementById('point2').textContent.split(' ').length, txt.split(' ').length, "assert #5");

	readingDuration({ refresh:true, }, dom );   
	let tt=dom.querySelector("#shareGroup a.reading").textContent;
	assert(tt, 'To read: 1m', "assert #6");

  });

  it("go 4: extra text and images", () => {
	let txt=`<img src="dfgdfg" width="30%" /> <img src="dfgdfg" width="30%" /> <img src="dfgdfg" width="30%" />
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer 
`;
	appendIsland('.blocker', txt, dom);
    assert.notEqual( dom.getElementById('point2'), null, "assert #7");

	readingDuration({ refresh:true, }, dom );   
	let tt=dom.querySelector("#shareGroup a.reading").textContent;
	assert(tt, 'To read: 2m', "assert #8");

  });
 
  it("go 5: growth test (refresh flag + output value should be larger)", () => {
	let txt=`<img src="dfgdfg" width="30%" /> <img src="dfgdfg" width="30%" /> <img src="dfgdfg" width="30%" />
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer 
`;
	appendIsland('.blocker', txt, dom);
    assert.notEqual( dom.getElementById('point2'), null, "assert #8");

	readingDuration({ refresh:true, }, dom );   
	let tt=dom.querySelectorAll("#shareGroup a.reading")
	assert.equal(tt.length, 1, "assert #9" );
	assert(Array.from(tt).pop().textContent, 'To read: 4m', "assert #10");

  });
 
  let ram2=process.memoryUsage();
	console.log("RAM used to make JSDOM: "+ (ram2.heapUsed- ram1.heapUsed) );
});

