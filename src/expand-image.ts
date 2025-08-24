/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

/**
 * initExpandImage
 * Assign the event handler to be able to run trigger (below)
 *   IMPURE
 *
 * This code should be replaced with a pure CSS version
 *
 * @param {string} imgId
 * @param {string} btnId
 * @param {Document } dom
 * @public
 * @return {void}
 */
export function initExpandImage(imgId:string, btnId:string, dom:Document ):void {
	const TMP=dom.querySelector( btnId);
	TMP.addEventListener('mousedown', ()=> { return trigger( btnId, imgId ); }, {capture:true, passive:true });
	TMP.addEventListener('touchstart', ()=> { return trigger( btnId, imgId ); }, {capture:true, passive:true });
}

/**
 * trigger
 * Apply an extra CSS class to change targets size
    IMPURE
 
 * @param {string} btnId
 * @param {string} imgId
 * @param {string ="fullScreen"} clsName
 * @protected
 * @return {boolean}
 */
function trigger(btnId:string, imgId:string, clsName:string="fullScreen" ):boolean {
	const TMP=document.querySelector( imgId );
	const TMP2=document.querySelector( btnId );
	if( TMP.classList.contains(clsName ) ) {
		TMP.classList.remove( clsName);
		TMP2.innerText="Expand image";
	} else {
		TMP.classList.add( clsName);
		TMP2.innerText="Revert image";
	}
	return false;
}

export const TEST_ONLY ={ trigger,  initExpandImage };

