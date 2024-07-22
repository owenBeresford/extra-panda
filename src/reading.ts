/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import { debug, log } from "./networking";
import { appendIsland } from "./dom-base";
import { pullout } from "./string-base";
import { ReadingProps } from "./all-types";

/**
 * readingDuration
 * A function to count readable words in the current DOM, and compute expected reading time.
 *
 * Note: conversion to minutes is still hard coded, mostly as I cannot see value in other formats.
 * @param {ReadingProps} opts
 * @param {Document =document} dom
 * @public
 * @returns {void}
 */
export function readingDuration(opts: ReadingProps, dom = document): void {
  const RE = /[ \t\n\r.(),~]/g;
  const options = Object.assign(
    {},
    {
      timeFormat: "m",
      dataLocation: ".blocker",
      target: "#shareGroup",
      wordPerMin: 275,
      codeSelector: "code",
      refresh: false,
      debug: debug(),
    },
    opts,
  ) as ReadingProps;
  // I would like to move this into the config
  const mm =
    options.dataLocation +
    " img, " +
    options.dataLocation +
    " picture, " +
    options.dataLocation +
    " object";
  const count: number = pullout(
    dom.querySelector(options.dataLocation) as HTMLElement,
  )
    .split(RE)
    .filter((n) => n).length;

  let duration: number = count / options.wordPerMin;
  duration += dom.querySelectorAll(mm).length / 5;

  if (options.codeSelector && dom.querySelectorAll(options.codeSelector)) {
    let tt = 0;
    dom.querySelectorAll(options.codeSelector).forEach(function (
      a: HTMLElement,
    ) {
      tt += pullout(a)
        .split(RE)
        .filter((n) => n).length;
    });
    if (tt) {
      duration += (tt * 3) / options.wordPerMin;
    }
  }
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
    '<a class="reading" title="See longer version of this reading guide." href="/resource/jQuery-reading-duration">To read: ' +
    duration +
    options.timeFormat +
    "</a>";
  appendIsland(options.target, h1, dom);
}

/////////////////////////////////////////////// testing ////////////////////////////////////////////
// injectOpts not needed, only 1 function
/* access to functions for unit tests */
export const TEST_ONLY = { readingDuration };
