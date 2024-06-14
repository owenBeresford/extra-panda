/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { appendIsland, dateMunge, isMobile, runFetch, mapAttribute, articleName, addLineBreaks, _getCookie,  APPEARANCE_COOKIE, TEST_MACHINE } from './base';
import { register, access } from './vanilla';
import { listContentGroup } from './adjacent';

register('main', siteCore);
register('siteCore', siteCore);
"use strict";

// variables across this module
// * @protected
let OPTS={}; 

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
 * 
 * @param {Document =document} dom
 * @public
 * @return {false}
 */
function openMastodon(dom=document) {
	doc.querySelector('#popup').classList.add('open'); 
	doc.querySelector('#popup input').focus();
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
function closeMastodon(dom=document) {
	doc.querySelector('#popup').classList.remove('open');
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
function openShare(dom=document,loc=location) {
	if(loc.host!==TEST_MACHINE && !isMobile(loc)) return false;

	let t= doc.querySelector('#shareMenu');
	if(t && !t.classList.replace('shareMenuOpen', 'shareMenu')) {
		t.classList.replace('shareMenu', 'shareMenuOpen'); 
	} 
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
function copyURL(loc=location) {
	try {
		navigator.clipboard.writeText(loc.url).then(
			() => {
				console.log("copied url");
				// look at edit label?
			},
			(e1, e2) => {
				console.error("FAILED: copy URL ", e1, e2);
  			},
		);
	} catch(e0) {
		console.error("FAILED: copy URL feature borked ", e0);
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
function shareMastodon( dom=document) {
	try {
		let tmp=dom.querySelector('#mastodonserver');
		let server= tmp.value;
		let url   = tmp.getAttribute('--data-url');
		if(server==="" || server===null) { return false; }

		server="https://"+server+"/share?text=I+think+this+is+important+"+url;
		dom.querySelector('#popup').classList.remove('open');
		console.log("Trying to open mastodon server ", server);
		window.open(server, "_blank" );
	} catch(e) { console.log("ERROR", e); }
	// cant auto-close share bar; 'this' is DOM element due to jQuery #leSigh
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
function _map(where, action) {
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
function initMastodon(dom=document) {
	dom.querySelectorAll('#shareMenu #mastoTrigger').forEach(function( val, i ){
		_map(val, openMastodon);
	});
	let tmp=dom.querySelector('#shareGroup .allButtons #mastoTrigger'), canSee='';
	if(tmp.computedStyleMap ) {
		canSee= tmp.computedStyleMap()['display'];
	} else { // FF support
		let tt=window.getComputedStyle(tmp, null);
		canSee= tt.getPropertyValue("display");
	}

	if( tmp.length >0 && canSee!=='none' ) {
		tmp.forEach(function( val, i ){
			val.addEventListener('click', openMastodon);
			val.addEventListener('keypress', openMastodon);
		});
	}
	_map(dom.querySelector('#copyURL'), copyURL);
	_map(dom.querySelector('#popup #sendMasto'), shareMastodon );
	dom.querySelectorAll('#shareMenuTrigger, #shareClose ').forEach(function( i, val ){
		_map(val, openShare);
	});
	_map(dom.querySelector('#hideMasto '), closeMastodon );	
}

/**
 * initPopupMobile
 * Create the popup bar for mobile
 * 
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function initPopupMobile( dom=document) {
	if( location.host!==TEST_MACHINE && !isMobile()) { return; }

	if(isMobile()) {
		dom.querySelector('#sendMasto').innerText="Share article";
	}

	let html=[ '<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>',];
	const bigScreenElements=["shareMenuTrigger", "siteChartLink", "rssLink" ];
	dom.querySelectorAll('.allButtons a').forEach((thing, i ) => {
		if(bigScreenElements.includes( thing.id) ) { return; }

		let local=thing.cloneNode(true);
		local.classList.remove('bigScreenOnly');
		html.push('<li>');
		html.push(local.outerHTML);   // I don't like this line
		html.push('</li>');
	});
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
function storeAppearance(ft, fs, dir, clr ) {
	const struct= {ft:ft, fs:fs, dn:dir, cr:clr };
	const json=JSON.stringify( struct);
	const COOKIE=_getCookie();
	COOKIE.set(APPEARANCE_NAME, json, 365.254);	
}

/**
 * applyAppearance
 * Apply branding settings found in a COOKIE
 * 
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function applyAppearance(dom=document) {
	const COOKIE=_getCookie();

	const dat=COOKIE.get( APPEARANCE_COOKIE);
	if(dat) {
		const dat2=JSON.parse( dat);
		let CSS="";
		if( dat2['ft'] && dat2['fs'] ) {
			CSS="body, .annoyingBody { font-family: "+dat2['ft']+"; font-size: "+dat2['fs']+"; direction:"+dat2['dn']+"; }";
		}
		
		const STYLE=dom.createElement('style');
		STYLE.setAttribute('id', "client-set-css");
		STYLE.innerText=CSS;
		dom.getElementsByTagName('head')[0].append( STYLE);
	}
}

/**
 * burgerMenu
 * Util to manage state in the burgermenu

 * @param {string} id - HTML id for the menu
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function burgerMenu(id=".burgerMenu", dom=document) {
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
function tabChange(id, dom=document) {
	let thing=undefined;
	if(typeof id==='string') {
		thing=dom.querySelector(id);
	} else {
		thing= dom.querySelector(id.target.id);
	}

	let iter=dom.querySelectorAll(".tabsComponent .tabs-panel");
	for(let i=0; i< iter.length; i++) {
		iter[i].classList.remove('is-active');
	}
	let alive=dom.querySelectorAll(".tabsComponent "+thing.getAttribute('data-href'));	
	alive.classList.add('is-active');
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
export function siteCore(opts, dom=document, loc=location) {
	let u=new URLSearchParams();
	OPTS=Object.assign(
      {
        debug: u.has('dbg') ,
        menuTop: 170,
        tabs: {},
        mobileWidth: 700,
        prevCols: 0,
    }, opts);

    let tt=dom.querySelectorAll('.noJS');
	for(let i=0; i<tt.length; i++) {
		tt[i].classList.remove('noJS');
	}
	const ROOT=access();

	_map('#pageMenu', burgerMenu);
	initPopupMobile(dom);
	initMastodon(dom);
	ROOT.addOctoCats(dom);
	ROOT.addBooks(dom); 
	ROOT.addFancyButtonArrow(dom);
	ROOT.addBashSamples(dom);
	applyAppearance(dom);

  	if (!isMobile() && loc.pathname !== '/resource/home' && dom.querySelectorAll('.reading').length<2 ) {
		ROOT.readingDuration({
                    dataLocation: "#main",
                    target: ".addReading",
                    debug: OPTS.debug,
					refresh:1,
                    linkTo: '//owenberesford.me.uk/resource/jQuery-reading-duration'
                });
    }

// pull this out
	ROOT.biblio({
		tocEdit: 1,
		width: OPTS.mobileWidth,
		debug: OPTS.debug,
		loosingElement: id,
		extendViaDownload: 4,
		referencesCache: url,
		tooltip:1,
		renumber:1
		});

	{ 
		let tabs=dom.querySelectorAll('.tabsComponent');
		for(let i=0; i<tabs.length; i++) {
			let btns=tabs[i].querySelectorAll('.label.button');
			for(let j=0; j<btns.length; j++) {
				_map(btns[j], tabChange);
			}
		}
	}

	if(loc.pathname.match('group-')) {
		let tt=loc.pathname.split('/group-');
		if( Array.isArray( tt) && tt.length>1 && tt[1].length ) {
			ROOT.adjacent({group: tt[1], debug:OPTS.debug}, dom, loc);  
		}

	} else {
		let grp=listContentGroup('div#contentGroup');
		for(let j=0; j<grp.length; j++) {
			ROOT.adjacent({group: grp[j], debug:OPTS.debug, iteration:j, count:grp.length }, dom, loc);  
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
