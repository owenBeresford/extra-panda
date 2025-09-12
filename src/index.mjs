/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

/* the root access point for this TS set of features,

I can see you asking why isn't this OO?  
The earlier edition was in jQuery, I am just porting towards today.
I can push it towards actual FP more easily.

The most OO section of code, is the one with no legacy
the CSS extractor
which has been removed from production as it didn't deliver what I needed.
*/

import { siteCore, hasBeenRun } from "./core";
import { runFetch, delay } from "./networking";
import { log, domLog } from "./log-services";
import { initExpandImage } from "./expand-image";
import { initTabs } from './tabs';
import {
  appendIsland,
  isMobile,
  currentSize,
  calcScreenDPI,
  isLibreWolf,
  ready,
} from "./dom-base";
import { storeAppearance } from "./cookies";
import { SELF_VERSION, matchVersion } from "./immutables";

// this file is only used in the web-build
await siteCore({}, document, location, window);

// if (matchVersion("1.test-only")) {
if (SELF_VERSION >= "1.test-only") {
  // External module, this code should be masked out in production builds
  const { generate_CSS_file, dump_it } = await import("./extractor");
  let PARAMS = new URLSearchParams(location.search);
  if (PARAMS.has("dump-css")) {
    console.log("Open tools now");
    await delay(5000);
    dump_it(
      await generate_CSS_file(document, window),
      parseInt(PARAMS.get("dump-css"), 10),
      PARAMS.get("aspect") ?? "(width:100%)",
    );
  }
}

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
  isLibreWolf,
  ready,
  initTabs,
  initExpandImage,
  SELF_VERSION,
};
