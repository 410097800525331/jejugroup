import type {
  BookingItem,
  BookingType,
  DashboardSnapshot,
  ItineraryItem,
  PassportInfo,
  StatItem,
  SupportItem,
  TravelEvent,
  UserProfile,
} from "./types";

const FALLBACK_PROFILE: UserProfile = {
  email: "minji.hong@jejugroup.example",
  id: "hong_minji",
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

const FALLBACK_LINKED_COMPANIONS = [
  { id: "park_jy", isMember: true, name: "박준영" },
  { id: "lee_je", isMember: true, name: "이지은" },
];

const FALLBACK_TRAVEL_EVENTS: TravelEvent[] = [
  {
    activityLabel: "제주항공 7C101 탑승 완료",
    date: "2026.10.15",
    dayId: "iti-0",
    googleMapUrl: "https://maps.google.com",
    id: "travel-air-used",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "used",
    time: "07:30",
    title: "제주행 비행기 탑승 및 출발",
    type: "air",
  },
  {
    activityLabel: "공항 유심 수령 예정",
    date: "2026.10.15",
    dayId: "iti-0",
    googleMapUrl: "https://maps.google.com",
    id: "travel-usim-reserved",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "reserved",
    time: "07:30",
    title: "제주행 비행기 탑승 및 출발",
    type: "voucher",
  },
  {
    activityLabel: "렌터카 픽업 완료",
    date: "2026.10.15",
    dayId: "iti-1",
    googleMapUrl: "https://maps.google.com",
    id: "travel-rent-used",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "used",
    time: "14:00",
    title: "제주도 첫날 도착 및 로컬 투어",
    type: "rent",
  },
  {
    activityLabel: "함덕 액티비티 바우처 사용 완료",
    date: "2026.10.15",
    dayId: "iti-1",
    googleMapUrl: "https://maps.google.com",
    id: "travel-activity-linked-used",
    ownerId: "park_jy",
    ownerName: "박준영",
    status: "used",
    time: "14:00",
    title: "제주도 첫날 도착 및 로컬 투어",
    type: "voucher",
  },
  {
    activityLabel: "우도 잠수함 체험 이용 예정",
    date: "2026.10.16",
    dayId: "iti-2",
    googleMapUrl: "https://maps.google.com",
    id: "travel-submarine-reserved",
    ownerId: "park_jy",
    ownerName: "박준영",
    status: "reserved",
    time: "10:30",
    title: "동부 해안 투어 및 성산 액티비티",
    type: "voucher",
  },
  {
    activityLabel: "성산 액티비티 바우처 미사용",
    date: "2026.10.16",
    dayId: "iti-2",
    googleMapUrl: "https://maps.google.com",
    id: "travel-activity-missed",
    ownerId: "lee_je",
    ownerName: "이지은",
    status: "missed",
    time: "10:30",
    title: "동부 해안 투어 및 성산 액티비티",
    type: "voucher",
  },
  {
    activityLabel: "서귀포 숙소 체크인 완료",
    date: "2026.10.17",
    dayId: "iti-3",
    googleMapUrl: "https://maps.google.com",
    id: "travel-stay-used",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "used",
    time: "18:00",
    title: "서귀포 밤 정취 느끼기",
    type: "stay",
  },
  {
    activityLabel: "야간 투어 바우처 취소됨",
    date: "2026.10.17",
    dayId: "iti-3",
    googleMapUrl: "https://maps.google.com",
    id: "travel-nighttour-cancelled",
    ownerId: "lee_je",
    ownerName: "이지은",
    status: "cancelled",
    time: "18:00",
    title: "서귀포 밤 정취 느끼기",
    type: "voucher",
  },
  {
    activityLabel: "제주항공 7C102 탑승 예정",
    date: "2026.10.18",
    dayId: "iti-4",
    googleMapUrl: "https://maps.google.com",
    id: "travel-return-reserved",
    ownerId: "hong_minji",
    ownerName: "홍민지",
    status: "reserved",
    time: "19:30",
    title: "서울/김포행 귀국 비행기 탑승",
    type: "air",
  },
];

function buildItineraryFromTravelEvents({
  currentAccountId,
  linkedCompanions,
  travelEvents,
}: {
  currentAccountId: string;
  linkedCompanions: typeof LINKED_COMPANIONS;
  travelEvents: TravelEvent[];
}): ItineraryItem[] {
  const linkedCompanionMap = new Map(linkedCompanions.map((companion) => [companion.id, companion]));
  const allowedOwnerIds = new Set([
    ...(currentAccountId ? [currentAccountId] : []),
    ...linkedCompanions.map((companion) => companion.id),
  ]);
  const grouped = new Map<
    string,
    {
      activities: ItineraryItem["activities"];
      companions: typeof LINKED_COMPANIONS;
      date: string;
      googleMapUrl: string;
      id: string;
      sortKey: string;
      time: string;
      title: string;
    }
  >();

  for (const event of travelEvents) {
    if (allowedOwnerIds.size > 0 && !allowedOwnerIds.has(event.ownerId)) {
      continue;
    }

    const existing = grouped.get(event.dayId);
    const nextActivity = {
      checked: event.status === "used",
      id: event.id,
      label: event.activityLabel,
      ownerId: event.ownerId,
      ownerName: event.ownerName,
      status: event.status,
      type: event.type,
    };

    if (existing) {
      existing.activities.push(nextActivity);
      if (event.ownerId !== currentAccountId && linkedCompanionMap.has(event.ownerId)) {
        const companion = linkedCompanionMap.get(event.ownerId);
        if (companion && !existing.companions.some((item) => item.id === companion.id)) {
          existing.companions.push({ ...companion });
        }
      }
      continue;
    }

    grouped.set(event.dayId, {
      activities: [nextActivity],
      companions:
        event.ownerId !== currentAccountId && linkedCompanionMap.has(event.ownerId)
          ? [{ ...(linkedCompanionMap.get(event.ownerId) as (typeof LINKED_COMPANIONS)[number]) }]
          : [],
      date: event.date,
      googleMapUrl: event.googleMapUrl,
      id: event.dayId,
      sortKey: `${event.date} ${event.time}`,
      time: event.time,
      title: event.title,
    });
  }

  return Array.from(grouped.values())
    .sort((left, right) => left.sortKey.localeCompare(right.sortKey))
    .map(({ sortKey: _sortKey, ...item }) => item);
}

export const PROFILE: UserProfile = cloneProfile(FALLBACK_PROFILE);
export const STATS: StatItem[] = cloneStats(FALLBACK_STATS);
export const BOOKINGS: BookingItem[] = cloneBookings(FALLBACK_BOOKINGS);
export const LINKED_COMPANIONS = cloneCompanions(FALLBACK_LINKED_COMPANIONS);
export const TRAVEL_EVENTS = cloneTravelEvents(FALLBACK_TRAVEL_EVENTS);
export const ITINERARY: ItineraryItem[] = buildItineraryFromTravelEvents({
  currentAccountId: FALLBACK_PROFILE.id ?? "",
  linkedCompanions: LINKED_COMPANIONS,
  travelEvents: TRAVEL_EVENTS,
});

export const SUPPORT_ITEMS: SupportItem[] = [
  { count: 1, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" },
];

export const createDashboardFallbackSnapshot = (): DashboardSnapshot => ({
  bookings: cloneBookings(FALLBACK_BOOKINGS),
  itinerary: cloneItinerary(ITINERARY),
  linkedCompanions: cloneCompanions(LINKED_COMPANIONS),
  profile: cloneProfile(FALLBACK_PROFILE),
  stats: cloneStats(FALLBACK_STATS),
  supportItems: cloneSupportItems(SUPPORT_ITEMS),
  travelEvents: cloneTravelEvents(TRAVEL_EVENTS),
});

export const normalizeDashboardSnapshot = (session: unknown): DashboardSnapshot => {
  const fallback = createDashboardFallbackSnapshot();
  const source = flattenSessionSource(session);
  const hasSession = hasSessionPayload(source);

  if (!hasSession) {
    return fallback;
  }

  const profile = normalizeProfile(source, fallback.profile);
  const linkedCompanions = normalizeLinkedCompanions(source.linkedCompanions, fallback.linkedCompanions);
  const travelEvents = normalizeTravelEvents(source.travelEvents, fallback.travelEvents);
  const itinerary =
    source.travelEvents !== undefined
      ? buildItineraryFromTravelEvents({
          currentAccountId: profile.id ?? fallback.profile.id ?? "",
          linkedCompanions,
          travelEvents,
        })
      : normalizeItinerary(source.itinerary, fallback.itinerary);

  return {
    bookings: normalizeBookings(source.bookings, fallback.bookings),
    itinerary,
    linkedCompanions,
    profile,
    stats: normalizeStats(source.stats ?? source, fallback.stats),
    supportItems: normalizeSupportItems(source.supportItems ?? source.support ?? source.inquiries, fallback.supportItems),
    travelEvents,
  };
};

export const applyDashboardSnapshot = (snapshot: DashboardSnapshot) => {
  syncProfile(PROFILE, snapshot.profile);
  syncStats(STATS, snapshot.stats);
  syncBookings(BOOKINGS, snapshot.bookings);
  syncItinerary(ITINERARY, snapshot.itinerary);
  syncCompanions(LINKED_COMPANIONS, snapshot.linkedCompanions);
  syncSupportItems(SUPPORT_ITEMS, snapshot.supportItems);
  syncTravelEvents(TRAVEL_EVENTS, snapshot.travelEvents);
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

function cloneCompanions(companions: Array<{ id: string; isMember: boolean; name: string }>) {
  return companions.map((companion) => ({ ...companion }));
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

function cloneTravelEvents(events: TravelEvent[]): TravelEvent[] {
  return events.map((event) => ({ ...event }));
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

const syncCompanions = (target: typeof LINKED_COMPANIONS, source: typeof LINKED_COMPANIONS) => {
  target.splice(0, target.length, ...source.map((companion) => ({ ...companion })));
};

const syncSupportItems = (target: SupportItem[], source: SupportItem[]) => {
  target.splice(0, target.length, ...source.map((item) => ({ ...item })));
};

const syncTravelEvents = (target: TravelEvent[], source: TravelEvent[]) => {
  target.splice(0, target.length, ...source.map((event) => ({ ...event })));
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

const normalizeLinkedCompanions = (companions: unknown, fallback: typeof LINKED_COMPANIONS) => {
  if (!Array.isArray(companions) || companions.length === 0) {
    return cloneCompanions(fallback);
  }

  return companions.map((companion, index) => normalizeLinkedCompanion(companion, fallback[index % fallback.length] ?? fallback[0]));
};

export const normalizeTravelEventsInput = (events: unknown): TravelEvent[] => {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  return events
    .map((event) => normalizeTravelEvent(event))
    .filter((event): event is TravelEvent => event !== null);
};

const normalizeTravelEvents = (events: unknown, fallback: TravelEvent[]) => {
  const normalized = normalizeTravelEventsInput(events);
  return normalized.length > 0 ? normalized : cloneTravelEvents(fallback);
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
    checked:
      typeof record.checked === "boolean"
        ? record.checked
        : isTravelEventStatus(record.status)
          ? record.status === "used"
          : fallback.checked,
    id: toText(record.id) ?? fallback.id,
    label: toText(record.label) ?? fallback.label,
    ownerId: toText(record.ownerId) ?? fallback.ownerId,
    ownerName: toText(record.ownerName) ?? fallback.ownerName,
    status: isTravelEventStatus(record.status) ? record.status : fallback.status,
    type: isBookingType(record.type) ? record.type : fallback.type,
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

const normalizeLinkedCompanion = (
  companion: unknown,
  fallback: (typeof LINKED_COMPANIONS)[number],
) => {
  const record = isRecord(companion) ? companion : {};

  return {
    id: toText(record.id) ?? fallback.id,
    isMember: typeof record.isMember === "boolean" ? record.isMember : fallback.isMember,
    name: toText(record.name) ?? fallback.name,
  };
};

const normalizeTravelEvent = (event: unknown): TravelEvent | null => {
  const record = isRecord(event) ? event : null;
  if (!record) {
    return null;
  }

  const id = toText(record.id);
  const dayId = toText(record.dayId);
  const title = toText(record.title);
  const date = toText(record.date);
  const time = toText(record.time);
  const activityLabel = toText(record.activityLabel);
  const ownerId = toText(record.ownerId);
  const ownerName = toText(record.ownerName);
  const googleMapUrl = toText(record.googleMapUrl);

  if (!id || !dayId || !title || !date || !time || !activityLabel || !ownerId || !ownerName || !googleMapUrl) {
    return null;
  }

  return {
    activityLabel,
    date,
    dayId,
    googleMapUrl,
    id,
    ownerId,
    ownerName,
    status: isTravelEventStatus(record.status) ? record.status : "reserved",
    time,
    title,
    type: isBookingType(record.type) ? record.type : "voucher",
  };
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

const isTravelEventStatus = (value: unknown): value is TravelEvent["status"] =>
  value === "reserved" || value === "used" || value === "cancelled" || value === "missed";

const isStatTone = (value: unknown): value is StatItem["tone"] =>
  value === "air" || value === "coupon" || value === "point" || value === "rent" || value === "stay" || value === "voucher" || value === "wallet";
