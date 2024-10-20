import { Cookieable } from "./all-types";

/**
 * COOKIE
 * A class to allow access to cookies.
 * This version is mostly used by FF and odd browsers.
 *
 * IMPURE & uses globals
 * source code copied from: then **amended**
 * @see [https://www.tabnine.com/academy/javascript/how-to-set-cookies-javascript/]
 *   as common libraries outside of npm seem really flakey
 *
 * @implements Cookieable
 * @public
 */
export class QOOKIE implements Cookieable {
  /**
   * set
   * Write to the local document
 
   * @param {string} cName
   * @param {string} cValue
   * @param {number} expDays
   * @public
   * @returns {void}
   */
  set(cName: string, cValue: string, expDays: number): void {
    let expires = "";
    if (expDays) {
      const d1 = new Date();
      d1.setTime(d1.getTime() + expDays * 24 * 60 * 60 * 1000);
      expires = "expires=" + d1.toUTCString();
    }
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  }

  /**
   * get
   * Retrieve data from the document
 
   * @param {string} cName
   * @public
   * @returns {void}
   */
  get(cName: string): string {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split("; ");
    let res;

    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) {
        res = val.substring(name.length);
      }
    });
    return res;
  }
}

/////////////////////////////////////////////////// testing ///////////////////////////////////////////////

export const TEST_ONLY = {
  QOOKIE,
};
