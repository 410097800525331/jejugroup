import { SearchOptionsPopup } from "@front-components/search/SearchOptionsPopup";
import { useLifeSearchWidget } from "./LifeSearchWidgetContext";
import { LIFE_REQUIRED_OPTIONS } from "./lifeSearchWidgetData";

export const LifeSearchWidgetOptionsPopup = () => {
  const { state, stopPropagation, toggleRequiredOption } = useLifeSearchWidget();

  return (
    <SearchOptionsPopup
      isOpen={state.isOptionsOpen}
      onInteract={stopPropagation}
      onToggle={toggleRequiredOption}
      options={LIFE_REQUIRED_OPTIONS}
      popupId="optionsPopupLarge"
      selectedValues={state.requiredOptions}
    />
  );
};
