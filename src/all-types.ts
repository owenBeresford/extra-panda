/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */
import { MouseEvent, WheelEvent, TouchEvent, KeyboardEvent } from "jsdom";
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

export type ScreenSizeArray = [number, number];
export type MiscEventHandler = (a: Event) => void;
export type MiscEventHandler3 = (
  a: Event,
  dom: Document,
  loc: Location | Window,
) => void;
export type MiscEventHandler2 = (a: Event, dom: Document) => void;
export type BOUNDARY = "top" | "bottom" | "left" | "right" | "height" | "width";

export interface ReadingProps {
  dataLocation: string;
  target: string;
  wordPerMin: number;
  codeSelector: string;
  timeFormat: string;
  refresh: boolean;
}

export interface CoreProps {
  tabs: Array<string>;
  mobileWidth: number;
}

export type Fetch = (u: string, o: RequestInit) => Promise<Response>;

export type Fetchable = Fetch | null;

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
  indexUpdated: number;
  type: string;
  width: number;
  referencesCache: string;
  gainingElement: string;
  pageInitRun: number;
  renumber: number;
  tooltip: number;
  textAsName: number;
  wholeTitle: number;
  limitDesc: number;
  runFetch: Fetchable;
}

export interface MobileBiblioProps {
  referencesCache: string;
  gainingElement: string;
  losingElement: string;
  pageInitRun: number;
  renumber: number;
  tooltip: number;
  forceToEnd: number;
  runFetch: Fetchable;
}

export interface AdjacentProps {
  name: string;
  debug: boolean;
  meta: string;
  nextBar: number;
  titleLimit: number;
  rendered: boolean;
  iteration: number;
  group: string;
  count: number;
  runFetch: Fetchable;
}

export type BiblioProps = DesktopBiblioProps & MobileBiblioProps;

// add other possible events here
// src: shopping project, maybe also cats
export type MiscEvent = MouseEvent | WheelEvent | TouchEvent | KeyboardEvent;
