/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { appendIsland, dateMunge, isMobile, runFetch, mapAttribute, articleName, addLineBreaks, _getCookie } from './base';
import { APPEARANCE_COOKIE, TEST_MACHINE, CoreProps, MiscEvent  } from './all-types';
import { register, access } from './code-collection';
import { listContentGroup } from './adjacent';
import { Location, Document, HTMLElement } from 'jsdom';

register('main', siteCore);
register('siteCore', siteCore);
register("shareMastodon", shareMastodon);
register("copyURL",  copyURL);
register("tabChange", tabChange);

"use strict";

// variables across this module
// * @protected
let OPTS:CoreProps={} as CoreProps; 

// removed:
 // CorrectionModule.prototype.columnise = function () {     << now CSS 
 // CorrectionModule.prototype.biblioExtract = function () {  << runs HEAD
 // CorrectionModule.prototype.extractGET = function (val)  {<< UNUSED

 // CorrectionModule.prototype.tabChange = function ($e) {
 // CorrectionModule.prototype.tabInit = function (where) {

/**
 * openMastodon
 * Show extra UI for selecting a Mastodon server
 * Covert a click event to a DOM change
 * TODO: REWRITE to use the dialog open flag 
 * @param {Document =document} dom
 * @public
 * @return {false}
 */
function openMastodon(dom:Document=document):boolean {
	dom.querySelector('#popup').classList.add('open'); 
	dom.querySelector('#popup input').focus();
	return false;
}

/**
 * closeMastodon
 * Hide extra UI for selecting a Mastodon server
 * TODO: REWRITE 
 * 
 * @param {Document =document} dom
 * @public
 * @return {false}
 */
function closeMastodon(dom:Document=document):boolean {
	dom.querySelector('#popup').classList.remove('open');
	return false;
}

/**
 * openShare
 * Display/ hide the mobile share bar (both directions)
 * 
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {false}
 */
function openShare(dom:Document=document,loc:Location=location):boolean {
	if(loc.host!==TEST_MACHINE && !isMobile(dom, loc)) return false;

	let t= dom.querySelector('#shareMenu');
	if(t && !t.classList.replace('shareMenuOpen', 'shareMenu')) {
		t.classList.replace('shareMenu', 'shareMenuOpen'); 
	} 
	return false;
}

/**
 * copyURL
 * Copy the current URL into the paste buffer, for use in mobile view
 * @TODO  add feedback CSS when copy worked
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
				// look at edit label?  ideate: text white to green for 2s
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
 * shareMastodon
 * Effect the share to the choen mastodom server
 * 
 * @param {Document =document} dom
 * @public
 * @return {false}
 */
function shareMastodon( dom:Document=document):boolean {
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
		window.open(server, "_blank" );
	} catch(e) { 
		this.log("ERROR", e); 
	}
	openShare(); 
	return false;
}

/**
 * _map
 * Add several event listeners, just a utility
 * 
 * @TODO define type for handler
 * @param {HTMLElement} where
 * @param {Function} action
 * @public
 * @return {void}
 */
function _map(where:HTMLElement, action:Function):void {
	where.addEventListener('click', action);
	where.addEventListener('touch', action);
	where.addEventListener('keypress', action);
}

/**
 * initMastodon
 * Register the event handlers for a mastodon sharing
 * 
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function initMastodon(dom:Document=document, win:Window=window):void {
	let BUFFER=dom.querySelectorAll('#shareMenu #mastoTrigger');
	for(let i in BUFFER ) {
		_map(BUFFER[i], openMastodon);
	}

	BUFFER=dom.querySelector('#shareGroup .allButtons #mastoTrigger'); 
	let canSee='';
	if(BUFFER.computedStyleMap ) {
		canSee= BUFFER.computedStyleMap()['display'];
	} else { // FF support
		let tt=win.getComputedStyle(BUFFER, null);
		canSee= tt.getPropertyValue("display");
	}

	if( BUFFER.length >0 && canSee!=='none' ) {
		for(let i in BUFFER ) {
			BUFFER[i].addEventListener('click', openMastodon);
			BUFFER[i].addEventListener('keypress', openMastodon);
		}	
	}
	_map(dom.querySelector('#copyURL'), this.copyURL);
	_map(dom.querySelector('#popup #sendMasto'), this.shareMastodon );
	BUFFER= dom.querySelectorAll('#shareMenuTrigger, #shareClose ');
	for(let i in BUFFER) {
		_map(BUFFER[i], openShare);
	};
	_map(dom.querySelector('#hideMaston'), closeMastodon );	
}

/**
 * initPopupMobile
 * Create the popup bar for mobile
 * 
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function initPopupMobile( dom:Document=document, loc:Location=location):void {
	if( loc.host!==TEST_MACHINE && !isMobile(dom, loc)) { return; }

	if(isMobile(dom, loc)) {
		dom.querySelector('#sendMasto').innerText="Share article";
	}
	let html=[ '<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>',];
	const bigScreenElements=["shareMenuTrigger", "siteChartLink", "rssLink" ];
	const BUFFER=dom.querySelectorAll('.allButtons a');
	for(let i in BUFFER) {
		if(bigScreenElements.includes( BUFFER[i].id) ) { 
			continue;
		}

		let local=BUFFER[i].cloneNode(true);
		local.classList.remove('bigScreenOnly');
		html.push('<li>');
		html.push(local.outerHTML);   // I don't like this line
		html.push('</li>');
	}
	html.unshift('<div class="shareMenu" id="shareMenu"><menu id="mobileMenu" >' );
	html.push('</menu></div>');

	appendIsland('#navBar', html.join(), dom); 
}

/**
 * storeAppearance
 * Write supplied data to a cOOKIE
 * 
 * @param {string} ft - font
 * @param {string} fs - font-size
 * @param {string} dir - direction, mostly unused 
 * @param {string} clr - color scheme
 * @public
 * @return {void}
 */
function storeAppearance(ft:string, fs:string, dir:string, clr:string ):void {
	const COOKIE=_getCookie();
	const json=JSON.stringify( {ft:ft, fs:fs, dn:dir, cr:clr } );
	COOKIE.set(APPEARANCE_COOKIE, json, 365.254);	
}

/**
 * applyAppearance
 * Apply branding settings found in a COOKIE
 * 
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function applyAppearance(dom:Document=document):void {
	const COOKIE=_getCookie();

	const dat=COOKIE.get( APPEARANCE_COOKIE);
	if(!dat) {
		return;
	}

	const dat2=JSON.parse( dat);
	if(! (dat2['ft'] && dat2['fs']) ) {
		return; 
	}
	let CSS="body, .annoyingBody { font-family: "+dat2['ft']+"; font-size: "+dat2['fs']+
			"; direction:"+dat2['dn']+"; }";
		
	const STYLE=dom.createElement('style');
	STYLE.setAttribute('id', "client-set-css");
	STYLE.innerText=CSS;
	dom.getElementsByTagName('head')[0].append( STYLE);
}

/**
 * burgerMenu
 * Util to manage state in the burgermenu

 * @param {string =".burgerMenu"} id - HTML id for the menu
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function burgerMenu(id:string=".burgerMenu", dom:Document=document):void {
	let  t=dom.querySelector(id);
	if( !t.getAttribute('data-state') ) {
		t.classList.add('burgerMenuOpen');
		t.setAttribute('data-state', 1);
	} else {
		t.classList.remove('burgerMenuOpen');
		t.setAttribute('data-state', null);
	}
}

/**
 * tabChange
 * Change which tab is visible
 * 
 * @param {string} id - HTML id for the menu
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function tabChange(id:string|MiscEvent, dom:Document=document):void {
	let thing:HTMLElement|null=null;
	if(typeof id==='string') {
		thing=dom.querySelector(id) as HTMLElement;
	} else {
		let tmp:HTMLElement=id.target;
		thing= dom.querySelector(tmp.id) as HTMLElement;
	}
	if(!thing) { 
		this.log("ERROR", "Malconfigured tabs!! "+id+" matches nothing");
		return;
	}

	let iter=dom.querySelectorAll(".tabsComponent .tabs-panel");
	for(let i=0; i< iter.length; i++) {
		iter[i].classList.remove('is-active');
	}
	let alive=dom.querySelectorAll(".tabsComponent "+thing.getAttribute('data-href'));	
	if(alive.length > 1) {
		throw new Error("Labels on tabs must be unique, or tabs don't work.");
	}
	alive[0].classList.add('is-active');
} 

/**
 * siteCore
 * Applies all the functions in this file to the DOM
 * 
 * @param {CoreProps} opts -see docs, at top of file
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {void}
 */
export function siteCore(opts:CoreProps, dom=document, loc=location):void {
	let u=new URLSearchParams();
	OPTS=Object.assign(
      {
        tabs: {},
		mobileWidth:700,
    }, opts);

    let tt=dom.querySelectorAll('.noJS');
	for(let i=0; i<tt.length; i++) {
		tt[i].classList.remove('noJS');
	}
	const ROOT=access();
	ROOT.debug=() => { return u.has('debug'); }

	_map('#pageMenu', burgerMenu);
	initPopupMobile(dom);
	initMastodon(dom);
	ROOT.addOctoCats(dom);
	ROOT.addBooks(dom); 
	ROOT.addFancyButtonArrow(dom);
	ROOT.addBashSamples(dom);
	applyAppearance(dom);

  	if (!isMobile(dom. loc) && loc.pathname !== '/resource/home' && dom.querySelectorAll('.reading').length<2 ) {
		ROOT.readingDuration({
                    dataLocation: "#main",
                    target: ".addReading",
                    debug: ROOT.debug(),
					refresh:1,
                    linkTo: '/resource/jQuery-reading-duration'
                });
    }

// pull this out
	ROOT.biblio({
		tocEdit: 1,
		width: OPTS.mobileWidth,
		debug: ROOT.debug(),
		extendViaDownload: 4,
		tooltip:1,
		renumber:1
		});

	{ 
		let tabs=dom.querySelectorAll('.tabsComponent');
		for(let i=0; i<tabs.length; i++) {
			let btns=tabs[i].querySelectorAll('.label.button');
			for(let j=0; j<btns.length; j++) {
				_map(btns[j], ROOT.tabChange);
			}
		}
	}

	if(loc.pathname.match('group-')) {
		let tt=loc.pathname.split('/group-');
		if( Array.isArray( tt) && tt.length>1 && tt[1].length ) {
			ROOT.adjacent({group: tt[1], debug:ROOT.debug}, dom, loc);  
		}

	} else {
		let grp=listContentGroup('div#contentGroup');
		for(let j=0; j<grp.length; j++) {
			ROOT.adjacent({group: grp[j], debug:ROOT.debug, iteration:j, count:grp.length }, dom, loc);  
		}
	}
	
	if(typeof pageStartup === 'function') {
		pageStartup();
	}
}

/** 
 * Only use for testing, it allows access to the entire API 
 */
export const TEST_ONLY ={ 
 openMastodon,
 closeMastodon,
 openShare,
 copyURL,
 shareMastodon,
 _map,
 initMastodon,
 initPopupMobile,
 storeAppearance,
 applyAppearance,
 burgerMenu,
 tabChange,
 siteCore,

};
