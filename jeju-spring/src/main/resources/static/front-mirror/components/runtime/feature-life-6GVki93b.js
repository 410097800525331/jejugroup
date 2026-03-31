import { a as l, j as s } from "./react-vendor-BoSfm_Te.js";
import { b as v } from "./feature-layout-MqEyxW8f.js";
import { c as q, r as B, d as Q, g as U, e as K, s as X, S as J, f as z, h as Z, D as ee, i as ae } from "./feature-hotel-ClOkmcHm.js";
import { r as ne } from "./legacy-core-CYHwlLlr.js";
const te = [
  { value: "3", dataLang: "calFlex3", label: "3박" },
  { value: "7", dataLang: "calFlex7", label: "1주일" },
  { value: "30", dataLang: "calFlex30", label: "1개월" }
], se = [
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
], $ = [
  { value: "kitchen", dataLang: "lifeOptionKitchen", label: "주방" },
  { value: "washer", dataLang: "lifeOptionWasher", label: "세탁기" },
  { value: "full-kitchen", dataLang: "lifeOptionFullKitchen", label: "풀옵션 주방" },
  { value: "washer-dryer", dataLang: "lifeOptionWasherDryer", label: "세탁기/건조기" },
  { value: "desk", dataLang: "lifeOptionDesk", label: "업무용 데스크" },
  { value: "parking", dataLang: "lifeOptionParking", label: "전용 주차장" }
], T = 14, _ = 24 * 60 * 60 * 1e3, le = {
  destinationValue: "",
  hasTypedDestinationQuery: !1,
  isDestinationOpen: !1,
  isGuestOpen: !1,
  isOptionsOpen: !1,
  guest: {
    rooms: 1,
    adults: 1,
    children: 0
  },
  requiredOptions: [],
  calendar: q()
}, W = l.createContext(null), H = (e) => {
  if (!e)
    return "날짜 선택";
  const a = new Date(e), n = a.getFullYear(), c = String(a.getMonth() + 1).padStart(2, "0"), o = String(a.getDate()).padStart(2, "0");
  return `${n}-${c}-${o}`;
}, ce = (e, a) => {
  switch (a.type) {
    case "SET_DESTINATION_VALUE":
      return {
        ...e,
        destinationValue: a.value
      };
    case "MARK_TYPED_DESTINATION_QUERY":
      return {
        ...e,
        hasTypedDestinationQuery: !0
      };
    case "RESET_TYPED_DESTINATION_QUERY":
      return {
        ...e,
        hasTypedDestinationQuery: !1
      };
    case "TOGGLE_DESTINATION":
      return {
        ...e,
        isDestinationOpen: !e.isDestinationOpen,
        isGuestOpen: !1,
        isOptionsOpen: !1
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
        isDestinationOpen: !1,
        isOptionsOpen: !1
      };
    case "CLOSE_GUEST":
      return {
        ...e,
        isGuestOpen: !1
      };
    case "TOGGLE_OPTIONS":
      return {
        ...e,
        isOptionsOpen: !e.isOptionsOpen,
        isDestinationOpen: !1,
        isGuestOpen: !1
      };
    case "CLOSE_OPTIONS":
      return {
        ...e,
        isOptionsOpen: !1
      };
    case "TOGGLE_REQUIRED_OPTION": {
      const n = e.requiredOptions.includes(a.value);
      return {
        ...e,
        requiredOptions: n ? e.requiredOptions.filter((c) => c !== a.value) : [...e.requiredOptions, a.value]
      };
    }
    case "ADJUST_GUEST": {
      const n = e.guest[a.key] + a.delta;
      return n < {
        rooms: 1,
        adults: 1,
        children: 0
      }[a.key] ? e : {
        ...e,
        guest: {
          ...e.guest,
          [a.key]: n
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
          visibleMonth: e.calendar.checkIn ? U(e.calendar.checkIn) : e.calendar.visibleMonth
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
          visibleMonth: X(e.calendar.visibleMonth, a.delta)
        }
      };
    case "SET_CALENDAR_TAB":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          activeTab: a.tab,
          hoverDate: null
        }
      };
    case "SET_FLEXIBLE_OPTION":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          activeTab: "flexible",
          flexibleValue: a.value
        }
      };
    case "SELECT_CALENDAR_DATE": {
      const n = K(
        {
          tempCheckIn: e.calendar.tempCheckIn,
          tempCheckOut: e.calendar.tempCheckOut
        },
        a.timestamp
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
      const n = a.timestamp && e.calendar.tempCheckIn && !e.calendar.tempCheckOut && a.timestamp > e.calendar.tempCheckIn ? a.timestamp : null;
      return {
        ...e,
        calendar: {
          ...e.calendar,
          hoverDate: n
        }
      };
    }
    case "CONFIRM_CALENDAR": {
      const n = e.calendar.tempCheckIn, c = e.calendar.tempCheckOut;
      return {
        ...e,
        calendar: {
          ...e.calendar,
          isOpen: !1,
          hoverDate: null,
          checkIn: n,
          checkOut: c,
          tempCheckIn: n,
          tempCheckOut: c,
          visibleMonth: n ? U(n) : e.calendar.visibleMonth
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
}, O = (e, a = null) => {
  a !== "destinationDropdown" && e({ type: "CLOSE_DESTINATION" }), a !== "guestPopupLarge" && e({ type: "CLOSE_GUEST" }), a !== "optionsPopupLarge" && e({ type: "CLOSE_OPTIONS" }), a !== "calendarPopup" && e({ type: "CLOSE_CALENDAR" });
}, ie = ({ children: e }) => {
  const [a, n] = l.useReducer(ce, le);
  l.useEffect(() => {
    const t = () => {
      O(n);
    };
    return document.addEventListener("click", t), () => {
      document.removeEventListener("click", t);
    };
  }, []);
  const c = l.useCallback((t) => {
    t.stopPropagation();
  }, []), o = l.useCallback((t) => {
    n({ type: "SET_DESTINATION_VALUE", value: t }), n({ type: "MARK_TYPED_DESTINATION_QUERY" });
  }, []), d = l.useCallback(() => {
    O(n, "destinationDropdown"), a.isDestinationOpen || n({ type: "TOGGLE_DESTINATION" });
  }, [a.isDestinationOpen]), i = l.useCallback((t) => {
    t.stopPropagation(), O(n, "destinationDropdown"), n({ type: "TOGGLE_DESTINATION" });
  }, []), m = l.useCallback(
    (t) => {
      t.stopPropagation(), d();
    },
    [d]
  ), g = l.useCallback((t) => {
    n({ type: "SET_DESTINATION_VALUE", value: t }), n({ type: "RESET_TYPED_DESTINATION_QUERY" }), n({ type: "CLOSE_DESTINATION" });
  }, []), E = l.useCallback((t) => {
    t.stopPropagation(), O(n, "guestPopupLarge"), n({ type: "TOGGLE_GUEST" });
  }, []), C = l.useCallback((t, r, u) => {
    u.stopPropagation(), n({ type: "ADJUST_GUEST", key: t, delta: r });
  }, []), p = l.useCallback((t) => {
    t.stopPropagation(), O(n, "optionsPopupLarge"), n({ type: "TOGGLE_OPTIONS" });
  }, []), D = l.useCallback((t) => {
    n({ type: "TOGGLE_REQUIRED_OPTION", value: t });
  }, []), L = l.useCallback(
    (t) => {
      if (t.stopPropagation(), a.calendar.isOpen) {
        n({ type: "CLOSE_CALENDAR" });
        return;
      }
      O(n, "calendarPopup"), n({ type: "OPEN_CALENDAR" });
    },
    [a.calendar.isOpen]
  ), N = l.useCallback(() => {
    n({ type: "SHIFT_CALENDAR_MONTH", delta: -1 });
  }, []), S = l.useCallback(() => {
    n({ type: "SHIFT_CALENDAR_MONTH", delta: 1 });
  }, []), k = l.useCallback((t) => {
    n({ type: "SET_CALENDAR_TAB", tab: t });
  }, []), I = l.useCallback((t) => {
    n({ type: "SET_FLEXIBLE_OPTION", value: t });
  }, []), f = l.useCallback((t) => {
    n({ type: "SELECT_CALENDAR_DATE", timestamp: t });
  }, []), x = l.useCallback((t) => {
    n({ type: "SET_CALENDAR_HOVER_DATE", timestamp: t });
  }, []), A = l.useCallback(() => {
    n({ type: "SET_CALENDAR_HOVER_DATE", timestamp: null });
  }, []), y = l.useCallback(() => {
    n({ type: "CLEAR_CALENDAR" });
  }, []), j = l.useCallback(() => {
    const { tempCheckIn: t, tempCheckOut: r } = a.calendar;
    if (!t && !r) {
      n({ type: "CLEAR_CALENDAR" }), n({ type: "CLOSE_CALENDAR" });
      return;
    }
    if (!t || !r) {
      window.alert("체크인과 체크아웃 날짜를 모두 선택해주세요");
      return;
    }
    if ((r - t) / _ < T) {
      window.alert(`장기 체류 서비스는 최소 ${T}박부터 예약 가능합니다`);
      return;
    }
    n({ type: "CONFIRM_CALENDAR" });
  }, [a.calendar]), R = l.useCallback(() => {
    O(n);
    const t = a.destinationValue.trim(), r = t ? B(null, t).destination : null, u = ne(
      "SERVICES.STAY.HOTEL_LIST",
      Q(
        {
          destinationValue: a.destinationValue,
          guest: a.guest,
          calendar: {
            checkIn: a.calendar.checkIn,
            checkOut: a.calendar.checkOut
          },
          resolvedDestination: r
        },
        window.location.search
      )
    );
    window.location.assign(u);
  }, [a.calendar.checkIn, a.calendar.checkOut, a.calendar.flexibleValue, a.destinationValue, a.guest, a.requiredOptions]), P = l.useMemo(() => {
    const t = [`성인 ${a.guest.adults}명`, `객실 ${a.guest.rooms}개`];
    return a.guest.children > 0 && t.splice(1, 0, `아동 ${a.guest.children}명`), t.join(", ");
  }, [a.guest.adults, a.guest.children, a.guest.rooms]), h = l.useMemo(() => $.filter((t) => a.requiredOptions.includes(t.value)).map((t) => t.label), [a.requiredOptions]), G = l.useMemo(() => h.length === 0 ? "선택사항 없음" : h.length > 2 ? `${h[0]}, ${h[1]} 외 ${h.length - 2}` : h.join(", "), [h]), M = l.useMemo(() => {
    const t = a.calendar.isOpen ? a.calendar.tempCheckIn ?? a.calendar.checkIn : a.calendar.checkIn;
    return H(t);
  }, [a.calendar.checkIn, a.calendar.isOpen, a.calendar.tempCheckIn]), w = l.useMemo(() => {
    const t = a.calendar.isOpen ? a.calendar.tempCheckOut ?? a.calendar.checkOut : a.calendar.checkOut;
    return H(t);
  }, [a.calendar.checkOut, a.calendar.isOpen, a.calendar.tempCheckOut]), V = l.useMemo(() => {
    const { tempCheckIn: t, tempCheckOut: r } = a.calendar;
    return !t || !r ? null : (r - t) / _ < T ? `* 최소 ${T}박 이상 선택해주세요` : null;
  }, [a.calendar.tempCheckIn, a.calendar.tempCheckOut]), F = l.useMemo(() => {
    const { checkIn: t, checkOut: r } = a.calendar;
    if (!t || !r)
      return;
    const u = (r - t) / _;
    return u >= 28 ? `한 달 살기 특가 적용 (${u}박)` : void 0;
  }, [a.calendar.checkIn, a.calendar.checkOut]), Y = l.useMemo(() => ({
    state: a,
    guestSummary: P,
    requiredOptionsSummary: G,
    checkInLabel: M,
    checkOutLabel: w,
    calendarWarning: V,
    searchButtonTitle: F,
    setDestinationValue: o,
    ensureDestinationOpen: d,
    toggleDestination: i,
    openDestinationInput: m,
    selectDestination: g,
    toggleGuest: E,
    adjustGuest: C,
    toggleOptions: p,
    toggleRequiredOption: D,
    toggleCalendar: L,
    showPreviousMonth: N,
    showNextMonth: S,
    setCalendarTab: k,
    selectFlexibleOption: I,
    selectCalendarDate: f,
    setCalendarHoverDate: x,
    clearCalendarHoverDate: A,
    clearCalendar: y,
    confirmCalendar: j,
    submitSearch: R,
    stopPropagation: c
  }), [
    a,
    P,
    G,
    M,
    w,
    V,
    F,
    o,
    d,
    i,
    m,
    g,
    E,
    C,
    p,
    D,
    L,
    N,
    S,
    k,
    I,
    f,
    x,
    A,
    y,
    j,
    R,
    c
  ]);
  return /* @__PURE__ */ s.jsx(W.Provider, { value: Y, children: e });
}, b = () => {
  const e = l.useContext(W);
  if (!e)
    throw new Error("LifeSearchWidget context missing");
  return e;
}, re = ["월", "화", "수", "목", "금", "토", "일"], oe = (e) => `${e.getFullYear()}년 ${e.getMonth() + 1}월`, de = () => {
  const {
    state: e,
    stopPropagation: a,
    showPreviousMonth: n,
    showNextMonth: c,
    setCalendarTab: o,
    selectFlexibleOption: d,
    selectCalendarDate: i,
    setCalendarHoverDate: m,
    clearCalendarHoverDate: g,
    clearCalendar: E,
    confirmCalendar: C,
    calendarWarning: p
  } = b();
  return /* @__PURE__ */ s.jsx(
    J,
    {
      calendar: e.calendar,
      clearButtonId: "btn-clear",
      confirmButtonId: "btn-confirm",
      flexibleOptions: te,
      footerStartContent: p ? /* @__PURE__ */ s.jsx("span", { className: "warning-text", "data-warning": "long-stay", children: p }) : null,
      monthLabelFormatter: oe,
      monthsContainerId: "calendarMonths",
      nextButtonId: "nextMonth",
      onClear: E,
      onConfirm: C,
      onDateHover: m,
      onDateHoverLeave: g,
      onDateSelect: i,
      onFlexibleOptionSelect: d,
      onInteract: a,
      onNextMonth: c,
      onPreviousMonth: n,
      onTabChange: o,
      panelCalendarId: "panel-calendar",
      panelFlexibleId: "panel-flexible",
      popupId: "calendarPopup",
      prevButtonId: "prevMonth",
      tabCalendarId: "tab-calendar",
      tabFlexibleId: "tab-flexible",
      weekStartsOn: "monday",
      weekdayLabels: re
    }
  );
}, ue = () => {
  const { state: e, adjustGuest: a, stopPropagation: n } = b();
  return /* @__PURE__ */ s.jsx(
    z,
    {
      isOpen: e.isGuestOpen,
      onAdjust: (c, o, d) => {
        a(c, o, d);
      },
      onInteract: n,
      popupId: "guestPopupLarge",
      rows: se,
      values: e.guest
    }
  );
}, pe = ({
  popupId: e,
  isOpen: a,
  options: n,
  selectedValues: c,
  onInteract: o,
  onToggle: d
}) => /* @__PURE__ */ s.jsx("div", { className: `options-popup-new${a ? " active" : ""}`, id: e, onClick: o, children: /* @__PURE__ */ s.jsx("div", { className: "options-grid", children: n.map((i) => /* @__PURE__ */ s.jsxs("label", { className: "option-check-item", children: [
  /* @__PURE__ */ s.jsx("span", { className: "option-name", "data-lang": i.dataLang, children: i.label }),
  /* @__PURE__ */ s.jsx(
    "input",
    {
      checked: c.includes(i.value),
      className: "option-checkbox",
      onChange: () => {
        d(i.value);
      },
      type: "checkbox",
      value: i.value
    }
  )
] }, i.value)) }) }), he = () => {
  const { state: e, stopPropagation: a, toggleRequiredOption: n } = b();
  return /* @__PURE__ */ s.jsx(
    pe,
    {
      isOpen: e.isOptionsOpen,
      onInteract: a,
      onToggle: n,
      options: $,
      popupId: "optionsPopupLarge",
      selectedValues: e.requiredOptions
    }
  );
}, Oe = () => {
  const {
    state: e,
    guestSummary: a,
    requiredOptionsSummary: n,
    checkInLabel: c,
    checkOutLabel: o,
    searchButtonTitle: d,
    ensureDestinationOpen: i,
    setDestinationValue: m,
    openDestinationInput: g,
    toggleDestination: E,
    selectDestination: C,
    stopPropagation: p,
    toggleGuest: D,
    toggleOptions: L,
    toggleCalendar: N,
    submitSearch: S
  } = b(), k = Z(
    e.destinationValue,
    e.hasTypedDestinationQuery,
    ee
  );
  return /* @__PURE__ */ s.jsx("div", { className: "search-widget-large long-stay-search-widget", children: /* @__PURE__ */ s.jsx("div", { className: "search-widget-v2", children: /* @__PURE__ */ s.jsxs("div", { className: "global-search-bar-v2", id: "mnSearchForm", children: [
    /* @__PURE__ */ s.jsxs("div", { className: `search-item-v2${e.isDestinationOpen ? " active" : ""}`, id: "destinationFieldLarge", onClick: E, children: [
      /* @__PURE__ */ s.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ s.jsx(v, { className: "life-search-icon", name: "map-pin" }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ s.jsx("label", { className: "item-label-v2", "data-lang": "lifeDestLabel", children: "여행지" }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            autoComplete: "off",
            className: "item-input-v2",
            "data-lang-placeholder": "lifeDestPlaceholder",
            id: "destinationInput",
            placeholder: "어디로 떠날까요?",
            type: "text",
            value: e.destinationValue,
            onFocus: i,
            onChange: (I) => {
              m(I.target.value);
            },
            onClick: g
          }
        )
      ] }),
      /* @__PURE__ */ s.jsx(
        ae,
        {
          columns: k,
          dropdownId: "destinationDropdown",
          isOpen: e.isDestinationOpen,
          onInteract: p,
          onSelect: C
        }
      )
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "v2-divider" }),
    /* @__PURE__ */ s.jsxs("div", { className: `search-item-v2${e.calendar.isOpen ? " active" : ""}`, id: "checkInField", onClick: N, children: [
      /* @__PURE__ */ s.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ s.jsx(v, { className: "life-search-icon", name: "calendar" }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ s.jsx("label", { className: "item-label-v2", "data-lang": "lifeScheduleLabel", children: "일정" }),
        /* @__PURE__ */ s.jsxs("div", { className: "display-text-v2", children: [
          /* @__PURE__ */ s.jsx("span", { "data-lang": "dateSelect", id: "checkInDisplay", children: c }),
          /* @__PURE__ */ s.jsx("span", { children: " - " }),
          /* @__PURE__ */ s.jsx("span", { "data-lang": "dateSelect", id: "checkOutDisplay", children: o })
        ] })
      ] }),
      /* @__PURE__ */ s.jsx(de, {})
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "v2-divider" }),
    /* @__PURE__ */ s.jsxs("div", { className: `search-item-v2${e.isGuestOpen ? " active" : ""}`, id: "guestFieldLarge", onClick: D, children: [
      /* @__PURE__ */ s.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ s.jsx(v, { className: "life-search-icon", name: "users" }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ s.jsx("label", { className: "item-label-v2", "data-lang": "lifeGuestLabel", children: "여행자" }),
        /* @__PURE__ */ s.jsx("div", { className: "display-text-v2", id: "guestSummary", children: a })
      ] }),
      /* @__PURE__ */ s.jsx(ue, {})
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "v2-divider" }),
    /* @__PURE__ */ s.jsxs("div", { className: `search-item-v2${e.isOptionsOpen ? " active" : ""}`, id: "optionsFieldLarge", onClick: L, children: [
      /* @__PURE__ */ s.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ s.jsx(v, { className: "life-search-icon", name: "sliders-horizontal" }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ s.jsx("label", { className: "item-label-v2", "data-lang": "lifeOptionsLabel", children: "필수 옵션" }),
        /* @__PURE__ */ s.jsx("div", { className: "display-text-v2", id: "optionsSummary", children: n })
      ] }),
      /* @__PURE__ */ s.jsx(he, {})
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "search-btn-wrapper-v2", children: /* @__PURE__ */ s.jsxs("button", { className: "search-btn-v2", id: "searchBtn", onClick: S, title: d, type: "button", children: [
      /* @__PURE__ */ s.jsx(v, { className: "life-search-button-icon", name: "search" }),
      /* @__PURE__ */ s.jsx("span", { "data-lang": "btnSearch", children: "검색하기" })
    ] }) })
  ] }) }) });
}, me = () => /* @__PURE__ */ s.jsx(ie, { children: /* @__PURE__ */ s.jsx(Oe, {}) }), ge = "jeju:search-widget-mounted", Le = () => (l.useLayoutEffect(() => {
  document.dispatchEvent(new Event(ge));
}, []), /* @__PURE__ */ s.jsx(me, {}));
export {
  Le as L
};
