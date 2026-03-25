import { c as V, r as F, j as g } from "./react-vendor-BoSfm_Te.js";
import { M as K, a as q, H as Y } from "./feature-layout-ClnO6w1y.js";
import { r as W, c as z, l as Q, a as p, i as $ } from "./legacy-core-CKE3csu2.js";
const D = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
};
let _ = !1, f = null, m = null, d = null;
const I = () => {
  const e = document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header");
  if (e) {
    if (window.scrollY > 20) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, X = () => {
  _ || (_ = !0, window.addEventListener("scroll", I), I());
}, B = () => {
  f !== null && (window.clearTimeout(f), f = null);
}, P = (e, t) => {
  t.classList.remove("active"), m === e && (m = null), d === t && (d = null);
}, T = (e, t) => {
  B(), d && d !== t && m && P(m, d), t.classList.add("active"), m = e, d = t;
}, N = (e, t) => {
  B(), f = window.setTimeout(() => {
    e.matches(":hover") || t.matches(":hover") || P(e, t);
  }, 120);
}, Z = () => {
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
}, ee = () => {
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
}, te = () => {
  document.querySelectorAll(".hotel-shell-mega-dropdown").forEach((e) => {
    if (e.dataset.previewInit === "true")
      return;
    e.dataset.previewInit = "true";
    const t = e.querySelector(".hotel-shell-preview-image");
    t && t.classList.add("active");
  });
}, re = () => {
  X(), Z(), ee(), te();
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
}, b = "userSession", ne = "jeju:session-updated";
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
}, ae = () => {
  if (M) {
    L();
    return;
  }
  M = !0, window.addEventListener("scroll", L), L();
}, oe = () => {
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
}, se = () => {
  const e = document.getElementById("mobileMenuBtn"), t = document.getElementById("mobileNav");
  !e || !t || e.dataset.mobileToggleBound !== "true" && (e.dataset.mobileToggleBound = "true", e.addEventListener("click", () => {
    t.classList.toggle("active");
  }));
}, ie = () => document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn"), ce = (e) => {
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
}, le = () => document.getElementById("headerAuthActionBtn"), G = () => document.getElementById("indexReservationCheckBtn"), de = () => {
  const e = G(), t = e == null ? void 0 : e.previousElementSibling;
  return t instanceof HTMLElement && t.classList.contains("util-divider") ? t : null;
}, ue = () => (document.documentElement.getAttribute("lang") || document.documentElement.lang || "ko").trim().toLowerCase(), me = (e, t) => {
  const r = e.querySelector("[data-auth-label]");
  if (!r)
    return null;
  const a = ue().startsWith("ko");
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
}, he = async (e) => {
  const t = e.querySelector("span");
  t ? t.textContent = "로그아웃" : e.textContent = "로그아웃", "href" in e && (e.href = "#"), e.removeAttribute("data-route"), e.dataset.logoutBound !== "true" && (e.dataset.logoutBound = "true", e.addEventListener("click", async (r) => {
    r.preventDefault(), r.stopPropagation();
    try {
      await Q();
    } catch {
      localStorage.removeItem(b);
    }
    window.location.reload();
  }));
}, fe = (e) => {
  if (e.dataset.logoutBound === "true") {
    const n = e.cloneNode(!0);
    n.removeAttribute("data-logout-bound"), e.replaceWith(n), e = n;
  }
  const t = e.querySelector("span");
  t ? t.textContent = "로그인" : e.textContent = "로그인";
  const r = ce(e);
  "href" in e && (e.href = p("AUTH.LOGIN", r)), e.setAttribute("data-route", "AUTH.LOGIN"), e.setAttribute("data-route-params", JSON.stringify(r)), e.removeAttribute("data-logout-bound");
}, ge = (e, t) => {
  const r = e.querySelector('[data-auth-icon="guest"]'), n = e.querySelector('[data-auth-icon="member"]'), a = e.querySelector("[data-auth-label]"), o = me(e, t);
  if (t) {
    e.removeAttribute("data-action"), e.setAttribute("data-route", "MYPAGE.DASHBOARD"), e.setAttribute("data-route-params", '{"shell":"stay"}'), e.setAttribute("href", p("MYPAGE.DASHBOARD", { shell: "stay" })), r && (r.hidden = !0), n && (n.hidden = !1), a && (a.textContent = o ?? "마이페이지");
    return;
  }
  e.setAttribute("data-action", "OPEN_RESERVATION_DRAWER"), e.removeAttribute("data-route"), e.removeAttribute("data-route-params"), e.setAttribute("href", p("SERVICES.AIR.BOOKING.GUEST_RESERVATION")), r && (r.hidden = !1), n && (n.hidden = !0), a && (a.textContent = o ?? "비회원 예약확인");
}, pe = (e) => {
  if (e.querySelector('[data-route="ADMIN.DASHBOARD"]'))
    return;
  const t = document.createElement("a");
  t.id = "indexAdminBtn", t.href = "#", t.className = "util-link route-link", t.setAttribute("data-route", "ADMIN.DASHBOARD"), t.style.color = "#FF5000", t.style.fontWeight = "700", t.textContent = "관리자 페이지";
  const r = document.createElement("span");
  r.className = "util-divider", r.textContent = "|", e.prepend(t, r);
}, ve = async () => {
  try {
    return await W();
  } catch {
  }
  try {
    const e = localStorage.getItem(b);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}, we = async () => {
  try {
    return z();
  } catch {
    return !1;
  }
}, Ee = async (e = 0) => {
  const t = document.getElementById("headerAdminBtn"), r = ie(), n = le(), a = G(), o = document.getElementById("index-header-util"), [i, c] = await Promise.all([ve(), we()]), l = !!i;
  r && (l ? await he(r) : fe(r)), n && ge(n, l), a && (a.hidden = l);
  const R = de();
  if (R && (R.hidden = l), c && t && (t.style.display = "flex"), c && o)
    pe(o);
  else if (c && (r == null ? void 0 : r.id) === "indexLoginBtn" && e < 5) {
    u(e + 1);
    return;
  }
  j();
}, u = (e = 0) => {
  S || (S = !0, setTimeout(async () => {
    S = !1, await Ee(e);
  }, 0));
}, y = (e = 0) => {
  if (!J()) {
    e < 20 && window.setTimeout(() => {
      y(e + 1);
    }, 50);
    return;
  }
  ae(), oe(), se(), re(), k();
}, ye = (e = 0) => {
  y(e), u();
}, Ce = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    ye();
  }), window.addEventListener("storage", (e) => {
    e.key === b && u();
  }), window.addEventListener(ne, () => {
    u();
  });
}, Ae = {
  "main-header": "mainHeaderLoaded",
  "main-footer": "mainFooterLoaded"
}, v = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Map(), Se = (e) => {
  const t = Ae[e];
  t && document.dispatchEvent(new Event(t));
}, Le = (e) => {
  (w.get(e) ?? []).forEach((r) => r()), w.delete(e);
}, Oe = () => {
  window.__JEJU_RUNTIME_LIFECYCLE__ = {
    isReady: (e) => v.has(e),
    markReady: (e) => s(e),
    whenReady: (e) => be(e)
  };
}, s = (e) => {
  v.has(e) || (v.add(e), Se(e), document.dispatchEvent(new CustomEvent("jeju:runtime-ready", { detail: { stage: e } })), Le(e));
}, be = (e) => v.has(e) ? Promise.resolve() : new Promise((t) => {
  const r = w.get(e) ?? [];
  r.push(t), w.set(e, r);
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
}), E = (e, t, r) => {
  const n = document.getElementById(e);
  if (!n)
    return Promise.resolve();
  const a = C.get(e);
  a && a.unmount();
  const o = V(n);
  return C.set(e, o), F.flushSync(() => {
    o.render(t);
  }), Re(r);
}, h = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    h(e + 1);
  }, 100);
}, qe = async () => {
  const e = A();
  await Promise.all([
    E("main-header-placeholder", /* @__PURE__ */ g.jsx(K, { basePath: e }), async () => {
      y(), h(), s("main-header");
    }),
    E("main-footer-placeholder", /* @__PURE__ */ g.jsx(q, {}), async () => {
      D(), h(), s("main-footer");
    })
  ]), s("main-shell"), u();
}, De = async () => {
  const e = A();
  await Promise.all([
    E("hotel-header-placeholder", /* @__PURE__ */ g.jsx(Y, { basePath: e }), async () => {
      y(), h(), s("hotel-header"), s("main-header");
    }),
    E("hotel-footer-placeholder", /* @__PURE__ */ g.jsx(q, {}), async () => {
      D(), h(), s("hotel-footer"), s("main-footer");
    })
  ]), s("hotel-shell"), u();
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
      $();
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
  re as b,
  k as c,
  Ce as d,
  Me as e,
  Be as f,
  De as g,
  qe as h,
  ye as i,
  A as j,
  Oe as k,
  s as m,
  Ue as r,
  be as w
};
