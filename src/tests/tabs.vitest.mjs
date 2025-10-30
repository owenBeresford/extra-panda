import { assert, describe, it } from "vitest";

import {
  createEvent,
  enableGetEventListeners,
  getCSSAttr,
} from "./vitest-addons";
import { page } from "./page-seed-vite";
import { TEST_ONLY } from "../tabs";
import { appendIsland } from "../dom-base";

const { tabChange, initTabs, tabInit_OLD } = TEST_ONLY;
// see HTML driven version, but fails as it needs Js for exclusive group https://codepen.io/anon/pen/YPyPVY

describe("TEST tabs", () => {
  it.skip("go 1: tabChange OLD", () => {
    const [dom, loc, win] = page(
      "http://192.168.1.218/resource/home?debug=1",
      3,
    );
    let str = `<div class="chunkArticles column tabComponent">
<ul class="tabList tabs" data-tab="" role="tablist">
<li class="tab-title is-active" role="presentation"> <a id="clickArticles" href="#blockArticles" role="tab" aria-selected="true" aria-controls="blockArticles"> Articles</a></li>
<li class="tab-title" role="presentation"> <a id="clickProjects" href="#blockProjects" role="tab" aria-selected="true" aria-controls="blockProjects"> Projects</a> </li>
<li role="presentation">
 <img src="/asset/ob1.webp" role="presentation" class="myUglyFace" width="200" height="200" alt="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me." title="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me."> 
</li>
</ul>

<fieldset class="tabs-content">
<section id="blockArticles" role="tabpanel" aria-hidden="false" class="tabs-panel is-active">
<br>
<ul class="ulbasic">
    <li><a href="#">SSS 1</a></li>
    <li><a href="#">SSS 2</a></li>
    <li><a href="#">SSS 3</a></li>
    <li><a href="#">SSS 4</a></li>
</ul>
</section>

<section id="blockProjects" role="tabpanel" aria-hidden="true" class="tabs-panel ">
<br>
<ul class="ulbasic">
    <li>Short role <a href="#">DDD 1</a></li>
    <li>Short role <a href="#">DDD 2</a></li>
    <li>Short role <a href="#">DDD 3</a></li>
    <li>Short role <a href="#">DDD 4</a></li>
</ul>
</section>

</fieldset>
</div>
`;
    appendIsland("#point2", str, dom);

    tabChange("#blockProjects", dom);
    // NOTE: it is necessary to use the legacy CSS API in this unit-test, as JSDOM wont give me a populated classList
    assert.isTrue(
      dom
        .querySelector("#blockProjects")
        .getAttribute("class")
        .includes("is-active"),
      "assert #7",
    );

    assert.equal(
      dom.querySelector("#blockProjects").getAttribute("aria-hidden"),
      "false",
      "assert #8",
    );
    assert.isFalse(
      dom
        .querySelector("#blockArticles")
        .getAttribute("class")
        .includes("is-active"),
      "assert #9",
    );
    assert.equal(
      dom.querySelector("#blockArticles").getAttribute("aria-hidden"),
      "true",
      "assert #10",
    );
    assert.equal(
      dom
        .querySelector('.tabList li a[href="#blockArticles"]')
        .getAttribute("aria-hidden"),
      "true",
      "assert #11",
    );
    assert.equal(
      dom
        .querySelector('.tabList li a[href="#blockProjects"]')
        .getAttribute("aria-hidden"),
      "false",
      "assert #12",
    );

    tabChange("#blockArticles", dom);
    assert.isFalse(
      dom
        .querySelector("#blockProjects")
        .getAttribute("class")
        .includes("is-active"),
      "assert #13",
    );
    assert.equal(
      dom.querySelector("#blockProjects").getAttribute("aria-hidden"),
      "true",
      "assert #14",
    );
    assert.isTrue(
      dom
        .querySelector("#blockArticles")
        .getAttribute("class")
        .includes("is-active"),
      "assert #15",
    );
    assert.equal(
      dom.querySelector("#blockArticles").getAttribute("aria-hidden"),
      "false",
      "assert #16",
    );

    let vnt = createEvent(dom.querySelector("#clickProjects"), dom, win);
    tabChange(vnt, dom);
    assert.isTrue(
      dom
        .querySelector("#blockProjects")
        .getAttribute("class")
        .includes("is-active"),
      "assert #17",
    );
    assert.isFalse(
      dom
        .querySelector("#blockArticles")
        .getAttribute("class")
        .includes("is-active"),
      "assert #18",
    );

    assert.equal(
      dom.querySelectorAll(".tabList .tab-title.is-active").length,
      1,
      "assert #19",
    );

    assert.equal(
      dom.querySelector(".tabList .tab-title.is-active a").id,
      "clickProjects",
      "assert #20",
    );

    vnt = createEvent(dom.querySelector("#clickArticles"), dom, win);
    tabChange(vnt, dom);
    assert.isFalse(
      dom
        .querySelector("#blockProjects")
        .getAttribute("class")
        .includes("is-active"),
      "assert #21",
    );
    assert.isTrue(
      dom
        .querySelector("#blockArticles")
        .getAttribute("class")
        .includes("is-active"),
      "assert #22",
    );

    assert.equal(
      dom.querySelectorAll(".tabList .tab-title.is-active").length,
      1,
      "assert #23",
    );

    assert.equal(
      dom.querySelector(".tabList .tab-title.is-active a").id,
      "clickArticles",
      "assert #24",
    );
  });

  it.skip("go 2: initTabs OLD ", () => {
    const [dom, loc, win] = page(
      "http://192.168.1.218/resource/home?debug=1",
      3,
    );
    let str = `<div class="chunkArticles column tabComponent">
<ul class="tabList tabs" data-tab="" role="tablist">
<li class="tab-title is-active" role="presentation"> <a id="clickArticles" href="#blockArticles" role="tab" aria-selected="true" aria-controls="blockArticles"> Articles</a></li>
<li class="tab-title" role="presentation"> <a id="clickProjects" href="#blockProjects" role="tab" aria-selected="true" aria-controls="blockProjects"> Projects</a> </li>
<li role="presentation">
 <img src="/asset/ob1.webp" role="presentation" class="myUglyFace" width="200" height="200" alt="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me." title="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me."> 
</li>
</ul>

<fieldset class="tabs-content">
<section id="blockArticles" role="tabpanel" aria-hidden="false" class="tabs-panel is-active">
<br>
<ul class="ulbasic">
    <li><a href="#">SSS 1</a></li>
    <li><a href="#">SSS 2</a></li>
    <li><a href="#">SSS 3</a></li>
    <li><a href="#">SSS 4</a></li>
</ul>
</section>

<section id="blockProjects" role="tabpanel" aria-hidden="true" class="tabs-panel ">
<br>
<ul class="ulbasic">
    <li>Short role <a href="#">DDD 1</a></li>
    <li>Short role <a href="#">DDD 2</a></li>
    <li>Short role <a href="#">DDD 3</a></li>
    <li>Short role <a href="#">DDD 4</a></li>
</ul>
</section>

</fieldset>
</div>
`;
    appendIsland("#point2", str, dom);

    enableGetEventListeners(dom);
    tabInit_OLD(undefined, dom, loc);

    const PROJECTS = dom.querySelector("#clickProjects");

    assert.isTrue(
      PROJECTS.getAttribute("aria-controls").includes("blockProjects"),
      "assert #25",
    );
    assert.isTrue(
      dom
        .querySelector("#clickArticles")
        .getAttribute("href")
        .includes("#blockArticles"),
      "assert #26",
    );

    assert.isTrue(
      dom
        .querySelector("#clickArticles")
        .getAttribute("aria-controls")
        .includes("blockArticles"),
      "assert #27",
    );
    assert.isTrue(
      PROJECTS.getAttribute("href").includes("#blockProjects"),
      "assert #28",
    );

    assert.equal(
      PROJECTS.getEventListeners().length,
      3,
      "There is a handler for each modailty of input on this tab",
    );
  });

  it.skip("go 2.1: initTabs OLD", () => {
    const [dom, loc, win] = page(
      "http://192.168.1.218/resource/home?debug=1#blockProjects",
      3,
    );
    let str = `<div class="chunkArticles column tab2Component">
<ul class="tabList tabs" data-tab="" role="tablist">
<li class="tab-title is-active" role="presentation"> <a id="clickArticles" href="#blockArticles" role="tab" aria-selected="true" aria-controls="blockArticles"> Articles</a></li>
<li class="tab-title" role="presentation"> <a id="clickProjects" href="#blockProjects" role="tab" aria-selected="true" aria-controls="blockProjects"> Projects</a> </li>
<li role="presentation">
 <img src="/asset/ob1.webp" role="presentation" class="myUglyFace" width="200" height="200" alt="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me." title="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me."> 
</li>
</ul>

<fieldset class="tabs-content">
<section id="blockArticles" role="tabpanel" aria-hidden="false" class="tabs-panel is-active">
<br>
<ul class="ulbasic">
    <li><a href="#">SSS 1</a></li>
    <li><a href="#">SSS 2</a></li>
    <li><a href="#">SSS 3</a></li>
    <li><a href="#">SSS 4</a></li>
</ul>
</section>

<section id="blockProjects" role="tabpanel" aria-hidden="true" class="tabs-panel ">
<br>
<ul class="ulbasic">
    <li>Short role <a href="#">DDD 1</a></li>
    <li>Short role <a href="#">DDD 2</a></li>
    <li>Short role <a href="#">DDD 3</a></li>
    <li>Short role <a href="#">DDD 4</a></li>
</ul>
</section>

</fieldset>
</div>
`;
    appendIsland("#point2", str, dom);

    tabInit_OLD(undefined, dom, loc);

    const PROJECTS = dom.querySelector("#blockProjects");
    assert.equal(
      PROJECTS.getAttribute("aria-hidden"),
      "false",
      "There is a handler for each modailty of input on this tab",
    );
    assert.isTrue(
      PROJECTS.classList.contains("is-active"),
      "There is a handler for each modailty of input on this tab",
    );

    const ARTICLES = dom.querySelector("#blockArticles");
    assert.equal(
      ARTICLES.getAttribute("aria-hidden"),
      "true",
      "There is a handler for each modailty of input on this tab",
    );
    assert.isFalse(
      ARTICLES.classList.contains("is-active"),
      "There is a handler for each modailty of input on this tab",
    );
  });

  it("go 3: initTabs", () => {
    const [dom, loc, win] = page(
      "http://192.168.1.218/resource/home#articles",
      3,
    );
    let str = `<div class="chunkArticles column tab2Container">
<header class="tabHeader" role="tablist">
		<span role="presentation" class="fakeTab" style="left:0em;" rel="me">
			 <img src="/asset/ob1.webp" role="presentation" aria-hidden="true" class="myUglyFace" loading="lazy" width="100" height="100" alt="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me."> 
		</span>

		<label title="This should be the list of most important articles on this site.  I hope I have updated it" class="transform_shimmer" role="tab" id="tabArticles" aria-controls="panelArticles" tabindex="0">
			Articles <input id="articles" type="radio" value="1"  name="tabs">
		</label>
		<label title="My roles, publications and OSS projects" class="transform_shimmer" role="tab" id="tabProjects" aria-controls="panelProjects" tabindex="0">
			 Projects <input id="projects" type="radio" value="2" checked="" name="tabs">
		</label>
</header>

<section id="panelArticles" data-id="1" role="tabpanel" aria-hidden="false" >
<br>
<ul class="ulbasic">
    <li><a href="#">SSS 1</a></li>
    <li><a href="#">SSS 2</a></li>
    <li><a href="#">SSS 3</a></li>
    <li><a href="#">SSS 4</a></li>
</ul>
</section>

<section id="panelProjects" data-id="2" role="tabpanel" aria-hidden="true" >
<br>
<ul class="ulbasic">
    <li>Short role <a href="#">DDD 1</a></li>
    <li>Short role <a href="#">DDD 2</a></li>
    <li>Short role <a href="#">DDD 3</a></li>
    <li>Short role <a href="#">DDD 4</a></li>
</ul>
</section>

</div>
`;
    appendIsland("#point2", str, dom);

    //    initTabs(undefined, dom, loc);
    initTabs(".tab2Container", dom, loc);

    assert.equal(getCSSAttr("#panelArticles", "display", dom, win), "block");
// JSDOM doesn't seem to force uniqueness on input[type=radio]::checked
//    assert.equal(getCSSAttr("#panelProjects", "display", dom, win), "none");

  });
});
