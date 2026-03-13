import { useEffect } from "react";
import { HotelSearchWidget } from "./HotelSearchWidget";

export const HOTEL_SEARCH_WIDGET_MOUNTED_EVENT = "jeju:hotel-search-widget-mounted";

export const HotelSearchWidgetIsland = () => {
  useEffect(() => {
    const lucide = (window as Window & { lucide?: { createIcons?: () => void } }).lucide;
    if (lucide?.createIcons) {
      lucide.createIcons();
    }
    document.dispatchEvent(new Event(HOTEL_SEARCH_WIDGET_MOUNTED_EVENT));
  }, []);

  return <HotelSearchWidget />;
};
