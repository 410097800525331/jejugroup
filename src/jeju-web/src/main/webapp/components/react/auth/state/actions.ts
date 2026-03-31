import type { Dispatch } from "react";
import type {
  AuthAction,
  AuthErrorScope,
  AuthState,
  AuthStatus,
  LoginState,
  PassAuthState,
  SignupAccountState,
  SignupStep,
  SignupTermsState,
  VerifiedIdentity,
} from "@front-components/auth/state/types";

export interface AuthActions {
  completeSignup: (completedName: string) => void;
  patchLogin: (payload: Partial<LoginState>) => void;
  patchPassAuth: (payload: Partial<PassAuthState>) => void;
  patchSignupAccount: (payload: Partial<SignupAccountState>) => void;
  patchSignupIdentity: (payload: Partial<VerifiedIdentity>) => void;
  patchSignupTerms: (payload: Partial<SignupTermsState>) => void;
  resetError: (scope: AuthErrorScope) => void;
  setError: (scope: AuthErrorScope, message: string) => void;
  setPassAuthStep: (step: PassAuthState["step"]) => void;
  setSignupStep: (step: SignupStep) => void;
  setStatus: (status: AuthStatus) => void;
}

export const createAuthActions = (dispatch: Dispatch<AuthAction>): AuthActions => ({
  completeSignup: (completedName) => {
    dispatch({
      payload: { completedName },
      type: "COMPLETE_SIGNUP",
    });
  },
  patchLogin: (payload) => {
    dispatch({
      payload,
      type: "PATCH_LOGIN",
    });
  },
  patchPassAuth: (payload) => {
    dispatch({
      payload,
      type: "PATCH_PASS_AUTH",
    });
  },
  patchSignupAccount: (payload) => {
    dispatch({
      payload,
      type: "PATCH_SIGNUP_ACCOUNT",
    });
  },
  patchSignupIdentity: (payload) => {
    dispatch({
      payload,
      type: "PATCH_SIGNUP_IDENTITY",
    });
  },
  patchSignupTerms: (payload) => {
    dispatch({
      payload,
      type: "PATCH_SIGNUP_TERMS",
    });
  },
  resetError: (scope) => {
    dispatch({
      payload: scope,
      type: "RESET_ERROR",
    });
  },
  setError: (scope, message) => {
    dispatch({
      payload: { message, scope },
      type: "SET_ERROR",
    });
  },
  setPassAuthStep: (step) => {
    dispatch({
      payload: step,
      type: "SET_PASS_AUTH_STEP",
    });
  },
  setSignupStep: (step) => {
    dispatch({
      payload: step,
      type: "SET_SIGNUP_STEP",
    });
  },
  setStatus: (status) => {
    dispatch({
      payload: status,
      type: "SET_STATUS",
    });
  },
});
