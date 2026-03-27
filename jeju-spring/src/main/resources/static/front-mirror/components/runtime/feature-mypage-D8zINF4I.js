import { j as t, a as p } from "./react-vendor-BoSfm_Te.js";
import { A as Z } from "./legacy-core-BoI547nw.js";
const $ = {
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
}, ee = [
  { label: "보유 포인트", tone: "point", value: "0P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "0장" },
  { label: "다가오는 여행", tone: "air", value: "0건" }
], se = [
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
], te = {
  id: "",
  isMember: !1,
  name: ""
}, be = {
  checked: !1,
  id: "",
  label: "",
  ownerId: "",
  ownerName: "",
  status: "reserved",
  type: "voucher"
}, Ne = {
  activities: [],
  companions: [],
  date: "",
  googleMapUrl: "",
  id: "",
  time: "",
  title: ""
}, Se = [], we = [];
function ne({
  currentAccountId: e,
  linkedCompanions: s,
  travelEvents: n
}) {
  const a = new Map(s.map((i) => [i.id, i])), o = /* @__PURE__ */ new Set([
    ...e ? [e] : [],
    ...s.map((i) => i.id)
  ]), r = /* @__PURE__ */ new Map();
  for (const i of n) {
    if (o.size > 0 && !o.has(i.ownerId))
      continue;
    const c = r.get(i.dayId), y = {
      checked: i.status === "used",
      id: i.id,
      label: i.activityLabel,
      ownerId: i.ownerId,
      ownerName: i.ownerName,
      status: i.status,
      type: i.type
    };
    if (c) {
      if (c.activities.push(y), i.ownerId !== e && a.has(i.ownerId)) {
        const u = a.get(i.ownerId);
        u && !c.companions.some((b) => b.id === u.id) && c.companions.push({ ...u });
      }
      continue;
    }
    r.set(i.dayId, {
      activities: [y],
      companions: i.ownerId !== e && a.has(i.ownerId) ? [{ ...a.get(i.ownerId) }] : [],
      date: i.date,
      googleMapUrl: i.googleMapUrl,
      id: i.dayId,
      sortKey: `${i.date} ${i.time}`,
      time: i.time,
      title: i.title
    });
  }
  return Array.from(r.values()).sort((i, c) => i.sortKey.localeCompare(c.sortKey)).map(({ sortKey: i, ...c }) => c);
}
const M = oe($), U = T(ee), Ie = le(se), F = q(Se), H = Y(we), ae = ne({
  currentAccountId: $.id ?? "",
  linkedCompanions: F,
  travelEvents: H
}), re = [
  { count: 0, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], ie = () => ({
  bookings: le(se),
  itinerary: ce(ae),
  linkedCompanions: q(F),
  profile: oe($),
  stats: T(ee),
  supportItems: de(re),
  travelEvents: Y(H)
}), R = (e) => {
  const s = ie(), n = ze(e);
  if (!Ve(n))
    return s;
  const o = _e(n, s.profile), r = Ue(n.linkedCompanions, s.linkedCompanions), i = Fe(n.travelEvents, s.travelEvents), c = n.travelEvents !== void 0 ? ne({
    currentAccountId: o.id ?? s.profile.id ?? "",
    linkedCompanions: r,
    travelEvents: i
  }) : Ke(n.itinerary, s.itinerary);
  return {
    bookings: Be(n.bookings, s.bookings),
    itinerary: c,
    linkedCompanions: r,
    profile: o,
    stats: Oe(n.stats ?? n, s.stats),
    supportItems: $e(n.supportItems ?? n.support ?? n.inquiries, s.supportItems),
    travelEvents: i
  };
}, D = (e) => {
  Ee(M, e.profile), Ae(U, e.stats), Ce(Ie, e.bookings), Me(ae, e.itinerary), ke(F, e.linkedCompanions), De(re, e.supportItems), Te(H, e.travelEvents);
};
function oe(e) {
  return {
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function T(e) {
  return e.map((s) => ({ ...s }));
}
function le(e) {
  return e.map((s) => ({
    ...s,
    tags: [...s.tags]
  }));
}
function q(e) {
  return e.map((s) => ({ ...s }));
}
function ce(e) {
  return e.map((s) => ({
    ...s,
    activities: s.activities.map((n) => ({ ...n })),
    companions: s.companions.map((n) => ({ ...n }))
  }));
}
function de(e) {
  return e.map((s) => ({ ...s }));
}
function Y(e) {
  return e.map((s) => ({ ...s }));
}
const Ee = (e, s) => {
  if (e.email = s.email, e.memberships.splice(0, e.memberships.length, ...s.memberships), e.name = s.name, e.phone = s.phone, e.tier = s.tier, e.role = s.role, e.id = s.id, s.passport) {
    e.passport = { ...s.passport };
    return;
  }
  delete e.passport;
}, Ae = (e, s) => {
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
}, Me = (e, s) => {
  e.splice(
    0,
    e.length,
    ...s.map((n) => ({
      ...n,
      activities: n.activities.map((a) => ({ ...a })),
      companions: n.companions.map((a) => ({ ...a }))
    }))
  );
}, ke = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, De = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, Te = (e, s) => {
  e.splice(0, e.length, ...s.map((n) => ({ ...n })));
}, ze = (e) => {
  const s = {}, n = (a) => {
    I(a) && Object.assign(s, a);
  };
  return n(e), I(e) && (n(e.user), n(e.member), n(e.profile), n(e.data), n(e.session)), s;
}, _e = (e, s) => {
  const n = Re(e.memberships, e.tier ?? e.role), a = Le(e.passport), o = l(e.tier) ?? n[0] ?? l(e.role), r = l(e.id) ?? l(e.memberId) ?? l(e.userId), i = l(e.name) ?? l(e.displayName) ?? l(e.fullName) ?? l(e.nickname) ?? l(e.id) ?? l(e.memberId) ?? l(e.userId) ?? s.name;
  return {
    email: l(e.email) ?? qe(e, r, i) ?? s.email,
    id: r ?? s.id,
    memberships: n,
    name: i,
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
}, Le = (e) => {
  const s = I(e) ? e : null;
  if (!s)
    return;
  const n = {
    expiryDate: l(s == null ? void 0 : s.expiryDate) ?? "",
    issuingCountry: l(s == null ? void 0 : s.issuingCountry) ?? "",
    number: l(s == null ? void 0 : s.number) ?? ""
  };
  if (!(!n.expiryDate && !n.issuingCountry && !n.number))
    return n;
}, Oe = (e, s) => Array.isArray(e) && e.length > 0 ? s.map((n, a) => Pe(e[a], n, !0)) : Array.isArray(e) && e.length === 0 ? T(s) : I(e) ? He(e, s) : T(s), Pe = (e, s, n = !1) => {
  const a = I(e) ? e : {}, o = as(a.tone) ? a.tone : s.tone, r = l(a.label) ?? s.label, i = a.value ?? s.value;
  return {
    label: r,
    tone: o,
    value: P(i, s)
  };
}, P = (e, s) => {
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
}, Be = (e, s) => Array.isArray(e) ? e.length === 0 ? [] : e.map((n, a) => Ge(n, s[a % s.length] ?? s[0], !0)) : [], Ke = (e, s) => !Array.isArray(e) || e.length === 0 ? ce(s) : e.map(
  (n, a) => We(
    n,
    s.length > 0 ? s[a % s.length] ?? s[0] : Ne
  )
), $e = (e, s) => !Array.isArray(e) || e.length === 0 ? de(s) : e.map((n, a) => Xe(n, s[a % s.length] ?? s[0])), Ue = (e, s) => !Array.isArray(e) || e.length === 0 ? q(s) : e.map(
  (n, a) => es(
    n,
    s.length > 0 ? s[a % s.length] ?? s[0] : te
  )
), pe = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((s) => ss(s)).filter((s) => s !== null), Fe = (e, s) => {
  const n = pe(e);
  return n.length > 0 ? n : Y(s);
}, He = (e, s) => s.map((n) => {
  const a = ns(e, ts(n.tone));
  return a === void 0 ? { ...n } : {
    ...n,
    value: P(a, n)
  };
}), qe = (e, s, n) => {
  const a = s ?? l(e.memberId) ?? l(e.userId) ?? l(e.username) ?? l(e.loginId) ?? Ye(n);
  if (a)
    return `${a}@jejugroup.example`;
}, Ye = (e) => {
  const n = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return n.length > 0 ? n : void 0;
}, Ve = (e) => [
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
].some((n) => n in e), Ge = (e, s, n = !1) => {
  const a = I(e) ? e : {}, o = Array.isArray(a.tags) ? a.tags.map((i) => l(i)).filter((i) => !!i) : [], r = V(a.type) ? a.type : s.type;
  return {
    amount: l(a.amount) ?? (n ? "" : s.amount),
    date: l(a.date) ?? (n ? "" : s.date),
    duration: l(a.duration) ?? (n ? void 0 : s.duration),
    id: l(a.id) ?? (n ? "" : s.id),
    paymentMethod: l(a.paymentMethod) ?? (n ? void 0 : s.paymentMethod),
    status: l(a.status) ?? (n ? "" : s.status),
    tags: o.length > 0 ? o : n ? [] : [...s.tags],
    title: l(a.title) ?? (n ? "" : s.title),
    type: r,
    voucherUrl: l(a.voucherUrl) ?? (n ? void 0 : s.voucherUrl)
  };
}, We = (e, s) => {
  const n = I(e) ? e : {}, a = Array.isArray(n.activities) ? n.activities.map(
    (r, i) => Qe(
      r,
      s.activities.length > 0 ? s.activities[i % s.activities.length] ?? s.activities[0] : be
    )
  ) : s.activities.map((r) => ({ ...r })), o = Array.isArray(n.companions) ? n.companions.map(
    (r, i) => Je(
      r,
      s.companions.length > 0 ? s.companions[i % s.companions.length] ?? s.companions[0] : te
    )
  ) : s.companions.map((r) => ({ ...r }));
  return {
    activities: a,
    companions: o,
    date: l(n.date) ?? s.date,
    googleMapUrl: l(n.googleMapUrl) ?? s.googleMapUrl,
    id: l(n.id) ?? s.id,
    time: l(n.time) ?? s.time,
    title: l(n.title) ?? s.title
  };
}, Qe = (e, s) => {
  const n = I(e) ? e : {};
  return {
    checked: typeof n.checked == "boolean" ? n.checked : B(n.status) ? n.status === "used" : s.checked,
    id: l(n.id) ?? s.id,
    label: l(n.label) ?? s.label,
    ownerId: l(n.ownerId) ?? s.ownerId,
    ownerName: l(n.ownerName) ?? s.ownerName,
    status: B(n.status) ? n.status : s.status,
    type: V(n.type) ? n.type : s.type
  };
}, Je = (e, s) => {
  const n = I(e) ? e : {};
  return {
    id: l(n.id) ?? s.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : s.isMember,
    name: l(n.name) ?? s.name
  };
}, Xe = (e, s) => {
  const n = I(e) ? e : {};
  return {
    count: Ze(n.count, s.count),
    href: l(n.href) ?? s.href,
    id: l(n.id) ?? s.id,
    label: l(n.label) ?? s.label
  };
}, Ze = (e, s) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const n = l(e);
  if (!n)
    return s;
  const a = Number(n);
  return Number.isFinite(a) ? a : s;
}, es = (e, s) => {
  const n = I(e) ? e : {};
  return {
    id: l(n.id) ?? s.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : s.isMember,
    name: l(n.name) ?? s.name
  };
}, ss = (e) => {
  const s = I(e) ? e : null;
  if (!s)
    return null;
  const n = l(s.id), a = l(s.dayId), o = l(s.title), r = l(s.date), i = l(s.time), c = l(s.activityLabel), y = l(s.ownerId), u = l(s.ownerName), b = l(s.googleMapUrl);
  return !n || !a || !o || !r || !i || !c || !y || !u || !b ? null : {
    activityLabel: c,
    date: r,
    dayId: a,
    googleMapUrl: b,
    id: n,
    ownerId: y,
    ownerName: u,
    status: B(s.status) ? s.status : "reserved",
    time: i,
    title: o,
    type: V(s.type) ? s.type : "voucher"
  };
}, ts = (e) => {
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
}, ns = (e, s) => {
  for (const n of s)
    if (n in e) {
      const a = e[n];
      if (a != null)
        return Array.isArray(a) ? a.length : a;
    }
}, I = (e) => e !== null && typeof e == "object" && !Array.isArray(e), l = (e) => {
  if (typeof e == "string") {
    const s = e.trim();
    return s.length > 0 ? s : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, V = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", B = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", as = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", C = ({ children: e, className: s = "" }) => {
  const n = ["bento-box", "soft-radius", s].filter(Boolean).join(" ");
  return /* @__PURE__ */ t.jsx("div", { className: n, children: e });
}, K = "jeju:mypage-dashboard-mock-updated", me = "jeju:mypage-dashboard:", rs = ["id", "memberId", "userId", "email", "loginId", "username"], ue = ["user", "member", "profile", "data", "session"], A = (e) => e !== null && typeof e == "object" && !Array.isArray(e), is = (e) => {
  if (typeof e == "string") {
    const s = e.trim();
    return s.length > 0 ? s : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, os = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), ls = (e) => {
  const s = [];
  if (!A(e))
    return s;
  s.push(e);
  for (const n of ue) {
    const a = e[n];
    A(a) && s.push(a);
  }
  return s;
}, he = (e) => {
  const s = ls(e);
  for (const n of s)
    for (const a of rs) {
      const o = is(n[a]);
      if (!o)
        continue;
      const r = os(o);
      if (r)
        return r;
    }
  return null;
}, xe = (e) => `${me}${e}`, cs = (e) => {
  if (!e)
    return null;
  try {
    const s = JSON.parse(e);
    return A(s) ? s : null;
  } catch {
    return null;
  }
}, ds = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(K, {
      detail: { accountKey: e }
    })
  );
}, ye = (e) => {
  const s = he(e);
  return s ? fe(s) : null;
}, fe = (e) => {
  try {
    return cs(localStorage.getItem(xe(e)));
  } catch {
    return null;
  }
}, z = (e, s) => {
  const n = A(e) ? e : {}, a = A(s) ? s : {};
  if (Object.keys(n).length === 0 && Object.keys(a).length === 0)
    return null;
  const o = {
    ...n,
    ...a
  };
  for (const r of ue) {
    const i = n[r], c = a[r];
    (A(i) || A(c)) && (o[r] = {
      ...A(i) ? i : {},
      ...A(c) ? c : {}
    });
  }
  return o;
}, ps = (e, s) => {
  const n = he(e);
  if (!n)
    return !1;
  try {
    return localStorage.setItem(xe(n), JSON.stringify(s)), ds(n), !0;
  } catch {
    return !1;
  }
}, ms = (e, s) => {
  const n = z(ye(e), s);
  return n ? ps(e, n) : !1;
}, us = "userSession", G = "jeju:session-updated", hs = "/api/auth/session", xs = "/api/mypage/dashboard", ys = () => {
  const e = ie();
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
}, fs = (e, s) => {
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
}, ge = p.createContext(null), ve = (e) => `${Z}${e}`, gs = (e) => e !== null && typeof e == "object" && !Array.isArray(e), vs = async () => {
  try {
    const e = await fetch(ve(hs), {
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
}, js = async () => {
  try {
    const e = await fetch(ve(xs), {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    if (e.status === 401 || !e.ok)
      return null;
    const s = await e.json();
    return !gs(s) || s.success !== !0 || !("dashboard" in s) ? null : s.dashboard ?? null;
  } catch {
    return null;
  }
}, bs = async () => await vs(), Ns = async (e) => {
  if (!e)
    return null;
  const s = await js();
  return s ? z(e, s) : e;
}, W = async () => {
  const e = await bs();
  if (!e)
    return null;
  const s = await Ns(e);
  return Is(s);
}, Ss = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), ws = (e, s) => ({
  ...e,
  ...s,
  memberships: s.memberships ? [...s.memberships] : [...e.memberships],
  passport: s.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : s.passport ? { ...s.passport } : void 0
}), Is = (e) => {
  const s = z(e, ye(e)), n = R(s);
  if (n.linkedCompanions.length === 0)
    return R(s);
  const a = [
    ...n.travelEvents,
    ...n.linkedCompanions.flatMap((o) => {
      const r = fe(o.id);
      return !r || !("travelEvents" in r) ? [] : pe(r.travelEvents).map((i) => ({
        ...i,
        ownerId: i.ownerId || o.id,
        ownerName: i.ownerName || o.name
      }));
    })
  ];
  return R(
    z(s, {
      linkedCompanions: n.linkedCompanions,
      travelEvents: a
    })
  );
}, Es = ({ children: e }) => {
  const [s, n] = p.useReducer(fs, void 0, ys), [a, o] = p.useState(!1), [r, i] = p.useState(!1), c = (x) => {
    D(x), n({ type: "HYDRATE_DASHBOARD", payload: x });
  }, y = (x) => {
    x.type === "HYDRATE_DASHBOARD" ? D(x.payload) : x.type === "PATCH_PROFILE" && D({
      bookings: s.bookings,
      itinerary: s.itinerary,
      linkedCompanions: s.linkedCompanions,
      profile: ws(s.profile, x.payload),
      stats: s.stats,
      supportItems: s.supportItems,
      travelEvents: s.travelEvents
    }), n(x);
  }, u = async () => {
    const x = await W();
    return x ? (c(x), !0) : !1;
  };
  p.useEffect(() => {
    D(Ss(s));
  }, [s.bookings, s.itinerary, s.linkedCompanions, s.profile, s.stats, s.supportItems, s.travelEvents]), p.useEffect(() => {
    let x = !0, w = !1;
    const S = async () => {
      const d = await W();
      if (!d) {
        if (!x)
          return;
        i(!1), o(!0);
        return;
      }
      x && (i(!0), o(!0), c(d));
    }, m = () => {
      w || (w = !0, S().finally(() => {
        w = !1;
      }));
    };
    m();
    const v = (d) => {
      var E;
      if (d.key === us) {
        m();
        return;
      }
      (E = d.key) != null && E.startsWith(me) && m();
    }, g = () => {
      m();
    }, h = () => {
      m();
    };
    return window.addEventListener("storage", v), window.addEventListener(G, g), window.addEventListener(K, h), () => {
      x = !1, window.removeEventListener("storage", v), window.removeEventListener(G, g), window.removeEventListener(K, h);
    };
  }, [n]);
  const b = p.useMemo(
    () => ({
      dispatch: y,
      refreshDashboard: u,
      state: s
    }),
    [y, u, s]
  );
  return !a || !r ? /* @__PURE__ */ t.jsxs("div", { className: "mypage-auth-empty-state soft-radius", role: "status", "aria-live": "polite", children: [
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
  ] }) : /* @__PURE__ */ t.jsx(ge.Provider, { value: b, children: e });
}, k = () => {
  const e = p.useContext(ge);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, je = (e) => {
  const s = (e == null ? void 0 : e.trim().toLowerCase()) ?? "";
  return s.includes("diamond") || s.includes("다이아") ? "diamond" : s.includes("platinum") || s.includes("플래티넘") ? "platinum" : s.includes("silver") || s.includes("실버") ? "silver" : s.includes("gold") || s.includes("골드") ? "gold" : null;
}, As = (e) => je(e) ?? "neutral", Cs = (e) => {
  switch (je(e)) {
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
}, Q = (e) => {
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
}, L = (e) => {
  const s = document.querySelector(e);
  if (!s)
    return;
  const n = s.querySelector(".section-title") ?? s, a = document.querySelector("#jeju-page-shell-header .header") ?? document.querySelector(".header"), o = (a == null ? void 0 : a.getBoundingClientRect().height) ?? 72, r = window.scrollY + n.getBoundingClientRect().top - o - 24;
  window.scrollTo({
    top: Math.max(0, r),
    behavior: "smooth"
  });
}, Ms = () => {
  var c, y;
  const { state: e } = k(), s = e.profile ?? M, n = (c = e.stats) != null && c.length ? e.stats : U, a = ((y = s.memberships) == null ? void 0 : y[0]) ?? M.memberships[0], o = s.tier ?? a, r = As(o), i = Cs(o);
  return p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []), /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ t.jsx(C, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ t.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ t.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ t.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ t.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: `https://api.dicebear.com/7.x/notionists/svg?seed=${s.name}&backgroundColor=f8f9fa`
          }
        ),
        /* @__PURE__ */ t.jsx("div", { className: `membership-grade-chip soft-radius ${r}`, children: /* @__PURE__ */ t.jsx("span", { children: i }) })
      ] }) }),
      /* @__PURE__ */ t.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ t.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ t.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ t.jsx("strong", { className: "highlight", children: s.name }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ t.jsx("p", { className: "profile-welcome-msg", children: "제주에서 보냈던 소중한 시간들을 다시 이어보세요." }),
        /* @__PURE__ */ t.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ t.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => L(".layer-full-management"), children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ t.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => L(".layer-itinerary"), children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ t.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => L(".layer-account-benefits"), children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ t.jsx("div", { className: "summary-stats-column", children: n.map((u) => /* @__PURE__ */ t.jsxs(C, { className: `stat-card meta-glass-theme tone-${u.tone}`, children: [
      /* @__PURE__ */ t.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ t.jsx("i", { "data-lucide": Q(u.tone), className: `lucide-${Q(u.tone)}` }) }),
      /* @__PURE__ */ t.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ t.jsx("span", { className: "stat-label", children: u.label }),
        /* @__PURE__ */ t.jsx("strong", { className: "stat-value", children: u.value })
      ] })
    ] }, u.label)) })
  ] });
}, ks = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, Ds = ({ tone: e, value: s }) => {
  const n = ks[e];
  return /* @__PURE__ */ t.jsx("span", { className: `pill-shape ${n}`.trim(), children: s });
}, Ts = ["all", "air", "stay", "rent", "voucher"], zs = () => {
  const { dispatch: e, state: s } = k(), n = s.bookings ?? [];
  p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [n, s.filter]);
  const a = p.useMemo(() => s.filter === "all" ? n : n.filter((r) => r.type === s.filter), [n, s.filter]), o = p.useCallback(
    (r) => {
      e({ type: "SET_FILTER", payload: r });
    },
    [e]
  );
  return /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-full-management", children: [
    /* @__PURE__ */ t.jsxs("header", { className: "section-header flex-header", children: [
      /* @__PURE__ */ t.jsxs("div", { className: "title-group", children: [
        /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "나의 예약 현황" }),
        /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 및 바우처를 한눈에 관리하세요." })
      ] }),
      /* @__PURE__ */ t.jsx("div", { className: "booking-filters flex-gap", children: Ts.map((r) => /* @__PURE__ */ t.jsx(
        "button",
        {
          className: `filter-chip pill-shape ${s.filter === r ? "active" : ""}`,
          onClick: () => o(r),
          type: "button",
          children: r === "all" ? "전체" : r === "air" ? "항공" : r === "stay" ? "숙박" : r === "rent" ? "렌터카" : "바우처"
        },
        r
      )) })
    ] }),
    /* @__PURE__ */ t.jsx("ul", { className: "full-width-trip-list", children: a.length > 0 ? a.map((r) => /* @__PURE__ */ t.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": r.type, children: [
      /* @__PURE__ */ t.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ t.jsx(Ds, { tone: r.type, value: r.status }),
          /* @__PURE__ */ t.jsx("div", { className: "trip-tags", children: r.tags.map((i) => /* @__PURE__ */ t.jsx("span", { className: "meta-tag pill-shape", children: i }, i)) })
        ] }),
        /* @__PURE__ */ t.jsx("h3", { className: "trip-title", children: r.title }),
        /* @__PURE__ */ t.jsxs("div", { className: "trip-meta-grid", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "calendar", className: "lucide-calendar" }),
            /* @__PURE__ */ t.jsx("span", { children: r.date }),
            r.duration ? /* @__PURE__ */ t.jsxs("strong", { className: "duration-label", children: [
              "(",
              r.duration,
              ")"
            ] }) : null
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "wallet", className: "lucide-wallet" }),
            /* @__PURE__ */ t.jsx("strong", { children: r.amount }),
            r.paymentMethod ? /* @__PURE__ */ t.jsxs("span", { className: "method-label", children: [
              " / ",
              r.paymentMethod
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ t.jsxs("div", { className: "trip-inline-actions", children: [
        /* @__PURE__ */ t.jsxs("div", { className: "action-group", children: [
          r.voucherUrl ? /* @__PURE__ */ t.jsxs("button", { className: "inline-btn primary pill-shape", type: "button", children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "download", className: "lucide-download" }),
            "e-티켓 / 바우처"
          ] }) : /* @__PURE__ */ t.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "결제 진행하기" }),
          /* @__PURE__ */ t.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "예약 변경" })
        ] }),
        /* @__PURE__ */ t.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "예약 취소" })
      ] })
    ] }, r.id)) : /* @__PURE__ */ t.jsxs("div", { className: "empty-state-placeholder soft-radius", children: [
      /* @__PURE__ */ t.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
      /* @__PURE__ */ t.jsx("p", { children: "선택하신 카테고리에 해당하는 예약 내역이 없습니다." })
    ] }) })
  ] });
}, _s = {
  park_jy: { id: "park_jy", name: "박준영" },
  lee_je: { id: "lee_je", name: "이지은" },
  choi_sj: { id: "choi_sj", name: "최수진" }
}, Rs = (e) => e.trim().toLowerCase(), Ls = async (e) => {
  await new Promise((n) => setTimeout(n, 400));
  const s = _s[e];
  return s ? {
    ...s,
    isMember: !0
  } : null;
}, Os = ({
  initialCompanions: e = [],
  lookupMemberById: s = Ls
} = {}) => {
  const [n, a] = p.useState(e), [o, r] = p.useState(""), [i, c] = p.useState(null), [y, u] = p.useState(!1), [b, x] = p.useState(null), w = p.useCallback(async (g) => {
    const h = Rs(g);
    if (!h) {
      x({ message: "검색할 제주그룹 회원 ID를 입력해라" }), c(null);
      return;
    }
    if (!/^[a-z0-9._-]{2,30}$/i.test(h)) {
      x({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), c(null);
      return;
    }
    u(!0), x(null), c(null);
    try {
      const d = await s(h);
      d ? c(d) : x({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" });
    } catch {
      x({ message: "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라" });
    } finally {
      u(!1);
    }
  }, [s]), S = p.useCallback(() => {
    r(""), c(null), x(null);
  }, []), m = p.useCallback((g) => {
    a((h) => h.some((d) => d.id === g.id) ? h : [...h, g]), S();
  }, [S]), v = p.useCallback((g) => {
    a((h) => h.filter((d) => d.id !== g));
  }, []);
  return {
    companions: n,
    searchQuery: o,
    setSearchQuery: r,
    searchResult: i,
    isSearching: y,
    errorObj: b,
    handleSearch: w,
    addCompanion: m,
    removeCompanion: v,
    clearSearch: S
  };
}, Ps = ({
  initialCompanions: e,
  isOpen: s,
  onClose: n,
  onSave: a
}) => {
  const {
    companions: o,
    searchQuery: r,
    setSearchQuery: i,
    searchResult: c,
    isSearching: y,
    errorObj: u,
    handleSearch: b,
    addCompanion: x,
    removeCompanion: w,
    clearSearch: S
  } = Os({ initialCompanions: e }), m = p.useRef(null), v = c ? o.some((d) => d.id === c.id) : !1;
  if (p.useEffect(() => {
    if (s) {
      S();
      const d = window.setTimeout(() => {
        var E;
        return (E = m.current) == null ? void 0 : E.focus();
      }, 100);
      return () => window.clearTimeout(d);
    }
  }, [s, S]), p.useEffect(() => {
    const d = (E) => {
      E.key === "Escape" && s && n();
    };
    return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
  }, [s, n]), p.useEffect(() => {
    s && window.lucide && window.lucide.createIcons();
  }, [s, c, o, u]), !s) return null;
  const g = (d) => {
    d.preventDefault(), b(r);
  }, h = () => {
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
                ref: m,
                className: "id-input companion-search-input",
                type: "text",
                placeholder: "제주그룹 회원 ID를 입력해라",
                value: r,
                onChange: (d) => i(d.target.value),
                style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px" },
                autoComplete: "off"
              }
            ),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "submit",
                className: "add-btn companion-search-submit pill-shape",
                disabled: y,
                style: { padding: "0 40px", fontSize: "16px" },
                children: y ? "검색 중..." : "검색"
              }
            )
          ] }),
          u && /* @__PURE__ */ t.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ t.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            u.message
          ] }),
          c && /* @__PURE__ */ t.jsxs("div", { className: "search-result-wrap list-item", style: { padding: "20px 24px", marginBottom: "32px", borderRadius: "16px" }, children: [
            /* @__PURE__ */ t.jsxs("div", { className: "companion-result-item item-info", children: [
              /* @__PURE__ */ t.jsxs("div", { className: "companion-avatar soft-radius is-linked", style: { width: "48px", height: "48px", fontSize: "18px", marginLeft: 0 }, children: [
                c.name.charAt(0),
                /* @__PURE__ */ t.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
              ] }),
              /* @__PURE__ */ t.jsxs("div", { className: "user-info name-meta", style: { gap: "4px" }, children: [
                /* @__PURE__ */ t.jsx("strong", { style: { fontSize: "16px" }, children: c.name }),
                /* @__PURE__ */ t.jsxs("span", { style: { fontSize: "14px" }, children: [
                  "@",
                  c.id
                ] }),
                /* @__PURE__ */ t.jsx("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: v ? "이미 연동된 제주그룹 회원" : "연동 가능한 제주그룹 회원" })
              ] })
            ] }),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                className: "add-btn companion-add-btn pill-shape",
                type: "button",
                onClick: () => x(c),
                disabled: v,
                style: { padding: "12px 28px", fontSize: "14px" },
                children: v ? "연동됨" : "추가"
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
                  onClick: () => w(d.id),
                  style: { padding: "10px 24px", fontSize: "14px" },
                  children: "해제"
                }
              )
            ] }, d.id)) })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs("footer", { className: "modal-footer", style: { marginTop: "40px", gap: "16px" }, children: [
          /* @__PURE__ */ t.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: n, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ t.jsx("button", { className: "save-btn pill-shape", type: "button", onClick: h, style: { padding: "20px 0", fontSize: "16px" }, children: "적용" })
        ] })
      ]
    }
  ) });
}, Bs = (e) => {
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
}, Ks = () => {
  const { dispatch: e, state: s } = k(), n = s.itinerary ?? [], a = n.length > 0 ? n : [
    {
      activities: [],
      companions: [],
      date: "일정 미정",
      googleMapUrl: "",
      id: "empty-itinerary",
      time: "시간 미정",
      title: "여행 일정 준비 중"
    }
  ], o = s.linkedCompanions ?? [], r = s.profile, [i, c] = p.useState(!1), [y, u] = p.useState(null), b = p.useRef({}), [x, w] = p.useState({});
  p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [i, n, o]), p.useLayoutEffect(() => {
    const m = a.reduce((v, g) => {
      var h;
      return v[g.id] = ((h = b.current[g.id]) == null ? void 0 : h.scrollHeight) ?? 0, v;
    }, {});
    w((v) => {
      const g = Object.keys(v), h = Object.keys(m);
      return g.length === h.length && h.every((d) => v[d] === m[d]) ? v : m;
    });
  }, [a, i]);
  const S = (m) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: m }), ms(
      {
        id: r.id,
        profile: {
          email: r.email,
          id: r.id,
          name: r.name
        }
      },
      {
        linkedCompanions: m
      }
    ), u(null);
  };
  return /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ t.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ t.jsxs("div", { className: `itinerary-timeline-wrap ${i ? "is-expanded" : ""}`, children: [
      a.map((m, v) => {
        const g = v < 2, h = g || i, d = x[m.id] ?? 720, E = m.id === "empty-itinerary";
        return /* @__PURE__ */ t.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (j) => {
              b.current[m.id] = j;
            },
            "aria-hidden": !h,
            style: g ? void 0 : {
              overflow: "hidden",
              maxHeight: h ? `${d}px` : "0px",
              opacity: h ? 1 : 0,
              transform: h ? "translateY(0)" : "translateY(-18px)",
              marginBottom: h ? "40px" : "0px",
              pointerEvents: h ? "auto" : "none",
              transition: "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)"
            },
            children: [
              /* @__PURE__ */ t.jsxs("div", { className: "day-side-info", children: [
                /* @__PURE__ */ t.jsx("span", { className: "day-date", children: m.date }),
                /* @__PURE__ */ t.jsx("span", { className: "day-time", children: m.time }),
                /* @__PURE__ */ t.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
                  /* @__PURE__ */ t.jsxs("div", { className: "comp-head", children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "users", className: "lucide-users" }),
                    /* @__PURE__ */ t.jsx("span", { className: "small-label", children: "함께하는 동행자" })
                  ] }),
                  /* @__PURE__ */ t.jsxs("div", { className: `avatar-stack ${m.companions.length === 0 ? "is-empty" : ""}`, children: [
                    m.companions.map((j) => /* @__PURE__ */ t.jsxs(
                      "div",
                      {
                        className: `companion-avatar soft-radius ${j.isMember ? "is-linked" : ""}`,
                        title: j.name + (j.isMember ? " (연동됨)" : ""),
                        children: [
                          j.name.charAt(0),
                          j.isMember && /* @__PURE__ */ t.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                        ]
                      },
                      j.id
                    )),
                    /* @__PURE__ */ t.jsxs("span", { className: "comp-count-label", children: [
                      "총 ",
                      m.companions.length,
                      "명"
                    ] })
                  ] }),
                  /* @__PURE__ */ t.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => u(m.id), children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ t.jsxs(C, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ t.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ t.jsx("h3", { className: "iti-title", children: m.title }),
                  m.googleMapUrl ? /* @__PURE__ */ t.jsxs("a", { className: "map-link-btn pill-shape", href: m.googleMapUrl, rel: "noopener noreferrer", target: "_blank", children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 보기"
                  ] }) : /* @__PURE__ */ t.jsxs("span", { className: "map-link-btn pill-shape is-disabled", "aria-disabled": "true", children: [
                    /* @__PURE__ */ t.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 준비 중"
                  ] })
                ] }),
                /* @__PURE__ */ t.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ t.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ t.jsx("ul", { className: `checklist-list ${m.activities.length === 0 ? "is-empty" : ""}`, children: m.activities.map((j) => {
                    const f = Bs(j.status), N = j.status === "used", _ = j.status === "cancelled" || j.status === "missed";
                    return /* @__PURE__ */ t.jsx(
                      "li",
                      {
                        className: `checklist-item ${N ? "checked" : ""} soft-radius`,
                        style: f.style,
                        children: /* @__PURE__ */ t.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ t.jsx(
                            "i",
                            {
                              "data-lucide": f.icon,
                              style: {
                                color: N ? "var(--brand-rent)" : _ ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ t.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ t.jsx("span", { className: "check-text", children: j.label }),
                            /* @__PURE__ */ t.jsx(
                              "span",
                              {
                                style: {
                                  color: _ ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (j.ownerName ?? "본인") + " · " + f.label
                              }
                            )
                          ] })
                        ] })
                      },
                      j.id
                    );
                  }) }),
                  E ? /* @__PURE__ */ t.jsx("p", { className: "checklist-empty-caption", children: "등록된 활동이 아직 없다." }) : null
                ] })
              ] })
            ]
          },
          m.id
        );
      }),
      n.length > 2 && /* @__PURE__ */ t.jsx("div", { className: `timeline-gradient-overlay ${i ? "active" : ""}`, children: /* @__PURE__ */ t.jsx("button", { className: "expand-cta-btn pill-shape", onClick: () => c(!i), children: i ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        "전체 일정 접기 ",
        /* @__PURE__ */ t.jsx("i", { className: "lucide-chevron-up" })
      ] }) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        "남은 ",
        n.length - 2,
        "개의 일정 더 보기 ",
        /* @__PURE__ */ t.jsx("i", { className: "lucide-chevron-down" })
      ] }) }) })
    ] }),
    y && /* @__PURE__ */ t.jsx(
      Ps,
      {
        isOpen: !!y,
        onClose: () => u(null),
        initialCompanions: o,
        onSave: S
      }
    )
  ] });
}, O = (e) => ({
  email: e.email,
  name: e.name,
  phone: e.phone
}), $s = (e) => ({
  email: e.email.trim(),
  name: e.name.trim(),
  phone: e.phone.trim()
}), J = (e) => e.name.trim().length > 0 && e.email.trim().includes("@") && e.phone.trim().length > 0, Us = (e) => `${Z}${e}`, Fs = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, Hs = () => {
  var j;
  const { refreshDashboard: e, state: s } = k(), n = s.profile ?? M, a = (j = s.stats) != null && j.length ? s.stats : U, o = n.passport, [r, i] = p.useState(() => O(n)), [c, y] = p.useState(() => O(n)), [u, b] = p.useState(!1), [x, w] = p.useState(!1), [S, m] = p.useState(null), v = (c.name.trim().charAt(0) || M.name.trim().charAt(0) || "J").toUpperCase();
  p.useEffect(() => {
    u && window.lucide && window.lucide.createIcons();
  }, [u]), p.useEffect(() => {
    const f = O(n);
    u || (i(f), y(f));
  }, [n, u]);
  const g = () => {
    y(r), m(null), b(!0);
  }, h = () => {
    y(r), m(null), b(!1);
  }, d = async () => {
    const f = $s(c);
    if (!J(f)) {
      m("이름, 이메일, 전화번호를 확인해라");
      return;
    }
    w(!0), m(null);
    try {
      const N = await fetch(Us("/api/mypage/profile"), {
        body: JSON.stringify(f),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PUT"
      });
      if (N.status === 401)
        throw new Error("로그인이 만료됐다. 다시 로그인해라");
      if (!N.ok)
        throw new Error("프로필 저장에 실패했다. 잠시 후 다시 시도해라");
      if (!await e())
        throw new Error("저장은 됐지만 최신 정보를 다시 불러오지 못했다");
      b(!1);
    } catch (N) {
      m(N instanceof Error ? N.message : "프로필 저장에 실패했다. 잠시 후 다시 시도해라");
    } finally {
      w(!1);
    }
  }, E = x || !J(c);
  return /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ t.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ t.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ t.jsxs(C, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ t.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ t.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ t.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: g, children: "내 정보 수정" })
          ] }),
          /* @__PURE__ */ t.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", children: "이름" }),
              /* @__PURE__ */ t.jsx("strong", { className: "value", children: r.name })
            ] }),
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", children: "이메일" }),
              /* @__PURE__ */ t.jsx("strong", { className: "value", children: r.email })
            ] }),
            /* @__PURE__ */ t.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ t.jsx("span", { className: "label", children: "휴대전화" }),
              /* @__PURE__ */ t.jsx("strong", { className: "value", children: r.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ t.jsxs(C, { className: "passport-info-box meta-glass-theme", children: [
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
        /* @__PURE__ */ t.jsxs(C, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ t.jsx("div", { className: "box-head", children: /* @__PURE__ */ t.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ t.jsx("div", { className: "benefit-tiles", children: a.slice(0, 2).map((f) => /* @__PURE__ */ t.jsxs("div", { className: `benefit-tile tone-${f.tone} soft-radius`, children: [
            /* @__PURE__ */ t.jsx("span", { className: "benefit-label", children: f.label }),
            /* @__PURE__ */ t.jsx("strong", { className: "benefit-value", style: Fs(f.tone), children: f.value }),
            /* @__PURE__ */ t.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, f.label)) })
        ] })
      ] })
    ] }),
    u ? /* @__PURE__ */ t.jsx("div", { className: "meta-modal-overlay", onClick: h, children: /* @__PURE__ */ t.jsxs(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (f) => f.stopPropagation(),
        style: { padding: "36px" },
        children: [
          /* @__PURE__ */ t.jsx("header", { className: "modal-header", children: /* @__PURE__ */ t.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ t.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ t.jsxs("div", { className: "profile-link-preview soft-radius", children: [
            /* @__PURE__ */ t.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", children: [
              v,
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
                  value: c.name,
                  onChange: (f) => y((N) => ({ ...N, name: f.target.value })),
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
                  value: c.email,
                  onChange: (f) => y((N) => ({ ...N, email: f.target.value })),
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
                  value: c.phone,
                  onChange: (f) => y((N) => ({ ...N, phone: f.target.value })),
                  style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                }
              ) })
            ] })
          ] }),
          S ? /* @__PURE__ */ t.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: S }) : null,
          x ? /* @__PURE__ */ t.jsx("div", { "aria-live": "polite", role: "status", style: { color: "#4b5563", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: "저장 중..." }) : null,
          /* @__PURE__ */ t.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ t.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: h, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: d,
                disabled: E,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ]
      }
    ) }) : null
  ] });
}, qs = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"]
}, Ys = () => typeof document > "u" ? !1 : Array.from(document.querySelectorAll("link[href], script[src]")).some((e) => (e.getAttribute("href") ?? e.getAttribute("src") ?? "").includes("/front-mirror/")), X = (e, s = !1) => {
  const n = e === "qna" ? "qna" : e === "notice" ? "notice" : "faq", [a, o] = qs[n];
  return s ? o : a;
}, Vs = () => {
  const { state: e } = k(), s = e.supportItems ?? [], [n] = p.useState(Ys), [a, o] = p.useState({});
  return /* @__PURE__ */ t.jsxs("section", { className: "meta-section layer-support", children: [
    /* @__PURE__ */ t.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ t.jsx("h2", { className: "section-title", children: "고객지원" }),
      /* @__PURE__ */ t.jsx("p", { className: "section-subtitle", children: "여행 중 궁금한 점을 전문가와 상담하세요." })
    ] }),
    /* @__PURE__ */ t.jsx("div", { className: "support-bento-grid bento-grid", children: s.map((r) => /* @__PURE__ */ t.jsxs("a", { className: `support-item-card bento-item meta-glass-theme soft-radius ${r.id}`, href: r.href, children: [
      /* @__PURE__ */ t.jsx("div", { className: "sp-icon", children: /* @__PURE__ */ t.jsx(
        "img",
        {
          alt: r.label,
          onError: (i) => {
            a[r.id] || n || (o((c) => ({
              ...c,
              [r.id]: !0
            })), i.currentTarget.src = X(r.id, !0));
          },
          src: X(r.id, n || a[r.id] === !0)
        }
      ) }),
      /* @__PURE__ */ t.jsxs("div", { className: "sp-text", children: [
        /* @__PURE__ */ t.jsx("strong", { className: "sp-label", children: r.label }),
        r.count !== null ? /* @__PURE__ */ t.jsxs("span", { className: `sp-badge pill-shape ${r.count > 0 ? "active" : ""}`, children: [
          r.count,
          " 건"
        ] }) : /* @__PURE__ */ t.jsx("span", { className: "sp-link-text", children: "상세 보기" })
      ] })
    ] }, r.id)) })
  ] });
}, Gs = () => /* @__PURE__ */ t.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ t.jsx(Ms, {}),
  /* @__PURE__ */ t.jsx(zs, {}),
  /* @__PURE__ */ t.jsx(Ks, {}),
  /* @__PURE__ */ t.jsx(Hs, {}),
  /* @__PURE__ */ t.jsx(Vs, {})
] }), Js = () => /* @__PURE__ */ t.jsx(Es, { children: /* @__PURE__ */ t.jsx(Gs, {}) });
export {
  Js as M
};
