export interface HotelMegaPreview {
  id: string;
  src: string;
  alt: string;
}

export interface HotelMegaMenuItem {
  route: string;
  previewId: string;
  icon: string;
  label: string;
  isNew?: boolean;
}

export interface HotelNavItem {
  route: string;
  icon: string;
  dataLang: string;
  label: string;
  menuItems: ReadonlyArray<HotelMegaMenuItem>;
  previews: ReadonlyArray<HotelMegaPreview>;
}

export interface HotelMobileNavItem {
  route?: string;
  action?: string;
  dataLang: string;
  label: string;
  active?: boolean;
  routeParams?: string;
}

export const HOTEL_NAV_ITEMS: ReadonlyArray<HotelNavItem> = [
  {
    route: "SERVICES.STAY.MAIN",
    icon: "building-2",
    dataLang: "navAccommodations",
    label: "숙소 예약",
    menuItems: [
      { route: "SERVICES.STAY.MAIN", previewId: "preview-hotel", icon: "hotel", label: "호텔 & 리조트" },
      { route: "SERVICES.STAY.LIFE", previewId: "preview-month", icon: "calendar", label: "한달살기", isNew: true },
      { route: "SERVICES.STAY.PRIVATE", previewId: "preview-private", icon: "home", label: "프라이빗 스테이" }
    ],
    previews: [
      {
        id: "preview-hotel",
        src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
        alt: "Hotel"
      },
      {
        id: "preview-month",
        src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
        alt: "Month Stay"
      },
      {
        id: "preview-private",
        src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&q=80",
        alt: "Private Stay"
      }
    ]
  },
  {
    route: "SERVICES.TRAVEL.ACTIVITIES",
    icon: "plane",
    dataLang: "navTravel",
    label: "여행 상품",
    menuItems: [
      { route: "SERVICES.TRAVEL.ACTIVITIES", previewId: "preview-activity", icon: "compass", label: "액티비티" },
      { route: "SERVICES.TRAVEL.ESIM", previewId: "preview-esim", icon: "smartphone", label: "eSIM / 유심" }
    ],
    previews: [
      {
        id: "preview-activity",
        src: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&q=80",
        alt: "Activity"
      },
      {
        id: "preview-esim",
        src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
        alt: "eSIM"
      }
    ]
  },
  {
    route: "SERVICES.DEALS.MAIN",
    icon: "percent",
    dataLang: "navDeals",
    label: "혜택 & 특가",
    menuItems: [
      { route: "SERVICES.DEALS.MAIN", previewId: "preview-promo", icon: "gift", label: "이번 달 프로모션" },
      { route: "SERVICES.DEALS.MEMBER", previewId: "preview-member", icon: "users", label: "회원 전용 혜택" },
      { route: "SERVICES.DEALS.PARTNER", previewId: "preview-partner", icon: "credit-card", label: "제휴 카드 할인" }
    ],
    previews: [
      {
        id: "preview-promo",
        src: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
        alt: "Promo"
      },
      {
        id: "preview-member",
        src: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=600&q=80",
        alt: "Member"
      },
      {
        id: "preview-partner",
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
        alt: "Partner"
      }
    ]
  },
  {
    route: "SERVICES.TRAVEL.GUIDE",
    icon: "book-open",
    dataLang: "navGuide",
    label: "여행 정보",
    menuItems: [
      { route: "SERVICES.TRAVEL.GUIDE", previewId: "preview-guide", icon: "map", label: "여행 가이드북" },
      { route: "SERVICES.TRAVEL.TIPS", previewId: "preview-tips", icon: "lightbulb", label: "여행 팁" },
      { route: "SERVICES.TRAVEL.CHECKLIST", previewId: "preview-checklist", icon: "check-circle", label: "여행 체크리스트" }
    ],
    previews: [
      {
        id: "preview-guide",
        src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80",
        alt: "Guide"
      },
      {
        id: "preview-tips",
        src: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=600&q=80",
        alt: "Tips"
      },
      {
        id: "preview-checklist",
        src: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
        alt: "Checklist"
      }
    ]
  }
];

export const HOTEL_MOBILE_NAV_ITEMS: ReadonlyArray<HotelMobileNavItem> = [
  { route: "SERVICES.STAY.MAIN", dataLang: "mobileNavHotel", label: "숙소 예약", active: true },
  { route: "SERVICES.STAY.LIFE", dataLang: "mobileNavLife", label: "한달살기" },
  { route: "SERVICES.TRAVEL.ACTIVITIES", dataLang: "mobileNavActivity", label: "액티비티" },
  { route: "SERVICES.TRAVEL.ESIM", dataLang: "mobileNavEsim", label: "eSIM" },
  { route: "SERVICES.TRAVEL.GUIDE", dataLang: "mobileNavGuide", label: "여행 가이드" },
  { route: "SERVICES.TRAVEL.TIPS", dataLang: "mobileNavTips", label: "여행 일정 팁" },
  { action: "OPEN_RESERVATION_DRAWER", dataLang: "navResCheck", label: "예약 확인" },
  { route: "AUTH.LOGIN", routeParams: "{\"shell\":\"main\"}", dataLang: "navLogin", label: "로그인" }
];
