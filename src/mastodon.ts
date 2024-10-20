/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { Document, Location, Window, Event, HTMLElement } from "jsdom";

import {
  MiscEventHandler2,
  MiscEventHandler3,
  MiscEventHandler4,
} from "./all-types";
import { isFullstack, isMobile } from "./dom-base";
import { isLocal } from "./string-base";
import { log } from "./networking";

/**
 * openShare
 * Display/ hide the mobile share bar (both directions)
 *
 * @param {Event} e - unused at present
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {false}
 */
function openShare(
  e: Event,
  dom: Document,
  loc: Location,
  win: Window,
): boolean {
  if (!isLocal(loc.host) && !isMobile(dom, loc, win)) return false;

  const t = dom.querySelector("#shareMenu");
  if (t && !t.classList.replace("shareMenuOpen", "shareMenu")) {
    t.classList.replace("shareMenu", "shareMenuOpen");
  }
  return false;
}

/**
 * shareMastodon
 * Effect the share to your chosen Masto server
 * @param {Event} e - unused at present
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {boolean}
 */
function shareMastodon(
  e: Event,
  dom: Document,
  loc: Location,
  win: Window,
): boolean {
  const tmp = dom.querySelector("#mastodonserver");
  let server = tmp.value;
  const url = tmp.getAttribute("data-url");
  if (server === "" || server === null) {
    return false;
  }

  server = "https://" + server + "/share?text=I+think+this+is+important+" + url;
  log("info", "Trying to open mastodon server, " + server);
  if (isFullstack(win)) {
    // in JSDOM can't use extra functions, as the fake isn't deep enough
    (dom.querySelector("#popup") as HTMLDialogElement).close();
    win.open(server, "_blank");
  } else {
    // you think this is stupid?  It //is// an information passback process
    // JSDom **doesn't throw** Errors for "Not implemented" it just **tells** you its an exception,
    //                                       ...on a virtual console, so I can't snoop it
    // fake exceptions from a fake browser #leSigh
    throw Error("Test passed, for " + server);
  }
  if (isMobile(dom, loc, win)) {
    openShare(e, dom, loc, win);
  }
  return false;
}

/**
 * accessVisibility
 * A Utility to isolate access to styles
 * @param {HTMLElement} buf
 * @param {string ='display'} what
 * @param {Window =window} win
 * @public
 * @returns {void}
 */
function accessVisibility(
  buf: HTMLElement,
  what: string = "display",
  win: Window = window,
): string {
  let canSee = "";
  if (buf && buf.computedStyleMap) {
    canSee = buf.computedStyleMap()[what];
  } else if (buf) {
    // FF support
    const tt = win.getComputedStyle(buf, null);
    canSee = tt.getPropertyValue(what);
  }
  return canSee;
}

/**
 * initMastodon
 * Register the event handlers for a mastodon sharing
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {void}
 */
export function initMastodon(dom: Document, loc: Location, win: Window): void {
  let BUFFER: HTMLElement = dom.querySelector("#shareMenu #mastoTrigger");
  if (BUFFER) {
    _map2(BUFFER, openMastodon, dom, win);
  }
  BUFFER = dom.querySelector("#shareGroup .allButtons #mastoTrigger");
  const canSee: string = accessVisibility(BUFFER, "display", win);
  if (canSee && canSee !== "none") {
    BUFFER.addEventListener("click", (e: Event): boolean => {
      return openMastodon(e, dom, win);
    });
    BUFFER.addEventListener("keypress", (e: Event): boolean => {
      return openMastodon(e, dom, win);
    });
  }
  BUFFER = dom.querySelector("#copyURL");
  if (BUFFER) {
    _map1(BUFFER, copyURL, loc);
  }
  _map3(dom.querySelector("#popup #sendMasto"), shareMastodon, dom, loc, win);
  const BUFFER2 = Array.from(
    dom.querySelectorAll("#shareMenuTrigger, #shareClose"),
  ); // the second ID will be nought in desktop view
  for (const i in BUFFER2) {
    _map3(BUFFER2[i], openShare, dom, loc, win);
  }
  _map2(dom.querySelector("#hideMasto"), closeMastodon, dom, win);
}

/**
 * openMastodon
 * Show extra UI for selecting a Mastodon server
 * Covert a click event to a DOM change
 * @param {Event} e - unused at present
 * @param {Document =document} dom
 * @param {Window =window } win
 * @public
 * @returns {false}
 */
function openMastodon(e: Event, dom: Document, win: Window): boolean {
  if (isFullstack(win)) {
    // in JSDOM can't use extra functions, as the fake isn't deep enough
    (dom.querySelector("#popup") as HTMLDialogElement).showModal();
  }
  dom.querySelector("#popup input").focus();
  return false;
}

/**
 * closeMastodon
 * Hide extra UI for selecting a Mastodon server
 * @param {Event } e - unused at present
 * @param {Document =document} dom
 * @param {Window =window } win
 * @public
 * @returns {false}
 */
function closeMastodon(e: Event, dom: Document, win: Window): boolean {
  if (isFullstack(win)) {
    // in JSDOM can't use extra functions, as the fake isn't deep enough
    dom.querySelector("#popup").close();
  }
  return false;
}

/**
 * copyURL
 * Copy the current URL into the paste buffer, for use in mobile view
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {void}
 */
function copyURL(loc: Location, win: Window): void {
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
 * _map1
 * Add several event listeners, just a utility
 * @param {HTMLElement} where
 * @param {MiscEventHandler } action
 * @param {Document|Location =document} dom
 * @public
 * @returns {void}
 */
function _map1(
  where: HTMLElement,
  action: MiscEventHandler2,
  dom: Document | Location,
): void {
  where.addEventListener("click", (a: Event): boolean => {
    action(a, dom);
    return false;
  });
  where.addEventListener("touch", (a: Event): boolean => {
    action(a, dom);
    return false;
  });
  where.addEventListener("keypress", (a: Event): boolean => {
    action(a, dom);
    return false;
  });
}

/**
 * _map2
 * Add several event listeners, just a utility
 * @param {HTMLElement} where
 * @param {MiscEventHandler } action
 * @param {Document =document} dom
 * @param {Location|Window =location} loc
 * @public
 * @returns {void}
 */
function _map2(
  where: HTMLElement,
  action: MiscEventHandler3,
  dom: Document,
  loc: Location | Window,
): void {
  where.addEventListener("click", (a: Event): boolean => {
    action(a, dom, loc);
    return false;
  });
  where.addEventListener("touch", (a: Event): boolean => {
    action(a, dom, loc);
    return false;
  });
  where.addEventListener("keypress", (a: Event): boolean => {
    action(a, dom, loc);
    return false;
  });
}

/**
 * _map3
 * Add several event listeners, just a utility
 * @param {HTMLElement} where
 * @param {MiscEventHandler } action
 * @param {Document =document} dom
 * @param {Location|null =location} loc
 * @param {Window =window} win
 * @public
 * @returns {void}
 */
function _map3(
  where: HTMLElement,
  action: MiscEventHandler4,
  dom: Document,
  loc: Location | null,
  win: Window,
): void {
  where.addEventListener("click", (a: Event): boolean => {
    action(a, dom, loc, win);
    return false;
  });
  where.addEventListener("touch", (a: Event): boolean => {
    action(a, dom, loc, win);
    return false;
  });
  where.addEventListener("keypress", (a: Event): boolean => {
    action(a, dom, loc, win);
    return false;
  });
}

///////////////////////////////////////////// TESTING ///////////////////////////////////////////////////////
// no injectOpts at present

/**
 * Only use for testing, it allows access to the entire API
 */
export const TEST_ONLY = {
  shareMastodon,
  _map1,
  _map2,
  _map3,
  closeMastodon,
  openMastodon,
  initMastodon,
  copyURL,
  accessVisibility,
  openShare,
};
