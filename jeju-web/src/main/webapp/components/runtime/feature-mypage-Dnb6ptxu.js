import { j as s, a as p } from "./react-vendor-BoSfm_Te.js";
import { A as ge } from "./legacy-core-BoI547nw.js";
const ee = {
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
}, ve = [
  { label: "보유 포인트", tone: "point", value: "0P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "0장" },
  { label: "다가오는 여행", tone: "air", value: "0건" }
], je = [
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
], be = {
  id: "",
  isMember: !1,
  name: ""
}, qe = {
  checked: !1,
  id: "",
  label: "",
  ownerId: "",
  ownerName: "",
  status: "reserved",
  type: "voucher"
}, Ge = {
  activities: [],
  companions: [],
  date: "",
  googleMapUrl: "",
  id: "",
  time: "",
  title: ""
}, We = [], Ze = [];
function Ne({
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
        u && !c.companions.some((v) => v.id === u.id) && c.companions.push({ ...u });
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
const R = Ae(ee), te = P(ve), Qe = Ie(je), se = ae(We), ne = re(Ze), Se = Ne({
  currentAccountId: ee.id ?? "",
  linkedCompanions: se,
  travelEvents: ne
}), we = [
  { count: 0, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], Ee = () => ({
  bookings: Ie(je),
  itinerary: Ce(Se),
  linkedCompanions: ae(se),
  profile: Ae(ee),
  stats: P(ve),
  supportItems: Me(we),
  travelEvents: re(ne)
}), G = (e) => {
  const t = Ee(), n = rt(e);
  if (!vt(n))
    return t;
  const o = it(n, t.profile), r = ht(n.linkedCompanions, t.linkedCompanions), i = xt(n.travelEvents, t.travelEvents), c = n.travelEvents !== void 0 ? Ne({
    currentAccountId: o.id ?? t.profile.id ?? "",
    linkedCompanions: r,
    travelEvents: i
  }) : mt(n.itinerary, t.itinerary);
  return {
    bookings: pt(n.bookings, t.bookings),
    itinerary: c,
    linkedCompanions: r,
    profile: o,
    stats: ct(n.stats ?? n, t.stats),
    supportItems: ut(n.supportItems ?? n.support ?? n.inquiries, t.supportItems),
    travelEvents: i
  };
}, L = (e) => {
  Xe(R, e.profile), Je(te, e.stats), et(Qe, e.bookings), tt(Se, e.itinerary), st(se, e.linkedCompanions), nt(we, e.supportItems), at(ne, e.travelEvents);
};
function Ae(e) {
  return {
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function P(e) {
  return e.map((t) => ({ ...t }));
}
function Ie(e) {
  return e.map((t) => ({
    ...t,
    tags: [...t.tags]
  }));
}
function ae(e) {
  return e.map((t) => ({ ...t }));
}
function Ce(e) {
  return e.map((t) => ({
    ...t,
    activities: t.activities.map((n) => ({ ...n })),
    companions: t.companions.map((n) => ({ ...n }))
  }));
}
function Me(e) {
  return e.map((t) => ({ ...t }));
}
function re(e) {
  return e.map((t) => ({ ...t }));
}
const Xe = (e, t) => {
  if (e.email = t.email, e.memberships.splice(0, e.memberships.length, ...t.memberships), e.name = t.name, e.phone = t.phone, e.tier = t.tier, e.role = t.role, e.id = t.id, t.passport) {
    e.passport = { ...t.passport };
    return;
  }
  delete e.passport;
}, Je = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, et = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((n) => ({
      ...n,
      tags: [...n.tags]
    }))
  );
}, tt = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((n) => ({
      ...n,
      activities: n.activities.map((a) => ({ ...a })),
      companions: n.companions.map((a) => ({ ...a }))
    }))
  );
}, st = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, nt = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, at = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, rt = (e) => {
  const t = {}, n = (a) => {
    A(a) && Object.assign(t, a);
  };
  return n(e), A(e) && (n(e.user), n(e.member), n(e.profile), n(e.data), n(e.session)), t;
}, it = (e, t) => {
  const n = ot(e.memberships, e.tier ?? e.role), a = lt(e.passport), o = l(e.tier) ?? n[0] ?? l(e.role), r = l(e.id) ?? l(e.memberId) ?? l(e.userId), i = l(e.name) ?? l(e.displayName) ?? l(e.fullName) ?? l(e.nickname) ?? l(e.id) ?? l(e.memberId) ?? l(e.userId) ?? t.name;
  return {
    email: l(e.email) ?? yt(e, r, i) ?? t.email,
    id: r ?? t.id,
    memberships: n,
    name: i,
    passport: a,
    phone: l(e.phone) ?? l(e.mobile) ?? "미등록",
    role: l(e.role),
    tier: o
  };
}, ot = (e, t) => {
  const n = Array.isArray(e) ? e.map((o) => l(o)).filter((o) => !!o) : [];
  if (n.length > 0)
    return n;
  const a = l(t);
  return a ? [a] : [];
}, lt = (e) => {
  const t = A(e) ? e : null;
  if (!t)
    return;
  const n = {
    expiryDate: l(t == null ? void 0 : t.expiryDate) ?? "",
    issuingCountry: l(t == null ? void 0 : t.issuingCountry) ?? "",
    number: l(t == null ? void 0 : t.number) ?? ""
  };
  if (!(!n.expiryDate && !n.issuingCountry && !n.number))
    return n;
}, ct = (e, t) => Array.isArray(e) && e.length > 0 ? t.map((n, a) => dt(e[a], n, !0)) : Array.isArray(e) && e.length === 0 ? P(t) : A(e) ? ft(e, t) : P(t), dt = (e, t, n = !1) => {
  const a = A(e) ? e : {}, o = kt(a.tone) ? a.tone : t.tone, r = l(a.label) ?? t.label, i = a.value ?? t.value;
  return {
    label: r,
    tone: o,
    value: Q(i, t)
  };
}, Q = (e, t) => {
  const n = l(e);
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
}, pt = (e, t) => Array.isArray(e) ? e.length === 0 ? [] : e.map((n, a) => jt(n, t[a % t.length] ?? t[0], !0)) : [], mt = (e, t) => !Array.isArray(e) || e.length === 0 ? Ce(t) : e.map(
  (n, a) => bt(
    n,
    t.length > 0 ? t[a % t.length] ?? t[0] : Ge
  )
), ut = (e, t) => !Array.isArray(e) || e.length === 0 ? Me(t) : e.map((n, a) => wt(n, t[a % t.length] ?? t[0])), ht = (e, t) => !Array.isArray(e) || e.length === 0 ? ae(t) : e.map(
  (n, a) => At(
    n,
    t.length > 0 ? t[a % t.length] ?? t[0] : be
  )
), ke = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => It(t)).filter((t) => t !== null), xt = (e, t) => {
  const n = ke(e);
  return n.length > 0 ? n : re(t);
}, ft = (e, t) => t.map((n) => {
  const a = Mt(e, Ct(n.tone));
  return a === void 0 ? { ...n } : {
    ...n,
    value: Q(a, n)
  };
}), yt = (e, t, n) => {
  const a = t ?? l(e.memberId) ?? l(e.userId) ?? l(e.username) ?? l(e.loginId) ?? gt(n);
  if (a)
    return `${a}@jejugroup.example`;
}, gt = (e) => {
  const n = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return n.length > 0 ? n : void 0;
}, vt = (e) => [
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
].some((n) => n in e), jt = (e, t, n = !1) => {
  const a = A(e) ? e : {}, o = Array.isArray(a.tags) ? a.tags.map((i) => l(i)).filter((i) => !!i) : [], r = ie(a.type) ? a.type : t.type;
  return {
    amount: l(a.amount) ?? (n ? "" : t.amount),
    date: l(a.date) ?? (n ? "" : t.date),
    duration: l(a.duration) ?? (n ? void 0 : t.duration),
    id: l(a.id) ?? (n ? "" : t.id),
    paymentMethod: l(a.paymentMethod) ?? (n ? void 0 : t.paymentMethod),
    status: l(a.status) ?? (n ? "" : t.status),
    tags: o.length > 0 ? o : n ? [] : [...t.tags],
    title: l(a.title) ?? (n ? "" : t.title),
    type: r,
    voucherUrl: l(a.voucherUrl) ?? (n ? void 0 : t.voucherUrl)
  };
}, bt = (e, t) => {
  const n = A(e) ? e : {}, a = Array.isArray(n.activities) ? n.activities.map(
    (r, i) => Nt(
      r,
      t.activities.length > 0 ? t.activities[i % t.activities.length] ?? t.activities[0] : qe
    )
  ) : t.activities.map((r) => ({ ...r })), o = Array.isArray(n.companions) ? n.companions.map(
    (r, i) => St(
      r,
      t.companions.length > 0 ? t.companions[i % t.companions.length] ?? t.companions[0] : be
    )
  ) : t.companions.map((r) => ({ ...r }));
  return {
    activities: a,
    companions: o,
    date: l(n.date) ?? t.date,
    googleMapUrl: l(n.googleMapUrl) ?? t.googleMapUrl,
    id: l(n.id) ?? t.id,
    time: l(n.time) ?? t.time,
    title: l(n.title) ?? t.title
  };
}, Nt = (e, t) => {
  const n = A(e) ? e : {};
  return {
    checked: typeof n.checked == "boolean" ? n.checked : X(n.status) ? n.status === "used" : t.checked,
    id: l(n.id) ?? t.id,
    label: l(n.label) ?? t.label,
    ownerId: l(n.ownerId) ?? t.ownerId,
    ownerName: l(n.ownerName) ?? t.ownerName,
    status: X(n.status) ? n.status : t.status,
    type: ie(n.type) ? n.type : t.type
  };
}, St = (e, t) => {
  const n = A(e) ? e : {};
  return {
    id: l(n.id) ?? t.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : t.isMember,
    name: l(n.name) ?? t.name
  };
}, wt = (e, t) => {
  const n = A(e) ? e : {};
  return {
    count: Et(n.count, t.count),
    href: l(n.href) ?? t.href,
    id: l(n.id) ?? t.id,
    label: l(n.label) ?? t.label
  };
}, Et = (e, t) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const n = l(e);
  if (!n)
    return t;
  const a = Number(n);
  return Number.isFinite(a) ? a : t;
}, At = (e, t) => {
  const n = A(e) ? e : {};
  return {
    id: l(n.id) ?? t.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : t.isMember,
    name: l(n.name) ?? t.name
  };
}, It = (e) => {
  const t = A(e) ? e : null;
  if (!t)
    return null;
  const n = l(t.id), a = l(t.dayId), o = l(t.title), r = l(t.date), i = l(t.time), c = l(t.activityLabel), y = l(t.ownerId), u = l(t.ownerName), v = l(t.googleMapUrl);
  return !n || !a || !o || !r || !i || !c || !y || !u || !v ? null : {
    activityLabel: c,
    date: r,
    dayId: a,
    googleMapUrl: v,
    id: n,
    ownerId: y,
    ownerName: u,
    status: X(t.status) ? t.status : "reserved",
    time: i,
    title: o,
    type: ie(t.type) ? t.type : "voucher"
  };
}, Ct = (e) => {
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
}, Mt = (e, t) => {
  for (const n of t)
    if (n in e) {
      const a = e[n];
      if (a != null)
        return Array.isArray(a) ? a.length : a;
    }
}, A = (e) => e !== null && typeof e == "object" && !Array.isArray(e), l = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, ie = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", X = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", kt = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", D = ({ children: e, className: t = "" }) => {
  const n = ["bento-box", "soft-radius", t].filter(Boolean).join(" ");
  return /* @__PURE__ */ s.jsx("div", { className: n, children: e });
}, J = "jeju:mypage-dashboard-mock-updated", Te = "jeju:mypage-dashboard:", Tt = ["id", "memberId", "userId", "email", "loginId", "username"], De = ["user", "member", "profile", "data", "session"], C = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Dt = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, Rt = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), _t = (e) => {
  const t = [];
  if (!C(e))
    return t;
  t.push(e);
  for (const n of De) {
    const a = e[n];
    C(a) && t.push(a);
  }
  return t;
}, Re = (e) => {
  const t = _t(e);
  for (const n of t)
    for (const a of Tt) {
      const o = Dt(n[a]);
      if (!o)
        continue;
      const r = Rt(o);
      if (r)
        return r;
    }
  return null;
}, _e = (e) => `${Te}${e}`, zt = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return C(t) ? t : null;
  } catch {
    return null;
  }
}, Lt = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(J, {
      detail: { accountKey: e }
    })
  );
}, ze = (e) => {
  const t = Re(e);
  return t ? Le(t) : null;
}, Le = (e) => {
  try {
    return zt(localStorage.getItem(_e(e)));
  } catch {
    return null;
  }
}, B = (e, t) => {
  const n = C(e) ? e : {}, a = C(t) ? t : {};
  if (Object.keys(n).length === 0 && Object.keys(a).length === 0)
    return null;
  const o = {
    ...n,
    ...a
  };
  for (const r of De) {
    const i = n[r], c = a[r];
    (C(i) || C(c)) && (o[r] = {
      ...C(i) ? i : {},
      ...C(c) ? c : {}
    });
  }
  return o;
}, Ot = (e, t) => {
  const n = Re(e);
  if (!n)
    return !1;
  try {
    return localStorage.setItem(_e(n), JSON.stringify(t)), Lt(n), !0;
  } catch {
    return !1;
  }
}, Pt = (e, t) => {
  const n = B(ze(e), t);
  return n ? Ot(e, n) : !1;
}, Bt = "userSession", me = "jeju:session-updated", Ut = "/api/auth/session", Kt = "/api/mypage/dashboard", $t = () => {
  const e = Ee();
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
}, Ft = (e, t) => {
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
}, Oe = p.createContext(null), Pe = (e) => `${ge}${e}`, Ht = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Vt = async () => {
  try {
    const e = await fetch(Pe(Ut), {
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
}, Yt = async () => {
  try {
    const e = await fetch(Pe(Kt), {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    if (e.status === 401 || !e.ok)
      return null;
    const t = await e.json();
    return !Ht(t) || t.success !== !0 || !("dashboard" in t) ? null : t.dashboard ?? null;
  } catch {
    return null;
  }
}, qt = async () => await Vt(), Gt = async (e) => {
  if (!e)
    return null;
  const t = await Yt();
  return t ? B(e, t) : e;
}, ue = async () => {
  const e = await qt();
  if (!e)
    return null;
  const t = await Gt(e);
  return Qt(t);
}, Wt = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), Zt = (e, t) => ({
  ...e,
  ...t,
  memberships: t.memberships ? [...t.memberships] : [...e.memberships],
  passport: t.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : t.passport ? { ...t.passport } : void 0
}), Qt = (e) => {
  const t = B(e, ze(e)), n = G(t);
  if (n.linkedCompanions.length === 0)
    return G(t);
  const a = [
    ...n.travelEvents,
    ...n.linkedCompanions.flatMap((o) => {
      const r = Le(o.id);
      return !r || !("travelEvents" in r) ? [] : ke(r.travelEvents).map((i) => ({
        ...i,
        ownerId: i.ownerId || o.id,
        ownerName: i.ownerName || o.name
      }));
    })
  ];
  return G(
    B(t, {
      linkedCompanions: n.linkedCompanions,
      travelEvents: a
    })
  );
}, Xt = ({ children: e }) => {
  const [t, n] = p.useReducer(Ft, void 0, $t), [a, o] = p.useState(!1), [r, i] = p.useState(!1), c = (x) => {
    L(x), n({ type: "HYDRATE_DASHBOARD", payload: x });
  }, y = (x) => {
    x.type === "HYDRATE_DASHBOARD" ? L(x.payload) : x.type === "PATCH_PROFILE" && L({
      bookings: t.bookings,
      itinerary: t.itinerary,
      linkedCompanions: t.linkedCompanions,
      profile: Zt(t.profile, x.payload),
      stats: t.stats,
      supportItems: t.supportItems,
      travelEvents: t.travelEvents
    }), n(x);
  }, u = async () => {
    const x = await ue();
    return x ? (c(x), !0) : !1;
  };
  p.useEffect(() => {
    L(Wt(t));
  }, [t.bookings, t.itinerary, t.linkedCompanions, t.profile, t.stats, t.supportItems, t.travelEvents]), p.useEffect(() => {
    let x = !0, N = !1;
    const w = async () => {
      const d = await ue();
      if (!d) {
        if (!x)
          return;
        i(!1), o(!0);
        return;
      }
      x && (i(!0), o(!0), c(d));
    }, h = () => {
      N || (N = !0, w().finally(() => {
        N = !1;
      }));
    };
    h();
    const j = (d) => {
      var E;
      if (d.key === Bt) {
        h();
        return;
      }
      (E = d.key) != null && E.startsWith(Te) && h();
    }, g = () => {
      h();
    }, f = () => {
      h();
    };
    return window.addEventListener("storage", j), window.addEventListener(me, g), window.addEventListener(J, f), () => {
      x = !1, window.removeEventListener("storage", j), window.removeEventListener(me, g), window.removeEventListener(J, f);
    };
  }, [n]);
  const v = p.useMemo(
    () => ({
      dispatch: y,
      refreshDashboard: u,
      state: t
    }),
    [y, u, t]
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
  ] }) : /* @__PURE__ */ s.jsx(Oe.Provider, { value: v, children: e });
}, _ = () => {
  const e = p.useContext(Oe);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, Be = (e) => {
  const t = (e == null ? void 0 : e.trim().toLowerCase()) ?? "";
  return t.includes("diamond") || t.includes("다이아") ? "diamond" : t.includes("platinum") || t.includes("플래티넘") ? "platinum" : t.includes("silver") || t.includes("실버") ? "silver" : t.includes("gold") || t.includes("골드") ? "gold" : null;
}, Jt = (e) => Be(e) ?? "neutral", es = (e) => {
  switch (Be(e)) {
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
}, he = (e) => {
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
}, W = (e) => {
  const t = document.querySelector(e);
  if (!t)
    return;
  const n = t.querySelector(".section-title") ?? t, a = document.querySelector("#jeju-page-shell-header .header") ?? document.querySelector(".header"), o = (a == null ? void 0 : a.getBoundingClientRect().height) ?? 72, r = window.scrollY + n.getBoundingClientRect().top - o - 24;
  window.scrollTo({
    top: Math.max(0, r),
    behavior: "smooth"
  });
}, ts = () => {
  var c, y;
  const { state: e } = _(), t = e.profile ?? R, n = (c = e.stats) != null && c.length ? e.stats : te, a = ((y = t.memberships) == null ? void 0 : y[0]) ?? R.memberships[0], o = t.tier ?? a, r = Jt(o), i = es(o);
  return p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []), /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ s.jsx(D, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ s.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ s.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ s.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ s.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: `https://api.dicebear.com/7.x/notionists/svg?seed=${t.name}&backgroundColor=f8f9fa`
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
          /* @__PURE__ */ s.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => W(".layer-full-management"), children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => W(".layer-itinerary"), children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => W(".layer-account-benefits"), children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ s.jsx("div", { className: "summary-stats-column", children: n.map((u) => /* @__PURE__ */ s.jsxs(D, { className: `stat-card meta-glass-theme tone-${u.tone}`, children: [
      /* @__PURE__ */ s.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ s.jsx("i", { "data-lucide": he(u.tone), className: `lucide-${he(u.tone)}` }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ s.jsx("span", { className: "stat-label", children: u.label }),
        /* @__PURE__ */ s.jsx("strong", { className: "stat-value", children: u.value })
      ] })
    ] }, u.label)) })
  ] });
}, ss = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, ns = ({ tone: e, value: t }) => {
  const n = ss[e];
  return /* @__PURE__ */ s.jsx("span", { className: `pill-shape ${n}`.trim(), children: t });
}, as = ["all", "air", "stay", "rent", "voucher"], rs = () => {
  const { dispatch: e, state: t } = _(), n = t.bookings ?? [];
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
      /* @__PURE__ */ s.jsx("div", { className: "booking-filters flex-gap", children: as.map((r) => /* @__PURE__ */ s.jsx(
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
          /* @__PURE__ */ s.jsx(ns, { tone: r.type, value: r.status }),
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
}, is = {
  park_jy: { id: "park_jy", name: "박준영" },
  lee_je: { id: "lee_je", name: "이지은" },
  choi_sj: { id: "choi_sj", name: "최수진" }
}, os = (e) => e.trim().toLowerCase(), ls = async (e) => {
  await new Promise((n) => setTimeout(n, 400));
  const t = is[e];
  return t ? {
    ...t,
    isMember: !0
  } : null;
}, cs = ({
  initialCompanions: e = [],
  lookupMemberById: t = ls
} = {}) => {
  const [n, a] = p.useState(e), [o, r] = p.useState(""), [i, c] = p.useState(null), [y, u] = p.useState(!1), [v, x] = p.useState(null), N = p.useCallback(async (g) => {
    const f = os(g);
    if (!f) {
      x({ message: "검색할 제주그룹 회원 ID를 입력해라" }), c(null);
      return;
    }
    if (!/^[a-z0-9._-]{2,30}$/i.test(f)) {
      x({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), c(null);
      return;
    }
    u(!0), x(null), c(null);
    try {
      const d = await t(f);
      d ? c(d) : x({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" });
    } catch {
      x({ message: "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라" });
    } finally {
      u(!1);
    }
  }, [t]), w = p.useCallback(() => {
    r(""), c(null), x(null);
  }, []), h = p.useCallback((g) => {
    a((f) => f.some((d) => d.id === g.id) ? f : [...f, g]), w();
  }, [w]), j = p.useCallback((g) => {
    a((f) => f.filter((d) => d.id !== g));
  }, []);
  return {
    companions: n,
    searchQuery: o,
    setSearchQuery: r,
    searchResult: i,
    isSearching: y,
    errorObj: v,
    handleSearch: N,
    addCompanion: h,
    removeCompanion: j,
    clearSearch: w
  };
}, ds = ({
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
    isSearching: y,
    errorObj: u,
    handleSearch: v,
    addCompanion: x,
    removeCompanion: N,
    clearSearch: w
  } = cs({ initialCompanions: e }), h = p.useRef(null), j = c ? o.some((d) => d.id === c.id) : !1;
  if (p.useEffect(() => {
    if (t) {
      w();
      const d = window.setTimeout(() => {
        var E;
        return (E = h.current) == null ? void 0 : E.focus();
      }, 100);
      return () => window.clearTimeout(d);
    }
  }, [t, w]), p.useEffect(() => {
    const d = (E) => {
      E.key === "Escape" && t && n();
    };
    return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
  }, [t, n]), p.useEffect(() => {
    t && window.lucide && window.lucide.createIcons();
  }, [t, c, o, u]), !t) return null;
  const g = (d) => {
    d.preventDefault(), v(r);
  }, f = () => {
    a(o), n();
  };
  return /* @__PURE__ */ s.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: n, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (d) => d.stopPropagation(),
      style: { padding: "40px" },
      children: [
        /* @__PURE__ */ s.jsx("header", { className: "modal-header", children: /* @__PURE__ */ s.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ s.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "companion-modal-body", children: [
          /* @__PURE__ */ s.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: g, style: { gap: "16px", marginBottom: "32px" }, children: [
            /* @__PURE__ */ s.jsx(
              "input",
              {
                ref: h,
                className: "id-input companion-search-input",
                type: "text",
                placeholder: "제주그룹 회원 ID를 입력해라",
                value: r,
                onChange: (d) => i(d.target.value),
                style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px" },
                autoComplete: "off"
              }
            ),
            /* @__PURE__ */ s.jsx(
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
          u && /* @__PURE__ */ s.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            u.message
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
                onClick: () => x(c),
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
            o.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 추가해라." }) : /* @__PURE__ */ s.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { gap: "16px", maxHeight: "280px" }, children: o.map((d) => /* @__PURE__ */ s.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ s.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ s.jsxs("div", { className: `companion-avatar soft-radius ${d.isMember ? "is-linked" : ""}`, style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }, children: [
                  d.name.charAt(0),
                  d.isMember && /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator", style: { width: "14px", height: "14px" } })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ s.jsx("strong", { style: { fontSize: "16px" }, children: d.name }),
                  /* @__PURE__ */ s.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    d.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ s.jsx(
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
        /* @__PURE__ */ s.jsxs("footer", { className: "modal-footer", style: { marginTop: "40px", gap: "16px" }, children: [
          /* @__PURE__ */ s.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: n, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ s.jsx("button", { className: "save-btn pill-shape", type: "button", onClick: f, style: { padding: "20px 0", fontSize: "16px" }, children: "적용" })
        ] })
      ]
    }
  ) });
}, ps = (e) => {
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
}, ms = () => {
  const { dispatch: e, state: t } = _(), n = t.itinerary ?? [], a = n.length > 0 ? n : [
    {
      activities: [],
      companions: [],
      date: "일정 미정",
      googleMapUrl: "",
      id: "empty-itinerary",
      time: "시간 미정",
      title: "여행 일정 준비 중"
    }
  ], o = t.linkedCompanions ?? [], r = t.profile, [i, c] = p.useState(!1), [y, u] = p.useState(null), v = p.useRef({}), [x, N] = p.useState({});
  p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [i, n, o]), p.useLayoutEffect(() => {
    const h = a.reduce((j, g) => {
      var f;
      return j[g.id] = ((f = v.current[g.id]) == null ? void 0 : f.scrollHeight) ?? 0, j;
    }, {});
    N((j) => {
      const g = Object.keys(j), f = Object.keys(h);
      return g.length === f.length && f.every((d) => j[d] === h[d]) ? j : h;
    });
  }, [a, i]);
  const w = (h) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: h }), Pt(
      {
        id: r.id,
        profile: {
          email: r.email,
          id: r.id,
          name: r.name
        }
      },
      {
        linkedCompanions: h
      }
    ), u(null);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ s.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ s.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: `itinerary-timeline-wrap ${i ? "is-expanded" : ""}`, children: [
      a.map((h, j) => {
        const g = j < 2, f = g || i, d = x[h.id] ?? 720, E = h.id === "empty-itinerary";
        return /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (b) => {
              v.current[h.id] = b;
            },
            "aria-hidden": !f,
            style: g ? void 0 : {
              overflow: "hidden",
              maxHeight: f ? `${d}px` : "0px",
              opacity: f ? 1 : 0,
              transform: f ? "translateY(0)" : "translateY(-18px)",
              marginBottom: f ? "40px" : "0px",
              pointerEvents: f ? "auto" : "none",
              transition: "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)"
            },
            children: [
              /* @__PURE__ */ s.jsxs("div", { className: "day-side-info", children: [
                /* @__PURE__ */ s.jsx("span", { className: "day-date", children: h.date }),
                /* @__PURE__ */ s.jsx("span", { className: "day-time", children: h.time }),
                /* @__PURE__ */ s.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
                  /* @__PURE__ */ s.jsxs("div", { className: "comp-head", children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "users", className: "lucide-users" }),
                    /* @__PURE__ */ s.jsx("span", { className: "small-label", children: "함께하는 동행자" })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { className: `avatar-stack ${h.companions.length === 0 ? "is-empty" : ""}`, children: [
                    h.companions.map((b) => /* @__PURE__ */ s.jsxs(
                      "div",
                      {
                        className: `companion-avatar soft-radius ${b.isMember ? "is-linked" : ""}`,
                        title: b.name + (b.isMember ? " (연동됨)" : ""),
                        children: [
                          b.name.charAt(0),
                          b.isMember && /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                        ]
                      },
                      b.id
                    )),
                    /* @__PURE__ */ s.jsxs("span", { className: "comp-count-label", children: [
                      "총 ",
                      h.companions.length,
                      "명"
                    ] })
                  ] }),
                  /* @__PURE__ */ s.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => u(h.id), children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ s.jsxs(D, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ s.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ s.jsx("h3", { className: "iti-title", children: h.title }),
                  h.googleMapUrl ? /* @__PURE__ */ s.jsxs("a", { className: "map-link-btn pill-shape", href: h.googleMapUrl, rel: "noopener noreferrer", target: "_blank", children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 보기"
                  ] }) : /* @__PURE__ */ s.jsxs("span", { className: "map-link-btn pill-shape is-disabled", "aria-disabled": "true", children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 준비 중"
                  ] })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ s.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ s.jsx("ul", { className: `checklist-list ${h.activities.length === 0 ? "is-empty" : ""}`, children: h.activities.map((b) => {
                    const M = ps(b.status), z = b.status === "used", I = b.status === "cancelled" || b.status === "missed";
                    return /* @__PURE__ */ s.jsx(
                      "li",
                      {
                        className: `checklist-item ${z ? "checked" : ""} soft-radius`,
                        style: M.style,
                        children: /* @__PURE__ */ s.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ s.jsx(
                            "i",
                            {
                              "data-lucide": M.icon,
                              style: {
                                color: z ? "var(--brand-rent)" : I ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ s.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ s.jsx("span", { className: "check-text", children: b.label }),
                            /* @__PURE__ */ s.jsx(
                              "span",
                              {
                                style: {
                                  color: I ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (b.ownerName ?? "본인") + " · " + M.label
                              }
                            )
                          ] })
                        ] })
                      },
                      b.id
                    );
                  }) }),
                  E ? /* @__PURE__ */ s.jsx("p", { className: "checklist-empty-caption", children: "등록된 활동이 아직 없다." }) : null
                ] })
              ] })
            ]
          },
          h.id
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
    y && /* @__PURE__ */ s.jsx(
      ds,
      {
        isOpen: !!y,
        onClose: () => u(null),
        initialCompanions: o,
        onSave: w
      }
    )
  ] });
}, us = 5 * 1024 * 1024, O = 1, hs = 2.4, k = 140, T = 512, Z = (e) => ({
  email: e.email,
  name: e.name,
  phone: e.phone
}), xs = (e) => ({
  email: e.email.trim(),
  name: e.name.trim(),
  phone: e.phone.trim()
}), xe = (e) => e.name.trim().length > 0 && e.email.trim().includes("@") && e.phone.trim().length > 0, fs = (e) => `${ge}${e}`, fe = (e, t, n) => Math.min(n, Math.max(t, e)), ys = (e) => new Promise((t, n) => {
  const a = new FileReader();
  a.onload = () => {
    if (typeof a.result == "string") {
      t(a.result);
      return;
    }
    n(new Error("이미지 데이터를 읽지 못했다"));
  }, a.onerror = () => n(new Error("이미지 데이터를 읽지 못했다")), a.readAsDataURL(e);
}), gs = (e) => new Promise((t, n) => {
  const a = new Image();
  a.crossOrigin = "anonymous", a.onload = () => t(a), a.onerror = () => n(new Error("이미지를 불러오지 못했다")), a.src = e;
}), vs = async ({
  offsetX: e,
  offsetY: t,
  sourceUrl: n,
  zoom: a
}) => {
  const o = await gs(n), r = document.createElement("canvas");
  r.width = T, r.height = T;
  const i = r.getContext("2d");
  if (!i)
    throw new Error("프로필 사진 편집용 캔버스를 만들지 못했다");
  i.fillStyle = "#ffffff", i.fillRect(0, 0, T, T);
  const y = Math.max(T / o.width, T / o.height) * a, u = o.width * y, v = o.height * y, x = (T - u) / 2 + e, N = (T - v) / 2 + t;
  return i.drawImage(o, x, N, u, v), r.toDataURL("image/png");
}, js = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, bs = () => {
  var pe;
  const { refreshDashboard: e, state: t } = _(), n = t.profile ?? R, a = (pe = t.stats) != null && pe.length ? t.stats : te, o = n.passport, [r, i] = p.useState(() => Z(n)), [c, y] = p.useState(() => Z(n)), [u, v] = p.useState(!1), [x, N] = p.useState("profile"), [w, h] = p.useState(!1), [j, g] = p.useState(null), [f, d] = p.useState(null), [E, b] = p.useState(!1), [M, z] = p.useState(null), [I, oe] = p.useState(null), [U, K] = p.useState(O), [$, F] = p.useState(0), [H, V] = p.useState(0), le = p.useRef(null), Ue = (c.name.trim().charAt(0) || R.name.trim().charAt(0) || "J").toUpperCase();
  p.useEffect(() => {
    u && window.lucide && window.lucide.createIcons();
  }, [M, u, x]), p.useEffect(() => {
    const m = Z(n);
    u || (i(m), y(m));
  }, [n, u]);
  const Y = () => {
    oe(M), K(O), F(0), V(0), d(null), b(!1);
  }, Ke = () => {
    y(r), g(null), N("profile"), Y(), v(!0);
  }, ce = () => {
    y(r), g(null), N("profile"), Y(), v(!1);
  }, de = () => {
    N("avatar"), Y();
  }, $e = async (m) => {
    var q;
    const S = (q = m.target.files) == null ? void 0 : q[0];
    if (m.target.value = "", !!S) {
      if (!S.type.startsWith("image/")) {
        d("이미지 파일만 넣어라");
        return;
      }
      if (S.size > us) {
        d("프로필 사진은 5MB 이하로 맞춰라");
        return;
      }
      try {
        const Ye = await ys(S);
        oe(Ye), K(O), F(0), V(0), d(null);
      } catch {
        d("이미지를 읽지 못했다. 다른 파일로 다시 해라");
      }
    }
  }, Fe = async () => {
    if (!I) {
      d("먼저 이미지를 골라라");
      return;
    }
    b(!0), d(null);
    try {
      const m = await vs({
        offsetX: $,
        offsetY: H,
        sourceUrl: I,
        zoom: U
      });
      z(m), N("profile");
    } catch {
      d("프로필 사진 적용에 실패했다");
    } finally {
      b(!1);
    }
  }, He = async () => {
    const m = xs(c);
    if (!xe(m)) {
      g("이름, 이메일, 전화번호를 확인해라");
      return;
    }
    h(!0), g(null);
    try {
      const S = await fetch(fs("/api/mypage/profile"), {
        body: JSON.stringify(m),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PUT"
      });
      if (S.status === 401)
        throw new Error("로그인이 만료됐다. 다시 로그인해라");
      if (!S.ok)
        throw new Error("프로필 저장에 실패했다. 잠시 후 다시 시도해라");
      if (!await e())
        throw new Error("저장은 됐지만 최신 정보를 다시 불러오지 못했다");
      v(!1), N("profile");
    } catch (S) {
      g(S instanceof Error ? S.message : "프로필 저장에 실패했다. 잠시 후 다시 시도해라");
    } finally {
      h(!1);
    }
  }, Ve = w || !xe(c);
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ s.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ s.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ s.jsxs(D, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ s.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ s.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: Ke, children: "내 정보 수정" })
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
        /* @__PURE__ */ s.jsxs(D, { className: "passport-info-box meta-glass-theme", children: [
          /* @__PURE__ */ s.jsx("div", { className: "box-head", children: /* @__PURE__ */ s.jsx("h3", { children: "패스포트 정보" }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ s.jsx(
              "div",
              {
                className: "passport-visual soft-radius",
                style: o ? void 0 : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" },
                children: /* @__PURE__ */ s.jsxs("div", { className: "pass-meta", children: [
                  /* @__PURE__ */ s.jsx("span", { className: "pass-num", children: (o == null ? void 0 : o.number) ?? "미등록" }),
                  /* @__PURE__ */ s.jsx("span", { className: "pass-country", children: (o == null ? void 0 : o.issuingCountry) ?? "해외 여행 전에 여권 정보를 등록해라" })
                ] })
              }
            ),
            /* @__PURE__ */ s.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "label", children: o ? "여권 만료일" : "등록 상태" }),
              /* @__PURE__ */ s.jsx("strong", { className: "value", children: (o == null ? void 0 : o.expiryDate) ?? "등록 필요" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs(D, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ s.jsx("div", { className: "box-head", children: /* @__PURE__ */ s.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ s.jsx("div", { className: "benefit-tiles", children: a.slice(0, 2).map((m) => /* @__PURE__ */ s.jsxs("div", { className: `benefit-tile tone-${m.tone} soft-radius`, children: [
            /* @__PURE__ */ s.jsx("span", { className: "benefit-label", children: m.label }),
            /* @__PURE__ */ s.jsx("strong", { className: "benefit-value", style: js(m.tone), children: m.value }),
            /* @__PURE__ */ s.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, m.label)) })
        ] })
      ] })
    ] }),
    u ? /* @__PURE__ */ s.jsx("div", { className: "meta-modal-overlay", onClick: ce, children: /* @__PURE__ */ s.jsx(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (m) => m.stopPropagation(),
        style: { padding: "36px" },
        children: x === "profile" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("header", { className: "modal-header", children: /* @__PURE__ */ s.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ s.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ s.jsxs(
            "div",
            {
              className: "profile-link-preview soft-radius",
              role: "button",
              tabIndex: 0,
              onClick: de,
              onKeyDown: (m) => {
                (m.key === "Enter" || m.key === " ") && (m.preventDefault(), de());
              },
              children: [
                /* @__PURE__ */ s.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", children: [
                  M ? /* @__PURE__ */ s.jsx("img", { alt: "", className: "profile-link-preview-image", src: M }) : Ue,
                  /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { className: "profile-link-copy", children: [
                  /* @__PURE__ */ s.jsx("strong", { children: "연동 프로필 배지" }),
                  /* @__PURE__ */ s.jsx("span", { children: "동행자 UI와 같은 아바타·링크 배지를 재사용" })
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
                          onChange: (m) => y((S) => ({ ...S, name: m.target.value })),
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
                          onChange: (m) => y((S) => ({ ...S, email: m.target.value })),
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
                          onChange: (m) => y((S) => ({ ...S, phone: m.target.value })),
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
          w ? /* @__PURE__ */ s.jsx("div", { "aria-live": "polite", role: "status", style: { color: "#4b5563", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: "저장 중..." }) : null,
          /* @__PURE__ */ s.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ s.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: ce, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: He,
                disabled: Ve,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("header", { className: "modal-header", children: /* @__PURE__ */ s.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ s.jsx("h3", { children: "프로필 사진 편집" }) }) }),
          /* @__PURE__ */ s.jsx("input", { ref: le, accept: "image/*", hidden: !0, type: "file", onChange: $e }),
          /* @__PURE__ */ s.jsxs("div", { className: "profile-avatar-editor soft-radius", children: [
            /* @__PURE__ */ s.jsx("div", { className: "profile-avatar-editor-preview", children: /* @__PURE__ */ s.jsx("div", { className: "profile-avatar-editor-stage", children: I ? /* @__PURE__ */ s.jsx(
              "img",
              {
                alt: "프로필 사진 미리보기",
                className: "profile-avatar-editor-image",
                src: I,
                style: {
                  transform: `translate(${$}px, ${H}px) scale(${U})`
                }
              }
            ) : /* @__PURE__ */ s.jsx("div", { className: "profile-avatar-editor-empty", children: "이미지를 업로드해라" }) }) }),
            /* @__PURE__ */ s.jsxs("div", { className: "profile-avatar-editor-controls", children: [
              /* @__PURE__ */ s.jsx("button", { className: "add-btn pill-shape", type: "button", onClick: () => {
                var m;
                return (m = le.current) == null ? void 0 : m.click();
              }, children: "이미지 업로드" }),
              /* @__PURE__ */ s.jsxs("label", { className: "profile-avatar-editor-field", children: [
                /* @__PURE__ */ s.jsx("span", { children: "크기 조절" }),
                /* @__PURE__ */ s.jsx(
                  "input",
                  {
                    max: hs,
                    min: O,
                    step: 0.01,
                    type: "range",
                    value: U,
                    disabled: !I,
                    onChange: (m) => K(Number(m.target.value))
                  }
                )
              ] }),
              /* @__PURE__ */ s.jsxs("label", { className: "profile-avatar-editor-field", children: [
                /* @__PURE__ */ s.jsx("span", { children: "가로 위치" }),
                /* @__PURE__ */ s.jsx(
                  "input",
                  {
                    max: k,
                    min: -k,
                    step: 1,
                    type: "range",
                    value: $,
                    disabled: !I,
                    onChange: (m) => F(fe(Number(m.target.value), -k, k))
                  }
                )
              ] }),
              /* @__PURE__ */ s.jsxs("label", { className: "profile-avatar-editor-field", children: [
                /* @__PURE__ */ s.jsx("span", { children: "세로 위치" }),
                /* @__PURE__ */ s.jsx(
                  "input",
                  {
                    max: k,
                    min: -k,
                    step: 1,
                    type: "range",
                    value: H,
                    disabled: !I,
                    onChange: (m) => V(fe(Number(m.target.value), -k, k))
                  }
                )
              ] })
            ] })
          ] }),
          f ? /* @__PURE__ */ s.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: f }) : null,
          /* @__PURE__ */ s.jsxs("footer", { className: "modal-footer", style: { marginTop: "10px", gap: "14px" }, children: [
            /* @__PURE__ */ s.jsx(
              "button",
              {
                className: "cancel-btn pill-shape",
                type: "button",
                onClick: () => {
                  N("profile"), d(null);
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
                onClick: Fe,
                disabled: !I || E,
                style: { padding: "18px 0", fontSize: "15px" },
                children: E ? "적용 중..." : "적용"
              }
            )
          ] })
        ] })
      }
    ) }) : null
  ] });
}, Ns = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"]
}, Ss = () => typeof document > "u" ? !1 : Array.from(document.querySelectorAll("link[href], script[src]")).some((e) => (e.getAttribute("href") ?? e.getAttribute("src") ?? "").includes("/front-mirror/")), ye = (e, t = !1) => {
  const n = e === "qna" ? "qna" : e === "notice" ? "notice" : "faq", [a, o] = Ns[n];
  return t ? o : a;
}, ws = () => {
  const { state: e } = _(), t = e.supportItems ?? [], [n] = p.useState(Ss), [a, o] = p.useState({});
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
            })), i.currentTarget.src = ye(r.id, !0));
          },
          src: ye(r.id, n || a[r.id] === !0)
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
}, Es = () => /* @__PURE__ */ s.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ s.jsx(ts, {}),
  /* @__PURE__ */ s.jsx(rs, {}),
  /* @__PURE__ */ s.jsx(ms, {}),
  /* @__PURE__ */ s.jsx(bs, {}),
  /* @__PURE__ */ s.jsx(ws, {})
] }), Cs = () => /* @__PURE__ */ s.jsx(Xt, { children: /* @__PURE__ */ s.jsx(Es, {}) });
export {
  Cs as M
};
