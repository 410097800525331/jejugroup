import { ServiceType } from "@/types/service-center";

export interface InquiryType {
  code: string;
  value: string;
  label: string;
}

const createInquiryType = (code: string, label: string): InquiryType => ({
  code,
  value: code,
  label,
});

const createServiceOption = (code: ServiceType, label: string) => ({
  code,
  value: code,
  label,
});

export const INQUIRY_TYPES: Record<ServiceType, InquiryType[]> = {
  common: [
    createInquiryType("general", "일반/내용"),
    createInquiryType("cancel-refund", "취소/환불"),
    createInquiryType("account", "회원/로그인"),
    createInquiryType("partnership", "제휴/사업 제안"),
    createInquiryType("other", "기타"),
  ],
  "jeju-air": [
    createInquiryType("reservation", "예약"),
    createInquiryType("cancel", "취소"),
    createInquiryType("refund", "환불"),
    createInquiryType("baggage", "수하물"),
    createInquiryType("checkin", "체크인/탑승"),
    createInquiryType("point", "리프레시 포인트"),
    createInquiryType("other", "기타"),
  ],
  "jeju-stay": [
    createInquiryType("booking", "예약"),
    createInquiryType("cancel", "취소"),
    createInquiryType("refund", "환불"),
    createInquiryType("checkin", "체크인/이용"),
    createInquiryType("facility", "객실/부대시설"),
    createInquiryType("other", "기타"),
  ],
  "jeju-rental": [
    createInquiryType("car-booking", "예약"),
    createInquiryType("cancel", "취소"),
    createInquiryType("refund", "환불"),
    createInquiryType("insurance", "보험/면책"),
    createInquiryType("pickup", "인수/반납"),
    createInquiryType("other", "기타"),
  ],
};

export const SERVICE_OPTIONS = [
  createServiceOption("common", "공통"),
  createServiceOption("jeju-air", "제주항공"),
  createServiceOption("jeju-stay", "제주스테이"),
  createServiceOption("jeju-rental", "제주렌터카"),
];
