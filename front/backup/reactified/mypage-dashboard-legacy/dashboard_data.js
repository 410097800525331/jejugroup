export const getDashboardData = async () => {
  // 강제로 딜레이를 주어 스켈레톤 UI/로딩 애니메이션을 확보
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 기초 데이터 구조 (불변성 원칙 보장을 위해 항상 새로운 객체 반환)
  const PREMIUM_USER_DATA = {
    profile: {
      name: '홍민지',
      tier: 'BLACK',
      memberColor: 'var(--meta-accent)', // 블랙 등급 기준의 메타 컬러 연동
      avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=minji-black&backgroundColor=242424',
      email: 'minji.hong@jejugroup.example'
    },
    memberships: [
      { id: 'air', name: 'Jeju Air 리프레시', number: '7C-8821-9904' },
      { id: 'stay', name: 'Jeju Stay 프레스티지', number: 'JS-4410-2211' }
    ],
    quickActions: [
      { id: 'bookings', label: '예약 관리', icon: 'calendar-check', route: '/reservations/all' },
      { id: 'boarding', label: '탑승권 발급', icon: 'scan-line', route: '/air/boarding' },
      { id: 'coupons', label: '포인트/쿠폰', icon: 'ticket', route: '/wallet/coupons' },
      { id: 'profile', label: '정보수정', icon: 'user-cog', route: '/profile/edit' }
    ],
    assets: {
      points: 26600,
      expiringPoints: 1200,
      coupons: 12,
      travelCash: 154000
    },
    // 예약 현황(Bookings) 통합 지표 및 서비스 바로가기
    bookingSummary: {
      activeCount: 4,
      categories: [
        { id: 'air', title: '항공권 설정', label: '항공', color: 'var(--brand-air)', icon: 'plane', value: 2, cta: '항공 관리' },
        { id: 'stay', title: '숙소 예약', label: '숙박', color: 'var(--brand-stay)', icon: 'hotel', value: 1, cta: '숙소 관리' },
        { id: 'rent', title: '렌터카 일정', label: '차량', color: 'var(--brand-rent)', icon: 'car', value: 1, cta: '차량 관리' },
        { id: 'voucher', title: '내 바우처', label: '티켓/eSIM', color: '#8c52ff', icon: 'ticket', value: 2, cta: '바우처 관리' }
      ]
    },
    upcomingTrips: [
      {
        id: 'flight-1',
        type: 'air',
        status: 'UPCOMING',
        title: 'ICN → NRT (7C1102)',
        date: '2026.11.20 09:10 AM',
        amount: '324,000원',
        passengers: '성인 1',
        tags: ['모바일 탑승권', '위탁수하물 15kg'],
        actions: { modify: '/air/modify', cancel: '/air/cancel', receipt: '/air/receipt' }
      },
      {
        id: 'flight-2',
        type: 'air',
        status: 'UPCOMING',
        title: 'GMP → CJU (7C113)',
        date: '2026.10.15 08:30 AM',
        amount: '124,000원',
        passengers: '성인 1, 소아 1',
        tags: ['모바일 탑승권', '사전수하물'],
        actions: { modify: '/air/modify', cancel: '/air/cancel', receipt: '/air/receipt' }
      },
      {
        id: 'flight-3',
        type: 'air',
        status: 'RESERVED',
        title: 'CDG → ICN (AF264)',
        date: '2027.01.12 13:30 PM (현지시간)',
        amount: '1,450,000원',
        passengers: '성인 2',
        tags: ['비즈니스 클래스', '라운지 이용권'],
        actions: { modify: '/air/modify', cancel: '/air/cancel', receipt: '/air/receipt' }
      },
      {
        id: 'hotel-1',
        type: 'stay',
        status: 'CONFIRMED',
        title: 'Jeju Ocean Suite (디럭스 오션뷰)',
        date: '2026.10.15 ~ 10.17 (2박)',
        amount: '480,000원',
        passengers: '성인 2',
        tags: ['체크인 대기', '조식포함', '수영장'],
        actions: { modify: '/stay/modify', cancel: '/stay/cancel', receipt: '/stay/receipt' }
      },
      {
        id: 'hotel-2',
        type: 'stay',
        status: 'CONFIRMED',
        title: 'The Ritz-Carlton, Tokyo (클럽 타워 룸)',
        date: '2026.11.20 ~ 11.23 (3박)',
        amount: '2,150,000원',
        passengers: '성인 1',
        tags: ['클럽 라운지', '얼리 체크인'],
        actions: { modify: '/stay/modify', cancel: '/stay/cancel', receipt: '/stay/receipt' }
      },
      {
        id: 'hotel-3',
        type: 'stay',
        status: 'RESERVED',
        title: 'Pullman Paris Tour Eiffel',
        date: '2027.01.05 ~ 01.12 (7박)',
        amount: '3,800,000원',
        passengers: '성인 2',
        tags: ['에펠탑 뷰', '발코니'],
        actions: { modify: '/stay/modify', cancel: '/stay/cancel', receipt: '/stay/receipt' }
      },
      {
        id: 'rent-1',
        type: 'rent',
        status: 'RESERVED',
        title: 'IONIQ 6 Long Range',
        date: '2026.10.15 09:30 AM 인수',
        amount: '135,000원',
        passengers: '제주공항 지점',
        tags: ['완전자차', '전기차', '공항픽업'],
        actions: { modify: '/rent/modify', cancel: '/rent/cancel', receipt: '/rent/receipt' }
      },
      {
        id: 'rent-2',
        type: 'rent',
        status: 'RESERVED',
        title: 'BMW 5 Series',
        date: '2026.11.20 12:00 PM 인수',
        amount: '450,000원',
        passengers: '나리타 공항 지점',
        tags: ['프리미엄 세단', '면책보험 가입'],
        actions: { modify: '/rent/modify', cancel: '/rent/cancel', receipt: '/rent/receipt' }
      }
    ],
    reviews: [
      { id: 'rev1', type: 'stay', title: 'Jeju Ocean Suite 숙박', rating: 5, date: '2026.08.10' },
      { id: 'rev2', type: 'air', title: '프리미엄 클래스 탑승', rating: 4, date: '2026.05.22' }
    ],
    favorites: [
      { id: 'fav1', type: 'stay', title: '그랜드 조선 제주', price: '280,000원~' },
      { id: 'fav2', type: 'air', title: '제주 기점 특가 알림', price: '수시확인' }
    ],
    preferences: [
      { key: 'seat', label: '선호 좌석', value: '창가 / 앞열' },
      { key: 'car', label: '차량 옵션', value: 'EV / 오토' }
    ],
    support: [
      { id: 'qna', icon: 'headphones', title: '1:1 문의 내역', count: 1 },
      { id: 'notice', icon: 'bell', title: '결항/지연 안내', count: 0 },
      { id: 'faq', icon: 'help-circle', title: '자주 묻는 질문', count: null }
    ]
  };

  return { ...PREMIUM_USER_DATA };
};
