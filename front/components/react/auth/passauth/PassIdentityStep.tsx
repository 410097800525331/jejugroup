import { usePassAuthController } from "@front-components/auth/hooks/usePassAuthController";
import { StatusMessage } from "@front-components/auth/StatusMessage";

export const PassIdentityStep = () => {
  const {
    canSubmit,
    errorMessage,
    handleBirthChange,
    handlePhoneChange,
    handleRrnChange,
    handleSubmit,
    passAuth,
    phoneInputRef,
    recaptchaHostRef,
    rrnDigitInputRef,
    shouldShowPhoneField,
    shouldShowRecaptcha,
  } = usePassAuthController();

  return (
    <div className="pass-screen active">
      <div className="pass-input-group">
        <input className="readonly" id="passNameDisplay" readOnly type="text" value={passAuth.name} />
      </div>

      <div className="pass-reg-group">
        <input id="passRegNum1" maxLength={6} onChange={handleBirthChange} placeholder="생년월일 6자리" type="text" value={passAuth.birthSix} />
        <span className="dash">-</span>
        <input id="passRegNum2" maxLength={1} onChange={handleRrnChange} ref={rrnDigitInputRef} type="text" value={passAuth.rrnDigit} />
        <span className="dots">●●●●●●</span>
      </div>

      {shouldShowPhoneField ? (
        <div className="pass-input-group phone-input-group visible" id="phoneInputGroup">
          <input
            id="passPhoneInput"
            maxLength={13}
            onChange={handlePhoneChange}
            placeholder="휴대폰 번호"
            ref={phoneInputRef}
            type="text"
            value={passAuth.phone}
          />
        </div>
      ) : null}

      {shouldShowRecaptcha ? (
        <div className="captcha-wrapper visible" id="captchaWrapper">
          <div id="recaptchaContainer" ref={recaptchaHostRef}></div>
        </div>
      ) : null}

      {passAuth.recaptchaStatus === "success" ? (
        <div className="pass-inline-meta success">보안문자 확인 완료 상태</div>
      ) : null}

      <StatusMessage message={errorMessage} tone="error" />

      <button className="pass-next-btn" disabled={!canSubmit} id="btnPassSubmitAuth" onClick={() => void handleSubmit()} type="button">
        확인
      </button>
    </div>
  );
};
