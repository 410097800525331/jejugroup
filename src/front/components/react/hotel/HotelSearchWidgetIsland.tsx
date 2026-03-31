import { useLayoutEffect } from "react";
import { HotelSearchWidget } from "./HotelSearchWidget";

export const HOTEL_SEARCH_WIDGET_MOUNTED_EVENT = "jeju:hotel-search-widget-mounted";
export const SEARCH_WIDGET_MOUNTED_EVENT = "jeju:search-widget-mounted";

export const HotelSearchWidgetIsland = () => {
  useLayoutEffect(() => {
    const lucide = (window as Window & { lucide?: { createIcons?: () => void } }).lucide;
    if (lucide?.createIcons) {
      lucide.createIcons();
    }

    document.dispatchEvent(new Event(SEARCH_WIDGET_MOUNTED_EVENT));
    document.dispatchEvent(new Event(HOTEL_SEARCH_WIDGET_MOUNTED_EVENT));
  }, []);

  return <HotelSearchWidget />;
};
