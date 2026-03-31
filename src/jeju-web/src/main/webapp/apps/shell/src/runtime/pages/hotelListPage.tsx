import { mountIsland } from "@runtime/pages/islandMount";
import { HotelListPageIsland } from "@front-components/hotel/HotelListPageIsland";

export const mountHotelListPageRuntime = async () => {
  mountIsland("hotel-list-page-root", <HotelListPageIsland />);
};
