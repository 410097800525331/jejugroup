import { r as E, j as e, H as R } from "./index-CoeQRDgQ.js";
const w = {
  monday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  sunday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
}, S = (a) => {
  const s = new Date(a);
  return s.setHours(0, 0, 0, 0), s.getTime();
}, F = (a) => {
  const s = new Date(a);
  return s.setDate(1), s.setHours(0, 0, 0, 0), s.getTime();
}, z = (a, s) => {
  const i = new Date(a);
  return i.setMonth(i.getMonth() + s, 1), F(i);
}, G = (a = {}) => {
  const s = a.checkIn ?? a.tempCheckIn ?? a.visibleMonth ?? Date.now(), i = F(a.visibleMonth ?? s);
  return {
    ...{
      isOpen: !1,
      activeTab: "calendar",
      visibleMonth: i,
      hoverDate: null,
      checkIn: null,
      checkOut: null,
      tempCheckIn: null,
      tempCheckOut: null,
      flexibleValue: null
    },
    ...a,
    visibleMonth: i
  };
}, H = (a = "sunday") => w[a], U = ({ tempCheckIn: a, tempCheckOut: s }, i) => {
  const l = S(i);
  return !a || s ? {
    tempCheckIn: l,
    tempCheckOut: null,
    hoverDate: null
  } : l < a ? {
    tempCheckIn: l,
    tempCheckOut: null,
    hoverDate: null
  } : l > a ? {
    tempCheckIn: a,
    tempCheckOut: l,
    hoverDate: null
  } : {
    tempCheckIn: a,
    tempCheckOut: s,
    hoverDate: null
  };
}, I = (a, s) => s === "monday" ? a === 0 ? 6 : a - 1 : a, _ = (a, s) => typeof s == "function" ? s(a) : `${a.getFullYear()}-${String(a.getMonth() + 1).padStart(2, "0")}`, W = (a) => `${a.getFullYear()}년 ${a.getMonth() + 1}월 ${a.getDate()}일`, V = ({
  visibleMonth: a,
  checkIn: s,
  checkOut: i,
  hoverDate: l,
  monthsToRender: m = 2,
  weekStartsOn: h = "sunday",
  weekdayLabels: t = null,
  monthLabelFormatter: v = null,
  today: M = S(Date.now())
}) => {
  const f = S(M), k = s && !i && l && l > s ? l : null, c = Array.isArray(t) && t.length === 7 ? t : H(h);
  return Array.from({ length: m }, ($, T) => {
    const b = new Date(a);
    b.setMonth(b.getMonth() + T, 1);
    const g = b.getFullYear(), p = b.getMonth(), j = new Date(g, p, 1).getDay(), B = I(j, h), O = new Date(g, p + 1, 0).getDate(), y = [];
    for (let r = 0; r < B; r += 1)
      y.push({
        key: `${g}-${p + 1}-outside-${r}`,
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
    for (let r = 1; r <= O; r += 1) {
      const P = new Date(g, p, r), o = S(P), N = s === o, x = i === o, L = k === o, C = N && !!(i || k) || x && !!s;
      y.push({
        key: `${g}-${p + 1}-${r}`,
        label: String(r),
        ariaLabel: W(P),
        timestamp: o,
        day: r,
        isOutside: !1,
        isDisabled: o < f,
        isToday: o === f,
        isSelected: N || x,
        isCheckIn: N,
        isCheckOut: x,
        isInRange: !!(s && i && o > s && o < i),
        isHoverRange: !!(k && s && o > s && o < k),
        isHoverEnd: L,
        hasRange: C
      });
    }
    return {
      key: `${g}-${p + 1}`,
      label: _(b, v),
      weekdays: c,
      days: y
    };
  });
}, K = ({
  popupId: a,
  monthsContainerId: s,
  panelCalendarId: i,
  panelFlexibleId: l,
  prevButtonId: m,
  nextButtonId: h,
  clearButtonId: t,
  confirmButtonId: v,
  tabCalendarId: M,
  tabFlexibleId: f,
  flexibleOptions: k,
  calendar: c,
  onInteract: $,
  onClear: T,
  onConfirm: b,
  onPreviousMonth: g,
  onNextMonth: p,
  onTabChange: j,
  onFlexibleOptionSelect: B,
  onDateSelect: O,
  onDateHover: y,
  onDateHoverLeave: r,
  dialogLabel: P = "체크인 날짜 선택 달력",
  weekStartsOn: o = "sunday",
  weekdayLabels: N = null,
  monthLabelFormatter: x = null,
  monthsToRender: L = 2,
  footerStartContent: C = null
}) => {
  const D = c.activeTab === "calendar", A = E.useMemo(() => V({
    visibleMonth: c.visibleMonth,
    checkIn: c.tempCheckIn,
    checkOut: c.tempCheckOut,
    hoverDate: c.hoverDate,
    monthsToRender: L,
    weekStartsOn: o,
    weekdayLabels: N,
    monthLabelFormatter: x
  }), [
    c.hoverDate,
    c.tempCheckIn,
    c.tempCheckOut,
    c.visibleMonth,
    x,
    L,
    o,
    N
  ]);
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      "aria-label": P,
      "aria-modal": "true",
      className: `Popup RangePicker RangePicker--checkIn RangePicker--with-dayuse${c.isOpen ? " active" : ""}`,
      id: a,
      onClick: $,
      role: "dialog",
      children: /* @__PURE__ */ e.jsxs("div", { className: "Popup__content Popup__content_Occupancy", children: [
        /* @__PURE__ */ e.jsx("span", { className: "ScreenReaderOnly", children: "엔터 키를 눌러 캘린더를 여세요. 방향키를 사용해 체크인 및 체크아웃 날짜를 탐색할 수 있습니다." }),
        /* @__PURE__ */ e.jsxs("div", { className: "RangePicker-Header", children: [
          /* @__PURE__ */ e.jsx("div", { className: "RangePicker-NavPrev", children: /* @__PURE__ */ e.jsx(
            "button",
            {
              "aria-label": "이전 달",
              className: "NavBtn NavBtn--prev",
              id: m,
              onClick: g,
              type: "button",
              children: /* @__PURE__ */ e.jsx(R, { className: "calendar-nav-icon", name: "chevron-left" })
            }
          ) }),
          /* @__PURE__ */ e.jsxs("div", { className: "RangePicker-Tabs", role: "tablist", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "RangePicker-Tab Item", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  "aria-selected": D,
                  className: `TabBtn${D ? " active" : ""}`,
                  "data-lang": "calTitle",
                  id: M,
                  onClick: () => {
                    j("calendar");
                  },
                  role: "tab",
                  type: "button",
                  children: "캘린더"
                }
              ),
              /* @__PURE__ */ e.jsx("div", { className: "TabIndicator" })
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "RangePicker-Tab Item", children: /* @__PURE__ */ e.jsx(
              "button",
              {
                "aria-selected": !D,
                className: `TabBtn${D ? "" : " active"}`,
                "data-lang": "calFlexible",
                id: f,
                onClick: () => {
                  j("flexible");
                },
                role: "tab",
                type: "button",
                children: "날짜 미정"
              }
            ) })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "RangePicker-NavNext", children: /* @__PURE__ */ e.jsx(
            "button",
            {
              "aria-label": "다음 달",
              className: "NavBtn NavBtn--next",
              id: h,
              onClick: p,
              type: "button",
              children: /* @__PURE__ */ e.jsx(R, { className: "calendar-nav-icon", name: "chevron-right" })
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: `RangePicker-Panel${D ? " active" : ""}`, id: i, role: "tabpanel", children: [
          /* @__PURE__ */ e.jsx("div", { className: "DayPicker", id: "dayPickerContainer", onMouseLeave: r, children: /* @__PURE__ */ e.jsx("div", { className: "DayPicker-wrapper", children: /* @__PURE__ */ e.jsx("div", { className: "DayPicker-Months", id: s, children: A.map((d) => /* @__PURE__ */ e.jsxs("div", { className: "DayPicker-Month", children: [
            /* @__PURE__ */ e.jsx("div", { className: "DayPicker-Caption", children: d.label }),
            /* @__PURE__ */ e.jsx("div", { className: "DayPicker-Weekdays", children: d.weekdays.map((n) => /* @__PURE__ */ e.jsx("div", { className: "DayPicker-Weekday", children: n }, `${d.key}-${n}`)) }),
            /* @__PURE__ */ e.jsx("div", { className: "DayPicker-Body", children: d.days.map((n) => {
              const u = ["DayPicker-Day"];
              return n.isOutside && u.push("DayPicker-Day--outside"), n.isDisabled && u.push("DayPicker-Day--disabled"), n.isToday && u.push("DayPicker-Day--today"), n.isSelected && u.push("DayPicker-Day--selected"), n.isCheckIn && u.push("DayPicker-Day--checkIn"), n.isCheckOut && u.push("DayPicker-Day--checkOut"), n.isInRange && u.push("DayPicker-Day--inRange"), n.isHoverRange && u.push("DayPicker-Day--hoverRange"), n.isHoverEnd && u.push("DayPicker-Day--hoverEnd"), n.hasRange && u.push("DayPicker-Day--hasRange"), n.isOutside || n.timestamp === null ? /* @__PURE__ */ e.jsx("div", { "aria-hidden": "true", className: u.join(" ") }, n.key) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  "aria-label": n.ariaLabel,
                  className: u.join(" "),
                  "data-day": n.day ?? void 0,
                  "data-timestamp": n.timestamp,
                  disabled: n.isDisabled,
                  onClick: () => {
                    O(n.timestamp);
                  },
                  onMouseEnter: () => {
                    y(n.timestamp);
                  },
                  type: "button",
                  children: n.label
                },
                n.key
              );
            }) })
          ] }, d.key)) }) }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "RangePicker-Footer", children: [
            C ? /* @__PURE__ */ e.jsx("div", { className: "RangePicker-FooterMeta", children: C }) : null,
            /* @__PURE__ */ e.jsxs("div", { className: "RangePicker-FooterActions", children: [
              /* @__PURE__ */ e.jsx("button", { className: "ActionBtn ActionBtn--clear", id: t, onClick: T, type: "button", children: /* @__PURE__ */ e.jsx("span", { "data-lang": "btnReset", children: "선택 해제" }) }),
              /* @__PURE__ */ e.jsx("button", { className: "ActionBtn ActionBtn--confirm", id: v, onClick: b, type: "button", children: /* @__PURE__ */ e.jsx("span", { "data-lang": "btnConfirm", children: "확인" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: `RangePicker-Panel${D ? "" : " active"}`, id: l, role: "tabpanel", children: /* @__PURE__ */ e.jsxs("div", { className: "Flexible-Content", children: [
          /* @__PURE__ */ e.jsx("h3", { "data-lang": "calFlexTitle", children: "투숙 기간은 얼마나 되시나요?" }),
          /* @__PURE__ */ e.jsx("div", { className: "Flexible-Options", children: k.map((d) => /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `Flexible-Option${c.flexibleValue === d.value ? " active" : ""}`,
              "data-lang": d.dataLang,
              "data-val": d.value,
              onClick: () => {
                B(d.value);
              },
              type: "button",
              children: d.label
            },
            d.value
          )) })
        ] }) })
      ] })
    }
  );
}, X = [
  { tab: "hotel", icon: "building-2", dataLang: "tabHotel", label: "호텔 & 리조트" },
  { tab: "pension", icon: "home", dataLang: "tabPension", label: "펜션 & 풀빌라" },
  { tab: "activity", icon: "compass", dataLang: "tabActivity", label: "즐길거리" }
], q = [
  {
    title: "대한민국 내 여행지",
    titleLang: "destKr",
    items: [
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
      }
    ]
  }
], J = [
  { value: "3", dataLang: "calFlex3", label: "3박" },
  { value: "7", dataLang: "calFlex7", label: "1주일" },
  { value: "30", dataLang: "calFlex30", label: "1개월" }
], Q = [
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
], Z = ({
  dropdownId: a,
  isOpen: s,
  columns: i,
  onInteract: l,
  onSelect: m
}) => /* @__PURE__ */ e.jsx("div", { className: `destination-dropdown${s ? " active" : ""}`, id: a, onClick: l, children: /* @__PURE__ */ e.jsx("div", { className: "dropdown-columns", children: i.map((h) => /* @__PURE__ */ e.jsxs("div", { className: "dropdown-column", children: [
  /* @__PURE__ */ e.jsx("div", { className: "dropdown-header", "data-lang": h.titleLang, children: h.title }),
  /* @__PURE__ */ e.jsx("ul", { className: "destination-list", children: h.items.map((t) => /* @__PURE__ */ e.jsxs(
    "li",
    {
      className: "destination-item",
      "data-value": t.value,
      onClick: () => {
        m(t.value);
      },
      children: [
        /* @__PURE__ */ e.jsx("img", { alt: t.alt, src: t.image }),
        /* @__PURE__ */ e.jsxs("div", { className: "destination-info", children: [
          /* @__PURE__ */ e.jsx("span", { className: "destination-name", "data-lang": t.nameLang, children: t.name }),
          /* @__PURE__ */ e.jsx("span", { className: "destination-count", children: t.count }),
          /* @__PURE__ */ e.jsx("span", { className: "destination-desc", "data-lang": t.descLang, children: t.desc })
        ] })
      ]
    },
    t.value
  )) })
] }, h.title)) }) }), ee = ({ popupId: a, isOpen: s, rows: i, values: l, onAdjust: m, onInteract: h }) => /* @__PURE__ */ e.jsx("div", { className: `guest-popup-new${s ? " active" : ""}`, id: a, onClick: h, children: i.map((t) => /* @__PURE__ */ e.jsxs("div", { className: "guest-row-new", children: [
  /* @__PURE__ */ e.jsxs("div", { className: "guest-info-new", children: [
    /* @__PURE__ */ e.jsx("span", { className: "guest-type-new", "data-lang": t.titleLang, children: t.title }),
    t.description ? /* @__PURE__ */ e.jsx("span", { className: "guest-desc-new", "data-lang": t.descriptionLang, children: t.description }) : null
  ] }),
  /* @__PURE__ */ e.jsxs("div", { className: "guest-counter-new", children: [
    /* @__PURE__ */ e.jsx(
      "button",
      {
        className: "counter-btn-new minus",
        "data-target": t.key,
        onClick: (v) => {
          m(t.key, -1, v);
        },
        type: "button",
        children: /* @__PURE__ */ e.jsx(R, { className: "counter-icon", name: "minus" })
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "counter-value-new", id: `${t.key}CountLarge`, children: l[t.key] ?? Number(t.defaultValue ?? "0") }),
    /* @__PURE__ */ e.jsx(
      "button",
      {
        className: "counter-btn-new plus",
        "data-target": t.key,
        onClick: (v) => {
          m(t.key, 1, v);
        },
        type: "button",
        children: /* @__PURE__ */ e.jsx(R, { className: "counter-icon", name: "plus" })
      }
    )
  ] })
] }, t.key)) });
export {
  q as D,
  J as F,
  Q as G,
  K as S,
  U as a,
  Z as b,
  G as c,
  ee as d,
  X as e,
  F as g,
  z as s
};
