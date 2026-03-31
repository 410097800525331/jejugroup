import { SearchTabs } from "@front-components/search/SearchTabs";
import { useHotelSearchWidget } from "./HotelSearchWidgetContext";
import { SEARCH_TABS } from "./searchWidgetData";

export const HotelSearchTabs = () => {
  const { state, setActiveTab, stopPropagation } = useHotelSearchWidget();

  return (
    <SearchTabs
      activeTab={state.activeTab}
      items={SEARCH_TABS}
      onInteract={stopPropagation}
      onTabChange={(tab) => {
        setActiveTab(tab as "hotel" | "pension" | "activity");
      }}
    />
  );
};
