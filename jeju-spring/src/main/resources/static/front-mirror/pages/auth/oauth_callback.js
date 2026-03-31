import { saveSession } from "../../core/modules/auth/session_manager.module.js";
import { hasAdminAccess } from "../../core/modules/auth/local_admin.module.js";
import { API_BASE_URL } from "../../core/modules/config/api_config.module.js";
import { ROUTES } from "../../core/modules/constants/routes.module.js";
import { resolveRoute } from "../../core/modules/utils/path_resolver.module.js";

const CALLBACK_URL = new URL("/pages/auth/oauth_callback.html", window.location.origin).href;
const LOGIN_URL = "/pages/auth/login.html";

const titleEl = document.getElementById("oauthCallbackTitle");
const messageEl = document.getElementById("oauthCallbackMessage");
const linkEl = document.getElementById("oauthCallbackLink");

const setMessage = (title, message) => {
  if (titleEl) {
    titleEl.textContent = title;
  }

  if (messageEl) {
    messageEl.textContent = message;
  }
};

const resolveSafeRedirectUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") {
    return null;
  }

  if (rawUrl.startsWith("javascript:") || rawUrl.startsWith("data:")) {
    return null;
  }

  try {
    const parsedUrl = new URL(rawUrl, window.location.href);
    if (parsedUrl.origin !== window.location.origin) {
      return null;
    }

    if (parsedUrl.pathname.includes("/pages/auth/")) {
      return null;
    }

    return parsedUrl.toString();
  } catch (_error) {
    return null;
  }
};

const resolveSessionPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const root = payload;
  const data = root.data && typeof root.data === "object" ? root.data : null;

  return root.user || root.session || root.result || data?.user || data?.session || data?.result || data || null;
};

const resolveRedirectCandidate = (payload) => {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const root = payload;
  const data = root.data && typeof root.data === "object" ? root.data : null;
  return root.redirectUrl || root.next || root.returnUrl || data?.redirectUrl || data?.next || data?.returnUrl || "";
};

const extractAuthorizationError = (payload) => {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const message = payload.message;
  if (typeof message === "string" && message.trim()) {
    return message.trim();
  }

  return "";
};

const postForm = async (endpoint, payload) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    body: new URLSearchParams(payload),
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const body = await response.json().catch(() => ({}));
  return { body, response };
};

const completeNaverLogin = async (code, state) => {
  const endpoints = ["/api/auth/naver/complete", "/api/auth/naver/callback"];
  let fallbackMessage = "네이버 로그인 처리 실패 상태";

  for (const endpoint of endpoints) {
    const { body, response } = await postForm(endpoint, {
      callbackUrl: CALLBACK_URL,
      code,
      provider: "NAVER",
      state,
    });

    if (response.status === 404 || response.status === 405) {
      fallbackMessage = extractAuthorizationError(body) || fallbackMessage;
      continue;
    }

    if (!response.ok || body.success === false) {
      throw new Error(extractAuthorizationError(body) || fallbackMessage);
    }

    return body;
  }

  throw new Error(fallbackMessage);
};

const navigateAfterCallback = (sessionData, payload) => {
  const redirectUrl = resolveSafeRedirectUrl(resolveRedirectCandidate(payload));
  if (redirectUrl) {
    window.location.replace(redirectUrl);
    return;
  }

  const routeKey = hasAdminAccess(sessionData) ? "ADMIN.DASHBOARD" : "HOME";

  try {
    const targetUrl = resolveRoute(routeKey);
    if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
      window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetUrl, "naver-login-success");
      return;
    }
    window.location.replace(targetUrl);
  } catch (_error) {
    window.location.replace(routeKey === "ADMIN.DASHBOARD" ? ROUTES.ADMIN.DASHBOARD : ROUTES.HOME);
  }
};

const run = async () => {
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  const code = params.get("code");
  const state = params.get("state") || "";

  if (error) {
    setMessage("네이버 로그인을 완료하지 못했어요", "다시 로그인해 주세요.");
    return;
  }

  if (!code) {
    setMessage("네이버 로그인 정보가 없습니다", "로그인 페이지에서 다시 시도해 주세요.");
    return;
  }

  try {
    setMessage("네이버 로그인 확인 중", "잠시만 기다려 주세요.");
    const payload = await completeNaverLogin(code, state);
    const sessionData = resolveSessionPayload(payload);

    if (!sessionData) {
      throw new Error("세션 정보 누락 상태");
    }

    saveSession(sessionData);
    setMessage("로그인 완료", "이동 중입니다.");
    navigateAfterCallback(sessionData, payload);
  } catch (_error) {
    setMessage("네이버 로그인을 완료하지 못했어요", "로그인 페이지에서 다시 시도해 주세요.");
    if (linkEl) {
      linkEl.href = LOGIN_URL;
    }
  }
};

void run();
