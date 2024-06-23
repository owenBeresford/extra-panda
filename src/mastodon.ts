/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import {
  Document,
  Location,
  Window,
  Event,
  HTMLElement,
} from "jsdom";

import { register, access } from "./code-collection";
import {
  MiscEventHandler2,
  MiscEventHandler3,
  TEST_MACHINE,
} from "./all-types";
import { isFullstack, isMobile } from "./dom-base";

register("shareMastodon", shareMastodon);
register("copyURL", copyURL);
const ROOT = access();

/**
 * openShare
 * Display/ hide the mobile share bar (both directions)
 *
 * @param {Event} e - unused at present
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {false}
 */
function openShare(
  e: Event,
  dom: Document = document,
  loc: Location = location,
): boolean {
  if (loc.host !== TEST_MACHINE && !isMobile(dom, loc)) return false;

  const t = dom.querySelector("#shareMenu");
  if (t && !t.classList.replace("shareMenuOpen", "shareMenu")) {
    t.classList.replace("shareMenu", "shareMenuOpen");
  }
  return false;
}

/**
 * shareMastodon
 * Effect the share to your chosen Masto server
 *
 * @param {Event} e - unused at present
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @return {boolean}
 */
function shareMastodon(
  e: Event,
  dom: Document = document,
  loc: Location = location,
  win: Window = window,
): boolean {
  const tmp = dom.querySelector("#mastodonserver");
  let server = tmp.value;
  const url = tmp.getAttribute("data-url");
  if (server === "" || server === null) {
    return false;
  }

  server = "https://" + server + "/share?text=I+think+this+is+important+" + url;
  ROOT.log("info", "Trying to open mastodon server, " + server);
  if (isFullstack()) {
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
  openShare(e, dom, loc);
  return false;
}

/**
 * accessVisibility
 * Util function to isolate access to styles
 *
 * @param {HTMLElement} buf
 * @param {string ='display'} what
 * @param {Window =window} win
 * @public
 * @return {void}
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
 *
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @return {void}
 */
export function initMastodon(
  dom: Document = document,
  loc: Location = location,
  win: Window = window,
): void {
  let BUFFER: HTMLElement = dom.querySelector("#shareMenu #mastoTrigger");
  _map1(BUFFER, openMastodon, dom);

  BUFFER = dom.querySelector("#shareGroup .allButtons #mastoTrigger");
  const canSee: string = accessVisibility(BUFFER, "display", win);
  if (canSee && canSee !== "none") {
    BUFFER.addEventListener("click", (e: Event): boolean => {
      return openMastodon(e, dom);
    });
    BUFFER.addEventListener("keypress", (e: Event): boolean => {
      return openMastodon(e, dom);
    });
  }
  _map1(dom.querySelector("#copyURL"), copyURL, loc);
  _map3(dom.querySelector("#popup #sendMasto"), shareMastodon, dom, loc, win);
  const BUFFER2 = Array.from(
    dom.querySelectorAll("#shareMenuTrigger, #shareClose"),
  );
  for (const i in BUFFER2) {
    _map2(BUFFER2[i], openShare, dom, loc);
  }
  _map1(dom.querySelector("#hideMasto"), closeMastodon, dom);
}

/**
 * openMastodon
 * Show extra UI for selecting a Mastodon server
 * Covert a click event to a DOM change
 *
 * @param {Event} e - unused at present
 * @param {Document =document} dom
 * @public
 * @return {false}
 */
function openMastodon(e: Event, dom: Document = document): boolean {
  if (isFullstack()) {
    // in JSDOM can't use extra functions, as the fake isn't deep enough
    (dom.querySelector("#popup") as HTMLDialogElement).showModal();
  }
  dom.querySelector("#popup input").focus();
  return false;
}

/**
 * closeMastodon
 * Hide extra UI for selecting a Mastodon server
 *
 * @param {Event } e - unused at present
 * @param {Document =document} dom
 * @public
 * @return {false}
 */
function closeMastodon(e: Event, dom: Document = document): boolean {
  if (isFullstack()) {
    // in JSDOM can't use extra functions, as the fake isn't deep enough
    dom.querySelector("#popup").close();
  }
  return false;
}

/**
 * copyURL
 * Copy the current URL into the paste buffer, for use in mobile view
 *
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @return {void}
 */
function copyURL(loc: Location = location, win: Window = window): void {
  try {
    if (!win.navigator.clipboard) {
      throw new Error("No clipboard available");
    }
    win.navigator.clipboard.writeText(loc.url).then(
      () => {
        // add class for CSS effect
        return;
      },
      (err: Error) => {
        ROOT.log("error", "FAILED: copy URL " + err);
      },
    );
  } catch (e0: Error) {
    ROOT.log(
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
 *
 * @param {HTMLElement} where
 * @param {MiscEventHandler } action
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function _map1(
  where: HTMLElement,
  action: MiscEventHandler2,
  dom: Document | Location = document,
): void {
  where.addEventListener("click", (a: Event): boolean => {
    return action(a, dom);
  });
  where.addEventListener("touch", (a: Event): boolean => {
    return action(a, dom);
  });
  where.addEventListener("keypress", (a: Event): boolean => {
    return action(a, dom);
  });
}

/**
 * _map2
 * Add several event listeners, just a utility
 *
 * @param {HTMLElement} where
 * @param {MiscEventHandler } action
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {void}
 */
function _map2(
  where: HTMLElement,
  action: MiscEventHandler3,
  dom: Document,
  loc: Location = location,
): void {
  where.addEventListener("click", (a: Event): boolean => {
    return action(a, dom, loc);
  });
  where.addEventListener("touch", (a: Event): boolean => {
    return action(a, dom, loc);
  });
  where.addEventListener("keypress", (a: Event): boolean => {
    return action(a, dom, loc);
  });
}

/**
 * _map3
 * Add several event listeners, just a utility
 *
 * @param {HTMLElement} where
 * @param {MiscEventHandler } action
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @return {void}
 */
function _map3(
  where: HTMLElement,
  action: MiscEventHandler3,
  dom: Document,
  loc: Location | null = location,
  win: Window = window,
): void {
  where.addEventListener("click", (a: Event): boolean => {
    return action(a, dom, win);
  });
  where.addEventListener("touch", (a: Event): boolean => {
    return action(a, dom, win);
  });
  where.addEventListener("keypress", (a: Event): boolean => {
    return action(a, dom, win);
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
