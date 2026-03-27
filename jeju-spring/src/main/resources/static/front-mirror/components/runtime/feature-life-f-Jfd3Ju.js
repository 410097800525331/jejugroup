import { a as s, j as t } from "./react-vendor-BoSfm_Te.js";
import { b as v } from "./feature-layout-CKAG6DZw.js";
import { c as q, g as F, d as B, s as Y, S as K, e as Q, f as X, D as J } from "./feature-hotel-BPoDLJ_B.js";
const z = [
  { value: "3", dataLang: "calFlex3", label: "3박" },
  { value: "7", dataLang: "calFlex7", label: "1주일" },
  { value: "30", dataLang: "calFlex30", label: "1개월" }
], Z = [
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
], U = [
  { value: "kitchen", dataLang: "lifeOptionKitchen", label: "주방" },
  { value: "washer", dataLang: "lifeOptionWasher", label: "세탁기" },
  { value: "full-kitchen", dataLang: "lifeOptionFullKitchen", label: "풀옵션 주방" },
  { value: "washer-dryer", dataLang: "lifeOptionWasherDryer", label: "세탁기/건조기" },
  { value: "desk", dataLang: "lifeOptionDesk", label: "업무용 데스크" },
  { value: "parking", dataLang: "lifeOptionParking", label: "전용 주차장" }
], ee = "jeju:life-search-submit", S = 14, I = 24 * 60 * 60 * 1e3, ae = {
  destinationValue: "",
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
}, $ = s.createContext(null), H = (e) => {
  if (!e)
    return "날짜 선택";
  const a = new Date(e), n = a.getFullYear(), c = String(a.getMonth() + 1).padStart(2, "0"), r = String(a.getDate()).padStart(2, "0");
  return `${n}-${c}-${r}`;
}, ne = (e, a) => {
  switch (a.type) {
    case "SET_DESTINATION_VALUE":
      return {
        ...e,
        destinationValue: a.value
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
          visibleMonth: e.calendar.checkIn ? F(e.calendar.checkIn) : e.calendar.visibleMonth
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
          visibleMonth: Y(e.calendar.visibleMonth, a.delta)
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
          visibleMonth: n ? F(n) : e.calendar.visibleMonth
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
}, te = ({ children: e }) => {
  const [a, n] = s.useReducer(ne, ae);
  s.useEffect(() => {
    const l = () => {
      h(n);
    };
    return document.addEventListener("click", l), () => {
      document.removeEventListener("click", l);
    };
  }, []);
  const c = s.useCallback((l) => {
    l.stopPropagation();
  }, []), r = s.useCallback((l) => {
    n({ type: "SET_DESTINATION_VALUE", value: l });
  }, []), d = s.useCallback((l) => {
    l.stopPropagation(), h(n, "destinationDropdown"), n({ type: "TOGGLE_DESTINATION" });
  }, []), i = s.useCallback(
    (l) => {
      l.stopPropagation(), h(n, "destinationDropdown"), n({ type: "SET_DESTINATION_VALUE", value: l.currentTarget.value }), a.isDestinationOpen || n({ type: "TOGGLE_DESTINATION" });
    },
    [a.isDestinationOpen]
  ), O = s.useCallback((l) => {
    n({ type: "SET_DESTINATION_VALUE", value: l }), n({ type: "CLOSE_DESTINATION" });
  }, []), m = s.useCallback((l) => {
    l.stopPropagation(), h(n, "guestPopupLarge"), n({ type: "TOGGLE_GUEST" });
  }, []), g = s.useCallback((l, o, E) => {
    E.stopPropagation(), n({ type: "ADJUST_GUEST", key: l, delta: o });
  }, []), C = s.useCallback((l) => {
    l.stopPropagation(), h(n, "optionsPopupLarge"), n({ type: "TOGGLE_OPTIONS" });
  }, []), u = s.useCallback((l) => {
    n({ type: "TOGGLE_REQUIRED_OPTION", value: l });
  }, []), L = s.useCallback(
    (l) => {
      if (l.stopPropagation(), a.calendar.isOpen) {
        n({ type: "CLOSE_CALENDAR" });
        return;
      }
      h(n, "calendarPopup"), n({ type: "OPEN_CALENDAR" });
    },
    [a.calendar.isOpen]
  ), N = s.useCallback(() => {
    n({ type: "SHIFT_CALENDAR_MONTH", delta: -1 });
  }, []), k = s.useCallback(() => {
    n({ type: "SHIFT_CALENDAR_MONTH", delta: 1 });
  }, []), D = s.useCallback((l) => {
    n({ type: "SET_CALENDAR_TAB", tab: l });
  }, []), x = s.useCallback((l) => {
    n({ type: "SET_FLEXIBLE_OPTION", value: l });
  }, []), T = s.useCallback((l) => {
    n({ type: "SELECT_CALENDAR_DATE", timestamp: l });
  }, []), f = s.useCallback((l) => {
    n({ type: "SET_CALENDAR_HOVER_DATE", timestamp: l });
  }, []), _ = s.useCallback(() => {
    n({ type: "SET_CALENDAR_HOVER_DATE", timestamp: null });
  }, []), A = s.useCallback(() => {
    n({ type: "CLEAR_CALENDAR" });
  }, []), y = s.useCallback(() => {
    const { tempCheckIn: l, tempCheckOut: o } = a.calendar;
    if (!l && !o) {
      n({ type: "CLEAR_CALENDAR" }), n({ type: "CLOSE_CALENDAR" });
      return;
    }
    if (!l || !o) {
      window.alert("체크인과 체크아웃 날짜를 모두 선택해주세요");
      return;
    }
    if ((o - l) / I < S) {
      window.alert(`장기 체류 서비스는 최소 ${S}박부터 예약 가능합니다`);
      return;
    }
    n({ type: "CONFIRM_CALENDAR" });
  }, [a.calendar]), j = s.useCallback(() => {
    h(n), document.dispatchEvent(
      new CustomEvent(ee, {
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
  }, [a.calendar.checkIn, a.calendar.checkOut, a.calendar.flexibleValue, a.destinationValue, a.guest, a.requiredOptions]), P = s.useMemo(() => {
    const l = [`성인 ${a.guest.adults}명`, `객실 ${a.guest.rooms}개`];
    return a.guest.children > 0 && l.splice(1, 0, `아동 ${a.guest.children}명`), l.join(", ");
  }, [a.guest.adults, a.guest.children, a.guest.rooms]), p = s.useMemo(() => U.filter((l) => a.requiredOptions.includes(l.value)).map((l) => l.label), [a.requiredOptions]), R = s.useMemo(() => p.length === 0 ? "선택사항 없음" : p.length > 2 ? `${p[0]}, ${p[1]} 외 ${p.length - 2}` : p.join(", "), [p]), G = s.useMemo(() => {
    const l = a.calendar.isOpen ? a.calendar.tempCheckIn ?? a.calendar.checkIn : a.calendar.checkIn;
    return H(l);
  }, [a.calendar.checkIn, a.calendar.isOpen, a.calendar.tempCheckIn]), M = s.useMemo(() => {
    const l = a.calendar.isOpen ? a.calendar.tempCheckOut ?? a.calendar.checkOut : a.calendar.checkOut;
    return H(l);
  }, [a.calendar.checkOut, a.calendar.isOpen, a.calendar.tempCheckOut]), w = s.useMemo(() => {
    const { tempCheckIn: l, tempCheckOut: o } = a.calendar;
    return !l || !o ? null : (o - l) / I < S ? `* 최소 ${S}박 이상 선택해주세요` : null;
  }, [a.calendar.tempCheckIn, a.calendar.tempCheckOut]), V = s.useMemo(() => {
    const { checkIn: l, checkOut: o } = a.calendar;
    if (!l || !o)
      return;
    const E = (o - l) / I;
    return E >= 28 ? `한 달 살기 특가 적용 (${E}박)` : void 0;
  }, [a.calendar.checkIn, a.calendar.checkOut]), W = s.useMemo(() => ({
    state: a,
    guestSummary: P,
    requiredOptionsSummary: R,
    checkInLabel: G,
    checkOutLabel: M,
    calendarWarning: w,
    searchButtonTitle: V,
    setDestinationValue: r,
    toggleDestination: d,
    openDestinationInput: i,
    selectDestination: O,
    toggleGuest: m,
    adjustGuest: g,
    toggleOptions: C,
    toggleRequiredOption: u,
    toggleCalendar: L,
    showPreviousMonth: N,
    showNextMonth: k,
    setCalendarTab: D,
    selectFlexibleOption: x,
    selectCalendarDate: T,
    setCalendarHoverDate: f,
    clearCalendarHoverDate: _,
    clearCalendar: A,
    confirmCalendar: y,
    submitSearch: j,
    stopPropagation: c
  }), [
    a,
    P,
    R,
    G,
    M,
    w,
    V,
    r,
    d,
    i,
    O,
    m,
    g,
    C,
    u,
    L,
    N,
    k,
    D,
    x,
    T,
    f,
    _,
    A,
    y,
    j,
    c
  ]);
  return /* @__PURE__ */ t.jsx($.Provider, { value: W, children: e });
}, b = () => {
  const e = s.useContext($);
  if (!e)
    throw new Error("LifeSearchWidget context missing");
  return e;
}, le = ["월", "화", "수", "목", "금", "토", "일"], se = (e) => `${e.getFullYear()}년 ${e.getMonth() + 1}월`, ce = () => {
  const {
    state: e,
    stopPropagation: a,
    showPreviousMonth: n,
    showNextMonth: c,
    setCalendarTab: r,
    selectFlexibleOption: d,
    selectCalendarDate: i,
    setCalendarHoverDate: O,
    clearCalendarHoverDate: m,
    clearCalendar: g,
    confirmCalendar: C,
    calendarWarning: u
  } = b();
  return /* @__PURE__ */ t.jsx(
    K,
    {
      calendar: e.calendar,
      clearButtonId: "btn-clear",
      confirmButtonId: "btn-confirm",
      flexibleOptions: z,
      footerStartContent: u ? /* @__PURE__ */ t.jsx("span", { className: "warning-text", "data-warning": "long-stay", children: u }) : null,
      monthLabelFormatter: se,
      monthsContainerId: "calendarMonths",
      nextButtonId: "nextMonth",
      onClear: g,
      onConfirm: C,
      onDateHover: O,
      onDateHoverLeave: m,
      onDateSelect: i,
      onFlexibleOptionSelect: d,
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
      weekdayLabels: le
    }
  );
}, ie = () => {
  const { state: e, adjustGuest: a, stopPropagation: n } = b();
  return /* @__PURE__ */ t.jsx(
    Q,
    {
      isOpen: e.isGuestOpen,
      onAdjust: (c, r, d) => {
        a(c, r, d);
      },
      onInteract: n,
      popupId: "guestPopupLarge",
      rows: Z,
      values: e.guest
    }
  );
}, re = ({
  popupId: e,
  isOpen: a,
  options: n,
  selectedValues: c,
  onInteract: r,
  onToggle: d
}) => /* @__PURE__ */ t.jsx("div", { className: `options-popup-new${a ? " active" : ""}`, id: e, onClick: r, children: /* @__PURE__ */ t.jsx("div", { className: "options-grid", children: n.map((i) => /* @__PURE__ */ t.jsxs("label", { className: "option-check-item", children: [
  /* @__PURE__ */ t.jsx("span", { className: "option-name", "data-lang": i.dataLang, children: i.label }),
  /* @__PURE__ */ t.jsx(
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
] }, i.value)) }) }), oe = () => {
  const { state: e, stopPropagation: a, toggleRequiredOption: n } = b();
  return /* @__PURE__ */ t.jsx(
    re,
    {
      isOpen: e.isOptionsOpen,
      onInteract: a,
      onToggle: n,
      options: U,
      popupId: "optionsPopupLarge",
      selectedValues: e.requiredOptions
    }
  );
}, de = () => {
  const {
    state: e,
    guestSummary: a,
    requiredOptionsSummary: n,
    checkInLabel: c,
    checkOutLabel: r,
    searchButtonTitle: d,
    setDestinationValue: i,
    openDestinationInput: O,
    toggleDestination: m,
    selectDestination: g,
    stopPropagation: C,
    toggleGuest: u,
    toggleOptions: L,
    toggleCalendar: N,
    submitSearch: k
  } = b();
  return /* @__PURE__ */ t.jsx("div", { className: "search-widget-large long-stay-search-widget", children: /* @__PURE__ */ t.jsx("div", { className: "search-widget-v2", children: /* @__PURE__ */ t.jsxs("div", { className: "global-search-bar-v2", id: "mnSearchForm", children: [
    /* @__PURE__ */ t.jsxs("div", { className: `search-item-v2${e.isDestinationOpen ? " active" : ""}`, id: "destinationFieldLarge", onClick: m, children: [
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
            onChange: (D) => {
              i(D.target.value);
            },
            onClick: O
          }
        )
      ] }),
      /* @__PURE__ */ t.jsx(
        X,
        {
          columns: J,
          dropdownId: "destinationDropdown",
          isOpen: e.isDestinationOpen,
          onInteract: C,
          onSelect: g
        }
      )
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "v2-divider" }),
    /* @__PURE__ */ t.jsxs("div", { className: `search-item-v2${e.calendar.isOpen ? " active" : ""}`, id: "checkInField", onClick: N, children: [
      /* @__PURE__ */ t.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ t.jsx(v, { className: "life-search-icon", name: "calendar" }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ t.jsx("label", { className: "item-label-v2", "data-lang": "lifeScheduleLabel", children: "일정" }),
        /* @__PURE__ */ t.jsxs("div", { className: "display-text-v2", children: [
          /* @__PURE__ */ t.jsx("span", { "data-lang": "dateSelect", id: "checkInDisplay", children: c }),
          /* @__PURE__ */ t.jsx("span", { children: " - " }),
          /* @__PURE__ */ t.jsx("span", { "data-lang": "dateSelect", id: "checkOutDisplay", children: r })
        ] })
      ] }),
      /* @__PURE__ */ t.jsx(ce, {})
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "v2-divider" }),
    /* @__PURE__ */ t.jsxs("div", { className: `search-item-v2${e.isGuestOpen ? " active" : ""}`, id: "guestFieldLarge", onClick: u, children: [
      /* @__PURE__ */ t.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ t.jsx(v, { className: "life-search-icon", name: "users" }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ t.jsx("label", { className: "item-label-v2", "data-lang": "lifeGuestLabel", children: "여행자" }),
        /* @__PURE__ */ t.jsx("div", { className: "display-text-v2", id: "guestSummary", children: a })
      ] }),
      /* @__PURE__ */ t.jsx(ie, {})
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "v2-divider" }),
    /* @__PURE__ */ t.jsxs("div", { className: `search-item-v2${e.isOptionsOpen ? " active" : ""}`, id: "optionsFieldLarge", onClick: L, children: [
      /* @__PURE__ */ t.jsx("div", { className: "item-icon-v2", children: /* @__PURE__ */ t.jsx(v, { className: "life-search-icon", name: "sliders-horizontal" }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "item-content-v2", children: [
        /* @__PURE__ */ t.jsx("label", { className: "item-label-v2", "data-lang": "lifeOptionsLabel", children: "필수 옵션" }),
        /* @__PURE__ */ t.jsx("div", { className: "display-text-v2", id: "optionsSummary", children: n })
      ] }),
      /* @__PURE__ */ t.jsx(oe, {})
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "search-btn-wrapper-v2", children: /* @__PURE__ */ t.jsxs("button", { className: "search-btn-v2", id: "searchBtn", onClick: k, title: d, type: "button", children: [
      /* @__PURE__ */ t.jsx(v, { className: "life-search-button-icon", name: "search" }),
      /* @__PURE__ */ t.jsx("span", { "data-lang": "btnSearch", children: "검색하기" })
    ] }) })
  ] }) }) });
}, ue = () => /* @__PURE__ */ t.jsx(te, { children: /* @__PURE__ */ t.jsx(de, {}) }), pe = "jeju:search-widget-mounted", ge = () => (s.useLayoutEffect(() => {
  document.dispatchEvent(new Event(pe));
}, []), /* @__PURE__ */ t.jsx(ue, {}));
export {
  ge as L
};
