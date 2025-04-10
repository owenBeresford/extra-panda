import type {
  Pseudable,
  Hashtable,
  HashHashtable,
  HashHashHashtable,
  ExportMode,
} from "./types";
import {
  hash2CSSblock,
  hash2CSS,
  hash2json,
  hashHash2json,
  output,
} from "./output-formats";
import { ExtractReduce } from "./extract-reduce";
import { ExtractMap } from "./extract-map";

/**
 * generate_CSS_file
 * Actually create the CSS asset, returns it to the client
 *
 * @param {Document} doc
 * @param {Window} win
 * @public
 * @returns {Promise<HashHashtable>}
 */
export async function generate_CSS_file(
  dom: Document,
  win: Window,
): Promise<HashHashtable> {
  // items in components should be written as in the HTML, without dots/ hashes
  let components = [
    "defaultLinksMenu",
    "bibbles",
    "h4_footer",
    "articleContent",
    "adjacentGroup",
    "articleHeader row",
  ];
  const vendor: Array<string> = [".fa-", ".fa.fa-", ".hljs-"];
  let buf: HashHashtable = {} as HashHashtable;
  let extr: ExtractMap = new ExtractMap(new ExtractReduce(dom, win), dom, win);

  for (let i in components) {
    let tmp = await extr.compose(components[i], vendor);
    for (let j of Object.keys(tmp)) {
      if (j in buf) {
        buf[j] = Object.assign(buf[j], tmp[j]);
      } else {
        buf[j] = tmp[j];
      }
    }
  }
  return buf;
}

/**
 * dump_it
 * API to emit the result data
 
 * @param {HashHashtable} css
 * @param {ExportMode} mode
 * @param {string} pattern
 * @public
 * @returns {void}
 */
export function dump_it(
  css: HashHashtable,
  mode: ExportMode,
  pattern: string,
): void {
  let css1: string;
  switch (mode) {
    case 1:
      css1 = hash2CSSblock(css, pattern, "\n");
      output(css1, "generated-css.css");
      break;
    case 2:
      css1 = hashHash2json(css);
      output(css1, "generated-css.json");
      break;
    default:
      throw new Error("Unknown value " + mode);
  }
}
