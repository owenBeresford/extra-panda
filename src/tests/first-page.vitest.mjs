import { assert, describe, it, expect } from "vitest";

import { FirstPage } from "../references/first-page";

// no test for promiseExits, assignClose,
describe("TEST references FirstPage ", () => {
// this unit test would work well with a skelgen, no DOM involved
  it("go 4: URL washing ", () => {
      const obj = new FirstPage(false);
		const BASE_URL="https://192.168.1.123/";
		let reqt=[ BASE_URL+"?t1=34534&amp;t2=dgdg"],
			resp=[], 
			expt=[ BASE_URL+"?t1=34534&t2=dgdg"];
		resp=obj.urlCleaning(reqt);
		assert.equal(resp.length, 1, "URL cleaning has returned all URLs");
		assert.deepEqual(resp, expt, "step #1");

		  reqt=[ BASE_URL+"?t1=34534&amp;t2=dgdgi&amp;t3=erterte&amp;t4=sdfsdf"],
			resp=[], 
			expt=[ BASE_URL+"?t1=34534&t2=dgdgi&t3=erterte&t4=sdfsdf"];
		resp=obj.urlCleaning(reqt);
		assert.equal(resp.length, 1, "URL cleaning has returned all URLs");
		assert.deepEqual(resp, expt, "step #2");

		  reqt=[ BASE_URL+"?utm_source=wfsf&utm_medium=sefsdf&utm_term=dgdfgd"],
			resp=[], 
			expt=[ BASE_URL+""];
		resp=obj.urlCleaning(reqt);
		assert.equal(resp.length, 1, "URL cleaning has returned all URLs");
		assert.deepEqual(resp, expt, "step #3");

		  reqt=[ BASE_URL+"?q=ertert&utm_source=wfsf&utm_medium=sefsdf&utm_term=dgdfgd"],
			resp=[], 
			expt=[ BASE_URL+"q=ertert"];
		resp=obj.urlCleaning(reqt);
		assert.equal(resp.length, 1, "URL cleaning has returned all URLs");
		assert.deepEqual(resp, expt, "step #4");

		    reqt=[ BASE_URL+"?q=ertert&utm_source=wfsf&utm_medium=sefsdf&utm_term=dgdfgd&sort=-2"],
			resp=[], 
			expt=[ BASE_URL+"q=ertert&sort=-2"];
		resp=obj.urlCleaning(reqt);
		assert.equal(resp.length, 1, "URL cleaning has returned all URLs");
		assert.deepEqual(resp, expt, "step #5");

		    reqt=[ BASE_URL+"?q=utm_+keywords"],
			resp=[], 
			expt=[  BASE_URL+"?q=utm_+keywords" ];
		resp=obj.urlCleaning(reqt);
		assert.equal(resp.length, 1, "URL cleaning has returned all URLs");
		assert.deepEqual(resp, expt, "step #6");

		    reqt=[ "https://towardsdatascience.com?dfgdfg=dgdgd"],
			resp=[], 
			expt=[  "https://scribe.rip?dfgdfg=dgdgd" ];
		resp=obj.urlCleaning(reqt);
		assert.equal(resp.length, 1, "URL cleaning has returned all URLs");
		assert.deepEqual(resp, expt, "step #7");

		    reqt=[ "https://medium.com?dfgdfg=dgdgd"],
			resp=[], 
			expt=[  "https://scribe.rip?dfgdfg=dgdgd" ];
		resp=obj.urlCleaning(reqt);
		assert.equal(resp.length, 1, "URL cleaning has returned all URLs");
		assert.deepEqual(resp, expt, "step #8");

		    reqt=[ "https://sciencedirect.com?dfgdfg=dgdgd"];
			expect( ()=>obj.urlCleaning(reqt) ).toThrowError('sciencedirect');

		    reqt=[ "https://alibabacloud.cn?dfgdfg=dgdgd"];
			expect( ()=>obj.urlCleaning(reqt) ).toThrowError('alibabacloud');	
	});

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
