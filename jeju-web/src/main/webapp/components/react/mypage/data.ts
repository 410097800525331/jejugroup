import type { BookingItem, ItineraryItem, StatItem, SupportItem, UserProfile } from "./types";

export const PROFILE: UserProfile = {
  email: "minji.hong@jejugroup.example",
  memberships: ["Jeju Air 리프레시 Silver", "Jeju Stay 프레스티지 Gold"],
  name: "홍민지",
  passport: {
    expiryDate: "2032.12.31",
    issuingCountry: "Republic of Korea",
    number: "M12345678",
  },
  phone: "010-1234-5678",
};

export const STATS: StatItem[] = [
  { label: "보유 포인트", tone: "point", value: "26,600P" },
  { label: "사용 가능한 쿠폰", tone: "coupon", value: "12장" },
  { label: "다가오는 여행", tone: "air", value: "3건" },
];

export const BOOKINGS: BookingItem[] = [
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
];

export const ITINERARY: ItineraryItem[] = [
  {
    activities: [
      { checked: true, id: "act-1", label: "호텔 체크인" },
      { checked: false, id: "act-2", label: "고기국수 맛집 방문" },
      { checked: false, id: "act-3", label: "함덕 해수욕장 산책" },
    ],
    companions: [
      { id: "comp-1", isMember: true, name: "박준영" },
      { id: "comp-2", isMember: true, name: "이지은" },
    ],
    date: "2026.10.15",
    googleMapUrl: "https://maps.google.com",
    id: "iti-1",
    time: "14:00",
    title: "제주도 첫날 도착 및 휴식",
  },
  {
    activities: [
      { checked: false, id: "act-4", label: "우도 잠수함 체험" },
      { checked: false, id: "act-5", label: "성산일출봉 등반" },
    ],
    companions: [{ id: "comp-1", isMember: true, name: "박준영" }],
    date: "2026.10.16",
    googleMapUrl: "https://maps.google.com",
    id: "iti-2",
    time: "10:30",
    title: "동부 해안 투어",
  },
];


export const SUPPORT_ITEMS: SupportItem[] = [
  { count: 1, href: "#", id: "qna", label: "1:1 문의 내역" },
  { count: 0, href: "#", id: "notice", label: "운항 및 예약 공지" },
  { count: null, href: "#", id: "faq", label: "자주 묻는 질문" },
];

