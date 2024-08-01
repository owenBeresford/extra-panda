/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import { MiscEvent } from "./all-types";

/**
 * HTMLDetailsTrap
 * If ESC key happens, close any open DETAILS elements
 * @param {MiscEvent} e
 * @param {Document = document} dom
 * @protected
 * @returns {boolean} - keypress event, so return false
 */
function HTMLDetailsTrap(e: MiscEvent, dom: Document = document): boolean {
  if (e.code === "Escape" || e.key === "Escape") {
    const tt = dom.querySelectorAll("details[open]");
    if (tt.length) {
      tt[0].open = false;
    }
  }
  e.preventDefault();
  return false;
}

/**
 * HTMLDetailsClick
 * If there is a click, walk up the DOM until the details is found
 * @param {MiscEvent} e
 * @param {Document = document} dom
 * @protected
 * @returns {boolean} - mouse event, so return false
 */
function HTMLDetailsClick(e: MiscEvent, dom: Document = document): boolean {
  const find = function (
    ele: HTMLElement,
    target: string,
  ): undefined | HTMLElement {
    if (ele.tagName === target) {
      return ele;
    }

    while (ele.tagName !== target) {
      // extra clause to allow links to exit this page
      if (ele.tagName === "A") {
        return ele;
      }
      if (ele.tagName === "BODY") {
        return undefined;
      }

      ele = ele.parentElement;
    }
    return ele;
  };

  const act = find(e.target, "DETAILS");
  if (act && act.tagName === "A") {
    return true;
  }
  if (act) {
    const act2: HTMLDetailsElement = act as HTMLDetailsElement;
    if (act2 && act2.open) {
      act2.open = false;
    } else {
      act2.open = true;
    }
  } else {
    const tt = dom.querySelector("details[open]");
    if (tt) {
      tt.open = false;
    }
  }

  e.preventDefault();
  return false;
}

/**
 * modalInit
 * Add other event handlers
 * @param {Document = document} dom
 * @public
 * @returns {void}
 */
export function modalInit(dom: Document = document): void {
  const tmp: Array<HTMLDetailsElement> = Array.from(
    dom.querySelectorAll(".popOverWidget details"),
  );
  if (tmp.length) {
    tmp.forEach(function (a: HTMLDetailsElement): void {
      a.addEventListener("keydown", HTMLDetailsTrap);
      a.addEventListener("click", HTMLDetailsClick);
    });
  }
  // IOIO see if something can be done for mobile interactions
  // add a listener to the custom back button would be good
}

//////////////////////////////////////////// testing ////////////////////////////////////
// no OPTS  or injectOpts needed for this module, its just static event listeners

export const TEST_ONLY = { modalInit, HTMLDetailsClick, HTMLDetailsTrap };
