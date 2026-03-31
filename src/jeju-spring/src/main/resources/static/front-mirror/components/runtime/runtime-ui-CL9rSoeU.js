var V = Object.defineProperty;
var Q = (n, e, t) => e in n ? V(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var g = (n, e, t) => Q(n, typeof e != "symbol" ? e + "" : e, t);
import { a as X, c as W, j } from "./react-vendor-BoSfm_Te.js";
import { R as Z, F as ee } from "./feature-ui-VuIONmRp.js";
import { r as te } from "./runtime-layout-DSqPGP9h.js";
import { S as ne } from "./runtime-components-DdAclnfo.js";
class ae {
  constructor() {
    g(this, "isInitialized", !1);
    g(this, "isOpen", !1);
    g(this, "root", null);
    g(this, "cssReady", null);
    g(this, "lookupStatus", "idle");
    g(this, "lookupMessage", "예약 번호와 이메일을 입력하면 예약 정보를 확인할 수 있습니다.");
    g(this, "lookupResult", null);
    g(this, "submittedEmail", "");
    g(this, "requestSerial", 0);
    g(this, "activeRequestSerial", 0);
    g(this, "handleKeyDown", (e) => {
      e.key === "Escape" && this.isOpen && this.close();
    });
    g(this, "handlePopState", (e) => {
      const t = e.state;
      this.isOpen && (t == null ? void 0 : t.modal) !== "reservation" && this.close(!0);
    });
  }
  waitForNextFrame() {
    return new Promise((e) => {
      requestAnimationFrame(() => e());
    });
  }
  ensureCss(e) {
    return this.cssReady ? this.cssReady : (this.cssReady = new Promise((t) => {
      const a = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find(
        (i) => i.href === e
      );
      if (a) {
        if (a.sheet) {
          t();
          return;
        }
        a.addEventListener("load", () => t(), { once: !0 }), a.addEventListener("error", () => t(), { once: !0 });
        return;
      }
      const r = document.createElement("link");
      r.rel = "stylesheet", r.href = e, r.addEventListener("load", () => t(), { once: !0 }), r.addEventListener("error", () => t(), { once: !0 }), document.head.appendChild(r);
    }), this.cssReady);
  }
  render() {
    this.root && this.root.render(
      X.createElement(Z, {
        isOpen: this.isOpen,
        status: this.lookupStatus,
        message: this.lookupMessage,
        result: this.lookupResult,
        submittedEmail: this.submittedEmail,
        onSubmit: (e) => {
          this.submitLookup(e);
        },
        onClose: () => this.close(),
        onReset: () => this.resetLookupState()
      })
    );
  }
  resetLookupState() {
    this.lookupStatus = "idle", this.lookupMessage = "예약 번호와 이메일을 입력하면 예약 정보를 확인할 수 있습니다.", this.lookupResult = null, this.render();
  }
  setError(e) {
    this.lookupStatus = "error", this.lookupMessage = e, this.lookupResult = null, this.render();
  }
  setLoading() {
    this.lookupStatus = "loading", this.lookupMessage = "예약 정보를 확인하고 있습니다. 잠시만 기다려 주세요.", this.lookupResult = null, this.render();
  }
  setSuccess(e) {
    this.lookupStatus = "success", this.lookupMessage = "예약 정보를 확인했습니다.", this.lookupResult = e, this.render();
  }
  async submitLookup(e) {
    const t = e.reservationNo.trim(), a = e.email.trim();
    if (!t || !a) {
      this.setError("예약 번호와 이메일을 모두 입력해 주세요.");
      return;
    }
    const r = ++this.requestSerial;
    this.activeRequestSerial = r, this.submittedEmail = a, this.setLoading();
    try {
      const i = await fetch("/api/booking/guest-lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          reservationNo: t,
          email: a
        })
      }), u = await this.readJson(i);
      if (r !== this.activeRequestSerial)
        return;
      if (!i.ok || (u == null ? void 0 : u.success) === !1)
        throw new Error(this.extractErrorMessage(u) || "예약 정보를 찾지 못했습니다.");
      this.setSuccess(this.normalizeLookupResult(this.asRecord((u == null ? void 0 : u.data) ?? u), t, a));
    } catch (i) {
      if (r !== this.activeRequestSerial)
        return;
      const u = i instanceof Error && i.message ? i.message : "예약 정보를 확인하지 못했습니다. 입력값을 다시 확인해 주세요.";
      this.setError(u);
    }
  }
  async readJson(e) {
    const t = await e.text();
    if (!t.trim())
      return null;
    try {
      return JSON.parse(t);
    } catch {
      return null;
    }
  }
  extractErrorMessage(e) {
    if (!e)
      return "";
    const t = e.message;
    return typeof t == "string" && t.trim() ? t.trim() : "";
  }
  asRecord(e) {
    return e && typeof e == "object" && !Array.isArray(e) ? e : {};
  }
  normalizeLookupResult(e, t, a) {
    const r = this.firstText(e, [
      "bookingNo",
      "reservationNo",
      "booking_no",
      "reservation_no",
      "id"
    ]), i = this.firstText(e, ["destination", "destinationName", "travelDestination", "area"]), u = this.firstDateText(e, ["travelDate", "travel_date", "serviceStartDate", "service_start_date"]), I = this.formatAmount(this.firstValue(e, ["amount", "totalAmount", "total_amount", "paidAmount", "paid_amount"])), C = this.firstBoolean(e, ["memberBooking", "member_booking", "isMember", "is_member"]), p = this.firstText(e, ["lastName", "last_name", "passengerLastName", "passenger_last_name", "bookerLastName", "booker_last_name"]), y = this.firstText(e, ["firstName", "first_name", "passengerFirstName", "passenger_first_name", "bookerFirstName", "booker_first_name"]), O = this.firstText(e, ["reservationNo", "reservation_no", "bookingNo", "booking_no"]) || t, x = this.firstText(e, ["email", "reservationEmail", "reservation_email"]) || a;
    return {
      bookingNo: r,
      reservationNo: O,
      destination: i,
      travelDate: u,
      amount: I,
      memberBooking: C,
      lastName: p,
      firstName: y,
      email: x
    };
  }
  firstText(e, t) {
    for (const a of t) {
      const r = e[a];
      if (typeof r == "string" && r.trim())
        return r.trim();
      if (typeof r == "number" && Number.isFinite(r))
        return String(r);
    }
    return "";
  }
  firstValue(e, t) {
    for (const a of t) {
      const r = e[a];
      if (r != null)
        return r;
    }
    return null;
  }
  firstBoolean(e, t) {
    for (const a of t) {
      const r = e[a];
      if (typeof r == "boolean")
        return r;
      if (typeof r == "string") {
        const i = r.trim().toLowerCase();
        if (i === "true")
          return !0;
        if (i === "false")
          return !1;
        if (i === "1" || i === "y" || i === "yes" || i === "member")
          return !0;
        if (i === "0" || i === "n" || i === "no" || i === "guest")
          return !1;
      }
    }
  }
  firstDateText(e, t) {
    const a = this.firstText(e, t);
    if (!a)
      return "";
    const r = a.replace(/\//g, "-").trim();
    return r.length >= 8 ? r : a;
  }
  formatAmount(e) {
    if (typeof e == "number" && Number.isFinite(e))
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0
      }).format(e);
    if (typeof e == "string" && e.trim()) {
      const t = e.trim();
      if (/^\d+(\.\d+)?$/.test(t)) {
        const a = Number(t);
        if (Number.isFinite(a))
          return new Intl.NumberFormat("ko-KR", {
            style: "currency",
            currency: "KRW",
            maximumFractionDigits: 0
          }).format(a);
      }
      return t;
    }
    return "";
  }
  attachGlobalListeners() {
    window.addEventListener("popstate", this.handlePopState), document.addEventListener("keydown", this.handleKeyDown);
  }
  async ensureMarkup() {
    if (this.isInitialized)
      return;
    const e = new URL("components/react/ui/reservationDrawer/drawer.css", te("./")).href;
    await this.ensureCss(e);
    let t = document.getElementById("reservation-drawer-container");
    t || (t = document.createElement("div"), t.id = "reservation-drawer-container", document.body.appendChild(t)), this.root || (this.root = W(t)), this.attachGlobalListeners(), this.render(), await this.waitForNextFrame(), this.isInitialized = !0;
  }
  async open() {
    await this.ensureMarkup(), !this.isOpen && (this.isOpen = !0, history.pushState({ modal: "reservation" }, "", "#reservation"), document.body.style.overflow = "hidden", this.render());
  }
  close(e = !1) {
    var t;
    this.isOpen && (this.isOpen = !1, this.activeRequestSerial = 0, document.body.style.overflow = "", this.resetLookupState(), !e && ((t = history.state) == null ? void 0 : t.modal) === "reservation" && history.back(), this.render());
  }
}
const we = new ae(), se = (n) => {
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
  let a = e.initialMonth ? new Date(e.initialMonth) : /* @__PURE__ */ new Date(), r = null, i = !1, u = null, I = null;
  const C = () => I || (I = {
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
  }, I), p = (s) => {
    s == null || s.stopPropagation();
  }, y = (s, o) => {
    typeof s == "function" && s(t, E, o);
  }, O = () => Array.isArray(e.weekdayLabels) && e.weekdayLabels.length === 7 ? e.weekdayLabels : e.weekStartsOn === "sunday" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], x = (s) => {
    const o = new Date(s);
    return o.setHours(0, 0, 0, 0), o.getTime();
  }, z = (s) => e.weekStartsOn === "monday" ? s === 0 ? 6 : s - 1 : s, q = () => t.tempCheckIn || t.checkIn, H = () => t.tempCheckOut || t.checkOut, J = (s) => typeof e.monthLabelFormatter == "function" ? e.monthLabelFormatter(s, t, E) : `${s.getFullYear()}-${String(s.getMonth() + 1).padStart(2, "0")}`, K = (s, o) => typeof e.dayLabelFormatter == "function" ? e.dayLabelFormatter(s, o, t, E) : String(s), U = (s) => {
    const o = s.getFullYear(), l = s.getMonth(), d = new Date(o, l, 1).getDay(), m = z(d), h = new Date(o, l + 1, 0).getDate(), k = x(/* @__PURE__ */ new Date()), f = q(), c = H();
    let b = "";
    for (let L = 0; L < m; L += 1)
      b += '<div class="DayPicker-Day DayPicker-Day--outside"></div>';
    for (let L = 1; L <= h; L += 1) {
      const v = new Date(o, l, L).getTime(), w = ["DayPicker-Day"];
      v < k && w.push("DayPicker-Day--disabled"), v === k && w.push("DayPicker-Day--today"), f && v === f && w.push("DayPicker-Day--selected", "DayPicker-Day--checkIn", "DayPicker-Day--hasRange"), c && v === c && w.push("DayPicker-Day--selected", "DayPicker-Day--checkOut", "DayPicker-Day--hasRange"), f && c && v > f && v < c && w.push("DayPicker-Day--inRange"), e.showHoverRange && f && !c && r && v > f && v <= r && (w.push("DayPicker-Day--hoverRange"), v === r && w.push("DayPicker-Day--hoverEnd")), b += `<div class="${w.join(" ")}" data-timestamp="${v}" data-day="${L}">${K(L, v)}</div>`;
    }
    return b;
  }, A = () => {
    const { popup: s } = C();
    s && s.querySelectorAll(".DayPicker-Day").forEach((o) => {
      if (o.classList.remove("DayPicker-Day--hoverRange"), o.classList.remove("DayPicker-Day--hoverEnd"), !e.showHoverRange)
        return;
      const l = Number.parseInt(o.dataset.timestamp ?? "", 10);
      Number.isFinite(l) && t.tempCheckIn && !t.tempCheckOut && r && l > t.tempCheckIn && l <= r && (o.classList.add("DayPicker-Day--hoverRange"), l === r && o.classList.add("DayPicker-Day--hoverEnd"));
    });
  }, $ = (s) => {
    !t.tempCheckIn || t.tempCheckIn && t.tempCheckOut ? (t.tempCheckIn = s, t.tempCheckOut = null, r = null) : s < t.tempCheckIn ? (t.tempCheckIn = s, r = null) : s > t.tempCheckIn && (t.tempCheckOut = s, r = null), y(e.onTempChange ?? null), D();
  }, G = () => {
    const { popup: s, dayPickerContainer: o } = C();
    s && (s.querySelectorAll(".DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside)").forEach((l) => {
      l.addEventListener("click", (d) => {
        p(d);
        const m = Number.parseInt(l.dataset.timestamp ?? "", 10);
        Number.isFinite(m) && $(m);
      }), e.showHoverRange && l.addEventListener("mouseenter", () => {
        const d = Number.parseInt(l.dataset.timestamp ?? "", 10);
        Number.isFinite(d) && t.tempCheckIn && !t.tempCheckOut && d > t.tempCheckIn && (r = d, A());
      });
    }), o && e.showHoverRange && (o.onmouseleave = () => {
      r && (r = null, A());
    }));
  }, _ = (s) => {
    const { tabCalendar: o, tabFlexible: l, panelCalendar: d, panelFlexible: m } = C();
    [o, l].forEach((h) => {
      h && (h.classList.remove("active"), h.setAttribute("aria-selected", "false"));
    }), [d, m].forEach((h) => {
      h && (h.classList.remove("active"), h.style.display = "none");
    }), s && (s.classList.add("active"), s.setAttribute("aria-selected", "true"), s === o && d && (d.classList.add("active"), d.style.display = "block"), s === l && m && (m.classList.add("active"), m.style.display = "block"));
  }, B = () => {
    const { field: s, popup: o } = C();
    !s || !o || (typeof e.closeAllPopups == "function" && e.closeAllPopups(e.popupId), t.tempCheckIn = t.checkIn, t.tempCheckOut = t.checkOut, r = null, o.classList.add("active"), e.toggleFieldActiveClass && s.classList.add("active"), e.openingClass && (o.classList.add(e.openingClass), u && window.clearTimeout(u), e.openingClassDurationMs > 0 && (u = window.setTimeout(() => {
      o.classList.remove(e.openingClass);
    }, e.openingClassDurationMs))), y(e.onTempChange ?? null), D(), y(e.onOpen ?? null));
  }, P = (s) => {
    const { field: o, popup: l } = C();
    l && (l.classList.remove("active"), e.openingClass && l.classList.remove(e.openingClass), e.toggleFieldActiveClass && o && o.classList.remove("active"), y(e.onClose ?? null, s));
  }, T = (s) => {
    t.tempCheckIn = null, t.tempCheckOut = null, r = null, y(e.onTempChange ?? null), y(e.onCancel ?? null, s);
  }, Y = (s) => {
    if (p(s), !(typeof e.onBeforeConfirm == "function" && e.onBeforeConfirm(t, E) === !1)) {
      if (t.checkIn = t.tempCheckIn, t.checkOut = t.tempCheckOut, y(e.onConfirm ?? null), typeof e.closeAllPopups == "function") {
        e.closeAllPopups();
        const { field: o } = C();
        e.toggleFieldActiveClass && o && o.classList.remove("active");
        return;
      }
      P({ reason: "confirm" });
    }
  }, D = () => {
    const { monthsContainer: s } = C();
    if (!s)
      return;
    s.innerHTML = "";
    const o = O();
    for (let l = 0; l < e.monthsToRender; l += 1) {
      const d = new Date(a.getFullYear(), a.getMonth() + l, 1), m = document.createElement("div");
      m.className = "DayPicker-Month";
      const h = document.createElement("div");
      h.className = "DayPicker-Caption", h.textContent = J(d), m.appendChild(h);
      const k = document.createElement("div");
      k.className = "DayPicker-Weekdays", o.forEach((c) => {
        const b = document.createElement("div");
        b.className = "DayPicker-Weekday", b.textContent = c, k.appendChild(b);
      }), m.appendChild(k);
      const f = document.createElement("div");
      f.className = "DayPicker-Body", f.innerHTML = U(d), m.appendChild(f), s.appendChild(m);
    }
    G();
  }, E = {
    init: () => {
      if (i)
        return E;
      const { field: s, popup: o, prevButton: l, nextButton: d, clearButton: m, confirmButton: h, tabCalendar: k, tabFlexible: f } = C();
      return !s || !o || (s.addEventListener("click", (c) => {
        if (p(c), !o.classList.contains("active")) {
          B();
          return;
        }
        e.toggleMode === "toggle" && (e.cancelOnToggleClose && T({ reason: "toggle" }), P({ reason: "toggle" }));
      }), o.addEventListener("click", p), l == null || l.addEventListener("click", (c) => {
        p(c), a.setMonth(a.getMonth() - 1), D();
      }), d == null || d.addEventListener("click", (c) => {
        p(c), a.setMonth(a.getMonth() + 1), D();
      }), m == null || m.addEventListener("click", (c) => {
        p(c), t.checkIn = null, t.checkOut = null, t.tempCheckIn = null, t.tempCheckOut = null, r = null, y(e.onTempChange ?? null), D(), y(e.onClear ?? null);
      }), h == null || h.addEventListener("click", Y), e.enableTabs && (k == null || k.addEventListener("click", (c) => {
        p(c), _(k);
      }), f == null || f.addEventListener("click", (c) => {
        p(c), _(f);
      })), e.enableFlexibleOptions && o.querySelectorAll(e.flexibleOptionSelector).forEach((c) => {
        c.addEventListener("click", (b) => {
          p(b), o.querySelectorAll(e.flexibleOptionSelector).forEach((L) => {
            L.classList.remove("active");
          }), c.classList.add("active");
        });
      }), i = !0), E;
    },
    renderCalendar: D,
    openCalendar: B,
    closeCalendar: P,
    cancelSelection: T,
    getState: () => t,
    getMonth: () => new Date(a),
    setMonth: (s) => {
      a = new Date(s), D();
    }
  };
  return E;
}, De = () => {
  window.JJRangeCalendar = {
    createRangeCalendar: (n) => re(n)
  };
};
let M = null;
const S = (n) => String(n ?? "").trim(), N = () => typeof window > "u" ? null : window.frontI18n ?? null, R = (n) => n === "en" || n === "ko" ? n : null, oe = () => {
  try {
    return localStorage.getItem("jeju_fab_lang") === "en" ? "en" : "ko";
  } catch {
    return "ko";
  }
}, ie = () => {
  var t, a;
  const n = N();
  return R(((t = n == null ? void 0 : n.getCurrentLang) == null ? void 0 : t.call(n)) ?? ((a = n == null ? void 0 : n.resolveCurrentLang) == null ? void 0 : a.call(n))) ?? oe();
}, le = (n) => {
  try {
    localStorage.setItem("jeju_lang", n), localStorage.setItem("front.lang", n), localStorage.setItem("jeju_fab_lang", n);
  } catch {
  }
}, ce = (n) => {
  typeof document > "u" || (document.dispatchEvent(new CustomEvent("languageChanged", { detail: n })), document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: n })), document.dispatchEvent(new CustomEvent("front:i18n-change", { detail: { lang: n, source: "fab:fallback" } })));
}, ue = (n) => {
  const e = N();
  if (e != null && e.subscribeLanguageChange)
    return e.subscribeLanguageChange((a) => {
      const r = R(a.lang);
      r && n(r);
    });
  if (typeof document > "u")
    return () => {
    };
  const t = (a) => {
    const i = a.detail, u = R(
      typeof i == "string" ? i : typeof i == "object" && i ? i.lang ?? i.currentLang ?? i.value : null
    );
    u && n(u);
  };
  return document.addEventListener("languageChanged", t), document.addEventListener("fabLanguageChanged", t), document.addEventListener("front:i18n-change", t), () => {
    document.removeEventListener("languageChanged", t), document.removeEventListener("fabLanguageChanged", t), document.removeEventListener("front:i18n-change", t);
  };
}, de = (n, e) => {
  const t = R(n) ?? "ko", a = N();
  return a != null && a.setCurrentLang ? a.setCurrentLang(t, { source: e }) ?? t : (le(t), ce(t), t);
}, me = () => localStorage.getItem("jeju_fab_currency") === "USD" ? "USD" : "KRW", he = () => ie(), fe = () => {
  try {
    const n = localStorage.getItem("jeju_wishlist") ?? "[]", e = JSON.parse(n);
    return Array.isArray(e) ? e : [];
  } catch {
    return [];
  }
}, F = (n, e, t, a) => {
  document.dispatchEvent(new CustomEvent("fabCurrencyChanged", { detail: n })), (a == null ? void 0 : a.includeLanguage) !== !1 && document.dispatchEvent(new CustomEvent("fabLanguageChanged", { detail: e })), document.dispatchEvent(new CustomEvent("fabWishlistUpdated", { detail: t }));
}, ge = () => {
  if (window.FABState)
    return;
  const n = {
    currency: me(),
    language: he(),
    wishlist: fe(),
    setCurrencyAndLang: (e, t) => {
      n.currency = e, n.language = de(t, "fab:setCurrencyAndLang"), localStorage.setItem("jeju_fab_currency", e), F(e, n.language, n.wishlist, { includeLanguage: !1 });
    },
    addToWishlist: (e) => {
      const t = [...n.wishlist], a = S(e.id);
      if (!a)
        return;
      const r = t.findIndex((i) => S(i.id) === a);
      r === -1 ? t.push(e) : t.splice(r, 1), n.wishlist = t, localStorage.setItem("jeju_wishlist", JSON.stringify(t)), F(n.currency, n.language, t);
    },
    removeFromWishlist: (e) => {
      const t = S(e), a = n.wishlist.filter((r) => S(r.id) !== t);
      n.wishlist = a, localStorage.setItem("jeju_wishlist", JSON.stringify(a)), F(n.currency, n.language, a);
    },
    isInWishlist: (e) => {
      const t = S(e);
      return n.wishlist.some((a) => S(a.id) === t);
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
  }), ue((e) => {
    n.language = e;
  }), F(n.currency, n.language, n.wishlist);
}, Ie = () => {
  const n = "jeju-fab-root";
  let e = document.getElementById(n);
  e || (e = document.createElement("div"), e.id = n, document.body.appendChild(e)), M || (M = W(e)), M.render(
    /* @__PURE__ */ j.jsx(ne, { children: /* @__PURE__ */ j.jsx(ee, {}) })
  ), ge();
};
export {
  re as c,
  De as i,
  we as r,
  Ie as s
};
