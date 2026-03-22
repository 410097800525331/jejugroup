import { j as e, a as r } from "./react-vendor-BoSfm_Te.js";
const d = {
  email: "minji.hong@jejugroup.example",
  memberships: ["Jeju Air 리프레시 Silver", "Jeju Stay 프레스티지 Gold"],
  name: "홍민지",
  passport: {
    expiryDate: "2032.12.31",
    issuingCountry: "Republic of Korea",
    number: "M12345678"
  },
  phone: "010-1234-5678"
}, u = [
  { label: "보유 포인트", tone: "point", value: "26,600P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "12장" },
  { label: "다가오는 여행", tone: "air", value: "3건" }
], N = [
  {
    amount: "324,000원",
    date: "2026.11.20 09:10",
    duration: "2시간 30분",
    id: "air-icn-nrt",
    paymentMethod: "신용카드 (현대)",
    status: "결제 완료",
    tags: ["모바일 탑승권", "위탁 수하물 15kg"],
    title: "ICN → NRT 제주항공 7C1102",
    type: "air",
    voucherUrl: "#"
  },
  {
    amount: "480,000원",
    date: "2026.10.15 ~ 10.17",
    duration: "2박 3일",
    id: "stay-jeju-ocean",
    paymentMethod: "네이버페이",
    status: "예약 완료",
    tags: ["조식 포함", "수영장", "얼리 체크인"],
    title: "Jeju Ocean Suite Hotel",
    type: "stay",
    voucherUrl: "#"
  },
  {
    amount: "135,000원",
    date: "2026.10.15 09:30",
    duration: "48시간",
    id: "rent-ioniq",
    paymentMethod: "포인트 전액결제",
    status: "결수 대기",
    tags: ["완전 자차", "공항 픽업", "전기차"],
    title: "IONIQ 6 Long Range (제주렌터카)",
    type: "rent"
  }
], b = [
  {
    activities: [
      { checked: !0, id: "act-1", label: "호텔 체크인" },
      { checked: !1, id: "act-2", label: "고기국수 맛집 방문" },
      { checked: !1, id: "act-3", label: "함덕 해수욕장 산책" }
    ],
    companions: [
      { id: "comp-1", isMember: !0, name: "박준영" },
      { id: "comp-2", isMember: !0, name: "이지은" }
    ],
    date: "2026.10.15",
    googleMapUrl: "https://maps.google.com",
    id: "iti-1",
    time: "14:00",
    title: "제주도 첫날 도착 및 휴식"
  },
  {
    activities: [
      { checked: !1, id: "act-4", label: "우도 잠수함 체험" },
      { checked: !1, id: "act-5", label: "성산일출봉 등반" }
    ],
    companions: [{ id: "comp-1", isMember: !0, name: "박준영" }],
    date: "2026.10.16",
    googleMapUrl: "https://maps.google.com",
    id: "iti-2",
    time: "10:30",
    title: "동부 해안 투어"
  }
], v = [
  { count: 1, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], m = ({ children: s, className: i = "" }) => {
  const c = ["bento-box", "soft-radius", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: c, children: s });
}, f = () => /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
  /* @__PURE__ */ e.jsxs(m, { className: "hero-glass-container profile-main-card", children: [
    /* @__PURE__ */ e.jsx("div", { className: "profile-avatar-wrap", children: /* @__PURE__ */ e.jsx(
      "img",
      {
        alt: "profile",
        className: "profile-avatar",
        src: `https://api.dicebear.com/7.x/notionists/svg?seed=${d.name}&backgroundColor=f8f9fa`
      }
    ) }),
    /* @__PURE__ */ e.jsx("div", { className: "profile-core-wrap", children: /* @__PURE__ */ e.jsxs("div", { className: "profile-info", children: [
      /* @__PURE__ */ e.jsxs("h1", { className: "profile-name", children: [
        "안녕하세요, ",
        /* @__PURE__ */ e.jsx("strong", { className: "highlight", children: d.name }),
        " 님"
      ] }),
      /* @__PURE__ */ e.jsx("p", { className: "profile-welcome-msg", children: "오늘도 제주와 함께 설레는 여행을 계획해보세요." }),
      /* @__PURE__ */ e.jsx("div", { className: "membership-list", children: d.memberships.map((s) => /* @__PURE__ */ e.jsxs("div", { className: "mem-badge soft-radius", children: [
        /* @__PURE__ */ e.jsx("i", { className: "lucide-award" }),
        /* @__PURE__ */ e.jsx("span", { children: s })
      ] }, s)) })
    ] }) })
  ] }),
  /* @__PURE__ */ e.jsx("div", { className: "summary-stats-column", children: u.map((s) => /* @__PURE__ */ e.jsxs(m, { className: `stat-card meta-glass-theme tone-${s.tone}`, children: [
    /* @__PURE__ */ e.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ e.jsx(
      "i",
      {
        className: s.tone === "point" ? "lucide-coins" : s.tone === "coupon" ? "lucide-ticket" : "lucide-plane-takeoff"
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "stat-content", children: [
      /* @__PURE__ */ e.jsx("span", { className: "stat-label", children: s.label }),
      /* @__PURE__ */ e.jsx("strong", { className: "stat-value", children: s.value })
    ] })
  ] }, s.label)) })
] }), g = () => ({
  bookings: [...N],
  filter: "all"
}), y = (s, i) => {
  switch (i.type) {
    case "HYDRATE_BOOKINGS":
      return { ...s, bookings: [...i.payload] };
    case "SET_FILTER":
      return { ...s, filter: i.payload };
    default:
      return s;
  }
}, j = r.createContext(null), k = ({ children: s }) => {
  const [i, c] = r.useReducer(y, void 0, g), t = r.useMemo(
    () => ({
      dispatch: c,
      state: i
    }),
    [i]
  );
  return /* @__PURE__ */ e.jsx(j.Provider, { value: t, children: s });
}, S = () => {
  const s = r.useContext(j);
  if (!s)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return s;
}, M = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  wallet: ""
}, w = ({ tone: s, value: i }) => {
  const c = M[s];
  return /* @__PURE__ */ e.jsx("span", { className: `pill-shape ${c}`.trim(), children: i });
}, C = ["all", "air", "stay", "rent"], I = () => {
  const { dispatch: s, state: i } = S(), c = r.useMemo(() => i.filter === "all" ? i.bookings : i.bookings.filter((l) => l.type === i.filter), [i.bookings, i.filter]), t = r.useCallback(
    (l) => {
      s({ type: "SET_FILTER", payload: l });
    },
    [s]
  );
  return /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-full-management", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "section-header flex-header", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "title-group", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "나의 예약 현황" }),
        /* @__PURE__ */ e.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 예약을 한눈에 관리하세요." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "booking-filters flex-gap", children: C.map((l) => /* @__PURE__ */ e.jsx(
        "button",
        {
          className: `filter-chip pill-shape ${i.filter === l ? "active" : ""}`,
          onClick: () => t(l),
          type: "button",
          children: l === "all" ? "전체" : l === "air" ? "항공" : l === "stay" ? "숙박" : "렌터카"
        },
        l
      )) })
    ] }),
    /* @__PURE__ */ e.jsx("ul", { className: "full-width-trip-list", children: c.length > 0 ? c.map((l) => /* @__PURE__ */ e.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": l.type, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ e.jsx(w, { tone: l.type, value: l.status }),
          /* @__PURE__ */ e.jsx("div", { className: "trip-tags", children: l.tags.map((o) => /* @__PURE__ */ e.jsx("span", { className: "meta-tag pill-shape", children: o }, o)) })
        ] }),
        /* @__PURE__ */ e.jsx("h3", { className: "trip-title", children: l.title }),
        /* @__PURE__ */ e.jsxs("div", { className: "trip-meta-grid", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ e.jsx("i", { className: "lucide-calendar" }),
            /* @__PURE__ */ e.jsx("span", { children: l.date }),
            l.duration ? /* @__PURE__ */ e.jsxs("strong", { className: "duration-label", children: [
              "(",
              l.duration,
              ")"
            ] }) : null
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ e.jsx("i", { className: "lucide-wallet" }),
            /* @__PURE__ */ e.jsx("strong", { children: l.amount }),
            l.paymentMethod ? /* @__PURE__ */ e.jsxs("span", { className: "method-label", children: [
              " / ",
              l.paymentMethod
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "trip-inline-actions", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "action-group", children: [
          l.voucherUrl ? /* @__PURE__ */ e.jsxs("button", { className: "inline-btn primary pill-shape", type: "button", children: [
            /* @__PURE__ */ e.jsx("i", { className: "lucide-download" }),
            "e-티켓 / 바우처"
          ] }) : /* @__PURE__ */ e.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "결제 진행하기" }),
          /* @__PURE__ */ e.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "예약 변경" })
        ] }),
        /* @__PURE__ */ e.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "예약 취소" })
      ] })
    ] }, l.id)) : /* @__PURE__ */ e.jsxs("div", { className: "empty-state-placeholder soft-radius", children: [
      /* @__PURE__ */ e.jsx("i", { className: "lucide-alert-circle" }),
      /* @__PURE__ */ e.jsx("p", { children: "선택하신 카테고리에 해당하는 예약 내역이 없습니다." })
    ] }) })
  ] });
}, D = ({ initialCompanions: s, onClose: i, onSave: c }) => {
  const [t, l] = r.useState(s), [o, h] = r.useState(""), p = () => {
    if (!o.trim()) return;
    const a = {
      id: `comp-new-${Date.now()}`,
      isMember: !0,
      // 로직상 연동 시도는 항상 멤버로 가정
      name: `사용자(${o})`
    };
    l([...t, a]), h("");
  }, x = (a) => {
    l(t.filter((n) => n.id !== a));
  };
  return /* @__PURE__ */ e.jsx("div", { className: "meta-modal-overlay", onClick: i, children: /* @__PURE__ */ e.jsxs("div", { className: "meta-modal-content soft-radius meta-glass-theme", onClick: (a) => a.stopPropagation(), children: [
    /* @__PURE__ */ e.jsxs("header", { className: "modal-header", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "header-title-wrap", children: [
        /* @__PURE__ */ e.jsx("i", { className: "lucide-user-plus" }),
        /* @__PURE__ */ e.jsx("h3", { children: "동행자 연동/관리" })
      ] }),
      /* @__PURE__ */ e.jsx("button", { className: "close-btn", onClick: i, children: /* @__PURE__ */ e.jsx("i", { className: "lucide-x" }) })
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "modal-desc", children: "함께 여행할 멤버의 제주항공 아이디를 입력하여 연동하세요." }),
    /* @__PURE__ */ e.jsxs("div", { className: "id-search-wrap", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          className: "id-input",
          placeholder: "제주항공 아이디 입력 (예: jeju123)",
          value: o,
          onChange: (a) => h(a.target.value),
          onKeyDown: (a) => a.key === "Enter" && p()
        }
      ),
      /* @__PURE__ */ e.jsx("button", { className: "add-btn pill-shape", onClick: p, children: "추가" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "companion-list-container", children: [
      /* @__PURE__ */ e.jsxs("span", { className: "small-label", children: [
        "현재 연동된 동행자 (",
        t.length,
        "명)"
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "companion-list-scroll", children: [
        t.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "list-item", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "item-info", children: [
            /* @__PURE__ */ e.jsxs("div", { className: `companion-avatar soft-radius ${a.isMember ? "is-linked" : ""}`, children: [
              a.name.charAt(0),
              a.isMember && /* @__PURE__ */ e.jsx("i", { className: "lucide-link linked-indicator" })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "name-meta", children: [
              /* @__PURE__ */ e.jsx("strong", { children: a.name }),
              /* @__PURE__ */ e.jsx("span", { children: a.isMember ? "멤버십 연동됨" : "비회원" })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("button", { className: "remove-btn", onClick: () => x(a.id), children: "삭제" })
        ] }, a.id)),
        t.length === 0 && /* @__PURE__ */ e.jsx("div", { className: "empty-list", children: "동행자가 없습니다." })
      ] })
    ] }),
    /* @__PURE__ */ e.jsxs("footer", { className: "modal-footer", children: [
      /* @__PURE__ */ e.jsx("button", { className: "cancel-btn pill-shape", onClick: i, children: "취소" }),
      /* @__PURE__ */ e.jsx("button", { className: "save-btn pill-shape", onClick: () => {
        c(t), i();
      }, children: "저장 및 적용" })
    ] })
  ] }) });
}, R = () => {
  const [s, i] = r.useState(b), [c, t] = r.useState(!1), [l, o] = r.useState(null), h = (a) => {
    o(a), t(!0);
  }, p = (a) => {
    l && i(s.map(
      (n) => n.id === l ? { ...n, companions: a } : n
    ));
  }, x = s.find((a) => a.id === l);
  return /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ e.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "itinerary-timeline-wrap", children: s.map((a) => /* @__PURE__ */ e.jsxs("div", { className: "itinerary-day-block", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "day-side-info", children: [
        /* @__PURE__ */ e.jsx("span", { className: "day-date", children: a.date }),
        /* @__PURE__ */ e.jsx("span", { className: "day-time", children: a.time }),
        /* @__PURE__ */ e.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "comp-head", children: [
            /* @__PURE__ */ e.jsx("i", { className: "lucide-users" }),
            /* @__PURE__ */ e.jsx("span", { className: "small-label", children: "함께하는 동행자" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "avatar-stack", children: [
            a.companions.map((n) => /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: `companion-avatar soft-radius ${n.isMember ? "is-linked" : ""}`,
                title: n.name + (n.isMember ? " (연동됨)" : ""),
                children: [
                  n.name.charAt(0),
                  n.isMember && /* @__PURE__ */ e.jsx("i", { className: "lucide-link linked-indicator" })
                ]
              },
              n.id
            )),
            /* @__PURE__ */ e.jsxs("span", { className: "comp-count-label", children: [
              "총 ",
              a.companions.length,
              "명"
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              className: "link-action-btn pill-shape",
              type: "button",
              onClick: () => h(a.id),
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "lucide-user-plus" }),
                "동행자 연동/관리"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs(m, { className: "itinerary-content-card meta-glass-theme", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "iti-header flex-header", children: [
          /* @__PURE__ */ e.jsx("h3", { className: "iti-title", children: a.title }),
          /* @__PURE__ */ e.jsxs(
            "a",
            {
              className: "map-link-btn pill-shape",
              href: a.googleMapUrl,
              rel: "noopener noreferrer",
              target: "_blank",
              children: [
                /* @__PURE__ */ e.jsx("i", { className: "lucide-map-pin" }),
                "구글 맵 보기"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "activity-checklist-wrap", children: [
          /* @__PURE__ */ e.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
          /* @__PURE__ */ e.jsx("ul", { className: "checklist-list", children: a.activities.map((n) => /* @__PURE__ */ e.jsx("li", { className: `checklist-item ${n.checked ? "checked" : ""}`, children: /* @__PURE__ */ e.jsxs("label", { className: "checkbox-control", children: [
            /* @__PURE__ */ e.jsx("input", { checked: n.checked, readOnly: !0, type: "checkbox" }),
            /* @__PURE__ */ e.jsx("span", { className: "check-text", children: n.label })
          ] }) }, n.id)) })
        ] })
      ] })
    ] }, a.id)) }),
    c && x && /* @__PURE__ */ e.jsx(
      D,
      {
        initialCompanions: x.companions,
        onClose: () => t(!1),
        onSave: p
      }
    )
  ] });
}, E = () => /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-account-benefits", children: [
  /* @__PURE__ */ e.jsxs("header", { className: "section-header", children: [
    /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
    /* @__PURE__ */ e.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
  ] }),
  /* @__PURE__ */ e.jsxs("div", { className: "account-grid bento-grid", children: [
    /* @__PURE__ */ e.jsxs(m, { className: "account-info-box meta-glass-theme", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "box-head flex-header", children: [
        /* @__PURE__ */ e.jsx("h3", { children: "기본 정보" }),
        /* @__PURE__ */ e.jsx("button", { className: "edit-btn pill-shape", type: "button", children: "내 정보 수정" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "box-body", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "info-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: "label", children: "이름" }),
          /* @__PURE__ */ e.jsx("strong", { className: "value", children: d.name })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "info-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: "label", children: "이메일" }),
          /* @__PURE__ */ e.jsx("strong", { className: "value", children: d.email })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "info-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: "label", children: "휴대전화" }),
          /* @__PURE__ */ e.jsx("strong", { className: "value", children: d.phone })
        ] })
      ] })
    ] }),
    d.passport ? /* @__PURE__ */ e.jsxs(m, { className: "passport-info-box meta-glass-theme", children: [
      /* @__PURE__ */ e.jsx("div", { className: "box-head", children: /* @__PURE__ */ e.jsx("h3", { children: "패스포트 정보" }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "box-body", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "passport-visual soft-radius", children: [
          /* @__PURE__ */ e.jsx("i", { className: "lucide-passport" }),
          /* @__PURE__ */ e.jsxs("div", { className: "pass-meta", children: [
            /* @__PURE__ */ e.jsx("span", { className: "pass-num", children: d.passport.number }),
            /* @__PURE__ */ e.jsx("span", { className: "pass-country", children: d.passport.issuingCountry })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "info-row", children: [
          /* @__PURE__ */ e.jsx("span", { className: "label", children: "여권 만료일" }),
          /* @__PURE__ */ e.jsx("strong", { className: "value", children: d.passport.expiryDate })
        ] })
      ] })
    ] }) : null,
    /* @__PURE__ */ e.jsxs(m, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
      /* @__PURE__ */ e.jsx("div", { className: "box-head", children: /* @__PURE__ */ e.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
      /* @__PURE__ */ e.jsx("div", { className: "benefit-tiles", children: u.slice(0, 2).map((s) => /* @__PURE__ */ e.jsxs("div", { className: `benefit-tile tone-${s.tone} soft-radius`, children: [
        /* @__PURE__ */ e.jsx("span", { className: "benefit-label", children: s.label }),
        /* @__PURE__ */ e.jsx("strong", { className: "benefit-value", children: s.value }),
        /* @__PURE__ */ e.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
      ] }, s.label)) })
    ] })
  ] })
] }), O = () => /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-support", children: [
  /* @__PURE__ */ e.jsxs("header", { className: "section-header", children: [
    /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "고객지원" }),
    /* @__PURE__ */ e.jsx("p", { className: "section-subtitle", children: "여행 중 궁금한 점을 전문가와 상담하세요." })
  ] }),
  /* @__PURE__ */ e.jsx("div", { className: "support-bento-grid bento-grid", children: v.map((s) => /* @__PURE__ */ e.jsxs("a", { className: `support-item-card bento-item meta-glass-theme soft-radius ${s.id}`, href: s.href, children: [
    /* @__PURE__ */ e.jsx("div", { className: "sp-icon", children: /* @__PURE__ */ e.jsx(
      "img",
      {
        alt: s.label,
        src: s.id === "qna" ? "/pages/mypage/assets/support_qna.png" : s.id === "notice" ? "/pages/mypage/assets/support_notice.png" : "/pages/mypage/assets/support_faq.png"
      }
    ) }),
    /* @__PURE__ */ e.jsxs("div", { className: "sp-text", children: [
      /* @__PURE__ */ e.jsx("strong", { className: "sp-label", children: s.label }),
      s.count !== null ? /* @__PURE__ */ e.jsxs("span", { className: `sp-badge pill-shape ${s.count > 0 ? "active" : ""}`, children: [
        s.count,
        " 건"
      ] }) : /* @__PURE__ */ e.jsx("span", { className: "sp-link-text", children: "상세 보기" })
    ] })
  ] }, s.id)) })
] }), T = () => /* @__PURE__ */ e.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ e.jsx(f, {}),
  /* @__PURE__ */ e.jsx(I, {}),
  /* @__PURE__ */ e.jsx(R, {}),
  /* @__PURE__ */ e.jsx(E, {}),
  /* @__PURE__ */ e.jsx(O, {})
] }), A = () => /* @__PURE__ */ e.jsx(k, { children: /* @__PURE__ */ e.jsx(T, {}) });
export {
  A as M
};
