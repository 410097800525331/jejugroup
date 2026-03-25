import { c as j, r as V, j as f } from "./react-vendor-BoSfm_Te.js";
import { M as F, a as U, H as K } from "./feature-layout-BdQR-b-Q.js";
import { r as Y, c as W, l as z, a as g, i as Q } from "./legacy-core-CKE3csu2.js";
const q = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
};
let R = !1, h = null, d = null, l = null;
const _ = () => {
  const e = document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header");
  if (e) {
    if (window.scrollY > 20) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, $ = () => {
  R || (R = !0, window.addEventListener("scroll", _), _());
}, D = () => {
  h !== null && (window.clearTimeout(h), h = null);
}, B = (e, t) => {
  t.classList.remove("active"), d === e && (d = null), l === t && (l = null);
}, I = (e, t) => {
  D(), l && l !== t && d && B(d, l), t.classList.add("active"), d = e, l = t;
}, T = (e, t) => {
  D(), h = window.setTimeout(() => {
    e.matches(":hover") || t.matches(":hover") || B(e, t);
  }, 120);
}, X = () => {
  document.querySelectorAll(".hotel-shell-nav-item").forEach((t) => {
    if (t.dataset.megaHoverBound === "true")
      return;
    const r = t.querySelector(".hotel-shell-mega-dropdown");
    r && (t.dataset.megaHoverBound = "true", t.addEventListener("mouseenter", () => {
      I(t, r);
    }), t.addEventListener("mouseleave", () => {
      T(t, r);
    }), r.addEventListener("mouseenter", () => {
      I(t, r);
    }), r.addEventListener("mouseleave", () => {
      T(t, r);
    }));
  });
}, Z = () => {
  document.querySelectorAll(".hotel-shell-mega-menu-item").forEach((t) => {
    t.dataset.previewHoverBound !== "true" && (t.dataset.previewHoverBound = "true", t.addEventListener("mouseenter", () => {
      const r = t.closest(".hotel-shell-mega-dropdown"), n = t.getAttribute("data-preview"), a = n ? document.getElementById(n) : null;
      if (!r || !a)
        return;
      r.querySelectorAll(".hotel-shell-preview-image").forEach((i) => {
        i.classList.remove("active");
      }), a.classList.add("active");
      const o = r.querySelector(".hotel-shell-preview-loader");
      o && (o.style.display = "none");
    }));
  });
}, ee = () => {
  document.querySelectorAll(".hotel-shell-mega-dropdown").forEach((e) => {
    if (e.dataset.previewInit === "true")
      return;
    e.dataset.previewInit = "true";
    const t = e.querySelector(".hotel-shell-preview-image");
    t && t.classList.add("active");
  });
}, te = () => {
  $(), X(), Z(), ee();
};
let H = !1;
const N = (e, t) => {
  const r = document.createElement("span");
  return r.className = t, r.setAttribute("aria-hidden", t.includes("clone") ? "true" : "false"), e.split("").forEach((n, a) => {
    const o = document.createElement("span");
    o.className = "stagger-char", o.textContent = n === " " ? " " : n, o.style.transitionDelay = `${a * 30}ms`, r.appendChild(o);
  }), r;
}, k = () => {
  document.querySelectorAll(".hotel-shell-nav-link, .nav-link").forEach((t) => {
    var c;
    const r = t.querySelector("span[data-lang]") || t.querySelector("span");
    if (!r || r.querySelector(".stagger-wrapper"))
      return;
    const n = ((c = r.textContent) == null ? void 0 : c.trim()) ?? "";
    if (!n)
      return;
    const a = document.createElement("span");
    a.className = "stagger-wrapper", a.appendChild(N(n, "stagger-original")), a.appendChild(N(n, "stagger-clone")), r.textContent = "", r.appendChild(a);
    let o = !1, i = !1;
    t.addEventListener("mouseenter", () => {
      if (i = !0, o)
        return;
      o = !0, t.classList.add("is-animating");
      const m = n.length * 30 + 300 + 50;
      setTimeout(() => {
        o = !1, i || t.classList.remove("is-animating");
      }, m);
    }), t.addEventListener("mouseleave", () => {
      i = !1, o || t.classList.remove("is-animating");
    });
  });
}, He = () => {
  H || (H = !0, document.addEventListener("mainHeaderLoaded", k));
}, b = "userSession", re = "jeju:session-updated";
let x = !1, A = !1;
const P = () => document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header"), S = () => {
  const e = P();
  if (e) {
    if (window.scrollY > 50) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, ne = () => {
  if (x) {
    S();
    return;
  }
  x = !0, window.addEventListener("scroll", S), S();
}, ae = () => {
  document.querySelectorAll(".hotel-shell-mega-menu-item").forEach((t) => {
    t.dataset.previewBound !== "true" && (t.dataset.previewBound = "true", t.addEventListener("mouseenter", () => {
      const r = t.dataset.preview, n = t.closest(".hotel-shell-mega-dropdown");
      if (!r || !n)
        return;
      const a = n.querySelector(".hotel-shell-mega-menu-preview");
      a && a.querySelectorAll(".hotel-shell-preview-image").forEach((o) => {
        o.classList.toggle("active", o.id === r);
      });
    }));
  });
}, oe = () => {
  const e = document.getElementById("mobileMenuBtn"), t = document.getElementById("mobileNav");
  !e || !t || e.dataset.mobileToggleBound !== "true" && (e.dataset.mobileToggleBound = "true", e.addEventListener("click", () => {
    t.classList.toggle("active");
  }));
}, se = () => document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn"), ie = () => document.getElementById("headerAuthActionBtn"), G = () => document.getElementById("indexReservationCheckBtn"), ce = () => {
  const e = G(), t = e == null ? void 0 : e.previousElementSibling;
  return t instanceof HTMLElement && t.classList.contains("util-divider") ? t : null;
}, le = () => (document.documentElement.getAttribute("lang") || document.documentElement.lang || "ko").trim().toLowerCase(), de = (e, t) => {
  const r = e.querySelector("[data-auth-label]");
  if (!r)
    return null;
  const a = le().startsWith("ko");
  return t ? a ? r.dataset.authMemberLabelKo || r.dataset.authMemberLabelEn || "마이페이지" : r.dataset.authMemberLabelEn || r.dataset.authMemberLabelKo || "My Page" : a ? r.dataset.authLabelKo || r.dataset.authLabelEn || "비회원 예약확인" : r.dataset.authLabelEn || r.dataset.authLabelKo || "Guest Reservation Check";
}, J = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    J(e + 1);
  }, 100);
}, ue = async (e) => {
  const t = e.querySelector("span");
  t ? t.textContent = "로그아웃" : e.textContent = "로그아웃", "href" in e && (e.href = "#"), e.removeAttribute("data-route"), e.dataset.logoutBound !== "true" && (e.dataset.logoutBound = "true", e.addEventListener("click", async (r) => {
    r.preventDefault(), r.stopPropagation();
    try {
      await z();
    } catch {
      localStorage.removeItem(b);
    }
    window.location.reload();
  }));
}, me = (e) => {
  if (e.dataset.logoutBound === "true") {
    const r = e.cloneNode(!0);
    r.removeAttribute("data-logout-bound"), e.replaceWith(r), e = r;
  }
  const t = e.querySelector("span");
  t ? t.textContent = "로그인" : e.textContent = "로그인", "href" in e && (e.href = g("AUTH.LOGIN", { shell: "stay" })), e.setAttribute("data-route", "AUTH.LOGIN"), e.setAttribute("data-route-params", '{"shell":"stay"}'), e.removeAttribute("data-logout-bound");
}, he = (e, t) => {
  const r = e.querySelector('[data-auth-icon="guest"]'), n = e.querySelector('[data-auth-icon="member"]'), a = e.querySelector("[data-auth-label]"), o = de(e, t);
  if (t) {
    e.removeAttribute("data-action"), e.setAttribute("data-route", "MYPAGE.DASHBOARD"), e.setAttribute("data-route-params", '{"shell":"stay"}'), e.setAttribute("href", g("MYPAGE.DASHBOARD", { shell: "stay" })), r && (r.hidden = !0), n && (n.hidden = !1), a && (a.textContent = o ?? "마이페이지");
    return;
  }
  e.setAttribute("data-action", "OPEN_RESERVATION_DRAWER"), e.removeAttribute("data-route"), e.removeAttribute("data-route-params"), e.setAttribute("href", g("SERVICES.AIR.BOOKING.GUEST_RESERVATION")), r && (r.hidden = !1), n && (n.hidden = !0), a && (a.textContent = o ?? "비회원 예약확인");
}, fe = (e) => {
  if (e.querySelector('[data-route="ADMIN.DASHBOARD"]'))
    return;
  const t = document.createElement("a");
  t.id = "indexAdminBtn", t.href = "#", t.className = "util-link route-link", t.setAttribute("data-route", "ADMIN.DASHBOARD"), t.style.color = "#FF5000", t.style.fontWeight = "700", t.textContent = "관리자 페이지";
  const r = document.createElement("span");
  r.className = "util-divider", r.textContent = "|", e.prepend(t, r);
}, ge = async () => {
  try {
    return await Y();
  } catch {
  }
  try {
    const e = localStorage.getItem(b);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}, pe = async () => {
  try {
    return W();
  } catch {
    return !1;
  }
}, ve = async () => {
  const e = document.getElementById("headerAdminBtn"), t = se(), r = ie(), n = G(), a = document.getElementById("index-header-util"), [o, i] = await Promise.all([ge(), pe()]), c = !!o;
  t && (c ? await ue(t) : me(t)), r && he(r, c), n && (n.hidden = c);
  const m = ce();
  m && (m.hidden = c), i && e && (e.style.display = "flex"), i && a && fe(a), J();
}, L = () => {
  A || (A = !0, setTimeout(async () => {
    A = !1, await ve();
  }, 0));
}, E = (e = 0) => {
  if (!P()) {
    e < 20 && window.setTimeout(() => {
      E(e + 1);
    }, 50);
    return;
  }
  ne(), ae(), oe(), te(), k(), L();
}, Ne = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    E();
  }), window.addEventListener("storage", (e) => {
    e.key === b && L();
  }), window.addEventListener(re, () => {
    L();
  });
}, we = {
  "main-header": "mainHeaderLoaded",
  "main-footer": "mainFooterLoaded"
}, p = /* @__PURE__ */ new Set(), v = /* @__PURE__ */ new Map(), Ee = (e) => {
  const t = we[e];
  t && document.dispatchEvent(new Event(t));
}, ye = (e) => {
  (v.get(e) ?? []).forEach((r) => r()), v.delete(e);
}, xe = () => {
  window.__JEJU_RUNTIME_LIFECYCLE__ = {
    isReady: (e) => p.has(e),
    markReady: (e) => s(e),
    whenReady: (e) => Ae(e)
  };
}, s = (e) => {
  p.has(e) || (p.add(e), Ee(e), document.dispatchEvent(new CustomEvent("jeju:runtime-ready", { detail: { stage: e } })), ye(e));
}, Ae = (e) => p.has(e) ? Promise.resolve() : new Promise((t) => {
  const r = v.get(e) ?? [];
  r.push(t), v.set(e, r);
}), y = () => {
  var n;
  const e = new URL(
    /* @vite-ignore */
    "../../",
    import.meta.url
  ).href;
  if ((n = window.__JEJU_ROUTE_NAVIGATOR__) != null && n.appRoot)
    return new URL(window.__JEJU_ROUTE_NAVIGATOR__.appRoot, window.location.href).href;
  const t = document.currentScript;
  if (t != null && t.src)
    return new URL("../", t.src).href;
  const r = Array.from(document.getElementsByTagName("script"));
  for (const a of r) {
    const o = a.src || a.getAttribute("src");
    if (o && (o.includes("components/runtime/bootstrap.js") || o.includes("components/runtime/shell-runtime.js")))
      return new URL("../../", o).href;
  }
  return e;
}, Me = (e) => new URL(e, y()).href, M = /* @__PURE__ */ new Map(), Se = (e) => new Promise((t) => {
  requestAnimationFrame(() => {
    Promise.resolve(e == null ? void 0 : e()).catch((r) => {
      console.error("[ShellRuntime] onLoaded failed", r);
    }).finally(t);
  });
}), w = (e, t, r) => {
  const n = document.getElementById(e);
  if (!n)
    return Promise.resolve();
  const a = M.get(e);
  a && a.unmount();
  const o = j(n);
  return M.set(e, o), V.flushSync(() => {
    o.render(t);
  }), Se(r);
}, u = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    u(e + 1);
  }, 100);
}, Ce = async () => {
  const e = y();
  await Promise.all([
    w("main-header-placeholder", /* @__PURE__ */ f.jsx(F, { basePath: e }), async () => {
      E(), u(), s("main-header");
    }),
    w("main-footer-placeholder", /* @__PURE__ */ f.jsx(U, {}), async () => {
      q(), u(), s("main-footer");
    })
  ]), s("main-shell");
}, Oe = async () => {
  const e = y();
  await Promise.all([
    w("hotel-header-placeholder", /* @__PURE__ */ f.jsx(K, { basePath: e }), async () => {
      E(), u(), s("hotel-header"), s("main-header");
    }),
    w("hotel-footer-placeholder", /* @__PURE__ */ f.jsx(U, {}), async () => {
      q(), u(), s("hotel-footer"), s("main-footer");
    })
  ]), s("hotel-shell");
}, C = (e, t = "shell-runtime") => {
  var r;
  if ((r = window.__JEJU_ROUTE_NAVIGATOR__) != null && r.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(e, t);
    return;
  }
  window.location.assign(e);
}, Le = () => {
  var e;
  return (e = window.__JEJU_ROUTE_NAVIGATOR__) != null && e.homeUrl ? window.__JEJU_ROUTE_NAVIGATOR__.homeUrl : new URL("index.html", y()).href;
}, be = (e) => {
  const t = e.getAttribute("data-route-params");
  if (!t)
    return {};
  try {
    const r = JSON.parse(t);
    return r && typeof r == "object" && !Array.isArray(r) ? r : {};
  } catch {
    return {};
  }
}, Re = async (e) => {
  const t = e.getAttribute("data-route");
  if (t)
    try {
      const r = g(t, be(e));
      C(r, "shell-runtime-fallback");
    } catch {
      C(Le(), "shell-runtime-fallback-home");
    }
};
let O = !1;
const Ue = async () => {
  if (!O) {
    O = !0;
    try {
      Q();
      return;
    } catch (e) {
      console.warn("[ShellRuntime] router binder load failed", e);
    }
    document.body.addEventListener("click", async (e) => {
      var r;
      const t = (r = e.target) == null ? void 0 : r.closest("[data-route]");
      t && (e.preventDefault(), await Re(t));
    });
  }
};
export {
  q as a,
  te as b,
  k as c,
  Ne as d,
  He as e,
  Ue as f,
  Oe as g,
  Ce as h,
  E as i,
  y as j,
  xe as k,
  s as m,
  Me as r,
  Ae as w
};
