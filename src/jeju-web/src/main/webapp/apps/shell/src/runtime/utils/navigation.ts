import { getAppRoot } from "@runtime/utils/appRoot";

export const safeNavigate = (targetUrl: string, reason = "shell-runtime") => {
  if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
    window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetUrl, reason);
    return;
  }

  window.location.assign(targetUrl);
};

export const getFallbackHomeUrl = () => {
  if (window.__JEJU_ROUTE_NAVIGATOR__?.homeUrl) {
    return window.__JEJU_ROUTE_NAVIGATOR__.homeUrl;
  }

  return new URL("index.html", getAppRoot()).href;
};
