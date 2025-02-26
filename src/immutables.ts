
// This is in production, so it should be higher than 1.0.0
//    https://semver.org/
export const SELF_VERSION='1.0.4';
export const SELF_VERSION_SECTIONS=[1,0,4];

// used in some clent side created A.href
export const URL_PLACEHOLDER = "https://owenberesford.me.uk/";

// useful strings
export const ALL_REFERENCE = ".addReferences";
export const ALL_REFERENCE_LINKS = ALL_REFERENCE + " sup a";

// name of cookie , string
// here for brandability 
export const APPEARANCE_COOKIE = "appearance";

// name string for GET Param to enable WC feature.
export const ENABLE_SELECT = "select";

// how many PX in an EM
export const EM_SZ = 16;

// CSS Class used to turn on broken link reporting
//  This class is not present before the refs file is at the client side to avoid an entire page of errors
export const SHOW_ERROR = "showBiblioErrors";   

// TS doesn't have an IPaddr type?
// Pretend I have patch String.   #blerg
export const TEST_MACHINE = "192.168.0.35";

/**
  According to the internet a current phone is likely to have a PPI of over 300
  (historical trend) a cheap lazer will have a PPI of 300, 600 or 900 PPI
  a desktop / laptop is likely to have a 80-150 PPI
 
  @see https://www.displayninja.com/what-is-pixel-density/
  @see https://phonesdata.com/en/best/screenppi/
 */
export const MOBILE_MIN_PPI = 180;

