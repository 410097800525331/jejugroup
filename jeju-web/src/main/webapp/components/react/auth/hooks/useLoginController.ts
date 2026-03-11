import { useCallback, useEffect, useMemo, type ChangeEventHandler, type FormEventHandler } from "react";
import { loginWithCredentials, navigateAfterLogin } from "@front-components/auth/services/loginService";
import { useAuthActions, useAuthState } from "@front-components/auth/state/context";

const SAVED_ID_KEY = "jeju:login-id";

export const getSavedLoginId = () => {
  try {
    return localStorage.getItem(SAVED_ID_KEY) ?? "";
  } catch (_error) {
    return "";
  }
};

export const useLoginController = () => {
  const { errors, login } = useAuthState();
  const actions = useAuthActions();

  const isDisabled = useMemo(() => {
    return login.submitting || login.loginId.trim().length === 0 || login.password.trim().length === 0;
  }, [login.loginId, login.password, login.submitting]);

  useEffect(() => {
    try {
      if (login.rememberId && login.loginId.trim()) {
        localStorage.setItem(SAVED_ID_KEY, login.loginId.trim());
        return;
      }

      localStorage.removeItem(SAVED_ID_KEY);
    } catch (_error) {
      // 저장 실패가 화면 흐름을 막지 않기 위한 목적
    }
  }, [login.loginId, login.rememberId]);

  const handleIdChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      actions.patchLogin({ loginId: event.target.value });
      actions.resetError("login");
    },
    [actions],
  );

  const handlePasswordChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      actions.patchLogin({ password: event.target.value });
      actions.resetError("login");
    },
    [actions],
  );

  const handleRememberChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      actions.patchLogin({ rememberId: event.target.checked });
    },
    [actions],
  );

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();

      const loginId = login.loginId.trim();
      const password = login.password.trim();

      try {
        actions.patchLogin({ submitting: true });
        actions.resetError("login");
        actions.setStatus("submitting");
        const savedSession = await loginWithCredentials(loginId, password);
        actions.setStatus("success");
        await navigateAfterLogin(savedSession);
      } catch (error) {
        actions.setStatus("error");
        actions.setError("login", error instanceof Error ? error.message : "로그인 처리 실패 상태");
      } finally {
        actions.patchLogin({ submitting: false });
      }
    },
    [actions, login.loginId, login.password],
  );

  return {
    errorMessage: errors.login,
    handleIdChange,
    handlePasswordChange,
    handleRememberChange,
    handleSubmit,
    isDisabled,
    login,
  };
};
