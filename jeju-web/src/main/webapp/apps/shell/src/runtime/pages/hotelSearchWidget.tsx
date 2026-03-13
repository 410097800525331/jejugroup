import { mountIsland } from "@runtime/pages/islandMount";

export const mountHotelSearchWidgetRuntime = async () => {
  const { HotelSearchWidgetIsland } = await import("@front-components/hotel/HotelSearchWidgetIsland");
  mountIsland("hotel-search-widget-root", <HotelSearchWidgetIsland />);
};
