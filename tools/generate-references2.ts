// https://stackoverflow.com/questions/17276206/list-all-js-global-variables-used-by-site-not-all-defined
'use strict';
import {  Curl } from 'node-libcurl';
import { parse } from 'node-html-parser';
import decoder from 'html-entity-decoder';
import fs from 'fs';
import type { Crypto } from 'node:crypto';
const crypto = await loadCrypto();

const COOKIE_JAR ='/var/www/oab1/cookies.txt';
const TIMEOUT=3; // seconds
const [URL2, FN, URL1]=process_args(process.argv);





// types urm?
function async loadCrypto():Crypto {
	let crypto;
	try {
		crypto = await import('node:crypto');
	} catch (err) {
		console.error('FAIL, crypto module is disabled!');
		process.exit(254);
	} 

	if(! crypto || ! crypto.randomInt) {
		console.error("FAIL, crypto module doesnt have expected features.\n");
		process.exit(254);
	}
	return crypto;
}

function process_args(args:Array<string>):Array<string|URL> {
	if( args.length <4 || args[2]!=='--url') {	
		console.warn("Pass URL as --url <blah> --out <blah>", args);
		process.exit(1);
	}
	if( args.length < 6 || args[4]!== '--out' ) {
		console.warn("Pass URL as --url <blah> --out <blah>", args);
		process.exit(1);	
	}

	let URL1=''; let URL2=''; let FN='';
	try {
		URL1= args[3];
		FN  = args[5];
		URL2=new URL( URL1);

	} catch(e) {
		console.warn("Pass valid URL as --url <blah>", args, e);
		process.exit(1);	
	} 
	return [URL2, FN, URL1 ];
}

function exec_reference_url(offset:number, url:string, handler:HTMLTransformable ):Promise<any> {
  return new Promise(function (good, bad) {	
	handler.promiseExits(good, bad, offset);
	try {
		// I sleep here
		await setTimeout(function() {}, TIMEOUT*1200 );

		console.log("DEBUG: ["+offset+"] "+url );
		await fetch2(url, handler.success, handler.failure, handler.assignClose );
	} catch(e) {
		console.warn("W W W W W W W W W W W W W W W W W W W ["+offset+"] Network error with "+url +" :: "+ e);	
		bad(e);
	}
  })
///////////////////////////////////////////////////////////////////////////////////////////////////////
// sept 2024, this is preferred catch point
	.catch( function(ee) { 
		console.warn("REDIRECT ["+offset+"] of "+url +" to "+ ee.message);
		exec_reference_url(offset, ee.message, handler );
	});
//////////////////////////////////////////////////////////////////////////////////////////////////////
}


///////////////////////////////////////////////////////////////
// string utils to make code more readable
function shorten(url:string):string {
	let ss:number=url.lastIndexOf('#');
	if(ss >0) {
		url= url.substr(0, ss);
	}
	ss=url.lastIndexOf('?');
	if(ss >0) {
		url= url.substr(0, ss);
	}

	return url;
}

function normaliseString(raw:string):string {
	if(!raw) { return ""; }

	raw= raw.trim();
	raw=decoder.feed( raw);
	raw=raw.replace('"', '').replace('&quot;', '').replace('\'', '').replace('&mdash;', '-').replace('&amp;', '&')
			.replace('`', "'").replace('&nbsp;', ' ').replace('&ndash;', '-').replace('&rsquo;', '’').replace('&ccedil;','ç' )
			.replace('&lsquo;', '‘').replace('&middot;', '').replace('&lt;', '<').replace('&gt;', '>').replace('&rdquo;', '”')
			.replace('&ldquo;', '“') ;
	if(raw.length>500) {
		raw=raw.substr(0, 500);
	}
	return raw;
}

function valueOfUrl(raw:string):string {
	let sect=raw.split('/'), last=sect[sect.length-1];
	
	if(sect.length>4 && last && ! last.match(new RegExp('\\.htm', 'i'))) {
		return last;
	}
	if(sect.length===4 && last && !last.match(new RegExp('\\.htm', 'i'))) { // Two are used for 'https://'
		return last;
	}
	if(sect.length===4 && last==="") {
		return sect[2];
	} else if( sect.length>4 && last==="") {
		return sect[2];
	}

	console.log("Last gasp, url parsing failed. "+raw);	
	return raw;
}

function publicise_IP(src:string):string {
	if(src.match(/http:\/\//) ) {
		console.warn("WARN: http URL "+src);
	}
	
	let dst:string=src;
	if(src.match(/102\.168\./)) {
		dst=src.replace(/http:\/\/192\.168\.[0-9]\.[0-9]{1,3}/,  "https://owenberesford.me.uk" );
	}
	return dst;
}





/////////////////////////////////////////////////////////////////////////
// specific website hacks
function mod_npmjs(item, body) {
	let tt=item.url.substr( item.url.lastIndexOf('/')+1 );
	item.desc="Package to install "+tt;
	item.title="Package to install "+tt;

	let hit=body.match(new RegExp('aria-labelledby="collaborators".*<a href="\/~([^"]+)', 'im') );
	if(hit && hit.length) {
		item.auth=normaliseString(hit[1]);
	} else {
		item.auth='cant extract from NPMjs';
	}
	return item;
}

function mod_scribe(item, body) {
	let hit=body.match( new RegExp('<p class="meta">[ \t\n]*<a[^>]*>([A-Za-z 0-9\']+)<\/a>', 'im') ); 
	if(hit && hit.length) {
		item.auth=normaliseString(hit[1]);
	} else {
		item.auth='cant extract from medium';
	}

	hit=body.match( new RegExp('<p class="meta">.*([\-0-9]+).*<\/p>', 'im') ); 
	if(hit && hit.length) {
		item.date=(new Date(hit[1])).getTime()/1000;
	} else {
		item.auth='cant extract from medium';
	}
	return item;
}

function mod_medium(item, body) {
	let hit=body.match( new RegExp('<h2 class="pw-author-name[^>]*>[ \t\n]*<span[^>]*>([A-Za-z 0-9\']+)<\/span>', 'im') ); 
	if(hit && hit.length) {
		item.auth=normaliseString(hit[1]);
	} else {
		item.auth='cant extract from medium';
	}

	hit=body.match( new RegExp('<p class="pw-published-date[^>]*>[ \t\n]*<span[^>]*>([A-Za-z 0-9,]+)<\/span>', 'im') ); 
	if(hit && hit.length) {
		item.date=(new Date(hit[1])).getTime()/1000;
	} else {
		item.auth='cant extract from medium';
	}
	return item;
}

function mod_github(item, body ) {
	//	https://github.com/node-ffi-napi/node-ffi-napi
	let tt1=item.url.split('/');
	item.auth=tt1[3];	
	return item;	
}

function mod_stackoverflow(item, body) {
	item.auth='No author for Q&A sites';
	return item;	
} 

function mod_MDN(item, body) {
	item.auth='MDN contribuitors';
	return item;	
} 

function mod_GDN(item, body) {
	item.auth='Google inc';
	return item;	
}

function mod_react(item, body) {
	item.auth='Meta platforms inc';
	return item;	
}

function mod_graphQL(item, body) {
	item.auth='The GraphQL Foundation';
	return item;	
}

function mod_caniuse(item, body) {
	item.auth='Alexis Deveria @Fyrd';
	return item;	
}

function mod_mongodb(item, body) {
	item.auth='MongoDB inc';
	return item;	
}

function mod_wikipedia(item, body) {
	item.auth='Wikipedia contributors';
	return item;	
}

function mod_codepen(item, body) {
	let tt1=item.url.split('/');
// https://codepen.io/nobitagit/pen/AJXmgz
	item.auth=tt1[3];
	return item;	
} 

function mod_parli(item, body) {
	item.auth="part of the UKG"
	item.desc="I am prohibited from checking URLs on this website";
	item.title="I am prohibited from checking URLs on this website";
	return item;	
}

// function to apply the specific website hacks
function apply_vendors(item, body) {
	const f1 =function(name, target, CB) { return {name, target, callback:CB }; }
	const VENDORS= [
		f1('npmjs', false, mod_npmjs ),
		f1('medium', 'auth', mod_medium),
		f1('scribe.rip', 'auth', mod_scribe),
		f1('github', 'auth', mod_github),
		f1('stackoverflow', 'auth', mod_stackoverflow),
		f1('wikipedia', 'auth', mod_wikipedia),
		f1('developer.mozilla.org', 'auth', mod_MDN),
		f1('reactjs.org', 'auth', mod_react),
		f1('graphql.org', 'auth', mod_graphQL),
		f1('developers.google.com', 'auth', mod_GDN),
		f1('caniuse.com', 'auth', mod_caniuse),
		f1('mongodb.com', 'auth', mod_mongodb),
		f1('codepen.io', 'auth', mod_codepen),
		f1('parliament.uk', 'auth', mod_parli),
				];
	const VENDORS_LENGTH=VENDORS.length; 

	for(let i=0; i< VENDORS_LENGTH; i++) {
		if(item.url.includes(VENDORS[i].name) && (!item[VENDORS[i].target] ||
			(VENDORS[i].target && item[VENDORS[i].target] ==='unknown')) ) {
			item=VENDORS[i].callback(item, body);
		}
	}
	return item;
}


async function dump_to_disk(data, FN) {
	console.log("DEBUG: X X X X X X X X X X X X X X end event (write to disk) ");

	let template=`
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
	if(data.includes(undefined) || data.includes(false) ) {
		console.warn("Write ERROR "+ process.cwd()+'/'+FN +" May not have a undef in a references list");
		return false;
	}
	template= template.trim()+ "\n"+JSON.stringify( data, null, 2)+ "\n}}\n";

	await fs.writeFile( process.cwd()+'/'+FN, template, 'utf8', (err)=> { 
		if(err) { console.warn("Write ERROR "+ process.cwd()+'/'+FN ,err); }
	} );
}

// a boring net-work function, that supports cookie populations
// If curl has cookie problems https://www.npmjs.com/package/http-cookie-agent
async function fetch2(url:string|URL, good1:Function, bad1:Function, close:Function ):Promise<void> {
	const curl = new Curl();
	close( ()=>{ curl.close(); }.bind(this) );

	curl.setOpt('HTTPHEADER', [ 'upgrade-insecure-requests: 1', "accept-language: en-GB,en;q=0.5", 
					'user-agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:108.0) Gecko/20100101 Firefox/108.0'  ]);
	curl.setOpt('URL', url);
	curl.setOpt('COOKIEJAR', COOKIE_JAR );
	curl.setOpt('COOKIEFILE', COOKIE_JAR );
// sept 2024: Note official redirect tech, added in first version 
	curl.setOpt('FOLLOWLOCATION', true);
	curl.setOpt('TIMEOUT', TIMEOUT);
	curl.setOpt('CONNECTTIMEOUT', TIMEOUT);

// scale out to other domains as needed
// this will probably need to be a manual operation to know the URLs
	if(url.match('unicode.org')) {
		curl.setOpt(Curl.option.RANGE, '0-10000');
	}
	if(url.match('.pdf') ) {
		curl.setOpt('TIMEOUT', TIMEOUT*3.3);
	}

	curl.on('end', good1);
	curl.on('error', bad1);
//	curl.on('end', good1.bind(curl));
//	curl.on('error', bad1.bind(curl));
	curl.perform();
}




type PromiseCB = (a:any)=>void;
type CBtype= ()=>void;

interface Reference {
	url:string;
	desc:string;
	title:string;
	auth:string;
	date:number;
}
	
 
// this Interface may exist else where
interface HTMLTransformable {
	success(statusCode:string, data:string, headers:Headers):void;

	failure():void;

	promiseExits(good:PromiseCB, bad:PromiseCB, offset:number):void; 
	
	assignClose(cb:CBtype ):void;
}

class FirstPage implements HTMLTransformable { 
	good:PromiseCB;
	bad:PromiseCB;
	offset:number;
	CB:CBtype; 

	success(statusCode:string, data:string, headers:Headers):void {
		if( parseInt(statusCode /100) !==2) {
			return this.bad( new Error("Recieved "+statusCode) );
		}
		
		let root=parse(data );
		let nn=root.querySelectorAll('sup a');
		let list=[];
		nn.forEach( function(val, i) {
			list.push( val.getAttribute('href') );
				} );
		this.CB();
		if( list.length <2 ) {	
			console.warn("Didn't find many/ any URLs in page/ Is this not on my site, or is it not an article?" );
			process.exit(0);
		}
		this.good(list);
	}

	failure(msg:any ):void {
		console.log(msg, arguments[0], arguments[1]);
		this.CB(); 
		this.bad("Error "+ msg );
	}

	promiseExits(good:PromiseCB, bad:PromiseCB, offset:number):void {
		this.good=good;
		this.bad=bad;
		this.offset=offset;
	}

	assignClose(cb:CBtype ):void {
		this.CB=cb;
	}
	
}

class MorePages implements HTMLTransformable { 
	good:PromiseCB;
	bad:PromiseCB;
	offset:number;
	CB:CBtype; 
	src:Array<string>;
	dst:Array<Reference>;
	shorts:Record<string,Reference>;

	constructor(src:Array<string>) {
		this.src=src;
		this.dst=Array(src.length);
		// I have to allocate an array before I fill() it with initial values.
		// I have declared it above.   Is this Clang?
		this.dst.fill(false, 0, src.length);
		this.shorts={};
	}

	async success(statusCode:string, data:string, headers:Headers|Array<Headers>):void {
		let item:Reference ={
					'url':publicise_IP( this.src[this.offset]),
					'desc':'',
					'title':'',
					'auth':'',
					'date':0,
				} as Reference;
		console.log("DEBUG response ["+this.offset+"] HTTP"+statusCode );
	// I set curl follow-header
		if(( parseInt( statusCode, 10)/100)!==2) {
			console.log("ERROR: "+URL1+"["+this.offset+"] URL was dead "+this.src[this.offset]+" ", statusCode+ " "+ headers.result);
			if(headers.result && headers.result.reason) {
				item.desc="HTTP_ERROR, "+ headers.result.reason;
			} else {
				item.desc="HTTP_ERROR, Received code "+statusCode+" code.";
			}
			item=apply_vendors(item, "");
			this.dst[this.offset]= item;
			this.good( item);
			return;
		}
		if(Array.isArray(headers)) {
			headers=headers[0];
		}
		
		let loop=0;
		let redir=this._extractRedirect(body, this.offset, this.src[this.offset], loop );
		if(typeof redir !== 'boolean') {
			loop++;
			this.bad(redir);
		}
		item.date= this._extractDate(headers, body).getTime()/1000;
		item.auth= normaliseString(this._extractAuthor(body)); 
		item.title=this._extractTitle(body );

		hit=body.match(new RegExp('<meta[ \\t]+name=["\']description["\'][ \\t]+content="([^"]+)"', 'i'));
		if(hit && hit.length) {
			item.desc=normaliseString(hit[1]);
		
		} else {
			item.desc=item.title;
		}

		item=apply_vendors(item, body);	

		this.shorts[ shorten( this.src[this.offset]) ]=this.offset;
		this.dst[this.offset]= item;
		this.good( item);
	}

	failure(msg:any):void {
		console.warn("[url"+this.offset+"] X X X X X X X X X x X X X X X X ", msg, arguments[0], arguments[1]);
		let item={
					'url': publicise_IP( this.dst[this.offset]),
					'desc':'HTTP_ERROR, '+msg,
					'title':'HTTP_ERROR, '+msg,
					'auth':'unknown',
					'date':0,
				} as Reference;
		item=apply_vendors(item, "");
		this.dst[this.offset]= item;
		this.CB();
		this.good( item);
	}

	promiseExits(good:PromiseCB, bad:PromiseCB, offset:number):void {
		this.good=good;
		this.bad=bad;
		this.offset=offset;
	}

	assignClose(cb:CBtype ):void {
		this.CB=cb;
	}

	mapRepeatDomain(url:string|URL, cur:number ):boolean {
		const HASH=	 shorten( url );
		if( HASH in this.shorts) {
			this.dst[ cur]=Object.assign({}, this.dst[ this.shorts[ HASH] ], {url:url }) as Reference;
			return true;
		}
		return false;
	}

	get resultsArray():Readonly<Array<Reference|false>> { 
		return this.dst;
	}	
  
	// from sept 2024, deal with fake redirects
	_extractRedirect(body:string, offset:number, current:string|URL, loop:number):Error|false {

	// <script>location="https://www.metabase.com/learn/metabase-basics/querying-and-dashboards/visualization/bar-charts"<
		let hit=body.match(new RegExp('<script>[ \\t\\n]*location=["\']([^\'"]+)[\'"]', 'i'));
		if(hit && hit.length && hit[1]!= current ) {
			if(loop<3) {
				return new Error( hit[1] );
			}
		}
		hit=body.match(new RegExp('<script>[ \\t\\n]*location\\.href=["\']([^\'"]+)[\'"]', 'i'));
		if(hit && hit.length && hit[1]!= current ) {
			if(loop<3) {
				return new Error( hit[1] );
			}
		}
		hit=body.match(new RegExp('<script>[ \\t\\n]*location\\.replace\\(["\']([^\'"]+)[\'"]\\)', 'i'));
		if(hit && hit.length && hit[1]!= current ) {
			if(loop<3) {
				return new Error( hit[1] );
			}
		}

		// location.replaceState   replaceState(state, unused, url)
		hit=body.match(new RegExp('<script>[ \\t\\n]*location\\.replaceState\\(null,[ ]*[\'"]{2},[ ]*([\'"](.*)[\'"]\\)', 'i'));
		if(hit && hit.length && hit[1]!= current ) {
			if(loop<3) {
				return new Error( hit[1] );
			}
		}
		hit=body.match(new RegExp('<script>[ \\t\\n]*location\\.replaceState\\({[^}]*},[ ]*[\'"]{2},[ ]*[\'"](.*)[\'"]\\)', 'i'));
		if(hit && hit.length && hit[1]!= current ) {
			if(loop<3) {
				return new Error( hit[1] );
			}
		}

		// SKIP pushState ...
		//  <link rel="canonical" href="https://www.metabase.com/learn/metabase-basics/querying-and-dashboards/visualization/bar-charts
		hit=body.match(new RegExp('<link[ \\t]+rel=["\']canonical["\'][ \\t]+href="([^"]+)"', 'i'));
		if(hit && hit.length && hit[1]!= current && hit[1].indexOf('https://')>-1 ) {
			if(loop<3) {
				return new Error( hit[1] );
			}
		}
		return false;
	}

	_extractDate(headers:Headers, body:string):Date {
		if('Last-Modified' in headers) {
			let tmp=headers['Last-Modified'];
			tmp=tmp.replace(" BST", ""); 
			// yes I loose an hour here, but month/year is the valuable data
			return new Date( headers['Last-Modified']);
		} 

		let hit= body.match(new RegExp('posted.{1,5}<time datetime="([^"]*)', 'im') );
		if(hit && hit.length) {
			return new Date(hit[1]);
		} 

		let hit= body.match(new RegExp('last updated.*?<time datetime="([^"]*)', 'im') );
		if(hit && hit.length) {
			return new Date(hit[1]);
		} 

		let hit= body.match(new RegExp('class="pw-published-date[^>]*><span>([^<]*)</span>', 'im') );
		if(hit && hit.length) {
			return new Date(hit[1]);
		}

		console.log("DEBUG: Need more date code...");
		return new Date(0);
	}

	_extractAuthor(body:string):string {
		hit=body.match(new RegExp('<meta[ \\t]+name=["\']author["\'][ \\t]+content="([^"]+)"', 'i') );
		if(hit && hit.length) {
			return hit[1];
		}

		hit=body.match(new RegExp('<meta[ \\t]+name=["\']copyright["\'][ \\t]+content="([^"]+)"', 'i') );
		if(hit && hit.length) {
			return hit[1];
		}

		// <meta name="twitter:creator" content="@channelOwen">
		hit=body.match(new RegExp('<meta[ \\t]+name=["\']twitter:creator["\'][ \\t]+content="([^"]+)"', 'i') );
		if(hit && hit.length) {
			return hit[1];
		} 

		hit=body.match(new RegExp('\&copy; [0-9,]* ([^<\n])|[Ⓒ ©] [0-9,]* ([^<\n])|&#169; [0-9,]* ([^<\n])|&#xA9; [0-9,]* ([^<\n])', 'i') );
		if(hit && hit.length) {
			return hit[1];
		}

		hit=body.match(new RegExp('Ⓒ [0-9,]* ([^<\n])|&#9400; [0-9,]* ([^<\n])|&#x24B8; [0-9,]* ([^<\n])', 'i') );
		if(hit && hit.length) {
			return hit[1];
		}

	// https://love2dev.com/blog/html-website-copyright/
	// look at cc statement in footer next
	//  <footer> <small>&copy; Copyright 2018, Example Corporation</small> </footer> 
		return 'unknown';
	}

	_extractTitle(body:string):string {
		// https://gist.github.com/lancejpollard/1978404
		let hit= body.match(new RegExp('<title>([^<]+)<\\/title>', 'i') );
		if(hit && hit.length) {
			return normaliseString(hit[1]);
		} 

		hit=body.match(new RegExp('<h1[^>]*>([^<]+)</h1>', 'i') );
		if(hit && hit.length) {
			return normaliseString(hit[1]);
		} 

		// <meta name="og:title" content="The Rock"/>
		hit=body.match(new RegExp('<meta[ \\t]+name=["\']og:title["\'][ \\t]+content="([^"]+)"', 'i'));
		if(hit && hit.length) {
			return normaliseString(hit[1]);
		}

		return valueOfUrl(this.src[this.offset]);
	}
}





const P1 = new Promise(async function(good, bad) {  
	let p1=new FirstPage(); 
	p1.promiseExits(good, bad, -1);
	try {
		console.log("DEBUG: [-1] "+url );
		await fetch2(URL1, p1.success, p1.failure, p1.assignClose );
	} catch(e) {
		console.warn("W W W W W W W W W W W W W W W W W W W [-1] Network error with "+URL1 +" :: "+ e);	
		bad(e);
	}

}).then( async function(list) {
	const p2=new MorePages(list);
	const BATCH_SZ=7;
	const BATCH_NO= Math.ceil(list.length/BATCH_SZ);
	for(let k=0; k<BATCH_NO; k++ ) {
		let stack=[];
		for(let j =0 ; j< BATCH_SZ; j++) {
			let offset=k*BATCH_SZ +j;
			if(offset >= list.length) { break; } // used in last batch, which isn't likely to be full.

			// the logic test has side-effects
			if(!p2.mapRepeatDomain( list[offset], offset)) {
				stack.push( exec_reference_url(offset, list[offset], p2.success, p2.failure) );
			}
		}
		await Promise.all(stack);
	}


	let tmp= p2.resultsArray.filter( (a) => !!a );
	console.log("BEFORE got "+tmp.length+" input "+list.length );
	const TRAP =setInterval(function() { 
		let tmp= p2.resultsArray.filter( (a) => !!a );
		console.log(new Date(), " INTEVAL TICK, got "+tmp.length+" done items, input "+list.length+" items" ); 
		if( p2.resultsArray.length === list.length && !p2.resultsArray.includes(false)) { 
			console.log(new Date(), " INTEVAL TICK, CLOSING SCRIPT, seem to have data" ); 

			dump_to_disk( p2.resultsArray); 
			clearInterval(TRAP);
		}   
	} , 5000);
	console.log("W W W W W W W W W W W W W   Pretend to write here");
//	dump_to_disk( p2.resultsArray );

}).catch(function(e) { console.warn("Y Y Y y Y Y Y Y Y Y Y Y Y Y Y Y THIS SHOULDNT BE CALLED ", e, arguments); })


