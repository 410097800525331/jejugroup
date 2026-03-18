import { ServiceType } from "@/types/service-center";

export interface InquiryType {
  value: string;
  label: string;
}

export const INQUIRY_TYPES: Record<ServiceType, InquiryType[]> = {
  "common": [
    { value: "general", label: "일반 문의" },
    { value: "partnership", label: "제휴 및 사업 제안" },
    { value: "praise", label: "칭찬/제안" },
    { value: "complaint", label: "불만 접수" },
    { value: "other", label: "기타" },
  ],
  "jeju-air": [
    { value: "reservation", label: "예약/결제" },
    { value: "baggage", label: "수하물" },
    { value: "checkin", label: "체크인/탑승" },
    { value: "point", label: "리프레시 포인트" },
    { value: "other", label: "기타 문의" },
  ],
  "jeju-stay": [
    { value: "booking", label: "숙소 예약" },
    { value: "cancel", label: "취소/환불" },
    { value: "checkin", label: "숙소 이용 안내" },
    { value: "other", label: "기타 문의" },
  ],
  "jeju-rental": [
    { value: "car-booking", label: "차량 예약" },
    { value: "insurance", label: "보험/면책" },
    { value: "pickup", label: "인수/반납" },
    { value: "other", label: "기타 문의" },
  ],
};

export const SERVICE_OPTIONS = [
  { value: "common", label: "공통" },
  { value: "jeju-air", label: "제주항공" },
  { value: "jeju-stay", label: "제주스테이" },
  { value: "jeju-rental", label: "제주렌터카" },
];
