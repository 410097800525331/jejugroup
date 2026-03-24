package com.jejugroup.jejuspring.auth.web;

import java.util.Set;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.jejugroup.jejuspring.auth.view.LoginPageView;
import com.jejugroup.jejuspring.auth.view.PassAuthPageView;
import com.jejugroup.jejuspring.auth.view.SignupPageView;

@Controller
public class AuthPageController {
    private static final Set<String> SUPPORTED_SHELLS = Set.of("main", "stay", "air");

    @GetMapping({ "/auth/login", "/pages/auth/login.html" })
    public String loginPage(
        @RequestParam(name = "shell", required = false) String shell,
        Model model
    ) {
        String resolvedShell = normalizeShell(shell);
        model.addAttribute(
            "loginPage",
            new LoginPageView(
                "로그인 | JejuGroup Spring",
                resolvedShell,
                "/api/auth/login",
                "/api/auth/session",
                withShellQuery("/pages/auth/signup.html", resolvedShell),
                withShellQuery("/pages/auth/pass_auth.html", resolvedShell),
                "/admin/pages/dashboard.html",
                "/index.html",
                "/migration"
            )
        );
        return "auth/login";
    }

    @GetMapping({ "/auth/signup", "/pages/auth/signup.html" })
    public String signupPage(
        @RequestParam(name = "shell", required = false) String shell,
        Model model
    ) {
        String resolvedShell = normalizeShell(shell);
        model.addAttribute(
            "signupPage",
            new SignupPageView(
                "회원가입 | JejuGroup Spring",
                resolvedShell,
                "/api/auth/verify",
                "/api/auth/signup",
                withShellQuery("/pages/auth/login.html", resolvedShell),
                withShellQuery("/pages/auth/pass_auth.html", resolvedShell),
                "/migration",
                "PASS"
            )
        );
        return "auth/signup";
    }

    @GetMapping({ "/auth/pass", "/pages/auth/pass_auth.html" })
    public String passAuthPage(
        @RequestParam(name = "shell", required = false) String shell,
        Model model
    ) {
        String resolvedShell = normalizeShell(shell);
        model.addAttribute(
            "passAuthPage",
            new PassAuthPageView(
                "PASS 인증 | JejuGroup Spring",
                resolvedShell,
                "/api/auth/verify",
                withShellQuery("/pages/auth/login.html", resolvedShell),
                withShellQuery("/pages/auth/signup.html", resolvedShell),
                "/migration",
                "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            )
        );
        return "auth/pass-auth";
    }

    private String normalizeShell(String shell) {
        if (shell == null) {
            return "main";
        }

        String normalized = shell.trim().toLowerCase();
        return SUPPORTED_SHELLS.contains(normalized) ? normalized : "main";
    }

    private String withShellQuery(String path, String shell) {
        return "%s?shell=%s".formatted(path, shell);
    }
}
