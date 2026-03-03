import { checkIdAvailability, triggerPassAuth, submitSignup } from './signup_api.js';
import { 
  getState, 
  updateTermsAction,
  setAccountDataAction
} from './signup_state.js';

// DOM Elements
const _dom = {
  form: document.getElementById('signup_form'),
  userId: document.getElementById('userId'),
  pw: document.getElementById('password'),
  pwConfirm: document.getElementById('passwordConfirm'),
  userName: document.getElementById('userName'),
  userEmail: document.getElementById('userEmail'),
  btnCheckId: document.getElementById('btnCheckId'),
  feedbackId: document.getElementById('feedbackId'),
  feedbackPw: document.getElementById('feedbackPw'),
  feedbackPwConfirm: document.getElementById('feedbackPwConfirm'),
  btnSignupSubmit: document.getElementById('btnSignupSubmit'),
  termAll: document.getElementById('termAll'),
  allTerms: document.querySelectorAll('.term-item'),
  reqTerms: document.querySelectorAll('.term-item.req'),
  btnAuthPass: document.querySelector('.auth-btn.pass'),
  authNotice: document.getElementById('authNotice'),
  authMessage: document.getElementById('authMessage'),
  verifiedName: document.getElementById('verifiedName'),
  verifiedPhone: document.getElementById('verifiedPhone'),
  verifiedGender: document.getElementById('verifiedGender')
};

// Validation Tracking Flags (O(1) Check)
const _validity = {
  isIdChecked: false,
  isPwValid: false,
  isPwMatch: false,
  isAuthDone: false,
  isTermsValid: false
};

export const initUI = () => {
  bindFormEvents();
};

const validateTotalForm = () => {
  // All essential flags must be true to enable submit
  const isReady = _validity.isIdChecked && 
                  _validity.isPwValid && 
                  _validity.isPwMatch && 
                  _validity.isTermsValid && 
                  (_dom.userName.value.trim() !== '' || _validity.isAuthDone) &&
                  _dom.userEmail.value.trim() !== '';

  // Button remains active but throws alert on click if invalid rules are bypassed natively
  // But visually we don't strictly disable it to let users know what they missed upon click
};

const bindFormEvents = () => {

  // 1. ID Check (Debounce implied / Click Triggered)
  _dom.btnCheckId.addEventListener('click', async () => {
    const val = _dom.userId.value.trim();
    if (val.length < 4) {
      _dom.feedbackId.textContent = '아이디는 4자 이상 입력해주세요.';
      _dom.feedbackId.className = 'input-feedback error';
      return;
    }
    const isAvail = await checkIdAvailability(val);
    if (isAvail) {
      _dom.feedbackId.textContent = '사용 가능한 아이디입니다.';
      _dom.feedbackId.className = 'input-feedback success';
      _validity.isIdChecked = true;
    } else {
      _dom.feedbackId.textContent = '이미 사용 중인 아이디입니다.';
      _dom.feedbackId.className = 'input-feedback error';
      _validity.isIdChecked = false;
    }
    validateTotalForm();
  });

  _dom.userId.addEventListener('input', () => {
    _validity.isIdChecked = false;
    _dom.feedbackId.textContent = '';
    validateTotalForm();
  });

  // 2. PW Check
  const checkPwComplexity = (password) => {
     const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
     return regex.test(password);
  };

  _dom.pw.addEventListener('input', () => {
    if (checkPwComplexity(_dom.pw.value)) {
      _dom.feedbackPw.textContent = '안전한 비밀번호입니다.';
      _dom.feedbackPw.className = 'input-feedback success';
      _validity.isPwValid = true;
    } else {
      _dom.feedbackPw.textContent = '영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.';
      _dom.feedbackPw.className = 'input-feedback error';
      _validity.isPwValid = false;
    }
    triggerPwConfirmCheck();
    validateTotalForm();
  });

  const triggerPwConfirmCheck = () => {
    if (_dom.pwConfirm.value === '') return;
    if (_dom.pw.value === _dom.pwConfirm.value) {
      _dom.feedbackPwConfirm.textContent = '비밀번호가 일치합니다.';
      _dom.feedbackPwConfirm.className = 'input-feedback success';
      _validity.isPwMatch = true;
    } else {
      _dom.feedbackPwConfirm.textContent = '비밀번호가 일치하지 않습니다.';
      _dom.feedbackPwConfirm.className = 'input-feedback error';
      _validity.isPwMatch = false;
    }
  };

  _dom.pwConfirm.addEventListener('input', () => {
    triggerPwConfirmCheck();
    validateTotalForm();
  });

  // 3. PASS Auth Mock
  if (_dom.btnAuthPass) {
    _dom.btnAuthPass.addEventListener('click', async () => {
      const result = await triggerPassAuth();
      if (result && result.success) {
        _dom.authNotice.classList.remove('hidden');
        _dom.authMessage.textContent = '본인인증이 완료되었습니다.';
        _dom.userName.value = result.data.name;
        _dom.userName.readOnly = true;
        
        _dom.verifiedName.value = result.data.name;
        _dom.verifiedPhone.value = result.data.phone;
        _dom.verifiedGender.value = result.data.gender;
        
        _validity.isAuthDone = true;
        validateTotalForm();
      }
    });
  }

  // 4. Terms Check
  const checkTermsValidity = () => {
    _validity.isTermsValid = Array.from(_dom.reqTerms).every(t => t.checked);
    validateTotalForm();
  };

  if (_dom.termAll) {
    _dom.termAll.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      _dom.allTerms.forEach(term => term.checked = isChecked);
      checkTermsValidity();
    });
  }

  _dom.allTerms.forEach(term => {
    term.addEventListener('change', () => {
      if (_dom.termAll) {
        _dom.termAll.checked = Array.from(_dom.allTerms).every(t => t.checked);
      }
      checkTermsValidity();
    });
  });

  // 5. Submit Event (O(1) Data Gathering)
  _dom.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!_validity.isIdChecked) return alert('아이디 중복확인을 진행해주세요.');
    if (!_validity.isPwValid) return alert('비밀번호가 보안 규칙에 맞지 않습니다.');
    if (!_validity.isPwMatch) return alert('비밀번호가 일치하지 않습니다.');
    if (!_validity.isTermsValid) return alert('필수 약관에 동의해주세요.');

    // Update state architecture centrally
    updateTermsAction({
      service: document.querySelector('input[name="termService"]').checked,
      privacy: document.querySelector('input[name="termPrivacy"]').checked,
      marketing: document.querySelector('input[name="termMarketing"]')?.checked || false,
    });

    setAccountDataAction({
      password: _dom.pw.value
    });

    const result = await submitSignup(getState());
    if (result.success) {
       alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
       
       // Handle dynamic redirect logic similarly to login for zero-monolith flow
       const urlParams = new URLSearchParams(window.location.search);
       const redirectUrl = urlParams.get('redirect');
       
       import('../../core/constants/routes.js').then(({ ROUTES }) => {
          if (redirectUrl && !redirectUrl.startsWith('javascript:')) {
            window.location.replace(`login.html?redirect=${encodeURIComponent(redirectUrl)}`);
          } else {
            window.location.replace('login.html');
          }
       });
    } else {
       alert('회원가입 처리 중 오류가 발생했습니다.');
    }
  });

};
