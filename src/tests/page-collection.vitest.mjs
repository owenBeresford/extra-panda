import { assert, expect, describe, it } from "vitest";

import { PageCollection } from "../references/page-collection";
import { BATCH_SZ } from "../references/constants";

// no test for promiseExits, assignClose, resultsArray
describe("TEST references PageCollection ", () => {
  it("go 1: currentBatch ", () => {
    const pc = new PageCollection(makeTestData(100));
    assert.deepEqual(makeTestData(BATCH_SZ, 0), pc.currentBatch, "batch at #0");
    assert.deepEqual(
      makeTestData(BATCH_SZ, 0),
      pc.currentBatch,
      "[1] batch at #0 ",
    );
    assert.deepEqual(
      makeTestData(BATCH_SZ, 0),
      pc.currentBatch,
      "[2] batch at #0",
    );
    pc.offset(BATCH_SZ - 1);
    assert.deepEqual(
      makeTestData(2 * BATCH_SZ, BATCH_SZ),
      pc.currentBatch,
      "batch at #1",
    );
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    pc.offset(BATCH_SZ - 1);
    assert.deepEqual(
      makeTestData(14 * BATCH_SZ, BATCH_SZ * 13),
      pc.currentBatch,
      "batch at #13",
    );
    pc.offset(BATCH_SZ - 1);
    assert.deepEqual(
      makeTestData(14 * BATCH_SZ + 2, BATCH_SZ * 14),
      pc.currentBatch,
      "batch at #14",
    );
    pc.offset(BATCH_SZ - 1);
  });

  it("go 2: save ", () => {
    const pc = new PageCollection(makeTestData(4));
    let item = {
      url: "https://site.tld/page4",
      desc: "TEST DATE: I have no idea",
      title: "TEST DATE: I have no idea",
      auth: "me",
      date: 0,
    };
    pc.save(item, 3);
    assert.deepEqual(
      pc.resultsArray,
      [false, false, false, item],
      "item was saved, and can be seen",
    );
    try {
      pc.save(item, 5);
    } catch (e) {
      assert.equal(1, 1, "Expected exception seen");
    }

    expect(() => pc.save(item, 10)).toThrowError(
      new Error("Why overwrite slot 10"),
    );
    pc.save(item, 2);
    expect(() => pc.save(item, 2)).toThrowError(
      new Error("Why overwrite slot 2"),
    );

    let item2 = Object.assign({}, item, { url: "" });
    expect(() => pc.save(item2, 1)).toThrowError(
      new Error("Why does the incoming data have no URL? 1"),
    );
  });

  it("go 3: offset ", () => {
    const pc = new PageCollection(makeTestData(100));

    assert.equal(0, pc.offset(0), "should be 0");
    assert.equal(1, pc.offset(1), "should be 1");
    assert.equal(2, pc.offset(2), "should be 2");
    assert.equal(3, pc.offset(3), "should be 3");
    assert.equal(4, pc.offset(4), "should be 4");
    assert.equal(5, pc.offset(5), "should be 5");
    assert.equal(6, pc.offset(6), "should be 6");
    assert.equal(7, pc.offset(0), "should be 7");

    assert.equal(8, pc.offset(1), "should be 8");
    assert.equal(9, pc.offset(2), "should be 9");
    assert.equal(10, pc.offset(3), "should be 10");
  });

  it("go 4: morePages ", () => {
    const pc = new PageCollection(makeTestData(100));
    assert.equal(true, pc.morePages(0), "step0");
    assert.equal(true, pc.morePages(5), "step1");
    assert.equal(true, pc.morePages(15), "step2");
    assert.equal(true, pc.morePages(99), "step3");
    assert.equal(false, pc.morePages(100), "step4");
    assert.equal(false, pc.morePages(101), "step5");
    //		assert.equal(false, pc.morePages(-1), "step6" );
  });

  it("go 5: mapRepeatDomain ", () => {
    const pc = new PageCollection(makeTestData(100));
    //  public mapRepeatDomain(url: string, cur: number): boolean
    pc.save(
      {
        url: "https://site.tld/page0",
        desc: "sdfs sfsfsf sf s",
        title: "sdf sfs fsdf sf",
        auth: "me",
        date: 0,
      },
      0,
    );
    pc.save(
      {
        url: "https://site.tld/page1",
        desc: "sdfs sfsfsf sf s",
        title: "sdf sfs fsdf sf",
        auth: "me",
        date: 0,
      },
      1,
    );
    pc.save(
      {
        url: "https://site.tld/page2",
        desc: "sdfs sfsfsf sf s",
        title: "sdf sfs fsdf sf",
        auth: "me",
        date: 0,
      },
      2,
    );
    // add resultsArray checking
    assert.equal(
      true,
      pc.mapRepeatDomain("https://site.tld/page1", 3),
      "step1",
    );
    assert.equal(
      true,
      pc.mapRepeatDomain("https://site.tld/page1#werwer", 4),
      "step2",
    );
    assert.equal(
      true,
      pc.mapRepeatDomain("https://site.tld/page1?wer=dfg&fdh=dret", 5),
      "step3",
    );
    assert.equal(false, pc.mapRepeatDomain("https://fourth.url/", 6), "step4");
  });

  it("go 6: mapFails ", () => {
    const pc = new PageCollection(makeTestData( 7));
	let sample=pc.currentBatch;
	let deaded={
		url: "mumbles",
		desc: "HTTP_ERROR, sfs Timeout",
		title: "HTTP_ERROR, sfs Timeout",
		auth: "me",
		date: 1343565678,
				};
	let liveo={ 
		url: "mumbles",
		desc: "dfsdfs fsf sdfsf sdf sdfs sdf sdf",
		title: "sdfs dfs sdfsdf sdfs fsdf sfs f sf",
		auth: "me",
		date: 1343565678,	
			};
	pc.save(Object.assign({}, deaded, { url:sample[0] }), 0);
	pc.save(Object.assign({}, deaded, { url:sample[1] }), 1);
	pc.save(Object.assign({}, liveo, { url:sample[2] }), 2);
	pc.save(Object.assign({}, deaded, { url:sample[3] }), 3);
	pc.save(Object.assign({}, liveo, { url:sample[4] }), 4);
	pc.save(Object.assign({}, liveo, { url:sample[5] }), 5);
	pc.save(Object.assign({}, deaded, { url:sample[6] }), 6);

	let ret=pc.mapFails();
    assert.equal(4 , ret.length, "step1");
    assert.equal("https://site.tld/page0", ret[0], "step2");
    assert.equal("https://site.tld/page1", ret[1], "step3");
    assert.equal("https://site.tld/page3", ret[2], "step4");
    assert.equal("https://site.tld/page6", ret[3], "step5");
  });

  it("go 6.1: mapFails ", () => {
	});

  it("go 7: merge ", () => {
    const pc1 = new PageCollection(makeTestData( 8));
	let sample=pc1.currentBatch;
	let deaded={
		url: "mumbles",
		desc: "HTTP_ERROR, sfs Timeout",
		title: "HTTP_ERROR, sfs Timeout",
		auth: "me",
		date: 1343565678,
				};
	let liveo={ 
		url: "mumbles",
		desc: "dfsdfs fsf sdfsf sdf sdfs sdf sdf",
		title: "sdfs dfs sdfsdf sdfs fsdf sfs f sf",
		auth: "me",
		date: 1343565678,	
			};
	pc1.save(Object.assign({}, deaded, { url:sample[0] }), 0);
	pc1.save(Object.assign({}, deaded, { url:sample[1] }), 1);
	pc1.save(Object.assign({}, liveo, { url:sample[2] }), 2);
	pc1.save(Object.assign({}, deaded, { url:sample[3] }), 3);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 4);
	pc1.save(Object.assign({}, liveo, { url:sample[5] }), 5);
	pc1.save(Object.assign({}, deaded, { url:sample[6] }), 6);
	pc1.save(Object.assign({}, deaded, { url:sample[6] }), 7);

	const pc2 = new PageCollection(makeTestData( 8));
	pc2.save(Object.assign({}, liveo, { url:sample[0] }), 0);
	pc2.save(Object.assign({}, liveo, { url:sample[1] }), 1);
	pc2.save(Object.assign({}, liveo, { url:sample[2] }), 2);
	pc2.save(Object.assign({}, liveo, { url:sample[3] }), 3);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 4);
	pc2.save(Object.assign({}, liveo, { url:sample[5] }), 5);
	pc2.save(Object.assign({}, liveo, { url:sample[6] }), 6);
	pc2.save(Object.assign({}, liveo, { url:sample[6] }), 7);

	pc1.merge(pc2);
	assert(pc1.resultsArray.length, 8, "Have right size data afterwards step 0" );
	for(let i in pc1.resultsArray) {
		assert(pc1.resultsArray[i].desc, liveo.desc, "step #1 - "+i );
		assert(pc1.resultsArray[i].title, liveo.title, "step #2 - "+i );
	}
	});

	// larger data that won't fit in a single 'page'	
  it("go 7.1: merge {cross batch boundary}", () => {
    const pc1 = new PageCollection(makeTestData( 24));
	let sample=pc1.currentBatch;
	let deaded={
		url: "mumbles",
		desc: "HTTP_ERROR, sfs Timeout",
		title: "HTTP_ERROR, sfs Timeout",
		auth: "me",
		date: 1343565678,
				};
	let liveo={ 
		url: "mumbles",
		desc: "dfsdfs fsf sdfsf sdf sdfs sdf sdf",
		title: "sdfs dfs sdfsdf sdfs fsdf sfs f sf",
		auth: "me",
		date: 1343565678,	
			};
	pc1.save(Object.assign({}, deaded, { url:sample[0] }), 0);
	pc1.save(Object.assign({}, deaded, { url:sample[1] }), 1);
	pc1.save(Object.assign({}, liveo, { url:sample[2] }), 2);
	pc1.save(Object.assign({}, deaded, { url:sample[3] }), 3);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 4);
	pc1.save(Object.assign({}, liveo, { url:sample[5] }), 5);
	pc1.save(Object.assign({}, deaded, { url:sample[6] }), 6);
	pc1.save(Object.assign({}, deaded, { url:sample[6] }), 7);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 8);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 9);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 10);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 11);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 12);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 13);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 14);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 15);
	pc1.save(Object.assign({}, deaded, { url:sample[6] }), 16);
	pc1.save(Object.assign({}, deaded, { url:sample[6] }), 17);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 18);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 19);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 20);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 21);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 22);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 23);

	const pc2 = new PageCollection(makeTestData( 24));
	pc2.save(Object.assign({}, liveo, { url:sample[0] }), 0);
	pc2.save(Object.assign({}, liveo, { url:sample[1] }), 1);
	pc2.save(Object.assign({}, liveo, { url:sample[2] }), 2);
	pc2.save(Object.assign({}, liveo, { url:sample[3] }), 3);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 4);
	pc2.save(Object.assign({}, liveo, { url:sample[5] }), 5);
	pc2.save(Object.assign({}, liveo, { url:sample[6] }), 6);
	pc2.save(Object.assign({}, liveo, { url:sample[6] }), 7);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 8);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 9);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 10);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 11);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 12);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 13);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 14);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 15);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 16);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 17);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 18);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 19);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 20);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 21);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 22);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 23);

	assert(pc1.resultsArray.length, 16, "Have right size data afterwards step #0" );
	pc1.merge(pc2);
	assert(pc1.resultsArray.length, 16, "Have right size data afterwards step #1" );
	for(let i in pc1.resultsArray) {
		assert(pc1.resultsArray[i].desc, liveo.desc, "step #2 - "+i );
		assert(pc1.resultsArray[i].title, liveo.title, "step #3 - "+i );
	}

	});

	it("go 7.1: merge {cross batch boundary}", () => {
    const pc1 = new PageCollection(makeTestData( 24));
	let sample=pc1.currentBatch;
	let deaded={
		url: "mumbles",
		desc: "HTTP_ERROR, sfs Timeout",
		title: "HTTP_ERROR, sfs Timeout",
		auth: "me",
		date: 1343565678,
				};
	let liveo={ 
		url: "mumbles",
		desc: "dfsdfs fsf sdfsf sdf sdfs sdf sdf",
		title: "sdfs dfs sdfsdf sdfs fsdf sfs f sf",
		auth: "me",
		date: 1343565678,	
			};
	pc1.save(Object.assign({}, deaded, { url:sample[0] }), 0);
	pc1.save(Object.assign({}, deaded, { url:sample[1] }), 1);
	pc1.save(Object.assign({}, liveo, { url:sample[2] }), 2);
	pc1.save(Object.assign({}, deaded, { url:sample[3] }), 3);
	pc1.save(Object.assign({}, liveo, { url:sample[4] }), 4);
	pc1.save(Object.assign({}, liveo, { url:sample[5] }), 5);
	pc1.save(Object.assign({}, deaded, { url:sample[6] }), 6);

	const pc2 = new PageCollection(makeTestData( 24));
	pc2.save(Object.assign({}, liveo, { url:sample[0] }), 0);
	pc2.save(Object.assign({}, liveo, { url:sample[1] }), 1);
	pc2.save(Object.assign({}, liveo, { url:sample[2] }), 2);
	pc2.save(Object.assign({}, liveo, { url:sample[3] }), 3);
	pc2.save(Object.assign({}, liveo, { url:sample[4] }), 4);
	pc2.save(Object.assign({}, liveo, { url:sample[5] }), 5);
	pc2.save(Object.assign({}, liveo, { url:sample[6] }), 6);

	assert(pc1.resultsArray.length, 8, "Have right size data afterwards step #0" );
	expect( ()=>pc1.merge(pc2) ).toThrowError( new Error("Cannot merge partially completed data ") ); 
	assert(pc1.resultsArray.length, 8, "Have right size data afterwards step #0" );

	});
	
});


function makeTestData(sz = 100, start = 0) {
  let dat = [];
  for (let i = start; i < sz; i++) {
    dat.push("https://site.tld/page" + i);
  }
  return dat;
}


