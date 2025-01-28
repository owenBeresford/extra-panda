/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import { siteCore, hasBeenRun } from "./core";
import { runFetch, log } from "./networking";
import { appendIsland, isMobile, currentSize, calcScreenDPI } from "./dom-base";
import { storeAppearance } from "./cookies";

// this file is only used in the webbuild
siteCore({}, document, location, window);
export {
  runFetch,
  log,
  hasBeenRun,
  appendIsland,
  isMobile,
  storeAppearance,
  currentSize,
  calcScreenDPI,
};
