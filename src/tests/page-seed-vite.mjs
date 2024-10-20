const { JSDOM } = await import("jsdom");
const { default: validator } = await import("html-validator");

/**
 * page
 * Build a fake browser to run with tests
 
 * @param {string =''} url - thou shalt pass a relevant URL for the test, as it is used
 * @param {number =1} args - 1=dom, 2= +loc, 3= +win
 * @public
 * @return {Array<things>} - see args arg above.
 */
export function page(url = "", args = 1) {
  if (
    typeof window === "object" &&
    window !== undefined &&
    window !== null &&
    args < 5
  ) {
    return page_local(url, args);
  } else if (args < 5) {
    return page_fake(url, args);
  }
  throw new Error("Bad data");
}

/**
 * page_local
 * Create a new tab inside a browser
 
 * @param {string =""} url
 * @param {number =1} args 
 * @public
 * @return {Array} - many types of object
 */
function page_local(url = "", args = 1) {
  const tmp = window.open(url, "test");
  if (args === 1) {
    return [tmp.document];
  } else if (args === 2) {
    return [tmp.document, tmp.location];
  } else if (args === 3) {
    return [tmp.document, tmp.location, tmp];
  } else if (args === 4) {
    return [tmp.document, tmp.location, tmp, tmp];
  }
}

/**
 * page_fake
 * Create a new tab inside JSDOM
 
 * @param {string =""} url
 * @param {number =1} args 
 * @public
 * @return {Array} - of many types of object
 */
function page_fake(url = "", args = 1) {
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
  }
}

/**
 * validateHTML
 * Build 1 code to check HTML
 * When vite has built with test.environment == 'node', the library is accessed with less hassle
 * for test.environment=='jsdom' I need validator.default

 * @see ["Using validate.org API" https://html-validate.org/dev/using-api.html]
 * @param {string} html
 * @param {boolean} emit
 * @public
 * @return {Array<string>}
 */
export async function validateHTML(html) {
  // I do no know why WhatWG doesn't know Dialog tag
  // I have persistent disagreement on heading levels
  const lint = await validator({
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
