/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import { Cookieable, Fetchable, SimpleResponse, ScreenSizeArray, MOBILE_MIN_PPI, BOUNDARY, MiscEventHandler } from './all-types';
import { register } from './code-collection';
import { isFullstack, isMobile } from './dom-base';

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
		if(trans.headers.get('content-type').toLowerCase().startsWith('application/json')) {
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
 * _map
 * Add several event listeners, just a utility
 * UNUSED till I can use Golang grade types
 * 
 * @param {HTMLElement} where
 * @param {MiscEventHandler } action
 * @public
 * @return {void}
 */
function _map(where:HTMLElement, action:MiscEventHandler, args:Array<any>|undefined=undefined):void {
	if(args) {
		where.addEventListener('click', (a:Event)=>{ return action(a, ...args); });
		where.addEventListener('touch', (a:Event)=>{ return action(a, ...args); });
		where.addEventListener('keypress', (a:Event)=>{ return action(a, ...args); });
		
	} else {
		where.addEventListener('click', action);
		where.addEventListener('touch', action);
		where.addEventListener('keypress', action);
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
	let tmp:string='';  let tmp2:string[]=[];
	if(loc.href.indexOf('?')>0) {
		tmp=loc.href.substring(0, loc.href.indexOf('?'));
	} else {
		tmp=loc.href;
	} 
	tmp2=tmp.split('/');
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
 * This code would be much simpler if I could make unsigned number or exclusive counting number types
 * 
 * @param {number} num
 * @public
 * @return {string} - the result
 */
export function pad(num:number):string {
	var r = String(num);
	if( num ===0 || num <1) { 
		throw new Error("Value passed must be a counting number above 0"); 
	}
	if ( r.length === 1 ) {
		r = '0' + r;
	}
	return r;
}


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
 * @param {BOUNDARY} attrib - One of top|bottom|left|right|width|height
 * @public
 * @return {number } - the value of the requested
 */
export function mapAttribute(ele:HTMLElement, attrib:BOUNDARY):number {
	try {
		if(! isFullstack() ) { 
			return -1;
		}
	
		let STYL = ele.getBoundingClientRect();
		return STYL[attrib];
	} catch(e) {
		console.log("error", "Missing data:"+e);
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
export function importDate(format:string, day:string="", time:string=""):Date {
	let day1:string; let time1:string; let fpos:number; let buf:Array<string>;
	let year1:number; let month1:number; let _day1:number; let hour1:number; let min1:number; let sec1:number;
	let day1a:Array<string>; let time1a:Array<string>;

	if( time==="" && day) {
		let tt       =day.split('T');
		if(tt.length===2) {
			[day1, time1] =[tt[0], tt[1]];
		}
		tt			=day.split(' ');
		if(tt.length===2) {
			[day1, time1] =[String(tt[0]), tt[1]];
		}
		if(typeof day1 === "undefined") {
			day1   =day;
			time1  ="";
		}
		
	} else if (day && time ){
		day1		=day; 
		time1		=time;
	} 	

	if(!day1 ) {
		throw new Error("importDate: No values supplied"); 
	} else if(day1.indexOf('-')>0 ){ // if - is in first char position, its still bad, so skip that option
		day1a       = day1.split('-');
	} else {        
		day1a       = day1.split('/');
	} 
	time1a          = time1.split(':');
	buf			=[ ...day1a, ...time1a];

// note very clearly: this is array fragment offset, not char offset
	fpos           = 0; 
	while(fpos<format.length) {
// have switch statement, as data sequence is set by the caller
// so can't array.map or something
		switch(format.charAt(fpos)) {
			case 'y': { year1 = parseInt(buf[fpos], 10); break; }
			case 'm': { month1 = parseInt(buf[fpos], 10); month1--; break; }
			case 'd': { _day1 = parseInt(buf[fpos], 10); break; }
			case 'h': { hour1 = parseInt(buf[fpos], 10); break; }
			case 'i': { min1 = parseInt(buf[fpos], 10); break; }
			case 's': { sec1 = parseInt(buf[fpos], 10); break; }
			default: break; // white-space etc ignored on purpose
		}
		fpos++;
	}
// NOTE dates always in current and local TZ, even if date isn't
	return new Date(year1, month1, _day1, hour1, min1, sec1, 0 );
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
export function dateMunge(din:number, ddefault:Date|string, monthText:boolean=true):string {
	var date:Date|string='';

	if( Number(din)===din && din%1===0 ) {
// second clause above is to get ints, rather than floats
		if(din===0) {
			date="[No date]";
		} else if(din < 10000000000) {
			date=new Date(din*1000);
		} else {
			date=new Date(din);
		}
	} else {
		date =ddefault;
	}

	if(typeof date !== 'string') {
		let months=["", "Jan", "Feb", "March", "April", "May", "June",
			"July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
		let hours;
		if( date.getHours() ) {
			hours=pad( date.getHours() );
		} else {
			hours="00";
		}

		date=" "+ pad( date.getDate() ) + '-' + 
			(monthText? months[ date.getMonth() + 1 ]:pad( date.getMonth()+1) ) +
			'-' + date.getUTCFullYear() +' ' +
			( monthText?"":hours +':00' ) ;
	}
	return date;
}


export const TEST_ONLY ={ getFetch, articleName, runFetch, addLineBreaks, pad, makeRefUrl,  _getCookie, mapAttribute, importDate, dateMunge, _map };

