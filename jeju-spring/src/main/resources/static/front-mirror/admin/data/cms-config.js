const bannerFallbackRows = [
  {
    id: 'stay_hotel_promo_main',
    site: 'stay',
    family: 'promo_card_family',
    slotKey: 'stay_hotel_promo_main',
    iconKey: 'plane',
    eyebrow: 'JEJU UNIVERSE',
    title: '제주항공 탑승객 인증 시 전 세계 호텔 7% 추가 할인',
    body: '제주항공 예약 확인서를 업로드하고 특별 할인을 받으세요',
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
    iconKey: 'coins',
    eyebrow: 'REFRESH POINT',
    title: '리프레시 포인트로 호텔 결제 가능',
    body: '',
    ctaLabel: '포인트 사용하기',
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
    iconKey: 'car',
    eyebrow: 'PACKAGE DEAL',
    title: '숙소 + 렌터카 패키지 최대 15% 할인',
    body: '',
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
    iconKey: 'crown',
    eyebrow: 'PREMIUM CHECK-IN',
    title: '프라이빗 스테이 예약 시 얼리 체크인 & 웰컴 키트 제공',
    body: '제주 유니버스 회원을 위한 특별한 시작',
    ctaLabel: '혜택 확인하기',
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
    iconKey: 'camera',
    eyebrow: 'SNAP PHOTO',
    title: '인생샷 포인트 스냅 촬영 할인',
    body: '',
    ctaLabel: '작가 보기',
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
    iconKey: 'wine',
    eyebrow: 'DINING',
    title: '인룸 다이닝 와인 & 플래터',
    body: '',
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
    iconKey: 'plane',
    eyebrow: '',
    title: '전 세계 어디든 제주항공 X 모빌리티 혜택',
    body: '항공권 결합 시 리프레시 포인트 2배 적립 + 해외 렌터카 50% 할인!',
    ctaLabel: '제주 유니버스 혜택 보기',
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
    iconKey: 'luggage',
    eyebrow: '',
    title: '위탁 수하물 10kg 추가 증정',
    body: '짐이 많은 장기 여행도 걱정 없이, 제주항공 이용 시 혜택 제공',
    ctaLabel: '',
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
    iconKey: 'map',
    eyebrow: '',
    title: '로컬 라이프 멤버십 카드',
    body: '현지인 맛집, 카페, 렌터카까지 최대 20% 제휴 할인',
    ctaLabel: '',
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
    iconKey: 'flower-2',
    eyebrow: '',
    title: '한 달 살기 가이드북 제공',
    body: '쓰레기 배출일부터 근처 인프라 정보까지 생활 필수 정보 수록',
    ctaLabel: '',
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
    iconKey: 'plane',
    eyebrow: '',
    title: '제주항공 탑승객 인증',
    body: '항공권번호를 인증하고 최대 50% 추가 할인 혜택을 받으세요.',
    ctaLabel: '인증하고 혜택받기',
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
    iconKey: '',
    eyebrow: 'AIR HERO',
    title: '항공 홈 히어로 1',
    body: '제주항공 메인 비주얼 슬라이드 1.',
    ctaLabel: '',
    ctaHref: '',
    imageUrl: '',
    altText: '제주항공 메인 슬라이드 1',
    sortOrder: 120,
    active: true
  },
  {
    id: 'air_home_hero_2',
    site: 'air',
    family: 'hero_image_set',
    slotKey: 'air_home_hero_2',
    iconKey: '',
    eyebrow: 'AIR HERO',
    title: '항공 홈 히어로 2',
    body: '제주항공 메인 비주얼 슬라이드 2.',
    ctaLabel: '',
    ctaHref: '',
    imageUrl: '',
    altText: '제주항공 메인 슬라이드 2',
    sortOrder: 130,
    active: true
  },
  {
    id: 'air_home_hero_3',
    site: 'air',
    family: 'hero_image_set',
    slotKey: 'air_home_hero_3',
    iconKey: '',
    eyebrow: 'AIR HERO',
    title: '항공 홈 히어로 3',
    body: '제주항공 메인 비주얼 슬라이드 3.',
    ctaLabel: '',
    ctaHref: '',
    imageUrl: '',
    altText: '제주항공 메인 슬라이드 3',
    sortOrder: 140,
    active: true
  }
];

const bannerSlotMetadata = bannerFallbackRows.map((row, index) => {
  const slotKey = String(row.slotKey ?? row.id ?? '').trim();
  const shortId = `B${String(index + 1).padStart(2, '0')}`;
  const familyLabelMap = {
    promo_card_family: '프로모 카드',
    inline_cta_banner_family: '인라인 CTA',
    hero_image_set: '히어로 이미지'
  };
  const positionLabel = slotKey.includes('main')
    ? '메인'
    : slotKey.includes('sub_1')
      ? '서브 1'
      : slotKey.includes('sub_2')
        ? '서브 2'
        : slotKey.includes('sub_3')
          ? '서브 3'
          : slotKey.endsWith('_1')
            ? '1'
            : slotKey.endsWith('_2')
              ? '2'
              : slotKey.endsWith('_3')
                ? '3'
                : '기본';
  const serviceLabel = row.site === 'air'
    ? '항공'
    : `숙박 · ${slotKey.includes('hotel')
        ? '호텔'
        : slotKey.includes('life')
          ? '한달살기'
          : slotKey.includes('private')
            ? '프라이빗'
            : slotKey.includes('activities')
              ? '액티비티'
              : '기본'}`;
  const familyLabel = familyLabelMap[row.family] ?? row.family;

  return {
    slotKey,
    shortId,
    serviceLabel,
    familyLabel,
    slotLabel: `${familyLabel} · ${positionLabel}`,
    rawSite: row.site,
    rawFamily: row.family,
    iconHint: row.site === 'air' ? '항공 히어로는 아이콘 없이 운영' : '텍스트형 배너에서만 아이콘을 노출'
  };
});

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
      searchPlaceholder: '배너 제목, 섹션, ID로 검색',
      primaryAction: '배너 등록',
      emptyMessage: '배너 데이터가 없습니다.',
      siteOptions: [
        { value: 'integrated', label: '통합' },
        { value: 'air', label: '항공' },
        { value: 'stay', label: '숙박' }
      ],
      familyOptions: [
        { value: 'promo_card_family', label: '프로모 카드' },
        { value: 'inline_cta_banner_family', label: '인라인 CTA' },
        { value: 'hero_image_set', label: '히어로 이미지' }
      ],
      iconKeyOptions: [
        { value: 'plane', label: 'plane' },
        { value: 'coins', label: 'coins' },
        { value: 'car', label: 'car' },
        { value: 'crown', label: 'crown' },
        { value: 'camera', label: 'camera' },
        { value: 'wine', label: 'wine' },
        { value: 'luggage', label: 'luggage' },
        { value: 'map', label: 'map' },
        { value: 'flower-2', label: 'flower-2' }
      ],
      slotMetadata: bannerSlotMetadata,
      columns: ['배너 ID', '사이트 / 서비스', '타입 / 위치', '콘텐츠', '이미지', '상태', '관리'],
      fallbackRows: bannerFallbackRows,
      rows: []
    }
  }
};

export default cmsConfig;
