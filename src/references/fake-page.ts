import { assert, expect, describe, it } from "vitest";
import { cleanHTTPstatus } from "./string-manip";
import type {
  HTMLTransformable,
  PromiseCB,
  CBtype,
  wrappedCloseType,
} from "./types";

export class FakePage implements HTMLTransformable {
  protected good: PromiseCB;
  protected bad: PromiseCB;
  protected CB: wrappedCloseType;
  protected _state: number;

  public constructor() {
    this.assignClose = this.assignClose.bind(this);
    this.success = this.success.bind(this);
    this.failure = this.failure.bind(this);
    this.setState = this.setState.bind(this);

    this.CB = false;
    this._state = 0;
  }

  // the "100 category" for HTTP codes, i.e. 2, 4, 5
  public setState(no: number) {
    console.log("Running setState with " + no);
    this._state = no;
  }

  public success(statusCode: string, data: string): void {
    // also param headers:Headers
    console.log("WWWW ", {"raw":statusCode, "cooked":cleanHTTPstatus(statusCode), "target":this._state});
    assert.equal(
      this._state,
      cleanHTTPstatus(statusCode),
      "Server returned desired results " + statusCode,
    );
    if (typeof this.CB === "function") {
      console.log("success(): Running cURL close");
      this.CB();
    }

    if (cleanHTTPstatus(statusCode) !== this._state) {
      this.bad(new Error("Recieved " + statusCode) );
    } else {
      this.good([]);
    }
  }

  public failure(msg: Error | string): void {
    console.warn(msg, "and ", this._state);

    if (typeof this.CB === "function") {
      console.log("failure(): Running cURL close");
      this.CB();
    }
    assert.equal(this._state, 5, "Server returned desired results " + msg);
	if(this._state === 5) { this.good([]); }
    else { this.bad("Error: " + msg); }
  }

  public promiseExits(good: PromiseCB, bad: PromiseCB, offset: number): void {
    this.good = good;
    this.bad = bad;
    //  this._offset = offset;
  }

  public assignClose(cb: wrappedCloseType): void {
    this.CB = cb;
  }
}
