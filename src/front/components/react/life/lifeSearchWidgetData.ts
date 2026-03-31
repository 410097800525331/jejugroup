import type { SearchFlexibleOption, SearchGuestRow, SearchOptionItem } from "@front-components/search/types";

export const LIFE_FLEXIBLE_OPTIONS: SearchFlexibleOption[] = [
  { value: "3", dataLang: "calFlex3", label: "3박" },
  { value: "7", dataLang: "calFlex7", label: "1주일" },
  { value: "30", dataLang: "calFlex30", label: "1개월" }
];

export const LIFE_GUEST_ROWS: SearchGuestRow[] = [
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

export const LIFE_REQUIRED_OPTIONS: SearchOptionItem[] = [
  { value: "kitchen", dataLang: "lifeOptionKitchen", label: "주방" },
  { value: "washer", dataLang: "lifeOptionWasher", label: "세탁기" },
  { value: "full-kitchen", dataLang: "lifeOptionFullKitchen", label: "풀옵션 주방" },
  { value: "washer-dryer", dataLang: "lifeOptionWasherDryer", label: "세탁기/건조기" },
  { value: "desk", dataLang: "lifeOptionDesk", label: "업무용 데스크" },
  { value: "parking", dataLang: "lifeOptionParking", label: "전용 주차장" }
];
