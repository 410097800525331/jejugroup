import type { AuthState, FeedbackState, VerifiedIdentity } from "@front-components/auth/state/types";

const createFeedback = (): FeedbackState => ({
  message: "",
  tone: "idle",
});

const createIdentity = (): VerifiedIdentity => ({
  authMethod: "",
  birthDate: "",
  gender: "",
  isVerified: false,
  name: "",
  phone: "",
  provider: "",
  rrnBackFirstDigit: "",
  telecom: "",
});

export const createAuthInitialState = (savedLoginId = ""): AuthState => ({
  errors: {
    global: "",
    login: "",
    passAuth: "",
    signup: "",
  },
  login: {
    loginId: savedLoginId,
    password: "",
    rememberId: savedLoginId.length > 0,
    submitting: false,
  },
  passAuth: {
    authMethod: "",
    birthSix: "",
    name: "",
    phone: "",
    recaptchaSiteKey: "",
    recaptchaStatus: "idle",
    recaptchaToken: "",
    rrnDigit: "",
    step: 1,
    submitting: false,
    telecom: "",
  },
  signup: {
    account: {
      email: "",
      idCheckedValue: "",
      idFeedback: createFeedback(),
      idCheckStatus: "idle",
      password: "",
      passwordConfirm: "",
      passwordConfirmFeedback: createFeedback(),
      passwordFeedback: createFeedback(),
      passwordStrength: "hidden",
      submitting: false,
      userId: "",
    },
    completedName: "",
    identity: createIdentity(),
    step: 1,
    terms: {
      marketing: false,
      privacy: false,
      service: false,
    },
  },
  status: "idle",
});
