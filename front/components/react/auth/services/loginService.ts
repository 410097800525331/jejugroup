// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { hasAdminAccess } from "../../../../core/modules/auth/local_admin.module.js";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { saveSession } from "../../../../core/modules/auth/session_manager.module.js";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { API_BASE_URL } from "../../../../core/modules/config/api_config.module.js";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { ROUTES } from "../../../../core/modules/constants/routes.module.js";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { resolveRoute } from "../../../../core/modules/utils/path_resolver.module.js";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { sanitizeHTML, validateParam } from "../../../../core/modules/utils/sanitizer.module.js";

export const loginWithCredentials = async (loginId: string, password: string) => {
  if (!validateParam(loginId) || !validateParam(password)) {
    throw new Error("잘못된 입력 형식이 포함된 상태");
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
    let message = "로그인에 실패한 상태";

    try {
      const payload = await response.json();
      message = typeof payload.message === "string" && payload.message ? payload.message : message;
    } catch (_error) {
      // 응답 메시지가 비정상이면 기본 문구 유지 목적
    }

    throw new Error(message);
  }

  const data = await response.json();
  return saveSession(data.user);
};

export const navigateAfterLogin = async (sessionData: Record<string, unknown>) => {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectUrl = urlParams.get("redirect");

  if (redirectUrl && !redirectUrl.startsWith("javascript:") && !redirectUrl.startsWith("data:")) {
    window.location.replace(redirectUrl);
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
