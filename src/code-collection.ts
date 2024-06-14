/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import { MisshapeComposite } from './all-types';

// no export
const ROOT:MisshapeComposite={
	debug:function() { return 0; },
	log:console.log,
} ;

/**
 * register
 * A function to manage bindings to the "caller" object
 *   this runtime build for objects is desired so I can effect conditional compilation
 * 
 * @param {string} name 
 * @param {Function} mod ~ a function or function making function TBC.  Vague typing, as all of them are different
 * @public
 * @return {void}
 */
export function register(name:string, mod:Function):void {	
	ROOT[name]= mod.bind(ROOT); 
}

/**
 * access
 * Basic getter for this code simplify/ modernise/ tidyup
 * 
 * @public
 * @return { MisshapeComposite }
 */
export function access():MisshapeComposite {
	return ROOT;
}


