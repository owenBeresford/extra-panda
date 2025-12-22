import { expect, describe, it, run } from "jest-lite";

import { execTest, wrap } from "./page-seed-playwright";
import { delay } from "../networking";
import { TEST_MACHINE } from "../immutables";
// import { log, domLog } from "../log-services";
import { getCSSAttr } from "./vitest-addons";

describe("TEST BROWSER CSS based tabs", () => {
  if (typeof process !== "undefined") {
    throw new Error("This is a browser only test");
  }
  const DEEP_BLUE = "rgb(0, 73, 135)";
  const PALE_BLUE = "rgb(185, 222, 250)";
  const PALE_BLUE2 = "rgb(215, 242, 250)"; // used for product-engineer portfolio

  it("go 1: default first state", async () => {
    const TEST_NAME = "BROWSER TEST func[1] default first state ";
    return await wrap(
      TEST_NAME,
      "/home.html?debug=1",
      async (dom, loc, win) => {
        expect(
          getCSSAttr(
            '.tab2Container:has( input[value="1"]:checked ) .tabContent[data-id="1"]',
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            '.tab2Container .tabContent[data-id="2"]',
            "display",
            dom,
            win,
          ),
        ).toBe("none");

        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="1"]:checked )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(PALE_BLUE);
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="2"] )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(DEEP_BLUE);

        // const scrollTop =   dom.documentElement.scrollTop || dom.body.scrollTop || 0;
        const TARGET = dom.querySelector("#projects");
        const EVT1 = new MouseEvent("click", {
          view: win,
          bubbles: true,
          cancelable: true,
          //			clientX: TARGET.getClientRects().left + 16,
          //			clientY: TARGET.getClientRects().top + scrollTop + 16,
        });

        // this handler is supposed to be sync
        expect(TARGET.dispatchEvent(EVT1)).toBe(true);

        expect(
          getCSSAttr(
            '.tab2Container:has( input[value="2"] ) .tabContent[data-id="2"]',
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            '.tab2Container .tabContent[data-id="1"] ',
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="2"]:checked )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(PALE_BLUE);
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="1"] )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(DEEP_BLUE);

        await delay(100);
      },
    );
  });

  it("go 2: initTabs + mouse events", async () => {
    const TEST_NAME = "BROWSER TEST func[1] setInitState ";
    return await wrap(
      TEST_NAME,
      "/home.html#projects",
      async (dom, loc, win) => {
        expect(
          getCSSAttr(
            '.tab2Container:has( input[value="2"]:checked ) .tabContent[data-id="2"] ',
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            '.tab2Container .tabContent[data-id="1"] ',
            "display",
            dom,
            win,
          ),
        ).toBe("none");

        // this line is a poor test, but I don't have the colour libs imported here
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="2"]:checked )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(PALE_BLUE);
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="1"] )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(DEEP_BLUE);

        //		const scrollTop = dom.documentElement.scrollTop || dom.body.scrollTop || 0;
        const TARGET = dom.querySelector(
          ".tab2Container label:has( #articles )",
        );
        const EVT1 = new MouseEvent("click", {
          view: win,
          bubbles: true,
          cancelable: true,
          //			clientX: TARGET.getClientRects().left + 16,
          //			clientY: TARGET.getClientRects().top + scrollTop + 16,
        });

        // this handler is supposed to be sync
        expect(TARGET.dispatchEvent(EVT1)).toBe(true);
        await delay(1000);

        expect(
          getCSSAttr(
            '.tab2Container:has( input[value="1"]:checked ) .tabContent[data-id="1"]',
            "display",
            dom,
            win,
          ),
        ).toBe("inline-block");
        expect(
          getCSSAttr(
            '.tab2Container .tabContent[data-id="2"]',
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="1"]:checked )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(PALE_BLUE);
        expect(
          getCSSAttr(
            '.tab2Container .tabHeader label:has( input[value="2"] )',
            "background-color",
            dom,
            win,
          ),
        ).toBe(DEEP_BLUE);

        expect(getCSSAttr("#panelProjects", "display", dom, win)).toBe("none");
        expect(getCSSAttr("#panelArticles", "display", dom, win)).toBe(
          "inline-block",
        );

        await delay(100);
      },
    );
  });

  // ********  I think this is barred for security reasons  **********
  // I am writing tests to check accessability from a keyboard,
  //    ...but the same code could automate logins for illegal goals
  // the kent dodds library should work as planC
  // I am ignoring the option to fake the entire event stream ie symbol down -> up -> next symbol down....
  // https://testing-library.com/docs/user-event/keyboard/
  // https://stackoverflow.com/questions/66404791/simulating-keyboard-events-with-javascript
  // https://stackoverflow.com/questions/596481/is-it-possible-to-simulate-key-press-events-programmatically
  it("go 3: keys", async (ctx) => {
    const TEST_NAME = "BROWSER TEST func[1] checking keyboard input DEFECTIVE ";
    return await wrap(TEST_NAME, "/tab2.html", async (dom, loc, win) => {
      let rootNode = ".portfolioContainer";
      expect(
        getCSSAttr(
          rootNode +
            ':has( input[value="employ"]:checked ) .tabContent#panelEmploy *',
          "display",
          dom,
          win,
        ),
      ).toBe("block");
      expect(
        getCSSAttr(rootNode + " .tabContent#panelOpen *", "display", dom, win),
      ).toBe("none");

      expect(
        getCSSAttr(
          rootNode + ' .tabHeader label:has( input[value="employ"]:checked )',
          "background-color",
          dom,
          win,
        ),
      ).toBe(PALE_BLUE2);
      expect(
        getCSSAttr(
          rootNode + ' .tabHeader label:has( input[value="open"] )',
          "background-color",
          dom,
          win,
        ),
      ).toBe(DEEP_BLUE);
      expect(
        getCSSAttr(
          rootNode + ' .tabHeader label:has( input[value="personal"] )',
          "background-color",
          dom,
          win,
        ),
      ).toBe(DEEP_BLUE);

      const TAB = new KeyboardEvent("keypress", {
        key: "Tab",
        code: "Tab",
        keyCode: 9,
        which: 9,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
      });
      const SPACE = new KeyboardEvent("keypress", {
        key: "Space",
        code: "Space",
        keyCode: 32,
        which: 32,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
      });
      dom.dispatchEvent(TAB);
      dom.dispatchEvent(TAB);
      dom.dispatchEvent(TAB);
      dom
        .querySelector(
          rootNode + ' .tabHeader label:has( input[value="open"] )',
        )
        .dispatchEvent(SPACE);
      // no change observed in the DOM.
      ctx.skip("Test not impl yet, pls see comments");
      /*
// to create test tab * N, + space => change tab
        expect(
          getCSSAttr(
            rootNode+' .tabContent#panelEmploy *',
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        expect(
          getCSSAttr(
            rootNode+':has( input[value="open"]:checked ) .tabContent#panelOpen *',
            "display",
            dom,
            win,
          ),
        ).toBe("block");
 		const RIGHT= new KeyboardEvent("keydown", {
			key: "ArrowRight", 
			code: "ArrowRight", 
			keyCode: 39, 
			which: 39, 
		    shiftKey: false,
		    ctrlKey: false,  
		    metaKey: false  
		  });

		dom.dispatchEvent( RIGHT);
		dom.dispatchEvent( SPACE);
//  arrow key + space => change tab
        expect(
          getCSSAttr(
            rootNode+' .tabContent#panelOpen *',
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        expect(
          getCSSAttr(
            rootNode+':has( input[value="personal"]:checked ) .tabContent#panelPersonal *',
            "display",
            dom,
            win,
          ),
        ).toBe("block");
 
		dom.dispatchEvent( SPACE);
// space (again) => no change tab
        expect(
          getCSSAttr(
            rootNode+' .tabContent#panelOpen *',
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        expect(
          getCSSAttr(
            rootNode+':has( input[value="personal"]:checked ) .tabContent#panelPersonal *',
            "display",
            dom,
            win,
          ),
        ).toBe("block");

  		const LEFT= new KeyboardEvent("keydown", {
			key: "ArrowLeft", 
			code: "ArrowLeft", 
			keyCode: 37, 
			which: 37, 
		    shiftKey: false,
		    ctrlKey: false,  
		    metaKey: false  
		  });
		dom.dispatchEvent( LEFT );
		dom.dispatchEvent( SPACE );
//  arrow key + space => change tab
        expect(
          getCSSAttr(
            rootNode+' .tabContent#panelPersonal *',
            "display",
            dom,
            win,
          ),
        ).toBe("none");
        expect(
          getCSSAttr(
            rootNode+':has( input[value="employ"]:checked ) .tabContent#panelEmploy *',
            "display",
            dom,
            win,
          ),
        ).toBe("block");
*/
      await delay(100);
    });
  });
});

execTest(run);
