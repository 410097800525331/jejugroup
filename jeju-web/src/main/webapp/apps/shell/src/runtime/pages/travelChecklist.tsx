import { mountIsland } from "@runtime/pages/islandMount";

export const mountTravelChecklistRuntime = async () => {
  const { TravelChecklistApp } = await import("@front-components/travel/TravelChecklistApp");
  mountIsland("jeju-travel-checklist-app", <TravelChecklistApp />);
};
