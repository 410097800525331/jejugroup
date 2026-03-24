import { ServiceType } from "@/types/service-center";

export interface InquiryType {
  value: string;
  label: string;
}

export const INQUIRY_TYPES: Record<ServiceType, InquiryType[]> = {
  "common": [
    { value: "general", label: "예약/이용" },
    { value: "cancel-refund", label: "취소/환불" },
    { value: "account", label: "회원/로그인" },
    { value: "partnership", label: "제휴/사업 제안" },
    { value: "other", label: "기타" },
  ],
  "jeju-air": [
    { value: "reservation", label: "예약" },
    { value: "cancel", label: "취소" },
    { value: "refund", label: "환불" },
    { value: "baggage", label: "수하물" },
    { value: "checkin", label: "체크인/탑승" },
    { value: "point", label: "리프레시 포인트" },
    { value: "other", label: "기타" },
  ],
  "jeju-stay": [
    { value: "booking", label: "예약" },
    { value: "cancel", label: "취소" },
    { value: "refund", label: "환불" },
    { value: "checkin", label: "체크인/이용" },
    { value: "facility", label: "객실/부대시설" },
    { value: "other", label: "기타" },
  ],
  "jeju-rental": [
    { value: "car-booking", label: "예약" },
    { value: "cancel", label: "취소" },
    { value: "refund", label: "환불" },
    { value: "insurance", label: "보험/면책" },
    { value: "pickup", label: "인수/반납" },
    { value: "other", label: "기타" },
  ],
};

export const SERVICE_OPTIONS = [
  { value: "common", label: "공통" },
  { value: "jeju-air", label: "제주항공" },
  { value: "jeju-stay", label: "제주스테이" },
  { value: "jeju-rental", label: "제주렌터카" },
];
