import { a as o, j as i } from "./react-vendor-BoSfm_Te.js";
import { b as O } from "./feature-layout-MqEyxW8f.js";
import { r as He } from "./legacy-core-CYHwlLlr.js";
import { W as Ue } from "./feature-ui-DAUngKpP.js";
const Be = {
  monday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  sunday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
}, V = (e) => {
  const t = new Date(e);
  return t.setHours(0, 0, 0, 0), t.getTime();
}, B = (e) => {
  const t = new Date(e);
  return t.setDate(1), t.setHours(0, 0, 0, 0), t.getTime();
}, Ge = (e, t) => {
  const a = new Date(e);
  return a.setMonth(a.getMonth() + t, 1), B(a);
}, Ve = (e = {}) => {
  const t = e.checkIn ?? e.tempCheckIn ?? e.visibleMonth ?? Date.now(), a = B(e.visibleMonth ?? t);
  return {
    ...{
      isOpen: !1,
      activeTab: "calendar",
      visibleMonth: a,
      hoverDate: null,
      checkIn: null,
      checkOut: null,
      tempCheckIn: null,
      tempCheckOut: null,
      flexibleValue: null
    },
    ...e,
    visibleMonth: a
  };
}, qe = (e = "sunday") => Be[e], We = ({ tempCheckIn: e, tempCheckOut: t }, a) => {
  const n = V(a);
  return !e || t ? {
    tempCheckIn: n,
    tempCheckOut: null,
    hoverDate: null
  } : n < e ? {
    tempCheckIn: n,
    tempCheckOut: null,
    hoverDate: null
  } : n > e ? {
    tempCheckIn: e,
    tempCheckOut: n,
    hoverDate: null
  } : {
    tempCheckIn: e,
    tempCheckOut: t,
    hoverDate: null
  };
}, ze = (e, t) => t === "monday" ? e === 0 ? 6 : e - 1 : e, Ye = (e, t) => typeof t == "function" ? t(e) : `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}`, Ke = (e) => `${e.getFullYear()}년 ${e.getMonth() + 1}월 ${e.getDate()}일`, Je = ({
  visibleMonth: e,
  checkIn: t,
  checkOut: a,
  hoverDate: n,
  monthsToRender: s = 2,
  weekStartsOn: l = "sunday",
  weekdayLabels: r = null,
  monthLabelFormatter: c = null,
  today: m = V(Date.now())
}) => {
  const d = V(m), b = t && !a && n && n > t ? n : null, x = Array.isArray(r) && r.length === 7 ? r : qe(l);
  return Array.from({ length: s }, (p, I) => {
    const h = new Date(e);
    h.setMonth(h.getMonth() + I, 1);
    const y = h.getFullYear(), v = h.getMonth(), P = new Date(y, v, 1).getDay(), T = ze(P, l), f = new Date(y, v + 1, 0).getDate(), N = [];
    for (let k = 0; k < T; k += 1)
      N.push({
        key: `${y}-${v + 1}-outside-${k}`,
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
    for (let k = 1; k <= f; k += 1) {
      const D = new Date(y, v, k), j = V(D), E = t === j, C = a === j, g = b === j, A = E && !!(a || b) || C && !!t;
      N.push({
        key: `${y}-${v + 1}-${k}`,
        label: String(k),
        ariaLabel: Ke(D),
        timestamp: j,
        day: k,
        isOutside: !1,
        isDisabled: j < d,
        isToday: j === d,
        isSelected: E || C,
        isCheckIn: E,
        isCheckOut: C,
        isInRange: !!(t && a && j > t && j < a),
        isHoverRange: !!(b && t && j > t && j < b),
        isHoverEnd: g,
        hasRange: A
      });
    }
    return {
      key: `${y}-${v + 1}`,
      label: Ye(h, c),
      weekdays: x,
      days: N
    };
  });
}, xe = [
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
], K = (e) => e.trim().toLowerCase().replace(/\s+/g, ""), Xe = (e) => {
  const t = K(e);
  return t ? xe.find(
    (a) => a.aliases.some((n) => K(n) === t)
  ) ?? null : null;
}, Ze = (e) => {
  if (!e)
    return null;
  const t = K(e);
  return xe.find((a) => a.region === t) ?? null;
}, J = (e) => {
  if (!e)
    return null;
  const t = /^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());
  if (!t)
    return null;
  const a = Number(t[1]), n = Number(t[2]) - 1, s = Number(t[3]), l = new Date(a, n, s).getTime();
  return Number.isNaN(l) ? null : l;
}, X = (e) => {
  if (!e)
    return null;
  const t = new Date(e), a = t.getFullYear(), n = String(t.getMonth() + 1).padStart(2, "0"), s = String(t.getDate()).padStart(2, "0");
  return `${a}-${n}-${s}`;
}, z = (e, t, a) => {
  if (!e)
    return t;
  const n = Number.parseInt(e, 10);
  return Number.isNaN(n) ? t : Math.max(a, n);
}, Qe = (e) => {
  const t = new URLSearchParams(e).get("shell");
  return t === "main" || t === "stay" || t === "air" ? t : null;
}, ke = (e) => {
  const t = new URLSearchParams(e), a = t.get("keyword"), n = t.get("region"), s = Ze(n);
  return {
    destinationValue: (a == null ? void 0 : a.trim()) || (s == null ? void 0 : s.label) || "",
    guest: {
      adults: z(t.get("adults"), 1, 1),
      children: z(t.get("children"), 0, 0),
      rooms: z(t.get("rooms"), 1, 1)
    },
    calendar: {
      checkIn: J(t.get("checkIn")),
      checkOut: J(t.get("checkOut"))
    }
  };
}, et = (e, t = "") => {
  const a = {}, n = new URLSearchParams(t), s = Qe(t), l = e.destinationValue.trim(), r = l ? Xe(l) : null, c = X(e.calendar.checkIn), m = X(e.calendar.checkOut);
  s && (a.shell = s), l && (a.keyword = l), r && (a.region = r.region), c && (a.checkIn = c), m && (a.checkOut = m), a.adults = Math.max(1, e.guest.adults), a.children = Math.max(0, e.guest.children), a.rooms = Math.max(1, e.guest.rooms);
  const d = n.getAll("filter").filter((b) => b.trim() !== "");
  return d.length > 0 && (a.filter = d), a;
}, ve = o.createContext(null), tt = (e) => {
  var s, l, r, c, m;
  const t = Ve(), a = ((s = e == null ? void 0 : e.calendar) == null ? void 0 : s.checkIn) ?? null, n = ((l = e == null ? void 0 : e.calendar) == null ? void 0 : l.checkOut) ?? null;
  return {
    activeTab: "hotel",
    destinationValue: (e == null ? void 0 : e.destinationValue) ?? "",
    isDestinationOpen: !1,
    isGuestOpen: !1,
    guest: {
      rooms: Math.max(1, ((r = e == null ? void 0 : e.guest) == null ? void 0 : r.rooms) ?? 1),
      adults: Math.max(1, ((c = e == null ? void 0 : e.guest) == null ? void 0 : c.adults) ?? 1),
      children: Math.max(0, ((m = e == null ? void 0 : e.guest) == null ? void 0 : m.children) ?? 0)
    },
    calendar: {
      ...t,
      checkIn: a,
      checkOut: n,
      tempCheckIn: a,
      tempCheckOut: n,
      visibleMonth: a ? B(a) : t.visibleMonth
    }
  };
}, Z = (e, t) => {
  if (!e)
    return t;
  const a = new Date(e), n = a.getFullYear(), s = String(a.getMonth() + 1).padStart(2, "0"), l = String(a.getDate()).padStart(2, "0");
  return `${n}-${s}-${l}`;
}, at = (e, t) => {
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
      const a = e.guest[t.key] + t.delta;
      return a < {
        rooms: 1,
        adults: 1,
        children: 0
      }[t.key] ? e : {
        ...e,
        guest: {
          ...e.guest,
          [t.key]: a
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
          visibleMonth: e.calendar.checkIn ? B(e.calendar.checkIn) : e.calendar.visibleMonth
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
          visibleMonth: Ge(e.calendar.visibleMonth, t.delta)
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
      const a = We(
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
          ...a,
          activeTab: "calendar"
        }
      };
    }
    case "SET_CALENDAR_HOVER_DATE": {
      const a = t.timestamp && e.calendar.tempCheckIn && !e.calendar.tempCheckOut && t.timestamp > e.calendar.tempCheckIn ? t.timestamp : null;
      return {
        ...e,
        calendar: {
          ...e.calendar,
          hoverDate: a
        }
      };
    }
    case "CONFIRM_CALENDAR": {
      const a = e.calendar.tempCheckIn, n = e.calendar.tempCheckOut;
      return {
        ...e,
        calendar: {
          ...e.calendar,
          isOpen: !1,
          hoverDate: null,
          checkIn: a,
          checkOut: n,
          tempCheckIn: a,
          tempCheckOut: n,
          visibleMonth: a ? B(a) : e.calendar.visibleMonth
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
}, R = (e, t = null) => {
  t !== "destinationDropdown" && e({ type: "CLOSE_DESTINATION" }), t !== "guestPopupLarge" && e({ type: "CLOSE_GUEST" }), t !== "calendarPopup" && e({ type: "CLOSE_CALENDAR" });
}, we = ({ children: e, initialState: t }) => {
  const [a, n] = o.useReducer(at, t, tt);
  o.useEffect(() => {
    const u = () => {
      R(n);
    };
    return document.addEventListener("click", u), () => {
      document.removeEventListener("click", u);
    };
  }, []);
  const s = o.useCallback((u) => {
    u.stopPropagation();
  }, []), l = o.useCallback((u) => {
    R(n), n({ type: "SET_ACTIVE_TAB", tab: u });
  }, []), r = o.useCallback((u) => {
    n({ type: "SET_DESTINATION_VALUE", value: u });
  }, []), c = o.useCallback((u) => {
    u.stopPropagation(), R(n, "destinationDropdown"), n({ type: "TOGGLE_DESTINATION" });
  }, []), m = o.useCallback(
    (u) => {
      u.stopPropagation(), R(n, "destinationDropdown"), n({ type: "SET_DESTINATION_VALUE", value: u.currentTarget.value }), a.isDestinationOpen || n({ type: "TOGGLE_DESTINATION" });
    },
    [a.isDestinationOpen]
  ), d = o.useCallback((u) => {
    n({ type: "SET_DESTINATION_VALUE", value: u }), n({ type: "CLOSE_DESTINATION" });
  }, []), b = o.useCallback((u) => {
    u.stopPropagation(), R(n, "guestPopupLarge"), n({ type: "TOGGLE_GUEST" });
  }, []), x = o.useCallback((u, H, S) => {
    S.stopPropagation(), n({ type: "ADJUST_GUEST", key: u, delta: H });
  }, []), p = o.useCallback(
    (u) => {
      if (u.stopPropagation(), a.calendar.isOpen) {
        n({ type: "CONFIRM_CALENDAR" });
        return;
      }
      R(n, "calendarPopup"), n({ type: "OPEN_CALENDAR" });
    },
    [a.calendar.isOpen]
  ), I = o.useCallback(() => {
    n({ type: "SHIFT_CALENDAR_MONTH", delta: -1 });
  }, []), h = o.useCallback(() => {
    n({ type: "SHIFT_CALENDAR_MONTH", delta: 1 });
  }, []), y = o.useCallback((u) => {
    n({ type: "SET_CALENDAR_TAB", tab: u });
  }, []), v = o.useCallback((u) => {
    n({ type: "SET_FLEXIBLE_OPTION", value: u });
  }, []), P = o.useCallback((u) => {
    n({ type: "SELECT_CALENDAR_DATE", timestamp: u });
  }, []), T = o.useCallback((u) => {
    n({ type: "SET_CALENDAR_HOVER_DATE", timestamp: u });
  }, []), f = o.useCallback(() => {
    n({ type: "SET_CALENDAR_HOVER_DATE", timestamp: null });
  }, []), N = o.useCallback(() => {
    n({ type: "CLEAR_CALENDAR" });
  }, []), k = o.useCallback(() => {
    n({ type: "CONFIRM_CALENDAR" });
  }, []), D = o.useCallback(() => {
    R(n);
    const u = He(
      "SERVICES.STAY.HOTEL_LIST",
      et(
        {
          destinationValue: a.destinationValue,
          guest: a.guest,
          calendar: {
            checkIn: a.calendar.checkIn,
            checkOut: a.calendar.checkOut
          }
        },
        window.location.search
      )
    );
    window.location.assign(u);
  }, [
    a.calendar.checkIn,
    a.calendar.checkOut,
    a.destinationValue,
    a.guest
  ]), j = a.activeTab !== "activity", E = o.useMemo(() => {
    const u = [`성인 ${a.guest.adults}명`, `객실 ${a.guest.rooms}개`];
    return a.guest.children > 0 && u.push(`아동 ${a.guest.children}명`), u.join(", ");
  }, [a.guest.adults, a.guest.children, a.guest.rooms]), C = o.useMemo(() => {
    const u = a.calendar.isOpen ? a.calendar.tempCheckIn ?? a.calendar.checkIn : a.calendar.checkIn;
    return Z(u, "체크인");
  }, [a.calendar.checkIn, a.calendar.isOpen, a.calendar.tempCheckIn]), g = o.useMemo(() => {
    const u = a.calendar.isOpen ? a.calendar.tempCheckOut ?? a.calendar.checkOut : a.calendar.checkOut;
    return Z(u, "체크아웃");
  }, [a.calendar.checkOut, a.calendar.isOpen, a.calendar.tempCheckOut]), A = o.useMemo(() => ({
    state: a,
    isHotelMode: j,
    guestSummary: E,
    checkInLabel: C,
    checkOutLabel: g,
    setActiveTab: l,
    setDestinationValue: r,
    toggleDestination: c,
    openDestinationInput: m,
    selectDestination: d,
    toggleGuest: b,
    adjustGuest: x,
    toggleCalendar: p,
    showPreviousMonth: I,
    showNextMonth: h,
    setCalendarTab: y,
    selectFlexibleOption: v,
    selectCalendarDate: P,
    setCalendarHoverDate: T,
    clearCalendarHoverDate: f,
    clearCalendar: N,
    confirmCalendar: k,
    submitSearch: D,
    stopPropagation: s
  }), [
    a,
    j,
    E,
    C,
    g,
    l,
    r,
    c,
    m,
    d,
    b,
    x,
    p,
    I,
    h,
    y,
    v,
    P,
    T,
    f,
    N,
    k,
    D,
    s
  ]);
  return /* @__PURE__ */ i.jsx(ve.Provider, { value: A, children: e });
}, $ = () => {
  const e = o.useContext(ve);
  if (!e)
    throw new Error("HotelSearchWidget context missing");
  return e;
}, it = () => {
  const { state: e } = $();
  return /* @__PURE__ */ i.jsx("div", { className: `search-form-new${e.activeTab === "activity" ? "" : " hidden"}`, id: "searchFormActivity", children: /* @__PURE__ */ i.jsx("div", { className: "global-search-container", children: /* @__PURE__ */ i.jsxs("div", { className: "global-search-bar", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "search-item destination-item-new", id: "destinationFieldActivity", children: [
      /* @__PURE__ */ i.jsx("div", { className: "item-icon", children: /* @__PURE__ */ i.jsx(O, { className: "search-field-icon", name: "search" }) }),
      /* @__PURE__ */ i.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ i.jsx("label", { className: "item-label", children: "떠나고 싶은 곳" }),
        /* @__PURE__ */ i.jsx(
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
    /* @__PURE__ */ i.jsx("div", { className: "search-btn-wrapper", children: /* @__PURE__ */ i.jsxs("button", { className: "search-btn-pill", id: "searchBtnActivity", children: [
      /* @__PURE__ */ i.jsx(O, { className: "search-btn-icon", name: "search" }),
      /* @__PURE__ */ i.jsx("span", { className: "search-btn-text", children: "검색" })
    ] }) })
  ] }) }) });
}, nt = ({
  popupId: e,
  monthsContainerId: t,
  panelCalendarId: a,
  panelFlexibleId: n,
  prevButtonId: s,
  nextButtonId: l,
  clearButtonId: r,
  confirmButtonId: c,
  tabCalendarId: m,
  tabFlexibleId: d,
  flexibleOptions: b,
  calendar: x,
  onInteract: p,
  onClear: I,
  onConfirm: h,
  onPreviousMonth: y,
  onNextMonth: v,
  onTabChange: P,
  onFlexibleOptionSelect: T,
  onDateSelect: f,
  onDateHover: N,
  onDateHoverLeave: k,
  dialogLabel: D = "체크인 날짜 선택 달력",
  weekStartsOn: j = "sunday",
  weekdayLabels: E = null,
  monthLabelFormatter: C = null,
  monthsToRender: g = 2,
  footerStartContent: A = null
}) => {
  const u = x.activeTab === "calendar", H = o.useMemo(() => Je({
    visibleMonth: x.visibleMonth,
    checkIn: x.tempCheckIn,
    checkOut: x.tempCheckOut,
    hoverDate: x.hoverDate,
    monthsToRender: g,
    weekStartsOn: j,
    weekdayLabels: E,
    monthLabelFormatter: C
  }), [
    x.hoverDate,
    x.tempCheckIn,
    x.tempCheckOut,
    x.visibleMonth,
    C,
    g,
    j,
    E
  ]);
  return /* @__PURE__ */ i.jsx(
    "div",
    {
      "aria-label": D,
      "aria-modal": "true",
      className: `Popup RangePicker RangePicker--checkIn RangePicker--with-dayuse${x.isOpen ? " active" : ""}`,
      id: e,
      onClick: p,
      role: "dialog",
      children: /* @__PURE__ */ i.jsxs("div", { className: "Popup__content Popup__content_Occupancy", children: [
        /* @__PURE__ */ i.jsx("span", { className: "ScreenReaderOnly", children: "엔터 키를 눌러 캘린더를 여세요. 방향키를 사용해 체크인 및 체크아웃 날짜를 탐색할 수 있습니다." }),
        /* @__PURE__ */ i.jsxs("div", { className: "RangePicker-Header", children: [
          /* @__PURE__ */ i.jsx("div", { className: "RangePicker-NavPrev", children: /* @__PURE__ */ i.jsx(
            "button",
            {
              "aria-label": "이전 달",
              className: "NavBtn NavBtn--prev",
              id: s,
              onClick: y,
              type: "button",
              children: /* @__PURE__ */ i.jsx(O, { className: "calendar-nav-icon", name: "chevron-left" })
            }
          ) }),
          /* @__PURE__ */ i.jsxs("div", { className: "RangePicker-Tabs", role: "tablist", children: [
            /* @__PURE__ */ i.jsxs("div", { className: "RangePicker-Tab Item", children: [
              /* @__PURE__ */ i.jsx(
                "button",
                {
                  "aria-selected": u,
                  className: `TabBtn${u ? " active" : ""}`,
                  "data-lang": "calTitle",
                  id: m,
                  onClick: () => {
                    P("calendar");
                  },
                  role: "tab",
                  type: "button",
                  children: "캘린더"
                }
              ),
              /* @__PURE__ */ i.jsx("div", { className: "TabIndicator" })
            ] }),
            /* @__PURE__ */ i.jsx("div", { className: "RangePicker-Tab Item", children: /* @__PURE__ */ i.jsx(
              "button",
              {
                "aria-selected": !u,
                className: `TabBtn${u ? "" : " active"}`,
                "data-lang": "calFlexible",
                id: d,
                onClick: () => {
                  P("flexible");
                },
                role: "tab",
                type: "button",
                children: "날짜 미정"
              }
            ) })
          ] }),
          /* @__PURE__ */ i.jsx("div", { className: "RangePicker-NavNext", children: /* @__PURE__ */ i.jsx(
            "button",
            {
              "aria-label": "다음 달",
              className: "NavBtn NavBtn--next",
              id: l,
              onClick: v,
              type: "button",
              children: /* @__PURE__ */ i.jsx(O, { className: "calendar-nav-icon", name: "chevron-right" })
            }
          ) })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: `RangePicker-Panel${u ? " active" : ""}`, id: a, role: "tabpanel", children: [
          /* @__PURE__ */ i.jsx("div", { className: "DayPicker", id: "dayPickerContainer", onMouseLeave: k, children: /* @__PURE__ */ i.jsx("div", { className: "DayPicker-wrapper", children: /* @__PURE__ */ i.jsx("div", { className: "DayPicker-Months", id: t, children: H.map((S) => /* @__PURE__ */ i.jsxs("div", { className: "DayPicker-Month", children: [
            /* @__PURE__ */ i.jsx("div", { className: "DayPicker-Caption", children: S.label }),
            /* @__PURE__ */ i.jsx("div", { className: "DayPicker-Weekdays", children: S.weekdays.map((w) => /* @__PURE__ */ i.jsx("div", { className: "DayPicker-Weekday", children: w }, `${S.key}-${w}`)) }),
            /* @__PURE__ */ i.jsx("div", { className: "DayPicker-Body", children: S.days.map((w) => {
              const L = ["DayPicker-Day"];
              return w.isOutside && L.push("DayPicker-Day--outside"), w.isDisabled && L.push("DayPicker-Day--disabled"), w.isToday && L.push("DayPicker-Day--today"), w.isSelected && L.push("DayPicker-Day--selected"), w.isCheckIn && L.push("DayPicker-Day--checkIn"), w.isCheckOut && L.push("DayPicker-Day--checkOut"), w.isInRange && L.push("DayPicker-Day--inRange"), w.isHoverRange && L.push("DayPicker-Day--hoverRange"), w.isHoverEnd && L.push("DayPicker-Day--hoverEnd"), w.hasRange && L.push("DayPicker-Day--hasRange"), w.isOutside || w.timestamp === null ? /* @__PURE__ */ i.jsx("div", { "aria-hidden": "true", className: L.join(" ") }, w.key) : /* @__PURE__ */ i.jsx(
                "button",
                {
                  "aria-label": w.ariaLabel,
                  className: L.join(" "),
                  "data-day": w.day ?? void 0,
                  "data-timestamp": w.timestamp,
                  disabled: w.isDisabled,
                  onClick: () => {
                    f(w.timestamp);
                  },
                  onMouseEnter: () => {
                    N(w.timestamp);
                  },
                  type: "button",
                  children: w.label
                },
                w.key
              );
            }) })
          ] }, S.key)) }) }) }),
          /* @__PURE__ */ i.jsxs("div", { className: "RangePicker-Footer", children: [
            A ? /* @__PURE__ */ i.jsx("div", { className: "RangePicker-FooterMeta", children: A }) : null,
            /* @__PURE__ */ i.jsxs("div", { className: "RangePicker-FooterActions", children: [
              /* @__PURE__ */ i.jsx("button", { className: "ActionBtn ActionBtn--clear", id: r, onClick: I, type: "button", children: /* @__PURE__ */ i.jsx("span", { "data-lang": "btnReset", children: "선택 해제" }) }),
              /* @__PURE__ */ i.jsx("button", { className: "ActionBtn ActionBtn--confirm", id: c, onClick: h, type: "button", children: /* @__PURE__ */ i.jsx("span", { "data-lang": "btnConfirm", children: "확인" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ i.jsx("div", { className: `RangePicker-Panel${u ? "" : " active"}`, id: n, role: "tabpanel", children: /* @__PURE__ */ i.jsxs("div", { className: "Flexible-Content", children: [
          /* @__PURE__ */ i.jsx("h3", { "data-lang": "calFlexTitle", children: "투숙 기간은 얼마나 되시나요?" }),
          /* @__PURE__ */ i.jsx("div", { className: "Flexible-Options", children: b.map((S) => /* @__PURE__ */ i.jsx(
            "button",
            {
              className: `Flexible-Option${x.flexibleValue === S.value ? " active" : ""}`,
              "data-lang": S.dataLang,
              "data-val": S.value,
              onClick: () => {
                T(S.value);
              },
              type: "button",
              children: S.label
            },
            S.value
          )) })
        ] }) })
      ] })
    }
  );
}, st = [
  { tab: "hotel", icon: "building-2", dataLang: "tabHotel", label: "호텔 & 리조트" },
  { tab: "pension", icon: "home", dataLang: "tabPension", label: "펜션 & 풀빌라" },
  { tab: "activity", icon: "compass", dataLang: "tabActivity", label: "즐길거리" }
], rt = [
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
], lt = [
  { value: "3", dataLang: "calFlex3", label: "3박" },
  { value: "7", dataLang: "calFlex7", label: "1주일" },
  { value: "30", dataLang: "calFlex30", label: "1개월" }
], ot = [
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
], ct = ["일", "월", "화", "수", "목", "금", "토"], dt = (e) => `${e.getFullYear()}년 ${e.getMonth() + 1}월`, Ie = () => {
  const {
    state: e,
    stopPropagation: t,
    showPreviousMonth: a,
    showNextMonth: n,
    setCalendarTab: s,
    selectFlexibleOption: l,
    selectCalendarDate: r,
    setCalendarHoverDate: c,
    clearCalendarHoverDate: m,
    clearCalendar: d,
    confirmCalendar: b
  } = $();
  return /* @__PURE__ */ i.jsx(
    nt,
    {
      calendar: e.calendar,
      clearButtonId: "btn-clear",
      confirmButtonId: "btn-confirm",
      flexibleOptions: lt,
      monthLabelFormatter: dt,
      monthsContainerId: "calendarMonths",
      nextButtonId: "nextMonth",
      onClear: d,
      onConfirm: b,
      onDateHover: c,
      onDateHoverLeave: m,
      onDateSelect: r,
      onFlexibleOptionSelect: l,
      onInteract: t,
      onNextMonth: n,
      onPreviousMonth: a,
      onTabChange: s,
      panelCalendarId: "panel-calendar",
      panelFlexibleId: "panel-flexible",
      popupId: "calendarPopup",
      prevButtonId: "prevMonth",
      tabCalendarId: "tab-calendar",
      tabFlexibleId: "tab-flexible",
      weekStartsOn: "sunday",
      weekdayLabels: ct
    }
  );
}, ut = ({
  dropdownId: e,
  isOpen: t,
  columns: a,
  onInteract: n,
  onSelect: s
}) => /* @__PURE__ */ i.jsx("div", { className: `destination-dropdown${t ? " active" : ""}`, id: e, onClick: n, children: /* @__PURE__ */ i.jsx("div", { className: "dropdown-columns", children: a.map((l) => /* @__PURE__ */ i.jsxs("div", { className: "dropdown-column", children: [
  /* @__PURE__ */ i.jsx("div", { className: "dropdown-header", "data-lang": l.titleLang, children: l.title }),
  /* @__PURE__ */ i.jsx("ul", { className: "destination-list", children: l.items.map((r) => /* @__PURE__ */ i.jsxs(
    "li",
    {
      className: "destination-item",
      "data-value": r.value,
      onClick: () => {
        s(r.value);
      },
      children: [
        /* @__PURE__ */ i.jsx("img", { alt: r.alt, src: r.image }),
        /* @__PURE__ */ i.jsxs("div", { className: "destination-info", children: [
          /* @__PURE__ */ i.jsx("span", { className: "destination-name", "data-lang": r.nameLang, children: r.name }),
          /* @__PURE__ */ i.jsx("span", { className: "destination-count", children: r.count }),
          /* @__PURE__ */ i.jsx("span", { className: "destination-desc", "data-lang": r.descLang, children: r.desc })
        ] })
      ]
    },
    r.value
  )) })
] }, l.title)) }) }), je = () => {
  const { state: e, selectDestination: t, stopPropagation: a } = $();
  return /* @__PURE__ */ i.jsx(
    ut,
    {
      columns: rt,
      dropdownId: "destinationDropdown",
      isOpen: e.isDestinationOpen,
      onInteract: a,
      onSelect: t
    }
  );
}, mt = ({ popupId: e, isOpen: t, rows: a, values: n, onAdjust: s, onInteract: l }) => /* @__PURE__ */ i.jsx("div", { className: `guest-popup-new${t ? " active" : ""}`, id: e, onClick: l, children: a.map((r) => /* @__PURE__ */ i.jsxs("div", { className: "guest-row-new", children: [
  /* @__PURE__ */ i.jsxs("div", { className: "guest-info-new", children: [
    /* @__PURE__ */ i.jsx("span", { className: "guest-type-new", "data-lang": r.titleLang, children: r.title }),
    r.description ? /* @__PURE__ */ i.jsx("span", { className: "guest-desc-new", "data-lang": r.descriptionLang, children: r.description }) : null
  ] }),
  /* @__PURE__ */ i.jsxs("div", { className: "guest-counter-new", children: [
    /* @__PURE__ */ i.jsx(
      "button",
      {
        className: "counter-btn-new minus",
        "data-target": r.key,
        onClick: (c) => {
          s(r.key, -1, c);
        },
        type: "button",
        children: /* @__PURE__ */ i.jsx(O, { className: "counter-icon", name: "minus" })
      }
    ),
    /* @__PURE__ */ i.jsx("span", { className: "counter-value-new", id: `${r.key}CountLarge`, children: n[r.key] ?? Number(r.defaultValue ?? "0") }),
    /* @__PURE__ */ i.jsx(
      "button",
      {
        className: "counter-btn-new plus",
        "data-target": r.key,
        onClick: (c) => {
          s(r.key, 1, c);
        },
        type: "button",
        children: /* @__PURE__ */ i.jsx(O, { className: "counter-icon", name: "plus" })
      }
    )
  ] })
] }, r.key)) }), Ne = () => {
  const { state: e, adjustGuest: t, stopPropagation: a } = $();
  return /* @__PURE__ */ i.jsx(
    mt,
    {
      isOpen: e.isGuestOpen,
      onAdjust: (n, s, l) => {
        t(n, s, l);
      },
      onInteract: a,
      popupId: "guestPopupLarge",
      rows: ot,
      values: e.guest
    }
  );
}, pt = () => {
  const {
    state: e,
    checkInLabel: t,
    checkOutLabel: a,
    guestSummary: n,
    setDestinationValue: s,
    openDestinationInput: l,
    toggleDestination: r,
    toggleGuest: c,
    toggleCalendar: m,
    submitSearch: d
  } = $();
  return /* @__PURE__ */ i.jsx("div", { className: `search-form-new${e.activeTab === "activity" ? " hidden" : ""}`, id: "searchFormHotel", children: /* @__PURE__ */ i.jsx("div", { className: "global-search-container", children: /* @__PURE__ */ i.jsxs("div", { className: "global-search-bar", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "search-item destination-item-new", id: "destinationFieldLarge", onClick: r, children: [
      /* @__PURE__ */ i.jsx("div", { className: "item-icon", children: /* @__PURE__ */ i.jsx(O, { className: "search-field-icon", name: "search" }) }),
      /* @__PURE__ */ i.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ i.jsx("label", { className: "item-label", "data-lang": "destLabel", children: "여행지" }),
        /* @__PURE__ */ i.jsx(
          "input",
          {
            autoComplete: "off",
            className: "item-input",
            "data-lang-placeholder": "destPlaceholder",
            id: "destinationInput",
            placeholder: "어디로 떠나시나요?",
            type: "text",
            value: e.destinationValue,
            onChange: (b) => {
              s(b.target.value);
            },
            onClick: l
          }
        )
      ] }),
      /* @__PURE__ */ i.jsx(je, {})
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ i.jsxs("div", { className: "search-item date-item-new", id: "checkInField", onClick: m, children: [
      /* @__PURE__ */ i.jsx("div", { className: "item-icon", children: /* @__PURE__ */ i.jsx(O, { className: "search-field-icon", name: "calendar" }) }),
      /* @__PURE__ */ i.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ i.jsx("label", { className: "item-label", "data-lang": "dateLabel", children: "체크인 - 체크아웃" }),
        /* @__PURE__ */ i.jsxs("div", { className: "date-display-text", children: [
          /* @__PURE__ */ i.jsx("span", { "data-lang": "dateSelect", id: "checkInDisplay", children: t }),
          /* @__PURE__ */ i.jsx("span", { className: "date-separator", children: " - " }),
          /* @__PURE__ */ i.jsx("span", { "data-lang": "dateSelect", id: "checkOutDisplay", children: a })
        ] })
      ] }),
      /* @__PURE__ */ i.jsx(Ie, {})
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ i.jsxs("div", { className: "search-item guest-item-new", id: "guestFieldLarge", onClick: c, children: [
      /* @__PURE__ */ i.jsx("div", { className: "item-icon", children: /* @__PURE__ */ i.jsx(O, { className: "search-field-icon", name: "users" }) }),
      /* @__PURE__ */ i.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ i.jsx("label", { className: "item-label", "data-lang": "guestLabel", children: "여행자" }),
        /* @__PURE__ */ i.jsx("div", { className: "guest-display-text", children: /* @__PURE__ */ i.jsx("span", { id: "guestSummary", children: n }) })
      ] }),
      /* @__PURE__ */ i.jsx(Ne, {})
    ] }),
    /* @__PURE__ */ i.jsx("div", { className: "search-btn-wrapper", children: /* @__PURE__ */ i.jsxs("button", { className: "search-btn-pill", id: "searchBtn", onClick: d, type: "button", children: [
      /* @__PURE__ */ i.jsx(O, { className: "search-btn-icon", name: "search" }),
      /* @__PURE__ */ i.jsx("span", { className: "search-btn-text", "data-lang": "searchBtn", children: "검색" })
    ] }) })
  ] }) }) });
}, ht = ({ activeTab: e, items: t, onTabChange: a, onInteract: n }) => /* @__PURE__ */ i.jsx("div", { className: "search-tabs-large", onClick: n, children: t.map((s) => /* @__PURE__ */ i.jsxs(
  "button",
  {
    className: `search-tab-large${e === s.tab ? " active" : ""}`,
    "data-tab": s.tab,
    onClick: () => {
      a(s.tab);
    },
    type: "button",
    children: [
      /* @__PURE__ */ i.jsx(O, { className: "search-tab-icon", name: s.icon }),
      /* @__PURE__ */ i.jsx("span", { "data-lang": s.dataLang, children: s.label })
    ]
  },
  s.tab
)) }), gt = () => {
  const { state: e, setActiveTab: t, stopPropagation: a } = $();
  return /* @__PURE__ */ i.jsx(
    ht,
    {
      activeTab: e.activeTab,
      items: st,
      onInteract: a,
      onTabChange: (n) => {
        t(n);
      }
    }
  );
}, bt = () => /* @__PURE__ */ i.jsx(we, { children: /* @__PURE__ */ i.jsxs("div", { className: "search-widget-large", children: [
  /* @__PURE__ */ i.jsx(gt, {}),
  /* @__PURE__ */ i.jsx(pt, {}),
  /* @__PURE__ */ i.jsx(it, {})
] }) }), ft = "jeju:hotel-search-widget-mounted", yt = "jeju:search-widget-mounted", ta = () => (o.useLayoutEffect(() => {
  const e = window.lucide;
  e != null && e.createIcons && e.createIcons(), document.dispatchEvent(new Event(yt)), document.dispatchEvent(new Event(ft));
}, []), /* @__PURE__ */ i.jsx(bt, {})), xt = () => {
  const {
    state: e,
    checkInLabel: t,
    checkOutLabel: a,
    guestSummary: n,
    setDestinationValue: s,
    openDestinationInput: l,
    toggleDestination: r,
    toggleGuest: c,
    toggleCalendar: m,
    submitSearch: d
  } = $();
  return /* @__PURE__ */ i.jsx("div", { className: "search-form-new hotel-list-search-form", id: "hotelListSearchForm", children: /* @__PURE__ */ i.jsx("div", { className: "global-search-container", children: /* @__PURE__ */ i.jsxs("div", { className: "global-search-bar hotel-list-search-bar", children: [
    /* @__PURE__ */ i.jsxs(
      "div",
      {
        className: "search-item destination-item-new hotel-list-search-item",
        id: "hotelListDestinationField",
        onClick: r,
        children: [
          /* @__PURE__ */ i.jsx("div", { className: "item-icon", children: /* @__PURE__ */ i.jsx(O, { className: "search-field-icon", name: "search" }) }),
          /* @__PURE__ */ i.jsxs("div", { className: "item-content", children: [
            /* @__PURE__ */ i.jsx("label", { className: "item-label", htmlFor: "hotelListDestinationInput", children: "여행지" }),
            /* @__PURE__ */ i.jsx(
              "input",
              {
                autoComplete: "off",
                className: "item-input",
                id: "hotelListDestinationInput",
                placeholder: "도시, 지역, 숙소명을 검색하세요",
                type: "text",
                value: e.destinationValue,
                onChange: (b) => {
                  s(b.target.value);
                },
                onClick: l
              }
            )
          ] }),
          /* @__PURE__ */ i.jsx(je, {})
        ]
      }
    ),
    /* @__PURE__ */ i.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ i.jsxs(
      "div",
      {
        className: "search-item date-item-new hotel-list-search-item",
        id: "hotelListCheckInField",
        onClick: m,
        children: [
          /* @__PURE__ */ i.jsx("div", { className: "item-icon", children: /* @__PURE__ */ i.jsx(O, { className: "search-field-icon", name: "calendar" }) }),
          /* @__PURE__ */ i.jsxs("div", { className: "item-content", children: [
            /* @__PURE__ */ i.jsx("label", { className: "item-label", children: "숙박 일정" }),
            /* @__PURE__ */ i.jsxs("div", { className: "date-display-text", children: [
              /* @__PURE__ */ i.jsx("span", { id: "hotelListCheckInDisplay", children: t }),
              /* @__PURE__ */ i.jsx("span", { className: "date-separator", children: " - " }),
              /* @__PURE__ */ i.jsx("span", { id: "hotelListCheckOutDisplay", children: a })
            ] })
          ] }),
          /* @__PURE__ */ i.jsx(Ie, {})
        ]
      }
    ),
    /* @__PURE__ */ i.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ i.jsxs(
      "div",
      {
        className: "search-item guest-item-new hotel-list-search-item",
        id: "hotelListGuestField",
        onClick: c,
        children: [
          /* @__PURE__ */ i.jsx("div", { className: "item-icon", children: /* @__PURE__ */ i.jsx(O, { className: "search-field-icon", name: "users" }) }),
          /* @__PURE__ */ i.jsxs("div", { className: "item-content", children: [
            /* @__PURE__ */ i.jsx("label", { className: "item-label", children: "투숙 인원" }),
            /* @__PURE__ */ i.jsx("div", { className: "guest-display-text", children: /* @__PURE__ */ i.jsx("span", { id: "hotelListGuestSummary", children: n }) })
          ] }),
          /* @__PURE__ */ i.jsx(Ne, {})
        ]
      }
    ),
    /* @__PURE__ */ i.jsx("div", { className: "search-btn-wrapper", children: /* @__PURE__ */ i.jsxs(
      "button",
      {
        className: "search-btn-pill hotel-list-search-submit",
        id: "hotelListSearchBtn",
        onClick: d,
        type: "button",
        children: [
          /* @__PURE__ */ i.jsx(O, { className: "search-btn-icon", name: "search" }),
          /* @__PURE__ */ i.jsx("span", { className: "search-btn-text", children: "검색" })
        ]
      }
    ) })
  ] }) }) });
}, kt = () => {
  const e = o.useMemo(() => {
    if (!(typeof window > "u"))
      return ke(window.location.search);
  }, []);
  return /* @__PURE__ */ i.jsx(we, { initialState: e, children: /* @__PURE__ */ i.jsx("div", { className: "search-widget-large hotel-list-search-widget", children: /* @__PURE__ */ i.jsx(xt, {}) }) });
}, aa = () => /* @__PURE__ */ i.jsx(kt, {}), Le = ({ checkedOptionIds: e, onToggle: t, section: a }) => /* @__PURE__ */ i.jsxs("div", { className: "filter-section", children: [
  /* @__PURE__ */ i.jsx("h3", { className: "filter-title", children: a.title }),
  /* @__PURE__ */ i.jsx("div", { className: "filter-items", children: a.options.map((n) => {
    const s = e.has(n.id);
    return /* @__PURE__ */ i.jsxs("label", { className: "filter-checkbox", children: [
      /* @__PURE__ */ i.jsx(
        "input",
        {
          checked: s,
          onChange: () => {
            t(n.id);
          },
          type: "checkbox"
        }
      ),
      /* @__PURE__ */ i.jsxs("span", { children: [
        n.label,
        typeof n.count == "number" ? /* @__PURE__ */ i.jsxs("span", { className: "count", children: [
          "(",
          n.count,
          ")"
        ] }) : null,
        n.description ? /* @__PURE__ */ i.jsx("span", { className: "filter-option-description", children: n.description }) : null
      ] })
    ] }, n.id);
  }) })
] }), Q = 1e3, ee = 24, te = (e) => e.toLocaleString("ko-KR"), ae = (e) => {
  const t = Number.parseInt(e.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(t) ? 0 : t;
}, ie = ({
  checkedOptionIds: e,
  mapButtonLabel: t,
  onPriceChange: a,
  onToggle: n,
  popularSection: s,
  priceBounds: l,
  priceRange: r
}) => {
  const c = o.useMemo(() => {
    const m = Math.max(1, l.max - l.min);
    return {
      left: (r.min - l.min) / m * 100,
      right: (l.max - r.max) / m * 100
    };
  }, [l.max, l.min, r.max, r.min]);
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsxs("div", { className: "map-banner-widget", children: [
      /* @__PURE__ */ i.jsx("div", { className: "map-bg" }),
      /* @__PURE__ */ i.jsx("button", { className: "map-btn", type: "button", children: t })
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "filter-section", children: [
      /* @__PURE__ */ i.jsx("h3", { className: "filter-title", children: "1박당 요금" }),
      /* @__PURE__ */ i.jsxs("div", { className: "price-slider-wrapper", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "range-slider-mock", children: [
          /* @__PURE__ */ i.jsx("div", { className: "range-bar", style: { left: `${c.left}%`, right: `${c.right}%` } }),
          /* @__PURE__ */ i.jsx(
            "input",
            {
              "aria-label": "최저 가격",
              className: "range-input range-input-min",
              max: l.max,
              min: l.min,
              onChange: (m) => {
                const d = Math.min(Number(m.target.value), r.max);
                a({
                  min: d,
                  max: r.max
                });
              },
              step: Q,
              type: "range",
              value: r.min
            }
          ),
          /* @__PURE__ */ i.jsx(
            "input",
            {
              "aria-label": "최대 가격",
              className: "range-input range-input-max",
              max: l.max,
              min: l.min,
              onChange: (m) => {
                const d = Math.max(Number(m.target.value), r.min);
                a({
                  min: r.min,
                  max: d
                });
              },
              step: Q,
              type: "range",
              value: r.max
            }
          )
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "price-inputs", children: [
          /* @__PURE__ */ i.jsxs("label", { className: "price-box", children: [
            /* @__PURE__ */ i.jsx("span", { children: "₩" }),
            /* @__PURE__ */ i.jsx(
              "input",
              {
                inputMode: "numeric",
                onChange: (m) => {
                  const d = Math.min(ae(m.target.value), r.max);
                  a({
                    min: d,
                    max: r.max
                  });
                },
                value: te(r.min)
              }
            )
          ] }),
          /* @__PURE__ */ i.jsxs("label", { className: "price-box", children: [
            /* @__PURE__ */ i.jsx("span", { children: "₩" }),
            /* @__PURE__ */ i.jsx(
              "input",
              {
                inputMode: "numeric",
                onChange: (m) => {
                  const d = Math.max(ae(m.target.value), r.min);
                  a({
                    min: r.min,
                    max: d
                  });
                },
                value: te(r.max)
              }
            )
          ] })
        ] })
      ] })
    ] }),
    s ? /* @__PURE__ */ i.jsx(
      Le,
      {
        checkedOptionIds: e,
        onToggle: n,
        section: s
      }
    ) : null
  ] });
}, vt = ({
  checkedOptionIds: e,
  mapButtonLabel: t,
  onPriceChange: a,
  onToggle: n,
  priceBounds: s,
  priceRange: l,
  sections: r
}) => {
  const c = o.useRef(null), m = o.useRef(null), d = o.useRef(null), [b, x] = o.useState({
    active: !1,
    left: 0,
    mode: "fixed",
    top: 0,
    width: 0
  }), p = r.find((h) => h.id === "popular"), I = r.filter((h) => h.id !== "popular");
  return o.useEffect(() => {
    const h = () => {
      const y = d.current, v = c.current, P = m.current;
      if (!y || !v || !P)
        return;
      const T = document.querySelector(".header.hotel-shell-header"), f = document.getElementById("stickySearch"), N = document.querySelector(".load-more-container.pagination-container") ?? document.querySelector(".pagination-container") ?? document.querySelector(".load-more-container"), k = ((T == null ? void 0 : T.offsetHeight) ?? 72) + ((f == null ? void 0 : f.clientHeight) ?? 72) + 24, D = y.getBoundingClientRect(), j = v.getBoundingClientRect(), E = P.offsetHeight, C = j.bottom <= k, g = window.scrollY + D.top, A = N == null ? void 0 : N.getBoundingClientRect(), u = typeof (A == null ? void 0 : A.top) == "number" ? window.scrollY + A.top : null, H = window.scrollY + k + E, S = C && typeof u == "number" && H + ee >= u, w = typeof u == "number" ? Math.max(0, u - g - E - ee) : k, L = {
        active: C,
        left: S ? 0 : D.left,
        mode: S ? "absolute" : "fixed",
        top: S ? w : k,
        width: D.width
      };
      x((F) => F.active === L.active && F.left === L.left && F.mode === L.mode && F.top === L.top && F.width === L.width ? F : L);
    };
    return h(), window.addEventListener("scroll", h, { passive: !0 }), window.addEventListener("resize", h), () => {
      window.removeEventListener("scroll", h), window.removeEventListener("resize", h);
    };
  }, []), /* @__PURE__ */ i.jsxs("aside", { className: "filter-sidebar", ref: d, children: [
    /* @__PURE__ */ i.jsxs("div", { className: "filter-sidebar-original-content", ref: c, children: [
      /* @__PURE__ */ i.jsx("div", { className: "filter-sidebar-sticky-source", ref: m, children: /* @__PURE__ */ i.jsx(
        ie,
        {
          checkedOptionIds: e,
          mapButtonLabel: t,
          onPriceChange: a,
          onToggle: n,
          popularSection: p,
          priceBounds: s,
          priceRange: l
        }
      ) }),
      I.map((h) => /* @__PURE__ */ i.jsx(
        Le,
        {
          checkedOptionIds: e,
          onToggle: n,
          section: h
        },
        h.id
      ))
    ] }),
    /* @__PURE__ */ i.jsx(
      "div",
      {
        className: `filter-sidebar-sticky-overlay${b.active ? " is-visible" : ""}`,
        style: {
          left: `${b.left}px`,
          position: b.mode,
          top: `${b.top}px`,
          width: `${b.width}px`
        },
        children: /* @__PURE__ */ i.jsx(
          ie,
          {
            checkedOptionIds: e,
            mapButtonLabel: t,
            onPriceChange: a,
            onToggle: n,
            popularSection: p,
            priceBounds: s,
            priceRange: l
          }
        )
      }
    )
  ] });
}, wt = {
  Exceptional: "최고",
  Excellent: "우수",
  Great: "좋은",
  "Very Good": "양호",
  Good: "좋은"
}, It = ({ hotel: e }) => {
  const t = o.useMemo(() => ({
    id: e.id,
    name: e.title,
    image: e.imageUrl,
    location: e.location,
    price: e.currentPrice
  }), [e.currentPrice, e.id, e.imageUrl, e.location, e.title]), [a, n] = o.useState(() => window.FABState ? window.FABState.isInWishlist(t.id) : !1), s = wt[e.reviewLabel] ?? e.reviewLabel, l = e.badge.trim().length > 0;
  return o.useEffect(() => {
    if (!window.FABState)
      return;
    const r = () => {
      var c;
      n(((c = window.FABState) == null ? void 0 : c.isInWishlist(t.id)) ?? !1);
    };
    return r(), document.addEventListener("fabWishlistUpdated", r), () => {
      document.removeEventListener("fabWishlistUpdated", r);
    };
  }, [t.id]), /* @__PURE__ */ i.jsxs("article", { className: "hotel-card-premium", children: [
    /* @__PURE__ */ i.jsxs("div", { className: "hotel-card-image", children: [
      /* @__PURE__ */ i.jsx("img", { alt: e.title, decoding: "async", loading: "lazy", src: e.imageUrl }),
      l ? /* @__PURE__ */ i.jsx("span", { className: "badge-overlay", children: e.badge }) : null,
      /* @__PURE__ */ i.jsx(
        Ue,
        {
          active: a,
          ariaLabel: `${e.title} 찜하기`,
          className: "wishlist-btn--premium",
          onToggle: (r) => {
            if (!window.FABState) {
              n(r);
              return;
            }
            window.FABState.addToWishlist(t), n(window.FABState.isInWishlist(t.id));
          }
        }
      )
    ] }),
    /* @__PURE__ */ i.jsxs("div", { className: "hotel-card-content", children: [
      /* @__PURE__ */ i.jsxs("div", { className: "hotel-card-header", children: [
        /* @__PURE__ */ i.jsxs("div", { className: "hotel-title-group", children: [
          /* @__PURE__ */ i.jsx("h3", { children: e.title }),
          /* @__PURE__ */ i.jsx("div", { className: "hotel-stars", children: e.stars })
        ] }),
        /* @__PURE__ */ i.jsxs("div", { className: "review-badge", children: [
          /* @__PURE__ */ i.jsx("span", { className: "score", children: e.reviewScore }),
          /* @__PURE__ */ i.jsx("small", { children: s })
        ] })
      ] }),
      /* @__PURE__ */ i.jsxs("div", { className: "hotel-location-text", children: [
        /* @__PURE__ */ i.jsx(O, { className: "hotel-location-icon", name: "map" }),
        /* @__PURE__ */ i.jsx("span", { children: e.location })
      ] }),
      /* @__PURE__ */ i.jsx("div", { className: "hotel-tags", children: e.tags.map((r) => /* @__PURE__ */ i.jsx("span", { className: "tag-item", children: r }, `${e.id}-${r}`)) }),
      /* @__PURE__ */ i.jsxs("div", { className: "hotel-price-zone", children: [
        /* @__PURE__ */ i.jsx("div", { className: "price-original", children: e.originalPrice }),
        /* @__PURE__ */ i.jsx("div", { className: "price-current", children: e.currentPrice }),
        /* @__PURE__ */ i.jsx("div", { className: "price-unit", children: "1박당 / 세금 포함" })
      ] })
    ] })
  ] });
}, Y = 50, ne = 10, G = 4, jt = "360px 0px", se = 180, Nt = ({ hotels: e }) => {
  const [t, a] = o.useState(G), [n, s] = o.useState(1), l = o.useRef(null), r = o.useRef(null), c = o.useRef(!1), m = o.useMemo(() => Math.max(1, Math.ceil(e.length / Y)), [e.length]), d = o.useMemo(() => {
    const p = (n - 1) * Y;
    return e.slice(p, p + Y);
  }, [n, e]), b = o.useMemo(() => d.slice(0, t), [d, t]), x = o.useCallback(() => {
    const p = l.current;
    if (!p || d.length === 0)
      return;
    const I = p.querySelector(".hotel-card-premium");
    if (!I)
      return;
    const h = window.getComputedStyle(p), y = Number.parseFloat(h.gap || "0") || 0, v = I.offsetHeight, P = p.getBoundingClientRect().top, T = window.innerHeight - P;
    if (v <= 0 || T <= 0)
      return;
    const f = Math.min(
      d.length,
      Math.max(G, Math.ceil((T + y) / (v + y)) + 1)
    );
    a((N) => f <= N ? N : f);
  }, [d.length]);
  return o.useEffect(() => {
    s(1), a(Math.min(G, e.length));
  }, [e]), o.useEffect(() => {
    const p = window.requestAnimationFrame(x);
    return window.addEventListener("resize", x), () => {
      window.cancelAnimationFrame(p), window.removeEventListener("resize", x);
    };
  }, [x, b.length]), o.useEffect(() => {
    const p = r.current;
    if (!p || t >= d.length)
      return;
    const I = new IntersectionObserver(
      (h) => {
        h.forEach((y) => {
          y.isIntersecting && a((v) => Math.min(v + ne, d.length));
        });
      },
      {
        root: null,
        rootMargin: jt,
        threshold: 0.01
      }
    );
    return I.observe(p), () => {
      I.disconnect();
    };
  }, [d.length, t]), o.useEffect(() => {
    if (t >= d.length)
      return;
    const p = () => {
      const h = l.current;
      if (!h)
        return;
      const y = h.getBoundingClientRect().bottom, v = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - se, P = y <= window.innerHeight + se;
      !v && !P || a((T) => Math.min(T + ne, d.length));
    }, I = window.requestAnimationFrame(p);
    return window.addEventListener("scroll", p, { passive: !0 }), () => {
      window.cancelAnimationFrame(I), window.removeEventListener("scroll", p);
    };
  }, [d.length, t]), o.useEffect(() => {
    var p;
    if (a(Math.min(G, d.length)), !c.current) {
      c.current = !0;
      return;
    }
    (p = l.current) == null || p.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [n, d.length]), e.length === 0 ? /* @__PURE__ */ i.jsx("div", { className: "hotel-main-column", children: /* @__PURE__ */ i.jsx("section", { className: "hotel-main-list", children: /* @__PURE__ */ i.jsxs("div", { className: "hotel-runtime-fallback hotel-runtime-fallback--list", children: [
    /* @__PURE__ */ i.jsx("strong", { children: "조건에 맞는 호텔이 없음" }),
    /* @__PURE__ */ i.jsx("span", { children: "평점이나 숙소 종류 필터를 조금 풀어서 다시 봐라." })
  ] }) }) }) : /* @__PURE__ */ i.jsxs("div", { className: "hotel-main-column", children: [
    /* @__PURE__ */ i.jsxs("section", { className: "hotel-main-list", ref: l, children: [
      b.map((p) => /* @__PURE__ */ i.jsx(It, { hotel: p }, p.id)),
      t < d.length ? /* @__PURE__ */ i.jsx("div", { "aria-hidden": "true", className: "hotel-list-sentinel", ref: r }) : null
    ] }),
    m > 1 && t >= d.length ? /* @__PURE__ */ i.jsxs("div", { className: "load-more-container pagination-container", children: [
      /* @__PURE__ */ i.jsxs("span", { className: "page-indicator", children: [
        n,
        " / ",
        m
      ] }),
      n < m ? /* @__PURE__ */ i.jsx(
        "button",
        {
          className: "btn-load-more",
          onClick: () => {
            s((p) => Math.min(p + 1, m));
          },
          type: "button",
          children: "다음 페이지"
        }
      ) : null
    ] }) : null
  ] });
}, Se = "jejuHotelListOfferOverridesV1", re = (e) => typeof e != "number" || !Number.isFinite(e) || e < 0 ? null : Math.round(e), le = (e) => new Intl.NumberFormat("ko-KR", {
  currency: "KRW",
  maximumFractionDigits: 0,
  style: "currency"
}).format(e), Lt = () => typeof window < "u" && typeof window.localStorage < "u", St = (e) => {
  if (!e)
    return {};
  try {
    const t = JSON.parse(e);
    return !t || typeof t != "object" ? {} : Object.entries(t).reduce((a, [n, s]) => {
      if (!s || typeof s != "object")
        return a;
      const l = {};
      Object.prototype.hasOwnProperty.call(s, "badge") && typeof s.badge == "string" && (l.badge = s.badge);
      const r = re(s.currentPrice);
      r !== null && (l.currentPrice = r);
      const c = re(s.originalPrice);
      return c !== null && (l.originalPrice = c), Object.keys(l).length > 0 && (a[n] = l), a;
    }, {});
  } catch {
    return {};
  }
}, Pt = () => Lt() ? St(window.localStorage.getItem(Se)) : {}, Tt = (e, t) => {
  if (!t)
    return e;
  const a = {
    ...e
  };
  return Object.prototype.hasOwnProperty.call(t, "badge") && (a.badge = t.badge ?? ""), typeof t.originalPrice == "number" && (a.originalPrice = le(t.originalPrice)), typeof t.currentPrice == "number" && (a.currentPrice = le(t.currentPrice)), a;
}, oe = (e) => {
  const t = Pt();
  return Object.keys(t).length === 0 ? e : {
    ...e,
    hotels: e.hotels.map((a) => Tt(a, t[a.id]))
  };
}, Et = (e) => {
  if (typeof window > "u")
    return () => {
    };
  const t = (a) => {
    a.key !== null && a.key !== Se || e();
  };
  return window.addEventListener("storage", t), window.addEventListener("focus", e), () => {
    window.removeEventListener("storage", t), window.removeEventListener("focus", e);
  };
}, ce = "hiroshima", U = {
  hiroshima: {
    label: "히로시마",
    countryLabel: "일본",
    mapButtonLabel: "지도에서 히로시마 호텔 보기",
    popularFilters: [
      { id: "prepaid", label: "지금 바로 결제" },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제" },
      { id: "rating-9", label: "투숙객 평점: 9+ 최고" },
      { id: "kitchen", label: "주방" },
      { id: "internet", label: "인터넷" },
      { id: "frontdesk", label: "24시간 프런트 데스크" },
      { id: "downtown", label: "다운타운" },
      { id: "other-popular", label: "기타" }
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
      { id: "minami-ward", label: "미나미 와드", count: 2 },
      { id: "hiroshima-station-area", label: "히로시마역", count: 1 }
    ],
    paymentOptions: [
      { id: "free-cancel", label: "예약 무료 취소", count: 88 },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제", count: 22 },
      { id: "book-now-pay-later", label: "선예약 후지불", count: 51 },
      { id: "prepaid", label: "지금 바로 결제", count: 107 }
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
        filterIds: ["internet", "spa", "prepaid", "restaurant"],
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
        filterIds: ["spa", "pool", "prepaid"],
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
      },
      {
        id: "hotel-intergate",
        title: "호텔 인터게이트 히로시마",
        stars: "★★★★",
        location: "히로시마 중심가 · 평화공원 도보 8분",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "8.9",
        reviewLabel: "Excellent",
        originalPrice: "₩210,000",
        currentPrice: "₩167,000",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
        badge: "기간 한정 세일",
        filterIds: ["restaurant", "prepaid", "non-smoking", "internet"],
        tags: ["대욕장", "라운지", "조식 포함"]
      },
      {
        id: "quintessa-kanayamacho",
        title: "퀸테사 호텔 히로시마 카나야마쵸",
        stars: "★★★★★",
        location: "나카 워드 · 전철역 도보 4분",
        locationId: "naka-ward",
        propertyTypeId: "hotel",
        reviewScore: "8.6",
        reviewLabel: "Excellent",
        originalPrice: "₩225,000",
        currentPrice: "₩192,000",
        imageUrl: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80",
        badge: "도심 특가",
        filterIds: ["internet", "book-now-pay-later", "restaurant", "business"],
        tags: ["시티뷰", "비즈니스", "역세권"]
      },
      {
        id: "hana-ryokan",
        title: "히로시마 하나 료칸",
        stars: "★★★★",
        location: "미야지마 · 도리이 전망 포인트 인근",
        locationId: "miyajima",
        propertyTypeId: "ryokan",
        reviewScore: "9.0",
        reviewLabel: "Excellent",
        originalPrice: "₩280,000",
        currentPrice: "₩236,000",
        imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80",
        badge: "전통 감성",
        filterIds: ["spa", "pay-at-hotel", "restaurant", "other-popular"],
        tags: ["가이세키", "노천탕", "다다미 객실"]
      },
      {
        id: "peace-residence",
        title: "평화공원 레지던스 스테이",
        stars: "★★★",
        location: "히로시마 중심가 · 장기투숙 친화",
        locationId: "hiroshima-center",
        propertyTypeId: "serviced-apartment",
        reviewScore: "8.7",
        reviewLabel: "Excellent",
        originalPrice: "₩198,000",
        currentPrice: "₩149,000",
        imageUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600&q=80",
        badge: "장기숙박 특가",
        filterIds: ["kitchen", "parking", "free-cancel", "family-friendly"],
        tags: ["세탁기", "간이주방", "가족 추천"]
      },
      {
        id: "naka-apartment-suite",
        title: "나카 워드 아파트 스위트",
        stars: "★★★",
        location: "나카 워드 · 쇼핑가 접근 우수",
        locationId: "naka-ward",
        propertyTypeId: "apartment",
        reviewScore: "8.5",
        reviewLabel: "Excellent",
        originalPrice: "₩176,000",
        currentPrice: "₩136,000",
        imageUrl: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=600&q=80",
        badge: "레지던스 추천",
        filterIds: ["kitchen", "internet", "downtown", "non-smoking"],
        tags: ["풀사이즈 냉장고", "발코니", "셀프 체크인"]
      },
      {
        id: "hiroshima-city-hostel",
        title: "히로시마 시티 호스텔",
        stars: "★★",
        location: "요코가와 · 백패커 인기 구역",
        locationId: "yokogawa",
        propertyTypeId: "hostel",
        reviewScore: "8.1",
        reviewLabel: "Very Good",
        originalPrice: "₩88,000",
        currentPrice: "₩63,000",
        imageUrl: "https://images.unsplash.com/photo-1521783988139-89397d761dce?w=600&q=80",
        badge: "백패커 픽",
        filterIds: ["internet", "frontdesk", "free-cancel", "other-popular"],
        tags: ["도미토리", "공용 라운지", "가성비"]
      },
      {
        id: "miyajima-guesthouse",
        title: "미야지마 게스트하우스 츠츠미",
        stars: "★★",
        location: "미야지마 · 선착장 도보 6분",
        locationId: "miyajima",
        propertyTypeId: "guesthouse",
        reviewScore: "8.7",
        reviewLabel: "Excellent",
        originalPrice: "₩120,000",
        currentPrice: "₩91,000",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
        badge: "현지 감성",
        filterIds: ["internet", "pay-at-hotel", "family-friendly", "other-popular"],
        tags: ["공용 키친", "섬 산책", "친절한 호스트"]
      },
      {
        id: "yokogawa-capsule",
        title: "요코가와 캡슐 인",
        stars: "★★",
        location: "요코가와역 도보 2분",
        locationId: "yokogawa",
        propertyTypeId: "capsule",
        reviewScore: "8.0",
        reviewLabel: "Very Good",
        originalPrice: "₩79,000",
        currentPrice: "₩55,000",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        badge: "초특가",
        filterIds: ["internet", "frontdesk", "prepaid", "non-smoking"],
        tags: ["1인 여행", "사우나", "역세권"]
      },
      {
        id: "hatsukaichi-private-house",
        title: "하쓰카이치 프라이빗 하우스",
        stars: "★★★★",
        location: "하쓰카이치 · 가족 단위 인기",
        locationId: "hatsukaichi",
        propertyTypeId: "private-house-entire",
        reviewScore: "9.1",
        reviewLabel: "Excellent",
        originalPrice: "₩340,000",
        currentPrice: "₩286,000",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
        badge: "독채 추천",
        filterIds: ["kitchen", "parking", "family-friendly", "pet-friendly"],
        tags: ["마당", "BBQ", "주차 포함"]
      },
      {
        id: "etajima-seaside-villa",
        title: "에타지마 씨사이드 빌라",
        stars: "★★★★★",
        location: "에타지마 · 오션프런트 독채",
        locationId: "etajima",
        propertyTypeId: "villa",
        reviewScore: "9.4",
        reviewLabel: "Exceptional",
        originalPrice: "₩460,000",
        currentPrice: "₩389,000",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
        badge: "프라이빗 럭셔리",
        filterIds: ["pool", "spa", "parking", "pet-friendly"],
        tags: ["오션뷰", "프라이빗 풀", "테라스"]
      },
      {
        id: "otake-romance-hotel",
        title: "오타케 로맨스 호텔",
        stars: "★★★",
        location: "오타케 · 심야 체크인 가능",
        locationId: "otake",
        propertyTypeId: "love-hotel",
        reviewScore: "7.8",
        reviewLabel: "Good",
        originalPrice: "₩118,000",
        currentPrice: "₩84,000",
        imageUrl: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=600&q=80",
        badge: "커플 특가",
        filterIds: ["frontdesk", "book-now-pay-later", "smoking-area", "other-popular"],
        tags: ["늦은 체크인", "프라이빗", "합리적 가격"]
      },
      {
        id: "miyajima-resort-villa",
        title: "미야지마 리조트 빌라",
        stars: "★★★★★",
        location: "미야지마 · 럭셔리 오션 프런트",
        locationId: "miyajima",
        propertyTypeId: "resort-villa",
        reviewScore: "9.5",
        reviewLabel: "Exceptional",
        originalPrice: "₩520,000",
        currentPrice: "₩448,000",
        imageUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600&q=80",
        badge: "럭셔리 빌라",
        filterIds: ["pool", "spa", "prepaid", "airport-transfer"],
        tags: ["오션프런트", "버틀러 서비스", "선셋"]
      },
      {
        id: "minami-ward-inn",
        title: "미나미 와드 인",
        stars: "★★★",
        location: "미나미 와드 · 공항버스 접근 편리",
        locationId: "minami-ward",
        propertyTypeId: "inn",
        reviewScore: "8.3",
        reviewLabel: "Very Good",
        originalPrice: "₩112,000",
        currentPrice: "₩86,000",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
        badge: "실속 숙소",
        filterIds: ["internet", "free-cancel", "frontdesk", "business"],
        tags: ["공항버스", "가벼운 숙박", "조용함"]
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
}, Ct = (e) => new URLSearchParams(e), de = (e) => {
  if (!e)
    return "";
  const t = new Date(e);
  return `${t.getMonth() + 1}월 ${t.getDate()}일`;
}, Dt = (e, t, a) => {
  const n = [`성인 ${e}명`];
  return t > 0 && n.push(`아동 ${t}명`), n.push(`객실 ${a}개`), n.join(", ");
}, Ot = {
  hotel: ["hotel"],
  resort: ["resort", "resort-type"],
  ryokan: ["ryokan"],
  apartment: ["apartment"],
  guesthouse: ["guesthouse"],
  hostel: ["hostel"],
  "serviced-apartment": ["serviced-apartment"],
  inn: ["inn"],
  "resort-villa": ["resort-villa"],
  "private-house-entire": ["private-house-entire", "private-house"],
  capsule: ["capsule"],
  "love-hotel": ["love-hotel"],
  villa: ["villa"],
  poolvilla: ["poolvilla"]
}, Pe = {
  "hiroshima-center": ["downtown", "ui-city-center", "ui-city-under-2", "ui-atomic-bomb-dome", "ui-peace-museum", "ui-sukkein", "ui-city-break"],
  miyajima: ["ui-city-5-10", "ui-miyajima-shrine", "ui-waterfront", "ui-luxury-retreat"],
  hatsukaichi: ["ui-city-5-10", "ui-miyajima-shrine", "ui-family-trip", "ui-waterfront"],
  "naka-ward": ["downtown", "ui-city-under-2", "ui-okonomimura", "ui-city-break"],
  others: ["other-popular", "ui-city-2-5", "ui-city-break"],
  etajima: ["ui-city-5-10", "ui-waterfront", "ui-luxury-retreat"],
  "downtown-location": ["downtown", "ui-city-center", "ui-city-break"],
  "nishi-ward": ["ui-city-2-5", "ui-hiroshima-castle", "ui-business-trip"],
  otake: ["ui-city-5-10", "ui-couple-trip", "other-popular"],
  yokogawa: ["station", "ui-city-2-5", "ui-station-access", "ui-solo-trip"],
  "minami-ward": ["station", "ui-city-2-5", "ui-business-trip"],
  "hiroshima-station-area": ["station", "ui-city-under-2", "ui-hiroshima-station", "ui-station-access"]
}, At = [
  {
    id: "prime",
    titleSuffix: "프라임",
    badge: "얼리버드 특가",
    currentPriceDelta: 18e3,
    originalPriceDelta: 26e3,
    reviewDelta: 0.1,
    extraFilterIds: ["prepaid", "ui-breakfast-included", "ui-early-checkin", "ui-location-8"],
    extraTags: ["조식 포함", "도심 접근"]
  },
  {
    id: "residence",
    titleSuffix: "레지던스",
    badge: "장기투숙 추천",
    currentPriceDelta: -12e3,
    originalPriceDelta: -6e3,
    reviewDelta: 0,
    extraFilterIds: ["kitchen", "parking", "book-now-pay-later", "ui-room-kitchen", "ui-washer", "ui-family-trip"],
    extraTags: ["간이주방", "세탁기"]
  },
  {
    id: "signature",
    titleSuffix: "시그니처",
    badge: "무료 업그레이드",
    currentPriceDelta: 26e3,
    originalPriceDelta: 34e3,
    reviewDelta: 0.2,
    extraFilterIds: ["spa", "pool", "ui-free-sauna", "ui-late-checkout", "ui-luxury-retreat", "ui-location-9"],
    extraTags: ["사우나", "라운지"]
  }
], q = (e) => {
  const t = Number.parseInt(e.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(t) ? 0 : t;
}, ue = (e) => `₩${Math.max(49e3, e).toLocaleString("ko-KR")}`, Mt = (e) => e >= 9.2 ? "Exceptional" : e >= 8.5 ? "Excellent" : e >= 8 ? "Great" : "Very Good", Te = (e) => {
  var a;
  const t = ((a = e.match(/★/g)) == null ? void 0 : a.length) ?? 0;
  return t >= 5 ? "ui-five-star" : t === 4 ? "ui-four-star" : t === 3 ? "ui-three-star" : t === 2 ? "ui-two-star" : "ui-one-star";
}, Ee = (e) => e >= 9 ? ["rating-9", "rating-8", "rating-7"] : e >= 8 ? ["rating-8", "rating-7"] : ["rating-7"], Ce = (e) => {
  const t = e.title.toLowerCase();
  return t.includes("crowne") || t.includes("ana") ? ["brand-ihg"] : t.includes("칸데오") ? ["brand-candeo"] : t.includes("쉐라톤") ? ["brand-marriott"] : t.includes("스테이션") ? ["brand-apa"] : t.includes("리조트") || t.includes("그랜드") ? ["brand-prince"] : ["brand-local"];
}, De = (e) => {
  switch (e.propertyTypeId) {
    case "resort":
      return ["ui-king-bed", "ui-balcony", "ui-bathtub", "ui-late-checkout", "ui-two-bedroom", "ui-couple-trip"];
    case "ryokan":
      return ["ui-double-bed", "ui-dinner-included", "ui-bathtub", "ui-onsen-retreat", "ui-couple-trip"];
    case "apartment":
      return ["ui-queen-bed", "ui-room-kitchen", "ui-fridge", "ui-washer", "ui-studio"];
    case "guesthouse":
      return ["ui-single-bed", "ui-room-kitchen", "ui-room-internet", "ui-studio", "ui-solo-trip"];
    case "hostel":
      return ["ui-bunk-bed", "ui-single-bed", "ui-room-internet", "ui-solo-trip", "ui-studio"];
    case "serviced-apartment":
      return ["ui-room-kitchen", "ui-fridge", "ui-washer", "ui-two-bedroom", "ui-family-trip"];
    case "inn":
      return ["ui-double-bed", "ui-room-internet", "ui-business-trip", "ui-city-2-5"];
    case "resort-villa":
      return ["ui-king-bed", "ui-balcony", "ui-three-bedroom", "ui-luxury-retreat", "ui-waterfront"];
    case "private-house-entire":
      return ["ui-king-bed", "ui-room-kitchen", "ui-fridge", "ui-washer", "ui-three-bedroom", "ui-family-trip"];
    case "capsule":
      return ["ui-single-bed", "ui-room-internet", "ui-solo-trip"];
    case "love-hotel":
      return ["ui-king-bed", "ui-couple-trip", "ui-late-checkout"];
    case "villa":
      return ["ui-king-bed", "ui-balcony", "ui-three-bedroom", "ui-luxury-retreat"];
    default:
      return ["ui-double-bed", "ui-heating", "ui-tv", "ui-aircon", "ui-room-internet", "ui-one-bedroom"];
  }
}, Oe = (e) => {
  const t = e.tags.join(" ").toLowerCase(), a = [];
  return t.includes("조식") && a.push("ui-breakfast-included"), (t.includes("사우나") || e.filterIds.includes("spa")) && a.push("ui-free-sauna"), t.includes("레이트 체크아웃") && a.push("ui-late-checkout"), e.filterIds.includes("airport-transfer") && a.push("ui-shuttle"), e.filterIds.includes("family-friendly") && a.push("ui-family-trip"), e.filterIds.includes("business") && a.push("ui-business-trip"), a;
}, Ae = (e) => e >= 9.2 ? ["ui-location-9"] : e >= 8.5 ? ["ui-location-8"] : e >= 7.8 ? ["ui-location-7"] : ["ui-location-6"], me = (e, t, a) => {
  const n = Math.max(
    7.5,
    Math.min(9.8, Number.parseFloat(e.reviewScore) + ((t == null ? void 0 : t.reviewDelta) ?? 0) + (a % 3 - 1) * 0.05)
  ), s = q(e.currentPrice) + ((t == null ? void 0 : t.currentPriceDelta) ?? 0) + a % 5 * 3e3, l = Math.max(
    s + 14e3,
    q(e.originalPrice) + ((t == null ? void 0 : t.originalPriceDelta) ?? 0) + a % 4 * 4e3
  ), r = W([
    ...e.filterIds,
    ...Pe[e.locationId] ?? [],
    ...Ee(n),
    Te(e.stars),
    ...De(e),
    ...Oe(e),
    ...Ae(n),
    ...Ce(e),
    ...n >= 9.3 && e.stars.includes("★★★★★") ? ["ui-agoda-luxe"] : [],
    ...(t == null ? void 0 : t.extraFilterIds) ?? []
  ]);
  return {
    ...e,
    id: t ? `${e.id}-${t.id}` : e.id,
    title: t ? `${e.title} ${t.titleSuffix}` : e.title,
    badge: (t == null ? void 0 : t.badge) ?? e.badge,
    reviewScore: n.toFixed(1),
    reviewLabel: Mt(n),
    originalPrice: ue(l),
    currentPrice: ue(s),
    filterIds: r,
    tags: Array.from(/* @__PURE__ */ new Set([...e.tags, ...(t == null ? void 0 : t.extraTags) ?? []])).slice(0, 4)
  };
}, Rt = (e) => e.flatMap((a, n) => [
  me(a, null, n),
  ...At.map((s) => me(a, s, n))
]), _t = (e) => ({
  landmarkOptions: [
    { id: "ui-local-central", label: `${e} 중심가` },
    { id: "ui-local-station", label: `${e} 중앙역` },
    { id: "ui-local-waterfront", label: `${e} 워터프런트` },
    { id: "ui-local-old-town", label: `${e} 올드타운` },
    { id: "ui-local-landmark-1", label: `${e} 대표 명소` },
    { id: "ui-local-landmark-2", label: `${e} 쇼핑 거리` }
  ],
  locationFilters: {}
}), Me = (e, t) => e === "hiroshima" ? {
  landmarkOptions: [
    { id: "ui-okonomimura", label: "오코노미무라" },
    { id: "ui-atomic-bomb-dome", label: "원폭 돔" },
    { id: "ui-peace-museum", label: "히로시마 평화 기념관" },
    { id: "ui-sukkein", label: "수케이엔 정원" },
    { id: "ui-hiroshima-castle", label: "히로시마 성" },
    { id: "ui-miyajima-shrine", label: "이쓰쿠시마 신사" },
    { id: "ui-hiroshima-station", label: "히로시마역" }
  ],
  locationFilters: Pe
} : e === "jeju" ? {
  landmarkOptions: [
    { id: "ui-jeju-airport", label: "제주국제공항" },
    { id: "ui-dongmun-market", label: "동문시장" },
    { id: "ui-hallasan", label: "한라산" },
    { id: "ui-seongsan", label: "성산일출봉" },
    { id: "ui-jungmun-tourism", label: "중문관광단지" },
    { id: "ui-aewol-coast", label: "애월 해안도로" },
    { id: "ui-hyeopjae", label: "협재해변" }
  ],
  locationFilters: {
    "jeju-city": ["ui-city-center", "ui-city-under-2", "ui-jeju-airport", "ui-dongmun-market", "ui-city-break"],
    seogwipo: ["ui-city-5-10", "ui-seongsan", "ui-waterfront", "ui-luxury-retreat"],
    jungmun: ["ui-city-5-10", "ui-jungmun-tourism", "ui-hyeopjae", "ui-waterfront", "ui-luxury-retreat"],
    aewol: ["ui-city-2-5", "ui-aewol-coast", "ui-hallasan", "ui-waterfront", "ui-couple-trip"]
  }
} : e === "osaka" ? {
  landmarkOptions: [
    { id: "ui-dotonbori", label: "도톤보리" },
    { id: "ui-osaka-castle", label: "오사카성" },
    { id: "ui-umeda-sky", label: "우메다 스카이 빌딩" },
    { id: "ui-usj", label: "유니버설 스튜디오 재팬" },
    { id: "ui-kuromon", label: "구로몬 시장" },
    { id: "ui-shinsaibashi-street", label: "신사이바시" },
    { id: "ui-kaiyukan", label: "가이유칸" }
  ],
  locationFilters: {
    namba: ["ui-city-center", "ui-city-under-2", "ui-dotonbori", "ui-kuromon", "ui-city-break", "ui-station-access"],
    umeda: ["ui-city-center", "ui-city-under-2", "ui-umeda-sky", "ui-osaka-castle", "ui-city-break", "ui-business-trip"],
    shinsaibashi: ["ui-city-center", "ui-city-under-2", "ui-shinsaibashi-street", "ui-dotonbori", "ui-city-break"],
    universal: ["ui-city-5-10", "ui-usj", "ui-kaiyukan", "ui-family-trip", "ui-waterfront"]
  }
} : _t(t), $t = (e, t, a) => {
  const n = Math.max(0, e.locations.findIndex((s) => s.id === t));
  return n === 0 ? ["ui-city-center", "ui-city-under-2", "ui-city-break", ...a.slice(0, 2)] : n === 1 ? ["ui-city-2-5", "ui-waterfront", ...a.slice(2, 4)] : n === 2 ? ["ui-city-2-5", "ui-station-access", ...a.slice(1, 3)] : ["ui-city-5-10", ...a.slice(-2)];
}, Ft = (e) => {
  const t = Number.parseFloat(e.reviewScore) || 0, a = e.location.toLowerCase(), n = e.tags.join(" ").toLowerCase(), s = [];
  return (e.filterIds.includes("family-friendly") || e.filterIds.includes("family") || n.includes("가족")) && s.push("ui-family-trip"), (n.includes("커플") || e.propertyTypeId === "resort" || e.propertyTypeId === "villa" || e.propertyTypeId === "poolvilla") && s.push("ui-couple-trip"), (e.propertyTypeId === "capsule" || e.propertyTypeId === "hostel" || e.propertyTypeId === "guesthouse") && s.push("ui-solo-trip"), (e.filterIds.includes("business") || n.includes("비즈니스")) && s.push("ui-business-trip"), (e.filterIds.includes("station") || e.filterIds.includes("rental-friendly") || a.includes("역") || a.includes("공항")) && s.push("ui-station-access"), (a.includes("해변") || a.includes("오션") || n.includes("오션") || n.includes("해변") || e.filterIds.includes("ocean") || e.filterIds.includes("ocean-view")) && s.push("ui-waterfront"), (e.filterIds.includes("pool") || e.filterIds.includes("spa") || t >= 9 || n.includes("럭셔리")) && s.push("ui-luxury-retreat"), (e.filterIds.includes("spa") || e.filterIds.includes("onsen") || n.includes("온천") || n.includes("사우나")) && s.push("ui-onsen-retreat"), (a.includes("시내") || a.includes("중심") || a.includes("downtown") || e.filterIds.includes("downtown") || e.filterIds.includes("shopping")) && s.push("ui-city-break"), s;
}, Ht = (e, t, a, n) => {
  const s = Number.parseFloat(e.reviewScore) || 0, l = Me(t, a), r = l.landmarkOptions.map((m) => m.id), c = l.locationFilters[e.locationId] ?? $t(n, e.locationId, r);
  return {
    ...e,
    filterIds: W([
      ...e.filterIds,
      ...c,
      ...Ee(s),
      Te(e.stars),
      ...De(e),
      ...Oe(e),
      ...Ae(s),
      ...Ce(e),
      ...Ft(e),
      ...s >= 9.3 && e.stars.includes("★★★★★") ? ["ui-agoda-luxe"] : []
    ])
  };
}, Re = (e, t, a, n) => e === "hiroshima" ? n.some(
  (s) => s.title.endsWith(" 프라임") || s.title.endsWith(" 레지던스") || s.title.endsWith(" 시그니처")
) ? n : Rt(n) : n.map((s) => Ht(s, e, t, a)), Ut = (e, t) => e.filter((a) => a.filterIds.includes(t)).length, Bt = (e, t, a, n) => {
  const s = Me(e, t);
  return [
    {
      id: "star-rating",
      title: "숙소 성급",
      options: [
        { id: "ui-agoda-luxe", label: "Agoda Luxe" },
        { id: "ui-five-star", label: "5-성급" },
        { id: "ui-four-star", label: "4-성급" },
        { id: "ui-three-star", label: "3-성급" },
        { id: "ui-two-star", label: "2-성급" },
        { id: "ui-one-star", label: "1-성급" }
      ]
    },
    {
      id: "meal-options",
      title: "이용 가능 서비스 / 옵션",
      options: [
        { id: "ui-breakfast-included", label: "조식 포함" },
        { id: "ui-dinner-included", label: "석식(저녁) 포함" },
        { id: "ui-free-sauna", label: "사우나 무료 이용" },
        { id: "ui-early-checkin", label: "얼리 체크인" },
        { id: "ui-late-checkout", label: "레이트 체크아웃" },
        { id: "ui-lunch-included", label: "중식(점심) 포함" },
        { id: "ui-shuttle", label: "무료 셔틀 서비스" }
      ]
    },
    {
      id: "room-amenities",
      title: "객실 편의 시설/서비스",
      options: [
        { id: "ui-heating", label: "난방" },
        { id: "ui-fridge", label: "냉장고" },
        { id: "ui-tv", label: "TV" },
        { id: "ui-bathtub", label: "욕조" },
        { id: "ui-aircon", label: "에어컨" },
        { id: "ui-washer", label: "세탁기" },
        { id: "ui-room-internet", label: "인터넷" },
        { id: "ui-coffee-maker", label: "커피/티 메이커" },
        { id: "ui-balcony", label: "발코니/테라스" },
        { id: "ui-room-kitchen", label: "주방" },
        { id: "ui-ironing", label: "다림질 도구" },
        { id: "ui-room-pet", label: "반려동물 동반 가능" }
      ]
    },
    {
      id: "distance",
      title: "도심까지의 거리",
      options: [
        { id: "ui-city-center", label: "도심에 위치" },
        { id: "ui-city-under-2", label: "도심까지 2km 미만" },
        { id: "ui-city-2-5", label: "도심까지 2~5km" },
        { id: "ui-city-5-10", label: "도심까지 5~10km" }
      ]
    },
    {
      id: "bed-types",
      title: "침대 종류",
      options: [
        { id: "ui-double-bed", label: "더블베드" },
        { id: "ui-single-bed", label: "싱글/트윈베드" },
        { id: "ui-queen-bed", label: "퀸베드" },
        { id: "ui-bunk-bed", label: "벙크베드" },
        { id: "ui-king-bed", label: "킹베드" }
      ]
    },
    {
      id: "landmarks",
      title: "주변 인기 명소",
      options: s.landmarkOptions
    },
    {
      id: "family-favorites",
      title: "가족 여행객에 인기",
      options: [
        { id: "ui-family-trip", label: "가족 여행" },
        { id: "ui-couple-trip", label: "커플 여행" },
        { id: "ui-solo-trip", label: "1인 여행" },
        { id: "ui-business-trip", label: "비즈니스 여행" }
      ]
    },
    {
      id: "location-score",
      title: "숙소 위치 평가",
      options: [
        { id: "ui-location-9", label: "9+ 최고" },
        { id: "ui-location-8", label: "8+ 우수" },
        { id: "ui-location-7", label: "7+ 좋음" },
        { id: "ui-location-6", label: "6+ 무난" }
      ]
    },
    {
      id: "travel-theme",
      title: "여행 테마",
      options: [
        { id: "ui-city-break", label: "도심 여행" },
        { id: "ui-onsen-retreat", label: "온천 휴양" },
        { id: "ui-luxury-retreat", label: "럭셔리 숙박" },
        { id: "ui-station-access", label: "역 접근성 우수" },
        { id: "ui-waterfront", label: "워터프런트" }
      ]
    },
    {
      id: "bedroom-count",
      title: "침실 수",
      options: [
        { id: "ui-studio", label: "스튜디오" },
        { id: "ui-one-bedroom", label: "침실 1개" },
        { id: "ui-two-bedroom", label: "침실 2개" },
        { id: "ui-three-bedroom", label: "침실 3개 이상" }
      ]
    },
    {
      id: "hotel-brands",
      title: "인기 호텔 브랜드",
      options: [
        { id: "brand-ihg", label: "IHG 계열" },
        { id: "brand-candeo", label: "칸데오 호텔" },
        { id: "brand-marriott", label: "메리어트 계열" },
        { id: "brand-apa", label: "APA 계열" },
        { id: "brand-prince", label: "Prince 계열" },
        { id: "brand-local", label: "로컬/부티크" }
      ]
    }
  ].map((r) => ({
    ...r,
    options: r.options.map((c) => ({
      ...c,
      count: Ut(n, c.id)
    }))
  }));
}, W = (e) => Array.from(new Set(e.filter((t) => t.trim() !== ""))), M = (e, t, a) => ({
  label: t,
  countryLabel: a,
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
}), _e = (e, t) => {
  const a = (e == null ? void 0 : e.trim().toLowerCase()) || "";
  if (a && U[a])
    return { region: a, profile: U[a] };
  if (a === "bangkok")
    return { region: "bangkok", profile: M("bangkok", "방콕", "태국") };
  if (a === "tokyo")
    return { region: "tokyo", profile: M("tokyo", "도쿄", "일본") };
  if (a === "danang")
    return { region: "danang", profile: M("danang", "다낭", "베트남") };
  if (a === "singapore")
    return { region: "singapore", profile: M("singapore", "싱가포르", "싱가포르") };
  const n = (t == null ? void 0 : t.trim().toLowerCase()) || "";
  return n.includes("제주") || n.includes("jeju") ? { region: "jeju", profile: U.jeju } : n.includes("오사카") || n.includes("osaka") ? { region: "osaka", profile: U.osaka } : n.includes("방콕") || n.includes("bangkok") ? { region: "bangkok", profile: M("bangkok", "방콕", "태국") } : n.includes("도쿄") || n.includes("tokyo") ? { region: "tokyo", profile: M("tokyo", "도쿄", "일본") } : n.includes("다낭") || n.includes("danang") ? { region: "danang", profile: M("danang", "다낭", "베트남") } : n.includes("싱가포르") || n.includes("singapore") ? { region: "singapore", profile: M("singapore", "싱가포르", "싱가포르") } : { region: ce, profile: U[ce] };
}, $e = (e, t, a, n, s = []) => [
  {
    id: "popular",
    title: `${t} 인기 검색 조건`,
    options: _(a.popularFilters, s)
  },
  {
    id: "property-types",
    title: "숙소 종류",
    options: _(a.propertyTypes, s)
  },
  {
    id: "locations",
    title: "지역",
    options: _(a.locations, s)
  },
  {
    id: "payment-options",
    title: "결제 관련 옵션",
    options: _(a.paymentOptions, s)
  },
  {
    id: "guest-ratings",
    title: "투숙객 평가 점수",
    options: _(a.guestRatings, s)
  },
  {
    id: "amenities",
    title: "숙소 편의 시설 및 서비스",
    options: _(a.amenities, s)
  },
  ...Bt(e, t, a, n).map((l) => ({
    ...l,
    options: _(l.options, s)
  }))
], Fe = (e) => W(
  e.filterSections.flatMap(
    (t) => t.options.filter((a) => a.checked).map((a) => a.id)
  )
), _ = (e, t) => {
  const a = new Set(t);
  return e.map((n) => ({
    ...n,
    checked: a.has(n.id)
  }));
}, pe = (e) => {
  const a = _e(e.region, e.regionLabel).profile, n = Fe(e), s = Re(e.region, e.regionLabel, a, e.hotels);
  return {
    ...e,
    filterSections: $e(e.region, e.regionLabel, a, s, n),
    hotels: s
  };
}, Gt = (e) => {
  var x, p, I, h, y, v;
  const t = Ct(e), a = t.get("keyword"), n = t.get("region"), s = ke(e), l = _e(n, a), r = ((x = s.destinationValue) == null ? void 0 : x.trim()) || `${l.profile.label}, ${l.profile.countryLabel}`, c = de(((p = s.calendar) == null ? void 0 : p.checkIn) ?? null), m = de(((I = s.calendar) == null ? void 0 : I.checkOut) ?? null), d = c && m ? `${c} - ${m}` : "날짜를 선택하세요", b = Re(l.region, l.profile.label, l.profile, l.profile.hotels);
  return {
    shell: t.get("shell") ?? "stay",
    migrationPath: "/migration",
    region: l.region,
    regionLabel: l.profile.label,
    mapButtonLabel: l.profile.mapButtonLabel,
    searchSummary: {
      destinationLabel: r,
      dateLabel: d,
      guestLabel: Dt(
        ((h = s.guest) == null ? void 0 : h.adults) ?? 1,
        ((y = s.guest) == null ? void 0 : y.children) ?? 0,
        ((v = s.guest) == null ? void 0 : v.rooms) ?? 1
      )
    },
    filterSections: $e(l.region, l.profile.label, l.profile, b),
    hotels: b
  };
}, Vt = () => {
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
}, qt = (e) => {
  const t = Number.parseFloat(e);
  return Number.isNaN(t) ? 0 : t;
}, Wt = (e, t) => {
  const a = e.title.toLowerCase();
  return (Ot[t] ?? [t]).includes(e.propertyTypeId) ? !0 : t === "hotel" ? a.includes("호텔") || a.includes("hotel") : t === "resort" ? a.includes("리조트") || a.includes("resort") : t === "ryokan" ? a.includes("료칸") || a.includes("ryokan") : t === "apartment" ? a.includes("아파트") || a.includes("apartment") : t === "capsule" ? a.includes("캡슐") : t === "poolvilla" ? a.includes("풀빌라") : t === "private-house-entire" ? a.includes("프라이빗") || a.includes("독채") : t === "villa" || t === "resort-villa" ? a.includes("빌라") : !1;
}, he = (e, t) => e.filter((a) => {
  const n = q(a.currentPrice);
  if (t.minPrice !== null && n < t.minPrice || t.maxPrice !== null && n > t.maxPrice || t.guestRatingThreshold !== null && qt(a.reviewScore) < t.guestRatingThreshold || t.locationIds.length > 0 && !t.locationIds.includes(a.locationId))
    return !1;
  if (t.propertyTypeIds.length === 0) {
    const r = t.selectedOptionIds.filter(
      (c) => !c.startsWith("rating-") && !t.locationIds.includes(c)
    );
    return r.length === 0 ? !0 : r.every((c) => c === a.locationId ? !0 : a.filterIds.includes(c));
  }
  if (!t.propertyTypeIds.some(
    (r) => Wt(a, r)
  ))
    return !1;
  const l = t.selectedOptionIds.filter(
    (r) => !r.startsWith("rating-") && !t.propertyTypeIds.includes(r) && !t.locationIds.includes(r)
  );
  return l.length === 0 ? !0 : l.every((r) => r === a.locationId ? !0 : a.filterIds.includes(r));
}), ge = (e) => Fe(e), zt = (e, t) => {
  const a = new URLSearchParams(e);
  return a.delete("filter"), W(t).forEach((n) => {
    a.append("filter", n);
  }), a;
}, be = (e) => new Set(e), fe = (e) => {
  if (e.length === 0)
    return {
      min: 0,
      max: 0
    };
  const t = e.map((n) => q(n.currentPrice));
  return {
    min: 0,
    max: Math.max(...t)
  };
}, ye = (e, t) => {
  const a = Math.max(t.min, Math.min(e.min, t.max)), n = Math.min(t.max, Math.max(e.max, t.min));
  return a > n ? {
    min: t.min,
    max: t.max
  } : {
    min: a,
    max: n
  };
}, Yt = "property-types", Kt = "guest-ratings", Jt = "locations", ia = () => {
  const e = o.useMemo(() => {
    const f = Vt();
    return f ? pe(f) : null;
  }, []), t = o.useMemo(() => e ?? Gt(window.location.search), [e]), [a, n] = o.useState(() => t), [s, l] = o.useState(0), r = o.useMemo(() => oe(a), [a, s]), [c, m] = o.useState(
    () => be(ge(t))
  ), [d, b] = o.useState(
    () => fe(oe(t).hotels)
  );
  o.useEffect(() => Et(() => {
    l((f) => f + 1);
  }), []);
  const x = e !== null;
  o.useEffect(() => {
    const f = document.getElementById("stickySearch");
    if (!f)
      return;
    const N = () => {
      f.classList.toggle("scrolled", window.scrollY > 100);
    };
    return N(), window.addEventListener("scroll", N), () => {
      window.removeEventListener("scroll", N);
    };
  }, []);
  const p = (f) => {
    m((N) => {
      const k = new Set(N);
      k.has(f) ? k.delete(f) : k.add(f);
      const D = Array.from(k), j = zt(window.location.search, D), E = `${window.location.pathname}?${j.toString()}`;
      if (window.history.replaceState(null, "", E), x) {
        const C = `/api/stay/hotel-list?${j.toString()}`;
        fetch(C, {
          headers: {
            Accept: "application/json"
          }
        }).then(async (g) => {
          if (!g.ok)
            throw new Error(`hotel list fetch failed: ${g.status}`);
          return g.json();
        }).then((g) => {
          const A = pe(g);
          n(A), m(be(ge(A)));
        }).catch(() => {
        });
      }
      return k;
    });
  }, I = o.useMemo(() => {
    var j, E, C;
    const f = ((j = r.filterSections.find((g) => g.id === Yt)) == null ? void 0 : j.options.map((g) => g.id).filter((g) => c.has(g))) ?? [], N = ((E = r.filterSections.find((g) => g.id === Kt)) == null ? void 0 : E.options) ?? [], k = ((C = r.filterSections.find((g) => g.id === Jt)) == null ? void 0 : C.options.map((g) => g.id).filter((g) => c.has(g))) ?? [], D = N.filter((g) => c.has(g.id)).map((g) => Number.parseInt(g.id.replace("rating-", ""), 10)).filter((g) => !Number.isNaN(g));
    return {
      propertyTypeIds: f,
      locationIds: k,
      guestRatingThreshold: D.length > 0 ? Math.max(...D) : null,
      minPrice: null,
      maxPrice: null,
      selectedOptionIds: Array.from(c)
    };
  }, [c, r.filterSections]), h = o.useMemo(() => he(r.hotels, I), [I, r.hotels]), y = o.useMemo(() => fe(h), [h]);
  o.useEffect(() => {
    b((f) => ye(f, y));
  }, [y]);
  const v = (f) => {
    b(ye(f, y));
  }, P = o.useMemo(() => ({
    ...I,
    minPrice: d.min,
    maxPrice: d.max
  }), [I, d.max, d.min]), T = o.useMemo(() => he(h, P), [P, h]);
  return /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
    /* @__PURE__ */ i.jsx(
      vt,
      {
        checkedOptionIds: c,
        mapButtonLabel: r.mapButtonLabel,
        onToggle: p,
        onPriceChange: v,
        priceBounds: y,
        priceRange: d,
        sections: r.filterSections
      }
    ),
    /* @__PURE__ */ i.jsx(Nt, { hotels: T })
  ] });
};
export {
  rt as D,
  ta as H,
  nt as S,
  aa as a,
  ia as b,
  Ve as c,
  We as d,
  mt as e,
  ut as f,
  B as g,
  Ge as s
};
