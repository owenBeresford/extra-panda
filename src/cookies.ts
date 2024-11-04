import { Cookieable } from "./all-types";
import { APPEARANCE_COOKIE, accessCookie } from "./networking";

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
 * @implements {Cookieable}
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
   * @returns {string}
   */
  get(cName: string): string {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded.split("; ");
    let res="";

    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) {
        res = val.substring(name.length);
      }
    });
    return res;
  }
}

/**
 * storeAppearance
 * Write supplied data to a COOKIE
 *
 * @param {string} ft - font
 * @param {string} fs - font-size
 * @param {string} dir - direction, mostly unused
 * @param {string} clr - color scheme
 * @protected
 * @returns {void}
 */
export function storeAppearance(
  ft: string,
  fs: string,
  dir: string,
  clr: string,
): void {
  const COOKIE: Cookieable = accessCookie();
  const json: string = JSON.stringify({ ft: ft, fs: fs, dn: dir, cr: clr });
  COOKIE.set(APPEARANCE_COOKIE, json, 365.254);
}

/**
 * applyAppearance
 * Apply branding settings found in a COOKIE
 * @param {Document =document} dom
 * @protected
 * @returns {void}
 */
export function applyAppearance(dom: Document): void {
  const COOKIE: Cookieable = accessCookie();

  const dat: string = COOKIE.get(APPEARANCE_COOKIE);
  if (!dat) {
    return;
  }

  const dat2 = JSON.parse(dat);
  // IOIO FIXME add type-washing to cookie

  if (!(dat2["ft"] && dat2["fs"])) {
    return;
  }
  const CSS: string =
    "body, .annoyingBody { font-family: " +
    dat2["ft"] +
    "; font-size: " +
    dat2["fs"] +
    "; direction:" +
    dat2["dn"] +
    "; }";

  const STYLE = dom.createElement("style");
  STYLE.setAttribute("id", "client-set-css");
  STYLE.innerText = CSS;
  dom.getElementsByTagName("head")[0].append(STYLE);
}

/////////////////////////////////////////////////// testing ///////////////////////////////////////////////

export const TEST_ONLY = {
  QOOKIE,
  applyAppearance,
  storeAppearance,
};
