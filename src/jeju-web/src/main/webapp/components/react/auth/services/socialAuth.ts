import { formatPhoneNumber } from "@front-components/auth/utils/format";
// @ts-ignore 레거시 JS 모듈 타이핑 부재 허용
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

const SOCIAL_CONFIG_DEFAULTS: SocialConfig = Object.freeze({
  KAKAO_JS_KEY: "",
  NAVER_CLIENT_ID: "",
});

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
    return { message: "카카오 SDK 로드 실패 상태", ok: false };
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
            message: "카카오 로그인 연동 실패 상태",
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
      message: "네이버 SDK 로드 실패 상태",
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
