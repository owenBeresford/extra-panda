/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import { MiscEvent } from "./all-types";
import { log } from "./networking";

/**
 * HTMLDetailsTrap
 * If ESC key happens, close any open DETAILS elements
 *
 * @param {MiscEvent} e
 * @param {Document = document} dom
 * @protected
 * @returns {boolean} - keypress event, so return false
 */
function HTMLDetailsTrap(e: MiscEvent, dom: Document): boolean {
  if (e.code === "Escape" || e.key === "Escape") {
    const tt:Array<HTMLDetailsElement> = Array.from(dom.querySelectorAll("details[open]"));
    if (tt.length) {
      for (let i = 0; i < tt.length; i++) {
        tt[i].open = false;
      }
    }
    e.preventDefault();
    return false;
  }
  return true;
}

/**
 * find
 * A private util to find the nearest parent X element
 *    maybe TODO refactor so the break clauses are param
 *
 * @param {HTMLElement} ele - the starting point in the crawl
 * @param {string} target - looking for this tagName
 * @public
 * @returns {undefined | HTMLElement}
 */
function find(ele: HTMLElement, target: string): undefined | HTMLElement {
  // listing recursion exit state here,
  //     might not be needed?
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
    // #leSigh these two features shouldn't collide but they are.
    if (ele.classList.contains("maquette")) {
      return undefined;
    }

    ele = ele.parentElement;
  }
  return ele;
}

/**
 * HTMLDetailsClick
 * If there is a click, walk up the DOM until the details is found
 *
 * @param {MiscEvent} e
 * @param {Document = document} dom
 * @protected
 * @returns {boolean} - mouse event, so return false
 */
function HTMLDetailsClick(e: MiscEvent, dom: Document): boolean {
  const act = find(e.target, "DETAILS");
  if (act && act.tagName === "A") {
    // no preventDefault activity as its an A
    return true;
  }

  if (act) {
    const act2: HTMLDetailsElement = act as HTMLDetailsElement;

    e.preventDefault();
    e.stopPropagation();
    if (act2 && act2.open) {
      if (
        e.target.tagName !== "SUMMARY" &&
        // looking for CODE blocks, as users will need to select code to copy it
        // ...until a copy widget is added...
        act2.querySelector("code") !== null
      ) {
        return false;
      }

      act2.open = false;
    } else {
      act2.open = true;
    }
  } else {
    const tt:HTMLDetailsElement = dom.querySelector("details[open]") as HTMLDetailsElement;
    if (tt) {
      e.preventDefault();
      e.stopPropagation();
      tt.open = false;
    } else {
      // this click has nothing todo with DETAILS
      return true;
    }
  }

  return false;
}

/**
 * modalInit
 * Add other event handlers
 * @param {Document = document} dom
 * @public
 * @returns {void}
 */
export function modalInit(dom: Document): void {
  const tmp: Array<HTMLDetailsElement> = Array.from(
    dom.querySelectorAll(".popOverWidget details"),
  );
  if (tmp.length) {
    log("info", "Modal widget found, extra UI features added");
    tmp.forEach(function (a: HTMLDetailsElement): void {
      a.addEventListener("click", function (e: MiscEvent) {
        return HTMLDetailsClick(e, dom);
      });
    });
    dom.body.addEventListener("click", function (e: MiscEvent) {
      return HTMLDetailsClick(e, dom);
    });

    dom.body.addEventListener("keydown", function (e: MiscEvent) {
      return HTMLDetailsTrap(e, dom);
    });
  }
  // IOIO see if something can be done for mobile interactions
  // add a listener to the custom back button would be good
}

//////////////////////////////////////////// testing ////////////////////////////////////
// no OPTS  or injectOpts needed for this module, its just static event listeners

export const TEST_ONLY = { modalInit, HTMLDetailsClick, HTMLDetailsTrap };
