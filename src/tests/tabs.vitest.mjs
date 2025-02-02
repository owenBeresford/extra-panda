import { assert, describe, it } from "vitest";

import { page } from "./page-seed-vite";
import { TEST_ONLY } from "../tabs";
import { appendIsland } from "../dom-base";
import { createEvent, enableGetEventListeners } from "./vitest-addons";

const { tabChange, initTabs } = TEST_ONLY;
// see HTML driven version, but fails as it needs Js for exclusive group https://codepen.io/anon/pen/YPyPVY

describe("TEST tabs", () => {
  it("go 1: tabChange ", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/home?debug=1",
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

  it("go 2: initTabs ", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/home?debug=1",
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
    initTabs(dom, loc);

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

  it("go 2.1: initTabs ", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/home?debug=1#blockProjects",
      3,
    );
    let str = `<div class="chunkArticles column tabCopmponent">
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

    initTabs(dom, loc);

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
});
