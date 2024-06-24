/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import { ScreenSizeArray } from "./all-types";
import {log, debug, MOBILE_MIN_PPI} from './code-collection';
 
/**
 * appendIsland
 * An important util function, which removes need to jQuery, ShadowDOM AND other innerHTML hacks.
 * I have a historic avoidance of passing DOM object around the stack as it caused bad memory leaks.
 *    IMPURE
 *
 * @param {string|HTMLElement} selector ~ where to appends the new content
 * @param {string} html ~ what to append
 * @param {Document =document} dom ~ reference to which DOM tree
 * @throws some sort of HTML error, if the supplied HTML is malformed.  Browser dependant
 * @protected
 * @return {undefined}
 */
export function appendIsland(
  selector: string | HTMLElement,
  html: string,
  dom: Document = document,
): void {
  try {
    if (dom === null) {
      throw new Error("Oh no! No DOM object");
    }

    const base: HTMLTemplateElement = dom.createElement("template");
    base.innerHTML = html;
    if (typeof selector === "string") {
      const tt: HTMLElement = dom.querySelector(selector) as HTMLElement;
      if (tt === null) {
        throw new Error("Oh no ! " + selector);
      }
      tt.append(base.content);
    } else {
      return selector.append(base.content);
    }
  } catch (e) {
    log("error", e.toString());
  }
}

/**
 * setIsland
 * Replace the whole of the subtree with the param
 * I have a historic avoidance of passing DOM object around the stack as it caused bad memory leaks.
 *    IMPURE
 *
 * @param {string|HTMLElement} selector
 * @param {string} html
 * @param {Document =document} dom
 * @throws some sort of HTML error, if the supplied HTML is malformed.  Browser dependant
 * @public
 * @return {void}
 */
export function setIsland(
  selector: string | HTMLElement,
  html: string,
  dom: Document = document,
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
 * Look at function implementations to see if this is a browser
 
 * @public
 * @return {boolean}
 */
export function isFullstack(): boolean {
  let isNativeWindow;
  if (typeof _window == "object") {
    isNativeWindow = Object.getOwnPropertyDescriptor(_window, "window")
      ?.get?.toString()
      .includes("[native code]");
  } else {
    isNativeWindow = Object.getOwnPropertyDescriptor(window, "window")
      ?.get?.toString()
      .includes("[native code]");
  }
  if (typeof isNativeWindow === "boolean" && isNativeWindow) {
    return true;
  }
  return false;
}

// NOTE: js, may not be a string
function booleanMap(str: string | number): boolean {
  switch (str) {
    case "1":
    case 1:
    case "true":
    case "TRUE":
    case "on":
    case "ON":
    case "yes":
    case "YES":
      return true;
      break;

    case "0":
    case 0:
    case "false":
    case "FALSE":
    case "off":
    case "OFF":
    case "no":
    case "NO":
      return false;
      break;

    default:
      throw new Error("Unknown data " + str);
  }
}

/**
 * isMobile
 * Statically workout if this is mobile
 *
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @return {bool} ~ is this Mobile?
 */
export function isMobile(
  dom: Document = document,
  loc: Location = location,
  win: Window = window,
): boolean {
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
 * @public
 * @return {number}
 */
function calcScreenDPI(dom: Document = document, win: Window = window): number {
  try {
    const el = dom.createElement("div");
    el.setAttribute("style", "width:1in;");
    dom.body.appendChild(el);

    // Get it's (DOM-relative) pixel width, multiplied by the device pixel ratio
    const dpi = el.offsetWidth * win.devicePixelRatio;
    el.remove();
    return dpi;
  } catch (e) {
    console.error("ERROR " + e);
    return -1;
  }
}

/**
 * currentSize
 * Utility function to report the tab size...
 * I use this in debugging RWD PURE

 * @param {Document =document} dom
 * @public
 * @return {ScreenSizeArray}
 */
export function currentSize(dom: Document = document): ScreenSizeArray {
  const root = dom.documentElement,
    body = dom.body;
  const wid = window.innerWidth || root.clientWidth || body.clientWidth;
  const hi = window.innerHeight || root.clientHeight || body.clientHeight;
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

//////////////////////////////////////////////// testing /////////////////////////////////////////////////////////////
// no injectOpts as it wouldnt make sense

export const TEST_ONLY = {
  appendIsland,
  setIsland,
  isFullstack,
  isMobile,
  calcScreenDPI,
  currentSize,
};
