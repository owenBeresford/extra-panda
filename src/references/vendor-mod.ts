import type { Reference, VendorRecord, VendorModCB, ModSymbol } from "./types";
import { normaliseString } from "./string-manip";

function mod_npmjs(item: Reference, body: string): Reference {
  let tt = item.url.substr(item.url.lastIndexOf("/") + 1);
  item.desc = "Package to install " + tt;
  item.title = "Package to install " + tt;

  let hit = body.match(
    new RegExp('aria-labelledby="collaborators".*<a href="/~([^"]+)', "im"),
  );
  if (hit && hit.length) {
    item.auth = normaliseString(hit[1]);
  } else {
    item.auth = "cant extract from NPMjs";
  }
  return item;
}

function mod_scribe(item: Reference, body: string): Reference {
  let hit = body.match(
    new RegExp('<p class="meta">[ \\t\\n]*<a[^>]*>([A-Za-z 0-9\']+)</a>', "im"),
  );
  if (hit && hit.length) {
    item.auth = normaliseString(hit[1]);
  } else {
    item.auth = "cant extract from medium";
  }

  hit = body.match(new RegExp('<p class="meta">.*([-0-9]+).*</p>', "im"));
  if (hit && hit.length) {
    item.date = new Date(hit[1]).getTime() / 1000;
  } else {
    item.auth = "cant extract from medium";
  }
  return item;
}

function mod_medium(item: Reference, body: string): Reference {
  let hit = body.match(
    new RegExp(
      "<h2 class=\"pw-author-name[^>]*>[ \\t\\n]*<span[^>]*>([A-Za-z 0-9']+)</span>",
      "im",
    ),
  );
  if (hit && hit.length) {
    item.auth = normaliseString(hit[1]);
  } else {
    item.auth = "cant extract from medium";
  }

  hit = body.match(
    new RegExp(
      '<p class="pw-published-date[^>]*>[ \\t\\n]*<span[^>]*>([A-Za-z 0-9,]+)</span>',
      "im",
    ),
  );
  if (hit && hit.length) {
    item.date = new Date(hit[1]).getTime() / 1000;
  } else {
    item.auth = "cant extract from medium";
  }
  return item;
}

function mod_github(item: Reference, body?: string): Reference {
  //	https://github.com/node-ffi-napi/node-ffi-napi
  let tt1 = item.url.split("/");
  item.auth = tt1[3];
  return item;
}

function mod_stackoverflow(item: Reference, body?: string): Reference {
  item.auth = "No author for Q&A sites";
  return item;
}

function mod_MDN(item: Reference, body?: string): Reference {
  item.auth = "MDN contribuitors";
  return item;
}

function mod_GDN(item: Reference, body?: string): Reference {
  item.auth = "Google inc";
  return item;
}

function mod_react(item: Reference, body?: string): Reference {
  item.auth = "Meta platforms inc";
  return item;
}

function mod_graphQL(item: Reference, body?: string): Reference {
  item.auth = "The GraphQL Foundation";
  return item;
}

function mod_caniuse(item: Reference, body?: string): Reference {
  item.auth = "Alexis Deveria @Fyrd";
  return item;
}

function mod_mongodb(item: Reference, body?: string): Reference {
  item.auth = "MongoDB inc";
  return item;
}

function mod_wikipedia(item: Reference, body?: string): Reference {
  item.auth = "Wikipedia contributors";
  return item;
}

function mod_codepen(item: Reference, body?: string): Reference {
  let tt1 = item.url.split("/");
  // https://codepen.io/nobitagit/pen/AJXmgz
  item.auth = tt1[3];
  return item;
}

function mod_parli(item: Reference, body?: string): Reference {
  item.auth = "part of the UKG";
  item.desc = "I am prohibited from checking URLs on this website";
  item.title = "I am prohibited from checking URLs on this website";
  return item;
}

const _f1 = function (
  name: string,
  target: ModSymbol,
  CB: VendorModCB,
): VendorRecord {
  return { name, target, callback: CB } as VendorRecord;
};

// function to apply the specific website hacks
export function apply_vendors(item: Reference, body: string): Reference {
  const VENDORS: Readonly<Array<VendorRecord>> = [
    _f1("npmjs", "title", mod_npmjs),
    _f1("medium", "auth", mod_medium),
    _f1("scribe.rip", "auth", mod_scribe),
    _f1("github", "auth", mod_github),
    _f1("stackoverflow", "auth", mod_stackoverflow),
    _f1("wikipedia", "auth", mod_wikipedia),
    _f1("developer.mozilla.org", "auth", mod_MDN),
    _f1("reactjs.org", "auth", mod_react),
    _f1("graphql.org", "auth", mod_graphQL),
    _f1("developers.google.com", "auth", mod_GDN),
    _f1("caniuse.com", "auth", mod_caniuse),
    _f1("mongodb.com", "auth", mod_mongodb),
    _f1("codepen.io", "auth", mod_codepen),
    _f1("parliament.uk", "auth", mod_parli),
  ] as const;
  const VENDORS_LENGTH = VENDORS.length;

  for (let i = 0; i < VENDORS_LENGTH; i++) {
    if (
      item.url.includes(VENDORS[i].name) &&
      (item[ VENDORS[i].target ] ||
        (VENDORS[i].target && item[VENDORS[i].target] === "unknown"))
    ) {
      item = VENDORS[i].callback(item, body);
console.log("mod "+VENDORS[i].name+" "+i+" ", item );      

    }
  }
  return item;
}

export const TEST_ONLY ={ apply_vendors, mod_parli, mod_codepen, mod_wikipedia,
     mod_mongodb, mod_caniuse, mod_graphQL, mod_react, mod_GDN, mod_stackoverflow,
     mod_github, mod_medium, mod_scribe, mod_npmjs }; 
     