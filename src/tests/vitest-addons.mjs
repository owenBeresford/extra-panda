import { isFullstack } from "../dom-base";
("use strict");

/**
 * enableGetEventListeners
 * Monkey patch a getEventListener() method into HTMLElement, *inside ES2020*

// "Kunning haX0r" as I am not using a real browser DOM in tests,
// which are the only location or use for this code
// this code is NPM package getEventListeners, but here, is packed as a module, and ES2020
// I have tweaked the access to use structures from the DOM I pass in, 
//     so it is more likely to affect the JSDOM or the browser DOM

 * @param {Document =document} dom
 * @public
 * @return {void}
 */
export function enableGetEventListeners(dom = document) {
  const step1 = dom.getElementsByTagName("body")[0];
  const step2 = Object.getPrototypeOf(
    Object.getPrototypeOf(Object.getPrototypeOf(step1)),
  );
  // this should be an Element type.
  if (step2.constructor.name !== "Element") {
    throw new Error("KLAXON! KLAXON! the sky is falling");
  }
  const step3 = Object.getPrototypeOf(step2);

  // save the original methods before overwriting them
  step3._addEventListener = step2.addEventListener;
  step3._removeEventListener = step2.removeEventListener;

  step3.addEventListener = function (type, listener, useCapture = false) {
    this._addEventListener(type, listener, useCapture);

    if (!this.eventListenerList) {
      this.eventListenerList = {};
    }
    if (!this.eventListenerList[type]) {
      this.eventListenerList[type] = [];
    }

    this.eventListenerList[type].push({ type, listener, useCapture });
  };

  step3.removeEventListener = function (type, listener, useCapture = false) {
    this._removeEventListener(type, listener, useCapture);

    if (!this.eventListenerList) {
      this.eventListenerList = {};
    }
    if (!this.eventListenerList[type]) {
      this.eventListenerList[type] = [];
    }

    for (let i = 0; i < this.eventListenerList[type].length; i++) {
      if (
        this.eventListenerList[type][i].listener === listener &&
        this.eventListenerList[type][i].useCapture === useCapture
      ) {
        this.eventListenerList[type].splice(i, 1);
        break;
      }
    }
    if (this.eventListenerList[type].length == 0) {
      delete this.eventListenerList[type];
    }
  };

  step3.getEventListeners = function (type) {
    if (!this.eventListenerList) {
      this.eventListenerList = {};
    }

    if (type === undefined) {
      return Object.values(this.eventListenerList);
    }
    return Object.values(this.eventListenerList[type]);
  };

  Object.setPrototypeOf(step2, step3);
}

/**
 * createEvent
 * Code to isolate the creation of artificial mouse events outside of Vue
 
 * @param {HTMLElement} tar - where the fake event is about
 * @param {Document}  dom
 * @param {Window} win - 
 * @public
 * @return {MiscEvent}
 */
export function createEvent(tar, dom, win) {
  let vnt = null;
  if (isFullstack(win)) {
    // I hope the target is still present after type washing
    vnt = new CustomEvent("click", {
      detail: "a special click",
      bubbles: false,
      cancelable: true,
    });
    Object.defineProperty(vnt, "target", { writable: false, value: tar });
  } else {
    vnt = dom.createEvent("TouchEvent", { bubbles: false, cancelable: true });
    Object.defineProperty(vnt, "target", { writable: false, value: tar });
    //		vnt.initTouchEvent('touchstart');  // from old docs, not supported
  }
  return vnt;
}
