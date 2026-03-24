export type AsyncStatus = "idle" | "loading" | "success" | "error";

export type AuthStatus = "idle" | "verifying" | "verified" | "submitting" | "success" | "error";

export type FeedbackTone = "idle" | "info" | "success" | "warning" | "error";

export type PasswordStrength = "hidden" | "weak" | "medium" | "strong";

export type SignupStep = 1 | 2 | 3 | 4;

export type PassAuthStep = 1 | 2 | 3 | 4 | 5;

export type AuthProvider = "" | "PASS" | "KAKAO" | "NAVER";

export type PassAuthMethod = "" | "PASS" | "SMS";

export interface FeedbackState {
  message: string;
  tone: FeedbackTone;
}

export interface AuthErrors {
  global: string;
  login: string;
  signup: string;
  passAuth: string;
}

export interface VerifiedIdentity {
  authMethod: PassAuthMethod;
  birthDate: string;
  gender: string;
  isVerified: boolean;
  name: string;
  phone: string;
  provider: AuthProvider;
  rrnBackFirstDigit: string;
  telecom: string;
}

export interface LoginState {
  loginId: string;
  password: string;
  rememberId: boolean;
  submitting: boolean;
}

export interface SignupTermsState {
  marketing: boolean;
  privacy: boolean;
  service: boolean;
}

export interface SignupAccountState {
  email: string;
  idCheckedValue: string;
  idFeedback: FeedbackState;
  idCheckStatus: AsyncStatus;
  password: string;
  passwordConfirm: string;
  passwordConfirmFeedback: FeedbackState;
  passwordFeedback: FeedbackState;
  passwordStrength: PasswordStrength;
  submitting: boolean;
  userId: string;
}

export interface SignupState {
  account: SignupAccountState;
  completedName: string;
  identity: VerifiedIdentity;
  step: SignupStep;
  terms: SignupTermsState;
}

export interface PassAuthState {
  authMethod: PassAuthMethod;
  birthSix: string;
  name: string;
  phone: string;
  recaptchaSiteKey: string;
  recaptchaStatus: AsyncStatus;
  recaptchaToken: string;
  rrnDigit: string;
  step: PassAuthStep;
  submitting: boolean;
  telecom: string;
}

export interface AuthState {
  errors: AuthErrors;
  login: LoginState;
  passAuth: PassAuthState;
  signup: SignupState;
  status: AuthStatus;
}

export type AuthErrorScope = keyof AuthErrors;

export type AuthAction =
  | { type: "SET_STATUS"; payload: AuthStatus }
  | { type: "SET_ERROR"; payload: { message: string; scope: AuthErrorScope } }
  | { type: "RESET_ERROR"; payload: AuthErrorScope }
  | { type: "PATCH_LOGIN"; payload: Partial<LoginState> }
  | { type: "SET_SIGNUP_STEP"; payload: SignupStep }
  | { type: "PATCH_SIGNUP_TERMS"; payload: Partial<SignupTermsState> }
  | { type: "PATCH_SIGNUP_ACCOUNT"; payload: Partial<SignupAccountState> }
  | { type: "PATCH_SIGNUP_IDENTITY"; payload: Partial<VerifiedIdentity> }
  | { type: "COMPLETE_SIGNUP"; payload: { completedName: string } }
  | { type: "PATCH_PASS_AUTH"; payload: Partial<PassAuthState> }
  | { type: "SET_PASS_AUTH_STEP"; payload: PassAuthStep };
