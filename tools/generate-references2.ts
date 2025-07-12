/*
	This script generate *-reference.wiki files, that execute to create *-reference.json files.
	This version takes 30-60s to execute, as I removed concurrency. 
	Build your cookies.txt by running "get cookies.txt LOCALLY" plugin in Chrome, or similar plugin in other browsers
	Update the COOKIE_JAR variable as needed,   do not store this file in /tmp/  ;-p

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
import { exec_reference_url, fetch2 } from "../src/references/networking";
import { PageCollection } from "../src/references/page-collection";
import type { Reference } from '../src/references/types';
import { log } from '../src/log-services';

const [FN, URL1] = process_args(process.argv);

if (!process || !process.argv) {
  log("error", "This references tool is for the CLI/Node, not a browser");
  throw new Error();
}

function process_args(args: Array<string>): Array<string> {
  if (args.length < 4 || args[2] !== "--url") {
    log( "warn", "Pass URL as --url <blah> --out <blah>" + args.join(", ")+"   ");
    process.exit(1);
  }
  if (args.length < 6 || args[4] !== "--out") {
    log( "warn", "Pass URL as --url <blah> --out <blah>" + args.join(", ")+"   ");
    process.exit(1);
  }

  let URL1 = "";
  let FN = "";
  try {
    URL1 = args[3];
    FN = args[5];
  } catch (e) {
    log("warn", "Pass valid URL as --url <blah> "+ args.join(", ")+"   " +e);
    process.exit(1);
  }
  return [FN, URL1];
}

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
    log("warn",
      "Write ERROR " +
        process.cwd() +
        "/" +
        FN +
        " May not have a undef in a references list",
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
      log("warn", "Write ERROR " + process.cwd() + "/" + FN +" "+ err);
    }
  });
}

new Promise(function (good, bad):void {
  let p1 = new FirstPage();
  p1.promiseExits(good, bad, -1);
  try {
    log("debug", "DEBUG: [-1] " + URL1);
    fetch2(URL1, p1.success, p1.failure, p1.assignClose);
  } catch (e) {
    log('warn', "ERROR, ABORTING [-1] Network error with " +
        URL1 +
        " :: " +
        e,
    );
    bad(e);
  }
})
  .then(async function (
    list: Array<string>,
  ): Promise<void> {
    const p3 = new PageCollection(list);
    const p2 = new MorePages(p3, 3);
    log("debug",
      "There are " +
        list.length +
        "/" +
        BATCH_SZ +
        " links in  " +
        process.argv[3],
    );

    let cur = p3.offset(0);
    while (p3.morePages(cur)) {
      let batch = p3.currentBatch;
// console.log("should be a slice", batch);
      for (let k = 0; k < BATCH_SZ; k++) {
		cur=p3.offset(k);
		// this if trap will exec in the last batch
		if(k>=batch.length) { break; }

		p2.setOffset(cur, batch[k] );
         // the logic test has side-effects
        if (!p3.mapRepeatDomain(batch[k], cur)) {
          p3.zeroLoop();
          // I removed the call stack
          await exec_reference_url(cur, batch[k], p2);
        }
      }
	
		// second safety against awkward last batches
	  if(cur > list.length ) { break; }
    }

    let hasData = p3.resultsArray.filter((a) => !!a);
    log( "debug", "BEFORE got " + hasData.length + " input " + list.length);
  //  console.log( "Find weird value:",  p3.resultsArray.map( (a, b)=>{ return b+"# "+typeof a+", "; }  ));

    if (hasData.length !== list.length) {
      const TRAP = await setInterval(function () {
        let tmp = p3.resultsArray.filter((a) => !!a);
        log("debug",
          (new Date()).getUTCSeconds()+
          " INTERVAL TICK, got " +
            tmp.length +
            " done items, input " +
            list.length +
            " items",
        );
        if (
          p3.resultsArray.length === list.length &&
          !p3.resultsArray.includes(false)
        ) {
          log("debug",
            (new Date()).getUTCSeconds()+
            " INTERVAL TICK, CLOSING SCRIPT, seem to have data",
          );

          dump_to_disk(p3.resultsArray, FN);
          clearInterval(TRAP);
        }
      }, 5000);
      // return statement as the wrapper asks for it
    } else {
      dump_to_disk(p3.resultsArray, FN);
    }
  })
  .catch(function (e) {
    log("warn", "Root error handler caught: "+ e.message);
  });
