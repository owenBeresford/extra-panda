/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import { Fetchable, SimpleResponse, Cookieable } from "./all-types";

// Yes I know full well this is a dups of Mocks available in Jest
// Vitest also can do those Mocks
// but this is just a simple counter, not an object
// adding a dep for 1 int is overkill.
let LOG_USAGE: number = 0;

/**
 * debug
 * a debug tool
 * @param {Location = location} loc
 * @public
 * @returns {boolean}
 */
export function debug(loc: Location = location): boolean {
  const u: URLSearchParams = new URLSearchParams(loc.search);
  return u.has("debug");
}

/**
 * exportlog
 * A simple console.log alias, to make later extension easier
 * @param {string} typ - The Type on the message, should match functions on console/ a syslog
 * @param {Array<string>} inputs - a variable list
 * @public
 * @returns {void}
 */
export function log(typ: string, ...inputs: string[]): void {
  LOG_USAGE++;
  if (typ in console) {
    console[typ](`[${typ.toUpperCase()}] ${inputs.join(", ")}`);
  } else {
    console.log(`[${typ.toUpperCase()}] ${inputs.join(", ")}`);
  }
}

// useful strings
export const ALL_REFERENCE = ".addReferences";
export const ALL_REFERENCE_LINKS = ALL_REFERENCE + " sup a";
export const URL_PLACEHOLDER = "https://owenberesford.me.uk/";
export const TEST_MACHINE = "192.168.0.35";
export const APPEARANCE_COOKIE = "appearance";
export const EM_SZ = 16;

/**
  According to the internet a current phone is likely to have a PPI of over 300
  (historical trend) a cheap lazer will have a PPI of 300, 600 or 900 PPI
  a desktop / laptop is likely to be 80-150 PPI
 
https://www.displayninja.com/what-is-pixel-density/
https://phonesdata.com/en/best/screenppi/
 */
export const MOBILE_MIN_PPI = 180;

/**
 * getFetch
 * Access to fetch that is will work across JS interpreters
 * IMPURE due to logging
 * @public
 * @returns {Fetch| null}
 */
export function getFetch(): Fetchable {
  if (typeof window !== "undefined") {
    return window.fetch;
  } else if (typeof fetch === "function") {
    return fetch;
  } else {
    log("error", "Please stop using old versions of node.");
    throw new Error("Please stop using old versions of Node");
    return null;
  }
}

/**
 * runFetch
 * A simple wrapper current fetch()
 * IMPURE when I add logging
 * This behaves as a VERY SIMPLE middle-ware.
 * @param {string|URL} url
 * @param {boolean} trap ~ return null rather than an exception
 * @public
 * @throws {Error} = predictably, in case of network issue
 * @returns {Promise<SimpleResponse>}
 */
export async function runFetch(
  url: string | URL,
  trap: boolean,
): Promise<SimpleResponse> {
  const f = getFetch();
  const ldebug = debug();
  try {
    const trans: Response = await f(url, { credentials: "same-origin" });
    if (!trans.ok) {
      if (ldebug) {
        log("warn", "Failed to communicate with " + url);
      }
      if (trap) {
        return { body: "nothing", headers: {} as Headers, ok: false };
      } else {
        throw new Error("ERROR getting asset " + url);
      }
    }
    let payload = "";
    if (
      trans.headers
        .get("content-type")
        .toLowerCase()
        .startsWith("application/json")
    ) {
      payload = await trans.json();
    } else {
      payload = await trans.text();
    }

    if (ldebug) {
      log("info", "Successful JSON transaction " + url);
    }
    return {
      body: payload,
      headers: trans.headers,
      ok: true,
    };
  } catch (e) {
    if (ldebug) {
      log("error", "KLAXON, KLAXON failed: " + url + " " + e.toString());
    }
    if (trap) {
      return { body: "nothing", headers: {} as Headers, ok: false };
    } else {
      throw new Error("ERROR getting asset " + url);
    }
  }
}

// source code copied from: then amended
// https://www.tabnine.com/academy/javascript/how-to-set-cookies-javascript/
// as common libraries outside of npm seem really flakey

/**
  A class to allow access to cookies
  This version is mostly used by FF
 */
class COOKIE implements Cookieable {
  set(cName: string, cValue: string, expDays: number): void {
    let expires = "";
    if (expDays) {
      const d1 = new Date();
      d1.setTime(d1.getTime() + expDays * 24 * 60 * 60 * 1000);
      expires = "expires=" + d1.toUTCString();
    }
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
  }

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

/**
 * getCookie
 * Generate a cookie access object PURE
 * The commented code should faster in Chrome, however it was making errors in tests, so I commented it
 * @public
 * @returns {Cookieable }
 */
export function _getCookie(): Cookieable {
  // first option is for chrome based browsers,
  // technically served via a JS plugin that is always present
  //  if (typeof getCookie === "function") {
  //    return { get: getCookie, set: setCookie } as Cookieable;
  //  }
  return new COOKIE();
}

/////////////////////////////////////////////////// testing ///////////////////////////////////////////////

export const TEST_ONLY = {
  _getCookie,
  runFetch,
  getFetch,
  log,
  debug,
  getLogCounter: (): number => {
    return LOG_USAGE;
  },
};
