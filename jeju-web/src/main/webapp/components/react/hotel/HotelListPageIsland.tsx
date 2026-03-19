import { useEffect, useMemo, useState } from "react";
import { HotelFilterSidebar } from "./HotelFilterSidebar";
import { HotelResultList } from "./HotelResultList";
import {
  buildMockHotelListPageData,
  buildHotelListSearchParams,
  filterHotelsBySelection,
  getSelectedFilterIds,
  readHotelListPageDataFromDom,
  type HotelFilterState
} from "./hotelListPageData";

const createCheckedSet = (filterIds: string[]) => new Set<string>(filterIds);
const PROPERTY_TYPE_SECTION_ID = "property-types";
const GUEST_RATING_SECTION_ID = "guest-ratings";
const LOCATION_SECTION_ID = "locations";

export const HotelListPageIsland = () => {
  const initialServerPageData = useMemo(() => {
    return readHotelListPageDataFromDom();
  }, []);
  const [pageData, setPageData] = useState(() => {
    return initialServerPageData ?? buildMockHotelListPageData(window.location.search);
  });
  const [checkedOptionIds, setCheckedOptionIds] = useState<Set<string>>(() =>
    createCheckedSet(getSelectedFilterIds(initialServerPageData ?? buildMockHotelListPageData(window.location.search)))
  );

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
            setPageData(nextPageData);
            setCheckedOptionIds(createCheckedSet(getSelectedFilterIds(nextPageData)));
          })
          .catch(() => {
            // keep local filtering path for static preview or transient backend failures
          });
      }

      return next;
    });
  };

  const filterState = useMemo<HotelFilterState>(() => {
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
      selectedOptionIds: Array.from(checkedOptionIds)
    };
  }, [checkedOptionIds, pageData.filterSections]);

  const filteredHotels = useMemo(() => {
    return filterHotelsBySelection(pageData.hotels, filterState);
  }, [filterState, pageData.hotels]);

  return (
    <>
      <HotelFilterSidebar
        checkedOptionIds={checkedOptionIds}
        mapButtonLabel={pageData.mapButtonLabel}
        onToggle={handleToggle}
        sections={pageData.filterSections}
      />
      <HotelResultList hotels={filteredHotels} />
    </>
  );
};
