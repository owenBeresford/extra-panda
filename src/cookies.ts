import type { Cookieable } from "./all-types";
import { APPEARANCE_COOKIE } from "./immutables";
import { accessCookie } from "./networking";
// import { log } from "./log-services";
import { assignCSSBlob } from "./dom-base";

/**
 * COOKIE
 * A class to allow access to cookies.
 * Codebase cannot use Chrome builtin plugins and TS, so all browsers use this
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
   * Am setting ";secure" flag, but not ";samesite"
   * @see [https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie] 

   * @param {string} nom
   * @param {string} cValue
   * @param {number} expDays
   * @public
   * @returns {void}
   */
  public static set(nom: string, cValue: string, expDays: number, dom:Document): void {
    let expires = "";
    if (expDays) {
      const d1 = new Date();
      d1.setTime(d1.getTime() + expDays * 24 * 60 * 60 * 1000);
      expires = "expires=" + d1.toUTCString();
    }
    dom.cookie = nom + "=" + cValue + "; " + expires + "; path=/ ;secure";
  }

  /**
   * get
   * Retrieve data from the document
 
   * @param {string} nom
   * @public
   * @returns {string}
   */
  public static get(nom: string, dom:Document): string {
    const name = nom + "=";
    const cDecoded = decodeURIComponent(dom.cookie);
    const cArr = cDecoded.split("; ");
    let res = "";

    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) {
        res = val.substring(name.length);
      }
    });
    return res;
  }

  /**
     * wipe
     * Erase a cookie that is there
 
     * @param {string} nom
     * @public
     * @returns {void}
     */
  public static wipe(nom: string, dom:Document): void {
    const d1 = new Date();
    d1.setTime(d1.getTime() + 8 * 60 * 60 * 1000);
    const expires = "expires=" + d1.toUTCString();
    dom.cookie = nom + "= ; " + expires + "; path=/ ;secure";
    dom.cookie = nom + "= ; " + expires + "; path=/ ";
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
  dom:Document=document,
): void {
  ft = ft.replaceAll(";", "%38");
  clr = clr.replaceAll(";", "%38");
  dir = dir.replaceAll(";", "%38");
  fs = fs.replaceAll(";", "%38");

  const json: string = JSON.stringify({ ft: ft, fs: fs, dn: dir, cr: clr });
  QOOKIE.set(APPEARANCE_COOKIE, json, 365.254, dom);
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

  const dat: string = QOOKIE.get(APPEARANCE_COOKIE, dom);
  if (!dat) {
    return;
  }

  const dat2 = JSON.parse(dat);
  dat2["ft"] = dat2["ft"].replaceAll("%38", ";");
  dat2["cr"] = dat2["cr"].replaceAll("%38", ";");
  dat2["dn"] = dat2["dn"].replaceAll("%38", ";");
  dat2["fs"] = dat2["fs"].replaceAll("%38", ";");

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

  assignCSSBlob(CSS, "client-set-css", dom);
}

/////////////////////////////////////////////////// testing ///////////////////////////////////////////////

export const TEST_ONLY = {
  QOOKIE,
  applyAppearance,
  storeAppearance,
};
