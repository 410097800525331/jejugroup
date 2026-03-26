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

import com.jejugroup.jejuspring.auth.application.AuthService;
import com.jejugroup.jejuspring.auth.application.ActiveUserPresenceService;
import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.auth.model.SignupRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthApiController {
    private final AuthService authService;
    private final ActiveUserPresenceService activeUserPresenceService;

    public AuthApiController(AuthService authService, ActiveUserPresenceService activeUserPresenceService) {
        this.authService = authService;
        this.activeUserPresenceService = activeUserPresenceService;
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(
        @RequestParam("id") String id,
        @RequestParam("pw") String pw,
        HttpSession session
    ) {
        try {
            SessionUser user = authService.login(id, pw);
            if (user == null) {
                return json(HttpStatus.UNAUTHORIZED, false, "아이디 또는 비밀번호가 일치하지 않습니다.");
            }

            session.setAttribute("user", user);
            session.setMaxInactiveInterval(60 * 60 * 24 * 7);
            activeUserPresenceService.touch(session.getId(), user);
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
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            return json(HttpStatus.UNAUTHORIZED, false, "유효한 로그인 세션이 없습니다.");
        }

        activeUserPresenceService.touch(session.getId(), user);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "user", user
        ));
    }

    @PostMapping(value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> logout(HttpSession session) {
        activeUserPresenceService.clear(session.getId());
        session.invalidate();
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "로그아웃 완료"
        ));
    }

    @GetMapping(value = "/verify", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> verifySiteKey() {
        return ResponseEntity.ok(Map.of(
            "success", true,
            "siteKey", authService.resolveRecaptchaSiteKey()
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
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "Spring auth DB configuration is missing");
        }
    }

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> signup(@RequestParam Map<String, String> form) {
        try {
            authService.signup(new SignupRequest(
                form.get("phone"),
                form.get("name"),
                form.get("id"),
                form.get("pw"),
                form.get("provider"),
                form.get("email"),
                form.get("birthDate"),
                form.get("rrnBackFirstDigit")
            ));

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
        if (id == null || id.trim().isEmpty()) {
            return json(HttpStatus.BAD_REQUEST, false, "아이디를 입력해주세요.");
        }

        if (authService.checkIdExists(id.trim())) {
            return json(HttpStatus.CONFLICT, false, "이미 존재하는 아이디입니다.");
        }

        return json(HttpStatus.OK, true, "사용 가능한 아이디입니다.");
    }

    private ResponseEntity<?> handleCheckPhone(String phone) throws SQLException {
        if (phone == null || phone.trim().isEmpty()) {
            return json(HttpStatus.BAD_REQUEST, false, "휴대폰 번호를 입력해주세요.");
        }

        if (authService.checkPhoneExists(phone.trim())) {
            return json(HttpStatus.CONFLICT, false, "이미 해당 번호로 가입된 계정이 존재합니다.");
        }

        return json(HttpStatus.OK, true, "인증이 완료되었습니다. (Simulation)");
    }

    private ResponseEntity<?> handleVerifyRecaptcha(String token) {
        if (token == null || token.trim().isEmpty()) {
            return json(HttpStatus.BAD_REQUEST, false, "토큰이 누락되었습니다.");
        }

        if (authService.verifyRecaptcha(token.trim())) {
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
