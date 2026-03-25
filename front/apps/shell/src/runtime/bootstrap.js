import {
  installLegacyGlobals,
  mountAuthLoginRuntime,
  mountAuthPassRuntime,
  mountPageShellBridgeRuntime,
  mountAuthSignupRuntime,
  mountHotelShellRuntime,
  mountMainShellRuntime,
  mountMyPageRuntime,
  mountHotelSearchWidgetPageRuntime,
  mountHotelListSearchWidgetPageRuntime,
  mountHotelListPageIslandRuntime,
  mountLifeSearchWidgetPageRuntime,
  mountTravelChecklistPageRuntime,
  setupLegacyChatbotRuntime,
  setupLegacyFabRuntime,
  setupWeatherWidgetRuntime,
} from "./index.ts";
import { installRuntimeLifecycle, markRuntimeReady } from "./lifecycle.js";

const BOOT_FLAG = "__JEJU_RUNTIME_BOOTSTRAP_PROMISE__";
const NAV_LOCK_TTL_MS = 1200;

const resolveAppRoot = () => {
  const currentScript = document.currentScript;
  if (currentScript && currentScript.src) {
    return new URL("../../", currentScript.src).href;
  }

  return new URL(/* @vite-ignore */ "../../", import.meta.url).href;
};

const APP_ROOT = resolveAppRoot();

const normalizeTarget = (target) => {
  if (!target || typeof target !== "string") {
    return "";
  }

  try {
    return new URL(target, window.location.href).href;
  } catch (_error) {
    return "";
  }
};

const isSameLocation = (targetUrl) => {
  if (!targetUrl) {
    return false;
  }

  try {
    const current = new URL(window.location.href);
    const target = new URL(targetUrl);
    return current.pathname === target.pathname && current.search === target.search && current.hash === target.hash;
  } catch (_error) {
    return false;
  }
};

const releaseNavLock = () => {
  window.__JEJU_ROUTE_NAV_LOCK = null;
};

const safeNavigate = (targetUrl, reason = "runtime-bootstrap", options = {}) => {
  const target = normalizeTarget(targetUrl);
  if (!target) {
    return;
  }

  if (isSameLocation(target)) {
    return;
  }

  if (window.__JEJU_ROUTE_NAV_LOCK === target) {
    return;
  }

  window.__JEJU_ROUTE_NAV_LOCK = target;
  setTimeout(releaseNavLock, NAV_LOCK_TTL_MS);

  if (options && options.mode === "replace") {
    window.location.replace(target);
    return;
  }

  window.location.assign(target);
};

const ensureNavigator = () => {
  if (!window.__JEJU_ROUTE_NAVIGATOR__) {
    window.__JEJU_ROUTE_NAVIGATOR__ = {
      appRoot: APP_ROOT,
      homeUrl: new URL("index.html", APP_ROOT).href,
      safeNavigate,
    };
    return;
  }

  window.__JEJU_ROUTE_NAVIGATOR__.appRoot = window.__JEJU_ROUTE_NAVIGATOR__.appRoot || APP_ROOT;
  window.__JEJU_ROUTE_NAVIGATOR__.homeUrl =
    window.__JEJU_ROUTE_NAVIGATOR__.homeUrl || new URL("index.html", APP_ROOT).href;
  if (!window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate = safeNavigate;
  }
};

const hasShellPlaceholders = () => {
  return Boolean(document.getElementById("main-header-placeholder") || document.getElementById("hotel-header-placeholder"));
};

const hasMainShell = () => {
  return Boolean(document.getElementById("main-header-placeholder") || document.getElementById("main-footer-placeholder"));
};

const hasHotelShell = () => {
  return Boolean(document.getElementById("hotel-header-placeholder") || document.getElementById("hotel-footer-placeholder"));
};

const hasFabStyle = () => {
  return Array.from(document.querySelectorAll("link[rel='stylesheet']")).some((link) => {
    const href = link.getAttribute("href") || "";
    return href.includes("components/react/ui/FAB/fab.css");
  });
};

const hasChatbotStyle = () => {
  return Array.from(document.querySelectorAll("link[rel='stylesheet']")).some((link) => {
    const href = link.getAttribute("href") || "";
    return href.includes("components/react/widget/chatbot-style.css");
  });
};

const hasWeatherUi = () => {
  return Boolean(
    document.getElementById("weather-open-btn") ||
      document.getElementById("weather-overlay") ||
      document.getElementById("weather-detail-container"),
  );
};

const hasLoginIsland = () => Boolean(document.getElementById("jeju-login-app"));

const hasSignupIsland = () => Boolean(document.getElementById("jeju-signup-app"));

const hasPassAuthIsland = () => Boolean(document.getElementById("jeju-pass-auth-app"));

const hasMyPageIsland = () => Boolean(document.getElementById("mypage-dashboard-root"));

const hasTravelChecklistIsland = () => Boolean(document.getElementById("jeju-travel-checklist-app"));

const hasHotelSearchWidgetIsland = () => Boolean(document.getElementById("hotel-search-widget-root"));

const hasHotelListSearchWidgetIsland = () => Boolean(document.getElementById("hotel-list-search-widget-root"));

const hasHotelListPageIsland = () => Boolean(document.getElementById("hotel-list-page-root"));

const hasLifeSearchWidgetIsland = () => Boolean(document.getElementById("life-search-widget-root"));

const hasPageShellHosts = () =>
  Boolean(document.getElementById("jeju-page-shell-header") || document.getElementById("jeju-page-shell-footer"));

const ensureRuntimeStyle = () => {
  const href = new URL("components/runtime/style.css", APP_ROOT).href;
  const alreadyLoaded = Array.from(document.querySelectorAll("link[rel='stylesheet']")).some((link) => {
    const rawHref = link.getAttribute("href") || link.href;
    if (!rawHref) {
      return false;
    }

    try {
      return new URL(rawHref, window.location.href).href === href;
    } catch (_error) {
      return rawHref === href;
    }
  });

  if (alreadyLoaded) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

const bootRuntime = async () => {
  installRuntimeLifecycle();
  markRuntimeReady("bootstrap");
  ensureNavigator();
  installLegacyGlobals();

  if (hasMainShell()) {
    ensureRuntimeStyle();
    await mountMainShellRuntime();
  } else if (hasHotelShell()) {
    ensureRuntimeStyle();
    await mountHotelShellRuntime();
  }

  if (hasFabStyle()) {
    setupLegacyFabRuntime();
  }

  if (hasChatbotStyle()) {
    setupLegacyChatbotRuntime();
  }

  if (hasWeatherUi()) {
    setupWeatherWidgetRuntime();
  }

  if (hasPageShellHosts()) {
    await mountPageShellBridgeRuntime();
  }

  if (hasLoginIsland()) {
    mountAuthLoginRuntime();
  }

  if (hasSignupIsland()) {
    mountAuthSignupRuntime();
  }

  if (hasPassAuthIsland()) {
    mountAuthPassRuntime();
  }

  if (hasMyPageIsland()) {
    mountMyPageRuntime();
  }

  if (hasHotelSearchWidgetIsland()) {
    await mountHotelSearchWidgetPageRuntime();
  }

  if (hasHotelListSearchWidgetIsland()) {
    await mountHotelListSearchWidgetPageRuntime();
  }

  if (hasHotelListPageIsland()) {
    await mountHotelListPageIslandRuntime();
  }

  if (hasLifeSearchWidgetIsland()) {
    await mountLifeSearchWidgetPageRuntime();
  }

  if (hasTravelChecklistIsland()) {
    await mountTravelChecklistPageRuntime();
  }
};

const start = () => {
  if (window[BOOT_FLAG]) {
    return;
  }

  const run = async () => {
    if (
      !hasShellPlaceholders() &&
      !hasFabStyle() &&
      !hasChatbotStyle() &&
      !hasWeatherUi() &&
      !hasLoginIsland() &&
      !hasSignupIsland() &&
      !hasPassAuthIsland() &&
      !hasMyPageIsland() &&
      !hasHotelSearchWidgetIsland() &&
      !hasHotelListSearchWidgetIsland() &&
      !hasHotelListPageIsland() &&
      !hasLifeSearchWidgetIsland() &&
      !hasTravelChecklistIsland() &&
      !hasPageShellHosts()
    ) {
      ensureNavigator();
      installLegacyGlobals();
      return;
    }

    try {
      await bootRuntime();
    } catch (error) {
      console.error("[Runtime Bootstrap] failed", error);
    }
  };

  window[BOOT_FLAG] = Promise.resolve().then(run);
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
