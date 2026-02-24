/* ==================== 회원가입 폼 유효성 검사 및 기능 ==================== */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const loginIdInput = document.getElementById('loginId');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');
    const checkIdBtn = document.getElementById('checkIdBtn');

    // 상태 관리
    let isIdChecked = false;

    /* ==================== 아이디 중복 확인 ==================== */
    checkIdBtn.addEventListener('click', function() {
        const loginId = loginIdInput.value.trim();
        const idError = document.getElementById('idError');
        const idSuccess = document.getElementById('idSuccess');

        if (loginId.length < 4 || loginId.length > 20) {
            idError.textContent = '아이디는 4~20자 사이여야 합니다.';
            idSuccess.textContent = '';
            return;
        }

        import('../../core/config/api_config.js').then(({ API_BASE_URL }) => {
            fetch(`${API_BASE_URL}/api/auth/check-id?loginId=${encodeURIComponent(loginId)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.available) {
                        idError.textContent = '';
                        idSuccess.textContent = '✓ 사용 가능한 아이디입니다.';
                        isIdChecked = true;
                        loginIdInput.readOnly = true; // 확인 후 수정 불가하게 처리 (필요시 수정 버튼 추가 가능)
                        checkIdBtn.disabled = true;
                        checkIdBtn.textContent = '확인 완료';
                        checkIdBtn.style.background = '#00cc00';
                        checkIdBtn.style.borderColor = '#00cc00';
                        checkIdBtn.style.color = '#fff';
                    } else {
                        idError.textContent = data.message;
                        idSuccess.textContent = '';
                        isIdChecked = false;
                    }
                })
                .catch(err => {
                    console.error('ID Check Error:', err);
                    idError.textContent = '중복 확인 중 오류가 발생했습니다.';
                });
        });
    });

    // 아이디 입력 시 상태 초기화
    loginIdInput.addEventListener('input', function() {
        isIdChecked = false;
        document.getElementById('idError').textContent = '';
        document.getElementById('idSuccess').textContent = '';
    });

    /* ==================== 비밀번호 강도 표시 ==================== */
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
        
        strengthBar.className = 'strength-bar';
        if (strength <= 2) strengthBar.classList.add('weak');
        else if (strength <= 4) strengthBar.classList.add('medium');
        else strengthBar.classList.add('strong');
    });

    /* ==================== 비밀번호 확인 검사 ==================== */
    passwordConfirmInput.addEventListener('input', function() {
        const errorElement = document.getElementById('passwordConfirmError');
        if (this.value !== passwordInput.value) {
            errorElement.textContent = '비밀번호가 일치하지 않습니다.';
        } else {
            errorElement.textContent = '';
        }
    });

    /* ==================== 폼 제출 ==================== */
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!isIdChecked) {
            alert('아이디 중복 확인을 해주세요.');
            return;
        }

        const name = nameInput.value;
        const loginId = loginIdInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!agreeTerms) {
            alert('약관에 동의해주세요.');
            return;
        }

        // Security & Submit
        import('../../core/utils/sanitizer.js').then(({ validateParam, sanitizeHTML }) => {
            const cleanData = {
                name: sanitizeHTML(name),
                loginId: sanitizeHTML(loginId),
                email: sanitizeHTML(email),
                password: sanitizeHTML(password)
            };

            import('../../core/config/api_config.js').then(({ API_BASE_URL }) => {
                const params = new URLSearchParams();
                for (const key in cleanData) params.append(key, cleanData[key]);

                fetch(`${API_BASE_URL}/api/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: params
                })
                .then(res => {
                    if (!res.ok) return res.json().then(err => { throw new Error(err.message); });
                    return res.json();
                })
                .then(data => {
                    showSuccessModal(cleanData.name);
                })
                .catch(err => {
                    alert('회원가입 실패: ' + err.message);
                });
            });
        });
    });

    function showSuccessModal(name) {
        const modal = document.getElementById('successModal');
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
                window.location.replace('./login.html');
            }
        }, 1000);

        document.getElementById('goToLoginBtn').addEventListener('click', () => {
            clearInterval(interval);
            window.location.replace('./login.html');
        });
    }
});
