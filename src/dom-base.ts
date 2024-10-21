/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import {
  ScreenSizeArray,
  GenericEventHandler,
  Scrollable,
  ScreenOffsetArray,
  BOUNDARY,
} from "./all-types";
import { log, MOBILE_MIN_PPI, EM_SZ, ALL_REFERENCE } from "./networking";
import { booleanMap } from "./string-base";

/**
 * appendIsland
 * An important util function, which removes the need for jQuery, ShadowDOM AND other innerHTML hacks.
 * I have a historic avoidance of passing DOM object around the stack as it caused bad memory leaks.
 * Security note: Executes changes to innerHTML on an Element not attached to the DOM.  It is the callers' responsibility to not inject a JS blob that mines bitcoin by accident.
 * IMPURE
 * @param {string|HTMLElement} selector ~ where to appends the new content
 * @param {string} html ~ what to append
 * @param {Document =document} dom ~ reference to which DOM tree
 * @throws some sort of HTML error, if the supplied HTML is malformed.  Browser dependant
 * @public
 * @returns {undefined}
 */
export function appendIsland(
  selector: string | HTMLElement,
  html: string,
  dom: Document,
): void {
  try {
    if (dom === null) {
      throw new Error("Oh no! No DOM object!!");
    }

    const base: HTMLTemplateElement = dom.createElement("template");
    base.innerHTML = html;
    if (typeof selector === "string") {
      const tt: HTMLElement = dom.querySelector(selector) as HTMLElement;
      if (tt === null) {
        throw new Error("Oh no! DOM element not found: " + selector);
      }
      return tt.append(base.content);
    } else {
      return selector.append(base.content);
    }
  } catch (e) {
    log("error", e.toString());
  }
}

/**
 * ready
 * Triggers Page start-event
 *
 * @param {GenericEventHandler} callback
 * @param {Document =document} dom
 * @see [stack overflow answer https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery]
 * @throws In case of an unknown JS interpreter that supports an unknown pageReady event
 * @public
 * @returns {void}
 */
export function ready(callback: GenericEventHandler, dom: Document): void {
  if (dom.readyState !== "loading") {
    const e = dom.createEvent();
    callback(e);
  } else if (dom.addEventListener) {
    dom.addEventListener("DOMContentLoaded", callback);
  }
  throw new Error("Unknown JS interpreter, can't register code");
}

/**
 * setIsland
 * Replace the whole of the subtree with the param
 * I have a historic avoidance of passing DOM object around the stack as it caused bad memory leaks.
 * Security note: Executes changes to innerHTML on an Element not attached to the DOM.  It is the callers responsibility to not inject a JS blob that mines bitcoin.
 * IMPURE
 * @param {string|HTMLElement} selector
 * @param {string} html
 * @param {Document =document} dom
 * @throws some sort of HTML error, if the supplied HTML is malformed.  Browser dependant
 * @public
 * @returns {void}
 */
export function setIsland(
  selector: string | HTMLElement,
  html: string,
  dom: Document,
): void {
  const base = dom.createElement("template");
  base.innerHTML = html;

  if (typeof selector === "string") {
    const tt = dom.querySelector(selector);
    while (tt && tt.lastChild) {
      tt.removeChild(tt.lastChild);
    }
    return tt.append(base.content);
  } else {
    while (selector && selector.lastChild) {
      selector.removeChild(selector.lastChild);
    }
    return selector.append(base.content);
  }
}

/**
 * isFullstack
 * Workout if this JS runtime is inside a full range of technology, like a browser.
 * This is mostly used for tests.
 *
 * @param {Window =window} win
 * @public
 * @returns {boolean}
 */
export function isFullstack(win: Window): boolean {
  if (typeof win == "undefined") {
    return false;
  }

  const isNativeWindow = win.getComputedStyle
    .toString()
    .includes("[native code]");

  if (typeof isNativeWindow === "boolean" && isNativeWindow) {
    return true;
  }
  return false;
}

/**
 * mapAttribute
 * Extract the named limit of the element
 * PURE
 * @param {HTMLElement} ele
 * @param {BOUNDARY} attrib - One of top|bottom|left|right|width|height
 * @param {Window =window} win
 * @public
 * @returns {number} - the value of the requested
 */
export function mapAttribute(
  ele: HTMLElement,
  attrib: BOUNDARY,
  win: Window,
): number {
  try {
    if (!isFullstack(win)) {
      return -1;
    }

    const STYL = ele.getBoundingClientRect();
    return STYL[attrib];
  } catch (e) {
    log("error", "Missing data:" + e);
    return -1;
  }
}

/**
 * getArticleWidth
 * A utility to get current article width
 
 * @param {boolean} isLeft - left edge or right edge (of tooltip)?
 * @param {string} id - the base element for width computation
 * @param {Document =document} dom
 * @param {Window =window} win
 * @public
 * @returns {number} - will return -1 on mal-compliant webpages
 */
export function getArticleWidth(
  isLeft: boolean,
  id: string = ALL_REFERENCE,
  dom: Document,
  win: Window,
): number {
  const tmp = dom.querySelector(id);
  if (!tmp) {
    return -1;
  }

  const wid: number = Math.round(mapAttribute(tmp, "width", win));
  if (isLeft) {
    return wid - 32 * EM_SZ;
  } else {
    return wid;
  }
}

/**
 * docOffset
 * Better computation of number, returns doc co-ords for element location
      PURE
 * @param {HTMLElement} ele
 * @param {Scrollable} offsets - a Trait of Window, holding the scroll offset values
 * @protected
 * @returns {ScreenOffsetArray}
 */
function docOffsets(ele: HTMLElement, offsets: Scrollable): ScreenOffsetArray {
  const tmp = ele.getBoundingClientRect();
  return [
    Math.round(offsets.scrollY + tmp.top),
    Math.round(offsets.scrollX + tmp.left),
  ];
}

/**
 * copyURL
 * Copy the current URL into the paste buffer, for use in mobile view
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {void}
 */
export function copyURL(loc: Location, win: Window): void {
  try {
    if (!win.navigator.clipboard) {
      throw new Error("No clipboard available");
    }
    win.navigator.clipboard.writeText(loc.url).then(
      () => {
        // add class for CSS effect
        return;
      },
      (err: unknown) => {
        log("error", "FAILED: copy URL " + err);
      },
    );
  } catch (e0: unknown) {
    log(
      "error",
      "FAILED: copy URL feature borked " +
        e0 +
        "\nIt will fail on a HTTP site.",
    );
  }
}

/**
 * applyVolume
 * Log pixel offsets so the CSS can work correctly
 
 * @param {Document = document} dom
 * @param {Window = window} win
 * @public
 * @returns {void}
 */
export function applyVolume(dom: Document, win: Window): void {
  dom.querySelector("body").setAttribute("style", "--offset-height: 0;");
  const tt: Array<HTMLElement> = dom.querySelectorAll(
    ".lotsOfWords, .halferWords, .fewWords",
  );
  for (let i = 0; i < tt.length; i++) {
    tt[i].setAttribute(
      "style",
      "--offset-height: " + docOffsets(tt[i], win as Scrollable)[0] + "px;",
    );
  }
}

/**
 * expandDetails
 * Function to open DETAILS elements, when on a large screen.   IMPURE
 * Only apply to maquette articles at present.
 * NOTE: this doesn't care about mobile, just viewport size, to save a click for the user
 *
 * @param {number =1040} bigScreen - Minimum size for a large screen. The "bigscreenness" is regulated by CSS design
 * @param {Document =document} dom
 * @param {Location = location} loc
 * @param {Window = window} win
 * @public
 * @returns {void}
 */
export function expandDetails(
  bigScreen: number = 1040,
  dom: Document,
  loc: Location,
  win: Window,
): void {
  if (!dom.querySelector(".maquetteContainer")) {
    return;
  }

  if (screenWidth(loc, win) > bigScreen) {
    const THING = Array.from(
      dom.querySelectorAll(".maquetteContainer details"),
    );
    for (let i = 0; i < THING.length; i++) {
      // this IF trap is to avoid the test results widget being locked open, and blocking the screen
      if (
        !THING[i].classList.contains("singlePopup") &&
        !THING[i].classList.contains("screenDocs")
      ) {
        THING[i].open = true;
      }
    }
  }
}

/**
 * screenWidth
 * compute the viewport width.
 *  PURE
 *
 * @param {Location = location} loc
 * @param {Window = window} win
 * @public
 * @returns {number}
 */
function screenWidth(loc: Location, win: Window): number {
  const u: URLSearchParams = new URLSearchParams(loc.search);
  if (u.has("width")) {
    return parseInt(u.get("width"), 10);
  }
  return win.innerWidth;
}

/**
 * isMobile
 * Statically workout if this JS interpreter is a mobile
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {boolean} ~ is this Mobile?
 */
export function isMobile(dom: Document, loc: Location, win: Window): boolean {
  const u = new URLSearchParams(loc.search);
  try {
    const tt = dom.createEvent("TouchEvent");
    // if JSDom, can always make event,
    // but if we always pass what we want to say, that is fine
    if (u.has("mobile")) {
      return booleanMap(u.get("mobile"));
    }

    if (calcScreenDPI(dom, win) > MOBILE_MIN_PPI) {
      return true;
    } else {
      // laptops with a touch screen should be here
      return false;
    }
  } catch (e) {
    if (u.has("mobile") && booleanMap(u.get("mobile"))) {
      return true;
    }
    return false;
  }
}

/**
 * calcScreenDPI
 * as labeled
 * @param {Document =document} dom
 * @param {Window =window} win
 * @protected
 * @returns {number}
 */
function calcScreenDPI(dom: Document, win: Window): number {
  try {
    const el = dom.createElement("div");
    el.setAttribute("style", "width:1in;");
    dom.body.appendChild(el);

    // Get it's (DOM-relative) pixel width, multiplied by the device pixel ratio
    const dpi = el.offsetWidth * win.devicePixelRatio;
    el.remove();
    return dpi;
  } catch (e) {
    log("error", "ERROR " + e.toString());
    return -1;
  }
}

//////////////////////////////////////////////// testing /////////////////////////////////////////////////////////////
// no injectOpts as it wouldn't make sense

/**
 * currentSize
 * Supplied for testing, convert a window to a size
 
 * @param {Document = document} dom 
 * @param {Window =window} win 
 * @public
 * @returns {ScreenSizeArray}
 */
export function currentSize(dom: Document, win: Window): ScreenSizeArray {
  const root = dom.documentElement,
    body = dom.body;
  const wid = win.innerWidth || root.clientWidth || body.clientWidth;
  const hi = win.innerHeight || root.clientHeight || body.clientHeight;
  let wid2: number = 0;
  let hi2: number = 0;
  if (typeof hi === "string") {
    hi2 = parseInt(hi, 10);
  } else {
    hi2 = hi;
  }
  if (typeof wid === "string") {
    wid2 = parseInt(wid, 10);
  } else {
    wid2 = wid;
  }
  return [wid2, hi2];
}

export const TEST_ONLY = {
  appendIsland,
  getArticleWidth,
  expandDetails,
  docOffsets,
  copyURL,
  applyVolume,
  mapAttribute,
  setIsland,
  isFullstack,
  isMobile,
  calcScreenDPI,
  currentSize,
};
