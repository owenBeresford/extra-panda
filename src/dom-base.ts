/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import type {
  ScreenSizeArray,
  GenericEventHandler,
  Scrollable,
  ScreenOffsetArray,
  BOUNDARY,
} from "./all-types";
import { log } from "./log-services";
import { MOBILE_MIN_PPI, EM_SZ, ALL_REFERENCE } from "./immutables";
import { booleanMap } from "./string-base";

if (typeof window === "object" && !("noop" in window)) {
  window.noop = 0 as number;
}
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
    window.noop++;
  }
}

/**
 * ready
 * Triggers Page start-event  Very IMPURE
 *
 * @param {GenericEventHandler} callback
 * @param {Document =document} dom
 * @see [stack overflow answer https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery]
 * @throws In case of an unknown JS interpreter that supports an unknown pageReady event
 * @public
 * @returns {void}
 */
export function ready(callback: GenericEventHandler, dom: Document): void {
  console.assert(
    typeof dom !== "undefined",
    "Startup ready() needs two param, document in the second",
  );
  if (dom.readyState !== "loading") {
    const e = dom.createEvent("htmlevents");
    callback(e);
    return;
  } else if (dom.addEventListener) {
    dom.addEventListener("DOMContentLoaded", callback);
    return;
  }
  throw new Error("Unknown JS interpreter, can't register code");
}

/**
 * duplicateSelection
 * Copy the text of the highlighted DOM nodes
 *
 * NOTEST: this function cannot be unit tested, as the following code may not read a selection made by JS
 *         unit-test is running inside a browser, so its not a limitation of JSDOM.
 * Function can be manually tested, #leSigh
 * @see [A walkthru for this code https://scribe.rip/@alexandrawilll/window-getselection-and-range-in-javascript-5a13453d22]
 * @param {Window} win
 * @public
 * @returns {string}
 */
export function duplicateSelection(win: Window): string {
  try {
    const tmp1 = win.getSelection();
    if (tmp1 === null || tmp1.rangeCount === 0) {
      log("warn", "no selection object found ");
      return "";
    }
    const tmp2 = tmp1.getRangeAt(0);
    if (tmp2.startOffset === tmp2.endOffset) {
      log("warn", "no selection volume found ");
      return "";
    }

    return "" + tmp2.cloneContents().textContent;
  } catch (e) {
    log("warn", "Unable to get data for selection", e.message);
    return "";
  }
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
    const tt: HTMLElement = dom.querySelector(selector) as HTMLElement;
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
 * This is mostly used for tests.   PURE
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
 * isLibreWolf
 * Annoying but necessary hack to detect if this is running in LibreWolf
 * LibreWolf reports the DPI resolution is twice what the OS thinks it is
 * Bug not found in recent editions of FF.
 * For a single hardware, run the attached link in FF, Chrome and Librewolf to see issue outside of my code
 *  NOT PURE, and I have no non-manual way to show this works. 
 * WARNING: THIS IS EXPECTED TO NEED TO CHANGE ON LATER VERSIONS OF LIBREWOLF, #leSIGH

 * @see [https://www.infobyip.com/detectmonitordpi.php]
 * @param {Document} dom
 * @param {Navigator} nav
 * @param {Window} win
 * @public
 * @returns {boolean}
 */
export function isLibreWolf(
  dom: Document,
  nav: Navigator,
  win: Window,
): boolean {
  // eslint-disable-next-line no-var
  var canTouch = false;
  try {
    dom.createEvent("TouchEvent");
    canTouch = true;
  } catch (e) {
    win.noop++;
  }

  if (nav && nav.product === "Gecko" && nav.maxTouchPoints > 0 && !canTouch) {
    console.warn("Is this librewolf?, could tell me if this is wrong.");
    if (!dom.body.classList.contains("IAmLibreWolf")) {
      dom.body.classList.add("IAmLibreWolf");
      const tmp: HTMLElement = dom.querySelector(
        '.fullWidth p[role="status"]',
      ) as HTMLElement;
      if (tmp) {
        tmp.innerHTML +=
          " &nbsp; Is this librewolf?  Could you tell me if this is wrong.";
      }
    }
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
    log("error", "Missing data:" + e.message);
    return -1;
  }
}

/**
 * getArticleWidth
 * A utility to get current article width  PURE
 
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
  const tmp: HTMLElement = dom.querySelector(id) as HTMLElement;
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
 * @param {Document =document} ignored
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {void}
 */
export async function copyURL(
  ignored: Document,
  loc: Location,
  win: Window,
): Promise<void> {
  try {
    if (!win.navigator.clipboard) {
      throw new Error("No clipboard available");
    }
    await win.navigator.clipboard.writeText(loc.href);
  } catch (e0: unknown) {
    const e1 = e0 as Error;
    log(
      "error",
      "FAILED: copy URL feature borked " +
        e1.message +
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
  (dom.querySelector("body") as HTMLBodyElement).setAttribute(
    "style",
    "--offset-height: 0;",
  );
  const tt: Array<HTMLElement> = Array.from(
    dom.querySelectorAll(".lotsOfWords, .halferWords, .fewWords"),
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
    ) as Array<HTMLDetailsElement>;
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
    return parseInt(u.get("width") ?? "", 10);
  }
  return win.innerWidth;
}

/**
 * isMobile
 * Statically workout if this JS interpreter is a mobile
 * IMPURE
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
      return booleanMap(u.get("mobile") ?? "");
    }

    let PROBABLY_MOB = MOBILE_MIN_PPI;
    // leSigh.
    if (isLibreWolf(dom, win.navigator, win)) {
      PROBABLY_MOB = MOBILE_MIN_PPI * 1.11;
    }
    if (calcScreenDPI(dom, win) > PROBABLY_MOB) {
      return true;
    } else {
      // laptops with a touch screen should be here
      return false;
    }
  } catch (e) {
    if (u.has("mobile") && booleanMap(u.get("mobile") ?? "")) {
      return true;
    }
    return false;
  }
}

/**
 * calcScreenDPI
 * as labeled, PURE
 * @param {Document =document} dom
 * @param {Window =window} win
 * @protected
 * @returns {number}
 */
export function calcScreenDPI(dom: Document, win: Window): number {
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

/**
 * appendCSSFile
 * A wrapper to inject a CSS LINK element
 * ie   <link rel="stylesheet" href="/asset/ob1.min.css">
 
 * @param {string} fn 
 * @param {Document} dom
 * @public
 * @returns {void}
 */
export function appendCSSFile(fn: string, dom: Document): void {
  let nu = dom.createElement("link");
  nu.setAttribute("rel", "stylesheet");
  nu.setAttribute("href", fn);
  dom.head.appendChild(nu);
}

//////////////////////////////////////////////// testing /////////////////////////////////////////////////////////////
// no injectOpts as it wouldn't make sense

/**
 * currentSize
 * Supplied for testing, convert a window to a size PURE
 
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
  duplicateSelection,
  copyURL,
  applyVolume,
  mapAttribute,
  setIsland,
  isLibreWolf,
  screenWidth,
  isFullstack,
  isMobile,
  ready,
  calcScreenDPI,
  currentSize,
  appendCSSFile,
};
