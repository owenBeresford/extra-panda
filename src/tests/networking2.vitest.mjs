// the asserts are in the worker class
import { describe, it, vi } from "vitest";
import { networkInterfaces } from "node:os";
import { TEST_MACHINE } from "../immutables";

import {
  fetch2,
  exec_reference_url,
  delay,
  mapInterfaces,
} from "../references/networking";
import { FakePage } from "../references/fake-page";

vi.setConfig({ testTimeout: 0 });

describe("TEST references networking2 ", () => {
  const LAN_IP =
    "http://" + mapInterfaces(networkInterfaces())["first"][0] + "/";

  const BAD_IP = TEST_MACHINE;

  it.sequential("go 1: networking fetch2 ", async () => {
    return new Promise(async (good, bad) => {
      const FP1 = new FakePage();
      FP1.promiseExits(good, bad, -1);
      FP1.setState(2);
      let URL = LAN_IP + "resource/contact-me";
      await fetch2(URL, FP1.success, FP1.failure, FP1.assignClose);

      /*    // this shows that the asserts in the fake module are happening
	FP1.setState(5);
	await fetch2(URL, FP1.success, FP1.failure, FP1.assignClose );
	*/
    });
  });

  /*
  it.sequential("go 1.1: networking fetch2(bad IP) ", async () => {
    return new Promise(async (good, bad) => {
      const FP2 = new FakePage();
      FP2.promiseExits(good, bad, -1);
      let URL = BAD_IP + "resource/contact-me";
      FP2.setState(5);
      await fetch2(URL, FP2.success, FP2.failure, FP2.assignClose);
    }).catch((err) => {
      assert.notEqual(err.message, "");
    });
  });
*/

  it.sequential("go 1.2: networking fetch2(wiki) ", async () => {
    return new Promise(async (good, bad) => {
      const FP3 = new FakePage();
      FP3.promiseExits(good, bad, -1);
      let URL = "https://en.wikipedia.org/wiki/Sturgeon%27s_law";
      FP3.setState(2);
      await fetch2(URL, FP3.success, FP3.failure, FP3.assignClose);
    });
  });

  it.sequential("go 1.3: networking fetch2(github) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage();
      FP4.promiseExits(good, bad, -1);
      let URL = "https://github.com/owenBeresford/extra-panda/";

      FP4.setState(2);
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
    });
  });

  /*
  it.sequential("go 1.5: networking fetch2( stackoverflow) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage();
      FP4.promiseExits(good, bad, -1);
      let URL = "https://stackoverflow.com/questions/";

      FP4.setState(2);
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
    });
  });

  it.sequential("go 1.6: networking fetch2( medium ) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage();
      FP4.promiseExits(good, bad, -1);
      let URL = "https://medium.com/in-the-weeds";

      FP4.setState(2);
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
    });
  });
*/
  it.sequential("go 1.7: networking fetch2( isreali VPS site ) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage(true);
      FP4.promiseExits(good, bad, -1);
      let URL = "https://il.clubvps.com/?";

      FP4.setState(2);
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
    });
  });

  it.sequential("go 1.8: networking fetch2( alibaba cloud ) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage();
      FP4.promiseExits(good, bad, -1);
      let URL = "https://www.alibabacloud.com/en/china-gateway?_p_lc=1";

      FP4.setState(2);
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
    });
  });

  it.sequential("go 1.9: networking fetch2( drupal) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage(true);
      FP4.promiseExits(good, bad, -1);
      let URL = "https://www.drupal.org/security/secure-configuration";

      FP4.setState(2);
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
    });
  });

  it.sequential("go 2: exec_reference_url(good URL) ", async () => {
    const FP5 = new FakePage();
    FP5.setState(2);
    let URL = LAN_IP + "resource/contact-me";
    await exec_reference_url(0, URL, FP5);
  });

  /*
  it.sequential("go 2: exec_reference_url(bad URL) ", async () => {
    const FP5 = new FakePage();
    FP5.setState(5);
    let URL = BAD_IP + "resource/contact-me";
    await exec_reference_url(0, URL, FP5);
  });
*/
  /*
  it.sequential("go 1.4: networking fetch2( Elsevier) ", async () => {
    return new Promise(async (good, bad) => {
      const FP4 = new FakePage();
      FP4.promiseExits(good, bad, -1);
      let URL = "https://www.sciencedirect.com/science/";

      FP4.setState(2);
      await fetch2(URL, FP4.success, FP4.failure, FP4.assignClose);
    });
  });
*/
});
