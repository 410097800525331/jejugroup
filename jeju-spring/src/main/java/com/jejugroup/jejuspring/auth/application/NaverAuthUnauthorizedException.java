package com.jejugroup.jejuspring.auth.application;

public class NaverAuthUnauthorizedException extends RuntimeException {
    public NaverAuthUnauthorizedException() {
        super("Naver login is not linked to an existing user");
    }
}
