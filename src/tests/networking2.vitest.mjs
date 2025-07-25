// the asserts are in the worker class
import { describe, it, vi } from "vitest";

import { fetch2, exec_reference_url, delay } from "../references/networking";
import { FakePage } from "../references/fake-page";

vi.setConfig({ testTimeout: 0 });
// IOIO pull LAN IPs out, use LAN IP lookup function from somewhere

describe("TEST references networking2 ", () => {
  it.sequential("go 1: networking fetch2 ", async () => {
    return new Promise(async (good, bad) => {
      const FP1 = new FakePage();
      FP1.promiseExits(good, bad, -1);
      FP1.setState(2);
      let URL = "http://192.168.1.218/resource/contact-me";
      let d1 = new Date();
      await fetch2(URL, FP1.success, FP1.failure, FP1.assignClose);
      let d2 = new Date();
      console.log("First fetch claims ", d2 - d1);

      /*    // this shows that the asserts in the fake module are happening
	FP1.setState(5);
	await fetch2(URL, FP1.success, FP1.failure, FP1.assignClose );
	*/
    });
  });

  it.sequential("go 1.1: networking fetch2(bad IP) ", () => {
    return new Promise(async (good, bad) => {
      const FP2 = new FakePage();
      FP2.promiseExits(good, bad, -1);
      let URL = "http://192.168.128.0/resource/contact-me";
      FP2.setState(5);
      let d1 = new Date();
      await fetch2(URL, FP2.success, FP2.failure, FP2.assignClose);
      let d2 = new Date();
      console.log("second fetch claims ", d2 - d1);
    }).catch((err) => {
      assert.notEqual(err.message, "");
    });
  });

  it.sequential("go 1.2: networking fetch2(wiki) ", async () => {
    return new Promise(async (good, bad) => {
      const FP3 = new FakePage();
      FP3.promiseExits(good, bad, -1);
      let URL = "https://en.wikipedia.org/wiki/Sturgeon%27s_law";
      FP3.setState(2);
      let d1 = new Date();
      await fetch2(URL, FP3.success, FP3.failure, FP3.assignClose);
      let d2 = new Date();
      console.log("third fetch claims ", d2 - d1);
    });
  });

  it.sequential("go 1.3: networking fetch2(github) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage();
      FP4.promiseExits(good, bad, -1);
      let URL = "https://github.com/owenBeresford/extra-panda/";

      FP4.setState(2);
      let d1 = new Date();
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
      let d2 = new Date();
      console.log("fourth fetch claims ", d2 - d1);
    });
  });

  it.sequential("go 1.5: networking fetch2( stackoverflow) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage();
      FP4.promiseExits(good, bad, -1);
      let URL = "https://stackoverflow.com/questions/";

      FP4.setState(2);
      let d1 = new Date();
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
      let d2 = new Date();
      console.log("sixth fetch claims ", d2 - d1);
    });
  });

  it.sequential("go 1.4: networking fetch2( Elsevier) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage();
      FP4.promiseExits(good, bad, -1);
      let URL = "https://www.sciencedirect.com/science/";

      FP4.setState(2);
      let d1 = new Date();
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
      let d2 = new Date();
      console.log("sixth fetch claims ", d2 - d1);
    });
  });

  it.sequential("go 2: exec_reference_url(good URL) ", async () => {
    const FP5 = new FakePage();
    FP5.setState(2);
    let URL = "http://192.168.1.218/resource/contact-me";
    await exec_reference_url(0, URL, FP5);
  });

  it.sequential("go 2: exec_reference_urli(bad URL) ", async () => {
    const FP5 = new FakePage();
    FP5.setState(5);
    let URL = "http://192.168.218i.0/resource/contact-me";
    await exec_reference_url(0, URL, FP5);
  });
});
