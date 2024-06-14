/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { register, access } from './vanilla';

"use strict";
register('addOctoCats', addOctoCats);
register('addBooks', addBooks);
register('addBashSamples', addBashSamples);
register('addFancyButtonArrow', addFancyButtonArrow);

/**
 * addOctoCats
 * Convert links labelled 'git' to the github logo
 *
 * @param {Document =document} dom
 * @public
 * @return {void}
 */ 
function addOctoCats(dom=document) {
	dom.querySelectorAll('article a').forEach(function(a, i) {
		if( a.innerText.trim().toLowerCase() === 'git') {
			a.innerText='';
			appendIsland(a, '<i class="fa fa-github" aria-hidden="true"></i>', dom);
			a.setAttribute("title", "Link to a github project.");
		}
	});
}

/**
 * addBooks
 * Convert links labelled 'docs' to an open book logo
 *
 * @param {Document =document} dom
 * @public
 * @return {void}
 */ 
function addBooks(dom=document) {
	dom.querySelectorAll('article a').forEach(function(a, i) {
		if( a.innerText.trim().toLowerCase() === 'docs') {
			a.innerText='';
			appendIsland(a, '<i class="fa fa-book-open" aria-hidden="true"></i>', dom);
			a.setAttribute("title", "Link to the project docs; it may be a git page, or a separate webpage. ");
		}
	});
}

/**
 * addBashSamples
 * Convert backticks to code blocks, markup distorted C 1line comments to actual C 1line comments
 * 
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function addBashSamples(dom=document) { 
	var r1=new RegExp('`\([^`]+\)`', 'g'), r2=new RegExp('\/ \/', 'g'); 
	var bash=dom.querySelectorAll('.addBashSamples');
	if(bash.length >0) {
		for(let i=0; i<bash.length; i++) { 
			bash[i].innerHTML=bash[i].innerHTML
				.replaceAll(r1, '<code class="bashSample" title="Quote from a bash; will add copy button">$1</code>')
				.replaceAll(r2, '//'); 
		}
	}
}

/**
 * addFancyButtonArrow
 * Markup buttons as a big arrow
 * 
 * @param {Document =document} dom
 * @public
 * @return {void}
 */
function addFancyButtonArrow(dom=document) {
		// maybe at some point refactor into addLeftArrow, addRightArrow
	let aa=dom.querySelector('.addArrow');
	for(let i=0; i<aa.length; i++) {
		appendIsland(aa[i].parentElement, '<i class="fa fa-play specialPointer " aria-hidden="true"></i>', dom);
	}
}

/** 
 * Only use for testing, it allows access to the entire API 
 */
export const TEST_ONLY ={ 
 addOctoCats,
 addBooks,
 addBashSamples,
 addFancyButtonArrow,
};

