/*
	This script generate *-reference.wiki files, that execute to create *-reference.json files.
	This version takes 30-60s to execute, as I removed concurrency. 
	Build your cookies.txt by running "get cookies.txt LOCALLY" plugin in Chrome, or similar plugin in other browsers
	Update the COOKIE_JAR variable as needed,   do not store this file in /tmp/  ;-p
	
	This file is called ...2 as it is the second generation.

* check URL each time its loaded
* the log files in /tmp show trash sequencing
* leSigh JS pointers
*/

// https://stackoverflow.com/questions/17276206/list-all-js-global-variables-used-by-site-not-all-defined
"use strict";
import fs from "fs";

import { BATCH_SZ } from "../src/references/constants";
import { FirstPage } from "../src/references/first-page";
import { MorePages } from "../src/references/more-pages";
import {
  exec_reference_url,
  fetch2,
  delay,
  setMyTimeout,
} from "../src/references/networking";
import { PageCollection } from "../src/references/page-collection";
import { apply_vendors } from "../src/references/vendor-mod";
import { TIMEOUT, ENABLE_RETRY } from "../src/references/constants";
import { HTTP_REDIRECT_LIMIT } from "../src/references/constants";
import { log } from "../src/log-services";
import type { Reference } from "../src/references/types";

const [FN, URL1] = process_args(process.argv);

if (!process || !process.argv) {
  log(
    "error",
    "This references tool is for the CLI and Node only, not a browser.   It loads node only features.",
  );
  throw new Error();
}

/**
 * process_args
 * A Util to convert process.argv to useful return values 
 
 * @param {Array<string>} args 
 * @public
 * @returns {Array<strings>}
 */
function process_args(args: Array<string>): Array<string> {
  if (args.length < 4 || args[2] !== "--url") {
    log(
      "warn",
      "Pass URL as --url <blah> --out <blah>" + args.join(", ") + "   ",
    );
    process.exit(1);
  }
  if (args.length < 6 || args[4] !== "--out") {
    log(
      "warn",
      "Pass URL as --url <blah> --out <blah>" + args.join(", ") + "   ",
    );
    process.exit(1);
  }

  let URL1 = "";
  let FN = "";
  try {
    URL1 = args[3];
    FN = args[5];
  } catch (e) {
    log(
      "warn",
      "Pass valid URL as --url <blah> " + args.join(", ") + "   " + e,
    );
    process.exit(1);
  }
  return [FN, URL1];
}

/**
 * dump_to_disk
 * A util to write data to a Wiki file
 * Would look better in another filer, but it would be by-itself.
 
 * @param {Readonly<Array<Reference | boolean>>}  data  
 * @param {string} FN
 * @public
 * @returns {Promise<void>}
 */
function dump_to_disk(
  data: Readonly<Array<Reference | boolean>>,
  FN: string,
): Promise<void> {
  let template = `
{{pagemeta
|Name                = Should NOT be visible ~ JSON output.
|Title               = Should NOT be visible ~ JSON output.
|Author              = Owen Beresford
|DocVersion          = 2.0
|AccessGroup         = 5
|Method              = GET
|CodeVersion         = 2.0.0
|Keywords            = XXX
|description		= Template file for generating JSON responses.
|mime-type		    = application/json
}}
{{nextresource GET
|*
}}
{{plain root
`;
  if (data.includes(undefined) || data.includes(false)) {
    log(
      "warn",
      `Write ERROR ${process.cwd()}/${FN} May not have a undef in a references list`,
    );
    return;
  }
  template = template.trim() + "\n" + JSON.stringify(data, null, 2) + "\n}}\n";

  let outpath = FN;
  if (FN[0] !== "/") {
    outpath = process.cwd() + "/" + FN;
  }
  fs.writeFile(outpath, template, "utf8", (err: any): void => {
    if (err) {
      log("warn", "Write ERROR " + process.cwd() + "/" + FN + " " + err);
    }
  });
}

/**
 * links2references
 * "makes it work"
 * It would read better if I pulled the output driver to an after effect.
 
 * @param {Array<string>} list 
 * @public
 * @return {Promise<void>}
 */
async function links2references(list: Array<string>): Promise<void> {
  const p3 = new PageCollection(list);
  const trans1 = new MorePages(p3, apply_vendors, HTTP_REDIRECT_LIMIT);
  log(
    "debug",
    `There are ${list.length}/${BATCH_SZ} links in ${process.argv[3]}`,
  );

  let cur = p3.offset(0);

  while (p3.morePages(cur)) {
    let batch = p3.currentBatch;
    for (let k = 0; k < BATCH_SZ; k++) {
      cur = p3.offset(k);
      // this if trap will exec in the last batch
      if (k >= batch.length) {
        break;
      }

      trans1.setOffset(cur, batch[k]);
      // the logic test has side-effects
      if (!p3.mapRepeatDomain(batch[k], cur)) {
        p3.zeroLoop();
        await exec_reference_url(cur, batch[k], trans1);
      }
    }

    // second safety against awkward last batches
    if (cur > list.length) {
      break;
    }
  }

  if (ENABLE_RETRY) {
    await delay(TIMEOUT);
    setMyTimeout(TIMEOUT * 2.5);
    let retry: PageCollection = new PageCollection(p3.mapFails());
    const trans2 = new MorePages(retry, apply_vendors, HTTP_REDIRECT_LIMIT);
    log("info", `RETRYING ??/${BATCH_SZ} links in ${process.argv[3]}`);

    cur = retry.offset(0);
    while (retry.morePages(cur)) {
      let batch = retry.currentBatch;
      for (let k = 0; k < BATCH_SZ; k++) {
        cur = retry.offset(k);
        // this if trap will exec in the last batch
        if (k >= batch.length) {
          break;
        }

        trans2.setOffset(cur, batch[k]);
        // the logic test has side-effects
        if (!retry.mapRepeatDomain(batch[k], cur)) {
          retry.zeroLoop();
          await exec_reference_url(cur, batch[k], trans2);
        }
      }

      // second safety against awkward last batches
      if (cur > list.length) {
        break;
      }
    }

    await delay(TIMEOUT);
    p3.merge(retry);
  }

  let hasData = p3.resultsArray.filter((a) => !!a);
  log("debug", "BEFORE got " + hasData.length + " input " + list.length);

  if (hasData.length !== list.length) {
    let attempts = 0;
    const TRAP = await setInterval(function () {
      let tmp = p3.resultsArray.filter((a) => !!a);
      log(
        "debug",
        `INTERVAL TICK, got ${tmp.length} done items, input ${list.length} items`,
      );
      if (
        p3.resultsArray.length === list.length &&
        !p3.resultsArray.includes(false)
      ) {
        log("debug", " INTERVAL TICK, CLOSING SCRIPT, seem to have data");

        dump_to_disk(p3.resultsArray, FN);
        clearInterval(TRAP);
      }
      attempts++;
      if (attempts > 5) {
        dump_to_disk(p3.resultsArray, FN);
        clearInterval(TRAP);
        console.warn("Please manually fix " + FN);
      }
    }, 5000);
  } else {
    dump_to_disk(p3.resultsArray, FN);
  }
}

/**
 * basicError
 * A minimal error reporter
 
 * @param {Error} e
 * @public
 * @returns {Promise<void>}
 */
function basicError(e: Error): Promise<void> {
  log("warn", "Root error handler caught: " + e.message);
}

/*
	if args as such
		read last argv as file
		make PageCollection of bad references
		pass to links2references
	else 
		promise below
*/
new Promise(function (good, bad): void {
  let p1 = new FirstPage(true);
  p1.promiseExits(good, bad, -1);
  try {
    log("debug", "DEBUG: [-1] " + URL1);
    fetch2(URL1, p1.success, p1.failure, p1.assignClose);
  } catch (e) {
    log("warn", "ERROR, ABORTING [-1] Network error with " + URL1 + " :: " + e);
    bad(e);
  }
}).then(links2references, basicError);
