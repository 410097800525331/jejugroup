import { useMemo } from "react";
import { AuthCard } from "@front-components/auth/AuthCard";
import { FormField } from "@front-components/auth/FormField";
import { useLoginController, getSavedLoginId } from "@front-components/auth/hooks/useLoginController";
import { AuthProvider } from "@front-components/auth/state/context";

const LoginContent = () => {
  const {
    errorMessage,
    handleIdChange,
    handleNaverLogin,
    handlePasswordChange,
    handleRememberChange,
    handleSubmit,
    isDisabled,
    login,
  } = useLoginController();

  return (
    <AuthCard>
      <div className="login-header">
        <h1 className="login-title">로그인</h1>
        <p className="login-desc">포인트 적립부터 운임 혜택까지 한 번에 이용하세요.</p>
      </div>

      <form className="login-form" id="user_form" onSubmit={handleSubmit}>
        <FormField
          autoComplete="username"
          id="id"
          label="이메일/아이디"
          onChange={handleIdChange}
          placeholder="아이디 또는 이메일을 입력해 주세요"
          value={login.loginId}
        />

        <FormField
          autoComplete="current-password"
          id="pw"
          label="비밀번호"
          onChange={handlePasswordChange}
          placeholder="비밀번호를 입력해 주세요"
          type="password"
          value={login.password}
        />

        <div className="error-wrapper" id="login-error-wrapper" style={{ display: errorMessage ? "block" : "none" }}>
          <p className="error-msg">{errorMessage}</p>
        </div>

        <div className="login_options">
          <label className="remember-me">
            <input checked={login.rememberId} id="saveId" onChange={handleRememberChange} type="checkbox" />
            <span>아이디 저장</span>
          </label>

          <div className="nav-links">
            <a href="#">아이디/비밀번호 찾기</a>
            <span className="divider">|</span>
            <a className="route-link" data-route="AUTH.SIGNUP" href="#">
              회원가입
            </a>
          </div>
        </div>

        <button className="login-btn btn" data-state={login.submitting ? "loading" : "idle"} disabled={isDisabled} type="submit">
          {login.submitting ? "로그인 중" : "로그인"}
        </button>

        <div className="quick_login">간편 로그인</div>

        <div className="sns_login">
          <button className="sns_btn naver" disabled={login.submitting} onClick={() => void handleNaverLogin()} type="button">
            <span aria-hidden="true">N</span>
            네이버로 로그인
          </button>
        </div>
      </form>
    </AuthCard>
  );
};

export const LoginApp = () => {
  const savedLoginId = useMemo(() => getSavedLoginId(), []);

  return (
    <AuthProvider savedLoginId={savedLoginId}>
      <LoginContent />
    </AuthProvider>
  );
};
