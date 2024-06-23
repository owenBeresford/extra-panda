/*jslint white: true, browser: true, devel: true, nomen: true, todo: true */
import { MisshapeComposite } from "./all-types";

const u = new URLSearchParams();
const tmp = () => {
  return u.has("debug");
};
// no export
const ROOT: MisshapeComposite = {
  debug: tmp,
  log: function (typ: string, ...inputs: string[]) {
    if (typ in console) {
      console[typ](`[${typ.toUpperCase()}] ${inputs.join(", ")}`);
    } else {
      console.log(`[${typ.toUpperCase()}] ${inputs.join(", ")}`);
    }
  },
};

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
export function register(name: string, mod: Function): void {
  ROOT[name] = mod.bind(ROOT);
}

/**
 * access
 * Basic getter for this code simplify/ modernise/ tidyup
 *
 * @public
 * @return { MisshapeComposite }
 */
export function access(): MisshapeComposite {
  return ROOT;
}
