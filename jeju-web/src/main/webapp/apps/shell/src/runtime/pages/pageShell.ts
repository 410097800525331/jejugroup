import { clearAirShellBase, mountAirPageShell, syncAirShellBase } from "@runtime/pages/airShell";
import { installLegacyGlobals } from "@runtime/globals";
import { mountHotelShell, mountMainShell } from "@runtime/layout/shellMount";
import { getAppRoot } from "@runtime/utils/appRoot";

const SHELL_QUERY_KEY = "shell";
const SHELL_STORAGE_KEY = "jeju:mypage-shell";
const SHELLS = new Set(["main", "stay", "air"]);
const AUTH_PATH_SEGMENT = "/pages/auth/";
const HEADER_HOST_IDS = ["jeju-page-shell-header", "mypage-shell-header"] as const;
const FOOTER_HOST_IDS = ["jeju-page-shell-footer", "mypage-shell-footer"] as const;

let mountedShell: string | null = null;

const getHeaderHost = () => {
  return HEADER_HOST_IDS.map((id) => document.getElementById(id)).find(Boolean) ?? null;
};

const getFooterHost = () => {
  return FOOTER_HOST_IDS.map((id) => document.getElementById(id)).find(Boolean) ?? null;
};

const getPageShellHosts = () => {
  return {
    footerHost: getFooterHost(),
    headerHost: getHeaderHost(),
  };
};

const toAbsoluteUrl = (resourcePath: string) => new URL(resourcePath, getAppRoot()).href;

const isAuthPage = () => window.location.pathname.toLowerCase().includes(AUTH_PATH_SEGMENT);

const normalizeShellForPage = (shell: string) => (shell === "stay" && isAuthPage() ? "main" : shell);

const loadStyle = (href: string) => {
  const absoluteHref = /^[a-z]+:/i.test(href) ? href : toAbsoluteUrl(href);
  const alreadyLoaded = Array.from(document.styleSheets).some((sheet) => sheet.href === absoluteHref);
  if (alreadyLoaded) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = absoluteHref;
  document.head.appendChild(link);
};

const setDocumentBase = (shell: string) => {
  if (shell === "air") {
    syncAirShellBase(toAbsoluteUrl);
    return;
  }

  clearAirShellBase();
};

const resolveShellFromReferrer = () => {
  if (!document.referrer) {
    return null;
  }

  try {
    const referrerUrl = new URL(document.referrer);
    const pathname = referrerUrl.pathname.toLowerCase();

    if (pathname.includes("/jejuair/")) {
      return "air";
    }

    if (pathname.includes("/jejustay/")) {
      return "stay";
    }

    if (pathname.endsWith("/index.html") || pathname === "/" || pathname.includes("/front/index.html")) {
      return "main";
    }
  } catch (_error) {
    return null;
  }

  return null;
};

const resolveShell = () => {
  const params = new URLSearchParams(window.location.search);
  const queryShell = params.get(SHELL_QUERY_KEY);
  if (queryShell && SHELLS.has(queryShell)) {
    return normalizeShellForPage(queryShell);
  }

  const referrerShell = resolveShellFromReferrer();
  if (referrerShell) {
    return normalizeShellForPage(referrerShell);
  }

  const storedShell = window.sessionStorage.getItem(SHELL_STORAGE_KEY);
  if (storedShell && SHELLS.has(storedShell)) {
    return normalizeShellForPage(storedShell);
  }

  return normalizeShellForPage("main");
};

const persistShell = (shell: string) => {
  window.sessionStorage.setItem(SHELL_STORAGE_KEY, shell);
  document.body.dataset.mypageShell = shell;
};

const dispatchShellEvents = () => {
  document.dispatchEvent(new Event("mainHeaderLoaded"));
  document.dispatchEvent(new Event("mainFooterLoaded"));
};

const mountReactMainShell = async () => {
  const { footerHost, headerHost } = getPageShellHosts();
  if (!headerHost || !footerHost) {
    return;
  }

  headerHost.innerHTML = '<div id="main-header-placeholder"></div>';
  footerHost.innerHTML = '<div id="main-footer-placeholder"></div>';
  await mountMainShell();
};

const mountReactStayShell = async () => {
  const { footerHost, headerHost } = getPageShellHosts();
  if (!headerHost || !footerHost) {
    return;
  }

  headerHost.innerHTML = '<div id="hotel-header-placeholder"></div>';
  footerHost.innerHTML = '<div id="hotel-footer-placeholder"></div>';
  await mountHotelShell();
};

const mountAirShell = async () => {
  const { footerHost, headerHost } = getPageShellHosts();
  if (!headerHost || !footerHost) {
    return;
  }

  await mountAirPageShell(
    {
      footerHost,
      headerHost,
    },
    {
      loadStyle,
    },
  );
};

export const hasPageShellHosts = () => {
  const { footerHost, headerHost } = getPageShellHosts();
  return Boolean(headerHost || footerHost);
};

export const mountPageShellRuntime = async () => {
  const { footerHost, headerHost } = getPageShellHosts();
  if (!headerHost || !footerHost) {
    return "main";
  }

  const shell = resolveShell();
  persistShell(shell);
  setDocumentBase(shell);
  installLegacyGlobals();

  if (mountedShell === shell && headerHost.childElementCount > 0 && footerHost.childElementCount > 0) {
    dispatchShellEvents();
    return shell;
  }

  if (shell === "air") {
    await mountAirShell();
    await new Promise((resolve) => window.setTimeout(resolve, 40));
  } else if (shell === "stay") {
    await mountReactStayShell();
  } else {
    await mountReactMainShell();
  }

  mountedShell = shell;
  dispatchShellEvents();
  return shell;
};
