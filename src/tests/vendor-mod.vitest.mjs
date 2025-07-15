import { assert, describe, it } from "vitest";

import { TEST_ONLY } from "../references/vendor-mod";
const {
  apply_vendors,
  mod_parli,
  mod_codepen,
  mod_wikipedia,
  mod_mongodb,
  mod_caniuse,
  mod_graphQL,
  mod_react,
  mod_GDN,
  mod_stackoverflow,
  mod_github,
  mod_medium,
  mod_scribe,
  mod_npmjs,
} = TEST_ONLY;

describe("TEST references vendor-mod", () => {
  it("go 1: compile Regex filter, here only", async () => {
    const blob1 = await import("../references/vendor-mod");
    const blob2 = blob1.TEST_ONLY;

    for (let j in blob2) {
      if (j == "apply_vendors") {
        continue;
      }
      const fake1Body = `
<html>
<head>
<title>SDFSFS</title>
</head>
<body>
<h1>SDFSDF</h1>
</body>
</html>
`;
      let item2 = {};
      const item1 = {
        url: "https://localhost:6661/report-back-now",
        desc: "",
        title: "",
        auth: "",
        date: 0,
      };

      item2 = blob2[j](item1, "");
      if (j == "mod_medium" || j == "mod_scribe") {
        console.log("Need to add a better test for mod-medium");
      } else {
        assert.notDeepEqual(item1, item2, "[" + j + "] step 1");
      }

      item2 = blob2[j](item1, fake1Body);
      if (j == "mod_medium" || j == "mod_scribe") {
        console.log("Need to add a better test for mod-medium");
      } else {
        assert.notDeepEqual(item1, item2, "[" + j + "] step 2");
      }
    }
  });

  it("go 2: apply_vendors ", () => {
    const item1 = {
      url: "https://localhost:6661/report-back-now",
      desc: "",
      title: "",
      auth: "",
      date: 0,
    };
    const body1 = `

`;
    let item2 = {};

    item2 = apply_vendors(item1, body1);
    assert.equal(item1, item2, "step 4");
  });
});
