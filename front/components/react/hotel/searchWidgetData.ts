import type { SearchFlexibleOption, SearchGuestRow, SearchTabItem } from "@front-components/search/types";

import { HOTEL_DESTINATION_COLUMNS } from "./hotelDestinationCatalog";

export const SEARCH_TABS: SearchTabItem[] = [
  { tab: "hotel", icon: "building-2", dataLang: "tabHotel", label: "호텔 & 리조트" },
  { tab: "pension", icon: "home", dataLang: "tabPension", label: "펜션 & 풀빌라" },
  { tab: "activity", icon: "compass", dataLang: "tabActivity", label: "즐길거리" }
];

export const DESTINATION_COLUMNS = HOTEL_DESTINATION_COLUMNS;

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
