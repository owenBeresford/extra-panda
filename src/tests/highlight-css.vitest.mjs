import { assert, describe, it } from "vitest";
import hljs from "highlight.js/lib/core";

import { page, validateHTML } from "./page-seed-vite";
import { execHighlight } from "../highlight/highlight-css";
import { appendIsland, isFullstack } from "../dom-base";
import { enableGetEventListeners, createEvent } from "./vitest-addons";

describe("TEST highlight CSS", () => {
  it("go 1: CSS test1", async () => {
    const [dom, loc, win, jsdom] = page("http://192.168.0.35/resource/home", 4);
    let str = `<h2 class="dontend" id="toc2"> <a href="#toc2" title="Jump to this section." > Prototype Toy  <sup><i class="fa fa-link invert" aria-label="Jump this to this section." aria-hidden="true"></i></sup> </a></h2>
<p>UPDATE: also <a href="https://flexboxzombies.com/p/flexbox-zombies" target="_blank">this toy^H^H^Hgame</a> <br />
As a minimum, not recommended for industrial use:</p>

<code class="highlight dontsplit" lang="css">
.table .tr { text-align:center; display:flex; flex-flow:
           row nowrap; width:100%; }
.table .tr .td { text-align:center;  justify-content: 
           space-between; flex-grow: 1; flex-basis: 0; 
           flex:1; padding:0.5em; }
/* the 3rd column needs more space */
.table .tr .td:nth-child(3) { flex:2; }
.table .thead { /* ... */ }
</code>

<h2 class="dontend" id="toc3"> <a href="#toc3" title="Jump to this section." > Keywords <sup><i class="fa fa-link invert" aria-label="Jump this to this section." aria-hidden="true"></i></sup> </a></h2>
<p>Mostly as a reference to me, a complete list of CSS keywords, relevant to flexbox.  There are too many articles that miss half the detail, so here is a boring list (and see below for grid):</p>
`;
    appendIsland("#point2", str, dom);
    {
      let HTML =
        "<!DOCTYPE html>" + dom.getElementsByTagName("html")[0].outerHTML;
      let err = await validateHTML(HTML);
      assert.equal(err.length, 0, "BEFORE ANYTHING assert #1");
    }
    execHighlight(dom);
    {
      let HTML =
        "<!DOCTYPE html>" + dom.getElementsByTagName("html")[0].outerHTML;
      let err = await validateHTML(HTML);
      assert.equal(err.length, 0, "AFTER highlight assert #2");
    }
    assert.equal(
      dom.querySelectorAll(".hljs.language-css").length,
      1,
      "assert #3",
    );
    assert.equal(
      dom.querySelectorAll('code[lang="css"]').length,
      1,
      "assert #4",
    );
    assert.equal(
      dom.querySelectorAll('code[data-highlighted="yes"]').length,
      1,
      "assert #5",
    );
  });

  it("go 1.2: CSS test3", async () => {
    const [dom, loc, win, jsdom] = page(
      "http://192.168.0.35/resource/home?mobile=1",
      4,
    );
    let str = `<h2 class="dontend" id="toc2"> <a href="#toc2" title="Jump to this section." > Prototype Toy  <sup><i class="fa fa-link invert" aria-label="Jump this to this section." aria-hidden="true"></i></sup> </a></h2>
<p>UPDATE: also <a href="https://flexboxzombies.com/p/flexbox-zombies" target="_blank">this toy^H^H^Hgame</a> <br />
As a minimum, not recommended for industrial use:</p>

<code class="highlight dontsplit" lang="css">
.table .tr { text-align:center; display:flex; flex-flow:
           row nowrap; width:100%; }
.table .tr .td { text-align:center;  justify-content: 
           space-between; flex-grow: 1; flex-basis: 0; 
           flex:1; padding:0.5em; }
/* the 3rd column needs more space */
.table .tr .td:nth-child(3) { flex:2; }
.table .thead { /* ... */ }
</code>

<h2 class="dontend" id="toc3"> <a href="#toc3" title="Jump to this section." > Keywords <sup><i class="fa fa-link invert" aria-label="Jump this to this section." aria-hidden="true"></i></sup> </a></h2>
<p>Mostly as a reference to me, a complete list of CSS keywords, relevant to flexbox.  There are too many articles that miss half the detail, so here is a boring list (and see below for grid):</p>
`;
    appendIsland("#point2", str, dom);
    {
      let HTML =
        "<!DOCTYPE html>" + dom.getElementsByTagName("html")[0].outerHTML;
      let err = await validateHTML(HTML);
      assert.equal(err.length, 0, "BEFORE ANYTHING assert #6");
    }
    execHighlight(dom);
    {
      let HTML =
        "<!DOCTYPE html>" + dom.getElementsByTagName("html")[0].outerHTML;
      let err = await validateHTML(HTML);
      assert.equal(err.length, 0, "AFTER highlight assert #7");
    }
    assert.equal(
      dom.querySelectorAll(".hljs.language-css").length,
      1,
      "assert #8",
    );
    assert.equal(
      dom.querySelectorAll('code[lang="css"]').length,
      1,
      "assert #9",
    );
    assert.equal(
      dom.querySelectorAll('code[data-highlighted="yes"]').length,
      1,
      "assert #10",
    );
  });

  it("go 1.1: CSS test2", async () => {
    const [dom, loc, win, jsdom] = page("http://192.168.0.35/resource/home", 4);
    let str = `<h2 class="dontend" id="toc2"> <a href="#toc2" title="Jump to this section." > Prototype Toy  <sup><i class="fa fa-link invert" aria-label="Jump this to this section." aria-hidden="true"></i></sup> </a></h2>
<p>UPDATE: also <a href="https://flexboxzombies.com/p/flexbox-zombies" target="_blank">this toy^H^H^Hgame</a> <br />
As a minimum, not recommended for industrial use:</p>

<code id="replacement" lang="css">
.table .tr { text-align:center; display:flex; flex-flow:
           row nowrap; width:100%; }
.table .tr .td { text-align:center;  justify-content: 
           space-between; flex-grow: 1; flex-basis: 0; 
           flex:1; padding:0.5em; }
/* the 3rd column needs more space */
.table .tr .td:nth-child(3) { flex:2; }
.table .thead { /* ... */ }
</code>

<h2 class="dontend" id="toc3"> <a href="#toc3" title="Jump to this section." > Keywords <sup><i class="fa fa-link invert" aria-label="Jump this to this section." aria-hidden="true"></i></sup> </a></h2>
<p>Mostly as a reference to me, a complete list of CSS keywords, relevant to flexbox.  There are too many articles that miss half the detail, so here is a boring list (and see below for grid):</p>
`;
    appendIsland("#point2", str, dom);
    {
      let HTML =
        "<!DOCTYPE html>" + dom.getElementsByTagName("html")[0].outerHTML;
      let err = await validateHTML(HTML);
      assert.equal(err.length, 0, "BEFORE ANYTHING assert #11");
    }
    // planB  https://stackoverflow.com/a/77494402
    str = `@font-face {
    font-family: '$englishname';
    src url('$name.woff2') format('woff2'),
        url('$name.woff') format('woff');
    font-weight: normal;
    font-style: normal; 
    font-display: fallback;
 } `;
    try {
      let highlightedCode = hljs.highlight(str, { language: "css" }).value;
      dom.getElementById("replacement").innerHTML = highlightedCode;
      assert.equal(1, 1, "Highlight made no errorsi assert #12");
    } catch (e) {
      assert.equal(1, 2, "Highlight on this block failed [assert #13] " + e);
    }
    //	console.log("WWWW", dom.getElementById('replacement').outerHTML );
  });
});
