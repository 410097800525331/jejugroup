import { StepHeader } from "@front-components/auth/StepHeader";
import { PassAuthSiteKeyLoader } from "@front-components/auth/passauth/PassAuthSiteKeyLoader";
import { PassIdentityStep } from "@front-components/auth/passauth/PassIdentityStep";
import { PassMethodStep } from "@front-components/auth/passauth/PassMethodStep";
import { PassNameStep } from "@front-components/auth/passauth/PassNameStep";
import { PASS_AUTH_STEP_ITEMS } from "@front-components/auth/passauth/data";
import { PassTelecomStep } from "@front-components/auth/passauth/PassTelecomStep";
import { PassWaitingStep } from "@front-components/auth/passauth/PassWaitingStep";
import { AuthProvider, useAuthState } from "@front-components/auth/state/context";

const getPassStepTitle = (step: number, shouldShowPhoneField: boolean, shouldShowRecaptcha: boolean) => {
  if (step === 1) {
    return "이용 중인 통신사를 선택해 주세요";
  }

  if (step === 2) {
    return "인증 방법을 선택해 주세요";
  }

  if (step === 3) {
    return "이름을 입력해 주세요";
  }

  if (!shouldShowPhoneField) {
    return "생년월일과 성별 숫자를 입력해 주세요";
  }

  if (!shouldShowRecaptcha) {
    return "휴대폰 번호를 입력해 주세요";
  }

  return "보안문자를 완료해 주세요";
};

const PassAuthContent = () => {
  const { passAuth } = useAuthState();
  const shouldShowPhoneField = passAuth.birthSix.length === 6 && /^[1-8]$/.test(passAuth.rrnDigit);
  const shouldShowRecaptcha = shouldShowPhoneField && passAuth.phone.replace(/\D/g, "").length === 11;

  return (
    <div className="pass-modal-content">
      <PassAuthSiteKeyLoader />
      <div className="pass-header">
        <div className="pass-logo-red">PASS</div>
        <div className="pass-header-text">
          인증부터 본인확인까지
          <br />
          일상으로 PASS
        </div>
      </div>

      <StepHeader
        accent="red"
        currentStep={passAuth.step}
        steps={PASS_AUTH_STEP_ITEMS}
        title={getPassStepTitle(passAuth.step, shouldShowPhoneField, shouldShowRecaptcha)}
      />

      {passAuth.step === 1 ? <PassTelecomStep /> : null}
      {passAuth.step === 2 ? <PassMethodStep /> : null}
      {passAuth.step === 3 ? <PassNameStep /> : null}
      {passAuth.step === 4 ? <PassIdentityStep /> : null}
      {passAuth.step === 5 ? <PassWaitingStep /> : null}

      <div className="pass-footer">
        이용약관 <strong>개인정보처리방침</strong>
        <br />
        VeriSign 256-bit SSL 암호화 적용 상태
      </div>
    </div>
  );
};

export const PassAuthApp = () => {
  return (
    <AuthProvider>
      <PassAuthContent />
    </AuthProvider>
  );
};
