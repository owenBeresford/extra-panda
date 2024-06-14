/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { appendIsland, dateMunge, isMobile, runFetch, mapAttribute } from './base';
import { register } from './vanilla';

register("createAdjacentChart", createAdjacentChart );

// variables across this module
let OPTS={};

/**
 * mapURL
 * Extract sections of URL used for the meta data files so it can be applied to the local page.
 * 
 * @param {string} article
 * @param {string} suffix
 * @public
 * @return {string} - the desired full URL of this page 
 */
function mapURL(article, suffix) {
	var wl=window.location;

	var t=wl.protocol+'//'+wl.host, t2=wl.pathname.split('/');
	t2=t2.pop();
	let tmp=new URLSearchParams(location.search);
	if(t2==='group-XXX' && tmp.has('first')) {
		t2=tmp.get('first');
	} 
	if(suffix) {
		if(tmp.has('first')) {
			t+=wl.pathname.replace("group-XXX", t2+"-meta");
		} else {
			t+=wl.pathname.replace(t2, article+"-meta");
		}
	} else {
		t+=wl.pathname.replace(t2, article);
	}
	t+=wl.search+wl.hash;
	return t;
}

/**
 * createStyle
 * Compute the relevant CSS classes for this item
 * 
 * @param {bool} isLong
 * @param {number} isOffscreen - unused in current version
 * @public
 * @return {string}
 */
function createStyle(isLong, isOffscreen) {
	let clsNm="button";
	if(isLong) { clsNm += " lower"; }	
	// I removed this feature
	//		if(isOffscreen ) { clsNm += " left"; }
	return clsNm;
}

/**
 * cleanTitle
 * Manipulate string so it can be used as a DOM id
 * 
 * @param {string} id
 * @param string{} group 
 * @public
 * @return {string}
 */
function cleanTitle(id, group ) {
	return group +""+id.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * generateGroup
 * Get the article group name from supplied data OR the URL
 * Will be supplied in OPTS for normal pages
 * Will be on the URL for the group indexes
 *
 * @param {Location =location} loc 
 * @public
 * @throws when insufficient data has been supplied
 * @return {string}
 */
function generateGroup(loc=location ) {
	let foreward=OPTS.group;
	if(OPTS.group==="XXX" ) {
		let tmp=new URLSearchParams(loc.search);
		if( tmp.has('first')) {
			foreward=tmp.get('first');
		} 
	}
	if(foreward==="XXX") {
		throw new Error("Thou shalt supply the group somewhere");
	}
	return foreward;
}

/**
 * normaliseToList ~ 
 * The success handler, does the actual work.
 * Not much security on here, but its the client.
 * 
 * @param {string|hash|array} data - Mixed return type is when JSON is the data encoding
 * @param {string} status
 * @param {XHR} ~ the wrapped XHR object, ignored
 * @return {Array<ReferenceType>}
 */
function normaliseToList(data) {
	var me=-1, thispage=OPTS.name, remainder=OPTS.nextBar, list={};
	if (OPTS.name === "group-"+OPTS.group) {
		me=0;
		remainder=data.length;
	}
//		(me, remainder, i) =nextStep("", OPTS.name, data.length, 0 );

	for(let i=0; i<data.length; i++) { 
		var name= data[i].title;
		if(name && me>=0 && remainder>0 ) {    
			list[ name]=data[i];

			list[name].renderTitle=list[name].title.substr(0, OPTS.titleLimit);
			if(name.length>OPTS.titleLimit) {
				list[name].renderTitle+="...";
			}
			remainder--;
		}
		let tt=	data[i].descrip;
		if(tt.length>235) { list[name].descrip=tt.substr(0, 235)+"..."; }

		var asset=data[i].url.split('/').pop();
//		(me, remainder, i) =nextStep(asset, OPTS.name, data.length, i );

		// note: round robin algo
		if(thispage === asset) {
			me=i;
		}
		if(me>=0 && remainder >0 && i===data.length-1 ) {
			i=0;
		}
	}
	return Array.values(list);
}

/**
 * nextStep
 * UNTESTED, a function map next values, to make other code simpler 
 * only add to runtime after testing...
 * 
 * @param {string} cur
 * @param {string} local
 * @param {number} wrap
 * @param {number} i 
 * @public
 * @return {Array<number>}
 */
function nextStep(cur, local, wrap, i ) {
	var me=-1, remainder=OPTS.nextBar;
	if (OPTS.name === "group-"+OPTS.group) {
		me=0;
		remainder=wrap;
	}
	if(i) {
		if(local === cur) {
			me=i;
		}
		if(me>=0 && remainder >0 && i===wrap-1 ) {
			i=0;
		}
	}
	return (me, remainder, i);
}

/**
 * convert2HTML
 * Convert an array of Reference type into DOM nodes 
 * 
 * @param {Array<ReferenceType>} list
 * @param {string} gname - the group name
 * @public
 * @return {string of HTML}
 */
function convert2HTML(list, gname) {
	let html='';
	for(let i in list) {
		let nui=cleanTitle(i, gname);
// testLeanLeft($e.width(), $e.children(), tt.length>110?110:tt.length) 
		let clsNm = createStyle(tt.length>110, false );

		let txt='Title: '+i+'\nAuthor: '+list[i].auth+' &nbsp; &nbsp; Last edit: '+ dateMunge(list[i].date, "Unknown time", true)+'\nDescription: '+list[i].descrip;
// IOIO check the li, then think about appending these together
		html+='<li> <a class="adjacentItem button" id="link'+nui+'" class="'+clsNm+'" href="'+list[i].url+'" aria-label="'+txt+'" >'+list[i].renderTitle+'</a> </li>';
	}	
	return html;
}

/**
 * convert2IndexHTML
 * Code to generate HTML islands for the index pages
 * 
 * @param {Array<Reference>} list
 * @param {string} gname
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {string of HTML}
 */
function convert2IndexHTML(list, gname, dom=document) {
	if(OPTS.rendered) {
		console.log("Already rendered this asset");
		return;
	}
	OPTS.rendered=true;

	let html='';
	for(let i in list) {
		if(OPTS.debug) { console.log("Excessive logging "+i, list[i]); } 

		let nui=cleanTitle(i, gname), lbreak=isMobile(dom)?"<br />":"";
		let tt=	list[i].descrip;
		if(tt.length>235) { tt=tt.substr(0, 235)+"..."; }	

		html+= '<a class="adjacentItem" href="'+list[i].url+'" title="'+list[i].descrip+'">'+list[i].title+' <span class="button">'+list[i].title+'</span><p id="adjacent'+nui+'" >Author: '+list[i].auth+' &nbsp; &nbsp; &nbsp;'+lbreak+'  Last edit: '+ dateMunge(list[i].date, "Unknown time", true)+' <br />Description: '+tt+'</p> </a>' ;	
	}
	return html;
}

/**
 * applyEventHandlers
 * Apply the JS code to the new DOM elements
 * 
 * @WARN has side effects
 * @param {Array<ReferenceType>} list
 * @param {Document =document} dom - the doc that is being edited, passed to make testing easier
 * @public
 * @return {void}
 */
function applyEventHandlers(list, dom=document, loc=location) {
	{
	let dat=dom.querySelectorAll('.top-bar.fullWidth header h1');
	if(dat.innerText.includes('whatsmyname') || dat.innerText.includes('XXX') ) {
		dat.innerText='Group '+gname;
	}
	}
	{
	let dit=dom.querySelectorAll('.adjacentGroup p');
	if( dit.length && dit[0].innerText.includes('XXX')) {
		dit[0].innerText= 'Some similar articles in '+gname;
	}
	}
}
 
/**
 * listContentGroup
 * Map the data group attribute to an Array
 * 
 * @param {string} id
 * @param {Document =document} dom
 * @public
 * @return {Array<string>}
 */
export function listContentGroup(id, dom=document) {
	let grp=dom.querySelector(id);
	if(!grp) { return []; }
	grp=grp.getAttribute('data-group');
	if(!grp) { return []; }
		
	grp=grp.split(',');
	grp=grp.map( (i, j)=>{ return i.trim(); } );
	return [ ...grp];
}
 
/**
 * createAdjacentChart
 * Create a adjacent chart on the bottom of the current page.
 * 
 * @param {AdjacentParams} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {void}
 */
async function createAdjacentChart(opts, dom=document, loc=location) {
	OPTS = Object.assign(OPTS, {
        'name':'',
        'debug':false,
        'meta':'',
        'nextBar':100,
        'titleLimit':20,
		'rendered':false,
		'iteration':0,
        'group':'system',
		'count':1,

	}, opts);
	if(OPTS.group==='system') { throw new Error("Must set the article group, and not to system"); }
// look at meta 

	if(isMobile(dom) && !( OPTS.name === "group-"+OPTS.group || OPTS.name === "group-XXX")) {	
		dom.querySelector('.adjacentGroup p').style['display']='none';	
// if no code populates this, this make no sense.
// IOIO its correct to original, 
		dom.querySelector('.adjacentGroup #group'+OPTS.group+'.adjacentList .adjacentItem a').html(
			dom.querySelector('.adjacentGroup #group'+OPTS.group+'.adjacentList .adjacentItem a').text()
				 );

	} else {
		let data=await runFetch(OPTS.meta, false); 
		console.log(dat, "possibly convert data ");

		if(loc.pathname.match(new RegExp('\\/group-', 'i'))) {
			let html=convert2IndexHTML(data.body, "", "group"+OPTS.group, dom );
			console.log( html);
			appendIsland("#group"+OPTS.group, html );
			applyEventHandlers(data.body, dom, loc);
		
		} else {
			let rendered= normaliseToList(data.body);
			console.log( rendered);
			let html=convert2HTML(rendered, "group"+OPTS.group, generateGroup(loc));
			console.log( html);
			appendIsland("#group"+OPTS.group, html );
		}
	}
}

/** 
 * Only use for testing, it allows access to the entire API 
 */
export const TEST_ONLY ={ 
mapURL,
mapAttribute,
createStyle,
cleanTitle,
generateGroup,
normaliseToList,
nextStep,
convert2HTML,
createAdjacentChart,
};

