import { Button } from "@/components/ui/button";
import { Plane, Home as HomeIcon, Car, ChevronRight, Search, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

/**
 * 제주항공 통합 고객센터 - 메인 페이지
 * 기존 헤더/푸터를 고려한 디자인
 * 현대적이고 세련된 디자인으로 제주 여행의 즐거움을 표현
 */
export default function Home() {
  const [activeService, setActiveService] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 공지사항 데이터
  const notices = [
    {
      id: 1,
      service: "jeju-air",
      title: "2026년 2월 제주항공 신규 노선 운항 안내",
      date: "2026-02-27",
      excerpt: "서울 인천공항에서 방콕, 홍콩, 타이페이로 운항하는 신규 노선이 시작됩니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 2,
      service: "jeju-stay",
      title: "제주스테이 봄 시즌 특가 이벤트 시작",
      date: "2026-02-25",
      excerpt: "최대 40% 할인된 가격으로 제주의 아름다운 숙소를 예약하세요.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 3,
      service: "jeju-rental",
      title: "제주렌터카 예약 시스템 업그레이드 완료",
      date: "2026-02-23",
      excerpt: "더욱 편리해진 예약 시스템으로 차량 예약이 더 쉬워졌습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
  ];

  // FAQ 데이터 - 각 서비스별 25개씩
  const allFaqs = [
    // 제주항공 FAQ (25개)
    {
      id: 1,
      service: "jeju-air",
      question: "제주항공 항공권 예약 후 취소는 어떻게 하나요?",
      answer: "제주항공 웹사이트 또는 모바일 앱에서 '예약 조회'를 통해 예약 번호와 이메일을 입력하여 취소할 수 있습니다.",
    },
    {
      id: 2,
      service: "jeju-air",
      question: "제주항공 수하물 규정은 어떻게 되나요?",
      answer: "기본 수하물 1개(10kg)가 포함되며, 추가 수하물은 유료입니다. 자세한 내용은 고객센터에 문의하세요.",
    },
    {
      id: 3,
      service: "jeju-air",
      question: "제주항공 마일리지는 어떻게 적립하나요?",
      answer: "항공권 구매 시 자동으로 마일리지가 적립됩니다. 적립률은 항공권 종류에 따라 다릅니다.",
    },
    {
      id: 4,
      service: "jeju-air",
      question: "제주항공 좌석 선택은 언제 가능한가요?",
      answer: "예약 완료 후 24시간 이내에 좌석을 선택할 수 있습니다. 추가 요금이 발생할 수 있습니다.",
    },
    {
      id: 5,
      service: "jeju-air",
      question: "제주항공 탑승 수속은 언제부터 가능한가요?",
      answer: "출발 시간 2시간 전부터 탑승 수속을 시작하며, 30분 전에 마감됩니다.",
    },
    {
      id: 6,
      service: "jeju-air",
      question: "제주항공 유아 탑승 정책은 어떻게 되나요?",
      answer: "생후 14일 이상의 유아부터 탑승 가능하며, 성인 1명당 유아 1명만 동반할 수 있습니다.",
    },
    {
      id: 7,
      service: "jeju-air",
      question: "제주항공 반려동물 탑승은 가능한가요?",
      answer: "반려동물은 특별한 허가 절차를 거쳐야 하며, 사전에 고객센터에 문의해야 합니다.",
    },
    {
      id: 8,
      service: "jeju-air",
      question: "제주항공 휠체어 탑승 서비스는 어떻게 되나요?",
      answer: "휠체어 탑승 서비스를 제공하며, 사전 예약이 필요합니다. 고객센터에 문의하세요.",
    },
    {
      id: 9,
      service: "jeju-air",
      question: "제주항공 기내식은 제공되나요?",
      answer: "국제선의 경우 기내식이 제공되며, 국내선은 음료 및 간식만 제공됩니다.",
    },
    {
      id: 10,
      service: "jeju-air",
      question: "제주항공 좌석 변경은 가능한가요?",
      answer: "탑승 전까지 좌석 변경이 가능하며, 추가 요금이 발생할 수 있습니다.",
    },
    {
      id: 11,
      service: "jeju-air",
      question: "제주항공 환불 정책은 어떻게 되나요?",
      answer: "항공권 종류에 따라 환불 정책이 다릅니다. 상세 내용은 구매 시 확인하세요.",
    },
    {
      id: 12,
      service: "jeju-air",
      question: "제주항공 예약 변경은 가능한가요?",
      answer: "출발 24시간 전까지 예약 변경이 가능하며, 추가 요금이 발생할 수 있습니다.",
    },
    {
      id: 13,
      service: "jeju-air",
      question: "제주항공 탑승권은 어떻게 받나요?",
      answer: "웹 체크인 또는 공항 체크인을 통해 탑승권을 받을 수 있습니다.",
    },
    {
      id: 14,
      service: "jeju-air",
      question: "제주항공 웹 체크인은 언제부터 가능한가요?",
      answer: "출발 24시간 전부터 웹 체크인이 가능합니다.",
    },
    {
      id: 15,
      service: "jeju-air",
      question: "제주항공 특별 서비스 요청은 어떻게 하나요?",
      answer: "예약 시 또는 고객센터를 통해 특별 서비스를 요청할 수 있습니다.",
    },
    {
      id: 16,
      service: "jeju-air",
      question: "제주항공 마일리지 사용은 어떻게 하나요?",
      answer: "웹사이트 또는 모바일 앱에서 마일리지로 항공권을 구매할 수 있습니다.",
    },
    {
      id: 17,
      service: "jeju-air",
      question: "제주항공 마일리지 유효기간은 얼마나 되나요?",
      answer: "마일리지는 마지막 사용일로부터 3년간 유효합니다.",
    },
    {
      id: 18,
      service: "jeju-air",
      question: "제주항공 수하물 추가 구매는 가능한가요?",
      answer: "예약 시 또는 탑승 전에 추가 수하물을 구매할 수 있습니다.",
    },
    {
      id: 19,
      service: "jeju-air",
      question: "제주항공 초과 수하물 요금은 얼마나 되나요?",
      answer: "초과 수하물 요금은 무게와 크기에 따라 다르니 고객센터에 문의하세요.",
    },
    {
      id: 20,
      service: "jeju-air",
      question: "제주항공 위험물 탑승 규정은 어떻게 되나요?",
      answer: "위험물은 탑승이 금지되며, 자세한 내용은 고객센터에 문의하세요.",
    },
    {
      id: 21,
      service: "jeju-air",
      question: "제주항공 항공권 선물은 가능한가요?",
      answer: "항공권 선물이 가능하며, 웹사이트에서 선물 옵션을 선택할 수 있습니다.",
    },
    {
      id: 22,
      service: "jeju-air",
      question: "제주항공 단체 예약은 어떻게 하나요?",
      answer: "10명 이상의 단체 예약은 고객센터에 문의하여 진행할 수 있습니다.",
    },
    {
      id: 23,
      service: "jeju-air",
      question: "제주항공 항공권 분실 시 어떻게 하나요?",
      answer: "분실한 항공권은 고객센터에 문의하여 재발급받을 수 있습니다.",
    },
    {
      id: 24,
      service: "jeju-air",
      question: "제주항공 지연 또는 취소 시 보상은 어떻게 되나요?",
      answer: "항공편 지연이나 취소 시 규정에 따라 보상이 제공됩니다.",
    },
    {
      id: 25,
      service: "jeju-air",
      question: "제주항공 고객센터 운영 시간은 어떻게 되나요?",
      answer: "제주항공 고객센터는 24시간 운영되며, 전화 1661-1114로 문의 가능합니다.",
    },

    // 제주스테이 FAQ (25개)
    {
      id: 26,
      service: "jeju-stay",
      question: "제주스테이 숙소 예약 후 환불 정책은?",
      answer: "각 숙소마다 다른 환불 정책이 있으니 예약 시 확인해주세요.",
    },
    {
      id: 27,
      service: "jeju-stay",
      question: "제주스테이 예약 변경은 가능한가요?",
      answer: "체크인 7일 전까지 예약 변경이 가능합니다. 추가 요금이 발생할 수 있습니다.",
    },
    {
      id: 28,
      service: "jeju-stay",
      question: "제주스테이 체크인 시간은 몇 시인가요?",
      answer: "일반적으로 오후 3시부터 체크인이 가능하며, 숙소마다 다를 수 있습니다.",
    },
    {
      id: 29,
      service: "jeju-stay",
      question: "제주스테이 체크아웃 시간은 몇 시인가요?",
      answer: "일반적으로 오전 11시까지 체크아웃해야 하며, 숙소마다 다를 수 있습니다.",
    },
    {
      id: 30,
      service: "jeju-stay",
      question: "제주스테이 조기 체크인은 가능한가요?",
      answer: "조기 체크인은 숙소 상황에 따라 가능할 수 있으니 사전에 문의하세요.",
    },
    {
      id: 31,
      service: "jeju-stay",
      question: "제주스테이 늦은 체크아웃은 가능한가요?",
      answer: "늦은 체크아웃은 추가 요금이 발생하며, 사전에 문의해야 합니다.",
    },
    {
      id: 32,
      service: "jeju-stay",
      question: "제주스테이 반려동물 동반은 가능한가요?",
      answer: "반려동물 동반 가능 여부는 숙소마다 다르니 예약 시 확인하세요.",
    },
    {
      id: 33,
      service: "jeju-stay",
      question: "제주스테이 유아 동반은 가능한가요?",
      answer: "대부분의 숙소에서 유아 동반이 가능하며, 유아용 침구는 사전에 요청하세요.",
    },
    {
      id: 34,
      service: "jeju-stay",
      question: "제주스테이 아이 동반 시 추가 요금이 있나요?",
      answer: "아이 동반 시 추가 요금 정책은 숙소마다 다릅니다.",
    },
    {
      id: 35,
      service: "jeju-stay",
      question: "제주스테이 객실 내 와이파이는 제공되나요?",
      answer: "대부분의 숙소에서 무료 와이파이를 제공합니다.",
    },
    {
      id: 36,
      service: "jeju-stay",
      question: "제주스테이 객실 내 에어컨은 있나요?",
      answer: "대부분의 숙소에서 에어컨을 제공하며, 숙소마다 다를 수 있습니다.",
    },
    {
      id: 37,
      service: "jeju-stay",
      question: "제주스테이 객실 내 난방은 어떻게 되나요?",
      answer: "대부분의 숙소에서 난방을 제공하며, 계절에 따라 다릅니다.",
    },
    {
      id: 38,
      service: "jeju-stay",
      question: "제주스테이 조식은 제공되나요?",
      answer: "조식 제공 여부는 숙소마다 다르니 예약 시 확인하세요.",
    },
    {
      id: 39,
      service: "jeju-stay",
      question: "제주스테이 주차장은 있나요?",
      answer: "대부분의 숙소에서 주차장을 제공하며, 유료일 수 있습니다.",
    },
    {
      id: 40,
      service: "jeju-stay",
      question: "제주스테이 짐 보관은 가능한가요?",
      answer: "대부분의 숙소에서 짐 보관 서비스를 제공합니다.",
    },
    {
      id: 41,
      service: "jeju-stay",
      question: "제주스테이 세탁 서비스는 있나요?",
      answer: "세탁 서비스 제공 여부는 숙소마다 다릅니다.",
    },
    {
      id: 42,
      service: "jeju-stay",
      question: "제주스테이 객실 청소는 매일 되나요?",
      answer: "객실 청소 주기는 숙소마다 다르니 사전에 확인하세요.",
    },
    {
      id: 43,
      service: "jeju-stay",
      question: "제주스테이 객실 내 욕실은 어떻게 되나요?",
      answer: "대부분의 숙소에서 개인 욕실을 제공합니다.",
    },
    {
      id: 44,
      service: "jeju-stay",
      question: "제주스테이 객실 내 TV는 있나요?",
      answer: "대부분의 숙소에서 TV를 제공합니다.",
    },
    {
      id: 45,
      service: "jeju-stay",
      question: "제주스테이 객실 내 냉장고는 있나요?",
      answer: "대부분의 숙소에서 냉장고를 제공합니다.",
    },
    {
      id: 46,
      service: "jeju-stay",
      question: "제주스테이 객실 내 에스프레소 머신은 있나요?",
      answer: "일부 숙소에서 에스프레소 머신을 제공합니다.",
    },
    {
      id: 47,
      service: "jeju-stay",
      question: "제주스테이 객실 내 미니바는 있나요?",
      answer: "일부 숙소에서 미니바를 제공합니다.",
    },
    {
      id: 48,
      service: "jeju-stay",
      question: "제주스테이 객실 내 헤어드라이기는 있나요?",
      answer: "대부분의 숙소에서 헤어드라이기를 제공합니다.",
    },
    {
      id: 49,
      service: "jeju-stay",
      question: "제주스테이 객실 내 욕가운은 있나요?",
      answer: "일부 숙소에서 욕가운을 제공합니다.",
    },
    {
      id: 50,
      service: "jeju-stay",
      question: "제주스테이 고객센터 운영 시간은 어떻게 되나요?",
      answer: "제주스테이 고객센터는 09:00 ~ 22:00에 운영되며, 전화 1661-2222로 문의 가능합니다.",
    },

    // 제주렌터카 FAQ (25개)
    {
      id: 51,
      service: "jeju-rental",
      question: "제주렌터카 최소 렌탈 기간은 얼마나 되나요?",
      answer: "최소 렌탈 기간은 1일이며, 3일 이상 렌탈 시 추가 할인이 적용됩니다.",
    },
    {
      id: 52,
      service: "jeju-rental",
      question: "제주렌터카 예약 취소는 어떻게 하나요?",
      answer: "렌탈 날짜 7일 전까지 취소 가능하며, 이후 취소 수수료가 발생합니다.",
    },
    {
      id: 53,
      service: "jeju-rental",
      question: "제주렌터카 예약 변경은 가능한가요?",
      answer: "렌탈 날짜 7일 전까지 예약 변경이 가능합니다.",
    },
    {
      id: 54,
      service: "jeju-rental",
      question: "제주렌터카 보험은 필수인가요?",
      answer: "기본 보험(자차 보험)이 포함되어 있으며, 추가 보험은 선택사항입니다.",
    },
    {
      id: 55,
      service: "jeju-rental",
      question: "제주렌터카 운전자 나이 제한이 있나요?",
      answer: "만 21세 이상이어야 렌탈 가능하며, 국제 운전면허증이 필요합니다.",
    },
    {
      id: 56,
      service: "jeju-rental",
      question: "제주렌터카 운전면허증은 어떤 것이 필요한가요?",
      answer: "한국 운전면허증 또는 국제 운전면허증이 필요합니다.",
    },
    {
      id: 57,
      service: "jeju-rental",
      question: "제주렌터카 신용카드는 필수인가요?",
      answer: "신용카드가 필수이며, 보증금 결제에 사용됩니다.",
    },
    {
      id: 58,
      service: "jeju-rental",
      question: "제주렌터카 픽업 시간은 언제인가요?",
      answer: "일반적으로 오전 8시부터 오후 8시까지 픽업이 가능합니다.",
    },
    {
      id: 59,
      service: "jeju-rental",
      question: "제주렌터카 반납 시간은 언제인가요?",
      answer: "일반적으로 오전 8시부터 오후 8시까지 반납이 가능합니다.",
    },
    {
      id: 60,
      service: "jeju-rental",
      question: "제주렌터카 늦은 반납 시 추가 요금이 있나요?",
      answer: "늦은 반납 시 시간당 추가 요금이 발생합니다.",
    },
    {
      id: 61,
      service: "jeju-rental",
      question: "제주렌터카 공항 픽업 서비스는 있나요?",
      answer: "공항 픽업 서비스가 있으며, 추가 요금이 발생할 수 있습니다.",
    },
    {
      id: 62,
      service: "jeju-rental",
      question: "제주렌터카 호텔 픽업 서비스는 있나요?",
      answer: "호텔 픽업 서비스가 있으며, 추가 요금이 발생할 수 있습니다.",
    },
    {
      id: 63,
      service: "jeju-rental",
      question: "제주렌터카 차량 종류는 어떻게 되나요?",
      answer: "경차, 준중형, 중형, SUV 등 다양한 차종을 제공합니다.",
    },
    {
      id: 64,
      service: "jeju-rental",
      question: "제주렌터카 자동 변속기 차량은 있나요?",
      answer: "자동 변속기 차량이 있으며, 추가 요금이 발생할 수 있습니다.",
    },
    {
      id: 65,
      service: "jeju-rental",
      question: "제주렌터카 수동 변속기 차량은 있나요?",
      answer: "수동 변속기 차량도 제공되며, 차량 선택 시 확인하세요.",
    },
    {
      id: 66,
      service: "jeju-rental",
      question: "제주렌터카 전기차는 있나요?",
      answer: "환경 친화적인 전기차를 제공하며, 추가 요금이 발생할 수 있습니다.",
    },
    {
      id: 67,
      service: "jeju-rental",
      question: "제주렌터카 차량 내 네비게이션은 있나요?",
      answer: "대부분의 차량에 네비게이션이 장착되어 있습니다.",
    },
    {
      id: 68,
      service: "jeju-rental",
      question: "제주렌터카 차량 내 블랙박스는 있나요?",
      answer: "대부분의 차량에 블랙박스가 장착되어 있습니다.",
    },
    {
      id: 69,
      service: "jeju-rental",
      question: "제주렌터카 차량 내 휴대폰 충전기는 있나요?",
      answer: "일부 차량에 휴대폰 충전기가 장착되어 있습니다.",
    },
    {
      id: 70,
      service: "jeju-rental",
      question: "제주렌터카 차량 내 와이파이는 있나요?",
      answer: "일부 차량에 와이파이가 장착되어 있습니다.",
    },
    {
      id: 71,
      service: "jeju-rental",
      question: "제주렌터카 차량 손상 시 어떻게 하나요?",
      answer: "차량 손상 시 보험에 따라 처리되며, 고객센터에 즉시 문의하세요.",
    },
    {
      id: 72,
      service: "jeju-rental",
      question: "제주렌터카 교통 위반 시 어떻게 하나요?",
      answer: "교통 위반 시 운전자가 책임지며, 고객센터에 문의하세요.",
    },
    {
      id: 73,
      service: "jeju-rental",
      question: "제주렌터카 사고 시 어떻게 하나요?",
      answer: "사고 발생 시 즉시 고객센터에 문의하고 경찰에 신고하세요.",
    },
    {
      id: 74,
      service: "jeju-rental",
      question: "제주렌터카 고객센터 운영 시간은 어떻게 되나요?",
      answer: "제주렌터카 고객센터는 08:00 ~ 20:00에 운영되며, 전화 1661-3333으로 문의 가능합니다.",
    },
    {
      id: 75,
      service: "jeju-rental",
      question: "제주렌터카 연락처는 어디인가요?",
      answer: "제주렌터카 고객센터 전화번호는 1661-3333입니다.",
    },
  ];

  const filteredNotices =
    activeService === "all"
      ? notices
      : notices.filter((n) => n.service === activeService);

  const filteredFaqs =
    activeService === "all"
      ? allFaqs
      : allFaqs.filter((f) => f.service === activeService);

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      "jeju-air": "제주항공",
      "jeju-stay": "제주스테이",
      "jeju-rental": "제주렌터카",
    };
    return labels[service] || "전체";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 검색 및 챗봇 바 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="공지사항, FAQ 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => alert("팻봇 챗봇이 곧 열립니다!")}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all font-medium"
            title="챗봇 열기"
          >
            <MessageCircle size={18} />
            <span className="hidden sm:inline text-sm">챗봇</span>
          </button>
        </div>
      </div>

      {/* 히어로 섹션 */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663351390526/ab9gBBp63CBu4auHT7zPrZ/hero-jeju-sky-8kycW4SjW4tA3oPSYA99Ug.webp')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            제주 여행의 모든 것을 한곳에서
          </h2>
          <p className="text-base sm:text-lg text-gray-100 mb-8 leading-relaxed">
            항공, 숙박, 렌터카. 제주 여행을 계획하는 모든 순간, 우리가 함께합니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/notices">
              <a>
                <Button className="w-full sm:w-auto bg-white text-orange-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-lg transition-all shadow-lg">
                  공지사항 보기
                </Button>
              </a>
            </Link>
            <Link href="/faqs">
              <a>
                <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-all shadow-lg">
                  FAQ 보기
                </Button>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* 서비스 소개 섹션 */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              세 가지 서비스, 하나의 경험
            </h3>
            <p className="text-lg text-gray-600">
              제주 여행의 모든 단계를 함께하는 서비스들
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 제주항공 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                  <Plane className="text-white" size={28} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">제주항공</h4>
                <p className="text-gray-600 mb-6">
                  합리적인 가격으로 제주로 떠나는 여행. 안전하고 편리한 항공 서비스를 경험하세요.
                </p>
                <div className="flex items-center text-orange-600 font-semibold hover:gap-2 transition-all">
                  자세히 보기
                  <ChevronRight size={20} className="ml-2" />
                </div>
              </div>
            </div>

            {/* 제주스테이 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mb-6">
                  <HomeIcon className="text-white" size={28} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">제주스테이</h4>
                <p className="text-gray-600 mb-6">
                  제주의 매력을 담은 다양한 숙소. 당신의 여행 스타일에 맞는 완벽한 숙소를 찾으세요.
                </p>
                <div className="flex items-center text-cyan-600 font-semibold hover:gap-2 transition-all">
                  자세히 보기
                  <ChevronRight size={20} className="ml-2" />
                </div>
              </div>
            </div>

            {/* 제주렌터카 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <Car className="text-white" size={28} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-3">제주렌터카</h4>
                <p className="text-gray-600 mb-6">
                  제주의 아름다운 드라이브 코스를 자유롭게 즐기세요. 다양한 차종과 합리적인 가격.
                </p>
                <div className="flex items-center text-emerald-600 font-semibold hover:gap-2 transition-all">
                  자세히 보기
                  <ChevronRight size={20} className="ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 공지사항 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">최신 소식</h3>
              <p className="text-gray-600">제주 여행의 새로운 정보를 먼저 만나보세요</p>
            </div>
            <Link href="/notices">
              <a className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2">
                전체 보기
                <ChevronRight size={20} />
              </a>
            </Link>
          </div>

          <div className="flex gap-3 mb-8 flex-wrap">
            {["all", "jeju-air", "jeju-stay", "jeju-rental"].map((service) => (
              <button
                key={service}
                onClick={() => setActiveService(service)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeService === service
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {service === "all" ? "전체" : getServiceLabel(service)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredNotices.map((notice) => {
              const IconComponent = notice.icon;
              return (
                <div
                  key={notice.id}
                  className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all"
                >
                  <div className={`h-1 bg-gradient-to-r ${notice.color}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${notice.color} flex items-center justify-center`}>
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {notice.date}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition">
                      {notice.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {notice.excerpt}
                    </p>
                    <div className="flex items-center text-orange-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      더 보기
                      <ChevronRight size={16} className="ml-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ 섹션 */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-2">자주 묻는 질문</h3>
              <p className="text-gray-600">궁금한 점들을 여기서 찾아보세요</p>
            </div>
            <Link href="/faqs">
              <a className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2">
                전체 보기
                <ChevronRight size={20} />
              </a>
            </Link>
          </div>

          <div className="flex gap-3 mb-8 flex-wrap">
            {["all", "jeju-air", "jeju-stay", "jeju-rental"].map((service) => (
              <button
                key={`faq-${service}`}
                onClick={() => setActiveService(service)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeService === service
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {service === "all" ? "전체" : getServiceLabel(service)}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFaqs.slice(0, 3).map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all border-l-4 border-l-orange-500 hover:border-l-orange-600"
              >
                <h4 className="font-bold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 빠른 연락처 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              더 빠른 도움이 필요하신가요?
            </h3>
            <p className="text-lg text-gray-600">
              고객센터에 직접 문의하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "제주항공",
                phone: "1661-1114",
                hours: "24시간",
                color: "from-orange-400 to-orange-600",
                icon: Plane,
              },
              {
                name: "제주스테이",
                phone: "1661-2222",
                hours: "09:00 ~ 22:00",
                color: "from-cyan-400 to-cyan-600",
                icon: HomeIcon,
              },
              {
                name: "제주렌터카",
                phone: "1661-3333",
                hours: "08:00 ~ 20:00",
                color: "from-emerald-400 to-emerald-600",
                icon: Car,
              },
            ].map((contact, idx) => {
              const IconComponent = contact.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all text-center"
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                  >
                    <IconComponent className="text-white" size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {contact.name}
                  </h4>
                  <p className="text-3xl font-bold text-orange-600 mb-2">
                    {contact.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    운영시간: {contact.hours}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
