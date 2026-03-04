import { Button } from "@/components/ui/button";
import { Plane, Home as HomeIcon, Car, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

/**
 * 공지사항 페이지
 * 기존 헤더/푸터를 고려한 디자인
 */
export default function Notices() {
  const [activeService, setActiveService] = useState("all");

  // 공지사항 데이터
  const allNotices = [
    {
      id: 1,
      service: "jeju-air",
      title: "2026년 2월 제주항공 신규 노선 운항 안내",
      date: "2026-02-27",
      content:
        "제주항공에서 새로운 국제선 노선을 개설합니다. 서울 인천공항에서 방콕, 홍콩, 타이페이로 운항하는 신규 노선이 2026년 3월부터 시작됩니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 2,
      service: "jeju-stay",
      title: "제주스테이 봄 시즌 특가 이벤트 시작",
      date: "2026-02-25",
      content:
        "제주스테이에서 봄 시즌 특가 이벤트를 진행합니다. 2026년 3월 1일부터 5월 31일까지 최대 40% 할인된 가격으로 예약하실 수 있습니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 3,
      service: "jeju-rental",
      title: "제주렌터카 예약 시스템 업그레이드 완료",
      date: "2026-02-23",
      content:
        "더욱 편리해진 예약 시스템으로 차량 예약이 더 쉬워졌습니다. 새로운 시스템에서는 실시간 차량 가용성 확인, 빠른 결제, 자동 확인 문자 발송 등의 기능이 추가되었습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
    {
      id: 4,
      service: "jeju-air",
      title: "제주항공 마일리지 프로그램 개편 안내",
      date: "2026-02-20",
      content:
        "더욱 혜택이 많아진 마일리지 프로그램이 시작됩니다. 기존 회원님들은 자동으로 새로운 프로그램에 등록되며, 더 많은 마일리지를 적립하고 사용할 수 있게 됩니다.",
      color: "from-orange-400 to-orange-600",
      icon: Plane,
    },
    {
      id: 5,
      service: "jeju-stay",
      title: "제주스테이 새로운 숙소 추가 오픈",
      date: "2026-02-18",
      content:
        "제주스테이에 새로운 프리미엄 숙소들이 추가되었습니다. 제주의 아름다운 자연을 감상할 수 있는 오션뷰 펜션, 전통 한옥 게스트하우스 등 다양한 숙소를 선택하실 수 있습니다.",
      color: "from-cyan-400 to-cyan-600",
      icon: HomeIcon,
    },
    {
      id: 6,
      service: "jeju-rental",
      title: "제주렌터카 전기차 추가 도입",
      date: "2026-02-15",
      content:
        "제주렌터카에서 환경 친화적인 전기차를 추가로 도입했습니다. 테슬라, 현대 아이오닉 등 최신 전기차를 저렴한 가격에 렌탈하실 수 있습니다.",
      color: "from-emerald-400 to-emerald-600",
      icon: Car,
    },
  ];

  // 필터링된 공지사항
  const filteredNotices =
    activeService === "all"
      ? allNotices
      : allNotices.filter((notice) => notice.service === activeService);

  const getServiceLabel = (service: string) => {
    const labels: Record<string, string> = {
      "jeju-air": "제주항공",
      "jeju-stay": "제주스테이",
      "jeju-rental": "제주렌터카",
    };
    return labels[service] || "전체";
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
              최신 소식
            </h2>
            <p className="text-lg text-gray-600">
              제주항공, 제주스테이, 제주렌터카의 최신 정보를 확인하세요.
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

          {/* 타임라인 공지사항 */}
          <div className="space-y-6">
            {filteredNotices.map((notice, index) => {
              const IconComponent = notice.icon;
              return (
                <div key={notice.id} className="relative">
                  {/* 타임라인 연결선 */}
                  {index < filteredNotices.length - 1 && (
                    <div className="absolute left-8 top-20 w-1 h-12 bg-gradient-to-b from-orange-300 to-transparent" />
                  )}

                  {/* 공지사항 카드 */}
                  <div className="flex gap-6">
                    {/* 타임라인 점 */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${notice.color} flex items-center justify-center shadow-lg`}
                      >
                        <IconComponent className="text-white" size={28} />
                      </div>
                    </div>

                    {/* 콘텐츠 */}
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {notice.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {getServiceLabel(notice.service)} • {notice.date}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {notice.content}
                      </p>
                      <button className="mt-4 text-orange-600 hover:text-orange-700 font-semibold text-sm">
                        자세히 보기 →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 빈 상태 */}
          {filteredNotices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                검색 결과가 없습니다.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
