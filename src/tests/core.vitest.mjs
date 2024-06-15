import { assert, describe, it } from "vitest";
import { JSDOM } from 'jsdom';

import { TEST_ONLY } from '../core';
import { appendIsland } from '../base';

const {
 openMastodon,
 closeMastodon,
 openShare,
 copyURL,
 shareMastodon,
 _map,
 initMastodon,
 initPopupMobile,
 storeAppearance,
 applyAppearance,
 burgerMenu,
 tabChange,
 siteCore
} = TEST_ONLY;

describe("TEST core", () => {
  it("go 1: burgerMeu", () => {
    assert.equal(1, 2, "assert #1");

  });	

});

