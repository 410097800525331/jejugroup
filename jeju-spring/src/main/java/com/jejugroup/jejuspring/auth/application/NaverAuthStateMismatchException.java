package com.jejugroup.jejuspring.auth.application;

public class NaverAuthStateMismatchException extends RuntimeException {
    public NaverAuthStateMismatchException() {
        super("Naver auth state mismatch");
    }
}
