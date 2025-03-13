import type { Pseudable, Hashtable, HashHashtable, HashHashHashtable, ExportMode } from './types';

/**
 * hash2CSSblock
 * rasterise some CSS
 
 * @param {HashHashtable} src
 * @param {string} mq - ... media query where needed
 * @param {string =""} whitespace
 * @public
 * @returns {string}
 */
export function hash2CSSblock(src: HashHashtable, mq: string, whitespace: string = ""): string {
	// might need to fiddle with brackets here ...
	let css = "@media screen and " + mq + " {" + whitespace;
	Object.keys(src).map(function (a, b) {
		css +=hash2CSS(a, src[a]) + whitespace;
	});
	css += "}" + whitespace;
	return css;
}

/**
 * hash2CSS
 * Rasterise some CSS
 
 * @param {string} sel
 * @param {Hashtable} src
 * @public
 * @returns {string}
 */
export function hash2CSS(sel: string, src: Hashtable): string {
	let css = sel + " {";
	
	for (let i of Object.keys(src)) {
		css += ` ${i}:${src[i]};`;
	}
	css += " }";
	return css;
}

/**
 * hash2json
 * Rasterise CSS to JSON text
 
 * @param {Hashtable} src
 * @public
 * @returns {string}
 */
export function hash2json(src: Hashtable): string {
	if( Object.keys(src).length===0 ) { return "{}"; }

	let src2:Hashtable={} ;
	// everything should be a string, so no bare words, so it should be valid JSON.
	if(typeof (Object.values(src)[0])=== "string") {
		for (let i of Object.keys(src )) {
			if(typeof src[i] === "string") {
			// Small feature mostly for font declarations
				src2[i]=src[i].replaceAll('"', '\\"');
			} else {
				src2[i]=src[i];
			}
		}
	} else {
		throw new Error("KLAAAXX0N, KLAAAAXX00n!!1eleven Implement me");
	}
	return JSON.stringify(src);
}

/**
 * hashHash2json
 * Rasterise CSS to JSON text
 
 * @param {Hashtable} src
 * @public
 * @returns {string}
 */
export function hashHash2json(src: HashHashtable): string {
	let src2:HashHashtable={};
	// I feel there should be more settings to this
	// everything should be a string, so no bare words, so it should be valid JSON.
	let keys=Object.keys(src);
	for(let i in keys) {
// first clause is less likely.
		if(typeof keys[i] ==="string") {
			keys[i]=keys[i].replaceAll('"', '\\"');
		}

		for(let j in src[ keys[i] ]) {
			src[ keys[i] ][j]=src[ keys[i] ][j].replaceAll('"', '\\"');
		}
	}
	return JSON.stringify(src);
}

/**
 * output
 * Pipe a string to the clent side machine
 
 * @param {string} dat
 * @param {string="generated-sample.css" } fn
 * @public
 * @returns {void}
 */
export function output(dat: string, fn: string = "generated-sample.css"): void {
	const link: HTMLAnchorElement = document.createElement("a");
	const blob = new Blob([dat], { type: "application/json", });
	let dat2 = URL.createObjectURL(blob);
	link.href = dat2;
	link.download = fn;
	link.click();
	URL.revokeObjectURL(dat2);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 
export const TEST_ONLY ={
	hash2CSSblock,
	hash2CSS,
	hash2json,
	output, 
 };

