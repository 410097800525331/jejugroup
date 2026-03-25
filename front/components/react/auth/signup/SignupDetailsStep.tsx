import { FormField } from "@front-components/auth/FormField";
import { useSignupController } from "@front-components/auth/hooks/useSignupController";
import { StatusMessage } from "@front-components/auth/StatusMessage";

const getCheckButtonLabel = (status: string) => {
  if (status === "loading") {
    return "확인 중";
  }

  if (status === "success") {
    return "확인 완료";
  }

  return "중복확인";
};

export const SignupDetailsStep = () => {
  const {
    canSubmit,
    errorMessage,
    handleCheckId,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmChange,
    handleSubmit,
    handleUserIdChange,
    signup,
  } = useSignupController();

  return (
    <form className="step-panel active" onSubmit={handleSubmit}>
      <FormField
        id="userName"
        label="이름"
        onChange={() => undefined}
        placeholder=""
        readOnly
        value={signup.identity.name}
      />

      <FormField
        id="verifiedPhone"
        label="휴대전화번호"
        onChange={() => undefined}
        placeholder=""
        readOnly
        value={signup.identity.phone}
      />

      <FormField
        feedback={signup.account.idFeedback.message}
        feedbackTone={signup.account.idFeedback.tone}
        id="userId"
        label="아이디"
        onChange={handleUserIdChange}
        placeholder="영문과 숫자 4~20자"
        rightSlot={
          <button className="btn-secondary btn-verify" disabled={signup.account.idCheckStatus === "loading"} onClick={() => void handleCheckId()} type="button">
            {getCheckButtonLabel(signup.account.idCheckStatus)}
          </button>
        }
        value={signup.account.userId}
      />

      <FormField
        feedback={signup.account.passwordFeedback.message}
        feedbackTone={signup.account.passwordFeedback.tone}
        id="password"
        label="비밀번호"
        onChange={handlePasswordChange}
        placeholder="영문과 숫자 조합 8자 이상"
        type="password"
        value={signup.account.password}
      />

      {signup.account.passwordStrength !== "hidden" ? (
        <div className={`password-strength-container strength-${signup.account.passwordStrength}`}>
          <div className="password-strength-meter">
            <div className="meter-bar" id="meterBar1"></div>
            <div className="meter-bar" id="meterBar2"></div>
            <div className="meter-bar" id="meterBar3"></div>
          </div>
          <span className="strength-text" id="strengthText">
            {signup.account.passwordStrength === "strong" ? "안전" : signup.account.passwordStrength === "medium" ? "보통" : "불가"}
          </span>
        </div>
      ) : null}

      <FormField
        feedback={signup.account.passwordConfirmFeedback.message}
        feedbackTone={signup.account.passwordConfirmFeedback.tone}
        id="passwordConfirm"
        label="비밀번호 확인"
        onChange={handlePasswordConfirmChange}
        placeholder="비밀번호 다시 입력"
        type="password"
        value={signup.account.passwordConfirm}
      />

      <FormField
        id="userEmail"
        label="이메일"
        onChange={handleEmailChange}
        placeholder="example@email.com"
        type="email"
        value={signup.account.email}
      />

      {signup.identity.telecom ? (
        <div className="auth-summary-chip">
          PASS 인증 완료
          <span>{signup.identity.telecom}</span>
        </div>
      ) : null}

      <StatusMessage className="signup-submit-feedback" message={errorMessage} tone="error" />

      <div className="form-actions">
        <button className="btn-primary" disabled={!canSubmit} id="btnSignupSubmit" type="submit">
          {signup.account.submitting ? "가입 처리 중" : "가입 완료"}
        </button>
      </div>
    </form>
  );
};
