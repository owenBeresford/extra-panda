// import { Curl } from "node-libcurl";
import { execFile } from "node:child_process";
import type { NetworkInterfaceInfo } from "@types/node";

import { log } from "../log-services";
import {
  COOKIE_JAR,
  TIMEOUT,
  CURL_VERBOSE,
  STRICT_NETWORKING,
  EXTRA_URL_FILTERING,
} from "./constants";
import type {
  successType,
  failureType,
  closeType,
  HTMLTransformable,
  TaggedCurl,
  CurlHeadersBlob,
  IPListable,
  RemoteConfig,
  RunExecReturn,
  FileExecFlags,
} from "./types";

// counter for the timeout
let TO: number = TIMEOUT;
export function setMyTimeout(nu: number = TIMEOUT): void {
  TO = nu;
}

// a reimpl to use curel via CLI.
// node natively cannot do HTTP2 as a client #leSigh
export function fetch3(
  url: string,
  good1: successType,
  bad1: failureType,
  close: closeType,
): void {
  function handler(
    error: Error,
    stdout: string | Buffer,
    stderr: string | Buffer,
  ): void {
    if (error) {
      console.error("cURL failed:", error.message);
      return bad1(error);
    }

    // stderr has headers
    // stdout has response body
    let annoying1: string =
      (stdout as any) instanceof Buffer ? stdout.toString() : stdout;
    let annoying2: string =
      (stderr as any) instanceof Buffer ? stderr.toString() : stderr;
    let headers = parseHeaders(annoying2);
    let h2 = new Headers();
    try {
      for (let i in headers.resp) {
        if (i && i.length > 3) {
          if (i.indexOf("HTTP/") === 0) {
            // the parseInt is to cleanly strip whitespace
            h2.append("code", "" + parseInt(i.substring(i.indexOf(" ")), 10));
          } else {
            h2.append(i, headers.resp[i]);
          }
        }
      }
    } catch (e: unknown) {
      console.error(
        "cURL failed: header not dealt with:",
        (e as Error).message,
      );
    }

    // IOIO XXX think I need to readd the static value defined in CurlHeadersBlob to headers as they have different name here
    return good1(
      h2.get("code"),
      annoying1.trim(),
      headers.resp as CurlHeadersBlob,
    );
  }

  const CURRENT_HEADERS: Array<string> = [
    "upgrade-insecure-requests: 1",
    "Referrer-policy: strict-origin-when-cross-origin",
    "accept-language: en-GB,en;q=0.9,nl;q=0.8,de-DE;q=0.7,de;q=0.6",
    "user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    'sec-ch-ua: "Not)A;Brand";v="8", "Chromium";v="138"',
    "sec-ch-ua-mobile: ?0",
    'sec-ch-ua-platform: "Windows"',
    "sec-fetch-dest: document",
    "sec-fetch-mode: navigate",
    "sec-fetch-site: cross-site",
    "sec-fetch-user: ?1",
  ];

  let annoying: RemoteConfig = { timeout: 3_000_000 } as RemoteConfig;
  let args: Array<string> = ["-v", "-m" + annoying.timeout / 1_000, url];
  args.push("-XGET");
  for (let i = 0; i < CURRENT_HEADERS.length; i++) {
    args.push(`-H'${CURRENT_HEADERS[i]}'`);
  }

  const options: FileExecFlags = { windowsHide: true, shell: false };
  execFile("/usr/bin/curl", args, options, handler);
}

/**
   * parseHeaders
   * Translate flat plain-text of cURL output into a struct

   * @param {string} str
   * @public
   * @returns {RunExecReturn }
   */
function parseHeaders(str: string): RunExecReturn {
  let bits: Array<string> = str.split("\n");
  let out: RunExecReturn = { reqt: {}, resp: {} } as RunExecReturn;

  for (let i = 0; i < bits.length; i++) {
    switch (bits[i][0]) {
      case ">": {
        let annoying = parseHeader2(bits[i]);
        out.reqt[annoying[0]] = annoying[1];
        break;
      }
      case "<": {
        let annoying = parseHeader2(bits[i]);
        out.resp[annoying[0]] = annoying[1];
        break;
      }
      default:
        break;
    }
  }
  return out;
}

/**
   * parseHeader2
   * Tokenise a single header into a more useful structure

   * Note two of cases, in HTTP2 look like this:
   *   > GET /api/shared-state HTTP/2
   *   < HTTP/2 200
   *   < HTTP/1.1 404 Not Found
   *
   * @param {string} str
   * @public
   * @returns {Array<string>}
   */
function parseHeader2(str: string): Array<string> {
  str = str.trim();
  let str2 = str.substring(1, str.length);
  str2 = str2.trim();
  if (str2.indexOf(":") === -1) {
    if (str.indexOf("HTTP/") === 0) {
      return [
        "status",
        str2.substring(str2.indexOf(" ") + 1, str2.length).trim(),
      ];
    } else if (str.match(/^[A-Z]{3,} \//)) {
      return ["method", str.substring(0, str.indexOf(" "))];
    } else {
      return [str2];
    }
  } else {
    return [
      str2.substring(0, str2.indexOf(":")).trim(),
      str2.substring(str2.indexOf(":") + 2, str2.length).trim(),
    ];
  }
}

// ESlint doesn't support a Promise impl that says its async
// maybe I should create @types/ProductionGradePromise which extends Promise and does
export function exec_reference_url(
  offset: number,
  url: string,
  handler: HTMLTransformable,
): Promise<any> {
  return (
    new Promise(async function (good, bad) {
      handler.promiseExits(good, bad, offset);
      try {
        // I sleep here
        await delay(TIMEOUT * 1200);

        log("debug", "[" + offset + "] " + url);
        fetch3(url, handler.success, handler.failure, handler.assignClose);
      } catch (e) {
        log(
          "warn",
          "W W W W W W W W W W W W W W W W [" +
            offset +
            "] Network error with " +
            url +
            " :: " +
            e,
        );
        bad(e);
      }
    })
      // sept 2024, this is preferred catch point
      .catch(async function (ee) {
        log(
          "warn",
          "REDIRECT [" + offset + "] of " + url + " to " + ee.message,
        );
        if (url !== ee.message) {
          return await exec_reference_url(offset, ee.message, handler);
        } else if (STRICT_NETWORKING) {
          throw new Error(
            "impossible situation, 4523586423424 (so I'm bailing)",
          );
        }
        handler.failure("Unspecified failure " + ee.message);
        // Eslint asked for a return statement on this function
        return null;
      })
  );
}

export async function delay(ms: number): Promise<void> {
  return new Promise((good, bad) => setTimeout(good, ms));
}

// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
// 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
function ifIP4(dat: string | number): string | number {
  if (typeof dat === "string") {
    return "IPv4";
  } else {
    return 4;
  }
}

/**
 * mapInterfaces
 * Function to list IP4 interfaces locally availablei, 
 * bias towards Eth IP4 by using first slot
 * Used in tests 
 * A no-value rewrite to be more functional would make it run faster and be shorter.  
 * I don't need network device names

 * @link https://stackoverflow.com/a/8440736
 * @public
 * @returns {IPListable}
 */
export function mapInterfaces(
  nets: Record<string, NetworkInterfaceInfo>,
): IPListable {
  const out: IPListable = {};

  for (const nom of Object.keys(nets)) {
    for (const net of nets[nom]) {
      if (net.family === ifIP4(net.family) && !net.internal) {
        if (!(nom in out)) {
          out[nom] = [];
        }
        out[nom].push(net.address);
        if (!out.first) {
          out["first"] = [net.address];
        }
      }
    }
  }
  return out;
}

// not exported, just type-safety on edits
type EDIT_REQUEST = (c: TaggedCurl) => void;

/**
 * urlFiltering
 * A util to edit cURL requests depending on target URL, should lead to lower failure
 * UPDATE as needed 

 * @param {string} url
 * @param {TaggedCurl} client
 * @public
 * @returns {TaggedCurl} - my local edit type
 */
function urlFiltering(url: string, client: TaggedCurl): TaggedCurl {
  // check return values on these lamda.  #leSigh, pointer, or lack of them
  let HOT_URLS: Record<string | RegExp, EDIT_REQUEST> = {
    "unicode.org": (client) => {
      // I think this doesn't work in node-libCurl
      // Clang test code https://curl.se/libcurl/c/range.html
      // when I run this I get back 0.5MB bytes, not 10K,
      // might be a cloudflare issue ~ who host unicode.org
      client.setOpt(Curl.option.RANGE, "0-10000");
      client.setOpt(Curl.option.TIMEOUT, TIMEOUT * 3.3);
    },
    "stackoverflow.com": (client) => {
      client.setOpt(Curl.option.CUSTOMREQUEST, "HEAD");
    },
  };
  HOT_URLS[/\.pdf$/] = (client) => {
    client.setOpt(Curl.option.TIMEOUT, TIMEOUT * 3.3);
  };

  Object.keys(HOT_URLS).map(function (a: any, b: number): void {
    if (url.match(a)) {
      HOT_URLS[a](client);
    }
  });
  return client;
}

export const TEST_ONLY = { urlFiltering };
