import { initPremiumAnimations } from "./interactions/premiumAnimations.js";
import { initScrollAnimations, initWishlistButtons } from "./interactions/commonInteractions.js";
import { initMonthlyHotelDeals } from "./monthlyDeals.js";

const initLegacyIcons = () => {
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  }
};

const initPremiumAnimationsWhenReady = () => {
  const searchWidgetHost = document.getElementById("hotel-search-widget-root");
  if (searchWidgetHost?.childElementCount) {
    initPremiumAnimations();
    return;
  }

  document.addEventListener(
    "jeju:hotel-search-widget-mounted",
    () => {
      initPremiumAnimations();
    },
    { once: true }
  );
};

export const initHotelPage = () => {
  initLegacyIcons();
  initWishlistButtons();
  initScrollAnimations();
  initPremiumAnimationsWhenReady();
  void initMonthlyHotelDeals();
};
