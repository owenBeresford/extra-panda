import { parse } from "node-html-parser";
import { log } from "../log-services";
import { LINK_MIN_No, HTTP_ACCEPT } from "./constants";
import { cleanHTTPstatus } from './string-manip';
import type { HTMLTransformable, PromiseCB, CBtype, wrappedCloseType, CurlHeadersBlob } from "./types";

export class FirstPage implements HTMLTransformable {
  protected good: PromiseCB;
  protected bad: PromiseCB;
  protected offset: number;
  protected CB: wrappedCloseType;

  public constructor() {
    this.CB = false;

    this.assignClose = this.assignClose.bind(this);
    this.success = this.success.bind(this);
    this.failure = this.failure.bind(this);
  }

  public success(statusCode: string, data: string, headers: CurlHeadersBlob, ): void {
    // also param headers:Headers
    if (cleanHTTPstatus(statusCode) !== HTTP_ACCEPT) {
      return this.bad(new Error("Recieved " + statusCode));
    }

    let root = parse(data);
    let list: Array<string> = [];
    let nn = root.querySelectorAll("sup a");

    nn.forEach(function (val) {
      list.push(val.getAttribute("href"));
    });
    if(typeof this.CB =='function') {
      this.CB();
    }
    if (list.length < LINK_MIN_No) {
      log(
        "warn",
        "Didn't find many/ any URLs in page/ Is this not on my site, or is it not an article?",
      );
      process.exit(0);
    }
    this.good(list);
  }

  public failure(msg: Error|string): void {
    log('warn', ""+msg);
    if(typeof this.CB =='function') {
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
