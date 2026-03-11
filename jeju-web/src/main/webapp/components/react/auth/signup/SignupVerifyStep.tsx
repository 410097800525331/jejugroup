import { useSignupController } from "@front-components/auth/hooks/useSignupController";
import { StatusMessage } from "@front-components/auth/StatusMessage";

export const SignupVerifyStep = () => {
  const { errorMessage, handleOpenPassAuth, handleSocialSignup } = useSignupController();

  return (
    <div className="step-panel active">
      <div className="auth-methods">
        <button className="auth-btn kakao" onClick={() => void handleSocialSignup("kakao")} type="button">
          <i className="fa-solid fa-comment"></i>
          카카오로 간편 가입
        </button>
        <button className="auth-btn naver" onClick={() => void handleSocialSignup("naver")} type="button">
          <i className="fa-solid fa-n" style={{ fontWeight: 900 }}></i>
          네이버로 간편 가입
        </button>
        <button className="auth-btn pass" onClick={handleOpenPassAuth} type="button">
          <div className="pass-logo-text">PASS</div>
          휴대전화 본인 인증
        </button>
      </div>

      <p className="auth-method-note">실가입 데이터 연동은 PASS 경로 기준 상태</p>
      <StatusMessage className="auth-feedback" message={errorMessage} tone={errorMessage.includes("완료") ? "info" : "error"} />
    </div>
  );
};
