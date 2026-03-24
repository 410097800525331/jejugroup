package com.jejugroup.jejuspring.auth.view;

public record PassAuthPageView(
    String title,
    String shell,
    String verifyPath,
    String loginPath,
    String signupPath,
    String migrationPath,
    String testRecaptchaSiteKey
) {
}
