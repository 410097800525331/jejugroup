package com.jejugroup.jejuspring.auth.application;

public class NaverAuthConfigurationException extends RuntimeException {
    public NaverAuthConfigurationException() {
        super("Naver auth configuration is missing");
    }
}
