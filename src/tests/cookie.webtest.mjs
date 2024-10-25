import { assert, describe, it } from "jest-lite";

import { page } from "./page-seed-playwright";
import { Cookieable } from "../all-types";
import { isFullstack } from "../dom-base";
import { TEST_ONLY } from "../cookies";

const { QOOKIE, storeAppearance, applyAppearance } = TEST_ONLY;

describe("TEST cookies", () => {
//  it("go 1: getCookie ", () => // There is no point in checking "is a class a class"  
	
  it("go 2: storeAppearance ", (context) => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
    if (!isFullstack(win)) {
      context.skip();
    }
	
	dom.cookies="";
	storeAppearances("serif", "14", "ltr", "blue" );
	expect( dom.cookies ).isNot("");
console.log("Extend this cookie test ", dom.cookie);
  });

  it("go 3: applyAppearance ", (context) => {
    const [dom, loc, win] = page("http://192.168.0.35/resource/home", 3);
    if (!isFullstack(win)) {
      context.skip();
    }

  	let tmp=JSON.stringify({ ft: "serif", fs: "14", dn: "ltr", cr: "blue" });	
	dom.cookies=tmp;
	expect( dom.cookies ).toEqual( tmp );
	applyAppearance(dom);
	
	let tmp2=dom.getElementById("client-set-css");
	expect(tmp2).isNot(null).isNot(undefined);
  });

});

