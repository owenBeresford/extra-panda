import type { Pseudable, Hashtable, HashHashtable, HashHashHashtable, ExportMode } from './types';
import { hash2json } from './output-formats';
import { ExtractMap } from './extract-map';
 
export class ExtractReduce {
    #dom:Document;
    #win:Window;

    /**
     * constructor
 
     * @param {Document} dom
     * @param {Window} win
     * @public
     * @returns {ExtractReduce}
     */
    constructor( dom: Document, win: Window) {
        this.#dom = dom;
        this.#win = win;
     }


  /**
     * filterCommonTags
     * For CSS attributes present on the body element, don't repeat.  Edits param
 
     * @param {HashHashtable} buf
	 * @param {string} root - selector for the component root element
     * @public
     * @return {HashHashtable}
     */
  filterCommonTags(buf:HashHashtable, root:string, src:ExtractMap):HashHashtable {
    let ZERO=src.extractLocal(src.exportClassname(root, true), null);
    for(let i in buf) {
        for(let j of Object.keys( buf[i] )) {
        /* If trap reads:
                * current CSS attribute is in the root element
                * and the selector isn't the root selector
                * and value of the attribute is the same
           then delete it, as it will inherit
        */
            if( j in ZERO && i!==root && ZERO[j] === buf[i][j] ) {
                delete buf[i][j];
            }
        }
    }

    ZERO=src.extractLocal("body",  null );
    for(let i in buf) {
        for(let j of Object.keys( buf[i] )) {
            if( j in ZERO && ZERO[j] === buf[i][j] ) {
                delete buf[i][j];
            }
        }
    }
    return buf;
}

filterEmpty(buf:HashHashtable):HashHashtable {
    for(let i of Object.keys(buf)) {
        if( Object.values(buf[i]).length===0 ) {
            delete buf[i];
        }
    }
    return buf;
}

/**
 * generateKey
 * HTTPS only, create a short hash of the supplied data

 * @param {Hashtable} val 
 * @public
 * @returns {string}
 */
async generateKey(val:Hashtable ):Promise<string> {
    let t1= JSON.stringify(val);
    const encoder = new TextEncoder();
    const data = encoder.encode(t1);
    
    let t2= await this.#win.crypto.subtle.digest("SHA-1", data);
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(t2)));
 }

/**
 * generateInvert
 * Create an invert index, so duplicate data can be removed

 * @param {HashHashtable } buf
 * @public
 * @returns {HashHashtable} 
 */
async generateInvert(buf:HashHashtable ):Promise<HashHashtable> {
    let inv:Hashtable={} as Hashtable;
    for(let i in buf) {
        let key=await this.generateKey(buf[i]);
        inv[key ]=i;
    }

    for(let i in buf) {
        let cur=await this.generateKey(buf[i] );
        if( cur in inv && inv[cur] !== i) {
            delete buf[i];
        }
    }
    return buf;
}

/**
 * externalFilter
 * A filter to strip vendor prefixed CSS so local CSS remains

 * @param {Array<string>} raw
 * @param {Array<string>} prefixes
 * @public
 * @returns {Array<string>}
 */
externalFilter(raw:Array<string>, prefixes:Array<string>):Array<string> {
    let ret:Array<string>=[];
    for(let i=0; i<raw.length; i++) {
        let found=false;
        prefixes.map( function (a:string, b:number):void { 
                let re1=new RegExp(' '+a, 'i');
                if (raw[i].startsWith(a))   { found=true; } 
                else if(raw[i].match(re1) ) { found=true; }
            } );
        if(!found) { ret.push(raw[i]); }
    }
    return ret;
}

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TEST_ONLY = {
    ExtractReduce,
};

