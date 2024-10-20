import { delay } from '../networking';

/**
 * page
 * Build a fake browser to run with tests
 
 * @param {string =''} url - thou shalt pass a relevant URL for the test, as it is used
 * @param {number =1} args - 1=dom, 2= +loc, 3= +win
 * @public
 * @return {Array<things>} - see args arg above.
 */
export async function page(url = "", args = 1) {
  if (typeof window === "object" && args < 5) {
    return await page_local(url, args);
  } else if (args < 5) {
    return page_fake(url, args);
  }
  throw new Error("Bad data");
}

function generate_name(hash) {
	const d=new Date();
	return "test"+hash+"_"+d.getSeconds()+"_"+d.getMilliseconds();
}

/**
 * page_local
 * Create a new tab inside a browser
 
 * @param {string =""} url
 * @param {number =1} args 
 * @public
 * @return {Array} - many types of object
 */
 async function page_local(url = "", args = 1) {
	const name=generate_name(args);

  const tmp = await window.open(url, name);

	await delay(1000);
  if(tmp.window.document.body.length < 200) {
		window.reload();
		return page_local(url, args);
	}
	tmp.window.TEST_TAB_NAME=name;
  if (args === 1) {
    return [tmp.window.document];
  } else if (args === 2) {
    return [tmp.window.document, tmp.window.document.location];
  } else if (args === 3) {
    return [tmp.window.document, tmp.window.document.location, tmp.window];
  } else if (args === 4) {
    return [tmp.window.document, tmp.window.document.location, tmp.window, tmp];
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
