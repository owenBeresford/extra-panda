/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { dateMunge, makeRefUrl } from "./string-base";
import { runFetch } from "./networking";
import { URL_PLACEHOLDER, ALL_REFERENCE } from "./immutables";
import type {
  ReferenceType,
  NormalisedReference,
  MobileBiblioProps,
  MobileBiblioPropsDefinite,
} from "./all-types";
import { log, debug } from "./log-services";
import { appendIsland } from "./dom-base";

// variables across this module
// * @protected
let OPTS: MobileBiblioPropsDefinite = {
  referencesCache: "/resource/XXX-references",
  gainingElement: "#biblio",
  losingElement: ".addReferences",

  renumber: 1, // set to 0 to disable
  forceToEnd: 1,
  maxDescripLen: 230,
  maxAuthLen: 65,
  debug: true,
  runFetch: runFetch,
} as MobileBiblioPropsDefinite;

/**
 * empty
 * A static fixture response for no-data issues
 * @param {number} offset
 * @protected
 * @returns {NormalisedReference}
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
 * PURE
 * @param {Array<ReferenceType>} data
 * @protected
 * @returns {Array<NormalisedReference>}
 */
function normaliseData(
  data: Array<ReferenceType | null>,
): Array<NormalisedReference> {
  const po = [
    "[No author]",
    "Resource doesn't set a description tag.",
    "[No date]",
  ];
  const out: Array<NormalisedReference> = [];

  for (const i in data) {
    if (data[i] === null) {
      // With modern versions of the references builder shouldn't let this happen
      out.push(empty(parseInt(i, 10)) as NormalisedReference);
      continue;
    }

    const date = dateMunge(data[i].date, po[2], true);

    let title = data[i].title + ""; // this stops errors later...
    title = title.replace(".", ".  ");

    let descrip = data[i].desc + "";
    if (descrip.length > OPTS.maxDescripLen) {
      descrip = descrip.substring(0, OPTS.maxDescripLen);
    }

    let auth = data[i].auth || po[0];
    if (data[i].auth === "unknown") {
      auth = po[0];
    }
    if (auth.length > OPTS.maxAuthLen) {
      auth = auth.substring(0, OPTS.maxAuthLen);
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
 * @see ["interesting notes to create accessible footnotes", https://www.davidmacd.com/blog/html51-footnotes.html]
 * @param {Array<NormalisedReference>} data - technically synthetic reference data.
 * @protected
 * @returns {string} - the HTML
 */
function render(data: Array<NormalisedReference>): string {
  let html = `<aside role="footnote"><ol class="mobileBiblio">`;
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
  html += "</ol></aside>";
  return html;
}

/**
 * adjustDom
 * Hack original text section
 * @param {Array<ReferenceType>} dat
 * @param {Document =document} dom
 * @protected
 * @returns {void}
 */
function adjustDom(dat: Array<ReferenceType>, dom: Document): void {
  if (!OPTS.renumber) {
    return;
  }

  const LIST: Array<HTMLAnchorElement> = Array.from(
    dom.querySelectorAll(OPTS.losingElement + " sup a"),
  );
  for (let i = 0; i < LIST.length; i++) {
    LIST[i].textContent = "" + (i + 1);
    if (OPTS.forceToEnd) {
      LIST[i].href = "#biblio";
    }
  }
}

/**
 * biblio
 * Access point for biblio feature v2, on mobile
 * IMPURE
 * @param {MobileBiblioProps} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @returns {void}
 */
export async function createBiblio(
  opts: MobileBiblioProps,
  dom: Document,
  loc: Location,
): Promise<void> {
  OPTS = Object.assign(OPTS, { debug: debug(loc) }, opts);
  if (dom.querySelectorAll(ALL_REFERENCE).length === 0) {
    log(
      "info",
      "URL '" + loc.pathname + "' isn't marked-up for references, so skipped",
    );
    return;
  }

  const tmp = dom.querySelector("#biblio");
  if (tmp) {
    tmp.setAttribute("style", "");
  }
  (
    dom.querySelector(OPTS.gainingElement + " *") as HTMLElement
  ).replaceChildren();
  appendIsland(
    OPTS.gainingElement,
    `<h2 class="biblioSection">References (for mobile UI)</h2> 
<p>The references embedded in the text are displayed here. </p>`,
    dom,
  );

  const dat = await OPTS.runFetch(
    makeRefUrl(OPTS.referencesCache, loc),
    true,
    debug(loc),
  );
  if (!dat.ok || !Array.isArray(dat.body)) {
    const html =
      '<p class="error">Unable to get bibliographic data for this article.</p>';
    appendIsland(OPTS.gainingElement, html, dom);
    log(
      "warn",
      "Unable to get meta data " + makeRefUrl(OPTS.referencesCache, loc),
      JSON.stringify(Array.from(dat.headers.entries())),
    );
  } else {
    const dat2 = normaliseData(dat.body as Array<ReferenceType>);
    const html = render(dat2);
    adjustDom(dat.body as Array<ReferenceType>, dom);
    appendIsland(OPTS.gainingElement, html, dom);
  }
}

/////////////////////////////////////////// testing ///////////////////////////////////////

/**
 * injectOpts
 * PURELY FOR UNIT TESTS, adds ability to set initial state per internal function
 * READS process.env
 * @param {undefined-Object} a - I could add a new interface where all the options were optional
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
 * Only use for testing, it allows access to the entire API
 */
export const TEST_ONLY = {
  injectOpts,
  empty,
  normaliseData,
  render,
  adjustDom,
  createBiblio,
};
