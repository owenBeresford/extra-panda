
type Pseudable = string | null;
// null values are just not set
// maybe convert to a TS dictionary  https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript
// Hashtable: this is a list of CSS attributes
type Hashtable = Record<string, string>;
// iHHT: this is a list of CSS rules       
type HashHashtable = Record<string, Hashtable>;
// HHHT: a CSS block, probably only for a single resolution
type HashHashHashtable = Record<string, HashHashtable>;

type ExportMode= 1 | 2; // 1=CSS, 2=JSON

// IOIO XXX Split class from output drivers & probably split class  Map -> Reduce sections

/**
 * hash2CSSblock
 * rasterise some CSS
 
 * @param {HashHashtable} src
 * @param {string} mq - ... media query where needed
 * @param {string =""} whitespace
 * @public
 * @returns {string}
 */
function hash2CSSblock(src: HashHashtable, mq: string, whitespace: string = ""): string {
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
function hash2CSS(sel: string, src: Hashtable): string {
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
function hash2json(src: Hashtable): string {
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
function hashHash2json(src: HashHashtable): string {
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



class Extract {
	#dom: Document;
	#win: Window;

    /**
     * pseudo elements used is the target CSS, list to be extended, possibly

	 * @see [https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements]
     */
	static PSEUDO: Array<Pseudable> = [
		null,
		"before",
		"after",
		"marker",
	];

	static CSS_ACTIVE:Array<string> =[
"align-content",
"align-items",
"align-self",
"appearance",
"aspect-ratio",
"background",
"background-color",
"border",
"border-bottom",
"border-bottom-right-radius",
"border-left",
"border-left-width",
"border-radius",
"border-top",
"border-top-right-radius",
"border-top-width",
"border-width",
"bottom",
"clear",
"clip",
"clip-path",
"color",
"column-count",
"column-gap",
"columns",
"column-width",
"contain",
"container",
"content",
"d",
"direction",
"display",
"filter",
"flex",
"flex-direction",
"flex-flow",
"flex-wrap",
"float",
"font",
"font-family",
"font-size",
"font-style",
"font-weight",
"gap",
"height",
"hyphenate-character",
"inset",
"justify-content",
"left",
"line-height",
"list-style",
"list-style-position",
"list-style-type",
"margin",
"margin-block",
"margin-block-end",
"margin-block-start",
"margin-bottom",
"margin-left",
"margin-right",
"margin-top",
"marker",
"max-width",
"min-height",
"min-width",
"opacity",
"order",
"outline",
"overflow",
"overflow-wrap",
"overflow-x",
"overflow-y",
"padding",
"padding-bottom",
"padding-inline",
"padding-inline-start",
"padding-left",
"padding-right",
"padding-top",
"page",
"place-self",
"pointer-events",
"position",
"r",
"resize",
"right",
"rotate",
"ry",
"scrollbar-color",
"scrollbar-width",
"scroll-snap-align",
"scroll-snap-type",
"text-align",
"text-decoration",
"text-transform",
"text-wrap",
"text-wrap-mode",
"top",
"transform",
"transition",
"translate",
"user-select",
"vertical-align",
"visibility",
"white-space",
"width",
"word-break",
"x",
"y",
"z-index",
];

	static CSS_KEYWORDS:Array<string> =[
"accent-color",
"align-content",
"align-items",
"align-self",
"animation",
"animation-composition",
"animation-delay",
"animation-direction",
"animation-duration",
"animation-fill-mode",
"animation-iteration-count",
"animation-name",
"animation-play-state",
"animation-timing-function",
"appearance",
"aspect-ratio",
"backdrop-filter",
"backface-visibility",
"background",
"background-attachment",
"background-blend-mode",
"background-clip",
"background-color",
"background-image",
"background-origin",
"background-position",
"background-position-x",
"background-position-y",
"background-repeat",
"background-size",
"baseline-source",
"block-size",
"border",
"border-block",
"border-block-color",
"border-block-end",
"border-block-end-color",
"border-block-end-style",
"border-block-end-width",
"border-block-start",
"border-block-start-color",
"border-block-start-style",
"border-block-start-width",
"border-block-style",
"border-block-width",
"border-bottom",
"border-bottom-color",
"border-bottom-left-radius",
"border-bottom-right-radius",
"border-bottom-style",
"border-bottom-width",
"border-collapse",
"border-color",
"border-end-end-radius",
"border-end-start-radius",
"border-image",
"border-image-outset",
"border-image-repeat",
"border-image-slice",
"border-image-source",
"border-image-width",
"border-inline",
"border-inline-color",
"border-inline-end",
"border-inline-end-color",
"border-inline-end-style",
"border-inline-end-width",
"border-inline-start",
"border-inline-start-color",
"border-inline-start-style",
"border-inline-start-width",
"border-inline-style",
"border-inline-width",
"border-left",
"border-left-color",
"border-left-style",
"border-left-width",
"border-radius",
"border-right",
"border-right-color",
"border-right-style",
"border-right-width",
"border-spacing",
"border-start-end-radius",
"border-start-start-radius",
"border-style",
"border-top",
"border-top-color",
"border-top-left-radius",
"border-top-right-radius",
"border-top-style",
"border-top-width",
"border-width",
"bottom",
"box-decoration-break",
"box-shadow",
"box-sizing",
"break-after",
"break-before",
"break-inside",
"caption-side",
"caret-color",
"clear",
"clip",
"clip-path",
"clip-rule",
"color",
"color-adjust",
"color-interpolation",
"color-interpolation-filters",
"color-scheme",
"column-count",
"column-fill",
"column-gap",
"column-rule",
"column-rule-color",
"column-rule-style",
"column-rule-width",
"columns",
"column-span",
"column-width",
"contain",
"container",
"container-name",
"container-type",
"contain-intrinsic-block-size",
"contain-intrinsic-height",
"contain-intrinsic-inline-size",
"contain-intrinsic-size",
"contain-intrinsic-width",
"content",
"content-visibility",
"counter-increment",
"counter-reset",
"counter-set",
"cursor",
"cx",
"cy",
"d",
"direction",
"display",
"dominant-baseline",
"empty-cells",
"fill",
"fill-opacity",
"fill-rule",
"filter",
"flex",
"flex-basis",
"flex-direction",
"flex-flow",
"flex-grow",
"flex-shrink",
"flex-wrap",
"float",
"flood-color",
"flood-opacity",
"font",
"font-family",
"font-feature-settings",
"font-kerning",
"font-language-override",
"font-optical-sizing",
"font-palette",
"font-size",
"font-size-adjust",
"font-stretch",
"font-style",
"font-synthesis",
"font-synthesis-position",
"font-synthesis-small-caps",
"font-synthesis-style",
"font-synthesis-weight",
"font-variant",
"font-variant-alternates",
"font-variant-caps",
"font-variant-east-asian",
"font-variant-ligatures",
"font-variant-numeric",
"font-variant-position",
"font-variation-settings",
"font-weight",
"forced-color-adjust",
"gap",
"grid",
"grid-area",
"grid-auto-columns",
"grid-auto-flow",
"grid-auto-rows",
"grid-column",
"grid-column-end",
"grid-column-gap",
"grid-column-start",
"grid-gap",
"grid-row",
"grid-row-end",
"grid-row-gap",
"grid-row-start",
"grid-template",
"grid-template-areas",
"grid-template-columns",
"grid-template-rows",
"height",
"hyphenate-character",
"hyphens",
"image-orientation",
"image-rendering",
"ime-mode",
"inline-size",
"inset",
"inset-block",
"inset-block-end",
"inset-block-start",
"inset-inline",
"inset-inline-end",
"inset-inline-start",
"isolation",
"justify-content",
"justify-items",
"justify-self",
"left",
"letter-spacing",
"lighting-color",
"line-break",
"line-height",
"list-style",
"list-style-image",
"list-style-position",
"list-style-type",
"margin",
"margin-block",
"margin-block-end",
"margin-block-start",
"margin-bottom",
"margin-inline",
"margin-inline-end",
"margin-inline-start",
"margin-left",
"margin-right",
"margin-top",
"marker",
"marker-end",
"marker-mid",
"marker-start",
"mask",
"mask-clip",
"mask-composite",
"mask-image",
"mask-mode",
"mask-origin",
"mask-position",
"mask-position-x",
"mask-position-y",
"mask-repeat",
"mask-size",
"mask-type",
"math-depth",
"math-style",
"max-block-size",
"max-height",
"max-inline-size",
"max-width",
"min-block-size",
"min-height",
"min-inline-size",
"min-width",
"mix-blend-mode",
"object-fit",
"object-position",
"offset",
"offset-anchor",
"offset-distance",
"offset-path",
"offset-position",
"offset-rotate",
"opacity",
"order",
"outline",
"outline-color",
"outline-offset",
"outline-style",
"outline-width",
"overflow",
"overflow-anchor",
"overflow-block",
"overflow-clip-margin",
"overflow-inline",
"overflow-wrap",
"overflow-x",
"overflow-y",
"overscroll-behavior",
"overscroll-behavior-block",
"overscroll-behavior-inline",
"overscroll-behavior-x",
"overscroll-behavior-y",
"padding",
"padding-block",
"padding-block-end",
"padding-block-start",
"padding-bottom",
"padding-inline",
"padding-inline-end",
"padding-inline-start",
"padding-left",
"padding-right",
"padding-top",
"page",
"page-break-after",
"page-break-before",
"page-break-inside",
"paint-order",
"perspective",
"perspective-origin",
"place-content",
"place-items",
"place-self",
"pointer-events",
"position",
"print-color-adjust",
"quotes",
"r",
"resize",
"right",
"rotate",
"row-gap",
"ruby-align",
"ruby-position",
"rx",
"ry",
"scale",
"scrollbar-color",
"scrollbar-gutter",
"scrollbar-width",
"scroll-behavior",
"scroll-margin",
"scroll-margin-block",
"scroll-margin-block-end",
"scroll-margin-block-start",
"scroll-margin-bottom",
"scroll-margin-inline",
"scroll-margin-inline-end",
"scroll-margin-inline-start",
"scroll-margin-left",
"scroll-margin-right",
"scroll-margin-top",
"scroll-padding",
"scroll-padding-block",
"scroll-padding-block-end",
"scroll-padding-block-start",
"scroll-padding-bottom",
"scroll-padding-inline",
"scroll-padding-inline-end",
"scroll-padding-inline-start",
"scroll-padding-left",
"scroll-padding-right",
"scroll-padding-top",
"scroll-snap-align",
"scroll-snap-stop",
"scroll-snap-type",
"shape-image-threshold",
"shape-margin",
"shape-outside",
"shape-rendering",
"stop-color",
"stop-opacity",
"stroke",
"stroke-dasharray",
"stroke-dashoffset",
"stroke-linecap",
"stroke-linejoin",
"stroke-miterlimit",
"stroke-opacity",
"stroke-width",
"table-layout",
"tab-size",
"text-align",
"text-align-last",
"text-anchor",
"text-combine-upright",
"text-decoration",
"text-decoration-color",
"text-decoration-line",
"text-decoration-skip-ink",
"text-decoration-style",
"text-decoration-thickness",
"text-emphasis",
"text-emphasis-color",
"text-emphasis-position",
"text-emphasis-style",
"text-indent",
"text-justify",
"text-orientation",
"text-overflow",
"text-rendering",
"text-shadow",
"text-transform",
"text-underline-offset",
"text-underline-position",
"text-wrap",
"text-wrap-mode",
"text-wrap-style",
"top",
"touch-action",
"transform",
"transform-box",
"transform-origin",
"transform-style",
"transition",
"transition-behavior",
"transition-delay",
"transition-duration",
"transition-property",
"transition-timing-function",
"translate",
"unicode-bidi",
"user-select",
"vector-effect",
"vertical-align",
"visibility",
"white-space",
"white-space-collapse",
"width",
"will-change",
"word-break",
"word-spacing",
"word-wrap",
"writing-mode",
"x",
"y",
"z-index",
"zoom",
];

    /**
     * constructor
 
     * @param {Document} dom
     * @param {Window} win
     * @public
     * @returns {Extract}
     */
	constructor(dom: Document, win: Window) {
		this.#dom = dom;
		this.#win = win;
	}

    /**
     * compose
     * Extract CSS active on this component
	 * window size and DPI moved outside of method and class as it needs a new interpreter
 
     * @param {string} base
     * @param {Array<string>} vendor 
     * @public
     * @returns {HashHashtable}
     */
	async compose(base: string, vendor:Array<string>):Promise<HashHashtable> {
		let buf: HashHashtable = {} as HashHashtable; // I may need hashhashhashtable
		const BASELINE: Array<string> = this.externalFilter(this.taggedElements(base), vendor);
		
		for (let i: number = 0; i < BASELINE.length; i++) {
			let list = this.mapPseudo(BASELINE[i]);
			let keys = Object.keys(list);

			for (let j = 0; j < keys.length; j++) {
				if (keys[j] in buf) {
					console.info("[SKIP] DUPLICATE element " + list[j]);
					continue;
				}
				if (j === 0) {
					buf[keys[j]] = list[keys[j]];
				} else if (!this.compareTrees(list[keys[0]], list[keys[j]])) {
					buf[keys[j]] = list[keys[j]];
				}
			}
		}

		buf=this.filterCommonTags(buf, base);
		if(location.protocol==="https:") {  
			// maybe remove this if-trap on production code
			buf=await this.generateInvert(buf );
		}

// IOIO add filter for CSS attributes that are exactly the same in the component root
		return buf;
	}

    /**
     * filterCommonTags
     * For CSS attributes present on the body element, don't repeat.  Edits param
 
     * @param {HashHashtable} buf
	 * @param {string} root - selector for the component root element
     * @public
     * @return {HashHashtable}
     */
	 filterCommonTags(buf:HashHashtable, root:string):HashHashtable {
		let ZERO=this.extractLocal(this.exportClassname(root, true), null);
console.log("ZERO "+root, ZERO, buf );
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

		ZERO=this.extractLocal("body",  null );
console.log("ZERO 'body'", ZERO, buf );
		for(let i in buf) {
			for(let j of Object.keys( buf[i] )) {
				if( j in ZERO && ZERO[j] === buf[i][j] ) {
					delete buf[i][j];
				}
			}
		}
console.log("ZERO END", buf );
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

    /**
     * treeWalk
     * Build a longer reference for a selector. 
	 * Root should be unique to admin reasons, so I can use this as a break clause.
 
     * @param {string} cls
     * @param {HTMLElement} e - to be able to look at parent nodes
     * @param {string} root - the container/ root element for this component
     * @public
     * @returns {string}
     */
	treeWalk(cls: string, e: HTMLElement, root: string): string {
		let ret: Array<string> = ["."+cls];
		let stay = true;
		var rootSplit:Array<string>;
		if(root.includes(' ')) {
// type changed here
			rootSplit=root.split(' ').map( function (a, b) { return a.trim(); } );
			if(rootSplit.length>2 ) { throw new Error("Not supported to have a 3+ clause component root"); }
		}

		while (stay) {
			if (e.classList.contains(root)) {
				ret.unshift(this.exportClassname(root));
				stay = false;
				break;
			}
			if( rootSplit && e.classList.contains( rootSplit[1] ) &&
				(e.parentNode as HTMLElement).classList.contains( rootSplit[0] ) ) {
				ret.unshift( this.exportClassname( root) );
				stay = false;
				break;
			}

			if (e.tagName === "BODY") {
				stay = false;
				break;
			}
			if (e.classList.length) {
				ret.unshift(this.exportClassname( e.className));
			}
			// in this edition, if no class, skip over that element
			e = e.parentNode as HTMLElement;
		}
		ret.pop(); // or the element of interest is mentioned twice
		return ret.join(" .").replaceAll("..", ".");
	}


    /**
     * exportClassname
     * Add CSS notation to classnames from HTML 
	// works unless there are ids in the CSS
 
     * @param {string} cls
     * @param {boolean =false } nest
     * @public
     * @return {string}
     */
	 exportClassname(cls:string, nest:boolean=false ):string {
		if(nest) {
			return "."+cls.trim().replaceAll(' ', ' .');
		}
		return "."+cls.trim().replaceAll(' ', '.');
	}

    /**
     * hasStyles
     * show if there are styles
 
     * @param {string | HTMLElement} sel
     * @param {Pseudable} pseud
     * @public
     * @returns {boolean}
     */
	hasStyles(sel: string | HTMLElement, pseud: Pseudable): boolean {
		if (typeof sel === 'string') {
			sel = this.#dom.querySelector(sel) as HTMLElement;
		}
		const STYLES = this.#win.getComputedStyle(sel, pseud);
		return STYLES.length > 0;
	}

    /**
     * extractLocal
     * generate the CSS attributes for the current node

Alternative solutions:
SEE https://stackoverflow.com/questions/34152474/find-tags-that-have-a-css-field-explicitly-set
SEE https://stackoverflow.com/questions/46828223/get-css-not-computed-property-value-with-javascript-only
SEE https://stackoverflow.com/questions/324486/how-do-you-read-css-rule-values 
SEE https://stackoverflow.com/questions/66912181/how-can-i-get-a-css-value-in-its-original-unit-with-javascript

     * @param {string} sel
     * @param {Pseudable = null} pseud
     * @public
     * @returns {Hashtable }
     */
	extractLocal(sel: string, pseud: Pseudable = null): Hashtable {
		const TARGET = this.#dom.querySelector(sel);
		console.assert(TARGET!==null,"Value passed '"+sel+"' into localExtract doesnt work in current doc." );
		const PARENT: Element = TARGET.parentNode as Element;
		const STYLES = this.#win.getComputedStyle(TARGET, pseud);
		const PSTYLES = this.#win.getComputedStyle(PARENT, pseud);
		let hash: Hashtable = {} as Hashtable;

		for (let i = 0; i < STYLES.length; i++) {
			if( this.isUsefulCSSAttribute(
						STYLES.item(i),  
						STYLES.getPropertyValue(STYLES.item(i)), 
						PSTYLES.getPropertyValue(STYLES.item(i))
										) ) {
				hash[STYLES.item(i)] = STYLES.getPropertyValue(STYLES.item(i));	
			}
		}
		return hash;
	}

    /**
     * isUsefulCSSAttribute
     * Isolate logic for "do we use this attrib"
 
     * @param {string} key - CSS attribute name, hopefully lowercase
     * @param {string} val - current element value
     * @param {string} pval - the parent value, to see if we can inherit it 
     * @public
     * @return {boolean}
     */
	 isUsefulCSSAttribute(key:string, val:string, pval:string ):boolean {
		if(key.startsWith("--")) { // CSS variables 
			return true;
		} 
		if(! Extract.CSS_ACTIVE.includes(key )) {
			return false;
		}
		if(pval !=="" && pval !== null && pval !== val) {
			return true;
		}
		return false;
	}

    /**
     * mapPseudo
     * Try the pseudo elements
 
     * @param {string} sel
     * @public
     * @returns {HashHashtable }
     */
	 mapPseudo(sel: string): HashHashtable {
		console.assert(sel.trim()!==".", "bad data extaction, got '.'");
		let hash: HashHashtable = {} as HashHashtable;
		const TMP:HTMLElement = this.#dom.querySelector(sel) as HTMLElement;
		console.assert(TMP!==null, "bad data extraction for "+sel );
		for (let i in Extract.PSEUDO) {
			if (this.hasStyles(sel, Extract.PSEUDO[i])) {
				let nom = sel;
				if (Extract.PSEUDO[i]) {
					nom += ":" + Extract.PSEUDO[i];
				}
				hash[nom] = this.extractLocal(sel, Extract.PSEUDO[i]);
			}
		}
		return hash;
	}

    /**
     * taggedElements
     * List elements with CSS classes
     * WARN: some of my CSS behaviour is unnamed child element of X, but most isn't (its labelled with X)
 
     * @param {string} base - the root element of the component with no '.'
     * @public
     * @returns {Array<string>}
     */
	taggedElements(base: string): Array<string> {
		let list: Array<string> = [];
		const SELF = this;
		Array.from(this.#dom.querySelectorAll("."+base + ' [class]')).map(function (a, b) {
			if(a.className.trim()==="" ) { return; }

			let tmp = a.className.trim().replaceAll("  ", " ").split(" ");
			tmp=tmp.map((a2, b2) => {
				return "."+a2;
			});
			// I hope I don't need to filter any empty strings
			list.push( ...tmp.map( (a2, b2) => { return "."+base+" "+a2; } ) );
			list.push( ...tmp );
			tmp.map(function (a2, b2) { list.push( SELF.treeWalk(a2, a as HTMLElement, base) ); });
		});
		// likely to be duplicates of a class usage 
		let swap = new Set(list);

		// maybe other elements after this,,.	
		// maybe manual logged from mouse events?
		return Array.from(swap);
	}

    /**
     * compareTrees
     * A hack impl for this algorithm point
     * I think this should work.
	 * only have use for === at present, but this algorithm has an externalised operator

     * @param {Hashtable} tree1
     * @param {Hashtable} tree2
     * @public
     * @returns {boolean}
     */
	compareTrees(tree1: Hashtable, tree2: Hashtable): boolean {
		// may need to add sorting on items...
		return hash2json(tree1) === hash2json(tree2);
	}


}

/**
 * output
 * Pipe a string to the clent side machine
 
 * @param {string} dat
 * @param {string="generated-sample.css" } fn
 * @public
 * @returns {void}
 */
function output(dat: string, fn: string = "generated-sample.css"): void {
	const link: HTMLAnchorElement = document.createElement("a");
	const blob = new Blob([dat], { type: "application/json", });
	let dat2 = URL.createObjectURL(blob);
	link.href = dat2;
	link.download = fn;
	link.click();
	URL.revokeObjectURL(dat2);
}

/**
 * generate_CSS_file
 * Actually create the CSS asset, returns it to the client
 *
 * @param {Document} doc
 * @param {Window} win
 * @public
 * @returns {void}
 */
export async function generate_CSS_file(dom: Document, win: Window):Promise<HashHashtable> {
// items in components should be written as in the HTML, without dots/ hashes
	let components = ["defaultLinksMenu", "h4_footer", "articleContent", "adjacentGroup", "articleHeader row",];
	const vendor:Array<string>=[".fa-", ".fa.fa-"];
	let buf: HashHashtable = {} as HashHashtable;
	let extr: Extract = new Extract(dom, win);

	for (let i in components) {
		let tmp= await extr.compose(components[i], vendor);
		for(let j of Object.keys( tmp ) ) {
			if( j in buf) {
				buf[j]=Object.assign( buf[j], tmp[j] );
			} else {
				buf[j]=tmp[j];
			}
		}
	}
	return buf;
}

export function dump_it(css:HashHashtable, mode:ExportMode, pattern:string):void {
	let css1:string;
	switch(mode) {
	case 1:
		css1=hash2CSSblock(css, pattern, "\n"); break;
	case 2:
		css1=hashHash2json(css); break;
	default: 
		throw new Error("Unknown value "+mode);
	}
	output(css1);  
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// test on node + JSDOM 
// but ignore garbage answers as CSS isn't used
// this library can be driven with tag name selectors

export const TEST_ONLY ={
	hash2CSSblock,
	hash2CSS,
	hash2json,
	output, 
	dump_it,
	generate_CSS_file,
	Extract
};

