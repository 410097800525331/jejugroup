import { a as l, j as t } from "./react-vendor-BoSfm_Te.js";
import { b as v } from "./feature-layout-MqEyxW8f.js";
import { c as Y, g as U, d as B, s as Q, S as K, e as X, f as J, D as z, h as Z } from "./feature-hotel-0wDBN8rD.js";
const ee = [
  { value: "3", dataLang: "calFlex3", label: "3박" },
  { value: "7", dataLang: "calFlex7", label: "1주일" },
  { value: "30", dataLang: "calFlex30", label: "1개월" }
], ae = [
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
], ne = "jeju:life-search-submit", I = 14, _ = 24 * 60 * 60 * 1e3, te = {
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
  calendar: Y()
}, W = l.createContext(null), H = (e) => {
  if (!e)
    return "날짜 선택";
  const a = new Date(e), n = a.getFullYear(), c = String(a.getMonth() + 1).padStart(2, "0"), r = String(a.getDate()).padStart(2, "0");
  return `${n}-${c}-${r}`;
}, se = (e, a) => {
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
          visibleMonth: Q(e.calendar.visibleMonth, a.delta)
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
      const n = B(
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
}, h = (e, a = null) => {
  a !== "destinationDropdown" && e({ type: "CLOSE_DESTINATION" }), a !== "guestPopupLarge" && e({ type: "CLOSE_GUEST" }), a !== "optionsPopupLarge" && e({ type: "CLOSE_OPTIONS" }), a !== "calendarPopup" && e({ type: "CLOSE_CALENDAR" });
}, le = ({ children: e }) => {
  const [a, n] = l.useReducer(se, te);
  l.useEffect(() => {
    const s = () => {
      h(n);
    };
    return document.addEventListener("click", s), () => {
      document.removeEventListener("click", s);
    };
  }, []);
  const c = l.useCallback((s) => {
    s.stopPropagation();
  }, []), r = l.useCallback((s) => {
    n({ type: "SET_DESTINATION_VALUE", value: s }), n({ type: "MARK_TYPED_DESTINATION_QUERY" });
  }, []), o = l.useCallback(() => {
    h(n, "destinationDropdown"), a.isDestinationOpen || n({ type: "TOGGLE_DESTINATION" });
  }, [a.isDestinationOpen]), i = l.useCallback((s) => {
    s.stopPropagation(), h(n, "destinationDropdown"), n({ type: "TOGGLE_DESTINATION" });
  }, []), O = l.useCallback(
    (s) => {
      s.stopPropagation(), o();
    },
    [o]
  ), m = l.useCallback((s) => {
    n({ type: "SET_DESTINATION_VALUE", value: s }), n({ type: "RESET_TYPED_DESTINATION_QUERY" }), n({ type: "CLOSE_DESTINATION" });
  }, []), g = l.useCallback((s) => {
    s.stopPropagation(), h(n, "guestPopupLarge"), n({ type: "TOGGLE_GUEST" });
  }, []), E = l.useCallback((s, d, C) => {
    C.stopPropagation(), n({ type: "ADJUST_GUEST", key: s, delta: d });
  }, []), u = l.useCallback((s) => {
    s.stopPropagation(), h(n, "optionsPopupLarge"), n({ type: "TOGGLE_OPTIONS" });
  }, []), D = l.useCallback((s) => {
    n({ type: "TOGGLE_REQUIRED_OPTION", value: s });
  }, []), N = l.useCallback(
    (s) => {
      if (s.stopPropagation(), a.calendar.isOpen) {
        n({ type: "CLOSE_CALENDAR" });
        return;
      }
      h(n, "calendarPopup"), n({ type: "OPEN_CALENDAR" });
    },
    [a.calendar.isOpen]
  ), L = l.useCallback(() => {
    n({ type: "SHIFT_CALENDAR_MONTH", delta: -1 });
  }, []), k = l.useCallback(() => {
    n({ type: "SHIFT_CALENDAR_MONTH", delta: 1 });
  }, []), S = l.useCallback((s) => {
    n({ type: "SET_CALENDAR_TAB", tab: s });
  }, []), T = l.useCallback((s) => {
    n({ type: "SET_FLEXIBLE_OPTION", value: s });
  }, []), f = l.useCallback((s) => {
    n({ type: "SELECT_CALENDAR_DATE", timestamp: s });
  }, []), x = l.useCallback((s) => {
    n({ type: "SET_CALENDAR_HOVER_DATE", timestamp: s });
  }, []), A = l.useCallback(() => {
    n({ type: "SET_CALENDAR_HOVER_DATE", timestamp: null });
  }, []), y = l.useCallback(() => {
    n({ type: "CLEAR_CALENDAR" });
  }, []), j = l.useCallback(() => {
    const { tempCheckIn: s, tempCheckOut: d } = a.calendar;
    if (!s && !d) {
      n({ type: "CLEAR_CALENDAR" }), n({ type: "CLOSE_CALENDAR" });
      return;
    }
    if (!s || !d) {
      window.alert("체크인과 체크아웃 날짜를 모두 선택해주세요");
      return;
    }
    if ((d - s) / _ < I) {
      window.alert(`장기 체류 서비스는 최소 ${I}박부터 예약 가능합니다`);
      return;
    }
    n({ type: "CONFIRM_CALENDAR" });
  }, [a.calendar]), R = l.useCallback(() => {
    h(n), document.dispatchEvent(
      new CustomEvent(ne, {
        detail: {
          destination: a.destinationValue.trim(),
          guest: a.guest,
          requiredOptions: a.requiredOptions,
          checkIn: a.calendar.checkIn,
          checkOut: a.calendar.checkOut,
          flexibleValue: a.calendar.flexibleValue
        }
      })
    );
  }, [a.calendar.checkIn, a.calendar.checkOut, a.calendar.flexibleValue, a.destinationValue, a.guest, a.requiredOptions]), P = l.useMemo(() => {
    const s = [`성인 ${a.guest.adults}명`, `객실 ${a.guest.rooms}개`];
    return a.guest.children > 0 && s.splice(1, 0, `아동 ${a.guest.children}명`), s.join(", ");
  }, [a.guest.adults, a.guest.children, a.guest.rooms]), p = l.useMemo(() => $.filter((s) => a.requiredOptions.includes(s.value)).map((s) => s.label), [a.requiredOptions]), G = l.useMemo(() => p.length === 0 ? "선택사항 없음" : p.length > 2 ? `${p[0]}, ${p[1]} 외 ${p.length - 2}` : p.join(", "), [p]), M = l.useMemo(() => {
    const s = a.calendar.isOpen ? a.calendar.tempCheckIn ?? a.calendar.checkIn : a.calendar.checkIn;
    return H(s);
  }, [a.calendar.checkIn, a.calendar.isOpen, a.calendar.tempCheckIn]), w = l.useMemo(() => {
    const s = a.calendar.isOpen ? a.calendar.tempCheckOut ?? a.calendar.checkOut : a.calendar.checkOut;
    return H(s);
  }, [a.calendar.checkOut, a.calendar.isOpen, a.calendar.tempCheckOut]), V = l.useMemo(() => {
    const { tempCheckIn: s, tempCheckOut: d } = a.calendar;
    return !s || !d ? null : (d - s) / _ < I ? `* 최소 ${I}박 이상 선택해주세요` : null;
  }, [a.calendar.tempCheckIn, a.calendar.tempCheckOut]), F = l.useMemo(() => {
    const { checkIn: s, checkOut: d } = a.calendar;
    if (!s || !d)
      return;
    const C = (d - s) / _;
    return C >= 28 ? `한 달 살기 특가 적용 (${C}박)` : void 0;
  }, [a.calendar.checkIn, a.calendar.checkOut]), q = l.useMemo(() => ({
    state: a,
    guestSummary: P,
    requiredOptionsSummary: G,
    checkInLabel: M,
    checkOutLabel: w,
    calendarWarning: V,
    searchButtonTitle: F,
    setDestinationValue: r,
    ensureDestinationOpen: o,
    toggleDestination: i,
    openDestinationInput: O,
    selectDestination: m,
    toggleGuest: g,
    adjustGuest: E,
    toggleOptions: u,
    toggleRequiredOption: D,
    toggleCalendar: N,
    showPreviousMonth: L,
    showNextMonth: k,
    setCalendarTab: S,
    selectFlexibleOption: T,
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
    r,
    o,
    i,
    O,
    m,
    g,
    E,
    u,
    D,
    N,
    L,
    k,
    S,
    T,
    f,
    x,
    A,
    y,
    j,
    R,
    c
  ]);
  return /* @__PURE__ */ t.jsx(W.Provider, { value: q, children: e });
}, b = () => {
  const e = l.useContext(W);
  if (!e)
    throw new Error("LifeSearchWidget context missing");
  return e;
}, ce = ["월", "화", "수", "목", "금", "토", "일"], ie = (e) => `${e.getFullYear()}년 ${e.getMonth() + 1}월`, re = () => {
  const {
    state: e,
    stopPropagation: a,
    showPreviousMonth: n,
    showNextMonth: c,
    setCalendarTab: r,
    selectFlexibleOption: o,
    selectCalendarDate: i,
    setCalendarHoverDate: O,
    clearCalendarHoverDate: m,
    clearCalendar: g,
    confirmCalendar: E,
    calendarWarning: u
  } = b();
  return /* @__PURE__ */ t.jsx(
    K,
    {
      calendar: e.calendar,
      clearButtonId: "btn-clear",
      confirmButtonId: "btn-confirm",
      flexibleOptions: ee,
      footerStartContent: u ? /* @__PURE__ */ t.jsx("span", { className: "warning-text", "data-warning": "long-stay", children: u }) : null,
      monthLabelFormatter: ie,
      monthsContainerId: "calendarMonths",
      nextButtonId: "nextMonth",
      onClear: g,
      onConfirm: E,
      onDateHover: O,
      onDateHoverLeave: m,
      onDateSelect: i,
      onFlexibleOptionSelect: o,
      onInteract: a,
      onNextMonth: c,
      onPreviousMonth: n,
      onTabChange: r,
      panelCalendarId: "panel-calendar",
      panelFlexibleId: "panel-flexible",
      popupId: "calendarPopup",
      prevButtonId: "prevMonth",
      tabCalendarId: "tab-calendar",
      tabFlexibleId: "tab-flexible",
      weekStartsOn: "monday",
      weekdayLabels: ce
    }
  );
}, oe = () => {
  const { state: e, adjustGuest: a, stopPropagation: n } = b();
  return /* @__PURE__ */ t.jsx(
    X,
    {
      isOpen: e.isGuestOpen,
      onAdjust: (c, r, o) => {
        a(c, r, o);
      },
      onInteract: n,
      popupId: "guestPopupLarge",
      rows: ae,
      values: e.guest
    }
  );
}, de = ({
  popupId: e,
  isOpen: a,
  options: n,
  selectedValues: c,
  onInteract: r,
  onToggle: o
}) => /* @__PURE__ */ t.jsx("div", { className: `options-popup-new${a ? " active" : ""}`, id: e, onClick: r, children: /* @__PURE__ */ t.jsx("div", { className: "options-grid", children: n.map((i) => /* @__PURE__ */ t.jsxs("label", { className: "option-check-item", children: [
  /* @__PURE__ */ t.jsx("span", { className: "option-name", "data-lang": i.dataLang, children: i.label }),
  /* @__PURE__ */ t.jsx(
    "input",
    {
      checked: c.includes(i.value),
      className: "option-checkbox",
      onChange: () => {
        o(i.value);
      },
      type: "checkbox",
      value: i.value
    }
  )
] }, i.value)) }) }), ue = () => {
  const { state: e, stopPropagation: a, toggleRequiredOption: n } = b();
  return /* @__PURE__ */ t.jsx(
    de,
    {
      isOpen: e.isOptionsOpen,
      onInteract: a,
      onToggle: n,
      options: $,
      popupId: "optionsPopupLarge",
      selectedValues: e.requiredOptions
    }
  );
}, pe = () => {
  const {
    state: e,
    guestSummary: a,
    requiredOptionsSummary: n,
    checkInLabel: c,
    checkOutLabel: r,
    searchButtonTitle: o,
    ensureDestinationOpen: i,
    setDestinationValue: O,
    openDestinationInput: m,
    toggleDestination: g,
    selectDestination: E,
    stopPropagation: u,
    toggleGuest: D,
    toggleOptions: N,
    toggleCalendar: L,
    submitSearch: k
  } = b(), S = J(
    e.destinationValue,
    e.hasTypedDestinationQuery,
    z
  );
  return /* @__PURE__ */ t.jsx("div", { className: "search-widget-large long-stay-search-widget", children: /* @__PURE__ */ t.jsx("div", { className: "search-widget-v2", children: /* @__PURE__ */ t.jsxs("div", { className: "global-search-bar-v2", id: "mnSearchForm", children: [
    /* @__PURE__ */ t.jsxs("div", { className: `search-item-v2${e.isDestinationOpen ? " active" : ""}`, id: "destinationFieldLarge", onClick: g, children: [
      /* @__PURE__ */ t.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ t.jsx(v, { className: "life-search-icon", name: "map-pin" }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ t.jsx("label", { className: "item-label-v2", "data-lang": "lifeDestLabel", children: "여행지" }),
        /* @__PURE__ */ t.jsx(
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
            onChange: (T) => {
              O(T.target.value);
            },
            onClick: m
          }
        )
      ] }),
      /* @__PURE__ */ t.jsx(
        Z,
        {
          columns: S,
          dropdownId: "destinationDropdown",
          isOpen: e.isDestinationOpen,
          onInteract: u,
          onSelect: E
        }
      )
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "v2-divider" }),
    /* @__PURE__ */ t.jsxs("div", { className: `search-item-v2${e.calendar.isOpen ? " active" : ""}`, id: "checkInField", onClick: L, children: [
      /* @__PURE__ */ t.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ t.jsx(v, { className: "life-search-icon", name: "calendar" }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ t.jsx("label", { className: "item-label-v2", "data-lang": "lifeScheduleLabel", children: "일정" }),
        /* @__PURE__ */ t.jsxs("div", { className: "display-text-v2", children: [
          /* @__PURE__ */ t.jsx("span", { "data-lang": "dateSelect", id: "checkInDisplay", children: c }),
          /* @__PURE__ */ t.jsx("span", { children: " - " }),
          /* @__PURE__ */ t.jsx("span", { "data-lang": "dateSelect", id: "checkOutDisplay", children: r })
        ] })
      ] }),
      /* @__PURE__ */ t.jsx(re, {})
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "v2-divider" }),
    /* @__PURE__ */ t.jsxs("div", { className: `search-item-v2${e.isGuestOpen ? " active" : ""}`, id: "guestFieldLarge", onClick: D, children: [
      /* @__PURE__ */ t.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ t.jsx(v, { className: "life-search-icon", name: "users" }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ t.jsx("label", { className: "item-label-v2", "data-lang": "lifeGuestLabel", children: "여행자" }),
        /* @__PURE__ */ t.jsx("div", { className: "display-text-v2", id: "guestSummary", children: a })
      ] }),
      /* @__PURE__ */ t.jsx(oe, {})
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "v2-divider" }),
    /* @__PURE__ */ t.jsxs("div", { className: `search-item-v2${e.isOptionsOpen ? " active" : ""}`, id: "optionsFieldLarge", onClick: N, children: [
      /* @__PURE__ */ t.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ t.jsx(v, { className: "life-search-icon", name: "sliders-horizontal" }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ t.jsx("label", { className: "item-label-v2", "data-lang": "lifeOptionsLabel", children: "필수 옵션" }),
        /* @__PURE__ */ t.jsx("div", { className: "display-text-v2", id: "optionsSummary", children: n })
      ] }),
      /* @__PURE__ */ t.jsx(ue, {})
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "search-btn-wrapper-v2", children: /* @__PURE__ */ t.jsxs("button", { className: "search-btn-v2", id: "searchBtn", onClick: k, title: o, type: "button", children: [
      /* @__PURE__ */ t.jsx(v, { className: "life-search-button-icon", name: "search" }),
      /* @__PURE__ */ t.jsx("span", { "data-lang": "btnSearch", children: "검색하기" })
    ] }) })
  ] }) }) });
}, he = () => /* @__PURE__ */ t.jsx(le, { children: /* @__PURE__ */ t.jsx(pe, {}) }), Oe = "jeju:search-widget-mounted", Ce = () => (l.useLayoutEffect(() => {
  document.dispatchEvent(new Event(Oe));
}, []), /* @__PURE__ */ t.jsx(he, {}));
export {
  Ce as L
};
