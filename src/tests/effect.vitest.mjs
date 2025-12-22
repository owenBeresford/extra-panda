import { assert, describe, it } from "vitest";

import { page } from "./page-seed-vite";
import { TEST_ONLY } from "../effect";
import { appendIsland } from "../dom-base";
import { TEST_MACHINE } from "../immutables";
const { addOctoCats, addBooks, addBashSamples, addFancyButtonArrow, link2Txt } =
  TEST_ONLY;

// all the intelligence on this module is in the selection of graphics, not the simple code
describe("TEST effects", () => {
  it("go 1: addOctoCats", () => {
    assert.equal(typeof addOctoCats, "function", "assert #1");
    {
      const [dom] = page("http://192.68.0.35/", 1);
      let str1 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">git</a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">GIT</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
`;
      let str2 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="Link to a github project."><i class="fa fa-github" aria-hidden="true"></i></a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="Link to a github project."><i class="fa fa-github" aria-hidden="true"></i></a>
      <a id="thing1" href="sdfs df" title="Link to a github project."><i class="fa fa-github" aria-hidden="true"></i></a>
`;
      appendIsland("#point2", str1, dom);
      addOctoCats(false, dom);
      assert(
        dom.querySelector("#point2").textContent,
        str2,
        "Basic run through, with variety of links",
      );
    }

    {
      const [dom] = page("http://192.68.0.35/", 1);
      let str1 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">TEST3</a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">TEST4</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">TEST5</a>
`;
      appendIsland("#point2", str1, dom);
      addOctoCats(false, dom);
      assert(
        dom.querySelector("#point2").textContent,
        str1,
        "no github links found implies no change",
      );
    }

    {
      const [dom] = page("http://192.68.0.35/", 1);
      let str1 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="https://github.com/user1/project1" title="sdfsdfsdf">git</a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="https://github.com/user2/project2" title="sdfsdfsdf">GIT</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
`;
      let str2 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="https://github.com/user1/project1" aria-label="Reference popup for link [*]
\nproject1\nuser1 [recent time]
\nA Github project ~ text auto generated without scrapping."><i class="fa fa-github" aria-hidden="true"></i></a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="https://github.com/user2/project2" aria-label="Reference popup for link [*]
\nproject2\nuser2 [recent time]
\nA Github project ~ text auto generated without scrapping."><i class="fa fa-github" aria-hidden="true"></i></a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="https://github.com/user3/project3" aria-label="Reference popup for link [*]
\nproject3\nuser3 [recent time]
\nA Github project ~ text auto generated without scrapping."><i class="fa fa-github" aria-hidden="true"></i></a>
      <a id="thing1" href="https://github.com/user4/project4" aria-label="Reference popup for link [*]
\nproject3\nuser3 [recent time]
\nA Github project ~ text auto generated without scrapping."><i class="fa fa-github" aria-hidden="true"></i></a>
`;

      // "Reference popup for link [*]\n\n"+ titre + "\n" + nom +" " + datte + "\n\n" + desc
      appendIsland("#point2", str1, dom);
      addOctoCats(true, dom);
      assert(
        dom.querySelector("#point2").textContent,
        str2,
        "Basic run through, with decorated links ",
      );
    }

    // assert no-one defines an A tagged with git outside an A
  });

  it("go 2: addBooks", () => {
    {
      let str1 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">docs</a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">DOCS</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
`;
      let str2 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf"><i class="fa fa-book-open" aria-hidden="true"></i></a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf"><i class="fa fa-book-open" aria-hidden="true"></i></a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf"><i class="fa fa-book-open" aria-hidden="true"></i></a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
`;

      const [dom] = page(TEST_MACHINE+"", 1);
      appendIsland("#point2", str1, dom);
      addBooks(false, dom);
      assert(
        dom.querySelector("#point2").textContent,
        str2,
        "added books logo",
      );
    }

    {
      let str1 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">docs</a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">DOCS</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
`;
      let str2 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" aria-label="Link to the project docs; it may be a git page, or a separate webpage."><i class="fa fa-book-open" aria-hidden="true"></i></a>
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" aria-labele="Link to the project docs; it may be a git page, or a separate webpage."><i class="fa fa-book-open" aria-hidden="true"></i></a>
      <a id="thing1" href="sdfs df" aria-label="Link to the project docs; it may be a git page, or a separate webpage."><i class="fa fa-book-open" aria-hidden="true"></i></a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
`;
      const [dom] = page(TEST_MACHINE+"", 1);
      appendIsland("#point2", str1, dom);
      addBooks(true, dom);
      assert(
        dom.querySelector("#point2").textContent,
        str2,
        "added books logo with decorations",
      );
    }
  });

  it("go 5: link2Txt", () => {
    let str =
      "Reference popup for link [*]\n\nproject1\nuser1 [recent time]\n\nA Github project ~ text auto generated without scrapping.";
    assert.equal(link2Txt("https://github.com/user1/project1"), str, "step #1");
    assert.equal(
      link2Txt("https://github.com/user1/project1/blob/main/README.md"),
      str,
      "step #2",
    );
    assert.equal(
      link2Txt("https://github.com/user1/project1/tree/ensureDocs"),
      str,
      "step #3",
    );
  });

  it("go 3: addBashSamples", () => {
    let str1 = `
<div class="addBashSamples">
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 / /sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
<p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">docs</a>
<p>sfs //sdfsfs sdfsdf// fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">DOCS</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
</div>
`;
    let str2 =
      '<p class="addBashSamples"> sdfsfds `gdfgdgd1dfgdfgdfgd` sdfs fsf s sfsdfsdfsdfs  fsdfsdfsd `sdfsdfsdf`  ';
    let str3 = `
<div class="addBashSamples">
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
	 //sfsdfs sfsfs sfsfs sfsdf sfsdfsf <a href="sdfsdf" title="sdfsdfsdf">TEST2</a> 
</p><p>sfs sdfsfs sdfsdf fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfsdf" title="sdfsdfsdf">docs</a>
</p><p>sfs //sdfsfs sdfsdf// fsdfsdf sfsdfs sfsfs sfsfs sfsdf sfsdfsf  <a href="sdfs df" title="sdfsdfsdf">DOCS</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">docs</a>
      <a id="thing1" href="sdfs df" title="sdfsdfsdf">git</a>
</p></div>
<p class=\"addBashSamples\"> sdfsfds <code class="bashSample" title="Quote from a bash; will add copy button">gdfgdgd1dfgdfgdfgd</code> sdfs fsf s sfsdfsdfsdfs  fsdfsdfsd <code class="bashSample" title="Quote from a bash; will add copy button">sdfsdfsdf</code>  </p>`;

    const [dom] = page("http://192.68.0.35/", 1);
    appendIsland("#point2", str1, dom);
    appendIsland("#point2", str2, dom);
    addBashSamples(dom);
    assert.equal(
      dom.querySelector("#point2").innerHTML,
      str3,
      "Mapping bash samples correctly",
    );
  });

  it("go 4: addArrows", () => {
    const [dom] = page("http://192.68.0.35/", 1);
    let str1 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
<div class="addArrow">
sf sfsfs sdsdf sfsfsf sfs 
</div>
`;
    let str2 = `
<p>sfs sdfsfs sdfsdf fsdfsdf <a class="sdfs" href="sdfsdf" title="sdfsdfsdf">TEST1</a>
</p><div class="addArrow">
sf sfsfs sdsdf sfsfsf sfs 
</div>
<i class="fa fa-play specialPointer" aria-hidden="true"></i>`;
    appendIsland("#point2", str1, dom);
    addFancyButtonArrow(dom);
    assert.equal(
      dom.querySelector("#point2").innerHTML,
      str2,
      "Mapping addArrow",
    );
  });
});
