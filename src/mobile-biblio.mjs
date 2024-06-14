/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { appendIsland, dateMunge, isMobile, runFetch, mapAttribute, addLineBreaks } from './base';
import { register } from './vanilla';

// move to interface
const ALL_REFERENCE='.addReferences';
const ALL_REFERENCE_LINKS=ALL_REFERENCE+ ' sup a';

// variables across this module
// * @protected
let OPTS={}; 
if(isMobile(location)) {
	register("biblio", createBiblio);
}

/**
 * normaliseData
 * Make text data more suited for display, map to flat string array
 *   PURE

 * @param {Array<ReferenceType>} data
 * @protected
 * @return {Array<ReferenceType>}
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
			out.push({
				auth:"no author",
				date:"no date",
				title:"HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
				desc:"HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.",
				offset:i,
				});
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
		out.push({
			auth:auth,
			title:title,
			desc:desc,
			date:date,
			offset:i,
			});

	}
	return out;
}

/**
 * render
 * Function to convert the data to HTML
 * 
 * @param {Array<ReferenceType>} data - technically synthetic reference data.
 * @public
 * @return {string} - the HTML
 */
function render(data) {
	let html=`<ol class="mobileBiblo">`;
	for(let i in data) {
		html+=`<li><h5>${data[i].title}</h5>
				<span>${data[i].desc}</span>
				<span>by ${data[i].auth} on ${data[i].date}</span>
			   </li>`;
	}
	html+="</ol>";
	return html;
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
 * Access point for biblio feature v2, on mobile
 *    IMPURE

 * @param {BiblioProps aka Object} opts
 * @param {Document =document} dom
 * @param {Location =location} loc
 * @public
 * @return {void}
 */
async function biblio(opts, dom=document, loc=location) {
	const OPTS2= {
		type:'biblio',
		width:400,
		referencesCache:'/resource/XXX-references',
		gainingElement:'#biblio',
		pageInitRun:0,

		renumber:1, // set to 0 to disable
		};	
	OPTS = Object.assign(OPTS2, opts);

//i	if(OPTS.pageInitRun) { return; }
//	OPTS.pageInitRun = 1;

	OPTS.tooltip=0;
	dom.querySelector('#biblio').setAttribute('style', '');
	dom.querySelector(OPTS.gainingElement+" *").replaceChildren([]);
	appendIsland(OPTS.gainingElement, `<h2 class="biblioSection">References (for mobile UI)</h2> 
<p>The references embedded in the text are displayed here. </p>
<p><span id="mapper" class="twitterLink">Lookup extra link details</span>.</p>`);
	// IOIO do i need this? 
	// $('#mapper').parent().css('display', 'none');
	
	const dat= await runFetch( makeRefUrl(OPTS.referencesCache, loc ), false);
	if(! dat.ok) {
		const html="<p>Unable to get bibliographic data for this article.</p>";
		createIsland(OPTS.gainingElement, html);
		
	} else {
		const dat2=normaliseData(dat);	
		const html=render(dat2);
		createIsland(OPTS.gainingElement, html);
	}
}

/** 
 * Only use for testing, it allows access to the entire API 
 */
export const TEST_ONLY ={ 
 normaliseData,
 render,
 makeRefUrl,
 biblio,
};

