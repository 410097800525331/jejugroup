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
      { id: "kitchen", label: "주방" },
      { id: "pay-now", label: "지금 바로 결제" },
      { id: "downtown", label: "다운타운" },
      { id: "internet", label: "인터넷" },
      { id: "frontdesk", label: "24시간 프런트 데스크" },
      { id: "spa", label: "스파/사우나" }
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
      { id: "kaita", label: "가이타", count: 2 },
      { id: "hiroshima-station-area", label: "히로시마역", count: 1 }
    ],
    paymentOptions: [
      { id: "free-cancel", label: "예약 무료 취소", count: 5 },
      { id: "pay-at-hotel", label: "숙소에서 요금 결제", count: 34 },
      { id: "prepaid", label: "지금 바로 결제", count: 157 }
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
        filterIds: ["internet", "spa", "pay-now", "restaurant"],
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
        filterIds: ["spa", "pool", "pay-now"],
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

const buildLegacyLongSections = (region: string): HotelListFilterSection[] => {
  if (region !== "hiroshima") {
    return [];
  }

  return [
    {
      id: "star-rating",
      title: "숙소 성급",
      options: [
        { id: "ui-five-star", label: "5-성급", count: 10 },
        { id: "ui-four-star", label: "4-성급", count: 47 },
        { id: "ui-three-star", label: "3-성급", count: 149 },
        { id: "ui-two-star", label: "2-성급", count: 63 },
        { id: "ui-one-star", label: "1-성급", count: 44 }
      ]
    },
    {
      id: "meal-options",
      title: "이용 가능 서비스 / 옵션",
      options: [
        { id: "ui-breakfast-included", label: "조식 포함", count: 63 },
        { id: "ui-dinner-included", label: "석식(저녁) 포함", count: 17 },
        { id: "ui-free-sauna", label: "사우나 무료 이용", count: 3 },
        { id: "ui-early-checkin", label: "얼리 체크인", count: 2 },
        { id: "ui-late-checkout", label: "레이트 체크아웃", count: 2 },
        { id: "ui-lunch-included", label: "중식(점심) 포함", count: 1 },
        { id: "ui-shuttle", label: "무료 셔틀 서비스", count: 1 }
      ]
    },
    {
      id: "room-amenities",
      title: "객실 편의 시설/서비스",
      options: [
        { id: "ui-heating", label: "난방", count: 193 },
        { id: "ui-fridge", label: "냉장고", count: 185 },
        { id: "ui-tv", label: "TV", count: 177 },
        { id: "ui-bathtub", label: "욕조", count: 155 },
        { id: "ui-aircon", label: "에어컨", count: 111 },
        { id: "ui-washer", label: "세탁기", count: 78 },
        { id: "ui-room-internet", label: "인터넷", count: 70 },
        { id: "ui-coffee-maker", label: "커피/티 메이커", count: 43 },
        { id: "ui-balcony", label: "발코니/테라스", count: 39 },
        { id: "ui-room-kitchen", label: "주방", count: 22 },
        { id: "ui-ironing", label: "다림질 도구", count: 20 },
        { id: "ui-room-pet", label: "반려동물 동반 가능", count: 5 }
      ]
    },
    {
      id: "distance",
      title: "도심까지의 거리",
      options: [
        { id: "ui-city-center", label: "도심에 위치", count: 96 },
        { id: "ui-city-under-2", label: "도심까지 2km 미만", count: 200 },
        { id: "ui-city-2-5", label: "도심까지 2~5km", count: 16 },
        { id: "ui-city-5-10", label: "도심까지 5~10km", count: 14 }
      ]
    },
    {
      id: "bed-types",
      title: "침대 종류",
      options: [
        { id: "ui-double-bed", label: "더블베드", count: 251 },
        { id: "ui-single-bed", label: "싱글/트윈베드", count: 151 },
        { id: "ui-queen-bed", label: "퀸베드", count: 73 },
        { id: "ui-bunk-bed", label: "벙크베드", count: 24 },
        { id: "ui-king-bed", label: "킹베드", count: 17 }
      ]
    },
    {
      id: "landmarks",
      title: "주변 인기 명소",
      options: [
        { id: "ui-okonomimura", label: "오코노미무라", count: 134 },
        { id: "ui-atomic-bomb-dome", label: "원폭 돔", count: 128 },
        { id: "ui-peace-museum", label: "히로시마 평화 기념관", count: 113 },
        { id: "ui-sukkein", label: "수케이엔 정원", count: 87 },
        { id: "ui-hiroshima-castle", label: "히로시마 성", count: 45 }
      ]
    }
  ];
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

const buildFilterSections = (region: string, regionLabel: string, profile: RegionProfile): HotelListFilterSection[] => {
  return [
    {
      id: "popular",
      title: `${regionLabel} 인기 검색 조건`,
      options: profile.popularFilters
    },
    {
      id: "property-types",
      title: "숙소 종류",
      options: profile.propertyTypes
    },
    {
      id: "locations",
      title: "지역",
      options: profile.locations
    },
    {
      id: "payment-options",
      title: "결제 관련 옵션",
      options: profile.paymentOptions
    },
    {
      id: "guest-ratings",
      title: "투숙객 평가 점수",
      options: profile.guestRatings
    },
    {
      id: "amenities",
      title: "숙소 편의 시설 및 서비스",
      options: profile.amenities
    },
    ...buildLegacyLongSections(region)
  ];
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
    filterSections: buildFilterSections(resolved.region, resolved.profile.label, resolved.profile),
    hotels: resolved.profile.hotels
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

export const filterHotelsBySelection = (
  hotels: HotelListPageHotel[],
  filterState: HotelFilterState
) => {
  return hotels.filter((hotel) => {
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
          !filterId.startsWith("ui-") &&
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

    const normalizedTitle = hotel.title.toLowerCase();
    const propertyTypeMatched = filterState.propertyTypeIds.some((propertyTypeId) => {
      if (propertyTypeId === "hotel") {
        return hotel.propertyTypeId === "hotel" || normalizedTitle.includes("호텔") || normalizedTitle.includes("hotel");
      }

      if (propertyTypeId === "resort" || propertyTypeId === "resort-type") {
        return hotel.propertyTypeId === "resort" || normalizedTitle.includes("리조트") || normalizedTitle.includes("resort");
      }

      if (propertyTypeId === "ryokan") {
        return hotel.propertyTypeId === "ryokan" || normalizedTitle.includes("료칸") || normalizedTitle.includes("ryokan");
      }

      if (propertyTypeId === "apartment") {
        return hotel.propertyTypeId === "apartment" || normalizedTitle.includes("아파트") || normalizedTitle.includes("apartment");
      }

      if (propertyTypeId === "capsule") {
        return hotel.propertyTypeId === "capsule" || normalizedTitle.includes("캡슐");
      }

      if (propertyTypeId === "poolvilla") {
        return hotel.propertyTypeId === "poolvilla" || normalizedTitle.includes("풀빌라");
      }

      if (propertyTypeId === "private-house") {
        return hotel.propertyTypeId === "private-house" || normalizedTitle.includes("독채");
      }

      if (propertyTypeId === "villa") {
        return hotel.propertyTypeId === "villa" || normalizedTitle.includes("빌라");
      }

      return false;
    });

    if (!propertyTypeMatched) {
      return false;
    }

    const normalizedSelectedFilters = filterState.selectedOptionIds.filter(
      (filterId) =>
        !filterId.startsWith("rating-") &&
        !filterId.startsWith("ui-") &&
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
  return dedupeFilters(
    pageData.filterSections.flatMap((section) =>
      section.options.filter((option) => option.checked).map((option) => option.id)
    )
  );
};

export const buildHotelListSearchParams = (currentSearch: string, selectedFilterIds: string[]) => {
  const params = new URLSearchParams(currentSearch);
  params.delete("filter");

  dedupeFilters(selectedFilterIds).forEach((filterId) => {
    params.append("filter", filterId);
  });

  return params;
};
