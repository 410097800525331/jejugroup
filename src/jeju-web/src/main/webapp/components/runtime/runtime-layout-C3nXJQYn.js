import { c as F, r as Y, j as v } from "./react-vendor-BoSfm_Te.js";
import { M as W, a as q, H as z } from "./feature-layout-Y4UHQunU.js";
import { g as $, h as Q, r as d, l as X, a as Z, i as ee } from "./legacy-core-BoI547nw.js";
const U = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
};
let R = !1, p = null, m = null, u = null;
const I = () => {
  const e = document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header");
  if (e) {
    if (window.scrollY > 20) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, te = () => {
  R || (R = !0, window.addEventListener("scroll", I), I());
}, D = () => {
  p !== null && (window.clearTimeout(p), p = null);
}, P = (e, t) => {
  t.classList.remove("active"), m === e && (m = null), u === t && (u = null);
}, _ = (e, t) => {
  D(), u && u !== t && m && P(m, u), t.classList.add("active"), m = e, u = t;
}, T = (e, t) => {
  D(), p = window.setTimeout(() => {
    e.matches(":hover") || t.matches(":hover") || P(e, t);
  }, 120);
}, re = () => {
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
}, ne = () => {
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
}, ae = () => {
  document.querySelectorAll(".hotel-shell-mega-dropdown").forEach((e) => {
    if (e.dataset.previewInit === "true")
      return;
    e.dataset.previewInit = "true";
    const t = e.querySelector(".hotel-shell-preview-image");
    t && t.classList.add("active");
  });
}, oe = () => {
  te(), re(), ne(), ae();
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
}, B = "userSession", se = "jeju:session-updated";
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
}, ie = () => {
  if (N) {
    S();
    return;
  }
  N = !0, window.addEventListener("scroll", S), S();
}, le = () => {
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
}, ce = () => {
  const e = document.getElementById("mobileMenuBtn"), t = document.getElementById("mobileNav");
  !e || !t || e.dataset.mobileToggleBound !== "true" && (e.dataset.mobileToggleBound = "true", e.addEventListener("click", () => {
    t.classList.toggle("active");
  }));
}, de = () => document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn"), ue = (e) => {
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
}, me = () => document.getElementById("headerAuthActionBtn"), G = () => document.getElementById("indexReservationCheckBtn"), he = () => {
  const e = G(), t = e == null ? void 0 : e.previousElementSibling;
  return t instanceof HTMLElement && t.classList.contains("util-divider") ? t : null;
}, j = () => (document.documentElement.getAttribute("lang") || document.documentElement.lang || "ko").trim().toLowerCase(), fe = (e, t) => {
  const r = e.querySelector("[data-auth-label]");
  if (!r)
    return null;
  const a = j().startsWith("ko");
  return t ? a ? r.dataset.authMemberLabelKo || r.dataset.authMemberLabelEn || "마이페이지" : r.dataset.authMemberLabelEn || r.dataset.authMemberLabelKo || "My Page" : a ? r.dataset.authLabelKo || r.dataset.authLabelEn || "비회원 예약확인" : r.dataset.authLabelEn || r.dataset.authLabelKo || "Guest Reservation Check";
}, ge = (e) => {
  const t = e.querySelector("[data-auth-label]");
  return t ? j().startsWith("ko") ? t.dataset.authAdminLabelKo || t.dataset.authAdminLabelEn || "관리자 페이지" : t.dataset.authAdminLabelEn || t.dataset.authAdminLabelKo || "Admin Page" : null;
}, pe = (e) => `<i data-lucide="shield-check"${` class="${e}"`} aria-hidden="true"></i>`, ve = (e) => {
  e.hasAttribute("data-original-icon-html") || e.setAttribute("data-original-icon-html", e.innerHTML);
}, Ee = (e, t) => {
  ve(e), e.innerHTML = t;
}, g = (e) => {
  const t = e.getAttribute("data-original-icon-html");
  t !== null && (e.innerHTML = t);
}, Ae = (e) => {
  const t = document.querySelector(".mypage-cta");
  if (!t)
    return;
  const r = e ? "ADMIN.DASHBOARD" : "MYPAGE.DASHBOARD", n = e ? void 0 : { shell: "main" }, a = t.querySelector('[data-auth-icon="member"]'), o = t.querySelector('[data-auth-icon="admin"]');
  a && (a.hidden = e), o && (o.hidden = !e), t.setAttribute("data-route", r), n ? t.setAttribute("data-route-params", JSON.stringify(n)) : t.removeAttribute("data-route-params"), "href" in t && (t.href = e ? d(r) : d(r, n)), t.setAttribute("aria-label", e ? "관리자 페이지" : "마이페이지");
}, K = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    K(e + 1);
  }, 100);
}, be = async (e) => {
  const t = e.querySelector("span");
  t ? t.textContent = "로그아웃" : e.textContent = "로그아웃", "href" in e && (e.href = "#"), e.removeAttribute("data-route"), e.dataset.logoutBound !== "true" && (e.dataset.logoutBound = "true", e.addEventListener("click", async (r) => {
    r.preventDefault(), r.stopPropagation();
    try {
      await X();
    } catch {
      localStorage.removeItem(B);
    }
    window.location.reload();
  }));
}, ye = (e) => {
  if (e.dataset.logoutBound === "true") {
    const n = e.cloneNode(!0);
    n.removeAttribute("data-logout-bound"), e.replaceWith(n), e = n;
  }
  const t = e.querySelector("span");
  t ? t.textContent = "로그인" : e.textContent = "로그인";
  const r = ue(e);
  "href" in e && (e.href = d("AUTH.LOGIN", r)), e.setAttribute("data-route", "AUTH.LOGIN"), e.setAttribute("data-route-params", JSON.stringify(r)), e.removeAttribute("data-logout-bound");
}, we = (e, t, r) => {
  const n = e.querySelector('[data-auth-icon="guest"]'), a = e.querySelector('[data-auth-icon="member"]'), o = e.querySelector("[data-auth-label]"), s = r ? ge(e) : fe(e, t);
  if (t) {
    e.removeAttribute("data-action");
    const i = r ? "ADMIN.DASHBOARD" : "MYPAGE.DASHBOARD", c = r ? void 0 : { shell: "stay" };
    e.setAttribute("data-route", i), c ? e.setAttribute("data-route-params", JSON.stringify(c)) : e.removeAttribute("data-route-params"), e.setAttribute("href", r ? d(i) : d(i, c)), n && (n.hidden = !0, g(n)), a && (a.hidden = !1, r ? Ee(a, pe("hotel-shell-util-icon")) : g(a)), o && (o.textContent = s ?? "마이페이지");
    return;
  }
  e.setAttribute("data-action", "OPEN_RESERVATION_DRAWER"), e.removeAttribute("data-route"), e.removeAttribute("data-route-params"), e.setAttribute("href", d("SERVICES.AIR.BOOKING.GUEST_RESERVATION")), n && (n.hidden = !1, g(n)), a && (a.hidden = !0, g(a)), o && (o.textContent = s ?? "비회원 예약확인");
}, Le = (e) => {
  const t = e.querySelector("#indexAdminBtn");
  if (!t)
    return;
  const r = t.nextElementSibling;
  t.remove(), r instanceof HTMLElement && r.classList.contains("util-divider") && r.remove();
}, Se = async () => {
  try {
    return await Z();
  } catch {
    return null;
  }
}, V = (e) => {
  const t = document.getElementById("headerAdminBtn"), r = de(), n = me(), a = G(), o = document.getElementById("index-header-util"), s = !!e, i = Q(e);
  Ae(i), r && (s ? be(r) : ye(r)), n && we(n, s, i), a && (a.hidden = s);
  const c = he();
  c && (c.hidden = s), t && (t.style.display = "none", t.setAttribute("aria-hidden", "true"), t.setAttribute("tabindex", "-1"), t.removeAttribute("data-route")), o && Le(o), K();
}, Re = async () => {
  const e = await Se();
  V(e);
}, h = (e = 0) => {
  L || (L = !0, V($()), setTimeout(async () => {
    L = !1, await Re();
  }, 0));
}, y = (e = 0) => {
  if (!J()) {
    e < 20 && window.setTimeout(() => {
      y(e + 1);
    }, 50);
    return;
  }
  ie(), le(), ce(), oe(), k();
}, Ie = (e = 0) => {
  y(e), h();
}, ke = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    Ie();
  }), window.addEventListener("storage", (e) => {
    e.key === B && h();
  }), window.addEventListener(se, () => {
    h();
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
}), w = () => {
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
}, Je = (e) => new URL(e, w()).href, O = /* @__PURE__ */ new Map(), Ne = (e) => new Promise((t) => {
  requestAnimationFrame(() => {
    Promise.resolve(e == null ? void 0 : e()).catch((r) => {
      console.error("[ShellRuntime] onLoaded failed", r);
    }).finally(t);
  });
}), b = (e, t, r) => {
  const n = document.getElementById(e);
  if (!n)
    return Promise.resolve();
  const a = O.get(e);
  a && a.unmount();
  const o = F(n);
  return O.set(e, o), Y.flushSync(() => {
    o.render(t);
  }), Ne(r);
}, f = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    f(e + 1);
  }, 100);
}, Ge = async () => {
  const e = w();
  await Promise.all([
    b("main-header-placeholder", /* @__PURE__ */ v.jsx(W, { basePath: e }), async () => {
      y(), f(), l("main-header");
    }),
    b("main-footer-placeholder", /* @__PURE__ */ v.jsx(q, {}), async () => {
      U(), f(), l("main-footer");
    })
  ]), l("main-shell"), h();
}, je = async () => {
  const e = w();
  await Promise.all([
    b("hotel-header-placeholder", /* @__PURE__ */ v.jsx(z, { basePath: e }), async () => {
      y(), f(), l("hotel-header"), l("main-header");
    }),
    b("hotel-footer-placeholder", /* @__PURE__ */ v.jsx(q, {}), async () => {
      U(), f(), l("hotel-footer"), l("main-footer");
    })
  ]), l("hotel-shell"), h();
}, x = (e, t = "shell-runtime") => {
  var r;
  if ((r = window.__JEJU_ROUTE_NAVIGATOR__) != null && r.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(e, t);
    return;
  }
  window.location.assign(e);
}, Oe = () => {
  var e;
  return (e = window.__JEJU_ROUTE_NAVIGATOR__) != null && e.homeUrl ? window.__JEJU_ROUTE_NAVIGATOR__.homeUrl : new URL("index.html", w()).href;
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
      ee();
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
  oe as b,
  k as c,
  ke as d,
  Pe as e,
  Ke as f,
  je as g,
  Ge as h,
  Ie as i,
  w as j,
  Be as k,
  l as m,
  Je as r,
  He as w
};
