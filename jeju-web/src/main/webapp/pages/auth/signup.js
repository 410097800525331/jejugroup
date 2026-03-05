/* ==================== 회원가입 폼 유효성 검사 및 기능 ==================== */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    
    // Inputs
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const loginIdInput = document.getElementById('loginId');
    const emailInput = document.getElementById('email');
    const emailAuthCodeInput = document.getElementById('emailAuthCode');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');
    const zipcodeInput = document.getElementById('zipcode');
    const address1Input = document.getElementById('address1');
    const address2Input = document.getElementById('address2');

    // Buttons & Wrappers
    const passAuthBtn = document.getElementById('passAuthBtn');
    const checkIdBtn = document.getElementById('checkIdBtn');
    const sendEmailAuthBtn = document.getElementById('sendEmailAuthBtn');
    const verifyEmailBtn = document.getElementById('verifyEmailBtn');
    const searchAddressBtn = document.getElementById('searchAddressBtn');
    const emailAuthCodeWrapper = document.getElementById('emailAuthCodeWrapper');

    // Checkboxes
    const agreeAll = document.getElementById('agreeAll');
    const termChks = document.querySelectorAll('.term-chk');
    const requiredChks = document.querySelectorAll('.required-chk');

    // Status Flags
    let isPhoneVerified = false;
    let isIdChecked = false;
    let isEmailVerified = false;

    /* ==================== 1. 휴대폰 PASS 인증 (MOCK) ==================== */
    if(passAuthBtn) {
        passAuthBtn.addEventListener('click', function() {
            const phoneVal = phoneInput.value.replace(/[^0-9]/g, '');
            const errorElem = document.getElementById('phoneError');
            const successElem = document.getElementById('phoneSuccess');

            if (phoneVal.length < 10) {
                errorElem.textContent = '올바른 휴대폰 번호를 입력해주세요.';
                successElem.textContent = '';
                return;
            }

            // MOCK API 통신 시뮬레이션
            setTimeout(() => {
                errorElem.textContent = '';
                successElem.textContent = '✓ 인증이 완료되었습니다.';
                isPhoneVerified = true;
                phoneInput.value = phoneVal; // 형식 정제
                phoneInput.readOnly = true;
                passAuthBtn.disabled = true;
                passAuthBtn.textContent = '인증 완료';
                passAuthBtn.style.color = '#fff';
                passAuthBtn.style.background = '#00cc00';
                passAuthBtn.style.borderColor = '#00cc00';
            }, 500);
        });

        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            isPhoneVerified = false;
            document.getElementById('phoneError').textContent = '';
            document.getElementById('phoneSuccess').textContent = '';
        });
    }

    /* ==================== 2. 아이디 중복 확인 ==================== */
    if(checkIdBtn) {
        checkIdBtn.addEventListener('click', function() {
            const loginId = loginIdInput.value.trim();
            const idError = document.getElementById('idError');
            const idSuccess = document.getElementById('idSuccess');

            if (loginId.length < 4 || loginId.length > 20) {
                idError.textContent = '아이디는 4~20자 사이여야 합니다.';
                idSuccess.textContent = '';
                return;
            }
            if (!/^[a-zA-Z0-9]+$/.test(loginId)) {
                idError.textContent = '아이디는 영문, 숫자만 가능합니다.';
                idSuccess.textContent = '';
                return;
            }

            import('../../core/config/api_config.js').then(({ API_BASE_URL }) => {
                fetch(`${API_BASE_URL}/api/auth/check-id?loginId=${encodeURIComponent(loginId)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.available !== false) { // Mock fallback handled
                            idError.textContent = '';
                            idSuccess.textContent = '✓ 사용 가능한 아이디입니다.';
                            isIdChecked = true;
                            loginIdInput.readOnly = true;
                            checkIdBtn.disabled = true;
                            checkIdBtn.textContent = '확인 완료';
                            checkIdBtn.style.background = '#00cc00';
                            checkIdBtn.style.borderColor = '#00cc00';
                            checkIdBtn.style.color = '#fff';
                        } else {
                            idError.textContent = data.message || '이미 사용중인 아이디입니다.';
                            idSuccess.textContent = '';
                            isIdChecked = false;
                        }
                    })
                    .catch(err => {
                        // Fallback for UI mock
                        idError.textContent = '';
                        idSuccess.textContent = '✓ 사용 가능한 아이디입니다. (Mock)';
                        isIdChecked = true;
                        loginIdInput.readOnly = true;
                        checkIdBtn.disabled = true;
                        checkIdBtn.textContent = '확인 완료';
                        checkIdBtn.style.background = '#00cc00';
                        checkIdBtn.style.borderColor = '#00cc00';
                        checkIdBtn.style.color = '#fff';
                    });
            });
        });

        loginIdInput.addEventListener('input', function() {
            isIdChecked = false;
            document.getElementById('idError').textContent = '';
            document.getElementById('idSuccess').textContent = '';
        });
    }

    /* ==================== 3. 이메일 인증 (MOCK) ==================== */
    if(sendEmailAuthBtn) {
        sendEmailAuthBtn.addEventListener('click', function() {
            const emailVal = emailInput.value.trim();
            const emailError = document.getElementById('emailError');
            const emailSuccess = document.getElementById('emailSuccess');
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailVal)) {
                emailError.textContent = '올바른 이메일 형식을 입력해주세요.';
                emailSuccess.textContent = '';
                return;
            }

            setTimeout(() => {
                emailError.textContent = '';
                emailSuccess.textContent = '✓ 인증메일이 발송되었습니다. (인증번호 입력)';
                emailAuthCodeWrapper.style.display = 'block';
                sendEmailAuthBtn.textContent = '재발송';
            }, 500);
        });

        verifyEmailBtn.addEventListener('click', function() {
            const codeVal = emailAuthCodeInput.value.trim();
            const emailError = document.getElementById('emailError');
            const emailSuccess = document.getElementById('emailSuccess');

            if (codeVal.length < 4) {
                emailError.textContent = '인증번호를 정확히 입력해주세요.';
                return;
            }

            setTimeout(() => {
                emailError.textContent = '';
                emailSuccess.textContent = '✓ 이메일 인증이 완료되었습니다.';
                isEmailVerified = true;
                emailInput.readOnly = true;
                emailAuthCodeInput.readOnly = true;
                verifyEmailBtn.disabled = true;
                sendEmailAuthBtn.disabled = true;
                verifyEmailBtn.style.background = '#00cc00';
                verifyEmailBtn.style.color = '#fff';
                verifyEmailBtn.style.borderColor = '#00cc00';
            }, 300);
        });

        emailInput.addEventListener('input', function() {
            isEmailVerified = false;
            document.getElementById('emailError').textContent = '';
            document.getElementById('emailSuccess').textContent = '';
            if (emailAuthCodeWrapper) {
                emailAuthCodeWrapper.style.display = 'none';
                emailAuthCodeInput.value = '';
            }
        });
    }

    /* ==================== 4. 다음 우편번호 서비스 연동 ==================== */
    if(searchAddressBtn) {
        searchAddressBtn.addEventListener('click', function() {
            if (typeof daum === 'undefined' || !daum.Postcode) {
                alert('주소 검색 API가 로드되지 않았습니다.');
                return;
            }
            new daum.Postcode({
                oncomplete: function(data) {
                    let addr = '';
                    if (data.userSelectedType === 'R') {
                        addr = data.roadAddress;
                    } else {
                        addr = data.jibunAddress;
                    }
                    zipcodeInput.value = data.zonecode;
                    address1Input.value = addr;
                    address2Input.focus();
                    if(document.getElementById('addressError')) {
                        document.getElementById('addressError').textContent = '';
                    }
                }
            }).open();
        });
    }

    /* ==================== 5. 비밀번호 강도 ==================== */
    if(passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthBar = document.getElementById('strengthBar');
            
            let strength = 0;
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            if (/[a-z]/.test(password)) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
            
            if(strengthBar) {
                strengthBar.className = 'strength-bar';
                if (strength <= 2) strengthBar.classList.add('weak');
                else if (strength <= 4) strengthBar.classList.add('medium');
                else strengthBar.classList.add('strong');
            }
        });

        passwordConfirmInput.addEventListener('input', function() {
            const errorElement = document.getElementById('passwordConfirmError');
            if(errorElement) {
                if (this.value !== passwordInput.value) {
                    errorElement.textContent = '비밀번호가 일치하지 않습니다.';
                } else {
                    errorElement.textContent = '';
                }
            }
        });
    }

    /* ==================== 6. 약관 동의 체크 ==================== */
    if(agreeAll) {
        agreeAll.addEventListener('change', function() {
            const isChecked = this.checked;
            termChks.forEach(chk => { chk.checked = isChecked; });
        });

        termChks.forEach(chk => {
            chk.addEventListener('change', function() {
                const allChecked = Array.from(termChks).every(c => c.checked);
                agreeAll.checked = allChecked;
            });
        });
    }

    /* ==================== 7. 폼 서밋 ==================== */
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!isPhoneVerified) {
                alert('휴대폰 PASS 인증을 진행해주세요.');
                phoneInput.focus();
                return;
            }

            const genderSelected = document.querySelector('input[name="gender"]:checked');
            if (!genderSelected) {
                document.getElementById('genderError').textContent = '성별을 선택해주세요.';
                return;
            }

            if (!isIdChecked) {
                alert('아이디 중복 확인을 해주세요.');
                loginIdInput.focus();
                return;
            }

            if (!isEmailVerified) {
                alert('이메일 인증을 완료해주세요.');
                emailInput.focus();
                return;
            }

            if (passwordInput.value !== passwordConfirmInput.value) {
                alert('비밀번호가 일치하지 않습니다.');
                passwordConfirmInput.focus();
                return;
            }

            if (!zipcodeInput.value || !address1Input.value || !address2Input.value.trim()) {
                document.getElementById('addressError').textContent = '주소를 상세히 입력해주세요.';
                address2Input.focus();
                return;
            }

            const missingRequired = Array.from(requiredChks).some(chk => !chk.checked);
            if (missingRequired) {
                alert('필수 약관에 동의해주세요.');
                return;
            }

            // Security & Submit
            import('../../core/utils/sanitizer.js').then(({ sanitizeHTML }) => {
                // DB Schema: phone, name, gender, id, pw, email, zipcode, address1, address2 
                // Optional: agree_marketing
                const cleanData = {
                    phone: sanitizeHTML(phoneInput.value),
                    name: sanitizeHTML(nameInput.value),
                    gender: sanitizeHTML(genderSelected.value),
                    id: sanitizeHTML(loginIdInput.value),
                    pw: sanitizeHTML(passwordInput.value), // Usually hashing here, but frontend MVP
                    email: sanitizeHTML(emailInput.value),
                    zipcode: sanitizeHTML(zipcodeInput.value),
                    address1: sanitizeHTML(address1Input.value),
                    address2: sanitizeHTML(address2Input.value),
                    agreeMarketing: document.getElementById('agreeMarketing').checked ? 'Y' : 'N'
                };

                import('../../core/config/api_config.js').then(({ API_BASE_URL }) => {
                    const params = new URLSearchParams();
                    for (const key in cleanData) params.append(key, cleanData[key]);

                    // Fallback catch mock bypass
                    fetch(`${API_BASE_URL}/api/auth/signup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: params
                    })
                    .then(res => {
                        if (!res.ok) throw new Error('API server error');
                        return res.json();
                    })
                    .then(data => {
                        showSuccessModal(cleanData.name);
                    })
                    .catch(err => {
                        console.log('Fall back to Mock UI success due to no backend response');
                        showSuccessModal(cleanData.name); // Mock display
                    });
                });
            }).catch(err => {
                console.error('Core util loader err:', err);
                showSuccessModal(nameInput.value); // Fallback Mock
            });
        });
    }

    function showSuccessModal(name) {
        const modal = document.getElementById('successModal');
        if(!modal) return;
        
        document.getElementById('welcomeName').textContent = name;
        modal.classList.add('active');

        let secondsLeft = 5;
        const countdownSeconds = document.getElementById('countdownSeconds');
        const countdownProgress = document.getElementById('countdownProgress');

        const interval = setInterval(() => {
            secondsLeft--;
            countdownSeconds.textContent = secondsLeft;
            countdownProgress.style.strokeDashoffset = 251.2 - (251.2 * (secondsLeft / 5));
            if (secondsLeft <= 0) {
                clearInterval(interval);
                import('../../core/constants/routes.js').then(({ ROUTES }) => {
                    import('../../core/utils/path_resolver.js').then(({ resolveRoute }) => {
                        const targetUrl = resolveRoute('AUTH.LOGIN');
                        if (window.__JEJU_ROUTE_NAVIGATOR__?.safeNavigate) {
                            window.__JEJU_ROUTE_NAVIGATOR__.safeNavigate(targetUrl, 'signup-success');
                            return;
                        }
                        window.location.replace(targetUrl);
                    }).catch(() => {
                        window.location.replace(ROUTES.AUTH.LOGIN);
                    });
                });
            }
        }, 1000);

        document.getElementById('goToLoginBtn').addEventListener('click', () => {
            clearInterval(interval);
        });
    }
});
