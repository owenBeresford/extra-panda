import { assert, describe, it, assertType } from "vitest";
import { JSDOM } from "jsdom";

import { page } from "./page-seed";
import { Fetchable, Cookieable } from "../all-types";
import { appendIsland, setIsland, isFullstack } from "../dom-base";
import { TEST_ONLY } from "../string-base";
const {
  getFetch,
  articleName,
  pullout,
  makeRefUrl,
  runFetch,
  addLineBreaks,
  pad,
  _getCookie,
  mapAttribute,
  importDate,
  dateMunge,
} = TEST_ONLY;

describe("TEST string-base", () => {

  it("go 4: pad", () => {
    assert.equal(pad(1), "01", "assert #4");
    assert.equal(pad(10), "10", "assert #5");
    assert.equal(pad(1000), "1000", "assert #6");
    assert.throws(
      () => {
        pad(-1);
      },
      "Value passed must be a counting number above 0",
      "assert #7",
    );
    assert.throws(
      () => {
        pad(0);
      },
      "Value passed must be a counting number above 0",
      "assert #8",
    );
  });

  it("go 7: importDate", () => {
    assert.equal(
      importDate("ymdhis", "2024-06-01 09:00:00").toString(),
      new Date("2024-06-01 09:00:00").toString(),
      "assert #12",
    );
    assert.equal(
      importDate("ymdhis", "2024-06-01T09:00:00").toString(),
      new Date("2024-06-01 09:00:00").toString(),
      "assert #T3",
    );
    assert.equal(
      importDate("ymdhis", "2024/06/01 09:00:00").toString(),
      new Date("2024-06-01 09:00:00").toString(),
      "assert #14",
    );
    assert.equal(
      importDate("ymdhis", "2024/06/01T09:00:00").toString(),
      new Date("2024-06-01 09:00:00").toString(),
      "assert #15",
    );
    assert.equal(
      importDate("ymdhis", "2024-06-01", "09:00:00").toString(),
      new Date("2024-06-01 09:00:00").toString(),
      "assert #16",
    );
    assert.equal(
      importDate("ydmhis", "2024-06-01 09:00:00").toString(),
      new Date("2024-01-06 09:00:00").toString(),
      "assert #19",
    );
    assert.equal(
      importDate("dmyhis", "06-01-2024 09:00:00").toString(),
      new Date("2024-01-06 09:00:00").toString(),
      "assert #20",
    );

    assert.equal(
      importDate("ymd", "2024-06-01", "").toString(),
      "Invalid Date",
      "assert #17",
    );
    assert.equal(
      importDate("ymd", "2024-06-01").toString(),
      "Invalid Date",
      "assert #18",
    );
  });

  it("go 8: dateMunge", () => {
    assert.equal(
      dateMunge(
        new Date("1980-02-19 00:00:00").getTime() / 1000,
        new Date("1983-02-12 00:00:00"),
        true,
      ),
      " 19-Feb-1980 ",
      "assert #22",
    );
    assert.equal(
      dateMunge(
        new Date("1980-02-19 00:00:00").getTime(),
        new Date("1983-02-12 00:00:00"),
        true,
      ),
      " 19-Feb-1980 ",
      "assert #21",
    );
    assert.equal(
      dateMunge(
        new Date("1980-02-19 00:00:00").getTime(),
        new Date("1983-02-12 00:00:00"),
        false,
      ),
      " 19-02-1980 00:00",
      "assert #23",
    );

    assert.equal(
      dateMunge(
        new Date("2001-02-19 00:00:00").getTime(),
        new Date("1983-02-12 00:00:00"),
        false,
      ),
      " 19-02-2001 00:00",
      "assert #24",
    );
    assert.equal(
      dateMunge(new Date("1980-02-19 00:00:00").getTime(), "1983-02-12", true),
      " 19-Feb-1980 ",
      "assert #25",
    );
  });

  it("go 10: addLineBreak", () => {
    let str1 =
      "fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ag aga gdgadfg";
    let str2 = str1;
    assert.equal(addLineBreaks(str1), str2, "assert #26");
    str1 =
      "fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg";
    str2 = `fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gd↩
gadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag ↩
aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga gga↩
dg ag aga gdgadfg`;
    assert.equal(addLineBreaks(str1), str2, "assert #27");

    str1 =
      "fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg";
    str2 = `fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga f↩
gaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg↩
 adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdf↩
ggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga gga↩
dg ag aga gdgadfg`;
    assert.equal(addLineBreaks(str1, 60), str2, "assert #28");

    str1 =
      "fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg";
    str2 = `fgsd gdfggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fPING
gaga ggadg ag aga gdgadfg fgsd gdfggaz gdfgadfg agadfg agadgPING
 adfgadgad gadfgadfgadga fgaga ggadg ag aga gdgadfg fgsd gdfPING
ggaz gdfgadfg agadfg agadg adfgadgad gadfgadfgadga fgaga ggaPING
dg ag aga gdgadfg`;
    assert.equal(addLineBreaks(str1, 60, "PING"), str2, "assert #29");
  });

  

  it("go 3: articleName", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/home", 2);
    assert.equal(articleName(), "<name>", "assert #3");
    assert.equal(articleName(loc), "home", "assert #4");
  });

  it("go 6: mapAttribute", (context) => {
    if (!isFullstack()) {
      context.skip();
    }

    const [dom, loc] = page("http://192.168.0.35/resource/home", 2);
    let str = `<h2 id="item1">dfg dfgdgdfg dfg dgdfgdf g</h2>
<h5 id="item2">dfg dfgdgdfg dfg dgdfgdf g</h5>`;
    appendIsland("#point2", str, dom);

    assert.equal(
      mapAttribute(dom.querySelector("#item1"), "right"),
      "100",
      "asset #10",
    );
    assert.equal(
      mapAttribute(dom.querySelector("#item1"), "right"),
      100,
      "asset #11",
    );
  });

  it("go 15: makeRefUrl", () => {
    const [dom, loc] = page("http://192.168.0.35/resource/react18-notes", 2);
    assert.equal(
      makeRefUrl("/resources/XXX-references", loc),
      "/resources/react18-notes-references",
      "assert #33",
    );
  });

  it("go 15.1 makeRefUrl", () => {
    const [dom, loc] = page(
      "http://192.168.0.35/resource/react18-notes?varable=value",
      2,
    );
    assert.equal(
      makeRefUrl("/resources/XXX-references", loc),
      "/resources/react18-notes-references",
      "assert #34",
    );
  });

  //  it("go 5: pad", () => {
  //	  const [dom, loc]=page("http://192.168.0.35/resource/home");
  //
  //  });
});
