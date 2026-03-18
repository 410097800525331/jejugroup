interface SignupRequestPayload {
  birthDate: string;
  email: string;
  gender: string;
  id: string;
  name: string;
  phone: string;
  provider: string;
  pw: string;
  rrnBackFirstDigit: string;
}

interface AvailabilityResult {
  available: boolean;
  message: string;
}

const loadSignupModules = async () => {
  // @ts-expect-error 레거시 JS 모듈 로딩 목적
  const sanitizerModule = import("../../../../core/modules/utils/sanitizer.module.js");
  // @ts-expect-error 레거시 JS 모듈 로딩 목적
  const configModule = import("../../../../core/modules/config/api_config.module.js");

  return Promise.all([sanitizerModule, configModule]);
};

export const checkSignupIdAvailability = async (userId: string): Promise<AvailabilityResult> => {
  const [{ sanitizeHTML }, { API_BASE_URL }] = await loadSignupModules();
  const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
    body: new URLSearchParams({
      action: "checkId",
      id: sanitizeHTML(userId.trim()),
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.success === false) {
    return {
      available: false,
      message: typeof payload.message === "string" && payload.message ? payload.message : "이미 사용 중인 아이디 상태",
    };
  }

  return {
    available: true,
    message: typeof payload.message === "string" && payload.message ? payload.message : "사용 가능한 아이디 상태",
  };
};

export const submitSignupRequest = async (payload: SignupRequestPayload) => {
  const [{ sanitizeHTML }, { API_BASE_URL }] = await loadSignupModules();
  const params = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, sanitizeHTML(value));
  });

  const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const responseBody = await response.json().catch(() => ({}));

  if (!response.ok || responseBody.success === false) {
    const message =
      typeof responseBody.message === "string" && responseBody.message
        ? responseBody.message
        : `회원가입 처리 실패 상태 (${response.status})`;
    throw new Error(message);
  }

  return responseBody;
};
