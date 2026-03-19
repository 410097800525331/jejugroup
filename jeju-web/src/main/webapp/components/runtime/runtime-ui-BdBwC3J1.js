var Y = Object.defineProperty;
var K = (s, e, t) => e in s ? Y(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t;
var D = (s, e, t) => K(s, typeof e != "symbol" ? e + "" : e, t);
import { c as R, a as G, j as x } from "./react-vendor-BoSfm_Te.js";
import { R as Q, F as V } from "./feature-ui-Cu6m9QvO.js";
import { r as X } from "./runtime-layout-Be4Rvwbc.js";
import { S as Z } from "./runtime-components-C60H02mQ.js";
class ee {
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
    const e = new URL("components/react/ui/reservationDrawer/drawer.css", X("./")).href;
    if (!Array.from(document.querySelectorAll("link")).some((i) => i.href === e)) {
      const i = document.createElement("link");
      i.rel = "stylesheet", i.href = e, document.head.appendChild(i);
    }
    let r = document.getElementById("reservation-drawer-container");
    r || (r = document.createElement("div"), r.id = "reservation-drawer-container", document.body.appendChild(r)), this.root || (this.root = R(r)), this.root.render(G.createElement(Q)), await new Promise((i) => {
      requestAnimationFrame(() => i());
    }), this.backdrop = document.getElementById("resDrawerBackdrop"), this.panel = document.getElementById("resDrawerPanel"), this.closeButton = document.getElementById("resDrawerClose"), this.bindEvents(), this.isInitialized = !0;
  }
  bindEvents() {
    if (!this.backdrop || !this.panel || !this.closeButton)
      return;
    this.closeButton.addEventListener("click", () => this.close()), this.backdrop.addEventListener("click", () => this.close()), window.addEventListener("popstate", (t) => {
      const r = t.state;
      this.isOpen && (r == null ? void 0 : r.modal) !== "reservation" && this.close(!0);
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
    var t, r, i;
    this.isOpen && (this.isOpen = !1, (t = this.backdrop) == null || t.classList.remove("active"), (r = this.panel) == null || r.classList.remove("active"), document.body.style.overflow = "", !e && ((i = history.state) == null ? void 0 : i.modal) === "reservation" && history.back());
  }
}
const fe = new ee(), te = (s) => {
  const e = s ?? {};
  return {
    checkIn: e.checkIn ?? null,
    checkOut: e.checkOut ?? null,
    tempCheckIn: e.tempCheckIn ?? null,
    tempCheckOut: e.tempCheckOut ?? null
  };
}, ne = (s) => {
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
    ...s ?? {}
  }, t = te(e.state);
  let r = e.initialMonth ? new Date(e.initialMonth) : /* @__PURE__ */ new Date(), i = null, E = !1, L = null, w = null;
  const C = () => w || (w = {
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
  }, w), f = (n) => {
    n == null || n.stopPropagation();
  }, k = (n, a) => {
    typeof n == "function" && n(t, v, a);
  }, T = () => Array.isArray(e.weekdayLabels) && e.weekdayLabels.length === 7 ? e.weekdayLabels : e.weekStartsOn === "sunday" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], j = (n) => {
    const a = new Date(n);
    return a.setHours(0, 0, 0, 0), a.getTime();
  }, N = (n) => e.weekStartsOn === "monday" ? n === 0 ? 6 : n - 1 : n, W = () => t.tempCheckIn || t.checkIn, H = () => t.tempCheckOut || t.checkOut, _ = (n) => typeof e.monthLabelFormatter == "function" ? e.monthLabelFormatter(n, t, v) : `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}`, q = (n, a) => typeof e.dayLabelFormatter == "function" ? e.dayLabelFormatter(n, a, t, v) : String(n), U = (n) => {
    const a = n.getFullYear(), o = n.getMonth(), c = new Date(a, o, 1).getDay(), d = N(c), u = new Date(a, o + 1, 0).getDate(), h = j(/* @__PURE__ */ new Date()), m = W(), l = H();
    let y = "";
    for (let g = 0; g < d; g += 1)
      y += '<div class="DayPicker-Day DayPicker-Day--outside"></div>';
    for (let g = 1; g <= u; g += 1) {
      const p = new Date(a, o, g).getTime(), b = ["DayPicker-Day"];
      p < h && b.push("DayPicker-Day--disabled"), p === h && b.push("DayPicker-Day--today"), m && p === m && b.push("DayPicker-Day--selected", "DayPicker-Day--checkIn", "DayPicker-Day--hasRange"), l && p === l && b.push("DayPicker-Day--selected", "DayPicker-Day--checkOut", "DayPicker-Day--hasRange"), m && l && p > m && p < l && b.push("DayPicker-Day--inRange"), e.showHoverRange && m && !l && i && p > m && p <= i && (b.push("DayPicker-Day--hoverRange"), p === i && b.push("DayPicker-Day--hoverEnd")), y += `<div class="${b.join(" ")}" data-timestamp="${p}" data-day="${g}">${q(g, p)}</div>`;
    }
    return y;
  }, F = () => {
    const { popup: n } = C();
    n && n.querySelectorAll(".DayPicker-Day").forEach((a) => {
      if (a.classList.remove("DayPicker-Day--hoverRange"), a.classList.remove("DayPicker-Day--hoverEnd"), !e.showHoverRange)
        return;
      const o = Number.parseInt(a.dataset.timestamp ?? "", 10);
      Number.isFinite(o) && t.tempCheckIn && !t.tempCheckOut && i && o > t.tempCheckIn && o <= i && (a.classList.add("DayPicker-Day--hoverRange"), o === i && a.classList.add("DayPicker-Day--hoverEnd"));
    });
  }, $ = (n) => {
    !t.tempCheckIn || t.tempCheckIn && t.tempCheckOut ? (t.tempCheckIn = n, t.tempCheckOut = null, i = null) : n < t.tempCheckIn ? (t.tempCheckIn = n, i = null) : n > t.tempCheckIn && (t.tempCheckOut = n, i = null), k(e.onTempChange ?? null), I();
  }, J = () => {
    const { popup: n, dayPickerContainer: a } = C();
    n && (n.querySelectorAll(".DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)").forEach((o) => {
      o.addEventListener("click", (c) => {
        f(c);
        const d = Number.parseInt(o.dataset.timestamp ?? "", 10);
        Number.isFinite(d) && $(d);
      }), e.showHoverRange && o.addEventListener("mouseenter", () => {
        const c = Number.parseInt(o.dataset.timestamp ?? "", 10);
        Number.isFinite(c) && t.tempCheckIn && !t.tempCheckOut && c > t.tempCheckIn && (i = c, F());
      });
    }), a && e.showHoverRange && (a.onmouseleave = () => {
      i && (i = null, F());
    }));
  }, B = (n) => {
    const { tabCalendar: a, tabFlexible: o, panelCalendar: c, panelFlexible: d } = C();
    [a, o].forEach((u) => {
      u && (u.classList.remove("active"), u.setAttribute("aria-selected", "false"));
    }), [c, d].forEach((u) => {
      u && (u.classList.remove("active"), u.style.display = "none");
    }), n && (n.classList.add("active"), n.setAttribute("aria-selected", "true"), n === a && c && (c.classList.add("active"), c.style.display = "block"), n === o && d && (d.classList.add("active"), d.style.display = "block"));
  }, M = () => {
    const { field: n, popup: a } = C();
    !n || !a || (typeof e.closeAllPopups == "function" && e.closeAllPopups(e.popupId), t.tempCheckIn = t.checkIn, t.tempCheckOut = t.checkOut, i = null, a.classList.add("active"), e.toggleFieldActiveClass && n.classList.add("active"), e.openingClass && (a.classList.add(e.openingClass), L && window.clearTimeout(L), e.openingClassDurationMs > 0 && (L = window.setTimeout(() => {
      a.classList.remove(e.openingClass);
    }, e.openingClassDurationMs))), k(e.onTempChange ?? null), I(), k(e.onOpen ?? null));
  }, O = (n) => {
    const { field: a, popup: o } = C();
    o && (o.classList.remove("active"), e.openingClass && o.classList.remove(e.openingClass), e.toggleFieldActiveClass && a && a.classList.remove("active"), k(e.onClose ?? null, n));
  }, A = (n) => {
    t.tempCheckIn = null, t.tempCheckOut = null, i = null, k(e.onTempChange ?? null), k(e.onCancel ?? null, n);
  }, z = (n) => {
    if (f(n), !(typeof e.onBeforeConfirm == "function" && e.onBeforeConfirm(t, v) === !1)) {
      if (t.checkIn = t.tempCheckIn, t.checkOut = t.tempCheckOut, k(e.onConfirm ?? null), typeof e.closeAllPopups == "function") {
        e.closeAllPopups();
        const { field: a } = C();
        e.toggleFieldActiveClass && a && a.classList.remove("active");
        return;
      }
      O({ reason: "confirm" });
    }
  }, I = () => {
    const { monthsContainer: n } = C();
    if (!n)
      return;
    n.innerHTML = "";
    const a = T();
    for (let o = 0; o < e.monthsToRender; o += 1) {
      const c = new Date(r.getFullYear(), r.getMonth() + o, 1), d = document.createElement("div");
      d.className = "DayPicker-Month";
      const u = document.createElement("div");
      u.className = "DayPicker-Caption", u.textContent = _(c), d.appendChild(u);
      const h = document.createElement("div");
      h.className = "DayPicker-Weekdays", a.forEach((l) => {
        const y = document.createElement("div");
        y.className = "DayPicker-Weekday", y.textContent = l, h.appendChild(y);
      }), d.appendChild(h);
      const m = document.createElement("div");
      m.className = "DayPicker-Body", m.innerHTML = U(c), d.appendChild(m), n.appendChild(d);
    }
    J();
  }, v = {
    init: () => {
      if (E)
        return v;
      const { field: n, popup: a, prevButton: o, nextButton: c, clearButton: d, confirmButton: u, tabCalendar: h, tabFlexible: m } = C();
      return !n || !a || (n.addEventListener("click", (l) => {
        if (f(l), !a.classList.contains("active")) {
          M();
          return;
        }
        e.toggleMode === "toggle" && (e.cancelOnToggleClose && A({ reason: "toggle" }), O({ reason: "toggle" }));
      }), a.addEventListener("click", f), o == null || o.addEventListener("click", (l) => {
        f(l), r.setMonth(r.getMonth() - 1), I();
      }), c == null || c.addEventListener("click", (l) => {
        f(l), r.setMonth(r.getMonth() + 1), I();
      }), d == null || d.addEventListener("click", (l) => {
        f(l), t.checkIn = null, t.checkOut = null, t.tempCheckIn = null, t.tempCheckOut = null, i = null, k(e.onTempChange ?? null), I(), k(e.onClear ?? null);
      }), u == null || u.addEventListener("click", z), e.enableTabs && (h == null || h.addEventListener("click", (l) => {
        f(l), B(h);
      }), m == null || m.addEventListener("click", (l) => {
        f(l), B(m);
      })), e.enableFlexibleOptions && a.querySelectorAll(e.flexibleOptionSelector).forEach((l) => {
        l.addEventListener("click", (y) => {
          f(y), a.querySelectorAll(e.flexibleOptionSelector).forEach((g) => {
            g.classList.remove("active");
          }), l.classList.add("active");
        });
      }), E = !0), v;
    },
    renderCalendar: I,
    openCalendar: M,
    closeCalendar: O,
    cancelSelection: A,
    getState: () => t,
    getMonth: () => new Date(r),
    setMonth: (n) => {
      r = new Date(n), I();
    }
  };
  return v;
}, ye = () => {
  window.JJRangeCalendar = {
    createRangeCalendar: (s) => ne(s)
  };
};
let P = null;
const ae = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", se = () => localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko", ie = () => {
  try {
    const s = localStorage.getItem("jeju_wishlist") ?? "[]", e = JSON.parse(s);
    return Array.isArray(e) ? e : [];
  } catch {
    return [];
  }
}, S = (s, e, t) => {
  document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: s })), document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: e })), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: t }));
}, oe = () => {
  if (window.FABState)
    return;
  const s = {
    currency: ae(),
    language: se(),
    wishlist: ie(),
    setCurrencyAndLang: (e, t) => {
      s.currency = e, s.language = t, localStorage.setItem("jeju_fab_currency", e), localStorage.setItem("jeju_fab_lang", t), S(e, t, s.wishlist);
    },
    addToWishlist: (e) => {
      const t = [...s.wishlist], r = Number(e.id), i = t.findIndex((E) => Number(E.id) === r);
      i === -1 ? t.push(e) : t.splice(i, 1), s.wishlist = t, localStorage.setItem("jeju_wishlist", JSON.stringify(t)), S(s.currency, s.language, t);
    },
    removeFromWishlist: (e) => {
      const t = s.wishlist.filter((r) => Number(r.id) !== e);
      s.wishlist = t, localStorage.setItem("jeju_wishlist", JSON.stringify(t)), S(s.currency, s.language, t);
    },
    isInWishlist: (e) => s.wishlist.some((t) => Number(t.id) === e)
  };
  window.FABState = s, document.addEventListener("fabCurrencyChanged", (e) => {
    const t = e;
    s.currency = t.detail === "USD" ? "USD" : "KRW";
  }), document.addEventListener("fabLanguageChanged", (e) => {
    const t = e;
    s.language = t.detail === "en" ? "en" : "ko";
  }), document.addEventListener("fabWishlistUpdated", (e) => {
    const t = e;
    s.wishlist = Array.isArray(t.detail) ? [...t.detail] : [];
  });
}, ge = () => {
  const s = "jeju-fab-root";
  let e = document.getElementById(s);
  e || (e = document.createElement("div"), e.id = s, document.body.appendChild(e)), P || (P = R(e)), P.render(
    /* @__PURE__ */ x.jsx(Z, { children: /* @__PURE__ */ x.jsx(V, {}) })
  ), oe();
};
export {
  ne as c,
  ye as i,
  fe as r,
  ge as s
};
