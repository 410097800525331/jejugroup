import { SearchGuestPopup } from "@front-components/search/SearchGuestPopup";
import { useHotelSearchWidget } from "./HotelSearchWidgetContext";
import { GUEST_ROWS } from "./searchWidgetData";

export const HotelSearchWidgetGuestPopup = () => {
  const { state, adjustGuest, stopPropagation } = useHotelSearchWidget();

  return (
    <SearchGuestPopup
      isOpen={state.isGuestOpen}
      onAdjust={(key, delta, event) => {
        adjustGuest(key as "rooms" | "adults" | "children", delta, event);
      }}
      onInteract={stopPropagation}
      popupId="guestPopupLarge"
      rows={GUEST_ROWS}
      values={state.guest}
    />
  );
};
