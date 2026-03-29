import { a as c, j as n } from "./react-vendor-BoSfm_Te.js";
import { A as ae } from "./legacy-core-CYHwlLlr.js";
const tn = /^[a-zA-Z][a-zA-Z\d+\-.]*:/, Ce = {
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
}, ut = [
  { label: "보유 포인트", tone: "point", value: "0P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "0장" },
  { label: "다가오는 여행", tone: "air", value: "0건" }
], pt = [
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
], ht = {
  id: "",
  isMember: !1,
  name: ""
}, nn = {
  checked: !1,
  id: "",
  label: "",
  ownerId: "",
  ownerName: "",
  status: "reserved",
  type: "voucher"
}, sn = {
  activities: [],
  companions: [],
  date: "",
  googleMapUrl: "",
  id: "",
  time: "",
  title: ""
}, rn = [], an = [], K = (e) => {
  const t = m(e);
  if (t)
    return t.startsWith("data:") || t.startsWith("blob:") || t.startsWith("//") || tn.test(t) ? t : `${ae}${t}`;
};
function ft({
  currentAccountId: e,
  linkedCompanions: t,
  travelEvents: s
}) {
  const r = new Map(t.map((o) => [o.id, o])), i = /* @__PURE__ */ new Set([
    ...e ? [e] : [],
    ...t.map((o) => o.id)
  ]), a = /* @__PURE__ */ new Map();
  for (const o of s) {
    if (i.size > 0 && !i.has(o.ownerId))
      continue;
    const l = a.get(o.dayId), g = {
      checked: o.status === "used",
      id: o.id,
      label: o.activityLabel,
      ownerId: o.ownerId,
      ownerName: o.ownerName,
      status: o.status,
      type: o.type
    };
    if (l) {
      if (l.activities.push(g), o.ownerId !== e && r.has(o.ownerId)) {
        const b = r.get(o.ownerId);
        b && !l.companions.some((w) => w.id === b.id) && l.companions.push({ ...b });
      }
      continue;
    }
    a.set(o.dayId, {
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
  return Array.from(a.values()).sort((o, l) => o.sortKey.localeCompare(l.sortKey)).map(({ sortKey: o, ...l }) => l);
}
const Z = vt(Ce), Me = ye(ut), on = bt(pt), Te = _e(rn), Re = De(an), gt = ft({
  currentAccountId: Ce.id ?? "",
  linkedCompanions: Te,
  travelEvents: Re
}), xt = [
  { count: 0, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" }
], yt = () => ({
  bookings: bt(pt),
  itinerary: jt(gt),
  linkedCompanions: _e(Te),
  profile: vt(Ce),
  stats: ye(ut),
  supportItems: Nt(xt),
  travelEvents: De(Re)
}), ue = (e) => {
  const t = yt(), s = fn(e);
  if (!Cn(s))
    return t;
  const i = gn(s, t.profile), a = wn(s.linkedCompanions, t.linkedCompanions), o = In(s.travelEvents, t.travelEvents), l = s.travelEvents !== void 0 ? ft({
    currentAccountId: i.id ?? t.profile.id ?? "",
    linkedCompanions: a,
    travelEvents: o
  }) : Nn(s.itinerary, t.itinerary);
  return {
    bookings: jn(s.bookings, t.bookings),
    itinerary: l,
    linkedCompanions: a,
    profile: i,
    stats: vn(s.stats ?? s, t.stats),
    supportItems: Sn(s.supportItems ?? s.support ?? s.inquiries, t.supportItems),
    travelEvents: o
  };
}, pe = (e) => {
  ln(Z, e.profile), cn(Me, e.stats), dn(on, e.bookings), mn(gt, e.itinerary), un(Te, e.linkedCompanions), pn(xt, e.supportItems), hn(Re, e.travelEvents);
};
function vt(e) {
  return {
    avatarUrl: e.avatarUrl,
    ...e,
    memberships: [...e.memberships],
    passport: e.passport ? { ...e.passport } : void 0
  };
}
function ye(e) {
  return e.map((t) => ({ ...t }));
}
function bt(e) {
  return e.map((t) => ({
    ...t,
    tags: [...t.tags]
  }));
}
function _e(e) {
  return e.map((t) => ({ ...t }));
}
function jt(e) {
  return e.map((t) => ({
    ...t,
    activities: t.activities.map((s) => ({ ...s })),
    companions: t.companions.map((s) => ({ ...s }))
  }));
}
function Nt(e) {
  return e.map((t) => ({ ...t }));
}
function De(e) {
  return e.map((t) => ({ ...t }));
}
const ln = (e, t) => {
  if (e.avatarUrl = t.avatarUrl, e.bio = t.bio, e.email = t.email, e.memberships.splice(0, e.memberships.length, ...t.memberships), e.name = t.name, e.nickname = t.nickname, e.phone = t.phone, e.tier = t.tier, e.role = t.role, e.id = t.id, t.passport) {
    e.passport = { ...t.passport };
    return;
  }
  delete e.passport;
}, cn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, dn = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((s) => ({
      ...s,
      tags: [...s.tags]
    }))
  );
}, mn = (e, t) => {
  e.splice(
    0,
    e.length,
    ...t.map((s) => ({
      ...s,
      activities: s.activities.map((r) => ({ ...r })),
      companions: s.companions.map((r) => ({ ...r }))
    }))
  );
}, un = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, pn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, hn = (e, t) => {
  e.splice(0, e.length, ...t.map((s) => ({ ...s })));
}, fn = (e) => {
  const t = {}, s = (r) => {
    B(r) && Object.assign(t, r);
  };
  return s(e), B(e) && (s(e.user), s(e.member), s(e.profile), s(e.data), s(e.session)), t;
}, gn = (e, t) => {
  const s = xn(e.memberships, e.tier ?? e.role), r = yn(e.passport), i = m(e.tier) ?? s[0] ?? m(e.role), a = m(e.id) ?? m(e.memberId) ?? m(e.userId), o = m(e.name) ?? m(e.displayName) ?? m(e.fullName) ?? m(e.nickname) ?? m(e.id) ?? m(e.memberId) ?? m(e.userId) ?? t.name, l = m(e.nickname), g = On(
    H(e, "bio") ?? H(e, "intro") ?? H(e.profile, "bio") ?? H(e.profile, "intro") ?? H(e.user, "bio") ?? H(e.user, "intro") ?? H(e.member, "bio") ?? H(e.member, "intro") ?? H(e.data, "bio") ?? H(e.data, "intro") ?? t.bio
  );
  return {
    avatarUrl: K(e.avatarUrl),
    bio: g,
    email: m(e.email) ?? En(e, a, o) ?? t.email,
    id: a ?? t.id,
    memberships: s,
    name: o,
    nickname: l,
    passport: r,
    phone: m(e.phone) ?? m(e.mobile) ?? "미등록",
    role: m(e.role),
    tier: i
  };
}, xn = (e, t) => {
  const s = Array.isArray(e) ? e.map((i) => m(i)).filter((i) => !!i) : [];
  if (s.length > 0)
    return s;
  const r = m(t);
  return r ? [r] : [];
}, yn = (e) => {
  const t = B(e) ? e : null;
  if (!t)
    return;
  const s = {
    expiryDate: m(t == null ? void 0 : t.expiryDate) ?? "",
    issuingCountry: m(t == null ? void 0 : t.issuingCountry) ?? "",
    number: m(t == null ? void 0 : t.number) ?? ""
  };
  if (!(!s.expiryDate && !s.issuingCountry && !s.number))
    return s;
}, vn = (e, t) => Array.isArray(e) && e.length > 0 ? t.map((s, r) => bn(e[r], s, !0)) : Array.isArray(e) && e.length === 0 ? ye(t) : B(e) ? An(e, t) : ye(t), bn = (e, t, s = !1) => {
  const r = B(e) ? e : {}, i = Bn(r.tone) ? r.tone : t.tone, a = m(r.label) ?? t.label, o = r.value ?? t.value;
  return {
    label: a,
    tone: i,
    value: Ie(o, t)
  };
}, Ie = (e, t) => {
  const s = m(e);
  if (!s)
    return t.value;
  if (!/^\d+(?:\.\d+)?$/.test(s))
    return s;
  const r = Number(s);
  if (!Number.isFinite(r))
    return s;
  const i = r.toLocaleString("ko-KR");
  switch (t.tone) {
    case "coupon":
      return `${i}장`;
    case "point":
      return `${i}P`;
    case "air":
      return `${i}건`;
    default:
      return s;
  }
}, jn = (e, t) => Array.isArray(e) ? e.length === 0 ? [] : e.map((s, r) => Mn(s, t[r % t.length] ?? t[0], !0)) : [], Nn = (e, t) => !Array.isArray(e) || e.length === 0 ? jt(t) : e.map(
  (s, r) => Tn(
    s,
    t.length > 0 ? t[r % t.length] ?? t[0] : sn
  )
), Sn = (e, t) => !Array.isArray(e) || e.length === 0 ? Nt(t) : e.map((s, r) => Dn(s, t[r % t.length] ?? t[0])), wn = (e, t) => !Array.isArray(e) || e.length === 0 ? _e(t) : e.map(
  (s, r) => zn(
    s,
    t.length > 0 ? t[r % t.length] ?? t[0] : ht
  )
), St = (e) => !Array.isArray(e) || e.length === 0 ? [] : e.map((t) => Ln(t)).filter((t) => t !== null), In = (e, t) => {
  const s = St(e);
  return s.length > 0 ? s : De(t);
}, An = (e, t) => t.map((s) => {
  const r = $n(e, Pn(s.tone));
  return r === void 0 ? { ...s } : {
    ...s,
    value: Ie(r, s)
  };
}), En = (e, t, s) => {
  const r = t ?? m(e.memberId) ?? m(e.userId) ?? m(e.username) ?? m(e.loginId) ?? kn(s);
  if (r)
    return `${r}@jejugroup.example`;
}, kn = (e) => {
  const s = e.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "");
  return s.length > 0 ? s : void 0;
}, Cn = (e) => [
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
].some((s) => s in e), Mn = (e, t, s = !1) => {
  const r = B(e) ? e : {}, i = Array.isArray(r.tags) ? r.tags.map((o) => m(o)).filter((o) => !!o) : [], a = Ue(r.type) ? r.type : t.type;
  return {
    amount: m(r.amount) ?? (s ? "" : t.amount),
    date: m(r.date) ?? (s ? "" : t.date),
    duration: m(r.duration) ?? (s ? void 0 : t.duration),
    id: m(r.id) ?? (s ? "" : t.id),
    paymentMethod: m(r.paymentMethod) ?? (s ? void 0 : t.paymentMethod),
    status: m(r.status) ?? (s ? "" : t.status),
    tags: i.length > 0 ? i : s ? [] : [...t.tags],
    title: m(r.title) ?? (s ? "" : t.title),
    type: a,
    voucherUrl: m(r.voucherUrl) ?? (s ? void 0 : t.voucherUrl)
  };
}, Tn = (e, t) => {
  const s = B(e) ? e : {}, r = Array.isArray(s.activities) ? s.activities.map(
    (a, o) => Rn(
      a,
      t.activities.length > 0 ? t.activities[o % t.activities.length] ?? t.activities[0] : nn
    )
  ) : t.activities.map((a) => ({ ...a })), i = Array.isArray(s.companions) ? s.companions.map(
    (a, o) => _n(
      a,
      t.companions.length > 0 ? t.companions[o % t.companions.length] ?? t.companions[0] : ht
    )
  ) : t.companions.map((a) => ({ ...a }));
  return {
    activities: r,
    companions: i,
    date: m(s.date) ?? t.date,
    googleMapUrl: m(s.googleMapUrl) ?? t.googleMapUrl,
    id: m(s.id) ?? t.id,
    time: m(s.time) ?? t.time,
    title: m(s.title) ?? t.title
  };
}, Rn = (e, t) => {
  const s = B(e) ? e : {};
  return {
    checked: typeof s.checked == "boolean" ? s.checked : Ae(s.status) ? s.status === "used" : t.checked,
    id: m(s.id) ?? t.id,
    label: m(s.label) ?? t.label,
    ownerId: m(s.ownerId) ?? t.ownerId,
    ownerName: m(s.ownerName) ?? t.ownerName,
    status: Ae(s.status) ? s.status : t.status,
    type: Ue(s.type) ? s.type : t.type
  };
}, _n = (e, t) => {
  const s = B(e) ? e : {};
  return {
    avatarUrl: K(s.avatarUrl) ?? t.avatarUrl,
    bio: m(s.bio) ?? t.bio,
    id: m(s.id) ?? t.id,
    isMember: typeof s.isMember == "boolean" ? s.isMember : t.isMember,
    name: m(s.name) ?? t.name
  };
}, Dn = (e, t) => {
  const s = B(e) ? e : {};
  return {
    count: Un(s.count, t.count),
    href: m(s.href) ?? t.href,
    id: m(s.id) ?? t.id,
    label: m(s.label) ?? t.label
  };
}, Un = (e, t) => {
  if (e === null)
    return null;
  if (typeof e == "number" && Number.isFinite(e))
    return e;
  const s = m(e);
  if (!s)
    return t;
  const r = Number(s);
  return Number.isFinite(r) ? r : t;
}, zn = (e, t) => {
  const s = B(e) ? e : {};
  return {
    avatarUrl: K(s.avatarUrl) ?? t.avatarUrl,
    bio: m(s.bio) ?? t.bio,
    id: m(s.id) ?? t.id,
    isMember: typeof s.isMember == "boolean" ? s.isMember : t.isMember,
    name: m(s.name) ?? t.name
  };
}, Ln = (e) => {
  const t = B(e) ? e : null;
  if (!t)
    return null;
  const s = m(t.id), r = m(t.dayId), i = m(t.title), a = m(t.date), o = m(t.time), l = m(t.activityLabel), g = m(t.ownerId), b = m(t.ownerName), w = m(t.googleMapUrl);
  return !s || !r || !i || !a || !o || !l || !g || !b || !w ? null : {
    activityLabel: l,
    date: a,
    dayId: r,
    googleMapUrl: w,
    id: s,
    ownerId: g,
    ownerName: b,
    status: Ae(t.status) ? t.status : "reserved",
    time: o,
    title: i,
    type: Ue(t.type) ? t.type : "voucher"
  };
}, Pn = (e) => {
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
}, $n = (e, t) => {
  for (const s of t)
    if (s in e) {
      const r = e[s];
      if (r != null)
        return Array.isArray(r) ? r.length : r;
    }
}, B = (e) => e !== null && typeof e == "object" && !Array.isArray(e), m = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, H = (e, t) => {
  if (B(e))
    return m(e[t]);
}, On = (e) => Array.from((e ?? "").trim()).slice(0, 20).join(""), Ue = (e) => e === "air" || e === "rent" || e === "stay" || e === "voucher", Ae = (e) => e === "reserved" || e === "used" || e === "cancelled" || e === "missed", Bn = (e) => e === "air" || e === "coupon" || e === "point" || e === "rent" || e === "stay" || e === "voucher" || e === "wallet", Ee = "jeju:mypage-dashboard-mock-updated", wt = "jeju:mypage-dashboard:", Fn = ["id", "memberId", "userId", "email", "loginId", "username"], It = ["user", "member", "profile", "data", "session"], q = (e) => e !== null && typeof e == "object" && !Array.isArray(e), Wn = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, Hn = (e) => e.trim().toLowerCase().replace(/[^a-z0-9._-]+/g, ".").replace(/^\.+|\.+$/g, ""), Kn = (e) => {
  const t = [];
  if (!q(e))
    return t;
  t.push(e);
  for (const s of It) {
    const r = e[s];
    q(r) && t.push(r);
  }
  return t;
}, At = (e) => {
  const t = Kn(e);
  for (const s of t)
    for (const r of Fn) {
      const i = Wn(s[r]);
      if (!i)
        continue;
      const a = Hn(i);
      if (a)
        return a;
    }
  return null;
}, Et = (e) => `${wt}${e}`, Yn = (e) => {
  if (!e)
    return null;
  try {
    const t = JSON.parse(e);
    return q(t) ? t : null;
  } catch {
    return null;
  }
}, Vn = (e) => {
  typeof window > "u" || window.dispatchEvent(
    new CustomEvent(Ee, {
      detail: { accountKey: e }
    })
  );
}, kt = (e) => {
  const t = At(e);
  return t ? Ct(t) : null;
}, Ct = (e) => {
  try {
    return Yn(localStorage.getItem(Et(e)));
  } catch {
    return null;
  }
}, de = (e, t) => {
  const s = q(e) ? e : {}, r = q(t) ? t : {};
  if (Object.keys(s).length === 0 && Object.keys(r).length === 0)
    return null;
  const i = {
    ...s,
    ...r
  };
  for (const a of It) {
    const o = s[a], l = r[a];
    (q(o) || q(l)) && (i[a] = {
      ...q(o) ? o : {},
      ...q(l) ? l : {}
    });
  }
  return i;
}, qn = (e, t) => {
  const s = At(e);
  if (!s)
    return !1;
  try {
    return localStorage.setItem(Et(s), JSON.stringify(t)), Vn(s), !0;
  } catch {
    return !1;
  }
}, Gn = (e, t) => {
  const s = de(kt(e), t);
  return s ? qn(e, s) : !1;
}, Xn = "userSession", Ze = "jeju:session-updated", Zn = "/api/auth/session", Qn = "/api/mypage/dashboard", Jn = () => {
  const e = yt();
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
}, es = (e, t) => {
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
}, Mt = c.createContext(null), Tt = (e) => `${ae}${e}`, ts = (e) => e !== null && typeof e == "object" && !Array.isArray(e), ns = async () => {
  try {
    const e = await fetch(Tt(Zn), {
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
}, ss = async () => {
  try {
    const e = await fetch(Tt(Qn), {
      credentials: "include",
      headers: {
        Accept: "application/json"
      },
      method: "GET"
    });
    if (e.status === 401 || !e.ok)
      return null;
    const t = await e.json();
    return !ts(t) || t.success !== !0 || !("dashboard" in t) ? null : t.dashboard ?? null;
  } catch {
    return null;
  }
}, rs = async () => await ns(), as = async (e) => {
  if (!e)
    return null;
  const t = await ss();
  return t ? de(e, t) : e;
}, Qe = async () => {
  const e = await rs();
  if (!e)
    return null;
  const t = await as(e);
  return cs(t);
}, is = (e) => ({
  bookings: e.bookings,
  itinerary: e.itinerary,
  linkedCompanions: e.linkedCompanions,
  profile: e.profile,
  stats: e.stats,
  supportItems: e.supportItems,
  travelEvents: e.travelEvents
}), os = (e, t) => ({
  ...e,
  ...t,
  memberships: t.memberships ? [...t.memberships] : [...e.memberships],
  passport: t.passport === void 0 ? e.passport ? { ...e.passport } : void 0 : t.passport ? { ...t.passport } : void 0
}), ls = (e, t) => {
  if (t.length === 0)
    return [];
  const s = new Map(e.map((r) => [r.id, r]));
  return t.map((r) => {
    const i = s.get(r.id);
    return i ? {
      ...i,
      ...r,
      avatarUrl: r.avatarUrl ?? i.avatarUrl,
      bio: r.bio ?? i.bio,
      relationState: r.relationState ?? i.relationState
    } : { ...r };
  });
}, cs = (e) => {
  const t = ue(e), s = de(e, kt(e)), r = ue(s), i = ls(r.linkedCompanions, t.linkedCompanions);
  if (i.length === 0)
    return ue(
      de(s, {
        linkedCompanions: []
      })
    );
  const a = [
    ...r.travelEvents,
    ...i.flatMap((o) => {
      const l = Ct(o.id);
      return !l || !("travelEvents" in l) ? [] : St(l.travelEvents).map((g) => ({
        ...g,
        ownerId: g.ownerId || o.id,
        ownerName: g.ownerName || o.name
      }));
    })
  ];
  return ue(
    de(s, {
      linkedCompanions: i,
      travelEvents: a
    })
  );
}, ds = ({ children: e }) => {
  const [t, s] = c.useReducer(es, void 0, Jn), [r, i] = c.useState(!1), [a, o] = c.useState(!1), l = (v) => {
    pe(v), s({ type: "HYDRATE_DASHBOARD", payload: v });
  }, g = (v) => {
    v.type === "HYDRATE_DASHBOARD" ? pe(v.payload) : v.type === "PATCH_PROFILE" && pe({
      bookings: t.bookings,
      itinerary: t.itinerary,
      linkedCompanions: t.linkedCompanions,
      profile: os(t.profile, v.payload),
      stats: t.stats,
      supportItems: t.supportItems,
      travelEvents: t.travelEvents
    }), s(v);
  }, b = async () => {
    const v = await Qe();
    return v ? (l(v), !0) : !1;
  };
  c.useEffect(() => {
    pe(is(t));
  }, [t.bookings, t.itinerary, t.linkedCompanions, t.profile, t.stats, t.supportItems, t.travelEvents]), c.useEffect(() => {
    let v = !0, C = !1;
    const E = async () => {
      const u = await Qe();
      if (!u) {
        if (!v)
          return;
        o(!1), i(!0);
        return;
      }
      v && (o(!0), i(!0), l(u));
    }, h = () => {
      C || (C = !0, E().finally(() => {
        C = !1;
      }));
    };
    h();
    const x = (u) => {
      var A;
      if (u.key === Xn) {
        h();
        return;
      }
      (A = u.key) != null && A.startsWith(wt) && h();
    }, N = () => {
      h();
    }, j = () => {
      h();
    };
    return window.addEventListener("storage", x), window.addEventListener(Ze, N), window.addEventListener(Ee, j), () => {
      v = !1, window.removeEventListener("storage", x), window.removeEventListener(Ze, N), window.removeEventListener(Ee, j);
    };
  }, [s]);
  const w = c.useMemo(
    () => ({
      dispatch: g,
      refreshDashboard: b,
      state: t
    }),
    [g, b, t]
  );
  return !r || !a ? /* @__PURE__ */ n.jsxs("div", { className: "mypage-auth-empty-state soft-radius", role: "status", "aria-live": "polite", children: [
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
  ] }) : /* @__PURE__ */ n.jsx(Mt.Provider, { value: w, children: e });
}, ie = () => {
  const e = c.useContext(Mt);
  if (!e)
    throw new Error("useDashboardState must be used within DashboardProvider");
  return e;
}, Je = "/api/mypage/companion-invites", ms = [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
  "expired"
], us = ["sent", "received"], te = (e) => e !== null && typeof e == "object" && !Array.isArray(e), ce = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, J = (e) => ce(e) ?? void 0, et = (e) => {
  var r;
  const t = e.startsWith("/") ? e : `/${e}`, s = (r = ae) == null ? void 0 : r.trim();
  return s ? new URL(t, s).toString() : t;
}, ps = (e) => {
  if (typeof e != "string")
    return "pending";
  const t = e.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return ms.includes(t) ? t : "pending";
}, hs = (e) => {
  if (typeof e != "string")
    return "received";
  const t = e.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return us.includes(t) ? t : "received";
}, fs = (e, t) => {
  if (te(e)) {
    const s = e.message ?? e.error;
    if (typeof s == "string" && s.trim())
      return s;
  }
  return t;
}, gs = (e) => {
  if (Array.isArray(e))
    return e;
  if (!te(e))
    return [];
  const t = ["invites", "items", "results", "data"];
  for (const s of t) {
    const r = e[s];
    if (Array.isArray(r))
      return r;
    if (te(r) && Array.isArray(r.items))
      return r.items;
    if (te(r) && Array.isArray(r.results))
      return r.results;
  }
  return Array.isArray(e.data) ? e.data : [];
}, xs = (e) => {
  if (!te(e))
    return null;
  const t = typeof e.id == "number" && Number.isFinite(e.id) ? e.id : Number(e.id), s = ce(e.senderUserId ?? e.sender_user_id ?? e.senderId ?? e.sender_id), r = ce(e.receiverUserId ?? e.receiver_user_id ?? e.receiverId ?? e.receiver_id), i = ce(e.senderName ?? e.sender_name ?? e.senderDisplayName ?? e.senderDisplayName), a = ce(e.receiverName ?? e.receiver_name ?? e.receiverDisplayName ?? e.receiverDisplayName);
  return !Number.isFinite(t) || !s || !r || !i || !a ? null : {
    createdAt: J(e.createdAt ?? e.created_at),
    direction: hs(e.direction ?? e.inviteDirection ?? e.invite_direction),
    expiresAt: J(e.expiresAt ?? e.expires_at),
    id: t,
    receiverAvatarUrl: J(e.receiverAvatarUrl ?? e.receiver_avatar_url),
    receiverBio: J(e.receiverBio ?? e.receiver_bio),
    receiverName: a,
    receiverUserId: r,
    respondedAt: J(e.respondedAt ?? e.responded_at),
    senderAvatarUrl: J(e.senderAvatarUrl ?? e.sender_avatar_url),
    senderBio: J(e.senderBio ?? e.sender_bio),
    senderName: i,
    senderUserId: s,
    status: ps(e.status ?? e.inviteStatus ?? e.invite_status)
  };
}, tt = (e, t) => fs(e, t), ys = (e = {}) => {
  const { enabled: t = !0 } = e, [s, r] = c.useState([]), [i, a] = c.useState(!1), [o, l] = c.useState(null), g = c.useRef(0), b = c.useMemo(
    () => s.filter((h) => h.direction === "received" && h.status === "pending"),
    [s]
  ), w = c.useCallback(async () => {
    const h = ++g.current;
    a(!0), l(null);
    try {
      const x = await fetch(et(Je), {
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "GET"
      }), N = await x.json().catch(() => null);
      if (x.status === 401)
        throw new Error("로그인이 필요합니다.");
      if (!x.ok || te(N) && N.success === !1)
        throw new Error(tt(N, "동행 초대를 불러오지 못했다"));
      const j = gs(N).map(xs).filter((u) => u !== null);
      return h !== g.current || r(j), j;
    } catch (x) {
      return h !== g.current ? [] : (r([]), l({
        message: x instanceof Error && x.message.trim() ? x.message : "동행 초대를 불러오지 못했다"
      }), []);
    } finally {
      h === g.current && a(!1);
    }
  }, []);
  c.useEffect(() => {
    if (t)
      return w(), () => {
        g.current += 1;
      };
  }, [t, w]);
  const v = c.useCallback(
    async (h, x) => {
      const N = x === "accept" ? "accept" : "reject";
      l(null);
      try {
        const j = await fetch(et(`${Je}/${h}/${N}`), {
          credentials: "include",
          headers: {
            Accept: "application/json"
          },
          method: "POST"
        }), u = await j.json().catch(() => null);
        if (j.status === 401)
          throw new Error("로그인이 필요합니다.");
        if (!j.ok || te(u) && u.success === !1)
          throw new Error(tt(u, "동행 초대를 처리하지 못했다"));
        return await w(), !0;
      } catch (j) {
        return l({
          message: j instanceof Error && j.message.trim() ? j.message : "동행 초대를 처리하지 못했다"
        }), !1;
      }
    },
    [w]
  ), C = c.useCallback(
    async (h) => v(h, "accept"),
    [v]
  ), E = c.useCallback(
    async (h) => v(h, "reject"),
    [v]
  );
  return {
    acceptInvite: C,
    errorObj: o,
    isLoading: i,
    pendingInviteCount: b.length,
    pendingReceivedInvites: b,
    refreshInvites: w,
    rejectInvite: E
  };
}, vs = (e, t) => {
  if (!e)
    return "00:00:00";
  const s = Date.parse(e);
  if (!Number.isFinite(s))
    return "00:00:00";
  const r = Math.max(0, s - t), i = Math.floor(r / 1e3), a = Math.floor(i / 3600), o = Math.floor(i % 3600 / 60), l = i % 60;
  return [a, o, l].map((g) => String(g).padStart(2, "0")).join(":");
}, bs = ({ invite: e }) => {
  const [t, s] = c.useState(!1), r = K(e.senderAvatarUrl), i = !!(r && !t);
  return c.useEffect(() => {
    s(!1);
  }, [r]), /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-avatar companion-avatar soft-radius is-linked", "aria-hidden": "true", children: [
    i ? /* @__PURE__ */ n.jsx(
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
}, js = ({
  isOpen: e,
  onClose: t,
  onRefreshPendingCount: s
}) => {
  const { refreshDashboard: r } = ie(), {
    acceptInvite: i,
    errorObj: a,
    isLoading: o,
    pendingInviteCount: l,
    pendingReceivedInvites: g,
    rejectInvite: b
  } = ys({ enabled: e }), [w, v] = c.useState(null), [C, E] = c.useState(() => Date.now());
  c.useEffect(() => {
    e && window.lucide && window.lucide.createIcons();
  }, [e, g, o, a, l]), c.useEffect(() => {
    const u = (A) => {
      A.key === "Escape" && e && t();
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, [e, t]), c.useEffect(() => {
    if (!e || g.length === 0)
      return;
    E(Date.now());
    const u = window.setInterval(() => {
      E(Date.now());
    }, 1e3);
    return () => {
      window.clearInterval(u);
    };
  }, [e, g.length]);
  const h = c.useMemo(
    () => [...g].sort((u, A) => {
      const k = u.createdAt ?? u.expiresAt ?? "";
      return (A.createdAt ?? A.expiresAt ?? "").localeCompare(k);
    }),
    [g]
  );
  if (!e)
    return null;
  const x = async (u, A) => {
    if (w === null) {
      v(u);
      try {
        (A === "accept" ? await i(u) : await b(u)) && (await r(), await (s == null ? void 0 : s()));
      } finally {
        v(null);
      }
    }
  }, N = () => {
    t();
  }, j = (u) => {
    u.stopPropagation();
  };
  return /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay companion-invite-modal active", onClick: N, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ n.jsxs(
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
          /* @__PURE__ */ n.jsx("div", { className: "companion-invite-panel", children: a ? /* @__PURE__ */ n.jsxs("div", { className: "error-message companion-invite-error", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
            a.message
          ] }) : o ? /* @__PURE__ */ n.jsx("p", { className: "empty-list companion-invite-empty", children: "초대 목록을 불러오는 중이다." }) : h.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list companion-invite-empty", children: "받은 동행자 초대가 없다." }) : /* @__PURE__ */ n.jsx("div", { className: "companion-invite-list companion-list-scroll", children: h.map((u) => {
            var A;
            return /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-row list-item soft-radius", children: [
              /* @__PURE__ */ n.jsxs("div", { className: "item-info companion-invite-row-info", children: [
                /* @__PURE__ */ n.jsx(bs, { invite: u }),
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
                        /* @__PURE__ */ n.jsx("strong", { children: u.senderName }),
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
                            children: vs(u.expiresAt, C)
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ n.jsx("span", { children: ((A = u.senderBio) == null ? void 0 : A.trim()) || `@${u.senderUserId}` })
                ] })
              ] }),
              /* @__PURE__ */ n.jsxs("div", { className: "companion-invite-actions", children: [
                /* @__PURE__ */ n.jsx(
                  "button",
                  {
                    className: "companion-invite-action companion-invite-reject",
                    type: "button",
                    onClick: () => void x(u.id, "reject"),
                    disabled: w !== null,
                    children: "거절"
                  }
                ),
                /* @__PURE__ */ n.jsx(
                  "button",
                  {
                    className: "companion-invite-action companion-invite-accept",
                    type: "button",
                    onClick: () => void x(u.id, "accept"),
                    disabled: w !== null,
                    children: "수락"
                  }
                )
              ] })
            ] }, u.id);
          }) }) })
        ] }),
        /* @__PURE__ */ n.jsx("footer", { className: "modal-footer companion-invite-modal-footer", children: /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: t, children: "닫기" }) })
      ]
    }
  ) });
}, re = ({ children: e, className: t = "" }) => {
  const s = ["bento-box", "soft-radius", t].filter(Boolean).join(" ");
  return /* @__PURE__ */ n.jsx("div", { className: s, children: e });
}, je = "/api/mypage/companion-invites", Rt = (e) => {
  const t = (e == null ? void 0 : e.trim().toLowerCase()) ?? "";
  return t.includes("diamond") || t.includes("다이아") ? "diamond" : t.includes("platinum") || t.includes("플래티넘") ? "platinum" : t.includes("silver") || t.includes("실버") ? "silver" : t.includes("gold") || t.includes("골드") ? "gold" : null;
}, Ns = (e) => Rt(e) ?? "neutral", Ss = (e) => {
  switch (Rt(e)) {
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
}, nt = (e) => {
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
}, Ne = (e) => {
  const t = document.querySelector(e);
  if (!t)
    return;
  const s = t.querySelector(".section-title") ?? t, r = document.querySelector("#jeju-page-shell-header .header") ?? document.querySelector(".header"), i = (r == null ? void 0 : r.getBoundingClientRect().height) ?? 72, a = window.scrollY + s.getBoundingClientRect().top - i - 24;
  window.scrollTo({
    top: Math.max(0, a),
    behavior: "smooth"
  });
}, st = (e) => e !== null && typeof e == "object" && !Array.isArray(e), ke = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : void 0;
  }
  if (typeof e == "number" && Number.isFinite(e))
    return String(e);
}, ws = () => {
  var r;
  const e = (r = ae) == null ? void 0 : r.trim(), t = je.startsWith("/") ? je : `/${je}`, s = e ? new URL(t, e) : new URL(t, window.location.origin);
  return e ? s.toString() : `${s.pathname}${s.search}`;
}, Is = (e) => {
  if (!st(e))
    return [];
  const t = [e.invites, e.items, e.results, e.data];
  for (const s of t)
    if (Array.isArray(s))
      return s.filter(st).map((r) => ({
        direction: ke(r.direction),
        status: ke(r.status ?? r.effectiveStatus)
      }));
  return [];
}, rt = (e) => {
  var s;
  const t = (s = ke(e)) == null ? void 0 : s.toLowerCase().replace(/[\s-]+/g, "_");
  if (t)
    return t === "received" ? "received" : t;
}, As = ({
  onOpenCompanionInvites: e,
  pendingInviteCount: t
} = {}) => {
  var z, U, T, M;
  const { state: s } = ie(), r = s.profile ?? Z, i = (z = s.stats) != null && z.length ? s.stats : Me, a = ((U = r.memberships) == null ? void 0 : U[0]) ?? Z.memberships[0], o = r.tier ?? a, l = Ns(o), g = Ss(o), b = ((T = r.nickname) == null ? void 0 : T.trim()) || r.name.trim(), [w, v] = c.useState(0), [C, E] = c.useState(!1), h = t ?? w, x = h > 0, N = K(r.avatarUrl) ?? `https://api.dicebear.com/7.x/notionists/svg?seed=${r.name}&backgroundColor=f8f9fa`;
  c.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, []);
  const j = c.useCallback(async () => {
    if (typeof t == "number") {
      v(0);
      return;
    }
    try {
      const I = await fetch(ws(), {
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "GET"
      });
      if (!I.ok) {
        v(0);
        return;
      }
      const L = await I.json().catch(() => null), y = Is(L).filter((O) => {
        const S = rt(O.status), p = rt(O.direction);
        return S === "pending" && p === "received";
      }).length;
      v(y);
    } catch {
      v(0);
    }
  }, [t]);
  c.useEffect(() => {
    let I = !0;
    return j().finally(() => {
      !I && typeof t != "number" && v(0);
    }), () => {
      I = !1;
    };
  }, [j, t]);
  const u = () => {
    e && e(), E(!0);
  }, A = (I) => {
    (I.key === "Enter" || I.key === " ") && (I.preventDefault(), u());
  }, k = c.useMemo(() => i, [i]);
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-hero dashboard-summary-grid", children: [
    /* @__PURE__ */ n.jsx(re, { className: "hero-glass-container profile-main-card", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-layout-flex", children: [
      /* @__PURE__ */ n.jsx("div", { className: "profile-left-area", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-avatar-wrap", children: [
        /* @__PURE__ */ n.jsx(
          "img",
          {
            alt: "profile",
            className: "profile-avatar",
            src: N
          }
        ),
        /* @__PURE__ */ n.jsx("div", { className: `membership-grade-chip soft-radius ${l}`, children: /* @__PURE__ */ n.jsx("span", { children: g }) })
      ] }) }),
      /* @__PURE__ */ n.jsx("div", { className: "profile-right-area", children: /* @__PURE__ */ n.jsxs("div", { className: "profile-info", children: [
        /* @__PURE__ */ n.jsxs("h1", { className: "profile-name", children: [
          /* @__PURE__ */ n.jsx("strong", { className: "highlight", children: b }),
          " 님 어서오세요!"
        ] }),
        /* @__PURE__ */ n.jsx("p", { className: "profile-welcome-msg", children: ((M = r.bio) == null ? void 0 : M.trim()) ?? "" }),
        /* @__PURE__ */ n.jsxs("div", { className: "profile-quick-nav", children: [
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => Ne(".layer-full-management"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "calendar-check", className: "lucide-calendar-check" }),
            " 예약 현황"
          ] }),
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => Ne(".layer-itinerary"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "map", className: "lucide-map" }),
            " 여행 일정"
          ] }),
          /* @__PURE__ */ n.jsxs("button", { className: "nav-btn pill-shape", type: "button", onClick: () => Ne(".layer-account-benefits"), children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "user-cog", className: "lucide-user-cog" }),
            " 정보 및 혜택"
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ n.jsx("div", { className: "summary-stats-column", children: k.map((I) => I.tone === "air" ? /* @__PURE__ */ n.jsxs(
      "div",
      {
        "aria-label": `동행자 초대 알림${x ? `, 대기 ${h}건` : ""}`,
        className: "bento-box soft-radius stat-card meta-glass-theme tone-air",
        onClick: u,
        onKeyDown: A,
        role: "button",
        tabIndex: 0,
        style: { cursor: "pointer" },
        children: [
          /* @__PURE__ */ n.jsxs("div", { className: "stat-icon-box", style: { position: "relative" }, children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "bell", className: "lucide-bell" }),
            x ? /* @__PURE__ */ n.jsx(
              "span",
              {
                "aria-label": `대기 중인 초대 ${h}건`,
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
                children: h > 99 ? "99+" : h
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
                    h,
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
            /* @__PURE__ */ n.jsx("strong", { className: "stat-value", children: x ? `새 초대 ${h}건` : "새 초대 없음" })
          ] })
        ]
      },
      I.label
    ) : /* @__PURE__ */ n.jsxs(re, { className: `stat-card meta-glass-theme tone-${I.tone}`, children: [
      /* @__PURE__ */ n.jsx("div", { className: "stat-icon-box", children: /* @__PURE__ */ n.jsx("i", { "data-lucide": nt(I.tone), className: `lucide-${nt(I.tone)}` }) }),
      /* @__PURE__ */ n.jsxs("div", { className: "stat-content", children: [
        /* @__PURE__ */ n.jsx("span", { className: "stat-label", children: I.label }),
        /* @__PURE__ */ n.jsx("strong", { className: "stat-value", children: I.value })
      ] })
    ] }, I.label)) }),
    /* @__PURE__ */ n.jsx(
      js,
      {
        isOpen: C,
        onClose: () => E(!1),
        onRefreshPendingCount: j
      }
    )
  ] });
}, Es = {
  air: "brand-air",
  coupon: "brand-coupon",
  point: "brand-point",
  rent: "brand-rent",
  stay: "brand-stay",
  voucher: "brand-voucher",
  wallet: ""
}, ks = ({ tone: e, value: t }) => {
  const s = Es[e];
  return /* @__PURE__ */ n.jsx("span", { className: `pill-shape ${s}`.trim(), children: t });
}, Cs = ["all", "air", "stay", "rent", "voucher"], Ms = () => {
  const { dispatch: e, state: t } = ie(), s = t.bookings ?? [];
  c.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [s, t.filter]);
  const r = c.useMemo(() => t.filter === "all" ? s : s.filter((a) => a.type === t.filter), [s, t.filter]), i = c.useCallback(
    (a) => {
      e({ type: "SET_FILTER", payload: a });
    },
    [e]
  );
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-full-management", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header flex-header", children: [
      /* @__PURE__ */ n.jsxs("div", { className: "title-group", children: [
        /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "나의 예약 현황" }),
        /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "항공, 숙박, 렌터카 및 바우처를 한눈에 관리하세요." })
      ] }),
      /* @__PURE__ */ n.jsx("div", { className: "booking-filters flex-gap", children: Cs.map((a) => /* @__PURE__ */ n.jsx(
        "button",
        {
          className: `filter-chip pill-shape ${t.filter === a ? "active" : ""}`,
          onClick: () => i(a),
          type: "button",
          children: a === "all" ? "전체" : a === "air" ? "항공" : a === "stay" ? "숙박" : a === "rent" ? "렌터카" : "바우처"
        },
        a
      )) })
    ] }),
    /* @__PURE__ */ n.jsx("ul", { className: "full-width-trip-list", children: r.length > 0 ? r.map((a) => /* @__PURE__ */ n.jsxs("li", { className: "inline-trip-card soft-radius", "data-type": a.type, children: [
      /* @__PURE__ */ n.jsxs("div", { className: "trip-core-info", children: [
        /* @__PURE__ */ n.jsxs("div", { className: "trip-head-flex", children: [
          /* @__PURE__ */ n.jsx(ks, { tone: a.type, value: a.status }),
          /* @__PURE__ */ n.jsx("div", { className: "trip-tags", children: a.tags.map((o) => /* @__PURE__ */ n.jsx("span", { className: "meta-tag pill-shape", children: o }, o)) })
        ] }),
        /* @__PURE__ */ n.jsx("h3", { className: "trip-title", children: a.title }),
        /* @__PURE__ */ n.jsxs("div", { className: "trip-meta-grid", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "calendar", className: "lucide-calendar" }),
            /* @__PURE__ */ n.jsx("span", { children: a.date }),
            a.duration ? /* @__PURE__ */ n.jsxs("strong", { className: "duration-label", children: [
              "(",
              a.duration,
              ")"
            ] }) : null
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "meta-item", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "wallet", className: "lucide-wallet" }),
            /* @__PURE__ */ n.jsx("strong", { children: a.amount }),
            a.paymentMethod ? /* @__PURE__ */ n.jsxs("span", { className: "method-label", children: [
              " / ",
              a.paymentMethod
            ] }) : null
          ] })
        ] })
      ] }),
      /* @__PURE__ */ n.jsxs("div", { className: "trip-inline-actions", children: [
        /* @__PURE__ */ n.jsxs("div", { className: "action-group", children: [
          a.voucherUrl ? /* @__PURE__ */ n.jsxs("button", { className: "inline-btn primary pill-shape", type: "button", children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "download", className: "lucide-download" }),
            "e-티켓 / 바우처"
          ] }) : /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "결제 진행하기" }),
          /* @__PURE__ */ n.jsx("button", { className: "inline-btn outline pill-shape", type: "button", children: "예약 변경" })
        ] }),
        /* @__PURE__ */ n.jsx("button", { className: "inline-btn danger pill-shape", type: "button", children: "예약 취소" })
      ] })
    ] }, a.id)) : /* @__PURE__ */ n.jsxs("div", { className: "empty-state-placeholder soft-radius", children: [
      /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", className: "lucide-alert-circle" }),
      /* @__PURE__ */ n.jsx("p", { children: "선택하신 카테고리에 해당하는 예약 내역이 없습니다." })
    ] }) })
  ] });
}, Se = "/api/mypage/members/search", Ts = "/api/mypage/companion-links", Rs = 180, at = 5, _s = {
  available: "none",
  invited: "outgoing_pending",
  incoming_pending: "incoming_pending",
  linked: "linked",
  needs_response: "incoming_pending",
  none: "none",
  outgoing_pending: "outgoing_pending"
}, it = (e) => e.trim().toLowerCase(), ot = (e) => /^[a-z0-9._-]{1,30}$/i.test(e), P = (e) => e !== null && typeof e == "object" && !Array.isArray(e), _t = (e, t) => {
  if (P(e)) {
    const s = e.message ?? e.error;
    if (typeof s == "string" && s.trim())
      return s;
  }
  return t;
}, Dt = (e) => {
  if (typeof e != "string")
    return;
  const t = e.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return _s[t];
}, he = (e) => {
  if (typeof e == "string") {
    const t = e.trim();
    return t.length > 0 ? t : null;
  }
  return typeof e == "number" && Number.isFinite(e) ? String(e) : null;
}, Ds = (e, t) => {
  var a;
  const s = Se.startsWith("/") ? Se : `/${Se}`, r = (a = ae) == null ? void 0 : a.trim(), i = r ? new URL(s, r) : new URL(s, window.location.origin);
  return i.searchParams.set("query", e), i.searchParams.set("memberIdPrefix", e), i.searchParams.set("prefix", e), typeof t == "number" && i.searchParams.set("limit", String(t)), r ? i.toString() : `${i.pathname}${i.search}`;
}, Us = (e) => {
  if (Array.isArray(e))
    return e;
  if (!P(e))
    return [];
  const t = ["companions", "members", "users", "results", "items", "data"];
  for (const s of t) {
    const r = e[s];
    if (Array.isArray(r))
      return r;
    if (P(r) && Array.isArray(r.items))
      return r.items;
    if (P(r) && Array.isArray(r.results))
      return r.results;
  }
  if (P(e.data)) {
    const s = ["companions", "members", "users", "results", "items"];
    for (const r of s) {
      const i = e.data[r];
      if (Array.isArray(i))
        return i;
    }
  }
  return [];
}, zs = (e) => {
  if (!P(e))
    return null;
  const t = [e.invite, e.data, e.result, e.item];
  for (const s of t)
    if (P(s))
      return s;
  return e;
}, Ls = (e) => {
  if (!P(e))
    return null;
  const t = he(e.id ?? e.memberId ?? e.userId ?? e.loginId), s = he(e.name ?? e.displayName ?? e.userName ?? e.nickname ?? e.fullName), r = he(e.avatarUrl ?? e.avatar ?? e.profileImageUrl ?? e.imageUrl ?? e.photoUrl), i = he(e.bio ?? e.intro ?? e.description ?? e.summary), a = Dt(
    e.relationState ?? e.relation_state ?? e.relationStatus ?? e.relation_status ?? e.companionRelationState ?? e.companion_relation_state ?? (P(e.relation) ? e.relation.state : void 0)
  ) ?? (e.isLinked === !0 || e.linked === !0 ? "linked" : void 0);
  return !t || !s ? null : {
    avatarUrl: r ?? void 0,
    bio: i ?? void 0,
    id: t,
    isMember: e.isMember !== !1,
    name: s,
    relationState: a
  };
}, Ps = (e) => {
  const t = /* @__PURE__ */ new Set(), s = [];
  for (const r of e)
    t.has(r.id) || (t.add(r.id), s.push(r));
  return s;
}, $s = async (e, t) => {
  const s = await fetch(Ds(e, t == null ? void 0 : t.limit), {
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
    const a = P(r) && typeof r.message == "string" && r.message.trim() || P(r) && typeof r.error == "string" && r.error.trim() || "회원 조회에 실패했다";
    throw new Error(a);
  }
  if (P(r) && r.success === !1) {
    const a = typeof r.message == "string" && r.message.trim() || typeof r.error == "string" && r.error.trim() || "회원 조회에 실패했다";
    throw new Error(a);
  }
  const i = Us(r).map(Ls).filter((a) => a !== null);
  return Ps(i).filter((a) => a.id.toLowerCase().startsWith(e));
}, Os = async (e, t) => {
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
  if (!s.ok || P(r) && r.success === !1)
    throw new Error(
      _t(
        r,
        s.status === 401 ? "로그인이 필요합니다." : "동행 초대에 실패했다"
      )
    );
  return zs(r);
}, Bs = async (e, t) => {
  const s = await fetch(`${Ts}/${encodeURIComponent(e)}`, {
    credentials: "include",
    headers: {
      Accept: "application/json"
    },
    method: "DELETE",
    signal: t
  }), r = await s.json().catch(() => null);
  if (!s.ok || P(r) && r.success === !1)
    throw new Error(
      _t(
        r,
        s.status === 401 ? "로그인이 필요합니다." : "동행 해제에 실패했다"
      )
    );
  return r;
}, Fs = (e) => e instanceof Error && e.message.trim() ? e.message : "회원 조회 중 오류가 발생했다. 잠시 후 다시 시도해라", Ws = (e) => e instanceof Error && e.message.trim() ? e.message : "동행 초대 중 오류가 발생했다. 잠시 후 다시 시도해라", Hs = (e) => e instanceof Error && e.message.trim() ? e.message : "동행 해제 중 오류가 발생했다. 잠시 후 다시 시도해라", Ks = ({
  initialCompanions: e = [],
  searchMembers: t = $s
} = {}) => {
  const [s, r] = c.useState(e), [i, a] = c.useState(""), [o, l] = c.useState([]), [g, b] = c.useState("suggestions"), [w, v] = c.useState(!1), [C, E] = c.useState(!1), [h, x] = c.useState(null), N = c.useRef(0), j = c.useRef(/* @__PURE__ */ new Set()), u = c.useRef({
    controller: null,
    timerId: null
  }), A = c.useRef(null), k = c.useCallback(() => {
    var p;
    const S = u.current;
    S.timerId !== null && window.clearTimeout(S.timerId), (p = S.controller) == null || p.abort(), S.controller = null, S.timerId = null, E(!1);
  }, []), z = c.useCallback(() => {
    var S;
    (S = A.current) == null || S.abort(), A.current = null, v(!1);
  }, []), U = c.useCallback(
    async (S, p) => {
      var V, _, Q, G;
      const R = it(S);
      if (!R)
        return l([]), p != null && p.strict && x({ message: "검색할 제주그룹 회원 ID를 입력해라" }), [];
      if (!ot(R))
        return l([]), p != null && p.strict && x({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), [];
      const Y = ++N.current;
      if (p != null && p.strict) {
        k();
        const F = new AbortController();
        A.current = F, l([]), x(null), b("results"), v(!0), p = {
          ...p,
          signal: p.signal ?? F.signal
        };
      } else
        E(!0);
      try {
        const F = await t(R, {
          limit: p != null && p.strict ? void 0 : at,
          signal: p == null ? void 0 : p.signal
        });
        return Y !== N.current || (V = p == null ? void 0 : p.signal) != null && V.aborted ? [] : (l(F), p != null && p.strict && F.length === 0 ? x({ message: "일치하는 제주그룹 회원 ID를 찾지 못했다" }) : x(null), F);
      } catch (F) {
        return Y !== N.current || (_ = p == null ? void 0 : p.signal) != null && _.aborted ? [] : (l([]), x({ message: Fs(F) }), []);
      } finally {
        Y === N.current && !((Q = p == null ? void 0 : p.signal) != null && Q.aborted) && (p != null && p.strict ? (v(!1), ((G = A.current) == null ? void 0 : G.signal) === p.signal && (A.current = null)) : E(!1));
      }
    },
    [k, t]
  );
  c.useEffect(() => {
    const S = it(i);
    if (!S)
      return l([]), x(null), E(!1), () => {
        N.current += 1;
      };
    if (!ot(S))
      return l([]), x({ message: "회원 ID는 영문, 숫자, 점, 밑줄, 하이픈만 쓸 수 있다" }), E(!1), () => {
        N.current += 1;
      };
    const p = new AbortController(), R = window.setTimeout(() => {
      U(S, { signal: p.signal });
    }, Rs);
    return u.current.controller = p, u.current.timerId = R, () => {
      p.abort(), window.clearTimeout(R), u.current.controller === p && (u.current.controller = null), u.current.timerId === R && (u.current.timerId = null), N.current += 1;
    };
  }, [U, i]);
  const T = c.useCallback((S) => {
    z(), a(S), l([]), b("suggestions"), x(null), k();
  }, [z, k]), M = c.useCallback(() => {
    z(), k(), N.current += 1, a(""), l([]), b("suggestions"), v(!1), E(!1), x(null);
  }, [z, k]), I = c.useCallback(
    async (S) => (k(), await U(S, { strict: !0 })),
    [k, U]
  ), L = c.useCallback(async (S) => {
    x(null);
    try {
      const p = await Os(S), R = P(p) ? Dt(
        p.relationState ?? p.relation_state ?? p.status ?? p.inviteState ?? p.invite_state
      ) ?? "outgoing_pending" : "outgoing_pending";
      l(
        (Y) => Y.map(
          (V) => V.id === S.id ? {
            ...V,
            relationState: R
          } : V
        )
      );
    } catch (p) {
      x({ message: Ws(p) });
    }
  }, []), y = c.useCallback(async (S) => {
    x(null), j.current.add(S), r((p) => p.filter((R) => R.id !== S)), l(
      (p) => p.map(
        (R) => R.id === S ? {
          ...R,
          relationState: "none"
        } : R
      )
    );
  }, []), O = c.useCallback(async () => {
    const S = Array.from(j.current);
    if (S.length !== 0)
      for (const p of S)
        try {
          await Bs(p), j.current.delete(p);
        } catch (R) {
          throw x({ message: Hs(R) }), R;
        }
  }, []);
  return {
    companions: s,
    clearSearch: M,
    errorObj: h,
    handleSearch: I,
    isSearching: w,
    isSuggestionLoading: C,
    inviteCompanion: L,
    commitPendingUnlinks: O,
    removeCompanion: y,
    searchMode: g,
    searchQuery: i,
    searchResults: o,
    setSearchQuery: T,
    visibleSuggestionCount: at
  };
}, Ut = ({
  companion: e,
  className: t = "",
  showLinkedIndicator: s = !0,
  style: r
}) => {
  const [i, a] = c.useState(!1), o = K(e.avatarUrl), l = !!(o && !i);
  return c.useEffect(() => {
    a(!1);
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
            onError: () => a(!0),
            className: "companion-search-avatar-image"
          }
        ) : /* @__PURE__ */ n.jsx("span", { className: "companion-search-avatar-fallback", children: e.name.charAt(0) }),
        s ? /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator companion-search-avatar-link" }) : null
      ]
    }
  );
}, Ys = {
  incoming_pending: "응답 필요",
  linked: "연동됨",
  none: "초대",
  outgoing_pending: "초대중"
}, Vs = (e, t) => t ? "linked" : e.relationState ?? "none", qs = (e) => Ys[e], lt = ({ companion: e, isLinked: t, onInvite: s }) => {
  var l;
  const r = ((l = e.bio) == null ? void 0 : l.trim()) || `@${e.id}`, i = Vs(e, t), a = i === "none", o = qs(i);
  return /* @__PURE__ */ n.jsxs(
    "button",
    {
      className: "companion-linked-item list-item soft-radius companion-search-card",
      type: "button",
      onClick: () => {
        a && s(e);
      },
      disabled: !a,
      "data-linked": t ? "true" : "false",
      "data-relation-state": i,
      children: [
        /* @__PURE__ */ n.jsxs("div", { className: "item-info companion-search-card-info", children: [
          /* @__PURE__ */ n.jsx(Ut, { companion: e, showLinkedIndicator: i === "linked" }),
          /* @__PURE__ */ n.jsxs("div", { className: "user-info name-meta companion-search-card-copy", children: [
            /* @__PURE__ */ n.jsx("strong", { children: e.name }),
            /* @__PURE__ */ n.jsx("span", { children: r })
          ] })
        ] }),
        /* @__PURE__ */ n.jsx("span", { className: "pill-shape companion-search-card-badge", "data-linked": t ? "true" : "false", children: o })
      ]
    }
  );
}, Gs = ({
  initialCompanions: e,
  isOpen: t,
  onClose: s,
  onSave: r
}) => {
  const {
    companions: i,
    searchMode: a,
    searchQuery: o,
    searchResults: l,
    setSearchQuery: g,
    isSearching: b,
    errorObj: w,
    handleSearch: v,
    inviteCompanion: C,
    commitPendingUnlinks: E,
    removeCompanion: h,
    clearSearch: x
  } = Ks({ initialCompanions: e }), N = c.useRef(null), [j, u] = c.useState(!1), A = 4, k = o.trim().length > 0, z = c.useMemo(
    () => l.slice(0, A),
    [l]
  );
  if (c.useEffect(() => {
    if (t) {
      x();
      const y = window.setTimeout(() => {
        var O;
        return (O = N.current) == null ? void 0 : O.focus();
      }, 100);
      return () => window.clearTimeout(y);
    }
  }, [t, x]), c.useEffect(() => {
    const y = (O) => {
      O.key === "Escape" && t && s();
    };
    return window.addEventListener("keydown", y), () => window.removeEventListener("keydown", y);
  }, [t, s]), c.useEffect(() => {
    t && window.lucide && window.lucide.createIcons();
  }, [t, a, l, i, w]), !t) return null;
  const U = (y) => {
    y.preventDefault(), v(o);
  }, T = async () => {
    u(!0);
    try {
      await E(), r(i), s();
    } catch {
      return;
    } finally {
      u(!1);
    }
  }, M = (y) => i.some((O) => O.id === y), I = () => a !== "results" ? null : /* @__PURE__ */ n.jsx("div", { className: "companion-search-results-panel", children: w ? /* @__PURE__ */ n.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", fontWeight: 600 }, children: [
    /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
    w.message
  ] }) : b ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "28px 20px", fontSize: "14px" }, children: "제주그룹 회원을 찾는 중이다." }) : l.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "28px 20px", fontSize: "14px" }, children: "일치하는 제주그룹 회원이 없다." }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
    /* @__PURE__ */ n.jsxs("div", { style: { color: "var(--meta-text-muted)", fontSize: "13px", fontWeight: 700, flexShrink: 0 }, children: [
      "검색 결과 ",
      l.length,
      "명"
    ] }),
    /* @__PURE__ */ n.jsx("div", { className: "companion-search-results-list", children: l.map((y) => /* @__PURE__ */ n.jsx(
      lt,
      {
        companion: y,
        isLinked: M(y.id),
        onInvite: C
      },
      y.id
    )) })
  ] }) }), L = () => a === "results" || z.length === 0 ? null : /* @__PURE__ */ n.jsx("div", { className: "companion-search-dropdown", children: z.map((y) => /* @__PURE__ */ n.jsx(
    lt,
    {
      companion: y,
      isLinked: M(y.id),
      onInvite: C
    },
    y.id
  )) });
  return /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay companion-manage-modal active", onClick: s, role: "dialog", "aria-modal": "true", children: /* @__PURE__ */ n.jsxs(
    "div",
    {
      className: "meta-modal-content companion-modal-content soft-radius meta-glass-theme",
      onClick: (y) => y.stopPropagation(),
      style: { display: "flex", flexDirection: "column", overflow: "hidden", padding: "40px" },
      children: [
        /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "동행자 연동 / 관리" }) }) }),
        /* @__PURE__ */ n.jsxs("div", { className: "companion-modal-body", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "24px", minHeight: 0, overflow: "hidden" }, children: [
          /* @__PURE__ */ n.jsxs("form", { className: "companion-search-form id-search-wrap", onSubmit: U, style: { gap: "16px", marginBottom: "0", flexShrink: 0 }, children: [
            /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flex: 1, flexDirection: "column", gap: "12px", minWidth: 0, position: "relative" }, children: [
              /* @__PURE__ */ n.jsx(
                "input",
                {
                  ref: N,
                  className: "id-input companion-search-input",
                  type: "text",
                  placeholder: "제주그룹 회원 ID를 입력해라",
                  value: o,
                  onChange: (y) => g(y.target.value),
                  style: { padding: "18px 24px", fontSize: "16px", borderRadius: "12px", width: "100%" },
                  autoComplete: "off"
                }
              ),
              /* @__PURE__ */ n.jsx("div", { style: { left: 0, position: "absolute", right: 0, top: "calc(100% - 1px)", zIndex: 3 }, children: L() })
            ] }),
            /* @__PURE__ */ n.jsx(
              "button",
              {
                type: "submit",
                className: "add-btn companion-search-submit pill-shape",
                disabled: b,
                style: {
                  background: k ? "#ff7a00" : "#eef1f4",
                  border: k ? "1px solid #ff7a00" : "1px solid #d7dce2",
                  boxShadow: "none",
                  color: k ? "#fff" : "#7b8794",
                  padding: "0 36px",
                  fontSize: "16px",
                  borderRadius: "16px",
                  flexShrink: 0
                },
                children: b ? "검색 중..." : "검색"
              }
            )
          ] }),
          a === "results" ? I() : null,
          w && a !== "results" && /* @__PURE__ */ n.jsxs("div", { className: "error-message", style: { color: "red", fontSize: "13px", marginBottom: "16px", fontWeight: 600 }, children: [
            /* @__PURE__ */ n.jsx("i", { "data-lucide": "alert-circle", style: { marginRight: "4px", width: "14px", height: "14px", verticalAlign: "text-bottom" } }),
            w.message
          ] }),
          a !== "results" && /* @__PURE__ */ n.jsxs("div", { className: "linked-companions-section", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", minHeight: 0, overflow: "hidden" }, children: [
            /* @__PURE__ */ n.jsxs("h4", { style: { fontSize: "16px", fontWeight: 800, marginBottom: "20px", color: "var(--meta-text-main)" }, children: [
              "연동된 동행자 (",
              i.length,
              "명)"
            ] }),
            i.length === 0 ? /* @__PURE__ */ n.jsx("p", { className: "empty-list", style: { padding: "48px 20px", fontSize: "15px" }, children: "아직 연동된 동행자가 없다. 제주그룹 회원 ID를 검색해서 초대해라." }) : /* @__PURE__ */ n.jsx("div", { className: "companion-linked-list companion-list-scroll", style: { display: "flex", flex: "1 1 auto", flexDirection: "column", gap: "16px", minHeight: 0, overflowY: "auto", paddingRight: "4px" }, children: i.map((y) => /* @__PURE__ */ n.jsxs("div", { className: "companion-linked-item list-item", style: { padding: "12px 20px", borderRadius: "16px" }, children: [
              /* @__PURE__ */ n.jsxs("div", { className: "item-info", children: [
                /* @__PURE__ */ n.jsx(
                  Ut,
                  {
                    companion: y,
                    className: "companion-linked-avatar",
                    showLinkedIndicator: y.isMember,
                    style: { width: "40px", height: "40px", fontSize: "15px", marginLeft: 0 }
                  }
                ),
                /* @__PURE__ */ n.jsxs("div", { className: "user-info name-meta", children: [
                  /* @__PURE__ */ n.jsx("strong", { style: { fontSize: "16px" }, children: y.name }),
                  /* @__PURE__ */ n.jsxs("span", { style: { fontSize: "13px", color: "var(--meta-text-muted)" }, children: [
                    "@",
                    y.id
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ n.jsx(
                "button",
                {
                  className: "remove-btn companion-remove-btn",
                  type: "button",
                  onClick: () => void h(y.id),
                  style: { padding: "10px 24px", fontSize: "14px" },
                  children: "해제"
                }
              )
            ] }, y.id)) })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs("footer", { className: "modal-footer", style: { marginTop: "24px", gap: "16px", flexShrink: 0 }, children: [
          /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: s, style: { padding: "20px 0", fontSize: "16px" }, children: "취소" }),
          /* @__PURE__ */ n.jsx(
            "button",
            {
              className: "save-btn pill-shape",
              type: "button",
              onClick: () => void T(),
              disabled: j,
              style: { padding: "20px 0", fontSize: "16px" },
              children: j ? "적용 중" : "적용"
            }
          )
        ] })
      ]
    }
  ) });
}, Xs = (e) => {
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
}, Zs = ({ companion: e }) => {
  const [t, s] = c.useState(!1), r = K(e.avatarUrl), i = !!(r && !t);
  return c.useEffect(() => {
    s(!1);
  }, [r]), /* @__PURE__ */ n.jsxs(
    "div",
    {
      className: `companion-avatar soft-radius ${e.isMember ? "is-linked" : ""}`,
      title: e.name + (e.isMember ? " (연동됨)" : ""),
      children: [
        i ? /* @__PURE__ */ n.jsx(
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
}, Qs = () => {
  const { dispatch: e, state: t } = ie(), s = t.itinerary ?? [], r = s.length > 0 ? s : [
    {
      activities: [],
      companions: [],
      date: "일정 미정",
      googleMapUrl: "",
      id: "empty-itinerary",
      time: "시간 미정",
      title: "여행 일정 준비 중"
    }
  ], i = t.linkedCompanions ?? [], a = t.profile, [o, l] = c.useState(!1), [g, b] = c.useState(null), w = c.useRef({}), [v, C] = c.useState({});
  c.useEffect(() => {
    window.lucide && window.lucide.createIcons();
  }, [o, s, i]), c.useLayoutEffect(() => {
    const h = r.reduce((x, N) => {
      var j;
      return x[N.id] = ((j = w.current[N.id]) == null ? void 0 : j.scrollHeight) ?? 0, x;
    }, {});
    C((x) => {
      const N = Object.keys(x), j = Object.keys(h);
      return N.length === j.length && j.every((u) => x[u] === h[u]) ? x : h;
    });
  }, [r, o]);
  const E = (h) => {
    e({ type: "SET_LINKED_COMPANIONS", payload: h }), Gn(
      {
        id: a.id,
        profile: {
          email: a.email,
          id: a.id,
          name: a.name
        }
      },
      {
        linkedCompanions: h
      }
    ), b(null);
  };
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-itinerary", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "나의 여행지 일정" }),
      /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "동행자와 함께하는 상세 활동 계획" })
    ] }),
    /* @__PURE__ */ n.jsxs("div", { className: `itinerary-timeline-wrap ${o ? "is-expanded" : ""}`, children: [
      r.map((h, x) => {
        const N = x < 2, j = N || o, u = v[h.id] ?? 720, A = h.id === "empty-itinerary", k = i.length > 0 ? i : h.companions, z = k.slice(0, 4), U = k.length > 4 ? k.length - 4 : 0, T = U > 0 ? `외 ${U}명` : `총 ${k.length}명`;
        return /* @__PURE__ */ n.jsxs(
          "div",
          {
            className: "itinerary-day-block",
            ref: (M) => {
              w.current[h.id] = M;
            },
            "aria-hidden": !j,
            style: N ? void 0 : {
              overflow: "hidden",
              maxHeight: j ? `${u}px` : "0px",
              opacity: j ? 1 : 0,
              transform: j ? "translateY(0)" : "translateY(-18px)",
              marginBottom: j ? "40px" : "0px",
              pointerEvents: j ? "auto" : "none",
              transition: "max-height 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease, transform 460ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 460ms cubic-bezier(0.22, 1, 0.36, 1)"
            },
            children: [
              /* @__PURE__ */ n.jsxs("div", { className: "day-side-info", children: [
                /* @__PURE__ */ n.jsx("span", { className: "day-date", children: h.date }),
                /* @__PURE__ */ n.jsx("span", { className: "day-time", children: h.time }),
                /* @__PURE__ */ n.jsxs("div", { className: "companions-card-wrap soft-radius", children: [
                  /* @__PURE__ */ n.jsxs("div", { className: "comp-head", children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "users", className: "lucide-users" }),
                    /* @__PURE__ */ n.jsx("span", { className: "small-label", children: "함께하는 동행자" })
                  ] }),
                  /* @__PURE__ */ n.jsxs("div", { className: "avatar-stack", children: [
                    z.map((M) => /* @__PURE__ */ n.jsx(Zs, { companion: M }, M.id)),
                    /* @__PURE__ */ n.jsx("span", { className: "comp-count-label", children: T })
                  ] }),
                  /* @__PURE__ */ n.jsxs("button", { className: "link-action-btn pill-shape", type: "button", onClick: () => b(h.id), children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "user-plus", className: "lucide-user-plus" }),
                    "동행자 연동/관리"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ n.jsxs(re, { className: "itinerary-content-card meta-glass-theme", children: [
                /* @__PURE__ */ n.jsxs("div", { className: "iti-header flex-header", children: [
                  /* @__PURE__ */ n.jsx("h3", { className: "iti-title", children: h.title }),
                  h.googleMapUrl ? /* @__PURE__ */ n.jsxs("a", { className: "map-link-btn pill-shape", href: h.googleMapUrl, rel: "noopener noreferrer", target: "_blank", children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 보기"
                  ] }) : /* @__PURE__ */ n.jsxs("span", { className: "map-link-btn pill-shape is-disabled", "aria-disabled": "true", children: [
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "map-pin", className: "lucide-map-pin" }),
                    "구글 맵 준비 중"
                  ] })
                ] }),
                /* @__PURE__ */ n.jsxs("div", { className: "activity-checklist-wrap", children: [
                  /* @__PURE__ */ n.jsx("p", { className: "small-label", children: "활동(Activity) 체크리스트" }),
                  /* @__PURE__ */ n.jsx("ul", { className: `checklist-list ${h.activities.length === 0 ? "is-empty" : ""}`, children: h.activities.map((M) => {
                    const I = Xs(M.status), L = M.status === "used", y = M.status === "cancelled" || M.status === "missed";
                    return /* @__PURE__ */ n.jsx(
                      "li",
                      {
                        className: `checklist-item ${L ? "checked" : ""} soft-radius`,
                        style: I.style,
                        children: /* @__PURE__ */ n.jsxs("div", { className: "checkbox-control", style: { alignItems: "flex-start" }, children: [
                          /* @__PURE__ */ n.jsx(
                            "i",
                            {
                              "data-lucide": I.icon,
                              style: {
                                color: L ? "var(--brand-rent)" : y ? "#ef4444" : "var(--meta-text-muted)",
                                marginTop: "2px",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0
                              }
                            }
                          ),
                          /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 }, children: [
                            /* @__PURE__ */ n.jsx("span", { className: "check-text", children: M.label }),
                            /* @__PURE__ */ n.jsx(
                              "span",
                              {
                                style: {
                                  color: y ? "#ef4444" : "var(--meta-text-muted)",
                                  fontSize: "12px",
                                  fontWeight: 700
                                },
                                children: (M.ownerName ?? "본인") + " · " + I.label
                              }
                            )
                          ] })
                        ] })
                      },
                      M.id
                    );
                  }) }),
                  A ? /* @__PURE__ */ n.jsx("p", { className: "checklist-empty-caption", children: "등록된 활동이 아직 없다." }) : null
                ] })
              ] })
            ]
          },
          h.id
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
    g && /* @__PURE__ */ n.jsx(
      Gs,
      {
        isOpen: !!g,
        onClose: () => b(null),
        initialCompanions: i,
        onSave: E
      }
    )
  ] });
}, Js = 5 * 1024 * 1024, X = 512, er = 16, tr = 6, zt = 20, nr = {
  alignItems: "center",
  borderRadius: "50%",
  display: "flex",
  inset: 0,
  justifyContent: "center",
  overflow: "hidden",
  position: "absolute"
}, sr = {
  display: "block",
  height: "100%",
  objectFit: "cover",
  width: "100%"
}, rr = {
  alignItems: "center",
  display: "flex",
  fontSize: "18px",
  fontWeight: 800,
  height: "100%",
  justifyContent: "center",
  width: "100%"
}, fe = (e) => Array.from((e ?? "").trim()).slice(0, zt).join(""), we = (e) => ({
  bio: e.bio ?? "",
  email: e.email,
  name: e.name,
  nickname: e.nickname ?? "",
  phone: e.phone
}), ar = (e) => ({
  bio: fe(e.bio),
  email: e.email.trim(),
  name: e.name.trim(),
  nickname: e.nickname.trim(),
  phone: e.phone.trim()
}), ct = (e) => (e.nickname.trim().length === 0 || e.nickname.trim().length >= 2) && e.email.trim().includes("@") && e.phone.trim().length > 0, dt = (e) => `${ae}${e}`, le = (e) => e !== null && typeof e == "object" && !Array.isArray(e), ir = (e) => new Promise((t, s) => {
  const r = new FileReader();
  r.onload = () => {
    if (typeof r.result == "string") {
      t(r.result);
      return;
    }
    s(new Error("이미지 데이터를 읽지 못했습니다."));
  }, r.onerror = () => s(new Error("이미지 데이터를 읽지 못했습니다.")), r.readAsDataURL(e);
}), ge = (e, t, s) => Math.min(s, Math.max(t, e)), ee = (e, t, s) => {
  if (!e.naturalWidth || !e.naturalHeight)
    return null;
  const r = Math.max(1, Math.round(t || 320)), i = Math.max(1, Math.round(s || 320)), a = Math.max(0, Math.min(r, i) - er * 2), o = a / 2, l = Math.min(r / e.naturalWidth, i / e.naturalHeight), g = e.naturalWidth * l, b = e.naturalHeight * l, w = Math.max(a / Math.max(g, 1), a / Math.max(b, 1), 1);
  return {
    baseHeight: b,
    baseScale: l,
    baseWidth: g,
    circleDiameter: a,
    circleRadius: o,
    maxZoom: tr,
    minZoom: w,
    stageHeight: i,
    stageWidth: r
  };
}, xe = (e, t) => {
  const s = ge(e.zoom, t.minZoom, t.maxZoom), r = t.baseWidth * s, i = t.baseHeight * s, a = Math.max(0, (r - t.circleDiameter) / 2), o = Math.max(0, (i - t.circleDiameter) / 2);
  return {
    panX: ge(e.panX, -a, a),
    panY: ge(e.panY, -o, o),
    zoom: s
  };
}, or = (e, t, s, r, i) => {
  const a = ee(t, s, r);
  return a ? xe(i, a) : e;
}, lr = (e, t, s) => new Promise((r, i) => {
  const a = document.createElement("canvas"), o = window.devicePixelRatio || 1;
  a.width = Math.max(1, Math.round(X * o)), a.height = Math.max(1, Math.round(X * o));
  const l = a.getContext("2d");
  if (!l)
    throw new Error("프로필 사진 편집용 캔버스를 만들지 못했습니다.");
  l.scale(o, o), l.imageSmoothingQuality = "high", l.clearRect(0, 0, X, X);
  const g = X / Math.max(t.circleDiameter, 1), b = t.baseWidth * s.zoom, w = t.baseHeight * s.zoom, v = t.stageWidth / 2 + s.panX - b / 2 - (t.stageWidth / 2 - t.circleRadius), C = t.stageHeight / 2 + s.panY - w / 2 - (t.stageHeight / 2 - t.circleRadius);
  l.save(), l.beginPath(), l.arc(
    X / 2,
    X / 2,
    X / 2,
    0,
    Math.PI * 2
  ), l.closePath(), l.clip(), l.drawImage(
    e,
    v * g,
    C * g,
    b * g,
    w * g
  ), l.restore(), a.toBlob((E) => {
    if (E) {
      r(E);
      return;
    }
    i(new Error("프로필 사진 편집용 이미지를 만들지 못했습니다."));
  }, "image/png");
}), cr = (e) => {
  if (!le(e))
    return null;
  const t = le(e.profile) ? e.profile : null, s = le(e.dashboard) ? e.dashboard : null, r = s && le(s.profile) ? s.profile : null, i = le(e.data) ? e.data : null, a = [
    e.avatarUrl,
    t == null ? void 0 : t.avatarUrl,
    s == null ? void 0 : s.avatarUrl,
    r == null ? void 0 : r.avatarUrl,
    i == null ? void 0 : i.avatarUrl
  ];
  for (const o of a)
    if (typeof o == "string") {
      const l = o.trim();
      if (l.length > 0)
        return l;
    }
  return null;
}, dr = (e) => e === "point" ? {
  color: "#1f2937"
} : void 0, mr = () => {
  var Ke, Ye, Ve, qe, Ge, Xe;
  const { refreshDashboard: e, state: t } = ie(), s = t.profile ?? Z, r = (Ke = t.stats) != null && Ke.length ? t.stats : Me, i = s.passport, [a, o] = c.useState(() => we(s)), [l, g] = c.useState(() => we(s)), [b, w] = c.useState(!1), [v, C] = c.useState("profile"), [E, h] = c.useState(!1), [x, N] = c.useState(null), [j, u] = c.useState(null), [A, k] = c.useState(!1), [z, U] = c.useState(null), [T, M] = c.useState(null), [I, L] = c.useState({ panX: 0, panY: 0, zoom: 1 }), [y, O] = c.useState({ height: 320, width: 320 }), [S, p] = c.useState(!1), [R, Y] = c.useState(!1), V = c.useRef(null), _ = c.useRef(null), Q = c.useRef(null), G = c.useRef(null), F = K(z) ?? s.avatarUrl ?? null, Lt = (l.nickname.trim().charAt(0) || l.name.trim().charAt(0) || ((Ye = a.nickname) == null ? void 0 : Ye.trim().charAt(0)) || a.name.trim().charAt(0) || ((Ve = Z.nickname) == null ? void 0 : Ve.trim().charAt(0)) || Z.name.trim().charAt(0) || "J").toUpperCase(), Pt = l.nickname.trim() || l.name.trim() || ((qe = a.nickname) == null ? void 0 : qe.trim()) || a.name.trim() || ((Ge = Z.nickname) == null ? void 0 : Ge.trim()) || Z.name.trim(), $t = fe(l.bio) || fe(a.bio), ve = l.nickname.trim().length > 0 && l.nickname.trim().length < 2 ? "닉네임은 2자 이상부터 가능합니다" : null;
  c.useEffect(() => {
    b && window.lucide && window.lucide.createIcons();
  }, [F, b, v]), c.useEffect(() => {
    if (!b)
      return;
    const d = document.body.style.overflow, f = document.documentElement.style.overflow;
    return document.body.style.overflow = "hidden", document.documentElement.style.overflow = "hidden", () => {
      document.body.style.overflow = d, document.documentElement.style.overflow = f;
    };
  }, [b]), c.useEffect(() => {
    const d = we(s);
    b || (o(d), g(d));
  }, [s, b]), c.useEffect(() => {
    if (!b || v !== "avatar" || !Q.current)
      return;
    const d = () => {
      var W;
      const $ = (W = Q.current) == null ? void 0 : W.getBoundingClientRect();
      $ && O({
        height: Math.max(1, Math.round($.height)),
        width: Math.max(1, Math.round($.width))
      });
    };
    d();
    const f = new ResizeObserver(d);
    return f.observe(Q.current), () => f.disconnect();
  }, [T, b, v]), c.useEffect(() => {
    if (!T || !S || !_.current)
      return;
    const d = ee(_.current, y.width, y.height);
    d && L((f) => xe(f, d));
  }, [S, T, y.height, y.width]);
  const Ot = () => {
    const d = _.current;
    if (!d)
      return;
    const f = ee(d, y.width, y.height);
    if (!f) {
      u("이미지 크기를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    p(!0), L(xe({ panX: 0, panY: 0, zoom: f.minZoom }, f)), u(null);
  }, be = () => {
    M(null), L({ panX: 0, panY: 0, zoom: 1 }), p(!1), u(null), k(!1), Y(!1), G.current = null;
  }, Bt = () => {
    g(a), N(null), C("profile"), U((d) => K(d) ?? s.avatarUrl ?? null), be(), w(!0);
  }, ze = () => {
    g(a), N(null), C("profile"), be(), w(!1);
  }, Le = () => {
    C("avatar"), be();
  }, Pe = () => {
    var d;
    (d = V.current) == null || d.click();
  }, Ft = async (d) => {
    var $;
    const f = ($ = d.target.files) == null ? void 0 : $[0];
    if (d.target.value = "", !!f) {
      if (!f.type.startsWith("image/")) {
        u("이미지 파일만 선택해 주세요.");
        return;
      }
      if (f.size > Js) {
        u("프로필 사진은 5MB 이하로 선택해 주세요.");
        return;
      }
      try {
        const W = await ir(f);
        M(W), L({ panX: 0, panY: 0, zoom: 1 }), p(!1), u(null);
      } catch {
        u("이미지를 불러오지 못했습니다. 다른 파일로 다시 선택해 주세요.");
      }
    }
  }, Wt = (d) => {
    _.current && L(
      (f) => or(
        f,
        _.current,
        y.width,
        y.height,
        d
      )
    );
  }, Ht = (d) => {
    !T || !S || !_.current || !ee(_.current, y.width, y.height) || (d.preventDefault(), d.currentTarget.setPointerCapture(d.pointerId), G.current = {
      pointerId: d.pointerId,
      startClientX: d.clientX,
      startClientY: d.clientY,
      startPanX: I.panX,
      startPanY: I.panY
    }, Y(!0));
  }, Kt = (d) => {
    const f = G.current;
    if (!f || f.pointerId !== d.pointerId || !S || !_.current)
      return;
    const $ = {
      panX: f.startPanX + (d.clientX - f.startClientX),
      panY: f.startPanY + (d.clientY - f.startClientY),
      zoom: I.zoom
    };
    Wt($);
  }, $e = (d) => {
    const f = G.current;
    !f || f.pointerId !== d.pointerId || (G.current = null, Y(!1), d.currentTarget.hasPointerCapture(d.pointerId) && d.currentTarget.releasePointerCapture(d.pointerId));
  }, Yt = (d) => {
    !T || !S || !_.current || (d.preventDefault(), d.stopPropagation(), L((f) => {
      const $ = _.current;
      if (!$)
        return f;
      const W = ee($, y.width, y.height);
      if (!W)
        return f;
      const oe = Math.exp(-d.deltaY * 12e-4), me = ge(f.zoom * oe, W.minZoom, W.maxZoom), se = me / Math.max(f.zoom, 1e-4);
      return xe(
        {
          panX: f.panX * se,
          panY: f.panY * se,
          zoom: me
        },
        W
      );
    }));
  }, Vt = async () => {
    if (!T || !S || !_.current) {
      u("먼저 이미지를 선택해 주세요.");
      return;
    }
    const d = ee(_.current, y.width, y.height);
    if (!d) {
      u("이미지 정보를 확인하지 못했습니다. 다시 선택해 주세요.");
      return;
    }
    k(!0), u(null);
    try {
      const f = await lr(_.current, d, I), $ = new File([f], "avatar.png", { type: "image/png" }), W = new FormData();
      W.append("avatar", $);
      const oe = await fetch(dt("/api/mypage/avatar"), {
        body: W,
        credentials: "include",
        headers: {
          Accept: "application/json"
        },
        method: "POST"
      });
      if (oe.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!oe.ok)
        throw new Error("프로필 사진 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      const me = await oe.json().catch(() => null), se = K(cr(me));
      se && U(se);
      const en = await e();
      !se && en && U(null), C("profile");
    } catch (f) {
      u(f instanceof Error ? f.message : "프로필 사진 적용에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      k(!1);
    }
  }, qt = async () => {
    const d = ar(l);
    if (!ct(d)) {
      N(ve ?? "닉네임, 이메일, 휴대전화 정보를 확인해 주세요.");
      return;
    }
    h(!0), N(null);
    try {
      const f = await fetch(dt("/api/mypage/profile"), {
        body: JSON.stringify(d),
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "PUT"
      });
      if (f.status === 401)
        throw new Error("로그인 정보가 만료되었습니다. 다시 로그인해 주세요.");
      if (!f.ok)
        throw new Error("프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      if (!await e())
        throw new Error("저장은 완료되었지만 최신 정보를 다시 불러오지 못했습니다.");
      w(!1), C("profile");
    } catch (f) {
      N(f instanceof Error ? f.message : "프로필 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      h(!1);
    }
  }, Gt = E || !ct(l), D = T && S && _.current ? ee(_.current, y.width, y.height) : null, Oe = D ? D.baseWidth * I.zoom : 0, Be = D ? D.baseHeight * I.zoom : 0, Xt = D ? D.stageWidth / 2 + I.panX - Oe / 2 : 0, Zt = D ? D.stageHeight / 2 + I.panY - Be / 2 : 0, Fe = (D == null ? void 0 : D.circleDiameter) ?? 0, ne = (D == null ? void 0 : D.circleRadius) ?? 0, Qt = {
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
  }, Jt = D ? {
    display: "block",
    height: `${Be}px`,
    left: `${Xt}px`,
    maxHeight: "none",
    maxWidth: "none",
    objectFit: "contain",
    pointerEvents: "none",
    position: "absolute",
    top: `${Zt}px`,
    userSelect: "none",
    width: `${Oe}px`
  } : {
    display: "block",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    objectFit: "contain",
    width: "auto"
  }, We = D ? {
    background: "rgba(20, 24, 31, 0.14)",
    inset: 0,
    maskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, ne - 2)}px, black ${Math.max(0, ne - 1)}px, black 100%)`,
    WebkitMaskImage: `radial-gradient(circle at center, transparent 0, transparent ${Math.max(0, ne - 2)}px, black ${Math.max(0, ne - 1)}px, black 100%)`,
    pointerEvents: "none",
    position: "absolute"
  } : null, He = D ? {
    border: "2px dashed rgba(255, 255, 255, 0.94)",
    borderRadius: "50%",
    boxShadow: "0 0 0 1px rgba(17, 24, 39, 0.14)",
    height: `${Fe}px`,
    left: `calc(50% - ${ne}px)`,
    pointerEvents: "none",
    position: "absolute",
    top: `calc(50% - ${ne}px)`,
    width: `${Fe}px`
  } : null;
  return /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
    /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-account-benefits", children: [
      /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
        /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "회원 정보 및 혜택" }),
        /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "개인정보 보호와 맞춤형 혜택 관리" })
      ] }),
      /* @__PURE__ */ n.jsxs("div", { className: "account-grid bento-grid", children: [
        /* @__PURE__ */ n.jsxs(re, { className: "account-info-box meta-glass-theme", children: [
          /* @__PURE__ */ n.jsxs("div", { className: "box-head flex-header", children: [
            /* @__PURE__ */ n.jsx("h3", { children: "기본 정보" }),
            /* @__PURE__ */ n.jsx("button", { className: "edit-btn pill-shape", type: "button", onClick: Bt, children: "내 정보 수정" })
          ] }),
          /* @__PURE__ */ n.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "닉네임" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", style: a.nickname ? void 0 : { color: "#9ca3af" }, children: (Xe = a.nickname) != null && Xe.trim() ? a.nickname : "설정하지 않음" })
            ] }),
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "이메일" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", children: a.email })
            ] }),
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: "휴대전화" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", children: a.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs(re, { className: "passport-info-box meta-glass-theme", children: [
          /* @__PURE__ */ n.jsx("div", { className: "box-head", children: /* @__PURE__ */ n.jsx("h3", { children: "패스포트 정보" }) }),
          /* @__PURE__ */ n.jsxs("div", { className: "box-body", children: [
            /* @__PURE__ */ n.jsx(
              "div",
              {
                className: "passport-visual soft-radius",
                style: i ? void 0 : { background: "linear-gradient(135deg, #ff7a00 0%, #ff9d47 100%)" },
                children: /* @__PURE__ */ n.jsxs("div", { className: "pass-meta", children: [
                  /* @__PURE__ */ n.jsx("span", { className: "pass-num", children: (i == null ? void 0 : i.number) ?? "미등록" }),
                  /* @__PURE__ */ n.jsx("span", { className: "pass-country", children: (i == null ? void 0 : i.issuingCountry) ?? "해외 여행 전에 여권 정보를 등록해 주세요." })
                ] })
              }
            ),
            /* @__PURE__ */ n.jsxs("div", { className: "info-row", children: [
              /* @__PURE__ */ n.jsx("span", { className: "label", children: i ? "여권 만료일" : "등록 상태" }),
              /* @__PURE__ */ n.jsx("strong", { className: "value", children: (i == null ? void 0 : i.expiryDate) ?? "등록 필요" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ n.jsxs(re, { className: "benefit-history-box meta-glass-theme full-width-bento", children: [
          /* @__PURE__ */ n.jsx("div", { className: "box-head", children: /* @__PURE__ */ n.jsx("h3", { children: "나의 포인트 & 쿠폰 내역" }) }),
          /* @__PURE__ */ n.jsx("div", { className: "benefit-tiles", children: r.slice(0, 2).map((d) => /* @__PURE__ */ n.jsxs("div", { className: `benefit-tile tone-${d.tone} soft-radius`, children: [
            /* @__PURE__ */ n.jsx("span", { className: "benefit-label", children: d.label }),
            /* @__PURE__ */ n.jsx("strong", { className: "benefit-value", style: dr(d.tone), children: d.value }),
            /* @__PURE__ */ n.jsx("button", { className: "history-link", type: "button", children: "상세 내역 확인" })
          ] }, d.label)) })
        ] })
      ] })
    ] }),
    b ? /* @__PURE__ */ n.jsx("div", { className: "meta-modal-overlay", onClick: ze, children: /* @__PURE__ */ n.jsx(
      "div",
      {
        className: "meta-modal-content soft-radius meta-glass-theme",
        onClick: (d) => d.stopPropagation(),
        style: { padding: "36px" },
        children: v === "profile" ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
          /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "개인정보 수정" }) }) }),
          /* @__PURE__ */ n.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
            /* @__PURE__ */ n.jsx("span", { style: { color: "#6b7280", fontSize: "13px", fontWeight: 700, lineHeight: 1.4 }, children: "공용 프로필 미리보기 - 눌러서 이미지 변경" }),
            /* @__PURE__ */ n.jsxs(
              "div",
              {
                className: "profile-link-preview soft-radius",
                role: "button",
                tabIndex: 0,
                onClick: Le,
                onKeyDown: (d) => {
                  (d.key === "Enter" || d.key === " ") && (d.preventDefault(), Le());
                },
                children: [
                  /* @__PURE__ */ n.jsxs("div", { className: "companion-avatar soft-radius is-linked", "aria-hidden": "true", style: { position: "relative" }, children: [
                    /* @__PURE__ */ n.jsx("span", { style: nr, children: F ? /* @__PURE__ */ n.jsx("img", { alt: "", className: "profile-link-preview-image", src: F, style: sr }) : /* @__PURE__ */ n.jsx("span", { style: rr, children: Lt }) }),
                    /* @__PURE__ */ n.jsx("i", { "data-lucide": "link", className: "lucide-link linked-indicator" })
                  ] }),
                  /* @__PURE__ */ n.jsxs("div", { className: "profile-link-copy", children: [
                    /* @__PURE__ */ n.jsx("strong", { children: Pt }),
                    /* @__PURE__ */ n.jsx("span", { children: $t })
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
                          maxLength: zt,
                          type: "text",
                          value: l.bio,
                          onChange: (d) => g((f) => ({
                            ...f,
                            bio: fe(d.target.value)
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
                          onChange: (d) => g((f) => ({ ...f, nickname: d.target.value })),
                          style: { width: "100%", boxSizing: "border-box", padding: "17px 22px", fontSize: "16px", borderRadius: "12px" }
                        }
                      ) }),
                      ve ? /* @__PURE__ */ n.jsx("div", { style: { color: "#d92d20", fontSize: "13px", fontWeight: 600, lineHeight: 1.4 }, children: ve }) : null
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
                          onChange: (d) => g((f) => ({ ...f, email: d.target.value })),
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
                          onChange: (d) => g((f) => ({ ...f, phone: d.target.value })),
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
            /* @__PURE__ */ n.jsx("button", { className: "cancel-btn pill-shape", type: "button", onClick: ze, style: { padding: "18px 0", fontSize: "15px" }, children: "취소" }),
            /* @__PURE__ */ n.jsx(
              "button",
              {
                className: "save-btn pill-shape",
                type: "button",
                onClick: qt,
                disabled: Gt,
                style: { padding: "18px 0", fontSize: "15px" },
                children: "저장"
              }
            )
          ] })
        ] }) : /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
          /* @__PURE__ */ n.jsx("header", { className: "modal-header", children: /* @__PURE__ */ n.jsx("div", { className: "header-title-wrap", children: /* @__PURE__ */ n.jsx("h3", { children: "프로필 사진 편집" }) }) }),
          /* @__PURE__ */ n.jsx("input", { ref: V, accept: "image/*", hidden: !0, type: "file", onChange: Ft }),
          /* @__PURE__ */ n.jsx("div", { className: "profile-avatar-editor soft-radius", children: /* @__PURE__ */ n.jsx("div", { className: "profile-avatar-editor-preview", children: /* @__PURE__ */ n.jsx(
            "div",
            {
              ref: Q,
              onPointerCancel: $e,
              onPointerDown: Ht,
              onPointerMove: Kt,
              onPointerUp: $e,
              onWheel: Yt,
              style: {
                ...Qt,
                cursor: T ? R ? "grabbing" : "grab" : "default"
              },
              children: T ? /* @__PURE__ */ n.jsxs(n.Fragment, { children: [
                /* @__PURE__ */ n.jsx(
                  "img",
                  {
                    ref: _,
                    alt: "프로필 사진 편집 미리보기",
                    draggable: !1,
                    src: T,
                    style: Jt,
                    onLoad: Ot
                  }
                ),
                We ? /* @__PURE__ */ n.jsx("div", { style: We }) : null,
                He ? /* @__PURE__ */ n.jsx("div", { style: He }) : null
              ] }) : /* @__PURE__ */ n.jsx(
                "button",
                {
                  className: "profile-avatar-editor-empty",
                  type: "button",
                  onClick: Pe,
                  children: "사진 선택"
                }
              )
            }
          ) }) }),
          T ? /* @__PURE__ */ n.jsx("div", { style: { display: "flex", justifyContent: "center", marginTop: "-4px" }, children: /* @__PURE__ */ n.jsx(
            "button",
            {
              type: "button",
              onClick: Pe,
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
                  C("profile"), u(null);
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
                onClick: Vt,
                disabled: !T || !S || A,
                style: { padding: "18px 0", fontSize: "15px" },
                children: A ? "적용 중..." : "적용"
              }
            )
          ] })
        ] })
      }
    ) }) : null
  ] });
}, ur = {
  qna: ["/pages/mypage/assets/support_qna.png", "/front-mirror/pages/mypage/assets/support_qna.png"],
  notice: ["/pages/mypage/assets/support_notice.png", "/front-mirror/pages/mypage/assets/support_notice.png"],
  faq: ["/pages/mypage/assets/support_faq.png", "/front-mirror/pages/mypage/assets/support_faq.png"]
}, pr = () => typeof document > "u" ? !1 : Array.from(document.querySelectorAll("link[href], script[src]")).some((e) => (e.getAttribute("href") ?? e.getAttribute("src") ?? "").includes("/front-mirror/")), mt = (e, t = !1) => {
  const s = e === "qna" ? "qna" : e === "notice" ? "notice" : "faq", [r, i] = ur[s];
  return t ? i : r;
}, hr = () => {
  const { state: e } = ie(), t = e.supportItems ?? [], [s] = c.useState(pr), [r, i] = c.useState({});
  return /* @__PURE__ */ n.jsxs("section", { className: "meta-section layer-support", children: [
    /* @__PURE__ */ n.jsxs("header", { className: "section-header", children: [
      /* @__PURE__ */ n.jsx("h2", { className: "section-title", children: "고객지원" }),
      /* @__PURE__ */ n.jsx("p", { className: "section-subtitle", children: "여행 중 궁금한 점을 전문가와 상담하세요." })
    ] }),
    /* @__PURE__ */ n.jsx("div", { className: "support-bento-grid bento-grid", children: t.map((a) => /* @__PURE__ */ n.jsxs("a", { className: `support-item-card bento-item meta-glass-theme soft-radius ${a.id}`, href: a.href, children: [
      /* @__PURE__ */ n.jsx("div", { className: "sp-icon", children: /* @__PURE__ */ n.jsx(
        "img",
        {
          alt: a.label,
          onError: (o) => {
            r[a.id] || s || (i((l) => ({
              ...l,
              [a.id]: !0
            })), o.currentTarget.src = mt(a.id, !0));
          },
          src: mt(a.id, s || r[a.id] === !0)
        }
      ) }),
      /* @__PURE__ */ n.jsxs("div", { className: "sp-text", children: [
        /* @__PURE__ */ n.jsx("strong", { className: "sp-label", children: a.label }),
        a.count !== null ? /* @__PURE__ */ n.jsxs("span", { className: `sp-badge pill-shape ${a.count > 0 ? "active" : ""}`, children: [
          a.count,
          " 건"
        ] }) : /* @__PURE__ */ n.jsx("span", { className: "sp-link-text", children: "상세 보기" })
      ] })
    ] }, a.id)) })
  ] });
}, fr = () => /* @__PURE__ */ n.jsxs("div", { className: "meta-dashboard-layout", children: [
  /* @__PURE__ */ n.jsx(As, {}),
  /* @__PURE__ */ n.jsx(Ms, {}),
  /* @__PURE__ */ n.jsx(Qs, {}),
  /* @__PURE__ */ n.jsx(mr, {}),
  /* @__PURE__ */ n.jsx(hr, {})
] }), yr = () => /* @__PURE__ */ n.jsx(ds, { children: /* @__PURE__ */ n.jsx(fr, {}) });
export {
  yr as M
};
