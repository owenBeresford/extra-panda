/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { dateMunge, addLineBreaks, makeRefUrl } from "./string-base";
import { log, debug, URL_PLACEHOLDER, runFetch } from "./code-collection";
import { Document, Location } from "jsdom";
import {
  ReferenceType,
  NormalisedReference,
  MobileBiblioProps,
} from "./all-types";
import { appendIsland } from "./dom-base";

// variables across this module
// * @protected
let OPTS: MobileBiblioProps = {} as MobileBiblioProps;

/**
 * empty
 * A static fixture response for no-data issues
 *
 * @param {number} offset
 * @public
 * @return {NormalisedReference}
 */
function empty(offset: number): NormalisedReference {
  return {
    auth: "[No author]",
    date: "[No date]",
    desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
    offset: offset,
    title:
      "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
    url: URL_PLACEHOLDER,
  } as NormalisedReference;
}

/**
 * normaliseData
 * Make text data more suited for display, map to flat string array
 *   PURE

 * @param {Array<ReferenceType>} data
 * @protected
 * @return {Array<NormalisedReference>}
 */
function normaliseData(
  data: Array<ReferenceType | null>,
): Array<NormalisedReference> {
  const po = [
    "[No author]",
    "Resource doesn't set a description tag.",
    "[No date]",
  ];
  const out = [];

  for (const i in data) {
    if (data[i] === null) {
      out.push(empty(parseInt(i, 10)));
      continue;
    }

    const date = dateMunge(data[i].date, po[2], true);
    let title = data[i].title + ""; // this stops errors later...
    let descrip = data[i].desc;

    descrip = addLineBreaks(descrip, 80);
    title = title.replace(".", ". ");
    title = addLineBreaks(title, 80);

    let auth = data[i].auth || po[0];
    if (data[i].auth === "unknown") {
      auth = po[0];
    }
    if (auth.length > 65) {
      auth = auth.substring(0, 65);
    }
    out.push({
      auth: auth,
      date: date,
      desc: descrip,
      offset: parseInt(i, 10),
      title: title,
      url: data[i].url,
    } as NormalisedReference);
  }
  return out;
}

/**
 * render
 * Function to convert the data to HTML
 *
 * @param {Array<NormalisedReference>} data - technically synthetic reference data.
 * @public
 * @return {string} - the HTML
 */
function render(data: Array<NormalisedReference>): string {
  let html = `<ol class="mobileBiblo">`;
  for (const i in data) {
    html += `<li>
<a href="${data[i].url}"> 
<h5>${data[i].title}</h5>
<span>${data[i].desc}</span>
<span>by ${data[i].auth} on ${data[i].date}</span>
</a>
</li>
`;
  }
  html += "</ol>";
  return html;
}

/**
 * adjustDom
 * Hack original text section
 *
 * @param {Array<ReferenceType>} dat
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function adjustDom(dat: Array<ReferenceType>, dom: Document = document): void {
  if (!OPTS.renumber) {
    return;
  }

  const LIST = dom.querySelectorAll(OPTS.losingElement + " sup a");
  for (let i = 0; i < LIST.length; i++) {
    LIST[i].textContent = "" + i;
    if (OPTS.forceToEnd) {
      LIST[i].href = "#biblio";
    }
  }
}

/**
 * biblio
 * Access point for biblio feature v2, on mobile
 *    IMPURE

 * @param {MobileBiblioProps} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {void}
 */
export async function createBiblio(
  opts: MobileBiblioProps,
  dom: Document = document,
  loc: Location = location,
): Promise<void> {
  const OPTS2: MobileBiblioProps = {
    referencesCache: "/resource/XXX-references",
    gainingElement: "#biblio",
    losingElement: ".addReferences",
    pageInitRun: 0,
    renumber: 1, // set to 0 to disable
    tooltip: 0,
    forceToEnd: 1,
    debug:debug(),
  };
  OPTS = Object.assign(OPTS2, opts);

  if (OPTS.pageInitRun) {
    log("warn", "Mobile biblio run twice ??!");
    return;
  }
  OPTS.pageInitRun = 1;

  dom.querySelector("#biblio").setAttribute("style", "");
  dom.querySelector(OPTS.gainingElement + " *").replaceChildren([]);
  appendIsland(
    OPTS.gainingElement,
    `<h2 class="biblioSection">References (for mobile UI)</h2> 
<p>The references embedded in the text are displayed here. </p>`,
    dom,
  );

  const dat = await runFetch(makeRefUrl(OPTS.referencesCache, loc), false);
  if (!dat.ok || !Array.isArray(dat.body)) {
    const html =
      '<p class="error">Unable to get bibliographic data for this article.</p>';
    appendIsland(OPTS.gainingElement, html, dom);
    log("warn", "Unable to get meta data ", dat.headers);
  } else {
    const dat2 = normaliseData(dat.body as Array<ReferenceType>);
    const html = render(dat2);
    adjustDom(dat.body, dom);
    appendIsland(OPTS.gainingElement, html, dom);
  }
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
  empty,
  normaliseData,
  render,
  createBiblio,
};
