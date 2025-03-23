function e(e2, t2 = "debug") {
  return new URLSearchParams(e2.search).has(t2);
}
let t = console;
var n = -1;
function r(e2, t2) {
  function r2(e3) {
    return Array.isArray(e3) ? e3.length : Object.keys(e3).length;
  }
  -1 === n ? n = r2(e2) : (o("debug", "Change in " + t2 + " was " + (r2(e2) - n) + " to " + r2(e2)), n = -1);
}
function o(e2, ...n2) {
  t.LOG_USAGE++, "assert" === e2 ? t.assert(...n2) : e2 in console ? t[e2](`[${e2.toUpperCase()}] ${n2.join(", ")}`) : t.log(`[${e2.toUpperCase()}] ${n2.join(", ")}`);
}
const i = "1.0.4", a = "https://owenberesford.me.uk/", s = ".addReferences", l = s + " sup a", c = "appearance", u = 16, d = "showBiblioErrors", f = 180;
class p {
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
function h(e2, t2, n2, r2) {
  const o2 = m();
  e2 = e2.replaceAll(";", "%38"), r2 = r2.replaceAll(";", "%38"), n2 = n2.replaceAll(";", "%38"), t2 = t2.replaceAll(";", "%38");
  const i2 = JSON.stringify({ ft: e2, fs: t2, dn: n2, cr: r2 });
  o2.set(c, i2, 365.254);
}
async function g(t2, n2, r2) {
  const i2 = function() {
    if ("undefined" != typeof window)
      return window.fetch;
    if ("function" == typeof fetch)
      return fetch;
    throw o("error", "Please stop using old versions of node."), new Error("Please stop using old versions of Node");
  }(), a2 = e(r2);
  try {
    const e2 = await i2(t2, { credentials: "same-origin" });
    if (!e2.ok) {
      if (a2 && o("warn", "Failed to communicate with " + t2), n2)
        return { body: "nothing", headers: {}, ok: false };
      throw new Error("ERROR getting asset " + t2);
    }
    if (404 === e2.status)
      throw new Error("got HTTP 404");
    let r3 = "";
    return r3 = e2.headers.get("content-type").toLowerCase().startsWith("application/json") ? await e2.json() : await e2.text(), a2 && o("info", "Successful JSON transaction " + t2), { body: r3, headers: e2.headers, ok: true };
  } catch (e2) {
    if (a2 && o("error", "KLAXON, KLAXON failed: " + t2 + " " + e2.toString()), n2)
      return { body: "nothing", headers: {}, ok: false };
    throw new Error("ERROR getting asset " + t2 + " " + e2.toString());
  }
}
function m() {
  return "undefined" != typeof document ? new p() : { set(e2, t2, n2) {
  }, get: (e2) => "" };
}
function b(e2) {
  if (e2) {
    if ("textContent" in e2)
      return e2.textContent;
    if ("innerText" in e2)
      return e2.innerText;
    throw new Error("No text found");
  }
  throw new Error("No element for text found");
}
function y(e2) {
  return e2.pathname.split("/").pop() || "<name>";
}
function w(e2, t2) {
  let n2 = [];
  return n2 = t2.pathname.split("/"), (!n2 || n2.length < 2) && (n2 = ["resource", "home"]), e2.replace(/XXX/, n2.pop());
}
function k(e2) {
  return !(!e2.startsWith("192.168.") && "127.0.0.1" !== e2 && "::1" !== e2 && "0:0:0:0:0:0:0:1" !== e2 && "localhost" !== e2);
}
function S(e2, t2 = 80, n2 = "↩") {
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
function x(e2) {
  let t2 = String(e2);
  if (0 === e2 || e2 < 1)
    throw new Error("Value passed must be a counting number above 0");
  return 1 === t2.length && (t2 = "0" + t2), t2;
}
function v(e2) {
  if (["1", 1, "true", "TRUE", "on", "ON", "yes", "YES", "✔", "✓"].includes(e2))
    return true;
  if (["0", 0, "false", "FALSE", "off", "OFF", "no", "NO", "🗙", "✕", "✖", "✖", "✗", "✘"].includes(e2))
    return false;
  throw new Error("Unknown data " + e2);
}
function L(e2, t2, n2 = true) {
  let r2 = "";
  if (r2 = Number(e2) === e2 && e2 % 1 == 0 ? 0 === e2 ? "[No date]" : e2 < 1e10 ? new Date(1e3 * e2) : new Date(e2) : t2, "string" != typeof r2) {
    const e3 = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let t3;
    t3 = r2.getHours() ? x(r2.getHours()) : "00", r2 = " " + x(r2.getDate()) + "-" + (n2 ? e3[r2.getMonth() + 1] : x(r2.getMonth() + 1)) + "-" + r2.getUTCFullYear() + " " + (n2 ? "" : t3 + ":00");
  }
  return r2;
}
function E(e2, t2, n2) {
  try {
    if (null === n2)
      throw new Error("Oh no! No DOM object!!");
    const r2 = n2.createElement("template");
    if (r2.innerHTML = t2, "string" == typeof e2) {
      const t3 = n2.querySelector(e2);
      if (null === t3)
        throw new Error("Oh no! DOM element not found: " + e2);
      return t3.append(r2.content);
    }
    return e2.append(r2.content);
  } catch (e3) {
    o("error", e3.toString());
  }
}
function R(e2) {
  if (void 0 === e2)
    return false;
  const t2 = e2.getComputedStyle.toString().includes("[native code]");
  return !("boolean" != typeof t2 || !t2);
}
function C(e2, t2) {
  var n2 = false;
  try {
    document.createEvent("TouchEvent"), n2 = true;
  } catch (e3) {
  }
  return !(!(t2 && "Gecko" === t2.product && t2.maxTouchPoints > 0) || n2) && (console.warn("Is this librewolf?, could tell me if this is wrong."), e2.querySelector('.fullWidth p[role="status"]').innerText += "  Is this librewolf?,  could you tell me if this is wrong.", e2.body.classList.contains("IAmLibreWolf") || e2.body.classList.add("IAmLibreWolf"), true);
}
function O(e2, t2, n2) {
  try {
    if (!R(n2))
      return -1;
    return e2.getBoundingClientRect()[t2];
  } catch (e3) {
    return o("error", "Missing data:" + e3.message), -1;
  }
}
function T(e2, t2) {
  const n2 = e2.getBoundingClientRect();
  return [Math.round(t2.scrollY + n2.top), Math.round(t2.scrollX + n2.left)];
}
async function j(e2, t2, n2) {
  try {
    if (!n2.navigator.clipboard)
      throw new Error("No clipboard available");
    await n2.navigator.clipboard.writeText(t2.href);
  } catch (e3) {
    o("error", "FAILED: copy URL feature borked " + e3.message + "\nIt will fail on a HTTP site.");
  }
}
function q(e2 = 1040, t2, n2, r2) {
  if (t2.querySelector(".maquetteContainer") && function(e3, t3) {
    const n3 = new URLSearchParams(e3.search);
    if (n3.has("width"))
      return parseInt(n3.get("width") ?? "", 10);
    return t3.innerWidth;
  }(n2, r2) > e2) {
    const e3 = Array.from(t2.querySelectorAll(".maquetteContainer details"));
    for (let t3 = 0; t3 < e3.length; t3++)
      e3[t3].classList.contains("singlePopup") || e3[t3].classList.contains("screenDocs") || (e3[t3].open = true);
  }
}
function N(e2, t2, n2) {
  const r2 = new URLSearchParams(t2.search);
  try {
    e2.createEvent("TouchEvent");
    if (r2.has("mobile"))
      return v(r2.get("mobile") ?? "");
    let t3 = f;
    return C(e2, n2.navigator) && (t3 = 1.11 * f), U(e2, n2) > t3;
  } catch (e3) {
    return !(!r2.has("mobile") || !v(r2.get("mobile") ?? ""));
  }
}
function U(e2, t2) {
  try {
    const n2 = e2.createElement("div");
    n2.setAttribute("style", "width:1in;"), e2.body.appendChild(n2);
    const r2 = n2.offsetWidth * t2.devicePixelRatio;
    return n2.remove(), r2;
  } catch (e3) {
    return o("error", "ERROR " + e3.toString()), -1;
  }
}
function X(e2, t2) {
  const n2 = e2.documentElement, r2 = e2.body, o2 = t2.innerWidth || n2.clientWidth || r2.clientWidth, i2 = t2.innerHeight || n2.clientHeight || r2.clientHeight;
  let a2 = 0, s2 = 0;
  return s2 = "string" == typeof i2 ? parseInt(i2, 10) : i2, a2 = "string" == typeof o2 ? parseInt(o2, 10) : o2, [a2, s2];
}
let P = { name: "", meta: "", perRow: 10, titleLimit: 40, rendered: false, iteration: 0, group: "system", count: 1, debug: true, runFetch: g };
function M(e2, t2, n2) {
  let r2 = "", o2 = n2.pathname.split("/").pop();
  const i2 = new URLSearchParams(n2.search);
  return "group-XXX" === o2 && i2.has("first") && (o2 = i2.get("first") ?? "logic-error"), t2 ? i2.has("first") ? r2 += n2.pathname.replace("group-XXX", o2 + "-meta") : r2 += n2.pathname.replace(o2, e2 + "-meta") : r2 += n2.pathname.replace(o2, e2), r2 += n2.search + n2.hash, r2;
}
function D(e2, t2) {
  let n2 = "button";
  return e2 && (n2 += " lower"), n2;
}
function I(e2, t2) {
  return t2 + "" + e2.replace(/[^a-zA-Z0-9_]/g, "_");
}
function F(e2) {
  return e2.split("/").pop() ?? "";
}
function z(e2) {
  let t2 = P.group;
  if ("XXX" === P.group) {
    const n2 = new URLSearchParams(e2.search);
    n2.has("first") && (t2 = n2.get("first"));
  }
  if ("XXX" === t2)
    throw new Error("Thou shalt supply the group somewhere");
  return t2;
}
function W(e2, t2, n2, r2, o2) {
  return P.name === "group-" + P.group || (t2 === e2 && (o2 = r2), r2 > 0 && o2 > 0 && n2 > 0 && r2 >= n2 - 1 && (r2 = 0)), [o2, n2, r2];
}
async function B(t2, n2, r2, i2) {
  if (P = Object.assign(P, { name: y(r2), meta: M(P.group, ".json", r2), debug: e(r2), runFetch: g }, t2), "system" === P.group)
    throw new Error("Must set the article group, and not to 'system'.");
  P.meta = M(P.group, ".json", r2);
  const a2 = "group-XXX" === P.name || P.name === "group-" + P.group, s2 = "group" + P.group;
  if (N(n2, r2, i2) && !a2)
    1 === n2.querySelectorAll(".adjacentGroup .adjacentItem").length && (n2.querySelector(".adjacentGroup p").style.display = "none"), E("#" + s2, "<p>As mobile View, use the full page link to the left</p>", n2);
  else {
    const e2 = await P.runFetch(P.meta, true, r2);
    if (!("ok" in e2) || !e2.ok || !Array.isArray(e2.body))
      return o("info", "There doesn't seem to be a group meta data file."), void E("#" + s2, "<p>Internal error. Hopefully this will be fixed shortly. </p>", n2);
    if (a2) {
      const t3 = function(e3, t4, n3, r3, o2) {
        let i3 = "";
        for (const a3 in e3) {
          const s3 = I(a3, t4), l2 = N(n3, r3, o2) ? "<br />" : "";
          let c2 = e3[a3].desc;
          c2.length > 235 && (c2 = c2.substr(0, 235) + "..."), i3 += '<a class="adjacentItem" href="' + e3[a3].url + '" title="' + c2 + '">' + e3[a3].title + ' <span class="button">' + e3[a3].title + '</span><p id="adjacent' + s3 + '" >Author: ' + e3[a3].auth + " &nbsp; &nbsp; &nbsp;" + l2 + "  Last edit: " + L(e3[a3].date, "Unknown time", true) + " <br />Description: " + c2 + " </p></a>\n";
        }
        return i3;
      }(e2.body, s2, n2, r2, i2);
      E("#groupXXX", t3, n2), function(e3, t4) {
        const n3 = Array.from(t4.querySelectorAll(".top-bar.fullWidth header h1"));
        n3.length && n3[0].textContent && (n3[0].textContent.includes("whatsmyname") || n3[0].textContent.includes("XXX")) && (n3[0].textContent = "Group " + e3);
        const r3 = Array.from(t4.querySelectorAll(".adjacentGroup p"));
        r3.length && r3[0].textContent && r3[0].textContent.includes("XXX") && (r3[0].textContent = "Some similar articles in " + e3);
      }(z(r2), n2);
    } else {
      const t3 = function(e3) {
        let t4 = -1, n3 = P.perRow, r3 = [], o2 = 0, i3 = 0;
        for ([t4, n3, o2] = W(F(e3[0].url), P.name, e3.length, o2, t4); o2 < e3.length; o2++) {
          const a3 = e3[o2].title;
          if (a3 && t4 >= 0 && n3 > 0) {
            r3[i3] = { auth: e3[o2].auth, date: L(e3[o2].date, "[Unknown time]", true), url: e3[o2].url, offset: o2, title: e3[o2].title.substr(0, P.titleLimit), desc: e3[o2].desc }, a3.length > P.titleLimit && (r3[i3].title += "...");
            const t5 = e3[o2].desc;
            t5.length > 235 && (r3[i3].desc = t5.substr(0, 235) + "..."), n3--, i3++;
          }
          if ([t4, n3, o2] = W(F(e3[o2].url), P.name, n3, o2, t4), r3.length === e3.length)
            break;
          if (r3.length >= P.perRow)
            break;
        }
        return r3;
      }(e2.body);
      E("#" + s2, function(e3, t4) {
        let n3 = '<ul class="adjacentList">\n';
        for (const r3 in e3) {
          const o2 = I(r3, t4), i3 = D(e3[r3].desc.length > 110), a3 = "Title: " + e3[r3].title + "\nAuthor: " + e3[r3].auth + " &nbsp; &nbsp; Last edit: " + e3[r3].date + "\nDescription: " + e3[r3].desc;
          n3 += '<li> <a id="link' + o2 + '" class="' + i3 + '" href="' + e3[r3].url + '" aria-label="' + a3 + '" >' + e3[r3].title + "</a> </li>\n";
        }
        return 0 === e3.length ? n3 += "<li> Article doesn't seem setup correctly.</li></ul>" : n3 += '<li><a class="adjacentItem button" href="/resource/group-XXX?first=' + t4 + '" aria-label="This article lists all items in ' + t4 + ' group."> See full list </a></li></ul>', n3;
      }(t3, z(r2)), n2);
    }
  }
}
function H(e2, t2, n2, r2) {
  if (!k(n2.host) && !N(t2, n2, r2))
    return false;
  const o2 = t2.querySelector("#shareMenu");
  return o2 && !o2.classList.replace("shareMenuOpen", "shareMenu") && o2.classList.replace("shareMenu", "shareMenuOpen"), false;
}
function $(e2, t2, n2, r2) {
  const i2 = t2.querySelector("#mastodonserver");
  let a2 = i2.value;
  const s2 = i2.getAttribute("data-url");
  if ("" === a2 || null === a2)
    return false;
  if (a2 = "https://" + a2 + "/share?text=I+think+this+is+important+" + s2, o("info", "Trying to open mastodon server, " + a2), !R(r2))
    throw Error("Test passed, for " + a2);
  return t2.querySelector("#popup").close(), r2.open(a2, "_blank"), N(t2, n2, r2) && H(0, t2, n2, r2), false;
}
function J(e2, t2, n2) {
  let r2 = e2.querySelector("#navBar #mastoTrigger");
  if (!r2)
    return;
  if (K(r2, G, e2, n2), r2 = e2.querySelector("#shareGroup .allButtons #mastoTrigger"), r2) {
    const t3 = function(e3, t4 = "display", n3 = window) {
      let r3 = "";
      e3 && e3.computedStyleMap ? r3 = e3.computedStyleMap()[t4] : e3 && (r3 = n3.getComputedStyle(e3, null).getPropertyValue(t4));
      return r3;
    }(r2, "display", n2);
    t3 && "none" !== t3 && (r2.addEventListener("click", (t4) => G(t4, e2, n2)), r2.addEventListener("keypress", (t4) => G(t4, e2, n2)));
  }
  r2 = e2.querySelector("#copyURL"), r2 && function(e3, t3, n3, r3, o3) {
    e3.addEventListener("click", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("touch", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("keypress", async (e4) => (await t3(n3, r3, o3), false));
  }(r2, j, e2, t2, n2), V(e2.querySelector("#popup #sendMasto"), $, e2, t2, n2);
  const o2 = Array.from(e2.querySelectorAll("#shareMenuTrigger, #shareClose"));
  for (const r3 in o2)
    V(o2[r3], H, e2, t2, n2);
  K(e2.querySelector("#hideMasto"), _, e2, n2);
}
function G(e2, t2, n2) {
  return R(n2) && t2.querySelector("#popup").showModal(), t2.querySelector("#popup input").focus(), false;
}
function _(e2, t2, n2) {
  return R(n2) && t2.querySelector("#popup").close(), false;
}
function K(e2, t2, n2, r2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2), false));
}
function V(e2, t2, n2, r2, o2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2, o2), false));
}
let Y = { referencesCache: "/resource/XXX-references", gainingElement: "#biblio", losingElement: ".addReferences", renumber: 1, forceToEnd: 1, maxDescripLen: 230, maxAuthLen: 65, debug: true, runFetch: g };
async function Q(t2, n2, r2) {
  if (Y = Object.assign(Y, { debug: e(r2) }, t2), 0 === n2.querySelectorAll(s).length)
    return void o("info", "URL '" + r2.pathname + "' isn't marked-up for references, so skipped");
  const i2 = n2.querySelector("#biblio");
  i2 && i2.setAttribute("style", ""), n2.querySelector(Y.gainingElement + " *").replaceChildren(), E(Y.gainingElement, '<h2 class="biblioSection">References (for mobile UI)</h2> \n<p>The references embedded in the text are displayed here. </p>', n2);
  const l2 = await Y.runFetch(w(Y.referencesCache, r2), true, r2);
  if (l2.ok && Array.isArray(l2.body)) {
    const e2 = function(e3) {
      let t3 = '<aside role="footnote"><ol class="mobileBiblio">';
      for (const n3 in e3)
        t3 += `<li>
<a href="${e3[n3].url}"> 
<h5>${e3[n3].title}</h5>
<span>${e3[n3].desc}</span>
<span>by ${e3[n3].auth} on ${e3[n3].date}</span>
</a>
</li>
`;
      return t3 += "</ol></aside>", t3;
    }(function(e3) {
      const t3 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n3 = [];
      for (const r3 in e3) {
        if (null === e3[r3]) {
          n3.push({ auth: "[No author]", date: "[No date]", desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", offset: parseInt(r3, 10), title: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", url: a });
          continue;
        }
        const o2 = L(e3[r3].date, t3[2], true);
        let i3 = e3[r3].title + "";
        i3 = i3.replace(".", ".  ");
        let s2 = e3[r3].desc + "";
        s2.length > Y.maxDescripLen && (s2 = s2.substring(0, Y.maxDescripLen));
        let l3 = e3[r3].auth || t3[0];
        "unknown" === e3[r3].auth && (l3 = t3[0]), l3.length > Y.maxAuthLen && (l3 = l3.substring(0, Y.maxAuthLen)), n3.push({ auth: l3, date: o2, desc: s2, offset: parseInt(r3, 10), title: i3, url: e3[r3].url });
      }
      return n3;
    }(l2.body));
    !function(e3, t3) {
      if (!Y.renumber)
        return;
      const n3 = Array.from(t3.querySelectorAll(Y.losingElement + " sup a"));
      for (let e4 = 0; e4 < n3.length; e4++)
        n3[e4].textContent = "" + (e4 + 1), Y.forceToEnd && (n3[e4].href = "#biblio");
    }(l2.body, n2), E(Y.gainingElement, e2, n2);
  } else {
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    E(Y.gainingElement, e2, n2), o("warn", "Unable to get meta data " + w(Y.referencesCache, r2), JSON.stringify(Array.from(l2.headers.entries())));
  }
}
let Z = { indexUpdated: 0, gainingElement: "#biblio", referencesCache: "/resource/XXX-references", renumber: 1, maxAuthLen: 65, debug: true, runFetch: g };
function ee(e2) {
  const t2 = "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.";
  return "Reference popup for link [" + (e2 + 1) + "]\n\nHTTP_ERROR, Site admin: recompile this meta file, as this is a new link.\n " + L(+/* @__PURE__ */ new Date("07-June-2024"), "not used", true) + "\n\n" + t2;
}
function te(e2, t2) {
  if (null === e2)
    return;
  const n2 = O(e2, "left", t2), r2 = O(e2, "top", t2);
  if (-1 === n2 && -1 === r2)
    return;
  let o2 = e2.parentNode;
  const i2 = ["LI", "SUP", "UL", "OL", "SPAN", "P"];
  for (; i2.includes(o2.tagName); )
    o2 = o2.parentNode;
  const a2 = Math.round(O(o2, "left", t2)), s2 = Math.round(O(o2, "top", t2)), l2 = Math.round(O(o2, "width", t2)), c2 = 30 * u, d2 = 5 * u;
  l2 < 650 ? e2.classList.add("leanCentre") : (n2 > a2 + l2 - c2 && e2.classList.add("leanLeft"), n2 < a2 + c2 && e2.classList.add("leanRight"), e2.classList.contains("leanRight") && e2.classList.contains("leanLeft") && (e2.classList.remove("leanRight"), e2.classList.remove("leanLeft"), e2.classList.add("leanCentre")));
  r2 < s2 - d2 && e2.classList.add("leanDown"), r2 > s2 + Math.round(O(o2, "height", t2)) && e2.classList.add("leanUp");
}
async function ne(t2, n2, r2, i2) {
  if (Z = Object.assign(Z, { debug: e(r2) }, t2), 0 === n2.querySelectorAll(s).length)
    return void o("info", "This URL '" + r2.pathname + "' isn't marked-up for references, so skipped");
  const a2 = await Z.runFetch(w(Z.referencesCache, r2), true, r2);
  if (a2.ok && Array.isArray(a2.body)) {
    if (n2.querySelectorAll(l).length < a2.body.length)
      throw new Error("Recompile the meta data for  " + r2.pathname);
    const e2 = n2.querySelector("#biblio");
    e2 && e2.setAttribute("style", ""), function(e3, t4) {
      let n3 = e3.headers.get("last-modified");
      if (!n3)
        return;
      n3.indexOf("BST") > 0 && (n3 = n3.substring(0, n3.length - 4));
      const r3 = new Date(n3).getTime();
      r3 > 0 && E(".addReading .ultraSkinny", '<span>Links updated <time datetime="' + r3 + '" title="When this was last recompiled">' + new Date(r3).toLocaleDateString("en-GB", { hour12: false, dateStyle: "medium" }) + "</time> </span>", t4);
    }(a2, n2);
    const t3 = function(e3) {
      const t4 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n3 = [];
      for (let r3 = 0; r3 < e3.length; r3++) {
        if (null === e3[r3]) {
          n3.push(ee(r3));
          continue;
        }
        const o2 = L(e3[r3].date, t4[2], true);
        let i3 = e3[r3].title + "", a3 = e3[r3].desc;
        a3 = S(a3, 80), i3 = i3.replace(".", ". "), i3 = S(i3, 80);
        let s2 = e3[r3].auth || t4[0];
        "unknown" === e3[r3].auth && (s2 = t4[0]), s2.length > Z.maxAuthLen && (s2 = s2.substring(0, Z.maxAuthLen)), n3.push("Reference popup for link [" + (r3 + 1) + "]\n\n" + i3 + "\n" + s2 + " " + o2 + "\n\n" + a3);
      }
      return n3;
    }(a2.body);
    !function(e3, t4, n3) {
      let r3 = 1;
      const o2 = Array.from(t4.querySelectorAll(l));
      if (e3.length > o2.length)
        throw t4.querySelector(s).classList.add(d), t4.querySelector("p[role=status]").textContent += " Recompile meta data. ", new Error("Too many references in meta-data for this article, pls recompile.");
      for (let t5 = 0; t5 < e3.length; t5++)
        o2[t5].setAttribute("aria-label", "" + e3[t5]), te(o2[t5], n3), Z.renumber && (o2[t5].textContent = "" + r3), r3++;
      if (o2.length > e3.length) {
        t4.querySelector("p[role=status]").textContent += "Recompile meta data";
        let r4 = e3.length;
        for (; r4 < o2.length; ) {
          const e4 = ee(r4);
          o2[r4].setAttribute("aria-label", "" + e4), te(o2[r4], n3), Z.renumber && (o2[r4].textContent = "" + (r4 + 1)), r4++;
        }
      }
    }(t3, n2, i2), n2.querySelector(s).classList.add(d);
  } else {
    !function(e3, t3) {
      const n3 = y(t3), r3 = Array.from(e3.querySelectorAll(l));
      for (let e4 = 0; e4 < r3.length; e4++) {
        const t4 = `Reference popup for link [${1 + e4}]
ERROR: No valid biblio file found.
site admin, today
HTTP_ERROR, no valid file called ${n3}-references.json found.
`;
        r3[e4].setAttribute("aria-label", "" + t4);
      }
      e3.querySelector(s).classList.add(d);
    }(n2, r2);
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    E(Z.gainingElement, e2, n2), o("warn", "Unable to get meta data " + w(Z.referencesCache, r2), JSON.stringify(Array.from(a2.headers.entries())));
  }
}
function re(e2, t2, n2) {
  t2.querySelectorAll("article a").forEach(function(r2) {
    "git" === b(r2).trim().toLowerCase() && (r2.textContent = "", E(r2, '<i class="fa fa-github" aria-hidden="true"></i> \n		 <span class="sr-only">git</span>', t2), e2 ? (r2.setAttribute("aria-label", function(e3) {
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
    }(r2.getAttribute("href"))), te(r2, n2)) : r2.setAttribute("title", "Link to a github project."));
  });
}
function oe(e2, t2) {
  let n2 = 0;
  return t2.querySelectorAll(e2).forEach(function(e3) {
    n2 += A(b(e3));
  }), n2;
}
function ie(e2, t2) {
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
function ae(e2) {
  const t2 = Array.from(e2.querySelectorAll(".popOverWidget details"));
  t2.length && (o("info", "Modal widget found, extra UI features added"), t2.forEach(function(t3) {
    t3.addEventListener("click", function(t4) {
      return ie(t4, e2);
    });
  }), e2.body.addEventListener("click", function(t3) {
    return ie(t3, e2);
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
let se = { pageInitRun: 0 };
function le() {
  return se.pageInitRun;
}
function ce(e2, t2, n2 = "") {
  let r2 = "@media screen and " + t2 + " {" + n2;
  return Object.keys(e2).map(function(t3, o2) {
    r2 += function(e3, t4) {
      let n3 = e3 + " {";
      for (let e4 of Object.keys(t4))
        n3 += ` ${e4}:${t4[e4]};`;
      return n3 += " }", n3;
    }(t3, e2[t3]) + n2;
  }), r2 += "}" + n2, r2;
}
function ue(e2) {
  if (0 === Object.keys(e2).length)
    return "{}";
  if ("string" != typeof Object.values(e2)[0])
    throw new Error("KLAAAXX0N, KLAAAAXX00n!!1eleven Implement me");
  for (let t2 of Object.keys(e2))
    "string" == typeof e2[t2] ? e2[t2].replaceAll('"', '\\"') : e2[t2];
  return JSON.stringify(e2);
}
function de(e2, t2 = "generated-sample.css") {
  const n2 = document.createElement("a"), r2 = new Blob([e2], { type: "application/json" });
  let o2 = URL.createObjectURL(r2);
  n2.href = o2, n2.download = t2, n2.click(), URL.revokeObjectURL(o2);
}
class fe {
  #e;
  #t;
  constructor(e2, t2) {
    this.#e = e2, this.#t = t2;
  }
  filterCommonTags(e2, t2, n2) {
    let o2 = n2.extractLocal(n2.exportClassname(t2, true), null);
    for (let n3 in e2) {
      r(e2[n3], "");
      for (let r2 of Object.keys(e2[n3]))
        r2 in o2 && n3 !== t2 && o2[r2] === e2[n3][r2] && delete e2[n3][r2];
      r(e2[n3], "filterCommonTags[" + t2 + "] - " + n3);
    }
    o2 = n2.extractLocal("body", null);
    for (let t3 in e2) {
      r(e2[t3], "");
      for (let n3 of Object.keys(e2[t3]))
        n3 in o2 && o2[n3] === e2[t3][n3] && delete e2[t3][n3];
      r(e2[t3], "filterCommonTags[body] - " + t3);
    }
    return e2;
  }
  filterEmpty(e2) {
    r(e2, "");
    for (let t2 of Object.keys(e2))
      0 === Object.values(e2[t2]).length && delete e2[t2];
    return r(e2, "filterEmpty"), e2;
  }
  async generateKey(e2) {
    try {
      let t2 = JSON.stringify(e2);
      const n2 = new TextEncoder().encode(t2);
      let r2 = await this.#t.crypto.subtle.digest("SHA-1", n2);
      return String.fromCharCode.apply(null, Array.from(new Uint8Array(r2)));
    } catch (e3) {
      const t2 = e3;
      return o("error", "Unable to make a hash?? " + t2.message, t2.stack), "";
    }
  }
  async generateInvert(e2) {
    r(e2, "");
    let t2 = {};
    for (let n2 in e2) {
      t2[await this.generateKey(e2[n2])] = n2;
    }
    for (let n2 in e2) {
      let r2 = await this.generateKey(e2[n2]);
      r2 in t2 && t2[r2] !== n2 && delete e2[n2];
    }
    return r(e2, "generateInvert"), e2;
  }
  externalFilter(e2, t2) {
    r(e2, "");
    let n2 = [];
    for (let r2 = 0; r2 < e2.length; r2++) {
      let o2 = false;
      t2.map(function(t3, n3) {
        let i2 = new RegExp(" " + t3, "i");
        (e2[r2].startsWith(t3) || e2[r2].match(i2)) && (o2 = true);
      }), o2 || n2.push(e2[r2]);
    }
    return r(n2, "externalFilter"), n2;
  }
}
class pe {
  #e;
  #t;
  #n;
  static PSEUDO = [null, "before", "after", ":marker", "hover", "focus-within"];
  static CSS_ACTIVE = ["align-content", "align-items", "align-self", "appearance", "aspect-ratio", "background", "background-color", "border", "border-bottom", "border-bottom-right-radius", "border-left", "border-left-width", "border-radius", "border-top", "border-top-right-radius", "border-top-width", "border-width", "bottom", "clear", "clip", "clip-path", "color", "column-count", "column-gap", "columns", "column-width", "contain", "container", "content", "d", "direction", "display", "filter", "flex", "flex-direction", "flex-flow", "flex-wrap", "float", "font", "font-family", "font-size", "font-style", "font-weight", "gap", "height", "hyphenate-character", "inset", "justify-content", "left", "line-height", "list-style", "list-style-position", "list-style-type", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-left", "margin-right", "margin-top", "marker", "max-width", "min-height", "min-width", "opacity", "order", "outline", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-inline", "padding-inline-start", "padding-left", "padding-right", "padding-top", "page", "place-self", "pointer-events", "position", "r", "resize", "right", "rotate", "ry", "scrollbar-color", "scrollbar-width", "scroll-snap-align", "scroll-snap-type", "text-align", "text-decoration", "text-transform", "text-wrap", "text-wrap-mode", "top", "transform", "transition", "translate", "user-select", "vertical-align", "visibility", "white-space", "width", "word-break", "x", "y", "z-index"];
  static CSS_KEYWORDS = ["accent-color", "align-content", "align-items", "align-self", "animation", "animation-composition", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "aspect-ratio", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-size", "baseline-source", "block-size", "border", "border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-end-end-radius", "border-end-start-radius", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-start-end-radius", "border-start-start-radius", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "clip-path", "clip-rule", "color", "color-adjust", "color-interpolation", "color-interpolation-filters", "color-scheme", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "columns", "column-span", "column-width", "contain", "container", "container-name", "container-type", "contain-intrinsic-block-size", "contain-intrinsic-height", "contain-intrinsic-inline-size", "contain-intrinsic-size", "contain-intrinsic-width", "content", "content-visibility", "counter-increment", "counter-reset", "counter-set", "cursor", "cx", "cy", "d", "direction", "display", "dominant-baseline", "empty-cells", "fill", "fill-opacity", "fill-rule", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "flood-color", "flood-opacity", "font", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing", "font-palette", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-synthesis-position", "font-synthesis-small-caps", "font-synthesis-style", "font-synthesis-weight", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "forced-color-adjust", "gap", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "height", "hyphenate-character", "hyphens", "image-orientation", "image-rendering", "ime-mode", "inline-size", "inset", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", "isolation", "justify-content", "justify-items", "justify-self", "left", "letter-spacing", "lighting-color", "line-break", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-inline", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right", "margin-top", "marker", "marker-end", "marker-mid", "marker-start", "mask", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-position-x", "mask-position-y", "mask-repeat", "mask-size", "mask-type", "math-depth", "math-style", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "object-fit", "object-position", "offset", "offset-anchor", "offset-distance", "offset-path", "offset-position", "offset-rotate", "opacity", "order", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-anchor", "overflow-block", "overflow-clip-margin", "overflow-inline", "overflow-wrap", "overflow-x", "overflow-y", "overscroll-behavior", "overscroll-behavior-block", "overscroll-behavior-inline", "overscroll-behavior-x", "overscroll-behavior-y", "padding", "padding-block", "padding-block-end", "padding-block-start", "padding-bottom", "padding-inline", "padding-inline-end", "padding-inline-start", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "paint-order", "perspective", "perspective-origin", "place-content", "place-items", "place-self", "pointer-events", "position", "print-color-adjust", "quotes", "r", "resize", "right", "rotate", "row-gap", "ruby-align", "ruby-position", "rx", "ry", "scale", "scrollbar-color", "scrollbar-gutter", "scrollbar-width", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-stop", "scroll-snap-type", "shape-image-threshold", "shape-margin", "shape-outside", "shape-rendering", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "table-layout", "tab-size", "text-align", "text-align-last", "text-anchor", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip-ink", "text-decoration-style", "text-decoration-thickness", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-indent", "text-justify", "text-orientation", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-offset", "text-underline-position", "text-wrap", "text-wrap-mode", "text-wrap-style", "top", "touch-action", "transform", "transform-box", "transform-origin", "transform-style", "transition", "transition-behavior", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "unicode-bidi", "user-select", "vector-effect", "vertical-align", "visibility", "white-space", "white-space-collapse", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "x", "y", "z-index", "zoom"];
  constructor(e2, t2, n2) {
    this.#e = t2, this.#t = n2, this.#n = e2;
  }
  async compose(e2, t2) {
    let n2 = {};
    const r2 = this.#n.externalFilter(this.taggedElements(e2), t2);
    for (let e3 = 0; e3 < r2.length; e3++) {
      let t3 = this.mapPseudo(r2[e3]), i2 = Object.keys(t3);
      for (let e4 = 0; e4 < i2.length; e4++)
        i2[e4] in n2 ? o("assert", !(i2[e4] in n2), "[SKIP] Duplicate element " + t3[e4]) : 0 === e4 ? n2[i2[e4]] = t3[i2[e4]] : this.compareTrees(t3[i2[0]], t3[i2[e4]]) || (n2[i2[e4]] = t3[i2[e4]]);
    }
    return n2 = this.#n.filterEmpty(this.#n.filterCommonTags(n2, e2, this)), "https:" === location.protocol && (n2 = await this.#n.generateInvert(n2)), console.log("reasults of compose", n2), n2;
  }
  taggedElements(e2) {
    let t2 = [];
    const n2 = this;
    Array.from(this.#e.querySelectorAll("." + e2 + " [class]")).map(function(r2, o2) {
      if ("" === r2.className.trim())
        return;
      let i3 = r2.className.trim().replaceAll("  ", " ").split(" ");
      i3 = i3.map((e3, t3) => "." + e3), t2.push(...i3.map((t3, n3) => "." + e2 + " " + t3)), t2.push(...i3), i3.map(function(o3, i4) {
        t2.push(n2.treeWalk(o3, r2, e2));
      });
    }), o("warn", "initial select found " + t2.length), r(t2, "");
    let i2 = new Set(t2);
    return t2 = Array.from(i2), r(t2, "taggedElements[dedup]"), t2;
  }
  extractLocal(e2, t2 = null) {
    const n2 = this.#e.querySelector(e2);
    if (null === n2)
      return o("assert", null !== n2, "Value passed '" + e2 + "' into localExtract doesnt work in current doc."), {};
    const i2 = n2.parentNode, a2 = this.#t.getComputedStyle(n2, t2), s2 = this.#t.getComputedStyle(i2, t2);
    let l2 = {};
    r([], "");
    for (let e3 = 0; e3 < a2.length; e3++)
      this.isUsefulCSSAttribute(a2.item(e3), a2.getPropertyValue(a2.item(e3)), s2.getPropertyValue(a2.item(e3))) && (l2[a2.item(e3)] = a2.getPropertyValue(a2.item(e3)));
    return r(l2, "extractLocal[" + e2 + "]"), l2;
  }
  isUsefulCSSAttribute(e2, t2, n2) {
    return !!e2.startsWith("--") || !!pe.CSS_ACTIVE.includes(e2) && ("" !== n2 && null !== n2 && n2 !== t2);
  }
  hasStyles(e2, t2) {
    "string" == typeof e2 && (e2 = this.#e.querySelector(e2));
    return this.#t.getComputedStyle(e2, t2).length > 0;
  }
  mapPseudo(e2) {
    o("assert", "." !== e2.trim(), "Bad data extaction, got '.'");
    let t2 = {};
    o("assert", null !== this.#e.querySelector(e2), "Bad data extraction for " + e2);
    for (let n2 in pe.PSEUDO)
      if (this.hasStyles(e2, pe.PSEUDO[n2])) {
        let r2 = e2;
        pe.PSEUDO[n2] && (r2 += ":" + pe.PSEUDO[n2]), t2[r2] = this.extractLocal(e2, pe.PSEUDO[n2]);
      }
    return t2;
  }
  treeWalk(e2, t2, n2) {
    let r2 = ["." + e2], o2 = true;
    var i2 = null;
    if (n2.includes(" ") && (i2 = n2.split(" ").map(function(e3, t3) {
      return e3.trim();
    })).length > 2)
      throw new Error("Not supported to have a 3+ clause component root");
    for (; o2; ) {
      if (t2.classList.contains(n2)) {
        r2.unshift(this.exportClassname(n2)), o2 = false;
        break;
      }
      if (i2 && t2.classList.contains(i2[1]) && t2.parentNode.classList.contains(i2[0])) {
        r2.unshift(this.exportClassname(n2)), o2 = false;
        break;
      }
      if ("BODY" === t2.tagName) {
        o2 = false;
        break;
      }
      t2.classList.length && r2.unshift(this.exportClassname(t2.className)), t2 = t2.parentNode;
    }
    return r2.pop(), r2.join(" .").replaceAll("..", ".");
  }
  exportClassname(e2, t2 = false) {
    return t2 ? ("." + e2.trim()).replaceAll(" ", " .") : ("." + e2.trim()).replaceAll(" ", ".");
  }
  compareTrees(e2, t2) {
    return ue(e2) === ue(t2);
  }
}
await async function(t2, n2, r2, i2) {
  se = Object.assign(se, {}, t2);
  const a2 = e(r2);
  if (se.pageInitRun)
    return void o("warn", "Extra panda should not be run more than once per page");
  se.pageInitRun = 1;
  const s2 = Array.from(n2.querySelectorAll(".noJS"));
  for (let e2 = 0; e2 < s2.length; e2++)
    s2[e2].classList.remove("noJS");
  !function(e2, t3) {
    e2.querySelector("body").setAttribute("style", "--offset-height: 0;");
    const n3 = Array.from(e2.querySelectorAll(".lotsOfWords, .halferWords, .fewWords"));
    for (let e3 = 0; e3 < n3.length; e3++)
      n3[e3].setAttribute("style", "--offset-height: " + T(n3[e3], t3)[0] + "px;");
  }(n2, i2), function(t3, n3, r3) {
    const o2 = N(t3, n3, r3);
    if (!k(n3.host) && !o2)
      return;
    if (C(t3, r3.navigator) && !o2)
      return;
    o2 && (t3.querySelector("#sendMasto").textContent = "Share article");
    const i3 = ['<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>'], a3 = ["shareMenuTrigger", "siteChartLink", "rssLink"], s3 = Array.from(t3.querySelectorAll(".allButtons a")), l3 = !k(n3.host) && !e(n3), c2 = t3.querySelector(".allButtons");
    for (const e2 in s3) {
      if (a3.includes(s3[e2].id))
        continue;
      const t4 = s3[e2].cloneNode(true);
      l3 && c2.removeChild(s3[e2]), t4.classList.remove("bigScreenOnly"), i3.push("<li>"), i3.push(t4.outerHTML), i3.push("</li>"), s3[e2].getAttribute("id") && s3[e2].setAttribute("id", "old" + s3[e2].getAttribute("id"));
    }
    i3.unshift('<nav><div class="shareMenu" id="shareMenu"><menu id="mobileMenu">'), i3.push("</menu></div></nav>"), E("#navBar", i3.join("\n"), t3);
  }(n2, r2, i2), J(n2, r2, i2);
  const l2 = null !== n2.querySelector(".addReferences");
  if (re(l2, n2, i2), function(e2, t3, n3) {
    t3.querySelectorAll("article a").forEach(function(r3) {
      "docs" === b(r3).trim().toLowerCase() && (r3.textContent = "", E(r3, '<i class="fa fa-book-open" aria-hidden="true"></i>\n		 <span class="sr-only">docs</span>', t3), r3.setAttribute(e2 ? "aria-label" : "title", "Link to the project docs; it may be a git page, or a separate webpage. "), e2 && te(r3, n3));
    });
  }(l2, n2, i2), function(e2) {
    const t3 = Array.from(e2.querySelectorAll(".addArrow"));
    for (let n3 = 0; n3 < t3.length; n3++)
      E(t3[n3].parentElement, '<i class="fa fa-play specialPointer" aria-hidden="true"></i>', e2);
  }(n2), function(e2) {
    const t3 = new RegExp("`([^`]+)`", "g"), n3 = new RegExp("/ /", "g"), r3 = Array.from(e2.querySelectorAll(".addBashSamples"));
    if (r3.length > 0)
      for (let e3 = 0; e3 < r3.length; e3++)
        r3[e3].innerHTML = r3[e3].innerHTML.replaceAll(t3, '<code class="bashSample" title="Quote from a bash; will add copy button">$1</code>').replaceAll(n3, "//");
  }(n2), function(e2) {
    const t3 = m().get(c);
    if (!t3)
      return;
    const n3 = JSON.parse(t3);
    if (n3.ft = n3.ft.replaceAll("%38", ";"), n3.cr = n3.cr.replaceAll("%38", ";"), n3.dn = n3.dn.replaceAll("%38", ";"), n3.fs = n3.fs.replaceAll("%38", ";"), !n3.ft || !n3.fs)
      return;
    const r3 = "body, .annoyingBody { font-family: " + n3.ft + "; font-size: " + n3.fs + "; direction:" + n3.dn + "; }", o2 = e2.createElement("style");
    o2.setAttribute("id", "client-set-css"), o2.innerText = r3, e2.getElementsByTagName("head")[0].append(o2);
  }(n2), ae(n2), q(1040, n2, r2, i2), C(n2, i2.navigator), !N(n2, r2, i2) && "/resource/home" !== r2.pathname && n2.querySelectorAll(".reading").length < 2 && function(t3, n3, r3) {
    const i3 = Object.assign({}, { timeFormat: "m", dataLocation: ".blocker", target: "#shareGroup", wordPerMin: 275, codeSelector: "code", refresh: false, debug: e(r3) }, t3), a3 = i3.dataLocation + " img, " + i3.dataLocation + " picture, " + i3.dataLocation + " object", s3 = oe(i3.dataLocation, n3);
    if (!s3)
      return;
    let l3 = 0;
    i3.codeSelector && (l3 += oe(i3.codeSelector, n3));
    let c2 = (s3 - l3) / i3.wordPerMin + 5 * n3.querySelectorAll(a3).length + 2 * l3 / i3.wordPerMin;
    if (c2 < 1)
      return void o("info", "No reading time displayed for this article");
    if (i3.refresh) {
      const e2 = n3.querySelector(i3.target + " a.reading");
      e2 && e2.parentNode.removeChild(e2);
    }
    c2 = Math.round(c2);
    const u2 = '<a class="reading" title="The text is ' + (l3 + s3) + ' normalised words long.  Link is a longer version of this reading guide guesstimate." href="/resource/jQuery-reading-duration">To read: ' + c2 + i3.timeFormat + "</a>";
    E(i3.target, u2, n3);
  }({ dataLocation: "#main", target: ".addReading", debug: a2, refresh: true }, n2, r2), function(e2, t3) {
    if (!t3.hash)
      return;
    const n3 = e2.querySelector(t3.hash);
    n3 && "INPUT" === n3.tagName ? n3.checked = true : o("error", "failed to find " + t3.hash + " element");
  }(n2, r2), r2.pathname.match("group-")) {
    const e2 = function(e3, t3) {
      const n3 = t3.pathname.split("/group-");
      if (Array.isArray(n3) && n3.length > 1 && "XXX" !== n3[1])
        return n3[1];
      const r3 = new URLSearchParams(t3.search);
      if (r3.has("first"))
        return r3.get("first") ?? "";
      if (e3 && e3.getAttribute("data-group")) {
        let t4 = e3.getAttribute("data-group") ?? "";
        return t4 = t4.trim(), t4.split(",").map((e4, t5) => e4.trim())[0];
      }
      throw new Error("KLAXON, KLAXON, I do not know how to build an adjacent list for " + t3.href);
    }(null, r2);
    e2 && await B({ group: e2, debug: a2, runFetch: "adjacentRunFetch" in se ? se.adjacentRunFetch : g }, n2, r2, i2);
  } else {
    N(n2, r2, i2) ? await Q({ debug: a2, renumber: 1, runFetch: "mobileRunFetch" in se ? se.mobileRunFetch : g }, n2, r2) : await ne({ debug: a2, renumber: 1, runFetch: "desktopRunFetch" in se ? se.desktopRunFetch : g }, n2, r2, i2);
    const e2 = function(e3, t3 = document) {
      const n3 = t3.querySelector(e3);
      if (!n3)
        return [];
      const r3 = n3.getAttribute("data-group");
      if (!r3)
        return [];
      let o2 = r3.split(",");
      return o2 = o2.map((e4, t4) => e4.trim()), "XXX" === o2[0] && o2.shift(), [...o2];
    }("div#contentGroup", n2);
    if (0 === e2.length)
      o("info", "This URL '" + r2.pathname + "' has no Adjacent groups defined.");
    else
      for (let t3 = 0; t3 < e2.length; t3++)
        await B({ group: e2[t3], debug: a2, iteration: t3, count: e2.length, runFetch: "adjacentRunFetch" in se ? se.adjacentRunFetch : g }, n2, r2, i2);
  }
  e(r2, "select") && (o("info", "select and word count feature is ENABLED.  Access= <alt> + w"), n2.body.addEventListener("keydown", (e2) => {
    "w" === e2.key && e2.altKey && o("info", "Word count of selection: " + A(function(e3) {
      try {
        const t3 = e3.getSelection();
        if (null === t3)
          return "";
        const n3 = t3.getRangeAt(0);
        return n3.startOffset === n3.endOffset ? "" : "" + n3.cloneContents().textContent;
      } catch (e4) {
        return o("warn", "Unable to get data for selection", e4.message), "";
      }
    }(i2)));
  })), "undefined" != typeof document && "function" == typeof document.pageStartup ? document.pageStartup() : o("info", "No article specific scripting found, (it may load manually ATF)");
}({}, document, location, window);
let he = new URLSearchParams(location.search);
he.has("dump-css") && (console.log("Open tools now"), await async function(e2) {
  return new Promise((t2, n2) => setTimeout(t2, e2));
}(5e3), function(e2, t2, n2) {
  let r2;
  switch (t2) {
    case 1:
      r2 = ce(e2, n2, "\n"), de(r2, "generated-css.css");
      break;
    case 2:
      r2 = function(e3) {
        let t3 = Object.keys(e3);
        for (let n3 in t3) {
          "string" == typeof t3[n3] && (t3[n3] = t3[n3].replaceAll('"', '\\"'));
          for (let r3 in e3[t3[n3]])
            e3[t3[n3]][r3] = e3[t3[n3]][r3].replaceAll('"', '\\"');
        }
        return JSON.stringify(e3);
      }(e2), de(r2, "generated-css.json");
      break;
    default:
      throw new Error("Unknown value " + t2);
  }
}(await async function(e2, t2) {
  let n2 = ["defaultLinksMenu", "bibbles", "h4_footer", "articleContent", "adjacentGroup", "articleHeader row"];
  const r2 = [".fa-", ".fa.fa-", ".hljs-"];
  let o2 = {}, i2 = new pe(new fe(e2, t2), e2, t2);
  for (let e3 in n2) {
    let t3 = await i2.compose(n2[e3], r2);
    for (let e4 of Object.keys(t3))
      o2[e4] = e4 in o2 ? Object.assign(o2[e4], t3[e4]) : t3[e4];
  }
  return o2;
}(document, window), parseInt(he.get("dump-css"), 10), he.get("aspect") ?? "(width:100%)"));
export {
  i as SELF_VERSION,
  E as appendIsland,
  U as calcScreenDPI,
  X as currentSize,
  le as hasBeenRun,
  N as isMobile,
  o as log,
  g as runFetch,
  h as storeAppearance
};
