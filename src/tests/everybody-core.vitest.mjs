import { assert, describe, it } from "vitest";
import { JSDOM } from 'jsdom';

import { TEST_ONLY } from '../core';
import { appendIsland, setIsland, isFullstack, isMobile } from '../dom-base';
import { enableGetEventListeners, createEvent } from './vitest-addons';
// So, everybody...     so auto-magic happens
import * as Types from '../all-types';
import * as Vanilla from '../code-collection';
import * as StringBase from '../string-base';
import * as DOMBase from '../dom-base';
import * as Effect from '../effect';
import * as Masto from '../mastodon';
import * as Core from '../core';
import * as Adjacent from '../adjacent';
import * as Biblio1 from '../desktop-biblio';
import * as Biblio2 from '../mobile-biblio';
import * as Reading from '../reading';

const {
 siteCore
} = TEST_ONLY;

// this function needs to be local to each test file, as the HTML will be different
function page(url ) {
	const dom = new JSDOM(`<!DOCTYPE html>
<html>
	<head><title>test1</title></head>
	<body>
		<div class="reading" id="shareGroup"></div>
		<div id="point1"></div>
		<div id="point2" class="blocker"></div>
	</body>
</html>`, { url:url, referrer:url });
	return [dom.window.document, dom.window.location, dom.window];
}

describe("TEST core", () => {
	let ram1=0;
	if(process) { ram1=process.memoryUsage(); }

  it("go 6: siteCore", (context) => {
	const [dom, loc, win] =page('http://192.168.0.35/resource/react18-notes?mobile=0');
	let str=`<div id="navBar"> 
				<span class="allButtons"> 
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

<fieldset class="h4_menu column bigScreenOnly">
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
	<dialog id="popup" >
	<span id="sendMasto">TICK</span> <span id="hideMasto">CROSS</span>
	<input id="mastodonserver" value="panda.testing" data-url="http://192.168.0.66/resource/home?" /> 
	</dialog> 

</div>`;
	appendIsland('#point2', str, dom );

	siteCore({}, dom, loc, win);
	assert.equal(1, 2, "NOTE Test not usable until I build a way to override runFetch() assert #17");
	});

  it("go 6.1: siteCore", (context) => {
	const [dom, loc, win] =page('http://192.168.0.35/resource/home?mobile=0');
	let str=`<div id="navBar"> 
				<span class="allButtons"> 
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

<fieldset class="h4_menu column bigScreenOnly">
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
</div>`;
	appendIsland('#point2', str, dom );

// function siteCore(opts:CoreProps, dom=document, loc=location, win:Window=window):void 
	siteCore({} );
// auto appear param to see what happens
	assert.equal(1, 2, "NOTE Test not usable until I build a way to override runFetch() assert #17");
	});
// IOIO FIXME: more tests needed, but clear assert#1 first

	let ram2=0;
	if(process) { ram2=	process.memoryUsage(); }
 
	if(ram1!==0) {		
		console.log("RAM used to make JSDOM: "+ (ram2.heapUsed- ram1.heapUsed) );
	}

});
