/**
 * page
 * Build a fake browser to run with tests
 
 * @param {string =''} url - thou shalt pass a relevant URL for the test, as it is used
 * @param {number =1} args - 1=dom, 2= +loc, 3= +win
 * @public
 * @return {Array<things>} - see args arg above.
 */
export function page(url = "", args = 1) {
  if (typeof window === "object" && args < 5) {
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
  return [];
}

/**
 * validateHTML
 * Build 1 code to check HTML

 * @see ["Using validate.org API" https://html-validate.org/dev/using-api.html]
 * @param {string} html
 * @param {boolean} emit
 * @public
 * @return {Array<string>}
 */
export async function validateHTML(html) {
  // I would like some process to listen to HTML errors in the browser
  return [];
}
