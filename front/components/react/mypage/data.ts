import type {
  BookingItem,
  BookingType,
  DashboardSnapshot,
  ItineraryItem,
  PassportInfo,
  StatItem,
  SupportItem,
  UserProfile,
} from "./types";

const FALLBACK_PROFILE: UserProfile = {
  email: "minji.hong@jejugroup.example",
  memberships: ["GOLD"],
  name: "홍민지",
  passport: {
    expiryDate: "2032.12.31",
    issuingCountry: "Republic of Korea",
    number: "M12345678",
  },
  phone: "010-1234-5678",
  tier: "GOLD",
};

const FALLBACK_STATS: StatItem[] = [
  { label: "보유 포인트", tone: "point", value: "26,600P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "12장" },
  { label: "다가오는 여행", tone: "air", value: "3건" },
];

const FALLBACK_BOOKINGS: BookingItem[] = [
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
    voucherUrl: "#",
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
    voucherUrl: "#",
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
    type: "rent",
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
    voucherUrl: "#",
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
    voucherUrl: "#",
  },
];

export const PROFILE: UserProfile = cloneProfile(FALLBACK_PROFILE);
export const STATS: StatItem[] = cloneStats(FALLBACK_STATS);
export const BOOKINGS: BookingItem[] = cloneBookings(FALLBACK_BOOKINGS);

export const ITINERARY: ItineraryItem[] = [
  {
    activities: [
      { checked: true, id: "act-01", label: "인천공항 제1여객터미널 도착" },
      { checked: true, id: "act-02", label: "제주항공 7C101 셀프 체크인" },
      { checked: false, id: "act-03", label: "모바일 탑승권 확인 및 보안검색" },
    ],
    companions: [
      { id: "comp-1", isMember: true, name: "박준영" },
      { id: "comp-2", isMember: true, name: "이지은" },
    ],
    date: "2026.10.15",
    googleMapUrl: "https://maps.google.com",
    id: "iti-0",
    time: "07:30",
    title: "제주행 비행기 탑승 및 출발",
  },
  {
    activities: [
      { checked: true, id: "act-1", label: "제주 공항 도착 및 렌터카 픽업" },
      { checked: false, id: "act-2", label: "고기국수 맛집 방문 (자매국수)" },
      { checked: false, id: "act-3", label: "함덕 해수욕장 산책 및 카페" },
    ],
    companions: [
      { id: "comp-1", isMember: true, name: "박준영" },
      { id: "comp-2", isMember: true, name: "이지은" },
    ],
    date: "2026.10.15",
    googleMapUrl: "https://maps.google.com",
    id: "iti-1",
    time: "14:00",
    title: "제주도 첫날 도착 및 로컬 투어",
  },
  {
    activities: [
      { checked: false, id: "act-4", label: "우도 잠수함 체험 및 우도 산책" },
      { checked: false, id: "act-5", label: "성산일출봉 등반 (일몰 감상)" },
    ],
    companions: [{ id: "comp-1", isMember: true, name: "박준영" }],
    date: "2026.10.16",
    googleMapUrl: "https://maps.google.com",
    id: "iti-2",
    time: "10:30",
    title: "동부 해안 투어 및 성산 액티비티",
  },
  {
    activities: [
      { checked: false, id: "act-6", label: "서귀포 올레시장 먹거리 탐방" },
      { checked: false, id: "act-7", label: "천지연 폭포 야간 산책" },
    ],
    companions: [
      { id: "comp-1", isMember: true, name: "박준영" },
      { id: "comp-2", isMember: true, name: "이지은" },
      { id: "comp-3", isMember: true, name: "최수진" },
    ],
    date: "2026.10.17",
    googleMapUrl: "https://maps.google.com",
    id: "iti-3",
    time: "18:00",
    title: "서귀포 밤 정취 느끼기",
  },
  {
    activities: [
      { checked: false, id: "act-08", label: "면세점 쇼핑 및 기념품 구매" },
      { checked: false, id: "act-09", label: "제주 공항 바이오 등록 승인" },
      { checked: false, id: "act-10", label: "제주항공 7C102 탑승 대기" },
    ],
    companions: [
      { id: "comp-1", isMember: true, name: "박준영" },
      { id: "comp-2", isMember: true, name: "이지은" },
    ],
    date: "2026.10.18",
    googleMapUrl: "https://maps.google.com",
    id: "iti-4",
    time: "19:30",
    title: "서울/김포행 귀국 비행기 탑승",
  },
];

export const SUPPORT_ITEMS: SupportItem[] = [
  { count: 1, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" },
];

export const createDashboardFallbackSnapshot = (): DashboardSnapshot => ({
  bookings: cloneBookings(FALLBACK_BOOKINGS),
  itinerary: cloneItinerary(ITINERARY),
  profile: cloneProfile(FALLBACK_PROFILE),
  stats: cloneStats(FALLBACK_STATS),
  supportItems: cloneSupportItems(SUPPORT_ITEMS),
});

export const normalizeDashboardSnapshot = (session: unknown): DashboardSnapshot => {
  const fallback = createDashboardFallbackSnapshot();
  const source = flattenSessionSource(session);
  const hasSession = hasSessionPayload(source);

  if (!hasSession) {
    return fallback;
  }

  return {
    bookings: normalizeBookings(source.bookings, fallback.bookings),
    itinerary: normalizeItinerary(source.itinerary, fallback.itinerary),
    profile: normalizeProfile(source, fallback.profile),
    stats: normalizeStats(source.stats ?? source, fallback.stats),
    supportItems: normalizeSupportItems(source.supportItems ?? source.support ?? source.inquiries, fallback.supportItems),
  };
};

export const applyDashboardSnapshot = (snapshot: DashboardSnapshot) => {
  syncProfile(PROFILE, snapshot.profile);
  syncStats(STATS, snapshot.stats);
  syncBookings(BOOKINGS, snapshot.bookings);
  syncItinerary(ITINERARY, snapshot.itinerary);
  syncSupportItems(SUPPORT_ITEMS, snapshot.supportItems);
};

function cloneProfile(profile: UserProfile): UserProfile {
  return {
    ...profile,
    memberships: [...profile.memberships],
    passport: profile.passport ? { ...profile.passport } : undefined,
  };
}

function cloneStats(stats: StatItem[]): StatItem[] {
  return stats.map((stat) => ({ ...stat }));
}

function cloneBookings(bookings: BookingItem[]): BookingItem[] {
  return bookings.map((booking) => ({
    ...booking,
    tags: [...booking.tags],
  }));
}

function cloneItinerary(itinerary: ItineraryItem[]): ItineraryItem[] {
  return itinerary.map((item) => ({
    ...item,
    activities: item.activities.map((activity) => ({ ...activity })),
    companions: item.companions.map((companion) => ({ ...companion })),
  }));
}

function cloneSupportItems(items: SupportItem[]): SupportItem[] {
  return items.map((item) => ({ ...item }));
}

const syncProfile = (target: UserProfile, source: UserProfile) => {
  target.email = source.email;
  target.memberships.splice(0, target.memberships.length, ...source.memberships);
  target.name = source.name;
  target.phone = source.phone;
  target.tier = source.tier;
  target.role = source.role;
  target.id = source.id;

  if (source.passport) {
    target.passport = { ...source.passport };
    return;
  }

  delete target.passport;
};

const syncStats = (target: StatItem[], source: StatItem[]) => {
  target.splice(0, target.length, ...source.map((stat) => ({ ...stat })));
};

const syncBookings = (target: BookingItem[], source: BookingItem[]) => {
  target.splice(
    0,
    target.length,
    ...source.map((booking) => ({
      ...booking,
      tags: [...booking.tags],
    })),
  );
};

const syncItinerary = (target: ItineraryItem[], source: ItineraryItem[]) => {
  target.splice(
    0,
    target.length,
    ...source.map((item) => ({
      ...item,
      activities: item.activities.map((activity) => ({ ...activity })),
      companions: item.companions.map((companion) => ({ ...companion })),
    })),
  );
};

const syncSupportItems = (target: SupportItem[], source: SupportItem[]) => {
  target.splice(0, target.length, ...source.map((item) => ({ ...item })));
};

const flattenSessionSource = (session: unknown): Record<string, unknown> => {
  const merged: Record<string, unknown> = {};
  const pushRecord = (value: unknown) => {
    if (isRecord(value)) {
      Object.assign(merged, value);
    }
  };

  pushRecord(session);
  if (isRecord(session)) {
    pushRecord(session.user);
    pushRecord(session.member);
    pushRecord(session.profile);
    pushRecord(session.data);
    pushRecord(session.session);
  }

  return merged;
};

const normalizeProfile = (source: Record<string, unknown>, fallback: UserProfile): UserProfile => {
  const memberships = normalizeMemberships(source.memberships, source.tier ?? source.role);
  const passport = normalizePassport(source.passport);
  const tier = toText(source.tier) ?? toText(source.role) ?? memberships[0];
  const id = toText(source.id) ?? toText(source.memberId) ?? toText(source.userId);
  const displayName =
    toText(source.name) ??
    toText(source.displayName) ??
    toText(source.fullName) ??
    toText(source.nickname) ??
    toText(source.id) ??
    toText(source.memberId) ??
    toText(source.userId) ??
    fallback.name;

  return {
    email: toText(source.email) ?? deriveSessionEmail(source, id, displayName) ?? fallback.email,
    id: id ?? fallback.id,
    memberships,
    name: displayName,
    passport,
    phone: toText(source.phone) ?? toText(source.mobile) ?? "미등록",
    role: toText(source.role),
    tier,
  };
};

const normalizeMemberships = (
  memberships: unknown,
  tier: unknown,
): string[] => {
  const nextMemberships = Array.isArray(memberships)
    ? memberships.map((item) => toText(item)).filter((item): item is string => Boolean(item))
    : [];

  if (nextMemberships.length > 0) {
    return nextMemberships;
  }

  const tierValue = toText(tier);
  if (tierValue) {
    return [tierValue];
  }

  return [];
};

const normalizePassport = (passport: unknown): PassportInfo | undefined => {
  const nextPassport = isRecord(passport) ? passport : null;
  if (!nextPassport) {
    return undefined;
  }

  const normalized: PassportInfo = {
    expiryDate: toText(nextPassport?.expiryDate) ?? "",
    issuingCountry: toText(nextPassport?.issuingCountry) ?? "",
    number: toText(nextPassport?.number) ?? "",
  };

  if (!normalized.expiryDate && !normalized.issuingCountry && !normalized.number) {
    return undefined;
  }

  return normalized;
};

const normalizeStats = (source: unknown, fallback: StatItem[]): StatItem[] => {
  if (Array.isArray(source) && source.length > 0) {
    return fallback.map((stat, index) => normalizeStatItem(source[index], stat, true));
  }

  if (Array.isArray(source) && source.length === 0) {
    return [];
  }

  if (isRecord(source)) {
    return buildSummaryStats(source, fallback);
  }

  return [];
};

const normalizeStatItem = (item: unknown, fallback: StatItem, hasSession = false): StatItem => {
  const record = isRecord(item) ? item : {};
  const tone = isStatTone(record.tone) ? record.tone : fallback.tone;
  const label = toText(record.label) ?? fallback.label;
  const valueSource = record.value ?? fallback.value;

  return {
    label,
    tone,
    value: hasSession ? formatSummaryValue(valueSource, { ...fallback, value: "" }) : formatSummaryValue(valueSource, fallback),
  };
};

const formatSummaryValue = (value: unknown, fallback: StatItem): string => {
  const text = toText(value);
  if (!text) {
    return fallback.value;
  }

  if (!/^\d+(?:\.\d+)?$/.test(text)) {
    return text;
  }

  const numeric = Number(text);
  if (!Number.isFinite(numeric)) {
    return text;
  }

  const formatted = numeric.toLocaleString("ko-KR");
  switch (fallback.tone) {
    case "coupon":
      return `${formatted}장`;
    case "point":
      return `${formatted}P`;
    case "air":
      return `${formatted}건`;
    default:
      return text;
  }
};

const normalizeBookings = (bookings: unknown, fallback: BookingItem[]): BookingItem[] => {
  if (!Array.isArray(bookings)) {
    return [];
  }

  if (bookings.length === 0) {
    return [];
  }

  return bookings.map((item, index) => normalizeBookingItem(item, fallback[index % fallback.length] ?? fallback[0], true));
};

const normalizeItinerary = (itinerary: unknown, fallback: ItineraryItem[]): ItineraryItem[] => {
  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    return cloneItinerary(fallback);
  }

  return itinerary.map((item, index) => normalizeItineraryItem(item, fallback[index % fallback.length] ?? fallback[0]));
};

const normalizeSupportItems = (items: unknown, fallback: SupportItem[]): SupportItem[] => {
  if (!Array.isArray(items) || items.length === 0) {
    return cloneSupportItems(fallback);
  }

  return items.map((item, index) => normalizeSupportItem(item, fallback[index % fallback.length] ?? fallback[0]));
};

const buildSummaryStats = (source: Record<string, unknown>, fallback: StatItem[]): StatItem[] => {
  return fallback.map((stat) => {
    const summaryValue = pickSummaryValue(source, summaryKeysByTone(stat.tone));
    if (summaryValue === undefined) {
      return { ...stat };
    }

    return {
      ...stat,
      value: formatSummaryValue(summaryValue, stat),
    };
  });
};

const deriveSessionEmail = (source: Record<string, unknown>, id: string | undefined, displayName: string): string | undefined => {
  const localPart =
    id ??
    toText(source.memberId) ??
    toText(source.userId) ??
    toText(source.username) ??
    toText(source.loginId) ??
    slugifyEmailLocalPart(displayName);

  if (!localPart) {
    return undefined;
  }

  return `${localPart}@jejugroup.example`;
};

const slugifyEmailLocalPart = (value: string): string | undefined => {
  const normalized = value.trim().toLowerCase().replace(/[^a-z0-9]+/g, ".");
  const trimmed = normalized.replace(/^\.+|\.+$/g, "");
  return trimmed.length > 0 ? trimmed : undefined;
};

const hasSessionPayload = (source: Record<string, unknown>): boolean => {
  const meaningfulKeys = [
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
    "data",
  ];

  return meaningfulKeys.some((key) => key in source);
};

const normalizeBookingItem = (item: unknown, fallback: BookingItem, hasSession = false): BookingItem => {
  const record = isRecord(item) ? item : {};
  const tags = Array.isArray(record.tags)
    ? record.tags.map((tag) => toText(tag)).filter((tag): tag is string => Boolean(tag))
    : [];
  const type = isBookingType(record.type) ? record.type : fallback.type;

  return {
    amount: toText(record.amount) ?? (hasSession ? "" : fallback.amount),
    date: toText(record.date) ?? (hasSession ? "" : fallback.date),
    duration: toText(record.duration) ?? (hasSession ? undefined : fallback.duration),
    id: toText(record.id) ?? (hasSession ? "" : fallback.id),
    paymentMethod: toText(record.paymentMethod) ?? (hasSession ? undefined : fallback.paymentMethod),
    status: toText(record.status) ?? (hasSession ? "" : fallback.status),
    tags: tags.length > 0 ? tags : hasSession ? [] : [...fallback.tags],
    title: toText(record.title) ?? (hasSession ? "" : fallback.title),
    type,
    voucherUrl: toText(record.voucherUrl) ?? (hasSession ? undefined : fallback.voucherUrl),
  };
};

const normalizeItineraryItem = (item: unknown, fallback: ItineraryItem): ItineraryItem => {
  const record = isRecord(item) ? item : {};
  const activities = Array.isArray(record.activities)
    ? record.activities.map((activity, index) =>
        normalizeItineraryActivity(activity, fallback.activities[index % fallback.activities.length] ?? fallback.activities[0]),
      )
    : fallback.activities.map((activity) => ({ ...activity }));
  const companions = Array.isArray(record.companions)
    ? record.companions.map((companion, index) =>
        normalizeItineraryCompanion(companion, fallback.companions[index % fallback.companions.length] ?? fallback.companions[0]),
      )
    : fallback.companions.map((companion) => ({ ...companion }));

  return {
    activities,
    companions,
    date: toText(record.date) ?? fallback.date,
    googleMapUrl: toText(record.googleMapUrl) ?? fallback.googleMapUrl,
    id: toText(record.id) ?? fallback.id,
    time: toText(record.time) ?? fallback.time,
    title: toText(record.title) ?? fallback.title,
  };
};

const normalizeItineraryActivity = (activity: unknown, fallback: ItineraryItem["activities"][number]) => {
  const record = isRecord(activity) ? activity : {};

  return {
    checked: typeof record.checked === "boolean" ? record.checked : fallback.checked,
    id: toText(record.id) ?? fallback.id,
    label: toText(record.label) ?? fallback.label,
  };
};

const normalizeItineraryCompanion = (companion: unknown, fallback: ItineraryItem["companions"][number]) => {
  const record = isRecord(companion) ? companion : {};

  return {
    id: toText(record.id) ?? fallback.id,
    isMember: typeof record.isMember === "boolean" ? record.isMember : fallback.isMember,
    name: toText(record.name) ?? fallback.name,
  };
};

const normalizeSupportItem = (item: unknown, fallback: SupportItem): SupportItem => {
  const record = isRecord(item) ? item : {};

  return {
    count: normalizeSupportCount(record.count, fallback.count),
    href: toText(record.href) ?? fallback.href,
    id: toText(record.id) ?? fallback.id,
    label: toText(record.label) ?? fallback.label,
  };
};

const normalizeSupportCount = (value: unknown, fallback: SupportItem["count"]) => {
  if (value === null) {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const text = toText(value);
  if (!text) {
    return fallback;
  }

  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const summaryKeysByTone = (tone: StatItem["tone"]): string[] => {
  switch (tone) {
    case "point":
      return ["point", "points", "mileage", "balance"];
    case "coupon":
      return ["coupon", "coupons", "couponCount", "voucherCount"];
    case "air":
      return ["upcomingTrips", "tripCount", "trips", "bookingCount", "bookings", "reservations", "reservationCount"];
    default:
      return [];
  }
};

const pickSummaryValue = (source: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    if (key in source) {
      const value = source[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          return value.length;
        }

        return value;
      }
    }
  }

  return undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const toText = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return undefined;
};

const isBookingType = (value: unknown): value is BookingType =>
  value === "air" || value === "rent" || value === "stay" || value === "voucher";

const isStatTone = (value: unknown): value is StatItem["tone"] =>
  value === "air" || value === "coupon" || value === "point" || value === "rent" || value === "stay" || value === "voucher" || value === "wallet";
