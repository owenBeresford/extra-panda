/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import { siteCore, hasBeenRun } from "./core";
import { runFetch } from "./networking";
import { log } from "./log-services";
import { appendIsland, isMobile, currentSize, calcScreenDPI } from "./dom-base";
import { storeAppearance } from "./cookies";
import { SELF_VERSION } from './immutables';

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
  SELF_VERSION,
};
