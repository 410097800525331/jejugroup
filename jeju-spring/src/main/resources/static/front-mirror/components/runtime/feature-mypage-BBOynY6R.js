import { j as n, a as p } from "./react-vendor-BoSfm_Te.js";
import { A as fe } from "./legacy-core-BoI547nw.js";
const _t = /^[a-zA-Z][a-zA-Z\d+\-.]*:/, ge = {
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
}, Ve = [
  { label: "보유 포인트", tone: "point", value: "0P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "0장" },
  { label: "다가오는 여행", tone: "air", value: "0건" }
], Xe = [
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
], qe = {
  id: "",
  isMember: !1,
  name: ""
}, Pt = {
  checked: !1,
  id: "",
  label: "",
  ownerId: "",
  ownerName: "",
  status: "reserved",
  type: "voucher"
}, Lt = {
  activities: [],
  companions: [],
  date: "",
  googleMapUrl: "",
  id: "",
  time: "",
  title: ""
}, Ot = [], Ut = [], q = (e) => {
  const t = d(e);
  if (t)
    return t.startsWith("data:") || t.startsWith("blob:") || t.startsWith("//") || _t.test(t) ? t : `${fe}${t}`;
};
function Ge({
  currentAccountId: e,
  linkedCompanions: t,
  travelEvents: s
}) {
  const a = new Map(t.map((i) => [i.id, i])), o = /* @__PURE__ */ new Set([
    ...e ? [e] : [],
    ...t.map((i) => i.id)
  ]), r = /* @__PURE__ */ new Map();
  for (const i of s) {
    if (o.size > 0 && !o.has(i.ownerId))
      continue;
    const l = r.get(i.dayId), x = {
      checked: i.status === "used",
      id: i.id,
      label: i.activityLabel,
      ownerId: i.ownerId,
      ownerName: i.ownerName,
      status: i.status,
      type: i.type
    };
    if (l) {
      if (l.activities.push(x), i.ownerId !== e && a.has(i.ownerId)) {
        const h = a.get(i.ownerId);
        h && !l.companions.some((v) => v.id === h.id) && l.companions.push({ ...h });
      }
      continue;
    }
    r.set(i.dayId, {
      activities: [x],
      companions: i.ownerId !== e && a.has(i.ownerId) ? [{ ...a.get(i.ownerId) }] : [],
      date: i.date,
      googleMapUrl: i.googleMapUrl,
      id: i.dayId,
      sortKey: `${i.date} ${i.time}`,
      time: i.time,
      title: i.title
    });
  }
  return Array.from(r.values()).sort((i, l) => i.sortKey.localeCompare(l.sortKey)).map(({ sortKey: i, ...l }) => l);
}
const O = et(ge), ye = se(Ve), Bt = tt(Xe), ve = je(Ot), be = Ne(Ut), Ze = Ge({
  currentAccountId: ge.id ?? "",
  linkedCompanions: ve,
  travelEvents: be
}), Qe = [
  { count: 0, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], Je = () => ({
  bookings: tt(Xe),
  itinerary: nt(Ze),
  linkedCompanions: je(ve),
  profile: et(ge),
  stats: se(Ve),
  supportItems: st(Qe),
  travelEvents: Ne(be)
}), de = (e) => {
  const t = Je(), s = Xt(e);
  if (!cn(s))
    return t;
  const o = qt(s, t.profile), r = sn(s.linkedCompanions, t.linkedCompanions), i = an(s.travelEvents, t.travelEvents), l = s.travelEvents !== void 0 ? Ge({
    currentAccountId: o.id ?? t.profile.id ?? "",
    linkedCompanions: r,
    travelEvents: i
  }) : tn(s.itinerary, t.itinerary);
  return {
    bookings: en(s.bookings, t.bookings),
    itinerary: l,
    linkedCompanions: r,
    profile: o,
    stats: Qt(s.stats ?? s, t.stats),
    supportItems: nn(s.supportItems ?? s.support ?? s.inquiries, t.supportItems),
    travelEvents: i
  };
}, J = (e) => {
  $t(O, e.profile), Ft(ye, e.stats), Ht(Bt, e.bookings), Wt(Ze, e.itinerary), Kt(ve, e.linkedCompanions), Yt(Qe, e.supportItems), Vt(be, e.travelEvents);
};
function et(e) {
  return {
    avatarUrl: e.avatarUrl,
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function se(e) {
  return e.map((t) => ({ ...t }));
}
function tt(e) {
  return e.map((t) => ({
    ...t,
    tags: [...t.tags]
  }));
}
function je(e) {
  return e.map((t) => ({ ...t }));
}
function nt(e) {
  return e.map((t) => ({
    ...t,
    activities: t.activities.map((s) => ({ ...s })),
    companions: t.companions.map((s) => ({ ...s }))
  }));
}
function st(e) {
  return e.map((t) => ({ ...t }));
}
function Ne(e) {
  return e.map((t) => ({ ...t }));
}
const $t = (e, t) => {
  if (e.avatarUrl = t.avatarUrl, e.bio = t.bio, e.email = t.email, e.memberships.splice(0, e.memberships.length, ...t.memberships), e.name = t.name, e.nickname = t.nickname, e.phone = t.phone, e.tier = t.tier, e.role = t.role, e.id = t.id, t.passport) {
    e.passport = { ...t.passport };
    return;
  }
  delete e.passport;
}, Ft = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, Ht = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((s) => ({
      ...s,
      tags: [...s.tags]
    }))
  );
}, Wt = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((s) => ({
      ...s,
      activities: s.activities.map((a) => ({ ...a })),
      companions: s.companions.map((a) => ({ ...a }))
    }))
  );
}, Kt = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, Yt = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, Vt = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, Xt = (e) => {
  const t = {}, s = (a) => {
    M(a) && Object.assign(t, a);
  };
  return s(e), M(e) && (s(e.user), s(e.member), s(e.profile), s(e.data), s(e.session)), t;
}, qt = (e, t) => {
  const s = Gt(e.memberships, e.tier ?? e.role), a = Zt(e.passport), o = d(e.tier) ?? s[0] ?? d(e.role), r = d(e.id) ?? d(e.memberId) ?? d(e.userId), i = d(e.name) ?? d(e.displayName) ?? d(e.fullName) ?? d(e.nickname) ?? d(e.id) ?? d(e.memberId) ?? d(e.userId) ?? t.name, l = d(e.nickname), x = bn(
    z(e, "bio") ?? z(e, "intro") ?? z(e.profile, "bio") ?? z(e.profile, "intro") ?? z(e.user, "bio") ?? z(e.user, "intro") ?? z(e.member, "bio") ?? z(e.member, "intro") ?? z(e.data, "bio") ?? z(e.data, "intro") ?? t.bio
  );
  return {
    avatarUrl: q(e.avatarUrl),
    bio: x,
    email: d(e.email) ?? on(e, r, i) ?? t.email,
    id: r ?? t.id,
    memberships: s,
    name: i,
    nickname: l,
    passport: a,
    phone: d(e.phone) ?? d(e.mobile) ?? "미등록",
    role: d(e.role),
    tier: o
  };
}, Gt = (e, t) => {
  const s = Array.isArray(e) ? e.map((o) => d(o)).filter((o) => !!o) : [];
  if (s.length > 0)
    return s;
  const a = d(t);
  return a ? [a] : [];
}, Zt = (e) => {
  const t = M(e) ? e : null;
  if (!t)
    return;
  const s = {
    expiryDate: d(t == null ? void 0 : t.expiryDate) ?? "",
    issuingCountry: d(t == null ? void 0 : t.issuingCountry) ?? "",
    number: d(t == null ? void 0 : t.number) ?? ""
  };
  if (!(!s.expiryDate && !s.issuingCountry && !s.number))
    return s;
}, Qt = (e, t) => Array.isArray(e) && e.length > 0 ? t.map((s, a) => Jt(e[a], s, !0)) : Array.isArray(e) && e.length === 0 ? se(t) : M(e) ? rn(e, t) : se(t), Jt = (e, t, s = !1) => {
  const a = M(e) ? e : {}, o = jn(a.tone) ? a.tone : t.tone, r = d(a.label) ?? t.label, i = a.value ?? t.value;
  return {
    label: r,
    tone: o,
    value: ue(i, t)
  };
}, ue = (e, t) => {
  const s = d(e);
  if (!s)
    return t.value;
  if (!/^\d+(?:\.\d+)?$/.test(s))
    return s;
  const a = Number(s);
  if (!Number.isFinite(a))
    return s;
  const o = a.toLocaleString("ko-KR");
  switch (t.tone) {
    case "coupon":
      return `${o}장`;
    case "point":
      return `${o}P`;
    case "air":
      return `${o}건`;
    default:
      return s;
  }
}, en = (e, t) => Array.isArray(e) ? e.length === 0 ? [] : e.map((s, a) => dn(s, t[a % t.length] ?? t[0], !0)) : [], tn = (e, t) => !Array.isArray(e) || e.length === 0 ? nt(t) : e.map(
  (s, a) => pn(
    s,
    t.length > 0 ? t[a % t.length] ?? t[0] : Lt
  )
), nn = (e, t) => !Array.isArray(e) || e.length === 0 ? st(t) : e.map((s, a) => hn(s, t[a % t.length] ?? t[0])), sn = (e, t) => !Array.isArray(e) || e.length === 0 ? je(t) : e.map(
  (s, a) => fn(
    s,
    t.length > 0 ? t[a % t.length] ?? t[0] : qe
  )
), at = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => gn(t)).filter((t) => t !== null), an = (e, t) => {
  const s = at(e);
  return s.length > 0 ? s : Ne(t);
}, rn = (e, t) => t.map((s) => {
  const a = vn(e, yn(s.tone));
  return a === void 0 ? { ...s } : {
    ...s,
    value: ue(a, s)
  };
}), on = (e, t, s) => {
  const a = t ?? d(e.memberId) ?? d(e.userId) ?? d(e.username) ?? d(e.loginId) ?? ln(s);
  if (a)
    return `${a}@jejugroup.example`;
}, ln = (e) => {
  const s = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return s.length > 0 ? s : void 0;
}, cn = (e) => [
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
].some((s) => s in e), dn = (e, t, s = !1) => {
  const a = M(e) ? e : {}, o = Array.isArray(a.tags) ? a.tags.map((i) => d(i)).filter((i) => !!i) : [], r = Se(a.type) ? a.type : t.type;
  return {
    amount: d(a.amount) ?? (s ? "" : t.amount),
    date: d(a.date) ?? (s ? "" : t.date),
    duration: d(a.duration) ?? (s ? void 0 : t.duration),
    id: d(a.id) ?? (s ? "" : t.id),
    paymentMethod: d(a.paymentMethod) ?? (s ? void 0 : t.paymentMethod),
    status: d(a.status) ?? (s ? "" : t.status),
    tags: o.length > 0 ? o : s ? [] : [...t.tags],
    title: d(a.title) ?? (s ? "" : t.title),
    type: r,
    voucherUrl: d(a.voucherUrl) ?? (s ? void 0 : t.voucherUrl)
  };
}, pn = (e, t) => {
  const s = M(e) ? e : {}, a = Array.isArray(s.activities) ? s.activities.map(
    (r, i) => mn(
      r,
      t.activities.length > 0 ? t.activities[i % t.activities.length] ?? t.activities[0] : Pt
    )
  ) : t.activities.map((r) => ({ ...r })), o = Array.isArray(s.companions) ? s.companions.map(
    (r, i) => un(
      r,
      t.companions.length > 0 ? t.companions[i % t.companions.length] ?? t.companions[0] : qe
    )
  ) : t.companions.map((r) => ({ ...r }));
  return {
    activities: a,
    companions: o,
    date: d(s.date) ?? t.date,
    googleMapUrl: d(s.googleMapUrl) ?? t.googleMapUrl,
    id: d(s.id) ?? t.id,
    time: d(s.time) ?? t.time,
    title: d(s.title) ?? t.title
  };
}, mn = (e, t) => {
  const s = M(e) ? e : {};
  return {
    checked: typeof s.checked == "boolean" ? s.checked : he(s.status) ? s.status === "used" : t.checked,
    id: d(s.id) ?? t.id,
    label: d(s.label) ?? t.label,
    ownerId: d(s.ownerId) ?? t.ownerId,
    ownerName: d(s.ownerName) ?? t.ownerName,
    status: he(s.status) ? s.status : t.status,
    type: Se(s.type) ? s.type : t.type
  };
}, un = (e, t) => {
  const s = M(e) ? e : {};
  return {
    id: d(s.id) ?? t.id,
    isMember: typeof s.isMember == "boolean" ? s.isMember : t.isMember,
    name: d(s.name) ?? t.name
  };
}, hn = (e, t) => {
  const s = M(e) ? e : {};
  return {
    count: xn(s.count, t.count),
    href: d(s.href) ?? t.href,
    id: d(s.id) ?? t.id,
    label: d(s.label) ?? t.label
  };
}, xn = (e, t) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const s = d(e);
  if (!s)
    return t;
  const a = Number(s);
  return Number.isFinite(a) ? a : t;
}, fn = (e, t) => {
  const s = M(e) ? e : {};
  return {
    id: d(s.id) ?? t.id,
    isMember: typeof s.isMember == "boolean" ? s.isMember : t.isMember,
    name: d(s.name) ?? t.name
  };
}, gn = (e) => {
  const t = M(e) ? e : null;
  if (!t)
    return null;
  const s = d(t.id), a = d(t.dayId), o = d(t.title), r = d(t.date), i = d(t.time), l = d(t.activityLabel), x = d(t.ownerId), h = d(t.ownerName), v = d(t.googleMapUrl);
  return !s || !a || !o || !r || !i || !l || !x || !h || !v ? null : {
    activityLabel: l,
    date: r,
    dayId: a,
    googleMapUrl: v,
    id: s,
    ownerId: x,
    ownerName: h,
    status: he(t.status) ? t.status : "reserved",
    time: i,
    title: o,
    type: Se(t.type) ? t.type : "voucher"
  };
}, yn = (e) => {
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
}, vn = (e, t) => {
  for (const s of t)
    if (s in e) {
      const a = e[s];
      if (a != null)
        return Array.isArray(a) ? a.length : a;
    }
}, M = (e) => e !== null && typeof e == "object" && !Array.isArray(e), d = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, z = (e, t) => {
  if (M(e))
    return d(e[t]);
}, bn = (e) => Array.from((e ?? "").trim()).slice(0, 20).join(""), Se = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", he = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", jn = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", W = ({ children: e, className: t = "" }) => {
  const s = ["bento-box", "soft-radius", t].filter(Boolean).join(" ");
  return /* @__PURE__ */ n.jsx("div", { className: s, children: e });
}, xe = "jeju:mypage-dashboard-mock-updated", rt = "jeju:mypage-dashboard:", Nn = ["id", "memberId", "userId", "email", "loginId", "username"], it = ["user", "member", "profile", "data", "session"], D = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Sn = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, wn = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), An = (e) => {
  const t = [];
  if (!D(e))
    return t;
  t.push(e);
  for (const s of it) {
    const a = e[s];
    D(a) && t.push(a);
  }
  return t;
}, ot = (e) => {
  const t = An(e);
  for (const s of t)
    for (const a of Nn) {
      const o = Sn(s[a]);
      if (!o)
        continue;
      const r = wn(o);
      if (r)
        return r;
    }
  return null;
}, lt = (e) => `${rt}${e}`, En = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return D(t) ? t : null;
  } catch {
    return null;
  }
}, In = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(xe, {
      detail: { accountKey: e }
    })
  );
}, ct = (e) => {
  const t = ot(e);
  return t ? dt(t) : null;
}, dt = (e) => {
  try {
    return En(localStorage.getItem(lt(e)));
  } catch {
    return null;
  }
}, ae = (e, t) => {
  const s = D(e) ? e : {}, a = D(t) ? t : {};
  if (Object.keys(s).length === 0 && Object.keys(a).length === 0)
    return null;
  const o = {
    ...s,
    ...a
  };
  for (const r of it) {
    const i = s[r], l = a[r];
    (D(i) || D(l)) && (o[r] = {
      ...D(i) ? i : {},
      ...D(l) ? l : {}
    });
  }
  return o;
}, kn = (e, t) => {
  const s = ot(e);
  if (!s)
    return !1;
  try {
    return localStorage.setItem(lt(s), JSON.stringify(t)), In(s), !0;
  } catch {
    return !1;
  }
}, Cn = (e, t) => {
  const s = ae(ct(e), t);
  return s ? kn(e, s) : !1;
}, Mn = "userSession", $e = "jeju:session-updated", Tn = "/api/auth/session", Rn = "/api/mypage/dashboard", zn = () => {
  const e = Je();
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
}, Dn = (e, t) => {
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
          activities: s.activities.map((a) => ({ ...a })),
          companions: s.companions.map((a) => ({ ...a }))
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
}, pt = p.createContext(null), mt = (e) => `${fe}${e}`, _n = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Pn = async () => {
  try {
    const e = await fetch(mt(Tn), {
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
}, Ln = async () => {
  try {
    const e = await fetch(mt(Rn), {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    if (e.status === 401 || !e.ok)
      return null;
    const t = await e.json();
    return !_n(t) || t.success !== !0 || !("dashboard" in t) ? null : t.dashboard ?? null;
  } catch {
    return null;
  }
}, On = async () => await Pn(), Un = async (e) => {
  if (!e)
    return null;
  const t = await Ln();
  return t ? ae(e, t) : e;
}, Fe = async () => {
  const e = await On();
  if (!e)
    return null;
  const t = await Un(e);
  return Fn(t);
}, Bn = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), $n = (e, t) => ({
  ...e,
  ...t,
  memberships: t.memberships ? [...t.memberships] : [...e.memberships],
  passport: t.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : t.passport ? { ...t.passport } : void 0
}), Fn = (e) => {
  const t = ae(e, ct(e)), s = de(t);
  if (s.linkedCompanions.length === 0)
    return de(t);
  const a = [
    ...s.travelEvents,
    ...s.linkedCompanions.flatMap((o) => {
      const r = dt(o.id);
      return !r || !("travelEvents" in r) ? [] : at(r.travelEvents).map((i) => ({
        ...i,
        ownerId: i.ownerId || o.id,
        ownerName: i.ownerName || o.name
      }));
    })
  ];
  return de(
    ae(t, {
      linkedCompanions: s.linkedCompanions,
      travelEvents: a
    })
  );
}, Hn = ({ children: e }) => {
  const [t, s] = p.useReducer(Dn, void 0, zn), [a, o] = p.useState(!1), [r, i] = p.useState(!1), l = (f) => {
    J(f), s({ type: "HYDRATE_DASHBOARD", payload: f });
  }, x = (f) => {
    f.type === "HYDRATE_DASHBOARD" ? J(f.payload) : f.type === "PATCH_PROFILE" && J({
      bookings: t.bookings,
      itinerary: t.itinerary,
      linkedCompanions: t.linkedCompanions,
      profile: $n(t.profile, f.payload),
      stats: t.stats,
      supportItems: t.supportItems,
      travelEvents: t.travelEvents
    }), s(f);
  }, h = async () => {
    const f = await Fe();
    return f ? (l(f), !0) : !1;
  };
  p.useEffect(() => {
    J(Bn(t));
  }, [t.bookings, t.itinerary, t.linkedCompanions, t.profile, t.stats, t.supportItems, t.travelEvents]), p.useEffect(() => {
    let f = !0, N = !1;
    const j = async () => {
      const u = await Fe();
      if (!u) {
        if (!f)
          return;
        i(!1), o(!0);
        return;
      }
      f && (i(!0), o(!0), l(u));
    }, g = () => {
      N || (N = !0, j().finally(() => {
        N = !1;
      }));
    };
    g();
    const S = (u) => {
      var T;
      if (u.key === Mn) {
        g();
        return;
      }
      (T = u.key) != null && T.startsWith(rt) && g();
    }, b = () => {
      g();
    }, y = () => {
      g();
    };
    return window.addEventListener("storage", S), window.addEventListener($e, b), window.addEventListener(xe, y), () => {
      f = !1, window.removeEventListener("storage", S), window.removeEventListener($e, b), window.removeEventListener(xe, y);
    };
  }, [s]);
  const v = p.useMemo(
    () => ({
      dispatch: x,
      refreshDashboard: h,
      state: t
    }),
    [x, h, t]
  );
  return !a || !r ? /* @__PURE__ */ n.jsxs("div", { className: "mypage-auth-empty-state soft-radius", role: "status", "aria-live": "polite", children: [
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
  ] }) : /* @__PURE__ */ n.jsx(pt.Provider, { value: v, children: e });
}, G = () => {
  const e = p.useContext(pt);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, ut = (e) => {
  const t = (e == null ? void 0 : e.trim().toLowerCase()) ?? "";
  return t.includes("diamond") || t.includes("다이아") ? "diamond" : t.includes("platinum") || t.includes("플래티넘") ? "platinum" : t.includes("silver") || t.includes("실버") ? "silver" : t.includes("gold") || t.includes("골드") ? "gold" : null;
}, Wn = (e) => ut(e) ?? "neutral", Kn = (e) => {
  switch (ut(e)) {
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
}, He = (e) => {
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
}, pe = (e) => {
  const t = document.querySelector(e);
  if (!t)
    return;
  const s = t.querySelector(".section-title") ?? t, a = document.querySelector("#jeju-page-shell-header .header") ?? document.querySelector(".header"), o = (a == null ? void 0 : a.getBoundingClientRect().height) ?? 72, r = window.scrollY + s.getBoundingClientRect().top - o - 24;
  window.scrollTo({
    top: Math.max(0, r),
    behavior: "smooth"
  });
}, Yn = () => {
  var h, v, f, N;
  const { state: e } = G(), t = e.profile ?? O, s = (h = e.stats) != null && h.length ? e.stats : ye, a = ((v = t.memberships) == null ? void 0 : v[0]) ?? O.memberships[0], o = t.tier ?? a, r = Wn(o), i = Kn(o), l = ((f = t.nickname) == null ? void 0 : f.trim()) || t.name.trim(), x = q(t.avatarUrl) ?? `https://api.dicebear.com/7.x/notionists/svg?seed=${t.name}&backgroundColor=f8f9fa`;
  return p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []), /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ n.jsx(W, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ n.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ n.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: x
          }
        ),
        /* @__PURE__ */ n.jsx("div", { className: `membership-grade-chip soft-radius ${r}`, children: /* @__PURE__ */ n.jsx("span", { children: i }) })
      ] }) }),
      /* @__PURE__ */ n.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ n.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ n.jsx("strong", { className: "highlight", children: l }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ n.jsx("p", { className: "profile-welcome-msg", children: ((N = t.bio) == null ? void 0 : N.trim()) ?? "" }),
        /* @__PURE__ */ n.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => pe(".layer-full-management"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => pe(".layer-itinerary"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => pe(".layer-account-benefits"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ n.jsx("div", { className: "summary-stats-column", children: s.map((j) => /* @__PURE__ */ n.jsxs(W, { className: `stat-card meta-glass-theme tone-${j.tone}`, children: [
      /* @__PURE__ */ n.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ n.jsx("i", { "data-lucide": He(j.tone), className: `lucide-${He(j.tone)}` }) }),
      /* @__PURE__ */ n.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ n.jsx("span", { className: "stat-label", children: j.label }),
        /* @__PURE__ */ n.jsx("strong", { className: "stat-value", children: j.value })
      ] })
    ] }, j.label)) })
  ] });
}, Vn = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, Xn = ({ tone: e, value: t }) => {
  const s = Vn[e];
  return /* @__PURE__ */ n.jsx("span", { className: `pill-shape ${s}`.trim(), children: t });
}, qn = ["all", "air", "stay", "rent", "voucher"], Gn = () => {
  const { dispatch: e, state: t } = G(), s = t.bookings ?? [];
  p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [s, t.filter]);
  const a = p.useMemo(() => t.filter === "all" ? s : s.filter((r) => r.type === t.filter), [s, t.filter]), o = p.useCallback(
    (r) => {
      e({ type: "SET_FILTER", payload: r });
    },
    [e]
  );
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-full-management", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header flex-header", children: [
      /* @__PURE__ */ n.jsxs("div", { className: "title-group", children: [
        /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "나의 예약 현황" }),
        /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 및 바우처를 한눈에 관리하세요." })
      ] }),
      /* @__PURE__ */ n.jsx("div", { className: "booking-filters flex-gap", children: qn.map((r) => /* @__PURE__ */ n.jsx(
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
    /* @__PURE__ */ n.jsx("ul", { className: "full-width-trip-list", children: a.length > 0 ? a.map((r) => /* @__PURE__ */ n.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": r.type, children: [
      /* @__PURE__ */ n.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ n.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ n.jsx(Xn, { tone: r.type, value: r.status }),
          /* @__PURE__ */ n.jsx("div", { className: "trip-tags", children: r.tags.map((i) => /* @__PURE__ */ n.jsx("span", { className: "meta-tag pill-shape", children: i }, i)) })
        ] }),
        /* @__PURE__ */ n.jsx("h3", { className: "trip-title", children: r.title }),
        /* @__PURE__ */ n.jsxs("div", { className: "trip-meta-grid", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "calendar", className: "lucide-calendar" }),
            /* @__PURE__ */ n.jsx("span", { children: r.date }),
            r.duration ? /* @__PURE__ */ n.jsxs("strong", { className: "duration-label", children: [
              "(",
              r.duration,
              ")"
            ] }) : null
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "wallet", className: "lucide-wallet" }),
            /* @__PURE__ */ n.jsx("strong", { children: r.amount }),
            r.paymentMethod ? /* @__PURE__ */ n.jsxs("span", { className: "method-label", children: [
              " / ",
              r.paymentMethod
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n.jsxs("div", { className: "trip-inline-actions", children: [
        /* @__PURE__ */ n.jsxs("div", { className: "action-group", children: [
          r.voucherUrl ? /* @__PURE__ */ n.jsxs("button", { className: "inline-btn primary pill-shape", type: "button", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "download", className: "lucide-download" }),
            "e-티켓 / 바우처"
          ] }) : /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "결제 진행하기" }),
          /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "예약 변경" })
        ] }),
        /* @__PURE__ */ n.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "예약 취소" })
      ] })
    ] }, r.id)) : /* @__PURE__ */ n.jsxs("div", { className: "empty-state-placeholder soft-radius", children: [
      /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
      /* @__PURE__ */ n.jsx("p", { children: "선택하신 카테고리에 해당하는 예약 내역이 없습니다." })
    ] }) })
  ] });
}, Zn = {
  park_jy: { id: "park_jy", name: "박준영" },
  lee_je: { id: "lee_je", name: "이지은" },
  choi_sj: { id: "choi_sj", name: "최수진" }
}, Qn = (e) => e.trim().toLowerCase(), Jn = async (e) => {
  await new Promise((s) => setTimeout(s, 400));
  const t = Zn[e];
  return t ? {
    ...t,
    isMember: !0
  } : null;
}, es = ({
  initialCompanions: e = [],
  lookupMemberById: t = Jn
} = {}) => {
  const [s, a] = p.useState(e), [o, r] = p.useState(""), [i, l] = p.useState(null), [x, h] = p.useState(!1), [v, f] = p.useState(null), N = p.useCallback(async (b) => {
    const y = Qn(b);
    if (!y) {
      f({ message: "검색할 제주그룹 회원 ID를 입력해라" }), l(null);
      return;
    }
    if (!/^[a-z0-9._-]{2,30}$/i.test(y)) {
      f({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), l(null);
      return;
    }
    h(!0), f(null), l(null);
    try {
      const u = await t(y);
      u ? l(u) : f({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" });
    } catch {
      f({ message: "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라" });
    } finally {
      h(!1);
    }
  }, [t]), j = p.useCallback(() => {
    r(""), l(null), f(null);
  }, []), g = p.useCallback((b) => {
    a((y) => y.some((u) => u.id === b.id) ? y : [...y, b]), j();
  }, [j]), S = p.useCallback((b) => {
    a((y) => y.filter((u) => u.id !== b));
  }, []);
  return {
    companions: s,
    searchQuery: o,
    setSearchQuery: r,
    searchResult: i,
    isSearching: x,
    errorObj: v,
    handleSearch: N,
    addCompanion: g,
    removeCompanion: S,
    clearSearch: j
  };
}, ts = ({
  initialCompanions: e,
  isOpen: t,
  onClose: s,
  onSave: a
}) => {
  const {
    companions: o,
    searchQuery: r,
    setSearchQuery: i,
    searchResult: l,
    isSearching: x,
    errorObj: h,
    handleSearch: v,
    addCompanion: f,
    removeCompanion: N,
    clearSearch: j
  } = es({ initialCompanions: e }), g = p.useRef(null), S = l ? o.some((u) => u.id === l.id) : !1;
  if (p.useEffect(() => {
    if (t) {
      j();
      const u = window.setTimeout(() => {
        var T;
        return (T = g.current) == null ? void 0 : T.focus();
      }, 100);
      return () => window.clearTimeout(u);
    }
  }, [t, j]), p.useEffect(() => {
    const u = (T) => {
      T.key === "Escape" && t && s();
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [t, s]), p.useEffect(() => {
    t && window.lucide && window.lucide.createIcons();
  }, [t, l, o, h]), !t) return null;
  const b = (u) => {
    u.preventDefault(), v(r);
  }, y = () => {
    a(o), s();
  };
  return /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: s, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ n.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (u) => u.stopPropagation(),
      style: { padding: "40px" },
      children: [
        /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ n.jsxs("div", { className: "companion-modal-body", children: [
          /* @__PURE__ */ n.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: b, style: { gap: "16px", marginBottom: "32px" }, children: [
            /* @__PURE__ */ n.jsx(
              "input",
              {
                ref: g,
                className: "id-input companion-search-input",
                type: "text",
                placeholder: "제주그룹 회원 ID를 입력해라",
                value: r,
                onChange: (u) => i(u.target.value),
                style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px" },
                autoComplete: "off"
              }
            ),
            /* @__PURE__ */ n.jsx(
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
          h && /* @__PURE__ */ n.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            h.message
          ] }),
          l && /* @__PURE__ */ n.jsxs("div", { className: "search-result-wrap list-item", style: { padding: "20px 24px", marginBottom: "32px", borderRadius: "16px" }, children: [
            /* @__PURE__ */ n.jsxs("div", { className: "companion-result-item item-info", children: [
              /* @__PURE__ */ n.jsxs("div", { className: "companion-avatar soft-radius is-linked", style: { width: "48px", height: "48px", fontSize: "18px", marginLeft: 0 }, children: [
                l.name.charAt(0),
                /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
              ] }),
              /* @__PURE__ */ n.jsxs("div", { className: "user-info name-meta", style: { gap: "4px" }, children: [
                /* @__PURE__ */ n.jsx("strong", { style: { fontSize: "16px" }, children: l.name }),
                /* @__PURE__ */ n.jsxs("span", { style: { fontSize: "14px" }, children: [
                  "@",
                  l.id
                ] }),
                /* @__PURE__ */ n.jsx("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: S ? "이미 연동된 제주그룹 회원" : "연동 가능한 제주그룹 회원" })
              ] })
            ] }),
            /* @__PURE__ */ n.jsx(
              "button",
              {
                className: "add-btn companion-add-btn pill-shape",
                type: "button",
                onClick: () => f(l),
                disabled: S,
                style: { padding: "12px 28px", fontSize: "14px" },
                children: S ? "연동됨" : "추가"
              }
            )
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "linked-companions-section", children: [
            /* @__PURE__ */ n.jsxs("h4", { style: { fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }, children: [
              "연동된 동행자 (",
              o.length,
              "명)"
            ] }),
            o.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 추가해라." }) : /* @__PURE__ */ n.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { gap: "16px", maxHeight: "280px" }, children: o.map((u) => /* @__PURE__ */ n.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ n.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ n.jsxs("div", { className: `companion-avatar soft-radius ${u.isMember ? "is-linked" : ""}`, style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }, children: [
                  u.name.charAt(0),
                  u.isMember && /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator", style: { width: "14px", height: "14px" } })
                ] }),
                /* @__PURE__ */ n.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ n.jsx("strong", { style: { fontSize: "16px" }, children: u.name }),
                  /* @__PURE__ */ n.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    u.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ n.jsx(
                "button",
                {
                  className: "remove-btn companion-remove-btn",
                  onClick: () => N(u.id),
                  style: { padding: "10px 24px", fontSize: "14px" },
                  children: "해제"
                }
              )
            ] }, u.id)) })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "40px", gap: "16px" }, children: [
          /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: s, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ n.jsx("button", { className: "save-btn pill-shape", type: "button", onClick: y, style: { padding: "20px 0", fontSize: "16px" }, children: "적용" })
        ] })
      ]
    }
  ) });
}, ns = (e) => {
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
}, ss = () => {
  const { dispatch: e, state: t } = G(), s = t.itinerary ?? [], a = s.length > 0 ? s : [
    {
      activities: [],
      companions: [],
      date: "일정 미정",
      googleMapUrl: "",
      id: "empty-itinerary",
      time: "시간 미정",
      title: "여행 일정 준비 중"
    }
  ], o = t.linkedCompanions ?? [], r = t.profile, [i, l] = p.useState(!1), [x, h] = p.useState(null), v = p.useRef({}), [f, N] = p.useState({});
  p.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [i, s, o]), p.useLayoutEffect(() => {
    const g = a.reduce((S, b) => {
      var y;
      return S[b.id] = ((y = v.current[b.id]) == null ? void 0 : y.scrollHeight) ?? 0, S;
    }, {});
    N((S) => {
      const b = Object.keys(S), y = Object.keys(g);
      return b.length === y.length && y.every((u) => S[u] === g[u]) ? S : g;
    });
  }, [a, i]);
  const j = (g) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: g }), Cn(
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
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ n.jsxs("div", { className: `itinerary-timeline-wrap ${i ? "is-expanded" : ""}`, children: [
      a.map((g, S) => {
        const b = S < 2, y = b || i, u = f[g.id] ?? 720, T = g.id === "empty-itinerary";
        return /* @__PURE__ */ n.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (w) => {
              v.current[g.id] = w;
            },
            "aria-hidden": !y,
            style: b ? void 0 : {
              overflow: "hidden",
              maxHeight: y ? `${u}px` : "0px",
              opacity: y ? 1 : 0,
              transform: y ? "translateY(0)" : "translateY(-18px)",
              marginBottom: y ? "40px" : "0px",
              pointerEvents: y ? "auto" : "none",
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
                  /* @__PURE__ */ n.jsxs("div", { className: `avatar-stack ${g.companions.length === 0 ? "is-empty" : ""}`, children: [
                    g.companions.map((w) => /* @__PURE__ */ n.jsxs(
                      "div",
                      {
                        className: `companion-avatar soft-radius ${w.isMember ? "is-linked" : ""}`,
                        title: w.name + (w.isMember ? " (연동됨)" : ""),
                        children: [
                          w.name.charAt(0),
                          w.isMember && /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                        ]
                      },
                      w.id
                    )),
                    /* @__PURE__ */ n.jsxs("span", { className: "comp-count-label", children: [
                      "총 ",
                      g.companions.length,
                      "명"
                    ] })
                  ] }),
                  /* @__PURE__ */ n.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => h(g.id), children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ n.jsxs(W, { className: "itinerary-content-card meta-glass-theme", children: [
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
                  /* @__PURE__ */ n.jsx("ul", { className: `checklist-list ${g.activities.length === 0 ? "is-empty" : ""}`, children: g.activities.map((w) => {
                    const K = ns(w.status), B = w.status === "used", k = w.status === "cancelled" || w.status === "missed";
                    return /* @__PURE__ */ n.jsx(
                      "li",
                      {
                        className: `checklist-item ${B ? "checked" : ""} soft-radius`,
                        style: K.style,
                        children: /* @__PURE__ */ n.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ n.jsx(
                            "i",
                            {
                              "data-lucide": K.icon,
                              style: {
                                color: B ? "var(--brand-rent)" : k ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ n.jsx("span", { className: "check-text", children: w.label }),
                            /* @__PURE__ */ n.jsx(
                              "span",
                              {
                                style: {
                                  color: k ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (w.ownerName ?? "본인") + " · " + K.label
                              }
                            )
                          ] })
                        ] })
                      },
                      w.id
                    );
                  }) }),
                  T ? /* @__PURE__ */ n.jsx("p", { className: "checklist-empty-caption", children: "등록된 활동이 아직 없다." }) : null
                ] })
              ] })
            ]
          },
          g.id
        );
      }),
      s.length > 2 && /* @__PURE__ */ n.jsx("div", { className: `timeline-gradient-overlay ${i ? "active" : ""}`, children: /* @__PURE__ */ n.jsx("button", { className: "expand-cta-btn pill-shape", onClick: () => l(!i), children: i ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
        "전체 일정 접기 ",
        /* @__PURE__ */ n.jsx("i", { className: "lucide-chevron-up" })
      ] }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
        "남은 ",
        s.length - 2,
        "개의 일정 더 보기 ",
        /* @__PURE__ */ n.jsx("i", { className: "lucide-chevron-down" })
      ] }) }) })
    ] }),
    x && /* @__PURE__ */ n.jsx(
      ts,
      {
        isOpen: !!x,
        onClose: () => h(null),
        initialCompanions: o,
        onSave: j
      }
    )
  ] });
}, as = 5 * 1024 * 1024, L = 512, rs = 16, is = 6, ht = 20, os = {
  alignItems: "center",
  borderRadius: "50%",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  overflow: "hidden",
  position: "absolute"
}, ls = {
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%"
}, cs = {
  alignItems: "center",
  display: "flex",
  fontSize: "18px",
  fontWeight: 800,
  height: "100%",
  justifyContent: "center",
  width: "100%"
}, ee = (e) => Array.from((e ?? "").trim()).slice(0, ht).join(""), me = (e) => ({
  bio: e.bio ?? "",
  email: e.email,
  name: e.name,
  nickname: e.nickname ?? "",
  phone: e.phone
}), ds = (e) => ({
  bio: ee(e.bio),
  email: e.email.trim(),
  name: e.name.trim(),
  nickname: e.nickname.trim(),
  phone: e.phone.trim()
}), We = (e) => (e.nickname.trim().length === 0 || e.nickname.trim().length >= 2) && e.email.trim().includes("@") && e.phone.trim().length > 0, Ke = (e) => `${fe}${e}`, X = (e) => e !== null && typeof e == "object" && !Array.isArray(e), ps = (e) => new Promise((t, s) => {
  const a = new FileReader();
  a.onload = () => {
    if (typeof a.result == "string") {
      t(a.result);
      return;
    }
    s(new Error("이미지 데이터를 읽지 못했습니다."));
  }, a.onerror = () => s(new Error("이미지 데이터를 읽지 못했습니다.")), a.readAsDataURL(e);
}), te = (e, t, s) => Math.min(s, Math.max(t, e)), U = (e, t, s) => {
  if (!e.naturalWidth || !e.naturalHeight)
    return null;
  const a = Math.max(1, Math.round(t || 320)), o = Math.max(1, Math.round(s || 320)), r = Math.max(0, Math.min(a, o) - rs * 2), i = r / 2, l = Math.min(a / e.naturalWidth, o / e.naturalHeight), x = e.naturalWidth * l, h = e.naturalHeight * l, v = Math.max(r / Math.max(x, 1), r / Math.max(h, 1), 1);
  return {
    baseHeight: h,
    baseScale: l,
    baseWidth: x,
    circleDiameter: r,
    circleRadius: i,
    maxZoom: is,
    minZoom: v,
    stageHeight: o,
    stageWidth: a
  };
}, ne = (e, t) => {
  const s = te(e.zoom, t.minZoom, t.maxZoom), a = t.baseWidth * s, o = t.baseHeight * s, r = Math.max(0, (a - t.circleDiameter) / 2), i = Math.max(0, (o - t.circleDiameter) / 2);
  return {
    panX: te(e.panX, -r, r),
    panY: te(e.panY, -i, i),
    zoom: s
  };
}, ms = (e, t, s, a, o) => {
  const r = U(t, s, a);
  return r ? ne(o, r) : e;
}, us = (e, t, s) => new Promise((a, o) => {
  const r = document.createElement("canvas"), i = window.devicePixelRatio || 1;
  r.width = Math.max(1, Math.round(L * i)), r.height = Math.max(1, Math.round(L * i));
  const l = r.getContext("2d");
  if (!l)
    throw new Error("프로필 사진 편집용 캔버스를 만들지 못했습니다.");
  l.scale(i, i), l.imageSmoothingQuality = "high", l.clearRect(0, 0, L, L);
  const x = L / Math.max(t.circleDiameter, 1), h = t.baseWidth * s.zoom, v = t.baseHeight * s.zoom, f = t.stageWidth / 2 + s.panX - h / 2 - (t.stageWidth / 2 - t.circleRadius), N = t.stageHeight / 2 + s.panY - v / 2 - (t.stageHeight / 2 - t.circleRadius);
  l.save(), l.beginPath(), l.arc(
    L / 2,
    L / 2,
    L / 2,
    0,
    Math.PI * 2
  ), l.closePath(), l.clip(), l.drawImage(
    e,
    f * x,
    N * x,
    h * x,
    v * x
  ), l.restore(), r.toBlob((j) => {
    if (j) {
      a(j);
      return;
    }
    o(new Error("프로필 사진 편집용 이미지를 만들지 못했습니다."));
  }, "image/png");
}), hs = (e) => {
  if (!X(e))
    return null;
  const t = X(e.profile) ? e.profile : null, s = X(e.dashboard) ? e.dashboard : null, a = s && X(s.profile) ? s.profile : null, o = X(e.data) ? e.data : null, r = [
    e.avatarUrl,
    t == null ? void 0 : t.avatarUrl,
    s == null ? void 0 : s.avatarUrl,
    a == null ? void 0 : a.avatarUrl,
    o == null ? void 0 : o.avatarUrl
  ];
  for (const i of r)
    if (typeof i == "string") {
      const l = i.trim();
      if (l.length > 0)
        return l;
    }
  return null;
}, xs = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, fs = () => {
  var _e, Pe, Le, Oe, Ue, Be;
  const { refreshDashboard: e, state: t } = G(), s = t.profile ?? O, a = (_e = t.stats) != null && _e.length ? t.stats : ye, o = s.passport, [r, i] = p.useState(() => me(s)), [l, x] = p.useState(() => me(s)), [h, v] = p.useState(!1), [f, N] = p.useState("profile"), [j, g] = p.useState(!1), [S, b] = p.useState(null), [y, u] = p.useState(null), [T, w] = p.useState(!1), [K, B] = p.useState(null), [k, we] = p.useState(null), [_, $] = p.useState({ panX: 0, panY: 0, zoom: 1 }), [E, xt] = p.useState({ height: 320, width: 320 }), [P, re] = p.useState(!1), [ft, ie] = p.useState(!1), Ae = p.useRef(null), I = p.useRef(null), Z = p.useRef(null), Y = p.useRef(null), oe = q(K) ?? s.avatarUrl ?? null, gt = (l.nickname.trim().charAt(0) || l.name.trim().charAt(0) || ((Pe = r.nickname) == null ? void 0 : Pe.trim().charAt(0)) || r.name.trim().charAt(0) || ((Le = O.nickname) == null ? void 0 : Le.trim().charAt(0)) || O.name.trim().charAt(0) || "J").toUpperCase(), yt = l.nickname.trim() || l.name.trim() || ((Oe = r.nickname) == null ? void 0 : Oe.trim()) || r.name.trim() || ((Ue = O.nickname) == null ? void 0 : Ue.trim()) || O.name.trim(), vt = ee(l.bio) || ee(r.bio), le = l.nickname.trim().length > 0 && l.nickname.trim().length < 2 ? "닉네임은 2자 이상부터 가능합니다" : null;
  p.useEffect(() => {
    h && window.lucide && window.lucide.createIcons();
  }, [oe, h, f]), p.useEffect(() => {
    if (!h)
      return;
    const c = document.body.style.overflow, m = document.documentElement.style.overflow;
    return document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", () => {
      document.body.style.overflow = c, document.documentElement.style.overflow = m;
    };
  }, [h]), p.useEffect(() => {
    const c = me(s);
    h || (i(c), x(c));
  }, [s, h]), p.useEffect(() => {
    if (!h || f !== "avatar" || !Z.current)
      return;
    const c = () => {
      var R;
      const C = (R = Z.current) == null ? void 0 : R.getBoundingClientRect();
      C && xt({
        height: Math.max(1, Math.round(C.height)),
        width: Math.max(1, Math.round(C.width))
      });
    };
    c();
    const m = new ResizeObserver(c);
    return m.observe(Z.current), () => m.disconnect();
  }, [k, h, f]), p.useEffect(() => {
    if (!k || !P || !I.current)
      return;
    const c = U(I.current, E.width, E.height);
    c && $((m) => ne(m, c));
  }, [P, k, E.height, E.width]);
  const bt = () => {
    const c = I.current;
    if (!c)
      return;
    const m = U(c, E.width, E.height);
    if (!m) {
      u("이미지 크기를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    re(!0), $(ne({ panX: 0, panY: 0, zoom: m.minZoom }, m)), u(null);
  }, ce = () => {
    we(null), $({ panX: 0, panY: 0, zoom: 1 }), re(!1), u(null), w(!1), ie(!1), Y.current = null;
  }, jt = () => {
    x(r), b(null), N("profile"), B((c) => q(c) ?? s.avatarUrl ?? null), ce(), v(!0);
  }, Ee = () => {
    x(r), b(null), N("profile"), ce(), v(!1);
  }, Ie = () => {
    N("avatar"), ce();
  }, ke = () => {
    var c;
    (c = Ae.current) == null || c.click();
  }, Nt = async (c) => {
    var C;
    const m = (C = c.target.files) == null ? void 0 : C[0];
    if (c.target.value = "", !!m) {
      if (!m.type.startsWith("image/")) {
        u("이미지 파일만 선택해 주세요.");
        return;
      }
      if (m.size > as) {
        u("프로필 사진은 5MB 이하로 선택해 주세요.");
        return;
      }
      try {
        const R = await ps(m);
        we(R), $({ panX: 0, panY: 0, zoom: 1 }), re(!1), u(null);
      } catch {
        u("이미지를 불러오지 못했습니다. 다른 파일로 다시 선택해 주세요.");
      }
    }
  }, St = (c) => {
    I.current && $(
      (m) => ms(
        m,
        I.current,
        E.width,
        E.height,
        c
      )
    );
  }, wt = (c) => {
    !k || !P || !I.current || !U(I.current, E.width, E.height) || (c.preventDefault(), c.currentTarget.setPointerCapture(c.pointerId), Y.current = {
      pointerId: c.pointerId,
      startClientX: c.clientX,
      startClientY: c.clientY,
      startPanX: _.panX,
      startPanY: _.panY
    }, ie(!0));
  }, At = (c) => {
    const m = Y.current;
    if (!m || m.pointerId !== c.pointerId || !P || !I.current)
      return;
    const C = {
      panX: m.startPanX + (c.clientX - m.startClientX),
      panY: m.startPanY + (c.clientY - m.startClientY),
      zoom: _.zoom
    };
    St(C);
  }, Ce = (c) => {
    const m = Y.current;
    !m || m.pointerId !== c.pointerId || (Y.current = null, ie(!1), c.currentTarget.hasPointerCapture(c.pointerId) && c.currentTarget.releasePointerCapture(c.pointerId));
  }, Et = (c) => {
    !k || !P || !I.current || (c.preventDefault(), c.stopPropagation(), $((m) => {
      const C = I.current;
      if (!C)
        return m;
      const R = U(C, E.width, E.height);
      if (!R)
        return m;
      const V = Math.exp(-c.deltaY * 12e-4), Q = te(m.zoom * V, R.minZoom, R.maxZoom), H = Q / Math.max(m.zoom, 1e-4);
      return ne(
        {
          panX: m.panX * H,
          panY: m.panY * H,
          zoom: Q
        },
        R
      );
    }));
  }, It = async () => {
    if (!k || !P || !I.current) {
      u("먼저 이미지를 선택해 주세요.");
      return;
    }
    const c = U(I.current, E.width, E.height);
    if (!c) {
      u("이미지 정보를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    w(!0), u(null);
    try {
      const m = await us(I.current, c, _), C = new File([m], "avatar.png", { type: "image/png" }), R = new FormData();
      R.append("avatar", C);
      const V = await fetch(Ke("/api/mypage/avatar"), {
        body: R,
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      });
      if (V.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!V.ok)
        throw new Error("프로필 사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const Q = await V.json().catch(() => null), H = q(hs(Q));
      H && B(H);
      const Dt = await e();
      !H && Dt && B(null), N("profile");
    } catch (m) {
      u(m instanceof Error ? m.message : "프로필 사진 적용에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      w(!1);
    }
  }, kt = async () => {
    const c = ds(l);
    if (!We(c)) {
      b(le ?? "닉네임, 이메일, 휴대전화 정보를 확인해 주세요.");
      return;
    }
    g(!0), b(null);
    try {
      const m = await fetch(Ke("/api/mypage/profile"), {
        body: JSON.stringify(c),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PUT"
      });
      if (m.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!m.ok)
        throw new Error("프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      if (!await e())
        throw new Error("저장은 완료되었지만 최신 정보를 다시 불러오지 못했습니다.");
      v(!1), N("profile");
    } catch (m) {
      b(m instanceof Error ? m.message : "프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      g(!1);
    }
  }, Ct = j || !We(l), A = k && P && I.current ? U(I.current, E.width, E.height) : null, Me = A ? A.baseWidth * _.zoom : 0, Te = A ? A.baseHeight * _.zoom : 0, Mt = A ? A.stageWidth / 2 + _.panX - Me / 2 : 0, Tt = A ? A.stageHeight / 2 + _.panY - Te / 2 : 0, Re = (A == null ? void 0 : A.circleDiameter) ?? 0, F = (A == null ? void 0 : A.circleRadius) ?? 0, Rt = {
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
  }, zt = A ? {
    display: "block",
    height: `${Te}px`,
    left: `${Mt}px`,
    maxHeight: "none",
    maxWidth: "none",
    objectFit: "contain",
    pointerEvents: "none",
    position: "absolute",
    top: `${Tt}px`,
    userSelect: "none",
    width: `${Me}px`
  } : {
    display: "block",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    width: "auto"
  }, ze = A ? {
    background: "rgba(20, 24, 31, 0.14)",
    inset: 0,
    maskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, F - 2)}px, black ${Math.max(0, F - 1)}px, black 100%)`,
    WebkitMaskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, F - 2)}px, black ${Math.max(0, F - 1)}px, black 100%)`,
    pointerEvents: "none",
    position: "absolute"
  } : null, De = A ? {
    border: "2px dashed rgba(255, 255, 255, 0.94)",
    borderRadius: "50%",
    boxShadow: "0 0 0 1px rgba(17, 24, 39, 0.14)",
    height: `${Re}px`,
    left: `calc(50% - ${F}px)`,
    pointerEvents: "none",
    position: "absolute",
    top: `calc(50% - ${F}px)`,
    width: `${Re}px`
  } : null;
  return /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
    /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ n.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ n.jsxs(W, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ n.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ n.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: jt, children: "내 정보 수정" })
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "닉네임" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", style: r.nickname ? void 0 : { color: "#9ca3af" }, children: (Be = r.nickname) != null && Be.trim() ? r.nickname : "설정하지 않음" })
            ] }),
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "이메일" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", children: r.email })
            ] }),
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "휴대전화" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", children: r.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs(W, { className: "passport-info-box meta-glass-theme", children: [
          /* @__PURE__ */ n.jsx("div", { className: "box-head", children: /* @__PURE__ */ n.jsx("h3", { children: "패스포트 정보" }) }),
          /* @__PURE__ */ n.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ n.jsx(
              "div",
              {
                className: "passport-visual soft-radius",
                style: o ? void 0 : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" },
                children: /* @__PURE__ */ n.jsxs("div", { className: "pass-meta", children: [
                  /* @__PURE__ */ n.jsx("span", { className: "pass-num", children: (o == null ? void 0 : o.number) ?? "미등록" }),
                  /* @__PURE__ */ n.jsx("span", { className: "pass-country", children: (o == null ? void 0 : o.issuingCountry) ?? "해외 여행 전에 여권 정보를 등록해 주세요." })
                ] })
              }
            ),
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: o ? "여권 만료일" : "등록 상태" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", children: (o == null ? void 0 : o.expiryDate) ?? "등록 필요" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs(W, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ n.jsx("div", { className: "box-head", children: /* @__PURE__ */ n.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ n.jsx("div", { className: "benefit-tiles", children: a.slice(0, 2).map((c) => /* @__PURE__ */ n.jsxs("div", { className: `benefit-tile tone-${c.tone} soft-radius`, children: [
            /* @__PURE__ */ n.jsx("span", { className: "benefit-label", children: c.label }),
            /* @__PURE__ */ n.jsx("strong", { className: "benefit-value", style: xs(c.tone), children: c.value }),
            /* @__PURE__ */ n.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, c.label)) })
        ] })
      ] })
    ] }),
    h ? /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay", onClick: Ee, children: /* @__PURE__ */ n.jsx(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (c) => c.stopPropagation(),
        style: { padding: "36px" },
        children: f === "profile" ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
          /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
            /* @__PURE__ */ n.jsx("span", { style: { color: "#6b7280", fontSize: "13px", fontWeight: 700, lineHeight: 1.4 }, children: "공용 프로필 미리보기 - 눌러서 이미지 변경" }),
            /* @__PURE__ */ n.jsxs(
              "div",
              {
                className: "profile-link-preview soft-radius",
                role: "button",
                tabIndex: 0,
                onClick: Ie,
                onKeyDown: (c) => {
                  (c.key === "Enter" || c.key === " ") && (c.preventDefault(), Ie());
                },
                children: [
                  /* @__PURE__ */ n.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", style: { position: "relative" }, children: [
                    /* @__PURE__ */ n.jsx("span", { style: os, children: oe ? /* @__PURE__ */ n.jsx("img", { alt: "", className: "profile-link-preview-image", src: oe, style: ls }) : /* @__PURE__ */ n.jsx("span", { style: cs, children: gt }) }),
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                  ] }),
                  /* @__PURE__ */ n.jsxs("div", { className: "profile-link-copy", children: [
                    /* @__PURE__ */ n.jsx("strong", { children: yt }),
                    /* @__PURE__ */ n.jsx("span", { children: vt })
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
                          maxLength: ht,
                          type: "text",
                          value: l.bio,
                          onChange: (c) => x((m) => ({
                            ...m,
                            bio: ee(c.target.value)
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
                          onChange: (c) => x((m) => ({ ...m, nickname: c.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) }),
                      le ? /* @__PURE__ */ n.jsx("div", { style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, lineHeight: 1.4 }, children: le }) : null
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
                          onChange: (c) => x((m) => ({ ...m, email: c.target.value })),
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
                          onChange: (c) => x((m) => ({ ...m, phone: c.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) })
                    ]
                  }
                )
              ]
            }
          ),
          S ? /* @__PURE__ */ n.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: S }) : null,
          j ? /* @__PURE__ */ n.jsx("div", { "aria-live": "polite", role: "status", style: { color: "#4b5563", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: "저장 중..." }) : null,
          /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: Ee, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ n.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: kt,
                disabled: Ct,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
          /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "프로필 사진 편집" }) }) }),
          /* @__PURE__ */ n.jsx("input", { ref: Ae, accept: "image/*", hidden: !0, type: "file", onChange: Nt }),
          /* @__PURE__ */ n.jsx("div", { className: "profile-avatar-editor soft-radius", children: /* @__PURE__ */ n.jsx("div", { className: "profile-avatar-editor-preview", children: /* @__PURE__ */ n.jsx(
            "div",
            {
              ref: Z,
              onPointerCancel: Ce,
              onPointerDown: wt,
              onPointerMove: At,
              onPointerUp: Ce,
              onWheel: Et,
              style: {
                ...Rt,
                cursor: k ? ft ? "grabbing" : "grab" : "default"
              },
              children: k ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
                /* @__PURE__ */ n.jsx(
                  "img",
                  {
                    ref: I,
                    alt: "프로필 사진 편집 미리보기",
                    draggable: !1,
                    src: k,
                    style: zt,
                    onLoad: bt
                  }
                ),
                ze ? /* @__PURE__ */ n.jsx("div", { style: ze }) : null,
                De ? /* @__PURE__ */ n.jsx("div", { style: De }) : null
              ] }) : /* @__PURE__ */ n.jsx(
                "button",
                {
                  className: "profile-avatar-editor-empty",
                  type: "button",
                  onClick: ke,
                  children: "사진 선택"
                }
              )
            }
          ) }) }),
          k ? /* @__PURE__ */ n.jsx("div", { style: { display: "flex", justifyContent: "center", marginTop: "-4px" }, children: /* @__PURE__ */ n.jsx(
            "button",
            {
              type: "button",
              onClick: ke,
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
          y ? /* @__PURE__ */ n.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: y }) : null,
          /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "10px", gap: "14px" }, children: [
            /* @__PURE__ */ n.jsx(
              "button",
              {
                className: "cancel-btn pill-shape",
                type: "button",
                onClick: () => {
                  N("profile"), u(null);
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
                onClick: It,
                disabled: !k || !P || T,
                style: { padding: "18px 0", fontSize: "15px" },
                children: T ? "적용 중..." : "적용"
              }
            )
          ] })
        ] })
      }
    ) }) : null
  ] });
}, gs = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"]
}, ys = () => typeof document > "u" ? !1 : Array.from(document.querySelectorAll("link[href], script[src]")).some((e) => (e.getAttribute("href") ?? e.getAttribute("src") ?? "").includes("/front-mirror/")), Ye = (e, t = !1) => {
  const s = e === "qna" ? "qna" : e === "notice" ? "notice" : "faq", [a, o] = gs[s];
  return t ? o : a;
}, vs = () => {
  const { state: e } = G(), t = e.supportItems ?? [], [s] = p.useState(ys), [a, o] = p.useState({});
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-support", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "고객지원" }),
      /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "여행 중 궁금한 점을 전문가와 상담하세요." })
    ] }),
    /* @__PURE__ */ n.jsx("div", { className: "support-bento-grid bento-grid", children: t.map((r) => /* @__PURE__ */ n.jsxs("a", { className: `support-item-card bento-item meta-glass-theme soft-radius ${r.id}`, href: r.href, children: [
      /* @__PURE__ */ n.jsx("div", { className: "sp-icon", children: /* @__PURE__ */ n.jsx(
        "img",
        {
          alt: r.label,
          onError: (i) => {
            a[r.id] || s || (o((l) => ({
              ...l,
              [r.id]: !0
            })), i.currentTarget.src = Ye(r.id, !0));
          },
          src: Ye(r.id, s || a[r.id] === !0)
        }
      ) }),
      /* @__PURE__ */ n.jsxs("div", { className: "sp-text", children: [
        /* @__PURE__ */ n.jsx("strong", { className: "sp-label", children: r.label }),
        r.count !== null ? /* @__PURE__ */ n.jsxs("span", { className: `sp-badge pill-shape ${r.count > 0 ? "active" : ""}`, children: [
          r.count,
          " 건"
        ] }) : /* @__PURE__ */ n.jsx("span", { className: "sp-link-text", children: "상세 보기" })
      ] })
    ] }, r.id)) })
  ] });
}, bs = () => /* @__PURE__ */ n.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ n.jsx(Yn, {}),
  /* @__PURE__ */ n.jsx(Gn, {}),
  /* @__PURE__ */ n.jsx(ss, {}),
  /* @__PURE__ */ n.jsx(fs, {}),
  /* @__PURE__ */ n.jsx(vs, {})
] }), Ss = () => /* @__PURE__ */ n.jsx(Hn, { children: /* @__PURE__ */ n.jsx(bs, {}) });
export {
  Ss as M
};
