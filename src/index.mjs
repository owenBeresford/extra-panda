/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

// this file is importing everything to ensure that the linker/ minifier can see the files
import * as Types from "./all-types";
import * as NetTools from "./networking";
import * as StringBase from "./string-base";
import * as DOMBase from "./dom-base";
import * as Effect from "./effect";
import * as Masto from "./mastodon";
import * as Core from "./core";
import { siteCore, hasBeenRun } from "./core";
import { runFetch, log } from "./networking";
import { appendIsland, isMobile } from "./dom-base";
import * as Adjacent from "./adjacent";
import * as Biblio1 from "./desktop-biblio";
import * as Biblio2 from "./mobile-biblio";
import * as Reading from "./reading";
import * as Modal from "./modal";
import * as COOKIE from "./cookies";

// this file is only used in the webbuild
siteCore({}, document, location, window);
export { runFetch, log, hasBeenRun, appendIsland, isMobile };
