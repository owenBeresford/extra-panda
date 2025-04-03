/**
=== What?
Some extra tests that do not run in Node

=== Why?
* that is a lot of extra effort, why?
   # unified output with the other vitest tests, to make automation easier
   # test with CSS executed
   # test with view-port sizes that work
   # able to test Js features that only run on HTTPS

=== How?
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
// node_modules/playwright/types/*
*/
import type { ServerOptions, Server } from "https";
import type { Express, Request as ERequest, Response as EResponse } from 'express';
import type { Page } from 'playwright';
import type { NodeJS } from '@types/node';
import type { Circus, Global } from '@jest/types';

const path = await import( "node:path");
const URL = await import ("node:url");
const __dirname = path.dirname(URL.fileURLToPath(import.meta.url));
const __filename = path.basename(URL.fileURLToPath(import.meta.url));

const PROC = await import("node:child_process");
const fs = await import("node:fs");
const https = await import("https");
const express = await import("express");

const { chromium } = await import("playwright");
const { expect } = await import( "@playwright/test");

console.log("looking for __dirname", process.version, import.meta, process.env.PWD );
/**
There is only 1 cmd arg to this script at present.
  --no-close or --close
  UPDATE and --extract-css

If more are added, see command-line-args
@see [https://www.npmjs.com/package/command-line-args]
*/

const TESTS:Readonly<Array<string>> = [
  "modal.webtest.mjs", // extend...
  "tabs.webtest.mjs",
  "cookie.webtest.mjs",	
	"desktop-biblio.webtest.mjs",
	"dom-base.webtest.mjs",
	"networking.webtest.mjs",
  "index.webtest.mjs",

] as Readonly<Array<string>>;
const PORT_DEBUG = 9222;
const PORT_SERVER = 8081;
const URL_SERVER = "127.0.0.1";
const BROWSER:Readonly<Array<string>> = [
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
  "--allow-running-insecure-content",
  "--unsafely-disable-devtools-self-xss-warnings",
  // --bwsi 
  // this fake flag is also being ignored
  "--ignore-this",
] as Readonly<Array<string>>;

type END_CB=()=>void;
type DEBUG_CHANNEL_CB=(s:string)=>void;
type Triggerage=any|END_CB;

/*
export type RunResult = {
  unhandledErrors: Array<FormattedError>;
  testResults: TestResults;
};
*/
type StatusBlock = [{ name:string, last:boolean }]; 
type TestResult = Circus.RunResult & StatusBlock;

const DIR_TESTS = path.join(__dirname, "..", "dist", "tests");
const DIR_FIXTURES = path.join(__dirname, "..", "src", "fixtures");
const DIR_FIXTURES2 = path.join(__dirname, "..", "src", "vis-tests");
const CERT_NAME = DIR_FIXTURES + path.sep + "cert.pem";
const CERT_KEY = DIR_FIXTURES + path.sep + "private.key";
let dDelta = 0;

/**
 * spinup_server
 * A function to start a Node/Express process to host test files
 
 * @protected
 * @returns {Array} - [null, ()=>void ]
 */
function spinup_server():Array<Triggerage> {
  const credentials:ServerOptions = {
    key: fs.readFileSync(CERT_KEY),
    cert: fs.readFileSync(CERT_NAME),
  } as Readonly<ServerOptions>; 

  const app:Express = express(); 
  const sock:Server<ERequest, EResponse> = https.createServer(credentials, app);

  app.use('/vis', express.static( DIR_FIXTURES2 , {dotfiles:"ignore", immutable:false, }));
  app.get("/", function (req:ERequest, res:EResponse):void {
    const tt1 = fs.readFileSync(path.join(DIR_FIXTURES, "index.html"));
    let tt2:string = Buffer.from(tt1).toString();
    if (!("test" in req.query)) {
      res
        .status(404)
        .send("You need to include a unit test to run via test param.");
      return;
    }
    tt2 = tt2.replace(
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
    res.send(tt2);
  });

  app.get("/home.html", function (req:ERequest, res:EResponse):void {
    res.sendFile(path.join(DIR_FIXTURES, "home.html"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  });

  app.get("/home2.html", function (req:ERequest, res:EResponse):void {
    res.sendFile(path.join(DIR_FIXTURES, "home2.html"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  });

  app.get("/domposition.html", function (req:ERequest, res:EResponse):void {
    res.sendFile(path.join(DIR_FIXTURES, "domposition.html"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  });

  app.get("/route-plotting.html", function (req:ERequest, res:EResponse):void {
    res.sendFile(path.join(DIR_FIXTURES, "route-plotting.html"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  });

  app.get("/asset/ob1-202406.min.mjs", function (req:ERequest, res:EResponse):void {
    res.sendFile(path.join(DIR_FIXTURES, "ob1-202406.min.mjs"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/javascript;charset=UTF-8" },
    });
  });

  app.get("/asset/ob1.min.css", function (req:ERequest, res:EResponse):void {
    res.sendFile(path.join(DIR_FIXTURES, "ob1.min.css"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/css;charset=UTF-8" },
    });
  });

  app.get("/scripts/:nom", function (req:ERequest, res:EResponse):void { 
    const detect = fs.statSync(path.join(DIR_TESTS, req.params.nom), {
      throwIfNoEntry: false,
    });
    if (detect && !detect.isFile()) {
      res.status(404).send("Unknown file " + req.params.nom);
      return;
    }
    res.sendFile(path.join(DIR_TESTS, req.params.nom), {
      headers: { "Content-Type": "text/javascript; charset=UTF-8" },
    });
  });

  sock.listen(PORT_SERVER, URL_SERVER, ():void => {
    console.log(
      "[INFO] Fixture server  https://" +
        URL_SERVER +
        ":" +
        PORT_SERVER +
        "/ with a local PID of " +
        process.pid,
    );
  });
  const closeServer:END_CB = ():void => {
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
 * @returns {Promise<Array<Triggerage>>} - 
 *
 */
async function spinup_playwright(debug_url:string):Promise<Array<Triggerage>> {
  // debug channel, not test node web service
  const DBG = await chromium.connectOverCDP(debug_url);
  if (!DBG.isConnected()) {
    throw new Error("Can't connect to captive browser");
  }
  const CTX = DBG.contexts();
  if (CTX.length < 1) {
    throw new Error("Can't connect to captive browser (contexts)");
  }
  console.log(    `[INFO] In process ${process.pid}, Playwright admin via ` + debug_url);

  const ctx = CTX[0];
  const closure:END_CB = async ():Promise<void> => {
    await ctx.close();
    await DBG.close();
  };
  return [ctx, closure];
}

/**
 * spinup_browser
 * A //fairly// generic shell exec replacement, with a watch on stdout
 *     IMPURE as makes the process, and stays resident
 * @param {Array<string>} cmd
 * @param {(str)=>void } onSocket
 * @protected 
 * @returns {Array} - [PID of child, ()=>void]
 */
async function spinup_browser(cmd:Readonly<Array<string>>, onSocket:DEBUG_CHANNEL_CB):Promise<Array<Triggerage>>  {
  let buf:string = "",
      found = false;

  const READ = (data:string):void => {
    // being cautious on line buffering:
    buf += data;
    const tmp:Array<string> = buf.split("\n");
    for (let i = 0; i < tmp.length; i++) {
      if (!found && tmp[i].match(/^DevTools listening on /)) {
        onSocket(tmp[i].match(/^DevTools listening on ([^ ]+)$/)[1]);
        found = true;
      }
    }
  };
  const READ_ERR = (data:string):void => {
    console.log("[PASS-BACK] Child process said: " + data);
    console.log("outer running process has got the debug socket? " + found);
  };

  const CHILD = await PROC.spawn(BROWSER[0], BROWSER.slice(1, BROWSER.length - 1), {
    detached: true,
    shell: false,
  });
  const PID = CHILD.pid;
  CHILD.stdout.setEncoding("utf8");
  CHILD.stderr.setEncoding("utf8");
  CHILD.stdout.on("data", READ_ERR);
  CHILD.stderr.on("data", READ);
  CHILD.on("error", (err:Error):void => {
    console.log(`[PASS-BACK] CHILD ${PID} errored with ` + err.message);
    throw err;
  });
  CHILD.on("close", (code:number):void => {
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
function delay(ms:number):Promise<void> {
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
function should_close_tabs(args:Array<string>):number {
  let close:number = 1;
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
function getMethods(o:any):Array<string> {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(o)).filter(
    (m) => "function" === typeof o[m],
  );
}

/**
 * JSON2logging
 * Just a custom dump function to look like vitest/ jest. 
 * Prints to console
 * Code was written from exploration.  Jest-circus includes the run() which returns a RunResult
 * This doesn't look like what I get. 
 
 * @param {string} json1
 * @protected
 * @returns {void} 
 */
function JSON2logging(json1:string):void {
  let tmp = JSON.parse(json1.trim()) as Array<Object>;
  let tmp2:Array<TestResult> = Array.from(tmp) as Array<TestResult>;
  const LEN:number = tmp2.length - 1;
  let title:TestResult = tmp2[LEN];
  console.log("   ✓ " + title.name);

  for (let i = 0; i < LEN; i++) {
    let cur = tmp2[i];
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
 
 * @param {Page} page
 * @param {number} weight - REMOVED how many test tabs do you have?
 * @throws if data isn't in correct shape
 * @protected
 * @returns {Promise<string>}
 */
async function browser2json(page:Page):Promise<string> {
  const tt1 = await page.getByTestId("status");
  const sz = await tt1.count();

  if (sz > 0) {
    if (sz > 1) {
      throw new Error("Result block not found");
    }

    console.log(
      "[INFO] Sleeping as DOM data extraction from test tab is laggy",
    );
    await expect(tt1).toHaveAttribute("data-status", "done", {
      timeout: 30_000,
    });
    console.log("[INFO] wakeup (hopefully brower execution is done)");

    const json1 = await tt1.textContent();

    if (json1.length < 5) {
      throw new Error("EMPTY Result block found");
    }
    return json1;
  }
  throw new Error("Logic error, ask a dev");
}

// https://superuser.com/questions/1139259/how-to-adjust-ui-scaling-for-chrome
// https://stackoverflow.com/questions/62001125/chrome-dev-tools-simulating-different-resolution-pc-screen
async function runExtract(urn:string):Promise<void> {
  console.log(
    "[INFO] You need to catch the file savee-as dialogs,  Opens some tabs in Chrome",
  );
	const SCREENS:Array<string>=[
			'(min-width:1024px)',
			'(max-width:800px) and (min-resolution:150dpi)', 
				];
	let closing:Array<END_CB>=[], CHILD, end0:END_CB;

    dDelta = 3000;
    [CHILD, end0]  = spinup_server();
	closing.push(end0);
	await delay(1000);
	let LBROWSER=[...BROWSER];
	LBROWSER[3]="";
	LBROWSER.push( 
// https://developer.chrome.com/docs/devtools/device-mode/
// try CTRL+SHIFT+M. to load the  "toggle device toolbar"
// https://github.com/GoogleChrome/lighthouse/blob/ff41f6a289a3171ed0ec70c389de0181d8e59ca2/lighthouse-core/lib/emulation.js#L76-L80

           "--auto-open-devtools-for-tabs",
			"--force-media-resolution-height",
			"--force-media-resolution-width",
			"--enable-ui-devtools" ,
			"--alt-high-dpi-setting=96",
			"--high-dpi-support=1",
			"--force-device-scale-factor=1",
			"https://"+URL_SERVER+":"+PORT_SERVER+urn+'?dump-css=2&aspect='+SCREENS[0]+"&force-mobile=1" ,
				);
	[CHILD, end0] = await spinup_browser(LBROWSER, function(a:any):void {});
	closing.push( end0);

	LBROWSER=[...BROWSER];
	LBROWSER[3]="";
	LBROWSER.push( 
// https://developer.chrome.com/docs/devtools/device-mode/
// try CTRL+SHIFT+M. to load the  "toggle device toolbar"
// https://github.com/GoogleChrome/lighthouse/blob/ff41f6a289a3171ed0ec70c389de0181d8e59ca2/lighthouse-core/lib/emulation.js#L76-L80

           "--auto-open-devtools-for-tabs",
			"--ash-no-nudges",
			"--force-media-resolution-height",
			"--force-media-resolution-width",
			"--enable-ui-devtools" ,
			"--alt-high-dpi-setting=151",
			"--high-dpi-support=1",
			"--force-device-scale-factor=1.71",
			"https://"+URL_SERVER+":"+PORT_SERVER+urn+'?dump-css=2&aspect='+SCREENS[1]+"&force-mobile=1",
				);
	[CHILD, end0] = await spinup_browser(LBROWSER, function(a:any):void {});
	closing.push( end0);

	LBROWSER=[...BROWSER];
	LBROWSER[3]="";
  LBROWSER.push( 
           "--auto-open-devtools-for-tabs",
			"--ash-no-nudges",
			"--force-media-resolution-height",
			"--force-media-resolution-width",
			"--enable-ui-devtools" ,
			"--high-dpi-support=1",
			"--alt-high-dpi-setting=171",
			"--force-device-scale-factor=2.01",
			"https://"+URL_SERVER+":"+PORT_SERVER+urn+'?dump-css=2&aspect='+SCREENS[1]+"&force-mobile=1",
				);

// first ED
// /snap/bin/chromium --user-data-dir=/tmp/js-test2 --profile-create-if-missing --ignore-certificate-errors --test-type=webdriver --allow-insecure-localhost --mute-audio --disable-popup-blocking --disable-login-animations --disable-default-apps --allow-running-insecure-content --unsafely-disable-devtools-self-xss-warnings --auto-open-devtools-for-tabs --ash-host-window-bounds="500x350*3.5" --ash-no-nudges --force-media-resolution-height --force-media-resolution-width --enable-ui-devtools --enable-tablet-form-factor --high-dpi-support=1 --force-device-scale-factor=3.5 "https://127.0.0.1:8081/route-plotting.html?dump-css=2&aspect=ATEST&force-mobile=1" 
// after testing a few times, rationalise
// /snap/bin/chromium --user-data-dir=/tmp/js-test2 --profile-create-if-missing --ignore-certificate-errors --test-type=webdriver --allow-insecure-localhost --mute-audio --disable-popup-blocking --disable-login-animations --disable-default-apps --allow-running-insecure-content --unsafely-disable-devtools-self-xss-warnings --auto-open-devtools-for-tabs  --ash-no-nudges --force-media-resolution-height --force-media-resolution-width --enable-ui-devtools --high-dpi-support=1 --force-device-scale-factor=2.0 "https://127.0.0.1:8081/route-plotting.html?dump-css=2&aspect=ATEST&force-mobile=1"
// set mobile emulation ON
// set "browser" to be my phone
// set console log display to be ALL
// practical hack, setup profile in manual interaction before launching the export script
// /snap/bin/chromium --user-data-dir=/tmp/js-test3 --profile-create-if-missing --ignore-certificate-errors --test-type=webdriver --allow-insecure-localhost --mute-audio --disable-popup-blocking --disable-login-animations --disable-default-apps --allow-running-insecure-content --unsafely-disable-devtools-self-xss-warnings --auto-open-devtools-for-tabs --ash-no-nudges --force-media-resolution-height --force-media-resolution-width --enable-ui-devtools --force-device-scale-factor=1.7 "https://127.0.0.1:8081/route-plotting.html?dump-css=2&aspect=ATEST&force-mobile=1"  

	[CHILD, end0] = await spinup_browser(LBROWSER, function(a:any):void {});
	closing.push( end0);

	await delay(300_000);
	console.log("[INFO] Closing tabs now" );
	for(const end of closing) {
		end();
	}
	// should be able to exit here...
}

/**
 * runTests - a wrapper to make code tidier
 *
 * @param {Array<string>} tests
 * @protected
 * @returns {Promise<void>}
 */
export async function runTests(tests:Readonly<Array<string>>):Promise<void> {
  console.log(
    "[INFO] This suite takes about 1m to exec on a normal PC.  Opens many tabs in Chrome",
  );
  try {
    let dburl:string = "";
    const grab = (data:string):void => {
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
        "&close=" +
        should_close_tabs(process.argv);
      await page.goto(URL);
      let d1 = new Date();
      await delay(3000);
      let json1:string = await browser2json(page);
      JSON2logging(json1);

      let d2 = new Date();
      dDelta = d2.getTime() - d1.getTime();
      await delay(100);
    }

    if (should_close_tabs(process.argv)) {
      end1();
      end0();
      end2();
    }
  } catch (e) {
    const CATCHES_ARE_VERY_ANNOYING_IN_TYPESCRIPT=e as Error; // worse than Java

    console.log(  "\n\n[ERROR] browser tests ABORTED with " + CATCHES_ARE_VERY_ANNOYING_IN_TYPESCRIPT.message,
      CATCHES_ARE_VERY_ANNOYING_IN_TYPESCRIPT.stack,
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
function runDirectly(p: NodeJS.Process ):boolean {
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
	--no-close    ~ do //not// close the tabs, or the browser. Use to see what happens
	--close       ~ for automated use, free() resources after use,  This is the default behaviour.  
    --extract-css ~ pass in an URN to use

`;
  console.log(TEXT);
  process.exit(0);
}
if (runDirectly(process)) {
	if(process.argv.includes('--extract-css')) {
// option to dump CSS
// needs to be done interactively, as a human needs to use the file-as dialog
		runExtract( 
			process.argv[
				process.argv.indexOf('--extract-css')+1
						]);

	} else {
// this code is a test runner,
// but is too complex.  So I may need to put a test on it
// so this is safe to import as it doesn't auto execute
		await runTests(TESTS);
	}
}
