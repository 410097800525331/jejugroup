package com.jejugroup.jejuspring.mypage.web;

import java.sql.SQLException;
import java.util.Map;
import java.util.NoSuchElementException;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.mypage.application.MyPageDashboardRepository;
import com.jejugroup.jejuspring.mypage.application.MyPageProfileUpdateService;
import com.jejugroup.jejuspring.mypage.model.MyPageProfileUpdateRequest;

@RestController
@RequestMapping("/api/mypage")
public class MyPageApiController {
    private final MyPageDashboardRepository dashboardRepository;
    private final MyPageProfileUpdateService profileUpdateService;

    public MyPageApiController(
        MyPageDashboardRepository dashboardRepository,
        MyPageProfileUpdateService profileUpdateService
    ) {
        this.dashboardRepository = dashboardRepository;
        this.profileUpdateService = profileUpdateService;
    }

    @GetMapping(value = "/dashboard", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> dashboard(HttpSession session) {
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        try {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "dashboard", dashboardRepository.load(user.id())
            ));
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, "MyPage user not found");
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "마이페이지 대시보드를 불러오지 못했습니다.");
        }
    }

    @PutMapping(value = "/profile", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateProfile(@RequestBody MyPageProfileUpdateRequest request, HttpSession session) {
        Object sessionUser = session.getAttribute("user");
        if (!(sessionUser instanceof SessionUser user)) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        try {
            profileUpdateService.updateProfile(user.id(), request);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "프로필이 저장되었습니다."
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (MyPageProfileUpdateService.ProfileConflictException exception) {
            return json(HttpStatus.CONFLICT, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, "회원 정보를 찾을 수 없습니다.");
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "프로필을 저장하지 못했습니다.");
        }
    }

    private ResponseEntity<Map<String, Object>> json(HttpStatus status, boolean success, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "success", success,
            "message", message
        ));
    }
}
