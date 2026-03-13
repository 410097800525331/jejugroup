import { r as c, j as a, H as o } from "./index-CoeQRDgQ.js";
import { g as _, a as P, s as G, c as w, S as F, F as V, b as B, D as U, d as W, G as $, e as X } from "./SearchGuestPopup-i_f_WXLe.js";
const Y = {
  activeTab: "hotel",
  destinationValue: "",
  isDestinationOpen: !1,
  isGuestOpen: !1,
  guest: {
    rooms: 1,
    adults: 1,
    children: 0
  },
  calendar: w()
}, y = c.createContext(null), f = (e, n) => {
  if (!e)
    return n;
  const t = new Date(e), l = t.getFullYear(), r = String(t.getMonth() + 1).padStart(2, "0"), i = String(t.getDate()).padStart(2, "0");
  return `${l}-${r}-${i}`;
}, J = (e, n) => {
  switch (n.type) {
    case "SET_ACTIVE_TAB":
      return {
        ...e,
        activeTab: n.tab,
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
        destinationValue: n.value
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
      const t = e.guest[n.key] + n.delta;
      return t < {
        rooms: 1,
        adults: 1,
        children: 0
      }[n.key] ? e : {
        ...e,
        guest: {
          ...e.guest,
          [n.key]: t
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
          visibleMonth: e.calendar.checkIn ? _(e.calendar.checkIn) : e.calendar.visibleMonth
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
          visibleMonth: G(e.calendar.visibleMonth, n.delta)
        }
      };
    case "SET_CALENDAR_TAB":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          activeTab: n.tab,
          hoverDate: null
        }
      };
    case "SET_FLEXIBLE_OPTION":
      return {
        ...e,
        calendar: {
          ...e.calendar,
          activeTab: "flexible",
          flexibleValue: n.value
        }
      };
    case "SELECT_CALENDAR_DATE": {
      const t = P(
        {
          tempCheckIn: e.calendar.tempCheckIn,
          tempCheckOut: e.calendar.tempCheckOut
        },
        n.timestamp
      );
      return {
        ...e,
        calendar: {
          ...e.calendar,
          ...t,
          activeTab: "calendar"
        }
      };
    }
    case "SET_CALENDAR_HOVER_DATE": {
      const t = n.timestamp && e.calendar.tempCheckIn && !e.calendar.tempCheckOut && n.timestamp > e.calendar.tempCheckIn ? n.timestamp : null;
      return {
        ...e,
        calendar: {
          ...e.calendar,
          hoverDate: t
        }
      };
    }
    case "CONFIRM_CALENDAR": {
      const t = e.calendar.tempCheckIn, l = e.calendar.tempCheckOut;
      return {
        ...e,
        calendar: {
          ...e.calendar,
          isOpen: !1,
          hoverDate: null,
          checkIn: t,
          checkOut: l,
          tempCheckIn: t,
          tempCheckOut: l,
          visibleMonth: t ? _(t) : e.calendar.visibleMonth
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
}, m = (e, n = null) => {
  n !== "destinationDropdown" && e({ type: "CLOSE_DESTINATION" }), n !== "guestPopupLarge" && e({ type: "CLOSE_GUEST" }), n !== "calendarPopup" && e({ type: "CLOSE_CALENDAR" });
}, K = ({ children: e }) => {
  const [n, t] = c.useReducer(J, Y);
  c.useEffect(() => {
    const s = () => {
      m(t);
    };
    return document.addEventListener("click", s), () => {
      document.removeEventListener("click", s);
    };
  }, []);
  const l = c.useCallback((s) => {
    s.stopPropagation();
  }, []), r = c.useCallback((s) => {
    m(t), t({ type: "SET_ACTIVE_TAB", tab: s });
  }, []), i = c.useCallback((s) => {
    t({ type: "SET_DESTINATION_VALUE", value: s });
  }, []), d = c.useCallback((s) => {
    s.stopPropagation(), m(t, "destinationDropdown"), t({ type: "TOGGLE_DESTINATION" });
  }, []), u = c.useCallback(
    (s) => {
      s.stopPropagation(), m(t, "destinationDropdown"), t({ type: "SET_DESTINATION_VALUE", value: s.currentTarget.value }), n.isDestinationOpen || t({ type: "TOGGLE_DESTINATION" });
    },
    [n.isDestinationOpen]
  ), h = c.useCallback((s) => {
    t({ type: "SET_DESTINATION_VALUE", value: s }), t({ type: "CLOSE_DESTINATION" });
  }, []), p = c.useCallback((s) => {
    s.stopPropagation(), m(t, "guestPopupLarge"), t({ type: "TOGGLE_GUEST" });
  }, []), E = c.useCallback((s, H, M) => {
    M.stopPropagation(), t({ type: "ADJUST_GUEST", key: s, delta: H });
  }, []), N = c.useCallback(
    (s) => {
      if (s.stopPropagation(), n.calendar.isOpen) {
        t({ type: "CONFIRM_CALENDAR" });
        return;
      }
      m(t, "calendarPopup"), t({ type: "OPEN_CALENDAR" });
    },
    [n.calendar.isOpen]
  ), b = c.useCallback(() => {
    t({ type: "SHIFT_CALENDAR_MONTH", delta: -1 });
  }, []), O = c.useCallback(() => {
    t({ type: "SHIFT_CALENDAR_MONTH", delta: 1 });
  }, []), g = c.useCallback((s) => {
    t({ type: "SET_CALENDAR_TAB", tab: s });
  }, []), T = c.useCallback((s) => {
    t({ type: "SET_FLEXIBLE_OPTION", value: s });
  }, []), x = c.useCallback((s) => {
    t({ type: "SELECT_CALENDAR_DATE", timestamp: s });
  }, []), v = c.useCallback((s) => {
    t({ type: "SET_CALENDAR_HOVER_DATE", timestamp: s });
  }, []), D = c.useCallback(() => {
    t({ type: "SET_CALENDAR_HOVER_DATE", timestamp: null });
  }, []), S = c.useCallback(() => {
    t({ type: "CLEAR_CALENDAR" });
  }, []), I = c.useCallback(() => {
    t({ type: "CONFIRM_CALENDAR" });
  }, []), k = n.activeTab !== "activity", A = c.useMemo(() => {
    const s = [`성인 ${n.guest.adults}명`, `객실 ${n.guest.rooms}개`];
    return n.guest.children > 0 && s.push(`아동 ${n.guest.children}명`), s.join(", ");
  }, [n.guest.adults, n.guest.children, n.guest.rooms]), j = c.useMemo(() => {
    const s = n.calendar.isOpen ? n.calendar.tempCheckIn ?? n.calendar.checkIn : n.calendar.checkIn;
    return f(s, "체크인");
  }, [n.calendar.checkIn, n.calendar.isOpen, n.calendar.tempCheckIn]), L = c.useMemo(() => {
    const s = n.calendar.isOpen ? n.calendar.tempCheckOut ?? n.calendar.checkOut : n.calendar.checkOut;
    return f(s, "체크아웃");
  }, [n.calendar.checkOut, n.calendar.isOpen, n.calendar.tempCheckOut]), R = c.useMemo(() => ({
    state: n,
    isHotelMode: k,
    guestSummary: A,
    checkInLabel: j,
    checkOutLabel: L,
    setActiveTab: r,
    setDestinationValue: i,
    toggleDestination: d,
    openDestinationInput: u,
    selectDestination: h,
    toggleGuest: p,
    adjustGuest: E,
    toggleCalendar: N,
    showPreviousMonth: b,
    showNextMonth: O,
    setCalendarTab: g,
    selectFlexibleOption: T,
    selectCalendarDate: x,
    setCalendarHoverDate: v,
    clearCalendarHoverDate: D,
    clearCalendar: S,
    confirmCalendar: I,
    stopPropagation: l
  }), [
    n,
    k,
    A,
    j,
    L,
    r,
    i,
    d,
    u,
    h,
    p,
    E,
    N,
    b,
    O,
    g,
    T,
    x,
    v,
    D,
    S,
    I,
    l
  ]);
  return /* @__PURE__ */ a.jsx(y.Provider, { value: R, children: e });
}, C = () => {
  const e = c.useContext(y);
  if (!e)
    throw new Error("HotelSearchWidget context missing");
  return e;
}, q = () => {
  const { state: e } = C();
  return /* @__PURE__ */ a.jsx("div", { className: `search-form-new${e.activeTab === "activity" ? "" : " hidden"}`, id: "searchFormActivity", children: /* @__PURE__ */ a.jsx("div", { className: "global-search-container", children: /* @__PURE__ */ a.jsxs("div", { className: "global-search-bar", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "search-item destination-item-new", id: "destinationFieldActivity", children: [
      /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(o, { className: "search-field-icon", name: "search" }) }),
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
      /* @__PURE__ */ a.jsx(o, { className: "search-btn-icon", name: "search" }),
      /* @__PURE__ */ a.jsx("span", { className: "search-btn-text", children: "검색" })
    ] }) })
  ] }) }) });
}, z = ["일", "월", "화", "수", "목", "금", "토"], Q = (e) => `${e.getFullYear()}년 ${e.getMonth() + 1}월`, Z = () => {
  const {
    state: e,
    stopPropagation: n,
    showPreviousMonth: t,
    showNextMonth: l,
    setCalendarTab: r,
    selectFlexibleOption: i,
    selectCalendarDate: d,
    setCalendarHoverDate: u,
    clearCalendarHoverDate: h,
    clearCalendar: p,
    confirmCalendar: E
  } = C();
  return /* @__PURE__ */ a.jsx(
    F,
    {
      calendar: e.calendar,
      clearButtonId: "btn-clear",
      confirmButtonId: "btn-confirm",
      flexibleOptions: V,
      monthLabelFormatter: Q,
      monthsContainerId: "calendarMonths",
      nextButtonId: "nextMonth",
      onClear: p,
      onConfirm: E,
      onDateHover: u,
      onDateHoverLeave: h,
      onDateSelect: d,
      onFlexibleOptionSelect: i,
      onInteract: n,
      onNextMonth: l,
      onPreviousMonth: t,
      onTabChange: r,
      panelCalendarId: "panel-calendar",
      panelFlexibleId: "panel-flexible",
      popupId: "calendarPopup",
      prevButtonId: "prevMonth",
      tabCalendarId: "tab-calendar",
      tabFlexibleId: "tab-flexible",
      weekStartsOn: "sunday",
      weekdayLabels: z
    }
  );
}, ee = () => {
  const { state: e, selectDestination: n, stopPropagation: t } = C();
  return /* @__PURE__ */ a.jsx(
    B,
    {
      columns: U,
      dropdownId: "destinationDropdown",
      isOpen: e.isDestinationOpen,
      onInteract: t,
      onSelect: n
    }
  );
}, ae = () => {
  const { state: e, adjustGuest: n, stopPropagation: t } = C();
  return /* @__PURE__ */ a.jsx(
    W,
    {
      isOpen: e.isGuestOpen,
      onAdjust: (l, r, i) => {
        n(l, r, i);
      },
      onInteract: t,
      popupId: "guestPopupLarge",
      rows: $,
      values: e.guest
    }
  );
}, ne = () => {
  const {
    state: e,
    checkInLabel: n,
    checkOutLabel: t,
    guestSummary: l,
    setDestinationValue: r,
    openDestinationInput: i,
    toggleDestination: d,
    toggleGuest: u,
    toggleCalendar: h
  } = C();
  return /* @__PURE__ */ a.jsx("div", { className: `search-form-new${e.activeTab === "activity" ? " hidden" : ""}`, id: "searchFormHotel", children: /* @__PURE__ */ a.jsx("div", { className: "global-search-container", children: /* @__PURE__ */ a.jsxs("div", { className: "global-search-bar", children: [
    /* @__PURE__ */ a.jsxs("div", { className: "search-item destination-item-new", id: "destinationFieldLarge", onClick: d, children: [
      /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(o, { className: "search-field-icon", name: "search" }) }),
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
            onChange: (p) => {
              r(p.target.value);
            },
            onClick: i
          }
        )
      ] }),
      /* @__PURE__ */ a.jsx(ee, {})
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ a.jsxs("div", { className: "search-item date-item-new", id: "checkInField", onClick: h, children: [
      /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(o, { className: "search-field-icon", name: "calendar" }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ a.jsx("label", { className: "item-label", "data-lang": "dateLabel", children: "체크인 - 체크아웃" }),
        /* @__PURE__ */ a.jsxs("div", { className: "date-display-text", children: [
          /* @__PURE__ */ a.jsx("span", { "data-lang": "dateSelect", id: "checkInDisplay", children: n }),
          /* @__PURE__ */ a.jsx("span", { className: "date-separator", children: " - " }),
          /* @__PURE__ */ a.jsx("span", { "data-lang": "dateSelect", id: "checkOutDisplay", children: t })
        ] })
      ] }),
      /* @__PURE__ */ a.jsx(Z, {})
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "search-divider" }),
    /* @__PURE__ */ a.jsxs("div", { className: "search-item guest-item-new", id: "guestFieldLarge", onClick: u, children: [
      /* @__PURE__ */ a.jsx("div", { className: "item-icon", children: /* @__PURE__ */ a.jsx(o, { className: "search-field-icon", name: "users" }) }),
      /* @__PURE__ */ a.jsxs("div", { className: "item-content", children: [
        /* @__PURE__ */ a.jsx("label", { className: "item-label", "data-lang": "guestLabel", children: "여행자" }),
        /* @__PURE__ */ a.jsx("div", { className: "guest-display-text", children: /* @__PURE__ */ a.jsx("span", { id: "guestSummary", children: l }) })
      ] }),
      /* @__PURE__ */ a.jsx(ae, {})
    ] }),
    /* @__PURE__ */ a.jsx("div", { className: "search-btn-wrapper", children: /* @__PURE__ */ a.jsxs("button", { className: "search-btn-pill", id: "searchBtn", children: [
      /* @__PURE__ */ a.jsx(o, { className: "search-btn-icon", name: "search" }),
      /* @__PURE__ */ a.jsx("span", { className: "search-btn-text", "data-lang": "searchBtn", children: "검색" })
    ] }) })
  ] }) }) });
}, te = ({ activeTab: e, items: n, onTabChange: t, onInteract: l }) => /* @__PURE__ */ a.jsx("div", { className: "search-tabs-large", onClick: l, children: n.map((r) => /* @__PURE__ */ a.jsxs(
  "button",
  {
    className: `search-tab-large${e === r.tab ? " active" : ""}`,
    "data-tab": r.tab,
    onClick: () => {
      t(r.tab);
    },
    type: "button",
    children: [
      /* @__PURE__ */ a.jsx(o, { className: "search-tab-icon", name: r.icon }),
      /* @__PURE__ */ a.jsx("span", { "data-lang": r.dataLang, children: r.label })
    ]
  },
  r.tab
)) }), se = () => {
  const { state: e, setActiveTab: n, stopPropagation: t } = C();
  return /* @__PURE__ */ a.jsx(
    te,
    {
      activeTab: e.activeTab,
      items: X,
      onInteract: t,
      onTabChange: (l) => {
        n(l);
      }
    }
  );
}, ce = () => /* @__PURE__ */ a.jsx(K, { children: /* @__PURE__ */ a.jsxs("div", { className: "search-widget-large", children: [
  /* @__PURE__ */ a.jsx(se, {}),
  /* @__PURE__ */ a.jsx(ne, {}),
  /* @__PURE__ */ a.jsx(q, {})
] }) }), le = "jeju:hotel-search-widget-mounted", oe = () => (c.useEffect(() => {
  const e = window.lucide;
  e != null && e.createIcons && e.createIcons(), document.dispatchEvent(new Event(le));
}, []), /* @__PURE__ */ a.jsx(ce, {}));
export {
  le as HOTEL_SEARCH_WIDGET_MOUNTED_EVENT,
  oe as HotelSearchWidgetIsland
};
