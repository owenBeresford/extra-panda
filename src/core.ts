/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { Location, Document, HTMLElement } from "jsdom";

import { CoreProps, MiscEvent, Cookieable, MultiFuncArg  } from "./all-types";
import {
  log,
  debug,
  APPEARANCE_COOKIE,
  _getCookie,
  runFetch,
} from "./networking";
import {
  listContentGroup,
  extractGroup,
  createAdjacentChart,
} from "./adjacent";
import { initMastodon } from "./mastodon";
import { isLocal } from "./string-base";
import { isMobile, appendIsland } from "./dom-base";
import { createBiblio as mobileCreateBiblio } from "./mobile-biblio";
import { createBiblio as desktopCreateBiblio } from "./desktop-biblio";
import {
  addOctoCats,
  addBooks,
  addFancyButtonArrow,
  addBashSamples,
} from "./effect";
import { readingDuration } from "./reading";
import { modalInit } from "./modal";

// variables across this module
// * @protected
let OPTS: CoreProps = {
  pageInitRun: 0,
} as CoreProps;

// removed:
// CorrectionModule.prototype.columnise = function ()    << now CSS
// CorrectionModule.prototype.biblioExtract = function ()  << runs HEAD
// CorrectionModule.prototype.extractGET = function (val)  << UNUSED, became language API

/**
 * _map
 * Add several event listeners, just a utility
 *
 * @param {HTMLElement} where
 * @param { (id: string | MiscEvent, dom: Document ) =>void} action
 * @public
 * @returns {void}
 */
function _map(where: HTMLElement, action: MultiFuncArg): void {
  where.addEventListener("click", action);
  where.addEventListener("touch", action);
  where.addEventListener("keypress", action);
}

/**
 * initPopupMobile
 * Create the popup bar for mobile
 *
 * @param {Document =document} dom
 * @param {location =location} loc
 * @public
 * @returns {void}
 */
function initPopupMobile(
  dom: Document = document,
  loc: Location = location,
): void {
  if (!isLocal(loc.host) && !isMobile(dom, loc)) {
    return;
  }

  if (isMobile(dom, loc)) {
    dom.querySelector("#sendMasto").textContent = "Share article";
  }
  const html: Array<string> = [
    `<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>`,
  ];
  const bigScreenElements: Array<string> = [
    "shareMenuTrigger",
    "siteChartLink",
    "rssLink",
  ];
  const BUFFER: Array<HTMLAnchorElement> = Array.from(
    dom.querySelectorAll(".allButtons a"),
  );
  for (const i in BUFFER) {
    if (bigScreenElements.includes(BUFFER[i].id)) {
      continue;
    }

    const local: HTMLAnchorElement = BUFFER[i].cloneNode(
      true,
    ) as HTMLAnchorElement;
    local.classList.remove("bigScreenOnly");
    html.push("<li>");
    html.push(local.outerHTML); // I don't like this line
    html.push("</li>");
    if (BUFFER[i].getAttribute("id")) {
      // assert people using mobile view do not use desktop buttons
      BUFFER[i].setAttribute("id", "old" + BUFFER[i].getAttribute("id"));
    }
  }
  html.unshift(
    '<nav><div class="shareMenu" id="shareMenu"><menu id="mobileMenu">',
  );
  html.push("</menu></div></nav>");

  appendIsland("#navBar", html.join("\n"), dom);
}

/**
 * storeAppearance
 * Write supplied data to a cOOKIE
 *
 * @param {string} ft - font
 * @param {string} fs - font-size
 * @param {string} dir - direction, mostly unused
 * @param {string} clr - color scheme
 * @public
 * @returns {void}
 */
function storeAppearance(
  ft: string,
  fs: string,
  dir: string,
  clr: string,
): void {
  const COOKIE: Cookieable = _getCookie();
  const json: string = JSON.stringify({ ft: ft, fs: fs, dn: dir, cr: clr });
  COOKIE.set(APPEARANCE_COOKIE, json, 365.254);
}

/**
 * applyAppearance
 * Apply branding settings found in a COOKIE
 * @param {Document =document} dom
 * @public
 * @returns {void}
 */
function applyAppearance(dom: Document = document): void {
  const COOKIE: Cookieable = _getCookie();

  const dat: string = COOKIE.get(APPEARANCE_COOKIE);
  if (!dat) {
    return;
  }

  const dat2 = JSON.parse(dat);
  // IOIO FIXME add type-washing to cookie

  if (!(dat2["ft"] && dat2["fs"])) {
    return;
  }
  const CSS: string =
    "body, .annoyingBody { font-family: " +
    dat2["ft"] +
    "; font-size: " +
    dat2["fs"] +
    "; direction:" +
    dat2["dn"] +
    "; }";

  const STYLE = dom.createElement("style");
  STYLE.setAttribute("id", "client-set-css");
  STYLE.innerText = CSS;
  dom.getElementsByTagName("head")[0].append(STYLE);
}

/**
 * burgerMenu
 * Util to manage state in the burgermenu
 * @param {string =".burgerMenu"} id - HTML id for the menu
 * @param {Document =document} dom
 * @public
 * @returns {void}
 */
function burgerMenu(
  id: string = ".burgerMenu",
  dom: Document = document,
): void {
  const t: HTMLElement = dom.querySelector(id);
  const ico: HTMLElement = dom.querySelector("#pageMenu i");

  if (!t.getAttribute("data-state")) {
    t.classList.add("burgerMenuOpen");
    t.setAttribute("data-state", "1");
    ico.classList.remove("fa-ob1burger");
    ico.classList.add("fa-cancel");
  } else {
    t.classList.remove("burgerMenuOpen");
    t.setAttribute("data-state", "");
    ico.classList.add("fa-ob1burger");
    ico.classList.remove("fa-cancel");
  }
}

/**
 * tabChange
 * Change which tab is visible
 * IOIO REWRITE when tabs are replaced
 * @param {string} id - HTML id for the menu
 * @param {Document =document} dom
 * @public
 * @returns {void}
 */
function tabChange(id: string | MiscEvent, dom: Document = document): void {
  let thing: HTMLElement | null = null;
  let target: string = "";

  if (typeof id === "string") {
    target = id;
    thing = dom.querySelector(id) as HTMLElement;
  } else {
    const tmp: HTMLElement = id.target;
    thing = dom.querySelector("#" + tmp.id) as HTMLElement;
    target = "" + thing.getAttribute("href");
  }
  if (!thing) {
    log("ERROR", "Malconfigured tabs!! " + id + " matches nothing");
    return;
  }

  let iter1 = dom.querySelectorAll(".tab-title");
  for (let i = 0; i < iter1.length; i++) {
    iter1[i].classList.remove("is-active");
  }

  iter1 = dom.querySelectorAll(".tab-title>a");
  for (let i = 0; i < iter1.length; i++) {
    iter1[i].setAttribute("aria-hidden", "true");
  }

  const iter2 = dom.querySelectorAll(".tabs-content .tabs-panel");
  for (let i = 0; i < iter2.length; i++) {
    iter2[i].classList.remove("is-active");
    iter2[i].setAttribute("aria-hidden", "true");
  }

  const [alive] = dom.querySelectorAll(".tabs-content " + target);
  alive.classList.add("is-active");
  alive.setAttribute("aria-hidden", "false");
  thing.parentNode.classList.add("is-active");
  thing.setAttribute("aria-hidden", "false");
}

/**
 * siteCore
 * Applies all the functions in this file to the DOM
 * @param {CoreProps} opts - see docs, at top of file
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @returns {void}
 */
/*eslint complexity: ["error", 30]*/
export async function siteCore(
  opts: CoreProps,
  dom: Document = document,
  loc: Location = location,
  win: Window = window,
): void {
  OPTS = Object.assign(
    OPTS,
    {
      // none found
    },
    opts,
  );
  const ldebug = debug();

  if (OPTS.pageInitRun) {
    log("warn", "Extra panda should not be run more than once per page");
    return;
  }
  OPTS.pageInitRun = 1;

  const tt: Array<HTMLElement> = dom.querySelectorAll(".noJS");
  for (let i = 0; i < tt.length; i++) {
    tt[i].classList.remove("noJS");
  }

  const tmp: HTMLElement = dom.querySelector("#pageMenu");
  if (tmp) {
    _map(tmp, (e: Event): void => {
      return burgerMenu(".burgerMenu", dom);
    });
  } else {
    log("info", "This URL '" + loc.pathname + "' has no burger menu");
  }

  initPopupMobile(dom, loc);
  initMastodon(dom, loc, win);
  addOctoCats(dom);
  addBooks(dom);
  addFancyButtonArrow(dom);
  addBashSamples(dom);
  applyAppearance(dom);
  modalInit(dom);

  if (
    !isMobile(dom, loc) &&
    loc.pathname !== "/resource/home" &&
    dom.querySelectorAll(".reading").length < 2
  ) {
    readingDuration(
      {
        dataLocation: "#main",
        target: ".addReading",
        debug: ldebug,
        refresh: true,
      },
      dom,
    );
  }

  {
    const tabs = dom.querySelectorAll(".tabComponent");
    for (let i = 0; i < tabs.length; i++) {
      const btns = tabs[i].querySelectorAll(".tab-title a");
      for (let j = 0; j < btns.length; j++) {
        _map(btns[j], tabChange);
      }
    }
  }

  if (loc.pathname.match("group-")) {
    const tt = extractGroup(null, loc, dom);
    if (tt) {
      await createAdjacentChart(
        {
          group: tt,
          debug: ldebug,
          runFetch:
            "adjacentRunFetch" in OPTS ? OPTS.adjacentRunFetch : runFetch,
        },
        dom,
        loc,
      );
    }
  } else {
    if (isMobile(dom, loc)) {
      await mobileCreateBiblio(
        {
          debug: ldebug,
          renumber: 1,
          runFetch: "mobileRunFetch" in OPTS ? OPTS.mobileRunFetch : runFetch,
        },
        dom,
        loc,
      );
    } else {
      await desktopCreateBiblio(
        {
          debug: ldebug,
          runFetch: "desktopRunFetch" in OPTS ? OPTS.desktopRunFetch : runFetch,
          renumber: 1,
        },
        dom,
        loc,
      );
    }

    const grp: Array<string> = listContentGroup("div#contentGroup", dom);
    if (grp.length === 0) {
      log(
        "info",
        "This URL '" + loc.pathname + "' has no Adjacent groups defined.",
      );
    } else {
      for (let j = 0; j < grp.length; j++) {
        await createAdjacentChart(
          {
            group: grp[j],
            debug: ldebug,
            iteration: j,
            count: grp.length,
            runFetch:
              "adjacentRunFetch" in OPTS ? OPTS.adjacentRunFetch : runFetch,
          },
          dom,
          loc,
        );
      }
    }
  }

  // There may be a pageStartup() in 20-30% of the articles.
  // This is calling out to global scope on purpose, as its outside the module,
  //   I don't rely on which module loads first and I can't import the function
  //   when it isn't there.
  if (typeof document.pageStartup === "function") {
    document.pageStartup();
  } else {
    log(
      "info",
      "No article specific scripting found, (it may load manually ATF)",
    );
  }
}

///////////////////////////////////////////////// testing /////////////////////////////////////////////////////////

/**
 * hasBeenRun
 * Access to an int
 
 * @public
 * @return {number}
 */
export function hasBeenRun(): number {
  return OPTS["pageInitRun"];
}

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
    console.error("To use injectOpts, you must set NODE_ENV");
    return;
  }
  OPTS = Object.assign(OPTS, a);
}

/**
 * Only use for testing, it allows access to the entire API
 */
export const TEST_ONLY = {
  injectOpts,
  hasBeenRun,
  _map,
  initPopupMobile,
  storeAppearance,
  applyAppearance,
  burgerMenu,
  tabChange,
  siteCore,
};
