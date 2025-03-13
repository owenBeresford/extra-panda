function e(e2, t2 = "debug") {
  return new URLSearchParams(e2.search).has(t2);
}
let t = console;
function n(e2, ...n2) {
  t.LOG_USAGE++, e2 in console ? t[e2](`[${e2.toUpperCase()}] ${n2.join(", ")}`) : t.log(`[${e2.toUpperCase()}] ${n2.join(", ")}`);
}
const r = "1.0.4", o = "https://owenberesford.me.uk/", i = ".addReferences", a = i + " sup a", s = "appearance", l = 16, c = "showBiblioErrors", u = 180;
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
  const o2 = h();
  e2 = e2.replaceAll(";", "%38"), r2 = r2.replaceAll(";", "%38"), n2 = n2.replaceAll(";", "%38"), t2 = t2.replaceAll(";", "%38");
  const i2 = JSON.stringify({ ft: e2, fs: t2, dn: n2, cr: r2 });
  o2.set(s, i2, 365.254);
}
async function p(t2, r2, o2) {
  const i2 = function() {
    if ("undefined" != typeof window)
      return window.fetch;
    if ("function" == typeof fetch)
      return fetch;
    throw n("error", "Please stop using old versions of node."), new Error("Please stop using old versions of Node");
  }(), a2 = e(o2);
  try {
    const e2 = await i2(t2, { credentials: "same-origin" });
    if (!e2.ok) {
      if (a2 && n("warn", "Failed to communicate with " + t2), r2)
        return { body: "nothing", headers: {}, ok: false };
      throw new Error("ERROR getting asset " + t2);
    }
    if (404 === e2.status)
      throw new Error("got HTTP 404");
    let o3 = "";
    return o3 = e2.headers.get("content-type").toLowerCase().startsWith("application/json") ? await e2.json() : await e2.text(), a2 && n("info", "Successful JSON transaction " + t2), { body: o3, headers: e2.headers, ok: true };
  } catch (e2) {
    if (a2 && n("error", "KLAXON, KLAXON failed: " + t2 + " " + e2.toString()), r2)
      return { body: "nothing", headers: {}, ok: false };
    throw new Error("ERROR getting asset " + t2 + " " + e2.toString());
  }
}
function h() {
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
function b(e2, t2) {
  let n2 = [];
  return n2 = t2.pathname.split("/"), (!n2 || n2.length < 2) && (n2 = ["resource", "home"]), e2.replace(/XXX/, n2.pop());
}
function y(e2) {
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
function k(e2) {
  const t2 = /^[0-9]{1,3}$/;
  return Array.from(e2.matchAll(/[^ \t\n\r.(),~]+/g)).filter((e3) => !("" === e3[0] || e3[0].match(t2))).length;
}
function S(e2) {
  let t2 = String(e2);
  if (0 === e2 || e2 < 1)
    throw new Error("Value passed must be a counting number above 0");
  return 1 === t2.length && (t2 = "0" + t2), t2;
}
function A(e2) {
  if (["1", 1, "true", "TRUE", "on", "ON", "yes", "YES", "✔", "✓"].includes(e2))
    return true;
  if (["0", 0, "false", "FALSE", "off", "OFF", "no", "NO", "🗙", "✕", "✖", "✖", "✗", "✘"].includes(e2))
    return false;
  throw new Error("Unknown data " + e2);
}
function x(e2, t2, n2 = true) {
  let r2 = "";
  if (r2 = Number(e2) === e2 && e2 % 1 == 0 ? 0 === e2 ? "[No date]" : e2 < 1e10 ? new Date(1e3 * e2) : new Date(e2) : t2, "string" != typeof r2) {
    const e3 = ["", "Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    let t3;
    t3 = r2.getHours() ? S(r2.getHours()) : "00", r2 = " " + S(r2.getDate()) + "-" + (n2 ? e3[r2.getMonth() + 1] : S(r2.getMonth() + 1)) + "-" + r2.getUTCFullYear() + " " + (n2 ? "" : t3 + ":00");
  }
  return r2;
}
function v(e2, t2, r2) {
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
function L(e2) {
  if (void 0 === e2)
    return false;
  const t2 = e2.getComputedStyle.toString().includes("[native code]");
  return !("boolean" != typeof t2 || !t2);
}
function E(e2, t2) {
  var n2 = false;
  try {
    document.createEvent("TouchEvent"), n2 = true;
  } catch (e3) {
  }
  return !(!(t2 && "Gecko" === t2.product && t2.maxTouchPoints > 0) || n2) && (console.warn("Is this librewolf?, could tell me if this is wrong."), e2.querySelector('.fullWidth p[role="status"]').innerText += "  Is this librewolf?,  could you tell me if this is wrong.", e2.body.classList.contains("IAmLibreWolf") || e2.body.classList.add("IAmLibreWolf"), true);
}
function R(e2, t2, r2) {
  try {
    if (!L(r2))
      return -1;
    return e2.getBoundingClientRect()[t2];
  } catch (e3) {
    return n("error", "Missing data:" + e3.message), -1;
  }
}
function O(e2, t2) {
  const n2 = e2.getBoundingClientRect();
  return [Math.round(t2.scrollY + n2.top), Math.round(t2.scrollX + n2.left)];
}
async function C(e2, t2, r2) {
  try {
    if (!r2.navigator.clipboard)
      throw new Error("No clipboard available");
    await r2.navigator.clipboard.writeText(t2.href);
  } catch (e3) {
    n("error", "FAILED: copy URL feature borked " + e3.message + "\nIt will fail on a HTTP site.");
  }
}
function T(e2 = 1040, t2, n2, r2) {
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
function j(e2, t2, n2) {
  const r2 = new URLSearchParams(t2.search);
  try {
    e2.createEvent("TouchEvent");
    if (r2.has("mobile"))
      return A(r2.get("mobile") ?? "");
    let t3 = u;
    return E(e2, n2.navigator) && (t3 = 1.11 * u), q(e2, n2) > t3;
  } catch (e3) {
    return !(!r2.has("mobile") || !A(r2.get("mobile") ?? ""));
  }
}
function q(e2, t2) {
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
  const n2 = e2.documentElement, r2 = e2.body, o2 = t2.innerWidth || n2.clientWidth || r2.clientWidth, i2 = t2.innerHeight || n2.clientHeight || r2.clientHeight;
  let a2 = 0, s2 = 0;
  return s2 = "string" == typeof i2 ? parseInt(i2, 10) : i2, a2 = "string" == typeof o2 ? parseInt(o2, 10) : o2, [a2, s2];
}
let U = { name: "", meta: "", perRow: 10, titleLimit: 40, rendered: false, iteration: 0, group: "system", count: 1, debug: true, runFetch: p };
function X(e2, t2, n2) {
  let r2 = "", o2 = n2.pathname.split("/").pop();
  const i2 = new URLSearchParams(n2.search);
  return "group-XXX" === o2 && i2.has("first") && (o2 = i2.get("first") ?? "logic-error"), t2 ? i2.has("first") ? r2 += n2.pathname.replace("group-XXX", o2 + "-meta") : r2 += n2.pathname.replace(o2, e2 + "-meta") : r2 += n2.pathname.replace(o2, e2), r2 += n2.search + n2.hash, r2;
}
function P(e2, t2) {
  let n2 = "button";
  return e2 && (n2 += " lower"), n2;
}
function M(e2, t2) {
  return t2 + "" + e2.replace(/[^a-zA-Z0-9_]/g, "_");
}
function D(e2) {
  return e2.split("/").pop() ?? "";
}
function I(e2) {
  let t2 = U.group;
  if ("XXX" === U.group) {
    const n2 = new URLSearchParams(e2.search);
    n2.has("first") && (t2 = n2.get("first"));
  }
  if ("XXX" === t2)
    throw new Error("Thou shalt supply the group somewhere");
  return t2;
}
function F(e2, t2, n2, r2, o2) {
  return U.name === "group-" + U.group || (t2 === e2 && (o2 = r2), r2 > 0 && o2 > 0 && n2 > 0 && r2 >= n2 - 1 && (r2 = 0)), [o2, n2, r2];
}
async function z(t2, r2, o2, i2) {
  if (U = Object.assign(U, { name: m(o2), meta: X(U.group, ".json", o2), debug: e(o2), runFetch: p }, t2), "system" === U.group)
    throw new Error("Must set the article group, and not to 'system'.");
  U.meta = X(U.group, ".json", o2);
  const a2 = "group-XXX" === U.name || U.name === "group-" + U.group, s2 = "group" + U.group;
  if (j(r2, o2, i2) && !a2)
    1 === r2.querySelectorAll(".adjacentGroup .adjacentItem").length && (r2.querySelector(".adjacentGroup p").style.display = "none"), v("#" + s2, "<p>As mobile View, use the full page link to the left</p>", r2);
  else {
    const e2 = await U.runFetch(U.meta, false, o2);
    if (!e2.ok || !Array.isArray(e2.body))
      return n("info", "There doesn't seem to be a group meta data file."), void v("#" + s2, "<p>Internal error. Hopefully this will be fixed shortly. </p>", r2);
    if (a2) {
      const t3 = function(e3, t4, n2, r3, o3) {
        let i3 = "";
        for (const a3 in e3) {
          const s3 = M(a3, t4), l2 = j(n2, r3, o3) ? "<br />" : "";
          let c2 = e3[a3].desc;
          c2.length > 235 && (c2 = c2.substr(0, 235) + "..."), i3 += '<a class="adjacentItem" href="' + e3[a3].url + '" title="' + c2 + '">' + e3[a3].title + ' <span class="button">' + e3[a3].title + '</span><p id="adjacent' + s3 + '" >Author: ' + e3[a3].auth + " &nbsp; &nbsp; &nbsp;" + l2 + "  Last edit: " + x(e3[a3].date, "Unknown time", true) + " <br />Description: " + c2 + " </p></a>\n";
        }
        return i3;
      }(e2.body, s2, r2, o2, i2);
      v("#groupXXX", t3, r2), function(e3, t4) {
        const n2 = Array.from(t4.querySelectorAll(".top-bar.fullWidth header h1"));
        n2.length && n2[0].textContent && (n2[0].textContent.includes("whatsmyname") || n2[0].textContent.includes("XXX")) && (n2[0].textContent = "Group " + e3);
        const r3 = Array.from(t4.querySelectorAll(".adjacentGroup p"));
        r3.length && r3[0].textContent && r3[0].textContent.includes("XXX") && (r3[0].textContent = "Some similar articles in " + e3);
      }(I(o2), r2);
    } else {
      const t3 = function(e3) {
        let t4 = -1, n2 = U.perRow, r3 = [], o3 = 0, i3 = 0;
        for ([t4, n2, o3] = F(D(e3[0].url), U.name, e3.length, o3, t4); o3 < e3.length; o3++) {
          const a3 = e3[o3].title;
          if (a3 && t4 >= 0 && n2 > 0) {
            r3[i3] = { auth: e3[o3].auth, date: x(e3[o3].date, "[Unknown time]", true), url: e3[o3].url, offset: o3, title: e3[o3].title.substr(0, U.titleLimit), desc: e3[o3].desc }, a3.length > U.titleLimit && (r3[i3].title += "...");
            const t5 = e3[o3].desc;
            t5.length > 235 && (r3[i3].desc = t5.substr(0, 235) + "..."), n2--, i3++;
          }
          if ([t4, n2, o3] = F(D(e3[o3].url), U.name, n2, o3, t4), r3.length === e3.length)
            break;
          if (r3.length >= U.perRow)
            break;
        }
        return r3;
      }(e2.body);
      v("#" + s2, function(e3, t4) {
        let n2 = '<ul class="adjacentList">\n';
        for (const r3 in e3) {
          const o3 = M(r3, t4), i3 = P(e3[r3].desc.length > 110), a3 = "Title: " + e3[r3].title + "\nAuthor: " + e3[r3].auth + " &nbsp; &nbsp; Last edit: " + e3[r3].date + "\nDescription: " + e3[r3].desc;
          n2 += '<li> <a id="link' + o3 + '" class="' + i3 + '" href="' + e3[r3].url + '" aria-label="' + a3 + '" >' + e3[r3].title + "</a> </li>\n";
        }
        return 0 === e3.length ? n2 += "<li> Article doesn't seem setup correctly.</li></ul>" : n2 += '<li><a class="adjacentItem button" href="/resource/group-XXX?first=' + t4 + '" aria-label="This article lists all items in worklog group."> See full list </a></li></ul>', n2;
      }(t3, I(o2)), r2);
    }
  }
}
function W(e2, t2, n2, r2) {
  if (!y(n2.host) && !j(t2, n2, r2))
    return false;
  const o2 = t2.querySelector("#shareMenu");
  return o2 && !o2.classList.replace("shareMenuOpen", "shareMenu") && o2.classList.replace("shareMenu", "shareMenuOpen"), false;
}
function H(e2, t2, r2, o2) {
  const i2 = t2.querySelector("#mastodonserver");
  let a2 = i2.value;
  const s2 = i2.getAttribute("data-url");
  if ("" === a2 || null === a2)
    return false;
  if (a2 = "https://" + a2 + "/share?text=I+think+this+is+important+" + s2, n("info", "Trying to open mastodon server, " + a2), !L(o2))
    throw Error("Test passed, for " + a2);
  return t2.querySelector("#popup").close(), o2.open(a2, "_blank"), j(t2, r2, o2) && W(0, t2, r2, o2), false;
}
function B(e2, t2, n2) {
  let r2 = e2.querySelector("#navBar #mastoTrigger");
  if (!r2)
    return;
  if (G(r2, J, e2, n2), r2 = e2.querySelector("#shareGroup .allButtons #mastoTrigger"), r2) {
    const t3 = function(e3, t4 = "display", n3 = window) {
      let r3 = "";
      e3 && e3.computedStyleMap ? r3 = e3.computedStyleMap()[t4] : e3 && (r3 = n3.getComputedStyle(e3, null).getPropertyValue(t4));
      return r3;
    }(r2, "display", n2);
    t3 && "none" !== t3 && (r2.addEventListener("click", (t4) => J(t4, e2, n2)), r2.addEventListener("keypress", (t4) => J(t4, e2, n2)));
  }
  r2 = e2.querySelector("#copyURL"), r2 && function(e3, t3, n3, r3, o3) {
    e3.addEventListener("click", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("touch", async (e4) => (await t3(n3, r3, o3), false)), e3.addEventListener("keypress", async (e4) => (await t3(n3, r3, o3), false));
  }(r2, C, e2, t2, n2), _(e2.querySelector("#popup #sendMasto"), H, e2, t2, n2);
  const o2 = Array.from(e2.querySelectorAll("#shareMenuTrigger, #shareClose"));
  for (const r3 in o2)
    _(o2[r3], W, e2, t2, n2);
  G(e2.querySelector("#hideMasto"), $, e2, n2);
}
function J(e2, t2, n2) {
  return L(n2) && t2.querySelector("#popup").showModal(), t2.querySelector("#popup input").focus(), false;
}
function $(e2, t2, n2) {
  return L(n2) && t2.querySelector("#popup").close(), false;
}
function G(e2, t2, n2, r2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2), false));
}
function _(e2, t2, n2, r2, o2) {
  e2.addEventListener("click", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("touch", (e3) => (t2(e3, n2, r2, o2), false)), e2.addEventListener("keypress", (e3) => (t2(e3, n2, r2, o2), false));
}
let K = { referencesCache: "/resource/XXX-references", gainingElement: "#biblio", losingElement: ".addReferences", renumber: 1, forceToEnd: 1, maxDescripLen: 230, maxAuthLen: 65, debug: true, runFetch: p };
async function V(t2, r2, a2) {
  if (K = Object.assign(K, { debug: e(a2) }, t2), 0 === r2.querySelectorAll(i).length)
    return void n("info", "URL '" + a2.pathname + "' isn't marked-up for references, so skipped");
  const s2 = r2.querySelector("#biblio");
  s2 && s2.setAttribute("style", ""), r2.querySelector(K.gainingElement + " *").replaceChildren(), v(K.gainingElement, '<h2 class="biblioSection">References (for mobile UI)</h2> \n<p>The references embedded in the text are displayed here. </p>', r2);
  const l2 = await K.runFetch(b(K.referencesCache, a2), false, a2);
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
        const i2 = x(e3[r3].date, t3[2], true);
        let a3 = e3[r3].title + "";
        a3 = a3.replace(".", ".  ");
        let s3 = e3[r3].desc + "";
        s3.length > K.maxDescripLen && (s3 = s3.substring(0, K.maxDescripLen));
        let l3 = e3[r3].auth || t3[0];
        "unknown" === e3[r3].auth && (l3 = t3[0]), l3.length > K.maxAuthLen && (l3 = l3.substring(0, K.maxAuthLen)), n2.push({ auth: l3, date: i2, desc: s3, offset: parseInt(r3, 10), title: a3, url: e3[r3].url });
      }
      return n2;
    }(l2.body));
    !function(e3, t3) {
      if (!K.renumber)
        return;
      const n2 = Array.from(t3.querySelectorAll(K.losingElement + " sup a"));
      for (let e4 = 0; e4 < n2.length; e4++)
        n2[e4].textContent = "" + (e4 + 1), K.forceToEnd && (n2[e4].href = "#biblio");
    }(l2.body, r2), v(K.gainingElement, e2, r2);
  } else {
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    v(K.gainingElement, e2, r2), n("warn", "Unable to get meta data " + b(K.referencesCache, a2), JSON.stringify(Array.from(l2.headers.entries())));
  }
}
let Y = { indexUpdated: 0, gainingElement: "#biblio", referencesCache: "/resource/XXX-references", renumber: 1, maxAuthLen: 65, debug: true, runFetch: p };
function Z(e2) {
  const t2 = "HTTP_ERROR, Site admin: recompile this meta file, as this is a new link.";
  return "Reference popup for link [" + (e2 + 1) + "]\n\nHTTP_ERROR, Site admin: recompile this meta file, as this is a new link.\n " + x(+/* @__PURE__ */ new Date("07-June-2024"), "not used", true) + "\n\n" + t2;
}
function Q(e2, t2) {
  if (null === e2)
    return;
  const n2 = R(e2, "left", t2), r2 = R(e2, "top", t2);
  if (-1 === n2 && -1 === r2)
    return;
  let o2 = e2.parentNode;
  const i2 = ["LI", "SUP", "UL", "OL", "SPAN", "P"];
  for (; i2.includes(o2.tagName); )
    o2 = o2.parentNode;
  const a2 = Math.round(R(o2, "left", t2)), s2 = Math.round(R(o2, "top", t2)), c2 = Math.round(R(o2, "width", t2)), u2 = 30 * l, d2 = 5 * l;
  c2 < 650 ? e2.classList.add("leanCentre") : (n2 > a2 + c2 - u2 && e2.classList.add("leanLeft"), n2 < a2 + u2 && e2.classList.add("leanRight"), e2.classList.contains("leanRight") && e2.classList.contains("leanLeft") && (e2.classList.remove("leanRight"), e2.classList.remove("leanLeft"), e2.classList.add("leanCentre")));
  r2 < s2 - d2 && e2.classList.add("leanDown"), r2 > s2 + Math.round(R(o2, "height", t2)) && e2.classList.add("leanUp");
}
async function ee(t2, r2, o2, s2) {
  if (Y = Object.assign(Y, { debug: e(o2) }, t2), 0 === r2.querySelectorAll(i).length)
    return void n("info", "This URL '" + o2.pathname + "' isn't marked-up for references, so skipped");
  const l2 = await Y.runFetch(b(Y.referencesCache, o2), false, o2);
  if (l2.ok && Array.isArray(l2.body)) {
    if (r2.querySelectorAll(a).length < l2.body.length)
      throw new Error("Recompile the meta data for  " + o2.pathname);
    const e2 = r2.querySelector("#biblio");
    e2 && e2.setAttribute("style", ""), function(e3, t4) {
      let n2 = e3.headers.get("last-modified");
      if (!n2)
        return;
      n2.indexOf("BST") > 0 && (n2 = n2.substring(0, n2.length - 4));
      const r3 = new Date(n2).getTime();
      r3 > 0 && v(".addReading .ultraSkinny", '<span>Links updated <time datetime="' + r3 + '" title="When this was last recompiled">' + new Date(r3).toLocaleDateString("en-GB", { hour12: false, dateStyle: "medium" }) + "</time> </span>", t4);
    }(l2, r2);
    const t3 = function(e3) {
      const t4 = ["[No author]", "Resource doesn't set a description tag.", "[No date]"], n2 = [];
      for (let r3 = 0; r3 < e3.length; r3++) {
        if (null === e3[r3]) {
          n2.push(Z(r3));
          continue;
        }
        const o3 = x(e3[r3].date, t4[2], true);
        let i2 = e3[r3].title + "", a2 = e3[r3].desc;
        a2 = w(a2, 80), i2 = i2.replace(".", ". "), i2 = w(i2, 80);
        let s3 = e3[r3].auth || t4[0];
        "unknown" === e3[r3].auth && (s3 = t4[0]), s3.length > Y.maxAuthLen && (s3 = s3.substring(0, Y.maxAuthLen)), n2.push("Reference popup for link [" + (r3 + 1) + "]\n\n" + i2 + "\n" + s3 + " " + o3 + "\n\n" + a2);
      }
      return n2;
    }(l2.body);
    !function(e3, t4, n2) {
      let r3 = 1;
      const o3 = Array.from(t4.querySelectorAll(a));
      if (e3.length > o3.length)
        throw t4.querySelector(i).classList.add(c), t4.querySelector("p[role=status]").textContent += " Recompile meta data. ", new Error("Too many references in meta-data for this article, pls recompile.");
      for (let t5 = 0; t5 < e3.length; t5++)
        o3[t5].setAttribute("aria-label", "" + e3[t5]), Q(o3[t5], n2), Y.renumber && (o3[t5].textContent = "" + r3), r3++;
      if (o3.length > e3.length) {
        t4.querySelector("p[role=status]").textContent += "Recompile meta data";
        let r4 = e3.length;
        for (; r4 < o3.length; ) {
          const e4 = Z(r4);
          o3[r4].setAttribute("aria-label", "" + e4), Q(o3[r4], n2), Y.renumber && (o3[r4].textContent = "" + (r4 + 1)), r4++;
        }
      }
    }(t3, r2, s2), r2.querySelector(i).classList.add(c);
  } else {
    !function(e3, t3) {
      const n2 = m(t3), r3 = Array.from(e3.querySelectorAll(a));
      for (let e4 = 0; e4 < r3.length; e4++) {
        const t4 = `Reference popup for link [${1 + e4}]
ERROR: No valid biblio file found.
site admin, today
HTTP_ERROR, no valid file called ${n2}-references.json found.
`;
        r3[e4].setAttribute("aria-label", "" + t4);
      }
      e3.querySelector(i).classList.add(c);
    }(r2, o2);
    const e2 = '<p class="error">Unable to get bibliographic data for this article.</p>';
    v(Y.gainingElement, e2, r2), n("warn", "Unable to get meta data " + b(Y.referencesCache, o2), JSON.stringify(Array.from(l2.headers.entries())));
  }
}
function te(e2, t2, n2) {
  t2.querySelectorAll("article a").forEach(function(r2) {
    "git" === g(r2).trim().toLowerCase() && (r2.textContent = "", v(r2, '<i class="fa fa-github" aria-hidden="true"></i> \n		 <span class="sr-only">git</span>', t2), e2 ? (r2.setAttribute("aria-label", function(e3) {
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
function ne(e2, t2) {
  let n2 = 0;
  return t2.querySelectorAll(e2).forEach(function(e3) {
    n2 += k(g(e3));
  }), n2;
}
function re(e2, t2) {
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
function oe(e2) {
  const t2 = Array.from(e2.querySelectorAll(".popOverWidget details"));
  t2.length && (n("info", "Modal widget found, extra UI features added"), t2.forEach(function(t3) {
    t3.addEventListener("click", function(t4) {
      return re(t4, e2);
    });
  }), e2.body.addEventListener("click", function(t3) {
    return re(t3, e2);
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
let ie = { pageInitRun: 0 };
function ae() {
  return ie.pageInitRun;
}
function se(e2, t2, n2 = "") {
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
function le(e2) {
  if (0 === Object.keys(e2).length)
    return "{}";
  if ("string" != typeof Object.values(e2)[0])
    throw console.log("SFSDFSDF", e2, JSON.stringify(e2)), new Error("KLAAAXX0N, KLAAAAXX00n!!1eleven Implement me");
  for (let t2 of Object.keys(e2))
    "string" == typeof e2[t2] ? e2[t2].replaceAll('"', '\\"') : e2[t2];
  return JSON.stringify(e2);
}
class ce {
  #e;
  #t;
  static PSEUDO = [null, "before", "after", ":marker", "hover", "focus-within"];
  static CSS_ACTIVE = ["align-content", "align-items", "align-self", "appearance", "aspect-ratio", "background", "background-color", "border", "border-bottom", "border-bottom-right-radius", "border-left", "border-left-width", "border-radius", "border-top", "border-top-right-radius", "border-top-width", "border-width", "bottom", "clear", "clip", "clip-path", "color", "column-count", "column-gap", "columns", "column-width", "contain", "container", "content", "d", "direction", "display", "filter", "flex", "flex-direction", "flex-flow", "flex-wrap", "float", "font", "font-family", "font-size", "font-style", "font-weight", "gap", "height", "hyphenate-character", "inset", "justify-content", "left", "line-height", "list-style", "list-style-position", "list-style-type", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-left", "margin-right", "margin-top", "marker", "max-width", "min-height", "min-width", "opacity", "order", "outline", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-bottom", "padding-inline", "padding-inline-start", "padding-left", "padding-right", "padding-top", "page", "place-self", "pointer-events", "position", "r", "resize", "right", "rotate", "ry", "scrollbar-color", "scrollbar-width", "scroll-snap-align", "scroll-snap-type", "text-align", "text-decoration", "text-transform", "text-wrap", "text-wrap-mode", "top", "transform", "transition", "translate", "user-select", "vertical-align", "visibility", "white-space", "width", "word-break", "x", "y", "z-index"];
  static CSS_KEYWORDS = ["accent-color", "align-content", "align-items", "align-self", "animation", "animation-composition", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "aspect-ratio", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-size", "baseline-source", "block-size", "border", "border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-end-end-radius", "border-end-start-radius", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-start-end-radius", "border-start-start-radius", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "clip-path", "clip-rule", "color", "color-adjust", "color-interpolation", "color-interpolation-filters", "color-scheme", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "columns", "column-span", "column-width", "contain", "container", "container-name", "container-type", "contain-intrinsic-block-size", "contain-intrinsic-height", "contain-intrinsic-inline-size", "contain-intrinsic-size", "contain-intrinsic-width", "content", "content-visibility", "counter-increment", "counter-reset", "counter-set", "cursor", "cx", "cy", "d", "direction", "display", "dominant-baseline", "empty-cells", "fill", "fill-opacity", "fill-rule", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "flood-color", "flood-opacity", "font", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing", "font-palette", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-synthesis", "font-synthesis-position", "font-synthesis-small-caps", "font-synthesis-style", "font-synthesis-weight", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "forced-color-adjust", "gap", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "height", "hyphenate-character", "hyphens", "image-orientation", "image-rendering", "ime-mode", "inline-size", "inset", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", "isolation", "justify-content", "justify-items", "justify-self", "left", "letter-spacing", "lighting-color", "line-break", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-inline", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right", "margin-top", "marker", "marker-end", "marker-mid", "marker-start", "mask", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-position-x", "mask-position-y", "mask-repeat", "mask-size", "mask-type", "math-depth", "math-style", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "object-fit", "object-position", "offset", "offset-anchor", "offset-distance", "offset-path", "offset-position", "offset-rotate", "opacity", "order", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-anchor", "overflow-block", "overflow-clip-margin", "overflow-inline", "overflow-wrap", "overflow-x", "overflow-y", "overscroll-behavior", "overscroll-behavior-block", "overscroll-behavior-inline", "overscroll-behavior-x", "overscroll-behavior-y", "padding", "padding-block", "padding-block-end", "padding-block-start", "padding-bottom", "padding-inline", "padding-inline-end", "padding-inline-start", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "paint-order", "perspective", "perspective-origin", "place-content", "place-items", "place-self", "pointer-events", "position", "print-color-adjust", "quotes", "r", "resize", "right", "rotate", "row-gap", "ruby-align", "ruby-position", "rx", "ry", "scale", "scrollbar-color", "scrollbar-gutter", "scrollbar-width", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-stop", "scroll-snap-type", "shape-image-threshold", "shape-margin", "shape-outside", "shape-rendering", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "table-layout", "tab-size", "text-align", "text-align-last", "text-anchor", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip-ink", "text-decoration-style", "text-decoration-thickness", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-indent", "text-justify", "text-orientation", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-offset", "text-underline-position", "text-wrap", "text-wrap-mode", "text-wrap-style", "top", "touch-action", "transform", "transform-box", "transform-origin", "transform-style", "transition", "transition-behavior", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "unicode-bidi", "user-select", "vector-effect", "vertical-align", "visibility", "white-space", "white-space-collapse", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "x", "y", "z-index", "zoom"];
  constructor(e2, t2) {
    this.#e = e2, this.#t = t2;
  }
  async compose(e2, t2) {
    let n2 = {};
    const r2 = this.externalFilter(this.taggedElements(e2), t2);
    for (let e3 = 0; e3 < r2.length; e3++) {
      let t3 = this.mapPseudo(r2[e3]), o2 = Object.keys(t3);
      for (let e4 = 0; e4 < o2.length; e4++)
        o2[e4] in n2 ? console.info("[SKIP] DUPLICATE element " + t3[e4]) : 0 === e4 ? n2[o2[e4]] = t3[o2[e4]] : this.compareTrees(t3[o2[0]], t3[o2[e4]]) || (n2[o2[e4]] = t3[o2[e4]]);
    }
    return n2 = this.filterEmpty(this.filterCommonTags(n2, e2)), "https:" === location.protocol && (console.log("We have HTTPS, so can use better hashes to compare CSS samples"), n2 = await this.generateInvert(n2)), n2;
  }
  filterCommonTags(e2, t2) {
    let n2 = this.extractLocal(this.exportClassname(t2, true), null);
    console.log("ZERO " + t2, n2, e2);
    for (let r2 in e2)
      for (let o2 of Object.keys(e2[r2]))
        o2 in n2 && r2 !== t2 && n2[o2] === e2[r2][o2] && delete e2[r2][o2];
    n2 = this.extractLocal("body", null), console.log("ZERO 'body'", n2, e2);
    for (let t3 in e2)
      for (let r2 of Object.keys(e2[t3]))
        r2 in n2 && n2[r2] === e2[t3][r2] && delete e2[t3][r2];
    return console.log("ZERO END", e2), e2;
  }
  filterEmpty(e2) {
    for (let t2 of Object.keys(e2))
      0 === Object.values(e2[t2]).length && delete e2[t2];
    return e2;
  }
  async generateKey(e2) {
    let t2 = JSON.stringify(e2);
    const n2 = new TextEncoder().encode(t2);
    let r2 = await this.#t.crypto.subtle.digest("SHA-1", n2);
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(r2)));
  }
  async generateInvert(e2) {
    let t2 = {};
    for (let n2 in e2) {
      t2[await this.generateKey(e2[n2])] = n2;
    }
    for (let n2 in e2) {
      let r2 = await this.generateKey(e2[n2]);
      r2 in t2 && t2[r2] !== n2 && delete e2[n2];
    }
    return e2;
  }
  externalFilter(e2, t2) {
    let n2 = [];
    for (let r2 = 0; r2 < e2.length; r2++) {
      let o2 = false;
      t2.map(function(t3, n3) {
        let i2 = new RegExp(" " + t3, "i");
        (e2[r2].startsWith(t3) || e2[r2].match(i2)) && (o2 = true);
      }), o2 || n2.push(e2[r2]);
    }
    return n2;
  }
  treeWalk(e2, t2, n2) {
    let r2 = ["." + e2], o2 = true;
    var i2;
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
    return t2 ? "." + e2.trim().replaceAll(" ", " .") : "." + e2.trim().replaceAll(" ", ".");
  }
  hasStyles(e2, t2) {
    "string" == typeof e2 && (e2 = this.#e.querySelector(e2));
    return this.#t.getComputedStyle(e2, t2).length > 0;
  }
  extractLocal(e2, t2 = null) {
    const n2 = this.#e.querySelector(e2);
    console.assert(null !== n2, "Value passed '" + e2 + "' into localExtract doesnt work in current doc.");
    const r2 = n2.parentNode, o2 = this.#t.getComputedStyle(n2, t2), i2 = this.#t.getComputedStyle(r2, t2);
    let a2 = {};
    for (let e3 = 0; e3 < o2.length; e3++)
      this.isUsefulCSSAttribute(o2.item(e3), o2.getPropertyValue(o2.item(e3)), i2.getPropertyValue(o2.item(e3))) && (a2[o2.item(e3)] = o2.getPropertyValue(o2.item(e3)));
    return a2;
  }
  isUsefulCSSAttribute(e2, t2, n2) {
    return !!e2.startsWith("--") || !!ce.CSS_ACTIVE.includes(e2) && ("" !== n2 && null !== n2 && n2 !== t2);
  }
  mapPseudo(e2) {
    console.assert("." !== e2.trim(), "bad data extaction, got '.'");
    let t2 = {};
    const n2 = this.#e.querySelector(e2);
    console.assert(null !== n2, "bad data extraction for " + e2);
    for (let n3 in ce.PSEUDO)
      if (this.hasStyles(e2, ce.PSEUDO[n3])) {
        let r2 = e2;
        ce.PSEUDO[n3] && (r2 += ":" + ce.PSEUDO[n3]), t2[r2] = this.extractLocal(e2, ce.PSEUDO[n3]);
      }
    return t2;
  }
  taggedElements(e2) {
    let t2 = [];
    const n2 = this;
    Array.from(this.#e.querySelectorAll("." + e2 + " [class]")).map(function(r3, o2) {
      if ("" === r3.className.trim())
        return;
      let i2 = r3.className.trim().replaceAll("  ", " ").split(" ");
      i2 = i2.map((e3, t3) => "." + e3), t2.push(...i2.map((t3, n3) => "." + e2 + " " + t3)), t2.push(...i2), i2.map(function(o3, i3) {
        t2.push(n2.treeWalk(o3, r3, e2));
      });
    });
    let r2 = new Set(t2);
    return Array.from(r2);
  }
  compareTrees(e2, t2) {
    return le(e2) === le(t2);
  }
}
function ue(e2, t2 = "generated-sample.css") {
  const n2 = document.createElement("a"), r2 = new Blob([e2], { type: "application/json" });
  let o2 = URL.createObjectURL(r2);
  n2.href = o2, n2.download = t2, n2.click(), URL.revokeObjectURL(o2);
}
!async function(t2, r2, o2, i2) {
  ie = Object.assign(ie, {}, t2);
  const a2 = e(o2);
  if (ie.pageInitRun)
    return void n("warn", "Extra panda should not be run more than once per page");
  ie.pageInitRun = 1;
  const l2 = Array.from(r2.querySelectorAll(".noJS"));
  for (let e2 = 0; e2 < l2.length; e2++)
    l2[e2].classList.remove("noJS");
  !function(e2, t3) {
    e2.querySelector("body").setAttribute("style", "--offset-height: 0;");
    const n2 = Array.from(e2.querySelectorAll(".lotsOfWords, .halferWords, .fewWords"));
    for (let e3 = 0; e3 < n2.length; e3++)
      n2[e3].setAttribute("style", "--offset-height: " + O(n2[e3], t3)[0] + "px;");
  }(r2, i2), function(t3, n2, r3) {
    const o3 = j(t3, n2, r3);
    if (!y(n2.host) && !o3)
      return;
    if (E(t3, r3.navigator) && !o3)
      return;
    o3 && (t3.querySelector("#sendMasto").textContent = "Share article");
    const i3 = ['<li id="shareClose"> <i class="fa fa-cancel" aria-hidden="true"></i> </li>	<li> <a class="hunchUp" id="copyURL"><i class="fa fa-copy" aria-hidden="true"></i><span class="hunchUp"> copy<br /> URL</span> </a> </li>'], a3 = ["shareMenuTrigger", "siteChartLink", "rssLink"], s2 = Array.from(t3.querySelectorAll(".allButtons a")), l3 = !y(n2.host) && !e(n2), c3 = t3.querySelector(".allButtons");
    for (const e2 in s2) {
      if (a3.includes(s2[e2].id))
        continue;
      const t4 = s2[e2].cloneNode(true);
      l3 && c3.removeChild(s2[e2]), t4.classList.remove("bigScreenOnly"), i3.push("<li>"), i3.push(t4.outerHTML), i3.push("</li>"), s2[e2].getAttribute("id") && s2[e2].setAttribute("id", "old" + s2[e2].getAttribute("id"));
    }
    i3.unshift('<nav><div class="shareMenu" id="shareMenu"><menu id="mobileMenu">'), i3.push("</menu></div></nav>"), v("#navBar", i3.join("\n"), t3);
  }(r2, o2, i2), B(r2, o2, i2);
  const c2 = null !== r2.querySelector(".addReferences");
  if (te(c2, r2, i2), function(e2, t3, n2) {
    t3.querySelectorAll("article a").forEach(function(r3) {
      "docs" === g(r3).trim().toLowerCase() && (r3.textContent = "", v(r3, '<i class="fa fa-book-open" aria-hidden="true"></i>\n		 <span class="sr-only">docs</span>', t3), r3.setAttribute(e2 ? "aria-label" : "title", "Link to the project docs; it may be a git page, or a separate webpage. "), e2 && Q(r3, n2));
    });
  }(c2, r2, i2), function(e2) {
    const t3 = Array.from(e2.querySelectorAll(".addArrow"));
    for (let n2 = 0; n2 < t3.length; n2++)
      v(t3[n2].parentElement, '<i class="fa fa-play specialPointer" aria-hidden="true"></i>', e2);
  }(r2), function(e2) {
    const t3 = new RegExp("`([^`]+)`", "g"), n2 = new RegExp("/ /", "g"), r3 = Array.from(e2.querySelectorAll(".addBashSamples"));
    if (r3.length > 0)
      for (let e3 = 0; e3 < r3.length; e3++)
        r3[e3].innerHTML = r3[e3].innerHTML.replaceAll(t3, '<code class="bashSample" title="Quote from a bash; will add copy button">$1</code>').replaceAll(n2, "//");
  }(r2), function(e2) {
    const t3 = h().get(s);
    if (!t3)
      return;
    const n2 = JSON.parse(t3);
    if (n2.ft = n2.ft.replaceAll("%38", ";"), n2.cr = n2.cr.replaceAll("%38", ";"), n2.dn = n2.dn.replaceAll("%38", ";"), n2.fs = n2.fs.replaceAll("%38", ";"), !n2.ft || !n2.fs)
      return;
    const r3 = "body, .annoyingBody { font-family: " + n2.ft + "; font-size: " + n2.fs + "; direction:" + n2.dn + "; }", o3 = e2.createElement("style");
    o3.setAttribute("id", "client-set-css"), o3.innerText = r3, e2.getElementsByTagName("head")[0].append(o3);
  }(r2), oe(r2), T(1040, r2, o2, i2), E(r2, i2.navigator), !j(r2, o2, i2) && "/resource/home" !== o2.pathname && r2.querySelectorAll(".reading").length < 2 && function(t3, r3, o3) {
    const i3 = Object.assign({}, { timeFormat: "m", dataLocation: ".blocker", target: "#shareGroup", wordPerMin: 275, codeSelector: "code", refresh: false, debug: e(o3) }, t3), a3 = i3.dataLocation + " img, " + i3.dataLocation + " picture, " + i3.dataLocation + " object", s2 = ne(i3.dataLocation, r3);
    if (!s2)
      return;
    let l3 = 0;
    i3.codeSelector && (l3 += ne(i3.codeSelector, r3));
    let c3 = (s2 - l3) / i3.wordPerMin + 5 * r3.querySelectorAll(a3).length + 2 * l3 / i3.wordPerMin;
    if (c3 < 1)
      return void n("info", "No reading time displayed for this article");
    if (i3.refresh) {
      const e2 = r3.querySelector(i3.target + " a.reading");
      e2 && e2.parentNode.removeChild(e2);
    }
    c3 = Math.round(c3);
    const u2 = '<a class="reading" title="The text is ' + (l3 + s2) + ' normalised words long.  Link is a longer version of this reading guide guesstimate." href="/resource/jQuery-reading-duration">To read: ' + c3 + i3.timeFormat + "</a>";
    v(i3.target, u2, r3);
  }({ dataLocation: "#main", target: ".addReading", debug: a2, refresh: true }, r2, o2), function(e2, t3) {
    if (!t3.hash)
      return;
    const r3 = e2.querySelector(t3.hash);
    r3 && "INPUT" === r3.tagName ? r3.checked = true : n("error", "failed to find " + t3.hash + " element");
  }(r2, o2), o2.pathname.match("group-")) {
    const e2 = function(e3, t3) {
      const n2 = t3.pathname.split("/group-");
      if (Array.isArray(n2) && n2.length > 1 && "XXX" !== n2[1])
        return n2[1];
      const r3 = new URLSearchParams(t3.search);
      if (r3.has("first"))
        return r3.get("first") ?? "";
      if (e3 && e3.getAttribute("data-group")) {
        let t4 = e3.getAttribute("data-group") ?? "";
        return t4 = t4.trim(), t4.split(",").map((e4, t5) => e4.trim())[0];
      }
      throw new Error("KLAXON, KLAXON, I do not know how to build an adjacent list for " + t3.href);
    }(null, o2);
    e2 && await z({ group: e2, debug: a2, runFetch: "adjacentRunFetch" in ie ? ie.adjacentRunFetch : p }, r2, o2, i2);
  } else {
    j(r2, o2, i2) ? await V({ debug: a2, renumber: 1, runFetch: "mobileRunFetch" in ie ? ie.mobileRunFetch : p }, r2, o2) : await ee({ debug: a2, renumber: 1, runFetch: "desktopRunFetch" in ie ? ie.desktopRunFetch : p }, r2, o2, i2);
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
        await z({ group: e2[t3], debug: a2, iteration: t3, count: e2.length, runFetch: "adjacentRunFetch" in ie ? ie.adjacentRunFetch : p }, r2, o2, i2);
  }
  e(o2, "select") && (n("info", "select and word count feature is ENABLED.  Access= <alt> + w"), r2.body.addEventListener("keydown", (e2) => {
    "w" === e2.key && e2.altKey && n("info", "Word count of selection: " + k(function(e3) {
      try {
        const t3 = e3.getSelection();
        if (null === t3)
          return "";
        const n2 = t3.getRangeAt(0);
        return n2.startOffset === n2.endOffset ? "" : "" + n2.cloneContents().textContent;
      } catch (e4) {
        return n("warn", "Unable to get data for selection", e4.message), "";
      }
    }(i2)));
  })), "undefined" != typeof document && "function" == typeof document.pageStartup ? document.pageStartup() : n("info", "No article specific scripting found, (it may load manually ATF)");
}({}, document, location, window);
let de = new URLSearchParams(location.search);
de.has("dump-css") && (await async function(e2) {
  return new Promise((t2, n2) => setTimeout(t2, e2));
}(1e3), function(e2, t2, n2) {
  let r2;
  switch (t2) {
    case 1:
      r2 = se(e2, n2, "\n"), ue(r2, "generated-css.css");
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
      }(e2), ue(r2, "generated-css.json");
      break;
    default:
      throw new Error("Unknown value " + t2);
  }
}(await async function(e2, t2) {
  let n2 = ["defaultLinksMenu", "h4_footer", "articleContent", "adjacentGroup", "articleHeader row"];
  const r2 = [".fa-", ".fa.fa-", ".hljs-"];
  let o2 = {}, i2 = new ce(e2, t2);
  for (let e3 in n2) {
    let t3 = await i2.compose(n2[e3], r2);
    for (let e4 of Object.keys(t3))
      o2[e4] = e4 in o2 ? Object.assign(o2[e4], t3[e4]) : t3[e4];
  }
  return o2;
}(document, window), parseInt(de.get("dump-css"), 10), de.get("aspect") ?? "(width:100%)"));
export {
  r as SELF_VERSION,
  v as appendIsland,
  q as calcScreenDPI,
  N as currentSize,
  ae as hasBeenRun,
  j as isMobile,
  n as log,
  p as runFetch,
  f as storeAppearance
};
