import { checkIdAvailability, triggerPassAuth, triggerSocialAuth, submitSignup } from './signup_api.js';
import { 
  getState, 
  subscribe, 
  nextStepAction, 
  prevStepAction,
  jumpToStepAction,
  updateTermsAction,
  setAccountDataAction
} from './signup_state.js';

// DOM Elements
const _dom = {
  progressBar: document.getElementById('progressBar'),
  stepIndicator: document.getElementById('stepIndicator'),
  sliderTrack: document.getElementById('formSliderTrack'),
  btnBack: document.getElementById('btnBack'),
  stepTitle: document.getElementById('stepTitle'),
  stepDesc: document.getElementById('stepDesc'),
  panels: document.querySelectorAll('.step-panel'),
  dots: document.querySelectorAll('.step-dot'),
  lines: document.querySelectorAll('.step-line'),
};

const _stepText = {
  1: { title: '약관 동의', desc: '제주그룹 서비스 이용을 위한 약관에 동의해 주세요.' },
  2: { title: '본인 인증', desc: '안전한 서비스 이용을 위해 본인인증을 진행합니다.' },
  3: { title: '회원 정보', desc: '사용하실 아이디와 비밀번호를 입력해 주세요.' },
  4: { title: '가입 완료', desc: '' }
};

export const initUI = () => {
  subscribe(renderUI);
  bindNavigationEvents();
  bindStep1Events();
  bindStep2Events();
  bindStep3Events();
  bindStep4Events(); // Now Success Step
  renderUI(getState());
};

const renderUI = (state) => {
  const step = state.currentStep;
  const max = state.maxStep;
  
  // Progress Bar
  const progressPercent = ((step - 1) / (max - 1)) * 100;
  _dom.progressBar.style.width = `${progressPercent}%`;

  // Dots & Lines
  _dom.dots.forEach((dot, idx) => {
    const dotStep = idx + 1;
    dot.classList.toggle('active', dotStep === step);
    dot.classList.toggle('completed', dotStep < step);
  });

  _dom.lines.forEach((line, idx) => {
    line.classList.toggle('completed', idx < step - 1);
  });

  // Slider Transition
  const translateX = -(step - 1) * 25; // 25% per step (total width = 400%)
  _dom.sliderTrack.style.transform = `translateX(${translateX}%)`;

  _dom.panels.forEach((panel, idx) => {
    panel.classList.toggle('active-panel', idx + 1 === step);
  });

  // Header Texts
  if (step < 4) {
    _dom.stepTitle.textContent = _stepText[step].title;
    _dom.stepDesc.textContent = _stepText[step].desc;
  } else {
    // Hide header for Step 4
    _dom.stepTitle.parentElement.style.display = 'none';
    _dom.stepIndicator.style.display = 'none';
  }

  // Back Button
  _dom.btnBack.classList.toggle('hidden', step === 1 || step === 4);
};

const bindNavigationEvents = () => {
  _dom.btnBack.addEventListener('click', () => {
    prevStepAction();
  });
};

/* --- STEP 1: TERMS --- */
const bindStep1Events = () => {
  const form = document.getElementById('formStep1');
  const termAll = document.getElementById('termAll');
  const reqTerms = document.querySelectorAll('.term-item.req');
  const allTerms = document.querySelectorAll('.term-item');
  const btnNext1 = document.getElementById('btnNext1');

  termAll.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    allTerms.forEach(term => term.checked = isChecked);
    checkStep1Validity();
  });

  allTerms.forEach(term => {
    term.addEventListener('change', () => {
      termAll.checked = Array.from(allTerms).every(t => t.checked);
      checkStep1Validity();
    });
  });

  const checkStep1Validity = () => {
    const isValid = Array.from(reqTerms).every(t => t.checked);
    btnNext1.disabled = !isValid;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!btnNext1.disabled) {
      updateTermsAction({
        service: document.querySelector('input[name="termService"]').checked,
        privacy: document.querySelector('input[name="termPrivacy"]').checked,
        marketing: document.querySelector('input[name="termMarketing"]').checked,
      });
      nextStepAction();
    }
  });
};

/* --- STEP 2: VERIFICATION --- */
const bindStep2Events = () => {
  const form = document.getElementById('formStep2');
  const btns = document.querySelectorAll('.auth-btn');
  const notice = document.getElementById('authNotice');
  const btnNext2 = document.getElementById('btnNext2');

  btns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const method = btn.dataset.method;
      let result = null;
      if (method === 'pass') result = await triggerPassAuth();
      else result = await triggerSocialAuth(method);
      
      if (result && result.success) {
        notice.classList.remove('hidden');
        btns.forEach(b => b.style.display = 'none'); // Hide buttons after success
        document.getElementById('verifiedName').value = result.data.name;
        document.getElementById('verifiedPhone').value = result.data.phone;
        document.getElementById('verifiedGender').value = result.data.gender;
        btnNext2.disabled = false;
      }
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!btnNext2.disabled) {
      const state = getState();
      
      // If PASS, proceed to ID/PW setup (Step 3)
      if (state.verification.method === 'PASS') {
        nextStepAction();
      } else {
        // If Social, they don't need ID/PW, so final submit here
        const result = await submitSignup(state);
        if (result.success) {
          jumpToStepAction(4); // Skip to Success Screen
        } else {
          alert('회원가입 처리 중 오류가 발생했습니다.');
        }
      }
    }
  });
};

/* --- STEP 3: ACCOUNT INFO --- */
const bindStep3Events = () => {
  const form = document.getElementById('formStep3');
  const userId = document.getElementById('userId');
  const pw = document.getElementById('password');
  const pwConfirm = document.getElementById('passwordConfirm');
  const btnCheckId = document.getElementById('btnCheckId');
  const feedbackId = document.getElementById('feedbackId');
  const feedbackPw = document.getElementById('feedbackPw');
  const feedbackPwConfirm = document.getElementById('feedbackPwConfirm');
  const btnNext3 = document.getElementById('btnNext3');
  const emailInput = document.getElementById('email');

  let isIdChecked = false;

  btnCheckId.addEventListener('click', async () => {
    const val = userId.value.trim();
    if (val.length < 4) {
      feedbackId.textContent = '아이디는 4자 이상 입력해주세요.';
      feedbackId.className = 'input-feedback error';
      return;
    }
    const isAvail = await checkIdAvailability(val);
    if (isAvail) {
      feedbackId.textContent = '사용 가능한 아이디입니다.';
      feedbackId.className = 'input-feedback success';
      isIdChecked = true;
    } else {
      feedbackId.textContent = '이미 사용 중인 아이디입니다.';
      feedbackId.className = 'input-feedback error';
      isIdChecked = false;
    }
    validateStep3();
  });

  userId.addEventListener('input', () => {
    isIdChecked = false;
    feedbackId.textContent = '';
    validateStep3();
  });

  const checkPwComplexity = (password) => {
     const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
     return regex.test(password);
  };

  pw.addEventListener('input', () => {
    if (checkPwComplexity(pw.value)) {
      feedbackPw.textContent = '안전한 비밀번호입니다.';
      feedbackPw.className = 'input-feedback success';
    } else {
      feedbackPw.textContent = '영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.';
      feedbackPw.className = 'input-feedback error';
    }
    validateStep3();
  });

  pwConfirm.addEventListener('input', () => {
    if (pw.value === pwConfirm.value && pw.value !== '') {
      feedbackPwConfirm.textContent = '비밀번호가 일치합니다.';
      feedbackPwConfirm.className = 'input-feedback success';
    } else {
      feedbackPwConfirm.textContent = '비밀번호가 일치하지 않습니다.';
      feedbackPwConfirm.className = 'input-feedback error';
    }
    validateStep3();
  });

  const validateStep3 = () => {
    const isPwValid = checkPwComplexity(pw.value);
    const isMatch = pw.value === pwConfirm.value;
    btnNext3.disabled = !(isIdChecked && isPwValid && isMatch);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!btnNext3.disabled) {
      setAccountDataAction({
        password: pw.value
      });
      
      const latestState = getState();
      const result = await submitSignup(latestState);
      if (result.success) {
         nextStepAction(); // Go to Step 4 (Success)
      } else {
         alert('회원가입 처리 중 오류가 발생했습니다.');
      }
    }
  });
};

/* --- STEP 4: SUCCESS --- */
const bindStep4Events = () => {
    // Actions to bind on success tab, such as fireworks.
};
