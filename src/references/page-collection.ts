import { shorten } from "./string-manip";
import { log } from "../log-services";
import type { Reference } from "./types";

export class PageCollection {
  protected _offset: number;
  protected batchSz: number;
  protected batchNum: number;
  protected src: Array<string>;
  protected dst: Array<Reference | boolean>;
  protected shorts: Record<string, number>;
  protected loop: number; // a counter to limit badly setup JS forwarding, so it will break

  public constructor(src: Array<string>, batch: number) {
    this.src = src;
    this.dst = Array(src.length);
    // I have to allocate an array before I fill() it with initial values.
    // I have declared it above.   Is this Clang?
    this.dst.fill(false, 0, src.length);
    this.shorts = {};
    this.loop = 0;
    this.batchSz = batch;
    this.batchNum = 0;
    this._offset = 0;
    log(
      "debug",
      "Start to annotate " + src.length + " references in this article",
    );
  }

  public save(item: Reference, offset: number): void {
    if (typeof this.dst[offset] !== "boolean") {
console.log("SFSFSDF", offset, this.dst[offset], item );
      throw new Error("Why overwrite slor " + offset);
    }
	if( item.url === '') {	
      throw new Error("Why does the incomming data have no URL? " + offset);
	}

    this.shorts[ shorten(this.src[offset]) ] = offset;
    this.dst[offset] = item;
  }

  public get currentBatch(): Array<string> {
    console.log(
      "There are " +
        this.src.length +
        "/" +
        this.batchSz +
        " links in  " +
        process.argv[3],
    );
    let ret: Array<string> = [];

    for (let j = 0; j < this.batchSz; j++) {
      let _offset = this.batchNum * this.batchSz + j;
      if (_offset >= this.src.length) {
        break;
      } // used in last batch, which isn't likely to be full.

      ret.push(""+this.src[_offset]);
    }
    this.batchNum++;
    return ret;
  }

  // i as in imaginary number
  public offset(i: number): number {
    return this.batchNum * this.batchSz + i;
  }

  public morePages(cur: number): boolean {
    return cur < this.src.length;
  }

  public mapRepeatDomain(url: string, cur: number): boolean {
    const HASH = shorten(url);
    if (HASH in this.shorts) {
      console.log("Hit URL cache [target slot=]", this.dst[cur] );
      this.dst[cur] = Object.assign({}, this.dst[this.shorts[HASH]], {
        url: url,
      }) as Reference;
console.log(" mapRepeatDomain "+cur,  this.dst[cur], this.dst[ this.shorts[HASH] ]);
      return true;
    }
    return false;
  }

  public zeroLoop():void {
    this.loop = 0;
  }

  public get loop():number {
    return this.loop;
  }

  public incLoop():void {
    this.loop++;
    // max value test somewhere
  }

  public get resultsArray(): Readonly<Array<Reference | boolean>> {
    return this.dst;
  }
}
