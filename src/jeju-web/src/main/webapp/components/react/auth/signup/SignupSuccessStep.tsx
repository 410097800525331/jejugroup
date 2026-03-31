import { useAuthState } from "@front-components/auth/state/context";

export const SignupSuccessStep = () => {
  const { signup } = useAuthState();

  return (
    <div className="step-panel active">
      <div className="success-content">
        <i className="fa-solid fa-circle-check success-icon"></i>
        <h2 className="success-title">{signup.completedName || "회원"} 가입 완료 상태</h2>
        <p className="success-desc">제주그룹 계정 생성이 완료된 상태</p>
        <div className="form-actions">
          <a className="btn-primary route-link" data-route="AUTH.LOGIN" href="#">
            로그인 페이지로 이동
          </a>
        </div>
      </div>
    </div>
  );
};
