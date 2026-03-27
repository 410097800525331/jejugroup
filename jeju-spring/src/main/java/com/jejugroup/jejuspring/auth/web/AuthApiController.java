package com.jejugroup.jejuspring.auth.web;

import java.sql.SQLException;
import java.util.Map;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.auth.application.AuthSessionService;
import com.jejugroup.jejuspring.auth.application.AuthSignupService;
import com.jejugroup.jejuspring.auth.application.AuthVerificationService;
import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.auth.model.SignupRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {
    private final AuthVerificationService authVerificationService;
    private final AuthSignupService authSignupService;
    private final AuthSessionService authSessionService;

    public AuthApiController(
        AuthVerificationService authVerificationService,
        AuthSignupService authSignupService,
        AuthSessionService authSessionService
    ) {
        this.authVerificationService = authVerificationService;
        this.authSignupService = authSignupService;
        this.authSessionService = authSessionService;
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(
        @RequestParam("id") String id,
        @RequestParam("pw") String pw,
        HttpSession session
    ) {
        try {
            SessionUser user = authSessionService.login(id, pw, session);
            if (user == null) {
                return json(HttpStatus.UNAUTHORIZED, false, "아이디 또는 비밀번호가 일치하지 않습니다.");
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "로그인 성공",
                "user", user
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Spring auth DB configuration is missing");
        }
    }

    @GetMapping(value = "/session", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> session(HttpSession session) {
        SessionUser user = authSessionService.resolveSessionUser(session);
        if (user == null) {
            return json(HttpStatus.UNAUTHORIZED, false, "유효한 로그인 세션이 없습니다.");
        }

        return ResponseEntity.ok(Map.of(
            "success", true,
            "user", user
        ));
    }

    @PostMapping(value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> logout(HttpSession session) {
        authSessionService.logout(session);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "로그아웃 완료"
        ));
    }

    @GetMapping(value = "/verify", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> verifySiteKey() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "siteKey", authVerificationService.resolveRecaptchaSiteKey()
        ));
    }

    @PostMapping(value = "/verify", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> verifyAction(
        @RequestParam("action") String action,
        @RequestParam Map<String, String> form
    ) {
        try {
            return switch (action) {
                case "checkId" -> handleCheckId(form.get("id"));
                case "checkPhone" -> handleCheckPhone(form.get("phone"));
                case "verifyRecaptcha" -> handleVerifyRecaptcha(form.get("token"));
                default -> json(HttpStatus.BAD_REQUEST, false, "잘못된 요청입니다.");
            };
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Spring auth DB configuration is missing");
        }
    }

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> signup(@RequestParam Map<String, String> form) {
        try {
            authSignupService.signup(SignupRequest.fromForm(form));

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Signup completed"
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (IllegalStateException exception) {
            return json(HttpStatus.CONFLICT, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Spring auth DB configuration is missing");
        }
    }

    private ResponseEntity<?> handleCheckId(String id) throws SQLException {
        if (authVerificationService.checkIdExists(id)) {
            return json(HttpStatus.CONFLICT, false, "이미 존재하는 아이디입니다.");
        }

        return json(HttpStatus.OK, true, "사용 가능한 아이디입니다.");
    }

    private ResponseEntity<?> handleCheckPhone(String phone) throws SQLException {
        if (authVerificationService.checkPhoneExists(phone)) {
            return json(HttpStatus.CONFLICT, false, "이미 해당 번호로 가입된 계정이 존재합니다.");
        }

        return json(HttpStatus.OK, true, "인증이 완료되었습니다. (Simulation)");
    }

    private ResponseEntity<?> handleVerifyRecaptcha(String token) {
        if (authVerificationService.verifyRecaptcha(token)) {
            return json(HttpStatus.OK, true, "reCAPTCHA 인증 성공");
        }

        return json(HttpStatus.BAD_REQUEST, false, "reCAPTCHA 인증 실패");
    }

    private ResponseEntity<Map<String, Object>> json(HttpStatus status, boolean success, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "success", success,
            "message", message
        ));
    }
}
