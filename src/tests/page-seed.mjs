import { JSDOM } from "jsdom";
import * as validator from "html-validator";

/**
 * exportpage
 * Build a fake browser to run with tests
 
 * @param {string =''} url - thou shalt pass a relevant URL for the test
 * @param {number =1} args - 1=dom, 2= +loc, 3= +win
 * @access public
 * @return {Array<things>} - see args arg above.
 */
export function page(url = "", args = 1) {
  const dom = new JSDOM(
    `<!DOCTYPE html>
<html lang="en-GB">
<head><title>test1</title></head>
<body>
   <div>
	<h1>Page Title!! </h1>
	<div class="addReading" id="shareGroup">
		<div class="allButtons"> <span class="ultraSkinny"></span> </div>
	</div>
   </div>
	<div id="point1"></div>
	<div id="point2" class="blocker addReferences"></div>
</body>
</html>`,
    { url: url, referrer: url },
  );
  if (args === 1) {
    return [dom.window.document];
  } else if (args === 2) {
    return [dom.window.document, dom.window.location];
  } else if (args === 3) {
    return [dom.window.document, dom.window.location, dom.window];
  } else if (args === 4) {
    return [dom.window.document, dom.window.location, dom.window, dom];
  } else {
    throw new Error("Bad data");
  }
}

/**
 * exportvalidateHTML
 * Build 1 code to check HTML

 * @see ["Using validate.org API" https://html-validate.org/dev/using-api.html]
 * @param {string} html
 * @param {boolean} emit
 * @public
 * @return {Array<string>}
 */
export async function validateHTML(html) {
  // I do no know why WhatWG doesn't know Dialog tag
  // I have persistent disagreement on heading levels
  const lint = await validator.default({
    validator: "WHATWG",
    data: html,
    format: "text",
    ignore: [
      "Unknown element <dialog>",
      "<dialog> is not a valid element name",
      "Heading level can only increase by one, expected <h2> but got <h3>",
      "Heading level can only increase by one, expected <h3> but got <h5>",
    ],
  });

  // I do no know why WhatWG doesn't know Dialog tag
  // I have persistent disagreement on heading levels
  return [...lint.errors];
}
