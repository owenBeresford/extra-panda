import { parse } from "node-html-parser";
import { log } from "../log-services";
import { LINK_MIN_NO, HTTP_ACCEPT } from "./constants";
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
    for (let i in list) {
      // #leSigh.   The Wiki library converts these to HTML entities, as part of UTF-8 safety
      if (list[i].includes("&amp;")) {
        list[i] = decodeURI(list[1]);
      }
    }
    this.good(list);
  }
  // above de-encoding
  // add url filter  towardsdatascience + medium => scribe.rip, sciencedirect=>arxiv  alibabacloud=>??
  // strip UTM if found

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
}
