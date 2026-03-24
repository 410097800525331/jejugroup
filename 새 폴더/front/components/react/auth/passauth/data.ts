type PassMethodItem = {
  description: string;
  title: string;
  value: "PASS" | "SMS";
};

export const PASS_AUTH_STEP_ITEMS = Object.freeze([
  { iconClassName: "fa-solid fa-signal", label: "통신사" },
  { label: "인증수단" },
  { label: "이름" },
  { label: "입력" },
  { label: "확인" },
]);

export const TELECOM_OPTIONS = Object.freeze([
  { label: "SKT", value: "SKT" },
  { label: "KT", value: "KT" },
  { label: "LG U+", value: "LG U+" },
  { isMuted: true, label: "SKT\n알뜰폰", value: "SKT 알뜰폰" },
  { isMuted: true, label: "KT\n알뜰폰", value: "KT 알뜰폰" },
  { isMuted: true, label: "LG U+\n알뜰폰", value: "LG U+ 알뜰폰" },
]);

export const PASS_METHOD_OPTIONS = [
  {
    description: "더 빠르고 간편하게 인증 가능 상태",
    title: "PASS 인증",
    value: "PASS",
  },
  {
    description: "SMS 인증번호로 본인확인 진행 상태",
    title: "문자(SMS) 인증",
    value: "SMS",
  },
] as const satisfies ReadonlyArray<PassMethodItem>;
