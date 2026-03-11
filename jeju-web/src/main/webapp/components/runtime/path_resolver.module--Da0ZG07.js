import { ROUTES as S } from "./routes.module-D27PSM83.js";
const y = /:([A-Za-z0-9_]+)|\{([A-Za-z0-9_]+)\}/g, m = new URL("../../", import.meta.url), R = /^[a-z][a-z0-9+.-]*:/i, d = "shell", w = "jeju:mypage-shell", E = /* @__PURE__ */ new Set(["main", "stay", "air"]), g = "/pages/auth/", p = (e, t) => t.split(".").reduce((r, n) => {
  if (r && typeof r == "object" && n in r)
    return r[n];
}, e), A = (e, t, r) => {
  const n = new URLSearchParams();
  for (const [i, s] of Object.entries(t))
    if (!(r.has(i) || s === void 0 || s === null)) {
      if (Array.isArray(s)) {
        s.forEach((u) => {
          u != null && n.append(i, String(u));
        });
        continue;
      }
      n.append(i, String(s));
    }
  const o = n.toString();
  return o ? `${e}${e.includes("?") ? "&" : "?"}${o}` : e;
}, P = (e) => {
  if (R.test(e))
    return e;
  const t = e.startsWith("/") ? e.slice(1) : e;
  return new URL(t, m).href;
}, l = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim().toLowerCase();
  return E.has(t) ? t : null;
}, _ = (e = "") => {
  const t = String(e).toLowerCase();
  return t.includes("/jejuair/") ? "air" : t.includes("/jejustay/") ? "stay" : "main";
}, T = () => {
  var e, t, r;
  if (typeof window > "u")
    return "main";
  try {
    const n = new URLSearchParams(window.location.search), o = l(n.get(d));
    if (o)
      return o;
  } catch {
  }
  if (typeof document < "u") {
    const n = l((t = (e = document.body) == null ? void 0 : e.dataset) == null ? void 0 : t.mypageShell);
    if (n)
      return n;
  }
  try {
    const n = l((r = window.sessionStorage) == null ? void 0 : r.getItem(w));
    if (n)
      return n;
  } catch {
  }
  return _(window.location.pathname);
}, L = (e, t) => {
  if (typeof e != "string" || !e.includes(g) || l(t == null ? void 0 : t[d]))
    return t;
  const r = T(), n = r === "stay" ? "main" : r;
  return {
    ...t,
    [d]: n
  };
}, b = (e, t = {}) => {
  if (typeof e != "string" || e.trim() === "")
    throw new TypeError("[RouteResolver] routeKey must be a non-empty string.");
  if (t === null || typeof t != "object" || Array.isArray(t))
    throw new TypeError("[RouteResolver] params must be a plain object.");
  const r = e.trim(), n = p(S, r);
  if (typeof n != "string" || n.trim() === "")
    throw new Error(`[RouteResolver] Route key not found: ${e}`);
  const o = L(n, t), i = /* @__PURE__ */ new Set(), s = n.replace(y, (U, f, h) => {
    const c = f || h, a = o[c];
    if (a == null)
      throw new Error(`[RouteResolver] Missing route param: ${c} (${e})`);
    return i.add(c), encodeURIComponent(String(a));
  }), u = P(s);
  return A(u, o, i);
};
export {
  b as resolveRoute
};
