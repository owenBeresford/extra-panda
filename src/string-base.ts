/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { log } from "./networking";

/**
 * pullout
 * An isolation function, as JSDOM isn't perfect.  PURE
 * @param {HTMLElement} a
 * @public
 * @returns {string}
 */
export function pullout(a: HTMLElement): string {
  if (!a) {
    // type checking isn't strong at runtime
    throw new Error("No element for text found");
  } else if ("textContent" in a) {
    return a.textContent;
  } else if ("innerText" in a) {
    return a.innerText;
  } else {
    throw new Error("No text found");
  }
}

/**
 * articleName
 * Extract article name from location
 * PURE
 * @param {Location =location} loc
 * @public
 * @returns {string}
 */
export function articleName(loc: Location): string {
  return loc.pathname.split("/").pop() || "<name>";
}

/**
 * makeRefUrl
 * Compute the relative URL for the references cache
 * PURE
 * @param {string} template
 * @param {Location =location} loc
 * @public
 * @returns {string}
 */
export function makeRefUrl(template: string, loc: Location): string {
  let tmp2: string[] = [];

  tmp2 = loc.pathname.split("/");
  if (!tmp2 || tmp2.length < 2) {
    tmp2 = ["resource", "home"];
  }
  return template.replace(/XXX/, tmp2.pop());
}

/**
 * isLocal
 * Guess if actual node or test node, PURE
 * @param {string} str
 * @public
 * @returns {boolean}
 */
export function isLocal(str: string): boolean {
  if (
    str.startsWith("192.168.") ||
    str === "127.0.0.1" ||
    str === "::1" ||
    str === "0:0:0:0:0:0:0:1" ||
    str === "localhost"
  ) {
    return true;
  }
  return false;
}

/**
 * addLineBreaks
 * Add manual wrap to a string, so the tooltips are a fixed width
 * PURE
 * @param {string} str
 * @param {number =80} len
 * @param {string ="↩"} token
 * @public
 * @returns {string}
 */
export function addLineBreaks(
  str: string,
  len: number = 80,
  token: string = "↩",
): string {
  if (!str || str.length < len) {
    return "" + str;
  }
  let marker = 0,
    out: Array<string> = [];
  while (marker <= str.length) {
    if (marker + len > str.length) {
      out.push(str.substring(marker, marker + len));
    } else {
      out.push(str.substring(marker, marker + len) + token);
    }
    marker += len;
  }
  return out.join("\n");
}

/**
 * standardisedWordCount 
 * Build magic to convert string sample to a word count PURE
 * I have plans about about removing stop words. 

 * @param {string} sample
 * @public
 * @returns {number}
 */
export function standardisedWordCount(sample: string): number {
  const RE1 = /[^ \t\n\r.(),~]+/g;
  const RE2 = /^[0-9]{1,3}$/;

  const list = Array.from(
    	sample.matchAll(RE1)
			).filter((a) => {
      return !(a[0] === "" || a[0].match(RE2));
    });
  // log("debug", "SAMPLE TAKEN:", list);
  return list.length;
}

/**
 * pad
 * For making dates, add a leading zero to the param string if needed
 * PURE
 * This code would be much simpler if I could make unsigned number or exclusive counting number types
 * @param {number} num
 * @public
 * @returns {string} - the result
 */
export function pad(num: number): string {
  let r = String(num);
  if (num === 0 || num < 1) {
    throw new Error("Value passed must be a counting number above 0");
  }
  if (r.length === 1) {
    r = "0" + r;
  }
  return r;
}

/*eslint complexity: ["error", 30]*/
/**
 * fixArgs
 * Fix whatever data that I have been given, down to a predictable list #leSigh browsers.
 * This is too complex as I am supporting ALL browsers across a large amount of time/editions.
 * I presume a 'JS purity & primis' person would not support some of the corner cases.
 * Used in importDate()   PURE
 * @param {string = ""} day - supports / and - common formats
 * @param {string = ""} time
 * @protected
 * @returns {Array<strings>}
 */
function fixArgs(day: string = "", time: string = ""): Array<string> {
  let day1: string;
  let time1: string;

  // write once vars
  let day1a: Array<string>;
  let time1a: Array<string>;
  let buf: Array<string>;

  if (time === "" && day) {
    let tt = day.split("T");
    if (tt.length === 2) {
      [day1, time1] = [tt[0], tt[1]];
    }
    tt = day.split(" ");
    if (tt.length === 2) {
      [day1, time1] = [String(tt[0]), tt[1]];
    }
    if (typeof day1 === "undefined") {
      day1 = day;
      time1 = "";
    }
  } else if (day && time) {
    day1 = day;
    time1 = time;
  }
  if (!day1) {
    throw new Error("importDate: No values supplied");
  } else if (day1.indexOf("-") > 0) {
    // if - is in first char position, its still bad, so skip that option
    day1a = day1.split("-");
  } else if (day1.indexOf("/") > 0) {
    day1a = day1.split("/");
  }
  time1a = time1.split(":");

  if (!day1a) {
    throw new Error("importDate: No values supplied");
  }
  buf = [...day1a, ...time1a];
  return buf;
}

/**
 * booleanMap
 * Convert many possible "English" boolean values to boolean
 * NOTE: As JS, this may not be a string.  PURE
 * @param {string | number} str
 * @protected
 * @returns {boolean}
 */
export function booleanMap(str: string | number): boolean {
  const TRUE = ["1", 1, "true", "TRUE", "on", "ON", "yes", "YES", "✔", "✓"];
  const FALSE = [
    "0",
    0,
    "false",
    "FALSE",
    "off",
    "OFF",
    "no",
    "NO",
    "🗙",
    "✕",
    "✖",
    "✖",
    "✗",
    "✘",
  ];

  if (TRUE.includes(str)) {
    return true;
  }
  if (FALSE.includes(str)) {
    return false;
  }
  throw new Error("Unknown data " + str);
}

/**
 * test_name
 * Make a unique name. used in the browser unit tests.
 * PURE
 *
 * @param {string|number} hash
 * @returns {string}
 */
export function test_name(hash: string | number): string {
  const d = new Date();
  return "test" + hash + "_" + d.getSeconds() + "_" + d.getMilliseconds();
}

/**
 * importDate
 * Convert a string or Date with a format to a date
 * For details on format, please see php strtotime()
 * NOTE output dates always in current and local TZ, even if input date isn't
 * PURE
 * @param {string} format
 * @param {string=""} day
 * @param {string=""} time
 * @public
 * @returns {Date}
 */
export function importDate(
  format: string,
  day: string = "",
  time: string = "",
): Date {
  let year1: number;
  let month1: number;
  let _day1: number;
  let hour1: number;
  let min1: number;
  let sec1: number;
  let fpos: number;
  const buf = fixArgs(day, time);

  // note very clearly: this is array fragment offset, not char offset
  fpos = 0;
  while (fpos < format.length) {
    // have switch statement, as data sequence is set by the caller
    // so can't array.map or something
    switch (format.charAt(fpos)) {
      case "y": {
        year1 = parseInt(buf[fpos], 10);
        break;
      }
      case "m": {
        month1 = parseInt(buf[fpos], 10);
        month1--;
        break;
      }
      case "d": {
        _day1 = parseInt(buf[fpos], 10);
        break;
      }
      case "h": {
        hour1 = parseInt(buf[fpos], 10);
        break;
      }
      case "i": {
        min1 = parseInt(buf[fpos], 10);
        break;
      }
      case "s": {
        sec1 = parseInt(buf[fpos], 10);
        break;
      }
      default:
        break; // white-space etc ignored on purpose
    }
    fpos++;
  }
  // NOTE dates always in current and local TZ, even if date isn't
  return new Date(year1, month1, _day1, hour1, min1, sec1, 0);
}

/**
 * dateMunge
 * Convert Epoch to human readable string PURE
 * @param {number} din
 * @param {Date | string} ddefault - assert transactional data sources, filler for nulls in first src
 * @param {boolean =true} monthText - weather or not to translate month numbers to text, and whether to pad a 1 digit month
 * @public
 * @returns {string}
 */
export function dateMunge(
  din: number,
  ddefault: Date | string,
  monthText: boolean = true,
): string {
  let date: Date | string = "";

  if (Number(din) === din && din % 1 === 0) {
    // second clause above is to get ints, rather than floats
    if (din === 0) {
      date = "[No date]";
    } else if (din < 10000000000) {
      date = new Date(din * 1000);
    } else {
      date = new Date(din);
    }
  } else {
    date = ddefault;
  }

  if (typeof date !== "string") {
    const months = [
      "",
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    let hours;
    if (date.getHours()) {
      hours = pad(date.getHours());
    } else {
      hours = "00";
    }

    date =
      " " +
      pad(date.getDate()) +
      "-" +
      (monthText ? months[date.getMonth() + 1] : pad(date.getMonth() + 1)) +
      "-" +
      date.getUTCFullYear() +
      " " +
      (monthText ? "" : hours + ":00");
  }
  return date;
}

////////////////////////////////////////////////////////////// testing /////////////////////////////////////////////
// no injectOpts needed
export const TEST_ONLY = {
  isLocal,
  articleName,
  addLineBreaks,
  standardisedWordCount,
  booleanMap,
  pad,
  test_name,
  makeRefUrl,
  importDate,
  dateMunge,
  //  _map,
};
