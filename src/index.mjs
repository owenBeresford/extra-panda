/*jslint white: true, browser: true, devel: true,  nomen: true, todo: true */

import * as Types from './all-types';
import {access} from './code-collection';
import * as Vanilla from './code-collection';
import * as StringBase from './string-base';
import * as DOMBase from './dom-base';
import * as Effect from './effect';
import * as Masto from './mastodon';
import * as Core from './core';
import * as Adjacent from './adjacent';
import * as Biblio1 from './desktop-biblio';
import * as Biblio2 from './mobile-biblio';
import * as Reading from './reading';

const exec=access();
exec.siteCore();

