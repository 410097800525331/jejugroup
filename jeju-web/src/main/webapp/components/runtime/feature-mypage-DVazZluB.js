import { j as e, a as i } from "./react-vendor-BoSfm_Te.js";
const r = {
  email: "minji.hong@jejugroup.example",
  memberships: ["Jeju Air 리프레시", "Jeju Stay 프레스티지"],
  name: "홍민지"
}, o = [
  { label: "보유 포인트", tone: "wallet", value: "26,600P" },
  { label: "사용 가능한 쿠폰", tone: "wallet", value: "12장" },
  { label: "예정된 항공 일정", tone: "air", value: "2건" },
  { label: "예정된 숙소 일정", tone: "stay", value: "1건" }
], m = [
  {
    amount: "324,000원",
    date: "2026.11.20 09:10",
    id: "air-icn-nrt",
    status: "출발 예정",
    tags: ["모바일 탑승권", "위탁 수하물 15kg"],
    title: "ICN → NRT 제주항공 7C1102",
    type: "air"
  },
  {
    amount: "124,000원",
    date: "2026.10.15 08:30",
    id: "air-gmp-cju",
    status: "출발 예정",
    tags: ["성인 1, 소아 1", "사전 수하물"],
    title: "GMP → CJU 제주항공 7C113",
    type: "air"
  },
  {
    amount: "480,000원",
    date: "2026.10.15 ~ 10.17",
    id: "stay-jeju-ocean",
    status: "체크인 예정",
    tags: ["조식 포함", "수영장", "얼리 체크인"],
    title: "Jeju Ocean Suite",
    type: "stay"
  },
  {
    amount: "135,000원",
    date: "2026.10.15 09:30",
    id: "rent-ioniq",
    status: "인수 예정",
    tags: ["완전 자차", "공항 픽업", "전기차"],
    title: "IONIQ 6 Long Range",
    type: "rent"
  }
], p = [
  { count: 1, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], c = ({ children: l, className: a = "" }) => {
  const t = ["bento-box", "soft-radius", a].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: t, children: l });
}, x = () => ({
  bookings: [...m],
  filter: "all"
}), j = (l, a) => {
  switch (a.type) {
    case "HYDRATE_BOOKINGS":
      return { ...l, bookings: [...a.payload] };
    case "SET_FILTER":
      return { ...l, filter: a.payload };
    default:
      return l;
  }
}, h = i.createContext(null), u = ({ children: l }) => {
  const [a, t] = i.useReducer(j, void 0, x), n = i.useMemo(
    () => ({
      dispatch: t,
      state: a
    }),
    [a]
  );
  return /* @__PURE__ */ e.jsx(h.Provider, { value: n, children: l });
}, N = () => {
  const l = i.useContext(h);
  if (!l)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return l;
}, b = {
  air: "brand-air",
  rent: "brand-rent",
  stay: "brand-stay",
  wallet: ""
}, g = ({ tone: l, value: a }) => {
  const t = b[l];
  return /* @__PURE__ */ e.jsx("span", { className: `pill-shape ${t}`.trim(), children: a });
}, v = ["all", "air", "stay", "rent"], y = () => {
  const { dispatch: l, state: a } = N(), t = i.useMemo(() => a.filter === "all" ? a.bookings : a.bookings.filter((s) => s.type === a.filter), [a.bookings, a.filter]), n = i.useCallback(
    (s) => {
      l({ type: "SET_FILTER", payload: s });
    },
    [l]
  );
  return /* @__PURE__ */ e.jsxs("div", { className: "meta-dashboard-layout", children: [
    /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-hero bento-grid", children: [
      /* @__PURE__ */ e.jsxs(c, { className: "hero-glass-container", children: [
        /* @__PURE__ */ e.jsx("div", { className: "profile-avatar-wrap", children: /* @__PURE__ */ e.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: "https://api.dicebear.com/7.x/notionists/svg?seed=minji-black&backgroundColor=242424"
          }
        ) }),
        /* @__PURE__ */ e.jsxs("div", { className: "profile-core-wrap", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "profile-info", children: [
            /* @__PURE__ */ e.jsxs("h1", { className: "profile-name", children: [
              /* @__PURE__ */ e.jsx("strong", { className: "highlight", children: r.name }),
              " 님"
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: "profile-email", children: r.email }),
            /* @__PURE__ */ e.jsx("div", { className: "membership-list", children: r.memberships.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "mem-badge soft-radius", children: [
              /* @__PURE__ */ e.jsx("span", { children: "멤버십" }),
              /* @__PURE__ */ e.jsx("strong", { children: s })
            ] }, s)) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "quick-actions-bar", children: [
            /* @__PURE__ */ e.jsx("a", { className: "quick-btn pill-shape", href: "#", children: "예약 관리" }),
            /* @__PURE__ */ e.jsx("a", { className: "quick-btn pill-shape", href: "#", children: "쿠폰 보기" }),
            /* @__PURE__ */ e.jsx("a", { className: "quick-btn pill-shape", href: "#", children: "프로필 수정" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(c, { className: "wallet-box meta-glass-theme", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "wallet-head", children: [
          /* @__PURE__ */ e.jsx("span", { className: "eyebrow", children: "My Wallet" }),
          /* @__PURE__ */ e.jsx("h3", { children: "보유 자산" })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "wallet-body", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "asset-main", children: [
            /* @__PURE__ */ e.jsx("span", { className: "val", children: "26,600" }),
            " ",
            /* @__PURE__ */ e.jsx("span", { className: "unit", children: "P" }),
            /* @__PURE__ */ e.jsx("p", { className: "expiring pill-shape", children: "이달 말 소멸 예정 1,200P" })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "asset-grid", children: o.slice(0, 2).map((s) => /* @__PURE__ */ e.jsxs("div", { className: "asset-sub", children: [
            /* @__PURE__ */ e.jsx("span", { children: s.label }),
            /* @__PURE__ */ e.jsx("strong", { children: s.value })
          ] }, s.label)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-full-management", children: [
      /* @__PURE__ */ e.jsx("header", { className: "section-header flex-header", children: /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "통합 예약 관리" }),
        /* @__PURE__ */ e.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 일정을 한 번에 정리하는 뷰" })
      ] }) }),
      /* @__PURE__ */ e.jsx("div", { className: "quick-actions-bar", style: { paddingTop: 0 }, children: v.map((s) => /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "quick-btn pill-shape",
          onClick: () => n(s),
          type: "button",
          children: s === "all" ? "전체" : s === "air" ? "항공" : s === "stay" ? "숙박" : "렌터카"
        },
        s
      )) }),
      /* @__PURE__ */ e.jsx("div", { className: "management-categorized-wrap", children: /* @__PURE__ */ e.jsxs("div", { className: "service-category-block", children: [
        /* @__PURE__ */ e.jsx("h3", { className: "category-title", children: "현재 예약" }),
        /* @__PURE__ */ e.jsx("ul", { className: "full-width-trip-list", children: t.map((s) => /* @__PURE__ */ e.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": s.type, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "trip-core-info", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "trip-head-flex", children: [
              /* @__PURE__ */ e.jsx(g, { tone: s.type, value: s.status }),
              /* @__PURE__ */ e.jsx("div", { className: "trip-tags", children: s.tags.map((d) => /* @__PURE__ */ e.jsx("span", { className: "meta-tag pill-shape", children: d }, d)) })
            ] }),
            /* @__PURE__ */ e.jsx("h3", { className: "trip-title", children: s.title }),
            /* @__PURE__ */ e.jsxs("div", { className: "trip-meta-grid", children: [
              /* @__PURE__ */ e.jsx("div", { className: "meta-item", children: /* @__PURE__ */ e.jsx("span", { children: s.date }) }),
              /* @__PURE__ */ e.jsx("div", { className: "meta-item", children: /* @__PURE__ */ e.jsx("strong", { children: s.amount }) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "trip-inline-actions", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "action-group", children: [
              /* @__PURE__ */ e.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "상세 보기" }),
              /* @__PURE__ */ e.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "일정 변경" })
            ] }),
            /* @__PURE__ */ e.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "취소 요청" })
          ] })
        ] }, s.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-engagement", children: [
      /* @__PURE__ */ e.jsx("header", { className: "section-header", children: /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "자주 쓰는 바로가기" }) }),
      /* @__PURE__ */ e.jsx("div", { className: "bento-grid support-grid", children: o.map((s) => /* @__PURE__ */ e.jsxs(c, { children: [
        /* @__PURE__ */ e.jsx("strong", { children: s.label }),
        /* @__PURE__ */ e.jsx("p", { children: s.value })
      ] }, s.label)) })
    ] }),
    /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-support", children: [
      /* @__PURE__ */ e.jsx("header", { className: "section-header", children: /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "고객 지원" }) }),
      /* @__PURE__ */ e.jsx("div", { className: "bento-grid support-grid", children: p.map((s) => /* @__PURE__ */ e.jsx("a", { className: "support-item bento-item", href: s.href, children: /* @__PURE__ */ e.jsxs("div", { className: "sp-text", children: [
        /* @__PURE__ */ e.jsx("strong", { children: s.label }),
        s.count !== null ? /* @__PURE__ */ e.jsx("span", { className: "sp-badge", children: s.count }) : null
      ] }) }, s.id)) })
    ] })
  ] });
}, S = () => /* @__PURE__ */ e.jsx(u, { children: /* @__PURE__ */ e.jsx(y, {}) });
export {
  S as M
};
