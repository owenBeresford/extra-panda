import { assert, expect, describe, it } from "vitest";

import { fetch2, exec_reference_url, delay } from "../references/networking";
import { FakePage } from "../references/fake-page";

describe("TEST references networking2 ", () => {
  // fetch2(url: string, good1: successType, bad1: failureType, close: closeType,): void
  it("go 1: networking fetch2 ", () => {
    const FP = new FakePage();
    FP.state = 2;
    let URL = "http://192.168.1.218/resource/contact-me";
    let d1 = new Date();
    fetch2(URL, FP.success, FP.failure, FP.assignClose);
    let d2 = new Date();
    console.log("First fetch claims ", d2 - d1);

    /**  this shows that the asserts in the fake module are happening
		FP.state=5;
		fetch2(URL, FP.success, FP.failure, FP.assignClose );
	*/
  });

  it("go 1.1: networking fetch2(bad IP) ", () => {
    const FP = new FakePage();
    let URL = "http://192.168.128.0/resource/contact-me";
    FP.state = 5;
    let d1 = new Date();
    fetch2(URL, FP.success, FP.failure, FP.assignClose);
    let d2 = new Date();
    console.log("second fetch claims ", d2 - d1);
  });

  it("go 1.2: networking fetch2(wiki) ", () => {
    const FP = new FakePage();
    let URL = "https//en.wikipedia.org/wiki/Sturgeon%27s_law";
    FP.state = 2;
    let d1 = new Date();
    fetch2(URL, FP.success, FP.failure, FP.assignClose);
    let d2 = new Date();
    console.log("third fetch claims ", d2 - d1);
  });

  it("go 2: exec_reference_url ", () => {
    const FP = new FakePage();
    FP.state = 2;
    let URL = "http://192.168.1.218/resource/contact-me";
    exec_reference_url(0, URL, FP);
  });
});
await delay(2000);
