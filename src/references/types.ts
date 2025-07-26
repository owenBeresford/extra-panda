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
