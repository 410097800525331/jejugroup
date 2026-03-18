import { initFooter } from "@runtime/layout/footer";
import { initHeader } from "@runtime/layout/header";
import { initMegaMenu } from "@runtime/layout/megaMenu";
import { mountHotelShell, mountMainShell } from "@runtime/layout/shellMount";
import { initStaggerNav } from "@runtime/layout/stagger";
import { createRangeCalendarRuntime, installLegacyGlobals } from "@runtime/globals";
import { mountLoginRuntime } from "@runtime/pages/login";
import { mountPassAuthRuntime } from "@runtime/pages/passAuth";
import { mountMyPageDashboardRuntime } from "@runtime/pages/mypage";
import { mountPageShellRuntime } from "@runtime/pages/pageShell";
import { mountSignupRuntime } from "@runtime/pages/signup";
import { mountTravelChecklistRuntime } from "@runtime/pages/travelChecklist";
import { mountHotelSearchWidgetRuntime } from "@runtime/pages/hotelSearchWidget";
import { mountLifeSearchWidgetRuntime } from "@runtime/pages/lifeSearchWidget";
import { reservationDrawer } from "@runtime/ui/drawer";
import { setupLegacyFab } from "@runtime/ui/fab";
import { setupLegacyChatbot } from "@runtime/widget/chatbot";
import { setupWeatherWidget } from "@runtime/widget/weather";
export { installRuntimeLifecycle, markRuntimeReady, whenRuntimeReady } from "@runtime/lifecycle";

export const mountMainShellRuntime = async () => {
  installLegacyGlobals();
  await mountMainShell();
};

export const mountHotelShellRuntime = async () => {
  installLegacyGlobals();
  await mountHotelShell();
};

export const mountPageShellBridgeRuntime = async () => {
  installLegacyGlobals();
  return mountPageShellRuntime();
};

export const ensureHeaderBehavior = () => {
  installLegacyGlobals();
  initHeader();
};

export const ensureFooterBehavior = () => {
  installLegacyGlobals();
  initFooter();
};

export const ensureMegaMenuBehavior = () => {
  installLegacyGlobals();
  initMegaMenu();
};

export const ensureStaggerNavBehavior = () => {
  installLegacyGlobals();
  initStaggerNav();
};

export const openReservationDrawer = async () => {
  installLegacyGlobals();
  await reservationDrawer.open();
};

export const closeReservationDrawer = () => {
  installLegacyGlobals();
  reservationDrawer.close();
};

export const setupLegacyFabRuntime = () => {
  installLegacyGlobals();
  setupLegacyFab();
};

export const setupLegacyChatbotRuntime = () => {
  installLegacyGlobals();
  setupLegacyChatbot();
};

export const setupWeatherWidgetRuntime = () => {
  installLegacyGlobals();
  setupWeatherWidget();
};

export { createRangeCalendarRuntime, installLegacyGlobals };

export const mountAuthLoginRuntime = () => {
  mountLoginRuntime();
};

export const mountAuthSignupRuntime = () => {
  mountSignupRuntime();
};

export const mountAuthPassRuntime = () => {
  mountPassAuthRuntime();
};

export const mountMyPageRuntime = () => {
  mountMyPageDashboardRuntime();
};

export const mountTravelChecklistPageRuntime = async () => {
  await mountTravelChecklistRuntime();
};

export const mountHotelSearchWidgetPageRuntime = async () => {
  await mountHotelSearchWidgetRuntime();
};

export const mountLifeSearchWidgetPageRuntime = async () => {
  await mountLifeSearchWidgetRuntime();
};

export const runtimeReservationDrawer = reservationDrawer;
