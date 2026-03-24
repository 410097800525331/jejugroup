const POPUP_IDS = ["destinationDropdown", "calendarPopup", "guestPopupLarge"];

const collectPopups = () => {
  return POPUP_IDS.reduce((popupMap, popupId) => {
    popupMap[popupId] = document.getElementById(popupId);
    return popupMap;
  }, {});
};

export const createPopupController = () => {
  const closeAllPopups = (exceptId = null) => {
    const popupMap = collectPopups();

    Object.entries(popupMap).forEach(([popupId, popup]) => {
      if (!popup || popupId === exceptId || !popup.classList.contains("active")) {
        return;
      }

      popup.classList.remove("active");
    });
  };

  return {
    closeAllPopups
  };
};
