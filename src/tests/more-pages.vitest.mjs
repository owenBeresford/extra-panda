import { assert, describe, it } from "vitest";

import { PageCollection } from "../references/page-collection";
import { TEST_ONLY } from "../references/more-pages";
const {
  MorePages,
  extractTitle,
  extractAuthor,
  extractDate,
  extractDescrip,
  extractRedirect,
  mapper,
} = TEST_ONLY;

// Could I have made a spy for this?  Yes, but the later tests are expected to do something
function NullVendorMod(item, body) {
  return item;
}

// no test for promiseExits, assignClose,
describe("TEST references MorePages ", () => {
  it("go 1: MorePages failure ", async () => {
    let tmp = new Promise((good, bad) => {
      const obj2 = new PageCollection([
        "https://sample.url/11",
        "https://sample.url/22",
      ]);
      const obj = new MorePages(obj2, NullVendorMod, 666);
      obj.promiseExits(good, bad, 0);
      obj.setOffset(0, "https://google.co.uk/");
      obj.failure(new Error("Oh No!"));
    }).then(
      (dat) => {
        assert.equal(
          "HTTP_ERROR, Error: Oh No!",
          dat.desc,
          "Error passed through to bad() CB successfully",
        );
        assert.equal(
          "HTTP_ERROR, Error: Oh No!",
          dat.title,
          "Error passed through to bad() CB successfully",
        );
        // next checkpoint is wrong due to poor input data, but is correct to inputs
        assert.equal(
          "https://google.co.uk/",
          dat.url,
          "Error passed through to bad() CB successfully",
        );
        assert.equal(
          "unknown",
          dat.auth,
          "Error passed through to bad() CB successfully",
        );
      },
      (dat) => {
        assert.equal(
          1,
          0,
          "K@@@XX0N!!, KL@@@XX0N!! bad, wrong, test die now::" + dat.message,
        );
      },
    );

    await Promise.all([tmp]);
  });

  it("go 2: MorePages success ", async () => {
    let tmp = new Promise((good, bad) => {
      const obj2 = new PageCollection([
        "https://sample.com/11",
        "https://sample.com/22",
        "https://sample.com/33",
      ]);
      const obj = new MorePages(obj2, NullVendorMod, 666);
      obj.promiseExits(good, bad, 0);
      obj.setOffset(0, "https://google.co.uk/");
      let data =
        "<h1>Someting went wrong</h1><br />Please contact the administrat0r. ";
      obj.success("200", data, []);
    }).then(
      (dat) => {
        assert.equal(1, 1, "Passed out right door.");
      },
      (err) => {
        assert.equal(
          1,
          0,
          "K@@@XX0N!!, KL@@@XX0N!! bad, wrong, test die now " + err,
        );
      },
    );

    await Promise.all([tmp]);
  });

  it("go 3: MorePages  extractTitle ", () => {
    // probably not needed.
    const obj2 = new PageCollection([]);
    const obj = new MorePages(obj2, NullVendorMod, 666);
    obj.setOffset(-1, "https://google.co.uk/");

    let html = "<title>sample title</title>";
    let ret = extractTitle(html, "https://sample.url/");
    assert.equal("sample title", ret, "step1");

    html = "<h1>sample title</h1>";
    ret = extractTitle(html, "https://sample.url/");
    assert.equal("sample title", ret, "step2");

    html = '<meta name="og:title" content="sample title" />';
    ret = extractTitle(html, "https://sample.url/");
    assert.equal("sample title", ret, "step3");

    html =
      "<p>fdhfhfghfghfghfhfg<ul><li>dfgdfgd<li>dfgdgdfgd<li>dgdgdg<li>dgdgdfg</ul><p>dgdgdfgdfgdfgdfg";
    ret = extractTitle(html, "https://sample.url/");
    assert.equal("sample.url", ret, "step4");
  });

  it("go 4: MorePages  extractAuthor ", () => {
    // probably not needed.
    const obj2 = new PageCollection([]);
    const obj = new MorePages(obj2, NullVendorMod, 666);
    obj.setOffset(0, "https://sample.url/11");

    let html = '<meta name="author" content="sample author" />';
    let ret = extractAuthor(html, "https://sample.url/11");
    assert.equal("sample author", ret, "step1");

    html = '<meta name="copyright" content="sample author" />';
    ret = extractAuthor(html, "https://sample.url/");
    assert.equal("sample author", ret, "step2");

    html = '<meta name="twitter:creator" content="sample author" />';
    ret = extractAuthor(html, "https://sample.url/");
    assert.equal("sample author", ret, "step3");

    html =
      "<p>fdhfhfghfghfghfhfg<ul><li>dfgdfgd<li>dfgdgdfgd<li>dgdgdg<li>dgdgdfg</ul><p>dgdgdfgdfgdfgdfg";
    ret = extractAuthor(html, "https://sample.url/");
    assert.equal("unknown", ret, "step4");
  });

  it("go 5: MorePages extractDate ", () => {
    const obj2 = new PageCollection([]);
    const obj = new MorePages(obj2, NullVendorMod, 666);
    obj.setOffset(0, "https://sample.url/11");

    assert.equal(
      new Date("2025-07-01").getTime(),
      extractDate({ "Last-Modified": "2025-07-01" }, "").getTime(),
      "step1",
    );
    let html = 'posted   <time datetime="1751328000000">This July</date>';
    assert.equal(
      new Date("2025-07-01").getTime(),
      extractDate({}, html).getTime(),
      "step2",
    );

    html = 'last updated <time datetime="1751328000000">about now</date>';
    assert.equal(
      new Date("2025-07-01").getTime(),
      extractDate({}, html).getTime(),
      "step3",
    );

    html = '<div class="pw-published-date"><span>1 July 2025 10:00:00</span>';
    assert.equal(
      new Date("2025-07-01 10:00:00").getTime(),
      extractDate({}, html).getTime(),
      "step4",
    );

    assert.equal(new Date(0).getTime(), extractDate({}, "").getTime(), "step5");

    // #leSigh  stdlib in other languages deal with this very common notation better,
    html = '<div class="pw-published-date"><span>1st July 2025</span>';
    assert.isTrue(Number.isNaN(extractDate({}, html).getTime()), "step6");

    html = '<div class="pw-published-date"><span>July 1st 2025</span>';
    assert.isTrue(Number.isNaN(extractDate({}, html).getTime()), "step7");
  });

  it("go 6: MorePages extractDescription ", () => {
    const obj2 = new PageCollection([]);
    const obj = new MorePages(obj2, NullVendorMod, 666);
    obj.setOffset(0, "https://sample.url/11");

    let html = '<meta name="description" content="description 1.">';
    assert.equal("description 1.", extractDescrip(html), "step1");

    html = '<meta name="twitter:description" content="description 2.">';
    assert.equal("description 2.", extractDescrip(html), "step2");

    html = '<meta itemprop="description" content="description 3.">';
    assert.equal("description 3.", extractDescrip(html), "step3");

    html = '<meta property="og:description" content="description 4.">';
    assert.equal("description 4.", extractDescrip(html), "step4");
  });

  // TODO check loop limiting in other regexp branches
  it("go 7: MorePages extractRedirect ", () => {
    const obj2 = new PageCollection([]);
    const obj = new MorePages(obj2, NullVendorMod, 666);
    obj.setOffset(0, "https://sample.url/11");
    // extractRedirect( body: string, redirect_limit: number, current: string, loop:number ): Error | boolean

    let html = "";
    let current = "https://first.url/page11";
    assert.equal(
      false,
      extractRedirect(html, 3, current, 0),
      "plain webpage, no redirs",
    );
    assert.equal(
      false,
      extractRedirect(html, 3, current, 4),
      "no idea what should happen here",
    );

    html = "<script> location='https://second.url/page22';";
    assert.equal(
      "object",
      typeof extractRedirect(html, 3, current, 0),
      "plain webpage, first JS redir",
    );
    assert.equal(
      false,
      extractRedirect(html, 3, current, 3),
      "first JS redir, loop count exeeded",
    );

    html = "<script> location='https://first.url/page11';";
    assert.equal(
      false,
      extractRedirect(html, 3, current, 0),
      "first JS redir to same location",
    );

    current = "https://first.url/page11#testing?werwer=fghfhf&qwe=cbcb";
    assert.equal(
      false,
      extractRedirect(html, 3, current, 0),
      "first JS redir to same location",
    );

    current = "https://first.url/page11";
    html = "<script> location='https://first.url/page44';";
    assert.equal(
      "object",
      typeof extractRedirect(html, 3, current, 0),
      "first JS redir to same location",
    );

    html = "<script> location.href='https://second.url/page55';";
    assert.equal(
      "object",
      typeof extractRedirect(html, 3, current, 0),
      "second JS redir",
    );

    html = "<script> location.replace('https://second.url/page66');";
    assert.equal(
      "object",
      typeof extractRedirect(html, 3, current, 0),
      "third JS redir",
    );

    html =
      "<script> location.replaceState(null,\"\",'https://second.url/page77');";
    assert.equal(
      "object",
      typeof extractRedirect(html, 3, current, 0),
      "fourth JS redir",
    );

    html =
      "<script> location.replaceState({type:\"rabbit\",age:2,name:\"fluffy\"},'','https://second.url/page88');";
    assert.equal(
      "object",
      typeof extractRedirect(html, 3, current, 0),
      "fitth JS redir",
    );

    html = '<link rel="canonical" href="https://first.url/page99" />';
    assert.equal(
      "object",
      typeof extractRedirect(html, 3, current, 0),
      "sixth JS redir",
    );
  });
});
