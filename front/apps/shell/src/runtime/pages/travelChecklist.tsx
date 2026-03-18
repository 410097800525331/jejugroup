import { mountIsland } from "@runtime/pages/islandMount";
import { TravelChecklistApp } from "@front-components/travel/TravelChecklistApp";

export const mountTravelChecklistRuntime = async () => {
  mountIsland("jeju-travel-checklist-app", <TravelChecklistApp />);
};
