package com.jejugroup.jejuspring.mypage.web;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Set;

import jakarta.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.jejugroup.jejuspring.auth.model.SessionUser;
import com.jejugroup.jejuspring.mypage.application.MyPageDashboardFactory;

@Controller
public class MyPageController {
    private static final Set<String> SUPPORTED_SHELLS = Set.of("main", "stay", "air");

    private final MyPageDashboardFactory myPageDashboardFactory;

    public MyPageController(MyPageDashboardFactory myPageDashboardFactory) {
        this.myPageDashboardFactory = myPageDashboardFactory;
    }

    @GetMapping({ "/mypage/dashboard", "/pages/mypage/dashboard.html" })
    public String dashboard(
        @RequestParam(name = "shell", required = false) String shell,
        @RequestParam(name = "filter", required = false, defaultValue = "all") String filter,
        HttpSession session,
        Model model
    ) {
        String resolvedShell = normalizeShell(shell);
        Object sessionUser = session.getAttribute("user");

        if (!(sessionUser instanceof SessionUser user)) {
            return "redirect:%s".formatted(buildLoginRedirect(resolvedShell, filter));
        }

        model.addAttribute(
            "dashboard",
            myPageDashboardFactory.build(
                user,
                resolvedShell,
                filter,
                buildLoginRedirect(resolvedShell, filter)
            )
        );
        return "mypage/dashboard";
    }

    private String buildLoginRedirect(String shell, String filter) {
        String currentPath = "/pages/mypage/dashboard.html?shell=%s&filter=%s".formatted(shell, filter);
        return "/auth/login?shell=%s&redirect=%s".formatted(
            shell,
            URLEncoder.encode(currentPath, StandardCharsets.UTF_8)
        );
    }

    private String normalizeShell(String shell) {
        if (shell == null) {
            return "main";
        }

        String normalized = shell.trim().toLowerCase();
        return SUPPORTED_SHELLS.contains(normalized) ? normalized : "main";
    }
}
