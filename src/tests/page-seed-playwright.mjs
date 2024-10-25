import { delay, log, domLog } from "../networking";
import { appendIsland } from "../dom-base";
import { test_name } from "../string-base";

let SHOULD_CLOSE = 1;
/**
 * page
 * Build a fake browser to run with tests
 
 * @param {string =''} url - thou shalt pass a relevant URL for the test, as it is used
 * @param {number =1} args - 1=dom, 2= +loc, 3= +win
 * @public
 * @return {Array<things>} - see args arg above.
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
 * @return {Array} - many types of object
 */
async function page_local(url = "", args = 1) {
  const name = test_name(args);
  const tmp = await window.open(url, name);

  await delay(1000);
  if (tmp.window.document.body.length < 200) {
    log("error", "New browser tab has gone wrong.");
    tmp.window.reload();
    return page_local(url, args);
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
 * @return {Array} - of many types of object
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
 * @return {Array} - of many types of object
 */
export async function wrap(name, url, action) {
  try {
    const LOG_PADDING = "**********************************************";
    const [dom, loc, win] = await page("https://127.0.0.1:8081/home.html", 3);
    win.console.log(
      LOG_PADDING + "\nthis is tab " + win.TEST_TAB_NAME + "\n" + LOG_PADDING,
    );
    dom.title = win.TEST_TAB_NAME;
    action(dom, loc, win);

    if (SHOULD_CLOSE) {
      win.close();
    }
    domLog(win.TEST_TAB_NAME + " " + name + " [PASS]", false, false);
  } catch (e) {
    domLog(win.TEST_TAB_NAME + " see console for error details", false, false);
    console.log(win.TEST_TAB_NAME + " ERROR TRAPT ", e.message, "\n", e.stack);
    if (SHOULD_CLOSE) {
      win.close();
    }
  }
}

/**
 * execTest
 * The end of the browser test files
 * WARN: Only run in test browser instance
 
 * @param {Function} run - imported from jest-lite in the main test file 
 * @public
 * @return {void}
 */
export async function execTest(run) {
  const tt = new URLSearchParams(location.search);
  if (tt.has("close") && tt.get("close") === "0") {
    domLog("browser tabs will NOT auto-close", false, false);
    SHOULD_CLOSE = 0;
  } else {
    domLog("browser tabs should auto-close", false, false);
  }

  const ret = await run();
  ret.push([{ name: "BROWSER TEST modal", last: true }]);
  appendIsland("#binLog", JSON.stringify(ret), document);
}

/**
 * validateHTML
 * Build 1 code to check HTML

 * @see ["Using validate.org API" https://html-validate.org/dev/using-api.html]
 * @param {string} html
 * @param {boolean} emit
 * @public
 * @return {Array<string>}
 */
export async function validateHTML(html) {
  // I would like some process to listen to HTML errors in the browser
  return [];
}
