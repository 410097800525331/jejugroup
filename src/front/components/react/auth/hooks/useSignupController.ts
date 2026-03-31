import { useCallback, useMemo, type ChangeEvent, type ChangeEventHandler, type FormEventHandler } from "react";
import { openPassAuthPopup } from "@front-components/auth/services/passBridge";
import { checkSignupIdAvailability, submitSignupRequest } from "@front-components/auth/services/signupApi";
import { triggerSocialAuth } from "@front-components/auth/services/socialAuth";
import { useAuthActions, useAuthState } from "@front-components/auth/state/context";
import { getPasswordConfirmFeedback, getPasswordMeta } from "@front-components/auth/utils/password";

const ID_PATTERN = /^[A-Za-z0-9]{4,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useSignupController = () => {
  const { errors, signup } = useAuthState();
  const actions = useAuthActions();

  const requiredTermsChecked = useMemo(() => signup.terms.service && signup.terms.privacy, [signup.terms.privacy, signup.terms.service]);

  const allTermsChecked = useMemo(() => {
    return signup.terms.service && signup.terms.privacy && signup.terms.marketing;
  }, [signup.terms.marketing, signup.terms.privacy, signup.terms.service]);

  const canSubmit = useMemo(() => {
    const hasVerifiedPass =
      signup.identity.isVerified &&
      signup.identity.provider === "PASS" &&
      Boolean(signup.identity.birthDate) &&
      Boolean(signup.identity.rrnBackFirstDigit);
    const idChecked = signup.account.idCheckStatus === "success" && signup.account.idCheckedValue === signup.account.userId.trim();
    const passwordReady = signup.account.passwordStrength === "medium" || signup.account.passwordStrength === "strong";
    const passwordMatched = signup.account.passwordConfirmFeedback.tone === "success";
    const emailReady = EMAIL_PATTERN.test(signup.account.email.trim());

    return hasVerifiedPass && idChecked && passwordReady && passwordMatched && emailReady && !signup.account.submitting;
  }, [
    signup.account.email,
    signup.account.idCheckStatus,
    signup.account.idCheckedValue,
    signup.account.passwordConfirmFeedback.tone,
    signup.account.passwordStrength,
    signup.account.submitting,
    signup.account.userId,
    signup.identity.birthDate,
    signup.identity.isVerified,
    signup.identity.provider,
    signup.identity.rrnBackFirstDigit,
  ]);

  const updatePasswordMeta = useCallback(
    (password: string, passwordConfirm: string) => {
      const passwordMeta = getPasswordMeta(password);
      const passwordConfirmMeta = getPasswordConfirmFeedback(password, passwordConfirm);

      actions.patchSignupAccount({
        password,
        passwordConfirm,
        passwordConfirmFeedback: passwordConfirmMeta.feedback,
        passwordFeedback: passwordMeta.feedback,
        passwordStrength: passwordMeta.strength,
      });
    },
    [actions],
  );

  const handleToggleAllTerms = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      actions.patchSignupTerms({
        marketing: event.target.checked,
        privacy: event.target.checked,
        service: event.target.checked,
      });
    },
    [actions],
  );

  const handleToggleTerm = useCallback(
    (key: "marketing" | "privacy" | "service") =>
      (event: ChangeEvent<HTMLInputElement>) => {
        actions.patchSignupTerms({ [key]: event.target.checked });
      },
    [actions],
  );

  const goToVerificationStep = useCallback(() => {
    if (!requiredTermsChecked) {
      return;
    }

    actions.setSignupStep(2);
    actions.resetError("signup");
  }, [actions, requiredTermsChecked]);

  const handleOpenPassAuth = useCallback(() => {
    const popup = openPassAuthPopup();

    if (!popup) {
      actions.setError("signup", "팝업 차단 해제 필요 상태");
      actions.setStatus("error");
      return;
    }

    actions.setStatus("verifying");
    actions.setError("signup", "PASS 인증 완료 후 자동 이동 예정 상태");
  }, [actions]);

  const handleSocialSignup = useCallback(
    async (provider: "kakao" | "naver") => {
      actions.setStatus("verifying");
      actions.resetError("signup");
      const result = await triggerSocialAuth(provider);

      if (result.success && result.data) {
        actions.patchSignupIdentity({
          gender: result.data.gender,
          isVerified: true,
          name: result.data.name,
          phone: result.data.phone,
          provider: result.data.provider,
        });
        actions.completeSignup(result.data.name || "회원");
        actions.setStatus("success");
        return;
      }

      if (result.pending) {
        actions.setError("signup", "소셜 인증 팝업 진행 중 상태");
        return;
      }

      actions.setStatus("error");
      actions.setError("signup", result.message || "소셜 인증 실패 상태");
    },
    [actions],
  );

  const handleUserIdChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      actions.patchSignupAccount({
        idCheckedValue: "",
        idFeedback: {
          message: "",
          tone: "idle" as const,
        },
        idCheckStatus: "idle",
        userId: event.target.value,
      });
      actions.resetError("signup");
    },
    [actions],
  );

  const handleEmailChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      actions.patchSignupAccount({ email: event.target.value });
      actions.resetError("signup");
    },
    [actions],
  );

  const handlePasswordChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      updatePasswordMeta(event.target.value, signup.account.passwordConfirm);
      actions.resetError("signup");
    },
    [actions, signup.account.passwordConfirm, updatePasswordMeta],
  );

  const handlePasswordConfirmChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      updatePasswordMeta(signup.account.password, event.target.value);
      actions.resetError("signup");
    },
    [actions, signup.account.password, updatePasswordMeta],
  );

  const handleCheckId = useCallback(async () => {
    const userId = signup.account.userId.trim();

    if (!ID_PATTERN.test(userId)) {
      actions.patchSignupAccount({
        idCheckedValue: "",
        idFeedback: {
          message: "영문과 숫자 4자 이상 20자 이하 필요 상태",
          tone: "error" as const,
        },
        idCheckStatus: "error",
      });
      return;
    }

    actions.patchSignupAccount({
      idFeedback: {
        message: "확인 중 상태",
        tone: "info" as const,
      },
      idCheckStatus: "loading",
    });

    const result = await checkSignupIdAvailability(userId);
    actions.patchSignupAccount({
      idCheckedValue: result.available ? userId : "",
      idFeedback: {
        message: result.message,
        tone: result.available ? ("success" as const) : ("error" as const),
      },
      idCheckStatus: result.available ? "success" : "error",
    });
  }, [actions, signup.account.userId]);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();

      if (!signup.identity.isVerified || signup.identity.provider !== "PASS") {
        actions.setError("signup", "PASS 인증 완료 후 가입 진행 가능 상태");
        return;
      }

      if (!ID_PATTERN.test(signup.account.userId.trim())) {
        actions.setError("signup", "아이디 형식 재확인 필요 상태");
        return;
      }

      if (!EMAIL_PATTERN.test(signup.account.email.trim())) {
        actions.setError("signup", "이메일 형식 재확인 필요 상태");
        return;
      }

      if (!canSubmit) {
        actions.setError("signup", "입력값 점검 필요 상태");
        return;
      }

      try {
        actions.patchSignupAccount({ submitting: true });
        actions.resetError("signup");
        actions.setStatus("submitting");

        await submitSignupRequest({
          birthDate: signup.identity.birthDate,
          email: signup.account.email.trim(),
          gender: signup.identity.gender,
          id: signup.account.userId.trim(),
          name: signup.identity.name.trim(),
          phone: signup.identity.phone.trim(),
          provider: signup.identity.provider || "PASS",
          pw: signup.account.password.trim(),
          rrnBackFirstDigit: signup.identity.rrnBackFirstDigit,
        });

        actions.completeSignup(signup.identity.name || "회원");
        actions.setStatus("success");
      } catch (error) {
        actions.setStatus("error");
        actions.setError("signup", error instanceof Error ? error.message : "회원가입 처리 실패 상태");
      } finally {
        actions.patchSignupAccount({ submitting: false });
      }
    },
    [actions, canSubmit, signup.account.email, signup.account.password, signup.account.userId, signup.identity],
  );

  return {
    allTermsChecked,
    canSubmit,
    errorMessage: errors.signup,
    goToVerificationStep,
    handleCheckId,
    handleEmailChange,
    handleOpenPassAuth,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleSocialSignup,
    handleSubmit,
    handleToggleAllTerms,
    handleToggleTerm,
    handleUserIdChange,
    requiredTermsChecked,
    signup,
  };
};
