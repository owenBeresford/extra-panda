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

import { FirstPage } from "../src/references/first-page";
import { MorePages } from "../src/references/more-pages";
import { exec_reference_url, fetch2 } from "../src/references/networking";
import { PageCollection } from "../src/references/page-collection";

const BATCH_SZ = 7;
const [FN, URL1] = process_args(process.argv);

if (!process || !process.argv) {
  console.error("This references tool is for the CLI/Node, not a browser");
  throw new Error();
}

function process_args(args: Array<string>): Array<string> {
  if (args.length < 4 || args[2] !== "--url") {
    console.warn("Pass URL as --url <blah> --out <blah>", args);
    process.exit(1);
  }
  if (args.length < 6 || args[4] !== "--out") {
    console.warn("Pass URL as --url <blah> --out <blah>", args);
    process.exit(1);
  }

  let URL1 = "";
  let FN = "";
  try {
    URL1 = args[3];
    FN = args[5];
  } catch (e) {
    console.warn("Pass valid URL as --url <blah>", args, e);
    process.exit(1);
  }
  return [FN, URL1];
}

function dump_to_disk(
  data: Readonly<Array<Reference | boolean>>,
  FN: string,
): Promise<void> {
  console.log("DEBUG: X X X X X X X X X X X X X X end event (write to disk) ");

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
    console.warn(
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
      console.warn("Write ERROR " + process.cwd() + "/" + FN, err);
    }
  });
}

new Promise(function (good, bad) {
  let p1 = new FirstPage();
  p1.promiseExits(good, bad, -1);
  try {
    console.log("DEBUG: [-1] " + URL1);
    fetch2(URL1, p1.success, p1.failure, p1.assignClose);
  } catch (e) {
    console.warn(
      "W W W W W W W W W W W W W W W W W W W [-1] Network error with " +
        URL1 +
        " :: " +
        e,
    );
    bad(e);
  }
})
  .then(async function (
    list: Array<string>,
  ): Promise<Readonly<Array<Reference>>> {
    const p3 = new PageCollection(list, BATCH_SZ);
    const p2 = new MorePages(p3, 3);
    console.log(
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
console.log("should be a slice", batch);
      for (let k = 0; k < BATCH_SZ; k++) {
		p2.setOffset(p3.offset(k), batch[k] );
        // the logic test has side-effects
        if (!p3.mapRepeatDomain(batch[k], p3.offset(k))) {
          p3.zeroLoop();
          // I removed the call stack
          await exec_reference_url(p3.offset(k), batch[k], p2);
        }
      }
      cur = p3.offset(BATCH_SZ-1);
    }

    let hasData = p3.resultsArray.filter((a) => !!a);
    console.log("BEFORE got " + hasData.length + " input " + list.length);
    if (hasData.length !== list.length) {
      const TRAP = await setInterval(function () {
        let tmp = p3.resultsArray.filter((a) => !!a);
        console.log(
          new Date(),
          " INTEVAL TICK, got " +
            tmp.length +
            " done items, input " +
            list.length +
            " items",
        );
        if (
          p3.resultsArray.length === list.length &&
          !p3.resultsArray.includes(false)
        ) {
          console.log(
            new Date(),
            " INTEVAL TICK, CLOSING SCRIPT, seem to have data",
          );

          dump_to_disk(p2.resultsArray, FN);
          clearInterval(TRAP);
        }
      }, 5000);
      // return statement as the wrapper asks for it
      return p2.resultsArray as Readonly<Array<Reference>>;
    } else {
      dump_to_disk(p2.resultsArray, FN);
      return p2.resultsArray as Readonly<Array<Reference>>;
    }
  })
  .catch(function (e) {
    console.warn("Y Y Y y Y Y Y Y Y Y Y Y Y Y Y Y THIS SHOULDNT BE CALLED ", e);
  });
