import { assert, describe, it } from "vitest";
import { JSDOM } from "jsdom";

import { page } from "./page-seed";
import { TEST_ONLY } from "../core";
import { _getCookie } from "../networking";
import { appendIsland, setIsland, isFullstack, isMobile } from "../dom-base";
import { enableGetEventListeners, createEvent } from "./vitest-addons";

const { siteCore, injectOpts } = TEST_ONLY;

describe("TEST core HARDCORE MODE (everything at once) ~ e'ribody jazz handz Now!", () => {
  let ram1 = 0;
  if (process) {
    ram1 = process.memoryUsage();
  }

  it("go 6: siteCore (as desktop)", async (context) => {
    let ram1 = 0;
    if (process) {
      ram1 = process.memoryUsage();
    }

    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/architecture?mobile=0",
      3,
    );
    let str = `<div id="navBar"> 
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
	<input id="mastodonserver" value="panda.testing" data-url="giggle.co.uk?" /> 
	</dialog> 

</div>
<main id="main">
<div class="blocker addReferences ">
<h3 class="dontend" id="toc1"> <a href="#toc1" title="Jump to this section."> Current image widgets <sup><i class="fa fa-link invert" aria-label="Jump this to this section." aria-hidden="true"></i></sup> </a></h3>
<ul class="ulbasic">
    <li>React Image Magnifier <a href="https://adamrisberg.github.io/react-image-magnifiers/" target="_blank">demo</a> <a href="https://www.npmjs.com/package/@vanyapr/react-image-magnifiers" target="_blank">npm</a> <a href="https://github.com/vanyapr/react-image-magnifiers" target="_blank">git</a> <a href="https://github.com/vanyapr/react-image-magnifiers#readme" target="_blank">docs</a></li>
    <li>React Spring lightbox <a href="https://www.npmjs.com/package/react-spring-lightbox" target="_blank">npm</a> <a href="https://github.com/tim-soft/react-spring-lightbox" target="_blank">git</a> <a href="https://timellenberger.com" target="_blank">docs</a></li>
    <li>Featherlight <a href="https://www.npmjs.com/package/featherlight" target="_blank">npm</a> <a href="https://github.com/noelboss/featherlight" target="_blank">git</a> <a href="https://noelboss.github.io/featherlight/" target="_blank">docs</a> ~ lightweight jQuery lightbox plugin.  NB: this is 4YO. </li>
    <li>@will2code/react-modal-image <sup><a href="https://www.npmjs.com/package/@will2code/react-modal-image" target="_blank">3</a></sup> <a href="https://github.com/aautio/react-modal-image" target="_blank">git</a> <a href="https://github.com/aautio/react-modal-image#readme" target="_blank">docs</a> ~ is a modal; supports transparent backgrounds; supports Zoom.</li>
    <li>Simple lightbox <a href="https://www.npmjs.com/package/simplelightbox" target="_blank">npm</a> <a href="https://github.com/andreknieriem/simplelightbox" target="_blank">git</a> <a href="https://simplelightbox.com/" target="_blank">docs</a> ~  this is optional jQuery; it supports ALOT of localisation overrides; it supports full mobile interaction;  it uses 6MB on disk.</li>
    <li>Flyout block <a href="https://www.npmjs.com/package/flyout-block" target="_blank">npm</a> <a href="https://github.com/fluidweb-co/flyout-block" target="_blank">git</a> <a href="https://github.com/fluidweb-co/flyout-block#readme" target="_blank">docs</a> ~ doesn't mention frameworks; it's built by processing HTML attributes on standard HTML tags; not widely used from NPM, released this year. </li>
</ul>
<p>I workout several methods to have a zoom and clip of an image.</p>
<ul class="ulbasic">
    <li>Simple CSS for image static scaling: object-fit <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit" target="_blank">1</a></sup>, object-position <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-position" target="_blank">2</a></sup>. This is really useful for browsers where it works <sup><a href="https://caniuse.com/?search=object-fit" target="_blank">3</a></sup>, and should be used for all RWD / PWA designs <sup><a href="https://www.digitalocean.com/community/tutorials/css-cropping-images-object-fit" target="_blank">4</a></sup>.  But this is not a popup/ is not reactive to user input.</li>
    <li>CSS transform:scale <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale" target="_blank">5</a></sup> <sup><a href="https://css-tricks.com/almanac/properties/s/scale/" target="_blank">6</a></sup> older browsers have this feature as zoom <sup><a href="https://www.positioniseverything.net/css-zoom" target="_blank">7</a></sup> <sup><a href="https://css-tricks.com/almanac/properties/z/zoom/" target="_blank">8</a></sup>, but that is deprecated, just like MSIE that started that CSS item.  This should probably be combined with overflow-x/ overflow-y <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x" target="_blank">9</a></sup> to avoid too many scrollbars.</li>
    <li>If using a desktop/ laptop, &lt;cntl + mouse-scroll&gt; will normally zoom.  With many mobile apps pinch will zoom.   Both these are operating system features, but I use them a lot.</li>
    <li>“blitting” or Sprite mapping is an old pre-internet technique for pulling a currently wanted texture from a big texture file; and applying it to what is currently on screen <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path" target="_blank">10</a></sup>.   I have been shying away from doing this is JS/CSS, as I didn't see any libraries, and I didn't want to hand calculate all the maths, <sup><a href="https://css-tricks.com/using-css-clip-path-create-interactive-effects/" target="_blank">11</a></sup> <sup><a href="https://cssfordesigners.com/articles/clip-path-scaling" target="_blank">12</a></sup> has some ideas to avoid manual typing.  Support is less sharp for this feature <sup><a href="https://caniuse.com/?search=css-clip-path" target="_blank">13</a></sup> (looking at colour of support rather than volume).</li>
    <li>A low tech/ inefficient use of bandwidth width, but very stable and very reliable trick is to shoot all you images in very high resolution; and just set the “normal size” image to have fixed pixel sizes; the browser will scale the image <sup><a href="https://www.w3docs.com/snippets/css/how-to-auto-resize-an-image-to-fit-an-html-container.html" target="_blank">14</a></sup>.  Then the popup can use the same image at real size.</li>
</ul>
</div>
</main>
<div id="contentGroup" class="adjacentGroup" data-group="engineering">
<div class="adjacentGroup " id="groupengineering">
<p>TEST</p>
</div>
</div>
<div id="biblio" style="display:none;"></div>
`;
    appendIsland("#point2", str, dom);
    enableGetEventListeners(dom);
    let hash = {
      tabs: [],
      desktopRunFetch: mockt1_1,
      adjacentRunFetch: mockt1_2,
      mobileRunFetch: mockt1_3,
      debug: () => {
        return true;
      },
    };
    injectOpts(hash);
    const CC = _getCookie();
    CC.set(
      "appearance",
      '{"fs":"14pt","ft":"ubuntu","cr":"blue","dn":"ltr"}',
      1,
    );

    await siteCore({}, dom, loc, win);
    assert.equal(
      dom.querySelectorAll("#groupengineering .adjacentList").length,
      1,
      "assert #1",
    );
    assert.equal(
      dom.querySelectorAll("#groupengineering .adjacentList li").length,
      8,
      "assert #2",
    );
    let buf = dom.querySelector("#sendMasto");
    assert.equal(buf.getEventListeners().length, 3, "Assert #3");
    buf = dom.querySelector("#hideMasto");
    assert.equal(buf.getEventListeners().length, 3, "Assert #4");
    buf = dom.querySelector("#shareGroup a.reading");
    assert(buf.textContent, "To read: 1m", "assert #5");

    assert.equal(dom.querySelectorAll("i.fa-book-open").length, 6, "assert #6");
    assert.equal(dom.querySelectorAll("i.fa-github").length, 6, "assert #7");
    assert.equal(dom.querySelectorAll("style").length, 1, "assert #8"); // added by setAppearance

    // add tabs test
    // test modal

    let ram2 = 0;
    if (process) {
      ram2 = process.memoryUsage();
    }
    if (ram1 !== 0) {
      console.log(
        "[INFO] RAM used to make JSDOM: " + (ram2.heapUsed - ram1.heapUsed),
      );
    }
  });

  function mockt1_1() {
    // desktop biblio
    let hh = new Headers();
    hh.append("content-encoding", "application/json");

    return new Promise((good, bad) => {
      let tt = {
        body: [
          {
            url: "https://caniuse.com/?search=%40media",
            desc: "Can I use' provides up-to-date browser support tables for support of front-end web technologies on desktop and mobile web browsers.",
            title: "@media' | Can I use... Support tables for HTML5, CSS3, etc",
            auth: "Alexis Deveria @Fyrd",
            date: 0,
          },
          {
            url: "https://automaticcss.com/accessibility-features/",
            desc: "Automatic.css (ACSS) is committed to helping developers build more accessible websites. While accessibility is a deep and fairly technical topic…",
            title:
              "How Automatic.css is Making Websites More Accessible - Automatic.css",
            auth: "",
            date: 0,
          },
          {
            url: "https://stackoverflow.com/questions/41370741/how-do-i-edit-a-css-variable-using-js",
            desc: "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
            title:
              "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
            auth: "No author for Q&A sites",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency",
            desc: "The prefers-reduced-transparency CSS media feature is used to detect if a user has enabled a setting on their device to reduce the transparent or translucent layer effects used on the device. Switching on such a setting can help improve contrast and readability for some users.",
            title:
              "prefers-reduced-transparency - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/video-dynamic-range",
            desc: "The video-dynamic-range CSS media feature can be used to test the combination of brightness, contrast ratio, and color depth that are supported by the video plane of the user agent and the output device.",
            title: "video-dynamic-range - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://stackoverflow.com/questions/46791052/detect-scale-settings-dpi-with-javascript-or-css",
            desc: "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
            title:
              "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
            auth: "No author for Q&A sites",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio",
            desc: "The aspect-ratio CSS media feature can be used to test the aspect ratio of the viewport.",
            title: "aspect-ratio - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast",
            desc: "The prefers-contrast CSS media feature is used to detect whether the user has requested the web content to be presented with a lower or higher contrast.",
            title: "prefers-contrast - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
        ],
        headers: hh,
        ok: true,
      };
      good(tt);
    });
  }

  function mockt1_2() {
    // adjacent
    let hh = new Headers();
    hh.append("content-encoding", "application/json");

    return new Promise((good, bad) => {
      let tt = {
        body: [
          {
            url: "https://owenberesford.me.uk/resource/architecture",
            desc: "Notes from a course presented by T Gilb, an Agile coach, on Architectures & engineering tools in an Agile environment.  This article attempts to push an important and vast set of ideas and processes into text.",
            title: "Architectures and Agile",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/code-metrics",
            desc: "A colleague didnt understand remarks about refactoring his code",
            title: "Code metrics",
            auth: "Owen Beresford",
            date: 1711467412,
          },
          {
            url: "https://owenberesford.me.uk/resource/paradigm-shift",
            desc: "Borrowed content; discussing the change in engineering approach",
            title: "Paradigm shift",
            auth: "Tim Ottinger @tottinge",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/howto-API",
            desc: "16 Considerations for REST API, construction and why REST API are used.",
            title: "How-to REST API",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/goals",
            desc: "What concepts or areas of development are important.    This is a higher level chart..",
            title: "“Zones of development”",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/performance-engineering",
            desc: "What is my process for performance engineering, sometimes called scaling-up, and is part of growth hacking.  I have improved multiple operational systems.",
            title: "Performance engineering",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/justify-oop",
            desc: "Commercial justification for using common engineering practice of OO.  Please read if you are a business person.",
            title: "The economic and commercial justification for OOP",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/logging",
            desc: "Analysis on logging operational visibility: why to add it and why to remove it",
            title: "Logging observability",
            auth: "Owen Beresford",
            date: 1711455586,
          },
        ],
        headers: hh,
        ok: true,
      };
      good(tt);
    });
  }

  function mockt1_3() {
    // mobile biblio
    let hh = new Headers();
    hh.append("content-encoding", "application/json");

    return new Promise((good, bad) => {
      let tt = {
        body: [
          {
            url: "https://caniuse.com/?search=%40media",
            desc: "Can I use' provides up-to-date browser support tables for support of front-end web technologies on desktop and mobile web browsers.",
            title: "@media' | Can I use... Support tables for HTML5, CSS3, etc",
            auth: "Alexis Deveria @Fyrd",
            date: 0,
          },
          {
            url: "https://automaticcss.com/accessibility-features/",
            desc: "Automatic.css (ACSS) is committed to helping developers build more accessible websites. While accessibility is a deep and fairly technical topic…",
            title:
              "How Automatic.css is Making Websites More Accessible - Automatic.css",
            auth: "",
            date: 0,
          },
          {
            url: "https://stackoverflow.com/questions/41370741/how-do-i-edit-a-css-variable-using-js",
            desc: "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
            title:
              "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
            auth: "No author for Q&A sites",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency",
            desc: "The prefers-reduced-transparency CSS media feature is used to detect if a user has enabled a setting on their device to reduce the transparent or translucent layer effects used on the device. Switching on such a setting can help improve contrast and readability for some users.",
            title:
              "prefers-reduced-transparency - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/video-dynamic-range",
            desc: "The video-dynamic-range CSS media feature can be used to test the combination of brightness, contrast ratio, and color depth that are supported by the video plane of the user agent and the output device.",
            title: "video-dynamic-range - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://stackoverflow.com/questions/46791052/detect-scale-settings-dpi-with-javascript-or-css",
            desc: "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
            title:
              "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
            auth: "No author for Q&A sites",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio",
            desc: "The aspect-ratio CSS media feature can be used to test the aspect ratio of the viewport.",
            title: "aspect-ratio - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast",
            desc: "The prefers-contrast CSS media feature is used to detect whether the user has requested the web content to be presented with a lower or higher contrast.",
            title: "prefers-contrast - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
        ],
        headers: hh,
        ok: true,
      };
      good(tt);
    });
  }

  it("go 6.1: siteCore (as phone)", async (context) => {
    let ram1 = 0;
    if (process) {
      ram1 = process.memoryUsage();
    }

    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/home?mobile=1",
      3,
    );
    let str = `<div id="navBar"> 
        <span class="allButtons"> 
            <a id="siteChartLink" class="button smallScreenOnly" href="/resource/site-chart" title="open a webpage of what articles this site holds.">Sitemap</a>
            <a id="rssLink" href="https://192.168.0.35/resource/rss" title="Access the sites RSS feed."> <i class="fa fa-rss" aria-label="Open the RSS for this site." aria-hidden="true"></i> </a> 
            <span class="button smallScreenOnly" id="shareMenuTrigger" rel="nofollow"> Share </span>
            <span class="bigScreenOnly">Share: </span>
                        <a href="https://twitter.com/intent/tweet?text=I+think+this+is+important+https%3A%2F%2F192.168.0.35%2Fresource%2F3d-effects-maquette" title="Share this resource on your twitter account." target="_blank" class="bigScreenOnly"> <i class="fa fa-twitter" aria-label="Share this resource on your twitter account." aria-hidden="true"></i></a>
            <a href="#" id="mastoTrigger" class="masto bigScreenOnly" title="Share this article with *your* mastodon instance"> <i class="fa fa-mastodon" aria-label="Share this article on *your* mastodon instance." aria-hidden="true"></i> </a>
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
  <input id="mastodonserver" value="panda.testing" data-url="giggle.co.uk?" /> 
  </dialog> 

</div>
<main id="main">
<div class="blocker addReferences ">
<h3 class="dontend" id="toc1"> <a href="#toc1" title="Jump to this section."> Current image widgets <sup><i class="fa fa-link invert" aria-label="Jump this to this section." aria-hidden="true"></i></sup> </a></h3>
<ul class="ulbasic">
    <li>React Image Magnifier <a href="https://adamrisberg.github.io/react-image-magnifiers/" target="_blank">demo</a> <a href="https://www.npmjs.com/package/@vanyapr/react-image-magnifiers" target="_blank">npm</a> <a href="https://github.com/vanyapr/react-image-magnifiers" target="_blank">git</a> <a href="https://github.com/vanyapr/react-image-magnifiers#readme" target="_blank">docs</a></li>
    <li>React Spring lightbox <a href="https://www.npmjs.com/package/react-spring-lightbox" target="_blank">npm</a> <a href="https://github.com/tim-soft/react-spring-lightbox" target="_blank">git</a> <a href="https://timellenberger.com" target="_blank">docs</a></li>
    <li>Featherlight <a href="https://www.npmjs.com/package/featherlight" target="_blank">npm</a> <a href="https://github.com/noelboss/featherlight" target="_blank">git</a> <a href="https://noelboss.github.io/featherlight/" target="_blank">docs</a> ~ lightweight jQuery lightbox plugin.  NB: this is 4YO. </li>
    <li>@will2code/react-modal-image <sup><a href="https://www.npmjs.com/package/@will2code/react-modal-image" target="_blank">3</a></sup> <a href="https://github.com/aautio/react-modal-image" target="_blank">git</a> <a href="https://github.com/aautio/react-modal-image#readme" target="_blank">docs</a> ~ is a modal; supports transparent backgrounds; supports Zoom.</li>
    <li>Simple lightbox <a href="https://www.npmjs.com/package/simplelightbox" target="_blank">npm</a> <a href="https://github.com/andreknieriem/simplelightbox" target="_blank">git</a> <a href="https://simplelightbox.com/" target="_blank">docs</a> ~  this is optional jQuery; it supports ALOT of localisation overrides; it supports full mobile interaction;  it uses 6MB on disk.</li>
    <li>Flyout block <a href="https://www.npmjs.com/package/flyout-block" target="_blank">npm</a> <a href="https://github.com/fluidweb-co/flyout-block" target="_blank">git</a> <a href="https://github.com/fluidweb-co/flyout-block#readme" target="_blank">docs</a> ~ doesn't mention frameworks; it's built by processing HTML attributes on standard HTML tags; not widely used from NPM, released this year. </li>
</ul>
<p>I workout several methods to have a zoom and clip of an image.</p>
<ul class="ulbasic">
    <li>Simple CSS for image static scaling: object-fit <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit" target="_blank">1</a></sup>, object-position <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-position" target="_blank">2</a></sup>. This is really useful for browsers where it works <sup><a href="https://caniuse.com/?search=object-fit" target="_blank">3</a></sup>, and should be used for all RWD / PWA designs <sup><a href="https://www.digitalocean.com/community/tutorials/css-cropping-images-object-fit" target="_blank">4</a></sup>.  But this is not a popup/ is not reactive to user input.</li>
    <li>CSS transform:scale <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale" target="_blank">5</a></sup> <sup><a href="https://css-tricks.com/almanac/properties/s/scale/" target="_blank">6</a></sup> older browsers have this feature as zoom <sup><a href="https://www.positioniseverything.net/css-zoom" target="_blank">7</a></sup> <sup><a href="https://css-tricks.com/almanac/properties/z/zoom/" target="_blank">8</a></sup>, but that is deprecated, just like MSIE that started that CSS item.  This should probably be combined with overflow-x/ overflow-y <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x" target="_blank">9</a></sup> to avoid too many scrollbars.</li>
    <li>If using a desktop/ laptop, &lt;cntl + mouse-scroll&gt; will normally zoom.  With many mobile apps pinch will zoom.   Both these are operating system features, but I use them a lot.</li>
    <li>“blitting” or Sprite mapping is an old pre-internet technique for pulling a currently wanted texture from a big texture file; and applying it to what is currently on screen <sup><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path" target="_blank">10</a></sup>.   I have been shying away from doing this is JS/CSS, as I didn't see any libraries, and I didn't want to hand calculate all the maths, <sup><a href="https://css-tricks.com/using-css-clip-path-create-interactive-effects/" target="_blank">11</a></sup> <sup><a href="https://cssfordesigners.com/articles/clip-path-scaling" target="_blank">12</a></sup> has some ideas to avoid manual typing.  Support is less sharp for this feature <sup><a href="https://caniuse.com/?search=css-clip-path" target="_blank">13</a></sup> (looking at colour of support rather than volume).</li>
    <li>A low tech/ inefficient use of bandwidth width, but very stable and very reliable trick is to shoot all you images in very high resolution; and just set the “normal size” image to have fixed pixel sizes; the browser will scale the image <sup><a href="https://www.w3docs.com/snippets/css/how-to-auto-resize-an-image-to-fit-an-html-container.html" target="_blank">14</a></sup>.  Then the popup can use the same image at real size.</li>
</ul>
</div>
</main>
<div id="contentGroup" class="adjacentGroup" data-group="engineering">
<div class="adjacentGroup " id="groupengineering">
<p>TEST</p>
</div>
</div>
<div id="biblio" style="display:none;"> <br class="blocker"> </div>
`;
    appendIsland("#point2", str, dom);

    enableGetEventListeners(dom);
    let hash = {
      tabs: [],
      desktopRunFetch: mockt2_1,
      adjacentRunFetch: mockt2_2,
      mobileRunFetch: mockt2_3,
      debug: () => {
        return true;
      },
    };
    injectOpts(hash);
    const CC = _getCookie();
    CC.set(
      "appearance",
      '{"fs":"14pt","ft":"ubuntu","cr":"blue","dn":"ltr"}',
      1,
    );

    await siteCore({}, dom, loc, win);
    assert.equal(
      dom.querySelectorAll("#groupengineering .adjacentList").length,
      0,
      "assert #9",
    );
    assert.equal(
      dom.querySelectorAll("#groupengineering p").length,
      2,
      "assert #10",
    );
    assert.equal(
      dom.querySelector("#groupengineering p:nth-child(2)").textContent,
      "As mobile View, use the full page link to the left",
      "assert #11",
    );

    let buf = dom.querySelector("#sendMasto");
    assert.equal(buf.getEventListeners().length, 3, "Assert #12");
    buf = dom.querySelector("#hideMasto");
    assert.equal(buf.getEventListeners().length, 3, "Assert #13");
    // this is absent for mobile
    //   buf = dom.querySelector("#shareGroup a.reading");
    //   assert(buf.textContent, "To read: 1m", "assert #14");

    assert.equal(
      dom.querySelectorAll("i.fa-book-open").length,
      6,
      "assert #15",
    );
    assert.equal(dom.querySelectorAll("i.fa-github").length, 6, "assert #16");
    assert.equal(dom.querySelectorAll("style").length, 1, "assert #17"); // added by setAppearance

    assert.equal(
      dom.querySelectorAll("ol.mobileBiblo").length,
      1,
      "assert #18",
    );
    assert.equal(
      dom.querySelectorAll("ol.mobileBiblo li").length,
      8,
      "assert #19",
    );
    assert.equal(
      dom.querySelectorAll("ol.mobileBiblo li a").length,
      8,
      "assert #20",
    );
    assert.equal(
      dom.querySelectorAll("ol.mobileBiblo li a h5").length,
      8,
      "assert #21",
    );

    // add tabs test
    // test modal

    let ram2 = 0;
    if (process) {
      ram2 = process.memoryUsage();
    }

    if (ram1 !== 0) {
      console.log(
        "[INFO] RAM used to make JSDOM: " + (ram2.heapUsed - ram1.heapUsed),
      );
    }
  });

  function mockt2_1() {
    // desktop biblio
    let hh = new Headers();
    hh.append("content-encoding", "application/json");

    return new Promise((good, bad) => {
      let tt = {
        body: [
          {
            url: "https://caniuse.com/?search=%40media",
            desc: "Can I use' provides up-to-date browser support tables for support of front-end web technologies on desktop and mobile web browsers.",
            title: "@media' | Can I use... Support tables for HTML5, CSS3, etc",
            auth: "Alexis Deveria @Fyrd",
            date: 0,
          },
          {
            url: "https://automaticcss.com/accessibility-features/",
            desc: "Automatic.css (ACSS) is committed to helping developers build more accessible websites. While accessibility is a deep and fairly technical topic…",
            title:
              "How Automatic.css is Making Websites More Accessible - Automatic.css",
            auth: "",
            date: 0,
          },
          {
            url: "https://stackoverflow.com/questions/41370741/how-do-i-edit-a-css-variable-using-js",
            desc: "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
            title:
              "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
            auth: "No author for Q&A sites",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency",
            desc: "The prefers-reduced-transparency CSS media feature is used to detect if a user has enabled a setting on their device to reduce the transparent or translucent layer effects used on the device. Switching on such a setting can help improve contrast and readability for some users.",
            title:
              "prefers-reduced-transparency - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/video-dynamic-range",
            desc: "The video-dynamic-range CSS media feature can be used to test the combination of brightness, contrast ratio, and color depth that are supported by the video plane of the user agent and the output device.",
            title: "video-dynamic-range - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://stackoverflow.com/questions/46791052/detect-scale-settings-dpi-with-javascript-or-css",
            desc: "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
            title:
              "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
            auth: "No author for Q&A sites",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio",
            desc: "The aspect-ratio CSS media feature can be used to test the aspect ratio of the viewport.",
            title: "aspect-ratio - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast",
            desc: "The prefers-contrast CSS media feature is used to detect whether the user has requested the web content to be presented with a lower or higher contrast.",
            title: "prefers-contrast - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
        ],
        headers: hh,
        ok: true,
      };
      good(tt);
    });
  }

  function mockt2_2() {
    // adjacent
    let hh = new Headers();
    hh.append("content-encoding", "application/json");

    return new Promise((good, bad) => {
      let tt = {
        body: [
          {
            url: "https://owenberesford.me.uk/resource/architecture",
            desc: "Notes from a course presented by T Gilb, an Agile coach, on Architectures & engineering tools in an Agile environment.  This article attempts to push an important and vast set of ideas and processes into text.",
            title: "Architectures and Agile",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/code-metrics",
            desc: "A colleague didnt understand remarks about refactoring his code",
            title: "Code metrics",
            auth: "Owen Beresford",
            date: 1711467412,
          },
          {
            url: "https://owenberesford.me.uk/resource/paradigm-shift",
            desc: "Borrowed content; discussing the change in engineering approach",
            title: "Paradigm shift",
            auth: "Tim Ottinger @tottinge",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/howto-API",
            desc: "16 Considerations for REST API, construction and why REST API are used.",
            title: "How-to REST API",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/goals",
            desc: "What concepts or areas of development are important.    This is a higher level chart..",
            title: "“Zones of development”",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/performance-engineering",
            desc: "What is my process for performance engineering, sometimes called scaling-up, and is part of growth hacking.  I have improved multiple operational systems.",
            title: "Performance engineering",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/justify-oop",
            desc: "Commercial justification for using common engineering practice of OO.  Please read if you are a business person.",
            title: "The economic and commercial justification for OOP",
            auth: "Owen Beresford",
            date: 1711455586,
          },
          {
            url: "https://owenberesford.me.uk/resource/logging",
            desc: "Analysis on logging operational visibility: why to add it and why to remove it",
            title: "Logging observability",
            auth: "Owen Beresford",
            date: 1711455586,
          },
        ],
        headers: hh,
        ok: true,
      };
      good(tt);
    });
  }

  function mockt2_3() {
    // mobile biblio
    let hh = new Headers();
    hh.append("content-encoding", "application/json");

    return new Promise((good, bad) => {
      let tt = {
        body: [
          {
            url: "https://caniuse.com/?search=%40media",
            desc: "Can I use' provides up-to-date browser support tables for support of front-end web technologies on desktop and mobile web browsers.",
            title: "@media' | Can I use... Support tables for HTML5, CSS3, etc",
            auth: "Alexis Deveria @Fyrd",
            date: 0,
          },
          {
            url: "https://automaticcss.com/accessibility-features/",
            desc: "Automatic.css (ACSS) is committed to helping developers build more accessible websites. While accessibility is a deep and fairly technical topic…",
            title:
              "How Automatic.css is Making Websites More Accessible - Automatic.css",
            auth: "",
            date: 0,
          },
          {
            url: "https://stackoverflow.com/questions/41370741/how-do-i-edit-a-css-variable-using-js",
            desc: "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
            title:
              "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
            auth: "No author for Q&A sites",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency",
            desc: "The prefers-reduced-transparency CSS media feature is used to detect if a user has enabled a setting on their device to reduce the transparent or translucent layer effects used on the device. Switching on such a setting can help improve contrast and readability for some users.",
            title:
              "prefers-reduced-transparency - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/video-dynamic-range",
            desc: "The video-dynamic-range CSS media feature can be used to test the combination of brightness, contrast ratio, and color depth that are supported by the video plane of the user agent and the output device.",
            title: "video-dynamic-range - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://stackoverflow.com/questions/46791052/detect-scale-settings-dpi-with-javascript-or-css",
            desc: "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
            title:
              "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
            auth: "No author for Q&A sites",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio",
            desc: "The aspect-ratio CSS media feature can be used to test the aspect ratio of the viewport.",
            title: "aspect-ratio - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
          {
            url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast",
            desc: "The prefers-contrast CSS media feature is used to detect whether the user has requested the web content to be presented with a lower or higher contrast.",
            title: "prefers-contrast - CSS: Cascading Style Sheets | MDN",
            auth: "MozDevNet",
            date: 0,
          },
        ],
        headers: hh,
        ok: true,
      };
      good(tt);
    });
  }

  let ram2 = 0;
  if (process) {
    ram2 = process.memoryUsage();
  }

  if (ram1 !== 0) {
    console.log(
      "[INFO] RAM used to make JSDOM: " + (ram2.heapUsed - ram1.heapUsed),
    );
  }
});
