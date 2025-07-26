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
	protected startDate:Date;
	protected stopDate:Date;

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
	this.startDate=new Date();
  }

  public success(statusCode: string, data: string): void {
    // also param headers:Headers
    assert.equal(
      this._state,
      cleanHTTPstatus(statusCode),
      "Server returned desired results " + statusCode,
    );
    if (typeof this.CB === "function") {
      console.log("success(): Running cURL close");
      this.CB();
    }

	this.stopDate=new Date();
	console.log("[DEBUG] success network duration :"+(this.stopDate-this.startDate )+"ms. ");
    if (cleanHTTPstatus(statusCode) !== this._state) {
      this.bad(new Error("Recieved " + statusCode));
    } else {
      this.good([]);
    }
  }

  public failure(msg: Error | string): void {
    console.warn(msg, "and ", this._state);

    if (typeof this.CB === "function") {
      console.log("[DEBUG] failure(): Running cURL close");
      this.CB();
    }
    assert.equal(this._state, 5, "Server returned desired results " + msg);
	this.stopDate=new Date();
	console.log("[DEBUG] failure network duration :"+(this.stopDate-this.startDate )+"ms. " );
    if (this._state === 5) {
      this.good([]);
    } else {
      this.bad("Error: " + msg);
    }
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
