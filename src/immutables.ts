// This is in production, so it should be higher than 1.0.0
//    https://semver.org/
export const SELF_VERSION = "1.0.4";
export const SELF_VERSION_SECTIONS = [1, 0, 4];

// quite a few flags are read from the URL params
// need-to docs this aspect better

/**
 * matchVersion
 * fake SemVer

> "1.0.2" < "1.0.3"
true
> "1.0.2" < "1.0.1"
false
> "1.0.2" < "1.0.10"
false
> "1.0.2" <= "1.0.10"
false
> "1.0.2" <= "1.0.8"
true
> "1.0.2" <= "1.0.b"
true
> "1.0.2" < "1.0.2"
false
> "1.0.2" > "1.0.2"
false
 
 * @param {string} target
 * @public
 * @returns {boolean}
 */
export function matchVersion(target: string): boolean {
  // see samples, needs replacing before 1.0.10 is hit,
  return SELF_VERSION >= target;
}

// used in some client side created A.href
export const URL_PLACEHOLDER = "https://owenberesford.me.uk/";

// useful strings
export const ALL_REFERENCE = ".addReferences";
export const ALL_REFERENCE_LINKS = ALL_REFERENCE + " sup a";

// name of cookie , string
// here for brandability
export const APPEARANCE_COOKIE = "appearance";

// name string for GET Param to enable WC feature.
// "Word counting", inside a text select
export const ENABLE_SELECT = "select";

// how many PX in an EM
export const EM_SZ = 16;

// values for the biblio feature, this renders the full tooltip
export const BIBLIO_DESKTOP_ENABLED = 1;
// otherwise just set the Harvard reference numbers correctly, as each Wiki text block starts at 1.
export const BIBLIO_COUNTS_ENABLED = 2;
// current value
export const BIBLIO_OPERATIONAL = BIBLIO_COUNTS_ENABLED;

// CSS Class used to turn on broken link reporting
//  This class is not present before the refs file is at the client side to avoid an entire page of errors
//  so set in JS.
export const SHOW_ERROR = "showBiblioErrors";

// TS doesn't have an IPaddr type?
// ...Pretend I have patched String type.   #blerg
export const TEST_MACHINE = "http://192.168.1.218/";

/**
  According to the internet a current phone is likely to have a PPI of over 300
  (historical trend) a cheap lazer will have a PPI of 300, 600 or 900 PPI
  a desktop / laptop is likely to have a 80-150 PPI
 
  @see https://www.displayninja.com/what-is-pixel-density/
  @see https://phonesdata.com/en/best/screenppi/
 */
export const MOBILE_MIN_PPI = 180;
