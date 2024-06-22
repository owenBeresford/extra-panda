/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { Location, Document, HTMLElement } from 'jsdom';

import { APPEARANCE_COOKIE, TEST_MACHINE, CoreProps, MiscEvent  } from './all-types';
import { dateMunge, runFetch, mapAttribute, articleName, addLineBreaks, _getCookie } from './string-base';
import { register, access } from './code-collection';
import { listContentGroup } from './adjacent';
import { initMastodon } from './mastodon';
import { isFullstack, isMobile, appendIsland } from './dom-base';

register('main', siteCore);
register('siteCore', siteCore);
register("tabChange", tabChange);

"use strict";

// variables across this module
// * @protected
let OPTS:CoreProps={} as CoreProps; 

// removed:
 // CorrectionModule.prototype.columnise = function ()    << now CSS 
 // CorrectionModule.prototype.biblioExtract = function ()  << runs HEAD
 // CorrectionModule.prototype.extractGET = function (val)  << UNUSED

 // CorrectionModule.prototype.tabChange = function ($e) {
 // CorrectionModule.prototype.tabInit = function (where) {

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
	let html=[ '<nav><li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>',];
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
	html.push('</menu></div></nav>');

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
export function siteCore(opts:CoreProps, dom=document, loc=location, win:Window=window):void {
	OPTS=Object.assign( {
        tabs: {},
		mobileWidth:700,
    }, opts);

    let tt=dom.querySelectorAll('.noJS');
	for(let i=0; i<tt.length; i++) {
		tt[i].classList.remove('noJS');
	}
	const ROOT=access();

	_map('#pageMenu', burgerMenu);
	initPopupMobile(dom);
	initMastodon(dom, loc, win);
	ROOT.addOctoCats(dom);
	ROOT.addBooks(dom); 
	ROOT.addFancyButtonArrow(dom);
	ROOT.addBashSamples(dom);
	applyAppearance(dom);

  	if (!isMobile(dom, loc) && loc.pathname !== '/resource/home' && dom.querySelectorAll('.reading').length<2 ) {
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
			ROOT.adjacent({group: tt[1], debug:ROOT.debug()}, dom, loc);  
		}

	} else {
		let grp=listContentGroup('div#contentGroup');
		for(let j=0; j<grp.length; j++) {
			ROOT.adjacent({group: grp[j], debug:ROOT.debug(), iteration:j, count:grp.length }, dom, loc);  
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
 _map,
 initPopupMobile,
 storeAppearance,
 applyAppearance,
 burgerMenu,
 tabChange,
 siteCore,

};
