import type { AuthAction, AuthState } from "@front-components/auth/state/types";

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_STATUS":
      return {
        ...state,
        status: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.scope]: action.payload.message,
        },
      };
    case "RESET_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: "",
        },
      };
    case "PATCH_LOGIN":
      return {
        ...state,
        login: {
          ...state.login,
          ...action.payload,
        },
      };
    case "SET_SIGNUP_STEP":
      return {
        ...state,
        signup: {
          ...state.signup,
          step: action.payload,
        },
      };
    case "PATCH_SIGNUP_TERMS":
      return {
        ...state,
        signup: {
          ...state.signup,
          terms: {
            ...state.signup.terms,
            ...action.payload,
          },
        },
      };
    case "PATCH_SIGNUP_ACCOUNT":
      return {
        ...state,
        signup: {
          ...state.signup,
          account: {
            ...state.signup.account,
            ...action.payload,
          },
        },
      };
    case "PATCH_SIGNUP_IDENTITY":
      return {
        ...state,
        signup: {
          ...state.signup,
          identity: {
            ...state.signup.identity,
            ...action.payload,
          },
        },
      };
    case "COMPLETE_SIGNUP":
      return {
        ...state,
        signup: {
          ...state.signup,
          completedName: action.payload.completedName,
          step: 4,
        },
      };
    case "PATCH_PASS_AUTH":
      return {
        ...state,
        passAuth: {
          ...state.passAuth,
          ...action.payload,
        },
      };
    case "SET_PASS_AUTH_STEP":
      return {
        ...state,
        passAuth: {
          ...state.passAuth,
          step: action.payload,
        },
      };
    default:
      return state;
  }
};
