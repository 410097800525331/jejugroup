import type { SearchDestinationColumn } from "@front-components/search/types";
import {
  resolveWorldCityDestination,
  searchWorldAirportDestinations,
  searchWorldCityDestinations,
  type WorldAirportDestinationResult,
  type WorldCityDestinationResult
} from "../../../shared/destination/destinationSearch.js";

export interface HotelDestinationEntry {
  aliases: string[];
  countryLabel: string;
  count: string;
  description: string;
  descriptionLang: string;
  dropdownName: string;
  group: "domestic" | "overseas";
  image: string;
  label: string;
  nameLang: string;
  region: string;
}

export interface HotelDestinationResolution {
  countryLabel: string;
  destination: HotelDestinationEntry | null;
  label: string;
  region: string;
}

const HOTEL_DESTINATION_CATALOG: HotelDestinationEntry[] = [
  {
    region: "hiroshima",
    label: "히로시마",
    countryLabel: "일본",
    aliases: ["히로시마", "hiroshima"],
    group: "overseas",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=100&h=100&fit=crop",
    dropdownName: "히로시마",
    nameLang: "destNameHiroshima",
    count: "(1,742)",
    description: "평화 공원, 오코노미야키",
    descriptionLang: "descPeaceFood"
  },
  {
    region: "jeju",
    label: "제주",
    countryLabel: "대한민국",
    aliases: ["제주", "제주도", "jeju"],
    group: "domestic",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=100&h=100&fit=crop",
    dropdownName: "제주",
    nameLang: "destNameJeju",
    count: "(3,240)",
    description: "오션뷰, 리조트",
    descriptionLang: "descBeachDining"
  },
  {
    region: "seoul",
    label: "서울",
    countryLabel: "대한민국",
    aliases: ["서울", "seoul"],
    group: "domestic",
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=100&h=100&fit=crop",
    dropdownName: "서울",
    nameLang: "destNameSeoul",
    count: "(5,945)",
    description: "쇼핑, 레스토랑",
    descriptionLang: "descShoppingDining"
  },
  {
    region: "incheon",
    label: "인천",
    countryLabel: "대한민국",
    aliases: ["인천", "incheon"],
    group: "domestic",
    image: "https://images.unsplash.com/photo-1583425921686-c5daf5f49e4a?w=100&h=100&fit=crop",
    dropdownName: "인천",
    nameLang: "destNameIncheon",
    count: "(2,147)",
    description: "관광",
    descriptionLang: "descTourism"
  },
  {
    region: "busan",
    label: "부산",
    countryLabel: "대한민국",
    aliases: ["부산", "busan"],
    group: "domestic",
    image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=100&h=100&fit=crop",
    dropdownName: "부산",
    nameLang: "destNameBusan",
    count: "(2,734)",
    description: "해변, 레스토랑",
    descriptionLang: "descBeachDining"
  },
  {
    region: "sokcho",
    label: "속초",
    countryLabel: "대한민국",
    aliases: ["속초", "sokcho"],
    group: "domestic",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=100&h=100&fit=crop",
    dropdownName: "속초",
    nameLang: "destNameSokcho",
    count: "(800)",
    description: "해변, 레스토랑",
    descriptionLang: "descBeachDining"
  },
  {
    region: "osaka",
    label: "오사카",
    countryLabel: "일본",
    aliases: ["오사카", "osaka"],
    group: "overseas",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=100&h=100&fit=crop",
    dropdownName: "오사카",
    nameLang: "destNameOsaka",
    count: "(10,018)",
    description: "쇼핑, 레스토랑",
    descriptionLang: "descShoppingDining"
  },
  {
    region: "tokyo",
    label: "도쿄",
    countryLabel: "일본",
    aliases: ["도쿄", "동경", "tokyo"],
    group: "overseas",
    image: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=100&h=100&fit=crop",
    dropdownName: "도쿄 / 동경",
    nameLang: "destNameTokyo",
    count: "(12,486)",
    description: "쇼핑, 관광",
    descriptionLang: "descShoppingSightseeing"
  },
  {
    region: "fukuoka",
    label: "후쿠오카",
    countryLabel: "일본",
    aliases: ["후쿠오카", "fukuoka"],
    group: "overseas",
    image: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=100&h=100&fit=crop",
    dropdownName: "후쿠오카",
    nameLang: "destNameFukuoka",
    count: "(2,181)",
    description: "관광, 해변",
    descriptionLang: "descSightseeingBeach"
  },
  {
    region: "bangkok",
    label: "방콕",
    countryLabel: "태국",
    aliases: ["방콕", "bangkok"],
    group: "overseas",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=100&h=100&fit=crop",
    dropdownName: "방콕",
    nameLang: "destNameBangkok",
    count: "(8,450)",
    description: "쇼핑, 관광",
    descriptionLang: "descShoppingSightseeing"
  },
  {
    region: "danang",
    label: "다낭",
    countryLabel: "베트남",
    aliases: ["다낭", "danang", "da nang"],
    group: "overseas",
    image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=100&h=100&fit=crop",
    dropdownName: "다낭",
    nameLang: "destNameDanang",
    count: "(2,890)",
    description: "해변, 휴양",
    descriptionLang: "descBeachDining"
  },
  {
    region: "singapore",
    label: "싱가포르",
    countryLabel: "싱가포르",
    aliases: ["싱가포르", "싱가폴", "singapore"],
    group: "overseas",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=100&h=100&fit=crop",
    dropdownName: "싱가포르",
    nameLang: "destNameSingapore",
    count: "(1,890)",
    description: "시티뷰, 미식",
    descriptionLang: "descShoppingDining"
  }
];

const normalizeDestinationKey = (value: string) => value.trim().toLowerCase().replace(/\s+/g, "");

const OFFICIAL_CITY_IMAGE = "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&h=100&fit=crop";
const OFFICIAL_CITY_DESCRIPTION = "공식 도시 정보";
const OFFICIAL_CITY_NAME_LANG = "destNameSharedCity";
const OFFICIAL_CITY_DESCRIPTION_LANG = "descSharedCity";

type SharedDestinationResult = WorldCityDestinationResult | WorldAirportDestinationResult;

const buildSharedCityDestinationEntry = (destination: SharedDestinationResult): HotelDestinationEntry => {
  const countryLabel = destination.countryLabel?.trim() || "";
  const label =
    destination.source === "world-airport"
      ? destination.cityLabel?.trim() || destination.airportLabel?.trim() || ""
      : destination.label;
  const englishLabel =
    destination.source === "world-airport"
      ? destination.cityEnglishLabel?.trim() || ""
      : destination.englishLabel?.trim() || "";
  const airportLabel = destination.source === "world-airport" ? destination.airportLabel?.trim() || "" : "";
  const airportEnglishLabel = destination.source === "world-airport" ? destination.airportEnglishLabel?.trim() || "" : "";

  return {
    region: destination.region,
    label,
    countryLabel,
    aliases: [label, englishLabel, airportLabel, airportEnglishLabel, destination.region].filter(
      (value): value is string => Boolean(value && value.trim())
    ),
    group: countryLabel === "대한민국" ? "domestic" : "overseas",
    image: OFFICIAL_CITY_IMAGE,
    dropdownName: label,
    nameLang: OFFICIAL_CITY_NAME_LANG,
    count: "",
    description: OFFICIAL_CITY_DESCRIPTION,
    descriptionLang: OFFICIAL_CITY_DESCRIPTION_LANG
  };
};

const resolveSharedCityDestination = (value: string | null | undefined) => {
  const resolvedCity = resolveWorldCityDestination(value ?? "");
  if (resolvedCity) {
    return buildSharedCityDestinationEntry(resolvedCity);
  }

  const resolvedAirport = searchWorldAirportDestinations(value ?? "")[0];
  return resolvedAirport ? buildSharedCityDestinationEntry(resolvedAirport) : null;
};

const buildDestinationColumnItems = (group: HotelDestinationEntry["group"]): SearchDestinationColumn["items"] => {
  return HOTEL_DESTINATION_CATALOG.filter((entry) => entry.group === group).map((entry) => ({
    value: entry.label,
    image: entry.image,
    alt: entry.label,
    name: entry.dropdownName,
    nameLang: entry.nameLang,
    count: entry.count,
    desc: entry.description,
    descLang: entry.descriptionLang
  }));
};

export const HOTEL_DESTINATION_COLUMNS: SearchDestinationColumn[] = [
  {
    title: "대한민국 내 여행지",
    titleLang: "destKr",
    items: buildDestinationColumnItems("domestic")
  },
  {
    title: "해외 여행지",
    titleLang: "destOverseas",
    items: buildDestinationColumnItems("overseas")
  }
];

export const findHotelDestinationByKeyword = (keyword: string | null | undefined) => {
  const normalizedKeyword = normalizeDestinationKey(keyword ?? "");
  if (!normalizedKeyword) {
    return null;
  }

  const hotelDestination = HOTEL_DESTINATION_CATALOG.find((entry) =>
    entry.aliases.some((alias) => normalizeDestinationKey(alias) === normalizedKeyword)
  );
  if (hotelDestination) {
    return hotelDestination;
  }

  return resolveSharedCityDestination(keyword);
};

export const findHotelDestinationByRegion = (region: string | null | undefined) => {
  if (!region) {
    return null;
  }

  const normalizedRegion = normalizeDestinationKey(region);
  const hotelDestination = HOTEL_DESTINATION_CATALOG.find((entry) => entry.region === normalizedRegion);
  if (hotelDestination) {
    return hotelDestination;
  }

  const sharedCityDestination = resolveSharedCityDestination(region);
  if (sharedCityDestination && normalizeDestinationKey(sharedCityDestination.region) === normalizedRegion) {
    return sharedCityDestination;
  }

  return null;
};

export const resolveHotelDestination = (
  region: string | null | undefined,
  keyword: string | null | undefined
): HotelDestinationResolution => {
  const regionDestination = findHotelDestinationByRegion(region);
  if (regionDestination) {
    return {
      destination: regionDestination,
      region: regionDestination.region,
      label: regionDestination.label,
      countryLabel: regionDestination.countryLabel
    };
  }

  const keywordDestination = findHotelDestinationByKeyword(keyword);
  if (keywordDestination) {
    return {
      destination: keywordDestination,
      region: keywordDestination.region,
      label: keywordDestination.label,
      countryLabel: keywordDestination.countryLabel
    };
  }

  return {
    destination: null,
    region: "unresolved",
    label: "지역 미지정",
    countryLabel: ""
  };
};

export const searchHotelCityDestinations = (query: string) => searchWorldCityDestinations(query);
