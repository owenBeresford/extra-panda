/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { Location, Document, HTMLElement } from "jsdom";

import {
  CoreProps,
  MiscEvent,
  Cookieable,
} from "./all-types";
import { log, debug, APPEARANCE_COOKIE, _getCookie, runFetch } from "./code-collection";
import { listContentGroup } from "./adjacent";
import { initMastodon } from "./mastodon";
import { isMobile, appendIsland } from "./dom-base";
import { createBiblio as mobileCreateBiblio } from "./mobile-biblio";
import { createBiblio as desktopCreateBiblio } from "./desktop-biblio";
 

// variables across this module
// * @protected
let OPTS: CoreProps = {} as CoreProps;

// removed:
// CorrectionModule.prototype.columnise = function ()    << now CSS
// CorrectionModule.prototype.biblioExtract = function ()  << runs HEAD
// CorrectionModule.prototype.extractGET = function (val)  << UNUSED, became language API

/**
 * _map
 * Add several event listeners, just a utility
 *
 * @TODO define type for handler
 * @param {HTMLElement} where
 * @param {Function} action
 * @public
 * @return {void}
 */
function _map(where: HTMLElement, action: Function): void {
  where.addEventListener("click", action);
  where.addEventListener("touch", action);
  where.addEventListener("keypress", action);
}

function isLocal(str: string): boolean {
  if (
    str.startsWith("192.168.") ||
    str === "127.0.0.1" ||
    str === "::1" ||
    str === "0:0:0:0:0:0:0:1" ||
    str === "localhost"
  ) {
    return true;
  }
  return false;
}

/**
 * initPopupMobile
 * Create the popup bar for mobile
 *
 * @param {Document =document} dom
 * @public
 * @return {void}
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

    const local: HTMLAnchorElement = BUFFER[i].cloneNode(true);
    local.classList.remove("bigScreenOnly");
    html.push("<li>");
    html.push(local.outerHTML); // I don't like this line
    html.push("</li>");
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
 * @return {void}
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
 *
 * @param {Document =document} dom
 * @public
 * @return {void}
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
 * @return {void}
 */
function burgerMenu(
  id: string = ".burgerMenu",
  dom: Document = document,
): void {
  const t: HTMLElement = dom.querySelector(id);
  const ico: HTMLElement = dom.querySelector("#pageMenu i");

  if (!t.getAttribute("data-state")) {
    t.classList.add("burgerMenuOpen");
    t.setAttribute("data-state", 1);
    ico.classList.remove("fa-ob1burger");
    ico.classList.add("fa-cancel");
  } else {
    t.classList.remove("burgerMenuOpen");
    t.setAttribute("data-state", null);
    ico.classList.add("fa-ob1burger");
    ico.classList.remove("fa-cancel");
  }
}

/**
 * tabChange
 * Change which tab is visible
 * IOIO REWRITE when tabs are replaced
 *
 * @param {string} id - HTML id for the menu
 * @param {Document =document} dom
 * @public
 * @return {void}
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

  const iter = dom.querySelectorAll(".tabs-content .tabs-panel");
  for (let i = 0; i < iter.length; i++) {
    iter[i].classList.remove("is-active");
  }
  //	target=target.substring(1);
  const alive = dom.querySelectorAll(".tabs-content " + target);
  if (alive.length > 1) {
    throw new Error("Labels on tabs must be unique, or tabs don't work.");
  }

  alive[0].classList.add("is-active");
}

/**
 * siteCore
 * Applies all the functions in this file to the DOM
 *
 * @param {CoreProps} opts - see docs, at top of file
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {void}
 */
export function siteCore(
  opts: CoreProps,
  dom: Document = document,
  loc: Location = location,
  win: Window = window,
): void {
  OPTS = Object.assign(
    {
      tabs: {},
      mobileWidth: 700,
    },
    opts,
  );

  const tt: Array<HTMLElement> = dom.querySelectorAll(".noJS");
  for (let i = 0; i < tt.length; i++) {
    tt[i].classList.remove("noJS");
  }
 
  _map(dom.querySelector("#pageMenu"), burgerMenu);
  initPopupMobile(dom, loc);
  initMastodon(dom, loc, win);
  addOctoCats(dom);
  addBooks(dom);
  addFancyButtonArrow(dom);
  addBashSamples(dom);
  applyAppearance(dom);

  if (
    !isMobile(dom, loc) &&
    loc.pathname !== "/resource/home" &&
    dom.querySelectorAll(".reading").length < 2
  ) {
     readingDuration(
      {
        dataLocation: "#main",
        target: ".addReading",
        debug: debug(),
        refresh: 1,
        linkTo: "/resource/jQuery-reading-duration",
      },
      dom,
    );
  }

  if(isMobile(dom, loc) ) {
     mobileCreateBiblio(
    {
      tocEdit: 1,
      width: OPTS.mobileWidth,
      debug: debug(),
      extendViaDownload: 4,
      tooltip: 1,
      renumber: 1,
      runFetch:runFetch,
    },
    dom,
    loc,
  );
  } else {
     desktopCreateBiblio(
    {
      tocEdit: 1,
      width: OPTS.mobileWidth,
      debug: debug(),
      extendViaDownload: 4,
      tooltip: 1,
      renumber: 1,
      runFetch:runFetch,
    },
    dom,
    loc,
  );

  }


  {
    const tabs = dom.querySelectorAll(".tabsComponent");
    for (let i = 0; i < tabs.length; i++) {
      const btns = tabs[i].querySelectorAll(".label.button");
      for (let j = 0; j < btns.length; j++) {
        _map(btns[j], tabChange);
      }
    }
  }

  if (loc.pathname.match("group-")) {
    const tt = loc.pathname.split("/group-");
    if (Array.isArray(tt) && tt.length > 1 && tt[1].length) {
      adjacent({ group: tt[1], debug: debug(), runFetch:runFetch }, dom, loc);
    }
  } else {
    const grp: Array<string> = listContentGroup("div#contentGroup");
    for (let j = 0; j < grp.length; j++) {
      adjacent(
        { group: grp[j], debug: debug(), iteration: j, count: grp.length, runFetch:runFetch },
        dom,
        loc,
      );
    }
  }

  if (typeof pageStartup === "function") {
    pageStartup();
  }
}

///////////////////////////////////////////////// testing /////////////////////////////////////////////////////////

/**
 * Only use for testing, it allows access to the entire API
 */
export const TEST_ONLY = {
  _map,
  initPopupMobile,
  storeAppearance,
  applyAppearance,
  burgerMenu,
  tabChange,
  siteCore,
};
