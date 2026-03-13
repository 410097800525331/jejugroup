import type { ReactElement } from "react";
import { createRoot, Root } from "react-dom/client";
import { HotelHeaderTemplate, MainFooterTemplate, MainHeaderTemplate } from "@front-components/layout";
import { initFooter } from "@runtime/layout/footer";
import { initHeader } from "@runtime/layout/header";
import { getAppRoot } from "@runtime/utils/appRoot";

const roots = new Map<string, Root>();

const runAfterRender = (onLoaded?: () => Promise<void> | void) => {
  requestAnimationFrame(() => {
    Promise.resolve(onLoaded?.()).catch((error) => {
      console.error("[ShellRuntime] onLoaded failed", error);
    });
  });
};

const renderComponent = (hostId: string, component: ReactElement, onLoaded?: () => Promise<void> | void) => {
  const host = document.getElementById(hostId);
  if (!host) {
    return;
  }

  const current = roots.get(hostId);
  if (current) {
    current.unmount();
  }

  const root = createRoot(host);
  roots.set(hostId, root);
  root.render(component);

  runAfterRender(onLoaded);
};

const dispatchLoadedEvent = (eventName: "mainHeaderLoaded" | "mainFooterLoaded") => {
  document.dispatchEvent(new Event(eventName));
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

export const mountMainShell = async () => {
  const basePath = getAppRoot();

  renderComponent("main-header-placeholder", <MainHeaderTemplate basePath={basePath} />, async () => {
    initHeader();
    ensureLucideIcons();
    dispatchLoadedEvent("mainHeaderLoaded");
  });

  renderComponent("main-footer-placeholder", <MainFooterTemplate />, async () => {
    initFooter();
    ensureLucideIcons();
    dispatchLoadedEvent("mainFooterLoaded");
  });
};

export const mountHotelShell = async () => {
  const basePath = getAppRoot();

  renderComponent("hotel-header-placeholder", <HotelHeaderTemplate basePath={basePath} />, async () => {
    initHeader();
    ensureLucideIcons();
    dispatchLoadedEvent("mainHeaderLoaded");
  });

  renderComponent("hotel-footer-placeholder", <MainFooterTemplate />, async () => {
    initFooter();
    ensureLucideIcons();
    dispatchLoadedEvent("mainFooterLoaded");
  });
};
