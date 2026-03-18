import { SearchGuestPopup } from "@front-components/search/SearchGuestPopup";
import { useLifeSearchWidget } from "./LifeSearchWidgetContext";
import { LIFE_GUEST_ROWS } from "./lifeSearchWidgetData";

export const LifeSearchWidgetGuestPopup = () => {
  const { state, adjustGuest, stopPropagation } = useLifeSearchWidget();

  return (
    <SearchGuestPopup
      isOpen={state.isGuestOpen}
      onAdjust={(key, delta, event) => {
        adjustGuest(key as "rooms" | "adults" | "children", delta, event);
      }}
      onInteract={stopPropagation}
      popupId="guestPopupLarge"
      rows={LIFE_GUEST_ROWS}
      values={state.guest}
    />
  );
};
