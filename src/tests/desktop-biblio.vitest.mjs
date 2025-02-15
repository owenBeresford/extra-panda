import { assert, describe, it } from "vitest";
import { JSDOM } from "jsdom";

import { page } from "./page-seed-vite";
import { appendIsland, setIsland, isFullstack } from "../dom-base";
import { ALL_REFERENCE_LINKS } from "../immutables";
import { TEST_ONLY } from "../desktop-biblio";
import { TEST_ONLY as LOG_ONLY  } from "../log-services";

const { enableLogCounter } =LOG_ONLY;
const {
  injectOpts,
  markAllLinksUnknown,
  generateEmpty,
  normaliseData,
  applyDOMpositions,
  mapPositions,
  addMetaAge,
  createBiblio,
} = TEST_ONLY;

describe("TEST desktop-biblio", () => {
  it("go 1: generateEmptys", () => {
    // this item is abit pointless
    assert.equal(typeof generateEmpty, "function", "assert #1");
    assert.equal(typeof generateEmpty(1), "string", "assert #2");
    assert.equal(typeof generateEmpty(999999999), "string", "assert #3");
  });

  it("go 2: markAllLinksUnknown", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/reading-list", 2);
    let str = `
<p>sdf sdfs <sup><a href="gibgibgib">1</a> </sup> <sup><a href="gibgibgib">2</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">3</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
`;
    appendIsland("#point2", str, dom);
    markAllLinksUnknown(dom, loc);

    assert.equal(
      Array.from(dom.querySelectorAll(ALL_REFERENCE_LINKS)).length,
      5,
      "assert #4 ",
    );
    assert.equal(
      Array.from(dom.querySelectorAll(ALL_REFERENCE_LINKS + "[aria-label]"))
        .length,
      5,
      "assert #4",
    );
    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS + "[aria-label*=HTTP_ERROR]")
        .length,
      5,
      "assert #5",
    );
    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS + '[aria-label=""]').length,
      0,
      "assert #6",
    );
    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS + ":not( [aria-label] )").length,
      0,
      "assert #7",
    );
  });

  it("go 3: mapPositions", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/reading-list",
      3,
    );
    let str = `<p role="status"> PING</p>
<p>sdf sdfs <sup><a href="gibgibgib">1</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
`;
    appendIsland("#point2", str, dom);
    let dat = [
      "sdfsfsd sfsdfsdf sdf sd fsdf sdfsdf ",
      "sdfsfsd sfsdfsdf sdf sd fsdf sdfsdf ",
      "sdfsfsd sfsdfsdf sdf sd fsdf sdfsdf ",
      "sdfsfsd sfsdfsdf sdf sd fsdf sdfsdf ",
      "sdfsfsd sfsdfsdf sdf sd fsdf sdfsdf ",
    ];
    injectOpts({ renumber: 1 });
    mapPositions(dat, dom, win);

    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS + "[aria-label]").length,
      5,
      "assert #8",
    );
    dom
      .querySelectorAll(ALL_REFERENCE_LINKS + "[aria-label]")
      .forEach((a, b) => {
        let tt = parseInt(a.textContent, 10);
        assert.isTrue(tt >= 0 && tt < 6, "assert #9");
      });
    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS + '[aria-label=""]').length,
      0,
      "assert #10",
    );

    str = `<p role="status"> PING</p>
<p>sdf sdfs <sup><a href="gibgibgib">1</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
<p>sdf sdfs <sup><a href="gibgibgib">7</a> </sup> <sup><a href="gibgibgib">45</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">-3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
<p>sdf sdfs <sup><a href="gibgibgib">9</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">16</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">21</a> </sup> 
`;
    setIsland("#point2", str, dom);
    // apply 5 items, as above, and renumber will still be set
    mapPositions(dat, dom, win);
    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS + "[aria-label]").length,
      15,
      "assert #11",
    );
    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS + ":not( [aria-label] )").length,
      0,
      "assert #12",
    );
    dom
      .querySelectorAll(ALL_REFERENCE_LINKS + "[aria-label]")
      .forEach((a, b) => {
        let tt = parseInt(a.textContent, 10);
        assert.isTrue(tt >= 0 && tt < 17, "assert #13");
        if (b > 5) {
          // the early links have data, the later ones do not
          assert.isTrue(
            a.getAttribute("aria-label") &&
              a.getAttribute("aria-label").includes("HTTP_ERROR"),
            "assert #14",
          );
        }
      });
  });

  it("go 4: addMetaAge", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/reading-list", 2);
    let str = `
<p>sdf sdfs <sup><a href="gibgibgib">1</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
`;
    appendIsland("#point2", str, dom);
    injectOpts({ renumber: 1 }); // refresh flag was removed

    let h = new Headers();
    h.append("Content-Type", "application/json; cbarset=utf8");
    h.append("last-modified", "2023-06-01 09:00:00.2342Z");
    let tt = { headers: h, body: {}, ok: true };
    addMetaAge(tt, dom);
    assert.equal(
      dom.querySelectorAll(".addReading .ultraSkinny time").length,
      1,
      "assert #15",
    );
    let bb = dom
      .querySelector(".addReading .ultraSkinny time")
      .getAttribute("datetime");
    assert.isTrue(parseInt(bb, 10) > 1000000000000, "assert #16");
    assert.isTrue(
      +new Date(parseInt(bb, 10)) === +new Date("2023-06-01 09:00:00.2342Z"),
      "assert #17",
    );
  });

  it("go 4.1: addMetaAge", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/reading-list", 2);
    let str = `
<p>sdf sdfs <sup><a href="gibgibgib">1</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
`;
    appendIsland("#point2", str, dom);
    injectOpts({ renumber: 1 }); // refresh flag was removed

    let h = new Headers();
    h.append("Content-Type", "application/json; cbarset=utf8");
    h.append("last-modified", "2023-06-01 09:00:00 BST");
    let tt = { headers: h, body: {}, ok: true };
    addMetaAge(tt, dom);
    assert.equal(
      dom.querySelectorAll(".addReading .ultraSkinny time").length,
      1,
      "assert #18",
    );
    let bb = dom
      .querySelector(".addReading .ultraSkinny time")
      .getAttribute("datetime");
    assert.isTrue(parseInt(bb, 10) > 1000000000000, "assert #19");
    assert.isTrue(
      +new Date(parseInt(bb, 10)) === +new Date("2023-06-01 09:00:00"),
      "assert #20",
    );
  });

  it("go 4.2: addMetaAge", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/reading-list", 2);
    let str = `
<p>sdf sdfs <sup><a href="gibgibgib">1</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
`;
    appendIsland("#point2", str, dom);
    injectOpts({ renumber: 1 }); // refresh flag was removed

    let h = new Headers();
    h.append("Content-Type", "application/json; cbarset=utf8");
    h.append("last-modified", "Tue, 02 Jul 2024 16:45:09 BST");
    let tt = { headers: h, body: {}, ok: true };
    addMetaAge(tt, dom);
    assert.equal(
      dom.querySelectorAll(".addReading .ultraSkinny time").length,
      1,
      "assert #21",
    );
    let bb = dom
      .querySelector(".addReading .ultraSkinny time")
      .getAttribute("datetime");
    assert.isTrue(parseInt(bb, 10) > 1000000000000, "assert #22");
    assert.isTrue(
      +new Date(parseInt(bb, 10)) === +new Date("2024-07-02 16:45:09"),
      "assert #22",
    );
  });

  it("go 5: normaliseData", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/reading-list", 2);
    let dat = [
      {
        date: +new Date("2024-03-01 09:00:00.0Z"),
        title: "fsdfs sfs fsdfsdf1",
        desc: "sf sfsf sdfsfsdf sdfs, dgdfgdf gdfgdfgdf",
        auth: "racheal",
        url: "http://192.168.0.35/resource/adfsdf",
      },
      {
        date: +new Date("2024-04-01 09:00:00.0Z"),
        title: "",
        desc: "",
        auth: "racheal2",
        url: "http://192.168.0.35/resource/spamspam",
      },
      {
        date: +new Date("2024-05-01 09:00:00.0Z"),
        title:
          "fsdfs sfs fsdfsdf3i fgas dgadga dgd fgdg dag adfgad dfg dfg adgdg dfg ddzfh dth dh zd hzdfh zdhzdhzd h zdh zghsfj dfsf dhf sfh shsd hsthsthath dhsdthsths thsthsthsthsdthsthdths hs haeh ah h adh dhd had hah adh adh adh adhdh adth",
        desc: "sf sfsf sdfsfsdf sdfs, dgdfgdf gdfgdfgdfdhd hst hsth sdtha ethath aeth aehaeya yae aerae ae ae aey s YANE  GWYAE AA SE5NAEHSRT SE ZDHDRU ST HSRr srth ru s haeu er haes ese  sys thaeyu6rmae aernegarhrehd ne n5y eu4 zu,d tirsur7ia e47mr ae yr6 aere5 umr aeyarh ae5y ssrt es sruae s seu a5u aeu seuae5ua ea4n4je5y ae srey aw ey e enae sru 4wn r5 ea w7n srk6ue5uruw sumsr 4mrj sr6msr 54 ae",
        auth: "racheal",
        url: "http://192.168.0.35/resource/eggs-and-spam",
      },
      {
        date: +new Date("2024-06-01 09:00:00.0Z"),
        title: "               fsdfs sfs fsdfsdf4                  ",
        desc: "sf %45 sfsf %20 sdfsfsdf&nbsp; sdfs, &lt;dgdfgdf&gt; gdfgdfgdf&nbsp;",
        auth: "racheal",
        url: "http://192.168.0.35/resource/moar-spam",
      },
    ];
    let dat2 = [
      `Reference popup for link [1]

fsdfs sfs fsdfsdf1
racheal  01-March-2024 

sf sfsf sdfsfsdf sdfs, dgdfgdf gdfgdfgdf`,
      `Reference popup for link [2]


racheal2  01-April-2024 

`,
      `Reference popup for link [3]

fsdfs sfs fsdfsdf3i fgas dgadga dgd fgdg dag adfgad dfg dfg adgdg dfg ddzfh dth ↩
dh zd hzdfh zdhzdhzd h zdh zghsfj dfsf dhf sfh shsd hsthsthath dhsdthsths thsths↩
thsthsdthsthdths hs haeh ah h adh dhd had hah adh adh adh adhdh adth
racheal  01-May-2024 

sf sfsf sdfsfsdf sdfs, dgdfgdf gdfgdfgdfdhd hst hsth sdtha ethath aeth aehaeya y↩
ae aerae ae ae aey s YANE  GWYAE AA SE5NAEHSRT SE ZDHDRU ST HSRr srth ru s haeu ↩
er haes ese  sys thaeyu6rmae aernegarhrehd ne n5y eu4 zu,d tirsur7ia e47mr ae yr↩
6 aere5 umr aeyarh ae5y ssrt es sruae s seu a5u aeu seuae5ua ea4n4je5y ae srey a↩
w ey e enae sru 4wn r5 ea w7n srk6ue5uruw sumsr 4mrj sr6msr 54 ae`,
      `Reference popup for link [4]

               fsdfs sfs fsdfsdf4                  
racheal  01-June-2024 

sf %45 sfsf %20 sdfsfsdf&nbsp; sdfs, &lt;dgdfgdf&gt; gdfgdfgdf&nbsp;`,
    ];
    assert.deepEqual(normaliseData(dat), dat2, "assert #18");

    dat = [
      {
        date: +new Date("2024-03-01 09:00:00.0Z"),
        title: "fsdfs sfs fsdfsdf1",
        desc: "sf sfsf sdfsfsdf sdfs, dgdfgdf gdfgdfgdf",
        auth: "racheal",
        url: "http://192.168.0.35/resource/adfsdf",
      },
      null,
      null,
    ];
    dat2 = [
      `Reference popup for link [1]

fsdfs sfs fsdfsdf1
racheal  01-March-2024 

sf sfsf sdfsfsdf sdfs, dgdfgdf gdfgdfgdf`,
      `Reference popup for link [2]

HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.
  07-June-2024 

HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.`,
      `Reference popup for link [3]

HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.
  07-June-2024 

HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.`,
    ];
    assert.deepEqual(normaliseData(dat), dat2, "assert #18");
  });

  it("go 6: applyDOMpositions", (context) => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/reading-list",
      3,
    );
    let str = `<span id="uniq1">GDG</span>
<span id="uniq2">WER</span>
<span id="uniq3">IOP</span>
<span id="uniq4">ASD</span>
`;
    appendIsland("#point2", str, dom);
    if (!isFullstack(win)) {
      context.skip();
      return;
    }

    applyDOMpositions(dom.querySelector("#uniq1"), 200);
    applyDOMpositions(dom.querySelector("#uniq2"), 400);
    applyDOMpositions(dom.querySelector("#uniq3"), 600);
    applyDOMpositions(dom.querySelector("#uniq4"), 800);
    assert.equal(
      dom.querySelector("#uniq1").getAttribute("class"),
      "",
      "assert #19",
    );
    assert.equal(
      "",

      dom.querySelector("#uniq2").getAttribute("class"),
      "assert #20",
    );
    assert.equal(
      dom.querySelector("#uniq3").getAttribute("class"),
      "",
      "assert #21",
    );
    assert.equal(
      dom.querySelector("#uniq4").getAttribute("class"),
      "",
      "assert #22",
    );
  });

  it("go 7: createBiblio", async () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/reading-list",
      3,
    );
    let str = `
<div id="biblio" style="display:none;"></div>
<p>sdf sdfs <sup><a href="gibgibgib">1</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
<p>sdf sdfs <sup><a href="gibgibgib">7</a> </sup> <sup><a href="gibgibgib">45</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">-3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
<p>sdf sdfs <sup><a href="gibgibgib">9</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">16</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">21</a> </sup> 
`;
    appendIsland("#point2", str, dom); // 15 links
    await createBiblio(
      {
        runFetch: mockFetch1,
        debug: true,
      },
      dom,
      loc,
      win,
    );
    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS + "[aria-label]").length,
      15,
      "assert #23",
    );
    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS + ":not( [aria-label] )").length,
      0,
      "assert #24",
    );
    dom
      .querySelectorAll(ALL_REFERENCE_LINKS + "[aria-label]")
      .forEach((a, b) => {
        let tt = parseInt(a.textContent, 10);
        assert.isTrue(tt >= 0 && tt < 17, "assert #13");
        assert.isTrue(
          a.getAttribute("aria-label") &&
            !a.getAttribute("aria-label").includes("HTTP_ERROR"),
          "assert #14",
        );
      });
  });

  it("go 7.1: createBiblio ", async () => {
    const url = "http://192.168.0.35/resource/reading-list";
    const brwr = new JSDOM(
      `<html>
<head><title>test1</title></head>
<body>
  <div class="addReading" id="shareGroup">
    <div class="allButtons"> <span class="ultraSkinny"></span> </div>
  </div>
  <article>
    <div id="point1"></div>
    <div id="point2" class="blocker "></div>
  </article>
</body>
</html>`,
      { url: url, referrer: url },
    );
    const [dom, loc, win] = [
      brwr.window.document,
      brwr.window.location,
      brwr.window,
    ];

    let str = `
<div id="biblio" style="display:none;">
<p> here is old stuff
<p> budget cows!!!
<p> glow in the dark cows
</div>
<p>sdf sdfs <sup><a href="gibgibgib">1</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
<p>sdf sdfs <sup><a href="gibgibgib">7</a> </sup> <sup><a href="gibgibgib">45</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">-3</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">5</a> </sup> 
<p>sdf sdfs <sup><a href="gibgibgib">9</a> </sup> <sup><a href="gibgibgib">44</a> </sup> sdfsf sdfsdf ssf sd
<p>sdf sdfs <sup><a href="gibgibgib">16</a> </sup> dgdf dgd ga  agadgaddafg ag </p>
<p>sdf sdfsvxvc sf sdffsxjcghcgj jg fhfhsfh <sup><a href="gibgibgib">66</a> </sup> <sup><a href="gibgibgib">21</a> </sup> 
`;
    appendIsland("#point2", str, dom); // 15 links
    const logCount = enableLogCounter(win.console);

    let t1 = logCount();
    await createBiblio(
      { gainingElement: "#biblio", debug: true, runFetch: mockFetch1 },
      dom,
      loc,
      win,
    );
    let t2 = logCount();

    // this test counts log messages, as the mockFetch isn't a real network thing
    assert.equal(t2 - t1, 1, "assert #25");

    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS).length,
      0,
      "asset #26",
    );
  });

  /**
   * mochFetch1() ~ a fixture for tests

   * @param {string} url
   * @param {boolean} hasExcept
   * @returns {Promise<SimpleResponse>}
   */
  function mockFetch1(url, hasExcept) {
    return new Promise((good, bad) => {
      let str = `
[
  {
    "url": "https://caniuse.com/?search=%40media",
    "desc": "Can I use' provides up-to-date browser support tables for support of front-end web technologies on desktop and mobile web browsers.",
    "title": "@media' | Can I use... Support tables for HTML5, CSS3, etc",
    "auth": "Alexis Deveria @Fyrd",
    "date": 0
  },
  {
    "url": "https://automaticcss.com/accessibility-features/",
    "desc": "Automatic.css (ACSS) is committed to helping developers build more accessible websites. While accessibility is a deep and fairly technical topic…",
    "title": "How Automatic.css is Making Websites More Accessible - Automatic.css",
    "auth": "",
    "date": 0
  },
  {
    "url": "https://stackoverflow.com/questions/41370741/how-do-i-edit-a-css-variable-using-js",
    "desc": "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
    "title": "javascript - How do I edit a CSS variable using JS? - Stack Overflow",
    "auth": "No author for Q&A sites",
    "date": 0
  },
  {
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency",
    "desc": "The prefers-reduced-transparency CSS media feature is used to detect if a user has enabled a setting on their device to reduce the transparent or translucent layer effects used on the device. Switching on such a setting can help improve contrast and readability for some users.",
    "title": "prefers-reduced-transparency - CSS: Cascading Style Sheets | MDN",
    "auth": "MozDevNet",
    "date": 0
  },
  {
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/video-dynamic-range",
    "desc": "The video-dynamic-range CSS media feature can be used to test the combination of brightness, contrast ratio, and color depth that are supported by the video plane of the user agent and the output device.",
    "title": "video-dynamic-range - CSS: Cascading Style Sheets | MDN",
    "auth": "MozDevNet",
    "date": 0
  },
  {
    "url": "https://stackoverflow.com/questions/46791052/detect-scale-settings-dpi-with-javascript-or-css",
    "desc": "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
    "title": "Detect scale settings (dpi) with JavaScript or CSS - Stack Overflow",
    "auth": "No author for Q&A sites",
    "date": 0
  },
  {
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio",
    "desc": "The aspect-ratio CSS media feature can be used to test the aspect ratio of the viewport.",
    "title": "aspect-ratio - CSS: Cascading Style Sheets | MDN",
    "auth": "MozDevNet",
    "date": 0
  },
  {
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast",
    "desc": "The prefers-contrast CSS media feature is used to detect whether the user has requested the web content to be presented with a lower or higher contrast.",
    "title": "prefers-contrast - CSS: Cascading Style Sheets | MDN",
    "auth": "MozDevNet",
    "date": 0
  },
  {
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/video-dynamic-range",
    "desc": "The video-dynamic-range CSS media feature can be used to test the combination of brightness, contrast ratio, and color depth that are supported by the video plane of the user agent and the output device.",
    "title": "video-dynamic-range - CSS: Cascading Style Sheets | MDN",
    "auth": "MozDevNet",
    "date": 0
  },
  {
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut",
    "desc": "The color-gamut CSS media feature is used to apply CSS styles based on the approximate range of color gamut supported by the user agent and the output device.",
    "title": "color-gamut - CSS: Cascading Style Sheets | MDN",
    "auth": "MozDevNet",
    "date": 0
  },
  {
    "url": "https://stackoverflow.com/questions/11387805/media-query-to-detect-if-device-is-touchscreen",
    "desc": "css - Media query to detect if device is touchscreen - Stack Overflow",
    "title": "css - Media query to detect if device is touchscreen - Stack Overflow",
    "auth": "No author for Q&A sites",
    "date": 0
  },
  {
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion",
    "desc": "The prefers-reduced-motion CSS media feature is used to detect if a user has enabled a setting on their device to minimize the amount of non-essential motion. The setting is used to convey to the browser on the device that the user prefers an interface that removes, reduces, or replaces motion-based animations.",
    "title": "prefers-reduced-motion - CSS: Cascading Style Sheets | MDN",
    "auth": "MozDevNet",
    "date": 0
  },
  {
    "url": "https://stackoverflow.com/questions/59708960/how-do-i-change-the-prefers-reduced-motion-setting-in-browsers",
    "desc": "media queries - How do I change the 'prefers-reduced-motion' setting in browsers? - Stack Overflow",
    "title": "media queries - How do I change the 'prefers-reduced-motion' setting in browsers? - Stack Overflow",
    "auth": "No author for Q&A sites",
    "date": 0
  },
  {
    "url": "https://web.dev/prefers-reduced-motion/",
    "desc": "The prefers-reduced-motion media query detects whether the user has requested that the system minimize the amount of animation or motion it uses. This is for users who either require or prefer minimized animations; for example people with vestibular disorders often desire animations to be kept to a minimum.",
    "title": "prefers-reduced-motion: Sometimes less movement is more  |  Articles  |  web.dev",
    "auth": "",
    "date": 0
  },
  {
    "url": "https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme",
    "desc": "The prefers-color-scheme CSS media feature is used to detect if a user has requested light or dark color themes.  A user indicates their preference through an operating system setting (e.g. light or dark mode) or a user agent setting.",
    "title": "prefers-color-scheme - CSS: Cascading Style Sheets | MDN",
    "auth": "MozDevNet",
    "date": 0
  }
]
`;
      let h = new Headers();
      h.append("Content-Type", "application/json; cbarset=utf8");
      let ret = { body: JSON.parse(str.trim()), headers: h, ok: true };
      good(ret);
    });
  }
});
