import { assert, describe, it } from "vitest";
import { JSDOM } from 'jsdom';

import { TEST_ONLY } from '../effect';
import { appendIsland } from '../base';
const { addOctoCats, addBooks, addBashSamples, addFancyButtonArrow } = TEST_ONLY;

// this function needs to be local to each test file, as the HTML will be different
function page() {
	const dom = new JSDOM(`<html>
	<head><title>test1</title></head>
	<body>
		<div class="reading" id="shareGroup"></div>
		<article>
		<div id="point1"></div>
		<div id="point2" class="blocker"></div>
		</article>
	</body>
</html>`);
	return dom.window.document;
}

// all the intelligence on this module is in the selection of graphics, not the simple code
describe("TEST effects", () => {
  it("go 1: addOctoCats", () => {
    assert.equal(typeof addOctoCats, "function", "assert #1");
	{
	  const dom=page();
	let str1=`
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">git</a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">GIT</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
`;
	let str2=`
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="Link to a github project."><i class="fa fa-github" aria-hidden="true"></i></a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="Link to a github project."><i class="fa fa-github" aria-hidden="true"></i></a>
      <a id="thing1" href="sdfs df" title="Link to a github project."><i class="fa fa-github" aria-hidden="true"></i></a>
`;
	appendIsland('#point2', str1, dom);
	addOctoCats( dom);
	assert(dom.querySelector('#point2').textContent, str2, "Basic run through, with variety of links" );
	}

	{
	 const dom=page();
	let str1=`
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">TEST3</a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">TEST4</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">TEST5</a>
`;
	appendIsland('#point2', str1, dom);
	addOctoCats( dom);
	assert(dom.querySelector('#point2').textContent, str1, "no github links found implies no change" );
	}
// assert no-one defines an A tagged with git outside an A 

  });

  it("go 2: addBooks", () => {
	let str1=`
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">docs</a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">DOCS</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
`;
	let str2=`
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf"><i class="fa fa-book-open" aria-hidden="true"></i></a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf"><i class="fa fa-book-open" aria-hidden="true"></i></a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf"><i class="fa fa-book-open" aria-hidden="true"></i></a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
`;

	 const dom=page();
	appendIsland('#point2', str1, dom);
	addBooks( dom);
	assert(dom.querySelector('#point2').textContent, str2, "added books logo" );
	});

 it("go 3: addBashSamples", () => {
	let str1=`
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 / /sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">docs</a>
<p>sfs //sdfsfs sdfsdf// fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">DOCS</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
`;
	let str2='<p> sdfsfds `gdfgdgd1dfgdfgdfgd` sdfs fsf s sfsdfsdfsdfs</p><p>fsdfsdfsd `sdfsdfsdf`  ';
	let str3=`
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 //sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">docs</a>
<p>sfs //sdfsfs sdfsdf// fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">DOCS</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
	 <p> sdfsfds <code class="bashSample" title="Quote from a bash; will add copy button">gdfgdgd1dfgdfgdfgd</code>  sdfs fsf s sfsdfsdfsdfs</p><p>fsdfsdfsd <code class="bashSample" title="Quote from a bash; will add copy button">sdfsdfsdf</code> `;

	 const dom=page();
	appendIsland('#point2', str1, dom);
	appendIsland('#point2', str2, dom);
	addBashSamples( dom);
	assert(dom.querySelector('#point2').textContent, str3, "Mapping bash samples correctly" );
	});

 it("go 4: addArrows", () => {
	 const dom=page();
	let str1=`
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</>
<div class="addArrow">
sf sfsfs sdsdf sfsfsf sfs 
</div>
`;
	let str2=`
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</>
<div class="addArrow">
sf sfsfs sdsdf sfsfsf sfs 
</div><i class="fa fa-play specialPointer " aria-hidden="true"></i>
`;
	appendIsland('#point2', str1, dom);
	addBashSamples( dom);
	assert(dom.querySelector('#point2').textContent, str2, "Mapping addArrow" );
	
	});

});
