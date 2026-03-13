import { SearchDestinationDropdown } from "@front-components/search/SearchDestinationDropdown";
import { useHotelSearchWidget } from "./HotelSearchWidgetContext";
import { DESTINATION_COLUMNS } from "./searchWidgetData";

export const HotelSearchWidgetDestinationDropdown = () => {
  const { state, selectDestination, stopPropagation } = useHotelSearchWidget();

  return (
    <SearchDestinationDropdown
      columns={DESTINATION_COLUMNS}
      dropdownId="destinationDropdown"
      isOpen={state.isDestinationOpen}
      onInteract={stopPropagation}
      onSelect={selectDestination}
    />
  );
};
