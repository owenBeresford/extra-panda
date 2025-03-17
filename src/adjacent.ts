/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { dateMunge, articleName } from "./string-base";
import { log, debug } from "./log-services";
import { runFetch } from "./networking";
import type {
  SimpleResponse,
  ReferenceType,
  NormalisedReference,
  AdjacentPropsDefinite,
  AdjacentProps,
} from "./all-types";
import { isMobile, appendIsland } from "./dom-base";

// variables across this module
let OPTS: AdjacentPropsDefinite = {
  name: "",
  meta: "",
  perRow: 10,
  titleLimit: 40,
  rendered: false,
  iteration: 0,
  group: "system",
  count: 1,
  debug: true,
  runFetch: runFetch,
} as AdjacentPropsDefinite;

/**
 * mapURL
 * Extract sections of URL used for the meta data files so it can be applied to the local page.
 *    PURE
 * @param {string} article
 * @param {string} suffix
 * @param {Location =location} loc
 * @protected
 * @returns {string} - the desired full URL of this page
 */
function mapURL(article: string, suffix: string, loc: Location): string {
  //  let t = loc.protocol + "//" + loc.host,
  let t2 = loc.pathname.split("/"),
    t = "",
    t3 = t2.pop() as string;
  const tmp = new URLSearchParams(loc.search);
  if (t3 === "group-XXX" && tmp.has("first")) {
    t3 = tmp.get("first") ?? "logic-error";
  }
  if (suffix) {
    if (tmp.has("first")) {
      t += loc.pathname.replace("group-XXX", t3 + "-meta");
    } else {
      t += loc.pathname.replace(t3, article + "-meta");
    }
  } else {
    t += loc.pathname.replace(t3, article);
  }
  t += loc.search + loc.hash;
  return t;
}

/**
 * createStyle
 * Compute the relevant CSS classes for this item
 *    PURE
 * @param {boolean} isLong
 * @param {number} isOffscreen - unused in current version, but may be readded in future
 * @protected
 * @returns {string}
 */
function createStyle(isLong: boolean, isOffscreen: boolean): string {
  let clsNm = "button";
  if (isLong) {
    clsNm += " lower";
  }
  // I removed this feature
  //		if(isOffscreen ) { clsNm += " left"; }
  return clsNm;
}

/**
 * cleanTitle
 * Manipulate string so it can be used as a DOM id
 *    PURE
 * @param {string} id
 * @param {string} group
 * @protected
 * @returns {string}
 */
function cleanTitle(id: string, group: string): string {
  return group + "" + id.replace(/[^a-zA-Z0-9_]/g, "_");
}

/**
 * extractOABName
 * Readability macro
 * DO NOT EXPORT this is 1 line of code, functionalised for readability reasons
    PURE
 * @param {string} url
 * @protected
 * @returns {string}
 */
function extractOABName(url: string): string {
  const TMP = url.split("/");
  return TMP.pop() ?? "";
}

/**
 * generateGroup
 * Get the article group name from supplied data OR the URL
 * Will be supplied in OPTS for normal pages
 * Will be on the URL for the group indexes
 *       PURE
 * @param {Location =location} loc
 * @protected
 * @throws when insufficient data has been supplied
 * @returns {string}
 */
function generateGroup(loc: Location): string {
  let foreward = OPTS.group;
  if (OPTS.group === "XXX") {
    const tmp = new URLSearchParams(loc.search);
    if (tmp.has("first")) {
      foreward = tmp.get("first") as string;
    }
  }
  if (foreward === "XXX") {
    throw new Error("Thou shalt supply the group somewhere");
  }
  return foreward;
}

/**
 * normaliseToList ~
 * PURE
 * [me, remainder] form a sliding window of the meta data,
 * the window may exceed the end of the adjacent meta data, in which case
 * it fills the buffer 'list' with values from the start of the meta data
 * @param {Array<ReferenceType>} data - the meta data
 * @protected
 * @returns {Array<NormalisedReference>}
 */
function normaliseToList(
  data: Array<ReferenceType>,
): Array<NormalisedReference> {
  let me: number = -1,
    remainder: number = OPTS.perRow,
    list: Array<NormalisedReference> = [], // this array is written to, see below
    i = 0,
    j = 0;
  //    retries = 0;
  [me, remainder, i] = nextStep(
    extractOABName(data[0].url),
    OPTS.name,
    data.length,
    i,
    me,
  );

  for (; i < data.length; i++) {
    const title = data[i].title;
    if (title && me >= 0 && remainder > 0) {
      list[j] = {
        auth: data[i].auth,
        date: dateMunge(data[i].date, "[Unknown time]", true),
        url: data[i].url,
        offset: i,
        title: data[i].title.substr(0, OPTS.titleLimit),
        desc: data[i].desc,
      } as NormalisedReference;

      if (title.length > OPTS.titleLimit) {
        list[j].title += "...";
      }
      const tt = data[i].desc;
      if (tt.length > 235) {
        list[j].desc = tt.substr(0, 235) + "...";
      }
      remainder--;
      j++;
    }
    [me, remainder, i] = nextStep(
      extractOABName(data[i].url),
      OPTS.name,
      remainder,
      i,
      me,
    );

    // if i can get more time, I will integrate this break clause into nextStep
    // im too tired now
    if (list.length === data.length) {
      break;
    }
    if (list.length >= OPTS.perRow) {
      break;
    }
  }
  return list;
}

/**
 * nextStep
 * maps the next values, to make other code simpler
 *     PURE
 * @param {string} cur
 * @param {string} local
 * @param {number} wrap
 * @param {number} i
 * @param {number} me
 * @protected
 * @returns {Array<number>}
 */
function nextStep(
  cur: string,
  local: string,
  wrap: number,
  i: number,
  me: number,
): Array<number> {
  if (OPTS.name === "group-" + OPTS.group) {
    return [me, wrap, i];
  }
  if (local === cur) {
    me = i;
  }
  if (i > 0 && me > 0 && wrap > 0 && i >= wrap - 1) {
    i = 0;
  }
  return [me, wrap, i];
}

/**
 * listContentGroup
 * Map the data group attribute to an Array
 * @param {string} id
 * @param {Document =document} dom
 * @public
 * @returns {Array<string>}
 */
export function listContentGroup(
  id: string,
  dom: Document = document,
): Array<string> {
  const grp = dom.querySelector(id);
  if (!grp) {
    return [] as Array<string>;
  }
  const grpDat = grp.getAttribute("data-group");
  if (!grpDat) {
    return [] as Array<string>;
  }

  let grpDat2 = grpDat.split(",");
  grpDat2 = grpDat2.map((a: string, b: number): string => {
    return a.trim();
  });
  if (grpDat2[0] === "XXX") {
    grpDat2.shift();
    // in this case, the function will return []
  }
  return [...grpDat2];
}

/**
 * convert2HTML
 * Convert an array of Reference type into a HTML string
 *   PURE
 * NOTE: the initial link is hardcoded in the static HTML template, so people with problems can still follow the user journey
 *
 * @param {Array<NormalisedReference>} list
 * @param {string} gname - the group name
 * @protected
 * @returns {string} - the HTML
 */
function convert2HTML(list: Array<NormalisedReference>, gname: string): string {
  let html = '<ul class="adjacentList">\n';
  for (const i in list) {
    const nui = cleanTitle(i, gname);
    // testLeanLeft($e.width(), $e.children(), tt.length>110?110:tt.length)
    const clsNm = createStyle(list[i].desc.length > 110, false);

    const txt =
      "Title: " +
      list[i].title +
      "\nAuthor: " +
      list[i].auth +
      " &nbsp; &nbsp; Last edit: " +
      list[i].date +
      "\nDescription: " +
      list[i].desc;

    html +=
      '<li> <a id="link' +
      nui +
      '" class="' +
      clsNm +
      '" href="' +
      list[i].url +
      '" aria-label="' +
      txt +
      '" >' +
      list[i].title +
      "</a> </li>\n";
  }

  if (list.length === 0) {
    html += "<li> Article doesn't seem setup correctly.</li></ul>";
  } else {
    html +=
      '<li><a class="adjacentItem button" href="/resource/group-XXX?first=' +
      gname +
      '" aria-label="This article lists all items in '+gname+' group."> See full list </a></li></ul>';
  }
  return html;
}

/**
 * convert2IndexHTML
 * Code to generate HTML islands for the index pages
 *     IMPURE (logging)
 * @param {Array<ReferenceType>} list
 * @param {string} gname
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @protected
 * @returns {string} - of HTML
 */
function convert2IndexHTML(
  list: Array<ReferenceType>,
  gname: string,
  dom: Document,
  loc: Location,
  win: Window,
): string {
  let html = "";
  for (const i in list) {
    const nui = cleanTitle(i, gname),
      lbreak = isMobile(dom, loc, win) ? "<br />" : "";
    let tt = list[i].desc;
    if (tt.length > 235) {
      tt = tt.substr(0, 235) + "...";
    }

    html +=
      '<a class="adjacentItem" href="' +
      list[i].url +
      '" title="' +
      tt +
      '">' +
      list[i].title +
      ' <span class="button">' +
      list[i].title +
      '</span><p id="adjacent' +
      nui +
      '" >Author: ' +
      list[i].auth +
      " &nbsp; &nbsp; &nbsp;" +
      lbreak +
      "  Last edit: " +
      dateMunge(list[i].date, "Unknown time", true) +
      " <br />Description: " +
      tt +
      " </p></a>\n";
  }
  return html;
}

/**
 * updateLabels
 * Apply the JS code to the new DOM elements
 * WARN has side effects, IMPURE
 * @param {string} gname - article group name
 * @param {Document =document} dom
 * @protected
 * @returns {void}
 */
function updateLabels(gname: string, dom: Document): void {
  const dat: Array<HTMLElement> = Array.from(
    dom.querySelectorAll(".top-bar.fullWidth header h1"),
  ) as Array<HTMLElement>;

  if (
    dat.length && dat[0].textContent &&
    (dat[0].textContent.includes("whatsmyname") ||
      dat[0].textContent.includes("XXX"))
  ) {
    dat[0].textContent = "Group " + gname;
  }
  const dit: Array<HTMLElement> = Array.from(
    dom.querySelectorAll(".adjacentGroup p"),
  ) as Array<HTMLElement>;
  if (dit.length && dit[0].textContent && dit[0].textContent.includes("XXX")) {
    dit[0].textContent = "Some similar articles in " + gname;
  }
}

/**
 * extractGroup
 * A method to extract the possible data sources for group data
 *     PURE
 * @param {HTMLElement | null} ele
 * @param {Location = location} loc
 * @param {Document = document} dom - unused param supplied so if I need to add an extra reading point I can
 * @public
 * @throws Error when there is no known data to extract
 * @returns {string}
 */
export function extractGroup(ele: HTMLElement | null, loc: Location): string {
  const tmp1: Array<string> = loc.pathname.split("/group-");
  if (Array.isArray(tmp1) && tmp1.length > 1 && tmp1[1] !== "XXX") {
    return tmp1[1];
  }
  const tmp2: URLSearchParams = new URLSearchParams(loc.search);
  if (tmp2.has("first")) {
    return tmp2.get("first") ?? "";
  }

  // this third option is just a back stop;
  if (ele && ele.getAttribute("data-group")) {
    let tmp = ele.getAttribute("data-group") ?? "";
    tmp = tmp.trim();
    const tmp2 = tmp.split(",").map((a, b) => {
      return a.trim();
    });
    return tmp2[0];
  }
  throw new Error(
    "KLAXON, KLAXON, I do not know how to build an adjacent list for " +
    loc.href,
  );
}

/**
 * createAdjacentChart
 * Create an adjacent chart at the bottom of the current article.
 *     IMPURE
 * @param {AdjacentParams} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @returns {Promise<void>}
 */
export async function createAdjacentChart(
  opts: AdjacentProps,
  dom: Document,
  loc: Location,
  win: Window,
): Promise<void> {
  OPTS = Object.assign(
    OPTS,
    {
      name: articleName(loc),
      meta: mapURL(OPTS.group, ".json", loc),
      debug: debug(loc),
      runFetch: runFetch,
    },
    opts,
  ) as AdjacentPropsDefinite;
  if (OPTS.group === "system") {
    throw new Error("Must set the article group, and not to 'system'.");
  }
  OPTS.meta = mapURL(OPTS.group, ".json", loc);

  const isGroupArticle: boolean =
    OPTS.name === "group-XXX" || OPTS.name === "group-" + OPTS.group;
  const GROUP: string = "group" + OPTS.group;

  if (isMobile(dom, loc, win) && !isGroupArticle) {
    if (dom.querySelectorAll(".adjacentGroup .adjacentItem").length === 1) {
      (dom.querySelector(".adjacentGroup p") as HTMLElement).style["display"] =
        "none";
    }
    appendIsland(
      "#" + GROUP,
      "<p>As mobile View, use the full page link to the left</p>",
      dom,
    );
  } else {
    const data: SimpleResponse = await OPTS.runFetch(OPTS.meta, false, loc);
    if (!data.ok || !Array.isArray(data.body)) {
      log("info", "There doesn't seem to be a group meta data file.");
      appendIsland(
        "#" + GROUP,
        "<p>Internal error. Hopefully this will be fixed shortly. </p>",
        dom,
      );

      return;
    }

    if (isGroupArticle) {
      const html = convert2IndexHTML(
        data.body as Array<ReferenceType>,
        GROUP,
        dom,
        loc,
        win,
      );
      appendIsland("#groupXXX", html, dom);
      updateLabels(generateGroup(loc), dom);
    } else {
      const rendered = normaliseToList(data.body as Array<ReferenceType>);
      const html = convert2HTML(rendered, generateGroup(loc));
      appendIsland("#" + GROUP, html, dom);
    }
  }
}

/////////////////////////////////////////// testing ////////////////////////////////

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
  mapURL,
  extractGroup,
  createStyle,
  cleanTitle,
  generateGroup,
  normaliseToList,
  listContentGroup,
  nextStep,
  convert2HTML,
  updateLabels,
  convert2IndexHTML,
  createAdjacentChart,
};
