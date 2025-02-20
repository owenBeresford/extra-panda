import { delay } from "../networking";
import { log, domLog } from "../log-services";
import { appendIsland } from "../dom-base";
import { test_name } from "../string-base";
import type {PageGeneration } from './page-seed-vite';

// import type {  } from 'jest-types';
type Actionable= (dom:Document, loc:Location, win:Window)=>Promise<void>; 

// this is jest-circus run method,. but i can't find an exported typedef.
type RunType   =  ()=>Promise<Array<object>>;


let SHOULD_CLOSE:number = 1;

/**
 * page
 * Build a real browser tab to run with tests
 
 * @param {string =''} url - thou shalt pass a relevant URL for the test, as it is used
 * @param {number =1} args - 1=dom, 2= +loc, 3= +win 4= +the browser global 
 * @public
 * @returns {Array<things>} - see args arg above.
 */
export async function page(url:string = "", args:number = 1):Promise<Array<PageGeneration >> {
	if(args>4 ) { 
		throw new Error("Bad data"); 
	}

 	if (typeof window !== "object") {
		throw new Error("Bad data"); 
	}

  const name:string = test_name(args);
  const tmp:WindowProxy = window.open(url, name);

  await delay(1000); // or the HTML hasn't parsed in the new window
  if (tmp.window.document.body.length < 200) {
    log("error", "New browser tab has gone wrong.");
    // To make execution time consistent, this has been disabled
    //    tmp.window.reload();
    //    return page_local(url, args);
  }
  tmp.window.TEST_TAB_NAME = name;
  if (args === 1) {
    return [tmp.window.document];
  } else if (args === 2) {
    return [tmp.window.document, tmp.window.document.location];
  } else if (args === 3) {
    return [tmp.window.document, tmp.window.document.location, tmp.window];
  } else if (args === 4) {
    return [tmp.window.document, tmp.window.document.location, tmp.window, tmp];
  }
}

/**
 * wrap
 * Supply try catch, test name and window management so tests are simpler
 
 * @param {string} name
 * @param {string} url
 * @param { Actionable } action
 * @public
 * @returns {void}
 */
export async function wrap(name:string, url:string, action:Actionable):Promise<void> {
  let dom:Document, loc:Location, win:Window;
  try {
    const LOG_PADDING:string = "**********************************************";
    [dom, loc, win] = await page(url, 3);
    win.console.log(
      LOG_PADDING + "\nthis is tab " + win.TEST_TAB_NAME + "\n" + LOG_PADDING,
    );
    dom.title = win.TEST_TAB_NAME;
    await action(dom, loc, win);

    domLog(
      win.TEST_TAB_NAME + " " + name + " [PASS]- no exceptions",
      false,
      false,
    );
  } catch (e) {
    domLog(
      win.TEST_TAB_NAME + " " + name + " [FAIL], see console for error details",
      true,
      false,
    );
    win.console.log(" ERROR TRAPT ", e.message, "\n", e.stack);

    console.log(win.TEST_TAB_NAME + " ERROR TRAPT ", e.message, "\n", e.stack);
// Some messages are fed back into the callstack, so the unit-test code will report correctly.
    if (e.message.match(/expect\(received\)/)) {
      throw e;
    }
    if (e.message.match(/Failed to fetch dynamically imported module/)) {
      throw e;
    }
  }
// cunning auto-close
  if (SHOULD_CLOSE && win && win.close) {
    win.close();
  }
  console.log("end of wrap", new Date());
}

/**
 * execTest
 * The end of the browser test files
 * WARN: Only run in test browser instance
 
 * @param {Function} run - imported from jest-lite in the main test file 
 * @public
 * @returns {void}
 */
export async function execTest(run:RunType):Promise<void> {
  const tt = new URLSearchParams(location.search);
  if (tt.has("close") && tt.get("close") === "0") {
    domLog("browser tabs will NOT auto-close", false, false);
    SHOULD_CLOSE = 0;
  } else {
    domLog("browser tabs should auto-close", false, false);
  }

  document.querySelector("#binLog").setAttribute("data-status", "busy");
  const ret = await run({ silent: false });
  document.querySelector("#binLog").setAttribute("data-status", "done");
  if (
    ret.length &&
    ret[0].errors.length &&
    ret[0].errors[0].match("Exceeded timeout")
  ) {
    domLog("" + ret[0].errors[0], false, false);
  }
  let nom = tt.get("test");
  nom = nom.substr(0, nom.indexOf("."));

  ret.push({ name: "BROWSER TEST " + nom, last: true });
  appendIsland("#binLog", JSON.stringify(ret), document);
}


