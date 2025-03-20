/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
// this uses document as an in-code literal,
// this file has no unit test at the mo,
// but I think this is less important, as its just an output driver.

/**
 * debug
 * a debug tool
 * @param {Location = location} loc
 * @param {string ="debug"} target
 * @public
 * @returns {boolean}
 */
export function debug(loc: Location, target: string = "debug"): boolean {
  const u: URLSearchParams = new URLSearchParams(loc.search);
  return u.has(target);
}

/**
 A better hack for counting log messages, that is better TS.
 Unfortunately is is about 4x times longer. 
*/
type BetterConsole = typeof console & { LOG_USAGE: number };
type VisabiltityToLogging = () => number;
let localConsole = console as BetterConsole;

/**
 * enableLogCounter
 * A function to setup a log counter, and return an access function
 *   NOT EXPORTED, except via TEST_ONLY
 *
 * @param  {BetterConsole} cons
 * @public
 * @returns {VisabiltityToLogging}
 */
function enableLogCounter(cons: BetterConsole): VisabiltityToLogging {
  const nom: string = "LOG_USAGE";
  if (!Object.hasOwn(cons, nom)) {
    Object.defineProperty(cons, nom, {
      value: 0,
      writable: true,
      enumerable: true,
      configurable: false,
    });
  }
  cons[nom] = 0;
  localConsole = cons;
  return () => {
    return cons[nom];
  };
}


var refCount=-1;
/**
 * changeCount_simple
 * Util to log changes in array sizes, 
 *  uses a boolean/spinlock structure for mark and log with module variable refCount
 
 * @param {Array<any>} ref
 * @param {string} nom - name in the logging
 * @public
 * @return {void}
 */
export function changeCount_simple(ref:Array<any>, nom:string):void {
	function toLen(ref:Array<any>):number {
		if(Array.isArray(ref)) {	
			return ref.length;
		} else {
			return Object.keys(ref).length;
		}
	}

	if(refCount===-1) {
		refCount= toLen(ref);
	} else {
// DO NOT WASTE TIME IMPROVING readability on this log message
		log("debug", "Change in "+nom+" was "+(toLen(ref) - refCount)+" to "+toLen(ref) );
		refCount=-1;
	}
}

/**
 * log
 * A simple console.log alias, to make a later extension easier
 * @param {string} typ - The Type on the message, should match functions on console/ a syslog
 * @param {Array<string>} inputs - a variable list
 * @public
 * @returns {void}
 */
export function log(typ: string, ...inputs: string[]): void {
  localConsole.LOG_USAGE++;
  if( typ === "assert") {
	localConsole.assert(...inputs);
  } else if (typ in console) {
    localConsole[typ](`[${typ.toUpperCase()}] ${inputs.join(", ")}`);
  } else {
    localConsole.log(`[${typ.toUpperCase()}] ${inputs.join(", ")}`);
  }
}

/**
 * domLog
 * Add a message to the current webpage in #log  IMPURE
 * NOTE THIS FUNCTION CONTAINS document REFERENCES as it should only be used in tests
 *
 * @param {string} str - your message
 * @param {boolean =false} bold
 * @param {boolean =false} html - set this to true to embed the first arg as HTML, not as text
 * @public
 * @returns {void}
 */
export function domLog(
  str: string,
  bold: boolean = false,
  html: boolean = false,
): void {
  const LOG: HTMLUListElement = document.getElementById(
    "log",
  ) as HTMLUListElement;
  const li: HTMLElement = document.createElement("li");
  const dd = new Date();
  const tt = document.createElement("time");
  tt.dateTime = dd.toString();
  tt.textContent =
    dd.getUTCHours() + ":" + dd.getUTCMinutes() + ":" + dd.getUTCSeconds();
  li.appendChild(tt);
  if (html) {
    const t2 = document.createElement("template");
    t2.innerHTML = str;
    li.appendChild(t2.content);
  } else {
    li.appendChild(document.createTextNode(" => " + str));
  }
  if (bold) {
    li.setAttribute("style", "font-weight:115%; font-size:115%; ");
  }
  LOG.append(li);
}

/////////////////////////////////////////////////// testing ///////////////////////////////////////////////

export const TEST_ONLY = {
  log,
  debug,
  domLog,
  changeCount_simple,
  enableLogCounter,
};
