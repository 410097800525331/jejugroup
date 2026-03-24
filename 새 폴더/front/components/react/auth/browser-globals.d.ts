interface KakaoAccountPayload {
  gender?: string;
  name?: string;
  phone_number?: string;
}

interface KakaoUserResponse {
  kakao_account?: KakaoAccountPayload;
  properties?: {
    nickname?: string;
  };
}

interface KakaoGlobal {
  API: {
    request: (config: {
      fail: (error: unknown) => void;
      success: (response: KakaoUserResponse) => void;
      url: string;
    }) => void;
  };
  Auth: {
    login: (config: {
      fail: (error: unknown) => void;
      success: () => void;
    }) => void;
  };
  init: (appKey: string) => void;
  isInitialized: () => boolean;
}

interface NaverUserPayload {
  getGender: () => string;
  getMobile: () => string;
  getName: () => string;
}

interface NaverLoginInstance {
  authorize: () => void;
  getLoginStatus: (callback: (status: boolean) => void) => void;
  init: () => void;
  user: NaverUserPayload;
}

interface NaverLoginConstructor {
  new (config: Record<string, unknown>): NaverLoginInstance;
}

interface GrecaptchaGlobal {
  render: (
    container: string | Element,
    config: {
      callback: (token: string) => void;
      sitekey: string;
    },
  ) => number;
  reset: (widgetId?: number) => void;
}

declare global {
  const Kakao: KakaoGlobal;
  const naver: {
    LoginWithNaverId: NaverLoginConstructor;
  };

  interface Window {
    grecaptcha?: GrecaptchaGlobal;
  }
}

export {};
