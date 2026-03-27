import { j as s, a as p } from "./react-vendor-BoSfm_Te.js";
import { A as ue } from "./legacy-core-BoI547nw.js";
const wt = /^[a-zA-Z][a-zA-Z\d+\-.]*:/, he = {
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
}, Ue = [
  { label: "보유 포인트", tone: "point", value: "0P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "0장" },
  { label: "다가오는 여행", tone: "air", value: "0건" }
], Be = [
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
], $e = {
  id: "",
  isMember: !1,
  name: ""
}, At = {
  checked: !1,
  id: "",
  label: "",
  ownerId: "",
  ownerName: "",
  status: "reserved",
  type: "voucher"
}, Et = {
  activities: [],
  companions: [],
  date: "",
  googleMapUrl: "",
  id: "",
  time: "",
  title: ""
}, It = [], Ct = [], V = (e) => {
  const t = d(e);
  if (t)
    return t.startsWith("data:") || t.startsWith("blob:") || t.startsWith("//") || wt.test(t) ? t : `${ue}${t}`;
};
function Fe({
  currentAccountId: e,
  linkedCompanions: t,
  travelEvents: n
}) {
  const a = new Map(t.map((i) => [i.id, i])), o = /* @__PURE__ */ new Set([
    ...e ? [e] : [],
    ...t.map((i) => i.id)
  ]), r = /* @__PURE__ */ new Map();
  for (const i of n) {
    if (o.size > 0 && !o.has(i.ownerId))
      continue;
    const c = r.get(i.dayId), f = {
      checked: i.status === "used",
      id: i.id,
      label: i.activityLabel,
      ownerId: i.ownerId,
      ownerName: i.ownerName,
      status: i.status,
      type: i.type
    };
    if (c) {
      if (c.activities.push(f), i.ownerId !== e && a.has(i.ownerId)) {
        const h = a.get(i.ownerId);
        h && !c.companions.some((v) => v.id === h.id) && c.companions.push({ ...h });
      }
      continue;
    }
    r.set(i.dayId, {
      activities: [f],
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
const X = We(he), xe = te(Ue), Mt = Ve(Be), fe = ye(It), ge = ve(Ct), He = Fe({
  currentAccountId: he.id ?? "",
  linkedCompanions: fe,
  travelEvents: ge
}), Ke = [
  { count: 0, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], Ye = () => ({
  bookings: Ve(Be),
  itinerary: Xe(He),
  linkedCompanions: ye(fe),
  profile: We(he),
  stats: te(Ue),
  supportItems: qe(Ke),
  travelEvents: ve(ge)
}), oe = (e) => {
  const t = Ye(), n = Lt(e);
  if (!Zt(n))
    return t;
  const o = Ot(n, t.profile), r = Wt(n.linkedCompanions, t.linkedCompanions), i = Vt(n.travelEvents, t.travelEvents), c = n.travelEvents !== void 0 ? Fe({
    currentAccountId: o.id ?? t.profile.id ?? "",
    linkedCompanions: r,
    travelEvents: i
  }) : Kt(n.itinerary, t.itinerary);
  return {
    bookings: Ht(n.bookings, t.bookings),
    itinerary: c,
    linkedCompanions: r,
    profile: o,
    stats: $t(n.stats ?? n, t.stats),
    supportItems: Yt(n.supportItems ?? n.support ?? n.inquiries, t.supportItems),
    travelEvents: i
  };
}, Q = (e) => {
  kt(X, e.profile), Rt(xe, e.stats), Tt(Mt, e.bookings), Dt(He, e.itinerary), zt(fe, e.linkedCompanions), _t(Ke, e.supportItems), Pt(ge, e.travelEvents);
};
function We(e) {
  return {
    avatarUrl: e.avatarUrl,
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function te(e) {
  return e.map((t) => ({ ...t }));
}
function Ve(e) {
  return e.map((t) => ({
    ...t,
    tags: [...t.tags]
  }));
}
function ye(e) {
  return e.map((t) => ({ ...t }));
}
function Xe(e) {
  return e.map((t) => ({
    ...t,
    activities: t.activities.map((n) => ({ ...n })),
    companions: t.companions.map((n) => ({ ...n }))
  }));
}
function qe(e) {
  return e.map((t) => ({ ...t }));
}
function ve(e) {
  return e.map((t) => ({ ...t }));
}
const kt = (e, t) => {
  if (e.avatarUrl = t.avatarUrl, e.email = t.email, e.memberships.splice(0, e.memberships.length, ...t.memberships), e.name = t.name, e.phone = t.phone, e.tier = t.tier, e.role = t.role, e.id = t.id, t.passport) {
    e.passport = { ...t.passport };
    return;
  }
  delete e.passport;
}, Rt = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, Tt = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((n) => ({
      ...n,
      tags: [...n.tags]
    }))
  );
}, Dt = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((n) => ({
      ...n,
      activities: n.activities.map((a) => ({ ...a })),
      companions: n.companions.map((a) => ({ ...a }))
    }))
  );
}, zt = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, _t = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, Pt = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, Lt = (e) => {
  const t = {}, n = (a) => {
    T(a) && Object.assign(t, a);
  };
  return n(e), T(e) && (n(e.user), n(e.member), n(e.profile), n(e.data), n(e.session)), t;
}, Ot = (e, t) => {
  const n = Ut(e.memberships, e.tier ?? e.role), a = Bt(e.passport), o = d(e.tier) ?? n[0] ?? d(e.role), r = d(e.id) ?? d(e.memberId) ?? d(e.userId), i = d(e.name) ?? d(e.displayName) ?? d(e.fullName) ?? d(e.nickname) ?? d(e.id) ?? d(e.memberId) ?? d(e.userId) ?? t.name;
  return {
    avatarUrl: V(e.avatarUrl),
    email: d(e.email) ?? qt(e, r, i) ?? t.email,
    id: r ?? t.id,
    memberships: n,
    name: i,
    passport: a,
    phone: d(e.phone) ?? d(e.mobile) ?? "미등록",
    role: d(e.role),
    tier: o
  };
}, Ut = (e, t) => {
  const n = Array.isArray(e) ? e.map((o) => d(o)).filter((o) => !!o) : [];
  if (n.length > 0)
    return n;
  const a = d(t);
  return a ? [a] : [];
}, Bt = (e) => {
  const t = T(e) ? e : null;
  if (!t)
    return;
  const n = {
    expiryDate: d(t == null ? void 0 : t.expiryDate) ?? "",
    issuingCountry: d(t == null ? void 0 : t.issuingCountry) ?? "",
    number: d(t == null ? void 0 : t.number) ?? ""
  };
  if (!(!n.expiryDate && !n.issuingCountry && !n.number))
    return n;
}, $t = (e, t) => Array.isArray(e) && e.length > 0 ? t.map((n, a) => Ft(e[a], n, !0)) : Array.isArray(e) && e.length === 0 ? te(t) : T(e) ? Xt(e, t) : te(t), Ft = (e, t, n = !1) => {
  const a = T(e) ? e : {}, o = ls(a.tone) ? a.tone : t.tone, r = d(a.label) ?? t.label, i = a.value ?? t.value;
  return {
    label: r,
    tone: o,
    value: de(i, t)
  };
}, de = (e, t) => {
  const n = d(e);
  if (!n)
    return t.value;
  if (!/^\d+(?:\.\d+)?$/.test(n))
    return n;
  const a = Number(n);
  if (!Number.isFinite(a))
    return n;
  const o = a.toLocaleString("ko-KR");
  switch (t.tone) {
    case "coupon":
      return `${o}장`;
    case "point":
      return `${o}P`;
    case "air":
      return `${o}건`;
    default:
      return n;
  }
}, Ht = (e, t) => Array.isArray(e) ? e.length === 0 ? [] : e.map((n, a) => Qt(n, t[a % t.length] ?? t[0], !0)) : [], Kt = (e, t) => !Array.isArray(e) || e.length === 0 ? Xe(t) : e.map(
  (n, a) => Jt(
    n,
    t.length > 0 ? t[a % t.length] ?? t[0] : Et
  )
), Yt = (e, t) => !Array.isArray(e) || e.length === 0 ? qe(t) : e.map((n, a) => ss(n, t[a % t.length] ?? t[0])), Wt = (e, t) => !Array.isArray(e) || e.length === 0 ? ye(t) : e.map(
  (n, a) => as(
    n,
    t.length > 0 ? t[a % t.length] ?? t[0] : $e
  )
), Ge = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => rs(t)).filter((t) => t !== null), Vt = (e, t) => {
  const n = Ge(e);
  return n.length > 0 ? n : ve(t);
}, Xt = (e, t) => t.map((n) => {
  const a = os(e, is(n.tone));
  return a === void 0 ? { ...n } : {
    ...n,
    value: de(a, n)
  };
}), qt = (e, t, n) => {
  const a = t ?? d(e.memberId) ?? d(e.userId) ?? d(e.username) ?? d(e.loginId) ?? Gt(n);
  if (a)
    return `${a}@jejugroup.example`;
}, Gt = (e) => {
  const n = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return n.length > 0 ? n : void 0;
}, Zt = (e) => [
  "avatarUrl",
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
].some((n) => n in e), Qt = (e, t, n = !1) => {
  const a = T(e) ? e : {}, o = Array.isArray(a.tags) ? a.tags.map((i) => d(i)).filter((i) => !!i) : [], r = be(a.type) ? a.type : t.type;
  return {
    amount: d(a.amount) ?? (n ? "" : t.amount),
    date: d(a.date) ?? (n ? "" : t.date),
    duration: d(a.duration) ?? (n ? void 0 : t.duration),
    id: d(a.id) ?? (n ? "" : t.id),
    paymentMethod: d(a.paymentMethod) ?? (n ? void 0 : t.paymentMethod),
    status: d(a.status) ?? (n ? "" : t.status),
    tags: o.length > 0 ? o : n ? [] : [...t.tags],
    title: d(a.title) ?? (n ? "" : t.title),
    type: r,
    voucherUrl: d(a.voucherUrl) ?? (n ? void 0 : t.voucherUrl)
  };
}, Jt = (e, t) => {
  const n = T(e) ? e : {}, a = Array.isArray(n.activities) ? n.activities.map(
    (r, i) => es(
      r,
      t.activities.length > 0 ? t.activities[i % t.activities.length] ?? t.activities[0] : At
    )
  ) : t.activities.map((r) => ({ ...r })), o = Array.isArray(n.companions) ? n.companions.map(
    (r, i) => ts(
      r,
      t.companions.length > 0 ? t.companions[i % t.companions.length] ?? t.companions[0] : $e
    )
  ) : t.companions.map((r) => ({ ...r }));
  return {
    activities: a,
    companions: o,
    date: d(n.date) ?? t.date,
    googleMapUrl: d(n.googleMapUrl) ?? t.googleMapUrl,
    id: d(n.id) ?? t.id,
    time: d(n.time) ?? t.time,
    title: d(n.title) ?? t.title
  };
}, es = (e, t) => {
  const n = T(e) ? e : {};
  return {
    checked: typeof n.checked == "boolean" ? n.checked : pe(n.status) ? n.status === "used" : t.checked,
    id: d(n.id) ?? t.id,
    label: d(n.label) ?? t.label,
    ownerId: d(n.ownerId) ?? t.ownerId,
    ownerName: d(n.ownerName) ?? t.ownerName,
    status: pe(n.status) ? n.status : t.status,
    type: be(n.type) ? n.type : t.type
  };
}, ts = (e, t) => {
  const n = T(e) ? e : {};
  return {
    id: d(n.id) ?? t.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : t.isMember,
    name: d(n.name) ?? t.name
  };
}, ss = (e, t) => {
  const n = T(e) ? e : {};
  return {
    count: ns(n.count, t.count),
    href: d(n.href) ?? t.href,
    id: d(n.id) ?? t.id,
    label: d(n.label) ?? t.label
  };
}, ns = (e, t) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const n = d(e);
  if (!n)
    return t;
  const a = Number(n);
  return Number.isFinite(a) ? a : t;
}, as = (e, t) => {
  const n = T(e) ? e : {};
  return {
    id: d(n.id) ?? t.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : t.isMember,
    name: d(n.name) ?? t.name
  };
}, rs = (e) => {
  const t = T(e) ? e : null;
  if (!t)
    return null;
  const n = d(t.id), a = d(t.dayId), o = d(t.title), r = d(t.date), i = d(t.time), c = d(t.activityLabel), f = d(t.ownerId), h = d(t.ownerName), v = d(t.googleMapUrl);
  return !n || !a || !o || !r || !i || !c || !f || !h || !v ? null : {
    activityLabel: c,
    date: r,
    dayId: a,
    googleMapUrl: v,
    id: n,
    ownerId: f,
    ownerName: h,
    status: pe(t.status) ? t.status : "reserved",
    time: i,
    title: o,
    type: be(t.type) ? t.type : "voucher"
  };
}, is = (e) => {
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
}, os = (e, t) => {
  for (const n of t)
    if (n in e) {
      const a = e[n];
      if (a != null)
        return Array.isArray(a) ? a.length : a;
    }
}, T = (e) => e !== null && typeof e == "object" && !Array.isArray(e), d = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, be = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", pe = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", ls = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", F = ({ children: e, className: t = "" }) => {
  const n = ["bento-box", "soft-radius", t].filter(Boolean).join(" ");
  return /* @__PURE__ */ s.jsx("div", { className: n, children: e });
}, me = "jeju:mypage-dashboard-mock-updated", Ze = "jeju:mypage-dashboard:", cs = ["id", "memberId", "userId", "email", "loginId", "username"], Qe = ["user", "member", "profile", "data", "session"], D = (e) => e !== null && typeof e == "object" && !Array.isArray(e), ds = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, ps = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), ms = (e) => {
  const t = [];
  if (!D(e))
    return t;
  t.push(e);
  for (const n of Qe) {
    const a = e[n];
    D(a) && t.push(a);
  }
  return t;
}, Je = (e) => {
  const t = ms(e);
  for (const n of t)
    for (const a of cs) {
      const o = ds(n[a]);
      if (!o)
        continue;
      const r = ps(o);
      if (r)
        return r;
    }
  return null;
}, et = (e) => `${Ze}${e}`, us = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return D(t) ? t : null;
  } catch {
    return null;
  }
}, hs = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(me, {
      detail: { accountKey: e }
    })
  );
}, tt = (e) => {
  const t = Je(e);
  return t ? st(t) : null;
}, st = (e) => {
  try {
    return us(localStorage.getItem(et(e)));
  } catch {
    return null;
  }
}, se = (e, t) => {
  const n = D(e) ? e : {}, a = D(t) ? t : {};
  if (Object.keys(n).length === 0 && Object.keys(a).length === 0)
    return null;
  const o = {
    ...n,
    ...a
  };
  for (const r of Qe) {
    const i = n[r], c = a[r];
    (D(i) || D(c)) && (o[r] = {
      ...D(i) ? i : {},
      ...D(c) ? c : {}
    });
  }
  return o;
}, xs = (e, t) => {
  const n = Je(e);
  if (!n)
    return !1;
  try {
    return localStorage.setItem(et(n), JSON.stringify(t)), hs(n), !0;
  } catch {
    return !1;
  }
}, fs = (e, t) => {
  const n = se(tt(e), t);
  return n ? xs(e, n) : !1;
}, gs = "userSession", De = "jeju:session-updated", ys = "/api/auth/session", vs = "/api/mypage/dashboard", bs = () => {
  const e = Ye();
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
}, js = (e, t) => {
  switch (t.type) {
    case "HYDRATE_DASHBOARD":
      return {
        ...e,
        bookings: t.payload.bookings.map((n) => ({
          ...n,
          tags: [...n.tags]
        })),
        itinerary: t.payload.itinerary.map((n) => ({
          ...n,
          activities: n.activities.map((a) => ({ ...a })),
          companions: n.companions.map((a) => ({ ...a }))
        })),
        linkedCompanions: t.payload.linkedCompanions.map((n) => ({ ...n })),
        profile: {
          ...t.payload.profile,
          memberships: [...t.payload.profile.memberships],
          passport: t.payload.profile.passport ? { ...t.payload.profile.passport } : void 0
        },
        stats: t.payload.stats.map((n) => ({ ...n })),
        supportItems: t.payload.supportItems.map((n) => ({ ...n })),
        travelEvents: t.payload.travelEvents.map((n) => ({ ...n }))
      };
    case "PATCH_PROFILE":
      return {
        ...e,
        profile: {
          ...e.profile,
          ...t.payload,
          memberships: t.payload.memberships ? [...t.payload.memberships] : [...e.profile.memberships],
          passport: t.payload.passport === void 0 ? e.profile.passport ? { ...e.profile.passport } : void 0 : t.payload.passport ? { ...t.payload.passport } : void 0
        }
      };
    case "SET_LINKED_COMPANIONS":
      return {
        ...e,
        linkedCompanions: t.payload.map((n) => ({ ...n }))
      };
    case "SET_FILTER":
      return { ...e, filter: t.payload };
    default:
      return e;
  }
}, nt = p.createContext(null), at = (e) => `${ue}${e}`, Ns = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Ss = async () => {
  try {
    const e = await fetch(at(ys), {
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
}, ws = async () => {
  try {
    const e = await fetch(at(vs), {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    if (e.status === 401 || !e.ok)
      return null;
    const t = await e.json();
    return !Ns(t) || t.success !== !0 || !("dashboard" in t) ? null : t.dashboard ?? null;
  } catch {
    return null;
  }
}, As = async () => await Ss(), Es = async (e) => {
  if (!e)
    return null;
  const t = await ws();
  return t ? se(e, t) : e;
}, ze = async () => {
  const e = await As();
  if (!e)
    return null;
  const t = await Es(e);
  return Ms(t);
}, Is = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), Cs = (e, t) => ({
  ...e,
  ...t,
  memberships: t.memberships ? [...t.memberships] : [...e.memberships],
  passport: t.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : t.passport ? { ...t.passport } : void 0
}), Ms = (e) => {
  const t = se(e, tt(e)), n = oe(t);
  if (n.linkedCompanions.length === 0)
    return oe(t);
  const a = [
    ...n.travelEvents,
    ...n.linkedCompanions.flatMap((o) => {
      const r = st(o.id);
      return !r || !("travelEvents" in r) ? [] : Ge(r.travelEvents).map((i) => ({
        ...i,
        ownerId: i.ownerId || o.id,
        ownerName: i.ownerName || o.name
      }));
    })
  ];
  return oe(
    se(t, {
      linkedCompanions: n.linkedCompanions,
      travelEvents: a
    })
  );
}, ks = ({ children: e }) => {
  const [t, n] = p.useReducer(js, void 0, bs), [a, o] = p.useState(!1), [r, i] = p.useState(!1), c = (g) => {
    Q(g), n({ type: "HYDRATE_DASHBOARD", payload: g });
  }, f = (g) => {
    g.type === "HYDRATE_DASHBOARD" ? Q(g.payload) : g.type === "PATCH_PROFILE" && Q({
      bookings: t.bookings,
      itinerary: t.itinerary,
      linkedCompanions: t.linkedCompanions,
      profile: Cs(t.profile, g.payload),
      stats: t.stats,
      supportItems: t.supportItems,
      travelEvents: t.travelEvents
    }), n(g);
  }, h = async () => {
    const g = await ze();
    return g ? (c(g), !0) : !1;
  };
  p.useEffect(() => {
    Q(Is(t));
  }, [t.bookings, t.itinerary, t.linkedCompanions, t.profile, t.stats, t.supportItems, t.travelEvents]), p.useEffect(() => {
    let g = !0, S = !1;
    const A = async () => {
      const m = await ze();
      if (!m) {
        if (!g)
          return;
        i(!1), o(!0);
        return;
      }
      g && (i(!0), o(!0), c(m));
    }, x = () => {
      S || (S = !0, A().finally(() => {
        S = !1;
      }));
    };
    x();
    const j = (m) => {
      var k;
      if (m.key === gs) {
        x();
        return;
      }
      (k = m.key) != null && k.startsWith(Ze) && x();
    }, b = () => {
      x();
    }, y = () => {
      x();
    };
    return window.addEventListener("storage", j), window.addEventListener(De, b), window.addEventListener(me, y), () => {
      g = !1, window.removeEventListener("storage", j), window.removeEventListener(De, b), window.removeEventListener(me, y);
    };
  }, [n]);
  const v = p.useMemo(
    () => ({
      dispatch: f,
      refreshDashboard: h,
      state: t
    }),
    [f, h, t]
  );
  return !a || !r ? /* @__PURE__ */ s.jsxs("div", { className: "mypage-auth-empty-state soft-radius", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ s.jsx("div", { className: "mypage-auth-empty-icon", "aria-hidden": "true", children: /* @__PURE__ */ s.jsxs("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true", children: [
      /* @__PURE__ */ s.jsx(
        "path",
        {
          d: "M12 3.75 21 19.5a1.2 1.2 0 0 1-1.04 1.8H4.04A1.2 1.2 0 0 1 3 19.5L12 3.75Z",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ s.jsx("path", { d: "M12 9v5.25", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }),
      /* @__PURE__ */ s.jsx("circle", { cx: "12", cy: "17.25", r: "1.1", fill: "currentColor" })
    ] }) }),
    /* @__PURE__ */ s.jsx("p", { className: "mypage-auth-empty-text", children: "로그인을 해주세요." })
  ] }) : /* @__PURE__ */ s.jsx(nt.Provider, { value: v, children: e });
}, q = () => {
  const e = p.useContext(nt);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, rt = (e) => {
  const t = (e == null ? void 0 : e.trim().toLowerCase()) ?? "";
  return t.includes("diamond") || t.includes("다이아") ? "diamond" : t.includes("platinum") || t.includes("플래티넘") ? "platinum" : t.includes("silver") || t.includes("실버") ? "silver" : t.includes("gold") || t.includes("골드") ? "gold" : null;
}, Rs = (e) => rt(e) ?? "neutral", Ts = (e) => {
  switch (rt(e)) {
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
}, _e = (e) => {
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
}, le = (e) => {
  const t = document.querySelector(e);
  if (!t)
    return;
  const n = t.querySelector(".section-title") ?? t, a = document.querySelector("#jeju-page-shell-header .header") ?? document.querySelector(".header"), o = (a == null ? void 0 : a.getBoundingClientRect().height) ?? 72, r = window.scrollY + n.getBoundingClientRect().top - o - 24;
  window.scrollTo({
    top: Math.max(0, r),
    behavior: "smooth"
  });
}, Ds = () => {
  var f, h;
  const { state: e } = q(), t = e.profile ?? X, n = (f = e.stats) != null && f.length ? e.stats : xe, a = ((h = t.memberships) == null ? void 0 : h[0]) ?? X.memberships[0], o = t.tier ?? a, r = Rs(o), i = Ts(o), c = V(t.avatarUrl) ?? `https://api.dicebear.com/7.x/notionists/svg?seed=${t.name}&backgroundColor=f8f9fa`;
  return p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []), /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ s.jsx(F, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ s.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ s.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ s.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ s.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: c
          }
        ),
        /* @__PURE__ */ s.jsx("div", { className: `membership-grade-chip soft-radius ${r}`, children: /* @__PURE__ */ s.jsx("span", { children: i }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ s.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ s.jsx("strong", { className: "highlight", children: t.name }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "profile-welcome-msg", children: "제주에서 보냈던 소중한 시간들을 다시 이어보세요." }),
        /* @__PURE__ */ s.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ s.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => le(".layer-full-management"), children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => le(".layer-itinerary"), children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => le(".layer-account-benefits"), children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ s.jsx("div", { className: "summary-stats-column", children: n.map((v) => /* @__PURE__ */ s.jsxs(F, { className: `stat-card meta-glass-theme tone-${v.tone}`, children: [
      /* @__PURE__ */ s.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ s.jsx("i", { "data-lucide": _e(v.tone), className: `lucide-${_e(v.tone)}` }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ s.jsx("span", { className: "stat-label", children: v.label }),
        /* @__PURE__ */ s.jsx("strong", { className: "stat-value", children: v.value })
      ] })
    ] }, v.label)) })
  ] });
}, zs = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, _s = ({ tone: e, value: t }) => {
  const n = zs[e];
  return /* @__PURE__ */ s.jsx("span", { className: `pill-shape ${n}`.trim(), children: t });
}, Ps = ["all", "air", "stay", "rent", "voucher"], Ls = () => {
  const { dispatch: e, state: t } = q(), n = t.bookings ?? [];
  p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [n, t.filter]);
  const a = p.useMemo(() => t.filter === "all" ? n : n.filter((r) => r.type === t.filter), [n, t.filter]), o = p.useCallback(
    (r) => {
      e({ type: "SET_FILTER", payload: r });
    },
    [e]
  );
  return /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-full-management", children: [
    /* @__PURE__ */ s.jsxs("header", { className: "section-header flex-header", children: [
      /* @__PURE__ */ s.jsxs("div", { className: "title-group", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "section-title", children: "나의 예약 현황" }),
        /* @__PURE__ */ s.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 및 바우처를 한눈에 관리하세요." })
      ] }),
      /* @__PURE__ */ s.jsx("div", { className: "booking-filters flex-gap", children: Ps.map((r) => /* @__PURE__ */ s.jsx(
        "button",
        {
          className: `filter-chip pill-shape ${t.filter === r ? "active" : ""}`,
          onClick: () => o(r),
          type: "button",
          children: r === "all" ? "전체" : r === "air" ? "항공" : r === "stay" ? "숙박" : r === "rent" ? "렌터카" : "바우처"
        },
        r
      )) })
    ] }),
    /* @__PURE__ */ s.jsx("ul", { className: "full-width-trip-list", children: a.length > 0 ? a.map((r) => /* @__PURE__ */ s.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": r.type, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ s.jsx(_s, { tone: r.type, value: r.status }),
          /* @__PURE__ */ s.jsx("div", { className: "trip-tags", children: r.tags.map((i) => /* @__PURE__ */ s.jsx("span", { className: "meta-tag pill-shape", children: i }, i)) })
        ] }),
        /* @__PURE__ */ s.jsx("h3", { className: "trip-title", children: r.title }),
        /* @__PURE__ */ s.jsxs("div", { className: "trip-meta-grid", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "calendar", className: "lucide-calendar" }),
            /* @__PURE__ */ s.jsx("span", { children: r.date }),
            r.duration ? /* @__PURE__ */ s.jsxs("strong", { className: "duration-label", children: [
              "(",
              r.duration,
              ")"
            ] }) : null
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "wallet", className: "lucide-wallet" }),
            /* @__PURE__ */ s.jsx("strong", { children: r.amount }),
            r.paymentMethod ? /* @__PURE__ */ s.jsxs("span", { className: "method-label", children: [
              " / ",
              r.paymentMethod
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "trip-inline-actions", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "action-group", children: [
          r.voucherUrl ? /* @__PURE__ */ s.jsxs("button", { className: "inline-btn primary pill-shape", type: "button", children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "download", className: "lucide-download" }),
            "e-티켓 / 바우처"
          ] }) : /* @__PURE__ */ s.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "결제 진행하기" }),
          /* @__PURE__ */ s.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "예약 변경" })
        ] }),
        /* @__PURE__ */ s.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "예약 취소" })
      ] })
    ] }, r.id)) : /* @__PURE__ */ s.jsxs("div", { className: "empty-state-placeholder soft-radius", children: [
      /* @__PURE__ */ s.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
      /* @__PURE__ */ s.jsx("p", { children: "선택하신 카테고리에 해당하는 예약 내역이 없습니다." })
    ] }) })
  ] });
}, Os = {
  park_jy: { id: "park_jy", name: "박준영" },
  lee_je: { id: "lee_je", name: "이지은" },
  choi_sj: { id: "choi_sj", name: "최수진" }
}, Us = (e) => e.trim().toLowerCase(), Bs = async (e) => {
  await new Promise((n) => setTimeout(n, 400));
  const t = Os[e];
  return t ? {
    ...t,
    isMember: !0
  } : null;
}, $s = ({
  initialCompanions: e = [],
  lookupMemberById: t = Bs
} = {}) => {
  const [n, a] = p.useState(e), [o, r] = p.useState(""), [i, c] = p.useState(null), [f, h] = p.useState(!1), [v, g] = p.useState(null), S = p.useCallback(async (b) => {
    const y = Us(b);
    if (!y) {
      g({ message: "검색할 제주그룹 회원 ID를 입력해라" }), c(null);
      return;
    }
    if (!/^[a-z0-9._-]{2,30}$/i.test(y)) {
      g({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), c(null);
      return;
    }
    h(!0), g(null), c(null);
    try {
      const m = await t(y);
      m ? c(m) : g({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" });
    } catch {
      g({ message: "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라" });
    } finally {
      h(!1);
    }
  }, [t]), A = p.useCallback(() => {
    r(""), c(null), g(null);
  }, []), x = p.useCallback((b) => {
    a((y) => y.some((m) => m.id === b.id) ? y : [...y, b]), A();
  }, [A]), j = p.useCallback((b) => {
    a((y) => y.filter((m) => m.id !== b));
  }, []);
  return {
    companions: n,
    searchQuery: o,
    setSearchQuery: r,
    searchResult: i,
    isSearching: f,
    errorObj: v,
    handleSearch: S,
    addCompanion: x,
    removeCompanion: j,
    clearSearch: A
  };
}, Fs = ({
  initialCompanions: e,
  isOpen: t,
  onClose: n,
  onSave: a
}) => {
  const {
    companions: o,
    searchQuery: r,
    setSearchQuery: i,
    searchResult: c,
    isSearching: f,
    errorObj: h,
    handleSearch: v,
    addCompanion: g,
    removeCompanion: S,
    clearSearch: A
  } = $s({ initialCompanions: e }), x = p.useRef(null), j = c ? o.some((m) => m.id === c.id) : !1;
  if (p.useEffect(() => {
    if (t) {
      A();
      const m = window.setTimeout(() => {
        var k;
        return (k = x.current) == null ? void 0 : k.focus();
      }, 100);
      return () => window.clearTimeout(m);
    }
  }, [t, A]), p.useEffect(() => {
    const m = (k) => {
      k.key === "Escape" && t && n();
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [t, n]), p.useEffect(() => {
    t && window.lucide && window.lucide.createIcons();
  }, [t, c, o, h]), !t) return null;
  const b = (m) => {
    m.preventDefault(), v(r);
  }, y = () => {
    a(o), n();
  };
  return /* @__PURE__ */ s.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: n, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (m) => m.stopPropagation(),
      style: { padding: "40px" },
      children: [
        /* @__PURE__ */ s.jsx("header", { className: "modal-header", children: /* @__PURE__ */ s.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ s.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "companion-modal-body", children: [
          /* @__PURE__ */ s.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: b, style: { gap: "16px", marginBottom: "32px" }, children: [
            /* @__PURE__ */ s.jsx(
              "input",
              {
                ref: x,
                className: "id-input companion-search-input",
                type: "text",
                placeholder: "제주그룹 회원 ID를 입력해라",
                value: r,
                onChange: (m) => i(m.target.value),
                style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px" },
                autoComplete: "off"
              }
            ),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                type: "submit",
                className: "add-btn companion-search-submit pill-shape",
                disabled: f,
                style: { padding: "0 40px", fontSize: "16px" },
                children: f ? "검색 중..." : "검색"
              }
            )
          ] }),
          h && /* @__PURE__ */ s.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            h.message
          ] }),
          c && /* @__PURE__ */ s.jsxs("div", { className: "search-result-wrap list-item", style: { padding: "20px 24px", marginBottom: "32px", borderRadius: "16px" }, children: [
            /* @__PURE__ */ s.jsxs("div", { className: "companion-result-item item-info", children: [
              /* @__PURE__ */ s.jsxs("div", { className: "companion-avatar soft-radius is-linked", style: { width: "48px", height: "48px", fontSize: "18px", marginLeft: 0 }, children: [
                c.name.charAt(0),
                /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
              ] }),
              /* @__PURE__ */ s.jsxs("div", { className: "user-info name-meta", style: { gap: "4px" }, children: [
                /* @__PURE__ */ s.jsx("strong", { style: { fontSize: "16px" }, children: c.name }),
                /* @__PURE__ */ s.jsxs("span", { style: { fontSize: "14px" }, children: [
                  "@",
                  c.id
                ] }),
                /* @__PURE__ */ s.jsx("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: j ? "이미 연동된 제주그룹 회원" : "연동 가능한 제주그룹 회원" })
              ] })
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                className: "add-btn companion-add-btn pill-shape",
                type: "button",
                onClick: () => g(c),
                disabled: j,
                style: { padding: "12px 28px", fontSize: "14px" },
                children: j ? "연동됨" : "추가"
              }
            )
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "linked-companions-section", children: [
            /* @__PURE__ */ s.jsxs("h4", { style: { fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }, children: [
              "연동된 동행자 (",
              o.length,
              "명)"
            ] }),
            o.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 추가해라." }) : /* @__PURE__ */ s.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { gap: "16px", maxHeight: "280px" }, children: o.map((m) => /* @__PURE__ */ s.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ s.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ s.jsxs("div", { className: `companion-avatar soft-radius ${m.isMember ? "is-linked" : ""}`, style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }, children: [
                  m.name.charAt(0),
                  m.isMember && /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator", style: { width: "14px", height: "14px" } })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ s.jsx("strong", { style: { fontSize: "16px" }, children: m.name }),
                  /* @__PURE__ */ s.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    m.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ s.jsx(
                "button",
                {
                  className: "remove-btn companion-remove-btn",
                  onClick: () => S(m.id),
                  style: { padding: "10px 24px", fontSize: "14px" },
                  children: "해제"
                }
              )
            ] }, m.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("footer", { className: "modal-footer", style: { marginTop: "40px", gap: "16px" }, children: [
          /* @__PURE__ */ s.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: n, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ s.jsx("button", { className: "save-btn pill-shape", type: "button", onClick: y, style: { padding: "20px 0", fontSize: "16px" }, children: "적용" })
        ] })
      ]
    }
  ) });
}, Hs = (e) => {
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
  const { dispatch: e, state: t } = q(), n = t.itinerary ?? [], a = n.length > 0 ? n : [
    {
      activities: [],
      companions: [],
      date: "일정 미정",
      googleMapUrl: "",
      id: "empty-itinerary",
      time: "시간 미정",
      title: "여행 일정 준비 중"
    }
  ], o = t.linkedCompanions ?? [], r = t.profile, [i, c] = p.useState(!1), [f, h] = p.useState(null), v = p.useRef({}), [g, S] = p.useState({});
  p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [i, n, o]), p.useLayoutEffect(() => {
    const x = a.reduce((j, b) => {
      var y;
      return j[b.id] = ((y = v.current[b.id]) == null ? void 0 : y.scrollHeight) ?? 0, j;
    }, {});
    S((j) => {
      const b = Object.keys(j), y = Object.keys(x);
      return b.length === y.length && y.every((m) => j[m] === x[m]) ? j : x;
    });
  }, [a, i]);
  const A = (x) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: x }), fs(
      {
        id: r.id,
        profile: {
          email: r.email,
          id: r.id,
          name: r.name
        }
      },
      {
        linkedCompanions: x
      }
    ), h(null);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ s.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ s.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: `itinerary-timeline-wrap ${i ? "is-expanded" : ""}`, children: [
      a.map((x, j) => {
        const b = j < 2, y = b || i, m = g[x.id] ?? 720, k = x.id === "empty-itinerary";
        return /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (N) => {
              v.current[x.id] = N;
            },
            "aria-hidden": !y,
            style: b ? void 0 : {
              overflow: "hidden",
              maxHeight: y ? `${m}px` : "0px",
              opacity: y ? 1 : 0,
              transform: y ? "translateY(0)" : "translateY(-18px)",
              marginBottom: y ? "40px" : "0px",
              pointerEvents: y ? "auto" : "none",
              transition: "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)"
            },
            children: [
              /* @__PURE__ */ s.jsxs("div", { className: "day-side-info", children: [
                /* @__PURE__ */ s.jsx("span", { className: "day-date", children: x.date }),
                /* @__PURE__ */ s.jsx("span", { className: "day-time", children: x.time }),
                /* @__PURE__ */ s.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
                  /* @__PURE__ */ s.jsxs("div", { className: "comp-head", children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "users", className: "lucide-users" }),
                    /* @__PURE__ */ s.jsx("span", { className: "small-label", children: "함께하는 동행자" })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { className: `avatar-stack ${x.companions.length === 0 ? "is-empty" : ""}`, children: [
                    x.companions.map((N) => /* @__PURE__ */ s.jsxs(
                      "div",
                      {
                        className: `companion-avatar soft-radius ${N.isMember ? "is-linked" : ""}`,
                        title: N.name + (N.isMember ? " (연동됨)" : ""),
                        children: [
                          N.name.charAt(0),
                          N.isMember && /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                        ]
                      },
                      N.id
                    )),
                    /* @__PURE__ */ s.jsxs("span", { className: "comp-count-label", children: [
                      "총 ",
                      x.companions.length,
                      "명"
                    ] })
                  ] }),
                  /* @__PURE__ */ s.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => h(x.id), children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ s.jsxs(F, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ s.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ s.jsx("h3", { className: "iti-title", children: x.title }),
                  x.googleMapUrl ? /* @__PURE__ */ s.jsxs("a", { className: "map-link-btn pill-shape", href: x.googleMapUrl, rel: "noopener noreferrer", target: "_blank", children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 보기"
                  ] }) : /* @__PURE__ */ s.jsxs("span", { className: "map-link-btn pill-shape is-disabled", "aria-disabled": "true", children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 준비 중"
                  ] })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ s.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ s.jsx("ul", { className: `checklist-list ${x.activities.length === 0 ? "is-empty" : ""}`, children: x.activities.map((N) => {
                    const H = Hs(N.status), O = N.status === "used", C = N.status === "cancelled" || N.status === "missed";
                    return /* @__PURE__ */ s.jsx(
                      "li",
                      {
                        className: `checklist-item ${O ? "checked" : ""} soft-radius`,
                        style: H.style,
                        children: /* @__PURE__ */ s.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ s.jsx(
                            "i",
                            {
                              "data-lucide": H.icon,
                              style: {
                                color: O ? "var(--brand-rent)" : C ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ s.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ s.jsx("span", { className: "check-text", children: N.label }),
                            /* @__PURE__ */ s.jsx(
                              "span",
                              {
                                style: {
                                  color: C ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (N.ownerName ?? "본인") + " · " + H.label
                              }
                            )
                          ] })
                        ] })
                      },
                      N.id
                    );
                  }) }),
                  k ? /* @__PURE__ */ s.jsx("p", { className: "checklist-empty-caption", children: "등록된 활동이 아직 없다." }) : null
                ] })
              ] })
            ]
          },
          x.id
        );
      }),
      n.length > 2 && /* @__PURE__ */ s.jsx("div", { className: `timeline-gradient-overlay ${i ? "active" : ""}`, children: /* @__PURE__ */ s.jsx("button", { className: "expand-cta-btn pill-shape", onClick: () => c(!i), children: i ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        "전체 일정 접기 ",
        /* @__PURE__ */ s.jsx("i", { className: "lucide-chevron-up" })
      ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        "남은 ",
        n.length - 2,
        "개의 일정 더 보기 ",
        /* @__PURE__ */ s.jsx("i", { className: "lucide-chevron-down" })
      ] }) }) })
    ] }),
    f && /* @__PURE__ */ s.jsx(
      Fs,
      {
        isOpen: !!f,
        onClose: () => h(null),
        initialCompanions: o,
        onSave: A
      }
    )
  ] });
}, Ys = 5 * 1024 * 1024, P = 512, Ws = 16, Vs = 6, Xs = {
  alignItems: "center",
  borderRadius: "50%",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  overflow: "hidden",
  position: "absolute"
}, qs = {
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%"
}, Gs = {
  alignItems: "center",
  display: "flex",
  fontSize: "18px",
  fontWeight: 800,
  height: "100%",
  justifyContent: "center",
  width: "100%"
}, ce = (e) => ({
  email: e.email,
  name: e.name,
  phone: e.phone
}), Zs = (e) => ({
  email: e.email.trim(),
  name: e.name.trim(),
  phone: e.phone.trim()
}), Pe = (e) => e.name.trim().length > 0 && e.email.trim().includes("@") && e.phone.trim().length > 0, Le = (e) => `${ue}${e}`, W = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Qs = (e) => new Promise((t, n) => {
  const a = new FileReader();
  a.onload = () => {
    if (typeof a.result == "string") {
      t(a.result);
      return;
    }
    n(new Error("이미지 데이터를 읽지 못했습니다."));
  }, a.onerror = () => n(new Error("이미지 데이터를 읽지 못했습니다.")), a.readAsDataURL(e);
}), J = (e, t, n) => Math.min(n, Math.max(t, e)), L = (e, t, n) => {
  if (!e.naturalWidth || !e.naturalHeight)
    return null;
  const a = Math.max(1, Math.round(t || 320)), o = Math.max(1, Math.round(n || 320)), r = Math.max(0, Math.min(a, o) - Ws * 2), i = r / 2, c = Math.min(a / e.naturalWidth, o / e.naturalHeight), f = e.naturalWidth * c, h = e.naturalHeight * c, v = Math.max(r / Math.max(f, 1), r / Math.max(h, 1), 1);
  return {
    baseHeight: h,
    baseScale: c,
    baseWidth: f,
    circleDiameter: r,
    circleRadius: i,
    maxZoom: Vs,
    minZoom: v,
    stageHeight: o,
    stageWidth: a
  };
}, ee = (e, t) => {
  const n = J(e.zoom, t.minZoom, t.maxZoom), a = t.baseWidth * n, o = t.baseHeight * n, r = Math.max(0, (a - t.circleDiameter) / 2), i = Math.max(0, (o - t.circleDiameter) / 2);
  return {
    panX: J(e.panX, -r, r),
    panY: J(e.panY, -i, i),
    zoom: n
  };
}, Js = (e, t, n, a, o) => {
  const r = L(t, n, a);
  return r ? ee(o, r) : e;
}, en = (e, t, n) => new Promise((a, o) => {
  const r = document.createElement("canvas"), i = window.devicePixelRatio || 1;
  r.width = Math.max(1, Math.round(P * i)), r.height = Math.max(1, Math.round(P * i));
  const c = r.getContext("2d");
  if (!c)
    throw new Error("프로필 사진 편집용 캔버스를 만들지 못했습니다.");
  c.scale(i, i), c.imageSmoothingQuality = "high", c.clearRect(0, 0, P, P);
  const f = P / Math.max(t.circleDiameter, 1), h = t.baseWidth * n.zoom, v = t.baseHeight * n.zoom, g = t.stageWidth / 2 + n.panX - h / 2 - (t.stageWidth / 2 - t.circleRadius), S = t.stageHeight / 2 + n.panY - v / 2 - (t.stageHeight / 2 - t.circleRadius);
  c.save(), c.beginPath(), c.arc(
    P / 2,
    P / 2,
    P / 2,
    0,
    Math.PI * 2
  ), c.closePath(), c.clip(), c.drawImage(
    e,
    g * f,
    S * f,
    h * f,
    v * f
  ), c.restore(), r.toBlob((A) => {
    if (A) {
      a(A);
      return;
    }
    o(new Error("프로필 사진 편집용 이미지를 만들지 못했습니다."));
  }, "image/png");
}), tn = (e) => {
  if (!W(e))
    return null;
  const t = W(e.profile) ? e.profile : null, n = W(e.dashboard) ? e.dashboard : null, a = n && W(n.profile) ? n.profile : null, o = W(e.data) ? e.data : null, r = [
    e.avatarUrl,
    t == null ? void 0 : t.avatarUrl,
    n == null ? void 0 : n.avatarUrl,
    a == null ? void 0 : a.avatarUrl,
    o == null ? void 0 : o.avatarUrl
  ];
  for (const i of r)
    if (typeof i == "string") {
      const c = i.trim();
      if (c.length > 0)
        return c;
    }
  return null;
}, sn = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, nn = () => {
  var Te;
  const { refreshDashboard: e, state: t } = q(), n = t.profile ?? X, a = (Te = t.stats) != null && Te.length ? t.stats : xe, o = n.passport, [r, i] = p.useState(() => ce(n)), [c, f] = p.useState(() => ce(n)), [h, v] = p.useState(!1), [g, S] = p.useState("profile"), [A, x] = p.useState(!1), [j, b] = p.useState(null), [y, m] = p.useState(null), [k, N] = p.useState(!1), [H, O] = p.useState(null), [C, je] = p.useState(null), [z, U] = p.useState({ panX: 0, panY: 0, zoom: 1 }), [E, it] = p.useState({ height: 320, width: 320 }), [_, ne] = p.useState(!1), [ot, ae] = p.useState(!1), Ne = p.useRef(null), I = p.useRef(null), G = p.useRef(null), K = p.useRef(null), re = V(H) ?? n.avatarUrl ?? null, lt = (c.name.trim().charAt(0) || X.name.trim().charAt(0) || "J").toUpperCase();
  p.useEffect(() => {
    h && window.lucide && window.lucide.createIcons();
  }, [re, h, g]), p.useEffect(() => {
    if (!h)
      return;
    const l = document.body.style.overflow, u = document.documentElement.style.overflow;
    return document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", () => {
      document.body.style.overflow = l, document.documentElement.style.overflow = u;
    };
  }, [h]), p.useEffect(() => {
    const l = ce(n);
    h || (i(l), f(l));
  }, [n, h]), p.useEffect(() => {
    if (!h || g !== "avatar" || !G.current)
      return;
    const l = () => {
      var R;
      const M = (R = G.current) == null ? void 0 : R.getBoundingClientRect();
      M && it({
        height: Math.max(1, Math.round(M.height)),
        width: Math.max(1, Math.round(M.width))
      });
    };
    l();
    const u = new ResizeObserver(l);
    return u.observe(G.current), () => u.disconnect();
  }, [C, h, g]), p.useEffect(() => {
    if (!C || !_ || !I.current)
      return;
    const l = L(I.current, E.width, E.height);
    l && U((u) => ee(u, l));
  }, [_, C, E.height, E.width]);
  const ct = () => {
    const l = I.current;
    if (!l)
      return;
    const u = L(l, E.width, E.height);
    if (!u) {
      m("이미지 크기를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    ne(!0), U(ee({ panX: 0, panY: 0, zoom: u.minZoom }, u)), m(null);
  }, ie = () => {
    je(null), U({ panX: 0, panY: 0, zoom: 1 }), ne(!1), m(null), N(!1), ae(!1), K.current = null;
  }, dt = () => {
    f(r), b(null), S("profile"), O((l) => V(l) ?? n.avatarUrl ?? null), ie(), v(!0);
  }, Se = () => {
    f(r), b(null), S("profile"), ie(), v(!1);
  }, we = () => {
    S("avatar"), ie();
  }, Ae = () => {
    var l;
    (l = Ne.current) == null || l.click();
  }, pt = async (l) => {
    var M;
    const u = (M = l.target.files) == null ? void 0 : M[0];
    if (l.target.value = "", !!u) {
      if (!u.type.startsWith("image/")) {
        m("이미지 파일만 선택해 주세요.");
        return;
      }
      if (u.size > Ys) {
        m("프로필 사진은 5MB 이하로 선택해 주세요.");
        return;
      }
      try {
        const R = await Qs(u);
        je(R), U({ panX: 0, panY: 0, zoom: 1 }), ne(!1), m(null);
      } catch {
        m("이미지를 불러오지 못했습니다. 다른 파일로 다시 선택해 주세요.");
      }
    }
  }, mt = (l) => {
    I.current && U(
      (u) => Js(
        u,
        I.current,
        E.width,
        E.height,
        l
      )
    );
  }, ut = (l) => {
    !C || !_ || !I.current || !L(I.current, E.width, E.height) || (l.preventDefault(), l.currentTarget.setPointerCapture(l.pointerId), K.current = {
      pointerId: l.pointerId,
      startClientX: l.clientX,
      startClientY: l.clientY,
      startPanX: z.panX,
      startPanY: z.panY
    }, ae(!0));
  }, ht = (l) => {
    const u = K.current;
    if (!u || u.pointerId !== l.pointerId || !_ || !I.current)
      return;
    const M = {
      panX: u.startPanX + (l.clientX - u.startClientX),
      panY: u.startPanY + (l.clientY - u.startClientY),
      zoom: z.zoom
    };
    mt(M);
  }, Ee = (l) => {
    const u = K.current;
    !u || u.pointerId !== l.pointerId || (K.current = null, ae(!1), l.currentTarget.hasPointerCapture(l.pointerId) && l.currentTarget.releasePointerCapture(l.pointerId));
  }, xt = (l) => {
    !C || !_ || !I.current || (l.preventDefault(), l.stopPropagation(), U((u) => {
      const M = I.current;
      if (!M)
        return u;
      const R = L(M, E.width, E.height);
      if (!R)
        return u;
      const Y = Math.exp(-l.deltaY * 12e-4), Z = J(u.zoom * Y, R.minZoom, R.maxZoom), $ = Z / Math.max(u.zoom, 1e-4);
      return ee(
        {
          panX: u.panX * $,
          panY: u.panY * $,
          zoom: Z
        },
        R
      );
    }));
  }, ft = async () => {
    if (!C || !_ || !I.current) {
      m("먼저 이미지를 선택해 주세요.");
      return;
    }
    const l = L(I.current, E.width, E.height);
    if (!l) {
      m("이미지 정보를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    N(!0), m(null);
    try {
      const u = await en(I.current, l, z), M = new File([u], "avatar.png", { type: "image/png" }), R = new FormData();
      R.append("avatar", M);
      const Y = await fetch(Le("/api/mypage/avatar"), {
        body: R,
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      });
      if (Y.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!Y.ok)
        throw new Error("프로필 사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const Z = await Y.json().catch(() => null), $ = V(tn(Z));
      $ && O($);
      const St = await e();
      !$ && St && O(null), S("profile");
    } catch (u) {
      m(u instanceof Error ? u.message : "프로필 사진 적용에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      N(!1);
    }
  }, gt = async () => {
    const l = Zs(c);
    if (!Pe(l)) {
      b("이름, 이메일, 휴대전화 정보를 확인해 주세요.");
      return;
    }
    x(!0), b(null);
    try {
      const u = await fetch(Le("/api/mypage/profile"), {
        body: JSON.stringify(l),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PUT"
      });
      if (u.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!u.ok)
        throw new Error("프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      if (!await e())
        throw new Error("저장은 완료되었지만 최신 정보를 다시 불러오지 못했습니다.");
      v(!1), S("profile");
    } catch (u) {
      b(u instanceof Error ? u.message : "프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      x(!1);
    }
  }, yt = A || !Pe(c), w = C && _ && I.current ? L(I.current, E.width, E.height) : null, Ie = w ? w.baseWidth * z.zoom : 0, Ce = w ? w.baseHeight * z.zoom : 0, vt = w ? w.stageWidth / 2 + z.panX - Ie / 2 : 0, bt = w ? w.stageHeight / 2 + z.panY - Ce / 2 : 0, Me = (w == null ? void 0 : w.circleDiameter) ?? 0, B = (w == null ? void 0 : w.circleRadius) ?? 0, jt = {
    alignItems: "center",
    aspectRatio: "1 / 1",
    background: "#eef2f7",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: "32px",
    boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.4)",
    display: "flex",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
    touchAction: "none",
    width: "min(100%, 320px)"
  }, Nt = w ? {
    display: "block",
    height: `${Ce}px`,
    left: `${vt}px`,
    maxHeight: "none",
    maxWidth: "none",
    objectFit: "contain",
    pointerEvents: "none",
    position: "absolute",
    top: `${bt}px`,
    userSelect: "none",
    width: `${Ie}px`
  } : {
    display: "block",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    width: "auto"
  }, ke = w ? {
    background: "rgba(20, 24, 31, 0.14)",
    inset: 0,
    maskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, B - 2)}px, black ${Math.max(0, B - 1)}px, black 100%)`,
    WebkitMaskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, B - 2)}px, black ${Math.max(0, B - 1)}px, black 100%)`,
    pointerEvents: "none",
    position: "absolute"
  } : null, Re = w ? {
    border: "2px dashed rgba(255, 255, 255, 0.94)",
    borderRadius: "50%",
    boxShadow: "0 0 0 1px rgba(17, 24, 39, 0.14)",
    height: `${Me}px`,
    left: `calc(50% - ${B}px)`,
    pointerEvents: "none",
    position: "absolute",
    top: `calc(50% - ${B}px)`,
    width: `${Me}px`
  } : null;
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ s.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ s.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ s.jsxs(F, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ s.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ s.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: dt, children: "내 정보 수정" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "label", children: "이름" }),
              /* @__PURE__ */ s.jsx("strong", { className: "value", children: r.name })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "label", children: "이메일" }),
              /* @__PURE__ */ s.jsx("strong", { className: "value", children: r.email })
            ] }),
            /* @__PURE__ */ s.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "label", children: "휴대전화" }),
              /* @__PURE__ */ s.jsx("strong", { className: "value", children: r.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs(F, { className: "passport-info-box meta-glass-theme", children: [
          /* @__PURE__ */ s.jsx("div", { className: "box-head", children: /* @__PURE__ */ s.jsx("h3", { children: "패스포트 정보" }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ s.jsx(
              "div",
              {
                className: "passport-visual soft-radius",
                style: o ? void 0 : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" },
                children: /* @__PURE__ */ s.jsxs("div", { className: "pass-meta", children: [
                  /* @__PURE__ */ s.jsx("span", { className: "pass-num", children: (o == null ? void 0 : o.number) ?? "미등록" }),
                  /* @__PURE__ */ s.jsx("span", { className: "pass-country", children: (o == null ? void 0 : o.issuingCountry) ?? "해외 여행 전에 여권 정보를 등록해 주세요." })
                ] })
              }
            ),
            /* @__PURE__ */ s.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "label", children: o ? "여권 만료일" : "등록 상태" }),
              /* @__PURE__ */ s.jsx("strong", { className: "value", children: (o == null ? void 0 : o.expiryDate) ?? "등록 필요" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs(F, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ s.jsx("div", { className: "box-head", children: /* @__PURE__ */ s.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ s.jsx("div", { className: "benefit-tiles", children: a.slice(0, 2).map((l) => /* @__PURE__ */ s.jsxs("div", { className: `benefit-tile tone-${l.tone} soft-radius`, children: [
            /* @__PURE__ */ s.jsx("span", { className: "benefit-label", children: l.label }),
            /* @__PURE__ */ s.jsx("strong", { className: "benefit-value", style: sn(l.tone), children: l.value }),
            /* @__PURE__ */ s.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, l.label)) })
        ] })
      ] })
    ] }),
    h ? /* @__PURE__ */ s.jsx("div", { className: "meta-modal-overlay", onClick: Se, children: /* @__PURE__ */ s.jsx(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (l) => l.stopPropagation(),
        style: { padding: "36px" },
        children: g === "profile" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("header", { className: "modal-header", children: /* @__PURE__ */ s.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ s.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ s.jsxs(
            "div",
            {
              className: "profile-link-preview soft-radius",
              role: "button",
              tabIndex: 0,
              onClick: we,
              onKeyDown: (l) => {
                (l.key === "Enter" || l.key === " ") && (l.preventDefault(), we());
              },
              children: [
                /* @__PURE__ */ s.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", style: { position: "relative" }, children: [
                  /* @__PURE__ */ s.jsx("span", { style: Xs, children: re ? /* @__PURE__ */ s.jsx("img", { alt: "", className: "profile-link-preview-image", src: re, style: qs }) : /* @__PURE__ */ s.jsx("span", { style: Gs, children: lt }) }),
                  /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { className: "profile-link-copy", children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "공용 프로필 미리보기" }),
                  /* @__PURE__ */ s.jsx("span", { children: "눌러서 이미지 변경" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ s.jsxs(
            "div",
            {
              className: "box-body",
              style: { display: "flex", flexDirection: "column", gap: "18px", padding: 0, width: "100%" },
              children: [
                /* @__PURE__ */ s.jsxs(
                  "div",
                  {
                    className: "info-row",
                    style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" },
                    children: [
                      /* @__PURE__ */ s.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "이름" }),
                      /* @__PURE__ */ s.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ s.jsx(
                        "input",
                        {
                          className: "id-input",
                          type: "text",
                          value: c.name,
                          onChange: (l) => f((u) => ({ ...u, name: l.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ s.jsxs(
                  "div",
                  {
                    className: "info-row",
                    style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" },
                    children: [
                      /* @__PURE__ */ s.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "이메일" }),
                      /* @__PURE__ */ s.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ s.jsx(
                        "input",
                        {
                          className: "id-input",
                          type: "email",
                          value: c.email,
                          onChange: (l) => f((u) => ({ ...u, email: l.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ s.jsxs(
                  "div",
                  {
                    className: "info-row",
                    style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" },
                    children: [
                      /* @__PURE__ */ s.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "휴대전화" }),
                      /* @__PURE__ */ s.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ s.jsx(
                        "input",
                        {
                          className: "id-input",
                          type: "tel",
                          value: c.phone,
                          onChange: (l) => f((u) => ({ ...u, phone: l.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) })
                    ]
                  }
                )
              ]
            }
          ),
          j ? /* @__PURE__ */ s.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: j }) : null,
          A ? /* @__PURE__ */ s.jsx("div", { "aria-live": "polite", role: "status", style: { color: "#4b5563", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: "저장 중..." }) : null,
          /* @__PURE__ */ s.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ s.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: Se, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: gt,
                disabled: yt,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("header", { className: "modal-header", children: /* @__PURE__ */ s.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ s.jsx("h3", { children: "프로필 사진 편집" }) }) }),
          /* @__PURE__ */ s.jsx("input", { ref: Ne, accept: "image/*", hidden: !0, type: "file", onChange: pt }),
          /* @__PURE__ */ s.jsx("div", { className: "profile-avatar-editor soft-radius", children: /* @__PURE__ */ s.jsx("div", { className: "profile-avatar-editor-preview", children: /* @__PURE__ */ s.jsx(
            "div",
            {
              ref: G,
              onPointerCancel: Ee,
              onPointerDown: ut,
              onPointerMove: ht,
              onPointerUp: Ee,
              onWheel: xt,
              style: {
                ...jt,
                cursor: C ? ot ? "grabbing" : "grab" : "default"
              },
              children: C ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx(
                  "img",
                  {
                    ref: I,
                    alt: "프로필 사진 편집 미리보기",
                    draggable: !1,
                    src: C,
                    style: Nt,
                    onLoad: ct
                  }
                ),
                ke ? /* @__PURE__ */ s.jsx("div", { style: ke }) : null,
                Re ? /* @__PURE__ */ s.jsx("div", { style: Re }) : null
              ] }) : /* @__PURE__ */ s.jsx(
                "button",
                {
                  className: "profile-avatar-editor-empty",
                  type: "button",
                  onClick: Ae,
                  children: "사진 선택"
                }
              )
            }
          ) }) }),
          C ? /* @__PURE__ */ s.jsx("div", { style: { display: "flex", justifyContent: "center", marginTop: "-4px" }, children: /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              onClick: Ae,
              style: {
                background: "transparent",
                border: "none",
                color: "#6b7280",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 700,
                padding: "6px 10px",
                textDecoration: "underline",
                textUnderlineOffset: "3px"
              },
              children: "다른 사진 선택"
            }
          ) }) : null,
          y ? /* @__PURE__ */ s.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: y }) : null,
          /* @__PURE__ */ s.jsxs("footer", { className: "modal-footer", style: { marginTop: "10px", gap: "14px" }, children: [
            /* @__PURE__ */ s.jsx(
              "button",
              {
                className: "cancel-btn pill-shape",
                type: "button",
                onClick: () => {
                  S("profile"), m(null);
                },
                style: { padding: "18px 0", fontSize: "15px" },
                children: "이전"
              }
            ),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: ft,
                disabled: !C || !_ || k,
                style: { padding: "18px 0", fontSize: "15px" },
                children: k ? "적용 중..." : "적용"
              }
            )
          ] })
        ] })
      }
    ) }) : null
  ] });
}, an = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"]
}, rn = () => typeof document > "u" ? !1 : Array.from(document.querySelectorAll("link[href], script[src]")).some((e) => (e.getAttribute("href") ?? e.getAttribute("src") ?? "").includes("/front-mirror/")), Oe = (e, t = !1) => {
  const n = e === "qna" ? "qna" : e === "notice" ? "notice" : "faq", [a, o] = an[n];
  return t ? o : a;
}, on = () => {
  const { state: e } = q(), t = e.supportItems ?? [], [n] = p.useState(rn), [a, o] = p.useState({});
  return /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-support", children: [
    /* @__PURE__ */ s.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "section-title", children: "고객지원" }),
      /* @__PURE__ */ s.jsx("p", { className: "section-subtitle", children: "여행 중 궁금한 점을 전문가와 상담하세요." })
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "support-bento-grid bento-grid", children: t.map((r) => /* @__PURE__ */ s.jsxs("a", { className: `support-item-card bento-item meta-glass-theme soft-radius ${r.id}`, href: r.href, children: [
      /* @__PURE__ */ s.jsx("div", { className: "sp-icon", children: /* @__PURE__ */ s.jsx(
        "img",
        {
          alt: r.label,
          onError: (i) => {
            a[r.id] || n || (o((c) => ({
              ...c,
              [r.id]: !0
            })), i.currentTarget.src = Oe(r.id, !0));
          },
          src: Oe(r.id, n || a[r.id] === !0)
        }
      ) }),
      /* @__PURE__ */ s.jsxs("div", { className: "sp-text", children: [
        /* @__PURE__ */ s.jsx("strong", { className: "sp-label", children: r.label }),
        r.count !== null ? /* @__PURE__ */ s.jsxs("span", { className: `sp-badge pill-shape ${r.count > 0 ? "active" : ""}`, children: [
          r.count,
          " 건"
        ] }) : /* @__PURE__ */ s.jsx("span", { className: "sp-link-text", children: "상세 보기" })
      ] })
    ] }, r.id)) })
  ] });
}, ln = () => /* @__PURE__ */ s.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ s.jsx(Ds, {}),
  /* @__PURE__ */ s.jsx(Ls, {}),
  /* @__PURE__ */ s.jsx(Ks, {}),
  /* @__PURE__ */ s.jsx(nn, {}),
  /* @__PURE__ */ s.jsx(on, {})
] }), pn = () => /* @__PURE__ */ s.jsx(ks, { children: /* @__PURE__ */ s.jsx(ln, {}) });
export {
  pn as M
};
