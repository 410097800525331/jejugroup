import type {
  SearchDestinationColumn,
  SearchFlexibleOption,
  SearchGuestRow,
  SearchTabItem
} from "@front-components/search/types";

export const SEARCH_TABS: SearchTabItem[] = [
  { tab: "hotel", icon: "building-2", dataLang: "tabHotel", label: "호텔 & 리조트" },
  { tab: "pension", icon: "home", dataLang: "tabPension", label: "펜션 & 풀빌라" },
  { tab: "activity", icon: "compass", dataLang: "tabActivity", label: "즐길거리" }
];

export const DESTINATION_COLUMNS: SearchDestinationColumn[] = [
  {
    title: "대한민국 내 여행지",
    titleLang: "destKr",
    items: [
      {
        value: "서울",
        image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=100&h=100&fit=crop",
        alt: "서울",
        name: "서울",
        nameLang: "destNameSeoul",
        count: "(5,945)",
        desc: "쇼핑, 레스토랑",
        descLang: "descShoppingDining"
      },
      {
        value: "인천",
        image: "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?w=100&h=100&fit=crop",
        alt: "인천",
        name: "인천",
        nameLang: "destNameIncheon",
        count: "(2,147)",
        desc: "관광",
        descLang: "descTourism"
      },
      {
        value: "부산",
        image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=100&h=100&fit=crop",
        alt: "부산",
        name: "부산",
        nameLang: "destNameBusan",
        count: "(2,734)",
        desc: "해변, 레스토랑",
        descLang: "descBeachDining"
      },
      {
        value: "속초",
        image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=100&h=100&fit=crop",
        alt: "속초",
        name: "속초",
        nameLang: "destNameSokcho",
        count: "(800)",
        desc: "해변, 레스토랑",
        descLang: "descBeachDining"
      }
    ]
  },
  {
    title: "해외 여행지",
    titleLang: "destOverseas",
    items: [
      {
        value: "오사카",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=100&h=100&fit=crop",
        alt: "오사카",
        name: "오사카",
        nameLang: "destNameOsaka",
        count: "(10,018)",
        desc: "쇼핑, 레스토랑",
        descLang: "descShoppingDining"
      },
      {
        value: "도쿄",
        image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=100&h=100&fit=crop",
        alt: "도쿄",
        name: "도쿄 / 동경",
        nameLang: "destNameTokyo",
        count: "(12,486)",
        desc: "쇼핑, 관광",
        descLang: "descShoppingSightseeing"
      },
      {
        value: "후쿠오카",
        image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=100&h=100&fit=crop",
        alt: "후쿠오카",
        name: "후쿠오카",
        nameLang: "destNameFukuoka",
        count: "(2,181)",
        desc: "관광, 해변",
        descLang: "descSightseeingBeach"
      },
      {
        value: "방콕",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=100&h=100&fit=crop",
        alt: "방콕",
        name: "방콕",
        nameLang: "destNameBangkok",
        count: "(8,450)",
        desc: "쇼핑, 관광",
        descLang: "descShoppingSightseeing"
      }
    ]
  }
];

export const FLEXIBLE_OPTIONS: SearchFlexibleOption[] = [
  { value: "3", dataLang: "calFlex3", label: "3박" },
  { value: "7", dataLang: "calFlex7", label: "1주일" },
  { value: "30", dataLang: "calFlex30", label: "1개월" }
];

export const GUEST_ROWS: SearchGuestRow[] = [
  {
    key: "rooms",
    title: "객실",
    titleLang: "guestRooms",
    description: null,
    descriptionLang: undefined,
    defaultValue: "1"
  },
  {
    key: "adults",
    title: "성인",
    titleLang: "guestAdults",
    description: "18세 이상",
    descriptionLang: "guestAdultsDesc",
    defaultValue: "1"
  },
  {
    key: "children",
    title: "아동",
    titleLang: "guestChildren",
    description: "0 - 17세",
    descriptionLang: "guestChildrenDesc",
    defaultValue: "0"
  }
];
