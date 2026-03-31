package com.jejugroup.jejuspring.auth.view;

public record SignupPageView(
    String title,
    String shell,
    String verifyPath,
    String signupPath,
    String loginPath,
    String passAuthPath,
    String migrationPath,
    String defaultProvider
) {
}
