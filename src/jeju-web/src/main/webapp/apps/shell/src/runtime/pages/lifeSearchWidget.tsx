import { mountIsland } from "@runtime/pages/islandMount";
import { LifeSearchWidgetIsland } from "@front-components/life/LifeSearchWidgetIsland";

export const mountLifeSearchWidgetRuntime = async () => {
  mountIsland("life-search-widget-root", <LifeSearchWidgetIsland />);
};
