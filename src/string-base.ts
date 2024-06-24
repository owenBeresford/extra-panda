/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import {
   BOUNDARY,
  MiscEventHandler,
} from "./all-types";
import { log } from "./code-collection";
import { isFullstack } from "./dom-base";

/**
 * pullout
 * An isolation function, as JSDOM isn't perfect.
 
 * @param {HTMLElement} a 
 * @public
 * @return {string}
 */
export function pullout(a: HTMLElement): string {
  if ("textContent" in a) {
    return a.textContent;
  } else if ("innerText" in a) {
    return a.innerText;
  } else {
    throw new Error("No text found");
  }
}

/**
 * _map
 * Add several event listeners, just a utility
 * UNUSED till I can use Golang grade types
 *
 * @param {HTMLElement} where
 * @param {MiscEventHandler } action
 * @public
 * @return {void}
 */
function _map(
  where: HTMLElement,
  action: MiscEventHandler,
  args: Array<any> | undefined = undefined,
): void {
  if (args) {
    where.addEventListener("click", (a: Event) => {
      return action(a, ...args);
    });
    where.addEventListener("touch", (a: Event) => {
      return action(a, ...args);
    });
    where.addEventListener("keypress", (a: Event) => {
      return action(a, ...args);
    });
  } else {
    where.addEventListener("click", action);
    where.addEventListener("touch", action);
    where.addEventListener("keypress", action);
  }
}

/**
 * articleName
 * Extract article name from location
 *    PURE

 * @param {Location =location} loc
 * @public
 * @return {string}
 */
export function articleName(loc: Location = location): string {
  return loc.pathname.split("/").pop() || "<name>";
}

/**
 * makeRefUrl
 * Compute the relative URL for the references cache
 *    PURE

 * @param {string} template
 * @param {Location =location} loc
 * @protected
 * @return {string}
 */
export function makeRefUrl(template: string, loc: Location = location): string {
  let tmp: string = "";
  let tmp2: string[] = [];
  if (loc.href.indexOf("?") > 0) {
    tmp = loc.href.substring(0, loc.href.indexOf("?"));
  } else {
    tmp = loc.href;
  }
  tmp2 = tmp.split("/");
  return template.replace(/XXX/, tmp2.pop());
}

/**
 * addLineBreaks
 * Add manual wrap to a string, so the tooltips are a fixed width
 *   PURE

 * @param {string} str
 * @param {number =80} len
 * @param {string ="↩"} token 
 * @public
 * @return {string}
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
 * pad
 * For making dates, add a leading zero to the param string if needed
 *   PURE
 * This code would be much simpler if I could make unsigned number or exclusive counting number types
 *
 * @param {number} num
 * @public
 * @return {string} - the result
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

/**
 * mapAttribute
 * Extract the named limit of the element
 * PURE
 *
 * @param {HTMLElement} ele
 * @param {BOUNDARY} attrib - One of top|bottom|left|right|width|height
 * @public
 * @return {number } - the value of the requested
 */
export function mapAttribute(ele: HTMLElement, attrib: BOUNDARY): number {
  try {
    if (!isFullstack()) {
      return -1;
    }

    const STYL = ele.getBoundingClientRect();
    return STYL[attrib];
  } catch (e) {
    log("error", "Missing data:" + e);
    return -1;
  }
}

/**
 * importDate
 * Convert a string of date with a format to a date
 * For details on format, please see php strtotime()
 * NOTE output dates always in current and local TZ, even if input date isn't
 * like really small version of moment, converts ascii string to Date object
 *    PURE
 *
 * @param {string} format
 * @param {string=""} day
 * @param {string=""} time
 * @public
 * @return {Date}
 */
export function importDate(
  format: string,
  day: string = "",
  time: string = "",
): Date {
  let day1: string;
  let time1: string;
  let fpos: number;

  let year1: number;
  let month1: number;
  let _day1: number;
  let hour1: number;
  let min1: number;
  let sec1: number;
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
  } else {
    day1a = day1.split("/");
  }
  time1a = time1.split(":");
  buf = [...day1a, ...time1a];

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
 *
 * @param {number} din
 * @param {Date | string} ddefault - assert tranactional data sources, filler for nulls in first src
 * @param {bool =true} monthText - weather or not to translate month numbers to text, and whether to pad a 1 digit month
 * @public
 * @return {string}
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

export const TEST_ONLY = {
  articleName,
  addLineBreaks,
  pad,
  makeRefUrl,
  mapAttribute,
  importDate,
  dateMunge,
  _map,
};
