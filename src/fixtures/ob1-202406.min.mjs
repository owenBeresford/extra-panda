function e(e2, t2 = "debug") {
  return new URLSearchParams(e2.search).has(t2);
}
let t = console;
function n(e2, ...n2) {
  t.LOG_USAGE++, e2 in console ? t[e2](`[${e2.toUpperCase()}] ${n2.join(", ")}`) : t.log(`[${e2.toUpperCase()}] ${n2.join(", ")}`);
}
const r = "1.0.4", o = "https://owenberesford.me.uk/", a = ".addReferences", i = a + " sup a", s = "appearance", l = 16, c = "showBiblioErrors", u = 180;
class d {
  set(e2, t2, n2) {
    let r2 = "";
    if (n2) {
      const e3 = /* @__PURE__ */ new Date();
      e3.setTime(e3.getTime() + 24 * n2 * 60 * 60 * 1e3), r2 = "expires=" + e3.toUTCString();
    }
    document.cookie = e2 + "=" + t2 + "; " + r2 + "; path=/ ;secure";
  }
  get(e2) {
    const t2 = e2 + "=", n2 = decodeURIComponent(document.cookie).split("; ");
    let r2 = "";
    return n2.forEach((e3) => {
      0 === e3.indexOf(t2) && (r2 = e3.substring(t2.length));
    }), r2;
  }
  wipe(e2) {
    const t2 = /* @__PURE__ */ new Date();
    t2.setTime(t2.getTime() + 288e5);
    const n2 = "expires=" + t2.toUTCString();
    document.cookie = e2 + "= ; " + n2 + "; path=/ ;secure", document.cookie = e2 + "= ; " + n2 + "; path=/ ";
  }
}
function f(e2, t2, n2, r2) {
  const o2 = p();
  e2 = e2.replaceAll(";", "%38"), r2 = r2.replaceAll(";", "%38"), n2 = n2.replaceAll(";", "%38"), t2 = t2.replaceAll(";", "%38");
  const a2 = JSON.stringify({ ft: e2, fs: t2, dn: n2, cr: r2 });
  o2.set(s, a2, 365.254);
}
async function h(t2, r2, o2) {
  const a2 = function() {
    if ("undefined" != typeof window)
      return window.fetch;
    if ("function" == typeof fetch)
      return fetch;
    throw n("error", "Please stop using old versions of node."), new Error("Please stop using old versions of Node");
  }(), i2 = e(o2);
  try {
    const e2 = await a2(t2, { credentials: "same-origin" });
    if (!e2.ok) {
      if (i2 && n("warn", "Failed to communicate with " + t2), r2)
        return { body: "nothing", headers: {}, ok: false };
      throw new Error("ERROR getting asset " + t2);
    }
    if (404 === e2.status)
      throw new Error("got HTTP 404");
    let o3 = "";
    return o3 = e2.headers.get("content-type").toLowerCase().startsWith("application/json") ? await e2.json() : await e2.text(), i2 && n("info", "Successful JSON transaction " + t2), { body: o3, headers: e2.headers, ok: true };
  } catch (e2) {
    if (i2 && n("error", "KLAXON, KLAXON failed: " + t2 + " " + e2.toString()), r2)
      return { body: "nothing", headers: {}, ok: false };
    throw new Error("ERROR getting asset " + t2 + " " + e2.toString());
  }
}
function p() {
  return "undefined" != typeof document ? new d() : { set(e2, t2, n2) {
  }, get: (e2) => "" };
}
function g(e2) {
  if (e2) {
    if ("textContent" in e2)
      return e2.textContent;
    if ("innerText" in e2)
      return e2.innerText;
    throw new Error("No text found");
  }
  throw new Error("No element for text found");
}
function m(e2) {
  return e2.pathname.split("/").pop() || "<name>";
}
function y(e2, t2) {
  let n2 = [];
  return n2 = t2.pathname.split("/"), (!n2 || n2.length < 2) && (n2 = ["resource", "home"]), e2.replace(/XXX/, n2.pop());
}
function b(e2) {
  return !(!e2.startsWith("192.168.") && "127.0.0.1" !== e2 && "::1" !== e2 && "0:0:0:0:0:0:0:1" !== e2 && "localhost" !== e2);
}
function w(e2, t2 = 80, n2 = "↩") {
  if (!e2 || e2.length < t2)
    return "" + e2;
  let r2 = 0, o2 = [];
  for (; r2 <= e2.length; )
    r2 + t2 > e2.length ? o2.push(e2.substring(r2, r2 + t2)) : o2.push(e2.substring(r2, r2 + t2) + n2), r2 += t2;
  return o2.join("\n");
}
function A(e2) {
  const t2 = /^[0-9]{1,3}$/;
  return Array.from(e2.matchAll(/[^ \t\n\r.(),~]+/g)).filter((e3) => !("" === e3[0] || e3[0].match(t2))).length;
}
function S(e2) {
  let t2 = String(e2);
  if (0 === e2 || e2 < 1)
    throw new Error("Value passed must be a counting number above 0");
  return 1 === t2.length && (t2 = "0" + t2), t2;
}
function L(e2) {
  if (["1", 1, "true", "TRUE", "on", "ON", "yes", "YES", "✔", "✓"].includes(e2))
    return true;
  if (["0", 0, "false", "FALSE", "off", "OFF", "no", "NO", "🗙", "✕", "✖", "✖", "✗", "✘"].includes(e2))
    return false;
  throw new Error("Unknown data " + e2);
}
function R(e2, t2, n2 = true) {
  let r2 = "";
  if (r2 = Number(e2) === e2 && e2 % 1 == 0 ? 0 === e2 ? "[No date]" : e2 < 1e10 ? new Date(1e3 * e2) : new Date(e2) : t2, "string" != typeof r2) {
    const e3 = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let t3;
    t3 = r2.getHours() ? S(r2.getHours()) : "00", r2 = " " + S(r2.getDate()) + "-" + (n2 ? e3[r2.getMonth() + 1] : S(r2.getMonth() + 1)) + "-" + r2.getUTCFullYear() + " " + (n2 ? "" : t3 + ":00");
  }
  return r2;
}
function E(e2, t2, r2) {
  try {
    if (null === r2)
      throw new Error("Oh no! No DOM object!!");
    const n2 = r2.createElement("template");
    if (n2.innerHTML = t2, "string" == typeof e2) {
      const t3 = r2.querySelector(e2);
      if (null === t3)
        throw new Error("Oh no! DOM element not found: " + e2);
      return t3.append(n2.content);
    }
    return e2.append(n2.content);
  } catch (e3) {
    n("error", e3.toString());
  }
}
function k(e2) {
  if (void 0 === e2)
    return false;
  const t2 = e2.getComputedStyle.toString().includes("[native code]");
  return !("boolean" != typeof t2 || !t2);
}
function v(e2, t2, r2) {
  try {
    if (!k(r2))
      return -1;
    return e2.getBoundingClientRect()[t2];
  } catch (e3) {
    return n("error", "Missing data:" + e3.message), -1;
  }
}
function T(e2, t2) {
  const n2 = e2.getBoundingClientRect();
  return [Math.round(t2.scrollY + n2.top), Math.round(t2.scrollX + n2.left)];
}
async function q(e2, t2, r2) {
  try {
    if (!r2.navigator.clipboard)
      throw new Error("No clipboard available");
    await r2.navigator.clipboard.writeText(t2.href);
  } catch (e3) {
    n("error", "FAILED: copy URL feature borked " + e3.message + "\nIt will fail on a HTTP site.");
  }
}
function x(e2 = 1040, t2, n2, r2) {
  if (t2.querySelector(".maquetteContainer") && function(e3, t3) {
    const n3 = new URLSearchParams(e3.search);
    if (n3.has("width"))
      return parseInt(n3.get("width"), 10);
    return t3.innerWidth;
  }(n2, r2) > e2) {
    const e3 = Array.from(t2.querySelectorAll(".maquetteContainer details"));
    for (let t3 = 0; t3 < e3.length; t3++)
      e3[t3].classList.contains("singlePopup") || e3[t3].classList.contains("screenDocs") || (e3[t3].open = true);
  }
}
function C(e2, t2, n2) {
  const r2 = new URLSearchParams(t2.search);
  try {
    e2.createEvent("TouchEvent");
    return r2.has("mobile") ? L(r2.get("mobile")) : X(e2, n2) > u;
  } catch (e3) {
    return !(!r2.has("mobile") || !L(r2.get("mobile")));
  }
}
function X(e2, t2) {
  try {
    const n2 = e2.createElement("div");
    n2.setAttribute("style", "width:1in;"), e2.body.appendChild(n2);
    const r2 = n2.offsetWidth * t2.devicePixelRatio;
    return n2.remove(), r2;
  } catch (e3) {
    return n("error", "ERROR " + e3.toString()), -1;
  }
}
function N(e2, t2) {
  const n2 = e2.documentElement, r2 = e2.body, o2 = t2.innerWidth || n2.clientWidth || r2.clientWidth, a2 = t2.innerHeight || n2.clientHeight || r2.clientHeight;
  let i2 = 0, s2 = 0;
  return s2 = "string" == typeof a2 ? parseInt(a2, 10) : a2, i2 = "string" == typeof o2 ? parseInt(o2, 10) : o2, [i2, s2];
}
let O = { name: "", meta: "", perRow: 10, titleLimit: 40, rendered: false, iteration: 0, group: "system", count: 1, debug: true, runFetch: h };
function M(e2, t2, n2) {
  let r2 = "", o2 = n2.pathname.split("/").pop();
  const a2 = new URLSearchParams(n2.search);
  return "group-XXX" === o2 && a2.has("first") && (o2 = a2.get("first")), t2 ? a2.has("first") ? r2 += n2.pathname.replace("group-XXX", o2 + "-meta") : r2 += n2.pathname.replace(o2, e2 + "-meta") : r2 += n2.pathname.replace(o2, e2), r2 += n2.search + n2.hash, r2;
}
function U(e2, t2) {
  let n2 = "button";
  return e2 && (n2 += " lower"), n2;
}
function j(e2, t2) {
  return t2 + "" + e2.replace(/[^a-zA-Z0-9_]/g, "_");
}
function F(e2) {
  return e2.split("/").pop();
}
function P(e2) {
  let t2 = O.group;
  if ("XXX" === O.group) {
    const n2 = new URLSearchParams(e2.search);
    n2.has("first") && (t2 = n2.get("first"));
  }
  if ("XXX" === t2)
    throw new Error("Thou shalt supply the group somewhere");
  return t2;
}
function D(e2, t2, n2, r2, o2) {
  return O.name === "group-" + O.group || (t2 === e2 && (o2 = r2), r2 > 0 && o2 > 0 && n2 > 0 && r2 >= n2 - 1 && (r2 = 0)), [o2, n2, r2];
}
async function I(t2, r2, o2, a2) {
  if (O = Object.assign(O, { name: m(o2), meta: M(O.group, ".json", o2), debug: e(o2), runFetch: h }, t2), "system" === O.group)
    throw new Error("Must set the article group, and not to 'system'.");
  O.meta = M(O.group, ".json", o2);
  const i2 = "group-XXX" === O.name || O.name === "group-" + O.group, s2 = "group" + O.group;
  if (C(r2, o2, a2) && !i2)
    1 === r2.querySelectorAll(".adjacentGroup .adjacentItem").length && (r2.querySelector(".adjacentGroup p").style.display = "none"), E("#" + s2, "<p>As mobile View, use the full page link to the left</p>", r2);
  else {
    const e2 = await O.runFetch(O.meta, false, o2);
    if (!e2.ok || !Array.isArray(e2.body))
      return n("info", "There doesn't seem to be a group meta data file."), void E("#" + s2, "<p>Internal error. Hopefully this will be fixed shortly. </p>", r2);
    if (i2) {
      const t3 = function(e3, t4, n2, r3, o3) {
        let a3 = "";
        for (const i3 in e3) {
          const s3 = j(i3, t4), l2 = C(n2, r3, o3) ? "<br />" : "";
          let c2 = e3[i3].desc;
          c2.length > 235 && (c2 = c2.substr(0, 235) + "..."), a3 += '<a class="adjacentItem" href="' + e3[i3].url + '" title="' + c2 + '">' + e3[i3].title + ' <span class="button">' + e3[i3].title + '</span><p id="adjacent' + s3 + '" >Author: ' + e3[i3].auth + " &nbsp; &nbsp; &nbsp;" + l2 + "  Last edit: " + R(e3[i3].date, "Unknown time", true) + " <br />Description: " + c2 + " </p></a>\n";
        }
        return a3;
      }(e2.body, s2, r2, o2, a2);
      E("#groupXXX", t3, r2), function(e3, t4) {
        const n2 = Array.from(t4.querySelectorAll(".top-bar.fullWidth header h1"));
        n2.length && (n2[0].textContent.includes("whatsmyname") || n2[0].textContent.includes("XXX")) && (n2[0].textContent = "Group " + e3);
        const r3 = Array.from(t4.querySelectorAll(".adjacentGroup p"));
        r3.length && r3[0].textContent.includes("XXX") && (r3[0].textContent = "Some similar articles in " + e3);
      }(P(o2), r2);
    } else {
      const t3 = function(e3) {
        let t4 = -1, n2 = O.perRow, r3 = [], o3 = 0, a3 = 0;
        for ([t4, n2, o3] = D(F(e3[0].url), O.name, e3.length, o3, t4); o3 < e3.length; o3++) {
          const i3 = e3[o3].title;
          if (i3 && t4 >= 0 && n2 > 0) {
            r3[a3] = { auth: e3[o3].auth, date: R(e3[o3].date, "[Unknown time]", true), url: e3[o3].url, offset: o3, title: e3[o3].title.substr(0, O.titleLimit), desc: e3[o3].desc }, i3.length > O.titleLimit && (r3[a3].title += "...");
            const t5 = e3[o3].desc;
            t5.length > 235 && (r3[a3].desc = t5.substr(0, 235) + "..."), n2--, a3++;
          }
          if ([t4, n2, o3] = D(F(e3[o3].url), O.name, n2, o3, t4), r3.length === e3.length)
            break;
          if (r3.length >= O.perRow)
            break;
        }
        return r3;
      }(e2.body);
      E("#" + s2, function(e3, t4) {
        let n2 = '<ul class="adjacentList">\n';
        for (const r3 in e3) {
          const o3 = j(r3, t4), a3 = U(e3[r3].desc.length > 110), i3 = "Title: " + e3[r3].title + "\nAuthor: " + e3[r3].auth + " &nbsp; &nbsp; Last edit: " + e3[r3].date + "\nDescription: " + e3[r3].desc;
          n2 += '<li> <a id="link' + o3 + '" class="' + a3 + '" href="' + e3[r3].url + '" aria-label="' + i3 + '" >' + e3[r3].title + "</a> </li>\n";
        }
        return 0 === e3.length ? n2 += "<li> Article doesn't seem setup correctly.</li></ul>" : n2 += '<li><a class="adjacentItem button" href="/resource/group-XXX?first=' + t4 + '" aria-label="This article lists all items in worklog group."> See full list </a></li></ul>', n2;
      }(t3, P(o2)), r2);
    }
  }
}
function H(e2, t2, n2, r2) {
  if (!b(n2.host) && !C(t2, n2, r2))
    return false;
  const o2 = t2.querySelector("#shareMenu");
  return o2 && !o2.classList.replace("shareMenuOpen", "shareMenu") && o2.classList.replace("shareMenu", "shareMenuOpen"), false;
}
function B(e2, t2, r2, o2) {
  const a2 = t2.querySelector("#mastodonserver");
  let i2 = a2.value;
  const s2 = a2.getAttribute("data-url");
  if ("" === i2 || null === i2)
    return false;
  if (i2 = "https://" + i2 + "/share?text=I+think+this+is+important+" + s2, n("info", "Trying to open mastodon server, " + i2), !k(o2))
    throw Error("Test passed, for " + i2);
  return t2.querySelector("#popup").close(), o2.open(i2, "_blank"), C(t2, r2, o2) && H(0, t2, r2, o2), false;
}
function W(e2, t2, n2) {
  let r2 = e2.querySelector("#navBar #mastoTrigger");
  if (!r2)
    return;
  if (J(r2, $, e2, n2), r2 = e2.querySelector("#shareGroup .allButtons #mastoTrigger"), r2) {
    const t3 = function(e3, t4 = "display", n3 = window) {
      let r3 = "";
      e3 && e3.computedStyleMap ? r3 = e3.computedStyleMap()[t4] : e3 && (r3 = n3.getComputedStyle(e3, null).getPropertyValue(t4));
      return r3;
    }(r2, "display", n2);
    t3 && "none" !== t3 && (r2.addEventListener("click", (t4) => $(t4, e2, n2)), r2.addEventListener("keypress", (t4) => $(t4, e2, n2)));
  }
  r2 = e2.querySelector("#copyURL"), r2 && function(e3, t3, n3, r3, o3) {
    e3.addEventListener("click", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("touch", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("keypress", async (e4) => (await t3(n3, r3, o3), false));
  }(r2, q, e2, t2, n2), _(e2.querySelector("#popup #sendMasto"), B, e2, t2, n2);
  const o2 = Array.from(e2.querySelectorAll("#shareMenuTrigger, #shareClose"));
  for (const r3 in o2)
    _(o2[r3], H, e2, t2, n2);
  J(e2.querySelector("#hideMasto"), G, e2, n2);
}
function $(e2, t2, n2) {
  return k(n2) && t2.querySelector("#popup").showModal(), t2.querySelector("#popup input").focus(), false;
}
function G(e2, t2, n2) {
  return k(n2) && t2.querySelector("#popup").close(), false;
}
function J(e2, t2, n2, r2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2), false));
}
function _(e2, t2, n2, r2, o2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2, o2), false));
}
let Y = { referencesCache: "/resource/XXX-references", gainingElement: "#biblio", losingElement: ".addReferences", renumber: 1, forceToEnd: 1, maxDescripLen: 230, maxAuthLen: 65, debug: true, runFetch: h };
async function K(t2, r2, i2) {
  if (Y = Object.assign(Y, { debug: e(i2) }, t2), 0 === r2.querySelectorAll(a).length)
    return void n("info", "URL '" + i2.pathname + "' isn't marked-up for references, so skipped");
  const s2 = r2.querySelector("#biblio");
  s2 && s2.setAttribute("style", ""), r2.querySelector(Y.gainingElement + " *").replaceChildren(), E(Y.gainingElement, '<h2 class="biblioSection">References (for mobile UI)</h2> \n<p>The references embedded in the text are displayed here. </p>', r2);
  const l2 = await Y.runFetch(y(Y.referencesCache, i2), false, i2);
  if (l2.ok && Array.isArray(l2.body)) {
    const e2 = function(e3) {
      let t3 = '<aside role="footnote"><ol class="mobileBiblio">';
      for (const n2 in e3)
        t3 += `<li>
<a href="${e3[n2].url}"> 
<h5>${e3[n2].title}</h5>
<span>${e3[n2].desc}</span>
<span>by ${e3[n2].auth} on ${e3[n2].date}</span>
</a>
</li>
`;
      return t3 += "</ol></aside>", t3;
    }(function(e3) {
      const t3 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n2 = [];
      for (const r3 in e3) {
        if (null === e3[r3]) {
          n2.push({ auth: "[No author]", date: "[No date]", desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", offset: parseInt(r3, 10), title: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", url: o });
          continue;
        }
        const a2 = R(e3[r3].date, t3[2], true);
        let i3 = e3[r3].title + "";
        i3 = i3.replace(".", ".  ");
        let s3 = e3[r3].desc + "";
        s3.length > Y.maxDescripLen && (s3 = s3.substring(0, Y.maxDescripLen));
        let l3 = e3[r3].auth || t3[0];
        "unknown" === e3[r3].auth && (l3 = t3[0]), l3.length > Y.maxAuthLen && (l3 = l3.substring(0, Y.maxAuthLen)), n2.push({ auth: l3, date: a2, desc: s3, offset: parseInt(r3, 10), title: i3, url: e3[r3].url });
      }
      return n2;
    }(l2.body));
    !function(e3, t3) {
      if (!Y.renumber)
        return;
      const n2 = Array.from(t3.querySelectorAll(Y.losingElement + " sup a"));
      for (let e4 = 0; e4 < n2.length; e4++)
        n2[e4].textContent = "" + (e4 + 1), Y.forceToEnd && (n2[e4].href = "#biblio");
    }(l2.body, r2), E(Y.gainingElement, e2, r2);
  } else {
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    E(Y.gainingElement, e2, r2), n("warn", "Unable to get meta data " + y(Y.referencesCache, i2), JSON.stringify(Array.from(l2.headers.entries())));
  }
}
let V = { indexUpdated: 0, gainingElement: "#biblio", referencesCache: "/resource/XXX-references", renumber: 1, maxAuthLen: 65, debug: true, runFetch: h };
function z(e2) {
  const t2 = "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.";
  return "Reference popup for link [" + (e2 + 1) + "]\n\nHTTP_ERROR, Site admin: recompile this meta file, as this is a new link.\n " + R(+/* @__PURE__ */ new Date("07-June-2024"), "not used", true) + "\n\n" + t2;
}
function Q(e2, t2) {
  if (null === e2)
    return;
  const n2 = v(e2, "left", t2), r2 = v(e2, "top", t2);
  if (-1 === n2 && -1 === r2)
    return;
  let o2 = e2.parentNode;
  const a2 = ["LI", "SUP", "UL", "OL", "SPAN", "P"];
  for (; a2.includes(o2.tagName); )
    o2 = o2.parentNode;
  const i2 = Math.round(v(o2, "left", t2)), s2 = Math.round(v(o2, "top", t2)), c2 = Math.round(v(o2, "width", t2)), u2 = 30 * l, d2 = 5 * l;
  c2 < 650 ? e2.classList.add("leanCentre") : (n2 > i2 + c2 - u2 && e2.classList.add("leanLeft"), n2 < i2 + u2 && e2.classList.add("leanRight"), e2.classList.contains("leanRight") && e2.classList.contains("leanLeft") && (e2.classList.remove("leanRight"), e2.classList.remove("leanLeft"), e2.classList.add("leanCentre")));
  r2 < s2 - d2 && e2.classList.add("leanDown"), r2 > s2 + Math.round(v(o2, "height", t2)) && e2.classList.add("leanUp");
}
async function Z(t2, r2, o2, s2) {
  if (V = Object.assign(V, { debug: e(o2) }, t2), 0 === r2.querySelectorAll(a).length)
    return void n("info", "This URL '" + o2.pathname + "' isn't marked-up for references, so skipped");
  const l2 = await V.runFetch(y(V.referencesCache, o2), false, o2);
  if (l2.ok && Array.isArray(l2.body)) {
    if (r2.querySelectorAll(i).length < l2.body.length)
      throw new Error("Recompile the meta data for  " + o2.pathname);
    const e2 = r2.querySelector("#biblio");
    e2 && e2.setAttribute("style", ""), function(e3, t4) {
      let n2 = e3.headers.get("last-modified");
      if (!n2)
        return;
      n2.indexOf("BST") > 0 && (n2 = n2.substring(0, n2.length - 4));
      const r3 = new Date(n2).getTime();
      r3 > 0 && E(".addReading .ultraSkinny", '<span>Links updated <time datetime="' + r3 + '" title="When this was last recompiled">' + new Date(r3).toLocaleDateString("en-GB", { hour12: false, dateStyle: "medium" }) + "</time> </span>", t4);
    }(l2, r2);
    const t3 = function(e3) {
      const t4 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n2 = [];
      for (let r3 = 0; r3 < e3.length; r3++) {
        if (null === e3[r3]) {
          n2.push(z(r3));
          continue;
        }
        const o3 = R(e3[r3].date, t4[2], true);
        let a2 = e3[r3].title + "", i2 = e3[r3].desc;
        i2 = w(i2, 80), a2 = a2.replace(".", ". "), a2 = w(a2, 80);
        let s3 = e3[r3].auth || t4[0];
        "unknown" === e3[r3].auth && (s3 = t4[0]), s3.length > V.maxAuthLen && (s3 = s3.substring(0, V.maxAuthLen)), n2.push("Reference popup for link [" + (r3 + 1) + "]\n\n" + a2 + "\n" + s3 + " " + o3 + "\n\n" + i2);
      }
      return n2;
    }(l2.body);
    !function(e3, t4, n2) {
      let r3 = 1;
      const o3 = Array.from(t4.querySelectorAll(i));
      if (e3.length > o3.length)
        throw t4.querySelector(a).classList.add(c), t4.querySelector("p[role=status]").textContent += " Recompile meta data. ", new Error("Too many references in meta-data for this article, pls recompile.");
      for (let t5 = 0; t5 < e3.length; t5++)
        o3[t5].setAttribute("aria-label", "" + e3[t5]), Q(o3[t5], n2), V.renumber && (o3[t5].textContent = "" + r3), r3++;
      if (o3.length > e3.length) {
        t4.querySelector("p[role=status]").textContent += "Recompile meta data";
        let r4 = e3.length;
        for (; r4 < o3.length; ) {
          const e4 = z(r4);
          o3[r4].setAttribute("aria-label", "" + e4), Q(o3[r4], n2), V.renumber && (o3[r4].textContent = "" + (r4 + 1)), r4++;
        }
      }
    }(t3, r2, s2), r2.querySelector(a).classList.add(c);
  } else {
    !function(e3, t3) {
      const n2 = m(t3), r3 = Array.from(e3.querySelectorAll(i));
      for (let e4 = 0; e4 < r3.length; e4++) {
        const t4 = `Reference popup for link [${1 + e4}]
ERROR: No valid biblio file found.
site admin, today
HTTP_ERROR, no valid file called ${n2}-references.json found.
`;
        r3[e4].setAttribute("aria-label", "" + t4);
      }
      e3.querySelector(a).classList.add(c);
    }(r2, o2);
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    E(V.gainingElement, e2, r2), n("warn", "Unable to get meta data " + y(V.referencesCache, o2), JSON.stringify(Array.from(l2.headers.entries())));
  }
}
function ee(e2, t2, n2) {
  t2.querySelectorAll("article a").forEach(function(r2) {
    "git" === g(r2).trim().toLowerCase() && (r2.textContent = "", E(r2, '<i class="fa fa-github" aria-hidden="true"></i> \n		 <span class="sr-only">git</span>', t2), e2 ? (r2.setAttribute("aria-label", function(e3) {
      const t3 = new URL(e3);
      let n3 = "[anon dev]", r3 = "";
      if (t3.username && (n3 = t3.username), t3.pathname) {
        const e4 = t3.pathname.split("/");
        n3 = e4[1], r3 = e4[2];
      } else if (t3.hostname.indexOf("github.io")) {
        const e4 = t3.hostname.split(".");
        n3 = e4[0], r3 = "The " + e4[0] + " project";
      }
      return "Reference popup for link [*]\n\n" + r3 + "\n" + n3 + " [recent time]\n\nA Github project ~ text auto generated without scrapping.";
    }(r2.getAttribute("href"))), Q(r2, n2)) : r2.setAttribute("title", "Link to a github project."));
  });
}
function te(e2, t2) {
  let n2 = 0;
  return t2.querySelectorAll(e2).forEach(function(e3) {
    n2 += A(g(e3));
  }), n2;
}
function ne(e2, t2) {
  const n2 = e2.target, r2 = function(e3, t3) {
    if (e3.tagName === t3)
      return e3;
    for (; e3.tagName !== t3; ) {
      if ("A" === e3.tagName)
        return e3;
      if ("BODY" === e3.tagName)
        return;
      if (e3.classList.contains("maquette"))
        return;
      e3 = e3.parentElement;
    }
    return e3;
  }(n2, "DETAILS");
  if (r2 && "A" === r2.tagName)
    return true;
  if (r2) {
    const t3 = r2;
    if (e2.preventDefault(), e2.stopPropagation(), t3 && t3.open) {
      if ("SUMMARY" !== n2.tagName && null !== t3.querySelector("code"))
        return false;
      t3.open = false;
    } else
      t3.open = true;
  } else {
    const n3 = t2.querySelector("details[open]");
    if (!n3)
      return true;
    e2.preventDefault(), e2.stopPropagation(), n3.open = false;
  }
  return false;
}
function re(e2) {
  const t2 = Array.from(e2.querySelectorAll(".popOverWidget details"));
  t2.length && (n("info", "Modal widget found, extra UI features added"), t2.forEach(function(t3) {
    t3.addEventListener("click", function(t4) {
      return ne(t4, e2);
    });
  }), e2.body.addEventListener("click", function(t3) {
    return ne(t3, e2);
  }), e2.body.addEventListener("keydown", function(t3) {
    return function(e3, t4) {
      if ("Escape" === e3.code || "Escape" === e3.key) {
        const n2 = Array.from(t4.querySelectorAll("details[open]"));
        if (n2.length)
          for (let e4 = 0; e4 < n2.length; e4++)
            n2[e4].open = false;
        return e3.preventDefault(), false;
      }
      return true;
    }(t3, e2);
  }));
}
let oe = { pageInitRun: 0 };
function ae() {
  return oe.pageInitRun;
}
!async function(t2, r2, o2, a2) {
  oe = Object.assign(oe, {}, t2);
  const i2 = e(o2);
  if (oe.pageInitRun)
    return void n("warn", "Extra panda should not be run more than once per page");
  oe.pageInitRun = 1;
  const l2 = Array.from(r2.querySelectorAll(".noJS"));
  for (let e2 = 0; e2 < l2.length; e2++)
    l2[e2].classList.remove("noJS");
  !function(e2, t3) {
    e2.querySelector("body").setAttribute("style", "--offset-height: 0;");
    const n2 = Array.from(e2.querySelectorAll(".lotsOfWords, .halferWords, .fewWords"));
    for (let e3 = 0; e3 < n2.length; e3++)
      n2[e3].setAttribute("style", "--offset-height: " + T(n2[e3], t3)[0] + "px;");
  }(r2, a2), function(t3, n2, r3) {
    const o3 = C(t3, n2, r3);
    if (!b(n2.host) && !o3)
      return;
    o3 && (t3.querySelector("#sendMasto").textContent = "Share article");
    const a3 = ['<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>'], i3 = ["shareMenuTrigger", "siteChartLink", "rssLink"], s2 = Array.from(t3.querySelectorAll(".allButtons a")), l3 = !b(n2.host) && !e(n2), c3 = t3.querySelector(".allButtons");
    for (const e2 in s2) {
      if (i3.includes(s2[e2].id))
        continue;
      const t4 = s2[e2].cloneNode(true);
      l3 && c3.removeChild(s2[e2]), t4.classList.remove("bigScreenOnly"), a3.push("<li>"), a3.push(t4.outerHTML), a3.push("</li>"), s2[e2].getAttribute("id") && s2[e2].setAttribute("id", "old" + s2[e2].getAttribute("id"));
    }
    a3.unshift('<nav><div class="shareMenu" id="shareMenu"><menu id="mobileMenu">'), a3.push("</menu></div></nav>"), E("#navBar", a3.join("\n"), t3);
  }(r2, o2, a2), W(r2, o2, a2);
  const c2 = null !== r2.querySelector(".addReferences");
  if (ee(c2, r2, a2), function(e2, t3, n2) {
    t3.querySelectorAll("article a").forEach(function(r3) {
      "docs" === g(r3).trim().toLowerCase() && (r3.textContent = "", E(r3, '<i class="fa fa-book-open" aria-hidden="true"></i>\n		 <span class="sr-only">docs</span>', t3), r3.setAttribute(e2 ? "aria-label" : "title", "Link to the project docs; it may be a git page, or a separate webpage. "), e2 && Q(r3, n2));
    });
  }(c2, r2, a2), function(e2) {
    const t3 = Array.from(e2.querySelectorAll(".addArrow"));
    for (let n2 = 0; n2 < t3.length; n2++)
      E(t3[n2].parentElement, '<i class="fa fa-play specialPointer" aria-hidden="true"></i>', e2);
  }(r2), function(e2) {
    const t3 = new RegExp("`([^`]+)`", "g"), n2 = new RegExp("/ /", "g"), r3 = Array.from(e2.querySelectorAll(".addBashSamples"));
    if (r3.length > 0)
      for (let e3 = 0; e3 < r3.length; e3++)
        r3[e3].innerHTML = r3[e3].innerHTML.replaceAll(t3, '<code class="bashSample" title="Quote from a bash; will add copy button">$1</code>').replaceAll(n2, "//");
  }(r2), function(e2) {
    const t3 = p().get(s);
    if (!t3)
      return;
    const n2 = JSON.parse(t3);
    if (n2.ft = n2.ft.replaceAll("%38", ";"), n2.cr = n2.cr.replaceAll("%38", ";"), n2.dn = n2.dn.replaceAll("%38", ";"), n2.fs = n2.fs.replaceAll("%38", ";"), !n2.ft || !n2.fs)
      return;
    const r3 = "body, .annoyingBody { font-family: " + n2.ft + "; font-size: " + n2.fs + "; direction:" + n2.dn + "; }", o3 = e2.createElement("style");
    o3.setAttribute("id", "client-set-css"), o3.innerText = r3, e2.getElementsByTagName("head")[0].append(o3);
  }(r2), re(r2), x(1040, r2, o2, a2), function(e2, t3) {
    var n2 = false;
    try {
      document.createEvent("TouchEvent"), n2 = true;
    } catch (e3) {
    }
    !(t3 && "Gecko" === t3.product && t3.maxTouchPoints > 0) || n2 || (console.warn("You seem to be using librewolf, could you report to me if this is wrong."), e2.body.classList.contains("IAmLibreWolf") || e2.body.classList.add("IAmLibreWolf"));
  }(r2, a2.navigator), !C(r2, o2, a2) && "/resource/home" !== o2.pathname && r2.querySelectorAll(".reading").length < 2 && function(t3, r3, o3) {
    const a3 = Object.assign({}, { timeFormat: "m", dataLocation: ".blocker", target: "#shareGroup", wordPerMin: 275, codeSelector: "code", refresh: false, debug: e(o3) }, t3), i3 = a3.dataLocation + " img, " + a3.dataLocation + " picture, " + a3.dataLocation + " object", s2 = te(a3.dataLocation, r3);
    if (!s2)
      return;
    let l3 = 0;
    a3.codeSelector && (l3 += te(a3.codeSelector, r3));
    let c3 = (s2 - l3) / a3.wordPerMin + 5 * r3.querySelectorAll(i3).length + 2 * l3 / a3.wordPerMin;
    if (c3 < 1)
      return void n("info", "No reading time displayed for this article");
    if (a3.refresh) {
      const e2 = r3.querySelector(a3.target + " a.reading");
      e2 && e2.parentNode.removeChild(e2);
    }
    c3 = Math.round(c3);
    const u2 = '<a class="reading" title="The text is ' + (l3 + s2) + ' normalised words long.  Link is a longer version of this reading guide guesstimate." href="/resource/jQuery-reading-duration">To read: ' + c3 + a3.timeFormat + "</a>";
    E(a3.target, u2, r3);
  }({ dataLocation: "#main", target: ".addReading", debug: i2, refresh: true }, r2, o2), function(e2, t3) {
    if (!t3.hash)
      return;
    const r3 = e2.querySelector(t3.hash);
    r3 && "INPUT" === r3.tagName ? r3.checked = "checked" : n("error", "failed to find " + t3.hash + " element");
  }(r2, o2), o2.pathname.match("group-")) {
    const e2 = function(e3, t3) {
      const n2 = t3.pathname.split("/group-");
      if (Array.isArray(n2) && n2.length > 1 && "XXX" !== n2[1])
        return n2[1];
      const r3 = new URLSearchParams(t3.search);
      if (r3.has("first"))
        return r3.get("first");
      if (e3 && e3.getAttribute("data-group")) {
        let t4 = e3.getAttribute("data-group");
        return t4 = t4.trim(), t4.split(",").map((e4, t5) => e4.trim())[0];
      }
      throw new Error("KLAXON, KLAXON, I do not know how to build an adjacent list for " + t3.href);
    }(null, o2);
    e2 && await I({ group: e2, debug: i2, runFetch: "adjacentRunFetch" in oe ? oe.adjacentRunFetch : h }, r2, o2, a2);
  } else {
    C(r2, o2, a2) ? await K({ debug: i2, renumber: 1, runFetch: "mobileRunFetch" in oe ? oe.mobileRunFetch : h }, r2, o2) : await Z({ debug: i2, renumber: 1, runFetch: "desktopRunFetch" in oe ? oe.desktopRunFetch : h }, r2, o2, a2);
    const e2 = function(e3, t3 = document) {
      const n2 = t3.querySelector(e3);
      if (!n2)
        return [];
      const r3 = n2.getAttribute("data-group");
      if (!r3)
        return [];
      let o3 = r3.split(",");
      return o3 = o3.map((e4, t4) => e4.trim()), "XXX" === o3[0] && o3.shift(), [...o3];
    }("div#contentGroup", r2);
    if (0 === e2.length)
      n("info", "This URL '" + o2.pathname + "' has no Adjacent groups defined.");
    else
      for (let t3 = 0; t3 < e2.length; t3++)
        await I({ group: e2[t3], debug: i2, iteration: t3, count: e2.length, runFetch: "adjacentRunFetch" in oe ? oe.adjacentRunFetch : h }, r2, o2, a2);
  }
  e(o2, "select") && (n("info", "select and word count feature is ENABLED.  Access= <alt> + w"), r2.body.addEventListener("keydown", (e2) => {
    "w" === e2.key && e2.altKey && n("info", "Word count of selection: " + A(function(e3) {
      try {
        const t3 = e3.getSelection().getRangeAt(0);
        return t3.startOffset === t3.endOffset ? "" : "" + t3.cloneContents().textContent;
      } catch (e4) {
        return n("warn", "Unable to get data for selection", e4.message), "";
      }
    }(a2)));
  })), "undefined" != typeof document && "function" == typeof document.pageStartup ? document.pageStartup() : n("info", "No article specific scripting found, (it may load manually ATF)");
}({}, document, location, window);
export {
  r as SELF_VERSION,
  E as appendIsland,
  X as calcScreenDPI,
  N as currentSize,
  ae as hasBeenRun,
  C as isMobile,
  n as log,
  h as runFetch,
  f as storeAppearance
};
