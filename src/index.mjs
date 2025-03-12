/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import { siteCore, hasBeenRun } from "./core";
import { runFetch } from "./networking";
import { log } from "./log-services";
import { appendIsland, isMobile, currentSize, calcScreenDPI } from "./dom-base";
import { storeAppearance } from "./cookies";
import { SELF_VERSION } from "./immutables";

import { generate_CSS_file, dump_it } from "../tools/css-extractor";

// this file is only used in the web-build
siteCore({}, document, location, window);

// External module, this code should be masked out in production builds
let PARAMS=new URLSearchParams(location.search);
if( PARAMS.has('dump-css') ) {
// I made need to add a thing to get it to execute after local scripting has completed
	dump_it( await generate_CSS_file(document, window),  parseInt(PARAMS.get('dump-css'), 10), PARAMS.get('aspect')??"width:100%" );
}

export {
  runFetch,
  log,
  hasBeenRun,
  appendIsland,
  isMobile,
  storeAppearance,
  currentSize,
  calcScreenDPI,
  SELF_VERSION,
};
