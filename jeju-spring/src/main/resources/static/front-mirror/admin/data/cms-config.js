const bannerFallbackRows = [
  {
    id: 'stay_hotel_promo_main',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_hotel_promo_main',
    eyebrow: 'JEJU UNIVERSE',
    title: '제주 숙박 메인 프로모션',
    body: '제주항공과 제휴 호텔 예약 혜택을 한 번에 확인하는 메인 카드.',
    ctaLabel: '자세히 보기',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 10,
    active: true
  },
  {
    id: 'stay_hotel_promo_sub_1',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_hotel_promo_sub_1',
    eyebrow: 'REFRESH POINT',
    title: '리프레시 포인트',
    body: '숙박 결제에 쓸 수 있는 혜택 카드.',
    ctaLabel: '포인트 확인',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 20,
    active: true
  },
  {
    id: 'stay_hotel_promo_sub_2',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_hotel_promo_sub_2',
    eyebrow: 'PACKAGE DEAL',
    title: '항공 + 숙박 패키지',
    body: '항공과 숙박을 함께 묶는 패키지 할인 카드.',
    ctaLabel: '패키지 보기',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 30,
    active: true
  },
  {
    id: 'stay_private_promo_main',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_private_promo_main',
    eyebrow: 'PREMIUM CHECK-IN',
    title: '프라이빗 스테이 메인 프로모션',
    body: '프리미엄 체크인과 회원 혜택을 강조하는 메인 카드.',
    ctaLabel: '상품 확인',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 40,
    active: true
  },
  {
    id: 'stay_private_promo_sub_1',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_private_promo_sub_1',
    eyebrow: 'SNAP PHOTO',
    title: '숙소 사진 인증',
    body: '현장 사진과 리뷰 가이드를 보여주는 서브 카드.',
    ctaLabel: '사진 보기',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 50,
    active: true
  },
  {
    id: 'stay_private_promo_sub_2',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_private_promo_sub_2',
    eyebrow: 'DINING',
    title: '다이닝 & 라운지',
    body: '식음료 혜택을 강조하는 서브 카드.',
    ctaLabel: '메뉴 보기',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 60,
    active: true
  },
  {
    id: 'stay_life_synergy_banner',
    site: 'stay',
    family: 'inline_cta_banner_family',
    slotKey: 'stay_life_synergy_banner',
    eyebrow: 'SYNERGY',
    title: '제주항공 + 제주스테이 시너지 배너',
    body: '항공권 인증과 숙박 혜택을 한 줄로 연결하는 CTA 배너.',
    ctaLabel: '혜택 보기',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 70,
    active: true
  },
  {
    id: 'stay_life_promo_1',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_life_promo_1',
    eyebrow: 'LUGGAGE',
    title: '수하물 혜택',
    body: '장기 체류와 연결되는 수하물 추가 혜택 카드.',
    ctaLabel: '혜택 확인',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 80,
    active: true
  },
  {
    id: 'stay_life_promo_2',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_life_promo_2',
    eyebrow: 'MEMBER CARD',
    title: '로컬 멤버 카드',
    body: '카페, 렌터카, 부가 혜택을 묶어 보여주는 카드.',
    ctaLabel: '카드 보기',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 90,
    active: true
  },
  {
    id: 'stay_life_promo_3',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_life_promo_3',
    eyebrow: 'GUIDE',
    title: '여행 가이드 혜택',
    body: '장기 체류 전용 가이드 콘텐츠를 보여주는 카드.',
    ctaLabel: '가이드 보기',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 100,
    active: true
  },
  {
    id: 'stay_activities_auth_banner',
    site: 'stay',
    family: 'inline_cta_banner_family',
    slotKey: 'stay_activities_auth_banner',
    eyebrow: 'AUTH BANNER',
    title: '탑승객 인증 혜택 배너',
    body: '항공권 인증 후 즉시 연결되는 inline CTA 배너.',
    ctaLabel: '인증하기',
    ctaHref: '#',
    imageUrl: '',
    altText: '',
    sortOrder: 110,
    active: true
  },
  {
    id: 'air_home_hero_1',
    site: 'air',
    family: 'hero_image_set',
    slotKey: 'air_home_hero_1',
    eyebrow: 'AIR HERO',
    title: '항공 홈 히어로 1',
    body: '제주항공 메인 비주얼 슬라이드 1.',
    ctaLabel: '',
    ctaHref: '',
    imageUrl: '/jejuair/assets/img/main/slide1.png',
    altText: '제주항공 메인 슬라이드 1',
    sortOrder: 120,
    active: true
  },
  {
    id: 'air_home_hero_2',
    site: 'air',
    family: 'hero_image_set',
    slotKey: 'air_home_hero_2',
    eyebrow: 'AIR HERO',
    title: '항공 홈 히어로 2',
    body: '제주항공 메인 비주얼 슬라이드 2.',
    ctaLabel: '',
    ctaHref: '',
    imageUrl: '/jejuair/assets/img/main/slide2.png',
    altText: '제주항공 메인 슬라이드 2',
    sortOrder: 130,
    active: true
  },
  {
    id: 'air_home_hero_3',
    site: 'air',
    family: 'hero_image_set',
    slotKey: 'air_home_hero_3',
    eyebrow: 'AIR HERO',
    title: '항공 홈 히어로 3',
    body: '제주항공 메인 비주얼 슬라이드 3.',
    ctaLabel: '',
    ctaHref: '',
    imageUrl: '/jejuair/assets/img/main/slide3.png',
    altText: '제주항공 메인 슬라이드 3',
    sortOrder: 140,
    active: true
  }
];

const cmsConfig = {
  defaultTab: 'notices',
  searchButtonLabel: '검색',
  statusOptions: [
    { value: 'all', label: '전체' },
    { value: 'active', label: '노출 중' },
    { value: 'draft', label: '임시저장' },
    { value: 'inactive', label: '비노출' }
  ],
  tabs: {
    notices: {
      searchPlaceholder: '공지 제목이나 ID로 검색',
      primaryAction: '공지 등록',
      secondaryAction: null,
      pageSize: 8,
      typeFilterOptions: [
        { value: 'all', label: '전체' },
        { value: 'notice', label: '공지사항' },
        { value: 'event', label: '이벤트' }
      ],
      emptyMessage: '공지사항 데이터가 없습니다.',
      columns: ['공지 ID', '서비스', '유형', '제목', '게시 / 예약일', '노출 상태', '관리'],
      rows: []
    },
    faqs: {
      searchPlaceholder: 'FAQ 질문, 카테고리, ID로 검색',
      primaryAction: 'FAQ 등록',
      secondaryAction: null,
      emptyMessage: 'FAQ 데이터가 없습니다.',
      columns: ['FAQ ID', '서비스', '카테고리', '질문', '정렬 순서', '노출 상태', '관리'],
      rows: []
    },
    banner: {
      searchPlaceholder: '배너 제목, 슬롯키, eyebrow로 검색',
      primaryAction: '배너 등록',
      secondaryAction: '배치 정리',
      emptyMessage: '배너 데이터가 없습니다.',
      siteOptions: [
        { value: 'integrated', label: '통합' },
        { value: 'air', label: '항공' },
        { value: 'stay', label: '숙박' }
      ],
      familyOptions: [
        { value: 'promo_card_family', label: 'promo_card_family' },
        { value: 'inline_cta_banner_family', label: 'inline_cta_banner_family' },
        { value: 'hero_image_set', label: 'hero_image_set' }
      ],
      columns: ['배너 ID', '사이트 / 서비스', '패밀리 / 슬롯', '콘텐츠', '이미지', '정렬', '상태', '관리'],
      fallbackRows: bannerFallbackRows,
      rows: []
    }
  }
};

export default cmsConfig;
