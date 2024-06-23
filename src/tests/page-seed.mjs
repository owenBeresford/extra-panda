import { HtmlValidate } from "html-validate";
import { JSDOM } from 'jsdom';

/**
 * exportpage
 * Build a fake browser to run with tests
 
 * @param {string =''} url - thou shalt pass a relevant URL for the test
 * @param {number =1} args - 1=dom, 2= +loc, 3= +win
 * @access public
 * @return {Array<things>} - see args arg above.
 */
export function page(url='', args=1) {
	const dom = new JSDOM(`<html>
<head><title>test1</title></head>
<body>
	<div class="addReading" id="shareGroup">
		<div class="allButtons"> <span class="ultraSkinny"></span> </div>
	</div>
	<article>
		<div id="point1"></div>
		<div id="point2" class="blocker addReferences"></div>
	</article>
</body>
</html>`, {url:url, referrer:url });
	if(args===1) 	{ return dom.window.document; }
	else if(args===2) { return [dom.window.document, dom.window.location]; } 
	else if(args===3) { return [dom.window.document, dom.window.location, dom.window]; } 
	else	 		{ throw new Error("Bad data"); } 
}

/**
 * exportvalidateHTML
 * Build 1 code to check HTML

 * @link https://html-validate.org/dev/using-api.html 
 * @param {string} html
 * @param {boolean} emit
 * @public
 * @return {boolean}
 */
export async function validateHTML(html, emit) {
	const htmlvalidate = new HtmlValidate({
 	 extends: ["html-validate:recommended"],
	});
	const report = await htmlvalidate.validateString(html);

	if (!report.valid && emit) {
	  console.log(report.results);
	}
	return report.valid;
}


