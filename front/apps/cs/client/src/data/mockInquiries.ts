import type { InquiryRecord } from "@/types/service-center";

export const MOCK_INQUIRIES: InquiryRecord[] = [
  {
    id: 1001,
    ticketId: 1001,
    service: "jeju-air",
    inquiryType: "reservation",
    name: "홍길동",
    email: "hong@example.com",
    phone: "010-1234-5678",
    title: "항공권 예약 변경 문의",
    content: "예약 변경 가능 여부와 수수료를 확인하고 싶어.",
    date: "2026.03.23",
    status: "pending",
  },
  {
    id: 1002,
    ticketId: 1002,
    service: "jeju-stay",
    inquiryType: "booking",
    name: "김제주",
    email: "stay@example.com",
    phone: "010-9876-5432",
    title: "숙박 예약 확인",
    content: "예약 확정 여부와 체크인 안내를 받고 싶어.",
    date: "2026.03.22",
    status: "completed",
    reply: "예약이 확정되었고 체크인은 15시부터 가능해.",
    repliedAt: "2026.03.22",
  },
];
