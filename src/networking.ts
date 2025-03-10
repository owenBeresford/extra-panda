/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import type { Fetchable, Fetch, SimpleResponse, Cookieable } from "./all-types";
// this uses document as an in-code literal,
// I have an alternative dynamic load if this static load breaks anything.
import { QOOKIE } from "./cookies";
import { debug, log } from "./log-services";

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
  const f: Fetch = getFetch() as Fetch;
  const ldebug = debug(loc);
  try {
    const trans: Response = await f(url, { credentials: "same-origin" }) as Response;
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
      ((trans.headers as Headers)
        .get("content-type") as string)
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
      set(cName: string, cValue: string, expDays: number): void { },
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
  delay,
  accessCookie,
};
