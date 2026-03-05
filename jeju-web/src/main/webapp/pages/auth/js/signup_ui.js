export const initUI = () => {
    console.log('[SignUp] UI Initialized');

    // -------------------------------------------------------------
    // 1. Step Navigation & Progress Bar Logic
    // -------------------------------------------------------------
    const steps = [
        document.getElementById('step1'),
        document.getElementById('step2'),
        document.getElementById('step3'),
        document.getElementById('step4')
    ];
    const circles = document.querySelectorAll('.step-circle');
    const progressBar = document.getElementById('progressBar');
    
    // UI Progress update
    const updateProgress = (stepIndex) => { // 1-based index
        const progressPercentages = { 1: '0%', 2: '33.3%', 3: '66.6%', 4: '100%' };
        progressBar.style.width = progressPercentages[stepIndex];

        circles.forEach(circle => {
            const circleStep = parseInt(circle.dataset.step);
            circle.classList.remove('active', 'completed');
            if (circleStep === stepIndex) {
                circle.classList.add('active');
            } else if (circleStep < stepIndex) {
                circle.classList.add('completed');
            }
            
            // Handle airplane icon logic
            if (circle.querySelector('.fa-plane')) {
                circle.querySelector('.fa-plane').remove();
            }
            if (circleStep === stepIndex) {
                circle.insertAdjacentHTML('afterbegin', '<i class="fa-solid fa-plane"></i>');
            }
        });
    };

    const goToStep = (stepIndex) => {
        const stepTitles = { 1: '약관동의', 2: '본인인증', 3: '정보입력', 4: '가입완료' };
        const titleEl = document.getElementById('stepTitle');
        
        if (titleEl) {
            titleEl.style.opacity = '0'; // Trigger fade out
            setTimeout(() => {
                titleEl.textContent = stepTitles[stepIndex] || '약관동의';
                titleEl.style.opacity = '1'; // Fade back in
            }, 150);
        }

        steps.forEach((step, idx) => {
            if (step) {
                if (idx + 1 === stepIndex) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }
            }
        });
        updateProgress(stepIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // -------------------------------------------------------------
    // 2. Step 1: Terms Agreement Logic
    // -------------------------------------------------------------
    const termAll = document.getElementById('termAll');
    const termItems = document.querySelectorAll('.term-item');
    const reqItems = document.querySelectorAll('.term-item.req');
    const btnNext1 = document.getElementById('btnNext1');

    if (termAll && termItems.length > 0) {
        termAll.addEventListener('change', (e) => {
            termItems.forEach(item => item.checked = e.target.checked);
            checkRequiredTerms();
        });

        termItems.forEach(item => {
            item.addEventListener('change', () => {
                const allChecked = Array.from(termItems).every(i => i.checked);
                termAll.checked = allChecked;
                checkRequiredTerms();
            });
        });
    }

    const checkRequiredTerms = () => {
        const allReqChecked = Array.from(reqItems).every(req => req.checked);
        if (btnNext1) {
            btnNext1.disabled = !allReqChecked;
        }
    };

    if (btnNext1) {
        btnNext1.addEventListener('click', () => {
            goToStep(2);
        });
    }

    // -------------------------------------------------------------
    // 3. Step 2: Kakao/Naver SDK Integration (Mocked for UI/UX)
    // -------------------------------------------------------------
    const btnKakao = document.getElementById('btnKakao');
    const btnNaver = document.getElementById('btnNaver');
    const verifiedGenderInput = document.getElementById('verifiedGender');
    const verifiedBirthDateInput = document.getElementById('verifiedBirthDate');
    const verifiedRrnBackFirstDigitInput = document.getElementById('verifiedRrnBackFirstDigit');
    const verifiedNameInput = document.getElementById('userName');
    const verifiedPhoneInput = document.getElementById('verifiedPhone');
    const userEmailInput = document.getElementById('userEmail');
    let verifiedProvider = '';

    const handleSocialLogin = (provider) => {
        console.log(`[SignUp] Initiating ${provider} Login...`);
        // Fake SDK delay
        setTimeout(() => {
            console.log(`[SignUp] ${provider} SDK Callback Success! Auto-navigating to Complete.`);
            // Skip Step 3, go directly to Step 4 (Complete)
            goToStep(4);
        }, 1500);
    };

    if (btnKakao) btnKakao.addEventListener('click', () => handleSocialLogin('Kakao'));
    if (btnNaver) btnNaver.addEventListener('click', () => handleSocialLogin('Naver'));


    // -------------------------------------------------------------
    // 4. Step 2: PASS Phone Auth Popup Logic
    // -------------------------------------------------------------
    const btnPass = document.getElementById('btnPass');

    if (btnPass) {
        btnPass.addEventListener('click', () => {
            const width = 430;
            const height = 800;
            const left = (window.screen.width / 2) - (width / 2);
            const top = (window.screen.height / 2) - (height / 2);
            
            // Open as a separate browser popup window
            window.open('pass_auth.html', 'PASS_Auth_Popup', 
                `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=no`
            );
        });
    }

    // Global callback for the popup to call when auth is complete
    window.handlePassSuccess = (name, phone, gender, birthDate, rrnBackFirstDigit) => {
        console.log('[SignUp] PASS Auth Success via Popup!', name, phone, gender, birthDate, rrnBackFirstDigit);

        verifiedProvider = 'PASS';

        if (verifiedNameInput) {
            verifiedNameInput.value = name || '';
            verifiedNameInput.setAttribute('readonly', true);
            verifiedNameInput.classList.add('readonly-input');
        }
        if (verifiedPhoneInput) {
            verifiedPhoneInput.value = phone || '';
            verifiedPhoneInput.setAttribute('readonly', true);
            verifiedPhoneInput.classList.add('readonly-input');
        }
        if (verifiedGenderInput) {
            verifiedGenderInput.value = gender || '';
        }
        if (verifiedBirthDateInput) {
            verifiedBirthDateInput.value = birthDate || '';
        }
        if (verifiedRrnBackFirstDigitInput) {
            verifiedRrnBackFirstDigitInput.value = rrnBackFirstDigit || '';
        }

        // Proceed to Info Input
        goToStep(3);
    };

    // -------------------------------------------------------------
    // 5. Step 3: Validation (ID Check & Password UI)
    // -------------------------------------------------------------
    const userIdInput = document.getElementById('userId');
    const btnCheckId = document.getElementById('btnCheckId');
    const feedbackId = document.getElementById('feedbackId');
    let isIdVerified = false;

    if (btnCheckId && userIdInput) {
        btnCheckId.addEventListener('click', async () => {
            const userId = userIdInput.value.trim();
            if (userId.length < 4) {
                feedbackId.textContent = "아이디는 4자 이상 입력해주세요.";
                feedbackId.style.color = "#ff4d4f";
                isIdVerified = false;
                return;
            }

            feedbackId.textContent = "확인 중...";
            feedbackId.style.color = "#333";
            
            // Dynamic import to use the API module
            const { checkIdAvailability } = await import('./signup_api.js');
            const isAvailable = await checkIdAvailability(userId);
            
            if (isAvailable) {
                feedbackId.textContent = "사용 가능한 아이디입니다.";
                feedbackId.style.color = "#52c41a";
                isIdVerified = true;
            } else {
                feedbackId.textContent = "이미 사용중인 아이디입니다.";
                feedbackId.style.color = "#ff4d4f";
                isIdVerified = false;
            }
        });

        // Reset verification if ID is changed
        userIdInput.addEventListener('input', () => {
            isIdVerified = false;
            feedbackId.textContent = "";
        });
    }

    // Password strength meter
    const passwordInput = document.getElementById('password');
    const pwContainer = document.getElementById('pwStrengthContainer');
    const pwMeter = pwContainer ? pwContainer.querySelector('.password-strength-meter') : null;
    const strengthText = document.getElementById('strengthText');
    const feedbackPw = document.getElementById('feedbackPw');
    
    // Minimum 8 chars, at least one letter and one number
    const baseRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]{8,}$/;
    // Has special character
    const specialRegex = /[!@#$%^&*()_\-+={}\[\]|;:'",.<>/?]/;

    let isPwValid = false;

    if (passwordInput && pwContainer) {
        passwordInput.addEventListener('input', () => {
            const val = passwordInput.value;
            
            if (val.length === 0) {
                pwContainer.style.display = 'none';
                feedbackPw.textContent = "";
                isPwValid = false;
                return;
            }
            
            pwContainer.style.display = 'flex';
            
            pwContainer.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

            if (!baseRegex.test(val)) {
                pwContainer.classList.add('strength-weak');
                strengthText.textContent = "불가";
                feedbackPw.textContent = "영문, 숫자 조합 8자 이상 필수";
                feedbackPw.style.color = "#ff4d4f";
                isPwValid = false;
            } else {
                if (specialRegex.test(val)) {
                    pwContainer.classList.add('strength-strong');
                    strengthText.textContent = "안전";
                    feedbackPw.textContent = "사용 가능한 안전한 비밀번호입니다.";
                    feedbackPw.style.color = "#52c41a";
                    isPwValid = true;
                } else {
                    pwContainer.classList.add('strength-medium');
                    strengthText.textContent = "보통";
                    feedbackPw.textContent = "사용 가능한 비밀번호입니다.";
                    feedbackPw.style.color = "#faad14";
                    isPwValid = true;
                }
            }
        });
    }

    // Password Confirm
    const passwordConfirmInput = document.getElementById('passwordConfirm');
    const feedbackPwConfirm = document.getElementById('feedbackPwConfirm');
    let isPwMatch = false;

    if (passwordConfirmInput && passwordInput) {
        passwordConfirmInput.addEventListener('input', () => {
            if (passwordConfirmInput.value === passwordInput.value) {
                feedbackPwConfirm.textContent = "비밀번호가 일치합니다.";
                feedbackPwConfirm.style.color = "#52c41a";
                isPwMatch = true;
            } else {
                feedbackPwConfirm.textContent = "비밀번호가 일치하지 않습니다.";
                feedbackPwConfirm.style.color = "#ff4d4f";
                isPwMatch = false;
            }
        });
    }

    // -------------------------------------------------------------
    // 6. Step 3: Form Submit -> Step 4
    // -------------------------------------------------------------
    const signupForm = document.getElementById('signup_form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!isIdVerified) {
                alert('Please complete ID duplication check');
                userIdInput.focus();
                return;
            }

            if (!isPwValid) {
                alert('Password does not satisfy required complexity');
                passwordInput.focus();
                return;
            }

            if (!isPwMatch) {
                alert('Password confirmation does not match');
                passwordConfirmInput.focus();
                return;
            }

            const cleanName = verifiedNameInput ? verifiedNameInput.value.trim() : '';
            const cleanPhone = verifiedPhoneInput ? verifiedPhoneInput.value.trim() : '';
            const cleanGender = verifiedGenderInput ? verifiedGenderInput.value.trim() : '';
            const cleanBirthDate = verifiedBirthDateInput ? verifiedBirthDateInput.value.trim() : '';
            const cleanRrnBackFirstDigit = verifiedRrnBackFirstDigitInput ? verifiedRrnBackFirstDigitInput.value.trim() : '';
            const cleanEmail = userEmailInput ? userEmailInput.value.trim() : '';
            const provider = verifiedProvider || 'PASS';

            if (!cleanName || !cleanPhone) {
                alert('Verified identity is missing. Complete PASS verification first');
                return;
            }

            if (!cleanGender || !cleanBirthDate || !cleanRrnBackFirstDigit) {
                alert('PASS 인증 데이터가 누락됨. 다시 인증 필요');
                return;
            }

            if (!/^\\d{2}-\\d{2}-\\d{2}$/.test(cleanBirthDate)) {
                alert('생년월일은 yy-mm-dd 형식만 허용');
                return;
            }

            if (!/^[1-8]$/.test(cleanRrnBackFirstDigit)) {
                alert('주민번호 뒷자리 첫 숫자는 1~8만 허용');
                return;
            }

            if (!cleanEmail) {
                alert('이메일 입력 필요');
                return;
            }

            const payload = {
                id: userIdInput.value.trim(),
                pw: passwordInput.value.trim(),
                name: cleanName,
                phone: cleanPhone,
                email: cleanEmail,
                birthDate: cleanBirthDate,
                rrnBackFirstDigit: cleanRrnBackFirstDigit,
                gender: cleanGender,
                provider
            };

            try {
                const { submitSignup } = await import('./signup_api.js');
                await submitSignup(payload);
                console.log('[SignUp] Signup API success. Going to Step 4.');
                goToStep(4);
            } catch (error) {
                console.error('[SignUp] Signup API failed', error);
                alert(error.message || 'Signup failed. Try again in a moment');
            }
        });
    }

};
