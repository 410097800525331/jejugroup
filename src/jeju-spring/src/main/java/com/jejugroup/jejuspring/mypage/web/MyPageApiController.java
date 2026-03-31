package com.jejugroup.jejuspring.mypage.web;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import jakarta.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.mypage.application.MyPageAvatarService;
import com.jejugroup.jejuspring.mypage.application.MyPageCompanionInviteService;
import com.jejugroup.jejuspring.mypage.application.MyPageDashboardRepository;
import com.jejugroup.jejuspring.mypage.application.MyPageMemberSearchService;
import com.jejugroup.jejuspring.mypage.application.MyPageProfileUpdateService;
import com.jejugroup.jejuspring.mypage.model.MyPageProfileUpdateRequest;

@RestController
@RequestMapping("/api/mypage")
public class MyPageApiController {
    private static final Logger log = LoggerFactory.getLogger(MyPageApiController.class);

    private final MyPageDashboardRepository dashboardRepository;
    private final MyPageProfileUpdateService profileUpdateService;
    private final MyPageAvatarService avatarService;
    private final MyPageMemberSearchService memberSearchService;
    private final MyPageCompanionInviteService companionInviteService;

    public MyPageApiController(
        MyPageDashboardRepository dashboardRepository,
        MyPageProfileUpdateService profileUpdateService,
        MyPageAvatarService avatarService,
        MyPageMemberSearchService memberSearchService,
        MyPageCompanionInviteService companionInviteService
    ) {
        this.dashboardRepository = dashboardRepository;
        this.profileUpdateService = profileUpdateService;
        this.avatarService = avatarService;
        this.memberSearchService = memberSearchService;
        this.companionInviteService = companionInviteService;
    }

    @GetMapping(value = "/dashboard", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> dashboard(HttpSession session) {
        SessionUser user = requireSessionUser(session);
        if (user == null) {
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
        SessionUser user = requireSessionUser(session);
        if (user == null) {
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

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadAvatar(@RequestPart("avatar") MultipartFile avatar, HttpSession session) {
        SessionUser user = requireSessionUser(session);
        if (user == null) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        try {
            String avatarUrl = avatarService.updateAvatar(user.id(), avatar);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "아바타가 저장되었습니다.",
                "avatarUrl", avatarUrl
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, "회원 정보를 찾을 수 없습니다.");
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "아바타를 저장하지 못했습니다.");
        } catch (IOException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "아바타를 저장하지 못했습니다.");
        }
    }

    @GetMapping(value = "/members/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> searchMembers(
        @RequestParam(name = "query", required = false) String query,
        @RequestParam(name = "q", required = false) String q,
        @RequestParam(name = "limit", required = false) Integer limit,
        HttpSession session
    ) {
        SessionUser user = requireSessionUser(session);
        if (user == null) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        try {
            List<MyPageMemberSearchService.MyPageMemberSearchItem> members = memberSearchService.searchMembers(
                firstText(query, q),
                limit,
                user.id()
            );
            return ResponseEntity.ok(Map.of(
                "success", true,
                "members", members
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (SQLException exception) {
            log.warn("회원 검색 SQL 실패. query='{}', q='{}', limit={}", query, q, limit, exception);
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "회원 검색 정보를 불러오지 못했습니다.");
        } catch (RuntimeException exception) {
            log.error("회원 검색 런타임 실패. query='{}', q='{}', limit={}", query, q, limit, exception);
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "회원 검색 정보를 불러오지 못했습니다.");
        }
    }

    @GetMapping(value = "/companion-invites", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> listCompanionInvites(HttpSession session) {
        SessionUser user = requireSessionUser(session);
        if (user == null) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        try {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "invites", companionInviteService.listInvites(user.id())
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "동행 초대 목록을 불러오지 못했습니다.");
        }
    }

    @PostMapping(value = "/companion-invites", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createCompanionInvite(@RequestBody CompanionInviteCreateRequest request, HttpSession session) {
        SessionUser user = requireSessionUser(session);
        if (user == null) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }
        if (request == null) {
            return json(HttpStatus.BAD_REQUEST, false, "대상 회원 아이디가 필요합니다.");
        }

        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "success", true,
                "invite", companionInviteService.createInvite(user.id(), request.targetUserId())
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (MyPageCompanionInviteService.InviteConflictException exception) {
            return json(HttpStatus.CONFLICT, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "동행 초대를 생성하지 못했습니다.");
        }
    }

    @PostMapping(value = "/companion-invites/{inviteId}/accept", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> acceptCompanionInvite(@PathVariable("inviteId") long inviteId, HttpSession session) {
        return respondToCompanionInvite(inviteId, session, InviteAction.ACCEPT);
    }

    @PostMapping(value = "/companion-invites/{inviteId}/reject", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> rejectCompanionInvite(@PathVariable("inviteId") long inviteId, HttpSession session) {
        return respondToCompanionInvite(inviteId, session, InviteAction.REJECT);
    }

    @PostMapping(value = "/companion-invites/{inviteId}/cancel", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> cancelCompanionInvite(@PathVariable("inviteId") long inviteId, HttpSession session) {
        return respondToCompanionInvite(inviteId, session, InviteAction.CANCEL);
    }

    @DeleteMapping(value = "/companion-links/{companionUserId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> unlinkCompanion(@PathVariable("companionUserId") String companionUserId, HttpSession session) {
        SessionUser user = requireSessionUser(session);
        if (user == null) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        try {
            MyPageCompanionInviteService.UnlinkResult result = companionInviteService.unlinkCompanion(user.id(), companionUserId);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "동행 연동을 해제했습니다.",
                "ownerUserId", result.ownerUserId(),
                "companionUserId", result.companionUserId(),
                "removedCount", result.removedCount()
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (MyPageCompanionInviteService.InviteConflictException exception) {
            return json(HttpStatus.CONFLICT, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "동행 연동을 해제하지 못했습니다.");
        }
    }

    @GetMapping("/avatar/{userId}/{fileName:.+}")
    public ResponseEntity<Resource> avatar(
        @PathVariable("userId") String userId,
        @PathVariable("fileName") String fileName
    ) {
        try {
            MyPageAvatarService.AvatarFile avatarFile = avatarService.loadAvatar(userId, fileName);
            return ResponseEntity.ok()
                .contentType(avatarFile.mediaType())
                .body(avatarFile.resource());
        } catch (NoSuchElementException exception) {
            return ResponseEntity.notFound().build();
        } catch (IOException exception) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
    }

    private SessionUser requireSessionUser(HttpSession session) {
        Object sessionUser = session.getAttribute("user");
        if (sessionUser instanceof SessionUser user) {
            return user;
        }

        return null;
    }

    private ResponseEntity<Map<String, Object>> json(HttpStatus status, boolean success, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "success", success,
            "message", message
        ));
    }

    private ResponseEntity<?> respondToCompanionInvite(long inviteId, HttpSession session, InviteAction action) {
        SessionUser user = requireSessionUser(session);
        if (user == null) {
            return json(HttpStatus.UNAUTHORIZED, false, "로그인이 필요합니다.");
        }

        try {
            MyPageCompanionInviteService.MyPageCompanionInviteItem invite = switch (action) {
                case ACCEPT -> companionInviteService.acceptInvite(inviteId, user.id());
                case REJECT -> companionInviteService.rejectInvite(inviteId, user.id());
                case CANCEL -> companionInviteService.cancelInvite(inviteId, user.id());
            };

            return ResponseEntity.ok(Map.of(
                "success", true,
                "invite", invite
            ));
        } catch (IllegalArgumentException exception) {
            return json(HttpStatus.BAD_REQUEST, false, exception.getMessage());
        } catch (MyPageCompanionInviteService.InviteAccessDeniedException exception) {
            return json(HttpStatus.FORBIDDEN, false, exception.getMessage());
        } catch (MyPageCompanionInviteService.InviteConflictException exception) {
            return json(HttpStatus.CONFLICT, false, exception.getMessage());
        } catch (NoSuchElementException exception) {
            return json(HttpStatus.NOT_FOUND, false, exception.getMessage());
        } catch (SQLException exception) {
            return json(HttpStatus.SERVICE_UNAVAILABLE, false, "동행 초대를 처리하지 못했습니다.");
        }
    }

    private String firstText(String primary, String fallback) {
        if (primary != null && !primary.isBlank()) {
            return primary;
        }

        return fallback;
    }

    private enum InviteAction {
        ACCEPT,
        REJECT,
        CANCEL
    }

    public record CompanionInviteCreateRequest(
        String targetUserId
    ) {
    }
}
