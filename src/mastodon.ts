/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { Document, Location, Window, Event, HTMLAnchorElement, HTMLElement } from 'jsdom';

import { register, access } from './code-collection';
import { appendIsland, setIsland, pullout, isMobile} from './base';
import { MiscEventHandler, TEST_MACHINE } from './all-types';

"use strict";
register("shareMastodon", shareMastodon);
register("copyURL",  copyURL);

/**
 * openShare
 * Display/ hide the mobile share bar (both directions)
 * 
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {false}
 */
function openShare(e:Event, dom:Document=document, loc:Location=location):boolean {
	if(loc.host!==TEST_MACHINE && !isMobile(dom, loc)) return false;

	let t= dom.querySelector('#shareMenu');
	if(t && !t.classList.replace('shareMenuOpen', 'shareMenu')) {
		t.classList.replace('shareMenu', 'shareMenuOpen'); 
	} 
	return false;
}

/**
 * shareMastodon
 * Effect the share to your chosen Masto server 
 * 
 * @param {Event} e
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @param {Window =window} win
 * @public
 * @return {boolean}
 */
function shareMastodon(e:Event, dom:Document=document, loc:Location=location, win:Window=window):boolean {
	try {
		let tmp=dom.querySelector('#mastodonserver');
		let server= tmp.value;
		let url   = tmp.getAttribute('--data-url');
		if(server==="" || server===null) { 
			return false; 
		}

		server="https://"+server+"/share?text=I+think+this+is+important+"+url;
		dom.querySelector('#popup').classList.remove('open');
		this.log("info", "Trying to open mastodon server, "+ server);
		win.open(server, "_blank" );
	} catch(e) { 
		this.log("ERROR", e); 
	}
	openShare(e, dom, loc); 
	return false;
}

/**
 * accessVisibility
 * Util function to isolate access to styles
 * 
 * @param {HTMLElement} buf 
 * @param {string ='display'} what
 * @param {Window =window } win
 * @public
 * @return {void}
 */
function accessVisibility(buf:HTMLElement, what:string='display', win:Window=window ):string {
	let canSee='';
	if(buf.computedStyleMap ) {
		canSee= buf.computedStyleMap()[what];
	} else { // FF support
		let tt=win.getComputedStyle(buf, null);
		canSee= tt.getPropertyValue(what);
	}
	return canSee;
}

/**
 * initMastodon
 * Register the event handlers for a mastodon sharing
 * 
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
export function initMastodon(dom:Document=document, loc:Location=location, win:Window=window):void {
	let BUFFER=dom.querySelector('#shareMenu #mastoTrigger');
	for(let i in BUFFER ) {
		_map(BUFFER[i], openMastodon, [dom]);
	}

	BUFFER=dom.querySelector('#shareGroup .allButtons #mastoTrigger'); 
	let canSee=accessVisibility( BUFFER, 'display',  win);
	if( BUFFER.length >0 && canSee!=='none' ) {
		for(let i in BUFFER ) {
			BUFFER[i].addEventListener('click', (e:Event):boolean =>{ return openMastodon(e, dom); });
			BUFFER[i].addEventListener('keypress', (e:Event):boolean =>{ return openMastodon(e, dom); });
		}	
	}
	_map(dom.querySelector('#copyURL'), copyURL, [loc]);
	_map(dom.querySelector('#popup #sendMasto'), shareMastodon, [dom, win] );
	BUFFER= dom.querySelectorAll('#shareMenuTrigger, #shareClose ');
	for(let i in BUFFER) {
		_map(BUFFER[i], openShare, [dom, loc]);
	};
	_map(dom.querySelector('#hideMaston'), closeMastodon, [dom] );	
}


/**
 * openMastodon
 * Show extra UI for selecting a Mastodon server
 * Covert a click event to a DOM change
 * @param {Event } e
 * @param {Document =document} dom
 * @public
 * @return {false}
 */
function openMastodon(e:Event, dom:Document=document):boolean {
	dom.querySelector('#popup').showModal(); 
	dom.querySelector('#popup input').focus();
	return false;
}

/**
 * closeMastodon
 * Hide extra UI for selecting a Mastodon server
 * 
 * @param {Document =document} dom
 * @public
 * @return {false}
 */
function closeMastodon(e:Event, dom:Document=document):boolean {
	dom.querySelector('#popup').close();
	return false;
}

/**
 * copyURL
 * Copy the current URL into the paste buffer, for use in mobile view
 *
 * @param {Location =location} loc
 * @public
 * @return {void}
 */
function copyURL(loc:Location=location):void {
	try {
		navigator.clipboard.writeText(loc.url).then(
			() => {
				return;
			},
			(err) => {
				this.log("error", "FAILED: copy URL "+ err);
  			},
		);
	} catch(e0) {
		this.log('error', "FAILED: copy URL feature borked "+e0);
	}
}



/**
 * _map
 * Add several event listeners, just a utility
 * 
 * @param {HTMLElement} where
 * @param {MiscEventHandler } action
 * @public
 * @return {void}
 */
function _map(where:HTMLElement, action:MiscEventHandler, args:Array<any>|undefined=undefined):void {
	if(args) {
		where.addEventListener('click', (a:Event):boolean =>{ return action(a, ...args); });
		where.addEventListener('touch', (a:Event):boolean =>{ return action(a, ...args); });
		where.addEventListener('keypress', (a:Event):boolean =>{ return action(a, ...args); });
		
	} else {
		where.addEventListener('click', action);
		where.addEventListener('touch', action);
		where.addEventListener('keypress', action);
	}
}




/** 
 * Only use for testing, it allows access to the entire API 
 */
export const TEST_ONLY ={ 
	shareMastodon, 
	_map,
	closeMastodon,
	openMastodon,
	initMastodon, 
	copyURL, 
	accessVisibility,
	openShare,
};

