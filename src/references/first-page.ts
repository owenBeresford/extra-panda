import { parse } from "node-html-parser";
import { log } from "../logging-services";
import type { HTMLTransformable, PromiseCB } from "./types";

export class FirstPage implements HTMLTransformable {
  protected good: PromiseCB;
  protected bad: PromiseCB;
  protected offset: number;
  protected CB: CBtype;

  public constructor() {
    this.assignClose = this.assignClose.bind(this);
    this.success = this.success.bind(this);
    this.failure = this.failure.bind(this);
  }

  public success(statusCode: string, data: string): void {
    // also param headers:Headers
    if (Math.floor(parseInt(statusCode, 10) / 100) !== 2) {
      return this.bad(new Error("Recieved " + statusCode));
    }

    let root = parse(data);
    let nn = root.querySelectorAll("sup a");
    let list: Array<string> = [];
    nn.forEach(function (val) {
      list.push(val.getAttribute("href"));
    });
    if (this.CB) {
      console.log("Running cURL close");
      this.CB();
    }
    if (list.length < 2) {
      log(
        "warn",
        "Didn't find many/ any URLs in page/ Is this not on my site, or is it not an article?",
      );
      process.exit(0);
    }
    this.good(list);
  }

  public failure(msg: Error|string): void {
    console.warn(msg);
    this.CB();
    this.bad("Error " + msg);
  }

  public promiseExits(good: PromiseCB, bad: PromiseCB, offset: number): void {
    this.good = good;
    this.bad = bad;
    this.offset = offset;
  }

  public assignClose(cb: CBtype): void {
    this.CB = cb;
  }
}
