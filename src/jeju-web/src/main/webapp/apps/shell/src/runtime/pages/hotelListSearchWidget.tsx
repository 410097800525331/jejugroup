import { mountIsland } from "@runtime/pages/islandMount";
import { HotelListSearchWidgetIsland } from "@front-components/hotel/HotelListSearchWidgetIsland";

export const mountHotelListSearchWidgetRuntime = async () => {
  mountIsland("hotel-list-search-widget-root", <HotelListSearchWidgetIsland />);
};
