import type { FeedbackState, PasswordStrength } from "@front-components/auth/state/types";

const BASE_PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]{8,}$/;
const SPECIAL_CHARACTER_PATTERN = /[!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]/;

interface PasswordMeta {
  feedback: FeedbackState;
  isValid: boolean;
  strength: PasswordStrength;
}

export const getPasswordMeta = (password: string): PasswordMeta => {
  if (!password) {
    return {
      feedback: {
        message: "",
        tone: "idle",
      },
      isValid: false,
      strength: "hidden",
    };
  }

  if (!BASE_PASSWORD_PATTERN.test(password)) {
    return {
      feedback: {
        message: "영문과 숫자를 포함한 8자 이상 필요함",
        tone: "error",
      },
      isValid: false,
      strength: "weak",
    };
  }

  if (SPECIAL_CHARACTER_PATTERN.test(password)) {
    return {
      feedback: {
        message: "사용 가능한 안전한 비밀번호 상태",
        tone: "success",
      },
      isValid: true,
      strength: "strong",
    };
  }

  return {
    feedback: {
      message: "사용 가능한 비밀번호 상태",
      tone: "warning",
    },
    isValid: true,
    strength: "medium",
  };
};

export const getPasswordConfirmFeedback = (
  password: string,
  passwordConfirm: string,
): {
  feedback: FeedbackState;
  isMatch: boolean;
} => {
  if (!passwordConfirm) {
    return {
      feedback: {
        message: "",
        tone: "idle",
      },
      isMatch: false,
    };
  }

  if (password === passwordConfirm) {
    return {
      feedback: {
        message: "비밀번호가 일치하는 상태",
        tone: "success",
      },
      isMatch: true,
    };
  }

  return {
    feedback: {
      message: "비밀번호가 일치하지 않는 상태",
      tone: "error",
    },
    isMatch: false,
  };
};
