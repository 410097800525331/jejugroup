import { mountAirHeader } from "@runtime/pages/airHeader";
interface PageShellHosts {
  footerHost: HTMLElement;
  headerHost: HTMLElement;
}

import { mountAirFooter } from "@runtime/pages/airFooter";

export const syncAirShellBase = (toAbsoluteUrl: (resourcePath: string) => string) => {
  let baseElement = document.getElementById("jeju-page-shell-base") as HTMLBaseElement | null;
  if (!baseElement) {
    baseElement = document.createElement("base");
    baseElement.id = "jeju-page-shell-base";
    document.head.prepend(baseElement);
  }

  baseElement.href = toAbsoluteUrl("jejuair/");
  document.body.classList.add("jejuair-main-content");
};

export const clearAirShellBase = () => {
  const baseElement = document.getElementById("jeju-page-shell-base");
  if (baseElement) {
    baseElement.remove();
  }

  document.body.classList.remove("jejuair-main-content");
};

export const mountAirPageShell = async (
  hosts: PageShellHosts,
  options: {
    loadStyle: (href: string) => void;
  },
) => {
  options.loadStyle("jejuair/css/main.css");
  hosts.headerHost.innerHTML = '<header id="header_wrap"></header>';
  hosts.footerHost.innerHTML = '<footer id="footer_wrap"></footer>';
  const headerRoot = hosts.headerHost.querySelector<HTMLElement>("#header_wrap");
  const footerRoot = hosts.footerHost.querySelector<HTMLElement>("#footer_wrap");
  if (headerRoot) {
    mountAirHeader(headerRoot);
  }
  if (footerRoot) {
    mountAirFooter(footerRoot);
  }
};
