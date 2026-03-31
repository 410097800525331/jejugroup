var K = Object.defineProperty;
var G = (a, e, t) => e in a ? K(a, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : a[e] = t;
var D = (a, e, t) => G(a, typeof e != "symbol" ? e + "" : e, t);
import { c as T, a as Q, j as R } from "./react-vendor-BoSfm_Te.js";
import { R as V, F as X } from "./feature-ui-CtrW2zOd.js";
import { r as Z } from "./runtime-layout-DHpRrzxW.js";
import { S as ee } from "./runtime-components-C60H02mQ.js";
class te {
  constructor() {
    D(this, "isInitialized", !1);
    D(this, "isOpen", !1);
    D(this, "root", null);
    D(this, "backdrop", null);
    D(this, "panel", null);
    D(this, "closeButton", null);
  }
  async ensureMarkup() {
    if (this.isInitialized)
      return;
    const e = new URL("components/react/ui/reservationDrawer/drawer.css", Z("./")).href;
    if (!Array.from(document.querySelectorAll("link")).some((i) => i.href === e)) {
      const i = document.createElement("link");
      i.rel = "stylesheet", i.href = e, document.head.appendChild(i);
    }
    let o = document.getElementById("reservation-drawer-container");
    o || (o = document.createElement("div"), o.id = "reservation-drawer-container", document.body.appendChild(o)), this.root || (this.root = T(o)), this.root.render(Q.createElement(V)), await new Promise((i) => {
      requestAnimationFrame(() => i());
    }), this.backdrop = document.getElementById("resDrawerBackdrop"), this.panel = document.getElementById("resDrawerPanel"), this.closeButton = document.getElementById("resDrawerClose"), this.bindEvents(), this.isInitialized = !0;
  }
  bindEvents() {
    if (!this.backdrop || !this.panel || !this.closeButton)
      return;
    this.closeButton.addEventListener("click", () => this.close()), this.backdrop.addEventListener("click", () => this.close()), window.addEventListener("popstate", (t) => {
      const o = t.state;
      this.isOpen && (o == null ? void 0 : o.modal) !== "reservation" && this.close(!0);
    }), document.addEventListener("keydown", (t) => {
      t.key === "Escape" && this.isOpen && this.close();
    });
    const e = document.getElementById("resDrawerForm");
    e && e.addEventListener("submit", (t) => {
      t.preventDefault(), alert("예약 API 연동 전 임시 폼 상태");
    }), this.panel.addEventListener("click", (t) => {
      var i;
      ((i = t.target) == null ? void 0 : i.closest("[data-route]")) && this.close();
    });
  }
  async open() {
    await this.ensureMarkup(), !(this.isOpen || !this.backdrop || !this.panel) && (this.isOpen = !0, history.pushState({ modal: "reservation" }, "", "#reservation"), this.backdrop.offsetHeight, requestAnimationFrame(() => {
      var e, t;
      (e = this.backdrop) == null || e.classList.add("active"), (t = this.panel) == null || t.classList.add("active");
    }), document.body.style.overflow = "hidden");
  }
  close(e = !1) {
    var t, o, i;
    this.isOpen && (this.isOpen = !1, (t = this.backdrop) == null || t.classList.remove("active"), (o = this.panel) == null || o.classList.remove("active"), document.body.style.overflow = "", !e && ((i = history.state) == null ? void 0 : i.modal) === "reservation" && history.back());
  }
}
const ye = new te(), ne = (a) => {
  const e = a ?? {};
  return {
    checkIn: e.checkIn ?? null,
    checkOut: e.checkOut ?? null,
    tempCheckIn: e.tempCheckIn ?? null,
    tempCheckOut: e.tempCheckOut ?? null
  };
}, ae = (a) => {
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
    ...a ?? {}
  }, t = ne(e.state);
  let o = e.initialMonth ? new Date(e.initialMonth) : /* @__PURE__ */ new Date(), i = null, w = !1, S = null, L = null;
  const C = () => L || (L = {
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
  }, L), f = (n) => {
    n == null || n.stopPropagation();
  }, k = (n, s) => {
    typeof n == "function" && n(t, v, s);
  }, j = () => Array.isArray(e.weekdayLabels) && e.weekdayLabels.length === 7 ? e.weekdayLabels : e.weekStartsOn === "sunday" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], N = (n) => {
    const s = new Date(n);
    return s.setHours(0, 0, 0, 0), s.getTime();
  }, W = (n) => e.weekStartsOn === "monday" ? n === 0 ? 6 : n - 1 : n, H = () => t.tempCheckIn || t.checkIn, _ = () => t.tempCheckOut || t.checkOut, q = (n) => typeof e.monthLabelFormatter == "function" ? e.monthLabelFormatter(n, t, v) : `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`, z = (n, s) => typeof e.dayLabelFormatter == "function" ? e.dayLabelFormatter(n, s, t, v) : String(n), U = (n) => {
    const s = n.getFullYear(), r = n.getMonth(), c = new Date(s, r, 1).getDay(), d = W(c), u = new Date(s, r + 1, 0).getDate(), h = N(/* @__PURE__ */ new Date()), m = H(), l = _();
    let y = "";
    for (let g = 0; g < d; g += 1)
      y += '<div class="DayPicker-Day DayPicker-Day--outside"></div>';
    for (let g = 1; g <= u; g += 1) {
      const p = new Date(s, r, g).getTime(), I = ["DayPicker-Day"];
      p < h && I.push("DayPicker-Day--disabled"), p === h && I.push("DayPicker-Day--today"), m && p === m && I.push("DayPicker-Day--selected", "DayPicker-Day--checkIn", "DayPicker-Day--hasRange"), l && p === l && I.push("DayPicker-Day--selected", "DayPicker-Day--checkOut", "DayPicker-Day--hasRange"), m && l && p > m && p < l && I.push("DayPicker-Day--inRange"), e.showHoverRange && m && !l && i && p > m && p <= i && (I.push("DayPicker-Day--hoverRange"), p === i && I.push("DayPicker-Day--hoverEnd")), y += `<div class="${I.join(" ")}" data-timestamp="${p}" data-day="${g}">${z(g, p)}</div>`;
    }
    return y;
  }, B = () => {
    const { popup: n } = C();
    n && n.querySelectorAll(".DayPicker-Day").forEach((s) => {
      if (s.classList.remove("DayPicker-Day--hoverRange"), s.classList.remove("DayPicker-Day--hoverEnd"), !e.showHoverRange)
        return;
      const r = Number.parseInt(s.dataset.timestamp ?? "", 10);
      Number.isFinite(r) && t.tempCheckIn && !t.tempCheckOut && i && r > t.tempCheckIn && r <= i && (s.classList.add("DayPicker-Day--hoverRange"), r === i && s.classList.add("DayPicker-Day--hoverEnd"));
    });
  }, $ = (n) => {
    !t.tempCheckIn || t.tempCheckIn && t.tempCheckOut ? (t.tempCheckIn = n, t.tempCheckOut = null, i = null) : n < t.tempCheckIn ? (t.tempCheckIn = n, i = null) : n > t.tempCheckIn && (t.tempCheckOut = n, i = null), k(e.onTempChange ?? null), b();
  }, J = () => {
    const { popup: n, dayPickerContainer: s } = C();
    n && (n.querySelectorAll(".DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)").forEach((r) => {
      r.addEventListener("click", (c) => {
        f(c);
        const d = Number.parseInt(r.dataset.timestamp ?? "", 10);
        Number.isFinite(d) && $(d);
      }), e.showHoverRange && r.addEventListener("mouseenter", () => {
        const c = Number.parseInt(r.dataset.timestamp ?? "", 10);
        Number.isFinite(c) && t.tempCheckIn && !t.tempCheckOut && c > t.tempCheckIn && (i = c, B());
      });
    }), s && e.showHoverRange && (s.onmouseleave = () => {
      i && (i = null, B());
    }));
  }, M = (n) => {
    const { tabCalendar: s, tabFlexible: r, panelCalendar: c, panelFlexible: d } = C();
    [s, r].forEach((u) => {
      u && (u.classList.remove("active"), u.setAttribute("aria-selected", "false"));
    }), [c, d].forEach((u) => {
      u && (u.classList.remove("active"), u.style.display = "none");
    }), n && (n.classList.add("active"), n.setAttribute("aria-selected", "true"), n === s && c && (c.classList.add("active"), c.style.display = "block"), n === r && d && (d.classList.add("active"), d.style.display = "block"));
  }, A = () => {
    const { field: n, popup: s } = C();
    !n || !s || (typeof e.closeAllPopups == "function" && e.closeAllPopups(e.popupId), t.tempCheckIn = t.checkIn, t.tempCheckOut = t.checkOut, i = null, s.classList.add("active"), e.toggleFieldActiveClass && n.classList.add("active"), e.openingClass && (s.classList.add(e.openingClass), S && window.clearTimeout(S), e.openingClassDurationMs > 0 && (S = window.setTimeout(() => {
      s.classList.remove(e.openingClass);
    }, e.openingClassDurationMs))), k(e.onTempChange ?? null), b(), k(e.onOpen ?? null));
  }, P = (n) => {
    const { field: s, popup: r } = C();
    r && (r.classList.remove("active"), e.openingClass && r.classList.remove(e.openingClass), e.toggleFieldActiveClass && s && s.classList.remove("active"), k(e.onClose ?? null, n));
  }, x = (n) => {
    t.tempCheckIn = null, t.tempCheckOut = null, i = null, k(e.onTempChange ?? null), k(e.onCancel ?? null, n);
  }, Y = (n) => {
    if (f(n), !(typeof e.onBeforeConfirm == "function" && e.onBeforeConfirm(t, v) === !1)) {
      if (t.checkIn = t.tempCheckIn, t.checkOut = t.tempCheckOut, k(e.onConfirm ?? null), typeof e.closeAllPopups == "function") {
        e.closeAllPopups();
        const { field: s } = C();
        e.toggleFieldActiveClass && s && s.classList.remove("active");
        return;
      }
      P({ reason: "confirm" });
    }
  }, b = () => {
    const { monthsContainer: n } = C();
    if (!n)
      return;
    n.innerHTML = "";
    const s = j();
    for (let r = 0; r < e.monthsToRender; r += 1) {
      const c = new Date(o.getFullYear(), o.getMonth() + r, 1), d = document.createElement("div");
      d.className = "DayPicker-Month";
      const u = document.createElement("div");
      u.className = "DayPicker-Caption", u.textContent = q(c), d.appendChild(u);
      const h = document.createElement("div");
      h.className = "DayPicker-Weekdays", s.forEach((l) => {
        const y = document.createElement("div");
        y.className = "DayPicker-Weekday", y.textContent = l, h.appendChild(y);
      }), d.appendChild(h);
      const m = document.createElement("div");
      m.className = "DayPicker-Body", m.innerHTML = U(c), d.appendChild(m), n.appendChild(d);
    }
    J();
  }, v = {
    init: () => {
      if (w)
        return v;
      const { field: n, popup: s, prevButton: r, nextButton: c, clearButton: d, confirmButton: u, tabCalendar: h, tabFlexible: m } = C();
      return !n || !s || (n.addEventListener("click", (l) => {
        if (f(l), !s.classList.contains("active")) {
          A();
          return;
        }
        e.toggleMode === "toggle" && (e.cancelOnToggleClose && x({ reason: "toggle" }), P({ reason: "toggle" }));
      }), s.addEventListener("click", f), r == null || r.addEventListener("click", (l) => {
        f(l), o.setMonth(o.getMonth() - 1), b();
      }), c == null || c.addEventListener("click", (l) => {
        f(l), o.setMonth(o.getMonth() + 1), b();
      }), d == null || d.addEventListener("click", (l) => {
        f(l), t.checkIn = null, t.checkOut = null, t.tempCheckIn = null, t.tempCheckOut = null, i = null, k(e.onTempChange ?? null), b(), k(e.onClear ?? null);
      }), u == null || u.addEventListener("click", Y), e.enableTabs && (h == null || h.addEventListener("click", (l) => {
        f(l), M(h);
      }), m == null || m.addEventListener("click", (l) => {
        f(l), M(m);
      })), e.enableFlexibleOptions && s.querySelectorAll(e.flexibleOptionSelector).forEach((l) => {
        l.addEventListener("click", (y) => {
          f(y), s.querySelectorAll(e.flexibleOptionSelector).forEach((g) => {
            g.classList.remove("active");
          }), l.classList.add("active");
        });
      }), w = !0), v;
    },
    renderCalendar: b,
    openCalendar: A,
    closeCalendar: P,
    cancelSelection: x,
    getState: () => t,
    getMonth: () => new Date(o),
    setMonth: (n) => {
      o = new Date(n), b();
    }
  };
  return v;
}, ge = () => {
  window.JJRangeCalendar = {
    createRangeCalendar: (a) => ae(a)
  };
};
let F = null;
const E = (a) => String(a ?? "").trim(), se = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", ie = () => localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko", oe = () => {
  try {
    const a = localStorage.getItem("jeju_wishlist") ?? "[]", e = JSON.parse(a);
    return Array.isArray(e) ? e : [];
  } catch {
    return [];
  }
}, O = (a, e, t) => {
  document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: a })), document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: e })), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: t }));
}, re = () => {
  if (window.FABState)
    return;
  const a = {
    currency: se(),
    language: ie(),
    wishlist: oe(),
    setCurrencyAndLang: (e, t) => {
      a.currency = e, a.language = t, localStorage.setItem("jeju_fab_currency", e), localStorage.setItem("jeju_fab_lang", t), O(e, t, a.wishlist);
    },
    addToWishlist: (e) => {
      const t = [...a.wishlist], o = E(e.id);
      if (!o)
        return;
      const i = t.findIndex((w) => E(w.id) === o);
      i === -1 ? t.push(e) : t.splice(i, 1), a.wishlist = t, localStorage.setItem("jeju_wishlist", JSON.stringify(t)), O(a.currency, a.language, t);
    },
    removeFromWishlist: (e) => {
      const t = E(e), o = a.wishlist.filter((i) => E(i.id) !== t);
      a.wishlist = o, localStorage.setItem("jeju_wishlist", JSON.stringify(o)), O(a.currency, a.language, o);
    },
    isInWishlist: (e) => {
      const t = E(e);
      return a.wishlist.some((o) => E(o.id) === t);
    }
  };
  window.FABState = a, document.addEventListener("fabCurrencyChanged", (e) => {
    const t = e;
    a.currency = t.detail === "USD" ? "USD" : "KRW";
  }), document.addEventListener("fabLanguageChanged", (e) => {
    const t = e;
    a.language = t.detail === "en" ? "en" : "ko";
  }), document.addEventListener("fabWishlistUpdated", (e) => {
    const t = e;
    a.wishlist = Array.isArray(t.detail) ? [...t.detail] : [];
  }), O(a.currency, a.language, a.wishlist);
}, ke = () => {
  const a = "jeju-fab-root";
  let e = document.getElementById(a);
  e || (e = document.createElement("div"), e.id = a, document.body.appendChild(e)), F || (F = T(e)), F.render(
    /* @__PURE__ */ R.jsx(ee, { children: /* @__PURE__ */ R.jsx(X, {}) })
  ), re();
};
export {
  ae as c,
  ge as i,
  ye as r,
  ke as s
};
