// import { parse } from "node-html-parser";
// import decoder from "html-entity-decoder";
import { apply_vendors } from "./vendor-mod";
import {
  normaliseString,
  publicise_IP,
  valueOfUrl,
	shorten
} from "./string-manip";
import { log } from "../log-services";
import { PageCollection } from './page-collection';
import type { HTMLTransformable, PromiseCB, CBtype, Reference, CurlHeadersBlob } from "./types";

export class MorePages implements HTMLTransformable {
  protected good: PromiseCB;
  protected bad: PromiseCB;
  protected CB: CBtype;
  protected offset: number;
  protected data: PageCollection;
  protected redirect_limit: number;
  protected loop: number; // a counter to limit badly setup JS forwarding, so it will break
  protected url:string;
 
  public constructor(d: PageCollection, redirect_limit: number = 3) {
    this.data = d;
    this.offset = -1;
    this.url = "";

    this.assignClose = this.assignClose.bind(this);
    this.success = this.success.bind(this);
    this.failure = this.failure.bind(this);
	  this.redirect_limit= redirect_limit; 
  }

  public setOffset(i: number, url: string): void {
    this.offset = i;
    this.url = url;
  }

  public success(
    statusCode: string,
    body: string,
    headers: CurlHeadersBlob,
  ): void {
    let item: Reference = {
      url: publicise_IP(this.url),
      desc: "",
      title: "",
      auth: "",
      date: 0,
    } as Reference;
    log("debug", "[" + this.offset + "] response HTTP" + statusCode);
    // I set curl follow-header
    if (parseInt(statusCode, 10) / 100 !== 2) {
      log("warn",
        "ERROR: "+process.argv[3]+" [" +
          this.offset +
          "] URL was dead " +
          this.url +
          " ",
        statusCode + " " + headers['result'],
      );
      // I scooped the result flag from a debug window, it exists
      if (headers.result && headers.result.reason) {
        item.desc = "HTTP_ERROR, " + headers.result.reason;
      } else {
        item.desc = "HTTP_ERROR, Received code " + statusCode + " code.";
      }
      item = apply_vendors(item, "");
      this.data.save(item, this.offset);
      this.good(item);
      if (this.CB) {
        this.CB();
      }
      return;
    }
    if (Array.isArray(headers)) {
      headers = headers[0];
    }
    if (this.CB) {
      this.CB();
    }

    let redir = this.#_extractRedirect(
      body,
      this.offset,
      this.url,
      this.data.loop
    );
    if (typeof redir !== "boolean") {
      this.data.incLoop();
      this.url=redir.message;
      this.bad(redir);
		  return;
    }
    item.date = this.#_extractDate(headers, body).getTime() / 1000;
    item.auth = normaliseString(this.#_extractAuthor(body));
    item.title = this.#_extractTitle(body);

    let hit = body.match(
      new RegExp(
        '<meta[ \\t]+name=["\']description["\'][ \\t]+content="([^"]+)"',
        "i",
      ),
    );
    if (hit && hit.length) {
      item.desc = normaliseString(hit[1]);
    } else {
      item.desc = item.title;
    }
    item = apply_vendors(item, body);
    this.data.save(item, this.offset);
  //  console.log("EXTRACTED {{", item, body, "}}");
    this.good(item);
  }

  public failure(msg: any): void {
    log(
      "warn",
      "[url" + this.offset + "] X X X X X X X X X x X X X X X X " + msg,
    );
    // plan B
    //		tmp=(this.dst[this.offset] as Reference).url;

    let item:Reference = {
      url: publicise_IP(this.url),
      desc: "HTTP_ERROR, " + msg,
      title: "HTTP_ERROR, " + msg,
      auth: "unknown",
      date: 0,
    } as Reference;
    item = apply_vendors(item, "");
	this.data.save( item, this.offset);
    this.CB();
    this.good(item);
  }

  public promiseExits(good: PromiseCB, bad: PromiseCB, offset: number): void {
    this.good = good;
    this.bad = bad;
    this.offset = offset;
  }

  public assignClose(cb: CBtype): void {
    this.CB = cb;
  }

  // from sept 2024, deal with fake redirects
  /* eslint complexity: ["error", 30] */
  #_extractRedirect(
    body: string,
    offset: Readonly<number>,
    current: string ,
    loop: Readonly<number>,
  ): Error | boolean {
    // <script>location="https://www.metabase.com/learn/metabase-basics/querying-and-dashboards/visualization/bar-charts"<
    let hit = body.match(
      new RegExp("<script>[ \\t\\n]*location=[\"']([^'\"]+)['\"]", "i"),
    );
    if (hit && hit.length && hit[1] != current) {
      if (loop < this.redirect_limit) {
        return new Error(hit[1]);
      }
      return false;
    }
    hit = body.match(
      new RegExp("<script>[ \\t\\n]*location\\.href=[\"']([^'\"]+)['\"]", "i"),
    );
    if (hit && hit.length && hit[1] != current) {
      if (loop < this.redirect_limit) {
        return new Error(hit[1]);
      }
      return false;
    }
    hit = body.match(
      new RegExp(
        "<script>[ \\t\\n]*location\\.replace\\([\"']([^'\"]+)['\"]\\)",
        "i",
      ),
    );
    if (hit && hit.length && hit[1] != current) {
      if (loop < this.redirect_limit) {
        return new Error(hit[1]);
      }
      return false;
    }

    // location.replaceState   replaceState(state, unused, url)
    hit = body.match(
      new RegExp(
        "<script>[ \\t\\n]*location\\.replaceState\\(null,[ ]*['\"]{2},[ ]*(['\"](.*)['\"])\\)",
        "i",
      ),
    );
    if (hit && hit.length && hit[1] != current) {
      if (loop < this.redirect_limit) {
        return new Error(hit[1]);
      }
      return false;
    }
    hit = body.match(
      new RegExp(
        "<script>[ \\t\\n]*location\\.replaceState\\({[^}]*},[ ]*['\"]{2},[ ]*['\"](.*)['\"]\\)",
        "i",
      ),
    );
    if (hit && hit.length && hit[1] != current) {
      if (loop < this.redirect_limit) {
        return new Error(hit[1]);
      }
      return false;
    }

    // SKIP pushState ...
    //  <link rel="canonical" href="https://www.metabase.com/learn/metabase-basics/querying-and-dashboards/visualization/bar-charts
    hit = body.match(
      new RegExp(
        '<link[ \\t]+rel=["\']canonical["\'][ \\t]+href="([^"]+)"',
        "i",
      ),
    );
// console.log("WWWWWW redirect mapper  "+current, hit ? hit[1]: "", this.redirect_limit  );
    if (
      hit &&
      hit.length &&
      hit[1] != decodeURI(shorten(current)) &&
      hit[1].indexOf("https://") > -1
    ) {
      if (loop < this.redirect_limit) {
        return new Error(hit[1]);
      }
      return false;
    }
    return false;
  }

  /* eslint complexity: ["error", 30] */
  #_extractDate(headers: Record<string, string>, body: string): Date {
    if ("Last-Modified" in headers) {
      let tmp: string = headers["Last-Modified"] as string;
      tmp = tmp.replace(" BST", "");
      // yes I loose an hour here, but month/year is the valuable data
      return new Date(tmp);
    }

    let hit = body.match(
      new RegExp('posted.{1,5}<time datetime="([^"]*)', "im"),
    );
    if (hit && hit.length) {
      return new Date(hit[1]);
    }

    hit = body.match(
      new RegExp('last updated.*?<time datetime="([^"]*)', "im"),
    );
    if (hit && hit.length) {
      return new Date(hit[1]);
    }

    hit = body.match(
      new RegExp('class="pw-published-date[^>]*><span>([^<]*)</span>', "im"),
    );
    if (hit && hit.length) {
      return new Date(hit[1]);
    }

    log("debug",  "["+this.offset+"] Need more date code here...");
    return new Date(0);
  }

  #_extractAuthor(body: string): string {
    let hit = body.match(
      new RegExp(
        '<meta[ \\t]+name=["\']author["\'][ \\t]+content="([^"]+)"',
        "i",
      ),
    );
    if (hit && hit.length) {
      return hit[1];
    }

    hit = body.match(
      new RegExp(
        '<meta[ \\t]+name=["\']copyright["\'][ \\t]+content="([^"]+)"',
        "i",
      ),
    );
    if (hit && hit.length) {
      return hit[1];
    }

    // <meta name="twitter:creator" content="@channelOwen">
    hit = body.match(
      new RegExp(
        '<meta[ \\t]+name=["\']twitter:creator["\'][ \\t]+content="([^"]+)"',
        "i",
      ),
    );
    if (hit && hit.length) {
      return hit[1];
    }

    hit = body.match(
      new RegExp(
        "&copy; [0-9,]* ([^<\\n])|[Ⓒ ©] [0-9,]* ([^<\\n])|&#169; [0-9,]* ([^<\\n])|&#xA9; [0-9,]* ([^<\\n])",
        "i",
      ),
    );
    if (hit && hit.length) {
      return hit[1];
    }

    hit = body.match(
      new RegExp(
        "Ⓒ [0-9,]* ([^<\\n])|&#9400; [0-9,]* ([^<\\n])|&#x24B8; [0-9,]* ([^<\\n])",
        "i",
      ),
    );
    if (hit && hit.length) {
      return hit[1];
    }

    // https://love2dev.com/blog/html-website-copyright/
    // look at cc statement in footer next
    //  <footer> <small>&copy; Copyright 2018, Example Corporation</small> </footer>
    return "unknown";
  }

  #_extractTitle(body: string): string {
    // https://gist.github.com/lancejpollard/1978404
    let hit = body.match(new RegExp("<title>([^<]+)<\\/title>", "i"));
    if (hit && hit.length) {
      return normaliseString(hit[1]);
    }

    hit = body.match(new RegExp("<h1[^>]*>([^<]+)</h1>", "i"));
    if (hit && hit.length) {
      return normaliseString(hit[1]);
    }

    // <meta name="og:title" content="The Rock"/>
    hit = body.match(
      new RegExp(
        '<meta[ \\t]+name=["\']og:title["\'][ \\t]+content="([^"]+)"',
        "i",
      ),
    );
    if (hit && hit.length) {
      return normaliseString(hit[1]);
    }

    return valueOfUrl(this.url);
  }
}
