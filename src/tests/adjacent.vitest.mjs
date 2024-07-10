import { assert, describe, it } from "vitest";

import { page } from "./page-seed";
import { TEST_ONLY } from "../adjacent";
import { appendIsland, setIsland } from "../dom-base";
import { SimpleResponse, AdjacentProps } from "../all-types";

const {
  injectOpts,
  createStyle,
  cleanTitle,
  extractGroup,
  generateGroup,
  normaliseToList,
  nextStep,
  updateLabels,
  listContentGroup,
  convert2HTML,
  convert2IndexHTML,
  createAdjacentChart,
} = TEST_ONLY;

// This is checking all the formatting visible in the result as text has been applied as
//  expected (this is a rewrite).   This helps visualise very hetrogenious data sources,
//  and the slightly-HTML2 outcomes make the results more useful on a variety of modern
// browsers (mobile, laptop, projection screen).
// This test is enough to make the module pass this mile-stone, which is why I wrote it
// #TODO: add a HTML lint tool
// #TODO: add a visual test via storybook or something, that will run the CSS in addition
// also #TODO, add my new generation CSS for this module
describe("TEST adjacent", () => {
  it("go 1: cleanTitle", () => {
    assert.equal(cleanTitle("simpleID", "group"), "groupsimpleID", "step #1");
    assert.equal(
      cleanTitle("test345357444", "group"),
      "grouptest345357444",
      "step #2",
    );
    assert.equal(
      cleanTitle("$t%t&t\"t=t't~t`t¬t\\t", "group"),
      "group_t_t_t_t_t_t_t_t_t_t",
      "step #3",
    );
    assert.equal(cleanTitle("sim\t", "group"), "groupsim_", "step #4");
  });

  it("go 2: createStyle", () => {
    assert.equal(createStyle(true, true), "button lower", "step1");
    assert.equal(createStyle(false, true), "button", "step2");
    assert.equal(createStyle(false, false), "button", "step3");
  });

  it("go 3: generateGroup", () => {
    // data from OPTS.group OR location.search
    injectOpts({ group: "engineering" });
    assert.equal(
      generateGroup({ search: "first=XXX" }),
      "engineering",
      "step1",
    );
    injectOpts({ group: "XXX" });
    assert.equal(
      generateGroup({ search: "first=uitools" }),
      "uitools",
      "step2",
    );
    try {
      injectOpts({ group: "XXX" });
      generateGroup({ search: "first=XXX" });
      assert.equal(1, 0, "step3");
    } catch (e) {
      assert.equal(1, 1, "step3");
    }
  });

  it("go 4: nextStep, logic tests", () => {
    injectOpts({ group: "engineering", name: "justify-oop", perRow: 10 });
    assert.deepEqual(
      nextStep("paradigm-shft", "justify-oop", 10, 3, -1),
      [-1, 10, 3],
      "step4",
    );
    assert.deepEqual(
      nextStep("paradigm-shft", "howto-API", 10, 10, -1),
      [-1, 10, 10],
      "step5",
    );
    assert.deepEqual(
      nextStep("paradigm-shft", "paradigm-shft", 10, 3, -1),
      [3, 10, 3],
      "step6",
    );
    assert.deepEqual(
      nextStep("paradigm-shft", "paradigm-shft", 10, 10, -1),
      [10, 10, 0],
      "step7",
    );
    assert.deepEqual(
      nextStep("paradigm-shft", "paradigm-shft", 10, 10, 10),
      [10, 10, 0],
      "step8",
    );
  });

  it("go 5: normaliseToList", () => {
    let d1 = [
      {
        date: new Date("2024-03-02 09:00:00").getTime() / 1000,
        title: "DDDSFDSDF ddd 1234",
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        auth: "racheal",
        url: "http://www.firstdata.com/dgdfg/itsy",
      },
      {
        date: new Date("2024-03-03 09:00:00").getTime() / 1000,
        title: "DDDSFDSDF ddd 45646",
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        auth: "",
        url: "http://www.seconddata.com/sdfgsdfg/bitsey",
      },
      {
        date: new Date("2024-03-04 09:00:00").getTime() / 1000,
        title:
          "DDDSFDSDF ddd fsfd fgd dgdfg ggadg adfg agd adgdafg adgad dag dg adfgdag dagdg dagadg dfgdag dgd dfgd gd gdgdg dgdg dgdg dagd dag dgadf gdagdafgdagdagdafg dgdagdagd dg dg dgd ggadfgdg dgdgadfg dadg adgd dfg dgdfg g ddg adg adgd gadgdg dg adg dgdag dd gd dg dg dg dg dgadg dag dfg dgdg dg dfgdafgd dfgdfg dgdfg dfgadfg df",
        desc: "sfsdgadg adg adg dgdg dgadg adg dfg g dafgg ad dgdg dfgdgdg dfg  dg dfg dfgdf dfg dfg dfgdfgd dfg dgdg dg dfgdfg dg dg dg dg dfg dfg dfgdgd fdfg dg dg dfgdgdg dg dgd gdg dfg dfg dg dgdgdddfgdg dfgdg dg dgdgdgdg dfg dgdgdgd d d dgdfgdfgdfgdg dg dg dg dgdgdfgdfgdg dg dg dag agadgdg dgdgdgd gd gdgdfgdfg dgd gdg dfg dg dfg dgdfgdg dg dfgdfgdg dg dfg dfgadgdfgdgdgdfgdg dg dgdg dg dgdgdgdg dg dfg dfg dfg dgdfg dgdfg dfg dgd dfg dgdg dgdgdfg  sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        auth: "gdgdg",
        url: "http://www.thirddata.com/gddfgdf/winey",
      },
    ];
    let d2 = [
      {
        auth: "racheal",
        date: " 02-March-2024 ",
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        offset: 0,
        title: "DDDSFDSDF ddd 1234",
        url: "http://www.firstdata.com/dgdfg/itsy",
      },
      {
        auth: "",
        date: " 03-March-2024 ",
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        offset: 1,
        title: "DDDSFDSDF ddd 45646",
        url: "http://www.seconddata.com/sdfgsdfg/bitsey",
      },
      {
        auth: "gdgdg",
        date: " 04-March-2024 ",
        desc: "sfsdgadg adg adg dgdg dgadg adg dfg g dafgg ad dgdg dfgdgdg dfg  dg dfg dfgdf dfg dfg dfgdfgd dfg dgdg dg dfgdfg dg dg dg dg dfg dfg dfgdgd fdfg dg dg dfgdgdg dg dgd gdg dfg dfg dg dgdgdddfgdg dfgdg dg dgdgdgdg dfg dgdgdgd d d dgdfgdfg...",
        offset: 2,
        title:
          "DDDSFDSDF ddd fsfd fgd dgdfg ggadg adfg agd adgdafg adgad dag dg adfgdag dagdg dagadg dfgdag dgd dfg...",
        url: "http://www.thirddata.com/gddfgdf/winey",
      },
    ];
    injectOpts({
      name: "itsy",
      perRow: 10,
      titleLimit: 100,
      group: "engineering",
    });
    assert.deepEqual(normaliseToList(d1), d2, "step11");
  });

  it("go 5.1: normaliseToList (nonsense)", () => {
    let d1 = [
      {
        date: new Date("2024-03-02 09:00:00").getTime() / 1000,
        title: "DDDSFDSDF ddd 1234",
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        auth: "racheal",
        url: "http://www.firstdata.com/dgdfg/itsy",
      },
      {
        date: new Date("2024-03-03 09:00:00").getTime() / 1000,
        title: "DDDSFDSDF ddd 45646",
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        auth: "",
        url: "http://www.seconddata.com/sdfgsdfg/bitsey",
      },
      {
        date: new Date("2024-03-04 09:00:00").getTime() / 1000,
        title:
          "DDDSFDSDF ddd fsfd fgd dgdfg ggadg adfg agd adgdafg adgad dag dg adfgdag dagdg dagadg dfgdag dgd dfgd gd gdgdg dgdg dgdg dagd dag dgadf gdagdafgdagdagdafg dgdagdagd dg dg dgd ggadfgdg dgdgadfg dadg adgd dfg dgdfg g ddg adg adgd gadgdg dg adg dgdag dd gd dg dg dg dg dgadg dag dfg dgdg dg dfgdafgd dfgdfg dgdfg dfgadfg df",
        desc: "sfsdgadg adg adg dgdg dgadg adg dfg g dafgg ad dgdg dfgdgdg dfg  dg dfg dfgdf dfg dfg dfgdfgd dfg dgdg dg dfgdfg dg dg dg dg dfg dfg dfgdgd fdfg dg dg dfgdgdg dg dgd gdg dfg dfg dg dgdgdddfgdg dfgdg dg dgdgdgdg dfg dgdgdgd d d dgdfgdfgdfgdg dg dg dg dgdgdfgdfgdg dg dg dag agadgdg dgdgdgd gd gdgdfgdfg dgd gdg dfg dg dfg dgdfgdg dg dfgdfgdg dg dfg dfgadgdfgdgdgdfgdg dg dgdg dg dgdgdgdg dg dfg dfg dfg dgdfg dgdfg dfg dgd dfg dgdg dgdgdfg  sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        auth: "gdgdg",
        url: "http://www.thirddata.com/gddfgdf/winey",
      },
    ];
    let d2 = [];
    injectOpts({
      name: "group-engineering",
      perRow: 10,
      titleLimit: 100,
      group: "engineering",
    });
    assert.deepEqual(normaliseToList(d1), d2, "step12");
  });

  it("go 6: listContentGroup", () => {
    const [dom, loc, jsdom] = page(
      "http://192.168.0.35/resource/code-metrics",
      3,
    );
    setIsland(
      "#point2",
      '<div id="testbar" data-group="engineering, uitools"></div>',
      dom,
    );
    assert.deepEqual(
      listContentGroup("#testbar", dom),
      ["engineering", "uitools"],
      "step8",
    );
    setIsland(
      "#point2",
      '<div id="testbar" data-group="\tengineering,              uitools       "></div>',
      dom,
    );
    assert.deepEqual(
      listContentGroup("#testbar", dom),
      ["engineering", "uitools"],
      "step9",
    );
    setIsland(
      "#point2",
      '<div id="testbar" data-group="engineering, uit   ools"></div>',
      dom,
    );
    assert.deepEqual(
      listContentGroup("#testbar", dom),
      ["engineering", "uit   ools"],
      "step10",
    );
  });

  it("go 7: convert2HTML", () => {
    let d1 = [
      {
        auth: "racheal",
        date: " 02-March-2024 ",
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        offset: 0,
        title: "DDDSFDSDF ddd 1234",
        url: "http://www.firstdata.com/",
      },
      {
        auth: "",
        date: " 03-March-2024 ",
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        offset: 1,
        title: "DDDSFDSDF ddd 45646",
        url: "http://www.seconddata.com/",
      },
      {
        auth: "gdgdg",
        date: " 04-March-2024 ",
        desc: "sfsdgadg adg adg dgdg dgadg adg dfg g dafgg ad dgdg dfgdgdg dfg  dg dfg dfgdf dfg dfg dfgdfgd dfg dgdg dg dfgdfg dg dg dg dg dfg dfg dfgdgd fdfg dg dg dfgdgdg dg dgd gdg dfg dfg dg dgdgdddfgdg dfgdg dg dgdgdgdg dfg dgdgdgd d d dgdfgdfg...",
        offset: 2,
        title:
          "DDDSFDSDF ddd fsfd fgd dgdfg ggadg adfg agd adgdafg adgad dag dg adfgdag dagdg dagadg dfgdag dgd dfg...",
        url: "http://www.thirddata.com/",
      },
    ];

    let d2 = `<ul class="adjacentList">
<li> <a id="linkengineering0" class="button" href="http://www.firstdata.com/" aria-label="Title: DDDSFDSDF ddd 1234
Author: racheal &nbsp; &nbsp; Last edit:  02-March-2024 
Description: sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf" >DDDSFDSDF ddd 1234</a> </li>
<li> <a id="linkengineering1" class="button" href="http://www.seconddata.com/" aria-label="Title: DDDSFDSDF ddd 45646
Author:  &nbsp; &nbsp; Last edit:  03-March-2024 
Description: sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf" >DDDSFDSDF ddd 45646</a> </li>
<li> <a id="linkengineering2" class="button lower" href="http://www.thirddata.com/" aria-label="Title: DDDSFDSDF ddd fsfd fgd dgdfg ggadg adfg agd adgdafg adgad dag dg adfgdag dagdg dagadg dfgdag dgd dfg...
Author: gdgdg &nbsp; &nbsp; Last edit:  04-March-2024 
Description: sfsdgadg adg adg dgdg dgadg adg dfg g dafgg ad dgdg dfgdgdg dfg  dg dfg dfgdf dfg dfg dfgdfgd dfg dgdg dg dfgdfg dg dg dg dg dfg dfg dfgdgd fdfg dg dg dfgdgdg dg dgd gdg dfg dfg dg dgdgdddfgdg dfgdg dg dgdgdgdg dfg dgdgdgd d d dgdfgdfg..." >DDDSFDSDF ddd fsfd fgd dgdfg ggadg adfg agd adgdafg adgad dag dg adfgdag dagdg dagadg dfgdag dgd dfg...</a> </li>
</ul>`;
    assert.deepEqual(convert2HTML(d1, "engineering"), d2, "step12");
  });

  it("go 8: convert2IndexHTML", () => {
    let d1 = [
      {
        auth: "racheal",
        date: new Date("2024-03-02 09:00:00").getTime() / 1000,
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        title: "DDDSFDSDF ddd 1234",
        url: "http://www.firstdata.com/",
      },
      {
        auth: "",
        date: new Date("2024-03-03 09:00:00").getTime() / 1000,
        desc: "sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf",
        title: "DDDSFDSDF ddd 45646",
        url: "http://www.seconddata.com/",
      },
      {
        auth: "gdgdg",
        date: new Date("2024-03-04 09:00:00").getTime() / 1000,
        desc: "sfsdgadg adg adg dgdg dgadg adg dfg g dafgg ad dgdg dfgdgdg dfg  dg dfg dfgdf dfg dfg dfgdfgd dfg dgdg dg dfgdfg dg dg dg dg dfg dfg dfgdgd fdfg dg dg dfgdgdg dg dgd gdg dfg dfg dg dgdgdddfgdg dfgdg dg dgdgdgdg dfg dgdgdgd d d dgdfgdfgdg dgdg dfg dgdgdgdgdgd gdgd gd gdgdfgdgdgdgdfgdfg dfgdf",
        title:
          "DDDSFDSDF ddd fsfd fgd dgdfg ggadg adfg agd adgdafg adgad dag dg adfgdag dagdg dagadg dfgdag dgd dfg dfgdg gdfg dgdgdfgdfgdfgdfgdfg dgd gd gdfgdgdfgdfgd dfgdfgdfgzdfgdfgdg",
        url: "http://www.thirddata.com/",
      },
    ];

    let d2 = `<a class="adjacentItem" href="http://www.firstdata.com/" title="sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf">DDDSFDSDF ddd 1234 <span class="button">DDDSFDSDF ddd 1234</span><p id="adjacentengineering0" >Author: racheal &nbsp; &nbsp; &nbsp;  Last edit:  02-March-2024  <br />Description: sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf </p></a>
<a class="adjacentItem" href="http://www.seconddata.com/" title="sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf">DDDSFDSDF ddd 45646 <span class="button">DDDSFDSDF ddd 45646</span><p id="adjacentengineering1" >Author:  &nbsp; &nbsp; &nbsp;  Last edit:  03-March-2024  <br />Description: sfs sfs sdfsf sfs sf sfs fsfsf sfdsfsdfs fsf sfs fsfsfsf sfsfs fsf sdfs sfsfsfs fsf sdf </p></a>
<a class="adjacentItem" href="http://www.thirddata.com/" title="sfsdgadg adg adg dgdg dgadg adg dfg g dafgg ad dgdg dfgdgdg dfg  dg dfg dfgdf dfg dfg dfgdfgd dfg dgdg dg dfgdfg dg dg dg dg dfg dfg dfgdgd fdfg dg dg dfgdgdg dg dgd gdg dfg dfg dg dgdgdddfgdg dfgdg dg dgdgdgdg dfg dgdgdgd d d dgdfgdfg...">DDDSFDSDF ddd fsfd fgd dgdfg ggadg adfg agd adgdafg adgad dag dg adfgdag dagdg dagadg dfgdag dgd dfg dfgdg gdfg dgdgdfgdfgdfgdfgdfg dgd gd gdfgdgdfgdfgd dfgdfgdfgzdfgdfgdg <span class="button">DDDSFDSDF ddd fsfd fgd dgdfg ggadg adfg agd adgdafg adgad dag dg adfgdag dagdg dagadg dfgdag dgd dfg dfgdg gdfg dgdgdfgdfgdfgdfgdfg dgd gd gdfgdgdfgdfgd dfgdfgdfgzdfgdfgdg</span><p id="adjacentengineering2" >Author: gdgdg &nbsp; &nbsp; &nbsp;  Last edit:  04-March-2024  <br />Description: sfsdgadg adg adg dgdg dgadg adg dfg g dafgg ad dgdg dfgdgdg dfg  dg dfg dfgdf dfg dfg dfgdfgd dfg dgdg dg dfgdfg dg dg dg dg dfg dfg dfgdgd fdfg dg dg dfgdgdg dg dgd gdg dfg dfg dg dgdgdddfgdg dfgdg dg dgdgdgdg dfg dgdgdgd d d dgdfgdfg... </p></a>
`;
    const [dom, loc, jsdom] = page(
      "http://192.168.0.35/resource/code-metrics",
      3,
    );
    assert.deepEqual(
      convert2IndexHTML(d1, "engineering", dom, loc),
      d2,
      "step13",
    );
  });

  it("go 9: updateLabels", () => {
    const [dom, loc, jsdom] = page(
      "http://192.168.0.35/resource/code-metrics",
      3,
    );
    let str = `<div class=" top-bar fullWidth"><header><h1>I'm set</h1> </header> </div>  
				<div class="adjacentGroup"><p>Im set too</p> </div> `;
    appendIsland("#point2", str, dom);
    updateLabels("Engineering", dom);
    assert.deepEqual(
      dom.querySelector(".top-bar.fullWidth header h1").textContent,
      "I'm set",
      "step14",
    );
    assert.deepEqual(
      dom.querySelector(".adjacentGroup p").textContent,
      "Im set too",
      "step15",
    );
    str = `<div class=" top-bar fullWidth"><header><h1>XXX</h1> </header> </div>
				<div class="adjacentGroup"><p>XXX</p> </div> `;
    setIsland("#point2", str, dom);
    updateLabels("Engineering", dom);
    assert.deepEqual(
      dom.querySelector(".top-bar.fullWidth header h1").textContent,
      "Group Engineering",
      "step16",
    );
    assert.deepEqual(
      dom.querySelector(".adjacentGroup p").textContent,
      "Some similar articles in Engineering",
      "step17",
    );
  });

  it("go 10: createAdjacentChart", async () => {
    const [dom, loc, jsdom] = page(
      "http://192.168.0.35/resource/code-metrics",
      3,
    );
    let str = `
<div class="adjacentGroup" id="groupengineering">
<p>TEST</p>
</div>`;
    appendIsland("#point2", str, dom);
    // jQuery("html").adjacent({group: i, debug:false, iteration:j, count:grp.length });
    // jQuery("html").adjacent({group: tt[1], debug:false});
    await createAdjacentChart(
      {
        group: "engineering",
        name: "code-metrics",
        debug: true,
        runFetch: mockFetch1,
      },
      dom,
      loc,
    );
    assert.equal(
      dom.querySelector(".adjacentGroup p").textContent,
      "TEST",
      "step18 [negative]",
    );
    assert.equal(
      dom.querySelectorAll("#groupengineering ul li").length,
      0,
      "step19 [negative]",
    );
  });

  it("go 10.1: createAdjacentChart", async () => {
    const [dom, loc, jsdom] = page(
      "http://192.168.0.35/resource/code-metrics",
      3,
    );
    let str = `
<div class="adjacentGroup" id="groupengineering">
<p>TEST</p>
</div>`;
    appendIsland("#point2", str, dom);

    await createAdjacentChart(
      {
        group: "engineering",
        name: "code-metrics",
        debug: true,
        runFetch: mockFetch2,
      },
      dom,
      loc,
    );

    assert.equal(
      dom.querySelector(".adjacentGroup p").textContent,
      "TEST",
      "step20 [positive]",
    );
    assert.equal(
      dom.querySelectorAll("#groupengineering .adjacentList").length,
      1,
      "step21 [positive]",
    );

    // fixed input data, so fixed output data
    let sample1 = `
<li> <a id="linkengineering0" class="button" href="https://owenberesford.me.uk/resource/code-metrics" aria-label="Title: Code metrics
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: A colleague didnt understand remarks about refactoring his code">Code metrics</a> </li>
<li> <a id="linkengineering1" class="button" href="https://owenberesford.me.uk/resource/paradigm-shift" aria-label="Title: Paradigm shift
Author: Tim Ottinger @tottinge &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Borrowed content; discussing the change in engineering approach">Paradigm shift</a> </li>
<li> <a id="linkengineering2" class="button" href="https://owenberesford.me.uk/resource/howto-API" aria-label="Title: How-to REST API
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: 16 Considerations for REST API, construction and why REST API are used.">How-to REST API</a> </li>
<li> <a id="linkengineering3" class="button" href="https://owenberesford.me.uk/resource/goals" aria-label="Title: “Zones of development”
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: What concepts or areas of development are important.    This is a higher level chart..">“Zones of development”</a> </li>
`;
    assert.equal(
      dom.querySelector("#groupengineering .adjacentList").innerHTML,
      sample1,
      "step22 [positive]",
    );
  });

  it("go 10.2: createAdjacentChart", async () => {
    const [dom, loc] = page("http://192.168.0.35/resource/code-metrics", 3);
    let str = `
<div class="adjacentGroup " id="groupengineering">
<p>TEST</p>
</div>`;
    appendIsland("#point2", str, dom);

    await createAdjacentChart(
      {
        group: "engineering",
        name: "code-metrics",
        perRow: 10,
        debug: true,
        runFetch: mockFetch3,
      },
      dom,
      loc,
    );

    assert.equal(
      dom.querySelector(".adjacentGroup p").textContent,
      "TEST",
      "step23 ",
    );
    assert.equal(
      dom.querySelectorAll("#groupengineering ul li").length,
      10,
      "step24",
    );

    assert.equal(
      dom.querySelectorAll("#groupengineering ul").length,
      1,
      "step25",
    );

    assert.equal(
      dom.querySelectorAll("#groupengineering ul").length,
      1,
      "step26",
    );

    assert.equal(
      dom.querySelectorAll("#groupengineering ul a").length,
      10,
      "step27",
    );

    assert.equal(
      dom.querySelectorAll("#groupengineering ul a[aria-label]").length,
      10,
      "step28",
    );
  });

  // ADD_TEST extractGroup

  it("go 10.3: createAdjacentChart", async () => {
    const [dom, loc, jsdom] = page(
      "http://192.168.0.35/resource/code-metrics",
      3,
    );
    let str = `
<div class="adjacentGroup" id="groupengineering">
<p>TEST</p>
</div>`;
    appendIsland("#point2", str, dom);

    await createAdjacentChart(
      {
        group: "engineering",
        name: "code-metrics",
        debug: true,
        runFetch: mockFetch3,
        perRow: 15,
      },
      dom,
      loc,
    );

    assert.equal(
      dom.querySelector(".adjacentGroup p").textContent,
      "TEST",
      "step29",
    );
    assert.equal(
      dom.querySelectorAll("#groupengineering .adjacentList").length,
      1,
      "step30",
    );
    assert.equal(
      dom.querySelectorAll("#groupengineering .adjacentList li").length,
      15,
      "step31",
    );

    let sample1 = `
<li> <a id="linkengineering0" class="button" href="https://owenberesford.me.uk/resource/paradigm-shift" aria-label="Title: Paradigm shift
Author: Tim Ottinger @tottinge &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Borrowed content; discussing the change in engineering approach">Paradigm shift</a> </li>
<li> <a id="linkengineering1" class="button" href="https://owenberesford.me.uk/resource/howto-API" aria-label="Title: How-to REST API
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: 16 Considerations for REST API, construction and why REST API are used.">How-to REST API</a> </li>
<li> <a id="linkengineering2" class="button" href="https://owenberesford.me.uk/resource/goals" aria-label="Title: “Zones of development”
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: What concepts or areas of development are important.    This is a higher level chart..">“Zones of development”</a> </li>
<li> <a id="linkengineering3" class="button lower" href="https://owenberesford.me.uk/resource/performance-engineering" aria-label="Title: Performance engineering
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: What is my process for performance engineering, sometimes called scaling-up, and is part of growth hacking.  I have improved multiple operational systems.">Performance engineering</a> </li>
<li> <a id="linkengineering4" class="button lower" href="https://owenberesford.me.uk/resource/justify-oop" aria-label="Title: The economic and commercial justificatio...
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Commercial justification for using common engineering practice of OO.  Please read if you are a business person.">The economic and commercial justificatio...</a> </li>
<li> <a id="linkengineering5" class="button" href="https://owenberesford.me.uk/resource/logging" aria-label="Title: Logging observability
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Analysis on logging operational visibility: why to add it and why to remove it">Logging observability</a> </li>
<li> <a id="linkengineering6" class="button" href="https://owenberesford.me.uk/resource/composer-force-version" aria-label="Title: Composer version locking
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: About a particular feature of php composer">Composer version locking</a> </li>
<li> <a id="linkengineering7" class="button" href="https://owenberesford.me.uk/resource/symfony-loggers" aria-label="Title: Symfony3 loggers
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Brief article about symfony3 loggers &amp; managing them">Symfony3 loggers</a> </li>
<li> <a id="linkengineering8" class="button" href="https://owenberesford.me.uk/resource/yml-notes" aria-label="Title: YML notes (for Symfony)
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Short article on YML in Symfony">YML notes (for Symfony)</a> </li>
<li> <a id="linkengineering9" class="button" href="https://owenberesford.me.uk/resource/docs-for-js-ts" aria-label="Title: Docs for JS and TS
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: The best IMO docs generators for JS and TS.  A look at options, requirements, its history and literature.">Docs for JS and TS</a> </li>
<li> <a id="linkengineering10" class="button" href="https://owenberesford.me.uk/resource/php-extra-tools" aria-label="Title: Extra PHP tools.
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Toolify your way round operational constraints">Extra PHP tools.</a> </li>
<li> <a id="linkengineering11" class="button" href="https://owenberesford.me.uk/resource/php-tools" aria-label="Title: PHP Tool chain
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: This is a shopping list to save time.  PHP dev only">PHP Tool chain</a> </li>
<li> <a id="linkengineering12" class="button" href="https://owenberesford.me.uk/resource/phar-notes" aria-label="Title: PHAR notes
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Short article about compressed php bundles">PHAR notes</a> </li>
<li> <a id="linkengineering13" class="button" href="https://owenberesford.me.uk/resource/opcache-notes" aria-label="Title: Opcache notes
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Short article for how to control APC.">Opcache notes</a> </li>
<li> <a id="linkengineering14" class="button" href="https://owenberesford.me.uk/resource/php-benchmark-2017" aria-label="Title: PHP benchmark 2017
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Performance benchmark for PHP operations.">PHP benchmark 2017</a> </li>
`;
    assert.equal(
      dom.querySelector("#groupengineering .adjacentList").innerHTML,
      sample1,
      "step32 ",
    );
  });

  it("go 10.3: createAdjacentChart", async () => {
    const [dom, loc, jsdom] = page(
      "http://192.168.0.35/resource/code-metrics",
      3,
    );
    let str = `
<div class="adjacentGroup" id="groupengineering">
<p>TEST</p>
</div>`;
    appendIsland("#point2", str, dom);

    await createAdjacentChart(
      {
        group: "engineering",
        name: "code-metrics",
        debug: true,
        runFetch: mockFetch3,
        perRow: 15,
      },
      dom,
      loc,
    );

    assert.equal(
      dom.querySelector(".adjacentGroup p").textContent,
      "TEST",
      "step29",
    );
    assert.equal(
      dom.querySelectorAll("#groupengineering .adjacentList").length,
      1,
      "step30",
    );
    assert.equal(
      dom.querySelectorAll("#groupengineering .adjacentList li").length,
      15,
      "step31",
    );

    let sample1 = `
<li> <a id="linkengineering0" class="button" href="https://owenberesford.me.uk/resource/paradigm-shift" aria-label="Title: Paradigm shift
Author: Tim Ottinger @tottinge &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Borrowed content; discussing the change in engineering approach">Paradigm shift</a> </li>
<li> <a id="linkengineering1" class="button" href="https://owenberesford.me.uk/resource/howto-API" aria-label="Title: How-to REST API
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: 16 Considerations for REST API, construction and why REST API are used.">How-to REST API</a> </li>
<li> <a id="linkengineering2" class="button" href="https://owenberesford.me.uk/resource/goals" aria-label="Title: “Zones of development”
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: What concepts or areas of development are important.    This is a higher level chart..">“Zones of development”</a> </li>
<li> <a id="linkengineering3" class="button lower" href="https://owenberesford.me.uk/resource/performance-engineering" aria-label="Title: Performance engineering
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: What is my process for performance engineering, sometimes called scaling-up, and is part of growth hacking.  I have improved multiple operational systems.">Performance engineering</a> </li>
<li> <a id="linkengineering4" class="button lower" href="https://owenberesford.me.uk/resource/justify-oop" aria-label="Title: The economic and commercial justificatio...
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Commercial justification for using common engineering practice of OO.  Please read if you are a business person.">The economic and commercial justificatio...</a> </li>
<li> <a id="linkengineering5" class="button" href="https://owenberesford.me.uk/resource/logging" aria-label="Title: Logging observability
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Analysis on logging operational visibility: why to add it and why to remove it">Logging observability</a> </li>
<li> <a id="linkengineering6" class="button" href="https://owenberesford.me.uk/resource/composer-force-version" aria-label="Title: Composer version locking
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: About a particular feature of php composer">Composer version locking</a> </li>
<li> <a id="linkengineering7" class="button" href="https://owenberesford.me.uk/resource/symfony-loggers" aria-label="Title: Symfony3 loggers
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Brief article about symfony3 loggers &amp; managing them">Symfony3 loggers</a> </li>
<li> <a id="linkengineering8" class="button" href="https://owenberesford.me.uk/resource/yml-notes" aria-label="Title: YML notes (for Symfony)
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Short article on YML in Symfony">YML notes (for Symfony)</a> </li>
<li> <a id="linkengineering9" class="button" href="https://owenberesford.me.uk/resource/docs-for-js-ts" aria-label="Title: Docs for JS and TS
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: The best IMO docs generators for JS and TS.  A look at options, requirements, its history and literature.">Docs for JS and TS</a> </li>
<li> <a id="linkengineering10" class="button" href="https://owenberesford.me.uk/resource/php-extra-tools" aria-label="Title: Extra PHP tools.
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Toolify your way round operational constraints">Extra PHP tools.</a> </li>
<li> <a id="linkengineering11" class="button" href="https://owenberesford.me.uk/resource/php-tools" aria-label="Title: PHP Tool chain
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: This is a shopping list to save time.  PHP dev only">PHP Tool chain</a> </li>
<li> <a id="linkengineering12" class="button" href="https://owenberesford.me.uk/resource/phar-notes" aria-label="Title: PHAR notes
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Short article about compressed php bundles">PHAR notes</a> </li>
<li> <a id="linkengineering13" class="button" href="https://owenberesford.me.uk/resource/opcache-notes" aria-label="Title: Opcache notes
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Short article for how to control APC.">Opcache notes</a> </li>
<li> <a id="linkengineering14" class="button" href="https://owenberesford.me.uk/resource/php-benchmark-2017" aria-label="Title: PHP benchmark 2017
Author: Owen Beresford &nbsp; &nbsp; Last edit:  26-March-2024 
Description: Performance benchmark for PHP operations.">PHP benchmark 2017</a> </li>
`;
    assert.equal(
      dom.querySelector("#groupengineering .adjacentList").innerHTML,
      sample1,
      "step32 ",
    );
  });

  function mockFetch1(url, hasExcept) {
    return new Promise((good, bad) => {
      let str = [
        {
          url: "https://www.w3.org/WAI/WCAG2AAA-Conformance",
          desc: "Accessibility resources free online from the international standards organization: W3C Web Accessibility Initiative (WAI).",
          title:
            "Web Content Accessibility Guidelines (WCAG) 2 Level AAA Conformance | Web Accessibility Initiative (WAI) | W3C",
          auth: "W3C Web Accessibility Initiative (WAI)",
          date: 1717168263,
        },
        {
          url: "https://www.allaccessible.org/wcag-level-a-aa-and-aaa-whats-the-difference/",
          desc: "Within WCAG there are three levels of compliance Levels A, AA, and AAA. Find out which is attainable for your organization.",
          title:
            "WCAG Level A, AA, and AAA Whats the Difference? | AllAccessible Automated Web Accessibility WCAG 2.1",
          auth: "AllAccessible",
          date: 0,
        },
        {
          url: "https://www.w3.org/WAI/WCAG21/quickref/",
          desc: "How to Meet WCAG (Quickref Reference)",
          title: "How to Meet WCAG (Quickref Reference)",
          auth: "unknown",
          date: 0,
        },
        {
          url: "https://accessibility.18f.gov/checklist/",
          desc: "Checklist | 18F Accessibility",
          title: "Checklist | 18F Accessibility",
          auth: "",
          date: 0,
        },
      ];
      let h = new Headers();
      h.append("Content-Type", "application/json; cbarset=utf8");
      let ret = { body: str, headers: h, ok: true };
      good(ret);
    });
  }

  function mockFetch2(url, hasExcept) {
    return new Promise((good, bad) => {
      let str = [
        {
          url: "https://owenberesford.me.uk/resource/code-metrics",
          desc: "A colleague didnt understand remarks about refactoring his code",
          title: "Code metrics",
          auth: "Owen Beresford",
          date: 1711455586,
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
      ];
      let h = new Headers();
      h.append("Content-Type", "application/json; cbarset=utf8");
      let ret = { body: str, headers: h, ok: true };
      good(ret);
    });
  }

  function mockFetch3(url, hasExcept) {
    return new Promise((good, bad) => {
      let str = [
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
          date: 1711455586,
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
        {
          url: "https://owenberesford.me.uk/resource/composer-force-version",
          desc: "About a particular feature of php composer",
          title: "Composer version locking",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/symfony-loggers",
          desc: "Brief article about symfony3 loggers & managing them",
          title: "Symfony3 loggers",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/yml-notes",
          desc: "Short article on YML in Symfony",
          title: "YML notes (for Symfony)",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/docs-for-js-ts",
          desc: "The best IMO docs generators for JS and TS.  A look at options, requirements, its history and literature.",
          title: "Docs for JS and TS",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/php-extra-tools",
          desc: "Toolify your way round operational constraints",
          title: "Extra PHP tools.",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/php-tools",
          desc: "This is a shopping list to save time.  PHP dev only",
          title: "PHP Tool chain",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/phar-notes",
          desc: "Short article about compressed php bundles",
          title: "PHAR notes",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/opcache-notes",
          desc: "Short article for how to control APC.",
          title: "Opcache notes",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/php-benchmark-2017",
          desc: "Performance benchmark for PHP operations.",
          title: "PHP benchmark 2017",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/php-benchmark-2022",
          desc: "Performance benchmark for PHP operations updated in 2022; targeting PHP 7 and 8.",
          title: "PHP7 + PHP8 benchmark (2022)",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/databases-epic",
          desc: "A convenience group indexing articles to make it easier to access early articles relating to databases DB on my website.",
          title: "Databases epic",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/db-rollover",
          desc: "A short set of options for high availability writes",
          title: "DB rollover",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/db-visualisers",
          desc: "Discussion on DB visualisers. List of 11 tools available on the market since 2012.",
          title: "DB Visualisers",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/scaling-mongo",
          desc: "Analysis: how does MongoDB perform with large scale data? Limits and data modeling on practical upper data-volume for MongoDB with normal hardware. MongoDB is also compared with other data systems.",
          title: "Creating a large scale MongoDB",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/hadoop",
          desc: "Definition of the open-source database Hadoop, where its used and how it's structured.",
          title: "BCS lecture on Hadoop: a synopsis",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/mongodb-indexes",
          desc: "A utility article focusing on indexes in MongoDB and how indexes affects your Mongo search.",
          title: "MongoDB indexes",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/fault-analysis",
          desc: "How to trace a fault in a PHP stack platform.",
          title: "Fault Analysis",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/gis-data",
          desc: "A collection of notes for GIS related solutions",
          title: "GIS data (pt1)",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/git-notes",
          desc: "Advanced Git notes and Git workflow on how to use it to solve practical problems with it, with extensive performance tips list which are omitted from general sites.",
          title: "Git and workflow for GIT",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/react-performance",
          desc: "Article defines how to make React18 apps smoother, faster, and respond to user input better by changing functions used.",
          title: "Improving React18 Performance",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/css-architecture",
          desc: "When writing reusable UI components, ideas for how to manage CSS in them.  Most Apps will be built with a CSS framework, and this should be leveraged.",
          title: "CSS architecture",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/gpl-p1",
          desc: "PART 1 about OSS and why OSS is important.  Read for demographic perspective and social effects.",
          title: "OSS/GPL [pt1]",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/yapc",
          desc: "Notes that I wrote at YAPC 2014.",
          title: "Quick notes from YAPC",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/iceline-bundle",
          desc: "Discussing the reasons for investing a month on rewriting old code (again).",
          title: "iceline Bundle",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/nodejs-linking",
          desc: "An article pulling up all the different technologies to access a Node interpreter via C++",
          title: "Linking libraries to NodeJS",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/js-modules-notes",
          desc: "Research into how to be able to use JS modules in the browsers.",
          title: "JS modules notes",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/js-backchannel-logging",
          desc: "For app availability, my solution is to implement JS backchannel logging, this can enable limited-edition test / review editions better and faster for apps.  The article lists high-level requirements for this idea along with the requirements.",
          title: "App availability: JS backchannel Logging",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/http-cache-breaker",
          desc: "A look at HTTP cache building in the webrowser, flush caching both on static assets.  I propose a feature to manage old and bad caches.",
          title: "HTTP cache breaker",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/improving-search-utility",
          desc: "A website should be written to support an audience or customers; many people use search tools to add themselves to that audience.  This article describes a categorisation scheme for your audiences.",
          title: "Improving search utility",
          auth: "Owen Beresford",
          date: 1711457007,
        },
        {
          url: "https://owenberesford.me.uk/resource/update-voip",
          desc: "Brief analysis on VOIP platforms; for my domestic use",
          title: "newer VOIP platforms",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/ancient-TLS",
          desc: "Transport Layer Security is very niche. Finally TLS 1.0, a very old protocol, was removed from Windows, the last vendor who were using it. I discuss the TLS context, technical details and upgrades.",
          title: "Managing ancient TLS",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/random-notes",
          desc: "Assorted notes imported from my phone",
          title: "Assorted notes from meetups",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/snmp-mib",
          desc: "A missing manual for MIBs used in SNMP. This article is more narrow scope and advanced than most",
          title: "SNMP MIB grammar",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/laptop-cpu-management",
          desc: "Seven technical and orthogonal steps to suspend unneeded processes and features on laptops; which will make them quieter and make the battery charge last longer.",
          title: "Laptop CPU management",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/software-design",
          desc: "Article to describe heuristic process of designing a software",
          title: "Software design",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/design-patterns",
          desc: "My use of PHP design patterns and Structures that I apply.",
          title: "Design Patterns that I use",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/src-tools",
          desc: "Misc tools, mostly for PHP, but varied",
          title: "Misc Useful tools",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/word-filtering",
          desc: "On text cleaning, and the algorithms necessary.",
          title: "Word filtering",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/colour-chart",
          desc: "A version of a colour chart I made to label software quality and to express it for non-tech people.",
          title: "Code quality categorisation chart",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/modal-popover",
          desc: "People use images to communicate. This article lists improvements across three decades of image in casual usage on the net. Sample implementation of image requirements along with existing and current image widgets.",
          title: "modal popover",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/extended-modal-popover",
          desc: "This is an extended article on modal popover, this file contains improved graphic design, which matches visually other websites, however,  it is technically better.",
          title: "modal popover",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/stress-tools",
          desc: "Article with information about current stress test tools",
          title: "REST test tools",
          auth: "Owen Beresford",
          date: 1711455586,
        },
        {
          url: "https://owenberesford.me.uk/resource/festivals-2010",
          desc: "Project management for 6 festivals in 12 months, detailed one year planning and cost control. My festival holidays in 2010 are an example of project planning.   This is obviously personal, but was a well organised project.",
          title: "Festivals Season 2010",
          auth: "Owen Beresford",
          date: 1711455586,
        },
      ];
      let h = new Headers();
      h.append("Content-Type", "application/json; cbarset=utf8");
      let ret = { body: str, headers: h, ok: true };
      good(ret);
    });
  }
});
