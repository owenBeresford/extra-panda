/*
 This file exists as I am not making E2E tests, I am running normal unit test in the webrowser
 I need to do this as the JS interp has different features in a browser, and my code-under-test uses them
 The unit tests inject fixture HTML to operate.
  Secondly the browser will execute the CSS properly.

* have pre-compiled unit tests into a JS bundle
* add runtime file so single chrome instance is started
* start chromium process      /snap/sbin/chromium --user-data-dir=/tmp/js-test --remote-debugging-port 9222 
* start https on local host instance
* start playwright process inside node
* tell browser to open local static file, which loads JS unit test
* grab test output
* 

// https://gist.github.com/cmalven/1885287
// https://medium.com/@rihem.larbi/how-to-create-an-ssl-certificate-to-securely-access-a-nestjs-backend-app-using-https-c441cc39c6b5
// https://www.jvt.me/posts/2023/09/30/playwright-use-existing-session/
// https://dev.to/sonyarianto/how-to-use-playwright-with-externalexisting-chrome-4nf1
// chromium $new_profile_command --remote-debugging-port 9222 
// https://github.com/sonyarianto/playwright-using-external-chrome
*/
import { exec } from 'node:child_process';
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

import { chromium } from 'playwright';
import express from "express";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TESTS			=[
	// IOIO 
					];
const PORT_DEBUG	=9222;
const PORT_SERVER	=8081;
const URL_DEBUG		="http://localhost:";
const URL_SERVER 	="127.0.0.1";
const BROWSER		='chromium --user-data-dir=/tmp/js-test --remote-debugging-port '+PORT_DEBUG;

const DIR_TESTS		= path.join(__dirname, "..", "dist", "tests");
const DIR_FIXTURES  = path.join(__dirname, "..", "src", "fixtures");
const CERT_NAME     = DIR_FIXTURES +path.sep+"ecdsa.crt"; 
const CERT_KEY      = DIR_FIXTURES+path.sep+"ecdsa.pem"; 

/**
 * spinup_server
 * A function to start a Node/Express process to host test files
 
 * @protected
 * @returns [null, ()=>void ]
 */
function spinup_server() {
// probably throws...
	const credentials = {
			key: fs.readFileSync( CERT_KEY ), 
			cert: fs.readFileSync( CERT_NAME )
						};

  const app = express( credentials );
	app.get('/', function(req,res) {
		res.writeHead(200, {'Content-Type': 'text/html; encoding= utf8'});
		res.sendFile( path.join( DIR_FIXTURES, "index.html") );
	});
	app.get('/asset/ob1.min.css', function(req,res) {
		res.writeHead(200, {'Content-Type': 'text/css;charset=UTF-8'});
		res.sendFile( path.join( DIR_FIXTURES, "ob1.min.css") );
	});
// IOIO possible clash, as asset is used for 2 URLs
	app.get('/asset/*', express.static( DIR_TESTS ));

  const sock= app.listen(PORT_SERVER, URL_SERVER);
  console.log(
    "Fixture server  https://" +
      URL_SERVER +
      ":" +
      PORT_SERVER +
      "/ with a local PID of " +
      process.pid
  );
	const closeServer= () =>{ sock.close(); }
	return [null, closeServer ];
}

/**
 * spinup_playwright
 * A function to generate "Node access" to the browser 
 
 * @protected
 * @returns [playwright.Context, ()=>void ]
 */
async function spinup_playwright() {
// debug channel, not test node web service
        const DBG = await chromium.connectOverCDP(URL_DEBUG +PORT_DEBUG);
		if(! DBG.isConnected()) 		{ throw new Error("Can't connect to captive browser"); }
		if(! DBG.contexts().length <1)  { throw new Error("Can't connect to captive browser (contexts)"); }

        const ctx = DBG.contexts()[0];
		const closure= async () => {
    	    await ctx.close();
       		await DBG.close();
		}
		return [ctx, closure ];
}

/**
 * delay ~ borrowed from another project, a blocking sleep in JS
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((good) => setTimeout(good, ms));
}

/**
 * end0 - the closing browser function
 *
 * @param {Error} err
 * @param {Buffer|string} stdout
 * @param {Buffer|string} stderr
 * @protected
 * @throws The same error, so it gets caught in the single error catcher
 * @returns {void}
 */
function end0(err, stdout, stderr) {
	if(err) { console.log(err.message, err.stack, stderr); }	
	if(stderr) { console.log("ERROR:", stderr);  }
	if(stdout) { console.log("OUT:", stdout);  }
	throw err;
}

/**
 * runTests - a wrapper  to make code tidier
 *
 * @param {Array<strings>} tests
 * @protected
 * @returns {void}
 */
function runTests( tests) {
	try {
		const cntlr = new AbortController();
		const { signal } = cntlr;

		exec( BROWSER, {signal}, end0 );
		const [ignored, end2 ] = spinup_server();
		const [ctx, end1 ]=spinup_playwright();
		for(let script in tests) {
// IOIO maybe don't need a new tab each time
			const page = await ctx.newPage();
// using **https** localhost, 
// test server is to server a HTML file in 'GET /' 
			const URL= URL_SERVER+PORT_SERVER+'/?test='+script; 
			await page.goto(URL );
			await delay(2000); // adjust this after completion		
// IOIO get results of running script
		}
		cntlr.abort();
		end1();
		end2();
	} catch(e) {
		console.log(e.message, e.stack );
	}
}

// this code is a test runner, 
// but is too complex.  So I may need to put a test on it
// so this is safe to import as it doesn't auto execute
if(! module.parent) {
	runTests( TESTS );
}

