/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import { siteCore, hasBeenRun } from "./core";
import { runFetch, delay } from "./networking";
import { log, domLog } from "./log-services";
import { appendIsland, isMobile, currentSize, calcScreenDPI } from "./dom-base";
import { storeAppearance } from "./cookies";
import { SELF_VERSION } from "./immutables";

// this file is only used in the web-build
await siteCore({}, document, location, window);

/**
import { generate_CSS_file, dump_it } from "./extractor";

// External module, this code should be masked out in production builds
let PARAMS=new URLSearchParams(location.search);
if( PARAMS.has('dump-css') ) {
	console.log("Open tools now");
	await delay(5000);
	dump_it( await generate_CSS_file(document, window),  parseInt(PARAMS.get('dump-css'), 10), PARAMS.get('aspect')??"(width:100%)" );
}
*/

export {
  runFetch,
  log,
  domLog,
  hasBeenRun,
  appendIsland,
  isMobile,
  storeAppearance,
  currentSize,
  calcScreenDPI,
  SELF_VERSION,
};
