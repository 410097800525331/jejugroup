package com.jejugroup.jejuspring.auth.view;

public record LoginPageView(
    String title,
    String shell,
    String loginPath,
    String sessionPath,
    String signupPath,
    String passAuthPath,
    String adminDashboardPath,
    String homePath,
    String migrationPath
) {
}
