import { mountIsland } from "@runtime/pages/islandMount";
import { HotelSearchWidgetIsland } from "@front-components/hotel/HotelSearchWidgetIsland";

export const mountHotelSearchWidgetRuntime = async () => {
  mountIsland("hotel-search-widget-root", <HotelSearchWidgetIsland />);
};
