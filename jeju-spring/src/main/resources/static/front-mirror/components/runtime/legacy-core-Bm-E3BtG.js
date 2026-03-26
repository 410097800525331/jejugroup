const M = "ADMIN", $ = (e) => {
  if (!e || typeof e != "object")
    return [];
  const t = [];
  return typeof e.role == "string" && e.role.trim() !== "" && t.push(e.role.trim()), Array.isArray(e.roles) && e.roles.forEach((r) => {
    typeof r == "string" && r.trim() !== "" && t.push(r.trim());
  }), t;
}, ye = (e) => $(e).some((t) => t.toUpperCase().includes(M)), z = "https://jejugroup.alwaysdata.net", R = "http://localhost:9090/jeju-web", k = /* @__PURE__ */ new Set(["localhost", "127.0.0.1"]), D = () => {
  const t = new URLSearchParams(window.location.search).get("api");
  return t === "local" ? R : t === "remote" ? z : !k.has(window.location.hostname) || window.location.port === "8080" ? "" : window.location.port !== "9090" ? R : "";
}, K = D(), h = "userSession", V = "jeju:session-updated", Y = "/api/auth/session", Q = "/api/auth/logout", x = 2 * 60 * 1e3;
let c = null, u = null;
const I = (e) => `${K}${e}`, _ = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return t && typeof t == "object" ? { ...t } : null;
  } catch {
    return null;
  }
}, F = (e) => {
  if (!e || typeof e != "object")
    return null;
  try {
    return JSON.stringify(e);
  } catch {
    return null;
  }
}, O = (e) => {
  try {
    const t = e ? { session: { ...e } } : { session: null };
    window.dispatchEvent(new CustomEvent(V, { detail: t }));
  } catch (t) {
    console.warn("[SessionManager] Session event dispatch failed:", t);
  }
}, j = () => {
  c !== null && (window.clearInterval(c), c = null), u = null;
}, J = async () => u || (q() ? (u = (async () => {
  try {
    return await T();
  } catch (t) {
    return console.warn("[SessionManager] Session heartbeat failed:", t), null;
  } finally {
    u = null;
  }
})(), u) : (j(), null)), w = () => {
  c === null && typeof window.setInterval == "function" && (c = window.setInterval(() => {
    J();
  }, x));
}, q = () => {
  try {
    return _(localStorage.getItem(h));
  } catch {
    return null;
  }
}, W = (e) => {
  if (!e || typeof e != "object")
    return null;
  const t = { ...e }, r = F(t);
  try {
    const s = localStorage.getItem(h);
    if (r && s === r)
      return w(), _(s) ?? t;
    localStorage.setItem(h, r ?? JSON.stringify(t));
  } catch (s) {
    console.warn("[SessionManager] Session save failed:", s);
  }
  return w(), O(t), t;
}, S = () => {
  j();
  try {
    localStorage.getItem(h) !== null && localStorage.removeItem(h);
  } catch (e) {
    console.warn("[SessionManager] Session clear failed:", e);
  }
  O(null);
}, T = async () => {
  const e = await fetch(I(Y), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });
  if (e.status === 401)
    return S(), null;
  if (!e.ok)
    throw new Error(`Session fetch failed: ${e.status}`);
  const t = await e.json();
  return !(t != null && t.success) || !(t != null && t.user) ? (S(), null) : W(t.user);
}, Ee = async () => {
  try {
    return await T();
  } catch (e) {
    return console.warn("[SessionManager] Session resolve failed:", e), null;
  }
}, je = async () => {
  j();
  try {
    await fetch(I(Q), {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json"
      }
    });
  } catch (e) {
    console.warn("[SessionManager] Logout request failed:", e);
  } finally {
    S();
  }
}, A = (e) => {
  if (e === null || typeof e != "object")
    return e;
  const t = Object.getOwnPropertyNames(e);
  for (const r of t) {
    const s = e[r];
    s && typeof s == "object" && !Object.isFrozen(s) && A(s);
  }
  return Object.freeze(e);
}, n = (e, t = {}) => Object.freeze({
  kind: "page",
  path: e,
  ...t
}), f = (e, t, r = {}) => Object.freeze({
  kind: "hash-page",
  path: e,
  hash: t,
  ...r
}), Z = (e, t = {}) => Object.freeze({
  kind: "external",
  url: e,
  ...t
}), N = (e) => {
  if (!e || typeof e != "object")
    return e;
  if ("kind" in e) {
    if (e.kind === "external")
      return e.url;
    const t = e.defaultQuery ? `?${new URLSearchParams(e.defaultQuery).toString()}` : "", r = e.hash ?? "";
    return `${e.path}${t}${r}`;
  }
  return Object.fromEntries(
    Object.entries(e).map(([t, r]) => [t, N(r)])
  );
}, v = A({
  HOME: n("/index.html"),
  AUTH: {
    LOGIN: n("/pages/auth/login.html", { shellStrategy: "auth-shell" }),
    SIGNUP: n("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
    PASS_AUTH: n("/pages/auth/pass_auth.html"),
    OAUTH_CALLBACK: n("/pages/auth/oauth_callback.html")
  },
  CS: {
    CUSTOMER_CENTER: n("/pages/cs/customer_center.html"),
    NOTICE: f("/pages/cs/customer_center.html", "#/notices"),
    FAQ: f("/pages/cs/customer_center.html", "#/faqs"),
    INQUIRY: n("/pages/cs/customer_center.html")
  },
  MYPAGE: {
    DASHBOARD: n("/pages/mypage/dashboard.html"),
    PROFILE: n("/pages/mypage/dashboard.html"),
    BOOKINGS: n("/pages/mypage/dashboard.html")
  },
  ADMIN: {
    DASHBOARD: n("/admin/pages/dashboard.html"),
    RESERVATIONS: n("/admin/pages/reservations.html"),
    LODGING: n("/admin/pages/lodging.html"),
    MEMBERS: n("/admin/pages/members.html"),
    CMS: n("/admin/pages/cms.html")
  },
  SERVICES: {
    RENT_CAR: Z("https://jejurentcar.netlify.app/"),
    STAY: {
      MAIN: n("/jejustay/pages/hotel/jejuhotel.html"),
      HOTEL_LIST: n("/jejustay/pages/hotel/hotel-list.html"),
      LIFE: n("/jejustay/pages/stay/jejustay_life.html"),
      PRIVATE: n("/jejustay/pages/stay/private_stay.html")
    },
    TRAVEL: {
      ACTIVITIES: n("/jejustay/pages/travel/activities.html"),
      ESIM: n("/jejustay/pages/travel/esim.html"),
      GUIDE: n("/jejustay/pages/travel/travel_guide.html"),
      TIPS: n("/jejustay/pages/travel/travel_tips.html"),
      CHECKLIST: n("/jejustay/pages/travel/travel_checklist.html")
    },
    DEALS: {
      MAIN: n("/jejustay/pages/deals/deals.html"),
      MEMBER: n("/jejustay/pages/deals/deals_member.html"),
      PARTNER: n("/jejustay/pages/deals/deals_partner.html")
    },
    AIR: {
      MAIN: n("/jejuair/index.html"),
      ABOUT: {
        COMPANY: n("/jejuair/pages/about/about.html"),
        CAREER: n("/jejuair/pages/about/career.html"),
        CCM: n("/jejuair/pages/about/ccm.html")
      },
      BOOKING: {
        AVAILABILITY: n("/jejuair/pages/booking/Availability.html"),
        ROUTE: n("/jejuair/pages/booking/route.html"),
        PAYMENT: n("/jejuair/pages/booking/payment.html"),
        GUEST_RESERVATION: n("/jejuair/pages/booking/viewOnOffReservationList.html")
      },
      BOARDING: {
        FAST_PROCEDURE: n("/jejuair/pages/boarding/fastProcedure.html"),
        MOBILE_CHECKIN: n("/jejuair/pages/boarding/viewCheckin.html"),
        E_DOCUMENT: n("/jejuair/pages/boarding/eDocument.html")
      },
      BAGGAGE: {
        PREORDERED: n("/jejuair/pages/baggage/preorderedBaggage.html"),
        CABIN: n("/jejuair/pages/baggage/cabinBaggage.html"),
        LIMITATION: n("/jejuair/pages/baggage/transportLimitation.html"),
        LIABILITY: n("/jejuair/pages/baggage/liability.html")
      },
      PET: {
        PASS: n("/jejuair/pages/pet/petPass.html"),
        SERVICE: n("/jejuair/pages/pet/petService.html")
      },
      JMEMBERS: {
        SIGHTSEEING: n("/jejuair/pages/jmembers/jmembersSightseeing.html"),
        AIRPLANE: n("/jejuair/pages/jmembers/jmembersAirplane.html"),
        GOLF: n("/jejuair/pages/jmembers/jmembersGolf.html"),
        INSURANCE: n("/jejuair/pages/jmembers/jmembersInsurance.html")
      },
      CS: {
        CUSTOMER_SERVICE: n("/pages/cs/customer_center.html"),
        NOTICE: f("/pages/cs/customer_center.html", "#/notices")
      },
      AUTH: {
        LOGIN: n("/pages/auth/login.html", { shellStrategy: "auth-shell" }),
        JOIN: n("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
        PASS_AUTH: n("/pages/auth/pass_auth.html"),
        SIGNUP: n("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
        MYPAGE: n("/pages/mypage/dashboard.html", { defaultQuery: { shell: "air" } })
      },
      EVENT: n("/jejuair/pages/event/event.html")
    }
  }
}), Ae = A(N(v)), X = /:([A-Za-z0-9_]+)|\{([A-Za-z0-9_]+)\}/g, ee = /^[a-z][a-z0-9+.-]*:/i, y = "shell", te = "jeju:mypage-shell", re = /* @__PURE__ */ new Set(["main", "stay", "air"]), ne = (e, t) => t.split(".").reduce((r, s) => {
  if (r && typeof r == "object" && s in r)
    return r[s];
}, e), se = (e) => {
  if (!e || typeof e != "object")
    return "";
  if (e.kind === "external")
    return e.url;
  const t = e.defaultQuery ? `?${new URLSearchParams(e.defaultQuery).toString()}` : "", r = e.hash ?? "";
  return `${e.path}${t}${r}`;
}, ae = (e, t, r) => {
  const s = new URLSearchParams();
  for (const [o, i] of Object.entries(t))
    if (!(r.has(o) || i === void 0 || i === null)) {
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
}, oe = () => {
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
}, ie = () => {
  var e;
  return typeof window < "u" && typeof ((e = window.location) == null ? void 0 : e.origin) == "string" ? new URL(window.location.origin) : new URL("/", import.meta.url);
}, le = (e) => ee.test(e) ? e : e.startsWith("/") ? new URL(e, ie()).href : new URL(e, oe()).href, d = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim().toLowerCase();
  return re.has(t) ? t : null;
}, ue = (e = "") => {
  const t = String(e).toLowerCase();
  return t.includes("/jejuair/") ? "air" : t.includes("/jejustay/") ? "stay" : "main";
}, ce = () => {
  var t, r, s;
  if (typeof window > "u")
    return "main";
  try {
    const a = new URLSearchParams(window.location.search), o = d(a.get(y));
    if (o)
      return o;
  } catch {
  }
  if (typeof document < "u") {
    const a = d((r = (t = document.body) == null ? void 0 : t.dataset) == null ? void 0 : r.mypageShell);
    if (a)
      return a;
  }
  const e = ue(window.location.pathname);
  if (e)
    return e;
  try {
    const a = d((s = window.sessionStorage) == null ? void 0 : s.getItem(te));
    if (a)
      return a;
  } catch {
  }
  return "main";
}, he = (e, t) => {
  const r = e.defaultQuery ? {
    ...e.defaultQuery,
    ...t
  } : t;
  if (!e || e.shellStrategy !== "auth-shell" || d(r == null ? void 0 : r[y]))
    return r;
  const s = ce();
  return {
    ...r,
    [y]: s
  };
}, L = (e, t = {}) => {
  if (typeof e != "string" || e.trim() === "")
    throw new TypeError("[RouteResolver] routeKey must be a non-empty string.");
  if (t === null || typeof t != "object" || Array.isArray(t))
    throw new TypeError("[RouteResolver] params must be a plain object.");
  const r = e.trim(), s = ne(v, r);
  if (!s || typeof s != "object" || !s.kind)
    throw new Error(`[RouteResolver] Route key not found: ${e}`);
  const a = se(s);
  if (typeof a != "string" || a.trim() === "")
    throw new Error(`[RouteResolver] Route template not found: ${e}`);
  const o = he(s, t), i = new Set(s.defaultQuery ? Object.keys(s.defaultQuery) : []), l = a.replace(X, (Se, H, G) => {
    const p = H || G, g = o[p];
    if (g == null)
      throw new Error(`[RouteResolver] Missing route param: ${p} (${e})`);
    return i.add(p), encodeURIComponent(String(g));
  }), m = l.indexOf("#"), P = m >= 0 ? l.slice(0, m) : l, C = m >= 0 ? l.slice(m) : "", B = `${le(P)}${C}`;
  return ae(B, o, i);
};
let b = !1;
const me = ["ctrlKey", "metaKey", "shiftKey", "altKey"], de = (e) => me.some((t) => !!e[t]), U = (e) => {
  const t = e.getAttribute("data-route-params");
  if (!t)
    return {};
  try {
    const r = JSON.parse(t);
    return r && typeof r == "object" && !Array.isArray(r) ? r : {};
  } catch {
    return console.warn("[RouterBinder] Invalid data-route-params JSON:", t), {};
  }
}, pe = (e) => {
  var r;
  const t = e.getAttribute("data-route");
  if (t)
    try {
      const s = U(e), a = L(t, s), o = e.getAttribute("data-route-mode") || "assign", i = (r = window.__JEJU_ROUTE_NAVIGATOR__) == null ? void 0 : r.safeNavigate;
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
}, E = (e) => {
  if (!(e instanceof Element))
    return;
  const t = [];
  e.matches("[data-route]") && t.push(e), t.push(...e.querySelectorAll("[data-route]")), t.forEach((r) => {
    if (!(r instanceof HTMLAnchorElement))
      return;
    const s = r.getAttribute("data-route");
    if (s)
      try {
        const a = U(r), o = L(s, a);
        r.setAttribute("href", o);
      } catch (a) {
        r.setAttribute("href", "#"), console.warn(`[RouterBinder] Failed to hydrate href for '${s}':`, a);
      }
  });
}, ge = () => {
  if (!document.body)
    return;
  new MutationObserver((t) => {
    t.forEach((r) => {
      r.addedNodes.forEach((s) => {
        E(s);
      });
    });
  }).observe(document.body, {
    childList: !0,
    subtree: !0
  });
}, fe = (e = document) => {
  if (e instanceof Document) {
    E(e.documentElement);
    return;
  }
  E(e);
}, Re = () => {
  b || (b = !0, fe(document), ge(), document.body.addEventListener("click", (e) => {
    const t = e.target.closest("[data-route]");
    t && (e.defaultPrevented || t.hasAttribute("data-route-animated-nav") || de(e) || t instanceof HTMLAnchorElement && t.getAttribute("target") && t.getAttribute("target") !== "_self" || (e.preventDefault(), pe(t)));
  }));
};
function we(e) {
  if (typeof e != "string")
    return e;
  const t = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return e.replace(/[&<>"']/g, (r) => t[r]);
}
function be(e) {
  return /[<>'";\(\)={}]/.test(e) ? (console.warn("Security Warning: Invalid parameter detected"), !1) : !0;
}
export {
  K as A,
  Ae as R,
  L as a,
  W as b,
  ye as h,
  Re as i,
  je as l,
  Ee as r,
  we as s,
  be as v
};
