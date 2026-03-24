import { useCallback, useEffect, useMemo, useRef, type ChangeEventHandler } from "react";
import { notifySignupWindow, type PassAuthSuccessPayload } from "@front-components/auth/services/passBridge";
import { verifyRecaptchaToken, waitForPassAuthCompletion } from "@front-components/auth/services/passAuthApi";
import { useAuthActions, useAuthState } from "@front-components/auth/state/context";
import { deriveGenderFromRrnDigit, formatPhoneNumber, isValidBirthSix, isValidRrnDigit, toBirthDate, toDigitsOnly } from "@front-components/auth/utils/format";

export const usePassAuthController = () => {
  const { errors, passAuth } = useAuthState();
  const actions = useAuthActions();
  const rrnDigitInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const recaptchaWidgetIdRef = useRef<number | null>(null);
  const recaptchaHostRef = useRef<HTMLDivElement | null>(null);

  const hasBirthValue = useMemo(() => isValidBirthSix(passAuth.birthSix), [passAuth.birthSix]);
  const hasRrnValue = useMemo(() => isValidRrnDigit(passAuth.rrnDigit), [passAuth.rrnDigit]);
  const hasPhoneValue = useMemo(() => toDigitsOnly(passAuth.phone).length === 11, [passAuth.phone]);
  const shouldShowPhoneField = hasBirthValue && hasRrnValue;
  const shouldShowRecaptcha = shouldShowPhoneField && hasPhoneValue;
  const canSubmit = shouldShowRecaptcha && passAuth.recaptchaStatus === "success" && !passAuth.submitting;

  const stepTitle = useMemo(() => {
    if (passAuth.step === 1) {
      return "이용 중인 통신사를 선택해 주세요";
    }

    if (passAuth.step === 2) {
      return "인증 방법을 선택해 주세요";
    }

    if (passAuth.step === 3) {
      return "이름을 입력해 주세요";
    }

    if (!shouldShowPhoneField) {
      return "생년월일과 성별 숫자를 입력해 주세요";
    }

    if (!shouldShowRecaptcha) {
      return "휴대폰 번호를 입력해 주세요";
    }

    return "보안문자를 완료해 주세요";
  }, [passAuth.step, shouldShowPhoneField, shouldShowRecaptcha]);

  const resetRecaptchaState = useCallback(() => {
    if (recaptchaWidgetIdRef.current !== null && window.grecaptcha?.reset) {
      window.grecaptcha.reset(recaptchaWidgetIdRef.current);
    }

    actions.patchPassAuth({
      recaptchaStatus: "idle",
      recaptchaToken: "",
    });
    actions.resetError("passAuth");
  }, [actions]);

  useEffect(() => {
    if (!shouldShowRecaptcha || !passAuth.recaptchaSiteKey || recaptchaWidgetIdRef.current !== null) {
      return;
    }

    let intervalId = 0;
    let timeoutId = 0;
    let active = true;

    const bindRecaptcha = () => {
      if (!active || !recaptchaHostRef.current || !window.grecaptcha?.render) {
        return false;
      }

      recaptchaWidgetIdRef.current = window.grecaptcha.render(recaptchaHostRef.current, {
        callback: async (token) => {
          actions.patchPassAuth({
            recaptchaStatus: "loading",
            recaptchaToken: token,
          });
          actions.setStatus("verifying");
          const result = await verifyRecaptchaToken(token);

          if (result.success) {
            actions.patchPassAuth({ recaptchaStatus: "success" });
            actions.resetError("passAuth");
            actions.setStatus("verified");
            return;
          }

          actions.patchPassAuth({
            recaptchaStatus: "error",
            recaptchaToken: "",
          });
          actions.setError("passAuth", result.message);
          actions.setStatus("error");
          if (recaptchaWidgetIdRef.current !== null && window.grecaptcha?.reset) {
            window.grecaptcha.reset(recaptchaWidgetIdRef.current);
          }
        },
        sitekey: passAuth.recaptchaSiteKey,
      });

      return true;
    };

    if (!bindRecaptcha()) {
      intervalId = window.setInterval(() => {
        if (bindRecaptcha()) {
          window.clearInterval(intervalId);
        }
      }, 200);

      timeoutId = window.setTimeout(() => {
        window.clearInterval(intervalId);
      }, 4000);
    }

    return () => {
      active = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [actions, passAuth.recaptchaSiteKey, shouldShowRecaptcha]);

  const handleSelectTelecom = useCallback(
    (telecom: string) => {
      actions.patchPassAuth({ telecom });
      actions.setPassAuthStep(2);
      actions.resetError("passAuth");
    },
    [actions],
  );

  const handleSelectMethod = useCallback(
    (authMethod: "PASS" | "SMS") => {
      actions.patchPassAuth({ authMethod });
      actions.setPassAuthStep(3);
      actions.resetError("passAuth");
    },
    [actions],
  );

  const handleNameChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      actions.patchPassAuth({ name: event.target.value });
      actions.resetError("passAuth");
    },
    [actions],
  );

  const goToIdentityStep = useCallback(() => {
    if (!passAuth.name.trim()) {
      actions.setError("passAuth", "이름 입력 필요 상태");
      return;
    }

    actions.setPassAuthStep(4);
    actions.resetError("passAuth");
  }, [actions, passAuth.name]);

  const handleBirthChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const nextBirthSix = toDigitsOnly(event.target.value).slice(0, 6);
      actions.patchPassAuth({ birthSix: nextBirthSix });

      if (nextBirthSix.length === 6) {
        window.setTimeout(() => rrnDigitInputRef.current?.focus(), 0);
      }

      if (passAuth.recaptchaToken || passAuth.recaptchaStatus === "success") {
        resetRecaptchaState();
      }
    },
    [actions, passAuth.recaptchaStatus, passAuth.recaptchaToken, resetRecaptchaState],
  );

  const handleRrnChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const nextDigit = event.target.value.replace(/[^1-8]/g, "").slice(0, 1);
      actions.patchPassAuth({ rrnDigit: nextDigit });

      if (nextDigit.length === 1) {
        window.setTimeout(() => phoneInputRef.current?.focus(), 0);
      }

      if (passAuth.recaptchaToken || passAuth.recaptchaStatus === "success") {
        resetRecaptchaState();
      }
    },
    [actions, passAuth.recaptchaStatus, passAuth.recaptchaToken, resetRecaptchaState],
  );

  const handlePhoneChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      actions.patchPassAuth({ phone: formatPhoneNumber(event.target.value) });

      if (passAuth.recaptchaToken || passAuth.recaptchaStatus === "success") {
        resetRecaptchaState();
      }
    },
    [actions, passAuth.recaptchaStatus, passAuth.recaptchaToken, resetRecaptchaState],
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      actions.setError("passAuth", "입력값 또는 보안문자 확인 필요 상태");
      return;
    }

    const payload: PassAuthSuccessPayload = {
      authMethod: passAuth.authMethod,
      birthDate: toBirthDate(passAuth.birthSix),
      gender: deriveGenderFromRrnDigit(passAuth.rrnDigit),
      name: passAuth.name.trim(),
      phone: passAuth.phone.trim(),
      provider: "PASS",
      rrnBackFirstDigit: passAuth.rrnDigit,
      telecom: passAuth.telecom,
    };

    actions.setPassAuthStep(5);
    actions.patchPassAuth({ submitting: true });
    actions.resetError("passAuth");
    actions.setStatus("submitting");

    await waitForPassAuthCompletion();

    const delivered = notifySignupWindow(payload);
    if (!delivered) {
      actions.patchPassAuth({ submitting: false });
      actions.setPassAuthStep(4);
      actions.setStatus("error");
      actions.setError("passAuth", "회원가입 창 연결 실패 상태");
      return;
    }

    actions.setStatus("success");
    window.close();
  }, [actions, canSubmit, passAuth.authMethod, passAuth.birthSix, passAuth.name, passAuth.phone, passAuth.rrnDigit, passAuth.telecom]);

  return {
    canSubmit,
    errorMessage: errors.passAuth,
    handleBirthChange,
    handleNameChange,
    handlePhoneChange,
    handleRrnChange,
    handleSelectMethod,
    handleSelectTelecom,
    handleSubmit,
    goToIdentityStep,
    passAuth,
    phoneInputRef,
    recaptchaHostRef,
    rrnDigitInputRef,
    shouldShowPhoneField,
    shouldShowRecaptcha,
    stepTitle,
  };
};
