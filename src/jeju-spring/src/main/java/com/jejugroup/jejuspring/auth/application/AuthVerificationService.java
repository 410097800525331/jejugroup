package com.jejugroup.jejuspring.auth.application;

import java.sql.SQLException;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AuthVerificationService {
    private final AuthService authService;

    public AuthVerificationService(AuthService authService) {
        this.authService = authService;
    }

    public String resolveRecaptchaSiteKey() {
        return authService.resolveRecaptchaSiteKey();
    }

    public boolean checkIdExists(String id) throws SQLException {
        if (!StringUtils.hasText(id)) {
            throw new IllegalArgumentException("아이디를 입력해주세요.");
        }

        return authService.checkIdExists(id.trim());
    }

    public boolean checkPhoneExists(String phone) throws SQLException {
        if (!StringUtils.hasText(phone)) {
            throw new IllegalArgumentException("휴대폰 번호를 입력해주세요.");
        }

        return authService.checkPhoneExists(phone.trim());
    }

    public boolean verifyRecaptcha(String token) {
        if (!StringUtils.hasText(token)) {
            throw new IllegalArgumentException("토큰이 누락되었습니다.");
        }

        return authService.verifyRecaptcha(token.trim());
    }
}
