var Q = Object.defineProperty;
var V = (n, e, t) => e in n ? Q(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var I = (n, e, t) => V(n, typeof e != "symbol" ? e + "" : e, t);
import { c as N, a as X, j as T } from "./react-vendor-BoSfm_Te.js";
import { R as Z, F as ee } from "./feature-ui-DAUngKpP.js";
import { r as te } from "./runtime-layout-DSqPGP9h.js";
import { S as ne } from "./runtime-components-DdAclnfo.js";
class ae {
  constructor() {
    I(this, "isInitialized", !1);
    I(this, "isOpen", !1);
    I(this, "root", null);
    I(this, "backdrop", null);
    I(this, "panel", null);
    I(this, "closeButton", null);
    I(this, "cssReady", null);
  }
  waitForNextFrame() {
    return new Promise((e) => {
      requestAnimationFrame(() => e());
    });
  }
  ensureCss(e) {
    return this.cssReady ? this.cssReady : (this.cssReady = new Promise((t) => {
      const s = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find(
        (m) => m.href === e
      );
      if (s) {
        if (s.sheet) {
          t();
          return;
        }
        s.addEventListener("load", () => t(), { once: !0 }), s.addEventListener("error", () => t(), { once: !0 });
        return;
      }
      const o = document.createElement("link");
      o.rel = "stylesheet", o.href = e, o.addEventListener("load", () => t(), { once: !0 }), o.addEventListener("error", () => t(), { once: !0 }), document.head.appendChild(o);
    }), this.cssReady);
  }
  async ensureMarkup() {
    if (this.isInitialized)
      return;
    const e = new URL("components/react/ui/reservationDrawer/drawer.css", te("./")).href;
    await this.ensureCss(e);
    let t = document.getElementById("reservation-drawer-container");
    t || (t = document.createElement("div"), t.id = "reservation-drawer-container", document.body.appendChild(t)), this.root || (this.root = N(t)), this.root.render(X.createElement(Z)), await this.waitForNextFrame(), await this.waitForNextFrame(), this.backdrop = document.getElementById("resDrawerBackdrop"), this.panel = document.getElementById("resDrawerPanel"), this.closeButton = document.getElementById("resDrawerClose"), this.bindEvents(), this.isInitialized = !0;
  }
  bindEvents() {
    if (!this.backdrop || !this.panel || !this.closeButton)
      return;
    this.closeButton.addEventListener("click", () => this.close()), this.backdrop.addEventListener("click", () => this.close()), window.addEventListener("popstate", (t) => {
      const s = t.state;
      this.isOpen && (s == null ? void 0 : s.modal) !== "reservation" && this.close(!0);
    }), document.addEventListener("keydown", (t) => {
      t.key === "Escape" && this.isOpen && this.close();
    });
    const e = document.getElementById("resDrawerForm");
    e && e.addEventListener("submit", (t) => {
      t.preventDefault(), alert("예약 API 연동 전 임시 폼 상태");
    }), this.panel.addEventListener("click", (t) => {
      var o;
      ((o = t.target) == null ? void 0 : o.closest("[data-route]")) && this.close();
    });
  }
  async open() {
    await this.ensureMarkup(), !(this.isOpen || !this.backdrop || !this.panel) && (this.isOpen = !0, history.pushState({ modal: "reservation" }, "", "#reservation"), this.backdrop.offsetHeight, requestAnimationFrame(() => {
      var e, t;
      (e = this.backdrop) == null || e.classList.add("active"), (t = this.panel) == null || t.classList.add("active");
    }), document.body.style.overflow = "hidden");
  }
  close(e = !1) {
    var t, s, o;
    this.isOpen && (this.isOpen = !1, (t = this.backdrop) == null || t.classList.remove("active"), (s = this.panel) == null || s.classList.remove("active"), document.body.style.overflow = "", !e && ((o = history.state) == null ? void 0 : o.modal) === "reservation" && history.back());
  }
}
const Ee = new ae(), se = (n) => {
  const e = n ?? {};
  return {
    checkIn: e.checkIn ?? null,
    checkOut: e.checkOut ?? null,
    tempCheckIn: e.tempCheckIn ?? null,
    tempCheckOut: e.tempCheckOut ?? null
  };
}, re = (n) => {
  const e = {
    fieldId: "checkInField",
    popupId: "calendarPopup",
    monthsContainerId: "calendarMonths",
    dayPickerContainerId: "dayPickerContainer",
    prevButtonId: "prevMonth",
    nextButtonId: "nextMonth",
    clearButtonId: "btn-clear",
    confirmButtonId: "btn-confirm",
    tabCalendarId: "tab-calendar",
    tabFlexibleId: "tab-flexible",
    panelCalendarId: "panel-calendar",
    panelFlexibleId: "panel-flexible",
    flexibleOptionSelector: ".Flexible-Option",
    weekStartsOn: "monday",
    weekdayLabels: null,
    monthLabelFormatter: null,
    dayLabelFormatter: null,
    monthsToRender: 2,
    showHoverRange: !0,
    enableTabs: !0,
    enableFlexibleOptions: !0,
    toggleMode: "toggle",
    cancelOnToggleClose: !1,
    toggleFieldActiveClass: !1,
    openingClass: "",
    openingClassDurationMs: 0,
    closeAllPopups: null,
    onOpen: null,
    onClose: null,
    onCancel: null,
    onClear: null,
    onTempChange: null,
    onBeforeConfirm: null,
    onConfirm: null,
    state: null,
    initialMonth: null,
    ...n ?? {}
  }, t = se(e.state);
  let s = e.initialMonth ? new Date(e.initialMonth) : /* @__PURE__ */ new Date(), o = null, m = !1, w = null, F = null;
  const C = () => F || (F = {
    field: document.getElementById(e.fieldId),
    popup: document.getElementById(e.popupId),
    monthsContainer: document.getElementById(e.monthsContainerId),
    dayPickerContainer: document.getElementById(e.dayPickerContainerId),
    prevButton: document.getElementById(e.prevButtonId),
    nextButton: document.getElementById(e.nextButtonId),
    clearButton: document.getElementById(e.clearButtonId),
    confirmButton: document.getElementById(e.confirmButtonId),
    tabCalendar: document.getElementById(e.tabCalendarId),
    tabFlexible: document.getElementById(e.tabFlexibleId),
    panelCalendar: document.getElementById(e.panelCalendarId),
    panelFlexible: document.getElementById(e.panelFlexibleId)
  }, F), p = (a) => {
    a == null || a.stopPropagation();
  }, v = (a, r) => {
    typeof a == "function" && a(t, L, r);
  }, _ = () => Array.isArray(e.weekdayLabels) && e.weekdayLabels.length === 7 ? e.weekdayLabels : e.weekStartsOn === "sunday" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], W = (a) => {
    const r = new Date(a);
    return r.setHours(0, 0, 0, 0), r.getTime();
  }, H = (a) => e.weekStartsOn === "monday" ? a === 0 ? 6 : a - 1 : a, z = () => t.tempCheckIn || t.checkIn, q = () => t.tempCheckOut || t.checkOut, U = (a) => typeof e.monthLabelFormatter == "function" ? e.monthLabelFormatter(a, t, L) : `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}`, $ = (a, r) => typeof e.dayLabelFormatter == "function" ? e.dayLabelFormatter(a, r, t, L) : String(a), J = (a) => {
    const r = a.getFullYear(), i = a.getMonth(), c = new Date(r, i, 1).getDay(), d = H(c), u = new Date(r, i + 1, 0).getDate(), f = W(/* @__PURE__ */ new Date()), h = z(), l = q();
    let y = "";
    for (let k = 0; k < d; k += 1)
      y += '<div class="DayPicker-Day DayPicker-Day--outside"></div>';
    for (let k = 1; k <= u; k += 1) {
      const g = new Date(r, i, k).getTime(), b = ["DayPicker-Day"];
      g < f && b.push("DayPicker-Day--disabled"), g === f && b.push("DayPicker-Day--today"), h && g === h && b.push("DayPicker-Day--selected", "DayPicker-Day--checkIn", "DayPicker-Day--hasRange"), l && g === l && b.push("DayPicker-Day--selected", "DayPicker-Day--checkOut", "DayPicker-Day--hasRange"), h && l && g > h && g < l && b.push("DayPicker-Day--inRange"), e.showHoverRange && h && !l && o && g > h && g <= o && (b.push("DayPicker-Day--hoverRange"), g === o && b.push("DayPicker-Day--hoverEnd")), y += `<div class="${b.join(" ")}" data-timestamp="${g}" data-day="${k}">${$(k, g)}</div>`;
    }
    return y;
  }, R = () => {
    const { popup: a } = C();
    a && a.querySelectorAll(".DayPicker-Day").forEach((r) => {
      if (r.classList.remove("DayPicker-Day--hoverRange"), r.classList.remove("DayPicker-Day--hoverEnd"), !e.showHoverRange)
        return;
      const i = Number.parseInt(r.dataset.timestamp ?? "", 10);
      Number.isFinite(i) && t.tempCheckIn && !t.tempCheckOut && o && i > t.tempCheckIn && i <= o && (r.classList.add("DayPicker-Day--hoverRange"), i === o && r.classList.add("DayPicker-Day--hoverEnd"));
    });
  }, Y = (a) => {
    !t.tempCheckIn || t.tempCheckIn && t.tempCheckOut ? (t.tempCheckIn = a, t.tempCheckOut = null, o = null) : a < t.tempCheckIn ? (t.tempCheckIn = a, o = null) : a > t.tempCheckIn && (t.tempCheckOut = a, o = null), v(e.onTempChange ?? null), E();
  }, K = () => {
    const { popup: a, dayPickerContainer: r } = C();
    a && (a.querySelectorAll(".DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)").forEach((i) => {
      i.addEventListener("click", (c) => {
        p(c);
        const d = Number.parseInt(i.dataset.timestamp ?? "", 10);
        Number.isFinite(d) && Y(d);
      }), e.showHoverRange && i.addEventListener("mouseenter", () => {
        const c = Number.parseInt(i.dataset.timestamp ?? "", 10);
        Number.isFinite(c) && t.tempCheckIn && !t.tempCheckOut && c > t.tempCheckIn && (o = c, R());
      });
    }), r && e.showHoverRange && (r.onmouseleave = () => {
      o && (o = null, R());
    }));
  }, x = (a) => {
    const { tabCalendar: r, tabFlexible: i, panelCalendar: c, panelFlexible: d } = C();
    [r, i].forEach((u) => {
      u && (u.classList.remove("active"), u.setAttribute("aria-selected", "false"));
    }), [c, d].forEach((u) => {
      u && (u.classList.remove("active"), u.style.display = "none");
    }), a && (a.classList.add("active"), a.setAttribute("aria-selected", "true"), a === r && c && (c.classList.add("active"), c.style.display = "block"), a === i && d && (d.classList.add("active"), d.style.display = "block"));
  }, A = () => {
    const { field: a, popup: r } = C();
    !a || !r || (typeof e.closeAllPopups == "function" && e.closeAllPopups(e.popupId), t.tempCheckIn = t.checkIn, t.tempCheckOut = t.checkOut, o = null, r.classList.add("active"), e.toggleFieldActiveClass && a.classList.add("active"), e.openingClass && (r.classList.add(e.openingClass), w && window.clearTimeout(w), e.openingClassDurationMs > 0 && (w = window.setTimeout(() => {
      r.classList.remove(e.openingClass);
    }, e.openingClassDurationMs))), v(e.onTempChange ?? null), E(), v(e.onOpen ?? null));
  }, P = (a) => {
    const { field: r, popup: i } = C();
    i && (i.classList.remove("active"), e.openingClass && i.classList.remove(e.openingClass), e.toggleFieldActiveClass && r && r.classList.remove("active"), v(e.onClose ?? null, a));
  }, j = (a) => {
    t.tempCheckIn = null, t.tempCheckOut = null, o = null, v(e.onTempChange ?? null), v(e.onCancel ?? null, a);
  }, G = (a) => {
    if (p(a), !(typeof e.onBeforeConfirm == "function" && e.onBeforeConfirm(t, L) === !1)) {
      if (t.checkIn = t.tempCheckIn, t.checkOut = t.tempCheckOut, v(e.onConfirm ?? null), typeof e.closeAllPopups == "function") {
        e.closeAllPopups();
        const { field: r } = C();
        e.toggleFieldActiveClass && r && r.classList.remove("active");
        return;
      }
      P({ reason: "confirm" });
    }
  }, E = () => {
    const { monthsContainer: a } = C();
    if (!a)
      return;
    a.innerHTML = "";
    const r = _();
    for (let i = 0; i < e.monthsToRender; i += 1) {
      const c = new Date(s.getFullYear(), s.getMonth() + i, 1), d = document.createElement("div");
      d.className = "DayPicker-Month";
      const u = document.createElement("div");
      u.className = "DayPicker-Caption", u.textContent = U(c), d.appendChild(u);
      const f = document.createElement("div");
      f.className = "DayPicker-Weekdays", r.forEach((l) => {
        const y = document.createElement("div");
        y.className = "DayPicker-Weekday", y.textContent = l, f.appendChild(y);
      }), d.appendChild(f);
      const h = document.createElement("div");
      h.className = "DayPicker-Body", h.innerHTML = J(c), d.appendChild(h), a.appendChild(d);
    }
    K();
  }, L = {
    init: () => {
      if (m)
        return L;
      const { field: a, popup: r, prevButton: i, nextButton: c, clearButton: d, confirmButton: u, tabCalendar: f, tabFlexible: h } = C();
      return !a || !r || (a.addEventListener("click", (l) => {
        if (p(l), !r.classList.contains("active")) {
          A();
          return;
        }
        e.toggleMode === "toggle" && (e.cancelOnToggleClose && j({ reason: "toggle" }), P({ reason: "toggle" }));
      }), r.addEventListener("click", p), i == null || i.addEventListener("click", (l) => {
        p(l), s.setMonth(s.getMonth() - 1), E();
      }), c == null || c.addEventListener("click", (l) => {
        p(l), s.setMonth(s.getMonth() + 1), E();
      }), d == null || d.addEventListener("click", (l) => {
        p(l), t.checkIn = null, t.checkOut = null, t.tempCheckIn = null, t.tempCheckOut = null, o = null, v(e.onTempChange ?? null), E(), v(e.onClear ?? null);
      }), u == null || u.addEventListener("click", G), e.enableTabs && (f == null || f.addEventListener("click", (l) => {
        p(l), x(f);
      }), h == null || h.addEventListener("click", (l) => {
        p(l), x(h);
      })), e.enableFlexibleOptions && r.querySelectorAll(e.flexibleOptionSelector).forEach((l) => {
        l.addEventListener("click", (y) => {
          p(y), r.querySelectorAll(e.flexibleOptionSelector).forEach((k) => {
            k.classList.remove("active");
          }), l.classList.add("active");
        });
      }), m = !0), L;
    },
    renderCalendar: E,
    openCalendar: A,
    closeCalendar: P,
    cancelSelection: j,
    getState: () => t,
    getMonth: () => new Date(s),
    setMonth: (a) => {
      s = new Date(a), E();
    }
  };
  return L;
}, we = () => {
  window.JJRangeCalendar = {
    createRangeCalendar: (n) => re(n)
  };
};
let B = null;
const D = (n) => String(n ?? "").trim(), M = () => typeof window > "u" ? null : window.frontI18n ?? null, O = (n) => n === "en" || n === "ko" ? n : null, oe = () => {
  try {
    return localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko";
  } catch {
    return "ko";
  }
}, ie = () => {
  var t, s;
  const n = M();
  return O(((t = n == null ? void 0 : n.getCurrentLang) == null ? void 0 : t.call(n)) ?? ((s = n == null ? void 0 : n.resolveCurrentLang) == null ? void 0 : s.call(n))) ?? oe();
}, le = (n) => {
  try {
    localStorage.setItem("jeju_lang", n), localStorage.setItem("front.lang", n), localStorage.setItem("jeju_fab_lang", n);
  } catch {
  }
}, ce = (n) => {
  typeof document > "u" || (document.dispatchEvent(new CustomEvent("languageChanged", { detail: n })), document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: n })), document.dispatchEvent(new CustomEvent("front:i18n-change", { detail: { lang: n, source: "fab:fallback" } })));
}, de = (n) => {
  const e = M();
  if (e != null && e.subscribeLanguageChange)
    return e.subscribeLanguageChange((s) => {
      const o = O(s.lang);
      o && n(o);
    });
  if (typeof document > "u")
    return () => {
    };
  const t = (s) => {
    const m = s.detail, w = O(
      typeof m == "string" ? m : typeof m == "object" && m ? m.lang ?? m.currentLang ?? m.value : null
    );
    w && n(w);
  };
  return document.addEventListener("languageChanged", t), document.addEventListener("fabLanguageChanged", t), document.addEventListener("front:i18n-change", t), () => {
    document.removeEventListener("languageChanged", t), document.removeEventListener("fabLanguageChanged", t), document.removeEventListener("front:i18n-change", t);
  };
}, ue = (n, e) => {
  const t = O(n) ?? "ko", s = M();
  return s != null && s.setCurrentLang ? s.setCurrentLang(t, { source: e }) ?? t : (le(t), ce(t), t);
}, he = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", me = () => ie(), fe = () => {
  try {
    const n = localStorage.getItem("jeju_wishlist") ?? "[]", e = JSON.parse(n);
    return Array.isArray(e) ? e : [];
  } catch {
    return [];
  }
}, S = (n, e, t, s) => {
  document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: n })), (s == null ? void 0 : s.includeLanguage) !== !1 && document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: e })), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: t }));
}, ge = () => {
  if (window.FABState)
    return;
  const n = {
    currency: he(),
    language: me(),
    wishlist: fe(),
    setCurrencyAndLang: (e, t) => {
      n.currency = e, n.language = ue(t, "fab:setCurrencyAndLang"), localStorage.setItem("jeju_fab_currency", e), S(e, n.language, n.wishlist, { includeLanguage: !1 });
    },
    addToWishlist: (e) => {
      const t = [...n.wishlist], s = D(e.id);
      if (!s)
        return;
      const o = t.findIndex((m) => D(m.id) === s);
      o === -1 ? t.push(e) : t.splice(o, 1), n.wishlist = t, localStorage.setItem("jeju_wishlist", JSON.stringify(t)), S(n.currency, n.language, t);
    },
    removeFromWishlist: (e) => {
      const t = D(e), s = n.wishlist.filter((o) => D(o.id) !== t);
      n.wishlist = s, localStorage.setItem("jeju_wishlist", JSON.stringify(s)), S(n.currency, n.language, s);
    },
    isInWishlist: (e) => {
      const t = D(e);
      return n.wishlist.some((s) => D(s.id) === t);
    }
  };
  window.FABState = n, document.addEventListener("fabCurrencyChanged", (e) => {
    const t = e;
    n.currency = t.detail === "USD" ? "USD" : "KRW";
  }), document.addEventListener("fabLanguageChanged", (e) => {
    const t = e;
    n.language = t.detail === "en" ? "en" : "ko";
  }), document.addEventListener("fabWishlistUpdated", (e) => {
    const t = e;
    n.wishlist = Array.isArray(t.detail) ? [...t.detail] : [];
  }), de((e) => {
    n.language = e;
  }), S(n.currency, n.language, n.wishlist);
}, De = () => {
  const n = "jeju-fab-root";
  let e = document.getElementById(n);
  e || (e = document.createElement("div"), e.id = n, document.body.appendChild(e)), B || (B = N(e)), B.render(
    /* @__PURE__ */ T.jsx(ne, { children: /* @__PURE__ */ T.jsx(ee, {}) })
  ), ge();
};
export {
  re as c,
  we as i,
  Ee as r,
  De as s
};
