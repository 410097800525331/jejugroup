import { initFooter } from "@runtime/layout/footer";
import { bindHeaderGlobalEvents, initHeader } from "@runtime/layout/header";
import { initMegaMenu } from "@runtime/layout/megaMenu";
import { ensureRouteBinder } from "@runtime/layout/routeBridge";
import { ensureStaggerBinding, initStaggerNav } from "@runtime/layout/stagger";
import { reservationDrawer } from "@runtime/ui/drawer";
import { createRangeCalendar, installRangeCalendarGlobal } from "@runtime/ui/rangeCalendar";

let globalsInstalled = false;
let drawerBound = false;

const bindDrawerAction = () => {
  if (drawerBound) {
    return;
  }

  drawerBound = true;

  document.body.addEventListener("click", async (event) => {
    const actionElement = (event.target as HTMLElement | null)?.closest('[data-action="OPEN_RESERVATION_DRAWER"]');
    if (!actionElement) {
      return;
    }

    event.preventDefault();
    await reservationDrawer.open();
  });
};

export const installLegacyGlobals = () => {
  if (globalsInstalled) {
    return;
  }

  globalsInstalled = true;

  window.initHeader = () => initHeader();
  window.initFooter = () => initFooter();
  window.initMegaMenu = () => initMegaMenu();
  window.initStaggerNav = () => initStaggerNav();

  installRangeCalendarGlobal();
  bindHeaderGlobalEvents();
  ensureStaggerBinding();
  bindDrawerAction();

  void ensureRouteBinder();
};

export const createRangeCalendarRuntime = (config?: Record<string, unknown>) => {
  installLegacyGlobals();
  return createRangeCalendar(config);
};
