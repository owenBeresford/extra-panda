import { Curl } from "node-libcurl";

import { log } from "../log-services";
import { COOKIE_JAR, TIMEOUT } from './constants';
import type {
  successType,
  failureType,
  closeType,
  HTMLTransformable,
} from "./types";


// a boring net-work function, that supports cookie populations
// If curl has cookie problems https://www.npmjs.com/package/http-cookie-agent
export function fetch2(
  url: string,
  good1: successType,
  bad1: failureType,
  close: closeType,
): void {
  const curl = new Curl();
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
    "accept-language: en-GB,en;q=0.5",
    "user-agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0",
  ]);
  curl.setOpt("URL", url);
  curl.setOpt("COOKIEJAR", COOKIE_JAR);
  curl.setOpt("COOKIEFILE", COOKIE_JAR);
  // sept 2024: Note official redirect tech, added in first version
  curl.setOpt("FOLLOWLOCATION", true);
  curl.setOpt("TIMEOUT", TIMEOUT);
  curl.setOpt("VERBOSE", 1);
  curl.setOpt("CONNECTTIMEOUT", TIMEOUT);

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
      .catch(function (ee) {
        console.warn(ee);
        log(
          "warn",
          "REDIRECT [" + offset + "] of " + url + " to " + ee.message,
        );
        if (url !== ee.message) {
          await exec_reference_url(offset, ee.message, handler);
        }
      })
  );
  //////////////////////////////////////////////////////////////////////////////////////////////////////
}

async function delay(ms: number): Promise<void> {
  return new Promise((good, bad) => setTimeout(good, ms));
}
