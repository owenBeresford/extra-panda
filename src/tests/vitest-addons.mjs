import { isFullstack } from "../dom-base";
// this would be hard to make as a TS module

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
 * @returns {void}
 */
export function enableGetEventListeners(dom) {
  const step1 = dom.getElementsByTagName("body")[0];
  let step2;
  try {
    step2 = Object.getPrototypeOf(
      Object.getPrototypeOf(Object.getPrototypeOf(step1)),
    );
  } catch (e) {
    throw new Error("KLAXON! KLAXON! [1] the sky is falling");
  }

  // this should be an Element type.
  if (step2.constructor.name !== "Element") {
    throw new Error("KLAXON! KLAXON! [2] the sky is falling");
  }
  const step3 = Object.getPrototypeOf(step2);

  // save the original methods before overwriting them
  step3._addEventListener = step2.addEventListener;
  step3._removeEventListener = step2.removeEventListener;

  /**
   * An alternate implementation of addEventListener, so there is an inline spy
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener]
   * @param {string} type
   * @param {Function} listener
   * @param {boolean =false} useCapture
   * @public
   * @returns {void}
   */
  step3.addEventListener = function (type, listener, useCapture = false) {
    this._addEventListener(type, listener, useCapture);
    if (!this.eventListenerList) {
      this.eventListenerList = {};
    }
    if (!this.eventListenerList[type]) {
      this.eventListenerList[type] = [];
    }

    this.eventListenerList[type].push({
      type,
      listener,
      useCapture,
      id: "" + this.id,
    });
  };

  /**
   * An alternate implementation of removeEventListener, so there is an inline spy
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener]
   * @param {string} type
   * @param {Function} listener
   * @param {boolean =false} useCapture
   * @public
   * @returns {void}
   */
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

  /**
 * Return a copy of currently registered eventListeners
 
 * @param {string|undefined} type
 * @public
 * @returns {Array<Function>|Object} - depending if param is supplied, what output format
 */
  step3.getEventListeners = function (type) {
    if (!this.eventListenerList) {
      this.eventListenerList = {};
    }

    if (type === undefined) {
      let ret = [];
      for (let i in this.eventListenerList) {
        ret.push(...this.eventListenerList[i]);
      }
      return ret;
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
 * @returns {MiscEvent}
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
  } else {
    vnt = dom.createEvent("MouseEvent", { bubbles: false, cancelable: true });
    //		vnt.initTouchEvent('touchstart');  // from old docs, not supported
  }
   Object.defineProperty(vnt, "target", { writable: false, 
		enumerable: true,
		configurable: false,
value: tar });

  return vnt;
}

/**
// A type for keyboard events
//       yes I'm writing TS, oops
export interface Keyable {
	code:	string,
	altKey: boolean,
	shiftKey: boolean,
	ctrlKey: boolean,
};
*/

/**
 * createKeyEvent
 * A wrapper to create keyboard events
 
 * @param {Keyable }    keys
 * @param {HTMLElement} ele
 * @param {Window}      win
 * @public
 * @returns {Keyboardevent }
 */
export function createKeyEvent(keys, ele, win) {
  // I hope the target is still present after type washing
  let vnt = new KeyboardEvent("keydown", {
    altKey: keys.altKey ?? false,
    shiftKey: keys.shiftKey ?? false,
    ctrlKey: keys.ctrlKey ?? false,
    code: keys.code,
    key: keys.key,
    charCode: keys.key.charCodeAt(0),
    keyCode: keys.key.charCodeAt(0),
  });
  return vnt;
}
