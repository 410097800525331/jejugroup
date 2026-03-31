import { getDestinationSuggestionColumns } from "../../../shared/destination/destinationSearch.js";
import { SearchDestinationDropdown } from "@front-components/search/SearchDestinationDropdown";
import { useHotelSearchWidget } from "./HotelSearchWidgetContext";
import { DESTINATION_COLUMNS } from "./searchWidgetData";

export const HotelSearchWidgetDestinationDropdown = () => {
  const { state, selectDestination, stopPropagation } = useHotelSearchWidget();
  const columns = getDestinationSuggestionColumns(
    state.destinationValue,
    state.hasTypedDestinationQuery,
    DESTINATION_COLUMNS
  );

  return (
    <SearchDestinationDropdown
      columns={columns}
      dropdownId="destinationDropdown"
      isOpen={state.isDestinationOpen}
      onInteract={stopPropagation}
      onSelect={selectDestination}
    />
  );
};
