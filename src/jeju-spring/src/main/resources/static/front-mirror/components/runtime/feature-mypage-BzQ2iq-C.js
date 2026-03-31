import { a as l, j as n } from "./react-vendor-BoSfm_Te.js";
import { A as se } from "./legacy-core-CYHwlLlr.js";
const mn = /^[a-zA-Z][a-zA-Z\d+\-.]*:/, ze = {
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
}, bt = [
  { label: "보유 포인트", tone: "point", value: "0P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "0장" },
  { label: "다가오는 여행", tone: "air", value: "0건" }
], vt = [
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
], jt = {
  id: "",
  isMember: !1,
  name: ""
}, un = {
  checked: !1,
  id: "",
  label: "",
  ownerId: "",
  ownerName: "",
  status: "reserved",
  type: "voucher"
}, hn = {
  activities: [],
  companions: [],
  date: "",
  googleMapUrl: "",
  id: "",
  time: "",
  title: ""
}, fn = [], xn = [], V = (e) => {
  const t = u(e);
  if (t)
    return t.startsWith("data:") || t.startsWith("blob:") || t.startsWith("//") || mn.test(t) ? t : `${se}${t}`;
};
function St({
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
    const c = i.get(o.dayId), g = {
      checked: o.status === "used",
      id: o.id,
      label: o.activityLabel,
      ownerId: o.ownerId,
      ownerName: o.ownerName,
      status: o.status,
      type: o.type
    };
    if (c) {
      if (c.activities.push(g), o.ownerId !== e && r.has(o.ownerId)) {
        const v = r.get(o.ownerId);
        v && !c.companions.some((A) => A.id === v.id) && c.companions.push({ ...v });
      }
      continue;
    }
    i.set(o.dayId, {
      activities: [g],
      companions: o.ownerId !== e && r.has(o.ownerId) ? [{ ...r.get(o.ownerId) }] : [],
      date: o.date,
      googleMapUrl: o.googleMapUrl,
      id: o.dayId,
      sortKey: `${o.date} ${o.time}`,
      time: o.time,
      title: o.title
    });
  }
  return Array.from(i.values()).sort((o, c) => o.sortKey.localeCompare(c.sortKey)).map(({ sortKey: o, ...c }) => c);
}
const J = At(ze), _e = je(bt), gn = kt(vt), De = Ue(fn), Le = Pe(xn), Nt = St({
  currentAccountId: ze.id ?? "",
  linkedCompanions: De,
  travelEvents: Le
}), wt = [
  { count: 0, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], It = () => ({
  bookings: kt(vt),
  itinerary: Et(Nt),
  linkedCompanions: Ue(De),
  profile: At(ze),
  stats: je(bt),
  supportItems: Ct(wt),
  travelEvents: Pe(Le)
}), fe = (e) => {
  const t = It(), s = In(e);
  if (!$n(s))
    return t;
  const a = An(s, t.profile), i = _n(s.linkedCompanions, t.linkedCompanions), o = Dn(s.travelEvents, t.travelEvents), c = s.travelEvents !== void 0 ? St({
    currentAccountId: a.id ?? t.profile.id ?? "",
    linkedCompanions: i,
    travelEvents: o
  }) : Rn(s.itinerary, t.itinerary);
  return {
    bookings: Mn(s.bookings, t.bookings),
    itinerary: c,
    linkedCompanions: i,
    profile: a,
    stats: Cn(s.stats ?? s, t.stats),
    supportItems: zn(s.supportItems ?? s.support ?? s.inquiries, t.supportItems),
    travelEvents: o
  };
}, xe = (e) => {
  yn(J, e.profile), bn(_e, e.stats), vn(gn, e.bookings), jn(Nt, e.itinerary), Sn(De, e.linkedCompanions), Nn(wt, e.supportItems), wn(Le, e.travelEvents);
};
function At(e) {
  return {
    avatarUrl: e.avatarUrl,
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function je(e) {
  return e.map((t) => ({ ...t }));
}
function kt(e) {
  return e.map((t) => ({
    ...t,
    tags: [...t.tags]
  }));
}
function Ue(e) {
  return e.map((t) => ({ ...t }));
}
function Et(e) {
  return e.map((t) => ({
    ...t,
    activities: t.activities.map((s) => ({ ...s })),
    companions: t.companions.map((s) => ({ ...s }))
  }));
}
function Ct(e) {
  return e.map((t) => ({ ...t }));
}
function Pe(e) {
  return e.map((t) => ({ ...t }));
}
const yn = (e, t) => {
  if (e.avatarUrl = t.avatarUrl, e.bio = t.bio, e.email = t.email, e.memberships.splice(0, e.memberships.length, ...t.memberships), e.name = t.name, e.nickname = t.nickname, e.phone = t.phone, e.tier = t.tier, e.role = t.role, e.id = t.id, t.passport) {
    e.passport = { ...t.passport };
    return;
  }
  delete e.passport;
}, bn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, vn = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((s) => ({
      ...s,
      tags: [...s.tags]
    }))
  );
}, jn = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((s) => ({
      ...s,
      activities: s.activities.map((r) => ({ ...r })),
      companions: s.companions.map((r) => ({ ...r }))
    }))
  );
}, Sn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, Nn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, wn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, In = (e) => {
  const t = {}, s = (r) => {
    B(r) && Object.assign(t, r);
  };
  return s(e), B(e) && (s(e.user), s(e.member), s(e.profile), s(e.data), s(e.session)), t;
}, An = (e, t) => {
  const s = kn(e.memberships, e.tier ?? e.role), r = En(e.passport), a = u(e.tier) ?? s[0] ?? u(e.role), i = u(e.id) ?? u(e.memberId) ?? u(e.userId), o = u(e.name) ?? u(e.displayName) ?? u(e.fullName) ?? u(e.nickname) ?? u(e.id) ?? u(e.memberId) ?? u(e.userId) ?? t.name, c = u(e.nickname), g = Xn(
    H(e, "bio") ?? H(e, "intro") ?? H(e.profile, "bio") ?? H(e.profile, "intro") ?? H(e.user, "bio") ?? H(e.user, "intro") ?? H(e.member, "bio") ?? H(e.member, "intro") ?? H(e.data, "bio") ?? H(e.data, "intro") ?? t.bio
  );
  return {
    avatarUrl: V(e.avatarUrl),
    bio: g,
    email: u(e.email) ?? Un(e, i, o) ?? t.email,
    id: i ?? t.id,
    memberships: s,
    name: o,
    nickname: c,
    passport: r,
    phone: u(e.phone) ?? u(e.mobile) ?? "미등록",
    role: u(e.role),
    tier: a
  };
}, kn = (e, t) => {
  const s = Array.isArray(e) ? e.map((a) => u(a)).filter((a) => !!a) : [];
  if (s.length > 0)
    return s;
  const r = u(t);
  return r ? [r] : [];
}, En = (e) => {
  const t = B(e) ? e : null;
  if (!t)
    return;
  const s = {
    expiryDate: u(t == null ? void 0 : t.expiryDate) ?? "",
    issuingCountry: u(t == null ? void 0 : t.issuingCountry) ?? "",
    number: u(t == null ? void 0 : t.number) ?? ""
  };
  if (!(!s.expiryDate && !s.issuingCountry && !s.number))
    return s;
}, Cn = (e, t) => Array.isArray(e) && e.length > 0 ? t.map((s, r) => Tn(e[r], s, !0)) : Array.isArray(e) && e.length === 0 ? je(t) : B(e) ? Ln(e, t) : je(t), Tn = (e, t, s = !1) => {
  const r = B(e) ? e : {}, a = Zn(r.tone) ? r.tone : t.tone, i = u(r.label) ?? t.label, o = r.value ?? t.value;
  return {
    label: i,
    tone: a,
    value: Ce(o, t)
  };
}, Ce = (e, t) => {
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
}, Mn = (e, t) => Array.isArray(e) ? e.length === 0 ? [] : e.map((s, r) => Wn(s, t[r % t.length] ?? t[0], !0)) : [], Rn = (e, t) => !Array.isArray(e) || e.length === 0 ? Et(t) : e.map(
  (s, r) => On(
    s,
    t.length > 0 ? t[r % t.length] ?? t[0] : hn
  )
), zn = (e, t) => !Array.isArray(e) || e.length === 0 ? Ct(t) : e.map((s, r) => Kn(s, t[r % t.length] ?? t[0])), _n = (e, t) => !Array.isArray(e) || e.length === 0 ? Ue(t) : e.map(
  (s, r) => Vn(
    s,
    t.length > 0 ? t[r % t.length] ?? t[0] : jt
  )
), Tt = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => Yn(t)).filter((t) => t !== null), Dn = (e, t) => {
  const s = Tt(e);
  return s.length > 0 ? s : Pe(t);
}, Ln = (e, t) => t.map((s) => {
  const r = qn(e, Gn(s.tone));
  return r === void 0 ? { ...s } : {
    ...s,
    value: Ce(r, s)
  };
}), Un = (e, t, s) => {
  const r = t ?? u(e.memberId) ?? u(e.userId) ?? u(e.username) ?? u(e.loginId) ?? Pn(s);
  if (r)
    return `${r}@jejugroup.example`;
}, Pn = (e) => {
  const s = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return s.length > 0 ? s : void 0;
}, $n = (e) => [
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
].some((s) => s in e), Wn = (e, t, s = !1) => {
  const r = B(e) ? e : {}, a = Array.isArray(r.tags) ? r.tags.map((o) => u(o)).filter((o) => !!o) : [], i = $e(r.type) ? r.type : t.type;
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
}, On = (e, t) => {
  const s = B(e) ? e : {}, r = Array.isArray(s.activities) ? s.activities.map(
    (i, o) => Bn(
      i,
      t.activities.length > 0 ? t.activities[o % t.activities.length] ?? t.activities[0] : un
    )
  ) : t.activities.map((i) => ({ ...i })), a = Array.isArray(s.companions) ? s.companions.map(
    (i, o) => Fn(
      i,
      t.companions.length > 0 ? t.companions[o % t.companions.length] ?? t.companions[0] : jt
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
}, Bn = (e, t) => {
  const s = B(e) ? e : {};
  return {
    checked: typeof s.checked == "boolean" ? s.checked : Te(s.status) ? s.status === "used" : t.checked,
    id: u(s.id) ?? t.id,
    label: u(s.label) ?? t.label,
    ownerId: u(s.ownerId) ?? t.ownerId,
    ownerName: u(s.ownerName) ?? t.ownerName,
    status: Te(s.status) ? s.status : t.status,
    type: $e(s.type) ? s.type : t.type
  };
}, Fn = (e, t) => {
  const s = B(e) ? e : {};
  return {
    avatarUrl: V(s.avatarUrl) ?? t.avatarUrl,
    bio: u(s.bio) ?? t.bio,
    id: u(s.id) ?? t.id,
    isMember: typeof s.isMember == "boolean" ? s.isMember : t.isMember,
    name: u(s.name) ?? t.name
  };
}, Kn = (e, t) => {
  const s = B(e) ? e : {};
  return {
    count: Hn(s.count, t.count),
    href: u(s.href) ?? t.href,
    id: u(s.id) ?? t.id,
    label: u(s.label) ?? t.label
  };
}, Hn = (e, t) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const s = u(e);
  if (!s)
    return t;
  const r = Number(s);
  return Number.isFinite(r) ? r : t;
}, Vn = (e, t) => {
  const s = B(e) ? e : {};
  return {
    avatarUrl: V(s.avatarUrl) ?? t.avatarUrl,
    bio: u(s.bio) ?? t.bio,
    id: u(s.id) ?? t.id,
    isMember: typeof s.isMember == "boolean" ? s.isMember : t.isMember,
    name: u(s.name) ?? t.name
  };
}, Yn = (e) => {
  const t = B(e) ? e : null;
  if (!t)
    return null;
  const s = u(t.id), r = u(t.dayId), a = u(t.title), i = u(t.date), o = u(t.time), c = u(t.activityLabel), g = u(t.ownerId), v = u(t.ownerName), A = u(t.googleMapUrl);
  return !s || !r || !a || !i || !o || !c || !g || !v || !A ? null : {
    activityLabel: c,
    date: i,
    dayId: r,
    googleMapUrl: A,
    id: s,
    ownerId: g,
    ownerName: v,
    status: Te(t.status) ? t.status : "reserved",
    time: o,
    title: a,
    type: $e(t.type) ? t.type : "voucher"
  };
}, Gn = (e) => {
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
}, qn = (e, t) => {
  for (const s of t)
    if (s in e) {
      const r = e[s];
      if (r != null)
        return Array.isArray(r) ? r.length : r;
    }
}, B = (e) => e !== null && typeof e == "object" && !Array.isArray(e), u = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, H = (e, t) => {
  if (B(e))
    return u(e[t]);
}, Xn = (e) => Array.from((e ?? "").trim()).slice(0, 20).join(""), $e = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", Te = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", Zn = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", Me = "jeju:mypage-dashboard-mock-updated", Mt = "jeju:mypage-dashboard:", Jn = ["id", "memberId", "userId", "email", "loginId", "username"], Rt = ["user", "member", "profile", "data", "session"], q = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Qn = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, es = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), ts = (e) => {
  const t = [];
  if (!q(e))
    return t;
  t.push(e);
  for (const s of Rt) {
    const r = e[s];
    q(r) && t.push(r);
  }
  return t;
}, zt = (e) => {
  const t = ts(e);
  for (const s of t)
    for (const r of Jn) {
      const a = Qn(s[r]);
      if (!a)
        continue;
      const i = es(a);
      if (i)
        return i;
    }
  return null;
}, _t = (e) => `${Mt}${e}`, ns = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return q(t) ? t : null;
  } catch {
    return null;
  }
}, ss = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(Me, {
      detail: { accountKey: e }
    })
  );
}, Dt = (e) => {
  const t = zt(e);
  return t ? Lt(t) : null;
}, Lt = (e) => {
  try {
    return ns(localStorage.getItem(_t(e)));
  } catch {
    return null;
  }
}, ue = (e, t) => {
  const s = q(e) ? e : {}, r = q(t) ? t : {};
  if (Object.keys(s).length === 0 && Object.keys(r).length === 0)
    return null;
  const a = {
    ...s,
    ...r
  };
  for (const i of Rt) {
    const o = s[i], c = r[i];
    (q(o) || q(c)) && (a[i] = {
      ...q(o) ? o : {},
      ...q(c) ? c : {}
    });
  }
  return a;
}, rs = (e, t) => {
  const s = zt(e);
  if (!s)
    return !1;
  try {
    return localStorage.setItem(_t(s), JSON.stringify(t)), ss(s), !0;
  } catch {
    return !1;
  }
}, as = (e, t) => {
  const s = ue(Dt(e), t);
  return s ? rs(e, s) : !1;
}, is = "userSession", nt = "jeju:session-updated", os = "/api/auth/session", ls = "/api/mypage/dashboard", cs = () => {
  const e = It();
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
}, ds = (e, t) => {
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
}, Ut = l.createContext(null), Pt = (e) => `${se}${e}`, ps = (e) => e !== null && typeof e == "object" && !Array.isArray(e), ms = async () => {
  try {
    const e = await fetch(Pt(os), {
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
}, us = async () => {
  try {
    const e = await fetch(Pt(ls), {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    if (e.status === 401 || !e.ok)
      return null;
    const t = await e.json();
    return !ps(t) || t.success !== !0 || !("dashboard" in t) ? null : t.dashboard ?? null;
  } catch {
    return null;
  }
}, hs = async () => await ms(), fs = async (e) => {
  if (!e)
    return null;
  const t = await us();
  return t ? ue(e, t) : e;
}, st = async () => {
  const e = await hs();
  if (!e)
    return null;
  const t = await fs(e);
  return bs(t);
}, xs = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), gs = (e, t) => ({
  ...e,
  ...t,
  memberships: t.memberships ? [...t.memberships] : [...e.memberships],
  passport: t.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : t.passport ? { ...t.passport } : void 0
}), ys = (e, t) => {
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
}, bs = (e) => {
  const t = fe(e), s = ue(e, Dt(e)), r = fe(s), a = ys(r.linkedCompanions, t.linkedCompanions);
  if (a.length === 0)
    return fe(
      ue(s, {
        linkedCompanions: []
      })
    );
  const i = [
    ...r.travelEvents,
    ...a.flatMap((o) => {
      const c = Lt(o.id);
      return !c || !("travelEvents" in c) ? [] : Tt(c.travelEvents).map((g) => ({
        ...g,
        ownerId: g.ownerId || o.id,
        ownerName: g.ownerName || o.name
      }));
    })
  ];
  return fe(
    ue(s, {
      linkedCompanions: a,
      travelEvents: i
    })
  );
}, vs = ({ children: e }) => {
  const [t, s] = l.useReducer(ds, void 0, cs), [r, a] = l.useState(!1), [i, o] = l.useState(!1), c = (j) => {
    xe(j), s({ type: "HYDRATE_DASHBOARD", payload: j });
  }, g = (j) => {
    j.type === "HYDRATE_DASHBOARD" ? xe(j.payload) : j.type === "PATCH_PROFILE" && xe({
      bookings: t.bookings,
      itinerary: t.itinerary,
      linkedCompanions: t.linkedCompanions,
      profile: gs(t.profile, j.payload),
      stats: t.stats,
      supportItems: t.supportItems,
      travelEvents: t.travelEvents
    }), s(j);
  }, v = async () => {
    const j = await st();
    return j ? (c(j), !0) : !1;
  };
  l.useEffect(() => {
    xe(xs(t));
  }, [t.bookings, t.itinerary, t.linkedCompanions, t.profile, t.stats, t.supportItems, t.travelEvents]), l.useEffect(() => {
    let j = !0, S = !1;
    const E = async () => {
      const m = await st();
      if (!m) {
        if (!j)
          return;
        o(!1), a(!0);
        return;
      }
      j && (o(!0), a(!0), c(m));
    }, f = () => {
      S || (S = !0, E().finally(() => {
        S = !1;
      }));
    };
    f();
    const x = (m) => {
      var R;
      if (m.key === is) {
        f();
        return;
      }
      (R = m.key) != null && R.startsWith(Mt) && f();
    }, w = () => {
      f();
    }, N = () => {
      f();
    };
    return window.addEventListener("storage", x), window.addEventListener(nt, w), window.addEventListener(Me, N), () => {
      j = !1, window.removeEventListener("storage", x), window.removeEventListener(nt, w), window.removeEventListener(Me, N);
    };
  }, [s]);
  const A = l.useMemo(
    () => ({
      dispatch: g,
      refreshDashboard: v,
      state: t
    }),
    [g, v, t]
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
  ] }) : /* @__PURE__ */ n.jsx(Ut.Provider, { value: A, children: e });
}, le = () => {
  const e = l.useContext(Ut);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, rt = "/api/mypage/companion-invites", js = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "expired"
], Ss = ["sent", "received"], ne = (e) => e !== null && typeof e == "object" && !Array.isArray(e), me = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, ee = (e) => me(e) ?? void 0, at = (e) => {
  var r;
  const t = e.startsWith("/") ? e : `/${e}`, s = (r = se) == null ? void 0 : r.trim();
  return s ? new URL(t, s).toString() : t;
}, Ns = (e) => {
  if (typeof e != "string")
    return "pending";
  const t = e.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return js.includes(t) ? t : "pending";
}, ws = (e) => {
  if (typeof e != "string")
    return "received";
  const t = e.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return Ss.includes(t) ? t : "received";
}, Is = (e, t) => {
  if (ne(e)) {
    const s = e.message ?? e.error;
    if (typeof s == "string" && s.trim())
      return s;
  }
  return t;
}, As = (e) => {
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
}, ks = (e) => {
  if (!ne(e))
    return null;
  const t = typeof e.id == "number" && Number.isFinite(e.id) ? e.id : Number(e.id), s = me(e.senderUserId ?? e.sender_user_id ?? e.senderId ?? e.sender_id), r = me(e.receiverUserId ?? e.receiver_user_id ?? e.receiverId ?? e.receiver_id), a = me(e.senderName ?? e.sender_name ?? e.senderDisplayName ?? e.senderDisplayName), i = me(e.receiverName ?? e.receiver_name ?? e.receiverDisplayName ?? e.receiverDisplayName);
  return !Number.isFinite(t) || !s || !r || !a || !i ? null : {
    createdAt: ee(e.createdAt ?? e.created_at),
    direction: ws(e.direction ?? e.inviteDirection ?? e.invite_direction),
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
    status: Ns(e.status ?? e.inviteStatus ?? e.invite_status)
  };
}, it = (e, t) => Is(e, t), Es = (e = {}) => {
  const { enabled: t = !0 } = e, [s, r] = l.useState([]), [a, i] = l.useState(!1), [o, c] = l.useState(null), g = l.useRef(0), v = l.useMemo(
    () => s.filter((f) => f.direction === "received" && f.status === "pending"),
    [s]
  ), A = l.useCallback(async () => {
    const f = ++g.current;
    i(!0), c(null);
    try {
      const x = await fetch(at(rt), {
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "GET"
      }), w = await x.json().catch(() => null);
      if (x.status === 401)
        throw new Error("로그인이 필요합니다.");
      if (!x.ok || ne(w) && w.success === !1)
        throw new Error(it(w, "동행 초대를 불러오지 못했다"));
      const N = As(w).map(ks).filter((m) => m !== null);
      return f !== g.current || r(N), N;
    } catch (x) {
      return f !== g.current ? [] : (r([]), c({
        message: x instanceof Error && x.message.trim() ? x.message : "동행 초대를 불러오지 못했다"
      }), []);
    } finally {
      f === g.current && i(!1);
    }
  }, []);
  l.useEffect(() => {
    if (t)
      return A(), () => {
        g.current += 1;
      };
  }, [t, A]);
  const j = l.useCallback(
    async (f, x) => {
      const w = x === "accept" ? "accept" : "reject";
      c(null);
      try {
        const N = await fetch(at(`${rt}/${f}/${w}`), {
          credentials: "include",
          headers: {
            Accept: "application/json"
          },
          method: "POST"
        }), m = await N.json().catch(() => null);
        if (N.status === 401)
          throw new Error("로그인이 필요합니다.");
        if (!N.ok || ne(m) && m.success === !1)
          throw new Error(it(m, "동행 초대를 처리하지 못했다"));
        return await A(), !0;
      } catch (N) {
        return c({
          message: N instanceof Error && N.message.trim() ? N.message : "동행 초대를 처리하지 못했다"
        }), !1;
      }
    },
    [A]
  ), S = l.useCallback(
    async (f) => j(f, "accept"),
    [j]
  ), E = l.useCallback(
    async (f) => j(f, "reject"),
    [j]
  );
  return {
    acceptInvite: S,
    errorObj: o,
    isLoading: a,
    pendingInviteCount: v.length,
    pendingReceivedInvites: v,
    refreshInvites: A,
    rejectInvite: E
  };
}, Cs = (e, t) => {
  if (!e)
    return "00:00:00";
  const s = Date.parse(e);
  if (!Number.isFinite(s))
    return "00:00:00";
  const r = Math.max(0, s - t), a = Math.floor(r / 1e3), i = Math.floor(a / 3600), o = Math.floor(a % 3600 / 60), c = a % 60;
  return [i, o, c].map((g) => String(g).padStart(2, "0")).join(":");
}, Ts = ({ invite: e }) => {
  const [t, s] = l.useState(!1), r = V(e.senderAvatarUrl), a = !!(r && !t);
  return l.useEffect(() => {
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
}, Ms = ({
  isOpen: e,
  onClose: t,
  onRefreshPendingCount: s
}) => {
  const { refreshDashboard: r } = le(), {
    acceptInvite: a,
    errorObj: i,
    isLoading: o,
    pendingInviteCount: c,
    pendingReceivedInvites: g,
    rejectInvite: v
  } = Es({ enabled: e }), [A, j] = l.useState(null), [S, E] = l.useState(() => Date.now());
  l.useEffect(() => {
    e && window.lucide && window.lucide.createIcons();
  }, [e, g.length, o]), l.useEffect(() => {
    const m = (R) => {
      R.key === "Escape" && e && t();
    };
    return window.addEventListener("keydown", m), () => window.removeEventListener("keydown", m);
  }, [e, t]), l.useEffect(() => {
    if (!e || g.length === 0)
      return;
    E(Date.now());
    const m = window.setInterval(() => {
      E(Date.now());
    }, 1e3);
    return () => {
      window.clearInterval(m);
    };
  }, [e, g.length]);
  const f = l.useMemo(
    () => [...g].sort((m, R) => {
      const d = m.createdAt ?? m.expiresAt ?? "";
      return (R.createdAt ?? R.expiresAt ?? "").localeCompare(d);
    }),
    [g]
  );
  if (!e)
    return null;
  const x = async (m, R) => {
    if (A === null) {
      j(m);
      try {
        (R === "accept" ? await a(m) : await v(m)) && (await r(), await (s == null ? void 0 : s()));
      } finally {
        j(null);
      }
    }
  }, w = () => {
    t();
  }, N = (m) => {
    m.stopPropagation();
  };
  return /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay companion-invite-modal active", onClick: w, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ n.jsxs(
    "div",
    {
      className: "meta-modal-content companion-invite-modal-content soft-radius meta-glass-theme",
      onClick: N,
      children: [
        /* @__PURE__ */ n.jsxs("header", { className: "modal-header companion-invite-modal-header", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "header-title-wrap", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "bell", className: "lucide-bell" }),
            /* @__PURE__ */ n.jsx("h3", { children: "동행자 초대함" })
          ] }),
          /* @__PURE__ */ n.jsx("button", { className: "close-btn", type: "button", onClick: t, "aria-label": "닫기", children: "×" })
        ] }),
        /* @__PURE__ */ n.jsx("p", { className: "modal-desc companion-invite-modal-desc", children: "받은 동행자 초대를 확인하고 수락하거나 거절할 수 있습니다." }),
        /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-modal-body", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-summary", children: [
            /* @__PURE__ */ n.jsx("strong", { children: "받은 초대" }),
            /* @__PURE__ */ n.jsxs("span", { children: [
              c,
              "건"
            ] })
          ] }),
          /* @__PURE__ */ n.jsx("div", { className: "companion-invite-panel", children: i ? /* @__PURE__ */ n.jsxs("div", { className: "error-message companion-invite-error", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
            i.message
          ] }) : o ? /* @__PURE__ */ n.jsx("p", { className: "empty-list companion-invite-empty", children: "초대 목록을 불러오는 중이다." }) : f.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list companion-invite-empty", children: "받은 동행자 초대가 없다." }) : /* @__PURE__ */ n.jsx("div", { className: "companion-invite-list companion-list-scroll", children: f.map((m) => {
            var R;
            return /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-row list-item soft-radius", children: [
              /* @__PURE__ */ n.jsxs("div", { className: "item-info companion-invite-row-info", children: [
                /* @__PURE__ */ n.jsx(Ts, { invite: m }),
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
                        /* @__PURE__ */ n.jsx("strong", { children: m.senderName }),
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
                            children: Cs(m.expiresAt, S)
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ n.jsx("span", { children: ((R = m.senderBio) == null ? void 0 : R.trim()) || `@${m.senderUserId}` })
                ] })
              ] }),
              /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-actions", children: [
                /* @__PURE__ */ n.jsx(
                  "button",
                  {
                    className: "companion-invite-action companion-invite-reject",
                    type: "button",
                    onClick: () => void x(m.id, "reject"),
                    disabled: A !== null,
                    children: "거절"
                  }
                ),
                /* @__PURE__ */ n.jsx(
                  "button",
                  {
                    className: "companion-invite-action companion-invite-accept",
                    type: "button",
                    onClick: () => void x(m.id, "accept"),
                    disabled: A !== null,
                    children: "수락"
                  }
                )
              ] })
            ] }, m.id);
          }) }) })
        ] }),
        /* @__PURE__ */ n.jsx("footer", { className: "modal-footer companion-invite-modal-footer", children: /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: t, children: "닫기" }) })
      ]
    }
  ) });
}, ie = ({ children: e, className: t = "" }) => {
  const s = ["bento-box", "soft-radius", t].filter(Boolean).join(" ");
  return /* @__PURE__ */ n.jsx("div", { className: s, children: e });
}, Ie = "/api/mypage/companion-invites", $t = (e) => {
  const t = (e == null ? void 0 : e.trim().toLowerCase()) ?? "";
  return t.includes("diamond") || t.includes("다이아") ? "diamond" : t.includes("platinum") || t.includes("플래티넘") ? "platinum" : t.includes("silver") || t.includes("실버") ? "silver" : t.includes("gold") || t.includes("골드") ? "gold" : null;
}, Rs = (e) => $t(e) ?? "neutral", zs = (e) => {
  switch ($t(e)) {
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
}, ot = (e) => {
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
}, Ae = (e) => {
  const t = document.querySelector(e);
  if (!t)
    return;
  const s = t.querySelector(".section-title") ?? t, r = document.querySelector("#jeju-page-shell-header .header") ?? document.querySelector(".header"), a = (r == null ? void 0 : r.getBoundingClientRect().height) ?? 72, i = window.scrollY + s.getBoundingClientRect().top - a - 24;
  window.scrollTo({
    top: Math.max(0, i),
    behavior: "smooth"
  });
}, lt = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Re = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, _s = () => {
  var r;
  const e = (r = se) == null ? void 0 : r.trim(), t = Ie.startsWith("/") ? Ie : `/${Ie}`, s = e ? new URL(t, e) : new URL(t, window.location.origin);
  return e ? s.toString() : `${s.pathname}${s.search}`;
}, Ds = (e) => {
  if (!lt(e))
    return [];
  const t = [e.invites, e.items, e.results, e.data];
  for (const s of t)
    if (Array.isArray(s))
      return s.filter(lt).map((r) => ({
        direction: Re(r.direction),
        status: Re(r.status ?? r.effectiveStatus)
      }));
  return [];
}, ct = (e) => {
  var s;
  const t = (s = Re(e)) == null ? void 0 : s.toLowerCase().replace(/[\s-]+/g, "_");
  if (t)
    return t === "received" ? "received" : t;
}, Ls = ({
  onOpenCompanionInvites: e,
  pendingInviteCount: t
} = {}) => {
  var M, C, z, _;
  const { state: s } = le(), r = s.profile ?? J, a = (M = s.stats) != null && M.length ? s.stats : _e, i = ((C = r.memberships) == null ? void 0 : C[0]) ?? J.memberships[0], o = r.tier ?? i, c = Rs(o), g = zs(o), v = ((z = r.nickname) == null ? void 0 : z.trim()) || r.name.trim(), [A, j] = l.useState(0), [S, E] = l.useState(!1), f = t ?? A, x = f > 0, w = V(r.avatarUrl) ?? `https://api.dicebear.com/7.x/notionists/svg?seed=${r.name}&backgroundColor=f8f9fa`;
  l.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []);
  const N = l.useCallback(async () => {
    if (typeof t == "number") {
      j(0);
      return;
    }
    try {
      const k = await fetch(_s(), {
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "GET"
      });
      if (!k.ok) {
        j(0);
        return;
      }
      const U = await k.json().catch(() => null), b = Ds(U).filter(($) => {
        const I = ct($.status), h = ct($.direction);
        return I === "pending" && h === "received";
      }).length;
      j(b);
    } catch {
      j(0);
    }
  }, [t]);
  l.useEffect(() => {
    let k = !0;
    return N().finally(() => {
      !k && typeof t != "number" && j(0);
    }), () => {
      k = !1;
    };
  }, [N, t]);
  const m = () => {
    e && e(), E(!0);
  }, R = (k) => {
    (k.key === "Enter" || k.key === " ") && (k.preventDefault(), m());
  }, d = l.useMemo(() => a, [a]);
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ n.jsx(ie, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ n.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ n.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: w
          }
        ),
        /* @__PURE__ */ n.jsx("div", { className: `membership-grade-chip soft-radius ${c}`, children: /* @__PURE__ */ n.jsx("span", { children: g }) })
      ] }) }),
      /* @__PURE__ */ n.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ n.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ n.jsx("strong", { className: "highlight", children: v }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ n.jsx("p", { className: "profile-welcome-msg", children: ((_ = r.bio) == null ? void 0 : _.trim()) ?? "" }),
        /* @__PURE__ */ n.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => Ae(".layer-full-management"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => Ae(".layer-itinerary"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => Ae(".layer-account-benefits"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ n.jsx("div", { className: "summary-stats-column", children: d.map((k) => k.tone === "air" ? /* @__PURE__ */ n.jsxs(
      "div",
      {
        "aria-label": `동행자 초대 알림${x ? `, 대기 ${f}건` : ""}`,
        className: "bento-box soft-radius stat-card meta-glass-theme tone-air",
        onClick: m,
        onKeyDown: R,
        role: "button",
        tabIndex: 0,
        style: { cursor: "pointer" },
        children: [
          /* @__PURE__ */ n.jsxs("div", { className: "stat-icon-box", style: { position: "relative" }, children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "bell", className: "lucide-bell" }),
            x ? /* @__PURE__ */ n.jsx(
              "span",
              {
                "aria-label": `대기 중인 초대 ${f}건`,
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
                children: f > 99 ? "99+" : f
              }
            ) : null
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "stat-content", children: [
            /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }, children: [
              /* @__PURE__ */ n.jsx("span", { className: "stat-label", children: "동행자 초대 알림" }),
              x ? /* @__PURE__ */ n.jsxs(
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
                    f,
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
            /* @__PURE__ */ n.jsx("strong", { className: "stat-value", children: x ? `새 초대 ${f}건` : "새 초대 없음" })
          ] })
        ]
      },
      k.label
    ) : /* @__PURE__ */ n.jsxs(ie, { className: `stat-card meta-glass-theme tone-${k.tone}`, children: [
      /* @__PURE__ */ n.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ n.jsx("i", { "data-lucide": ot(k.tone), className: `lucide-${ot(k.tone)}` }) }),
      /* @__PURE__ */ n.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ n.jsx("span", { className: "stat-label", children: k.label }),
        /* @__PURE__ */ n.jsx("strong", { className: "stat-value", children: k.value })
      ] })
    ] }, k.label)) }),
    /* @__PURE__ */ n.jsx(
      Ms,
      {
        isOpen: S,
        onClose: () => E(!1),
        onRefreshPendingCount: N
      }
    )
  ] });
}, Us = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, Ps = ({ tone: e, value: t }) => {
  const s = Us[e];
  return /* @__PURE__ */ n.jsx("span", { className: `pill-shape ${s}`.trim(), children: t });
}, $s = ["all", "air", "stay", "rent", "voucher"], Ws = {
  air: "항공",
  rent: "렌터카",
  stay: "숙박",
  voucher: "바우처"
}, dt = /\s*(?:→|->|–|—|~| to )\s*/i, Os = ["결제", "카드", "현금", "페이", "포인트", "마일리지", "계좌", "무통장"], Bs = [/제주항공/, /대한항공/, /진에어/, /티웨이/, /에어부산/, /에어서울/, /이스타/, /아시아나/, /Jeju Air/i], de = "#ff5c00", Fs = (e) => `${se}/api/booking/${encodeURIComponent(e)}/cancel`, T = (e) => (e == null ? void 0 : e.trim()) ?? "", Se = (e, t = " · ") => e.map((s) => T(s)).filter(Boolean).join(t), Wt = (e) => e !== null && typeof e == "object" && !Array.isArray(e), We = (e, t) => e.find((s) => t.some((r) => r.test(s))), pt = (e, t) => {
  if (Wt(e)) {
    const s = e.message ?? e.error;
    if (typeof s == "string" && s.trim())
      return s.trim();
  }
  return t;
}, Ot = (e) => {
  const t = T(e).replace(/\s+/g, " ");
  if (!t)
    return null;
  if (t.match(dt)) {
    const [a, i] = t.split(dt, 2), o = T(a), c = T(i).split(/\s+/)[0] ?? "";
    if (o && c)
      return { departure: o, destination: c };
  }
  const r = t.match(/\b[A-Z]{2,4}\b/g);
  return r && r.length >= 2 ? {
    departure: r[0],
    destination: r[1]
  } : null;
}, Bt = (e, t) => {
  const r = T(e).match(/\b(?:[A-Z]{2,3}\d{2,4}|\d{1,3}[A-Z]\d{2,4})\b/);
  return r ? r[0] : We(t, [/\b(?:[A-Z]{2,3}\d{2,4}|\d{1,3}[A-Z]\d{2,4})\b/]) ?? "";
}, Ks = (e, t) => {
  const s = We([e, ...t], Bs);
  return s ? s.replace(/\b[A-Z]{2,3}\d{2,4}\b/g, "").trim() || s.trim() : "항공사 정보 확인";
}, Hs = (e) => {
  const t = T(e).replace(/\s+/g, " ");
  if (!t)
    return { date: "일정 확인 필요", time: "시간 확인 필요" };
  const s = t.match(/^(.+?)(\d{1,2}:\d{2}(?:\s?[A-Z]{2,4})?)$/);
  return s ? {
    date: T(s[1]).replace(/\s+$/, ""),
    time: T(s[2])
  } : {
    date: t,
    time: "시간 확인 필요"
  };
}, Vs = (e) => {
  const t = T(e).replace(/\s+/g, " ");
  if (!t)
    return { checkIn: "체크인 확인 필요", checkOut: "체크아웃 확인 필요" };
  const s = t.match(/^(.+?)\s*[~-]\s*(.+)$/);
  return s ? {
    checkIn: T(s[1]),
    checkOut: T(s[2])
  } : {
    checkIn: t,
    checkOut: "체크아웃 확인 필요"
  };
}, Ys = (e) => {
  const t = e.tags.find((r) => /뷰|스위트|룸|객실|침대|베드/i.test(r));
  if (t)
    return t;
  const s = T(e.title);
  return s || "객실 정보 확인";
}, Gs = (e, t) => {
  const s = T(e), r = We(t, [/제주항공/, /대한항공/, /진에어/, /티웨이/, /에어부산/, /에어서울/, /이스타/, /항공/]);
  if (r)
    return r;
  const a = Bt(s, t);
  return a || s;
}, oe = (e, t) => {
  const s = T(e);
  return s || t.find((a) => Os.some((i) => a.includes(i))) || "예약 카드 기준 결제수단 확인";
}, qs = (e) => {
  const t = Ot(e.title), s = Gs(e.title, e.tags), r = t ? `${t.departure} → ${t.destination}` : s || "항공 예약", a = t ? `${t.departure} 출발 ${t.destination} 도착 항공권이다.` : `${s || "항공 예약"}의 노선은 카드 제목 기준으로 확인해 주세요.`;
  return {
    fields: [
      { label: "예약번호", value: T(e.id) || "예약번호 확인 필요" },
      { label: "출발일", value: T(e.date) || "출발일 확인 필요" },
      { label: "출발지", value: (t == null ? void 0 : t.departure) || "예약 카드 기준 출발지 확인" },
      { label: "목적지", value: (t == null ? void 0 : t.destination) || "예약 카드 기준 목적지 확인" },
      { label: "편명/항공사", value: s || "예약 카드 기준 항공편 확인", full: !0 },
      { label: "결제금액", value: T(e.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: oe(e.paymentMethod, e.tags) }
    ],
    note: a,
    reservationNo: T(e.id) || "예약번호 확인 필요",
    subtitle: s ? `항공 예약 · ${s}` : "항공 예약",
    summaryLabel: "노선",
    summaryValue: r
  };
}, Xs = (e) => {
  const t = T(e.title) || "숙소 예약", s = T(e.duration) || Se([e.date, e.duration], " / ") || "숙박 일정 확인", r = `${t} 숙박 일정은 카드의 날짜와 기간 기준으로 확인하시면 됩니다.`;
  return {
    fields: [
      { label: "예약번호", value: T(e.id) || "예약번호 확인 필요" },
      { label: "체크인일", value: T(e.date) || "체크인일 확인 필요" },
      { label: "숙소명", value: t },
      { label: "숙박일정", value: s },
      { label: "포함혜택", value: Se(e.tags) || "카드 태그 기준 혜택 확인", full: !0 },
      { label: "결제금액", value: T(e.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: oe(e.paymentMethod, e.tags) }
    ],
    note: r,
    reservationNo: T(e.id) || "예약번호 확인 필요",
    subtitle: `숙소 예약 · ${t}`,
    summaryLabel: "숙소명",
    summaryValue: t
  };
}, Zs = (e) => {
  const t = T(e.title) || "렌터카 예약", s = T(e.duration) || "이용시간 확인", r = `${t} 예약은 인수일과 이용시간 기준으로 확인해 주세요.`;
  return {
    fields: [
      { label: "예약번호", value: T(e.id) || "예약번호 확인 필요" },
      { label: "인수일", value: T(e.date) || "인수일 확인 필요" },
      { label: "차량 또는 업체", value: t },
      { label: "이용시간", value: s },
      { label: "포함옵션", value: Se(e.tags) || "카드 태그 기준 옵션 확인", full: !0 },
      { label: "결제금액", value: T(e.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: oe(e.paymentMethod, e.tags) }
    ],
    note: r,
    reservationNo: T(e.id) || "예약번호 확인 필요",
    subtitle: `렌터카 예약 · ${t}`,
    summaryLabel: "차량/업체",
    summaryValue: t
  };
}, Js = (e) => {
  const t = T(e.title) || "바우처 예약", s = Se(e.tags) || "바우처 사용 안내 확인", r = `${t}는 예약일과 사용정보 기준으로 확인하시면 됩니다.`;
  return {
    fields: [
      { label: "예약번호", value: T(e.id) || "예약번호 확인 필요" },
      { label: "이용일", value: T(e.date) || "이용일 확인 필요" },
      { label: "상품", value: t },
      { label: "사용정보", value: s },
      { label: "결제금액", value: T(e.amount) || "결제금액 확인 필요" },
      { label: "결제수단", value: oe(e.paymentMethod, e.tags) }
    ],
    note: r,
    reservationNo: T(e.id) || "예약번호 확인 필요",
    subtitle: `바우처 예약 · ${t}`,
    summaryLabel: "상품",
    summaryValue: t
  };
}, Qs = (e) => {
  switch (e.type) {
    case "air":
      return qs(e);
    case "stay":
      return Xs(e);
    case "rent":
      return Zs(e);
    case "voucher":
    default:
      return Js(e);
  }
}, er = () => {
  const { dispatch: e, refreshDashboard: t, state: s } = le(), r = s.bookings ?? [], [a, i] = l.useState(null), [o, c] = l.useState(null), [g, v] = l.useState(null);
  l.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [a]), l.useEffect(() => {
    if (!a)
      return;
    const d = (M) => {
      M.key === "Escape" && i(null);
    };
    return window.addEventListener("keydown", d), () => window.removeEventListener("keydown", d);
  }, [a]);
  const A = l.useMemo(() => s.filter === "all" ? r : r.filter((d) => d.type === s.filter), [r, s.filter]), j = l.useCallback(
    (d) => {
      e({ type: "SET_FILTER", payload: d });
    },
    [e]
  ), S = l.useMemo(
    () => r.find((d) => d.id === a) ?? null,
    [a, r]
  ), E = l.useMemo(() => S ? Qs(S) : null, [S]), f = l.useCallback((d) => {
    i(d);
  }, []), x = l.useCallback(() => {
    i(null);
  }, []), w = l.useCallback((d) => {
    c({
      bookingId: d,
      message: "예약 변경은 아직 이 화면에서 바로 처리되지 않습니다. 고객센터로 문의해 주세요.",
      tone: "info"
    });
  }, []), N = l.useCallback(
    async (d) => {
      v(d.id), c({
        bookingId: d.id,
        message: "예약 취소를 처리하는 중입니다. 잠시만 기다려 주세요.",
        tone: "loading"
      });
      try {
        const M = await fetch(Fs(d.id), {
          credentials: "include",
          headers: {
            Accept: "application/json"
          },
          method: "POST"
        }), C = await M.json().catch(() => null);
        if (M.status === 401)
          throw new Error("로그인이 필요합니다.");
        if (!M.ok || Wt(C) && C.success === !1)
          throw new Error(pt(C, "예약 취소에 실패했습니다."));
        c({
          bookingId: d.id,
          message: pt(C, "예약 취소가 완료되었습니다."),
          tone: "success"
        }), await t() || window.location.reload(), a === d.id && i(null);
      } catch (M) {
        c({
          bookingId: d.id,
          message: M instanceof Error && M.message.trim() ? M.message : "예약 취소에 실패했습니다.",
          tone: "error"
        });
      } finally {
        v(null);
      }
    },
    [a, t]
  ), m = l.useCallback(
    (d) => {
      if (!d) {
        c({
          bookingId: "",
          message: "바우처 링크가 아직 연결되지 않았습니다.",
          tone: "info"
        });
        return;
      }
      window.open(d, "_blank", "noopener,noreferrer");
    },
    []
  ), R = l.useCallback((d) => {
    c({
      bookingId: a ?? "",
      message: d,
      tone: "info"
    });
  }, [a]);
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-full-management", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header flex-header", children: [
      /* @__PURE__ */ n.jsxs("div", { className: "title-group", children: [
        /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "나의 예약 현황" }),
        /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 및 바우처를 한눈에 관리하세요." })
      ] }),
      /* @__PURE__ */ n.jsx("div", { className: "booking-filters flex-gap", children: $s.map((d) => /* @__PURE__ */ n.jsx(
        "button",
        {
          className: `filter-chip pill-shape ${s.filter === d ? "active" : ""}`,
          onClick: () => j(d),
          type: "button",
          children: d === "all" ? "전체" : d === "air" ? "항공" : d === "stay" ? "숙박" : d === "rent" ? "렌터카" : "바우처"
        },
        d
      )) })
    ] }),
    o ? /* @__PURE__ */ n.jsx(
      "div",
      {
        "aria-live": "polite",
        className: "booking-action-notice soft-radius",
        role: o.tone === "error" ? "alert" : "status",
        style: {
          background: o.tone === "error" ? "#fff1f0" : o.tone === "success" ? "#eefaf3" : o.tone === "loading" ? "#f4f7fb" : "#f5f9ff",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          color: o.tone === "error" ? "#b42318" : o.tone === "success" ? "#067647" : o.tone === "loading" ? "#344054" : "#1d4ed8",
          fontSize: "13px",
          fontWeight: 700,
          marginBottom: "16px",
          padding: "14px 16px"
        },
        children: o.message
      }
    ) : null,
    /* @__PURE__ */ n.jsx("ul", { className: "full-width-trip-list", children: A.length > 0 ? A.map((d) => /* @__PURE__ */ n.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": d.type, children: [
      /* @__PURE__ */ n.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ n.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ n.jsx(Ps, { tone: d.type, value: d.status }),
          /* @__PURE__ */ n.jsx("div", { className: "trip-tags", children: d.tags.map((M) => /* @__PURE__ */ n.jsx("span", { className: "meta-tag pill-shape", children: M }, M)) })
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
          d.voucherUrl ? /* @__PURE__ */ n.jsxs("button", { className: "inline-btn primary pill-shape", type: "button", onClick: () => m(d.voucherUrl), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "download", className: "lucide-download" }),
            "e-티켓 / 바우처"
          ] }) : /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", onClick: () => f(d.id), children: "예약 확인" }),
          /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", onClick: () => w(d.id), children: "예약 변경" })
        ] }),
        /* @__PURE__ */ n.jsx("button", { className: "inline-btn danger pill-shape", disabled: g === d.id, type: "button", onClick: () => void N(d), children: "예약 취소" })
      ] })
    ] }, d.id)) : /* @__PURE__ */ n.jsxs("div", { className: "empty-state-placeholder soft-radius", children: [
      /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
      /* @__PURE__ */ n.jsx("p", { children: "선택하신 카테고리에 해당하는 예약 내역이 없습니다." })
    ] }) }),
    E && S ? S.type === "air" ? /* @__PURE__ */ n.jsx(
      "div",
      {
        className: "meta-modal-overlay booking-receipt-overlay active",
        onClick: x,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "booking-receipt-title",
        style: {
          alignItems: "flex-start",
          backdropFilter: "blur(10px)",
          background: "rgba(26, 28, 28, 0.2)",
          padding: "calc(80px + 10px) 16px 16px"
        },
        children: ((d, M) => {
          var $;
          const C = Ot(d.title), z = Bt(d.title, d.tags) || "편명 확인 필요", _ = Ks(d.title, d.tags), k = Hs(d.date), U = oe(d.paymentMethod, d.tags), b = ($ = d.paymentMethod) != null && $.includes("카드") ? "등록 카드 기준 결제" : U;
          return /* @__PURE__ */ n.jsxs(
            "div",
            {
              onClick: (I) => I.stopPropagation(),
              style: {
                background: "#ffffff",
                borderRadius: "28px",
                boxShadow: "0 24px 80px rgba(26, 28, 28, 0.18)",
                color: "#1a1c1c",
                maxWidth: "448px",
                overflow: "hidden",
                position: "relative",
                width: "100%"
              },
              children: [
                /* @__PURE__ */ n.jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    style: {
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                      inset: 0,
                      opacity: 0.02,
                      pointerEvents: "none",
                      position: "absolute"
                    }
                  }
                ),
                /* @__PURE__ */ n.jsx(
                  "button",
                  {
                    "aria-label": "닫기",
                    onClick: x,
                    style: {
                      alignItems: "center",
                      background: "transparent",
                      border: "none",
                      color: "#8f7065",
                      cursor: "pointer",
                      display: "flex",
                      height: "44px",
                      justifyContent: "center",
                      position: "absolute",
                      right: "14px",
                      top: "14px",
                      width: "44px",
                      zIndex: 1
                    },
                    type: "button",
                    children: /* @__PURE__ */ n.jsx("i", { "data-lucide": "x", "aria-hidden": "true" })
                  }
                ),
                /* @__PURE__ */ n.jsxs(
                  "div",
                  {
                    style: {
                      borderBottom: "1px dashed rgba(143, 112, 101, 0.3)",
                      padding: "40px 28px 24px",
                      position: "relative",
                      textAlign: "center"
                    },
                    children: [
                      /* @__PURE__ */ n.jsx(
                        "div",
                        {
                          style: {
                            alignItems: "center",
                            background: "rgba(255, 92, 0, 0.1)",
                            borderRadius: "999px",
                            color: "#a73a00",
                            display: "flex",
                            height: "64px",
                            justifyContent: "center",
                            margin: "0 auto 16px",
                            width: "64px"
                          },
                          children: /* @__PURE__ */ n.jsx("i", { "data-lucide": "ticket", style: { height: "30px", width: "30px" } })
                        }
                      ),
                      /* @__PURE__ */ n.jsx(
                        "h3",
                        {
                          id: "booking-receipt-title",
                          style: {
                            fontFamily: '"Plus Jakarta Sans", "Noto Sans KR", sans-serif',
                            fontSize: "30px",
                            fontWeight: 800,
                            letterSpacing: "-0.04em",
                            margin: 0
                          },
                          children: "예약 내역 확인"
                        }
                      ),
                      /* @__PURE__ */ n.jsx(
                        "p",
                        {
                          style: {
                            color: "#5f5e5e",
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            margin: "8px 0 0",
                            textTransform: "uppercase"
                          },
                          children: M.reservationNo
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ n.jsxs("div", { style: { padding: "28px", position: "relative" }, children: [
                  /* @__PURE__ */ n.jsxs("div", { style: { alignItems: "center", display: "flex", justifyContent: "space-between", marginBottom: "28px" }, children: [
                    /* @__PURE__ */ n.jsxs("div", { style: { textAlign: "left" }, children: [
                      /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }, children: "출발지" }),
                      /* @__PURE__ */ n.jsx("div", { style: { fontFamily: '"Plus Jakarta Sans", "Noto Sans KR", sans-serif', fontSize: "36px", fontWeight: 800, letterSpacing: "-0.08em" }, children: (C == null ? void 0 : C.departure) || "출발지" }),
                      /* @__PURE__ */ n.jsx("div", { style: { color: "#5f5e5e", fontSize: "12px", marginTop: "4px" }, children: (C == null ? void 0 : C.departure) || M.summaryValue })
                    ] }),
                    /* @__PURE__ */ n.jsx("div", { style: { flex: "1 1 auto", padding: "0 16px" }, children: /* @__PURE__ */ n.jsx("div", { style: { background: "rgba(143, 112, 101, 0.35)", height: "1px", position: "relative", width: "100%" }, children: /* @__PURE__ */ n.jsx(
                      "i",
                      {
                        "data-lucide": "plane",
                        style: {
                          background: "#ffffff",
                          color: "#a73a00",
                          height: "20px",
                          left: "50%",
                          padding: "0 8px",
                          position: "absolute",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "20px"
                        }
                      }
                    ) }) }),
                    /* @__PURE__ */ n.jsxs("div", { style: { textAlign: "right" }, children: [
                      /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }, children: "도착지" }),
                      /* @__PURE__ */ n.jsx("div", { style: { fontFamily: '"Plus Jakarta Sans", "Noto Sans KR", sans-serif', fontSize: "36px", fontWeight: 800, letterSpacing: "-0.08em" }, children: (C == null ? void 0 : C.destination) || "도착지" }),
                      /* @__PURE__ */ n.jsx("div", { style: { color: "#5f5e5e", fontSize: "12px", marginTop: "4px" }, children: (C == null ? void 0 : C.destination) || "도착 정보 확인" })
                    ] })
                  ] }),
                  /* @__PURE__ */ n.jsxs(
                    "div",
                    {
                      style: {
                        columnGap: "24px",
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        paddingTop: "12px",
                        rowGap: "24px"
                      },
                      children: [
                        /* @__PURE__ */ n.jsxs("div", { children: [
                          /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }, children: "출발일" }),
                          /* @__PURE__ */ n.jsx("p", { style: { fontSize: "14px", fontWeight: 700, margin: 0 }, children: k.date }),
                          /* @__PURE__ */ n.jsx("p", { style: { color: "#5f5e5e", fontSize: "14px", margin: "4px 0 0" }, children: k.time })
                        ] }),
                        /* @__PURE__ */ n.jsxs("div", { style: { textAlign: "right" }, children: [
                          /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }, children: "항공사 / 편명" }),
                          /* @__PURE__ */ n.jsx("p", { style: { fontSize: "14px", fontWeight: 700, margin: 0 }, children: _ }),
                          /* @__PURE__ */ n.jsx("p", { style: { color: "#5f5e5e", fontSize: "14px", margin: "4px 0 0" }, children: z })
                        ] }),
                        /* @__PURE__ */ n.jsxs("div", { children: [
                          /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }, children: "결제수단" }),
                          /* @__PURE__ */ n.jsx("p", { style: { fontSize: "14px", fontWeight: 700, margin: 0 }, children: U }),
                          /* @__PURE__ */ n.jsx("p", { style: { color: "#5f5e5e", fontSize: "14px", margin: "4px 0 0" }, children: b })
                        ] }),
                        /* @__PURE__ */ n.jsxs("div", { style: { textAlign: "right" }, children: [
                          /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "10px", fontWeight: 800, letterSpacing: "0.18em", marginBottom: "6px", textTransform: "uppercase" }, children: "상태" }),
                          /* @__PURE__ */ n.jsx("p", { style: { color: "#a73a00", fontSize: "14px", fontWeight: 800, margin: 0 }, children: d.status || "확인됨" })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ n.jsx("div", { style: { borderTop: "1px dashed rgba(143, 112, 101, 0.45)", marginTop: "28px", paddingTop: "24px" }, children: /* @__PURE__ */ n.jsxs("div", { style: { alignItems: "baseline", display: "flex", justifyContent: "space-between" }, children: [
                    /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", fontSize: "15px", fontWeight: 700 }, children: "총 결제금액" }),
                    /* @__PURE__ */ n.jsx("span", { style: { fontFamily: '"Plus Jakarta Sans", "Noto Sans KR", sans-serif', fontSize: "30px", fontWeight: 800, letterSpacing: "-0.04em" }, children: d.amount || "금액 확인 필요" })
                  ] }) })
                ] }),
                /* @__PURE__ */ n.jsxs(
                  "div",
                  {
                    style: {
                      alignItems: "center",
                      background: "#f3f3f3",
                      display: "flex",
                      gap: "12px",
                      padding: "20px 24px 24px",
                      position: "relative"
                    },
                    children: [
                      /* @__PURE__ */ n.jsx(
                        "button",
                        {
                          onClick: () => R("항공 영수증 PDF 다운로드는 아직 연결되지 않았습니다. UI만 먼저 연결해 두었습니다."),
                          style: {
                            background: "#a73a00",
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 12px 28px rgba(167, 58, 0, 0.2)",
                            color: "#ffffff",
                            cursor: "pointer",
                            flex: "1 1 auto",
                            fontSize: "14px",
                            fontWeight: 800,
                            padding: "14px 16px"
                          },
                          type: "button",
                          children: "PDF 영수증 다운로드"
                        }
                      ),
                      /* @__PURE__ */ n.jsx(
                        "button",
                        {
                          "aria-label": "영수증 공유",
                          onClick: () => R("항공 영수증 공유 기능은 아직 연결되지 않았습니다. UI만 먼저 연결해 두었습니다."),
                          style: {
                            alignItems: "center",
                            background: "rgba(255, 92, 0, 0.12)",
                            border: "none",
                            borderRadius: "12px",
                            color: de,
                            cursor: "pointer",
                            display: "flex",
                            height: "48px",
                            justifyContent: "center",
                            width: "48px"
                          },
                          type: "button",
                          children: /* @__PURE__ */ n.jsx("i", { "data-lucide": "share-2", style: { height: "18px", width: "18px" } })
                        }
                      )
                    ]
                  }
                )
              ]
            }
          );
        })(S, E)
      }
    ) : S.type === "stay" ? /* @__PURE__ */ n.jsx(
      "div",
      {
        className: "meta-modal-overlay booking-receipt-overlay active",
        onClick: x,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "booking-receipt-title",
        style: {
          backdropFilter: "blur(10px)",
          background: "rgba(26, 28, 28, 0.4)",
          padding: "16px"
        },
        children: (() => {
          const d = Vs(S.date), M = Ys(S), C = oe(S.paymentMethod, S.tags), z = S.duration ? `${S.duration} / ${S.amount || "금액 확인 필요"}` : S.amount || "금액 확인 필요";
          return /* @__PURE__ */ n.jsxs(
            "div",
            {
              onClick: (k) => k.stopPropagation(),
              style: {
                background: "#ffffff",
                borderRadius: "24px",
                boxShadow: "0 12px 40px rgba(26, 28, 28, 0.15)",
                maxWidth: "500px",
                overflow: "hidden",
                width: "100%"
              },
              children: [
                /* @__PURE__ */ n.jsxs("div", { style: { padding: "24px 26px 12px", textAlign: "center" }, children: [
                  /* @__PURE__ */ n.jsxs(
                    "div",
                    {
                      style: {
                        alignItems: "center",
                        background: "#dcfce7",
                        borderRadius: "999px",
                        color: "#166534",
                        display: "inline-flex",
                        fontSize: "12px",
                        fontWeight: 900,
                        gap: "8px",
                        letterSpacing: "0.12em",
                        marginBottom: "18px",
                        padding: "7px 14px",
                        textTransform: "uppercase"
                      },
                      children: [
                        /* @__PURE__ */ n.jsx("i", { "data-lucide": "check-circle-2", style: { height: "14px", width: "14px" } }),
                        "확인됨"
                      ]
                    }
                  ),
                  /* @__PURE__ */ n.jsx(
                    "h3",
                    {
                      id: "booking-receipt-title",
                      style: {
                        fontFamily: '"Plus Jakarta Sans", "Noto Sans KR", sans-serif',
                        fontSize: "34px",
                        fontWeight: 900,
                        letterSpacing: "-0.05em",
                        lineHeight: 1,
                        margin: 0
                      },
                      children: "예약을 확인했습니다"
                    }
                  ),
                  /* @__PURE__ */ n.jsx("p", { style: { color: "#5f5e5e", fontSize: "14px", fontWeight: 600, margin: "8px 0 0" }, children: "제주 숙박 예약이 정상적으로 확인되었습니다." })
                ] }),
                /* @__PURE__ */ n.jsxs("div", { style: { padding: "0 26px 24px" }, children: [
                  /* @__PURE__ */ n.jsxs(
                    "div",
                    {
                      style: {
                        borderTop: "2px solid #f3f3f3",
                        columnGap: "14px",
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        paddingTop: "16px",
                        rowGap: "14px"
                      },
                      children: [
                        /* @__PURE__ */ n.jsxs("div", { style: { gridColumn: "1 / -1" }, children: [
                          /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }, children: "숙소명" }),
                          /* @__PURE__ */ n.jsx("p", { style: { fontSize: "22px", fontWeight: 800, letterSpacing: "-0.04em", margin: "5px 0 0" }, children: T(S.title) || "숙소 정보 확인" }),
                          /* @__PURE__ */ n.jsx("p", { style: { color: "#5b4137", fontSize: "14px", fontWeight: 500, margin: "3px 0 0" }, children: M })
                        ] }),
                        /* @__PURE__ */ n.jsxs("div", { children: [
                          /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }, children: "체크인" }),
                          /* @__PURE__ */ n.jsx("p", { style: { fontSize: "16px", fontWeight: 800, margin: "5px 0 0" }, children: d.checkIn })
                        ] }),
                        /* @__PURE__ */ n.jsxs("div", { children: [
                          /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }, children: "체크아웃" }),
                          /* @__PURE__ */ n.jsx("p", { style: { fontSize: "16px", fontWeight: 800, margin: "5px 0 0" }, children: d.checkOut })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ n.jsxs(
                    "div",
                    {
                      style: {
                        background: "#f3f3f3",
                        borderRadius: "16px",
                        marginTop: "22px",
                        padding: "18px 18px 20px"
                      },
                      children: [
                        /* @__PURE__ */ n.jsxs("div", { style: { alignItems: "flex-start", display: "flex", justifyContent: "space-between", marginBottom: "18px" }, children: [
                          /* @__PURE__ */ n.jsxs("div", { children: [
                            /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }, children: "예약번호" }),
                            /* @__PURE__ */ n.jsx("p", { style: { fontFamily: "monospace", fontSize: "13px", fontWeight: 800, margin: "5px 0 0" }, children: E.reservationNo })
                          ] }),
                          /* @__PURE__ */ n.jsxs("div", { style: { textAlign: "right" }, children: [
                            /* @__PURE__ */ n.jsx("span", { style: { color: "#5f5e5e", display: "block", fontSize: "9px", fontWeight: 900, letterSpacing: "0.18em", textTransform: "uppercase" }, children: "결제수단" }),
                            /* @__PURE__ */ n.jsx("p", { style: { fontSize: "13px", fontWeight: 800, margin: "5px 0 0" }, children: C })
                          ] })
                        ] }),
                        /* @__PURE__ */ n.jsxs("div", { style: { borderTop: "1px solid rgba(143, 112, 101, 0.3)", paddingTop: "14px" }, children: [
                          /* @__PURE__ */ n.jsxs("div", { style: { alignItems: "center", color: "#5f5e5e", display: "flex", fontSize: "13px", fontWeight: 600, justifyContent: "space-between", marginBottom: "10px" }, children: [
                            /* @__PURE__ */ n.jsx("span", { children: z }),
                            /* @__PURE__ */ n.jsx("span", { children: S.amount || "금액 확인 필요" })
                          ] }),
                          /* @__PURE__ */ n.jsxs("div", { style: { alignItems: "center", color: "#5f5e5e", display: "flex", fontSize: "13px", fontWeight: 600, justifyContent: "space-between", marginBottom: "14px" }, children: [
                            /* @__PURE__ */ n.jsx("span", { children: "세금 및 서비스료" }),
                            /* @__PURE__ */ n.jsx("span", { children: "세금 및 서비스 포함" })
                          ] }),
                          /* @__PURE__ */ n.jsxs("div", { style: { alignItems: "baseline", display: "flex", justifyContent: "space-between", paddingTop: "6px" }, children: [
                            /* @__PURE__ */ n.jsx("span", { style: { fontSize: "12px", fontWeight: 900, letterSpacing: "0.11em", textTransform: "uppercase" }, children: "총 결제금액" }),
                            /* @__PURE__ */ n.jsx("span", { style: { color: de, fontFamily: '"Plus Jakarta Sans", "Noto Sans KR", sans-serif', fontSize: "30px", fontWeight: 900, letterSpacing: "-0.05em" }, children: S.amount || "금액 확인 필요" })
                          ] })
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "18px" }, children: [
                    /* @__PURE__ */ n.jsx(
                      "button",
                      {
                        onClick: () => R("호텔 영수증 PDF 다운로드는 아직 연결되지 않았습니다. UI만 먼저 연결해 두었습니다."),
                        style: {
                          background: de,
                          border: "none",
                          borderRadius: "14px",
                          color: "#ffffff",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: 800,
                          padding: "14px",
                          transition: "transform 120ms ease"
                        },
                        type: "button",
                        children: "PDF 영수증 다운로드"
                      }
                    ),
                    /* @__PURE__ */ n.jsx(
                      "button",
                      {
                        onClick: x,
                        style: {
                          background: "transparent",
                          border: "none",
                          borderRadius: "14px",
                          color: de,
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 800,
                          padding: "10px"
                        },
                        type: "button",
                        children: "닫기"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ n.jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    style: {
                      background: `linear-gradient(90deg, ${de} 0%, #ff7a2f 55%, #fdba74 100%)`,
                      height: "6px"
                    }
                  }
                )
              ]
            }
          );
        })()
      }
    ) : /* @__PURE__ */ n.jsx(
      "div",
      {
        className: "meta-modal-overlay booking-receipt-overlay active",
        onClick: x,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "booking-receipt-title",
        children: /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-modal", onClick: (d) => d.stopPropagation(), children: [
          /* @__PURE__ */ n.jsxs("header", { className: "booking-receipt-header", children: [
            /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-header-copy", children: [
              /* @__PURE__ */ n.jsxs("span", { className: "booking-receipt-kicker", children: [
                Ws[S.type],
                " 예약"
              ] }),
              /* @__PURE__ */ n.jsx("h3", { className: "booking-receipt-title", children: "예약 확인" }),
              /* @__PURE__ */ n.jsx("p", { className: "booking-receipt-subtitle", children: E.subtitle })
            ] }),
            /* @__PURE__ */ n.jsx("button", { className: "booking-receipt-close", type: "button", onClick: x, "aria-label": "닫기", children: /* @__PURE__ */ n.jsx("i", { "data-lucide": "x", "aria-hidden": "true" }) })
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-body", children: [
            /* @__PURE__ */ n.jsxs("section", { className: "booking-receipt-summary", children: [
              /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-item", children: [
                /* @__PURE__ */ n.jsx("span", { className: "booking-receipt-label", children: "예약번호" }),
                /* @__PURE__ */ n.jsx("strong", { className: "booking-receipt-value", children: E.reservationNo })
              ] }),
              /* @__PURE__ */ n.jsxs("div", { className: "booking-receipt-item", children: [
                /* @__PURE__ */ n.jsx("span", { className: "booking-receipt-label", children: E.summaryLabel }),
                /* @__PURE__ */ n.jsx("strong", { className: "booking-receipt-value", children: E.summaryValue })
              ] }),
              /* @__PURE__ */ n.jsx("p", { className: "booking-receipt-note", children: E.note })
            ] }),
            /* @__PURE__ */ n.jsx("dl", { className: "booking-receipt-grid", children: E.fields.map((d) => /* @__PURE__ */ n.jsxs("div", { className: `booking-receipt-item${d.full ? " full" : ""}`, children: [
              /* @__PURE__ */ n.jsx("dt", { className: "booking-receipt-label", children: d.label }),
              /* @__PURE__ */ n.jsx("dd", { className: "booking-receipt-value", children: d.value })
            ] }, d.label)) })
          ] }),
          /* @__PURE__ */ n.jsx("footer", { className: "booking-receipt-actions", children: /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", onClick: x, children: "닫기" }) })
        ] })
      }
    ) : null
  ] });
}, ke = "/api/mypage/members/search", tr = "/api/mypage/companion-links", nr = 180, mt = 5, sr = {
  available: "none",
  invited: "outgoing_pending",
  incoming_pending: "incoming_pending",
  linked: "linked",
  needs_response: "incoming_pending",
  none: "none",
  outgoing_pending: "outgoing_pending"
}, ut = (e) => e.trim().toLowerCase(), ht = (e) => /^[a-z0-9._-]{1,30}$/i.test(e), W = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Ft = (e, t) => {
  if (W(e)) {
    const s = e.message ?? e.error;
    if (typeof s == "string" && s.trim())
      return s;
  }
  return t;
}, Kt = (e) => {
  if (typeof e != "string")
    return;
  const t = e.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return sr[t];
}, ge = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, rr = (e, t) => {
  var i;
  const s = ke.startsWith("/") ? ke : `/${ke}`, r = (i = se) == null ? void 0 : i.trim(), a = r ? new URL(s, r) : new URL(s, window.location.origin);
  return a.searchParams.set("query", e), a.searchParams.set("memberIdPrefix", e), a.searchParams.set("prefix", e), typeof t == "number" && a.searchParams.set("limit", String(t)), r ? a.toString() : `${a.pathname}${a.search}`;
}, ar = (e) => {
  if (Array.isArray(e))
    return e;
  if (!W(e))
    return [];
  const t = ["companions", "members", "users", "results", "items", "data"];
  for (const s of t) {
    const r = e[s];
    if (Array.isArray(r))
      return r;
    if (W(r) && Array.isArray(r.items))
      return r.items;
    if (W(r) && Array.isArray(r.results))
      return r.results;
  }
  if (W(e.data)) {
    const s = ["companions", "members", "users", "results", "items"];
    for (const r of s) {
      const a = e.data[r];
      if (Array.isArray(a))
        return a;
    }
  }
  return [];
}, ir = (e) => {
  if (!W(e))
    return null;
  const t = [e.invite, e.data, e.result, e.item];
  for (const s of t)
    if (W(s))
      return s;
  return e;
}, or = (e) => {
  if (!W(e))
    return null;
  const t = ge(e.id ?? e.memberId ?? e.userId ?? e.loginId), s = ge(e.name ?? e.displayName ?? e.userName ?? e.nickname ?? e.fullName), r = ge(e.avatarUrl ?? e.avatar ?? e.profileImageUrl ?? e.imageUrl ?? e.photoUrl), a = ge(e.bio ?? e.intro ?? e.description ?? e.summary), i = Kt(
    e.relationState ?? e.relation_state ?? e.relationStatus ?? e.relation_status ?? e.companionRelationState ?? e.companion_relation_state ?? (W(e.relation) ? e.relation.state : void 0)
  ) ?? (e.isLinked === !0 || e.linked === !0 ? "linked" : void 0);
  return !t || !s ? null : {
    avatarUrl: r ?? void 0,
    bio: a ?? void 0,
    id: t,
    isMember: e.isMember !== !1,
    name: s,
    relationState: i
  };
}, lr = (e) => {
  const t = /* @__PURE__ */ new Set(), s = [];
  for (const r of e)
    t.has(r.id) || (t.add(r.id), s.push(r));
  return s;
}, cr = async (e, t) => {
  const s = await fetch(rr(e, t == null ? void 0 : t.limit), {
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
    const i = W(r) && typeof r.message == "string" && r.message.trim() || W(r) && typeof r.error == "string" && r.error.trim() || "회원 조회에 실패했다";
    throw new Error(i);
  }
  if (W(r) && r.success === !1) {
    const i = typeof r.message == "string" && r.message.trim() || typeof r.error == "string" && r.error.trim() || "회원 조회에 실패했다";
    throw new Error(i);
  }
  const a = ar(r).map(or).filter((i) => i !== null);
  return lr(a).filter((i) => i.id.toLowerCase().startsWith(e));
}, dr = async (e, t) => {
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
  if (!s.ok || W(r) && r.success === !1)
    throw new Error(
      Ft(
        r,
        s.status === 401 ? "로그인이 필요합니다." : "동행 초대에 실패했다"
      )
    );
  return ir(r);
}, pr = async (e, t) => {
  const s = await fetch(`${tr}/${encodeURIComponent(e)}`, {
    credentials: "include",
    headers: {
      Accept: "application/json"
    },
    method: "DELETE",
    signal: t
  }), r = await s.json().catch(() => null);
  if (!s.ok || W(r) && r.success === !1)
    throw new Error(
      Ft(
        r,
        s.status === 401 ? "로그인이 필요합니다." : "동행 해제에 실패했다"
      )
    );
  return r;
}, mr = (e) => e instanceof Error && e.message.trim() ? e.message : "회원 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", ur = (e) => e instanceof Error && e.message.trim() ? e.message : "동행 초대 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", hr = (e) => e instanceof Error && e.message.trim() ? e.message : "동행 해제 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", fr = ({
  initialCompanions: e = [],
  searchMembers: t = cr
} = {}) => {
  const [s, r] = l.useState(e), [a, i] = l.useState(""), [o, c] = l.useState([]), [g, v] = l.useState("suggestions"), [A, j] = l.useState(!1), [S, E] = l.useState(!1), [f, x] = l.useState(null), w = l.useRef(0), N = l.useRef(/* @__PURE__ */ new Set()), m = l.useRef({
    controller: null,
    timerId: null
  }), R = l.useRef(null), d = l.useCallback(() => {
    var h;
    const I = m.current;
    I.timerId !== null && window.clearTimeout(I.timerId), (h = I.controller) == null || h.abort(), I.controller = null, I.timerId = null, E(!1);
  }, []), M = l.useCallback(() => {
    var I;
    (I = R.current) == null || I.abort(), R.current = null, j(!1);
  }, []), C = l.useCallback(
    async (I, h) => {
      var G, L, Q, X;
      const D = ut(I);
      if (!D)
        return c([]), h != null && h.strict && x({ message: "검색할 제주그룹 회원 ID를 입력해 주세요." }), [];
      if (!ht(D))
        return c([]), h != null && h.strict && x({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), [];
      const Y = ++w.current;
      if (h != null && h.strict) {
        d();
        const K = new AbortController();
        R.current = K, c([]), x(null), v("results"), j(!0), h = {
          ...h,
          signal: h.signal ?? K.signal
        };
      } else
        E(!0);
      try {
        const K = await t(D, {
          limit: h != null && h.strict ? void 0 : mt,
          signal: h == null ? void 0 : h.signal
        });
        return Y !== w.current || (G = h == null ? void 0 : h.signal) != null && G.aborted ? [] : (c(K), h != null && h.strict && K.length === 0 ? x({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" }) : x(null), K);
      } catch (K) {
        return Y !== w.current || (L = h == null ? void 0 : h.signal) != null && L.aborted ? [] : (c([]), x({ message: mr(K) }), []);
      } finally {
        Y === w.current && !((Q = h == null ? void 0 : h.signal) != null && Q.aborted) && (h != null && h.strict ? (j(!1), ((X = R.current) == null ? void 0 : X.signal) === h.signal && (R.current = null)) : E(!1));
      }
    },
    [d, t]
  );
  l.useEffect(() => {
    const I = ut(a);
    if (!I)
      return c([]), x(null), E(!1), () => {
        w.current += 1;
      };
    if (!ht(I))
      return c([]), x({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), E(!1), () => {
        w.current += 1;
      };
    const h = new AbortController(), D = window.setTimeout(() => {
      C(I, { signal: h.signal });
    }, nr);
    return m.current.controller = h, m.current.timerId = D, () => {
      h.abort(), window.clearTimeout(D), m.current.controller === h && (m.current.controller = null), m.current.timerId === D && (m.current.timerId = null), w.current += 1;
    };
  }, [C, a]);
  const z = l.useCallback((I) => {
    M(), i(I), c([]), v("suggestions"), x(null), d();
  }, [M, d]), _ = l.useCallback(() => {
    M(), d(), w.current += 1, i(""), c([]), v("suggestions"), j(!1), E(!1), x(null);
  }, [M, d]), k = l.useCallback(
    async (I) => (d(), await C(I, { strict: !0 })),
    [d, C]
  ), U = l.useCallback(async (I) => {
    x(null);
    try {
      const h = await dr(I), D = W(h) ? Kt(
        h.relationState ?? h.relation_state ?? h.status ?? h.inviteState ?? h.invite_state
      ) ?? "outgoing_pending" : "outgoing_pending";
      c(
        (Y) => Y.map(
          (G) => G.id === I.id ? {
            ...G,
            relationState: D
          } : G
        )
      );
    } catch (h) {
      x({ message: ur(h) });
    }
  }, []), b = l.useCallback(async (I) => {
    x(null), N.current.add(I), r((h) => h.filter((D) => D.id !== I)), c(
      (h) => h.map(
        (D) => D.id === I ? {
          ...D,
          relationState: "none"
        } : D
      )
    );
  }, []), $ = l.useCallback(async () => {
    const I = Array.from(N.current);
    if (I.length !== 0)
      for (const h of I)
        try {
          await pr(h), N.current.delete(h);
        } catch (D) {
          throw x({ message: hr(D) }), D;
        }
  }, []);
  return {
    companions: s,
    clearSearch: _,
    errorObj: f,
    handleSearch: k,
    isSearching: A,
    isSuggestionLoading: S,
    inviteCompanion: U,
    commitPendingUnlinks: $,
    removeCompanion: b,
    searchMode: g,
    searchQuery: a,
    searchResults: o,
    setSearchQuery: z,
    visibleSuggestionCount: mt
  };
}, Ht = ({
  companion: e,
  className: t = "",
  showLinkedIndicator: s = !0,
  style: r
}) => {
  const [a, i] = l.useState(!1), o = V(e.avatarUrl), c = !!(o && !a);
  return l.useEffect(() => {
    i(!1);
  }, [o]), /* @__PURE__ */ n.jsxs(
    "div",
    {
      "aria-hidden": "true",
      className: `companion-avatar soft-radius companion-search-avatar ${s ? "is-linked" : ""} ${t}`.trim(),
      "data-companion-search-avatar": "true",
      style: r,
      children: [
        c ? /* @__PURE__ */ n.jsx(
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
}, xr = {
  incoming_pending: "응답 필요",
  linked: "연동됨",
  none: "초대",
  outgoing_pending: "초대중"
}, gr = (e, t) => t ? "linked" : e.relationState ?? "none", yr = (e) => xr[e], ft = ({ companion: e, isLinked: t, onInvite: s }) => {
  var c;
  const r = ((c = e.bio) == null ? void 0 : c.trim()) || `@${e.id}`, a = gr(e, t), i = a === "none", o = yr(a);
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
          /* @__PURE__ */ n.jsx(Ht, { companion: e, showLinkedIndicator: a === "linked" }),
          /* @__PURE__ */ n.jsxs("div", { className: "user-info name-meta companion-search-card-copy", children: [
            /* @__PURE__ */ n.jsx("strong", { children: e.name }),
            /* @__PURE__ */ n.jsx("span", { children: r })
          ] })
        ] }),
        /* @__PURE__ */ n.jsx("span", { className: "pill-shape companion-search-card-badge", "data-linked": t ? "true" : "false", children: o })
      ]
    }
  );
}, br = ({
  initialCompanions: e,
  isOpen: t,
  onClose: s,
  onSave: r
}) => {
  const {
    companions: a,
    searchMode: i,
    searchQuery: o,
    searchResults: c,
    setSearchQuery: g,
    isSearching: v,
    errorObj: A,
    handleSearch: j,
    inviteCompanion: S,
    commitPendingUnlinks: E,
    removeCompanion: f,
    clearSearch: x
  } = fr({ initialCompanions: e }), w = l.useRef(null), [N, m] = l.useState(!1), R = 4, d = o.trim().length > 0, M = l.useMemo(
    () => c.slice(0, R),
    [c]
  );
  if (l.useEffect(() => {
    if (t) {
      x();
      const b = window.setTimeout(() => {
        var $;
        return ($ = w.current) == null ? void 0 : $.focus();
      }, 100);
      return () => window.clearTimeout(b);
    }
  }, [t, x]), l.useEffect(() => {
    const b = ($) => {
      $.key === "Escape" && t && s();
    };
    return window.addEventListener("keydown", b), () => window.removeEventListener("keydown", b);
  }, [t, s]), l.useEffect(() => {
    t && window.lucide && window.lucide.createIcons();
  }, [t, i, c.length, a.length]), !t) return null;
  const C = (b) => {
    b.preventDefault(), j(o);
  }, z = async () => {
    m(!0);
    try {
      await E(), r(a), s();
    } catch {
      return;
    } finally {
      m(!1);
    }
  }, _ = (b) => a.some(($) => $.id === b), k = () => i !== "results" ? null : /* @__PURE__ */ n.jsx("div", { className: "companion-search-results-panel", children: A ? /* @__PURE__ */ n.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", fontWeight: 600 }, children: [
    /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
    A.message
  ] }) : v ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "28px 20px", fontSize: "14px" }, children: "제주그룹 회원을 찾는 중이다." }) : c.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "28px 20px", fontSize: "14px" }, children: "일치하는 제주그룹 회원이 없다." }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
    /* @__PURE__ */ n.jsxs("div", { style: { color: "var(--meta-text-muted)", fontSize: "13px", fontWeight: 700, flexShrink: 0 }, children: [
      "검색 결과 ",
      c.length,
      "명"
    ] }),
    /* @__PURE__ */ n.jsx("div", { className: "companion-search-results-list", children: c.map((b) => /* @__PURE__ */ n.jsx(
      ft,
      {
        companion: b,
        isLinked: _(b.id),
        onInvite: S
      },
      b.id
    )) })
  ] }) }), U = () => i === "results" || M.length === 0 ? null : /* @__PURE__ */ n.jsx("div", { className: "companion-search-dropdown", children: M.map((b) => /* @__PURE__ */ n.jsx(
    ft,
    {
      companion: b,
      isLinked: _(b.id),
      onInvite: S
    },
    b.id
  )) });
  return /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: s, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ n.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (b) => b.stopPropagation(),
      style: { display: "flex", flexDirection: "column", overflow: "hidden", padding: "40px" },
      children: [
        /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ n.jsxs("div", { className: "companion-modal-body", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "24px", minHeight: 0, overflow: "hidden" }, children: [
          /* @__PURE__ */ n.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: C, style: { gap: "16px", marginBottom: "0", flexShrink: 0 }, children: [
            /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flex: 1, flexDirection: "column", gap: "12px", minWidth: 0, position: "relative" }, children: [
              /* @__PURE__ */ n.jsx(
                "input",
                {
                  ref: w,
                  className: "id-input companion-search-input",
                  type: "text",
                  placeholder: "제주그룹 회원 ID를 입력해 주세요",
                  value: o,
                  onChange: (b) => g(b.target.value),
                  style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px", width: "100%" },
                  autoComplete: "off"
                }
              ),
              /* @__PURE__ */ n.jsx("div", { style: { left: 0, position: "absolute", right: 0, top: "calc(100% - 1px)", zIndex: 3 }, children: U() })
            ] }),
            /* @__PURE__ */ n.jsx(
              "button",
              {
                type: "submit",
                className: "add-btn companion-search-submit pill-shape",
                disabled: v,
                style: {
                  background: d ? "#ff7a00" : "#eef1f4",
                  border: d ? "1px solid #ff7a00" : "1px solid #d7dce2",
                  boxShadow: "none",
                  color: d ? "#fff" : "#7b8794",
                  padding: "0 36px",
                  fontSize: "16px",
                  borderRadius: "16px",
                  flexShrink: 0
                },
                children: v ? "검색 중..." : "검색"
              }
            )
          ] }),
          i === "results" ? k() : null,
          A && i !== "results" && /* @__PURE__ */ n.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            A.message
          ] }),
          i !== "results" && /* @__PURE__ */ n.jsxs("div", { className: "linked-companions-section", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", minHeight: 0, overflow: "hidden" }, children: [
            /* @__PURE__ */ n.jsxs("h4", { style: { fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }, children: [
              "연동된 동행자 (",
              a.length,
              "명)"
            ] }),
            a.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없습니다. 제주그룹 회원 ID를 검색해 초대해 주세요." }) : /* @__PURE__ */ n.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "16px", minHeight: 0, overflowY: "auto", paddingRight: "4px" }, children: a.map((b) => /* @__PURE__ */ n.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ n.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ n.jsx(
                  Ht,
                  {
                    companion: b,
                    className: "companion-linked-avatar",
                    showLinkedIndicator: b.isMember,
                    style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }
                  }
                ),
                /* @__PURE__ */ n.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ n.jsx("strong", { style: { fontSize: "16px" }, children: b.name }),
                  /* @__PURE__ */ n.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    b.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ n.jsx(
                "button",
                {
                  className: "remove-btn companion-remove-btn",
                  type: "button",
                  onClick: () => void f(b.id),
                  style: { padding: "10px 24px", fontSize: "14px" },
                  children: "해제"
                }
              )
            ] }, b.id)) })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "24px", gap: "16px", flexShrink: 0 }, children: [
          /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: s, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ n.jsx(
            "button",
            {
              className: "save-btn pill-shape",
              type: "button",
              onClick: () => void z(),
              disabled: N,
              style: { padding: "20px 0", fontSize: "16px" },
              children: N ? "적용 중" : "적용"
            }
          )
        ] })
      ]
    }
  ) });
}, vr = (e) => {
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
}, jr = ({ companion: e }) => {
  const [t, s] = l.useState(!1), r = V(e.avatarUrl), a = !!(r && !t);
  return l.useEffect(() => {
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
}, Sr = () => {
  const { dispatch: e, state: t } = le(), s = t.itinerary ?? [], r = s.length > 0 ? s : [
    {
      activities: [],
      companions: [],
      date: "일정 미정",
      googleMapUrl: "",
      id: "empty-itinerary",
      time: "시간 미정",
      title: "여행 일정 준비 중"
    }
  ], a = t.linkedCompanions ?? [], i = t.profile, [o, c] = l.useState(!1), [g, v] = l.useState(null), A = l.useRef({}), [j, S] = l.useState({});
  l.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []), l.useLayoutEffect(() => {
    const f = r.reduce((x, w) => {
      var N;
      return x[w.id] = ((N = A.current[w.id]) == null ? void 0 : N.scrollHeight) ?? 0, x;
    }, {});
    S((x) => {
      const w = Object.keys(x), N = Object.keys(f);
      return w.length === N.length && N.every((m) => x[m] === f[m]) ? x : f;
    });
  }, [r, o]);
  const E = (f) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: f }), as(
      {
        id: i.id,
        profile: {
          email: i.email,
          id: i.id,
          name: i.name
        }
      },
      {
        linkedCompanions: f
      }
    ), v(null);
  };
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ n.jsxs("div", { className: `itinerary-timeline-wrap ${o ? "is-expanded" : ""}`, children: [
      r.map((f, x) => {
        const w = x < 2, N = w || o, m = j[f.id] ?? 720, R = f.id === "empty-itinerary", d = a.length > 0 ? a : f.companions, M = d.slice(0, 4), C = d.length > 4 ? d.length - 4 : 0, z = C > 0 ? `외 ${C}명` : `총 ${d.length}명`;
        return /* @__PURE__ */ n.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (_) => {
              A.current[f.id] = _;
            },
            "aria-hidden": !N,
            style: w ? void 0 : {
              overflow: "hidden",
              maxHeight: N ? `${m}px` : "0px",
              opacity: N ? 1 : 0,
              transform: N ? "translateY(0)" : "translateY(-18px)",
              marginBottom: N ? "40px" : "0px",
              pointerEvents: N ? "auto" : "none",
              transition: "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)"
            },
            children: [
              /* @__PURE__ */ n.jsxs("div", { className: "day-side-info", children: [
                /* @__PURE__ */ n.jsx("span", { className: "day-date", children: f.date }),
                /* @__PURE__ */ n.jsx("span", { className: "day-time", children: f.time }),
                /* @__PURE__ */ n.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
                  /* @__PURE__ */ n.jsxs("div", { className: "comp-head", children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "users", className: "lucide-users" }),
                    /* @__PURE__ */ n.jsx("span", { className: "small-label", children: "함께하는 동행자" })
                  ] }),
                  /* @__PURE__ */ n.jsxs("div", { className: "avatar-stack", children: [
                    M.map((_) => /* @__PURE__ */ n.jsx(jr, { companion: _ }, _.id)),
                    /* @__PURE__ */ n.jsx("span", { className: "comp-count-label", children: z })
                  ] }),
                  /* @__PURE__ */ n.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => v(f.id), children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ n.jsxs(ie, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ n.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ n.jsx("h3", { className: "iti-title", children: f.title }),
                  f.googleMapUrl ? /* @__PURE__ */ n.jsxs("a", { className: "map-link-btn pill-shape", href: f.googleMapUrl, rel: "noopener noreferrer", target: "_blank", children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 보기"
                  ] }) : /* @__PURE__ */ n.jsxs("span", { className: "map-link-btn pill-shape is-disabled", "aria-disabled": "true", children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 준비 중"
                  ] })
                ] }),
                /* @__PURE__ */ n.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ n.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ n.jsx("ul", { className: `checklist-list ${f.activities.length === 0 ? "is-empty" : ""}`, children: f.activities.map((_) => {
                    const k = vr(_.status), U = _.status === "used", b = _.status === "cancelled" || _.status === "missed";
                    return /* @__PURE__ */ n.jsx(
                      "li",
                      {
                        className: `checklist-item ${U ? "checked" : ""} soft-radius`,
                        style: k.style,
                        children: /* @__PURE__ */ n.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ n.jsx(
                            "i",
                            {
                              "data-lucide": k.icon,
                              style: {
                                color: U ? "var(--brand-rent)" : b ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ n.jsx("span", { className: "check-text", children: _.label }),
                            /* @__PURE__ */ n.jsx(
                              "span",
                              {
                                style: {
                                  color: b ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (_.ownerName ?? "본인") + " · " + k.label
                              }
                            )
                          ] })
                        ] })
                      },
                      _.id
                    );
                  }) }),
                  R ? /* @__PURE__ */ n.jsx("p", { className: "checklist-empty-caption", children: "등록된 활동이 아직 없다." }) : null
                ] })
              ] })
            ]
          },
          f.id
        );
      }),
      s.length > 2 && /* @__PURE__ */ n.jsx("div", { className: `timeline-gradient-overlay ${o ? "active" : ""}`, children: /* @__PURE__ */ n.jsx("button", { className: "expand-cta-btn pill-shape", onClick: () => c(!o), children: o ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
        "전체 일정 접기 ",
        /* @__PURE__ */ n.jsx("i", { className: "lucide-chevron-up" })
      ] }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
        "남은 ",
        s.length - 2,
        "개의 일정 더 보기 ",
        /* @__PURE__ */ n.jsx("i", { className: "lucide-chevron-down" })
      ] }) }) })
    ] }),
    g && /* @__PURE__ */ n.jsx(
      br,
      {
        isOpen: !!g,
        onClose: () => v(null),
        initialCompanions: a,
        onSave: E
      }
    )
  ] });
}, Nr = 5 * 1024 * 1024, Z = 512, wr = 16, Ir = 6, Vt = 20, Ar = {
  alignItems: "center",
  borderRadius: "50%",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  overflow: "hidden",
  position: "absolute"
}, kr = {
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%"
}, Er = {
  alignItems: "center",
  display: "flex",
  fontSize: "18px",
  fontWeight: 800,
  height: "100%",
  justifyContent: "center",
  width: "100%"
}, ye = (e) => Array.from((e ?? "").trim()).slice(0, Vt).join(""), Ee = (e) => ({
  bio: e.bio ?? "",
  email: e.email,
  name: e.name,
  nickname: e.nickname ?? "",
  phone: e.phone
}), Cr = (e) => ({
  bio: ye(e.bio),
  email: e.email.trim(),
  name: e.name.trim(),
  nickname: e.nickname.trim(),
  phone: e.phone.trim()
}), xt = (e) => (e.nickname.trim().length === 0 || e.nickname.trim().length >= 2) && e.email.trim().includes("@") && e.phone.trim().length > 0, gt = (e) => `${se}${e}`, pe = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Tr = (e) => new Promise((t, s) => {
  const r = new FileReader();
  r.onload = () => {
    if (typeof r.result == "string") {
      t(r.result);
      return;
    }
    s(new Error("이미지 데이터를 읽지 못했습니다."));
  }, r.onerror = () => s(new Error("이미지 데이터를 읽지 못했습니다.")), r.readAsDataURL(e);
}), be = (e, t, s) => Math.min(s, Math.max(t, e)), te = (e, t, s) => {
  if (!e.naturalWidth || !e.naturalHeight)
    return null;
  const r = Math.max(1, Math.round(t || 320)), a = Math.max(1, Math.round(s || 320)), i = Math.max(0, Math.min(r, a) - wr * 2), o = i / 2, c = Math.min(r / e.naturalWidth, a / e.naturalHeight), g = e.naturalWidth * c, v = e.naturalHeight * c, A = Math.max(i / Math.max(g, 1), i / Math.max(v, 1), 1);
  return {
    baseHeight: v,
    baseScale: c,
    baseWidth: g,
    circleDiameter: i,
    circleRadius: o,
    maxZoom: Ir,
    minZoom: A,
    stageHeight: a,
    stageWidth: r
  };
}, ve = (e, t) => {
  const s = be(e.zoom, t.minZoom, t.maxZoom), r = t.baseWidth * s, a = t.baseHeight * s, i = Math.max(0, (r - t.circleDiameter) / 2), o = Math.max(0, (a - t.circleDiameter) / 2);
  return {
    panX: be(e.panX, -i, i),
    panY: be(e.panY, -o, o),
    zoom: s
  };
}, Mr = (e, t, s, r, a) => {
  const i = te(t, s, r);
  return i ? ve(a, i) : e;
}, Rr = (e, t, s) => new Promise((r, a) => {
  const i = document.createElement("canvas"), o = window.devicePixelRatio || 1;
  i.width = Math.max(1, Math.round(Z * o)), i.height = Math.max(1, Math.round(Z * o));
  const c = i.getContext("2d");
  if (!c)
    throw new Error("프로필 사진 편집용 캔버스를 만들지 못했습니다.");
  c.scale(o, o), c.imageSmoothingQuality = "high", c.clearRect(0, 0, Z, Z);
  const g = Z / Math.max(t.circleDiameter, 1), v = t.baseWidth * s.zoom, A = t.baseHeight * s.zoom, j = t.stageWidth / 2 + s.panX - v / 2 - (t.stageWidth / 2 - t.circleRadius), S = t.stageHeight / 2 + s.panY - A / 2 - (t.stageHeight / 2 - t.circleRadius);
  c.save(), c.beginPath(), c.arc(
    Z / 2,
    Z / 2,
    Z / 2,
    0,
    Math.PI * 2
  ), c.closePath(), c.clip(), c.drawImage(
    e,
    j * g,
    S * g,
    v * g,
    A * g
  ), c.restore(), i.toBlob((E) => {
    if (E) {
      r(E);
      return;
    }
    a(new Error("프로필 사진 편집용 이미지를 만들지 못했습니다."));
  }, "image/png");
}), zr = (e) => {
  if (!pe(e))
    return null;
  const t = pe(e.profile) ? e.profile : null, s = pe(e.dashboard) ? e.dashboard : null, r = s && pe(s.profile) ? s.profile : null, a = pe(e.data) ? e.data : null, i = [
    e.avatarUrl,
    t == null ? void 0 : t.avatarUrl,
    s == null ? void 0 : s.avatarUrl,
    r == null ? void 0 : r.avatarUrl,
    a == null ? void 0 : a.avatarUrl
  ];
  for (const o of i)
    if (typeof o == "string") {
      const c = o.trim();
      if (c.length > 0)
        return c;
    }
  return null;
}, _r = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, Dr = () => {
  var Xe, Ze, Je, Qe, et, tt;
  const { refreshDashboard: e, state: t } = le(), s = t.profile ?? J, r = (Xe = t.stats) != null && Xe.length ? t.stats : _e, a = s.passport, [i, o] = l.useState(() => Ee(s)), [c, g] = l.useState(() => Ee(s)), [v, A] = l.useState(!1), [j, S] = l.useState("profile"), [E, f] = l.useState(!1), [x, w] = l.useState(null), [N, m] = l.useState(null), [R, d] = l.useState(!1), [M, C] = l.useState(null), [z, _] = l.useState(null), [k, U] = l.useState({ panX: 0, panY: 0, zoom: 1 }), [b, $] = l.useState({ height: 320, width: 320 }), [I, h] = l.useState(!1), [D, Y] = l.useState(!1), G = l.useRef(null), L = l.useRef(null), Q = l.useRef(null), X = l.useRef(null), K = V(M) ?? s.avatarUrl ?? null, Yt = (c.nickname.trim().charAt(0) || c.name.trim().charAt(0) || ((Ze = i.nickname) == null ? void 0 : Ze.trim().charAt(0)) || i.name.trim().charAt(0) || ((Je = J.nickname) == null ? void 0 : Je.trim().charAt(0)) || J.name.trim().charAt(0) || "J").toUpperCase(), Gt = c.nickname.trim() || c.name.trim() || ((Qe = i.nickname) == null ? void 0 : Qe.trim()) || i.name.trim() || ((et = J.nickname) == null ? void 0 : et.trim()) || J.name.trim(), qt = ye(c.bio) || ye(i.bio), Ne = c.nickname.trim().length > 0 && c.nickname.trim().length < 2 ? "닉네임은 2자 이상부터 가능합니다" : null;
  l.useEffect(() => {
    v && window.lucide && window.lucide.createIcons();
  }, [v, j]), l.useEffect(() => {
    if (!v)
      return;
    const p = document.body.style.overflow, y = document.documentElement.style.overflow;
    return document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", () => {
      document.body.style.overflow = p, document.documentElement.style.overflow = y;
    };
  }, [v]), l.useEffect(() => {
    const p = Ee(s);
    v || (o(p), g(p));
  }, [s, v]), l.useEffect(() => {
    if (!v || j !== "avatar" || !Q.current)
      return;
    const p = () => {
      var F;
      const O = (F = Q.current) == null ? void 0 : F.getBoundingClientRect();
      O && $({
        height: Math.max(1, Math.round(O.height)),
        width: Math.max(1, Math.round(O.width))
      });
    };
    p();
    const y = new ResizeObserver(p);
    return y.observe(Q.current), () => y.disconnect();
  }, [z, v, j]), l.useEffect(() => {
    if (!z || !I || !L.current)
      return;
    const p = te(L.current, b.width, b.height);
    p && U((y) => ve(y, p));
  }, [I, z, b.height, b.width]);
  const Xt = () => {
    const p = L.current;
    if (!p)
      return;
    const y = te(p, b.width, b.height);
    if (!y) {
      m("이미지 크기를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    h(!0), U(ve({ panX: 0, panY: 0, zoom: y.minZoom }, y)), m(null);
  }, we = () => {
    _(null), U({ panX: 0, panY: 0, zoom: 1 }), h(!1), m(null), d(!1), Y(!1), X.current = null;
  }, Zt = () => {
    g(i), w(null), S("profile"), C((p) => V(p) ?? s.avatarUrl ?? null), we(), A(!0);
  }, Oe = () => {
    g(i), w(null), S("profile"), we(), A(!1);
  }, Be = () => {
    S("avatar"), we();
  }, Fe = () => {
    var p;
    (p = G.current) == null || p.click();
  }, Jt = async (p) => {
    var O;
    const y = (O = p.target.files) == null ? void 0 : O[0];
    if (p.target.value = "", !!y) {
      if (!y.type.startsWith("image/")) {
        m("이미지 파일만 선택해 주세요.");
        return;
      }
      if (y.size > Nr) {
        m("프로필 사진은 5MB 이하로 선택해 주세요.");
        return;
      }
      try {
        const F = await Tr(y);
        _(F), U({ panX: 0, panY: 0, zoom: 1 }), h(!1), m(null);
      } catch {
        m("이미지를 불러오지 못했습니다. 다른 파일로 다시 선택해 주세요.");
      }
    }
  }, Qt = (p) => {
    L.current && U(
      (y) => Mr(
        y,
        L.current,
        b.width,
        b.height,
        p
      )
    );
  }, en = (p) => {
    !z || !I || !L.current || !te(L.current, b.width, b.height) || (p.preventDefault(), p.currentTarget.setPointerCapture(p.pointerId), X.current = {
      pointerId: p.pointerId,
      startClientX: p.clientX,
      startClientY: p.clientY,
      startPanX: k.panX,
      startPanY: k.panY
    }, Y(!0));
  }, tn = (p) => {
    const y = X.current;
    if (!y || y.pointerId !== p.pointerId || !I || !L.current)
      return;
    const O = {
      panX: y.startPanX + (p.clientX - y.startClientX),
      panY: y.startPanY + (p.clientY - y.startClientY),
      zoom: k.zoom
    };
    Qt(O);
  }, Ke = (p) => {
    const y = X.current;
    !y || y.pointerId !== p.pointerId || (X.current = null, Y(!1), p.currentTarget.hasPointerCapture(p.pointerId) && p.currentTarget.releasePointerCapture(p.pointerId));
  }, nn = (p) => {
    !z || !I || !L.current || (p.preventDefault(), p.stopPropagation(), U((y) => {
      const O = L.current;
      if (!O)
        return y;
      const F = te(O, b.width, b.height);
      if (!F)
        return y;
      const ce = Math.exp(-p.deltaY * 12e-4), he = be(y.zoom * ce, F.minZoom, F.maxZoom), ae = he / Math.max(y.zoom, 1e-4);
      return ve(
        {
          panX: y.panX * ae,
          panY: y.panY * ae,
          zoom: he
        },
        F
      );
    }));
  }, sn = async () => {
    if (!z || !I || !L.current) {
      m("먼저 이미지를 선택해 주세요.");
      return;
    }
    const p = te(L.current, b.width, b.height);
    if (!p) {
      m("이미지 정보를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    d(!0), m(null);
    try {
      const y = await Rr(L.current, p, k), O = new File([y], "avatar.png", { type: "image/png" }), F = new FormData();
      F.append("avatar", O);
      const ce = await fetch(gt("/api/mypage/avatar"), {
        body: F,
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      });
      if (ce.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!ce.ok)
        throw new Error("프로필 사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const he = await ce.json().catch(() => null), ae = V(zr(he));
      ae && C(ae);
      const pn = await e();
      !ae && pn && C(null), S("profile");
    } catch (y) {
      m(y instanceof Error ? y.message : "프로필 사진 적용에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      d(!1);
    }
  }, rn = async () => {
    const p = Cr(c);
    if (!xt(p)) {
      w(Ne ?? "닉네임, 이메일, 휴대전화 정보를 확인해 주세요.");
      return;
    }
    f(!0), w(null);
    try {
      const y = await fetch(gt("/api/mypage/profile"), {
        body: JSON.stringify(p),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PUT"
      });
      if (y.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!y.ok)
        throw new Error("프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      if (!await e())
        throw new Error("저장은 완료되었지만 최신 정보를 다시 불러오지 못했습니다.");
      A(!1), S("profile");
    } catch (y) {
      w(y instanceof Error ? y.message : "프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      f(!1);
    }
  }, an = E || !xt(c), P = z && I && L.current ? te(L.current, b.width, b.height) : null, He = P ? P.baseWidth * k.zoom : 0, Ve = P ? P.baseHeight * k.zoom : 0, on = P ? P.stageWidth / 2 + k.panX - He / 2 : 0, ln = P ? P.stageHeight / 2 + k.panY - Ve / 2 : 0, Ye = (P == null ? void 0 : P.circleDiameter) ?? 0, re = (P == null ? void 0 : P.circleRadius) ?? 0, cn = {
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
  }, dn = P ? {
    display: "block",
    height: `${Ve}px`,
    left: `${on}px`,
    maxHeight: "none",
    maxWidth: "none",
    objectFit: "contain",
    pointerEvents: "none",
    position: "absolute",
    top: `${ln}px`,
    userSelect: "none",
    width: `${He}px`
  } : {
    display: "block",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    width: "auto"
  }, Ge = P ? {
    background: "rgba(20, 24, 31, 0.14)",
    inset: 0,
    maskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, re - 2)}px, black ${Math.max(0, re - 1)}px, black 100%)`,
    WebkitMaskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, re - 2)}px, black ${Math.max(0, re - 1)}px, black 100%)`,
    pointerEvents: "none",
    position: "absolute"
  } : null, qe = P ? {
    border: "2px dashed rgba(255, 255, 255, 0.94)",
    borderRadius: "50%",
    boxShadow: "0 0 0 1px rgba(17, 24, 39, 0.14)",
    height: `${Ye}px`,
    left: `calc(50% - ${re}px)`,
    pointerEvents: "none",
    position: "absolute",
    top: `calc(50% - ${re}px)`,
    width: `${Ye}px`
  } : null;
  return /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
    /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ n.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ n.jsxs(ie, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ n.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ n.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: Zt, children: "내 정보 수정" })
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "닉네임" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", style: i.nickname ? void 0 : { color: "#9ca3af" }, children: (tt = i.nickname) != null && tt.trim() ? i.nickname : "설정하지 않음" })
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
        /* @__PURE__ */ n.jsxs(ie, { className: "passport-info-box meta-glass-theme", children: [
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
        /* @__PURE__ */ n.jsxs(ie, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ n.jsx("div", { className: "box-head", children: /* @__PURE__ */ n.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ n.jsx("div", { className: "benefit-tiles", children: r.slice(0, 2).map((p) => /* @__PURE__ */ n.jsxs("div", { className: `benefit-tile tone-${p.tone} soft-radius`, children: [
            /* @__PURE__ */ n.jsx("span", { className: "benefit-label", children: p.label }),
            /* @__PURE__ */ n.jsx("strong", { className: "benefit-value", style: _r(p.tone), children: p.value }),
            /* @__PURE__ */ n.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, p.label)) })
        ] })
      ] })
    ] }),
    v ? /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay", onClick: Oe, children: /* @__PURE__ */ n.jsx(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (p) => p.stopPropagation(),
        style: { padding: "36px" },
        children: j === "profile" ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
          /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
            /* @__PURE__ */ n.jsx("span", { style: { color: "#6b7280", fontSize: "13px", fontWeight: 700, lineHeight: 1.4 }, children: "공용 프로필 미리보기 - 눌러서 이미지 변경" }),
            /* @__PURE__ */ n.jsxs(
              "div",
              {
                className: "profile-link-preview soft-radius",
                role: "button",
                tabIndex: 0,
                onClick: Be,
                onKeyDown: (p) => {
                  (p.key === "Enter" || p.key === " ") && (p.preventDefault(), Be());
                },
                children: [
                  /* @__PURE__ */ n.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", style: { position: "relative" }, children: [
                    /* @__PURE__ */ n.jsx("span", { style: Ar, children: K ? /* @__PURE__ */ n.jsx("img", { alt: "", className: "profile-link-preview-image", src: K, style: kr }) : /* @__PURE__ */ n.jsx("span", { style: Er, children: Yt }) }),
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                  ] }),
                  /* @__PURE__ */ n.jsxs("div", { className: "profile-link-copy", children: [
                    /* @__PURE__ */ n.jsx("strong", { children: Gt }),
                    /* @__PURE__ */ n.jsx("span", { children: qt })
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
                          maxLength: Vt,
                          type: "text",
                          value: c.bio,
                          onChange: (p) => g((y) => ({
                            ...y,
                            bio: ye(p.target.value)
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
                          value: c.nickname,
                          onChange: (p) => g((y) => ({ ...y, nickname: p.target.value })),
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
                          value: c.email,
                          onChange: (p) => g((y) => ({ ...y, email: p.target.value })),
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
                          value: c.phone,
                          onChange: (p) => g((y) => ({ ...y, phone: p.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) })
                    ]
                  }
                )
              ]
            }
          ),
          x ? /* @__PURE__ */ n.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: x }) : null,
          E ? /* @__PURE__ */ n.jsx("div", { "aria-live": "polite", role: "status", style: { color: "#4b5563", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: "저장 중..." }) : null,
          /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "34px", gap: "14px" }, children: [
            /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: Oe, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ n.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: rn,
                disabled: an,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
          /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "프로필 사진 편집" }) }) }),
          /* @__PURE__ */ n.jsx("input", { ref: G, accept: "image/*", hidden: !0, type: "file", onChange: Jt }),
          /* @__PURE__ */ n.jsx("div", { className: "profile-avatar-editor soft-radius", children: /* @__PURE__ */ n.jsx("div", { className: "profile-avatar-editor-preview", children: /* @__PURE__ */ n.jsx(
            "div",
            {
              ref: Q,
              onPointerCancel: Ke,
              onPointerDown: en,
              onPointerMove: tn,
              onPointerUp: Ke,
              onWheel: nn,
              style: {
                ...cn,
                cursor: z ? D ? "grabbing" : "grab" : "default"
              },
              children: z ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
                /* @__PURE__ */ n.jsx(
                  "img",
                  {
                    ref: L,
                    alt: "프로필 사진 편집 미리보기",
                    draggable: !1,
                    src: z,
                    style: dn,
                    onLoad: Xt
                  }
                ),
                Ge ? /* @__PURE__ */ n.jsx("div", { style: Ge }) : null,
                qe ? /* @__PURE__ */ n.jsx("div", { style: qe }) : null
              ] }) : /* @__PURE__ */ n.jsx(
                "button",
                {
                  className: "profile-avatar-editor-empty",
                  type: "button",
                  onClick: Fe,
                  children: "사진 선택"
                }
              )
            }
          ) }) }),
          z ? /* @__PURE__ */ n.jsx("div", { style: { display: "flex", justifyContent: "center", marginTop: "-4px" }, children: /* @__PURE__ */ n.jsx(
            "button",
            {
              type: "button",
              onClick: Fe,
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
          N ? /* @__PURE__ */ n.jsx("div", { className: "error-message", role: "status", "aria-live": "polite", style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, marginTop: "8px" }, children: N }) : null,
          /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "10px", gap: "14px" }, children: [
            /* @__PURE__ */ n.jsx(
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
            /* @__PURE__ */ n.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: sn,
                disabled: !z || !I || R,
                style: { padding: "18px 0", fontSize: "15px" },
                children: R ? "적용 중..." : "적용"
              }
            )
          ] })
        ] })
      }
    ) }) : null
  ] });
}, Lr = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"]
}, Ur = () => typeof document > "u" ? !1 : Array.from(document.querySelectorAll("link[href], script[src]")).some((e) => (e.getAttribute("href") ?? e.getAttribute("src") ?? "").includes("/front-mirror/")), yt = (e, t = !1) => {
  const s = e === "qna" ? "qna" : e === "notice" ? "notice" : "faq", [r, a] = Lr[s];
  return t ? a : r;
}, Pr = () => {
  const { state: e } = le(), t = e.supportItems ?? [], [s] = l.useState(Ur), [r, a] = l.useState({});
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
            r[i.id] || s || (a((c) => ({
              ...c,
              [i.id]: !0
            })), o.currentTarget.src = yt(i.id, !0));
          },
          src: yt(i.id, s || r[i.id] === !0)
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
}, $r = () => /* @__PURE__ */ n.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ n.jsx(Ls, {}),
  /* @__PURE__ */ n.jsx(er, {}),
  /* @__PURE__ */ n.jsx(Sr, {}),
  /* @__PURE__ */ n.jsx(Dr, {}),
  /* @__PURE__ */ n.jsx(Pr, {})
] }), Br = () => /* @__PURE__ */ n.jsx(vs, { children: /* @__PURE__ */ n.jsx($r, {}) });
export {
  Br as M
};
