// the asserts are in the worker class
import { describe, it, vi } from "vitest";
import { networkInterfaces } from "node:os";
import { Curl } from "node-libcurl";
import { TEST_MACHINE } from "../immutables";

import {
  fetch2,
  exec_reference_url,
  delay,
  mapInterfaces,
  TEST_ONLY,
} from "../references/networking";

vi.setConfig({ testTimeout: 0 });

describe("TEST references networking2 ", () => {
  const LAN_IP =
    "http://" + mapInterfaces(networkInterfaces())["first"][0] + "/";
  const BAD_IP = TEST_MACHINE;

  it.sequential("go 4: urlFiltering ", () => {
    const curl = new Curl();
    const { urlFiltering } = TEST_ONLY;
    // This is the way https://manpages.debian.org/bullseye-backports/libcurl4-doc/curl_url_get.3.en.html

    let url = "http://192.168.1.218/";
    assert.equal(urlFiltering(url, curl), curl, "assert #1");
    // console.log("WERWER {{", curl, "}}" );

    url =
      "https://stackoverflow.com/gdgdfg/ddgdfgkdfgsfs?fhfhf=fdgfhfgh&dfgdfgrer";
    assert.equal(urlFiltering(url, curl), curl, "assert #2");
    // console.log("WERWER2 {{", curl, "}}" );

    url = "https://unicode.org/gdgdfg/ddgdfgkdfgsfs?fhfhf=fdgfhfgh&dfgdfgrer";
    assert.equal(urlFiltering(url, curl), curl, "assert #3");
    // console.log("WERWER3 {{", curl, "}}" );
  });
});
