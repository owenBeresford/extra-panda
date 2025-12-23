import { assert, expect, describe, it, vi } from "vitest";

import { TEST_MACHINE } from "../immutables";
import { TEST_ONLY } from "../references/string-manip";
const { publicise_IP, valueOfUrl, normaliseString, baseURL, cleanHTTPstatus } =
  TEST_ONLY;

describe("TEST references string-manip", () => {
  it("go 1: publicise_IP ", () => {
    assert.equal(
      "https://google.co.uk/",
      publicise_IP("https://google.co.uk/"),
      "step 1",
    );
    assert.equal(
      "https://127.0.0.1/",
      publicise_IP("https://127.0.0.1/"),
      "step 2",
    );
    assert.equal(
      "https://8.8.8.8/",
      publicise_IP("https://8.8.8.8/"),
      "step 3",
    );
    // NOTE This test has to be HTTP
    assert.equal(
      "https://owenberesford.me.uk/",
      publicise_IP("http://192.168.0.0/"),
      "step 4",
    );
    assert.equal(
      "https://192.168.1.1/",
      publicise_IP("https://192.168.1.1/"),
      "step 5",
    );
  });

  it("go 2: valueOfUrl ", () => {
    assert.equal("google.co.uk", valueOfUrl("https://google.co.uk/"), "step 1");
    // not recommended, some-times happens
    assert.equal(
      "https://google.co.uk",
      valueOfUrl("https://google.co.uk"),
      "step 2",
    );
    // stupid option, not really a valid URL
    assert.equal(
      "https://google.co.uk//",
      valueOfUrl("https://google.co.uk//"),
      "step 3",
    );
    // this is for github URLs
    assert.equal(
      "step2",
      valueOfUrl("https://google.co.uk/step1/step2/"),
      "step 4",
    );
    // a full file path URL
    assert.equal(
      "step2",
      valueOfUrl("https://google.co.uk/step1/step2/step3.html"),
      "step 5",
    );
  });

  it("go 3: normaliseString ", () => {
    assert.equal("TEST", normaliseString("	  TEST "), "step 1");
    assert.equal(
      "TEST ".padEnd(500, "#"),
      normaliseString("	  TEST ".padEnd(10_000, "#")),
      "step 2",
    );
    assert.equal(
      "””     ‘‘‘‘  TEST",
      normaliseString(
        " &rdquo;&rdquo;&quot;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lsquo;&lsquo;&lsquo;&lsquo;  TEST ",
      ),
      "step 3",
    );
    assert.equal("", normaliseString(""), "step 4");
  });

  it("go 4: baseURL ", () => {
    assert.equal(
      "https;//blerg.blog",
      baseURL("https;//blerg.blog#qwerwerw?rgerg=fghf"),
      "step 1",
    );
    assert.equal("https;//blerg.blog", baseURL("https;//blerg.blog"), "step 2");
  });

  it("go 4: cleanHTTPstatus ", () => {
    assert.equal(2, cleanHTTPstatus("200"), "step 1");
    assert.equal(2, cleanHTTPstatus("204"), "step 2");
    assert.equal(4, cleanHTTPstatus("404"), "step 3");
    assert.equal(4, cleanHTTPstatus("403"), "step 4");
    assert.equal(5, cleanHTTPstatus("512"), "step 5");
  });

  it("go 1.1: publicise_IP ", () => {
    //		expect( ()=> publicise_IP("http://192.168.0.0/") ).toThrow(new Error(''))
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    publicise_IP("http://192.168.0.0/");
    //
    //   ACTUNG: this below line will fail, as I am using a wrapper for console.log
    //    to make this test pass add a console.log at string-manip.ts+75
    //
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("go 1.2: publicise_IP ", () => {
    //		expect( ()=>publicise_IP("http://192.168.0.0/") ).toThrow(new Error(''))
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    publicise_IP("https://192.168.0.0/");
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
