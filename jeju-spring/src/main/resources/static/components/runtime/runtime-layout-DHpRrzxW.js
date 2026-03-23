import { c as k, r as j, j as m } from "./react-vendor-BoSfm_Te.js";
import { M as V, a as x, H as F } from "./feature-layout-FFOs3oG6.js";
import { r as K, c as Y, l as W, a as h, i as z } from "./legacy-core-C4kaoWaO.js";
const q = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
};
let b = !1, u = null, c = null, l = null;
const R = () => {
  const e = document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header");
  if (e) {
    if (window.scrollY > 20) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, Q = () => {
  b || (b = !0, window.addEventListener("scroll", R), R());
}, C = () => {
  u !== null && (window.clearTimeout(u), u = null);
}, D = (e, t) => {
  t.classList.remove("active"), c === e && (c = null), l === t && (l = null);
}, _ = (e, t) => {
  C(), l && l !== t && c && D(c, l), t.classList.add("active"), c = e, l = t;
}, I = (e, t) => {
  C(), u = window.setTimeout(() => {
    e.matches(":hover") || t.matches(":hover") || D(e, t);
  }, 120);
}, $ = () => {
  document.querySelectorAll(".hotel-shell-nav-item").forEach((t) => {
    if (t.dataset.megaHoverBound === "true")
      return;
    const r = t.querySelector(".hotel-shell-mega-dropdown");
    r && (t.dataset.megaHoverBound = "true", t.addEventListener("mouseenter", () => {
      _(t, r);
    }), t.addEventListener("mouseleave", () => {
      I(t, r);
    }), r.addEventListener("mouseenter", () => {
      _(t, r);
    }), r.addEventListener("mouseleave", () => {
      I(t, r);
    }));
  });
}, X = () => {
  document.querySelectorAll(".hotel-shell-mega-menu-item").forEach((t) => {
    t.dataset.previewHoverBound !== "true" && (t.dataset.previewHoverBound = "true", t.addEventListener("mouseenter", () => {
      const r = t.closest(".hotel-shell-mega-dropdown"), n = t.getAttribute("data-preview"), o = n ? document.getElementById(n) : null;
      if (!r || !o)
        return;
      r.querySelectorAll(".hotel-shell-preview-image").forEach((i) => {
        i.classList.remove("active");
      }), o.classList.add("active");
      const a = r.querySelector(".hotel-shell-preview-loader");
      a && (a.style.display = "none");
    }));
  });
}, Z = () => {
  document.querySelectorAll(".hotel-shell-mega-dropdown").forEach((e) => {
    if (e.dataset.previewInit === "true")
      return;
    e.dataset.previewInit = "true";
    const t = e.querySelector(".hotel-shell-preview-image");
    t && t.classList.add("active");
  });
}, ee = () => {
  Q(), $(), X(), Z();
};
let T = !1;
const N = (e, t) => {
  const r = document.createElement("span");
  return r.className = t, r.setAttribute("aria-hidden", t.includes("clone") ? "true" : "false"), e.split("").forEach((n, o) => {
    const a = document.createElement("span");
    a.className = "stagger-char", a.textContent = n === " " ? " " : n, a.style.transitionDelay = `${o * 30}ms`, r.appendChild(a);
  }), r;
}, B = () => {
  document.querySelectorAll(".hotel-shell-nav-link, .nav-link").forEach((t) => {
    var L;
    const r = t.querySelector("span[data-lang]") || t.querySelector("span");
    if (!r || r.querySelector(".stagger-wrapper"))
      return;
    const n = ((L = r.textContent) == null ? void 0 : L.trim()) ?? "";
    if (!n)
      return;
    const o = document.createElement("span");
    o.className = "stagger-wrapper", o.appendChild(N(n, "stagger-original")), o.appendChild(N(n, "stagger-clone")), r.textContent = "", r.appendChild(o);
    let a = !1, i = !1;
    t.addEventListener("mouseenter", () => {
      if (i = !0, a)
        return;
      a = !0, t.classList.add("is-animating");
      const J = n.length * 30 + 300 + 50;
      setTimeout(() => {
        a = !1, i || t.classList.remove("is-animating");
      }, J);
    }), t.addEventListener("mouseleave", () => {
      i = !1, a || t.classList.remove("is-animating");
    });
  });
}, Ie = () => {
  T || (T = !0, document.addEventListener("mainHeaderLoaded", B));
}, S = "userSession", te = "jeju:session-updated";
let H = !1, E = !1;
const P = () => document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header"), y = () => {
  const e = P();
  if (e) {
    if (window.scrollY > 50) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, re = () => {
  if (H) {
    y();
    return;
  }
  H = !0, window.addEventListener("scroll", y), y();
}, ne = () => {
  document.querySelectorAll(".hotel-shell-mega-menu-item").forEach((t) => {
    t.dataset.previewBound !== "true" && (t.dataset.previewBound = "true", t.addEventListener("mouseenter", () => {
      const r = t.dataset.preview, n = t.closest(".hotel-shell-mega-dropdown");
      if (!r || !n)
        return;
      const o = n.querySelector(".hotel-shell-mega-menu-preview");
      o && o.querySelectorAll(".hotel-shell-preview-image").forEach((a) => {
        a.classList.toggle("active", a.id === r);
      });
    }));
  });
}, ae = () => {
  const e = document.getElementById("mobileMenuBtn"), t = document.getElementById("mobileNav");
  !e || !t || e.dataset.mobileToggleBound !== "true" && (e.dataset.mobileToggleBound = "true", e.addEventListener("click", () => {
    t.classList.toggle("active");
  }));
}, oe = () => document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn"), se = () => document.getElementById("headerAuthActionBtn"), ie = () => (document.documentElement.getAttribute("lang") || document.documentElement.lang || "ko").trim().toLowerCase(), le = (e, t) => {
  const r = e.querySelector("[data-auth-label]");
  if (!r)
    return null;
  const o = ie().startsWith("ko");
  return t ? o ? r.dataset.authMemberLabelKo || r.dataset.authMemberLabelEn || "마이페이지" : r.dataset.authMemberLabelEn || r.dataset.authMemberLabelKo || "My Page" : o ? r.dataset.authLabelKo || r.dataset.authLabelEn || "비회원 예약확인" : r.dataset.authLabelEn || r.dataset.authLabelKo || "Guest Reservation Check";
}, G = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    G(e + 1);
  }, 100);
}, ce = async (e) => {
  const t = e.querySelector("span");
  t ? t.textContent = "로그아웃" : e.textContent = "로그아웃", "href" in e && (e.href = "#"), e.removeAttribute("data-route"), e.dataset.logoutBound !== "true" && (e.dataset.logoutBound = "true", e.addEventListener("click", async (r) => {
    r.preventDefault(), r.stopPropagation();
    try {
      await W();
    } catch {
      localStorage.removeItem(S);
    }
    window.location.reload();
  }));
}, de = (e) => {
  if (e.dataset.logoutBound === "true") {
    const r = e.cloneNode(!0);
    r.removeAttribute("data-logout-bound"), e.replaceWith(r), e = r;
  }
  const t = e.querySelector("span");
  t ? t.textContent = "로그인" : e.textContent = "로그인", "href" in e && (e.href = h("AUTH.LOGIN", { shell: "stay" })), e.setAttribute("data-route", "AUTH.LOGIN"), e.setAttribute("data-route-params", '{"shell":"stay"}'), e.removeAttribute("data-logout-bound");
}, ue = (e, t) => {
  const r = e.querySelector('[data-auth-icon="guest"]'), n = e.querySelector('[data-auth-icon="member"]'), o = e.querySelector("[data-auth-label]"), a = le(e, t);
  if (t) {
    e.removeAttribute("data-action"), e.setAttribute("data-route", "MYPAGE.DASHBOARD"), e.removeAttribute("data-route-params"), e.setAttribute("href", h("MYPAGE.DASHBOARD")), r && (r.hidden = !0), n && (n.hidden = !1), o && (o.textContent = a ?? "마이페이지");
    return;
  }
  e.setAttribute("data-action", "OPEN_RESERVATION_DRAWER"), e.removeAttribute("data-route"), e.removeAttribute("data-route-params"), e.setAttribute("href", h("SERVICES.AIR.BOOKING.GUEST_RESERVATION")), r && (r.hidden = !1), n && (n.hidden = !0), o && (o.textContent = a ?? "비회원 예약확인");
}, me = (e) => {
  if (e.querySelector('[data-route="ADMIN.DASHBOARD"]'))
    return;
  const t = document.createElement("a");
  t.id = "indexAdminBtn", t.href = "#", t.className = "util-link route-link", t.setAttribute("data-route", "ADMIN.DASHBOARD"), t.style.color = "#FF5000", t.style.fontWeight = "700", t.textContent = "관리자 페이지";
  const r = document.createElement("span");
  r.className = "util-divider", r.textContent = "|", e.prepend(t, r);
}, he = async () => {
  try {
    return await K();
  } catch {
  }
  try {
    const e = localStorage.getItem(S);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}, fe = async () => {
  try {
    return Y();
  } catch {
    return !1;
  }
}, pe = async () => {
  const e = document.getElementById("headerAdminBtn"), t = oe(), r = se(), n = document.getElementById("index-header-util"), [o, a] = await Promise.all([he(), fe()]), i = !!o;
  t && (i ? await ce(t) : de(t)), r && ue(r, i), a && e && (e.style.display = "flex"), a && n && me(n), G();
}, A = () => {
  E || (E = !0, setTimeout(async () => {
    E = !1, await pe();
  }, 0));
}, w = (e = 0) => {
  if (!P()) {
    e < 20 && window.setTimeout(() => {
      w(e + 1);
    }, 50);
    return;
  }
  re(), ne(), ae(), ee(), B(), A();
}, Te = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    w();
  }), window.addEventListener("storage", (e) => {
    e.key === S && A();
  }), window.addEventListener(te, () => {
    A();
  });
}, ge = {
  "main-header": "mainHeaderLoaded",
  "main-footer": "mainFooterLoaded"
}, f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Map(), we = (e) => {
  const t = ge[e];
  t && document.dispatchEvent(new Event(t));
}, ve = (e) => {
  (p.get(e) ?? []).forEach((r) => r()), p.delete(e);
}, Ne = () => {
  window.__JEJU_RUNTIME_LIFECYCLE__ = {
    isReady: (e) => f.has(e),
    markReady: (e) => s(e),
    whenReady: (e) => Ee(e)
  };
}, s = (e) => {
  f.has(e) || (f.add(e), we(e), document.dispatchEvent(new CustomEvent("jeju:runtime-ready", { detail: { stage: e } })), ve(e));
}, Ee = (e) => f.has(e) ? Promise.resolve() : new Promise((t) => {
  const r = p.get(e) ?? [];
  r.push(t), p.set(e, r);
}), v = () => {
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
  for (const o of r) {
    const a = o.src || o.getAttribute("src");
    if (a && (a.includes("components/runtime/bootstrap.js") || a.includes("components/runtime/shell-runtime.js")))
      return new URL("../../", a).href;
  }
  return e;
}, He = (e) => new URL(e, v()).href, M = /* @__PURE__ */ new Map(), ye = (e) => new Promise((t) => {
  requestAnimationFrame(() => {
    Promise.resolve(e == null ? void 0 : e()).catch((r) => {
      console.error("[ShellRuntime] onLoaded failed", r);
    }).finally(t);
  });
}), g = (e, t, r) => {
  const n = document.getElementById(e);
  if (!n)
    return Promise.resolve();
  const o = M.get(e);
  o && o.unmount();
  const a = k(n);
  return M.set(e, a), j.flushSync(() => {
    a.render(t);
  }), ye(r);
}, d = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    d(e + 1);
  }, 100);
}, Me = async () => {
  const e = v();
  await Promise.all([
    g("main-header-placeholder", /* @__PURE__ */ m.jsx(V, { basePath: e }), async () => {
      w(), d(), s("main-header");
    }),
    g("main-footer-placeholder", /* @__PURE__ */ m.jsx(x, {}), async () => {
      q(), d(), s("main-footer");
    })
  ]), s("main-shell");
}, Oe = async () => {
  const e = v();
  await Promise.all([
    g("hotel-header-placeholder", /* @__PURE__ */ m.jsx(F, { basePath: e }), async () => {
      w(), d(), s("hotel-header"), s("main-header");
    }),
    g("hotel-footer-placeholder", /* @__PURE__ */ m.jsx(x, {}), async () => {
      q(), d(), s("hotel-footer"), s("main-footer");
    })
  ]), s("hotel-shell");
}, O = (e, t = "shell-runtime") => {
  var r;
  if ((r = window.__JEJU_ROUTE_NAVIGATOR__) != null && r.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(e, t);
    return;
  }
  window.location.assign(e);
}, Ae = () => {
  var e;
  return (e = window.__JEJU_ROUTE_NAVIGATOR__) != null && e.homeUrl ? window.__JEJU_ROUTE_NAVIGATOR__.homeUrl : new URL("index.html", v()).href;
}, Se = (e) => {
  const t = e.getAttribute("data-route-params");
  if (!t)
    return {};
  try {
    const r = JSON.parse(t);
    return r && typeof r == "object" && !Array.isArray(r) ? r : {};
  } catch {
    return {};
  }
}, Le = async (e) => {
  const t = e.getAttribute("data-route");
  if (t)
    try {
      const r = h(t, Se(e));
      O(r, "shell-runtime-fallback");
    } catch {
      O(Ae(), "shell-runtime-fallback-home");
    }
};
let U = !1;
const Ue = async () => {
  if (!U) {
    U = !0;
    try {
      z();
      return;
    } catch (e) {
      console.warn("[ShellRuntime] router binder load failed", e);
    }
    document.body.addEventListener("click", async (e) => {
      var r;
      const t = (r = e.target) == null ? void 0 : r.closest("[data-route]");
      t && (e.preventDefault(), await Le(t));
    });
  }
};
export {
  q as a,
  ee as b,
  B as c,
  Te as d,
  Ie as e,
  Ue as f,
  Oe as g,
  Me as h,
  w as i,
  v as j,
  Ne as k,
  s as m,
  He as r,
  Ee as w
};
