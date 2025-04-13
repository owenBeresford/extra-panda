import { log } from "./log-services";
import type { MultiFuncArg, MiscEvent } from "./all-types";

let OPTS = {};
/**
 * _map
 * Add several event listeners, just a utility
 *
 * @param {HTMLElement} where
 * @param { (id: string | MiscEvent) =>void} action
 * @protected
 * @returns {void}
 */
function _map(where: HTMLElement, action: MultiFuncArg): void {
  where.addEventListener("click", action);
  where.addEventListener("touch", action);
  where.addEventListener("keypress", action);
}

/**
 * hasTabs
 * Unused function to report if tabs ~ the event handlers ~ should be enabled
 
 * @param {Document} dom
 * @public
 * @returns {boolean}
 */
function hasTabs(dom: Document): boolean {
  const tabs = dom.querySelectorAll(".tabComponent");
  return tabs.length > 0;
}

/**
 * newInitState
 * this is tabInit v4
 * Force a tab name in the location.hash to be honored.
 
 * @param {Document} dom
 * @param {Location} loc
 * @public
 * @returns {void}
 */
export function newInitState(dom: Document, loc: Location): void {
  if (!loc.hash) {
    return;
  }

  const JUMP: HTMLInputElement = dom.querySelector(
    loc.hash,
  ) as HTMLInputElement;
  if (JUMP && JUMP.tagName === "INPUT") {
    JUMP.checked = true;
  } else {
    log("error", "tabInit v4: failed to find " + loc.hash + " element");
  }
}

/**
 * tabInit
 * Assign the tab event handler.
 *
 * @deprecated - I moved this feature to HTML, but initNewState is still needed as CSS can't read URL params
 * @param {Document} dom
 * @param {Location} loc
 * @public
 * @returns {void}
 */
export function initTabs(dom: Document, loc: Location): void {
  const tabs = dom.querySelectorAll(".tabComponent");
  for (let i = 0; i < tabs.length; i++) {
    const btns: Array<HTMLElement> = Array.from(
      tabs[i].querySelectorAll(".tab-title a"),
    ) as Array<HTMLElement>;

    for (let j = 0; j < btns.length; j++) {
      _map(btns[j], (e) => {
        tabChange(e, dom);
      });
    }
  }

  if (loc.hash !== "") {
    tabChange(loc.hash, dom);
  }
}

/**
 * tabChange
 * Change which tab is visible
 * I don't think this needs exporting, aside from tests
 * @param {string|MiscEvent} id - HTML id for the menu
 * @param {Document } dom
 * @protected
 * @returns {void}
 */
function tabChange(id: string | MiscEvent, dom: Document): void {
  let click: HTMLAnchorElement | null = null;
  let target: string = "";

  if (typeof id === "string") {
    target = id;
    const thing = dom.querySelector(id) as HTMLElement;
    if (thing && thing.tagName === "SECTION") {
      click = dom.querySelector(
        '.tabList a[href="' + id + '"] ',
      ) as HTMLAnchorElement;
    } else {
      log("error", "what is this? ", thing.outerHTML, thing.tagName);
      throw new Error("Bad call");
    }
  } else {
    const tmp: HTMLElement = id.target as HTMLElement;
    click = dom.querySelector("#" + tmp.id) as HTMLAnchorElement;
    target = "" + click.getAttribute("href");
  }
  if (!target) {
    log(
      "ERROR",
      "Malconfigured tabs!! " + id + " => '" + target + "' matches nothing",
    );
    return;
  }

  const iter1: Array<HTMLLIElement> = Array.from(
    dom.querySelectorAll(".tab-title"),
  );
  for (let i = 0; i < iter1.length; i++) {
    iter1[i].classList.remove("is-active");
  }

  const iter2: Array<HTMLAnchorElement> = Array.from(
    dom.querySelectorAll(".tab-title>a"),
  );
  for (let i = 0; i < iter2.length; i++) {
    iter2[i].setAttribute("aria-hidden", "true");
  }

  const iter3: Array<HTMLLIElement> = Array.from(
    dom.querySelectorAll(".tabs-content .tabs-panel"),
  );
  for (let i = 0; i < iter3.length; i++) {
    iter3[i].classList.remove("is-active");
    iter3[i].setAttribute("aria-hidden", "true");
  }

  const [alive]: Array<HTMLElement> = Array.from(
    dom.querySelectorAll(".tabs-content " + target),
  );
  alive.classList.add("is-active");
  alive.setAttribute("aria-hidden", "false");

  const thing2: HTMLElement = click.parentNode as HTMLElement;
  thing2.classList.add("is-active");
  click.setAttribute("aria-hidden", "false");
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * injectOpts
 * PURELY FOR UNIT TESTS, adds ability to set initial state per internal function
 * READS process.env

 * @param {object} a - I could add a new interface where all the options were optional
 * @public
 * @returns {void}
 */
function injectOpts(a: object): void {
  if (process.env["NODE_ENV"] !== "development") {
    log("error", "To use injectOpts, you must set NODE_ENV");
    return;
  }
  OPTS = Object.assign(OPTS, a);
}

/**
 * Only use for testing, it allows access to the entire API
 */
export const TEST_ONLY = {
  injectOpts,
  tabChange,
  hasTabs,
  newInitState,
  initTabs,
};
