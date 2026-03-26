const U = "ADMIN", P = (e) => {
  if (!e || typeof e != "object")
    return [];
  const t = [];
  return typeof e.role == "string" && e.role.trim() !== "" && t.push(e.role.trim()), Array.isArray(e.roles) && e.roles.forEach((r) => {
    typeof r == "string" && r.trim() !== "" && t.push(r.trim());
  }), t;
}, he = (e) => P(e).some((t) => t.toUpperCase().includes(U)), C = "https://jejugroup.alwaysdata.net", y = "http://localhost:9090/jeju-web", B = /* @__PURE__ */ new Set(["localhost", "127.0.0.1"]), G = () => {
  const t = new URLSearchParams(window.location.search).get("api");
  return t === "local" ? y : t === "remote" ? C : !B.has(window.location.hostname) || window.location.port === "8080" ? "" : window.location.port !== "9090" ? y : "";
}, H = G(), h = "userSession", $ = "jeju:session-updated", M = "/api/auth/session", z = "/api/auth/logout", j = (e) => `${H}${e}`, k = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return t && typeof t == "object" ? { ...t } : null;
  } catch {
    return null;
  }
}, D = (e) => {
  if (!e || typeof e != "object")
    return null;
  try {
    return JSON.stringify(e);
  } catch {
    return null;
  }
}, A = (e) => {
  try {
    const t = e ? { session: { ...e } } : { session: null };
    window.dispatchEvent(new CustomEvent($, { detail: t }));
  } catch (t) {
    console.warn("[SessionManager] Session event dispatch failed:", t);
  }
}, K = (e) => {
  if (!e || typeof e != "object")
    return null;
  const t = { ...e }, r = D(t);
  try {
    const a = localStorage.getItem(h);
    if (r && a === r)
      return k(a) ?? t;
    localStorage.setItem(h, r ?? JSON.stringify(t));
  } catch (a) {
    console.warn("[SessionManager] Session save failed:", a);
  }
  return A(t), t;
}, R = () => {
  try {
    if (localStorage.getItem(h) === null)
      return;
    localStorage.removeItem(h);
  } catch (e) {
    console.warn("[SessionManager] Session clear failed:", e);
  }
  A(null);
}, V = async () => {
  const e = await fetch(j(M), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json"
    }
  });
  if (e.status === 401)
    return R(), null;
  if (!e.ok)
    throw new Error(`Session fetch failed: ${e.status}`);
  const t = await e.json();
  return !(t != null && t.success) || !(t != null && t.user) ? null : K(t.user);
}, me = async () => {
  try {
    return await V();
  } catch (e) {
    return console.warn("[SessionManager] Session resolve failed:", e), null;
  }
}, pe = async () => {
  try {
    await fetch(j(z), {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json"
      }
    });
  } catch (e) {
    console.warn("[SessionManager] Logout request failed:", e);
  } finally {
    R();
  }
}, S = (e) => {
  if (e === null || typeof e != "object")
    return e;
  const t = Object.getOwnPropertyNames(e);
  for (const r of t) {
    const a = e[r];
    a && typeof a == "object" && !Object.isFrozen(a) && S(a);
  }
  return Object.freeze(e);
}, n = (e, t = {}) => Object.freeze({
  kind: "page",
  path: e,
  ...t
}), d = (e, t, r = {}) => Object.freeze({
  kind: "hash-page",
  path: e,
  hash: t,
  ...r
}), Y = (e, t = {}) => Object.freeze({
  kind: "external",
  url: e,
  ...t
}), w = (e) => {
  if (!e || typeof e != "object")
    return e;
  if ("kind" in e) {
    if (e.kind === "external")
      return e.url;
    const t = e.defaultQuery ? `?${new URLSearchParams(e.defaultQuery).toString()}` : "", r = e.hash ?? "";
    return `${e.path}${t}${r}`;
  }
  return Object.fromEntries(
    Object.entries(e).map(([t, r]) => [t, w(r)])
  );
}, b = S({
  HOME: n("/index.html"),
  AUTH: {
    LOGIN: n("/pages/auth/login.html", { shellStrategy: "auth-shell" }),
    SIGNUP: n("/pages/auth/signup.html", { shellStrategy: "auth-shell" }),
    PASS_AUTH: n("/pages/auth/pass_auth.html"),
    OAUTH_CALLBACK: n("/pages/auth/oauth_callback.html")
  },
  CS: {
    CUSTOMER_CENTER: n("/pages/cs/customer_center.html"),
    NOTICE: d("/pages/cs/customer_center.html", "#/notices"),
    FAQ: d("/pages/cs/customer_center.html", "#/faqs"),
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
    RENT_CAR: Y("https://jejurentcar.netlify.app/"),
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
        NOTICE: d("/pages/cs/customer_center.html", "#/notices")
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
}), de = S(w(b)), Q = /:([A-Za-z0-9_]+)|\{([A-Za-z0-9_]+)\}/g, x = /^[a-z][a-z0-9+.-]*:/i, g = "shell", F = "jeju:mypage-shell", J = /* @__PURE__ */ new Set(["main", "stay", "air"]), q = (e, t) => t.split(".").reduce((r, a) => {
  if (r && typeof r == "object" && a in r)
    return r[a];
}, e), W = (e) => {
  if (!e || typeof e != "object")
    return "";
  if (e.kind === "external")
    return e.url;
  const t = e.defaultQuery ? `?${new URLSearchParams(e.defaultQuery).toString()}` : "", r = e.hash ?? "";
  return `${e.path}${t}${r}`;
}, Z = (e, t, r) => {
  const a = new URLSearchParams();
  for (const [o, i] of Object.entries(t))
    if (!(r.has(o) || i === void 0 || i === null)) {
      if (Array.isArray(i)) {
        i.forEach((l) => {
          l != null && a.append(o, String(l));
        });
        continue;
      }
      a.append(o, String(i));
    }
  const s = a.toString();
  return s ? `${e}${e.includes("?") ? "&" : "?"}${s}` : e;
}, X = () => {
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
}, ee = () => {
  var e;
  return typeof window < "u" && typeof ((e = window.location) == null ? void 0 : e.origin) == "string" ? new URL(window.location.origin) : new URL("/", import.meta.url);
}, te = (e) => x.test(e) ? e : e.startsWith("/") ? new URL(e, ee()).href : new URL(e, X()).href, u = (e) => {
  if (typeof e != "string")
    return null;
  const t = e.trim().toLowerCase();
  return J.has(t) ? t : null;
}, re = (e = "") => {
  const t = String(e).toLowerCase();
  return t.includes("/jejuair/") ? "air" : t.includes("/jejustay/") ? "stay" : "main";
}, ne = () => {
  var t, r, a;
  if (typeof window > "u")
    return "main";
  try {
    const s = new URLSearchParams(window.location.search), o = u(s.get(g));
    if (o)
      return o;
  } catch {
  }
  if (typeof document < "u") {
    const s = u((r = (t = document.body) == null ? void 0 : t.dataset) == null ? void 0 : r.mypageShell);
    if (s)
      return s;
  }
  const e = re(window.location.pathname);
  if (e)
    return e;
  try {
    const s = u((a = window.sessionStorage) == null ? void 0 : a.getItem(F));
    if (s)
      return s;
  } catch {
  }
  return "main";
}, ae = (e, t) => {
  const r = e.defaultQuery ? {
    ...e.defaultQuery,
    ...t
  } : t;
  if (!e || e.shellStrategy !== "auth-shell" || u(r == null ? void 0 : r[g]))
    return r;
  const a = ne();
  return {
    ...r,
    [g]: a
  };
}, _ = (e, t = {}) => {
  if (typeof e != "string" || e.trim() === "")
    throw new TypeError("[RouteResolver] routeKey must be a non-empty string.");
  if (t === null || typeof t != "object" || Array.isArray(t))
    throw new TypeError("[RouteResolver] params must be a plain object.");
  const r = e.trim(), a = q(b, r);
  if (!a || typeof a != "object" || !a.kind)
    throw new Error(`[RouteResolver] Route key not found: ${e}`);
  const s = W(a);
  if (typeof s != "string" || s.trim() === "")
    throw new Error(`[RouteResolver] Route template not found: ${e}`);
  const o = ae(a, t), i = new Set(a.defaultQuery ? Object.keys(a.defaultQuery) : []), l = s.replace(Q, (ue, L, v) => {
    const m = L || v, p = o[m];
    if (p == null)
      throw new Error(`[RouteResolver] Missing route param: ${m} (${e})`);
    return i.add(m), encodeURIComponent(String(p));
  }), c = l.indexOf("#"), O = c >= 0 ? l.slice(0, c) : l, T = c >= 0 ? l.slice(c) : "", N = `${te(O)}${T}`;
  return Z(N, o, i);
};
let E = !1;
const se = ["ctrlKey", "metaKey", "shiftKey", "altKey"], oe = (e) => se.some((t) => !!e[t]), I = (e) => {
  const t = e.getAttribute("data-route-params");
  if (!t)
    return {};
  try {
    const r = JSON.parse(t);
    return r && typeof r == "object" && !Array.isArray(r) ? r : {};
  } catch {
    return console.warn("[RouterBinder] Invalid data-route-params JSON:", t), {};
  }
}, ie = (e) => {
  var r;
  const t = e.getAttribute("data-route");
  if (t)
    try {
      const a = I(e), s = _(t, a), o = e.getAttribute("data-route-mode") || "assign", i = (r = window.__JEJU_ROUTE_NAVIGATOR__) == null ? void 0 : r.safeNavigate;
      if (i) {
        i(s, "router-binder", { mode: o });
        return;
      }
      if (o === "replace") {
        window.location.replace(s);
        return;
      }
      window.location.assign(s);
    } catch (a) {
      console.warn(`[RouterBinder] Failed to resolve route '${t}':`, a);
    }
}, f = (e) => {
  if (!(e instanceof Element))
    return;
  const t = [];
  e.matches("[data-route]") && t.push(e), t.push(...e.querySelectorAll("[data-route]")), t.forEach((r) => {
    if (!(r instanceof HTMLAnchorElement))
      return;
    const a = r.getAttribute("data-route");
    if (a)
      try {
        const s = I(r), o = _(a, s);
        r.setAttribute("href", o);
      } catch (s) {
        r.setAttribute("href", "#"), console.warn(`[RouterBinder] Failed to hydrate href for '${a}':`, s);
      }
  });
}, le = () => {
  if (!document.body)
    return;
  new MutationObserver((t) => {
    t.forEach((r) => {
      r.addedNodes.forEach((a) => {
        f(a);
      });
    });
  }).observe(document.body, {
    childList: !0,
    subtree: !0
  });
}, ce = (e = document) => {
  if (e instanceof Document) {
    f(e.documentElement);
    return;
  }
  f(e);
}, ge = () => {
  E || (E = !0, ce(document), le(), document.body.addEventListener("click", (e) => {
    const t = e.target.closest("[data-route]");
    t && (e.defaultPrevented || t.hasAttribute("data-route-animated-nav") || oe(e) || t instanceof HTMLAnchorElement && t.getAttribute("target") && t.getAttribute("target") !== "_self" || (e.preventDefault(), ie(t)));
  }));
};
function fe(e) {
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
function Se(e) {
  return /[<>'";\(\)={}]/.test(e) ? (console.warn("Security Warning: Invalid parameter detected"), !1) : !0;
}
export {
  H as A,
  de as R,
  _ as a,
  K as b,
  he as h,
  ge as i,
  pe as l,
  me as r,
  fe as s,
  Se as v
};
