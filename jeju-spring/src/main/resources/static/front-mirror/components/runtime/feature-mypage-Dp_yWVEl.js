import { j as t, a as u } from "./react-vendor-BoSfm_Te.js";
import { A as ve } from "./legacy-core-BoI547nw.js";
const B = {
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
}, X = [
  { label: "보유 포인트", tone: "point", value: "0P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "0장" },
  { label: "다가오는 여행", tone: "air", value: "0건" }
], Z = [
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
], ee = {
  id: "",
  isMember: !1,
  name: ""
}, je = {
  checked: !1,
  id: "",
  label: "",
  ownerId: "",
  ownerName: "",
  status: "reserved",
  type: "voucher"
}, be = {
  activities: [],
  companions: [],
  date: "",
  googleMapUrl: "",
  id: "",
  time: "",
  title: ""
}, Ne = [], Se = [];
function se({
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
    const d = i.get(r.dayId), x = {
      checked: r.status === "used",
      id: r.id,
      label: r.activityLabel,
      ownerId: r.ownerId,
      ownerName: r.ownerName,
      status: r.status,
      type: r.type
    };
    if (d) {
      if (d.activities.push(x), r.ownerId !== e && a.has(r.ownerId)) {
        const m = a.get(r.ownerId);
        m && !d.companions.some((f) => f.id === m.id) && d.companions.push({ ...m });
      }
      continue;
    }
    i.set(r.dayId, {
      activities: [x],
      companions: r.ownerId !== e && a.has(r.ownerId) ? [{ ...a.get(r.ownerId) }] : [],
      date: r.date,
      googleMapUrl: r.googleMapUrl,
      id: r.dayId,
      sortKey: `${r.date} ${r.time}`,
      time: r.time,
      title: r.title
    });
  }
  return Array.from(i.values()).sort((r, d) => r.sortKey.localeCompare(d.sortKey)).map(({ sortKey: r, ...d }) => d);
}
const C = ie(B), K = k(X), we = re(Z), F = U(Ne), $ = H(Se), te = se({
  currentAccountId: B.id ?? "",
  linkedCompanions: F,
  travelEvents: $
}), ne = [
  { count: 0, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], ae = () => ({
  bookings: re(Z),
  itinerary: oe(te),
  linkedCompanions: U(F),
  profile: ie(B),
  stats: k(X),
  supportItems: le(ne),
  travelEvents: H($)
}), _ = (e) => {
  const s = ae(), n = Te(e);
  if (!Ye(n))
    return s;
  const o = _e(n, s.profile), i = Fe(n.linkedCompanions, s.linkedCompanions), r = $e(n.travelEvents, s.travelEvents), d = n.travelEvents !== void 0 ? se({
    currentAccountId: o.id ?? s.profile.id ?? "",
    linkedCompanions: i,
    travelEvents: r
  }) : Be(n.itinerary, s.itinerary);
  return {
    bookings: Pe(n.bookings, s.bookings),
    itinerary: d,
    linkedCompanions: i,
    profile: o,
    stats: Le(n.stats ?? n, s.stats),
    supportItems: Ke(n.supportItems ?? n.support ?? n.inquiries, s.supportItems),
    travelEvents: r
  };
}, M = (e) => {
  Ie(C, e.profile), Ee(K, e.stats), Ce(we, e.bookings), Ae(te, e.itinerary), Me(F, e.linkedCompanions), ke(ne, e.supportItems), De($, e.travelEvents);
};
function ie(e) {
  return {
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function k(e) {
  return e.map((s) => ({ ...s }));
}
function re(e) {
  return e.map((s) => ({
    ...s,
    tags: [...s.tags]
  }));
}
function U(e) {
  return e.map((s) => ({ ...s }));
}
function oe(e) {
  return e.map((s) => ({
    ...s,
    activities: s.activities.map((n) => ({ ...n })),
    companions: s.companions.map((n) => ({ ...n }))
  }));
}
function le(e) {
  return e.map((s) => ({ ...s }));
}
function H(e) {
  return e.map((s) => ({ ...s }));
}
const Ie = (e, s) => {
  if (e.email = s.email, e.memberships.splice(0, e.memberships.length, ...s.memberships), e.name = s.name, e.phone = s.phone, e.tier = s.tier, e.role = s.role, e.id = s.id, s.passport) {
    e.passport = { ...s.passport };
    return;
  }
  delete e.passport;
}, Ee = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, Ce = (e, s) => {
  e.splice(
    0,
    e.length,
    ...s.map((n) => ({
      ...n,
      tags: [...n.tags]
    }))
  );
}, Ae = (e, s) => {
  e.splice(
    0,
    e.length,
    ...s.map((n) => ({
      ...n,
      activities: n.activities.map((a) => ({ ...a })),
      companions: n.companions.map((a) => ({ ...a }))
    }))
  );
}, Me = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, ke = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, De = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, Te = (e) => {
  const s = {}, n = (a) => {
    S(a) && Object.assign(s, a);
  };
  return n(e), S(e) && (n(e.user), n(e.member), n(e.profile), n(e.data), n(e.session)), s;
}, _e = (e, s) => {
  const n = Re(e.memberships, e.tier ?? e.role), a = ze(e.passport), o = l(e.tier) ?? n[0] ?? l(e.role), i = l(e.id) ?? l(e.memberId) ?? l(e.userId), r = l(e.name) ?? l(e.displayName) ?? l(e.fullName) ?? l(e.nickname) ?? l(e.id) ?? l(e.memberId) ?? l(e.userId) ?? s.name;
  return {
    email: l(e.email) ?? He(e, i, r) ?? s.email,
    id: i ?? s.id,
    memberships: n,
    name: r,
    passport: a,
    phone: l(e.phone) ?? l(e.mobile) ?? "미등록",
    role: l(e.role),
    tier: o
  };
}, Re = (e, s) => {
  const n = Array.isArray(e) ? e.map((o) => l(o)).filter((o) => !!o) : [];
  if (n.length > 0)
    return n;
  const a = l(s);
  return a ? [a] : [];
}, ze = (e) => {
  const s = S(e) ? e : null;
  if (!s)
    return;
  const n = {
    expiryDate: l(s == null ? void 0 : s.expiryDate) ?? "",
    issuingCountry: l(s == null ? void 0 : s.issuingCountry) ?? "",
    number: l(s == null ? void 0 : s.number) ?? ""
  };
  if (!(!n.expiryDate && !n.issuingCountry && !n.number))
    return n;
}, Le = (e, s) => Array.isArray(e) && e.length > 0 ? s.map((n, a) => Oe(e[a], n, !0)) : Array.isArray(e) && e.length === 0 ? k(s) : S(e) ? Ue(e, s) : k(s), Oe = (e, s, n = !1) => {
  const a = S(e) ? e : {}, o = ns(a.tone) ? a.tone : s.tone, i = l(a.label) ?? s.label, r = a.value ?? s.value;
  return {
    label: i,
    tone: o,
    value: L(r, s)
  };
}, L = (e, s) => {
  const n = l(e);
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
}, Pe = (e, s) => Array.isArray(e) ? e.length === 0 ? [] : e.map((n, a) => Ve(n, s[a % s.length] ?? s[0], !0)) : [], Be = (e, s) => !Array.isArray(e) || e.length === 0 ? oe(s) : e.map(
  (n, a) => Ge(
    n,
    s.length > 0 ? s[a % s.length] ?? s[0] : be
  )
), Ke = (e, s) => !Array.isArray(e) || e.length === 0 ? le(s) : e.map((n, a) => Je(n, s[a % s.length] ?? s[0])), Fe = (e, s) => !Array.isArray(e) || e.length === 0 ? U(s) : e.map(
  (n, a) => Ze(
    n,
    s.length > 0 ? s[a % s.length] ?? s[0] : ee
  )
), ce = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((s) => es(s)).filter((s) => s !== null), $e = (e, s) => {
  const n = ce(e);
  return n.length > 0 ? n : H(s);
}, Ue = (e, s) => s.map((n) => {
  const a = ts(e, ss(n.tone));
  return a === void 0 ? { ...n } : {
    ...n,
    value: L(a, n)
  };
}), He = (e, s, n) => {
  const a = s ?? l(e.memberId) ?? l(e.userId) ?? l(e.username) ?? l(e.loginId) ?? qe(n);
  if (a)
    return `${a}@jejugroup.example`;
}, qe = (e) => {
  const n = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return n.length > 0 ? n : void 0;
}, Ye = (e) => [
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
].some((n) => n in e), Ve = (e, s, n = !1) => {
  const a = S(e) ? e : {}, o = Array.isArray(a.tags) ? a.tags.map((r) => l(r)).filter((r) => !!r) : [], i = q(a.type) ? a.type : s.type;
  return {
    amount: l(a.amount) ?? (n ? "" : s.amount),
    date: l(a.date) ?? (n ? "" : s.date),
    duration: l(a.duration) ?? (n ? void 0 : s.duration),
    id: l(a.id) ?? (n ? "" : s.id),
    paymentMethod: l(a.paymentMethod) ?? (n ? void 0 : s.paymentMethod),
    status: l(a.status) ?? (n ? "" : s.status),
    tags: o.length > 0 ? o : n ? [] : [...s.tags],
    title: l(a.title) ?? (n ? "" : s.title),
    type: i,
    voucherUrl: l(a.voucherUrl) ?? (n ? void 0 : s.voucherUrl)
  };
}, Ge = (e, s) => {
  const n = S(e) ? e : {}, a = Array.isArray(n.activities) ? n.activities.map(
    (i, r) => We(
      i,
      s.activities.length > 0 ? s.activities[r % s.activities.length] ?? s.activities[0] : je
    )
  ) : s.activities.map((i) => ({ ...i })), o = Array.isArray(n.companions) ? n.companions.map(
    (i, r) => Qe(
      i,
      s.companions.length > 0 ? s.companions[r % s.companions.length] ?? s.companions[0] : ee
    )
  ) : s.companions.map((i) => ({ ...i }));
  return {
    activities: a,
    companions: o,
    date: l(n.date) ?? s.date,
    googleMapUrl: l(n.googleMapUrl) ?? s.googleMapUrl,
    id: l(n.id) ?? s.id,
    time: l(n.time) ?? s.time,
    title: l(n.title) ?? s.title
  };
}, We = (e, s) => {
  const n = S(e) ? e : {};
  return {
    checked: typeof n.checked == "boolean" ? n.checked : O(n.status) ? n.status === "used" : s.checked,
    id: l(n.id) ?? s.id,
    label: l(n.label) ?? s.label,
    ownerId: l(n.ownerId) ?? s.ownerId,
    ownerName: l(n.ownerName) ?? s.ownerName,
    status: O(n.status) ? n.status : s.status,
    type: q(n.type) ? n.type : s.type
  };
}, Qe = (e, s) => {
  const n = S(e) ? e : {};
  return {
    id: l(n.id) ?? s.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : s.isMember,
    name: l(n.name) ?? s.name
  };
}, Je = (e, s) => {
  const n = S(e) ? e : {};
  return {
    count: Xe(n.count, s.count),
    href: l(n.href) ?? s.href,
    id: l(n.id) ?? s.id,
    label: l(n.label) ?? s.label
  };
}, Xe = (e, s) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const n = l(e);
  if (!n)
    return s;
  const a = Number(n);
  return Number.isFinite(a) ? a : s;
}, Ze = (e, s) => {
  const n = S(e) ? e : {};
  return {
    id: l(n.id) ?? s.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : s.isMember,
    name: l(n.name) ?? s.name
  };
}, es = (e) => {
  const s = S(e) ? e : null;
  if (!s)
    return null;
  const n = l(s.id), a = l(s.dayId), o = l(s.title), i = l(s.date), r = l(s.time), d = l(s.activityLabel), x = l(s.ownerId), m = l(s.ownerName), f = l(s.googleMapUrl);
  return !n || !a || !o || !i || !r || !d || !x || !m || !f ? null : {
    activityLabel: d,
    date: i,
    dayId: a,
    googleMapUrl: f,
    id: n,
    ownerId: x,
    ownerName: m,
    status: O(s.status) ? s.status : "reserved",
    time: r,
    title: o,
    type: q(s.type) ? s.type : "voucher"
  };
}, ss = (e) => {
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
}, ts = (e, s) => {
  for (const n of s)
    if (n in e) {
      const a = e[n];
      if (a != null)
        return Array.isArray(a) ? a.length : a;
    }
}, S = (e) => e !== null && typeof e == "object" && !Array.isArray(e), l = (e) => {
  if (typeof e == "string") {
    const s = e.trim();
    return s.length > 0 ? s : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, q = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", O = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", ns = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", E = ({ children: e, className: s = "" }) => {
  const n = ["bento-box", "soft-radius", s].filter(Boolean).join(" ");
  return /* @__PURE__ */ t.jsx("div", { className: n, children: e });
}, P = "jeju:mypage-dashboard-mock-updated", de = "jeju:mypage-dashboard:", as = ["id", "memberId", "userId", "email", "loginId", "username"], pe = ["user", "member", "profile", "data", "session"], I = (e) => e !== null && typeof e == "object" && !Array.isArray(e), is = (e) => {
  if (typeof e == "string") {
    const s = e.trim();
    return s.length > 0 ? s : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, rs = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), os = (e) => {
  const s = [];
  if (!I(e))
    return s;
  s.push(e);
  for (const n of pe) {
    const a = e[n];
    I(a) && s.push(a);
  }
  return s;
}, me = (e) => {
  const s = os(e);
  for (const n of s)
    for (const a of as) {
      const o = is(n[a]);
      if (!o)
        continue;
      const i = rs(o);
      if (i)
        return i;
    }
  return null;
}, ue = (e) => `${de}${e}`, ls = (e) => {
  if (!e)
    return null;
  try {
    const s = JSON.parse(e);
    return I(s) ? s : null;
  } catch {
    return null;
  }
}, cs = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(P, {
      detail: { accountKey: e }
    })
  );
}, he = (e) => {
  const s = me(e);
  return s ? xe(s) : null;
}, xe = (e) => {
  try {
    return ls(localStorage.getItem(ue(e)));
  } catch {
    return null;
  }
}, D = (e, s) => {
  const n = I(e) ? e : {}, a = I(s) ? s : {};
  if (Object.keys(n).length === 0 && Object.keys(a).length === 0)
    return null;
  const o = {
    ...n,
    ...a
  };
  for (const i of pe) {
    const r = n[i], d = a[i];
    (I(r) || I(d)) && (o[i] = {
      ...I(r) ? r : {},
      ...I(d) ? d : {}
    });
  }
  return o;
}, ds = (e, s) => {
  const n = me(e);
  if (!n)
    return !1;
  try {
    return localStorage.setItem(ue(n), JSON.stringify(s)), cs(n), !0;
  } catch {
    return !1;
  }
}, ps = (e, s) => {
  const n = D(he(e), s);
  return n ? ds(e, n) : !1;
}, ms = "userSession", G = "jeju:session-updated", us = "/api/auth/session", hs = "/api/mypage/dashboard", xs = () => {
  const e = ae();
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
}, ys = (e, s) => {
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
}, ye = u.createContext(null), fe = (e) => `${ve}${e}`, fs = (e) => e !== null && typeof e == "object" && !Array.isArray(e), gs = async () => {
  try {
    const e = await fetch(fe(us), {
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
}, vs = async () => {
  try {
    const e = await fetch(fe(hs), {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    if (e.status === 401 || !e.ok)
      return null;
    const s = await e.json();
    return !fs(s) || s.success !== !0 || !("dashboard" in s) ? null : s.dashboard ?? null;
  } catch {
    return null;
  }
}, js = async () => await gs(), bs = async (e) => {
  if (!e)
    return null;
  const s = await vs();
  return s ? D(e, s) : e;
}, Ns = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), Ss = (e, s) => ({
  ...e,
  ...s,
  memberships: s.memberships ? [...s.memberships] : [...e.memberships],
  passport: s.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : s.passport ? { ...s.passport } : void 0
}), ws = (e) => {
  const s = D(e, he(e)), n = _(s);
  if (n.linkedCompanions.length === 0)
    return _(s);
  const a = [
    ...n.travelEvents,
    ...n.linkedCompanions.flatMap((o) => {
      const i = xe(o.id);
      return !i || !("travelEvents" in i) ? [] : ce(i.travelEvents).map((r) => ({
        ...r,
        ownerId: r.ownerId || o.id,
        ownerName: r.ownerName || o.name
      }));
    })
  ];
  return _(
    D(s, {
      linkedCompanions: n.linkedCompanions,
      travelEvents: a
    })
  );
}, Is = ({ children: e }) => {
  const [s, n] = u.useReducer(ys, void 0, xs), [a, o] = u.useState(!1), [i, r] = u.useState(!1), d = (m) => {
    m.type === "HYDRATE_DASHBOARD" ? M(m.payload) : m.type === "PATCH_PROFILE" && M({
      bookings: s.bookings,
      itinerary: s.itinerary,
      linkedCompanions: s.linkedCompanions,
      profile: Ss(s.profile, m.payload),
      stats: s.stats,
      supportItems: s.supportItems,
      travelEvents: s.travelEvents
    }), n(m);
  };
  u.useEffect(() => {
    M(Ns(s));
  }, [s.bookings, s.itinerary, s.linkedCompanions, s.profile, s.stats, s.supportItems, s.travelEvents]), u.useEffect(() => {
    let m = !0, f = !1;
    const j = async (y) => {
      const c = await js();
      if (!c) {
        if (!m)
          return;
        r(!1), o(!0);
        return;
      }
      const p = await bs(c), w = ws(p);
      m && (r(!0), o(!0), M(w), n({ type: "HYDRATE_DASHBOARD", payload: w }));
    }, N = (y) => {
      f || (f = !0, j().finally(() => {
        f = !1;
      }));
    };
    N();
    const b = (y) => {
      var c;
      if (y.key === ms) {
        N();
        return;
      }
      (c = y.key) != null && c.startsWith(de) && N();
    }, h = () => {
      N();
    }, g = () => {
      N();
    };
    return window.addEventListener("storage", b), window.addEventListener(G, h), window.addEventListener(P, g), () => {
      m = !1, window.removeEventListener("storage", b), window.removeEventListener(G, h), window.removeEventListener(P, g);
    };
  }, [n]);
  const x = u.useMemo(
    () => ({
      dispatch: d,
      state: s
    }),
    [d, s]
  );
  return !a || !i ? /* @__PURE__ */ t.jsxs("div", { className: "mypage-auth-empty-state soft-radius", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ t.jsx("div", { className: "mypage-auth-empty-icon", "aria-hidden": "true", children: /* @__PURE__ */ t.jsxs("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true", children: [
      /* @__PURE__ */ t.jsx(
        "path",
        {
          d: "M12 3.75 21 19.5a1.2 1.2 0 0 1-1.04 1.8H4.04A1.2 1.2 0 0 1 3 19.5L12 3.75Z",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ t.jsx("path", { d: "M12 9v5.25", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }),
      /* @__PURE__ */ t.jsx("circle", { cx: "12", cy: "17.25", r: "1.1", fill: "currentColor" })
    ] }) }),
    /* @__PURE__ */ t.jsx("p", { className: "mypage-auth-empty-text", children: "로그인을 해주세요." })
  ] }) : /* @__PURE__ */ t.jsx(ye.Provider, { value: x, children: e });
}, A = () => {
  const e = u.useContext(ye);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, ge = (e) => {
  const s = (e == null ? void 0 : e.trim().toLowerCase()) ?? "";
  return s.includes("diamond") || s.includes("다이아") ? "diamond" : s.includes("platinum") || s.includes("플래티넘") ? "platinum" : s.includes("silver") || s.includes("실버") ? "silver" : s.includes("gold") || s.includes("골드") ? "gold" : null;
}, Es = (e) => ge(e) ?? "neutral", Cs = (e) => {
  switch (ge(e)) {
    case "diamond":
      return "DIAMOND";
    case "platinum":
      return "PLATINUM";
    case "gold":
      return "GOLD";
    case "silver":
      return "SILVER";
    default:
      return (e == null ? void 0 : e.trim().toUpperCase()) || "MEMBER";
  }
}, W = (e) => {
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
}, R = (e) => {
  const s = document.querySelector(e);
  if (!s)
    return;
  const n = s.querySelector(".section-title") ?? s, a = document.querySelector("#jeju-page-shell-header .header") ?? document.querySelector(".header"), o = (a == null ? void 0 : a.getBoundingClientRect().height) ?? 72, i = window.scrollY + n.getBoundingClientRect().top - o - 24;
  window.scrollTo({
    top: Math.max(0, i),
    behavior: "smooth"
  });
}, As = () => {
  var d, x;
  const { state: e } = A(), s = e.profile ?? C, n = (d = e.stats) != null && d.length ? e.stats : K, a = ((x = s.memberships) == null ? void 0 : x[0]) ?? C.memberships[0], o = s.tier ?? a, i = Es(o), r = Cs(o);
  return u.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []), /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ t.jsx(E, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ t.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ t.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ t.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ t.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: `https://api.dicebear.com/7.x/notionists/svg?seed=${s.name}&backgroundColor=f8f9fa`
          }
        ),
        /* @__PURE__ */ t.jsx("div", { className: `membership-grade-chip soft-radius ${i}`, children: /* @__PURE__ */ t.jsx("span", { children: r }) })
      ] }) }),
      /* @__PURE__ */ t.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ t.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ t.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ t.jsx("strong", { className: "highlight", children: s.name }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ t.jsx("p", { className: "profile-welcome-msg", children: "제주에서 보냈던 소중한 시간들을 다시 이어보세요." }),
        /* @__PURE__ */ t.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ t.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => R(".layer-full-management"), children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ t.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => R(".layer-itinerary"), children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ t.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => R(".layer-account-benefits"), children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ t.jsx("div", { className: "summary-stats-column", children: n.map((m) => /* @__PURE__ */ t.jsxs(E, { className: `stat-card meta-glass-theme tone-${m.tone}`, children: [
      /* @__PURE__ */ t.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ t.jsx("i", { "data-lucide": W(m.tone), className: `lucide-${W(m.tone)}` }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ t.jsx("span", { className: "stat-label", children: m.label }),
        /* @__PURE__ */ t.jsx("strong", { className: "stat-value", children: m.value })
      ] })
    ] }, m.label)) })
  ] });
}, Ms = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, ks = ({ tone: e, value: s }) => {
  const n = Ms[e];
  return /* @__PURE__ */ t.jsx("span", { className: `pill-shape ${n}`.trim(), children: s });
}, Ds = ["all", "air", "stay", "rent", "voucher"], Ts = () => {
  const { dispatch: e, state: s } = A(), n = s.bookings ?? [];
  u.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [n, s.filter]);
  const a = u.useMemo(() => s.filter === "all" ? n : n.filter((i) => i.type === s.filter), [n, s.filter]), o = u.useCallback(
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
      /* @__PURE__ */ t.jsx("div", { className: "booking-filters flex-gap", children: Ds.map((i) => /* @__PURE__ */ t.jsx(
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
          /* @__PURE__ */ t.jsx(ks, { tone: i.type, value: i.status }),
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
}, _s = {
  park_jy: { id: "park_jy", name: "박준영" },
  lee_je: { id: "lee_je", name: "이지은" },
  choi_sj: { id: "choi_sj", name: "최수진" }
}, Rs = (e) => e.trim().toLowerCase(), zs = async (e) => {
  await new Promise((n) => setTimeout(n, 400));
  const s = _s[e];
  return s ? {
    ...s,
    isMember: !0
  } : null;
}, Ls = ({
  initialCompanions: e = [],
  lookupMemberById: s = zs
} = {}) => {
  const [n, a] = u.useState(e), [o, i] = u.useState(""), [r, d] = u.useState(null), [x, m] = u.useState(!1), [f, j] = u.useState(null), N = u.useCallback(async (y) => {
    const c = Rs(y);
    if (!c) {
      j({ message: "검색할 제주그룹 회원 ID를 입력해라" }), d(null);
      return;
    }
    if (!/^[a-z0-9._-]{2,30}$/i.test(c)) {
      j({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), d(null);
      return;
    }
    m(!0), j(null), d(null);
    try {
      const p = await s(c);
      p ? d(p) : j({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" });
    } catch {
      j({ message: "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라" });
    } finally {
      m(!1);
    }
  }, [s]), b = u.useCallback(() => {
    i(""), d(null), j(null);
  }, []), h = u.useCallback((y) => {
    a((c) => c.some((p) => p.id === y.id) ? c : [...c, y]), b();
  }, [b]), g = u.useCallback((y) => {
    a((c) => c.filter((p) => p.id !== y));
  }, []);
  return {
    companions: n,
    searchQuery: o,
    setSearchQuery: i,
    searchResult: r,
    isSearching: x,
    errorObj: f,
    handleSearch: N,
    addCompanion: h,
    removeCompanion: g,
    clearSearch: b
  };
}, Os = ({
  initialCompanions: e,
  isOpen: s,
  onClose: n,
  onSave: a
}) => {
  const {
    companions: o,
    searchQuery: i,
    setSearchQuery: r,
    searchResult: d,
    isSearching: x,
    errorObj: m,
    handleSearch: f,
    addCompanion: j,
    removeCompanion: N,
    clearSearch: b
  } = Ls({ initialCompanions: e }), h = u.useRef(null), g = d ? o.some((p) => p.id === d.id) : !1;
  if (u.useEffect(() => {
    if (s) {
      b();
      const p = window.setTimeout(() => {
        var w;
        return (w = h.current) == null ? void 0 : w.focus();
      }, 100);
      return () => window.clearTimeout(p);
    }
  }, [s, b]), u.useEffect(() => {
    const p = (w) => {
      w.key === "Escape" && s && n();
    };
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [s, n]), u.useEffect(() => {
    s && window.lucide && window.lucide.createIcons();
  }, [s, d, o, m]), !s) return null;
  const y = (p) => {
    p.preventDefault(), f(i);
  }, c = () => {
    a(o), n();
  };
  return /* @__PURE__ */ t.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: n, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ t.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (p) => p.stopPropagation(),
      style: { padding: "40px" },
      children: [
        /* @__PURE__ */ t.jsx("header", { className: "modal-header", children: /* @__PURE__ */ t.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ t.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ t.jsxs("div", { className: "companion-modal-body", children: [
          /* @__PURE__ */ t.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: y, style: { gap: "16px", marginBottom: "32px" }, children: [
            /* @__PURE__ */ t.jsx(
              "input",
              {
                ref: h,
                className: "id-input companion-search-input",
                type: "text",
                placeholder: "제주그룹 회원 ID를 입력해라",
                value: i,
                onChange: (p) => r(p.target.value),
                style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px" },
                autoComplete: "off"
              }
            ),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "submit",
                className: "add-btn companion-search-submit pill-shape",
                disabled: x,
                style: { padding: "0 40px", fontSize: "16px" },
                children: x ? "검색 중..." : "검색"
              }
            )
          ] }),
          m && /* @__PURE__ */ t.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            m.message
          ] }),
          d && /* @__PURE__ */ t.jsxs("div", { className: "search-result-wrap list-item", style: { padding: "20px 24px", marginBottom: "32px", borderRadius: "16px" }, children: [
            /* @__PURE__ */ t.jsxs("div", { className: "companion-result-item item-info", children: [
              /* @__PURE__ */ t.jsxs("div", { className: "companion-avatar soft-radius is-linked", style: { width: "48px", height: "48px", fontSize: "18px", marginLeft: 0 }, children: [
                d.name.charAt(0),
                /* @__PURE__ */ t.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
              ] }),
              /* @__PURE__ */ t.jsxs("div", { className: "user-info name-meta", style: { gap: "4px" }, children: [
                /* @__PURE__ */ t.jsx("strong", { style: { fontSize: "16px" }, children: d.name }),
                /* @__PURE__ */ t.jsxs("span", { style: { fontSize: "14px" }, children: [
                  "@",
                  d.id
                ] }),
                /* @__PURE__ */ t.jsx("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: g ? "이미 연동된 제주그룹 회원" : "연동 가능한 제주그룹 회원" })
              ] })
            ] }),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                className: "add-btn companion-add-btn pill-shape",
                type: "button",
                onClick: () => j(d),
                disabled: g,
                style: { padding: "12px 28px", fontSize: "14px" },
                children: g ? "연동됨" : "추가"
              }
            )
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "linked-companions-section", children: [
            /* @__PURE__ */ t.jsxs("h4", { style: { fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }, children: [
              "연동된 동행자 (",
              o.length,
              "명)"
            ] }),
            o.length === 0 ? /* @__PURE__ */ t.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 추가해라." }) : /* @__PURE__ */ t.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { gap: "16px", maxHeight: "280px" }, children: o.map((p) => /* @__PURE__ */ t.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ t.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ t.jsxs("div", { className: `companion-avatar soft-radius ${p.isMember ? "is-linked" : ""}`, style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }, children: [
                  p.name.charAt(0),
                  p.isMember && /* @__PURE__ */ t.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator", style: { width: "14px", height: "14px" } })
                ] }),
                /* @__PURE__ */ t.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ t.jsx("strong", { style: { fontSize: "16px" }, children: p.name }),
                  /* @__PURE__ */ t.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    p.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ t.jsx(
                "button",
                {
                  className: "remove-btn companion-remove-btn",
                  onClick: () => N(p.id),
                  style: { padding: "10px 24px", fontSize: "14px" },
                  children: "해제"
                }
              )
            ] }, p.id)) })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs("footer", { className: "modal-footer", style: { marginTop: "40px", gap: "16px" }, children: [
          /* @__PURE__ */ t.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: n, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ t.jsx("button", { className: "save-btn pill-shape", type: "button", onClick: c, style: { padding: "20px 0", fontSize: "16px" }, children: "적용" })
        ] })
      ]
    }
  ) });
}, Ps = (e) => {
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
}, Bs = () => {
  const { dispatch: e, state: s } = A(), n = s.itinerary ?? [], a = n.length > 0 ? n : [
    {
      activities: [],
      companions: [],
      date: "일정 미정",
      googleMapUrl: "",
      id: "empty-itinerary",
      time: "시간 미정",
      title: "여행 일정 준비 중"
    }
  ], o = s.linkedCompanions ?? [], i = s.profile, [r, d] = u.useState(!1), [x, m] = u.useState(null), f = u.useRef({}), [j, N] = u.useState({});
  u.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [r, n, o]), u.useLayoutEffect(() => {
    const h = a.reduce((g, y) => {
      var c;
      return g[y.id] = ((c = f.current[y.id]) == null ? void 0 : c.scrollHeight) ?? 0, g;
    }, {});
    N((g) => {
      const y = Object.keys(g), c = Object.keys(h);
      return y.length === c.length && c.every((p) => g[p] === h[p]) ? g : h;
    });
  }, [a, r]);
  const b = (h) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: h }), ps(
      {
        id: i.id,
        profile: {
          email: i.email,
          id: i.id,
          name: i.name
        }
      },
      {
        linkedCompanions: h
      }
    ), m(null);
  };
  return /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ t.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: `itinerary-timeline-wrap ${r ? "is-expanded" : ""}`, children: [
      a.map((h, g) => {
        const y = g < 2, c = y || r, p = j[h.id] ?? 720, w = h.id === "empty-itinerary";
        return /* @__PURE__ */ t.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (v) => {
              f.current[h.id] = v;
            },
            "aria-hidden": !c,
            style: y ? void 0 : {
              overflow: "hidden",
              maxHeight: c ? `${p}px` : "0px",
              opacity: c ? 1 : 0,
              transform: c ? "translateY(0)" : "translateY(-18px)",
              marginBottom: c ? "40px" : "0px",
              pointerEvents: c ? "auto" : "none",
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
                  /* @__PURE__ */ t.jsxs("div", { className: `avatar-stack ${h.companions.length === 0 ? "is-empty" : ""}`, children: [
                    h.companions.map((v) => /* @__PURE__ */ t.jsxs(
                      "div",
                      {
                        className: `companion-avatar soft-radius ${v.isMember ? "is-linked" : ""}`,
                        title: v.name + (v.isMember ? " (연동됨)" : ""),
                        children: [
                          v.name.charAt(0),
                          v.isMember && /* @__PURE__ */ t.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                        ]
                      },
                      v.id
                    )),
                    /* @__PURE__ */ t.jsxs("span", { className: "comp-count-label", children: [
                      "총 ",
                      h.companions.length,
                      "명"
                    ] })
                  ] }),
                  /* @__PURE__ */ t.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => m(h.id), children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ t.jsxs(E, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ t.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ t.jsx("h3", { className: "iti-title", children: h.title }),
                  h.googleMapUrl ? /* @__PURE__ */ t.jsxs("a", { className: "map-link-btn pill-shape", href: h.googleMapUrl, rel: "noopener noreferrer", target: "_blank", children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 보기"
                  ] }) : /* @__PURE__ */ t.jsxs("span", { className: "map-link-btn pill-shape is-disabled", "aria-disabled": "true", children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 준비 중"
                  ] })
                ] }),
                /* @__PURE__ */ t.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ t.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ t.jsx("ul", { className: `checklist-list ${h.activities.length === 0 ? "is-empty" : ""}`, children: h.activities.map((v) => {
                    const T = Ps(v.status), Y = v.status === "used", V = v.status === "cancelled" || v.status === "missed";
                    return /* @__PURE__ */ t.jsx(
                      "li",
                      {
                        className: `checklist-item ${Y ? "checked" : ""} soft-radius`,
                        style: T.style,
                        children: /* @__PURE__ */ t.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ t.jsx(
                            "i",
                            {
                              "data-lucide": T.icon,
                              style: {
                                color: Y ? "var(--brand-rent)" : V ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ t.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ t.jsx("span", { className: "check-text", children: v.label }),
                            /* @__PURE__ */ t.jsx(
                              "span",
                              {
                                style: {
                                  color: V ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (v.ownerName ?? "본인") + " · " + T.label
                              }
                            )
                          ] })
                        ] })
                      },
                      v.id
                    );
                  }) }),
                  w ? /* @__PURE__ */ t.jsx("p", { className: "checklist-empty-caption", children: "등록된 활동이 아직 없다." }) : null
                ] })
              ] })
            ]
          },
          h.id
        );
      }),
      n.length > 2 && /* @__PURE__ */ t.jsx("div", { className: `timeline-gradient-overlay ${r ? "active" : ""}`, children: /* @__PURE__ */ t.jsx("button", { className: "expand-cta-btn pill-shape", onClick: () => d(!r), children: r ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        "전체 일정 접기 ",
        /* @__PURE__ */ t.jsx("i", { className: "lucide-chevron-up" })
      ] }) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        "남은 ",
        n.length - 2,
        "개의 일정 더 보기 ",
        /* @__PURE__ */ t.jsx("i", { className: "lucide-chevron-down" })
      ] }) }) })
    ] }),
    x && /* @__PURE__ */ t.jsx(
      Os,
      {
        isOpen: !!x,
        onClose: () => m(null),
        initialCompanions: o,
        onSave: b
      }
    )
  ] });
}, z = (e) => ({
  email: e.email,
  name: e.name,
  phone: e.phone
}), Ks = (e) => ({
  email: e.email.trim(),
  name: e.name.trim(),
  phone: e.phone.trim()
}), Q = (e) => e.name.trim().length > 0 && e.email.trim().includes("@") && e.phone.trim().length > 0, Fs = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, $s = () => {
  var y;
  const { dispatch: e, state: s } = A(), n = s.profile ?? C, a = (y = s.stats) != null && y.length ? s.stats : K, o = n.passport, [i, r] = u.useState(() => z(n)), [d, x] = u.useState(() => z(n)), [m, f] = u.useState(!1), j = (d.name.trim().charAt(0) || C.name.trim().charAt(0) || "J").toUpperCase();
  u.useEffect(() => {
    m && window.lucide && window.lucide.createIcons();
  }, [m]), u.useEffect(() => {
    const c = z(n);
    m || (r(c), x(c));
  }, [n, m]);
  const N = () => {
    x(i), f(!0);
  }, b = () => {
    x(i), f(!1);
  }, h = () => {
    const c = Ks(d);
    Q(c) && (r(c), x(c), e({ type: "PATCH_PROFILE", payload: c }), f(!1));
  }, g = !Q(d);
  return /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ t.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ t.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ t.jsxs(E, { className: "account-info-box meta-glass-theme", children: [
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
        /* @__PURE__ */ t.jsxs(E, { className: "passport-info-box meta-glass-theme", children: [
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
        /* @__PURE__ */ t.jsxs(E, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ t.jsx("div", { className: "box-head", children: /* @__PURE__ */ t.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ t.jsx("div", { className: "benefit-tiles", children: a.slice(0, 2).map((c) => /* @__PURE__ */ t.jsxs("div", { className: `benefit-tile tone-${c.tone} soft-radius`, children: [
            /* @__PURE__ */ t.jsx("span", { className: "benefit-label", children: c.label }),
            /* @__PURE__ */ t.jsx("strong", { className: "benefit-value", style: Fs(c.tone), children: c.value }),
            /* @__PURE__ */ t.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, c.label)) })
        ] })
      ] })
    ] }),
    m ? /* @__PURE__ */ t.jsx("div", { className: "meta-modal-overlay", onClick: b, children: /* @__PURE__ */ t.jsxs(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (c) => c.stopPropagation(),
        style: { padding: "36px" },
        children: [
          /* @__PURE__ */ t.jsx("header", { className: "modal-header", children: /* @__PURE__ */ t.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ t.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ t.jsxs("div", { className: "profile-link-preview soft-radius", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", children: [
              j,
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
                  value: d.name,
                  onChange: (c) => x((p) => ({ ...p, name: c.target.value })),
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
                  value: d.email,
                  onChange: (c) => x((p) => ({ ...p, email: c.target.value })),
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
                  value: d.phone,
                  onChange: (c) => x((p) => ({ ...p, phone: c.target.value })),
                  style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ t.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ t.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: b, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: h,
                disabled: g,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ]
      }
    ) }) : null
  ] });
}, Us = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"]
}, Hs = () => typeof document > "u" ? !1 : Array.from(document.querySelectorAll("link[href], script[src]")).some((e) => (e.getAttribute("href") ?? e.getAttribute("src") ?? "").includes("/front-mirror/")), J = (e, s = !1) => {
  const n = e === "qna" ? "qna" : e === "notice" ? "notice" : "faq", [a, o] = Us[n];
  return s ? o : a;
}, qs = () => {
  const { state: e } = A(), s = e.supportItems ?? [], [n] = u.useState(Hs), [a, o] = u.useState({});
  return /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-support", children: [
    /* @__PURE__ */ t.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "고객지원" }),
      /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "여행 중 궁금한 점을 전문가와 상담하세요." })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "support-bento-grid bento-grid", children: s.map((i) => /* @__PURE__ */ t.jsxs("a", { className: `support-item-card bento-item meta-glass-theme soft-radius ${i.id}`, href: i.href, children: [
      /* @__PURE__ */ t.jsx("div", { className: "sp-icon", children: /* @__PURE__ */ t.jsx(
        "img",
        {
          alt: i.label,
          onError: (r) => {
            a[i.id] || n || (o((d) => ({
              ...d,
              [i.id]: !0
            })), r.currentTarget.src = J(i.id, !0));
          },
          src: J(i.id, n || a[i.id] === !0)
        }
      ) }),
      /* @__PURE__ */ t.jsxs("div", { className: "sp-text", children: [
        /* @__PURE__ */ t.jsx("strong", { className: "sp-label", children: i.label }),
        i.count !== null ? /* @__PURE__ */ t.jsxs("span", { className: `sp-badge pill-shape ${i.count > 0 ? "active" : ""}`, children: [
          i.count,
          " 건"
        ] }) : /* @__PURE__ */ t.jsx("span", { className: "sp-link-text", children: "상세 보기" })
      ] })
    ] }, i.id)) })
  ] });
}, Ys = () => /* @__PURE__ */ t.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ t.jsx(As, {}),
  /* @__PURE__ */ t.jsx(Ts, {}),
  /* @__PURE__ */ t.jsx(Bs, {}),
  /* @__PURE__ */ t.jsx($s, {}),
  /* @__PURE__ */ t.jsx(qs, {})
] }), Ws = () => /* @__PURE__ */ t.jsx(Is, { children: /* @__PURE__ */ t.jsx(Ys, {}) });
export {
  Ws as M
};
