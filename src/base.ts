/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import { Cookieable, Fetchable, SimpleResponse, ScreenSizeArray, MOBILE_MIN_PPI } from './all-types';
import { register } from './code-collection';

register('runFetch', runFetch);

/**
 * getFetch
 * Access to fetch that is will work across JS interpreters
 *   IMPURE due to logging

 * @public
 * @return {Fetch| null}
 */
export function getFetch():Fetchable {
	if (typeof window !=="undefined") {
		return window.fetch;
	} else if(typeof fetch==="function") {
		return fetch;
	} else {
		console.error("Please stop using old versions of node.");
		return null;
	}
}

/**
 * runFetch
 * A simple wrapper current fetch()   IOIO LOGGING!!
 *   IMPURE when I add logging 
 *	This behaves as a VERY SIMPLE middle-ware.
 * 
 * @param {string} url
 * @param {boolean} trap ~ return null rather than an exception
 * @public
 * @throws {Error} = predictably, in case of network issue
 * @return {Promise<SimpleResponse>}
 */
export async function runFetch(url:string, trap:boolean):Promise<SimpleResponse> {
	const f=getFetch();
	try {
		let trans:Response=await f(url, {credentials:"same-origin", } ); 
		if(!trans.ok) {
			if(trap) { 
				return { body:"nothing", headers:{} as Headers, ok:false};
			} else { 
				throw new Error("ERROR getting asset "+url); 
			}
		} 
		let payload=""; 
		let tmp=await trans.body.getReader().read();
		payload+= await tmp.value;
		if(trans.headers.get('content-type').toLower().startsWith('application/json')) {
			return {body:JSON.parse(payload), headers:trans.headers, ok:true};
		} else {
			return {body:payload, headers:trans.headers, ok:true};	
		}
	} catch(e) {
		if(trap) { 
			return { body:"nothing", headers:{} as Headers, ok:false}; 
		} else { 
			throw new Error("ERROR getting asset "+url);
		}
	}
}

/**
 * pullout
 * An isolation function, as JSDOM isn't perfect.
 
 * @param {HTMLElement} a 
 * @public
 * @return {string}
 */
export function pullout( a:HTMLElement ):string {
	if('textContent' in a) {
		return a.textContent;
	} else if('innerText' in a) {
		return a.innerText;
	} else {
		throw new Error("No text found");
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
export function articleName(loc:Location=location):string {
	return loc.pathname.split('/').pop() || "<name>";
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
export function makeRefUrl(template:string, loc:Location=location):string {
	let tmp=loc.href.split('/');
	return template.replace(/XXX/, tmp.pop());
}

/**
 * isMobile
 * Statically workout if this is mobile
 * 
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {bool} ~ is this Mobile?  
 */
export function isMobile(dom:Document=document, loc:Location=location):boolean {
	try{ 
		dom.createEvent("TouchEvent"); 
		if( calcScreenDPI(dom) > MOBILE_MIN_PPI ) {
			return true;
		} else {
			return false;
		}		
// laptops with touch screen
	} catch(e){ 
		let u=new URLSearchParams(loc.search);
		if(u.has('mobile')) { 
			return true;
		}
		return false;
	}
};

function calcScreenDPI(dom:Document):number {
	try {
		const el = dom.createElement('div');
		el.setAttribute('style', 'width:1in;');
		dom.body.appendChild(el);

		// Get it's (DOM-relative) pixel width, multiplied by the device pixel ratio
		if(!window) { throw new Error("need to define a window"); }
		
		const dpi = el.offsetWidth * window.devicePixelRatio;
		el.remove();
		return dpi;
	} catch(e) {
		console.error("ERROR "+ e);
		return -1;
	}
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
export function addLineBreaks(str:string, len:number=80, token:string="↩"):string {
	if(!str || str.length < len) {
		return ""+str;
	}
	let marker=0, out:Array<string>=[];
	while(marker <= str.length) {
		if(marker +len > str.length) {
			out.push( str.substring(marker, marker+len ));
		} else {
			out.push( str.substring(marker, marker+len )+token);
		}
		marker+=len;
	}
	return out.join("\n");
}

/**
 * pad
 * For making dates, add a leading zero to the param string if needed
 *   PURE
 * 
 * @param {number} num
 * @public
 * @return {string} - the result
 */
export function pad(num:number):string {
	var r = String(num);
	if ( r.length === 1 ) {
		r = '0' + r;
	}
	return r;
}

/**
 * currentSize
 * Utility function to report the tab size...
 * I use this in debugging RWD PURE

 * @public
 * @return {ScreenSizeArray}
 */
function currentSize():ScreenSizeArray {
	var d = document, root = d.documentElement, body = d.body;
	let wid		= window.innerWidth || root.clientWidth || body.clientWidth;
	let hi		= window.innerHeight || root.clientHeight || body.clientHeight;
	let wid2:number=0; let hi2:number=0;
	if(typeof hi==="string") {
		hi2		= parseInt(hi, 10);
	} else {
		hi2		= hi;
	}
	if(typeof wid==="string") {
		wid2	= parseInt(wid, 10);
	} else {
		wid2	= wid;
	}
	return [wid2, hi2];
}
//if (typeof window !=="undefined") {
//	window.currentSize=currentSize;
//} 

// source code copied from: then amended
// https://www.tabnine.com/academy/javascript/how-to-set-cookies-javascript/
// as common libraries outside of npm seem really flakey

/**
  A class to allow access to cookies
  This version is mostly used by FF
 */
class COOKIE implements Cookieable  {
	set(cName:string, cValue:string, expDays:number):void{
		let expires='';
		if(expDays) {
        	let d1 = new Date();
        	d1.setTime(d1.getTime() + (expDays * 24 * 60 * 60 * 1000));
        	expires = "expires=" + d1.toUTCString();
		}
        document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
// old code inside PHP renderer
// setcookie('storage', $data, time()+30*24*60*12, '', $conf->get(array('site_settings','cookie_domain')), $https=='https', $https!='https' );
	}

	get(cName:string):string {
    	const name = cName + "=";
    	const cDecoded = decodeURIComponent(document.cookie); 
    	const cArr = cDecoded.split('; ');
    	let res;

    	cArr.forEach(val => {
          if (val.indexOf(name) === 0) {
			 res = val.substring(name.length);
		  }	
      	});
    	return res;
	}
}


/**
 * getCookie
 * Generate a cookie access object PURE 
 * 
 * @public
 * @return {Cookieable }
 */
export function _getCookie():Cookieable {
// first option is for chrome based browsers, 
// technically served via a JS plugin that is always present
//	if(typeof getCookie==="function") {
//		return { get:getCookie, set:setCookie } as Cookieable ;
//	} 
	return new COOKIE();
}


/**
 * mapAttribute
 * Extract the named limit of the element
 * PURE
 * 
 * @param {HTMLElement} ele
 * @param {string} attrib - One of top|bottom|left|right
 * @param {bool} cast - should this function force value to be an int?
 * @public
 * @return {number | string} - the value of the requested, with or without typecast
 */
export function mapAttribute(ele:HTMLElement, attrib:string, cast:boolean=false):number|string {
	try {
		if( isFullstack() ) { 
			return -1;
		}
	
		let STYL = ele.getBoundingClientRect();
		if(cast) {
			return parseInt(STYL[attrib], 10);

		} else {
			return STYL[attrib];
		}
	} catch(e) {
		this.log("error", "Missing data:"+e);
		return 0;
	}
}

export function isFullstack():boolean {
	let isNativeWindow; 
	if(typeof _window=="object") { 
		isNativeWindow = Object.getOwnPropertyDescriptor(_window, 'window')?.get?.toString().includes('[native code]');
	} else {
		isNativeWindow = Object.getOwnPropertyDescriptor(window, 'window')?.get?.toString().includes('[native code]');
	}
	if(typeof isNativeWindow === 'boolean' ) {
		return true; 
	}
	return false;
}

/**
 * importDate
 * Convert a string of date with a format to a date
 * For details on format, please see php strtotime()
 * like really small version of moment, converts ascii string to Date object 
 *    PURE
 *
 * @param {string} format
 * @param {string=""} day
 * @param {string} time
 * @public
 * @return {Date} 
 */
export function importDate(format:string, day:string="", time:string):Date {
	var day1, time1, fpos, bpos;
	var year1, month1, _day1, hour1, min1, sec1;
	if( typeof time==='undefined') {
		var found    =false;
		var tt       =day.split('T');
		if(tt.length===2) {
			[day1, time1] =[tt[0], tt[1]];
		}
		tt			=day.split(' ');
		if(tt.length===2) {
			[day1, time1] =[tt[0], tt[1]];
		}
		
	} else if (day && time ){
		day1		=day; 
		time1		=time;
	}	

	if(day1.indexOf('-') ){
		day1       = day1.split('-');
	}else{       
		day1       = day1.split('/');
	} 
	time1          = time1.split(':');
	for(var j =0; j<time1.length; j++) {
		day1[day1.length]=time1[j];
	}

	fpos           = 0;
	while(fpos<format.length) {
		switch(format.charAt(fpos)) {
			case 'y': { year1 = parseInt(day1[fpos], 10); break; }
			case 'm': { month1 = parseInt(day1[fpos], 10); month1--; break; }
			case 'd': { _day1 = parseInt(day1[fpos], 10); break; }
			case 'h': { hour1 = parseInt(day1[fpos], 10); hour1--; break; }
			case 'i': { min1 = parseInt(day1[fpos], 10); break; }
			case 's': { sec1 = parseInt(day1[fpos], 10); break; }
		}
		fpos++;
	}

	return new Date(year1, month1, _day1, hour1, min1, sec1, 0 );
}

/**
 * dateMunge
 * Convert date object to human readable string PURE
 * 
 * @param {number} din
 * @param {Date | string} ddefault
 * @param {bool =true} monthText - weather or not to pad a 1 digit month
 * @public
 * @return {string}
 */
export function dateMunge(din:number, ddefault:Date|string, monthText:boolean=true):string {
	var date:Date|string='';

	if( Number(din)===din && din%1===0 ) {
// second clause is to get ints, rather than floats
		if(din===0) {
			date="[No date]";
		} else if(din < 500000000000) {
			date=new Date(din*1000);
		} else {
			date=new Date(din);
		}
	} else {
		date =ddefault;
	}

	if(typeof date !== 'string') {
		var months=["", "Jan", "Feb", "March", "April", "May", "June",
			"July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
		date=" "+ pad( date.getDate() ) + '-' + 
			(monthText? months[ date.getMonth() + 1 ]:pad( date.getMonth()+1) ) +
			'-' + date.getUTCFullYear() +' ' +
			( monthText?"":pad( date.getHours()) +':00' ) ;
	}
	return date;
}

/**
 * appendIsland
 * An important util function, which removes need to jQuery, ShadowDOM AND other innerHTML hacks.
 * I have a historic avoidance of passing DOM object around the stack as it caused bad memory leaks.
 *    IMPURE
 
 * @param {string|HTMLElement} selector ~ where to appends the new content
 * @param {string} html ~ what to append
 * @param {Document =document} dom ~ reference to which DOM tree
 * @throws some sort of HTML error, if the supplied HTML is malformed.  Browser dependant
 * @protected
 * @return {undefined}
 */
export function appendIsland(selector:string|HTMLElement, html:string, dom:Document=document):void {
	try {
	if(dom===null) { throw new Error("Oh no ! initial object"); }
	const base:HTMLelement =dom.createElement('template');
	base.innerHTML=html;
	if(typeof selector === 'string') {
		let tt:HTMLElement= dom.querySelector(selector) as HTMLElement;
		if(tt===null) { console.log("QWE QWE ", dom.body.outerHTML );  throw new Error("Oh no ! "+selector); }
		tt.append( base.content);
	} else {
		return selector.append( base.content);
	}
	} catch(e ) {
		console.log("ERROR ", e);
	}
}

export function setIsland(selector:string|HTMLElement, html:string, dom:Document=document):any {
	const base=dom.createElement('template');
	base.innerHTML=html;
	if(typeof selector === 'string') {
		let tt=dom.querySelector(selector);
		while(tt && tt.lastChild) {
			tt.removeChild(tt.lastChild);
		}
		return tt.append( base.content);

	} else {
		while(selector && selector.lastChild) {
			selector.removeChild(selector.lastChild);
		}
		return selector.append( base.content);
	}
}


export const TEST_ONLY ={ getFetch, articleName, runFetch, isMobile, addLineBreaks, pad, currentSize, _getCookie, mapAttribute, importDate, dateMunge, appendIsland, setIsland, isFullstack };

