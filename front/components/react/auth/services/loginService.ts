// @ts-ignore JS 모듈 호환
import { hasAdminAccess } from "../../../../core/modules/auth/local_admin.module.js";
// @ts-ignore JS 모듈 호환
import { saveSession } from "../../../../core/modules/auth/session_manager.module.js";
// @ts-ignore JS 모듈 호환
import { API_BASE_URL } from "../../../../core/modules/config/api_config.module.js";
// @ts-ignore JS 모듈 호환
import { ROUTES } from "../../../../core/modules/constants/routes.module.js";
// @ts-ignore JS 모듈 호환
import { resolveRoute } from "../../../../core/modules/utils/path_resolver.module.js";
// @ts-ignore JS 모듈 호환
import { sanitizeHTML, validateParam } from "../../../../core/modules/utils/sanitizer.module.js";

const AUTH_PATH_SEGMENT = "/pages/auth/";

const resolveSafeLoginReturnUrl = (rawUrl: string | null) => {
  if (!rawUrl || typeof window === "undefined") {
    return null;
  }

  if (rawUrl.startsWith("javascript:") || rawUrl.startsWith("data:")) {
    return null;
  }

  try {
    const parsedUrl = new URL(rawUrl, window.location.href);
    const currentUrl = new URL(window.location.href);

    if (parsedUrl.origin !== currentUrl.origin) {
      return null;
    }

    if (parsedUrl.pathname.includes(AUTH_PATH_SEGMENT)) {
      return null;
    }

    if (parsedUrl.href === currentUrl.href) {
      return null;
    }

    return parsedUrl.toString();
  } catch (_error) {
    return null;
  }
};

export const loginWithCredentials = async (loginId: string, password: string) => {
  if (!validateParam(loginId) || !validateParam(password)) {
    throw new Error("\uB85C\uADF8\uC778 \uC785\uB825\uAC12 \uAC80\uC99D \uC2E4\uD328 \uC0C1\uD0DC");
  }

  const params = new URLSearchParams();
  params.append("id", sanitizeHTML(loginId));
  params.append("pw", sanitizeHTML(password));

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    body: params,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    let message = "\uB85C\uADF8\uC778 \uCC98\uB9AC \uC2E4\uD328 \uC0C1\uD0DC";

    try {
      const payload = await response.json();
      message = typeof payload.message === "string" && payload.message ? payload.message : message;
    } catch (_error) {
      // Keep the fallback message when the response body is malformed.
    }

    throw new Error(message);
  }

  const data = await response.json();
  return saveSession(data.user);
};

export const navigateAfterLogin = async (sessionData: Record<string, unknown>) => {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = resolveSafeLoginReturnUrl(urlParams.get("redirect"));
  const referrerUrl = resolveSafeLoginReturnUrl(document.referrer);

  if (redirectUrl) {
    window.location.replace(redirectUrl);
    return;
  }

  if (referrerUrl) {
    window.location.replace(referrerUrl);
    return;
  }

  const routeKey = hasAdminAccess(sessionData) ? "ADMIN.DASHBOARD" : "HOME";

  try {
    const targetUrl = resolveRoute(routeKey);
    if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
      window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetUrl, "login-success");
      return;
    }
    window.location.replace(targetUrl);
  } catch (_error) {
    window.location.replace(routeKey === "ADMIN.DASHBOARD" ? ROUTES.ADMIN.DASHBOARD : ROUTES.HOME);
  }
};
