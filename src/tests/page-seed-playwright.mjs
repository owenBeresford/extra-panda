import { delay, } from "../networking";
import { log, domLog } from "../log-services";
import { appendIsland } from "../dom-base";
import { test_name } from "../string-base";

let SHOULD_CLOSE = 1;
/**
 * page
 * Build a fake browser to run with tests
 
 * @param {string =''} url - thou shalt pass a relevant URL for the test, as it is used
 * @param {number =1} args - 1=dom, 2= +loc, 3= +win
 * @public
 * @returns {Array<things>} - see args arg above.
 */
export async function page(url = "", args = 1) {
  if (typeof window === "object" && args < 5) {
    return await page_local(url, args);
  } else if (args < 5) {
    return page_fake(url, args);
  }
  throw new Error("Bad data");
}

/**
 * page_local
 * Create a new tab inside a browser
 
 * @param {string =""} url
 * @param {number =1} args 
 * @public
 * @returns {Array} - many types of object
 */
async function page_local(url = "", args = 1) {
  const name = test_name(args);
  const tmp = window.open(url, name);

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
 * page_fake
 * Create a new tab inside JSDOM
 
 * @param {string =""} url
 * @param {number =1} args 
 * @public
 * @returns {Array} - of many types of object
 */
function page_fake(url = "", args = 1) {
  return [];
}

/**
 * wrap
 * Supply try catch, test name and window management so tests are simpler
 
 * @param {string} name
 * @param {string} url
 * @param { (dom, loc, win)=>void } action
 * @public
 * @returns {void}
 */
export async function wrap(name, url, action) {
  let dom, loc, win;
  try {
    const LOG_PADDING = "**********************************************";
    [dom, loc, win] = await page_local(url, 3);
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
    if (e.message.match(/expect\(received\)/)) {
      throw e;
    }
    if (e.message.match(/Failed to fetch dynamically imported module/)) {
      throw e;
    }
  }
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
export async function execTest(run) {
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

/**
 * validateHTML
 * Build 1 code to check HTML

 * @see ["Using validate.org API" https://html-validate.org/dev/using-api.html]
 * @param {string} html
 * @param {boolean} emit
 * @public
 * @returns {Array<string>}
 */
export async function validateHTML(html) {
  // I would like some process to listen to HTML errors in the browser
  return [];
}
