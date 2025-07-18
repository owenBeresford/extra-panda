import { assert, describe, it } from "vitest";

import { FirstPage } from "../references/first-page";

// no test for promiseExits, assignClose,
describe("TEST references FirstPage ", () => {
  it("go 1: FirstPage failure ", async () => {
    let tmp = new Promise((good, bad) => {
      const obj = new FirstPage(false);
      obj.promiseExits(good, bad, -1);
      obj.failure(new Error("Oh No!"));
    }).then(
      (dat) => {
        assert.equal(1, 0, "K@@@XX0N!!, KL@@@XX0N!! bad, wrong, test die now");
		return false;
      },
      (err) => {
        assert.equal(
          "Error Error: Oh No!",
          err.toString(),
          "Error passed through to bad() CB successfully",
        );
		return false;
      },
    );
    await Promise.all([tmp]);
  });

  it("go 2: FirstPage success ", async () => {
    let tmp = new Promise((good, bad) => {
      const obj = new FirstPage(false);
      obj.promiseExits(good, bad, -1);
      obj.success("204", "", {});
    }).then(
      (dat) => {
        assert.equal([], dat, "parsed empty respoonse without error");
		return false;
      },
      (err) => {
        assert.equal(
          1,
          1,
          "Class reported bad oUtput, as it had no data " + err,
        );
		return false;
      },
    );

    let tmp2 = new Promise((good, bad) => {
      const obj = new FirstPage(false);
      obj.promiseExits(good, bad, -1);
      let html =
        '<p> <sup><a href="sfsdf">1</a></sup>  <sup><a href="sfsdf">1</a></sup>  <sup><a href="sfsdf">2</a></sup>  <sup><a href="sfsdf">3</a></sup> <sup><a href="sfsdf">4</a></sup>  <sup><a href="sfsdf">5</a></sup>   <sup><a href="sfsdf">6</a></sup>   </p>';
      obj.success("202", html, {});
    }).then(
      (dat) => {
        assert.deepEqual(
          ["sfsdf", "sfsdf", "sfsdf", "sfsdf", "sfsdf", "sfsdf", "sfsdf"],
          dat,
          "parsed fake response without error",
        );
		return false;
      },
      (err) => {
        assert.equal(1, 0, "K@@@XX0N!!, KL@@@XX0N!! bad, wrong, test die now");
      },
    );

    let tmp3 = new Promise((good, bad) => {
      const obj = new FirstPage(false);
      obj.promiseExits(good, bad, -1);
      let html = "";
      obj.success("510", html, {});
    }).then(
      (dat) => {
        assert.equal(
          "Recieved 510",
          dat.toString(),
          "Error passed through to bad() CB successfully",
        );
		return false;
      },
      (err) => {
        assert.equal(
          "Error: Recieved 510",
          err.toString(),
          "Error passed through to bad() CB successfully" + err,
        );
		return false;
      },
    );

    await Promise.all([tmp, tmp2, tmp3]);
  });
});
