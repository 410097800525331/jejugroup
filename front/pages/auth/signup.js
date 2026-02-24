/* ==================== 회원가입 폼 유효성 검사 및 기능 ==================== */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password-confirm');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const verifyEmailBtn = document.getElementById('verifyEmailBtn');
    const verifyPhoneBtn = document.getElementById('verifyPhoneBtn');

    // 이메일 인증 상태
    let emailVerified = false;
    let phoneVerified = false;

    /* ==================== 비밀번호 강도 표시 ==================== */
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strengthBar = document.getElementById('strengthBar');
        
        // 강도 계산
        let strength = 0;
        
        // 길이 확인
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // 문자 종류 확인
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
        
        // 강도 표시
        strengthBar.classList.remove('weak', 'medium', 'strong');
        
        if (strength <= 2) {
            strengthBar.classList.add('weak');
        } else if (strength <= 4) {
            strengthBar.classList.add('medium');
        } else {
            strengthBar.classList.add('strong');
        }
        
        // 비밀번호 유효성 검사
        validatePassword();
    });

    /* ==================== 비밀번호 유효성 검사 ==================== */
    function validatePassword() {
        const password = passwordInput.value;
        const errorElement = document.getElementById('passwordError');
        
        const hasLength = password.length >= 8;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (password.length > 0 && (!hasLength || !hasLower || !hasNumber || !hasSpecial)) {
            errorElement.textContent = '8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.';
            return false;
        } else {
            errorElement.textContent = '';
            return true;
        }
    }

    /* ==================== 비밀번호 확인 검사 ==================== */
    passwordConfirmInput.addEventListener('input', function() {
        const errorElement = document.getElementById('passwordConfirmError');
        
        if (this.value !== passwordInput.value) {
            errorElement.textContent = '비밀번호가 일치하지 않습니다.';
        } else {
            errorElement.textContent = '';
        }
    });

    /* ==================== 이메일 형식 검사 ==================== */
    emailInput.addEventListener('input', function() {
        const errorElement = document.getElementById('emailError');
        const successElement = document.getElementById('emailSuccess');
        const email = this.value;
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email.length > 0 && !emailRegex.test(email)) {
            errorElement.textContent = '올바른 이메일 형식이 아닙니다.';
            successElement.textContent = '';
            emailVerified = false;
        } else {
            errorElement.textContent = '';
            emailVerified = false;
            successElement.textContent = '';
        }
    });

    /* ==================== 휴대폰 번호 형식 검사 ==================== */
    phoneInput.addEventListener('input', function() {
        const errorElement = document.getElementById('phoneError');
        const successElement = document.getElementById('phoneSuccess');
        let phone = this.value.replace(/\D/g, '');
        
        // 자동 포맷팅
        if (phone.length > 0) {
            if (phone.length <= 3) {
                this.value = phone;
            } else if (phone.length <= 7) {
                this.value = phone.slice(0, 3) + '-' + phone.slice(3);
            } else {
                this.value = phone.slice(0, 3) + '-' + phone.slice(3, 7) + '-' + phone.slice(7, 11);
            }
        }
        
        // 유효성 검사
        const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
        
        if (this.value.length > 0 && !phoneRegex.test(this.value)) {
            errorElement.textContent = '올바른 휴대폰 번호 형식이 아닙니다. (010-0000-0000)';
            successElement.textContent = '';
            phoneVerified = false;
        } else {
            errorElement.textContent = '';
            phoneVerified = false;
            successElement.textContent = '';
        }
    });

    /* ==================== 이메일 인증 버튼 ==================== */
    verifyEmailBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const email = emailInput.value;
        const errorElement = document.getElementById('emailError');
        const successElement = document.getElementById('emailSuccess');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            errorElement.textContent = '올바른 이메일 형식이 아닙니다.';
            successElement.textContent = '';
            return;
        }
        
        // 인증 시뮬레이션
        this.textContent = '인증 중...';
        this.disabled = true;
        
        setTimeout(() => {
            errorElement.textContent = '';
            successElement.textContent = '✓ 인증되었습니다.';
            emailVerified = true;
            this.textContent = '인증 완료';
            this.style.background = '#00cc00';
            this.style.color = '#fff';
            this.style.borderColor = '#00cc00';
        }, 1500);
    });

    /* ==================== 휴대폰 인증 버튼 ==================== */
    verifyPhoneBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const phone = phoneInput.value;
        const errorElement = document.getElementById('phoneError');
        const successElement = document.getElementById('phoneSuccess');
        
        const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
        
        if (!phoneRegex.test(phone)) {
            errorElement.textContent = '올바른 휴대폰 번호 형식이 아닙니다. (010-0000-0000)';
            successElement.textContent = '';
            return;
        }
        
        // 인증 시뮬레이션
        this.textContent = '인증 중...';
        this.disabled = true;
        
        setTimeout(() => {
            errorElement.textContent = '';
            successElement.textContent = '✓ 인증되었습니다.';
            phoneVerified = true;
            this.textContent = '인증 완료';
            this.style.background = '#00cc00';
            this.style.color = '#fff';
            this.style.borderColor = '#00cc00';
        }, 1500);
    });

    /* ==================== 이름 유효성 검사 ==================== */
    const nameInput = document.getElementById('name');
    nameInput.addEventListener('input', function() {
        const errorElement = document.getElementById('nameError');
        
        if (this.value.length > 0 && this.value.length < 2) {
            errorElement.textContent = '이름은 2자 이상이어야 합니다.';
        } else if (this.value.length > 50) {
            errorElement.textContent = '이름은 50자 이하여야 합니다.';
        } else {
            errorElement.textContent = '';
        }
    });

    /* ==================== 생년월일 유효성 검사 ==================== */
    const birthdateInput = document.getElementById('birthdate');
    birthdateInput.addEventListener('change', function() {
        const errorElement = document.getElementById('birthdateError');
        const birthDate = new Date(this.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 14) {
            errorElement.textContent = '14세 이상만 가입 가능합니다.';
        } else if (age > 150) {
            errorElement.textContent = '올바른 생년월일을 입력해주세요.';
        } else {
            errorElement.textContent = '';
        }
    });

    /* ==================== 약관 보기 버튼 ==================== */
    const termsViewBtns = document.querySelectorAll('.terms-view-btn');
    termsViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('약관 내용이 여기에 표시됩니다.\n\n실제 서비스에서는 모달 창으로 약관을 표시합니다.');
        });
    });

    /* ==================== 폼 제출 ==================== */
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 모든 필드 유효성 검사
        const name = document.getElementById('name').value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const password = passwordInput.value;
        const passwordConfirm = passwordConfirmInput.value;
        const birthdate = birthdateInput.value;
        const gender = document.querySelector('input[name="gender"]:checked');
        const agreeTerms = document.getElementById('agreeTerms').checked;
        const agreePrivacy = document.getElementById('agreePrivacy').checked;

        // 검증
        let errors = [];

        if (name.length < 2) {
            errors.push('이름을 올바르게 입력해주세요.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('이메일을 올바르게 입력해주세요.');
        }

        if (!emailVerified) {
            errors.push('이메일 인증을 완료해주세요.');
        }

        const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
        if (!phoneRegex.test(phone)) {
            errors.push('휴대폰 번호를 올바르게 입력해주세요.');
        }

        if (!phoneVerified) {
            errors.push('휴대폰 인증을 완료해주세요.');
        }

        if (password.length < 8) {
            errors.push('비밀번호는 8자 이상이어야 합니다.');
        }

        if (password !== passwordConfirm) {
            errors.push('비밀번호가 일치하지 않습니다.');
        }

        if (!birthdate) {
            errors.push('생년월일을 입력해주세요.');
        }

        if (!gender) {
            errors.push('성별을 선택해주세요.');
        }

        if (!agreeTerms || !agreePrivacy) {
            errors.push('필수 약관에 동의해주세요.');
        }

        // 에러가 있으면 표시
        if (errors.length > 0) {
            alert('다음 항목을 확인해주세요:\n\n' + errors.join('\n'));
            return;
        }

        // 모든 검증 통과 시 제출
        alert('회원가입이 완료되었습니다!\n\n환영합니다, ' + name + '님!');
        
        // 실제 서비스에서는 여기서 서버로 데이터를 전송합니다.
        // fetch('/api/signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         name, email, phone, password, birthdate, gender,
        //         agreeMarketing: document.getElementById('agreeMarketing').checked
        //     })
        // }).then(response => response.json())
        //   .then(data => { /* 처리 */ });

        // 폼 초기화
        form.reset();
        document.getElementById('strengthBar').classList.remove('weak', 'medium', 'strong');
    });

    /* ==================== 상단으로 이동 버튼 ==================== */
    const topBtn = document.getElementById('topBtn');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            topBtn.style.display = 'block';
        } else {
            topBtn.style.display = 'none';
        }
    });

    topBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
