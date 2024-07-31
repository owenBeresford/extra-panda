/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { Document, HTMLAnchorElement, HTMLElement } from "jsdom";
// import { log, debug } from "./networking";
import { appendIsland } from "./dom-base";
import { pullout } from "./string-base";
import { applyDOMpostions } from "./desktop-biblio";
import { getArticleWidth } from "./dom-base";

/**
 * link2Txt
 * Generate link decorator sample from available data.
 *   PURE
 *
 * @param {string} url
 * @protected
 * @returns {string}
 */
function link2Txt(url: string): string {
  const adresse = new URL(url);
  let nom = "[anon dev]",
    titre = "";
  const datte = "[recent time]";
  const desc = "A Github project ~ text auto generated without scrapping.";
  if (adresse.username) {
    nom = adresse.username;
  }
  if (adresse.pathname) {
    const pièces = adresse.pathname.split("/");
    nom = pièces[1];
    titre = pièces[2];
  } else if (adresse.hostname.indexOf("github.io")) {
    const pièces = adresse.hostname.split(".");
    nom = pièces[0];
    titre = "The " + pièces[0] + " project";
  }
  return (
    "Reference popup for link [*]\n\n" +
    titre +
    "\n" +
    nom +
    " " +
    datte +
    "\n\n" +
    desc
  );
}

/**
 * addOctoCats
 * Convert links labelled 'git' to the github logo
 * @param {boolean} refs
 * @param {Document =document} dom
 * @public
 * @returns {void}
 */
export function addOctoCats(refs: boolean, dom: Document = document): void {
  const WIDTH: number = getArticleWidth(true, dom);

  dom.querySelectorAll("article a").forEach(function (
    a: HTMLAnchorElement,
  ): void {
    const tmp = pullout(a);
    if (tmp.trim().toLowerCase() === "git") {
      a.textContent = "";
      appendIsland(a, '<i class="fa fa-github" aria-hidden="true"></i>', dom);
      if (refs) {
        a.setAttribute("aria-label", link2Txt(a.getAttribute("href")));
        applyDOMpostions(a, WIDTH);
      } else {
        a.setAttribute("title", "Link to a github project.");
      }
    }
  });
}

/**
 * addBooks
 * Convert links labelled 'docs' to an open book logo
 * @param {boolean} refs
 * @param {Document =document} dom
 * @public
 * @returns {void}
 */
export function addBooks(refs: boolean, dom: Document = document): void {
  const WIDTH: number = getArticleWidth(true, dom);

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
        refs ? "aria-label" : "title",
        "Link to the project docs; it may be a git page, or a separate webpage. ",
      );
      if (refs) {
        applyDOMpostions(a, WIDTH);
      }
    }
  });
}

/**
 * addBashSamples
 * Convert backticks to code blocks, markup distorted C 1line comments to actual C 1line comments.
 * Security note: this is editing innerHTML, but only with static values set at authoring time.
 *
 * @param {Document =document} dom
 * @public
 * @returns {void}
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
 * @param {Document =document} dom
 * @public
 * @returns {void}
 */
export function addFancyButtonArrow(dom: Document = document): void {
  const aa: Array<HTMLElement> = dom.querySelectorAll(".addArrow");
  for (let i = 0; i < aa.length; i++) {
    appendIsland(
      aa[i].parentElement,
      '<i class="fa fa-play specialPointer" aria-hidden="true"></i>',
      dom,
    );
  }
}

/////////////////////////////////////////////////////// testing /////////////////////////////////////////////////

/**
 * Only use for testing, it allows access to the entire API
      no injectOpts needed here
 */
export const TEST_ONLY = {
  link2Txt,
  addOctoCats,
  addBooks,
  addBashSamples,
  addFancyButtonArrow,
};
