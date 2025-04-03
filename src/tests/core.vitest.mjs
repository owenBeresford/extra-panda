import { assert, describe, it } from "vitest";

import { page } from "./page-seed-vite";
import { TEST_ONLY } from "../core";
import { appendIsland } from "../dom-base";
import { createEvent } from "./vitest-addons";

const { burgerMenu, initPopupMobile } = TEST_ONLY;

describe("TEST core", () => {
  it("go 1: burgerMeu", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/home", 2);
    let str = `<fieldset class="h4_menu column bigScreenOnly">
<legend><span id="pageMenu"><i class="fa fa-ob1burger" aria-hidden="true"></i> </span></legend>
<menu class="h4_lean">
</menu>
<br>
</fieldset>

<menu class="burgerMenu">
<li class="h4_odd">Additional features</li>
<li class=""><a href="/resource/home"><i class="fa fa-angle-left" aria-hidden="true"></i> Home</a> </li> 
<li class="h4_odd"><a href="/resource/search">Search <i class="fa fa-angle-right" aria-hidden="true"></i></a></li>
<li class=""><a href="/resource/appearance">Appearance <i class="fa fa-angle-right" aria-hidden="true"></i></a></li>
<li class="h4_odd"><a href="/resource/contact-me">Contact me <i class="fa fa-angle-right" aria-hidden="true"></i></a></li>
<li class=""><a href="#contentGroup">Similar articles</a></li>
</menu>
`;
    appendIsland("#point2", str, dom);
    assert.isTrue(
      dom
        .querySelector("#pageMenu i")
        .getAttribute("class")
        .includes("fa-ob1burger"),
      "assert #1",
    );
    assert.equal(
      dom.querySelector(".burgerMenu").getAttribute("data-state"),
      null,
      "assert #2",
    );
    burgerMenu(".burgerMenu", dom);
    assert.isFalse(
      dom
        .querySelector("#pageMenu i")
        .getAttribute("class")
        .includes("fa-ob1burger"),
      "assert #3",
    );
    assert.equal(
      dom.querySelector(".burgerMenu").getAttribute("data-state"),
      "1",
      "assert #4",
    );

    burgerMenu(".burgerMenu", dom);
    assert.isTrue(
      dom
        .querySelector("#pageMenu i")
        .getAttribute("class")
        .includes("fa-ob1burger"),
      "assert #5",
    );
    assert.equal(
      dom.querySelector(".burgerMenu").getAttribute("data-state"),
      "",
      "assert #6",
    );
  });

  it("go 5: initPopupMobile", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/home?mobile=1&debug=1",
      3,
    );
    let str = `<div id="navBar"> 
<span class="SMshareWidget"> 
						<a id="siteChartLink" class="button smallScreenOnly" href="/resource/site-chart" title="open a webpage of what articles this site holds.">Sitemap</a>
						<a id="rssLink" href="https://192.168.0.35/resource/rss" title="Access the sites RSS feed."> <i class="fa fa-rss" aria-label="Open the RSS for this site." aria-hidden="true"></i> </a> 
						<span class="button smallScreenOnly" id="shareMenuTrigger" rel="nofollow"> Share </span>
						<span class="bigScreenOnly">Share: </span>
                        <a href="https://twitter.com/intent/tweet?text=I+think+this+is+important+https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" title="Share this resource on your twitter account." target="_blank" class="bigScreenOnly"> <i class="fa fa-twitter" aria-label="Share this resource on your twitter account." aria-hidden="true"></i></a>
						<a href="#" id="mastoTrigger" class="masto bigScreenOnly" title="Share this article with *your* mastodon instance">	<i class="fa fa-mastodon" aria-label="Share this article on *your* mastodon instance." aria-hidden="true"></i> </a>
						<a href="https://www.reddit.com/submit?url=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" target="_blank" title="Share this article with your Reddit audience" class="bigScreenOnly"><i aria-label="Share this article with your Reddit audience." class="fa fa-reddit-square" aria-hidden="true"></i></a>
						<a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" target="_blank" class="bigScreenOnly" title="Share current article with your linked-in audience."><i class="fa fa-linkedin-square" aria-hidden="true" aria-label="Share this article with your linked-in audience."></i></a>
						<a title="Share current article with Hacker news/ Y combinator audience" target="_blank" class="bigScreenOnly" href="http://news.ycombinator.com/submitlink?u=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette&amp;t=3D+effects+demo%2F+maquette"> <i class="fa fa-hacker-news" aria-label="Share this article with your Y combinator audience." aria-hidden="true"> </i></a>
						<a title="Share this article with your Xing audience." href="https://www.xing.com/spi/shares/new?url=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" target="_blank" class="bigScreenOnly"><i class="fa fa-xing-square" aria-hidden="true" aria-label="Share this article with your Xing audience."></i> </a>
					</span>
	<dialog id="popup" >
	<span id="sendMasto">TICK</span> <span id="hideMasto">CROSS</span>
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog>

</div>`;
    appendIsland("#point2", str, dom);
    // mobile yes, local yes
    initPopupMobile(dom, loc, win);
    assert.isTrue(dom.querySelector("#mobileMenu") !== undefined, "Assert #23");

    assert.equal(dom.querySelectorAll("#mobileMenu a").length, 7, "Assert #24");
  });

  it("go 5.1: initPopupMobile", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/home?mobile=0&debug=1",
      3,
    );
    let str = `<div id="navBar">
<span class="SMshareWidget"> 
						<a id="siteChartLink" class="button smallScreenOnly" href="/resource/site-chart" title="open a webpage of what articles this site holds.">Sitemap</a>
						<a id="rssLink" href="https://192.168.0.35/resource/rss" title="Access the sites RSS feed."> <i class="fa fa-rss" aria-label="Open the RSS for this site." aria-hidden="true"></i> </a> 
						<span class="button smallScreenOnly" id="shareMenuTrigger" rel="nofollow"> Share </span>
						<span class="bigScreenOnly">Share: </span>
                        <a href="https://twitter.com/intent/tweet?text=I+think+this+is+important+https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" title="Share this resource on your twitter account." target="_blank" class="bigScreenOnly"> <i class="fa fa-twitter" aria-label="Share this resource on your twitter account." aria-hidden="true"></i></a>
						<a href="#" id="mastoTrigger" class="masto bigScreenOnly" title="Share this article with *your* mastodon instance">	<i class="fa fa-mastodon" aria-label="Share this article on *your* mastodon instance." aria-hidden="true"></i> </a>
						<a href="https://www.reddit.com/submit?url=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" target="_blank" title="Share this article with your Reddit audience" class="bigScreenOnly"><i aria-label="Share this article with your Reddit audience." class="fa fa-reddit-square" aria-hidden="true"></i></a>
						<a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" target="_blank" class="bigScreenOnly" title="Share current article with your linked-in audience."><i class="fa fa-linkedin-square" aria-hidden="true" aria-label="Share this article with your linked-in audience."></i></a>
						<a title="Share current article with Hacker news/ Y combinator audience" target="_blank" class="bigScreenOnly" href="http://news.ycombinator.com/submitlink?u=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette&amp;t=3D+effects+demo%2F+maquette"> <i class="fa fa-hacker-news" aria-label="Share this article with your Y combinator audience." aria-hidden="true"> </i></a>
						<a title="Share this article with your Xing audience." href="https://www.xing.com/spi/shares/new?url=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" target="_blank" class="bigScreenOnly"><i class="fa fa-xing-square" aria-hidden="true" aria-label="Share this article with your Xing audience."></i> </a>
					</span>
	<dialog id="popup" >
	<span id="sendMasto">TICK</span> <span id="hideMasto">CROSS</span>
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog> 

 </div>`;
    appendIsland("#point2", str, dom);
    // mobile no, local yes
    initPopupMobile(dom, loc, win);
    assert.isTrue(dom.querySelector("#mobileMenu") !== undefined, "Assert #25");
    assert.equal(dom.querySelectorAll("#mobileMenu a").length, 7, "Assert #26");
  });

  it("go 5.2: initPopupMobile", () => {
    const [dom, loc, win] = page(
      "http://6.6.6.6/resource/home?mobile=1&debug=1",
      3,
    );
    let str = `<div id="navBar">
				<span class="SMshareWidget"> 
						<a id="siteChartLink" class="button smallScreenOnly" href="/resource/site-chart" title="open a webpage of what articles this site holds.">Sitemap</a>
						<a id="rssLink" href="https://192.168.0.35/resource/rss" title="Access the sites RSS feed."> <i class="fa fa-rss" aria-label="Open the RSS for this site." aria-hidden="true"></i> </a> 
						<span class="button smallScreenOnly" id="shareMenuTrigger" rel="nofollow"> Share </span>
						<span class="bigScreenOnly">Share: </span>
                        <a href="https://twitter.com/intent/tweet?text=I+think+this+is+important+https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" title="Share this resource on your twitter account." target="_blank" class="bigScreenOnly"> <i class="fa fa-twitter" aria-label="Share this resource on your twitter account." aria-hidden="true"></i></a>
						<a href="#" id="mastoTrigger" class="masto bigScreenOnly" title="Share this article with *your* mastodon instance">	<i class="fa fa-mastodon" aria-label="Share this article on *your* mastodon instance." aria-hidden="true"></i> </a>
						<a href="https://www.reddit.com/submit?url=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" target="_blank" title="Share this article with your Reddit audience" class="bigScreenOnly"><i aria-label="Share this article with your Reddit audience." class="fa fa-reddit-square" aria-hidden="true"></i></a>
						<a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" target="_blank" class="bigScreenOnly" title="Share current article with your linked-in audience."><i class="fa fa-linkedin-square" aria-hidden="true" aria-label="Share this article with your linked-in audience."></i></a>
						<a title="Share current article with Hacker news/ Y combinator audience" target="_blank" class="bigScreenOnly" href="http://news.ycombinator.com/submitlink?u=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette&amp;t=3D+effects+demo%2F+maquette"> <i class="fa fa-hacker-news" aria-label="Share this article with your Y combinator audience." aria-hidden="true"> </i></a>
						<a title="Share this article with your Xing audience." href="https://www.xing.com/spi/shares/new?url=https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" target="_blank" class="bigScreenOnly"><i class="fa fa-xing-square" aria-hidden="true" aria-label="Share this article with your Xing audience."></i> </a>
					</span>
	<dialog id="popup" >
	<span id="sendMasto">TICK</span> <span id="hideMasto">CROSS</span>
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog> 

 </div>`;
    appendIsland("#point2", str, dom);
    // mobile no, local no
    initPopupMobile(dom, loc, win);
    assert.isTrue(dom.querySelector("#mobileMenu") !== undefined, "Assert #27");
    assert.equal(dom.querySelectorAll("#mobileMenu a").length, 7, "Assert #28");
  });

  // IOIO XXX Add test for running twice
});
