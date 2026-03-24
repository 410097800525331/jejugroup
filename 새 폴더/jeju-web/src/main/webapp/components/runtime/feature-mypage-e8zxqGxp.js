import { j as t, a as p } from "./react-vendor-BoSfm_Te.js";
const T = {
  email: "minji.hong@jejugroup.example",
  id: "hong_minji",
  memberships: ["GOLD"],
  name: "홍민지",
  passport: {
    expiryDate: "2032.12.31",
    issuingCountry: "Republic of Korea",
    number: "M12345678"
  },
  phone: "010-1234-5678",
  tier: "GOLD"
}, q = [
  { label: "보유 포인트", tone: "point", value: "26,600P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "12장" },
  { label: "다가오는 여행", tone: "air", value: "3건" }
], Q = [
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
], he = [
  { id: "park_jy", isMember: !0, name: "박준영" },
  { id: "lee_je", isMember: !0, name: "이지은" }
], xe = [
  {
    activityLabel: "제주항공 7C101 탑승 완료",
    date: "2026.10.15",
    dayId: "iti-0",
    googleMapUrl: "https://maps.google.com",
    id: "travel-air-used",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "used",
    time: "07:30",
    title: "제주행 비행기 탑승 및 출발",
    type: "air"
  },
  {
    activityLabel: "공항 유심 수령 예정",
    date: "2026.10.15",
    dayId: "iti-0",
    googleMapUrl: "https://maps.google.com",
    id: "travel-usim-reserved",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "reserved",
    time: "07:30",
    title: "제주행 비행기 탑승 및 출발",
    type: "voucher"
  },
  {
    activityLabel: "렌터카 픽업 완료",
    date: "2026.10.15",
    dayId: "iti-1",
    googleMapUrl: "https://maps.google.com",
    id: "travel-rent-used",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "used",
    time: "14:00",
    title: "제주도 첫날 도착 및 로컬 투어",
    type: "rent"
  },
  {
    activityLabel: "함덕 액티비티 바우처 사용 완료",
    date: "2026.10.15",
    dayId: "iti-1",
    googleMapUrl: "https://maps.google.com",
    id: "travel-activity-linked-used",
    ownerId: "park_jy",
    ownerName: "박준영",
    status: "used",
    time: "14:00",
    title: "제주도 첫날 도착 및 로컬 투어",
    type: "voucher"
  },
  {
    activityLabel: "우도 잠수함 체험 이용 예정",
    date: "2026.10.16",
    dayId: "iti-2",
    googleMapUrl: "https://maps.google.com",
    id: "travel-submarine-reserved",
    ownerId: "park_jy",
    ownerName: "박준영",
    status: "reserved",
    time: "10:30",
    title: "동부 해안 투어 및 성산 액티비티",
    type: "voucher"
  },
  {
    activityLabel: "성산 액티비티 바우처 미사용",
    date: "2026.10.16",
    dayId: "iti-2",
    googleMapUrl: "https://maps.google.com",
    id: "travel-activity-missed",
    ownerId: "lee_je",
    ownerName: "이지은",
    status: "missed",
    time: "10:30",
    title: "동부 해안 투어 및 성산 액티비티",
    type: "voucher"
  },
  {
    activityLabel: "서귀포 숙소 체크인 완료",
    date: "2026.10.17",
    dayId: "iti-3",
    googleMapUrl: "https://maps.google.com",
    id: "travel-stay-used",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "used",
    time: "18:00",
    title: "서귀포 밤 정취 느끼기",
    type: "stay"
  },
  {
    activityLabel: "야간 투어 바우처 취소됨",
    date: "2026.10.17",
    dayId: "iti-3",
    googleMapUrl: "https://maps.google.com",
    id: "travel-nighttour-cancelled",
    ownerId: "lee_je",
    ownerName: "이지은",
    status: "cancelled",
    time: "18:00",
    title: "서귀포 밤 정취 느끼기",
    type: "voucher"
  },
  {
    activityLabel: "제주항공 7C102 탑승 예정",
    date: "2026.10.18",
    dayId: "iti-4",
    googleMapUrl: "https://maps.google.com",
    id: "travel-return-reserved",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "reserved",
    time: "19:30",
    title: "서울/김포행 귀국 비행기 탑승",
    type: "air"
  }
];
function J({
  currentAccountId: e,
  linkedCompanions: s,
  travelEvents: n
}) {
  const a = new Map(s.map((r) => [r.id, r])), o = /* @__PURE__ */ new Set([
    ...e ? [e] : [],
    ...s.map((r) => r.id)
  ]), i = /* @__PURE__ */ new Map();
  for (const r of n) {
    if (o.size > 0 && !o.has(r.ownerId))
      continue;
    const l = i.get(r.dayId), u = {
      checked: r.status === "used",
      id: r.id,
      label: r.activityLabel,
      ownerId: r.ownerId,
      ownerName: r.ownerName,
      status: r.status,
      type: r.type
    };
    if (l) {
      if (l.activities.push(u), r.ownerId !== e && a.has(r.ownerId)) {
        const x = a.get(r.ownerId);
        x && !l.companions.some((y) => y.id === x.id) && l.companions.push({ ...x });
      }
      continue;
    }
    i.set(r.dayId, {
      activities: [u],
      companions: r.ownerId !== e && a.has(r.ownerId) ? [{ ...a.get(r.ownerId) }] : [],
      date: r.date,
      googleMapUrl: r.googleMapUrl,
      id: r.dayId,
      sortKey: `${r.date} ${r.time}`,
      time: r.time,
      title: r.title
    });
  }
  return Array.from(i.values()).sort((r, l) => r.sortKey.localeCompare(l.sortKey)).map(({ sortKey: r, ...l }) => l);
}
const E = Z(T), R = ee(q), ye = se(Q), O = K(he), P = U(xe), W = J({
  currentAccountId: T.id ?? "",
  linkedCompanions: O,
  travelEvents: P
}), X = [
  { count: 1, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], B = () => ({
  bookings: se(Q),
  itinerary: te(W),
  linkedCompanions: K(O),
  profile: Z(T),
  stats: ee(q),
  supportItems: ne(X),
  travelEvents: U(P)
}), A = (e) => {
  const s = B(), n = we(e);
  if (!Pe(n))
    return s;
  const o = Ie(n, s.profile), i = De(n.linkedCompanions, s.linkedCompanions), r = Le(n.travelEvents, s.travelEvents), l = n.travelEvents !== void 0 ? J({
    currentAccountId: o.id ?? s.profile.id ?? "",
    linkedCompanions: i,
    travelEvents: r
  }) : ze(n.itinerary, s.itinerary);
  return {
    bookings: Me(n.bookings, s.bookings),
    itinerary: l,
    linkedCompanions: i,
    profile: o,
    stats: ke(n.stats ?? n, s.stats),
    supportItems: _e(n.supportItems ?? n.support ?? n.inquiries, s.supportItems),
    travelEvents: r
  };
}, k = (e) => {
  ge(E, e.profile), fe(R, e.stats), ve(ye, e.bookings), be(W, e.itinerary), je(O, e.linkedCompanions), Ne(X, e.supportItems), Se(P, e.travelEvents);
};
function Z(e) {
  return {
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function ee(e) {
  return e.map((s) => ({ ...s }));
}
function se(e) {
  return e.map((s) => ({
    ...s,
    tags: [...s.tags]
  }));
}
function K(e) {
  return e.map((s) => ({ ...s }));
}
function te(e) {
  return e.map((s) => ({
    ...s,
    activities: s.activities.map((n) => ({ ...n })),
    companions: s.companions.map((n) => ({ ...n }))
  }));
}
function ne(e) {
  return e.map((s) => ({ ...s }));
}
function U(e) {
  return e.map((s) => ({ ...s }));
}
const ge = (e, s) => {
  if (e.email = s.email, e.memberships.splice(0, e.memberships.length, ...s.memberships), e.name = s.name, e.phone = s.phone, e.tier = s.tier, e.role = s.role, e.id = s.id, s.passport) {
    e.passport = { ...s.passport };
    return;
  }
  delete e.passport;
}, fe = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, ve = (e, s) => {
  e.splice(
    0,
    e.length,
    ...s.map((n) => ({
      ...n,
      tags: [...n.tags]
    }))
  );
}, be = (e, s) => {
  e.splice(
    0,
    e.length,
    ...s.map((n) => ({
      ...n,
      activities: n.activities.map((a) => ({ ...a })),
      companions: n.companions.map((a) => ({ ...a }))
    }))
  );
}, je = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, Ne = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, Se = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, we = (e) => {
  const s = {}, n = (a) => {
    j(a) && Object.assign(s, a);
  };
  return n(e), j(e) && (n(e.user), n(e.member), n(e.profile), n(e.data), n(e.session)), s;
}, Ie = (e, s) => {
  const n = Ee(e.memberships, e.tier ?? e.role), a = Ce(e.passport), o = c(e.tier) ?? c(e.role) ?? n[0], i = c(e.id) ?? c(e.memberId) ?? c(e.userId), r = c(e.name) ?? c(e.displayName) ?? c(e.fullName) ?? c(e.nickname) ?? c(e.id) ?? c(e.memberId) ?? c(e.userId) ?? s.name;
  return {
    email: c(e.email) ?? Re(e, i, r) ?? s.email,
    id: i ?? s.id,
    memberships: n,
    name: r,
    passport: a,
    phone: c(e.phone) ?? c(e.mobile) ?? "미등록",
    role: c(e.role),
    tier: o
  };
}, Ee = (e, s) => {
  const n = Array.isArray(e) ? e.map((o) => c(o)).filter((o) => !!o) : [];
  if (n.length > 0)
    return n;
  const a = c(s);
  return a ? [a] : [];
}, Ce = (e) => {
  const s = j(e) ? e : null;
  if (!s)
    return;
  const n = {
    expiryDate: c(s == null ? void 0 : s.expiryDate) ?? "",
    issuingCountry: c(s == null ? void 0 : s.issuingCountry) ?? "",
    number: c(s == null ? void 0 : s.number) ?? ""
  };
  if (!(!n.expiryDate && !n.issuingCountry && !n.number))
    return n;
}, ke = (e, s) => Array.isArray(e) && e.length > 0 ? s.map((n, a) => Ae(e[a], n, !0)) : Array.isArray(e) && e.length === 0 ? [] : j(e) ? Te(e, s) : [], Ae = (e, s, n = !1) => {
  const a = j(e) ? e : {}, o = Qe(a.tone) ? a.tone : s.tone, i = c(a.label) ?? s.label, r = a.value ?? s.value;
  return {
    label: i,
    tone: o,
    value: n ? z(r, { ...s, value: "" }) : z(r, s)
  };
}, z = (e, s) => {
  const n = c(e);
  if (!n)
    return s.value;
  if (!/^\d+(?:\.\d+)?$/.test(n))
    return n;
  const a = Number(n);
  if (!Number.isFinite(a))
    return n;
  const o = a.toLocaleString("ko-KR");
  switch (s.tone) {
    case "coupon":
      return `${o}장`;
    case "point":
      return `${o}P`;
    case "air":
      return `${o}건`;
    default:
      return n;
  }
}, Me = (e, s) => Array.isArray(e) ? e.length === 0 ? [] : e.map((n, a) => Be(n, s[a % s.length] ?? s[0], !0)) : [], ze = (e, s) => !Array.isArray(e) || e.length === 0 ? te(s) : e.map((n, a) => Ke(n, s[a % s.length] ?? s[0])), _e = (e, s) => !Array.isArray(e) || e.length === 0 ? ne(s) : e.map((n, a) => Fe(n, s[a % s.length] ?? s[0])), De = (e, s) => !Array.isArray(e) || e.length === 0 ? K(s) : e.map((n, a) => Ve(n, s[a % s.length] ?? s[0])), ae = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((s) => Ge(s)).filter((s) => s !== null), Le = (e, s) => {
  const n = ae(e);
  return n.length > 0 ? n : U(s);
}, Te = (e, s) => s.map((n) => {
  const a = qe(e, Ye(n.tone));
  return a === void 0 ? { ...n } : {
    ...n,
    value: z(a, n)
  };
}), Re = (e, s, n) => {
  const a = s ?? c(e.memberId) ?? c(e.userId) ?? c(e.username) ?? c(e.loginId) ?? Oe(n);
  if (a)
    return `${a}@jejugroup.example`;
}, Oe = (e) => {
  const n = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return n.length > 0 ? n : void 0;
}, Pe = (e) => [
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
].some((n) => n in e), Be = (e, s, n = !1) => {
  const a = j(e) ? e : {}, o = Array.isArray(a.tags) ? a.tags.map((r) => c(r)).filter((r) => !!r) : [], i = $(a.type) ? a.type : s.type;
  return {
    amount: c(a.amount) ?? (n ? "" : s.amount),
    date: c(a.date) ?? (n ? "" : s.date),
    duration: c(a.duration) ?? (n ? void 0 : s.duration),
    id: c(a.id) ?? (n ? "" : s.id),
    paymentMethod: c(a.paymentMethod) ?? (n ? void 0 : s.paymentMethod),
    status: c(a.status) ?? (n ? "" : s.status),
    tags: o.length > 0 ? o : n ? [] : [...s.tags],
    title: c(a.title) ?? (n ? "" : s.title),
    type: i,
    voucherUrl: c(a.voucherUrl) ?? (n ? void 0 : s.voucherUrl)
  };
}, Ke = (e, s) => {
  const n = j(e) ? e : {}, a = Array.isArray(n.activities) ? n.activities.map(
    (i, r) => Ue(i, s.activities[r % s.activities.length] ?? s.activities[0])
  ) : s.activities.map((i) => ({ ...i })), o = Array.isArray(n.companions) ? n.companions.map(
    (i, r) => $e(i, s.companions[r % s.companions.length] ?? s.companions[0])
  ) : s.companions.map((i) => ({ ...i }));
  return {
    activities: a,
    companions: o,
    date: c(n.date) ?? s.date,
    googleMapUrl: c(n.googleMapUrl) ?? s.googleMapUrl,
    id: c(n.id) ?? s.id,
    time: c(n.time) ?? s.time,
    title: c(n.title) ?? s.title
  };
}, Ue = (e, s) => {
  const n = j(e) ? e : {};
  return {
    checked: typeof n.checked == "boolean" ? n.checked : _(n.status) ? n.status === "used" : s.checked,
    id: c(n.id) ?? s.id,
    label: c(n.label) ?? s.label,
    ownerId: c(n.ownerId) ?? s.ownerId,
    ownerName: c(n.ownerName) ?? s.ownerName,
    status: _(n.status) ? n.status : s.status,
    type: $(n.type) ? n.type : s.type
  };
}, $e = (e, s) => {
  const n = j(e) ? e : {};
  return {
    id: c(n.id) ?? s.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : s.isMember,
    name: c(n.name) ?? s.name
  };
}, Fe = (e, s) => {
  const n = j(e) ? e : {};
  return {
    count: He(n.count, s.count),
    href: c(n.href) ?? s.href,
    id: c(n.id) ?? s.id,
    label: c(n.label) ?? s.label
  };
}, He = (e, s) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const n = c(e);
  if (!n)
    return s;
  const a = Number(n);
  return Number.isFinite(a) ? a : s;
}, Ve = (e, s) => {
  const n = j(e) ? e : {};
  return {
    id: c(n.id) ?? s.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : s.isMember,
    name: c(n.name) ?? s.name
  };
}, Ge = (e) => {
  const s = j(e) ? e : null;
  if (!s)
    return null;
  const n = c(s.id), a = c(s.dayId), o = c(s.title), i = c(s.date), r = c(s.time), l = c(s.activityLabel), u = c(s.ownerId), x = c(s.ownerName), y = c(s.googleMapUrl);
  return !n || !a || !o || !i || !r || !l || !u || !x || !y ? null : {
    activityLabel: l,
    date: i,
    dayId: a,
    googleMapUrl: y,
    id: n,
    ownerId: u,
    ownerName: x,
    status: _(s.status) ? s.status : "reserved",
    time: r,
    title: o,
    type: $(s.type) ? s.type : "voucher"
  };
}, Ye = (e) => {
  switch (e) {
    case "point":
      return ["point", "points", "mileage", "balance"];
    case "coupon":
      return ["coupon", "coupons", "couponCount", "voucherCount"];
    case "air":
      return ["upcomingTrips", "tripCount", "trips", "bookingCount", "bookings", "reservations", "reservationCount"];
    default:
      return [];
  }
}, qe = (e, s) => {
  for (const n of s)
    if (n in e) {
      const a = e[n];
      if (a != null)
        return Array.isArray(a) ? a.length : a;
    }
}, j = (e) => e !== null && typeof e == "object" && !Array.isArray(e), c = (e) => {
  if (typeof e == "string") {
    const s = e.trim();
    return s.length > 0 ? s : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, $ = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", _ = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", Qe = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", I = ({ children: e, className: s = "" }) => {
  const n = ["bento-box", "soft-radius", s].filter(Boolean).join(" ");
  return /* @__PURE__ */ t.jsx("div", { className: n, children: e });
}, D = "jeju:mypage-dashboard-mock-updated", ie = "jeju:mypage-dashboard:", Je = ["id", "memberId", "userId", "email", "loginId", "username"], re = ["user", "member", "profile", "data", "session"], S = (e) => e !== null && typeof e == "object" && !Array.isArray(e), We = (e) => {
  if (typeof e == "string") {
    const s = e.trim();
    return s.length > 0 ? s : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, Xe = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), Ze = (e) => {
  const s = [];
  if (!S(e))
    return s;
  s.push(e);
  for (const n of re) {
    const a = e[n];
    S(a) && s.push(a);
  }
  return s;
}, oe = (e) => {
  const s = Ze(e);
  for (const n of s)
    for (const a of Je) {
      const o = We(n[a]);
      if (!o)
        continue;
      const i = Xe(o);
      if (i)
        return i;
    }
  return null;
}, le = (e) => `${ie}${e}`, es = (e) => {
  if (!e)
    return null;
  try {
    const s = JSON.parse(e);
    return S(s) ? s : null;
  } catch {
    return null;
  }
}, ss = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(D, {
      detail: { accountKey: e }
    })
  );
}, ce = (e) => {
  const s = oe(e);
  return s ? de(s) : null;
}, de = (e) => {
  try {
    return es(localStorage.getItem(le(e)));
  } catch {
    return null;
  }
}, L = (e, s) => {
  const n = S(e) ? e : {}, a = S(s) ? s : {};
  if (Object.keys(n).length === 0 && Object.keys(a).length === 0)
    return null;
  const o = {
    ...n,
    ...a
  };
  for (const i of re) {
    const r = n[i], l = a[i];
    (S(r) || S(l)) && (o[i] = {
      ...S(r) ? r : {},
      ...S(l) ? l : {}
    });
  }
  return o;
}, ts = (e, s) => {
  const n = oe(e);
  if (!n)
    return !1;
  try {
    return localStorage.setItem(le(n), JSON.stringify(s)), ss(n), !0;
  } catch {
    return !1;
  }
}, ns = (e, s) => {
  const n = L(ce(e), s);
  return n ? ts(e, n) : !1;
}, me = "userSession", V = "jeju:session-updated", as = "/api/auth/session", is = () => {
  const e = B();
  return {
    bookings: e.bookings,
    filter: "all",
    itinerary: e.itinerary,
    linkedCompanions: e.linkedCompanions,
    profile: e.profile,
    stats: e.stats,
    supportItems: e.supportItems,
    travelEvents: e.travelEvents
  };
}, rs = (e, s) => {
  switch (s.type) {
    case "HYDRATE_DASHBOARD":
      return {
        ...e,
        bookings: s.payload.bookings.map((n) => ({
          ...n,
          tags: [...n.tags]
        })),
        itinerary: s.payload.itinerary.map((n) => ({
          ...n,
          activities: n.activities.map((a) => ({ ...a })),
          companions: n.companions.map((a) => ({ ...a }))
        })),
        linkedCompanions: s.payload.linkedCompanions.map((n) => ({ ...n })),
        profile: {
          ...s.payload.profile,
          memberships: [...s.payload.profile.memberships],
          passport: s.payload.profile.passport ? { ...s.payload.profile.passport } : void 0
        },
        stats: s.payload.stats.map((n) => ({ ...n })),
        supportItems: s.payload.supportItems.map((n) => ({ ...n })),
        travelEvents: s.payload.travelEvents.map((n) => ({ ...n }))
      };
    case "PATCH_PROFILE":
      return {
        ...e,
        profile: {
          ...e.profile,
          ...s.payload,
          memberships: s.payload.memberships ? [...s.payload.memberships] : [...e.profile.memberships],
          passport: s.payload.passport === void 0 ? e.profile.passport ? { ...e.profile.passport } : void 0 : s.payload.passport ? { ...s.payload.passport } : void 0
        }
      };
    case "SET_LINKED_COMPANIONS":
      return {
        ...e,
        linkedCompanions: s.payload.map((n) => ({ ...n }))
      };
    case "SET_FILTER":
      return { ...e, filter: s.payload };
    default:
      return e;
  }
}, pe = p.createContext(null), ue = (e) => {
  if (!e)
    return null;
  try {
    const s = JSON.parse(e);
    return s && typeof s == "object" ? s : null;
  } catch {
    return null;
  }
}, os = () => {
  try {
    return ue(localStorage.getItem(me));
  } catch {
    return null;
  }
}, ls = async () => {
  try {
    const e = await fetch(as, {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    return e.status === 401 || !e.ok ? null : await e.json();
  } catch {
    return null;
  }
}, cs = async () => {
  const e = os();
  return e || await ls();
}, ds = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), ms = (e, s) => ({
  ...e,
  ...s,
  memberships: s.memberships ? [...s.memberships] : [...e.memberships],
  passport: s.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : s.passport ? { ...s.passport } : void 0
}), ps = (e) => {
  const s = { id: B().profile.id }, a = L(e, ce(e ?? s)), o = A(a);
  if (o.linkedCompanions.length === 0)
    return A(a);
  const i = [
    ...o.travelEvents,
    ...o.linkedCompanions.flatMap((r) => {
      const l = de(r.id);
      return !l || !("travelEvents" in l) ? [] : ae(l.travelEvents).map((u) => ({
        ...u,
        ownerId: u.ownerId || r.id,
        ownerName: u.ownerName || r.name
      }));
    })
  ];
  return A(
    L(a, {
      linkedCompanions: o.linkedCompanions,
      travelEvents: i
    })
  );
}, us = ({ children: e }) => {
  const [s, n] = p.useReducer(rs, void 0, is), a = (i) => {
    i.type === "HYDRATE_DASHBOARD" ? k(i.payload) : i.type === "PATCH_PROFILE" && k({
      bookings: s.bookings,
      itinerary: s.itinerary,
      linkedCompanions: s.linkedCompanions,
      profile: ms(s.profile, i.payload),
      stats: s.stats,
      supportItems: s.supportItems,
      travelEvents: s.travelEvents
    }), n(i);
  };
  p.useEffect(() => {
    k(ds(s));
  }, [s.bookings, s.itinerary, s.linkedCompanions, s.profile, s.stats, s.supportItems, s.travelEvents]), p.useEffect(() => {
    let i = !0;
    const r = async (y) => {
      const f = y === void 0 ? await cs() : y, N = ps(f);
      i && (k(N), n({ type: "HYDRATE_DASHBOARD", payload: N }));
    };
    r();
    const l = (y) => {
      var f;
      if (y.key === me) {
        r(ue(y.newValue));
        return;
      }
      (f = y.key) != null && f.startsWith(ie) && r();
    }, u = (y) => {
      const f = y instanceof CustomEvent ? y.detail : null;
      r((f == null ? void 0 : f.session) ?? null);
    }, x = () => {
      r();
    };
    return window.addEventListener("storage", l), window.addEventListener(V, u), window.addEventListener(D, x), () => {
      i = !1, window.removeEventListener("storage", l), window.removeEventListener(V, u), window.removeEventListener(D, x);
    };
  }, [n]);
  const o = p.useMemo(
    () => ({
      dispatch: a,
      state: s
    }),
    [a, s]
  );
  return /* @__PURE__ */ t.jsx(pe.Provider, { value: o, children: e });
}, C = () => {
  const e = p.useContext(pe);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, hs = (e) => {
  const s = (e == null ? void 0 : e.toLowerCase()) ?? "";
  return s.includes("diamond") ? "diamond" : s.includes("platinum") ? "platinum" : s.includes("silver") ? "silver" : s.includes("gold") ? "gold" : "neutral";
}, G = (e) => {
  switch (e) {
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
}, xs = () => {
  var i, r;
  const { state: e } = C(), s = e.profile ?? E, n = (i = e.stats) != null && i.length ? e.stats : R, a = ((r = s.memberships) == null ? void 0 : r[0]) ?? E.memberships[0], o = hs(a);
  return p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []), /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ t.jsx(I, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ t.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ t.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ t.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ t.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: `https://api.dicebear.com/7.x/notionists/svg?seed=${s.name}&backgroundColor=f8f9fa`
          }
        ),
        /* @__PURE__ */ t.jsx("div", { className: `membership-grade-chip soft-radius ${o}`, children: /* @__PURE__ */ t.jsx("span", { children: a }) })
      ] }) }),
      /* @__PURE__ */ t.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ t.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ t.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ t.jsx("strong", { className: "highlight", children: s.name }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ t.jsx("p", { className: "profile-welcome-msg", children: "제주에서 보냈던 소중한 시간들을 다시 이어보세요." }),
        /* @__PURE__ */ t.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ t.jsxs("button", { className: "nav-btn pill-shape", onClick: () => {
            var l;
            return (l = document.querySelector(".layer-full-management")) == null ? void 0 : l.scrollIntoView({ behavior: "smooth" });
          }, children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ t.jsxs("button", { className: "nav-btn pill-shape", onClick: () => {
            var l;
            return (l = document.querySelector(".layer-itinerary")) == null ? void 0 : l.scrollIntoView({ behavior: "smooth" });
          }, children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ t.jsxs("button", { className: "nav-btn pill-shape", onClick: () => {
            var l;
            return (l = document.querySelector(".layer-account-benefits")) == null ? void 0 : l.scrollIntoView({ behavior: "smooth" });
          }, children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ t.jsx("div", { className: "summary-stats-column", children: n.map((l) => /* @__PURE__ */ t.jsxs(I, { className: `stat-card meta-glass-theme tone-${l.tone}`, children: [
      /* @__PURE__ */ t.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ t.jsx("i", { "data-lucide": G(l.tone), className: `lucide-${G(l.tone)}` }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ t.jsx("span", { className: "stat-label", children: l.label }),
        /* @__PURE__ */ t.jsx("strong", { className: "stat-value", children: l.value })
      ] })
    ] }, l.label)) })
  ] });
}, ys = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, gs = ({ tone: e, value: s }) => {
  const n = ys[e];
  return /* @__PURE__ */ t.jsx("span", { className: `pill-shape ${n}`.trim(), children: s });
}, fs = ["all", "air", "stay", "rent", "voucher"], vs = () => {
  const { dispatch: e, state: s } = C(), n = s.bookings ?? [];
  p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [n, s.filter]);
  const a = p.useMemo(() => s.filter === "all" ? n : n.filter((i) => i.type === s.filter), [n, s.filter]), o = p.useCallback(
    (i) => {
      e({ type: "SET_FILTER", payload: i });
    },
    [e]
  );
  return /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-full-management", children: [
    /* @__PURE__ */ t.jsxs("header", { className: "section-header flex-header", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "title-group", children: [
        /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "나의 예약 현황" }),
        /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 및 바우처를 한눈에 관리하세요." })
      ] }),
      /* @__PURE__ */ t.jsx("div", { className: "booking-filters flex-gap", children: fs.map((i) => /* @__PURE__ */ t.jsx(
        "button",
        {
          className: `filter-chip pill-shape ${s.filter === i ? "active" : ""}`,
          onClick: () => o(i),
          type: "button",
          children: i === "all" ? "전체" : i === "air" ? "항공" : i === "stay" ? "숙박" : i === "rent" ? "렌터카" : "바우처"
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ t.jsx("ul", { className: "full-width-trip-list", children: a.length > 0 ? a.map((i) => /* @__PURE__ */ t.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": i.type, children: [
      /* @__PURE__ */ t.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ t.jsx(gs, { tone: i.type, value: i.status }),
          /* @__PURE__ */ t.jsx("div", { className: "trip-tags", children: i.tags.map((r) => /* @__PURE__ */ t.jsx("span", { className: "meta-tag pill-shape", children: r }, r)) })
        ] }),
        /* @__PURE__ */ t.jsx("h3", { className: "trip-title", children: i.title }),
        /* @__PURE__ */ t.jsxs("div", { className: "trip-meta-grid", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "calendar", className: "lucide-calendar" }),
            /* @__PURE__ */ t.jsx("span", { children: i.date }),
            i.duration ? /* @__PURE__ */ t.jsxs("strong", { className: "duration-label", children: [
              "(",
              i.duration,
              ")"
            ] }) : null
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "wallet", className: "lucide-wallet" }),
            /* @__PURE__ */ t.jsx("strong", { children: i.amount }),
            i.paymentMethod ? /* @__PURE__ */ t.jsxs("span", { className: "method-label", children: [
              " / ",
              i.paymentMethod
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t.jsxs("div", { className: "trip-inline-actions", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "action-group", children: [
          i.voucherUrl ? /* @__PURE__ */ t.jsxs("button", { className: "inline-btn primary pill-shape", type: "button", children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "download", className: "lucide-download" }),
            "e-티켓 / 바우처"
          ] }) : /* @__PURE__ */ t.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "결제 진행하기" }),
          /* @__PURE__ */ t.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "예약 변경" })
        ] }),
        /* @__PURE__ */ t.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "예약 취소" })
      ] })
    ] }, i.id)) : /* @__PURE__ */ t.jsxs("div", { className: "empty-state-placeholder soft-radius", children: [
      /* @__PURE__ */ t.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
      /* @__PURE__ */ t.jsx("p", { children: "선택하신 카테고리에 해당하는 예약 내역이 없습니다." })
    ] }) })
  ] });
}, bs = {
  park_jy: { id: "park_jy", name: "박준영" },
  lee_je: { id: "lee_je", name: "이지은" },
  choi_sj: { id: "choi_sj", name: "최수진" }
}, js = (e) => e.trim().toLowerCase(), Ns = async (e) => {
  await new Promise((n) => setTimeout(n, 400));
  const s = bs[e];
  return s ? {
    ...s,
    isMember: !0
  } : null;
}, Ss = ({
  initialCompanions: e = [],
  lookupMemberById: s = Ns
} = {}) => {
  const [n, a] = p.useState(e), [o, i] = p.useState(""), [r, l] = p.useState(null), [u, x] = p.useState(!1), [y, f] = p.useState(null), N = p.useCallback(async (g) => {
    const m = js(g);
    if (!m) {
      f({ message: "검색할 제주그룹 회원 ID를 입력해라" }), l(null);
      return;
    }
    if (!/^[a-z0-9._-]{2,30}$/i.test(m)) {
      f({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), l(null);
      return;
    }
    x(!0), f(null), l(null);
    try {
      const d = await s(m);
      d ? l(d) : f({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" });
    } catch {
      f({ message: "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라" });
    } finally {
      x(!1);
    }
  }, [s]), h = p.useCallback(() => {
    i(""), l(null), f(null);
  }, []), v = p.useCallback((g) => {
    a((m) => m.some((d) => d.id === g.id) ? m : [...m, g]), h();
  }, [h]), b = p.useCallback((g) => {
    a((m) => m.filter((d) => d.id !== g));
  }, []);
  return {
    companions: n,
    searchQuery: o,
    setSearchQuery: i,
    searchResult: r,
    isSearching: u,
    errorObj: y,
    handleSearch: N,
    addCompanion: v,
    removeCompanion: b,
    clearSearch: h
  };
}, ws = ({
  initialCompanions: e,
  isOpen: s,
  onClose: n,
  onSave: a
}) => {
  const {
    companions: o,
    searchQuery: i,
    setSearchQuery: r,
    searchResult: l,
    isSearching: u,
    errorObj: x,
    handleSearch: y,
    addCompanion: f,
    removeCompanion: N,
    clearSearch: h
  } = Ss({ initialCompanions: e }), v = p.useRef(null), b = l ? o.some((d) => d.id === l.id) : !1;
  if (p.useEffect(() => {
    if (s) {
      h();
      const d = window.setTimeout(() => {
        var w;
        return (w = v.current) == null ? void 0 : w.focus();
      }, 100);
      return () => window.clearTimeout(d);
    }
  }, [s, h]), p.useEffect(() => {
    const d = (w) => {
      w.key === "Escape" && s && n();
    };
    return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
  }, [s, n]), p.useEffect(() => {
    s && window.lucide && window.lucide.createIcons();
  }, [s, l, o, x]), !s) return null;
  const g = (d) => {
    d.preventDefault(), y(i);
  }, m = () => {
    a(o), n();
  };
  return /* @__PURE__ */ t.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: n, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ t.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (d) => d.stopPropagation(),
      style: { padding: "40px" },
      children: [
        /* @__PURE__ */ t.jsx("header", { className: "modal-header", children: /* @__PURE__ */ t.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ t.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ t.jsxs("div", { className: "companion-modal-body", children: [
          /* @__PURE__ */ t.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: g, style: { gap: "16px", marginBottom: "32px" }, children: [
            /* @__PURE__ */ t.jsx(
              "input",
              {
                ref: v,
                className: "id-input companion-search-input",
                type: "text",
                placeholder: "제주그룹 회원 ID를 입력해라",
                value: i,
                onChange: (d) => r(d.target.value),
                style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px" },
                autoComplete: "off"
              }
            ),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "submit",
                className: "add-btn companion-search-submit pill-shape",
                disabled: u,
                style: { padding: "0 40px", fontSize: "16px" },
                children: u ? "검색 중..." : "검색"
              }
            )
          ] }),
          x && /* @__PURE__ */ t.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            x.message
          ] }),
          l && /* @__PURE__ */ t.jsxs("div", { className: "search-result-wrap list-item", style: { padding: "20px 24px", marginBottom: "32px", borderRadius: "16px" }, children: [
            /* @__PURE__ */ t.jsxs("div", { className: "companion-result-item item-info", children: [
              /* @__PURE__ */ t.jsxs("div", { className: "companion-avatar soft-radius is-linked", style: { width: "48px", height: "48px", fontSize: "18px", marginLeft: 0 }, children: [
                l.name.charAt(0),
                /* @__PURE__ */ t.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
              ] }),
              /* @__PURE__ */ t.jsxs("div", { className: "user-info name-meta", style: { gap: "4px" }, children: [
                /* @__PURE__ */ t.jsx("strong", { style: { fontSize: "16px" }, children: l.name }),
                /* @__PURE__ */ t.jsxs("span", { style: { fontSize: "14px" }, children: [
                  "@",
                  l.id
                ] }),
                /* @__PURE__ */ t.jsx("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: b ? "이미 연동된 제주그룹 회원" : "연동 가능한 제주그룹 회원" })
              ] })
            ] }),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                className: "add-btn companion-add-btn pill-shape",
                type: "button",
                onClick: () => f(l),
                disabled: b,
                style: { padding: "12px 28px", fontSize: "14px" },
                children: b ? "연동됨" : "추가"
              }
            )
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "linked-companions-section", children: [
            /* @__PURE__ */ t.jsxs("h4", { style: { fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }, children: [
              "연동된 동행자 (",
              o.length,
              "명)"
            ] }),
            o.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 추가해라." }) : /* @__PURE__ */ t.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { gap: "16px", maxHeight: "280px" }, children: o.map((d) => /* @__PURE__ */ t.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ t.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ t.jsxs("div", { className: `companion-avatar soft-radius ${d.isMember ? "is-linked" : ""}`, style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }, children: [
                  d.name.charAt(0),
                  d.isMember && /* @__PURE__ */ t.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator", style: { width: "14px", height: "14px" } })
                ] }),
                /* @__PURE__ */ t.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ t.jsx("strong", { style: { fontSize: "16px" }, children: d.name }),
                  /* @__PURE__ */ t.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    d.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ t.jsx(
                "button",
                {
                  className: "remove-btn companion-remove-btn",
                  onClick: () => N(d.id),
                  style: { padding: "10px 24px", fontSize: "14px" },
                  children: "해제"
                }
              )
            ] }, d.id)) })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs("footer", { className: "modal-footer", style: { marginTop: "40px", gap: "16px" }, children: [
          /* @__PURE__ */ t.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: n, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ t.jsx("button", { className: "save-btn pill-shape", type: "button", onClick: m, style: { padding: "20px 0", fontSize: "16px" }, children: "적용" })
        ] })
      ]
    }
  ) });
}, Is = (e) => {
  switch (e) {
    case "used":
      return {
        icon: "check-check",
        label: "이용 완료",
        style: void 0
      };
    case "cancelled":
      return {
        icon: "circle-x",
        label: "취소됨",
        style: {
          background: "rgba(239, 68, 68, 0.08)",
          borderColor: "rgba(239, 68, 68, 0.18)"
        }
      };
    case "missed":
      return {
        icon: "circle-x",
        label: "미사용",
        style: {
          background: "rgba(239, 68, 68, 0.08)",
          borderColor: "rgba(239, 68, 68, 0.18)"
        }
      };
    default:
      return {
        icon: "clock-3",
        label: "이용 예정",
        style: void 0
      };
  }
}, Es = () => {
  const { dispatch: e, state: s } = C(), n = s.itinerary ?? [], a = s.linkedCompanions ?? [], o = s.profile, [i, r] = p.useState(!1), [l, u] = p.useState(null), x = p.useRef({}), [y, f] = p.useState({});
  p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [i, n, a]), p.useLayoutEffect(() => {
    const h = n.reduce((v, b) => {
      var g;
      return v[b.id] = ((g = x.current[b.id]) == null ? void 0 : g.scrollHeight) ?? 0, v;
    }, {});
    f((v) => {
      const b = Object.keys(v), g = Object.keys(h);
      return b.length === g.length && g.every((m) => v[m] === h[m]) ? v : h;
    });
  }, [n, i]);
  const N = (h) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: h }), ns(
      {
        id: o.id,
        profile: {
          email: o.email,
          id: o.id,
          name: o.name
        }
      },
      {
        linkedCompanions: h
      }
    ), u(null);
  };
  return /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ t.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: `itinerary-timeline-wrap ${i ? "is-expanded" : ""}`, children: [
      n.map((h, v) => {
        const b = v < 2, g = b || i, m = y[h.id] ?? 720;
        return /* @__PURE__ */ t.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (d) => {
              x.current[h.id] = d;
            },
            "aria-hidden": !g,
            style: b ? void 0 : {
              overflow: "hidden",
              maxHeight: g ? `${m}px` : "0px",
              opacity: g ? 1 : 0,
              transform: g ? "translateY(0)" : "translateY(-18px)",
              marginBottom: g ? "40px" : "0px",
              pointerEvents: g ? "auto" : "none",
              transition: "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)"
            },
            children: [
              /* @__PURE__ */ t.jsxs("div", { className: "day-side-info", children: [
                /* @__PURE__ */ t.jsx("span", { className: "day-date", children: h.date }),
                /* @__PURE__ */ t.jsx("span", { className: "day-time", children: h.time }),
                /* @__PURE__ */ t.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
                  /* @__PURE__ */ t.jsxs("div", { className: "comp-head", children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "users", className: "lucide-users" }),
                    /* @__PURE__ */ t.jsx("span", { className: "small-label", children: "함께하는 동행자" })
                  ] }),
                  /* @__PURE__ */ t.jsxs("div", { className: "avatar-stack", children: [
                    h.companions.map((d) => /* @__PURE__ */ t.jsxs(
                      "div",
                      {
                        className: `companion-avatar soft-radius ${d.isMember ? "is-linked" : ""}`,
                        title: d.name + (d.isMember ? " (연동됨)" : ""),
                        children: [
                          d.name.charAt(0),
                          d.isMember && /* @__PURE__ */ t.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                        ]
                      },
                      d.id
                    )),
                    /* @__PURE__ */ t.jsxs("span", { className: "comp-count-label", children: [
                      "총 ",
                      h.companions.length,
                      "명"
                    ] })
                  ] }),
                  /* @__PURE__ */ t.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => u(h.id), children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ t.jsxs(I, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ t.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ t.jsx("h3", { className: "iti-title", children: h.title }),
                  /* @__PURE__ */ t.jsxs("a", { className: "map-link-btn pill-shape", href: h.googleMapUrl, rel: "noopener noreferrer", target: "_blank", children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 보기"
                  ] })
                ] }),
                /* @__PURE__ */ t.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ t.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ t.jsx("ul", { className: "checklist-list", children: h.activities.map((d) => {
                    const w = Is(d.status), F = d.status === "used", H = d.status === "cancelled" || d.status === "missed";
                    return /* @__PURE__ */ t.jsx(
                      "li",
                      {
                        className: `checklist-item ${F ? "checked" : ""} soft-radius`,
                        style: w.style,
                        children: /* @__PURE__ */ t.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ t.jsx(
                            "i",
                            {
                              "data-lucide": w.icon,
                              style: {
                                color: F ? "var(--brand-rent)" : H ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ t.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ t.jsx("span", { className: "check-text", children: d.label }),
                            /* @__PURE__ */ t.jsx(
                              "span",
                              {
                                style: {
                                  color: H ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (d.ownerName ?? "본인") + " · " + w.label
                              }
                            )
                          ] })
                        ] })
                      },
                      d.id
                    );
                  }) })
                ] })
              ] })
            ]
          },
          h.id
        );
      }),
      n.length > 2 && /* @__PURE__ */ t.jsx("div", { className: `timeline-gradient-overlay ${i ? "active" : ""}`, children: /* @__PURE__ */ t.jsx("button", { className: "expand-cta-btn pill-shape", onClick: () => r(!i), children: i ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        "전체 일정 접기 ",
        /* @__PURE__ */ t.jsx("i", { className: "lucide-chevron-up" })
      ] }) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        "남은 ",
        n.length - 2,
        "개의 일정 더 보기 ",
        /* @__PURE__ */ t.jsx("i", { className: "lucide-chevron-down" })
      ] }) }) })
    ] }),
    l && /* @__PURE__ */ t.jsx(
      ws,
      {
        isOpen: !!l,
        onClose: () => u(null),
        initialCompanions: a,
        onSave: N
      }
    )
  ] });
}, M = (e) => ({
  email: e.email,
  name: e.name,
  phone: e.phone
}), Cs = (e) => ({
  email: e.email.trim(),
  name: e.name.trim(),
  phone: e.phone.trim()
}), Y = (e) => e.name.trim().length > 0 && e.email.trim().includes("@") && e.phone.trim().length > 0, ks = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, As = () => {
  var g;
  const { dispatch: e, state: s } = C(), n = s.profile ?? E, a = (g = s.stats) != null && g.length ? s.stats : R, o = n.passport, [i, r] = p.useState(() => M(n)), [l, u] = p.useState(() => M(n)), [x, y] = p.useState(!1), f = (l.name.trim().charAt(0) || E.name.trim().charAt(0) || "J").toUpperCase();
  p.useEffect(() => {
    x && window.lucide && window.lucide.createIcons();
  }, [x]), p.useEffect(() => {
    const m = M(n);
    x || (r(m), u(m));
  }, [n, x]);
  const N = () => {
    u(i), y(!0);
  }, h = () => {
    u(i), y(!1);
  }, v = () => {
    const m = Cs(l);
    Y(m) && (r(m), u(m), e({ type: "PATCH_PROFILE", payload: m }), y(!1));
  }, b = !Y(l);
  return /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ t.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ t.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ t.jsxs(I, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ t.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ t.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: N, children: "내 정보 수정" })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", children: "이름" }),
              /* @__PURE__ */ t.jsx("strong", { className: "value", children: i.name })
            ] }),
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", children: "이메일" }),
              /* @__PURE__ */ t.jsx("strong", { className: "value", children: i.email })
            ] }),
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", children: "휴대전화" }),
              /* @__PURE__ */ t.jsx("strong", { className: "value", children: i.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs(I, { className: "passport-info-box meta-glass-theme", children: [
          /* @__PURE__ */ t.jsx("div", { className: "box-head", children: /* @__PURE__ */ t.jsx("h3", { children: "패스포트 정보" }) }),
          /* @__PURE__ */ t.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ t.jsx(
              "div",
              {
                className: "passport-visual soft-radius",
                style: o ? void 0 : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" },
                children: /* @__PURE__ */ t.jsxs("div", { className: "pass-meta", children: [
                  /* @__PURE__ */ t.jsx("span", { className: "pass-num", children: (o == null ? void 0 : o.number) ?? "미등록" }),
                  /* @__PURE__ */ t.jsx("span", { className: "pass-country", children: (o == null ? void 0 : o.issuingCountry) ?? "해외 여행 전에 여권 정보를 등록해라" })
                ] })
              }
            ),
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", children: o ? "여권 만료일" : "등록 상태" }),
              /* @__PURE__ */ t.jsx("strong", { className: "value", children: (o == null ? void 0 : o.expiryDate) ?? "등록 필요" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs(I, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ t.jsx("div", { className: "box-head", children: /* @__PURE__ */ t.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ t.jsx("div", { className: "benefit-tiles", children: a.slice(0, 2).map((m) => /* @__PURE__ */ t.jsxs("div", { className: `benefit-tile tone-${m.tone} soft-radius`, children: [
            /* @__PURE__ */ t.jsx("span", { className: "benefit-label", children: m.label }),
            /* @__PURE__ */ t.jsx("strong", { className: "benefit-value", style: ks(m.tone), children: m.value }),
            /* @__PURE__ */ t.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, m.label)) })
        ] })
      ] })
    ] }),
    x ? /* @__PURE__ */ t.jsx("div", { className: "meta-modal-overlay", onClick: h, children: /* @__PURE__ */ t.jsxs(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (m) => m.stopPropagation(),
        style: { padding: "36px" },
        children: [
          /* @__PURE__ */ t.jsx("header", { className: "modal-header", children: /* @__PURE__ */ t.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ t.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ t.jsxs("div", { className: "profile-link-preview soft-radius", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", children: [
              f,
              /* @__PURE__ */ t.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
            ] }),
            /* @__PURE__ */ t.jsxs("div", { className: "profile-link-copy", children: [
              /* @__PURE__ */ t.jsx("strong", { children: "연동 프로필 배지" }),
              /* @__PURE__ */ t.jsx("span", { children: "동행자 UI와 같은 아바타·링크 배지를 재사용" })
            ] })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "box-body", style: { display: "flex", flexDirection: "column", gap: "18px", padding: 0, width: "100%" }, children: [
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }, children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "이름" }),
              /* @__PURE__ */ t.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ t.jsx(
                "input",
                {
                  className: "id-input",
                  type: "text",
                  value: l.name,
                  onChange: (m) => u((d) => ({ ...d, name: m.target.value })),
                  style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                }
              ) })
            ] }),
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }, children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "이메일" }),
              /* @__PURE__ */ t.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ t.jsx(
                "input",
                {
                  className: "id-input",
                  type: "email",
                  value: l.email,
                  onChange: (m) => u((d) => ({ ...d, email: m.target.value })),
                  style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                }
              ) })
            ] }),
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" }, children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "휴대전화" }),
              /* @__PURE__ */ t.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ t.jsx(
                "input",
                {
                  className: "id-input",
                  type: "tel",
                  value: l.phone,
                  onChange: (m) => u((d) => ({ ...d, phone: m.target.value })),
                  style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ t.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ t.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: h, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: v,
                disabled: b,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ]
      }
    ) }) : null
  ] });
}, Ms = () => {
  const { state: e } = C(), s = e.supportItems ?? [];
  return /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-support", children: [
    /* @__PURE__ */ t.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "고객지원" }),
      /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "여행 중 궁금한 점을 전문가와 상담하세요." })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "support-bento-grid bento-grid", children: s.map((n) => /* @__PURE__ */ t.jsxs("a", { className: `support-item-card bento-item meta-glass-theme soft-radius ${n.id}`, href: n.href, children: [
      /* @__PURE__ */ t.jsx("div", { className: "sp-icon", children: /* @__PURE__ */ t.jsx(
        "img",
        {
          alt: n.label,
          src: n.id === "qna" ? "/pages/mypage/assets/support_qna.png" : n.id === "notice" ? "/pages/mypage/assets/support_notice.png" : "/pages/mypage/assets/support_faq.png"
        }
      ) }),
      /* @__PURE__ */ t.jsxs("div", { className: "sp-text", children: [
        /* @__PURE__ */ t.jsx("strong", { className: "sp-label", children: n.label }),
        n.count !== null ? /* @__PURE__ */ t.jsxs("span", { className: `sp-badge pill-shape ${n.count > 0 ? "active" : ""}`, children: [
          n.count,
          " 건"
        ] }) : /* @__PURE__ */ t.jsx("span", { className: "sp-link-text", children: "상세 보기" })
      ] })
    ] }, n.id)) })
  ] });
}, zs = () => /* @__PURE__ */ t.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ t.jsx(xs, {}),
  /* @__PURE__ */ t.jsx(vs, {}),
  /* @__PURE__ */ t.jsx(Es, {}),
  /* @__PURE__ */ t.jsx(As, {}),
  /* @__PURE__ */ t.jsx(Ms, {})
] }), Ds = () => /* @__PURE__ */ t.jsx(us, { children: /* @__PURE__ */ t.jsx(zs, {}) });
export {
  Ds as M
};
