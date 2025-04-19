import { d as e, l as t } from "./log-services-EBlUqAIE.js";
import { a } from "./log-services-EBlUqAIE.js";
const n = "1.0.4";
function r(e2) {
  return n >= e2;
}
const o = "https://owenberesford.me.uk/", i = ".addReferences", s = i + " sup a", l = "appearance", c = 16, u = "showBiblioErrors", d = 180;
class f {
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
  const o2 = g();
  e2 = e2.replaceAll(";", "%38"), r2 = r2.replaceAll(";", "%38"), n2 = n2.replaceAll(";", "%38"), t2 = t2.replaceAll(";", "%38");
  const a2 = JSON.stringify({ ft: e2, fs: t2, dn: n2, cr: r2 });
  o2.set(l, a2, 365.254);
}
async function p(n2, r2, o2) {
  const a2 = function() {
    if ("undefined" != typeof window) return window.fetch;
    if ("function" == typeof fetch) return fetch;
    throw t("error", "Please stop using old versions of node."), new Error("Please stop using old versions of Node");
  }(), i2 = e(o2);
  try {
    const e2 = await a2(n2, { credentials: "same-origin" });
    if (!e2.ok) {
      if (i2 && t("warn", "Failed to communicate with " + n2), r2) return { body: "nothing", headers: {}, ok: false };
      throw new Error("ERROR getting asset " + n2);
    }
    if (404 === e2.status) throw new Error("got HTTP 404");
    let o3 = "";
    return o3 = e2.headers.get("content-type").toLowerCase().startsWith("application/json") ? await e2.json() : await e2.text(), i2 && t("info", "Successful JSON transaction " + n2), { body: o3, headers: e2.headers, ok: true };
  } catch (e2) {
    if (i2 && t("error", "KLAXON, KLAXON failed: " + n2 + " " + e2.toString()), r2) return { body: "nothing", headers: {}, ok: false };
    throw new Error("ERROR getting asset " + n2 + " " + e2.toString());
  }
}
function g() {
  return "undefined" != typeof document ? new f() : { set(e2, t2, n2) {
  }, get: (e2) => "" };
}
function m(e2) {
  if (e2) {
    if ("textContent" in e2) return e2.textContent;
    if ("innerText" in e2) return e2.innerText;
    throw new Error("No text found");
  }
  throw new Error("No element for text found");
}
function y(e2) {
  return e2.pathname.split("/").pop() || "<name>";
}
function b(e2, t2) {
  let n2 = [];
  return n2 = t2.pathname.split("/"), (!n2 || n2.length < 2) && (n2 = ["resource", "home"]), e2.replace(/XXX/, n2.pop());
}
function w(e2) {
  return !(!e2.startsWith("192.168.") && "127.0.0.1" !== e2 && "::1" !== e2 && "0:0:0:0:0:0:0:1" !== e2 && "localhost" !== e2);
}
function A(e2, t2 = 80, n2 = "↩") {
  if (!e2 || e2.length < t2) return "" + e2;
  let r2 = 0, o2 = [];
  for (; r2 <= e2.length; ) r2 + t2 > e2.length ? o2.push(e2.substring(r2, r2 + t2)) : o2.push(e2.substring(r2, r2 + t2) + n2), r2 += t2;
  return o2.join("\n");
}
function S(e2) {
  const t2 = /^[0-9]{1,3}$/;
  return Array.from(e2.matchAll(/[^ \t\n\r.(),~]+/g)).filter((e3) => !("" === e3[0] || e3[0].match(t2))).length;
}
function L(e2) {
  let t2 = String(e2);
  if (0 === e2 || e2 < 1) throw new Error("Value passed must be a counting number above 0");
  return 1 === t2.length && (t2 = "0" + t2), t2;
}
function R(e2) {
  if (["1", 1, "true", "TRUE", "on", "ON", "yes", "YES", "✔", "✓"].includes(e2)) return true;
  if (["0", 0, "false", "FALSE", "off", "OFF", "no", "NO", "🗙", "✕", "✖", "✖", "✗", "✘"].includes(e2)) return false;
  throw new Error("Unknown data " + e2);
}
function E(e2, t2, n2 = true) {
  let r2 = "";
  if (r2 = Number(e2) === e2 && e2 % 1 == 0 ? 0 === e2 ? "[No date]" : e2 < 1e10 ? new Date(1e3 * e2) : new Date(e2) : t2, "string" != typeof r2) {
    const e3 = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let t3;
    t3 = r2.getHours() ? L(r2.getHours()) : "00", r2 = " " + L(r2.getDate()) + "-" + (n2 ? e3[r2.getMonth() + 1] : L(r2.getMonth() + 1)) + "-" + r2.getUTCFullYear() + " " + (n2 ? "" : t3 + ":00");
  }
  return r2;
}
function v(e2, n2, r2) {
  try {
    if (null === r2) throw new Error("Oh no! No DOM object!!");
    const t2 = r2.createElement("template");
    if (t2.innerHTML = n2, "string" == typeof e2) {
      const n3 = r2.querySelector(e2);
      if (null === n3) throw new Error("Oh no! DOM element not found: " + e2);
      return n3.append(t2.content);
    }
    return e2.append(t2.content);
  } catch (e3) {
    t("error", e3.toString()), window.noop++;
  }
}
function k(e2) {
  if (void 0 === e2) return false;
  const t2 = e2.getComputedStyle.toString().includes("[native code]");
  return !("boolean" != typeof t2 || !t2);
}
function q(e2, t2, n2) {
  var r2 = false;
  try {
    e2.createEvent("TouchEvent"), r2 = true;
  } catch (e3) {
    n2.noop++;
  }
  return !(!(t2 && "Gecko" === t2.product && t2.maxTouchPoints > 0) || r2) && (console.warn("Is this librewolf?, could tell me if this is wrong."), e2.body.classList.contains("IAmLibreWolf") || (e2.body.classList.add("IAmLibreWolf"), e2.querySelector('.fullWidth p[role="status"]').innerText += "  Is this librewolf?,  could you tell me if this is wrong."), true);
}
function T(e2, n2, r2) {
  try {
    if (!k(r2)) return -1;
    return e2.getBoundingClientRect()[n2];
  } catch (e3) {
    return t("error", "Missing data:" + e3.message), -1;
  }
}
function x(e2, t2) {
  const n2 = e2.getBoundingClientRect();
  return [Math.round(t2.scrollY + n2.top), Math.round(t2.scrollX + n2.left)];
}
async function O(e2, n2, r2) {
  try {
    if (!r2.navigator.clipboard) throw new Error("No clipboard available");
    await r2.navigator.clipboard.writeText(n2.href);
  } catch (e3) {
    t("error", "FAILED: copy URL feature borked " + e3.message + "\nIt will fail on a HTTP site.");
  }
}
function C(e2 = 1040, t2, n2, r2) {
  if (t2.querySelector(".maquetteContainer") && function(e3, t3) {
    const n3 = new URLSearchParams(e3.search);
    if (n3.has("width")) return parseInt(n3.get("width") ?? "", 10);
    return t3.innerWidth;
  }(n2, r2) > e2) {
    const e3 = Array.from(t2.querySelectorAll(".maquetteContainer details"));
    for (let t3 = 0; t3 < e3.length; t3++) e3[t3].classList.contains("singlePopup") || e3[t3].classList.contains("screenDocs") || (e3[t3].open = true);
  }
}
function N(e2, t2, n2) {
  const r2 = new URLSearchParams(t2.search);
  try {
    e2.createEvent("TouchEvent");
    if (r2.has("mobile")) return R(r2.get("mobile") ?? "");
    let t3 = d;
    return q(e2, n2.navigator, n2) && (t3 = 1.11 * d), X(e2, n2) > t3;
  } catch (e3) {
    return !(!r2.has("mobile") || !R(r2.get("mobile") ?? ""));
  }
}
function X(e2, n2) {
  try {
    const t2 = e2.createElement("div");
    t2.setAttribute("style", "width:1in;"), e2.body.appendChild(t2);
    const r2 = t2.offsetWidth * n2.devicePixelRatio;
    return t2.remove(), r2;
  } catch (e3) {
    return t("error", "ERROR " + e3.toString()), -1;
  }
}
function M(e2, t2) {
  const n2 = e2.documentElement, r2 = e2.body, o2 = t2.innerWidth || n2.clientWidth || r2.clientWidth, a2 = t2.innerHeight || n2.clientHeight || r2.clientHeight;
  let i2 = 0, s2 = 0;
  return s2 = "string" == typeof a2 ? parseInt(a2, 10) : a2, i2 = "string" == typeof o2 ? parseInt(o2, 10) : o2, [i2, s2];
}
"object" != typeof window || "noop" in window || (window.noop = 0);
let U = { name: "", meta: "", perRow: 10, titleLimit: 40, rendered: false, iteration: 0, group: "system", count: 1, debug: true, runFetch: p };
function j(e2, t2, n2, r2 = true) {
  let o2 = "", a2 = n2.pathname.split("/").pop();
  const i2 = new URLSearchParams(n2.search);
  return "group-XXX" === a2 && i2.has("first") && (a2 = i2.get("first") ?? "logic-error"), t2 ? i2.has("first") ? o2 += n2.pathname.replace("group-XXX", a2 + "-meta") : o2 += n2.pathname.replace(a2, e2 + "-meta") : o2 += n2.pathname.replace(a2, e2), r2 && (o2 += n2.search + n2.hash), o2;
}
function I(e2, t2) {
  let n2 = "button";
  return e2 && (n2 += " lower"), n2;
}
function P(e2, t2) {
  return t2 + "" + e2.replace(/[^a-zA-Z0-9_]/g, "_");
}
function W(e2) {
  let t2 = e2;
  return e2.lastIndexOf("#") > 0 && (t2 = e2.substring(0, e2.lastIndexOf("#"))), e2.lastIndexOf("?") > 0 && (t2 = e2.substring(0, e2.lastIndexOf("?"))), t2.split("/").pop() ?? "";
}
function F(e2) {
  let t2 = U.group;
  if ("XXX" === U.group) {
    const n2 = new URLSearchParams(e2.search);
    n2.has("first") && (t2 = n2.get("first"));
  }
  if ("XXX" === t2) throw new Error("Thou shalt supply the group somewhere");
  return t2;
}
function D(e2, t2, n2, r2, o2) {
  return U.name === "group-" + U.group || (t2 === e2 && (o2 = r2), r2 > 0 && o2 > 0 && n2 > 0 && r2 >= n2 - 1 && (r2 = 0)), [o2, n2, r2];
}
async function H(n2, r2, o2, a2) {
  if (U = Object.assign(U, { name: y(o2), meta: j(U.group, ".json", o2, false), debug: e(o2), runFetch: p }, n2), "system" === U.group) throw new Error("Must set the article group, and not to 'system'.");
  U.meta = j(U.group, ".json", o2, false);
  const i2 = "group-XXX" === U.name || U.name === "group-" + U.group, s2 = "group" + U.group;
  if (N(r2, o2, a2) && !i2) 1 === r2.querySelectorAll(".adjacentWidget .adjacentItem").length && (r2.querySelector(".adjacentWidget p").style.display = "none"), v("#" + s2, "<p>As mobile View, use the full page link to the left</p>", r2);
  else {
    const e2 = await U.runFetch(U.meta, true, o2);
    if (!("ok" in e2) || !e2.ok || !Array.isArray(e2.body)) return t("info", "There doesn't seem to be a group meta data file."), void v("#" + s2, "<p>Internal error. Hopefully this will be fixed shortly. </p>", r2);
    if (i2) {
      const t2 = function(e3, t3, n3, r3, o3) {
        let a3 = "";
        for (const i3 in e3) {
          const s3 = P(i3, t3), l2 = N(n3, r3, o3) ? "<br />" : "";
          let c2 = e3[i3].desc;
          c2.length > 235 && (c2 = c2.substr(0, 235) + "..."), a3 += '<a class="adjacentItem" href="' + e3[i3].url + '" title="' + c2 + '"> <span class="button">' + e3[i3].title + '</span><p id="adjacent' + s3 + '" >Author: ' + e3[i3].auth + " &nbsp; &nbsp; &nbsp;" + l2 + "  Last edit: " + E(e3[i3].date, "Unknown time", true) + " <br />Description: " + c2 + " </p></a>\n";
        }
        return a3;
      }(e2.body, s2, r2, o2, a2);
      v("#groupXXX", t2, r2), function(e3, t3) {
        const n3 = Array.from(t3.querySelectorAll(".top-bar.fullWidth header h1"));
        n3.length && n3[0].textContent && (n3[0].textContent.includes("whatsmyname") || n3[0].textContent.includes("XXX")) && (n3[0].textContent = "Group " + e3);
        const r3 = Array.from(t3.querySelectorAll(".adjacentWidget p"));
        r3.length && r3[0].textContent && r3[0].textContent.includes("XXX") && (r3[0].textContent = "Some similar articles in " + e3);
      }(F(o2), r2);
    } else {
      const t2 = function(e3) {
        let t3 = -1, n3 = U.perRow, r3 = [], o3 = 0, a3 = 0;
        for ([t3, n3, o3] = D(W(e3[0].url), U.name, e3.length, o3, t3); o3 < e3.length; o3++) {
          const i3 = e3[o3].title;
          if (i3 && t3 >= 0 && n3 > 0) {
            r3[a3] = { auth: e3[o3].auth, date: E(e3[o3].date, "[Unknown time]", true), url: e3[o3].url, offset: o3, title: e3[o3].title.substr(0, U.titleLimit), desc: e3[o3].desc }, i3.length > U.titleLimit && (r3[a3].title += "...");
            const t4 = e3[o3].desc;
            t4.length > 235 && (r3[a3].desc = t4.substr(0, 235) + "..."), n3--, a3++;
          }
          if ([t3, n3, o3] = D(W(e3[o3].url), U.name, n3, o3, t3), r3.length === e3.length) break;
          if (r3.length >= U.perRow) break;
        }
        return r3;
      }(e2.body);
      v("#" + s2, function(e3, t3) {
        let n3 = '<ul class="adjacentList">\n';
        for (const r3 in e3) {
          const o3 = P(r3, t3), a3 = I(e3[r3].desc.length > 110), i3 = "Title: " + e3[r3].title + "\nAuthor: " + e3[r3].auth + " &nbsp; &nbsp; Last edit: " + e3[r3].date + "\nDescription: " + e3[r3].desc;
          n3 += '<li> <a id="link' + o3 + '" class="' + a3 + '" href="' + e3[r3].url + '" aria-label="' + i3 + '" >' + e3[r3].title + "</a> </li>\n";
        }
        return 0 === e3.length ? n3 += "<li> Article doesn't seem setup correctly.</li></ul>" : n3 += '<li><a class="adjacentItem button" href="/resource/group-XXX?first=' + t3 + '" aria-label="This article lists all items in ' + t3 + ' group."> See full list </a></li></ul>', n3;
      }(t2, F(o2)), r2);
    }
  }
}
function B(e2, t2, n2, r2) {
  if (!w(n2.host) && !N(t2, n2, r2)) return false;
  const o2 = t2.querySelector("#shareMenu");
  return o2 && !o2.classList.replace("mobilePopupWidgetOpen", "mobilePopupWidget") && o2.classList.replace("mobilePopupWidget", "mobilePopupWidgetOpen"), false;
}
function J(e2, n2, r2, o2) {
  const a2 = n2.querySelector("#mastodonserver");
  let i2 = a2.value;
  const s2 = a2.getAttribute("data-url");
  if ("" === i2 || null === i2) return false;
  if (i2 = "https://" + i2 + "/share?text=I+think+this+is+important+" + s2, t("info", "Trying to open mastodon server, " + i2), !k(o2)) throw Error("Test passed, for " + i2);
  return n2.querySelector("#popup").close(), o2.open(i2, "_blank"), N(n2, r2, o2) && B(0, n2, r2, o2), false;
}
function _(e2, t2, n2) {
  let r2 = e2.querySelector("#navBar #mastoTrigger");
  if (!r2) return;
  if (K(r2, G, e2, n2), r2 = e2.querySelector("#shareGroup .SMshareWidget #mastoTrigger"), r2) {
    const t3 = function(e3, t4 = "display", n3 = window) {
      let r3 = "";
      e3 && e3.computedStyleMap ? r3 = e3.computedStyleMap()[t4] : e3 && (r3 = n3.getComputedStyle(e3, null).getPropertyValue(t4));
      return r3;
    }(r2, "display", n2);
    t3 && "none" !== t3 && (r2.addEventListener("click", (t4) => G(t4, e2, n2)), r2.addEventListener("keypress", (t4) => G(t4, e2, n2)));
  }
  r2 = e2.querySelector("#copyURL"), r2 && function(e3, t3, n3, r3, o3) {
    e3.addEventListener("click", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("touch", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("keypress", async (e4) => (await t3(n3, r3, o3), false));
  }(r2, O, e2, t2, n2), Y(e2.querySelector("#popup #sendMasto"), J, e2, t2, n2);
  const o2 = Array.from(e2.querySelectorAll("#shareMenuTrigger, #shareClose"));
  for (const r3 in o2) Y(o2[r3], B, e2, t2, n2);
  K(e2.querySelector("#hideMasto"), $, e2, n2);
}
function G(e2, t2, n2) {
  return k(n2) && t2.querySelector("#popup").showModal(), t2.querySelector("#popup input").focus(), false;
}
function $(e2, t2, n2) {
  return k(n2) && t2.querySelector("#popup").close(), false;
}
function K(e2, t2, n2, r2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2), false));
}
function Y(e2, t2, n2, r2, o2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2, o2), false));
}
function V(e2, n2) {
  let r2 = null, o2 = "";
  if ("string" == typeof e2) {
    o2 = e2;
    const a3 = n2.querySelector(e2);
    if (!a3 || "SECTION" !== a3.tagName) throw t("error", "what is this? ", a3.outerHTML, a3.tagName), new Error("Bad call");
    r2 = n2.querySelector('.tabList a[href="' + e2 + '"] ');
  } else {
    const t2 = e2.target;
    r2 = n2.querySelector("#" + t2.id), o2 = "" + r2.getAttribute("href");
  }
  if (!o2) return void t("ERROR", "Malconfigured tabs!! " + e2 + " => '" + o2 + "' matches nothing");
  const a2 = Array.from(n2.querySelectorAll(".tab-title"));
  for (let e3 = 0; e3 < a2.length; e3++) a2[e3].classList.remove("is-active");
  const i2 = Array.from(n2.querySelectorAll(".tab-title>a"));
  for (let e3 = 0; e3 < i2.length; e3++) i2[e3].setAttribute("aria-hidden", "true");
  const s2 = Array.from(n2.querySelectorAll(".tabs-content .tabs-panel"));
  for (let e3 = 0; e3 < s2.length; e3++) s2[e3].classList.remove("is-active"), s2[e3].setAttribute("aria-hidden", "true");
  const [l2] = Array.from(n2.querySelectorAll(".tabs-content " + o2));
  l2.classList.add("is-active"), l2.setAttribute("aria-hidden", "false");
  r2.parentNode.classList.add("is-active"), r2.setAttribute("aria-hidden", "false");
}
let z = { referencesCache: "/resource/XXX-references", gainingElement: "#biblio", losingElement: ".addReferences", renumber: 1, forceToEnd: 1, maxDescripLen: 230, maxAuthLen: 65, debug: true, runFetch: p };
async function Q(n2, r2, a2) {
  if (z = Object.assign(z, { debug: e(a2) }, n2), 0 === r2.querySelectorAll(i).length) return void t("info", "URL '" + a2.pathname + "' isn't marked-up for references, so skipped");
  const s2 = r2.querySelector("#biblio");
  s2 && s2.setAttribute("style", ""), r2.querySelector(z.gainingElement + " *").replaceChildren(), v(z.gainingElement, '<h2 class="biblioSection">References (for mobile UI)</h2> \n<p>The references embedded in the text are displayed here. </p>', r2);
  const l2 = await z.runFetch(b(z.referencesCache, a2), true, a2);
  if (l2.ok && Array.isArray(l2.body)) {
    const e2 = function(e3) {
      let t2 = '<aside role="footnote"><ol class="mobileBiblio">';
      for (const n3 in e3) t2 += `<li>
<a href="${e3[n3].url}"> 
<h5>${e3[n3].title}</h5>
<span>${e3[n3].desc}</span>
<span>by ${e3[n3].auth} on ${e3[n3].date}</span>
</a>
</li>
`;
      return t2 += "</ol></aside>", t2;
    }(function(e3) {
      const t2 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n3 = [];
      for (const r3 in e3) {
        if (null === e3[r3]) {
          n3.push({ auth: "[No author]", date: "[No date]", desc: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", offset: parseInt(r3, 10), title: "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.", url: o });
          continue;
        }
        const a3 = E(e3[r3].date, t2[2], true);
        let i2 = e3[r3].title + "";
        i2 = i2.replace(".", ".  ");
        let s3 = e3[r3].desc + "";
        s3.length > z.maxDescripLen && (s3 = s3.substring(0, z.maxDescripLen));
        let l3 = e3[r3].auth || t2[0];
        "unknown" === e3[r3].auth && (l3 = t2[0]), l3.length > z.maxAuthLen && (l3 = l3.substring(0, z.maxAuthLen)), n3.push({ auth: l3, date: a3, desc: s3, offset: parseInt(r3, 10), title: i2, url: e3[r3].url });
      }
      return n3;
    }(l2.body));
    !function(e3, t2) {
      if (!z.renumber) return;
      const n3 = Array.from(t2.querySelectorAll(z.losingElement + " sup a"));
      for (let e4 = 0; e4 < n3.length; e4++) n3[e4].textContent = "" + (e4 + 1), z.forceToEnd && (n3[e4].href = "#biblio");
    }(l2.body, r2), v(z.gainingElement, e2, r2);
  } else {
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    v(z.gainingElement, e2, r2), t("warn", "Unable to get meta data " + b(z.referencesCache, a2), JSON.stringify(Array.from(l2.headers.entries())));
  }
}
let Z = { indexUpdated: 0, gainingElement: "#biblio", referencesCache: "/resource/XXX-references", renumber: 1, maxAuthLen: 65, debug: true, runFetch: p };
function ee(e2) {
  const t2 = "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.";
  return "Reference popup for link [" + (e2 + 1) + "]\n\nHTTP_ERROR, Site admin: recompile this meta file, as this is a new link.\n " + E(+/* @__PURE__ */ new Date("07-June-2024"), "not used", true) + "\n\n" + t2;
}
function te(e2, t2) {
  if (null === e2) return;
  const n2 = T(e2, "left", t2), r2 = T(e2, "top", t2);
  if (-1 === n2 && -1 === r2) return;
  let o2 = e2.parentNode;
  const a2 = ["LI", "SUP", "UL", "OL", "SPAN", "P"];
  for (; a2.includes(o2.tagName); ) o2 = o2.parentNode;
  const i2 = Math.round(T(o2, "left", t2)), s2 = Math.round(T(o2, "top", t2)), l2 = Math.round(T(o2, "width", t2)), u2 = 30 * c, d2 = 5 * c;
  l2 < 650 ? e2.classList.add("leanCentre") : (n2 > i2 + l2 - u2 && e2.classList.add("leanLeft"), n2 < i2 + u2 && e2.classList.add("leanRight"), e2.classList.contains("leanRight") && e2.classList.contains("leanLeft") && (e2.classList.remove("leanRight"), e2.classList.remove("leanLeft"), e2.classList.add("leanCentre")));
  r2 < s2 - d2 && e2.classList.add("leanDown"), r2 > s2 + Math.round(T(o2, "height", t2)) && e2.classList.add("leanUp");
}
async function ne(n2, r2, o2, a2) {
  if (Z = Object.assign(Z, { debug: e(o2) }, n2), 0 === r2.querySelectorAll(i).length) return void t("info", "This URL '" + o2.pathname + "' isn't marked-up for references, so skipped");
  const l2 = await Z.runFetch(b(Z.referencesCache, o2), true, o2);
  if (l2.ok && Array.isArray(l2.body)) {
    if (r2.querySelectorAll(s).length < l2.body.length) throw new Error("Recompile the meta data for  " + o2.pathname);
    const e2 = r2.querySelector("#biblio");
    e2 && e2.setAttribute("style", ""), function(e3, t3) {
      let n3 = e3.headers.get("last-modified");
      if (!n3) return;
      n3.indexOf("BST") > 0 && (n3 = n3.substring(0, n3.length - 4));
      const r3 = new Date(n3).getTime();
      r3 > 0 && v(".addReading .ultraSkinny", '<span>Links <time datetime="' + r3 + '" title="When this was last recompiled' + new Date(r3).toLocaleDateString("en-GB", { hour12: false, dateStyle: "medium" }) + '">' + new Date(r3).toLocaleDateString("en-GB", { hour12: false, dateStyle: "medium" }) + "</time> </span>", t3);
    }(l2, r2);
    const t2 = function(e3) {
      const t3 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n3 = [];
      for (let r3 = 0; r3 < e3.length; r3++) {
        if (null === e3[r3]) {
          n3.push(ee(r3));
          continue;
        }
        const o3 = E(e3[r3].date, t3[2], true);
        let a3 = e3[r3].title + "", i2 = e3[r3].desc;
        i2 = A(i2, 80), a3 = a3.replace(".", ". "), a3 = A(a3, 80);
        let s2 = e3[r3].auth || t3[0];
        "unknown" === e3[r3].auth && (s2 = t3[0]), s2.length > Z.maxAuthLen && (s2 = s2.substring(0, Z.maxAuthLen)), n3.push("Reference popup for link [" + (r3 + 1) + "]\n\n" + a3 + "\n" + s2 + " " + o3 + "\n\n" + i2);
      }
      return n3;
    }(l2.body);
    !function(e3, t3, n3) {
      let r3 = 1;
      const o3 = Array.from(t3.querySelectorAll(s));
      if (e3.length > o3.length) throw t3.querySelector(i).classList.add(u), t3.querySelector("p[role=status]").textContent += " Recompile meta data. ", new Error("Too many references in meta-data for this article, pls recompile.");
      for (let t4 = 0; t4 < e3.length; t4++) o3[t4].setAttribute("aria-label", "" + e3[t4]), te(o3[t4], n3), Z.renumber && (o3[t4].textContent = "" + r3), r3++;
      if (o3.length > e3.length) {
        t3.querySelector("p[role=status]").textContent += "Recompile meta data";
        let r4 = e3.length;
        for (; r4 < o3.length; ) {
          const e4 = ee(r4);
          o3[r4].setAttribute("aria-label", "" + e4), te(o3[r4], n3), Z.renumber && (o3[r4].textContent = "" + (r4 + 1)), r4++;
        }
      }
    }(t2, r2, a2), r2.querySelector(i).classList.add(u);
  } else {
    !function(e3, t2) {
      const n3 = y(t2), r3 = e3.querySelector("p[role=status]");
      r3 && !r3.innerText.match(/ERROR: No valid references file found/) && (r3.innerText += "ERROR: No valid references file found.");
      const o3 = Array.from(e3.querySelectorAll(s));
      for (let e4 = 0; e4 < o3.length; e4++) {
        const t3 = `Reference popup for link [${1 + e4}]
ERROR: No valid references file found.
site admin, today
HTTP_ERROR, no valid file called ${n3}-references.json found.
`;
        o3[e4].setAttribute("aria-label", "" + t3);
      }
      e3.querySelector(i).classList.add(u);
    }(r2, o2);
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    v(Z.gainingElement, e2, r2), t("warn", "Unable to get meta data " + b(Z.referencesCache, o2), JSON.stringify(Array.from(l2.headers.entries())));
  }
}
function re(e2, t2, n2) {
  t2.querySelectorAll("article a").forEach(function(r2) {
    "git" === m(r2).trim().toLowerCase() && (r2.textContent = "", v(r2, '<i class="fa fa-github" aria-hidden="true"></i> \n		 <span class="sr-only">git</span>', t2), e2 ? (r2.setAttribute("aria-label", function(e3) {
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
    n2 += S(m(e3));
  }), n2;
}
function ae(e2, t2) {
  switch (e2.tagName) {
    case "IMG":
      return e2.getAttribute("src");
    case "OBJECT":
      return e2.getAttribute("data");
    case "SOURCE":
      return e2.getAttribute("srcset");
    default:
      throw new Error("Unknown element, " + e2.tagName);
  }
}
function ie(e2, t2) {
  const n2 = e2.target, r2 = function(e3, t3) {
    if (e3.tagName === t3) return e3;
    for (; e3.tagName !== t3; ) {
      if ("A" === e3.tagName) return e3;
      if ("BODY" === e3.tagName) return;
      if (e3.classList.contains("maquette")) return;
      e3 = e3.parentElement;
    }
    return e3;
  }(n2, "DETAILS");
  if (r2 && "A" === r2.tagName) return true;
  if (r2) {
    const t3 = r2;
    if (e2.preventDefault(), e2.stopPropagation(), t3 && t3.open) {
      if ("SUMMARY" !== n2.tagName && null !== t3.querySelector("code")) return false;
      t3.open = false;
    } else t3.open = true;
  } else {
    const n3 = t2.querySelector("details[open]");
    if (!n3) return true;
    e2.preventDefault(), e2.stopPropagation(), n3.open = false;
  }
  return false;
}
function se(e2) {
  const n2 = Array.from(e2.querySelectorAll(".popOverWidget details"));
  n2.length && (t("info", "Modal widget found, extra UI features added"), n2.forEach(function(t2) {
    t2.addEventListener("click", function(t3) {
      return ie(t3, e2);
    });
  }), e2.body.addEventListener("click", function(t2) {
    return ie(t2, e2);
  }), e2.body.addEventListener("keydown", function(t2) {
    return function(e3, t3) {
      if ("Escape" === e3.code || "Escape" === e3.key) {
        const n3 = Array.from(t3.querySelectorAll("details[open]"));
        if (n3.length) for (let e4 = 0; e4 < n3.length; e4++) n3[e4].open = false;
        return e3.preventDefault(), false;
      }
      return true;
    }(t2, e2);
  }));
}
let le = { pageInitRun: 0 };
function ce() {
  return le.pageInitRun;
}
if (await async function(n2, o2, a2, i2) {
  le = Object.assign(le, {}, n2);
  const s2 = e(a2);
  if (le.pageInitRun) return void t("warn", "Extra panda should not be run more than once per page");
  le.pageInitRun = 1;
  const c2 = Array.from(o2.querySelectorAll(".noJS"));
  for (let e2 = 0; e2 < c2.length; e2++) c2[e2].classList.remove("noJS");
  !function(e2, t2) {
    e2.querySelector("body").setAttribute("style", "--offset-height: 0;");
    const n3 = Array.from(e2.querySelectorAll(".lotsOfWords, .halferWords, .fewWords"));
    for (let e3 = 0; e3 < n3.length; e3++) n3[e3].setAttribute("style", "--offset-height: " + x(n3[e3], t2)[0] + "px;");
  }(o2, i2), function(t2, n3, r2) {
    const o3 = N(t2, n3, r2);
    if (!w(n3.host) && !o3) return;
    if (q(t2, r2.navigator, r2) && !o3) return;
    o3 && (t2.querySelector("#sendMasto").textContent = "Share article");
    const a3 = ['<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>'], i3 = ["shareMenuTrigger", "siteChartLink", "rssLink"], s3 = Array.from(t2.querySelectorAll(".SMshareWidget a")), l2 = !w(n3.host) && !e(n3), c3 = t2.querySelector(".SMshareWidget");
    for (const e2 in s3) {
      if (i3.includes(s3[e2].id)) continue;
      const t3 = s3[e2].cloneNode(true);
      l2 && c3.removeChild(s3[e2]), t3.classList.remove("bigScreenOnly"), a3.push("<li>"), a3.push(t3.outerHTML), a3.push("</li>"), s3[e2].getAttribute("id") && s3[e2].setAttribute("id", "old" + s3[e2].getAttribute("id"));
    }
    a3.unshift('<nav class="mobilePopupWidget" id="mobileMenu"> <menu>'), a3.push("</menu></nav>"), v("#navBar", a3.join("\n"), t2);
  }(o2, a2, i2), _(o2, a2, i2);
  const u2 = null !== o2.querySelector(".addReferences");
  if (re(u2, o2, i2), function(e2, t2, n3) {
    t2.querySelectorAll("article a").forEach(function(r2) {
      "docs" === m(r2).trim().toLowerCase() && (r2.textContent = "", v(r2, '<i class="fa fa-book-open" aria-hidden="true"></i>\n		 <span class="sr-only">docs</span>', t2), r2.setAttribute(e2 ? "aria-label" : "title", "Link to the project docs; it may be a git page, or a separate webpage. "), e2 && te(r2, n3));
    });
  }(u2, o2, i2), function(e2) {
    const t2 = Array.from(e2.querySelectorAll(".addArrow"));
    for (let n3 = 0; n3 < t2.length; n3++) v(t2[n3].parentElement, '<i class="fa fa-play specialPointer" aria-hidden="true"></i>', e2);
  }(o2), function(e2) {
    const t2 = new RegExp("`([^`]+)`", "g"), n3 = new RegExp("/ /", "g"), r2 = Array.from(e2.querySelectorAll(".addBashSamples"));
    if (r2.length > 0) for (let e3 = 0; e3 < r2.length; e3++) r2[e3].innerHTML = r2[e3].innerHTML.replaceAll(t2, '<code class="bashSample" title="Quote from a bash; will add copy button">$1</code>').replaceAll(n3, "//");
  }(o2), function(e2) {
    const t2 = g().get(l);
    if (!t2) return;
    const n3 = JSON.parse(t2);
    if (n3.ft = n3.ft.replaceAll("%38", ";"), n3.cr = n3.cr.replaceAll("%38", ";"), n3.dn = n3.dn.replaceAll("%38", ";"), n3.fs = n3.fs.replaceAll("%38", ";"), !n3.ft || !n3.fs) return;
    const r2 = "body, .annoyingBody { font-family: " + n3.ft + "; font-size: " + n3.fs + "; direction:" + n3.dn + "; }", o3 = e2.createElement("style");
    o3.setAttribute("id", "client-set-css"), o3.innerText = r2, e2.getElementsByTagName("head")[0].append(o3);
  }(o2), se(o2), C(1040, o2, a2, i2), q(o2, i2.navigator, i2), !N(o2, a2, i2) && "/resource/home" !== a2.pathname && o2.querySelectorAll(".reading").length < 2 && function(n3, r2, o3) {
    const a3 = Object.assign({}, { timeFormat: "m", dataLocation: ".blocker", target: "#shareGroup .SMshareWidget", wordPerMin: 275, codeSelector: "code", refresh: false, debug: e(o3) }, n3), i3 = a3.dataLocation + " img, " + a3.dataLocation + " source, " + a3.dataLocation + " object", s3 = oe(a3.dataLocation, r2);
    if (!s3) return;
    let l2 = 0;
    a3.codeSelector && (l2 += oe(a3.codeSelector, r2));
    let c3 = s3 - l2 + 2 * l2;
    if (c3 += 5 * Array.from(new Set(Array.from(r2.querySelectorAll(i3)).map(ae))).length, c3 = Math.ceil(c3 / a3.wordPerMin), c3 < 1) return void t("info", "No reading time displayed for this article");
    if (a3.refresh) {
      const e2 = r2.querySelector(a3.target + " a.reading");
      e2 && e2.parentNode.removeChild(e2);
    }
    c3 = Math.round(c3);
    const u3 = '<a class="reading" title="The text is ' + (l2 + s3) + ' normalised words long.  Link is a longer version of this reading guide guesstimate." href="/resource/jQuery-reading-duration">To read: ' + c3 + a3.timeFormat + "</a>";
    v(a3.target, u3, r2);
  }({ dataLocation: "#main", target: ".addReading .SMshareWidget", debug: s2, refresh: true }, o2, a2), r("1.0.4") ? function(e2, n3) {
    if (!n3.hash) return;
    const r2 = e2.querySelector(n3.hash);
    r2 && "INPUT" === r2.tagName ? r2.checked = true : t("error", "tabInit v4: failed to find " + n3.hash + " element");
  }(o2, a2) : function(e2, t2) {
    const n3 = e2.querySelectorAll(".tabComponent");
    for (let t3 = 0; t3 < n3.length; t3++) {
      const a3 = Array.from(n3[t3].querySelectorAll(".tab-title a"));
      for (let t4 = 0; t4 < a3.length; t4++) o3 = (t5) => {
        V(t5, e2);
      }, (r2 = a3[t4]).addEventListener("click", o3), r2.addEventListener("touch", o3), r2.addEventListener("keypress", o3);
    }
    var r2, o3;
    "" !== t2.hash && V(t2.hash, e2);
  }(o2, a2), a2.pathname.match("group-")) {
    const e2 = function(e3, t2) {
      const n3 = t2.pathname.split("/group-");
      if (Array.isArray(n3) && n3.length > 1 && "XXX" !== n3[1]) return n3[1];
      const r2 = new URLSearchParams(t2.search);
      if (r2.has("first")) return r2.get("first") ?? "";
      if (e3 && e3.getAttribute("data-group")) {
        let t3 = e3.getAttribute("data-group") ?? "";
        return t3 = t3.trim(), t3.split(",").map((e4, t4) => e4.trim())[0];
      }
      throw new Error("KLAXON, KLAXON, I do not know how to build an adjacent list for " + t2.href);
    }(null, a2);
    e2 && await H({ group: e2, debug: s2, runFetch: "adjacentRunFetch" in le ? le.adjacentRunFetch : p }, o2, a2, i2);
  } else {
    N(o2, a2, i2) ? await Q({ debug: s2, renumber: 1, runFetch: "mobileRunFetch" in le ? le.mobileRunFetch : p }, o2, a2) : await ne({ debug: s2, renumber: 1, runFetch: "desktopRunFetch" in le ? le.desktopRunFetch : p }, o2, a2, i2);
    const e2 = function(e3, t2 = document) {
      const n3 = t2.querySelector(e3);
      if (!n3) return [];
      const r2 = n3.getAttribute("data-group");
      if (!r2) return [];
      let o3 = r2.split(",");
      return o3 = o3.map((e4, t3) => e4.trim()), "XXX" === o3[0] && o3.shift(), [...o3];
    }("div#contentGroup", o2);
    if (0 === e2.length) t("info", "This URL '" + a2.pathname + "' has no Adjacent groups defined.");
    else for (let t2 = 0; t2 < e2.length; t2++) await H({ group: e2[t2], debug: s2, iteration: t2, count: e2.length, runFetch: "adjacentRunFetch" in le ? le.adjacentRunFetch : p }, o2, a2, i2);
  }
  e(a2, "select") && (t("info", "select and word count feature is ENABLED.  Access= <alt> + w"), o2.body.addEventListener("keydown", (e2) => {
    "w" === e2.key && e2.altKey && t("info", "Word count of selection: " + S(function(e3) {
      try {
        const t2 = e3.getSelection();
        if (null === t2) return "";
        const n3 = t2.getRangeAt(0);
        return n3.startOffset === n3.endOffset ? "" : "" + n3.cloneContents().textContent;
      } catch (e4) {
        return t("warn", "Unable to get data for selection", e4.message), "";
      }
    }(i2)));
  })), "undefined" != typeof document && "function" == typeof document.pageStartup ? document.pageStartup() : t("info", "No article specific scripting found, (it may load manually ATF)");
}({}, document, location, window), r("1.test-only")) {
  const { generate_CSS_file: e2, dump_it: t2 } = await import("./index-PRwdYPwj.js");
  let n2 = new URLSearchParams(location.search);
  n2.has("dump-css") && (console.log("Open tools now"), await async function(e3) {
    return new Promise((t3, n3) => setTimeout(t3, e3));
  }(5e3), t2(await e2(document, window), parseInt(n2.get("dump-css"), 10), n2.get("aspect") ?? "(width:100%)"));
}
export {
  n as SELF_VERSION,
  v as appendIsland,
  X as calcScreenDPI,
  M as currentSize,
  a as domLog,
  ce as hasBeenRun,
  N as isMobile,
  t as log,
  p as runFetch,
  h as storeAppearance
};
