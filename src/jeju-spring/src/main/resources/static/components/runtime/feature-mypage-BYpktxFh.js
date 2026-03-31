import { j as e, a as d } from "./react-vendor-BoSfm_Te.js";
const T = {
  email: "minji.hong@jejugroup.example",
  memberships: ["GOLD"],
  name: "홍민지",
  passport: {
    expiryDate: "2032.12.31",
    issuingCountry: "Republic of Korea",
    number: "M12345678"
  },
  phone: "010-1234-5678",
  tier: "GOLD"
}, P = [
  { label: "보유 포인트", tone: "point", value: "26,600P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "12장" },
  { label: "다가오는 여행", tone: "air", value: "3건" }
], B = [
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
  },
  {
    amount: "25,000원",
    date: "2026.10.15",
    id: "vouch-usim",
    paymentMethod: "카카오페이",
    status: "발권 완료",
    tags: ["익일 수령", "인천공항 T1", "5GB 데이터"],
    title: "일본 4G 유심 (매일 1GB/5일)",
    type: "voucher",
    voucherUrl: "#"
  },
  {
    amount: "89,000원",
    date: "2026.10.16 14:00",
    id: "vouch-act-scuba",
    paymentMethod: "신용카드 (삼성)",
    status: "예약 완료",
    tags: ["장비 포함", "강사 동행", "수중 사진"],
    title: "서귀포 문섬 스쿠버다이빙 체험",
    type: "voucher",
    voucherUrl: "#"
  }
], w = _(T), M = O(P), K = $(B), V = [
  {
    activities: [
      { checked: !0, id: "act-01", label: "인천공항 제1여객터미널 도착" },
      { checked: !0, id: "act-02", label: "제주항공 7C101 셀프 체크인" },
      { checked: !1, id: "act-03", label: "모바일 탑승권 확인 및 보안검색" }
    ],
    companions: [
      { id: "comp-1", isMember: !0, name: "박준영" },
      { id: "comp-2", isMember: !0, name: "이지은" }
    ],
    date: "2026.10.15",
    googleMapUrl: "https://maps.google.com",
    id: "iti-0",
    time: "07:30",
    title: "제주행 비행기 탑승 및 출발"
  },
  {
    activities: [
      { checked: !0, id: "act-1", label: "제주 공항 도착 및 렌터카 픽업" },
      { checked: !1, id: "act-2", label: "고기국수 맛집 방문 (자매국수)" },
      { checked: !1, id: "act-3", label: "함덕 해수욕장 산책 및 카페" }
    ],
    companions: [
      { id: "comp-1", isMember: !0, name: "박준영" },
      { id: "comp-2", isMember: !0, name: "이지은" }
    ],
    date: "2026.10.15",
    googleMapUrl: "https://maps.google.com",
    id: "iti-1",
    time: "14:00",
    title: "제주도 첫날 도착 및 로컬 투어"
  },
  {
    activities: [
      { checked: !1, id: "act-4", label: "우도 잠수함 체험 및 우도 산책" },
      { checked: !1, id: "act-5", label: "성산일출봉 등반 (일몰 감상)" }
    ],
    companions: [{ id: "comp-1", isMember: !0, name: "박준영" }],
    date: "2026.10.16",
    googleMapUrl: "https://maps.google.com",
    id: "iti-2",
    time: "10:30",
    title: "동부 해안 투어 및 성산 액티비티"
  },
  {
    activities: [
      { checked: !1, id: "act-6", label: "서귀포 올레시장 먹거리 탐방" },
      { checked: !1, id: "act-7", label: "천지연 폭포 야간 산책" }
    ],
    companions: [
      { id: "comp-1", isMember: !0, name: "박준영" },
      { id: "comp-2", isMember: !0, name: "이지은" },
      { id: "comp-3", isMember: !0, name: "최수진" }
    ],
    date: "2026.10.17",
    googleMapUrl: "https://maps.google.com",
    id: "iti-3",
    time: "18:00",
    title: "서귀포 밤 정취 느끼기"
  },
  {
    activities: [
      { checked: !1, id: "act-08", label: "면세점 쇼핑 및 기념품 구매" },
      { checked: !1, id: "act-09", label: "제주 공항 바이오 등록 승인" },
      { checked: !1, id: "act-10", label: "제주항공 7C102 탑승 대기" }
    ],
    companions: [
      { id: "comp-1", isMember: !0, name: "박준영" },
      { id: "comp-2", isMember: !0, name: "이지은" }
    ],
    date: "2026.10.18",
    googleMapUrl: "https://maps.google.com",
    id: "iti-4",
    time: "19:30",
    title: "서울/김포행 귀국 비행기 탑승"
  }
], q = [
  { count: 1, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], L = () => ({
  bookings: $(B),
  profile: _(T),
  stats: O(P)
}), G = (s) => {
  const a = L(), t = W(s);
  return re(t) ? {
    bookings: te(t.bookings, a.bookings),
    profile: X(t, a.profile),
    stats: se(t.stats ?? t, a.stats)
  } : a;
}, C = (s) => {
  Y(w, s.profile), Q(M, s.stats), J(K, s.bookings);
};
function _(s) {
  return {
    ...s,
    memberships: [...s.memberships],
    passport: s.passport ? { ...s.passport } : void 0
  };
}
function O(s) {
  return s.map((a) => ({ ...a }));
}
function $(s) {
  return s.map((a) => ({
    ...a,
    tags: [...a.tags]
  }));
}
const Y = (s, a) => {
  if (s.email = a.email, s.memberships.splice(0, s.memberships.length, ...a.memberships), s.name = a.name, s.phone = a.phone, s.tier = a.tier, s.role = a.role, s.id = a.id, a.passport) {
    s.passport = { ...a.passport };
    return;
  }
  delete s.passport;
}, Q = (s, a) => {
  s.splice(0, s.length, ...a.map((t) => ({ ...t })));
}, J = (s, a) => {
  s.splice(
    0,
    s.length,
    ...a.map((t) => ({
      ...t,
      tags: [...t.tags]
    }))
  );
}, W = (s) => {
  const a = {}, t = (n) => {
    S(n) && Object.assign(a, n);
  };
  return t(s), S(s) && (t(s.user), t(s.member), t(s.profile), t(s.data), t(s.session)), a;
}, X = (s, a) => {
  const t = Z(s.memberships, s.tier ?? s.role), n = ee(s.passport), r = c(s.tier) ?? c(s.role) ?? t[0], i = c(s.id) ?? c(s.memberId) ?? c(s.userId), u = c(s.name) ?? c(s.displayName) ?? c(s.fullName) ?? c(s.nickname) ?? c(s.id) ?? c(s.memberId) ?? c(s.userId) ?? a.name;
  return {
    email: c(s.email) ?? ie(s, i, u) ?? a.email,
    id: i ?? a.id,
    memberships: t,
    name: u,
    passport: n,
    phone: c(s.phone) ?? c(s.mobile) ?? "미등록",
    role: c(s.role),
    tier: r
  };
}, Z = (s, a) => {
  const t = Array.isArray(s) ? s.map((r) => c(r)).filter((r) => !!r) : [];
  if (t.length > 0)
    return t;
  const n = c(a);
  return n ? [n] : [];
}, ee = (s) => {
  const a = S(s) ? s : null;
  if (!a)
    return;
  const t = {
    expiryDate: c(a == null ? void 0 : a.expiryDate) ?? "",
    issuingCountry: c(a == null ? void 0 : a.issuingCountry) ?? "",
    number: c(a == null ? void 0 : a.number) ?? ""
  };
  if (!(!t.expiryDate && !t.issuingCountry && !t.number))
    return t;
}, se = (s, a) => Array.isArray(s) && s.length > 0 ? a.map((t, n) => ae(s[n], t, !0)) : Array.isArray(s) && s.length === 0 ? [] : S(s) ? ne(s, a) : [], ae = (s, a, t = !1) => {
  const n = S(s) ? s : {}, r = pe(n.tone) ? n.tone : a.tone, i = c(n.label) ?? a.label, u = n.value ?? a.value;
  return {
    label: i,
    tone: r,
    value: t ? I(u, { ...a, value: "" }) : I(u, a)
  };
}, I = (s, a) => {
  const t = c(s);
  if (!t)
    return a.value;
  if (!/^\d+(?:\.\d+)?$/.test(t))
    return t;
  const n = Number(t);
  if (!Number.isFinite(n))
    return t;
  const r = n.toLocaleString("ko-KR");
  switch (a.tone) {
    case "coupon":
      return `${r}장`;
    case "point":
      return `${r}P`;
    case "air":
      return `${r}건`;
    default:
      return t;
  }
}, te = (s, a) => Array.isArray(s) ? s.length === 0 ? [] : s.map((t, n) => oe(t, a[n % a.length] ?? a[0], !0)) : [], ne = (s, a) => a.map((t) => {
  const n = de(s, ce(t.tone));
  return n === void 0 ? { ...t } : {
    ...t,
    value: I(n, t)
  };
}), ie = (s, a, t) => {
  const n = a ?? c(s.memberId) ?? c(s.userId) ?? c(s.username) ?? c(s.loginId) ?? le(t);
  if (n)
    return `${n}@jejugroup.example`;
}, le = (s) => {
  const t = s.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return t.length > 0 ? t : void 0;
}, re = (s) => [
  "id",
  "memberId",
  "userId",
  "email",
  "name",
  "phone",
  "mobile",
  "tier",
  "role",
  "memberships",
  "passport",
  "bookings",
  "stats",
  "profile",
  "member",
  "user",
  "session",
  "data"
].some((t) => t in s), oe = (s, a, t = !1) => {
  const n = S(s) ? s : {}, r = Array.isArray(n.tags) ? n.tags.map((u) => c(u)).filter((u) => !!u) : [], i = me(n.type) ? n.type : a.type;
  return {
    amount: c(n.amount) ?? (t ? "" : a.amount),
    date: c(n.date) ?? (t ? "" : a.date),
    duration: c(n.duration) ?? (t ? void 0 : a.duration),
    id: c(n.id) ?? (t ? "" : a.id),
    paymentMethod: c(n.paymentMethod) ?? (t ? void 0 : a.paymentMethod),
    status: c(n.status) ?? (t ? "" : a.status),
    tags: r.length > 0 ? r : t ? [] : [...a.tags],
    title: c(n.title) ?? (t ? "" : a.title),
    type: i,
    voucherUrl: c(n.voucherUrl) ?? (t ? void 0 : a.voucherUrl)
  };
}, ce = (s) => {
  switch (s) {
    case "point":
      return ["point", "points", "mileage", "balance"];
    case "coupon":
      return ["coupon", "coupons", "couponCount", "voucherCount"];
    case "air":
      return ["upcomingTrips", "tripCount", "trips", "bookingCount", "bookings", "reservations", "reservationCount"];
    default:
      return [];
  }
}, de = (s, a) => {
  for (const t of a)
    if (t in s) {
      const n = s[t];
      if (n != null)
        return Array.isArray(n) ? n.length : n;
    }
}, S = (s) => s !== null && typeof s == "object" && !Array.isArray(s), c = (s) => {
  if (typeof s == "string") {
    const a = s.trim();
    return a.length > 0 ? a : void 0;
  }
  if (typeof s == "number" && Number.isFinite(s))
    return String(s);
}, me = (s) => s === "air" || s === "rent" || s === "stay" || s === "voucher", pe = (s) => s === "air" || s === "coupon" || s === "point" || s === "rent" || s === "stay" || s === "voucher" || s === "wallet", N = ({ children: s, className: a = "" }) => {
  const t = ["bento-box", "soft-radius", a].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: t, children: s });
}, F = "userSession", z = "jeju:session-updated", ue = "/api/auth/session", he = () => {
  const s = L();
  return {
    bookings: s.bookings,
    filter: "all",
    profile: s.profile,
    stats: s.stats
  };
}, xe = (s, a) => {
  switch (a.type) {
    case "HYDRATE_DASHBOARD":
      return {
        ...s,
        bookings: a.payload.bookings.map((t) => ({
          ...t,
          tags: [...t.tags]
        })),
        profile: {
          ...a.payload.profile,
          memberships: [...a.payload.profile.memberships],
          passport: a.payload.profile.passport ? { ...a.payload.profile.passport } : void 0
        },
        stats: a.payload.stats.map((t) => ({ ...t }))
      };
    case "PATCH_PROFILE":
      return {
        ...s,
        profile: {
          ...s.profile,
          ...a.payload,
          memberships: a.payload.memberships ? [...a.payload.memberships] : [...s.profile.memberships],
          passport: a.payload.passport === void 0 ? s.profile.passport ? { ...s.profile.passport } : void 0 : a.payload.passport ? { ...a.payload.passport } : void 0
        }
      };
    case "SET_FILTER":
      return { ...s, filter: a.payload };
    default:
      return s;
  }
}, U = d.createContext(null), H = (s) => {
  if (!s)
    return null;
  try {
    const a = JSON.parse(s);
    return a && typeof a == "object" ? a : null;
  } catch {
    return null;
  }
}, fe = () => {
  try {
    return H(localStorage.getItem(F));
  } catch {
    return null;
  }
}, be = async () => {
  try {
    const s = await fetch(ue, {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    return s.status === 401 || !s.ok ? null : await s.json();
  } catch {
    return null;
  }
}, ge = async () => {
  const s = fe();
  return s || await be();
}, je = (s) => ({
  bookings: s.bookings,
  profile: s.profile,
  stats: s.stats
}), ye = (s, a) => ({
  ...s,
  ...a,
  memberships: a.memberships ? [...a.memberships] : [...s.memberships],
  passport: a.passport === void 0 ? s.passport ? { ...s.passport } : void 0 : a.passport ? { ...a.passport } : void 0
}), ve = ({ children: s }) => {
  const [a, t] = d.useReducer(xe, void 0, he), n = (i) => {
    i.type === "HYDRATE_DASHBOARD" ? C(i.payload) : i.type === "PATCH_PROFILE" && C({
      bookings: a.bookings,
      profile: ye(a.profile, i.payload),
      stats: a.stats
    }), t(i);
  };
  d.useEffect(() => {
    C(je(a));
  }, [a.bookings, a.profile, a.stats]), d.useEffect(() => {
    let i = !0;
    const u = async (x) => {
      const v = x === void 0 ? await ge() : x, j = G(v);
      i && (C(j), t({ type: "HYDRATE_DASHBOARD", payload: j }));
    };
    u();
    const o = (x) => {
      x.key === F && u(H(x.newValue));
    }, g = (x) => {
      const v = x instanceof CustomEvent ? x.detail : null;
      u((v == null ? void 0 : v.session) ?? null);
    };
    return window.addEventListener("storage", o), window.addEventListener(z, g), () => {
      i = !1, window.removeEventListener("storage", o), window.removeEventListener(z, g);
    };
  }, [t]);
  const r = d.useMemo(
    () => ({
      dispatch: n,
      state: a
    }),
    [n, a]
  );
  return /* @__PURE__ */ e.jsx(U.Provider, { value: r, children: s });
}, A = () => {
  const s = d.useContext(U);
  if (!s)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return s;
}, Ne = (s) => {
  const a = (s == null ? void 0 : s.toLowerCase()) ?? "";
  return a.includes("diamond") ? "diamond" : a.includes("platinum") ? "platinum" : a.includes("silver") ? "silver" : a.includes("gold") ? "gold" : "neutral";
}, D = (s) => {
  switch (s) {
    case "point":
      return "coins";
    case "coupon":
      return "ticket-percent";
    case "air":
      return "briefcase-business";
    case "wallet":
      return "wallet";
    case "stay":
      return "hotel";
    case "rent":
      return "car-front";
    case "voucher":
      return "ticket";
    default:
      return "circle";
  }
}, Se = () => {
  var i, u;
  const { state: s } = A(), a = s.profile ?? w, t = (i = s.stats) != null && i.length ? s.stats : M, n = ((u = a.memberships) == null ? void 0 : u[0]) ?? w.memberships[0], r = Ne(n);
  return d.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []), /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ e.jsx(N, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ e.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ e.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ e.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ e.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: `https://api.dicebear.com/7.x/notionists/svg?seed=${a.name}&backgroundColor=f8f9fa`
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: `membership-grade-chip soft-radius ${r}`, children: /* @__PURE__ */ e.jsx("span", { children: n }) })
      ] }) }),
      /* @__PURE__ */ e.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ e.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ e.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ e.jsx("strong", { className: "highlight", children: a.name }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "profile-welcome-msg", children: "제주에서 보냈던 소중한 시간들을 다시 이어보세요." }),
        /* @__PURE__ */ e.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ e.jsxs("button", { className: "nav-btn pill-shape", onClick: () => {
            var o;
            return (o = document.querySelector(".layer-full-management")) == null ? void 0 : o.scrollIntoView({ behavior: "smooth" });
          }, children: [
            /* @__PURE__ */ e.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ e.jsxs("button", { className: "nav-btn pill-shape", onClick: () => {
            var o;
            return (o = document.querySelector(".layer-itinerary")) == null ? void 0 : o.scrollIntoView({ behavior: "smooth" });
          }, children: [
            /* @__PURE__ */ e.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ e.jsxs("button", { className: "nav-btn pill-shape", onClick: () => {
            var o;
            return (o = document.querySelector(".layer-account-benefits")) == null ? void 0 : o.scrollIntoView({ behavior: "smooth" });
          }, children: [
            /* @__PURE__ */ e.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ e.jsx("div", { className: "summary-stats-column", children: t.map((o) => /* @__PURE__ */ e.jsxs(N, { className: `stat-card meta-glass-theme tone-${o.tone}`, children: [
      /* @__PURE__ */ e.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ e.jsx("i", { "data-lucide": D(o.tone), className: `lucide-${D(o.tone)}` }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ e.jsx("span", { className: "stat-label", children: o.label }),
        /* @__PURE__ */ e.jsx("strong", { className: "stat-value", children: o.value })
      ] })
    ] }, o.label)) })
  ] });
}, we = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, ke = ({ tone: s, value: a }) => {
  const t = we[s];
  return /* @__PURE__ */ e.jsx("span", { className: `pill-shape ${t}`.trim(), children: a });
}, Ce = ["all", "air", "stay", "rent", "voucher"], Ee = () => {
  const { dispatch: s, state: a } = A(), t = a.bookings ?? [];
  d.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [t, a.filter]);
  const n = d.useMemo(() => a.filter === "all" ? t : t.filter((i) => i.type === a.filter), [t, a.filter]), r = d.useCallback(
    (i) => {
      s({ type: "SET_FILTER", payload: i });
    },
    [s]
  );
  return /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-full-management", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "section-header flex-header", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "title-group", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "나의 예약 현황" }),
        /* @__PURE__ */ e.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 및 바우처를 한눈에 관리하세요." })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "booking-filters flex-gap", children: Ce.map((i) => /* @__PURE__ */ e.jsx(
        "button",
        {
          className: `filter-chip pill-shape ${a.filter === i ? "active" : ""}`,
          onClick: () => r(i),
          type: "button",
          children: i === "all" ? "전체" : i === "air" ? "항공" : i === "stay" ? "숙박" : i === "rent" ? "렌터카" : "바우처"
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ e.jsx("ul", { className: "full-width-trip-list", children: n.length > 0 ? n.map((i) => /* @__PURE__ */ e.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": i.type, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ e.jsx(ke, { tone: i.type, value: i.status }),
          /* @__PURE__ */ e.jsx("div", { className: "trip-tags", children: i.tags.map((u) => /* @__PURE__ */ e.jsx("span", { className: "meta-tag pill-shape", children: u }, u)) })
        ] }),
        /* @__PURE__ */ e.jsx("h3", { className: "trip-title", children: i.title }),
        /* @__PURE__ */ e.jsxs("div", { className: "trip-meta-grid", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ e.jsx("i", { "data-lucide": "calendar", className: "lucide-calendar" }),
            /* @__PURE__ */ e.jsx("span", { children: i.date }),
            i.duration ? /* @__PURE__ */ e.jsxs("strong", { className: "duration-label", children: [
              "(",
              i.duration,
              ")"
            ] }) : null
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ e.jsx("i", { "data-lucide": "wallet", className: "lucide-wallet" }),
            /* @__PURE__ */ e.jsx("strong", { children: i.amount }),
            i.paymentMethod ? /* @__PURE__ */ e.jsxs("span", { className: "method-label", children: [
              " / ",
              i.paymentMethod
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "trip-inline-actions", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "action-group", children: [
          i.voucherUrl ? /* @__PURE__ */ e.jsxs("button", { className: "inline-btn primary pill-shape", type: "button", children: [
            /* @__PURE__ */ e.jsx("i", { "data-lucide": "download", className: "lucide-download" }),
            "e-티켓 / 바우처"
          ] }) : /* @__PURE__ */ e.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "결제 진행하기" }),
          /* @__PURE__ */ e.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "예약 변경" })
        ] }),
        /* @__PURE__ */ e.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "예약 취소" })
      ] })
    ] }, i.id)) : /* @__PURE__ */ e.jsxs("div", { className: "empty-state-placeholder soft-radius", children: [
      /* @__PURE__ */ e.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
      /* @__PURE__ */ e.jsx("p", { children: "선택하신 카테고리에 해당하는 예약 내역이 없습니다." })
    ] }) })
  ] });
}, Ie = {
  tester_id: { id: "tester_id", name: "테스터" },
  jeju_lover: { id: "jeju_lover", name: "제주사랑" },
  dev_ray: { id: "dev_ray", name: "레이" }
}, Me = (s) => s.trim().toLowerCase(), Ae = async (s) => {
  await new Promise((t) => setTimeout(t, 400));
  const a = Ie[s];
  return a ? {
    ...a,
    isMember: !0
  } : null;
}, ze = ({
  initialCompanions: s = [],
  lookupMemberById: a = Ae
} = {}) => {
  const [t, n] = d.useState(s), [r, i] = d.useState(""), [u, o] = d.useState(null), [g, x] = d.useState(!1), [v, j] = d.useState(null), p = d.useCallback(async (y) => {
    const l = Me(y);
    if (!l) {
      j({ message: "검색할 제주그룹 회원 ID를 입력해라" }), o(null);
      return;
    }
    if (!/^[a-z0-9._-]{2,30}$/i.test(l)) {
      j({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), o(null);
      return;
    }
    x(!0), j(null), o(null);
    try {
      const m = await a(l);
      m ? o(m) : j({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" });
    } catch {
      j({ message: "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라" });
    } finally {
      x(!1);
    }
  }, [a]), b = d.useCallback(() => {
    i(""), o(null), j(null);
  }, []), f = d.useCallback((y) => {
    n((l) => l.some((m) => m.id === y.id) ? l : [...l, y]), b();
  }, [b]), h = d.useCallback((y) => {
    n((l) => l.filter((m) => m.id !== y));
  }, []);
  return {
    companions: t,
    searchQuery: r,
    setSearchQuery: i,
    searchResult: u,
    isSearching: g,
    errorObj: v,
    handleSearch: p,
    addCompanion: f,
    removeCompanion: h,
    clearSearch: b
  };
}, De = ({
  initialCompanions: s,
  isOpen: a,
  onClose: t,
  onSave: n
}) => {
  const {
    companions: r,
    searchQuery: i,
    setSearchQuery: u,
    searchResult: o,
    isSearching: g,
    errorObj: x,
    handleSearch: v,
    addCompanion: j,
    removeCompanion: p,
    clearSearch: b
  } = ze({ initialCompanions: s }), f = d.useRef(null), h = o ? r.some((m) => m.id === o.id) : !1;
  if (d.useEffect(() => {
    if (a) {
      b();
      const m = window.setTimeout(() => {
        var k;
        return (k = f.current) == null ? void 0 : k.focus();
      }, 100);
      return () => window.clearTimeout(m);
    }
  }, [a, b]), d.useEffect(() => {
    const m = (k) => {
      k.key === "Escape" && a && t();
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [a, t]), d.useEffect(() => {
    a && window.lucide && window.lucide.createIcons();
  }, [a, o, r, x]), !a) return null;
  const y = (m) => {
    m.preventDefault(), v(i);
  }, l = () => {
    n(r), t();
  };
  return /* @__PURE__ */ e.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: t, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (m) => m.stopPropagation(),
      style: { padding: "40px" },
      children: [
        /* @__PURE__ */ e.jsx("header", { className: "modal-header", children: /* @__PURE__ */ e.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ e.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ e.jsxs("div", { className: "companion-modal-body", children: [
          /* @__PURE__ */ e.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: y, style: { gap: "16px", marginBottom: "32px" }, children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                ref: f,
                className: "id-input companion-search-input",
                type: "text",
                placeholder: "제주그룹 회원 ID를 입력해라",
                value: i,
                onChange: (m) => u(m.target.value),
                style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px" },
                autoComplete: "off"
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "submit",
                className: "add-btn companion-search-submit pill-shape",
                disabled: g,
                style: { padding: "0 40px", fontSize: "16px" },
                children: g ? "검색 중..." : "검색"
              }
            )
          ] }),
          x && /* @__PURE__ */ e.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ e.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            x.message
          ] }),
          o && /* @__PURE__ */ e.jsxs("div", { className: "search-result-wrap list-item", style: { padding: "20px 24px", marginBottom: "32px", borderRadius: "16px" }, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "companion-result-item item-info", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "companion-avatar soft-radius is-linked", style: { width: "48px", height: "48px", fontSize: "18px", marginLeft: 0 }, children: [
                o.name.charAt(0),
                /* @__PURE__ */ e.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "user-info name-meta", style: { gap: "4px" }, children: [
                /* @__PURE__ */ e.jsx("strong", { style: { fontSize: "16px" }, children: o.name }),
                /* @__PURE__ */ e.jsxs("span", { style: { fontSize: "14px" }, children: [
                  "@",
                  o.id
                ] }),
                /* @__PURE__ */ e.jsx("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: h ? "이미 연동된 제주그룹 회원" : "연동 가능한 제주그룹 회원" })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "add-btn companion-add-btn pill-shape",
                type: "button",
                onClick: () => j(o),
                disabled: h,
                style: { padding: "12px 28px", fontSize: "14px" },
                children: h ? "연동됨" : "추가"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "linked-companions-section", children: [
            /* @__PURE__ */ e.jsxs("h4", { style: { fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }, children: [
              "연동된 동행자 (",
              r.length,
              "명)"
            ] }),
            r.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 추가해라." }) : /* @__PURE__ */ e.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { gap: "16px", maxHeight: "280px" }, children: r.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ e.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ e.jsxs("div", { className: `companion-avatar soft-radius ${m.isMember ? "is-linked" : ""}`, style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }, children: [
                  m.name.charAt(0),
                  m.isMember && /* @__PURE__ */ e.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator", style: { width: "14px", height: "14px" } })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ e.jsx("strong", { style: { fontSize: "16px" }, children: m.name }),
                  /* @__PURE__ */ e.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    m.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  className: "remove-btn companion-remove-btn",
                  onClick: () => p(m.id),
                  style: { padding: "10px 24px", fontSize: "14px" },
                  children: "해제"
                }
              )
            ] }, m.id)) })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("footer", { className: "modal-footer", style: { marginTop: "40px", gap: "16px" }, children: [
          /* @__PURE__ */ e.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: t, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ e.jsx("button", { className: "save-btn pill-shape", type: "button", onClick: l, style: { padding: "20px 0", fontSize: "16px" }, children: "적용" })
        ] })
      ]
    }
  ) });
}, Re = () => {
  var j;
  const [s, a] = d.useState(V), [t, n] = d.useState(!1), [r, i] = d.useState(null), u = d.useRef({}), [o, g] = d.useState({});
  d.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [t, s]), d.useLayoutEffect(() => {
    const p = s.reduce((b, f) => {
      var h;
      return b[f.id] = ((h = u.current[f.id]) == null ? void 0 : h.scrollHeight) ?? 0, b;
    }, {});
    g((b) => {
      const f = Object.keys(b), h = Object.keys(p);
      return f.length === h.length && h.every((y) => b[y] === p[y]) ? b : p;
    });
  }, [s, t]);
  const x = (p, b) => {
    a(s.map((f) => f.id === p ? {
      ...f,
      activities: f.activities.map(
        (h) => h.id === b ? { ...h, checked: !h.checked } : h
      )
    } : f));
  }, v = (p, b) => {
    a(s.map((f) => f.id === p ? { ...f, companions: b } : f)), i(null);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ e.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ e.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: `itinerary-timeline-wrap ${t ? "is-expanded" : ""}`, children: [
      s.map((p, b) => {
        const f = b < 2, h = f || t, y = o[p.id] ?? 720;
        return /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (l) => {
              u.current[p.id] = l;
            },
            "aria-hidden": !h,
            style: f ? void 0 : {
              overflow: "hidden",
              maxHeight: h ? `${y}px` : "0px",
              opacity: h ? 1 : 0,
              transform: h ? "translateY(0)" : "translateY(-18px)",
              marginBottom: h ? "40px" : "0px",
              pointerEvents: h ? "auto" : "none",
              transition: "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)"
            },
            children: [
              /* @__PURE__ */ e.jsxs("div", { className: "day-side-info", children: [
                /* @__PURE__ */ e.jsx("span", { className: "day-date", children: p.date }),
                /* @__PURE__ */ e.jsx("span", { className: "day-time", children: p.time }),
                /* @__PURE__ */ e.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "comp-head", children: [
                    /* @__PURE__ */ e.jsx("i", { "data-lucide": "users", className: "lucide-users" }),
                    /* @__PURE__ */ e.jsx("span", { className: "small-label", children: "함께하는 동행자" })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "avatar-stack", children: [
                    p.companions.map((l) => /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        className: `companion-avatar soft-radius ${l.isMember ? "is-linked" : ""}`,
                        title: l.name + (l.isMember ? " (연동됨)" : ""),
                        children: [
                          l.name.charAt(0),
                          l.isMember && /* @__PURE__ */ e.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                        ]
                      },
                      l.id
                    )),
                    /* @__PURE__ */ e.jsxs("span", { className: "comp-count-label", children: [
                      "총 ",
                      p.companions.length,
                      "명"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      className: "link-action-btn pill-shape",
                      type: "button",
                      onClick: () => i(p.id),
                      children: [
                        /* @__PURE__ */ e.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                        "동행자 연동/관리"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs(N, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ e.jsx("h3", { className: "iti-title", children: p.title }),
                  /* @__PURE__ */ e.jsxs(
                    "a",
                    {
                      className: "map-link-btn pill-shape",
                      href: p.googleMapUrl,
                      rel: "noopener noreferrer",
                      target: "_blank",
                      children: [
                        /* @__PURE__ */ e.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                        "구글 맵 보기"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ e.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ e.jsx("ul", { className: "checklist-list", children: p.activities.map((l) => /* @__PURE__ */ e.jsx("li", { className: `checklist-item ${l.checked ? "checked" : ""} soft-radius`, children: /* @__PURE__ */ e.jsxs("label", { className: "checkbox-control", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: l.checked,
                        onChange: () => x(p.id, l.id)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { className: "check-text", children: l.label })
                  ] }) }, l.id)) })
                ] })
              ] })
            ]
          },
          p.id
        );
      }),
      s.length > 2 && /* @__PURE__ */ e.jsx("div", { className: `timeline-gradient-overlay ${t ? "active" : ""}`, children: /* @__PURE__ */ e.jsx("button", { className: "expand-cta-btn pill-shape", onClick: () => n(!t), children: t ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        "전체 일정 접기 ",
        /* @__PURE__ */ e.jsx("i", { className: "lucide-chevron-up" })
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        "남은 ",
        s.length - 2,
        "개의 일정 더 보기 ",
        /* @__PURE__ */ e.jsx("i", { className: "lucide-chevron-down" })
      ] }) }) })
    ] }),
    r && /* @__PURE__ */ e.jsx(
      De,
      {
        isOpen: !!r,
        onClose: () => i(null),
        initialCompanions: ((j = s.find((p) => p.id === r)) == null ? void 0 : j.companions) || [],
        onSave: (p) => v(r, p)
      }
    )
  ] });
}, E = (s) => ({
  email: s.email,
  name: s.name,
  phone: s.phone
}), Te = (s) => ({
  email: s.email.trim(),
  name: s.name.trim(),
  phone: s.phone.trim()
}), R = (s) => s.name.trim().length > 0 && s.email.trim().includes("@") && s.phone.trim().length > 0, Pe = (s) => s === "point" ? {
  color: "#1f2937"
} : void 0, Be = () => {
  var y;
  const { dispatch: s, state: a } = A(), t = a.profile ?? w, n = (y = a.stats) != null && y.length ? a.stats : M, r = t.passport, [i, u] = d.useState(() => E(t)), [o, g] = d.useState(() => E(t)), [x, v] = d.useState(!1), j = (o.name.trim().charAt(0) || w.name.trim().charAt(0) || "J").toUpperCase();
  d.useEffect(() => {
    x && window.lucide && window.lucide.createIcons();
  }, [x]), d.useEffect(() => {
    const l = E(t);
    x || (u(l), g(l));
  }, [t, x]);
  const p = () => {
    g(i), v(!0);
  }, b = () => {
    g(i), v(!1);
  }, f = () => {
    const l = Te(o);
    R(l) && (u(l), g(l), s({ type: "PATCH_PROFILE", payload: l }), v(!1));
  }, h = !R(o);
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ e.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ e.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ e.jsxs(N, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ e.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ e.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: p, children: "내 정보 수정" })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ e.jsx("span", { className: "label", children: "이름" }),
              /* @__PURE__ */ e.jsx("strong", { className: "value", children: i.name })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ e.jsx("span", { className: "label", children: "이메일" }),
              /* @__PURE__ */ e.jsx("strong", { className: "value", children: i.email })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ e.jsx("span", { className: "label", children: "휴대전화" }),
              /* @__PURE__ */ e.jsx("strong", { className: "value", children: i.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs(N, { className: "passport-info-box meta-glass-theme", children: [
          /* @__PURE__ */ e.jsx("div", { className: "box-head", children: /* @__PURE__ */ e.jsx("h3", { children: "패스포트 정보" }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ e.jsx(
              "div",
              {
                className: "passport-visual soft-radius",
                style: r ? void 0 : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" },
                children: /* @__PURE__ */ e.jsxs("div", { className: "pass-meta", children: [
                  /* @__PURE__ */ e.jsx("span", { className: "pass-num", children: (r == null ? void 0 : r.number) ?? "미등록" }),
                  /* @__PURE__ */ e.jsx("span", { className: "pass-country", children: (r == null ? void 0 : r.issuingCountry) ?? "해외 여행 전에 여권 정보를 등록해라" })
                ] })
              }
            ),
            /* @__PURE__ */ e.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ e.jsx("span", { className: "label", children: r ? "여권 만료일" : "등록 상태" }),
              /* @__PURE__ */ e.jsx("strong", { className: "value", children: (r == null ? void 0 : r.expiryDate) ?? "등록 필요" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs(N, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ e.jsx("div", { className: "box-head", children: /* @__PURE__ */ e.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ e.jsx("div", { className: "benefit-tiles", children: n.slice(0, 2).map((l) => /* @__PURE__ */ e.jsxs("div", { className: `benefit-tile tone-${l.tone} soft-radius`, children: [
            /* @__PURE__ */ e.jsx("span", { className: "benefit-label", children: l.label }),
            /* @__PURE__ */ e.jsx("strong", { className: "benefit-value", style: Pe(l.tone), children: l.value }),
            /* @__PURE__ */ e.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, l.label)) })
        ] })
      ] })
    ] }),
    x ? /* @__PURE__ */ e.jsx("div", { className: "meta-modal-overlay", onClick: b, children: /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (l) => l.stopPropagation(),
        style: { padding: "36px" },
        children: [
          /* @__PURE__ */ e.jsx("header", { className: "modal-header", children: /* @__PURE__ */ e.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ e.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ e.jsxs("div", { className: "profile-link-preview soft-radius", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", children: [
              j,
              /* @__PURE__ */ e.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "profile-link-copy", children: [
              /* @__PURE__ */ e.jsx("strong", { children: "연동 프로필 배지" }),
              /* @__PURE__ */ e.jsx("span", { children: "동행자 UI와 같은 아바타·링크 배지를 재사용" })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "box-body", style: { display: "flex", flexDirection: "column", gap: "18px", padding: 0, width: "100%" }, children: [
            /* @__PURE__ */ e.jsxs("div", { className: "info-row", style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "이름" }),
              /* @__PURE__ */ e.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ e.jsx(
                "input",
                {
                  className: "id-input",
                  type: "text",
                  value: o.name,
                  onChange: (l) => g((m) => ({ ...m, name: l.target.value })),
                  style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                }
              ) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "info-row", style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "이메일" }),
              /* @__PURE__ */ e.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ e.jsx(
                "input",
                {
                  className: "id-input",
                  type: "email",
                  value: o.email,
                  onChange: (l) => g((m) => ({ ...m, email: l.target.value })),
                  style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                }
              ) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "info-row", style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }, children: [
              /* @__PURE__ */ e.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "휴대전화" }),
              /* @__PURE__ */ e.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ e.jsx(
                "input",
                {
                  className: "id-input",
                  type: "tel",
                  value: o.phone,
                  onChange: (l) => g((m) => ({ ...m, phone: l.target.value })),
                  style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ e.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: b, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: f,
                disabled: h,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ]
      }
    ) }) : null
  ] });
}, Le = () => /* @__PURE__ */ e.jsxs("section", { className: "meta-section layer-support", children: [
  /* @__PURE__ */ e.jsxs("header", { className: "section-header", children: [
    /* @__PURE__ */ e.jsx("h2", { className: "section-title", children: "고객지원" }),
    /* @__PURE__ */ e.jsx("p", { className: "section-subtitle", children: "여행 중 궁금한 점을 전문가와 상담하세요." })
  ] }),
  /* @__PURE__ */ e.jsx("div", { className: "support-bento-grid bento-grid", children: q.map((s) => /* @__PURE__ */ e.jsxs("a", { className: `support-item-card bento-item meta-glass-theme soft-radius ${s.id}`, href: s.href, children: [
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
] }), _e = () => /* @__PURE__ */ e.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ e.jsx(Se, {}),
  /* @__PURE__ */ e.jsx(Ee, {}),
  /* @__PURE__ */ e.jsx(Re, {}),
  /* @__PURE__ */ e.jsx(Be, {}),
  /* @__PURE__ */ e.jsx(Le, {})
] }), $e = () => /* @__PURE__ */ e.jsx(ve, { children: /* @__PURE__ */ e.jsx(_e, {}) });
export {
  $e as M
};
