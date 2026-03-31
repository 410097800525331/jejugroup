package com.jejugroup.jejuspring.mypage.web;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MyPageController {
    private static final Set<String> SUPPORTED_SHELLS = Set.of("main", "stay", "air");

    @GetMapping("/mypage/dashboard")
    public String dashboard(
        @RequestParam(name = "shell", required = false) String shell,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        String resolvedShell = normalizeShell(shell);
        String resolvedFilter = normalizeFilter(filter);
        String canonicalPath = "/pages/mypage/dashboard.html?shell=%s&filter=%s".formatted(
            URLEncoder.encode(resolvedShell, StandardCharsets.UTF_8),
            URLEncoder.encode(resolvedFilter, StandardCharsets.UTF_8)
        );
        return "redirect:%s".formatted(canonicalPath);
    }

    private String normalizeShell(String shell) {
        if (shell == null) {
            return "main";
        }

        String normalized = shell.trim().toLowerCase();
        return SUPPORTED_SHELLS.contains(normalized) ? normalized : "main";
    }

    private String normalizeFilter(String filter) {
        if (filter == null || filter.isBlank()) {
            return "all";
        }

        return filter.trim();
    }
}
