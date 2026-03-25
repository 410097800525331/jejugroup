import type { ReactElement } from "react";
import { createRoot, Root } from "react-dom/client";
import { flushSync } from "react-dom";
import { HotelHeaderTemplate, MainFooterTemplate, MainHeaderTemplate } from "@front-components/layout";
import { initFooter } from "@runtime/layout/footer";
import { initHeader } from "@runtime/layout/header";
import { markRuntimeReady } from "@runtime/lifecycle";
import { getAppRoot } from "@runtime/utils/appRoot";

const roots = new Map<string, Root>();

const runAfterRender = (onLoaded?: () => Promise<void> | void) =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      Promise.resolve(onLoaded?.())
        .catch((error) => {
          console.error("[ShellRuntime] onLoaded failed", error);
        })
        .finally(resolve);
    });
  });

const renderComponent = (hostId: string, component: ReactElement, onLoaded?: () => Promise<void> | void) => {
  const host = document.getElementById(hostId);
  if (!host) {
    return Promise.resolve();
  }

  const current = roots.get(hostId);
  if (current) {
    current.unmount();
  }

  const root = createRoot(host);
  roots.set(hostId, root);
  flushSync(() => {
    root.render(component);
  });

  return runAfterRender(onLoaded);
};

const ensureLucideIcons = (attempt = 0) => {
  const lucide = (window as { lucide?: { createIcons?: () => void } }).lucide;
  if (lucide?.createIcons) {
    lucide.createIcons();
    return;
  }

  if (attempt >= 30) {
    return;
  }

  window.setTimeout(() => {
    ensureLucideIcons(attempt + 1);
  }, 100);
};

const queueHeaderResync = () => {
  window.setTimeout(() => {
    initHeader();
  }, 0);
};

export const mountMainShell = async () => {
  const basePath = getAppRoot();

  await Promise.all([
    renderComponent("main-header-placeholder", <MainHeaderTemplate basePath={basePath} />, async () => {
      initHeader();
      ensureLucideIcons();
      markRuntimeReady("main-header");
    }),
    renderComponent("main-footer-placeholder", <MainFooterTemplate />, async () => {
      initFooter();
      ensureLucideIcons();
      markRuntimeReady("main-footer");
    }),
  ]);

  markRuntimeReady("main-shell");
  queueHeaderResync();
};

export const mountHotelShell = async () => {
  const basePath = getAppRoot();

  await Promise.all([
    renderComponent("hotel-header-placeholder", <HotelHeaderTemplate basePath={basePath} />, async () => {
      initHeader();
      ensureLucideIcons();
      markRuntimeReady("hotel-header");
      markRuntimeReady("main-header");
    }),
    renderComponent("hotel-footer-placeholder", <MainFooterTemplate />, async () => {
      initFooter();
      ensureLucideIcons();
      markRuntimeReady("hotel-footer");
      markRuntimeReady("main-footer");
    }),
  ]);

  markRuntimeReady("hotel-shell");
  queueHeaderResync();
};
