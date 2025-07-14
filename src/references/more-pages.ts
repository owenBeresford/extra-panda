import { apply_vendors } from "./vendor-mod";
import {
  normaliseString,
  publicise_IP,
  valueOfUrl,
  cleanHTTPstatus,
	baseURL
} from "./string-manip";
import { log } from "../log-services";
import { PageCollection } from './page-collection';
import type { HTMLTransformable, PromiseCB, CBtype, Reference, CurlHeadersBlob, wrappedCloseType, VendorModPassthru } from "./types";

export class MorePages implements HTMLTransformable {
  protected good: PromiseCB;
  protected bad: PromiseCB;
  protected CB: wrappedCloseType;
  protected data: PageCollection;
  protected vendors: VendorModPassthru;

  protected offset: number;
  protected redirect_limit: number;
  protected loop: number; // a counter to limit badly setup JS forwarding, so it will break
  protected url:string;
 
  public constructor(d: PageCollection, av:VendorModPassthru, redirect_limit: number = 3) {
    this.data = d;
    this.vendors= av;
    this.offset = -1;
    this.url = "";
    this.CB=false;

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
    log("debug", "[" + this.offset + "] response HTTP " + statusCode);
    if(typeof this.CB ==='function') {
      this.CB();
    }
    // I set curl follow-header
    if ( cleanHTTPstatus(statusCode) !== 2) {
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
      item = this.vendors(item, "");
      this.data.save(item, this.offset);
      this.good(item);
      return;
    }
    /*
    if (Array.isArray(headers)) {
      headers = headers[0];
    }
    */  

    let redir = this.#_extractRedirect(
      body,
      this.redirect_limit,
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
    item.title = normaliseString(this.#_extractTitle(body, this.url));
    item.desc = normaliseString(this.#_extractDescription(body));

    item = this.vendors(item, body);
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
    item = this.vendors(item, "");
	this.data.save( item, this.offset);
  if(typeof this.CB =='function') {
    this.CB();
  }
    this.good(item);
  }

  public promiseExits(good: PromiseCB, bad: PromiseCB, offset: number): void {
    this.good = good;
    this.bad = bad;
    this.offset = offset;
  }

  public assignClose(cb: wrappedCloseType): void {
    this.CB = cb;
  }

  #_mapper(list:Array<string>, body:string, deft:string):string {
    for(let i=0; i<list.length; i++ ) {
      let hit = body.match( new RegExp( list[i], "im" ) );
      if (hit && hit.length) {
        return hit[1];
      }
    }
    return deft;
  }

  // from sept 2024, deal with fake redirects
  // my call to baseURL may cause issues in some old-school apps, but we'll see if this has effect in the real world.
  /* eslint complexity: ["error", 30] */
  #_extractRedirect(
    body: string,
    redirect_limit: Readonly<number>,
    current: string ,
    loop: Readonly<number>,
  ): Error | boolean {
    // <script>location="https://www.metabase.com/learn/metabase-basics/querying-and-dashboards/visualization/bar-charts"<
    // location.replaceState   replaceState(state, unused, url)
    // SKIP pushState ...
    //  <link rel="canonical" href="https://www.metabase.com/learn/metabase-basics/querying-and-dashboards/visualization/bar-charts
    let list = [
        "<script>[ \\t\\n]*location=[\"']([^'\"]+)['\"]",
        "<script>[ \\t\\n]*location\\.href=[\"']([^'\"]+)['\"]",
        "<script>[ \\t\\n]*location\\.replace\\([\"']([^'\"]+)['\"]\\)",
        "<script>[ \\t\\n]*location\\.replaceState\\(null,[ ]*['\"]{2},[ ]*(['\"](.*)['\"])\\)",
        "<script>[ \\t\\n]*location\\.replaceState\\({[^}]*},[ ]*['\"]{2},[ ]*['\"](.*)['\"]\\)",
        '<link[ \\t]+rel=["\']canonical["\'][ \\t]+href="([^"]+)"',
    ];

    for(let i=0; i<list.length; i++ ) {
      let hit = body.match( new RegExp( list[i], "im" ) );
      if (hit && hit.length  && hit[1] != decodeURI(baseURL(current))) {
        if (loop < redirect_limit) {
          // console.log("WWWWWW redirect mapper  "+current, hit ? hit[1]: "", this.redirect_limit  );
          return new Error(hit[1]);
        }
        return false;
      }
    }
    return false;
  }

  #_extractDescription(body:string):string {
    let list=[
      '<meta[ \\t\\n]+name=["\']description["\'][ \\t]+content="([^"]+)">',
      '<meta[ \\t\\n]+name=["\']twitter:description["\'][ \\t]+content="([^"]+)">',
      '<meta[ \\t\\n]+itemprop=["\']description["\'][ \\t\\n]+content="([^"]+)">',
      '<meta[ \\t\\n]+property=["\']og:description["\'][ \\t]+content="([^"]+)">',
    ];

    return this.#_mapper(list, body, '');
  }

  /* eslint complexity: ["error", 30] */
  #_extractDate(headers: CurlHeadersBlob, body: string): Date {
    if ("Last-Modified" in headers) {
      let tmp: string = headers["Last-Modified"] as string;
      tmp = tmp.replace(" BST", "");
      // yes I loose an hour here, but month/year is the valuable data
      return new Date(tmp);
    }
    let list=[
          'posted.{1,5}<time datetime="([^"]*)',
          'last updated.*?<time datetime="([^"]*)',
          'class="pw-published-date[^>]*><span>([^<]*)</span>',
    ];
    return new Date( this.#_mapper(list, body, "0" ) );
  }

  #_extractAuthor(body: string): string {
    let list = [
      '<meta[ \\t]+name=["\']author["\'][ \\t]+content="([^"]+)"',
      '<meta[ \\t]+name=["\']copyright["\'][ \\t]+content="([^"]+)"',
      '<meta[ \\t]+name=["\']twitter:creator["\'][ \\t]+content="([^"]+)"',
      "&copy; [0-9,]* ([^<\\n])|[Ⓒ ©] [0-9,]* ([^<\\n])|&#169; [0-9,]* ([^<\\n])|&#xA9; [0-9,]* ([^<\\n])",
      "Ⓒ [0-9,]* ([^<\\n])|&#9400; [0-9,]* ([^<\\n])|&#x24B8; [0-9,]* ([^<\\n])",
    ];
    return this.#_mapper(list, body, "unknown");
    // https://love2dev.com/blog/html-website-copyright/
    // look at cc statement in footer next
    //  <footer> <small>&copy; Copyright 2018, Example Corporation</small> </footer>
  }

  #_extractTitle(body: string, url:string): string {
    // https://gist.github.com/lancejpollard/1978404
    // <meta name="og:title" content="The Rock"/>
    let list = [
        "<title>([^<]+)<\\/title>",
        "<h1[^>]*>([^<]+)</h1>",
        '<meta[ \\t]+name=["\']og:title["\'][ \\t]+content="([^"]+)"',
    ];
    return this.#_mapper(list, body, valueOfUrl(url) );
  }

  // this idea is too much manual work.   DO NOT REPEAT IT 
  public static TEST_ONLY():Record<string,Function> { 
    // this is only used in tests, the extracted methods are stateless, 
    //  except for calls to mapper.  boo!
    let tmp=new MorePages(new PageCollection([]), apply_vendors, 666);
    let tmp2= { 
        extractTitle:tmp.#_extractTitle.bind(tmp), 
        extractAuthor:tmp.#_extractAuthor.bind(tmp), 
        extractDate:tmp.#_extractDate.bind(tmp), 
        extractDecrip:tmp.#_extractDescription.bind(tmp), 
        extractRedirect: tmp.#_extractRedirect.bind(tmp), 
        mapper: tmp.#_mapper.bind(tmp),  
      };
    return tmp2;
  }
}

export const TEST_ONLY= { MorePages, ...MorePages.TEST_ONLY() };
