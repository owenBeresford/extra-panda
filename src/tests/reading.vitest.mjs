import { assert, describe, it } from "vitest";

import { page } from "./page-seed-vite";
import { TEST_ONLY } from "../reading";
import { appendIsland } from "../dom-base";
const { readingDuration } = TEST_ONLY;

describe("TEST readingDuration", () => {
  it("go 1: readingDuration function is available correctly", () => {
    // this test was written first, and to show that the test framework was linking correctly.
    assert.equal(typeof readingDuration, "function", "assert #1");
  });

  it("go 2: testing content manipulation", () => {
    const [dom, loc] = page("https://192.168.0.35/?debug=1", 2);
    let txt = `
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
`;
    appendIsland(".blocker", txt, dom);
    assert.notEqual(dom.getElementById("point2"), null, "assert #4");
    assert.equal(
      dom.getElementById("point2").textContent.split(" ").length,
      txt.split(" ").length,
      "assert #5",
    );

    readingDuration(
      {
        refresh: true,
        debug: () => {
          return true;
        },
      },
      dom,
      loc,
    );
    let tt = dom.querySelector("#shareGroup a.reading").textContent;
    assert(tt, "To read: 1m", "assert #6");
  });

  it("go 3: extra text and images", () => {
    const [dom, loc] = page("https://192.168.0.35/", 2);
    let txt = `<img src="dfgdfg" width="30%" /> <img src="dfgdfg" width="30%" /> <img src="dfgdfg" width="30%" />
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
`;
    appendIsland(".blocker", txt, dom);
    assert.notEqual(dom.getElementById("point2"), null, "assert #7");

    readingDuration({ refresh: true }, dom, loc);
    let tt = dom.querySelector("#shareGroup a.reading").textContent;
    assert.equal(tt, "To read: 6m", "assert #8");
  });

  it("go 3.1: extra text and images", () => {
    const [dom, loc] = page("https://192.168.0.35/", 2);
    let txt = `<img src="dfgdfg" width="30%" /> <img src="dfgdfdfgg" width="30%" /> <img src="df234gdfg" width="30%" />
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
wer werwer wer werwer wer werwer werwer wer werwer wer 
`;
    appendIsland(".blocker", txt, dom);
    assert.notEqual(dom.getElementById("point2"), null, "assert #7");

    readingDuration({ refresh: true }, dom, loc);
    let tt = dom.querySelector("#shareGroup a.reading").textContent;
    assert.equal(tt, "To read: 16m", "assert #8");
  });

  it("go 4: growth test (refresh flag + output value should be larger)", () => {
    const [dom, loc] = page("https://192.168.0.35/", 2);
    let txt = `<img src="dfgdfg" width="30%" /> <img src="dfgdfg" width="30%" /> <img src="dfgdfg" width="30%" />
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer
wer werwer wer werwer wer werwer werwer wer werwer wer 
`;
    appendIsland(".blocker", txt, dom);
    assert.notEqual(dom.getElementById("point2"), null, "assert #9");

    readingDuration({ refresh: true }, dom, loc);
    let tt = dom.querySelectorAll("#shareGroup a.reading");
    assert.equal(tt.length, 1, "assert #10");
    assert(Array.from(tt).pop().textContent, "To read: 4m", "assert #11");
  });
});
