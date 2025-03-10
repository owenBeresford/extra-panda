/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
// these are mostly the same, but I thought knowing the different sources may be useful.

export interface ReferenceType {
  date: number;
  title: string;
  desc: string;
  auth: string;
  url: string;
}

export interface NormalisedReference {
  offset: number;
  desc: string;
  title: string;
  date: string;
  auth: string;
  url: string;
}

export type MiscEventHandler = (a: Event) => void;
export type MiscEventHandler2 = (a: Event, dom: Document) => void;
export type MiscEventHandler3 = (
  a: Event,
  dom: Document,
  loc: Location | Window,
) => void;

export type MiscEventHandler4 = (
  dom: Document,
  loc: Location,
  win: Window,
) => Promise<void>;

export type MiscEventHandler5 = (
  a: Event,
  dom: Document,
  loc: Location,
  win: Window,
) => void;

export type BOUNDARY = "top" | "bottom" | "left" | "right" | "height" | "width";
export type ScreenSizeArray = [number, number];
export type ScreenOffsetArray = [number, number];
export type AccessDebugState = (loc: Location, nom: string) => boolean;

export interface Scrollable {
  scrollY: number;
  scrollX: number;
}

export type GenericEventHandler = (e: Event) => void;

export type MultiFuncArg = (id: string | MiscEvent) => void;

export interface ReadingProps {
  dataLocation: string;
  target: string;
  wordPerMin?: number;
  codeSelector?: string;
  timeFormat?: string;
  refresh: boolean;
  debug: boolean;
}

export interface CoreProps {
  pageInitRun?: number;

  mobileRunFetch?: FetchedExec;
  desktopRunFetch?: FetchedExec;
  adjacentRunFetch?: FetchedExec;
  debug: AccessDebugState;
}

export type Fetch = (u: string, o: RequestInit) => Promise<Response>;

export type Fetchable = Fetch | null;

export type FetchedExec = (
  url: string,
  trap: boolean,
  loc: Location,
) => Promise<SimpleResponse>;

export interface SimpleResponse {
  body: object | string;
  headers: Headers;
  ok: boolean;
}

export interface Cookieable {
  set(cName: string, cValue: string, expDays: number): void;
  get(cName: string): string;
}

export interface DesktopBiblioProps {
  indexUpdated?: number;
  referencesCache?: string;
  gainingElement?: string;

  maxAuthLen?: number;
  renumber?: number;

  runFetch: FetchedExec;
  debug: boolean;
}

export interface DesktopBiblioPropsDefinite {
  indexUpdated: number;
  referencesCache: string;
  gainingElement: string;

  maxAuthLen: number;
  renumber: number;

  runFetch: FetchedExec;
  debug: boolean;
}

export interface MobileBiblioProps {
  referencesCache?: string;
  gainingElement?: string;
  losingElement?: string;

  renumber?: number;
  forceToEnd?: number;
  maxAuthLen?: number;
  maxDescripLen?: number;

  runFetch: FetchedExec;
  debug: boolean;
}

export interface MobileBiblioPropsDefinite {
  referencesCache: string;
  gainingElement: string;
  losingElement: string;

  renumber: number;
  forceToEnd: number;
  maxAuthLen: number;
  maxDescripLen: number;

  runFetch: FetchedExec;
  debug: boolean;
}

export interface AdjacentProps {
  name?: string;
  meta?: string;
  perRow?: number;
  titleLimit?: number;
  rendered?: boolean;
  iteration?: number;
  group: string;
  count?: number;
  debug: boolean;
  runFetch: FetchedExec;
}

export interface AdjacentPropsDefinite {
  name: string;
  meta: string;
  perRow: number;
  titleLimit: number;
  rendered: boolean;
  iteration: number;
  group: string;
  count: number;
  debug: boolean;
  runFetch: FetchedExec;
}

export type BiblioProps = DesktopBiblioProps & MobileBiblioProps;

// add other possible events here
export type MiscEvent = MouseEvent | TouchEvent | KeyboardEvent;
