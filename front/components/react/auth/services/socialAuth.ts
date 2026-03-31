import { formatPhoneNumber } from "@front-components/auth/utils/format";
// @ts-ignore 레거시 JS 모듈 호환
import { API_BASE_URL } from "../../../../core/modules/config/api_config.module.js";

interface SocialConfig {
  KAKAO_JS_KEY: string;
  NAVER_CLIENT_ID: string;
}

export interface SocialAuthResult {
  data?: {
    gender: string;
    name: string;
    phone: string;
    provider: "KAKAO" | "NAVER";
  };
  message?: string;
  pending?: boolean;
  success: boolean;
}

export interface NaverLoginStartResult {
  authorizationUrl?: string;
  message?: string;
  success: boolean;
}

export interface NaverLoginCompleteResult {
  message?: string;
  session?: Record<string, unknown>;
  success: boolean;
}

const SOCIAL_CONFIG_DEFAULTS: SocialConfig = Object.freeze({
  KAKAO_JS_KEY: "",
  NAVER_CLIENT_ID: "",
});

const NAVER_LOGIN_CALLBACK_PATH = "/pages/auth/oauth_callback.html";
const NAVER_LOGIN_START_ENDPOINTS = ["/api/auth/naver/start", "/api/auth/naver/init"];
const NAVER_LOGIN_COMPLETE_ENDPOINTS = ["/api/auth/naver/complete", "/api/auth/naver/callback"];

let cachedSocialConfig: SocialConfig | null = null;

const normalizeSocialConfig = (payload: unknown): SocialConfig => {
  const social = payload && typeof payload === "object" ? (payload as { social?: Record<string, unknown> }).social ?? {} : {};

  return {
    KAKAO_JS_KEY: String(social.kakaoJsKey ?? "").trim(),
    NAVER_CLIENT_ID: String(social.naverClientId ?? "").trim(),
  };
};

const fetchSocialConfig = async () => {
  if (cachedSocialConfig) {
    return { ...cachedSocialConfig };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/public/config`, {
      credentials: "same-origin",
      method: "GET",
    });

    if (!response.ok) {
      cachedSocialConfig = { ...SOCIAL_CONFIG_DEFAULTS };
      return { ...cachedSocialConfig };
    }

    const payload = await response.json().catch(() => ({}));
    cachedSocialConfig = {
      ...SOCIAL_CONFIG_DEFAULTS,
      ...normalizeSocialConfig(payload),
    };
  } catch (_error) {
    cachedSocialConfig = { ...SOCIAL_CONFIG_DEFAULTS };
  }

  return { ...cachedSocialConfig };
};

const ensureKakaoSdkReady = async () => {
  if (typeof Kakao === "undefined") {
    return { message: "카카오 SDK 로딩 실패 상태", ok: false };
  }

  const socialConfig = await fetchSocialConfig();
  if (!socialConfig.KAKAO_JS_KEY) {
    return { message: "카카오 JavaScript 키 누락 상태", ok: false };
  }

  if (!Kakao.isInitialized()) {
    Kakao.init(socialConfig.KAKAO_JS_KEY);
  }

  return { message: "", ok: true };
};

const resolveNaverCallbackUrl = () => new URL(window.location.pathname, window.location.origin).href;

const resolveNaverLoginCallbackUrl = () => new URL(NAVER_LOGIN_CALLBACK_PATH, window.location.origin).href;

const readBackendMessage = (payload: unknown, fallbackMessage: string) => {
  if (payload && typeof payload === "object") {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  return fallbackMessage;
};

const readAuthorizationUrl = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const rootPayload = payload as Record<string, unknown>;
  const dataPayload = rootPayload.data && typeof rootPayload.data === "object" ? (rootPayload.data as Record<string, unknown>) : null;
  const candidates = [
    rootPayload.authorizationUrl,
    rootPayload.authUrl,
    rootPayload.redirectUrl,
    rootPayload.url,
    dataPayload?.authorizationUrl,
    dataPayload?.authUrl,
    dataPayload?.redirectUrl,
    dataPayload?.url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return "";
};

const readSessionPayload = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const rootPayload = payload as Record<string, unknown>;
  const dataPayload = rootPayload.data && typeof rootPayload.data === "object" ? (rootPayload.data as Record<string, unknown>) : null;
  const candidates = [
    rootPayload.user,
    rootPayload.session,
    rootPayload.result,
    dataPayload?.user,
    dataPayload?.session,
    dataPayload?.result,
    dataPayload,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      return candidate as Record<string, unknown>;
    }
  }

  return null;
};

const postForm = async (endpoint: string, payload: Record<string, string>) => {
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

const requestNaverLoginEndpoint = async (endpoints: string[], payload: Record<string, string>) => {
  let fallbackMessage = "네이버 로그인 처리 실패 상태";

  for (const endpoint of endpoints) {
    const { body, response } = await postForm(endpoint, payload);

    if (response.status === 404 || response.status === 405) {
      fallbackMessage = readBackendMessage(body, fallbackMessage);
      continue;
    }

    return { body, response };
  }

  throw new Error(fallbackMessage);
};

export const startNaverLogin = async (): Promise<NaverLoginStartResult> => {
  try {
    const { body, response } = await requestNaverLoginEndpoint(NAVER_LOGIN_START_ENDPOINTS, {
      callbackUrl: resolveNaverLoginCallbackUrl(),
      flow: "login",
      provider: "NAVER",
    });

    if (!response.ok || body.success === false) {
      return {
        message: "네이버 로그인 준비 실패 상태",
        success: false,
      };
    }

    const authorizationUrl = readAuthorizationUrl(body);
    if (!authorizationUrl) {
      return {
        message: "네이버 로그인 주소를 불러오지 못한 상태",
        success: false,
      };
    }

    return {
      authorizationUrl,
      success: true,
    };
  } catch (_error) {
    return {
      message: "네이버 로그인 준비 실패 상태",
      success: false,
    };
  }
};

export const completeNaverLogin = async (code: string, state: string): Promise<NaverLoginCompleteResult> => {
  try {
    const { body, response } = await requestNaverLoginEndpoint(NAVER_LOGIN_COMPLETE_ENDPOINTS, {
      callbackUrl: resolveNaverLoginCallbackUrl(),
      code,
      provider: "NAVER",
      state,
    });

    if (!response.ok || body.success === false) {
      return {
        message: "네이버 로그인 처리 실패 상태",
        success: false,
      };
    }

    const session = readSessionPayload(body);

    return {
      session: session ?? undefined,
      success: true,
    };
  } catch (_error) {
    return {
      message: "네이버 로그인 처리 실패 상태",
      success: false,
    };
  }
};

export const triggerSocialAuth = async (provider: "kakao" | "naver"): Promise<SocialAuthResult> => {
  if (provider === "kakao") {
    const sdkReady = await ensureKakaoSdkReady();
    if (!sdkReady.ok) {
      return {
        message: sdkReady.message,
        success: false,
      };
    }

    return new Promise((resolve) => {
      Kakao.Auth.login({
        fail: () => {
          resolve({
            message: "카카오 로그인 시작 실패 상태",
            success: false,
          });
        },
        success: () => {
          Kakao.API.request({
            fail: () => {
              resolve({
                message: "카카오 사용자 정보 조회 실패 상태",
                success: false,
              });
            },
            success: (response) => {
              const account = response.kakao_account ?? {};
              resolve({
                data: {
                  gender: account.gender === "male" ? "M" : "F",
                  name: account.name || response.properties?.nickname || "회원",
                  phone: formatPhoneNumber(account.phone_number || "01000000000"),
                  provider: "KAKAO",
                },
                success: true,
              });
            },
            url: "/v2/user/me",
          });
        },
      });
    });
  }

  const socialConfig = await fetchSocialConfig();
  if (typeof naver === "undefined" || typeof naver.LoginWithNaverId === "undefined") {
    return {
      message: "네이버 SDK 로딩 실패 상태",
      success: false,
    };
  }

  if (!socialConfig.NAVER_CLIENT_ID) {
    return {
      message: "네이버 Client ID 누락 상태",
      success: false,
    };
  }

  return new Promise((resolve) => {
    const containerId = "naverIdLogin";
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement("div");
      container.id = containerId;
      container.style.display = "none";
      document.body.appendChild(container);
    }

    try {
      const naverLogin = new naver.LoginWithNaverId({
        callbackUrl: resolveNaverCallbackUrl(),
        clientId: socialConfig.NAVER_CLIENT_ID,
        isPopup: true,
        loginButton: { color: "green", height: 60, type: 3 },
      });

      naverLogin.init();
      naverLogin.getLoginStatus((status) => {
        if (status) {
          resolve({
            data: {
              gender: naverLogin.user.getGender() === "M" ? "M" : "F",
              name: naverLogin.user.getName() || "회원",
              phone: formatPhoneNumber(naverLogin.user.getMobile() || "01000000000"),
              provider: "NAVER",
            },
            success: true,
          });
          return;
        }

        naverLogin.authorize();
        resolve({
          pending: true,
          success: false,
        });
      });
    } catch (_error) {
      resolve({
        message: "네이버 로그인 초기화 실패 상태",
        success: false,
      });
    }
  });
};
