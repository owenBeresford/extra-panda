import decoder from 'html-entity-decoder';
import { log } from "../log-services";

// string utils, isolated to make code more readable
export function baseURL(url: string): string {
  let ss: number = url.lastIndexOf("#");
  if (ss > 0) {
    url = url.substr(0, ss);
  }
  ss = url.lastIndexOf("?");
  if (ss > 0) {
    url = url.substr(0, ss);
  }

  return url;
}

/* eslint complexity: ["error", 30] */
export function valueOfUrl(raw: string): string {
  let sect = raw.split("/"),
    last = sect[sect.length - 1];

  if (sect.length > 4 && last && !last.match(new RegExp("\\.htm", "i"))) {
    return last;
  }
  if (sect.length === 4 && last && !last.match(new RegExp("\\.htm", "i"))) {
    // Two are used for 'https://'
    return last;
  }
  if (sect.length === 4 && last === "") {
    return sect[2];
  } else if (sect.length > 4 && last === "") {
    return sect[2];
  }

  log("info", "Last gasp, url parsing failed. " + raw);
  return raw;
}

export function normaliseString(raw: string): string {
  if (!raw) {
    return "";
  }

  raw = raw.trim();
  raw = decoder.feed(raw);
  raw = raw
    .replace('"', "")
    .replace("&quot;", "")
    .replace("'", "")
    .replace("&mdash;", "-")
    .replace("&amp;", "&")
    .replace("`", "'")
    .replace("&nbsp;", " ")
    .replace("&ndash;", "-")
    .replace("&rsquo;", "’")
    .replace("&ccedil;", "ç")
    .replace("&lsquo;", "‘")
    .replace("&middot;", "")
    .replace("&lt;", "<")
    .replace("&gt;", ">")
    .replace("&rdquo;", "”")
    .replace("&ldquo;", "“");
  if (raw.length > 500) {
    raw = raw.substr(0, 500);
  }
  return raw;
}

export function publicise_IP(src: string): string {
  if (src.match(/http:\/\//)) {
    log("warn", "WARN: http URL " + src);
  }

  let dst: string = src;
  if (src.match(/102\.168\./)) {
    dst = src.replace(
      /http:\/\/192\.168\.[0-9]{1,3}\.[0-9]{1,3}/,
      "https://owenberesford.me.uk",
    );
  }
  return dst;
}

export function cleanHTTPstatus(dat:string):number {
  return Math.floor(parseInt(dat, 10) / 100);
}

export const TEST_ONLY= { publicise_IP, valueOfUrl, normaliseString, baseURL, cleanHTTPstatus };
