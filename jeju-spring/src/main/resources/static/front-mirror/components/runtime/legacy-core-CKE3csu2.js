const C = "LOCAL_FRONT_ADMIN", A = "userSession", B = "ADMIN", G = /* @__PURE__ */ new Set(["localhost", "127.0.0.1", "::1", "0.0.0.0"]), $ = /^(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})$/, H = (e) => {
  if (typeof e != "string")
    return !1;
  const t = e.trim().toLowerCase();
  return t ? G.has(t) || $.test(t) || t.endsWith(".local") || !t.includes(".") && !t.includes(":") : !1;
}, j = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return t && typeof t == "object" ? { ...t } : null;
  } catch {
    return null;
  }
}, M = (e) => {
  if (!e || typeof e != "object")
    return [];
  const t = [];
  return typeof e.role == "string" && e.role.trim() !== "" && t.push(e.role.trim()), Array.isArray(e.roles) && e.roles.forEach((n) => {
    typeof n == "string" && n.trim() !== "" && t.push(n.trim());
  }), t;
}, D = () => window.location.protocol === "file:" || H(window.location.hostname), z = () => Object.freeze({
  id: "local-admin",
  name: "로컬 관리자",
  email: "admin@local.jejugroup",
  role: "ADMIN",
  roles: ["ADMIN", "SUPER_ADMIN"],
  authSource: C,
  isLocalAdmin: !0
}), k = (e) => M(e).some((t) => t.toUpperCase().includes(B)), K = () => {
  try {
    const e = j(window.localStorage.getItem(A));
    return k(e) ? Object.freeze({ ...e }) : null;
  } catch {
    return null;
  }
}, V = () => {
  try {
    const e = j(window.localStorage.getItem(A));
    return e ? Object.freeze({ ...e }) : null;
  } catch {
    return null;
  }
}, Y = () => {
  const e = K();
  return e || (V() ? null : D() ? z() : null);
}, we = () => !!Y(), F = "https://jejugroup.alwaysdata.net", y = "http://localhost:9090/jeju-web", Q = /* @__PURE__ */ new Set(["localhost", "127.0.0.1"]), J = () => {
  const t = new URLSearchParams(window.location.search).get("api");
  return t === "local" ? y : t === "remote" ? F : Q.has(window.location.hostname) && window.location.port !== "9090" ? y : "";
}, x = J(), f = "userSession", q = "jeju:session-updated", W = "/api/auth/session", Z = "/api/auth/logout", R = (e) => `${x}${e}`, X = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return t && typeof t == "object" ? { ...t } : null;
  } catch {
    return null;
  }
}, w = (e) => {
  try {
    const t = e ? { session: { ...e } } : { session: null };
    window.dispatchEvent(new CustomEvent(q, { detail: t }));
  } catch (t) {
    console.warn("[SessionManager] Session event dispatch failed:", t);
  }
}, ee = () => {
  try {
    return X(localStorage.getItem(f));
  } catch {
    return null;
  }
}, te = (e) => {
  if (!e || typeof e != "object")
    return null;
  const t = { ...e };
  try {
    localStorage.setItem(f, JSON.stringify(t));
  } catch (n) {
    console.warn("[SessionManager] Session save failed:", n);
  }
  return w(t), t;
}, _ = () => {
  try {
    localStorage.removeItem(f);
  } catch (e) {
    console.warn("[SessionManager] Session clear failed:", e);
  }
  w(null);
}, re = async () => {
  const e = await fetch(R(W), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });
  if (e.status === 401)
    return _(), null;
  if (!e.ok)
    throw new Error(`Session fetch failed: ${e.status}`);
  const t = await e.json();
  return !(t != null && t.success) || !(t != null && t.user) ? null : te(t.user);
}, _e = async () => {
  const e = ee();
  if (e)
    return e;
  try {
    return await re();
  } catch (t) {
    return console.warn("[SessionManager] Session resolve failed:", t), null;
  }
}, Oe = async () => {
  try {
    await fetch(R(Z), {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json"
      }
    });
  } catch (e) {
    console.warn("[SessionManager] Logout request failed:", e);
  } finally {
    _();
  }
}, S = (e) => {
  if (e === null || typeof e != "object")
    return e;
  const t = Object.getOwnPropertyNames(e);
  for (const n of t) {
    const s = e[n];
    s && typeof s == "object" && !Object.isFrozen(s) && S(s);
  }
  return Object.freeze(e);
}, r = (e, t = {}) => Object.freeze({
  kind: "page",
  path: e,
  ...t
}), m = (e, t, n = {}) => Object.freeze({
  kind: "hash-page",
  path: e,
  hash: t,
  ...n
}), ne = (e, t = {}) => Object.freeze({
  kind: "external",
  url: e,
  ...t
}), O = (e) => {
  if (!e || typeof e != "object")
    return e;
  if ("kind" in e) {
    if (e.kind === "external")
      return e.url;
    const t = e.defaultQuery ? `?${new URLSearchParams(e.defaultQuery).toString()}` : "", n = e.hash ?? "";
    return `${e.path}${t}${n}`;
  }
  return Object.fromEntries(
    Object.entries(e).map(([t, n]) => [t, O(n)])
  );
}, b = S({
  HOME: r("/index.html"),
  AUTH: {
    LOGIN: r("/pages/auth/login.html", { shellStrategy: "auth-shell" }),
    SIGNUP: r("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
    PASS_AUTH: r("/pages/auth/pass_auth.html"),
    OAUTH_CALLBACK: r("/pages/auth/oauth_callback.html")
  },
  CS: {
    CUSTOMER_CENTER: r("/pages/cs/customer_center.html"),
    NOTICE: m("/pages/cs/customer_center.html", "#/notices"),
    FAQ: m("/pages/cs/customer_center.html", "#/faqs"),
    INQUIRY: r("/pages/cs/customer_center.html")
  },
  MYPAGE: {
    DASHBOARD: r("/pages/mypage/dashboard.html"),
    PROFILE: r("/pages/mypage/dashboard.html"),
    BOOKINGS: r("/pages/mypage/dashboard.html")
  },
  ADMIN: {
    DASHBOARD: r("/admin/pages/dashboard.html"),
    RESERVATIONS: r("/admin/pages/reservations.html"),
    LODGING: r("/admin/pages/lodging.html"),
    MEMBERS: r("/admin/pages/members.html"),
    CMS: r("/admin/pages/cms.html")
  },
  SERVICES: {
    RENT_CAR: ne("https://jejurentcar.netlify.app/"),
    STAY: {
      MAIN: r("/jejustay/pages/hotel/jejuhotel.html"),
      HOTEL_LIST: r("/jejustay/pages/hotel/hotel-list.html"),
      LIFE: r("/jejustay/pages/stay/jejustay_life.html"),
      PRIVATE: r("/jejustay/pages/stay/private_stay.html")
    },
    TRAVEL: {
      ACTIVITIES: r("/jejustay/pages/travel/activities.html"),
      ESIM: r("/jejustay/pages/travel/esim.html"),
      GUIDE: r("/jejustay/pages/travel/travel_guide.html"),
      TIPS: r("/jejustay/pages/travel/travel_tips.html"),
      CHECKLIST: r("/jejustay/pages/travel/travel_checklist.html")
    },
    DEALS: {
      MAIN: r("/jejustay/pages/deals/deals.html"),
      MEMBER: r("/jejustay/pages/deals/deals_member.html"),
      PARTNER: r("/jejustay/pages/deals/deals_partner.html")
    },
    AIR: {
      MAIN: r("/jejuair/index.html"),
      ABOUT: {
        COMPANY: r("/jejuair/pages/about/about.html"),
        CAREER: r("/jejuair/pages/about/career.html"),
        CCM: r("/jejuair/pages/about/ccm.html")
      },
      BOOKING: {
        AVAILABILITY: r("/jejuair/pages/booking/Availability.html"),
        ROUTE: r("/jejuair/pages/booking/route.html"),
        PAYMENT: r("/jejuair/pages/booking/payment.html"),
        GUEST_RESERVATION: r("/jejuair/pages/booking/viewOnOffReservationList.html")
      },
      BOARDING: {
        FAST_PROCEDURE: r("/jejuair/pages/boarding/fastProcedure.html"),
        MOBILE_CHECKIN: r("/jejuair/pages/boarding/viewCheckin.html"),
        E_DOCUMENT: r("/jejuair/pages/boarding/eDocument.html")
      },
      BAGGAGE: {
        PREORDERED: r("/jejuair/pages/baggage/preorderedBaggage.html"),
        CABIN: r("/jejuair/pages/baggage/cabinBaggage.html"),
        LIMITATION: r("/jejuair/pages/baggage/transportLimitation.html"),
        LIABILITY: r("/jejuair/pages/baggage/liability.html")
      },
      PET: {
        PASS: r("/jejuair/pages/pet/petPass.html"),
        SERVICE: r("/jejuair/pages/pet/petService.html")
      },
      JMEMBERS: {
        SIGHTSEEING: r("/jejuair/pages/jmembers/jmembersSightseeing.html"),
        AIRPLANE: r("/jejuair/pages/jmembers/jmembersAirplane.html"),
        GOLF: r("/jejuair/pages/jmembers/jmembersGolf.html"),
        INSURANCE: r("/jejuair/pages/jmembers/jmembersInsurance.html")
      },
      CS: {
        CUSTOMER_SERVICE: r("/pages/cs/customer_center.html"),
        NOTICE: m("/pages/cs/customer_center.html", "#/notices")
      },
      AUTH: {
        LOGIN: r("/pages/auth/login.html", { shellStrategy: "auth-shell" }),
        JOIN: r("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
        PASS_AUTH: r("/pages/auth/pass_auth.html"),
        SIGNUP: r("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
        MYPAGE: r("/pages/mypage/dashboard.html", { defaultQuery: { shell: "air" } })
      },
      EVENT: r("/jejuair/pages/event/event.html")
    }
  }
}), be = S(O(b)), se = /:([A-Za-z0-9_]+)|\{([A-Za-z0-9_]+)\}/g, ae = /^[a-z][a-z0-9+.-]*:/i, p = "shell", oe = "jeju:mypage-shell", ie = /* @__PURE__ */ new Set(["main", "stay", "air"]), le = (e, t) => t.split(".").reduce((n, s) => {
  if (n && typeof n == "object" && s in n)
    return n[s];
}, e), ce = (e) => {
  if (!e || typeof e != "object")
    return "";
  if (e.kind === "external")
    return e.url;
  const t = e.defaultQuery ? `?${new URLSearchParams(e.defaultQuery).toString()}` : "", n = e.hash ?? "";
  return `${e.path}${t}${n}`;
}, ue = (e, t, n) => {
  const s = new URLSearchParams();
  for (const [o, i] of Object.entries(t))
    if (!(n.has(o) || i === void 0 || i === null)) {
      if (Array.isArray(i)) {
        i.forEach((l) => {
          l != null && s.append(o, String(l));
        });
        continue;
      }
      s.append(o, String(i));
    }
  const a = s.toString();
  return a ? `${e}${e.includes("?") ? "&" : "?"}${a}` : e;
}, he = () => {
  var e;
  if (typeof window < "u") {
    const t = (e = window.__JEJU_ROUTE_NAVIGATOR__) == null ? void 0 : e.appRoot;
    if (typeof t == "string" && t.trim() !== "")
      try {
        return new URL(t, window.location.href);
      } catch {
      }
  }
  return new URL(
    /* @vite-ignore */
    "../../",
    import.meta.url
  );
}, de = () => {
  var e;
  return typeof window < "u" && typeof ((e = window.location) == null ? void 0 : e.origin) == "string" ? new URL(window.location.origin) : new URL("/", import.meta.url);
}, me = (e) => ae.test(e) ? e : e.startsWith("/") ? new URL(e, de()).href : new URL(e, he()).href, u = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim().toLowerCase();
  return ie.has(t) ? t : null;
}, pe = (e = "") => {
  const t = String(e).toLowerCase();
  return t.includes("/jejuair/") ? "air" : t.includes("/jejustay/") ? "stay" : "main";
}, ge = () => {
  var t, n, s;
  if (typeof window > "u")
    return "main";
  try {
    const a = new URLSearchParams(window.location.search), o = u(a.get(p));
    if (o)
      return o;
  } catch {
  }
  if (typeof document < "u") {
    const a = u((n = (t = document.body) == null ? void 0 : t.dataset) == null ? void 0 : n.mypageShell);
    if (a)
      return a;
  }
  const e = pe(window.location.pathname);
  if (e)
    return e;
  try {
    const a = u((s = window.sessionStorage) == null ? void 0 : s.getItem(oe));
    if (a)
      return a;
  } catch {
  }
  return "main";
}, fe = (e, t) => {
  const n = e.defaultQuery ? {
    ...e.defaultQuery,
    ...t
  } : t;
  if (!e || e.shellStrategy !== "auth-shell" || u(n == null ? void 0 : n[p]))
    return n;
  const s = ge();
  return {
    ...n,
    [p]: s
  };
}, I = (e, t = {}) => {
  if (typeof e != "string" || e.trim() === "")
    throw new TypeError("[RouteResolver] routeKey must be a non-empty string.");
  if (t === null || typeof t != "object" || Array.isArray(t))
    throw new TypeError("[RouteResolver] params must be a plain object.");
  const n = e.trim(), s = le(b, n);
  if (!s || typeof s != "object" || !s.kind)
    throw new Error(`[RouteResolver] Route key not found: ${e}`);
  const a = ce(s);
  if (typeof a != "string" || a.trim() === "")
    throw new Error(`[RouteResolver] Route template not found: ${e}`);
  const o = fe(s, t), i = new Set(s.defaultQuery ? Object.keys(s.defaultQuery) : []), l = a.replace(se, (Re, U, P) => {
    const h = U || P, d = o[h];
    if (d == null)
      throw new Error(`[RouteResolver] Missing route param: ${h} (${e})`);
    return i.add(h), encodeURIComponent(String(d));
  }), c = l.indexOf("#"), L = c >= 0 ? l.slice(0, c) : l, N = c >= 0 ? l.slice(c) : "", v = `${me(L)}${N}`;
  return ue(v, o, i);
};
let E = !1;
const Se = ["ctrlKey", "metaKey", "shiftKey", "altKey"], ye = (e) => Se.some((t) => !!e[t]), T = (e) => {
  const t = e.getAttribute("data-route-params");
  if (!t)
    return {};
  try {
    const n = JSON.parse(t);
    return n && typeof n == "object" && !Array.isArray(n) ? n : {};
  } catch {
    return console.warn("[RouterBinder] Invalid data-route-params JSON:", t), {};
  }
}, Ee = (e) => {
  var n;
  const t = e.getAttribute("data-route");
  if (t)
    try {
      const s = T(e), a = I(t, s), o = e.getAttribute("data-route-mode") || "assign", i = (n = window.__JEJU_ROUTE_NAVIGATOR__) == null ? void 0 : n.safeNavigate;
      if (i) {
        i(a, "router-binder", { mode: o });
        return;
      }
      if (o === "replace") {
        window.location.replace(a);
        return;
      }
      window.location.assign(a);
    } catch (s) {
      console.warn(`[RouterBinder] Failed to resolve route '${t}':`, s);
    }
}, g = (e) => {
  if (!(e instanceof Element))
    return;
  const t = [];
  e.matches("[data-route]") && t.push(e), t.push(...e.querySelectorAll("[data-route]")), t.forEach((n) => {
    if (!(n instanceof HTMLAnchorElement))
      return;
    const s = n.getAttribute("data-route");
    if (s)
      try {
        const a = T(n), o = I(s, a);
        n.setAttribute("href", o);
      } catch (a) {
        n.setAttribute("href", "#"), console.warn(`[RouterBinder] Failed to hydrate href for '${s}':`, a);
      }
  });
}, Ae = () => {
  if (!document.body)
    return;
  new MutationObserver((t) => {
    t.forEach((n) => {
      n.addedNodes.forEach((s) => {
        g(s);
      });
    });
  }).observe(document.body, {
    childList: !0,
    subtree: !0
  });
}, je = (e = document) => {
  if (e instanceof Document) {
    g(e.documentElement);
    return;
  }
  g(e);
}, Ie = () => {
  E || (E = !0, je(document), Ae(), document.body.addEventListener("click", (e) => {
    const t = e.target.closest("[data-route]");
    t && (e.defaultPrevented || t.hasAttribute("data-route-animated-nav") || ye(e) || t instanceof HTMLAnchorElement && t.getAttribute("target") && t.getAttribute("target") !== "_self" || (e.preventDefault(), Ee(t)));
  }));
};
function Te(e) {
  if (typeof e != "string")
    return e;
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return e.replace(/[&<>"']/g, (n) => t[n]);
}
function Le(e) {
  return /[<>'";\(\)={}]/.test(e) ? (console.warn("Security Warning: Invalid parameter detected"), !1) : !0;
}
export {
  x as A,
  be as R,
  I as a,
  D as b,
  we as c,
  Te as d,
  k as h,
  Ie as i,
  Oe as l,
  _e as r,
  te as s,
  Le as v
};
