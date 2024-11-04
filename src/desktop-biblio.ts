/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
// import { Document, Location, HTMLAnchorElement, HTMLElement } from "jsdom";

import { DesktopBiblioProps, DesktopBiblioPropsDefinite, SimpleResponse, ReferenceType } from "./all-types";
import { appendIsland, mapAttribute } from "./dom-base";
import {
  dateMunge,
  articleName,
  addLineBreaks,
  makeRefUrl,
} from "./string-base";
import {
  log,
  debug,
  ALL_REFERENCE,
  SHOW_ERROR,
  ALL_REFERENCE_LINKS,
  runFetch,
  EM_SZ,
} from "./networking";

// variables across this module
// * @protected
let OPTS: DesktopBiblioPropsDefinite =  {
      indexUpdated: 0,
      gainingElement: "#biblio",
      referencesCache: "/resource/XXX-references",
      renumber: 1, // set to 0 to disable
      maxAuthLen: 65,
      debug: true,
      runFetch: runFetch,
    } as DesktopBiblioPropsDefinite;

/**
 * markAllLinksUnknown
 * Utility function to statically annotate page in absence of meta data.
 * IMPURE
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @protected
 * @returns {void}
 */
function markAllLinksUnknown(dom: Document, loc: Location): void {
  const naam: string = articleName(loc);
  const WASSUP: Array<HTMLAnchorElement> = Array.from(
    dom.querySelectorAll(ALL_REFERENCE_LINKS)) as Array<HTMLAnchorElement>;

  for (let i = 0; i < WASSUP.length; i++) {
    const txt: string = `Reference popup for link [${1 + i}]\nERROR: No valid biblio file found.\nsite admin, today\nHTTP_ERROR, no valid file called ${naam}-references.json found.\n`;
    WASSUP[i].setAttribute("aria-label", "" + txt);
  }
  dom.querySelector(ALL_REFERENCE).classList.add(SHOW_ERROR);
}

/**
 * generateEmpty
 * Create a tooltip text for a link that lacks meta data.
 * PURE
 * @param {number} i - the offset for the link, used in the output
 * @protected
 * @returns {string}
 */
function generateEmpty(i: number): string {
  const DEFAULT = {
    desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
    auth: "",
    date: dateMunge(+new Date("07-June-2024"), "not used", true),
    title:
      "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
  };
  return (
    "Reference popup for link [" +
    (i + 1) +
    "]\n\n" +
    DEFAULT.title +
    "\n" +
    DEFAULT.auth +
    " " +
    DEFAULT.date +
    "\n\n" +
    DEFAULT.desc
  );
}

/**
 * normaliseData
 * Make text data more suited for display, map to flat string array.
 * PURE.
 * @param {Array<ReferenceType>} data
 * @protected
 * @returns {Array<string>}
 */
function normaliseData(data: Array<ReferenceType | null>): Array<string> {
  const po = [
    "[No author]",
    "Resource doesn't set a description tag.",
    "[No date]",
  ];
  const out = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i] === null) {
      out.push(generateEmpty(i));
      continue;
    }

    const date = dateMunge(data[i].date, po[2], true);
    let title = data[i].title + ""; // this stops errors later...
    let desc = data[i].desc;

    desc = addLineBreaks(desc, 80);
    title = title.replace(".", ". ");
    title = addLineBreaks(title, 80);

    let auth = data[i].auth || po[0];
    if (data[i].auth === "unknown") {
      auth = po[0];
    }
    if (auth.length > OPTS.maxAuthLen) {
      auth = auth.substring(0, OPTS.maxAuthLen);
    }

    out.push(
      "Reference popup for link [" +
        (i + 1) +
        "]\n\n" +
        title +
        "\n" +
        auth +
        " " +
        date +
        "\n\n" +
        desc,
    );
  }
  return out;
}

/**
 * applyDOMpositions
 * Actually does the CSS class insertion here.
 * see mapPositions() for the iterators
 * IMPURE.
 * @param {HTMLElement} ele
 * @param {Window =window} win
 * @protected
 * @returns {void}
 */
export function applyDOMpositions(ele: HTMLElement, win: Window): void {
  if (ele === null) {
    return;
  }
  const left = mapAttribute(ele, "left", win);
  const bot = mapAttribute(ele, "bottom", win);
  if (left === -1 && bot === -1) {
    return;
  }

  let tt:HTMLElement = ele.parentNode as HTMLElement;
  const subItem: Array<string> = ["LI", "SUP", "UL", "OL", "SPAN", "P"];
  // list doesn't include HTML, BODY, DETAILS or DIV
  while (subItem.includes(tt.tagName)) {
    tt = tt.parentNode as HTMLElement;
  }
  const WIDTH =
    Math.round(mapAttribute(tt, "width", win) as number) - 30 * EM_SZ;
  if (left > WIDTH) {
    ele.classList.add("leanIn");
  }

  const HEIGHT = (mapAttribute(tt, "height", win) as number) - 3 * EM_SZ;
  if (bot > HEIGHT) {
    ele.classList.add("leanUp");
  }
}

/**
 * mapPositions
 * Apply list of values previously made to DOM, and add CSS adjustments.
 * IMPURE.
 *
 * @param {Array<string>} data ~ the results of normaliseData()
 * @param {Document =document} dom
 * @param {Window =window} win
 * @protected
 * @returns {void}
 */
function mapPositions(data: Array<string>, dom: Document, win: Window): void {
  let j = 1;
  const REFS:Array<HTMLAnchorElement> = Array.from(dom.querySelectorAll(ALL_REFERENCE_LINKS));
  if (data.length > REFS.length) {
    dom.querySelector(ALL_REFERENCE).classList.add(SHOW_ERROR);
    dom.querySelector("p[role=status]").textContent += " Recompile meta data. ";
    throw new Error(
      "Too many references in meta-data for this article, pls recompile.",
    );
  }

  for (let i = 0; i < data.length; i++) {
    REFS[i].setAttribute("aria-label", "" + data[i]);
    applyDOMpositions(REFS[i], win);
    if (OPTS.renumber) {
      REFS[i].textContent = "" + j;
    }
    j++;
  }
  if (REFS.length > data.length) {
    dom.querySelector("p[role=status]").textContent += "Recompile meta data";

    let i = data.length;
    while (i < REFS.length) {
      const dit = generateEmpty(i);
      REFS[i].setAttribute("aria-label", "" + dit);

      applyDOMpositions(REFS[i], win);
      if (OPTS.renumber) {
        REFS[i].textContent = "" + (i + 1);
      }
      i++;
    }
  }
}

/**
 * addMetaAge
 * When found, display the age of the meta file on screen.
 * Unneeded in small screens.
 * IMPURE.

 * @param {SimpleResponse} xhr - the whole objects from runFetch
 * @param {Document =document} dom
 * @protected
 * @returns {void}
 */
function addMetaAge(xhr: SimpleResponse, dom: Document) {
  let tstr = xhr.headers.get("last-modified");
  if (!tstr) {
    return;
  }
  // for unknown reasons, JS doesn't like TZ "BST", but it does accept "EST" etc
  // I'll take a 1H error, as I am reporting to the *day*, and the accuracy not that critical
  if (tstr.indexOf("BST") > 0) {
    tstr = tstr.substring(0, tstr.length - 4);
  }
  const updated: number = new Date(tstr).getTime();
  if (updated > 0) {
    const str: string =
      '<span>Links updated <time datetime="' +
      updated +
      '" title="When this was last recompiled">' +
      new Date(updated).toLocaleDateString("en-GB", {
        hour12: false,
        dateStyle: "medium",
      }) +
      "</time> </span>";
    appendIsland(".addReading .ultraSkinny", str, dom);
  }
}

/**
 * createBiblio
 * Access point for biblio feature v2.

 * IMPURE
 * @param {DesktopBiblioProps} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {void}
 */
export async function createBiblio(
  opts: DesktopBiblioProps,
  dom: Document,
  loc: Location,
  win: Window,
) {
  OPTS = Object.assign(
    OPTS,
    { 
		debug:debug(loc),
	},
    opts,
  ) as DesktopBiblioPropsDefinite;
  if (dom.querySelectorAll(ALL_REFERENCE).length === 0) {
    log(
      "info",
      "This URL '" +
        loc.pathname +
        "' isn't marked-up for references, so skipped",
    );
    return;
  }

  const data: SimpleResponse = await OPTS.runFetch(
    makeRefUrl(OPTS.referencesCache, loc),
    false,
    loc
  );
  if (!data.ok || !Array.isArray(data.body)) {
    markAllLinksUnknown(dom, loc);
    const html =
      '<p class="error">Unable to get bibliographic data for this article.</p>';
    appendIsland(OPTS.gainingElement, html, dom);
    log(
      "warn",
      "Unable to get meta data " + makeRefUrl(OPTS.referencesCache, loc),
      JSON.stringify(Array.from(data.headers.entries())),
    );
  } else {
    const REFS = dom.querySelectorAll(ALL_REFERENCE_LINKS);
    if (REFS.length < data.body.length) {
      // situation only likely to occur in test data
      throw new Error("Recompile the meta data for  " + loc.pathname);
      return;
    }

    const tmp = dom.querySelector("#biblio");
    if (tmp) {
      tmp.setAttribute("style", "");
    }
    addMetaAge(data, dom);
    const cooked: Array<string> = normaliseData(
      data.body as Array<ReferenceType>,
    );
    mapPositions(cooked, dom, win);

    // enable reporting of bad values
    dom.querySelector(ALL_REFERENCE).classList.add(SHOW_ERROR);
  }
}

/////////////////////////////////////////// testing ////////////////////////////////

/**
 * injectOpts
 * PURELY FOR UNIT TESTS, adds ability to set initial state per internal function.
 * READS process.env
 * @param {object} a - I could add a new interface where all the options were optional
 * @public
 * @returns {void}
 */
function injectOpts(a: object): void {
  if (process.env["NODE_ENV"] !== "development") {
    log("error", "to use injectOpts, you must set NODE_ENV");
    return;
  }
  OPTS = Object.assign(OPTS, a);
}

/**
 * Only use for testing, it allows access to the entire API.
 */
export const TEST_ONLY = {
  injectOpts,
  markAllLinksUnknown,
  generateEmpty,
  normaliseData,
  applyDOMpositions,
  mapPositions,
  addMetaAge,
  createBiblio,
};
