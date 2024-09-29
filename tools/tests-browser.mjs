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
*/
import { spawn } from "node:child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import https from "https";

import { chromium } from "playwright";
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TESTS = [
  "modal.webtest.mjs", // extend...
];
const PORT_DEBUG = 9222;
const PORT_SERVER = 8081;
const URL_SERVER = "127.0.0.1";
const BROWSER = [
  "/snap/bin/chromium",
  "--user-data-dir=/tmp/js-test",
  "--remote-debugging-port=" + PORT_DEBUG,
  "--ignore-certificate-errors",
  "--allow-insecure-localhost",
  "--ignore-this",
];

const DIR_TESTS = path.join(__dirname, "..", "dist", "tests");
const DIR_FIXTURES = path.join(__dirname, "..", "src", "fixtures");
const CERT_NAME = DIR_FIXTURES + path.sep + "cert.pem";
const CERT_KEY = DIR_FIXTURES + path.sep + "private.key";
// cert.pem  csr.pem  index.html  ob1.min.css  private.key

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
      /MARKER/,
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

  app.get("/asset/ob1.min.css", function (req, res) {
    res.sendFile(path.join(DIR_FIXTURES, "ob1.min.css"), {
      dotfiles: "deny",
      headers: { "Content-Type": "text/css;charset=UTF-8" },
    });
  });

  app.get('/scripts/:nom', function(req, res) {
	let detect=fs.statSync(
		path.join( DIR_TESTS, req.params.nom), 
		{throwIfNoEntry:false}
				 );
	if( detect && !detect.isFile() ) {
		return res.status(404).send("Unknown file "+req.params.nom);
	}
    res.sendFile(path.join(DIR_TESTS, req.params.nom), {
      headers: { "Content-Type": "text/javascript; charset=UTF-8" },

	});
		 } );

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
  console.log("[INFO] Playwright admin via " + debug_url);

  const ctx = CTX[0];
  const closure = async () => {
    await ctx.close();
    await DBG.close();
  };
  return [ctx, closure];
}

/**
 * spinup_host
 * A //fairly// generic shell exec replacement, with a watch on stdout
// sample:
// DevTools listening on ws://127.0.0.1:9222/devtools/browser/59522268-ee60-43ba-b277-eab59f915f65
 
 * @param {Array<string>} cmd
 * @param {(str)=>void } onSocket
 * @protected
 * @returns {Array} - [PID of child, ()=>void]
 */
async function spinup_host(cmd, onSocket) {
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
    console.log("Child said: " + data);
  };

  const CHILD = await spawn(BROWSER[0], BROWSER.slice(1, 3), {
    detached: true,
    shell: false,
  });
  CHILD.stdout.setEncoding("utf8");
  CHILD.stderr.setEncoding("utf8");
  CHILD.stdout.on("data", READ_ERR);
  CHILD.stderr.on("data", READ);
  CHILD.on("error", (err) => {
    console.log("CHILD errored with " + err.message);
    throw err;
  });
  CHILD.on("close", (code) => {
    if (code !== 0) {
      console.log(`CHILD exited with code ${code}`);
      // maybe make an exception
    }
    CHILD.stdin.end();
    throw new Error("Browser was closed by a human");
  });
  console.log("[INFO] Created a browser instance");

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
 * runTests - a wrapper  to make code tidier
 *
 * @param {Array<strings>} tests
 * @protected
 * @returns {void}
 */
export async function runTests(tests) {
  try {
    let dburl = "";
    const grab = (data) => {
      dburl = data;
    };
    const [CHILD, end0] = await spinup_host(BROWSER, grab);
    const [ignored, end1] = spinup_server();
    await delay(2000);
    // loading chrome on this fairly fast machine takes more than 1s,
    // there is a chrome that I am using already loaded, could be account creation being slow
    if (dburl === "") {
      throw new Error("IO tangled, pls fix " + CHILD);
    }
    const [ctx, end2] = await spinup_playwright(dburl);
    for (let i in tests) {
      // IOIO maybe don't need a new tab each time
      const page = await ctx.newPage();
      // using **https** localhost,
      // test server is to server a HTML file in 'GET /'
      const URL =
        "https://" + URL_SERVER + ":" + PORT_SERVER + "/?test=" + tests[i];
      await page.goto(URL);
      await delay(1200000); // adjust this after completion
      // https://stackoverflow.com/questions/61453673/how-to-get-a-collection-of-elements-with-playwright
      // https://hatchjs.com/playwright-get-text-of-element/
      // https://playwright.dev/docs/locators
      // https://playwright.dev/docs/api/class-framelocator#frame-locator-get-by-text
    }

    end1();
    end0();
    end2();
  } catch (e) {
    console.log(
      "\n\n[ERROR] browser tests group failed with:",
      e.message,
      e.stack,
      "\n\n",
    );
  }
}

// this code is a test runner,
// but is too complex.  So I may need to put a test on it
// so this is safe to import as it doesn't auto execute
//if(! module.parent) {
runTests(TESTS);
//}
