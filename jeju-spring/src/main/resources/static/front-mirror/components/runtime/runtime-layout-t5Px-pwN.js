import { c as W, r as z, j as v } from "./react-vendor-BoSfm_Te.js";
import { M as $, a as q, H as Q } from "./feature-layout-CKAG6DZw.js";
import { g as X, h as Z, r as d, l as ee, a as te, i as re } from "./legacy-core-BoI547nw.js";
const U = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
};
let R = !1, p = null, h = null, u = null;
const I = () => {
  const e = document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header");
  if (e) {
    if (window.scrollY > 20) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, ne = () => {
  R || (R = !0, window.addEventListener("scroll", I), I());
}, D = () => {
  p !== null && (window.clearTimeout(p), p = null);
}, P = (e, t) => {
  t.classList.remove("active"), h === e && (h = null), u === t && (u = null);
}, _ = (e, t) => {
  D(), u && u !== t && h && P(h, u), t.classList.add("active"), h = e, u = t;
}, T = (e, t) => {
  D(), p = window.setTimeout(() => {
    e.matches(":hover") || t.matches(":hover") || P(e, t);
  }, 120);
}, ae = () => {
  document.querySelectorAll(".hotel-shell-nav-item").forEach((t) => {
    if (t.dataset.megaHoverBound === "true")
      return;
    const r = t.querySelector(".hotel-shell-mega-dropdown");
    r && (t.dataset.megaHoverBound = "true", t.addEventListener("mouseenter", () => {
      _(t, r);
    }), t.addEventListener("mouseleave", () => {
      T(t, r);
    }), r.addEventListener("mouseenter", () => {
      _(t, r);
    }), r.addEventListener("mouseleave", () => {
      T(t, r);
    }));
  });
}, oe = () => {
  document.querySelectorAll(".hotel-shell-mega-menu-item").forEach((t) => {
    t.dataset.previewHoverBound !== "true" && (t.dataset.previewHoverBound = "true", t.addEventListener("mouseenter", () => {
      const r = t.closest(".hotel-shell-mega-dropdown"), n = t.getAttribute("data-preview"), a = n ? document.getElementById(n) : null;
      if (!r || !a)
        return;
      r.querySelectorAll(".hotel-shell-preview-image").forEach((s) => {
        s.classList.remove("active");
      }), a.classList.add("active");
      const o = r.querySelector(".hotel-shell-preview-loader");
      o && (o.style.display = "none");
    }));
  });
}, se = () => {
  document.querySelectorAll(".hotel-shell-mega-dropdown").forEach((e) => {
    if (e.dataset.previewInit === "true")
      return;
    e.dataset.previewInit = "true";
    const t = e.querySelector(".hotel-shell-preview-image");
    t && t.classList.add("active");
  });
}, ie = () => {
  ne(), ae(), oe(), se();
};
let M = !1;
const H = (e, t) => {
  const r = document.createElement("span");
  return r.className = t, r.setAttribute("aria-hidden", t.includes("clone") ? "true" : "false"), e.split("").forEach((n, a) => {
    const o = document.createElement("span");
    o.className = "stagger-char", o.textContent = n === " " ? " " : n, o.style.transitionDelay = `${a * 30}ms`, r.appendChild(o);
  }), r;
}, k = () => {
  document.querySelectorAll(".hotel-shell-nav-link, .nav-link").forEach((t) => {
    var i;
    const r = t.querySelector("span[data-lang]") || t.querySelector("span");
    if (!r || r.querySelector(".stagger-wrapper"))
      return;
    const n = ((i = r.textContent) == null ? void 0 : i.trim()) ?? "";
    if (!n)
      return;
    const a = document.createElement("span");
    a.className = "stagger-wrapper", a.appendChild(H(n, "stagger-original")), a.appendChild(H(n, "stagger-clone")), r.textContent = "", r.appendChild(a);
    let o = !1, s = !1;
    t.addEventListener("mouseenter", () => {
      if (s = !0, o)
        return;
      o = !0, t.classList.add("is-animating");
      const c = n.length * 30 + 300 + 50;
      setTimeout(() => {
        o = !1, s || t.classList.remove("is-animating");
      }, c);
    }), t.addEventListener("mouseleave", () => {
      s = !1, o || t.classList.remove("is-animating");
    });
  });
}, Pe = () => {
  M || (M = !0, document.addEventListener("mainHeaderLoaded", k));
}, B = "userSession", le = "jeju:session-updated";
let N = !1, L = !1;
const J = () => document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header"), S = () => {
  const e = J();
  if (e) {
    if (window.scrollY > 50) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, ce = () => {
  if (N) {
    S();
    return;
  }
  N = !0, window.addEventListener("scroll", S), S();
}, de = () => {
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
}, ue = () => {
  const e = document.getElementById("mobileMenuBtn"), t = document.getElementById("mobileNav");
  !e || !t || e.dataset.mobileToggleBound !== "true" && (e.dataset.mobileToggleBound = "true", e.addEventListener("click", () => {
    t.classList.toggle("active");
  }));
}, me = () => document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn"), he = (e) => {
  const t = e.getAttribute("data-route-params");
  if (t)
    try {
      const r = JSON.parse(t);
      if (typeof r.shell == "string" && r.shell.trim() !== "")
        return { shell: r.shell.trim() };
    } catch {
    }
  return {
    shell: e.id === "headerLoginBtn" ? "stay" : "main"
  };
}, fe = () => document.getElementById("headerAuthActionBtn"), G = () => document.getElementById("indexReservationCheckBtn"), ge = () => {
  const e = G(), t = e == null ? void 0 : e.previousElementSibling;
  return t instanceof HTMLElement && t.classList.contains("util-divider") ? t : null;
}, j = () => (document.documentElement.getAttribute("lang") || document.documentElement.lang || "ko").trim().toLowerCase(), pe = (e, t) => {
  const r = e.querySelector("[data-auth-label]");
  if (!r)
    return null;
  const a = j().startsWith("ko");
  return t ? a ? r.dataset.authMemberLabelKo || r.dataset.authMemberLabelEn || "마이페이지" : r.dataset.authMemberLabelEn || r.dataset.authMemberLabelKo || "My Page" : a ? r.dataset.authLabelKo || r.dataset.authLabelEn || "비회원 예약확인" : r.dataset.authLabelEn || r.dataset.authLabelKo || "Guest Reservation Check";
}, ve = (e) => {
  const t = e.querySelector("[data-auth-label]");
  return t ? j().startsWith("ko") ? t.dataset.authAdminLabelKo || t.dataset.authAdminLabelEn || "관리자 페이지" : t.dataset.authAdminLabelEn || t.dataset.authAdminLabelKo || "Admin Page" : null;
}, K = (e) => `<i data-lucide="shield-check"${e ? ` class="${e}"` : ""} aria-hidden="true"></i>`, Ee = (e) => {
  e.hasAttribute("data-original-icon-html") || e.setAttribute("data-original-icon-html", e.innerHTML);
}, V = (e, t) => {
  Ee(e), e.innerHTML = t;
}, m = (e) => {
  const t = e.getAttribute("data-original-icon-html");
  t !== null && (e.innerHTML = t);
}, Ae = (e) => {
  const t = document.querySelector(".mypage-cta");
  if (!t)
    return;
  const r = e ? "ADMIN.DASHBOARD" : "MYPAGE.DASHBOARD", n = e ? void 0 : { shell: "main" }, a = t.querySelector(".mypage-cta-icon");
  a && (e ? V(a, K()) : m(a)), t.setAttribute("data-route", r), n ? t.setAttribute("data-route-params", JSON.stringify(n)) : t.removeAttribute("data-route-params"), "href" in t && (t.href = e ? d(r) : d(r, n)), t.setAttribute("aria-label", e ? "관리자 페이지" : "마이페이지");
}, F = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    F(e + 1);
  }, 100);
}, ye = async (e) => {
  const t = e.querySelector("span");
  t ? t.textContent = "로그아웃" : e.textContent = "로그아웃", "href" in e && (e.href = "#"), e.removeAttribute("data-route"), e.dataset.logoutBound !== "true" && (e.dataset.logoutBound = "true", e.addEventListener("click", async (r) => {
    r.preventDefault(), r.stopPropagation();
    try {
      await ee();
    } catch {
      localStorage.removeItem(B);
    }
    window.location.reload();
  }));
}, we = (e) => {
  if (e.dataset.logoutBound === "true") {
    const n = e.cloneNode(!0);
    n.removeAttribute("data-logout-bound"), e.replaceWith(n), e = n;
  }
  const t = e.querySelector("span");
  t ? t.textContent = "로그인" : e.textContent = "로그인";
  const r = he(e);
  "href" in e && (e.href = d("AUTH.LOGIN", r)), e.setAttribute("data-route", "AUTH.LOGIN"), e.setAttribute("data-route-params", JSON.stringify(r)), e.removeAttribute("data-logout-bound");
}, be = (e, t, r) => {
  const n = e.querySelector('[data-auth-icon="guest"]'), a = e.querySelector('[data-auth-icon="member"]'), o = e.querySelector("[data-auth-label]"), s = r ? ve(e) : pe(e, t);
  if (t) {
    e.removeAttribute("data-action");
    const i = r ? "ADMIN.DASHBOARD" : "MYPAGE.DASHBOARD", c = r ? void 0 : { shell: "stay" };
    e.setAttribute("data-route", i), c ? e.setAttribute("data-route-params", JSON.stringify(c)) : e.removeAttribute("data-route-params"), e.setAttribute("href", r ? d(i) : d(i, c)), n && (n.hidden = !0, m(n)), a && (a.hidden = !1, r ? V(a, K("hotel-shell-util-icon")) : m(a)), o && (o.textContent = s ?? "마이페이지");
    return;
  }
  e.setAttribute("data-action", "OPEN_RESERVATION_DRAWER"), e.removeAttribute("data-route"), e.removeAttribute("data-route-params"), e.setAttribute("href", d("SERVICES.AIR.BOOKING.GUEST_RESERVATION")), n && (n.hidden = !1, m(n)), a && (a.hidden = !0, m(a)), o && (o.textContent = s ?? "비회원 예약확인");
}, Le = (e) => {
  const t = e.querySelector("#indexAdminBtn");
  if (!t)
    return;
  const r = t.nextElementSibling;
  t.remove(), r instanceof HTMLElement && r.classList.contains("util-divider") && r.remove();
}, Se = async () => {
  try {
    return await te();
  } catch {
    return null;
  }
}, Y = (e) => {
  const t = document.getElementById("headerAdminBtn"), r = me(), n = fe(), a = G(), o = document.getElementById("index-header-util"), s = !!e, i = Z(e);
  Ae(i), r && (s ? ye(r) : we(r)), n && be(n, s, i), a && (a.hidden = s);
  const c = ge();
  c && (c.hidden = s), t && (t.style.display = "none", t.setAttribute("aria-hidden", "true"), t.setAttribute("tabindex", "-1"), t.removeAttribute("data-route")), o && Le(o), F();
}, Re = async () => {
  const e = await Se();
  Y(e);
}, f = (e = 0) => {
  L || (L = !0, Y(X()), setTimeout(async () => {
    L = !1, await Re();
  }, 0));
}, w = (e = 0) => {
  if (!J()) {
    e < 20 && window.setTimeout(() => {
      w(e + 1);
    }, 50);
    return;
  }
  ce(), de(), ue(), ie(), k();
}, Ie = (e = 0) => {
  w(e), f();
}, ke = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    Ie();
  }), window.addEventListener("storage", (e) => {
    e.key === B && f();
  }), window.addEventListener(le, () => {
    f();
  });
}, _e = {
  "main-header": "mainHeaderLoaded",
  "main-footer": "mainFooterLoaded"
}, E = /* @__PURE__ */ new Set(), A = /* @__PURE__ */ new Map(), Te = (e) => {
  const t = _e[e];
  t && document.dispatchEvent(new Event(t));
}, Me = (e) => {
  (A.get(e) ?? []).forEach((r) => r()), A.delete(e);
}, Be = () => {
  window.__JEJU_RUNTIME_LIFECYCLE__ = {
    isReady: (e) => E.has(e),
    markReady: (e) => l(e),
    whenReady: (e) => He(e)
  };
}, l = (e) => {
  E.has(e) || (E.add(e), Te(e), document.dispatchEvent(new CustomEvent("jeju:runtime-ready", { detail: { stage: e } })), Me(e));
}, He = (e) => E.has(e) ? Promise.resolve() : new Promise((t) => {
  const r = A.get(e) ?? [];
  r.push(t), A.set(e, r);
}), b = () => {
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
}, Je = (e) => new URL(e, b()).href, O = /* @__PURE__ */ new Map(), Ne = (e) => new Promise((t) => {
  requestAnimationFrame(() => {
    Promise.resolve(e == null ? void 0 : e()).catch((r) => {
      console.error("[ShellRuntime] onLoaded failed", r);
    }).finally(t);
  });
}), y = (e, t, r) => {
  const n = document.getElementById(e);
  if (!n)
    return Promise.resolve();
  const a = O.get(e);
  a && a.unmount();
  const o = W(n);
  return O.set(e, o), z.flushSync(() => {
    o.render(t);
  }), Ne(r);
}, g = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    g(e + 1);
  }, 100);
}, Ge = async () => {
  const e = b();
  await Promise.all([
    y("main-header-placeholder", /* @__PURE__ */ v.jsx($, { basePath: e }), async () => {
      w(), g(), l("main-header");
    }),
    y("main-footer-placeholder", /* @__PURE__ */ v.jsx(q, {}), async () => {
      U(), g(), l("main-footer");
    })
  ]), l("main-shell"), f();
}, je = async () => {
  const e = b();
  await Promise.all([
    y("hotel-header-placeholder", /* @__PURE__ */ v.jsx(Q, { basePath: e }), async () => {
      w(), g(), l("hotel-header"), l("main-header");
    }),
    y("hotel-footer-placeholder", /* @__PURE__ */ v.jsx(q, {}), async () => {
      U(), g(), l("hotel-footer"), l("main-footer");
    })
  ]), l("hotel-shell"), f();
}, x = (e, t = "shell-runtime") => {
  var r;
  if ((r = window.__JEJU_ROUTE_NAVIGATOR__) != null && r.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(e, t);
    return;
  }
  window.location.assign(e);
}, Oe = () => {
  var e;
  return (e = window.__JEJU_ROUTE_NAVIGATOR__) != null && e.homeUrl ? window.__JEJU_ROUTE_NAVIGATOR__.homeUrl : new URL("index.html", b()).href;
}, xe = (e) => {
  const t = e.getAttribute("data-route-params");
  if (!t)
    return {};
  try {
    const r = JSON.parse(t);
    return r && typeof r == "object" && !Array.isArray(r) ? r : {};
  } catch {
    return {};
  }
}, Ce = async (e) => {
  const t = e.getAttribute("data-route");
  if (t)
    try {
      const r = d(t, xe(e));
      x(r, "shell-runtime-fallback");
    } catch {
      x(Oe(), "shell-runtime-fallback-home");
    }
};
let C = !1;
const Ke = async () => {
  if (!C) {
    C = !0;
    try {
      re();
      return;
    } catch (e) {
      console.warn("[ShellRuntime] router binder load failed", e);
    }
    document.body.addEventListener("click", async (e) => {
      var r;
      const t = (r = e.target) == null ? void 0 : r.closest("[data-route]");
      t && (e.preventDefault(), await Ce(t));
    });
  }
};
export {
  U as a,
  ie as b,
  k as c,
  ke as d,
  Pe as e,
  Ke as f,
  je as g,
  Ge as h,
  Ie as i,
  b as j,
  Be as k,
  l as m,
  Je as r,
  He as w
};
