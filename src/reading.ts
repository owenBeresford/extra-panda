/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import { debug, log } from "./log-services";
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
  dom.querySelectorAll(get).forEach(function (a: Element) {
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
  const options: ReadingProps = Object.assign(
    {},
    {
      timeFormat: "m",
      dataLocation: ".blocker",
      target: "#shareGroup .SMshareWidget",
      wordPerMin: 275,
      codeSelector: "code",
      refresh: false,
      debug: debug(loc),
    } as ReadingProps,
    opts,
  ) as ReadingProps;
  // I would like to move this into the config
  const IMAGE_SEARCH =
    options.dataLocation +
    " img, " +
    options.dataLocation +
    " source, " +
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
    (code * 2) / options.wordPerMin;

	const IMGS:Array<string>= Array.from(
								new Set(
								Array.from(
								dom.querySelectorAll(IMAGE_SEARCH))
								.map(iter)
									)
									);
	duration += IMGS.length * 5;
  if (duration < 1) {
    log("info", "No reading time displayed for this article");
    return;
  }

  if (options.refresh) {
    const tt = dom.querySelector(options.target + " a.reading") as HTMLElement;
    if (tt) {
      (tt.parentNode as HTMLElement).removeChild(tt);
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

    /**
     * iter
     * An internal function to get the URL attribute, used in Array.map
 
     * @param {HTMLElement} ele
     * @param {number} i
     * @public
     * @returns {string}
     */
	function iter(ele:HTMLElement, i:number):string {
		switch(ele.tagName) {
		case 'IMG': return ele.getAttribute('src'); break;
		case 'OBJECT': return ele.getAttribute('data'); break;
		case 'SOURCE': return ele.getAttribute('srcset'); break;
		}
	} 

/////////////////////////////////////////////// testing ////////////////////////////////////////////
// injectOpts not needed, only 1 function
/* access to functions for unit tests */

export const TEST_ONLY = { readingDuration, extract };
