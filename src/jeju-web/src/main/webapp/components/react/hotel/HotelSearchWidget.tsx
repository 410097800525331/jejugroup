import { HotelSearchWidgetProvider } from "./HotelSearchWidgetContext";
import { HotelSearchFormActivity } from "./HotelSearchWidgetActivityForm";
import { HotelSearchFormHotel } from "./HotelSearchWidgetHotelForm";
import { HotelSearchTabs } from "./HotelSearchWidgetTabs";

export const HotelSearchWidget = () => {
  return (
    <HotelSearchWidgetProvider>
      <div className="search-widget-large">
        <HotelSearchTabs />
        <HotelSearchFormHotel />
        <HotelSearchFormActivity />
      </div>
    </HotelSearchWidgetProvider>
  );
};
