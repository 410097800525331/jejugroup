import { useMemo } from "react";
import { HotelSearchWidgetProvider } from "./HotelSearchWidgetContext";
import { HotelListSearchBar } from "./HotelListSearchBar";
import { getHotelSearchInitialStateFromUrl } from "./hotelSearchQuery";

export const HotelListSearchWidget = () => {
  const initialState = useMemo(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    return getHotelSearchInitialStateFromUrl(window.location.search);
  }, []);

  return (
    <HotelSearchWidgetProvider initialState={initialState}>
      <div className="search-widget-large hotel-list-search-widget">
        <HotelListSearchBar />
      </div>
    </HotelSearchWidgetProvider>
  );
};
