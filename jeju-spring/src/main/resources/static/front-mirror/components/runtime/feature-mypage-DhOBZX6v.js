import { j as s, a as d } from "./react-vendor-BoSfm_Te.js";
import { A as pe } from "./legacy-core-BoI547nw.js";
const Ft = /^[a-zA-Z][a-zA-Z\d+\-.]*:/, we = {
  email: "minji.hong@jejugroup.example",
  id: "hong_minji",
  memberships: ["GOLD"],
  name: "홍민지",
  nickname: void 0,
  passport: {
    expiryDate: "2032.12.31",
    issuingCountry: "Republic of Korea",
    number: "M12345678"
  },
  phone: "010-1234-5678",
  tier: "GOLD"
}, st = [
  { label: "보유 포인트", tone: "point", value: "0P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "0장" },
  { label: "다가오는 여행", tone: "air", value: "0건" }
], nt = [
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
], at = {
  id: "",
  isMember: !1,
  name: ""
}, Ht = {
  checked: !1,
  id: "",
  label: "",
  ownerId: "",
  ownerName: "",
  status: "reserved",
  type: "voucher"
}, Wt = {
  activities: [],
  companions: [],
  date: "",
  googleMapUrl: "",
  id: "",
  time: "",
  title: ""
}, Kt = [], Yt = [], se = (e) => {
  const t = m(e);
  if (t)
    return t.startsWith("data:") || t.startsWith("blob:") || t.startsWith("//") || Ft.test(t) ? t : `${pe}${t}`;
};
function rt({
  currentAccountId: e,
  linkedCompanions: t,
  travelEvents: n
}) {
  const a = new Map(t.map((o) => [o.id, o])), i = /* @__PURE__ */ new Set([
    ...e ? [e] : [],
    ...t.map((o) => o.id)
  ]), r = /* @__PURE__ */ new Map();
  for (const o of n) {
    if (i.size > 0 && !i.has(o.ownerId))
      continue;
    const l = r.get(o.dayId), x = {
      checked: o.status === "used",
      id: o.id,
      label: o.activityLabel,
      ownerId: o.ownerId,
      ownerName: o.ownerName,
      status: o.status,
      type: o.type
    };
    if (l) {
      if (l.activities.push(x), o.ownerId !== e && a.has(o.ownerId)) {
        const h = a.get(o.ownerId);
        h && !l.companions.some((N) => N.id === h.id) && l.companions.push({ ...h });
      }
      continue;
    }
    r.set(o.dayId, {
      activities: [x],
      companions: o.ownerId !== e && a.has(o.ownerId) ? [{ ...a.get(o.ownerId) }] : [],
      date: o.date,
      googleMapUrl: o.googleMapUrl,
      id: o.dayId,
      sortKey: `${o.date} ${o.time}`,
      time: o.time,
      title: o.title
    });
  }
  return Array.from(r.values()).sort((o, l) => o.sortKey.localeCompare(l.sortKey)).map(({ sortKey: o, ...l }) => l);
}
const W = ct(we), Ae = me(st), Vt = dt(nt), Ie = ke(Kt), Ee = Ce(Yt), it = rt({
  currentAccountId: we.id ?? "",
  linkedCompanions: Ie,
  travelEvents: Ee
}), ot = [
  { count: 0, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], lt = () => ({
  bookings: dt(nt),
  itinerary: mt(it),
  linkedCompanions: ke(Ie),
  profile: ct(we),
  stats: me(st),
  supportItems: ut(ot),
  travelEvents: Ce(Ee)
}), xe = (e) => {
  const t = lt(), n = ts(e);
  if (!fs(n))
    return t;
  const i = ss(n, t.profile), r = ds(n.linkedCompanions, t.linkedCompanions), o = ms(n.travelEvents, t.travelEvents), l = n.travelEvents !== void 0 ? rt({
    currentAccountId: i.id ?? t.profile.id ?? "",
    linkedCompanions: r,
    travelEvents: o
  }) : ls(n.itinerary, t.itinerary);
  return {
    bookings: os(n.bookings, t.bookings),
    itinerary: l,
    linkedCompanions: r,
    profile: i,
    stats: rs(n.stats ?? n, t.stats),
    supportItems: cs(n.supportItems ?? n.support ?? n.inquiries, t.supportItems),
    travelEvents: o
  };
}, ie = (e) => {
  qt(W, e.profile), Xt(Ae, e.stats), Gt(Vt, e.bookings), Zt(it, e.itinerary), Qt(Ie, e.linkedCompanions), Jt(ot, e.supportItems), es(Ee, e.travelEvents);
};
function ct(e) {
  return {
    avatarUrl: e.avatarUrl,
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function me(e) {
  return e.map((t) => ({ ...t }));
}
function dt(e) {
  return e.map((t) => ({
    ...t,
    tags: [...t.tags]
  }));
}
function ke(e) {
  return e.map((t) => ({ ...t }));
}
function mt(e) {
  return e.map((t) => ({
    ...t,
    activities: t.activities.map((n) => ({ ...n })),
    companions: t.companions.map((n) => ({ ...n }))
  }));
}
function ut(e) {
  return e.map((t) => ({ ...t }));
}
function Ce(e) {
  return e.map((t) => ({ ...t }));
}
const qt = (e, t) => {
  if (e.avatarUrl = t.avatarUrl, e.bio = t.bio, e.email = t.email, e.memberships.splice(0, e.memberships.length, ...t.memberships), e.name = t.name, e.nickname = t.nickname, e.phone = t.phone, e.tier = t.tier, e.role = t.role, e.id = t.id, t.passport) {
    e.passport = { ...t.passport };
    return;
  }
  delete e.passport;
}, Xt = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, Gt = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((n) => ({
      ...n,
      tags: [...n.tags]
    }))
  );
}, Zt = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((n) => ({
      ...n,
      activities: n.activities.map((a) => ({ ...a })),
      companions: n.companions.map((a) => ({ ...a }))
    }))
  );
}, Qt = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, Jt = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, es = (e, t) => {
  e.splice(0, e.length, ...t.map((n) => ({ ...n })));
}, ts = (e) => {
  const t = {}, n = (a) => {
    L(a) && Object.assign(t, a);
  };
  return n(e), L(e) && (n(e.user), n(e.member), n(e.profile), n(e.data), n(e.session)), t;
}, ss = (e, t) => {
  const n = ns(e.memberships, e.tier ?? e.role), a = as(e.passport), i = m(e.tier) ?? n[0] ?? m(e.role), r = m(e.id) ?? m(e.memberId) ?? m(e.userId), o = m(e.name) ?? m(e.displayName) ?? m(e.fullName) ?? m(e.nickname) ?? m(e.id) ?? m(e.memberId) ?? m(e.userId) ?? t.name, l = m(e.nickname), x = Is(
    B(e, "bio") ?? B(e, "intro") ?? B(e.profile, "bio") ?? B(e.profile, "intro") ?? B(e.user, "bio") ?? B(e.user, "intro") ?? B(e.member, "bio") ?? B(e.member, "intro") ?? B(e.data, "bio") ?? B(e.data, "intro") ?? t.bio
  );
  return {
    avatarUrl: se(e.avatarUrl),
    bio: x,
    email: m(e.email) ?? ps(e, r, o) ?? t.email,
    id: r ?? t.id,
    memberships: n,
    name: o,
    nickname: l,
    passport: a,
    phone: m(e.phone) ?? m(e.mobile) ?? "미등록",
    role: m(e.role),
    tier: i
  };
}, ns = (e, t) => {
  const n = Array.isArray(e) ? e.map((i) => m(i)).filter((i) => !!i) : [];
  if (n.length > 0)
    return n;
  const a = m(t);
  return a ? [a] : [];
}, as = (e) => {
  const t = L(e) ? e : null;
  if (!t)
    return;
  const n = {
    expiryDate: m(t == null ? void 0 : t.expiryDate) ?? "",
    issuingCountry: m(t == null ? void 0 : t.issuingCountry) ?? "",
    number: m(t == null ? void 0 : t.number) ?? ""
  };
  if (!(!n.expiryDate && !n.issuingCountry && !n.number))
    return n;
}, rs = (e, t) => Array.isArray(e) && e.length > 0 ? t.map((n, a) => is(e[a], n, !0)) : Array.isArray(e) && e.length === 0 ? me(t) : L(e) ? us(e, t) : me(t), is = (e, t, n = !1) => {
  const a = L(e) ? e : {}, i = Es(a.tone) ? a.tone : t.tone, r = m(a.label) ?? t.label, o = a.value ?? t.value;
  return {
    label: r,
    tone: i,
    value: je(o, t)
  };
}, je = (e, t) => {
  const n = m(e);
  if (!n)
    return t.value;
  if (!/^\d+(?:\.\d+)?$/.test(n))
    return n;
  const a = Number(n);
  if (!Number.isFinite(a))
    return n;
  const i = a.toLocaleString("ko-KR");
  switch (t.tone) {
    case "coupon":
      return `${i}장`;
    case "point":
      return `${i}P`;
    case "air":
      return `${i}건`;
    default:
      return n;
  }
}, os = (e, t) => Array.isArray(e) ? e.length === 0 ? [] : e.map((n, a) => gs(n, t[a % t.length] ?? t[0], !0)) : [], ls = (e, t) => !Array.isArray(e) || e.length === 0 ? mt(t) : e.map(
  (n, a) => xs(
    n,
    t.length > 0 ? t[a % t.length] ?? t[0] : Wt
  )
), cs = (e, t) => !Array.isArray(e) || e.length === 0 ? ut(t) : e.map((n, a) => vs(n, t[a % t.length] ?? t[0])), ds = (e, t) => !Array.isArray(e) || e.length === 0 ? ke(t) : e.map(
  (n, a) => Ns(
    n,
    t.length > 0 ? t[a % t.length] ?? t[0] : at
  )
), pt = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => Ss(t)).filter((t) => t !== null), ms = (e, t) => {
  const n = pt(e);
  return n.length > 0 ? n : Ce(t);
}, us = (e, t) => t.map((n) => {
  const a = As(e, ws(n.tone));
  return a === void 0 ? { ...n } : {
    ...n,
    value: je(a, n)
  };
}), ps = (e, t, n) => {
  const a = t ?? m(e.memberId) ?? m(e.userId) ?? m(e.username) ?? m(e.loginId) ?? hs(n);
  if (a)
    return `${a}@jejugroup.example`;
}, hs = (e) => {
  const n = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return n.length > 0 ? n : void 0;
}, fs = (e) => [
  "bio",
  "avatarUrl",
  "id",
  "memberId",
  "userId",
  "email",
  "name",
  "nickname",
  "phone",
  "mobile",
  "tier",
  "role",
  "memberships",
  "passport",
  "intro",
  "bookings",
  "stats",
  "profile",
  "member",
  "user",
  "session",
  "data"
].some((n) => n in e), gs = (e, t, n = !1) => {
  const a = L(e) ? e : {}, i = Array.isArray(a.tags) ? a.tags.map((o) => m(o)).filter((o) => !!o) : [], r = Me(a.type) ? a.type : t.type;
  return {
    amount: m(a.amount) ?? (n ? "" : t.amount),
    date: m(a.date) ?? (n ? "" : t.date),
    duration: m(a.duration) ?? (n ? void 0 : t.duration),
    id: m(a.id) ?? (n ? "" : t.id),
    paymentMethod: m(a.paymentMethod) ?? (n ? void 0 : t.paymentMethod),
    status: m(a.status) ?? (n ? "" : t.status),
    tags: i.length > 0 ? i : n ? [] : [...t.tags],
    title: m(a.title) ?? (n ? "" : t.title),
    type: r,
    voucherUrl: m(a.voucherUrl) ?? (n ? void 0 : t.voucherUrl)
  };
}, xs = (e, t) => {
  const n = L(e) ? e : {}, a = Array.isArray(n.activities) ? n.activities.map(
    (r, o) => ys(
      r,
      t.activities.length > 0 ? t.activities[o % t.activities.length] ?? t.activities[0] : Ht
    )
  ) : t.activities.map((r) => ({ ...r })), i = Array.isArray(n.companions) ? n.companions.map(
    (r, o) => bs(
      r,
      t.companions.length > 0 ? t.companions[o % t.companions.length] ?? t.companions[0] : at
    )
  ) : t.companions.map((r) => ({ ...r }));
  return {
    activities: a,
    companions: i,
    date: m(n.date) ?? t.date,
    googleMapUrl: m(n.googleMapUrl) ?? t.googleMapUrl,
    id: m(n.id) ?? t.id,
    time: m(n.time) ?? t.time,
    title: m(n.title) ?? t.title
  };
}, ys = (e, t) => {
  const n = L(e) ? e : {};
  return {
    checked: typeof n.checked == "boolean" ? n.checked : Ne(n.status) ? n.status === "used" : t.checked,
    id: m(n.id) ?? t.id,
    label: m(n.label) ?? t.label,
    ownerId: m(n.ownerId) ?? t.ownerId,
    ownerName: m(n.ownerName) ?? t.ownerName,
    status: Ne(n.status) ? n.status : t.status,
    type: Me(n.type) ? n.type : t.type
  };
}, bs = (e, t) => {
  const n = L(e) ? e : {};
  return {
    id: m(n.id) ?? t.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : t.isMember,
    name: m(n.name) ?? t.name
  };
}, vs = (e, t) => {
  const n = L(e) ? e : {};
  return {
    count: js(n.count, t.count),
    href: m(n.href) ?? t.href,
    id: m(n.id) ?? t.id,
    label: m(n.label) ?? t.label
  };
}, js = (e, t) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const n = m(e);
  if (!n)
    return t;
  const a = Number(n);
  return Number.isFinite(a) ? a : t;
}, Ns = (e, t) => {
  const n = L(e) ? e : {};
  return {
    id: m(n.id) ?? t.id,
    isMember: typeof n.isMember == "boolean" ? n.isMember : t.isMember,
    name: m(n.name) ?? t.name
  };
}, Ss = (e) => {
  const t = L(e) ? e : null;
  if (!t)
    return null;
  const n = m(t.id), a = m(t.dayId), i = m(t.title), r = m(t.date), o = m(t.time), l = m(t.activityLabel), x = m(t.ownerId), h = m(t.ownerName), N = m(t.googleMapUrl);
  return !n || !a || !i || !r || !o || !l || !x || !h || !N ? null : {
    activityLabel: l,
    date: r,
    dayId: a,
    googleMapUrl: N,
    id: n,
    ownerId: x,
    ownerName: h,
    status: Ne(t.status) ? t.status : "reserved",
    time: o,
    title: i,
    type: Me(t.type) ? t.type : "voucher"
  };
}, ws = (e) => {
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
}, As = (e, t) => {
  for (const n of t)
    if (n in e) {
      const a = e[n];
      if (a != null)
        return Array.isArray(a) ? a.length : a;
    }
}, L = (e) => e !== null && typeof e == "object" && !Array.isArray(e), m = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, B = (e, t) => {
  if (L(e))
    return m(e[t]);
}, Is = (e) => Array.from((e ?? "").trim()).slice(0, 20).join(""), Me = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", Ne = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", Es = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", Z = ({ children: e, className: t = "" }) => {
  const n = ["bento-box", "soft-radius", t].filter(Boolean).join(" ");
  return /* @__PURE__ */ s.jsx("div", { className: n, children: e });
}, Se = "jeju:mypage-dashboard-mock-updated", ht = "jeju:mypage-dashboard:", ks = ["id", "memberId", "userId", "email", "loginId", "username"], ft = ["user", "member", "profile", "data", "session"], $ = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Cs = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, Ms = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), Rs = (e) => {
  const t = [];
  if (!$(e))
    return t;
  t.push(e);
  for (const n of ft) {
    const a = e[n];
    $(a) && t.push(a);
  }
  return t;
}, gt = (e) => {
  const t = Rs(e);
  for (const n of t)
    for (const a of ks) {
      const i = Cs(n[a]);
      if (!i)
        continue;
      const r = Ms(i);
      if (r)
        return r;
    }
  return null;
}, xt = (e) => `${ht}${e}`, Ts = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return $(t) ? t : null;
  } catch {
    return null;
  }
}, Ds = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(Se, {
      detail: { accountKey: e }
    })
  );
}, yt = (e) => {
  const t = gt(e);
  return t ? bt(t) : null;
}, bt = (e) => {
  try {
    return Ts(localStorage.getItem(xt(e)));
  } catch {
    return null;
  }
}, ue = (e, t) => {
  const n = $(e) ? e : {}, a = $(t) ? t : {};
  if (Object.keys(n).length === 0 && Object.keys(a).length === 0)
    return null;
  const i = {
    ...n,
    ...a
  };
  for (const r of ft) {
    const o = n[r], l = a[r];
    ($(o) || $(l)) && (i[r] = {
      ...$(o) ? o : {},
      ...$(l) ? l : {}
    });
  }
  return i;
}, zs = (e, t) => {
  const n = gt(e);
  if (!n)
    return !1;
  try {
    return localStorage.setItem(xt(n), JSON.stringify(t)), Ds(n), !0;
  } catch {
    return !1;
  }
}, Ps = (e, t) => {
  const n = ue(yt(e), t);
  return n ? zs(e, n) : !1;
}, _s = "userSession", Ye = "jeju:session-updated", Ls = "/api/auth/session", Us = "/api/mypage/dashboard", Os = () => {
  const e = lt();
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
}, Bs = (e, t) => {
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
}, vt = d.createContext(null), jt = (e) => `${pe}${e}`, $s = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Fs = async () => {
  try {
    const e = await fetch(jt(Ls), {
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
}, Hs = async () => {
  try {
    const e = await fetch(jt(Us), {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    if (e.status === 401 || !e.ok)
      return null;
    const t = await e.json();
    return !$s(t) || t.success !== !0 || !("dashboard" in t) ? null : t.dashboard ?? null;
  } catch {
    return null;
  }
}, Ws = async () => await Fs(), Ks = async (e) => {
  if (!e)
    return null;
  const t = await Hs();
  return t ? ue(e, t) : e;
}, Ve = async () => {
  const e = await Ws();
  if (!e)
    return null;
  const t = await Ks(e);
  return qs(t);
}, Ys = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), Vs = (e, t) => ({
  ...e,
  ...t,
  memberships: t.memberships ? [...t.memberships] : [...e.memberships],
  passport: t.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : t.passport ? { ...t.passport } : void 0
}), qs = (e) => {
  const t = ue(e, yt(e)), n = xe(t);
  if (n.linkedCompanions.length === 0)
    return xe(t);
  const a = [
    ...n.travelEvents,
    ...n.linkedCompanions.flatMap((i) => {
      const r = bt(i.id);
      return !r || !("travelEvents" in r) ? [] : pt(r.travelEvents).map((o) => ({
        ...o,
        ownerId: o.ownerId || i.id,
        ownerName: o.ownerName || i.name
      }));
    })
  ];
  return xe(
    ue(t, {
      linkedCompanions: n.linkedCompanions,
      travelEvents: a
    })
  );
}, Xs = ({ children: e }) => {
  const [t, n] = d.useReducer(Bs, void 0, Os), [a, i] = d.useState(!1), [r, o] = d.useState(!1), l = (y) => {
    ie(y), n({ type: "HYDRATE_DASHBOARD", payload: y });
  }, x = (y) => {
    y.type === "HYDRATE_DASHBOARD" ? ie(y.payload) : y.type === "PATCH_PROFILE" && ie({
      bookings: t.bookings,
      itinerary: t.itinerary,
      linkedCompanions: t.linkedCompanions,
      profile: Vs(t.profile, y.payload),
      stats: t.stats,
      supportItems: t.supportItems,
      travelEvents: t.travelEvents
    }), n(y);
  }, h = async () => {
    const y = await Ve();
    return y ? (l(y), !0) : !1;
  };
  d.useEffect(() => {
    ie(Ys(t));
  }, [t.bookings, t.itinerary, t.linkedCompanions, t.profile, t.stats, t.supportItems, t.travelEvents]), d.useEffect(() => {
    let y = !0, E = !1;
    const I = async () => {
      const v = await Ve();
      if (!v) {
        if (!y)
          return;
        o(!1), i(!0);
        return;
      }
      y && (o(!0), i(!0), l(v));
    }, g = () => {
      E || (E = !0, I().finally(() => {
        E = !1;
      }));
    };
    g();
    const S = (v) => {
      var R;
      if (v.key === _s) {
        g();
        return;
      }
      (R = v.key) != null && R.startsWith(ht) && g();
    }, w = () => {
      g();
    }, j = () => {
      g();
    };
    return window.addEventListener("storage", S), window.addEventListener(Ye, w), window.addEventListener(Se, j), () => {
      y = !1, window.removeEventListener("storage", S), window.removeEventListener(Ye, w), window.removeEventListener(Se, j);
    };
  }, [n]);
  const N = d.useMemo(
    () => ({
      dispatch: x,
      refreshDashboard: h,
      state: t
    }),
    [x, h, t]
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
  ] }) : /* @__PURE__ */ s.jsx(vt.Provider, { value: N, children: e });
}, ne = () => {
  const e = d.useContext(vt);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, Nt = (e) => {
  const t = (e == null ? void 0 : e.trim().toLowerCase()) ?? "";
  return t.includes("diamond") || t.includes("다이아") ? "diamond" : t.includes("platinum") || t.includes("플래티넘") ? "platinum" : t.includes("silver") || t.includes("실버") ? "silver" : t.includes("gold") || t.includes("골드") ? "gold" : null;
}, Gs = (e) => Nt(e) ?? "neutral", Zs = (e) => {
  switch (Nt(e)) {
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
}, qe = (e) => {
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
}, ye = (e) => {
  const t = document.querySelector(e);
  if (!t)
    return;
  const n = t.querySelector(".section-title") ?? t, a = document.querySelector("#jeju-page-shell-header .header") ?? document.querySelector(".header"), i = (a == null ? void 0 : a.getBoundingClientRect().height) ?? 72, r = window.scrollY + n.getBoundingClientRect().top - i - 24;
  window.scrollTo({
    top: Math.max(0, r),
    behavior: "smooth"
  });
}, Qs = () => {
  var h, N, y, E;
  const { state: e } = ne(), t = e.profile ?? W, n = (h = e.stats) != null && h.length ? e.stats : Ae, a = ((N = t.memberships) == null ? void 0 : N[0]) ?? W.memberships[0], i = t.tier ?? a, r = Gs(i), o = Zs(i), l = ((y = t.nickname) == null ? void 0 : y.trim()) || t.name.trim(), x = se(t.avatarUrl) ?? `https://api.dicebear.com/7.x/notionists/svg?seed=${t.name}&backgroundColor=f8f9fa`;
  return d.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []), /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ s.jsx(Z, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ s.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ s.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ s.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ s.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: x
          }
        ),
        /* @__PURE__ */ s.jsx("div", { className: `membership-grade-chip soft-radius ${r}`, children: /* @__PURE__ */ s.jsx("span", { children: o }) })
      ] }) }),
      /* @__PURE__ */ s.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ s.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ s.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ s.jsx("strong", { className: "highlight", children: l }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ s.jsx("p", { className: "profile-welcome-msg", children: ((E = t.bio) == null ? void 0 : E.trim()) ?? "" }),
        /* @__PURE__ */ s.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ s.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => ye(".layer-full-management"), children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => ye(".layer-itinerary"), children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ s.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => ye(".layer-account-benefits"), children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ s.jsx("div", { className: "summary-stats-column", children: n.map((I) => /* @__PURE__ */ s.jsxs(Z, { className: `stat-card meta-glass-theme tone-${I.tone}`, children: [
      /* @__PURE__ */ s.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ s.jsx("i", { "data-lucide": qe(I.tone), className: `lucide-${qe(I.tone)}` }) }),
      /* @__PURE__ */ s.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ s.jsx("span", { className: "stat-label", children: I.label }),
        /* @__PURE__ */ s.jsx("strong", { className: "stat-value", children: I.value })
      ] })
    ] }, I.label)) })
  ] });
}, Js = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, en = ({ tone: e, value: t }) => {
  const n = Js[e];
  return /* @__PURE__ */ s.jsx("span", { className: `pill-shape ${n}`.trim(), children: t });
}, tn = ["all", "air", "stay", "rent", "voucher"], sn = () => {
  const { dispatch: e, state: t } = ne(), n = t.bookings ?? [];
  d.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [n, t.filter]);
  const a = d.useMemo(() => t.filter === "all" ? n : n.filter((r) => r.type === t.filter), [n, t.filter]), i = d.useCallback(
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
      /* @__PURE__ */ s.jsx("div", { className: "booking-filters flex-gap", children: tn.map((r) => /* @__PURE__ */ s.jsx(
        "button",
        {
          className: `filter-chip pill-shape ${t.filter === r ? "active" : ""}`,
          onClick: () => i(r),
          type: "button",
          children: r === "all" ? "전체" : r === "air" ? "항공" : r === "stay" ? "숙박" : r === "rent" ? "렌터카" : "바우처"
        },
        r
      )) })
    ] }),
    /* @__PURE__ */ s.jsx("ul", { className: "full-width-trip-list", children: a.length > 0 ? a.map((r) => /* @__PURE__ */ s.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": r.type, children: [
      /* @__PURE__ */ s.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ s.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ s.jsx(en, { tone: r.type, value: r.status }),
          /* @__PURE__ */ s.jsx("div", { className: "trip-tags", children: r.tags.map((o) => /* @__PURE__ */ s.jsx("span", { className: "meta-tag pill-shape", children: o }, o)) })
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
}, be = "/api/mypage/members/search", nn = 180, Xe = 5, Ge = (e) => e.trim().toLowerCase(), Ze = (e) => /^[a-z0-9._-]{1,30}$/i.test(e), K = (e) => e !== null && typeof e == "object" && !Array.isArray(e), oe = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, an = (e, t) => {
  var r;
  const n = be.startsWith("/") ? be : `/${be}`, a = (r = pe) == null ? void 0 : r.trim(), i = a ? new URL(n, a) : new URL(n, window.location.origin);
  return i.searchParams.set("query", e), i.searchParams.set("memberIdPrefix", e), i.searchParams.set("prefix", e), typeof t == "number" && i.searchParams.set("limit", String(t)), a ? i.toString() : `${i.pathname}${i.search}`;
}, rn = (e) => {
  if (Array.isArray(e))
    return e;
  if (!K(e))
    return [];
  const t = ["companions", "members", "users", "results", "items", "data"];
  for (const n of t) {
    const a = e[n];
    if (Array.isArray(a))
      return a;
    if (K(a) && Array.isArray(a.items))
      return a.items;
    if (K(a) && Array.isArray(a.results))
      return a.results;
  }
  if (K(e.data)) {
    const n = ["companions", "members", "users", "results", "items"];
    for (const a of n) {
      const i = e.data[a];
      if (Array.isArray(i))
        return i;
    }
  }
  return [];
}, on = (e) => {
  if (!K(e))
    return null;
  const t = oe(e.id ?? e.memberId ?? e.userId ?? e.loginId), n = oe(e.name ?? e.displayName ?? e.userName ?? e.nickname ?? e.fullName), a = oe(e.avatarUrl ?? e.avatar ?? e.profileImageUrl ?? e.imageUrl ?? e.photoUrl), i = oe(e.bio ?? e.intro ?? e.description ?? e.summary);
  return !t || !n ? null : {
    avatarUrl: a ?? void 0,
    bio: i ?? void 0,
    id: t,
    isMember: e.isMember !== !1,
    name: n
  };
}, ln = (e) => {
  const t = /* @__PURE__ */ new Set(), n = [];
  for (const a of e)
    t.has(a.id) || (t.add(a.id), n.push(a));
  return n;
}, cn = async (e, t) => {
  const n = await fetch(an(e, t == null ? void 0 : t.limit), {
    credentials: "include",
    headers: {
      Accept: "application/json"
    },
    method: "GET",
    signal: t == null ? void 0 : t.signal
  }), a = await n.json().catch(() => null);
  if (n.status === 401)
    throw new Error("로그인이 필요합니다.");
  if (!n.ok) {
    const r = K(a) && typeof a.message == "string" && a.message.trim() || K(a) && typeof a.error == "string" && a.error.trim() || "회원 조회에 실패했다";
    throw new Error(r);
  }
  if (K(a) && a.success === !1) {
    const r = typeof a.message == "string" && a.message.trim() || typeof a.error == "string" && a.error.trim() || "회원 조회에 실패했다";
    throw new Error(r);
  }
  const i = rn(a).map(on).filter((r) => r !== null);
  return ln(i).filter((r) => r.id.toLowerCase().startsWith(e));
}, dn = (e) => e instanceof Error && e.message.trim() ? e.message : "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라", mn = ({
  initialCompanions: e = [],
  searchMembers: t = cn
} = {}) => {
  const [n, a] = d.useState(e), [i, r] = d.useState(""), [o, l] = d.useState([]), [x, h] = d.useState("suggestions"), [N, y] = d.useState(!1), [E, I] = d.useState(!1), [g, S] = d.useState(null), w = d.useRef(0), j = d.useRef({
    controller: null,
    timerId: null
  }), v = d.useRef(null), R = d.useCallback(() => {
    var p;
    const f = j.current;
    f.timerId !== null && window.clearTimeout(f.timerId), (p = f.controller) == null || p.abort(), f.controller = null, f.timerId = null, I(!1);
  }, []), A = d.useCallback(() => {
    var f;
    (f = v.current) == null || f.abort(), v.current = null, y(!1);
  }, []), P = d.useCallback(
    async (f, p) => {
      var ae, q, Q, M;
      const C = Ge(f);
      if (!C)
        return l([]), p != null && p.strict && S({ message: "검색할 제주그룹 회원 ID를 입력해라" }), [];
      if (!Ze(C))
        return l([]), p != null && p.strict && S({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), [];
      const Y = ++w.current;
      if (p != null && p.strict) {
        R();
        const _ = new AbortController();
        v.current = _, l([]), S(null), h("results"), y(!0), p = {
          ...p,
          signal: p.signal ?? _.signal
        };
      } else
        I(!0);
      try {
        const _ = await t(C, {
          limit: p != null && p.strict ? void 0 : Xe,
          signal: p == null ? void 0 : p.signal
        });
        return Y !== w.current || (ae = p == null ? void 0 : p.signal) != null && ae.aborted ? [] : (l(_), p != null && p.strict && _.length === 0 ? S({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" }) : S(null), _);
      } catch (_) {
        return Y !== w.current || (q = p == null ? void 0 : p.signal) != null && q.aborted ? [] : (l([]), S({ message: dn(_) }), []);
      } finally {
        Y === w.current && !((Q = p == null ? void 0 : p.signal) != null && Q.aborted) && (p != null && p.strict ? (y(!1), ((M = v.current) == null ? void 0 : M.signal) === p.signal && (v.current = null)) : I(!1));
      }
    },
    [R, t]
  );
  d.useEffect(() => {
    const f = Ge(i);
    if (!f)
      return l([]), S(null), I(!1), () => {
        w.current += 1;
      };
    if (!Ze(f))
      return l([]), S({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), I(!1), () => {
        w.current += 1;
      };
    const p = new AbortController(), C = window.setTimeout(() => {
      P(f, { signal: p.signal });
    }, nn);
    return j.current.controller = p, j.current.timerId = C, () => {
      p.abort(), window.clearTimeout(C), j.current.controller === p && (j.current.controller = null), j.current.timerId === C && (j.current.timerId = null), w.current += 1;
    };
  }, [P, i]);
  const O = d.useCallback((f) => {
    A(), r(f), l([]), h("suggestions"), S(null), R();
  }, [A, R]), k = d.useCallback(() => {
    A(), R(), w.current += 1, r(""), l([]), h("suggestions"), y(!1), I(!1), S(null);
  }, [A, R]), b = d.useCallback(
    async (f) => (R(), await P(f, { strict: !0 })),
    [R, P]
  ), T = d.useCallback(
    (f) => {
      a((p) => p.some((C) => C.id === f.id) ? p : [...p, f]), h("suggestions"), k();
    },
    [k]
  ), F = d.useCallback((f) => {
    a((p) => p.filter((C) => C.id !== f));
  }, []);
  return {
    addCompanion: T,
    companions: n,
    clearSearch: k,
    errorObj: g,
    handleSearch: b,
    isSearching: N,
    isSuggestionLoading: E,
    removeCompanion: F,
    searchMode: x,
    searchQuery: i,
    searchResults: o,
    setSearchQuery: O,
    visibleSuggestionCount: Xe
  };
}, un = ({
  companion: e
}) => {
  const [t, n] = d.useState(!1), a = !!(e.avatarUrl && !t);
  return /* @__PURE__ */ s.jsxs(
    "div",
    {
      "aria-hidden": "true",
      className: "companion-avatar soft-radius is-linked companion-search-avatar",
      "data-companion-search-avatar": "true",
      children: [
        a ? /* @__PURE__ */ s.jsx(
          "img",
          {
            alt: "",
            src: e.avatarUrl,
            onError: () => n(!0),
            className: "companion-search-avatar-image"
          }
        ) : /* @__PURE__ */ s.jsx("span", { className: "companion-search-avatar-fallback", children: e.name.charAt(0) }),
        /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator companion-search-avatar-link" })
      ]
    }
  );
}, Qe = ({ companion: e, isLinked: t, showActionBadge: n, showLinkedBadge: a, onSelect: i }) => {
  var o;
  const r = ((o = e.bio) == null ? void 0 : o.trim()) || `@${e.id}`;
  return /* @__PURE__ */ s.jsxs(
    "button",
    {
      className: "companion-linked-item list-item soft-radius companion-search-card",
      type: "button",
      onClick: () => i(e),
      disabled: t,
      "data-linked": t ? "true" : "false",
      children: [
        /* @__PURE__ */ s.jsxs("div", { className: "item-info companion-search-card-info", children: [
          /* @__PURE__ */ s.jsx(un, { companion: e }),
          /* @__PURE__ */ s.jsxs("div", { className: "user-info name-meta companion-search-card-copy", children: [
            /* @__PURE__ */ s.jsx("strong", { children: e.name }),
            /* @__PURE__ */ s.jsx("span", { children: r })
          ] })
        ] }),
        n ? /* @__PURE__ */ s.jsx("span", { className: "pill-shape companion-search-card-badge", "data-linked": t ? "true" : "false", children: t ? "연동됨" : "추가" }) : a && t ? /* @__PURE__ */ s.jsx("span", { className: "pill-shape companion-search-card-badge", "data-linked": "true", children: "연동됨" }) : null
      ]
    }
  );
}, pn = ({
  initialCompanions: e,
  isOpen: t,
  onClose: n,
  onSave: a
}) => {
  const {
    companions: i,
    searchMode: r,
    searchQuery: o,
    searchResults: l,
    setSearchQuery: x,
    isSearching: h,
    errorObj: N,
    handleSearch: y,
    addCompanion: E,
    removeCompanion: I,
    clearSearch: g
  } = mn({ initialCompanions: e }), S = d.useRef(null), w = 4, j = o.trim().length > 0, v = d.useMemo(
    () => l.slice(0, w),
    [l]
  );
  if (d.useEffect(() => {
    if (t) {
      g();
      const b = window.setTimeout(() => {
        var T;
        return (T = S.current) == null ? void 0 : T.focus();
      }, 100);
      return () => window.clearTimeout(b);
    }
  }, [t, g]), d.useEffect(() => {
    const b = (T) => {
      T.key === "Escape" && t && n();
    };
    return window.addEventListener("keydown", b), () => window.removeEventListener("keydown", b);
  }, [t, n]), d.useEffect(() => {
    t && window.lucide && window.lucide.createIcons();
  }, [t, r, l, i, N]), !t) return null;
  const R = (b) => {
    b.preventDefault(), y(o);
  }, A = () => {
    a(i), n();
  }, P = (b) => i.some((T) => T.id === b), O = () => r !== "results" ? null : /* @__PURE__ */ s.jsx("div", { className: "companion-search-results-panel", children: N ? /* @__PURE__ */ s.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", fontWeight: 600 }, children: [
    /* @__PURE__ */ s.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
    N.message
  ] }) : h ? /* @__PURE__ */ s.jsx("p", { className: "empty-list", style: { padding: "28px 20px", fontSize: "14px" }, children: "제주그룹 회원을 찾는 중이다." }) : l.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "empty-list", style: { padding: "28px 20px", fontSize: "14px" }, children: "일치하는 제주그룹 회원이 없다." }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { style: { color: "var(--meta-text-muted)", fontSize: "13px", fontWeight: 700, flexShrink: 0 }, children: [
      "검색 결과 ",
      l.length,
      "명"
    ] }),
    /* @__PURE__ */ s.jsx("div", { className: "companion-search-results-list", children: l.map((b) => /* @__PURE__ */ s.jsx(
      Qe,
      {
        companion: b,
        isLinked: P(b.id),
        onSelect: E,
        showActionBadge: !0
      },
      b.id
    )) })
  ] }) }), k = () => r === "results" || v.length === 0 ? null : /* @__PURE__ */ s.jsx("div", { className: "companion-search-dropdown", children: v.map((b) => /* @__PURE__ */ s.jsx(
    Qe,
    {
      companion: b,
      isLinked: P(b.id),
      onSelect: E,
      showActionBadge: !1,
      showLinkedBadge: !0
    },
    b.id
  )) });
  return /* @__PURE__ */ s.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: n, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ s.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (b) => b.stopPropagation(),
      style: { display: "flex", flexDirection: "column", overflow: "hidden", padding: "40px" },
      children: [
        /* @__PURE__ */ s.jsx("header", { className: "modal-header", children: /* @__PURE__ */ s.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ s.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ s.jsxs("div", { className: "companion-modal-body", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "24px", minHeight: 0, overflow: "hidden" }, children: [
          /* @__PURE__ */ s.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: R, style: { gap: "16px", marginBottom: "0", flexShrink: 0 }, children: [
            /* @__PURE__ */ s.jsxs("div", { style: { display: "flex", flex: 1, flexDirection: "column", gap: "12px", minWidth: 0, position: "relative" }, children: [
              /* @__PURE__ */ s.jsx(
                "input",
                {
                  ref: S,
                  className: "id-input companion-search-input",
                  type: "text",
                  placeholder: "제주그룹 회원 ID를 입력해라",
                  value: o,
                  onChange: (b) => x(b.target.value),
                  style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px", width: "100%" },
                  autoComplete: "off"
                }
              ),
              /* @__PURE__ */ s.jsx("div", { style: { left: 0, position: "absolute", right: 0, top: "calc(100% - 1px)", zIndex: 3 }, children: k() })
            ] }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                type: "submit",
                className: "add-btn companion-search-submit pill-shape",
                disabled: h,
                style: {
                  background: j ? "#ff7a00" : "#eef1f4",
                  border: j ? "1px solid #ff7a00" : "1px solid #d7dce2",
                  boxShadow: "none",
                  color: j ? "#fff" : "#7b8794",
                  padding: "0 36px",
                  fontSize: "16px",
                  borderRadius: "16px",
                  flexShrink: 0
                },
                children: h ? "검색 중..." : "검색"
              }
            )
          ] }),
          r === "results" ? O() : null,
          N && r !== "results" && /* @__PURE__ */ s.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ s.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            N.message
          ] }),
          r !== "results" && /* @__PURE__ */ s.jsxs("div", { className: "linked-companions-section", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", minHeight: 0, overflow: "hidden" }, children: [
            /* @__PURE__ */ s.jsxs("h4", { style: { fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }, children: [
              "연동된 동행자 (",
              i.length,
              "명)"
            ] }),
            i.length === 0 ? /* @__PURE__ */ s.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 추가해라." }) : /* @__PURE__ */ s.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "16px", minHeight: 0, overflowY: "auto", paddingRight: "4px" }, children: i.map((b) => /* @__PURE__ */ s.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ s.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ s.jsxs("div", { className: `companion-avatar soft-radius ${b.isMember ? "is-linked" : ""}`, style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }, children: [
                  b.name.charAt(0),
                  b.isMember && /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator", style: { width: "14px", height: "14px" } })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ s.jsx("strong", { style: { fontSize: "16px" }, children: b.name }),
                  /* @__PURE__ */ s.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    b.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ s.jsx("button", { className: "remove-btn companion-remove-btn", onClick: () => I(b.id), style: { padding: "10px 24px", fontSize: "14px" }, children: "해제" })
            ] }, b.id)) })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs("footer", { className: "modal-footer", style: { marginTop: "24px", gap: "16px", flexShrink: 0 }, children: [
          /* @__PURE__ */ s.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: n, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ s.jsx("button", { className: "save-btn pill-shape", type: "button", onClick: A, style: { padding: "20px 0", fontSize: "16px" }, children: "적용" })
        ] })
      ]
    }
  ) });
}, hn = (e) => {
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
}, fn = () => {
  const { dispatch: e, state: t } = ne(), n = t.itinerary ?? [], a = n.length > 0 ? n : [
    {
      activities: [],
      companions: [],
      date: "일정 미정",
      googleMapUrl: "",
      id: "empty-itinerary",
      time: "시간 미정",
      title: "여행 일정 준비 중"
    }
  ], i = t.linkedCompanions ?? [], r = t.profile, [o, l] = d.useState(!1), [x, h] = d.useState(null), N = d.useRef({}), [y, E] = d.useState({});
  d.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [o, n, i]), d.useLayoutEffect(() => {
    const g = a.reduce((S, w) => {
      var j;
      return S[w.id] = ((j = N.current[w.id]) == null ? void 0 : j.scrollHeight) ?? 0, S;
    }, {});
    E((S) => {
      const w = Object.keys(S), j = Object.keys(g);
      return w.length === j.length && j.every((v) => S[v] === g[v]) ? S : g;
    });
  }, [a, o]);
  const I = (g) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: g }), Ps(
      {
        id: r.id,
        profile: {
          email: r.email,
          id: r.id,
          name: r.name
        }
      },
      {
        linkedCompanions: g
      }
    ), h(null);
  };
  return /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ s.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ s.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ s.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ s.jsxs("div", { className: `itinerary-timeline-wrap ${o ? "is-expanded" : ""}`, children: [
      a.map((g, S) => {
        const w = S < 2, j = w || o, v = y[g.id] ?? 720, R = g.id === "empty-itinerary";
        return /* @__PURE__ */ s.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (A) => {
              N.current[g.id] = A;
            },
            "aria-hidden": !j,
            style: w ? void 0 : {
              overflow: "hidden",
              maxHeight: j ? `${v}px` : "0px",
              opacity: j ? 1 : 0,
              transform: j ? "translateY(0)" : "translateY(-18px)",
              marginBottom: j ? "40px" : "0px",
              pointerEvents: j ? "auto" : "none",
              transition: "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)"
            },
            children: [
              /* @__PURE__ */ s.jsxs("div", { className: "day-side-info", children: [
                /* @__PURE__ */ s.jsx("span", { className: "day-date", children: g.date }),
                /* @__PURE__ */ s.jsx("span", { className: "day-time", children: g.time }),
                /* @__PURE__ */ s.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
                  /* @__PURE__ */ s.jsxs("div", { className: "comp-head", children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "users", className: "lucide-users" }),
                    /* @__PURE__ */ s.jsx("span", { className: "small-label", children: "함께하는 동행자" })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { className: `avatar-stack ${g.companions.length === 0 ? "is-empty" : ""}`, children: [
                    g.companions.map((A) => /* @__PURE__ */ s.jsxs(
                      "div",
                      {
                        className: `companion-avatar soft-radius ${A.isMember ? "is-linked" : ""}`,
                        title: A.name + (A.isMember ? " (연동됨)" : ""),
                        children: [
                          A.name.charAt(0),
                          A.isMember && /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                        ]
                      },
                      A.id
                    )),
                    /* @__PURE__ */ s.jsxs("span", { className: "comp-count-label", children: [
                      "총 ",
                      g.companions.length,
                      "명"
                    ] })
                  ] }),
                  /* @__PURE__ */ s.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => h(g.id), children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ s.jsxs(Z, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ s.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ s.jsx("h3", { className: "iti-title", children: g.title }),
                  g.googleMapUrl ? /* @__PURE__ */ s.jsxs("a", { className: "map-link-btn pill-shape", href: g.googleMapUrl, rel: "noopener noreferrer", target: "_blank", children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 보기"
                  ] }) : /* @__PURE__ */ s.jsxs("span", { className: "map-link-btn pill-shape is-disabled", "aria-disabled": "true", children: [
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 준비 중"
                  ] })
                ] }),
                /* @__PURE__ */ s.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ s.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ s.jsx("ul", { className: `checklist-list ${g.activities.length === 0 ? "is-empty" : ""}`, children: g.activities.map((A) => {
                    const P = hn(A.status), O = A.status === "used", k = A.status === "cancelled" || A.status === "missed";
                    return /* @__PURE__ */ s.jsx(
                      "li",
                      {
                        className: `checklist-item ${O ? "checked" : ""} soft-radius`,
                        style: P.style,
                        children: /* @__PURE__ */ s.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ s.jsx(
                            "i",
                            {
                              "data-lucide": P.icon,
                              style: {
                                color: O ? "var(--brand-rent)" : k ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ s.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ s.jsx("span", { className: "check-text", children: A.label }),
                            /* @__PURE__ */ s.jsx(
                              "span",
                              {
                                style: {
                                  color: k ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (A.ownerName ?? "본인") + " · " + P.label
                              }
                            )
                          ] })
                        ] })
                      },
                      A.id
                    );
                  }) }),
                  R ? /* @__PURE__ */ s.jsx("p", { className: "checklist-empty-caption", children: "등록된 활동이 아직 없다." }) : null
                ] })
              ] })
            ]
          },
          g.id
        );
      }),
      n.length > 2 && /* @__PURE__ */ s.jsx("div", { className: `timeline-gradient-overlay ${o ? "active" : ""}`, children: /* @__PURE__ */ s.jsx("button", { className: "expand-cta-btn pill-shape", onClick: () => l(!o), children: o ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        "전체 일정 접기 ",
        /* @__PURE__ */ s.jsx("i", { className: "lucide-chevron-up" })
      ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
        "남은 ",
        n.length - 2,
        "개의 일정 더 보기 ",
        /* @__PURE__ */ s.jsx("i", { className: "lucide-chevron-down" })
      ] }) }) })
    ] }),
    x && /* @__PURE__ */ s.jsx(
      pn,
      {
        isOpen: !!x,
        onClose: () => h(null),
        initialCompanions: i,
        onSave: I
      }
    )
  ] });
}, gn = 5 * 1024 * 1024, H = 512, xn = 16, yn = 6, St = 20, bn = {
  alignItems: "center",
  borderRadius: "50%",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  overflow: "hidden",
  position: "absolute"
}, vn = {
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%"
}, jn = {
  alignItems: "center",
  display: "flex",
  fontSize: "18px",
  fontWeight: 800,
  height: "100%",
  justifyContent: "center",
  width: "100%"
}, le = (e) => Array.from((e ?? "").trim()).slice(0, St).join(""), ve = (e) => ({
  bio: e.bio ?? "",
  email: e.email,
  name: e.name,
  nickname: e.nickname ?? "",
  phone: e.phone
}), Nn = (e) => ({
  bio: le(e.bio),
  email: e.email.trim(),
  name: e.name.trim(),
  nickname: e.nickname.trim(),
  phone: e.phone.trim()
}), Je = (e) => (e.nickname.trim().length === 0 || e.nickname.trim().length >= 2) && e.email.trim().includes("@") && e.phone.trim().length > 0, et = (e) => `${pe}${e}`, te = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Sn = (e) => new Promise((t, n) => {
  const a = new FileReader();
  a.onload = () => {
    if (typeof a.result == "string") {
      t(a.result);
      return;
    }
    n(new Error("이미지 데이터를 읽지 못했습니다."));
  }, a.onerror = () => n(new Error("이미지 데이터를 읽지 못했습니다.")), a.readAsDataURL(e);
}), ce = (e, t, n) => Math.min(n, Math.max(t, e)), V = (e, t, n) => {
  if (!e.naturalWidth || !e.naturalHeight)
    return null;
  const a = Math.max(1, Math.round(t || 320)), i = Math.max(1, Math.round(n || 320)), r = Math.max(0, Math.min(a, i) - xn * 2), o = r / 2, l = Math.min(a / e.naturalWidth, i / e.naturalHeight), x = e.naturalWidth * l, h = e.naturalHeight * l, N = Math.max(r / Math.max(x, 1), r / Math.max(h, 1), 1);
  return {
    baseHeight: h,
    baseScale: l,
    baseWidth: x,
    circleDiameter: r,
    circleRadius: o,
    maxZoom: yn,
    minZoom: N,
    stageHeight: i,
    stageWidth: a
  };
}, de = (e, t) => {
  const n = ce(e.zoom, t.minZoom, t.maxZoom), a = t.baseWidth * n, i = t.baseHeight * n, r = Math.max(0, (a - t.circleDiameter) / 2), o = Math.max(0, (i - t.circleDiameter) / 2);
  return {
    panX: ce(e.panX, -r, r),
    panY: ce(e.panY, -o, o),
    zoom: n
  };
}, wn = (e, t, n, a, i) => {
  const r = V(t, n, a);
  return r ? de(i, r) : e;
}, An = (e, t, n) => new Promise((a, i) => {
  const r = document.createElement("canvas"), o = window.devicePixelRatio || 1;
  r.width = Math.max(1, Math.round(H * o)), r.height = Math.max(1, Math.round(H * o));
  const l = r.getContext("2d");
  if (!l)
    throw new Error("프로필 사진 편집용 캔버스를 만들지 못했습니다.");
  l.scale(o, o), l.imageSmoothingQuality = "high", l.clearRect(0, 0, H, H);
  const x = H / Math.max(t.circleDiameter, 1), h = t.baseWidth * n.zoom, N = t.baseHeight * n.zoom, y = t.stageWidth / 2 + n.panX - h / 2 - (t.stageWidth / 2 - t.circleRadius), E = t.stageHeight / 2 + n.panY - N / 2 - (t.stageHeight / 2 - t.circleRadius);
  l.save(), l.beginPath(), l.arc(
    H / 2,
    H / 2,
    H / 2,
    0,
    Math.PI * 2
  ), l.closePath(), l.clip(), l.drawImage(
    e,
    y * x,
    E * x,
    h * x,
    N * x
  ), l.restore(), r.toBlob((I) => {
    if (I) {
      a(I);
      return;
    }
    i(new Error("프로필 사진 편집용 이미지를 만들지 못했습니다."));
  }, "image/png");
}), In = (e) => {
  if (!te(e))
    return null;
  const t = te(e.profile) ? e.profile : null, n = te(e.dashboard) ? e.dashboard : null, a = n && te(n.profile) ? n.profile : null, i = te(e.data) ? e.data : null, r = [
    e.avatarUrl,
    t == null ? void 0 : t.avatarUrl,
    n == null ? void 0 : n.avatarUrl,
    a == null ? void 0 : a.avatarUrl,
    i == null ? void 0 : i.avatarUrl
  ];
  for (const o of r)
    if (typeof o == "string") {
      const l = o.trim();
      if (l.length > 0)
        return l;
    }
  return null;
}, En = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, kn = () => {
  var Be, $e, Fe, He, We, Ke;
  const { refreshDashboard: e, state: t } = ne(), n = t.profile ?? W, a = (Be = t.stats) != null && Be.length ? t.stats : Ae, i = n.passport, [r, o] = d.useState(() => ve(n)), [l, x] = d.useState(() => ve(n)), [h, N] = d.useState(!1), [y, E] = d.useState("profile"), [I, g] = d.useState(!1), [S, w] = d.useState(null), [j, v] = d.useState(null), [R, A] = d.useState(!1), [P, O] = d.useState(null), [k, b] = d.useState(null), [T, F] = d.useState({ panX: 0, panY: 0, zoom: 1 }), [f, p] = d.useState({ height: 320, width: 320 }), [C, Y] = d.useState(!1), [ae, q] = d.useState(!1), Q = d.useRef(null), M = d.useRef(null), _ = d.useRef(null), J = d.useRef(null), he = se(P) ?? n.avatarUrl ?? null, wt = (l.nickname.trim().charAt(0) || l.name.trim().charAt(0) || (($e = r.nickname) == null ? void 0 : $e.trim().charAt(0)) || r.name.trim().charAt(0) || ((Fe = W.nickname) == null ? void 0 : Fe.trim().charAt(0)) || W.name.trim().charAt(0) || "J").toUpperCase(), At = l.nickname.trim() || l.name.trim() || ((He = r.nickname) == null ? void 0 : He.trim()) || r.name.trim() || ((We = W.nickname) == null ? void 0 : We.trim()) || W.name.trim(), It = le(l.bio) || le(r.bio), fe = l.nickname.trim().length > 0 && l.nickname.trim().length < 2 ? "닉네임은 2자 이상부터 가능합니다" : null;
  d.useEffect(() => {
    h && window.lucide && window.lucide.createIcons();
  }, [he, h, y]), d.useEffect(() => {
    if (!h)
      return;
    const c = document.body.style.overflow, u = document.documentElement.style.overflow;
    return document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", () => {
      document.body.style.overflow = c, document.documentElement.style.overflow = u;
    };
  }, [h]), d.useEffect(() => {
    const c = ve(n);
    h || (o(c), x(c));
  }, [n, h]), d.useEffect(() => {
    if (!h || y !== "avatar" || !_.current)
      return;
    const c = () => {
      var U;
      const z = (U = _.current) == null ? void 0 : U.getBoundingClientRect();
      z && p({
        height: Math.max(1, Math.round(z.height)),
        width: Math.max(1, Math.round(z.width))
      });
    };
    c();
    const u = new ResizeObserver(c);
    return u.observe(_.current), () => u.disconnect();
  }, [k, h, y]), d.useEffect(() => {
    if (!k || !C || !M.current)
      return;
    const c = V(M.current, f.width, f.height);
    c && F((u) => de(u, c));
  }, [C, k, f.height, f.width]);
  const Et = () => {
    const c = M.current;
    if (!c)
      return;
    const u = V(c, f.width, f.height);
    if (!u) {
      v("이미지 크기를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    Y(!0), F(de({ panX: 0, panY: 0, zoom: u.minZoom }, u)), v(null);
  }, ge = () => {
    b(null), F({ panX: 0, panY: 0, zoom: 1 }), Y(!1), v(null), A(!1), q(!1), J.current = null;
  }, kt = () => {
    x(r), w(null), E("profile"), O((c) => se(c) ?? n.avatarUrl ?? null), ge(), N(!0);
  }, Re = () => {
    x(r), w(null), E("profile"), ge(), N(!1);
  }, Te = () => {
    E("avatar"), ge();
  }, De = () => {
    var c;
    (c = Q.current) == null || c.click();
  }, Ct = async (c) => {
    var z;
    const u = (z = c.target.files) == null ? void 0 : z[0];
    if (c.target.value = "", !!u) {
      if (!u.type.startsWith("image/")) {
        v("이미지 파일만 선택해 주세요.");
        return;
      }
      if (u.size > gn) {
        v("프로필 사진은 5MB 이하로 선택해 주세요.");
        return;
      }
      try {
        const U = await Sn(u);
        b(U), F({ panX: 0, panY: 0, zoom: 1 }), Y(!1), v(null);
      } catch {
        v("이미지를 불러오지 못했습니다. 다른 파일로 다시 선택해 주세요.");
      }
    }
  }, Mt = (c) => {
    M.current && F(
      (u) => wn(
        u,
        M.current,
        f.width,
        f.height,
        c
      )
    );
  }, Rt = (c) => {
    !k || !C || !M.current || !V(M.current, f.width, f.height) || (c.preventDefault(), c.currentTarget.setPointerCapture(c.pointerId), J.current = {
      pointerId: c.pointerId,
      startClientX: c.clientX,
      startClientY: c.clientY,
      startPanX: T.panX,
      startPanY: T.panY
    }, q(!0));
  }, Tt = (c) => {
    const u = J.current;
    if (!u || u.pointerId !== c.pointerId || !C || !M.current)
      return;
    const z = {
      panX: u.startPanX + (c.clientX - u.startClientX),
      panY: u.startPanY + (c.clientY - u.startClientY),
      zoom: T.zoom
    };
    Mt(z);
  }, ze = (c) => {
    const u = J.current;
    !u || u.pointerId !== c.pointerId || (J.current = null, q(!1), c.currentTarget.hasPointerCapture(c.pointerId) && c.currentTarget.releasePointerCapture(c.pointerId));
  }, Dt = (c) => {
    !k || !C || !M.current || (c.preventDefault(), c.stopPropagation(), F((u) => {
      const z = M.current;
      if (!z)
        return u;
      const U = V(z, f.width, f.height);
      if (!U)
        return u;
      const ee = Math.exp(-c.deltaY * 12e-4), re = ce(u.zoom * ee, U.minZoom, U.maxZoom), G = re / Math.max(u.zoom, 1e-4);
      return de(
        {
          panX: u.panX * G,
          panY: u.panY * G,
          zoom: re
        },
        U
      );
    }));
  }, zt = async () => {
    if (!k || !C || !M.current) {
      v("먼저 이미지를 선택해 주세요.");
      return;
    }
    const c = V(M.current, f.width, f.height);
    if (!c) {
      v("이미지 정보를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    A(!0), v(null);
    try {
      const u = await An(M.current, c, T), z = new File([u], "avatar.png", { type: "image/png" }), U = new FormData();
      U.append("avatar", z);
      const ee = await fetch(et("/api/mypage/avatar"), {
        body: U,
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      });
      if (ee.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!ee.ok)
        throw new Error("프로필 사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const re = await ee.json().catch(() => null), G = se(In(re));
      G && O(G);
      const $t = await e();
      !G && $t && O(null), E("profile");
    } catch (u) {
      v(u instanceof Error ? u.message : "프로필 사진 적용에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      A(!1);
    }
  }, Pt = async () => {
    const c = Nn(l);
    if (!Je(c)) {
      w(fe ?? "닉네임, 이메일, 휴대전화 정보를 확인해 주세요.");
      return;
    }
    g(!0), w(null);
    try {
      const u = await fetch(et("/api/mypage/profile"), {
        body: JSON.stringify(c),
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
      N(!1), E("profile");
    } catch (u) {
      w(u instanceof Error ? u.message : "프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      g(!1);
    }
  }, _t = I || !Je(l), D = k && C && M.current ? V(M.current, f.width, f.height) : null, Pe = D ? D.baseWidth * T.zoom : 0, _e = D ? D.baseHeight * T.zoom : 0, Lt = D ? D.stageWidth / 2 + T.panX - Pe / 2 : 0, Ut = D ? D.stageHeight / 2 + T.panY - _e / 2 : 0, Le = (D == null ? void 0 : D.circleDiameter) ?? 0, X = (D == null ? void 0 : D.circleRadius) ?? 0, Ot = {
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
  }, Bt = D ? {
    display: "block",
    height: `${_e}px`,
    left: `${Lt}px`,
    maxHeight: "none",
    maxWidth: "none",
    objectFit: "contain",
    pointerEvents: "none",
    position: "absolute",
    top: `${Ut}px`,
    userSelect: "none",
    width: `${Pe}px`
  } : {
    display: "block",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    width: "auto"
  }, Ue = D ? {
    background: "rgba(20, 24, 31, 0.14)",
    inset: 0,
    maskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, X - 2)}px, black ${Math.max(0, X - 1)}px, black 100%)`,
    WebkitMaskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, X - 2)}px, black ${Math.max(0, X - 1)}px, black 100%)`,
    pointerEvents: "none",
    position: "absolute"
  } : null, Oe = D ? {
    border: "2px dashed rgba(255, 255, 255, 0.94)",
    borderRadius: "50%",
    boxShadow: "0 0 0 1px rgba(17, 24, 39, 0.14)",
    height: `${Le}px`,
    left: `calc(50% - ${X}px)`,
    pointerEvents: "none",
    position: "absolute",
    top: `calc(50% - ${X}px)`,
    width: `${Le}px`
  } : null;
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ s.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ s.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ s.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ s.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ s.jsxs(Z, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ s.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ s.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ s.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: kt, children: "내 정보 수정" })
          ] }),
          /* @__PURE__ */ s.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ s.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "label", children: "닉네임" }),
              /* @__PURE__ */ s.jsx("strong", { className: "value", style: r.nickname ? void 0 : { color: "#9ca3af" }, children: (Ke = r.nickname) != null && Ke.trim() ? r.nickname : "설정하지 않음" })
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
        /* @__PURE__ */ s.jsxs(Z, { className: "passport-info-box meta-glass-theme", children: [
          /* @__PURE__ */ s.jsx("div", { className: "box-head", children: /* @__PURE__ */ s.jsx("h3", { children: "패스포트 정보" }) }),
          /* @__PURE__ */ s.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ s.jsx(
              "div",
              {
                className: "passport-visual soft-radius",
                style: i ? void 0 : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" },
                children: /* @__PURE__ */ s.jsxs("div", { className: "pass-meta", children: [
                  /* @__PURE__ */ s.jsx("span", { className: "pass-num", children: (i == null ? void 0 : i.number) ?? "미등록" }),
                  /* @__PURE__ */ s.jsx("span", { className: "pass-country", children: (i == null ? void 0 : i.issuingCountry) ?? "해외 여행 전에 여권 정보를 등록해 주세요." })
                ] })
              }
            ),
            /* @__PURE__ */ s.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ s.jsx("span", { className: "label", children: i ? "여권 만료일" : "등록 상태" }),
              /* @__PURE__ */ s.jsx("strong", { className: "value", children: (i == null ? void 0 : i.expiryDate) ?? "등록 필요" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ s.jsxs(Z, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ s.jsx("div", { className: "box-head", children: /* @__PURE__ */ s.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ s.jsx("div", { className: "benefit-tiles", children: a.slice(0, 2).map((c) => /* @__PURE__ */ s.jsxs("div", { className: `benefit-tile tone-${c.tone} soft-radius`, children: [
            /* @__PURE__ */ s.jsx("span", { className: "benefit-label", children: c.label }),
            /* @__PURE__ */ s.jsx("strong", { className: "benefit-value", style: En(c.tone), children: c.value }),
            /* @__PURE__ */ s.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, c.label)) })
        ] })
      ] })
    ] }),
    h ? /* @__PURE__ */ s.jsx("div", { className: "meta-modal-overlay", onClick: Re, children: /* @__PURE__ */ s.jsx(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (c) => c.stopPropagation(),
        style: { padding: "36px" },
        children: y === "profile" ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("header", { className: "modal-header", children: /* @__PURE__ */ s.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ s.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ s.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
            /* @__PURE__ */ s.jsx("span", { style: { color: "#6b7280", fontSize: "13px", fontWeight: 700, lineHeight: 1.4 }, children: "공용 프로필 미리보기 - 눌러서 이미지 변경" }),
            /* @__PURE__ */ s.jsxs(
              "div",
              {
                className: "profile-link-preview soft-radius",
                role: "button",
                tabIndex: 0,
                onClick: Te,
                onKeyDown: (c) => {
                  (c.key === "Enter" || c.key === " ") && (c.preventDefault(), Te());
                },
                children: [
                  /* @__PURE__ */ s.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", style: { position: "relative" }, children: [
                    /* @__PURE__ */ s.jsx("span", { style: bn, children: he ? /* @__PURE__ */ s.jsx("img", { alt: "", className: "profile-link-preview-image", src: he, style: vn }) : /* @__PURE__ */ s.jsx("span", { style: jn, children: wt }) }),
                    /* @__PURE__ */ s.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                  ] }),
                  /* @__PURE__ */ s.jsxs("div", { className: "profile-link-copy", children: [
                    /* @__PURE__ */ s.jsx("strong", { children: At }),
                    /* @__PURE__ */ s.jsx("span", { children: It })
                  ] })
                ]
              }
            )
          ] }),
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
                      /* @__PURE__ */ s.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "한 줄 소개" }),
                      /* @__PURE__ */ s.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ s.jsx(
                        "input",
                        {
                          className: "id-input",
                          maxLength: St,
                          type: "text",
                          value: l.bio,
                          onChange: (c) => x((u) => ({
                            ...u,
                            bio: le(c.target.value)
                          })),
                          placeholder: "한 줄 소개를 입력해 주세요",
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
                      /* @__PURE__ */ s.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "닉네임" }),
                      /* @__PURE__ */ s.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ s.jsx(
                        "input",
                        {
                          className: "id-input",
                          type: "text",
                          value: l.nickname,
                          onChange: (c) => x((u) => ({ ...u, nickname: c.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) }),
                      fe ? /* @__PURE__ */ s.jsx("div", { style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, lineHeight: 1.4 }, children: fe }) : null
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
                          value: l.email,
                          onChange: (c) => x((u) => ({ ...u, email: c.target.value })),
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
                          value: l.phone,
                          onChange: (c) => x((u) => ({ ...u, phone: c.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) })
                    ]
                  }
                )
              ]
            }
          ),
          S ? /* @__PURE__ */ s.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: S }) : null,
          I ? /* @__PURE__ */ s.jsx("div", { "aria-live": "polite", role: "status", style: { color: "#4b5563", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: "저장 중..." }) : null,
          /* @__PURE__ */ s.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ s.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: Re, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ s.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: Pt,
                disabled: _t,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
          /* @__PURE__ */ s.jsx("header", { className: "modal-header", children: /* @__PURE__ */ s.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ s.jsx("h3", { children: "프로필 사진 편집" }) }) }),
          /* @__PURE__ */ s.jsx("input", { ref: Q, accept: "image/*", hidden: !0, type: "file", onChange: Ct }),
          /* @__PURE__ */ s.jsx("div", { className: "profile-avatar-editor soft-radius", children: /* @__PURE__ */ s.jsx("div", { className: "profile-avatar-editor-preview", children: /* @__PURE__ */ s.jsx(
            "div",
            {
              ref: _,
              onPointerCancel: ze,
              onPointerDown: Rt,
              onPointerMove: Tt,
              onPointerUp: ze,
              onWheel: Dt,
              style: {
                ...Ot,
                cursor: k ? ae ? "grabbing" : "grab" : "default"
              },
              children: k ? /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
                /* @__PURE__ */ s.jsx(
                  "img",
                  {
                    ref: M,
                    alt: "프로필 사진 편집 미리보기",
                    draggable: !1,
                    src: k,
                    style: Bt,
                    onLoad: Et
                  }
                ),
                Ue ? /* @__PURE__ */ s.jsx("div", { style: Ue }) : null,
                Oe ? /* @__PURE__ */ s.jsx("div", { style: Oe }) : null
              ] }) : /* @__PURE__ */ s.jsx(
                "button",
                {
                  className: "profile-avatar-editor-empty",
                  type: "button",
                  onClick: De,
                  children: "사진 선택"
                }
              )
            }
          ) }) }),
          k ? /* @__PURE__ */ s.jsx("div", { style: { display: "flex", justifyContent: "center", marginTop: "-4px" }, children: /* @__PURE__ */ s.jsx(
            "button",
            {
              type: "button",
              onClick: De,
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
          j ? /* @__PURE__ */ s.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: j }) : null,
          /* @__PURE__ */ s.jsxs("footer", { className: "modal-footer", style: { marginTop: "10px", gap: "14px" }, children: [
            /* @__PURE__ */ s.jsx(
              "button",
              {
                className: "cancel-btn pill-shape",
                type: "button",
                onClick: () => {
                  E("profile"), v(null);
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
                onClick: zt,
                disabled: !k || !C || R,
                style: { padding: "18px 0", fontSize: "15px" },
                children: R ? "적용 중..." : "적용"
              }
            )
          ] })
        ] })
      }
    ) }) : null
  ] });
}, Cn = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"]
}, Mn = () => typeof document > "u" ? !1 : Array.from(document.querySelectorAll("link[href], script[src]")).some((e) => (e.getAttribute("href") ?? e.getAttribute("src") ?? "").includes("/front-mirror/")), tt = (e, t = !1) => {
  const n = e === "qna" ? "qna" : e === "notice" ? "notice" : "faq", [a, i] = Cn[n];
  return t ? i : a;
}, Rn = () => {
  const { state: e } = ne(), t = e.supportItems ?? [], [n] = d.useState(Mn), [a, i] = d.useState({});
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
          onError: (o) => {
            a[r.id] || n || (i((l) => ({
              ...l,
              [r.id]: !0
            })), o.currentTarget.src = tt(r.id, !0));
          },
          src: tt(r.id, n || a[r.id] === !0)
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
}, Tn = () => /* @__PURE__ */ s.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ s.jsx(Qs, {}),
  /* @__PURE__ */ s.jsx(sn, {}),
  /* @__PURE__ */ s.jsx(fn, {}),
  /* @__PURE__ */ s.jsx(kn, {}),
  /* @__PURE__ */ s.jsx(Rn, {})
] }), Pn = () => /* @__PURE__ */ s.jsx(Xs, { children: /* @__PURE__ */ s.jsx(Tn, {}) });
export {
  Pn as M
};
