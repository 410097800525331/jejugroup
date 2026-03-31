import { getFallbackHomeUrl, safeNavigate } from "@runtime/utils/navigation";
import { resolveRoute } from "@front-core-utils/path_resolver.js";
import { initRouterBinder } from "@front-core-utils/router_binder.js";

const parseRouteParams = (element: Element) => {
  const raw = element.getAttribute("data-route-params");
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch (_error) {
    return {};
  }
};

const redirectByRoute = async (element: Element) => {
  const routeKey = element.getAttribute("data-route");
  if (!routeKey) {
    return;
  }

  try {
    const targetUrl = resolveRoute(routeKey, parseRouteParams(element));
    safeNavigate(targetUrl, "shell-runtime-fallback");
  } catch (_error) {
    safeNavigate(getFallbackHomeUrl(), "shell-runtime-fallback-home");
  }
};

let binderInitialized = false;

export const ensureRouteBinder = async () => {
  if (binderInitialized) {
    return;
  }

  binderInitialized = true;

  try {
    initRouterBinder();
    return;
  } catch (error) {
    console.warn("[ShellRuntime] router binder load failed", error);
  }

  document.body.addEventListener("click", async (event) => {
    const routeElement = (event.target as HTMLElement | null)?.closest("[data-route]");
    if (!routeElement) {
      return;
    }

    event.preventDefault();
    await redirectByRoute(routeElement);
  });
};
