import { Button } from "@/components/ui/button";
import { Plane, Home as HomeIcon, Car, ChevronLeft, Plus, Minus } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

/**
 * FAQ 페이지
 * 기존 헤더/푸터를 고려한 디자인
 */
export default function FAQs() {
  const [activeService, setActiveService] = useState("all");
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // FAQ 데이터 - 각 서비스별 25개씩 (총 75개)
  const allFaqs = [
    // 제주항공 FAQ (25개)
    {
      id: 1,
      service: "jeju-air",
      category: "예약 및 변경",
      question: "제주항공 항공권 예약 후 취소는 어떻게 하나요?",
      answer: "제주항공 웹사이트 또는 모바일 앱에서 '예약 조회'를 통해 예약 번호와 이메일을 입력하여 취소할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 2,
      service: "jeju-air",
      category: "수하물",
      question: "제주항공 수하물 규정은 어떻게 되나요?",
      answer: "기본 수하물 1개(10kg)가 포함되며, 추가 수하물은 유료입니다. 자세한 내용은 고객센터에 문의하세요.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 3,
      service: "jeju-air",
      category: "마일리지",
      question: "제주항공 마일리지는 어떻게 적립하나요?",
      answer: "항공권 구매 시 자동으로 마일리지가 적립됩니다. 적립률은 항공권 종류에 따라 다릅니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 4,
      service: "jeju-air",
      category: "좌석",
      question: "제주항공 좌석 선택은 언제 가능한가요?",
      answer: "예약 완료 후 24시간 이내에 좌석을 선택할 수 있습니다. 추가 요금이 발생할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 5,
      service: "jeju-air",
      category: "탑승",
      question: "제주항공 탑승 수속은 언제부터 가능한가요?",
      answer: "출발 시간 2시간 전부터 탑승 수속을 시작하며, 30분 전에 마감됩니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 6,
      service: "jeju-air",
      category: "특수 탑승",
      question: "제주항공 유아 탑승 정책은 어떻게 되나요?",
      answer: "생후 14일 이상의 유아부터 탑승 가능하며, 성인 1명당 유아 1명만 동반할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 7,
      service: "jeju-air",
      category: "특수 탑승",
      question: "제주항공 반려동물 탑승은 가능한가요?",
      answer: "반려동물은 특별한 허가 절차를 거쳐야 하며, 사전에 고객센터에 문의해야 합니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 8,
      service: "jeju-air",
      category: "특수 서비스",
      question: "제주항공 휠체어 탑승 서비스는 어떻게 되나요?",
      answer: "휠체어 탑승 서비스를 제공하며, 사전 예약이 필요합니다. 고객센터에 문의하세요.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 9,
      service: "jeju-air",
      category: "기내 서비스",
      question: "제주항공 기내식은 제공되나요?",
      answer: "국제선의 경우 기내식이 제공되며, 국내선은 음료 및 간식만 제공됩니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 10,
      service: "jeju-air",
      category: "예약 및 변경",
      question: "제주항공 좌석 변경은 가능한가요?",
      answer: "탑승 전까지 좌석 변경이 가능하며, 추가 요금이 발생할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 11,
      service: "jeju-air",
      category: "환불 및 보상",
      question: "제주항공 환불 정책은 어떻게 되나요?",
      answer: "항공권 종류에 따라 환불 정책이 다릅니다. 상세 내용은 구매 시 확인하세요.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 12,
      service: "jeju-air",
      category: "예약 및 변경",
      question: "제주항공 예약 변경은 가능한가요?",
      answer: "출발 24시간 전까지 예약 변경이 가능하며, 추가 요금이 발생할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 13,
      service: "jeju-air",
      category: "탑승권",
      question: "제주항공 탑승권은 어떻게 받나요?",
      answer: "웹 체크인 또는 공항 체크인을 통해 탑승권을 받을 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 14,
      service: "jeju-air",
      category: "체크인",
      question: "제주항공 웹 체크인은 언제부터 가능한가요?",
      answer: "출발 24시간 전부터 웹 체크인이 가능합니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 15,
      service: "jeju-air",
      category: "특수 서비스",
      question: "제주항공 특별 서비스 요청은 어떻게 하나요?",
      answer: "예약 시 또는 고객센터를 통해 특별 서비스를 요청할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 16,
      service: "jeju-air",
      category: "마일리지",
      question: "제주항공 마일리지 사용은 어떻게 하나요?",
      answer: "웹사이트 또는 모바일 앱에서 마일리지로 항공권을 구매할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 17,
      service: "jeju-air",
      category: "마일리지",
      question: "제주항공 마일리지 유효기간은 얼마나 되나요?",
      answer: "마일리지는 마지막 사용일로부터 3년간 유효합니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 18,
      service: "jeju-air",
      category: "수하물",
      question: "제주항공 수하물 추가 구매는 가능한가요?",
      answer: "예약 시 또는 탑승 전에 추가 수하물을 구매할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 19,
      service: "jeju-air",
      category: "수하물",
      question: "제주항공 초과 수하물 요금은 얼마나 되나요?",
      answer: "초과 수하물 요금은 무게와 크기에 따라 다르니 고객센터에 문의하세요.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 20,
      service: "jeju-air",
      category: "규정",
      question: "제주항공 위험물 탑승 규정은 어떻게 되나요?",
      answer: "위험물은 탑승이 금지되며, 자세한 내용은 고객센터에 문의하세요.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 21,
      service: "jeju-air",
      category: "선물",
      question: "제주항공 항공권 선물은 가능한가요?",
      answer: "항공권 선물이 가능하며, 웹사이트에서 선물 옵션을 선택할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 22,
      service: "jeju-air",
      category: "단체 예약",
      question: "제주항공 단체 예약은 어떻게 하나요?",
      answer: "10명 이상의 단체 예약은 고객센터에 문의하여 진행할 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 23,
      service: "jeju-air",
      category: "분실",
      question: "제주항공 항공권 분실 시 어떻게 하나요?",
      answer: "분실한 항공권은 고객센터에 문의하여 재발급받을 수 있습니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 24,
      service: "jeju-air",
      category: "환불 및 보상",
      question: "제주항공 지연 또는 취소 시 보상은 어떻게 되나요?",
      answer: "항공편 지연이나 취소 시 규정에 따라 보상이 제공됩니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 25,
      service: "jeju-air",
      category: "고객센터",
      question: "제주항공 고객센터 운영 시간은 어떻게 되나요?",
      answer: "제주항공 고객센터는 24시간 운영되며, 전화 1661-1114로 문의 가능합니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },

    // 제주스테이 FAQ (25개)
    {
      id: 26,
      service: "jeju-stay",
      category: "환불 정책",
      question: "제주스테이 숙소 예약 후 환불 정책은?",
      answer: "각 숙소마다 다른 환불 정책이 있으니 예약 시 확인해주세요.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 27,
      service: "jeju-stay",
      category: "예약 변경",
      question: "제주스테이 예약 변경은 가능한가요?",
      answer: "체크인 7일 전까지 예약 변경이 가능합니다. 추가 요금이 발생할 수 있습니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 28,
      service: "jeju-stay",
      category: "체크인",
      question: "제주스테이 체크인 시간은 몇 시인가요?",
      answer: "일반적으로 오후 3시부터 체크인이 가능하며, 숙소마다 다를 수 있습니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 29,
      service: "jeju-stay",
      category: "체크아웃",
      question: "제주스테이 체크아웃 시간은 몇 시인가요?",
      answer: "일반적으로 오전 11시까지 체크아웃해야 하며, 숙소마다 다를 수 있습니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 30,
      service: "jeju-stay",
      category: "체크인",
      question: "제주스테이 조기 체크인은 가능한가요?",
      answer: "조기 체크인은 숙소 상황에 따라 가능할 수 있으니 사전에 문의하세요.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 31,
      service: "jeju-stay",
      category: "체크아웃",
      question: "제주스테이 늦은 체크아웃은 가능한가요?",
      answer: "늦은 체크아웃은 추가 요금이 발생하며, 사전에 문의해야 합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 32,
      service: "jeju-stay",
      category: "반려동물",
      question: "제주스테이 반려동물 동반은 가능한가요?",
      answer: "반려동물 동반 가능 여부는 숙소마다 다르니 예약 시 확인하세요.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 33,
      service: "jeju-stay",
      category: "유아",
      question: "제주스테이 유아 동반은 가능한가요?",
      answer: "대부분의 숙소에서 유아 동반이 가능하며, 유아용 침구는 사전에 요청하세요.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 34,
      service: "jeju-stay",
      category: "요금",
      question: "제주스테이 아이 동반 시 추가 요금이 있나요?",
      answer: "아이 동반 시 추가 요금 정책은 숙소마다 다릅니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 35,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 와이파이는 제공되나요?",
      answer: "대부분의 숙소에서 무료 와이파이를 제공합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 36,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 에어컨은 있나요?",
      answer: "대부분의 숙소에서 에어컨을 제공하며, 숙소마다 다를 수 있습니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 37,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 난방은 어떻게 되나요?",
      answer: "대부분의 숙소에서 난방을 제공하며, 계절에 따라 다릅니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 38,
      service: "jeju-stay",
      category: "조식",
      question: "제주스테이 조식은 제공되나요?",
      answer: "조식 제공 여부는 숙소마다 다르니 예약 시 확인하세요.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 39,
      service: "jeju-stay",
      category: "주차",
      question: "제주스테이 주차장은 있나요?",
      answer: "대부분의 숙소에서 주차장을 제공하며, 유료일 수 있습니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 40,
      service: "jeju-stay",
      category: "서비스",
      question: "제주스테이 짐 보관은 가능한가요?",
      answer: "대부분의 숙소에서 짐 보관 서비스를 제공합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 41,
      service: "jeju-stay",
      category: "서비스",
      question: "제주스테이 세탁 서비스는 있나요?",
      answer: "세탁 서비스 제공 여부는 숙소마다 다릅니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 42,
      service: "jeju-stay",
      category: "청소",
      question: "제주스테이 객실 청소는 매일 되나요?",
      answer: "객실 청소 주기는 숙소마다 다르니 사전에 확인하세요.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 43,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 욕실은 어떻게 되나요?",
      answer: "대부분의 숙소에서 개인 욕실을 제공합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 44,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 TV는 있나요?",
      answer: "대부분의 숙소에서 TV를 제공합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 45,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 냉장고는 있나요?",
      answer: "대부분의 숙소에서 냉장고를 제공합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 46,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 에스프레소 머신은 있나요?",
      answer: "일부 숙소에서 에스프레소 머신을 제공합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 47,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 미니바는 있나요?",
      answer: "일부 숙소에서 미니바를 제공합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 48,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 헤어드라이기는 있나요?",
      answer: "대부분의 숙소에서 헤어드라이기를 제공합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 49,
      service: "jeju-stay",
      category: "편의시설",
      question: "제주스테이 객실 내 욕가운은 있나요?",
      answer: "일부 숙소에서 욕가운을 제공합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 50,
      service: "jeju-stay",
      category: "고객센터",
      question: "제주스테이 고객센터 운영 시간은 어떻게 되나요?",
      answer: "제주스테이 고객센터는 09:00 ~ 22:00에 운영되며, 전화 1661-2222로 문의 가능합니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },

    // 제주렌터카 FAQ (25개)
    {
      id: 51,
      service: "jeju-rental",
      category: "렌탈 기간",
      question: "제주렌터카 최소 렌탈 기간은 얼마나 되나요?",
      answer: "최소 렌탈 기간은 1일이며, 3일 이상 렌탈 시 추가 할인이 적용됩니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 52,
      service: "jeju-rental",
      category: "예약 취소",
      question: "제주렌터카 예약 취소는 어떻게 하나요?",
      answer: "렌탈 날짜 7일 전까지 취소 가능하며, 이후 취소 수수료가 발생합니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 53,
      service: "jeju-rental",
      category: "예약 변경",
      question: "제주렌터카 예약 변경은 가능한가요?",
      answer: "렌탈 날짜 7일 전까지 예약 변경이 가능합니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 54,
      service: "jeju-rental",
      category: "보험",
      question: "제주렌터카 보험은 필수인가요?",
      answer: "기본 보험(자차 보험)이 포함되어 있으며, 추가 보험은 선택사항입니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 55,
      service: "jeju-rental",
      category: "운전자",
      question: "제주렌터카 운전자 나이 제한이 있나요?",
      answer: "만 21세 이상이어야 렌탈 가능하며, 국제 운전면허증이 필요합니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 56,
      service: "jeju-rental",
      category: "운전면허",
      question: "제주렌터카 운전면허증은 어떤 것이 필요한가요?",
      answer: "한국 운전면허증 또는 국제 운전면허증이 필요합니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 57,
      service: "jeju-rental",
      category: "결제",
      question: "제주렌터카 신용카드는 필수인가요?",
      answer: "신용카드가 필수이며, 보증금 결제에 사용됩니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 58,
      service: "jeju-rental",
      category: "픽업",
      question: "제주렌터카 픽업 시간은 언제인가요?",
      answer: "일반적으로 오전 8시부터 오후 8시까지 픽업이 가능합니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 59,
      service: "jeju-rental",
      category: "반납",
      question: "제주렌터카 반납 시간은 언제인가요?",
      answer: "일반적으로 오전 8시부터 오후 8시까지 반납이 가능합니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 60,
      service: "jeju-rental",
      category: "반납",
      question: "제주렌터카 늦은 반납 시 추가 요금이 있나요?",
      answer: "늦은 반납 시 시간당 추가 요금이 발생합니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 61,
      service: "jeju-rental",
      category: "픽업",
      question: "제주렌터카 공항 픽업 서비스는 있나요?",
      answer: "공항 픽업 서비스가 있으며, 추가 요금이 발생할 수 있습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 62,
      service: "jeju-rental",
      category: "픽업",
      question: "제주렌터카 호텔 픽업 서비스는 있나요?",
      answer: "호텔 픽업 서비스가 있으며, 추가 요금이 발생할 수 있습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 63,
      service: "jeju-rental",
      category: "차량",
      question: "제주렌터카 차량 종류는 어떻게 되나요?",
      answer: "경차, 준중형, 중형, SUV 등 다양한 차종을 제공합니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 64,
      service: "jeju-rental",
      category: "변속기",
      question: "제주렌터카 자동 변속기 차량은 있나요?",
      answer: "자동 변속기 차량이 있으며, 추가 요금이 발생할 수 있습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 65,
      service: "jeju-rental",
      category: "변속기",
      question: "제주렌터카 수동 변속기 차량은 있나요?",
      answer: "수동 변속기 차량도 제공되며, 차량 선택 시 확인하세요.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 66,
      service: "jeju-rental",
      category: "차량",
      question: "제주렌터카 전기차는 있나요?",
      answer: "환경 친화적인 전기차를 제공하며, 추가 요금이 발생할 수 있습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 67,
      service: "jeju-rental",
      category: "편의시설",
      question: "제주렌터카 차량 내 네비게이션은 있나요?",
      answer: "대부분의 차량에 네비게이션이 장착되어 있습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 68,
      service: "jeju-rental",
      category: "편의시설",
      question: "제주렌터카 차량 내 블랙박스는 있나요?",
      answer: "대부분의 차량에 블랙박스가 장착되어 있습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 69,
      service: "jeju-rental",
      category: "편의시설",
      question: "제주렌터카 차량 내 휴대폰 충전기는 있나요?",
      answer: "일부 차량에 휴대폰 충전기가 장착되어 있습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 70,
      service: "jeju-rental",
      category: "편의시설",
      question: "제주렌터카 차량 내 와이파이는 있나요?",
      answer: "일부 차량에 와이파이가 장착되어 있습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 71,
      service: "jeju-rental",
      category: "손상",
      question: "제주렌터카 차량 손상 시 어떻게 하나요?",
      answer: "차량 손상 시 보험에 따라 처리되며, 고객센터에 즉시 문의하세요.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 72,
      service: "jeju-rental",
      category: "위반",
      question: "제주렌터카 교통 위반 시 어떻게 하나요?",
      answer: "교통 위반 시 운전자가 책임지며, 고객센터에 문의하세요.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 73,
      service: "jeju-rental",
      category: "사고",
      question: "제주렌터카 사고 시 어떻게 하나요?",
      answer: "사고 발생 시 즉시 고객센터에 문의하고 경찰에 신고하세요.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 74,
      service: "jeju-rental",
      category: "고객센터",
      question: "제주렌터카 고객센터 운영 시간은 어떻게 되나요?",
      answer: "제주렌터카 고객센터는 08:00 ~ 20:00에 운영되며, 전화 1661-3333으로 문의 가능합니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 75,
      service: "jeju-rental",
      category: "연락처",
      question: "제주렌터카 연락처는 어디인가요?",
      answer: "제주렌터카 고객센터 전화번호는 1661-3333입니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
  ];

  // 필터링
  const filteredFaqs = allFaqs.filter((faq) => {
    return activeService === "all" || faq.service === activeService;
  });

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      "jeju-air": "제주항공",
      "jeju-stay": "제주스테이",
      "jeju-rental": "제주렌터카",
    };
    return labels[service] || "전체";
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* 메인 콘텐츠 */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* 페이지 헤더 */}
          <div className="mb-12">
            <Link href="/">
              <a className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-6">
                <ChevronLeft size={20} />
                돌아가기
              </a>
            </Link>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              자주 묻는 질문
            </h2>
            <p className="text-lg text-gray-600">
              궁금한 점들을 여기서 찾아보세요. 원하는 답변이 없다면 고객센터에 문의해주세요.
            </p>
          </div>

          {/* 필터 버튼 */}
          <div className="flex gap-3 mb-12 flex-wrap">
            {["all", "jeju-air", "jeju-stay", "jeju-rental"].map((service) => (
              <button
                key={service}
                onClick={() => setActiveService(service)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeService === service
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {service === "all"
                  ? "전체"
                  : getServiceLabel(service)}
              </button>
            ))}
          </div>

          {/* FAQ 리스트 */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const IconComponent = faq.icon;
              const isExpanded = expandedItems.includes(`faq-${faq.id}`);

              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(`faq-${faq.id}`)}
                    className="w-full p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${faq.color} flex items-center justify-center flex-shrink-0 mt-1`}
                    >
                      <IconComponent className="text-white" size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {getServiceLabel(faq.service)}
                        </span>
                        <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {faq.question}
                      </h3>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      {isExpanded ? (
                        <Minus className="text-orange-500" size={24} />
                      ) : (
                        <Plus className="text-gray-400" size={24} />
                      )}
                    </div>
                  </button>

                  {/* 답변 */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 빈 상태 */}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                검색 결과가 없습니다.
              </p>
            </div>
          )}

          {/* 추가 도움말 */}
          <div className="mt-16 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-8 border border-orange-200">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              원하는 답변을 찾지 못하셨나요?
            </h3>
            <p className="text-gray-700 mb-6">
              더 자세한 도움이 필요하신 경우 고객센터에 문의해주세요.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">
                제주항공 (1661-1114)
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white w-full">
                제주스테이 (1661-2222)
              </Button>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full">
                제주렌터카 (1661-3333)
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
