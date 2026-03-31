package com.jejugroup.jejuspring.auth.web;

import java.util.Set;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.UriComponentsBuilder;

@Controller
public class AuthPageController {
    private static final Set<String> SUPPORTED_SHELLS = Set.of("main", "stay", "air");

    @GetMapping({ "/auth/login", "/auth/signup", "/auth/pass" })
    public String authAlias(
        @RequestParam(name = "shell", required = false) String shell,
        @RequestParam(name = "redirect", required = false) String redirect,
        HttpServletRequest request
    ) {
        String resolvedShell = normalizeShell(shell);
        String targetPath = toFrontMirrorAuthPath(normalizeRequestPath(request));

        UriComponentsBuilder builder = UriComponentsBuilder.fromPath(targetPath)
            .queryParam("shell", resolvedShell);
        appendRedirect(builder, redirect);

        return "redirect:" + builder.build().encode().toUriString();
    }

    private String normalizeRequestPath(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String contextPath = request.getContextPath();
        if (contextPath != null && !contextPath.isBlank() && requestUri.startsWith(contextPath)) {
            return requestUri.substring(contextPath.length());
        }
        return requestUri;
    }

    private String toFrontMirrorAuthPath(String requestPath) {
        if ("/auth/login".equals(requestPath)) {
            return "/pages/auth/login.html";
        }

        if ("/auth/signup".equals(requestPath)) {
            return "/pages/auth/signup.html";
        }

        return "/pages/auth/pass_auth.html";
    }

    private void appendRedirect(UriComponentsBuilder builder, String redirect) {
        if (!isSafeRedirectTarget(redirect)) {
            return;
        }

        builder.queryParam("redirect", redirect);
    }

    private boolean isSafeRedirectTarget(String redirect) {
        if (redirect == null || redirect.isBlank()) {
            return false;
        }

        return redirect.startsWith("/") && !redirect.startsWith("//");
    }

    private String normalizeShell(String shell) {
        if (shell == null) {
            return "main";
        }

        String normalized = shell.trim().toLowerCase();
        return SUPPORTED_SHELLS.contains(normalized) ? normalized : "main";
    }
}
