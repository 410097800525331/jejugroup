import type { HotelListPageData, HotelListPageHotel } from "./hotelListPageData";

export const HOTEL_LIST_OFFER_OVERRIDE_STORAGE_KEY = "jejuHotelListOfferOverridesV1";

interface HotelListOfferOverride {
  badge?: string;
  currentPrice?: number;
  originalPrice?: number;
}

type HotelListOfferOverrideMap = Record<string, HotelListOfferOverride>;

const parsePriceValue = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }

  return Math.round(value);
};

const formatWonPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR", {
    currency: "KRW",
    maximumFractionDigits: 0,
    style: "currency"
  }).format(price);
};

const hasStorageSupport = () => {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
};

const parseOverrideMap = (rawValue: string | null): HotelListOfferOverrideMap => {
  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, HotelListOfferOverride>;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    return Object.entries(parsed).reduce<HotelListOfferOverrideMap>((accumulator, [hotelId, value]) => {
      if (!value || typeof value !== "object") {
        return accumulator;
      }

      const nextOverride: HotelListOfferOverride = {};

      if (Object.prototype.hasOwnProperty.call(value, "badge") && typeof value.badge === "string") {
        nextOverride.badge = value.badge;
      }

      const currentPrice = parsePriceValue(value.currentPrice);
      if (currentPrice !== null) {
        nextOverride.currentPrice = currentPrice;
      }

      const originalPrice = parsePriceValue(value.originalPrice);
      if (originalPrice !== null) {
        nextOverride.originalPrice = originalPrice;
      }

      if (Object.keys(nextOverride).length > 0) {
        accumulator[hotelId] = nextOverride;
      }

      return accumulator;
    }, {});
  } catch (_error) {
    return {};
  }
};

export const readHotelListOfferOverrideMap = () => {
  if (!hasStorageSupport()) {
    return {};
  }

  return parseOverrideMap(window.localStorage.getItem(HOTEL_LIST_OFFER_OVERRIDE_STORAGE_KEY));
};

const applyHotelListOfferOverride = (hotel: HotelListPageHotel, override: HotelListOfferOverride | undefined) => {
  if (!override) {
    return hotel;
  }

  const nextHotel: HotelListPageHotel = {
    ...hotel
  };

  if (Object.prototype.hasOwnProperty.call(override, "badge")) {
    nextHotel.badge = override.badge ?? "";
  }

  if (typeof override.originalPrice === "number") {
    nextHotel.originalPrice = formatWonPrice(override.originalPrice);
  }

  if (typeof override.currentPrice === "number") {
    nextHotel.currentPrice = formatWonPrice(override.currentPrice);
  }

  return nextHotel;
};

export const applyHotelListOfferOverridesToPageData = (pageData: HotelListPageData): HotelListPageData => {
  const overrideMap = readHotelListOfferOverrideMap();
  if (Object.keys(overrideMap).length === 0) {
    return pageData;
  }

  return {
    ...pageData,
    hotels: pageData.hotels.map((hotel) => applyHotelListOfferOverride(hotel, overrideMap[hotel.id]))
  };
};

export const subscribeToHotelListOfferOverrideChanges = (onChange: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== HOTEL_LIST_OFFER_OVERRIDE_STORAGE_KEY) {
      return;
    }

    onChange();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener("focus", onChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("focus", onChange);
  };
};
