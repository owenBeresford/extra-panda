/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

/**
 * getFetch
 * Access to fetch that is will work across JS interpreters
 *   PURE 

 * @public
 * @return {Fetch object}
 */
export function getFetch() {
	if (typeof window !=="undefined") {
		return window.fetch;
	} else if(typeof fetch==="function") {
		return fetch;
	} else {
		console.error("please stop using old node");
	}
}

export const TEST_MACHINE='192.168.0.35';
export const APPEARANCE_COOKIE='appearance';

/**
 * articleName
 * Extract article name from location
 *    PURE

 * @param {Location =location} loc
 * @public
 * @return {string}
 */
export function articleName(loc=location) {
	return loc.pathname.split('/').pop() || "<name>";
}

/**
 * runFetch
 * A simple wrapper current fetch()   IOIO LOGGING!!
 *  IMPURE This behaves as a VERY SIMPLE middle-ware.
 * 
 * @param {string} url
 * @param {boolean} trap ~ return null rather than an exception
 * @public
 * @throws {Error} = predictably, in case of network issue
 * @return {SimpleFetchable}
 */
export async function runFetch(url, trap) {
	const f=getFetch();
	try {
		let trans=await f(url, {credentials:"same-origin", } ); 
		if(!trans.ok) {
			if(trap) { return { body:[], headers:[], ok:false}; }
			else { throw new Error("ERROR getting asset "+url); }
		} 
		let tt=await trans.body.getReader().read();
		return {body:tt, headers:trans.headers, ok:true};
	} catch(e) {
		if(trap) { return { body:[], headers:[], ok:false}; }
		else { throw new Error("ERROR getting asset "+url); }
	}
}

/**
 * isMobile
 * Statically workout if this is mobile
 * 
 * @public
 * @return {bool} ~ is this Mobile?  
 */
export function isMobile(dom=document) {
	try{ doc.createEvent("TouchEvent"); return true; }
	catch(e){ 
		let u=new URLSearchParams();
		if(u.has('mobile')) { return true; }
		return false;
	}
};

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
export function addLineBreaks(str, len=80, token="↩") {
	if(!str || str.length < len) {
		return ""+str;
	}
	let marker=0, out=[];
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
export function pad(num) {
	var r = String(num);
	if ( r.length === 1 ) {
		r = '0' + r;
	}
	return r;
}

    /**
     * currentSize
     * Utility function to report the tab size...
     // I use this in debugging RWD PURE

     * @public
     * @return {ScreenSizeArray}
     */
    function currentSize() {
        var d = document, root = d.documentElement, body = d.body;
        var wid = window.innerWidth || root.clientWidth || body.clientWidth;
        var hi = window.innerHeight || root.clientHeight || body.clientHeight;
        wid = parseInt(wid, 10);
        hi = parseInt(hi, 10);
        return [wid, hi];
    }
if (typeof window !=="undefined") {
	window.currentSize=currentSize;
} 

// source code copied from: then amended
// https://www.tabnine.com/academy/javascript/how-to-set-cookies-javascript/
// as common libraries outside of npm seem really flakey
class COOKIE {
	set(cName, cValue, expDays) {
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

	get(cName) {
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
export function _getCookie() {
// first option is for chrome based browsers, 
// technically served via a JS plugin that is always present
	if(typeof getCookie) {
		return { get:getCookie, set:setCookie };
	} 
	return new COOKIE();
}


/**
 * mapAttribute
 * Extract the named limit of the element
 * PURE
 * 
 * @param {HTMLElement} ele
 * @param {string} attrib - One of top|bottom|left|right
 * @public
 * @return {0 | string} - the value of the requested
 */
export function mapAttribute(ele, attrib) {
	try {
		let STYL = ele.getBoundingClientRect();
		return STYL[attrib];
	} catch(e) {
		this.log("Missing data:"+e);
		return 0;
	}
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
 * @return {string} 
 */
export function importDate(format, day="", time) {
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
 * @param {Date} din
 * @param {Date | string} ddefault
 * @param {bool =true} monthText - weather or not to pad a 1 digit month
 * @public
 * @return {string}
 */
export function dateMunge(din, ddefault, monthText=true) {
	var date='';

	if( Number(din)===din && din%1===0 ) {
		date=new Date(din*1000);
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
export function appendIsland(selector, html, dom=document) {
	const base=dom.createElement('template');
	base.innerHTML=html;
	if(typeof selector === 'string') {
		return dom.querySelector(selector).append( base.content);
	} else {
		return selector.append( base.content);
	}
}

