import { useState } from 'react';
import { Plane, Home as HomeIcon, Car, ChevronRight, AlertCircle } from 'lucide-react';
import Payment from './Payment';

/**
 * 제주 통합 결제 시스템 - 메인 페이지
 * 
 * 디자인 철학: 제주항공 브랜드 감성
 * - 신뢰감 있는 깊은 파랑색 (#003DA5) 메인 컬러
 * - 활기찬 주황색 (#FF6B35) 액센트 컬러
 * - 명확한 정보 계층으로 사용자가 한눈에 예약 정보 파악
 */

interface Booking {
  id: string;
  service: 'flight' | 'stay' | 'rental';
  name: string;
  date: string;
  price: number;
  details: string;
}

export default function Home() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      service: 'flight',
      name: '제주항공 - 서울 → 제주',
      date: '2024.03.15 (금) 14:30',
      price: 89000,
      details: '탑승객 2명 | 왕복'
    },
    {
      id: '2',
      service: 'stay',
      name: '제주스테이 - 오션뷰 럭셔리',
      date: '2024.03.15 ~ 2024.03.18 (3박)',
      price: 450000,
      details: '더블룸 1개 | 조식 포함'
    },
    {
      id: '3',
      service: 'rental',
      name: '제주렌터카 - 중형 SUV',
      date: '2024.03.15 ~ 2024.03.18 (3일)',
      price: 180000,
      details: '풀옵션 | 무제한 주행'
    }
  ]);

  const [selectedBookings, setSelectedBookings] = useState<string[]>(bookings.map(b => b.id));
  const [showPayment, setShowPayment] = useState(false);

  const handleSelectBooking = (id: string) => {
    setSelectedBookings(prev =>
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  const selectedTotal = bookings
    .filter(b => selectedBookings.includes(b.id))
    .reduce((sum, b) => sum + b.price, 0);

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'flight':
        return <Plane style={{ width: '24px', height: '24px' }} />;
      case 'stay':
        return <HomeIcon style={{ width: '24px', height: '24px' }} />;
      case 'rental':
        return <Car style={{ width: '24px', height: '24px' }} />;
      default:
        return null;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case 'flight':
        return 'bg-blue-100 text-primary';
      case 'stay':
        return 'bg-orange-100 text-orange-600';
      case 'rental':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getServiceLabel = (service: string) => {
    switch (service) {
      case 'flight':
        return '항공권';
      case 'stay':
        return '숙박';
      case 'rental':
        return '렌터카';
      default:
        return '';
    }
  };

  if (showPayment) {
    return <Payment onBack={() => setShowPayment(false)} totalAmount={Math.round(selectedTotal * 1.1)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary via-blue-700 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <span className="text-white font-bold text-lg">✈</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-bold truncate">제주 통합 결제</h1>
                <p className="text-blue-100 text-xs">Jeju Integrated Payment</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-blue-100 hidden sm:block">예약 관리</p>
              <p className="text-xs md:text-sm font-semibold">홍길동님</p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* 페이지 제목 */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">예약 내역 확인</h2>
          <p className="text-sm md:text-base text-gray-600">제주 여행의 모든 예약을 한곳에서 관리하고 결제하세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 예약 목록 */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            <div className="flex items-center justify-between mb-4 gap-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-0">예약 상품</h3>
              <span className="text-xs md:text-sm text-gray-500 flex-shrink-0">{selectedBookings.length}개 선택</span>
            </div>

            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="payment-card p-4 md:p-5 cursor-pointer transition-all"
                onClick={() => handleSelectBooking(booking.id)}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {/* 체크박스 */}
                  <div className="flex-shrink-0 pt-1">
                    <input
                      type="checkbox"
                      checked={selectedBookings.includes(booking.id)}
                      onChange={() => handleSelectBooking(booking.id)}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        borderColor: '#d1d5db',
                        accentColor: '#003DA5',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    />
                  </div>

                  {/* 서비스 아이콘 */}
                  <div className={`service-icon flex-shrink-0 w-10 h-10 md:w-12 md:h-12 ${getServiceColor(booking.service)}`}>
                    {getServiceIcon(booking.service)}
                  </div>

                  {/* 예약 정보 */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4 mb-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="font-semibold text-sm md:text-base text-gray-900 truncate">{booking.name}</h4>
                          <span className="jeju-badge text-xs">
                            {getServiceLabel(booking.service)}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600">{booking.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl md:text-3xl font-bold text-primary">{booking.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">원</p>
                      </div>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 border-t border-gray-100 pt-2 md:pt-3 mt-2 md:mt-3">
                      {booking.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 결제 요약 및 버튼 */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 md:top-24 space-y-3 md:space-y-4">
              {/* 결제 요약 카드 */}
              <div className="payment-card p-4 md:p-6 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-4 text-base md:text-lg">결제 요약</h3>

                <div className="payment-summary mb-4 md:mb-6">
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-700">\uc18c계</span>
                    <span className="font-semibold text-gray-900">
                      {selectedTotal.toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-700">할인</span>
                    <span className="font-semibold text-green-600">-0원</span>
                  </div>
                  <div className="flex justify-between items-center text-sm md:text-base">
                    <span className="text-gray-700">부가세</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round(selectedTotal * 0.1).toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-3 md:pt-4 mb-4 md:mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-base md:text-lg">최종 결제액</span>
                    <div className="text-right">
                      <p className="text-2xl md:text-3xl font-bold text-primary">
                        {Math.round(selectedTotal * 1.1).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">원</p>
                    </div>
                  </div>
                </div>

                {/* 결제 버튼 */}
                <button
                  onClick={() => setShowPayment(true)}
                  className="btn-primary w-full mb-2 md:mb-3 flex items-center justify-center gap-2 text-sm md:text-base py-2 md:py-3"
                >
                  <span>결제하기</span>
                  <ChevronRight style={{ width: '16px', height: '16px' }} />
                </button>

                {/* 임시 저장 버튼 */}
                <button className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm md:text-base hover:bg-gray-50 transition-colors">
                  임시 저장
                </button>
              </div>

              {/* 안내 메시지 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 flex gap-2 md:gap-3">
                <AlertCircle style={{ width: '18px', height: '18px', color: '#0052cc', flexShrink: 0, marginTop: '2px' }} />
                <div className="text-xs md:text-sm">
                  <p className="font-semibold text-blue-900 mb-1">결제 안내</p>
                  <p className="text-blue-800">
                    선택한 예약 상품만 결제됩니다. 결제 후 예약이 확정됩니다.
                  </p>
                </div>
              </div>

              {/* 결제 방법 정보 */}
              <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-xs md:text-sm">이용 가능한 결제 수단</h4>
                <div className="space-y-2 text-xs md:text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                    신용카드 / 체크카드
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                    계좌이체
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                    휴대폰 결제
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></span>
                    포인트 / 쿠폰
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-200 bg-white mt-12 md:mt-16">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-6 md:mb-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">제주항공</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition">항공편 예약</a></li>
                <li><a href="#" className="hover:text-primary transition">예약 조회</a></li>
                <li><a href="#" className="hover:text-primary transition">고객 지원</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">제주스테이</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition">숭소 검색</a></li>
                <li><a href="#" className="hover:text-primary transition">예약 관리</a></li>
                <li><a href="#" className="hover:text-primary transition">리뷰</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">제주렌터카</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition">차량 예약</a></li>
                <li><a href="#" className="hover:text-primary transition">요금 조회</a></li>
                <li><a href="#" className="hover:text-primary transition">운전 가이드</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">고객 지원</h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
                <li><a href="#" className="hover:text-primary transition">공지사항</a></li>
                <li><a href="#" className="hover:text-primary transition">자주 묻는 질문</a></li>
                <li><a href="#" className="hover:text-primary transition">1:1 문의</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 md:pt-6">
            <p className="text-xs md:text-sm text-gray-600 mb-2">
              © 2024 Jeju Integrated Payment System. All rights reserved.
            </p>
            <div className="flex gap-3 md:gap-4 text-xs md:text-sm text-gray-600 flex-wrap">
              <a href="#" className="hover:text-primary transition">이용약관</a>
              <a href="#" className="hover:text-primary transition">개인정보처리방침</a>
              <a href="#" className="hover:text-primary transition">결제 보안</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
