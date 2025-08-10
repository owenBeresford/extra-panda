import { parse } from "node-html-parser";
import { log } from "../log-services";
import { decodeEntities } from "../string-base";
import { LINK_MIN_NO, HTTP_ACCEPT, EXTRA_URL_FILTERING } from "./constants";
import { cleanHTTPstatus } from "./string-manip";

import type {
  HTMLTransformable,
  PromiseCB,
  CBtype,
  wrappedCloseType,
  CurlHeadersBlob,
} from "./types";

export class FirstPage implements HTMLTransformable {
  protected good: PromiseCB;
  protected bad: PromiseCB;
  protected offset: number;
  protected canExit: boolean;
  protected CB: wrappedCloseType;

  public constructor(canExit: boolean) {
    this.CB = false;
    this.canExit = canExit;

    this.assignClose = this.assignClose.bind(this);
    this.success = this.success.bind(this);
    this.failure = this.failure.bind(this);
  }

  public success(
    statusCode: string,
    data: string,
    headers: CurlHeadersBlob,
  ): void {
    // also param headers:Headers
    if (cleanHTTPstatus(statusCode) !== HTTP_ACCEPT) {
      this.bad(new Error("Recieved " + statusCode));
      return;
    }

    let root = parse(data);
    let list: Array<string> = [];
    let nn = root.querySelectorAll("sup a");

    nn.forEach(function (val) {
      list.push(val.getAttribute("href"));
    });
    if (typeof this.CB == "function") {
      this.CB();
    }
    if (list.length < LINK_MIN_NO) {
      log(
        "warn",
        "Didn't find many/ any URLs in page/ Is this not on my site, or is it not an article?",
      );
      if (this.canExit) {
        process.exit(0);
      } else {
        this.bad(
          new Error(
            "Didn't find many/ any URLs in page/ Is this not on my site, or is it not an article?",
          ),
        );
        return;
      }
    }
    if (EXTRA_URL_FILTERING) {
      list = this.urlCleaning(list);
    }
    this.good(list);
  }

  public failure(msg: Error | string): void {
    log("warn", "" + msg);
    if (typeof this.CB == "function") {
      this.CB();
    }
    this.bad("Error " + msg);
  }

  public promiseExits(good: PromiseCB, bad: PromiseCB, offset: number): void {
    this.good = good;
    this.bad = bad;
    this.offset = offset;
  }

  public assignClose(cb: wrappedCloseType): void {
    this.CB = cb;
  }

  // todo: add thing for Puny code
  // todo: URL encoding
  public urlCleaning(list: Array<string>): Array<string> {
    for (let i in list) {
      // #leSigh.   The Wiki library converts these to HTML entities, as part of UTF-8 safety
      if (list[i].includes("&amp;")) {
        list[i] = decodeEntities(decodeURI(list[i]));
      }

      // @see ["discussion on google link tracking" https://www.analyticsmania.com/post/utm-parameters-in-google-analytics-4/}
      if (list[i].includes("&utm_") || list[i].includes("?utm_")) {
        let target = new URLSearchParams(
          list[i].substring(list[i].indexOf("?")),
        );
        let keys = Array.from(target.keys());
        for (let i = 0; i < keys.length; i++) {
          if (keys[i].includes("utm_")) {
            target.delete(keys[i]);
          }
        }
        let tmp = list[i].substring(0, list[i].indexOf("?"));
        list[i] = tmp + target.toString();
      }
      if (list[i].includes("en-US") || list[i].includes("en_US")) {
        // cant automate this, as not all sites include all languages
        // for MSFT or Goog, the odds are reasonable
        log("warn", "URL '" + list[i] + "' is in USA format, try UK version");
      }
      if (list[i].includes("towardsdatascience")) {
        list[i] = list[i].replace("towardsdatascience.com", "scribe.rip");
      }
      if (list[i].includes("medium.com")) {
        list[i] = list[i].replace("medium.com", "scribe.rip");
      }
      if (list[i].includes("sciencedirect.com")) {
        throw new Error("Klaaxon, source article better " + list[i]);
      }
      if (list[i].includes("www.alibabacloud")) {
        throw new Error("Klaaxon, source article better " + list[i]);
      }
    }
    return list;
  }
}
