import { assert, describe, it, expect } from "vitest";

import { page } from "./page-seed-vite";
import { appendIsland } from "../dom-base";
import { TEST_ONLY } from "../extractor/extract-reduce";

const { ExtractReduce } = TEST_ONLY;

describe("TEST generate CSS ", () => {
	it("go 1: ExtractReduce", () => {
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
 
});
