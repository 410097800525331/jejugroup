import { getHotelSearchInitialStateFromUrl } from "./hotelSearchQuery";

export interface HotelListFilterOption {
  checked?: boolean;
  count?: number;
  description?: string;
  id: string;
  label: string;
}

export interface HotelListFilterSection {
  id: string;
  options: HotelListFilterOption[];
  title: string;
}

export interface HotelListPageHotel {
  badge: string;
  currentPrice: string;
  filterIds: string[];
  id: string;
  imageUrl: string;
  location: string;
  locationId: string;
  originalPrice: string;
  propertyTypeId: string;
  reviewLabel: string;
  reviewScore: string;
  stars: string;
  tags: string[];
  title: string;
}

export interface HotelListSearchSummary {
  dateLabel: string;
  destinationLabel: string;
  guestLabel: string;
}

export interface HotelListPageData {
  filterSections: HotelListFilterSection[];
  hotels: HotelListPageHotel[];
  mapButtonLabel: string;
  migrationPath?: string;
  region: string;
  regionLabel: string;
  searchSummary: HotelListSearchSummary;
  shell?: string;
}

export interface HotelFilterState {
  guestRatingThreshold: number | null;
  locationIds: string[];
  maxPrice: number | null;
  minPrice: number | null;
  selectedOptionIds: string[];
  propertyTypeIds: string[];
}

interface RegionProfile {
  countryLabel: string;
  hotels: HotelListPageHotel[];
  label: string;
  mapButtonLabel: string;
  popularFilters: HotelListFilterOption[];
  propertyTypes: HotelListFilterOption[];
  guestRatings: HotelListFilterOption[];
  locations: HotelListFilterOption[];
  paymentOptions: HotelListFilterOption[];
  amenities: HotelListFilterOption[];
}

const DEFAULT_REGION = "hiroshima";

const REGION_PROFILES: Record<string, RegionProfile> = {
  hiroshima: {
    label: "히로시마",
    countryLabel: "일본",
    mapButtonLabel: "지도에서 히로시마 호텔 보기",
    popularFilters: [
      { id: "prepaid", label: "지금 바로 결제" },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제" },
      { id: "rating-9", label: "투숙객 평점: 9+ 최고" },
      { id: "kitchen", label: "주방" },
      { id: "internet", label: "인터넷" },
      { id: "frontdesk", label: "24시간 프런트 데스크" },
      { id: "downtown", label: "다운타운" },
      { id: "other-popular", label: "기타" }
    ],
    propertyTypes: [
      { id: "hotel", label: "호텔", count: 302 },
      { id: "resort", label: "리조트", count: 4 },
      { id: "ryokan", label: "료칸", count: 20 },
      { id: "apartment", label: "아파트", count: 53 },
      { id: "guesthouse", label: "게스트하우스 / 비앤비", count: 12 },
      { id: "hostel", label: "호스텔", count: 11 },
      { id: "serviced-apartment", label: "서비스 아파트", count: 4 },
      { id: "inn", label: "인", count: 1 },
      { id: "resort-villa", label: "리조트 빌라", count: 1 },
      { id: "private-house-entire", label: "프라이빗 하우스 전체", count: 7 },
      { id: "capsule", label: "캡슐 호텔", count: 4 },
      { id: "love-hotel", label: "러브호텔", count: 1 },
      { id: "villa", label: "빌라", count: 2 }
    ],
    locations: [
      { id: "hiroshima-center", label: "히로시마", count: 306 },
      { id: "miyajima", label: "미야지마", count: 63, description: "럭셔리 숙박, 인기 명소" },
      { id: "hatsukaichi", label: "하쓰카이치", count: 12 },
      { id: "naka-ward", label: "나카 워드", count: 8 },
      { id: "others", label: "기타", count: 6 },
      { id: "etajima", label: "에타지마", count: 6 },
      { id: "downtown-location", label: "다운타운", count: 5 },
      { id: "nishi-ward", label: "니시구", count: 3 },
      { id: "otake", label: "오타케", count: 3 },
      { id: "yokogawa", label: "요코가와", count: 3 },
      { id: "minami-ward", label: "미나미 와드", count: 2 },
      { id: "hiroshima-station-area", label: "히로시마역", count: 1 }
    ],
    paymentOptions: [
      { id: "free-cancel", label: "예약 무료 취소", count: 88 },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제", count: 22 },
      { id: "book-now-pay-later", label: "선예약 후지불", count: 51 },
      { id: "prepaid", label: "지금 바로 결제", count: 107 }
    ],
    guestRatings: [
      { id: "rating-9", label: "9+ 최고", count: 72 },
      { id: "rating-8", label: "8+ 우수", count: 228 },
      { id: "rating-7", label: "7+ 좋음", count: 290 }
    ],
    amenities: [
      { id: "pool", label: "수영장", count: 5 },
      { id: "parking", label: "주차장", count: 99 },
      { id: "fitness", label: "피트니스", count: 6 },
      { id: "restaurant", label: "레스토랑", count: 63 },
      { id: "airport-transfer", label: "공항 이동 교통편 서비스", count: 1 },
      { id: "family-friendly", label: "가족/아동 여행객 친화형 시설", count: 117 },
      { id: "non-smoking", label: "금연", count: 133 },
      { id: "smoking-area", label: "흡연 구역", count: 94 },
      { id: "pet-friendly", label: "반려동물 동반 가능", count: 19 },
      { id: "accessible", label: "장애인용 편의 시설/서비스", count: 42 },
      { id: "business", label: "비즈니스 관련 편의 시설", count: 29 }
    ],
    hotels: [
      {
        id: "hiroshima-premium",
        title: "히로시마 프리미엄 호텔",
        stars: "★★★★★",
        location: "히로시마 시내 중심 · 원폭 돔 인근",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "9.2",
        reviewLabel: "Excellent",
        originalPrice: "₩250,000",
        currentPrice: "₩189,000",
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        badge: "특가 상품",
        filterIds: ["internet", "spa", "prepaid", "restaurant"],
        tags: ["무료 Wi-Fi", "스파 & 마사지", "피트니스 센터"]
      },
      {
        id: "miyajima-grand",
        title: "미야지마 그랜드 리조트",
        stars: "★★★★",
        location: "미야지마 해변가 · 선착장 도보 10분",
        locationId: "miyajima",
        propertyTypeId: "resort",
        reviewScore: "8.8",
        reviewLabel: "Great",
        originalPrice: "₩320,000",
        currentPrice: "₩265,000",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
        badge: "인기 숙소",
        filterIds: ["pay-at-hotel", "restaurant", "pool"],
        tags: ["조식 포함", "오션뷰", "공항 셔틀"]
      },
      {
        id: "hiroshima-station",
        title: "히로시마 스테이션 비즈니스 호텔",
        stars: "★★★",
        location: "히로시마역 도보 5분",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "8.4",
        reviewLabel: "Very Good",
        originalPrice: "₩170,000",
        currentPrice: "₩132,000",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        badge: "조식 특가",
        filterIds: ["frontdesk", "free-cancel", "internet"],
        tags: ["역세권", "셀프 체크인", "무료 취소"]
      },
      {
        id: "setouchi-spa",
        title: "세토우치 스파 스테이",
        stars: "★★★★★",
        location: "세토우치 오션뷰",
        locationId: "miyajima",
        propertyTypeId: "resort",
        reviewScore: "9.5",
        reviewLabel: "Exceptional",
        originalPrice: "₩410,000",
        currentPrice: "₩338,000",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        badge: "럭셔리 추천",
        filterIds: ["spa", "pool", "prepaid"],
        tags: ["인피니티 풀", "사우나", "레이트 체크아웃"]
      },
      {
        id: "rihga-royal",
        title: "리가 로얄 호텔 히로시마",
        stars: "★★★★★",
        location: "히로시마 평화공원 도보 3분",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "9.1",
        reviewLabel: "Excellent",
        originalPrice: "₩210,000",
        currentPrice: "₩150,000",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
        badge: "베스트셀러",
        filterIds: ["restaurant", "downtown", "non-smoking"],
        tags: ["대욕장", "조식 맛집"]
      },
      {
        id: "ana-crowne-plaza",
        title: "ANA 크라운 플라자 히로시마",
        stars: "★★★★",
        location: "나카 워드 중심가",
        locationId: "naka-ward",
        propertyTypeId: "hotel",
        reviewScore: "8.5",
        reviewLabel: "Excellent",
        originalPrice: "₩180,000",
        currentPrice: "₩120,000",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        badge: "특가",
        filterIds: ["fitness", "business", "downtown"],
        tags: ["피트니스", "비즈니스"]
      },
      {
        id: "candeo-hiroshima",
        title: "칸데오 호텔 히로시마",
        stars: "★★★★",
        location: "핫초보리 역 인근",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "8.9",
        reviewLabel: "Excellent",
        originalPrice: "₩250,000",
        currentPrice: "₩175,000",
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
        badge: "스파 포함",
        filterIds: ["spa", "downtown", "non-smoking"],
        tags: ["루프탑 스파", "사우나"]
      },
      {
        id: "the-knot",
        title: "The Knot Hiroshima",
        stars: "★★★★",
        location: "평화대로 위치",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "9.3",
        reviewLabel: "Exceptional",
        originalPrice: "₩190,000",
        currentPrice: "₩140,000",
        imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
        badge: "디자인 호텔",
        filterIds: ["downtown", "restaurant", "non-smoking"],
        tags: ["루프탑 바", "모던 인테리어"]
      },
      {
        id: "washington-hotel",
        title: "워싱턴 호텔",
        stars: "★★★",
        location: "히로시마 역세권",
        locationId: "hiroshima-station-area",
        propertyTypeId: "hotel",
        reviewScore: "8.2",
        reviewLabel: "Very Good",
        originalPrice: "₩130,000",
        currentPrice: "₩95,000",
        imageUrl: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=600&q=80",
        badge: "가성비 갑",
        filterIds: ["frontdesk", "station", "internet"],
        tags: ["깔끔함", "교통 편리"]
      },
      {
        id: "sheraton-grand",
        title: "쉐라톤 그랜드 히로시마",
        stars: "★★★★★",
        location: "히로시마역 직결",
        locationId: "hiroshima-station-area",
        propertyTypeId: "hotel",
        reviewScore: "9.6",
        reviewLabel: "Exceptional",
        originalPrice: "₩350,000",
        currentPrice: "₩280,000",
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        badge: "럭셔리",
        filterIds: ["pool", "fitness", "restaurant"],
        tags: ["수영장", "클럽 라운지"]
      },
      {
        id: "hotel-intergate",
        title: "호텔 인터게이트 히로시마",
        stars: "★★★★",
        location: "히로시마 중심가 · 평화공원 도보 8분",
        locationId: "hiroshima-center",
        propertyTypeId: "hotel",
        reviewScore: "8.9",
        reviewLabel: "Excellent",
        originalPrice: "₩210,000",
        currentPrice: "₩167,000",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
        badge: "기간 한정 세일",
        filterIds: ["restaurant", "prepaid", "non-smoking", "internet"],
        tags: ["대욕장", "라운지", "조식 포함"]
      },
      {
        id: "quintessa-kanayamacho",
        title: "퀸테사 호텔 히로시마 카나야마쵸",
        stars: "★★★★★",
        location: "나카 워드 · 전철역 도보 4분",
        locationId: "naka-ward",
        propertyTypeId: "hotel",
        reviewScore: "8.6",
        reviewLabel: "Excellent",
        originalPrice: "₩225,000",
        currentPrice: "₩192,000",
        imageUrl: "https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80",
        badge: "도심 특가",
        filterIds: ["internet", "book-now-pay-later", "restaurant", "business"],
        tags: ["시티뷰", "비즈니스", "역세권"]
      },
      {
        id: "hana-ryokan",
        title: "히로시마 하나 료칸",
        stars: "★★★★",
        location: "미야지마 · 도리이 전망 포인트 인근",
        locationId: "miyajima",
        propertyTypeId: "ryokan",
        reviewScore: "9.0",
        reviewLabel: "Excellent",
        originalPrice: "₩280,000",
        currentPrice: "₩236,000",
        imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=600&q=80",
        badge: "전통 감성",
        filterIds: ["spa", "pay-at-hotel", "restaurant", "other-popular"],
        tags: ["가이세키", "노천탕", "다다미 객실"]
      },
      {
        id: "peace-residence",
        title: "평화공원 레지던스 스테이",
        stars: "★★★",
        location: "히로시마 중심가 · 장기투숙 친화",
        locationId: "hiroshima-center",
        propertyTypeId: "serviced-apartment",
        reviewScore: "8.7",
        reviewLabel: "Excellent",
        originalPrice: "₩198,000",
        currentPrice: "₩149,000",
        imageUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600&q=80",
        badge: "장기숙박 특가",
        filterIds: ["kitchen", "parking", "free-cancel", "family-friendly"],
        tags: ["세탁기", "간이주방", "가족 추천"]
      },
      {
        id: "naka-apartment-suite",
        title: "나카 워드 아파트 스위트",
        stars: "★★★",
        location: "나카 워드 · 쇼핑가 접근 우수",
        locationId: "naka-ward",
        propertyTypeId: "apartment",
        reviewScore: "8.5",
        reviewLabel: "Excellent",
        originalPrice: "₩176,000",
        currentPrice: "₩136,000",
        imageUrl: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=600&q=80",
        badge: "레지던스 추천",
        filterIds: ["kitchen", "internet", "downtown", "non-smoking"],
        tags: ["풀사이즈 냉장고", "발코니", "셀프 체크인"]
      },
      {
        id: "hiroshima-city-hostel",
        title: "히로시마 시티 호스텔",
        stars: "★★",
        location: "요코가와 · 백패커 인기 구역",
        locationId: "yokogawa",
        propertyTypeId: "hostel",
        reviewScore: "8.1",
        reviewLabel: "Very Good",
        originalPrice: "₩88,000",
        currentPrice: "₩63,000",
        imageUrl: "https://images.unsplash.com/photo-1521783988139-89397d761dce?w=600&q=80",
        badge: "백패커 픽",
        filterIds: ["internet", "frontdesk", "free-cancel", "other-popular"],
        tags: ["도미토리", "공용 라운지", "가성비"]
      },
      {
        id: "miyajima-guesthouse",
        title: "미야지마 게스트하우스 츠츠미",
        stars: "★★",
        location: "미야지마 · 선착장 도보 6분",
        locationId: "miyajima",
        propertyTypeId: "guesthouse",
        reviewScore: "8.7",
        reviewLabel: "Excellent",
        originalPrice: "₩120,000",
        currentPrice: "₩91,000",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
        badge: "현지 감성",
        filterIds: ["internet", "pay-at-hotel", "family-friendly", "other-popular"],
        tags: ["공용 키친", "섬 산책", "친절한 호스트"]
      },
      {
        id: "yokogawa-capsule",
        title: "요코가와 캡슐 인",
        stars: "★★",
        location: "요코가와역 도보 2분",
        locationId: "yokogawa",
        propertyTypeId: "capsule",
        reviewScore: "8.0",
        reviewLabel: "Very Good",
        originalPrice: "₩79,000",
        currentPrice: "₩55,000",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        badge: "초특가",
        filterIds: ["internet", "frontdesk", "prepaid", "non-smoking"],
        tags: ["1인 여행", "사우나", "역세권"]
      },
      {
        id: "hatsukaichi-private-house",
        title: "하쓰카이치 프라이빗 하우스",
        stars: "★★★★",
        location: "하쓰카이치 · 가족 단위 인기",
        locationId: "hatsukaichi",
        propertyTypeId: "private-house-entire",
        reviewScore: "9.1",
        reviewLabel: "Excellent",
        originalPrice: "₩340,000",
        currentPrice: "₩286,000",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
        badge: "독채 추천",
        filterIds: ["kitchen", "parking", "family-friendly", "pet-friendly"],
        tags: ["마당", "BBQ", "주차 포함"]
      },
      {
        id: "etajima-seaside-villa",
        title: "에타지마 씨사이드 빌라",
        stars: "★★★★★",
        location: "에타지마 · 오션프런트 독채",
        locationId: "etajima",
        propertyTypeId: "villa",
        reviewScore: "9.4",
        reviewLabel: "Exceptional",
        originalPrice: "₩460,000",
        currentPrice: "₩389,000",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
        badge: "프라이빗 럭셔리",
        filterIds: ["pool", "spa", "parking", "pet-friendly"],
        tags: ["오션뷰", "프라이빗 풀", "테라스"]
      },
      {
        id: "otake-romance-hotel",
        title: "오타케 로맨스 호텔",
        stars: "★★★",
        location: "오타케 · 심야 체크인 가능",
        locationId: "otake",
        propertyTypeId: "love-hotel",
        reviewScore: "7.8",
        reviewLabel: "Good",
        originalPrice: "₩118,000",
        currentPrice: "₩84,000",
        imageUrl: "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=600&q=80",
        badge: "커플 특가",
        filterIds: ["frontdesk", "book-now-pay-later", "smoking-area", "other-popular"],
        tags: ["늦은 체크인", "프라이빗", "합리적 가격"]
      },
      {
        id: "miyajima-resort-villa",
        title: "미야지마 리조트 빌라",
        stars: "★★★★★",
        location: "미야지마 · 럭셔리 오션 프런트",
        locationId: "miyajima",
        propertyTypeId: "resort-villa",
        reviewScore: "9.5",
        reviewLabel: "Exceptional",
        originalPrice: "₩520,000",
        currentPrice: "₩448,000",
        imageUrl: "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600&q=80",
        badge: "럭셔리 빌라",
        filterIds: ["pool", "spa", "prepaid", "airport-transfer"],
        tags: ["오션프런트", "버틀러 서비스", "선셋"]
      },
      {
        id: "minami-ward-inn",
        title: "미나미 와드 인",
        stars: "★★★",
        location: "미나미 와드 · 공항버스 접근 편리",
        locationId: "minami-ward",
        propertyTypeId: "inn",
        reviewScore: "8.3",
        reviewLabel: "Very Good",
        originalPrice: "₩112,000",
        currentPrice: "₩86,000",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
        badge: "실속 숙소",
        filterIds: ["internet", "free-cancel", "frontdesk", "business"],
        tags: ["공항버스", "가벼운 숙박", "조용함"]
      }
    ]
  },
  jeju: {
    label: "제주",
    countryLabel: "대한민국",
    mapButtonLabel: "지도에서 제주 호텔 보기",
    popularFilters: [
      { id: "ocean-view", label: "오션뷰" },
      { id: "pool-villa", label: "풀빌라" },
      { id: "breakfast", label: "조식 포함" },
      { id: "rental-friendly", label: "렌터카 이동 편리" }
    ],
    propertyTypes: [
      { id: "hotel", label: "호텔", count: 188 },
      { id: "resort", label: "리조트", count: 41 },
      { id: "poolvilla", label: "풀빌라", count: 32 },
      { id: "private-house", label: "독채 숙소", count: 27 }
    ],
    locations: [
      { id: "jeju-city", label: "제주시", count: 109 },
      { id: "seogwipo", label: "서귀포시", count: 96, description: "바다 전망, 리조트 밀집" },
      { id: "jungmun", label: "중문", count: 44 },
      { id: "aewol", label: "애월", count: 36 }
    ],
    paymentOptions: [
      { id: "free-cancel", label: "예약 무료 취소", count: 81 },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제", count: 42 },
      { id: "prepaid", label: "지금 바로 결제", count: 133 }
    ],
    guestRatings: [
      { id: "rating-9", label: "9+ 최고", count: 66 },
      { id: "rating-8", label: "8+ 우수", count: 142 },
      { id: "rating-7", label: "7+ 좋음", count: 181 }
    ],
    amenities: [
      { id: "pool", label: "수영장", count: 58 },
      { id: "spa", label: "스파", count: 17 },
      { id: "parking", label: "무료 주차", count: 144 },
      { id: "ocean", label: "오션뷰 객실", count: 73 }
    ],
    hotels: [
      {
        id: "jeju-grand-hyatt",
        title: "그랜드 하얏트 제주",
        stars: "★★★★★",
        location: "제주시 노형동 · 공항 15분",
        locationId: "jeju-city",
        propertyTypeId: "hotel",
        reviewScore: "9.1",
        reviewLabel: "Excellent",
        originalPrice: "₩420,000",
        currentPrice: "₩349,000",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        badge: "JEJU PICK",
        filterIds: ["parking", "pool", "breakfast"],
        tags: ["도심형 럭셔리", "실내 수영장", "라운지"]
      },
      {
        id: "jeju-shinhwa",
        title: "제주신화월드 메리어트",
        stars: "★★★★★",
        location: "서귀포 안덕면 · 가족 여행 인기",
        locationId: "seogwipo",
        propertyTypeId: "resort",
        reviewScore: "8.9",
        reviewLabel: "Great",
        originalPrice: "₩360,000",
        currentPrice: "₩289,000",
        imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
        badge: "패밀리 특가",
        filterIds: ["pool", "breakfast", "rental-friendly"],
        tags: ["워터파크", "키즈 친화", "조식 포함"]
      },
      {
        id: "jeju-aewol-stay",
        title: "애월 오션 스테이",
        stars: "★★★★",
        location: "애월 해안도로 · 카페 거리 인근",
        locationId: "aewol",
        propertyTypeId: "hotel",
        reviewScore: "8.7",
        reviewLabel: "Excellent",
        originalPrice: "₩210,000",
        currentPrice: "₩168,000",
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        badge: "오션뷰",
        filterIds: ["ocean-view", "parking", "rental-friendly"],
        tags: ["노을 뷰", "무료 주차", "커플 추천"]
      },
      {
        id: "jeju-jungmun-resort",
        title: "중문 씨뷰 리조트",
        stars: "★★★★",
        location: "중문 관광단지 · 해변 도보권",
        locationId: "jungmun",
        propertyTypeId: "resort",
        reviewScore: "9.0",
        reviewLabel: "Excellent",
        originalPrice: "₩280,000",
        currentPrice: "₩228,000",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
        badge: "리조트 추천",
        filterIds: ["pool", "spa", "ocean-view"],
        tags: ["야외 수영장", "스파", "레이트 체크아웃"]
      }
    ]
  },
  osaka: {
    label: "오사카",
    countryLabel: "일본",
    mapButtonLabel: "지도에서 오사카 호텔 보기",
    popularFilters: [
      { id: "namba", label: "난바 도보권" },
      { id: "shopping", label: "쇼핑 중심지" },
      { id: "station", label: "역세권" },
      { id: "family", label: "유니버설 접근성" }
    ],
    propertyTypes: [
      { id: "hotel", label: "호텔", count: 544 },
      { id: "resort", label: "리조트", count: 11 },
      { id: "capsule", label: "캡슐 호텔", count: 26 },
      { id: "apartment", label: "서비스 아파트", count: 88 }
    ],
    locations: [
      { id: "namba", label: "난바", count: 142 },
      { id: "umeda", label: "우메다", count: 101, description: "비즈니스, 백화점 중심" },
      { id: "shinsaibashi", label: "신사이바시", count: 88 },
      { id: "universal", label: "유니버설 시티", count: 24 }
    ],
    paymentOptions: [
      { id: "free-cancel", label: "예약 무료 취소", count: 133 },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제", count: 67 },
      { id: "prepaid", label: "지금 바로 결제", count: 302 }
    ],
    guestRatings: [
      { id: "rating-9", label: "9+ 최고", count: 98 },
      { id: "rating-8", label: "8+ 우수", count: 314 },
      { id: "rating-7", label: "7+ 좋음", count: 463 }
    ],
    amenities: [
      { id: "station", label: "역 도보 5분", count: 241 },
      { id: "breakfast", label: "조식 포함", count: 154 },
      { id: "family", label: "패밀리룸", count: 96 },
      { id: "onsen", label: "온천/대욕장", count: 44 }
    ],
    hotels: [
      {
        id: "osaka-ritz",
        title: "리츠칼튼 오사카",
        stars: "★★★★★",
        location: "우메다 · 오사카역 차량 5분",
        locationId: "umeda",
        propertyTypeId: "hotel",
        reviewScore: "9.4",
        reviewLabel: "Exceptional",
        originalPrice: "₩520,000",
        currentPrice: "₩438,000",
        imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
        badge: "럭셔리 추천",
        filterIds: ["shopping", "breakfast", "onsen"],
        tags: ["클래식 인테리어", "라운지", "미슐랭 다이닝"]
      },
      {
        id: "osaka-cross",
        title: "크로스 호텔 오사카",
        stars: "★★★★",
        location: "도톤보리 · 난바역 도보 3분",
        locationId: "namba",
        propertyTypeId: "hotel",
        reviewScore: "8.9",
        reviewLabel: "Great",
        originalPrice: "₩260,000",
        currentPrice: "₩214,000",
        imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
        badge: "쇼핑 특화",
        filterIds: ["namba", "shopping", "station"],
        tags: ["도톤보리 인접", "커플 추천", "역세권"]
      },
      {
        id: "osaka-liber",
        title: "리베르 호텔 오사카",
        stars: "★★★★",
        location: "유니버설 시티 · 가족 여행",
        locationId: "universal",
        propertyTypeId: "resort",
        reviewScore: "9.0",
        reviewLabel: "Excellent",
        originalPrice: "₩310,000",
        currentPrice: "₩258,000",
        imageUrl: "https://images.unsplash.com/photo-1590490360182-c87295ec4232?w=600&q=80",
        badge: "패밀리 인기",
        filterIds: ["family", "breakfast", "onsen"],
        tags: ["대욕장", "USJ 접근성", "조식 포함"]
      },
      {
        id: "osaka-capsule-premium",
        title: "난바 프리미엄 캡슐 스테이",
        stars: "★★★",
        location: "난카이 난바역 도보 4분",
        locationId: "namba",
        propertyTypeId: "capsule",
        reviewScore: "8.5",
        reviewLabel: "Very Good",
        originalPrice: "₩92,000",
        currentPrice: "₩68,000",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        badge: "가성비",
        filterIds: ["namba", "station"],
        tags: ["1인 여행", "깔끔함", "역세권"]
      }
    ]
  },
};

const readSearchParams = (search: string) => new URLSearchParams(search);

const formatShortDateLabel = (timestamp: number | null) => {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const buildGuestLabel = (adults: number, children: number, rooms: number) => {
  const parts = [`성인 ${adults}명`];
  if (children > 0) {
    parts.push(`아동 ${children}명`);
  }
  parts.push(`객실 ${rooms}개`);
  return parts.join(", ");
};

const PROPERTY_TYPE_ALIAS_MAP: Record<string, string[]> = {
  hotel: ["hotel"],
  resort: ["resort", "resort-type"],
  ryokan: ["ryokan"],
  apartment: ["apartment"],
  guesthouse: ["guesthouse"],
  hostel: ["hostel"],
  "serviced-apartment": ["serviced-apartment"],
  inn: ["inn"],
  "resort-villa": ["resort-villa"],
  "private-house-entire": ["private-house-entire", "private-house"],
  capsule: ["capsule"],
  "love-hotel": ["love-hotel"],
  villa: ["villa"],
  poolvilla: ["poolvilla"]
};

const HIROSHIMA_LOCATION_FILTERS: Record<string, string[]> = {
  "hiroshima-center": ["downtown", "ui-city-center", "ui-city-under-2", "ui-atomic-bomb-dome", "ui-peace-museum", "ui-sukkein", "ui-city-break"],
  miyajima: ["ui-city-5-10", "ui-miyajima-shrine", "ui-waterfront", "ui-luxury-retreat"],
  hatsukaichi: ["ui-city-5-10", "ui-miyajima-shrine", "ui-family-trip", "ui-waterfront"],
  "naka-ward": ["downtown", "ui-city-under-2", "ui-okonomimura", "ui-city-break"],
  others: ["other-popular", "ui-city-2-5", "ui-city-break"],
  etajima: ["ui-city-5-10", "ui-waterfront", "ui-luxury-retreat"],
  "downtown-location": ["downtown", "ui-city-center", "ui-city-break"],
  "nishi-ward": ["ui-city-2-5", "ui-hiroshima-castle", "ui-business-trip"],
  otake: ["ui-city-5-10", "ui-couple-trip", "other-popular"],
  yokogawa: ["station", "ui-city-2-5", "ui-station-access", "ui-solo-trip"],
  "minami-ward": ["station", "ui-city-2-5", "ui-business-trip"],
  "hiroshima-station-area": ["station", "ui-city-under-2", "ui-hiroshima-station", "ui-station-access"]
};

interface HiroshimaHotelVariant {
  badge?: string;
  currentPriceDelta: number;
  extraFilterIds: string[];
  extraTags: string[];
  id: string;
  originalPriceDelta: number;
  reviewDelta: number;
  titleSuffix: string;
}

const HIROSHIMA_VARIANTS: HiroshimaHotelVariant[] = [
  {
    id: "prime",
    titleSuffix: "프라임",
    badge: "얼리버드 특가",
    currentPriceDelta: 18000,
    originalPriceDelta: 26000,
    reviewDelta: 0.1,
    extraFilterIds: ["prepaid", "ui-breakfast-included", "ui-early-checkin", "ui-location-8"],
    extraTags: ["조식 포함", "도심 접근"]
  },
  {
    id: "residence",
    titleSuffix: "레지던스",
    badge: "장기투숙 추천",
    currentPriceDelta: -12000,
    originalPriceDelta: -6000,
    reviewDelta: 0,
    extraFilterIds: ["kitchen", "parking", "book-now-pay-later", "ui-room-kitchen", "ui-washer", "ui-family-trip"],
    extraTags: ["간이주방", "세탁기"]
  },
  {
    id: "signature",
    titleSuffix: "시그니처",
    badge: "무료 업그레이드",
    currentPriceDelta: 26000,
    originalPriceDelta: 34000,
    reviewDelta: 0.2,
    extraFilterIds: ["spa", "pool", "ui-free-sauna", "ui-late-checkout", "ui-luxury-retreat", "ui-location-9"],
    extraTags: ["사우나", "라운지"]
  }
];

export const parseHotelPriceValue = (price: string) => {
  const parsed = Number.parseInt(price.replace(/[^\d]/g, ""), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatPriceValue = (price: number) => {
  return `₩${Math.max(49000, price).toLocaleString("ko-KR")}`;
};

const deriveReviewLabel = (reviewScore: number) => {
  if (reviewScore >= 9.2) {
    return "Exceptional";
  }

  if (reviewScore >= 8.5) {
    return "Excellent";
  }

  if (reviewScore >= 8.0) {
    return "Great";
  }

  return "Very Good";
};

const deriveStarFilterId = (stars: string) => {
  const starCount = stars.match(/★/g)?.length ?? 0;

  if (starCount >= 5) {
    return "ui-five-star";
  }

  if (starCount === 4) {
    return "ui-four-star";
  }

  if (starCount === 3) {
    return "ui-three-star";
  }

  if (starCount === 2) {
    return "ui-two-star";
  }

  return "ui-one-star";
};

const deriveRatingFilters = (reviewScore: number) => {
  if (reviewScore >= 9) {
    return ["rating-9", "rating-8", "rating-7"];
  }

  if (reviewScore >= 8) {
    return ["rating-8", "rating-7"];
  }

  return ["rating-7"];
};

const deriveBrandFilters = (hotel: HotelListPageHotel) => {
  const title = hotel.title.toLowerCase();

  if (title.includes("crowne") || title.includes("ana")) {
    return ["brand-ihg"];
  }

  if (title.includes("칸데오")) {
    return ["brand-candeo"];
  }

  if (title.includes("쉐라톤")) {
    return ["brand-marriott"];
  }

  if (title.includes("스테이션")) {
    return ["brand-apa"];
  }

  if (title.includes("리조트") || title.includes("그랜드")) {
    return ["brand-prince"];
  }

  return ["brand-local"];
};

const derivePropertyTypeFilters = (hotel: HotelListPageHotel) => {
  switch (hotel.propertyTypeId) {
    case "resort":
      return ["ui-king-bed", "ui-balcony", "ui-bathtub", "ui-late-checkout", "ui-two-bedroom", "ui-couple-trip"];
    case "ryokan":
      return ["ui-double-bed", "ui-dinner-included", "ui-bathtub", "ui-onsen-retreat", "ui-couple-trip"];
    case "apartment":
      return ["ui-queen-bed", "ui-room-kitchen", "ui-fridge", "ui-washer", "ui-studio"];
    case "guesthouse":
      return ["ui-single-bed", "ui-room-kitchen", "ui-room-internet", "ui-studio", "ui-solo-trip"];
    case "hostel":
      return ["ui-bunk-bed", "ui-single-bed", "ui-room-internet", "ui-solo-trip", "ui-studio"];
    case "serviced-apartment":
      return ["ui-room-kitchen", "ui-fridge", "ui-washer", "ui-two-bedroom", "ui-family-trip"];
    case "inn":
      return ["ui-double-bed", "ui-room-internet", "ui-business-trip", "ui-city-2-5"];
    case "resort-villa":
      return ["ui-king-bed", "ui-balcony", "ui-three-bedroom", "ui-luxury-retreat", "ui-waterfront"];
    case "private-house-entire":
      return ["ui-king-bed", "ui-room-kitchen", "ui-fridge", "ui-washer", "ui-three-bedroom", "ui-family-trip"];
    case "capsule":
      return ["ui-single-bed", "ui-room-internet", "ui-solo-trip"];
    case "love-hotel":
      return ["ui-king-bed", "ui-couple-trip", "ui-late-checkout"];
    case "villa":
      return ["ui-king-bed", "ui-balcony", "ui-three-bedroom", "ui-luxury-retreat"];
    default:
      return ["ui-double-bed", "ui-heating", "ui-tv", "ui-aircon", "ui-room-internet", "ui-one-bedroom"];
  }
};

const deriveAmenityFilters = (hotel: HotelListPageHotel) => {
  const normalizedTags = hotel.tags.join(" ").toLowerCase();
  const derivedFilterIds: string[] = [];

  if (normalizedTags.includes("조식")) {
    derivedFilterIds.push("ui-breakfast-included");
  }

  if (normalizedTags.includes("사우나") || hotel.filterIds.includes("spa")) {
    derivedFilterIds.push("ui-free-sauna");
  }

  if (normalizedTags.includes("레이트 체크아웃")) {
    derivedFilterIds.push("ui-late-checkout");
  }

  if (hotel.filterIds.includes("airport-transfer")) {
    derivedFilterIds.push("ui-shuttle");
  }

  if (hotel.filterIds.includes("family-friendly")) {
    derivedFilterIds.push("ui-family-trip");
  }

  if (hotel.filterIds.includes("business")) {
    derivedFilterIds.push("ui-business-trip");
  }

  return derivedFilterIds;
};

const deriveLocationScoreFilters = (reviewScore: number) => {
  if (reviewScore >= 9.2) {
    return ["ui-location-9"];
  }

  if (reviewScore >= 8.5) {
    return ["ui-location-8"];
  }

  if (reviewScore >= 7.8) {
    return ["ui-location-7"];
  }

  return ["ui-location-6"];
};

const enrichHiroshimaHotel = (
  hotel: HotelListPageHotel,
  variant: HiroshimaHotelVariant | null,
  index: number
): HotelListPageHotel => {
  const reviewScoreValue = Math.max(
    7.5,
    Math.min(9.8, Number.parseFloat(hotel.reviewScore) + (variant?.reviewDelta ?? 0) + ((index % 3) - 1) * 0.05)
  );

  const currentPriceValue = parseHotelPriceValue(hotel.currentPrice) + (variant?.currentPriceDelta ?? 0) + (index % 5) * 3000;
  const originalPriceValue = Math.max(
    currentPriceValue + 14000,
    parseHotelPriceValue(hotel.originalPrice) + (variant?.originalPriceDelta ?? 0) + (index % 4) * 4000
  );

  const derivedFilterIds = dedupeFilters([
    ...hotel.filterIds,
    ...(HIROSHIMA_LOCATION_FILTERS[hotel.locationId] ?? []),
    ...deriveRatingFilters(reviewScoreValue),
    deriveStarFilterId(hotel.stars),
    ...derivePropertyTypeFilters(hotel),
    ...deriveAmenityFilters(hotel),
    ...deriveLocationScoreFilters(reviewScoreValue),
    ...deriveBrandFilters(hotel),
    ...(reviewScoreValue >= 9.3 && hotel.stars.includes("★★★★★") ? ["ui-agoda-luxe"] : []),
    ...(variant?.extraFilterIds ?? [])
  ]);

  return {
    ...hotel,
    id: variant ? `${hotel.id}-${variant.id}` : hotel.id,
    title: variant ? `${hotel.title} ${variant.titleSuffix}` : hotel.title,
    badge: variant?.badge ?? hotel.badge,
    reviewScore: reviewScoreValue.toFixed(1),
    reviewLabel: deriveReviewLabel(reviewScoreValue),
    originalPrice: formatPriceValue(originalPriceValue),
    currentPrice: formatPriceValue(currentPriceValue),
    filterIds: derivedFilterIds,
    tags: Array.from(new Set([...hotel.tags, ...(variant?.extraTags ?? [])])).slice(0, 4)
  };
};

const expandHiroshimaHotels = (hotels: HotelListPageHotel[]) => {
  const expandedHotels = hotels.flatMap((hotel, index) => {
    return [
      enrichHiroshimaHotel(hotel, null, index),
      ...HIROSHIMA_VARIANTS.map((variant) => enrichHiroshimaHotel(hotel, variant, index))
    ];
  });

  return expandedHotels;
};

interface RegionLayoutPreset {
  landmarkOptions: Array<Pick<HotelListFilterOption, "id" | "label">>;
  locationFilters: Record<string, string[]>;
}

const DEFAULT_REGION_LAYOUT_PRESET = (regionLabel: string): RegionLayoutPreset => ({
  landmarkOptions: [
    { id: "ui-local-central", label: `${regionLabel} 중심가` },
    { id: "ui-local-station", label: `${regionLabel} 중앙역` },
    { id: "ui-local-waterfront", label: `${regionLabel} 워터프런트` },
    { id: "ui-local-old-town", label: `${regionLabel} 올드타운` },
    { id: "ui-local-landmark-1", label: `${regionLabel} 대표 명소` },
    { id: "ui-local-landmark-2", label: `${regionLabel} 쇼핑 거리` }
  ],
  locationFilters: {}
});

const resolveRegionLayoutPreset = (region: string, regionLabel: string): RegionLayoutPreset => {
  if (region === "hiroshima") {
    return {
      landmarkOptions: [
        { id: "ui-okonomimura", label: "오코노미무라" },
        { id: "ui-atomic-bomb-dome", label: "원폭 돔" },
        { id: "ui-peace-museum", label: "히로시마 평화 기념관" },
        { id: "ui-sukkein", label: "수케이엔 정원" },
        { id: "ui-hiroshima-castle", label: "히로시마 성" },
        { id: "ui-miyajima-shrine", label: "이쓰쿠시마 신사" },
        { id: "ui-hiroshima-station", label: "히로시마역" }
      ],
      locationFilters: HIROSHIMA_LOCATION_FILTERS
    };
  }

  if (region === "jeju") {
    return {
      landmarkOptions: [
        { id: "ui-jeju-airport", label: "제주국제공항" },
        { id: "ui-dongmun-market", label: "동문시장" },
        { id: "ui-hallasan", label: "한라산" },
        { id: "ui-seongsan", label: "성산일출봉" },
        { id: "ui-jungmun-tourism", label: "중문관광단지" },
        { id: "ui-aewol-coast", label: "애월 해안도로" },
        { id: "ui-hyeopjae", label: "협재해변" }
      ],
      locationFilters: {
        "jeju-city": ["ui-city-center", "ui-city-under-2", "ui-jeju-airport", "ui-dongmun-market", "ui-city-break"],
        seogwipo: ["ui-city-5-10", "ui-seongsan", "ui-waterfront", "ui-luxury-retreat"],
        jungmun: ["ui-city-5-10", "ui-jungmun-tourism", "ui-hyeopjae", "ui-waterfront", "ui-luxury-retreat"],
        aewol: ["ui-city-2-5", "ui-aewol-coast", "ui-hallasan", "ui-waterfront", "ui-couple-trip"]
      }
    };
  }

  if (region === "osaka") {
    return {
      landmarkOptions: [
        { id: "ui-dotonbori", label: "도톤보리" },
        { id: "ui-osaka-castle", label: "오사카성" },
        { id: "ui-umeda-sky", label: "우메다 스카이 빌딩" },
        { id: "ui-usj", label: "유니버설 스튜디오 재팬" },
        { id: "ui-kuromon", label: "구로몬 시장" },
        { id: "ui-shinsaibashi-street", label: "신사이바시" },
        { id: "ui-kaiyukan", label: "가이유칸" }
      ],
      locationFilters: {
        namba: ["ui-city-center", "ui-city-under-2", "ui-dotonbori", "ui-kuromon", "ui-city-break", "ui-station-access"],
        umeda: ["ui-city-center", "ui-city-under-2", "ui-umeda-sky", "ui-osaka-castle", "ui-city-break", "ui-business-trip"],
        shinsaibashi: ["ui-city-center", "ui-city-under-2", "ui-shinsaibashi-street", "ui-dotonbori", "ui-city-break"],
        universal: ["ui-city-5-10", "ui-usj", "ui-kaiyukan", "ui-family-trip", "ui-waterfront"]
      }
    };
  }

  return DEFAULT_REGION_LAYOUT_PRESET(regionLabel);
};

const resolveFallbackLocationFilters = (
  profile: RegionProfile,
  locationId: string,
  landmarkIds: string[]
) => {
  const locationIndex = Math.max(0, profile.locations.findIndex((location) => location.id === locationId));

  if (locationIndex === 0) {
    return ["ui-city-center", "ui-city-under-2", "ui-city-break", ...landmarkIds.slice(0, 2)];
  }

  if (locationIndex === 1) {
    return ["ui-city-2-5", "ui-waterfront", ...landmarkIds.slice(2, 4)];
  }

  if (locationIndex === 2) {
    return ["ui-city-2-5", "ui-station-access", ...landmarkIds.slice(1, 3)];
  }

  return ["ui-city-5-10", ...landmarkIds.slice(-2)];
};

const deriveExperienceFilters = (hotel: HotelListPageHotel) => {
  const reviewScoreValue = Number.parseFloat(hotel.reviewScore) || 0;
  const normalizedLocation = hotel.location.toLowerCase();
  const normalizedTags = hotel.tags.join(" ").toLowerCase();
  const derivedFilterIds: string[] = [];

  if (hotel.filterIds.includes("family-friendly") || hotel.filterIds.includes("family") || normalizedTags.includes("가족")) {
    derivedFilterIds.push("ui-family-trip");
  }

  if (normalizedTags.includes("커플") || hotel.propertyTypeId === "resort" || hotel.propertyTypeId === "villa" || hotel.propertyTypeId === "poolvilla") {
    derivedFilterIds.push("ui-couple-trip");
  }

  if (hotel.propertyTypeId === "capsule" || hotel.propertyTypeId === "hostel" || hotel.propertyTypeId === "guesthouse") {
    derivedFilterIds.push("ui-solo-trip");
  }

  if (hotel.filterIds.includes("business") || normalizedTags.includes("비즈니스")) {
    derivedFilterIds.push("ui-business-trip");
  }

  if (
    hotel.filterIds.includes("station") ||
    hotel.filterIds.includes("rental-friendly") ||
    normalizedLocation.includes("역") ||
    normalizedLocation.includes("공항")
  ) {
    derivedFilterIds.push("ui-station-access");
  }

  if (
    normalizedLocation.includes("해변") ||
    normalizedLocation.includes("오션") ||
    normalizedTags.includes("오션") ||
    normalizedTags.includes("해변") ||
    hotel.filterIds.includes("ocean") ||
    hotel.filterIds.includes("ocean-view")
  ) {
    derivedFilterIds.push("ui-waterfront");
  }

  if (
    hotel.filterIds.includes("pool") ||
    hotel.filterIds.includes("spa") ||
    reviewScoreValue >= 9 ||
    normalizedTags.includes("럭셔리")
  ) {
    derivedFilterIds.push("ui-luxury-retreat");
  }

  if (hotel.filterIds.includes("spa") || hotel.filterIds.includes("onsen") || normalizedTags.includes("온천") || normalizedTags.includes("사우나")) {
    derivedFilterIds.push("ui-onsen-retreat");
  }

  if (
    normalizedLocation.includes("시내") ||
    normalizedLocation.includes("중심") ||
    normalizedLocation.includes("downtown") ||
    hotel.filterIds.includes("downtown") ||
    hotel.filterIds.includes("shopping")
  ) {
    derivedFilterIds.push("ui-city-break");
  }

  return derivedFilterIds;
};

const enrichRegionalHotel = (
  hotel: HotelListPageHotel,
  region: string,
  regionLabel: string,
  profile: RegionProfile
) => {
  const reviewScoreValue = Number.parseFloat(hotel.reviewScore) || 0;
  const preset = resolveRegionLayoutPreset(region, regionLabel);
  const landmarkIds = preset.landmarkOptions.map((option) => option.id);
  const locationFilters = preset.locationFilters[hotel.locationId] ?? resolveFallbackLocationFilters(profile, hotel.locationId, landmarkIds);

  return {
    ...hotel,
    filterIds: dedupeFilters([
      ...hotel.filterIds,
      ...locationFilters,
      ...deriveRatingFilters(reviewScoreValue),
      deriveStarFilterId(hotel.stars),
      ...derivePropertyTypeFilters(hotel),
      ...deriveAmenityFilters(hotel),
      ...deriveLocationScoreFilters(reviewScoreValue),
      ...deriveBrandFilters(hotel),
      ...deriveExperienceFilters(hotel),
      ...(reviewScoreValue >= 9.3 && hotel.stars.includes("★★★★★") ? ["ui-agoda-luxe"] : [])
    ])
  };
};

const buildCanonicalHotels = (region: string, regionLabel: string, profile: RegionProfile, hotels: HotelListPageHotel[]) => {
  if (region === "hiroshima") {
    if (hotels.some((hotel) =>
      hotel.title.endsWith(" 프라임") || hotel.title.endsWith(" 레지던스") || hotel.title.endsWith(" 시그니처")
    )) {
      return hotels;
    }

    return expandHiroshimaHotels(hotels);
  }

  return hotels.map((hotel) => enrichRegionalHotel(hotel, region, regionLabel, profile));
};

const countHotelsByFilterId = (hotels: HotelListPageHotel[], filterId: string) => {
  return hotels.filter((hotel) => hotel.filterIds.includes(filterId)).length;
};

const buildLegacyLongSections = (
  region: string,
  regionLabel: string,
  profile: RegionProfile,
  hotels: HotelListPageHotel[]
): HotelListFilterSection[] => {
  const preset = resolveRegionLayoutPreset(region, regionLabel);

  const templateSections: HotelListFilterSection[] = [
    {
      id: "star-rating",
      title: "숙소 성급",
      options: [
        { id: "ui-agoda-luxe", label: "Agoda Luxe" },
        { id: "ui-five-star", label: "5-성급" },
        { id: "ui-four-star", label: "4-성급" },
        { id: "ui-three-star", label: "3-성급" },
        { id: "ui-two-star", label: "2-성급" },
        { id: "ui-one-star", label: "1-성급" }
      ]
    },
    {
      id: "meal-options",
      title: "이용 가능 서비스 / 옵션",
      options: [
        { id: "ui-breakfast-included", label: "조식 포함" },
        { id: "ui-dinner-included", label: "석식(저녁) 포함" },
        { id: "ui-free-sauna", label: "사우나 무료 이용" },
        { id: "ui-early-checkin", label: "얼리 체크인" },
        { id: "ui-late-checkout", label: "레이트 체크아웃" },
        { id: "ui-lunch-included", label: "중식(점심) 포함" },
        { id: "ui-shuttle", label: "무료 셔틀 서비스" }
      ]
    },
    {
      id: "room-amenities",
      title: "객실 편의 시설/서비스",
      options: [
        { id: "ui-heating", label: "난방" },
        { id: "ui-fridge", label: "냉장고" },
        { id: "ui-tv", label: "TV" },
        { id: "ui-bathtub", label: "욕조" },
        { id: "ui-aircon", label: "에어컨" },
        { id: "ui-washer", label: "세탁기" },
        { id: "ui-room-internet", label: "인터넷" },
        { id: "ui-coffee-maker", label: "커피/티 메이커" },
        { id: "ui-balcony", label: "발코니/테라스" },
        { id: "ui-room-kitchen", label: "주방" },
        { id: "ui-ironing", label: "다림질 도구" },
        { id: "ui-room-pet", label: "반려동물 동반 가능" }
      ]
    },
    {
      id: "distance",
      title: "도심까지의 거리",
      options: [
        { id: "ui-city-center", label: "도심에 위치" },
        { id: "ui-city-under-2", label: "도심까지 2km 미만" },
        { id: "ui-city-2-5", label: "도심까지 2~5km" },
        { id: "ui-city-5-10", label: "도심까지 5~10km" }
      ]
    },
    {
      id: "bed-types",
      title: "침대 종류",
      options: [
        { id: "ui-double-bed", label: "더블베드" },
        { id: "ui-single-bed", label: "싱글/트윈베드" },
        { id: "ui-queen-bed", label: "퀸베드" },
        { id: "ui-bunk-bed", label: "벙크베드" },
        { id: "ui-king-bed", label: "킹베드" }
      ]
    },
    {
      id: "landmarks",
      title: "주변 인기 명소",
      options: preset.landmarkOptions
    },
    {
      id: "family-favorites",
      title: "가족 여행객에 인기",
      options: [
        { id: "ui-family-trip", label: "가족 여행" },
        { id: "ui-couple-trip", label: "커플 여행" },
        { id: "ui-solo-trip", label: "1인 여행" },
        { id: "ui-business-trip", label: "비즈니스 여행" }
      ]
    },
    {
      id: "location-score",
      title: "숙소 위치 평가",
      options: [
        { id: "ui-location-9", label: "9+ 최고" },
        { id: "ui-location-8", label: "8+ 우수" },
        { id: "ui-location-7", label: "7+ 좋음" },
        { id: "ui-location-6", label: "6+ 무난" }
      ]
    },
    {
      id: "travel-theme",
      title: "여행 테마",
      options: [
        { id: "ui-city-break", label: "도심 여행" },
        { id: "ui-onsen-retreat", label: "온천 휴양" },
        { id: "ui-luxury-retreat", label: "럭셔리 숙박" },
        { id: "ui-station-access", label: "역 접근성 우수" },
        { id: "ui-waterfront", label: "워터프런트" }
      ]
    },
    {
      id: "bedroom-count",
      title: "침실 수",
      options: [
        { id: "ui-studio", label: "스튜디오" },
        { id: "ui-one-bedroom", label: "침실 1개" },
        { id: "ui-two-bedroom", label: "침실 2개" },
        { id: "ui-three-bedroom", label: "침실 3개 이상" }
      ]
    },
    {
      id: "hotel-brands",
      title: "인기 호텔 브랜드",
      options: [
        { id: "brand-ihg", label: "IHG 계열" },
        { id: "brand-candeo", label: "칸데오 호텔" },
        { id: "brand-marriott", label: "메리어트 계열" },
        { id: "brand-apa", label: "APA 계열" },
        { id: "brand-prince", label: "Prince 계열" },
        { id: "brand-local", label: "로컬/부티크" }
      ]
    }
  ];

  return templateSections.map((section) => ({
    ...section,
    options: section.options.map((option) => ({
      ...option,
      count: countHotelsByFilterId(hotels, option.id)
    }))
  }));
};

const dedupeFilters = (filterIds: string[]) => {
  return Array.from(new Set(filterIds.filter((filterId) => filterId.trim() !== "")));
};

const buildGenericProfile = (region: string, label: string, countryLabel: string): RegionProfile => {
  return {
    label,
    countryLabel,
    mapButtonLabel: `지도에서 ${label} 호텔 보기`,
    popularFilters: [
      { id: `${region}-central`, label: `${label} 중심가` },
      { id: `${region}-shopping`, label: "쇼핑 중심지" },
      { id: `${region}-resort`, label: "리조트 특가" },
      { id: `${region}-breakfast`, label: "조식 포함" }
    ],
    propertyTypes: [
      { id: `${region}-hotel`, label: "호텔", count: 214 },
      { id: `${region}-resort-type`, label: "리조트", count: 18 },
      { id: `${region}-apartment`, label: "서비스 아파트", count: 37 },
      { id: `${region}-villa`, label: "빌라", count: 9 }
    ],
    locations: [
      { id: `${region}-center`, label: `${label} 센트럴`, count: 81 },
      { id: `${region}-bay`, label: `${label} 베이`, count: 28, description: "인기 관광 구역" },
      { id: `${region}-station`, label: `${label} 역세권`, count: 44 },
      { id: `${region}-old-town`, label: `${label} 올드타운`, count: 17 }
    ],
    paymentOptions: [
      { id: `${region}-free-cancel`, label: "예약 무료 취소", count: 59 },
      { id: `${region}-pay-at-hotel`, label: "숙소에서 요금 결제", count: 33 },
      { id: `${region}-prepaid`, label: "지금 바로 결제", count: 118 }
    ],
    guestRatings: [
      { id: "rating-9", label: "9+ 최고", count: 39 },
      { id: "rating-8", label: "8+ 우수", count: 102 },
      { id: "rating-7", label: "7+ 좋음", count: 164 }
    ],
    amenities: [
      { id: `${region}-pool`, label: "수영장", count: 22 },
      { id: `${region}-spa`, label: "스파", count: 11 },
      { id: `${region}-parking`, label: "무료 주차", count: 57 },
      { id: `${region}-breakfast-amenity`, label: "조식 포함", count: 76 }
    ],
    hotels: [
      {
        id: `${region}-central-hotel`,
        title: `${label} 센트럴 호텔`,
        stars: "★★★★★",
        location: `${label} 중심가 · 대표 관광지 인접`,
        locationId: `${region}-center`,
        propertyTypeId: "hotel",
        reviewScore: "9.1",
        reviewLabel: "Excellent",
        originalPrice: "₩330,000",
        currentPrice: "₩269,000",
        imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        badge: "추천 호텔",
        filterIds: [`${region}-central`, `${region}-shopping`, `${region}-breakfast`],
        tags: ["무료 Wi-Fi", "라운지", "조식 포함"]
      },
      {
        id: `${region}-grand-resort`,
        title: `${label} 그랜드 리조트`,
        stars: "★★★★",
        location: `${label} 베이 프런트 · 전망 특화`,
        locationId: `${region}-bay`,
        propertyTypeId: "resort",
        reviewScore: "8.8",
        reviewLabel: "Great",
        originalPrice: "₩290,000",
        currentPrice: "₩228,000",
        imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
        badge: "리조트 특가",
        filterIds: [`${region}-resort`, `${region}-pool`, `${region}-spa`],
        tags: ["오션뷰", "수영장", "스파"]
      },
      {
        id: `${region}-station-stay`,
        title: `${label} 스테이션 스테이`,
        stars: "★★★",
        location: `${label} 역 도보 5분`,
        locationId: `${region}-station`,
        propertyTypeId: "hotel",
        reviewScore: "8.4",
        reviewLabel: "Very Good",
        originalPrice: "₩180,000",
        currentPrice: "₩139,000",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        badge: "역세권",
        filterIds: [`${region}-station`, `${region}-free-cancel`],
        tags: ["역세권", "셀프 체크인", "무료 취소"]
      },
      {
        id: `${region}-premium-suite`,
        title: `${label} 프리미엄 스위트`,
        stars: "★★★★★",
        location: `${label} 메인 스트립 · 야경 명소`,
        locationId: `${region}-old-town`,
        propertyTypeId: "villa",
        reviewScore: "9.3",
        reviewLabel: "Exceptional",
        originalPrice: "₩410,000",
        currentPrice: "₩338,000",
        imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
        badge: "럭셔리",
        filterIds: [`${region}-villa`, `${region}-shopping`],
        tags: ["스위트룸", "레이트 체크아웃", "피트니스"]
      }
    ]
  };
};

const resolveRegionProfile = (region: string | null, keyword: string | null) => {
  const normalizedRegion = region?.trim().toLowerCase() || "";

  if (normalizedRegion && REGION_PROFILES[normalizedRegion]) {
    return { region: normalizedRegion, profile: REGION_PROFILES[normalizedRegion] };
  }

  if (normalizedRegion === "bangkok") {
    return { region: "bangkok", profile: buildGenericProfile("bangkok", "방콕", "태국") };
  }

  if (normalizedRegion === "tokyo") {
    return { region: "tokyo", profile: buildGenericProfile("tokyo", "도쿄", "일본") };
  }

  if (normalizedRegion === "danang") {
    return { region: "danang", profile: buildGenericProfile("danang", "다낭", "베트남") };
  }

  if (normalizedRegion === "singapore") {
    return { region: "singapore", profile: buildGenericProfile("singapore", "싱가포르", "싱가포르") };
  }

  const normalizedKeyword = keyword?.trim().toLowerCase() || "";
  if (normalizedKeyword.includes("제주") || normalizedKeyword.includes("jeju")) {
    return { region: "jeju", profile: REGION_PROFILES.jeju };
  }

  if (normalizedKeyword.includes("오사카") || normalizedKeyword.includes("osaka")) {
    return { region: "osaka", profile: REGION_PROFILES.osaka };
  }

  if (normalizedKeyword.includes("방콕") || normalizedKeyword.includes("bangkok")) {
    return { region: "bangkok", profile: buildGenericProfile("bangkok", "방콕", "태국") };
  }

  if (normalizedKeyword.includes("도쿄") || normalizedKeyword.includes("tokyo")) {
    return { region: "tokyo", profile: buildGenericProfile("tokyo", "도쿄", "일본") };
  }

  if (normalizedKeyword.includes("다낭") || normalizedKeyword.includes("danang")) {
    return { region: "danang", profile: buildGenericProfile("danang", "다낭", "베트남") };
  }

  if (normalizedKeyword.includes("싱가포르") || normalizedKeyword.includes("singapore")) {
    return { region: "singapore", profile: buildGenericProfile("singapore", "싱가포르", "싱가포르") };
  }

  return { region: DEFAULT_REGION, profile: REGION_PROFILES[DEFAULT_REGION] };
};

const buildFilterSections = (
  region: string,
  regionLabel: string,
  profile: RegionProfile,
  hotels: HotelListPageHotel[],
  selectedFilterIds: string[] = []
): HotelListFilterSection[] => {
  return [
    {
      id: "popular",
      title: `${regionLabel} 인기 검색 조건`,
      options: applyCheckedState(profile.popularFilters, selectedFilterIds)
    },
    {
      id: "property-types",
      title: "숙소 종류",
      options: applyCheckedState(profile.propertyTypes, selectedFilterIds)
    },
    {
      id: "locations",
      title: "지역",
      options: applyCheckedState(profile.locations, selectedFilterIds)
    },
    {
      id: "payment-options",
      title: "결제 관련 옵션",
      options: applyCheckedState(profile.paymentOptions, selectedFilterIds)
    },
    {
      id: "guest-ratings",
      title: "투숙객 평가 점수",
      options: applyCheckedState(profile.guestRatings, selectedFilterIds)
    },
    {
      id: "amenities",
      title: "숙소 편의 시설 및 서비스",
      options: applyCheckedState(profile.amenities, selectedFilterIds)
    },
    ...buildLegacyLongSections(region, regionLabel, profile, hotels).map((section) => ({
      ...section,
      options: applyCheckedState(section.options, selectedFilterIds)
    }))
  ];
};

const extractSelectedFilterIdsFromPageData = (pageData: HotelListPageData) => {
  return dedupeFilters(
    pageData.filterSections.flatMap((section) =>
      section.options.filter((option) => option.checked).map((option) => option.id)
    )
  );
};

const applyCheckedState = (options: HotelListFilterOption[], selectedFilterIds: string[]) => {
  const selectedFilterIdSet = new Set(selectedFilterIds);

  return options.map((option) => ({
    ...option,
    checked: selectedFilterIdSet.has(option.id)
  }));
};

export const enhanceHotelListPageData = (pageData: HotelListPageData): HotelListPageData => {
  const resolved = resolveRegionProfile(pageData.region, pageData.regionLabel);
  const profile = resolved.profile;
  const selectedFilterIds = extractSelectedFilterIdsFromPageData(pageData);
  const canonicalHotels = buildCanonicalHotels(pageData.region, pageData.regionLabel, profile, pageData.hotels);

  return {
    ...pageData,
    filterSections: buildFilterSections(pageData.region, pageData.regionLabel, profile, canonicalHotels, selectedFilterIds),
    hotels: canonicalHotels
  };
};

export const buildMockHotelListPageData = (search: string): HotelListPageData => {
  const params = readSearchParams(search);
  const keyword = params.get("keyword");
  const region = params.get("region");
  const initialSearchState = getHotelSearchInitialStateFromUrl(search);
  const resolved = resolveRegionProfile(region, keyword);
  const destinationLabel =
    initialSearchState.destinationValue?.trim() || `${resolved.profile.label}, ${resolved.profile.countryLabel}`;

  const checkInLabel = formatShortDateLabel(initialSearchState.calendar?.checkIn ?? null);
  const checkOutLabel = formatShortDateLabel(initialSearchState.calendar?.checkOut ?? null);
  const dateLabel =
    checkInLabel && checkOutLabel ? `${checkInLabel} - ${checkOutLabel}` : "날짜를 선택하세요";
  const hotels = buildCanonicalHotels(resolved.region, resolved.profile.label, resolved.profile, resolved.profile.hotels);

  return {
    shell: params.get("shell") ?? "stay",
    migrationPath: "/migration",
    region: resolved.region,
    regionLabel: resolved.profile.label,
    mapButtonLabel: resolved.profile.mapButtonLabel,
    searchSummary: {
      destinationLabel,
      dateLabel,
      guestLabel: buildGuestLabel(
        initialSearchState.guest?.adults ?? 1,
        initialSearchState.guest?.children ?? 0,
        initialSearchState.guest?.rooms ?? 1
      )
    },
    filterSections: buildFilterSections(resolved.region, resolved.profile.label, resolved.profile, hotels),
    hotels
  };
};

export const readHotelListPageDataFromDom = (): HotelListPageData | null => {
  if (typeof document === "undefined") {
    return null;
  }

  const script = document.getElementById("hotel-list-page-data");
  if (!script?.textContent?.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(script.textContent) as HotelListPageData;
    return parsed;
  } catch (_error) {
    return null;
  }
};

const parseGuestRating = (reviewScore: string) => {
  const parsed = Number.parseFloat(reviewScore);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const matchesPropertyTypeFilter = (hotel: HotelListPageHotel, propertyTypeId: string) => {
  const normalizedTitle = hotel.title.toLowerCase();
  const aliases = PROPERTY_TYPE_ALIAS_MAP[propertyTypeId] ?? [propertyTypeId];

  if (aliases.includes(hotel.propertyTypeId)) {
    return true;
  }

  if (propertyTypeId === "hotel") {
    return normalizedTitle.includes("호텔") || normalizedTitle.includes("hotel");
  }

  if (propertyTypeId === "resort") {
    return normalizedTitle.includes("리조트") || normalizedTitle.includes("resort");
  }

  if (propertyTypeId === "ryokan") {
    return normalizedTitle.includes("료칸") || normalizedTitle.includes("ryokan");
  }

  if (propertyTypeId === "apartment") {
    return normalizedTitle.includes("아파트") || normalizedTitle.includes("apartment");
  }

  if (propertyTypeId === "capsule") {
    return normalizedTitle.includes("캡슐");
  }

  if (propertyTypeId === "poolvilla") {
    return normalizedTitle.includes("풀빌라");
  }

  if (propertyTypeId === "private-house-entire") {
    return normalizedTitle.includes("프라이빗") || normalizedTitle.includes("독채");
  }

  if (propertyTypeId === "villa" || propertyTypeId === "resort-villa") {
    return normalizedTitle.includes("빌라");
  }

  return false;
};

export const filterHotelsBySelection = (
  hotels: HotelListPageHotel[],
  filterState: HotelFilterState
) => {
  return hotels.filter((hotel) => {
    const currentPriceValue = parseHotelPriceValue(hotel.currentPrice);

    if (filterState.minPrice !== null && currentPriceValue < filterState.minPrice) {
      return false;
    }

    if (filterState.maxPrice !== null && currentPriceValue > filterState.maxPrice) {
      return false;
    }

    if (filterState.guestRatingThreshold !== null && parseGuestRating(hotel.reviewScore) < filterState.guestRatingThreshold) {
      return false;
    }

    if (filterState.locationIds.length > 0 && !filterState.locationIds.includes(hotel.locationId)) {
      return false;
    }

    if (filterState.propertyTypeIds.length === 0) {
      const normalizedSelectedFilters = filterState.selectedOptionIds.filter(
        (filterId) =>
          !filterId.startsWith("rating-") &&
          !filterState.locationIds.includes(filterId)
      );
      if (normalizedSelectedFilters.length === 0) {
        return true;
      }

      return normalizedSelectedFilters.every((filterId) => {
        if (filterId === hotel.locationId) {
          return true;
        }

        return hotel.filterIds.includes(filterId);
      });
    }

    const propertyTypeMatched = filterState.propertyTypeIds.some((propertyTypeId) =>
      matchesPropertyTypeFilter(hotel, propertyTypeId)
    );

    if (!propertyTypeMatched) {
      return false;
    }

    const normalizedSelectedFilters = filterState.selectedOptionIds.filter(
      (filterId) =>
        !filterId.startsWith("rating-") &&
        !filterState.propertyTypeIds.includes(filterId) &&
        !filterState.locationIds.includes(filterId)
    );

    if (normalizedSelectedFilters.length === 0) {
      return true;
    }

    return normalizedSelectedFilters.every((filterId) => {
      if (filterId === hotel.locationId) {
        return true;
      }

      return hotel.filterIds.includes(filterId);
    });
  });
};

export const getSelectedFilterIds = (pageData: HotelListPageData) => {
  return extractSelectedFilterIdsFromPageData(pageData);
};

export const buildHotelListSearchParams = (currentSearch: string, selectedFilterIds: string[]) => {
  const params = new URLSearchParams(currentSearch);
  params.delete("filter");

  dedupeFilters(selectedFilterIds).forEach((filterId) => {
    params.append("filter", filterId);
  });

  return params;
};
