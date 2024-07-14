/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { dateMunge, addLineBreaks, makeRefUrl } from "./string-base";
import {
  log,
  debug,
  URL_PLACEHOLDER,
  runFetch,
  ALL_REFERENCE,
} from "./networking";
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
 * @param {number} offset
 * @public
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
  const out = [];

  for (const i in data) {
    if (data[i] === null) {
      // With modern versions of the references builder shouldn't let this happen
      out.push(empty(parseInt(i, 10)));
      continue;
    }

    const date = dateMunge(data[i].date, po[2], true);

    let title = data[i].title + ""; // this stops errors later...
    title = title.replace(".", ".  ");
    
	let descrip = data[i].desc+"";
	if(descrip.length > OPTS.maxDescripLen ) {
		descrip=descrip.substring(0, OPTS.maxDescripLen );
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
 * @param {Array<NormalisedReference>} data - technically synthetic reference data.
 * @public
 * @returns {string} - the HTML
 */
function render(data: Array<NormalisedReference>): string {
  let html = `<ol class="mobileBiblio">`;
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
 * @param {Array<ReferenceType>} dat
 * @param {Document =document} dom
 * @public
 * @returns {void}
 */
function adjustDom(dat: Array<ReferenceType>, dom: Document = document): void {
  if (!OPTS.renumber) {
    return;
  }

  const LIST = dom.querySelectorAll(OPTS.losingElement + " sup a");
  for (let i = 0; i < LIST.length; i++) {
    LIST[i].textContent = "" + (i+1);
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
  dom: Document = document,
  loc: Location = location,
): Promise<void> {
  const OPTS2: MobileBiblioProps = {
    referencesCache: "/resource/XXX-references",
    gainingElement: "#biblio",
    losingElement: ".addReferences",

    renumber: 1, // set to 0 to disable
    forceToEnd: 1,
	maxDescripLen: 230,
	maxAuthLen:65,
    debug: debug(),
    runFetch: runFetch,
  };
  OPTS = Object.assign(OPTS2, opts);
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
  dom.querySelector(OPTS.gainingElement + " *").replaceChildren([]);
  appendIsland(
    OPTS.gainingElement,
    `<h2 class="biblioSection">References (for mobile UI)</h2> 
<p>The references embedded in the text are displayed here. </p>`,
    dom,
  );

  const dat = await OPTS.runFetch(makeRefUrl(OPTS.referencesCache, loc), false);
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
 * @param {undefined Object} a - I could add a new interface where all the options were optional
 * @public
 * @returns {void}
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
