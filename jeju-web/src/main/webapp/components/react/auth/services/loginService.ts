// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
import { hasAdminAccess, isLocalFrontEnvironment } from "../../../../core/modules/auth/local_admin.module.js";
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

const LOCAL_TEST_LOGIN_ID = "test";
const LOCAL_TEST_PASSWORD = "1234";
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

const createLocalTestSession = (loginId: string) =>
  Object.freeze({
    id: "local-test-user",
    loginId,
    name: "테스트 사용자",
    email: "test@local.jejugroup",
    role: "USER",
    roles: ["USER"],
    authSource: "LOCAL_LOGIN_OVERRIDE",
    isLocalTestAccount: true,
  });

export const loginWithCredentials = async (loginId: string, password: string) => {
  if (!validateParam(loginId) || !validateParam(password)) {
    throw new Error("잘못된 입력 형식이 포함된 상태");
  }

  // 로컬 개발 서버에서만 테스트 계정을 우회 허용한다.
  if (isLocalFrontEnvironment() && loginId === LOCAL_TEST_LOGIN_ID && password === LOCAL_TEST_PASSWORD) {
    return saveSession(createLocalTestSession(loginId));
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
