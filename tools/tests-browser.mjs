/**
Some extra tests that do not run in Node
* that is a lot of extra effort, why?
   # unified output, to make automation easier
   # test with CSS executed
   # test with view-port sizes that work
   # able to test Js features that only run on HTTPS

* have pre-compiled unit tests into a JS bundle
* add runtime file so single chrome instance is started
* start chromium process      /snap/sbin/chromium --user-data-dir=/tmp/js-test --remote-debugging-port 9222 
* start https on local host instance
* start playwright process inside node
* tell browser to open local static file, which loads JS unit test
* grab test output

// https://gist.github.com/cmalven/1885287
// https://medium.com/@rihem.larbi/how-to-create-an-ssl-certificate-to-securely-access-a-nestjs-backend-app-using-https-c441cc39c6b5
// https://www.jvt.me/posts/2023/09/30/playwright-use-existing-session/
// https://dev.to/sonyarianto/how-to-use-playwright-with-externalexisting-chrome-4nf1
// chromium $new_profile_command --remote-debugging-port 9222 
// https://github.com/sonyarianto/playwright-using-external-chrome

      // https://stackoverflow.com/questions/61453673/how-to-get-a-collection-of-elements-with-playwright
      // https://hatchjs.com/playwright-get-text-of-element/
      // https://playwright.dev/docs/locators
      // https://playwright.dev/docs/api/class-framelocator#frame-locator-get-by-text

// IOIO port to TS, its too complex

*/
import { spawn } from "node:child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, basename } from "path";
import fs from "node:fs";
import https from "https";

import { chromium } from "playwright";
import { expect } from "@playwright/test";
import express from "express";

/**
There is only 1 cmd arg to this script at present.
  --no-close or --close

if more are added see command-line-args
@see [https://www.npmjs.com/package/command-line-args]
*/
const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = basename(fileURLToPath(import.meta.url));
const TESTS = [
  "modal.webtest.mjs",
  "tabs.webtest.mjs",
  "cookie.webtest.mjs",
  "desktop-biblio.webtest.mjs",
  "dom-base.webtest.mjs",
  "networking.webtest.mjs",
  "index.webtest.mjs",
];
const PORT_DEBUG = 9222;
const PORT_SERVER = 8081;
const URL_SERVER = "127.0.0.1";
const BROWSER = [
  // https://peter.sh/experiments/chromium-command-line-switches/
  // The above list is assembled from source code analysis, an is updated automatically frequently
  "/snap/bin/chromium",
  // This flag is being ignored
  "--user-data-dir=/tmp/js-test",
  "--profile-create-if-missing",
  "--remote-debugging-port=" + PORT_DEBUG,
  // add no empty window
  // these two flags have been removed
  "--ignore-certificate-errors",
  "--test-type=webdriver",
  "--allow-insecure-localhost",
  "--mute-audio",
  "--disable-popup-blocking",
  "--disable-login-animations",
  "--disable-default-apps",
  "--unsafely-disable-devtools-self-xss-warnings",
  // lots of excited press about this 3 y ago,
  // setting this stops the JS executing
  //	"--auto-open-devtools-for-tabs",
  // this fake flag is also being ignored
  "--ignore-this",
];

const DIR_TESTS = path.join(__dirname, "..", "dist", "tests");
const DIR_FIXTURES = path.join(__dirname, "..", "src", "fixtures");
const CERT_NAME = DIR_FIXTURES + path.sep + "cert.pem";
const CERT_KEY = DIR_FIXTURES + path.sep + "private.key";
// cert.pem  csr.pem  index.html  ob1.min.css  private.key
var dDelta = 0;

/**
 * spinup_server
 * A function to start a Node/Express process to host test files
 
 * @protected
 * @returns {Array} - [null, ()=>void ]
 */
function spinup_server() {
  const credentials = {
    key: fs.readFileSync(CERT_KEY),
    cert: fs.readFileSync(CERT_NAME),
  };

  const app = express();
  const sock = https.createServer(credentials, app);

  app.get("/", function (req, res) {
    let tt = fs.readFileSync(path.join(DIR_FIXTURES, "index.html"));
    tt = Buffer.from(tt).toString();
    if (!("test" in req.query)) {
      res
        .status(404)
        .send("You need to include a unit test to run via test param.");
      return;
    }
    tt = tt.replace(
      /MARKER1/,
      "https://" +
        URL_SERVER +
        ":" +
        PORT_SERVER +
        "/scripts/" +
        req.query.test,
    );
    res.status(200);
    res.append("content-type", "text/html; encoding= utf8");
    res.send(tt);
  });

  app.get("/home.html", function (req, res) {
    res.sendFile(path.join(DIR_FIXTURES, "home.html"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  });
  app.get("/home2.html", function (req, res) {
    res.sendFile(path.join(DIR_FIXTURES, "home2.html"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  });

  app.get("/domposition.html", function (req, res) {
    res.sendFile(path.join(DIR_FIXTURES, "domposition.html"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  });

  app.get("/asset/ob1-202406.min.mjs", function (req, res) {
    res.sendFile(path.join(DIR_FIXTURES, "ob1-202406.min.mjs"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/javascript;charset=UTF-8" },
    });
  });

  app.get("/asset/ob1.min.css", function (req, res) {
    res.sendFile(path.join(DIR_FIXTURES, "ob1.min.css"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/css;charset=UTF-8" },
    });
  });

  app.get("/scripts/:nom", function (req, res) {
    let detect = fs.statSync(path.join(DIR_TESTS, req.params.nom), {
      throwIfNoEntry: false,
    });
    if (detect && !detect.isFile()) {
      return res.status(404).send("Unknown file " + req.params.nom);
    }
    res.sendFile(path.join(DIR_TESTS, req.params.nom), {
      headers: { "Content-Type": "text/javascript; charset=UTF-8" },
    });
  });

  sock.listen(PORT_SERVER, URL_SERVER, () => {
    console.log(
      "[INFO] Fixture server  https://" +
        URL_SERVER +
        ":" +
        PORT_SERVER +
        "/ with a local PID of " +
        process.pid,
    );
  });
  const closeServer = () => {
    sock.close();
  };
  // Could return the socket, but not sure this would help anything
  return [null, closeServer];
}

/**
 * spinup_playwright
 * A function to generate "Node access" to the browser 
 
 * @protected
 * @param {string} debug_url
 * @returns {Array} - [playwright.Context, ()=>void ]
 */
async function spinup_playwright(debug_url) {
  // debug channel, not test node web service
  const DBG = await chromium.connectOverCDP(debug_url);
  if (!DBG.isConnected()) {
    throw new Error("Can't connect to captive browser");
  }
  const CTX = DBG.contexts();
  if (CTX.length < 1) {
    throw new Error("Can't connect to captive browser (contexts)");
  }
  console.log(
    `[INFO] In process ${process.pid}, Playwright admin via ` + debug_url,
  );

  const ctx = CTX[0];
  const closure = async () => {
    await ctx.close();
    await DBG.close();
  };
  return [ctx, closure];
}

/**
 * spinup_browser
 * A //fairly// generic shell exec replacement, with a watch on stdout
// sample:
// DevTools listening on ws://127.0.0.1:9222/devtools/browser/59522268-ee60-43ba-b277-eab59f915f65
 
 * @param {Array<string>} cmd
 * @param {(str)=>void } onSocket
 * @protected
 * @returns {Array} - [PID of child, ()=>void]
 */
async function spinup_browser(cmd, onSocket) {
  let buf = "",
    found = false;
  const READ = (data) => {
    // being cautious on line buffering:
    buf += data;
    let tmp = buf.split("\n");
    for (let i = 0; i < tmp.length; i++) {
      if (!found && tmp[i].match(/^DevTools listening on /)) {
        onSocket(tmp[i].match(/^DevTools listening on ([^ ]+)$/)[1]);
        found = true;
      }
    }
  };
  const READ_ERR = (data) => {
    console.log("[PASS-BACK] Child process said: " + data);
    console.log("outer running process has got the debug socket? " + found);
  };

  const CHILD = await spawn(BROWSER[0], BROWSER.slice(1, BROWSER.length - 1), {
    detached: true,
    shell: false,
  });
  const PID = CHILD.pid;
  CHILD.stdout.setEncoding("utf8");
  CHILD.stderr.setEncoding("utf8");
  CHILD.stdout.on("data", READ_ERR);
  CHILD.stderr.on("data", READ);
  CHILD.on("error", (err) => {
    console.log(`[PASS-BACK] CHILD ${PID} errored with ` + err.message);
    throw err;
  });
  CHILD.on("close", (code) => {
    if (code !== 0) {
      console.log(`[PASS-BACK] CHILD ${PID} exited with code ${code}`);
      // maybe make an exception
    }
    CHILD.stdin.end();
    if (dDelta === 0) {
      console.log(`[PASS-BACK] CHILD ${PID} exited `);
      throw new Error("Browser was closed by a human");
    }
  });
  console.log("[INFO] Created a browser instance with " + CHILD.pid);

  const closure = () => {
    if (!CHILD.killed) {
      CHILD.kill();
    }
  };
  return [CHILD.pid, closure];
}

/**
 * delay ~ borrowed from another project, a blocking sleep() in JS
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((good) => setTimeout(good, ms));
}

/**
 * should_close_tabs()
 * Map for flags to close the test tabs. 
 * Not doing so means that humans can read the outcomes, but its litter. 
 
 * @param {Array<string>} args - suggest pass process.argv
 * @protected
 * @returns {number} - return 1 or 0
 */
function should_close_tabs(args) {
  let close = 1;
  if (args.includes("--close")) {
    close = 1;
  }
  if (args.includes("--no-close")) {
    close = 0;
  }
  return close;
}

/**
 * getMethods
 * Return the methods that are in the current object, and not inherited
 
 * @see [https://stackoverflow.com/questions/2257993/how-to-display-all-methods-of-an-object]
 * @param {Object} o - this is whatever type it is.  BUT MUST BE AN OBJECT
 * @protected
 * @returns {Array<strings>}
 */
function getMethods(o) {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(o)).filter(
    (m) => "function" === typeof o[m],
  );
}

/**
 * JSON2logging
 * Just a custom dump function to look like vitest/ jest. 
 * Prints to console
 
 * @param {string} json1
 * @protected
 * @returns {void} 
 */
function JSON2logging(json1) {
  let tmp = JSON.parse(json1.trim());
  tmp = Array.from(tmp); // as Array;
  const LEN = tmp.length - 1;
  let title = tmp[LEN];
  console.log("   ✓ " + title.name);

  for (let i = 0; i < LEN; i++) {
    let cur = tmp[i];
    console.log(
      "     ✓ " +
        cur.testPath[2].padEnd(30, " ") +
        " [" +
        cur.status.toUpperCase() +
        "] [" +
        cur.duration +
        "ms]",
    );
  }
}

/**
 * browser2json
 * Attempt to map the playwright object to a HTMLIsland, in the Node process
 * This throws in quite a few places
 
 * @param {Some playwright structure} page
 * @param {number} weight - REMOVED how many test tabs do you have?
 * @throws if data isn't in correct shape
 * @protected
 * @returns {string}
 */
async function browser2json(page) {
  const tt1 = await page.getByTestId("status");
  const sz = await tt1.count();

  if (sz > 0) {
    if (sz > 1) {
      throw new Error("Result block not found");
    }

    //    await page.bringToFront();
    console.log(
      "[INFO] Sleeping as DOM data extraction from test tab is laggy",
    );
    // use this in next iteration
    // let ignored = await tt1.all();
    await expect(tt1).toHaveAttribute("data-status", "done", {
      timeout: 30_000,
    });
    console.log("[INFO] wakeup (hopefully brower execution is done)");

    const json1 = await tt1.textContent();
    //  const json1 = await page.innerText("pre");
    //			testResults = await page.content();
    //			let slice=testResults.match(new RegExp("<pre[^>]*>([^<]*)</pre>", 'mi'));
    //console.log("SDFSDFSDF "+ new Date(),  slice);

    if (json1.length < 5) {
      throw new Error("EMPTY Result block found");
    }
    return json1;
  }
  throw new Error("Logic error, ask a dev");
}

/**
 * runTests - a wrapper to make code tidier
 *
 * @param {Array<strings>} tests
 * @protected
 * @returns {void}
 */
export async function runTests(tests) {
  console.log(
    "[INFO] This suite takes about 1m to exec on a normal PC.  Opens many tabs in Chrome",
  );
  try {
    let dburl = "";
    const grab = (data) => {
      dburl = data;
    };
    const [CHILD, end0] = await spinup_browser(BROWSER, grab);
    const [ignored, end1] = spinup_server();
    await delay(2000);
    // loading chrome on this fairly fast machine takes more than 1s,
    // there is a chrome that I am using already loaded, could be account creation being slow
    if (dburl === "") {
      throw new Error("IO tangled, pls fix " + CHILD);
    }
    const [ctx, end2] = await spinup_playwright(dburl);
    for (let i in tests) {
      dDelta = 0;
      const tExist = fs.statSync(
        path.join(__dirname, "..", "dist", "tests", tests[i]),
      );
      if (!tExist.isFile()) {
        throw (
          new Error("Compile tests before trying to run " + tests[i]) +
          ".\nThis is 'npm run build:tests'."
        );
      }

      let page;
      if (i === "0") {
        // consume the empty page that chrome will start with
        [page] = await ctx.pages();
      } else {
        page = await ctx.newPage();
      }
      // using **https** localhost,
      // test server is to server a HTML file in 'GET /'
      let URL =
        "https://" +
        URL_SERVER +
        ":" +
        PORT_SERVER +
        "/?test=" +
        tests[i] +
        // append "&no-close=1" to stop the browser tabs being closed, so they can be examined
        "&close=" +
        should_close_tabs(process.argv);
      await page.goto(URL);
      let d1 = new Date();
      await delay(3000);
      let json1 = await browser2json(page);
      JSON2logging(json1);

      let d2 = new Date();
      dDelta = d2 - d1;
      await delay(100);
    }

    if (should_close_tabs(process.argv)) {
      end1();
      end0();
      end2();
    }
  } catch (e) {
    console.log(
      "\n\n[ERROR] browser tests ABORTED with " + e.message,
      e.stack,
      "\n\n",
    );
  }
}

/**
 * runDirectly
 * util function to make code more readable
 
 * @param {Object} p - alias for process
 * @public
 * @returns {boolean}
 */
function runDirectly(p) {
  // document.currentScript
  // meta.url
  // !("parent" in module)
  if (p && p.argv && p.argv.length > 1 && p.argv[1].includes(__filename)) {
    return true;
  }
  return false;
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  const TEXT = `
Script to be able to manage browser tests from bash.  I wanted to use vitest everywhere, but not possible today.
The default behaviour is to close the tabs and browser, as most test execution is automated.

supports:
	--help        ~ this text
	--no-close    ~ do //not// close the tabs, or the browser. Use to see what happens.
	--close       ~ for automated use, free() resources after use,  This is the default behaviour.  

`;
  console.log(TEXT);
  process.exit(0);
}

// this code is a test runner,
// but is too complex.  So I may need to put a test on it
// so this is safe to import as it doesn't auto execute
if (runDirectly(process)) {
  await runTests(TESTS);
}
