import { Curl } from "node-libcurl";

import { log } from "../log-services";
import {
  COOKIE_JAR,
  TIMEOUT,
  CURL_VERBOSE,
  STRICT_NETWORKING,
} from "./constants";
import type {
  successType,
  failureType,
  closeType,
  HTMLTransformable,
  TaggedCurl,
  CurlHeadersBlob,
} from "./types";

// counter for the timeout
let TO: number = TIMEOUT;
export function setMyTimeout(nu: number = TIMEOUT): void {
  TO = nu;
}

// This is a dup-file name, but different technology.  Built for different purposes
// a boring net-work function, that supports cookie populations
export function fetch2(
  url: string,
  good1: successType,
  bad1: failureType,
  close: closeType,
): void {
  const curl: TaggedCurl = new Curl();
  curl.isClose = false;
  let CB = (): void => {
    if (!curl.isClose) {
      curl.close();
      curl.isClose = true;
    }
  };
  CB = CB.bind(this);
  // this is confusing to read, this registers the curl->close CB for later on
  close(CB);

  curl.setOpt("HTTPHEADER", [
    "upgrade-insecure-requests: 1",
	"Referrer-policy: strict-origin-when-cross-origin",
	"accept-language: en-GB,en;q=0.9,nl;q=0.8,de-DE;q=0.7,de;q=0.6",
	"user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
	'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138"',
	"sec-ch-ua-mobile: ?0",
	'sec-ch-ua-platform: "Windows"',
	"sec-fetch-dest: document",
	"sec-fetch-mode: navigate",
	"sec-fetch-site: cross-site",
	"sec-fetch-user: ?1"

  ]);
  curl.setOpt("URL", url);
  curl.setOpt("COOKIEJAR", COOKIE_JAR);
  curl.setOpt("COOKIEFILE", COOKIE_JAR);
  // sept 2024: Note official redirect tech, added in first version
  curl.setOpt("FOLLOWLOCATION", true);
  curl.setOpt("TIMEOUT", TO);
  curl.setOpt("VERBOSE", CURL_VERBOSE);
  curl.setOpt("CONNECTTIMEOUT", TO);

  // scale out to other domains as needed
  // this will probably need to be a manual operation to know the URLs
  if (url.match("unicode.org")) {
    curl.setOpt(Curl.option.RANGE, "0-10000");
  }
  if (url.match(".pdf")) {
    curl.setOpt("TIMEOUT", TIMEOUT * 3.3);
  }

  curl.on("end", good1);
  curl.on("error", bad1);
  if (!curl.isClose) {
    curl.perform();
  }
}

export function exec_reference_url(
  offset: number,
  url: string,
  handler: HTMLTransformable,
): Promise<any> {
  return (
    new Promise(async function (good, bad) {
      handler.promiseExits(good, bad, offset);
      try {
        // I sleep here
        await delay(TIMEOUT * 1200);

        log("debug", "[" + offset + "] " + url);
        fetch2(url, handler.success, handler.failure, handler.assignClose);
      } catch (e) {
        log(
          "warn",
          "W W W W W W W W W W W W W W W W [" +
            offset +
            "] Network error with " +
            url +
            " :: " +
            e,
        );
        bad(e);
      }
    })
      ///////////////////////////////////////////////////////////////////////////////////////////////////////
      // sept 2024, this is preferred catch point
      .catch(async function (ee) {
        log(
          "warn",
          "REDIRECT [" + offset + "] of " + url + " to " + ee.message,
        );
        if (url !== ee.message) {
          await exec_reference_url(offset, ee.message, handler);
        } else if (STRICT_NETWORKING) {
          throw new Error(
            "impossible situation, 4523586423424 (so I'm bailing)",
          );
        }
        handler.failure("Unspecified failure "+ee.message);
        return null;
      })
  );
  //////////////////////////////////////////////////////////////////////////////////////////////////////
}

export async function delay(ms: number): Promise<void> {
  return new Promise((good, bad) => setTimeout(good, ms));
}
