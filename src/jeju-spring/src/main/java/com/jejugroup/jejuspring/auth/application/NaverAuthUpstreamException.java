package com.jejugroup.jejuspring.auth.application;

public class NaverAuthUpstreamException extends RuntimeException {
    public NaverAuthUpstreamException() {
        super("Naver auth upstream failure");
    }
}
