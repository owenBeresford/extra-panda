import { assert, describe, it } from "vitest";
import { JSDOM } from "jsdom";

import { page } from "./page-seed-vite";
import { appendIsland } from "../dom-base";
import { ALL_REFERENCE_LINKS } from "../networking";
import { TEST_ONLY } from "../mobile-biblio";
import { TEST_ONLY as NETWORKING } from "../networking";

const { empty, normaliseData, render, createBiblio, injectOpts, adjustDom } =
  TEST_ONLY;
const { getLogCounter } = NETWORKING;

describe("TEST mobile-biblio", () => {
  it("go 1: empty", () => {
    assert.equal(typeof createBiblio, "function", "assert #1");
    assert.deepEqual(
      empty(1),
      {
        auth: "[No author]",
        date: "[No date]",
        desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
        offset: 1,
        title:
          "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
        url: "https://owenberesford.me.uk/",
      },
      "assert #2",
    );
  });

  it("go 2: render", () => {
    let dat = [
      {
        url: "http://192.168.0.35/resource/article1",
        title: "fg gdsg fgdfgdf gdfg dfg dg ",
        desc: "sfsdf df sdffsdf sfsdfs sdfsdfs dfsfsdfsdfsdf",
        auth: "racheal",
        date: "1st-june-2001",
      },
      {
        url: "http://192.168.0.35/resource/article2",
        title: "fg gdsg fgdfgg dfgdfg dg ad",
        desc: "sfsdf df sdffsdf sfsdfs sdfsdfs dfsfsdfsdfsdf",
        auth: "racheal",
        date: "1st-june-2002",
      },
      {
        url: "http://192.168.0.35/resource/article3",
        title: "dfg dg dfg dfgdfg dg ad",
        desc: "sfsdf df sdffsdf sfsdfs sdfsdfs dfsfsdfsdfsdf",
        auth: "racheal",
        date: "1st-june-2003",
      },
      {
        url: "http://192.168.0.35/resource/article4",
        title: "fg gdsg fgdfgdf dfgdfg dg ad",
        desc: "sfsdf df sdffsdf sfsdfs sdfsdfs dfsfsdfsdfsdf",
        auth: "racheal",
        date: "1st-june-2004",
      },
    ];
    let dat2 = `<aside role="footnote"><ol class="mobileBiblio"><li>
<a href="http://192.168.0.35/resource/article1"> 
<h5>fg gdsg fgdfgdf gdfg dfg dg </h5>
<span>sfsdf df sdffsdf sfsdfs sdfsdfs dfsfsdfsdfsdf</span>
<span>by racheal on 1st-june-2001</span>
</a>
</li>
<li>
<a href="http://192.168.0.35/resource/article2"> 
<h5>fg gdsg fgdfgg dfgdfg dg ad</h5>
<span>sfsdf df sdffsdf sfsdfs sdfsdfs dfsfsdfsdfsdf</span>
<span>by racheal on 1st-june-2002</span>
</a>
</li>
<li>
<a href="http://192.168.0.35/resource/article3"> 
<h5>dfg dg dfg dfgdfg dg ad</h5>
<span>sfsdf df sdffsdf sfsdfs sdfsdfs dfsfsdfsdfsdf</span>
<span>by racheal on 1st-june-2003</span>
</a>
</li>
<li>
<a href="http://192.168.0.35/resource/article4"> 
<h5>fg gdsg fgdfgdf dfgdfg dg ad</h5>
<span>sfsdf df sdffsdf sfsdfs sdfsdfs dfsfsdfsdfsdf</span>
<span>by racheal on 1st-june-2004</span>
</a>
</li>
</ol></aside>`;

    assert.equal(render(dat), dat2, "assert #3");
    // add HTML test
  });

  it("go 2: normaliseData ", () => {

//    maxDescripLen: 230,
    let dat = [
      {
        date: +new Date("2000-03-01 09:00:00 Z"),
        title: "sdfsdfs sdfsdfsfs",
        desc: "sf sdfs fsdfs dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        auth: "racheal",
        url: "http://192.168.0.35/resource/article1",
      },
      {
        date: +new Date("2000-04-01 09:00:00 Z"),
        title: "sdfsdfs 23423432",
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jdty jdtykdtyjd tjdt dyjd tjsyjdtyk sj srh ssr srjs rjsrt srjahs ryjdtyjdtyfyukdguilfyjdk7idt jtdh sr dj s tir r idj dtj ha dtyr aedtyjsth ssrt dthsr srth srt ersr6u sthsrtj srhsrtj tyhsr hsrthsrth sr heahs rhs hsrh aeh strh aer serh ae dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        auth: "racheal",
        url: "http://192.168.0.35/resource/article2",
      },
      {
        date: 0,
        title: "sdfsdfs 23423432",
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jdty jdtykdtyjd tjdt dyjd tjsyjdtyk sj srh ssr srjs rjsrt srjahs ryjdtyjdtyfyukdguilfyjdk7idt jtdh sr dj s tir r idj dtj ha dtyr aedtyjsth ssrt dthsr srth srt ersr6u sthsrtj srhsrtj tyhsr hsrthsrth sr heahs rhs hsrh aeh strh aer serh ae dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        auth: "",
        url: "http://192.168.0.35/resource/article3",
      },
      {
        date: +new Date("2000-05-01 09:00:00 Z"),
        title: "sdfsdfs 23423432",
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jdty jdtykdtyjd tjdt dyjd tjsyjdtyk sj srh ssr srjs rjsrt srjahs ryjdtyjdtyfyukdguilfyjdk7idt jtdh sr dj s tir r idj dtj ha dtyr aedtyjsth ssrt dthsr srth srt ersr6u sthsrtj srhsrtj tyhsr hsrthsrth sr heahs rhs hsrh aeh strh aer serh ae dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        auth: false,
        url: "http://192.168.0.35/resource/article4",
      },
      {
        date: +new Date("2000-04-01 09:00:00 Z"),
        title: "sdfsdfs w32dd2",
        desc: null,
        auth: "racheal",
        url: "http://192.168.0.35/resource/article5",
      },
    ];
    let dat2 = [
      {
        auth: "racheal",
        date: " 01-March-2000 ",
        desc: "sf sdfs fsdfs dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        offset: 0,
        title: "sdfsdfs sdfsdfsfs",
        url: "http://192.168.0.35/resource/article1",
      },
      {
        auth: "racheal",
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jd",
        date: " 01-April-2000 ",
        offset: 1,
        title: "sdfsdfs 23423432",
        url: "http://192.168.0.35/resource/article2",
      },
      {
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jd",
        title: "sdfsdfs 23423432",
        auth: "[No author]",
        date: "[No date]",
        offset: 2,
        url: "http://192.168.0.35/resource/article3",
      },
      {
        auth: "[No author]",
        date: " 01-May-2000 ",
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jd",
        offset: 3,
        title: "sdfsdfs 23423432",
        url: "http://192.168.0.35/resource/article4",
      },
      {
        auth: "racheal",
        date: " 01-April-2000 ",
        desc: "null",
        offset: 4,
        title: "sdfsdfs w32dd2",
        url: "http://192.168.0.35/resource/article5",
      },
    ];

    assert.deepEqual(normaliseData(dat), dat2, "Assert #4");
    dat = [
      {
        date: +new Date("2000-03-01 09:00:00 Z"),
        title: "sdfsdfs sdfsdfsfs",
        desc: "sf sdfs fsdfs dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        auth: "racheal",
        url: "http://192.168.0.35/resource/article1",
      },
      {
        date: +new Date("2000-04-01 09:00:00 Z"),
        title: "sdfsdfs 23423432",
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jdty jdtykdtyjd tjdt dyjd tjsyjdtyk sj srh ssr srjs rjsrt srjahs ryjdtyjdtyfyukdguilfyjdk7idt jtdh sr dj s tir r idj dtj ha dtyr aedtyjsth ssrt dthsr srth srt ersr6u sthsrtj srhsrtj tyhsr hsrthsrth sr heahs rhs hsrh aeh strh aer serh ae dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        auth: "racheal",
        url: "http://192.168.0.35/resource/article2",
      },
      {
        date: 0,
        title: "sdfsdfs 23423432",
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jdty jdtykdtyjd tjdt dyjd tjsyjdtyk sj srh ssr srjs rjsrt srjahs ryjdtyjdtyfyukdguilfyjdk7idt jtdh sr dj s tir r idj dtj ha dtyr aedtyjsth ssrt dthsr srth srt ersr6u sthsrtj srhsrtj tyhsr hsrthsrth sr heahs rhs hsrh aeh strh aer serh ae dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        auth: "",
        url: "http://192.168.0.35/resource/article3",
      },
      {
        date: +new Date("2000-05-01 09:00:00 Z"),
        title: "sdfsdfs 23423432",
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jdty jdtykdtyjd tjdt dyjd tjsyjdtyk sj srh ssr srjs rjsrt srjahs ryjdtyjdtyfyukdguilfyjdk7idt jtdh sr dj s tir r idj dtj ha dtyr aedtyjsth ssrt dthsr srth srt ersr6u sthsrtj srhsrtj tyhsr hsrthsrth sr heahs rhs hsrh aeh strh aer serh ae dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        auth: false,
        url: "http://192.168.0.35/resource/article4",
      },
      {
        date: +new Date("2000-04-01 09:00:00 Z"),
        title: "sdfsdfs w32dd2",
        desc: null,
        auth: "racheal",
        url: "http://192.168.0.35/resource/article5",
      },
      null,
      null,
    ];
    dat2 = [
      {
        offset: 0,
        desc: "sf sdfs fsdfs dfsf sdfsdfs fsdfsdf ssdfsd fsdf sdf ssdfs dfsdfsdf sdf sdf sdfs fsdf sdfsdfs dfsd fsdf sdfsdfsdf sfsdfsdfs",
        title: "sdfsdfs sdfsdfsfs",
        date: " 01-March-2000 ",
        auth: "racheal",
        url: "http://192.168.0.35/resource/article1",
      },
      {
        offset: 1,
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jd",
        title: "sdfsdfs 23423432",
        date: " 01-April-2000 ",
        auth: "racheal",
        url: "http://192.168.0.35/resource/article2",
      },
      {
        offset: 2,
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jd",
        title: "sdfsdfs 23423432",
        date: "[No date]",
        auth: "[No author]",
        url: "http://192.168.0.35/resource/article3",
      },
      {
        auth: "[No author]",
        date: " 01-May-2000 ",
        desc: "sf sdfs fsdfsudfg dgadgd gdg afgad gadfg afgadg afgadgadf dghk gkdg dghj gs hag aerh adg zdgd gdg adga gdh ryjtha rg aerh r RUS RJD RHS TK RSTH SRJDRJS RTJDTYDGJDGKDTYJDtyjfyu kk kd jdyjdj sryj dtyjsrj srjt dyjdjdtkdtyjdt jdtys jd",
        offset: 3,
        title: "sdfsdfs 23423432",
        url: "http://192.168.0.35/resource/article4",
      },
      {
        auth: "racheal",
        date: " 01-April-2000 ",
        desc: "null",
        offset: 4,
        title: "sdfsdfs w32dd2",
        url: "http://192.168.0.35/resource/article5",
      },
      {
        auth: "[No author]",
        date: "[No date]",
        desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
        offset: 5,
        title:
          "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
        url: "https://owenberesford.me.uk/",
      },
      {
        auth: "[No author]",
        date: "[No date]",
        desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
        offset: 6,
        title:
          "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
        url: "https://owenberesford.me.uk/",
      },
    ];
    assert.deepEqual(normaliseData(dat), dat2, "Assert #5");
  });

  it("go 4: adjustDOM", () => {
    const [dom, loc, win] = page(
      "http://192.168.0.35/resource/reading-list",
      3,
    );
    // function adjustDom(dat: Array<ReferenceType>, dom: Document): void
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
    injectOpts({ renumber: 1 });

    assert.equal(dom.querySelectorAll("#point2 a").length, 15, "assert #6");
    adjustDom([], dom);
    assert.equal(
      dom.querySelectorAll('#point2 a[href^="http"]').length,
      0,
      "assert #6",
    );
  });

  it("go 3: createBiblio", async () => {
    const [dom, loc] = page("http://192.168.0.35/resource/reading-list", 2);
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
    await createBiblio(
      { gainingElement: "#biblio", debug: true, runFetch: mockFetch1 },
      dom,
      loc,
    );

    assert.equal(dom.querySelectorAll("#biblio ol a").length, 15, "assert #6");
    dom.querySelectorAll(ALL_REFERENCE_LINKS).forEach((a, b) => {
      let tt = parseInt(a.textContent, 10);
      assert.isTrue(tt >= 0 && tt < 17, "assert #8");
    });
  });

  it("go 3.1: createBiblio ", async () => {
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
    const [dom, loc] = [brwr.window.document, brwr.window.location];

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

    let t1 = getLogCounter();
    await createBiblio(
      { gainingElement: "#biblio", debug: true, runFetch: mockFetch1 },
      dom,
      loc,
    );
    let t2 = getLogCounter();

    assert.equal(t2 - t1, 1, "assert #7");

    assert.equal(
      dom.querySelectorAll(ALL_REFERENCE_LINKS).length,
      0,
      "asset #8",
    );
  });

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
