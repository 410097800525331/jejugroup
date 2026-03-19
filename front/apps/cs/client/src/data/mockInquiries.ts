import type { InquiryRecord } from "@/types/service-center";

export const MOCK_INQUIRIES: InquiryRecord[] = [
  {
    id: 1,
    title: "항공권 예약 변경 수수료 문의드립니다.",
    date: "2026.03.18",
    status: "completed",
    service: "jeju-air",
    content: "예약 변경 수수료 기준이 항공권 등급마다 다른지 확인 부탁드립니다.",
  },
  {
    id: 2,
    title: "호텔 체크인 시간 연장 가능한가요?",
    date: "2026.03.15",
    status: "pending",
    service: "jeju-stay",
    content: "저녁 비행기로 도착해서 체크인을 늦게 할 수 있는지 문의드립니다.",
  },
  {
    id: 3,
    title: "렌터카 면책 보험 범위 관련 문의",
    date: "2026.03.12",
    status: "completed",
    service: "jeju-rental",
    content: "단독 사고 발생 시 자차 면책 범위가 어디까지 적용되는지 궁금합니다.",
  },
  {
    id: 4,
    title: "리프레시 포인트 적립이 안 되어 있어요.",
    date: "2026.03.10",
    status: "completed",
    service: "jeju-air",
    content: "탑승 완료 후 포인트가 반영되지 않아 확인 요청드립니다.",
  },
  {
    id: 5,
    title: "단독 독채 펜션 예약 가능 여부 확인 부탁드립니다.",
    date: "2026.03.08",
    status: "pending",
    service: "jeju-stay",
    content: "가족 6인 기준 독채 펜션 예약 가능 여부와 추가 침구 제공 여부 문의입니다.",
  },
];
