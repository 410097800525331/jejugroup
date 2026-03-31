if (window.gsap) {
  document.documentElement.classList.add("hero-reveal-pending");
}

let heroRevealFallbackTimeoutId = null;
const scheduleHeroRevealFallback = () => {
  if (heroRevealFallbackTimeoutId !== null) {
    window.clearTimeout(heroRevealFallbackTimeoutId);
  }

  heroRevealFallbackTimeoutId = window.setTimeout(() => {
    document.documentElement.classList.remove("hero-reveal-pending");
    heroRevealFallbackTimeoutId = null;
  }, 4000);
};

scheduleHeroRevealFallback();

const HERO_SEARCH_WIDGET_STATE_ATTR = "data-search-widget-state";
const HERO_SEARCH_WIDGET_PENDING = "pending";
const HERO_SEARCH_WIDGET_READY = "ready";

const initHeroSearchWidgetStability = (hostId, readyEventName) => {
  const host = document.getElementById(hostId);
  if (!host) {
    return;
  }

  let resolved = false;

  const markReady = () => {
    if (resolved) {
      return;
    }

    resolved = true;
    host.setAttribute(HERO_SEARCH_WIDGET_STATE_ATTR, HERO_SEARCH_WIDGET_READY);
    host.setAttribute("aria-busy", "false");
  };

  host.setAttribute(HERO_SEARCH_WIDGET_STATE_ATTR, HERO_SEARCH_WIDGET_PENDING);
  host.setAttribute("aria-busy", "true");

  if (host.childElementCount > 0) {
    markReady();
    return;
  }

  const observer = new MutationObserver(() => {
    if (host.childElementCount > 0) {
      markReady();
      observer.disconnect();
    }
  });

  observer.observe(host, { childList: true });

  if (readyEventName) {
    document.addEventListener(readyEventName, () => {
      markReady();
      observer.disconnect();
    }, { once: true });
  }
};

initHeroSearchWidgetStability("hotel-search-widget-root", "jeju:hotel-search-widget-mounted");

const initManagedBannerIconRuntime = async () => {
  try {
    const { initPublicManagedBannerIcons } = await import("../../../shared/banner-runtime/public-managed-icons.js");
    await initPublicManagedBannerIcons();
  } catch (error) {
    console.error("[HotelPage] managed banner icon runtime init failed", error);
  }
};

const startHotelPage = async () => {
  try {
    const { initHotelPage } = await import("./modules/hotelPageApp.js");
    initHotelPage();
  } catch (error) {
    console.error("[HotelPage] init failed", error);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void initManagedBannerIconRuntime();
    void startHotelPage();
  }, { once: true });
} else {
  void initManagedBannerIconRuntime();
  void startHotelPage();
}
