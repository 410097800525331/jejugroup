import { useEffect, useMemo, useState } from "react";
import { HotelFilterSidebar } from "./HotelFilterSidebar";
import { HotelResultList } from "./HotelResultList";
import {
  applyHotelListOfferOverridesToPageData,
  subscribeToHotelListOfferOverrideChanges
} from "./hotelListOfferOverrides";
import {
  buildMockHotelListPageData,
  buildHotelListSearchParams,
  enhanceHotelListPageData,
  filterHotelsBySelection,
  getSelectedFilterIds,
  parseHotelPriceValue,
  readHotelListPageDataFromDom,
  type HotelFilterState
} from "./hotelListPageData";

const createCheckedSet = (filterIds: string[]) => new Set<string>(filterIds);
const createPriceBounds = (hotels: Parameters<typeof filterHotelsBySelection>[0]) => {
  if (hotels.length === 0) {
    return {
      min: 0,
      max: 0
    };
  }

  const prices = hotels.map((hotel) => parseHotelPriceValue(hotel.currentPrice));
  const maxPrice = Math.max(...prices);

  return {
    min: 0,
    max: maxPrice
  };
};
const clampPriceRange = (priceRange: { max: number; min: number }, priceBounds: { max: number; min: number }) => {
  const nextMin = Math.max(priceBounds.min, Math.min(priceRange.min, priceBounds.max));
  const nextMax = Math.min(priceBounds.max, Math.max(priceRange.max, priceBounds.min));

  if (nextMin > nextMax) {
    return {
      min: priceBounds.min,
      max: priceBounds.max
    };
  }

  return {
    min: nextMin,
    max: nextMax
  };
};
const PROPERTY_TYPE_SECTION_ID = "property-types";
const GUEST_RATING_SECTION_ID = "guest-ratings";
const LOCATION_SECTION_ID = "locations";

export const HotelListPageIsland = () => {
  const initialServerPageData = useMemo(() => {
    const serverPageData = readHotelListPageDataFromDom();
    return serverPageData ? enhanceHotelListPageData(serverPageData) : null;
  }, []);
  const initialBasePageData = useMemo(() => {
    return initialServerPageData ?? buildMockHotelListPageData(window.location.search);
  }, [initialServerPageData]);
  const [basePageData, setBasePageData] = useState(() => {
    return initialBasePageData;
  });
  const [offerOverrideVersion, setOfferOverrideVersion] = useState(0);
  const pageData = useMemo(() => {
    return applyHotelListOfferOverridesToPageData(basePageData);
  }, [basePageData, offerOverrideVersion]);
  const [checkedOptionIds, setCheckedOptionIds] = useState<Set<string>>(() =>
    createCheckedSet(getSelectedFilterIds(initialBasePageData))
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(() =>
    createPriceBounds(applyHotelListOfferOverridesToPageData(initialBasePageData).hotels)
  );

  useEffect(() => {
    return subscribeToHotelListOfferOverrideChanges(() => {
      setOfferOverrideVersion((current) => current + 1);
    });
  }, []);

  const hasBackendPayload = initialServerPageData !== null;
  useEffect(() => {
    const stickySearch = document.getElementById("stickySearch");
    if (!stickySearch) {
      return undefined;
    }

    const handleScroll = () => {
      stickySearch.classList.toggle("scrolled", window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleToggle = (optionId: string) => {
    setCheckedOptionIds((current) => {
      const next = new Set(current);
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }

      const nextFilterIds = Array.from(next);
      const nextSearchParams = buildHotelListSearchParams(window.location.search, nextFilterIds);
      const nextUrl = `${window.location.pathname}?${nextSearchParams.toString()}`;
      window.history.replaceState(null, "", nextUrl);

      if (hasBackendPayload) {
        const apiUrl = `/api/stay/hotel-list?${nextSearchParams.toString()}`;
        void fetch(apiUrl, {
          headers: {
            Accept: "application/json"
          }
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`hotel list fetch failed: ${response.status}`);
            }

            return response.json();
          })
          .then((nextPageData) => {
            const enhancedPageData = enhanceHotelListPageData(nextPageData);
            setBasePageData(enhancedPageData);
            setCheckedOptionIds(createCheckedSet(getSelectedFilterIds(enhancedPageData)));
          })
          .catch(() => {
            // keep local filtering path for static preview or transient backend failures
          });
      }

      return next;
    });
  };

  const optionFilterState = useMemo<HotelFilterState>(() => {
    const propertyTypes = pageData.filterSections
      .find((section) => section.id === PROPERTY_TYPE_SECTION_ID)
      ?.options.map((option) => option.id)
      .filter((optionId) => checkedOptionIds.has(optionId)) ?? [];

    const guestRatingOptions = pageData.filterSections
      .find((section) => section.id === GUEST_RATING_SECTION_ID)
      ?.options ?? [];

    const locationIds = pageData.filterSections
      .find((section) => section.id === LOCATION_SECTION_ID)
      ?.options.map((option) => option.id)
      .filter((optionId) => checkedOptionIds.has(optionId)) ?? [];

    const selectedThresholds = guestRatingOptions
      .filter((option) => checkedOptionIds.has(option.id))
      .map((option) => Number.parseInt(option.id.replace("rating-", ""), 10))
      .filter((value) => !Number.isNaN(value));

    return {
      propertyTypeIds: propertyTypes,
      locationIds,
      guestRatingThreshold: selectedThresholds.length > 0 ? Math.max(...selectedThresholds) : null,
      minPrice: null,
      maxPrice: null,
      selectedOptionIds: Array.from(checkedOptionIds)
    };
  }, [checkedOptionIds, pageData.filterSections]);

  const priceFilteredCandidateHotels = useMemo(() => {
    return filterHotelsBySelection(pageData.hotels, optionFilterState);
  }, [optionFilterState, pageData.hotels]);

  const priceBounds = useMemo(() => createPriceBounds(priceFilteredCandidateHotels), [priceFilteredCandidateHotels]);

  useEffect(() => {
    setSelectedPriceRange((current) => clampPriceRange(current, priceBounds));
  }, [priceBounds]);

  const handlePriceChange = (nextPriceRange: { max: number; min: number }) => {
    setSelectedPriceRange(clampPriceRange(nextPriceRange, priceBounds));
  };

  const filterState = useMemo<HotelFilterState>(() => {
    return {
      ...optionFilterState,
      minPrice: selectedPriceRange.min,
      maxPrice: selectedPriceRange.max
    };
  }, [optionFilterState, selectedPriceRange.max, selectedPriceRange.min]);

  const filteredHotels = useMemo(() => {
    return filterHotelsBySelection(priceFilteredCandidateHotels, filterState);
  }, [filterState, priceFilteredCandidateHotels]);

  return (
    <>
      <HotelFilterSidebar
        checkedOptionIds={checkedOptionIds}
        mapButtonLabel={pageData.mapButtonLabel}
        onToggle={handleToggle}
        onPriceChange={handlePriceChange}
        priceBounds={priceBounds}
        priceRange={selectedPriceRange}
        sections={pageData.filterSections}
      />
      <HotelResultList hotels={filteredHotels} />
    </>
  );
};
