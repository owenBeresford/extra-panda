import { Curl } from "node-libcurl";

export type PromiseCB = (a: any) => void;
export type CBtype = () => void;

export type successType = (
  statusCode: string,
  data: string,
  headers: CurlHeadersBlob,
) => void;
export type failureType = (msg: any) => void;
export type closeType = (cb: CBtype) => void;
export type wrappedCloseType = CBtype | boolean;

export interface Reference {
  url: string;
  desc: string;
  title: string;
  auth: string;
  date: number | string;
}

export type ModSymbol = keyof Reference;

// this Interface may exist else where
export interface HTMLTransformable {
  success(statusCode: string, data: string, headers: CurlHeadersBlob): void;

  failure(msg: any): void;

  promiseExits(good: PromiseCB, bad: PromiseCB, offset: number): void;

  assignClose(cb: CBtype): void;
}

export type VendorModCB = (a: Reference, body: string) => Reference;
export interface VendorRecord {
  name: string;
  target: ModSymbol;
  callback: VendorModCB;
}

export type TaggedCurl = Curl & { isClose?: boolean };

// The Record is HTTP headers with strtolower on the name,
// As there is a self expanding list, I am cautious about adding a strict type
// Also the type wont have effect at runtime   , and it runtime created data
//
// As the headers have - in them, you are likjely to access the values as a hash key
// so alarge amount of effort to add a type adds nothing
export type CurlHeadersBlob = Record<string, string> & {
  result: { version: string; code: number; reason: string };
};

export type VendorModPassthru = (item: Reference, body: string) => Reference;

type NameString = "first" | string;
export type IPListable = Record<NameString, Array<string>>;


/**
        Interface for what params can be passed to fetch
        I added agent for differing HTTP implementations #leSigh

        @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
*/
export interface RemoteConfig {
  url: string;
  timeout: number;
  headers: Record<string, string>; // eg 'Content-Type': 'application/json'
  mode: string; // allowed values no-cors, *cors, same-origin
  method: string;
  credentials: string;
  agent?: any;
}

export interface RunExecReturn {
  reqt: Record<string, string>;
  resp: Record<string, string>;
}

type ProcessEnv = typeof process;

// I extracted Struct to make the code easier, so I had named fields.
export interface FileExecFlags {
  cwd?: string | URL;
  env?: any;
  encoding?: "ascii"| "buffer";
  timeout?: number; // ms
  maxBuffer?: number;
  killSignal?: number; // | Signals;
  uid?: number;
  gid?: number;
  windowsHide?: boolean;
  windowsVerbatimArguments?: boolean;
  shell?: boolean | string;
  signal?: AbortSignal;
}


