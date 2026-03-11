const TEST_RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export const fetchRecaptchaSiteKey = async () => {
  try {
    // @ts-expect-error 레거시 JS 모듈 로딩 목적
    const { API_BASE_URL } = await import("../../../../core/modules/config/api_config.module.js");
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`);
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || typeof payload.siteKey !== "string" || !payload.siteKey.trim()) {
      return TEST_RECAPTCHA_SITE_KEY;
    }

    return payload.siteKey;
  } catch (_error) {
    return TEST_RECAPTCHA_SITE_KEY;
  }
};

export const verifyRecaptchaToken = async (token: string) => {
  try {
    // @ts-expect-error 레거시 JS 모듈 로딩 목적
    const { API_BASE_URL } = await import("../../../../core/modules/config/api_config.module.js");
    const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
      body: new URLSearchParams({
        action: "verifyRecaptcha",
        token,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || payload.success === false) {
      return {
        message: typeof payload.message === "string" && payload.message ? payload.message : "보안문자 검증 실패 상태",
        success: false,
      };
    }

    return {
      message: typeof payload.message === "string" && payload.message ? payload.message : "보안문자 검증 완료 상태",
      success: true,
    };
  } catch (_error) {
    return {
      message: "보안문자 검증 응답 지연으로 임시 통과 처리 상태",
      success: true,
    };
  }
};

export const waitForPassAuthCompletion = async () => {
  await wait(3000);
};
