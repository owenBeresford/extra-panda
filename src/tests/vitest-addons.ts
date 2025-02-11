import { isFullstack } from "../dom-base";
import type { MiscEvent } from "../all-types";
// this would be hard to make as a TS module

// @see ["notes from TS angle" https://www.cgjennings.ca/articles/typescript-events/]
// @see ["all types of JS events" https://developer.mozilla.org/en-US/docs/Web/API/Event#introduction]
interface EventMap {
	"mousedown": MouseEvent;
	"keypressed":KeyboardEvent;
	"click": MouseEvent;
	"touch": TouchEvent;
//	"touch": GestureEvent | TouchEvent;
// 	InputEvent
};

type LocalEvent = (ev: EventMap[keyof EventMap]) => void;
type AdjustingHandlers = (type: keyof EventMap, listener:EventListener ) => void; 

interface EventLogEvent {
      type:keyof EventMap;
      listener:LocalEvent;
      useCapture:boolean;
      id: string;
}

type EventStack = Record<keyof EventMap, Array<EventLogEvent>>;

export interface Keyable {
	code:	string,
	altKey: boolean,
	shiftKey: boolean,
	ctrlKey: boolean,
};


type TestingElement = Element & {
		eventListenerList:EventStack,
		_addEventListener:AdjustingHandlers, 
		_removeEventListener:AdjustingHandlers,
		getEventListeners: (type:string|undefined)=> Array<EventLogEvent> 
							};
// reference from types for Node
//interface EventListener {
//    (evt: Event): void;
//}


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
export function enableGetEventListeners(dom:Document):void {
  const step1:HTMLBodyElement = dom.getElementsByTagName("body")[0];
  let step2:HTMLElement;
  try {
    step2 = Object.getPrototypeOf(
      Object.getPrototypeOf(Object.getPrototypeOf(step1)),
    );
  } catch (e:unknown) {
    throw new Error("KLAXON! KLAXON! [1] the sky is falling", e);
  }

  // this should be an Element type.
  if (step2.constructor.name !== "Element") {
    throw new Error("KLAXON! KLAXON! [2] the sky is falling");
  }
  const step3:TestingElement = Object.getPrototypeOf(step2);

  // save the original methods before overwriting them
  step3._addEventListener = step2.addEventListener;
  step3._removeEventListener = step2.removeEventListener;

  /**
   * An alternate implementation of addEventListener, so there is an inline spy
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener]
   * @param {keyof EventMap} type
   * @param {AdjustingHandlers} listener
   * @param {boolean =false} useCapture
   * @public
   * @returns {void}
   */
  step3.addEventListener = function (type:keyof EventMap, listener:EventListener, useCapture:boolean = false):void {
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
    } as EventLogEvent );
  };

  /**
   * An alternate implementation of removeEventListener, so there is an inline spy
   *
   * @see [https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener]
   * @param {string} type
   * @param {AdjustingHandlers} listener
   * @param {boolean =false} useCapture
   * @public
   * @returns {void}
   */
  step3.removeEventListener = function (type:keyof EventMap, listener:EventListener, useCapture:boolean = false):void {
    this._removeEventListener(type, listener, useCapture);
    if (!this.eventListenerList) {
      this.eventListenerList = {};
    }

    if (!this.eventListenerList[type]) {
      this.eventListenerList[type] = [];
    }

    for (let i:number = 0; i < this.eventListenerList[type].length; i++) {
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
 * @returns {Array<EventLogEvent>} - 
 */
  step3.getEventListeners = function (type:string|undefined):Array<EventLogEvent> {
    if (!this.eventListenerList) {
      this.eventListenerList = {};
    }

    if (type === undefined) {
      let ret:Array<EventLogEvent> = [];
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
 * @returns {MouseEvent}
 */
export function createEvent(tar:HTMLElement, dom:Document, win:Window):MouseEvent {
  let vnt:MouseEvent;
  if (isFullstack(win)) {
    // I hope the target is still present after type washing
    vnt = new MouseEvent("click", {    }) ;
  } else {
// for unit tests
    vnt = dom.createEvent("MouseEvent");
	vnt.initEvent("MouseEvent", false, true );
    //		vnt.initTouchEvent('touchstart');  // from old docs, not supported
  }

  Object.defineProperty(vnt, "target", {
    writable: false,
    enumerable: true,
    configurable: false,
    value: tar,
  });

  return vnt;
}

/**
 * createKeyEvent
 * A wrapper to create keyboard events
 
 * @param {Keyable }    keys
 * @param {HTMLElement} ele
 * @param {Window}      win
 * @public
 * @returns {Keyboardevent }
 */
export function createKeyEvent(keys:Keyable, ele:HTMLElement, win:Window):KeyboardEvent {
  // I hope the target is still present after type washing
  let vnt = new KeyboardEvent("keydown", {
    altKey: keys.altKey ?? false,
    shiftKey: keys.shiftKey ?? false,
    ctrlKey: keys.ctrlKey ?? false,
    code: keys.code,
    key: keys.code,
    charCode: keys.code.charCodeAt(0) as number,
    keyCode: keys.code.charCodeAt(0) as number,
  });
  return vnt;
}
