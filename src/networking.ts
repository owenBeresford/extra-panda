/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import type { Fetchable, SimpleResponse, Cookieable } from "./all-types";
// this uses document as an in-code literal,
// I have an alternative dynamic load if this static load breaks anything.
import { QOOKIE } from "./cookies";

/**
 * debug
 * a debug tool
 * @param {Location = location} loc
 * @param {string ="debug"} target
 * @public
 * @returns {boolean}
 */
export function debug(loc: Location, target: string = "debug"): boolean {
  const u: URLSearchParams = new URLSearchParams(loc.search);
  return u.has(target);
}

/**
 A better hack for counting log messages, that is better TS.
 Unfortunately is is about 4x times longer. 
*/
type BetterConsole = typeof console & { LOG_USAGE: number };
type VisabiltityToLogging = () => number;
let localConsole = console as BetterConsole;

/**
 * enableLogCounter
 * A function to setup a log counter, and return an access function
 
 * @param  {BetterConsole} cons
 * @public
 * @returns {VisabiltityToLogging}
 */
function enableLogCounter(cons: BetterConsole): VisabiltityToLogging {
  const nom: string = "LOG_USAGE";
  if (!Object.hasOwn(cons, nom)) {
    Object.defineProperty(cons, nom, {
      value: 0,
      writable: true,
      enumerable: true,
      configurable: false,
    });
  }
  cons[nom] = 0;
  localConsole = cons;
  return () => {
    return cons[nom];
  };
}

/**
 * log
 * A simple console.log alias, to make a later extension easier
 * @param {string} typ - The Type on the message, should match functions on console/ a syslog
 * @param {Array<string>} inputs - a variable list
 * @public
 * @returns {void}
 */
export function log(typ: string, ...inputs: string[]): void {
  localConsole.LOG_USAGE++;
  if (typ in console) {
    localConsole[typ](`[${typ.toUpperCase()}] ${inputs.join(", ")}`);
  } else {
    localConsole.log(`[${typ.toUpperCase()}] ${inputs.join(", ")}`);
  }
}

// useful strings
export const ALL_REFERENCE = ".addReferences";
export const ALL_REFERENCE_LINKS = ALL_REFERENCE + " sup a";
export const URL_PLACEHOLDER = "https://owenberesford.me.uk/";
export const TEST_MACHINE = "192.168.0.35";
export const APPEARANCE_COOKIE = "appearance";
export const EM_SZ = 16;
export const SHOW_ERROR = "showBiblioErrors";

/**
  According to the internet a current phone is likely to have a PPI of over 300
  (historical trend) a cheap lazer will have a PPI of 300, 600 or 900 PPI
  a desktop / laptop is likely to have a 80-150 PPI
 
  @see https://www.displayninja.com/what-is-pixel-density/
  @see https://phonesdata.com/en/best/screenppi/
 */
export const MOBILE_MIN_PPI = 180;

/**
 * getFetch
 * Access to fetch that will work across JS interpreters
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
 * @param {Location =location} loc
 * @public
 * @throws {Error} = predictably, in case of network issue
 * @returns {Promise<SimpleResponse>}
 */
export async function runFetch(
  url: string,
  trap: boolean,
  loc: Location,
): Promise<SimpleResponse> {
  const f = getFetch();
  const ldebug = debug(loc);
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
    if (trans.status === 404) {
      throw new Error("got HTTP 404");
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
      throw new Error("ERROR getting asset " + url + " " + e.toString());
    }
  }
}

/**
 * delay
 * a method for testing that pretends to be thread.sleep()
 
 * @param {number} ms
 * @public
 * @returns {Promise<void>}
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((good, bad) => setTimeout(good, ms));
}

/**
 * domLog
 * Add a message to the current webpage in #log  IMPURE
 * NOTE THIS FUNCTION CONTAINS document REFERENCES
 *
 * @param {string} str - your message
 * @param {boolean =false} bold
 * @param {boolean =false} html - set this to true to embed the first arg as HTML, not as text
 * @public
 * @returns {void}
 */
export function domLog(
  str: string,
  bold: boolean = false,
  html: boolean = false,
): void {
  const LOG: HTMLUListElement = document.getElementById(
    "log",
  ) as HTMLUListElement;
  const li: HTMLElement = document.createElement("li");
  const dd = new Date();
  const tt = document.createElement("time");
  tt.dateTime = dd.toString();
  tt.textContent =
    dd.getUTCHours() + ":" + dd.getUTCMinutes() + ":" + dd.getUTCSeconds();
  li.appendChild(tt);
  if (html) {
    const t2 = document.createElement("template");
    t2.innerHTML = str;
    li.appendChild(t2.content);
  } else {
    li.appendChild(document.createTextNode(" => " + str));
  }
  if (bold) {
    li.setAttribute("style", "font-weight:115%; font-size:115%; ");
  }
  LOG.append(li);
}

/**
 * accessCookie
 * Generate a cookie access object PURE
 * The awkward name is not to collide with Chrome extensions.
 * The commented code should run faster in Chrome, however it was making errors in tests, so I commented it
 * @public
 * @returns {Cookieable }
 */
export function accessCookie(): Cookieable {
  // first option is for chrome based browsers,
  // technically served via a JS plugin that is always present
  // Typescript really doesnt like this
  //  if (typeof getCookie === "function") {
  //    return { get: getCookie, set: setCookie } as Cookieable;
  //  }
  // ELSE:
  if (typeof document !== "undefined") {
    //		const { QOOKIE } =import('./cookies');
    return new QOOKIE();
  } else {
    // void implementation for unit tests
    // test with cookies need to be run **inside** a browser
    // cookie behaviour is more complex than in the 90s.
    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      set(cName: string, cValue: string, expDays: number): void {},
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get(cName: string): string {
        return "";
      },
    } as Cookieable;
  }
}

/////////////////////////////////////////////////// testing ///////////////////////////////////////////////

export const TEST_ONLY = {
  runFetch,
  getFetch,
  log,
  debug,
  delay,
  accessCookie,
  enableLogCounter,
};
