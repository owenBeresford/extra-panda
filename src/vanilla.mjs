/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

// no export
const ROOT={
	log:console.log,
};

/**
 * register
 * A function to manage bindings to the "caller" object
 *   this runtime build for objects is desired so I can effect conditional compilation
 * 
 * @param {string} name 
 * @param {Object} mod ~ a function or function making function TBC
 * @public
 * @return {void}
 */
export function register(name, mod) {	
	ROOT[name]= mod.bind(ROOT); 
	return ;
}

/**
 * access
 * Basic getter for this code simplify/ modernise/ tidyup
 * 
 * @public
 * @return {AggregateModule}
 */
export function access() {
	return ROOT;
}


