import { assert, describe, it, expect } from "vitest";

import { page } from "./page-seed-vite";
import { TEST_ONLY } from "../../tools/css-extractor";
import { appendIsland } from "../dom-base";

const { hash2CSSblock, hash2CSS, hash2json, output, generate_CSS_file, Extract } = TEST_ONLY;

describe("TEST generate CSS ", () => {
	it("go 1: hash2CSS", () => {
//		const [dom, loc, win] = page("http://192.168.0.35/", 3);
/**
type Pseudable = string | null;
// null values are just not set
// maybe convert to a TS dictionary  https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript
// Hashtable: this is a list of CSS attributes
type Hashtable = Record<string, string>;
// iHHT: this is a list of CSS rules       
type HashHashtable = Record<string, Hashtable>;
// HHHT: a CSS block, probably only for a single resolution
type HashHashHashtable = Record<string, HashHashtable>;
*/

// im not validating the data in, as its come from a live webpage
		let SRC={ "font":'"jibber, jabber"', "font-size":"0.8em" };
//  ".test1 { font: "jibber, jabber"; font-size: 0.8em; }"

		let DST=`.test1 { font:"jibber, jabber"; font-size:0.8em; }`;
		assert.equal(hash2CSS(".test1", SRC ), DST, "bullet #1");

		SRC={ "font":'"jibber, jabber2"', "font-size":"0.8em", "font":'"jibber, jabber2"'};
		DST=`.test1 { font:"jibber, jabber2"; font-size:0.8em; }`;
		assert.equal(hash2CSS(".test1", SRC ), DST, "bullet #2");

		SRC={ "font":'"jibber, jabber"', "font-size":"0.8em" };
		DST=`p { font:"jibber, jabber"; font-size:0.8em; }`;
		assert.equal(hash2CSS("p", SRC ), DST, "bullet #3");

		SRC={ "font":'"jibber, jabber"', "font-size":"0.8em", "margin-left":10e5, "margin-right":10e99  };
		DST=`p { font:"jibber, jabber"; font-size:0.8em; margin-left:1000000; margin-right:1e+100; }`;
		assert.equal(hash2CSS("p", SRC ), DST, "bullet #4");

	});

	it("go 2: hash2json", () => {
//		const [dom, loc, win] = page("http://192.168.0.35/", 3);

		let SRC={ "font":'"jibber, jabber"', "font-size":"0.8em" };
		let DST=`{"font":"\\"jibber, jabber\\"","font-size":"0.8em"}`;
		assert.equal(hash2json( SRC ), DST, "bullet #5");

		SRC={ "font":'"jibber, jabber2"', "font-size":"0.8em", "font":'"jibber, jabber"'}; 
		DST=  `{"font":"\\"jibber, jabber\\"","font-size":"0.8em"}`;
		assert.equal(hash2json( SRC ), DST, "bullet #6");

		SRC={ "font":'"jibber, jabber"', "font-size":"0.8em", "margin-left":10e5, "margin-right":10e99  };
		DST=`{"font":"\\"jibber, jabber\\"","font-size":"0.8em","margin-left":1000000,"margin-right":1e+100}`;
		assert.equal(hash2json( SRC ), DST, "bullet #7");

	});
	
	it("go 3: hash2CSSblock ", () => {
//		const [dom, loc, win] = page("http://192.168.0.35/", 3);

		const SRC={
			 ".first":{ "font":'"jibber, jabber"', "font-size":"0.8em" },
			 ".second":{ "color":"green", "font":'"jibber, jabber"', "background":"red" }
					};
		const DST=`@media screen and (min-resolution:100dpi) {.first { font:"jibber, jabber"; font-size:0.8em; }.second { color:green; font:"jibber, jabber"; background:red; }}`;
		assert.equal(hash2CSSblock( SRC, "screen and (min-resolution:100dpi)" ), DST, "bullet #8");

	// IOIO add more here
	});
	
	it("go 4: output ", (cnxt) => {
//		const [dom, loc, win] = page("http://192.168.0.35/", 3);
		cnxt.skip();
	});
	
	it("go 5: Extract->compareTrees", () => {
		const [dom, loc, win] = page("http://192.168.0.35/", 3);
		const OBJ=new Extract(dom, win);
		assert.equal(OBJ instanceof Extract, true, "bullet #9");
	
		let s1={"thing1":"bob", "thing2":"sam", "thing3":"andy" }, 
			s2={"thing1":"bob", "thing2":"sam", "thing3":"andy" };
		assert.equal(OBJ.compareTrees(s1, s2), true, "bullet #10");

		s1={"thing1":"bob", "thing2":"sam", "thing3":"andy", "thing4":"kelli" }, 
		s2={"thing1":"bob", "thing2":"sam", "thing3":"andy", "thing4":"kelii"  };
		assert.equal(OBJ.compareTrees(s1, s2), false, "bullet #11");

		s1={"thing1":"bob", "thing2":"sam", "thing3":"andy", "thing4":"racheal" }, 
		s2={"thing1":"bob", "thing2":"sam", "thing3":"andy"  };
		assert.equal(OBJ.compareTrees(s1, s2), false, "bullet #12");

	});
	
	it("go 5.1: Extract->compare", () => {
		const [dom, loc, win] = page("http://192.168.0.35/", 3);
		const OBJ=new Extract(dom, win);
		assert.equal(OBJ instanceof Extract, true, "bullet #9");
	
	/*
	compose(base: string):HashHashtable 
	hasStyles(sel: string | Element, pseud: Pseudable): boolean
	extractLocal(sel: string, pseud: Pseudable = null): Hashtable
	mapPseudo(sel: string): HashHashtable 
	taggedElements(base: string): Array<string> 
    */
		// IOIO add more here
	});
	

});
