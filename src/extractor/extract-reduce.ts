import type {
  Pseudable,
  Hashtable,
  HashHashtable,
  HashHashHashtable,
  ExportMode,
} from "./types";
import { hash2json } from "./output-formats";
import { ExtractMap } from "./extract-map";
import { log, debug, changeCount_simple } from "../log-services";

export class ExtractReduce {
  #dom: Document;
  #win: Window;

  /**
     * constructor
 
     * @param {Document} dom
     * @param {Window} win
     * @public
     * @returns {ExtractReduce}
     */
  constructor(dom: Document, win: Window) {
    this.#dom = dom;
    this.#win = win;
  }

  /**
     * filterCommonTags
     * For CSS attributes present on the body element, don't repeat.  Edits param
 
     * @param {HashHashtable} buf
     * @param {string} root - selector for the component root element
     * @public
     * @returns {HashHashtable}
     */
  filterCommonTags(
    buf: HashHashtable,
    root: string,
    src: ExtractMap,
  ): HashHashtable {
    let ZERO = src.extractLocal(src.exportClassname(root, true), null);
    for (let i in buf) {
      changeCount_simple(buf[i], "");
      for (let j of Object.keys(buf[i])) {
        /* If trap reads:
                * current CSS attribute is in the root element
                * and the selector isn't the root selector
                * and value of the attribute is the same
           then delete it, as the value will inherit
        */
        if (j in ZERO && i !== root && ZERO[j] === buf[i][j]) {
          delete buf[i][j];
        }
      }
      changeCount_simple(buf[i], "filterCommonTags[" + root + "] - " + i);
    }

    ZERO = src.extractLocal("body", null);
    for (let i in buf) {
      changeCount_simple(buf[i], "");
      for (let j of Object.keys(buf[i])) {
        if (j in ZERO && ZERO[j] === buf[i][j]) {
          delete buf[i][j];
        }
      }
      changeCount_simple(buf[i], "filterCommonTags[body] - " + i);
    }

    return buf;
  }

  /**
 * filterEmpty
 * Remove CSS names that have no attributes in them, as that is noise
 
 * @param {HashHashtable} buf
 * @public
 * @returns {HashHashtable}
 */
  filterEmpty(buf: HashHashtable): HashHashtable {
    changeCount_simple(buf, "");
    for (let i of Object.keys(buf)) {
      if (Object.values(buf[i]).length === 0) {
        delete buf[i];
      }
    }
    changeCount_simple(buf, "filterEmpty");
    return buf;
  }

  /**
 * generateKey
 * HTTPS only, create a short hash of the supplied data

 * @param {Hashtable} val 
 * @public
 * @returns {string}
 */
  async generateKey(val: Hashtable): Promise<string> {
    try {
      let t1 = JSON.stringify(val);
      const encoder = new TextEncoder();
      const data = encoder.encode(t1);

      let t2 = await this.#win.crypto.subtle.digest("SHA-1", data);
      return String.fromCharCode.apply(null, Array.from(new Uint8Array(t2)));
    } catch (e) {
      const CATCHES_ARE_VERY_ANNOYING_IN_TYPESCRIPT = e as Error; // worse than Java
      log(
        "error",
        "Unable to make a hash?? " +
          CATCHES_ARE_VERY_ANNOYING_IN_TYPESCRIPT.message,
        CATCHES_ARE_VERY_ANNOYING_IN_TYPESCRIPT.stack,
      );
      return "";
    }
  }

  /**
 * generateInvert
 * Create an invert index, so duplicate data can be removed

 * @param {HashHashtable } buf
 * @public
 * @returns {HashHashtable} 
 */
  async generateInvert(buf: HashHashtable): Promise<HashHashtable> {
    changeCount_simple(buf, "");
    let inv: Hashtable = {} as Hashtable;
    for (let i in buf) {
      let key = await this.generateKey(buf[i]);
      inv[key] = i;
    }

    for (let i in buf) {
      let cur = await this.generateKey(buf[i]);
      if (cur in inv && inv[cur] !== i) {
        delete buf[i];
      }
    }
    changeCount_simple(buf, "generateInvert");
    return buf;
  }

  /**
 * externalFilter
 * A filter to strip vendor prefixed CSS so local CSS remains

 * @param {Array<string>} raw
 * @param {Array<string>} prefixes
 * @public
 * @returns {Array<string>}
 */
  externalFilter(raw: Array<string>, prefixes: Array<string>): Array<string> {
    changeCount_simple(raw, "");
    let ret: Array<string> = [];
    for (let i = 0; i < raw.length; i++) {
      let found = false;
      prefixes.map(function (a: string, b: number): void {
        let re1 = new RegExp(" " + a, "i");
        if (raw[i].startsWith(a)) {
          found = true;
        } else if (raw[i].match(re1)) {
          found = true;
        }
      });
      if (!found) {
        ret.push(raw[i]);
      }
    }
    changeCount_simple(ret, "externalFilter");
    return ret;
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TEST_ONLY = {
  ExtractReduce,
};
