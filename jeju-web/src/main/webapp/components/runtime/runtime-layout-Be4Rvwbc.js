import { c as j, r as k, j as m } from "./react-vendor-BoSfm_Te.js";
import { M as F, a as U, H as G } from "./feature-layout-Czr3ndvg.js";
import { r as V, c as Y, l as W, i as z, a as K } from "./legacy-core-0fkWHL1L.js";
const x = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
};
let L = !1, u = null, c = null, i = null;
const _ = () => {
  const e = document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header");
  if (e) {
    if (window.scrollY > 20) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, Q = () => {
  L || (L = !0, window.addEventListener("scroll", _), _());
}, q = () => {
  u !== null && (window.clearTimeout(u), u = null);
}, O = (e, t) => {
  t.classList.remove("active"), c === e && (c = null), i === t && (i = null);
}, R = (e, t) => {
  q(), i && i !== t && c && O(c, i), t.classList.add("active"), c = e, i = t;
}, I = (e, t) => {
  q(), u = window.setTimeout(() => {
    e.matches(":hover") || t.matches(":hover") || O(e, t);
  }, 120);
}, $ = () => {
  document.querySelectorAll(".hotel-shell-nav-item").forEach((t) => {
    if (t.dataset.megaHoverBound === "true")
      return;
    const n = t.querySelector(".hotel-shell-mega-dropdown");
    n && (t.dataset.megaHoverBound = "true", t.addEventListener("mouseenter", () => {
      R(t, n);
    }), t.addEventListener("mouseleave", () => {
      I(t, n);
    }), n.addEventListener("mouseenter", () => {
      R(t, n);
    }), n.addEventListener("mouseleave", () => {
      I(t, n);
    }));
  });
}, X = () => {
  document.querySelectorAll(".hotel-shell-mega-menu-item").forEach((t) => {
    t.dataset.previewHoverBound !== "true" && (t.dataset.previewHoverBound = "true", t.addEventListener("mouseenter", () => {
      const n = t.closest(".hotel-shell-mega-dropdown"), o = t.getAttribute("data-preview"), a = o ? document.getElementById(o) : null;
      if (!n || !a)
        return;
      n.querySelectorAll(".hotel-shell-preview-image").forEach((l) => {
        l.classList.remove("active");
      }), a.classList.add("active");
      const r = n.querySelector(".hotel-shell-preview-loader");
      r && (r.style.display = "none");
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
const b = (e, t) => {
  const n = document.createElement("span");
  return n.className = t, n.setAttribute("aria-hidden", t.includes("clone") ? "true" : "false"), e.split("").forEach((o, a) => {
    const r = document.createElement("span");
    r.className = "stagger-char", r.textContent = o === " " ? " " : o, r.style.transitionDelay = `${a * 30}ms`, n.appendChild(r);
  }), n;
}, C = () => {
  document.querySelectorAll(".hotel-shell-nav-link, .nav-link").forEach((t) => {
    var A;
    const n = t.querySelector("span[data-lang]") || t.querySelector("span");
    if (!n || n.querySelector(".stagger-wrapper"))
      return;
    const o = ((A = n.textContent) == null ? void 0 : A.trim()) ?? "";
    if (!o)
      return;
    const a = document.createElement("span");
    a.className = "stagger-wrapper", a.appendChild(b(o, "stagger-original")), a.appendChild(b(o, "stagger-clone")), n.textContent = "", n.appendChild(a);
    let r = !1, l = !1;
    t.addEventListener("mouseenter", () => {
      if (l = !0, r)
        return;
      r = !0, t.classList.add("is-animating");
      const P = o.length * 30 + 300 + 50;
      setTimeout(() => {
        r = !1, l || t.classList.remove("is-animating");
      }, P);
    }), t.addEventListener("mouseleave", () => {
      l = !1, r || t.classList.remove("is-animating");
    });
  });
}, Ae = () => {
  T || (T = !0, document.addEventListener("mainHeaderLoaded", C));
}, S = "userSession", te = "jeju:session-updated";
let B = !1, v = !1;
const D = () => document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header"), y = () => {
  const e = D();
  if (e) {
    if (window.scrollY > 50) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, ne = () => {
  if (B) {
    y();
    return;
  }
  B = !0, window.addEventListener("scroll", y), y();
}, re = () => {
  document.querySelectorAll(".hotel-shell-mega-menu-item").forEach((t) => {
    t.dataset.previewBound !== "true" && (t.dataset.previewBound = "true", t.addEventListener("mouseenter", () => {
      const n = t.dataset.preview, o = t.closest(".hotel-shell-mega-dropdown");
      if (!n || !o)
        return;
      const a = o.querySelector(".hotel-shell-mega-menu-preview");
      a && a.querySelectorAll(".hotel-shell-preview-image").forEach((r) => {
        r.classList.toggle("active", r.id === n);
      });
    }));
  });
}, oe = () => {
  const e = document.getElementById("mobileMenuBtn"), t = document.getElementById("mobileNav");
  !e || !t || e.dataset.mobileToggleBound !== "true" && (e.dataset.mobileToggleBound = "true", e.addEventListener("click", () => {
    t.classList.toggle("active");
  }));
}, ae = () => document.getElementById("headerLoginBtn") || document.getElementById("indexLoginBtn"), J = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    J(e + 1);
  }, 100);
}, se = async (e) => {
  const t = e.querySelector("span");
  t ? t.textContent = "로그아웃" : e.textContent = "로그아웃", "href" in e && (e.href = "#"), e.removeAttribute("data-route"), e.dataset.logoutBound !== "true" && (e.dataset.logoutBound = "true", e.addEventListener("click", async (n) => {
    n.preventDefault(), n.stopPropagation();
    try {
      await W();
    } catch {
      localStorage.removeItem(S);
    }
    window.location.reload();
  }));
}, ie = (e) => {
  if (e.querySelector('[data-route="ADMIN.DASHBOARD"]'))
    return;
  const t = document.createElement("a");
  t.id = "indexAdminBtn", t.href = "#", t.className = "util-link route-link", t.setAttribute("data-route", "ADMIN.DASHBOARD"), t.style.color = "#FF5000", t.style.fontWeight = "700", t.textContent = "관리자 페이지";
  const n = document.createElement("span");
  n.className = "util-divider", n.textContent = "|", e.prepend(t, n);
}, le = async () => {
  try {
    return await V();
  } catch {
  }
  try {
    const e = localStorage.getItem(S);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}, ce = async () => {
  try {
    return Y();
  } catch {
    return !1;
  }
}, de = async () => {
  const e = document.getElementById("headerAdminBtn"), t = ae(), n = document.getElementById("index-header-util"), [o, a] = await Promise.all([le(), ce()]);
  o && t && await se(t), a && e && (e.style.display = "flex"), a && n && ie(n), J();
}, E = () => {
  v || (v = !0, setTimeout(async () => {
    v = !1, await de();
  }, 0));
}, w = (e = 0) => {
  if (!D()) {
    e < 20 && window.setTimeout(() => {
      w(e + 1);
    }, 50);
    return;
  }
  ne(), re(), oe(), ee(), C(), E();
}, Le = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    w();
  }), window.addEventListener("storage", (e) => {
    e.key === S && E();
  }), window.addEventListener(te, () => {
    E();
  });
}, ue = {
  "main-header": "mainHeaderLoaded",
  "main-footer": "mainFooterLoaded"
}, h = /* @__PURE__ */ new Set(), f = /* @__PURE__ */ new Map(), me = (e) => {
  const t = ue[e];
  t && document.dispatchEvent(new Event(t));
}, he = (e) => {
  (f.get(e) ?? []).forEach((n) => n()), f.delete(e);
}, _e = () => {
  window.__JEJU_RUNTIME_LIFECYCLE__ = {
    isReady: (e) => h.has(e),
    markReady: (e) => s(e),
    whenReady: (e) => fe(e)
  };
}, s = (e) => {
  h.has(e) || (h.add(e), me(e), document.dispatchEvent(new CustomEvent("jeju:runtime-ready", { detail: { stage: e } })), he(e));
}, fe = (e) => h.has(e) ? Promise.resolve() : new Promise((t) => {
  const n = f.get(e) ?? [];
  n.push(t), f.set(e, n);
}), g = () => {
  var o;
  const e = new URL(
    /* @vite-ignore */
    "../../",
    import.meta.url
  ).href;
  if ((o = window.__JEJU_ROUTE_NAVIGATOR__) != null && o.appRoot)
    return new URL(window.__JEJU_ROUTE_NAVIGATOR__.appRoot, window.location.href).href;
  const t = document.currentScript;
  if (t != null && t.src)
    return new URL("../", t.src).href;
  const n = Array.from(document.getElementsByTagName("script"));
  for (const a of n) {
    const r = a.src || a.getAttribute("src");
    if (r && (r.includes("components/runtime/bootstrap.js") || r.includes("components/runtime/shell-runtime.js")))
      return new URL("../../", r).href;
  }
  return e;
}, Re = (e) => new URL(e, g()).href, N = /* @__PURE__ */ new Map(), pe = (e) => new Promise((t) => {
  requestAnimationFrame(() => {
    Promise.resolve(e == null ? void 0 : e()).catch((n) => {
      console.error("[ShellRuntime] onLoaded failed", n);
    }).finally(t);
  });
}), p = (e, t, n) => {
  const o = document.getElementById(e);
  if (!o)
    return Promise.resolve();
  const a = N.get(e);
  a && a.unmount();
  const r = j(o);
  return N.set(e, r), k.flushSync(() => {
    r.render(t);
  }), pe(n);
}, d = (e = 0) => {
  const t = window.lucide;
  if (t != null && t.createIcons) {
    t.createIcons();
    return;
  }
  e >= 30 || window.setTimeout(() => {
    d(e + 1);
  }, 100);
}, Ie = async () => {
  const e = g();
  await Promise.all([
    p("main-header-placeholder", /* @__PURE__ */ m.jsx(F, { basePath: e }), async () => {
      w(), d(), s("main-header");
    }),
    p("main-footer-placeholder", /* @__PURE__ */ m.jsx(U, {}), async () => {
      x(), d(), s("main-footer");
    })
  ]), s("main-shell");
}, Te = async () => {
  const e = g();
  await Promise.all([
    p("hotel-header-placeholder", /* @__PURE__ */ m.jsx(G, { basePath: e }), async () => {
      w(), d(), s("hotel-header"), s("main-header");
    }),
    p("hotel-footer-placeholder", /* @__PURE__ */ m.jsx(U, {}), async () => {
      x(), d(), s("hotel-footer"), s("main-footer");
    })
  ]), s("hotel-shell");
}, H = (e, t = "shell-runtime") => {
  var n;
  if ((n = window.__JEJU_ROUTE_NAVIGATOR__) != null && n.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(e, t);
    return;
  }
  window.location.assign(e);
}, we = () => {
  var e;
  return (e = window.__JEJU_ROUTE_NAVIGATOR__) != null && e.homeUrl ? window.__JEJU_ROUTE_NAVIGATOR__.homeUrl : new URL("index.html", g()).href;
}, ge = (e) => {
  const t = e.getAttribute("data-route-params");
  if (!t)
    return {};
  try {
    const n = JSON.parse(t);
    return n && typeof n == "object" && !Array.isArray(n) ? n : {};
  } catch {
    return {};
  }
}, ve = async (e) => {
  const t = e.getAttribute("data-route");
  if (t)
    try {
      const n = K(t, ge(e));
      H(n, "shell-runtime-fallback");
    } catch {
      H(we(), "shell-runtime-fallback-home");
    }
};
let M = !1;
const be = async () => {
  if (!M) {
    M = !0;
    try {
      z();
      return;
    } catch (e) {
      console.warn("[ShellRuntime] router binder load failed", e);
    }
    document.body.addEventListener("click", async (e) => {
      var n;
      const t = (n = e.target) == null ? void 0 : n.closest("[data-route]");
      t && (e.preventDefault(), await ve(t));
    });
  }
};
export {
  x as a,
  ee as b,
  C as c,
  Le as d,
  Ae as e,
  be as f,
  Te as g,
  Ie as h,
  w as i,
  g as j,
  _e as k,
  s as m,
  Re as r,
  fe as w
};
