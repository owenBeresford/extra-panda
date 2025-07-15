import { assert, expect, describe, it } from "vitest";

import { PageCollection } from "../references/page-collection";
import { BATCH_SZ } from '../references/constants';

// no test for promiseExits, assignClose, resultsArray 
describe("TEST references PageCollection ",  () => {
	it("go 1: currentBatch ", () => {
		const pc=new PageCollection( makeTestData(100) );
		assert.deepEqual( makeTestData(BATCH_SZ, 0), pc.currentBatch, "batch at #0" );
		assert.deepEqual( makeTestData(BATCH_SZ, 0), pc.currentBatch, "[1] batch at #0 " );
		assert.deepEqual( makeTestData(BATCH_SZ, 0), pc.currentBatch, "[2] batch at #0" );
		pc.offset( BATCH_SZ -1);
		assert.deepEqual( makeTestData(2*BATCH_SZ, BATCH_SZ), pc.currentBatch, "batch at #1" );
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		pc.offset( BATCH_SZ -1);
		assert.deepEqual( makeTestData(14*BATCH_SZ, BATCH_SZ*13), pc.currentBatch, "batch at #13" );
		pc.offset( BATCH_SZ -1);
		assert.deepEqual( makeTestData(14*BATCH_SZ+2, BATCH_SZ*14), pc.currentBatch, "batch at #14" );
		pc.offset( BATCH_SZ -1);

	});

	it("go 2: save ", () => {
		const pc=new PageCollection( makeTestData(4) );
		let item={
				url: "https://site.tld/page4",
				desc: "TEST DATE: I have no idea",
				title: "TEST DATE: I have no idea",
				auth: "me",
				date: 0
				  };
		pc.save(item, 3);
		assert.deepEqual(pc.resultsArray, [false, false, false, item ], "item was saved, and can be seen" );
		try {
			pc.save(item, 5);
		} catch(e) {
			assert.equal(1, 1, "Expected exception seen");
		}

        expect( ()=> pc.save(item, 10) ).toThrowError( new Error("Why overwrite slot 10") );
		pc.save(item, 2); 
        expect( ()=> pc.save(item, 2) ).toThrowError( new Error("Why overwrite slot 2") );
     
		let item2=Object.assign({}, item, {url:''});
        expect( ()=> pc.save(item2, 1) ).toThrowError( new Error("Why does the incomming data have no URL? 1") );	
	});

	it("go 3: offset ", () => {	
		const pc=new PageCollection( makeTestData(100) );
		
		assert.equal(0, pc.offset( 0), "should be 0" );
		assert.equal(1, pc.offset( 1), "should be 1" );
		assert.equal(2, pc.offset( 2), "should be 2" );
		assert.equal(3, pc.offset( 3), "should be 3" );
		assert.equal(4, pc.offset( 4), "should be 4" );
		assert.equal(5, pc.offset( 5), "should be 5" );
		assert.equal(6, pc.offset( 6), "should be 6" );
		assert.equal(7, pc.offset( 0), "should be 7" );

		assert.equal(8, pc.offset( 1), "should be 8" );
		assert.equal(9, pc.offset( 2), "should be 9" );
		assert.equal(10, pc.offset( 3), "should be 10" );		
	});
	
	it("go 4: morePages ", () => {	
		const pc=new PageCollection( makeTestData(100) );
		assert.equal(true, pc.morePages(0), "step0" );
		assert.equal(true, pc.morePages(5), "step1" );
		assert.equal(true, pc.morePages(15), "step2" );
		assert.equal(true, pc.morePages(99), "step3" );
		assert.equal(false, pc.morePages(100), "step4" );
		assert.equal(false, pc.morePages(101), "step5" );
//		assert.equal(false, pc.morePages(-1), "step6" );
	});

	it("go 5: mapRepeatDomain ", () => {	
		const pc=new PageCollection( makeTestData(100) );
//  public mapRepeatDomain(url: string, cur: number): boolean 
		pc.save({ url: "https://site.tld/page0", desc: "sdfs sfsfsf sf s", title: "sdf sfs fsdf sf", auth: "me", date: 0 }, 0);
		pc.save({ url: "https://site.tld/page1", desc: "sdfs sfsfsf sf s", title: "sdf sfs fsdf sf", auth: "me", date: 0 }, 1);
		pc.save({ url: "https://site.tld/page2", desc: "sdfs sfsfsf sf s", title: "sdf sfs fsdf sf", auth: "me", date: 0 }, 2);
// add resultsArray checking
		assert.equal(true, pc.mapRepeatDomain("https://site.tld/page1", 3), "step1" );
		assert.equal(true, pc.mapRepeatDomain("https://site.tld/page1#werwer", 4), "step2" );
		assert.equal(true, pc.mapRepeatDomain("https://site.tld/page1?wer=dfg^fdh=dret", 5), "step3" );
		assert.equal(false, pc.mapRepeatDomain("https://fourth.url/", 6), "step4" );

	});

});

function makeTestData(sz=100, start=0) {
	let dat=[];
	for(let i=start; i<sz; i++) {
		dat.push( "https://site.tld/page"+i );	
	}
	return dat;
}


