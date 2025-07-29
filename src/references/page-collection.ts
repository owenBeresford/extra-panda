import { baseURL } from "./string-manip";
import { log } from "../log-services";
import type { Reference } from "./types";
import { BATCH_SZ } from "./constants";

export class PageCollection {
  protected _offset: number;
  protected batchNum: number;
  protected src: Array<string>;
  protected dst: Array<Reference | boolean>;
  protected shorts: Record<string, number>;
  protected _loop: number; // a counter to limit badly setup JS forwarding, so it will break

  public constructor(src: Array<string>) {
    this.src = src;
    this.dst = Array(src.length);
    // I have to allocate an array before I fill() it with initial values.
    // I have declared it above.   Is this Clang?
    this.dst.fill(false, 0, src.length);
    this.shorts = {};
    this._loop = 0;
    this.batchNum = 0;
    this._offset = 0;
    log(
      "debug",
      "Start to annotate " + src.length + " references in this article",
    );
  }

  // side effects
  public save(item: Reference, offset: number): void {
    console.assert(
      offset < this.dst.length,
      "save(): Invalid reference offset " + offset,
    );
    if (typeof this.dst[offset] !== "boolean") {
      if (
        !(
          !("title" in this.dst[offset]) ||
          this.dst[offset].title.includes("HTTP_ERROR")
        )
      ) {
        throw new Error("Why overwrite slot " + offset);
      }
    }
    // would like to not need code like this, but it is fail early branching, compared to runtime loading the webpage.
    if (item.url === "" || item.url === undefined || item.url === false) {
      throw new Error("Why does the incoming data have no URL? " + offset);
    }

    this.shorts[baseURL(this.src[offset])] = offset;
    this.dst[offset] = item;
  }

  public get currentBatch(): Array<string> {
    let ret: Array<string> = [];

    for (let j = 0; j < BATCH_SZ; j++) {
      let _offset = this.batchNum * BATCH_SZ + j;
      if (_offset >= this.src.length) {
        break;
      } // used in last batch, which isn't likely to be full.

      ret.push("" + this.src[_offset]);
    }
    return ret;
  }

  // side effects
  // i as in imaginary number
  public offset(i: number): number {
    let ret: number = this.batchNum * BATCH_SZ + i;
    if (i >= BATCH_SZ - 1) {
      this.batchNum++;
    }
    return ret;
  }

  public morePages(cur: number): boolean {
    return cur < this.src.length;
  }

  // side effects
  public mapRepeatDomain(url: string, cur: number): boolean {
    const HASH = baseURL(url);
    if (HASH in this.shorts) {
      this.dst[cur] = Object.assign({}, this.dst[this.shorts[HASH]], {
        url: url,
      }) as Reference;
      return true;
    }
    return false;
  }

  public get resultsArray(): Readonly<Array<Reference | boolean>> {
    return this.dst;
  }

  public zeroLoop(): void {
    this._loop = 0;
  }

  public get loop(): number {
    return this._loop;
  }

  public incLoop(): void {
    this._loop++;
    // max value test somewhere
  }

  public mapFails(): Array<string> {
    let out = [];
    for (let i = 0; i < this.src.length; i++) {
      if (
        this.dst[i].title.match("HTTP_ERROR.*Timeout") ||
        this.dst[i].title.match("HTTP_ERROR.*resolve host name")
      ) {
        out.push(this.src[i]);
      }
    }
    return out;
  }

  public merge(other: PageCollection): void {
    if (this.dst.includes(false) || this.dst.includes(undefined)) {
      // there is low odds the offsets will be correct in other if its not complete
      throw new Error("Cannot merge partially completed data ");
    }

    for (let i = 0; i < this.dst.length; i++) {
      if (this.dst[i].title.match("HTTP_ERROR")) {
        for (let j = 0; j < other.dst.length; j++) {
          if (
            other.src[j] === this.src[i] &&
            !other.dst[j].title.match("HTTP_ERROR")
          ) {
            this.dst[i] = { ...other.dst[j] };
            break;
          }
        }
      }
    }
  }
}
