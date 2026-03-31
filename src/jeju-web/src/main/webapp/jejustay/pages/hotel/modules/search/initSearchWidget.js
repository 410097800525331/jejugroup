import { createCalendarInitializer } from "./calendar.js";
import { initDestinationDropdown } from "./destinationDropdown.js";
import { initGuestSelector } from "./guestSelector.js";
import { createPopupController } from "./popupController.js";
import { initSearchTabs } from "./tabs.js";

let globalPopupCloseBound = false;

export const initSearchWidget = () => {
  const { closeAllPopups } = createPopupController();
  const { initCalendar } = createCalendarInitializer({ closeAllPopups });

  initSearchTabs();
  initDestinationDropdown({ closeAllPopups });
  initCalendar();
  initGuestSelector({ closeAllPopups });

  if (!globalPopupCloseBound) {
    globalPopupCloseBound = true;
    document.addEventListener("click", () => {
      closeAllPopups();
    });
  }
};
