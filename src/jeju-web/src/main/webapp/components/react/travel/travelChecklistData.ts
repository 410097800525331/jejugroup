export interface TravelChecklistSection {
  description: string;
  icon: "document" | "device" | "luggage" | "health";
  id: string;
  items: readonly {
    id: string;
    label: string;
    note?: string;
  }[];
  title: string;
}

export const TRAVEL_CHECKLIST_SECTIONS: readonly TravelChecklistSection[] = [
  {
    id: "documents",
    icon: "document",
    title: "필수 서류와 결제",
    description: "출국 전 마지막으로 확인해야 하는 기본 세트",
    items: [
      { id: "passport", label: "여권 만료일 확인", note: "출국일 기준 6개월 이상 남았는지 확인" },
      { id: "visa", label: "비자 또는 전자입국 서류 준비" },
      { id: "booking", label: "항공권과 숙소 예약 확인서 저장" },
      { id: "insurance", label: "여행자 보험 가입 내역 저장" },
      { id: "payment", label: "현지 결제 카드와 비상용 현금 준비" },
    ],
  },
  {
    id: "devices",
    icon: "device",
    title: "스마트폰과 통신",
    description: "도착 직후 길을 잃지 않게 만드는 생존 장비",
    items: [
      { id: "esim", label: "eSIM 또는 로밍 설정 확인" },
      { id: "charger", label: "충전기와 케이블 챙기기" },
      { id: "battery", label: "보조 배터리 완충하기" },
      { id: "maps", label: "오프라인 지도 저장" },
      { id: "translator", label: "번역 앱과 현지 교통 앱 설치" },
    ],
  },
  {
    id: "luggage",
    icon: "luggage",
    title: "짐과 개인 물품",
    description: "현지에서 다시 사기 귀찮은 것들 위주",
    items: [
      { id: "clothes", label: "날씨에 맞는 옷과 얇은 겉옷 준비" },
      { id: "toiletries", label: "세면도구와 상비약 챙기기" },
      { id: "sleep", label: "목베개와 안대 같은 이동용 소품 챙기기" },
      { id: "sun", label: "선크림과 모자 준비" },
      { id: "laundry", label: "압축팩과 세탁 파우치 정리" },
    ],
  },
  {
    id: "wellness",
    icon: "health",
    title: "도착 직후 루틴",
    description: "첫날 컨디션과 동선을 망치지 않게 만드는 체크",
    items: [
      { id: "arrival", label: "공항에서 숙소까지 이동 경로 캡처" },
      { id: "checkin", label: "체크인 시간과 프런트 운영 시간 확인" },
      { id: "emergency", label: "현지 비상 연락처 저장" },
      { id: "schedule", label: "첫날 일정은 느슨하게 비워두기" },
      { id: "rest", label: "도착 후 바로 쉴 수 있는 간단한 식사 계획 세우기" },
    ],
  },
] as const;
