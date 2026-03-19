import { a as r, j as a } from "./react-vendor-BoSfm_Te.js";
import { b as x } from "./feature-layout-Czr3ndvg.js";
import { a as re } from "./legacy-core-0fkWHL1L.js";
const oe = {
  monday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  sunday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
}, G = (e) => {
  const t = new Date(e);
  return t.setHours(0, 0, 0, 0), t.getTime();
}, H = (e) => {
  const t = new Date(e);
  return t.setDate(1), t.setHours(0, 0, 0, 0), t.getTime();
}, de = (e, t) => {
  const n = new Date(e);
  return n.setMonth(n.getMonth() + t, 1), H(n);
}, ue = (e = {}) => {
  const t = e.checkIn ?? e.tempCheckIn ?? e.visibleMonth ?? Date.now(), n = H(e.visibleMonth ?? t);
  return {
    ...{
      isOpen: !1,
      activeTab: "calendar",
      visibleMonth: n,
      hoverDate: null,
      checkIn: null,
      checkOut: null,
      tempCheckIn: null,
      tempCheckOut: null,
      flexibleValue: null
    },
    ...e,
    visibleMonth: n
  };
}, he = (e = "sunday") => oe[e], me = ({ tempCheckIn: e, tempCheckOut: t }, n) => {
  const s = G(n);
  return !e || t ? {
    tempCheckIn: s,
    tempCheckOut: null,
    hoverDate: null
  } : s < e ? {
    tempCheckIn: s,
    tempCheckOut: null,
    hoverDate: null
  } : s > e ? {
    tempCheckIn: e,
    tempCheckOut: s,
    hoverDate: null
  } : {
    tempCheckIn: e,
    tempCheckOut: t,
    hoverDate: null
  };
}, pe = (e, t) => t === "monday" ? e === 0 ? 6 : e - 1 : e, ge = (e, t) => typeof t == "function" ? t(e) : `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}`, be = (e) => `${e.getFullYear()}년 ${e.getMonth() + 1}월 ${e.getDate()}일`, fe = ({
  visibleMonth: e,
  checkIn: t,
  checkOut: n,
  hoverDate: s,
  monthsToRender: l = 2,
  weekStartsOn: c = "sunday",
  weekdayLabels: i = null,
  monthLabelFormatter: h = null,
  today: p = G(Date.now())
}) => {
  const g = G(p), o = t && !n && s && s > t ? s : null, m = Array.isArray(i) && i.length === 7 ? i : he(c);
  return Array.from({ length: l }, (k, v) => {
    const y = new Date(e);
    y.setMonth(y.getMonth() + v, 1);
    const f = y.getFullYear(), u = y.getMonth(), L = new Date(f, u, 1).getDay(), C = pe(L, c), D = new Date(f, u + 1, 0).getDate(), E = [];
    for (let j = 0; j < C; j += 1)
      E.push({
        key: `${f}-${u + 1}-outside-${j}`,
        label: "",
        ariaLabel: "",
        timestamp: null,
        day: null,
        isOutside: !0,
        isDisabled: !0,
        isToday: !1,
        isSelected: !1,
        isCheckIn: !1,
        isCheckOut: !1,
        isInRange: !1,
        isHoverRange: !1,
        isHoverEnd: !1,
        hasRange: !1
      });
    for (let j = 1; j <= D; j += 1) {
      const P = new Date(f, u, j), N = G(P), T = t === N, S = n === N, A = o === N, _ = T && !!(n || o) || S && !!t;
      E.push({
        key: `${f}-${u + 1}-${j}`,
        label: String(j),
        ariaLabel: be(P),
        timestamp: N,
        day: j,
        isOutside: !1,
        isDisabled: N < g,
        isToday: N === g,
        isSelected: T || S,
        isCheckIn: T,
        isCheckOut: S,
        isInRange: !!(t && n && N > t && N < n),
        isHoverRange: !!(o && t && N > t && N < o),
        isHoverEnd: A,
        hasRange: _
      });
    }
    return {
      key: `${f}-${u + 1}`,
      label: ge(y, h),
      weekdays: m,
      days: E
    };
  });
}, ee = [
  { region: "hiroshima", label: "히로시마", aliases: ["히로시마", "hiroshima"] },
  { region: "jeju", label: "제주", aliases: ["제주", "제주도", "jeju"] },
  { region: "seoul", label: "서울", aliases: ["서울", "seoul"] },
  { region: "incheon", label: "인천", aliases: ["인천", "incheon"] },
  { region: "busan", label: "부산", aliases: ["부산", "busan"] },
  { region: "sokcho", label: "속초", aliases: ["속초", "sokcho"] },
  { region: "osaka", label: "오사카", aliases: ["오사카", "osaka"] },
  { region: "tokyo", label: "도쿄", aliases: ["도쿄", "동경", "tokyo"] },
  { region: "fukuoka", label: "후쿠오카", aliases: ["후쿠오카", "fukuoka"] },
  { region: "bangkok", label: "방콕", aliases: ["방콕", "bangkok"] },
  { region: "danang", label: "다낭", aliases: ["다낭", "danang", "da nang"] },
  { region: "singapore", label: "싱가포르", aliases: ["싱가포르", "싱가폴", "singapore"] }
], W = (e) => e.trim().toLowerCase().replace(/\s+/g, ""), ve = (e) => {
  const t = W(e);
  return t ? ee.find(
    (n) => n.aliases.some((s) => W(s) === t)
  ) ?? null : null;
}, ye = (e) => {
  if (!e)
    return null;
  const t = W(e);
  return ee.find((n) => n.region === t) ?? null;
}, q = (e) => {
  if (!e)
    return null;
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());
  if (!t)
    return null;
  const n = Number(t[1]), s = Number(t[2]) - 1, l = Number(t[3]), c = new Date(n, s, l).getTime();
  return Number.isNaN(c) ? null : c;
}, z = (e) => {
  if (!e)
    return null;
  const t = new Date(e), n = t.getFullYear(), s = String(t.getMonth() + 1).padStart(2, "0"), l = String(t.getDate()).padStart(2, "0");
  return `${n}-${s}-${l}`;
}, V = (e, t, n) => {
  if (!e)
    return t;
  const s = Number.parseInt(e, 10);
  return Number.isNaN(s) ? t : Math.max(n, s);
}, ke = (e) => {
  const t = new URLSearchParams(e).get("shell");
  return t === "main" || t === "stay" || t === "air" ? t : null;
}, ae = (e) => {
  const t = new URLSearchParams(e), n = t.get("keyword"), s = t.get("region"), l = ye(s);
  return {
    destinationValue: (n == null ? void 0 : n.trim()) || (l == null ? void 0 : l.label) || "",
    guest: {
      adults: V(t.get("adults"), 1, 1),
      children: V(t.get("children"), 0, 0),
      rooms: V(t.get("rooms"), 1, 1)
    },
    calendar: {
      checkIn: q(t.get("checkIn")),
      checkOut: q(t.get("checkOut"))
    }
  };
}, xe = (e, t = "") => {
  const n = {}, s = new URLSearchParams(t), l = ke(t), c = e.destinationValue.trim(), i = c ? ve(c) : null, h = z(e.calendar.checkIn), p = z(e.calendar.checkOut);
  l && (n.shell = l), c && (n.keyword = c), i && (n.region = i.region), h && (n.checkIn = h), p && (n.checkOut = p), n.adults = Math.max(1, e.guest.adults), n.children = Math.max(0, e.guest.children), n.rooms = Math.max(1, e.guest.rooms);
  const g = s.getAll("filter").filter((o) => o.trim() !== "");
  return g.length > 0 && (n.filter = g), n;
}, te = r.createContext(null), Ne = (e) => {
  var l, c, i, h, p;
  const t = ue(), n = ((l = e == null ? void 0 : e.calendar) == null ? void 0 : l.checkIn) ?? null, s = ((c = e == null ? void 0 : e.calendar) == null ? void 0 : c.checkOut) ?? null;
  return {
    activeTab: "hotel",
    destinationValue: (e == null ? void 0 : e.destinationValue) ?? "",
    isDestinationOpen: !1,
    isGuestOpen: !1,
    guest: {
      rooms: Math.max(1, ((i = e == null ? void 0 : e.guest) == null ? void 0 : i.rooms) ?? 1),
      adults: Math.max(1, ((h = e == null ? void 0 : e.guest) == null ? void 0 : h.adults) ?? 1),
      children: Math.max(0, ((p = e == null ? void 0 : e.guest) == null ? void 0 : p.children) ?? 0)
    },
    calendar: {
      ...t,
      checkIn: n,
      checkOut: s,
      tempCheckIn: n,
      tempCheckOut: s,
      visibleMonth: n ? H(n) : t.visibleMonth
    }
  };
}, Y = (e, t) => {
  if (!e)
    return t;
  const n = new Date(e), s = n.getFullYear(), l = String(n.getMonth() + 1).padStart(2, "0"), c = String(n.getDate()).padStart(2, "0");
  return `${s}-${l}-${c}`;
}, je = (e, t) => {
  switch (t.type) {
    case "SET_ACTIVE_TAB":
      return {
        ...e,
        activeTab: t.tab,
        isDestinationOpen: !1,
        isGuestOpen: !1,
        calendar: {
          ...e.calendar,
          isOpen: !1,
          hoverDate: null,
          tempCheckIn: e.calendar.checkIn,
          tempCheckOut: e.calendar.checkOut
        }
      };
    case "SET_DESTINATION_VALUE":
      return {
        ...e,
        destinationValue: t.value
      };
    case "TOGGLE_DESTINATION":
      return {
        ...e,
        isDestinationOpen: !e.isDestinationOpen,
        isGuestOpen: !1
      };
    case "CLOSE_DESTINATION":
      return {
        ...e,
        isDestinationOpen: !1
      };
    case "TOGGLE_GUEST":
      return {
        ...e,
        isGuestOpen: !e.isGuestOpen,
        isDestinationOpen: !1
      };
    case "CLOSE_GUEST":
      return {
        ...e,
        isGuestOpen: !1
      };
    case "ADJUST_GUEST": {
      const n = e.guest[t.key] + t.delta;
      return n < {
        rooms: 1,
        adults: 1,
        children: 0
      }[t.key] ? e : {
        ...e,
        guest: {
          ...e.guest,
          [t.key]: n
        }
      };
    }
    case "OPEN_CALENDAR":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          isOpen: !0,
          tempCheckIn: e.calendar.checkIn,
          tempCheckOut: e.calendar.checkOut,
          hoverDate: null,
          visibleMonth: e.calendar.checkIn ? H(e.calendar.checkIn) : e.calendar.visibleMonth
        }
      };
    case "CLOSE_CALENDAR":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          isOpen: !1,
          hoverDate: null,
          tempCheckIn: e.calendar.checkIn,
          tempCheckOut: e.calendar.checkOut
        }
      };
    case "SHIFT_CALENDAR_MONTH":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          hoverDate: null,
          visibleMonth: de(e.calendar.visibleMonth, t.delta)
        }
      };
    case "SET_CALENDAR_TAB":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          activeTab: t.tab,
          hoverDate: null
        }
      };
    case "SET_FLEXIBLE_OPTION":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          activeTab: "flexible",
          flexibleValue: t.value
        }
      };
    case "SELECT_CALENDAR_DATE": {
      const n = me(
        {
          tempCheckIn: e.calendar.tempCheckIn,
          tempCheckOut: e.calendar.tempCheckOut
        },
        t.timestamp
      );
      return {
        ...e,
        calendar: {
          ...e.calendar,
          ...n,
          activeTab: "calendar"
        }
      };
    }
    case "SET_CALENDAR_HOVER_DATE": {
      const n = t.timestamp && e.calendar.tempCheckIn && !e.calendar.tempCheckOut && t.timestamp > e.calendar.tempCheckIn ? t.timestamp : null;
      return {
        ...e,
        calendar: {
          ...e.calendar,
          hoverDate: n
        }
      };
    }
    case "CONFIRM_CALENDAR": {
      const n = e.calendar.tempCheckIn, s = e.calendar.tempCheckOut;
      return {
        ...e,
        calendar: {
          ...e.calendar,
          isOpen: !1,
          hoverDate: null,
          checkIn: n,
          checkOut: s,
          tempCheckIn: n,
          tempCheckOut: s,
          visibleMonth: n ? H(n) : e.calendar.visibleMonth
        }
      };
    }
    case "CLEAR_CALENDAR":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          hoverDate: null,
          checkIn: null,
          checkOut: null,
          tempCheckIn: null,
          tempCheckOut: null,
          flexibleValue: null
        }
      };
    default:
      return e;
  }
}, $ = (e, t = null) => {
  t !== "destinationDropdown" && e({ type: "CLOSE_DESTINATION" }), t !== "guestPopupLarge" && e({ type: "CLOSE_GUEST" }), t !== "calendarPopup" && e({ type: "CLOSE_CALENDAR" });
}, ne = ({ children: e, initialState: t }) => {
  const [n, s] = r.useReducer(je, t, Ne);
  r.useEffect(() => {
    const d = () => {
      $(s);
    };
    return document.addEventListener("click", d), () => {
      document.removeEventListener("click", d);
    };
  }, []);
  const l = r.useCallback((d) => {
    d.stopPropagation();
  }, []), c = r.useCallback((d) => {
    $(s), s({ type: "SET_ACTIVE_TAB", tab: d });
  }, []), i = r.useCallback((d) => {
    s({ type: "SET_DESTINATION_VALUE", value: d });
  }, []), h = r.useCallback((d) => {
    d.stopPropagation(), $(s, "destinationDropdown"), s({ type: "TOGGLE_DESTINATION" });
  }, []), p = r.useCallback(
    (d) => {
      d.stopPropagation(), $(s, "destinationDropdown"), s({ type: "SET_DESTINATION_VALUE", value: d.currentTarget.value }), n.isDestinationOpen || s({ type: "TOGGLE_DESTINATION" });
    },
    [n.isDestinationOpen]
  ), g = r.useCallback((d) => {
    s({ type: "SET_DESTINATION_VALUE", value: d }), s({ type: "CLOSE_DESTINATION" });
  }, []), o = r.useCallback((d) => {
    d.stopPropagation(), $(s, "guestPopupLarge"), s({ type: "TOGGLE_GUEST" });
  }, []), m = r.useCallback((d, U, w) => {
    w.stopPropagation(), s({ type: "ADJUST_GUEST", key: d, delta: U });
  }, []), k = r.useCallback(
    (d) => {
      if (d.stopPropagation(), n.calendar.isOpen) {
        s({ type: "CONFIRM_CALENDAR" });
        return;
      }
      $(s, "calendarPopup"), s({ type: "OPEN_CALENDAR" });
    },
    [n.calendar.isOpen]
  ), v = r.useCallback(() => {
    s({ type: "SHIFT_CALENDAR_MONTH", delta: -1 });
  }, []), y = r.useCallback(() => {
    s({ type: "SHIFT_CALENDAR_MONTH", delta: 1 });
  }, []), f = r.useCallback((d) => {
    s({ type: "SET_CALENDAR_TAB", tab: d });
  }, []), u = r.useCallback((d) => {
    s({ type: "SET_FLEXIBLE_OPTION", value: d });
  }, []), L = r.useCallback((d) => {
    s({ type: "SELECT_CALENDAR_DATE", timestamp: d });
  }, []), C = r.useCallback((d) => {
    s({ type: "SET_CALENDAR_HOVER_DATE", timestamp: d });
  }, []), D = r.useCallback(() => {
    s({ type: "SET_CALENDAR_HOVER_DATE", timestamp: null });
  }, []), E = r.useCallback(() => {
    s({ type: "CLEAR_CALENDAR" });
  }, []), j = r.useCallback(() => {
    s({ type: "CONFIRM_CALENDAR" });
  }, []), P = r.useCallback(() => {
    $(s);
    const d = re(
      "SERVICES.STAY.HOTEL_LIST",
      xe(
        {
          destinationValue: n.destinationValue,
          guest: n.guest,
          calendar: {
            checkIn: n.calendar.checkIn,
            checkOut: n.calendar.checkOut
          }
        },
        window.location.search
      )
    );
    window.location.assign(d);
  }, [
    n.calendar.checkIn,
    n.calendar.checkOut,
    n.destinationValue,
    n.guest
  ]), N = n.activeTab !== "activity", T = r.useMemo(() => {
    const d = [`성인 ${n.guest.adults}명`, `객실 ${n.guest.rooms}개`];
    return n.guest.children > 0 && d.push(`아동 ${n.guest.children}명`), d.join(", ");
  }, [n.guest.adults, n.guest.children, n.guest.rooms]), S = r.useMemo(() => {
    const d = n.calendar.isOpen ? n.calendar.tempCheckIn ?? n.calendar.checkIn : n.calendar.checkIn;
    return Y(d, "체크인");
  }, [n.calendar.checkIn, n.calendar.isOpen, n.calendar.tempCheckIn]), A = r.useMemo(() => {
    const d = n.calendar.isOpen ? n.calendar.tempCheckOut ?? n.calendar.checkOut : n.calendar.checkOut;
    return Y(d, "체크아웃");
  }, [n.calendar.checkOut, n.calendar.isOpen, n.calendar.tempCheckOut]), _ = r.useMemo(() => ({
    state: n,
    isHotelMode: N,
    guestSummary: T,
    checkInLabel: S,
    checkOutLabel: A,
    setActiveTab: c,
    setDestinationValue: i,
    toggleDestination: h,
    openDestinationInput: p,
    selectDestination: g,
    toggleGuest: o,
    adjustGuest: m,
    toggleCalendar: k,
    showPreviousMonth: v,
    showNextMonth: y,
    setCalendarTab: f,
    selectFlexibleOption: u,
    selectCalendarDate: L,
    setCalendarHoverDate: C,
    clearCalendarHoverDate: D,
    clearCalendar: E,
    confirmCalendar: j,
    submitSearch: P,
    stopPropagation: l
  }), [
    n,
    N,
    T,
    S,
    A,
    c,
    i,
    h,
    p,
    g,
    o,
    m,
    k,
    v,
    y,
    f,
    u,
    L,
    C,
    D,
    E,
    j,
    P,
    l
  ]);
  return /* @__PURE__ */ a.jsx(te.Provider, { value: _, children: e });
}, R = () => {
  const e = r.useContext(te);
  if (!e)
    throw new Error("HotelSearchWidget context missing");
  return e;
}, we = () => {
  const { state: e } = R();
  return /* @__PURE__ */ a.jsx("div", { className: `search-form-new${e.activeTab === "activity" ? "" : " hidden"}`, id: "searchFormActivity", children: /* @__PURE__ */ a.jsx("div", { className: "global-search-container", children: /* @__PURE__ */ a.jsxs("div", { className: "global-search-bar", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "search-item destination-item-new", id: "destinationFieldActivity", children: [
      /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(x, { className: "search-field-icon", name: "search" }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ a.jsx("label", { className: "item-label", children: "떠나고 싶은 곳" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            autoComplete: "off",
            className: "item-input",
            id: "destinationInputActivity",
            placeholder: "액티비티, 체험 명 검색",
            type: "text"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "search-btn-wrapper", children: /* @__PURE__ */ a.jsxs("button", { className: "search-btn-pill", id: "searchBtnActivity", children: [
      /* @__PURE__ */ a.jsx(x, { className: "search-btn-icon", name: "search" }),
      /* @__PURE__ */ a.jsx("span", { className: "search-btn-text", children: "검색" })
    ] }) })
  ] }) }) });
}, Ie = ({
  popupId: e,
  monthsContainerId: t,
  panelCalendarId: n,
  panelFlexibleId: s,
  prevButtonId: l,
  nextButtonId: c,
  clearButtonId: i,
  confirmButtonId: h,
  tabCalendarId: p,
  tabFlexibleId: g,
  flexibleOptions: o,
  calendar: m,
  onInteract: k,
  onClear: v,
  onConfirm: y,
  onPreviousMonth: f,
  onNextMonth: u,
  onTabChange: L,
  onFlexibleOptionSelect: C,
  onDateSelect: D,
  onDateHover: E,
  onDateHoverLeave: j,
  dialogLabel: P = "체크인 날짜 선택 달력",
  weekStartsOn: N = "sunday",
  weekdayLabels: T = null,
  monthLabelFormatter: S = null,
  monthsToRender: A = 2,
  footerStartContent: _ = null
}) => {
  const d = m.activeTab === "calendar", U = r.useMemo(() => fe({
    visibleMonth: m.visibleMonth,
    checkIn: m.tempCheckIn,
    checkOut: m.tempCheckOut,
    hoverDate: m.hoverDate,
    monthsToRender: A,
    weekStartsOn: N,
    weekdayLabels: T,
    monthLabelFormatter: S
  }), [
    m.hoverDate,
    m.tempCheckIn,
    m.tempCheckOut,
    m.visibleMonth,
    S,
    A,
    N,
    T
  ]);
  return /* @__PURE__ */ a.jsx(
    "div",
    {
      "aria-label": P,
      "aria-modal": "true",
      className: `Popup RangePicker RangePicker--checkIn RangePicker--with-dayuse${m.isOpen ? " active" : ""}`,
      id: e,
      onClick: k,
      role: "dialog",
      children: /* @__PURE__ */ a.jsxs("div", { className: "Popup__content Popup__content_Occupancy", children: [
        /* @__PURE__ */ a.jsx("span", { className: "ScreenReaderOnly", children: "엔터 키를 눌러 캘린더를 여세요. 방향키를 사용해 체크인 및 체크아웃 날짜를 탐색할 수 있습니다." }),
        /* @__PURE__ */ a.jsxs("div", { className: "RangePicker-Header", children: [
          /* @__PURE__ */ a.jsx("div", { className: "RangePicker-NavPrev", children: /* @__PURE__ */ a.jsx(
            "button",
            {
              "aria-label": "이전 달",
              className: "NavBtn NavBtn--prev",
              id: l,
              onClick: f,
              type: "button",
              children: /* @__PURE__ */ a.jsx(x, { className: "calendar-nav-icon", name: "chevron-left" })
            }
          ) }),
          /* @__PURE__ */ a.jsxs("div", { className: "RangePicker-Tabs", role: "tablist", children: [
            /* @__PURE__ */ a.jsxs("div", { className: "RangePicker-Tab Item", children: [
              /* @__PURE__ */ a.jsx(
                "button",
                {
                  "aria-selected": d,
                  className: `TabBtn${d ? " active" : ""}`,
                  "data-lang": "calTitle",
                  id: p,
                  onClick: () => {
                    L("calendar");
                  },
                  role: "tab",
                  type: "button",
                  children: "캘린더"
                }
              ),
              /* @__PURE__ */ a.jsx("div", { className: "TabIndicator" })
            ] }),
            /* @__PURE__ */ a.jsx("div", { className: "RangePicker-Tab Item", children: /* @__PURE__ */ a.jsx(
              "button",
              {
                "aria-selected": !d,
                className: `TabBtn${d ? "" : " active"}`,
                "data-lang": "calFlexible",
                id: g,
                onClick: () => {
                  L("flexible");
                },
                role: "tab",
                type: "button",
                children: "날짜 미정"
              }
            ) })
          ] }),
          /* @__PURE__ */ a.jsx("div", { className: "RangePicker-NavNext", children: /* @__PURE__ */ a.jsx(
            "button",
            {
              "aria-label": "다음 달",
              className: "NavBtn NavBtn--next",
              id: c,
              onClick: u,
              type: "button",
              children: /* @__PURE__ */ a.jsx(x, { className: "calendar-nav-icon", name: "chevron-right" })
            }
          ) })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: `RangePicker-Panel${d ? " active" : ""}`, id: n, role: "tabpanel", children: [
          /* @__PURE__ */ a.jsx("div", { className: "DayPicker", id: "dayPickerContainer", onMouseLeave: j, children: /* @__PURE__ */ a.jsx("div", { className: "DayPicker-wrapper", children: /* @__PURE__ */ a.jsx("div", { className: "DayPicker-Months", id: t, children: U.map((w) => /* @__PURE__ */ a.jsxs("div", { className: "DayPicker-Month", children: [
            /* @__PURE__ */ a.jsx("div", { className: "DayPicker-Caption", children: w.label }),
            /* @__PURE__ */ a.jsx("div", { className: "DayPicker-Weekdays", children: w.weekdays.map((b) => /* @__PURE__ */ a.jsx("div", { className: "DayPicker-Weekday", children: b }, `${w.key}-${b}`)) }),
            /* @__PURE__ */ a.jsx("div", { className: "DayPicker-Body", children: w.days.map((b) => {
              const I = ["DayPicker-Day"];
              return b.isOutside && I.push("DayPicker-Day--outside"), b.isDisabled && I.push("DayPicker-Day--disabled"), b.isToday && I.push("DayPicker-Day--today"), b.isSelected && I.push("DayPicker-Day--selected"), b.isCheckIn && I.push("DayPicker-Day--checkIn"), b.isCheckOut && I.push("DayPicker-Day--checkOut"), b.isInRange && I.push("DayPicker-Day--inRange"), b.isHoverRange && I.push("DayPicker-Day--hoverRange"), b.isHoverEnd && I.push("DayPicker-Day--hoverEnd"), b.hasRange && I.push("DayPicker-Day--hasRange"), b.isOutside || b.timestamp === null ? /* @__PURE__ */ a.jsx("div", { "aria-hidden": "true", className: I.join(" ") }, b.key) : /* @__PURE__ */ a.jsx(
                "button",
                {
                  "aria-label": b.ariaLabel,
                  className: I.join(" "),
                  "data-day": b.day ?? void 0,
                  "data-timestamp": b.timestamp,
                  disabled: b.isDisabled,
                  onClick: () => {
                    D(b.timestamp);
                  },
                  onMouseEnter: () => {
                    E(b.timestamp);
                  },
                  type: "button",
                  children: b.label
                },
                b.key
              );
            }) })
          ] }, w.key)) }) }) }),
          /* @__PURE__ */ a.jsxs("div", { className: "RangePicker-Footer", children: [
            _ ? /* @__PURE__ */ a.jsx("div", { className: "RangePicker-FooterMeta", children: _ }) : null,
            /* @__PURE__ */ a.jsxs("div", { className: "RangePicker-FooterActions", children: [
              /* @__PURE__ */ a.jsx("button", { className: "ActionBtn ActionBtn--clear", id: i, onClick: v, type: "button", children: /* @__PURE__ */ a.jsx("span", { "data-lang": "btnReset", children: "선택 해제" }) }),
              /* @__PURE__ */ a.jsx("button", { className: "ActionBtn ActionBtn--confirm", id: h, onClick: y, type: "button", children: /* @__PURE__ */ a.jsx("span", { "data-lang": "btnConfirm", children: "확인" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ a.jsx("div", { className: `RangePicker-Panel${d ? "" : " active"}`, id: s, role: "tabpanel", children: /* @__PURE__ */ a.jsxs("div", { className: "Flexible-Content", children: [
          /* @__PURE__ */ a.jsx("h3", { "data-lang": "calFlexTitle", children: "투숙 기간은 얼마나 되시나요?" }),
          /* @__PURE__ */ a.jsx("div", { className: "Flexible-Options", children: o.map((w) => /* @__PURE__ */ a.jsx(
            "button",
            {
              className: `Flexible-Option${m.flexibleValue === w.value ? " active" : ""}`,
              "data-lang": w.dataLang,
              "data-val": w.value,
              onClick: () => {
                C(w.value);
              },
              type: "button",
              children: w.label
            },
            w.value
          )) })
        ] }) })
      ] })
    }
  );
}, Le = [
  { tab: "hotel", icon: "building-2", dataLang: "tabHotel", label: "호텔 & 리조트" },
  { tab: "pension", icon: "home", dataLang: "tabPension", label: "펜션 & 풀빌라" },
  { tab: "activity", icon: "compass", dataLang: "tabActivity", label: "즐길거리" }
], Ce = [
  {
    title: "대한민국 내 여행지",
    titleLang: "destKr",
    items: [
      {
        value: "제주",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=100&h=100&fit=crop",
        alt: "제주",
        name: "제주",
        nameLang: "destNameJeju",
        count: "(3,240)",
        desc: "오션뷰, 리조트",
        descLang: "descBeachDining"
      },
      {
        value: "서울",
        image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=100&h=100&fit=crop",
        alt: "서울",
        name: "서울",
        nameLang: "destNameSeoul",
        count: "(5,945)",
        desc: "쇼핑, 레스토랑",
        descLang: "descShoppingDining"
      },
      {
        value: "인천",
        image: "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?w=100&h=100&fit=crop",
        alt: "인천",
        name: "인천",
        nameLang: "destNameIncheon",
        count: "(2,147)",
        desc: "관광",
        descLang: "descTourism"
      },
      {
        value: "부산",
        image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=100&h=100&fit=crop",
        alt: "부산",
        name: "부산",
        nameLang: "destNameBusan",
        count: "(2,734)",
        desc: "해변, 레스토랑",
        descLang: "descBeachDining"
      },
      {
        value: "속초",
        image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=100&h=100&fit=crop",
        alt: "속초",
        name: "속초",
        nameLang: "destNameSokcho",
        count: "(800)",
        desc: "해변, 레스토랑",
        descLang: "descBeachDining"
      }
    ]
  },
  {
    title: "해외 여행지",
    titleLang: "destOverseas",
    items: [
      {
        value: "오사카",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=100&h=100&fit=crop",
        alt: "오사카",
        name: "오사카",
        nameLang: "destNameOsaka",
        count: "(10,018)",
        desc: "쇼핑, 레스토랑",
        descLang: "descShoppingDining"
      },
      {
        value: "도쿄",
        image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=100&h=100&fit=crop",
        alt: "도쿄",
        name: "도쿄 / 동경",
        nameLang: "destNameTokyo",
        count: "(12,486)",
        desc: "쇼핑, 관광",
        descLang: "descShoppingSightseeing"
      },
      {
        value: "후쿠오카",
        image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=100&h=100&fit=crop",
        alt: "후쿠오카",
        name: "후쿠오카",
        nameLang: "destNameFukuoka",
        count: "(2,181)",
        desc: "관광, 해변",
        descLang: "descSightseeingBeach"
      },
      {
        value: "방콕",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=100&h=100&fit=crop",
        alt: "방콕",
        name: "방콕",
        nameLang: "destNameBangkok",
        count: "(8,450)",
        desc: "쇼핑, 관광",
        descLang: "descShoppingSightseeing"
      },
      {
        value: "다낭",
        image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=100&h=100&fit=crop",
        alt: "다낭",
        name: "다낭",
        nameLang: "destNameDanang",
        count: "(2,890)",
        desc: "해변, 휴양",
        descLang: "descBeachDining"
      },
      {
        value: "싱가포르",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=100&h=100&fit=crop",
        alt: "싱가포르",
        name: "싱가포르",
        nameLang: "destNameSingapore",
        count: "(1,890)",
        desc: "시티뷰, 미식",
        descLang: "descShoppingDining"
      }
    ]
  }
], De = [
  { value: "3", dataLang: "calFlex3", label: "3박" },
  { value: "7", dataLang: "calFlex7", label: "1주일" },
  { value: "30", dataLang: "calFlex30", label: "1개월" }
], Te = [
  {
    key: "rooms",
    title: "객실",
    titleLang: "guestRooms",
    description: null,
    descriptionLang: void 0,
    defaultValue: "1"
  },
  {
    key: "adults",
    title: "성인",
    titleLang: "guestAdults",
    description: "18세 이상",
    descriptionLang: "guestAdultsDesc",
    defaultValue: "1"
  },
  {
    key: "children",
    title: "아동",
    titleLang: "guestChildren",
    description: "0 - 17세",
    descriptionLang: "guestChildrenDesc",
    defaultValue: "0"
  }
], Se = ["일", "월", "화", "수", "목", "금", "토"], Ee = (e) => `${e.getFullYear()}년 ${e.getMonth() + 1}월`, se = () => {
  const {
    state: e,
    stopPropagation: t,
    showPreviousMonth: n,
    showNextMonth: s,
    setCalendarTab: l,
    selectFlexibleOption: c,
    selectCalendarDate: i,
    setCalendarHoverDate: h,
    clearCalendarHoverDate: p,
    clearCalendar: g,
    confirmCalendar: o
  } = R();
  return /* @__PURE__ */ a.jsx(
    Ie,
    {
      calendar: e.calendar,
      clearButtonId: "btn-clear",
      confirmButtonId: "btn-confirm",
      flexibleOptions: De,
      monthLabelFormatter: Ee,
      monthsContainerId: "calendarMonths",
      nextButtonId: "nextMonth",
      onClear: g,
      onConfirm: o,
      onDateHover: h,
      onDateHoverLeave: p,
      onDateSelect: i,
      onFlexibleOptionSelect: c,
      onInteract: t,
      onNextMonth: s,
      onPreviousMonth: n,
      onTabChange: l,
      panelCalendarId: "panel-calendar",
      panelFlexibleId: "panel-flexible",
      popupId: "calendarPopup",
      prevButtonId: "prevMonth",
      tabCalendarId: "tab-calendar",
      tabFlexibleId: "tab-flexible",
      weekStartsOn: "sunday",
      weekdayLabels: Se
    }
  );
}, Oe = ({
  dropdownId: e,
  isOpen: t,
  columns: n,
  onInteract: s,
  onSelect: l
}) => /* @__PURE__ */ a.jsx("div", { className: `destination-dropdown${t ? " active" : ""}`, id: e, onClick: s, children: /* @__PURE__ */ a.jsx("div", { className: "dropdown-columns", children: n.map((c) => /* @__PURE__ */ a.jsxs("div", { className: "dropdown-column", children: [
  /* @__PURE__ */ a.jsx("div", { className: "dropdown-header", "data-lang": c.titleLang, children: c.title }),
  /* @__PURE__ */ a.jsx("ul", { className: "destination-list", children: c.items.map((i) => /* @__PURE__ */ a.jsxs(
    "li",
    {
      className: "destination-item",
      "data-value": i.value,
      onClick: () => {
        l(i.value);
      },
      children: [
        /* @__PURE__ */ a.jsx("img", { alt: i.alt, src: i.image }),
        /* @__PURE__ */ a.jsxs("div", { className: "destination-info", children: [
          /* @__PURE__ */ a.jsx("span", { className: "destination-name", "data-lang": i.nameLang, children: i.name }),
          /* @__PURE__ */ a.jsx("span", { className: "destination-count", children: i.count }),
          /* @__PURE__ */ a.jsx("span", { className: "destination-desc", "data-lang": i.descLang, children: i.desc })
        ] })
      ]
    },
    i.value
  )) })
] }, c.title)) }) }), ie = () => {
  const { state: e, selectDestination: t, stopPropagation: n } = R();
  return /* @__PURE__ */ a.jsx(
    Oe,
    {
      columns: Ce,
      dropdownId: "destinationDropdown",
      isOpen: e.isDestinationOpen,
      onInteract: n,
      onSelect: t
    }
  );
}, Pe = ({ popupId: e, isOpen: t, rows: n, values: s, onAdjust: l, onInteract: c }) => /* @__PURE__ */ a.jsx("div", { className: `guest-popup-new${t ? " active" : ""}`, id: e, onClick: c, children: n.map((i) => /* @__PURE__ */ a.jsxs("div", { className: "guest-row-new", children: [
  /* @__PURE__ */ a.jsxs("div", { className: "guest-info-new", children: [
    /* @__PURE__ */ a.jsx("span", { className: "guest-type-new", "data-lang": i.titleLang, children: i.title }),
    i.description ? /* @__PURE__ */ a.jsx("span", { className: "guest-desc-new", "data-lang": i.descriptionLang, children: i.description }) : null
  ] }),
  /* @__PURE__ */ a.jsxs("div", { className: "guest-counter-new", children: [
    /* @__PURE__ */ a.jsx(
      "button",
      {
        className: "counter-btn-new minus",
        "data-target": i.key,
        onClick: (h) => {
          l(i.key, -1, h);
        },
        type: "button",
        children: /* @__PURE__ */ a.jsx(x, { className: "counter-icon", name: "minus" })
      }
    ),
    /* @__PURE__ */ a.jsx("span", { className: "counter-value-new", id: `${i.key}CountLarge`, children: s[i.key] ?? Number(i.defaultValue ?? "0") }),
    /* @__PURE__ */ a.jsx(
      "button",
      {
        className: "counter-btn-new plus",
        "data-target": i.key,
        onClick: (h) => {
          l(i.key, 1, h);
        },
        type: "button",
        children: /* @__PURE__ */ a.jsx(x, { className: "counter-icon", name: "plus" })
      }
    )
  ] })
] }, i.key)) }), le = () => {
  const { state: e, adjustGuest: t, stopPropagation: n } = R();
  return /* @__PURE__ */ a.jsx(
    Pe,
    {
      isOpen: e.isGuestOpen,
      onAdjust: (s, l, c) => {
        t(s, l, c);
      },
      onInteract: n,
      popupId: "guestPopupLarge",
      rows: Te,
      values: e.guest
    }
  );
}, Ae = () => {
  const {
    state: e,
    checkInLabel: t,
    checkOutLabel: n,
    guestSummary: s,
    setDestinationValue: l,
    openDestinationInput: c,
    toggleDestination: i,
    toggleGuest: h,
    toggleCalendar: p,
    submitSearch: g
  } = R();
  return /* @__PURE__ */ a.jsx("div", { className: `search-form-new${e.activeTab === "activity" ? " hidden" : ""}`, id: "searchFormHotel", children: /* @__PURE__ */ a.jsx("div", { className: "global-search-container", children: /* @__PURE__ */ a.jsxs("div", { className: "global-search-bar", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "search-item destination-item-new", id: "destinationFieldLarge", onClick: i, children: [
      /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(x, { className: "search-field-icon", name: "search" }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ a.jsx("label", { className: "item-label", "data-lang": "destLabel", children: "여행지" }),
        /* @__PURE__ */ a.jsx(
          "input",
          {
            autoComplete: "off",
            className: "item-input",
            "data-lang-placeholder": "destPlaceholder",
            id: "destinationInput",
            placeholder: "어디로 떠나시나요?",
            type: "text",
            value: e.destinationValue,
            onChange: (o) => {
              l(o.target.value);
            },
            onClick: c
          }
        )
      ] }),
      /* @__PURE__ */ a.jsx(ie, {})
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ a.jsxs("div", { className: "search-item date-item-new", id: "checkInField", onClick: p, children: [
      /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(x, { className: "search-field-icon", name: "calendar" }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ a.jsx("label", { className: "item-label", "data-lang": "dateLabel", children: "체크인 - 체크아웃" }),
        /* @__PURE__ */ a.jsxs("div", { className: "date-display-text", children: [
          /* @__PURE__ */ a.jsx("span", { "data-lang": "dateSelect", id: "checkInDisplay", children: t }),
          /* @__PURE__ */ a.jsx("span", { className: "date-separator", children: " - " }),
          /* @__PURE__ */ a.jsx("span", { "data-lang": "dateSelect", id: "checkOutDisplay", children: n })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx(se, {})
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ a.jsxs("div", { className: "search-item guest-item-new", id: "guestFieldLarge", onClick: h, children: [
      /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(x, { className: "search-field-icon", name: "users" }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ a.jsx("label", { className: "item-label", "data-lang": "guestLabel", children: "여행자" }),
        /* @__PURE__ */ a.jsx("div", { className: "guest-display-text", children: /* @__PURE__ */ a.jsx("span", { id: "guestSummary", children: s }) })
      ] }),
      /* @__PURE__ */ a.jsx(le, {})
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "search-btn-wrapper", children: /* @__PURE__ */ a.jsxs("button", { className: "search-btn-pill", id: "searchBtn", onClick: g, type: "button", children: [
      /* @__PURE__ */ a.jsx(x, { className: "search-btn-icon", name: "search" }),
      /* @__PURE__ */ a.jsx("span", { className: "search-btn-text", "data-lang": "searchBtn", children: "검색" })
    ] }) })
  ] }) }) });
}, $e = ({ activeTab: e, items: t, onTabChange: n, onInteract: s }) => /* @__PURE__ */ a.jsx("div", { className: "search-tabs-large", onClick: s, children: t.map((l) => /* @__PURE__ */ a.jsxs(
  "button",
  {
    className: `search-tab-large${e === l.tab ? " active" : ""}`,
    "data-tab": l.tab,
    onClick: () => {
      n(l.tab);
    },
    type: "button",
    children: [
      /* @__PURE__ */ a.jsx(x, { className: "search-tab-icon", name: l.icon }),
      /* @__PURE__ */ a.jsx("span", { "data-lang": l.dataLang, children: l.label })
    ]
  },
  l.tab
)) }), Re = () => {
  const { state: e, setActiveTab: t, stopPropagation: n } = R();
  return /* @__PURE__ */ a.jsx(
    $e,
    {
      activeTab: e.activeTab,
      items: Le,
      onInteract: n,
      onTabChange: (s) => {
        t(s);
      }
    }
  );
}, _e = () => /* @__PURE__ */ a.jsx(ne, { children: /* @__PURE__ */ a.jsxs("div", { className: "search-widget-large", children: [
  /* @__PURE__ */ a.jsx(Re, {}),
  /* @__PURE__ */ a.jsx(Ae, {}),
  /* @__PURE__ */ a.jsx(we, {})
] }) }), Me = "jeju:hotel-search-widget-mounted", oa = () => (r.useEffect(() => {
  const e = window.lucide;
  e != null && e.createIcons && e.createIcons(), document.dispatchEvent(new Event(Me));
}, []), /* @__PURE__ */ a.jsx(_e, {})), Fe = () => {
  const {
    state: e,
    checkInLabel: t,
    checkOutLabel: n,
    guestSummary: s,
    setDestinationValue: l,
    openDestinationInput: c,
    toggleDestination: i,
    toggleGuest: h,
    toggleCalendar: p,
    submitSearch: g
  } = R();
  return /* @__PURE__ */ a.jsx("div", { className: "search-form-new hotel-list-search-form", id: "hotelListSearchForm", children: /* @__PURE__ */ a.jsx("div", { className: "global-search-container", children: /* @__PURE__ */ a.jsxs("div", { className: "global-search-bar hotel-list-search-bar", children: [
    /* @__PURE__ */ a.jsxs(
      "div",
      {
        className: "search-item destination-item-new hotel-list-search-item",
        id: "hotelListDestinationField",
        onClick: i,
        children: [
          /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(x, { className: "search-field-icon", name: "search" }) }),
          /* @__PURE__ */ a.jsxs("div", { className: "item-content", children: [
            /* @__PURE__ */ a.jsx("label", { className: "item-label", htmlFor: "hotelListDestinationInput", children: "여행지" }),
            /* @__PURE__ */ a.jsx(
              "input",
              {
                autoComplete: "off",
                className: "item-input",
                id: "hotelListDestinationInput",
                placeholder: "도시, 지역, 숙소명을 검색하세요",
                type: "text",
                value: e.destinationValue,
                onChange: (o) => {
                  l(o.target.value);
                },
                onClick: c
              }
            )
          ] }),
          /* @__PURE__ */ a.jsx(ie, {})
        ]
      }
    ),
    /* @__PURE__ */ a.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ a.jsxs(
      "div",
      {
        className: "search-item date-item-new hotel-list-search-item",
        id: "hotelListCheckInField",
        onClick: p,
        children: [
          /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(x, { className: "search-field-icon", name: "calendar" }) }),
          /* @__PURE__ */ a.jsxs("div", { className: "item-content", children: [
            /* @__PURE__ */ a.jsx("label", { className: "item-label", children: "숙박 일정" }),
            /* @__PURE__ */ a.jsxs("div", { className: "date-display-text", children: [
              /* @__PURE__ */ a.jsx("span", { id: "hotelListCheckInDisplay", children: t }),
              /* @__PURE__ */ a.jsx("span", { className: "date-separator", children: " - " }),
              /* @__PURE__ */ a.jsx("span", { id: "hotelListCheckOutDisplay", children: n })
            ] })
          ] }),
          /* @__PURE__ */ a.jsx(se, {})
        ]
      }
    ),
    /* @__PURE__ */ a.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ a.jsxs(
      "div",
      {
        className: "search-item guest-item-new hotel-list-search-item",
        id: "hotelListGuestField",
        onClick: h,
        children: [
          /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(x, { className: "search-field-icon", name: "users" }) }),
          /* @__PURE__ */ a.jsxs("div", { className: "item-content", children: [
            /* @__PURE__ */ a.jsx("label", { className: "item-label", children: "투숙 인원" }),
            /* @__PURE__ */ a.jsx("div", { className: "guest-display-text", children: /* @__PURE__ */ a.jsx("span", { id: "hotelListGuestSummary", children: s }) })
          ] }),
          /* @__PURE__ */ a.jsx(le, {})
        ]
      }
    ),
    /* @__PURE__ */ a.jsx("div", { className: "search-btn-wrapper", children: /* @__PURE__ */ a.jsxs(
      "button",
      {
        className: "search-btn-pill hotel-list-search-submit",
        id: "hotelListSearchBtn",
        onClick: g,
        type: "button",
        children: [
          /* @__PURE__ */ a.jsx(x, { className: "search-btn-icon", name: "search" }),
          /* @__PURE__ */ a.jsx("span", { className: "search-btn-text", children: "검색" })
        ]
      }
    ) })
  ] }) }) });
}, He = () => {
  const e = r.useMemo(() => {
    if (!(typeof window > "u"))
      return ae(window.location.search);
  }, []);
  return /* @__PURE__ */ a.jsx(ne, { initialState: e, children: /* @__PURE__ */ a.jsx("div", { className: "search-widget-large hotel-list-search-widget", children: /* @__PURE__ */ a.jsx(Fe, {}) }) });
}, da = () => /* @__PURE__ */ a.jsx(He, {}), Be = ({ checkedOptionIds: e, onToggle: t, section: n }) => /* @__PURE__ */ a.jsxs("div", { className: "filter-section", children: [
  /* @__PURE__ */ a.jsx("h3", { className: "filter-title", children: n.title }),
  /* @__PURE__ */ a.jsx("div", { className: "filter-items", children: n.options.map((s) => {
    const l = e.has(s.id);
    return /* @__PURE__ */ a.jsxs("label", { className: "filter-checkbox", children: [
      /* @__PURE__ */ a.jsx(
        "input",
        {
          checked: l,
          onChange: () => {
            t(s.id);
          },
          type: "checkbox"
        }
      ),
      /* @__PURE__ */ a.jsxs("span", { children: [
        s.label,
        typeof s.count == "number" ? /* @__PURE__ */ a.jsxs("span", { className: "count", children: [
          "(",
          s.count,
          ")"
        ] }) : null,
        s.description ? /* @__PURE__ */ a.jsx("span", { className: "filter-option-description", children: s.description }) : null
      ] })
    ] }, s.id);
  }) })
] }), Ge = ({
  checkedOptionIds: e,
  mapButtonLabel: t,
  onToggle: n,
  sections: s
}) => /* @__PURE__ */ a.jsxs("aside", { className: "filter-sidebar", children: [
  /* @__PURE__ */ a.jsxs("div", { className: "map-banner-widget", children: [
    /* @__PURE__ */ a.jsx("div", { className: "map-bg" }),
    /* @__PURE__ */ a.jsx("button", { className: "map-btn", type: "button", children: t })
  ] }),
  s.map((l) => /* @__PURE__ */ a.jsx(
    Be,
    {
      checkedOptionIds: e,
      onToggle: n,
      section: l
    },
    l.id
  ))
] }), Ue = {
  Exceptional: "최고",
  Excellent: "우수",
  Great: "좋은",
  "Very Good": "양호",
  Good: "좋은"
}, Ve = ({ hotel: e }) => {
  const [t, n] = r.useState(!1), s = Ue[e.reviewLabel] ?? e.reviewLabel;
  return /* @__PURE__ */ a.jsxs("article", { className: "hotel-card-premium", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "hotel-card-image", children: [
      /* @__PURE__ */ a.jsx("img", { alt: e.title, src: e.imageUrl }),
      /* @__PURE__ */ a.jsx("span", { className: "badge-overlay", children: e.badge }),
      /* @__PURE__ */ a.jsx(
        "button",
        {
          "aria-label": `${e.title} 찜하기`,
          className: `wishlist-btn-premium${t ? " active" : ""}`,
          onClick: () => {
            n((l) => !l);
          },
          type: "button",
          children: /* @__PURE__ */ a.jsx(x, { className: "wishlist-icon", name: "heart" })
        }
      )
    ] }),
    /* @__PURE__ */ a.jsxs("div", { className: "hotel-card-content", children: [
      /* @__PURE__ */ a.jsxs("div", { className: "hotel-card-header", children: [
        /* @__PURE__ */ a.jsxs("div", { className: "hotel-title-group", children: [
          /* @__PURE__ */ a.jsx("h3", { children: e.title }),
          /* @__PURE__ */ a.jsx("div", { className: "hotel-stars", children: e.stars })
        ] }),
        /* @__PURE__ */ a.jsxs("div", { className: "review-badge", children: [
          /* @__PURE__ */ a.jsx("span", { className: "score", children: e.reviewScore }),
          /* @__PURE__ */ a.jsx("small", { children: s })
        ] })
      ] }),
      /* @__PURE__ */ a.jsxs("div", { className: "hotel-location-text", children: [
        /* @__PURE__ */ a.jsx(x, { className: "hotel-location-icon", name: "map" }),
        /* @__PURE__ */ a.jsx("span", { children: e.location })
      ] }),
      /* @__PURE__ */ a.jsx("div", { className: "hotel-tags", children: e.tags.map((l) => /* @__PURE__ */ a.jsx("span", { className: "tag-item", children: l }, `${e.id}-${l}`)) }),
      /* @__PURE__ */ a.jsxs("div", { className: "hotel-price-zone", children: [
        /* @__PURE__ */ a.jsx("div", { className: "price-original", children: e.originalPrice }),
        /* @__PURE__ */ a.jsx("div", { className: "price-current", children: e.currentPrice }),
        /* @__PURE__ */ a.jsx("div", { className: "price-unit", children: "1박당 / 세금 포함" })
      ] })
    ] })
  ] });
}, M = 50, We = 2, B = 2, qe = 120, ze = ({ hotels: e }) => {
  const [t, n] = r.useState(B), [s, l] = r.useState(1), c = r.useRef(null), i = r.useRef(!1);
  r.useEffect(() => {
    n(Math.min(B, e.length)), l(1);
  }, [e]), r.useEffect(() => {
    const o = () => {
      const k = c.current;
      if (!k || p.length === 0)
        return;
      const v = k.querySelector(".hotel-card-premium");
      if (!v)
        return;
      const y = window.getComputedStyle(k), f = Number.parseFloat(y.gap || "0") || 0, u = v.offsetHeight, L = k.getBoundingClientRect().top, C = window.innerHeight - L;
      if (u <= 0 || C <= 0)
        return;
      const D = Math.min(
        p.length,
        Math.max(
          B,
          Math.ceil((C + f) / (u + f))
        )
      );
      D > t && n(D);
    }, m = window.requestAnimationFrame(o);
    return window.addEventListener("resize", o), () => {
      window.cancelAnimationFrame(m), window.removeEventListener("resize", o);
    };
  }, [p.length, t]), r.useEffect(() => {
    const o = e.slice((s - 1) * M, s * M);
    if (t >= o.length)
      return;
    const m = () => {
      const v = c.current;
      if (!v)
        return;
      v.getBoundingClientRect().bottom < window.innerHeight - qe && n((u) => Math.min(u + We, o.length));
    }, k = window.requestAnimationFrame(m);
    return window.addEventListener("scroll", m), () => {
      window.cancelAnimationFrame(k), window.removeEventListener("scroll", m);
    };
  }, [s, e, t]);
  const h = r.useMemo(() => Math.max(1, Math.ceil(e.length / M)), [e.length]), p = r.useMemo(() => {
    const o = (s - 1) * M;
    return e.slice(o, o + M);
  }, [s, e]), g = r.useMemo(() => p.slice(0, t), [p, t]);
  return r.useEffect(() => {
    var o;
    if (n(Math.min(B, p.length)), !i.current) {
      i.current = !0;
      return;
    }
    (o = c.current) == null || o.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [s, p.length]), e.length === 0 ? /* @__PURE__ */ a.jsx("section", { className: "hotel-main-list", children: /* @__PURE__ */ a.jsxs("div", { className: "hotel-runtime-fallback hotel-runtime-fallback--list", children: [
    /* @__PURE__ */ a.jsx("strong", { children: "조건에 맞는 호텔이 없음" }),
    /* @__PURE__ */ a.jsx("span", { children: "평점이나 숙소 종류 필터를 조금 풀어서 다시 봐라." })
  ] }) }) : /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    /* @__PURE__ */ a.jsx("section", { className: "hotel-main-list", ref: c, children: g.map((o) => /* @__PURE__ */ a.jsx(Ve, { hotel: o }, o.id)) }),
    h > 1 && t >= p.length ? /* @__PURE__ */ a.jsxs("div", { className: "load-more-container pagination-container", children: [
      /* @__PURE__ */ a.jsxs("span", { className: "page-indicator", children: [
        s,
        " / ",
        h
      ] }),
      s < h ? /* @__PURE__ */ a.jsx(
        "button",
        {
          className: "btn-load-more",
          onClick: () => {
            l((o) => Math.min(o + 1, h));
          },
          type: "button",
          children: "다음 페이지"
        }
      ) : null
    ] }) : null
  ] });
}, K = "hiroshima", F = {
  hiroshima: {
    label: "히로시마",
    countryLabel: "일본",
    mapButtonLabel: "지도에서 히로시마 호텔 보기",
    popularFilters: [
      { id: "kitchen", label: "주방" },
      { id: "pay-now", label: "지금 바로 결제" },
      { id: "downtown", label: "다운타운" },
      { id: "internet", label: "인터넷" },
      { id: "frontdesk", label: "24시간 프런트 데스크" },
      { id: "spa", label: "스파/사우나" }
    ],
    propertyTypes: [
      { id: "hotel", label: "호텔", count: 302 },
      { id: "resort", label: "리조트", count: 4 },
      { id: "ryokan", label: "료칸", count: 20 },
      { id: "apartment", label: "아파트", count: 53 },
      { id: "guesthouse", label: "게스트하우스 / 비앤비", count: 12 },
      { id: "hostel", label: "호스텔", count: 11 },
      { id: "serviced-apartment", label: "서비스 아파트", count: 4 },
      { id: "inn", label: "인", count: 1 },
      { id: "resort-villa", label: "리조트 빌라", count: 1 },
      { id: "private-house-entire", label: "프라이빗 하우스 전체", count: 7 },
      { id: "capsule", label: "캡슐 호텔", count: 4 },
      { id: "love-hotel", label: "러브호텔", count: 1 },
      { id: "villa", label: "빌라", count: 2 }
    ],
    locations: [
      { id: "hiroshima-center", label: "히로시마", count: 306 },
      { id: "miyajima", label: "미야지마", count: 63, description: "럭셔리 숙박, 인기 명소" },
      { id: "hatsukaichi", label: "하쓰카이치", count: 12 },
      { id: "naka-ward", label: "나카 워드", count: 8 },
      { id: "others", label: "기타", count: 6 },
      { id: "etajima", label: "에타지마", count: 6 },
      { id: "downtown-location", label: "다운타운", count: 5 },
      { id: "nishi-ward", label: "니시구", count: 3 },
      { id: "otake", label: "오타케", count: 3 },
      { id: "yokogawa", label: "요코가와", count: 3 },
      { id: "kaita", label: "가이타", count: 2 },
      { id: "hiroshima-station-area", label: "히로시마역", count: 1 }
    ],
    paymentOptions: [
      { id: "free-cancel", label: "예약 무료 취소", count: 5 },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제", count: 34 },
      { id: "prepaid", label: "지금 바로 결제", count: 157 }
    ],
    guestRatings: [
      { id: "rating-9", label: "9+ 최고", count: 72 },
      { id: "rating-8", label: "8+ 우수", count: 228 },
      { id: "rating-7", label: "7+ 좋음", count: 290 }
    ],
    amenities: [
      { id: "pool", label: "수영장", count: 5 },
      { id: "parking", label: "주차장", count: 99 },
      { id: "fitness", label: "피트니스", count: 6 },
      { id: "restaurant", label: "레스토랑", count: 63 },
      { id: "airport-transfer", label: "공항 이동 교통편 서비스", count: 1 },
      { id: "family-friendly", label: "가족/아동 여행객 친화형 시설", count: 117 },
      { id: "non-smoking", label: "금연", count: 133 },
      { id: "smoking-area", label: "흡연 구역", count: 94 },
      { id: "pet-friendly", label: "반려동물 동반 가능", count: 19 },
      { id: "accessible", label: "장애인용 편의 시설/서비스", count: 42 },
      { id: "business", label: "비즈니스 관련 편의 시설", count: 29 }
    ],
    hotels: [
      {
        id: "hiroshima-premium",
        title: "히로시마 프리미엄 호텔",
        stars: "★★★★★",
        location: "히로시마 시내 중심 · 원폭 돔 인근",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "9.2",
        reviewLabel: "Excellent",
        originalPrice: "₩250,000",
        currentPrice: "₩189,000",
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        badge: "특가 상품",
        filterIds: ["internet", "spa", "pay-now", "restaurant"],
        tags: ["무료 Wi-Fi", "스파 & 마사지", "피트니스 센터"]
      },
      {
        id: "miyajima-grand",
        title: "미야지마 그랜드 리조트",
        stars: "★★★★",
        location: "미야지마 해변가 · 선착장 도보 10분",
        locationId: "miyajima",
        propertyTypeId: "resort",
        reviewScore: "8.8",
        reviewLabel: "Great",
        originalPrice: "₩320,000",
        currentPrice: "₩265,000",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
        badge: "인기 숙소",
        filterIds: ["pay-at-hotel", "restaurant", "pool"],
        tags: ["조식 포함", "오션뷰", "공항 셔틀"]
      },
      {
        id: "hiroshima-station",
        title: "히로시마 스테이션 비즈니스 호텔",
        stars: "★★★",
        location: "히로시마역 도보 5분",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "8.4",
        reviewLabel: "Very Good",
        originalPrice: "₩170,000",
        currentPrice: "₩132,000",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        badge: "조식 특가",
        filterIds: ["frontdesk", "free-cancel", "internet"],
        tags: ["역세권", "셀프 체크인", "무료 취소"]
      },
      {
        id: "setouchi-spa",
        title: "세토우치 스파 스테이",
        stars: "★★★★★",
        location: "세토우치 오션뷰",
        locationId: "miyajima",
        propertyTypeId: "resort",
        reviewScore: "9.5",
        reviewLabel: "Exceptional",
        originalPrice: "₩410,000",
        currentPrice: "₩338,000",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        badge: "럭셔리 추천",
        filterIds: ["spa", "pool", "pay-now"],
        tags: ["인피니티 풀", "사우나", "레이트 체크아웃"]
      },
      {
        id: "rihga-royal",
        title: "리가 로얄 호텔 히로시마",
        stars: "★★★★★",
        location: "히로시마 평화공원 도보 3분",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "9.1",
        reviewLabel: "Excellent",
        originalPrice: "₩210,000",
        currentPrice: "₩150,000",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
        badge: "베스트셀러",
        filterIds: ["restaurant", "downtown", "non-smoking"],
        tags: ["대욕장", "조식 맛집"]
      },
      {
        id: "ana-crowne-plaza",
        title: "ANA 크라운 플라자 히로시마",
        stars: "★★★★",
        location: "나카 워드 중심가",
        locationId: "naka-ward",
        propertyTypeId: "hotel",
        reviewScore: "8.5",
        reviewLabel: "Excellent",
        originalPrice: "₩180,000",
        currentPrice: "₩120,000",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        badge: "특가",
        filterIds: ["fitness", "business", "downtown"],
        tags: ["피트니스", "비즈니스"]
      },
      {
        id: "candeo-hiroshima",
        title: "칸데오 호텔 히로시마",
        stars: "★★★★",
        location: "핫초보리 역 인근",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "8.9",
        reviewLabel: "Excellent",
        originalPrice: "₩250,000",
        currentPrice: "₩175,000",
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
        badge: "스파 포함",
        filterIds: ["spa", "downtown", "non-smoking"],
        tags: ["루프탑 스파", "사우나"]
      },
      {
        id: "the-knot",
        title: "The Knot Hiroshima",
        stars: "★★★★",
        location: "평화대로 위치",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "9.3",
        reviewLabel: "Exceptional",
        originalPrice: "₩190,000",
        currentPrice: "₩140,000",
        imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
        badge: "디자인 호텔",
        filterIds: ["downtown", "restaurant", "non-smoking"],
        tags: ["루프탑 바", "모던 인테리어"]
      },
      {
        id: "washington-hotel",
        title: "워싱턴 호텔",
        stars: "★★★",
        location: "히로시마 역세권",
        locationId: "hiroshima-station-area",
        propertyTypeId: "hotel",
        reviewScore: "8.2",
        reviewLabel: "Very Good",
        originalPrice: "₩130,000",
        currentPrice: "₩95,000",
        imageUrl: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=600&q=80",
        badge: "가성비 갑",
        filterIds: ["frontdesk", "station", "internet"],
        tags: ["깔끔함", "교통 편리"]
      },
      {
        id: "sheraton-grand",
        title: "쉐라톤 그랜드 히로시마",
        stars: "★★★★★",
        location: "히로시마역 직결",
        locationId: "hiroshima-station-area",
        propertyTypeId: "hotel",
        reviewScore: "9.6",
        reviewLabel: "Exceptional",
        originalPrice: "₩350,000",
        currentPrice: "₩280,000",
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        badge: "럭셔리",
        filterIds: ["pool", "fitness", "restaurant"],
        tags: ["수영장", "클럽 라운지"]
      }
    ]
  },
  jeju: {
    label: "제주",
    countryLabel: "대한민국",
    mapButtonLabel: "지도에서 제주 호텔 보기",
    popularFilters: [
      { id: "ocean-view", label: "오션뷰" },
      { id: "pool-villa", label: "풀빌라" },
      { id: "breakfast", label: "조식 포함" },
      { id: "rental-friendly", label: "렌터카 이동 편리" }
    ],
    propertyTypes: [
      { id: "hotel", label: "호텔", count: 188 },
      { id: "resort", label: "리조트", count: 41 },
      { id: "poolvilla", label: "풀빌라", count: 32 },
      { id: "private-house", label: "독채 숙소", count: 27 }
    ],
    locations: [
      { id: "jeju-city", label: "제주시", count: 109 },
      { id: "seogwipo", label: "서귀포시", count: 96, description: "바다 전망, 리조트 밀집" },
      { id: "jungmun", label: "중문", count: 44 },
      { id: "aewol", label: "애월", count: 36 }
    ],
    paymentOptions: [
      { id: "free-cancel", label: "예약 무료 취소", count: 81 },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제", count: 42 },
      { id: "prepaid", label: "지금 바로 결제", count: 133 }
    ],
    guestRatings: [
      { id: "rating-9", label: "9+ 최고", count: 66 },
      { id: "rating-8", label: "8+ 우수", count: 142 },
      { id: "rating-7", label: "7+ 좋음", count: 181 }
    ],
    amenities: [
      { id: "pool", label: "수영장", count: 58 },
      { id: "spa", label: "스파", count: 17 },
      { id: "parking", label: "무료 주차", count: 144 },
      { id: "ocean", label: "오션뷰 객실", count: 73 }
    ],
    hotels: [
      {
        id: "jeju-grand-hyatt",
        title: "그랜드 하얏트 제주",
        stars: "★★★★★",
        location: "제주시 노형동 · 공항 15분",
        locationId: "jeju-city",
        propertyTypeId: "hotel",
        reviewScore: "9.1",
        reviewLabel: "Excellent",
        originalPrice: "₩420,000",
        currentPrice: "₩349,000",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        badge: "JEJU PICK",
        filterIds: ["parking", "pool", "breakfast"],
        tags: ["도심형 럭셔리", "실내 수영장", "라운지"]
      },
      {
        id: "jeju-shinhwa",
        title: "제주신화월드 메리어트",
        stars: "★★★★★",
        location: "서귀포 안덕면 · 가족 여행 인기",
        locationId: "seogwipo",
        propertyTypeId: "resort",
        reviewScore: "8.9",
        reviewLabel: "Great",
        originalPrice: "₩360,000",
        currentPrice: "₩289,000",
        imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
        badge: "패밀리 특가",
        filterIds: ["pool", "breakfast", "rental-friendly"],
        tags: ["워터파크", "키즈 친화", "조식 포함"]
      },
      {
        id: "jeju-aewol-stay",
        title: "애월 오션 스테이",
        stars: "★★★★",
        location: "애월 해안도로 · 카페 거리 인근",
        locationId: "aewol",
        propertyTypeId: "hotel",
        reviewScore: "8.7",
        reviewLabel: "Excellent",
        originalPrice: "₩210,000",
        currentPrice: "₩168,000",
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        badge: "오션뷰",
        filterIds: ["ocean-view", "parking", "rental-friendly"],
        tags: ["노을 뷰", "무료 주차", "커플 추천"]
      },
      {
        id: "jeju-jungmun-resort",
        title: "중문 씨뷰 리조트",
        stars: "★★★★",
        location: "중문 관광단지 · 해변 도보권",
        locationId: "jungmun",
        propertyTypeId: "resort",
        reviewScore: "9.0",
        reviewLabel: "Excellent",
        originalPrice: "₩280,000",
        currentPrice: "₩228,000",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
        badge: "리조트 추천",
        filterIds: ["pool", "spa", "ocean-view"],
        tags: ["야외 수영장", "스파", "레이트 체크아웃"]
      }
    ]
  },
  osaka: {
    label: "오사카",
    countryLabel: "일본",
    mapButtonLabel: "지도에서 오사카 호텔 보기",
    popularFilters: [
      { id: "namba", label: "난바 도보권" },
      { id: "shopping", label: "쇼핑 중심지" },
      { id: "station", label: "역세권" },
      { id: "family", label: "유니버설 접근성" }
    ],
    propertyTypes: [
      { id: "hotel", label: "호텔", count: 544 },
      { id: "resort", label: "리조트", count: 11 },
      { id: "capsule", label: "캡슐 호텔", count: 26 },
      { id: "apartment", label: "서비스 아파트", count: 88 }
    ],
    locations: [
      { id: "namba", label: "난바", count: 142 },
      { id: "umeda", label: "우메다", count: 101, description: "비즈니스, 백화점 중심" },
      { id: "shinsaibashi", label: "신사이바시", count: 88 },
      { id: "universal", label: "유니버설 시티", count: 24 }
    ],
    paymentOptions: [
      { id: "free-cancel", label: "예약 무료 취소", count: 133 },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제", count: 67 },
      { id: "prepaid", label: "지금 바로 결제", count: 302 }
    ],
    guestRatings: [
      { id: "rating-9", label: "9+ 최고", count: 98 },
      { id: "rating-8", label: "8+ 우수", count: 314 },
      { id: "rating-7", label: "7+ 좋음", count: 463 }
    ],
    amenities: [
      { id: "station", label: "역 도보 5분", count: 241 },
      { id: "breakfast", label: "조식 포함", count: 154 },
      { id: "family", label: "패밀리룸", count: 96 },
      { id: "onsen", label: "온천/대욕장", count: 44 }
    ],
    hotels: [
      {
        id: "osaka-ritz",
        title: "리츠칼튼 오사카",
        stars: "★★★★★",
        location: "우메다 · 오사카역 차량 5분",
        locationId: "umeda",
        propertyTypeId: "hotel",
        reviewScore: "9.4",
        reviewLabel: "Exceptional",
        originalPrice: "₩520,000",
        currentPrice: "₩438,000",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
        badge: "럭셔리 추천",
        filterIds: ["shopping", "breakfast", "onsen"],
        tags: ["클래식 인테리어", "라운지", "미슐랭 다이닝"]
      },
      {
        id: "osaka-cross",
        title: "크로스 호텔 오사카",
        stars: "★★★★",
        location: "도톤보리 · 난바역 도보 3분",
        locationId: "namba",
        propertyTypeId: "hotel",
        reviewScore: "8.9",
        reviewLabel: "Great",
        originalPrice: "₩260,000",
        currentPrice: "₩214,000",
        imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
        badge: "쇼핑 특화",
        filterIds: ["namba", "shopping", "station"],
        tags: ["도톤보리 인접", "커플 추천", "역세권"]
      },
      {
        id: "osaka-liber",
        title: "리베르 호텔 오사카",
        stars: "★★★★",
        location: "유니버설 시티 · 가족 여행",
        locationId: "universal",
        propertyTypeId: "resort",
        reviewScore: "9.0",
        reviewLabel: "Excellent",
        originalPrice: "₩310,000",
        currentPrice: "₩258,000",
        imageUrl: "https://images.unsplash.com/photo-1590490360182-c87295ec4232?w=600&q=80",
        badge: "패밀리 인기",
        filterIds: ["family", "breakfast", "onsen"],
        tags: ["대욕장", "USJ 접근성", "조식 포함"]
      },
      {
        id: "osaka-capsule-premium",
        title: "난바 프리미엄 캡슐 스테이",
        stars: "★★★",
        location: "난카이 난바역 도보 4분",
        locationId: "namba",
        propertyTypeId: "capsule",
        reviewScore: "8.5",
        reviewLabel: "Very Good",
        originalPrice: "₩92,000",
        currentPrice: "₩68,000",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        badge: "가성비",
        filterIds: ["namba", "station"],
        tags: ["1인 여행", "깔끔함", "역세권"]
      }
    ]
  }
}, Ye = (e) => new URLSearchParams(e), J = (e) => {
  if (!e)
    return "";
  const t = new Date(e);
  return `${t.getMonth() + 1}월 ${t.getDate()}일`;
}, Ke = (e, t, n) => {
  const s = [`성인 ${e}명`];
  return t > 0 && s.push(`아동 ${t}명`), s.push(`객실 ${n}개`), s.join(", ");
}, Je = (e) => e !== "hiroshima" ? [] : [
  {
    id: "star-rating",
    title: "숙소 성급",
    options: [
      { id: "ui-five-star", label: "5-성급", count: 10 },
      { id: "ui-four-star", label: "4-성급", count: 47 },
      { id: "ui-three-star", label: "3-성급", count: 149 },
      { id: "ui-two-star", label: "2-성급", count: 63 },
      { id: "ui-one-star", label: "1-성급", count: 44 }
    ]
  },
  {
    id: "meal-options",
    title: "이용 가능 서비스 / 옵션",
    options: [
      { id: "ui-breakfast-included", label: "조식 포함", count: 63 },
      { id: "ui-dinner-included", label: "석식(저녁) 포함", count: 17 },
      { id: "ui-free-sauna", label: "사우나 무료 이용", count: 3 },
      { id: "ui-early-checkin", label: "얼리 체크인", count: 2 },
      { id: "ui-late-checkout", label: "레이트 체크아웃", count: 2 },
      { id: "ui-lunch-included", label: "중식(점심) 포함", count: 1 },
      { id: "ui-shuttle", label: "무료 셔틀 서비스", count: 1 }
    ]
  },
  {
    id: "room-amenities",
    title: "객실 편의 시설/서비스",
    options: [
      { id: "ui-heating", label: "난방", count: 193 },
      { id: "ui-fridge", label: "냉장고", count: 185 },
      { id: "ui-tv", label: "TV", count: 177 },
      { id: "ui-bathtub", label: "욕조", count: 155 },
      { id: "ui-aircon", label: "에어컨", count: 111 },
      { id: "ui-washer", label: "세탁기", count: 78 },
      { id: "ui-room-internet", label: "인터넷", count: 70 },
      { id: "ui-coffee-maker", label: "커피/티 메이커", count: 43 },
      { id: "ui-balcony", label: "발코니/테라스", count: 39 },
      { id: "ui-room-kitchen", label: "주방", count: 22 },
      { id: "ui-ironing", label: "다림질 도구", count: 20 },
      { id: "ui-room-pet", label: "반려동물 동반 가능", count: 5 }
    ]
  },
  {
    id: "distance",
    title: "도심까지의 거리",
    options: [
      { id: "ui-city-center", label: "도심에 위치", count: 96 },
      { id: "ui-city-under-2", label: "도심까지 2km 미만", count: 200 },
      { id: "ui-city-2-5", label: "도심까지 2~5km", count: 16 },
      { id: "ui-city-5-10", label: "도심까지 5~10km", count: 14 }
    ]
  },
  {
    id: "bed-types",
    title: "침대 종류",
    options: [
      { id: "ui-double-bed", label: "더블베드", count: 251 },
      { id: "ui-single-bed", label: "싱글/트윈베드", count: 151 },
      { id: "ui-queen-bed", label: "퀸베드", count: 73 },
      { id: "ui-bunk-bed", label: "벙크베드", count: 24 },
      { id: "ui-king-bed", label: "킹베드", count: 17 }
    ]
  },
  {
    id: "landmarks",
    title: "주변 인기 명소",
    options: [
      { id: "ui-okonomimura", label: "오코노미무라", count: 134 },
      { id: "ui-atomic-bomb-dome", label: "원폭 돔", count: 128 },
      { id: "ui-peace-museum", label: "히로시마 평화 기념관", count: 113 },
      { id: "ui-sukkein", label: "수케이엔 정원", count: 87 },
      { id: "ui-hiroshima-castle", label: "히로시마 성", count: 45 }
    ]
  }
], ce = (e) => Array.from(new Set(e.filter((t) => t.trim() !== ""))), O = (e, t, n) => ({
  label: t,
  countryLabel: n,
  mapButtonLabel: `지도에서 ${t} 호텔 보기`,
  popularFilters: [
    { id: `${e}-central`, label: `${t} 중심가` },
    { id: `${e}-shopping`, label: "쇼핑 중심지" },
    { id: `${e}-resort`, label: "리조트 특가" },
    { id: `${e}-breakfast`, label: "조식 포함" }
  ],
  propertyTypes: [
    { id: `${e}-hotel`, label: "호텔", count: 214 },
    { id: `${e}-resort-type`, label: "리조트", count: 18 },
    { id: `${e}-apartment`, label: "서비스 아파트", count: 37 },
    { id: `${e}-villa`, label: "빌라", count: 9 }
  ],
  locations: [
    { id: `${e}-center`, label: `${t} 센트럴`, count: 81 },
    { id: `${e}-bay`, label: `${t} 베이`, count: 28, description: "인기 관광 구역" },
    { id: `${e}-station`, label: `${t} 역세권`, count: 44 },
    { id: `${e}-old-town`, label: `${t} 올드타운`, count: 17 }
  ],
  paymentOptions: [
    { id: `${e}-free-cancel`, label: "예약 무료 취소", count: 59 },
    { id: `${e}-pay-at-hotel`, label: "숙소에서 요금 결제", count: 33 },
    { id: `${e}-prepaid`, label: "지금 바로 결제", count: 118 }
  ],
  guestRatings: [
    { id: "rating-9", label: "9+ 최고", count: 39 },
    { id: "rating-8", label: "8+ 우수", count: 102 },
    { id: "rating-7", label: "7+ 좋음", count: 164 }
  ],
  amenities: [
    { id: `${e}-pool`, label: "수영장", count: 22 },
    { id: `${e}-spa`, label: "스파", count: 11 },
    { id: `${e}-parking`, label: "무료 주차", count: 57 },
    { id: `${e}-breakfast-amenity`, label: "조식 포함", count: 76 }
  ],
  hotels: [
    {
      id: `${e}-central-hotel`,
      title: `${t} 센트럴 호텔`,
      stars: "★★★★★",
      location: `${t} 중심가 · 대표 관광지 인접`,
      locationId: `${e}-center`,
      propertyTypeId: "hotel",
      reviewScore: "9.1",
      reviewLabel: "Excellent",
      originalPrice: "₩330,000",
      currentPrice: "₩269,000",
      imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
      badge: "추천 호텔",
      filterIds: [`${e}-central`, `${e}-shopping`, `${e}-breakfast`],
      tags: ["무료 Wi-Fi", "라운지", "조식 포함"]
    },
    {
      id: `${e}-grand-resort`,
      title: `${t} 그랜드 리조트`,
      stars: "★★★★",
      location: `${t} 베이 프런트 · 전망 특화`,
      locationId: `${e}-bay`,
      propertyTypeId: "resort",
      reviewScore: "8.8",
      reviewLabel: "Great",
      originalPrice: "₩290,000",
      currentPrice: "₩228,000",
      imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
      badge: "리조트 특가",
      filterIds: [`${e}-resort`, `${e}-pool`, `${e}-spa`],
      tags: ["오션뷰", "수영장", "스파"]
    },
    {
      id: `${e}-station-stay`,
      title: `${t} 스테이션 스테이`,
      stars: "★★★",
      location: `${t} 역 도보 5분`,
      locationId: `${e}-station`,
      propertyTypeId: "hotel",
      reviewScore: "8.4",
      reviewLabel: "Very Good",
      originalPrice: "₩180,000",
      currentPrice: "₩139,000",
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      badge: "역세권",
      filterIds: [`${e}-station`, `${e}-free-cancel`],
      tags: ["역세권", "셀프 체크인", "무료 취소"]
    },
    {
      id: `${e}-premium-suite`,
      title: `${t} 프리미엄 스위트`,
      stars: "★★★★★",
      location: `${t} 메인 스트립 · 야경 명소`,
      locationId: `${e}-old-town`,
      propertyTypeId: "villa",
      reviewScore: "9.3",
      reviewLabel: "Exceptional",
      originalPrice: "₩410,000",
      currentPrice: "₩338,000",
      imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
      badge: "럭셔리",
      filterIds: [`${e}-villa`, `${e}-shopping`],
      tags: ["스위트룸", "레이트 체크아웃", "피트니스"]
    }
  ]
}), Xe = (e, t) => {
  const n = (e == null ? void 0 : e.trim().toLowerCase()) || "";
  if (n && F[n])
    return { region: n, profile: F[n] };
  if (n === "bangkok")
    return { region: "bangkok", profile: O("bangkok", "방콕", "태국") };
  if (n === "tokyo")
    return { region: "tokyo", profile: O("tokyo", "도쿄", "일본") };
  if (n === "danang")
    return { region: "danang", profile: O("danang", "다낭", "베트남") };
  if (n === "singapore")
    return { region: "singapore", profile: O("singapore", "싱가포르", "싱가포르") };
  const s = (t == null ? void 0 : t.trim().toLowerCase()) || "";
  return s.includes("제주") || s.includes("jeju") ? { region: "jeju", profile: F.jeju } : s.includes("오사카") || s.includes("osaka") ? { region: "osaka", profile: F.osaka } : s.includes("방콕") || s.includes("bangkok") ? { region: "bangkok", profile: O("bangkok", "방콕", "태국") } : s.includes("도쿄") || s.includes("tokyo") ? { region: "tokyo", profile: O("tokyo", "도쿄", "일본") } : s.includes("다낭") || s.includes("danang") ? { region: "danang", profile: O("danang", "다낭", "베트남") } : s.includes("싱가포르") || s.includes("singapore") ? { region: "singapore", profile: O("singapore", "싱가포르", "싱가포르") } : { region: K, profile: F[K] };
}, Ze = (e, t, n) => [
  {
    id: "popular",
    title: `${t} 인기 검색 조건`,
    options: n.popularFilters
  },
  {
    id: "property-types",
    title: "숙소 종류",
    options: n.propertyTypes
  },
  {
    id: "locations",
    title: "지역",
    options: n.locations
  },
  {
    id: "payment-options",
    title: "결제 관련 옵션",
    options: n.paymentOptions
  },
  {
    id: "guest-ratings",
    title: "투숙객 평가 점수",
    options: n.guestRatings
  },
  {
    id: "amenities",
    title: "숙소 편의 시설 및 서비스",
    options: n.amenities
  },
  ...Je(e)
], X = (e) => {
  var o, m, k, v, y, f;
  const t = Ye(e), n = t.get("keyword"), s = t.get("region"), l = ae(e), c = Xe(s, n), i = ((o = l.destinationValue) == null ? void 0 : o.trim()) || `${c.profile.label}, ${c.profile.countryLabel}`, h = J(((m = l.calendar) == null ? void 0 : m.checkIn) ?? null), p = J(((k = l.calendar) == null ? void 0 : k.checkOut) ?? null), g = h && p ? `${h} - ${p}` : "날짜를 선택하세요";
  return {
    shell: t.get("shell") ?? "stay",
    migrationPath: "/migration",
    region: c.region,
    regionLabel: c.profile.label,
    mapButtonLabel: c.profile.mapButtonLabel,
    searchSummary: {
      destinationLabel: i,
      dateLabel: g,
      guestLabel: Ke(
        ((v = l.guest) == null ? void 0 : v.adults) ?? 1,
        ((y = l.guest) == null ? void 0 : y.children) ?? 0,
        ((f = l.guest) == null ? void 0 : f.rooms) ?? 1
      )
    },
    filterSections: Ze(c.region, c.profile.label, c.profile),
    hotels: c.profile.hotels
  };
}, Qe = () => {
  var t;
  if (typeof document > "u")
    return null;
  const e = document.getElementById("hotel-list-page-data");
  if (!((t = e == null ? void 0 : e.textContent) != null && t.trim()))
    return null;
  try {
    return JSON.parse(e.textContent);
  } catch {
    return null;
  }
}, ea = (e) => {
  const t = Number.parseFloat(e);
  return Number.isNaN(t) ? 0 : t;
}, aa = (e, t) => e.filter((n) => {
  if (t.guestRatingThreshold !== null && ea(n.reviewScore) < t.guestRatingThreshold || t.locationIds.length > 0 && !t.locationIds.includes(n.locationId))
    return !1;
  if (t.propertyTypeIds.length === 0) {
    const i = t.selectedOptionIds.filter(
      (h) => !h.startsWith("rating-") && !h.startsWith("ui-") && !t.locationIds.includes(h)
    );
    return i.length === 0 ? !0 : i.every((h) => h === n.locationId ? !0 : n.filterIds.includes(h));
  }
  const s = n.title.toLowerCase();
  if (!t.propertyTypeIds.some((i) => i === "hotel" ? n.propertyTypeId === "hotel" || s.includes("호텔") || s.includes("hotel") : i === "resort" || i === "resort-type" ? n.propertyTypeId === "resort" || s.includes("리조트") || s.includes("resort") : i === "ryokan" ? n.propertyTypeId === "ryokan" || s.includes("료칸") || s.includes("ryokan") : i === "apartment" ? n.propertyTypeId === "apartment" || s.includes("아파트") || s.includes("apartment") : i === "capsule" ? n.propertyTypeId === "capsule" || s.includes("캡슐") : i === "poolvilla" ? n.propertyTypeId === "poolvilla" || s.includes("풀빌라") : i === "private-house" ? n.propertyTypeId === "private-house" || s.includes("독채") : i === "villa" ? n.propertyTypeId === "villa" || s.includes("빌라") : !1))
    return !1;
  const c = t.selectedOptionIds.filter(
    (i) => !i.startsWith("rating-") && !i.startsWith("ui-") && !t.propertyTypeIds.includes(i) && !t.locationIds.includes(i)
  );
  return c.length === 0 ? !0 : c.every((i) => i === n.locationId ? !0 : n.filterIds.includes(i));
}), Z = (e) => ce(
  e.filterSections.flatMap(
    (t) => t.options.filter((n) => n.checked).map((n) => n.id)
  )
), ta = (e, t) => {
  const n = new URLSearchParams(e);
  return n.delete("filter"), ce(t).forEach((s) => {
    n.append("filter", s);
  }), n;
}, Q = (e) => new Set(e), na = "property-types", sa = "guest-ratings", ia = "locations", ua = () => {
  const e = r.useMemo(() => Qe(), []), [t, n] = r.useState(() => e ?? X(window.location.search)), [s, l] = r.useState(
    () => Q(Z(e ?? X(window.location.search)))
  ), c = e !== null;
  r.useEffect(() => {
    const g = document.getElementById("stickySearch");
    if (!g)
      return;
    const o = () => {
      g.classList.toggle("scrolled", window.scrollY > 100);
    };
    return o(), window.addEventListener("scroll", o), () => {
      window.removeEventListener("scroll", o);
    };
  }, []);
  const i = (g) => {
    l((o) => {
      const m = new Set(o);
      m.has(g) ? m.delete(g) : m.add(g);
      const k = Array.from(m), v = ta(window.location.search, k), y = `${window.location.pathname}?${v.toString()}`;
      if (window.history.replaceState(null, "", y), c) {
        const f = `/api/stay/hotel-list?${v.toString()}`;
        fetch(f, {
          headers: {
            Accept: "application/json"
          }
        }).then(async (u) => {
          if (!u.ok)
            throw new Error(`hotel list fetch failed: ${u.status}`);
          return u.json();
        }).then((u) => {
          n(u), l(Q(Z(u)));
        }).catch(() => {
        });
      }
      return m;
    });
  }, h = r.useMemo(() => {
    var v, y, f;
    const g = ((v = t.filterSections.find((u) => u.id === na)) == null ? void 0 : v.options.map((u) => u.id).filter((u) => s.has(u))) ?? [], o = ((y = t.filterSections.find((u) => u.id === sa)) == null ? void 0 : y.options) ?? [], m = ((f = t.filterSections.find((u) => u.id === ia)) == null ? void 0 : f.options.map((u) => u.id).filter((u) => s.has(u))) ?? [], k = o.filter((u) => s.has(u.id)).map((u) => Number.parseInt(u.id.replace("rating-", ""), 10)).filter((u) => !Number.isNaN(u));
    return {
      propertyTypeIds: g,
      locationIds: m,
      guestRatingThreshold: k.length > 0 ? Math.max(...k) : null,
      selectedOptionIds: Array.from(s)
    };
  }, [s, t.filterSections]), p = r.useMemo(() => aa(t.hotels, h), [h, t.hotels]);
  return /* @__PURE__ */ a.jsxs(a.Fragment, { children: [
    /* @__PURE__ */ a.jsx(
      Ge,
      {
        checkedOptionIds: s,
        mapButtonLabel: t.mapButtonLabel,
        onToggle: i,
        sections: t.filterSections
      }
    ),
    /* @__PURE__ */ a.jsx(ze, { hotels: p })
  ] });
};
export {
  Ce as D,
  oa as H,
  Ie as S,
  da as a,
  ua as b,
  ue as c,
  me as d,
  Pe as e,
  Oe as f,
  H as g,
  de as s
};
