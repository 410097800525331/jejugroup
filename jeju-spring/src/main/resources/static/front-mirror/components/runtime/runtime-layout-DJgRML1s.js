import { c as F, r as K, j as g } from "./react-vendor-BoSfm_Te.js";
import { M as Y, a as q, H as W } from "./feature-layout-BdQR-b-Q.js";
import { r as z, c as Q, l as $, a as p, i as X } from "./legacy-core-CKE3csu2.js";
const D = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
};
let _ = !1, f = null, u = null, d = null;
const I = () => {
  const e = document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header");
  if (e) {
    if (window.scrollY > 20) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, Z = () => {
  _ || (_ = !0, window.addEventListener("scroll", I), I());
}, B = () => {
  f !== null && (window.clearTimeout(f), f = null);
}, P = (e, t) => {
  t.classList.remove("active"), u === e && (u = null), d === t && (d = null);
}, T = (e, t) => {
  B(), d && d !== t && u && P(u, d), t.classList.add("active"), u = e, d = t;
}, N = (e, t) => {
  B(), f = window.setTimeout(() => {
    e.matches(":hover") || t.matches(":hover") || P(e, t);
  }, 120);
}, ee = () => {
  document.querySelectorAll(".hotel-shell-nav-item").forEach((t) => {
    if (t.dataset.megaHoverBound === "true")
      return;
    const r = t.querySelector(".hotel-shell-mega-dropdown");
    r && (t.dataset.megaHoverBound = "true", t.addEventListener("mouseenter", () => {
      T(t, r);
    }), t.addEventListener("mouseleave", () => {
      N(t, r);
    }), r.addEventListener("mouseenter", () => {
      T(t, r);
    }), r.addEventListener("mouseleave", () => {
      N(t, r);
    }));
  });
}, te = () => {
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
}, re = () => {
  document.querySelectorAll(".hotel-shell-mega-dropdown").forEach((e) => {
    if (e.dataset.previewInit === "true")
      return;
    e.dataset.previewInit = "true";
    const t = e.querySelector(".hotel-shell-preview-image");
    t && t.classList.add("active");
  });
}, ne = () => {
  Z(), ee(), te(), re();
};
let H = !1;
const x = (e, t) => {
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
    a.className = "stagger-wrapper", a.appendChild(x(n, "stagger-original")), a.appendChild(x(n, "stagger-clone")), r.textContent = "", r.appendChild(a);
    let o = !1, i = !1;
    t.addEventListener("mouseenter", () => {
      if (i = !0, o)
        return;
      o = !0, t.classList.add("is-animating");
      const l = n.length * 30 + 300 + 50;
      setTimeout(() => {
        o = !1, i || t.classList.remove("is-animating");
      }, l);
    }), t.addEventListener("mouseleave", () => {
      i = !1, o || t.classList.remove("is-animating");
    });
  });
}, Me = () => {
  H || (H = !0, document.addEventListener("mainHeaderLoaded", k));
}, b = "userSession", ae = "jeju:session-updated";
let M = !1, S = !1;
const J = () => document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header"), L = () => {
  const e = J();
  if (e) {
    if (window.scrollY > 50) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, oe = () => {
  if (M) {
    L();
    return;
  }
  M = !0, window.addEventListener("scroll", L), L();
}, se = () => {
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
}, ie = () => {
  const e = document.getElementById("mobileMenuBtn"), t = document.getElementById("mobileNav");
  !e || !t || e.dataset.mobileToggleBound !== "true" && (e.dataset.mobileToggleBound = "true", e.addEventListener("click", () => {
    t.classList.toggle("active");
  }));
}, ce = () => document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn"), le = (e) => {
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
}, de = () => document.getElementById("headerAuthActionBtn"), G = () => document.getElementById("indexReservationCheckBtn"), ue = () => {
  const e = G(), t = e == null ? void 0 : e.previousElementSibling;
  return t instanceof HTMLElement && t.classList.contains("util-divider") ? t : null;
}, me = () => (document.documentElement.getAttribute("lang") || document.documentElement.lang || "ko").trim().toLowerCase(), he = (e, t) => {
  const r = e.querySelector("[data-auth-label]");
  if (!r)
    return null;
  const a = me().startsWith("ko");
  return t ? a ? r.dataset.authMemberLabelKo || r.dataset.authMemberLabelEn || "마이페이지" : r.dataset.authMemberLabelEn || r.dataset.authMemberLabelKo || "My Page" : a ? r.dataset.authLabelKo || r.dataset.authLabelEn || "비회원 예약확인" : r.dataset.authLabelEn || r.dataset.authLabelKo || "Guest Reservation Check";
}, j = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    j(e + 1);
  }, 100);
}, fe = async (e) => {
  const t = e.querySelector("span");
  t ? t.textContent = "로그아웃" : e.textContent = "로그아웃", "href" in e && (e.href = "#"), e.removeAttribute("data-route"), e.dataset.logoutBound !== "true" && (e.dataset.logoutBound = "true", e.addEventListener("click", async (r) => {
    r.preventDefault(), r.stopPropagation();
    try {
      await $();
    } catch {
      localStorage.removeItem(b);
    }
    window.location.reload();
  }));
}, ge = (e) => {
  if (e.dataset.logoutBound === "true") {
    const n = e.cloneNode(!0);
    n.removeAttribute("data-logout-bound"), e.replaceWith(n), e = n;
  }
  const t = e.querySelector("span");
  t ? t.textContent = "로그인" : e.textContent = "로그인";
  const r = le(e);
  "href" in e && (e.href = p("AUTH.LOGIN", r)), e.setAttribute("data-route", "AUTH.LOGIN"), e.setAttribute("data-route-params", JSON.stringify(r)), e.removeAttribute("data-logout-bound");
}, pe = (e, t) => {
  const r = e.querySelector('[data-auth-icon="guest"]'), n = e.querySelector('[data-auth-icon="member"]'), a = e.querySelector("[data-auth-label]"), o = he(e, t);
  if (t) {
    e.removeAttribute("data-action"), e.setAttribute("data-route", "MYPAGE.DASHBOARD"), e.setAttribute("data-route-params", '{"shell":"stay"}'), e.setAttribute("href", p("MYPAGE.DASHBOARD", { shell: "stay" })), r && (r.hidden = !0), n && (n.hidden = !1), a && (a.textContent = o ?? "마이페이지");
    return;
  }
  e.setAttribute("data-action", "OPEN_RESERVATION_DRAWER"), e.removeAttribute("data-route"), e.removeAttribute("data-route-params"), e.setAttribute("href", p("SERVICES.AIR.BOOKING.GUEST_RESERVATION")), r && (r.hidden = !1), n && (n.hidden = !0), a && (a.textContent = o ?? "비회원 예약확인");
}, ve = (e) => {
  if (e.querySelector('[data-route="ADMIN.DASHBOARD"]'))
    return;
  const t = document.createElement("a");
  t.id = "indexAdminBtn", t.href = "#", t.className = "util-link route-link", t.setAttribute("data-route", "ADMIN.DASHBOARD"), t.style.color = "#FF5000", t.style.fontWeight = "700", t.textContent = "관리자 페이지";
  const r = document.createElement("span");
  r.className = "util-divider", r.textContent = "|", e.prepend(t, r);
}, we = async () => {
  try {
    return await z();
  } catch {
  }
  try {
    const e = localStorage.getItem(b);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}, Ee = async () => {
  try {
    return Q();
  } catch {
    return !1;
  }
}, ye = async (e = 0) => {
  const t = document.getElementById("headerAdminBtn"), r = ce(), n = de(), a = G(), o = document.getElementById("index-header-util"), [i, c] = await Promise.all([we(), Ee()]), l = !!i;
  r && (l ? await fe(r) : ge(r)), n && pe(n, l), a && (a.hidden = l);
  const R = ue();
  if (R && (R.hidden = l), c && t && (t.style.display = "flex"), c && o)
    ve(o);
  else if (c && (r == null ? void 0 : r.id) === "indexLoginBtn" && e < 5) {
    v(e + 1);
    return;
  }
  j();
}, v = (e = 0) => {
  S || (S = !0, setTimeout(async () => {
    S = !1, await ye(e);
  }, 0));
}, h = (e = 0) => {
  if (!J()) {
    e < 20 && window.setTimeout(() => {
      h(e + 1);
    }, 50);
    return;
  }
  oe(), se(), ie(), ne(), k(), v();
}, Ce = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    h();
  }), window.addEventListener("storage", (e) => {
    e.key === b && v();
  }), window.addEventListener(ae, () => {
    v();
  });
}, Ae = {
  "main-header": "mainHeaderLoaded",
  "main-footer": "mainFooterLoaded"
}, w = /* @__PURE__ */ new Set(), E = /* @__PURE__ */ new Map(), Se = (e) => {
  const t = Ae[e];
  t && document.dispatchEvent(new Event(t));
}, Le = (e) => {
  (E.get(e) ?? []).forEach((r) => r()), E.delete(e);
}, Oe = () => {
  window.__JEJU_RUNTIME_LIFECYCLE__ = {
    isReady: (e) => w.has(e),
    markReady: (e) => s(e),
    whenReady: (e) => be(e)
  };
}, s = (e) => {
  w.has(e) || (w.add(e), Se(e), document.dispatchEvent(new CustomEvent("jeju:runtime-ready", { detail: { stage: e } })), Le(e));
}, be = (e) => w.has(e) ? Promise.resolve() : new Promise((t) => {
  const r = E.get(e) ?? [];
  r.push(t), E.set(e, r);
}), A = () => {
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
}, Ue = (e) => new URL(e, A()).href, C = /* @__PURE__ */ new Map(), Re = (e) => new Promise((t) => {
  requestAnimationFrame(() => {
    Promise.resolve(e == null ? void 0 : e()).catch((r) => {
      console.error("[ShellRuntime] onLoaded failed", r);
    }).finally(t);
  });
}), y = (e, t, r) => {
  const n = document.getElementById(e);
  if (!n)
    return Promise.resolve();
  const a = C.get(e);
  a && a.unmount();
  const o = F(n);
  return C.set(e, o), K.flushSync(() => {
    o.render(t);
  }), Re(r);
}, m = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    m(e + 1);
  }, 100);
}, V = () => {
  window.setTimeout(() => {
    h();
  }, 0);
}, qe = async () => {
  const e = A();
  await Promise.all([
    y("main-header-placeholder", /* @__PURE__ */ g.jsx(Y, { basePath: e }), async () => {
      h(), m(), s("main-header");
    }),
    y("main-footer-placeholder", /* @__PURE__ */ g.jsx(q, {}), async () => {
      D(), m(), s("main-footer");
    })
  ]), s("main-shell"), V();
}, De = async () => {
  const e = A();
  await Promise.all([
    y("hotel-header-placeholder", /* @__PURE__ */ g.jsx(W, { basePath: e }), async () => {
      h(), m(), s("hotel-header"), s("main-header");
    }),
    y("hotel-footer-placeholder", /* @__PURE__ */ g.jsx(q, {}), async () => {
      D(), m(), s("hotel-footer"), s("main-footer");
    })
  ]), s("hotel-shell"), V();
}, O = (e, t = "shell-runtime") => {
  var r;
  if ((r = window.__JEJU_ROUTE_NAVIGATOR__) != null && r.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(e, t);
    return;
  }
  window.location.assign(e);
}, _e = () => {
  var e;
  return (e = window.__JEJU_ROUTE_NAVIGATOR__) != null && e.homeUrl ? window.__JEJU_ROUTE_NAVIGATOR__.homeUrl : new URL("index.html", A()).href;
}, Ie = (e) => {
  const t = e.getAttribute("data-route-params");
  if (!t)
    return {};
  try {
    const r = JSON.parse(t);
    return r && typeof r == "object" && !Array.isArray(r) ? r : {};
  } catch {
    return {};
  }
}, Te = async (e) => {
  const t = e.getAttribute("data-route");
  if (t)
    try {
      const r = p(t, Ie(e));
      O(r, "shell-runtime-fallback");
    } catch {
      O(_e(), "shell-runtime-fallback-home");
    }
};
let U = !1;
const Be = async () => {
  if (!U) {
    U = !0;
    try {
      X();
      return;
    } catch (e) {
      console.warn("[ShellRuntime] router binder load failed", e);
    }
    document.body.addEventListener("click", async (e) => {
      var r;
      const t = (r = e.target) == null ? void 0 : r.closest("[data-route]");
      t && (e.preventDefault(), await Te(t));
    });
  }
};
export {
  D as a,
  ne as b,
  k as c,
  Ce as d,
  Me as e,
  Be as f,
  De as g,
  qe as h,
  h as i,
  A as j,
  Oe as k,
  s as m,
  Ue as r,
  be as w
};
