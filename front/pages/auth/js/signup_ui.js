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
    // 4. Step 2: PASS Phone Auth Mock UI Logic
    // -------------------------------------------------------------
    const btnPass = document.getElementById('btnPass');
    const passModal = document.getElementById('passModal');
    const passScreens = [
        document.getElementById('passScreen1'),
        document.getElementById('passScreen2'),
        document.getElementById('passScreen3'),
        document.getElementById('passScreen4'),
        document.getElementById('passScreen5')
    ];

    const showPassScreen = (screenIndex) => { // 1-based index
        passScreens.forEach((screen, idx) => {
            if (screen) {
                if (idx + 1 === screenIndex) {
                    screen.classList.add('active');
                } else {
                    screen.classList.remove('active');
                }
            }
        });
    };

    if (btnPass) {
        btnPass.addEventListener('click', () => {
            passModal.classList.remove('hidden');
            showPassScreen(1); // Start with Telecom Selection
        });
    }

    // PASS Screen 1 -> Screen 2 (Click any telecom)
    const telecomBtns = document.querySelectorAll('.telecom-btn');
    telecomBtns.forEach(btn => {
        btn.addEventListener('click', () => showPassScreen(2));
    });

    // PASS Screen 2 -> Screen 3 (Click SMS Auth)
    const btnSelectSms = document.getElementById('btnSelectSms');
    if (btnSelectSms) {
        btnSelectSms.addEventListener('click', () => showPassScreen(3));
    }

    // PASS Screen 3 -> Screen 4 (Name to Phone)
    const btnPassNextToPhone = document.getElementById('btnPassNextToPhone');
    if (btnPassNextToPhone) {
        btnPassNextToPhone.addEventListener('click', () => showPassScreen(4));
    }

    // PASS Screen 4 -> Screen 5 (Phone to App Wait)
    const btnPassSubmitAuth = document.getElementById('btnPassSubmitAuth');
    if (btnPassSubmitAuth) {
        btnPassSubmitAuth.addEventListener('click', () => showPassScreen(5));
    }

    // PASS Screen 5 -> Step 3 (Final Confirm with 3 sec delay)
    const btnPassFinalConfirm = document.getElementById('btnPassFinalConfirm');
    if (btnPassFinalConfirm) {
        btnPassFinalConfirm.addEventListener('click', (e) => {
            const btn = e.target;
            const originalText = btn.innerText;
            btn.innerHTML = '<div class="pass-loader" style="display:block; margin:0 auto; border-color: rgba(255,255,255,0.3); border-top-color:#fff; width:20px; height:20px;"></div>';
            btn.disabled = true;

            setTimeout(() => {
                // Success! Close Modal and populate Step 3
                passModal.classList.add('hidden');
                btn.innerHTML = originalText;
                btn.disabled = false;

                // Sync data to Step 3 inputs and lock them (Immutability for verified data)
                const passName = document.getElementById('passNameInput').value || '홍길동';
                const passPhone = document.getElementById('passPhoneInput').value || '01012345678';
                
                const step3Name = document.getElementById('userName');
                const step3Phone = document.getElementById('verifiedPhone');
                
                if (step3Name) {
                    step3Name.value = passName;
                    step3Name.setAttribute('readonly', true);
                    step3Name.classList.add('readonly-input');
                }
                if (step3Phone) {
                    step3Phone.value = passPhone;
                    step3Phone.setAttribute('readonly', true);
                    step3Phone.classList.add('readonly-input');
                }

                // Proceed to Info Input
                goToStep(3);
            }, 3000); // 3-second fake processing time
        });
    }

    // -------------------------------------------------------------
    // 5. Step 3: Form Submit -> Step 4
    // -------------------------------------------------------------
    const signupForm = document.getElementById('signup_form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('[SignUp] Form Verified and Submitted. Going to Step 4.');
            goToStep(4);
        });
    }

    // Close Modal on clicking outside of pass-modal-content for convenience
    if (passModal) {
        passModal.addEventListener('click', (e) => {
            if (e.target === passModal) passModal.classList.add('hidden');
        });
    }

};
