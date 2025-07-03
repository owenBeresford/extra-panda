export type PromiseCB = (a: any) => void;
export type CBtype = () => void;

export type successType = (
  statusCode: string,
  data: string,
  headers: Record<string, string>,
) => void;
export type failureType = (msg: any) => void;
export type closeType = (cb: CBtype) => void;

export interface Reference {
  url: string;
  desc: string;
  title: string;
  auth: string;
  date: number | string;
}

// this Interface may exist else where
export interface HTMLTransformable {
  success(
    statusCode: string,
    data: string,
    headers: Record<string, string>,
  ): void;

  failure(msg: any): void;

  promiseExits(good: PromiseCB, bad: PromiseCB, offset: number): void;

  assignClose(cb: CBtype): void;
}

export type VendorModCB = (a: Reference, body: string) => Reference;
export interface VendorRecord {
  name: string;
  target: string;
  callback: VendorModCB;
}
