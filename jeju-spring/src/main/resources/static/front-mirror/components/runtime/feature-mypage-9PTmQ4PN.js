import { a as c, j as n } from "./react-vendor-BoSfm_Te.js";
import { A as ie } from "./legacy-core-CYHwlLlr.js";
const on = /^[a-zA-Z][a-zA-Z\d+\-.]*:/, Re = {
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
}, gt = [
  { label: "보유 포인트", tone: "point", value: "0P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "0장" },
  { label: "다가오는 여행", tone: "air", value: "0건" }
], xt = [
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
], yt = {
  id: "",
  isMember: !1,
  name: ""
}, ln = {
  checked: !1,
  id: "",
  label: "",
  ownerId: "",
  ownerName: "",
  status: "reserved",
  type: "voucher"
}, cn = {
  activities: [],
  companions: [],
  date: "",
  googleMapUrl: "",
  id: "",
  time: "",
  title: ""
}, dn = [], mn = [], V = (e) => {
  const t = u(e);
  if (t)
    return t.startsWith("data:") || t.startsWith("blob:") || t.startsWith("//") || on.test(t) ? t : `${ie}${t}`;
};
function vt({
  currentAccountId: e,
  linkedCompanions: t,
  travelEvents: s
}) {
  const r = new Map(t.map((o) => [o.id, o])), a = /* @__PURE__ */ new Set([
    ...e ? [e] : [],
    ...t.map((o) => o.id)
  ]), i = /* @__PURE__ */ new Map();
  for (const o of s) {
    if (a.size > 0 && !a.has(o.ownerId))
      continue;
    const l = i.get(o.dayId), f = {
      checked: o.status === "used",
      id: o.id,
      label: o.activityLabel,
      ownerId: o.ownerId,
      ownerName: o.ownerName,
      status: o.status,
      type: o.type
    };
    if (l) {
      if (l.activities.push(f), o.ownerId !== e && r.has(o.ownerId)) {
        const b = r.get(o.ownerId);
        b && !l.companions.some((N) => N.id === b.id) && l.companions.push({ ...b });
      }
      continue;
    }
    i.set(o.dayId, {
      activities: [f],
      companions: o.ownerId !== e && r.has(o.ownerId) ? [{ ...r.get(o.ownerId) }] : [],
      date: o.date,
      googleMapUrl: o.googleMapUrl,
      id: o.dayId,
      sortKey: `${o.date} ${o.time}`,
      time: o.time,
      title: o.title
    });
  }
  return Array.from(i.values()).sort((o, l) => o.sortKey.localeCompare(l.sortKey)).map(({ sortKey: o, ...l }) => l);
}
const Q = St(Re), _e = ve(gt), un = wt(xt), De = ze(dn), Le = Ue(mn), bt = vt({
  currentAccountId: Re.id ?? "",
  linkedCompanions: De,
  travelEvents: Le
}), jt = [
  { count: 0, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], Nt = () => ({
  bookings: wt(xt),
  itinerary: It(bt),
  linkedCompanions: ze(De),
  profile: St(Re),
  stats: ve(gt),
  supportItems: At(jt),
  travelEvents: Ue(Le)
}), pe = (e) => {
  const t = Nt(), s = bn(e);
  if (!Dn(s))
    return t;
  const a = jn(s, t.profile), i = Cn(s.linkedCompanions, t.linkedCompanions), o = Mn(s.travelEvents, t.travelEvents), l = s.travelEvents !== void 0 ? vt({
    currentAccountId: a.id ?? t.profile.id ?? "",
    linkedCompanions: i,
    travelEvents: o
  }) : En(s.itinerary, t.itinerary);
  return {
    bookings: An(s.bookings, t.bookings),
    itinerary: l,
    linkedCompanions: i,
    profile: a,
    stats: wn(s.stats ?? s, t.stats),
    supportItems: kn(s.supportItems ?? s.support ?? s.inquiries, t.supportItems),
    travelEvents: o
  };
}, he = (e) => {
  pn(Q, e.profile), hn(_e, e.stats), fn(un, e.bookings), gn(bt, e.itinerary), xn(De, e.linkedCompanions), yn(jt, e.supportItems), vn(Le, e.travelEvents);
};
function St(e) {
  return {
    avatarUrl: e.avatarUrl,
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function ve(e) {
  return e.map((t) => ({ ...t }));
}
function wt(e) {
  return e.map((t) => ({
    ...t,
    tags: [...t.tags]
  }));
}
function ze(e) {
  return e.map((t) => ({ ...t }));
}
function It(e) {
  return e.map((t) => ({
    ...t,
    activities: t.activities.map((s) => ({ ...s })),
    companions: t.companions.map((s) => ({ ...s }))
  }));
}
function At(e) {
  return e.map((t) => ({ ...t }));
}
function Ue(e) {
  return e.map((t) => ({ ...t }));
}
const pn = (e, t) => {
  if (e.avatarUrl = t.avatarUrl, e.bio = t.bio, e.email = t.email, e.memberships.splice(0, e.memberships.length, ...t.memberships), e.name = t.name, e.nickname = t.nickname, e.phone = t.phone, e.tier = t.tier, e.role = t.role, e.id = t.id, t.passport) {
    e.passport = { ...t.passport };
    return;
  }
  delete e.passport;
}, hn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, fn = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((s) => ({
      ...s,
      tags: [...s.tags]
    }))
  );
}, gn = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((s) => ({
      ...s,
      activities: s.activities.map((r) => ({ ...r })),
      companions: s.companions.map((r) => ({ ...r }))
    }))
  );
}, xn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, yn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, vn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, bn = (e) => {
  const t = {}, s = (r) => {
    F(r) && Object.assign(t, r);
  };
  return s(e), F(e) && (s(e.user), s(e.member), s(e.profile), s(e.data), s(e.session)), t;
}, jn = (e, t) => {
  const s = Nn(e.memberships, e.tier ?? e.role), r = Sn(e.passport), a = u(e.tier) ?? s[0] ?? u(e.role), i = u(e.id) ?? u(e.memberId) ?? u(e.userId), o = u(e.name) ?? u(e.displayName) ?? u(e.fullName) ?? u(e.nickname) ?? u(e.id) ?? u(e.memberId) ?? u(e.userId) ?? t.name, l = u(e.nickname), f = Kn(
    K(e, "bio") ?? K(e, "intro") ?? K(e.profile, "bio") ?? K(e.profile, "intro") ?? K(e.user, "bio") ?? K(e.user, "intro") ?? K(e.member, "bio") ?? K(e.member, "intro") ?? K(e.data, "bio") ?? K(e.data, "intro") ?? t.bio
  );
  return {
    avatarUrl: V(e.avatarUrl),
    bio: f,
    email: u(e.email) ?? Rn(e, i, o) ?? t.email,
    id: i ?? t.id,
    memberships: s,
    name: o,
    nickname: l,
    passport: r,
    phone: u(e.phone) ?? u(e.mobile) ?? "미등록",
    role: u(e.role),
    tier: a
  };
}, Nn = (e, t) => {
  const s = Array.isArray(e) ? e.map((a) => u(a)).filter((a) => !!a) : [];
  if (s.length > 0)
    return s;
  const r = u(t);
  return r ? [r] : [];
}, Sn = (e) => {
  const t = F(e) ? e : null;
  if (!t)
    return;
  const s = {
    expiryDate: u(t == null ? void 0 : t.expiryDate) ?? "",
    issuingCountry: u(t == null ? void 0 : t.issuingCountry) ?? "",
    number: u(t == null ? void 0 : t.number) ?? ""
  };
  if (!(!s.expiryDate && !s.issuingCountry && !s.number))
    return s;
}, wn = (e, t) => Array.isArray(e) && e.length > 0 ? t.map((s, r) => In(e[r], s, !0)) : Array.isArray(e) && e.length === 0 ? ve(t) : F(e) ? Tn(e, t) : ve(t), In = (e, t, s = !1) => {
  const r = F(e) ? e : {}, a = Vn(r.tone) ? r.tone : t.tone, i = u(r.label) ?? t.label, o = r.value ?? t.value;
  return {
    label: i,
    tone: a,
    value: ke(o, t)
  };
}, ke = (e, t) => {
  const s = u(e);
  if (!s)
    return t.value;
  if (!/^\d+(?:\.\d+)?$/.test(s))
    return s;
  const r = Number(s);
  if (!Number.isFinite(r))
    return s;
  const a = r.toLocaleString("ko-KR");
  switch (t.tone) {
    case "coupon":
      return `${a}장`;
    case "point":
      return `${a}P`;
    case "air":
      return `${a}건`;
    default:
      return s;
  }
}, An = (e, t) => Array.isArray(e) ? e.length === 0 ? [] : e.map((s, r) => Ln(s, t[r % t.length] ?? t[0], !0)) : [], En = (e, t) => !Array.isArray(e) || e.length === 0 ? It(t) : e.map(
  (s, r) => zn(
    s,
    t.length > 0 ? t[r % t.length] ?? t[0] : cn
  )
), kn = (e, t) => !Array.isArray(e) || e.length === 0 ? At(t) : e.map((s, r) => $n(s, t[r % t.length] ?? t[0])), Cn = (e, t) => !Array.isArray(e) || e.length === 0 ? ze(t) : e.map(
  (s, r) => Bn(
    s,
    t.length > 0 ? t[r % t.length] ?? t[0] : yt
  )
), Et = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => Fn(t)).filter((t) => t !== null), Mn = (e, t) => {
  const s = Et(e);
  return s.length > 0 ? s : Ue(t);
}, Tn = (e, t) => t.map((s) => {
  const r = Hn(e, Wn(s.tone));
  return r === void 0 ? { ...s } : {
    ...s,
    value: ke(r, s)
  };
}), Rn = (e, t, s) => {
  const r = t ?? u(e.memberId) ?? u(e.userId) ?? u(e.username) ?? u(e.loginId) ?? _n(s);
  if (r)
    return `${r}@jejugroup.example`;
}, _n = (e) => {
  const s = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return s.length > 0 ? s : void 0;
}, Dn = (e) => [
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
].some((s) => s in e), Ln = (e, t, s = !1) => {
  const r = F(e) ? e : {}, a = Array.isArray(r.tags) ? r.tags.map((o) => u(o)).filter((o) => !!o) : [], i = Pe(r.type) ? r.type : t.type;
  return {
    amount: u(r.amount) ?? (s ? "" : t.amount),
    date: u(r.date) ?? (s ? "" : t.date),
    duration: u(r.duration) ?? (s ? void 0 : t.duration),
    id: u(r.id) ?? (s ? "" : t.id),
    paymentMethod: u(r.paymentMethod) ?? (s ? void 0 : t.paymentMethod),
    status: u(r.status) ?? (s ? "" : t.status),
    tags: a.length > 0 ? a : s ? [] : [...t.tags],
    title: u(r.title) ?? (s ? "" : t.title),
    type: i,
    voucherUrl: u(r.voucherUrl) ?? (s ? void 0 : t.voucherUrl)
  };
}, zn = (e, t) => {
  const s = F(e) ? e : {}, r = Array.isArray(s.activities) ? s.activities.map(
    (i, o) => Un(
      i,
      t.activities.length > 0 ? t.activities[o % t.activities.length] ?? t.activities[0] : ln
    )
  ) : t.activities.map((i) => ({ ...i })), a = Array.isArray(s.companions) ? s.companions.map(
    (i, o) => Pn(
      i,
      t.companions.length > 0 ? t.companions[o % t.companions.length] ?? t.companions[0] : yt
    )
  ) : t.companions.map((i) => ({ ...i }));
  return {
    activities: r,
    companions: a,
    date: u(s.date) ?? t.date,
    googleMapUrl: u(s.googleMapUrl) ?? t.googleMapUrl,
    id: u(s.id) ?? t.id,
    time: u(s.time) ?? t.time,
    title: u(s.title) ?? t.title
  };
}, Un = (e, t) => {
  const s = F(e) ? e : {};
  return {
    checked: typeof s.checked == "boolean" ? s.checked : Ce(s.status) ? s.status === "used" : t.checked,
    id: u(s.id) ?? t.id,
    label: u(s.label) ?? t.label,
    ownerId: u(s.ownerId) ?? t.ownerId,
    ownerName: u(s.ownerName) ?? t.ownerName,
    status: Ce(s.status) ? s.status : t.status,
    type: Pe(s.type) ? s.type : t.type
  };
}, Pn = (e, t) => {
  const s = F(e) ? e : {};
  return {
    avatarUrl: V(s.avatarUrl) ?? t.avatarUrl,
    bio: u(s.bio) ?? t.bio,
    id: u(s.id) ?? t.id,
    isMember: typeof s.isMember == "boolean" ? s.isMember : t.isMember,
    name: u(s.name) ?? t.name
  };
}, $n = (e, t) => {
  const s = F(e) ? e : {};
  return {
    count: On(s.count, t.count),
    href: u(s.href) ?? t.href,
    id: u(s.id) ?? t.id,
    label: u(s.label) ?? t.label
  };
}, On = (e, t) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const s = u(e);
  if (!s)
    return t;
  const r = Number(s);
  return Number.isFinite(r) ? r : t;
}, Bn = (e, t) => {
  const s = F(e) ? e : {};
  return {
    avatarUrl: V(s.avatarUrl) ?? t.avatarUrl,
    bio: u(s.bio) ?? t.bio,
    id: u(s.id) ?? t.id,
    isMember: typeof s.isMember == "boolean" ? s.isMember : t.isMember,
    name: u(s.name) ?? t.name
  };
}, Fn = (e) => {
  const t = F(e) ? e : null;
  if (!t)
    return null;
  const s = u(t.id), r = u(t.dayId), a = u(t.title), i = u(t.date), o = u(t.time), l = u(t.activityLabel), f = u(t.ownerId), b = u(t.ownerName), N = u(t.googleMapUrl);
  return !s || !r || !a || !i || !o || !l || !f || !b || !N ? null : {
    activityLabel: l,
    date: i,
    dayId: r,
    googleMapUrl: N,
    id: s,
    ownerId: f,
    ownerName: b,
    status: Ce(t.status) ? t.status : "reserved",
    time: o,
    title: a,
    type: Pe(t.type) ? t.type : "voucher"
  };
}, Wn = (e) => {
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
}, Hn = (e, t) => {
  for (const s of t)
    if (s in e) {
      const r = e[s];
      if (r != null)
        return Array.isArray(r) ? r.length : r;
    }
}, F = (e) => e !== null && typeof e == "object" && !Array.isArray(e), u = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, K = (e, t) => {
  if (F(e))
    return u(e[t]);
}, Kn = (e) => Array.from((e ?? "").trim()).slice(0, 20).join(""), Pe = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", Ce = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", Vn = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", Me = "jeju:mypage-dashboard-mock-updated", kt = "jeju:mypage-dashboard:", Yn = ["id", "memberId", "userId", "email", "loginId", "username"], Ct = ["user", "member", "profile", "data", "session"], G = (e) => e !== null && typeof e == "object" && !Array.isArray(e), qn = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, Gn = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), Xn = (e) => {
  const t = [];
  if (!G(e))
    return t;
  t.push(e);
  for (const s of Ct) {
    const r = e[s];
    G(r) && t.push(r);
  }
  return t;
}, Mt = (e) => {
  const t = Xn(e);
  for (const s of t)
    for (const r of Yn) {
      const a = qn(s[r]);
      if (!a)
        continue;
      const i = Gn(a);
      if (i)
        return i;
    }
  return null;
}, Tt = (e) => `${kt}${e}`, Zn = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return G(t) ? t : null;
  } catch {
    return null;
  }
}, Qn = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(Me, {
      detail: { accountKey: e }
    })
  );
}, Rt = (e) => {
  const t = Mt(e);
  return t ? _t(t) : null;
}, _t = (e) => {
  try {
    return Zn(localStorage.getItem(Tt(e)));
  } catch {
    return null;
  }
}, me = (e, t) => {
  const s = G(e) ? e : {}, r = G(t) ? t : {};
  if (Object.keys(s).length === 0 && Object.keys(r).length === 0)
    return null;
  const a = {
    ...s,
    ...r
  };
  for (const i of Ct) {
    const o = s[i], l = r[i];
    (G(o) || G(l)) && (a[i] = {
      ...G(o) ? o : {},
      ...G(l) ? l : {}
    });
  }
  return a;
}, Jn = (e, t) => {
  const s = Mt(e);
  if (!s)
    return !1;
  try {
    return localStorage.setItem(Tt(s), JSON.stringify(t)), Qn(s), !0;
  } catch {
    return !1;
  }
}, es = (e, t) => {
  const s = me(Rt(e), t);
  return s ? Jn(e, s) : !1;
}, ts = "userSession", et = "jeju:session-updated", ns = "/api/auth/session", ss = "/api/mypage/dashboard", rs = () => {
  const e = Nt();
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
}, as = (e, t) => {
  switch (t.type) {
    case "HYDRATE_DASHBOARD":
      return {
        ...e,
        bookings: t.payload.bookings.map((s) => ({
          ...s,
          tags: [...s.tags]
        })),
        itinerary: t.payload.itinerary.map((s) => ({
          ...s,
          activities: s.activities.map((r) => ({ ...r })),
          companions: s.companions.map((r) => ({ ...r }))
        })),
        linkedCompanions: t.payload.linkedCompanions.map((s) => ({ ...s })),
        profile: {
          ...t.payload.profile,
          memberships: [...t.payload.profile.memberships],
          passport: t.payload.profile.passport ? { ...t.payload.profile.passport } : void 0
        },
        stats: t.payload.stats.map((s) => ({ ...s })),
        supportItems: t.payload.supportItems.map((s) => ({ ...s })),
        travelEvents: t.payload.travelEvents.map((s) => ({ ...s }))
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
        linkedCompanions: t.payload.map((s) => ({ ...s }))
      };
    case "SET_FILTER":
      return { ...e, filter: t.payload };
    default:
      return e;
  }
}, Dt = c.createContext(null), Lt = (e) => `${ie}${e}`, is = (e) => e !== null && typeof e == "object" && !Array.isArray(e), os = async () => {
  try {
    const e = await fetch(Lt(ns), {
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
}, ls = async () => {
  try {
    const e = await fetch(Lt(ss), {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    if (e.status === 401 || !e.ok)
      return null;
    const t = await e.json();
    return !is(t) || t.success !== !0 || !("dashboard" in t) ? null : t.dashboard ?? null;
  } catch {
    return null;
  }
}, cs = async () => await os(), ds = async (e) => {
  if (!e)
    return null;
  const t = await ls();
  return t ? me(e, t) : e;
}, tt = async () => {
  const e = await cs();
  if (!e)
    return null;
  const t = await ds(e);
  return hs(t);
}, ms = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), us = (e, t) => ({
  ...e,
  ...t,
  memberships: t.memberships ? [...t.memberships] : [...e.memberships],
  passport: t.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : t.passport ? { ...t.passport } : void 0
}), ps = (e, t) => {
  if (t.length === 0)
    return [];
  const s = new Map(e.map((r) => [r.id, r]));
  return t.map((r) => {
    const a = s.get(r.id);
    return a ? {
      ...a,
      ...r,
      avatarUrl: r.avatarUrl ?? a.avatarUrl,
      bio: r.bio ?? a.bio,
      relationState: r.relationState ?? a.relationState
    } : { ...r };
  });
}, hs = (e) => {
  const t = pe(e), s = me(e, Rt(e)), r = pe(s), a = ps(r.linkedCompanions, t.linkedCompanions);
  if (a.length === 0)
    return pe(
      me(s, {
        linkedCompanions: []
      })
    );
  const i = [
    ...r.travelEvents,
    ...a.flatMap((o) => {
      const l = _t(o.id);
      return !l || !("travelEvents" in l) ? [] : Et(l.travelEvents).map((f) => ({
        ...f,
        ownerId: f.ownerId || o.id,
        ownerName: f.ownerName || o.name
      }));
    })
  ];
  return pe(
    me(s, {
      linkedCompanions: a,
      travelEvents: i
    })
  );
}, fs = ({ children: e }) => {
  const [t, s] = c.useReducer(as, void 0, rs), [r, a] = c.useState(!1), [i, o] = c.useState(!1), l = (d) => {
    he(d), s({ type: "HYDRATE_DASHBOARD", payload: d });
  }, f = (d) => {
    d.type === "HYDRATE_DASHBOARD" ? he(d.payload) : d.type === "PATCH_PROFILE" && he({
      bookings: t.bookings,
      itinerary: t.itinerary,
      linkedCompanions: t.linkedCompanions,
      profile: us(t.profile, d.payload),
      stats: t.stats,
      supportItems: t.supportItems,
      travelEvents: t.travelEvents
    }), s(d);
  }, b = async () => {
    const d = await tt();
    return d ? (l(d), !0) : !1;
  };
  c.useEffect(() => {
    he(ms(t));
  }, [t.bookings, t.itinerary, t.linkedCompanions, t.profile, t.stats, t.supportItems, t.travelEvents]), c.useEffect(() => {
    let d = !0, A = !1;
    const C = async () => {
      const p = await tt();
      if (!p) {
        if (!d)
          return;
        o(!1), a(!0);
        return;
      }
      d && (o(!0), a(!0), l(p));
    }, g = () => {
      A || (A = !0, C().finally(() => {
        A = !1;
      }));
    };
    g();
    const y = (p) => {
      var k;
      if (p.key === ts) {
        g();
        return;
      }
      (k = p.key) != null && k.startsWith(kt) && g();
    }, S = () => {
      g();
    }, j = () => {
      g();
    };
    return window.addEventListener("storage", y), window.addEventListener(et, S), window.addEventListener(Me, j), () => {
      d = !1, window.removeEventListener("storage", y), window.removeEventListener(et, S), window.removeEventListener(Me, j);
    };
  }, [s]);
  const N = c.useMemo(
    () => ({
      dispatch: f,
      refreshDashboard: b,
      state: t
    }),
    [f, b, t]
  );
  return !r || !i ? /* @__PURE__ */ n.jsxs("div", { className: "mypage-auth-empty-state soft-radius", role: "status", "aria-live": "polite", children: [
    /* @__PURE__ */ n.jsx("div", { className: "mypage-auth-empty-icon", "aria-hidden": "true", children: /* @__PURE__ */ n.jsxs("svg", { viewBox: "0 0 24 24", focusable: "false", "aria-hidden": "true", children: [
      /* @__PURE__ */ n.jsx(
        "path",
        {
          d: "M12 3.75 21 19.5a1.2 1.2 0 0 1-1.04 1.8H4.04A1.2 1.2 0 0 1 3 19.5L12 3.75Z",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.8",
          strokeLinejoin: "round"
        }
      ),
      /* @__PURE__ */ n.jsx("path", { d: "M12 9v5.25", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" }),
      /* @__PURE__ */ n.jsx("circle", { cx: "12", cy: "17.25", r: "1.1", fill: "currentColor" })
    ] }) }),
    /* @__PURE__ */ n.jsx("p", { className: "mypage-auth-empty-text", children: "로그인을 해주세요." })
  ] }) : /* @__PURE__ */ n.jsx(Dt.Provider, { value: N, children: e });
}, oe = () => {
  const e = c.useContext(Dt);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, nt = "/api/mypage/companion-invites", gs = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "expired"
], xs = ["sent", "received"], ne = (e) => e !== null && typeof e == "object" && !Array.isArray(e), de = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, ee = (e) => de(e) ?? void 0, st = (e) => {
  var r;
  const t = e.startsWith("/") ? e : `/${e}`, s = (r = ie) == null ? void 0 : r.trim();
  return s ? new URL(t, s).toString() : t;
}, ys = (e) => {
  if (typeof e != "string")
    return "pending";
  const t = e.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return gs.includes(t) ? t : "pending";
}, vs = (e) => {
  if (typeof e != "string")
    return "received";
  const t = e.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return xs.includes(t) ? t : "received";
}, bs = (e, t) => {
  if (ne(e)) {
    const s = e.message ?? e.error;
    if (typeof s == "string" && s.trim())
      return s;
  }
  return t;
}, js = (e) => {
  if (Array.isArray(e))
    return e;
  if (!ne(e))
    return [];
  const t = ["invites", "items", "results", "data"];
  for (const s of t) {
    const r = e[s];
    if (Array.isArray(r))
      return r;
    if (ne(r) && Array.isArray(r.items))
      return r.items;
    if (ne(r) && Array.isArray(r.results))
      return r.results;
  }
  return Array.isArray(e.data) ? e.data : [];
}, Ns = (e) => {
  if (!ne(e))
    return null;
  const t = typeof e.id == "number" && Number.isFinite(e.id) ? e.id : Number(e.id), s = de(e.senderUserId ?? e.sender_user_id ?? e.senderId ?? e.sender_id), r = de(e.receiverUserId ?? e.receiver_user_id ?? e.receiverId ?? e.receiver_id), a = de(e.senderName ?? e.sender_name ?? e.senderDisplayName ?? e.senderDisplayName), i = de(e.receiverName ?? e.receiver_name ?? e.receiverDisplayName ?? e.receiverDisplayName);
  return !Number.isFinite(t) || !s || !r || !a || !i ? null : {
    createdAt: ee(e.createdAt ?? e.created_at),
    direction: vs(e.direction ?? e.inviteDirection ?? e.invite_direction),
    expiresAt: ee(e.expiresAt ?? e.expires_at),
    id: t,
    receiverAvatarUrl: ee(e.receiverAvatarUrl ?? e.receiver_avatar_url),
    receiverBio: ee(e.receiverBio ?? e.receiver_bio),
    receiverName: i,
    receiverUserId: r,
    respondedAt: ee(e.respondedAt ?? e.responded_at),
    senderAvatarUrl: ee(e.senderAvatarUrl ?? e.sender_avatar_url),
    senderBio: ee(e.senderBio ?? e.sender_bio),
    senderName: a,
    senderUserId: s,
    status: ys(e.status ?? e.inviteStatus ?? e.invite_status)
  };
}, rt = (e, t) => bs(e, t), Ss = (e = {}) => {
  const { enabled: t = !0 } = e, [s, r] = c.useState([]), [a, i] = c.useState(!1), [o, l] = c.useState(null), f = c.useRef(0), b = c.useMemo(
    () => s.filter((g) => g.direction === "received" && g.status === "pending"),
    [s]
  ), N = c.useCallback(async () => {
    const g = ++f.current;
    i(!0), l(null);
    try {
      const y = await fetch(st(nt), {
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "GET"
      }), S = await y.json().catch(() => null);
      if (y.status === 401)
        throw new Error("로그인이 필요합니다.");
      if (!y.ok || ne(S) && S.success === !1)
        throw new Error(rt(S, "동행 초대를 불러오지 못했다"));
      const j = js(S).map(Ns).filter((p) => p !== null);
      return g !== f.current || r(j), j;
    } catch (y) {
      return g !== f.current ? [] : (r([]), l({
        message: y instanceof Error && y.message.trim() ? y.message : "동행 초대를 불러오지 못했다"
      }), []);
    } finally {
      g === f.current && i(!1);
    }
  }, []);
  c.useEffect(() => {
    if (t)
      return N(), () => {
        f.current += 1;
      };
  }, [t, N]);
  const d = c.useCallback(
    async (g, y) => {
      const S = y === "accept" ? "accept" : "reject";
      l(null);
      try {
        const j = await fetch(st(`${nt}/${g}/${S}`), {
          credentials: "include",
          headers: {
            Accept: "application/json"
          },
          method: "POST"
        }), p = await j.json().catch(() => null);
        if (j.status === 401)
          throw new Error("로그인이 필요합니다.");
        if (!j.ok || ne(p) && p.success === !1)
          throw new Error(rt(p, "동행 초대를 처리하지 못했다"));
        return await N(), !0;
      } catch (j) {
        return l({
          message: j instanceof Error && j.message.trim() ? j.message : "동행 초대를 처리하지 못했다"
        }), !1;
      }
    },
    [N]
  ), A = c.useCallback(
    async (g) => d(g, "accept"),
    [d]
  ), C = c.useCallback(
    async (g) => d(g, "reject"),
    [d]
  );
  return {
    acceptInvite: A,
    errorObj: o,
    isLoading: a,
    pendingInviteCount: b.length,
    pendingReceivedInvites: b,
    refreshInvites: N,
    rejectInvite: C
  };
}, ws = (e, t) => {
  if (!e)
    return "00:00:00";
  const s = Date.parse(e);
  if (!Number.isFinite(s))
    return "00:00:00";
  const r = Math.max(0, s - t), a = Math.floor(r / 1e3), i = Math.floor(a / 3600), o = Math.floor(a % 3600 / 60), l = a % 60;
  return [i, o, l].map((f) => String(f).padStart(2, "0")).join(":");
}, Is = ({ invite: e }) => {
  const [t, s] = c.useState(!1), r = V(e.senderAvatarUrl), a = !!(r && !t);
  return c.useEffect(() => {
    s(!1);
  }, [r]), /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-avatar companion-avatar soft-radius is-linked", "aria-hidden": "true", children: [
    a ? /* @__PURE__ */ n.jsx(
      "img",
      {
        alt: "",
        className: "companion-invite-avatar-image",
        onError: () => s(!0),
        src: r
      }
    ) : /* @__PURE__ */ n.jsx("span", { className: "companion-invite-avatar-fallback", children: e.senderName.charAt(0) }),
    /* @__PURE__ */ n.jsx("i", { "data-lucide": "bell-ring", className: "lucide-bell-ring linked-indicator companion-invite-avatar-badge" })
  ] });
}, As = ({
  isOpen: e,
  onClose: t,
  onRefreshPendingCount: s
}) => {
  const { refreshDashboard: r } = oe(), {
    acceptInvite: a,
    errorObj: i,
    isLoading: o,
    pendingInviteCount: l,
    pendingReceivedInvites: f,
    rejectInvite: b
  } = Ss({ enabled: e }), [N, d] = c.useState(null), [A, C] = c.useState(() => Date.now());
  c.useEffect(() => {
    e && window.lucide && window.lucide.createIcons();
  }, [e, f, o, i, l]), c.useEffect(() => {
    const p = (k) => {
      k.key === "Escape" && e && t();
    };
    return window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p);
  }, [e, t]), c.useEffect(() => {
    if (!e || f.length === 0)
      return;
    C(Date.now());
    const p = window.setInterval(() => {
      C(Date.now());
    }, 1e3);
    return () => {
      window.clearInterval(p);
    };
  }, [e, f.length]);
  const g = c.useMemo(
    () => [...f].sort((p, k) => {
      const M = p.createdAt ?? p.expiresAt ?? "";
      return (k.createdAt ?? k.expiresAt ?? "").localeCompare(M);
    }),
    [f]
  );
  if (!e)
    return null;
  const y = async (p, k) => {
    if (N === null) {
      d(p);
      try {
        (k === "accept" ? await a(p) : await b(p)) && (await r(), await (s == null ? void 0 : s()));
      } finally {
        d(null);
      }
    }
  }, S = () => {
    t();
  }, j = (p) => {
    p.stopPropagation();
  };
  return /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay companion-invite-modal active", onClick: S, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ n.jsxs(
    "div",
    {
      className: "meta-modal-content companion-invite-modal-content soft-radius meta-glass-theme",
      onClick: j,
      children: [
        /* @__PURE__ */ n.jsxs("header", { className: "modal-header companion-invite-modal-header", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "header-title-wrap", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "bell", className: "lucide-bell" }),
            /* @__PURE__ */ n.jsx("h3", { children: "동행자 초대함" })
          ] }),
          /* @__PURE__ */ n.jsx("button", { className: "close-btn", type: "button", onClick: t, "aria-label": "닫기", children: "×" })
        ] }),
        /* @__PURE__ */ n.jsx("p", { className: "modal-desc companion-invite-modal-desc", children: "받은 동행자 초대를 확인하고 수락하거나 거절해라." }),
        /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-modal-body", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-summary", children: [
            /* @__PURE__ */ n.jsx("strong", { children: "받은 초대" }),
            /* @__PURE__ */ n.jsxs("span", { children: [
              l,
              "건"
            ] })
          ] }),
          /* @__PURE__ */ n.jsx("div", { className: "companion-invite-panel", children: i ? /* @__PURE__ */ n.jsxs("div", { className: "error-message companion-invite-error", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
            i.message
          ] }) : o ? /* @__PURE__ */ n.jsx("p", { className: "empty-list companion-invite-empty", children: "초대 목록을 불러오는 중이다." }) : g.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list companion-invite-empty", children: "받은 동행자 초대가 없다." }) : /* @__PURE__ */ n.jsx("div", { className: "companion-invite-list companion-list-scroll", children: g.map((p) => {
            var k;
            return /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-row list-item soft-radius", children: [
              /* @__PURE__ */ n.jsxs("div", { className: "item-info companion-invite-row-info", children: [
                /* @__PURE__ */ n.jsx(Is, { invite: p }),
                /* @__PURE__ */ n.jsxs("div", { className: "user-info name-meta companion-invite-copy", children: [
                  /* @__PURE__ */ n.jsxs(
                    "div",
                    {
                      style: {
                        alignItems: "center",
                        display: "flex",
                        gap: "10px",
                        justifyContent: "space-between",
                        width: "100%"
                      },
                      children: [
                        /* @__PURE__ */ n.jsx("strong", { children: p.senderName }),
                        /* @__PURE__ */ n.jsx(
                          "span",
                          {
                            style: {
                              color: "#ff5000",
                              flex: "0 0 auto",
                              fontSize: "12px",
                              fontWeight: 800,
                              lineHeight: 1
                            },
                            children: ws(p.expiresAt, A)
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ n.jsx("span", { children: ((k = p.senderBio) == null ? void 0 : k.trim()) || `@${p.senderUserId}` })
                ] })
              ] }),
              /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-actions", children: [
                /* @__PURE__ */ n.jsx(
                  "button",
                  {
                    className: "companion-invite-action companion-invite-reject",
                    type: "button",
                    onClick: () => void y(p.id, "reject"),
                    disabled: N !== null,
                    children: "거절"
                  }
                ),
                /* @__PURE__ */ n.jsx(
                  "button",
                  {
                    className: "companion-invite-action companion-invite-accept",
                    type: "button",
                    onClick: () => void y(p.id, "accept"),
                    disabled: N !== null,
                    children: "수락"
                  }
                )
              ] })
            ] }, p.id);
          }) }) })
        ] }),
        /* @__PURE__ */ n.jsx("footer", { className: "modal-footer companion-invite-modal-footer", children: /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: t, children: "닫기" }) })
      ]
    }
  ) });
}, ae = ({ children: e, className: t = "" }) => {
  const s = ["bento-box", "soft-radius", t].filter(Boolean).join(" ");
  return /* @__PURE__ */ n.jsx("div", { className: s, children: e });
}, we = "/api/mypage/companion-invites", zt = (e) => {
  const t = (e == null ? void 0 : e.trim().toLowerCase()) ?? "";
  return t.includes("diamond") || t.includes("다이아") ? "diamond" : t.includes("platinum") || t.includes("플래티넘") ? "platinum" : t.includes("silver") || t.includes("실버") ? "silver" : t.includes("gold") || t.includes("골드") ? "gold" : null;
}, Es = (e) => zt(e) ?? "neutral", ks = (e) => {
  switch (zt(e)) {
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
}, at = (e) => {
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
}, Ie = (e) => {
  const t = document.querySelector(e);
  if (!t)
    return;
  const s = t.querySelector(".section-title") ?? t, r = document.querySelector("#jeju-page-shell-header .header") ?? document.querySelector(".header"), a = (r == null ? void 0 : r.getBoundingClientRect().height) ?? 72, i = window.scrollY + s.getBoundingClientRect().top - a - 24;
  window.scrollTo({
    top: Math.max(0, i),
    behavior: "smooth"
  });
}, it = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Te = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, Cs = () => {
  var r;
  const e = (r = ie) == null ? void 0 : r.trim(), t = we.startsWith("/") ? we : `/${we}`, s = e ? new URL(t, e) : new URL(t, window.location.origin);
  return e ? s.toString() : `${s.pathname}${s.search}`;
}, Ms = (e) => {
  if (!it(e))
    return [];
  const t = [e.invites, e.items, e.results, e.data];
  for (const s of t)
    if (Array.isArray(s))
      return s.filter(it).map((r) => ({
        direction: Te(r.direction),
        status: Te(r.status ?? r.effectiveStatus)
      }));
  return [];
}, ot = (e) => {
  var s;
  const t = (s = Te(e)) == null ? void 0 : s.toLowerCase().replace(/[\s-]+/g, "_");
  if (t)
    return t === "received" ? "received" : t;
}, Ts = ({
  onOpenCompanionInvites: e,
  pendingInviteCount: t
} = {}) => {
  var U, z, R, T;
  const { state: s } = oe(), r = s.profile ?? Q, a = (U = s.stats) != null && U.length ? s.stats : _e, i = ((z = r.memberships) == null ? void 0 : z[0]) ?? Q.memberships[0], o = r.tier ?? i, l = Es(o), f = ks(o), b = ((R = r.nickname) == null ? void 0 : R.trim()) || r.name.trim(), [N, d] = c.useState(0), [A, C] = c.useState(!1), g = t ?? N, y = g > 0, S = V(r.avatarUrl) ?? `https://api.dicebear.com/7.x/notionists/svg?seed=${r.name}&backgroundColor=f8f9fa`;
  c.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []);
  const j = c.useCallback(async () => {
    if (typeof t == "number") {
      d(0);
      return;
    }
    try {
      const I = await fetch(Cs(), {
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "GET"
      });
      if (!I.ok) {
        d(0);
        return;
      }
      const P = await I.json().catch(() => null), v = Ms(P).filter((B) => {
        const w = ot(B.status), h = ot(B.direction);
        return w === "pending" && h === "received";
      }).length;
      d(v);
    } catch {
      d(0);
    }
  }, [t]);
  c.useEffect(() => {
    let I = !0;
    return j().finally(() => {
      !I && typeof t != "number" && d(0);
    }), () => {
      I = !1;
    };
  }, [j, t]);
  const p = () => {
    e && e(), C(!0);
  }, k = (I) => {
    (I.key === "Enter" || I.key === " ") && (I.preventDefault(), p());
  }, M = c.useMemo(() => a, [a]);
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ n.jsx(ae, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ n.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ n.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: S
          }
        ),
        /* @__PURE__ */ n.jsx("div", { className: `membership-grade-chip soft-radius ${l}`, children: /* @__PURE__ */ n.jsx("span", { children: f }) })
      ] }) }),
      /* @__PURE__ */ n.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ n.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ n.jsx("strong", { className: "highlight", children: b }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ n.jsx("p", { className: "profile-welcome-msg", children: ((T = r.bio) == null ? void 0 : T.trim()) ?? "" }),
        /* @__PURE__ */ n.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => Ie(".layer-full-management"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => Ie(".layer-itinerary"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => Ie(".layer-account-benefits"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ n.jsx("div", { className: "summary-stats-column", children: M.map((I) => I.tone === "air" ? /* @__PURE__ */ n.jsxs(
      "div",
      {
        "aria-label": `동행자 초대 알림${y ? `, 대기 ${g}건` : ""}`,
        className: "bento-box soft-radius stat-card meta-glass-theme tone-air",
        onClick: p,
        onKeyDown: k,
        role: "button",
        tabIndex: 0,
        style: { cursor: "pointer" },
        children: [
          /* @__PURE__ */ n.jsxs("div", { className: "stat-icon-box", style: { position: "relative" }, children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "bell", className: "lucide-bell" }),
            y ? /* @__PURE__ */ n.jsx(
              "span",
              {
                "aria-label": `대기 중인 초대 ${g}건`,
                style: {
                  alignItems: "center",
                  background: "#ff5000",
                  borderRadius: "999px",
                  color: "#fff",
                  display: "inline-flex",
                  fontSize: "11px",
                  fontWeight: 800,
                  height: "20px",
                  justifyContent: "center",
                  minWidth: "20px",
                  padding: "0 6px",
                  position: "absolute",
                  right: "-8px",
                  top: "-8px",
                  boxShadow: "0 8px 16px rgba(255, 80, 0, 0.24)"
                },
                children: g > 99 ? "99+" : g
              }
            ) : null
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "stat-content", children: [
            /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }, children: [
              /* @__PURE__ */ n.jsx("span", { className: "stat-label", children: "동행자 초대 알림" }),
              y ? /* @__PURE__ */ n.jsxs(
                "span",
                {
                  className: "pill-shape",
                  style: {
                    background: "rgba(255, 80, 0, 0.1)",
                    border: "1px solid rgba(255, 80, 0, 0.22)",
                    color: "#ff5000",
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "4px 10px"
                  },
                  children: [
                    g,
                    "건 대기"
                  ]
                }
              ) : /* @__PURE__ */ n.jsx(
                "span",
                {
                  className: "pill-shape",
                  style: {
                    background: "rgba(148, 163, 184, 0.12)",
                    border: "1px solid rgba(148, 163, 184, 0.18)",
                    color: "#667085",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "4px 10px"
                  },
                  children: "대기 없음"
                }
              )
            ] }),
            /* @__PURE__ */ n.jsx("strong", { className: "stat-value", children: y ? `새 초대 ${g}건` : "새 초대 없음" })
          ] })
        ]
      },
      I.label
    ) : /* @__PURE__ */ n.jsxs(ae, { className: `stat-card meta-glass-theme tone-${I.tone}`, children: [
      /* @__PURE__ */ n.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ n.jsx("i", { "data-lucide": at(I.tone), className: `lucide-${at(I.tone)}` }) }),
      /* @__PURE__ */ n.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ n.jsx("span", { className: "stat-label", children: I.label }),
        /* @__PURE__ */ n.jsx("strong", { className: "stat-value", children: I.value })
      ] })
    ] }, I.label)) }),
    /* @__PURE__ */ n.jsx(
      As,
      {
        isOpen: A,
        onClose: () => C(!1),
        onRefreshPendingCount: j
      }
    )
  ] });
}, Rs = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, _s = ({ tone: e, value: t }) => {
  const s = Rs[e];
  return /* @__PURE__ */ n.jsx("span", { className: `pill-shape ${s}`.trim(), children: t });
}, Ds = ["all", "air", "stay", "rent", "voucher"], Ls = {
  air: "항공",
  rent: "렌터카",
  stay: "숙박",
  voucher: "바우처"
}, lt = /\s*(?:→|->|–|—|~| to )\s*/i, zs = ["결제", "카드", "현금", "페이", "포인트", "마일리지", "계좌", "무통장"], E = (e) => (e == null ? void 0 : e.trim()) ?? "", be = (e, t = " · ") => e.map((s) => E(s)).filter(Boolean).join(t), Ut = (e, t) => e.find((s) => t.some((r) => r.test(s))), Us = (e) => {
  const t = E(e).replace(/\s+/g, " ");
  if (!t)
    return null;
  if (t.match(lt)) {
    const [a, i] = t.split(lt, 2), o = E(a), l = E(i).split(/\s+/)[0] ?? "";
    if (o && l)
      return { departure: o, destination: l };
  }
  const r = t.match(/\b[A-Z]{2,4}\b/g);
  return r && r.length >= 2 ? {
    departure: r[0],
    destination: r[1]
  } : null;
}, Ps = (e, t) => {
  const r = E(e).match(/\b(?:[A-Z]{2,3}\d{2,4}|\d{1,3}[A-Z]\d{2,4})\b/);
  return r ? r[0] : Ut(t, [/\b(?:[A-Z]{2,3}\d{2,4}|\d{1,3}[A-Z]\d{2,4})\b/]) ?? "";
}, $s = (e, t) => {
  const s = E(e), r = Ut(t, [/제주항공/, /대한항공/, /진에어/, /티웨이/, /에어부산/, /에어서울/, /이스타/, /항공/]);
  if (r)
    return r;
  const a = Ps(s, t);
  return a || s;
}, je = (e, t) => {
  const s = E(e);
  return s || t.find((a) => zs.some((i) => a.includes(i))) || "예약 카드 기준 결제수단 확인";
}, Os = (e) => {
  const t = Us(e.title), s = $s(e.title, e.tags), r = t ? `${t.departure} → ${t.destination}` : s || "항공 예약", a = t ? `${t.departure} 출발 ${t.destination} 도착 항공권이다.` : `${s || "항공 예약"}의 노선은 카드 제목 기준으로 확인해라.`;
  return {
    fields: [
      { label: "예약번호", value: E(e.id) || "예약번호 확인 필요" },
      { label: "출발일", value: E(e.date) || "출발일 확인 필요" },
      { label: "출발지", value: (t == null ? void 0 : t.departure) || "예약 카드 기준 출발지 확인" },
      { label: "목적지", value: (t == null ? void 0 : t.destination) || "예약 카드 기준 목적지 확인" },
      { label: "편명/항공사", value: s || "예약 카드 기준 항공편 확인", full: !0 },
      { label: "결제금액", value: E(e.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: je(e.paymentMethod, e.tags) }
    ],
    note: a,
    reservationNo: E(e.id) || "예약번호 확인 필요",
    subtitle: s ? `항공 예약 · ${s}` : "항공 예약",
    summaryLabel: "노선",
    summaryValue: r
  };
}, Bs = (e) => {
  const t = E(e.title) || "숙소 예약", s = E(e.duration) || be([e.date, e.duration], " / ") || "숙박 일정 확인", r = `${t} 숙박 일정은 카드의 날짜와 기간 기준으로 확인하면 된다.`;
  return {
    fields: [
      { label: "예약번호", value: E(e.id) || "예약번호 확인 필요" },
      { label: "체크인일", value: E(e.date) || "체크인일 확인 필요" },
      { label: "숙소명", value: t },
      { label: "숙박일정", value: s },
      { label: "포함혜택", value: be(e.tags) || "카드 태그 기준 혜택 확인", full: !0 },
      { label: "결제금액", value: E(e.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: je(e.paymentMethod, e.tags) }
    ],
    note: r,
    reservationNo: E(e.id) || "예약번호 확인 필요",
    subtitle: `숙소 예약 · ${t}`,
    summaryLabel: "숙소명",
    summaryValue: t
  };
}, Fs = (e) => {
  const t = E(e.title) || "렌터카 예약", s = E(e.duration) || "이용시간 확인", r = `${t} 예약은 인수일과 이용시간 기준으로 확인해라.`;
  return {
    fields: [
      { label: "예약번호", value: E(e.id) || "예약번호 확인 필요" },
      { label: "인수일", value: E(e.date) || "인수일 확인 필요" },
      { label: "차량 또는 업체", value: t },
      { label: "이용시간", value: s },
      { label: "포함옵션", value: be(e.tags) || "카드 태그 기준 옵션 확인", full: !0 },
      { label: "결제금액", value: E(e.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: je(e.paymentMethod, e.tags) }
    ],
    note: r,
    reservationNo: E(e.id) || "예약번호 확인 필요",
    subtitle: `렌터카 예약 · ${t}`,
    summaryLabel: "차량/업체",
    summaryValue: t
  };
}, Ws = (e) => {
  const t = E(e.title) || "바우처 예약", s = be(e.tags) || "바우처 사용 안내 확인", r = `${t}는 예약일과 사용정보 기준으로 확인하면 된다.`;
  return {
    fields: [
      { label: "예약번호", value: E(e.id) || "예약번호 확인 필요" },
      { label: "이용일", value: E(e.date) || "이용일 확인 필요" },
      { label: "상품", value: t },
      { label: "사용정보", value: s },
      { label: "결제금액", value: E(e.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: je(e.paymentMethod, e.tags) }
    ],
    note: r,
    reservationNo: E(e.id) || "예약번호 확인 필요",
    subtitle: `바우처 예약 · ${t}`,
    summaryLabel: "상품",
    summaryValue: t
  };
}, Hs = (e) => {
  switch (e.type) {
    case "air":
      return Os(e);
    case "stay":
      return Bs(e);
    case "rent":
      return Fs(e);
    case "voucher":
    default:
      return Ws(e);
  }
}, Ks = () => {
  const { dispatch: e, state: t } = oe(), s = t.bookings ?? [], [r, a] = c.useState(null);
  c.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [s, t.filter]), c.useEffect(() => {
    if (!r)
      return;
    const d = (A) => {
      A.key === "Escape" && a(null);
    };
    return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
  }, [r]);
  const i = c.useMemo(() => t.filter === "all" ? s : s.filter((d) => d.type === t.filter), [s, t.filter]), o = c.useCallback(
    (d) => {
      e({ type: "SET_FILTER", payload: d });
    },
    [e]
  ), l = c.useMemo(
    () => s.find((d) => d.id === r) ?? null,
    [r, s]
  ), f = c.useMemo(() => l ? Hs(l) : null, [l]), b = c.useCallback((d) => {
    a(d);
  }, []), N = c.useCallback(() => {
    a(null);
  }, []);
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-full-management", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header flex-header", children: [
      /* @__PURE__ */ n.jsxs("div", { className: "title-group", children: [
        /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "나의 예약 현황" }),
        /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 및 바우처를 한눈에 관리하세요." })
      ] }),
      /* @__PURE__ */ n.jsx("div", { className: "booking-filters flex-gap", children: Ds.map((d) => /* @__PURE__ */ n.jsx(
        "button",
        {
          className: `filter-chip pill-shape ${t.filter === d ? "active" : ""}`,
          onClick: () => o(d),
          type: "button",
          children: d === "all" ? "전체" : d === "air" ? "항공" : d === "stay" ? "숙박" : d === "rent" ? "렌터카" : "바우처"
        },
        d
      )) })
    ] }),
    /* @__PURE__ */ n.jsx("ul", { className: "full-width-trip-list", children: i.length > 0 ? i.map((d) => /* @__PURE__ */ n.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": d.type, children: [
      /* @__PURE__ */ n.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ n.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ n.jsx(_s, { tone: d.type, value: d.status }),
          /* @__PURE__ */ n.jsx("div", { className: "trip-tags", children: d.tags.map((A) => /* @__PURE__ */ n.jsx("span", { className: "meta-tag pill-shape", children: A }, A)) })
        ] }),
        /* @__PURE__ */ n.jsx("h3", { className: "trip-title", children: d.title }),
        /* @__PURE__ */ n.jsxs("div", { className: "trip-meta-grid", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "calendar", className: "lucide-calendar" }),
            /* @__PURE__ */ n.jsx("span", { children: d.date }),
            d.duration ? /* @__PURE__ */ n.jsxs("strong", { className: "duration-label", children: [
              "(",
              d.duration,
              ")"
            ] }) : null
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "wallet", className: "lucide-wallet" }),
            /* @__PURE__ */ n.jsx("strong", { children: d.amount }),
            d.paymentMethod ? /* @__PURE__ */ n.jsxs("span", { className: "method-label", children: [
              " / ",
              d.paymentMethod
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n.jsxs("div", { className: "trip-inline-actions", children: [
        /* @__PURE__ */ n.jsxs("div", { className: "action-group", children: [
          d.voucherUrl ? /* @__PURE__ */ n.jsxs("button", { className: "inline-btn primary pill-shape", type: "button", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "download", className: "lucide-download" }),
            "e-티켓 / 바우처"
          ] }) : /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", onClick: () => b(d.id), children: "예약 확인" }),
          /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "예약 변경" })
        ] }),
        /* @__PURE__ */ n.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "예약 취소" })
      ] })
    ] }, d.id)) : /* @__PURE__ */ n.jsxs("div", { className: "empty-state-placeholder soft-radius", children: [
      /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
      /* @__PURE__ */ n.jsx("p", { children: "선택하신 카테고리에 해당하는 예약 내역이 없습니다." })
    ] }) }),
    f && l ? /* @__PURE__ */ n.jsx(
      "div",
      {
        className: "meta-modal-overlay booking-receipt-overlay active",
        onClick: N,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "booking-receipt-title",
        children: /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-modal", onClick: (d) => d.stopPropagation(), children: [
          /* @__PURE__ */ n.jsxs("header", { className: "booking-receipt-header", children: [
            /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-header-copy", children: [
              /* @__PURE__ */ n.jsxs("span", { className: "booking-receipt-kicker", children: [
                Ls[l.type],
                " 예약"
              ] }),
              /* @__PURE__ */ n.jsx("h3", { className: "booking-receipt-title", children: "예약 확인" }),
              /* @__PURE__ */ n.jsx("p", { className: "booking-receipt-subtitle", children: f.subtitle })
            ] }),
            /* @__PURE__ */ n.jsx("button", { className: "booking-receipt-close", type: "button", onClick: N, "aria-label": "닫기", children: /* @__PURE__ */ n.jsx("i", { "data-lucide": "x", "aria-hidden": "true" }) })
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-body", children: [
            /* @__PURE__ */ n.jsxs("section", { className: "booking-receipt-summary", children: [
              /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-item", children: [
                /* @__PURE__ */ n.jsx("span", { className: "booking-receipt-label", children: "예약번호" }),
                /* @__PURE__ */ n.jsx("strong", { className: "booking-receipt-value", children: f.reservationNo })
              ] }),
              /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-item", children: [
                /* @__PURE__ */ n.jsx("span", { className: "booking-receipt-label", children: f.summaryLabel }),
                /* @__PURE__ */ n.jsx("strong", { className: "booking-receipt-value", children: f.summaryValue })
              ] }),
              /* @__PURE__ */ n.jsx("p", { className: "booking-receipt-note", children: f.note })
            ] }),
            /* @__PURE__ */ n.jsx("dl", { className: "booking-receipt-grid", children: f.fields.map((d) => /* @__PURE__ */ n.jsxs("div", { className: `booking-receipt-item${d.full ? " full" : ""}`, children: [
              /* @__PURE__ */ n.jsx("dt", { className: "booking-receipt-label", children: d.label }),
              /* @__PURE__ */ n.jsx("dd", { className: "booking-receipt-value", children: d.value })
            ] }, d.label)) })
          ] }),
          /* @__PURE__ */ n.jsx("footer", { className: "booking-receipt-actions", children: /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", onClick: N, children: "닫기" }) })
        ] })
      }
    ) : null
  ] });
}, Ae = "/api/mypage/members/search", Vs = "/api/mypage/companion-links", Ys = 180, ct = 5, qs = {
  available: "none",
  invited: "outgoing_pending",
  incoming_pending: "incoming_pending",
  linked: "linked",
  needs_response: "incoming_pending",
  none: "none",
  outgoing_pending: "outgoing_pending"
}, dt = (e) => e.trim().toLowerCase(), mt = (e) => /^[a-z0-9._-]{1,30}$/i.test(e), $ = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Pt = (e, t) => {
  if ($(e)) {
    const s = e.message ?? e.error;
    if (typeof s == "string" && s.trim())
      return s;
  }
  return t;
}, $t = (e) => {
  if (typeof e != "string")
    return;
  const t = e.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return qs[t];
}, fe = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, Gs = (e, t) => {
  var i;
  const s = Ae.startsWith("/") ? Ae : `/${Ae}`, r = (i = ie) == null ? void 0 : i.trim(), a = r ? new URL(s, r) : new URL(s, window.location.origin);
  return a.searchParams.set("query", e), a.searchParams.set("memberIdPrefix", e), a.searchParams.set("prefix", e), typeof t == "number" && a.searchParams.set("limit", String(t)), r ? a.toString() : `${a.pathname}${a.search}`;
}, Xs = (e) => {
  if (Array.isArray(e))
    return e;
  if (!$(e))
    return [];
  const t = ["companions", "members", "users", "results", "items", "data"];
  for (const s of t) {
    const r = e[s];
    if (Array.isArray(r))
      return r;
    if ($(r) && Array.isArray(r.items))
      return r.items;
    if ($(r) && Array.isArray(r.results))
      return r.results;
  }
  if ($(e.data)) {
    const s = ["companions", "members", "users", "results", "items"];
    for (const r of s) {
      const a = e.data[r];
      if (Array.isArray(a))
        return a;
    }
  }
  return [];
}, Zs = (e) => {
  if (!$(e))
    return null;
  const t = [e.invite, e.data, e.result, e.item];
  for (const s of t)
    if ($(s))
      return s;
  return e;
}, Qs = (e) => {
  if (!$(e))
    return null;
  const t = fe(e.id ?? e.memberId ?? e.userId ?? e.loginId), s = fe(e.name ?? e.displayName ?? e.userName ?? e.nickname ?? e.fullName), r = fe(e.avatarUrl ?? e.avatar ?? e.profileImageUrl ?? e.imageUrl ?? e.photoUrl), a = fe(e.bio ?? e.intro ?? e.description ?? e.summary), i = $t(
    e.relationState ?? e.relation_state ?? e.relationStatus ?? e.relation_status ?? e.companionRelationState ?? e.companion_relation_state ?? ($(e.relation) ? e.relation.state : void 0)
  ) ?? (e.isLinked === !0 || e.linked === !0 ? "linked" : void 0);
  return !t || !s ? null : {
    avatarUrl: r ?? void 0,
    bio: a ?? void 0,
    id: t,
    isMember: e.isMember !== !1,
    name: s,
    relationState: i
  };
}, Js = (e) => {
  const t = /* @__PURE__ */ new Set(), s = [];
  for (const r of e)
    t.has(r.id) || (t.add(r.id), s.push(r));
  return s;
}, er = async (e, t) => {
  const s = await fetch(Gs(e, t == null ? void 0 : t.limit), {
    credentials: "include",
    headers: {
      Accept: "application/json"
    },
    method: "GET",
    signal: t == null ? void 0 : t.signal
  }), r = await s.json().catch(() => null);
  if (s.status === 401)
    throw new Error("로그인이 필요합니다.");
  if (!s.ok) {
    const i = $(r) && typeof r.message == "string" && r.message.trim() || $(r) && typeof r.error == "string" && r.error.trim() || "회원 조회에 실패했다";
    throw new Error(i);
  }
  if ($(r) && r.success === !1) {
    const i = typeof r.message == "string" && r.message.trim() || typeof r.error == "string" && r.error.trim() || "회원 조회에 실패했다";
    throw new Error(i);
  }
  const a = Xs(r).map(Qs).filter((i) => i !== null);
  return Js(a).filter((i) => i.id.toLowerCase().startsWith(e));
}, tr = async (e, t) => {
  const s = await fetch("/api/mypage/companion-invites", {
    body: JSON.stringify({
      companionUserId: e.id,
      inviteeId: e.id,
      inviteeUserId: e.id,
      memberId: e.id,
      targetUserId: e.id,
      userId: e.id
    }),
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    signal: t
  }), r = await s.json().catch(() => null);
  if (!s.ok || $(r) && r.success === !1)
    throw new Error(
      Pt(
        r,
        s.status === 401 ? "로그인이 필요합니다." : "동행 초대에 실패했다"
      )
    );
  return Zs(r);
}, nr = async (e, t) => {
  const s = await fetch(`${Vs}/${encodeURIComponent(e)}`, {
    credentials: "include",
    headers: {
      Accept: "application/json"
    },
    method: "DELETE",
    signal: t
  }), r = await s.json().catch(() => null);
  if (!s.ok || $(r) && r.success === !1)
    throw new Error(
      Pt(
        r,
        s.status === 401 ? "로그인이 필요합니다." : "동행 해제에 실패했다"
      )
    );
  return r;
}, sr = (e) => e instanceof Error && e.message.trim() ? e.message : "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라", rr = (e) => e instanceof Error && e.message.trim() ? e.message : "동행 초대 중 오류가 발생했다. 잠시 후 다시 시도해라", ar = (e) => e instanceof Error && e.message.trim() ? e.message : "동행 해제 중 오류가 발생했다. 잠시 후 다시 시도해라", ir = ({
  initialCompanions: e = [],
  searchMembers: t = er
} = {}) => {
  const [s, r] = c.useState(e), [a, i] = c.useState(""), [o, l] = c.useState([]), [f, b] = c.useState("suggestions"), [N, d] = c.useState(!1), [A, C] = c.useState(!1), [g, y] = c.useState(null), S = c.useRef(0), j = c.useRef(/* @__PURE__ */ new Set()), p = c.useRef({
    controller: null,
    timerId: null
  }), k = c.useRef(null), M = c.useCallback(() => {
    var h;
    const w = p.current;
    w.timerId !== null && window.clearTimeout(w.timerId), (h = w.controller) == null || h.abort(), w.controller = null, w.timerId = null, C(!1);
  }, []), U = c.useCallback(() => {
    var w;
    (w = k.current) == null || w.abort(), k.current = null, d(!1);
  }, []), z = c.useCallback(
    async (w, h) => {
      var q, D, J, X;
      const _ = dt(w);
      if (!_)
        return l([]), h != null && h.strict && y({ message: "검색할 제주그룹 회원 ID를 입력해라" }), [];
      if (!mt(_))
        return l([]), h != null && h.strict && y({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), [];
      const Y = ++S.current;
      if (h != null && h.strict) {
        M();
        const W = new AbortController();
        k.current = W, l([]), y(null), b("results"), d(!0), h = {
          ...h,
          signal: h.signal ?? W.signal
        };
      } else
        C(!0);
      try {
        const W = await t(_, {
          limit: h != null && h.strict ? void 0 : ct,
          signal: h == null ? void 0 : h.signal
        });
        return Y !== S.current || (q = h == null ? void 0 : h.signal) != null && q.aborted ? [] : (l(W), h != null && h.strict && W.length === 0 ? y({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" }) : y(null), W);
      } catch (W) {
        return Y !== S.current || (D = h == null ? void 0 : h.signal) != null && D.aborted ? [] : (l([]), y({ message: sr(W) }), []);
      } finally {
        Y === S.current && !((J = h == null ? void 0 : h.signal) != null && J.aborted) && (h != null && h.strict ? (d(!1), ((X = k.current) == null ? void 0 : X.signal) === h.signal && (k.current = null)) : C(!1));
      }
    },
    [M, t]
  );
  c.useEffect(() => {
    const w = dt(a);
    if (!w)
      return l([]), y(null), C(!1), () => {
        S.current += 1;
      };
    if (!mt(w))
      return l([]), y({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), C(!1), () => {
        S.current += 1;
      };
    const h = new AbortController(), _ = window.setTimeout(() => {
      z(w, { signal: h.signal });
    }, Ys);
    return p.current.controller = h, p.current.timerId = _, () => {
      h.abort(), window.clearTimeout(_), p.current.controller === h && (p.current.controller = null), p.current.timerId === _ && (p.current.timerId = null), S.current += 1;
    };
  }, [z, a]);
  const R = c.useCallback((w) => {
    U(), i(w), l([]), b("suggestions"), y(null), M();
  }, [U, M]), T = c.useCallback(() => {
    U(), M(), S.current += 1, i(""), l([]), b("suggestions"), d(!1), C(!1), y(null);
  }, [U, M]), I = c.useCallback(
    async (w) => (M(), await z(w, { strict: !0 })),
    [M, z]
  ), P = c.useCallback(async (w) => {
    y(null);
    try {
      const h = await tr(w), _ = $(h) ? $t(
        h.relationState ?? h.relation_state ?? h.status ?? h.inviteState ?? h.invite_state
      ) ?? "outgoing_pending" : "outgoing_pending";
      l(
        (Y) => Y.map(
          (q) => q.id === w.id ? {
            ...q,
            relationState: _
          } : q
        )
      );
    } catch (h) {
      y({ message: rr(h) });
    }
  }, []), v = c.useCallback(async (w) => {
    y(null), j.current.add(w), r((h) => h.filter((_) => _.id !== w)), l(
      (h) => h.map(
        (_) => _.id === w ? {
          ..._,
          relationState: "none"
        } : _
      )
    );
  }, []), B = c.useCallback(async () => {
    const w = Array.from(j.current);
    if (w.length !== 0)
      for (const h of w)
        try {
          await nr(h), j.current.delete(h);
        } catch (_) {
          throw y({ message: ar(_) }), _;
        }
  }, []);
  return {
    companions: s,
    clearSearch: T,
    errorObj: g,
    handleSearch: I,
    isSearching: N,
    isSuggestionLoading: A,
    inviteCompanion: P,
    commitPendingUnlinks: B,
    removeCompanion: v,
    searchMode: f,
    searchQuery: a,
    searchResults: o,
    setSearchQuery: R,
    visibleSuggestionCount: ct
  };
}, Ot = ({
  companion: e,
  className: t = "",
  showLinkedIndicator: s = !0,
  style: r
}) => {
  const [a, i] = c.useState(!1), o = V(e.avatarUrl), l = !!(o && !a);
  return c.useEffect(() => {
    i(!1);
  }, [o]), /* @__PURE__ */ n.jsxs(
    "div",
    {
      "aria-hidden": "true",
      className: `companion-avatar soft-radius companion-search-avatar ${s ? "is-linked" : ""} ${t}`.trim(),
      "data-companion-search-avatar": "true",
      style: r,
      children: [
        l ? /* @__PURE__ */ n.jsx(
          "img",
          {
            alt: "",
            src: o,
            onError: () => i(!0),
            className: "companion-search-avatar-image"
          }
        ) : /* @__PURE__ */ n.jsx("span", { className: "companion-search-avatar-fallback", children: e.name.charAt(0) }),
        s ? /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator companion-search-avatar-link" }) : null
      ]
    }
  );
}, or = {
  incoming_pending: "응답 필요",
  linked: "연동됨",
  none: "초대",
  outgoing_pending: "초대중"
}, lr = (e, t) => t ? "linked" : e.relationState ?? "none", cr = (e) => or[e], ut = ({ companion: e, isLinked: t, onInvite: s }) => {
  var l;
  const r = ((l = e.bio) == null ? void 0 : l.trim()) || `@${e.id}`, a = lr(e, t), i = a === "none", o = cr(a);
  return /* @__PURE__ */ n.jsxs(
    "button",
    {
      className: "companion-linked-item list-item soft-radius companion-search-card",
      type: "button",
      onClick: () => {
        i && s(e);
      },
      disabled: !i,
      "data-linked": t ? "true" : "false",
      "data-relation-state": a,
      children: [
        /* @__PURE__ */ n.jsxs("div", { className: "item-info companion-search-card-info", children: [
          /* @__PURE__ */ n.jsx(Ot, { companion: e, showLinkedIndicator: a === "linked" }),
          /* @__PURE__ */ n.jsxs("div", { className: "user-info name-meta companion-search-card-copy", children: [
            /* @__PURE__ */ n.jsx("strong", { children: e.name }),
            /* @__PURE__ */ n.jsx("span", { children: r })
          ] })
        ] }),
        /* @__PURE__ */ n.jsx("span", { className: "pill-shape companion-search-card-badge", "data-linked": t ? "true" : "false", children: o })
      ]
    }
  );
}, dr = ({
  initialCompanions: e,
  isOpen: t,
  onClose: s,
  onSave: r
}) => {
  const {
    companions: a,
    searchMode: i,
    searchQuery: o,
    searchResults: l,
    setSearchQuery: f,
    isSearching: b,
    errorObj: N,
    handleSearch: d,
    inviteCompanion: A,
    commitPendingUnlinks: C,
    removeCompanion: g,
    clearSearch: y
  } = ir({ initialCompanions: e }), S = c.useRef(null), [j, p] = c.useState(!1), k = 4, M = o.trim().length > 0, U = c.useMemo(
    () => l.slice(0, k),
    [l]
  );
  if (c.useEffect(() => {
    if (t) {
      y();
      const v = window.setTimeout(() => {
        var B;
        return (B = S.current) == null ? void 0 : B.focus();
      }, 100);
      return () => window.clearTimeout(v);
    }
  }, [t, y]), c.useEffect(() => {
    const v = (B) => {
      B.key === "Escape" && t && s();
    };
    return window.addEventListener("keydown", v), () => window.removeEventListener("keydown", v);
  }, [t, s]), c.useEffect(() => {
    t && window.lucide && window.lucide.createIcons();
  }, [t, i, l, a, N]), !t) return null;
  const z = (v) => {
    v.preventDefault(), d(o);
  }, R = async () => {
    p(!0);
    try {
      await C(), r(a), s();
    } catch {
      return;
    } finally {
      p(!1);
    }
  }, T = (v) => a.some((B) => B.id === v), I = () => i !== "results" ? null : /* @__PURE__ */ n.jsx("div", { className: "companion-search-results-panel", children: N ? /* @__PURE__ */ n.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", fontWeight: 600 }, children: [
    /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
    N.message
  ] }) : b ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "28px 20px", fontSize: "14px" }, children: "제주그룹 회원을 찾는 중이다." }) : l.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "28px 20px", fontSize: "14px" }, children: "일치하는 제주그룹 회원이 없다." }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
    /* @__PURE__ */ n.jsxs("div", { style: { color: "var(--meta-text-muted)", fontSize: "13px", fontWeight: 700, flexShrink: 0 }, children: [
      "검색 결과 ",
      l.length,
      "명"
    ] }),
    /* @__PURE__ */ n.jsx("div", { className: "companion-search-results-list", children: l.map((v) => /* @__PURE__ */ n.jsx(
      ut,
      {
        companion: v,
        isLinked: T(v.id),
        onInvite: A
      },
      v.id
    )) })
  ] }) }), P = () => i === "results" || U.length === 0 ? null : /* @__PURE__ */ n.jsx("div", { className: "companion-search-dropdown", children: U.map((v) => /* @__PURE__ */ n.jsx(
    ut,
    {
      companion: v,
      isLinked: T(v.id),
      onInvite: A
    },
    v.id
  )) });
  return /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: s, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ n.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (v) => v.stopPropagation(),
      style: { display: "flex", flexDirection: "column", overflow: "hidden", padding: "40px" },
      children: [
        /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ n.jsxs("div", { className: "companion-modal-body", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "24px", minHeight: 0, overflow: "hidden" }, children: [
          /* @__PURE__ */ n.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: z, style: { gap: "16px", marginBottom: "0", flexShrink: 0 }, children: [
            /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flex: 1, flexDirection: "column", gap: "12px", minWidth: 0, position: "relative" }, children: [
              /* @__PURE__ */ n.jsx(
                "input",
                {
                  ref: S,
                  className: "id-input companion-search-input",
                  type: "text",
                  placeholder: "제주그룹 회원 ID를 입력해라",
                  value: o,
                  onChange: (v) => f(v.target.value),
                  style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px", width: "100%" },
                  autoComplete: "off"
                }
              ),
              /* @__PURE__ */ n.jsx("div", { style: { left: 0, position: "absolute", right: 0, top: "calc(100% - 1px)", zIndex: 3 }, children: P() })
            ] }),
            /* @__PURE__ */ n.jsx(
              "button",
              {
                type: "submit",
                className: "add-btn companion-search-submit pill-shape",
                disabled: b,
                style: {
                  background: M ? "#ff7a00" : "#eef1f4",
                  border: M ? "1px solid #ff7a00" : "1px solid #d7dce2",
                  boxShadow: "none",
                  color: M ? "#fff" : "#7b8794",
                  padding: "0 36px",
                  fontSize: "16px",
                  borderRadius: "16px",
                  flexShrink: 0
                },
                children: b ? "검색 중..." : "검색"
              }
            )
          ] }),
          i === "results" ? I() : null,
          N && i !== "results" && /* @__PURE__ */ n.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            N.message
          ] }),
          i !== "results" && /* @__PURE__ */ n.jsxs("div", { className: "linked-companions-section", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", minHeight: 0, overflow: "hidden" }, children: [
            /* @__PURE__ */ n.jsxs("h4", { style: { fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }, children: [
              "연동된 동행자 (",
              a.length,
              "명)"
            ] }),
            a.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 초대해라." }) : /* @__PURE__ */ n.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "16px", minHeight: 0, overflowY: "auto", paddingRight: "4px" }, children: a.map((v) => /* @__PURE__ */ n.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ n.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ n.jsx(
                  Ot,
                  {
                    companion: v,
                    className: "companion-linked-avatar",
                    showLinkedIndicator: v.isMember,
                    style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }
                  }
                ),
                /* @__PURE__ */ n.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ n.jsx("strong", { style: { fontSize: "16px" }, children: v.name }),
                  /* @__PURE__ */ n.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    v.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ n.jsx(
                "button",
                {
                  className: "remove-btn companion-remove-btn",
                  type: "button",
                  onClick: () => void g(v.id),
                  style: { padding: "10px 24px", fontSize: "14px" },
                  children: "해제"
                }
              )
            ] }, v.id)) })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "24px", gap: "16px", flexShrink: 0 }, children: [
          /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: s, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ n.jsx(
            "button",
            {
              className: "save-btn pill-shape",
              type: "button",
              onClick: () => void R(),
              disabled: j,
              style: { padding: "20px 0", fontSize: "16px" },
              children: j ? "적용 중" : "적용"
            }
          )
        ] })
      ]
    }
  ) });
}, mr = (e) => {
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
}, ur = ({ companion: e }) => {
  const [t, s] = c.useState(!1), r = V(e.avatarUrl), a = !!(r && !t);
  return c.useEffect(() => {
    s(!1);
  }, [r]), /* @__PURE__ */ n.jsxs(
    "div",
    {
      className: `companion-avatar soft-radius ${e.isMember ? "is-linked" : ""}`,
      title: e.name + (e.isMember ? " (연동됨)" : ""),
      children: [
        a ? /* @__PURE__ */ n.jsx(
          "img",
          {
            alt: "",
            src: r,
            onError: () => s(!0),
            style: {
              borderRadius: "inherit",
              height: "100%",
              inset: 0,
              objectFit: "cover",
              pointerEvents: "none",
              position: "absolute",
              width: "100%"
            }
          }
        ) : /* @__PURE__ */ n.jsx("span", { style: { position: "relative", zIndex: 1 }, children: e.name.charAt(0) }),
        e.isMember && /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
      ]
    }
  );
}, pr = () => {
  const { dispatch: e, state: t } = oe(), s = t.itinerary ?? [], r = s.length > 0 ? s : [
    {
      activities: [],
      companions: [],
      date: "일정 미정",
      googleMapUrl: "",
      id: "empty-itinerary",
      time: "시간 미정",
      title: "여행 일정 준비 중"
    }
  ], a = t.linkedCompanions ?? [], i = t.profile, [o, l] = c.useState(!1), [f, b] = c.useState(null), N = c.useRef({}), [d, A] = c.useState({});
  c.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [o, s, a]), c.useLayoutEffect(() => {
    const g = r.reduce((y, S) => {
      var j;
      return y[S.id] = ((j = N.current[S.id]) == null ? void 0 : j.scrollHeight) ?? 0, y;
    }, {});
    A((y) => {
      const S = Object.keys(y), j = Object.keys(g);
      return S.length === j.length && j.every((p) => y[p] === g[p]) ? y : g;
    });
  }, [r, o]);
  const C = (g) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: g }), es(
      {
        id: i.id,
        profile: {
          email: i.email,
          id: i.id,
          name: i.name
        }
      },
      {
        linkedCompanions: g
      }
    ), b(null);
  };
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ n.jsxs("div", { className: `itinerary-timeline-wrap ${o ? "is-expanded" : ""}`, children: [
      r.map((g, y) => {
        const S = y < 2, j = S || o, p = d[g.id] ?? 720, k = g.id === "empty-itinerary", M = a.length > 0 ? a : g.companions, U = M.slice(0, 4), z = M.length > 4 ? M.length - 4 : 0, R = z > 0 ? `외 ${z}명` : `총 ${M.length}명`;
        return /* @__PURE__ */ n.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (T) => {
              N.current[g.id] = T;
            },
            "aria-hidden": !j,
            style: S ? void 0 : {
              overflow: "hidden",
              maxHeight: j ? `${p}px` : "0px",
              opacity: j ? 1 : 0,
              transform: j ? "translateY(0)" : "translateY(-18px)",
              marginBottom: j ? "40px" : "0px",
              pointerEvents: j ? "auto" : "none",
              transition: "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)"
            },
            children: [
              /* @__PURE__ */ n.jsxs("div", { className: "day-side-info", children: [
                /* @__PURE__ */ n.jsx("span", { className: "day-date", children: g.date }),
                /* @__PURE__ */ n.jsx("span", { className: "day-time", children: g.time }),
                /* @__PURE__ */ n.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
                  /* @__PURE__ */ n.jsxs("div", { className: "comp-head", children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "users", className: "lucide-users" }),
                    /* @__PURE__ */ n.jsx("span", { className: "small-label", children: "함께하는 동행자" })
                  ] }),
                  /* @__PURE__ */ n.jsxs("div", { className: "avatar-stack", children: [
                    U.map((T) => /* @__PURE__ */ n.jsx(ur, { companion: T }, T.id)),
                    /* @__PURE__ */ n.jsx("span", { className: "comp-count-label", children: R })
                  ] }),
                  /* @__PURE__ */ n.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => b(g.id), children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ n.jsxs(ae, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ n.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ n.jsx("h3", { className: "iti-title", children: g.title }),
                  g.googleMapUrl ? /* @__PURE__ */ n.jsxs("a", { className: "map-link-btn pill-shape", href: g.googleMapUrl, rel: "noopener noreferrer", target: "_blank", children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 보기"
                  ] }) : /* @__PURE__ */ n.jsxs("span", { className: "map-link-btn pill-shape is-disabled", "aria-disabled": "true", children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 준비 중"
                  ] })
                ] }),
                /* @__PURE__ */ n.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ n.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ n.jsx("ul", { className: `checklist-list ${g.activities.length === 0 ? "is-empty" : ""}`, children: g.activities.map((T) => {
                    const I = mr(T.status), P = T.status === "used", v = T.status === "cancelled" || T.status === "missed";
                    return /* @__PURE__ */ n.jsx(
                      "li",
                      {
                        className: `checklist-item ${P ? "checked" : ""} soft-radius`,
                        style: I.style,
                        children: /* @__PURE__ */ n.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ n.jsx(
                            "i",
                            {
                              "data-lucide": I.icon,
                              style: {
                                color: P ? "var(--brand-rent)" : v ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ n.jsx("span", { className: "check-text", children: T.label }),
                            /* @__PURE__ */ n.jsx(
                              "span",
                              {
                                style: {
                                  color: v ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (T.ownerName ?? "본인") + " · " + I.label
                              }
                            )
                          ] })
                        ] })
                      },
                      T.id
                    );
                  }) }),
                  k ? /* @__PURE__ */ n.jsx("p", { className: "checklist-empty-caption", children: "등록된 활동이 아직 없다." }) : null
                ] })
              ] })
            ]
          },
          g.id
        );
      }),
      s.length > 2 && /* @__PURE__ */ n.jsx("div", { className: `timeline-gradient-overlay ${o ? "active" : ""}`, children: /* @__PURE__ */ n.jsx("button", { className: "expand-cta-btn pill-shape", onClick: () => l(!o), children: o ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
        "전체 일정 접기 ",
        /* @__PURE__ */ n.jsx("i", { className: "lucide-chevron-up" })
      ] }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
        "남은 ",
        s.length - 2,
        "개의 일정 더 보기 ",
        /* @__PURE__ */ n.jsx("i", { className: "lucide-chevron-down" })
      ] }) }) })
    ] }),
    f && /* @__PURE__ */ n.jsx(
      dr,
      {
        isOpen: !!f,
        onClose: () => b(null),
        initialCompanions: a,
        onSave: C
      }
    )
  ] });
}, hr = 5 * 1024 * 1024, Z = 512, fr = 16, gr = 6, Bt = 20, xr = {
  alignItems: "center",
  borderRadius: "50%",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  overflow: "hidden",
  position: "absolute"
}, yr = {
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%"
}, vr = {
  alignItems: "center",
  display: "flex",
  fontSize: "18px",
  fontWeight: 800,
  height: "100%",
  justifyContent: "center",
  width: "100%"
}, ge = (e) => Array.from((e ?? "").trim()).slice(0, Bt).join(""), Ee = (e) => ({
  bio: e.bio ?? "",
  email: e.email,
  name: e.name,
  nickname: e.nickname ?? "",
  phone: e.phone
}), br = (e) => ({
  bio: ge(e.bio),
  email: e.email.trim(),
  name: e.name.trim(),
  nickname: e.nickname.trim(),
  phone: e.phone.trim()
}), pt = (e) => (e.nickname.trim().length === 0 || e.nickname.trim().length >= 2) && e.email.trim().includes("@") && e.phone.trim().length > 0, ht = (e) => `${ie}${e}`, ce = (e) => e !== null && typeof e == "object" && !Array.isArray(e), jr = (e) => new Promise((t, s) => {
  const r = new FileReader();
  r.onload = () => {
    if (typeof r.result == "string") {
      t(r.result);
      return;
    }
    s(new Error("이미지 데이터를 읽지 못했습니다."));
  }, r.onerror = () => s(new Error("이미지 데이터를 읽지 못했습니다.")), r.readAsDataURL(e);
}), xe = (e, t, s) => Math.min(s, Math.max(t, e)), te = (e, t, s) => {
  if (!e.naturalWidth || !e.naturalHeight)
    return null;
  const r = Math.max(1, Math.round(t || 320)), a = Math.max(1, Math.round(s || 320)), i = Math.max(0, Math.min(r, a) - fr * 2), o = i / 2, l = Math.min(r / e.naturalWidth, a / e.naturalHeight), f = e.naturalWidth * l, b = e.naturalHeight * l, N = Math.max(i / Math.max(f, 1), i / Math.max(b, 1), 1);
  return {
    baseHeight: b,
    baseScale: l,
    baseWidth: f,
    circleDiameter: i,
    circleRadius: o,
    maxZoom: gr,
    minZoom: N,
    stageHeight: a,
    stageWidth: r
  };
}, ye = (e, t) => {
  const s = xe(e.zoom, t.minZoom, t.maxZoom), r = t.baseWidth * s, a = t.baseHeight * s, i = Math.max(0, (r - t.circleDiameter) / 2), o = Math.max(0, (a - t.circleDiameter) / 2);
  return {
    panX: xe(e.panX, -i, i),
    panY: xe(e.panY, -o, o),
    zoom: s
  };
}, Nr = (e, t, s, r, a) => {
  const i = te(t, s, r);
  return i ? ye(a, i) : e;
}, Sr = (e, t, s) => new Promise((r, a) => {
  const i = document.createElement("canvas"), o = window.devicePixelRatio || 1;
  i.width = Math.max(1, Math.round(Z * o)), i.height = Math.max(1, Math.round(Z * o));
  const l = i.getContext("2d");
  if (!l)
    throw new Error("프로필 사진 편집용 캔버스를 만들지 못했습니다.");
  l.scale(o, o), l.imageSmoothingQuality = "high", l.clearRect(0, 0, Z, Z);
  const f = Z / Math.max(t.circleDiameter, 1), b = t.baseWidth * s.zoom, N = t.baseHeight * s.zoom, d = t.stageWidth / 2 + s.panX - b / 2 - (t.stageWidth / 2 - t.circleRadius), A = t.stageHeight / 2 + s.panY - N / 2 - (t.stageHeight / 2 - t.circleRadius);
  l.save(), l.beginPath(), l.arc(
    Z / 2,
    Z / 2,
    Z / 2,
    0,
    Math.PI * 2
  ), l.closePath(), l.clip(), l.drawImage(
    e,
    d * f,
    A * f,
    b * f,
    N * f
  ), l.restore(), i.toBlob((C) => {
    if (C) {
      r(C);
      return;
    }
    a(new Error("프로필 사진 편집용 이미지를 만들지 못했습니다."));
  }, "image/png");
}), wr = (e) => {
  if (!ce(e))
    return null;
  const t = ce(e.profile) ? e.profile : null, s = ce(e.dashboard) ? e.dashboard : null, r = s && ce(s.profile) ? s.profile : null, a = ce(e.data) ? e.data : null, i = [
    e.avatarUrl,
    t == null ? void 0 : t.avatarUrl,
    s == null ? void 0 : s.avatarUrl,
    r == null ? void 0 : r.avatarUrl,
    a == null ? void 0 : a.avatarUrl
  ];
  for (const o of i)
    if (typeof o == "string") {
      const l = o.trim();
      if (l.length > 0)
        return l;
    }
  return null;
}, Ir = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, Ar = () => {
  var qe, Ge, Xe, Ze, Qe, Je;
  const { refreshDashboard: e, state: t } = oe(), s = t.profile ?? Q, r = (qe = t.stats) != null && qe.length ? t.stats : _e, a = s.passport, [i, o] = c.useState(() => Ee(s)), [l, f] = c.useState(() => Ee(s)), [b, N] = c.useState(!1), [d, A] = c.useState("profile"), [C, g] = c.useState(!1), [y, S] = c.useState(null), [j, p] = c.useState(null), [k, M] = c.useState(!1), [U, z] = c.useState(null), [R, T] = c.useState(null), [I, P] = c.useState({ panX: 0, panY: 0, zoom: 1 }), [v, B] = c.useState({ height: 320, width: 320 }), [w, h] = c.useState(!1), [_, Y] = c.useState(!1), q = c.useRef(null), D = c.useRef(null), J = c.useRef(null), X = c.useRef(null), W = V(U) ?? s.avatarUrl ?? null, Ft = (l.nickname.trim().charAt(0) || l.name.trim().charAt(0) || ((Ge = i.nickname) == null ? void 0 : Ge.trim().charAt(0)) || i.name.trim().charAt(0) || ((Xe = Q.nickname) == null ? void 0 : Xe.trim().charAt(0)) || Q.name.trim().charAt(0) || "J").toUpperCase(), Wt = l.nickname.trim() || l.name.trim() || ((Ze = i.nickname) == null ? void 0 : Ze.trim()) || i.name.trim() || ((Qe = Q.nickname) == null ? void 0 : Qe.trim()) || Q.name.trim(), Ht = ge(l.bio) || ge(i.bio), Ne = l.nickname.trim().length > 0 && l.nickname.trim().length < 2 ? "닉네임은 2자 이상부터 가능합니다" : null;
  c.useEffect(() => {
    b && window.lucide && window.lucide.createIcons();
  }, [W, b, d]), c.useEffect(() => {
    if (!b)
      return;
    const m = document.body.style.overflow, x = document.documentElement.style.overflow;
    return document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", () => {
      document.body.style.overflow = m, document.documentElement.style.overflow = x;
    };
  }, [b]), c.useEffect(() => {
    const m = Ee(s);
    b || (o(m), f(m));
  }, [s, b]), c.useEffect(() => {
    if (!b || d !== "avatar" || !J.current)
      return;
    const m = () => {
      var H;
      const O = (H = J.current) == null ? void 0 : H.getBoundingClientRect();
      O && B({
        height: Math.max(1, Math.round(O.height)),
        width: Math.max(1, Math.round(O.width))
      });
    };
    m();
    const x = new ResizeObserver(m);
    return x.observe(J.current), () => x.disconnect();
  }, [R, b, d]), c.useEffect(() => {
    if (!R || !w || !D.current)
      return;
    const m = te(D.current, v.width, v.height);
    m && P((x) => ye(x, m));
  }, [w, R, v.height, v.width]);
  const Kt = () => {
    const m = D.current;
    if (!m)
      return;
    const x = te(m, v.width, v.height);
    if (!x) {
      p("이미지 크기를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    h(!0), P(ye({ panX: 0, panY: 0, zoom: x.minZoom }, x)), p(null);
  }, Se = () => {
    T(null), P({ panX: 0, panY: 0, zoom: 1 }), h(!1), p(null), M(!1), Y(!1), X.current = null;
  }, Vt = () => {
    f(i), S(null), A("profile"), z((m) => V(m) ?? s.avatarUrl ?? null), Se(), N(!0);
  }, $e = () => {
    f(i), S(null), A("profile"), Se(), N(!1);
  }, Oe = () => {
    A("avatar"), Se();
  }, Be = () => {
    var m;
    (m = q.current) == null || m.click();
  }, Yt = async (m) => {
    var O;
    const x = (O = m.target.files) == null ? void 0 : O[0];
    if (m.target.value = "", !!x) {
      if (!x.type.startsWith("image/")) {
        p("이미지 파일만 선택해 주세요.");
        return;
      }
      if (x.size > hr) {
        p("프로필 사진은 5MB 이하로 선택해 주세요.");
        return;
      }
      try {
        const H = await jr(x);
        T(H), P({ panX: 0, panY: 0, zoom: 1 }), h(!1), p(null);
      } catch {
        p("이미지를 불러오지 못했습니다. 다른 파일로 다시 선택해 주세요.");
      }
    }
  }, qt = (m) => {
    D.current && P(
      (x) => Nr(
        x,
        D.current,
        v.width,
        v.height,
        m
      )
    );
  }, Gt = (m) => {
    !R || !w || !D.current || !te(D.current, v.width, v.height) || (m.preventDefault(), m.currentTarget.setPointerCapture(m.pointerId), X.current = {
      pointerId: m.pointerId,
      startClientX: m.clientX,
      startClientY: m.clientY,
      startPanX: I.panX,
      startPanY: I.panY
    }, Y(!0));
  }, Xt = (m) => {
    const x = X.current;
    if (!x || x.pointerId !== m.pointerId || !w || !D.current)
      return;
    const O = {
      panX: x.startPanX + (m.clientX - x.startClientX),
      panY: x.startPanY + (m.clientY - x.startClientY),
      zoom: I.zoom
    };
    qt(O);
  }, Fe = (m) => {
    const x = X.current;
    !x || x.pointerId !== m.pointerId || (X.current = null, Y(!1), m.currentTarget.hasPointerCapture(m.pointerId) && m.currentTarget.releasePointerCapture(m.pointerId));
  }, Zt = (m) => {
    !R || !w || !D.current || (m.preventDefault(), m.stopPropagation(), P((x) => {
      const O = D.current;
      if (!O)
        return x;
      const H = te(O, v.width, v.height);
      if (!H)
        return x;
      const le = Math.exp(-m.deltaY * 12e-4), ue = xe(x.zoom * le, H.minZoom, H.maxZoom), re = ue / Math.max(x.zoom, 1e-4);
      return ye(
        {
          panX: x.panX * re,
          panY: x.panY * re,
          zoom: ue
        },
        H
      );
    }));
  }, Qt = async () => {
    if (!R || !w || !D.current) {
      p("먼저 이미지를 선택해 주세요.");
      return;
    }
    const m = te(D.current, v.width, v.height);
    if (!m) {
      p("이미지 정보를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    M(!0), p(null);
    try {
      const x = await Sr(D.current, m, I), O = new File([x], "avatar.png", { type: "image/png" }), H = new FormData();
      H.append("avatar", O);
      const le = await fetch(ht("/api/mypage/avatar"), {
        body: H,
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      });
      if (le.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!le.ok)
        throw new Error("프로필 사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const ue = await le.json().catch(() => null), re = V(wr(ue));
      re && z(re);
      const an = await e();
      !re && an && z(null), A("profile");
    } catch (x) {
      p(x instanceof Error ? x.message : "프로필 사진 적용에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      M(!1);
    }
  }, Jt = async () => {
    const m = br(l);
    if (!pt(m)) {
      S(Ne ?? "닉네임, 이메일, 휴대전화 정보를 확인해 주세요.");
      return;
    }
    g(!0), S(null);
    try {
      const x = await fetch(ht("/api/mypage/profile"), {
        body: JSON.stringify(m),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PUT"
      });
      if (x.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!x.ok)
        throw new Error("프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      if (!await e())
        throw new Error("저장은 완료되었지만 최신 정보를 다시 불러오지 못했습니다.");
      N(!1), A("profile");
    } catch (x) {
      S(x instanceof Error ? x.message : "프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      g(!1);
    }
  }, en = C || !pt(l), L = R && w && D.current ? te(D.current, v.width, v.height) : null, We = L ? L.baseWidth * I.zoom : 0, He = L ? L.baseHeight * I.zoom : 0, tn = L ? L.stageWidth / 2 + I.panX - We / 2 : 0, nn = L ? L.stageHeight / 2 + I.panY - He / 2 : 0, Ke = (L == null ? void 0 : L.circleDiameter) ?? 0, se = (L == null ? void 0 : L.circleRadius) ?? 0, sn = {
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
  }, rn = L ? {
    display: "block",
    height: `${He}px`,
    left: `${tn}px`,
    maxHeight: "none",
    maxWidth: "none",
    objectFit: "contain",
    pointerEvents: "none",
    position: "absolute",
    top: `${nn}px`,
    userSelect: "none",
    width: `${We}px`
  } : {
    display: "block",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    width: "auto"
  }, Ve = L ? {
    background: "rgba(20, 24, 31, 0.14)",
    inset: 0,
    maskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, se - 2)}px, black ${Math.max(0, se - 1)}px, black 100%)`,
    WebkitMaskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, se - 2)}px, black ${Math.max(0, se - 1)}px, black 100%)`,
    pointerEvents: "none",
    position: "absolute"
  } : null, Ye = L ? {
    border: "2px dashed rgba(255, 255, 255, 0.94)",
    borderRadius: "50%",
    boxShadow: "0 0 0 1px rgba(17, 24, 39, 0.14)",
    height: `${Ke}px`,
    left: `calc(50% - ${se}px)`,
    pointerEvents: "none",
    position: "absolute",
    top: `calc(50% - ${se}px)`,
    width: `${Ke}px`
  } : null;
  return /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
    /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ n.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ n.jsxs(ae, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ n.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ n.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: Vt, children: "내 정보 수정" })
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "닉네임" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", style: i.nickname ? void 0 : { color: "#9ca3af" }, children: (Je = i.nickname) != null && Je.trim() ? i.nickname : "설정하지 않음" })
            ] }),
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "이메일" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", children: i.email })
            ] }),
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "휴대전화" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", children: i.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs(ae, { className: "passport-info-box meta-glass-theme", children: [
          /* @__PURE__ */ n.jsx("div", { className: "box-head", children: /* @__PURE__ */ n.jsx("h3", { children: "패스포트 정보" }) }),
          /* @__PURE__ */ n.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ n.jsx(
              "div",
              {
                className: "passport-visual soft-radius",
                style: a ? void 0 : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" },
                children: /* @__PURE__ */ n.jsxs("div", { className: "pass-meta", children: [
                  /* @__PURE__ */ n.jsx("span", { className: "pass-num", children: (a == null ? void 0 : a.number) ?? "미등록" }),
                  /* @__PURE__ */ n.jsx("span", { className: "pass-country", children: (a == null ? void 0 : a.issuingCountry) ?? "해외 여행 전에 여권 정보를 등록해 주세요." })
                ] })
              }
            ),
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: a ? "여권 만료일" : "등록 상태" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", children: (a == null ? void 0 : a.expiryDate) ?? "등록 필요" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs(ae, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ n.jsx("div", { className: "box-head", children: /* @__PURE__ */ n.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ n.jsx("div", { className: "benefit-tiles", children: r.slice(0, 2).map((m) => /* @__PURE__ */ n.jsxs("div", { className: `benefit-tile tone-${m.tone} soft-radius`, children: [
            /* @__PURE__ */ n.jsx("span", { className: "benefit-label", children: m.label }),
            /* @__PURE__ */ n.jsx("strong", { className: "benefit-value", style: Ir(m.tone), children: m.value }),
            /* @__PURE__ */ n.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, m.label)) })
        ] })
      ] })
    ] }),
    b ? /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay", onClick: $e, children: /* @__PURE__ */ n.jsx(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (m) => m.stopPropagation(),
        style: { padding: "36px" },
        children: d === "profile" ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
          /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
            /* @__PURE__ */ n.jsx("span", { style: { color: "#6b7280", fontSize: "13px", fontWeight: 700, lineHeight: 1.4 }, children: "공용 프로필 미리보기 - 눌러서 이미지 변경" }),
            /* @__PURE__ */ n.jsxs(
              "div",
              {
                className: "profile-link-preview soft-radius",
                role: "button",
                tabIndex: 0,
                onClick: Oe,
                onKeyDown: (m) => {
                  (m.key === "Enter" || m.key === " ") && (m.preventDefault(), Oe());
                },
                children: [
                  /* @__PURE__ */ n.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", style: { position: "relative" }, children: [
                    /* @__PURE__ */ n.jsx("span", { style: xr, children: W ? /* @__PURE__ */ n.jsx("img", { alt: "", className: "profile-link-preview-image", src: W, style: yr }) : /* @__PURE__ */ n.jsx("span", { style: vr, children: Ft }) }),
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                  ] }),
                  /* @__PURE__ */ n.jsxs("div", { className: "profile-link-copy", children: [
                    /* @__PURE__ */ n.jsx("strong", { children: Wt }),
                    /* @__PURE__ */ n.jsx("span", { children: Ht })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ n.jsxs(
            "div",
            {
              className: "box-body",
              style: { display: "flex", flexDirection: "column", gap: "18px", padding: 0, width: "100%" },
              children: [
                /* @__PURE__ */ n.jsxs(
                  "div",
                  {
                    className: "info-row",
                    style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" },
                    children: [
                      /* @__PURE__ */ n.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "한 줄 소개" }),
                      /* @__PURE__ */ n.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ n.jsx(
                        "input",
                        {
                          className: "id-input",
                          maxLength: Bt,
                          type: "text",
                          value: l.bio,
                          onChange: (m) => f((x) => ({
                            ...x,
                            bio: ge(m.target.value)
                          })),
                          placeholder: "한 줄 소개를 입력해 주세요",
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ n.jsxs(
                  "div",
                  {
                    className: "info-row",
                    style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" },
                    children: [
                      /* @__PURE__ */ n.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "닉네임" }),
                      /* @__PURE__ */ n.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ n.jsx(
                        "input",
                        {
                          className: "id-input",
                          type: "text",
                          value: l.nickname,
                          onChange: (m) => f((x) => ({ ...x, nickname: m.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) }),
                      Ne ? /* @__PURE__ */ n.jsx("div", { style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, lineHeight: 1.4 }, children: Ne }) : null
                    ]
                  }
                ),
                /* @__PURE__ */ n.jsxs(
                  "div",
                  {
                    className: "info-row",
                    style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" },
                    children: [
                      /* @__PURE__ */ n.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "이메일" }),
                      /* @__PURE__ */ n.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ n.jsx(
                        "input",
                        {
                          className: "id-input",
                          type: "email",
                          value: l.email,
                          onChange: (m) => f((x) => ({ ...x, email: m.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) })
                    ]
                  }
                ),
                /* @__PURE__ */ n.jsxs(
                  "div",
                  {
                    className: "info-row",
                    style: { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px", padding: 0, borderBottom: "none" },
                    children: [
                      /* @__PURE__ */ n.jsx("span", { className: "label", style: { fontSize: "15px" }, children: "휴대전화" }),
                      /* @__PURE__ */ n.jsx("div", { style: { width: "100%" }, children: /* @__PURE__ */ n.jsx(
                        "input",
                        {
                          className: "id-input",
                          type: "tel",
                          value: l.phone,
                          onChange: (m) => f((x) => ({ ...x, phone: m.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) })
                    ]
                  }
                )
              ]
            }
          ),
          y ? /* @__PURE__ */ n.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: y }) : null,
          C ? /* @__PURE__ */ n.jsx("div", { "aria-live": "polite", role: "status", style: { color: "#4b5563", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: "저장 중..." }) : null,
          /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: $e, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ n.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: Jt,
                disabled: en,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
          /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "프로필 사진 편집" }) }) }),
          /* @__PURE__ */ n.jsx("input", { ref: q, accept: "image/*", hidden: !0, type: "file", onChange: Yt }),
          /* @__PURE__ */ n.jsx("div", { className: "profile-avatar-editor soft-radius", children: /* @__PURE__ */ n.jsx("div", { className: "profile-avatar-editor-preview", children: /* @__PURE__ */ n.jsx(
            "div",
            {
              ref: J,
              onPointerCancel: Fe,
              onPointerDown: Gt,
              onPointerMove: Xt,
              onPointerUp: Fe,
              onWheel: Zt,
              style: {
                ...sn,
                cursor: R ? _ ? "grabbing" : "grab" : "default"
              },
              children: R ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
                /* @__PURE__ */ n.jsx(
                  "img",
                  {
                    ref: D,
                    alt: "프로필 사진 편집 미리보기",
                    draggable: !1,
                    src: R,
                    style: rn,
                    onLoad: Kt
                  }
                ),
                Ve ? /* @__PURE__ */ n.jsx("div", { style: Ve }) : null,
                Ye ? /* @__PURE__ */ n.jsx("div", { style: Ye }) : null
              ] }) : /* @__PURE__ */ n.jsx(
                "button",
                {
                  className: "profile-avatar-editor-empty",
                  type: "button",
                  onClick: Be,
                  children: "사진 선택"
                }
              )
            }
          ) }) }),
          R ? /* @__PURE__ */ n.jsx("div", { style: { display: "flex", justifyContent: "center", marginTop: "-4px" }, children: /* @__PURE__ */ n.jsx(
            "button",
            {
              type: "button",
              onClick: Be,
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
          j ? /* @__PURE__ */ n.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: j }) : null,
          /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "10px", gap: "14px" }, children: [
            /* @__PURE__ */ n.jsx(
              "button",
              {
                className: "cancel-btn pill-shape",
                type: "button",
                onClick: () => {
                  A("profile"), p(null);
                },
                style: { padding: "18px 0", fontSize: "15px" },
                children: "이전"
              }
            ),
            /* @__PURE__ */ n.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: Qt,
                disabled: !R || !w || k,
                style: { padding: "18px 0", fontSize: "15px" },
                children: k ? "적용 중..." : "적용"
              }
            )
          ] })
        ] })
      }
    ) }) : null
  ] });
}, Er = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"]
}, kr = () => typeof document > "u" ? !1 : Array.from(document.querySelectorAll("link[href], script[src]")).some((e) => (e.getAttribute("href") ?? e.getAttribute("src") ?? "").includes("/front-mirror/")), ft = (e, t = !1) => {
  const s = e === "qna" ? "qna" : e === "notice" ? "notice" : "faq", [r, a] = Er[s];
  return t ? a : r;
}, Cr = () => {
  const { state: e } = oe(), t = e.supportItems ?? [], [s] = c.useState(kr), [r, a] = c.useState({});
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-support", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "고객지원" }),
      /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "여행 중 궁금한 점을 전문가와 상담하세요." })
    ] }),
    /* @__PURE__ */ n.jsx("div", { className: "support-bento-grid bento-grid", children: t.map((i) => /* @__PURE__ */ n.jsxs("a", { className: `support-item-card bento-item meta-glass-theme soft-radius ${i.id}`, href: i.href, children: [
      /* @__PURE__ */ n.jsx("div", { className: "sp-icon", children: /* @__PURE__ */ n.jsx(
        "img",
        {
          alt: i.label,
          onError: (o) => {
            r[i.id] || s || (a((l) => ({
              ...l,
              [i.id]: !0
            })), o.currentTarget.src = ft(i.id, !0));
          },
          src: ft(i.id, s || r[i.id] === !0)
        }
      ) }),
      /* @__PURE__ */ n.jsxs("div", { className: "sp-text", children: [
        /* @__PURE__ */ n.jsx("strong", { className: "sp-label", children: i.label }),
        i.count !== null ? /* @__PURE__ */ n.jsxs("span", { className: `sp-badge pill-shape ${i.count > 0 ? "active" : ""}`, children: [
          i.count,
          " 건"
        ] }) : /* @__PURE__ */ n.jsx("span", { className: "sp-link-text", children: "상세 보기" })
      ] })
    ] }, i.id)) })
  ] });
}, Mr = () => /* @__PURE__ */ n.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ n.jsx(Ts, {}),
  /* @__PURE__ */ n.jsx(Ks, {}),
  /* @__PURE__ */ n.jsx(pr, {}),
  /* @__PURE__ */ n.jsx(Ar, {}),
  /* @__PURE__ */ n.jsx(Cr, {})
] }), _r = () => /* @__PURE__ */ n.jsx(fs, { children: /* @__PURE__ */ n.jsx(Mr, {}) });
export {
  _r as M
};
