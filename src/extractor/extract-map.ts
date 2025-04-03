import type { Pseudable, Hashtable, HashHashtable, HashHashHashtable, ExportMode } from './types';
import { hash2json } from './output-formats';
import { ExtractReduce } from './extract-reduce';
import { log, changeCount_simple } from "../log-services";

export class ExtractMap {
    #dom: Document;
    #win: Window;
    #reduce: ExtractReduce;

    /**
     * pseudo elements used is the target CSS, list to be extended, possibly

     * @see [https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements]
     */
    static PSEUDO: Array<Pseudable> = [
        null,
        "before",
        "after",
        ":marker",    // this needs double ':', so leads with one 
        "hover",
        'focus-within',
    ];

    static CSS_ACTIVE: Array<string> = [
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

    static CSS_KEYWORDS: Array<string> = [
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
 
     * @param {ExtractReduce} reduce
     * @param {Document} dom
     * @param {Window} win
     * @public
     * @returns {ExtractMap}
     */
    constructor(reduce: ExtractReduce, dom: Document, win: Window) {
        this.#dom = dom;
        this.#win = win;
        this.#reduce = reduce;
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
    async compose(base: string, vendor: Array<string>): Promise<HashHashtable> {
        let buf: HashHashtable = {} as HashHashtable; // I may need hashhashhashtable
        const BASELINE: Array<string> = this.#reduce.externalFilter(this.taggedElements(base), vendor);

        for (let i: number = 0; i < BASELINE.length; i++) {
            let list = this.mapPseudo(BASELINE[i]);
            let keys = Object.keys(list);

            for (let j = 0; j < keys.length; j++) {
                if (keys[j] in buf) {
                    log('assert', !(keys[j] in buf), "[SKIP] Duplicate element " + list[j]);
                    continue;
                }
                if (j === 0) {
                    buf[keys[j]] = list[keys[j]];
                } else if (!this.compareTrees(list[keys[0]], list[keys[j]])) {
                    buf[keys[j]] = list[keys[j]];
                }
            }
        }

        buf = this.#reduce.filterEmpty(this.#reduce.filterCommonTags(buf, base, this));
        if (location.protocol === "https:") {
            // maybe remove this if-trap on production code
            buf = await this.#reduce.generateInvert(buf);
        }
        return buf;
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
        Array.from(this.#dom.querySelectorAll("." + base + ' [class]')).map(function (a, b) {
            if (a.className.trim() === "") { return; }

            let tmp = a.className.trim().replaceAll("  ", " ").split(" ");
            tmp = tmp.map((a2, b2) => {
                return "." + a2;
            });
            // I hope I don't need to filter any empty strings
            list.push(...tmp.map((a2, b2) => { return "." + base + " " + a2; }));
            list.push(...tmp);
            tmp.map(function (a2, b2) { list.push(SELF.treeWalk(a2, a as HTMLElement, base)); });
        });

		log("warn", "initial select found "+list.length);
    	changeCount_simple(list, "");
        // likely to be duplicates of a class usage 
        let swap = new Set(list);
        list= Array.from(swap);
    	changeCount_simple(list, "taggedElements[dedup]");

        // maybe other elements after this,,.	
        // maybe manual logged from mouse events?
        return list;
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
        const TARGET = this.#dom.querySelector(sel) as Element;
        if(TARGET === null) {
			log("assert", TARGET!==null, "Value passed '" + sel + "' into localExtract doesnt work in current doc.");
			return {};
		}
        const PARENT: Element = TARGET.parentNode as Element;
        const STYLES = this.#win.getComputedStyle(TARGET, pseud);
        const PSTYLES = this.#win.getComputedStyle(PARENT, pseud);
        let hash: Hashtable = {} as Hashtable;

    	changeCount_simple([], "");
        for (let i = 0; i < STYLES.length; i++) {
            if (this.isUsefulCSSAttribute(
                STYLES.item(i),
                STYLES.getPropertyValue(STYLES.item(i)),
                PSTYLES.getPropertyValue(STYLES.item(i))
            )) {
                hash[STYLES.item(i)] = STYLES.getPropertyValue(STYLES.item(i));
            }
        }
    	changeCount_simple(hash, "extractLocal["+sel+"]");
        return hash;
    }

    /**
     * isUsefulCSSAttribute
     * Isolate logic for "do we use this attrib"
    
     * @param {string} key - CSS attribute name, hopefully lowercase
     * @param {string} val - current element value
     * @param {string} pval - the parent value, to see if we can inherit it 
     * @public
     * @returs {boolean}
     */
    isUsefulCSSAttribute(key: string, val: string, pval: string): boolean {
        if (key.startsWith("--")) { // CSS variables 
            return true;
        }
        if (!ExtractMap.CSS_ACTIVE.includes(key)) {
            return false;
        }
        if (pval !== "" && pval !== null && pval !== val) {
            return true;
        }
        return false;
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
     * mapPseudo
     * Try the pseudo elements
    
     * @param {string} sel
     * @public
     * @returns {HashHashtable }
     */
    mapPseudo(sel: string): HashHashtable {
        log("assert", (sel.trim() !== "."), "Bad data extaction, got '.'");
        let hash: HashHashtable = {} as HashHashtable;
        const TMP: HTMLElement = this.#dom.querySelector(sel) as HTMLElement;
        log("assert", (TMP !== null), "Bad data extraction for " + sel);
        for (let i in ExtractMap.PSEUDO) {
            if (this.hasStyles(sel, ExtractMap.PSEUDO[i])) {
                let nom = sel;
                if (ExtractMap.PSEUDO[i]) {
                    nom += ":" + ExtractMap.PSEUDO[i];
                }
                hash[nom] = this.extractLocal(sel, ExtractMap.PSEUDO[i]);
            }
        }
        return hash;
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
        let ret: Array<string> = ["." + cls];
        let stay = true;
        var rootSplit: Array<string> | null = null;
        if (root.includes(' ')) {
            // type changed here
            rootSplit = root.split(' ').map(function (a, b) { return a.trim(); });
            if (rootSplit.length > 2) { throw new Error("Not supported to have a 3+ clause component root"); }
        }

        while (stay) {
            if (e.classList.contains(root)) {
                ret.unshift(this.exportClassname(root));
                stay = false;
                break;
            }
            if (rootSplit && e.classList.contains(rootSplit[1]) &&
                (e.parentNode as HTMLElement).classList.contains(rootSplit[0])) {
                ret.unshift(this.exportClassname(root));
                stay = false;
                break;
            }

            if (e.tagName === "BODY") {
                stay = false;
                break;
            }
            if (e.classList.length) {
                ret.unshift(this.exportClassname(e.className));
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
     * @param {boolean =false } nest - the nest flag makes the result include spaces, so be a more complex selector
     * @public
     * @returns {string}
     */
    exportClassname(cls: string, nest: boolean = false): string {
        if (nest) {
            return ("." + cls.trim()).replaceAll(' ', ' .');
        }
        return ("." + cls.trim()).replaceAll(' ', '.');
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const TEST_ONLY = {
    ExtractMap,
};

