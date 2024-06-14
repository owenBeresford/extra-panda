/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { appendIsland, dateMunge, isMobile, runFetch, mapAttribute, articleName, addLineBreaks } from './base';
import { register } from './vanilla';

const ALL_REFERENCE='.addReferences';
const ALL_REFERENCE_LINKS=ALL_REFERENCE+ ' sup a';

// variables across this module
// * @protected
let OPTS={}; 
if(!isMobile(location)) {
	register("biblio", createBiblio);
}

/**
 * markAllLinksUnknown
 * Utility function to statically annotate page in absence of meta data.
 * IMPURE

 * @param {Document =document} dom 
 * @param {Location =location} loc
 * @protected
 * @return {void}
 */
function markAllLinksUnknown(dom=document, loc=location) {
	console.warn("ERROR: was unable to get the references meta file for "+loc.href); 

	const naam= articleName( loc); 
	const WASSUP=dom.querySelectorAll( ALL_REFERENCE_LINKS);
	for(let i=0; i<WASSUP.length; i++) {
		const txt=`Reference popup for link [${i+1}]
			\nERROR: No valid biblio file found.\nsite admin, today 
			\nHTTP_ERROR, no valid file called ${naam}-references.json found.\n`;
		WASSUP[i].setAttribute('aria-label', ''+txt);	
	}
}

/**
 * generateEmpty
 * Create a tooltip for a link that seems to lack meta data.
 *  PURE

 * @param {number} i - the offset for the link, used in the output
 * @protected
 * @return {string}
 */
function generateEmpty(i) {
	const DEFAULT ={ 
		descrip:"HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
		auth:"",
		date:new Date(),
		title:"HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
	};
	return "Reference popup for link ["+(i+1)+"]\n\n"+DEFAULT.title+"\n"+DEFAULT.auth+" "+
			DEFAULT.date+"\n\n"+DEFAULT.desc;
}

/**
 * normaliseData
 * Make text data more suited for display, map to flat string array
 *   PURE

 * @param {Array<ReferenceType>} data
 * @protected
 * @return {Array<string>}
 */
function normaliseData(data) {
	const po=[ 
		"[No author]",  
		"Resource doesn't set a description tag.",
		"[No date]"
		];
	let out=[];

	for(let i in data ) {
		if(data[i] === false || data[i]===null) {
			out.push( generateEmpty(i) );
			continue;
		}

		let date =dateMunge( data[i].date, po[2], true), 
			date2 =dateMunge( data[i].date, po[2], false);
		let title=data[i].title+""; // this stops errors later...
		let desc= data[i].descrip;

		desc=addLineBreaks(desc, 80);
		title=title.replace('.', '. ');
		title=addLineBreaks(title, 80);				

		let auth=data[i].auth || po[0];
		if(data[i].auth==='unknown' ) {i
			 auth=po[0];
		}
		if(auth.length>65) {
			auth=auth.substring(0, 65);
		}

		out.push("Reference popup for link ["+(i+1)+"]\n\n"+title+"\n"+auth+" "+date+"\n\n"+desc);
	}
	return out;
}

/**
 * applyDOMpostions
 * Actually do the CSS class insertion
 * IOIO KLAXON KLAXON: check memory usage, in earlier browsers this was VERY bad
 *    IMPURE

 * @param {HTMLElement or child class} ele
 * @param {number} WIDTH
 * @protected
 * @return {void}
 */
function applyDOMpostions(ele, WIDTH) {
	let left=mapAttribute(ele, 'left');
	let bot=mapAttribute(ele, 'bottom');

	if(left > WIDTH ) {
		ele.classList.add('leanIn');
	}
	const HEIGHT=mapAttribute(ele.parentNode, 'height')- (3*16);
	if(bot > HEIGHT ) {
		ele.classList.add('leanUp');
	}
}

/**
 * mapPositions
 * Apply list of values previously made to DOM, and add CSS adjustments
 *    IMPURE

 * @param {Array<string>} data ~ the results of normaliseData()
 * @param {Document =document} dom=document 
 * @protected
 * @return {void}
 */
function mapPositions(data, dom=document ) {
	const WIDTH=mapAttribute(dom.querySelector(ALL_REFERENCE), 'width')- (32*16);
	const REFS=dom.querySelectorAll(ALL_REFERENCE_LINKS); 
	
	for(let i in data ) {
		REFS[i].setAttribute('aria-label', ''+data[i]);
		applyDOMpostions(REFS[i], WIDTH);
		if(OPTS.renumber) {
			REFS[i].innerText=""+i;
		}
	}
	if(REFS.length> data.length) {
		let i=data.length;
		while(i < REFS.length) {
			let dit=generateEmpty(i);
			REFS[i].setAttribute('aria-label', ''+dit);

			applyDOMpostions(REFS[i], WIDTH);
			if(OPTS.renumber) {
				REFS[i].innerText=""+i;
			}
			i++;
		}
	}
}

/**
 * addMetaAge
 * When found, display the age of the meta file on screen
 *    IMPURE

 * @param {Response} xhr - The data returned by window.fetch
 * @protected
 * @return {void}
 */
function addMetaAge(xhr) {
	let updated=new Date(xhr.headers['last-modified']);
	if( updated >0 ) {
		let str="<span>Links updated <time datetime=\""+dateMunge(updated, new Date(), false)+"\" title=\"When this was last recompiled\">"+updated.toLocaleDateString('en-GB', {hour12:false, dateStyle:"medium" }) +"</time> </span>";
		appendIsland('.addReading .ultraSkinny', str);
	}
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
function makeRefUrl(template, loc=location) {
	let tmp=loc.href.split('/');
	return template.replace(/XXX/, tmp.end());
}

/**
 * biblio
 * Access point for biblio feature v2
 *    IMPURE

 * @param {BiblioProps aka Object} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {void}
 */
async function createBiblio(opts, dom=document, loc=location) {
	OPTS = Object.assign( {
		indexUpdated:0,
		type:'biblio',
		width:400,
		referencesCache:'/resource/XXX-references',
		renumber:1, // set to 0 to disable

		textAsName:3,
		wholeTitle:50,
		limitDesc:150,
		}, opts);


	let data=await runFetch(makeRefUrl(OPTS.referencesCache, loc), false); 
	if(!data.ok) {
		markAllLinksUnknown(dom, loc);
		throw new Error("ERROR getting references "+makeRefUrl(OPTS.referencesCache, loc));
	} 
	console.log(data, "possibly convert data ");
	$('#biblio').attr('style', '');
	addMetaAge(data);
	let cooked= normaliseData(data);
	mapPositions(cooked, dom);
}

/** 
 * Only use for testing, it allows access to the entire API 
 */
export const TEST_ONLY ={ 
 markAllLinksUnknown,
 generateEmpty,
 normaliseData,
 applyDOMpostions,
 mapPositions,
 addMetaAg,
 makeRefUrl,
 biblio,
};
