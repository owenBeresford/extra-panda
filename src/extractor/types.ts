export type Pseudable = string | null;
// null values are just not set
// maybe convert to a TS dictionary  https://stackoverflow.com/questions/15877362/declare-and-initialize-a-dictionary-in-typescript
// Hashtable: this is a list of CSS attributes
export type Hashtable = Record<string, string>;
// iHHT: this is a list of CSS rules
export type HashHashtable = Record<string, Hashtable>;
// HHHT: a CSS block, probably only for a single resolution
export type HashHashHashtable = Record<string, HashHashtable>;

export type ExportMode = 1 | 2; // 1=CSS, 2=JSON
