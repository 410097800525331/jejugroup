import { c as V, r as F, j as g } from "./react-vendor-BoSfm_Te.js";
import { M as K, a as U, H as Y } from "./feature-layout-COJQ6jab.js";
import { h as W, r as z, l as Q, a as v, i as $ } from "./legacy-core-Bm-E3BtG.js";
const q = () => {
  typeof console < "u" && console.log("Footer interaction initialized");
};
let R = !1, f = null, m = null, l = null;
const _ = () => {
  const e = document.getElementById("header") || document.querySelector(".hotel-shell-header") || document.querySelector(".header");
  if (e) {
    if (window.scrollY > 20) {
      e.classList.add("scrolled");
      return;
    }
    e.classList.remove("scrolled");
  }
}, X = () => {
  R || (R = !0, window.addEventListener("scroll", _), _());
}, D = () => {
  f !== null && (window.clearTimeout(f), f = null);
}, B = (e, t) => {
  t.classList.remove("active"), m === e && (m = null), l === t && (l = null);
}, I = (e, t) => {
  D(), l && l !== t && m && B(m, l), t.classList.add("active"), m = e, l = t;
}, T = (e, t) => {
  D(), f = window.setTimeout(() => {
    e.matches(":hover") || t.matches(":hover") || B(e, t);
  }, 120);
}, Z = () => {
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
}, ee = () => {
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
let x = !1;
const H = (e, t) => {
  const r = document.createElement("span");
  return r.className = t, r.setAttribute("aria-hidden", t.includes("clone") ? "true" : "false"), e.split("").forEach((n, o) => {
    const a = document.createElement("span");
    a.className = "stagger-char", a.textContent = n === " " ? " " : n, a.style.transitionDelay = `${o * 30}ms`, r.appendChild(a);
  }), r;
}, P = () => {
  document.querySelectorAll(".hotel-shell-nav-link, .nav-link").forEach((t) => {
    var c;
    const r = t.querySelector("span[data-lang]") || t.querySelector("span");
    if (!r || r.querySelector(".stagger-wrapper"))
      return;
    const n = ((c = r.textContent) == null ? void 0 : c.trim()) ?? "";
    if (!n)
      return;
    const o = document.createElement("span");
    o.className = "stagger-wrapper", o.appendChild(H(n, "stagger-original")), o.appendChild(H(n, "stagger-clone")), r.textContent = "", r.appendChild(o);
    let a = !1, i = !1;
    t.addEventListener("mouseenter", () => {
      if (i = !0, a)
        return;
      a = !0, t.classList.add("is-animating");
      const u = n.length * 30 + 300 + 50;
      setTimeout(() => {
        a = !1, i || t.classList.remove("is-animating");
      }, u);
    }), t.addEventListener("mouseleave", () => {
      i = !1, a || t.classList.remove("is-animating");
    });
  });
}, Me = () => {
  x || (x = !0, document.addEventListener("mainHeaderLoaded", P));
}, k = "userSession", ne = "jeju:session-updated";
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
}, ae = () => {
  if (N) {
    S();
    return;
  }
  N = !0, window.addEventListener("scroll", S), S();
}, oe = () => {
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
  const o = ue().startsWith("ko");
  return t ? o ? r.dataset.authMemberLabelKo || r.dataset.authMemberLabelEn || "마이페이지" : r.dataset.authMemberLabelEn || r.dataset.authMemberLabelKo || "My Page" : o ? r.dataset.authLabelKo || r.dataset.authLabelEn || "비회원 예약확인" : r.dataset.authLabelEn || r.dataset.authLabelKo || "Guest Reservation Check";
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
      localStorage.removeItem(k);
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
  "href" in e && (e.href = v("AUTH.LOGIN", r)), e.setAttribute("data-route", "AUTH.LOGIN"), e.setAttribute("data-route-params", JSON.stringify(r)), e.removeAttribute("data-logout-bound");
}, ge = (e, t) => {
  const r = e.querySelector('[data-auth-icon="guest"]'), n = e.querySelector('[data-auth-icon="member"]'), o = e.querySelector("[data-auth-label]"), a = me(e, t);
  if (t) {
    e.removeAttribute("data-action"), e.setAttribute("data-route", "MYPAGE.DASHBOARD"), e.setAttribute("data-route-params", '{"shell":"stay"}'), e.setAttribute("href", v("MYPAGE.DASHBOARD", { shell: "stay" })), r && (r.hidden = !0), n && (n.hidden = !1), o && (o.textContent = a ?? "마이페이지");
    return;
  }
  e.setAttribute("data-action", "OPEN_RESERVATION_DRAWER"), e.removeAttribute("data-route"), e.removeAttribute("data-route-params"), e.setAttribute("href", v("SERVICES.AIR.BOOKING.GUEST_RESERVATION")), r && (r.hidden = !1), n && (n.hidden = !0), o && (o.textContent = a ?? "비회원 예약확인");
}, ve = (e) => {
  if (e.querySelector('[data-route="ADMIN.DASHBOARD"]'))
    return;
  const t = document.createElement("a");
  t.id = "indexAdminBtn", t.href = "#", t.className = "util-link route-link", t.setAttribute("data-route", "ADMIN.DASHBOARD"), t.style.color = "#FF5000", t.style.fontWeight = "700", t.textContent = "관리자 페이지";
  const r = document.createElement("span");
  r.className = "util-divider", r.textContent = "|", e.prepend(t, r);
}, pe = (e) => {
  const t = e.querySelector("#indexAdminBtn");
  if (!t)
    return;
  const r = t.nextElementSibling;
  t.remove(), r instanceof HTMLElement && r.classList.contains("util-divider") && r.remove();
}, we = async () => {
  try {
    return await z();
  } catch {
    return null;
  }
}, Ee = async (e = 0) => {
  const t = document.getElementById("headerAdminBtn"), r = ie(), n = le(), o = G(), a = document.getElementById("index-header-util"), i = await we(), c = !!i, u = W(i);
  r && (c ? await he(r) : fe(r)), n && ge(n, c), o && (o.hidden = c);
  const b = de();
  if (b && (b.hidden = c), t && (t.style.display = u ? "flex" : "none"), a)
    u ? ve(a) : pe(a);
  else if (u && (r == null ? void 0 : r.id) === "indexLoginBtn" && e < 5) {
    d(e + 1);
    return;
  }
  j();
}, d = (e = 0) => {
  L || (L = !0, setTimeout(async () => {
    L = !1, await Ee(e);
  }, 0));
}, y = (e = 0) => {
  if (!J()) {
    e < 20 && window.setTimeout(() => {
      y(e + 1);
    }, 50);
    return;
  }
  ae(), oe(), se(), re(), P();
}, ye = (e = 0) => {
  y(e), d();
}, Ce = () => {
  document.addEventListener("mainHeaderLoaded", () => {
    ye();
  }), window.addEventListener("storage", (e) => {
    e.key === k && d();
  }), window.addEventListener(ne, () => {
    d();
  });
}, Ae = {
  "main-header": "mainHeaderLoaded",
  "main-footer": "mainFooterLoaded"
}, p = /* @__PURE__ */ new Set(), w = /* @__PURE__ */ new Map(), Le = (e) => {
  const t = Ae[e];
  t && document.dispatchEvent(new Event(t));
}, Se = (e) => {
  (w.get(e) ?? []).forEach((r) => r()), w.delete(e);
}, Oe = () => {
  window.__JEJU_RUNTIME_LIFECYCLE__ = {
    isReady: (e) => p.has(e),
    markReady: (e) => s(e),
    whenReady: (e) => be(e)
  };
}, s = (e) => {
  p.has(e) || (p.add(e), Le(e), document.dispatchEvent(new CustomEvent("jeju:runtime-ready", { detail: { stage: e } })), Se(e));
}, be = (e) => p.has(e) ? Promise.resolve() : new Promise((t) => {
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
  for (const o of r) {
    const a = o.src || o.getAttribute("src");
    if (a && (a.includes("components/runtime/bootstrap.js") || a.includes("components/runtime/shell-runtime.js")))
      return new URL("../../", a).href;
  }
  return e;
}, Ue = (e) => new URL(e, A()).href, M = /* @__PURE__ */ new Map(), Re = (e) => new Promise((t) => {
  requestAnimationFrame(() => {
    Promise.resolve(e == null ? void 0 : e()).catch((r) => {
      console.error("[ShellRuntime] onLoaded failed", r);
    }).finally(t);
  });
}), E = (e, t, r) => {
  const n = document.getElementById(e);
  if (!n)
    return Promise.resolve();
  const o = M.get(e);
  o && o.unmount();
  const a = V(n);
  return M.set(e, a), F.flushSync(() => {
    a.render(t);
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
    E("main-footer-placeholder", /* @__PURE__ */ g.jsx(U, {}), async () => {
      q(), h(), s("main-footer");
    })
  ]), s("main-shell"), d();
}, De = async () => {
  const e = A();
  await Promise.all([
    E("hotel-header-placeholder", /* @__PURE__ */ g.jsx(Y, { basePath: e }), async () => {
      y(), h(), s("hotel-header"), s("main-header");
    }),
    E("hotel-footer-placeholder", /* @__PURE__ */ g.jsx(U, {}), async () => {
      q(), h(), s("hotel-footer"), s("main-footer");
    })
  ]), s("hotel-shell"), d();
}, C = (e, t = "shell-runtime") => {
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
      const r = v(t, Ie(e));
      C(r, "shell-runtime-fallback");
    } catch {
      C(_e(), "shell-runtime-fallback-home");
    }
};
let O = !1;
const Be = async () => {
  if (!O) {
    O = !0;
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
  q as a,
  re as b,
  P as c,
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
