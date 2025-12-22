import { assert, describe, it } from "vitest";
import { TEST_MACHINE } from "../immutables";

import { page } from "./page-seed-vite";
/// import { Fetchable, Cookieable } from "../all-types";
import { TEST_ONLY } from "../string-base";
const {
  articleName,
  makeRefUrl,
  addLineBreaks,
  pad,
  standardisedWordCount,
  isLocal,
  booleanMap,
  importDate,
  dateMunge,
} = TEST_ONLY;

describe("TEST string-base", () => {
  it("go 1: pad", () => {
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

  it("go 2: isLocal", () => {
    assert.equal(true, isLocal("192.168.0.1"), "assert ");
    assert.equal(true, isLocal("127.0.0.1"), "assert ");
    assert.equal(true, isLocal("localhost"), "assert ");
    assert.equal(true, isLocal("192.168.0.666"), "assert ");
    // malformed IP, but is local
    assert.equal(true, isLocal("0:0:0:0:0:0:0:1"), "assert ");
    assert.equal(true, isLocal("::1"), "assert ");

    assert.equal(false, isLocal("http://google.com"), "assert ");
    assert.equal(false, isLocal("https://google.com"), "assert ");
    assert.equal(false, isLocal("google.com"), "assert ");
    assert.equal(false, isLocal("google.fr"), "assert ");
    assert.equal(false, isLocal("12.34.56.78"), "assert ");
    assert.equal(false, isLocal("0x66.0x66.0x66.0x66"), "assert ");
    assert.equal(false, isLocal(""), "assert ");
    assert.equal(false, isLocal("23.56.34/24"), "assert ");
    assert.equal(false, isLocal("23.56.34.12"), "assert ");
  });

  it("go 3: booleanMap", () => {
    assert.equal(true, booleanMap("true"), "assert ");
    assert.equal(true, booleanMap("TRUE"), "assert ");
    assert.equal(true, booleanMap("1"), "assert ");
    assert.equal(true, booleanMap(1), "assert ");
    assert.equal(true, booleanMap("ON"), "assert ");
    assert.equal(true, booleanMap("on"), "assert ");

    assert.equal(false, booleanMap("false"), "assert ");
    assert.equal(false, booleanMap("FALSE"), "assert ");
    assert.equal(false, booleanMap("0"), "assert ");
    assert.equal(false, booleanMap(0), "assert ");
    assert.equal(false, booleanMap("OFF"), "assert ");
    assert.equal(false, booleanMap("off"), "assert ");
  });

  it("go 4: importDate", () => {
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

  it("go 5: dateMunge", () => {
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

  it("go 6: addLineBreak", () => {
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

  it("go 7: articleName", () => {
    const [dom, loc] = page(TEST_MACHINE+"resource/home", 2);
    assert.equal(articleName({ pathname: "" }), "<name>", "assert #3");
    assert.equal(articleName(loc), "home", "assert #4");
  });

  it("go 8: makeRefUrl", () => {
    const [dom, loc] = page(TEST_MACHINE+"resource/react18-notes", 2);
    assert.equal(
      makeRefUrl("/resources/XXX-references", loc),
      "/resources/react18-notes-references",
      "assert #33",
    );
  });

  it("go 8.1 makeRefUrl", () => {
    const [dom, loc] = page(
      TEST_MACHINE+"resource/react18-notes?variable=value",
      2,
    );
    assert.equal(
      makeRefUrl("/resources/XXX-references", loc),
      "/resources/react18-notes-references",
      "assert #34",
    );
  });

  it("go 8.2 makeRefUrl", () => {
    const [dom, loc] = page(
      TEST_MACHINE+"resource/react18-notes#results",
      2,
    );
    assert.equal(
      makeRefUrl("/resources/XXX-references", loc),
      "/resources/react18-notes-references",
      "assert #35",
    );
  });

  it("go 8.3 makeRefUrl", () => {
    const [dom, loc] = page(
      TEST_MACHINE+"resource/react18-notes?variable=value#results",
      2,
    );
    assert.equal(
      makeRefUrl("/resources/XXX-references", loc),
      "/resources/react18-notes-references",
      "assert #36",
    );
  });

  it("go 9 standardisedWordCount", () => {
    const sample1 = "The cat sat on the mat";
    const sample2 =
      "                                                                           ";
    const sample3 = "dfg 5 fgdfg 4 sdf 444 sdfsdfs 2             ";
    const sample4 = "The c.a.t. sat on the mat";

    assert.equal(standardisedWordCount(sample1), 6, "assert #37");
    assert.equal(standardisedWordCount(sample2), 0, "assert #38");
    assert.equal(standardisedWordCount(sample3), 4, "assert #39");
    assert.equal(standardisedWordCount(sample4), 8, "assert #40");
  });
});
