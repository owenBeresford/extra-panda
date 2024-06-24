/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import { Fetchable, SimpleResponse, Cookieable, MiscEvent } from './all-types';

function HTMLDetailsTrap(e:MiscEvent, dom:Document=document):boolean {
  if (e.code === "Escape" || e.key === "Escape") {
    const tt = dom.querySelectorAll("details[open]");
    if (tt.length) {
      tt[0].open = false;
    }
  }
  e.preventDefault();
  return false;
}

function HTMLDetailsClick(e:MiscEvent, dom:Document=document):boolean {
  const find = function (ele:HTMLElement, target:string):udefined|HTMLElement {
    if (ele.tagName === target) {
      return ele;
    }

    while (ele.tagName !== target) {
      // extra clause to allow links to exit this page
      if (ele.tagName === "A") {
        return ele;
      }
      if (ele.tagName === "BODY") {
        return undefined;
      }

      ele = ele.parentElement;
    }
    return ele;
  };

  const act = find(e.target, "DETAILS");
  if (act && act.tagName === "A") {
    return true;
  } else if (act && act.open) {
    act.open = false;
  } else if (act && !act.open) {
    act.open = true;
  } else if (!act) {
    const tt = document.querySelector("details[open]");
    if (tt) {
      tt.open = false;
    }
  }

  e.preventDefault();
  return false;
}

export function modalInit(dom:Document=document):void {
  let tmp:Array<HTMLDetailsElement>=Array.from(dom.querySelectorAll('.popOverWidget details'));
  if(tmp.length) {
	tmp.forEach( function(a:HTMLDetailsElement ) {  
    	a.addEventListener("keydown", HTMLDetailsTrap);
    	a.addEventListener("click", HTMLDetailsClick);
	});
  }
  // see if something can be done for mobile interactions
}
 
//////////////////////////////////////////// testing ////////////////////////////////////

export const TEST_ONLY= { modalInit,  HTMLDetailsClick, HTMLDetailsTrap  }; 

