type SignupTermItem = {
  description: string;
  key: "marketing" | "privacy" | "service";
  label: string;
  required: boolean;
};

export const SIGNUP_STEP_ITEMS = Object.freeze([
  { iconClassName: "fa-solid fa-plane", label: "약관동의" },
  { label: "본인인증" },
  { label: "정보입력" },
  { label: "가입완료" },
]);

export const SIGNUP_TERM_ITEMS = [
  {
    description: "",
    key: "service",
    label: "[필수] 이용약관 동의",
    required: true,
  },
  {
    description: "",
    key: "privacy",
    label: "[필수] 개인정보 수집 및 이용 동의",
    required: true,
  },
  {
    description:
      "* 마케팅 정보 수신에 동의하면 특가 및 이벤트 정보를 받을 수 있고 미동의여도 서비스 이용은 가능한 상태",
    key: "marketing",
    label: "[선택] 마케팅 정보 수신 동의",
    required: false,
  },
] as const satisfies ReadonlyArray<SignupTermItem>;
