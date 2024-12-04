/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
// import { Location, Document, HTMLElement } from "jsdom";

import { CoreProps, MiscEvent, MultiFuncArg } from "./all-types";
import { log, debug, runFetch } from "./networking";
import {
  listContentGroup,
  extractGroup,
  createAdjacentChart,
} from "./adjacent";
import { initMastodon } from "./mastodon";
import { isLocal } from "./string-base";
import { isMobile, appendIsland, applyVolume, expandDetails } from "./dom-base";
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
import { applyAppearance } from "./cookies";

// variables across this module
// * @protected
let OPTS: CoreProps = {
  pageInitRun: 0,
} as CoreProps;

/**
 * _map
 * Add several event listeners, just a utility
 *
 * @param {HTMLElement} where
 * @param { (id: string | MiscEvent, dom: Document ) =>void} action
 * @protected
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
 * @param {Window =window} win
 * @protected
 * @returns {void}
 */
function initPopupMobile(dom: Document, loc: Location, win: Window): void {
  const MOBILE = isMobile(dom, loc, win);
  if (!isLocal(loc.host) && !MOBILE) {
    return;
  }

  if (MOBILE) {
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
 * burgerMenu
 * A utility to manage the State in the burgermenu
 * @param {string =".burgerMenu"} id - HTML id for the menu
 * @param {Document =document} dom
 * @protected
 * @returns {void}
 */
function burgerMenu(id: string = ".burgerMenu", dom: Document): void {
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
 * @param {string|MiscEvent} id - HTML id for the menu
 * @param {Document =document} dom
 * @protected
 * @returns {void}
 */
function tabChange(id: string | MiscEvent, dom: Document): void {
  let click: HTMLLIElement | null = null;
  let target: string = "";

  if (typeof id === "string") {
    target = id;
    const thing = dom.querySelector(id) as HTMLElement;
    if (thing.tagName === "SECTION") {
      click = dom.querySelector('.tabList a[href="' + id + '"] ');
    } else {
      log("error", "what is this? ", thing, thing.tagName);
      throw new Error("Bad call");
    }
  } else {
    const tmp: HTMLElement = id.target as HTMLElement;
    click = dom.querySelector("#" + tmp.id) as HTMLElement;
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

/*eslint complexity: ["error", 30]*/
/**
 * siteCore
 * Applies all the functions in this file to the DOM
 * @param {CoreProps} opts - see docs, at top of file
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {void}
 */
export async function siteCore(
  opts: CoreProps,
  dom: Document,
  loc: Location,
  win: Window,
): Promise<void> {
  OPTS = Object.assign(
    OPTS,
    {
      // none found
    },
    opts,
  );
  const ldebug = debug(loc);

  if (OPTS.pageInitRun) {
    log("warn", "Extra panda should not be run more than once per page");
    return;
  }
  OPTS.pageInitRun = 1;

  const tt: Array<HTMLElement> = Array.from(
    dom.querySelectorAll(".noJS"),
  ) as Array<HTMLElement>;
  for (let i = 0; i < tt.length; i++) {
    tt[i].classList.remove("noJS");
  }

  applyVolume(dom, win);
  initPopupMobile(dom, loc, win);
  initMastodon(dom, loc, win);
  const isRefs: boolean = dom.querySelector(".addReferences") !== null;
  addOctoCats(isRefs, dom, win);
  addBooks(isRefs, dom, win);
  addFancyButtonArrow(dom);
  addBashSamples(dom);
  applyAppearance(dom);
  modalInit(dom);
  expandDetails(1040, dom, loc, win);

  if (
    !isMobile(dom, loc, win) &&
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
      loc,
    );
  }

  {
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

  if (loc.pathname.match("group-")) {
    const tt = extractGroup(null, loc);
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
        win,
      );
    }
  } else {
    if (isMobile(dom, loc, win)) {
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
          renumber: 1,
          runFetch: "desktopRunFetch" in OPTS ? OPTS.desktopRunFetch : runFetch,
        },
        dom,
        loc,
        win,
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
          win,
        );
      }
    }
  }

  // There may be a pageStartup() in 20-30% of the articles.
  // This is calling out to global scope on purpose, as its outside the module,
  //   I don't rely on which module loads first and I can't import the function
  //   when it isn't there.
  if (
    typeof document !== "undefined" &&
    typeof document.pageStartup === "function"
  ) {
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
 * @returns {number}
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
  hasBeenRun,
  _map,
  initPopupMobile,
  burgerMenu,
  tabChange,
  siteCore,
};
