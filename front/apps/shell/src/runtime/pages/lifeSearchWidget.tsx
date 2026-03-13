import { mountIsland } from "@runtime/pages/islandMount";

export const mountLifeSearchWidgetRuntime = async () => {
  const { LifeSearchWidgetIsland } = await import("@front-components/life/LifeSearchWidgetIsland");
  mountIsland("life-search-widget-root", <LifeSearchWidgetIsland />);
};
