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

    // #leSigh stdlib in other languages deal with this very common notation better,
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
    assert.equal("description 1.", extractDescrip(html, "TEST TITLE"), "step1");

    html = '<meta name="twitter:description" content="description 2.">';
    assert.equal("description 2.", extractDescrip(html, "TEST TITLE"), "step2");

    html = '<meta itemprop="description" content="description 3.">';
    assert.equal("description 3.", extractDescrip(html, "TEST TITLE"), "step3");

    html = '<meta property="og:description" content="description 4.">';
    assert.equal("description 4.", extractDescrip(html, "TEST TITLE"), "step4");

    assert.equal(
      "TEST TITLE",
      extractDescrip("<p> dfgdfg gad gdfg dgdfgad g</p>", "TEST TITLE"),
      "step5",
    );

    html = `<meta name="twitter:site" content="@code" />
<meta name="description" content="Learn about Visual Studio Code editor features (code completion, debugging, snippets, linting) for Go." />
<meta name="keywords" content="" />
<meta name="ms.prod" content="vs-code" />
<meta name="ms.TOCTitle" content="" />
<meta name="ms.ContentId" content="6f06908a-6694-4fad-ac1e-fc6d9c5747ca" />
<meta name="ms.date" content="07/09/2025" />
<meta name="ms.topic" content="conceptual" />
<!-- Twitter and Facebook OpenGraph Metadata-->
<meta name="twitter:card" content="summary_large_image" />
<meta property="og:url" content="https://code.visualstudio.com/docs/languages/go" />
<meta property="og:type" content="article" />
<meta property="og:title" content="Go in Visual Studio Code" />
<meta property="og:description" content="Learn about Visual Studio Code editor features (code completion, debugging, snippets, linting) for Go." />
<meta property="og:image" content="https://code.visualstudio.com/opengraphimg/opengraph-docs.png" />`;
    assert.equal(
      "Learn about Visual Studio Code editor features (code completion, debugging, snippets, linting) for Go.",
      extractDescrip(html, "TEST TITLE"),
      "step6",
    );
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

    html = `<!DOCTYPE html><html lang="en-US">
<head>
<title>Just a moment...</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge">
<meta name="robots" content="noindex,nofollow">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box;margin:0;padding:0}html{line-height:1.15;-webkit-text-size-adjust:100%;color:#313131;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"}body{display:flex;flex-direction:column;height:100vh;min-height:100vh}.main-content{margin:8rem auto;padding-left:1.5rem;max-width:60rem}@media (width <= 720px){.main-content{margin-top:4rem}}.h2{line-height:2.25rem;font-size:1.5rem;font-weight:500}@media (width <= 720px){.h2{line-height:1.5rem;font-size:1.25rem}}#challenge-error-text{background-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbD0iI0IyMEYwMyIgZD0iTTE2IDNhMTMgMTMgMCAxIDAgMTMgMTNBMTMuMDE1IDEzLjAxNSAwIDAgMCAxNiAzbTAgMjRhMTEgMTEgMCAxIDEgMTEtMTEgMTEuMDEgMTEuMDEgMCAwIDEtMTEgMTEiLz48cGF0aCBmaWxsPSIjQjIwRjAzIiBkPSJNMTcuMDM4IDE4LjYxNUgxNC44N0wxNC41NjMgOS41aDIuNzgzem0tMS4wODQgMS40MjdxLjY2IDAgMS4wNTcuMzg4LjQwNy4zODkuNDA3Ljk5NCAwIC41OTYtLjQwNy45ODQtLjM5Ny4zOS0xLjA1Ny4zODktLjY1IDAtMS4wNTYtLjM4OS0uMzk4LS4zODktLjM5OC0uOTg0IDAtLjU5Ny4zOTgtLjk4NS40MDYtLjM5NyAxLjA1Ni0uMzk3Ii8+PC9zdmc+");background-repeat:no-repeat;background-size:contain;padding-left:34px}@media (prefers-color-scheme: dark){body{background-color:#222;color:#d9d9d9}}</style>
<meta http-equiv="refresh" content="360">
</head>
<body>
<div class="main-wrapper" role="main">
<div class="main-content">
<noscript>
<div class="h2"><span id="challenge-error-text">Enable JavaScript and cookies to continue</span></div>
</noscript>
</div>
</div>
<script>(function(){
window._cf_chl_opt = {cvId: '3',cZone: 'dl.acm.org',cType: 'managed',cRay: '96bd1633cbf67786',cH: 'bDm8KDTvPv5mTq8Zsj6x1QnlLYH8ZmR1GaUqMvVjZCU-1754635902-1.2.1.1-w3M0kykRRbtIkZrdfGEyXh.T7IglaZmolrPyYtOl.LkGFcGTEBevUDkl4G16wfSu',cUPMDTk:"\/doi\/abs\/10.5555\/3504035.3505114?__cf_chl_tk=h6690f7NlTLklq7.lazUZDHQoD7R6tyFUiCAlmXGQdk-1754635902-1.0.1.1-tL_6EOxUgqIgFB0jIC.wTI9VvD8g6LZCXGyPcMyBMSM",cFPWv: 'b',cITimeS: '1754635902',cTplC:0,cTplV:5,cTplB: 'cf',fa:"\/doi\/abs\/10.5555\/3504035.3505114?__cf_chl_f_tk=h6690f7NlTLklq7.lazUZDHQoD7R6tyFUiCAlmXGQdk-1754635902-1.0.1.1-tL_6EOxUgqIgFB0jIC.wTI9VvD8g6LZCXGyPcMyBMSM",
md: 'gl4.ADGKGtLoC_TWdwF.8LCASJMUeARMk7ISx7Wwzls-1754635902-1.2.1.1-GiQgi9YmXSr3tD7SYersjfIHQ8fdDsbpn.144eUT34uEdtOw.moqnrr.8FFvjQoaRTYscrBoytvKLnKCUviN55ITSH8WoiRbi2oYDG6vpWqQbTb7qsd_rqqe8GbNWFGQeAPISJJDHFyFWIr7WCIbzPZf6GRjr.d5vdUDRIclzNKY_yulzxUEVaO7r3lPNRt.hUDGgcrUlXm8PkN6gBh79SWkbKg6aC1WMwWt0hPtbM.pLChCGF802D11gNLRVhgyCP4BPueEO61a52D8Sfm7SxG3nnc2Ub.7d0DKYXWRwSiP1wLX7CrrPGMDtCTPIMIldLsPLFV2WGQ1uInBXVJuBuFQx6XKLVMieWDN5QoW4VvWeEgq6gObr5d_pPyCK1YKxGYkTB0luWElbeEkz.M92aDcshHW03nK4tfpJPSEA4U6or6E016Sa8AaRN0gAdSryxsd12IUissO8jMxGSnelQZkMnP0xaGRo21045hGyF2L04NXta4nl2Rq7Bar29CNUgVCH54BCOZUT5bHFal0uT0C_Jo4fseSXbVM4kTFWqNC9wTTPN9n_ATiAVkGewdTx1nuzi963v9kSpbOgkgFHLuFfjM30qm08Sfb61Aep.SEHpWKonIO9qnFa00D3ZmHa741o4Pc_qbV5iP4jnFRSXekot1JYP8YaUW4zjd2JzuUpyZxrd7Me5wTxFN7Of1A4sYnaaPUI_CxxOzjQrTCyd22WHhF8pen5IDhN_5lAd8c8KlJGMW13GXLxcSX4772otyK.egQ5Gc4eBJ0IpUCHUyLvpJqEIpamK9B7WgNFbOikmGJkKJ3q1lyf42.lroacWKfTOcaCpTemSg9R6xwxGrCO8Z9YlbB4sJmtZO1cBX4a0D3xMnMy7dG6eiLZuVppdBw3uGFgKM93lDOX298XiXjRU2vJOJQrAmZ0rxdOGuf7BApz7XylCHICaU119wq3UTQyVaWr7YPlKGq5GVt7GoBlkzsDSgTlR.MYjtpi60',
mdrd: 'pKKIpIAuVI6T1VjA4aenhuYIMfHT1USBUAariMeCjeU-1754635902-1.2.1.1-ah3yo3o6x5mnDRt902Zb3iwPdKCaO5Lu.1q5vv9C37DTEP2QBBBjIqMCMZ3VbvIuoeX.wVJ.o2lXmJ80hZva67JDyIbonjYj_S1_G4ITQCx3MvNBDwCJFnaHQFrjeFu12gIyYYdNEPT9M5.7hn9t_AdWM403OfMYLZcM4oFf9xCLyAh_WghuipXeH8UooW_IzqVbiRRwmqfq._.OPMQjM9huYGeg8JkroBs9POSOOqQ0t8_tgI8ssAzwJ6Eckeszpa9QsLU56HYizFuklSCDcw6NqLfZ2uKW4JYdMYNBgYfYn6s9M6AEGI0umaA7HJHXG8X97ukxwu7h96ZB2.eHMyLzv6MKGvMEfEcqVUUczfz8r7mIAnJ3xRCtmCMS0rsAJWY6AdHvWsTofgRDwKUlg7y.uWr04rAHpRHSpl3f1b53tthRqjykuF9K2T_XUI0j0kNzpt0kPXQnlKRRuLeBNd7nCVh9jlatHwcZthkV76DyW4zOG7xncjrfrwNdtgjPLq6mrUhCw_rc_E3WsQGyvR9vmo7TRyaxefcTDwnJXE2bqX9dsndyA6kEWaHzuJnRMY7pMw9GRK.X5qegDVkbM_e5xtt_BROTsmmdMK2Gu5sgFuyetVJ4kjZmZfZ3nWNA_WoQoL6ME2mtMR4oiSOcTwXLM_slDFeUJpv6gSo.vFoKobycHKjtR.3Agjp6F3AeAfeOXqVlCTBX2P5b7JxgTLL6fJlGRCRoYg6Wp6iLleHlOLzHj.ZDAftsTCU_XY_FLQvdpmPDM9sRTQERbAiCKrzC3HzcbbYeRDRfW8j9oJBxrPhBSokwnYWa8TsNeZ.gpcdRCNZ7zTmWOo.iQZPcFVHUct.n5abDmz06hh_Fk8mQAUtvJTBcdv25EBnl.GQfNOnqrL77yq9AvJ2LdDg5e4iUgTdWukdkJACDC3S_djVBJy6ENoaJZUya351ff9D8atUAoe12A9DivgnA1z_Tctghgz_32bsa1LXx5_OsyQUBE7sjVrA0hWYBGhfRaxNm.2Y09yYArVkPbC98fsvzqfd0McOHkCb8WkloRDi7.rsLVShPzIzFbCnG3jjUGF9YFb7ZNaM6Rfr2f52.1VhnLx12AaqSj3Qy7GFRx6jZtS3wM03HYj1kTvolaIDgm_tIqgI9j9W_w35HNPYOE6E1.AYV7JVcqPbyEjtc1X4AvCkjrmWevfRBx1L3UYt83ANcIfRUpIgW32kXNrmG_prYsbAoGRtUylOFPOt2szLS1SATfbhTUrEH7zmDP81ICxvgBXT..eVeRHOsajDw2w2f_Oxz7UtntFiRUBEwdUktQGc3gxWLdkjYW82AVWDpc27tTzv50WfOUB2s.iwII93cbMUiZlxmBSk.uvAmv9zjwBpVcNXIJrPwRRzQAqKL8N2h5H6LXbR4IAZVYbYgqkPBjb4wHy4_s8bwstC5EXsToOJZuk6FLJWxQIt6edyqknAGFg.tw3cXVp4mkHdhwTP7dejdhFLmWE16Sr1jgPJ8bM3yh.gA04Kk3Yfo406Ny3BvblS_i1KB4aeUroMvjZAbVfqyowg.OgM1STs0StSOBdU.AigruS8XuVRxTB26GKHO6PBe1iU9keLEKF4uNOkNPoP5dc0N8pz5_UecTF94F_pLAGau7_zWMjhuK93PEnQuYDAy5JMr4O06ZDsW1IxgFvLlIkL0P7HksG9_vUrFxoYISYfZrr3ULJf7ZMoD1EVlGJtNSg6qT938xbPLd5y1P5t.qnOt3p.YbDm.1M_fIlHJu3Q_yWfqrVIliGx9CQ27IytWRm_1bq47TUxOyOp9HvMs2J01GgoBUYS0Qwbc_QwNnXoVlbD9okTQirql5.gm7y5bBDNoGDlQ5J9_X3nIQBeVGN4wtqBamHtXCmG9vsARU4P7CeBTaZhEdt_wvOpuNFAaGxc14DAsbh.bzNLVfWFuejO9P6jkLtOCmQ24PI7Zj_YGBv6YdVFTVvJAGrOaykzRvlFaYWuj262j48jZbvAGYtWK0xkN4DjHEGW2IDZpRRxcV6tI6sUVYlM2hIaRk_ibychQvoTPukPwAytNobjyCwPhIEY2ibGTWBUcsHqS5kWM7DSNFAwCj6L0SBBoAXu6NVC1cLYmsRhzNFAukrPBu4WywZ2PKwXHUCsznSW2AuK1iov3.j9n3SA1uOPDU.PpXZhzaEEM5pka9gqcDNDOO4s_8t4TQRSkV7nHUiZaKoYSk_HWG5q3mrbY1hWU8kZ4z4aZZlgX0tCa0WU7wHaSKSljKqOdvhR.1Bf5wCAZjnqO8JPo0RH3kk2ZpSYvJlbgwJezbGdWF_I0c75zWgDL1d5cgGWzlD_WNCMfmtMpYradl447JoO.G.Mx9Tb7rfFIay4CrYBmxEo91NKmtg',
};
var a = document.createElement('script');
a.src = '/cdn-cgi/challenge-platform/h/b/orchestrate/chl_page/v1?ray=96bd1633cbf67786';
window._cf_chl_opt.cOgUHash = location.hash === '' && location.href.indexOf('#') !== -1 ? '#' : location.hash;
window._cf_chl_opt.cOgUQuery = location.search === '' && location.href.slice(0, location.href.length - window._cf_chl_opt.cOgUHash.length).indexOf('?') !== -1 ? '?' : 
location.search;
if (window.history && window.history.replaceState) {
	var ogU = location.pathname + window._cf_chl_opt.cOgUQuery + window._cf_chl_opt.cOgUHash;
	history.replaceState(null, null,"\/doi\/abs\/10.5555\/3504035.3505114?__cf_chl_rt_tk=h6690f7NlTLklq7.lazUZDHQoD7R6tyFUiCAlmXGQdk-1754635902-1.0.1.1-tL_6EOxUgqIgFB0jIC.wTI9VvD8g6LZCXGyPcMyBMSM"+ window._cf_chl_opt.cOgUHash);
	a.onload = function() {history.replaceState(null, null, ogU);}}document.getElementsByTagName('head')[0].appendChild(a);}());</script>
</body>
</html>`;
    assert.equal(
      "object",
      typeof extractRedirect(html, 3, current, 0),
      "sixth JS redir",
    );
    assert.isTrue(
       extractRedirect(html, 3, current, 0).message.startsWith('https://'),
      "sixth JS redir",
    );



  });

  // TODO check loop limiting in other regexp branches
  it("go 7.1: MorePages extractRedirect haxxy web bits", () => {
    let current = "https://first.url/page11#testing?werwer=fghfhf&qwe=cbcb";
    const obj2 = new PageCollection([]);
    const obj = new MorePages(obj2, NullVendorMod, 666);
    obj.setOffset(0, current);

    let html = "<script> location='/page11'; </script>";
    assert.equal(
      false,
      extractRedirect(html, 3, current, 0),
      "redirect to relative URL",
    );

    html = "<script> location='https://first.url/'; </script>";
    assert.equal(
      false,
      extractRedirect(html, 3, current, 0),
      "exec back to a homepage ",
    );

    html = "<script> location='https://second.url/'; </script>";
    assert.equal(
      "object",
      typeof extractRedirect(html, 3, current, 0),
      "exec a company buyout ",
    );
  });
});
