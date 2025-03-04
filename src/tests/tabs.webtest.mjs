import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { delay } from "../networking";
import { appendIsland } from '../dom-base';
import { log, domLog } from '../log-services';
import { createEvent, getCSSAttr } from "./vitest-addons";
import { TEST_ONLY } from "../tabs";

const { tabChange, initTabs, newInitState } = TEST_ONLY;

describe("TEST BROWSER CSS based tabs", async () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }

  it("go 1: default first state", async () => {
    const TEST_NAME = "BROWSER TEST func[1] default first state ";
    return await wrap(
      TEST_NAME,
      "/home2.html?debug=1",
      async (dom, loc, win) => {
	    let str = `<div class="chunkArticles column tabContainer">
<span role="presentation" class="fakeTab">
 <img src="/asset/ob1.webp" role="presentation" class="myUglyFace" width="200" height="200" alt="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me." title="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me." /> 
</span>

<fieldset class="tabs-content" >
<legend>
<label> Articles <input type="radio" value="articles" name="tabs" id="btn1" checked /> </label>
</legend>
<br>
<ul class="ulbasic">
    <li><a href="#">SSS 1</a></li>
    <li><a href="#">SSS 2</a></li>
    <li><a href="#">SSS 3</a></li>
    <li><a href="#">SSS 4</a></li>
</ul>
</fieldset>

<fieldset class="tabs-content" >
<legend>
<label> Projects <input type="radio" value="projects" name="tabs" id="btn2" /> </label>
</legend>
<br>
<ul class="ulbasic">
    <li>Short role <a href="#">DDD 1</a></li>
    <li>Short role <a href="#">DDD 2</a></li>
    <li>Short role <a href="#">DDD 3</a></li>
    <li>Short role <a href="#">DDD 4</a></li>
</ul>
</fieldset>
</div>
`;
 //   	appendIsland(".chunkArticles", str, dom);

// in this file pay attention to HTML ids
    const [BTN2, BTN1] = dom.querySelectorAll("#btn2, #btn1");
	
	expect(getCSSAttr('fieldset:has( #btn1 ) ul', 'display', dom, win)).toBe('inline-block');
	expect(getCSSAttr('fieldset:has( #btn2 ) ul', 'display', dom, win)).toBe('none');

	const EVT1= createEvent( BTN1, dom, win);
	expect( dom.body.dispatchEvent(EVT1) ).toBe(true);

	expect(getCSSAttr('fieldset:has( #btn2 ) ul', 'display', dom, win)).toBe('inline-block');
	expect(getCSSAttr('fieldset:has( #btn1 ) ul', 'display', dom, win)).toBe('none');
 
        await delay(100);
      }, );
  });

  it("go 2: setInitState", async () => {
    const TEST_NAME = "BROWSER TEST func[1] setInitState ";
    return await wrap(
      TEST_NAME,
      "/home2.html?debug=1#projects",
      async (dom, loc, win) => {

	    let str = `<div class="chunkArticles column tabContainer">
<span role="presentation" class="fakeTab">
 <img src="/asset/ob1.webp" role="presentation" class="myUglyFace" width="200" height="200" alt="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me." title="Many bloggers say adding a photo of yourself makes it look more authentic. IMO, my face is not a reason to hire me." /> 
</span>

<fieldset class="tabs-content" >
<legend>
<label> Articles <input type="radio" value="articles" name="tabs" id="btn1" checked /> </label>
</legend>
<br>
<ul class="ulbasic">
    <li><a href="#">SSS 1</a></li>
    <li><a href="#">SSS 2</a></li>
    <li><a href="#">SSS 3</a></li>
    <li><a href="#">SSS 4</a></li>
</ul>
</fieldset>

<fieldset class="tabs-content" >
<legend>
<label> Projects <input type="radio" value="projects" name="tabs" id="btn2" /> </label>
</legend>
<br>
<ul class="ulbasic">
    <li>Short role <a href="#">DDD 1</a></li>
    <li>Short role <a href="#">DDD 2</a></li>
    <li>Short role <a href="#">DDD 3</a></li>
    <li>Short role <a href="#">DDD 4</a></li>
</ul>
</fieldset>
</div>
`;
// domLog("chunkArticles should be enhanced", false, false );
//    	appendIsland(".chunkArticles", str, dom);

// in this file pay attention to HTML ids
    const [BTN2, BTN1] = dom.querySelectorAll("#btn2, #btn1");
	
	expect(getCSSAttr('fieldset:has( #btn2 ) ul', 'display', dom, win)).toBe('inline-block');
	expect(getCSSAttr('fieldset:has( #btn1 ) ul', 'display', dom, win)).toBe('none');

	const EVT1= createEvent( BTN1, dom, win);
	expect( dom.body.dispatchEvent(EVT1) ).toBe(true);

	expect(getCSSAttr('fieldset:has( #btn1 ) ul', 'display', dom, win)).toBe('inline-block');
	expect(getCSSAttr('fieldset:has( #btn2 ) ul', 'display', dom, win)).toBe('none');
        await delay(100);
      }, );
  });

});

execTest(run);
