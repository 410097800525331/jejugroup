import { useSignupController } from "@front-components/auth/hooks/useSignupController";
import { SIGNUP_TERM_ITEMS } from "@front-components/auth/signup/data";

export const SignupTermsStep = () => {
  const { allTermsChecked, goToVerificationStep, handleToggleAllTerms, handleToggleTerm, requiredTermsChecked, signup } =
    useSignupController();

  return (
    <div className="step-panel active">
      <div className="agree_box flat-agree-box">
        <div className="check-all-wrapper">
          <label className="custom-chk check-all">
            <input checked={allTermsChecked} className="hidden-chk" id="termAll" onChange={handleToggleAllTerms} type="checkbox" />
            <span className="chk-mark"></span>
            <span>전체 동의</span>
          </label>
          <div className="agree-desc">
            전체동의에는 필수와 선택 동의가 포함되고 개별 선택도 가능한 상태
            <br />
            선택 항목과 무관하게 정상 서비스 이용은 가능한 상태
          </div>
        </div>

        {SIGNUP_TERM_ITEMS.map((item) => (
          <div key={item.key}>
            <label className={`custom-chk ${item.required ? "" : "opt-chk"}`.trim()}>
              <input
                checked={signup.terms[item.key]}
                className="hidden-chk"
                onChange={handleToggleTerm(item.key)}
                type="checkbox"
              />
              <span className="chk-mark"></span>
              {item.label}
              <i className="fa-solid fa-chevron-right arrow-right"></i>
            </label>
            {item.description ? <div className="opt-desc">{item.description}</div> : null}
          </div>
        ))}
      </div>

      <div className="form-actions flat-actions">
        <button className="btn-flat" disabled={!requiredTermsChecked} onClick={goToVerificationStep} type="button">
          다음
        </button>
      </div>
    </div>
  );
};
