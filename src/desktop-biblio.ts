/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { Document, Location, HTMLAnchorElement, HTMLElement } from "jsdom";

import {
  DesktopBiblioProps,
  SimpleResponse,
  ReferenceType,
} from "./all-types";
import {  appendIsland } from "./dom-base";
import {
  dateMunge,
  mapAttribute,
  articleName,
  addLineBreaks,
  makeRefUrl,
} from "./string-base";
import {
  log,
  debug,
  ALL_REFERENCE,
  ALL_REFERENCE_LINKS,
  runFetch,
} from "./code-collection";

// variables across this module
// * @protected
let OPTS: DesktopBiblioProps = {} as DesktopBiblioProps;

/**
 * markAllLinksUnknown
 * Utility function to statically annotate page in absence of meta data.
 * IMPURE

 * @param {Document =document} dom 
 * @param {Location =location} loc
 * @protected
 * @return {void}
 */
function markAllLinksUnknown(
  dom: Document = document,
  loc: Location = location,
): void {
  const naam: string = articleName(loc);
  const WASSUP: Array<HTMLAnchorElement> =
    dom.querySelectorAll(ALL_REFERENCE_LINKS);
  for (let i = 0; i < WASSUP.length; i++) {
    const txt: string = `Reference popup for link [${1 + i}]\nERROR: No valid biblio file found.\nsite admin, today\nHTTP_ERROR, no valid file called ${naam}-references.json found.\n`;
    WASSUP[i].setAttribute("aria-label", "" + txt);
  }
}

/**
 * generateEmpty
 * Create a tooltip for a link that seems to lack meta data.
 *  PURE

 * @param {number} i - the offset for the link, used in the output
 * @protected
 * @return {string}
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
 * Make text data more suited for display, map to flat string array
 *   PURE

 * @param {Array<ReferenceType>} data
 * @protected
 * @return {Array<string>}
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
    if (auth.length > 65) {
      auth = auth.substring(0, 65);
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
 * applyDOMpostions
 * Actually do the CSS class insertion
 * IOIO KLAXON KLAXON: check memory usage, in earlier browsers this was VERY bad
 *    IMPURE

 * @param {HTMLElement or child class} ele
 * @param {number} WIDTH
 * @protected
 * @return {void}
 */
function applyDOMpostions(ele: HTMLElement, WIDTH: number): void {
  const left = mapAttribute(ele, "left");
  const bot = mapAttribute(ele, "bottom");
  if (left === -1 && bot === -1) {
    return;
  }

  if (left > WIDTH) {
    ele.classList.add("leanIn");
  }
  let tt = ele.parentNode;
  if (tt.tagName === "sup") {
    tt = tt.parentNode;
  }

  const HEIGHT = (mapAttribute(tt, "height") as number) - 3 * 16;
  if (bot > HEIGHT) {
    ele.classList.add("leanUp");
  }
}

/**
 * mapPositions
 * Apply list of values previously made to DOM, and add CSS adjustments
 *    IMPURE

 * @param {Array<string>} data ~ the results of normaliseData()
 * @param {Document =document} dom
 * @protected
 * @return {void}
 */
function mapPositions(data: Array<string>, dom: Document = document): void {
  const WIDTH: number =
    (mapAttribute(dom.querySelector(ALL_REFERENCE), "width") as number) -
    32 * 16;
  const REFS = dom.querySelectorAll(ALL_REFERENCE_LINKS);

  let j = 1;
  for (const i in data) {
    REFS[i].setAttribute("aria-label", "" + data[i]);
    applyDOMpostions(REFS[i], WIDTH);
    if (OPTS.renumber) {
      REFS[i].textContent = "" + j;
    }
    j++;
  }
  if (REFS.length > data.length) {
    let i = data.length;
    while (i < REFS.length) {
      const dit = generateEmpty(i);
      REFS[i].setAttribute("aria-label", "" + dit);

      applyDOMpostions(REFS[i], WIDTH);
      if (OPTS.renumber) {
        REFS[i].textContent = "" + (i + 1);
      }
      i++;
    }
  }
}

/**
 * addMetaAge
 * When found, display the age of the meta file on screen
 *    IMPURE

 * @param {SimpleResponse} xhr - the whole objects from runFetch
 * @param {Document =document}
 * @protected
 * @return {void}
 */
function addMetaAge(xhr: SimpleResponse, dom: Document = document) {
  const updated: number = new Date(xhr.headers.get("last-modified")).getTime();
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
 * biblio
 * Access point for biblio feature v2
 *    IMPURE

 * @param {DesktopBiblioProps} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {void}
 */
export async function createBiblio(
  opts: DesktopBiblioProps,
  dom: Document = document,
  loc: Location = location,
) {
  OPTS = Object.assign(
    {
      indexUpdated: 0,
      type: "biblio",
      width: 400,
      referencesCache: "/resource/XXX-references",
      renumber: 1, // set to 0 to disable

      textAsName: 3,
      wholeTitle: 50,
      limitDesc: 150,
      debug:debug(),
    },
    opts,
  );

  const data: SimpleResponse = await runFetch(
    makeRefUrl(OPTS.referencesCache, loc),
    false,
  );
  if (!data.ok || !Array.isArray(data.body)) {
    markAllLinksUnknown(dom, loc);
    const html =
      '<p class="error">Unable to get bibliographic data for this article.</p>';
    appendIsland(OPTS.gainingElement, html);
    log("warn", "Unable to get meta data ", data.headers);
    //		throw new Error("ERROR getting references "+makeRefUrl(OPTS.referencesCache, loc));
  }

  dom.querySelector("#biblio").setAttribute("style", "");
  addMetaAge(data);
  const cooked: Array<string> = normaliseData(
    data.body as Array<ReferenceType>,
  );
  mapPositions(cooked, dom);
}

/////////////////////////////////////////// testing ////////////////////////////////

/**
 * injectOpts
 * PURELY FOR UNIT TESTS, adds ability to set initial state per internal function
 * READS process.env
 * @param {undefined object} opts - I could add a new interface where all the options were optional
 * @public
 * @return {void}
 */
function injectOpts(a: object): void {
  if (process.env["NODE_ENV"] !== "development") {
    console.error("ERROR: to use injectOpts, you must set NODE_ENV");
    return;
  }
  OPTS = Object.assign(OPTS, a);
}

/**
 * Only use for testing, it allows access to the entire API
 */
export const TEST_ONLY = {
  injectOpts,
  markAllLinksUnknown,
  generateEmpty,
  normaliseData,
  applyDOMpostions,
  mapPositions,
  addMetaAge,
  createBiblio,
};
