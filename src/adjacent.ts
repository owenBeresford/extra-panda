/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { appendIsland, dateMunge, isMobile, runFetch, mapAttribute, articleName } from './base';
import { register, access } from './code-collection';
import { Document, Location } from 'jsdom';
import { SimpleResponse, ReferenceType, NormalisedReference, AdjacentProps } from './all-types';

register("createAdjacentChart", createAdjacentChart );

// variables across this module
let OPTS:AdjacentProps={} as AdjacentProps;

/**
 * mapURL
 * Extract sections of URL used for the meta data files so it can be applied to the local page.
 *    PURE 
 * @param {string} article
 * @param {string} suffix
 * @public
 * DEPRECATED until I find where I am calling it 
 * @return {string} - the desired full URL of this page 
 */
function mapURL(article:string, suffix:string, loc:Location=location):string {
	var t=loc.protocol+'//'+loc.host, t2=loc.pathname.split('/');
	t2=t2.pop();
	let tmp=new URLSearchParams(loc.search);
	if(t2==='group-XXX' && tmp.has('first')) {
		t2=tmp.get('first');
	} 
	if(suffix) {
		if(tmp.has('first')) {
			t+=loc.pathname.replace("group-XXX", t2+"-meta");
		} else {
			t+=loc.pathname.replace(t2, article+"-meta");
		}
	} else {
		t+=loc.pathname.replace(t2, article);
	}
	t+=loc.search+loc.hash;
	return t;
}

/**
 * createStyle
 * Compute the relevant CSS classes for this item
 *    PURE
 * @param {bool} isLong
 * @param {number} isOffscreen - unused in current version
 * @public
 * @return {string}
 */
function createStyle(isLong:boolean, isOffscreen:boolean):string {
	let clsNm="button";
	if(isLong) { clsNm += " lower"; }	
	// I removed this feature
	//		if(isOffscreen ) { clsNm += " left"; }
	return clsNm;
}

/**
 * cleanTitle
 * Manipulate string so it can be used as a DOM id
 *    PURE
 * @param {string} id
 * @param {string} group 
 * @public
 * @return {string}
 */
function cleanTitle(id:string, group:string ):string {
	return group +""+id.replace(/[^a-zA-Z0-9_]/g, '_');
}

// DO NOT EXPORT
// this is 1 line of code, functionalised for readability reasons
function extractOABName(url:string):string {
	return url.split('/').pop();
}

/**
 * generateGroup
 * Get the article group name from supplied data OR the URL
 * Will be supplied in OPTS for normal pages
 * Will be on the URL for the group indexes
 *       PURE    
 * @param {Location =location} loc 
 * @public
 * @throws when insufficient data has been supplied
 * @return {string}
 */
function generateGroup(loc:Location=location ):string {
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
 *    PURE
 * [me, remainder] form a sliding window of the meta data, 
 *   the window many exceed the end of the adjacent meta data, in which case 
 *   it fills the buffer 'list' with values from the start of the meta data  
 *
 * @param {Array<ReferenceType>} data - the meta data
 * @return {Array<NormalisedReference>}
 */
function normaliseToList(data:Array<ReferenceType>):Array<NormalisedReference> {
	var me:number=-1, 
//		thispage:string=OPTS.name, 
		remainder:number=OPTS.nextBar, 
		list:Array<NormalisedReference>=[];
//	if (OPTS.name === "group-"+OPTS.group) {
//		me=0;
//		remainder=data.length;
//	}
	let i=0; let j=0;
	[me, remainder, i] =nextStep( extractOABName( data[0].url), OPTS.name, data.length, i, me );

	for(; i<data.length; i++) { 
console.log("loop "+i, data[i], {me, remainder, name:OPTS.name});
		const title= data[i].title;
		if(title && me>=0 && remainder>0 ) {    
			list[j]={ 
				auth: data[i].auth, 
				date: dateMunge(data[i].date, "[Unknown time]", true), 
				url: data[i].url, 
				offset:i, 
				title:data[i].title.substr(0, OPTS.titleLimit),
				desc: data[i].desc 
					} as NormalisedReference;

			if(title.length>OPTS.titleLimit) {
				list[j].title+="...";
			}
			let tt=	data[i].desc;
			if(tt.length>235) { 
				list[j].desc=tt.substr(0, 235)+"..."; 
			}
			remainder--;
		}
		[me, remainder, i] =nextStep(extractOABName( data[i].url), OPTS.name, data.length, i, me );
		j++;
// note: round robin algo
//		if(thispage === asset) {
//			me=i;
//		}
//		if(me>=0 && remainder >0 && i===data.length-1 ) {
//			i=0;
//		}
	}
	return list;
}

/**
 * nextStep
 * A function map next values, to make other code simpler 
 *     PURE
 * @param {string} cur
 * @param {string} local
 * @param {number} wrap
 * @param {number} i 
 * @param {number} me 
 * @public
 * @return {Array<number>}
 */
function nextStep(cur:string, local:string, wrap:number, i:number, me:number ):Array<number> {
	var remainder=OPTS.nextBar;
	if (OPTS.name === "group-"+OPTS.group) {
		me=0;
		remainder=wrap;
	}
	if(local === cur) {
		me=i;
	}
	if(i>0 && me>0 && remainder >0 && i>=wrap-1 ) {
		i=0;
	}
	return [me, remainder, i];
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
export function listContentGroup(id:string, dom:Document=document):Array<string> {
	let grp=dom.querySelector(id);
	if(!grp) { return [] as Array<string>; }
	grp=grp.getAttribute('data-group');
	if(!grp) { return [] as Array<string>; }
		
	grp=grp.split(',');
	grp=grp.map( (i:string, j:number):string =>{ return i.trim(); } );
	return [ ...grp];
}


/**
 * convert2HTML
 * Convert an array of Reference type into DOM nodes 
 *   PURE
 * @param {Array<NormalisedReference>} list
 * @param {string} gname - the group name
 * @public
 * @return {string of HTML}
 */
function convert2HTML(list:Array<NormalisedReference>, gname:string):string {
	let html="<ul class=\"adjacentList\">\n";
	for(let i in list) {
		let nui=cleanTitle(i, gname);
// testLeanLeft($e.width(), $e.children(), tt.length>110?110:tt.length) 
		let clsNm = createStyle(list[i].desc.length>110, false );

		let txt='Title: '+list[i].title+'\nAuthor: '+list[i].auth+' &nbsp; &nbsp; Last edit: '+list[i].date+'\nDescription: '+list[i].desc;
		html+='<li> <a class="adjacentItem button" id="link'+nui+'" class="'+clsNm+'" href="'+list[i].url+'" aria-label="'+txt+'" >'+list[i].title+'</a> </li>\n';
	}
	html+="</ul>";
	return html;
}

/**
 * convert2IndexHTML
 * Code to generate HTML islands for the index pages
 *     IMPURE (logging)
 * @param {Array<ReferenceType>} list
 * @param {string} gname
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {string of HTML}
 */
function convert2IndexHTML(list:Array<ReferenceType>, gname:string, dom:Document=document, loc:Location=location):string {

	let html='';
	for(let i in list) {
		let nui=cleanTitle(i, gname), lbreak=isMobile(dom, loc)?"<br />":"";
		let tt=	list[i].desc;
		if(tt.length>235) { tt=tt.substr(0, 235)+"..."; }	

		html+= '<a class="adjacentItem" href="'+list[i].url+'" title="'+tt+'">'+list[i].title+' <span class="button">'+list[i].title+'</span><p id="adjacent'+nui+'" >Author: '+list[i].auth+' &nbsp; &nbsp; &nbsp;'+lbreak+'  Last edit: '+ dateMunge(list[i].date, "Unknown time", true)+' <br />Description: '+tt+' </a>\n' ;	
	}
	return html;
}

/**
 * updateLabels
 * Apply the JS code to the new DOM elements
 * 
 * @WARN has side effects
 * @param {string} gname - article group name
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function updateLabels( gname:string, dom:Document=document):void {
	let dat:Array<Node>=dom.querySelectorAll('.top-bar.fullWidth header h1') as Array<Node>;
	if( dat.length && 
		dat[0].textContent.includes('whatsmyname') || 
		dat[0].textContent.includes('XXX') ) {
		dat[0].textContent='Group '+gname;
	}
	let dit:Array<Node>=dom.querySelectorAll('.adjacentGroup p') as Array<Node>;
	if( dit.length && dit[0].textContent.includes('XXX')) {
		dit[0].textContent= 'Some similar articles in '+gname;
	}
}
 
/**
 * createAdjacentChart
 * Create a adjacent chart on the bottom of the current page.
 * 
 * @param {AdjacentParams} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {Promise<void>}
 */
async function createAdjacentChart(opts:AdjacentProps, dom:Document=document, loc:Location=location):Promise<void> {
	OPTS = Object.assign(OPTS, {
        'name':articleName(loc),
        'meta':mapURL(OPTS.group, ".json", loc),
        'nextBar':100,
        'titleLimit':20,
		'rendered':false,
		'iteration':0,
        'group':'system',
		'count':1,
	}, opts) as AdjacentProps;
	if(OPTS.group==='system') { 
		throw new Error("Must set the article group, and not to 'system'."); 
	}
	const isGroupArticle:boolean=OPTS.name === "group-XXX" || OPTS.name === "group-"+OPTS.group;
	const GROUP:string="group"+OPTS.group;

	if(	isMobile(dom, loc) && !isGroupArticle) {
		dom.querySelector('.adjacentGroup p').style['display']='none';
	} else {
		const ROOT=access();
		const data:SimpleResponse=await ROOT.runFetch(OPTS.meta, false); 
		if(! data.ok || !Array.isArray(data.body)) {
			ROOT.log("warn", "There doesn't seem to be a group meta data file.");
			return;
		}

		if(isGroupArticle) {
			if(OPTS.rendered) {
				ROOT.log("warn", "Already rendered this asset");
				return;
			}
			OPTS.rendered=true;

			let html=convert2IndexHTML(data.body as Array<ReferenceType>, GROUP, dom, loc );
			appendIsland("#"+GROUP, html, dom );
// console.log("WWW list view", html, "#"+GROUP, dom.querySelector('#'+GROUP).textContent );
			updateLabels( GROUP, dom );
		
		} else {
			let rendered= normaliseToList(data.body as Array<ReferenceType>);
			let html=convert2HTML(rendered, generateGroup(loc));
			appendIsland("#"+GROUP, html, dom);
// console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE nav view", html, rendered, dom.body.outerHTML, "#"+GROUP, "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE"); 

		}
	}
}

/////////////////////////////////////////// testing ////////////////////////////////

/**
 * injectOpts
 * PURELY FOR UNIT TESTS, adds ability to set initial state per internal function
 * READS process.env
 * @param {undefined object} opts - I could add a new interface where all the options were optional
 * @public
 * @return {void}
 */
function injectOpts(a:Object):void {
	if (process.env['NODE_ENV']!== 'development') {
		console.error("ERROR: to use injectOpts, you must set development"); 
		return;
	}
	OPTS=Object.assign(OPTS, a);
}

/** 
 * Only use for testing, it allows access to the entire API 
 */
export const TEST_ONLY ={ 
injectOpts,
mapURL,
createStyle,
cleanTitle,
generateGroup,
normaliseToList,
listContentGroup,
nextStep,
convert2HTML,
updateLabels,
convert2IndexHTML,
createAdjacentChart,
};

