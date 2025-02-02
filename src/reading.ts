/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import { debug, log } from "./networking";
import { appendIsland } from "./dom-base";
import { pullout, standardisedWordCount } from "./string-base";
import type { ReadingProps } from "./all-types";

/**
 * extract
 * I may move this responsibility to another file, this func is obvious
 *
 * @param {string} get
 * @param {Document} dom
 * @public
 * @returns {number}
 */
function extract(get: string, dom: Document): number {
  let ret = 0;
  dom.querySelectorAll(get).forEach(function (a: HTMLElement) {
    ret += standardisedWordCount(pullout(a));
  });
  return ret;
}

/**
 * readingDuration
 * A function to count readable words in the current DOM, and compute expected reading time.
 *
 * Note: conversion to minutes is still hard coded, mostly as I cannot see value in other formats.
 * @param {ReadingProps} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @returns {void}
 */
export function readingDuration(
  opts: ReadingProps,
  dom: Document,
  loc: Location,
): void {
  const options = Object.assign(
    {},
    {
      timeFormat: "m",
      dataLocation: ".blocker",
      target: "#shareGroup",
      wordPerMin: 275,
      codeSelector: "code",
      refresh: false,
      debug: debug(loc),
    },
    opts,
  ) as ReadingProps;
  // I would like to move this into the config
  const IMAGE_SEARCH =
    options.dataLocation +
    " img, " +
    options.dataLocation +
    " picture, " +
    options.dataLocation +
    " object";

  const plain: number = extract(options.dataLocation, dom);
  if (!plain) {
    return;
  }

  let code = 0;
  if (options.codeSelector) {
    code += extract(options.codeSelector, dom);
  }
  let duration: number =
    (plain - code) / options.wordPerMin +
    dom.querySelectorAll(IMAGE_SEARCH).length * 5 +
    (code * 2) / options.wordPerMin;
  if (duration < 1) {
    log("info", "No reading time displayed for this article");
    return;
  }

  if (options.refresh) {
    const tt = dom.querySelector(options.target + " a.reading");
    if (tt) {
      tt.parentNode.removeChild(tt);
    }
  }

  duration = Math.round(duration);
  const h1 =
    '<a class="reading" title="The text is ' +
    (code + plain) +
    ' normalised words long.  Link is a longer version of this reading guide guesstimate." href="/resource/jQuery-reading-duration">To read: ' +
    duration +
    options.timeFormat +
    "</a>";
  appendIsland(options.target, h1, dom);
}

/////////////////////////////////////////////// testing ////////////////////////////////////////////
// injectOpts not needed, only 1 function
/* access to functions for unit tests */

export const TEST_ONLY = { readingDuration, extract };
