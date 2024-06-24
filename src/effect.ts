/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { Document, HTMLAnchorElement, HTMLElement } from "jsdom";
// import { log, debug } from "./code-collection";
import { appendIsland } from "./dom-base";
import { pullout } from "./string-base";

/**
 * addOctoCats
 * Convert links labelled 'git' to the github logo
 *
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
export function addOctoCats(dom: Document = document): void {
  dom.querySelectorAll("article a").forEach(function (
    a: HTMLAnchorElement,
  ): void {
    const tmp = pullout(a);
    if (tmp.trim().toLowerCase() === "git") {
      a.textContent = "";
      appendIsland(a, '<i class="fa fa-github" aria-hidden="true"></i>', dom);
      a.setAttribute("title", "Link to a github project.");
    }
  });
}

/**
 * addBooks
 * Convert links labelled 'docs' to an open book logo
 *
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
export function addBooks(dom: Document = document): void {
  dom.querySelectorAll("article a").forEach(function (a: HTMLAnchorElement) {
    const tmp = pullout(a);
    if (tmp.trim().toLowerCase() === "docs") {
      a.textContent = "";
      appendIsland(
        a,
        '<i class="fa fa-book-open" aria-hidden="true"></i>',
        dom,
      );
      a.setAttribute(
        "title",
        "Link to the project docs; it may be a git page, or a separate webpage. ",
      );
    }
  });
}

/**
 * addBashSamples
 * Convert backticks to code blocks, markup distorted C 1line comments to actual C 1line comments
 *
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
export function addBashSamples(dom: Document = document): void {
  const r1 = new RegExp("`([^`]+)`", "g");
  const r2 = new RegExp("/ /", "g");
  const bash: Array<HTMLElement> = dom.querySelectorAll(".addBashSamples");

  if (bash.length > 0) {
    for (let i = 0; i < bash.length; i++) {
      bash[i].innerHTML = bash[i].innerHTML
        .replaceAll(
          r1,
          '<code class="bashSample" title="Quote from a bash; will add copy button">$1</code>',
        )
        .replaceAll(r2, "//");
    }
  }
}

/**
 * addFancyButtonArrow
 * Markup buttons as a big arrow.
 * Maybe at some point refactor into addLeftArrow, addRightArrow
 *
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
export function addFancyButtonArrow(dom: Document = document): void {
  const aa: Array<HTMLElement> = dom.querySelectorAll(".addArrow");
  for (let i = 0; i < aa.length; i++) {
    appendIsland(
      aa[i].parentElement,
      '<i class="fa fa-play specialPointer " aria-hidden="true"></i>',
      dom,
    );
  }
}

/////////////////////////////////////////////////////// testing /////////////////////////////////////////////////

/**
 * Only use for testing, it allows access to the entire API
 */
export const TEST_ONLY = {
  addOctoCats,
  addBooks,
  addBashSamples,
  addFancyButtonArrow,
};
